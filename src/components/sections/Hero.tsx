import { useRef } from 'react';
import { hero, nav, site } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/motion';
import { Arrow, Check, Circle, Highlight, MarginNote, Underline } from '../annotations';
import { ScrambleWords } from '../ScrambleWords';

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10">
      <nav aria-label="Main" className="frame items-center pt-5 lg:pt-6">
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
  return term;
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
        <div className="frame-main hero-main relative flex flex-col justify-center">
          <div className="relative">
            <h1>
              {hero.lines.map(line => (
                <span key={line.term} className="hero-line">
                  <span className="hero-mask">
                    <span className="hero-inner">
                      <Term mark={line.mark}>{line.term}</Term>{' '}
                      <span className="hero-tail">{line.tail}</span>
                      {line.mark === 'check' && (
                        <span className="hero-check loud t-hero" aria-hidden="true">
                          <Check draw="manual" color="green" seed={5} className="h-[0.8em] w-[0.78em]" />
                        </span>
                      )}
                    </span>
                  </span>
                </span>
              ))}
            </h1>

            {/* margin note: in the margin on desktop, an inline sticker on mobile */}
            <div className="hero-note pointer-events-none absolute right-0 top-[-3rem] flex items-start gap-0.5 lg:right-[calc(100%+1.5rem)] lg:top-[0.1em] lg:gap-1">
              <Arrow draw="manual" seed={3} from={[0.95, 0.1]} to={[0.1, 0.9]} bend={-0.3} head={10} className="h-10 w-8 translate-y-5 lg:hidden" />
              <MarginNote draw="manual" seed={21} rotate={-5} className="w-max whitespace-nowrap text-[2rem] lg:max-w-[7rem] lg:whitespace-normal lg:text-right lg:text-[2.3rem] xl:max-w-[12.5rem] xl:text-[2.8rem]">
                {hero.note}
              </MarginNote>
              <Arrow draw="manual" seed={4} from={[0.04, 0.3]} to={[0.97, 0.7]} bend={-0.28} className="hidden h-12 w-10 lg:inline-block lg:translate-y-6 xl:w-14 xl:translate-y-8" />
            </div>
          </div>

          <div className="hero-below">
            <p className="t-lead max-w-[40rem]">{hero.intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href={hero.actions.primary.href} className="btn">
                {hero.actions.primary.label}
              </a>
              <a href={hero.actions.secondary.href} className="link-mark redraw">
                <Underline draw="static" color="pink" seed={9} weight={3}>
                  {hero.actions.secondary.label}
                </Underline>
              </a>
              <p className="basis-full text-[1.0625rem] leading-snug sm:basis-auto sm:border-l sm:border-ink/20 sm:pl-7">
                {hero.currently.before} <ScrambleWords words={hero.currently.words} className="font-bold text-biro" />
                <br />
                {hero.currently.after}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
