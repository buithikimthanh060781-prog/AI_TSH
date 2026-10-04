# Các chức năng đã xây dựng — Thần Số Học Pytago

Tài liệu liệt kê toàn bộ chức năng hiện có trong ứng dụng, viết theo góc nhìn "app này làm được
gì" (khác với `CACH_TINH_CHI_SO.md` — tài liệu đó chỉ nói riêng về công thức tính 23 chỉ số).
Mỗi mục nêu: chức năng làm gì, ai dùng được, và file nào trong code chịu trách nhiệm.

---

## 1. Tra cứu & Bản đồ Thần Số Học (chức năng lõi)

**File chính**: `public/index.html`, `public/js/main.js`, `public/js/data.js`

- Form nhập họ tên + ngày/tháng/năm sinh, kiểm tra hợp lệ (họ tên tối thiểu 2 chữ cái không số,
  ngày sinh có thật — vd chặn 31/2 — và không ở tương lai).
- Tự động chuyển họ tên có dấu → không dấu, hiển thị khung so sánh "Tên có dấu → Tên không dấu".
- Tính đầy đủ **23 chỉ số** (Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Trưởng thành, Ngày sinh,
  Thái độ, Tư duy lý trí, Cân bằng, Đam mê, Chỉ số thiếu, Sức mạnh tiềm thức, 2 chỉ số Liên kết,
  4 Chặng đỉnh cao, 4 Thử thách, Nợ nghiệp) — công thức chi tiết xem `CACH_TINH_CHI_SO.md`.
- Vẽ **bản đồ SVG trực quan**: các vòng tròn chỉ số, đường nối, 2 cung cong cho Liên kết
  ĐĐ–SM, hiển thị mốc tuổi/năm của từng Chặng.
  - Bấm 1 lần vào vòng tròn → đổi màu đánh dấu (xanh dương ⇄ xanh lá).
  - Bấm đúp → mở modal diễn giải ý nghĩa chi tiết của chỉ số đó.
  - Mỗi chỉ số rút gọn (Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Ngày sinh, Trưởng thành) hiện
    thêm **số trước khi rút gọn** bằng font nhỏ ngay dưới số chính.
- **Danh sách thẻ 23 chỉ số** kèm bộ lọc theo nhóm (Cốt lõi / Bổ trợ / 4 Đỉnh cao / 4 Thử thách
  / Đặc biệt) và ô tìm kiếm nhanh (gõ không dấu vẫn tìm được).
- **Sơ đồ quy đổi chữ cái**: xem từng ký tự trong họ tên được quy đổi ra số ra sao, phân biệt
  nguyên âm/phụ âm, tổng từng từ.
- **Bảng quy đổi Hệ Pythagoras** hiển thị tham khảo trên trang.
- Tự lưu lần tra cứu gần nhất vào `localStorage` để khôi phục khi quay lại trang.
- Nút **In / Lưu PDF** (dùng khổ in riêng qua CSS `@media print`).
- **Lưu ảnh kết quả**: xuất ảnh PNG (vẽ bằng canvas ngay trên trình duyệt) gồm họ tên và chỉ số
  Đường đời để chia sẻ mạng xã hội — dùng được cả khi chưa đăng nhập.
- Năm thế giới + Chu kỳ cá nhân (Năm/Tháng/Ngày cá nhân) tính theo **ngày truy cập hiện tại**,
  hiển thị cạnh bản đồ.

## 2. Đăng ký miễn phí để mở khoá toàn bộ chỉ số

**File chính**: `public/js/main.js`, `server/routes/auth.js`, `server/lib/session.js`

- Khách chưa đăng nhập chỉ xem được **2 chỉ số** (mặc định Đường đời, Sứ mệnh — cấu hình ở hằng
  `CHI_SO_MIEN_PHI`); 21 chỉ số còn lại hiện khoá 🔒 cả trên bản đồ lẫn danh sách thẻ.
- Bấm vào ô đang khoá → mở modal đăng ký/đăng nhập ngay tại chỗ (không chuyển trang).
- Đăng ký chỉ cần email + mật khẩu (≥ 6 ký tự). Mật khẩu băm bằng bcryptjs, không lưu dạng thô.
- Phiên đăng nhập dùng cookie `tsh_sid` (httpOnly, 30 ngày), lưu trong bảng `sessions`.

## 3. Xác thực email

**File chính**: `server/routes/auth.js`, `server/lib/email.js`

- Đăng ký xong, hệ thống gửi email chứa link kích hoạt (hiệu lực 24 giờ).
- Tài khoản **chưa xác thực** chỉ được tra cứu tối đa **1 lần** — lần thứ 2 trở đi bị chặn ở
  tầng server (không chỉ ẩn ở giao diện), hiện banner kèm nút "Gửi lại email xác thực".
- Bấm link trong email → xác thực xong, tra cứu không giới hạn số lần.
- Tài khoản tạo từ **trước khi có tính năng này** tự động được coi là đã xác thực, không bị
  khoá ngược.

