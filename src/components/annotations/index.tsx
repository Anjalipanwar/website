import { useLayoutEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { clamp, cx, inkVar, MarkSvg, Stroke, useSize, type DrawMode, type Ink, type MarkProps } from './base';
import { arrowPaths, checkPath, circlePath, crossPaths, highlightPaths, rng, squigglePath, underlinePath, type Pt } from './wobble';

export type { Ink, DrawMode, MarkProps };

type WrapProps = MarkProps & { children: ReactNode };

/** Circles its children in pen. */
export function Circle({ children, color = 'blue', seed = 1, draw = 'scroll', weight, className }: WrapProps) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const d = useMemo(() => (w ? circlePath(w, h, seed) : ''), [w, h, seed]);
  return (
    <span ref={ref} className={cx('mark-wrap', className)}>
      {children}
      <MarkSvg color={color} draw={draw}>
        <Stroke d={d} width={weight ?? clamp(h * 0.034, 2, 4.5)} />
      </MarkSvg>
    </span>
  );
}

/** Underlines its children. `double` goes there and back; `strike` crosses the text out instead. */
export function Underline({
  children,
  color = 'pink',
  seed = 1,
  draw = 'scroll',
  weight,
  className,
  double = false,
  strike = false,
}: WrapProps & { double?: boolean; strike?: boolean }) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const d = useMemo(
    () => (w ? underlinePath(w, h, seed, double, strike ? 0.56 : 0.96) : ''),
    [w, h, seed, double, strike],
  );
  return (
    <span ref={ref} className={cx('mark-wrap', className)}>
      {children}
      <MarkSvg color={color} draw={draw}>
        <Stroke d={d} width={weight ?? clamp(h * 0.05, 2, 6)} />
      </MarkSvg>
    </span>
  );
}

/** A highlighter swipe behind its children (one stroke per line of text). */
export function Highlight({ children, color = 'yellow', seed = 1, draw = 'scroll', className }: WrapProps) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const [lines, setLines] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !h) return;
    const cs = getComputedStyle(el.firstElementChild?.tagName === 'svg' ? el : (el.firstElementChild ?? el));
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    setLines(Math.max(1, Math.round(h / lh)));
  }, [ref, w, h]);
  const strokes = useMemo(() => (w ? highlightPaths(w, h, lines, seed) : []), [w, h, lines, seed]);
  return (
    <span ref={ref} className={cx('mark-wrap mark-wrap--isolate', className)}>
      {children}
      <MarkSvg color={color} draw={draw} behind>
        {strokes.map((s, i) => (
          <Stroke key={i} d={s.d} width={s.width} cap="butt" start={i / strokes.length} span={1 / strokes.length} />
        ))}
      </MarkSvg>
    </span>
  );
}

/** A tick. Size and position it with `className` (e.g. "w-[1em] h-[1em]"). */
export function Check({ color = 'green', seed = 1, draw = 'scroll', weight, className }: MarkProps) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const d = useMemo(() => (w ? checkPath(w, h, seed) : ''), [w, h, seed]);
  return (
    <span ref={ref} className={cx('mark-box', className)}>
      <MarkSvg color={color} draw={draw}>
        <Stroke d={d} width={weight ?? clamp(Math.min(w, h) * 0.1, 2.5, 12)} />
      </MarkSvg>
    </span>
  );
}

/** A cross. */
export function Cross({ color = 'pink', seed = 1, draw = 'scroll', weight, className }: MarkProps) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const ds = useMemo(() => (w ? crossPaths(w, h, seed) : []), [w, h, seed]);
  const sw = weight ?? clamp(Math.min(w, h) * 0.1, 2.5, 8);
  return (
    <span ref={ref} className={cx('mark-box', className)}>
      <MarkSvg color={color} draw={draw}>
        <Stroke d={ds[0] ?? ''} width={sw} start={0} span={0.5} />
        <Stroke d={ds[1] ?? ''} width={sw} start={0.5} span={0.5} />
      </MarkSvg>
    </span>
  );
}

/** A tilde: "in progress". */
export function Squiggle({ color = 'blue', seed = 1, draw = 'scroll', weight, className }: MarkProps) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const d = useMemo(() => (w ? squigglePath(w, h, seed) : ''), [w, h, seed]);
  return (
    <span ref={ref} className={cx('mark-box', className)}>
      <MarkSvg color={color} draw={draw}>
        <Stroke d={d} width={weight ?? clamp(Math.min(w, h) * 0.1, 2.5, 8)} />
      </MarkSvg>
    </span>
  );
}

/**
 * A curved arrow drawn inside its own box. Size and position the box with
 * `className`; `from` and `to` are fractions of that box ([0,0] top-left, [1,1] bottom-right).
 * `bend` curves it (positive bends to the right of the direction of travel).
 */
export function Arrow({
  color = 'blue',
  seed = 1,
  draw = 'scroll',
  weight = 2.5,
  className,
  from = [0, 0.5],
  to = [1, 0.5],
  bend = 0.18,
  head = 13,
}: MarkProps & { from?: Pt; to?: Pt; bend?: number; head?: number }) {
  const [ref, { w, h }] = useSize<HTMLSpanElement>();
  const [fx, fy] = from;
  const [tx, ty] = to;
  const p = useMemo(
    () => (w ? arrowPaths([fx * w, fy * h], [tx * w, ty * h], bend, seed, head) : null),
    [w, h, fx, fy, tx, ty, bend, seed, head],
  );
  return (
    <span ref={ref} className={cx('mark-box', className)}>
      <MarkSvg color={color} draw={draw}>
        <Stroke d={p?.shaft ?? ''} width={weight} start={0} span={0.78} />
        <Stroke d={p?.head ?? ''} width={weight} start={0.78} span={0.22} />
      </MarkSvg>
    </span>
  );
}

/**
 * Handwriting. Writes itself in left to right with the same `--p` as the strokes.
 * The only place the handwritten face is used.
 */
export function MarginNote({
  children,
  color = 'blue',
  seed = 1,
  draw = 'scroll',
  className,
  rotate,
  as: Tag = 'span',
}: {
  children: ReactNode;
  color?: Ink;
  seed?: number;
  draw?: DrawMode;
  className?: string;
  /** Degrees. Defaults to a small seeded tilt. */
  rotate?: number;
  as?: 'span' | 'p' | 'div';
}) {
  const tilt = rotate ?? (rng(seed)() - 0.5) * 7;
  return (
    <Tag
      className={cx('note', className)}
      data-draw={draw}
      style={{ color: inkVar[color], '--tilt': `${tilt.toFixed(2)}deg` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
