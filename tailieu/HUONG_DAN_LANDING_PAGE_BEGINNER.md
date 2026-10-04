# 📘 Hướng Dẫn Xây Dựng Landing Page Thần Số Học Pythagoras
> **Dành cho người mới học lập trình Web: Chỉ sử dụng HTML5, CSS3, JavaScript thuần (Vanilla JS) & Database CSV. Giao diện tông màu sáng, nền trắng (Light Mode).**

---

## 📑 Mục lục
1. [Giới thiệu & Kiến trúc tổng thể dự án](#1-giới-thiệu--kiến-trúc-tổng-thể-dự-án)
2. [Cấu trúc Thư mục Dự án Chuẩn](#2-cấu-trúc-thư-mục-dự-án-chuẩn)
3. [Thiết kế Giao diện Light Mode (CSS Nền Trắng, Tinh Tế)](#3-thiết-kế-giao-diện-light-mode-css-nền-trắng-tinh-tế)
4. [Cấu trúc HTML5 của Landing Page (`index.html`)](#4-cấu-trúc-html5-của-landing-page-indexhtml)
5. [Toàn bộ Thuật toán Tính toán 23 Chỉ Số Thần Số Học (JavaScript)](#5-toàn-bộ-thuật-toán-tính-toán-23-chỉ-số-thần-số-học-javascript)
6. [Bản đồ Vận Mệnh SVG Tương Tác Trực Quan (Interactive Map)](#6-bản-đồ-vận-mệnh-svg-tương-tác-trực-quan-interactive-map)
7. [Hệ Thống Cơ Sở Dữ Liệu Bằng File CSV & Bộ Parser JavaScript](#7-hệ-thống-cơ-sở-dữ-liệu-bằng-file-csv--bộ-parser-javascript)
8. [Tương tác Người dùng: Lọc Thẻ, Tìm Kiếm, Modal & Xuất Ảnh/In PDF](#8-tương-tác-người-dùng-lọc-thẻ-tìm-kiếm-modal--xuất-ảnhin-pdf)
9. [Hướng Dẫn Triển Khai & Chạy Thực Tế (Quickstart)](#9-hướng-dẫn-triển-khai--chạy-thực-tế-quickstart)

---

## 1. Giới thiệu & Kiến trúc tổng thể dự án

### 1.1. Tại sao lại chọn mô hình HTML + CSS + JS thuần & CSV?
Đối với người mới bắt đầu học làm trang đích (Landing Page), việc tiếp cận ngay các framework nặng nề (React, Vue, Angular) hay cài đặt cơ sở dữ liệu phức tạp (MySQL, MongoDB, PostgreSQL) thường gây quá tải và mất nhiều thời gian cấu hình.

Mô hình **Frontend thuần (HTML/CSS/JS)** kết hợp **Database dạng file CSV (Comma-Separated Values)** đem lại những ưu điểm vượt trội:
- **Không cần cài đặt môi trường backend**: Chỉ cần trình duyệt web (Chrome, Edge, Firefox) và phần mềm soạn thảo mã (VS Code).
- **Dễ hiểu, dễ sửa**: Toàn bộ luồng dữ liệu hiển thị trực tiếp trong DOM, người học nắm vững bản chất cốt lõi của Web API.
- **Cơ sở dữ liệu CSV thân thiện**: File CSV có thể mở và chỉnh sửa trực tiếp bằng Microsoft Excel hoặc Google Sheets. Bạn có thể thêm bớt nội dung luận giải 23 chỉ số mà không cần học câu lệnh SQL.
- **Tốc độ tải trang siêu nhanh**: Không phụ thuộc thư viện bên ngoài, nhẹ nhàng, đạt chuẩn SEO và tương thích 100% trên thiết bị di động.

### 1.2. Định hướng Giao diện: Light Mode (Tông màu sáng, nền trắng)
Khác với giao diện tối (Dark Cosmic), giao diện **Light Mode** mang phong cách chuyên nghiệp, sáng sủa, thanh lịch và mang lại cảm giác tri thức, tin cậy:
- **Màu nền chủ đạo**: Màu trắng tinh khiết (`#ffffff`) kết hợp xám ngọc trai (`#f8fafc`) tạo chiều sâu.
- **Màu chữ**: Xanh đen than thẫm (`#0f172a`), độ tương phản cao, rõ ràng trên mọi màn hình.
- **Màu nhấn (Accents)**: 
  - Xanh dương năng lượng (`#0284c7` / `#3b82f6`): Đại diện cho trí tuệ và sự kết nối.
  - Xanh lá cây thành tựu (`#16a34a` / `#2e7d32`): Đại diện cho tài lộc, sự phát triển.
  - Vàng kim thịnh vượng (`#f59e0b` / `#d97706`): Tạo điểm nhấn trang trọng, ấm áp.
  - Đỏ may mắn (`#dc2626`): Đánh dấu các mốc thử thách cần lưu tâm.

---

## 2. Cấu trúc Thư mục Dự án Chuẩn

Dự án được bố trí khoa học, tách bạch rõ ràng giữa Giao diện (HTML), Định kiểu (CSS), Logic xử lý (JS) và Dữ liệu (CSV):

```
thansohoc-landingpage/
│
├── index.html              # Trang chủ Landing Page đầy đủ tính năng
│
├── css/
│   └── style.css           # Toàn bộ CSS phong cách Light Mode, Responsive
│
├── js/
│   ├── calculator.js       # Thuật toán tính toán 23 chỉ số Pythagoras
│   ├── csv-parser.js       # Bộ đọc & phân tích cú pháp file CSV
│   └── main.js             # Kết nối sự kiện DOM, vẽ SVG, modal, tìm kiếm
│
├── data/
│   ├── chi_so_y_nghia.csv  # Database nội dung luận giải 23 chỉ số
│   └── bai_viet.csv        # Database các bài viết kiến thức thần số học
│
└── images/                 # Thư mục hình ảnh, logo, icon
    └── logo.svg
```

---

## 3. Thiết kế Giao diện Light Mode (CSS Nền Trắng, Tinh Tế)

Trong file `css/style.css`, chúng ta định nghĩa hệ thống biến toàn cục (**CSS Variables**) để quản lý màu sắc tập trung, giúp người mới học dễ dàng tùy biến giao diện:

```css
/* ==========================================================================
   HỆ THỐNG BIẾN TOÀN CỤC CHO GIAO DIỆN LIGHT MODE
   ========================================================================== */
:root {
  /* Tông màu nền */
  --bg-body: #f8fafc;        /* Nền trang: xám sáng dịu mắt */
  --bg-card: #ffffff;        /* Nền thẻ: trắng tinh khôi */
  --bg-subtle: #f1f5f9;      /* Nền phụ: xám nhạt */
  
  /* Màu đường viền */
  --border-light: #e2e8f0;    /* Viền thẻ mềm mại */
  --border-focus: #0284c7;    /* Viền khi trỏ chuột hoặc focus */

  /* Màu chữ */
  --text-main: #0f172a;       /* Chữ tiêu đề & nội dung chính (xanh đen) */
  --text-muted: #64748b;      /* Chữ phụ chú, mô tả ngắn (xám than) */
  --text-dim: #94a3b8;        /* Chữ mờ, placeholder */

  /* Màu thương hiệu & Điểm nhấn */
  --primary: #0284c7;         /* Xanh dương chủ đạo */
  --primary-hover: #0369a1;
  --accent-gold: #f59e0b;     /* Vàng kim */
  --accent-green: #16a34a;    /* Xanh lá cây */
  --accent-red: #dc2626;      /* Đỏ cảnh báo / thử thách */

  /* Đổ bóng nhẹ nhàng cho Light Mode */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.06);
  --shadow-lg: 0 10px 25px rgba(15, 23, 42, 0.08);

  /* Bo góc */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

/* Áp dụng Reset CSS */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-body);
  color: var(--text-main);
  line-height: 1.6;
}

/* Khung nội dung tối đa căn giữa */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Thẻ card màu trắng chuẩn phong cách Light Mode */
.light-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.light-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
```

---

## 4. Cấu trúc HTML5 của Landing Page (`index.html`)

Trang đích được tổ chức thành các khối chuyên biệt, tuần tự từ trên xuống dưới theo hành trình trải nghiệm của người dùng:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Khám Phá Bản Đồ Vận Mệnh Thần Số Học Pythagoras</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- 1. HEADER & MENU ĐIỀU HƯỚNG -->
  <header class="site-header">
    <div class="container header-inner">
      <div class="brand-logo">
        <span class="icon">✨</span>
        <span class="name">Thần Số Học Pythagoras</span>
      </div>
      <nav class="nav-links">
        <a href="#lookup">Tra cứu</a>
        <a href="#map-section">Bản đồ số</a>
        <a href="#indicators">23 Chỉ số</a>
        <a href="#articles">Kiến thức</a>
      </nav>
    </div>
  </header>

  <!-- 2. HERO SECTION & FORM NHẬP LIỆU -->
  <section class="hero-section" id="lookup">
    <div class="container">
      <div class="hero-badge">🔮 Bản Đồ Vận Mệnh 23 Chỉ Số</div>
      <h1 class="hero-title">Khám Phá Sứ Mệnh & Tiềm Năng Cuộc Đời</h1>
      <p class="hero-desc">Nhập chính xác họ tên khai sinh và ngày tháng năm sinh để lập bản đồ năng lượng chuẩn Pythagoras.</p>

      <!-- FORM NHẬP THÔNG TIN -->
      <div class="lookup-card light-card">
        <form id="tsh-form">
          <div class="form-group">
            <label for="fullName">Họ và tên khai sinh:</label>
            <input type="text" id="fullName" placeholder="Ví dụ: Hoàng Sớ Hiền" required autocomplete="off">
            <div id="converted-name-preview" class="name-preview"></div>
          </div>

          <div class="date-grid">
            <div class="form-group">
              <label for="birthDay">Ngày sinh:</label>
              <select id="birthDay" required></select>
            </div>
            <div class="form-group">
              <label for="birthMonth">Tháng sinh:</label>
              <select id="birthMonth" required></select>
            </div>
            <div class="form-group">
              <label for="birthYear">Năm sinh:</label>
              <select id="birthYear" required></select>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block">🚀 Xem Bản Đồ Thần Số Học</button>
        </form>
      </div>
    </div>
  </section>

  <!-- 3. BẢN ĐỒ VẬN MỆNH SVG TƯƠNG TÁC -->
  <section class="map-section" id="map-section">
    <div class="container">
      <h2 class="section-title">Bản Đồ Năng Lượng Kim Cương</h2>
      <p class="section-subtitle">Bấm 1 lần vào ô để đổi màu theo dõi • Bấm đúp chuột để xem giải nghĩa chi tiết</p>
      
      <div class="svg-container light-card" id="svg-map-wrapper">
        <!-- Mã SVG bản đồ sẽ được JavaScript render vào đây -->
      </div>
    </div>
  </section>

  <!-- 4. LƯỚI 23 THẺ CHỈ SỐ CHI TIẾT -->
  <section class="indicators-section" id="indicators">
    <div class="container">
      <h2 class="section-title">23 Chỉ Số Toàn Diện Cuộc Đời</h2>
      
      <!-- Bộ lọc và tìm kiếm -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <button class="filter-btn active" data-filter="all">Tất cả (23)</button>
          <button class="filter-btn" data-filter="cotLoi">Cốt lõi</button>
          <button class="filter-btn" data-filter="boTro">Bổ trợ</button>
          <button class="filter-btn" data-filter="dinhCao">4 Đỉnh cao</button>
          <button class="filter-btn" data-filter="thuThach">4 Thử thách</button>
          <button class="filter-btn" data-filter="dacBiet">Đặc biệt</button>
        </div>
        <input type="text" id="search-indicator" placeholder="🔍 Tìm kiếm chỉ số (gõ không dấu)...">
      </div>

      <!-- Danh sách 23 thẻ chỉ số -->
      <div class="indicator-grid" id="indicators-grid"></div>
    </div>
  </section>

  <!-- 5. MODAL DIỄN GIẢI CHI TIẾT -->
  <div class="modal-backdrop" id="meaning-modal">
    <div class="modal-card light-card">
      <button class="modal-close" id="modal-close-btn">&times;</button>
      <div class="modal-header">
        <span class="badge" id="modal-badge">Chỉ số</span>
        <h3 id="modal-title">Tiêu đề chỉ số</h3>
        <div class="modal-number" id="modal-number">--</div>
      </div>
      <div class="modal-body" id="modal-content">
        <!-- Nội dung lấy từ file CSV nạp vào đây -->
      </div>
    </div>
  </div>

  <!-- NẠP CÁC FILE JAVASCRIPT -->
  <script src="js/csv-parser.js"></script>
  <script src="js/calculator.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

---

## 5. Toàn bộ Thuật toán Tính toán 23 Chỉ Số Thần Số Học (JavaScript)

Trong file `js/calculator.js`, chúng ta hiện thực hóa toàn bộ toán học Pythagoras, xử lý tiếng Việt và rút gọn số:

### 5.1. Bảng quy đổi chữ cái Pythagoras
Hệ thống Pythagoras quy đổi mỗi chữ cái từ A đến Z vào các số từ 1 đến 9:

$$\begin{aligned}
1 &\rightarrow \text{A, J, S} & 2 &\rightarrow \text{B, K, T} & 3 &\rightarrow \text{C, L, U} \\
4 &\rightarrow \text{D, M, V} & 5 &\rightarrow \text{E, N, W} & 6 &\rightarrow \text{F, O, X} \\
7 &\rightarrow \text{G, P, Y} & 8 &\rightarrow \text{H, Q, Z} & 9 &\rightarrow \text{I, R}
\end{aligned}$$

```javascript
const PYTHAGORAS_TABLE = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};
```

### 5.2. Hàm Chuẩn hóa tiếng Việt (Xóa dấu)
Tên tiếng Việt như "Hoàng Sớ Hiền" cần được chuyển về "HOANG SO HIEN", đồng thời biến "Đ" thành "D":

```javascript
function removeVietnameseTones(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu thanh
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')       // Loại bỏ ký tự đặc biệt và số
    .replace(/\s+/g, ' ')
    .trim();
}
```

### 5.3. Quy tắc Nguyên âm / Phụ âm & Chữ "Y" trong tiếng Việt
- **Nguyên âm chuẩn**: `A, E, I, O, U`.
- **Quy tắc chữ "Y"**:
  - Chữ `Y` là **nguyên âm** khi đứng cạnh phụ âm (ví dụ: `HUYNH`, `MY`, `LY`, `THUY`).
  - Chữ `Y` là **phụ âm** khi đứng cạnh một nguyên âm khác (ví dụ: `NGUYEN` — `Y` đứng cạnh `U` và `E`).

```javascript
function isVowel(ch, prevChar, nextChar) {
  if ('AEIOU'.includes(ch)) return true;
  if (ch === 'Y') {
    const isPrevVowel = prevChar && 'AEIOU'.includes(prevChar);
    const isNextVowel = nextChar && 'AEIOU'.includes(nextChar);
    // Nếu đứng cạnh nguyên âm thì Y đóng vai trò là phụ âm
    if (!isPrevVowel && !isNextVowel) return true;
    return false;
  }
  return false;
}
```

### 5.4. Các hàm rút gọn số (Reduction Rules)
- **Hàm `RN(n)` (Rút gọn triệt để)**: Cộng dồn các chữ số cho đến khi còn từ 1 đến 9.
- **Hàm `RM(n)` (Rút gọn giữ lại số Master)**: Cộng dồn các chữ số, nhưng nếu gặp **11, 22, 33** thì dừng lại và giữ nguyên.

```javascript
function sumDigits(num) {
  return String(num).split('').reduce((acc, digit) => acc + (parseInt(digit, 10) || 0), 0);
}

// Rút gọn triệt để về 1-9
function RN(n) {
  let val = Math.abs(parseInt(n, 10) || 0);
  while (val > 9) {
    val = sumDigits(val);
  }
  return val;
}

// Rút gọn giữ lại số Master: 11, 22, 33
function RM(n) {
  let val = Math.abs(parseInt(n, 10) || 0);
  while (val > 9) {
    if (val === 11 || val === 22 || val === 33) return val;
    val = sumDigits(val);
  }
  return val;
}
```

### 5.5. Công thức tính toán chi tiết 23 chỉ số

```javascript
function calculateNumerology(fullName, day, month, year) {
  const cleanName = removeVietnameseTones(fullName);
  const words = cleanName.split(' ').filter(w => w.length > 0);

  // Phân tích nguyên âm & phụ âm từng từ
  let totalVowels = 0;
  let totalConsonants = 0;
  const letterCounts = {};

  words.forEach(word => {
    let wordVowels = 0;
    let wordConsonants = 0;
    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const val = PYTHAGORAS_TABLE[ch] || 0;
      letterCounts[val] = (letterCounts[val] || 0) + 1;

      const prev = i > 0 ? word[i - 1] : null;
      const next = i < word.length - 1 ? word[i + 1] : null;

      if (isVowel(ch, prev, next)) {
        wordVowels += val;
      } else {
        wordConsonants += val;
      }
    }
    totalVowels += RN(wordVowels);
    totalConsonants += RN(wordConsonants);
  });

  // 1. ĐƯỜNG ĐỜI (Life Path): RM(RN(ngày) + RN(tháng) + RN(năm))
  const rnDay = RN(day);
  const rnMonth = RN(month);
  const rnYear = RN(year);
  const rawDuongDoi = rnDay + rnMonth + rnYear;
  const duongDoi = RM(rawDuongDoi);

  // 2. SỨ MỆNH (Destiny): Tổng tất cả các chữ cái trong tên, rút gọn giữ Master
  const rawSuMenh = totalVowels + totalConsonants;
  const suMenh = RM(rawSuMenh);

  // 3. LINH HỒN (Soul Urge): Tổng các nguyên âm trong tên
  const linhHon = RM(totalVowels);

  // 4. NHÂN CÁCH (Personality): Tổng các phụ âm trong tên
  const nhanCach = RM(totalConsonants);

  // 5. TRƯỞNG THÀNH (Maturity): RM(Đường đời + Sứ mệnh)
  const truongThanh = RM(RN(duongDoi) + RN(suMenh));

  // 6. NGÀY SINH (Birth Day): RM(ngày sinh)
  const ngaySinh = RM(day);

  // 7. THÁI ĐỘ (Attitude): RN(ngày sinh + tháng sinh)
  const thaiDo = RN(day + month);

  // 8. TƯ DUY LÝ TRÍ (Rational Thought): RN(RN(ngày sinh) + RN(Tên gọi chính))
  const firstWord = words[words.length - 1]; // Tên chính
  let firstWordVal = 0;
  for (let ch of firstWord) firstWordVal += PYTHAGORAS_TABLE[ch] || 0;
  const tuDuyLyTri = RN(rnDay + RN(firstWordVal));

  // 9. CÂN BẰNG (Balance): RN(tổng chữ cái đầu tiên của từng từ trong họ tên)
  let sumFirstLetters = 0;
  words.forEach(w => sumFirstLetters += (PYTHAGORAS_TABLE[w[0]] || 0));
  const canBang = RN(sumFirstLetters);

  // 10. ĐAM MÊ (Passion): Các số xuất hiện nhiều nhất trong tên
  let maxCount = 0;
  for (let num = 1; num <= 9; num++) {
    if ((letterCounts[num] || 0) > maxCount) maxCount = letterCounts[num];
  }
  const damMe = [];
  if (maxCount > 1) {
    for (let num = 1; num <= 9; num++) {
      if (letterCounts[num] === maxCount) damMe.push(num);
    }
  }

  // 11. CHỈ SỐ THIẾU (Missing): Các số từ 1 đến 9 không xuất hiện lần nào trong tên
  const chiSoThieu = [];
  for (let num = 1; num <= 9; num++) {
    if (!letterCounts[num]) chiSoThieu.push(num);
  }

  // 12. SỨC MẠNH TIỀM THỨC: 9 trừ số lượng các con số thiếu
  const sucManhTiemThuc = 9 - chiSoThieu.length;

  // 13. LIÊN KẾT ĐƯỜNG ĐỜI - SỨ MỆNH: |RN(Đường đời) - RN(Sứ mệnh)|
  const lkDuongDoiSuMenh = Math.abs(RN(duongDoi) - RN(suMenh));

  // 14. LIÊN KẾT NHÂN CÁCH - LINH HỒN: |RN(Nhân cách) - RN(Linh hồn)|
  const lkNhanCachLinhHon = Math.abs(RN(nhanCach) - RN(linhHon));

  // 15 - 18. BỐN CHẶNG ĐỈNH CAO (4 Pinnacles)
  const chang1 = RN(rnDay + rnMonth);
  const chang2 = RN(rnDay + rnYear);
  const chang3 = RN(chang1 + chang2);
  const chang4 = RN(rnMonth + rnYear);

  // Độ tuổi và năm của từng chặng
  const tuoi1 = 36 - RN(duongDoi);
  const tuoi2 = tuoi1 + 9;
  const tuoi3 = tuoi2 + 9;
  const tuoi4 = tuoi3 + 9;

  const nam1 = year + tuoi1;
  const nam2 = year + tuoi2;
  const nam3 = year + tuoi3;
  const nam4 = year + tuoi4;

  // 19 - 22. BỐN THỬ THÁCH (4 Challenges)
  const thuThach1 = Math.abs(rnDay - rnMonth);
  const thuThach2 = Math.abs(rnDay - rnYear);
  const thuThach3 = Math.abs(thuThach1 - thuThach2);
  const thuThach4 = Math.abs(rnMonth - rnYear);

  // 23. NỢ NGHIỆP (Karmic Debt: kiểm tra các số 13, 14, 16, 19)
  const noNghiep = [];
  const checkValues = [rawDuongDoi, rawSuMenh, totalVowels, totalConsonants, day];
  [13, 14, 16, 19].forEach(debt => {
    if (checkValues.includes(debt) && !noNghiep.includes(debt)) {
      noNghiep.push(debt);
    }
  });

  // CHU KỲ CÁ NHÂN & NĂM THẾ GIỚI (Tính theo thời điểm truy cập hiện tại)
  const today = new Date();
  const curYear = today.getFullYear();
  const curMonth = today.getMonth() + 1;
  const curDay = today.getDate();

  const namTheGioi = RN(curYear);
  const namCaNhan = RN(RN(day) + RN(month) + RN(curYear));
  const thangCaNhan = RN(namCaNhan + curMonth);
  const ngayCaNhan = RN(thangCaNhan + curDay);

  return {
    fullName, cleanName, day, month, year,
    duongDoi, suMenh, linhHon, nhanCach, truongThanh, ngaySinh,
    thaiDo, tuDuyLyTri, canBang, damMe, chiSoThieu, sucManhTiemThuc,
    lkDuongDoiSuMenh, lkNhanCachLinhHon,
    chang: [
      { val: chang1, age: tuoi1, year: nam1 },
      { val: chang2, age: tuoi2, year: nam2 },
      { val: chang3, age: tuoi3, year: nam3 },
      { val: chang4, age: tuoi4, year: nam4 }
    ],
    thuThach: [thuThach1, thuThach2, thuThach3, thuThach4],
    noNghiep,
    chuKy: { namTheGioi, namCaNhan, thangCaNhan, ngayCaNhan }
  };
}
```

---

## 6. Bản đồ Vận Mệnh SVG Tương Tác Trực Quan (Interactive Map)

Bản đồ được vẽ bằng **SVG nội tuyến (Inline SVG)** có kích thước chuẩn `viewBox="0 0 600 640"` với nền trắng tinh khôi, hình khối kim cương đối xứng tuyệt đối.

### 6.1. Tọa độ hình học chi tiết các điểm nút
- **Trưởng thành**: Đỉnh cao nhất `(300, 52)` (bán kính $r=25$).
- **Đường đời**: Đỉnh trái `(115, 235)` (bán kính $r=25$).
- **Sứ mệnh**: Đỉnh phải `(485, 235)` (bán kính $r=25$).
- **Linh hồn**: Đáy hình thoi `(300, 440)` (bán kính $r=25$).
- **Ngày sinh**: `(115, 440)` thẳng đứng 90° so với Đường đời qua đường `<line x1="115" y1="415" x2="115" y2="260">`.
- **Nhân cách**: `(485, 440)` thẳng đứng 90° so với Sứ mệnh qua đường `<line x1="485" y1="260" x2="485" y2="415">`.
- **Liên kết Đường đời – Sứ mệnh (LK)**: `(300, 155)` (bán kính $r=21$).
- **Cung cong Đường đời – Sứ mệnh**: `<path d="M 132 218 Q 300 92 468 218">` — 2 đầu vòng cung chạm đúng vào 2 đầu của đường liên kết tại `(132, 218)` và `(468, 218)`, đỉnh cung cong chạm đúng nốt LK `(300, 155)`.
- **Hai vạch ngang Nợ nghiệp & Thái độ**: Đối xứng qua trục giữa tại cao độ `y = 135`:
  - Nợ nghiệp: Nối từ `x = 75` chạm vào đường chéo tại `(216, 135)`. Số ở trên đường kẻ, chữ ở dưới.
  - Thái độ: Nối từ `x = 525` chạm vào đường chéo tại `(384, 135)`. Số ở trên đường kẻ, chữ ở dưới.
- **Vòng cung Chỉ số thiếu (to hơn)**: `<path d="M 143 400 A 42 42 0 0 1 227 400 L 211 400 A 26 26 0 0 0 159 400 Z">` (Bán kính ngoài $R=42$, bán kính trong $r=26$).
- **Cụm Năm thế giới & Chu kỳ cá nhân**: Nằm trọn vẹn trong vùng tứ giác tạo bởi 4 nốt **Linh hồn, Sứ mệnh, Nhân cách, LK LH-NC**:
  - `Năm TG`: Nhãn tại `x = 442, y = 327`, ô số tại `x = [448 → 475]`, cao độ `y = 314`.
  - `Năm CN`: Nhãn tại `x = 442, y = 352`, ô số tại `x = [448 → 475]`, cao độ `y = 339`.
  - `Tháng CN`: Nhãn tại `x = 442, y = 377`, ô số tại `x = [448 → 475]`, cao độ `y = 364`.
  - `Ngày CN`: Nhãn tại `x = 442, y = 402`, ô số tại `x = [448 → 475]`, cao độ `y = 389`.

### 6.2. Mã xử lý tương tác click đổi màu trong JavaScript
Người dùng bấm chuột vào các ô sẽ tự động đổi màu đánh dấu trực quan:

```javascript
// Đổi màu ô hình chữ nhật (Chặng, Thử thách, Chu kỳ cá nhân)
function handleRectClick(rectEl, defaultColor, toggleColor) {
  if (rectEl.getAttribute('data-toggled') === 'true') {
    rectEl.style.fill = defaultColor;
    rectEl.removeAttribute('data-toggled');
  } else {
    rectEl.style.fill = toggleColor;
    rectEl.setAttribute('data-toggled', 'true');
  }
}

// Đổi màu hình vòm Chỉ số thiếu hoặc bầu dục Đam mê
function handleShapeClick(shapeEl, defaultFill, toggleFill, defaultStroke, toggleStroke) {
  if (shapeEl.getAttribute('data-toggled') === 'true') {
    shapeEl.style.fill = defaultFill;
    if (defaultStroke) shapeEl.style.stroke = defaultStroke;
    shapeEl.removeAttribute('data-toggled');
  } else {
    shapeEl.style.fill = toggleFill;
    if (toggleStroke) shapeEl.style.stroke = toggleStroke;
    shapeEl.setAttribute('data-toggled', 'true');
  }
}
```

---

## 7. Hệ Thống Cơ Sở Dữ Liệu Bằng File CSV & Bộ Parser JavaScript

Thay vì cài đặt cơ sở dữ liệu cồng kềnh, toàn bộ nội dung luận giải được lưu trữ trong file `data/chi_so_y_nghia.csv`.

### 7.1. Cấu trúc file `data/chi_so_y_nghia.csv`
File CSV gồm 5 cột:
- `key`: Mã định danh chỉ số (ví dụ: `duongDoi`, `suMenh`, `linhHon`).
- `value`: Giá trị con số (ví dụ: `1`, `2`, `11`, `22`).
- `name`: Tên tiếng Việt của chỉ số.
- `short_desc`: Tóm tắt ngắn gọn năng lượng (hiển thị ngoài thẻ card).
- `full_meaning`: Bài phân tích chi tiết chuyên sâu (hiển thị khi mở popup modal).

*Ví dụ trích đoạn file CSV:*
```csv
key,value,name,short_desc,full_meaning
duongDoi,1,Đường đời,Nhà lãnh đạo tiên phong và quyết đoán,"Người mang số Đường đời 1 sinh ra với tố chất tiên phong, tự chủ và độc lập. Bạn có khả năng dẫn dắt người khác và biến ý tưởng thành hiện thực..."
duongDoi,2,Đường đời,Sứ giả hòa bình và kết nối yêu thương,"Người mang số Đường đời 2 sở hữu trực giác nhạy bén, khả năng lắng nghe và sự thấu cảm tuyệt vời..."
duongDoi,11,Đường đời,Bậc thầy trực giác và truyền cảm hứng,"Số Master 11 kết hợp sự nhạy bén của số 2 và tinh thần tiên phong của số 1. Bạn là người mở đường về nhận thức tâm thức..."
duongDoi,22,Đường đời,Kiến trúc sư vĩ đại của thực tại,"Số Master 22 có năng lực biến những giấc mơ không tưởng thành hiện thực cụ thể..."
```

### 7.2. Bộ đọc & Phân tích CSV thuần bằng JavaScript (`js/csv-parser.js`)
Một bộ parser chuẩn không chỉ tách theo dấu phẩy thông thường mà còn xử lý chuẩn xác trường hợp nội dung văn bản có chứa dấu phẩy nằm trong cặp ngoặc kép `""`:

```javascript
/**
 * Đọc file CSV từ đường dẫn và trả về danh sách đối tượng JavaScript
 */
async function loadCSV(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Không thể tải file ${filePath}`);
    const text = await response.text();
    return parseCSVText(text);
  } catch (error) {
    console.error('Lỗi khi đọc file CSV:', error);
    return [];
  }
}

/**
 * Thuật toán tách dòng và cột CSV chuẩn xác
 */
function parseCSVText(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Lấy dòng đầu tiên làm tiêu đề các cột (headers)
  const headers = parseCSVLine(lines[0]);
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    if (row.length === headers.length) {
      const entry = {};
      headers.forEach((header, index) => {
        entry[header.trim()] = row[index].trim();
      });
      records.push(entry);
    }
  }
  return records;
}

/**
 * Tách một dòng CSV có xử lý dấu ngoặc kép ""
 */
function parseCSVLine(line) {
  const values = [];
  let currentVal = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        currentVal += '"';
        i++; // Bỏ qua dấu ngoặc kép thoát (escape quote)
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(currentVal);
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  values.push(currentVal);
  return values;
}
```

---

## 8. Tương tác Người dùng: Lọc Thẻ, Tìm Kiếm, Modal & Xuất Ảnh/In PDF

Trong file `js/main.js`, chúng ta tích hợp toàn bộ các tính năng người dùng:

### 8.1. Tìm kiếm không dấu & Lọc theo Danh mục
Người dùng gõ tiếng Việt có dấu hay không dấu đều lọc ra đúng thẻ chỉ số mong muốn:

```javascript
let allMeaningsData = []; // Nạp từ CSV

// Nạp dữ liệu CSV khi trang tải xong
window.addEventListener('DOMContentLoaded', async () => {
  allMeaningsData = await loadCSV('data/chi_so_y_nghia.csv');
  console.log('Đã nạp thành công database CSV:', allMeaningsData.length, 'bản ghi');
});

// Xử lý ô tìm kiếm nhanh
document.getElementById('search-indicator').addEventListener('input', (e) => {
  const query = removeVietnameseTones(e.target.value);
  const cards = document.querySelectorAll('.indicator-card');

  cards.forEach(card => {
    const title = removeVietnameseTones(card.querySelector('.card-title').innerText);
    const desc = removeVietnameseTones(card.querySelector('.card-desc').innerText);
    if (title.includes(query) || desc.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
```

### 8.2. Mở Modal hiển thị luận giải chi tiết từ Database CSV
Khi người dùng bấm vào thẻ chỉ số hoặc đúp chuột vào nốt trên bản đồ SVG:

```javascript
function openMeaningModal(indicatorKey, numberVal) {
  // Tìm kiếm bài luận giải trong mảng nạp từ file CSV
  const record = allMeaningsData.find(item => 
    item.key === indicatorKey && String(item.value) === String(numberVal)
  );

  const modal = document.getElementById('meaning-modal');
  const titleEl = document.getElementById('modal-title');
  const numEl = document.getElementById('modal-number');
  const contentEl = document.getElementById('modal-content');

  if (record) {
    titleEl.innerText = record.name;
    numEl.innerText = record.value;
    contentEl.innerHTML = `<p>${record.full_meaning.replace(/\n/g, '<br>')}</p>`;
  } else {
    titleEl.innerText = 'Đang cập nhật nội dung';
    numEl.innerText = numberVal;
    contentEl.innerHTML = '<p>Nội dung chi tiết cho chỉ số này đang được biên soạn thêm trong file CSV.</p>';
  }

  modal.classList.add('active');
}

// Đóng modal khi bấm dấu X hoặc bấm ra ngoài
document.getElementById('modal-close-btn').addEventListener('click', () => {
  document.getElementById('meaning-modal').classList.remove('active');
});
```

### 8.3. Hỗ trợ In / Xuất PDF sắc nét (CSS `@media print`)
Chỉ cần bấm tổ hợp phím `Ctrl + P`, landing page tự động tối ưu phông nền trắng, ẩn thanh menu và các nút thừa, căn chỉnh vừa khít trang giấy A4 để in hoặc lưu thành file PDF làm quà tặng:

```css
@media print {
  .site-header, .filter-bar, .modal-backdrop, .btn {
    display: none !important;
  }
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }
  .svg-container {
    box-shadow: none !important;
    border: none !important;
    page-break-inside: avoid;
  }
  .indicator-card {
    page-break-inside: avoid;
    border: 1px solid #cbd5e1 !important;
  }
}
```

---

## 9. Hướng Dẫn Triển Khai & Chạy Thực Tế (Quickstart)

### Bước 1: Mở dự án trong Visual Studio Code
1. Mở thư mục dự án chứa file `index.html`.
2. Cài đặt tiện ích mở rộng (**Extension**) có tên **Live Server** (do Ritwick Dey phát triển).

### Bước 2: Chạy thử trên trình duyệt
1. Nhấp chuột phải vào file `index.html` trong VS Code.
2. Chọn **"Open with Live Server"**.
3. Trình duyệt sẽ tự động mở trang web tại địa chỉ `http://127.0.0.1:5500`.
   *(Lưu ý: Dùng Live Server giúp hàm `fetch()` đọc file CSV nội bộ mà không bị trình duyệt chặn lỗi CORS Security).*

### Bước 3: Triển khai miễn phí lên Internet (GitHub Pages)
1. Tạo một repository mới trên GitHub (ví dụ: `thansohoc-pythagoras`).
2. Đẩy (push) toàn bộ mã nguồn lên repository.
3. Vào mục **Settings** $\rightarrow$ **Pages** $\rightarrow$ chọn nhánh `main` và thư mục `/root` $\rightarrow$ bấm **Save**.
4. Sau 1 phút, bạn sẽ có ngay một trang landing page hoạt động 24/7 hoàn toàn miễn phí trên toàn thế giới!

---

> 💡 **Lời khuyên cho người mới học**:
> - Hãy thử mở file `data/chi_so_y_nghia.csv` bằng Microsoft Excel, gõ thêm các bài phân tích theo phong cách riêng của bạn rồi lưu lại và nhấn F5 trên trình duyệt để thấy kết quả thay đổi tức thì!
> - Việc làm chủ bộ ba **HTML5 - CSS3 - JavaScript** kết hợp cấu trúc dữ liệu **CSV** là bước đệm vững chắc nhất để bạn tự tin phát triển bất kỳ sản phẩm web thực tế nào trong tương lai.