## 4. Quên mật khẩu

**File chính**: `public/forgot-password.html`, `public/reset-password.html`, `server/routes/auth.js`

- Link "Quên mật khẩu?" ở form đăng nhập → nhập email → nhận link đặt lại (hiệu lực 1 giờ).
- Đặt mật khẩu mới xong, hệ thống **tự đăng xuất khỏi mọi thiết bị đang đăng nhập** (thông lệ
  bảo mật chuẩn khi đổi mật khẩu) và gửi thêm 1 email thông báo đã đổi mật khẩu.
- Luôn trả cùng 1 thông báo chung dù email có tồn tại hay không, tránh lộ email đã đăng ký.

## 5. Lịch sử tra cứu

**File chính**: `server/routes/lookups.js`, `public/js/main.js`

- Thành viên đã đăng nhập thấy thêm mục "Lịch sử tra cứu" trên menu.
- Xem lại tối đa 50 lần tra cứu gần nhất (họ tên, ngày sinh, thời điểm tra cứu).
- Bấm vào 1 dòng → tự điền lại form và tra cứu ngay.

## 6. Giới hạn 2 thiết bị / tài khoản

**File chính**: `server/lib/session.js`, `server/routes/auth.js`, `server/routes/admin.js`

- Mỗi trình duyệt được gán 1 cookie định danh thiết bị riêng (`tsh_device`, sống 400 ngày,
  không đổi khi đăng xuất/đăng nhập lại trên cùng trình duyệt).
- Khi đăng nhập, server đếm số thiết bị **khác nhau** đang có phiên còn hạn của tài khoản đó —
  thiết bị thứ 3 trở đi bị **từ chối đăng nhập** (`403 DEVICE_LIMIT`).
- **Chỉ admin gỡ được** thiết bị cũ (mục "Thiết bị" trong trang quản trị) để mở chỗ cho máy mới
  — phù hợp mô hình bán tài khoản thủ công (khách chuyển khoản → admin xác thực/gia hạn).
- Phiên đăng nhập tạo **trước khi có tính năng này** tự "nhận diện ngược" ở lượt gọi tiếp theo,
  không cần khách đăng xuất/đăng nhập lại.
- Giới hạn kỹ thuật: "thiết bị" thực chất là **trình duyệt** (web không đọc được tên máy thật)
  — 2 trình duyệt khác nhau trên cùng 1 máy vẫn tính là 2 thiết bị. Trang admin cho gõ **nhãn
  gợi nhớ** (vd "Laptop Thanh") + hiển thị IP để admin tự nhận diện bằng mắt.

## 7. Cảnh báo đăng nhập bất thường (nghi chia sẻ tài khoản)

**File chính**: `server/routes/admin.js`

- Trang admin tự gắn nhãn **"⚠ Nghi vấn"** cạnh email khi 1 tài khoản có 2 thiết bị đăng nhập
  từ **2 IP khác nhau** trong vòng 6 giờ liên tiếp (dấu hiệu 2 người ở 2 nơi dùng chung tài khoản).
- Mở mục "Thiết bị" sẽ thấy đúng 2 dòng bị bôi đỏ kèm lý do.
- Chỉ mang tính **gợi ý cho admin tự xem xét** — không tự động khoá hay đăng xuất ai, vì chỉ so
  sánh địa chỉ IP (không dùng vị trí địa lý thật) nên vẫn có thể báo nhầm.

## 8. Trang quản trị (Admin Panel)

**File chính**: `public/admin-login.html`, `public/admin.html`, `public/js/admin.js`,
`server/routes/admin.js`, `server/lib/adminSession.js`

- Đăng nhập bằng username + mật khẩu riêng (`ADMIN_USERNAME`/`ADMIN_PASSWORD` trong `.env`),
  **hoàn toàn tách biệt** với tài khoản người dùng thường (cookie, phiên đăng nhập riêng).
- Server tự chặn truy cập thẳng `admin.html` khi chưa đăng nhập (redirect về trang đăng nhập,
  không chỉ kiểm tra bằng JavaScript phía trình duyệt).
- Xem danh sách toàn bộ tài khoản đã đăng ký: email, ngày đăng ký, lần đăng nhập gần nhất,
  hạn dùng, trạng thái.
- Gia hạn nhanh (+7 / +30 / +90 / +365 ngày), đặt hạn dùng mới, hoặc chuyển về "Không giới hạn".
- Xoá tài khoản (phải gõ lại đúng email để xác nhận, tránh xoá nhầm).
- Xem/gỡ thiết bị, đặt nhãn thiết bị, xem cảnh báo bất thường (mục 6–7).
- Tìm kiếm nhanh theo email.

## 9. Trang Kiến thức (CMS bài viết công khai)

**File chính**: `public/kien-thuc.html`, `public/bai-viet.html`, `public/admin-posts.html`,
`public/js/admin-posts.js`, `server/routes/posts.js`, `server/routes/adminPosts.js`,
`server/routes/adminUploads.js`, `server/lib/content.js`

