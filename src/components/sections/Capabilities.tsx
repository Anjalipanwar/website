import { useState } from 'react';
import { capabilities } from '../../content';
import { Check, Cross, Highlight, MarginNote } from '../annotations';
import { MarginAside } from '../MarginAside';

export function Capabilities() {
  // one row open at a time; the first is open to start with
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="capabilities" aria-labelledby="capabilities-title" className="py-[var(--section)]">
      <div className="frame">
        <div className="frame-margin" />
        <div className="frame-main">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 id="capabilities-title" className="loud t-display">
              {capabilities.title}
            </h2>
            <MarginNote seed={82} rotate={-3} className="lg:hidden">
              {capabilities.marginNote}
            </MarginNote>
          </div>

          <div className="relative mt-8 lg:mt-10">
            <MarginAside seed={81} className="top-5">
              {capabilities.marginNote}
            </MarginAside>
          <ul className="caps">
            {capabilities.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.name} className="cap" data-open={isOpen}>
                  <h3>
                    <button
                      type="button"
                      className="cap-btn grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 text-left lg:py-4"
                      aria-expanded={isOpen}
                      aria-controls={`cap-proof-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span>
                        <Highlight draw="manual" seed={90 + i}>
                          <span className="loud t-row block px-[0.08em]">{item.name}</span>
                        </Highlight>
                      </span>
                      {/* closed: a plus. open: the reviewer has ticked it. */}
                      <span className="cap-state relative block h-[clamp(1.9rem,4.4vw,3.75rem)] w-[clamp(2.1rem,4.8vw,4.1rem)]" aria-hidden="true">
                        <Cross draw="static" color="ink" seed={400 + i} className="cap-plus absolute inset-[22%] rotate-45" />
                        <Check draw="manual" color="green" seed={410 + i} className="cap-check absolute inset-0" />
                      </span>
                    </button>
                  </h3>
                  <div id={`cap-proof-${i}`} className="cap-proof">
                    <div>
                      <p className="t-lead max-w-[46ch] pb-6 pl-[0.1em] lg:pb-7">{item.proof}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
