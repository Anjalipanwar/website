/**
 * Geometry for hand-drawn marks. Everything is generated from a size (in px)
 * and a seed, so the same seed always gives the same mark and no two seeds match.
 */
export type Pt = [number, number];

/** Small deterministic PRNG (mulberry32). */
export function rng(seed: number) {
  let a = (Math.imul(seed | 0, 2654435761) ^ 0x9e3779b9) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random value in [-amt, amt]. */
export const jit = (r: () => number, amt: number) => (r() - 0.5) * 2 * amt;

const f = (n: number) => n.toFixed(1);

/** Smooth path through points (Catmull-Rom → cubic Béziers). */
export function spline(pts: Pt[], k = 1): string {
  if (pts.length < 2) return '';
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
    d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** A not-quite-straight line from a to b. */
export function roughLine(a: Pt, b: Pt, r: () => number, wobble = 1.6): string {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const w = Math.min(wobble, len * 0.04 + 0.4);
  const at = (t: number): Pt => [a[0] + (b[0] - a[0]) * t + jit(r, w), a[1] + (b[1] - a[1]) * t + jit(r, w)];
  return spline([[a[0] + jit(r, w * 0.6), a[1] + jit(r, w * 0.6)], at(0.35), at(0.7), [b[0] + jit(r, w * 0.6), b[1] + jit(r, w * 0.6)]]);
}

/** A loop around a w×h box: superellipse, slightly spiralled, overshooting its start. */
export function circlePath(w: number, h: number, seed: number): string {
  const r = rng(seed);
  const padX = Math.max(8, h * 0.2) + jit(r, h * 0.03);
  const padY = Math.max(5, h * 0.1) + jit(r, h * 0.02);
  const rx = w / 2 + padX;
  const ry = h / 2 + padY;
  const cx = w / 2 + jit(r, 2);
  const cy = h / 2 + jit(r, 1.5);
  const dir = r() > 0.5 ? 1 : -1; // spiral in or out
  const start = Math.PI * (0.95 + r() * 0.3); // starts on the left side
  const total = Math.PI * 2 + 0.3 + r() * 0.45; // overshoot past the start
  const n = 18;
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const a = start + total * t;
    const k = 1 + dir * (t - 0.5) * 0.11 + jit(r, 0.022);
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push([
      cx + Math.sign(c) * Math.pow(Math.abs(c), 0.72) * rx * k,
      cy + Math.sign(s) * Math.pow(Math.abs(s), 0.82) * ry * k,
    ]);
  }
  return spline(pts);
}

/** An underline (or strike-through) with a slight wave; `double` goes there and back. */
export function underlinePath(w: number, h: number, seed: number, double: boolean, at: number): string {
  const r = rng(seed);
  const y = h * at;
  const amp = Math.max(1.2, h * 0.035);
  const over = Math.max(4, h * 0.08);
  const pts: Pt[] = [];
  const n = 5;
  const tilt = jit(r, amp);
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    pts.push([-over + (w + over * 2) * t + jit(r, 2), y + tilt * (t - 0.5) * 2 + jit(r, amp)]);
  }
  if (double) {
    const gap = Math.max(5, h * 0.11);
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1);
      pts.push([-over * 0.2 + (w + over) * t * (0.9 + r() * 0.08) + jit(r, 3), y + gap + jit(r, amp)]);
    }
  }
  return spline(pts);
}

/** One fat highlighter stroke per line of text. */
export function highlightPaths(w: number, h: number, lines: number, seed: number): { d: string; width: number }[] {
  const r = rng(seed);
  const lh = h / lines;
  const out: { d: string; width: number }[] = [];
  for (let l = 0; l < lines; l++) {
    const y = lh * (l + 0.56);
    const over = lh * 0.12;
    const tilt = jit(r, lh * 0.035);
    const pts: Pt[] = [0, 0.3, 0.65, 1].map(t => [
      -over + (w + over * 2) * t + jit(r, 2),
      y + tilt * (t - 0.5) * 2 + jit(r, lh * 0.025),
    ]);
    out.push({ d: spline(pts), width: lh * (0.6 + r() * 0.06) });
  }
  return out;
}

