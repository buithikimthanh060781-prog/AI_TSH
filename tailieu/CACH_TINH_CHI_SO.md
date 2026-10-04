# Cách tính các chỉ số — Thần Số Học Pytago

Tài liệu này mô tả **chính xác thuật toán đang chạy trong code** (`public/js/main.js`, hàm
`tinhThanSoHoc()`), không phải bản dịch lại tài liệu gốc — một số điểm đã được điều chỉnh so
với file "bộ công thức tính 21 chỉ số" gốc sau khi đối chiếu với ảnh mẫu bản đồ thực tế và các
yêu cầu chỉnh sửa trong quá trình phát triển (xem ghi chú ở từng mục). Khi cần tra "vì sao lại
tính thế này", đây là nguồn chính xác nhất — đối chiếu trực tiếp với code tại
`public/js/main.js` hàm `tinhThanSoHoc()` (dòng 153 trở đi) nếu nghi ngờ tài liệu lỗi thời.

## 0. Quy ước nền tảng

### 0.1. Chuyển họ tên có dấu → không dấu

Họ tên nhập vào được chuyển thành không dấu, viết hoa, gộp khoảng trắng thừa (hàm `boDau()`).
Ví dụ: `"Hoàng Sơ Hiền"` → `"HOANG SO HIEN"`.

### 0.2. Bảng quy đổi ký tự → số (Hệ Pythagoras)

| Số | Chữ cái |
|----|---------|
| 1  | A, J, S |
| 2  | B, K, T |
| 3  | C, L, U |
| 4  | D, M, V |
| 5  | E, N, W |
| 6  | F, O, X |
| 7  | G, P, Y |
| 8  | H, Q, Z |
| 9  | I, R    |

### 0.3. Nguyên âm / phụ âm — quy tắc chữ Y

`A, E, I, O, U` luôn là nguyên âm. Chữ **Y** là nguyên âm nếu nó **đứng độc lập hoặc không kề
cạnh một nguyên âm khác** (xét ký tự liền trước/liền sau trong cùng 1 từ); nếu kề một nguyên âm
(trước hoặc sau) thì Y được tính là **phụ âm**.

### 0.4. Hai kiểu rút gọn

- **`RM` (giữ số bậc thầy)**: cộng dồn các chữ số cho tới khi còn 1 chữ số, nhưng **dừng lại**
  nếu gặp 11, 22 hoặc 33 ở bất kỳ bước nào.
- **`RN` (rút gọn triệt để)**: cộng dồn tới khi còn đúng 1 chữ số (1–9), không giữ lại gì.
- **`RM10`**: biến thể giữ thêm cả 10 (chỉ dùng riêng cho Chặng 4).

Ví dụ: `RM(29)` → 2+9=11 → dừng lại ở **11** (số bậc thầy). `RN(29)` → 2+9=11 → 1+1=**2**.

### 0.5. Phân tích từng từ trong họ tên

Họ tên không dấu được tách theo khoảng trắng thành từng **từ** (ví dụ "HOANG", "SO", "HIEN").
Với mỗi từ, tính 3 tổng: `tong` (tổng toàn bộ ký tự), `tongNA` (tổng riêng các ký tự là nguyên
âm), `tongPA` (tổng riêng các ký tự là phụ âm).

---

## 1. Đường đời (`duongDoi`)

```
tongNam = tổng các chữ số của năm sinh          (vd 1998 → 1+9+9+8 = 27)
tongNgayThangNam = RM(ngày) + RM(tháng) + RM(tongNam)
Đường đời = RM(tongNgayThangNam)
```

Ví dụ (6/7/1981): `RM(6)=6`, `RM(7)=7`, `tongNam=1+9+8+1=19` → `RM(19)`: 19 không phải 11/22/33
nên rút gọn tiếp `1+9=10`, rồi `1+0=1` → `RM(19)=1`. Vậy `tongNgayThangNam = 6+7+1 = 14` →
Đường đời = `RM(14) = 1+4 = 5`.

