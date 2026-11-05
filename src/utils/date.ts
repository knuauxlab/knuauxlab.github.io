// 콘텐츠의 날짜는 'YYYY-MM' 또는 'YYYY-MM-DD' 문자열이다.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const yearOf = (date: string) => date.slice(0, 4);

export const monthLabel = (date: string) => {
  const [, month, day] = date.split('-');
  const m = MONTHS[Number(month) - 1] ?? month;
  return day ? `${m} ${Number(day)}` : m;
};
