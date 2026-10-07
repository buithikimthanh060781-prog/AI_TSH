const express = require('express');
const router = express.Router();
const phoneEnergy = require('../lib/phoneEnergy');
const db = require('../lib/db');
const { getClientIp } = require('../lib/session');

/**
 * POST /api/phone/analyze
 * Phân tích năng lượng từ trường của số điện thoại
 */
router.post('/analyze', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'MISSING_PHONE',
        message: 'Vui lòng cung cấp số điện thoại cần tra cứu.'
      });
    }

    const result = phoneEnergy.analyzePhoneNumber(phone);
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Kiểm tra trạng thái kích hoạt tài khoản / VIP
    const isAdmin = !!(req.admin || (req.user && (req.user.email === 'admin' || req.user.phone === 'admin')));
    const isUnlocked = isAdmin || !!(req.user && req.user.is_verified);

    // Ghi nhận lượt tra cứu số điện thoại nếu người dùng đã đăng nhập
    try {
      if (req.user) {
        const ip = getClientIp(req);
        const insertStmt = db.prepare(`
          INSERT INTO lookups (user_id, full_name, birth_date, ip)
          VALUES (?, ?, ?, ?)
        `);
        insertStmt.run(
          req.user.id,
          req.user.full_name || ('Tra cứu SĐT: ' + phone),
          'SĐT: ' + result.input.displayFormat,
          ip
        );
      }
    } catch (dbErr) {
      // Không gián đoạn kết quả tra cứu nếu việc ghi lịch sử gặp lỗi
      console.warn('Ghi nhận lịch sử SĐT bị bỏ qua:', dbErr.message);
    }

    return res.json({
      success: true,
      isUnlocked,
      data: result
    });
  } catch (err) {
    console.error('Lỗi khi phân tích số điện thoại:', err);
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Có lỗi xảy ra khi phân tích số điện thoại. Vui lòng thử lại sau.'
    });
  }
});

/**
 * GET /api/phone/dictionary
 * Tra cứu bảng mã NLSO và danh mục tổ hợp kết luận
 */
router.get('/dictionary', (req, res) => {
  try {
    const nlsoRows = db.prepare('SELECT ma_so, tu_truong, cap_do FROM nlso ORDER BY tu_truong, cap_do').all();
    const klRows = db.prepare('SELECT tu_truong_1, tu_truong_2, ma_ket_luan, diem FROM ket_luan ORDER BY id').all();
    return res.json({
      success: true,
      nlsoCount: nlsoRows.length,
      ketLuanCount: klRows.length,
      nlso: nlsoRows,
      combinations: klRows
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: err.message
    });
  }
});

module.exports = router;
