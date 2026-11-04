// GitHub Pages에서는 사이트가 /lab_website/ 아래에 놓이므로, 내부 링크와
// public 파일 경로는 항상 이 헬퍼를 거쳐서 base를 붙인다.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const withBase = (path: string) => `${base}/${path.replace(/^\//, '')}`;

// Astro.url.pathname에는 base가 포함되어 있다. 메뉴 강조처럼 사이트 안의
// 경로만 비교해야 할 때 base를 걷어낸다.
export const stripBase = (pathname: string) => {
  const stripped = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return stripped === '' ? '/' : stripped;
};
