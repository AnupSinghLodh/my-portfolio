import { useInView } from "motion/react";
import { useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import BlurText from "../reactbits/BlurText";
import RotatingText from "../reactbits/RotatingText";
import ShinyText from "../reactbits/ShinyText";
import Button from "../ui/Button";

type HeroContentProps = {
  label: string;
  name: string;
  rotatingStack: string[];
  summary: string;
  email: string;
};

export default function HeroContent({ label, name, rotatingStack, summary, email }: HeroContentProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  return (
    <div ref={ref} className="max-w-2xl">
      <ShinyText
        text={label}
        speed={3}
        color="#b4b9c2"
        shineColor="#ffb08a"
        disabled={reducedMotion || !inView}
        className="font-mono text-xs uppercase tracking-[0.3em]"
      />
      <h1
        id="hero-title"
        aria-label={name}
        className="mt-5 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl"
      >
        {reducedMotion ? (
          name
        ) : (
          <span aria-hidden="true">
            <BlurText text={name} delay={120} animateBy="words" direction="top" />
          </span>
        )}
      </h1>
      <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-ink/80 sm:text-xl">
        <span>I build with</span>
        <RotatingText
          texts={rotatingStack}
          auto={!reducedMotion}
          rotationInterval={2200}
          staggerFrom="last"
          staggerDuration={0.02}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          mainClassName="overflow-hidden rounded-md bg-ember/10 px-2 py-0.5 text-ember-soft"
          splitLevelClassName="overflow-hidden"
        />
      </p>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/75">{summary}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={`mailto:${email}`}>Email me</Button>
        <Button href="#projects" variant="outline">
          View projects
        </Button>
      </div>
    </div>
  );
}
