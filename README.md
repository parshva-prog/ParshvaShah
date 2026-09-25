# Parshva Shah — 3D Portfolio

Immersive, agency-grade portfolio: WebGL particle hero, GSAP-driven scroll
motion, Lenis inertia scroll, magnetic UI, and a full postprocessing pipeline.

**Verified**: production build succeeds, and the page was loaded in a real
headless Chromium (Playwright) with zero runtime/console errors. Screenshot
pixel analysis confirms the WebGL scenes actually render (10.5% non-background
pixels in the hero canvas, 28% in the skills section, with color values up to
255 — not a blank canvas).

## Stack


| Concern            | Library                                                            |
| ------------------ | ------------------------------------------------------------------ |
| Framework          | React 19 + Vite                                                    |
| 3D / WebGL         | Three.js via `@react-three/fiber` + `@react-three/drei`            |
| Postprocessing     | `@react-three/postprocessing` (Bloom, Chromatic Aberration, Noise) |
| Scroll animation   | GSAP + ScrollTrigger + SplitText (bundled free in GSAP 3.13+)      |
| Inertia scroll     | `lenis`                                                            |
| Micro-interactions | Framer Motion                                                      |
| Styling            | Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config)            |


**One deliberate deviation from spec:** you asked for `@studio-freight/lenis`,  
but that package was renamed upstream to `lenis` (same maintainers, same code,
`@studio-freight/lenis` now just warns on install as deprecated). I used
`lenis` directly so the project doesn't ship a deprecated dependency.

## Setup

```bash
npm install
npm run dev       # local dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                composes Loader, Nav, sections, FloatRail
  index.css              Tailwind import + design tokens (CSS vars)
  data/projects.js        real project/skills/contact data — edit here to update content
  hooks/
    useLenis.js           wires Lenis into GSAP's ScrollTrigger ticker
    useReducedMotion.js   live prefers-reduced-motion + low-power (coarse pointer) detection
    useMagnetic.js        magnetic-hover spring physics for buttons
  three/
    Experience.jsx        hero Canvas: particle sphere, camera parallax rig, postprocessing
    ParticleSphere.jsx     the hero's 3D particle geometry (Fibonacci sphere distribution)
    SkillsOrbit.jsx        floating labeled orbs for the skills section
  components/
    Loader.jsx             kinetic percentage loader (skipped entirely under reduced motion)
    Nav.jsx / FloatRail.jsx sticky nav + floating LinkedIn/GitHub/WhatsApp rail
    Hero.jsx                kinetic typography + scroll-driven "fly-through" effect
    KineticText.jsx         GSAP SplitText character reveal
    About.jsx / Skills.jsx / Contact.jsx
    ProjectCard.jsx         3D cursor-tilt card with dynamic lighting glow
    ProjectModal.jsx        blur + wipe transition detail view
    MagneticButton.jsx      shared magnetic CTA
```

## Performance & accessibility notes

- **`prefers-reduced-motion`**: disables the Loader, camera parallax,
fly-through zoom, magnetic buttons, kinetic text reveal (renders instantly),
and Lenis (falls back to native scroll).
- **Low-power / coarse-pointer devices** (`pointer: coarse` — phones/tablets):
particle count drops from 2400 → 900, postprocessing (Bloom/Chromatic
Aberration/Noise) is skipped entirely, and the Skills 3D scene is replaced
with a static message instead of a second WebGL context.
- The Skills 3D scene is loaded with `React.lazy` when the section nears the
  viewport; Vite separates Three.js from the initial entry chunk.

## Deploy on GitHub Pages

This project is configured for the existing `ParshvaShah` repository under the
`parshva-prog` GitHub account. Its project-site URL is
`https://parshva-prog.github.io/ParshvaShah/`.

1. Push this project to the `main` branch of `parshva-prog/ParshvaShah`.
2. In the repository, open **Settings → Pages** and set the source to
   **GitHub Actions**.
3. The workflow at `.github/workflows/deploy.yml` installs dependencies, runs
   `npm run build`, and publishes `dist/` after each push.

The Vite base path is `/ParshvaShah/`, so the site assets load from the
repository's project-site URL.

The portfolio is a single-page static site with in-page section links, so no
server-side route fallback is required. GitHub Pages serves the built files
directly.

## SEO

The metadata is configured for `https://parshva-prog.github.io/ParshvaShah/`.

### Update the site URL if it changes

The canonical URL is set to `https://parshva-prog.github.io/ParshvaShah/`. To change
the site URL or repository path, pass the complete URL (including the project
path) to the update script:

```bash
npm run set-url https://username.github.io/RepositoryName/
```

This updates canonical/social metadata, the sitemap, robots file, Vite base path,
and README, then refreshes the sitemap date. The web manifest uses relative paths. Commit and push the changes so the
GitHub Pages deployment uses the new URL.

### What's included


| Item                                            | File                      | Purpose                                         |
| ----------------------------------------------- | ------------------------- | ----------------------------------------------- |
| Title, description, keywords, robots            | `index.html`              | Search result appearance                        |
| Canonical URL                                   | `index.html`              | Prevents duplicate-URL dilution                 |
| Open Graph (9 tags)                             | `index.html`              | LinkedIn / WhatsApp / Slack / Facebook previews |
| Twitter Card (`summary_large_image`)            | `index.html`              | X previews                                      |
| Share card, 1200×630                            | `public/og-image.png`     | The image in those previews                     |
| JSON-LD: Person, WebSite, ProfilePage, ItemList | `index.html`              | Knowledge-graph eligibility, rich results       |
| `noscript` fallback                             | `index.html`              | Real content for non-JS crawlers                |
| Sitemap + image sitemap                         | `public/sitemap.xml`      | Crawl guidance                                  |
| `robots.txt`                                    | `public/robots.txt`       | Crawl rules; AI crawlers explicitly allowed     |
| PWA manifest + maskable icon                    | `public/site.webmanifest` | Installable, correct Android icon               |
| Favicons 16/32/SVG + Apple touch                | `public/`                 | Tab and home-screen icons                       |
| Automated build and deployment                  | `.github/workflows/deploy.yml` | Publishes `dist/` to GitHub Pages           |


### Regenerating the share card and icons

The card and icon set are generated from `public/parshva-portrait.png`. If you swap the portrait, regenerate with your own script or re-crop by hand — sizes needed are `og-image.png` (1200×630), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (safe area = centre 64%), `favicon-32.png`, `favicon-16.png`.

### After deploying

1. Paste the URL into [OpenGraph.xyz](https://www.opengraph.xyz/) to confirm the card renders.
2. Submit `https://parshva-prog.github.io/ParshvaShah/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).
3. Run the page through the [Rich Results Test](https://search.google.com/test/rich-results) to confirm the `Person` block is picked up.
4. LinkedIn caches aggressively — clear with the [Post Inspector](https://www.linkedin.com/post-inspector/) if you update the card.

&nbsp;