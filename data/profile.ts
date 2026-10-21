// 사용자가 제공한 사실만 채운다. 모르는 값은 비워 두면 화면에 "준비 중"으로 표시된다.

export type ProfileLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  /** 한 줄 소개 (예: 직무) */
  role?: string;
  /** 소개 섹션 본문 */
  summary?: string;
  /** 공개해도 되는 연락 수단만. 전화번호 등은 사용자 확인 후 추가 */
  email?: string;
  links?: ProfileLink[];
};

export const profile: Profile = {
  name: "이승환",
  // TODO: role, summary, email, links — 사용자 제공 후 채움
};
