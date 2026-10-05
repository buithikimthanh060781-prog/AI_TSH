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
  const { fullName, birthDate, noHistory } = req.body;
  if (!fullName || !birthDate) {
    return res.status(400).json({ error: 'MISSING_DATA', message: 'Thiếu họ tên hoặc ngày sinh.' });
  }

  const ip = getClientIp(req);
  const isAdmin = !!(req.admin || (req.user && (req.user.email === 'admin' || req.user.phone === 'admin')));
  const userId = req.user ? req.user.id : null;

  if (req.user) {
    // Check if account is verified by Admin - must be verified before lookup
    if (!req.user.is_verified && !isAdmin) {
      return res.status(403).json({
        error: 'REQUIRE_VERIFY',
        message: 'Tài khoản của bạn đang chờ Quản trị viên (Admin) xác thực và kích hoạt. Vui lòng liên hệ Admin qua Zalo/Hotline 0762294134 để được kích hoạt tài khoản trước khi tra cứu.'
      });
    }

    // Save lookup record only if user did not request private/noHistory mode
    if (!noHistory) {
      const insertStmt = db.prepare(`
        INSERT INTO lookups (user_id, full_name, birth_date, ip)
        VALUES (?, ?, ?, ?)
      `);
      insertStmt.run(userId, fullName.trim(), birthDate, ip);
    }
  } else {
    // Optional record for anonymous (skip if noHistory is requested)
    if (!noHistory) {
      const insertStmt = db.prepare(`
        INSERT INTO lookups (user_id, full_name, birth_date, ip)
        VALUES (NULL, ?, ?, ?)
      `);
      insertStmt.run(fullName.trim(), birthDate, ip);
    }
  }

  res.json({ success: true });
});

// DELETE /api/lookups/:id - Xóa 1 bản ghi tra cứu cụ thể (Quyền riêng tư dữ liệu cá nhân)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const lookupId = parseInt(req.params.id, 10);
    if (!lookupId) {
      return res.status(400).json({ error: 'INVALID_ID', message: 'ID tra cứu không hợp lệ.' });
    }
    const stmt = db.prepare('DELETE FROM lookups WHERE id = ? AND user_id = ?');
    stmt.run(lookupId, req.user.id);
    res.json({ success: true, message: 'Đã xóa bản ghi tra cứu thành công.' });
  } catch (err) {
    console.error('Error deleting lookup record:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Không thể xóa bản ghi tra cứu.' });
  }
});

// DELETE /api/lookups - Xóa toàn bộ lịch sử tra cứu của người dùng (Quyền được lãng quên / Xóa dữ liệu)
router.delete('/', requireAuth, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM lookups WHERE user_id = ?');
    stmt.run(req.user.id);
    res.json({ success: true, message: 'Đã xóa sạch toàn bộ lịch sử tra cứu thành công.' });
  } catch (err) {
    console.error('Error clearing lookups:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Không thể xóa lịch sử tra cứu.' });
  }
});

module.exports = router;
