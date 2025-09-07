<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>

    <!-- 页脚 -->
    <footer class="docs-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>关于</h4>
                    <p><?php $this->options->description(); ?></p>
                </div>
                
                <div class="footer-section">
                    <h4>链接</h4>
                    <ul class="footer-links">
                        <li><a href="<?php $this->options->siteUrl(); ?>">首页</a></li>
                        <?php $this->widget('Widget_Contents_Page_List')->to($pages); ?>
                        <?php while($pages->next()): ?>
                            <li><a href="<?php $pages->permalink(); ?>"><?php $pages->title(); ?></a></li>
                        <?php endwhile; ?>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>联系</h4>
                    <ul class="footer-contact">
                        <?php if ($this->options->socialGithub): ?>
                            <li><a href="<?php $this->options->socialGithub(); ?>" target="_blank">GitHub</a></li>
                        <?php endif; ?>
                        <?php if ($this->options->socialEmail): ?>
                            <li><a href="mailto:<?php $this->options->socialEmail(); ?>">邮箱</a></li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <p>&copy; <?php echo date('Y'); ?> <a href="<?php $this->options->siteUrl(); ?>"><?php $this->options->title(); ?></a>. 
                    <?php _e('由 <a href="http://www.typecho.org">Typecho</a> 强力驱动'); ?></p>
                </div>
                
                <div class="footer-theme">
                    <p>Theme: <a href="https://github.com/matsuzaka-yuki/Vuecho" target="_blank">Vuecho</a></p>
                </div>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="<?php $this->options->themeUrl('assets/js/toc-desktop.js'); ?>"></script>
    <script src="<?php $this->options->themeUrl('assets/js/toc-mobile.js'); ?>"></script>
    <script src="<?php $this->options->themeUrl('assets/js/fuse.min.js'); ?>"></script>
    <script src="<?php $this->options->themeUrl('assets/js/main.js'); ?>"></script>
    
    <?php $this->footer(); ?>
</body>
</html>