- **Trang công khai** `kien-thuc.html`: bố cục kiểu landing page — hero kèm ô tìm kiếm, bài viết
  mới nhất hiện dạng thẻ lớn nổi bật, lưới các bài còn lại, khối kêu gọi quay lại trang tra cứu.
  Tìm kiếm lọc theo tiêu đề/mô tả ngắn ngay trên trình duyệt, không cần tải lại trang.
- **Trang chi tiết** `bai-viet.html?slug=...`: đọc theo đường dẫn riêng từng bài, hiện ngày đăng
  + thời gian đọc ước tính, nội dung đầy đủ, nút quay lại danh sách.
- **Soạn bài ở `admin-posts.html`** bằng trình soạn thảo Quill (tải qua CDN, cần Internet):
  định dạng đậm/nghiêng/gạch chân, tiêu đề, danh sách, trích dẫn, căn lề, chèn link, chèn ảnh.
  - Nút 📎 **đính kèm tệp** (pdf, doc, docx, xls, xlsx, ppt, pptx, zip, txt — tối đa 15MB),
    tự chèn thành link tải trong bài viết.
  - Ảnh bìa riêng cho từng bài (dán link hoặc tải file lên).
  - Lưu **nháp** (chỉ admin xem được qua chính URL công khai, dùng để xem trước) hoặc **đăng**
    công khai ngay.
- Toàn bộ nội dung HTML do trình soạn thảo sinh ra đều được **khử trùng (sanitize)** trước khi
  lưu — chặn chèn mã độc (`<script>`, thuộc tính `onerror`, link `javascript:`...) dù chỉ admin
  mới đăng bài được, phòng trường hợp phiên admin bị lộ vẫn không ảnh hưởng tới khách truy cập.
- Tệp tải lên lưu ở `data/uploads/`, chỉ cho phép định dạng an toàn (chặn `.svg`/`.html` vì có
  thể chứa mã script), phục vụ kèm header `X-Content-Type-Options: nosniff`.
- Slug (đường dẫn bài viết) tự sinh từ tiêu đề, tự thêm hậu tố `-2`, `-3`... nếu trùng.

## 10. Trang Liên hệ

**File chính**: `public/lienhe.html`, `public/js/main.js`, dữ liệu ở `public/js/data.js`

- 4 thẻ thông tin nhanh (địa chỉ, điện thoại, email, giờ làm việc).
- Bản đồ Google Maps nhúng sẵn đường đi tới văn phòng.
- Biểu mẫu gửi câu hỏi: kiểm tra hợp lệ từng trường, đếm ký tự, thông báo xác nhận sau khi gửi.
- Accordion câu hỏi thường gặp (FAQ), lấy dữ liệu từ `js/data.js`.

## 11. Hạ tầng & tiện ích dùng chung

- **Database SQLite** (`node:sqlite`, dựng sẵn trong Node ≥ 22.5, không cần cài thêm/build
  native) — bảng `users`, `sessions`, `admin_sessions`, `password_resets`, `lookups`,
  `device_labels`, `posts`.
- **Responsive** đầy đủ trên điện thoại/máy tính bảng/máy tính — menu rút gọn thành nút ☰ trên
  màn hình nhỏ, bản đồ tự co giãn.
- **Hiệu ứng giao diện dùng chung**: xuất hiện khi cuộn (`IntersectionObserver`), đánh dấu mục
  menu đang xem, nút "Lên đầu trang", modal dùng chung cho nhiều chức năng (diễn giải chỉ số,
  đăng ký/đăng nhập, xác nhận xoá, soạn bài viết...).
- **Giới hạn tần suất (rate limit)** cho các API nhạy cảm: đăng ký/đăng nhập, quên mật khẩu,
  gửi lại email xác thực, lưu lịch sử tra cứu, đăng nhập admin, upload tệp — chống spam/brute-force.
- **Chế độ DEV cho email**: chưa cấu hình SMTP thật thì hệ thống tự log link xác thực/đặt lại
  mật khẩu ra terminal thay vì gửi mail, giúp tự test toàn bộ luồng mà không cần hộp thư thật.

---

## Tổng hợp theo đối tượng sử dụng

| Đối tượng | Dùng được chức năng |
|---|---|
| Khách chưa đăng ký | Tra cứu 2 chỉ số miễn phí, lưu ảnh kết quả, xem trang Kiến thức/Liên hệ |
| Thành viên đã đăng ký | + Xem đủ 23 chỉ số, lịch sử tra cứu, dùng trên tối đa 2 thiết bị |
| Thành viên chưa xác thực email | Chỉ 1 lần tra cứu đầy đủ, phải xác thực mới tra cứu tiếp |
| Admin | Quản lý tài khoản (xem/gia hạn/xoá/gỡ thiết bị), soạn & đăng bài viết Kiến thức |

Xem thêm `README.md` (hướng dẫn cài đặt, cấu trúc thư mục, cấu hình `.env`) và
`CACH_TINH_CHI_SO.md` (công thức chi tiết 23 chỉ số).
