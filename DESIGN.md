# DESIGN.md — anjalipanwar.com

## Concept: "Marked Up"

A clean editorial page that has been reviewed by hand. Anjali spent a decade
as the person who reviews the work; now she builds. The page says that without
a paragraph: quiet type on paper, and a live layer of pen marks over it.

**One bold thing:** the annotation layer. Everything else is disciplined so the
marks feel alive.

## Colour — "the reviewer's pencil case"

| Token         | Hex       | Tailwind             | Role                                              |
| ------------- | --------- | -------------------- | ------------------------------------------------- |
| Paper         | `#F3F4F1` | `paper`              | Page background. Cool near-white.                 |
| Sheet         | `#FCFCFA` | `sheet`              | Loose sheets of paper lying on the page (work, photo slots). |
| Ink           | `#1C1B3A` | `ink`                | Text. Deep indigo.                                |
| Biro Blue     | `#3346FF` | `biro`               | Primary annotations, links, focus rings.          |
| Marker Pink   | `#FF4F8B` | `marker`             | Emphasis marks, hover states, the "red pen".      |
| Highlighter   | `#FFE45C` | `highlighter`        | Swipes behind text, selected states.              |
| Check Green   | `#1FA971` | `check`              | Checkmarks, shipped / in-progress status.         |

Rules:

- Colour is carried by annotations. Body text is always Ink (or Paper on blue).
- Two full-bleed sections for rhythm: **Beyond work** on Highlighter, **Contact** on Biro Blue.
- No gradients, no dark mode.
- Pink and green are *mark* colours, never text colours on Paper for anything
  that must be read at body size (they fail AA at small sizes). Handwritten
  notes that carry meaning are Biro Blue on Paper, Ink on Highlighter, and
  Highlighter/Paper on Biro Blue.
- On the Highlighter section, marks are Ink or Biro Blue only (pink/green on yellow fall under 3:1).

Contrast (WCAG 2.1): Ink on Paper 14.6:1 · Ink on Highlighter 12.7:1 ·
Paper on Biro Blue 5.5:1 · White on Biro Blue 6.1:1 · Biro Blue on Paper 5.5:1 ·
Highlighter on Biro Blue 4.8:1 (used at large sizes only).

## Typography

- **Bricolage Grotesque Variable** (`@fontsource-variable/bricolage-grotesque`, `standard` build: weight 200–800 + width 75–100).
- **Reenie Beanie** (`@fontsource/reenie-beanie`) for the annotation hand — only inside the annotation layer.

Two voices from one family, made with the width axis:

| Voice     | Width | Weight | Tracking  | Used for                                         |
| --------- | ----- | ------ | --------- | ------------------------------------------------ |
| **Loud**  | 75%   | 800    | −0.012em  | Hero terms, section titles, years, giant backdrops |
| **Plain** | 100%  | 400–600| −0.01em   | Body, capability rows, labels                    |

| Token      | Size                                   | Line height |
| ---------- | -------------------------------------- | ----------- |
| `hero`     | `clamp(2.9rem, 13.2vw, 5rem)` → `clamp(4.25rem, min(10vw, 15.5svh), 12.5rem)` ≥1024 | 0.9 |
| `display`  | `clamp(2.6rem, 7vw, 6rem)`             | 0.92        |
| `giant`    | `clamp(3.6rem, 23.5vw, 9rem)` → `clamp(9rem, 19vw, 22rem)` ≥1024 (contact) | 0.84 |
| `row`      | `clamp(2.5rem, 6.4vw, 6.5rem)` (Loud)  | 0.95        |
| `lead`     | `clamp(1.25rem, 1.7vw, 1.6rem)`        | 1.35        |
| `body`     | `1.125rem` → `1.25rem` ≥1024           | 1.5         |
| `hand`     | `clamp(2.25rem, 1.6rem + 1.3vw, 3.2rem)` (never below 1.9rem), with a 0.45px stroke for weight | 0.9 |

Line length is capped at 62ch for body text.

## Layout

A printed page with a wide margin.

- Page padding: `clamp(1.25rem, 4vw, 3.5rem)`.
- ≥1024px: two columns, **margin 22% | main 78%**. The margin belongs to the
  reviewer: handwritten notes, the experiment-log key, arrows that cross into the content.
- <1024px: single column. Margin notes become small rotated notes inline, next to what they annotate.
- Left-aligned everywhere. Nothing is centred.
- Things that break the grid on purpose: the journey track (runs full-bleed and
  off the right edge) and the contact headline.

## Annotation system (`src/components/annotations/`)

`<Circle>` `<Underline>` `<Highlight>` `<Arrow>` `<Check>` `<Cross>` `<Squiggle>` `<MarginNote>`

- Every mark is generated at runtime from the **measured pixel size** of what it
  annotates plus a **`seed`**. Same seed → same mark; different seed → different
  wobble, start angle, overshoot. No two marks on the page share a seed.
- Marks take a `color` token (`blue | pink | yellow | green | ink | paper`).
- One drawing mechanism: a CSS custom property **`--p`** (0 → 1) on the mark.
  Paths use `pathLength="1"` and `stroke-dashoffset: calc(1 - var(--p))`;
  handwritten notes use the same `--p` to wipe in with `clip-path`.
  `--p` defaults to `1`, so with no JS, or with reduced motion, every mark is fully drawn.
