import Section from "@/components/ui/Section";
import { experience } from "@/data/experience";
import styles from "./Experience.module.css";

export default function Experience() {
  return (
    <Section id="experience" title="경력">
      {experience.length === 0 ? (
        <p>준비 중입니다.</p>
      ) : (
        <ol className={styles.list}>
          {experience.map((item) => (
            <li key={`${item.company}-${item.period}`}>
              <h3>
                {item.company} · {item.role}
              </h3>
              <p data-meta>{item.period}</p>
              {item.highlights && item.highlights.length > 0 && (
                <ul>
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
