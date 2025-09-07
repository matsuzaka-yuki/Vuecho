/**
 * 桌面端TOC功能 - 右侧栏固定显示
 */

(function() {
    'use strict';
    
    let tocData = [];
    
    /**
     * 初始化桌面端TOC
     */
    function initDesktopTOC() {
        // 只在桌面端运行
        if (window.innerWidth < 1200) return;
        
        const article = document.querySelector('.post-content, .docs-content, article');
        if (!article) return;
        
        // 收集标题
        collectHeadings(article);
        
        if (tocData.length === 0) return;
        
        // 创建桌面端TOC
        createDesktopTOC();
        
        // 初始化滚动监听
        initScrollSpy();
        
        // 调整主内容区域
        adjustMainContent();
    }
    
    /**
     * 收集文章标题
     */
    function collectHeadings(container) {
        tocData = [];
        
        // 排除评论区的标题，只选择文章内容区域的标题
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
        
        headings.forEach((heading, index) => {
            // 检查标题是否在评论区内
            if (isInCommentSection(heading)) {
                return; // 跳过评论区的标题
            }
            
            // 检查是否为文章标题，跳过文章标题
            if (isArticleTitle(heading)) {
                return; // 跳过文章标题
            }
            
            const text = heading.textContent.trim();
            const level = parseInt(heading.tagName.charAt(1));
            
            // 生成或获取ID
            let id = heading.id;
            if (!id) {
                id = generateHeadingId(text, index);
                heading.id = id;
            }
            
            if (id && text) {
                tocData.push({
                    id: id,
                    text: text,
                    level: level,
                    element: heading
                });
            }
        });
    }
    
    /**
     * 检查是否为文章标题
     */
    function isArticleTitle(heading) {
        // 检查是否有文章标题相关的类名
        if (heading.classList.contains('article-title') || 
            heading.classList.contains('post-title') ||
            heading.classList.contains('page-title')) {
            return true;
        }
        
        // 检查父元素是否有文章头部相关的类名
        let parent = heading.parentElement;
        while (parent && parent !== document.body) {
            const className = parent.className || '';
            
            if (className.includes('article-header') || 
                className.includes('post-header') ||
                className.includes('page-header') ||
                className.includes('entry-header')) {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    /**
     * 检查标题是否在评论区内
     */
    function isInCommentSection(heading) {
        // 检查常见的评论区选择器
        const commentSelectors = [
            '.comments',
            '.comment-section',
            '.comment-area',
            '.comment-list',
            '.comment-wrapper',
            '#comments',
            '#comment-section',
            '.post-comments',
            '.article-comments',
            '.respond',
            '#respond'
        ];
        
        // 检查标题是否在任何评论区容器内
        for (const selector of commentSelectors) {
            const commentContainer = document.querySelector(selector);
            if (commentContainer && commentContainer.contains(heading)) {
                return true;
            }
        }
        
        // 检查标题的父元素是否包含评论相关的类名
        let parent = heading.parentElement;
        while (parent && parent !== document.body) {
            const className = parent.className || '';
            const id = parent.id || '';
            
            if (className.includes('comment') || 
                className.includes('respond') || 
                id.includes('comment') || 
                id.includes('respond')) {
                return true;
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    /**
     * 生成标题ID
     */
    function generateHeadingId(text, index) {
        let id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        
        if (!id || document.getElementById(id)) {
            id = `heading-${index + 1}`;
        }
        
        return id;
    }
    
    /**
     * 创建桌面端TOC
     */
    function createDesktopTOC() {
        // 创建TOC容器
        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-desktop';
        tocContainer.innerHTML = generateDesktopTOCHTML();
        
        // 创建切换按钮
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toc-desktop-toggle';
        toggleButton.innerHTML = `
            <svg class="toc-desktop-toggle-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
            </svg>
        `;
        toggleButton.setAttribute('aria-label', '切换目录');
        toggleButton.setAttribute('title', '切换目录');
        
        // 插入到页面
        document.body.appendChild(tocContainer);
        document.body.appendChild(toggleButton);
        
        // 绑定事件
        bindTOCEvents(tocContainer);
        bindToggleEvents(toggleButton, tocContainer);
        
        // 调整主内容区域
        adjustMainContent();
        
        // 恢复显示状态
        restoreTOCState(tocContainer);
    }
    
    /**
     * 生成桌面端TOC HTML
     */
    function generateDesktopTOCHTML() {
        let html = '<div class="toc-desktop-wrapper">';
        html += '<div class="toc-desktop-header">';
        html += '<h4 class="toc-desktop-title">';
        html += '<svg class="toc-icon" viewBox="0 0 24 24" width="16" height="16">';
        html += '<path fill="currentColor" d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>';
        html += '</svg>';
        html += '目录';
        html += '</h4>';
        html += '</div>';
        html += '<nav class="toc-desktop-nav">';
        html += '<ul class="toc-desktop-list">';
        
        tocData.forEach(item => {
            html += `<li class="toc-desktop-item toc-level-${item.level}">`;
            html += `<a href="#${item.id}" class="toc-desktop-link" data-target="${item.id}">`;
            html += item.text;
            html += '</a>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</nav>';
        html += '</div>';
        
        return html;
    }
    
    /**
     * 绑定TOC事件
     */
    function bindTOCEvents(container) {
        const links = container.querySelectorAll('.toc-desktop-link');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 80; // 考虑固定头部高度
                    const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * 初始化滚动监听
     */
    function initScrollSpy() {
        let ticking = false;
        
        function updateActiveLink() {
            const scrollTop = window.pageYOffset;
            const headerHeight = 80;
            let activeId = '';
            
            // 找到当前可见的标题
            for (let i = tocData.length - 1; i >= 0; i--) {
                const item = tocData[i];
                const element = item.element;
                const elementTop = element.getBoundingClientRect().top + scrollTop;
                
                if (scrollTop >= elementTop - headerHeight - 10) {
                    activeId = item.id;
                    break;
                }
            }
            
            // 更新活动状态
            const links = document.querySelectorAll('.toc-desktop-link');
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-target') === activeId) {
                    link.classList.add('active');
                }
            });
            
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateActiveLink);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // 初始更新
        updateActiveLink();
    }
    
    /**
     * 绑定切换按钮事件
     */
    function bindToggleEvents(toggleButton, tocContainer) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            const isHidden = tocContainer.classList.contains('hidden');
            
            if (isHidden) {
                showTOC(tocContainer);
            } else {
                hideTOC(tocContainer);
            }
        });
    }
    
    /**
     * 显示TOC
     */
    function showTOC(tocContainer) {
        tocContainer.classList.remove('hidden');
        adjustMainContent(true);
        localStorage.setItem('toc-desktop-visible', 'true');
    }
    
    /**
     * 隐藏TOC
     */
    function hideTOC(tocContainer) {
        tocContainer.classList.add('hidden');
        adjustMainContent(false);
        localStorage.setItem('toc-desktop-visible', 'false');
    }
    
    /**
     * 恢复TOC状态
     */
    function restoreTOCState(tocContainer) {
        const isVisible = localStorage.getItem('toc-desktop-visible');
        if (isVisible === 'false') {
            hideTOC(tocContainer);
        }
    }
    
    /**
     * 调整主内容区域
     */
    function adjustMainContent(showTOC = true) {
        const docsMain = document.querySelector('.docs-main');
        if (docsMain) {
            docsMain.style.marginRight = showTOC ? '320px' : '40px';
            docsMain.style.transition = 'margin-right 0.3s ease';
        }
    }
    
    /**
     * 响应式处理
     */
    function handleResize() {
        const tocDesktop = document.querySelector('.toc-desktop');
        const toggleButton = document.querySelector('.toc-desktop-toggle');
        
        if (window.innerWidth >= 1200) {
            if (!tocDesktop && tocData.length > 0) {
                createDesktopTOC();
            }
        } else {
            if (tocDesktop) {
                tocDesktop.remove();
            }
            if (toggleButton) {
                toggleButton.remove();
            }
            const docsMain = document.querySelector('.docs-main');
            if (docsMain) {
                docsMain.style.marginRight = '';
                docsMain.style.transition = '';
            }
        }
    }
    
    // 防抖处理
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(handleResize, 150);
    });
    
    /**
     * 夜间模式适配
     */
    function updateTheme() {
        const tocContainer = document.querySelector('.toc-desktop');
        const toggleButton = document.querySelector('.toc-desktop-toggle');
        
        if (!tocContainer || !toggleButton) return;
        
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode) {
            tocContainer.classList.add('dark-theme');
            toggleButton.classList.add('dark-theme');
        } else {
            tocContainer.classList.remove('dark-theme');
            toggleButton.classList.remove('dark-theme');
        }
    }
    
    /**
     * PJAX支持 - 清理和重新初始化
     */
    function cleanupDesktopTOC() {
        const tocContainer = document.querySelector('.toc-desktop');
        const toggleButton = document.querySelector('.toc-desktop-toggle');
        
        if (tocContainer) {
            tocContainer.remove();
        }
        if (toggleButton) {
            toggleButton.remove();
        }
        
        // 恢复主内容区域
        const docsMain = document.querySelector('.docs-main');
        if (docsMain) {
            docsMain.style.marginRight = '';
            docsMain.style.transition = '';
        }
        
        // 清空数据
        tocData = [];
    }
    
    /**
     * 重新初始化（PJAX后调用）
     */
    function reinitDesktopTOC() {
        cleanupDesktopTOC();
        initDesktopTOC();
        updateTheme();
    }
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDesktopTOC);
    } else {
        initDesktopTOC();
    }
    
    // 夜间模式切换监听
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                updateTheme();
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
    
    // PJAX支持
    document.addEventListener('pjax:start', cleanupDesktopTOC);
    document.addEventListener('pjax:complete', reinitDesktopTOC);
    document.addEventListener('pjax:end', reinitDesktopTOC);
    
    // 暴露给全局，供其他脚本调用
    window.DesktopTOC = {
        init: initDesktopTOC,
        cleanup: cleanupDesktopTOC,
        reinit: reinitDesktopTOC,
        updateTheme: updateTheme
    };
    
})();