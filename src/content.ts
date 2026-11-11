/**
 * content.ts — every word on the site lives here.
 *
 * Edit this file to change copy, links, case studies, experiments and the
 * timeline. You should never need to open a component to change text.
 *
 * Anything in [square brackets] is a placeholder waiting for real content.
 */

/* ------------------------------------------------------------------ */
/* Site-wide                                                           */
/* ------------------------------------------------------------------ */

export const site = {
  name: 'Anjali Panwar',
  location: 'Berlin',
  url: 'https://anjalipanwar.com',
  /** PLACEHOLDER — replace with the real address. */
  email: 'hello@anjalipanwar.com',
  links: {
    linkedin: 'https://linkedin.com/in/anjalipanwar',
    github: 'https://github.com/Anjalipanwar',
    /** PLACEHOLDER — drop the real PDF at public/resume.pdf (same path). */
    resume: '/resume.pdf',
  },
  skipLink: 'Skip to content',
};

export const nav = [
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#work' },
  { label: 'Experiments', href: '#experiments' },
  { label: 'Contact', href: '#contact' },
];

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

export const hero = {
  /**
   * The headline. `term` is set huge, `tail` small beside it.
   * `mark` chooses the annotation: 'circle' | 'highlight' | 'check'.
   */
  lines: [
    { term: 'Engineer', tail: 'by background.', mark: 'circle' },
    { term: 'Product thinker', tail: 'by curiosity.', mark: 'highlight' },
    { term: 'Builder', tail: 'by nature.', mark: 'check' },
  ] as const,
  /** Handwritten margin note pointing at the first line. */
  note: 'where it started',
  intro:
    'Ten years in engineering, test automation, cloud and AI-assisted workflows. Now moving toward product and early-stage operator work, from Berlin.',
  actions: {
    primary: { label: 'See my work', href: '#work' },
    secondary: { label: 'Get in touch', href: '#contact' },
  },
  /** "Currently <rotating word> small AI-powered products." The word scrambles between these. */
  currently: {
    before: 'Currently',
    words: ['building', 'validating', 'testing', 'rethinking'],
    after: 'my own small AI-powered products.',
  },
};

/* ------------------------------------------------------------------ */
/* 2. About / Journey                                                  */
/* ------------------------------------------------------------------ */

export const journey = {
  title: 'The long way round.',
  intro:
    '[Short intro, two or three sentences: where you started, what kept pulling you toward product, and why you are building your own things now.]',
  marginNote: 'keep scrolling, it goes sideways',
  /** Giant word behind the timeline. */
  backdrop: 'journey',
  /**
   * Timeline stops, in order. `year` is set very large: replace the blanks
   * with real years. `note` (optional) adds a handwritten note to that stop.
   */
  stops: [
    { year: '20__', place: 'India', line: '[Where it began: studies, first role, first thing you built.]' },
    { year: '20__', place: 'Cisco', line: '[What you worked on there and what it taught you.]' },
    { year: '20__', place: 'Stanford PM course', line: '[Why you took it and what changed in how you think.]' },
    { year: '20__', place: 'Berlin', line: '[The move: what brought you here and what you did next.]' },
    {
      year: 'Now',
      place: 'Building my own products',
      line: '[What you are building and validating right now.]',
      note: 'you are here',
    },
  ] as { year: string; place: string; line: string; note?: string }[],
};

/* ------------------------------------------------------------------ */
/* 3. What I bring                                                     */
/* ------------------------------------------------------------------ */

export const capabilities = {
  title: 'What I bring.',
  marginNote: 'hover one. there is proof.',
  marginNoteTouch: 'tap one. there is proof.',
  /** Seven rows. `proof` is the one line that appears on hover / tap. */
  items: [
    { name: 'Product thinking', proof: '[Proof: a decision you shaped, and what happened because of it.]' },
    { name: 'Quality as a habit', proof: '[Proof: a release you de-risked, and how.]' },
    { name: 'Test automation', proof: '[Proof: a suite or framework you built, with one number.]' },
    { name: 'Cloud & infrastructure', proof: '[Proof: something you ran in production, and at what scale.]' },
    { name: 'AI-assisted workflows', proof: '[Proof: a workflow you rebuilt with AI, and the time it saved.]' },
    { name: 'Zero-to-one building', proof: '[Proof: an idea you took from nothing to real users.]' },
    { name: 'Translating between teams', proof: '[Proof: a moment you got engineering and business to the same page.]' },
  ],
};

/* ------------------------------------------------------------------ */
/* 4. Selected work                                                    */
/* ------------------------------------------------------------------ */

