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

const { 
  ADMIN_COOKIE_NAME, 
  createAdminSession, 
  deleteAdminSession 
} = require('../lib/adminSession');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  return /^(0[2-9][0-9]{8,9}|[0-9]{10,11})$/.test(cleaned);
}

// Đảm bảo có tài khoản Admin trong bảng users để Admin có đầy đủ quyền tra cứu thành viên VIP
async function ensureAdminMemberUser(adminPass) {
  let adminRow = db.prepare("SELECT * FROM users WHERE email = 'admin' OR phone = 'admin'").get();
  if (!adminRow) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);
    const ins = db.prepare(`
      INSERT INTO users (email, phone, password_hash, is_verified, plan_expires, note)
      VALUES ('admin', 'admin', ?, 1, 'unlimited', 'Tài khoản Quản trị viên')
    `).run(hash);
    adminRow = db.prepare("SELECT * FROM users WHERE id = ?").get(ins.lastInsertRowid);
  } else {
    if (!adminRow.is_verified || adminRow.plan_expires !== 'unlimited') {
      db.prepare("UPDATE users SET is_verified = 1, plan_expires = 'unlimited' WHERE id = ?").run(adminRow.id);
      adminRow = db.prepare("SELECT * FROM users WHERE id = ?").get(adminRow.id);
    }
  }
  return adminRow;
}

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) {
    if (req.admin) {
      return res.json({
        authenticated: true,
        user: {
          id: 0,
          phone: req.admin.username,
          email: req.admin.username,
          is_verified: true,
          plan_expires: 'unlimited',
          is_admin: true,
          device_count: 1,
          lookup_count: 0
        }
      });
    }
    return res.json({ authenticated: false, user: null });
  }

  const deviceCount = countActiveDevices(req.user.id);
  const lookupStmt = db.prepare('SELECT COUNT(*) as count FROM lookups WHERE user_id = ?');
  const lookupRow = lookupStmt.get(req.user.id);
  const lookupCount = lookupRow ? lookupRow.count : 0;

  const isAdmin = !!(req.admin || req.user.email === 'admin' || req.user.phone === 'admin');

  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      phone: req.user.phone || req.user.email,
      email: req.user.email,
      full_name: req.user.full_name || '',
      is_verified: isAdmin ? true : !!req.user.is_verified,
      plan_expires: isAdmin ? 'unlimited' : req.user.plan_expires,
      is_admin: isAdmin,
      device_count: deviceCount,
      lookup_count: lookupCount
    }
  });
});

