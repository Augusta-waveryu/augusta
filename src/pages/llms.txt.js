import { SITE, LEARNING, PRACTICE } from '../site';
import { getPosts, fmtDate } from '../posts';

export async function GET() {
  const posts = await getPosts();
  const abs = (p) => `${SITE.url}${p}`;
  const lines = [
    `# ${SITE.name}（${SITE.handle}）`,
    '',
    `> ${SITE.tagline}。${SITE.description}`,
    '',
    'Augusta，网名 waveryu，在广州，做企业 AI 落地服务。本站内容均为本人原创的观察、思考与学习记录。',
    '',
    '## 文章',
    ...(posts.length
      ? posts.map((p) => `- [${p.data.title}](${abs(`/posts/${p.id}/`)})：${p.data.summary}（${fmtDate(p.data.date)}）`)
      : ['- 暂无']),
    '',
    '## 孩子的学习',
    ...LEARNING.filter((l) => l.href).map((l) => `- [${l.title}](${abs(l.href)})：${l.desc}`),
    '',
    '## 实践',
    ...PRACTICE.map((l) => `- [${l.title}](${abs(l.href)})：${l.desc}`),
    '',
    '## 其他',
    `- [关于](${abs('/about/')})`,
    `- [RSS](${abs('/rss.xml')})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
