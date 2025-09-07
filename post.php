<?php
/**
 * 文章页面模板
 */
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
?>

<div class="docs-container">
    <!-- 侧边栏 -->
    <aside class="docs-sidebar">
        <div class="sidebar-content">
            <?php $this->need('sidebar.php'); ?>
        </div>
    </aside>

    <!-- 主内容区 -->
    <main class="docs-main">
        <div class="docs-content" id="pjax-container">
            <article class="docs-article">
                <header class="article-header">
                    <h1 class="article-title"><?php $this->title() ?></h1>
                    <div class="article-meta">
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            <time class="article-date"><?php $this->date('Y年m月d日'); ?></time>
                        </div>
                        
                        <?php if ($this->category): ?>
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                            </svg>
                            <a href="<?php $this->category('', false); ?>" class="article-category"><?php $this->category(); ?></a>
                        </div>
                        <?php endif; ?>
                        
                        <div class="meta-item">
                            <svg class="meta-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            <span class="reading-time">约 <?php echo getReadingTime($this->content); ?> 分钟阅读</span>
                        </div>
                        
                        <?php if ($this->tags): ?>
                        <div class="article-tags">
                            <?php $this->tags('<span class="tag">', true, '</span>'); ?>
                        </div>
                        <?php endif; ?>
                    </div>
                </header>
                
                <div class="article-content">
                    <?php $this->content(); ?>
                </div>
                
                <footer class="article-footer">
                    <!-- 文章导航 -->
                    <?php 
                    $adjacentPosts = getAdjacentPosts($this);
                    if ($adjacentPosts['prev'] || $adjacentPosts['next']): 
                    ?>
                    <nav class="article-nav">
                        <?php if ($adjacentPosts['prev']): ?>
                        <div class="nav-prev">
                            <a href="<?php echo Typecho_Router::url('post', $adjacentPosts['prev'], Helper::options()->index); ?>" class="nav-link">
                                <svg class="nav-icon" viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                </svg>
                                <div class="nav-text">
                                    <span class="nav-label">上一篇</span>
                                    <span class="nav-title"><?php echo htmlspecialchars($adjacentPosts['prev']['title'], ENT_QUOTES, 'UTF-8'); ?></span>
                                </div>
                            </a>
                        </div>
                        <?php else: ?>
                        <div class="nav-prev nav-placeholder"></div>
                        <?php endif; ?>
                        
                        <?php if ($adjacentPosts['next']): ?>
                        <div class="nav-next">
                            <a href="<?php echo Typecho_Router::url('post', $adjacentPosts['next'], Helper::options()->index); ?>" class="nav-link">
                                <div class="nav-text">
                                    <span class="nav-label">下一篇</span>
                                    <span class="nav-title"><?php echo htmlspecialchars($adjacentPosts['next']['title'], ENT_QUOTES, 'UTF-8'); ?></span>
                                </div>
                                <svg class="nav-icon" viewBox="0 0 24 24" width="16" height="16">
                                    <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                </svg>
                            </a>
                        </div>
                        <?php else: ?>
                        <div class="nav-next nav-placeholder"></div>
                        <?php endif; ?>
                    </nav>
                    <?php endif; ?>
                    
                    <!-- 编辑链接 -->
                    <?php if ($this->user->hasLogin()): ?>
                    <div class="article-edit">
                        <a href="<?php $this->options->adminUrl(); ?>write-post.php?cid=<?php echo $this->cid; ?>" class="edit-link">
                            <svg class="edit-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            编辑此页
                        </a>
                    </div>
                    <?php endif; ?>
                </footer>
            </article>
            
            <!-- 评论区域 -->
            <?php $this->need('comments.php'); ?>
        </div>
    </main>


</div>

<?php $this->need('footer.php'); ?>