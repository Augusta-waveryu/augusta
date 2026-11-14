// 用法：npm run new 英文短名 "文章标题"
// 例：  npm run new why-i-write "我为什么写这个站"
import { existsSync, writeFileSync } from 'node:fs';

const [slug, title = '文章标题'] = process.argv.slice(2);
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('请给一个英文短名（小写字母、数字、连字符），它会成为网址。\n例：npm run new why-i-write "我为什么写这个站"');
  process.exit(1);
}
const file = `src/content/posts/${slug}.md`;
if (existsSync(file)) {
  console.error(`已经有这个文件了：${file}`);
  process.exit(1);
}
const d = new Date();
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
writeFileSync(
  file,
  `---
title: ${JSON.stringify(title)}
date: ${date}
summary: 一两句话说清这篇讲什么。
tags: []
draft: true
---

正文从这里开始。写完把上面的 draft 改成 false 再发布。
`,
);
console.log(`已新建：${file}\n网址将是：/posts/${slug}/`);
