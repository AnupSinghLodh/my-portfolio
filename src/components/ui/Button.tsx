import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { springTap } from "../../lib/motion";
import Magnet from "../reactbits/Magnet";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
  external?: boolean;
};

const base = "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors";

const variantClasses = {
  primary: "bg-ember text-bg hover:bg-ember-soft",
  outline: "border border-line bg-white/5 text-ink backdrop-blur hover:border-ember/60 hover:text-ember-soft",
};

export default function Button({ href, children, variant = "primary", external = false }: ButtonProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Magnet padding={40} magnetStrength={6} disabled={reducedMotion}>
      <motion.a
        href={href}
        className={`${base} ${variantClasses[variant]}`}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={springTap}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </motion.a>
    </Magnet>
  );
}
