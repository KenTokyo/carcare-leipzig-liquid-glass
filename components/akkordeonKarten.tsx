import React, { useEffect, useState } from 'react';

/**
 * Gemeinsame Mechanik und Gestaltung der aufklappenden Karten. Zwei Akkordeons teilen sie:
 * - `ExpandingCardAccordion`: Leistungsübersicht der Startseite, Expertise, Stellenkarten. Karten sind Links, die Kachel
 *   steht links.
 * - `Stimmen`: „Aus dem Team“ auf `/karriere` (User, 2026-10-03: „im gleichen Design wie die Servicekarten auf der
 *   Mainpage“). Karten sind Zitate, die Kachel steht unten.
 * Bis 2026-10-03 stand alles hier nur in `ExpandingCardAccordion`. Eine Kopie für die Stimmen wäre beim nächsten
 * Feinschliff auseinandergelaufen (Erkennung, Dauer, Schatten, Verlauf).
 */

/**
 * Größe wird von Framer getrieben (nicht per CSS-Transition): Desktop animiert `flexGrow` (Breite bei fester Höhe),
 * Mobil `height`. Die CSS-Höhen-Transition eines Flex-Items ist auf mobilen Browsern (vor allem iOS Safari)
 * unzuverlässig und springt; Framer setzt den Wert per rAF direkt. Gleiche Kurve und Dauer auf beiden Geräten.
 *
 * Bewusst NICHT an prefers-reduced-motion gekoppelt: gewünschte Marken-Bewegung, die übrige Seite animiert ebenfalls
 * ungebremst; gebremst sprängen die Karten auf betroffenen Systemen hart auf (Projektentscheidung).
 */
export const KARTEN_UEBERGANG = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

/** Rahmen einer Karte: Rundung, Schatten, Fokusring. `lg:basis-0`: am Desktop teilt allein `flexGrow` die Breite. */
export const KARTEN_RAHMEN =
  'group relative min-w-0 overflow-hidden rounded-[1.5rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:basis-0';

/**
 * Gerät: Desktop (ab 1024 px waagerecht, sonst senkrecht) und Hover-fähig (Maus) oder Touch.
 * Lazy-Init aus `matchMedia` → richtige Kartenhöhe schon beim ersten Paint. Sicher, weil der Prerender `#root` vor dem
 * Client-Mount leert (`scripts/prerender.mjs`): reines CSR, keine Hydration-Abweichung.
 * `hoverCapable` startet mit `true` und wird nach dem Mount gemessen.
 */
export const useAkkordeonGeraet = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );
  const [hoverCapable, setHoverCapable] = useState(true);
  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover)');
    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      setHoverCapable(hoverMq.matches);
      setIsDesktop(desktopMq.matches);
    };
    sync();
    hoverMq.addEventListener('change', sync);
    desktopMq.addEventListener('change', sync);
    return () => {
      hoverMq.removeEventListener('change', sync);
      desktopMq.removeEventListener('change', sync);
    };
  }, []);
  return { isDesktop, hoverCapable };
};

/**
 * Verlauf von unten und Vignette ringsum, beide im Schwarzblau der Zielgruppenkarten (`--cc-cta-blue`). Seit
 * 2026-09-24 auf Wunsch des Users („nicht schwarz, in den Farben aus ‚Für wen wir arbeiten'“). Der Verlauf ist
 * schwächer als der frühere in Carbon (0,62), weil die Vignette die Unterkante mitfärbt; zusammen würden sie unten
 * fast deckend. Beide stehen aufgeklappt und eingeklappt.
 */
export const KartenSchleier: React.FC = () => (
  <>
    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-cta-blue-rgb)/0.46)] via-[rgb(var(--cc-cta-blue-rgb)/0.1)] to-transparent" />
    <div aria-hidden="true" className="cc-karten-vignette absolute inset-0" />
  </>
);

/**
 * CarCare-Logo als Abzeichen, nur an der aufgeklappten Karte (eingeklappte Streifen sind zu schmal). Bewusst das
 * STATISCHE Logo, nicht das animierte MP4: Bei vielen Karten wären das viele gleichzeitige Videos.
 * `lage`: Position als Tailwind-Klassen (Startseite unten rechts, Stimmen oben rechts über dem Bildhintergrund).
 */
export const KartenLogo: React.FC<{ sichtbar: boolean; lage: string }> = ({ sichtbar, lage }) => (
  <span
    className={`absolute ${lage} z-20 h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-200 md:h-14 md:w-14 ${sichtbar ? 'flex' : 'hidden'}`}
  >
    <img src="/assets/carcare-center-logo.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" className="h-full w-full object-contain" />
  </span>
);
