import { motion } from "motion/react";
import type { ReactNode } from "react";
import { staggerContainer } from "../../lib/motion";

type StaggerProps = { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" };

const viewport = { once: true, amount: 0.1 } as const;

export default function Stagger({ children, className, as = "div" }: StaggerProps) {
  const props = { className, variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport };

  if (as === "ul") return <motion.ul {...props}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...props}>{children}</motion.ol>;
  return <motion.div {...props}>{children}</motion.div>;
}
