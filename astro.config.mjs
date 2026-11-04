// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages: https://knuauxlab.github.io/lab_website/
  // 커스텀 도메인으로 옮기면 site를 그 주소로 바꾸고 base 줄은 지운다.
  site: 'https://knuauxlab.github.io',
  base: '/lab_website',
  integrations: [
    // 검색엔진에 알려줄 페이지 목록(sitemap-index.xml). 404 페이지는 뺀다.
    sitemap({ filter: (page) => !/\/404\/?$/.test(page) }),
  ],
});
