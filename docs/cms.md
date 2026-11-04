# 웹에서 콘텐츠 수정하기 (CMS)

코드나 파일을 몰라도 입력 폼으로 소식, 논문, 구성원 등을 고칠 수 있는 관리 화면이다.
[Sveltia CMS](https://sveltiacms.app)를 쓰며, 저장하면 GitHub에 자동으로 커밋되고 몇 분 뒤 사이트에 반영된다.

- **관리 화면 주소**: https://knuauxlab.github.io/lab_website/admin/
- **설정 파일**: `public/admin/config.yml` (필드는 `src/content.config.ts`와 맞춘다)

## 고칠 수 있는 것
소식, 논문, 프로젝트, 구성원(사진 포함), 연구 분야, 연구실 기본 정보, 모집 안내.

## 시작하기 전에 필요한 것

### 편집하는 사람 (교수님)
1. GitHub 계정
2. 저장소 `knuauxlab/lab_website`의 **쓰기(Write) 권한** (아래 "소유자가 할 일" 참고)
3. 로그인용 토큰 한 번 만들기 (5분)
   1. https://github.com/settings/personal-access-tokens/new 접속
   2. Token name: `AUX Lab CMS`, Expiration: 1년 정도
   3. **Repository access → Only select repositories → `lab_website`**
   4. **Permissions → Repository permissions → Contents → Read and write**
   5. Generate token을 누르고 나온 `github_pat_...` 문자열을 복사한다. 이 화면을 닫으면 다시 볼 수 없다.

### 사용 방법
1. 관리 화면 주소에 접속해 **"액세스 토큰으로 로그인"**을 누르고 복사한 토큰을 붙여넣는다. 토큰은 이 브라우저에만 저장된다.
2. 왼쪽 메뉴에서 수정할 항목(소식, 논문 등)을 고르고, 새로 만들거나 기존 항목을 연다.
3. 입력하고 **저장**을 누르면 `main`에 바로 반영(커밋)된다.
4. 몇 분 뒤 사이트에 나타난다. 진행 상황은 저장소의 Actions 탭에서 볼 수 있다.

작성 중인 글은 **"임시 저장"**을 체크하면 사이트에 나타나지 않는다.

## 알아둘 것
- 저장은 "미리보기"가 아니라 **바로 공개**다. 확인이 필요하면 임시 저장으로 두었다가 체크를 풀면 된다.
- 날짜, 주소(https://), 이메일 형식이 틀리면 폼이 막고 어떻게 고칠지 알려준다.
- 그래도 빌드가 실패하면 **사이트는 이전 상태 그대로 유지**된다(배포가 중단된다). Actions 탭의 빨간 표시를 보고 개발자에게 알린다.
- 토큰이 만료되거나 유출이 의심되면 GitHub 설정에서 지우고 새로 만든다.
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
