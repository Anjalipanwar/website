import { useRef, type CSSProperties } from 'react';
import { work } from '../../content';
import { gsap, useGSAP } from '../../lib/motion';
import { Arrow, Circle, MarginNote, Underline, type Ink } from '../annotations';

const STACKED = '(min-width: 768px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';
const ROTATIONS = ['-1.1deg', '0.8deg', '-0.5deg', '1deg'];
const PENS: Ink[] = ['pink', 'blue', 'green'];

export function Work() {
  const root = useRef<HTMLElement>(null);

  // as the next sheet slides over, the covered one settles back a little
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(STACKED, () => {
        const papers = gsap.utils.toArray<HTMLElement>('.sheet-paper', root.current);
        const sheets = gsap.utils.toArray<HTMLElement>('.sheet', root.current);
        papers.slice(0, -1).forEach((paper, i) => {
          gsap.to(paper, {
            scale: 0.955,
            ease: 'none',
            scrollTrigger: { trigger: sheets[i + 1], start: 'top 95%', end: 'top 25%', scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} aria-labelledby="work-title" className="py-[var(--section)]">
      <div className="frame">
        <div className="frame-margin">
          <MarginNote seed={101} rotate={-4} className="hidden max-w-[10rem] lg:mt-3 lg:inline-block">
            {work.marginNote}
          </MarginNote>
        </div>
        <div className="frame-main">
          <h2 id="work-title" className="loud t-display">
            {work.title}
          </h2>
          <p className="t-lead mt-6 max-w-[38rem]">{work.intro}</p>

          <ol className="mt-12 lg:mt-16">
            {work.cases.map((c, i) => {
              const pen = PENS[i % PENS.length];
              return (
                <li key={i} className="sheet" style={{ '--i': i } as CSSProperties}>
                  <article
                    className="sheet-paper flex flex-col px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12"
                    style={{ '--rot': ROTATIONS[i % ROTATIONS.length] } as CSSProperties}
                  >
                    <header className="flex items-start gap-5 sm:gap-7">
                      <Circle color={pen} seed={110 + i} weight={3} className="mt-1 shrink-0">
                        <MarginNote color={pen === 'blue' ? 'blue' : 'ink'} rotate={0} seed={i} className="px-3.5 text-[3.4rem] leading-[0.8]">
                          {i + 1}
                        </MarginNote>
                      </Circle>
                      <div>
                        <h3 className="loud text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[0.95]">{c.title}</h3>
                        <p className="mt-3 text-[1.0625rem] opacity-75">{c.context}</p>
                      </div>
                    </header>

                    <div className="mt-10 grid gap-8 md:mt-auto md:grid-cols-3 md:gap-10 md:pt-16">
                      <div>
                        <h4 className="text-[1.25rem] font-bold tracking-tight">{work.labels.problem}</h4>
                        <p className="mt-2 text-[1.0625rem] lg:text-[1.125rem]">{c.problem}</p>
                      </div>
                      <div>
                        <h4 className="text-[1.25rem] font-bold tracking-tight">{work.labels.did}</h4>
                        <p className="mt-2 text-[1.0625rem] lg:text-[1.125rem]">{c.did}</p>
                      </div>
                      <div className="relative">
                        <h4 className="text-[1.25rem] font-bold tracking-tight">
                          <Underline color="green" seed={120 + i} weight={3}>
                            {work.labels.outcome}
                          </Underline>
                        </h4>
                        <p className="mt-2 text-[1.0625rem] lg:text-[1.125rem]">{c.outcome}</p>
                        {/* the reviewer points at the outcome */}
                        <div className="pointer-events-none mt-3 flex items-start gap-1 md:absolute md:bottom-full md:right-0 md:mb-1 md:mt-0 md:flex-col md:items-end md:gap-0">
                          <Arrow color={pen} seed={130 + i} from={[0.85, 0.95]} to={[0.2, 0.08]} bend={0.3} head={10} className="h-9 w-9 md:hidden" />
                          <MarginNote color="blue" seed={140 + i} className="mt-3 whitespace-nowrap md:mt-0">
                            {c.note}
                          </MarginNote>
                          <Arrow color={pen} seed={150 + i} from={[0.8, 0.05]} to={[0.12, 0.92]} bend={-0.32} className="hidden h-12 w-24 md:mr-10 md:inline-block" />
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
