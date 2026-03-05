/**
 * =========================================
 * News Board Component Logic
 * Fetches recent updates from scrapbook data,
 * handles rendering, filtering, and scroll 
 * mask animations for the news board.
 * =========================================
 */

/**
 * Loads and renders the latest news items from the scrapbook JSON data.
 */
async function loadNews() {
  const list = document.getElementById("fullList");
  if (!list) return;

  try {
    const res = await fetch("data/scrapbook.json?t=" + Date.now());
    const data = await res.json();
    const targetTags = ["Updates", "News"];
    const now = new Date();

    // 1. Base Filter (Enabled, Scheduled & Tags)
    const rawNews = data.filter(item => {
      if (item.disabled === true) return false;
      if (item.date) {

        const itemDate = new Date(item.date.replace(' ', 'T'));
        if (itemDate > now) return false;
      }
      if (!item.tags) return false;
      return item.tags.some(tag => targetTags.includes(tag));
    });

    // 2. Grouping & Representative Selection (gnum === 0)
    const groupMap = new Map();
    rawNews.forEach(item => {
      // Use gid if present, otherwise treat as unique via ID
      const gid = item.gid || `unique_${item.id}`;
      if (!groupMap.has(gid)) groupMap.set(gid, []);
      groupMap.get(gid).push(item);
    });

    const uniqueItems = [];
    groupMap.forEach(group => {
      // Try to find the item with gnum 0, otherwise take the first one
      let rep = group.find(i => i.gnum === 0 || i.gnum === '0');
      if (!rep) rep = group[0];
      uniqueItems.push(rep);
    });

    // 3. Sort & Slice
    let displayData = uniqueItems.sort((a, b) => new Date((b.date || "1970-01-01").replace(' ', 'T')) - new Date((a.date || "1970-01-01").replace(' ', 'T')));
    const hasMore = displayData.length > 5;
    displayData = displayData.slice(0, 5);

    // 4. Render
    list.innerHTML = "";
    
    displayData.forEach(item => {
      const li = document.createElement("li");
      li.className = "news-item";

      const d = new Date((item.date || "1970-01-01").replace(' ', 'T'));
      const yyyy = d.getFullYear(), mm = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
      const displayDate = `${yyyy}.${mm}.${dd}`;

      const diffTime = Math.abs(now - d), diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isNew = item.new === true || diffDays <= 7;
      const newBadge = isNew ? `<span class="badge-new">New!</span>` : "";

      const initialLang = window.getCurrentLang ? window.getCurrentLang() : "ja";
      let jaText = item.ja || "", enText = item.en || "";

      let scrapLink = "";

      if (item.sharable) {
        scrapLink = `<a href="scrapbook.html?id=${item.id}" style="display:inline-flex; align-items:center; gap:2px; background:var(--accent); color:#fff; padding:2px 8px; border-radius:10px; font-size:10px; text-decoration:none; margin-top:6px; position:relative; z-index:100; pointer-events:auto; cursor:pointer;"><span class="svg-icon icon-open_in_new" style="font-size:12px;"></span>Open Scrapbook</a>`;
      }

      li.innerHTML = `
        <span class="news-date" title="${item.date}">${newBadge}${displayDate}</span>
        <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start;">
          <span class="news-text ch-lang-animation" data-ja="${jaText.replace(/"/g, "&quot;")}" data-en="${enText.replace(/"/g, "&quot;")}">
            ${initialLang === "ja" ? jaText : enText}
          </span>
          ${scrapLink}
        </div>
      `;
      list.appendChild(li);
    });

    if (hasMore) {
      const t = window.t || ((k) => k);
      const moreLi = document.createElement("li");
      moreLi.className = "news-item view-more-row"; 
      moreLi.style.cssText = "justify-content: center; padding-top: 15px; padding-bottom: 40px; border-bottom: none; position: relative; z-index: 100;";      
      moreLi.innerHTML = `
        <a href="scrapbook.html?tag=Updates,News" class="view-more-link" style="position: relative; z-index: 101; font-size: 15px; color: var(--accent); text-decoration: none; font-weight: bold; display: inline-flex; align-items: center; gap: 4px; padding: 8px 24px; border-radius: 999px; background: rgba(191, 167, 122, 0.1); cursor: pointer; pointer-events: auto;">
          <span class="ch-lang-animation" data-i18n="news_view_more">${t("news_view_more")}</span>
          <span class="svg-icon icon-arrow_forward view-more-arrow" style="font-size: 18px;"></span>
        </a>`;
      list.appendChild(moreLi);
    }
  } catch (e) { 
    console.error("News load error:", e); 
  }
}

/**
 * Toggles the expanded state of the news board and triggers haptic feedback.
 */
function toggleNews() {
  const vibrate = (pattern = 10) => { if (navigator && navigator.vibrate) { navigator.vibrate(0); navigator.vibrate(pattern); } };
  vibrate(15);
  
  const board = document.querySelector(".news-board");
  if (!board) return;
  board.classList.toggle("is-open");
}

/**
 * Initializes scroll event listeners on the news container to handle
 * the dynamic top/bottom fading mask effects based on scroll position.
 */
function initNewsTitleHide() {
  const board = document.querySelector(".news-board");
  const container = document.querySelector(".news-scroll-container");
  const title = document.querySelector(".news-title");
  if (!board || !container || !title) return;

  container.addEventListener("scroll", () => {
    if (!board.classList.contains("is-open")) return;
    
    if (container.scrollTop > 5) {
      board.classList.add("is-scrolled");
    } else {
      board.classList.remove("is-scrolled");
    }

    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 5) {
      container.classList.add("is-bottom");
    } else {
      container.classList.remove("is-bottom");
    }
  });
}

document.addEventListener("DOMContentLoaded", initNewsTitleHide);
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("news-toggle-btn");
  if (btn) btn.addEventListener("click", toggleNews);
});

/**
 * =========================================
 * Global Exports
 * =========================================
 */
window.loadNews = loadNews;
window.toggleNews = toggleNews;