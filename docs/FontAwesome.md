# Font Awesome 7.0 图标使用说明

## 功能概述

本主题已集成 Font Awesome 7.0 图标库，支持为分类和文章自定义图标显示。图标文件通过BootCDN加载，确保快速稳定的访问体验。

## 主题设置

在 Typecho 后台的「外观」->「设置外观」中，您可以找到以下新增选项：

### 1. Font Awesome图标
- **开启/关闭**：控制是否启用 Font Awesome 图标功能
- 默认：开启

### 2. 默认分类图标
- **设置**：输入 Font Awesome 图标类名
- **默认值**：`fas fa-folder`
- **示例**：`fas fa-code`、`fas fa-book`、`fas fa-star`

### 3. 默认文章图标
- **设置**：输入 Font Awesome 图标类名
- **默认值**：`fas fa-file-alt`
- **示例**：`fas fa-newspaper`、`fas fa-edit`、`fas fa-document`

## 自定义分类图标

### 方法：在分类描述中添加图标定义

1. 进入 Typecho 后台「管理」->「分类」
2. 编辑要设置图标的分类
3. 在「分类描述」中添加图标定义，格式：`icon:图标类名`

**示例：**
```
这是前端开发相关的文档分类。
icon:fab fa-js-square
```

**常用分类图标推荐：**
- 前端开发：`fab fa-js-square`、`fab fa-html5`、`fab fa-css3-alt`
- 后端开发：`fas fa-server`、`fas fa-database`、`fab fa-php`
- 移动开发：`fas fa-mobile-alt`、`fab fa-android`、`fab fa-apple`
- 设计相关：`fas fa-palette`、`fas fa-paint-brush`、`fas fa-image`
- 工具软件：`fas fa-tools`、`fas fa-cog`、`fas fa-wrench`

## 自定义文章图标

### 方法一：使用自定义字段（推荐）

1. 在文章编辑页面，找到「自定义字段」区域
2. 添加字段名：`icon`
3. 字段值：输入图标类名，如 `fas fa-lightbulb`

### 方法二：在文章内容中添加图标定义

在文章内容的任意位置添加HTML注释：
```html
<!-- icon:fas fa-lightbulb -->
```

**常用文章图标推荐：**
- 教程文档：`fas fa-graduation-cap`、`fas fa-book-open`
- 技术分享：`fas fa-lightbulb`、`fas fa-brain`
- 问题解决：`fas fa-question-circle`、`fas fa-exclamation-triangle`
- 新闻资讯：`fas fa-newspaper`、`fas fa-rss`
- 项目展示：`fas fa-project-diagram`、`fas fa-rocket`

## Font Awesome 图标类型

### 1. Solid 图标（fas）
- 实心图标，最常用
- 示例：`fas fa-home`、`fas fa-user`、`fas fa-heart`

### 2. Regular 图标（far）
- 空心图标
- 示例：`far fa-heart`、`far fa-star`、`far fa-file`

### 3. Brands 图标（fab）
- 品牌图标
- 示例：`fab fa-github`、`fab fa-twitter`、`fab fa-google`

## 图标查找

访问 [Font Awesome 官网](https://fontawesome.com/icons) 查找更多图标，并复制图标的代码(例如：`fas fa-home`)
1. 搜索您需要的图标
2. 点击图标查看详情
3. 复制图标的类名（如 `fas fa-home`）
4. 在主题设置或文章中使用

## 注意事项

1. **图标类名格式**：必须包含图标类型前缀（fas/far/fab）和图标名称
2. **分类图标优先级**：自定义图标 > 默认分类图标
3. **文章图标优先级**：自定义字段 > 文章内容注释 > 默认文章图标
4. **兼容性**：图标在浅色和夜间模式下都有良好的显示效果
5. **性能**：图标文件通过BootCDN加载，提供快速稳定的访问体验

## 故障排除

### 图标不显示
1. 检查主题设置中是否启用了 Font Awesome 功能
2. 确认图标类名格式正确（包含 fas/far/fab 前缀）
3. 清除浏览器缓存后重新访问

### 图标显示异常
1. 确认使用的是 Font Awesome 7.0 支持的图标
2. 检查图标类名是否拼写正确
3. 尝试使用其他类似图标替代

---

**提示**：合理使用图标可以让您的文档站点更加美观和易于导航！