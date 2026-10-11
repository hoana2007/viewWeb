// Thay URL bên dưới bằng Web App URL từ Google Apps Script của bạn
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw86rJvgyMY7M6OUCtiTDVzDl-osbdNo2kHBQ3n0hDi4JSR8lDWJ20vICb2fQa5frIj/exec";

// Từ điển đa ngôn ngữ (i18n)
const i18n = {
  vi: {
    code: 'VI',
    flag: '🇻🇳',
    pageTitle: "Web Hay — Hữu ích",
    statsLoading: '<i class="fa-solid fa-cubes"></i> Đang tải...',
    statsCount: (count) => `<i class="fa-solid fa-cubes"></i> ${count} Liên kết Web`,
    statsError: "Lỗi kết nối",
    themeToggleTitle: "Chuyển chế độ Sáng / Tối",
    langToggleTitle: "Chuyển đổi ngôn ngữ",
    langMenuTitle: "Ngôn ngữ / Language",
    heroTitle: 'Khám phá &amp; Lan tỏa <br><span class="text-gradient">Liên kết Web hữu ích</span>',
    heroDesc: 'Bộ sưu tập các trang web, tài nguyên và công cụ hữu ích. Cập nhật liên tục.',
    searchPlaceholder: "Tìm kiếm theo link, mô tả hoặc phân loại... (Ấn '/' để tìm)",
    allCategory: "Tất cả",
    loadingState: "Đang đồng bộ dữ liệu từ Google Sheet...",
    errorState: "Khởi tạo thất bại. Vui lòng kiểm tra lại <code>SCRIPT_URL</code>!",
    emptyState: "Không tìm thấy liên kết nào trùng khớp với từ khóa.",
    noDesc: "Chưa có thông tin mô tả.",
    clicks: "lượt bấm",
    copyBtn: "Sao chép",
    copyTitle: "Sao chép liên kết",
    openBtn: "Mở",
    openTitle: "Mở trang trong tab mới",
    toastCopied: "Đã sao chép liên kết vào bộ nhớ tạm!"
  },
  en: {
    code: 'EN',
    flag: '🇬🇧',
    pageTitle: "Web Hay — Useful Web Directory",
    statsLoading: '<i class="fa-solid fa-cubes"></i> Loading...',
    statsCount: (count) => `<i class="fa-solid fa-cubes"></i> ${count} Web Links`,
    statsError: "Connection Error",
    themeToggleTitle: "Toggle Light / Dark mode",
    langToggleTitle: "Switch language",
    langMenuTitle: "Language / Ngôn ngữ",
    heroTitle: 'Discover &amp; Share <br><span class="text-gradient">Useful Web Resources</span>',
    heroDesc: 'A curated collection of websites, resources, and tools. Continuously updated.',
    searchPlaceholder: "Search by link, description, or category... (Press '/' to search)",
    allCategory: "All",
    loadingState: "Syncing data from Google Sheet...",
    errorState: "Failed to initialize. Please check <code>SCRIPT_URL</code>!",
    emptyState: "No links found matching your search.",
    noDesc: "No description provided.",
    clicks: "clicks",
    copyBtn: "Copy",
    copyTitle: "Copy link",
    openBtn: "Open",
    openTitle: "Open link in new tab",
    toastCopied: "Link copied to clipboard!"
  }
};

const categoryTranslations = {
  vi: {
    "all": "Tất cả",
    "Giáo viên": "Giáo viên",
    "Lập trình": "Lập trình",
    "Tiện ích": "Tiện ích",
    "AI": "AI",
    "Games": "Trò chơi",
    "CloudDrive": "Lưu trữ đám mây"
  },
  en: {
    "all": "All",
    "Giáo viên": "Education",
    "Lập trình": "Programming",
    "Tiện ích": "Utilities",
    "AI": "AI",
    "Games": "Games",
    "CloudDrive": "Cloud Drive"
  }
};

let webData = [];
let currentCategory = 'all';
let currentLang = localStorage.getItem('webhay_lang') || 'vi';

