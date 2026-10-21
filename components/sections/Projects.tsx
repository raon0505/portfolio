import Section from "@/components/ui/Section";
import { projects } from "@/data/projects";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <Section id="projects" title="프로젝트">
      {projects.length === 0 ? (
        <p>준비 중입니다.</p>
      ) : (
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project.slug}>
              <article>
                <h3>{project.title}</h3>
                {project.period && <p data-meta>{project.period}</p>}
                <p>{project.summary}</p>
                <ul aria-label="기술 스택">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                {project.links && project.links.length > 0 && (
                  <p>
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href}>
                        {link.label}
                      </a>
                    ))}
                  </p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
