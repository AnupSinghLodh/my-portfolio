import Parallax from "../components/ui/Parallax";
import ProjectCard from "../components/ui/ProjectCard";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { projects, projectsSection } from "../data/content";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title={projectsSection.title}>
      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <StaggerItem key={project.id} variant="card">
            {/* The middle column drifts against the outer ones for depth. */}
            <Parallax offset={index % 3 === 1 ? -36 : 36} className="h-full">
              <ProjectCard project={project} />
            </Parallax>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
