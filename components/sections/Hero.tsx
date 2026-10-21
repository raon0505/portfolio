import { profile } from "@/data/profile";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className={styles.hero}>
      <h1 id="hero-title">{profile.name}</h1>
      {profile.role && <p>{profile.role}</p>}
    </section>
  );
}
