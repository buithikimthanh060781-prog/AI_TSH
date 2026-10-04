require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./lib/db');
const { authMiddleware } = require('./lib/session');
const { adminAuthMiddleware, requireAdmin } = require('./lib/adminSession');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & parsing middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(cookieParser());

// Device & Auth sessions
app.use(authMiddleware);
app.use(adminAuthMiddleware);

// Protect admin HTML pages directly on server
app.get(['/admin.html', '/admin-posts.html'], requireAdmin, (req, res, next) => {
  next();
});

// Redirect logged in admin away from login page
app.get('/admin-login.html', (req, res, next) => {
  if (req.admin) {
    return res.redirect('/admin.html');
  }
  next();
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lookups', require('./routes/lookups'));
app.use('/api/admin/posts', require('./routes/adminPosts'));
app.use('/api/admin/upload', require('./routes/adminUploads'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/posts', require('./routes/posts'));

// Static uploads with nosniff
app.use('/uploads', express.static(path.join(__dirname, '..', 'data', 'uploads')));

// Public static assets (both root and public directory)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..'), {
  dotfiles: 'ignore',
  index: ['index.html']
}));

// Seed sample posts if empty
function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  if (count === 0) {
    const seedStmt = db.prepare(`
      INSERT INTO posts (title, slug, summary, content, cover_image, status)
      VALUES (?, ?, ?, ?, ?, 'published')
    `);

    seedStmt.run(
      'Khám phá ý nghĩa các con số Đường đời từ 1 đến 9 và số Bậc thầy (11, 22, 33)',
      'y-nghia-cac-con-so-duong-doi-pythagoras',
      'Con số Đường đời là chỉ số quan trọng nhất trong bản đồ Thần số học, hé lộ con đường phát triển, năng lực bẩm sinh và bài học lớn nhất của cuộc đời bạn.',
      `<h2>1. Con số Đường đời là gì?</h2>
      <p>Trong hệ thống Thần số học Pythagoras, <strong>Đường đời (Life Path Number)</strong> được ví như chiếc la bàn định hướng cho cả hành trình cuộc đời. Con số này đại diện cho những bài học cốt lõi, cơ hội lớn và tiềm năng bẩm sinh mà linh hồn bạn lựa chọn để trải nghiệm trong kiếp sống này.</p>
      
      <h2>2. Tổng quan các con số Đường đời</h2>
      <ul>
        <li><strong>Số 1:</strong> Người tiên phong, thủ lĩnh độc lập, ý chí kiên định và dám bứt phá.</li>
        <li><strong>Số 2:</strong> Sứ giả hoà bình, lắng nghe tinh tế, gắn kết cộng đồng và trực giác nhạy bén.</li>
        <li><strong>Số 3:</strong> Ngọn đuốc sáng tạo, lan toả niềm vui, tài năng ngôn từ và nghệ thuật.</li>
        <li><strong>Số 4:</strong> Nền tảng vững chãi, tính kỷ luật, chuẩn mực, tổ chức khoa học và thực tế.</li>
        <li><strong>Số 5:</strong> Cơn gió tự do, thích phiêu lưu khám phá, thích ứng linh hoạt và nhiều đam mê.</li>
        <li><strong>Số 6:</strong> Biểu tượng tình yêu thương, chăm sóc gia đình, tinh thần trách nhiệm và lòng trắc ẩn.</li>
        <li><strong>Số 7:</strong> Nhà thông thái, tìm kiếm chân lý, trực giác tâm linh sâu sắc và tinh thần nội tâm.</li>
        <li><strong>Số 8:</strong> Biểu tượng quyền lực, quản trị tài chính, điều hành doanh nghiệp và tầm nhìn vĩ mô.</li>
        <li><strong>Số 9:</strong> Bác ái nhân văn, cống hiến vì cộng đồng, truyền cảm hứng và hoàn thiện bản thân.</li>
      </ul>

      <h2>3. Các con số Bậc thầy (Master Numbers)</h2>
      <p>Các số <strong>11, 22, 33</strong> mang tần số năng lượng cao gấp đôi và đòi hỏi người sở hữu phải vượt qua nhiều thử thách lớn để kích hoạt trọn vẹn tiềm năng:</p>
      <ul>
        <li><strong>Số 11/2:</strong> Trực giác tâm linh phi thường, người kết nối ánh sáng và nguồn cảm hứng cho cộng đồng.</li>
        <li><strong>Số 22/4:</strong> Kiến trúc sư bậc thầy, biến những ước mơ vĩ đại thành hiện thực hữu hình trên thế gian.</li>
        <li><strong>Số 33/6:</strong> Thầy trị liệu và tình thương vô điều kiện, sứ mệnh nâng đỡ tâm hồn nhân loại.</li>
      </ul>`,
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80'
    );

    seedStmt.run(
      'Hướng dẫn đọc bản đồ Thần số học Pythagoras toàn diện',
      'huong-dan-doc-ban-do-than-so-hoc-toan-dien',
      'Bản đồ Thần số học chứa đựng 23 chỉ số phản ánh cấu trúc năng lượng, bài học linh hồn và các cột mốc quan trọng trong cuộc đời.',
      `<h2>Cấu trúc bản đồ Thần số học</h2>
      <p>Một bản đồ Thần số học hoàn chỉnh không chỉ dừng lại ở một con số duy nhất. Hệ thống Pythagoras xem xét con người như một chỉnh thể đa chiều với <strong>23 chỉ số</strong> đan xen:</p>
      
      <h3>1. Bộ ba Cốt lõi (Tam giác vàng)</h3>
      <p>Bao gồm <strong>Đường đời</strong> (phương tiện di chuyển), <strong>Sứ mệnh</strong> (đích đến cuộc đời) và <strong>Linh hồn</strong> (động lực thôi thúc sâu thẳm bên trong). Khi ba con số này hài hoà với nhau, cuộc sống sẽ vô cùng hanh thông và mãn nguyện.</p>

      <h3>2. Tương tác bên ngoài & Nội tâm</h3>
      <p><strong>Nhân cách</strong> thể hiện hình ảnh bạn bộc lộ với thế giới, trong khi <strong>Tư duy lý trí</strong> cho biết cách bạn tiếp nhận thông tin và đưa ra quyết định mỗi ngày.</p>

      <h3>3. Bốn Chặng đỉnh cao & Thử thách</h3>
      <p>Cuộc đời chia làm 4 chặng phát triển kéo dài 9 năm/chặng. Mỗi chặng mang một nguồn năng lượng đỉnh cao tương ứng với một bài học thử thách cần vượt qua.</p>`,
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80'
    );

    seedStmt.run(
      'Giải mã Nợ nghiệp (13, 14, 16, 19) trong Thần số học và cách hoá giải',
      'giai-ma-no-nghiep-13-14-16-19-va-cach-hoa-giai',
      'Nợ nghiệp không phải là hình phạt, mà là bài thi mà linh hồn chưa hoàn thành trong quá khứ để giúp bạn rèn luyện phẩm chất cao đẹp hơn.',
      `<h2>Bản chất của các con số Nợ nghiệp</h2>
      <p>Trong Thần số học Pythagoras, có 4 con số Nợ nghiệp đặc biệt là <strong>13/4, 14/5, 16/7, và 19/1</strong>. Đây là dấu chỉ cho thấy trong quá khứ, chúng ta đã từng lạm dụng hoặc xem nhẹ một khía cạnh năng lượng nào đó.</p>

      <h2>Ý nghĩa chi tiết từng con số Nợ nghiệp</h2>
      <ul>
        <li><strong>Nợ nghiệp 13/4 (Nợ lười biếng/thiếu tập trung):</strong> Thường xuyên gặp trắc trở, cảm giác làm việc vất vả hơn người khác mới đạt kết quả. <em>Cách hoá giải:</em> Rèn luyện tính kiên trì, kỷ luật, sắp xếp ngăn nắp và không bỏ cuộc giữa chừng.</li>
        <li><strong>Nợ nghiệp 14/5 (Nợ lạm dụng tự do):</strong> Dễ rơi vào cám dỗ, thiếu cam kết, thay đổi bất định làm tổn hại người khác. <em>Cách hoá giải:</em> Giữ chừng mực, học cách kiểm soát ham muốn nhất thời và cam kết có trách nhiệm.</li>
        <li><strong>Nợ nghiệp 16/7 (Nợ sụp đổ cái tôi/tình cảm):</strong> Trải qua những biến cố lớn đánh gục cái tôi kiêu hãnh hoặc phản bội trong tình cảm để tìm về sự thức tỉnh nội tâm. <em>Cách hoá giải:</em> Sống khiêm nhường, thấu cảm và phát triển trí tuệ tâm linh.</li>
        <li><strong>Nợ nghiệp 19/1 (Nợ lạm dụng quyền lực/ích kỷ):</strong> Cảm thấy cô đơn, phải tự lực cánh sinh mà không nhận được sự trợ giúp, dễ cô lập bản thân. <em>Cách hoá giải:</em> Mở rộng lòng chia sẻ, biết lắng nghe người khác và giúp đỡ cộng đồng vô điều kiện.</li>
      </ul>`,
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
    );

    console.log('Seeded initial articles into database.');
  }
}

seedDatabase();

// Update package.json start script
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌟 THẦN SỐ HỌC PYTHAGORAS SERVER ĐANG CHẠY!`);
  console.log(`🚀 Landing Page: http://localhost:${PORT}`);
  console.log(`🛡️  Admin Panel:  http://localhost:${PORT}/admin.html`);
  console.log(`   (Username: ${process.env.ADMIN_USERNAME || 'admin'}, Password: ${process.env.ADMIN_PASSWORD || 'admin123456'})`);
  console.log(`======================================================\n`);
});
