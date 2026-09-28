import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import AchievementCard from "../components/ui/AchievementCard";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import TimelineItem from "../components/ui/TimelineItem";
import { achievements, educationSection, timeline } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <Section id="education" eyebrow="Education & Achievements" title={educationSection.title}>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div ref={timelineRef} className="relative">
          <div aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reducedMotion ? 1 : scaleY }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-ember"
          />
          <Stagger as="ol" className="space-y-10">
            {timeline.map((entry) => (
              <StaggerItem as="li" key={entry.title}>
                <TimelineItem entry={entry} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Stagger className="space-y-4">
          {achievements.map((achievement) => (
            <StaggerItem key={achievement.title} variant="card">
              <AchievementCard achievement={achievement} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
