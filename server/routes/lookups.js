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
    // Check if account is verified by Admin - must be verified before lookup
    if (!req.user.is_verified) {
      return res.status(403).json({
        error: 'REQUIRE_VERIFY',
        message: 'Tài khoản của bạn đang chờ Quản trị viên (Admin) xác thực và kích hoạt. Vui lòng liên hệ Admin qua Zalo/Hotline 0762294134 để được kích hoạt tài khoản trước khi tra cứu.'
      });
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