> **Số trước khi rút gọn** của Đường đời = `tongNgayThangNam` (ở ví dụ trên là 14) — đây là giá
> trị hiển thị font nhỏ dưới chỉ số Đường đời trên bản đồ, và cũng là 1 trong các số được xét
> cho **Nợ nghiệp** (mục 23).

## 2. Sứ mệnh (`suMenh`)

```
Với mỗi từ trong họ tên: rút gọn RIÊNG tổng ký tự của từ đó bằng RN  → RN(tong của từ)
tongToanTen = cộng tất cả các giá trị RN(tong của từ) lại
Sứ mệnh = RN(tongToanTen)
```

**Quan trọng**: rút gọn TỪNG TỪ trước rồi mới cộng lại — **không** cộng thô toàn bộ họ tên rồi
rút gọn một lần duy nhất. Cùng kiểu với cách tính Đường đời (`RM(Ngày)+RM(Tháng)+RM(Năm)` rồi
mới rút gọn lần cuối). Ví dụ từ "BUI" trong "BUI THI KIM THANH": B+U+I = 2+3+9 = 14 →
`RN(14)=1+4=5` — lấy 5 (không phải 14) để cộng vào `tongToanTen`, mỗi từ khác trong họ tên cũng
được rút gọn riêng kiểu này trước khi cộng chung lại.

> Số trước khi rút gọn = `tongToanTen` (tổng các `RN(tong từ)` đã cộng lại, trước lần `RN` cuối
> cùng). Cũng là 1 trong các số xét Nợ nghiệp.

## 3. Linh hồn (`linhHon`) — tính theo nguyên âm

```
Với mỗi từ: RM(tongNA của từ)   (tongNA = tổng các ký tự LÀ nguyên âm trong từ đó)
tongNguyenAm = cộng tất cả RM(tongNA của từ) lại
Linh hồn = RM(tongNguyenAm)
```

Dùng `RM` (giữ 11/22/33) cho cả bước rút gọn từng từ lẫn bước rút gọn cuối — khác với Sứ mệnh
dùng `RN`. Số trước khi rút gọn = `tongNguyenAm`.

## 4. Nhân cách (`nhanCach`) — tính theo phụ âm

```
Với mỗi từ: RM(tongPA của từ)   (tongPA = tổng các ký tự LÀ phụ âm trong từ đó)
tongPhuAm = cộng tất cả RM(tongPA của từ) lại
Nhân cách = RM(tongPhuAm)
```

Y hệt cấu trúc Linh hồn nhưng dùng tổng phụ âm thay vì nguyên âm. Số trước khi rút gọn =
`tongPhuAm`.

## 5. Trưởng thành (`truongThanh`)

```
Trưởng thành = RM(Đường đời + Sứ mệnh)     (dùng giá trị ĐÃ rút gọn của 2 chỉ số, không phải số thô)
```

Số trước khi rút gọn (hiển thị dưới bản đồ) = `Đường đời + Sứ mệnh` (tổng 2 số đã rút gọn, trước
lần `RM` cuối của Trưởng thành).

## 6. Ngày sinh (`ngaySinh`)

```
Ngày sinh = RM(ngày sinh gốc)
```

Số trước khi rút gọn = chính ngày sinh gốc (vd sinh ngày 16 → số trước rút gọn là 16). Đây cũng
là 1 trong các số xét Nợ nghiệp (sinh ngày 13/14/16/19 thì tự động dính Nợ nghiệp).

## 7. Thái độ (`thaiDo`)

```
Thái độ = RN(ngày sinh + tháng sinh)
```

Dùng số NGÀY và THÁNG gốc (chưa rút gọn riêng), cộng lại rồi rút gọn triệt để bằng `RN`. Số
`ngày + tháng` (trước khi rút gọn) cũng được xét cho Nợ nghiệp.

## 8. Tư duy lý trí (`tuDuyLyTri`)

```
Tư duy lý trí = RN(tong của TỪ CUỐI CÙNG trong họ tên + ngày sinh gốc)
```

