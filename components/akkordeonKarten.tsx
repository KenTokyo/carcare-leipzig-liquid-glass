import React, { useEffect, useState } from 'react';
import type { MobilLage } from './akkordeonMobil';

/**
 * Gemeinsame Mechanik und Gestaltung der aufklappenden Karten. Zwei Akkordeons teilen sie:
 * - `ExpandingCardAccordion`: Leistungsübersicht der Startseite, Expertise, Stellenkarten. Karten sind Links, die Kachel
 *   steht links.
 * - `Stimmen`: „Aus dem Team“ auf `/karriere` (User, 2026-10-03: „im gleichen Design wie die Servicekarten auf der
 *   Mainpage“). Karten sind Zitate, die Kachel steht unten.
 * Bis 2026-10-03 stand alles hier nur in `ExpandingCardAccordion`. Eine Kopie für die Stimmen wäre beim nächsten
 * Feinschliff auseinandergelaufen (Erkennung, Dauer, Schatten, Verlauf). Genau das war bis 2026-10-19 geschehen: Die
 * Leistungskarten bekamen am 16. und 17.10. die mobile Mechanik (`akkordeonMobil.ts`), die Stimmen animierten weiter die
 * Höhe (R25, R33-a). Seitdem stehen hier auch Rahmen und Gerüst (`KARTEN_RAHMEN`, `KartenFenster`).
 */

/**
 * Größe am Desktop wird von Framer getrieben (`flexGrow`, Breite bei fester Höhe). Unter 1024 px springt die Höhe
 * seit 2026-10-16 (Startseite) bzw. 2026-10-19 (Stimmen) einmal, sichtbar bewegt sich nur `transform`
 * (`akkordeonMobil.ts`, mit eigener Dauer und Kurve `MOBIL_BEWEGUNG`).
 *
 * Bewusst NICHT an prefers-reduced-motion gekoppelt: gewünschte Marken-Bewegung, die übrige Seite animiert ebenfalls
 * ungebremst; gebremst sprängen die Karten auf betroffenen Systemen hart auf (Projektentscheidung).
 */
export const KARTEN_UEBERGANG = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

/**
 * Rahmen einer Karte: Rundung, Fokusring, am Desktop Beschnitt und Schatten. `lg:basis-0`: am Desktop teilt allein
 * `flexGrow` die Breite. `lg:h-full`: Höhe am Desktop (bis 2026-10-19 setzte Framer `height: 100%` mit, nur am Desktop;
 * nach dem Wechsel von schmal auf breit kam das nie an, R33-e).
 * MOBIL OHNE BESCHNITT UND SCHATTEN: Dort schneidet das Fenster (`data-akk="fenster"`, `KartenFenster`) zu, denn nur
 * seine Unterkante wandert beim Auf- und Zuklappen (`akkordeonMobil.ts`). Die Karte selbst springt sofort auf die neue
 * Höhe; ein Beschnitt an ihr schnitte die zuklappende Karte im ersten Bild ab. Den Schatten trägt seit 2026-10-17 eine
 * eigene Ebene (`data-akk="schatten"`: das „weiße Rechteck“ hinter den Karten).
 * OHNE TIPP-HERVORHEBUNG (2026-10-16 abends, Rückmeldung vom A56: „die nächste Karte blitzt weiß auf“): `index.css` gibt
 * jedem Link Signalblau 18 % als Tipp-Farbe. Android zeichnet sie über den Kasten der Karte, und der ist mobil sofort so
 * hoch wie die offene Karte, während das Fenster noch aufgeht: Die Hervorhebung lag damit über den nächsten Karten.
 * Rückmeldung gibt hier das Aufklappen selbst. Die Stimmen sind fokussierbare Listeneinträge, keine Links; Android
 * hebt auch sie hervor.
 */
export const KARTEN_RAHMEN =
  'group relative min-w-0 rounded-[1.5rem] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:basis-0 lg:h-full lg:overflow-hidden lg:shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)]';

/**
 * GERÜST EINER KARTE: Schatten, Fenster und Inhalt (Mechanik und Begründungen in `akkordeonMobil.ts`).
 * - Unter 1024 px (`lage` gesetzt) sind Fenster und Inhalt so hoch wie die offene Karte: Das Fenster schneidet zu, der
 *   Inhalt steht an der Kartenoberkante. Das Fenster lässt Zeigerereignisse durch, sonst läge sein nach oben
 *   verschobener, leerer Teil über der Karte davor. Der Schatten steht wie das Fenster und ist so deckend, wie die Karte
 *   offen ist: Eingeklappt wirft der unsichtbare, nach oben ragende Teil keinen Schatten neben die Kartenspalte.
 * - Am Desktop (`lage` null) zwei `inset-0`-Ebenen ohne Inline-Stil, also wie vor dem 16.10.
 * Die Kinder (Bildebene mit `data-akk="bild"`, Schleier, Titel, Kachel) liegen im Inhalt.
 */
export const KartenFenster: React.FC<{ lage: MobilLage | null; hoehe: number; schatten: number; children: React.ReactNode }> = ({
  lage,
  hoehe,
  schatten,
  children,
}) => (
  <>
    {lage && (
      <div
        data-akk="schatten"
        aria-hidden="true"
        style={{ height: hoehe, transform: lage.schatten, opacity: schatten }}
        className="pointer-events-none absolute inset-x-0 top-0 rounded-[1.5rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] lg:hidden"
      />
    )}
    <div
      data-akk="fenster"
      style={lage ? { height: hoehe, transform: lage.fenster } : undefined}
      className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-[1.5rem] lg:bottom-0"
    >
      <div data-akk="inhalt" style={lage ? { transform: lage.inhalt } : undefined} className="pointer-events-auto absolute inset-0 overflow-hidden rounded-[1.5rem]">
        {children}
      </div>
    </div>
  </>
);

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
