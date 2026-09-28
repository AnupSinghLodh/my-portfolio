import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { entranceVariants, type EntranceKind } from "../../lib/motion";

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  variant?: EntranceKind;
};

export default function StaggerItem({ children, className, as = "div", variant = "fade" }: StaggerItemProps) {
  const reducedMotion = usePrefersReducedMotion();
  const props = {
    className,
    variants: entranceVariants(variant, reducedMotion),
    // rotateX needs its own perspective, since the item has no 3D-aware parent.
    style: variant === "card" ? { transformPerspective: 900 } : undefined,
  };

  if (as === "li") return <motion.li {...props}>{children}</motion.li>;
  return <motion.div {...props}>{children}</motion.div>;
}
