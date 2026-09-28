import type { ReactNode } from "react";
import type { SectionId } from "../../types";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type SectionProps = { id: SectionId; eyebrow: string; title: string; children: ReactNode };

export default function Section({ id, eyebrow, title, children }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} id={headingId} />
      </Reveal>
      {children}
    </section>
  );
}