/** A tick, drawn in one stroke: short down-stroke, long up-stroke. */
export function checkPath(w: number, h: number, seed: number): string {
  const r = rng(seed);
  const j = (n: number) => jit(r, n);
  const a: Pt = [w * (0.06 + j(0.03)), h * (0.52 + j(0.04))];
  const v: Pt = [w * (0.34 + j(0.03)), h * (0.9 + j(0.03))];
  const c: Pt = [w * (0.5 + j(0.05)), h * (0.42 + j(0.06))];
  const e: Pt = [w * (0.96 + j(0.03)), h * (0.06 + j(0.04))];
  return `M${f(a[0])} ${f(a[1])}Q${f((a[0] + v[0]) / 2 - w * 0.02)} ${f((a[1] + v[1]) / 2 + h * 0.04)} ${f(v[0])} ${f(v[1])}Q${f(c[0])} ${f(c[1])} ${f(e[0])} ${f(e[1])}`;
}

/** Two crossing strokes. */
export function crossPaths(w: number, h: number, seed: number): string[] {
  const r = rng(seed);
  const m = 0.12;
  return [
    roughLine([w * (m + jit(r, 0.04)), h * (m + jit(r, 0.04))], [w * (1 - m + jit(r, 0.04)), h * (1 - m + jit(r, 0.04))], r, 2.2),
    roughLine([w * (1 - m + jit(r, 0.04)), h * (m + jit(r, 0.05))], [w * (m + jit(r, 0.04)), h * (1 - m + jit(r, 0.05))], r, 2.2),
  ];
}

/** A tilde: "in progress". */
export function squigglePath(w: number, h: number, seed: number): string {
  const r = rng(seed);
  const pts: Pt[] = [];
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    pts.push([w * (0.04 + 0.92 * t) + jit(r, 1.2), h * 0.5 + Math.sin(t * Math.PI * 3) * h * (0.24 + jit(r, 0.05))]);
  }
  return spline(pts);
}

/** A curved arrow from `from` to `to` (px). Returns the shaft and the head as separate strokes. */
export function arrowPaths(from: Pt, to: Pt, bend: number, seed: number, head: number): { shaft: string; head: string } {
  const r = rng(seed);
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const ctrl: Pt = [from[0] + dx * 0.5 + nx * len * bend, from[1] + dy * 0.5 + ny * len * bend];
  const q = (t: number): Pt => [
    (1 - t) * (1 - t) * from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * to[0],
    (1 - t) * (1 - t) * from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * to[1],
  ];
  const wob = Math.min(2.4, len * 0.02);
  const pts: Pt[] = [0, 0.22, 0.48, 0.76, 1].map((t, i, arr) => {
    const p = q(t);
    const edge = i === 0 || i === arr.length - 1;
    return [p[0] + (edge ? 0 : jit(r, wob)), p[1] + (edge ? 0 : jit(r, wob))];
  });
  const before = q(0.86);
  const ang = Math.atan2(to[1] - before[1], to[0] - before[0]);
  const spread = 0.5 + jit(r, 0.08);
  const b1: Pt = [to[0] - Math.cos(ang - spread) * head * (1 + jit(r, 0.15)), to[1] - Math.sin(ang - spread) * head];
  const b2: Pt = [to[0] - Math.cos(ang + spread) * head * (1 + jit(r, 0.15)), to[1] - Math.sin(ang + spread) * head];
  return {
    shaft: spline(pts),
    head: `M${f(b1[0])} ${f(b1[1])}L${f(to[0])} ${f(to[1])}L${f(b2[0])} ${f(b2[1])}`,
  };
}
