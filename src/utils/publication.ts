// 논문 제목이 가리킬 대표 링크를 고른다. DOI가 가장 확실하고, 없으면 arXiv, 소개 페이지, PDF 순서.
interface PublicationLinks {
  doi?: string;
  arxiv?: string;
  page?: string;
  pdf?: string;
}

export const primaryLink = (links: PublicationLinks) =>
  links.doi ?? links.arxiv ?? links.page ?? links.pdf;
