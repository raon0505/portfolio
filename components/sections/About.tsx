import Section from "@/components/ui/Section";
import { profile } from "@/data/profile";

export default function About() {
  return (
    <Section id="about" title="소개">
      <p>{profile.summary ?? "준비 중입니다."}</p>
    </Section>
  );
}
