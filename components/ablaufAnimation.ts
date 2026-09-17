import type { Variants } from 'framer-motion';

/**
 * Gemeinsame Animationssprache fuer Zeitstrahl und Ablauf-Sektionen (Backlog 2.3).
 *
 * VORGABE DES KUNDEN: „Alle Zeitstrahl- und Prozessdarstellungen einheitlich im Stil
 * ‚Ablauf in fuenf Schritten zum Ziel' (kfz-lindner.de) animieren."
 *
 * WAS HIER EINHEITLICH IST UND WAS NICHT: Vereinheitlicht wird die BEWEGUNG — eine Achse
 * zeichnet sich, und jeder Punkt erscheint genau dann, wenn die Linie ihn erreicht.
 * NICHT vereinheitlicht wird das Layout: Der Zeitstrahl haengt seine Karten abwechselnd
 * ueber und unter die Achse, weil Meilensteine ungleich lang sind und sich sonst
 * gegenseitig druecken. Die Ablauf-Sektionen haengen alle Karten auf dieselbe Seite,
 * weil Schritte gleichrangig sind — ein Wechsel oben/unten wuerde dort eine Rangfolge
 * behaupten, die es nicht gibt.
 *
 * ⚠️ DIE FALLE, DIE HIER NICHT ZURUECKKOMMEN DARF (aus `Timeline.tsx`, gemessen am
 * 2026-09-04): `whileInView` darf NICHT auf demselben Element sitzen, das bei
 * `scale: 0` startet. Ein auf null skaliertes Element hat keine Flaeche, der
 * IntersectionObserver sitzt auf ebendiesem Element — es beobachtet sich selbst weg und
 * erscheint nie. Deshalb: Beobachtet wird immer der TRAEGER (`<li>`), der seine Flaeche
 * behaelt; Punkt und Karte bekommen den Zustand ueber `variants` vererbt.
 *
 * Wer diese Datei aendert, aendert BEIDE Darstellungen. Das ist der Zweck.
 */

/** Wie lange die Achse braucht, um von einem Ende zum anderen durchzulaufen. */
export const ACHSE_DAUER = 1.1;

/**
 * Spaltenzahl als AUSGESCHRIEBENE Klassen.
 *
 * Tailwind liest den Quelltext als Text — eine zusammengesetzte Klasse wie
 * `xl:grid-cols-${n}` steht dort nie und wird nicht erzeugt. Das Raster fiele stumm auf
 * eine Spalte zurueck.
 */
export const SPALTEN: Record<number, string> = {
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
};

/** Der Punkt erscheint, wenn die Linie ihn erreicht. */
export const punktVerzoegerung = (idx: number, anzahl: number) =>
  0.12 + (idx / Math.max(anzahl - 1, 1)) * ACHSE_DAUER;

export const ACHSE: Variants = {
  ruhe: { scaleX: 0, scaleY: 0 },
  an: { scaleX: 1, scaleY: 1 },
};

export const PUNKT: Variants = {
  ruhe: { scale: 0, opacity: 0 },
  an: { scale: 1, opacity: 1 },
};

export const KARTE: Variants = {
  ruhe: { opacity: 0, y: 14 },
  an: { opacity: 1, y: 0 },
};

/** Gemeinsame Ausloeseschwelle. Einmal pro Besuch, kurz bevor die Sektion ganz da ist. */
export const SICHTFELD = { once: true, margin: '-60px' } as const;

/** Weich am Anfang, ruhig am Ende — dieselbe Kurve fuer beide Darstellungen. */
export const ACHSE_KURVE = [0.25, 0.6, 0.3, 1] as const;
