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
  /** Reine Berufsbezeichnung; Karte, Pop-up, Formular und Schema setzen „(m/w/d)“ ueber `stellenTitel` dazu. */
  title: string;
  /**
   * Derselbe Titel mit weichen Trennstellen (U+00AD) an den Wortfugen — NUR fuer den schmalen
   * Textkasten der Karten (Backlog 5.25). Die automatische Silbentrennung greift bei „…/in" nicht;
   * dann brach der Notfallumbruch mitten im Wort („Fahrzeugbaumechanik / er/in"). Schema, Formular,
   * Banner und Pop-up nutzen `title`: Dort ist Platz, und ein Trennzeichen im Schema waere Stoerfeuer.
   */
  anzeigeTitel?: string;
  art: JobArt;
  /** Ein bis zwei Saetze: worum geht es in dieser Rolle. */
  description: string;
  /**
   * Anforderungen und Aufgaben. Erscheinen im scrollbaren Textbereich der Karte.
   * Bewusst kurze Punkte statt Fliesstext — sie werden untereinander gelesen.
   */
  anforderungen: string[];
  status: JobStatus;
  /**
   * Kurzer Zusatz fuer das Abzeichen offener Stellen, z. B. „Beginn Sommer 2027" (Backlog 5.26).
   * Ohne Angabe steht „Stelle offen" bzw. bei Ausbildung „Ausbildungsplatz frei".
   */
  hinweis?: string;
  /**
   * Seit wann die Stelle auf der Seite ausgeschrieben ist (JJJJ-MM-TT). Speist `datePosted` im
   * `JobPosting`-Markup — ein Pflichtfeld bei Google, das bis 2026-09-27 fehlte. Nur bei `suchend`.
   */
  ausgeschriebenSeit?: string;
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
      'Fahrzeugpflege innen und außen, Politur und Versiegelung. Arbeit, deren Ergebnis man sofort sieht.',
    anforderungen: [
      'Sorgfalt im Umgang mit hochwertigen Fahrzeugen',
      'Auge für Details, auch an schwer zugänglichen Stellen',
      'Erfahrung in der Fahrzeugaufbereitung von Vorteil, kein Muss',
      'Bereitschaft, sich in Verfahren und Mittel einzuarbeiten',
    ],
    status: 'suchend',
    ausgeschriebenSeit: '2026-09-03',
    // B103, seit 2026-09-21: echtes Foto eines Kollegen bei der Arbeit (Einwilligung liegt vor).
    backgroundImage: kachel('karriere-aufbereiter-leipzig-carcare'),
  },
  {
    id: 'lackierer',
    art: 'beruf',
    title: 'Fahrzeuglackierer',
    description:
      'Lackierarbeiten von Spot-Repair bis Komplettlackierung, als Glasurit-Lackpartner mit farbtongenauer Angleichung.',
    anforderungen: [
      'Abgeschlossene Ausbildung als Fahrzeuglackierer',
      'Sicheres Gespür für Farbton und Oberfläche',
      'Erfahrung mit Wasserbasislacken von Vorteil',
      'Anspruch an ein Ergebnis, das man nicht sieht',
    ],
    status: 'suchend',
    ausgeschriebenSeit: '2026-09-03',
    // B104 bleibt, wie es ist (Kunde, 2026-09-21). Nur der Dateiname ist neu: `autolackierung-…`
    // traegt seit dem 2026-09-21 das echte Lackierfoto der Leistungsseiten.
    backgroundImage: kachel('lackierkabine-leipzig-carcare'),
  },
  {
    id: 'karosserie',
    art: 'beruf',
    title: 'Karosserie- und Fahrzeugbaumechaniker',
    anzeigeTitel: 'Karosserie- und Fahrzeugbau\u00ADmechaniker',
    description:
      'Instandsetzung nach Unfallschäden, Karosseriearbeiten und Arbeit an der Richtbank. Wir setzen instand, wo es fachlich vertretbar ist.',
    anforderungen: [
      'Abgeschlossene Ausbildung im Karosserie- oder Fahrzeugbau',
      'Erfahrung mit Instandsetzung nach Unfallschäden',
      'Handwerkliche Präzision und selbstständige Arbeitsweise',
      'Bereitschaft zur Abstimmung mit Lackierung und Service',
    ],
    status: 'suchend',
    ausgeschriebenSeit: '2026-09-03',
    // B105, seit 2026-09-21: echtes Foto aus dem Karosseriebau (Einwilligung liegt vor).
    backgroundImage: kachel('karriere-fahrzeugbau-leipzig-carcare'),
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
    // User, 2026-10-05: echtes Foto aus unserem Büro (B106). Bis dahin `autohaus-fuhrpark-service-leipzig-carcare`
    // (KI-bearbeitet); die Datei bleibt, sie steht noch bei Fuhrparkservice und im Titelbild.
    backgroundImage: kachel('karriere-serviceberater-leipzig-carcare'),
  },

  /**
   * AUSBILDUNGSBERUFE. Vom User am 2026-09-03 vorgegeben, nicht hergeleitet: Die ersten
   * beiden decken sich mit den Gewerken aus dem Kundenreview, der dritte ist eine
   * bewusste Ergaenzung.
   *
   * ZUSAGE VOM 2026-09-25 (Meeting, Backlog 5.26, beantwortet 3.32): Alle drei werden
   * ausgeschrieben. Lackierung und Karosserie mit dem Hinweis „Beginn Sommer 2027" (Andre:
   * „keine Nachzuegler mehr"), Buerokaufmann/-frau (bis 2026-10-04 Industriekaufmann/-frau) bewusst OHNE Hinweis — dort waere ein
   * Nachzuegler noch willkommen („lassen wir es mal unkommentiert"). Bis dahin standen alle drei
   * auf `nicht-suchend`, mit Schleier und Initiativ-Aufruf.
   *
   * Die Anforderungen sind bewusst knapp und allgemeingueltig gehalten. Was den Karten
   * fachlich fehlt — Ausbildungsbeginn, Dauer, schulische Voraussetzungen,
   * Uebernahmechancen — kommt mit der Zulieferung (Backlog R4, gebuendelt mit 1.26).
   * KEINE PLATZHALTER dafuer: erfundene Eckdaten zu einer Ausbildung liest jemand als
   * Zusage.
   */
  {
    id: 'ausbildung-lackierer',
    art: 'ausbildung',
    title: 'Fahrzeuglackierer',
    anzeigeTitel: 'Fahrzeug\u00ADlackierer',
    description:
      'Ausbildung im Lackierhandwerk: Untergrund, Farbtonbestimmung, Applikation und Finish, bei einem Glasurit-Lackpartner.',
    anforderungen: [
      'Interesse an Farbe, Oberfläche und sauberem Arbeiten',
      'Sorgfalt und Geduld bei feinen Arbeitsschritten',
      'Bereitschaft, im Team und nach Vorgaben zu arbeiten',
    ],
    status: 'suchend',
    hinweis: 'Beginn Sommer 2027',
    ausgeschriebenSeit: '2026-09-27',
    // B107 bleibt vorerst (Kunde, 2026-09-21: „erstmal stehen lassen“), Motiv wie B104.
    backgroundImage: kachel('lackierkabine-leipzig-carcare'),
  },
  {
    id: 'ausbildung-karosserie',
    art: 'ausbildung',
    title: 'Karosserie- und Fahrzeugbaumechaniker',
    anzeigeTitel: 'Karosserie- und Fahrzeugbau\u00ADmechaniker',
    description:
      'Ausbildung in Karosserie und Instandsetzung: Schadenbeurteilung, Richten, Fügen und der Umgang mit modernen Fahrzeugstrukturen.',
    anforderungen: [
      'Handwerkliches Geschick und technisches Verständnis',
      'Interesse an Fahrzeugtechnik und Konstruktion',
      'Zuverlässigkeit im Umgang mit Werkzeug und Material',
    ],
    status: 'suchend',
    hinweis: 'Beginn Sommer 2027',
    ausgeschriebenSeit: '2026-09-27',
    // B108, seit 2026-09-21: dasselbe Karosseriebau-Foto wie B105 (Rueckfrage beantwortet: nicht
    // das Aufbereiter-Foto aus dem ersten Auftrag — die Karte ist die Karosserie-Ausbildung).
    backgroundImage: kachel('karriere-fahrzeugbau-leipzig-carcare'),
  },
  // Seit 2026-10-04 Bürokaufmann/-frau statt Industriekaufmann/-frau (Vorgabe des Users). Die ID wechselt mit: Sie steht
  // als „Bereich“ in der Bewerbungs-Mail (`position` hat keinen Klartext in `data/anfrageSchema.ts`).
  {
    id: 'ausbildung-buerokaufmann',
    art: 'ausbildung',
    title: 'Bürokaufmann',
    anzeigeTitel: 'Büro\u00ADkaufmann',
    description:
      'Kaufmännische Ausbildung im Werkstattbetrieb: Auftragsabwicklung, Einkauf, Rechnungswesen und die Abstimmung mit Versicherern.',
    anforderungen: [
      'Freude an Zahlen, Abläufen und Organisation',
      'Sicheres Auftreten am Telefon und im Schriftverkehr',
      'Sorgfalt bei Unterlagen und Fristen',
    ],
    status: 'suchend',
    ausgeschriebenSeit: '2026-09-27',
    // Backlog 6.16 (User, 2026-10-05): echtes Foto einer Auszubildenden zur Bürokauffrau. Bis dahin
    // `kalkulation-leipzig-carcare` (KI-bearbeitet); die Datei bleibt, sie steht auch im Unfallbereich.
    backgroundImage: kachel('karriere-buerokauffrau-leipzig-carcare'),
  },
];

