// 주 메뉴 항목. id는 components/sections의 <section id>와 일치해야 한다 (e2e에서 검사).

export type NavItem = {
  id: string;
  label: string;
};

export const navItems: NavItem[] = [
  { id: "about", label: "소개" },
  { id: "projects", label: "프로젝트" },
  { id: "experience", label: "경력" },
  { id: "contact", label: "연락처" },
];
