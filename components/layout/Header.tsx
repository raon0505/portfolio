import Link from "next/link";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <a href="#main" data-skip-link>
        본문 바로가기
      </a>
      <nav aria-label="주 메뉴">
        <Link href="/">{profile.name}</Link>
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
