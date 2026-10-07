# ĐẶC TẢ – PHÂN TÍCH TỪ TRƯỜNG SỐ ĐIỆN THOẠI

## 1. Mục tiêu
Xây dựng chức năng phân tích số điện thoại cho Landing Page thần số học. Đầu vào là số điện thoại; hệ thống phải tách số thành các cụm theo đúng thuật toán trong `congthuctinhsdt.txt`, xác định từ trường của từng cụm bằng bảng `NLSO` trong `tra cuu sdt.xlsx`, sau đó ghép từng từ trường liên tiếp và tra kết luận trong bảng `KET LUAN`.

**Nguồn chuẩn:**
- `congthuctinhsdt.txt`: công thức tách số và chuyển cụm số thành từ trường.
- `tra cuu sdt.xlsx` – sheet `NLSO`: mã số → từ trường.
- `tra cuu sdt.xlsx` – sheet `KET LUAN`: cặp từ trường → kết luận.

> Không tự ý thay đổi quy tắc 0/5 hoặc tự suy diễn kết luận ngoài dữ liệu nguồn.

## 2. Pipeline xử lý
```text
Số điện thoại
   ↓
Chuẩn hóa: chỉ giữ chữ số; nếu bắt đầu bằng 0 thì bỏ số 0 đầu
   ↓
Tạo các cặp số liên tiếp
   ↓
TachSoDienThoai1
   ↓
Các cụm số /
   ↓
TachNangLuongSo
   ↓
Từ trường tương ứng của từng cụm
   ↓
Ghép từng từ trường liên tiếp
   ↓
Tra KET LUAN
   ↓
Danh sách cặp + kết luận + điểm (nếu có)
```
## 3. Chuẩn hóa số điện thoại
1. Loại bỏ khoảng trắng, dấu `-`, `.`, `(`, `)` và các ký tự không phải số.
2. Nếu chuỗi bắt đầu bằng `0`, bỏ đúng 1 số `0` đầu tiên.
3. Không tự thêm mã quốc gia nếu người dùng nhập số không bắt đầu bằng 0; việc đổi `+84` sang `0` phải là một bước tùy chọn riêng nếu sau này cần hỗ trợ.
4. Sau chuẩn hóa phải kiểm tra độ dài hợp lệ trước khi phân tích.

**Nguồn công thức:** hàm `TachSoDienThoai1` bỏ số 0 đầu rồi tạo các cặp số liên tiếp. fileciteturn0file0L80-L94

## 4. Công thức tách cụm số – `TachSoDienThoai1`
### 4.1. Tạo cặp
Với chuỗi sau khi bỏ số 0 đầu, tạo:
```text
pair[i] = phone[i..i+1]
```
tức các cặp chồng lấn: `12, 23, 34, 45...`.

### 4.2. Quy tắc cặp không chứa 0 và 5
- Nếu cặp hiện tại không chứa `0` và không chứa `5`:
  - Nếu cặp kế tiếp không chứa `0`: giữ nguyên cặp hiện tại.
  - Nếu cặp kế tiếp có `0`: thêm `0` vào sau cặp hiện tại.
Nguồn: `TachSoDienThoai1`. fileciteturn0file0L112-L120

### 4.3. Quy tắc cặp chứa 0
- Nếu cặp hiện tại chứa `0` và cặp kế tiếp cũng chứa `0`:
  - Tạo `newPair = ký_tự_đầu_cặp_hiện_tại + 0 + ký_tự_cuối_cặp_kế_tiếp`.
  - Trường hợp đặc biệt khi hai đầu tạo thành `00`: dùng `ký_tự_đầu_cặp_hiện_tại + nextPair`.
  - Chỉ đưa cụm vào kết quả khi thỏa điều kiện kiểm tra `00`/ký tự đầu-cuối của công thức nguồn.
- Nếu cặp hiện tại chứa `0` nhưng cặp kế tiếp không chứa `0`:
  - Nếu hai ký tự của cặp kế tiếp giống nhau, ghép `currentPair + ký_tự_đầu(nextPair)`.
  - Ngược lại ghép `currentPair + nextPair` rồi gọi `RemoveOneDuplicateChar` để bỏ 1 lần xuất hiện dư của ký tự bị lặp.
  - Sau đó đánh dấu `temp = nextPair` để không xử lý lại cặp kế tiếp.
Nguồn: fileciteturn0file0L121-L144

### 4.4. Quy tắc cặp chứa 5
- Nếu cặp hiện tại chứa `5` và cặp kế tiếp cũng chứa `5`: tạo `ký_tự_đầu(currentPair) + '5' + ký_tự_cuối(nextPair)`.
- Nếu cặp kế tiếp không chứa `5`: giữ nguyên cặp hiện tại.
Nguồn: fileciteturn0file0L145-L153

### 4.5. Kết quả
Các cụm được nối bằng `/`, sau đó bỏ dấu `/` cuối.
Nguồn: fileciteturn0file0L160-L165

## 5. Chuyển cụm số thành từ trường – `TachNangLuongSo`
Với từng cụm được tách ở bước 4:
1. Nếu độ dài cụm = 1 → bỏ qua.
2. Nếu độ dài cụm = 2 và chữ số đầu hoặc cuối là `0` → bỏ qua.
3. Nếu có `5`: xóa toàn bộ `5`; ghi nhận phép biến đổi `x 5`.
4. Nếu có `0`: xóa toàn bộ `0`; ghi nhận phép biến đổi `+ 0`.
5. Dùng phần số còn lại để tra bảng `NLSO`.
6. Nếu tìm thấy mã số, lấy tên từ trường tương ứng.
Nguồn: fileciteturn0file0L325-L364

### 5.1. Bảng mã NLSO
| Nhóm | Phục Vị | Thiên Y | Sinh Khí | Diên Niên | Lục Sát | Tuyệt Mệnh | Họa Hại | Ngũ Quỷ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 11 | 13 | 14 | 19 | 16 | 12 | 17 | 18 |
| 1 | 22 | 31 | 41 | 91 | 61 | 21 | 71 | 81 |
| 2 | 88 | 68 | 67 | 78 | 74 | 69 | 98 | 97 |
| 2 | 99 | 86 | 76 | 87 | 47 | 96 | 89 | 79 |
| 3 | 77 | 94 | 93 | 43 | 38 | 37 | 64 | 36 |
| 3 | 66 | 49 | 39 | 34 | 83 | 73 | 46 | 63 |
| 4 | 44 | 72 | 82 | 26 | 92 | 84 | 32 | 42 |
| 4 | 33 | 27 | 28 | 62 | 29 | 48 | 23 | 24 |

Bảng trên được lấy trực tiếp từ sheet `NLSO` của workbook.

## 6. Quy tắc kết luận từ trường
Sau khi có chuỗi từ trường, ví dụ:
```text
SINH KHÍ / THIÊN Y / DIÊN NIÊN / PHỤC VỊ
```
thì tạo các cặp liên tiếp:
```text
SINH KHÍ + THIÊN Y
THIÊN Y + DIÊN NIÊN
DIÊN NIÊN + PHỤC VỊ
```
Mỗi cặp được tra chính xác trong sheet `KET LUAN`. Công thức nguồn dùng `Split(inputString, "/")`, sau đó ghép `mang(i) + " + " + mang(i+1)` và tìm khớp toàn phần. fileciteturn0file0L413-L438

## 7. Dữ liệu kết luận từ `KET LUAN`
Workbook hiện có **72 tổ hợp** kết luận. Khi triển khai website với SQLite, không đọc Excel trực tiếp ở thời điểm người dùng phân tích. Hãy import dữ liệu từ sheet `KET LUAN` vào bảng SQLite `ket_luan`.

Mỗi record nên có:
```text
id
field_from
field_to
code
score
description
```
**Lưu ý:** giữ nguyên nội dung `description` từ workbook; không tự sửa hoặc diễn giải lại nếu mục tiêu là tái hiện công thức hiện tại.

