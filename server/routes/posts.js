const express = require('express');
const router = express.Router();
const db = require('../lib/db');

// GET /api/posts - Danh sách bài viết công khai
router.get('/', (req, res) => {
  const { q } = req.query;
  let sql = `
    SELECT id, title, slug, summary, cover_image, view_count, created_at 
    FROM posts 
    WHERE status = 'published'
  `;
  const params = [];

  if (q && q.trim()) {
    sql += ` AND (title LIKE ? OR summary LIKE ?) `;
    const term = `%${q.trim()}%`;
    params.push(term, term);
  }

  sql += ` ORDER BY created_at DESC`;

  const posts = db.prepare(sql).all(...params);
  res.json({ success: true, posts });
});

// GET /api/posts/:slug - Chi tiết bài viết công khai
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const post = db.prepare(`
    SELECT id, title, slug, summary, content, cover_image, attachment_path, attachment_name, view_count, status, created_at, updated_at
    FROM posts 
    WHERE slug = ?
  `).get(slug);

  if (!post) {
    return res.status(404).json({ error: 'POST_NOT_FOUND', message: 'Không tìm thấy bài viết.' });
  }

  // If post is draft, only allow if admin
  if (post.status === 'draft' && !req.admin) {
    return res.status(404).json({ error: 'POST_NOT_FOUND', message: 'Bài viết chưa được xuất bản.' });
  }

  // Increment view count
  db.prepare('UPDATE posts SET view_count = view_count + 1 WHERE id = ?').run(post.id);

  res.json({
    success: true,
    post: {
      ...post,
      view_count: post.view_count + 1
    }
  });
});

module.exports = router;
