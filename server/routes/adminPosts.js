const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const { requireAdmin } = require('../lib/adminSession');
const { generateSlug, sanitizeHtml } = require('../lib/content');

router.use(requireAdmin);

// GET /api/admin/posts - Liệt kê tất cả bài viết (kể cả nháp)
router.get('/', (req, res) => {
  const posts = db.prepare(`
    SELECT id, title, slug, summary, status, view_count, created_at, updated_at
    FROM posts
    ORDER BY created_at DESC
  `).all();
  res.json({ success: true, posts });
});

// GET /api/admin/posts/:id - Lấy chi tiết để sửa
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) {
    return res.status(404).json({ error: 'POST_NOT_FOUND', message: 'Không tìm thấy bài viết.' });
  }
  res.json({ success: true, post });
});

// POST /api/admin/posts - Tạo bài viết mới
router.post('/', (req, res) => {
  const { title, summary, content, cover_image, status, attachment_path, attachment_name } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng nhập tiêu đề và nội dung bài viết.' });
  }

  const slug = generateSlug(title);
  const safeContent = sanitizeHtml(content);
  const postStatus = status === 'draft' ? 'draft' : 'published';

  const insertStmt = db.prepare(`
    INSERT INTO posts (title, slug, summary, content, cover_image, attachment_path, attachment_name, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = insertStmt.run(
    title.trim(),
    slug,
    (summary || '').trim(),
    safeContent,
    (cover_image || '').trim(),
    (attachment_path || '').trim(),
    (attachment_name || '').trim(),
    postStatus
  );

  res.json({
    success: true,
    message: postStatus === 'draft' ? 'Đã lưu bản nháp bài viết.' : 'Đã xuất bản bài viết thành công!',
    postId: Number(result.lastInsertRowid),
    slug
  });
});

// PUT /api/admin/posts/:id - Sửa bài viết
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, summary, content, cover_image, status, attachment_path, attachment_name } = req.body;

  const existing = db.prepare('SELECT id FROM posts WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'POST_NOT_FOUND', message: 'Không tìm thấy bài viết.' });
  }

  const safeContent = sanitizeHtml(content);
  const postStatus = status === 'draft' ? 'draft' : 'published';

  db.prepare(`
    UPDATE posts 
    SET title = ?, summary = ?, content = ?, cover_image = ?, attachment_path = ?, attachment_name = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    title.trim(),
    (summary || '').trim(),
    safeContent,
    (cover_image || '').trim(),
    (attachment_path || '').trim(),
    (attachment_name || '').trim(),
    postStatus,
    id
  );

  res.json({ success: true, message: 'Đã cập nhật bài viết thành công.' });
});

// DELETE /api/admin/posts/:id - Xoá bài viết
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  res.json({ success: true, message: 'Đã xoá bài viết.' });
});

module.exports = router;