- `draw="scroll"` (default): scrubbed by ScrollTrigger as the mark enters the viewport; scrolling back un-draws it.
  `draw="manual"`: a parent timeline or CSS state owns `--p` (hero, journey, capability rows).
  `draw="static"`: always drawn.
- Stroke weights: biro 2–4.5px (scales with the text it marks), marker 3–6px, highlighter ≈ 0.6 × line height.

## Motion — a pen on paper

- Ease: `power3.out` for reveals, `power2.out` / `none` for strokes. Nothing bounces. No overshoot, no elastic.
- **Hero (one orchestrated moment, ≈2.2s):** three lines rise through a mask →
  circle → highlighter → check → arrow → margin note writes in. Nothing else animates in the hero on load.
- **Scroll:** Lenis drives the page, synced to GSAP's ticker and ScrollTrigger.
  - Marks draw scrubbed as they enter.
  - Journey pins and scrolls horizontally (≥1024px); its arrows draw as each stop arrives.
  - Work sheets stack with `position: sticky`; the covered sheet settles back slightly.
- **Response:** ink-dot cursor that opens into a ring over interactive things
  (fine pointers only), magnetic contact buttons, highlighter sweep on capability rows,
  one text scramble on the "currently …" word in the hero.
- **`prefers-reduced-motion`:** no Lenis, no pinning, no sticky stacking, no scrub, no
  scramble, no magnet. Marks render fully drawn. Content is identical.

## Libraries, and what was left out

- **React Bits** — two components, copied in and restyled:
  `Magnet` (contact buttons; spring re-tuned to be critically damped so it never bounces) and
  `DecryptedText` (reduced to a small `ScrambleWords` that cycles words; the `motion` dependency was dropped).
- **Vanta.js — not used.** A WebGL backdrop fights the paper concept and adds three.js weight for nothing.
- **lucide-react — not used.** No place on the page needed an icon; the marks do that job.

## Review of the defaults (what I changed and why)

1. **Handwriting face: Caveat → Reenie Beanie.** Caveat is the handwriting font
   every portfolio reaches for; it reads as "a font". Reenie Beanie is thin and
   scratchy like an actual biro. Trade-off: it is less legible small, so `hand` never goes below 1.5rem.
2. **Hero scale: one size → two.** A uniform three-line headline is the default.
   Instead the three terms are enormous and condensed, and the qualifiers
   ("by background.") are small and plain beside them. The marks land on the big words.
3. **Section labels: none.** No eyebrows, no numbering. Where a section needs a
   second voice, the reviewer says it in the margin.
4. **Timeline years** are placeholders, so they are set as blanks to fill in (`20__`), like a form — not invented dates.
5. **Capability rows are not cards or a hover list.** Big type rows, one open at a time, with the reviewer's tick on the open one (see the refinement pass below).
6. **Contact buttons are not pills.** They are words the reviewer has circled; hovering redraws the circle.
7. **Optical-size axis:** the brief asked for width *and* optical size. Fontsource
   ships them as separate files (no single file has both), and loading two
   variable files costs ~80KB more on mobile. Width does the expressive work here; see README for swapping in a full build.

## Removed in the refine pass

- **The "v0.1" label on the hero sketch.** A third small thing in a corner that already
  holds the sketch and the "currently …" line; too small to read, and it said nothing the sketch didn't.
- `text-rendering: optimizeLegibility` (cost layout time on mobile for no visible gain).
- Vertical nudges on the mobile collage (they pushed photos over the stickers).

## Measured

Lighthouse, mobile emulation, production build: Performance 93–96, Accessibility 100,
Best Practices 100, SEO 100. CLS 0, LCP 0.8s.

## Refinement pass

- **Hero:** each line is a baseline-aligned row: big word, then its qualifier at one size and one gap. The check now follows "by nature." so it no longer pushes that qualifier out. Type is sized against viewport height as well as width, so the hero fits one screen at 1280×720 and 1440×900. The corner sketch is gone; "Currently …" sits beside the buttons.
- **Handwriting:** about 40% larger, with a hairline stroke so the thin face carries the weight of a pen. Colour pairs are unchanged and pass AA (Biro Blue on Paper 5.5:1, Highlighter on Biro Blue 4.8:1, Ink on Highlighter 12.7:1).
- **Margin notes** sit beside what they point at, with an arrow that crosses the margin line (`MarginAside`). On small screens each note is inline.
- **What I bring:** rows are in the Loud voice at roughly twice the size. One row is open at a time, the first by default; click, tap, Enter or Space toggles. The right edge carries the state: a plus when closed, the reviewer's tick when open. Hover no longer opens rows.
- **Beyond work:** a tighter collage (smaller photo slots, stickers overlapping their neighbours), about one viewport on desktop.
- **Yellow → blue:** the yellow section ends in three highlighter passes with slanted ends, running out over the blue.
- **Journey:** the grey backdrop word is removed.
- **Spacing:** section padding reduced by 30% (`--section`), plus tighter gaps around Selected work and above the footer.
- **Cursor:** white with `mix-blend-mode: difference`, so it reads on paper, on text, on yellow and on blue.
