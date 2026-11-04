# AUX Lab 웹사이트

경북대학교 AUX Lab(Augmented User eXperience Laboratory) 연구실 홈페이지. 한국어 단일 언어, GitHub Pages 정적 배포.

## 스택

- Astro 최신 안정판 (Node 22.23.4 이상 필요). Astro 5는 보안 패치가 없어 사용하지 않는다.
- 정적 출력만 사용한다. SSR, server islands, MDX는 쓰지 않는다.
- 서드파티 통합은 꼭 필요할 때만 추가한다.

## 콘텐츠 원칙

- 콘텐츠 수정자는 코딩을 모르는 교수님이다. 모든 콘텐츠는 Markdown/YAML 파일(content collections)로 두고, 코드를 건드리지 않고 GitHub 웹 화면에서 수정할 수 있어야 한다.
- 콘텐츠 스키마(필드, 날짜 형식)는 `src/content.config.ts`에서 검증한다. 형식이 틀리면 빌드가 실패해야 한다.
- 구성원, 논문, 프로젝트, 뉴스는 각각 별도 컬렉션이다.
- 화면에 보이는 문구는 한국어로 쓴다. 논문 제목, 저자, 학회/저널명, 사람 이름의 로마자 표기는 영어 원문을 그대로 둔다. enum 값(`paper`, `undergraduate` 등)을 화면에 그대로 보이지 말고 `src/utils/labels.ts`나 페이지의 라벨 맵으로 한국어로 바꿔 보여준다.

## 페이지 구성

Home, News, Members, Publications, Projects, Join Us, Contact

## 작업 방식

- 구현 전에 먼저 계획한다. 무엇을 어떻게 만들지, 대안은 무엇인지 짧게 정리한 뒤 구현한다.
- 디자인은 템플릿처럼 보이지 않게 한다. 기본 그라디언트, 과한 카드 그리드, 의미 없는 아이콘을 피한다.
- 변경 후에는 빌드가 통과하는지 확인한다.

## 스킬

출처와 업데이트 방법은 `.claude/THIRD_PARTY.md`에 있다.

- 새 기능이나 여러 파일에 걸친 변경은 구현 전에 `/ecc-plan`으로 계획을 세우고 승인받은 뒤 구현한다. 새 라이브러리나 도구를 도입할 때는 `search-first`로 기존 해법을 먼저 찾는다.
- 페이지나 컴포넌트의 시각 디자인을 만들거나 고칠 때는 `design-taste-frontend`를 쓴다. 연구실 사이트는 마케팅 랜딩 페이지가 아니므로, 연구 내용과 논문이 가장 잘 읽히는 방향을 우선한다.
- 작업을 마치면 `verification-loop`로 빌드와 결과를 확인한다.

## 브랜치 규칙

- `dev` 브랜치는 두지 않는다. 개발자가 1명이고 GitHub Pages는 한 브랜치만 배포하므로 `main` + 작업 브랜치로 충분하다.
- `main`은 항상 빌드가 통과하는 상태를 유지한다. 배포는 `main` 기준이다.
- 코드/디자인 변경은 브랜치에서 작업한 뒤 PR로 합친다. 브랜치 이름은 `feat/<주제>`, `fix/<주제>`, `chore/<주제>`.
- 콘텐츠 수정(`src/content/` 아래 파일)은 교수님이 GitHub 웹 화면에서 `main`에 직접 커밋해도 된다.
- 한 브랜치에는 한 가지 목적만 담는다.

## 커밋 규칙

- Conventional Commits 형식: `type(scope): 제목`. 제목은 한국어, 50자 안팎, 마침표 없음.
- type: `feat`, `fix`, `content`(콘텐츠 추가/수정), `style`(디자인), `refactor`, `docs`, `chore`.
- scope는 선택. 예: `members`, `publications`, `home`.
- 예: `content(news): 2026 학부연구생 합류 소식 추가`
- 본문에는 무엇을 바꿨는지보다 왜 바꿨는지를 적는다.
- 작업 단위마다 커밋한다. 한 커밋에는 한 가지 변경만 담는다.
- 커밋 전에 `npm run build`가 통과해야 한다.

## 배포

GitHub Pages. 배포는 콘텐츠와 디자인이 잡힌 뒤에 설정한다. 그때 `astro.config.mjs`의 `site`와 `base`를 맞춘다.
