import { useRef } from 'react';
import { site } from './content';
import { drawOnScroll, gsap, MOTION_OK, ScrollTrigger, useGSAP } from './lib/motion';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Cursor } from './components/Cursor';
import { Hero, Nav } from './components/sections/Hero';
import { Journey } from './components/sections/Journey';
import { Capabilities } from './components/sections/Capabilities';
import { Work } from './components/sections/Work';
import { Experiments } from './components/sections/Experiments';
import { Beyond } from './components/sections/Beyond';
import { Contact } from './components/sections/Contact';

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  useSmoothScroll();

  // Every mark with draw="scroll" draws itself as it enters the viewport.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // set up just after first paint: none of these marks are above the fold
        gsap.delayedCall(0.25, () => drawOnScroll(gsap.utils.toArray<Element>('[data-draw="scroll"]')));
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
      >
        {site.skipLink}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Journey />
        <Capabilities />
        <Work />
        <Experiments />
        <Beyond />
      </main>
      <Contact />
      <Cursor />
    </div>
  );
}
