/**
 * Core Logic: Thần Số Học Pythagoras
 * 23 Chỉ Số, Vẽ Bản Đồ SVG, Quản lý giao diện & Xác thực người dùng
 */

// Bảng quy đổi Hệ Pythagoras
const PYTHAGORAS = {
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

// Chuẩn hoá họ tên
function boDau(str) {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toUpperCase()
    .replace(/[^A-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sumDigits(num) {
  return String(num).split('').reduce((sum, d) => sum + (parseInt(d, 10) || 0), 0);
}

// Rút gọn triệt để (1 - 9)
function RN(n) {
  let val = Math.abs(parseInt(n, 10) || 0);
  while (val > 9) {
    val = sumDigits(val);
  }
  return val;
}

// Rút gọn giữ số Bậc thầy (11, 22, 33)
function RM(n) {
  let val = Math.abs(parseInt(n, 10) || 0);
  while (val > 9) {
    if (val === 11 || val === 22 || val === 33) return val;
    val = sumDigits(val);
  }
  return val;
}

// Biến thể giữ thêm cả 10 (chỉ dùng cho Chặng 4)
function RM10(n) {
  let val = Math.abs(parseInt(n, 10) || 0);
  while (val > 9) {
    if (val === 10 || val === 11 || val === 22 || val === 33) return val;
    val = sumDigits(val);
  }
  return val;
}

// Quy tắc nguyên âm / phụ âm - xét chữ Y
function isVowel(ch, prev, next) {
  if ('AEIOU'.includes(ch)) return true;
  if (ch === 'Y') {
    const prevV = prev && 'AEIOU'.includes(prev);
    const nextV = next && 'AEIOU'.includes(next);
    if (!prevV && !nextV) return true;
    return false;
  }
  return false;
}

// Hàm tính toán 23 chỉ số chuẩn thuật toán CACH_TINH_CHI_SO.md
function tinhThanSoHoc(hoTen, ngay, thang, nam) {
  const tenChuan = boDau(hoTen);
  const words = tenChuan.split(' ').filter(Boolean);

  const wordStats = words.map(w => {
    let tong = 0, tongNA = 0, tongPA = 0;
    const chars = [];
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      const val = PYTHAGORAS[ch] || 0;
      tong += val;
      const prev = i > 0 ? w[i - 1] : null;
      const next = i < w.length - 1 ? w[i + 1] : null;
      const isV = isVowel(ch, prev, next);
      if (isV) tongNA += val;
      else tongPA += val;
      chars.push({ ch, val, isV });
    }
    return { word: w, tong, tongNA, tongPA, chars };
  });

  // 1. Đường đời
  const tongNam = sumDigits(nam);
  const tongNgayThangNam = RM(ngay) + RM(thang) + RM(tongNam);
  const duongDoi = RM(tongNgayThangNam);
  const truocDuongDoi = tongNgayThangNam;

  // 2. Sứ mệnh
  const tongToanTen = wordStats.reduce((sum, ws) => sum + RN(ws.tong), 0);
  const suMenh = RN(tongToanTen);
  const truocSuMenh = tongToanTen;

  // 3. Linh hồn
  const tongNguyenAm = wordStats.reduce((sum, ws) => sum + RM(ws.tongNA), 0);
  const linhHon = RM(tongNguyenAm);
  const truocLinhHon = tongNguyenAm;

  // 4. Nhân cách
  const tongPhuAm = wordStats.reduce((sum, ws) => sum + RM(ws.tongPA), 0);
  const nhanCach = RM(tongPhuAm);
  const truocNhanCach = tongPhuAm;

  // 5. Trưởng thành
  const truocTruongThanh = duongDoi + suMenh;
  const truongThanh = RM(truocTruongThanh);

  // 6. Ngày sinh
  const ngaySinh = RM(ngay);
  const truocNgaySinh = ngay;

  // 7. Thái độ
  const truocThaiDo = ngay + thang;
  const thaiDo = RN(truocThaiDo);

  // 8. Tư duy lý trí
  const lastWord = wordStats[wordStats.length - 1];
  const tuDuyLyTri = RN((lastWord ? lastWord.tong : 0) + ngay);

  // 9. Cân bằng
  const tongKyTuDau = wordStats.reduce((sum, ws) => {
    const firstChar = ws.word[0];
    return sum + (PYTHAGORAS[firstChar] || 0);
  }, 0);
  const canBang = RN(tongKyTuDau);

  // 10-12. Đam mê / Thiếu / Tiềm thức
  const freq = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (const ws of wordStats) {
    for (const c of ws.chars) {
      if (freq[c.val] !== undefined) freq[c.val]++;
    }
  }

  // Đam mê: tần suất >= 2
  const damMe = Object.keys(freq)
    .map(Number)
    .filter(num => freq[num] >= 2)
    .sort((a, b) => {
      if (freq[b] !== freq[a]) return freq[b] - freq[a];
      return a - b;
    });

  // Chỉ số thiếu: tần suất = 0
  const chiSoThieu = Object.keys(freq)
    .map(Number)
    .filter(num => freq[num] === 0);

  // Sức mạnh tiềm thức
  const sucManhTiemThuc = 9 - chiSoThieu.length;

  // 13-14. Liên kết
  const lkDuongDoiSuMenh = RN(Math.abs(RN(duongDoi) - RN(suMenh)));
  const lkNhanCachLinhHon = RN(Math.abs(RN(nhanCach) - RN(linhHon)));

  // 15-18. Bốn Chặng
  const dN = RN(ngay);
  const tN = RN(thang);
  const nN = RN(tongNam);

  const chang1 = RM(dN + tN);
  const chang2 = RM(dN + nN);
  const chang3 = RM(chang1 + chang2);
  const chang4 = RM10(tN + nN);

  const tuoi1 = 36 - RN(duongDoi);
  const tuoi2 = tuoi1 + 9;
  const tuoi3 = tuoi1 + 18;
  const tuoi4 = tuoi1 + 27;

  const nam1 = nam + tuoi1;
  const nam2 = nam + tuoi2;
  const nam3 = nam + tuoi3;
  const nam4 = nam + tuoi4;

  // 19-22. Bốn Thử thách
  const thuThach1 = RM(Math.abs(dN - tN));
  const thuThach2 = RM(Math.abs(dN - nN));
  const thuThach3 = RM(Math.abs(thuThach1 - thuThach2));
  const thuThach4 = RM(Math.abs(tN - nN));

  // 23. Nợ nghiệp
  const noNghiepSet = new Set();
  const NO_NGHIEP_TARGETS = [13, 14, 16, 19];
  const xetNoNghiep = [
    truocDuongDoi,
    truocSuMenh,
    truocLinhHon,
    truocNhanCach,
    truocThaiDo,
    truocNgaySinh
  ];
  for (const val of xetNoNghiep) {
    if (NO_NGHIEP_TARGETS.includes(val)) {
      noNghiepSet.add(val);
    }
  }
  const noNghiep = Array.from(noNghiepSet).sort((a, b) => a - b);

  // Chu kỳ cá nhân & năm thế giới (tính theo ngày truy cập)
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1;
  const curDay = now.getDate();

  const namTheGioi = RN(curYear);
  const namCaNhan = RN(RN(ngay) + RN(thang) + RN(curYear));
  const thangCaNhan = RN(namCaNhan + curMonth);
  const ngayCaNhan = RN(thangCaNhan + curDay);

  return {
    hoTen, tenChuan, ngay, thang, nam, wordStats,
    duongDoi, truocDuongDoi,
    suMenh, truocSuMenh,
    linhHon, truocLinhHon,
    nhanCach, truocNhanCach,
    truongThanh, truocTruongThanh,
    ngaySinh, truocNgaySinh,
    thaiDo, truocThaiDo,
    tuDuyLyTri, canBang,
    damMe, chiSoThieu, sucManhTiemThuc,
    lkDuongDoiSuMenh, lkNhanCachLinhHon,
    chang: [
      { num: 1, val: chang1, age: tuoi1, year: nam1 },
      { num: 2, val: chang2, age: tuoi2, year: nam2 },
      { num: 3, val: chang3, age: tuoi3, year: nam3 },
      { num: 4, val: chang4, age: tuoi4, year: nam4 }
    ],
    thuThach: [
      { num: 1, val: thuThach1 },
      { num: 2, val: thuThach2 },
      { num: 3, val: thuThach3 },
      { num: 4, val: thuThach4 }
    ],
    noNghiep,
    chuKy: { namTheGioi, namCaNhan, thangCaNhan, ngayCaNhan }
  };
}

// App State
let currentUser = null;
let currentResult = null;
let currentFilter = 'all';
let currentSelectedTransitYear = null;

// Kiểm tra trạng thái đăng nhập
async function checkAuth() {
  try {
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const data = await res.json();
      currentUser = data.authenticated ? data.user : null;
      if (currentUser) {
        try { localStorage.setItem('tsh_user', JSON.stringify(currentUser)); } catch (e) {}
      } else {
        try { localStorage.removeItem('tsh_user'); } catch (e) {}
      }
      updateAuthUI();
      return;
    }
  } catch (err) {}

  // Fallback cho môi trường tĩnh (GitHub Pages) hoặc khi mất kết nối máy chủ
  try {
    const savedUser = localStorage.getItem('tsh_user');
    currentUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    currentUser = null;
  }
  updateAuthUI();
}

function updateAuthUI() {
  const authNav = document.getElementById('auth-nav');
  const verifyBanner = document.getElementById('verify-banner');

  if (!authNav) return;

  if (currentUser) {
    authNav.innerHTML = `
      <div class="user-menu-wrap">
        <button type="button" class="btn-user-badge" id="btn-user-menu">
          <span class="user-avatar">${currentUser.email.slice(0, 1).toUpperCase()}</span>
          <span class="user-email">${currentUser.email}</span>
          <span class="chevron-down">▼</span>
        </button>
        <div class="user-dropdown" id="user-dropdown">
          <div style="padding: 10px 16px; border-bottom: 1px solid var(--border-color); font-size: 0.82rem;">
            ${currentUser.is_verified 
              ? '<span style="color: #10b981; font-weight: 600;">✓ Đã được Admin kích hoạt</span>' 
              : '<span style="color: #f59e0b; font-weight: 600;">⏳ Chờ Admin xác thực</span>'}
          </div>
          <a href="javascript:void(0)" onclick="openHistoryModal()"><span class="icon">📜</span> Lịch sử tra cứu</a>
          ${currentUser.is_verified ? '' : '<a href="lienhe.html"><span class="icon">📞</span> Liên hệ kích hoạt nhanh</a>'}
          <div class="dropdown-divider"></div>
          <a href="javascript:void(0)" onclick="handleLogout()"><span class="icon">🚪</span> Đăng xuất</a>
        </div>
      </div>
    `;

    const btnUser = document.getElementById('btn-user-menu');
    const dropdown = document.getElementById('user-dropdown');
    if (btnUser && dropdown) {
      btnUser.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('active');
      });
      document.addEventListener('click', () => dropdown.classList.remove('active'));
    }

    if (verifyBanner) {
      if (!currentUser.is_verified) {
        verifyBanner.style.display = 'block';
        verifyBanner.innerHTML = `
          <div class="banner-content container">
            <span class="banner-icon">⏳</span>
            <div class="banner-text">
              <strong>Tài khoản đang chờ Admin xác thực:</strong> Bạn đang được trải nghiệm 1 lượt tra cứu dùng thử. Vui lòng liên hệ Quản trị viên để được duyệt và kích hoạt tài khoản sử dụng không giới hạn.
              <a href="lienhe.html" class="btn-resend-inline" style="margin-left: 8px;">Liên hệ Admin &rarr;</a>
            </div>
          </div>
        `;
      } else {
        verifyBanner.style.display = 'none';
      }
    }
  } else {
    authNav.innerHTML = `
      <button type="button" class="btn btn-outline btn-sm" onclick="openAuthModal('login')">Đăng nhập</button>
      <button type="button" class="btn btn-primary btn-sm" onclick="openAuthModal('register')">Đăng ký miễn phí</button>
    `;
    if (verifyBanner) verifyBanner.style.display = 'none';
  }

  // Re-render map, transit bar and cards if results exist
  if (currentResult) {
    renderTransitBar(currentResult);
    renderSvgMap(currentResult);
    renderCards(currentResult);
  }
}

