<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;



/**
 * VuePress Docs 主题函数
 */

/**
 * 主题配置
 */
function themeConfig($form) {
    // Logo设置
    $logoUrl = new Typecho_Widget_Helper_Form_Element_Text('logoUrl', NULL, NULL, _t('站点Logo'), _t('输入Logo图片地址，留空则只显示文字标题'));
    $form->addInput($logoUrl);
    
    // 顶栏标题设置
    $headerTitle = new Typecho_Widget_Helper_Form_Element_Text('headerTitle', NULL, 'Vuecho', _t('顶栏标题'), _t('自定义顶部导航栏显示的标题'));
    $form->addInput($headerTitle);
    
    // 首页Logo设置
    $homepageLogo = new Typecho_Widget_Helper_Form_Element_Text('homepageLogo', NULL, NULL, _t('首页Logo'), _t('首页Hero区域显示的Logo图片地址'));
    $form->addInput($homepageLogo);
    
    // 社交链接
    $socialGithub = new Typecho_Widget_Helper_Form_Element_Text('socialGithub', NULL, NULL, _t('GitHub地址'), _t('输入GitHub主页地址'));
    $form->addInput($socialGithub);
    
    $socialEmail = new Typecho_Widget_Helper_Form_Element_Text('socialEmail', NULL, NULL, _t('联系邮箱'), _t('输入联系邮箱地址'));
    $form->addInput($socialEmail);
    
    
    // 搜索功能
    $enableSearch = new Typecho_Widget_Helper_Form_Element_Radio('enableSearch', array(
        '1' => _t('开启'),
        '0' => _t('关闭')
    ), '1', _t('搜索功能'), _t('是否开启全站搜索功能'));
    $form->addInput($enableSearch);
    
    // 评论功能
    $enableComments = new Typecho_Widget_Helper_Form_Element_Radio('enableComments', array(
        '1' => _t('开启'),
        '0' => _t('关闭')
    ), '1', _t('评论功能'), _t('是否开启评论功能，关闭后所有页面都不显示评论区'));
    $form->addInput($enableComments);
    

    
    // Font Awesome图标设置
    $enableFontAwesome = new Typecho_Widget_Helper_Form_Element_Radio('enableFontAwesome', array(
        '1' => _t('开启'),
        '0' => _t('关闭')
    ), '1', _t('Font Awesome图标'), _t('是否启用Font Awesome 7.0图标库'));
    $form->addInput($enableFontAwesome);
    
    // 默认分类图标
    $defaultCategoryIcon = new Typecho_Widget_Helper_Form_Element_Text('defaultCategoryIcon', NULL, 'fas fa-folder', _t('默认分类图标'), _t('输入Font Awesome图标类名，如：fas fa-folder'));
    $form->addInput($defaultCategoryIcon);
    
    // 默认文章图标
    $defaultPostIcon = new Typecho_Widget_Helper_Form_Element_Text('defaultPostIcon', NULL, 'fas fa-file-alt', _t('默认文章图标'), _t('输入Font Awesome图标类名，如：fas fa-file-alt'));
    $form->addInput($defaultPostIcon);
    
    // 默认头像图片
    $defaultAvatar = new Typecho_Widget_Helper_Form_Element_Text('defaultAvatar', NULL, '/assets/images/default-avatar.svg', _t('默认头像图片'), _t('输入默认头像图片路径，相对于主题目录，如：/assets/images/default-avatar.svg'));
    $form->addInput($defaultAvatar);
    
    // 首页设置分组
    $homepageSettings = new Typecho_Widget_Helper_Form_Element_Text('homepageSettings', NULL, NULL, _t('=== 首页设置 ==='), _t('以下为首页相关配置选项'));
    $form->addInput($homepageSettings);
    
    // 启用首页模式
    $enableHomepage = new Typecho_Widget_Helper_Form_Element_Radio('enableHomepage', array(
        '1' => _t('开启'),
        '0' => _t('关闭')
    ), '1', _t('启用首页模式'), _t('开启后首页将显示项目介绍而非文章列表'));
    $form->addInput($enableHomepage);
    
    // 关闭首页模式时的重定向链接
    $homepageRedirectUrl = new Typecho_Widget_Helper_Form_Element_Text('homepageRedirectUrl', NULL, '/archives.html', _t('首页重定向链接'), _t('关闭首页模式时，访问首页将重定向到此链接'));
    $form->addInput($homepageRedirectUrl);
    
    // 项目标题
    $projectTitle = new Typecho_Widget_Helper_Form_Element_Text('projectTitle', NULL, NULL, _t('项目标题'), _t('首页显示的项目标题，留空则使用站点标题'));
    $form->addInput($projectTitle);
    
    // 项目描述
    $projectDescription = new Typecho_Widget_Helper_Form_Element_Textarea('projectDescription', NULL, '一个简洁、现代的文档主题', _t('项目描述'), _t('首页显示的项目描述信息'));
    $form->addInput($projectDescription);
    
    // 快速上手按钮文字
    $quickStartText = new Typecho_Widget_Helper_Form_Element_Text('quickStartText', NULL, '快速上手', _t('快速上手按钮文字'), _t('首页快速上手按钮显示的文字'));
    $form->addInput($quickStartText);
    
    // 快速上手链接
    $quickStartLink = new Typecho_Widget_Helper_Form_Element_Text('quickStartLink', NULL, '/index.php/start-page.html', _t('快速上手链接'), _t('点击快速上手按钮跳转的链接地址'));
    $form->addInput($quickStartLink);
    
    // 了解更多按钮文字
    $learnMoreText = new Typecho_Widget_Helper_Form_Element_Text('learnMoreText', NULL, '了解更多', _t('了解更多按钮文字'), _t('首页了解更多按钮显示的文字'));
    $form->addInput($learnMoreText);
    
    // 了解更多按钮链接
    $learnMoreLink = new Typecho_Widget_Helper_Form_Element_Text('learnMoreLink', NULL, 'https://github.com/matsuzaka-yuki/Vuecho', _t('了解更多按钮链接'), _t('点击了解更多按钮跳转的链接地址，通常用于指向项目的GitHub地址'));
    $form->addInput($learnMoreLink);
    
    // 了解更多按钮图标
    $learnMoreIcon = new Typecho_Widget_Helper_Form_Element_Text('learnMoreIcon', NULL, 'fab fa-github', _t('了解更多按钮图标'), _t('了解更多按钮的Font Awesome图标类名，如：fab fa-github'));
    $form->addInput($learnMoreIcon);
    
    // 项目特性
    $projectFeatures = new Typecho_Widget_Helper_Form_Element_Textarea('projectFeatures', NULL, "简洁设计|现代化的界面设计，专注内容展示\n响应式布局|完美适配各种设备和屏幕尺寸\n快速搜索|内置全文搜索功能，快速定位内容", _t('项目特性'), _t('每行一个特性，格式：标题|描述'));
    $form->addInput($projectFeatures);
    
    // 自定义CSS
    $customCSS = new Typecho_Widget_Helper_Form_Element_Textarea('customCSS', NULL, NULL, _t('自定义CSS'), _t('输入自定义CSS代码，将会插入到页面头部'));
    $form->addInput($customCSS);
    
    // 自定义JavaScript
    $customJS = new Typecho_Widget_Helper_Form_Element_Textarea('customJS', NULL, NULL, _t('自定义JavaScript'), _t('输入自定义JavaScript代码，将会插入到页面底部'));
    $form->addInput($customJS);
}

