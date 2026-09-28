import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "../../lib/motion";

type RevealProps = { children: ReactNode; className?: string };

export default function Reveal({ children, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
