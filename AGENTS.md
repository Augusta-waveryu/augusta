# 本站规范（所有 agent 改这个仓库前必读）

这是 Augusta（waveryu）的个人站，副标题"在 AI 世界里留下注脚"。Astro 静态站，推到 GitHub 后由 Vercel 自动构建。

## 内容原则

- 只放站长本人的观察、思考、学习，以及孩子的学习内容。
- 不做转载、聚合、日报、资讯摘要。晨报、香氛、英语音标栏目已永久下线，不要重建。
- 不替站长编造经历、观点或文章。

## 栏目与导航

导航只有一份，在 `src/site.ts` 的 `SITE.nav`：首页 / 文章 / 孩子的学习 / 实践 / 关于。
不要在任何页面里手写站点导航或页头页脚，一律用 `src/layouts/Base.astro`。

| 要加什么 | 放哪里 |
|---|---|
| 一篇文章 | `src/content/posts/xxx.md`，格式见 `_template.md`（`npm run new 短名 "标题"` 可生成） |
| 首页介绍、关于页的文字 | `src/content/pages/home.md`、`about.md`，不要写回 `.astro` 页面里 |
| 孩子学习的新学科 | 在 `src/site.ts` 的 `LEARNING` 登记入口 |
| 实践类专题页 | `src/topics/<专题>/xxx.html`（只写正文片段）+ `src/topics/meta.json` 登记标题、描述和版心类（`shell`，一般填 `article-shell`） |
| 不发布的草稿、调研、规范 | `notes/` |

`public/` 下的文件会原样发布，不要往里放笔记、测试、音视频原始素材。

## 样式

- 颜色、字体只用 `src/styles/global.css` 里 `:root` 的变量（`--bg --fg --muted --line --accent --card --tint --gold`、`--serif --sans --mono`）。不要写新的色值，不要给某个栏目单独一套主题色。
- 明暗两套由变量自动切换，新样式不要写死 `#fff` 这类颜色。
- 标题用 `--serif`，正文用 `--sans`。版心 720px。
- 不引用任何外部字体、脚本、CDN（国内打不开）。
- 不用 emoji 当图标或栏目标记。

## 孩子学习类子站（`public/siwei/`）

这是给孩子用的互动页面，正文可以保留自己的儿童风格，但：

- 每个页面 `<body>` 开头必须是统一的返回条（`/kids-bar.css` + `.aug-bar`），照现有页面复制。
- 不要再加站点级导航。

## 提交前

`npm run build` 必须通过。站点网址在 `src/site.ts` 和 `astro.config.mjs` 两处，改域名时一起改。
