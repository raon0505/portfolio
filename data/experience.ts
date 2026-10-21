// 사용자가 제공한 경력만 추가한다. 회사명·기간·수치를 지어내지 않는다.

export type Experience = {
  company: string;
  role: string;
  /** 예: "2023.01 – 현재" */
  period: string;
  highlights?: string[];
};

// TODO: 사용자 제공 후 채움
export const experience: Experience[] = [];
