/**
 * Herkunft der Bilder — die eine Quelle für die Kennzeichnung auf der Seite.
 *
 * WARUM: Seit dem 02.08.2026 gilt die Transparenzpflicht aus Art. 50 KI-VO. Fotorealistische
 * Bilder, die mit KI erzeugt oder inhaltlich verändert wurden, müssen erkennbar sein — und zwar
 * am Bild, nicht nur in einem Hinweis im Fußbereich.
 *
 * ENTSCHEIDUNG DES USERS (2026-09-20): Bis zur Einzelklärung gilt **alles außer den Videos als
 * KI-generiert**. Sobald feststeht, welches Motiv nur aufgewertet wurde (geschärft, freigestellt,
 * Hintergrund getauscht) und welches vollständig erzeugt ist, wird hier je Datei EINE Zeile
 * geändert — sonst nichts. Die Plakette am Bild folgt automatisch.
 *
 * ⚠️ NICHT NACH AUGENSCHEIN EINTRAGEN. Einem Bild sieht man seine Herkunft nicht an, und eine
 * FALSCHE Kennzeichnung ist derselbe Mangel wie eine fehlende: Ein echtes Foto als „KI-generiert“
 * auszuweisen, entwertet die eigene Arbeit und ist irreführend. Nur eintragen, was der Kunde oder
 * die eigene Bildproduktion bestätigt.
 *
 * KEINE PLAKETTE bekommen:
 *  - Videos und ihre Standbilder: Aufnahmen aus dem Betrieb (Lieferungen 07.09. und 21.09.2026).
 *  - Die elf Fotos der Lieferung vom 21.09.2026: vom User als echt bestätigt (Liste unten).
 *  - Logos, Siegel, Wortmarken, das EU-Emblem: Grafiken, keine fotorealistischen Darstellungen;
 *    sie fallen nicht unter die Norm (und ein KI-Label an einem Verbandssiegel wäre schlicht falsch).
 *  - Das Unsplash-Stockfoto der Teilen-Vorschau: ein echtes Foto, nur nicht unseres.
 *
 * Die Liste aller Bildstellen mit fester Nummer steht in `docs/bilder/README.md` (`npm run bilder`).
 */

export type Bildherkunft = 'generiert' | 'aufgewertet' | 'echt';

/** Sichtbarer Text der Plakette. `echt` trägt keine. */
export const HERKUNFT_TEXT: Record<Bildherkunft, string> = {
  generiert: 'KI-generiert',
  aufgewertet: 'KI-bearbeitet',
  echt: '',
};

/**
 * Ausnahmen je Datei. Was hier nicht steht, gilt als `STANDARD`.
 * Schlüssel ist der Pfad, wie er im Code steht (mit `/assets/`).
 */
const AUSNAHMEN: Record<string, Bildherkunft> = {
  // Betriebsvideo des Kunden und die daraus gezogenen Standbilder — echte Aufnahmen.
  '/assets/carcare-ueber-uns-hero.mp4': 'echt',
  '/assets/carcare-ueber-uns-hero-standbild.webp': 'echt',
  '/assets/carcare-betriebsrundgang.mp4': 'echt',
  '/assets/carcare-betriebsrundgang-standbild.webp': 'echt',
  '/assets/carcare-arbeitsplatz.mp4': 'echt',
  '/assets/carcare-arbeitsplatz-standbild.webp': 'echt',

  // Lieferung „Neue Fotos Schleife September“, eingebaut am 2026-09-21. Vom User bestätigt:
  // „alle Anhänge sind echt. Nichts ist KI-generiert oder aufgewertet.“ Aufbereitet mit
  // `npm run fotos` bzw. `npm run video` (Zuschnitt, zwei Kennzeichen weichgezeichnet — keine KI).
  // ⚠️ Fünf davon tragen den NAMEN eines früheren Motivs (autolackierung, dellenentfernung,
  // ersatzwagen, autohaeuser-und-fuhrparks, innenaufbereitung): Die Datei ist ersetzt, deshalb gilt
  // die Zeile dem neuen Foto. Die alten Motive stehen als `lackierkabine-…` und `fahrzeugabgabe-…`
  // weiter unter dem Standard.
  '/assets/kacheln/unfallinstandsetzung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/unfallinstandsetzung-hintergrund-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autolackierung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autolackierung-hintergrund-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/dellenentfernung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/ersatzwagen-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/innenaufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/lackaufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/leasingrueckgabe-aufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/aufbereitung-aktiv-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/karriere-aufbereiter-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/karriere-fahrzeugbau-leipzig-carcare.webp': 'echt',
  '/assets/carcare-autolackierung.mp4': 'echt',
  '/assets/carcare-autolackierung-standbild.webp': 'echt',

  // Bereichsvideos (R18), geliefert vom User am 2026-09-23: drei Drohnenclips aus derselben
  // Aufnahme wie das Betriebsvideo vom 07.09.2026 — echte Aufnahmen aus dem Betrieb. Im
  // Karosserieclip sind zwei Kundenkennzeichen weichgezeichnet; das ist eine Unkenntlichmachung
  // aus Datenschutzgründen, keine generative Veränderung — die Herkunft bleibt „echt“.
  '/assets/carcare-bereich-karosserie.mp4': 'echt',
  '/assets/carcare-bereich-karosserie-standbild.webp': 'echt',
  '/assets/carcare-bereich-lack.mp4': 'echt',
  '/assets/carcare-bereich-lack-standbild.webp': 'echt',
  '/assets/carcare-bereich-aufbereitung.mp4': 'echt',
  '/assets/carcare-bereich-aufbereitung-standbild.webp': 'echt',
};

/** Vorgabe für alles, was nicht in den Ausnahmen steht (Stand 2026-09-20). */
const STANDARD: Bildherkunft = 'generiert';

/** Marken- und Verbandsgrafiken tragen nie eine Plakette. */
const GRAFIK = /\/assets\/(carcare-center-|partner\/|eu-emblem)/;

export const herkunftVon = (quelle?: string | null): Bildherkunft => {
  if (!quelle) return 'echt';
  if (!quelle.startsWith('/assets/')) return 'echt'; // externe Bilder (Stockfoto der Teilen-Vorschau)
  if (GRAFIK.test(quelle)) return 'echt';
  return AUSNAHMEN[quelle] ?? STANDARD;
};

/** Text für die Plakette an genau diesem Bild; leer heißt: keine Plakette. */
export const hinweisFuer = (quelle?: string | null): string => HERKUNFT_TEXT[herkunftVon(quelle)];
