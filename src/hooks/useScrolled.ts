import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function useScrolled(threshold = 12): boolean {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > threshold));

  return scrolled;
}
