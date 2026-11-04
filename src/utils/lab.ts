import { getCollection } from 'astro:content';

// content/lab/info.yaml이 없을 때를 대비한 기본값. 페이지마다 따로 들고 있지 않도록 한 곳에 둔다.
const defaults = {
  name: 'AUX Lab',
  fullName: 'Augmented User eXperience Laboratory',
  tagline: '멀티센서리 미디어, 햅틱, HCI, 가상현실',
  intro:
    'AUX Lab은 경북대학교에서 멀티센서리 미디어와 인간-컴퓨터 상호작용을 연구하며, AI로 소리와 시각 자극에서 실시간 햅틱 효과를 만드는 데 집중합니다.',
  affiliation: '경북대학교 공과대학',
  address: '대구광역시 북구 대학로 80 (41566), 공과대학 9호관',
  email: 'gyeoreyun@knu.ac.kr',
  phone: '053-950-7554' as string | undefined,
};

export const getLabInfo = async () => {
  const entries = await getCollection('lab');
  return entries[0]?.data ?? defaults;
};
