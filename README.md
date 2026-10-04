# Thần Số Học Pythagoras — Bản Đồ Năng Lượng 23 Chỉ Số

Hệ thống Landing Page tra cứu và phân tích Thần số học Pythagoras toàn diện với thuật toán tính toán 23 chỉ số, bản đồ hình học trực quan SVG, phân tích ký tự, quản lý thành viên, kiểm soát 2 thiết bị và hệ thống quản trị CMS bài viết.

---

## 🚀 Tính năng nổi bật

### 1. Tra cứu & Bản đồ SVG trực quan
- **Tính toán chuẩn xác 23 chỉ số**:
  - Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Trưởng thành, Ngày sinh.
  - Thái độ, Tư duy lý trí, Cân bằng, Đam mê, Chỉ số thiếu, Sức mạnh tiềm thức.
  - 2 Chỉ số liên kết: Liên kết Đường đời – Sứ mệnh, Liên kết Nhân cách – Linh hồn.
  - 4 Chặng đỉnh cao (kèm mốc tuổi và năm biến cố) & 4 Thử thách.
  - Nợ nghiệp (Karmic Debt: 13, 14, 16, 19).
  - Năm thế giới, Năm/Tháng/Ngày cá nhân theo thời gian thực truy cập.
- **Bản đồ SVG tương tác**:
  - Vẽ đúng cấu trúc hình học và vị trí các nốt theo ảnh mẫu bản đồ thực tế.
  - Bấm 1 lần vào vòng tròn để đổi màu đánh dấu (xanh dương ⇄ xanh lá).
  - Bấm đúp (Double-click) mở modal diễn giải chi tiết năng lượng, điểm mạnh, thử thách và lời khuyên.
  - Hiển thị số trước khi rút gọn bằng font nhỏ dưới số chính.
- **Sơ đồ phân tích ký tự Pythagoras**: Phân tách từng chữ cái trong tên, điểm quy đổi, phân biệt nguyên âm (tính cả chữ Y theo quy tắc) và phụ âm.
- **Xuất ảnh kết quả PNG**: Dùng HTML5 Canvas vẽ ảnh thẻ căn cước Thần số học sang trọng, tải về chia sẻ mạng xã hội.
- **In / Lưu PDF**: Hỗ trợ CSS in ấn `@media print` dàn trang A4 sạch đẹp.

### 2. Mô hình Freemium & Xác thực tài khoản bởi Admin
- Khách chưa đăng ký xem được 2 chỉ số miễn phí (Đường đời, Sứ mệnh). 21 chỉ số còn lại bị khoá 🔒 trên bản đồ và thẻ. Bấm vào ô khoá sẽ hiện popup đăng ký/đăng nhập ngay tại chỗ.
- Đăng ký tài khoản bằng email: Sau khi đăng ký, tài khoản ở trạng thái **Chờ Admin xác thực/kích hoạt**. Người dùng được trải nghiệm dùng thử 1 lượt tra cứu đầy đủ 23 chỉ số.
- Từ lượt tra cứu thứ 2, hệ thống yêu cầu tài khoản phải được **Quản trị viên (Admin) phê duyệt và kích hoạt** mới có thể tra cứu không giới hạn.
- Giới hạn tối đa **2 thiết bị / tài khoản**: Trình duyệt thứ 3 đăng nhập sẽ bị chặn (403 `DEVICE_LIMIT`). Chỉ admin mới có quyền gỡ thiết bị cũ để giải phóng vị trí.
- Quên mật khẩu & Đặt lại mật khẩu: Token 1 giờ, tự động đăng xuất tất cả các thiết bị cũ khi đổi mật khẩu mới thành công.
- Lịch sử tra cứu: Lưu tối đa 50 lần tra cứu gần nhất, bấm 1 chạm để tra cứu lại.

