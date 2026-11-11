import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Colour tokens a mark can be drawn in. */
export type Ink = 'blue' | 'pink' | 'yellow' | 'green' | 'ink' | 'paper';

export const inkVar: Record<Ink, string> = {
  blue: 'var(--color-biro)',
  pink: 'var(--color-marker)',
  yellow: 'var(--color-highlighter)',
  green: 'var(--color-check)',
  ink: 'var(--color-ink)',
  paper: 'var(--color-paper)',
};

/**
 * How a mark gets drawn.
 *  - scroll: scrubbed in by ScrollTrigger as it enters the viewport (default)
 *  - manual: a parent timeline or CSS state drives `--p`
 *  - static: always fully drawn
 */
export type DrawMode = 'scroll' | 'manual' | 'static';

export interface MarkProps {
  /** Colour token. */
  color?: Ink;
  /** Hand-drawn wobble seed. Give every mark its own. */
  seed?: number;
  draw?: DrawMode;
  /** Stroke width in px. Defaults scale with the size of the mark. */
  weight?: number;
  className?: string;
}

export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Measures an element's layout box in px (unaffected by transforms) and tracks resizes. */
export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setSize(s => (s.w === w && s.h === h ? s : { w, h }));
    };
    // ResizeObserver reports once on observe, after layout and before paint,
    // so there is no need to force a synchronous layout here.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/** The SVG layer every mark draws into. `--p` (0→1) on this element draws its strokes. */
export function MarkSvg({
  color,
  draw,
  behind,
  children,
}: {
  color: Ink;
  draw: DrawMode;
  behind?: boolean;
  children: ReactNode;
}) {
  return (
    <svg
      className={cx('mark', behind && 'mark--behind')}
      data-draw={draw}
      aria-hidden="true"
      focusable="false"
      style={{ color: inkVar[color] }}
    >
      {children}
    </svg>
  );
}

/** One pen stroke. `start`/`span` place it within the mark's 0→1 progress. */
export function Stroke({
  d,
  width,
  start = 0,
  span = 1,
  cap = 'round',
}: {
  d: string;
  width: number;
  start?: number;
  span?: number;
  cap?: 'round' | 'butt';
}) {
  if (!d) return null;
  return (
    <path
      d={d}
      pathLength={1}
      strokeWidth={width}
      strokeLinecap={cap}
      style={{ '--s': start, '--d': span } as CSSProperties}
    />
  );
}
