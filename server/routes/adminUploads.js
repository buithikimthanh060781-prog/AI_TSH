const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { requireAdmin } = require('../lib/adminSession');

const uploadDir = path.join(__dirname, '..', '..', 'data', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const ALLOWED_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'zip', 'txt'
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const cleanBase = path.basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${cleanBase}_${unique}.${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return cb(new Error('Định dạng tệp không được hỗ trợ vì lý do an toàn (.svg, .html bị chặn).'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter
});

// POST /api/admin/upload - Admin only
router.post('/', requireAdmin, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: 'UPLOAD_ERROR', message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'NO_FILE', message: 'Chưa chọn tệp để tải lên.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size
    });
  });
});

module.exports = router;
