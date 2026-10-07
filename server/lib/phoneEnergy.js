const db = require('./db');

// Nhóm 8 Từ Trường Bát Cực Linh Số
const CAT_TINH = ['SINH KHÍ', 'THIÊN Y', 'DIÊN NIÊN', 'PHỤC VỊ'];
const HUNG_TINH = ['TUYỆT MỆNH', 'NGŨ QUỶ', 'LỤC SÁT', 'HỌA HẠI'];

const TU_TRUONG_TITLE_MAP = {
  'SINH KHÍ': 'Sinh Khí',
  'THIÊN Y': 'Thiên Y',
  'DIÊN NIÊN': 'Diên Niên',
  'PHỤC VỊ': 'Phục Vị',
  'TUYỆT MỆNH': 'Tuyệt Mệnh',
  'NGŨ QUỶ': 'Ngũ Quỷ',
  'LỤC SÁT': 'Lục Sát',
  'HỌA HẠI': 'Họa Hại'
};

// Cache từ điển tra cứu từ SQLite vào bộ nhớ
let nlsoCache = null;
let ketLuanCache = null;

function loadCaches() {
  if (!nlsoCache) {
    try {
      const rows = db.prepare('SELECT ma_so, tu_truong, cap_do FROM nlso').all();
      nlsoCache = {};
      for (const r of rows) {
        nlsoCache[r.ma_so] = {
          tu_truong: r.tu_truong,
          cap_do: r.cap_do
        };
      }
    } catch (e) {
      console.error('Error loading nlso cache:', e.message);
      nlsoCache = {};
    }
  }

  if (!ketLuanCache) {
    try {
      const rows = db.prepare('SELECT tu_truong_1, tu_truong_2, ma_ket_luan, diem, ket_luan FROM ket_luan').all();
      ketLuanCache = {};
      for (const r of rows) {
        const key = `${r.tu_truong_1.trim().toUpperCase()} + ${r.tu_truong_2.trim().toUpperCase()}`;
        ketLuanCache[key] = {
          ma_ket_luan: r.ma_ket_luan,
          tu_truong_1: r.tu_truong_1,
          tu_truong_2: r.tu_truong_2,
          diem: r.diem,
          ket_luan: r.ket_luan
        };
      }
    } catch (e) {
      console.error('Error loading ket_luan cache:', e.message);
      ketLuanCache = {};
    }
  }
}

/**
 * 1. Chuẩn hóa số điện thoại:
 * - Loại bỏ khoảng trắng, dấu gạch ngang, chấm, ký tự không phải số.
 * - Bỏ đúng 1 số '0' đầu tiên nếu có.
 */
function normalizePhone(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.slice(1);
  }
  return cleaned;
}

/**
 * 2. Hàm RemoveOneDuplicateChar (Chuyển đổi chuẩn xác từ VBA):
 * Nếu một ký tự xuất hiện > 1 lần, bỏ bớt từng lần lặp ở các vị trí đầu, giữ lại lần cuối.
 */
function removeOneDuplicateChar(s) {
  if (!s) return '';
  const charCount = {};
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    charCount[ch] = (charCount[ch] || 0) + 1;
  }

  let result = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const cnt = charCount[ch];
    if (cnt > 1) {
      charCount[ch] = cnt - 1;
    } else {
      result += ch;
    }
  }
  return result;
}

/**
 * 3. Tách cụm số theo thuật toán TachSoDienThoai1 trong VBA:
 * Nhận vào chuỗi số (đã bỏ 0 đầu), trả về mảng các cụm số.
 */
