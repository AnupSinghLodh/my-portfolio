import type { Transition, Variants } from "motion/react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export const springTap: Transition = { type: "spring", stiffness: 400, damping: 25 };

export type EntranceKind = "card" | "fade";

const softFade = { duration: 0.5, ease: "easeOut" } as const;

const entrances: Record<EntranceKind, Variants> = {
  card: {
    hidden: { opacity: 0, y: 48, scale: 0.96, rotateX: 8, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 110, damping: 18, mass: 0.9, opacity: softFade, filter: softFade },
    },
  },
  fade: {
    hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

const reducedEntrance: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export function entranceVariants(kind: EntranceKind, reducedMotion: boolean): Variants {
  return reducedMotion ? reducedEntrance : entrances[kind];
}
