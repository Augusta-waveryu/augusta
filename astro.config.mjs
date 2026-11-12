import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 域名买好后改这里和 src/site.ts 里的 url
const site = 'https://augusta-ai.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // public/ 下的老栏目不经过 Astro，手动列入口页
      customPages: ['/siwei/', '/siwei/curriculum.html'].map((p) => site + p),
    }),
  ],
});
