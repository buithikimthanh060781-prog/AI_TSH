/**
 * Admin Panel Logic: Account management, Device tracking, Plan extension
 */

let allUsers = [];
let selectedUserId = null;
let selectedUserEmail = null;
let currentFilter = 'all';

async function checkAdmin() {
  try {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      window.location.href = '/admin-login.html';
      return;
    }
    loadUsers();
  } catch (err) {
    window.location.href = '/admin-login.html';
  }
}

function setFilter(filter) {
  currentFilter = filter;
  ['all', 'pending', 'verified'].forEach(f => {
    const el = document.getElementById(`tab-filter-${f}`);
    if (el) {
      if (f === filter) el.classList.add('active');
      else el.classList.remove('active');
    }
  });
  loadUsers();
}

async function loadUsers() {
  const tbody = document.getElementById('users-table-body');
  const searchInput = document.getElementById('admin-search-user');
  const q = searchInput ? searchInput.value.trim() : '';

  try {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (currentFilter !== 'all') params.set('status', currentFilter);

    const url = `/api/admin/users?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    allUsers = data.users || [];

    // Cập nhật số liệu trên các tab
    if (data.stats) {
      const countAll = document.getElementById('count-all');
      const countPending = document.getElementById('count-pending');
      const countVerified = document.getElementById('count-verified');
      const btnVerifyAll = document.getElementById('btn-verify-all');

      if (countAll) countAll.textContent = data.stats.total;
      if (countPending) {
        countPending.textContent = data.stats.pending;
        if (data.stats.pending > 0) {
          countPending.style.display = 'inline-block';
        } else {
          countPending.style.display = 'inline-block';
        }
      }
      if (countVerified) countVerified.textContent = data.stats.verified;

      if (btnVerifyAll) {
        if (data.stats.pending > 0) {
          btnVerifyAll.style.display = 'inline-flex';
          btnVerifyAll.textContent = `✓ Kích hoạt tất cả (${data.stats.pending})`;
        } else {
          btnVerifyAll.style.display = 'none';
        }
      }
    }

    renderUsersTable(allUsers);
  } catch (err) {
    if (tbody) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #f87171; padding: 40px;">Lỗi tải danh sách người dùng.</td></tr>';
    }
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 40px;">Không tìm thấy tài khoản nào phù hợp.</td></tr>';
    return;
  }

  tbody.innerHTML = users.map(u => {
    const lastLogin = u.last_login ? new Date(u.last_login).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Chưa có';
    
    let planText = 'Miễn phí';
    if (u.plan_expires === 'unlimited') {
      planText = '<span style="color: var(--accent-gold); font-weight:700;">Vĩnh viễn</span>';
    } else if (u.plan_expires) {
      const expDate = new Date(u.plan_expires);
      if (expDate < new Date()) {
        planText = '<span style="color: #f87171;">Hết hạn</span>';
      } else {
        planText = `<span style="color: #38bdf8;">Đến ${expDate.toLocaleDateString('vi-VN')}</span>`;
      }
    }

    const verifiedHtml = u.is_verified 
      ? `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge-verified">✓ Đã xác thực</span>
          <button type="button" class="btn-unverify-sm" onclick="quickToggleVerify(${u.id}, '${u.email}', 0)" title="Huỷ kích hoạt tài khoản">Huỷ</button>
        </div>
      `
      : `
        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge-pending">⏳ Chờ duyệt</span>
          <button type="button" class="btn-verify-sm" onclick="openVerifyModal(${u.id}, '${u.email}')">✓ Kích hoạt</button>
        </div>
      `;

    const suspiciousBadge = u.is_suspicious 
      ? '<span class="suspicious-badge">⚠ Nghi vấn (2 IP)</span>' 
      : '';

    const rowClass = u.is_verified ? '' : 'row-pending';

    return `
      <tr class="${rowClass}">
        <td>#${u.id}</td>
        <td>
          <strong>${u.email}</strong>
          ${suspiciousBadge}
        </td>
        <td>${verifiedHtml}</td>
        <td>
          <span style="font-weight:600;">${u.active_devices || 0} / 2</span>
        </td>
        <td>${lastLogin}</td>
        <td>${planText}</td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            ${!u.is_verified ? `<button type="button" class="btn btn-verify-sm" onclick="openVerifyModal(${u.id}, '${u.email}')">✓ Kích hoạt</button>` : ''}
            <button type="button" class="btn btn-outline btn-action-sm" onclick="openExtendModal(${u.id}, '${u.email}')">Gia hạn</button>
            <button type="button" class="btn btn-outline btn-action-sm" onclick="openDeviceModal(${u.id}, '${u.email}')">Thiết bị (${u.active_devices || 0})</button>
            <button type="button" class="btn btn-outline btn-action-sm" style="color:#ef4444; border-color: rgba(239,68,68,0.4);" onclick="openDeleteModal(${u.id}, '${u.email}')">Xoá</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Modal Thiết bị
async function openDeviceModal(userId, email) {
  selectedUserId = userId;
  selectedUserEmail = email;

  document.getElementById('device-modal-user-email').textContent = `Tài khoản: ${email}`;
  const container = document.getElementById('device-list-container');
  container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">Đang tải thông tin thiết bị...</div>';
  document.getElementById('device-modal').classList.add('active');

  try {
    const res = await fetch(`/api/admin/users/${userId}/devices`);
    const data = await res.json();
    const devices = data.devices || [];

    if (!devices.length) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">Không có thiết bị nào đang hoạt động.</div>';
      return;
    }

    container.innerHTML = devices.map(d => {
      const loginTime = new Date(d.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const suspiciousBorder = d.is_suspicious ? 'border-color: #ef4444; background: rgba(239,68,68,0.08);' : '';
      const suspiciousTag = d.is_suspicious ? '<div style="color: #ef4444; font-size: 0.8rem; font-weight:700; margin-bottom:4px;">⚠ Nghi vấn đăng nhập từ 2 IP khác nhau trong 6h!</div>' : '';

      return `
        <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 12px; ${suspiciousBorder}">
          ${suspiciousTag}
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div>
              <strong>IP: ${d.ip || 'Không rõ'}</strong>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Trình duyệt / Thiết bị: ${d.user_agent ? d.user_agent.slice(0, 50) + '...' : 'Unknown'}</div>
              <div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 2px;">Đăng nhập lúc: ${loginTime}</div>
            </div>
            <button type="button" class="btn btn-outline btn-action-sm" style="color: #ef4444; border-color: rgba(239,68,68,0.4);" onclick="removeDevice('${d.device_id}')">
              Gỡ thiết bị
            </button>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <input type="text" id="label-${d.device_id}" class="form-control" style="padding: 6px 10px; font-size: 0.85rem;" placeholder="Đặt nhãn gợi nhớ (vd: Laptop Thanh)" value="${d.label || ''}">
            <button type="button" class="btn btn-outline btn-action-sm" onclick="saveDeviceLabel('${d.device_id}')">Lưu nhãn</button>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<div style="color: #f87171; text-align: center; padding: 20px;">Lỗi tải danh sách thiết bị.</div>';
  }
}

function closeDeviceModal() {
  document.getElementById('device-modal').classList.remove('active');
}

async function removeDevice(deviceId) {
  if (!confirm('Bạn có chắc muốn gỡ thiết bị này để mở chỗ cho thiết bị mới?')) return;
  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}/devices/${deviceId}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || 'Đã gỡ thiết bị.');
    openDeviceModal(selectedUserId, selectedUserEmail);
    loadUsers();
  } catch (err) {
    alert('Không thể gỡ thiết bị.');
  }
}

async function saveDeviceLabel(deviceId) {
  const input = document.getElementById(`label-${deviceId}`);
  const label = input ? input.value.trim() : '';

  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}/devices/${deviceId}/label`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label })
    });
    const data = await res.json();
    alert(data.message || 'Đã lưu nhãn thành công!');
  } catch (err) {
    alert('Không thể lưu nhãn thiết bị.');
  }
}

