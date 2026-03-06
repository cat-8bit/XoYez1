let allData = [];      // 存储从 JSON 获取的所有数据
let currentIndex = 0;  // 当前加载到的索引
const PAGE_SIZE = 5;   // 每次加载的数量

async function initNewsBoard() {
    const listContainer = document.getElementById('fullList');
    const anchor = document.getElementById('loadMoreAnchor');

    try {
        // 1. 一次性获取 JSON (如果是后端 API，这里通常带分页参数)
        const response = await fetch('https://cat-8bit.github.io/XoYez1/data/say.json');
        allData = await response.json();

        // 2. 按日期倒序排列
        allData.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));

        // 3. 初始加载前 5 条
        loadMoreItems();

        // 4. 设置实时滚动监听
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && currentIndex < allData.length) {
                anchor.style.display = 'block';
                // 模拟一点点网络延迟，让动画更自然
                setTimeout(() => {
                    loadMoreItems();
                    if (currentIndex >= allData.length) {
                        anchor.innerText = "已经到底啦~";
                    }
                }, 500);
            }
        }, { threshold: 0.1 });

        observer.observe(anchor);

    } catch (error) {
        console.error('加载失败:', error);
    }
}

function loadMoreItems() {
    const listContainer = document.getElementById('fullList');
    const nextBatch = allData.slice(currentIndex, currentIndex + PAGE_SIZE);

    nextBatch.forEach(item => {
        // 生成回复 HTML (保留你之前的样式)
        let repliesHtml = '';
        if (item.replies && item.replies.length > 0) {
            repliesHtml = `
                <div class="reply-section" style="bakground:rgba(0,0,0,0.04);>
                    ${item.replies.map(r => `
                        <div style="margin-bottom:4px; font-size:12px;">
                            <strong style="color:var(--accent); font-size:12px;">${r.user}:</strong> 
                        <span style="color:#555; font-size:12px;">${r.text}</span>
                        
                    `).join('')}
                </div>`;
        }

        const li = document.createElement('li');
        li.className = 'news-item';
        // 注意：这里加入了 2px 的底部分割线
        li.style.borderBottom = "3px solid rgba(0,0,0,0.05)";
        li.style.paddingBottom = "15px";
        li.style.marginBottom = "15px";

        li.innerHTML = `
            <div class="user-meta" style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
                <img src="${item.avatar}" style="width:28px; height:28px; border-radius:50%;">
                <span style="font-weight:bold; font-size:13px;">${item.userName}</span>
            </div>
            <span class="news-date">${item.date}</span>
            <div style="flex:1; width:100%;">
                <span>${item.content}</span>
                ${repliesHtml}
                <a href="${item.url}" class="say-button" style="display:inline-flex; align-items:center; gap:2px; background:var(--accent); color:#fff; padding:2px 8px; border-radius:10px; font-size:10px; text-decoration:none; margin-top:10px; position:relative; z-index:100; pointer-events:auto; cursor:pointer;">
                        <span class="svg-icon icon-open_in_new" style="font-size:12px;"></span>
                        SAY
                    </a>
            </div>
        `;
        listContainer.appendChild(li);
    });

    currentIndex += PAGE_SIZE;
}

document.addEventListener('DOMContentLoaded', initNewsBoard);