### 3. Cổng Quản Trị Hệ Thống (Admin Panel)
- Đăng nhập bảo mật tách biệt bằng username/password trong file `.env`.
- **Xác thực & Kích hoạt tài khoản**: Quản trị viên duyệt người dùng trực tiếp trên Dashboard, kích hoạt 1 chạm hoặc kích hoạt kèm cấp gói sử dụng (+30 ngày, +90 ngày, +1 năm, Vĩnh viễn).
- **Hỗ trợ duyệt hàng loạt**: Nút kích hoạt nhanh tất cả các tài khoản đang chờ phê duyệt.
- **Bộ lọc tài khoản thông minh**: Lọc nhanh "Tất cả", "⏳ Chờ xác thực", "✓ Đã xác thực" kèm badge hiển thị số lượng theo thời gian thực.
- Gia hạn nhanh thời hạn sử dụng (+7, +30, +90, +365 ngày, Vĩnh viễn).
- Quản lý thiết bị: Xem IP, User-Agent, đặt nhãn gợi nhớ (vd: "Laptop Thanh"), gỡ thiết bị.
- Cảnh báo bất thường: Tự động gắn cờ **⚠ Nghi vấn** khi 1 tài khoản đăng nhập từ 2 IP khác nhau trong vòng 6 giờ.
- Xoá tài khoản thành viên (yêu cầu gõ lại đúng email xác nhận).

### 4. Hệ Thống CMS Bài Viết (Kiến thức)
- Trình soạn thảo trực quan Quill WYSIWYG.
- Đính kèm tệp tải lên (tối đa 15MB: pdf, docx, xlsx, pptx, zip...) với cơ chế kiểm tra định dạng an toàn (chặn `.svg`, `.html`).
- Ảnh bìa bài viết, tự sinh slug chuẩn SEO, khử trùng mã độc HTML Sanitizer.
- Trang đọc bài viết chuyên sâu có ước tính thời gian đọc và liên kết tải tài liệu.

### 5. Trang Liên Hệ & Hỗ Trợ
- Thông tin văn phòng, hotline, email.
- Google Maps nhúng.
- Biểu mẫu gửi câu hỏi kèm bộ đếm ký tự và kiểm tra hợp lệ.
- Accordion câu hỏi thường gặp (FAQ).

---

## 🛠️ Cài đặt & Khởi chạy

### Yêu cầu môi trường
- **Node.js** >= 22.5 (Dự án sử dụng module SQLite có sẵn `node:sqlite` của Node.js, không cần build native binary).