// Modal & Thao tác Xác thực tài khoản
function openVerifyModal(userId, email) {
  selectedUserId = userId;
  selectedUserEmail = email;
  const emailEl = document.getElementById('verify-modal-user-email');
  if (emailEl) emailEl.textContent = `Tài khoản: ${email}`;
  const modal = document.getElementById('verify-modal');
  if (modal) modal.classList.add('active');
}

function closeVerifyModal() {
  const modal = document.getElementById('verify-modal');
  if (modal) modal.classList.remove('active');
}

async function submitVerify(planDays) {
  try {
    const payload = { verified: true };
    if (planDays > 0) payload.planDays = planDays;

    const res = await fetch(`/api/admin/users/${selectedUserId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || 'Đã xác thực và kích hoạt tài khoản thành công!');
    closeVerifyModal();
    loadUsers();
  } catch (err) {
    alert('Không thể xác thực tài khoản.');
  }
}

async function submitVerifyUnlimited() {
  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true, unlimited: true })
    });
    const data = await res.json();
    alert(data.message || 'Đã xác thực và cấp gói Vĩnh viễn thành công!');
    closeVerifyModal();
    loadUsers();
  } catch (err) {
    alert('Không thể xác thực tài khoản.');
  }
}

async function quickToggleVerify(userId, email, status) {
  if (status === 0) {
    if (!confirm(`Bạn có chắc muốn huỷ xác thực tài khoản ${email}? Người dùng sẽ bị giới hạn lượt tra cứu.`)) return;
  }
  try {
    const res = await fetch(`/api/admin/users/${userId}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: status === 1 })
    });
    const data = await res.json();
    alert(data.message || 'Đã cập nhật trạng thái xác thực.');
    loadUsers();
  } catch (err) {
    alert('Không thể cập nhật trạng thái xác thực.');
  }
}

