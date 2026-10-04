const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { getClientIp, requireAuth } = require('../lib/session');

// GET /api/lookups - Lịch sử tra cứu gần nhất (tối đa 50)
router.get('/', requireAuth, (req, res) => {
  const stmt = db.prepare(`
    SELECT id, full_name, birth_date, created_at
    FROM lookups
    WHERE user_id = ?
    ORDER BY id DESC
    LIMIT 50
  `);
  const history = stmt.all(req.user.id);
  res.json({ success: true, history });
});

// POST /api/lookups - Ghi nhận lượt tra cứu và kiểm tra hạn ngạch xác thực email
router.post('/', (req, res) => {
  const { fullName, birthDate } = req.body;
  if (!fullName || !birthDate) {
    return res.status(400).json({ error: 'MISSING_DATA', message: 'Thiếu họ tên hoặc ngày sinh.' });
  }

  const ip = getClientIp(req);
  const userId = req.user ? req.user.id : null;

  if (req.user) {
    // Check if account is verified
    if (!req.user.is_verified) {
      const countStmt = db.prepare('SELECT COUNT(*) as cnt FROM lookups WHERE user_id = ?');
      const countRow = countStmt.get(req.user.id);
      const count = countRow ? countRow.cnt : 0;
      if (count >= 1) {
        return res.status(403).json({
          error: 'REQUIRE_VERIFY',
          message: 'Tài khoản của bạn chưa xác thực email và đã sử dụng hết lượt tra cứu miễn phí duy nhất. Vui lòng kiểm tra email để kích hoạt tài khoản hoặc yêu cầu gửi lại link xác thực.'
        });
      }
    }

    // Save lookup record
    const insertStmt = db.prepare(`
      INSERT INTO lookups (user_id, full_name, birth_date, ip)
      VALUES (?, ?, ?, ?)
    `);
    insertStmt.run(userId, fullName.trim(), birthDate, ip);
  } else {
    // Optional record for anonymous
    const insertStmt = db.prepare(`
      INSERT INTO lookups (user_id, full_name, birth_date, ip)
      VALUES (NULL, ?, ?, ?)
    `);
    insertStmt.run(fullName.trim(), birthDate, ip);
  }

  res.json({ success: true });
});

module.exports = router;
