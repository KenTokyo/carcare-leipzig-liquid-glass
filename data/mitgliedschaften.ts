/**
 * Verbandsmitgliedschaften — Backlog 3.12 (Hagelseite) und 4.13 (Über uns).
 *
 * KEIN PARTNER, DESHALB EIGENE DATEI. `data/partners.ts` fuehrt Betriebe, fuer die wir
 * arbeiten. Ein Verband ist etwas anderes: Das Siegel belegt eine Mitgliedschaft, und es
 * wird unveraendert gezeigt, nicht einfarbig wie die Partnerlogos.
 *
 * BVAT — geprueft 2026-09-16 am Impressum des Verbands (bvat.de/index.php/impressum-2/):
 *   Name:     „Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V." — OHNE „für".
 *             Die Langform aus der Kundenliste (4.13, „Bundesverband Autoreparatur-Technik")
 *             ist falsch; die bis 2026-09-16 im Backlog vermerkte Fassung „… für …" ebenso.
 *   Register: Amtsgericht Charlottenburg, VR 29872 B
 *   Website:  bvat.de (bvat-verband.de leitet dorthin weiter)
 *   Logo:     offizielle Datei von bvat.de, unveraendert (`npm run partnerlogos`, Modus
 *             `original`). Der Verband stellt Mitgliedern das Logo als Qualitaetssiegel
 *             zur Verfuegung.
 */

export interface Mitgliedschaft {
  /** Abkuerzung, wie sie im Fliesstext steht. */
  kurz: string;
  /** Eingetragener Name, buchstabengenau. */
  name: string;
  url: string;
  logo: string;
  logoBreite: number;
  logoHoehe: number;
  /** Ein Satz, was der Verband ist — fuer Leser, die die Abkuerzung nicht kennen. */
  beschreibung: string;
}

export const bvat: Mitgliedschaft = {
  kurz: 'BVAT',
  name: 'Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V.',
  url: 'https://www.bvat.de/',
  logo: '/assets/partner/bvat.webp',
  logoBreite: 800,
  logoHoehe: 212,
  beschreibung: 'Der Fachverband für lackschadenfreies Ausbeulen und die Instandsetzung von Hagelschäden.',
};