// Vẽ bản đồ Thần Số Học SVG (khớp chính xác 100% với ảnh mẫu bản đồ.png)
function renderSvgMap(data) {
  const container = document.getElementById('svg-map-container');
  if (!container) return;

  const isUnlocked = !!currentUser;

  // Tính toán chu kỳ thời gian theo năm đang chọn trên Thanh Vận Trình
  const selectedYear = currentSelectedTransitYear || new Date().getFullYear();
  const worldYearVal = RN(selectedYear);
  const personalYearVal = RN(RN(data.ngay) + RN(data.thang) + worldYearVal);
  const now = new Date();
  const curMonth = now.getMonth() + 1;
  const curDay = now.getDate();
  const personalMonthVal = RN(personalYearVal + curMonth);
  const personalDayVal = RN(personalMonthVal + curDay);

  // Helper hàm tạo nốt vòng tròn
  function nodeCircle(x, y, r, val, rawVal, label, key, isFreeNode = false, hasHalo = false, labelPos = 'bottom', labelColor = 'red') {
    const isLocked = !isUnlocked && !isFreeNode;
    const displayVal = isLocked ? '🔒' : val;
    const haloEl = hasHalo ? `<circle cx="${x}" cy="${y}" r="${r + 20}" fill="url(#halo-glow)" class="halo-circle" pointer-events="none" />` : '';

    // Label positioning
    let labelY = y + r + 16;
    if (labelPos === 'top') {
      labelY = y - r - 8;
    }

    const fillLabel = labelColor === 'red' ? '#dc2626' : '#000000';
    let labelSvg = '';
    if (label.includes('\n')) {
      const parts = label.split('\n');
      labelSvg = `
        <text x="${x}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="bold" fill="${fillLabel}">${parts[0]}</text>
        <text x="${x}" y="${labelY + 14}" text-anchor="middle" font-size="12" font-weight="bold" fill="${fillLabel}">${parts[1]}</text>
      `;
    } else {
      labelSvg = `<text x="${x}" y="${labelY}" text-anchor="middle" font-size="12" font-weight="bold" fill="${fillLabel}">${label}</text>`;
    }

    // Number text position (if rawVal exists, put rawVal in tiny font under main val)
    let numberSvg = '';
    if (!isLocked && rawVal && rawVal !== val) {
      numberSvg = `
        <text x="${x}" y="${y + 2}" text-anchor="middle" font-size="17" font-weight="bold" fill="#ffffff">${displayVal}</text>
        <text x="${x}" y="${y + 15}" text-anchor="middle" font-size="10" font-weight="600" fill="#e0f2fe">${rawVal}</text>
      `;
    } else {
      numberSvg = `
        <text x="${x}" y="${y + 6}" text-anchor="middle" font-size="18" font-weight="bold" fill="#ffffff">${displayVal}</text>
      `;
    }

    return `
      ${haloEl}
      <g class="map-node ${isLocked ? 'locked-node' : 'active-node'}" 
         data-key="${key}" 
         data-val="${val}" 
         onclick="handleNodeClick(this, '${key}', ${isFreeNode})" 
         ondblclick="handleNodeDblClick('${key}', '${val}', ${isFreeNode})">
        <circle cx="${x}" cy="${y}" r="${r}" class="node-circle" />
        ${numberSvg}
        ${labelSvg}
      </g>
    `;
  }

  // Missing numbers string
  const missingStr = isUnlocked 
    ? (data.chiSoThieu.length ? data.chiSoThieu.join(', ') : '0') 
    : '🔒';

  // Passion numbers string
  const passionStr = isUnlocked 
    ? (data.damMe.length ? data.damMe.slice(0, 4).join(', ') : '0') 
    : '🔒';

  // Debt numbers string
  const debtStr = data.noNghiep.length ? data.noNghiep.join(', ') : 'Không có';

  const svgHtml = `
    <svg viewBox="0 0 600 640" class="tsh-svg" id="tsh-interactive-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Mũi tên xanh -->
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>
        <marker id="arrow-blue-sm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6" />
        </marker>

        <!-- Hào quang vàng mềm mại (Radial Halo Glow) -->
        <radialGradient id="halo-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fef08a" stop-opacity="0.85" />
          <stop offset="45%" stop-color="#fde047" stop-opacity="0.55" />
          <stop offset="75%" stop-color="#facc15" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#facc15" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- NỀN TRẮNG CHUẨN MẪU BẢN ĐỒ -->
      <rect width="600" height="640" fill="#ffffff" rx="8" />

      <!-- 1. HÌNH KHỐI KIM CƯƠNG & ĐƯỜNG NỐI CHÍNH -->

      <!-- Cung cong kết nối Đường đời và Sứ mệnh: 2 đầu chạm đúng vào 2 đầu của đường liên kết tại (132, 218) và (468, 218), đỉnh cong chạm nốt LK (300, 155) -->
      <path d="M 132 218 Q 300 92 468 218" fill="none" stroke="#3b82f6" stroke-width="2" />

      <!-- Đường mũi tên từ Đường đời lên Trưởng thành: bắt đầu từ đúng đầu vòng cung (132, 218) -->
      <line x1="132" y1="218" x2="280" y2="70" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)" />

      <!-- Đường mũi tên từ Sứ mệnh lên Trưởng thành: bắt đầu từ đúng đầu vòng cung (468, 218) -->
      <line x1="468" y1="218" x2="320" y2="70" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)" />

      <!-- Đường nối từ Đường đời chéo xuống Linh hồn -->
      <line x1="130" y1="255" x2="280" y2="422" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)" />

      <!-- Đường nối từ Sứ mệnh chéo xuống Linh hồn (cạnh dưới phải hình thoi) -->
      <line x1="470" y1="255" x2="320" y2="422" stroke="#3b82f6" stroke-width="2" />

      <!-- ĐƯỜNG LIÊN KẾT NGÀY SINH - ĐƯỜNG ĐỜI: THẲNG ĐỨNG TUYỆT ĐỐI (x=115) -->
      <line x1="115" y1="415" x2="115" y2="260" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)" />

      <!-- Mũi tên từ Ngày sinh thẳng ngang SANG Linh hồn -->
      <line x1="140" y1="440" x2="272" y2="440" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow-blue)" />

      <!-- ĐƯỜNG LIÊN KẾT NHÂN CÁCH - SỨ MỆNH: THẲNG ĐỨNG TUYỆT ĐỐI (x=485) -->
      <line x1="485" y1="260" x2="485" y2="415" stroke="#3b82f6" stroke-width="2" />

      <!-- ĐƯỜNG LIÊN KẾT ĐAM MÊ VÀ NGÀY SINH: MŨI TÊN CHĨA VÀO NGÀY SINH -->
      <line x1="174" y1="476" x2="138" y2="453" stroke="#3b82f6" stroke-width="1.8" marker-end="url(#arrow-blue)" />

      <!-- Đường nối giữa Linh hồn và Nhân cách (chạy qua LK NC-LH) -->
      <line x1="325" y1="445" x2="375" y2="465" stroke="#3b82f6" stroke-width="2" />
      <line x1="405" y1="465" x2="460" y2="445" stroke="#3b82f6" stroke-width="2" />

      <!-- Mũi tên nét đứt từ Sức mạnh tiềm thức LÊN Linh hồn -->
      <line x1="300" y1="525" x2="300" y2="470" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow-blue)" />

      <!-- 2. VẠCH NGANG NỢ NGHIỆP & THÁI ĐỘ: VẼ GIỐNG HỆT NHAU, ĐỐI XỨNG QUA TRỤC GIỮA TẠI y=135 -->

      <!-- Vạch ngang Nợ nghiệp: ĐỤNG VÀO ĐƯỜNG LIÊN KẾT ĐƯỜNG ĐỜI - TRƯỞNG THÀNH TẠI (216, 135), VẼ GIỐNG ĐƯỜNG THÁI ĐỘ -->
      <line x1="75" y1="135" x2="216" y2="135" stroke="#3b82f6" stroke-width="1.8" />
      <text x="145" y="122" font-size="16" font-weight="bold" fill="#000000" text-anchor="middle">
        ${isUnlocked ? debtStr : '🔒'}
      </text>
      <text x="145" y="155" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Nợ nghiệp</text>

      <!-- Vạch ngang Thái độ: ĐỤNG VÀO ĐƯỜNG LIÊN KẾT SỨ MỆNH - TRƯỞNG THÀNH TẠI (384, 135) -->
      <line x1="384" y1="135" x2="525" y2="135" stroke="#3b82f6" stroke-width="1.8" />
      <text x="455" y="122" font-size="17" font-weight="bold" fill="#000000" text-anchor="middle">
        ${isUnlocked ? data.thaiDo : '🔒'}
      </text>
      <text x="455" y="155" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Thái độ</text>

      <!-- CB & TDLT (phía trên đỉnh cung cong) -->
      <text x="260" y="112" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">CB</text>
      <text x="260" y="130" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">${isUnlocked ? data.canBang : '🔒'}</text>

      <text x="340" y="112" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">TDLT</text>
      <text x="340" y="130" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle">${isUnlocked ? data.tuDuyLyTri : '🔒'}</text>

      <!-- 3. KHU VỰC TRUNG TÂM: 4 Ô CHẶNG (C) & 4 Ô THỬ THÁCH (TT) CÓ CLICK ĐỔI MÀU -->
      <g>
        <!-- Nhãn C: màu đỏ -->
        <text x="195" y="225" font-size="14" font-weight="bold" fill="#dc2626">C:</text>
        <!-- 4 Ô Chặng: Click đổi màu xanh lá ⇄ vàng cam -->
        <rect x="215" y="206" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#f59e0b')" />
        <text x="234" y="225" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.chang[0].val : '🔒'}</text>

        <rect x="263" y="206" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#f59e0b')" />
        <text x="282" y="225" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.chang[1].val : '🔒'}</text>

        <rect x="311" y="206" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#f59e0b')" />
        <text x="330" y="225" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.chang[2].val : '🔒'}</text>

        <rect x="359" y="206" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#f59e0b')" />
        <text x="378" y="225" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.chang[3].val : '🔒'}</text>

        <!-- Nhãn TT: màu đỏ -->
        <text x="190" y="259" font-size="14" font-weight="bold" fill="#dc2626">TT:</text>
        <!-- 4 Ô Thử thách: Click đổi màu xanh lá ⇄ đỏ/cam -->
        <rect x="215" y="240" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#dc2626')" />
        <text x="234" y="259" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.thuThach[0].val : '🔒'}</text>

        <rect x="263" y="240" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#dc2626')" />
        <text x="282" y="259" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.thuThach[1].val : '🔒'}</text>

        <rect x="311" y="240" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#dc2626')" />
        <text x="330" y="259" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.thuThach[2].val : '🔒'}</text>

        <rect x="359" y="240" width="38" height="28" fill="#2e7d32" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#2e7d32', '#dc2626')" />
        <text x="378" y="259" font-size="15" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">${isUnlocked ? data.thuThach[3].val : '🔒'}</text>
      </g>

      <!-- 4 Dấu ngoặc tuổi và năm phía dưới -->
      <g stroke="#000000" stroke-width="1.2" fill="none">
        <path d="M 215 274 Q 234 284 253 274" />
        <path d="M 263 274 Q 282 284 301 274" />
        <path d="M 311 274 Q 330 284 349 274" />
        <path d="M 359 274 Q 378 284 397 274" />
      </g>
      <text x="234" y="296" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">${data.chang[0].age}</text>
      <text x="234" y="312" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">(${data.chang[0].year})</text>

      <text x="282" y="296" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">${data.chang[1].age}</text>
      <text x="282" y="312" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">(${data.chang[1].year})</text>

      <text x="330" y="296" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">${data.chang[2].age}</text>
      <text x="330" y="312" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">(${data.chang[2].year})</text>

      <text x="378" y="296" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">${data.chang[3].age}</text>
      <text x="378" y="312" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">(${data.chang[3].year})</text>

      <!-- HỌ TÊN VÀ NGÀY SINH TRUNG TÂM -->
      <text x="300" y="342" font-size="15" font-weight="800" fill="#1a4480" text-anchor="middle">${data.tenChuan}</text>
      <text x="300" y="360" font-size="13" font-weight="700" fill="#1a4480" text-anchor="middle">${data.ngay}/${data.thang}/${data.nam}</text>

      <!-- 4. KHU VỰC THIẾU & ĐAM MÊ (CLICK ĐỔI MÀU) -->
      <!-- Vòng cung Chỉ số thiếu to hơn (R=42, r=26): Click đổi màu viền và nền -->
      <g>
        <path d="M 143 400 A 42 42 0 0 1 227 400 L 211 400 A 26 26 0 0 0 159 400 Z" 
              fill="#ffffff" stroke="#000000" stroke-width="1.6" 
              class="toggle-shape-btn" 
              onclick="handleShapeClick(this, '#ffffff', '#fef08a', '#000000', '#dc2626')" />
        <text x="185" y="388" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle" pointer-events="none">Thiếu</text>
        <text x="185" y="418" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">${missingStr}</text>
      </g>

      <!-- Hình Bầu Dục Đam mê: Click đổi màu xanh dương ⇄ xanh lá -->
      <g>
        <ellipse cx="195" cy="485" rx="24" ry="16" fill="#4a90e2" class="toggle-shape-btn" onclick="handleShapeClick(this, '#4a90e2', '#2e7d32')" />
        <text x="195" y="490" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle" pointer-events="none">${passionStr}</text>
        <text x="195" y="517" font-size="12" font-weight="bold" fill="#dc2626" text-anchor="middle">Đ.Mê</text>
      </g>

      <!-- 5. KHU VỰC CHU KỲ CÁ NHÂN (CHUẨN 3 Ô THEO ẢNH MẪU BẢN ĐỒ.PNG: NĂM CN, THÁNG CN, NGÀY CN) -->
      <g id="group-chu-ky">
        <!-- Năm CN (Năm cá nhân) -->
        <text x="438" y="342" font-size="12" font-weight="bold" fill="#000000" text-anchor="end">Năm CN:</text>
        <rect id="svg-rect-nam-cn" x="445" y="327" width="30" height="21" fill="#4a90e2" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#4a90e2', '#2e7d32')" />
        <text id="svg-text-nam-cn" x="460" y="342" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle" pointer-events="none">${personalYearVal}</text>

        <!-- Tháng CN (Tháng cá nhân) -->
        <text x="438" y="373" font-size="12" font-weight="bold" fill="#000000" text-anchor="end">Tháng CN:</text>
        <rect id="svg-rect-thang-cn" x="445" y="358" width="30" height="21" fill="#4a90e2" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#4a90e2', '#2e7d32')" />
        <text id="svg-text-thang-cn" x="460" y="373" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle" pointer-events="none">${personalMonthVal}</text>

        <!-- Ngày CN (Ngày cá nhân) -->
        <text x="438" y="404" font-size="12" font-weight="bold" fill="#000000" text-anchor="end">Ngày CN:</text>
        <rect id="svg-rect-ngay-cn" x="445" y="389" width="30" height="21" fill="#4a90e2" rx="2" class="rect-toggle-btn" onclick="handleRectClick(this, '#4a90e2', '#2e7d32')" />
        <text id="svg-text-ngay-cn" x="460" y="404" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle" pointer-events="none">${personalDayVal}</text>
      </g>

      <!-- 6. CÁC VÒNG TRÒN NỐT CHÍNH (CÓ HÀO QUANG VÀNG VÀ TƯƠNG TÁC) -->

      <!-- Đỉnh 1: Trưởng thành (hào quang vàng, nhãn đỏ phía DƯỚI) -->
      ${nodeCircle(300, 52, 25, data.truongThanh, data.truocTruongThanh, 'Trưởng thành', 'truongThanh', false, true, 'bottom', 'red')}

      <!-- Đỉnh 2: Đường đời (MIỄN PHÍ, hào quang vàng, nhãn đỏ phía TRÊN, tọa độ x=115) -->
      ${nodeCircle(115, 235, 25, data.duongDoi, data.truocDuongDoi, 'Đường đời', 'duongDoi', true, true, 'top', 'red')}

      <!-- Đỉnh 3: Sứ mệnh (MIỄN PHÍ, hào quang vàng, nhãn đỏ phía TRÊN, tọa độ x=485) -->
      ${nodeCircle(485, 235, 25, data.suMenh, data.truocSuMenh, 'Sứ mệnh', 'suMenh', true, true, 'top', 'red')}

      <!-- Vòng tròn LK trên cung cong (hào quang vàng, uốn cong chạm đúng tâm nút, nhãn đỏ phía DƯỚI) -->
      ${nodeCircle(300, 155, 21, data.lkDuongDoiSuMenh, '', 'LK', 'lkDuongDoiSuMenh', false, true, 'bottom', 'red')}

      <!-- Vòng tròn Linh hồn (hào quang vàng, nhãn đỏ phía TRÊN) -->
      ${nodeCircle(300, 440, 25, data.linhHon, data.truocLinhHon, 'Linh hồn', 'linhHon', false, true, 'top', 'red')}

      <!-- Vòng tròn Ngày sinh (không hào quang, tọa độ x=115 THẲNG ĐỨNG với Đường đời, nhãn đen 2 dòng) -->
      ${nodeCircle(115, 440, 25, data.ngaySinh, data.truocNgaySinh, 'Ngày\nsinh', 'ngaySinh', false, false, 'bottom', 'black')}

      <!-- Vòng tròn Nhân cách (tọa độ x=485 THẲNG ĐỨNG với Sứ mệnh, nhãn đen 2 dòng) -->
      ${nodeCircle(485, 440, 25, data.nhanCach, data.truocNhanCach, 'Nhân\ncách', 'nhanCach', false, false, 'bottom', 'black')}

      <!-- Vòng tròn LK NC-LH (nhãn đỏ LK LH- phía DƯỚI) -->
      ${nodeCircle(390, 470, 20, data.lkNhanCachLinhHon, '', 'LK LH-', 'lkNhanCachLinhHon', false, false, 'bottom', 'red')}

      <!-- Vòng tròn Sức mạnh tiềm thức (không hào quang, nhãn đen 2 dòng phía DƯỚI) -->
      ${nodeCircle(300, 550, 23, data.sucManhTiemThuc, '', 'Sức mạnh\ntiềm thức', 'sucManhTiemThuc', false, false, 'bottom', 'black')}

    </svg>
  `;

  container.innerHTML = svgHtml;
}

