/**
 * Single Source of Truth fuer die Berufsbilder und ihren Ausschreibungsstand.
 *
 * Gelesen von:
 *  - `pages/CareerPage.tsx`     → Positionskarten auf `/karriere`
 *  - `seo/pageSchemas.ts`       → `JobPosting`-Auszeichnung, NUR fuer offene Stellen
 *
 * WARUM ZENTRAL, UND WARUM MIT STATUS
 * „Serviceberater" stand am 2026-09-03 an sieben Stellen im Code: Positionskarte,
 * Meta-Description, JobPosting-Schema, zwei FAQ-Antworten auf zwei verschiedenen
 * Seiten, der Zahl „Vier Berufsbilder" auf /ueber-uns und einer verwaisten Komponente.
 * Beim naechsten Wechsel waeren es wieder sieben Stellen — und eine davon eine Zahl,
 * die niemand sucht, wenn er nach einem Namen sucht.
 *
 * Der Status trennt deshalb zwei Aussagen, die vorher vermischt waren:
 *   - WELCHE BERUFSBILDER GIBT ES im Betrieb (bleibt stabil, auch ueber Jahre)
 *   - WELCHE STELLEN SIND OFFEN (aendert sich staendig)
 *
 * Seit 2026-09-03 kommt `art` dazu: Berufsbild oder Ausbildungsplatz. Es steuert die
 * zwei Reihen auf der Seite und die Gruppierung im Bewerbungsformular — die REGELN
 * (Schleier, Schema, Auswahl) sind fuer beide dieselben.
 *
 * Ein Wechsel ist damit ein Wort in dieser Datei. Insbesondere entsteht die
 * `JobPosting`-Auszeichnung ausschliesslich aus `status: 'suchend'` — eine
 * ausgezeichnete Stelle, die es nicht gibt, waere eine Falschangabe an Google und
 * kostet im Zweifel die Rich Results der ganzen Seite.
 */

export type JobStatus = 'suchend' | 'nicht-suchend';

/**
 * Berufsbild oder Ausbildungsplatz.
 *
 * WARUM EIN FELD UND NICHT ZWEI LISTEN: Beide durchlaufen dieselben Regeln — Schleier
 * bei `nicht-suchend`, `JobPosting` nur bei `suchend`, dieselbe Auswahl im Formular.
 * Zwei Listen waeren zwei Orte, an denen dieselbe Regel gepflegt werden muesste, und
 * beim naechsten Statuswechsel einer davon vergessen. Die zwei REIHEN auf der Seite
 * entstehen aus diesem Feld, nicht aus zwei Datenquellen.
 */
export type JobArt = 'beruf' | 'ausbildung';

export interface JobPosition {
  id: string;
  /** Berufsbild, wie es auf der Karte und im Schema steht. */
  title: string;
  art: JobArt;
  /** Ein bis zwei Saetze: worum geht es in dieser Rolle. */
  description: string;
  /**
   * Anforderungen und Aufgaben. Erscheinen im scrollbaren Textbereich der Karte.
   * Bewusst kurze Punkte statt Fliesstext — sie werden untereinander gelesen.
   */
  anforderungen: string[];
  status: JobStatus;
  /** Kachelmotiv, Dateien in /public/assets/kacheln. */
  backgroundImage: string;
}

const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

