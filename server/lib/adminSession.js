const crypto = require('crypto');
const db = require('./db');

const ADMIN_COOKIE_NAME = 'tsh_admin_sid';
const ADMIN_SESSION_DAYS = 7;

function generateId(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function createAdminSession(username) {
  const sessionId = generateId(32);
  const expiresAt = new Date(Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const stmt = db.prepare(`
    INSERT INTO admin_sessions (id, username, expires_at)
    VALUES (?, ?, ?)
  `);
  stmt.run(sessionId, username, expiresAt);

  return { sessionId, expiresAt };
}

function getAdminSession(sessionId) {
  if (!sessionId) return null;
  const now = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT id, username, expires_at, created_at
    FROM admin_sessions
    WHERE id = ? AND expires_at > ?
  `);
  return stmt.get(sessionId, now) || null;
}

function deleteAdminSession(sessionId) {
  if (!sessionId) return;
  const stmt = db.prepare('DELETE FROM admin_sessions WHERE id = ?');
  stmt.run(sessionId);
}

function adminAuthMiddleware(req, res, next) {
  const sessionId = req.cookies ? req.cookies[ADMIN_COOKIE_NAME] : null;
  if (!sessionId) {
    req.admin = null;
    return next();
  }

  const session = getAdminSession(sessionId);
  if (!session) {
    res.clearCookie(ADMIN_COOKIE_NAME);
    req.admin = null;
    return next();
  }

  req.admin = { username: session.username };
  req.adminSessionId = session.id;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.admin) {
    if ((req.headers.accept && req.headers.accept.includes('text/html')) || req.path.endsWith('.html')) {
      return res.redirect('/admin-login.html');
    }
    return res.status(401).json({ error: 'ADMIN_UNAUTHORIZED', message: 'Bạn không có quyền quản trị.' });
  }
  next();
}

module.exports = {
  ADMIN_COOKIE_NAME,
  createAdminSession,
  getAdminSession,
  deleteAdminSession,
  adminAuthMiddleware,
  requireAdmin
};
