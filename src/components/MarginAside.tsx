import { Arrow, MarginNote, type Ink } from './annotations';

/**
 * A reviewer's note in the margin column with an arrow that crosses the margin
 * line and points at the thing beside it. Desktop only: on small screens each
 * section places its note inline instead. Put it inside a `relative` element in
 * the main column; `className` sets the vertical position (e.g. "top-6").
 */
export function MarginAside({
  children,
  seed,
  color = 'blue',
  arrow = color,
  className = '',
}: {
  children: string;
  seed: number;
  color?: Ink;
  arrow?: Ink;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute right-[calc(100%+var(--gutter)-1.5rem)] hidden items-start gap-1 lg:flex ${className}`}>
      <MarginNote seed={seed} rotate={-4} color={color} className="w-max max-w-[8.5rem] text-right lg:text-[2.2rem] xl:max-w-[12.5rem] xl:text-[2.8rem]">
        {children}
      </MarginNote>
      <Arrow seed={seed + 1} color={arrow} from={[0.05, 0.3]} to={[0.96, 0.68]} bend={-0.28} className="mt-5 h-12 w-10 shrink-0 xl:w-14" />
    </div>
  );
}
