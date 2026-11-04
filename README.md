# AUX Lab 웹사이트

경북대학교 AUX Lab(Augmented User eXperience Laboratory) 연구실 홈페이지.
Astro로 만든 정적 사이트이고 GitHub Pages로 배포한다. 주소는 https://knuauxlab.github.io/lab_website/

## 개발

Node 22.23.4 이상이 필요하다.

```
npm install
npm run dev          # 개발 서버
npm run build        # 빌드 (콘텐츠 형식이 틀리면 여기서 실패한다)
npm run check:links  # 빌드 결과의 내부 링크 검사 (build 다음에 실행)
```

## 콘텐츠 수정

모든 콘텐츠는 `src/content/` 아래의 Markdown/YAML 파일이다. 코드를 건드리지 않고 파일만 고치면 된다.
GitHub 웹 화면에서 파일을 열어 연필 아이콘으로 수정하고 `main`에 커밋하면 자동으로 배포된다.

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

## 더 알아보기

- 색, 글자 크기, 컴포넌트 규칙: [docs/design-system.md](docs/design-system.md)
- 브랜치, 커밋 규칙과 작업 방식: [CLAUDE.md](CLAUDE.md)
