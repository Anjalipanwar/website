import { useRef } from 'react';
import { contact, footer } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/motion';
import { Check, Circle, MarginNote, Underline } from '../annotations';
import { rng } from '../annotations/wobble';
import { MarginAside } from '../MarginAside';
import Magnet from '../Magnet';

/**
 * The yellow section ends the way a highlighter does: in the ragged ends of a
 * few overlapping swipes, running out over the blue.
 */
function HighlighterEdge({ seed = 7 }: { seed?: number }) {
  const r = rng(seed);
  const w = (n: number) => (n + (r() - 0.5) * 5).toFixed(1);
  // three passes of the pen, each stopping short of the last, with slanted ends
  const d =
    `M0 0H1000V${w(30)}L${w(905)} ${w(31)}L${w(812)} ${w(33)}L${w(796)} ${w(63)}` +
    `L${w(640)} ${w(64)}L${w(486)} ${w(66)}L${w(471)} ${w(96)}L${w(240)} ${w(97)}L0 ${w(99)}Z`;
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute inset-x-0 -top-px block h-[clamp(3rem,7vw,6.5rem)] w-full text-highlighter">
      <path d={d} fill="currentColor" />
    </svg>
  );
}

export function Contact() {
  const root = useRef<HTMLElement>(null);

  // the headline rises through a mask as the section arrives
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const masks = q('.contact-mask');
        gsap.set(masks, { clipPath: 'inset(-0.1em -100vw -0.2em -100vw)' });
        gsap
          .timeline({ scrollTrigger: { trigger: q('h2')[0], start: 'top 82%', once: true } })
          .from(q('.contact-inner'), { yPercent: 130, duration: 0.8, ease: 'power3.out', stagger: 0.1 })
          .set(masks, { clipPath: 'none' });
      });
    },
    { scope: root },
  );

  return (
    <footer id="contact" ref={root} data-ink="paper" className="relative overflow-x-clip bg-biro text-paper">
      <HighlighterEdge />
      <div className="frame">
        <div className="frame-margin" />
        <div className="frame-main pb-8 pt-[calc(var(--section)+clamp(3rem,7vw,6.5rem))]">
          <h2 className="loud t-giant">
            {contact.titleLines.map(line => (
              <span key={line} className="contact-mask block">
                <span className="contact-inner block">
                  {line === contact.underline ? (
                    <Underline color="yellow" double seed={260} weight={7}>
                      {line}
                    </Underline>
                  ) : (
                    line
                  )}
                </span>
              </span>
            ))}
          </h2>

          <p className="t-lead mt-10 max-w-[36rem] lg:mt-12">{contact.intro}</p>

          <div className="relative mt-7 flex flex-wrap items-center justify-between gap-4">
            <MarginAside seed={251} color="yellow" className="-top-3">
              {contact.marginNote}
            </MarginAside>
            <ul className="flex flex-wrap items-center gap-x-9 gap-y-4 lg:gap-x-12">
              {contact.buttons.map((b, i) => (
                <li key={b.label}>
                  <Magnet padding={40} magnetStrength={3} maxOffset={14}>
                    <a
                      href={b.href}
                      className="contact-btn redraw"
                      {...(b.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      <Circle color="yellow" seed={270 + i} weight={2.5}>
                        <span className="block px-2">{b.label}</span>
                      </Circle>
                    </a>
                  </Magnet>
                </li>
              ))}
            </ul>
            <MarginNote color="yellow" seed={252} rotate={-4} className="lg:hidden">
              {contact.marginNote}
            </MarginNote>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 border-t border-paper/30 pt-7 lg:mt-16">
            <p className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <MarginNote color="paper" seed={281} rotate={-3} className="text-[2.6rem] lg:text-[2.9rem]">
                {footer.signoff}
              </MarginNote>
              <MarginNote color="yellow" seed={282} rotate={-6} className="text-[3.1rem] lg:text-[3.6rem]">
                – {footer.signature}
              </MarginNote>
              <Check color="yellow" seed={283} weight={3} className="mb-3 h-9 w-10" />
            </p>
            <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[1rem]">
              <span>{footer.small}</span>
              <a href="#top" className="py-2 font-semibold underline decoration-2 underline-offset-[6px] hover:text-highlighter">
                {footer.backToTop}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
