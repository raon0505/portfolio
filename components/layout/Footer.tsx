import { profile } from "@/data/profile";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {profile.name}</p>
    </footer>
  );
}
