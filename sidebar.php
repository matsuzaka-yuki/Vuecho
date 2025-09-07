<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>

<div class="sidebar-nav">
    <!-- 页面导航 -->
    <div class="sidebar-section">
        <h3 class="sidebar-title">
            <svg class="section-icon" viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            页面导航
        </h3>
        <ul class="page-nav-list">
            <li><a href="<?php $this->options->siteUrl(); ?>" <?php if ($this->is('index')): ?>class="active"<?php endif; ?>>首页</a></li>
            <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
            <?php while($pages->next()): ?>
                <li><a href="<?php $pages->permalink(); ?>" <?php if ($this->is('page', $pages->slug)): ?>class="active"<?php endif; ?>><?php $pages->title(); ?></a></li>
            <?php endwhile; ?>
        </ul>
    </div>
    
    <!-- 分割线 -->
    <hr class="sidebar-divider">
    
    <!-- 文档分类导航 -->
    <div class="sidebar-section">
        <h3 class="sidebar-title">
            <?php $categoryIcon = getCategoryIcon(null); ?>
            <?php if ($categoryIcon): ?>
                <i class="<?php echo $categoryIcon; ?>" aria-hidden="true"></i>
            <?php else: ?>
                <svg class="section-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                </svg>
            <?php endif; ?>
            文档分类
        </h3>
        <div class="docs-tree">
            <?php $this->widget('Widget_Metas_Category_List')->to($categories); ?>
            <?php if ($categories->have()): ?>
                <ul class="tree-root">
                    <?php while($categories->next()): ?>
                        <?php 
                        // 获取分类下的文章
                        $posts = $this->widget('Widget_Archive@category_' . $categories->mid, 'pageSize=100&type=category', 'mid=' . $categories->mid);
                        $hasArticles = $posts->have();
                        $isCurrentCategory = $this->is('category', $categories->slug);
                        $isCurrentPost = false;
                        
                        // 检查当前文章是否属于这个分类
                        if ($this->is('post')) {
                            $currentCategory = $this->category;
                            // 使用ob_start和ob_get_clean来捕获输出
                            ob_start();
                            $categories->name();
                            $categoryName = ob_get_clean();
                            
                            if ($currentCategory && $categoryName && strpos($currentCategory, $categoryName) !== false) {
                                $isCurrentPost = true;
                            }
                        }
                        
                        $shouldExpand = $isCurrentCategory || $isCurrentPost;
                        ?>
                        <li class="tree-node <?php if ($isCurrentCategory): ?>current-category<?php endif; ?> <?php if ($shouldExpand): ?>expanded<?php endif; ?>">
                            <div class="node-content">
                                <?php if ($hasArticles): ?>
                                    <button class="node-toggle" type="button" aria-expanded="<?php echo $shouldExpand ? 'true' : 'false'; ?>" style="pointer-events: none; opacity: 0.5;">
                                        <svg class="toggle-icon" viewBox="0 0 24 24" width="14" height="14">
                                            <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                                        </svg>
                                    </button>
                                <?php else: ?>
                                    <span class="node-spacer"></span>
                                <?php endif; ?>
                                
                                <div class="node-label">
                                    <?php 
                                    $categoryData = array(
                                        'name' => $categories->name,
                                        'description' => $categories->description
                                    );
                                    $categoryIcon = getCategoryIcon($categoryData); 
                                    ?>
                                    <?php if ($categoryIcon): ?>
                                        <i class="<?php echo $categoryIcon; ?>" aria-hidden="true"></i>
                                    <?php else: ?>
                                        <svg class="node-icon" viewBox="0 0 24 24" width="16" height="16">
                                            <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                                        </svg>
                                    <?php endif; ?>
                                    <?php 
                                    // 使用ob_start和ob_get_clean来捕获输出
                                    ob_start();
                                    $categories->permalink();
                                    $categoryPermalink = ob_get_clean();
                                    
                                    ob_start();
                                    $categories->name();
                                    $categoryName = ob_get_clean();
                                    
                                    ob_start();
                                    $categories->count();
                                    $categoryCount = ob_get_clean();
                                    ?>
                                    <a href="<?php echo $categoryPermalink; ?>" class="node-link <?php if ($isCurrentCategory): ?>active<?php endif; ?>">
                                        <?php echo $categoryName; ?>
                                    </a>
                                    <span class="node-count"><?php echo $categoryCount; ?></span>
                                </div>
                            </div>
                            
                            <?php if ($hasArticles): ?>
                                <ul class="tree-children" style="<?php if (!$shouldExpand): ?>display: none;<?php endif; ?>">
                                    <?php $posts->rewind(); ?>
                                    <?php while($posts->next()): ?>
                                        <li class="tree-leaf <?php if ($this->is('post') && $posts->cid == $this->cid): ?>current-post<?php endif; ?>">
                                            <div class="leaf-content">
                                                <span class="leaf-spacer"></span>
                                                <div class="leaf-label">
                                                    <?php $postIcon = getPostIcon($posts); ?>
                                                    <?php if ($postIcon): ?>
                                                        <i class="<?php echo $postIcon; ?>" aria-hidden="true"></i>
                                                    <?php else: ?>
                                                        <svg class="leaf-icon" viewBox="0 0 24 24" width="14" height="14">
                                                            <path fill="currentColor" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                                        </svg>
                                                    <?php endif; ?>
                                                    <?php 
                                                    // 使用ob_start和ob_get_clean来捕获输出
                                                    ob_start();
                                                    $posts->permalink();
                                                    $postPermalink = ob_get_clean();
                                                    
                                                    ob_start();
                                                    $posts->title();
                                                    $postTitle = ob_get_clean();
                                                    ?>
                                                    <a href="<?php echo $postPermalink; ?>" class="leaf-link <?php if ($this->is('post') && $posts->cid == $this->cid): ?>active<?php endif; ?>">
                                                        <?php echo $postTitle; ?>
                                                    </a>
                                                </div>
                                            </div>
                                        </li>
                                    <?php endwhile; ?>
                                </ul>
                            <?php endif; ?>
                        </li>
                    <?php endwhile; ?>
                </ul>
            <?php else: ?>
                <div class="tree-empty">
                    <svg class="empty-icon" viewBox="0 0 24 24" width="48" height="48">
                        <path fill="currentColor" d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/>
                    </svg>
                    <p>暂无文档分类</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
    

</div>