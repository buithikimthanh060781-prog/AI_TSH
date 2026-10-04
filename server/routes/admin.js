const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { 
  ADMIN_COOKIE_NAME, 
  createAdminSession, 
  deleteAdminSession, 
  requireAdmin 
} = require('../lib/adminSession');
const { removeDeviceSessions } = require('../lib/session');

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123456';

  if (!username || !password || username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'INVALID_ADMIN', message: 'Tên đăng nhập hoặc mật khẩu quản trị không đúng.' });
  }

  const { sessionId } = createAdminSession(username);
  res.cookie(ADMIN_COOKIE_NAME, sessionId, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  // Đồng thời cấp phiên thành viên VIP cho Admin để có thể tra cứu ngay trên trang chủ
  try {
    const bcrypt = require('bcryptjs');
    let adminRow = db.prepare("SELECT * FROM users WHERE email = 'admin' OR phone = 'admin'").get();
    if (!adminRow) {
      const hash = bcrypt.hashSync(adminPass, 10);
      const ins = db.prepare("INSERT INTO users (email, phone, password_hash, is_verified, plan_expires, note) VALUES ('admin', 'admin', ?, 1, 'unlimited', 'Tài khoản Quản trị viên')").run(hash);
      adminRow = db.prepare("SELECT * FROM users WHERE id = ?").get(ins.lastInsertRowid);
    }
    const { createSession, getClientIp, SESSION_COOKIE_NAME, SESSION_DURATION_DAYS } = require('../lib/session');
    const ip = getClientIp(req);
    const sessionRes = createSession(adminRow.id, req.deviceId, ip, req.headers['user-agent'], true);
    if (!sessionRes.error) {
      res.cookie(SESSION_COOKIE_NAME, sessionRes.sessionId, {
        maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }
  } catch (e) {}

  res.json({ success: true, message: 'Đăng nhập quản trị thành công!' });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  if (req.adminSessionId) {
    deleteAdminSession(req.adminSessionId);
  }
  try {
    const { deleteSession, SESSION_COOKIE_NAME } = require('../lib/session');
    if (req.sessionId) {
      deleteSession(req.sessionId);
    }
    res.clearCookie(SESSION_COOKIE_NAME);
  } catch (e) {}
  res.clearCookie(ADMIN_COOKIE_NAME);
  res.json({ success: true, message: 'Đã đăng xuất quản trị.' });
});

// GET /api/admin/me
router.get('/me', requireAdmin, (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// GET /api/admin/users
router.get('/users', requireAdmin, (req, res) => {
  try {
    const { q, status } = req.query;
    let sql = `
      SELECT 
        u.id, u.email, u.phone, u.full_name, u.note, u.is_verified, u.plan_expires, u.created_at,
        MAX(s.created_at) as last_login,
        COUNT(DISTINCT s.device_id) as active_devices
      FROM users u
      LEFT JOIN sessions s ON u.id = s.user_id AND s.expires_at > datetime('now')
    `;
    const params = [];
    const whereClauses = [];

    if (q && q.trim()) {
      whereClauses.push(`(u.email LIKE ? OR u.phone LIKE ? OR u.full_name LIKE ?)`);
      params.push(`%${q.trim()}%`, `%${q.trim()}%`, `%${q.trim()}%`);
    }

    if (status === 'pending') {
      whereClauses.push(`u.is_verified = 0`);
    } else if (status === 'verified') {
      whereClauses.push(`u.is_verified = 1`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ` + whereClauses.join(' AND ');
    }

    sql += ` GROUP BY u.id ORDER BY u.id DESC`;

    const users = db.prepare(sql).all(...params);

    // Thống kê tổng số lượng người dùng
    const statsRow = db.prepare(`
      SELECT 
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END), 0) as verified,
        COALESCE(SUM(CASE WHEN is_verified = 0 THEN 1 ELSE 0 END), 0) as pending
      FROM users
    `).get();

    // Check suspicious flag for each user: 2 devices with different IPs within 6 hours
    const suspiciousStmt = db.prepare(`
      SELECT s1.user_id 
      FROM sessions s1
      JOIN sessions s2 ON s1.user_id = s2.user_id 
        AND s1.device_id != s2.device_id 
        AND s1.ip != s2.ip
        AND ABS(strftime('%s', s1.created_at) - strftime('%s', s2.created_at)) <= 21600
      WHERE s1.expires_at > datetime('now') AND s2.expires_at > datetime('now')
      GROUP BY s1.user_id
    `);
    const suspiciousRows = suspiciousStmt.all();
    const suspiciousUserIds = new Set(suspiciousRows.map(r => r.user_id));

    const enrichedUsers = users.map(u => ({
      ...u,
      is_suspicious: suspiciousUserIds.has(u.id)
    }));

    res.json({ 
      success: true, 
      users: enrichedUsers,
      stats: {
        total: statsRow ? statsRow.total : 0,
        verified: statsRow ? statsRow.verified : 0,
        pending: statsRow ? statsRow.pending : 0
      }
    });
  } catch (err) {
    console.error('Lỗi khi tải danh sách người dùng:', err);
    res.status(500).json({ 
      success: false, 
      error: 'SERVER_ERROR', 
      message: 'Lỗi tải danh sách người dùng: ' + err.message,
      users: [],
      stats: { total: 0, verified: 0, pending: 0 }
    });
  }
});

// POST /api/admin/users/:id/verify - Xác thực / kích hoạt tài khoản bởi Admin
router.post('/users/:id/verify', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { verified, planDays, unlimited } = req.body;

  const user = db.prepare('SELECT id, email, plan_expires FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng.' });
  }

  const isVerified = (verified === false || verified === 0 || verified === '0') ? 0 : 1;

  let newExpiry = user.plan_expires;
  if (isVerified && unlimited) {
    newExpiry = 'unlimited';
  } else if (isVerified && planDays) {
    const numDays = parseInt(planDays, 10);
    let baseTime = Date.now();
    if (user.plan_expires && user.plan_expires !== 'unlimited') {
      const currentExpiry = new Date(user.plan_expires).getTime();
      if (currentExpiry > baseTime) {
        baseTime = currentExpiry;
      }
    }
    newExpiry = new Date(baseTime + numDays * 24 * 60 * 60 * 1000).toISOString();
  }

  db.prepare(`
    UPDATE users 
    SET is_verified = ?, 
        verify_token = NULL, 
        verify_token_expires = NULL,
        plan_expires = ?,
        updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(isVerified, newExpiry, userId);

  const statusMsg = isVerified 
    ? `Đã xác thực và kích hoạt tài khoản ${user.email} thành công!` 
    : `Đã huỷ xác thực tài khoản ${user.email}.`;

  res.json({ 
    success: true, 
    message: statusMsg,
    is_verified: isVerified,
    plan_expires: newExpiry
  });
});

// POST /api/admin/users/verify-all - Kích hoạt hàng loạt tất cả tài khoản đang chờ
router.post('/users/verify-all', requireAdmin, (req, res) => {
  const info = db.prepare(`
    UPDATE users 
    SET is_verified = 1, 
        verify_token = NULL, 
        verify_token_expires = NULL, 
        updated_at = CURRENT_TIMESTAMP 
    WHERE is_verified = 0
  `).run();

  const count = info.changes || 0;
  res.json({
    success: true,
    count,
    message: count > 0 ? `Đã xác thực thành công ${count} tài khoản đang chờ duyệt!` : 'Không có tài khoản nào đang chờ xác thực.'
  });
});

// POST /api/admin/users/:id/extend - Gia hạn thời hạn sử dụng
router.post('/users/:id/extend', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { days, customDate, unlimited } = req.body;

  const user = db.prepare('SELECT id, plan_expires FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng.' });
  }

  let newExpiry = null;
  if (unlimited) {
    newExpiry = 'unlimited';
  } else if (customDate) {
    newExpiry = new Date(customDate).toISOString();
  } else if (days) {
    const numDays = parseInt(days, 10);
    let baseTime = Date.now();
    if (user.plan_expires && user.plan_expires !== 'unlimited') {
      const currentExpiry = new Date(user.plan_expires).getTime();
      if (currentExpiry > baseTime) {
        baseTime = currentExpiry;
      }
    }
    newExpiry = new Date(baseTime + numDays * 24 * 60 * 60 * 1000).toISOString();
  }

  db.prepare('UPDATE users SET plan_expires = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newExpiry, userId);

  res.json({ success: true, message: 'Đã cập nhật hạn dùng thành công.', plan_expires: newExpiry });
});

// DELETE /api/admin/users/:id - Xoá người dùng (Hỗ trợ cả SĐT và Email)
router.delete('/users/:id', requireAdmin, (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { confirmEmail, confirmAccount } = req.body;

    const user = db.prepare('SELECT id, email, phone FROM users WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng.' });
    }

    // Chặn không cho xoá tài khoản Admin
    if (user.email === 'admin' || user.phone === 'admin') {
      return res.status(403).json({ error: 'CANNOT_DELETE_ADMIN', message: 'Không thể xoá tài khoản Quản trị viên (Admin).' });
    }

    const inputConfirm = (confirmAccount || confirmEmail || '').trim();
    if (inputConfirm) {
      if (inputConfirm !== user.email && inputConfirm !== user.phone) {
        return res.status(400).json({ error: 'CONFIRM_MISMATCH', message: 'Tài khoản xác nhận không khớp.' });
      }
    }

    // Xoá dữ liệu phiên và liên kết
    try {
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM lookups WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM device_labels WHERE user_id = ?').run(userId);
      db.prepare('DELETE FROM password_resets WHERE user_id = ?').run(userId);
    } catch (e) {}

    db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    res.json({ success: true, message: `Đã xoá tài khoản ${user.phone || user.email} thành công.` });
  } catch (err) {
    console.error('Lỗi khi xoá người dùng:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi máy chủ khi xoá người dùng: ' + err.message });
  }
});

