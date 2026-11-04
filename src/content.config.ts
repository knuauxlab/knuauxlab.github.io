import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 콘텐츠는 교수님이 폼(CMS)으로 수정한다. 형식이 틀리면 빌드가 실패하도록
// 오류 메시지는 무엇을 고쳐야 하는지 한국어로 알려준다.

const isRealDate = (text: string) => {
  const [y, m, d = 1] = text.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
};

// 'YYYY-MM' 또는 'YYYY-MM-DD'. 일자를 모르는 소식은 월까지만 적을 수 있다.
// YAML이 따옴표 없는 날짜를 Date로 바꿔 읽는 경우도 문자열로 되돌려 받는다.
const dateText = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z
    .string({ error: '날짜는 2026-04 또는 2026-04-15 형식으로 입력하세요.' })
    .regex(/^\d{4}-\d{2}(-\d{2})?$/, '날짜는 2026-04 또는 2026-04-15 형식으로 입력하세요.')
    .refine(isRealDate, '존재하지 않는 날짜입니다.'),
);

const monthText = z
  .string({ error: '월은 2026-04 형식으로 입력하세요.' })
  .regex(/^\d{4}-\d{2}$/, '월은 2026-04 형식으로 입력하세요.')
  .refine(isRealDate, '존재하지 않는 월입니다.');

const year = z
  .number({ error: '연도는 숫자로 입력하세요. 예: 2025' })
  .int()
  .min(2000)
  .max(2100);

const url = z.url({ error: 'https:// 로 시작하는 올바른 주소를 입력하세요.' });

// 작성 중인 항목은 draft: true로 두면 사이트에 표시하지 않는다.
const draft = z.boolean().default(false);

const members = defineCollection({
  loader: glob({ base: './src/content/members', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      name: z.string().min(1, '이름을 입력하세요.'),
      nameKo: z.string().optional(),
      role: z.enum(['professor', 'phd', 'ms', 'integrated', 'undergraduate'], {
        error: 'role은 professor, phd, ms, integrated, undergraduate 중 하나여야 합니다.',
      }),
      // 졸업·수료한 구성원은 alumni로 바꾸면 졸업생 목록으로 옮겨진다.
      status: z.enum(['current', 'alumni']).default('current'),
      photo: image().optional(),
      email: z.email({ error: '올바른 이메일 주소를 입력하세요.' }).optional(),
      interests: z.array(z.string()).default([]),
      links: z
        .object({
          homepage: url.optional(),
          github: url.optional(),
          scholar: url.optional(),
        })
        .default({}),
      joined: year.optional(),
      order: z.number().default(100),
      draft,
    }),
});

const publications = defineCollection({
  loader: glob({ base: './src/content/publications', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1, '논문 제목을 입력하세요.'),
    authors: z.array(z.string()).min(1, '저자를 한 명 이상 입력하세요.'),
    venue: z.string().min(1, '게재된 학회/저널 이름을 입력하세요.'),
    year,
    type: z.enum(['conference', 'journal', 'preprint'], {
      error: 'type은 conference, journal, preprint 중 하나여야 합니다.',
    }),
    award: z.string().optional(),
    links: z
      .object({
        doi: url.optional(),
        arxiv: url.optional(),
        pdf: url.optional(),
        // DOI가 없을 때 쓰는 논문 소개 페이지(저자 사이트 등)
        page: url.optional(),
      })
      .default({}),
    draft,
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1, '과제명을 입력하세요.'),
    funder: z.string().min(1, '지원 기관을 입력하세요.'),
    pi: z.string().optional(),
    start: monthText,
    // 비워두면 진행 중인 과제로 본다.
    end: monthText.optional(),
    summary: z.string().optional(),
    draft,
  }),
});

const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/[^_]*.md' }),
  schema: z.object({
    date: dateText,
    title: z.string().min(1, '제목을 입력하세요.'),
    category: z.enum(['award', 'paper', 'project', 'member', 'event', 'other'], {
      error: 'category는 award, paper, project, member, event, other 중 하나여야 합니다.',
    }),
    draft,
  }),
});

const researchAreas = defineCollection({
  loader: glob({ base: './src/content/research-areas', pattern: '**/[^_]*.md' }),
  schema: z.object({
    title: z.string().min(1, '연구 분야 이름을 입력하세요.'),
    summary: z.string().min(1, '한두 문장으로 요약을 입력하세요.'),
    order: z.number().default(100),
    draft,
  }),
});

// 연구실 기본 정보. 홈과 연락처에서 쓴다. 파일은 lab/info.yaml 하나.
const lab = defineCollection({
  loader: glob({ base: './src/content/lab', pattern: '**/[^_]*.yaml' }),
  schema: z.object({
    name: z.string().min(1),
    fullName: z.string().optional(),
    tagline: z.string().min(1, '홈 화면에 쓸 한 줄 소개를 입력하세요.'),
    intro: z.string().min(1, '연구실 소개글을 입력하세요.'),
    affiliation: z.string().min(1),
    address: z.string().min(1),
    email: z.email({ error: '올바른 이메일 주소를 입력하세요.' }),
    phone: z.string().optional(),
  }),
});

// 학부연구생 모집 안내. 파일은 joinus/index.md 하나.
const joinus = defineCollection({
  loader: glob({ base: './src/content/joinus', pattern: '**/[^_]*.md' }),
  schema: z.object({
    recruiting: z.boolean({ error: 'recruiting은 true 또는 false여야 합니다.' }),
    draft,
  }),
});

export const collections = {
  members,
  publications,
  projects,
  news,
  researchAreas,
  lab,
  joinus,
};