// Dữ liệu tóm tắt năng lượng cho từng con số Vận trình năm (1-9)
const YEAR_ENERGY_MAP = {
  1: {
    title: 'Khởi đầu mới & Tiên phong',
    keywords: 'Gieo hạt, độc lập, quyết đoán, bứt phá',
    desc: 'Thời điểm bắt đầu chu kỳ 9 năm mới. Hãy dũng cảm bước ra khỏi vùng an toàn, khởi xướng các kế hoạch và dự án mới.'
  },
  2: {
    title: 'Hòa hợp & Kết nối',
    keywords: 'Lắng nghe, kiên nhẫn, hợp tác, trực giác',
    desc: 'Năm của sự lắng đọng và nuôi dưỡng các mối quan hệ. Hãy học cách kiên nhẫn, hợp tác thay vì vội vã đối đầu.'
  },
  3: {
    title: 'Sáng tạo & Mở rộng',
    keywords: 'Bùng nổ ý tưởng, giao tiếp, học tập, lạc quan',
    desc: 'Năm ngập tràn niềm vui và cảm hứng nghệ thuật. Rất thuận lợi cho việc học hỏi thêm kỹ năng, mở rộng giao lưu xã hội.'
  },
  4: {
    title: 'Củng cố nền móng & Kỷ luật',
    keywords: 'Trật tự, thực tế, quản trị tài chính, sức khỏe',
    desc: 'Năm để siết chặt kỷ luật, củng cố nền tảng tài chính và sức khỏe. Hãy làm việc chăm chỉ, cẩn trọng trong từng chi tiết.'
  },
  5: {
    title: 'Chuyển biến & Tự do',
    keywords: 'Đổi mới, trải nghiệm, linh hoạt, đón thời cơ',
    desc: 'Năm đỉnh giữa chu kỳ với nhiều biến động bất ngờ. Đón nhận sự thay đổi, sẵn sàng thích nghi và bứt phá giới hạn cũ.'
  },
  6: {
    title: 'Yêu thương & Trách nhiệm',
    keywords: 'Gia đình, tổ ấm, phụng sự, hàn gắn, chữa lành',
    desc: 'Tâm điểm hướng về gia đình và trách nhiệm xã hội. Thời điểm tuyệt vời để xây dựng tổ ấm, kết hôn hoặc chăm sóc người thân.'
  },
  7: {
    title: 'Chiêm nghiệm & Phát triển nội tâm',
    keywords: 'Tĩnh lặng, học hỏi chiều sâu, giác ngộ, phục hồi',
    desc: 'Năm của việc quay về bên trong, nâng cao tri thức và tâm linh. Hạn chế đầu tư mạo hiểm, ưu tiên trau dồi nội lực.'
  },
  8: {
    title: 'Thành tựu & Thịnh vượng',
    keywords: 'Gặt hái tài chính, quyền lực, bứt phá sự nghiệp',
    desc: 'Năm gặt hái quả ngọt từ những nỗ lực trước đây. Cơ hội thăng tiến mạnh mẽ về tài chính, địa vị và khẳng định bản lĩnh.'
  },
  9: {
    title: 'Hoàn tất & Khép lại chu kỳ',
    keywords: 'Bao dung, buông bỏ điều cũ, nhân đạo, chuẩn bị mới',
    desc: 'Năm cuối cùng của chu kỳ 9 năm. Hãy dọn dẹp những điều không còn phù hợp, tha thứ, bao dung để đón chu kỳ mới rực rỡ.'
  }
};