### Bước 1: Cài đặt thư viện
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
File `.env` đã được thiết lập sẵn các giá trị mặc định:
```env
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Thông tin đăng nhập Quản trị viên
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123456

# Cấu hình Email (Để trống sẽ tự động kích hoạt chế độ DEV in link kích hoạt ra terminal)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

### Bước 3: Khởi động máy chủ
```bash
npm start
```

Truy cập trên trình duyệt:
- **Trang chủ / Tra cứu**: [http://localhost:3000](http://localhost:3000)
- **Cổng Quản trị Admin**: [http://localhost:3000/admin.html](http://localhost:3000/admin.html)
  - Tài khoản mặc định: `admin` / `admin123456`
- **Quản lý bài viết CMS**: [http://localhost:3000/admin-posts.html](http://localhost:3000/admin-posts.html)
- **Thư viện Kiến thức**: [http://localhost:3000/kien-thuc.html](http://localhost:3000/kien-thuc.html)
- **Trang Liên hệ**: [http://localhost:3000/lienhe.html](http://localhost:3000/lienhe.html)

---

## 📐 Cấu trúc thư mục

```
ThanSoHoc/
├── .env                  # Cấu hình môi trường
├── package.json          # Danh sách gói và script chạy
├── README.md             # Tài liệu dự án
├── tailieu/              # Tài liệu gốc và ảnh mẫu bản đồ
│   ├── CACH_TINH_CHI_SO.md
│   ├── CHUC_NANG.md
│   └── mẫu bản đồ.png
├── data/                 # Thư mục dữ liệu
│   ├── database.sqlite   # Cơ sở dữ liệu SQLite
│   └── uploads/          # Tệp đính kèm và ảnh bài viết
├── server/               # Mã nguồn máy chủ Node.js
│   ├── server.js         # Entry point chính của Express server
│   ├── lib/
│   │   ├── db.js           # Khởi tạo SQLite (node:sqlite)
│   │   ├── session.js      # Quản lý phiên và kiểm soát 2 thiết bị
│   │   ├── adminSession.js # Quản lý phiên admin
│   │   ├── email.js        # Gửi email & chế độ DEV console
│   │   └── content.js      # Sinh slug & khử trùng HTML
│   └── routes/
│       ├── auth.js         # API Đăng ký, đăng nhập, xác thực, quên mật khẩu
│       ├── lookups.js      # API Lưu và truy xuất lịch sử tra cứu
│       ├── admin.js        # API Quản trị tài khoản và thiết bị
│       ├── posts.js        # API Bài viết công khai
│       ├── adminPosts.js   # API CMS bài viết
│       └── adminUploads.js # API Tải tệp lên
└── public/               # Giao diện người dùng
    ├── index.html        # Landing page tra cứu & bản đồ SVG
    ├── kien-thuc.html    # Danh mục bài viết
    ├── bai-viet.html     # Trang đọc bài viết
    ├── lienhe.html       # Trang liên hệ
    ├── forgot-password.html
    ├── reset-password.html
    ├── admin-login.html  # Đăng nhập quản trị
    ├── admin.html        # Bảng điều khiển quản trị
    ├── admin-posts.html  # Trình soạn thảo bài viết CMS
    ├── css/
    │   └── style.css     # CSS giao diện cosmic & in ấn
    ├── js/
    │   ├── data.js       # Dữ liệu 23 chỉ số & FAQ
    │   ├── main.js       # Thuật toán tính toán, SVG map & UI
    │   ├── admin.js      # Script bảng quản trị
    │   └── admin-posts.js# Script soạn bài viết
    └── images/
        └── mau-ban-do.png# Ảnh mẫu bản đồ
```

---

## 🎯 Kiểm chứng thuật toán (Test Cases)

Dự án đã được kiểm thử khớp 100% với ví dụ chuẩn trong `CACH_TINH_CHI_SO.md`:

### Trường hợp 1: `HOANG SO HIEN`, sinh ngày `11/03/2024`
- **Đường đời**: `22` (số trước rút gọn: `22`)
- **Sứ mệnh**: `7` (số trước rút gọn: `25`)
- **Linh hồn**: `9` (số trước rút gọn: `18`)
- **Nhân cách**: `7` (số trước rút gọn: `7`)
- **Trưởng thành**: `11` (số trước rút gọn: `29`)
- **Liên kết ĐĐ–SM**: `3`
- **Liên kết NC–LH**: `2`
- **Cân bằng**: `8`
- **Tư duy lý trí**: `2`
- **Đam mê**: `5, 1, 6, 8`
- **Chỉ số thiếu**: `2, 3, 4`
- **Sức mạnh tiềm thức**: `6`
- **Nợ nghiệp**: `14` (từ chỉ số Thái độ)
- **4 Chặng đỉnh cao**: Chặng 1 = `5` (Tuổi 32 - Năm 2056), Chặng 2 = `1` (Tuổi 41 - Năm 2065), Chặng 3 = `6` (Tuổi 50 - Năm 2074), Chặng 4 = `11` (Tuổi 59 - Năm 2083)
- **4 Thử thách**: TT1 = `1`, TT2 = `6`, TT3 = `5`, TT4 = `5`

### Trường hợp 2: `Huỳnh Gia Huy`, sinh ngày `16/10/2009`
- **Nợ nghiệp**: `14, 16, 19` (khớp chính xác bảng xét 1 số đại diện).
