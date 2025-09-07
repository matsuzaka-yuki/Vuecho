<?php
/**
 * 页面模板
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
        <div id="pjax-container" class="docs-content">
            <article class="docs-page">
                <header class="page-header">
                    <h1 class="page-title"><?php $this->title() ?></h1>
                    <div class="page-meta">
                        <time class="page-date">更新于 <?php $this->date('Y年m月d日'); ?></time>
                    </div>
                </header>
                
                <div class="page-content">
                    <?php $this->content(); ?>
                </div>
                
                <?php if ($this->user->hasLogin()): ?>
                <footer class="page-footer">
                    <div class="page-edit">
                        <a href="<?php $this->options->adminUrl(); ?>write-page.php?cid=<?php echo $this->cid; ?>" class="edit-link">
                            <svg class="edit-icon" viewBox="0 0 24 24" width="16" height="16">
                                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            编辑此页
                        </a>
                    </div>
                </footer>
                <?php endif; ?>
            </article>
            
            <!-- 评论区域 -->
            <?php $this->need('comments.php'); ?>
        </div>
    </main>


</div>

<?php $this->need('footer.php'); ?>