// Render Thanh Vận Trình Thời Gian & Chu Kỳ Năm (Phương án A1)
function renderTransitBar(data) {
  const container = document.getElementById('transit-timeline-container');
  if (!container || !data) return;

  const now = new Date();
  const currentActualYear = now.getFullYear();
  if (!currentSelectedTransitYear) {
    currentSelectedTransitYear = currentActualYear;
  }

  const selectedYear = currentSelectedTransitYear;
  const worldYear = RN(selectedYear);
  const personalYear = RN(RN(data.ngay) + RN(data.thang) + worldYear);
  const curMonth = now.getMonth() + 1;
  const curDay = now.getDate();
  const personalMonth = RN(personalYear + curMonth);
  const personalDay = RN(personalMonth + curDay);

  const worldInfo = YEAR_ENERGY_MAP[worldYear] || YEAR_ENERGY_MAP[1];
  const personalInfo = YEAR_ENERGY_MAP[personalYear] || YEAR_ENERGY_MAP[1];

  // Tạo danh sách các năm cho dropdown (từ hiện tại - 2 đến hiện tại + 6)
  const minYear = currentActualYear - 2;
  const maxYear = currentActualYear + 6;
  let yearOptionsHtml = '';
  for (let y = minYear; y <= maxYear; y++) {
    yearOptionsHtml += `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>Năm ${y}</option>`;
  }

  container.innerHTML = `
    <div class="transit-card">
      <div class="transit-header">
        <div class="transit-title-group">
          <span class="transit-icon">⏳</span>
          <div>
            <h4 class="transit-main-title">VẬN TRÌNH THỜI GIAN & CHU KỲ VẬN NIÊN</h4>
            <div class="transit-subtitle">Dòng chảy năng lượng Năm Thế Giới tác động lên Năm Cá Nhân của bạn</div>
          </div>
        </div>

        <div class="transit-controls">
          <button type="button" class="btn-transit-nav" onclick="changeTransitYear(-1)" title="Xem năm trước">◀ Năm trước</button>
          <select class="transit-year-select" onchange="changeTransitYearSelect(this.value)">
            ${yearOptionsHtml}
          </select>
          <button type="button" class="btn-transit-nav" onclick="changeTransitYear(1)" title="Xem năm sau">Năm sau ▶</button>
          ${selectedYear !== currentActualYear ? `
            <button type="button" class="btn-transit-reset" onclick="resetTransitYear()">Về năm ${currentActualYear} ↻</button>
          ` : ''}
        </div>
      </div>

      <div class="transit-grid">
        <!-- Khối Năm Thế Giới -->
        <div class="transit-item transit-item-world" onclick="openMeaningModal('namTheGioi', '${worldYear}')" title="Nhấp để xem luận giải chi tiết">
          <div class="transit-item-top">
            <span class="transit-badge transit-badge-world">🌐 TOÀN CẦU</span>
            <span class="transit-hint">🔍 Xem luận giải</span>
          </div>
          <div class="transit-main-row">
            <span class="transit-number">${worldYear}</span>
            <div>
              <div class="transit-name">Năm Thế Giới ${selectedYear}</div>
              <div class="transit-tagline">${worldInfo.title}</div>
            </div>
          </div>
          <div class="transit-desc-box">
            <div class="transit-keywords">"${worldInfo.keywords}"</div>
          </div>
        </div>

        <!-- Mũi tên tương tác -->
        <div class="transit-connector">
          <span>Tác động</span>
          <span class="transit-connector-arrow">➔</span>
        </div>

        <!-- Khối Năm Cá Nhân -->
        <div class="transit-item transit-item-personal" onclick="openMeaningModal('namCaNhan', '${personalYear}')" title="Nhấp để xem luận giải chi tiết">
          <div class="transit-item-top">
            <span class="transit-badge transit-badge-personal">👤 CỦA BẠN</span>
            <span class="transit-hint">🔍 Xem luận giải</span>
          </div>
          <div class="transit-main-row">
            <span class="transit-number">${personalYear}</span>
            <div>
              <div class="transit-name">Năm Cá Nhân ${selectedYear}</div>
              <div class="transit-tagline">${personalInfo.title}</div>
            </div>
          </div>
          <div class="transit-desc-box">
            <div class="transit-keywords">"${personalInfo.keywords}"</div>
          </div>
        </div>

        <!-- Khối Tháng Cá Nhân -->
        <div class="transit-item transit-item-sub" onclick="openMeaningModal('thangCaNhan', '${personalMonth}')" title="Nhấp để xem luận giải chi tiết">
          <div class="transit-sub-label">Tháng CN</div>
          <div class="transit-badge transit-badge-sub">T.${curMonth}</div>
          <div class="transit-number">${personalMonth}</div>
          <span class="transit-hint">🔍 Chi tiết</span>
        </div>

        <!-- Khối Ngày Cá Nhân -->
        <div class="transit-item transit-item-sub" onclick="openMeaningModal('ngayCaNhan', '${personalDay}')" title="Nhấp để xem luận giải chi tiết">
          <div class="transit-sub-label">Ngày CN</div>
          <div class="transit-badge transit-badge-sub">${curDay}/${curMonth}</div>
          <div class="transit-number">${personalDay}</div>
          <span class="transit-hint">🔍 Chi tiết</span>
        </div>
      </div>
    </div>
  `;
}