// POST /api/auth/register - Đăng ký bằng họ tên và số điện thoại
router.post('/register', async (req, res) => {
  try {
    const { phone, email, password, fullName, full_name, name, note } = req.body;
    const inputPhone = (phone || email || '').trim();
    const userFullName = (fullName || full_name || name || '').trim().slice(0, 100) || null;
    const userNote = (typeof note === 'string' ? note.trim().slice(0, 500) : null) || null;

    if (!inputPhone || !isValidPhone(inputPhone)) {
      return res.status(400).json({ error: 'INVALID_PHONE', message: 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số).' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Mật khẩu phải từ 6 ký tự trở lên.' });
    }

    const cleanPhone = inputPhone.replace(/[\s.-]/g, '');
    const existing = db.prepare('SELECT id FROM users WHERE phone = ? OR email = ?').get(cleanPhone, cleanPhone);
    if (existing) {
      return res.status(400).json({ error: 'PHONE_EXISTS', message: 'Số điện thoại này đã được đăng ký tài khoản.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const insertStmt = db.prepare(`
      INSERT INTO users (email, phone, password_hash, is_verified, full_name, note)
      VALUES (?, ?, ?, 0, ?, ?)
    `);
    const result = insertStmt.run(cleanPhone, cleanPhone, password_hash, userFullName, userNote);
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

    console.log('\n=========================================');
    console.log(`👤 [USER REGISTER] Tài khoản mới: ${userFullName ? `[${userFullName}] ` : ''}SĐT ${cleanPhone} (ID: ${userId})`);
    if (userNote) console.log(`📝 [GHI CHÚ]: ${userNote}`);
    console.log(`⏳ Trạng thái: Đang chờ Quản trị viên (Admin) xác thực/kích hoạt.`);
    console.log('=========================================\n');

    return res.json({
      success: true,
      message: 'Đăng ký tài khoản thành công! Tài khoản đang chờ Quản trị viên (Admin) xác thực. Vui lòng liên hệ Admin qua Zalo/SĐT 0762294134 để được kích hoạt.',
      user: {
        id: userId,
        phone: cleanPhone,
        email: cleanPhone,
        full_name: userFullName,
        is_verified: false,
        note: userNote
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng ký.' });
  }
});

// POST /api/auth/login - Đăng nhập bằng số điện thoại hoặc email (Hỗ trợ Admin tự động chuyển sang trang quản trị)
router.post('/login', async (req, res) => {
  try {
    const { phone, email, identifier, password } = req.body;
    const inputLogin = (phone || identifier || email || '').trim();

    if (!inputLogin || !password) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng nhập số điện thoại và mật khẩu.' });
    }

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123456';
    const cleanInput = inputLogin.replace(/[\s.-]/g, '');

    // 1. Kiểm tra tài khoản Quản trị viên (Admin)
    const isAdminLogin = (
      cleanInput.toLowerCase() === adminUser.toLowerCase() ||
      cleanInput.toLowerCase() === 'admin' ||
      cleanInput === '0762294134'
    ) && password === adminPass;

    if (isAdminLogin) {
      const adminMember = await ensureAdminMemberUser(adminPass);

      // Cấp Admin Session
      const { sessionId: adminSessionId } = createAdminSession(adminUser);
      res.cookie(ADMIN_COOKIE_NAME, adminSessionId, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });

      // Cấp Member Session (bỏ qua giới hạn thiết bị cho admin)
      const ip = getClientIp(req);
      const sessionRes = createSession(adminMember.id, req.deviceId, ip, req.headers['user-agent'], true);
      if (!sessionRes.error) {
        res.cookie(SESSION_COOKIE_NAME, sessionRes.sessionId, {
          maxAge: SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production'
        });
      }

      console.log('\n=========================================');
      console.log(`🛡️ [ADMIN ĐĂNG NHẬP THÀNH CÔNG] Tài khoản: ${adminUser}`);
      console.log(`🚀 Tự động chuyển hướng đến /admin.html (kèm quyền tra cứu không giới hạn)`);
      console.log('=========================================\n');

      return res.json({
        success: true,
        isAdmin: true,
        redirect: '/admin.html',
        message: 'Đăng nhập Quản trị viên thành công! Đang chuyển hướng đến trang Quản trị...',
        user: {
          id: adminMember.id,
          phone: adminUser,
          email: adminUser,
          is_verified: true,
          plan_expires: 'unlimited',
          is_admin: true
        }
      });
    }

    // 2. Đăng nhập thành viên bình thường
    const user = db.prepare('SELECT * FROM users WHERE phone = ? OR email = ? OR email = ?').get(cleanInput, cleanInput, inputLogin.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Số điện thoại hoặc mật khẩu không chính xác.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'INVALID_CREDENTIALS', message: 'Số điện thoại hoặc mật khẩu không chính xác.' });
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
      isAdmin: false,
      message: 'Đăng nhập thành công!',
      user: {
        id: user.id,
        phone: user.phone || user.email,
        email: user.email,
        is_verified: !!user.is_verified,
        plan_expires: user.plan_expires,
        is_admin: false
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng nhập.' });
  }
});

// POST /api/auth/change-password - Người dùng tự đổi mật khẩu
router.post('/change-password', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập để đổi mật khẩu.' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'INVALID_PASSWORD', message: 'Mật khẩu mới phải từ 6 ký tự trở lên.' });
    }

    const user = db.prepare('SELECT id, password_hash FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: 'Không tìm thấy tài khoản người dùng.' });
    }

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: 'WRONG_CURRENT_PASSWORD', message: 'Mật khẩu hiện tại không chính xác.' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(newHash, user.id);

    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công! Bạn có thể sử dụng mật khẩu mới cho các lần đăng nhập sau.'
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đổi mật khẩu.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  if (req.sessionId) {
    deleteSession(req.sessionId);
  }
  if (req.adminSessionId) {
    deleteAdminSession(req.adminSessionId);
  }
  res.clearCookie(SESSION_COOKIE_NAME);
  res.clearCookie(ADMIN_COOKIE_NAME);
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

  res.json({ 
    success: true, 
    message: 'Tài khoản của bạn đang chờ Quản trị viên (Admin) xác thực và kích hoạt. Vui lòng liên hệ Admin qua mục Liên hệ để được hỗ trợ nhanh nhất.' 
  });
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
