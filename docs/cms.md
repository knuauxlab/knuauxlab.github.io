# 웹에서 콘텐츠 수정하기 (CMS)

코드나 파일을 몰라도 입력 폼으로 소식, 논문, 구성원 등을 고칠 수 있는 관리 화면이다.
[Sveltia CMS](https://sveltiacms.app)를 쓰며, 저장하면 GitHub에 자동으로 커밋되고 몇 분 뒤 사이트에 반영된다.

> **편집하는 사람과 인수인계 받는 사람은 [docs/guide.md](guide.md)를 본다.** 토큰 만들기와 갱신, 항목별 입력법, 문제 해결을 캡처와 함께 설명한다. 이 문서는 설정과 개발자용 내용만 다룬다.

- **관리 화면 주소**: https://knuauxlab.github.io/lab_website/admin/
- **설정 파일**: `public/admin/config.yml` (필드는 `src/content.config.ts`와 맞춘다)

## 고칠 수 있는 것
소식, 논문, 프로젝트, 구성원(사진 포함), 연구 분야, 연구실 기본 정보, 모집 안내.

## 사용 방법 요약

1. 관리 화면에서 **액세스 토큰으로 로그인**하고 토큰(Contents: Read and write, `lab_website` 한 저장소)을 붙여넣는다. 토큰 만드는 방법과 갱신은 [가이드의 2장](guide.md#2-토큰-만들기와-갱신하기).
2. 왼쪽 메뉴에서 항목을 고르고 입력한 뒤 **저장**하면 `main`에 바로 반영(커밋)된다.
3. 1~2분 뒤 사이트에 나타난다. 진행 상황은 저장소의 Actions 탭에서 볼 수 있다.

작성 중인 글은 **"임시 저장"**을 체크하면 사이트에 나타나지 않는다.

## 알아둘 것
- 저장은 "미리보기"가 아니라 **바로 공개**다. 확인이 필요하면 임시 저장으로 두었다가 체크를 풀면 된다.
- 날짜, 주소(https://), 이메일 형식이 틀리면 폼이 막고 어떻게 고칠지 알려준다.
- 그래도 빌드가 실패하면 **사이트는 이전 상태 그대로 유지**된다(배포가 중단된다). 해결은 [가이드의 6장](guide.md#6-자주-나는-문제와-해결).
- 콘텐츠 스키마는 비워 둔 선택 항목(`''`)을 값이 없는 것으로 본다. 관리 화면이 선택 항목을 빈 문자열로 저장하기 때문이다.
- 구성원 사진은 얼굴이 가운데 오는 정사각형이 가장 잘 나온다.

## 소유자가 할 일
저장소 소유자(관리자)만 할 수 있다.

1. **Pages 켜기**: Settings → Pages → Build and deployment → Source를 `GitHub Actions`로 바꾼다.
2. **편집자 추가**: Settings → Collaborators → Add people로 교수님 계정을 초대하고 **Write** 권한을 준다.
3. (선택) **"GitHub로 로그인" 버튼으로 바꾸기**: 토큰을 붙여넣는 대신 GitHub 로그인 한 번으로 들어오게 한다. GitHub OAuth 앱을 등록하고 [Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth)를 Cloudflare Workers에 배포한 뒤 `config.yml`의 `backend`에 `base_url: https://<워커 주소>`를 추가한다. GitHub는 아직 서버 없는 로그인(PKCE)을 지원하지 않아 이 방식이 필요하다.

## 개발자용

### 내 컴퓨터에서 시험하기
토큰 없이 로컬 파일을 고칠 수 있다. Chrome이나 Edge가 필요하다.
1. `npm run dev`
2. `http://localhost:<포트>/lab_website/admin/index.html` 접속 (개발 서버에서는 `index.html`까지 적어야 한다)
3. **"로컬 저장소로 작업"**을 누르고 프로젝트 폴더를 고른다. 저장하면 파일이 바뀌고, 커밋은 직접 한다.

### 설정을 바꿀 때
콘텐츠 스키마(`src/content.config.ts`)에 필드를 추가하면 `public/admin/config.yml`에도 같은 필드를 추가해야 교수님이 폼에서 고칠 수 있다.
`npm run check:cms`가 어긋난 곳(설정에 없는 필드, 옵션에 없는 값)을 알려준다. CI에서도 돌아서 어긋나면 배포되지 않는다.

### Sveltia CMS 버전 올리기
`public/admin/index.html`은 버전을 고정하고 무결성 해시(`integrity`)를 걸어 둔다. 올릴 때는 새 버전의 해시를 다시 계산해 함께 바꾼다.

```
npm view @sveltia/cms version
curl -sL https://unpkg.com/@sveltia/cms@<버전>/dist/sveltia-cms.js | openssl dgst -sha384 -binary | openssl base64 -A
```

나온 값을 `integrity="sha384-..."` 뒤에 붙이고, 로컬 모드로 열어 로그인 화면이 정상인지 확인한다. 아직 1.0 이전 버전이라 올릴 때 변경 내용을 확인한다.

### 파일명 규칙
파일명은 ASCII로만 만든다(`config.yml`의 `slug`). 한글 제목을 쓰는 소식, 프로젝트, 연구 분야는 짧은 임의 ID를 쓰고, 영문 이름을 쓰는 구성원과 논문은 영문에서 따온다.
