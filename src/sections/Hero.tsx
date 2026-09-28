import { useRef } from "react";
import HeroBackground from "../components/hero/HeroBackground";
import HeroContent from "../components/hero/HeroContent";
import HeroStats from "../components/hero/HeroStats";
import { hero, heroStats } from "../data/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden"
    >
      <HeroBackground trackingRef={sectionRef} />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <HeroContent {...hero} />
        <HeroStats stats={heroStats} />
      </div>
    </section>
  );
}