### 7.1. Danh sách 72 mã kết luận
| # | Mã gộp | Điểm |
|---:|---|---:|
| 1 | SINH KHÍ + THIÊN Y | 10 |
| 2 | THIÊN Y + THIÊN Y | 7 |
| 3 | DIÊN NIÊN + THIÊN Y | 10 |
| 4 | HỌA HẠI + THIÊN Y | 9 |
| 5 | PHỤC VỊ + THIÊN Y | 9 |
| 6 | LỤC SÁT + THIÊN Y | 9 |
| 7 | NGŨ QUỶ + THIÊNY | 9 |
| 8 | TUYỆT MỆNH + THIÊN Y | 11 |
| 9 | THIÊN Y + 0 | 9 |
| 10 | SINH KHÍ + SINH KHÍ | 10 |
| 11 | THIÊN Y + SINH KHÍ | 7 |
| 12 | SINH KHÍ + PHỤC VỊ | 9 |
| 13 | PHỤC VỊ + SINH KHÍ | 8 |
| 14 | DIÊN NIÊN + SINH KHÍ | 10 |
| 15 | LỤC SÁT + SINH KHÍ | 8 |
| 16 | HỌA HẠI + SINH KHÍ | 9 |
| 17 | NGŨ QUỶ + SINH KHÍ | 8 |
| 18 | TUYỆT MỆNH + SINH KHÍ | 12 |
| 19 | SINH KHÍ + 0 | 10 |
| 20 | THIÊN Y + NGŨ QUỶ | 8 |
| 21 | SINH KHÍ + NGŨ QUỶ | 10 |
| 22 | DIÊN NIÊN + NGŨ QUỶ | 10 |
| 23 | NGŨ QUỶ + NGŨ QUỶ | 8 |
| 24 | HỌA HẠI + NGŨ QUỶ | 9 |
| 25 | LỤC SÁT + NGŨ QUỶ | 9 |
| 26 | TUYỆT MỆNH + NGŨ QUỶ | 12 |
| 27 | NGŨ QUỶ + 0 | 9 |
| 28 | PHỤC VỊ + NGŨ QUỶ | 8 |
| 29 | THIÊN Y + TUYỆT MỆNH | 8 |
| 30 | SINH KHÍ + TUYỆT MỆNH | 9 |
| 31 | DIÊN NIÊN + TUYỆT MỆNH | 10 |
| 32 | TUYỆT MỆNH + TUYỆT MỆNH | 11 |
| 33 | PHỤC VỊ + TUYỆT MỆNH | 8 |
| 34 | LỤC SÁT + TUYỆT MỆNH | 9 |
| 35 | HỌA HẠI + TUYỆT MỆNH | 8 |
| 36 | NGŨ QUỶ + TUYỆT MỆNH | 9 |
| 37 | TUYỆT MÊNH + 0 | 11 |
| 38 | THIÊN Y + LỤC SÁT | 9 |
| 39 | SINH KHÍ + LỤC SÁT | 9 |
| 40 | DIÊN NIÊN + LỤC SÁT | 10 |
| 41 | PHỤC VỊ + LỤC SÁT | 8 |
| 42 | LỤC SÁT + LỤC SÁT | 8 |
| 43 | HỌA HẠI + LỤC SÁT | 9 |
| 44 | NGŨ QUỶ + LỤC SÁT | 8 |
| 45 | TUYỆT MỆNH + LỤC SÁT | 12 |
| 46 | LỤC SÁT + 0 | 9 |
| 47 | THIÊN Y + HỌA HẠI | 9 |
| 48 | SINH KHÍ + HỌA HẠI | 10 |
| 49 | DIÊN NIÊN + HỌA HẠI | 10 |
| 50 | PHỤC VỊ + HỌA HẠI | 8 |
| 51 | HỌA HẠI + HỌA HẠI | 8 |
| 52 | LỤC SÁT + HỌA HẠI | 8 |
| 53 | NGŨ QUỶ + HỌA HẠI | 8 |
| 54 | TUYỆT MỆNH + HỌA HẠI | 12 |
| 55 | HỌAHẠI + 0 | 8 |
| 56 | THIÊN Y + DIÊN NIÊN | 9 |
| 57 | SINH KHÍ + DIÊN NIÊN | 10 |
| 58 | DIÊN NIÊN + DIÊN NIÊN | 11 |
| 59 | PHỤC VỊ + DIÊN NIÊN | 9 |
| 60 | LỤC SÁT + DIÊN NIÊN | 9 |
| 61 | HỌA HẠI + DIÊN NIÊN | 9 |
| 62 | NGŨ QUỶ + DIÊN NIÊN | 8 |
| 63 | TUYỆT MỆNH + DIÊN NIÊN | 11 |
| 64 | DIÊN NIÊN + 0 | 11 |
| 65 | LỤC SÁT + PHỤC VỊ | 8 |
| 66 | HỌA HẠI + PHỤC VỊ | 8 |
| 67 | 0 + THIÊN Y | 9 |
| 68 | 0 + NGŨ QUỶ | 9 |
| 69 | 0 + TUYỆT MỆNH | 11 |
| 70 | PHỤC VỊ + SINH KHÍ | 9 |
| 71 | DIÊN NIÊN + PHỤC VỊ |  |
| 72 | THIÊN Y + PHỤC VỊ |  |

## 8. Logic JavaScript đề xuất
```js
function analyzePhone(phone) {
  const normalized = normalizePhone(phone);
  const groups = splitPhoneIntoFields(normalized);       // TachSoDienThoai1
  const fields = groups
    .map(group => fieldFromGroup(group))                  // TachNangLuongSo + NLSO
    .filter(Boolean);

  const conclusions = [];
  for (let i = 0; i < fields.length - 1; i++) {
    const key = `${fields[i]} + ${fields[i + 1]}`;
    const item = conclusionMap[key];
    conclusions.push({
      pair: key,
      description: item?.description ?? "",
      score: item?.score ?? null
    });
  }

  return { phone: normalized, groups, fields, conclusions };
}
```

## 9. Hàm tra NLSO
Không dùng phép đoán theo tên. Phải tra đúng mã số sau khi xử lý `0` và `5`.
```js
function fieldFromGroup(group) {
  if (group.length === 1) return null;
  if (group.length === 2 && (group.startsWith("0") || group.endsWith("0"))) {
    return null;
  }

  let code = group;
  if (code.includes("5")) code = code.replaceAll("5", "");
  if (code.includes("0")) code = code.replaceAll("0", "");

  return nlsoMap[code] || null;
}
```
Đây là cách chuyển phần lõi của `TachNangLuongSo` sang JavaScript; phần `x 5` và `+ 0` chỉ cần giữ lại nếu giao diện muốn hiển thị phép biến đổi chi tiết. fileciteturn0file0L341-L355

## 10. Hàm `RemoveOneDuplicateChar`
Trong trường hợp ghép cặp có `0`, công thức nguồn gọi `RemoveOneDuplicateChar`. Hàm này đếm số lần xuất hiện của từng ký tự và nếu một ký tự xuất hiện nhiều hơn một lần thì loại bỏ từng lần dư theo trình tự xử lý của VBA.
Khi chuyển sang JavaScript, phải kiểm thử bằng các số điện thoại thực tế trước khi tối ưu/viết lại thuật toán. Không được thay bằng `Set()` vì `Set` sẽ xóa toàn bộ ký tự trùng và làm thay đổi kết quả.
Nguồn: fileciteturn0file0L203-L250

## 11. Quy tắc hiển thị kết quả trên Landing Page
Nên chia thành 3 tầng:
1. **Số điện thoại:** hiển thị số đã chuẩn hóa.
2. **Tách từ trường:** hiển thị các cụm số → từ trường, ví dụ `... → SINH KHÍ → THIÊN Y → ...`.
3. **Kết luận:** hiển thị từng cặp từ trường và nội dung kết luận tương ứng.

Ví dụ cấu trúc UI:
```text
SỐ ĐIỆN THOẠI
09xxxxxxxx

TÁCH TỪ TRƯỜNG
[cụm 1] → SINH KHÍ
[cụm 2] → THIÊN Y
[cụm 3] → DIÊN NIÊN

KẾT LUẬN
SINH KHÍ + THIÊN Y
→ [description từ KET LUAN]

THIÊN Y + DIÊN NIÊN
→ [description từ KET LUAN]
```

## 12. Xử lý trường hợp không tra được
- Không tìm thấy mã trong `NLSO`: trả `null` cho từ trường và ghi log kỹ thuật.
- Không tìm thấy cặp trong `KET LUAN`: không tự tạo kết luận; hiển thị `Chưa có dữ liệu kết luận cho tổ hợp này` ở tầng UI.
- Không được tự suy đoán từ trường chỉ dựa vào 2 chữ số.
- Không được bỏ qua lỗi dữ liệu một cách âm thầm.

