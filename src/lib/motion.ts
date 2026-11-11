import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/**
 * Draw marks as they enter the viewport, scrubbed: scrolling back un-draws them.
 * Works on anything that reads `--p` (mark SVGs and handwritten notes).
 */
export function drawOnScroll(targets: Element[], start = 'top 92%', end = 'top 68%') {
  targets.forEach(el => {
    gsap.fromTo(
      el,
      { '--p': 0 },
      {
        '--p': 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: `clamp(${start})`, end: `clamp(${end})`, scrub: true },
      },
    );
  });
}
