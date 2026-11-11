# anjalipanwar.com

A one-page site built around one idea: a page that has been **marked up by hand**.
Design decisions are in [`DESIGN.md`](./DESIGN.md).

Vite · React · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) · Lenis

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build
```

## Editing text: `src/content.ts`

Every word, link and list on the site is in **`src/content.ts`**. You should not
need to open a component to change copy. Anything in `[square brackets]` is a
placeholder waiting for real content.

Two placeholders to replace before launch:

- `site.email` — currently `hello@anjalipanwar.com`.
- `public/resume.pdf` — a one-line placeholder PDF. Replace the file, keep the name.

The `<title>`, meta description and social tags are in `index.html`.

### Add a case study

In `content.ts`, copy a block inside `work.cases` and edit it:

```ts
{
  title: 'Cutting release time in half',
  context: 'Company, 2024',
  problem: '…',
  did: '…',
  outcome: '…',
  note: 'ask me about this',   // the handwritten remark pointing at the outcome
},
```

Sheets number themselves, rotate slightly and stack in order. Three or four work best.

### Add an experiment

Copy a block inside `experiments.entries` (newest first):

```ts
{
  title: 'Name',
  when: 'March 2026',
  summary: 'What it is, in one line.',
  status: 'shipped',            // 'shipped' | 'in-progress' | 'killed'
  learned: 'what you learned',  // written by hand next to the entry
},
```

The status picks the mark: green check, blue squiggle, or pink cross (killed entries are also struck through).

### Timeline, capabilities, photos

- **Timeline:** `journey.stops`. Replace `20__` with real years. Add `note: '…'` to a stop for a handwritten note.
- **Capabilities:** `capabilities.items`, each with a `name` and a one-line `proof`. The first row starts open.
- **Photos:** put files in `public/photos/`, then set `src: '/photos/name.jpg'` and a real `alt` on a `photo` item in `beyond.items`. Until then the slot shows a sketch.

## Colours and fonts

Tokens live at the top of **`src/index.css`** in the `@theme` block, and Tailwind
classes are generated from them (`bg-paper`, `text-ink`, `text-biro`, …).

- **Colour:** change the hex in `@theme`. Marks take colour by name
  (`<Circle color="pink">`), mapped in `src/components/annotations/base.tsx`.
- **Handwriting font:** install another Fontsource face, swap the `@import` in
  `index.css`, and change `--font-hand`.
- **Display font:** swap the `@import` and `--font-display`. If the new file has
  a different name, update the filename pattern in `vite.config.ts` (it preloads the font).
  The `.loud` class uses the font's width axis (`font-stretch: 75%`); a font without one will simply ignore it.

## The annotation system

`src/components/annotations/` — `Circle`, `Underline`, `Highlight`, `Arrow`,
`Check`, `Cross`, `Squiggle`, `MarginNote`, and `Doodle`.

```tsx
<Circle color="blue" seed={7}>Engineer</Circle>
<Highlight seed={12}>Product thinker</Highlight>
<Check color="green" seed={5} className="h-8 w-8" />
<Arrow from={[0, 0.3]} to={[1, 0.7]} bend={-0.3} seed={4} className="h-12 w-20" />
<MarginNote seed={21}>where it started</MarginNote>
```

- `seed` changes the wobble. Give each mark its own number.
- `draw="scroll"` (default) draws the mark as it scrolls into view; `"manual"` lets a timeline drive it; `"static"` is always drawn.
- A mark is drawn by one CSS variable, `--p`, from 0 to 1.

## Regenerating the social image and icons

```bash
npm i -D playwright && npx playwright install chromium   # once
npm run assets
```

Writes `public/og.png` (a 1200×630 capture of the hero), the PNG favicons from
`public/favicon.svg`, and the placeholder `resume.pdf`. **It overwrites
`public/resume.pdf`**, so re-copy the real résumé afterwards (or delete that block in `scripts/generate-assets.mjs`).

`scripts/shoot.mjs`, `tour.mjs`, `record.mjs` and `sheet.py` are the screenshot helpers used during design review; they are not part of the site.

## Deploy to anjalipanwar.com

It is a static site: build command `npm run build`, output directory `dist`.

**Vercel**

1. Push the repo to GitHub and import it at vercel.com/new. Vercel detects Vite; keep the defaults.
2. Project → Settings → Domains → add `anjalipanwar.com` and `www.anjalipanwar.com`.
3. At your registrar, set the records Vercel shows (an `A` record for the apex, a `CNAME` for `www`). Choose which one redirects to the other.

**Netlify**

1. Add new site → Import from Git. Build command `npm run build`, publish directory `dist`.
2. Domain management → Add a domain → `anjalipanwar.com`, then follow the DNS instructions (or move DNS to Netlify).

HTTPS is issued automatically on both. The canonical URL and social tags in `index.html` already point at `https://anjalipanwar.com`.

## Accessibility and motion

- Semantic landmarks and headings, a skip link, visible Biro Blue focus rings (yellow on the blue section).
- With `prefers-reduced-motion`, smooth scrolling, pinning, stacking, scrubbing, the scramble and the magnetic buttons are all off, and every mark is fully drawn. The content is the same.
