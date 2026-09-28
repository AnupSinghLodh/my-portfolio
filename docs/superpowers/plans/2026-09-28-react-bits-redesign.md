# React Bits Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as a dark, techy single-page site with Tailwind v4, React Bits components, `motion`, and an EvilEye shader hero background, with one major component per file.

**Architecture:**
- All copy lives in `src/data/content.ts`, typed by `src/types.ts`.
- Small presentational components in `src/components/ui/` take typed props and never import content.
- Section components in `src/sections/` compose those components with data.
- Vendored React Bits sources live in `src/components/reactbits/`.
- The EvilEye render loop is extracted into a pure, testable `createFrameLoop` so pause-offscreen and reduced-motion behaviour can be unit-tested.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 (`@tailwindcss/vite`), `motion` 12 (`motion/react`), `ogl` 1, Vitest 4 + Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-28-react-bits-redesign-design.md`

## Global Constraints

- **Theme tokens (exact values):** bg `#07080a`, surface `#0f1115`, line `#1f232b`, ink `#ecedee`, muted `#8b919c`, ember `#ff6f37`, ember-soft `#ffb08a`, cool `#46c7b5`.
- **Dependencies:** runtime adds only `motion` and `ogl`. Dev adds `tailwindcss`, `@tailwindcss/vite`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`. **No `gsap`, no shadcn CLI, no path aliases.**
- **React Bits sources:** taken from `https://reactbits.dev/r/<Name>-TS-TW.json` and stored in `src/components/reactbits/`. Modify them only where this plan says.
- **One component per file.** Files in `components/ui/` and `components/hero/` take props and do not import `src/data/content.ts`. Sections and layout components may.
- **Imports:** use relative imports and import motion from `motion/react`.
- **Reduced motion:** `App` is wrapped in `<MotionConfig reducedMotion="user">`. Non-motion animation (EvilEye, CountUp, BlurText, ShinyText, GradientText, RotatingText auto-rotation, Magnet, scroll-linked timeline) is explicitly gated by `usePrefersReducedMotion()`.
- **Copy corrections (verbatim):**
  - "graduate", not "undergraduate"
  - job title "Software Developer Intern"
  - company "ixigo"
  - no duplicate GitLab bullet
  - "handles mandatory consent and policy steps automatically"
  - no "4+" metric; use "3" featured projects
  - the portfolio project's tags are React, TypeScript, Tailwind CSS, Vite, React Bits
- **Commits:** work on a branch `redesign/react-bits`, never on `main`. Before the first commit, confirm with the user that commits are OK (their global instruction is to commit only when asked).

## Review Focus

1. **No WebGL** (old device, blocked GPU, jsdom): the hero must show the static ember gradient instead of a blank area or a crash. Pinned by the `HeroBackground` test in Task 6.
2. **Reduced motion:** stats must show their final values (`7.63`, `97.2%`, `3`) immediately, and the hero `h1` must be plain text. Pinned by `src/test/reducedMotion.test.tsx` in Task 6.
3. **Offscreen and unmount:** the shader loop must stop when the hero scrolls away or unmounts, with no leaked rAF. Pinned by the `createFrameLoop` tests in Task 3.
4. **Mobile menu:** it must close on link tap and on Escape, and `aria-expanded` must reflect its state. Pinned by the `Nav` tests in Task 5.
5. **Nav and sections in sync:** every nav link must point at a section that exists, and the page must have exactly one `h1`. Pinned by the `App` test in Task 8.

---

### Task 1: Tooling (Tailwind v4, motion, ogl, Vitest) and theme

**Files:**
- Modify: `package.json` (via npm), `vite.config.ts`, `src/main.tsx`
- Create: `src/index.css`, `src/test/setup.ts`, `src/test/smoke.test.tsx`

**Interfaces:**
- Produces:
  - Tailwind utilities for the theme colours: `bg-bg`, `bg-surface`, `border-line`, `text-ink`, `text-muted`, `text-ember`, `bg-ember`, `text-ember-soft`, `text-cool`, plus `font-sans` and `font-mono`.
  - `setReducedMotion(value: boolean): void` exported from `src/test/setup.ts`.
  - `npm test` runs `vitest run`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b redesign/react-bits
```

- [ ] **Step 2: Install dependencies**

```bash
npm install motion@^12 ogl@^1
npm install -D tailwindcss@^4 @tailwindcss/vite@^4 vitest@^4 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Add the test script.** In `package.json` `"scripts"`, add `"test": "vitest run"` after `"preview"`.

- [ ] **Step 4: Replace `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
```

- [ ] **Step 5: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { afterEach, vi } from "vitest";

// Animations finish instantly in tests so exit/enter states settle synchronously.
MotionGlobalConfig.skipAnimations = true;

type TestWindow = Window & { __reducedMotion?: boolean };

/**
 * Call at the top of a test file, before importing components; motion caches the preference on first use.
 * Stored on window so it is shared even if this module is instantiated twice.
 */
