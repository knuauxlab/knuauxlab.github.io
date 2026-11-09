# AUX Lab 웹사이트

경북대학교 AUX Lab(Augmented User eXperience Laboratory) 연구실 홈페이지.
Astro로 만든 정적 사이트이고 GitHub Pages로 배포한다. 주소는 https://knuauxlab.github.io/lab_website/

## 개발

Node 22.23.4 이상이 필요하다.

`npm install`을 하면 git 훅이 자동으로 설치된다. 이후 커밋할 때마다 빌드, 링크 검사, CMS 설정 검사(`npm run build:ci`)가 먼저 실행되고, 하나라도 실패하면 커밋이 막힌다. 문서만 바뀐 커밋은 건너뛴다. 급할 때는 `git commit --no-verify`로 건너뛸 수 있지만 CI에서는 그대로 걸린다.

```
npm install
npm run dev          # 개발 서버
npm run build        # 빌드 (콘텐츠 형식이 틀리면 여기서 실패한다)
npm run check:links  # 빌드 결과의 내부 링크 검사 (build 다음에 실행)
```

## 콘텐츠 수정

모든 콘텐츠는 `src/content/` 아래의 Markdown/YAML 파일이다. 코드를 건드리지 않고 파일만 고치면 된다.
**비개발자(교수님)는 관리 화면에서 폼으로 수정한다.** https://knuauxlab.github.io/lab_website/admin/ 에 접속해 GitHub 토큰으로 로그인하면 되고, 저장하면 자동으로 커밋되어 몇 분 뒤 반영된다. 사용법과 토큰 갱신, 문제 해결은 **[관리 가이드(docs/guide.md)](docs/guide.md)**, 설정은 [docs/cms.md](docs/cms.md)에 있다.

개발자는 GitHub 웹 화면에서 파일을 열어 연필 아이콘으로 수정하고 `main`에 커밋해도 같은 결과다.

| 바꾸려는 것 | 위치 | 비고 |
|---|---|---|
| 소식 | `news/2026-04-제목.md` | `date`는 `2026-04` 또는 `2026-04-15` 형식 |
| 논문 | `publications/` | 제목을 누르면 `links.doi` → `arxiv` → `page` → `pdf` 순으로 먼저 있는 링크로 이동 |
| 구성원 | `members/` | 사진은 `src/assets/members/`에 넣고 `photo:`에 경로를 적는다. 졸업하면 `status: alumni` |
| 프로젝트 | `projects/` | `end`를 비우면 진행 중 |
| 연구 분야 | `research-areas/` | `order` 순서대로 홈에 보인다 |
| 연구실 정보 | `lab/info.yaml` | 홈, 푸터, 연락처에 쓰인다 |
| 모집 안내 | `joinus/index.md` | `draft: false`로 바꾸면 기본 안내 문구 대신 이 글이 보인다 |

작성 중인 항목은 `draft: true`로 두면 사이트에 나타나지 않는다. 형식이 틀리면 빌드가 실패하고 무엇을 고칠지 알려준다.

## 배포

`main`에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드하고 링크를 검사한 뒤 배포한다.
PR에서는 빌드와 링크 검사만 돌고 배포는 하지 않는다. 링크가 하나라도 깨지면 배포 전에 실패한다.

저장소 Settings → Pages → Build and deployment의 Source가 **GitHub Actions**여야 한다.
커스텀 도메인으로 옮기면 `astro.config.mjs`의 `site`를 바꾸고 `base` 줄을 지운다.

## 검색과 공유

- 모든 페이지에 검색 결과용 `description`, 완전한 주소의 `canonical`, 링크 공유 미리보기용 Open Graph 태그(`public/og-image.png`, 1200×630)가 들어간다. 새 서브페이지는 `PageLayout`에 `description`을 꼭 넘긴다.
- `sitemap-index.xml`이 빌드 때 자동 생성된다(404 제외). 검색에 노출하려면 Google Search Console과 네이버 서치어드바이저에 `https://knuauxlab.github.io/lab_website/sitemap-index.xml`을 등록한다.
- `robots.txt`는 두지 않았다. 프로젝트 페이지는 `knuauxlab.github.io/robots.txt`(도메인 루트)만 크롤러가 읽는데 그 파일은 이 저장소 소관이 아니다. 관리 화면(`/admin/`)은 페이지의 `noindex`로 막혀 있다.
- `npm run check:seo`가 빠진 메타 태그, 없는 og:image, sitemap 누락을 찾고 CI에서도 돈다.

## 더 알아보기

- 색, 글자 크기, 컴포넌트 규칙: [docs/design-system.md](docs/design-system.md)
- 브랜치, 커밋 규칙과 작업 방식: [CLAUDE.md](CLAUDE.md)