async function verifyAllPending() {
  if (!confirm('Bạn có chắc muốn xác thực và kích hoạt TẤT CẢ các tài khoản đang chờ duyệt?')) return;
  try {
    const res = await fetch('/api/admin/users/verify-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    alert(data.message || 'Đã kích hoạt toàn bộ tài khoản đang chờ.');
    loadUsers();
  } catch (err) {
    alert('Không thể kích hoạt hàng loạt.');
  }
}

// Modal Gia hạn
function openExtendModal(userId, email) {
  selectedUserId = userId;
  selectedUserEmail = email;
  document.getElementById('extend-modal-user-email').textContent = `Tài khoản: ${email}`;
  document.getElementById('extend-modal').classList.add('active');
}

function closeExtendModal() {
  document.getElementById('extend-modal').classList.remove('active');
}

async function submitExtend(days) {
  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ days })
    });
    const data = await res.json();
    alert(data.message || 'Đã gia hạn thành công!');
    closeExtendModal();
    loadUsers();
  } catch (err) {
    alert('Không thể gia hạn.');
  }
}

async function submitExtendUnlimited() {
  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unlimited: true })
    });
    const data = await res.json();
    alert(data.message || 'Đã cấp gói Vĩnh viễn thành công!');
    closeExtendModal();
    loadUsers();
  } catch (err) {
    alert('Không thể gia hạn.');
  }
}

// Modal Xoá
function openDeleteModal(userId, email) {
  selectedUserId = userId;
  selectedUserEmail = email;
  document.getElementById('delete-modal-user-email').textContent = email;
  document.getElementById('delete-confirm-email').value = '';
  document.getElementById('delete-modal').classList.add('active');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('active');
}

document.getElementById('delete-user-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const confirmEmail = document.getElementById('delete-confirm-email').value.trim();

  try {
    const res = await fetch(`/api/admin/users/${selectedUserId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmEmail })
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Lỗi khi xoá người dùng.');
      return;
    }
    alert(data.message || 'Đã xoá tài khoản thành công.');
    closeDeleteModal();
    loadUsers();
  } catch (err) {
    alert('Lỗi kết nối máy chủ.');
  }
});

// Logout
async function adminLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin-login.html';
  } catch (err) {
    window.location.href = '/admin-login.html';
  }
}

// Search debounce
const searchInput = document.getElementById('admin-search-user');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    loadUsers();
  });
}

checkAdmin();
