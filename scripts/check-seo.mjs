// 빌드 결과(dist)의 검색/공유용 메타 태그를 검사한다. 페이지를 추가하다 빠뜨리기 쉬운 것들이다.
//  - 모든 페이지에 title, description, canonical, og:title, og:image가 있는지
//  - canonical과 og:image가 완전한 https 주소이고, og:image가 가리키는 파일이 실제로 있는지
//  - 모든 공개 페이지가 sitemap에 들어 있는지, 404는 noindex인지
// 문제가 하나라도 있으면 종료 코드 1로 끝난다.
import fs from 'node:fs';
import path from 'node:path';
import config from '../astro.config.mjs';

const dist = 'dist';
const site = config.site;
const base = (config.base ?? '').replace(/\/$/, '');
const problems = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );

// 관리 화면(admin)은 Astro 페이지가 아니라 public 파일이라 검사 대상이 아니다
const pages = walk(dist).filter((f) => f.endsWith('.html') && !path.relative(dist, f).startsWith('admin'));

const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, 'i'))
    ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, 'i'));
  return m?.[1];
};

const sitemap = fs.existsSync(path.join(dist, 'sitemap-0.xml'))
  ? [...fs.readFileSync(path.join(dist, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)/g)].map((m) => m[1])
  : null;
if (!sitemap) problems.push('sitemap-0.xml이 없음');

let indexable = 0;
for (const file of pages) {
  const rel = path.relative(dist, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');
  const is404 = rel === '404.html';
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const description = meta(html, 'name', 'description');
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  const ogTitle = meta(html, 'property', 'og:title');
  const ogImage = meta(html, 'property', 'og:image');
  const robots = meta(html, 'name', 'robots');

  if (!title) problems.push(`${rel}: title이 없음`);
  if (!description) problems.push(`${rel}: description이 없음`);
  else if (description.length < 20 || description.length > 200) problems.push(`${rel}: description 길이가 ${description.length}자 (20~200자여야 함)`);
  if (!canonical?.startsWith(`${site}${base}/`)) problems.push(`${rel}: canonical이 ${site}${base}/ 로 시작하는 완전한 주소가 아님 (${canonical})`);
  if (!ogTitle) problems.push(`${rel}: og:title이 없음`);
  if (!ogImage?.startsWith('https://')) problems.push(`${rel}: og:image가 완전한 https 주소가 아님 (${ogImage})`);
  else {
    const file = ogImage.replace(`${site}${base}`, '');
    if (!fs.existsSync(path.join(dist, file))) problems.push(`${rel}: og:image가 가리키는 파일이 없음 (${file})`);
  }

  if (is404) {
    if (!robots?.includes('noindex')) problems.push('404.html: noindex가 없음');
  } else {
    indexable++;
    if (robots?.includes('noindex')) problems.push(`${rel}: 공개 페이지인데 noindex임`);
    if (sitemap && canonical && !sitemap.includes(canonical)) problems.push(`${rel}: sitemap에 없음 (${canonical})`);
  }
}

console.log(`SEO 검사: 페이지 ${pages.length}개(공개 ${indexable}개), sitemap ${sitemap?.length ?? 0}개 주소, 문제 ${problems.length}개`);
for (const p of problems.slice(0, 30)) console.log(`  - ${p}`);
process.exit(problems.length ? 1 : 0);