## 13. Kiểm thử bắt buộc
### Test A – số bắt đầu bằng 0
- Input: số điện thoại Việt Nam dạng `0xxxxxxxxx`.
- Kiểm tra số 0 đầu được bỏ đúng 1 lần trước khi tạo cặp.
### Test B – có số 0 bên trong
- Phải chạy đúng nhánh xử lý cặp chứa `0`, gồm cả trường hợp hai cặp liên tiếp đều chứa `0`.
### Test C – có số 5
- Phải chạy đúng nhánh xử lý cặp chứa `5`.
### Test D – không có 0/5
- Các cặp thông thường phải được tách thành cụm đúng theo thuật toán.
### Test E – chuỗi từ trường
- Các cụm không tra được phải bị loại khỏi chuỗi từ trường theo logic nguồn, không tự gán giá trị.
### Test F – kết luận
- Với mỗi 2 từ trường liên tiếp, tạo đúng một khóa `A + B` và tra đúng record tương ứng trong `KET LUAN`.

## 14. Kiến trúc dữ liệu – SQLITE
SQLite là nơi lưu **dữ liệu tra cứu**, không phải nơi chứa thuật toán tách số. Thuật toán `TachSoDienThoai1`, `TachNangLuongSo`, `RemoveOneDuplicateChar` được chuyển sang JavaScript/backend theo đúng công thức nguồn.

### 14.1. Bảng `nlso`
Lưu mã số sau khi xử lý 0/5 và từ trường tương ứng.

```sql
CREATE TABLE IF NOT EXISTS nlso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ma_so TEXT NOT NULL UNIQUE,
    tu_truong TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nlso_ma_so ON nlso(ma_so);
```

### 14.2. Bảng `ket_luan`
Lưu từng tổ hợp hai từ trường và nội dung kết luận nguyên bản từ workbook.

```sql
CREATE TABLE IF NOT EXISTS ket_luan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tu_truong_1 TEXT NOT NULL,
    tu_truong_2 TEXT NOT NULL,
    ma_ket_luan TEXT NOT NULL UNIQUE,
    diem INTEGER,
    ket_luan TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tu_truong_1, tu_truong_2)
);

CREATE INDEX IF NOT EXISTS idx_ket_luan_pair
ON ket_luan(tu_truong_1, tu_truong_2);
```

`ma_ket_luan` có dạng:
```text
SINH KHÍ + THIÊN Y
```

### 14.3. Bảng `phan_tich_sdt` – tùy chọn
Chỉ tạo bảng này nếu muốn lưu lịch sử phân tích.

```sql
CREATE TABLE IF NOT EXISTS phan_tich_sdt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    so_dien_thoai TEXT NOT NULL,
    so_da_chuan_hoa TEXT NOT NULL,
    chuoi_tach TEXT,
    chuoi_tu_truong TEXT,
    ket_qua_json TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_phan_tich_sdt_phone
ON phan_tich_sdt(so_dien_thoai);
```

### 14.4. Không lưu thuật toán vào SQLite
Không cần tạo bảng `phone_field_rules` cho phiên bản đầu tiên. Công thức hiện tại đã nằm trong code và cần được giữ nguyên. SQLite chỉ làm nhiệm vụ:

```text
Mã số → Từ trường
Từ trường 1 + Từ trường 2 → Kết luận
```

### 14.5. Luồng truy vấn SQLite
Sau khi JavaScript/backend tách được cụm số:

```text
"93"
  ↓
SELECT tu_truong FROM nlso WHERE ma_so = '93';
  ↓
"SINH KHÍ"
```

Sau khi có hai từ trường liên tiếp:

```text
"SINH KHÍ" + "THIÊN Y"
  ↓
SELECT * FROM ket_luan
WHERE tu_truong_1 = 'SINH KHÍ'
  AND tu_truong_2 = 'THIÊN Y';
```

### 14.6. Lưu ý về frontend
Nếu Landing Page chỉ chạy **HTML/CSS/JavaScript thuần trong trình duyệt**, browser không thể kết nối trực tiếp tới file `.sqlite` theo cách thông thường.

Có 2 kiến trúc hợp lệ:

**Phương án A – có backend/API:**
```text
HTML/CSS/JS
    ↓ fetch()
API
    ↓
SQLite
```
Đây là phương án khuyến nghị nếu website cần dữ liệu SQLite tập trung.

**Phương án B – SQLite chạy trong browser bằng WebAssembly:**
```text
HTML/CSS/JS
    ↓
sql.js / SQLite WASM
    ↓
file .sqlite
```
Phù hợp nếu website cần chạy gần như độc lập phía client, nhưng phải đóng gói SQLite WASM và database cùng ứng dụng.

Không được viết trong frontend kiểu:
```js
const db = new SQLite('database.sqlite');
```
như thể browser có sẵn quyền mở file SQLite. Nếu dự án đang có backend, hãy dùng API hiện tại để truy vấn SQLite.

### 14.7. API tối thiểu nếu có backend
Nên có các endpoint:
```text
GET /api/nlso/:maSo
GET /api/ket-luan?from=SINH%20KHÍ&to=THIÊN%20Y
POST /api/phan-tich-sdt
```

Backend chỉ chịu trách nhiệm đọc SQLite. Thuật toán vẫn phải trả về các bước trung gian để frontend hiển thị và kiểm tra.

## 15. SQL khởi tạo và import dữ liệu
AI/Vibe Coding phải tạo một file migration/seed riêng, ví dụ `database.sql` hoặc `seed.sql`.

### 15.1. Chuẩn hóa tên từ trường
Dùng đúng các tên xuất hiện trong nguồn, tránh tự đổi tên. Ví dụ:
```text
PHỤC VỊ
THIÊN Y
SINH KHÍ
DIÊN NIÊN
LỤC SÁT
TUYỆT MỆNH
HỌA HẠI
NGŨ QUỶ
```

### 15.2. Import NLSO
Mỗi mã số chỉ được có một record:
```sql
INSERT INTO nlso (ma_so, tu_truong)
VALUES ('93', 'SINH KHÍ');
```
Nếu import lại dữ liệu:
```sql
INSERT INTO nlso (ma_so, tu_truong)
VALUES (?, ?)
ON CONFLICT(ma_so) DO UPDATE SET
    tu_truong = excluded.tu_truong,
    updated_at = CURRENT_TIMESTAMP;
```

### 15.3. Import KET LUAN
```sql
INSERT INTO ket_luan
    (tu_truong_1, tu_truong_2, ma_ket_luan, diem, ket_luan)
VALUES
    (?, ?, ?, ?, ?)
ON CONFLICT(tu_truong_1, tu_truong_2) DO UPDATE SET
    ma_ket_luan = excluded.ma_ket_luan,
    diem = excluded.diem,
    ket_luan = excluded.ket_luan,
    updated_at = CURRENT_TIMESTAMP;
```

Không nhập thủ công 72 kết luận nếu có thể tạo seed tự động từ `tra cuu sdt.xlsx`; dữ liệu trong Excel là nguồn để import.

### 15.4. Query kết luận
```sql
SELECT
    id,
    tu_truong_1,
    tu_truong_2,
    ma_ket_luan,
    diem,
    ket_luan
FROM ket_luan
WHERE tu_truong_1 = ?
  AND tu_truong_2 = ?
LIMIT 1;
```

### 15.5. Query NLSO
```sql
SELECT ma_so, tu_truong
FROM nlso
WHERE ma_so = ?
LIMIT 1;
```

## 16. Nguyên tắc quan trọng cho AI/Vibe Coding
- Chỉ dùng HTML + CSS + JavaScript ở frontend nếu đó là yêu cầu của dự án.
- Nếu dùng SQLite, không giả định browser có thể mở trực tiếp file `.sqlite`; phải dùng backend/API hoặc SQLite WASM.
- SQLite chỉ lưu dữ liệu `NLSO` và `KET LUAN`; không chuyển thuật toán thành dữ liệu tùy tiện.
- Không thay đổi thuật toán tách số hiện tại chỉ vì có cách viết JavaScript ngắn hơn.
- `congthuctinhsdt.txt` là nguồn chuẩn cho **cách tách**.
- `tra cuu sdt.xlsx` là nguồn chuẩn cho **mã NLSO và kết luận**.
- Tách thuật toán thành các hàm độc lập để dễ test:
  - `normalizePhone()`
  - `createOverlappingPairs()`
  - `splitPhoneIntoFields()`
  - `removeOneDuplicateChar()`
  - `fieldFromGroup()`
  - `getConclusion()`
  - `analyzePhone()`
