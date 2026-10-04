const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../lib/db');
const { 
  SESSION_COOKIE_NAME, 
  SESSION_DURATION_DAYS, 
  getClientIp, 
  createSession, 
  deleteSession, 
  deleteAllUserSessions, 
  countActiveDevices 
} = require('../lib/session');
const { 
  sendVerificationEmail, 
  sendPasswordResetEmail, 
  sendPasswordChangedNotification 
} = require('../lib/email');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.json({ authenticated: false, user: null });
  }

  const deviceCount = countActiveDevices(req.user.id);

  // Check lookup count if unverified
  const lookupStmt = db.prepare('SELECT COUNT(*) as count FROM lookups WHERE user_id = ?');
  const lookupRow = lookupStmt.get(req.user.id);
  const lookupCount = lookupRow ? lookupRow.count : 0;

  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      is_verified: req.user.is_verified,
      plan_expires: req.user.plan_expires,
      device_count: deviceCount,
      lookup_count: lookupCount
    }
  });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Email không hợp lệ.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Mật khẩu phải từ 6 ký tự trở lên.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'EMAIL_EXISTS', message: 'Email này đã được đăng ký tài khoản.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const verify_token = crypto.randomBytes(24).toString('hex');
    const verify_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO users (email, password_hash, is_verified, verify_token, verify_token_expires)
      VALUES (?, ?, 0, ?, ?)
    `);
    const result = insertStmt.run(cleanEmail, password_hash, verify_token, verify_token_expires);
    const userId = Number(result.lastInsertRowid);

    // Create session
    const ip = getClientIp(req);
    const sessionRes = createSession(userId, req.deviceId, ip, req.headers['user-agent']);
    if (sessionRes.error) {
      return res.status(403).json(sessionRes);
    }

    res.cookie(SESSION_COOKIE_NAME, sessionRes.sessionId, {
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    // Send verification email
    const appUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
    sendVerificationEmail(cleanEmail, verify_token, appUrl);

    return res.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
      user: {
        id: userId,
        email: cleanEmail,
        is_verified: false
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng ký.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không chính xác.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không chính xác.' });
    }

    // Check device limit & create session
    const ip = getClientIp(req);
    const sessionRes = createSession(user.id, req.deviceId, ip, req.headers['user-agent']);
    if (sessionRes.error) {
      return res.status(403).json(sessionRes);
    }

    res.cookie(SESSION_COOKIE_NAME, sessionRes.sessionId, {
      maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });

    return res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        email: user.email,
        is_verified: !!user.is_verified,
        plan_expires: user.plan_expires
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng nhập.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  if (req.sessionId) {
    deleteSession(req.sessionId);
  }
  res.clearCookie(SESSION_COOKIE_NAME);
  res.json({ success: true, message: 'Đã đăng xuất.' });
});

// GET /api/auth/verify-email
router.get('/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send('<h3>Mã xác thực không hợp lệ.</h3><a href="/">Quay về trang chủ</a>');
  }

  const now = new Date().toISOString();
  const user = db.prepare('SELECT id, email, verify_token_expires FROM users WHERE verify_token = ?').get(token);
  if (!user) {
    return res.status(400).send('<h3>Mã xác thực không tồn tại hoặc đã được sử dụng.</h3><a href="/">Quay về trang chủ</a>');
  }

  if (user.verify_token_expires && user.verify_token_expires < now) {
    return res.status(400).send('<h3>Mã xác thực đã hết hạn. Vui lòng gửi lại yêu cầu xác thực.</h3><a href="/">Quay về trang chủ</a>');
  }

  db.prepare(`
    UPDATE users 
    SET is_verified = 1, verify_token = NULL, verify_token_expires = NULL, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(user.id);

  res.send(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>Xác thực thành công - Thần Số Học</title>
      <style>
        body { font-family: system-ui, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
        .card { background: #1e293b; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); max-width: 480px; border: 1px solid #334155; }
        h2 { color: #38bdf8; margin-top: 0; }
        .btn { display: inline-block; margin-top: 20px; padding: 12px 28px; background: #38bdf8; color: #0f172a; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>🎉 Xác thực email thành công!</h2>
        <p>Tài khoản <strong>${user.email}</strong> của bạn đã được kích hoạt đầy đủ. Bây giờ bạn có thể tra cứu toàn bộ 23 chỉ số không giới hạn.</p>
        <a href="/?verified=1" class="btn">Bắt đầu tra cứu ngay</a>
      </div>
    </body>
    </html>
  `);
});

// POST /api/auth/resend-verification
router.post('/resend-verification', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập.' });
  }

  const user = db.prepare('SELECT id, email, is_verified FROM users WHERE id = ?').get(req.user.id);
  if (!user || user.is_verified) {
    return res.json({ success: true, message: 'Tài khoản của bạn đã được xác thực trước đó.' });
  }

  const verify_token = crypto.randomBytes(24).toString('hex');
  const verify_token_expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`
    UPDATE users 
    SET verify_token = ?, verify_token_expires = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(verify_token, verify_token_expires, user.id);

  const appUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
  sendVerificationEmail(user.email, verify_token, appUrl);

  res.json({ success: true, message: 'Link xác thực mới đã được gửi tới email của bạn.' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'INVALID_EMAIL', message: 'Email không hợp lệ.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(cleanEmail);

  if (user) {
    const token = crypto.randomBytes(24).toString('hex');
    const expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    db.prepare(`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `).run(user.id, token, expires_at);

    const appUrl = process.env.APP_URL || `http://${req.headers.host || 'localhost:3000'}`;
    sendPasswordResetEmail(user.email, token, appUrl);
  }

  // Consistent response to avoid email enumeration
  res.json({
    success: true,
    message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến hòm thư của bạn.'
  });
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'INVALID_INPUT', message: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
  }

  const now = new Date().toISOString();
  const reset = db.prepare(`
    SELECT pr.id, pr.user_id, pr.expires_at, pr.used, u.email 
    FROM password_resets pr
    JOIN users u ON pr.user_id = u.id
    WHERE pr.token = ? AND pr.used = 0 AND pr.expires_at > ?
  `).get(token, now);

  if (!reset) {
    return res.status(400).json({ error: 'INVALID_TOKEN', message: 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.' });
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(newPassword, salt);

  // Update password
  db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(password_hash, reset.user_id);
  // Mark reset token used
  db.prepare('UPDATE password_resets SET used = 1 WHERE id = ?').run(reset.id);
  // Invalidate all active sessions across devices
  deleteAllUserSessions(reset.user_id);
  // Send notification email
  sendPasswordChangedNotification(reset.email);

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công! Tất cả thiết bị đã được đăng xuất. Vui lòng đăng nhập lại với mật khẩu mới.'
  });
});

module.exports = router;