function changeTransitYear(delta) {
  if (!currentResult) return;
  const now = new Date();
  if (!currentSelectedTransitYear) currentSelectedTransitYear = now.getFullYear();
  currentSelectedTransitYear += delta;
  renderTransitBar(currentResult);
  renderSvgMap(currentResult);
}

function changeTransitYearSelect(val) {
  if (!currentResult) return;
  currentSelectedTransitYear = parseInt(val, 10);
  renderTransitBar(currentResult);
  renderSvgMap(currentResult);
}

function resetTransitYear() {
  if (!currentResult) return;
  currentSelectedTransitYear = new Date().getFullYear();
  renderTransitBar(currentResult);
  renderSvgMap(currentResult);
}

// Xử lý Click vòng tròn nốt bản đồ (đổi màu xanh dương ⇄ xanh lá)
function handleNodeClick(el, key, isFree) {
  if (!currentUser && !isFree) {
    openAuthModal('register');
    return;
  }
  const circle = el.querySelector('circle.node-circle') || el.querySelector('circle');
  if (circle) {
    if (circle.getAttribute('data-toggled') === 'true') {
      circle.style.fill = '';
      circle.removeAttribute('data-toggled');
    } else {
      circle.style.fill = '#2e7d32'; // Green from mẫu bản đồ.png
      circle.setAttribute('data-toggled', 'true');
    }
  }
}

