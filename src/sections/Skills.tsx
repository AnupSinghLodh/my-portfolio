import ProcessStep from "../components/ui/ProcessStep";
import Reveal from "../components/ui/Reveal";
import Section from "../components/ui/Section";
import SkillCard from "../components/ui/SkillCard";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { processSteps, skillGroups, skillsSection } from "../data/content";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Technical Skills" title={skillsSection.title}>
      <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <StaggerItem
            key={group.title}
            variant="card"
            className={group.wide ? "md:col-span-2 lg:col-span-4" : undefined}
          >
            <SkillCard group={group} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-20">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ember">{skillsSection.processTitle}</h3>
      </Reveal>
      <Stagger as="ol" className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <StaggerItem as="li" key={step.title}>
            <ProcessStep step={step} index={index} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
