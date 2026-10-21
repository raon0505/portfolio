import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Experience from "@/components/sections/Experience";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main id="main" className={styles.main}>
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}