export function setReducedMotion(value: boolean) {
  (window as TestWindow).__reducedMotion = value;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? (window as TestWindow).__reducedMotion === true : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class StubObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", StubObserver);
vi.stubGlobal("ResizeObserver", StubObserver);

// jsdom has no WebGL; returning null mirrors a browser without GPU support.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
window.scrollTo = vi.fn() as typeof window.scrollTo;

afterEach(() => cleanup());
```

- [ ] **Step 6: Write the smoke test `src/test/smoke.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("test environment", () => {
  it("renders React into jsdom", () => {
    render(<p>ready</p>);
    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});
```

- [ ] **Step 7: Run the tests.** Run `npm test`. Expected: 1 passed.

- [ ] **Step 8: Create `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-bg: #07080a;
  --color-surface: #0f1115;
  --color-line: #1f232b;
  --color-ink: #ecedee;
  --color-muted: #8b919c;
  --color-ember: #ff6f37;
  --color-ember-soft: #ffb08a;
  --color-cool: #46c7b5;
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }

  body {
    @apply bg-bg font-sans text-ink antialiased;
  }

  ::selection {
    background: color-mix(in srgb, var(--color-ember) 35%, transparent);
    color: var(--color-ink);
  }

  :focus-visible {
    outline: 2px solid var(--color-ember);
    outline-offset: 3px;
    border-radius: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 9: Import it in `src/main.tsx`.** Add `import "./index.css";` directly after `import "./styles.css";`. Keep `styles.css` for now; Task 8 removes it.

- [ ] **Step 10: Build.** Run `npm run build`. Expected: succeeds. The old page renders with Tailwind preflight on top of it, which is expected until Task 8.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/index.css src/main.tsx src/test
git commit -m "chore: add Tailwind v4, motion, ogl and Vitest tooling"
```

---

### Task 2: Types, content, motion presets, hooks

**Files:**
- Create:
  - `src/types.ts`
  - `src/data/content.ts`
  - `src/lib/motion.ts`
  - `src/hooks/usePrefersReducedMotion.ts`
  - `src/hooks/useScrolled.ts`
  - `src/hooks/useActiveSection.ts`
- Test: `src/data/content.test.ts`

**Interfaces:**
- Produces these types:
  - `SectionId`
  - `NavItem { id: SectionId; label: string }`
  - `Stat { value: number; suffix?: string; label: string }`
  - `Fact { label: string; value: string }`
  - `RoleBullet { title: string; body: string }`
  - `Role { title; company; period; location; bullets: RoleBullet[] }`
  - `Project { id; title; period; summary; tags: string[]; href?: string }`
  - `SkillGroup { title; items: string[]; wide?: boolean }`
  - `ProcessStepData { title; body }`
  - `TimelineEntry { period; title; detail }`
  - `Achievement { title; body }`
  - `SocialLink { label; cta; href; external: boolean }`
- Produces these content exports:
  - `navItems`, `sectionIds: readonly SectionId[]`
  - `hero { label, name, rotatingStack, summary, email }`, `heroStats: Stat[]`
  - `about { title, paragraphs }`, `quickFacts: Fact[]`
  - `experience { title, role: Role }`
  - `projectsSection { title }`, `projects: Project[]`
  - `skillsSection { title, processTitle }`, `skillGroups: SkillGroup[]`, `processSteps: ProcessStepData[]`
  - `educationSection { title }`, `timeline: TimelineEntry[]`, `achievements: Achievement[]`
  - `contact { title, body }`, `socialLinks: SocialLink[]`
- Produces these motion presets: `fadeUp: Variants`, `staggerContainer: Variants`, `springTap: Transition`.
- Produces these hooks:
  - `usePrefersReducedMotion(): boolean`
  - `useScrolled(threshold?: number): boolean`
  - `useActiveSection(ids: readonly string[]): string | null`

- [ ] **Step 1: Write the failing content test `src/data/content.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { experience, heroStats, navItems, projects, sectionIds, about, contact } from "./content";

describe("content", () => {
  it("has a nav item for every section id, in page order", () => {
    expect(navItems.map((item) => item.id)).toEqual([...sectionIds]);
  });

  it("has no duplicate experience bullets", () => {
    const titles = experience.role.bullets.map((bullet) => bullet.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(experience.role.bullets).toHaveLength(4);
  });

  it("uses the corrected copy", () => {
    expect(experience.role.title).toBe("Software Developer Intern");
    expect(experience.role.company).toBe("ixigo");
    expect(about.paragraphs.join(" ")).toContain("graduate");
    expect(about.paragraphs.join(" ")).not.toContain("undergraduate");
    expect(contact.body).not.toMatch(/internship/i);
    const bulletText = experience.role.bullets.map((bullet) => bullet.body).join(" ");
    expect(bulletText).not.toContain("bypasses");
    expect(bulletText).toContain("handles mandatory consent and policy steps automatically");
  });

  it("reports a project count that matches the projects list", () => {
    const projectStat = heroStats.find((stat) => stat.label === "Featured projects");
    expect(projectStat?.value).toBe(projects.length);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails.** Run `npx vitest run src/data/content.test.ts`. Expected: FAIL, "Failed to resolve import ./content".

- [ ] **Step 3: Create `src/types.ts`**

```ts
export type SectionId = "about" | "experience" | "projects" | "skills" | "education" | "contact";

export type NavItem = { id: SectionId; label: string };

export type Stat = { value: number; suffix?: string; label: string };

export type Fact = { label: string; value: string };

export type RoleBullet = { title: string; body: string };

export type Role = {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: RoleBullet[];
};

export type Project = {
  id: string;
  title: string;
  period: string;
  summary: string;
  tags: string[];
  href?: string;
};

export type SkillGroup = { title: string; items: string[]; wide?: boolean };

export type ProcessStepData = { title: string; body: string };

export type TimelineEntry = { period: string; title: string; detail: string };

export type Achievement = { title: string; body: string };

export type SocialLink = { label: string; cta: string; href: string; external: boolean };
```

- [ ] **Step 4: Create `src/data/content.ts`**

```ts
import type {
  Achievement,
  Fact,
  NavItem,
  ProcessStepData,
  Project,
  Role,
  SectionId,
  SkillGroup,
  SocialLink,
  Stat,
  TimelineEntry,
} from "../types";

export const sectionIds: readonly SectionId[] = ["about", "experience", "projects", "skills", "education", "contact"];

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  label: "Full Stack Developer",
  name: "Anup Singh Lodh",
  rotatingStack: ["Node.js", "Puppeteer", "React", "MongoDB", "Express"],
  summary:
    "I build browser automation, database-backed applications, and practical web systems with JavaScript, Node.js, React, and MongoDB.",
  email: "asingh29240@gmail.com",
};

export const heroStats: Stat[] = [
  { value: 7.63, label: "CSE CGPA" },
  { value: 97.2, suffix: "%", label: "Class XII score" },
  { value: 3, label: "Featured projects" },
];

export const about = {
  title: "Focused on dependable software and clean user experiences.",
  paragraphs: [
    "I'm a Computer Science graduate with hands-on experience in backend automation, desktop application development, and full-stack web technologies. During my internship at ixigo I engineered complex automation workflows and internal business tools.",
    "My work combines JavaScript ecosystems, database-backed applications, and practical engineering habits built through internship work, academic projects, and competitive programming. I'm looking for a full-time engineering role where I can build scalable, high-impact software.",
  ],
};

export const quickFacts: Fact[] = [
  { label: "Latest role", value: "Software Developer Intern, ixigo" },
  { label: "Focus", value: "Full stack development" },
  { label: "Education", value: "B.Tech CSE, MITS Gwalior" },
  { label: "Location", value: "Gwalior, MP" },
];

const role: Role = {
  title: "Software Developer Intern",
  company: "ixigo",
  period: "Dec 2025 – Jun 2026",
  location: "Gurugram, India",
  bullets: [
    {
      title: "Online Login Management System (OLMS)",
      body: "Built a desktop management app with Electron, JavaScript, HTML, and CSS to monitor booking agents, track real-time wallet balances, manage daily ticket limits, and audit transaction histories.",
    },
    {
      title: "Automated web check-in & boarding passes",
      body: "Built browser automation that performs web check-in across multiple airline platforms: it extracts PNR and passenger data, handles mandatory consent and policy steps automatically, and downloads the final PDF boarding passes.",
    },
    {
      title: "No-show refund automation (Air India Express)",
      body: "Engineered workflows that identify passengers who missed their departures and navigate airline portals to calculate and execute partial or tax refunds according to each airline's penalty policy.",
    },
    {
      title: "Core automation & collaboration",
      body: "Used Node.js and Puppeteer to drive backend browser tasks, and GitLab for version control, merge requests, and task tracking in an agile team.",
    },
  ],
};

export const experience = {
  title: "Building automation and backend workflows at ixigo.",
  role,
};

export const projectsSection = {
  title: "Selected work from full-stack and frontend builds.",
};

export const projects: Project[] = [
  {
    id: "01",
    title: "E-Commerce Platform",
    period: "Mar 2025 – May 2025",
    summary: "Full-stack e-commerce platform with an interactive backend architecture and a smooth shopping experience.",
    tags: ["React", "Node.js", "Express", "MongoDB", "REST API"],
  },
  {
    id: "02",
    title: "Personal Portfolio Website",
    period: "Aug 2025 – Sep 2025",
    summary: "This site: a dark, animated portfolio with a WebGL hero, built to showcase projects, skills, and achievements.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite", "React Bits"],
  },
  {
    id: "03",
    title: "Scientific Calculator",
    period: "Apr 2026",
    summary: "Web calculator supporting arithmetic and advanced mathematical operations through a responsive interface.",
    tags: ["HTML", "CSS", "JavaScript", "DOM"],
  },
];

export const skillsSection = {
  title: "Tools and concepts I use to ship software.",
  processTitle: "How I build",
};

export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["C++", "Python", "JavaScript", "TypeScript", "HTML5", "CSS"] },
  { title: "Frameworks & Libraries", items: ["React", "Node.js", "Express", "Tailwind CSS", "Puppeteer", "Electron", "Vite"] },
  { title: "Developer Tools", items: ["Git", "GitLab", "GitHub", "Postman", "Docker", "GitLab CI"] },
  { title: "Databases", items: ["MongoDB", "Redis (basics)"] },
  {
    title: "Computer Science Concepts",
    items: [
      "Data Structures",
      "Problem Solving",
      "OOP",
      "Networking",
      "Low Level Design",
      "DBMS",
      "Operating Systems",
      "REST API design",
      "Authentication flows",
    ],
    wide: true,
  },
];

export const processSteps: ProcessStepData[] = [
  { title: "Model the data", body: "Define entities, user flows, and MongoDB structures before writing route logic." },
  { title: "Build service routes", body: "Connect Express endpoints, validation, auth-aware logic, and error states." },
  { title: "Automate repeat work", body: "Use Puppeteer for repeatable browser tasks where manual UI work slows teams down." },
  { title: "Polish the interface", body: "Shape React screens around clear states, fast scanning, and responsive behaviour." },
];

export const educationSection = {
  title: "Academic foundation with competitive learning.",
};

export const timeline: TimelineEntry[] = [
  { period: "Jun 2026", title: "NPTEL Discipline Star", detail: "IIT Roorkee" },
  {
    period: "Nov 2022 – Jun 2026",
    title: "Madhav Institute of Technology and Science",
    detail: "B.Tech, Computer Science & Engineering · CGPA 7.63",
  },
  { period: "Jan 2025 – Apr 2025", title: "Competitive Programming (NPTEL)", detail: "IIT Madras" },
  { period: "Aug 2024 – Nov 2024", title: "Cyber Security and Privacy (NPTEL)", detail: "IIT Madras" },
  {
    period: "2021",
    title: "Government Subhash Excellence Higher Secondary School",
    detail: "Class XII, MPBSE · 97.2%",
  },
];

export const achievements: Achievement[] = [
  {
    title: "Yuva Unstoppable Scholarship",
    body: "Awarded INR 50,000 per year from 2022 to 2026 for education and stationery expenses, based on academic performance.",
  },
  {
    title: "Captain, CSE Hawks",
    body: "Led the team in an intra-college cricket league, managing selection, strategy, teamwork, and decision-making.",
  },
  { title: "Languages", body: "English and Hindi." },
];

export const contact = {
  title: "Let's build something useful.",
  body: "I'm open to full-time software engineering roles and project collaboration around backend systems, web automation, and full-stack applications.",
};

export const socialLinks: SocialLink[] = [
  { label: "Email", cta: hero.email, href: `mailto:${hero.email}`, external: false },
  { label: "LinkedIn", cta: "LinkedIn", href: "https://www.linkedin.com/in/anupsinghlodh8345/", external: true },
  { label: "GitHub", cta: "GitHub", href: "https://github.com/AnupSinghLodh", external: true },
  { label: "X", cta: "X", href: "https://x.com/Anupsingh834920", external: true },
];
```

- [ ] **Step 5: Run the test.** Run `npx vitest run src/data/content.test.ts`. Expected: 4 passed.

- [ ] **Step 6: Create `src/lib/motion.ts`**

```ts
import type { Transition, Variants } from "motion/react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const springTap: Transition = { type: "spring", stiffness: 400, damping: 25 };
```

- [ ] **Step 7: Create `src/hooks/usePrefersReducedMotion.ts`**

```ts
import { useReducedMotion } from "motion/react";

export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
```

- [ ] **Step 8: Create `src/hooks/useScrolled.ts`**

```ts
import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

export function useScrolled(threshold = 12): boolean {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > threshold));

  return scrolled;
}
```

- [ ] **Step 9: Create `src/hooks/useActiveSection.ts`**

```ts
import { useEffect, useState } from "react";

/** Returns the id of the section crossing the middle band of the viewport. `ids` must be a stable reference. */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
```

- [ ] **Step 10: Type-check.** Run `npx tsc -b`. Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add src/types.ts src/data src/lib src/hooks
git commit -m "feat: add typed content, motion presets and hooks"
```

---

### Task 3: Vendor React Bits, frame loop, EvilEye hardening

**Files:**
- Create:
  - `src/components/reactbits/{EvilEye,BlurText,RotatingText,ShinyText,GradientText,DecryptedText,CountUp,SpotlightCard,Magnet}.tsx`, via the script below
  - `src/lib/frameLoop.ts`
- Modify: `src/components/reactbits/EvilEye.tsx`, `BlurText.tsx`, `SpotlightCard.tsx`
- Test: `src/lib/frameLoop.test.ts`

**Interfaces:**
- Consumes: `usePrefersReducedMotion` (Task 2).
- Produces:
  - `createFrameLoop(render: (timeMs: number) => void, options: { reducedMotion: boolean }, raf?, caf?): FrameLoop`, where `FrameLoop = { setVisible(visible: boolean): void; destroy(): void }`.
  - `EvilEye` gains the props `trackingRef?: RefObject<HTMLElement | null>` and `onError?: (error: unknown) => void`.
  - `BlurText` now renders a `<span>` root instead of `<p>`, so it is valid inside `<h1>`.
  - `SpotlightCard` defaults to `rounded-2xl border border-line bg-surface overflow-hidden` with no default padding, and the spotlight colour defaults to ember.

- [ ] **Step 1: Download the sources**

```bash
mkdir -p src/components/reactbits
for c in EvilEye BlurText RotatingText ShinyText GradientText DecryptedText CountUp SpotlightCard Magnet; do
  curl -fsS "https://reactbits.dev/r/$c-TS-TW.json" \
    | python3 -c 'import sys,json; sys.stdout.write(json.loads(sys.stdin.read(), strict=False)["files"][0]["content"])' \
    > "src/components/reactbits/$c.tsx"
done
sed -i '' "/^'use client';$/d" src/components/reactbits/*.tsx
wc -l src/components/reactbits/*.tsx
```

Expected: 9 non-empty files, about 1,590 lines in total. `strict=False` is required because the registry JSON contains raw control characters.

- [ ] **Step 2: Type-check the unmodified sources.** Run `npx tsc -b`. Expected: no errors. If a vendored file fails strict mode, fix only the reported line with a minimal type annotation and note it in the commit message.

- [ ] **Step 3: Write the failing test `src/lib/frameLoop.test.ts`**

```ts
import { describe, expect, it, vi } from "vitest";
import { createFrameLoop } from "./frameLoop";

function fakeScheduler() {
  let nextId = 1;
  const queue = new Map<number, FrameRequestCallback>();
  return {
    raf: (callback: FrameRequestCallback) => {
      const id = nextId++;
      queue.set(id, callback);
      return id;
    },
    caf: (id: number) => {
      queue.delete(id);
    },
    flush: (time: number) => {
      const callbacks = [...queue.values()];
      queue.clear();
      callbacks.forEach((callback) => callback(time));
    },
    pending: () => queue.size,
  };
}

describe("createFrameLoop", () => {
  it("renders on every frame while visible", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    scheduler.flush(16);
    scheduler.flush(32);

    expect(render.mock.calls).toEqual([[16], [32]]);
    expect(scheduler.pending()).toBe(1);
  });

  it("renders a single frame at time 0 and never schedules under reduced motion", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: true }, scheduler.raf, scheduler.caf);

    loop.setVisible(true);

    expect(render.mock.calls).toEqual([[0]]);
    expect(scheduler.pending()).toBe(0);
  });

  it("stops when hidden and resumes once when shown again", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    loop.setVisible(false);
    expect(scheduler.pending()).toBe(0);

    loop.setVisible(true);
    loop.setVisible(true);
    expect(scheduler.pending()).toBe(1);
  });

  it("cancels the pending frame on destroy and ignores later visibility changes", () => {
    const scheduler = fakeScheduler();
    const render = vi.fn();
    const loop = createFrameLoop(render, { reducedMotion: false }, scheduler.raf, scheduler.caf);

    loop.destroy();
    loop.setVisible(true);
    scheduler.flush(16);

    expect(scheduler.pending()).toBe(0);
    expect(render).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run it to confirm it fails.** Run `npx vitest run src/lib/frameLoop.test.ts`. Expected: FAIL, "Failed to resolve import ./frameLoop".

- [ ] **Step 5: Create `src/lib/frameLoop.ts`**

```ts
export type FrameLoop = {
  setVisible: (visible: boolean) => void;
  destroy: () => void;
};

type Options = { reducedMotion: boolean };

export function createFrameLoop(
  render: (timeMs: number) => void,
  { reducedMotion }: Options,
  raf: (callback: FrameRequestCallback) => number = (callback) => window.requestAnimationFrame(callback),
  caf: (id: number) => void = (id) => window.cancelAnimationFrame(id)
): FrameLoop {
  let frameId: number | null = null;
  let destroyed = false;

  if (reducedMotion) {
    render(0);
    return {
      setVisible: () => {},
      destroy: () => {
        destroyed = true;
      },
    };
  }

  const tick = (time: number) => {
    render(time);
    frameId = raf(tick);
  };

  const start = () => {
    if (frameId === null && !destroyed) frameId = raf(tick);
  };

  const stop = () => {
    if (frameId !== null) {
      caf(frameId);
      frameId = null;
    }
  };

  start();

  return {
    setVisible: (visible) => (visible ? start() : stop()),
    destroy: () => {
      stop();
      destroyed = true;
    },
  };
}
```

- [ ] **Step 6: Run the test.** Run `npx vitest run src/lib/frameLoop.test.ts`. Expected: 4 passed.

- [ ] **Step 7: Harden `EvilEye.tsx`.** Keep everything above `export default function EvilEye` (the imports, `hexToVec3`, `generateNoiseTexture` and both shaders) unchanged, except:
  - replace the import line `import { useEffect, useRef } from 'react';` with `import { useEffect, useRef, type RefObject } from 'react';`
  - add `import { createFrameLoop } from '../../lib/frameLoop';` and `import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';` below it
  - add two props to `interface EvilEyeProps`:

```ts
  trackingRef?: RefObject<HTMLElement | null>;
  onError?: (error: unknown) => void;
```

Replace the entire `export default function EvilEye(...) { ... }` with:

```tsx
export default function EvilEye({
  eyeColor = '#FF6F37',
  intensity = 1.5,
  pupilSize = 0.6,
  irisWidth = 0.25,
  glowIntensity = 0.35,
  scale = 0.8,
  noiseScale = 1.0,
  pupilFollow = 1.0,
  flameSpeed = 1.0,
  backgroundColor = '#000000',
  lightMode = false,
  trackingRef,
  onError
}: EvilEyeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    } catch (error) {
      onErrorRef.current?.(error);
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.display = 'block';

    const noiseData = generateNoiseTexture(256);
    const noiseTexture = new Texture(gl, {
      image: noiseData,
      width: 256,
      height: 256,
      generateMipmaps: false,
      flipY: false
    });
    noiseTexture.minFilter = gl.LINEAR;
    noiseTexture.magFilter = gl.LINEAR;
    noiseTexture.wrapS = gl.REPEAT;
    noiseTexture.wrapT = gl.REPEAT;

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const trackingTarget: HTMLElement = trackingRef?.current ?? container;

    function onMouseMove(e: MouseEvent) {
      const rect = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    }

    function onMouseLeave() {
      mouse.tx = 0;
      mouse.ty = 0;
    }

    if (!reducedMotion) {
      trackingTarget.addEventListener('mousemove', onMouseMove);
      trackingTarget.addEventListener('mouseleave', onMouseLeave);
    }

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height] },
        uNoiseTexture: { value: noiseTexture },
        uPupilSize: { value: pupilSize },
        uIrisWidth: { value: irisWidth },
        uGlowIntensity: { value: glowIntensity },
        uIntensity: { value: intensity },
        uScale: { value: scale },
        uNoiseScale: { value: noiseScale },
        uMouse: { value: [0, 0] },
        uPupilFollow: { value: reducedMotion ? 0 : pupilFollow },
        uFlameSpeed: { value: flameSpeed },
        uEyeColor: { value: hexToVec3(eyeColor) },
        uBgColor: { value: hexToVec3(backgroundColor) },
        uLightMode: { value: lightMode }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
    }
    window.addEventListener('resize', resize);
    resize();
    container.appendChild(gl.canvas);

    const loop = createFrameLoop(
      time => {
        mouse.x += (mouse.tx - mouse.x) * 0.05;
        mouse.y += (mouse.ty - mouse.y) * 0.05;
        program.uniforms.uMouse.value = [mouse.x, mouse.y];
        program.uniforms.uTime.value = time * 0.001;
        renderer.render({ scene: mesh });
      },
      { reducedMotion }
    );

    const visibility = new IntersectionObserver(([entry]) => loop.setVisible(entry.isIntersecting));
    visibility.observe(container);

    return () => {
      loop.destroy();
      visibility.disconnect();
      window.removeEventListener('resize', resize);
      trackingTarget.removeEventListener('mousemove', onMouseMove);
      trackingTarget.removeEventListener('mouseleave', onMouseLeave);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    eyeColor,
    intensity,
    pupilSize,
    irisWidth,
    glowIntensity,
    scale,
    noiseScale,
    pupilFollow,
    flameSpeed,
    backgroundColor,
    lightMode,
    reducedMotion,
    trackingRef
  ]);

  return <div ref={containerRef} className="w-full h-full" />;
}
```

Under reduced motion the single frame is rendered after the first `resize()`, so it has the right size. On a window resize under reduced motion the canvas is resized but not redrawn, so call `renderer.render({ scene: mesh })` at the end of `resize()` when `reducedMotion` is true:

```ts
    function resize() {
      renderer.setSize(container.offsetWidth, container.offsetHeight);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height];
      if (reducedMotion) renderer.render({ scene: mesh });
    }
```

- [ ] **Step 8: Make BlurText valid inside headings.** In `BlurText.tsx`:
  - change `const ref = useRef<HTMLParagraphElement>(null);` to `const ref = useRef<HTMLSpanElement>(null);`
  - change the opening `<p ref={ref} className={`blur-text ${className} flex flex-wrap`}>` to `<span ref={ref} className={`blur-text ${className} flex flex-wrap`}>`
  - change the matching closing `</p>` to `</span>`

- [ ] **Step 9: Theme SpotlightCard.** In `SpotlightCard.tsx`:
  - change the default `spotlightColor = 'rgba(255, 255, 255, 0.25)'` to `spotlightColor = 'rgba(255, 111, 55, 0.14)'`
  - change the root class string `relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}` to `relative rounded-2xl border border-line bg-surface overflow-hidden ${className}`

- [ ] **Step 10: Type-check and run the tests.** Run `npx tsc -b && npm test`. Expected: no type errors; all tests pass.

- [ ] **Step 11: Commit**

```bash
git add src/components/reactbits src/lib/frameLoop.ts src/lib/frameLoop.test.ts
git commit -m "feat: vendor React Bits components and harden EvilEye render loop"
```

---

### Task 4: UI primitives

**Files:**
- Create in `src/components/ui/`:
  - `Reveal.tsx`, `Stagger.tsx`, `StaggerItem.tsx`
  - `SectionHeading.tsx`, `Section.tsx`
  - `Button.tsx`, `Tag.tsx`, `StatItem.tsx`
  - `ProjectCard.tsx`, `SkillCard.tsx`, `ProcessStep.tsx`, `TimelineItem.tsx`, `AchievementCard.tsx`
- Test: `src/components/ui/ui.test.tsx`

**Interfaces:**
- Consumes: types (Task 2), `fadeUp`, `staggerContainer`, `springTap`, `usePrefersReducedMotion`, and the React Bits components (Task 3).
- Produces default exports:
  - `Reveal({ children, className? })`
  - `Stagger({ children, className?, as?: "div" | "ul" | "ol" })`
  - `StaggerItem({ children, className?, as?: "div" | "li" })`
  - `SectionHeading({ eyebrow, title, id })`
  - `Section({ id: SectionId, eyebrow, title, children })`, which renders `<section id={id} aria-labelledby={`${id}-title`}>`
  - `Button({ href, children, variant?: "primary" | "outline", external? })`
  - `Tag({ label })`, which renders an `<li>`
  - `StatItem({ stat: Stat })`, which renders a `<div>` containing `<dt>` and `<dd>` and must be placed inside a `<dl>`
  - `ProjectCard({ project })`, `SkillCard({ group })`
  - `ProcessStep({ step: ProcessStepData, index: number })`
  - `TimelineItem({ entry })`, `AchievementCard({ achievement })`

- [ ] **Step 1: Write the failing tests `src/components/ui/ui.test.tsx`**

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";
import ProjectCard from "./ProjectCard";
import Section from "./Section";
import StatItem from "./StatItem";

describe("Section", () => {
  it("labels the section by its heading", () => {
    render(
      <Section id="projects" eyebrow="Projects" title="Selected work">
        <p>body</p>
      </Section>
    );
    expect(screen.getByRole("region", { name: "Selected work" })).toHaveAttribute("id", "projects");
  });
});

describe("Button", () => {
  it("opens external links in a new tab safely", () => {
    render(
      <Button href="https://github.com/AnupSinghLodh" external>
        GitHub
      </Button>
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("keeps internal links in the same tab", () => {
    render(<Button href="#projects">View projects</Button>);
    expect(screen.getByRole("link", { name: "View projects" })).not.toHaveAttribute("target");
  });
});

describe("StatItem", () => {
  it("exposes the final value to screen readers even while counting", () => {
    render(
      <dl>
        <StatItem stat={{ value: 97.2, suffix: "%", label: "Class XII score" }} />
      </dl>
    );
    expect(screen.getByText("97.2%", { selector: ".sr-only" })).toBeInTheDocument();
    expect(screen.getByText("Class XII score")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("renders title, period and tags, and a link only when href is given", () => {
    const project = { id: "01", title: "E-Commerce Platform", period: "Mar 2025", summary: "Shop", tags: ["React", "MongoDB"] };
    const { rerender } = render(<ProjectCard project={project} />);
    const tags = screen.getByRole("list", { name: "E-Commerce Platform technologies" });
    expect(within(tags).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(<ProjectCard project={{ ...project, href: "https://example.com" }} />);
    expect(screen.getByRole("link", { name: /view project/i })).toHaveAttribute("href", "https://example.com");
  });
});
```

- [ ] **Step 2: Run them to confirm they fail.** Run `npx vitest run src/components/ui`. Expected: FAIL, "Failed to resolve import ./Button".

- [ ] **Step 3: Create `Reveal.tsx`**

```tsx
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
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Create `Stagger.tsx`**

```tsx
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { staggerContainer } from "../../lib/motion";

type StaggerProps = { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" };

const viewport = { once: true, amount: 0.15 } as const;

export default function Stagger({ children, className, as = "div" }: StaggerProps) {
  const props = { className, variants: staggerContainer, initial: "hidden", whileInView: "visible", viewport };

  if (as === "ul") return <motion.ul {...props}>{children}</motion.ul>;
  if (as === "ol") return <motion.ol {...props}>{children}</motion.ol>;
  return <motion.div {...props}>{children}</motion.div>;
}
```

- [ ] **Step 5: Create `StaggerItem.tsx`**

```tsx
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "../../lib/motion";

type StaggerItemProps = { children: ReactNode; className?: string; as?: "div" | "li" };

export default function StaggerItem({ children, className, as = "div" }: StaggerItemProps) {
  if (as === "li") {
    return (
      <motion.li className={className} variants={fadeUp}>
        {children}
      </motion.li>
    );
  }
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 6: Create `SectionHeading.tsx`**

```tsx
type SectionHeadingProps = { eyebrow: string; title: string; id: string };

export default function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-ember">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
```

- [ ] **Step 7: Create `Section.tsx`**

```tsx
import type { ReactNode } from "react";
import type { SectionId } from "../../types";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

type SectionProps = { id: SectionId; eyebrow: string; title: string; children: ReactNode };

export default function Section({ id, eyebrow, title, children }: SectionProps) {
  const headingId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={headingId} className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} id={headingId} />
      </Reveal>
      {children}
    </section>
  );
}
```

- [ ] **Step 8: Create `Button.tsx`**

```tsx
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
```

- [ ] **Step 9: Create `Tag.tsx`**

```tsx
type TagProps = { label: string };

export default function Tag({ label }: TagProps) {
  return (
    <li className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted">{label}</li>
  );
}
```

- [ ] **Step 10: Create `StatItem.tsx`**

```tsx
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { Stat } from "../../types";
import CountUp from "../reactbits/CountUp";

type StatItemProps = { stat: Stat };

export default function StatItem({ stat }: StatItemProps) {
  const reducedMotion = usePrefersReducedMotion();
  const finalValue = `${stat.value}${stat.suffix ?? ""}`;

  return (
    <div className="flex flex-col-reverse gap-1">
      <dt className="text-xs uppercase tracking-wider text-muted">{stat.label}</dt>
      <dd className="font-mono text-2xl font-semibold text-ink md:text-3xl">
        <span className="sr-only">{finalValue}</span>
        <span aria-hidden="true">
          {reducedMotion ? finalValue : (
            <>
              <CountUp to={stat.value} duration={1.6} />
              {stat.suffix}
            </>
          )}
        </span>
      </dd>
    </div>
  );
}
```

- [ ] **Step 11: Create `ProjectCard.tsx`**

```tsx
import { motion } from "motion/react";
import { springTap } from "../../lib/motion";
import type { Project } from "../../types";
import DecryptedText from "../reactbits/DecryptedText";
import SpotlightCard from "../reactbits/SpotlightCard";
import Tag from "./Tag";

type ProjectCardProps = { project: Project };

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.article className="h-full" whileHover={{ y: -6 }} transition={springTap}>
      <SpotlightCard className="flex h-full flex-col p-6 md:p-7">
        <div className="mb-6 flex items-center justify-between font-mono text-xs text-muted">
          <span className="text-ember">{project.id}</span>
          <span>{project.period}</span>
        </div>
        <h3 className="text-xl font-semibold text-ink">
          <DecryptedText
            text={project.title}
            animateOn="hover"
            speed={40}
            maxIterations={12}
            sequential
            className="text-ink"
            encryptedClassName="text-ember"
          />
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </ul>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="mt-6 text-sm font-semibold text-ember-soft hover:text-ember"
          >
            View project →
          </a>
        )}
      </SpotlightCard>
    </motion.article>
  );
}
```

- [ ] **Step 12: Create `SkillCard.tsx`**

```tsx
import type { SkillGroup } from "../../types";
import SpotlightCard from "../reactbits/SpotlightCard";
import Tag from "./Tag";

type SkillCardProps = { group: SkillGroup };

export default function SkillCard({ group }: SkillCardProps) {
  return (
    <SpotlightCard className="h-full p-6">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ember">{group.title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <Tag key={item} label={item} />
        ))}
      </ul>
    </SpotlightCard>
  );
}
```

- [ ] **Step 13: Create `ProcessStep.tsx`**

```tsx
import type { ProcessStepData } from "../../types";

type ProcessStepProps = { step: ProcessStepData; index: number };

export default function ProcessStep({ step, index }: ProcessStepProps) {
  return (
    <div className="border-t border-line pt-5">
      <span className="font-mono text-xs text-ember">{String(index + 1).padStart(2, "0")}</span>
      <h4 className="mt-2 font-semibold text-ink">{step.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
    </div>
  );
}
```

- [ ] **Step 14: Create `TimelineItem.tsx`**

```tsx
import type { TimelineEntry } from "../../types";

type TimelineItemProps = { entry: TimelineEntry };

export default function TimelineItem({ entry }: TimelineItemProps) {
  return (
    <div className="relative pl-8 md:pl-10">
      <span
        aria-hidden="true"
        className="absolute -left-[4.5px] top-1.5 size-2.5 rounded-full bg-ember shadow-[0_0_12px_var(--color-ember)]"
      />
      <p className="font-mono text-xs text-muted">{entry.period}</p>
      <h3 className="mt-1 font-semibold text-ink">{entry.title}</h3>
      <p className="mt-1 text-sm text-muted">{entry.detail}</p>
    </div>
  );
}
```

- [ ] **Step 15: Create `AchievementCard.tsx`**

```tsx
import type { Achievement } from "../../types";
import SpotlightCard from "../reactbits/SpotlightCard";

type AchievementCardProps = { achievement: Achievement };

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <SpotlightCard className="p-6">
      <h3 className="font-semibold text-ink">{achievement.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{achievement.body}</p>
    </SpotlightCard>
  );
}
```

- [ ] **Step 16: Run the tests and type-check.** Run `npx vitest run src/components/ui && npx tsc -b`. Expected: 5 passed; no type errors.

- [ ] **Step 17: Commit**

```bash
git add src/components/ui
git commit -m "feat: add motion-driven UI primitives"
```

---

### Task 5: Layout (ScrollProgress, Nav, MobileMenu, Footer)

**Files:**
- Create: `src/components/layout/ScrollProgress.tsx`, `Nav.tsx`, `MobileMenu.tsx`, `Footer.tsx`
- Test: `src/components/layout/Nav.test.tsx`

**Interfaces:**
- Consumes: `navItems`, `sectionIds`, `socialLinks`, `useScrolled`, `useActiveSection`, `springTap`.
- Produces:
  - `ScrollProgress()` and `Footer()`
  - `Nav()`, which renders a `<header>` with a logo link to `#top`, a desktop `<nav aria-label="Main">` and a toggle button
  - `MobileMenu({ open: boolean; items: NavItem[]; onNavigate: () => void })`, which renders `<nav id="mobile-menu" aria-label="Mobile">` only while `open`
- Uses the asset `public/assets/logo-asl.png`, created in Step 1.

- [ ] **Step 1: Make a transparent logo.** `logo2.png` is really a JPEG with a checkerboard baked into its pixels, so it renders as a grey checkered square on the dark nav. Generate a transparent PNG once. Run this from a temp dir so `sharp` doesn't become a project dependency:

```bash
TMP=$(mktemp -d) && (cd "$TMP" && npm init -y >/dev/null && npm i --silent sharp) && cat > "$TMP/logo.cjs" <<'EOF'
const sharp = require("sharp");
const [, , input, output] = process.argv;
(async () => {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    const saturation = max === 0 ? 0 : (max - min) / max;
    if (saturation < 0.18 && max > 150) data[i + 3] = 0;
    else if (saturation < 0.3 && max > 150) data[i + 3] = Math.round(((saturation - 0.18) / 0.12) * 255);
  }
  await sharp(data, { raw: info }).trim({ threshold: 1 }).resize({ height: 160 }).png().toFile(output);
})();
EOF
NODE_PATH="$TMP/node_modules" node "$TMP/logo.cjs" public/assets/logo2.png public/assets/logo-asl.png && file public/assets/logo-asl.png
```

Expected: `PNG image data, 158 x 160, 8-bit/color RGBA`.

- [ ] **Step 2: Write the failing test `src/components/layout/Nav.test.tsx`**

```tsx
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Nav from "./Nav";

describe("Nav", () => {
  it("lists every section in the desktop nav", () => {
    render(<Nav />);
    const main = screen.getByRole("navigation", { name: "Main" });
    expect(within(main).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "#about",
      "#experience",
      "#projects",
      "#skills",
      "#education",
      "#contact",
    ]);
  });

  it("opens the mobile menu and closes it when a link is tapped", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    const mobile = screen.getByRole("navigation", { name: "Mobile" });

    await user.click(within(mobile).getByRole("link", { name: "Projects" }));
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu on Escape", async () => {
    const user = userEvent.setup();
    render(<Nav />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("navigation", { name: "Mobile" })).not.toBeInTheDocument());
  });

  it("uses a descriptive logo alt text", () => {
    render(<Nav />);
    expect(screen.getByRole("img", { name: "Anup Singh Lodh" })).toHaveAttribute("src", "/assets/logo-asl.png");
  });
});
```

- [ ] **Step 3: Run it to confirm it fails.** Run `npx vitest run src/components/layout`. Expected: FAIL, "Failed to resolve import ./Nav".

- [ ] **Step 4: Create `ScrollProgress.tsx`**

```tsx
import { motion, useScroll, useSpring } from "motion/react";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-linear-to-r from-ember to-ember-soft"
    />
  );
}
```

- [ ] **Step 5: Create `MobileMenu.tsx`**

```tsx
import { AnimatePresence, motion } from "motion/react";
import type { NavItem } from "../../types";

type MobileMenuProps = { open: boolean; items: NavItem[]; onNavigate: () => void };

export default function MobileMenu({ open, items, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence initial={false}>
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
                  onClick={onNavigate}
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
```

- [ ] **Step 6: Create `Nav.tsx`**

```tsx
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { navItems, sectionIds } from "../../data/content";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useScrolled } from "../../hooks/useScrolled";
import { springTap } from "../../lib/motion";
import MobileMenu from "./MobileMenu";

export default function Nav() {
  const scrolled = useScrolled();
  const active = useActiveSection(sectionIds);
  const [open, setOpen] = useState(false);
  const solid = scrolled || open;

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

      <MobileMenu open={open} items={navItems} onNavigate={() => setOpen(false)} />
    </motion.header>
  );
}
```

- [ ] **Step 7: Create `Footer.tsx`**

```tsx
import { socialLinks } from "../../data/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© {year} Anup Singh Lodh</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="transition-colors hover:text-ink"
                {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Run the tests and type-check.** Run `npx vitest run src/components/layout && npx tsc -b`. Expected: 4 passed; no type errors.

- [ ] **Step 9: Commit**

```bash
git add public/assets/logo-asl.png src/components/layout
git commit -m "feat: add nav, mobile menu, scroll progress and footer"
```

---

### Task 6: Hero (EvilEye background, content, stats)

**Files:**
- Create: `src/components/hero/HeroBackground.tsx`, `HeroContent.tsx`, `HeroStats.tsx`, `src/sections/Hero.tsx`
- Test: `src/components/hero/HeroBackground.test.tsx`, `src/test/reducedMotion.test.tsx`

**Interfaces:**
- Consumes:
  - `EvilEye` with `trackingRef` and `onError` (Task 3)
  - `Button` and `StatItem` (Task 4)
  - `hero` and `heroStats` (Task 2)
  - `BlurText`, `RotatingText`, `ShinyText`
- Produces:
  - `HeroBackground({ trackingRef: RefObject<HTMLElement | null> })`. When EvilEye fails it renders `data-reason="webgl-unavailable"` on the fallback glow.
  - `HeroContent({ label, name, rotatingStack, summary, email })`
  - `HeroStats({ stats: Stat[] })`
  - `Hero()`, which renders `<section id="top" aria-labelledby="hero-title">`

- [ ] **Step 1: Write the failing test `src/components/hero/HeroBackground.test.tsx`**

```tsx
import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import HeroBackground from "./HeroBackground";

describe("HeroBackground", () => {
  it("falls back to the static glow when WebGL is unavailable", async () => {
    const { container } = render(<HeroBackground trackingRef={createRef<HTMLElement>()} />);

    await waitFor(() => {
      expect(container.querySelector('[data-reason="webgl-unavailable"]')).not.toBeNull();
    });
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<HeroBackground trackingRef={createRef<HTMLElement>()} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
```

- [ ] **Step 2: Write the failing test `src/test/reducedMotion.test.tsx`.** It needs its own file because motion caches the reduced-motion preference per module instance.

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setReducedMotion } from "./setup";

setReducedMotion(true);

const { default: StatItem } = await import("../components/ui/StatItem");
const { default: HeroContent } = await import("../components/hero/HeroContent");

describe("reduced motion", () => {
  it("shows final stat values immediately", () => {
    render(
      <dl>
        <StatItem stat={{ value: 97.2, suffix: "%", label: "Class XII score" }} />
        <StatItem stat={{ value: 7.63, label: "CSE CGPA" }} />
      </dl>
    );
    expect(screen.getAllByText("97.2%")).toHaveLength(2);
    expect(screen.getAllByText("7.63")).toHaveLength(2);
  });

  it("renders the hero name as plain heading text", () => {
    render(
      <HeroContent
        label="Full Stack Developer"
        name="Anup Singh Lodh"
        rotatingStack={["Node.js", "React"]}
        summary="Summary"
        email="a@b.c"
      />
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Anup Singh Lodh");
    expect(heading.querySelector(".blur-text")).toBeNull();
  });
});
```

- [ ] **Step 3: Run them to confirm they fail.** Run `npx vitest run src/components/hero src/test/reducedMotion.test.tsx`. Expected: FAIL, unresolved imports `./HeroBackground` and `../components/hero/HeroContent`.

- [ ] **Step 4: Create `HeroBackground.tsx`**

```tsx
import { lazy, Suspense, useCallback, useState, type RefObject } from "react";

const EvilEye = lazy(() => import("../reactbits/EvilEye"));

type HeroBackgroundProps = { trackingRef: RefObject<HTMLElement | null> };

const glowClassName =
  "absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,111,55,0.32),transparent_55%)] lg:bg-[radial-gradient(circle_at_50%_50%,rgba(255,111,55,0.38),transparent_45%)]";

export default function HeroBackground({ trackingRef }: HeroBackgroundProps) {
  const [failed, setFailed] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute inset-0 opacity-50 lg:left-[25vw] lg:opacity-100">
        {failed ? (
          <div className={glowClassName} data-reason="webgl-unavailable" />
        ) : (
          <Suspense fallback={<div className={glowClassName} />}>
            <EvilEye
              eyeColor="#ff6f37"
              backgroundColor="#07080a"
              intensity={1.4}
              glowIntensity={0.35}
              scale={0.8}
              pupilFollow={1}
              trackingRef={trackingRef}
              onError={handleError}
            />
          </Suspense>
        )}
      </div>
      <div className="absolute inset-y-0 left-0 hidden w-3/5 bg-linear-to-r from-bg via-bg/80 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-bg to-transparent" />
    </div>
  );
}
```

- [ ] **Step 5: Create `HeroContent.tsx`**

```tsx
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import BlurText from "../reactbits/BlurText";
import RotatingText from "../reactbits/RotatingText";
import ShinyText from "../reactbits/ShinyText";
import Button from "../ui/Button";

type HeroContentProps = {
  label: string;
  name: string;
  rotatingStack: string[];
  summary: string;
  email: string;
};

export default function HeroContent({ label, name, rotatingStack, summary, email }: HeroContentProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="max-w-2xl">
      <ShinyText
        text={label}
        speed={3}
        color="#8b919c"
        shineColor="#ffb08a"
        disabled={reducedMotion}
        className="font-mono text-xs uppercase tracking-[0.3em]"
      />
      <h1
        id="hero-title"
        aria-label={name}
        className="mt-5 text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl"
      >
        {reducedMotion ? (
          name
        ) : (
          <span aria-hidden="true">
            <BlurText text={name} delay={120} animateBy="words" direction="top" />
          </span>
        )}
      </h1>
      <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-lg text-muted sm:text-xl">
        <span>I build with</span>
        <RotatingText
          texts={rotatingStack}
          auto={!reducedMotion}
          rotationInterval={2200}
          staggerFrom="last"
          staggerDuration={0.02}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-120%" }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          mainClassName="overflow-hidden rounded-md bg-ember/10 px-2 py-0.5 text-ember-soft"
          splitLevelClassName="overflow-hidden"
        />
      </p>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{summary}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={`mailto:${email}`}>Email me</Button>
        <Button href="#projects" variant="outline">
          View projects
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `HeroStats.tsx`**

```tsx
import type { Stat } from "../../types";
import StatItem from "../ui/StatItem";

type HeroStatsProps = { stats: Stat[] };

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} />
      ))}
    </dl>
  );
}
```

- [ ] **Step 7: Create `src/sections/Hero.tsx`**

```tsx
import { useRef } from "react";
import HeroBackground from "../components/hero/HeroBackground";
import HeroContent from "../components/hero/HeroContent";
import HeroStats from "../components/hero/HeroStats";
import { hero, heroStats } from "../data/content";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-svh items-center overflow-hidden"
    >
      <HeroBackground trackingRef={sectionRef} />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <HeroContent {...hero} />
        <HeroStats stats={heroStats} />
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run the tests and type-check.** Run `npx vitest run src/components/hero src/test/reducedMotion.test.tsx && npx tsc -b`. Expected: 4 passed; no type errors. The top-level `await import` in `reducedMotion.test.tsx` relies on `"module": "ESNext"` and `"target": "ES2022"`, which `tsconfig.json` already sets.

- [ ] **Step 9: Commit**

```bash
git add src/components/hero src/sections/Hero.tsx src/test/reducedMotion.test.tsx
git commit -m "feat: add EvilEye hero with reduced-motion and WebGL fallbacks"
```

---

### Task 7: Content sections

**Files:**
- Create in `src/sections/`: `About.tsx`, `Experience.tsx`, `Projects.tsx`, `Skills.tsx`, `Education.tsx`, `Contact.tsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `Stagger`, `StaggerItem`, `Button`, the cards (Task 4), `SpotlightCard`, `GradientText`, `usePrefersReducedMotion`, and the content exports (Task 2).
- Produces default-exported `About()`, `Experience()`, `Projects()`, `Skills()`, `Education()`, `Contact()`. Each renders a `<section>` whose id is its `SectionId`.

These components are straight composition with no new logic, so the Task 8 App test covers them (each id exists, and each is labelled by its heading).

- [ ] **Step 1: Create `About.tsx`**

```tsx
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Reveal from "../components/ui/Reveal";
import Section from "../components/ui/Section";
import { about, quickFacts } from "../data/content";

export default function About() {
  return (
    <Section id="about" eyebrow="About" title={about.title}>
      <Reveal className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-base leading-relaxed text-muted md:text-lg">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <SpotlightCard className="p-6">
          <dl className="divide-y divide-line">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="flex justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <dt className="text-sm text-muted">{fact.label}</dt>
                <dd className="text-right text-sm font-medium text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 2: Create `Experience.tsx`**

```tsx
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Reveal from "../components/ui/Reveal";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { experience } from "../data/content";

export default function Experience() {
  const { role } = experience;

  return (
    <Section id="experience" eyebrow="Experience" title={experience.title}>
      <Reveal>
        <SpotlightCard className="p-6 md:p-10">
          <div className="flex flex-col gap-2 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink">{role.title}</h3>
              <p className="mt-1 text-ember-soft">{role.company}</p>
            </div>
            <p className="font-mono text-xs text-muted">
              {role.period} · {role.location}
            </p>
          </div>
          <Stagger as="ul" className="mt-6 grid gap-6 md:grid-cols-2">
            {role.bullets.map((bullet) => (
              <StaggerItem as="li" key={bullet.title}>
                <h4 className="font-medium text-ink">{bullet.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{bullet.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </SpotlightCard>
      </Reveal>
    </Section>
  );
}
```

- [ ] **Step 3: Create `Projects.tsx`**

```tsx
import ProjectCard from "../components/ui/ProjectCard";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { projects, projectsSection } from "../data/content";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title={projectsSection.title}>
      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
```

- [ ] **Step 4: Create `Skills.tsx`**

```tsx
import ProcessStep from "../components/ui/ProcessStep";
import Reveal from "../components/ui/Reveal";
import Section from "../components/ui/Section";
import SkillCard from "../components/ui/SkillCard";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import { processSteps, skillGroups, skillsSection } from "../data/content";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Technical Skills" title={skillsSection.title}>
      <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group) => (
          <StaggerItem key={group.title} className={group.wide ? "md:col-span-2 lg:col-span-4" : undefined}>
            <SkillCard group={group} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-20">
        <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-ember">{skillsSection.processTitle}</h3>
      </Reveal>
      <Stagger as="ol" className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {processSteps.map((step, index) => (
          <StaggerItem as="li" key={step.title}>
            <ProcessStep step={step} index={index} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
```

- [ ] **Step 5: Create `Education.tsx`**

```tsx
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import AchievementCard from "../components/ui/AchievementCard";
import Section from "../components/ui/Section";
import Stagger from "../components/ui/Stagger";
import StaggerItem from "../components/ui/StaggerItem";
import TimelineItem from "../components/ui/TimelineItem";
import { achievements, educationSection, timeline } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 80%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <Section id="education" eyebrow="Education & Achievements" title={educationSection.title}>
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div ref={timelineRef} className="relative">
          <div aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-line" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: reducedMotion ? 1 : scaleY }}
            className="absolute left-0 top-0 h-full w-px origin-top bg-ember"
          />
          <Stagger as="ol" className="space-y-10">
            {timeline.map((entry) => (
              <StaggerItem as="li" key={entry.title}>
                <TimelineItem entry={entry} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <Stagger className="space-y-4">
          {achievements.map((achievement) => (
            <StaggerItem key={achievement.title}>
              <AchievementCard achievement={achievement} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Create `Contact.tsx`.** `GradientText` renders `<div>`s, which are invalid inside `<h2>`, so it wraps the heading instead.

```tsx
import GradientText from "../components/reactbits/GradientText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import Button from "../components/ui/Button";
import Reveal from "../components/ui/Reveal";
import { contact, socialLinks } from "../data/content";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const headingClassName = "text-4xl font-semibold tracking-tight md:text-6xl";

export default function Contact() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <SpotlightCard className="px-6 py-14 text-center md:px-16 md:py-20">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ember">Contact</p>
          <div className="mx-auto mt-4 max-w-3xl">
            {reducedMotion ? (
              <h2
                id="contact-title"
                className={`${headingClassName} bg-linear-to-r from-ember to-ember-soft bg-clip-text text-transparent`}
              >
                {contact.title}
              </h2>
            ) : (
              <GradientText colors={["#ff6f37", "#ffb08a", "#46c7b5", "#ff6f37"]} animationSpeed={8}>
                <h2 id="contact-title" className={headingClassName}>
                  {contact.title}
                </h2>
              </GradientText>
            )}
          </div>
          <p className="mx-auto mt-6 max-w-xl text-muted">{contact.body}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {socialLinks.map((link, index) => (
              <Button key={link.label} href={link.href} variant={index === 0 ? "primary" : "outline"} external={link.external}>
                {link.cta}
              </Button>
            ))}
          </div>
        </SpotlightCard>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: Type-check.** Run `npx tsc -b`. Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/sections
git commit -m "feat: add about, experience, projects, skills, education and contact sections"
```

---

### Task 8: Compose the App, remove the old UI, update index.html and README

**Files:**
- Modify: `src/App.tsx` (full replacement), `src/main.tsx`, `index.html`, `README.md`
- Delete: `src/styles.css`, `src/test/smoke.test.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: every section and layout component, and `navItems`.

- [ ] **Step 1: Write the failing test `src/App.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { navItems } from "./data/content";

describe("App", () => {
  it("has a section for every nav link, labelled by its heading", () => {
    render(<App />);
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      expect(section, `missing section #${item.id}`).not.toBeNull();
      expect(section?.getAttribute("aria-labelledby")).toBe(`${item.id}-title`);
      expect(document.getElementById(`${item.id}-title`)).not.toBeNull();
    });
  });

  it("has exactly one h1 with the name", () => {
    render(<App />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName("Anup Singh Lodh");
  });

  it("has a #top target for the logo link", () => {
    render(<App />);
    expect(document.getElementById("top")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails.** Run `npx vitest run src/App.test.tsx`. Expected: FAIL. The old App has no `#about` or `#education`, and its section ids aren't labelled with `-title` headings.

- [ ] **Step 3: Replace `src/App.tsx`**

```tsx
import { MotionConfig } from "motion/react";
import Footer from "./components/layout/Footer";
import Nav from "./components/layout/Nav";
import ScrollProgress from "./components/layout/ScrollProgress";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Education from "./sections/Education";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
```

- [ ] **Step 4: Remove the old stylesheet.** Delete `src/styles.css` and the `import "./styles.css";` line in `src/main.tsx`. Delete `src/test/smoke.test.tsx`, which is superseded by the real tests.

```bash
git rm src/styles.css src/test/smoke.test.tsx
```

- [ ] **Step 5: Run all the tests.** Run `npm test`. Expected: all 7 test files pass, 24 tests in total.

- [ ] **Step 6: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#07080a" />
    <meta
      name="description"
      content="Portfolio of Anup Singh Lodh, a Computer Science graduate and full stack developer focused on backend development, browser automation, and web technologies."
    />
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
    />
    <title>Anup Singh Lodh | Full Stack Developer</title>
  </head>
  <body>
    <div id="root">
      <main style="font-family: Inter, Arial, sans-serif; padding: 48px 16px; max-width: 720px; margin: 0 auto; color: #ecedee; background: #07080a; line-height: 1.6">
        <h1>Anup Singh Lodh</h1>
        <p>
          Full stack developer and Computer Science graduate building browser automation, database-backed
          applications, and practical web systems with JavaScript, Node.js, React, and MongoDB.
        </p>
        <p><a href="mailto:asingh29240@gmail.com" style="color: #ff6f37">asingh29240@gmail.com</a></p>
      </main>
    </div>
    <noscript>This portfolio needs JavaScript for its interactive sections.</noscript>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Update `README.md`**
  - Replace the first paragraph's "a Computer Science undergraduate" with "a Computer Science graduate".
  - Replace the `## Highlights` and `## Tech Stack` lists with:

```markdown
## Highlights

- Dark, techy single-page design built with Tailwind CSS v4.
- WebGL "EvilEye" hero background from React Bits that follows the cursor, pauses offscreen, and falls back to a static glow without WebGL.
- React Bits text and card effects: BlurText, RotatingText, ShinyText, GradientText, DecryptedText, CountUp, SpotlightCard, Magnet.
- `motion`-driven section reveals, staggered grids, scroll progress, animated mobile menu, and a scroll-drawn education timeline.
- Full reduced-motion support.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- motion
- React Bits (vendored in `src/components/reactbits/`) + ogl
- Vitest + Testing Library
```

  - Replace `## Website Sections` with: Hero, About, Experience, Projects, Skills, Education & Achievements, Contact.
  - Add `npm test` under `## Build`.

- [ ] **Step 8: Build.** Run `npm run build`. Expected:
  - it succeeds
  - `EvilEye` and `ogl` are emitted as a separate JS chunk
  - the main chunk is smaller than the combined size

- [ ] **Step 9: Commit**

```bash
git add -A src index.html README.md
git commit -m "feat: compose redesigned app and remove legacy UI"
```

---

### Task 9: Visual verification in a real browser

**Files:** none. This task is verification only. Fix anything it finds in the owning file and commit as `fix: …`.

- [ ] **Step 1: Start the dev server.** Run `npm run dev` in the background and wait for `Local: http://localhost:5173/`.

- [ ] **Step 2: Check the desktop layout at 1440×900.** Using the `claude-in-chrome` skill, open `http://localhost:5173/` and take screenshots of the hero, projects, skills and education sections. Check:
  - the eye sits right of the text column and doesn't sit under the name
  - the hero text contrast is readable
  - the nav turns solid after scrolling
  - the active nav underline moves between sections
  - the pupil follows the cursor while hovering over the hero text

- [ ] **Step 3: Check the tablet (820×1180) and phone (390×844) layouts.** Check:
  - `document.documentElement.scrollWidth === window.innerWidth`, meaning there is no horizontal scroll
  - the menu toggle opens, closes and navigates
  - the stats row fits on one line, or wraps cleanly
  - the name doesn't overflow

- [ ] **Step 4: Check the console.** It should show no errors or warnings, including React key warnings and "Module level directives" warnings.

- [ ] **Step 5: Check reduced motion.** Emulate `prefers-reduced-motion: reduce` through DevTools (`Emulation.setEmulatedMedia`) and reload. Check:
  - the eye is static
  - the name and stats render without animating
  - the rotating word doesn't change
  - the timeline line is fully drawn

- [ ] **Step 6: Check the production build.** Run `npm run build && npm run preview`, open the preview URL, and confirm the hero renders the same as in dev. Stop both servers.
