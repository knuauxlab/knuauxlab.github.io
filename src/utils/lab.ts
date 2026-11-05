import { getCollection } from 'astro:content';

// content/lab/info.yaml이 없을 때를 대비한 기본값. 페이지마다 따로 들고 있지 않도록 한 곳에 둔다.
const defaults = {
  name: 'AUX Lab',
  fullName: 'Augmented User eXperience Laboratory',
  tagline: 'Multisensory Media, Haptics, HCI, Virtual Reality',
  intro:
    'AUX Lab at Kyungpook National University researches multisensory media and human-computer interaction, focusing on real-time haptic effects generated from audio and visual stimuli.',
  affiliation: 'College of Engineering, Kyungpook National University',
  address: 'Engineering Building 9, 80 Daehak-ro, Buk-gu, Daegu 41566, Republic of Korea',
  email: 'gyeoreyun@knu.ac.kr',
  phone: '053-950-7554' as string | undefined,
};

export const getLabInfo = async () => {
  const entries = await getCollection('lab');
  return entries[0]?.data ?? defaults;
};