/**
 * Stilblatt 8 (Lektorat 2026-10-08, AGG): Jede ausgeschriebene Stelle heisst „<Beruf> (m/w/d)“, auf der Karte, im
 * Pop-up, im Formular und im `JobPosting`. Fliesstext (FAQ, Meta, Ueber uns) nennt die Berufe ohne Zusatz. `title`
 * bleibt die reine Berufsbezeichnung, damit der Zusatz an EINER Stelle haengt und nie doppelt erscheint.
 */
export const MWD = '(m/w/d)';
export const stellenTitel = (job: Pick<JobPosition, 'title'>, titel: string = job.title): string => `${titel} ${MWD}`;
/** Mehrere Stellen in einer Zeile (Banner): der Zusatz einmal mit „jeweils“, statt dreimal hintereinander. */
export const stellenZeile = (jobs: JobPosition[]): string => `${jobs.map((job) => job.title).join(' · ')} (jeweils m/w/d)`;

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
 * Offene Stellen und Ausbildungsplaetze GETRENNT (Backlog 5.26). Seit alle drei Ausbildungsberufe
 * ausgeschrieben sind, haetten Banner, Pop-up und Zaehler sonst „6 offene Stellen" gemeldet und
 * „Fahrzeuglackierer" neben „Fahrzeuglackierer/in" gestellt.
 */
