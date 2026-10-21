import Section from "@/components/ui/Section";
import { profile } from "@/data/profile";
import styles from "./Contact.module.css";

export default function Contact() {
  const links = profile.links ?? [];
  const hasContact = Boolean(profile.email) || links.length > 0;

  return (
    <Section id="contact" title="연락처">
      {hasContact ? (
        <ul className={styles.list}>
          {profile.email && (
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
          )}
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>준비 중입니다.</p>
      )}
    </Section>
  );
}
