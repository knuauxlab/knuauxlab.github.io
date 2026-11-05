// content.config.ts의 enum 값을 화면에 보여줄 영어 라벨로 바꾼다.
export const newsCategoryLabels: Record<string, string> = {
  award: 'Award',
  paper: 'Paper',
  project: 'Project',
  member: 'Member',
  event: 'Event',
  other: 'General',
};

export const memberRoleLabels: Record<string, string> = {
  professor: 'Principal Investigator · Assistant Professor',
  phd: 'Ph.D. Student',
  ms: 'M.S. Student',
  integrated: 'B.S./M.S. Integrated Student',
  undergraduate: 'Undergraduate Researcher',
};
