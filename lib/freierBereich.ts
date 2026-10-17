import { cubicBezier } from 'framer-motion';
import { getLenis } from '../hooks/useSmoothScroll';

/**
 * Freier Bereich des Fensters und sanftes Nachscrollen (seit 2026-10-17).
 *
 * ANLASS (User, Startseite mobil): „Wenn ich auf eine Akkordeon-Karte klicke, dass diese Karte quasi zentriert auf dem
 * Bildschirm geöffnet wird. Dass ich nicht erstmal nochmal runterscrollen muss.“ Gemessen am 17.10. (393 × 851): Eine
 * Karte, bei 60 % der Fensterhöhe getippt, stand offen bei 511 bis 851 px, die Knopfleiste unten beginnt bei 768 px.
 *
 * „ZENTRIERT“ HEISST IM FREIEN BEREICH, nicht im Fenster: Oben liegt die Navbar (mobil 78 px, ab 768 px 100 px), unten
 * die Knopfleiste (`MobileStickyCTA`, rund 83 px, am Seitenende ausgeblendet). Beide tragen `data-feste-leiste` und werden
 * bei jedem Aufruf GEMESSEN statt als Zahl hinterlegt: Höhen ändern sich mit der Breite, die Leiste blendet sich am
 * Seitenende aus, und ihre Kartenauswahl macht sie höher. Ausgeblendete Leisten (Höhe 0 oder außerhalb des Fensters)
 * zählen nicht.
 *
 * Genutzt von `components/akkordeonMobil.ts` (Karten mittig) und `components/FaqListe.tsx` (Antwort ganz ins Bild).
 */

export interface FreierBereich {
  /** Unterkante der festen Leiste oben, in Fensterkoordinaten (0 ohne Leiste). */
  oben: number;
  /** Oberkante der festen Leiste unten, in Fensterkoordinaten (Fensterhöhe ohne Leiste). */
  unten: number;
}

/** Fester Abstand zum Rand des freien Bereichs, wenn etwas nicht mittig passt. */
export const RAND = 12;

export const freierBereich = (): FreierBereich => {
  const hoehe = window.innerHeight;
  let oben = 0;
  let unten = hoehe;
  document.querySelectorAll<HTMLElement>('[data-feste-leiste]').forEach((leiste) => {
    const r = leiste.getBoundingClientRect();
    if (r.height === 0 || r.bottom <= 0 || r.top >= hoehe) return;
    if (leiste.dataset.festeLeiste === 'oben') oben = Math.max(oben, r.bottom);
    else unten = Math.min(unten, r.top);
  });
  return { oben, unten };
};

/**
 * Oberkante, an der ein Block der Höhe `hoehe` mittig im freien Bereich steht. Passt er nicht (samt `RAND` oben und
 * unten), knapp unter die Leiste oben: Der Anfang ist wichtiger als das Ende.
 */
export const mittigeOberkante = (hoehe: number, frei: FreierBereich = freierBereich()): number => {
  const platz = frei.unten - frei.oben;
  return hoehe + 2 * RAND <= platz ? frei.oben + (platz - hoehe) / 2 : frei.oben + RAND;
};

/**
 * Seite um `dy` Pixel sanft verschieben, mit Dauer (s) und Kurve der Bewegung, die gleichzeitig läuft. Über Lenis, sonst
 * liefe dessen Zustand dem Fenster hinterher (Lehre aus `ScrollPinnedProcess`); `force`, damit es auch bei gestopptem
 * Lenis greift. Ein Finger auf dem Bildschirm bricht die Bewegung ab (Lenis stoppt bei nativem Scrollen), ein neuer Aufruf
 * ersetzt sie.
 */
export const gleitenUm = (dy: number, dauer: number, kurve: [number, number, number, number]): void => {
  if (Math.abs(dy) < 1) return;
  const ziel = window.scrollY + dy;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(ziel, { duration: dauer, easing: cubicBezier(...kurve), force: true });
  else window.scrollTo({ top: ziel, behavior: 'smooth' });
};
