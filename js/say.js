async function fetchNewsBoard() {
    const listContainer = document.getElementById('fullList');
    
    try {
        const response = await fetch('https://cat-8bit.github.io/XoYez1/data/say.json');
        let data = await response.json();
        
        // 1. 比较 fullDate，按时间倒序排列 (最新的在最上面)
        data.sort((a, b) => new Date(b.fullDate) - new Date(a.fullDate));

        // 2. 截取前 5 条
        const latestFive = data.slice(0, 5);
        
        listContainer.innerHTML = '';

        latestFive.forEach(item => {
            // --- 核心修复：处理回复列表的逻辑 ---
            let repliesHtml = '';
            if (item.replies && item.replies.length > 0) {
                // 将每一条回复转为 HTML 字符串
                const items = item.replies.map(r => `
                    <div class="reply-item" style="margin-bottom:4px; line-height:1.4;">
                        <strong style="color:var(--accent); font-size:12px;">${r.user}:</strong> 
                        <span style="color:#555; font-size:12px;">${r.text}</span>
                    </div>
                `).join(''); // 用空字符串连接

                // 包装回复容器
                repliesHtml = `
                    <div class="reply-section" style="background:rgba(0,0,0,0.04); border-radius:8px; padding:8px 10px; margin-top:10px; width:100%; box-sizing:border-box;">
                        ${items}
                    </div>`;
            }

            // 3. 构造整个列表项
            const li = document.createElement('li');
            li.className = 'news-item';
            
            li.innerHTML = `
                <div class="user-meta" style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                    <img src="${item.avatar}" style="width:26px; height:26px; border-radius:50%; object-fit:cover;">
                    <span style="font-weight:bold; font-size:13px;">${item.userName}</span>
                </div>

                <span class="news-date" title="${item.fullDate}">
                    ${item.isNew ? '<span class="badge-new">New!</span>' : ''}
                    ${item.fullDate}
                </span>

                <div style="flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; width:100%;">
                    <span class="main-content" style="font-size:14px; color:#333;">${item.content}</span>
                    

                    <a href="${item.url}"
                       class="say-button" 
                       style="display:inline-flex; align-items:center; gap:2px; background:var(--accent); color:#fff; padding:2px 8px; border-radius:10px; font-size:10px; text-decoration:none; margin-top:10px; position:relative; z-index:100; pointer-events:auto; cursor:pointer;">
                        <span class="svg-icon icon-open_in_new" style="font-size:12px;"></span>SAY
                    </a>
                </div>
            `;
            
            listContainer.appendChild(li);
        });

    } catch (error) {
        console.error('加载说说失败:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchNewsBoard);