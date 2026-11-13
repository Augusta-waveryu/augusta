// 全站只在这里改：域名买好后把 url 换成 https://waveryu.com
export const SITE = {
  url: 'https://waveryu.com',
  name: 'Augusta',
  handle: 'waveryu',
  tagline: '让 AI 读懂我的墓志铭',
  description:
    'Augusta（waveryu）的个人站：我的观察、思考与学习，孩子的学习地图，以及企业 AI 落地的实践。',
  github: 'https://github.com/Augusta-waveryu',
  nav: [
    { href: '/', label: '首页' },
    { href: '/posts/', label: '文章' },
    { href: '/learning/', label: '孩子的学习' },
    { href: '/practice/', label: '实践' },
    { href: '/about/', label: '关于' },
  ],
};

export const LEARNING = [
  { title: '数学思维', href: '/siwei/', status: '在更新', desc: '思维树屋：8 个课程分支、58 个知识点，按题型找入口，学一个方法练一类题。' },
  { title: 'AI', href: null, status: '筹备中', desc: '孩子怎么用 AI 学习、怎么理解 AI。' },
  { title: '历史', href: null, status: '筹备中', desc: '' },
  { title: '地理', href: null, status: '筹备中', desc: '' },
];

export const PRACTICE = [
  { title: 'FDE 能力体系', href: '/fde/', desc: '把客户问题做成可采用的方案：从客户发现、场景判断到原型验证、交付采用的工作闭环。' },
  { title: 'WorkBuddy 实战笔记', href: '/workbuddy/', desc: '从一件真实工作开始：任务、团队、从客户需求到方案的一线操作记录。' },
];
