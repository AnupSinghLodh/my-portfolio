import { motion, useScroll, useTransform } from "motion/react";
import { useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

const gridClassName =
  "absolute -inset-y-[20%] inset-x-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_70%)]";

/** Fixed glow + grid behind the sections; fades in once the hero scrolls away. */
export default function AmbientBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const [viewportHeight] = useState(() => window.innerHeight);
  const { scrollY, scrollYProgress } = useScroll();

  const opacity = useTransform(scrollY, [viewportHeight * 0.4, viewportHeight * 0.95], [0, 1]);
  const emberX = useTransform(scrollYProgress, [0, 1], ["-15vw", "45vw"]);
  const emberY = useTransform(scrollYProgress, [0, 1], ["0vh", "50vh"]);
  const coolX = useTransform(scrollYProgress, [0, 1], ["55vw", "0vw"]);
  const coolY = useTransform(scrollYProgress, [0, 1], ["45vh", "0vh"]);
  const gridY = useTransform(scrollY, (y) => -(y * 0.06) % 64);

  return (
    <motion.div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ opacity }}>
      <motion.div className={gridClassName} style={reducedMotion ? undefined : { y: gridY }} />
      <motion.div
        className="absolute left-0 top-0 size-[44rem] rounded-full bg-[radial-gradient(circle,rgba(255,111,55,0.14),transparent_65%)]"
        style={reducedMotion ? { x: "10vw", y: "15vh" } : { x: emberX, y: emberY }}
      />
      <motion.div
        className="absolute left-0 top-0 size-[38rem] rounded-full bg-[radial-gradient(circle,rgba(70,199,181,0.09),transparent_65%)]"
        style={reducedMotion ? { x: "50vw", y: "40vh" } : { x: coolX, y: coolY }}
      />
    </motion.div>
  );
}