export const offeneBerufe = offeneStellen.filter((job) => job.art === 'beruf');
export const offeneAusbildungen = offeneStellen.filter((job) => job.art === 'ausbildung');

/** „3 offene Stellen · 3 Ausbildungsplätze" — Kicker von Banner und Pop-up, an einer Stelle formuliert. */
export const offeneStellenKicker = (): string => {
  const teile: string[] = [];
  const b = offeneBerufe.length;
  const a = offeneAusbildungen.length;
  if (b) teile.push(b === 1 ? 'Eine offene Stelle' : `${b} offene Stellen`);
  if (a) teile.push(a === 1 ? 'Ein Ausbildungsplatz' : `${a} Ausbildungsplätze`);
  return teile.join(' · ');
};

/**
 * Schaltet das Pop-up mit den offenen Stellen auf `/karriere` (Backlog 1.23).
 * Ein Ort statt verstreuter Bedingungen — auf `false` verschwindet es vollstaendig,
 * ohne dass jemand Markup anfassen muss.
 */
export const STELLEN_POPUP_AKTIV = true;

/**
 * Schaltet das „Jetzt bewerben"-Banner oben auf `/karriere` (Backlog 3.5).
 *
 * WARUM EIN EIGENER SCHALTER, obwohl das Banner sich schon selbst ausblendet, wenn
 * keine Stelle offen ist: Das sind zwei verschiedene Aussagen. „Wir suchen gerade
 * niemanden" ergibt sich aus den Daten. „Wir wollen das Banner nicht zeigen, obwohl
 * wir suchen" ist eine Gestaltungsentscheidung — etwa waehrend einer Messe oder
 * solange die Karriereseite noch abgestimmt wird. Ohne den Schalter liesse sich das
 * nur erzwingen, indem man Stellen aus den Daten nimmt, die es wirklich gibt.
 *
 * Auf `false` verschwindet das Banner vollstaendig; das Pop-up (`STELLEN_POPUP_AKTIV`)
 * und die Positionskarten bleiben davon unberuehrt.
 */
export const BEWERBEN_BANNER_AKTIV = true;

/**
 * Ziel aller Bewerbungs-Handlungsaufrufe: Karten, Banner, Pop-up.
 *
 * An EINER Stelle, weil es drei Verwender hat und mit dem Bewerbungsformular auf einen
 * seitenlokalen Anker umgestellt wird. Drei Konstanten in drei Dateien waeren beim
 * Umstellen zwei vergessene.
 */
export const BEWERBUNGS_ZIEL = '/karriere#bewerbung';
