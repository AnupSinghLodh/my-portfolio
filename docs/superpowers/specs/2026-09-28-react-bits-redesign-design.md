# Portfolio Redesign: React Bits + Tailwind (Dark Techy)

Date: 2026-09-28

## Goal

Replace the current cream/teal hand-rolled UI with a dark, techy portfolio built on Tailwind CSS v4 and
React Bits components, with the React Bits `EvilEye` shader as the hero background. Content stays the same
apart from the corrections listed below; the section structure is tightened.

Success looks like:

- `npm run build` (tsc + vite) passes.
- The page looks polished at desktop (1440px), tablet (820px), and phone (390px) widths with no horizontal scroll.
- The hero text is readable over the EvilEye background.
- Reduced-motion users get a static page (no shader loop, no text animation).

## Decisions

| Topic | Decision |
|---|---|
| Visual direction | Dark techy: near-black background, ember-orange accent taken from the EvilEye colour, plus a cool secondary accent |
| Hero background | React Bits `EvilEye` (TS + Tailwind variant). Replaces the Aurora I proposed earlier and the existing `AutomationCanvas` network animation |
| Styling | Tailwind CSS v4 through `@tailwindcss/vite`; `src/styles.css` is deleted |
| How React Bits is added | Copy each TS-TW component's source from the `reactbits.dev/r/<Name>-TS-TW.json` registry into `src/components/reactbits/`. No shadcn CLI, `components.json`, or path aliases |
| New dependencies | `tailwindcss`, `@tailwindcss/vite` (dev); `ogl`, `motion` (runtime). No `gsap` |
| Sections | Tightened from 12 to 7 (see below); the decorative `SectionTransition` bars are removed |
| Project mini previews | Removed (they account for most of the CSS). Cards use SpotlightCard + tags instead |
| Hero photo | `hero-workspace.png` (1.5 MB) is no longer used; the file stays in `public/` |

## Theme tokens (`src/index.css`)

```css
@import "tailwindcss";

@theme {
  --color-bg: #07080a;        /* page background; also EvilEye backgroundColor */
  --color-surface: #0f1115;   /* cards */
  --color-line: #1f232b;      /* borders */
  --color-ink: #ecedee;       /* primary text */
  --color-muted: #8b919c;     /* secondary text */
  --color-ember: #ff6f37;     /* primary accent = EvilEye eyeColor */
  --color-ember-soft: #ffb08a;
  --color-cool: #46c7b5;      /* secondary accent, used sparingly */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

The fonts come from Google Fonts and are linked in `index.html`.

## File structure

Every major component lives in its own file, one component per file. Sections compose the smaller UI
components; the smaller components take typed props and don't import `data/content.ts` themselves.

```
src/
  main.tsx                        imports ./index.css
  index.css                       Tailwind import + @theme tokens + a few base styles
  App.tsx                         page composition only (Nav, sections, Footer)
  types.ts                        Project, Credential, SkillGroup, Stat, etc.
  data/content.ts                 all copy and data arrays (moved out of App.tsx)
  lib/motion.ts                   shared motion variants (fadeUp, stagger container, spring presets)
  hooks/
    usePrefersReducedMotion.ts    wraps motion's useReducedMotion
    useScrolled.ts                boolean: scrollY > threshold
  components/
    layout/
      Nav.tsx
      MobileMenu.tsx
      ScrollProgress.tsx
      Footer.tsx
    ui/
      Reveal.tsx                  whileInView fade/slide wrapper
      Stagger.tsx                 staggers the children of a list or grid into view
      SectionHeading.tsx
      Button.tsx                  link-styled button (primary/outline) with Magnet + motion hover/tap
      Tag.tsx
      StatItem.tsx                CountUp number + label
      ProjectCard.tsx
      SkillCard.tsx
      ProcessStep.tsx             one "How I build" step
      TimelineItem.tsx
      AchievementCard.tsx
    hero/
      HeroBackground.tsx          lazy EvilEye + gradient overlays + static fallback
      HeroContent.tsx             label, name, rotating line, CTAs
      HeroStats.tsx
    reactbits/                    vendored React Bits sources, lightly modified where noted
      EvilEye.tsx
      BlurText.tsx
      RotatingText.tsx
      ShinyText.tsx
      GradientText.tsx
      DecryptedText.tsx
      CountUp.tsx
      SpotlightCard.tsx
      Magnet.tsx
  sections/
    Hero.tsx
    About.tsx
    Experience.tsx
    Projects.tsx
    Skills.tsx
    Education.tsx
    Contact.tsx
