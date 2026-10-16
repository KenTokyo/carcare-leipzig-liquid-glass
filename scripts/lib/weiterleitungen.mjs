// Weiterleitungen der ALTEN Website auf die neuen Seiten (Backlog R22). Die EINE Liste.
//
// WOZU
// Beim Livegang zieht die neue Seite auf dieselbe Domain wie die alte (www.carcare-center.de). Ohne Regel antworten
// alle 48 alten Seitenadressen mit 404: Google verliert die Rankings der Unterseiten, Lesezeichen und Fremdlinks laufen
// ins Leere. Jede alte Adresse zeigt deshalb mit 301 auf die inhaltlich passende neue Seite, 1:1, nie pauschal auf die
// Startseite (das wertet Google als Soft-404).
//
// ZUORDNUNG
// Nach dem INHALT der Altseite, nicht nach ihrem Titel (am 2026-10-16 ausgelesen). Begruendung je Zeile und die vier
// Entscheidungen des Users vom selben Tag: docs/weiterleitungen-altseite/tasks/2026-10-16-weiterleitungen-altseite-tasks.md
//
// AUSGABEN, alle aus dieser Liste
//  - vercel.json → `redirects` (aktiv, solange Vercel ausliefert)
//  - docs/weiterleitungen-altseite/uebergabe/: dieselben Regeln fuer Apache und nginx, falls das Hosting zu KUPPER IT
//    wechselt (Livegang-Punkt 1). Die Altseite laeuft dort auf nginx/Plesk.
//
// NACH JEDER AENDERUNG: `npm run vercel-config` (schreibt alle drei Dateien) und mitcommitten.
// `npm run weiterleitungen` prueft die Liste (laeuft im prebuild), `npm run weiterleitungen -- --live` das Deployment.

export const STATUS = 301;

