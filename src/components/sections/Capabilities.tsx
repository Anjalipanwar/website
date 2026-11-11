import { useRef, useState } from 'react';
import { capabilities } from '../../content';
import { Highlight, MarginNote } from '../annotations';

export function Capabilities() {
  const [open, setOpen] = useState<number | null>(null);
  const viaMouse = useRef(false);

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="py-[var(--section)]">
      <div className="frame">
        <div className="frame-margin">
          <MarginNote seed={81} rotate={-3} className="hidden max-w-[11rem] lg:mt-3 lg:inline-block">
            {capabilities.marginNote}
          </MarginNote>
        </div>
        <div className="frame-main">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 id="capabilities-title" className="loud t-display">
              {capabilities.title}
            </h2>
            <MarginNote seed={82} rotate={-3} className="lg:hidden">
              {capabilities.marginNoteTouch}
            </MarginNote>
          </div>

          <ul className="caps mt-10 lg:mt-14">
            {capabilities.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.name} className="cap" data-open={isOpen}>
                  <h3>
                    <button
                      type="button"
                      className="block w-full pb-1 pt-4 text-left lg:pt-5"
                      aria-expanded={isOpen}
                      aria-controls={`cap-proof-${i}`}
                      onPointerEnter={e => e.pointerType === 'mouse' && setOpen(i)}
                      onPointerDown={e => (viaMouse.current = e.pointerType === 'mouse')}
                      onClick={() => {
                        // a mouse has already opened it by hovering; touch and keyboard toggle
                        setOpen(viaMouse.current ? i : isOpen ? null : i);
                        viaMouse.current = false;
                      }}
                    >
                      <Highlight draw="manual" seed={90 + i}>
                        <span className="t-row block px-[0.12em]">{item.name}</span>
                      </Highlight>
                    </button>
                  </h3>
                  <div id={`cap-proof-${i}`} className="cap-proof">
                    <div>
                      <p className="max-w-[62ch] pb-4 pl-[0.2em] lg:pb-5">{item.proof}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