function splitPhoneIntoFields(sdt) {
  if (!sdt) return [];
  // Đảm bảo bỏ số 0 đầu nếu chưa bỏ
  if (sdt.startsWith('0')) {
    sdt = sdt.slice(1);
  }
  if (sdt.length < 2) return [];

  // Tạo các cặp số liên tiếp
  const pairs = [];
  for (let i = 0; i < sdt.length - 1; i++) {
    pairs.push(sdt.slice(i, i + 2));
  }

  let result = '';
  let temp = '';
  let i = 0;

  while (i < pairs.length) {
    const currentPair = pairs[i];
    const nextPair = (i + 1 < pairs.length) ? pairs[i + 1] : '';

    if (currentPair !== temp) {
      if (!currentPair.includes('0') && !currentPair.includes('5')) {
        // Cặp không chứa 0 hoặc 5
        if (!nextPair.includes('0')) {
          result += currentPair + '/';
          temp = '';
        } else {
          result += currentPair + '0/';
          temp = '';
        }
      } else if (currentPair.includes('0')) {
        // Cặp chứa 0
        if (nextPair.includes('0')) {
          // Cặp liền sau cũng chứa 0
          const rightChar = nextPair ? nextPair[nextPair.length - 1] : '';
          let newPair = currentPair[0] + '0' + rightChar;

          if (currentPair[0] + rightChar === '00') {
            newPair = currentPair[0] + nextPair;
          }

          if ((!newPair.includes('00') && newPair[0] !== newPair[newPair.length - 1]) ||
              (newPair[0] === newPair[newPair.length - 1])) {
            result += newPair + '/';
          }
          temp = '';
        } else {
          // Cặp chứa 0 và cặp liền sau không chứa 0
          let combinedPair = '';
          if (nextPair.length === 2 && nextPair[0] === nextPair[1]) {
            combinedPair = currentPair + nextPair[0];
          } else {
            combinedPair = removeOneDuplicateChar(currentPair + nextPair);
          }
          result += combinedPair + '/';
          temp = nextPair;
        }
      } else if (currentPair.includes('5')) {
        // Cặp chứa 5
        if (nextPair.includes('5')) {
          // Cặp liền sau chứa 5 -> ghép 5 ở giữa và nhảy qua nextPair
          const rightChar = nextPair ? nextPair[nextPair.length - 1] : '';
          result += currentPair[0] + '5' + rightChar + '/';
          temp = '';
          i = i + 1; // Nhảy qua nextPair
        } else {
          result += currentPair + '/';
          temp = '';
        }
      }
    }
    i = i + 1;
  }

  if (result.endsWith('/')) {
    result = result.slice(0, -1);
  }

  return result ? result.split('/').filter(Boolean) : [];
}

/**
 * 4. Chuyển đổi một cụm số sang Từ Trường (NLSO):
 * Xử lý số 0 (+ 0) và số 5 (x 5), sau đó tra bảng NLSO.
 */
function getEnergyFromGroup(group) {
  loadCaches();
  if (!group || group.length === 1) return null;
  if (group.length === 2 && (group.startsWith('0') || group.endsWith('0'))) {
    return null;
  }

  let code = group;
  let has5 = false;
  let has0 = false;

  if (code.includes('5')) {
    code = code.replace(/5/g, '');
    has5 = true;
  }
  if (code.includes('0')) {
    code = code.replace(/0/g, '');
    has0 = true;
  }

  const match = nlsoCache[code];
  if (!match) {
    return null;
  }

  const isCat = CAT_TINH.includes(match.tu_truong);
  const isHung = HUNG_TINH.includes(match.tu_truong);
  const title = TU_TRUONG_TITLE_MAP[match.tu_truong] || match.tu_truong;

  return {
    group,
    cleanCode: code,
    tuTruong: match.tu_truong,
    tuTruongTitle: title,
    energyLabel: `${title}${match.cap_do}${has5 ? ' x 5' : (has0 ? ' + 0' : '')}`,
    capDo: match.cap_do,
    has5,
    has0,
    transformText: has5 ? 'x 5' : (has0 ? '+ 0' : ''),
    transformNote: has5 ? 'Khuếch đại năng lượng (x 5)' : (has0 ? 'Ẩn tàng năng lượng (+ 0)' : ''),
    type: isCat ? 'cat' : (isHung ? 'hung' : 'trung_tinh'),
    typeName: isCat ? 'Cát Tinh' : (isHung ? 'Hung Tinh' : 'Trung Tính')
  };
}