/** @type {{ von: string, nach: string, alt: string }[]} `alt` = Titel der alten Seite, nur zur Orientierung. */
export const WEITERLEITUNGEN = [
  // Unternehmen
  { von: '/carcarecenter.html', nach: '/ueber-uns', alt: 'CarCare-Center' },
  { von: '/carcarecenter/referenzen.html', nach: '/geschaeftskunden', alt: 'Referenzen (Kundenlogos)' },
  { von: '/carcarecenter/bildergalerie.html', nach: '/ueber-uns', alt: 'Bildergalerie (Betriebsfotos)' },
  { von: '/carcarecenter/videos.html', nach: '/ueber-uns', alt: 'Videos (Betrieb, MDR, LexiTV)' },

  // Leistungsuebersicht und Pakete
  { von: '/privat-geschaeftskunden.html', nach: '/leistungen', alt: 'Privat- & Geschäftskunden: Unser Dienstleistungsspektrum' },
  { von: '/pflegepakete.html', nach: '/fahrzeugaufbereitung-leipzig', alt: 'Pflegepakete' },
  { von: '/privat-geschaeftskunden/pflegepakete.html', nach: '/fahrzeugaufbereitung-leipzig', alt: 'Pflegepakete' },

  // Desinfektion: Ozonbehandlung 45 € steht wie auf der Altseite bei der Innenaufbereitung (User 2026-10-16)
  { von: '/fahrzeugdesinfektion.html', nach: '/innenaufbereitung-leipzig', alt: 'Fahrzeugdesinfektion' },
  { von: '/pflegepakete/fahrzeugdesinfektion.html', nach: '/innenaufbereitung-leipzig', alt: 'Fahrzeugdesinfektion' },
  { von: '/privat-geschaeftskunden/fahrzeugdesinfektion.html', nach: '/innenaufbereitung-leipzig', alt: 'Fahrzeugdesinfektion' },

  // Lackierung
  { von: '/neu-und-reparaturlackierung.html', nach: '/autolackierung-leipzig', alt: 'Neu- und Reparaturlackierung' },
  { von: '/neu-reparaturlackierung-leipzig.html', nach: '/autolackierung-leipzig', alt: 'Neu- und Reparaturlackierung' },
  { von: '/privat-geschaeftskunden/neu-und-reparaturlackierung.html', nach: '/autolackierung-leipzig', alt: 'Neu- und Reparaturlackierung' },

  // Reparaturloesungen: Lack und Kunststoff → Smart Repair, Leder und Stoff → Innenaufbereitung (User 2026-10-16)
  { von: '/lackreparatur.html', nach: '/smart-repair-leipzig', alt: 'Lackreparatur (Spot-Repair)' },
  { von: '/reparaturloesungen-mit-system.html', nach: '/smart-repair-leipzig', alt: 'Reparaturlösungen mit System' },
  { von: '/privat-geschaeftskunden/reparaturloesungen-mit-system.html', nach: '/smart-repair-leipzig', alt: 'Reparaturlösungen mit System' },
  { von: '/kunststoffreparatur.html', nach: '/smart-repair-leipzig', alt: 'Kunststoffreparatur' },
  { von: '/lederreparatur.html', nach: '/innenaufbereitung-leipzig', alt: 'Lederreparatur' },
  { von: '/stoffreparatur.html', nach: '/innenaufbereitung-leipzig', alt: 'Stoffreparatur' },

  // Leistungen 1:1
  { von: '/felgenreparatur.html', nach: '/felgenreparatur-leipzig', alt: 'Felgenreparatur' },
  { von: '/privat-geschaeftskunden/felgenreparatur.html', nach: '/felgenreparatur-leipzig', alt: 'Felgenreparatur' },
  { von: '/dellenentfernung-leipzig.html', nach: '/dellenentfernung-leipzig', alt: 'Dellenentfernung' },
  { von: '/dellen-entfernung-leipzig.html', nach: '/dellenentfernung-leipzig', alt: 'Dellenentfernung' },
  { von: '/privat-geschaeftskunden/dellenentfernung.html', nach: '/dellenentfernung-leipzig', alt: 'Dellenentfernung' },
  { von: '/hagelschadenreparatur-leipzig.html', nach: '/hagelschadenreparatur-leipzig', alt: 'Hagelschadenreparatur' },
  { von: '/privat-geschaeftskunden/hagelschadenreparatur.html', nach: '/hagelschadenreparatur-leipzig', alt: 'Hagelschadenreparatur' },
  { von: '/autoglas-scheibenfolien.html', nach: '/autoglas-leipzig', alt: 'Autoglas / Scheibenfolien' },
  { von: '/privat-geschaeftskunden/autoglas-scheibenfolien.html', nach: '/autoglas-leipzig', alt: 'Autoglas / Scheibenfolien' },
  { von: '/unfallinstandsetzung.html', nach: '/unfallinstandsetzung-leipzig', alt: 'Unfallinstandsetzung' },
  { von: '/privat-geschaeftskunden/unfallinstandsetzung.html', nach: '/unfallinstandsetzung-leipzig', alt: 'Unfallinstandsetzung' },
  { von: '/leasingbegleitung.html', nach: '/leasingrueckgabe-leipzig', alt: 'Leasingbegleitung' },
  { von: '/privat-geschaeftskunden/leasingbegleitung.html', nach: '/leasingrueckgabe-leipzig', alt: 'Leasingbegleitung' },
  { von: '/fuhrparkservice.html', nach: '/fuhrparkservice-leipzig', alt: 'Fuhrparkservice' },
  { von: '/privat-geschaeftskunden/fuhrparkservice.html', nach: '/fuhrparkservice-leipzig', alt: 'Fuhrparkservice' },
  { von: '/autohaeuser-fuhrparks.html', nach: '/geschaeftskunden', alt: 'Autohäuser & Fuhrparks' },

  // Stellen: alle auf /karriere, bis es eigene Stellenseiten gibt (Vorschlag R19)
  { von: '/jobangebote.html', nach: '/karriere', alt: 'Jobangebote' },
  { von: '/jobangebote/serviceberater.html', nach: '/karriere', alt: 'Serviceberater (m/w/d)' },
  { von: '/jobangebote/karosserie-und-fahrzeugbaumechaniker.html', nach: '/karriere', alt: 'Karosserie / Fahrzeugbaumechaniker' },
  { von: '/jobangebote/fahrzeuglackierer.html', nach: '/karriere', alt: 'Fahrzeuglackierer' },
  { von: '/jobangebote/kfz-aufbereiter.html', nach: '/karriere', alt: 'Kfz-Aufbereiter' },

  // Kontakt und Rechtliches
  { von: '/kontakt.html', nach: '/kontakt', alt: 'Kontakt' },
  { von: '/kontakt/anfahrt.html', nach: '/kontakt', alt: 'Anfahrt' },
  // Auf jeder Altseite verlinkt, antwortet dort aber schon mit 500. Die Regel faengt Lesezeichen und Fremdlinks.
  { von: '/standorte/leipzig.html', nach: '/kontakt', alt: 'Standort Leipzig' },
  { von: '/kontakt/impressum.html', nach: '/impressum', alt: 'Impressum' },
  { von: '/kontakt/datenschutzerklaerung.html', nach: '/datenschutz', alt: 'Datenschutzerklärung' },
  { von: '/datenschutz.html', nach: '/datenschutz', alt: 'Datenschutz' },
  // Eine HTML-Sitemap gibt es nicht mehr; die Navigation uebernimmt.
  { von: '/kontakt/sitemap.html', nach: '/', alt: 'Sitemap' },

  // Dokumente (User 2026-10-16: auf die passende Seite; die EU-Projektbeschreibung bleibt, siehe BEHALTEN)
  { von: '/images/carcare-center/CarCareFlyer_2022.pdf', nach: '/', alt: 'Flyer 2022 (PDF)' },
  { von: '/images/carcare-center/fahrzeugdesinfektion/Fahrzeugdesinfektion_CarCare-Center.pdf', nach: '/innenaufbereitung-leipzig', alt: 'Fahrzeugdesinfektion (PDF)' },
  { von: '/images/carcare-center/felgenreparatur/Zertifikat-Alufelgenaufbereitung.pdf', nach: '/felgenreparatur-leipzig', alt: 'Zertifikat Alufelgenaufbereitung (PDF)' },
  { von: '/images/carcare-center/felgenreparatur/Zertifikat-glanzgedrehte-Felgen.pdf', nach: '/felgenreparatur-leipzig', alt: 'Zertifikat glanzgedrehte Felgen (PDF)' },
  { von: '/images/datenschutz/Datenschutzhinweise_Allg_20200908.pdf', nach: '/datenschutz', alt: 'Datenschutzhinweise 2020 (PDF)' },
];

