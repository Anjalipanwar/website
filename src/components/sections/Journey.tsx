import { useRef } from 'react';
import { journey } from '../../content';
import { drawOnScroll, gsap, MOTION_OK, SplitText, useGSAP } from '../../lib/motion';
import { Arrow, Circle, MarginNote } from '../annotations';

const HORIZONTAL = '(min-width: 1024px) and (min-height: 620px)';

export function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, horizontal: HORIZONTAL }, ctx => {
        const { motion, horizontal } = ctx.conditions as { motion: boolean; horizontal: boolean };
        if (!motion) return;
        const q = gsap.utils.selector(root);

        // the intro rises line by line through a mask, once
        SplitText.create(q('.journey-intro'), {
          type: 'lines',
          mask: 'lines',
          aria: 'none',
          autoSplit: true,
          onSplit: self =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.07,
              scrollTrigger: { trigger: q('.journey-intro')[0], start: 'top 85%', once: true },
            }),
        });

        const marks = q('.journey-track [data-draw]');
        if (!horizontal) {
          drawOnScroll(marks);
          return;
        }

        // pinned, sideways
        const pin = q('.journey-pin')[0] as HTMLElement;
        const track = q('.journey-track')[0] as HTMLElement;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.set(marks, { '--p': 0 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: 'top top',
            end: () => `+=${dist()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -dist(), ease: 'none', duration: 1 }, 0);
        tl.to(q('.journey-backdrop'), { x: () => -dist() * 0.3, ease: 'none', duration: 1 }, 0);
        // each mark draws as it arrives at ~80% across the viewport
        const d = dist() || 1;
        const base = track.getBoundingClientRect().left;
        marks.forEach(el => {
          const x = el.getBoundingClientRect().left - base + track.offsetLeft;
          const at = gsap.utils.clamp(0, 0.9, (x - window.innerWidth * 0.8) / d);
          tl.to(el, { '--p': 1, ease: 'none', duration: 0.1 }, at);
        });
      });
    },
    { scope: root },
  );

  const last = journey.stops.length - 1;

  return (
    <section id="journey" ref={root} aria-labelledby="journey-title" className="overflow-x-clip">
      <div className="journey-pin relative hz:flex hz:h-screen hz:flex-col">
        <div className="frame">
          <div className="frame-margin pt-[var(--section)] hz:pt-[13vh]">
            <MarginNote seed={31} rotate={-4} className="hidden max-w-[11rem] hz:inline-block">
              {journey.marginNote}
            </MarginNote>
          </div>
          <div className="frame-main pt-[var(--section)] hz:pt-[11vh]">
            <h2 id="journey-title" className="loud t-display">
              {journey.title}
            </h2>
            <p className="journey-intro t-lead mt-6 max-w-[38rem]">{journey.intro}</p>
          </div>
        </div>

        <div className="relative hz:flex hz:min-h-0 hz:flex-1 hz:items-center">
          <span aria-hidden="true" className="journey-backdrop loud absolute bottom-[-3vw] left-[8vw] hidden hz:block">
            {journey.backdrop}
          </span>
          <ol className="journey-track relative mt-12 px-[var(--pad)] pb-[var(--section)] lg:pl-[var(--main-x)] hz:mt-0 hz:flex hz:w-max hz:items-start hz:pb-0 hz:pr-[14vw]">
            {journey.stops.map((stop, i) => (
              <li key={i} className="hz:flex hz:items-start">
                <div className="max-w-[26rem] hz:w-[clamp(19rem,25vw,28rem)]">
                  <p className="loud t-year relative w-fit">
                    {i === last ? (
                      <Circle draw="manual" color="pink" seed={40 + i}>
                        {stop.year}
                      </Circle>
                    ) : (
                      stop.year
                    )}
                    {stop.note && (
                      <MarginNote draw="manual" seed={50 + i} rotate={-6} className="absolute left-full top-0 ml-7 whitespace-nowrap font-normal tracking-normal">
                        {stop.note}
                      </MarginNote>
                    )}
                  </p>
                  <h3 className="mt-4 text-[1.5rem] font-bold leading-tight tracking-tight lg:text-[1.75rem]">{stop.place}</h3>
                  <p className="mt-2 max-w-[22rem]">{stop.line}</p>
                </div>
                {i < last && (
                  <>
                    <Arrow
                      draw="manual"
                      color={i % 2 ? 'pink' : 'blue'}
                      seed={60 + i}
                      from={[0.04, 0.4 + (i % 2) * 0.3]}
                      to={[0.96, 0.6 - (i % 2) * 0.3]}
                      bend={i % 2 ? 0.2 : -0.2}
                      weight={3}
                      head={16}
                      className="mx-[2.5vw] mt-[2.2vw] hidden h-16 w-[9vw] hz:inline-block"
                    />
                    <Arrow
                      draw="manual"
                      color={i % 2 ? 'pink' : 'blue'}
                      seed={70 + i}
                      from={[0.3 + (i % 2) * 0.4, 0.04]}
                      to={[0.5, 0.96]}
                      bend={i % 2 ? -0.25 : 0.25}
                      weight={2.5}
                      className="my-5 ml-2 block h-16 w-14 hz:hidden"
                    />
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
