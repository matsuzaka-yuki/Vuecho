/**
 * 代码块增强功能
 * 包含行号、语言标签等功能
 */

(function() {
    'use strict';

    // 为代码块添加行号
    function addLineNumbers() {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(pre => {
            if (!pre.classList.contains('line-numbers')) {
                pre.classList.add('line-numbers');
            }
        });
    }

    // 添加语言标签
    function addLanguageLabels() {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(pre => {
            const className = pre.className;
            const match = className.match(/language-(\w+)/);
            if (match && !pre.hasAttribute('data-language')) {
                const language = match[1];
                const languageNames = {
                    'js': 'JavaScript',
                    'javascript': 'JavaScript',
                    'ts': 'TypeScript',
                    'typescript': 'TypeScript',
                    'html': 'HTML',
                    'css': 'CSS',
                    'scss': 'SCSS',
                    'sass': 'Sass',
                    'php': 'PHP',
                    'python': 'Python',
                    'py': 'Python',
                    'java': 'Java',
                    'cpp': 'C++',
                    'c': 'C',
                    'csharp': 'C#',
                    'go': 'Go',
                    'rust': 'Rust',
                    'bash': 'Bash',
                    'shell': 'Shell',
                    'json': 'JSON',
                    'xml': 'XML',
                    'yaml': 'YAML',
                    'yml': 'YAML',
                    'sql': 'SQL',
                    'markdown': 'Markdown',
                    'md': 'Markdown'
                };
                
                const displayName = languageNames[language] || language.toUpperCase();
                pre.setAttribute('data-language', displayName);
            }
        });
    }

    // 代码块折叠功能
    function addCodeFolding() {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) return;
            
            const lines = code.textContent.split('\n');
            if (lines.length > 20) { // 超过20行的代码块添加折叠功能
                const wrapper = document.createElement('div');
                wrapper.className = 'code-block-wrapper';
                
                const header = document.createElement('div');
                header.className = 'code-block-header';
                
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'code-fold-toggle';
                toggleBtn.innerHTML = `
                    <svg class="fold-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                    </svg>
                    <span class="fold-text">折叠代码</span>
                `;
                
                toggleBtn.addEventListener('click', function() {
                    const isCollapsed = pre.classList.contains('collapsed');
                    if (isCollapsed) {
                        pre.classList.remove('collapsed');
                        toggleBtn.querySelector('.fold-text').textContent = '折叠代码';
                        toggleBtn.classList.remove('collapsed');
                    } else {
                        pre.classList.add('collapsed');
                        toggleBtn.querySelector('.fold-text').textContent = '展开代码';
                        toggleBtn.classList.add('collapsed');
                    }
                });
                
                header.appendChild(toggleBtn);
                
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(header);
                wrapper.appendChild(pre);
            }
        });
    }

    // 代码块全屏查看
    function addFullscreenView() {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(pre => {
            const toolbar = pre.parentNode.querySelector('.toolbar');
            if (toolbar) {
                const fullscreenBtn = document.createElement('div');
                fullscreenBtn.className = 'toolbar-item';
                fullscreenBtn.innerHTML = `
                    <button class="fullscreen-btn" title="全屏查看">
                        <svg viewBox="0 0 24 24" width="14" height="14">
                            <path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </button>
                `;
                
                const button = fullscreenBtn.querySelector('.fullscreen-btn');
                button.addEventListener('click', function() {
                    openFullscreenCode(pre);
                });
                
                toolbar.appendChild(fullscreenBtn);
            }
        });
    }

    // 打开全屏代码查看
    function openFullscreenCode(pre) {
        const modal = document.createElement('div');
        modal.className = 'code-fullscreen-modal';
        modal.innerHTML = `
            <div class="fullscreen-overlay">
                <div class="fullscreen-content">
                    <div class="fullscreen-header">
                        <h3>代码查看</h3>
                        <button class="fullscreen-close" title="关闭">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                    <div class="fullscreen-code">
                        ${pre.outerHTML}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.classList.add('fullscreen-active');
        
        // 关闭按钮事件
        const closeBtn = modal.querySelector('.fullscreen-close');
        closeBtn.addEventListener('click', closeFullscreen);
        
        // 点击遮罩关闭
        const overlay = modal.querySelector('.fullscreen-overlay');
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeFullscreen();
            }
        });
        
        // ESC键关闭
        function handleEscape(e) {
            if (e.key === 'Escape') {
                closeFullscreen();
            }
        }
        
        document.addEventListener('keydown', handleEscape);
        
        function closeFullscreen() {
            document.body.removeChild(modal);
            document.body.classList.remove('fullscreen-active');
            document.removeEventListener('keydown', handleEscape);
        }
        
        // 重新高亮全屏中的代码
        if (typeof Prism !== 'undefined') {
            Prism.highlightAllUnder(modal);
        }
    }

    // 初始化所有代码增强功能
    function initCodeEnhancements() {
        addLineNumbers();
        addLanguageLabels();
        addCodeFolding();
        addFullscreenView();
    }

    // 导出函数供外部使用
    window.CodeEnhancements = {
        addLineNumbers: addLineNumbers,
        addLanguageLabels: addLanguageLabels,
        addCodeFolding: addCodeFolding,
        addFullscreenView: addFullscreenView,
        init: initCodeEnhancements
    };

    // 自动初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCodeEnhancements);
    } else {
        initCodeEnhancements();
    }

    // PJAX支持
    document.addEventListener('pjax:complete', initCodeEnhancements);

})();