import SpotlightCard from "../components/reactbits/SpotlightCard";
import Reveal from "../components/ui/Reveal";
import Section from "../components/ui/Section";
import { about, quickFacts } from "../data/content";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title={about.title}>
      <Reveal className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted md:text-lg">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <SpotlightCard className="p-6">
          <dl className="divide-y divide-line">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="text-right text-sm font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}
