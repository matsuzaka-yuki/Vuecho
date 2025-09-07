<?php
/**
 * 归档页面模板
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
            <div class="archive-header">
                <h1 class="archive-title">
                    <?php $this->archiveTitle(array(
                        'category'  =>  _t('分类 "%s" 下的文章'),
                        'search'    =>  _t('包含关键字 "%s" 的文章'),
                        'tag'       =>  _t('标签 "%s" 下的文章'),
                        'author'    =>  _t('%s 发布的文章')
                    ), '', ''); ?>
                </h1>
                
                <?php if ($this->getTotal() > 0): ?>
                <div class="archive-meta">
                    <span class="archive-count">共找到 <?php echo $this->getTotal(); ?> 篇文章</span>
                </div>
                <?php endif; ?>
            </div>
            
            <?php if ($this->have()): ?>
            <div class="archive-list">
                <?php while($this->next()): ?>
                <article class="archive-item">
                    <header class="item-header">
                        <h2 class="item-title">
                            <a href="<?php $this->permalink() ?>" class="item-link"><?php $this->title() ?></a>
                        </h2>
                        <div class="item-meta">
                            <time class="item-date"><?php $this->date('Y年m月d日'); ?></time>
                            <?php if ($this->category): ?>
                                <span class="meta-separator">·</span>
                                <a href="<?php $this->category('', false); ?>" class="item-category"><?php $this->category(); ?></a>
                            <?php endif; ?>
                            <span class="meta-separator">·</span>
                            <span class="reading-time"><?php echo getReadingTime($this->content); ?> 分钟阅读</span>
                        </div>
                    </header>
                    
                    <div class="item-excerpt">
                        <?php echo getExcerpt($this, 200); ?>
                    </div>
                    
                    <?php if ($this->tags): ?>
                    <footer class="item-footer">
                        <div class="item-tags">
                            <?php $this->tags('<span class="tag">', true, '</span>'); ?>
                        </div>
                    </footer>
                    <?php endif; ?>
                </article>
                <?php endwhile; ?>
            </div>
            
            <!-- 分页导航 -->
            <nav class="archive-pagination">
                <?php $this->pageNav('上一页', '下一页', 3, '...', array('wrapTag' => 'ul', 'wrapClass' => 'pagination', 'itemTag' => 'li', 'textTag' => 'a', 'currentClass' => 'active', 'prevClass' => 'prev', 'nextClass' => 'next')); ?>
            </nav>
            
            <?php else: ?>
            <div class="archive-empty">
                <div class="empty-icon">
                    <svg viewBox="0 0 24 24" width="64" height="64">
                        <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <h2 class="empty-title">暂无内容</h2>
                <p class="empty-description">
                    <?php if ($this->is('search')): ?>
                        没有找到包含关键字 "<?php $this->archiveSlug(); ?>" 的文档，请尝试其他关键字。
                    <?php else: ?>
                        该分类下暂时没有文档。
                    <?php endif; ?>
                </p>
                <a href="<?php $this->options->siteUrl(); ?>" class="empty-link">返回首页</a>
            </div>
            <?php endif; ?>
        </div>
    </main>


</div>

<?php $this->need('footer.php'); ?>