// Element DOM
const webGrid = document.getElementById('web-grid');
const searchInput = document.getElementById('search-input');
const categoryContainer = document.getElementById('category-container');
const themeToggle = document.getElementById('theme-toggle');
const totalStats = document.getElementById('total-stats');
const toast = document.getElementById('toast');

// Language DOM Elements
const langDropdownWrapper = document.getElementById('lang-dropdown-wrapper');
const langToggleBtn = document.getElementById('lang-toggle-btn');
const currentLangFlag = document.getElementById('current-lang-flag');
const currentLangCode = document.getElementById('current-lang-code');
const langMenuTitle = document.getElementById('lang-menu-title');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const loadingMsg = document.getElementById('loading-msg');

// Helper: Lấy nhãn dịch cho phân loại
function getCategoryLabel(kind) {
  if (!kind) return 'general';
  if (kind === 'all') return i18n[currentLang].allCategory;
  if (categoryTranslations[currentLang] && categoryTranslations[currentLang][kind]) {
    return categoryTranslations[currentLang][kind];
  }
  return kind;
}

// Chuyển đổi ngôn ngữ và cập nhật toàn bộ giao diện
function setLanguage(lang) {
  if (!i18n[lang]) return;
  currentLang = lang;
  localStorage.setItem('webhay_lang', lang);
  document.documentElement.setAttribute('lang', lang);

  const t = i18n[lang];

  // Tiêu đề trang
  document.title = t.pageTitle;

  // Cập nhật nút chọn ngôn ngữ
  if (currentLangCode) currentLangCode.textContent = t.code;
  if (currentLangFlag) currentLangFlag.textContent = t.flag;
  if (langToggleBtn) langToggleBtn.title = t.langToggleTitle;
  if (langMenuTitle) langMenuTitle.textContent = t.langMenuTitle;

  // Thanh tìm kiếm & Theme toggle
  if (themeToggle) themeToggle.title = t.themeToggleTitle;
  if (searchInput) searchInput.placeholder = t.searchPlaceholder;

  // Phần Hero giới thiệu
  if (heroTitle) heroTitle.innerHTML = t.heroTitle;
  if (heroDesc) heroDesc.textContent = t.heroDesc;

  // Trạng thái active trong menu ngôn ngữ
  document.querySelectorAll('.lang-option').forEach(opt => {
    if (opt.dataset.lang === lang) {
      opt.classList.add('active');
    } else {
      opt.classList.remove('active');
    }
  });

  // Cập nhật thống kê nếu dữ liệu đã tải
  if (webData && webData.length > 0) {
    totalStats.innerHTML = t.statsCount(webData.length);
  } else if (totalStats && totalStats.innerText !== 'Error' && totalStats.innerText !== 'Lỗi kết nối') {
    totalStats.innerHTML = t.statsLoading;
  }

  // Cập nhật thông báo loading nếu đang tải
  if (loadingMsg) {
    loadingMsg.textContent = t.loadingState;
  }

  // Render lại danh mục và thẻ card theo ngôn ngữ mới
  if (webData && webData.length > 0) {
    renderCategories();
    filterData();
  }
}

