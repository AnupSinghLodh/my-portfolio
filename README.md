# Anup Singh Lodh Portfolio

A modern personal portfolio website for Anup Singh Lodh, a Computer Science graduate focused on backend development, browser automation, and full-stack web applications.

The site is a React + TypeScript single-page portfolio with a WebGL hero, animated sections, and a backend-first technical presentation based on the resume content.

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

## Website Sections

- Hero
- About
- Experience
- Projects
- Skills
- Education & Achievements
- Contact

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the local site:

```text
http://127.0.0.1:5173/
```

Do not open `index.html` directly with `file://`; this project is a Vite app and should be served through the dev server or a production build.

## Build

Create a production build:

```bash
npm run build
```

Run the tests:

```bash
npm test
```

Preview the production build locally:

```bash
npm run preview
```

## Contact

- Email: [asingh29240@gmail.com](mailto:asingh29240@gmail.com)
- GitHub: [AnupSinghLodh](https://github.com/AnupSinghLodh)
- X: [@Anupsingh834920](https://x.com/Anupsingh834920)
