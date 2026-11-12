// base는 astro.config의 base 값이다(지금은 루트라 비어 있다). 내부 경로(/news, /logo.png)에는
// 항상 withBase를 거쳐 base를 붙인다. Button, TextLink는 이미 내부에서 처리한다.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// https:, mailto:, #hash, //cdn 처럼 사이트 안의 경로가 아닌 것은 그대로 둔다
const isExternalOrHash = (path: string) => /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(path);

export const withBase = (path: string) =>
  isExternalOrHash(path) ? path : `${base}/${path.replace(/^\//, '')}`;

// Astro.url.pathname에는 base가 포함되어 있다. 메뉴 강조처럼 사이트 안의 경로만
// 비교해야 할 때 base를 걷어낸다.
export const stripBase = (pathname: string) => {
  const stripped = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return stripped === '' ? '/' : stripped;
};
