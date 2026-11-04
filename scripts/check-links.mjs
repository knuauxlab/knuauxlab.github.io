// 빌드 결과(dist)의 내부 링크를 검사한다. 배포 후 404가 나는 링크를 미리 잡기 위한 것이다.
//  - 모든 내부 경로(href, src)가 astro.config.mjs의 base로 시작하는지
//  - 그 경로가 가리키는 파일이 dist에 실제로 있는지
// 문제가 하나라도 있으면 종료 코드 1로 끝난다.
import fs from 'node:fs';
import path from 'node:path';
import config from '../astro.config.mjs';

const base = (config.base ?? '').replace(/\/$/, '');
const dist = 'dist';

if (!fs.existsSync(dist)) {
  console.error('dist 폴더가 없습니다. 먼저 npm run build를 실행하세요.');
  process.exit(1);
}

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  );

const exists = (rel) => {
  const candidates = [rel, path.join(rel, 'index.html'), `${rel}.html`];
  return candidates.some((c) => {
    const p = path.join(dist, c);
    return fs.existsSync(p) && fs.statSync(p).isFile();
  });
};

const problems = [];
let total = 0;
const pages = walk(dist).filter((f) => f.endsWith('.html'));

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8');
  const where = path.relative(dist, file);
  for (const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) {
    const url = m[1];
    if (!url || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(url)) continue; // 외부 링크, 해시
    total++;
    if (url !== base && !url.startsWith(`${base}/`)) {
      problems.push(`${where}: base(${base})가 없는 내부 경로 ${url}`);
      continue;
    }
    const target = decodeURI(url.slice(base.length).split(/[?#]/)[0]) || '/';
    if (!exists(target.replace(/^\//, ''))) {
      problems.push(`${where}: 가리키는 파일이 없음 ${url}`);
    }
  }
}

console.log(`링크 검사: 페이지 ${pages.length}개, 내부 링크 ${total}개, 문제 ${problems.length}개 (base: ${base || '/'})`);
for (const p of problems.slice(0, 30)) console.log(`  - ${p}`);
if (problems.length > 30) console.log(`  ... 외 ${problems.length - 30}개`);
process.exit(problems.length ? 1 : 0);