// 1. Fetch dữ liệu từ Google Sheet
async function fetchData() {
  const t = i18n[currentLang];
  try {
    const response = await fetch(SCRIPT_URL);
    const data = await response.json();
    
    // Sắp xếp dữ liệu theo thứ tự nhỏ dần của STT
    webData = data.sort((a, b) => Number(b.stt) - Number(a.stt));

    // Hiển thị tổng số trang web
    totalStats.innerHTML = i18n[currentLang].statsCount(webData.length);

    renderCategories();
    renderCards(webData);
  } catch (error) {
    console.error("Lỗi khi kết nối Google Sheet:", error);
    webGrid.innerHTML = `
      <div class="loading-state">
        <i class="fa-solid fa-triangle-exclamation" style="color: #f85149; font-size: 2rem; margin-bottom: 0.5rem;"></i>
        <p style="color: #f85149;">${i18n[currentLang].errorState}</p>
      </div>`;
    totalStats.innerText = i18n[currentLang].statsError;
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
    const labelText = getCategoryLabel(kind);
    const icon = kind === 'all' ? 'fa-border-all' : 'fa-tag';

    return `
      <button class="cat-chip ${kind === currentCategory ? 'active' : ''}" data-kind="${kind}">
        <i class="fa-solid ${icon}"></i> ${labelText}
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
  const t = i18n[currentLang];

  if (data.length === 0) {
    webGrid.innerHTML = `
      <div class="loading-state">
        <p>${t.emptyState}</p>
      </div>`;
    return;
  }

  webGrid.innerHTML = data.map(item => {
    const displayLink = item.link.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const kindLabel = getCategoryLabel(item.kind);
    const desc = item.description || t.noDesc;

    return `
      <div class="card">
        <div class="card-top">
          <div class="card-title-group">
            <span class="stt-badge">#${item.stt}</span>
            <a class="card-title" href="${item.link}" target="_blank" rel="noopener noreferrer" onclick="trackClick(${item.stt})" title="${t.openTitle}">${displayLink}</a>
          </div>
          <span class="kind-tag">${kindLabel}</span>
        </div>
        
        <div class="card-desc">${desc}</div>
        
        <div class="card-bottom">
          <span class="click-stat">
            <i class="fa-regular fa-eye"></i> 
            <span id="clicks-${item.stt}">${item.clicked || 0}</span> ${t.clicks}
          </span>
          
          <div class="card-actions">
            <!-- Nút Sao Chép -->
            <button class="btn-action" onclick="copyToClipboard('${item.link}')" title="${t.copyTitle}">
              <i class="fa-regular fa-copy"></i> ${t.copyBtn}
            </button>
            
            <!-- Nút Mở trang mới -->
            <button class="btn-action btn-open" onclick="openLink(${item.stt}, '${item.link}')" title="${t.openTitle}">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> ${t.openBtn}
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
  trackClick(stt);
  window.open(linkUrl, '_blank');
}

// 6. Xử lý Sao chép Link vào Clipboard
function copyToClipboard(linkUrl) {
  navigator.clipboard.writeText(linkUrl).then(() => {
    showToast(i18n[currentLang].toastCopied);
  }).catch(err => {
    console.error("Lỗi sao chép:", err);
  });
}

// Hiển thị thông báo Toast
function showToast(message) {
  toast.innerText = message || i18n[currentLang].toastCopied;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 7. Tìm kiếm & Lọc dữ liệu
function filterData() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filtered = webData.filter(item => {
    const matchesKind = (currentCategory === 'all') || (item.kind === currentCategory);
    
    const rawKind = (item.kind || '').toLowerCase();
    const translatedKind = (getCategoryLabel(item.kind) || '').toLowerCase();

    const matchesSearch = 
      (item.link && item.link.toLowerCase().includes(searchTerm)) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      rawKind.includes(searchTerm) ||
      translatedKind.includes(searchTerm);

    return matchesKind && matchesSearch;
  });

  renderCards(filtered);
}

searchInput.addEventListener('input', filterData);

// 8. Phím tắt "/"
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== searchInput) {
    e.preventDefault();
    searchInput.focus();
  }
});

// 9. Cấu hình & Chuyển đổi Dark / Light Mode (có lưu localStorage)
const savedTheme = localStorage.getItem('webhay_theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('webhay_theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  if (icon) {
    icon.className = theme === 'light' ? 'fa-regular fa-moon' : 'fa-regular fa-sun';
  }
}

// 10. Xử lý Giao diện Dropdown Ngôn ngữ
if (langToggleBtn && langDropdownWrapper) {
  langToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdownWrapper.classList.toggle('active');
    langToggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Chọn ngôn ngữ từ menu
  document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const chosenLang = option.dataset.lang;
      setLanguage(chosenLang);
      langDropdownWrapper.classList.remove('active');
      langToggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Đóng dropdown khi bấm ra ngoài
  document.addEventListener('click', (e) => {
    if (!langDropdownWrapper.contains(e.target)) {
      langDropdownWrapper.classList.remove('active');
      langToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Đóng bằng phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && langDropdownWrapper.classList.contains('active')) {
      langDropdownWrapper.classList.remove('active');
      langToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

// Khởi chạy ứng dụng với ngôn ngữ ban đầu & fetch data
setLanguage(currentLang);
fetchData();