// Xử lý Click nút hình chữ nhật chuyển màu (4 Chặng, 4 Thử thách, Chu kỳ cá nhân)
function handleRectClick(rect, defaultColor, toggleColor) {
  if (rect.getAttribute('data-toggled') === 'true') {
    rect.style.fill = defaultColor;
    rect.removeAttribute('data-toggled');
  } else {
    rect.style.fill = toggleColor;
    rect.setAttribute('data-toggled', 'true');
  }
}

// Xử lý Click nút hình đặc biệt (Đam mê, Chỉ số thiếu) chuyển màu
function handleShapeClick(el, defaultFill, toggleFill, defaultStroke, toggleStroke) {
  if (el.getAttribute('data-toggled') === 'true') {
    el.style.fill = defaultFill;
    if (defaultStroke) el.style.stroke = defaultStroke;
    el.removeAttribute('data-toggled');
  } else {
    el.style.fill = toggleFill;
    if (toggleStroke) el.style.stroke = toggleStroke;
    el.setAttribute('data-toggled', 'true');
  }
}

// Xử lý Double Click mở modal diễn giải
function handleNodeDblClick(key, val, isFree) {
  if (!currentUser && !isFree) {
    openAuthModal('register');
    return;
  }
  openMeaningModal(key, val);
}

// Render sơ đồ bảng quy đổi họ tên
function renderLetterBreakdown(data) {
  const container = document.getElementById('letter-breakdown-container');
  if (!container) return;

  let html = `
    <div class="table-responsive">
      <table class="table-letters">
        <thead>
          <tr>
            <th>Từ</th>
            <th>Ký tự & Điểm quy đổi</th>
            <th>Nguyên âm (RM)</th>
            <th>Phụ âm (RM)</th>
            <th>Tổng từ (RN)</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.wordStats.forEach(ws => {
    const lettersHtml = ws.chars.map(c => `
      <span class="char-badge ${c.isV ? 'vowel' : 'consonant'}">
        <span class="ch">${c.ch}</span>
        <span class="val">${c.val}</span>
      </span>
    `).join('');

    html += `
      <tr>
        <td class="word-name"><strong>${ws.word}</strong></td>
        <td><div class="letters-row">${lettersHtml}</div></td>
        <td><span class="pill pill-blue">${ws.tongNA} → ${RM(ws.tongNA)}</span></td>
        <td><span class="pill pill-purple">${ws.tongPA} → ${RM(ws.tongPA)}</span></td>
        <td><span class="pill pill-green">${ws.tong} → ${RN(ws.tong)}</span></td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = html;
}

// Render 23 Thẻ Chỉ Số
function renderCards(data) {
  const container = document.getElementById('indicator-cards-grid');
  if (!container) return;

  const isUnlocked = !!currentUser;
  const searchInput = document.getElementById('indicator-search');
  const query = searchInput ? boDau(searchInput.value) : '';

  const indicatorList = [
    { key: 'duongDoi', val: data.duongDoi, rawVal: data.truocDuongDoi },
    { key: 'suMenh', val: data.suMenh, rawVal: data.truocSuMenh },
    { key: 'linhHon', val: data.linhHon, rawVal: data.truocLinhHon },
    { key: 'nhanCach', val: data.nhanCach, rawVal: data.truocNhanCach },
    { key: 'truongThanh', val: data.truongThanh, rawVal: data.truocTruongThanh },
    { key: 'ngaySinh', val: data.ngaySinh, rawVal: data.truocNgaySinh },
    { key: 'thaiDo', val: data.thaiDo, rawVal: data.truocThaiDo },
    { key: 'tuDuyLyTri', val: data.tuDuyLyTri },
    { key: 'canBang', val: data.canBang },
    { key: 'damMe', val: data.damMe.length ? data.damMe.join(', ') : '0' },
    { key: 'chiSoThieu', val: data.chiSoThieu.length ? data.chiSoThieu.join(', ') : '0' },
    { key: 'sucManhTiemThuc', val: data.sucManhTiemThuc },
    { key: 'lkDuongDoiSuMenh', val: data.lkDuongDoiSuMenh },
    { key: 'lkNhanCachLinhHon', val: data.lkNhanCachLinhHon },
    { key: 'chang1', val: data.chang[0].val, extra: `(Tuổi ${data.chang[0].age} • Năm ${data.chang[0].year})` },
    { key: 'chang2', val: data.chang[1].val, extra: `(Tuổi ${data.chang[1].age} • Năm ${data.chang[1].year})` },
    { key: 'chang3', val: data.chang[2].val, extra: `(Tuổi ${data.chang[2].age} • Năm ${data.chang[2].year})` },
    { key: 'chang4', val: data.chang[3].val, extra: `(Tuổi ${data.chang[3].age} • Năm ${data.chang[3].year})` },
    { key: 'thuThach1', val: data.thuThach[0].val },
    { key: 'thuThach2', val: data.thuThach[1].val },
    { key: 'thuThach3', val: data.thuThach[2].val },
    { key: 'thuThach4', val: data.thuThach[3].val },
    { key: 'noNghiep', val: data.noNghiep.length ? data.noNghiep.join(', ') : 'Không có' }
  ];

  const cardsHtml = indicatorList
    .filter(item => {
      const def = TSH_DATA.indicators[item.key];
      if (!def) return false;

      // Group filter
      if (currentFilter !== 'all') {
        if (currentFilter === 'cotLoi' && def.group !== 'cotLoi') return false;
        if (currentFilter === 'boTro' && def.group !== 'boTro') return false;
        if (currentFilter === 'dinhCao' && def.group !== 'dinhCao') return false;
        if (currentFilter === 'thuThach' && def.group !== 'thuThach') return false;
        if (currentFilter === 'dacBiet' && def.group !== 'dacBiet') return false;
      }

      // Search filter
      if (query) {
        const namePlain = boDau(def.name);
        const descPlain = boDau(def.shortDesc);
        if (!namePlain.includes(query) && !descPlain.includes(query)) return false;
      }

      return true;
    })
    .map(item => {
      const def = TSH_DATA.indicators[item.key];
      const isLocked = !isUnlocked && !def.isFree;
      const displayVal = isLocked ? '🔒' : item.val;
      const rawText = !isLocked && item.rawVal ? `<span class="raw-val">(${item.rawVal})</span>` : '';
      const extraText = !isLocked && item.extra ? `<div class="card-extra">${item.extra}</div>` : '';

      return `
        <div class="indicator-card ${isLocked ? 'is-locked' : ''}" onclick="${isLocked ? `openAuthModal('register')` : `openMeaningModal('${item.key}', '${item.val}')`}">
          <div class="card-head">
            <span class="card-tag ${def.group}">${getGroupName(def.group)}</span>
            ${isLocked ? '<span class="lock-badge">🔒 Đăng ký để mở</span>' : '<span class="status-badge">Đã mở</span>'}
          </div>
          <div class="card-body">
            <h4 class="card-title">${def.name}</h4>
            <div class="card-number-wrap">
              <span class="card-number">${displayVal}</span>
              ${rawText}
            </div>
            ${extraText}
            <p class="card-desc">${def.shortDesc}</p>
          </div>
          <div class="card-footer">
            ${isLocked 
              ? '<button type="button" class="btn-unlock-card">Mở khoá miễn phí →</button>' 
              : '<button type="button" class="btn-detail-card">Xem chi tiết luận giải →</button>'}
          </div>
        </div>
      `;
    })
    .join('');

  container.innerHTML = cardsHtml || '<div class="no-results">Không tìm thấy chỉ số phù hợp với từ khoá.</div>';
}

function getGroupName(group) {
  switch (group) {
    case 'cotLoi': return 'Cốt lõi';
    case 'boTro': return 'Bổ trợ';
    case 'dinhCao': return '4 Đỉnh cao';
    case 'thuThach': return '4 Thử thách';
    case 'dacBiet': return 'Đặc biệt';
    default: return 'Khác';
  }
}

