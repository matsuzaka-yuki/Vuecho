/**
 * 移动端TOC功能 - 文章头部可折叠显示
 */

(function() {
    'use strict';
    
    let tocData = [];
    let tocContainer = null;
    
    /**
     * 初始化移动端TOC
     */
    function initMobileTOC() {
        // 只在移动端和平板端运行
        if (window.innerWidth >= 1200) return;
        
        const article = document.querySelector('.post-content, .docs-content, article');
        if (!article) return;
        
        // 收集标题
        collectHeadings(article);
        
        if (tocData.length === 0) return;
        
        // 创建移动端TOC
        createMobileTOC();
        
        // 初始化折叠功能
        initMobileCollapse();
        
        // 初始化滚动监听
        initScrollSpy();
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
     * 创建移动端TOC
     */
    function createMobileTOC() {
        // 创建TOC容器
        tocContainer = document.createElement('div');
        tocContainer.className = 'toc-mobile';
        tocContainer.innerHTML = generateMobileTOCHTML();
        
        // 插入到文章开头
        const article = document.querySelector('.post-content, .docs-content, article');
        if (article) {
            article.insertBefore(tocContainer, article.firstChild);
        }
        
        // 绑定点击事件
        bindTOCEvents(tocContainer);
    }
    
    /**
     * 生成移动端TOC HTML
     */
    function generateMobileTOCHTML() {
        let html = '<div class="toc-mobile-wrapper">';
        html += '<div class="toc-mobile-header">';
        html += '<h4 class="toc-mobile-title">';
        html += '<svg class="toc-icon" viewBox="0 0 24 24" width="16" height="16">';
        html += '<path fill="currentColor" d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>';
        html += '</svg>';
        html += '目录';
        html += '</h4>';
        html += '<button class="toc-mobile-toggle" type="button" aria-label="折叠目录" aria-expanded="true">';
        html += '<svg class="toc-toggle-icon" viewBox="0 0 24 24" width="16" height="16">';
        html += '<path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>';
        html += '</svg>';
        html += '</button>';
        html += '</div>';
        html += '<nav class="toc-mobile-nav">';
        html += '<ul class="toc-mobile-list">';
        
        tocData.forEach(item => {
            html += `<li class="toc-mobile-item toc-level-${item.level}">`;
            html += `<a href="#${item.id}" class="toc-mobile-link" data-target="${item.id}">`;
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
        const links = container.querySelectorAll('.toc-mobile-link');
        
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
     * 初始化移动端折叠功能
     */
    function initMobileCollapse() {
        if (!tocContainer) return;
        
        const toggleButton = tocContainer.querySelector('.toc-mobile-toggle');
        const tocNav = tocContainer.querySelector('.toc-mobile-nav');
        
        if (!toggleButton || !tocNav) return;
        
        // 从localStorage恢复折叠状态
        const isMobile = window.innerWidth < 768;
        const storageKey = isMobile ? 'toc-collapsed-mobile' : 'toc-collapsed-tablet';
        const isCollapsed = localStorage.getItem(storageKey) === 'true';
        
        // 设置初始状态
        if (isCollapsed) {
            tocNav.classList.add('collapsed');
            toggleButton.classList.add('collapsed');
            toggleButton.setAttribute('aria-expanded', 'false');
        } else {
            tocNav.classList.remove('collapsed');
            toggleButton.classList.remove('collapsed');
            toggleButton.setAttribute('aria-expanded', 'true');
        }
        
        // 绑定折叠事件
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isCurrentlyCollapsed = tocNav.classList.contains('collapsed');
            
            if (isCurrentlyCollapsed) {
                // 展开
                tocNav.classList.remove('collapsed');
                toggleButton.classList.remove('collapsed');
                toggleButton.setAttribute('aria-expanded', 'true');
                localStorage.setItem(storageKey, 'false');
            } else {
                // 折叠
                tocNav.classList.add('collapsed');
                toggleButton.classList.add('collapsed');
                toggleButton.setAttribute('aria-expanded', 'false');
                localStorage.setItem(storageKey, 'true');
            }
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
            const links = document.querySelectorAll('.toc-mobile-link');
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
     * 响应式处理
     */
    function handleResize() {
        if (window.innerWidth >= 1200) {
            // 桌面端，移除移动端TOC
            if (tocContainer) {
                tocContainer.remove();
                tocContainer = null;
                tocData = [];
            }
        } else {
            // 移动端/平板端，确保TOC存在
            if (!tocContainer && tocData.length === 0) {
                initMobileTOC();
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
        if (!tocContainer) return;
        
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDarkMode) {
            tocContainer.classList.add('dark-theme');
        } else {
            tocContainer.classList.remove('dark-theme');
        }
    }
    
    /**
     * PJAX支持 - 清理和重新初始化
     */
    function cleanupMobileTOC() {
        if (tocContainer) {
            tocContainer.remove();
            tocContainer = null;
        }
        
        // 清空数据
        tocData = [];
    }
    
    /**
     * 重新初始化（PJAX后调用）
     */
    function reinitMobileTOC() {
        cleanupMobileTOC();
        initMobileTOC();
        updateTheme();
    }
    
    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileTOC);
    } else {
        initMobileTOC();
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
    document.addEventListener('pjax:start', cleanupMobileTOC);
    document.addEventListener('pjax:complete', reinitMobileTOC);
    document.addEventListener('pjax:end', reinitMobileTOC);
    
    // 暴露给全局，供其他脚本调用
    window.MobileTOC = {
        init: initMobileTOC,
        cleanup: cleanupMobileTOC,
        reinit: reinitMobileTOC,
        updateTheme: updateTheme
    };
    
})();