// npm install 때 실행되어 git 훅 폴더(.githooks)를 이 저장소의 훅 경로로 지정한다.
// git 저장소가 아니거나(예: 배포 서버의 소스 압축본) git이 없으면 조용히 넘어간다.
import { execSync } from 'node:child_process';
import fs from 'node:fs';

if (!fs.existsSync('.git') || !fs.existsSync('.githooks')) process.exit(0);

try {
  execSync('git config core.hooksPath .githooks', { stdio: 'ignore' });
  console.log('git 훅을 설치했습니다 (.githooks): 커밋 전에 빌드와 검사가 실행됩니다.');
} catch {
  // git을 쓸 수 없는 환경이면 훅 없이 진행한다
}
