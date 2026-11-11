import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../lib/motion';

/** Lenis smooth scrolling, driven by GSAP's ticker and kept in sync with ScrollTrigger. Off for reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ anchors: true, lerp: 0.12 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}
