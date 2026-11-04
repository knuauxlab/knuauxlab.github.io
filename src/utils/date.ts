// 콘텐츠의 날짜는 'YYYY-MM' 또는 'YYYY-MM-DD' 문자열이다.
export const yearOf = (date: string) => date.slice(0, 4);

export const monthLabel = (date: string) => {
  const [, month, day] = date.split('-');
  return day ? `${Number(month)}월 ${Number(day)}일` : `${Number(month)}월`;
};