// GET /api/admin/users/:id/devices - Xem thiết bị & cảnh báo bất thường
router.get('/users/:id/devices', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const stmt = db.prepare(`
    SELECT s.id as session_id, s.device_id, s.ip, s.user_agent, s.created_at, s.expires_at,
           dl.label
    FROM sessions s
    LEFT JOIN device_labels dl ON dl.user_id = s.user_id AND dl.device_id = s.device_id
    WHERE s.user_id = ? AND s.expires_at > datetime('now')
    ORDER BY s.created_at DESC
  `);
  const devices = stmt.all(userId);

  // Detect suspicious pairs (diff ip within 6 hours)
  const suspiciousSessionIds = new Set();
  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      const d1 = devices[i];
      const d2 = devices[j];
      if (d1.device_id !== d2.device_id && d1.ip !== d2.ip) {
        const t1 = new Date(d1.created_at).getTime();
        const t2 = new Date(d2.created_at).getTime();
        if (Math.abs(t1 - t2) <= 6 * 60 * 60 * 1000) {
          suspiciousSessionIds.add(d1.session_id);
          suspiciousSessionIds.add(d2.session_id);
        }
      }
    }
  }

  const enriched = devices.map(d => ({
    ...d,
    is_suspicious: suspiciousSessionIds.has(d.session_id)
  }));

  res.json({ success: true, devices: enriched });
});

