import { useInView } from "motion/react";
import { useRef } from "react";
import GradientText from "../components/reactbits/GradientText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { contact, socialLinks } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const headingClassName = "text-4xl font-semibold tracking-tight md:text-6xl";

export default function Contact() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section ref={sectionRef} id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <SpotlightCard className="px-6 py-14 text-center md:px-16 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ember">Contact</p>
          <div className="mx-auto mt-4 max-w-3xl">
            {reducedMotion ? (
              <h2
                id="contact-title"
                className={`${headingClassName} bg-linear-to-r from-ember to-ember-soft bg-clip-text text-transparent`}
              >
                {contact.title}
              </h2>
            ) : (
              <GradientText colors={["#ff6f37", "#ffb08a", "#46c7b5", "#ff6f37"]} animationSpeed={8} paused={!inView}>
                <h2 id="contact-title" className={headingClassName}>
                  {contact.title}
                </h2>
              </GradientText>
            )}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-muted">{contact.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link, index) => (
              <Button key={link.label} href={link.href} variant={index === 0 ? "primary" : "outline"} external={link.external}>
                {link.cta}
              </Button>
            ))}
          </div>
        </SpotlightCard>
      </Reveal>
    </section>
  );
}
