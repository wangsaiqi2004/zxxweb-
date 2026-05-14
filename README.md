# 名商官网首页环保主题改版

这个仓库包只包含本次前端改版需要部署的文件，不包含数据库备份、整站压缩包、CMS 数据库配置或任何服务器密码。

## 文件清单

- `files/wwwrswww/cms/templates/default/content/index.html`
- `files/wwwrswww/statics/default/css/mingshang-eco.css`

## 部署方式

把 `files/` 目录中的内容按相同路径覆盖到服务器网站根目录。

例如服务器网站根目录如果是 `/www/wwwroot/qdmingshang/`，则覆盖后应得到：

- `/www/wwwroot/qdmingshang/wwwrswww/cms/templates/default/content/index.html`
- `/www/wwwroot/qdmingshang/wwwrswww/statics/default/css/mingshang-eco.css`

## CMS 缓存

此 CMS 配置中 `tpl_referesh` 为开启状态，访问首页时通常会自动重新编译模板。

如果服务器仍显示旧首页，可以删除或刷新这个缓存文件：

`wwwrswww/caches/caches_template/default/content/index.php`

删除前建议先备份。

## 本次设计重点

- 突出环保艺术壁材主题
- 保留原 CMS 的产品展示、案例、新闻、关于、联系等栏目入口
- 保留首页产品、案例、新闻的动态内容标签
- 新增独立 CSS，不改后端、不改数据库

