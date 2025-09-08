/**
 * 文章目录（Table of Contents）功能
 * 自动生成文章目录并提供导航功能
 */

(function() {
    'use strict';

    // TOC配置
    const TOC_CONFIG = {
        // 目录容器选择器
        containerSelector: '.article-content, .page-content',
        // 标题选择器
        headingSelector: 'h1, h2, h3, h4, h5, h6',
        // 目录插入位置
        tocContainer: '.toc-container',
        // 最小标题数量（少于此数量不显示目录）
        minHeadings: 2,
        // 是否自动添加锚点ID
        autoAddIds: true,
        // 滚动偏移量
        scrollOffset: 80,
        // 是否启用平滑滚动
        smoothScroll: true
    };

    let tocData = [];
    let currentActiveId = null;
    let isScrolling = false;

    /**
     * 检查是否为搜索结果页面
     */
    function isSearchResultsPage() {
        // 检查URL是否包含搜索参数
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('s') && urlParams.get('s').trim() !== '') {
            return true;
        }
        
        // 检查页面标题是否包含搜索关键字
        const archiveTitle = document.querySelector('.archive-title');
        if (archiveTitle && archiveTitle.textContent.includes('包含关键字')) {
            return true;
        }
        
        // 检查是否有搜索结果容器
        const searchResults = document.querySelector('.search-results');
        if (searchResults && searchResults.style.display !== 'none') {
            return true;
        }
        
        return false;
    }

    /**
     * 初始化TOC功能
     */
    function initTOC() {
        // 检查是否为搜索结果页面
        if (isSearchResultsPage()) {
            return;
        }
        
        const container = document.querySelector(TOC_CONFIG.containerSelector);
        if (!container) return;

        // 收集标题信息
        collectHeadings(container);
        
        // 如果标题数量不足，不显示目录
        if (tocData.length < TOC_CONFIG.minHeadings) {
            return;
        }

        // 生成目录HTML
        const tocHTML = generateTOCHTML();
        
        // 插入目录到页面
        insertTOC(tocHTML);
        
        // 初始化滚动监听
        initScrollSpy();
        
        // 初始化点击事件
        initTOCClicks();
        
        // 初始化折叠功能
        initTOCCollapse();
    }

    /**
     * 收集页面中的标题
     */
    function collectHeadings(container) {
        const headings = container.querySelectorAll(TOC_CONFIG.headingSelector);
        tocData = [];
        
        headings.forEach((heading, index) => {
            // 检查标题是否在评论区内
            if (isInCommentSection(heading)) {
                return; // 跳过评论区的标题
            }
            
            // 检查是否为文章标题，跳过文章标题
            if (isArticleTitle(heading)) {
                return; // 跳过文章标题
            }
            
            const level = parseInt(heading.tagName.charAt(1));
            const text = heading.textContent.trim();
            
            // 生成或获取ID
            let id = heading.id;
            if (!id && TOC_CONFIG.autoAddIds) {
                id = generateHeadingId(text, index);
                heading.id = id;
            }
            
            if (id) {
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
        // 移除特殊字符，转换为小写，用连字符连接
        let id = text
            .toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、英文、数字、空格和连字符
            .replace(/\s+/g, '-') // 空格转连字符
            .replace(/-+/g, '-') // 多个连字符合并为一个
            .replace(/^-|-$/g, ''); // 移除首尾连字符
        
        // 如果ID为空或已存在，使用索引
        if (!id || document.getElementById(id)) {
            id = `heading-${index + 1}`;
        }
        
        return id;
    }

    /**
     * 生成目录HTML
     */
    function generateTOCHTML() {
        if (tocData.length === 0) return '';
        
        let html = '<div class="toc-wrapper">';
        html += '<div class="toc-header">';
        html += '<h4 class="toc-title">';
        html += '<svg class="toc-icon" viewBox="0 0 24 24" width="16" height="16">';
        html += '<path fill="currentColor" d="M3 9h14V7H3v2zm0 4h14v-2H3v2zm0 4h14v-2H3v2zm16 0h2v-2h-2v2zm0-10v2h2V7h-2zm0 6h2v-2h-2v2z"/>';
        html += '</svg>';
        html += '目录';
        html += '</h4>';
        html += '<button class="toc-toggle" type="button" aria-label="折叠目录">';
        html += '<svg class="toc-toggle-icon" viewBox="0 0 24 24" width="16" height="16">';
        html += '<path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>';
        html += '</svg>';
        html += '</button>';
        html += '</div>';
        html += '<nav class="toc-nav">';
        html += '<ol class="toc-list">';
        
        let currentLevel = 0;
        let openLevels = [];
        
        tocData.forEach((item, index) => {
            const { id, text, level } = item;
            
            // 处理层级变化
            if (level > currentLevel) {
                // 进入更深层级
                for (let i = currentLevel; i < level - 1; i++) {
                    if (i >= 1) {
                        html += '<li><ol class="toc-list">';
                        openLevels.push('</ol></li>');
                    }
                }
                if (level > 1 && currentLevel < level - 1) {
                    html += '<li><ol class="toc-list">';
                    openLevels.push('</ol></li>');
                }
            } else if (level < currentLevel) {
                // 返回上层级
                const levelDiff = currentLevel - level;
                for (let i = 0; i < levelDiff; i++) {
                    if (openLevels.length > 0) {
                        html += openLevels.pop();
                    }
                }
            }
            
            html += `<li class="toc-item toc-level-${level}">`;
            html += `<a href="#${id}" class="toc-link" data-target="${id}">`;
            html += `<span class="toc-text">${escapeHtml(text)}</span>`;
            html += '</a>';
            html += '</li>';
            
            currentLevel = level;
        });
        
        // 关闭所有未关闭的层级
        while (openLevels.length > 0) {
            html += openLevels.pop();
        }
        
        html += '</ol>';
        html += '</nav>';
        html += '</div>';
        
        return html;
    }

    /**
     * 转义HTML字符
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 插入目录到页面
     */
    function insertTOC(tocHTML) {
        // 移除已存在的TOC
        const existingTOC = document.querySelector('.toc-container');
        if (existingTOC) {
            existingTOC.remove();
        }
        
        // 创建TOC容器
        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';
        tocContainer.innerHTML = tocHTML;
        
        // 根据屏幕尺寸决定插入位置
        const isDesktop = window.innerWidth >= 1200;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
        const isMobile = window.innerWidth < 768;
        
        if (isDesktop) {
            // 桌面端：插入到body中，通过CSS固定在右侧
            document.body.appendChild(tocContainer);
        } else {
            // 平板端和移动端：插入到文章内容前
            const articleContent = document.querySelector(TOC_CONFIG.containerSelector);
            if (articleContent && articleContent.parentNode) {
                if (isTablet) {
                    // 平板端：插入到文章头部后
                    const articleHeader = document.querySelector('.article-header');
                    if (articleHeader && articleHeader.nextSibling) {
                        articleHeader.parentNode.insertBefore(tocContainer, articleHeader.nextSibling);
                    } else {
                        articleContent.parentNode.insertBefore(tocContainer, articleContent);
                    }
                } else {
                    // 移动端：插入到文章内容前
                    articleContent.parentNode.insertBefore(tocContainer, articleContent);
                }
            } else {
                return; // 无法插入目录
            }
        }
        
        tocContainer.style.display = 'block';
    }

    /**
     * 初始化滚动监听
     */
    function initScrollSpy() {
        if (tocData.length === 0) return;
        
        // 使用Intersection Observer API进行性能优化
        if ('IntersectionObserver' in window) {
            initIntersectionObserver();
        } else {
            // 降级到滚动事件监听
            initScrollListener();
        }
    }

    /**
     * 使用Intersection Observer监听标题可见性
     */
    function initIntersectionObserver() {
        const observerOptions = {
            rootMargin: `-${TOC_CONFIG.scrollOffset}px 0px -50% 0px`,
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (isScrolling) return;
            
            entries.forEach(entry => {
                const id = entry.target.id;
                if (entry.isIntersecting) {
                    updateActiveTOCItem(id);
                }
            });
        }, observerOptions);
        
        // 观察所有标题元素
        tocData.forEach(item => {
            observer.observe(item.element);
        });
    }

    /**
     * 降级的滚动事件监听
     */
    function initScrollListener() {
        let ticking = false;
        
        function updateTOC() {
            if (isScrolling) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            let activeId = null;
            
            // 找到当前可见的标题
            for (let i = tocData.length - 1; i >= 0; i--) {
                const item = tocData[i];
                const rect = item.element.getBoundingClientRect();
                
                if (rect.top <= TOC_CONFIG.scrollOffset) {
                    activeId = item.id;
                    break;
                }
            }
            
            if (activeId) {
                updateActiveTOCItem(activeId);
            }
            
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateTOC);
                ticking = true;
            }
        });
    }

    /**
     * 更新活跃的目录项
     */
    function updateActiveTOCItem(activeId) {
        if (currentActiveId === activeId) return;
        
        // 移除之前的活跃状态
        const prevActive = document.querySelector('.toc-link.active');
        if (prevActive) {
            prevActive.classList.remove('active');
        }
        
        // 添加新的活跃状态
        const newActive = document.querySelector(`.toc-link[data-target="${activeId}"]`);
        if (newActive) {
            newActive.classList.add('active');
            
            // 滚动目录到可见区域
            scrollTOCIntoView(newActive);
        }
        
        currentActiveId = activeId;
    }

    /**
     * 滚动目录项到可见区域
     */
    function scrollTOCIntoView(element) {
        const tocNav = document.querySelector('.toc-nav');
        if (!tocNav) return;
        
        const tocRect = tocNav.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        if (elementRect.top < tocRect.top || elementRect.bottom > tocRect.bottom) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    /**
     * 初始化目录点击事件
     */
    function initTOCClicks() {
        const tocContainer = document.querySelector('.toc-container');
        if (!tocContainer) return;
        
        tocContainer.addEventListener('click', (e) => {
            const link = e.target.closest('.toc-link');
            if (!link) return;
            
            e.preventDefault();
            
            const targetId = link.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                isScrolling = true;
                
                // 计算滚动位置
                const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - TOC_CONFIG.scrollOffset;
                
                if (TOC_CONFIG.smoothScroll && 'scrollTo' in window) {
                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                    
                    // 平滑滚动完成后重置标志
                    setTimeout(() => {
                        isScrolling = false;
                        updateActiveTOCItem(targetId);
                    }, 500);
                } else {
                    window.scrollTo(0, targetTop);
                    isScrolling = false;
                    updateActiveTOCItem(targetId);
                }
                
                // 更新URL哈希（不触发滚动）
                if (history.replaceState) {
                    history.replaceState(null, null, '#' + targetId);
                }
            }
        });
    }

    /**
     * 初始化目录折叠功能
     */
    function initTOCCollapse() {
        const tocToggle = document.querySelector('.toc-toggle');
        const tocNav = document.querySelector('.toc-nav');
        
        if (!tocToggle || !tocNav) return;
        
        // 检查当前屏幕尺寸
        const isDesktop = window.innerWidth >= 1200;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
        const isMobile = window.innerWidth < 768;
        
        if (isDesktop) {
            // 桌面端不显示折叠功能
            tocToggle.style.display = 'none';
            tocNav.classList.remove('collapsed');
            return;
        }
        
        // 平板端和移动端都显示折叠功能
        tocToggle.style.display = 'flex';
        
        // 从localStorage恢复折叠状态
        const storageKey = isMobile ? 'toc-collapsed-mobile' : 'toc-collapsed-tablet';
        const isCollapsed = localStorage.getItem(storageKey) === 'true';
        
        if (isCollapsed) {
            tocNav.classList.add('collapsed');
            tocToggle.classList.add('collapsed');
        } else {
            tocNav.classList.remove('collapsed');
            tocToggle.classList.remove('collapsed');
        }
        
        // 移除之前的事件监听器（避免重复绑定）
        tocToggle.replaceWith(tocToggle.cloneNode(true));
        const newTocToggle = document.querySelector('.toc-toggle');
        
        newTocToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const currentTocNav = document.querySelector('.toc-nav');
            const isCurrentlyCollapsed = currentTocNav.classList.contains('collapsed');
            
            if (isCurrentlyCollapsed) {
                currentTocNav.classList.remove('collapsed');
                newTocToggle.classList.remove('collapsed');
                newTocToggle.setAttribute('aria-expanded', 'true');
                localStorage.setItem(storageKey, 'false');
            } else {
                currentTocNav.classList.add('collapsed');
                newTocToggle.classList.add('collapsed');
                newTocToggle.setAttribute('aria-expanded', 'false');
                localStorage.setItem(storageKey, 'true');
            }
        });
        
        // 设置初始的aria属性
        newTocToggle.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
    }

    /**
     * 处理页面加载时的锚点跳转
     */
    function handleInitialHash() {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                setTimeout(() => {
                    const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - TOC_CONFIG.scrollOffset;
                    window.scrollTo(0, targetTop);
                    updateActiveTOCItem(targetId);
                }, 100);
            }
        }
    }

    /**
     * 响应式处理
     */
    function initResponsive() {
        const tocContainer = document.querySelector('.toc-container');
        const tocToggle = document.querySelector('.toc-toggle');
        const tocNav = document.querySelector('.toc-nav');
        
        if (!tocContainer) return;
        
        function updateTOCPosition() {
            const isDesktop = window.innerWidth >= 1200;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1200;
            const isMobile = window.innerWidth < 768;
            
            if (isDesktop) {
                // 桌面端：右侧固定，无折叠
                tocContainer.classList.remove('toc-mobile', 'toc-tablet');
                tocContainer.classList.add('toc-desktop');
                if (tocToggle) tocToggle.style.display = 'none';
                if (tocNav) tocNav.classList.remove('collapsed');
                
                // 确保主内容区域留出空间
                const docsMain = document.querySelector('.docs-main');
                if (docsMain) {
                    docsMain.style.marginRight = '320px';
                }
            } else if (isTablet) {
                // 平板端：文章头部，可折叠
                tocContainer.classList.remove('toc-mobile', 'toc-desktop');
                tocContainer.classList.add('toc-tablet');
                if (tocToggle) tocToggle.style.display = 'flex';
                
                // 恢复主内容区域
                const docsMain = document.querySelector('.docs-main');
                if (docsMain) {
                    docsMain.style.marginRight = '';
                }
            } else if (isMobile) {
                // 移动端：固定在文章头部，可折叠
                tocContainer.classList.remove('toc-desktop', 'toc-tablet');
                tocContainer.classList.add('toc-mobile');
                if (tocToggle) tocToggle.style.display = 'flex';
                
                // 恢复主内容区域
                const docsMain = document.querySelector('.docs-main');
                if (docsMain) {
                    docsMain.style.marginRight = '';
                }
                
                // 防止TOC影响页面滑动
                if (tocNav) {
                    tocNav.addEventListener('touchstart', (e) => {
                        e.stopPropagation();
                    }, { passive: true });
                    
                    tocNav.addEventListener('touchmove', (e) => {
                        e.stopPropagation();
                    }, { passive: true });
                }
            }
            
            // 重新初始化折叠功能
            initTOCCollapse();
        }
        
        updateTOCPosition();
        
        // 防抖处理resize事件
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateTOCPosition, 150);
        });
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initTOC();
            handleInitialHash();
            initResponsive();
        });
    } else {
        initTOC();
        handleInitialHash();
        initResponsive();
    }

    // PJAX支持
    document.addEventListener('pjax:complete', () => {
        initTOC();
        handleInitialHash();
        initResponsive();
    });

    // 导出API供外部使用
    window.TOC = {
        init: initTOC,
        refresh: () => {
            initTOC();
            handleInitialHash();
        },
        config: TOC_CONFIG
    };

})();