/**
 * 获取文章摘要
 */
function getExcerpt($widget, $length = 150) {
    $content = $widget->content;
    $content = strip_tags($content);
    $content = preg_replace('/\s+/', ' ', $content);
    
    if (mb_strlen($content) > $length) {
        return mb_substr($content, 0, $length) . '...';
    }
    
    return $content;
}

/**
 * 获取阅读时间估算
 */
function getReadingTime($content) {
    $wordCount = mb_strlen(strip_tags($content));
    $readingTime = ceil($wordCount / 300); // 假设每分钟阅读300字
    return $readingTime;
}



/**
 * 输出自定义头部代码
 */
function themeHeader() {
    $options = Helper::options();
    
    if ($options->customCSS) {
        echo '<style type="text/css">' . $options->customCSS . '</style>';
    }
}

/**
 * 输出自定义底部代码
 */
function themeFooter() {
    $options = Helper::options();
    
    if ($options->customJS) {
        echo '<script type="text/javascript">' . $options->customJS . '</script>';
    }
}

/**
 * 获取文章图标
 */
function getPostIcon($widget) {
    $options = Helper::options();
    
    // 检查是否启用FontAwesome
    if (isset($options->enableFontAwesome) && $options->enableFontAwesome === '0') {
        return '';
    }
    
    // 获取默认文章图标
    $defaultIcon = isset($options->defaultPostIcon) ? $options->defaultPostIcon : 'fas fa-file-alt';
    
    // 方法1：检查自定义字段
    $fields = $widget->fields;
    if (isset($fields->icon) && !empty($fields->icon)) {
        return $fields->icon;
    }
    
    // 方法2：检查文章内容中的图标定义
    $content = $widget->content;
    if (preg_match('/<!-- icon:([^\s]+(?:\s+[^\s]+)*) -->/', $content, $matches)) {
        return trim($matches[1]);
    }
    
    // 返回默认图标
    return $defaultIcon;
}

/**
 * 获取分类图标
 */
