# 디자인 시스템

AUX Lab 사이트의 색, 글자, 간격, 컴포넌트 규칙. 새 페이지나 컴포넌트를 만들 때 이 문서를 따른다.
값은 모두 `src/styles/tokens.css`에 있다. **컴포넌트와 페이지에서 색이나 크기를 직접 쓰지 않고 토큰만 쓴다.**

## 원칙

1. **토큰만 쓴다.** `font-size: 1.2rem`, `color: #333` 같은 값을 직접 쓰지 않는다. 필요한 값이 없으면 먼저 토큰을 추가한다.
2. **글자는 16px보다 작게 쓰지 않는다.** 한글은 작으면 읽기 어렵다. 가장 작은 `--fs-small`도 16px 이상이다.
3. **글 덩어리(카드, 행, 섹션) 뒤에 회색 배경을 깔지 않는다.** 구분은 여백, 글자 크기 차이, 굵기로 한다. 예외는 페이지의 끝을 알리는 **푸터 띠 하나**뿐이다.
4. **붉은색은 hover와 포인트에만 쓴다.** 평소 화면은 흰색과 먹색이다. 붉은색을 면적이 큰 배경으로 쓰지 않는다.
5. **선(border)과 그림자를 쓰지 않는다.** 화면 위에 떠 있는 요소(모바일 메뉴)에만 그림자를 쓴다.

## 색

| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#ffffff` | 바탕 |
| `--ink` | `#0f1115` | 제목, 본문 |
| `--muted` | `#4b515b` | 보조 텍스트 (바탕 대비 7.9:1) |
| `--accent` | `#b82020` | 로고의 붉은색. hover, 분류 글자, 포인트 |
| `--accent-ink` | `#ffffff` | 붉은색 위의 글자 |

## 글자 크기 (역할로 고른다)

| 토큰 | 크기 | 용도 |
|---|---|---|
| `--fs-small` | 16-17px | 날짜, 분류, 캡션. 이보다 작게 쓰지 않는다 |
| `--fs-body` | 17-19px | 본문, 내비게이션 |
| `--fs-lead` | 20-24px | 리드 문장, 월 표시 |
| `--fs-subtitle` | 22-28px | 항목 제목 (소식, 논문, 프로젝트) |
| `--fs-heading` | 28-38px | 섹션 제목 |
| `--fs-title` | 40-68px | 페이지 제목 |
| `--fs-display` | 44-80px | 연도 같은 큰 숫자 |
| `--fs-hero` | 30-72px | 홈 히어로 제목 |

굵기는 `--fw-regular/medium/semibold/bold`, 줄 간격은 `--lh-tight/snug/body`, 자간은 `--ls-tight/heading`.

## 간격

`--space-1`(4px)부터 `--space-8`(72px)까지. 화면 바깥 여백은 `--margin`, 큰 섹션 사이는 `--section`, 서브페이지 섹션 사이는 `--section-tight`.

## 레이아웃: 기준선

서브페이지는 화면 폭 약 42% 지점의 세로 기준선을 공유한다. 왼쪽에는 라벨(연도, 항목 이름), 오른쪽에는 내용을 둔다. 직접 그리드를 짜지 말고 `Section`을 쓴다.

## 컴포넌트

| 컴포넌트 | 위치 | 용도 |
|---|---|---|
| `BaseLayout` | `layouts/` | 모든 페이지의 공통 셸 (head, 헤더, 푸터) |
| `PageLayout` | `layouts/` | 서브페이지 틀: 셸 + 페이지 제목 |
| `SiteHeader`, `SiteFooter` | `components/layout/` | 내비게이션, 푸터. 메뉴 항목은 `SiteHeader`의 `navLinks` 한 곳에서 관리 |
| `PageHeader` | `components/layout/` | 페이지 제목 (`PageLayout`이 쓴다) |
| `Section` | `components/layout/` | 기준선 레이아웃. `heading`, `aside` 슬롯, `large`(연도용) |
| `Button` | `components/ui/` | 한 가지 모양의 버튼. 평소 먹색, hover 때 붉은색 |
| `TextLink` | `components/ui/` | 밑줄 링크. 보조 동작은 버튼 대신 이걸 쓴다 |
| `Tag` | `components/ui/` | 분류 표시. 배경 없이 붉은 글자 |
| `NewsItem`, `ProjectItem` | `components/content/` | 목록의 항목 |
| `NewsTimeline` | `components/content/` | 점과 세로선을 따라 소식이 이어지는 목록. 홈과 소식 페이지가 같이 쓴다 |
| `PublicationItem` | `components/content/` | 논문 한 편. 제목이 링크이고 항목 전체가 클릭된다 |
| `MemberCard` | `components/content/` | 구성원 한 명. 사진, 이름, 직위, 관심 분야, 연락처 |
| `ResearchAreaItem` | `components/content/` | 연구 분야 한 항목 |
| `Avatar` | `components/ui/` | 구성원 사진. 사진이 없으면 이니셜 |
| `PdfViewer` | `components/ui/` | 페이지 안 PDF 미리보기. 화면에 200px 앞까지 와야 불러오고, 페이지 안 PDF를 못 보여주는 브라우저에서는 안내를 보여준다 |
| `WithToc`, `YearNav`, `YearSection` | `components/layout/` | 오른쪽에 연도 목차가 붙는 2단 레이아웃. 소식과 논문이 같이 쓴다 |
| `Hero` | `components/home/` | 홈 히어로. 도트 캔버스가 배경이고 글 주변은 옅게 처리한다 |

## 새 컴포넌트를 만들 때

1. 같은 역할의 컴포넌트가 이미 있는지 먼저 확인한다.
2. 스타일은 컴포넌트 안(`<style>`)에 두고 토큰만 쓴다.
3. 콘텐츠 데이터가 아니라 값(`title`, `date`)을 props로 받는다. 그래야 다른 곳에서도 재사용된다.
4. 페이지에서 반복되는 마크업이 3번 보이면 컴포넌트로 뺀다.

## 접근성

- **본문 바로가기**: 모든 페이지 맨 앞에 `본문으로 건너뛰기` 링크가 있고, 키보드 포커스가 올 때만 보인다. `BaseLayout`의 `<main>`은 `tabindex="-1"`이어야 이동한 뒤 포커스가 본문으로 간다.
- **포커스 표시**: `:focus-visible`에 2px 붉은 윤곽선을 쓴다. `outline: none`으로 지우지 않는다(바로가기로 이동한 `main`만 예외).
- **글자 크기와 대비**: 글자는 16px 이상, 본문 대비는 4.5:1 이상. 새 색을 쓰기 전에 대비를 확인한다.
- **이미지와 iframe**: 모든 `<img>`에 `alt`, 모든 `<iframe>`에 `title`을 쓴다. 장식용 이미지는 `alt=""`.
- **큰 파일은 미리 받지 않는다**: PDF처럼 용량이 큰 것은 화면에 가까워질 때 불러온다(`PdfViewer`). iframe의 `loading="lazy"`는 화면 아래 1250px 안쪽이면 미리 불러서 충분하지 않다.
