import RoleCard from "../components/ui/RoleCard";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={experience.title}>
      <Stagger className="space-y-6">
        {experience.roles.map((role) => (
          <StaggerItem key={role.company} variant="card">
            <RoleCard role={role} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