function getCategoryIcon($category) {
    $options = Helper::options();
    
    // 检查是否启用FontAwesome
    if (isset($options->enableFontAwesome) && $options->enableFontAwesome === '0') {
        return '';
    }
    
    // 获取默认分类图标
    $defaultIcon = isset($options->defaultCategoryIcon) ? $options->defaultCategoryIcon : 'fas fa-folder';
    
    // 检查分类描述中的图标定义
    if (isset($category['description']) && !empty($category['description'])) {
        $description = $category['description'];
        if (preg_match('/icon:([^\s]+(?:\s+[^\s]+)*)/', $description, $matches)) {
            return trim($matches[1]);
        }
    }
    
    // 返回默认图标
    return $defaultIcon;
}

/**
 * 获取相邻文章
 */
function getAdjacentPosts($widget) {
    $db = Typecho_Db::get();
    $currentCid = $widget->cid;
    $currentCreated = $widget->created;
    
    // 获取上一篇
    $prevPost = $db->fetchRow($db->select()->from('table.contents')
        ->where('table.contents.type = ?', 'post')
        ->where('table.contents.status = ?', 'publish')
        ->where('table.contents.created < ?', $currentCreated)
        ->order('table.contents.created', Typecho_Db::SORT_DESC)
        ->limit(1));
    
    // 获取下一篇
    $nextPost = $db->fetchRow($db->select()->from('table.contents')
        ->where('table.contents.type = ?', 'post')
        ->where('table.contents.status = ?', 'publish')
        ->where('table.contents.created > ?', $currentCreated)
        ->order('table.contents.created', Typecho_Db::SORT_ASC)
        ->limit(1));
    
    return array(
        'prev' => $prevPost,
        'next' => $nextPost
    );
}

/**
 * 自定义头像函数
 * 检测QQ邮箱使用QQ头像API，否则使用默认图像
 */
function getCustomAvatar($email, $size = 40, $default = '') {
    // 检查是否为QQ邮箱
    if (preg_match('/@qq\.com$/i', $email)) {
        // 从QQ邮箱提取QQ号
        $qq = str_replace('@qq.com', '', strtolower($email));
        // 如果是纯数字则使用QQ头像API
        if(is_numeric($qq)) {
            return "http://q.qlogo.cn/headimg_dl?dst_uin=" . $qq . "&spec=640&img_type=jpg";
        }
        // 非QQ号则返回默认头像
        return $default ? $default : Helper::options()->themeUrl . '/assets/images/default-avatar.svg';
    } else {
        // 非QQ邮箱使用主题设置中的默认头像
        $options = Helper::options();
        $defaultAvatar = isset($options->defaultAvatar) && !empty($options->defaultAvatar) ? $options->defaultAvatar : '/assets/images/default-avatar.svg';
        
        // 检查是否为外链图片（http或https开头）
        if (preg_match('/^https?:\/\//i', $defaultAvatar)) {
            return $defaultAvatar;
        } else {
            // 本地图片路径
            return $options->themeUrl . $defaultAvatar;
        }
    }
}

/**
 * 嵌套评论回调函数
 */
function threadedComments($comments, $options) {
    $commentClass = '';
    if ($comments->authorId) {
        if ($comments->authorId == $comments->ownerId) {
            $commentClass .= ' comment-by-author';
        } else {
            $commentClass .= ' comment-by-user';
        }
    }
    
    $commentLevelClass = $comments->levels > 0 ? ' comment-child' : ' comment-parent';
?>

<li id="comment-<?php $comments->theId(); ?>" class="comment-item<?php echo $commentClass . $commentLevelClass; ?>">
    <div class="comment-avatar">
        <img src="<?php echo getCustomAvatar($comments->mail, 32); ?>" alt="<?php echo htmlspecialchars($comments->author ? $comments->author : '', ENT_QUOTES, 'UTF-8'); ?>" width="32" height="32" />
    </div>
    
    <div class="comment-content">
        <div class="comment-meta">
            <span class="comment-author"><?php $comments->author(); ?></span>
            <time class="comment-date"><?php $comments->date('Y年m月d日 H:i'); ?></time>
            <?php if ($comments->status == 'waiting'): ?>
                <span class="comment-status">等待审核</span>
            <?php endif; ?>
        </div>
        
        <div class="comment-text">
            <?php $comments->content(); ?>
        </div>
        
        <div class="comment-actions">
            <span class="comment-reply">
                <?php $comments->reply('回复'); ?>
            </span>
        </div>
    </div>
    
    <?php if ($comments->children) { ?>
        <ol class="comment-children">
            <?php $comments->threadedComments('threadedComments'); ?>
        </ol>
    <?php } ?>
</li>
<?php
}

// 注册主题钩子
Typecho_Plugin::factory('Widget_Archive')->header = 'themeHeader';
Typecho_Plugin::factory('Widget_Archive')->footer = 'themeFooter';

