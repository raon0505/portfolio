// 사용자가 제공한 프로젝트만 추가한다. 지어내지 않는다.

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  /** /projects/[slug] 상세 페이지 확장용 */
  slug: string;
  title: string;
  summary: string;
  /** 기술명은 원문 표기 (React, Next.js, AWS) */
  stack: string[];
  /** 예: "2025.03 – 2025.08" */
  period?: string;
  links?: ProjectLink[];
};

// TODO: 사용자 제공 후 채움
export const projects: Project[] = [];
