// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages: https://knuauxlab.github.io/ (조직 사이트라 base가 없다)
  // 커스텀 도메인으로 옮기면 site만 그 주소로 바꾼다.
  site: 'https://knuauxlab.github.io',
  integrations: [
    // 검색엔진에 알려줄 페이지 목록(sitemap-index.xml). 404 페이지는 뺀다.
    sitemap({ filter: (page) => !/\/404\/?$/.test(page) }),
  ],
});