```

## Motion usage (`motion` library, `motion/react`)

`motion` is used directly as well as inside the React Bits components:

- **Section entrances:** `Reveal` fades each section in (`whileInView`, `viewport={{ once: true, amount: 0.2 }}`).
  `Stagger` uses the shared container/item variants from `lib/motion.ts` for card grids, bullet lists and the
  timeline.
- **Scroll progress bar:** `useScroll().scrollYProgress` → `useSpring` → `scaleX` on `ScrollProgress`. This
  replaces the current `setState`-on-scroll approach, so the progress bar doesn't re-render the page on every
  scroll event.
- **Nav:** the bar animates its background and border in with `animate` when `useScrolled` flips.
  `MobileMenu` opens and closes with `AnimatePresence` (height/opacity), and the active link gets a sliding
  underline using `layoutId`.
- **Buttons and cards:** `whileHover` / `whileTap` spring scale on `Button`, and `ProjectCard` lifts slightly on hover.
- **Timeline:** the vertical line in Education draws itself with `useScroll({ target })` → `scaleY`.
- **Reduced motion:** all of the above is disabled by wrapping `App` in `<MotionConfig reducedMotion="user">`,
  plus the explicit `usePrefersReducedMotion` checks for the non-motion code (EvilEye, CountUp).

## Sections

1. **Nav**: fixed, frosted-glass bar (`backdrop-blur`, translucent bg, border shows after 12px of scroll). The logo sits
   on the left with alt text "Anup Singh Lodh". Links follow page order: About, Experience, Projects, Skills,
   Education, Contact. Under `md` the links collapse into a toggle menu (keeping the current `aria-expanded` behaviour).
   A thin ember scroll-progress bar sits at the top.
2. **Hero**: full viewport height.
   - Background: `EvilEye` fills the hero absolutely (`eyeColor="#ff6f37"`, `backgroundColor="#07080a"`,
     `pupilFollow` on). On `lg+` its container is shifted right (it spans the hero and is offset about 25vw) so the eye
     sits to the right of the text column. On smaller screens it is centred behind the text at reduced opacity.
     A bottom gradient fades it into the page bg, and a left gradient on `lg+` keeps the text readable.
   - Content (left column): ShinyText label "Full Stack Developer" → BlurText `h1` "Anup Singh Lodh" →
     "I build with [RotatingText: Node.js · Puppeteer · React · MongoDB · Express]" → a one-line summary →
     Magnet-wrapped buttons "Email me" (ember, filled) and "View projects" (outline) → CountUp stats row:
     CGPA 7.63, Class XII 97.2%, 3 projects.
3. **About**: two paragraphs on the left; on the right, a card with the quick facts (role, focus, education,
   location) as a definition list.
4. **Experience**: the ixigo role in one SpotlightCard: title, company, dates, location, 4 bullets.
5. **Projects**: 3 SpotlightCards in a responsive grid (1/2/3 columns). Each has a number, a DecryptedText title that
   animates on hover, the duration, the summary and tag chips. Links are added only if the user supplies them.
6. **Skills**: a bento grid of SpotlightCards (Languages, Frameworks & Libraries, Developer Tools, Databases, and
   Concepts spanning full width), followed by a "How I build" strip with the 4 steps from the old Systems section
   (numbered, horizontal on `lg`, stacked on mobile). This absorbs Systems and Tech Lab.
7. **Education & Achievements**: a vertical timeline (degree, school, NPTEL courses, NPTEL Discipline Star),
   followed by 3 cards: Yuva Unstoppable Scholarship, Captain of CSE Hawks, Languages.
8. **Contact + footer**: GradientText `h2` "Let's build something useful.", a short paragraph, and Magnet buttons
   for email, LinkedIn, GitHub and X. The footer has the copyright and the same links.

Every section except the hero is wrapped in `<Reveal>`.

## EvilEye integration details

The registry source is taken as-is, with these changes:

- **Pause when offscreen:** an `IntersectionObserver` on the container stops the rAF loop while the hero is out
  of view and restarts it when it comes back.
- **Reduced motion:** render a single frame (time fixed at 0, pupil follow off) and don't start the loop.
- **Mouse tracking:** add an optional `trackingRef?: RefObject<HTMLElement | null>` prop. When it's set, the mouse
  listeners attach to that element instead of the container, and coordinates are still computed against the
  container's rect. `Hero` passes its `<section>` ref, so the pupil follows the cursor anywhere over the hero even
  though the text column sits on top of the canvas.
- **Canvas CSS size:** the canvas gets `display:block; width:100%; height:100%` so it can't overflow its container.
- **Loading:** `EvilEye` is imported with `React.lazy` so `ogl` and the shader aren't in the main chunk. The
  fallback is a static radial ember gradient.
- **WebGL unavailable:** if the WebGL renderer throws, catch the error and show the same static gradient.

## Motion and accessibility

- `usePrefersReducedMotion` gates BlurText, RotatingText, CountUp (which shows the final value), DecryptedText,
  Reveal, and the EvilEye loop.
- The hero `h1` keeps an accessible text label. BlurText splits text into spans, so the heading gets
  `aria-label`, and the spans get `aria-hidden`.
- Buttons and links keep a visible `focus-visible` ring in the ember colour.
- Colour contrast: body text (`ink` / `muted` on `bg`) meets WCAG AA.

## Content corrections (applied while moving copy into `data/content.ts`)

- The About copy says "graduate". The README is updated to match, and the Contact copy drops "internship
  conversations".
- The job title is consistently "Software Developer Intern" and the company is written "ixigo".
- The duplicate GitLab bullet is removed.
- "bypasses mandatory policy agreements" becomes "handles mandatory consent and policy steps automatically".
- The hero metric "4+ Core project areas" is replaced by "3 projects".
- The Portfolio project's tags become the real stack of this site: React, TypeScript, Tailwind CSS, Vite, React Bits.
- The `index.html` placeholder is replaced by a short bio paragraph plus a `<noscript>` note, and the description
  meta is updated to "graduate".

## Out of scope

- Adding project links or a live demo (the user supplies URLs later).
- A light theme or theme toggle.
- Deploy configuration.

## Verification

1. `npm run build` passes.
2. Run `npm run dev` and screenshot the page at 1440px, 820px and 390px. Check:
   - the hero text is legible over the eye
   - there is no horizontal scroll
   - the nav menu works on mobile
   - the pupil follows the cursor over the hero
3. With reduced motion emulated, the eye shows as a static frame and the text isn't animated.
4. The browser console shows no errors or warnings.
