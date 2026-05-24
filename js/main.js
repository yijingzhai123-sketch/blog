/**
 * 主逻辑
 * ZYJ 个人AI知识归纳 - 博客
 */

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function createPetals() {
  const container = $('.petals-container');
  if (!container) return;
  const colors = [
    '#FFB6C1', '#FFD1DC', '#FFC0CB', '#FFB7B2',
    '#FFDAB9', '#E6E6FA', '#B0E0E6', '#FFE4E1'
  ];
  for (let i = 0; i < 20; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const size = 12 + Math.random() * 16;
    petal.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;
    const color = colors[Math.floor(Math.random() * colors.length)];
    petal.innerHTML = `<svg viewBox="0 0 24 24" fill="${color}"><path d="M12 2C12 2 8 8 8 12s4 10 4 10 4-6 4-10S12 2 12 2z"/></svg>`;
    container.appendChild(petal);
  }
}

function initNavbar() {
  const nav = $('.navbar');
  if (!nav) return;
  const updateScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();
}

function initBackToTop() {
  const btn = $('.back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function renderArticles(articles) {
  const grid = $('.articles-grid');
  if (!grid) return;
  if (articles.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-icon">📭</div>
        <h3>没有找到相关文章</h3>
        <p>试试换个关键词或标签吧~</p>
      </div>`;
    return;
  }
  grid.innerHTML = articles.map((a, i) => `
    <a href="article.html?id=${a.id}" class="article-card fade-in" style="animation-delay:${i * 0.08}s">
      <div class="card-img">${a.emoji || '📝'}</div>
      <div class="card-body">
        <div class="card-date">${a.date} · ${a.readingTime || ''}</div>
        <h3 class="card-title">${a.title}</h3>
        <p class="card-desc">${a.desc || ''}</p>
        <div class="card-tags">
          ${a.tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
        </div>
      </div>
    </a>
  `).join('');
}

function renderTagCloud(currentTag = 'all') {
  const cloud = $('.tag-cloud');
  if (!cloud) return;
  const tags = getAllTags();
  const count = ARTICLES.length;
  cloud.innerHTML = `
    <button class="tag-btn ${currentTag === 'all' ? 'active' : ''}" data-tag="all">
      全部 <small>(${count})</small>
    </button>
    ${tags.map(t => {
      const n = filterByTag(t).length;
      return `<button class="tag-btn ${currentTag === t ? 'active' : ''}" data-tag="${t}">${t} <small>(${n})</small></button>`;
    }).join('')}
  `;
}

function initHomeFilters() {
  const searchInput = $('.search-input');
  const tagCloud = $('.tag-cloud');
  if (!searchInput || !tagCloud) return;
  let activeTag = 'all';
  const update = () => {
    const query = searchInput.value.trim();
    let articles = activeTag === 'all' ? ARTICLES : filterByTag(activeTag);
    if (query) articles = searchArticles(query);
    renderArticles(articles);
  };
  searchInput.addEventListener('input', update);
  tagCloud.addEventListener('click', (e) => {
    const btn = e.target.closest('.tag-btn');
    if (!btn) return;
    activeTag = btn.dataset.tag;
    renderTagCloud(activeTag);
    update();
  });
}

async function initArticleDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { showArticleError('未指定文章ID'); return; }
  const article = getArticleById(id);
  if (!article) { showArticleError('文章不存在'); return; }
  const metaEl = $('.article-meta');
  if (metaEl) {
    metaEl.innerHTML = `
      <a href="index.html" class="back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5m7-7l-7 7 7 7"/></svg>
        返回文章列表
      </a>
      <div class="article-date">${article.date} · ${article.readingTime}</div>
      <h1 class="article-title">${article.title}</h1>
      <div class="article-tags">
        ${article.tags.map(t => `<span class="article-tag">${t}</span>`).join('')}
      </div>
    `;
  }
  document.title = `${article.title} - ZYJ个人AI知识归纳`;
  const contentEl = $('.article-content');
  if (contentEl) {
    contentEl.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
    const md = await loadMarkdown(article.file);
    if (md) {
      contentEl.innerHTML = `<div class="markdown-body">${marked.parse(md)}</div>`;
    } else {
      contentEl.innerHTML = '<div class="empty-state"><div class="empty-icon">😢</div><h3>文章加载失败</h3><p>请稍后再试~</p></div>';
    }
  }
}

function showArticleError(message) {
  const el = $('.article-content');
  if (el) {
    el.innerHTML = `
      <div class="error-container">
        <h2>404</h2>
        <p>${message}</p>
        <a href="index.html" class="btn-back">返回首页</a>
      </div>`;
  }
}

function initAboutPage() {
  const statArticles = $('#stat-articles');
  const statTags = $('#stat-tags');
  const statWords = $('#stat-words');
  if (statArticles) statArticles.textContent = ARTICLES.length;
  if (statTags) statTags.textContent = getAllTags().length;
  if (statWords) statWords.textContent = '3万+';
}

function getPageType() {
  const path = window.location.pathname;
  if (path.includes('article.html')) return 'article';
  if (path.includes('about.html')) return 'about';
  return 'home';
}

document.addEventListener('DOMContentLoaded', () => {
  createPetals();
  initNavbar();
  initBackToTop();
  const page = getPageType();
  switch (page) {
    case 'home':
      renderTagCloud('all');
      renderArticles(ARTICLES);
      initHomeFilters();
      break;
    case 'article':
      initArticleDetail();
      break;
    case 'about':
      initAboutPage();
      break;
  }
});