"Từ cuối cùng" là từ cuối trong họ tên không dấu (thường là tên — vd "HIEN" trong "HOANG SO
HIEN"), lấy tổng ký tự thô (`tong`, không phân biệt nguyên/phụ âm) của riêng từ đó.

## 9. Cân bằng (`canBang`)

```
Với mỗi từ trong họ tên, lấy ký tự ĐẦU TIÊN, quy đổi ra số theo bảng Pythagoras
Cân bằng = RN(tổng các số đó)
```

Ví dụ "HOANG SO HIEN": chữ cái đầu mỗi từ là H, S, H → quy đổi 8, 1, 8 → tổng 17 → `RN(17)=8`.

## 10–12. Đam mê / Chỉ số thiếu / Sức mạnh tiềm thức

Trước tiên tính **tần suất xuất hiện** của mỗi số 1–9 trong TOÀN BỘ ký tự họ tên (không dấu,
không phân biệt nguyên/phụ âm, không phân biệt từ) sau khi quy đổi qua bảng Pythagoras.

- **Đam mê**: liệt kê các số có tần suất **≥ 2** lần (ngưỡng `NGUONG_DAM_ME`, mặc định 2 —
  tài liệu gốc ghi "> 2" nhưng ảnh mẫu bản đồ cho thấy ngưỡng thực tế là ≥ 2, xem ghi chú trong
  code), sắp xếp giảm dần theo tần suất, nếu bằng tần suất thì sắp theo số tăng dần.
- **Chỉ số thiếu**: liệt kê các số có tần suất **= 0** (hoàn toàn không xuất hiện trong họ tên).
- **Sức mạnh tiềm thức**: `9 − (số lượng các chỉ số thiếu)`. Càng ít số bị thiếu thì tiềm thức
  càng mạnh (tối đa 9 nếu không thiếu số nào).

## 13–14. Hai chỉ số Liên kết

```
LK ĐĐ–SM = RN(|chuẩn hoá(Đường đời) − chuẩn hoá(Sứ mệnh)|)
LK NC–LH = RN(|chuẩn hoá(Nhân cách) − chuẩn hoá(Linh hồn)|)
```

`chuẩn hoá` phụ thuộc cờ cấu hình `GIU_SO_BAC_THAY_KHI_TINH_LIEN_KET` trong code (hiện đang đặt
**`false`**):

- `false` (đang dùng): nếu Đường đời/Sứ mệnh/Nhân cách/Linh hồn là số bậc thầy (11/22/33) thì
  **rút gọn về 1 chữ số bằng `RN` TRƯỚC khi trừ**. Ví dụ Đường đời=22, Sứ mệnh=7 →
  `|RN(22)−RN(7)| = |4−7| = 3`. Khớp với ảnh "mẫu bản đồ" thực tế khách hàng cung cấp.
- `true`: giữ nguyên số bậc thầy khi trừ, chỉ rút gọn kết quả cuối — `|22−7|=15→RN(15)=6`. Đây
  là cách tính đúng theo văn bản gốc "bộ công thức tính 21 chỉ số", nhưng KHÔNG khớp ảnh mẫu.

## 15–18. Bốn Chặng đỉnh cao

```
dN = RN(ngày sinh gốc)       tN = RN(tháng sinh gốc)       nN = RN(tongNam)
Chặng 1 = RM(dN + tN)
Chặng 2 = RM(dN + nN)
Chặng 3 = RM(Chặng 1 + Chặng 2)
Chặng 4 = RM10(tN + nN)        — dùng biến thể RM10, GIỮ LẠI cả số 10 (không chỉ 11/22/33)
```

### Mốc tuổi / năm bắt đầu mỗi chặng

```
tuổi bắt đầu Chặng 1 = 36 − RN(Đường đời)
Chặng 2 bắt đầu ở tuổi đó + 9, Chặng 3 là +18, Chặng 4 là +27
Năm tương ứng = năm sinh + tuổi đó
```

## 19–22. Bốn Thử thách

```
Thử thách 1 = RM(|dN − tN|)
Thử thách 2 = RM(|dN − nN|)
Thử thách 3 = RM(|Thử thách 1 − Thử thách 2|)
Thử thách 4 = RM(|tN − nN|)
```

(`dN, tN, nN` giống hệt biến dùng ở mục 4 Chặng — ngày/tháng/tổng-năm đã rút gọn triệt để bằng
`RN`.)

## 23. Nợ nghiệp (`noNghiep`)

Nợ nghiệp liệt kê những số trong tập `{13, 14, 16, 19}` xuất hiện ở **đúng 1 số chưa-rút-gọn
cuối cùng của mỗi chỉ số** sau đây — **không** xét bất kỳ tổng trung gian nhỏ hơn nào bên trong
quá trình tính (ví dụ không xét tổng riêng từng từ trong họ tên, không xét ngày/tháng/năm tách
rời):

| Chỉ số | Số chưa-rút-gọn dùng để xét |
|---|---|
| Đường đời | `tongNgayThangNam` = RM(ngày)+RM(tháng)+RM(tổng chữ số năm) |
| Sứ mệnh | `tongToanTen` = tổng các `RN(tong từ)` đã cộng lại |
| Linh hồn | `tongNguyenAm` = tổng các `RM(tongNA từ)` đã cộng lại |
| Nhân cách | `tongPhuAm` = tổng các `RM(tongPA từ)` đã cộng lại |
| Thái độ | `ngày sinh + tháng sinh` (số gốc, chưa rút gọn) |
| Ngày sinh | chính ngày sinh gốc (vd sinh ngày 16 → tự động dính nợ nghiệp 16) |

**Ví dụ** — Huỳnh Gia Huy, sinh 16/10/2009: tổng chữ số năm `2+0+0+9=11`. `tongNgayThangNam =
RM(16)+RM(10)+RM(11) = 7+1+11 = 19` (lưu ý `RM(11)` GIỮ NGUYÊN 11 vì là số bậc thầy, không rút
gọn thành 2) — dính **19**. Ngày sinh = 16 — dính **16**. Tổng phụ âm Nhân cách ra 14 — dính
**14**. → **Nợ nghiệp = 14, 16, 19**.

> **Lịch sử điều chỉnh**: phiên bản đầu từng xét luôn tất cả tổng trung gian nhỏ bên trong mỗi
> chỉ số (từng từ riêng lẻ, ngày/tháng/năm tách rời...) khiến Nợ nghiệp báo dư so với quy ước
> chuẩn — đã sửa lại để chỉ xét đúng 1 số đại diện cho mỗi chỉ số như bảng trên.

---

## Các giá trị không thuộc "23 chỉ số" nhưng có hiển thị trên bản đồ

### Năm thế giới & Chu kỳ cá nhân (tính theo ngày hôm nay, không cố định theo ngày sinh)

```
Năm thế giới = RN(năm hiện tại)                              — vd 2026 → 2+0+2+6=10→1+0=1
Năm cá nhân  = RN(RN(ngày sinh) + RN(tháng sinh) + RN(năm hiện tại))
Tháng cá nhân = RN(Năm cá nhân + tháng hiện tại)
Ngày cá nhân  = RN(Tháng cá nhân + ngày hiện tại)
```

Các giá trị này đổi theo từng ngày truy cập (không lưu cố định theo bản đồ), dùng `RN` (rút gọn
triệt để) ở mọi bước.

---

## Nguồn tham chiếu kiểm chứng

Ví dụ chuẩn dùng để kiểm thử mỗi khi sửa công thức — **HOANG SO HIEN, sinh 11/3/2024**:

| Chỉ số | Giá trị | Chỉ số | Giá trị |
|---|---|---|---|
| Đường đời | 22 | LK ĐĐ–SM | 3 |
| Sứ mệnh | 7 | LK NC–LH | 2 |
| Linh hồn | 9 | Nợ nghiệp | 14 |
| Nhân cách | 7 | | |

Xem thêm `README.md` mục "Quy ước tính toán quan trọng" và "Kiểm chứng kết quả" để biết toàn bộ
bảng chỉ số của ca mẫu này.
