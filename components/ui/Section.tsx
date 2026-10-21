import type { ReactNode } from "react";
import styles from "./Section.module.css";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}