// Modal Diễn giải chỉ số
function openMeaningModal(key, val) {
  const modal = document.getElementById('meaning-modal');
  const body = document.getElementById('meaning-modal-body');
  if (!modal || !body) return;

  const def = TSH_DATA.indicators[key] || { name: key, shortDesc: '' };
  const numVal = parseInt(val, 10);
  const meaning = TSH_DATA.meanings[numVal] || TSH_DATA.meanings[1];

  let debtSection = '';
  if (key === 'noNghiep' && currentResult && currentResult.noNghiep.length) {
    debtSection = currentResult.noNghiep.map(d => {
      const debt = TSH_DATA.karmicDebts[d];
      if (!debt) return '';
      return `
        <div class="debt-box">
          <h4>${debt.title}</h4>
          <p><strong>Bản chất:</strong> ${debt.desc}</p>
          <p><strong>Cách hoá giải:</strong> ${debt.cure}</p>
        </div>
      `;
    }).join('');
  }

  body.innerHTML = `
    <div class="meaning-detail">
      <div class="meaning-header-box">
        <span class="badge-indicator">${def.name}</span>
        <h3 class="meaning-title">${meaning ? meaning.title : `Con số ${val}`}</h3>
        <p class="meaning-short-desc">${def.shortDesc}</p>
      </div>

      ${meaning ? `
        <div class="meaning-block">
          <h4>🌟 Từ khoá năng lượng</h4>
          <p class="keywords-list">${meaning.keywords}</p>
        </div>

        <div class="meaning-block">
          <h4>📖 Tổng quan năng lượng</h4>
          <p>${meaning.summary}</p>
        </div>

        <div class="meaning-grid-two">
          <div class="meaning-block strength">
            <h4>💪 Điểm mạnh & Tiềm năng</h4>
            <p>${meaning.strengths}</p>
          </div>
          <div class="meaning-block challenge">
            <h4>⚡ Thử thách & Bài học</h4>
            <p>${meaning.challenges}</p>
          </div>
        </div>

        <div class="meaning-block advice">
          <h4>🧭 Lời khuyên phát triển</h4>
          <p>${meaning.advice}</p>
        </div>
      ` : ''}

      ${debtSection ? `<div class="meaning-block">${debtSection}</div>` : ''}
    </div>
  `;

  modal.classList.add('active');
}

function closeMeaningModal() {
  const modal = document.getElementById('meaning-modal');
  if (modal) modal.classList.remove('active');
}

// Modal Đăng ký / Đăng nhập
function openAuthModal(tab = 'register') {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  switchAuthTab(tab);
  modal.classList.add('active');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

function switchAuthTab(tab) {
  const tabReg = document.getElementById('tab-btn-register');
  const tabLog = document.getElementById('tab-btn-login');
  const formReg = document.getElementById('auth-form-register');
  const formLog = document.getElementById('auth-form-login');

  if (tab === 'register') {
    tabReg?.classList.add('active');
    tabLog?.classList.remove('active');
    if (formReg) formReg.style.display = 'block';
    if (formLog) formLog.style.display = 'none';
  } else {
    tabLog?.classList.add('active');
    tabReg?.classList.remove('active');
    if (formLog) formLog.style.display = 'block';
    if (formReg) formReg.style.display = 'none';
  }
}

// Xuất ảnh PNG kết quả bằng Canvas
function exportResultImage() {
  if (!currentResult) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 1000;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 800, 1000);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e1b4b');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 1000);

  // Border frame
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 740, 940);

  // Golden inner border
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 720, 920);

  // Brand Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('BẢN ĐỒ THẦN SỐ HỌC PYTHAGORAS', 400, 90);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Khám phá tấm bản đồ vận mệnh độc bản của riêng bạn', 400, 120);

  // Divider
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(100, 150);
  ctx.lineTo(700, 150);
  ctx.stroke();

  // User Name
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(currentResult.tenChuan, 400, 210);

  // Date of birth
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`Ngày sinh: ${currentResult.ngay}/${currentResult.thang}/${currentResult.nam}`, 400, 250);

  // Main Badge: Đường Đời
  ctx.beginPath();
  ctx.arc(400, 380, 80, 0, Math.PI * 2);
  ctx.fillStyle = '#2563eb';
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.fillText(currentResult.duongDoi, 400, 395);

  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('CON SỐ ĐƯỜNG ĐỜI', 400, 495);

  // Meaning summary
  const meaning = TSH_DATA.meanings[parseInt(currentResult.duongDoi, 10)] || TSH_DATA.meanings[1];
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(meaning.title, 400, 540);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'italic 16px system-ui, sans-serif';
  ctx.fillText(`"${meaning.keywords}"`, 400, 575);

  // 3 Core Stats box
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(100, 620, 600, 140, 12);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Column 1: Sứ mệnh
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Sứ Mệnh', 200, 660);
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(currentResult.suMenh, 200, 715);

  // Column 2: Linh hồn
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Linh Hồn', 400, 660);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(currentUser ? currentResult.linhHon : '🔒', 400, 715);

  // Column 3: Nhân cách
  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Nhân Cách', 600, 660);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillText(currentUser ? currentResult.nhanCach : '🔒', 600, 715);

  // Strengths
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '15px system-ui, sans-serif';
  wrapText(ctx, `Điểm mạnh: ${meaning.strengths}`, 400, 800, 580, 22);

  // Footer branding
  ctx.fillStyle = '#64748b';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Tra cứu đầy đủ 23 chỉ số tại: Thần Số Học Pythagoras', 400, 930);

  // Download Trigger
  const link = document.createElement('a');
  link.download = `than-so-hoc-${boDau(currentResult.tenChuan).toLowerCase().replace(/\s+/g, '-')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

// Xử lý Form Tra cứu
async function handleLookupSubmit(e) {
  if (e) e.preventDefault();

  const nameInput = document.getElementById('input-fullname');
  const dayInput = document.getElementById('input-day');
  const monthInput = document.getElementById('input-month');
  const yearInput = document.getElementById('input-year');
  const errorBox = document.getElementById('lookup-error');

  if (errorBox) errorBox.style.display = 'none';

  const fullName = nameInput ? nameInput.value.trim() : '';
  const day = parseInt(dayInput?.value, 10);
  const month = parseInt(monthInput?.value, 10);
  const year = parseInt(yearInput?.value, 10);

  // Validation
  if (!fullName || fullName.length < 2) {
    showLookupError('Họ và tên phải có tối thiểu 2 chữ cái.');
    return;
  }
  if (!day || !month || !year) {
    showLookupError('Vui lòng chọn đầy đủ ngày, tháng, năm sinh.');
    return;
  }

  // Validate real date
  const birthDateObj = new Date(year, month - 1, day);
  if (
    birthDateObj.getFullYear() !== year ||
    birthDateObj.getMonth() !== month - 1 ||
    birthDateObj.getDate() !== day
  ) {
    showLookupError('Ngày tháng năm sinh không có thật trong lịch.');
    return;
  }

  const now = new Date();
  if (birthDateObj > now) {
    showLookupError('Ngày sinh không thể ở thời điểm tương lai.');
    return;
  }

  // Send to server to record lookup & check unverified quota
  const birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  try {
    const res = await fetch('/api/lookups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, birthDate: birthDateStr })
    });
    const resData = await res.json();
    if (!res.ok) {
      if (resData.error === 'REQUIRE_VERIFY') {
        showLookupError(resData.message);
        return;
      }
    }
  } catch (err) {
    console.warn('Could not record lookup on server:', err);
  }

  // Calculate results
  const result = tinhThanSoHoc(fullName, day, month, year);
  currentResult = result;

  // Save to localStorage
  try {
    localStorage.setItem('tsh_last_lookup', JSON.stringify({ fullName, day, month, year }));
    const historyList = JSON.parse(localStorage.getItem('tsh_lookup_history') || '[]');
    historyList.unshift({
      full_name: fullName,
      birth_date: birthDateStr,
      created_at: new Date().toISOString()
    });
    localStorage.setItem('tsh_lookup_history', JSON.stringify(historyList.slice(0, 30)));
  } catch (e) {}

  // Reset transit selected year to current actual year on new lookup
  currentSelectedTransitYear = new Date().getFullYear();

  // Render UI
  renderResultView(result);

  // Smooth scroll to results
  const resultSection = document.getElementById('results-section');
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }
}

function showLookupError(msg) {
  const errorBox = document.getElementById('lookup-error');
  if (errorBox) {
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  } else {
    alert(msg);
  }
}

function renderResultView(data) {
  // Update header summary
  const summaryName = document.getElementById('summary-fullname');
  const summaryDate = document.getElementById('summary-birthdate');
  const summaryDuongDoi = document.getElementById('summary-duongdoi-val');
  const summaryDuongDoi2 = document.getElementById('summary-duongdoi-val2');
  const summarySuMenh = document.getElementById('summary-sumenh-val');
  const summaryLinhHon = document.getElementById('summary-linhhon-val');
  const summaryNhanCach = document.getElementById('summary-nhancach-val');

  if (summaryName) summaryName.textContent = data.tenChuan;
  if (summaryDate) summaryDate.textContent = `${data.ngay}/${data.thang}/${data.nam}`;
  if (summaryDuongDoi) summaryDuongDoi.textContent = data.duongDoi;
  if (summaryDuongDoi2) summaryDuongDoi2.textContent = data.duongDoi;
  if (summarySuMenh) summarySuMenh.textContent = data.suMenh;
  if (summaryLinhHon) summaryLinhHon.textContent = currentUser ? data.linhHon : '🔒';
  if (summaryNhanCach) summaryNhanCach.textContent = currentUser ? data.nhanCach : '🔒';

  // Render Map, Transit Timeline, Letter Breakdown, Cards
  renderTransitBar(data);
  renderSvgMap(data);
  renderLetterBreakdown(data);
  renderCards(data);
}

// Modal Lịch sử tra cứu
async function openHistoryModal() {
  const modal = document.getElementById('history-modal');
  const list = document.getElementById('history-modal-list');
  if (!modal || !list) return;

  list.innerHTML = '<div class="loading-state">Đang tải lịch sử...</div>';
  modal.classList.add('active');

  let historyItems = [];
  try {
    const res = await fetch('/api/lookups');
    if (res.ok) {
      const data = await res.json();
      if (data.history && data.history.length) {
        historyItems = data.history;
      }
    }
  } catch (err) {}

  if (!historyItems.length) {
    try {
      historyItems = JSON.parse(localStorage.getItem('tsh_lookup_history') || '[]');
    } catch (e) {}
  }

  if (historyItems.length) {
    list.innerHTML = historyItems.map(item => {
      const d = new Date(item.created_at);
      const timeStr = d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="history-item" onclick="rerunHistoryLookup('${item.full_name}', '${item.birth_date}')">
          <div class="history-info">
            <strong>${item.full_name}</strong>
            <span>Ngày sinh: ${item.birth_date} • ${timeStr}</span>
          </div>
          <button type="button" class="btn-rerun">Tra cứu lại ↻</button>
        </div>
      `;
    }).join('');
  } else {
    list.innerHTML = '<div class="empty-state">Chưa có lịch sử tra cứu nào.</div>';
  }
}

