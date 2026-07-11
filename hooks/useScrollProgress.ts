import { useEffect } from 'react';
import { useMotionValue, type MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

type Distance = 'self' | 'through';

interface Options {
  /**
   * 'self'    → Fortschritt ueber die eigene Elementhoehe (Hero-Parallax:
   *            0 = Oberkante am Viewport-Top, 1 = komplett darueber hinaus).
   * 'through' → Fortschritt ueber (Elementhoehe - Viewport) (lange Pin-Tracks).
   */
  distance?: Distance;
  /** false schaltet die Messung ab (z. B. bei prefers-reduced-motion). */
  enabled?: boolean;
}

/**
 * Liefert einen 0..1-Scroll-Fortschritt fuer das referenzierte Element,
 * robust gemessen per window-`scroll` + `getBoundingClientRect` (rAF-gedrosselt).
 *
 * Bewusst NICHT Framers `useScroll({ target })`: Der App-Shell
 * `<main class="site-main-shell">` traegt `overflow-x:hidden`
 * (→ computed `overflow-y:auto`) + `transform:translateZ(0)`. Framer erkennt ihn
 * faelschlich als Scroll-Container, dessen `scrollTop` aber 0 bleibt (gescrollt
 * wird das window) → `scrollYProgress` friert bei 0 ein. Die manuelle Messung
 * gegen das window ist dagegen immun (auch gegen Layout-Shifts durch Lazy-Bilder).
 */
export const useScrollProgress = (
  ref: RefObject<HTMLElement | null>,
  { distance = 'self', enabled = true }: Options = {},
): MotionValue<number> => {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) {
      progress.set(0);
      return;
    }
    let raf = 0;
    const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
    const update = () => {
      const rect = el.getBoundingClientRect();
      const dist =
        distance === 'through' ? el.offsetHeight - window.innerHeight : el.offsetHeight;
      progress.set(dist > 0 ? clamp(-rect.top / dist) : 0);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, distance, enabled, progress]);

  return progress;
};
