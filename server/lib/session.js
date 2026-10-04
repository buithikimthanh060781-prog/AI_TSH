const crypto = require('crypto');
const db = require('./db');

const SESSION_COOKIE_NAME = 'tsh_sid';
const DEVICE_COOKIE_NAME = 'tsh_device';
const SESSION_DURATION_DAYS = 30;
const DEVICE_DURATION_DAYS = 400;

function generateId(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket ? req.socket.remoteAddress : '';
}

function ensureDeviceId(req, res) {
  let deviceId = req.cookies ? req.cookies[DEVICE_COOKIE_NAME] : null;
  if (!deviceId) {
    deviceId = generateId(16);
    res.cookie(DEVICE_COOKIE_NAME, deviceId, {
      maxAge: DEVICE_DURATION_DAYS * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }
  return deviceId;
}

function countActiveDevices(userId) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT COUNT(DISTINCT device_id) as count 
    FROM sessions 
    WHERE user_id = ? AND expires_at > ?
  `);
  const row = stmt.get(userId, now);
  return row ? row.count : 0;
}

function hasActiveDevice(userId, deviceId) {
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT 1 FROM sessions 
    WHERE user_id = ? AND device_id = ? AND expires_at > ? 
    LIMIT 1
  `);
  return !!stmt.get(userId, deviceId, now);
}

function createSession(userId, deviceId, ip, userAgent) {
  // Check 2 devices limit
  const isExistingDevice = hasActiveDevice(userId, deviceId);
  if (!isExistingDevice) {
    const activeDeviceCount = countActiveDevices(userId);
    if (activeDeviceCount >= 2) {
      return { 
        error: 'DEVICE_LIMIT', 
        message: 'Tài khoản đã đạt giới hạn 2 thiết bị đăng nhập. Vui lòng liên hệ quản trị viên để gỡ bớt thiết bị cũ.' 
      };
    }
  }

  const sessionId = generateId(32);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, device_id, ip, user_agent, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(sessionId, userId, deviceId, ip, userAgent || '', expiresAt);

  return { sessionId, expiresAt };
}

function getSession(sessionId) {
  if (!sessionId) return null;
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT s.id as session_id, s.device_id, s.ip as session_ip, s.created_at as session_created_at,
           u.id as user_id, u.email, u.phone, u.is_verified, u.plan_expires, u.created_at as user_created_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > ?
  `);
  return stmt.get(sessionId, now) || null;
}

function deleteSession(sessionId) {
  if (!sessionId) return;
  const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
  stmt.run(sessionId);
}

function deleteAllUserSessions(userId) {
  const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
  stmt.run(userId);
}

function removeDeviceSessions(userId, deviceId) {
  const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ? AND device_id = ?');
  return stmt.run(userId, deviceId);
}

function authMiddleware(req, res, next) {
  req.deviceId = ensureDeviceId(req, res);
  const sessionId = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;
  if (!sessionId) {
    req.user = null;
    return next();
  }

  const session = getSession(sessionId);
  if (!session) {
    res.clearCookie(SESSION_COOKIE_NAME);
    req.user = null;
    return next();
  }

  req.user = {
    id: session.user_id,
    email: session.email,
    is_verified: !!session.is_verified,
    plan_expires: session.plan_expires,
    created_at: session.user_created_at
  };
  req.sessionId = session.session_id;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập để tiếp tục.' });
  }
  next();
}

module.exports = {
  SESSION_COOKIE_NAME,
  DEVICE_COOKIE_NAME,
  SESSION_DURATION_DAYS,
  getClientIp,
  ensureDeviceId,
  createSession,
  getSession,
  deleteSession,
  deleteAllUserSessions,
  removeDeviceSessions,
  authMiddleware,
  requireAuth,
  countActiveDevices
};