/**
 * 5. Tra cứu kết luận cho một cặp từ trường:
 */
function getPairConclusion(fieldA, fieldB) {
  loadCaches();
  const nameA = String(fieldA || '').trim().toUpperCase();
  const nameB = String(fieldB || '').trim().toUpperCase();

  // Tra cứu theo key: "A + B"
  const key = `${nameA} + ${nameB}`;
  const found = ketLuanCache[key];

  if (found) {
    return {
      pairKey: key,
      tuTruong1: found.tu_truong_1,
      tuTruong2: found.tu_truong_2,
      diem: found.diem,
      moTa: found.ket_luan || ''
    };
  }

  // Tra cứu không dấu tiếng Việt phòng trường hợp gõ lệch
  for (const k in ketLuanCache) {
    const item = ketLuanCache[k];
    const k1 = item.tu_truong_1.trim().toUpperCase();
    const k2 = item.tu_truong_2.trim().toUpperCase();
    if (k1 === nameA && k2 === nameB) {
      return {
        pairKey: k,
        tuTruong1: item.tu_truong_1,
        tuTruong2: item.tu_truong_2,
        diem: item.diem,
        moTa: item.ket_luan || ''
      };
    }
  }

  return {
    pairKey: key,
    tuTruong1: nameA,
    tuTruong2: nameB,
    diem: null,
    moTa: 'Chưa có dữ liệu kết luận cho tổ hợp này trong từ điển.'
  };
}

/**
 * 6. Hàm LayNangLuongSo & TachNangLuongSo (Chuẩn theo công thức Excel / VBA):
 * Trả về chuỗi năng lượng hoàn chỉnh hiển thị theo mẫu:
 * Ví dụ: "Sinh Khí3 / Ngũ Quỷ3 + 0 / Tuyệt Mệnh2 + 0 / Tuyệt Mệnh2 + 0"
 */
function layNangLuongSo(so) {
  loadCaches();
  if (!so || so.length === 1) return '';
  if (so.length === 2 && (so.startsWith('0') || so.endsWith('0'))) {
    return '';
  }
  const match = nlsoCache[so];
  if (!match) return '';
  const title = TU_TRUONG_TITLE_MAP[match.tu_truong] || match.tu_truong;
  return `${title}${match.cap_do}`;
}

function tachNangLuongSo(rawGroups) {
  loadCaches();
  const mang = Array.isArray(rawGroups) ? rawGroups : String(rawGroups || '').split('/').filter(Boolean);
  const items = [];

  for (let i = 0; i < mang.length; i++) {
    let so = String(mang[i] || '').trim();
    let thaythe = '';

    if (so.length === 1 || (so.length === 2 && (so.startsWith('0') || so.endsWith('0')))) {
      continue;
    }

    if (so.includes('5')) {
      so = so.replace(/5/g, '');
      thaythe = ' x 5';
    }
    if (so.includes('0')) {
      so = so.replace(/0/g, '');
      thaythe = ' + 0';
    }

    if (so.length === 1 || (so.length === 2 && (so.startsWith('0') || so.endsWith('0')))) {
      continue;
    }

    const temp = layNangLuongSo(so);
    if (temp) {
      items.push(temp + thaythe);
    }
  }

  return items.join(' / ');
}

/**
 * 7. Hàm phân tích toàn diện số điện thoại:
 */
