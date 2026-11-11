import { useEffect, useRef } from 'react';

/** A small ink dot that opens into a ring over interactive elements. Fine pointers only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      el.dataset.visible = 'true';
      const t = e.target as Element | null;
      el.dataset.active = String(!!t?.closest?.('a, button, [data-cursor]'));
      el.dataset.on = t?.closest?.('[data-ink="paper"]') ? 'paper' : 'ink';
    };
    const hide = () => (el.dataset.visible = 'false');
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <div className="cursor-dot" />
    </div>
  );
}
