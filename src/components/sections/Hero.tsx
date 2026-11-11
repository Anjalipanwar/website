import { useRef } from 'react';
import { hero, nav, site } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/motion';
import { Arrow, Check, Circle, Highlight, MarginNote, Underline } from '../annotations';
import { Doodle } from '../annotations/Doodle';
import { ScrambleWords } from '../ScrambleWords';

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <nav aria-label="Main" className="frame items-center pt-5 lg:pt-7">
        <a href="#top" className="justify-self-start py-2 font-semibold tracking-tight">
          {site.name}
        </a>
        <ul className="hidden gap-8 lg:flex lg:pl-[var(--gutter)]">
          {nav.map(item => (
            <li key={item.href}>
              <a href={item.href} className="py-2 font-medium underline-offset-[6px] hover:underline hover:decoration-marker hover:decoration-2">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Term({ mark, children }: { mark: (typeof hero.lines)[number]['mark']; children: string }) {
  const term = <span className="loud t-hero">{children}</span>;
  if (mark === 'circle')
    return (
      <Circle draw="manual" color="blue" seed={7}>
        {term}
      </Circle>
    );
  if (mark === 'highlight')
    return (
      <Highlight draw="manual" color="yellow" seed={12}>
        {term}
      </Highlight>
    );
  return (
    <>
      {term}
      <span className="loud t-hero">
        <Check draw="manual" color="green" seed={5} className="hero-check" />
      </span>
    </>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // The one orchestrated moment: lines rise through a mask, then the reviewer marks them up.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const inner = q('.hero-inner');
        const masks = q('.hero-mask');
        const mark = (i: number) => q(`.hero-line:nth-child(${i + 1}) [data-draw]`);
        gsap.set(masks, { clipPath: 'inset(-0.1em -100vw -0.16em -100vw)' });
        gsap.set(inner, { yPercent: 130 });
        gsap.set(q('[data-draw="manual"]'), { '--p': 0 });

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
        tl.to(inner, { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 })
          .set(masks, { clipPath: 'none' })
          .to(mark(0), { '--p': 1, duration: 0.45 })
          .to(mark(1), { '--p': 1, duration: 0.3 }, '>-0.05')
          .to(mark(2), { '--p': 1, duration: 0.3 }, '>-0.05')
          .to(q('.hero-note .mark'), { '--p': 1, duration: 0.25 }, '>-0.05')
          .to(q('.hero-note .note'), { '--p': 1, duration: 0.4, ease: 'none' }, '>-0.05');

        // start once the display font is in, so the marks are measured against the real letters
        const font = document.fonts?.load('800 1em "Bricolage Grotesque Variable"') ?? Promise.resolve();
        Promise.race([font, new Promise(r => setTimeout(r, 600))]).then(() => tl.play());
      });
    },
    { scope: root },
  );

  return (
    <section id="top" ref={root} className="relative flex min-h-svh flex-col overflow-x-clip">
      <div className="frame flex-1">
        <div className="frame-margin" />
        <div className="frame-main relative flex flex-col justify-center pb-10 pt-28 lg:pb-20 lg:pt-32">
          <div className="relative">
            <h1>
              {hero.lines.map(line => (
                <span key={line.term} className="hero-line">
                  <span className="hero-mask">
                    <span className="hero-inner">
                      <Term mark={line.mark}>{line.term}</Term> <span className="hero-tail">{line.tail}</span>
                    </span>
                  </span>
                </span>
              ))}
            </h1>

            {/* margin note: in the margin on desktop, an inline sticker on mobile */}
            <div className="hero-note pointer-events-none absolute right-0 top-[-2.2rem] flex items-start gap-0.5 lg:right-[calc(100%+1.6rem)] lg:top-[1.4vw] lg:gap-1">
              <Arrow draw="manual" seed={3} from={[0.95, 0.1]} to={[0.1, 0.9]} bend={-0.3} head={10} className="h-10 w-9 translate-y-4 lg:hidden" />
              <MarginNote draw="manual" seed={21} rotate={-5} className="whitespace-nowrap text-[1.6rem] lg:text-[1.55rem] xl:text-[2.2rem]">
                {hero.note}
              </MarginNote>
              <Arrow draw="manual" seed={4} from={[0.04, 0.3]} to={[0.97, 0.72]} bend={-0.28} className="hidden h-12 w-[3.6vw] lg:inline-block lg:translate-y-3 xl:w-[4.5vw] xl:translate-y-4" />
            </div>
          </div>

          <div className="mt-8 lg:mt-10">
            <p className="t-lead max-w-[34rem]">{hero.intro}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a href={hero.actions.primary.href} className="btn">
                {hero.actions.primary.label}
              </a>
              <a href={hero.actions.secondary.href} className="link-mark redraw">
                <Underline draw="static" color="pink" seed={9} weight={3}>
                  {hero.actions.secondary.label}
                </Underline>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* bottom corner: what she is doing now, and a builder's sketch */}
      <div className="flex items-end gap-5 px-[var(--pad)] pb-10 lg:absolute lg:bottom-10 lg:right-0 lg:pb-0">
        <p className="max-w-[19rem] text-[1.0625rem] leading-snug lg:text-right">
          {hero.currently.before} <ScrambleWords words={hero.currently.words} className="font-bold text-biro" />
          <br />
          {hero.currently.after}
        </p>
        <div className="pointer-events-none hidden md:block" aria-hidden="true">
          <Doodle kind="blocks" seed={2} className="block h-24 w-24 lg:h-28 lg:w-28" />
        </div>
      </div>
    </section>
  );
}
