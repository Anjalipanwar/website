import type { CSSProperties } from 'react';
import { beyond, type BeyondItem } from '../../content';
import { MarginNote, Underline } from '../annotations';
import { Doodle } from '../annotations/Doodle';

/** Loose placement: each item takes the next tilt / nudge so the collage never lines up. */
const PLACEMENT = [
  { rot: '-3deg', dy: '0.5rem' },
  { rot: '-5deg', dy: '-1.5rem' },
  { rot: '2deg', dy: '0.25rem' },
  { rot: '3deg', dy: '1rem' },
  { rot: '4deg', dy: '-0.75rem' },
  { rot: '-2.5deg', dy: '0.5rem' },
  { rot: '-2deg', dy: '-0.5rem' },
];
const STICKER_STYLES = ['bg-ink text-paper', 'bg-biro text-white', 'bg-sheet text-ink'];

function Item({ item, index }: { item: BeyondItem; index: number }) {
  const place = PLACEMENT[index % PLACEMENT.length];
  const style = { '--rot': place.rot, '--dy': place.dy } as CSSProperties;

  if (item.kind === 'sticker') {
    // stickers overlap the edges of whatever they sit next to
    return (
      <li style={style} className="relative z-10 -mx-2 lg:-mx-5">
        <span className={`sticker loud ${STICKER_STYLES[index % STICKER_STYLES.length]}`}>{item.text}</span>
      </li>
    );
  }

  if (item.kind === 'photo') {
    return (
      <li style={style} className="w-[calc(50%-0.75rem)] max-w-[11rem] sm:w-[11.5rem] sm:max-w-none xl:w-[12.5rem]">
        <figure className="bg-sheet p-2.5 pb-1.5 shadow-[0_16px_26px_-20px_rgba(28,27,58,0.6)]">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-paper">
            {item.src ? (
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 px-1 text-center">
                <Doodle kind={item.doodle} seed={220 + index} draw="scroll" className="h-14 w-14 sm:h-16 sm:w-16" />
                <MarginNote color="ink" seed={230 + index} className="text-[1.9rem] sm:text-[2.2rem]">
                  {beyond.photoPlaceholder}
                </MarginNote>
              </div>
            )}
          </div>
          <figcaption className="hand px-1 pb-0.5 pt-1.5 text-[1.9rem] text-ink sm:text-[2.1rem]">{item.caption}</figcaption>
        </figure>
      </li>
    );
  }

  return (
    <li style={style} className="px-2">
      <p className="hand text-[2.5rem] text-ink lg:text-[2.8rem]">
        <Underline color="blue" seed={240 + index} weight={3}>
          {item.heading}
        </Underline>
      </p>
      <ul className="hand mt-2 space-y-0.5 text-[2.2rem] text-ink lg:text-[2.4rem]">
        {item.lines.map(line => (
          <li key={line}>– {line}</li>
        ))}
      </ul>
    </li>
  );
}

export function Beyond() {
  return (
    <section id="beyond" aria-labelledby="beyond-title" data-ink="yellow" className="overflow-x-clip bg-highlighter pb-[calc(var(--section)*0.8)] pt-[var(--section)]">
      <div className="frame">
        <div className="frame-margin" />
        <div className="frame-main">
          <h2 id="beyond-title" className="loud t-display">
            {beyond.title}
          </h2>
          <p className="t-lead mt-5 max-w-[38rem]">{beyond.intro}</p>

          <ul className="collage mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-7 lg:mt-12 lg:gap-x-8 lg:gap-y-5">
            {beyond.items.map((item, i) => (
              <Item key={i} item={item} index={i} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