- Không trộn logic UI với logic tính toán.
- Khi sửa thuật toán, phải chạy lại bộ test trước/sau thay đổi.

## 17. Ghi chú về tên sheet
Trong workbook tên sheet là `KET LUAN` (có khoảng trắng), còn code VBA đang tham chiếu `Sheets("KETLUAN")`. Khi triển khai website **không phụ thuộc tên sheet**; hãy xuất dữ liệu thành JSON/DB với tên bảng rõ ràng.

---
**Kết luận:** triển khai theo pipeline `Số điện thoại → cụm số → NLSO → chuỗi từ trường → cặp từ trường → KET LUAN`. Đây là phần lõi cần giữ nguyên khi đưa chức năng phân tích số điện thoại lên Landing Page.

## 18. Dữ liệu kết luận đầy đủ – trích từ `KET LUAN`
Phần dưới đây giữ nguyên nội dung mô tả từ workbook để AI/frontend có thể dùng làm dữ liệu kết luận. Khi hiển thị website, có thể thay `\n` bằng xuống dòng/paragraph.

### 1. `SINH KHÍ + THIÊN Y`
- **Điểm:** 10
- **Kết luận:**
  - quý nhân mang tiền tới, kích cưới, thăng tiến, nhiều cơ hội sinh cơ
  - Thông qua quý nhân mà mang tiền tài đến, nhờ quý nhân mà có cơ hội kiếm tiền, phát tài
  - Có hiện tượng kết hôn, có tình cảm, hạnh phúc. Kích cưới, hồi sinh tình yêu.

### 2. `THIÊN Y + THIÊN Y`
- **Điểm:** 7
- **Kết luận:**
  - tụ tập năng lượng Tài Phú, có hiện tượng kết hôn, kíchcưới ,bát Phương Tài
  - Tụ tập nhiều năng lượng tiền tài và hôn nhân tình cảm tốt đẹp, ngày càng nhiều
  - Có thể kích cưới, dẫn đến hôn nhân, hôn nhân lại rất tốt đẹp
  - Kiếm được tiền, liên tục và ngày càng nhiều tiền

### 3. `DIÊN NIÊN + THIÊN Y`
- **Điểm:** 10
- **Kết luận:**
  - dựa vào năng lực kiếm ra tiền…
  - #diên niên lớn+thiên y lớn:913,786,
  - năng lực chuyên nghiệp cao.chức vụ cao. tạo ra tiền vì giỏi(913.786)
  - Công việc năng lực tốt đem đến nhiều tiền, khối lượng công vịệc lớn áp lực lớn nhưng được trả công xứng đáng, kiếm được nhiều tiền
  - #diên niên nhỏ+thiên y lớn:268,431
  - địa vị không lớn, công việc khônggồng gánh quá vẫn có tiền, không áp lực, nhàn nhàn vẫn có tiền, nhẹ nhõm kiếm nhiều tiền
  - Công việc năng lực bình thường lại đem lại nhiều tiền, công việc đem lại nhiều may mắn.
  - #diên niên lớn +thiêny nhỏ:
  - công việc vất vả thu hoạch ít, làm 10 được 1, 2.
  - vất vả mới ra tiền Công việc nhiều, năng lực tốt, áp lực lớn tuy nhiên công sức bỏ ra đôi lúc chưa xứng đáng.

### 4. `HỌA HẠI + THIÊN Y`
- **Điểm:** 9
- **Kết luận:**
  - thông qua khẩu tài mà kiếm ra tiền
  - các loại công việc như bán hàng diễn thuyết nói ra tiền mở miệng ra tiền (giáo viên luật sư diễn giả bán hàng ....)lấy miếng làm nghiệp….

### 5. `PHỤC VỊ + THIÊN Y`
- **Điểm:** 9
- **Kết luận:**
  - thông qua kiên nhẫn kiên trì chờ đợi màtạo ra tài phú lớn

