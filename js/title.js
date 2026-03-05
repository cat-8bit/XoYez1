const originalTitle = document.title;

// 监听可见性变化事件
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // 当用户切换到其他标签页时
        document.title = 'Σ( ° △ °|||) 记得回来呀！';
    } else {
        // 当用户回到本页面时
        document.title = 'ヾ(o◕∀◕)ﾉ 欢迎回来~';

        // 3秒后恢复原始标题，或者一直显示欢迎语
        setTimeout(() => {
            if (document.hidden == false) {
                document.title = originalTitle;
            }
        }, 3000);
    }
});