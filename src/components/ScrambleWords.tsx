// Adapted from React Bits (reactbits.dev) — DecryptedText.
// Reduced to what this site needs: cycle through a list of words, revealing each
// left-to-right out of scrambled letters. No `motion` dependency. Static under reduced motion.

import { useEffect, useState } from 'react';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

export function ScrambleWords({
  words,
  interval = 2800,
  duration = 620,
  speed = 45,
  className,
}: {
  words: string[];
  /** ms between words */
  interval?: number;
  /** ms one scramble takes */
  duration?: number;
  /** ms between scramble frames */
  speed?: number;
  className?: string;
}) {
  const [text, setText] = useState(words[0]);

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let index = 0;
    let frame: ReturnType<typeof setInterval> | undefined;
    const cycle = setInterval(() => {
      if (document.hidden) return;
      index = (index + 1) % words.length;
      const target = words[index];
      const began = performance.now();
      clearInterval(frame);
      frame = setInterval(() => {
        const t = Math.min(1, (performance.now() - began) / duration);
        const revealed = Math.floor(t * target.length);
        let out = '';
        for (let c = 0; c < target.length; c++) {
          out += c < revealed || target[c] === ' ' ? target[c] : LETTERS[(Math.random() * LETTERS.length) | 0];
        }
        setText(t >= 1 ? target : out);
        if (t >= 1) clearInterval(frame);
      }, speed);
    }, interval);
    return () => {
      clearInterval(cycle);
      clearInterval(frame);
    };
  }, [words, interval, duration, speed]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