export const work = {
  title: 'Selected work.',
  intro: '[One sentence on how to read these: three problems, what you did, what changed.]',
  marginNote: 'three sheets. they stack.',
  labels: { problem: 'Problem', did: 'What I did', outcome: 'Outcome' },
  /**
   * Case studies. To add one, copy a block and edit it.
   * `note` is the handwritten remark pointing at the outcome.
   */
  cases: [
    {
      title: '[Case study title]',
      context: '[Company or project, year]',
      problem: '[The problem in two sentences. Who had it, and why it mattered.]',
      did: '[What you did. Your role, the key decision, the thing you built.]',
      outcome: '[The outcome. One number or one concrete change.]',
      note: 'the bit that matters',
    },
    {
      title: '[Case study title]',
      context: '[Company or project, year]',
      problem: '[The problem in two sentences. Who had it, and why it mattered.]',
      did: '[What you did. Your role, the key decision, the thing you built.]',
      outcome: '[The outcome. One number or one concrete change.]',
      note: 'ask me about this',
    },
    {
      title: '[Case study title]',
      context: '[Company or project, year]',
      problem: '[The problem in two sentences. Who had it, and why it mattered.]',
      did: '[What you did. Your role, the key decision, the thing you built.]',
      outcome: '[The outcome. One number or one concrete change.]',
      note: 'shipped',
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 5. Ideas & experiments                                              */
/* ------------------------------------------------------------------ */

export type ExperimentStatus = 'shipped' | 'in-progress' | 'killed';

export const experiments = {
  title: 'Ideas & experiments.',
  intro: '[One sentence: small bets, kept honestly. Most do not survive, and that is the point.]',
  /** Handwritten labels for each status (also used as the key in the margin). */
  statusLabels: {
    shipped: 'shipped',
    'in-progress': 'in progress',
    killed: 'killed',
  } as Record<ExperimentStatus, string>,
  keyTitle: 'key',
  learnedPrefix: 'learned:',
  /**
   * The log. Newest first. To add an entry, copy a block.
   * status: 'shipped' | 'in-progress' | 'killed'
   */
  entries: [
    {
      title: '[Experiment name]',
      when: '[Month YYYY]',
      summary: '[What it is, in one line.]',
      status: 'in-progress',
      learned: '[what you are finding out]',
    },
    {
      title: '[Experiment name]',
      when: '[Month YYYY]',
      summary: '[What it is, in one line.]',
      status: 'shipped',
      learned: '[what you learned]',
    },
    {
      title: '[Experiment name]',
      when: '[Month YYYY]',
      summary: '[What it was, in one line.]',
      status: 'killed',
      learned: '[why you stopped]',
    },
    {
      title: '[Experiment name]',
      when: '[Month YYYY]',
      summary: '[What it is, in one line.]',
      status: 'shipped',
      learned: '[what you learned]',
    },
  ] as { title: string; when: string; summary: string; status: ExperimentStatus; learned: string }[],
};

/* ------------------------------------------------------------------ */
/* 6. Beyond work                                                      */
/* ------------------------------------------------------------------ */

export type BeyondItem =
  /** A big word on a paper label. */
  | { kind: 'sticker'; text: string }
  /** A photo slot. Set `src` (e.g. '/photos/lisbon.jpg', file in public/photos) when a photo exists. */
  | { kind: 'photo'; src: string | null; alt: string; caption: string; doodle: 'plane' | 'mountain' | 'book' }
  /** A handwritten list. */
  | { kind: 'note'; heading: string; lines: string[] };

export const beyond = {
  title: 'Beyond work.',
  intro: '[A line or two about who you are when the laptop is closed.]',
  photoPlaceholder: 'photo goes here',
  items: [
    { kind: 'sticker', text: 'Travel' },
    { kind: 'photo', src: null, alt: '[Describe the photo]', caption: '[Place, year]', doodle: 'plane' },
    { kind: 'note', heading: 'learning right now', lines: ['[thing one]', '[thing two]', '[thing three]'] },
    { kind: 'sticker', text: 'Curiosity' },
    { kind: 'photo', src: null, alt: '[Describe the photo]', caption: '[Place, year]', doodle: 'mountain' },
    { kind: 'sticker', text: 'Always learning' },
    { kind: 'photo', src: null, alt: '[Describe the photo]', caption: '[What this is]', doodle: 'book' },
  ] as BeyondItem[],
};

/* ------------------------------------------------------------------ */
/* 7. Contact + footer                                                 */
/* ------------------------------------------------------------------ */

export const contact = {
  /** Giant headline, one array item per line. `underline` is the word that gets marked. */
  titleLines: ['Let’s build', 'something.'],
  underline: 'something.',
  marginNote: 'pick one. I answer.',
  intro: '[One line on what you are open to: founder’s associate, chief of staff, product, early-stage operator roles.]',
  buttons: [
    { label: 'Email', href: `mailto:${site.email}`, external: false },
    { label: 'LinkedIn', href: site.links.linkedin, external: true },
    { label: 'GitHub', href: site.links.github, external: true },
    { label: 'Résumé', href: site.links.resume, external: true },
  ],
};

export const footer = {
  signoff: 'reviewed, approved, shipped.',
  signature: 'Anjali',
  small: `© ${new Date().getFullYear()} Anjali Panwar. Made in Berlin.`,
  backToTop: 'Back to top',
};
