import type { CSSProperties } from 'react';
import { beyond, type BeyondItem } from '../../content';
import { MarginNote, Underline } from '../annotations';
import { Doodle } from '../annotations/Doodle';

/** Loose placement: each item picks the next tilt / nudge so the collage never lines up. */
const PLACEMENT = [
  { rot: '-4deg', dy: '0rem', dx: '0rem' },
  { rot: '2.5deg', dy: '1.5rem', dx: '1rem' },
  { rot: '-2deg', dy: '-0.5rem', dx: '3rem' },
  { rot: '3deg', dy: '1rem', dx: '6rem' },
  { rot: '-3deg', dy: '-2.5rem', dx: '9rem' },
  { rot: '1.5deg', dy: '0.75rem', dx: '1.5rem' },
  { rot: '-2.5deg', dy: '-4rem', dx: '5rem' },
];
const STICKER_STYLES = ['bg-ink text-paper', 'bg-sheet text-ink', 'bg-biro text-white'];

function Item({ item, index }: { item: BeyondItem; index: number }) {
  const place = PLACEMENT[index % PLACEMENT.length];
  const style = { '--rot': place.rot, '--dy': place.dy, '--dx': place.dx } as CSSProperties;

  if (item.kind === 'sticker') {
    return (
      <li style={style}>
        <span className={`sticker loud ${STICKER_STYLES[index % STICKER_STYLES.length]}`}>{item.text}</span>
      </li>
    );
  }

  if (item.kind === 'photo') {
    return (
      <li style={style} className="w-[min(100%,15rem)] sm:w-[clamp(13rem,21vw,18rem)]">
        <figure className="bg-sheet p-3 pb-2 shadow-[0_18px_30px_-22px_rgba(28,27,58,0.55)]">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-paper">
            {item.src ? (
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Doodle kind={item.doodle} seed={220 + index} draw="scroll" className="h-20 w-20" />
                <MarginNote color="ink" seed={230 + index} className="text-[1.6rem]">
                  {beyond.photoPlaceholder}
                </MarginNote>
              </div>
            )}
          </div>
          <figcaption className="hand px-1 pb-1 pt-2 text-[1.6rem] text-ink">{item.caption}</figcaption>
        </figure>
      </li>
    );
  }

  return (
    <li style={style} className="min-w-[13rem]">
      <p className="hand text-[2.1rem] text-ink">
        <Underline color="blue" seed={240 + index} weight={2.5}>
          {item.heading}
        </Underline>
      </p>
      <ul className="hand mt-3 space-y-1 text-[1.8rem] text-ink">
        {item.lines.map(line => (
          <li key={line}>– {line}</li>
        ))}
      </ul>
    </li>
  );
}

export function Beyond() {
  return (
    <section id="beyond" aria-labelledby="beyond-title" data-ink="yellow" className="overflow-x-clip bg-highlighter py-[var(--section)]">
      <div className="frame">
        <div className="frame-margin" />
        <div className="frame-main">
          <h2 id="beyond-title" className="loud t-display">
            {beyond.title}
          </h2>
          <p className="t-lead mt-6 max-w-[38rem]">{beyond.intro}</p>

          <ul className="collage mt-12 flex flex-wrap items-center gap-x-8 gap-y-10 lg:mt-16 lg:gap-x-12 lg:gap-y-12">
            {beyond.items.map((item, i) => (
              <Item key={i} item={item} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
