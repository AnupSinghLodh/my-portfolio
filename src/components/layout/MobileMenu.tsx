import { AnimatePresence, motion } from "motion/react";
import type { NavItem, SectionId } from "../../types";

type MobileMenuProps = {
  open: boolean;
  items: NavItem[];
  onNavigate: (id: SectionId) => void;
  onExitComplete: () => void;
};

export default function MobileMenu({ open, items, onNavigate, onExitComplete }: MobileMenuProps) {
  return (
    <AnimatePresence initial={false} onExitComplete={onExitComplete}>
      {open && (
        <motion.nav
          key="mobile-menu"
          id="mobile-menu"
          aria-label="Mobile"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden md:hidden"
        >
          <ul className="flex flex-col gap-1 px-4 pb-4">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    // Closing the menu during the default hash jump cancels the browser's scroll,
                    // so Nav scrolls once the exit animation has finished.
                    event.preventDefault();
                    onNavigate(item.id);
                  }}
                  className="block rounded-lg px-3 py-3 text-base text-ink transition-colors hover:bg-white/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