function analyzePhoneNumber(rawPhone) {
  loadCaches();

  const originalPhone = String(rawPhone || '').trim();
  const normalizedPhone = normalizePhone(originalPhone);

  if (!normalizedPhone || normalizedPhone.length < 3) {
    return {
      success: false,
      error: 'Số điện thoại không hợp lệ hoặc quá ngắn (tối thiểu 4 chữ số).'
    };
  }

  // Bước 1: Tách cụm số
  const rawGroups = splitPhoneIntoFields(normalizedPhone);
  const capSoText = rawGroups.join('/');
  const nangLuongText = tachNangLuongSo(rawGroups);

  // Bước 2: Chuyển cụm số sang từ trường
  const analyzedGroups = [];
  const validFields = [];

  for (const g of rawGroups) {
    const energy = getEnergyFromGroup(g);
    if (energy) {
      analyzedGroups.push(energy);
      validFields.push(energy);
    } else {
      analyzedGroups.push({
        group: g,
        cleanCode: g,
        tuTruong: null,
        capDo: null,
        has5: g.includes('5'),
        has0: g.includes('0'),
        transformText: '',
        transformNote: '',
        type: 'unrecognized',
        typeName: 'Không xác định'
      });
    }
  }

  // Bước 3: Ghép các cặp từ trường liên tiếp
  const pairs = [];
  let totalScore = 0;
  let scoredPairsCount = 0;

  for (let i = 0; i < validFields.length - 1; i++) {
    const f1 = validFields[i];
    const f2 = validFields[i + 1];

    const conclusion = getPairConclusion(f1.tuTruong, f2.tuTruong);

    if (typeof conclusion.diem === 'number') {
      totalScore += conclusion.diem;
      scoredPairsCount++;
    }

    pairs.push({
      index: i + 1,
      fromGroup: f1.group,
      toGroup: f2.group,
      field1: f1.tuTruong,
      field2: f2.tuTruong,
      type1: f1.type,
      type2: f2.type,
      diem: conclusion.diem,
      moTa: conclusion.moTa,
      hasSpecialZero: f1.has0 || f2.has0,
      hasSpecialFive: f1.has5 || f2.has5
    });
  }

  // Bước 4: Kiểm tra các hiệu ứng ẩn tàng đặc biệt (ví dụ cụm có số 0: 'THIÊN Y + 0')
  const specialZeroEffects = [];
  for (const f of validFields) {
    if (f.has0 && f.tuTruong) {
      const zeroPair = getPairConclusion(f.tuTruong, '0');
      if (zeroPair && zeroPair.moTa && !zeroPair.moTa.startsWith('Chưa có dữ liệu')) {
        specialZeroEffects.push({
          group: f.group,
          tuTruong: f.tuTruong,
          pairKey: `${f.tuTruong} + 0`,
          diem: zeroPair.diem,
          moTa: zeroPair.moTa
        });
      }
    }
  }

  // Thống kê Cát / Hung
  let catCount = 0;
  let hungCount = 0;
  for (const f of validFields) {
    if (f.type === 'cat') catCount++;
    if (f.type === 'hung') hungCount++;
  }
  const totalFields = validFields.length;
  const catPercent = totalFields > 0 ? Math.round((catCount / totalFields) * 100) : 0;
  const hungPercent = totalFields > 0 ? Math.round((hungCount / totalFields) * 100) : 0;
  const avgScore = scoredPairsCount > 0 ? (totalScore / scoredPairsCount).toFixed(1) : null;

  return {
    success: true,
    input: {
      original: originalPhone,
      normalized: normalizedPhone,
      displayFormat: originalPhone.startsWith('0') ? originalPhone : ('0' + normalizedPhone)
    },
    capSoText,
    nangLuongText,
    summary: {
      totalGroups: rawGroups.length,
      validFieldsCount: validFields.length,
      totalPairs: pairs.length,
      totalScore,
      avgScore,
      catCount,
      hungCount,
      catPercent,
      hungPercent,
      rating: catPercent >= 60 ? 'Cát Tường' : (hungPercent >= 60 ? 'Cần Chú Ý' : 'Trung Bình')
    },
    groups: analyzedGroups,
    pairs,
    specialZeroEffects
  };
}

module.exports = {
  CAT_TINH,
  HUNG_TINH,
  TU_TRUONG_TITLE_MAP,
  normalizePhone,
  removeOneDuplicateChar,
  splitPhoneIntoFields,
  layNangLuongSo,
  tachNangLuongSo,
  getEnergyFromGroup,
  getPairConclusion,
  analyzePhoneNumber
};