### 6. `LỤC SÁT + THIÊN Y`
- **Điểm:** 9
- **Kết luận:**
  - thông qua ngành dịch vụ mà kiếm tiền hợp công việc tỉ mỉ dịch vụ liên quan nữ giới( spa mỹ phẩm quần áo thời trang,... dịch vụ liên quan vận tải

### 7. `NGŨ QUỶ + THIÊNY`
- **Điểm:** 9
- **Kết luận:**
  - thông qua ý tưởng tài hoa mà kiếm tiền công việc cần cường độ linh hoạt hoạt động não kích cưới rất nhanh.
  - hoặc công việc liên quan mệnh lý tông giáo ra tiền
  - Thông qua ý tưởng tài hoa tài năng hơn người mà kiếm tiền công việc cần sự linh hoạt động não thông minh sáng tạo kiếm được khoản tiền lớn tim và não ảnh hưởng cẩn thận đột quỵ nên phải giữ sức khoẻ phương diện này nếu trong sdt có qúa nhiều cặp này.
  - Kích cưới nếu chưa có lập gia đình kích đào hoa tình cảm rất tốt.
  - phát tài nhanh chóng tền gì cũng dám kiếm cho nên cần phải xem xét phương diện pháp luật.
  - Phải luôn giữ giá trị đạo đức và pháp luật không rất dễ có tai ương lao ngục.
  - Thường hay làm công việc liên quan đến thức đêm trực đêm internet dựa vào kiến thức mà kiếm tiền lập kế hoạch mà kiếm tiền.

### 8. `TUYỆT MỆNH + THIÊN Y`
- **Điểm:** 11
- **Kết luận:**
  - thông qua cố gắng phấn đấu mà kiếm tiền hoặc làm đầu tư quản lý tài sản làm đầu tư ra tiền bất động sản lô đề bóng bánh đầu tư mạo hiểm
  - Thông qua sự cố gắng nỗ lực bản thân lớn để kiếm ra số tiền lớn
  - đầu tư để kiếm tiền đầu tư lớn nhận được kết quả cũng thắng lớn
  - Người làm đại sự càng làm càng có tiền tổ hợp lợi cho đánh bạc: mua sổ xố đầu tư cổ phiếu.

### 9. `THIÊN Y + 0`
- **Điểm:** 9
- **Kết luận:**
  - điều tốt đẹp của Thiên y không còn nữa mà bị ẩn tàng đi 1 lúc nào đó bị phản lại.
  - Dễ mắc kẹt tiền mua nhà mắc nợ cho mượn tiền không đòi dc
  - tình cảm có vấn đề ngoại tình khó phát hiện bên ngoài khác xa thựctế vc ngoài tưởng Happy nhưng nhạt không tưởng tưởng là người có tiền nhàn nhã nhưng thực tế nợ nần tài sản hao mòn thất thoát kẹt tiền mắc nợ
  - Ẩn giấu đi tiền tài.tiền tài tuy kiếm ra nhiều nhưng hay bị mắc kẹt
  - Mua nhà mắc nợ đôi khi bị giựt nợ bị lừa đảo mà mất tiền của
  - Tình cảm có nguy cơ tan vỡ rạn nứt có thể ẩn giấu người tình tay ba rất kín kẽ ngoại tình sớm muộn chia tay ẩn tàng ly hôn
  - Không nên đi đầu tư vì có thể không những không kiếm được tiền mà còn có thể bị lừa bị lỗ đầu tư thất bại,

### 10. `SINH KHÍ + SINH KHÍ`
- **Điểm:** 10
- **Kết luận:**
  - tụ tập tăng cường năng lượng quý nhân
  - Tấn cấp, thăng tiến,dễ được đề bạt tiến cử,có nhiều nguồn tiền
  - Quý nhân giúp đỡ, gặp dữ hóa lành, vui vẻ lạc quan.

### 11. `THIÊN Y + SINH KHÍ`
- **Điểm:** 7
- **Kết luận:**
  - hiểu bằng hữu, đối với bạn hào phóng, nhân duyên tốt, thích giúp người,tài vận bất bại,...âm phước lớn.
  - Có nhiều bằng hữu bạn bè thân tín, với bản tính hào phóng kết nạp được rất nhiều nhân duyên tốt,
  - Có hôn nhân, đoạn hôn nhân này lại vô cùng vui vẻ tốt đẹp

### 12. `SINH KHÍ + PHỤC VỊ`
- **Điểm:** 9
- **Kết luận:**
  - Sinh khí tụ tập mạnh lên.quý nhân hiển lộ.Ngày càng trở lên vui vẻ, quý nhân rất nhiều

### 13. `PHỤC VỊ + SINH KHÍ`
- **Điểm:** 8
- **Kết luận:**
  - Sinh khí tụ tập mạnh lên.quý nhân hiển lộ.Ngày càng trở lên vui vẻ, quý nhân rất nhiều

### 14. `DIÊN NIÊN + SINH KHÍ`
- **Điểm:** 10
- **Kết luận:**
  - Học tập vui vẻ, công việc vui vẻ happy, không cảm thấy áp lực, lợi cho Học hành, yêu việc. Đi làm dễ là lãnh đạo chủ chốt

### 15. `LỤC SÁT + SINH KHÍ`
- **Điểm:** 8
- **Kết luận:**
  - Nhân duyên tốt giao tiếp khéo tinh tế có quan hệ xã hội tốt tính nết nhiệt tình vui vẻ có mối quan hệ rất tốt.

### 16. `HỌA HẠI + SINH KHÍ`
- **Điểm:** 9
- **Kết luận:**
  - khẩu tài tốt lời nói có giá trị nói người mê người thích nói tâm phục khẩu phục duyên ăn nói lời nói có giá trị ăn nói dễ nghe làm người ta yêu quý vui vẻ

### 17. `NGŨ QUỶ + SINH KHÍ`
- **Điểm:** 8
- **Kết luận:**
  - có thể nghĩ được nhiều ý tưởng tốt ra phương án hữu dụng ý tưởng sáng tạo....

### 18. `TUYỆT MỆNH + SINH KHÍ`
- **Điểm:** 12
- **Kết luận:**
  - rất vui vẻ đầu tư vui vẻ có thành tựu Cảm Xúc Thăng Hoa ngoại giao tốt.

### 19. `SINH KHÍ + 0`
- **Điểm:** 10
- **Kết luận:**
  - dễ gặp tiểu nhân ẩn mình; có tiêu cực quý nhân ẩn giấu đi hầu hết lại dính phải tiểu nhân ngầm có nhiều ngăn trở ẩn vui vẻ gặp quý nhân hóa tiểu nhân

### 20. `THIÊN Y + NGŨ QUỶ`
- **Điểm:** 8
- **Kết luận:**
  - vì suy nghĩ hay thất thường, hay có suy nghĩ không chắc chắn >hao tài tốn của, tình cảm có vấn đề.
  - Tiền vào ra không ổn định, lên xuống lớn, tài chính không an toàn lưu động lớn, không đọng được (nát đào hoa, lao đao), dàn trải, dễ gánh nợ trả nợ dùm,...chi tiêu vô hình lớn,...
  - Kiếm được tiền nhưng lại vì nguyên nhân bất ngờ khiến tiền bị tổn thất hết.
  - Hôn nhân không thuận, tình duyên trắc trở, chiêu cảm vấn đề dẫn tới mình là người chủ động ly hôn or có thể do bản thân ngoại tình, có người thứ 3

### 21. `SINH KHÍ + NGŨ QUỶ`
- **Điểm:** 10
- **Kết luận:**
  - khéo đưa đẩy,vui vẻ thất thường,....không đọc vị được, khó lường, khó nắm bắt

### 22. `DIÊN NIÊN + NGŨ QUỶ`
- **Điểm:** 10
- **Kết luận:**
  - công việc biến động, biến báo, dễ thay đổi việc công việc, lên xuống thất thường, không yêu nghề, chân trong chân ngoài nhiều ý tưởng không thực tế
  - Dễ lao lực thức khuya tim đột tử
  - Vừa làm việc vừa nghĩ linh tinh, công việc vừa làm vừa nghĩ, suy nghĩ nhiều. suy nghĩ thâm ngầm, thường hay làm công việc ngoại giao, không có lợi cho quan vận

### 23. `NGŨ QUỶ + NGŨ QUỶ`
- **Điểm:** 8
- **Kết luận:**
  - có tài hoa nhưng không ổn định, phản ứng nhanh, nhưng hay gặp trắc trở, không ổn định và rất hay thay đổi, nhất là trong ý nghĩ.
  - Ý nghĩ hay thay đổi, khó thực hiện ý tưởng,nghĩ nhiều, bay bổng, tham bát bỏ mâm. làm thuê thì luôn bất mãn vì không được coi trọng, vì cảm thấy có tài nhưng không vận dụng được.
  - Dự định bay bổng nhưng không làm được hoặc giỏi công việc ngoại giao
  - Thường xuyên thức đêm làm việc,tính cách rất khôn khéo thông minh,rất tâm cơ tính toán
  - Nếu làm nhân viên thường hay không được nhìn nhận,trong mắt người khác không được trân trọng,cảm giác tài năng của mình bị bạc đãi nên rất ấm ức.
  - Hôn nhân thường hay thay đổi đa nghi,dễ ly hôn bệnh thường hay liên quan đến tim
  - Chi tiêu bạo tay,rất dễ nợ và vỡ nợ tán tài nhanh

### 24. `HỌA HẠI + NGŨ QUỶ`
- **Điểm:** 9
- **Kết luận:**
  - Suy nghĩ nhiều,suy nghĩ rối ren dẫn đến gây ra cãi vã to khắc khẩu liên tục cẩn thận bệnh tim
  - Nói rất nhiều,xu hướng nói tào lao,sĩ diện ,hay biểu đạt lời nói kỳ dị khiến người khác không hiểu được lan man dài dòng nói từ giữa nói ra..(soi xét.,nhìn vào chi tiết.....

### 25. `LỤC SÁT + NGŨ QUỶ`
- **Điểm:** 9
- **Kết luận:**
  - Cảm xúc biến hoá vô hạn cảm xúc biến hóa khôn lường luôn luôn không cảm giác an toàn cả nể cả nghĩ
  - Hôn nhân không thuận tình duyên trắc trở nát đào hoa ảnh hưởng hôn nhân

### 26. `TUYỆT MỆNH + NGŨ QUỶ`
- **Điểm:** 12
- **Kết luận:**
  - tham vọng lớn,rất kích động,xung động có ý nghĩ kì dị,tự làm hại bản thân,có hại đến nhân mạng
  - Nỗ lực liều lĩnh thông minh phản ứng nhanh có sự biến hoá thích đầu tư dễ xuất tiền phá tài dễ mắc nợ lao đao
  - Công việc hay biến động thay đổi mất việc chuyển việc liên tục
  - Tình cảm không ổn định lung lay vui đó mà giận đó cứ thay đổi xoành xoạch.
  - Chú ý gan mật dễ phát bệnh ngoài ý muốn dễ có bệnh ung thư bệnh nan y....

### 27. `NGŨ QUỶ + 0`
- **Điểm:** 9
- **Kết luận:**
  - Hay do dự suy nghĩ viển vông không thực thi được hay thay đổi nghi ngờ không quyết đoán
  - Mắc nợ từng đống dễ ngoại tình thất thường
  - Huyết áp khó ngủ tim phẫu thuật mổ xẻ dễ xuất gia tu hành
  - Biểu thị ly hôn mà lại là người khác chủ động chứ mình bị động bị dồn vào thế bị ép.

### 28. `PHỤC VỊ + NGŨ QUỶ`
- **Điểm:** 8
- **Kết luận:**
  - làm tính chất ngũ quỷ mạnh lên

### 29. `THIÊN Y + TUYỆT MỆNH`
- **Điểm:** 8
- **Kết luận:**
  - có tiền sẽ đi đầu tư, số tiền lớn nhưng suy nghĩ hay không chặt chẽ mà khiến phá tài mất tiền của, xung động tiêu phí đầu tư tiêu hao phá tài, tiêu thoáng tay, cảm xúc
  - dễ phá tài, đầu tư dễ mất hết, phá tài
  - dễ đổ vỡ tình cảm, tình cảm không tốt, không hài hòa

### 30. `SINH KHÍ + TUYỆT MỆNH`
- **Điểm:** 9
- **Kết luận:**
  - có quá nhiều kế hoạch nhưng không thực hiện .thực hiện không thành công
  - có nhiều mục tiêu, vui vẻ phấn đấu vìmộng tưởng lớn nhưng không nhất định có thể thực hiện được, bao đồng , trở mặt,.....

### 31. `DIÊN NIÊN + TUYỆT MỆNH`
- **Điểm:** 10
- **Kết luận:**
  - không muốn làm việc, tâm tình làm việc không có, không có tâm tình học tập
  - có nỗ lựcnhưng không thành tựu, có ý thức học nhưng kết quả không có , phần lớn gặp khó khăn trắc trở ,nhiều xuất hiện khó khăn trong công việc
  - mối quan hệ. tình cảm không tốt .quan hệ giữa người với người không tốt. (âm dương sai chỗ Nếu nữ dùng nhiều 912.196….)

### 32. `TUYỆT MỆNH + TUYỆT MỆNH`
- **Điểm:** 11
- **Kết luận:**
  - sơ ý chủ quan, dễ kích động, suy nghĩ cực đoan, tiêu cực dễ phá tiền tài, cứ đánh bài bạc là thua, không giữ của được
  - không dễ quản lý tài sản, tiền tới mau đi mau

### 33. `PHỤC VỊ + TUYỆT MỆNH`
- **Điểm:** 8
- **Kết luận:**
  - nhân đôi tính tuyệt mệnh lên

### 34. `LỤC SÁT + TUYỆT MỆNH`
- **Điểm:** 9
- **Kết luận:**
  - luôn có cảm xúc vất vả cố gắng luôncó cảm giác bị chèn ép ức chế tâm tình tệ nghĩ tiêucực vất vả(169_612-384…)
  - tình cảm không thuận

### 35. `HỌA HẠI + TUYỆT MỆNH`
- **Điểm:** 8
- **Kết luận:**
  - nói chuyện thường hay kích động người khác gây tổn thương đến người khác
  - va chạm tai nạn mâu thuẫn dễ phẫu thuật họa huyết quang cắt mổ cơ thể....

### 36. `NGŨ QUỶ + TUYỆT MỆNH`
- **Điểm:** 9
- **Kết luận:**
  - nhanh nhẹn nắm bắt thông tin thường hay nhìn ra và biết nắm bắt thời cơ cơ hội hoặc thông tin tốt cố gắng thực hiện. nhưng tài vận thất thường.
  - công việc dễ thay đổi hoặc chuyển việc or thất nghiệp liên miên cv không bền vững or di chuyển liên tục.
  - Dám liều dễ chiêu cảm bệnh ung thư dễ ung thư gan thận (ung thư họng nq+tm+hh)
  - Dễ bị bệnh ung thư nợ đống,...

### 37. `TUYỆT MÊNH + 0`
- **Điểm:** 11
- **Kết luận:**
  - mua nhà mắc nợ nợ ngập hoặc cho vaykhông đòi được dễ thất bại dễ ngoại tình đầu tư thất bại
  - Âm thầm nhưng đến khi phát ra lại cực kì bạo phát không gì đỡ nổi ẩn tàng mối nguy hiểm rất lớn đã phát ra là lên đến đỉnh điểm.
  - Đôi khi phá sản bất thình lình đầu tư bỗng nhiên thua lỗ mất sạch quyết định quá cảm tính dẫn đến hậu quả khôn lường.
  - Hôn nhân đang tốt đẹp bỗng nhiên sóng gió ly hôn bất ngờ dễ ly hôn
  - Tai nạn xe cộ chết ngoài ý muốn hoặc âm thầm phát ung thư
  - Mọi thứ hầu hết phải đánh đổi bằng sự lao lực của bản thân mà thành khổ cực khó nhọc rất ít quý nhân.
  - Nếu đã khó mang thai càng khó hơn con cái khó khăn hoặc nuôi con cái cực khổ nhất là những lúc thời vận đến đoạn từ trường xấu này thì thật xấu càng thêm xấu.
  - Đầu tư thất bại to nhỏ tuỳ từ trường nhưng đầu tư sẽ lợi bất cập hại.

### 38. `THIÊN Y + LỤC SÁT`
- **Điểm:** 9
- **Kết luận:**
  - Dễ vì phụ nữ, chưng diện, hưởng dịch vụ mà phá tiền phá tài, xấu cho hôn nhân, thường hay vui vẻ với nữ nhân ảnh hưởng đến tình cảm hoặc hôn nhân. Phá tiền tài mạnh
  - Tiêu tiền cho làm đẹp hoặc gia đình
  - Không có lợi cho học tập, vì quan tâm đến tiền và tình cảm, sắc đẹp chưng diện nhiều mà chểnh mảng học hành
  - Phá tài vì nữ giới hoặc người thứ ba, hoặc hao tổn không có điểm dừng ,bị âm nợ hao tài vì việc nhà việc cửa, tình cảm ảnh hưởng nát đào hoa, hôn nhân xấu .tiền dùng tại nữ nhân gia đình cửa hàng đồ trang điểm quần áo việc nhà....k quản lí dc tài chính.thích là nhích..

### 39. `SINH KHÍ + LỤC SÁT`
- **Điểm:** 9
- **Kết luận:**
  - Vui mà hóa buồn, Bằng Hữu thành kẻ thù, khéo léo chinh phục người khác ,giỏi chốt sale ,mật ngọt chết ruồi.Khéo léo
  - Lúc đầu thì rất vui nhưng lúc sau lại phiền muộn, quý nhân dễ biến thành tiểu nhân, trở mặt thành thù, dễ bị lừa gạt, đâm sau lưng
  - Bạn bè dễ biến thành người yêu, tình nhân.

### 40. `DIÊN NIÊN + LỤC SÁT`
- **Điểm:** 10
- **Kết luận:**
  - Làm việc học tập không vui ,công việc làm không vui ,u sầu, làm việc không quả quyết, sức lực kém. vô cùng mâu thuẫn trong đầu, tiến thoái lưỡng nan,không làm vì đam mê...
  - Công việc có thể phải lưỡng lự không quả quyết được, áp lực công việc.

### 41. `PHỤC VỊ + LỤC SÁT`
- **Điểm:** 8
- **Kết luận:**
  - Lúc nào cũng nhìn thấy sự khó khăn, rào cản, suy nghĩ lúc nào cũng tiêu cực, sợ sệt rất nhiều, dù 1 việc dễ ẹc nhưng đối với người này vẫn cứ là khó khăn, lý do và rào cản,
  - Tính cách này khó có thể thành công, họ luôn luôn sợ hãi thu mình lại mà đánh mất rất nhiều cơ hội.
  - Rất hay lề mề.
  - Đàn ông hay nghiện thuốc, nội tâm yếu ớt, trống rỗng, đa sầu đa cảm, rất dễ dàng bị khủng hoảng.
  - Không thuận lợi cho tình duyên, hôn nhân

### 42. `LỤC SÁT + LỤC SÁT`
- **Điểm:** 8
- **Kết luận:**
  - Tăng cường cảm giác u buồn bệnh tự kỉ cảm xúc không ổn định mối quan hệ đang vui tự dưng chuyển biến xấu có tình cảm nhiều nhưng cũng không hạnh phúc tốt đẹp
  - Nát đào hoa tình cảm rồi cũng không thành quan hệ nhân mạch đột nhiên chuyển biến xấu mưa dập gió vuì nhạy cảm ….

### 43. `HỌA HẠI + LỤC SÁT`
- **Điểm:** 9
- **Kết luận:**
  - Nói chuyện quá thẳng thắn quá trực tiếp rồi hối hận .vì sĩ diện mà hao tài phá tài .cho vay ngại đòi. nhiều thị phi cực nhưng lại yếu đương đầu hay đau khổ .dạ dày có vấn đề.
  - Nói ra không cần người khác đáp lại làm cho người khác buồn bực im lặng cảm xúc không tốt dùng miệng lưỡi để người khác phải ức chế bực tức rất nhiều xéo xắt
  - Nói năng chua ngoa tuy tâm thiện nhưng lời lẽ rất mất lòng người khác từ đấy mà hảo tâm không được báo đáp nên thành ra rất buồn bực không vui vì nhân duyên nhân thế với những người khác.
  - Thường tự mình mang đến thị phi cho bản thân
  - Thường cảm thấy hối hận vì lời nói của mình dễ nói hớ nói nhầm nói chuyện dù vui cũng dễ làm người ta hiểu nhầm. Nhiều khi chính vì nói thằng quá mà đâm ra hối hận vì làm cho đối phương buồn bã cho dù đó là ý rất tốt.
  - Coi trọng sĩ diện nghĩa khí khẩu xà tâm Phật nóng tính.
  - Đôi khi vì sĩ diện nên không nói ra những suy nghĩ tiếc rẻ trong lòng mình cho nên dẫn đến bản thân buồn bực không vui
  - Bệnh dạ dày

### 44. `NGŨ QUỶ + LỤC SÁT`
- **Điểm:** 8
- **Kết luận:**
  - Ý nghĩ rất buồn bực suy nghĩ tiêu cực và suy nghĩ nhiều nhưng không có tác dụng dễ đồng tính luyến ái tâm tính không tốt ám tài ám Tình Đau Khổ tâm tình Xấu dễ Quyên sinh

### 45. `TUYỆT MỆNH + LỤC SÁT`
- **Điểm:** 12
- **Kết luận:**
  - Hay quyết định sai lầm rồi hối hận dễ xung đột vướng về tình cảm
  - Rất u buồn không có cảm hứng làm bất cứ việc gì thường hay tổn thương thu mình lại cô lập. Nghiêm trọng.
  - Luôn vì quyết định của mình mà cảm thấy không vui phiền muộn
  - Đầu tư thường thua thiệt mắc nợ phiền muộn
  - Hay xung đột với ngừoi khác sau đó rất hối hận......

### 46. `LỤC SÁT + 0`
- **Điểm:** 9
- **Kết luận:**
  - Khinh sinh u buồn tăng lên. dễ tiêu cực. U nhọt.
  - Dễ dàng gặp việc không vui có chứng u buồn trầm cảm có khuynh hướng tự sát
  - Cảm xúc tâm tình đè nén không muốn bên ngoài nhận biết ẩn tính nhìn không ra
  - (6001;1006;7004;4007;3008;8003 đều giống như vậy)

### 47. `THIÊN Y + HỌA HẠI`
- **Điểm:** 9
- **Kết luận:**
  - thích tiêu tiền, vì miệng mà phá Tài. hay tiêu tiền vì sĩ diện, thích mua đồ ăn, thích đem tiền đó đi lấy lòng người khác
  - Tiêu số tiền cũng khá lớ, bạo tay
  - Đem tiền đi dùng xa xỉ, hoặc phải dùng tiền đi xem bệnh, xem bói..

### 48. `SINH KHÍ + HỌA HẠI`
- **Điểm:** 10
- **Kết luận:**
  - tự nhận là rất giỏi, dễ tự cao tự đại, tự khen bản thân, tự nhận là mình rất giỏi
  - tranh chấp vì Thị Phi, hay mở miệng ra là dẫn đến tranh luận ầm ĩ

### 49. `DIÊN NIÊN + HỌA HẠI`
- **Điểm:** 10
- **Kết luận:**
  - Ăn nói tốt, lời nói có trọng lượng, tuy nhiên cũng dễ phát ngôn bừa bãi bộp chộp
  - năng lực lãnh đạo bị cản trở, quyền lực bị uy hiếp, làm việc dễ hối hận
  - Dễ có người bàn tán thị phi sau lưng, hay phải phàn nàn về công việc, hay gặp tiểu nhân

### 50. `PHỤC VỊ + HỌA HẠI`
- **Điểm:** 8
- **Kết luận:**
  - mạnh miệng, tự cho là đúng, (tăng Từ Trường Họa Hại lên) Nói năng tốt, có tài ăn nói, miệng lưỡi sắc bén, tuy nhiên cũng dễ dẫn đến cãi nhau, lại sĩ diện hiếu thắng, đúng sai cũng không nhượng bộ
  - nói bằng được, nói dài nói dai nói dại, nói hớ.

### 51. `HỌA HẠI + HỌA HẠI`
- **Điểm:** 8
- **Kết luận:**
  - dễ cãi vã, Tính khí nóng nảy, không kiên nhẫn
  - Nói thẳng, cứng rắn quá và rất mạng miệng, rất thích cãi lộn hoặc dẫn đến cãi lộn, không có kiên nhẫn, dẫn đến việc hụt hơi

### 52. `LỤC SÁT + HỌA HẠI`
- **Điểm:** 8
- **Kết luận:**
  - dễ đắc tội với người khác, không có tâm tình nói chuyện. Ảnh hưởng xấu tới hôn nhân,tình cảm
  - Nói chuyện không có tâm hoặc không để tâm ,hay nói chuyện lơ đãng thường xuyên vạ miệng thường dễ dàng đắc tội với người khác
  - Tình duyên và hôn nhân không thuận

### 53. `NGŨ QUỶ + HỌA HẠI`
- **Điểm:** 8
- **Kết luận:**
  - Suy nghĩ nhiều suy nghĩ rối ren dẫn đến gây ra cãi vã to khắc khẩu liên tục suy nghĩ khó hiện thực Hóa. Thích chi tiết
  - cẩn thận bệnh tim

### 54. `TUYỆT MỆNH + HỌA HẠI`
- **Điểm:** 12
- **Kết luận:**
  - cách làm việc dễ gây ra cãi vã
  - chiêu cảm tai nạn giao thông cẩn thận có tai nạn giao thông nghiêm trọng
  - hay gây ra mâu thuẫn không hòa hợp hay gây tranh cãi do miệng

### 55. `HỌAHẠI + 0`
- **Điểm:** 8
- **Kết luận:**
  - không ngừng thị phi sức khỏe không tốt bệnh ẩn tàng ẩn nguy cơ tiền mắc kẹt hao mòn bị rút ruột. ẩn tiểu nhân...
  - bệnh tật giấu đi nhìn không ra triệu chứng khi phát ra sẽ rất nghiêm trọng
  - Cãi vã thị phi ngoài ý muốn không nói ra thì thôi nhưng nói ra lại kinh người khi phát sinh việc ngoài ý muốn lại rất nghiêm trọng

### 56. `THIÊN Y + DIÊN NIÊN`
- **Điểm:** 9
- **Kết luận:**
  - cách cục làm chủ ,làm lãnh đạo, có làm thuê cũng ra làm chủ
  - Tự mình làm chủ, tự lập nghiệp, số tiền kiếm được cũng rất tốt
  - Kiếm tiền từ công việc tốt
  - Có suy nghĩ làm chủ, có ý chí
  - Tự mình làm chủ, tự lập nghiệp, số tiền kiếm được cũng rất tốt và công việc tương đối vất vả
  - kiếm tiền từ công việc tốt nhất, gặp nhiều may mắn và cơ hội tiền bạc trong công việc, công việc đem lại tiền bạc lâu bền và nhiều, kiếm tiền rất tốt.

### 57. `SINH KHÍ + DIÊN NIÊN`
- **Điểm:** 10
- **Kết luận:**
  - Thông qua quý nhân đem công việc tốt đến, cách cục này sẽ làm lãnh đạo hoặc thầy giáo, học hành tốt, thăng quan, cường thế, hợp với nam hơn, nếu là nữ sử dụng thì người nữ này cần làm lãnh đạo, hoặc nắm quyền trong nhà. nữ hợp với Cường thế
  - được quý nhân nâng đỡ, tương trợ trong sự nghiệp
  - Có thể là chủ quản đơn vị, không nhất thiết là ông chủ.
  - Năng lực cao, được quý nhân công nhận.thông qua quý nhân mang đến công việc tốt.
  - lợi cho học hành. tấn cấp. [hợp với người đang thất nghiệp]

### 58. `DIÊN NIÊN + DIÊN NIÊN`
- **Điểm:** 11
- **Kết luận:**
  - năng lực làm việc mạnh, có quyền lợi, có năng lực lãnh đạo, chịu áp lực rất tốt, thường hay nhận được quyền lợi địa vị, có năng lực dẫn dắt lãnh đạo. Vì cường thế cho nên nữ k nên dùng quá mạnh 1591,9199…> khắc phu, ly hôn]

### 59. `PHỤC VỊ + DIÊN NIÊN`
- **Điểm:** 9
- **Kết luận:**
  - tăng cường năng lượng diên niên ,năng lực càng lớn.cố gắng làm việc. quyền lợi trong công việc rất nhiều
  - Thường hay đùa nghịch kiểu rất thông minh

### 60. `LỤC SÁT + DIÊN NIÊN`
- **Điểm:** 9
- **Kết luận:**
  - công tác hành chính hoặc phục vụ. xử lý tốt quan hệ với nữ nhân và quan hệ xã hội. xu hướng làm việc liên quan nữ nhân phái đẹp , spa thẩm mĩ or vận tải,dịch vụ...

### 61. `HỌA HẠI + DIÊN NIÊN`
- **Điểm:** 9
- **Kết luận:**
  - có khẩu tài tốt lấy miệng làm nghiệp công việc liên quan ăn nói sale...năng lực và ăn nói đều tốt chủ yếu công việc chủ yếu liên quan đến ăn nói.

### 62. `NGŨ QUỶ + DIÊN NIÊN`
- **Điểm:** 8
- **Kết luận:**
  - công việc cần cường độ linh hoạt não có ý tưởng sáng tạo và thực hiện được. cường độ làm việc lớn,
  - công việc cần cường độ linh hoạt của não có lý tưởng và khát vọng rất giỏi phát hiện những điều người khác không thấy thường làmviệc rất vất vả thường xuyên phải cày đêm dựa vào năng lực bản thân để lên chức vị.
  - Cần chú ý thượng tôn pháp luật nếu không sẽ rất dễ thất bại và mất hết.
  - Có thể là công việc làm việc với nước ngoài

### 63. `TUYỆT MỆNH + DIÊN NIÊN`
- **Điểm:** 11
- **Kết luận:**
  - Công việc cần lá gan lớn sự mạnh mẽ liều lĩnh liên quan đến phòng kinh doanh đầu tư quản lý tài sản. Nam giới làm bất động sản mua nhà đất.
  - là đại nam nhân hảo tử hán làm lãnh đạo và có quyền uy thường tự thân đi làm và nỗ lực công việc vất vả yêu cầu cao đối với người khác,
  - thích được khẳng định bản thân và thích học tập.
  - rất dễ được đề bạt và thăng tiến vì sự cố gắng nỗ lực là người rất trách nhiệm trong công việc
  - nữ không nên dùng quá mạnh quá nhiều vì âm dương sai chỗ vừa khổ vừa mệt trả giá nhiều làm ân báo oán đa số ly hôn hôn nhân không hạnh phúc không được hưởng phước từ chồng về gìa thường không tiền và bệnh tật,

### 64. `DIÊN NIÊN + 0`
- **Điểm:** 11
- **Kết luận:**
  - không phát huy được khả năng sự nghiệp đình trệ hay gặp khó khăn không phát lên được.
  - bị kèn cựa cản trở. nỗ lực không có kết quả năng lực ẩn giấu đi không phát huy ra được thực tế rất mạnh
  - khôn vặt nhìn vấn đề không hoàn thiện xử lý vấn đề có phần cực đoan

### 65. `LỤC SÁT + PHỤC VỊ`
- **Điểm:** 8
- **Kết luận:**
  - Lúc nào cũng nhìn thấy sự khó khăn, rào cản, suy nghĩ lúc nào cũng tiêu cực, sợ sệt rất nhiều, dù 1 việc dễ ẹc nhưng đối với người này vẫn cứ là khó khăn, lý do và rào cản,
  - Tính cách này khó có thể thành công, họ luôn luôn sợ hãi thu mình lại mà đánh mất rất nhiều cơ hội.
  - Rất hay lề mề.
  - Đàn ông hay nghiện thuốc, nội tâm yếu ớt, trống rỗng, đa sầu đa cảm, rất dễ dàng bị khủng hoảng.
  - Không thuận lợi cho tình duyên, hôn nhân

### 66. `HỌA HẠI + PHỤC VỊ`
- **Điểm:** 8
- **Kết luận:**
  - mạnh miệng, tự cho là đúng, (tăng Từ Trường Họa Hại lên) Nói năng tốt, có tài ăn nói, miệng lưỡi sắc bén, tuy nhiên cũng dễ dẫn đến cãi nhau, lại sĩ diện hiếu thắng, đúng sai cũng không nhượng bộ
  - nói bằng được, nói dài nói dai nói dại, nói hớ.

### 67. `0 + THIÊN Y`
- **Điểm:** 9
- **Kết luận:**
  - điều tốt đẹp của Thiên y không còn nữa mà bị ẩn tàng đi 1 lúc nào đó bị phản lại.
  - Dễ mắc kẹt tiền mua nhà mắc nợ cho mượn tiền không đòi dc
  - tình cảm có vấn đề ngoại tình khó phát hiện bên ngoài khác xa thựctế vc ngoài tưởng Happy nhưng nhạt không tưởng tưởng là người có tiền nhàn nhã nhưng thực tế nợ nần tài sản hao mòn thất thoát kẹt tiền mắc nợ
  - Ẩn giấu đi tiền tài.tiền tài tuy kiếm ra nhiều nhưng hay bị mắc kẹt
  - Mua nhà mắc nợ đôi khi bị giựt nợ bị lừa đảo mà mất tiền của
  - Tình cảm có nguy cơ tan vỡ rạn nứt có thể ẩn giấu người tình tay ba rất kín kẽ ngoại tình sớm muộn chia tay ẩn tàng ly hôn
  - Không nên đi đầu tư vì có thể không những không kiếm được tiền mà còn có thể bị lừa bị lỗ đầu tư thất bại,

### 68. `0 + NGŨ QUỶ`
- **Điểm:** 9
- **Kết luận:**
  - Hay do dự suy nghĩ viển vông không thực thi được hay thay đổi nghi ngờ không quyết đoán
  - Mắc nợ từng đống dễ ngoại tình thất thường
  - Huyết áp khó ngủ tim phẫu thuật mổ xẻ dễ xuất gia tu hành
  - Biểu thị ly hôn mà lại là người khác chủ động chứ mình bị động bị dồn vào thế bị ép.

### 69. `0 + TUYỆT MỆNH`
- **Điểm:** 11
- **Kết luận:**
  - mua nhà mắc nợ nợ ngập hoặc cho vaykhông đòi được dễ thất bại dễ ngoại tình đầu tư thất bại
  - Âm thầm nhưng đến khi phát ra lại cực kì bạo phát không gì đỡ nổi ẩn tàng mối nguy hiểm rất lớn đã phát ra là lên đến đỉnh điểm.
  - Đôi khi phá sản bất thình lình đầu tư bỗng nhiên thua lỗ mất sạch quyết định quá cảm tính dẫn đến hậu quả khôn lường.
  - Hôn nhân đang tốt đẹp bỗng nhiên sóng gió ly hôn bất ngờ dễ ly hôn
  - Tai nạn xe cộ chết ngoài ý muốn hoặc âm thầm phát ung thư
  - Mọi thứ hầu hết phải đánh đổi bằng sự lao lực của bản thân mà thành khổ cực khó nhọc rất ít quý nhân.
  - Nếu đã khó mang thai càng khó hơn con cái khó khăn hoặc nuôi con cái cực khổ nhất là những lúc thời vận đến đoạn từ trường xấu này thì thật xấu càng thêm xấu.
  - Đầu tư thất bại to nhỏ tuỳ từ trường nhưng đầu tư sẽ lợi bất cập hại.

### 70. `PHỤC VỊ + SINH KHÍ`
- **Điểm:** 9
- **Kết luận:**
  - Sinh khí tụ tập mạnh lên.quý nhân hiển lộ.Ngày càng trở lên vui vẻ, quý nhân rất nhiều

### 71. `DIÊN NIÊN + PHỤC VỊ`
- **Kết luận:**
  - tăng cường năng lượng diên niên ,năng lực càng lớn.cố gắng làm việc. quyền lợi trong công việc rất nhiều
  - Thường hay đùa nghịch kiểu rất thông minh

### 72. `THIÊN Y + PHỤC VỊ`
- **Kết luận:**
  - thông qua kiên nhẫn kiên trì chờ đợi mà tạo ra tài phú lớn