/** Adressen der Altseite, die die neue Seite unter DEMSELBEN Pfad weiter ausliefert (Datei liegt in `public/`). */
export const BEHALTEN = [
  {
    pfad: '/images/EU_POS.pdf',
    grund:
      'EU-Vorhabensbeschreibung nach Art. 50 VO (EU) 2021/1060 (EFRE-Digitalisierungszuschuss, Schnittstelle fuer ' +
      'DATACAR2), unveraendert von der Altseite uebernommen und im Foerderhinweis der Fusszeile verlinkt (User 2026-10-16).',
  },
];

/** Adressen aus dem Inventar, die bewusst KEINE Regel bekommen. */
export const AUSNAHMEN = [
  {
    pfad: '/index.html',
    grund:
      'Liefert die Startseite schon mit 200 und canonical auf / (gemessen 2026-10-16 auf Vercel). Eine Regel ' +
      '/index.html → / riskiert eine Schleife, weil / intern aus index.html bedient wird.',
  },
];

/** Ablage der Uebergabe-Dateien fuer KUPPER IT, relativ zum Projektwurzelverzeichnis. */
export const UEBERGABE = {
  apache: 'docs/weiterleitungen-altseite/uebergabe/weiterleitungen.htaccess',
  nginx: 'docs/weiterleitungen-altseite/uebergabe/weiterleitungen-nginx.conf',
};

/** `redirects` fuer vercel.json. `statusCode` statt `permanent`: Vercel setzt sonst 308, Google wertet beide gleich,
 *  301 versteht aber jeder Crawler und jede Bibliothek. Beide Felder zugleich lehnt Vercel ab. */
export const fuerVercel = () => WEITERLEITUNGEN.map(({ von, nach }) => ({ source: von, destination: nach, statusCode: STATUS }));

const KOPF = [
  'Weiterleitungen der alten Website auf die neuen Seiten (Backlog R22).',
  'ERZEUGT aus scripts/lib/weiterleitungen.mjs mit `npm run vercel-config`. Nicht von Hand bearbeiten.',
];

const alsRegex = (pfad) => `^${pfad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;

/**
 * 404-SEITE (2026-10-17, Backlog R24): Der Prerender schreibt `dist/404.html`. Vercel liefert sie fuer unbekannte
 * Adressen von selbst aus; Apache und nginx brauchen dafuer je eine Zeile. Sie steht mit in der Uebergabe, weil die
 * Datei beim Umzug sonst nur unter `/404.html` erreichbar waere und der Server wieder seine eigene Fehlerseite zeigt.
 */
const FEHLERSEITE_404 = '/404.html';

/** Apache (mod_alias). `RedirectMatch` mit Anker, weil `Redirect` nach Praefix trifft. In die .htaccess im Web-Root. */
export const fuerApache = () =>
  [
    ...KOPF.map((z) => `# ${z}`),
    '# Apache: in die .htaccess im Web-Root (mod_alias).',
    '',
    `# Eigene 404-Seite fuer unbekannte Adressen (Backlog R24), Status bleibt 404.`,
    `ErrorDocument 404 ${FEHLERSEITE_404}`,
    '',
    ...WEITERLEITUNGEN.map(({ von, nach }) => `RedirectMatch ${STATUS} ${alsRegex(von)} ${nach}`),
    '',
  ].join('\n');

/** nginx, z. B. in Plesk unter „Zusaetzliche nginx-Anweisungen“. `location =` trifft nur den exakten Pfad. */
export const fuerNginx = () =>
  [
    ...KOPF.map((z) => `# ${z}`),
    '# nginx: im server-Block, in Plesk unter „Zusätzliche nginx-Anweisungen“.',
    '',
    `# Eigene 404-Seite fuer unbekannte Adressen (Backlog R24), Status bleibt 404.`,
    `error_page 404 ${FEHLERSEITE_404};`,
    '',
    ...WEITERLEITUNGEN.map(({ von, nach }) => `location = ${von} { return ${STATUS} ${nach}; }`),
    '',
  ].join('\n');
