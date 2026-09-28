import { motion } from "motion/react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { springTap } from "../../lib/motion";
import type { Project } from "../../types";
import DecryptedText from "../reactbits/DecryptedText";
import SpotlightCard from "../reactbits/SpotlightCard";
import Tag from "./Tag";

type ProjectCardProps = { project: Project };

export default function ProjectCard({ project }: ProjectCardProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.article className="h-full" whileHover={{ y: -6 }} transition={springTap}>
      <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
        <div className="mb-6 flex items-center justify-between font-mono text-xs text-muted">
          <span className="text-ember">{project.id}</span>
          <span>{project.period}</span>
        </div>
        <h3 className="text-xl font-semibold text-ink">
          {reducedMotion ? (
            project.title
          ) : (
            <DecryptedText
              text={project.title}
              animateOn="hover"
              speed={40}
              maxIterations={12}
              sequential
              className="text-ink"
              encryptedClassName="text-ember"
            />
          )}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </ul>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 text-sm font-semibold text-ember-soft hover:text-ember"
          >
            View project →
          </a>
        )}
      </SpotlightCard>
    </motion.article>
  );
}
