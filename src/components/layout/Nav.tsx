import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { navItems, sectionIds } from "../../data/content";
import { useActiveSection } from "../../hooks/useActiveSection";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useScrolled } from "../../hooks/useScrolled";
import { springTap } from "../../lib/motion";
import type { SectionId } from "../../types";
import MobileMenu from "./MobileMenu";

export default function Nav() {
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const pendingTarget = useRef<SectionId | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const solid = scrolled || open;

  const navigateFromMenu = (id: SectionId) => {
    pendingTarget.current = id;
    setOpen(false);
  };

  const scrollToPendingTarget = () => {
    const id = pendingTarget.current;
    pendingTarget.current = null;
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 border-b ${solid ? "backdrop-blur-xl" : ""}`}
      initial={false}
      animate={{
        backgroundColor: solid ? "rgba(7, 8, 10, 0.72)" : "rgba(7, 8, 10, 0)",
        borderColor: solid ? "rgba(31, 35, 43, 1)" : "rgba(31, 35, 43, 0)",
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center">
          <img src="/assets/logo-asl.png" alt="Anup Singh Lodh" className="h-9 w-auto" />
        </a>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "location" : undefined}
                  className="relative block px-3 py-2 text-sm text-muted transition-colors hover:text-ink aria-[current=location]:text-ink"
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-px h-px bg-ember"
                      transition={springTap}
                    />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="relative size-10 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <motion.span
            className="absolute left-2.5 top-[19px] h-0.5 w-5 rounded bg-ink"
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
          />
          <motion.span
            className="absolute left-2.5 top-[19px] h-0.5 w-5 rounded bg-ink"
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
          />
        </button>
      </div>

      <MobileMenu
        open={open}
        items={navItems}
        onNavigate={navigateFromMenu}
        onExitComplete={scrollToPendingTarget}
      />
    </motion.header>
  );
}
