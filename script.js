// Thay URL bên dưới bằng Web App URL từ Google Apps Script của bạn
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw86rJvgyMY7M6OUCtiTDVzDl-osbdNo2kHBQ3n0hDi4JSR8lDWJ20vICb2fQa5frIj/exec";

let webData = [];
let currentCategory = 'all';

// Element DOM
const webGrid = document.getElementById('web-grid');
const searchInput = document.getElementById('search-input');
const categoryContainer = document.getElementById('category-container');
const themeToggle = document.getElementById('theme-toggle');
const totalStats = document.getElementById('total-stats');
const toast = document.getElementById('toast');

// 1. Fetch dữ liệu từ Google Sheet
async function fetchData() {
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    
    // Sắp xếp dữ liệu theo thứ tự nhỏ dần của STT
    webData = data.sort((a, b) => Number(b.stt) - Number(a.stt));

    // Hiển thị tổng số trang web
    totalStats.innerHTML = `<i class="fa-solid fa-cubes"></i> ${webData.length} Web Links`;

    renderCategories();
    renderCards(webData);
  } catch (error) {
    console.error("Lỗi khi kết nối Google Sheet:", error);
    webGrid.innerHTML = `
      <div class="loading-state">
        <i class="fa-solid fa-triangle-exclamation" style="color: #f85149; font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p style="color: #f85149;">Khởi tạo thất bại. Vui lòng kiểm tra lại <code>SCRIPT_URL</code>!</p>
      </div>`;
    totalStats.innerText = 'Error';
  }
}

// 2. Render Nút Phân loại (Kind Chips)
function renderCategories() {
  const kinds = ['all', ...new Set(webData.map(item => item.kind).filter(Boolean))];

  // Đếm số lượng link trong mỗi phân loại
  const countByKind = webData.reduce((acc, item) => {
    const kind = item.kind || 'general';
    acc[kind] = (acc[kind] || 0) + 1;
    return acc;
  }, {});
  
  categoryContainer.innerHTML = kinds.map(kind => {
    const count = kind === 'all' ? webData.length : (countByKind[kind] || 0);
    const label = kind === 'all'
      ? '<i class="fa-solid fa-border-all"></i> Tất cả'
      : `<i class="fa-solid fa-tag"></i> ${kind}`;

    return `
      <button class="cat-chip ${kind === currentCategory ? 'active' : ''}" data-kind="${kind}">
        ${label}
        <span class="cat-count">${count}</span>
      </button>
    `;
  }).join('');

  categoryContainer.querySelectorAll('.cat-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      categoryContainer.querySelectorAll('.cat-chip').forEach(b => b.classList.remove('active'));
      target.classList.add('active');
      currentCategory = target.dataset.kind;
      filterData();
    });
  });
}

// 3. Render danh sách Web Card
function renderCards(data) {
  if (data.length === 0) {
    webGrid.innerHTML = `
      <div class="loading-state">
        <p>Không tìm thấy liên kết nào trùng khớp với từ khóa.</p>
      </div>`;
    return;
  }

  webGrid.innerHTML = data.map(item => {
    const displayLink = item.link.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    return `
      <div class="card">
        <div class="card-top">
          <div class="card-title-group">
            <span class="stt-badge">#${item.stt}</span>
            <a class="card-title" href="${item.link}" target="_blank" rel="noopener noreferrer" onclick="trackClick(${item.stt})" title="Mở trang trong tab mới">${displayLink}</a>
          </div>
          <span class="kind-tag">${item.kind || 'general'}</span>
        </div>
        
        <div class="card-desc">${item.description || 'Chưa có thông tin mô tả.'}</div>
        
        <div class="card-bottom">
          <span class="click-stat">
            <i class="fa-regular fa-eye"></i> 
            <span id="clicks-${item.stt}">${item.clicked || 0}</span> clicks
          </span>
          
          <div class="card-actions">
            <!-- Nút Sao Chép -->
            <button class="btn-action" onclick="copyToClipboard('${item.link}')" title="Sao chép liên kết">
              <i class="fa-regular fa-copy"></i> Sao chép
            </button>
            
            <!-- Nút Mở trang mới -->
            <button class="btn-action btn-open" onclick="openLink(${item.stt}, '${item.link}')" title="Mở trang trong tab mới">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Mở
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 4. Đếm lượt click (Cập nhật UI + bộ nhớ + gửi ngầm lên Google Sheet)
function trackClick(stt) {
  // 1. Cập nhật lượt xem tức thì trên UI
  const clickElem = document.getElementById(`clicks-${stt}`);
  if (clickElem) {
    let currentClicks = parseInt(clickElem.innerText) || 0;
    clickElem.innerText = currentClicks + 1;
  }

  // 2. Cập nhật dữ liệu tạm trong bộ nhớ
  const item = webData.find(d => d.stt == stt);
  if (item) {
    item.clicked = (Number(item.clicked) || 0) + 1;
  }

  // 3. Gửi yêu cầu cập nhật ngầm đến Google Sheet
  fetch(SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stt: stt })
  }).catch(err => console.error("Lỗi cập nhật click:", err));
}

// 5. Xử lý khi nhấn nút "Mở" (Cộng click + Mở tab mới)
function openLink(stt, linkUrl) {
  // Đếm lượt click
  trackClick(stt);

  // Mở link sang trang mới
  window.open(linkUrl, '_blank');
}

// 5. Xử lý Sao chép Link vào Clipboard
function copyToClipboard(linkUrl) {
  navigator.clipboard.writeText(linkUrl).then(() => {
    showToast("Đã sao chép liên kết vào bộ nhớ tạm!");
  }).catch(err => {
    console.error("Lỗi sao chép:", err);
  });
}

// Hiển thị thông báo Toast
function showToast(message) {
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 6. Tìm kiếm & Lọc dữ liệu
function filterData() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filtered = webData.filter(item => {
    const matchesKind = (currentCategory === 'all') || (item.kind === currentCategory);
    const matchesSearch = 
      (item.link && item.link.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      (item.kind && item.kind.toLowerCase().includes(searchTerm));

    return matchesKind && matchesSearch;
  });

  renderCards(filtered);
}

searchInput.addEventListener('input', filterData);

// 7. Phím tắt "/"
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// 8. Chuyển đổi Dark / Light Mode
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  
  const icon = themeToggle.querySelector('i');
  if (newTheme === 'light') {
    icon.className = 'fa-regular fa-moon';
  } else {
    icon.className = 'fa-regular fa-sun';
  }
});

// Khởi chạy ứng dụng
fetchData();