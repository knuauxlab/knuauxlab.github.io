// 입력 순서를 유지한 채 key별로 묶는다. 연도별 목록처럼 이미 정렬된 데이터에 쓴다.
export const groupBy = <T,>(items: T[], key: (item: T) => string): [string, T[]][] => {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = groups.get(k);
    if (list) list.push(item);
    else groups.set(k, [item]);
  }
  return [...groups.entries()];
};
