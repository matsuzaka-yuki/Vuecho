<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit; ?>

<?php if (!isset($this->options->enableComments) || $this->options->enableComments !== '0'): ?>
<div id="comments" class="comments-section">
    <?php $this->comments()->to($comments); ?>
    
    <?php if ($comments->have()): ?>
    <h3 class="comments-title">
        <?php $this->commentsNum(_t('暂无评论'), _t('仅有一条评论'), _t('已有 %d 条评论')); ?>
    </h3>
    
    <?php $comments->listComments(); ?>
    
    <?php $comments->pageNav('上一页', '下一页', 5, '...', array('wrapTag' => 'nav', 'wrapClass' => 'comments-nav', 'itemTag' => 'span', 'textTag' => 'a', 'currentClass' => 'current')); ?>
    
    <?php endif; ?>
    
    <?php if($this->allow('comment')): ?>
    <div id="respond" class="comment-form-section">
        <h3 class="comment-form-title">添加新评论</h3>
        
        <form method="post" action="<?php $this->commentUrl() ?>" id="comment-form" class="comment-form" role="form">
            <?php if($this->user->hasLogin()): ?>
            <div class="comment-logged-in">
                <p>登录身份: <a href="<?php $this->options->profileUrl(); ?>"><?php $this->user->screenName(); ?></a>. 
                <a href="<?php $this->options->logoutUrl(); ?>" title="Logout">退出登录 &raquo;</a></p>
            </div>
            <?php else: ?>
            <div class="comment-form-fields">
                <div class="form-group">
                    <label for="author" class="required">姓名 *</label>
                    <input type="text" name="author" id="author" class="form-control" value="<?php $this->remember('author'); ?>" required />
                </div>
                
                <div class="form-group">
                    <label for="mail"<?php if ($this->options->commentsRequireMail): ?> class="required"<?php endif; ?>>邮箱<?php if ($this->options->commentsRequireMail): ?> *<?php endif; ?></label>
                    <input type="email" name="mail" id="mail" class="form-control" value="<?php $this->remember('mail'); ?>"<?php if ($this->options->commentsRequireMail): ?> required<?php endif; ?> />
                </div>
                
                <div class="form-group">
                    <label for="url"<?php if ($this->options->commentsRequireURL): ?> class="required"<?php endif; ?>>网站<?php if ($this->options->commentsRequireURL): ?> *<?php endif; ?></label>
                    <input type="url" name="url" id="url" class="form-control" placeholder="<?php _e('http://'); ?>" value="<?php $this->remember('url'); ?>"<?php if ($this->options->commentsRequireURL): ?> required<?php endif; ?> />
                </div>
            </div>
            <?php endif; ?>
            
            <div class="form-group">
                <label for="textarea" class="required">内容 *</label>
                <textarea rows="8" cols="50" name="text" id="textarea" class="form-control" placeholder="说点什么..." required><?php $this->remember('text'); ?></textarea>
            </div>
            <!-- 隐藏的父级评论ID字段 -->
            <input type="hidden" name="parent" id="comment-parent" value="" />
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">提交评论</button>
                <button type="button" class="btn btn-secondary" id="cancel-comment-reply" style="display:none;">取消回复</button>
            </div>
        </form>
    </div>
    <?php else: ?>
    <div class="comment-closed">
        <p>评论已关闭</p>
    </div>
    <?php endif; ?>
</div>
<?php endif; ?>
</div>