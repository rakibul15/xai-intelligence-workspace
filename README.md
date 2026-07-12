# Xai — Intelligence Workspace

A single-page interactive product experience that visually explains how Xai turns raw data into decisions.

- **Live:** _(added after deploy)_
- **Figma:** https://www.figma.com/design/JL1YNH1xj0zO0xohixNyhb — design system, tokens, components, Hero frame
- **Walkthrough:** _(video link added after recording)_

---

## Product idea

Xai is an intelligence workspace for teams that ship on evidence. Raw data enters. Structured intelligence surfaces. Decisions leave. The interface is arranged so a decision-maker moves from raw signal to a next action without an intermediate reporting layer.

The site walks a reviewer through that transformation in four beats:

1. **Hero** — the promise. Scattered data particles morph into a structured lattice as you scroll.
2. **Insight Flow** — the mechanism. Three pinned stages (Ingest → Analyze → Insight) scrubbed by GSAP, closing with an *Automation queued* badge that nods to the last step of the narrative.
3. **Workspace** — the result. A restrained mock UI (sidebar, stat cards, signal-density chart, live alerts, tab-switched signal table) that reads as a real product, not marketing.
4. **Signature** — the idea in one gesture. A 3D data cluster of 120 nodes that reorganizes into three layouts (Grid / Sphere / Graph) on button press or `G` / `S` / `R` keypress, with a real shockwave that propagates outward and perturbs nodes as it passes.

---

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · GSAP + ScrollTrigger · React Three Fiber + drei · Lenis · Recharts.

No UI kit, no shadcn, no external cursor library, no Lottie, no stock assets. Everything on the page is code.

---

## Motion architecture

Every motion library has one clearly-defined job.

- **Framer Motion** — UI choreography: headline reveal stagger, `layoutId` tab pill, `AnimatePresence` stage swap, mobile menu entrance, the reshape flash overlay on the cluster.
- **GSAP + ScrollTrigger** — scrub-driven timelines: the particle morph in the hero and the three-stage pipeline pin in Insight Flow. GSAP registers its ticker with Lenis so ScrollTrigger fires on smoothed scroll positions instead of raw browser scroll events.
- **React Three Fiber** — the Signature cluster. Node positions lerp toward targets with `1 - Math.exp(-k·δt)` damping so movement is frame-rate independent. Shockwave is a real physics computation: on layout change, a ring expands at a fixed velocity, and each node's distance from the ring front translates into a proportional outward push.
- **Lenis** — smooth scroll, wired through the same GSAP ticker so animations, pins, and scroll are all on one timeline.
- **CSS** — the reduced-motion fallback (every layer honors `prefers-reduced-motion`) and the cursor's state changes (transforms driven by rAF, styles driven by `data-*` attributes so React doesn't re-render every frame).

The cursor and the cluster's shockwave are the two moments that carry the interaction weight; everything else supports.

---

## Key decisions

- **One accent color, one glow style.** The site reads as calm because it doesn't offer visual choices.
- **Instrument Serif for display, Geist Sans for UI, Geist Mono for meta.** Three fonts, three jobs.
- **Section labels (`01 / INTELLIGENCE WORKSPACE`)** enforce reading order and give the site spatial structure.
- **The 3D cluster IS the product idea.** "Every structure is a lens" — three arrangements of the same data means the pattern was always there. This is what a reviewer will remember.
- **Reduced motion is not a `@media` rule; it's a layer.** The R3F cluster skips its auto-rotation and shockwave, the particle field freezes at its final positions, GSAP timelines still run but the cluster reads it and adjusts.
- **Viewport-gated heavy imports.** Three.js and Recharts only load once the user scrolls near them (`IntersectionObserver` with a 400–500 px root margin). Initial page ships zero 3D bytes.
- **Every SVG coordinate is `.toFixed(2)`.** Next 16 + React 19 diverge by one ULP between Node SSR and browser number-to-string conversion — pre-formatting eliminates the hydration mismatch cleanly.

---

## Performance

Lighthouse against `next start` (localhost):

| | Desktop | Mobile |
|---|---|---|
| Performance | **100** | **91** |
| Accessibility | **100** | **100** |
| Best Practices | **100** | **100** |
| SEO | **100** | **100** |

Mobile Performance is bottlenecked by localhost TTFB under simulated slow-4G. On Vercel edge, LCP drops from ~5 s to ~1.5 s and mobile Performance lifts into the mid-90s.

---

## Run locally

```bash
git clone git@github.com:rakibul15/xai-intelligence-workspace.git
cd xai-intelligence-workspace
npm install
npm run dev
# http://localhost:3000
```

Production build (real perf numbers):

```bash
npm run build
npm run start
```

Keyboard: `⌘K` / `Ctrl+K` opens the command palette. `G` / `S` / `R` reshape the cluster on the Signature section.

---

## Structure

```
app/
  layout.tsx        fonts, Lenis provider, scroll progress, cursor, ⌘K palette
  page.tsx          four-section composition
  globals.css       design tokens (@theme), cursor styles, reduced-motion overrides
components/
  hero/             SVG particle field + GSAP scroll morph
  flow/             three-stage pipeline geometries + pinned scrub
  dashboard/        workspace shell, sidebar, chart, layoutId tabs, table
  signature/        R3F cluster, shockwave, HUD, coordinate grid
  ui/               Container, Button, Nav, Footer, SectionLabel,
                    Cursor, CommandPalette, SmoothScroll, ScrollProgress, Logo
lib/
  cn.ts             clsx + tailwind-merge
  clusterLayouts.ts grid, Fibonacci sphere, force-clustered graph, edge computation
  useInView.ts      IntersectionObserver hook for viewport-gated loading
```

---

## What I'd add next

- Streamed data for the dashboard chart via a fake WebSocket
- Playwright motion regression tests (assertions on cluster positions after keypress)
- A tablet-native layout (currently responsive shrink)
- Real search behind the ⌘K palette
- Deploy-time OG image generated from the hero at build time
