import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type ParallaxProps = { children: ReactNode; offset: number; className?: string };

/** Drifts its children from +offset to -offset px while it crosses the viewport (lg screens only). */
export default function Parallax({ children, offset, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  const enabled = wide && !reducedMotion;

  return (
    <motion.div ref={ref} className={className} style={enabled ? { y } : undefined}>
      {children}
    </motion.div>
  );
}