export const jobPositions: JobPosition[] = [
  {
    id: 'aufbereiter',
    art: 'beruf',
    title: 'Kfz-Aufbereiter',
    description:
      'Fahrzeugpflege innen und außen, Lackreinigung, Politur und Versiegelung — Arbeit, deren Ergebnis man sofort sieht.',
    anforderungen: [
      'Sorgfalt im Umgang mit hochwertigen Fahrzeugen',
      'Auge für Details, auch an schwer zugänglichen Stellen',
      'Erfahrung in der Fahrzeugaufbereitung von Vorteil, kein Muss',
      'Bereitschaft, sich in Verfahren und Mittel einzuarbeiten',
    ],
    status: 'suchend',
    backgroundImage: kachel('innenaufbereitung-leipzig-carcare'),
  },
  {
    id: 'lackierer',
    art: 'beruf',
    title: 'Fahrzeuglackierer',
    description:
      'Lackierarbeiten von Spot-Repair bis Komplettlackierung — als Glasurit-Lackpartner mit farbtongenauer Angleichung.',
    anforderungen: [
      'Abgeschlossene Ausbildung als Fahrzeuglackierer',
      'Sicheres Gespür für Farbton und Oberfläche',
      'Erfahrung mit Wasserbasislacken von Vorteil',
      'Anspruch an ein Ergebnis, das man nicht sieht',
    ],
    status: 'suchend',
    backgroundImage: kachel('autolackierung-leipzig-carcare'),
  },
  {
    id: 'karosserie',
    art: 'beruf',
    title: 'Karosserie- und Fahrzeugbaumechaniker',
    description:
      'Instandsetzung nach Unfallschäden, Karosseriearbeiten und Richtbank — instand setzen, wo es fachlich vertretbar ist.',
    anforderungen: [
      'Abgeschlossene Ausbildung im Karosserie- oder Fahrzeugbau',
      'Erfahrung mit Instandsetzung nach Unfallschäden',
      'Handwerkliche Präzision und selbstständige Arbeitsweise',
      'Bereitschaft zur Abstimmung mit Lackierung und Service',
    ],
    status: 'suchend',
    backgroundImage: kachel('versicherung-schadenabwicklung-leipzig-carcare'),
  },
  /**
   * NICHT SUCHEND, aber im Betrieb vorhanden — deshalb bleibt die Karte stehen.
   * Sie traegt kein `JobPosting`-Markup (siehe `offeneStellen`) und zeigt auf der
   * Seite ein Statusabzeichen. Wird die Stelle wieder ausgeschrieben, ist es ein
   * Wort hier: `status: 'suchend'`. Nichts weiter.
   */
  {
    id: 'serviceberater',
    art: 'beruf',
    title: 'Serviceberater',
    description:
      'Erste Ansprechperson für Kundinnen und Kunden: Auftragsannahme, Terminplanung und Abstimmung zwischen Werkstatt und Versicherung.',
    anforderungen: [
      'Erfahrung im Kundenkontakt, gern aus dem Kfz-Umfeld',
      'Überblick über parallele Aufträge und Termine',
      'Sichere Kommunikation mit Versicherern und Gutachtern',
      'Freude daran, zwischen Werkstatt und Kunde zu vermitteln',
    ],
    status: 'nicht-suchend',
    backgroundImage: kachel('autohaus-fuhrpark-service-leipzig-carcare'),
  },

  /**
   * AUSBILDUNGSBERUFE. Vom User am 2026-09-03 vorgegeben, nicht hergeleitet: Die ersten
   * beiden decken sich mit den Gewerken aus dem Kundenreview, der dritte ist eine
   * bewusste Ergaenzung.
   *
   * Alle drei stehen auf `nicht-suchend`, bis Andre bestaetigt (Backlog 3.32). Damit
   * erscheinen sie mit Schleier und Initiativ-Aufruf — eine Aussage, die in jedem Fall
   * stimmt, waehrend „wir bilden aus" ohne Zusage eine Behauptung waere. Nach der
   * Zusage ist es ein Wort je Eintrag.
   *
   * Die Anforderungen sind bewusst knapp und allgemeingueltig gehalten. Was den Karten
   * fachlich fehlt — Ausbildungsbeginn, Dauer, schulische Voraussetzungen,
   * Uebernahmechancen — kommt mit der Zulieferung (Backlog 3.32, gebuendelt mit 1.26).
   * KEINE PLATZHALTER dafuer: erfundene Eckdaten zu einer Ausbildung liest jemand als
   * Zusage.
   */
  {
    id: 'ausbildung-lackierer',
    art: 'ausbildung',
    title: 'Fahrzeuglackierer/in',
    description:
      'Ausbildung im Lackierhandwerk: Untergrund, Farbtonbestimmung, Applikation und Finish — bei einem Glasurit-Lackpartner.',
    anforderungen: [
      'Interesse an Farbe, Oberfläche und sauberem Arbeiten',
      'Sorgfalt und Geduld bei feinen Arbeitsschritten',
      'Bereitschaft, im Team und nach Vorgaben zu arbeiten',
    ],
    status: 'nicht-suchend',
    backgroundImage: kachel('autolackierung-leipzig-carcare'),
  },
  {
    id: 'ausbildung-karosserie',
    art: 'ausbildung',
    title: 'Karosserie- und Fahrzeugbaumechaniker/in',
    description:
      'Ausbildung in Karosserie und Instandsetzung: Schadenbeurteilung, Richten, Fügen und der Umgang mit modernen Fahrzeugstrukturen.',
    anforderungen: [
      'Handwerkliches Geschick und technisches Verständnis',
      'Interesse an Fahrzeugtechnik und Konstruktion',
      'Zuverlässigkeit im Umgang mit Werkzeug und Material',
    ],
    status: 'nicht-suchend',
    backgroundImage: kachel('schadenaufnahme-leipzig-carcare'),
  },
  {
    id: 'ausbildung-industriekaufmann',
    art: 'ausbildung',
    title: 'Industriekaufmann/-frau',
    description:
      'Kaufmännische Ausbildung im Werkstattbetrieb: Auftragsabwicklung, Einkauf, Rechnungswesen und die Abstimmung mit Versicherern.',
    anforderungen: [
      'Freude an Zahlen, Abläufen und Organisation',
      'Sicheres Auftreten am Telefon und im Schriftverkehr',
      'Sorgfalt bei Unterlagen und Fristen',
    ],
    status: 'nicht-suchend',
    backgroundImage: kachel('kalkulation-leipzig-carcare'),
  },
];

/** Die vier Berufsbilder — erste Reihe auf `/karriere`. */
export const berufsbilder = jobPositions.filter((job) => job.art === 'beruf');

/** Die Ausbildungsberufe — zweite Reihe auf `/karriere`. */
export const ausbildungsberufe = jobPositions.filter((job) => job.art === 'ausbildung');

/**
 * Nur die tatsaechlich ausgeschriebenen Stellen. Speist die `JobPosting`-Auszeichnung.
 * Wer hier etwas anderes einsetzt, zeichnet Stellen aus, die es nicht gibt.
 */
export const offeneStellen = jobPositions.filter((job) => job.status === 'suchend');

/**
 * Schaltet das Pop-up mit den offenen Stellen auf `/karriere` (Backlog 1.23).
 * Ein Ort statt verstreuter Bedingungen — auf `false` verschwindet es vollstaendig,
 * ohne dass jemand Markup anfassen muss.
 */
export const STELLEN_POPUP_AKTIV = true;

/**
 * Ziel aller Bewerbungs-Handlungsaufrufe: Karten, Banner, Pop-up.
 *
 * An EINER Stelle, weil es drei Verwender hat und mit dem Bewerbungsformular auf einen
 * seitenlokalen Anker umgestellt wird. Drei Konstanten in drei Dateien waeren beim
 * Umstellen zwei vergessene.
 */
export const BEWERBUNGS_ZIEL = '/karriere#bewerbung';
