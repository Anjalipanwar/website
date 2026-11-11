import { useMemo } from 'react';
import { cx, inkVar, MarkSvg, Stroke, type DrawMode, type Ink } from './base';
import { rng, roughLine, type Pt } from './wobble';

export type DoodleKind = 'blocks' | 'plane' | 'mountain' | 'book';

/** Line drawings on a 100×100 grid: each entry is one pen stroke (a polyline). */
const SHAPES: Record<DoodleKind, { ink: Pt[][]; accent: Pt[][] }> = {
  // a builder's sketch: three stacked blocks and a dimension line
  blocks: {
    ink: [
      [[14, 88], [58, 88], [58, 64], [14, 64], [14, 88]],
      [[58, 88], [92, 88], [92, 64], [58, 64]],
      [[32, 64], [32, 40], [76, 40], [76, 64]],
      [[44, 40], [44, 16], [70, 16], [70, 40]],
    ],
    accent: [
      [[4, 16], [4, 88]],
      [[1, 16], [8, 16]],
      [[1, 88], [8, 88]],
    ],
  },
  plane: {
    ink: [
      [[6, 46], [94, 12], [58, 88], [44, 58], [6, 46]],
      [[44, 58], [94, 12]],
    ],
    accent: [
      [[36, 70], [26, 80]],
      [[20, 86], [12, 94]],
    ],
  },
  mountain: {
    ink: [
      [[4, 84], [36, 26], [54, 58], [68, 38], [96, 84]],
      [[27, 42], [36, 50], [44, 41]],
    ],
    accent: [[[76, 14], [84, 12], [88, 20], [81, 25], [75, 20], [76, 14]]],
  },
  book: {
    ink: [
      [[50, 26], [14, 18], [14, 76], [50, 86], [86, 76], [86, 18], [50, 26]],
      [[50, 26], [50, 86]],
    ],
    accent: [
      [[22, 34], [42, 39]],
      [[22, 46], [42, 51]],
      [[58, 39], [78, 34]],
    ],
  },
};

/** A small ink sketch. Size it with `className`. */
export function Doodle({
  kind,
  seed = 1,
  color = 'ink',
  accent = 'blue',
  draw = 'static',
  weight = 1.8,
  className,
}: {
  kind: DoodleKind;
  seed?: number;
  color?: Ink;
  accent?: Ink;
  draw?: DrawMode;
  weight?: number;
  className?: string;
}) {
  const strokes = useMemo(() => {
    const r = rng(seed);
    const build = (lines: Pt[][]) =>
      lines.map(pts => pts.slice(1).map((p, i) => roughLine(pts[i], p, r, 0.9).replace(/^M/, i ? 'L' : 'M')).join(''));
    return { ink: build(SHAPES[kind].ink), accent: build(SHAPES[kind].accent) };
  }, [kind, seed]);
  const all = [...strokes.ink.map(d => ({ d, a: false })), ...strokes.accent.map(d => ({ d, a: true }))];
  return (
    <span className={cx('mark-box', className)}>
      <MarkSvg color={color} draw={draw}>
        <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
          {all.map((s, i) => (
            <g key={i} style={s.a ? { color: inkVar[accent] } : undefined}>
              <Stroke d={s.d} width={weight} start={i / all.length} span={1 / all.length} />
            </g>
          ))}
        </svg>
      </MarkSvg>
    </span>
  );
}
