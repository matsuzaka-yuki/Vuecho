<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="<?php $this->options->charset(); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php $this->archiveTitle(array(
        'category'  =>  _t('分类 %s 下的文档'),
        'search'    =>  _t('包含关键字 %s 的文档'),
        'tag'       =>  _t('标签 %s 下的文档'),
        'author'    =>  _t('%s 发布的文档')
    ), '', ' - '); ?><?php $this->options->title(); ?></title>
    
    <!-- SEO Meta -->
    <meta name="description" content="<?php if ($this->is('single')): ?><?php $this->excerpt(150, '...'); ?><?php else: ?><?php $this->options->description(); ?><?php endif; ?>">
    <meta name="keywords" content="<?php if ($this->is('single')): ?><?php $this->tags(',', false); ?><?php else: ?><?php $this->options->keywords(); ?><?php endif; ?>">
    
    <!-- Open Graph -->
    <meta property="og:title" content="<?php $this->title(); ?>">
    <meta property="og:description" content="<?php $this->excerpt(150, '...'); ?>">
    <meta property="og:type" content="article">
    <meta property="og:url" content="<?php $this->permalink(); ?>">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="<?php $this->options->themeUrl('assets/favicon.ico'); ?>">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/style.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/prism.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/toc-desktop.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/toc-mobile.css'); ?>">
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/code-enhancements.css'); ?>">
    
    <!-- 首页样式 -->
    <?php if ($this->is('index')): ?>
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/css/homepage.css'); ?>">
    <?php endif; ?>
    
    <!-- Font Awesome -->
    <?php if (!isset($this->options->enableFontAwesome) || $this->options->enableFontAwesome !== '0'): ?>
    <link rel="stylesheet" href="<?php $this->options->themeUrl('assets/fontawesome/all.min.css'); ?>">
    <?php endif; ?>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- PJAX Library -->
    <script src="<?php $this->options->themeUrl('assets/js/jquery.min.js'); ?>"></script>
    <script src="<?php $this->options->themeUrl('assets/js/jquery.pjax.min.js'); ?>"></script>
    
    <!-- 防止夜间模式闪白的内联脚本 -->
    <script>
        (function() {
            // 立即检查并应用保存的主题，防止闪白
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                // 立即设置暗色背景，防止闪白
                document.documentElement.style.backgroundColor = '#0f172a';
                document.documentElement.style.color = '#e2e8f0';
            } else {
                // 确保浅色模式的背景色
                document.documentElement.style.backgroundColor = '#ffffff';
                document.documentElement.style.color = '#2c3e50';
            }
            
            // 防止页面切换时的闪烁
            document.documentElement.style.transition = 'none';
            
            // 页面加载完成后恢复过渡效果并清理内联样式
            window.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    document.documentElement.style.transition = '';
                    // 清理内联样式，让CSS变量接管
                    document.documentElement.style.backgroundColor = '';
                    document.documentElement.style.color = '';
                }, 100);
            });
        })();
    </script>
    
    <?php $this->header(); ?>
</head>
<body class="<?php if ($this->is('index')): ?>home<?php elseif ($this->is('post')): ?>post<?php elseif ($this->is('page')): ?>page<?php endif; ?>">
    
    <!-- 顶部导航 -->
    <header class="docs-header">
        <nav class="docs-nav">
            <div class="nav-container">
                <!-- Logo和站点标题 -->
                <div class="nav-brand">
                    <a href="<?php $this->options->siteUrl(); ?>" class="brand-link">
                        <?php if ($this->options->logoUrl): ?>
                            <img src="<?php $this->options->logoUrl(); ?>" alt="<?php $this->options->title(); ?>" class="brand-logo">
                        <?php endif; ?>
                        <span class="brand-title"><?php 
                            $headerTitle = $this->options->headerTitle;
                            echo $headerTitle ? $headerTitle : 'Vuecho';
                        ?></span>
                    </a>
                </div>
                
                <!-- 主导航菜单 -->
                <div class="nav-menu">
                    <ul class="nav-links">
                        <li><a href="<?php $this->options->siteUrl(); ?>" <?php if ($this->is('index')): ?>class="active"<?php endif; ?>>首页</a></li>
                        <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                        <?php while($pages->next()): ?>
                            <li><a href="<?php $pages->permalink(); ?>" <?php if ($this->is('page', $pages->slug)): ?>class="active"<?php endif; ?>><?php $pages->title(); ?></a></li>
                        <?php endwhile; ?>
                    </ul>
                </div>
                
                <!-- 搜索框 -->
                <?php if (!isset($this->options->enableSearch) || $this->options->enableSearch !== '0'): ?>
                <div class="nav-search<?php if ($this->is('index')): ?> homepage-search<?php endif; ?>">
                    <form class="search-form" method="post" action="<?php $this->options->siteUrl(); ?>" role="search">
                        <input type="search" name="s" class="search-input" placeholder="搜索文档..." value="<?php $this->archiveSlug(); ?>">
                        <button type="submit" class="search-btn">
                            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                    </form>
                </div>
                <?php endif; ?>
                
                <!-- 移动端菜单按钮 -->
                <?php if (!$this->is('index')): ?>
                <button class="nav-toggle" id="nav-toggle">
                    <span class="toggle-line"></span>
                    <span class="toggle-line"></span>
                    <span class="toggle-line"></span>
                </button>
                <?php endif; ?>
            </div>
        </nav>
    </header>