// DELETE /api/admin/users/:id/devices/:deviceId - Gỡ thiết bị
router.delete('/users/:id/devices/:deviceId', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deviceId = req.params.deviceId;

  removeDeviceSessions(userId, deviceId);
  res.json({ success: true, message: 'Đã gỡ thiết bị khỏi tài khoản.' });
});

// POST /api/admin/users/:id/devices/:deviceId/label - Gán nhãn thiết bị
router.post('/users/:id/devices/:deviceId/label', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const deviceId = req.params.deviceId;
  const { label } = req.body;

  db.prepare(`
    INSERT INTO device_labels (user_id, device_id, label, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, device_id) DO UPDATE SET label = excluded.label, updated_at = CURRENT_TIMESTAMP
  `).run(userId, deviceId, (label || '').trim());

  res.json({ success: true, message: 'Đã lưu nhãn thiết bị.' });
});

// GET /api/admin/backup-db - Tải file backup database về máy
router.get('/backup-db', requireAdmin, (req, res) => {
  const path = require('path');
  const fs = require('fs');
  const dbFile = path.join(__dirname, '..', '..', 'data', 'database.sqlite');
  if (fs.existsSync(dbFile)) {
    const filename = `database-backup-${new Date().toISOString().slice(0, 10)}.sqlite`;
    res.download(dbFile, filename);
  } else {
    res.status(404).json({ error: 'DATABASE_NOT_FOUND', message: 'Không tìm thấy file database.' });
  }
});

module.exports = router;
