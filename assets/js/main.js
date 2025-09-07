/**
 * VuePress风格文档主题 - 主要JavaScript功能
 */

(function() {
    'use strict';

    // 全局变量
    let sidebar = null;
    let searchInput = null;
    let navToggle = null;

    // 初始化主题（在DOM加载前执行）
    initTheme();

    // 初始化
    document.addEventListener('DOMContentLoaded', function() {
        initElements();
        initNavigation();
        initSidebar();
        // 修复：只有在搜索功能开启时才初始化搜索
        if (document.querySelector('.nav-search')) {
            initSearch();
        }
        initCodeHighlight();
        initScrollSpy();
        initUXEnhancements();
        initBackToTop();
        initPjax();
        
        // 初始化顶部导航高亮
        highlightCurrentPageInNav();
        // 初始化侧边栏页面导航高亮
        highlightCurrentPageInSidebar();
    });

    // 初始化主题设置（优化版本，防止闪白）
    function initTheme() {
        // 这个函数现在主要用于确保主题状态正确
        // 实际的主题应用已经在 header.php 的内联脚本中完成
        const savedTheme = localStorage.getItem('theme');
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        // 确保状态一致性
        if (savedTheme === 'dark' && currentTheme !== 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (savedTheme !== 'dark' && currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // 移除防闪烁的no-transition类（如果存在）
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 100);
    }

    // 初始化DOM元素
    function initElements() {
        sidebar = document.querySelector('.docs-sidebar');
        searchInput = document.querySelector('.search-input');
        navToggle = document.querySelector('#nav-toggle');
    }

    // 初始化导航功能
    function initNavigation() {
        if (!navToggle || !sidebar) return;

        // 移动端菜单切换
        navToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // 切换汉堡菜单动画
            const lines = navToggle.querySelectorAll('.toggle-line');
            lines.forEach((line, index) => {
                if (navToggle.classList.contains('active')) {
                    if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) line.style.opacity = '0';
                    if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    line.style.transform = '';
                    line.style.opacity = '';
                }
            });
        });

        // 点击页面其他地方关闭侧边栏
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !navToggle.contains(e.target) &&
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                navToggle.classList.remove('active');
                
                // 重置汉堡菜单
                const lines = navToggle.querySelectorAll('.toggle-line');
                lines.forEach(line => {
                    line.style.transform = '';
                    line.style.opacity = '';
                });
            }
        });
    }

    // 初始化侧边栏功能
    function initSidebar() {
        if (!sidebar) return;

        // 文档分类树折叠功能 - 只处理分类名称点击
        const nodeLinks = sidebar.querySelectorAll('.node-link');
        nodeLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const treeNode = this.closest('.tree-node');
                const children = treeNode.querySelector('.tree-children');
                
                if (children) {
                    // 切换展开状态
                    const isExpanded = treeNode.classList.contains('expanded');
                    
                    if (isExpanded) {
                        // 折叠
                        treeNode.classList.remove('expanded');
                        children.style.maxHeight = '0';
                        setTimeout(() => {
                            if (!treeNode.classList.contains('expanded')) {
                                children.style.display = 'none';
                            }
                        }, 300);
                    } else {
                        // 展开
                        treeNode.classList.add('expanded');
                        children.style.display = 'block';
                        // 计算实际高度
                        const scrollHeight = children.scrollHeight;
                        children.style.maxHeight = scrollHeight + 'px';
                    }
                }
            });
        });

        // 初始化已展开的分类节点
        const expandedNodes = sidebar.querySelectorAll('.tree-node.expanded');
        expandedNodes.forEach(node => {
            const children = node.querySelector('.tree-children');
            const toggle = node.querySelector('.node-toggle');
            
            if (children) {
                children.style.display = 'block';
                children.style.maxHeight = children.scrollHeight + 'px';
            }
            
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        // 高亮当前页面在分类树中的位置
        highlightCurrentPageInTree();
        
        // 自动滚动到当前页面
        scrollToCurrentPage();
    }

    // 高亮当前页面在分类树中的位置
    function highlightCurrentPageInTree() {
        const currentUrl = window.location.pathname;
        const currentHref = window.location.href;
        const allLinks = sidebar.querySelectorAll('.node-link, .leaf-link');
        
        // 先清除所有高亮
        allLinks.forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.current-post, .current-category').forEach(el => {
            el.classList.remove('current-post', 'current-category');
        });
        
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            // 更智能的URL匹配：路径名匹配或完整URL匹配（忽略哈希和查询参数）
            const linkUrl = new URL(href, window.location.origin);
            const currentUrlObj = new URL(currentHref, window.location.origin);
            
            if (linkUrl.pathname === currentUrlObj.pathname || href === currentHref) {
                link.classList.add('active');
                
                // 标记父级节点
                const treeNode = link.closest('.tree-node');
                const treeLeaf = link.closest('.tree-leaf');
                
                if (treeLeaf) {
                    treeLeaf.classList.add('current-post');
                    // 确保父级分类节点展开
                    const parentNode = treeLeaf.closest('.tree-node');
                    if (parentNode) {
                        parentNode.classList.add('expanded');
                        const children = parentNode.querySelector('.tree-children');
                        const toggle = parentNode.querySelector('.node-toggle');
                        
                        if (children) {
                            children.style.display = 'block';
                            children.style.maxHeight = children.scrollHeight + 'px';
                        }
                        if (toggle) {
                            toggle.setAttribute('aria-expanded', 'true');
                        }
                    }
                } else if (treeNode) {
                    treeNode.classList.add('current-category');
                }
            }
        });
    }
    
    // 滚动到当前页面
    function scrollToCurrentPage() {
        const currentItem = sidebar.querySelector('.current-post, .current-category');
        if (currentItem && sidebar.scrollTo) {
            const sidebarRect = sidebar.getBoundingClientRect();
            const itemRect = currentItem.getBoundingClientRect();
            
            if (itemRect.top < sidebarRect.top || itemRect.bottom > sidebarRect.bottom) {
                const scrollTop = currentItem.offsetTop - sidebar.offsetTop - sidebarRect.height / 2;
                sidebar.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    // 高亮当前页面在顶部导航中的位置
    function highlightCurrentPageInNav() {
        const currentUrl = window.location.pathname;
        const currentHref = window.location.href;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // 先清除所有导航链接的高亮
        navLinks.forEach(link => link.classList.remove('active'));
        
        // 遍历导航链接，找到匹配的链接并高亮
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            try {
                // 处理相对路径和绝对路径
                const linkUrl = new URL(href, window.location.origin);
                const currentUrlObj = new URL(currentHref, window.location.origin);
                
                // 精确匹配路径名
                if (linkUrl.pathname === currentUrlObj.pathname) {
                    link.classList.add('active');
                }
                // 特殊处理首页：当前页面是首页且链接也是首页时
                else if (currentUrlObj.pathname === '/' && (linkUrl.pathname === '/' || linkUrl.pathname === '')) {
                    link.classList.add('active');
                }
                // 处理页面路径匹配（去除末尾斜杠）
                else if (linkUrl.pathname.replace(/\/$/, '') === currentUrlObj.pathname.replace(/\/$/, '')) {
                    link.classList.add('active');
                }
            } catch (e) {
                // 如果URL解析失败，尝试简单的字符串匹配
                if (href === currentHref || href === currentUrl) {
                    link.classList.add('active');
                }
            }
        });
    }



    // 高亮当前页面在侧边栏导航中的位置
    function highlightCurrentPageInSidebar() {
        const currentUrl = window.location.pathname;
        const currentHref = window.location.href;
        const sidebarLinks = document.querySelectorAll('.page-nav-list a');
        
        // 先清除所有侧边栏链接的高亮
        sidebarLinks.forEach(link => link.classList.remove('active'));
        
        // 遍历侧边栏链接，找到匹配的链接并高亮
        sidebarLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            try {
                // 处理相对路径和绝对路径
                const linkUrl = new URL(href, window.location.origin);
                const currentUrlObj = new URL(currentHref, window.location.origin);
                
                // 精确匹配路径名
                if (linkUrl.pathname === currentUrlObj.pathname) {
                    link.classList.add('active');
                }
                // 特殊处理首页：当前页面是首页且链接也是首页时
                else if (currentUrlObj.pathname === '/' && (linkUrl.pathname === '/' || linkUrl.pathname === '')) {
                    link.classList.add('active');
                }
                // 处理页面路径匹配（去除末尾斜杠）
                else if (linkUrl.pathname.replace(/\/$/, '') === currentUrlObj.pathname.replace(/\/$/, '')) {
                    link.classList.add('active');
                }
            } catch (e) {
                // 如果URL解析失败，尝试简单的字符串匹配
                if (href === currentHref || href === currentUrl) {
                    link.classList.add('active');
                }
            }
        });
    }



    // 初始化搜索功能
    function initSearch() {
        if (!searchInput) return;

        let searchTimeout;
        const searchResults = createSearchResults();

        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();

            if (query.length < 2) {
                hideSearchResults();
                return;
            }

            searchTimeout = setTimeout(() => {
                performSearch(query, searchResults);
            }, 300);
        });

        // 点击外部关闭搜索结果
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav-search')) {
                hideSearchResults();
            }
        });

        // ESC键关闭搜索结果
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                hideSearchResults();
                searchInput.blur();
            }
        });
    }

    // 创建搜索结果容器
    function createSearchResults() {
        const container = document.createElement('div');
        container.className = 'search-results';
        container.innerHTML = `
            <div class="search-results-header">
                <span class="search-results-count"></span>
            </div>
            <div class="search-results-list"></div>
        `;
        
        const searchForm = document.querySelector('.search-form');
        searchForm.appendChild(container);
        
        return container;
    }

    // 执行搜索
    function performSearch(query, resultsContainer) {
        // 这里可以集成更复杂的搜索逻辑
        // 目前实现简单的页面内容搜索
        
        const results = [];
        const content = document.querySelector('.article-content, .page-content');
        
        if (content) {
            const text = content.textContent.toLowerCase();
            const queryLower = query.toLowerCase();
            
            if (text.includes(queryLower)) {
                results.push({
                    title: document.title,
                    url: window.location.href,
                    excerpt: extractExcerpt(content.textContent, query)
                });
            }
        }

        displaySearchResults(results, resultsContainer, query);
    }

    // 提取搜索结果摘要
    function extractExcerpt(text, query, maxLength = 150) {
        const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
        if (queryIndex === -1) return text.substring(0, maxLength) + '...';

        const start = Math.max(0, queryIndex - 50);
        const end = Math.min(text.length, queryIndex + query.length + 50);
        
        let excerpt = text.substring(start, end);
        if (start > 0) excerpt = '...' + excerpt;
        if (end < text.length) excerpt = excerpt + '...';
        
        return excerpt;
    }

    // 显示搜索结果
    function displaySearchResults(results, container, query) {
        const countElement = container.querySelector('.search-results-count');
        const listElement = container.querySelector('.search-results-list');

        if (results.length === 0) {
            countElement.textContent = '未找到相关结果';
            listElement.innerHTML = '<div class="search-no-results">请尝试其他关键词</div>';
        } else {
            countElement.textContent = `找到 ${results.length} 个结果`;
            listElement.innerHTML = results.map(result => `
                <div class="search-result-item">
                    <h4 class="search-result-title">
                        <a href="${result.url}">${highlightQuery(result.title, query)}</a>
                    </h4>
                    <p class="search-result-excerpt">${highlightQuery(result.excerpt, query)}</p>
                </div>
            `).join('');
        }

        container.style.display = 'block';
    }

    // 高亮搜索关键词
    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // 隐藏搜索结果
    function hideSearchResults() {
        const searchResults = document.querySelector('.search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // 初始化代码高亮
    function initCodeHighlight() {
        // 如果Prism.js已加载，则高亮所有代码块
        if (typeof Prism !== 'undefined') {
            // 启用行号插件
            Prism.plugins.lineNumbers = true;
            
            // 高亮所有代码块
            Prism.highlightAll();
            
            // 为代码块添加行号
            addLineNumbers();
            
            // 添加语言标签
            addLanguageLabels();
        }
    }

    // 添加代码复制按钮
    function addCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            const button = document.createElement('button');
            button.className = 'code-copy-btn';
            button.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                <span>复制</span>
            `;
            
            button.addEventListener('click', function() {
                const code = codeBlock.textContent;
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(code).then(() => {
                        showCopySuccess(button);
                    });
                } else {
                    // 降级方案
                    const textArea = document.createElement('textarea');
                    textArea.value = code;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    showCopySuccess(button);
                }
            });
            
            pre.style.position = 'relative';
            pre.appendChild(button);
        });
    }

    // 显示复制成功提示
    function showCopySuccess(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M9 16.17L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
            <span>已复制</span>
        `;
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('copied');
        }, 2000);
    }

    // 初始化滚动监听
    function initScrollSpy() {
        const header = document.querySelector('.docs-header');
        
        // 确保导航栏始终可见，添加过渡动画
        if (header) {
            header.style.transition = 'all 0.3s ease';
            header.style.transform = 'translateY(0)';
        }
        
        // 可以在这里添加其他滚动相关的功能
        // 比如滚动进度条、阅读进度等
    }

    // 初始化用户体验增强功能
    function initUXEnhancements() {
        initUXToolbar();
        initFontSizeControls();
    }


    // 初始化用户体验工具栏
    function initUXToolbar() {
        // 检查是否已经存在工具栏，避免重复创建
        if (document.querySelector('.ux-toolbar')) {
            return;
        }
        
        const toolbar = document.createElement('div');
        toolbar.className = 'ux-toolbar';
        toolbar.innerHTML = `
            <button class="ux-tool back-to-top tooltip" data-tooltip="返回顶部">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
                </svg>
            </button>
            <button class="ux-tool dark-mode-toggle tooltip" data-tooltip="夜间模式">
                <svg class="sun-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,2A1,1 0 0,0 11,3V5A1,1 0 0,0 13,5V3A1,1 0 0,0 12,2M17,7A1,1 0 0,0 18,6A1,1 0 0,0 17,5A1,1 0 0,0 16,6A1,1 0 0,0 17,7M21,11A1,1 0 0,0 22,12A1,1 0 0,0 21,13A1,1 0 0,0 20,12A1,1 0 0,0 21,11M17,17A1,1 0 0,0 18,18A1,1 0 0,0 17,19A1,1 0 0,0 16,18A1,1 0 0,0 17,17M12,22A1,1 0 0,0 13,21V19A1,1 0 0,0 11,19V21A1,1 0 0,0 12,22M7,17A1,1 0 0,0 6,18A1,1 0 0,0 7,19A1,1 0 0,0 8,18A1,1 0 0,0 7,17M3,11A1,1 0 0,0 2,12A1,1 0 0,0 3,13A1,1 0 0,0 4,12A1,1 0 0,0 3,11M7,7A1,1 0 0,0 6,6A1,1 0 0,0 7,5A1,1 0 0,0 8,6A1,1 0 0,0 7,7Z"/>
                </svg>
                <svg class="moon-icon" viewBox="0 0 24 24" width="20" height="20" style="display: none;">
                    <path fill="currentColor" d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.4 6.35,17.41C9.37,20.43 14,20.54 17.33,17.97Z"/>
                </svg>
            </button>
            <button class="ux-tool font-size-toggle tooltip" data-tooltip="字体大小: 中" data-current-size="1">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/>
                </svg>
            </button>
            <button class="ux-tool reading-mode-toggle tooltip" data-tooltip="阅读模式">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>
                </svg>
            </button>
        `;
        
        document.body.appendChild(toolbar);

        // 返回顶部功能
        const backToTopBtn = toolbar.querySelector('.back-to-top');
        
        // 显示/隐藏按钮
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // 点击返回顶部
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // 夜间模式切换（优化版本）
        const darkModeBtn = toolbar.querySelector('.dark-mode-toggle');
        const sunIcon = darkModeBtn.querySelector('.sun-icon');
        const moonIcon = darkModeBtn.querySelector('.moon-icon');
        
        darkModeBtn.addEventListener('click', function() {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            
            // 添加切换动画类到关键元素
            document.body.classList.add('theme-switching');
            document.documentElement.classList.add('theme-switching');
            
            // 确保TOC区域也参与过渡
            const tocDesktop = document.querySelector('.toc-desktop');
            const tocToggle = document.querySelector('.toc-desktop-toggle');
            const docsMain = document.querySelector('.docs-main');
            
            if (tocDesktop) tocDesktop.classList.add('theme-switching');
            if (tocToggle) tocToggle.classList.add('theme-switching');
            if (docsMain) docsMain.classList.add('theme-switching');
            
            if (isDarkMode) {
                // 切换到浅色模式
                document.documentElement.removeAttribute('data-theme');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                this.classList.remove('active');
                localStorage.setItem('theme', 'light');
            } else {
                // 切换到夜间模式
                document.documentElement.setAttribute('data-theme', 'dark');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                this.classList.add('active');
                localStorage.setItem('theme', 'dark');
            }
            
            // 通知TOC更新主题
            if (window.DesktopTOC && typeof window.DesktopTOC.updateTheme === 'function') {
                window.DesktopTOC.updateTheme();
            }
            
            // 移除切换动画类
            setTimeout(() => {
                document.body.classList.remove('theme-switching');
                document.documentElement.classList.remove('theme-switching');
                if (tocDesktop) tocDesktop.classList.remove('theme-switching');
                if (tocToggle) tocToggle.classList.remove('theme-switching');
                if (docsMain) docsMain.classList.remove('theme-switching');
            }, 250);
        });

        // 恢复主题状态和UI状态
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            // 主题已经在header.php中设置，这里只需要更新UI
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            darkModeBtn.classList.add('active');
        } else {
            // 确保浅色模式的UI状态正确
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            darkModeBtn.classList.remove('active');
        }

        // 阅读模式切换
        const readingModeBtn = toolbar.querySelector('.reading-mode-toggle');
        readingModeBtn.addEventListener('click', function() {
            document.body.classList.toggle('reading-mode');
            this.classList.toggle('active');
            
            // 保存用户偏好
            const isReadingMode = document.body.classList.contains('reading-mode');
            localStorage.setItem('reading-mode', isReadingMode);
            
            // 处理桌面端TOC显示状态
            handleReadingModeTOC(isReadingMode);
        });

        // 恢复阅读模式状态
        if (localStorage.getItem('reading-mode') === 'true') {
            document.body.classList.add('reading-mode');
            readingModeBtn.classList.add('active');
            // 处理桌面端TOC显示状态
            handleReadingModeTOC(true);
        }
    }

    // 初始化字体大小控制
    function initFontSizeControls() {
        const fontSizeToggle = document.querySelector('.font-size-toggle');
        
        if (!fontSizeToggle) return;

        // 字体大小档位配置
        const fontSizes = [
            { size: 0.875, name: '小' },
            { size: 1, name: '中' },
            { size: 1.125, name: '大' },
            { size: 1.25, name: '特大' }
        ];
        
        let currentIndex = 1; // 默认为中等大小

        // 点击切换字体大小
        fontSizeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // 切换到下一个档位
            currentIndex = (currentIndex + 1) % fontSizes.length;
            const currentFont = fontSizes[currentIndex];
            
            // 应用字体大小
            setFontSize(currentFont.size);
            
            // 更新按钮状态
            updateButtonState(currentFont);
        });

        // 设置字体大小
        function setFontSize(size) {
            const contentElements = document.querySelectorAll('.article-content, .page-content, .docs-content');
            contentElements.forEach(element => {
                element.style.fontSize = size + 'rem';
            });
            
            // 设置CSS变量以保持一致性
            document.documentElement.style.setProperty('--reading-font-size', size + 'rem');
            localStorage.setItem('font-size', size);
        }
        
        // 更新按钮状态
        function updateButtonState(fontConfig) {
            fontSizeToggle.setAttribute('data-current-size', fontConfig.size);
            fontSizeToggle.setAttribute('data-tooltip', `字体大小: ${fontConfig.name}`);
        }

        // 恢复保存的字体大小
        const savedFontSize = localStorage.getItem('font-size');
        if (savedFontSize) {
            const fontSize = parseFloat(savedFontSize);
            // 找到对应的档位索引
            const foundIndex = fontSizes.findIndex(font => Math.abs(font.size - fontSize) < 0.01);
            if (foundIndex !== -1) {
                currentIndex = foundIndex;
            }
            setFontSize(fontSize);
            updateButtonState(fontSizes[currentIndex]);
        } else {
            // 设置默认字体大小
            setFontSize(fontSizes[currentIndex].size);
            updateButtonState(fontSizes[currentIndex]);
        }
    }

    // 初始化返回顶部按钮（保持向后兼容）
    function initBackToTop() {
        // 这个函数现在由 initUXEnhancements 处理
        // 保留空函数以避免破坏现有调用
    }

    // 工具函数：节流
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 工具函数：防抖
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    // 处理阅读模式下的TOC显示状态
    function handleReadingModeTOC(isReadingMode) {
        const tocDesktop = document.querySelector('.toc-desktop');
        const tocToggle = document.querySelector('.toc-desktop-toggle');
        const docsMain = document.querySelector('.docs-main');
        
        if (isReadingMode) {
            // 阅读模式：隐藏TOC并重置主内容区域
            if (tocDesktop) {
                tocDesktop.style.display = 'none';
            }
            if (tocToggle) {
                tocToggle.style.display = 'none';
            }
            if (docsMain) {
                docsMain.style.marginRight = 'auto';
            }
        } else {
            // 退出阅读模式：恢复TOC显示
            if (tocDesktop) {
                tocDesktop.style.display = '';
                // 检查TOC是否应该隐藏（根据用户之前的设置）
                const isVisible = localStorage.getItem('toc-desktop-visible');
                if (isVisible === 'false') {
                    tocDesktop.classList.add('hidden');
                } else {
                    tocDesktop.classList.remove('hidden');
                }
            }
            if (tocToggle) {
                tocToggle.style.display = '';
            }
            if (docsMain && window.innerWidth >= 1200) {
                // 根据TOC状态调整主内容区域
                const tocHidden = tocDesktop && tocDesktop.classList.contains('hidden');
                docsMain.style.marginRight = tocHidden ? '40px' : '320px';
            }
        }
    }

    // 初始化PJAX
    function initPjax() {
        if (typeof $ === 'undefined' || typeof $.pjax === 'undefined') {
            console.warn('PJAX library not loaded');
            return;
        }

        // PJAX配置
        $(document).pjax('a[href]:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([data-no-pjax])', {
            container: '#pjax-container',
            fragment: '#pjax-container',
            timeout: 8000,
            scrollTo: 0
        });

        // PJAX开始事件
        $(document).on('pjax:start', function() {
            // 显示加载指示器
            showLoadingIndicator();
            
            // 隐藏搜索结果
            hideSearchResults();
            
            // 关闭移动端侧边栏
            if (sidebar && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                if (navToggle) {
                    navToggle.classList.remove('active');
                    const lines = navToggle.querySelectorAll('.toggle-line');
                    lines.forEach(line => {
                        line.style.transform = '';
                        line.style.opacity = '';
                    });
                }
            }
        });

        // PJAX完成事件
        $(document).on('pjax:end', function() {
            // 隐藏加载指示器
            hideLoadingIndicator();
            
            // 重新初始化页面功能
            reinitializeAfterPjax();
            
            // 更新页面标题
            updatePageTitle();
            
            // 滚动到顶部
            window.scrollTo(0, 0);
        });

        // PJAX错误处理
        $(document).on('pjax:error', function(xhr, textStatus, error) {
            console.error('PJAX Error:', textStatus, error);
            hideLoadingIndicator();
            // 降级到普通页面跳转
            return true;
        });

        // PJAX超时处理
        $(document).on('pjax:timeout', function(event) {
            event.preventDefault();
            console.warn('PJAX request timeout');
            hideLoadingIndicator();
        });
    }

    // 显示加载指示器
    function showLoadingIndicator() {
        // 创建或显示加载指示器
        let loader = document.querySelector('.pjax-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'pjax-loader';
            loader.innerHTML = `
                <div class="pjax-loader-bar"></div>
                <div class="pjax-loader-spinner">
                    <div class="spinner"></div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        
        loader.classList.add('active');
        
        // 进度条动画
        const progressBar = loader.querySelector('.pjax-loader-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '70%';
            }, 100);
        }
    }

    // 隐藏加载指示器
    function hideLoadingIndicator() {
        const loader = document.querySelector('.pjax-loader');
        if (loader) {
            const progressBar = loader.querySelector('.pjax-loader-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
            
            setTimeout(() => {
                loader.classList.remove('active');
                if (progressBar) {
                    progressBar.style.width = '0%';
                }
            }, 200);
        }
    }

    // PJAX后重新初始化功能
    function reinitializeAfterPjax() {
        // 重新初始化代码高亮
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }
        
        // 重新添加代码复制按钮
        addCodeCopyButtons();
        
        // 重新初始化侧边栏高亮
        highlightCurrentPageInTree();
        
        // 重新初始化顶部导航高亮
        highlightCurrentPageInNav();
        
        // 重新获取DOM元素引用
        initElements();
        
        // 重新初始化侧边栏页面导航高亮
        highlightCurrentPageInSidebar();
        
        // 重新初始化阅读进度
        const progressBar = document.querySelector('.reading-progress-bar');
        if (progressBar) {
            updateReadingProgress();
        }
        
        // 重新初始化图片懒加载（如果有的话）
        initLazyLoading();
        
        // 重新初始化评论系统
        initComments();
        
        // 重新初始化字体大小控制
        initFontSizeControls();
        
        // 修复：只有在搜索功能开启时才重新初始化搜索
        if (document.querySelector('.nav-search')) {
            // 重新初始化搜索功能
            initElements(); // 重新获取元素引用
            initSearch();
        }
        
        // 触发自定义事件，允许其他脚本监听
        document.dispatchEvent(new CustomEvent('pjax:complete'));
    }

    // 更新页面标题
    function updatePageTitle() {
        const titleElement = document.querySelector('title');
        if (titleElement) {
            document.title = titleElement.textContent;
        }
    }

    // 更新阅读进度（PJAX后调用）
    function updateReadingProgress() {
        const content = document.querySelector('.article-content, .page-content');
        const progressBar = document.querySelector('.reading-progress-bar');
        
        if (!content || !progressBar) return;

        function updateProgress() {
            const contentRect = content.getBoundingClientRect();
            const contentHeight = content.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const contentStart = content.offsetTop;
            const contentEnd = contentStart + contentHeight;
            
            const progress = Math.max(0, Math.min(100, 
                ((scrollTop + windowHeight - contentStart) / (contentEnd - contentStart + windowHeight)) * 100
            ));
            
            progressBar.style.width = progress + '%';
        }

        // 移除旧的滚动监听器，添加新的
        window.removeEventListener('scroll', window.updateProgressHandler);
        window.updateProgressHandler = throttle(updateProgress, 16);
        window.addEventListener('scroll', window.updateProgressHandler);
        
        updateProgress();
    }

    // 初始化评论系统
    function initComments() {
        // 评论表单提交处理
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            // 移除已存在的事件监听器，防止重复绑定
            commentForm.removeEventListener('submit', handleCommentFormSubmit);
            commentForm.addEventListener('submit', handleCommentFormSubmit);
        }

        // 评论回复链接点击处理
        const replyLinks = document.querySelectorAll('.comment-reply a');
        replyLinks.forEach(link => {
            // 移除已存在的事件监听器，防止重复绑定
            link.removeEventListener('click', handleReplyLinkClick);
            link.addEventListener('click', handleReplyLinkClick);
        });
        
        // 取消回复按钮点击处理
        const cancelReplyBtn = document.getElementById('cancel-comment-reply');
        if (cancelReplyBtn) {
            // 移除已存在的事件监听器，防止重复绑定
            cancelReplyBtn.removeEventListener('click', handleCancelReplyClick);
            cancelReplyBtn.addEventListener('click', handleCancelReplyClick);
        }
        
        // 检查URL参数，处理页面加载时的回复请求
        checkUrlForReply();
    }
    
    // 处理评论表单提交
    function handleCommentFormSubmit(e) {
        // 防止默认表单提交，使用AJAX
        e.preventDefault();
        submitComment(this);
    }
    
    // 处理回复链接点击
    function handleReplyLinkClick(e) {
        e.preventDefault();
        
        // 获取回复链接中的replyTo参数
        const href = this.getAttribute('href');
        const coid = this.getAttribute('data-coid');
        
        // 优先使用data-coid属性
        let replyTo = coid;
        if (!replyTo && href) {
            try {
                const url = new URL(href, window.location.origin);
                replyTo = url.searchParams.get('replyTo');
            } catch (err) {
                console.error('Error parsing reply link:', err);
            }
        }
        
        // 如果还是没有replyTo，尝试从onclick属性中提取
        if (!replyTo) {
            const onclickAttr = this.getAttribute('onclick');
            if (onclickAttr) {
                const match = onclickAttr.match(/TypechoComment\.reply\([^,]+,\s*(\d+)\)/);
                if (match && match[1]) {
                    replyTo = match[1];
                }
            }
        }
        
        if (replyTo) {
            // 确保每次都正确设置父级评论ID
            const parentField = document.getElementById('comment-parent');
            if (parentField) {
                parentField.value = replyTo;
            }
            
            // 显示取消回复按钮
            const cancelReplyBtn = document.getElementById('cancel-comment-reply');
            if (cancelReplyBtn) {
                cancelReplyBtn.style.display = 'inline-block';
            }
            
            // 更新表单标题显示正在回复哪个评论
            const formTitle = document.querySelector('.comment-form-title');
            if (formTitle) {
                formTitle.textContent = '回复评论 #' + replyTo;
            }
            
            // 滚动到评论表单
            document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
            
            // 更新URL但不跳转
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('replyTo', replyTo);
            window.history.replaceState({}, document.title, currentUrl);
        }
    }
    
    // 处理取消回复点击
    function handleCancelReplyClick() {
        // 清空父级评论ID
        const parentField = document.getElementById('comment-parent');
        if (parentField) {
            parentField.value = '';
        }
        
        // 恢复表单标题
        const formTitle = document.querySelector('.comment-form-title');
        if (formTitle) {
            formTitle.textContent = '添加新评论';
        }
        
        // 隐藏取消回复按钮
        this.style.display = 'none';
        
        // 清除URL中的replyTo参数
        const url = new URL(window.location);
        url.searchParams.delete('replyTo');
        // 同时清除URL中的锚点
        window.history.replaceState({}, document.title, url.pathname + url.search);
        
        // 滚动到评论表单
        document.getElementById('comment-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    // 检查URL参数，处理页面加载时的回复请求
    function checkUrlForReply() {
        const urlParams = new URLSearchParams(window.location.search);
        const replyTo = urlParams.get('replyTo');
        
        if (replyTo) {
            // 设置父级评论ID
            const parentField = document.getElementById('comment-parent');
            if (parentField) {
                parentField.value = replyTo;
            }
            
            // 显示取消回复按钮
            const cancelReplyBtn = document.getElementById('cancel-comment-reply');
            if (cancelReplyBtn) {
                cancelReplyBtn.style.display = 'inline-block';
            }
            
            // 滚动到评论表单
            setTimeout(() => {
                const commentForm = document.getElementById('comment-form');
                if (commentForm) {
                    commentForm.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    // 提交评论（AJAX方式）
    function submitComment(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(html => {
            // 替换整个评论区域
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newComments = tempDiv.querySelector('#comments');
            
            if (newComments) {
                document.getElementById('comments').innerHTML = newComments.innerHTML;
                // 重新初始化评论系统
                initComments();
                // 清空表单
                form.reset();
                
                // 特别清空姓名、邮箱和网站字段（因为Typecho的remember机制会重新填充这些字段）
                const authorField = document.getElementById('author');
                const mailField = document.getElementById('mail');
                const urlField = document.getElementById('url');
                
                if (authorField) authorField.value = '';
                if (mailField) mailField.value = '';
                if (urlField) urlField.value = '';
                
                // 清理评论回复相关状态
                const parentField = document.getElementById('comment-parent');
                if (parentField) {
                    parentField.value = '';
                }
                
                // 隐藏取消回复按钮
                const cancelReplyBtn = document.getElementById('cancel-comment-reply');
                if (cancelReplyBtn) {
                    cancelReplyBtn.style.display = 'none';
                }
                
                // 恢复表单标题
                const formTitle = document.querySelector('.comment-form-title');
                if (formTitle) {
                    formTitle.textContent = '添加新评论';
                }
                
                // 清除URL中的replyTo参数
                const url = new URL(window.location);
                url.searchParams.delete('replyTo');
                // 同时清除URL中的锚点
                window.history.replaceState({}, document.title, url.pathname + url.search);
                
                // 滚动到评论区域顶部
                const commentsSection = document.getElementById('comments');
                if (commentsSection) {
                    commentsSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // 显示成功消息
                showMessage('评论提交成功！', 'success');
            }
        })
        .catch(error => {
            showMessage('评论提交失败，请重试。', 'error');
            console.error('Comment submission error:', error);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        });
    }

    // 显示消息提示
    function showMessage(message, type = 'info') {
        // 移除旧的消息
        const oldMessage = document.getElementById('comment-message');
        if (oldMessage) oldMessage.remove();

        const messageDiv = document.createElement('div');
        messageDiv.id = 'comment-message';
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = 'padding: 10px; margin: 10px 0; border-radius: 4px;';

        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
            messageDiv.style.border = '1px solid #c3e6cb';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
        } else {
            messageDiv.style.backgroundColor = '#d1ecf1';
            messageDiv.style.color = '#0c5460';
            messageDiv.style.border = '1px solid #bee5eb';
        }

        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.parentNode.insertBefore(messageDiv, commentForm);
        }
    }

    // 初始化图片懒加载（可选功能）
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

})();