function closeHistoryModal() {
  const modal = document.getElementById('history-modal');
  if (modal) modal.classList.remove('active');
}

function rerunHistoryLookup(fullName, birthDateStr) {
  closeHistoryModal();
  const parts = birthDateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const nameInput = document.getElementById('input-fullname');
    const dayInput = document.getElementById('input-day');
    const monthInput = document.getElementById('input-month');
    const yearInput = document.getElementById('input-year');

    if (nameInput) nameInput.value = fullName;
    if (dayInput) dayInput.value = day;
    if (monthInput) monthInput.value = month;
    if (yearInput) yearInput.value = year;

    handleLookupSubmit();
  }
}

// Xử lý gửi lại email xác thực
async function resendVerification() {
  try {
    const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
    const data = await res.json();
    alert(data.message || 'Đã gửi lại link xác thực.');
  } catch (err) {
    alert('Không thể gửi yêu cầu xác thực. Vui lòng thử lại sau.');
  }
}

// Xử lý đăng xuất
async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (err) {}
  currentUser = null;
  try { localStorage.removeItem('tsh_user'); } catch (e) {}
  updateAuthUI();
  window.location.reload();
}

// Populate Day / Month / Year Dropdowns
function populateDateDropdowns() {
  const daySelect = document.getElementById('input-day');
  const monthSelect = document.getElementById('input-month');
  const yearSelect = document.getElementById('input-year');

  if (daySelect && daySelect.options.length <= 1) {
    for (let i = 1; i <= 31; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Ngày ${i}`;
      daySelect.appendChild(opt);
    }
  }

  if (monthSelect && monthSelect.options.length <= 1) {
    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Tháng ${i}`;
      monthSelect.appendChild(opt);
    }
  }

  if (yearSelect && yearSelect.options.length <= 1) {
    const curYear = new Date().getFullYear();
    for (let i = curYear; i >= 1930; i--) {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = `Năm ${i}`;
      yearSelect.appendChild(opt);
    }
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  populateDateDropdowns();
  checkAuth();

  // Name Live Preview
  const nameInput = document.getElementById('input-fullname');
  const previewBox = document.getElementById('name-preview');
  if (nameInput && previewBox) {
    nameInput.addEventListener('input', () => {
      const raw = nameInput.value.trim();
      if (raw) {
        previewBox.textContent = `Không dấu: ${boDau(raw)}`;
        previewBox.style.display = 'block';
      } else {
        previewBox.style.display = 'none';
      }
    });
  }

  // Lookup Form
  const form = document.getElementById('lookup-form');
  if (form) {
    form.addEventListener('submit', handleLookupSubmit);
  }

  // Filter Tabs
  const filterTabs = document.querySelectorAll('.tab-filter-btn');
  filterTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      filterTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-group');
      if (currentResult) renderCards(currentResult);
    });
  });

  // Search input
  const searchInput = document.getElementById('indicator-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (currentResult) renderCards(currentResult);
    });
  }

  // Auth Forms
  const regForm = document.getElementById('auth-form-register');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reg-email').value;
      const pass = document.getElementById('reg-password').value;
      const errBox = document.getElementById('reg-error');
      if (errBox) errBox.style.display = 'none';

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        if (res.ok) {
          const data = await res.json();
          alert(data.message || 'Đăng ký tài khoản thành công! Tài khoản của bạn đang chờ Quản trị viên (Admin) duyệt và kích hoạt.');
          closeAuthModal();
          await checkAuth();
          return;
        } else if (res.status !== 404) {
          const data = await res.json();
          if (errBox) {
            errBox.textContent = data.message || 'Lỗi đăng ký.';
            errBox.style.display = 'block';
          }
          return;
        }
      } catch (err) {
        // Có thể là môi trường GitHub Pages tĩnh
      }

      // Fallback cho GitHub Pages tĩnh hoặc khi chạy offline
      const staticUser = { email, is_verified: 0 };
      try { localStorage.setItem('tsh_user', JSON.stringify(staticUser)); } catch (e) {}
      currentUser = staticUser;
      alert('Đăng ký tài khoản thành công! Tài khoản của bạn đang chờ Quản trị viên (Admin) duyệt và kích hoạt.');
      closeAuthModal();
      updateAuthUI();
    });
  }

  const logForm = document.getElementById('auth-form-login');
  if (logForm) {
    logForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      const errBox = document.getElementById('login-error');
      if (errBox) errBox.style.display = 'none';

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        if (res.ok) {
          closeAuthModal();
          await checkAuth();
          return;
        } else if (res.status !== 404) {
          const data = await res.json();
          if (errBox) {
            errBox.textContent = data.message || 'Email hoặc mật khẩu không đúng.';
            errBox.style.display = 'block';
          }
          return;
        }
      } catch (err) {
        // Fallback
      }

      // Fallback cho GitHub Pages tĩnh hoặc khi chạy offline
      const staticUser = { email, is_verified: 1 };
      try { localStorage.setItem('tsh_user', JSON.stringify(staticUser)); } catch (e) {}
      currentUser = staticUser;
      closeAuthModal();
      updateAuthUI();
    });
  }

  // Restore last lookup from localStorage if available
  try {
    const saved = localStorage.getItem('tsh_last_lookup');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (nameInput) nameInput.value = parsed.fullName;
      if (document.getElementById('input-day')) document.getElementById('input-day').value = parsed.day;
      if (document.getElementById('input-month')) document.getElementById('input-month').value = parsed.month;
      if (document.getElementById('input-year')) document.getElementById('input-year').value = parsed.year;
    }
  } catch (e) {}

  // Check URL parameters for verification message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('verified') === '1') {
    alert('🎉 Chúc mừng! Tài khoản của bạn đã được xác thực thành công. Bạn có thể tra cứu không giới hạn!');
  }
});
