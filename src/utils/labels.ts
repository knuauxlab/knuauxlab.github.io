// content.config.ts의 enum 값을 화면에 보여줄 한국어 라벨로 바꾼다.
export const newsCategoryLabels: Record<string, string> = {
  award: '수상',
  paper: '논문',
  project: '과제',
  member: '구성원',
  event: '행사',
  other: '일반',
};

export const memberRoleLabels: Record<string, string> = {
  professor: '지도교수 · 조교수',
  phd: '박사과정',
  ms: '석사과정',
  integrated: '학석사 연계과정',
  undergraduate: '학부연구생',
};
