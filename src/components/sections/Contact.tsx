import { useRef } from 'react';
import { contact, footer } from '../../content';
import { gsap, MOTION_OK, useGSAP } from '../../lib/motion';
import { Check, Circle, MarginNote, Underline } from '../annotations';
import Magnet from '../Magnet';

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
    <footer id="contact" ref={root} data-ink="paper" className="overflow-x-clip bg-biro text-paper">
      <div className="frame">
        <div className="frame-margin pt-[var(--section)]">
          <MarginNote color="yellow" seed={251} rotate={-5} className="hidden max-w-[10rem] lg:mt-6 lg:inline-block lg:text-[2.2rem]">
            {contact.marginNote}
          </MarginNote>
        </div>
        <div className="frame-main pb-10 pt-[var(--section)]">
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

          <p className="t-lead mt-12 max-w-[36rem] lg:mt-16">{contact.intro}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
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

          <div className="mt-[var(--section)] flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t border-paper/30 pt-8">
            <p className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <MarginNote color="paper" seed={281} rotate={-3} className="text-[2.1rem]">
                {footer.signoff}
              </MarginNote>
              <MarginNote color="yellow" seed={282} rotate={-6} className="text-[2.6rem]">
                – {footer.signature}
              </MarginNote>
              <Check color="yellow" seed={283} weight={3} className="mb-2 h-7 w-8" />
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
