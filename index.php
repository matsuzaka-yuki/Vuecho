<?php 
/**
 * VuePress风格文档主题，帮助你快速构建一个好看的文档，让用户理解产品本身！
 * 
 * @package Vuecho
 * @author 松板有希
 * @version 1.2.0
 * @link https://github.com/matsuzaka-yuki/
 */

if (!defined('__TYPECHO_ROOT_DIR__')) exit;
$this->need('header.php');
?>

<?php 
// 检查是否启用首页模式且当前为首页
$enableHomepage = $this->options->enableHomepage;
if ($this->is('index')) {
    if (isset($enableHomepage) && $enableHomepage === '0') {
        // 首页模式已关闭，重定向到指定链接
        $redirectUrl = $this->options->homepageRedirectUrl;
        $redirectUrl = $redirectUrl ? $redirectUrl : '/archives.html';
        header('Location: ' . $redirectUrl);
        exit;
    }
}
if ($this->is('index') && (!isset($enableHomepage) || $enableHomepage !== '0')): 
?>

<!-- VuePress风格首页 -->
<div class="homepage-container">
    <!-- Hero区域 -->
    <section class="hero-section">
        <div class="hero-container">
            <?php 
            $homepageLogo = $this->options->homepageLogo;
            if (empty($homepageLogo)) {
                $homepageLogo = $this->options->themeUrl . '/assets/logo/hero.png';
            }
            ?>
            <div class="hero-logo">
                <img src="<?php echo $homepageLogo; ?>" alt="Logo" class="logo-image">
            </div>
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">
                        <?php 
                        $projectTitle = $this->options->projectTitle;
                        echo $projectTitle ? $projectTitle : $this->options->title();
                        ?>
                    </h1>
                    <p class="hero-description">
                        <?php 
                        $projectDescription = $this->options->projectDescription;
                        echo $projectDescription ? $projectDescription : '一个简洁、现代的文档主题';
                        ?>
                    </p>
                    <div class="hero-actions">
                        <a href="<?php 
                            $quickStartLink = $this->options->quickStartLink;
                            echo $quickStartLink ? $quickStartLink : '/index.php/start-page.html';
                        ?>" class="btn btn-primary">
                            <?php 
                            $quickStartText = $this->options->quickStartText;
                            echo $quickStartText ? $quickStartText : '快速上手';
                            ?>
                        </a>
                        <a href="<?php 
                            $learnMoreLink = $this->options->learnMoreLink;
                            echo $learnMoreLink ? $learnMoreLink : 'https://github.com/matsuzaka-yuki/Vuecho';
                        ?>" class="btn btn-secondary">
                            <?php 
                            $learnMoreIcon = $this->options->learnMoreIcon;
                            if ($learnMoreIcon) {
                                echo '<i class="' . $learnMoreIcon . '"></i> ';
                            }
                            $learnMoreText = $this->options->learnMoreText;
                            echo $learnMoreText ? $learnMoreText : '了解更多';
                            ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 特性展示区域 -->
    <section class="features-section">
        <div class="features-container">
            <div class="features-grid">
                <?php 
                $projectFeatures = $this->options->projectFeatures;
                if ($projectFeatures) {
                    $features = explode("\n", $projectFeatures);
                    foreach ($features as $feature) {
                        if (trim($feature)) {
                            $parts = explode('|', $feature, 2);
                            $title = trim($parts[0]);
                            $description = isset($parts[1]) ? trim($parts[1]) : '';
                            if ($title) {
                                echo '<div class="feature-item">';
                                echo '<h3 class="feature-title">' . htmlspecialchars($title) . '</h3>';
                                if ($description) {
                                    echo '<p class="feature-description">' . htmlspecialchars($description) . '</p>';
                                }
                                echo '</div>';
                            }
                        }
                    }
                } else {
                    // 默认特性
                    echo '<div class="feature-item">';
                    echo '<h3 class="feature-title">简洁设计</h3>';
                    echo '<p class="feature-description">现代化的界面设计，专注内容展示</p>';
                    echo '</div>';
                    echo '<div class="feature-item">';
                    echo '<h3 class="feature-title">响应式布局</h3>';
                    echo '<p class="feature-description">完美适配各种设备和屏幕尺寸</p>';
                    echo '</div>';
                    echo '<div class="feature-item">';
                    echo '<h3 class="feature-title">快速搜索</h3>';
                    echo '<p class="feature-description">内置全文搜索功能，快速定位内容</p>';
                    echo '</div>';
                }
                ?>
            </div>
        </div>
    </section>
</div>

<?php else: ?>

<!-- 原有的文档列表页面 -->
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
            <?php if ($this->have()): ?>
                <?php while($this->next()): ?>
                    <article class="docs-article">
                        <header class="article-header">
                            <h1 class="article-title">
                                <?php $this->title() ?>
                            </h1>
                            <div class="article-meta">
                                <time class="article-date"><?php $this->date('Y-m-d'); ?></time>
                                <span class="article-category">
                                    <?php 
                                    $categories = $this->categories;
                                    if ($categories) {
                                        $categoryList = [];
                                        
                                        // 检查是否为Widget对象
                                        if (is_object($categories) && method_exists($categories, 'next')) {
                                            while ($categories->next()) {
                                                $categoryIcon = getCategoryIcon($categories);
                                                $iconHtml = $categoryIcon ? '<i class="' . $categoryIcon . '" aria-hidden="true"></i> ' : '';
                                                $categoryList[] = $iconHtml . '<a href="' . $categories->permalink . '">' . $categories->name . '</a>';
                                            }
                                        } else {
                                            // 使用传统的category方法
                                            $this->category(',', true, 'none');
                                        }
                                        
                                        if (!empty($categoryList)) {
                                            echo implode(', ', $categoryList);
                                        }
                                    }
                                    ?>
                                </span>
                                <?php if ($this->tags): ?>
                                    <div class="article-tags">
                                        <?php $this->tags(', ', true, 'none'); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </header>
                        
                        <div class="article-content">
                            <?php $this->content(); ?>
                        </div>
                        
                        <footer class="article-footer">
                            <div class="article-nav">
                                <?php $this->thePrev('上一篇: %s'); ?>
                                <?php $this->theNext('下一篇: %s'); ?>
                            </div>
                        </footer>
                    </article>
                <?php endwhile; ?>
            <?php else: ?>
                <div class="docs-empty">
                    <h2>暂无内容</h2>
                    <p>该分类下暂时没有文档内容。</p>
                </div>
            <?php endif; ?>
        </div>
    </main>
</div>

<?php endif; ?>

<?php $this->need('footer.php'); ?>