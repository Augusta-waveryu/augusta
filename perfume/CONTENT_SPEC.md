# 香氛研究快讯 · 内容规范

本文件定义 Hermes agent 向 Augusta 站点推送香氛市场研究快讯时需遵循的格式和流程。

## ⚠️ 推送检查清单（每次必须全部完成）

每次推送快讯时，必须依次完成以下 5 步，缺一不可：

1. [ ] **生成快讯 HTML** → 写入 `perfume/YYYY-MM-DD.html`
2. [ ] **更新归档页** → 在 `perfume/index.html` 归档列表顶部插入新条目
3. [ ] **更新首页** → 在 `index.html` 的 `<main id="post-list">` 中，找到 `data-tag="perfume"` 的 article，在其前方插入新条目（详见下方"首页更新"章节）
4. [ ] **git commit + push** → 提交所有变更并推送到 GitHub
5. [ ] **验证** → push 完成后确认 Vercel 部署成功

> 如果只完成了第 1 步而没有更新首页，用户在首页将看不到新快讯。这是必须执行的步骤。

## 目录结构

```
augusta/
├── index.html                  # 首页（每次推送必须更新！）
├── perfume/
│   ├── index.html              # 归档页（每次推送必须更新）
│   ├── 2026-07-13.html         # 单期快讯（完整 HTML 文件）
│   └── ...
```

## 文件命名

`perfume/YYYY-MM-DD.html`

- 日期使用发布日（北京时间）
- 一期一个文件，不可覆盖历史文件

## 单期快讯 HTML 规范

每个快讯文件必须是完整的单文件 HTML，要求：

1. **纯 HTML/CSS/JS**，所有样式与脚本内联，禁止外部资源
2. **系统字体栈**：`-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`
3. **主题色**：玫瑰粉渐变（`#e91e63` → `#c2185b`），与晨报的橙红渐变区分
4. **支持暗色模式**：`@media (prefers-color-scheme: dark)`
5. **返回首页链接**用相对路径 `../` 指向首页
6. **外链** `target="_blank" rel="noopener noreferrer"`

### 页面结构

```
┌─────────────────────────────┐
│ Hero（玫瑰粉渐变）           │
│  🌹 香氛市场研究 · 日期      │
│  总条数 + 版块统计           │
├─────────────────────────────┤
│ 锚点导航（Sticky）           │
├─────────────────────────────┤
│ 正文卡片网格（响应式）       │
│  - 新品发布                  │
│  - 法规与合规                │
│  - 供应链动态                │
│  - 消费趋势                  │
│  - 跨境出海                  │
├─────────────────────────────┤
│ 文末标注（数据源 + 时效窗口）│
└─────────────────────────────┘
```

### 版块定义

| 版块 | 标识 | 覆盖范围 |
|------|------|----------|
| 新品发布 | product | 香水/香薰/精油新品、限定系列、品牌联名 |
| 法规与合规 | regulation | IFRA 修订、各国禁用成分（如印尼 PerBPOM 25/2025）、Halal 认证、REACH |
| 供应链动态 | supply | 原料价格波动、产能变化、物流政策（DG 柜/普通海运） |
| 消费趋势 | trend | 市场调研、消费者偏好、社交媒体趋势、品类增长数据 |
| 跨境出海 | crossborder | 东南亚市场机会、平台政策、渠道分析、本土化策略 |

### 每条卡片字段

| 字段 | 要求 |
|------|------|
| 全局序号 | 贯穿全文，不按版块重新计数 |
| 标题 | 简洁有力，不超过 30 字 |
| 来源 chip | 标注信息来源（如 IFRA、Givaudan 官网、TechCrunch） |
| 时间 | 人话格式（"2小时前"/"今天上午 09:48"），不展示 ISO |
| 摘要 | 60 字以内中文摘要 |
| 原文链接 | `target="_blank" rel="noopener noreferrer"` |

## 归档页更新

每次推送新快讯时，需同步更新 `perfume/index.html`：

1. 在归档列表顶部插入新条目
2. 条目格式：`日期 | 标题链接 | 条数`
3. 不删除历史条目

## 首页更新

每次推送新快讯时，需同步更新 `augusta-site/index.html`：

1. 在 `<main id="post-list">` 下第一个 `data-tag="perfume"` 的 article 前插入新条目
2. 条目格式（data-tag="perfume"）：
   ```html
   <article data-tag="perfume">
     <div class="post-meta">
       <span class="post-date">2026 年 7 月 13 日</span>
       <span class="post-tag tag-perfume">香氛研究</span>
     </div>
     <h2 class="post-title"><a href="/perfume/2026-07-13.html">🌹 香氛研究 · 2026-07-13</a></h2>
     <p class="post-excerpt">摘要内容，列出本期 Top 3-5 关键词。</p>
     <a class="post-link" href="/perfume/2026-07-13.html">阅读全文 →</a>
   </article>
   ```

## Git 推送

### 仓库信息

- **GitHub repo**: `https://github.com/Augusta-waveryu/augusta.git`
- **分支**: `main`
- **提交信息格式**: `feat: YYYY-MM-DD 香氛研究快讯`
- **git 身份**: `user.email=gumpliu@qq.com`, `user.name=Augusta`

### 路径 A：Hermes 直接推送（推荐）

如果 Hermes 具备 git push 能力：

1. Hermes 需要一个对 `Augusta-waveryu/augusta` 仓库有 `repo` 权限的 GitHub Token (PAT)
2. Hermes 将生成的 HTML 文件写入本地 `augusta-site/perfume/YYYY-MM-DD.html`
3. 更新 `augusta-site/perfume/index.html` 和 `augusta-site/index.html`
4. 执行：
   ```bash
   cd /path/to/augusta-repo
   git add perfume/ index.html
   git commit -m "feat: YYYY-MM-DD 香氛研究快讯"
   git push origin main
   ```
5. Vercel 自动部署，约 30 秒后线上更新

### 路径 B：WorkBuddy 中转

如果 Hermes 不能直接 git push：

1. Hermes 将内容写入约定位置（如 `workspace/perfume-inbox/YYYY-MM-DD.html`）
2. WorkBuddy 创建一个自动化任务，定期检查 inbox
3. 发现有新文件时，WorkBuddy 执行更新首页/归档页 + git push

## 时效性要求

- 所有条目时效窗口：**过去 72 小时**（香氛行业更新频率低于 AI，窗口可放宽）
- 超过 72 小时的条目一律剔除
- 法规类条目例外：重要法规更新不受时效限制，但需标注发布日期

## 数据源建议

| 数据源 | 覆盖 | URL |
|--------|------|-----|
| IFRA 官网 | 法规 | ifrafragrance.org |
| Fragrantica | 新品/趋势 | fragrantica.com |
| Givaudan/Firmenich/Symrise 官网 | 供应链/新品 | 官网新闻页 |
| CosmeticsDesign | 行业新闻 | cosmeticsdesign.com |
| Perfumer & Flavorist | 行业杂志 | perfumerflavorist.com |
| Euromonitor | 市场数据 | euromonitor.com |
| 印尼 BPOM | 法规 | bpom.go.id |
| 马来西亚 JAKIM | Halal 认证 | jakim.gov.my |
