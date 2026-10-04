/**
 * Admin CMS Posts Logic: Quill editor, attachments, publish/draft
 */

let quill = null;

// Initialize Quill
document.addEventListener('DOMContentLoaded', () => {
  quill = new Quill('#quill-editor', {
    theme: 'snow',
    placeholder: 'Soạn thảo nội dung bài viết...',
    modules: {
      toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  loadAdminPosts();
  initUploadListeners();
  initFormListener();
});

// File upload listeners
function initUploadListeners() {
  const coverInput = document.getElementById('cover-file-input');
  const attachInput = document.getElementById('attachment-file-input');

  if (coverInput) {
    coverInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('post-cover-image').value = data.fileUrl;
          alert('Tải ảnh bìa lên thành công!');
        } else {
          alert(data.message || 'Lỗi tải ảnh bìa.');
        }
      } catch (err) {
        alert('Lỗi kết nối tải tệp.');
      }
    });
  }

  if (attachInput) {
    attachInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          document.getElementById('post-attachment-path').value = data.fileUrl;
          document.getElementById('post-attachment-name').value = data.fileName;
          alert('Tải tệp đính kèm lên thành công!');
        } else {
          alert(data.message || 'Lỗi tải tệp.');
        }
      } catch (err) {
        alert('Lỗi kết nối tải tệp.');
      }
    });
  }
}

// Load posts
async function loadAdminPosts() {
  const tbody = document.getElementById('posts-table-body');
  try {
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    const posts = data.posts || [];

    if (!posts.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">Chưa có bài viết nào.</td></tr>';
      return;
    }

    tbody.innerHTML = posts.map(p => {
      const d = new Date(p.created_at).toLocaleDateString('vi-VN');
      const statusBadge = p.status === 'published' 
        ? '<span style="color: #10b981; font-weight:600;">Xuất bản</span>' 
        : '<span style="color: #f59e0b; font-weight:600;">Bản nháp</span>';

      return `
        <tr>
          <td>#${p.id}</td>
          <td>
            <strong><a href="/bai-viet.html?slug=${p.slug}" target="_blank" style="color: var(--text-main); font-weight: 700;">${p.title}</a></strong>
          </td>
          <td>${statusBadge}</td>
          <td>${p.view_count || 0}</td>
          <td>${d}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button type="button" class="btn btn-outline btn-action-sm" onclick="editPost(${p.id})">Sửa</button>
              <button type="button" class="btn btn-outline btn-action-sm" style="color: #ef4444; border-color: rgba(239,68,68,0.4);" onclick="deletePost(${p.id})">Xoá</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #f87171; padding: 30px;">Lỗi tải bài viết.</td></tr>';
  }
}

// Edit post
async function editPost(id) {
  try {
    const res = await fetch(`/api/admin/posts/${id}`);
    const data = await res.json();
    if (!data.post) return;

    const p = data.post;
    document.getElementById('edit-post-id').value = p.id;
    document.getElementById('post-title').value = p.title;
    document.getElementById('post-summary').value = p.summary || '';
    document.getElementById('post-cover-image').value = p.cover_image || '';
    document.getElementById('post-attachment-name').value = p.attachment_name || '';
    document.getElementById('post-attachment-path').value = p.attachment_path || '';
    document.getElementById('post-status').value = p.status || 'published';

    quill.root.innerHTML = p.content;

    document.getElementById('form-heading').textContent = `✏️ Chỉnh Sửa Bài Viết #${p.id}`;
    document.getElementById('btn-cancel-edit').style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert('Không thể tải bài viết để chỉnh sửa.');
  }
}

function cancelEdit() {
  document.getElementById('edit-post-id').value = '';
  document.getElementById('post-title').value = '';
  document.getElementById('post-summary').value = '';
  document.getElementById('post-cover-image').value = '';
  document.getElementById('post-attachment-name').value = '';
  document.getElementById('post-attachment-path').value = '';
  document.getElementById('post-status').value = 'published';
  quill.root.innerHTML = '';

  document.getElementById('form-heading').textContent = '📝 Soạn Bài Viết Mới';
  document.getElementById('btn-cancel-edit').style.display = 'none';
}

// Form submit
function initFormListener() {
  const form = document.getElementById('post-editor-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-post-id').value;
    const title = document.getElementById('post-title').value.trim();
    const summary = document.getElementById('post-summary').value.trim();
    const cover_image = document.getElementById('post-cover-image').value.trim();
    const attachment_name = document.getElementById('post-attachment-name').value.trim();
    const attachment_path = document.getElementById('post-attachment-path').value.trim();
    const status = document.getElementById('post-status').value;
    const content = quill.root.innerHTML;

    if (!title || !content || content === '<p><br></p>') {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết.');
      return;
    }

    const payload = {
      title,
      summary,
      cover_image,
      attachment_name,
      attachment_path,
      status,
      content
    };

    try {
      const url = id ? `/api/admin/posts/${id}` : '/api/admin/posts';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Lỗi khi lưu bài viết.');
        return;
      }

      alert(data.message || 'Đã lưu bài viết thành công!');
      cancelEdit();
      loadAdminPosts();
    } catch (err) {
      alert('Lỗi kết nối máy chủ.');
    }
  });
}

// Delete post
async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xoá bài viết này?')) return;

  try {
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    const data = await res.json();
    alert(data.message || 'Đã xoá bài viết.');
    loadAdminPosts();
  } catch (err) {
    alert('Không thể xoá bài viết.');
  }
}

// Logout
async function adminLogout() {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
  } catch (err) {}
  window.location.href = '/index.html';
}
