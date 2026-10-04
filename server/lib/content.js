const db = require('./db');

function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function generateSlug(title) {
  const plain = removeVietnameseTones(title).toLowerCase();
  let slug = plain
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  if (!slug) slug = 'bai-viet';

  // Ensure unique slug
  let candidate = slug;
  let counter = 1;
  const checkStmt = db.prepare('SELECT 1 FROM posts WHERE slug = ?');

  while (checkStmt.get(candidate)) {
    counter++;
    candidate = `${slug}-${counter}`;
  }

  return candidate;
}

function sanitizeHtml(html) {
  if (!html) return '';
  // Strips script tags, onerror, onload, javascript: protocols
  let safe = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/on\w+=\w+/gi, '')
    .replace(/javascript:[^"']*/gi, '');
  return safe;
}

module.exports = {
  generateSlug,
  sanitizeHtml,
  removeVietnameseTones
};
