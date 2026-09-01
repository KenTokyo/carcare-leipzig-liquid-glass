import { OverviewService } from '../types';

/**
 * Single Source of Truth fuer das Leistungsangebot.
 *
 * Gelesen von:
 *  - `components/ServiceGrid.tsx`  → Kachel-Uebersicht auf der Startseite (`#leistungen`)
 *  - `pages/ServicesPage.tsx`      → vollstaendige Leistungsseite (`/leistungen`)
 *
 * WARUM zentral: Bis 2026-08-03 pflegten beide Ansichten eigene Listen. Sie sind
 * auseinandergelaufen — `Autoglas / Scheibenfolien` fehlte auf `/leistungen` komplett,
 * und drei Eintraege zeigten dort auf dieselbe URL wie `Fahrzeugaufbereitung`. Neue
 * Leistungen deshalb ausschliesslich HIER ergaenzen.
 */

/** Eigenes Foto je Kachel; Dateien in /public/assets/kacheln (via `npm run images`). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

export type ServiceGroupId = 'aufbereitung' | 'unfall-lack' | 'rad-glas' | 'gewerbe';

export interface ServiceCatalogEntry extends OverviewService {
  /** Gruppierung auf `/leistungen`. */
  group: ServiceGroupId;
  /**
   * Titel mit Ortsbezug fuer `/leistungen`. Die Kachel auf der Startseite bleibt kurz
   * (`title`), die Leistungsseite nutzt den lokalen Suchbegriff als Ankertext.
   */
  localTitle: string;
  /** Ausfuehrlichere Beschreibung fuer `/leistungen`; Kacheln bleiben bewusst knapp. */
  listDescription: string;
  /**
   * false = erscheint NUR auf `/leistungen`, nicht in der Startseiten-Kachelreihe.
   * Default (undefined) = true.
   */
  inOverviewGrid?: boolean;
}

/**
 * Reihenfolge = Reihenfolge der Kacheln auf der Startseite. Nicht ohne Grund umsortieren;
 * `/leistungen` sortiert ueber `group` und ist davon unabhaengig.
 */
export const serviceCatalog: ServiceCatalogEntry[] = [
  {
    id: 'aufbereitung',
    group: 'aufbereitung',
    title: 'Fahrzeugaufbereitung',
    localTitle: 'Fahrzeugaufbereitung Leipzig',
    description: 'Innen, außen und Lack — Wohlfühlen im Alltag und sichtbarer Werterhalt.',
    listDescription: 'Innen- und Außenaufbereitung, Lackreinigung, Politur und Versiegelung — für den Alltag, für den Werterhalt und für Verkauf oder Leasingrückgabe.',
    iconName: 'Sparkles',
    href: '/fahrzeugaufbereitung-leipzig',
    cta: 'Zur Aufbereitung',
    backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare'),
  },
  {
    id: 'unfall',
    group: 'unfall-lack',
    title: 'Unfallinstandsetzung',
    localTitle: 'Unfallinstandsetzung Leipzig',
    description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.',
    listDescription: 'Schadenaufnahme, Kalkulation, Karosseriearbeiten und Reparaturbegleitung — inklusive Abstimmung mit Versicherung und Gutachter.',
    iconName: 'Wrench',
    href: '/unfallinstandsetzung-leipzig',
    cta: 'Unfall melden',
    backgroundImage: kachel('versicherung-schadenabwicklung-leipzig-carcare'),
  },
  {
    id: 'lackierung',
    group: 'unfall-lack',
    title: 'Neu- und Reparaturlackierung',
    localTitle: 'Neu- und Reparaturlackierung Leipzig',
    description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.',
    listDescription: 'Farbtongenaue Lackierung als Glasurit-Lackpartner — Ziel ist die unsichtbare Reparatur ohne erkennbare Farbton- oder Effektunterschiede.',
    iconName: 'PaintBucket',
    href: '/autolackierung-leipzig',
    cta: 'Zur Lackierung',
    backgroundImage: kachel('autolackierung-leipzig-carcare'),
  },
  {
    id: 'smart',
    group: 'unfall-lack',
    title: 'Smart Repair',
    localTitle: 'Smart Repair Leipzig',
    description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.',
    listDescription: 'Spot-Repair bearbeitet gezielt nur den beschädigten Bereich statt des ganzen Bauteils — die bevorzugte Methode bei kleineren Schäden.',
    iconName: 'ScanLine',
    href: '/smart-repair-leipzig',
    cta: 'Smart Repair ansehen',
    backgroundImage: kachel('smart-repair-leipzig-carcare'),
  },
  {
    id: 'dellen',
    group: 'unfall-lack',
    title: 'Dellenentfernung',
    localTitle: 'Dellenentfernung Leipzig',
    description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.',
    listDescription: 'Lackierfreie Instandsetzung bei Parkplatzdellen und Hagelschäden — von Versicherungen und Gutachtern anerkannt, ohne Wertminderung.',
    iconName: 'Hammer',
    href: '/dellenentfernung-leipzig',
    cta: 'Dellen entfernen',
    backgroundImage: kachel('dellenentfernung-leipzig-carcare'),
  },
  {
    id: 'hagel',
    group: 'unfall-lack',
    title: 'Hagelschadenreparatur',
    localTitle: 'Hagelschadenreparatur Leipzig',
    description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.',
    listDescription: 'Kalkulation über das anerkannte System Audatex und komplette Abwicklung mit Ihrer Versicherung — ohne Anzahlung.',
    iconName: 'CloudHail',
    href: '/hagelschadenreparatur-leipzig',
    cta: 'Hagelschaden prüfen',
    backgroundImage: kachel('hagelschadenreparatur-leipzig'),
  },
  {
    id: 'felgen',
    group: 'rad-glas',
    title: 'Felgenreparatur',
    localTitle: 'Felgenreparatur Leipzig',
    description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.',
    listDescription: 'TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb — Bordstein- und Korrosionsschäden bis 1 mm Tiefe.',
    iconName: 'CircleDot',
    href: '/felgenreparatur-leipzig',
    cta: 'Felgen reparieren',
    backgroundImage: kachel('felgenreparatur-leipzig-carcare'),
  },
  {
    id: 'glas',
    group: 'rad-glas',
    title: 'Autoglas / Scheibenfolien',
    localTitle: 'Autoglas & Scheibenfolien Leipzig',
    description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.',
    listDescription: 'Steinschlagreparatur, Neuverglasung für PKW, LKW und Bus sowie Folierungen aller Art — als WINTEC-Partner mit 30 Jahren Garantie.',
    iconName: 'Glasses',
    href: '/autoglas-leipzig',
    cta: 'Zum Autoglas',
    backgroundImage: kachel('autoglas-scheibenreparatur-leipzig-carcare'),
  },
  {
    id: 'innenaufbereitung',
    group: 'aufbereitung',
    title: 'Innenaufbereitung',
    localTitle: 'Innenaufbereitung Leipzig',
    description: 'Cockpit, Polster oder Leder, Scheiben und Geruchsentfernung.',
    listDescription: 'Intensive Reinigung des gesamten Innenraumes, Polstershampoonierung oder Lederpflege, Scheibenreinigung und auf Wunsch Geruchsentfernung.',
    iconName: 'Sparkles',
    href: '/innenaufbereitung-leipzig',
    cta: 'Innenaufbereitung ansehen',
    backgroundImage: kachel('innenaufbereitung-leipzig-carcare'),
    // Nur auf `/leistungen`, siehe Hinweis beim Eintrag `aussenaufbereitung`.
    inOverviewGrid: false,
  },
  {
    id: 'aussenaufbereitung',
    group: 'aufbereitung',
    title: 'Außenaufbereitung',
    localTitle: 'Außenaufbereitung Leipzig',
    description: 'Außenreinigung, Lackreinigung, Politur und Versiegelung.',
    listDescription: 'Vorreinigung, Felgenreinigung, schonende Oberwäsche und Lackreinigung — auf Wunsch mit Hochglanzpolitur und Lackversiegelung.',
    iconName: 'Sparkles',
    href: '/aussenaufbereitung-leipzig',
    cta: 'Außenaufbereitung ansehen',
    backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare'),
    // Erscheint nur auf `/leistungen`: die Startseite fuehrt die Aufbereitungsbereiche
    // bereits ueber die Aufklapp-Kacheln in `AutoDetailingExpertiseSection`.
    inOverviewGrid: false,
  },
  {
    id: 'leasing',
    group: 'aufbereitung',
    title: 'Leasingrückgabe',
    localTitle: 'Leasingrückgabe Leipzig',
    description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.',
    listDescription: 'Begutachtung und Instandsetzung vor der Rückgabe, um vermeidbare Nachbelastungen durch Gebrauchsspuren zu reduzieren.',
    iconName: 'KeyRound',
    href: '/leasingrueckgabe-leipzig',
    cta: 'Leasing vorbereiten',
    backgroundImage: kachel('leasingrueckgabe-leipzig-carcare'),
  },
  {
    id: 'fuhrpark',
    group: 'gewerbe',
    title: 'Fuhrparkservice',
    localTitle: 'Fuhrparkservice Leipzig',
    description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.',
    listDescription: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf — planbare Abläufe für gewerbliche Flotten.',
    iconName: 'TruckIcon',
    href: '/fuhrparkservice-leipzig',
    cta: 'Fuhrparkservice',
    backgroundImage: kachel('autohaus-fuhrpark-service-leipzig-carcare'),
  },
  {
    id: 'geschaeftskunden',
    group: 'gewerbe',
    title: 'Geschäftskundenbetreuung',
    localTitle: 'Geschäftskundenbetreuung Leipzig',
    description: 'Feste Ansprechpartner für Autohäuser, Fuhrparks und Versicherungen.',
    listDescription: 'Feste Ansprechpartner und strukturierte Abläufe für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen.',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    cta: 'Geschäftskunden ansehen',
    // Kein Kachelmotiv noetig: erscheint nur auf /leistungen, nicht in der Kachelreihe.
    inOverviewGrid: false,
  },
];

export interface ServiceGroup {
  id: ServiceGroupId;
  eyebrow: string;
  title: string;
  /** Anker-Id der Section auf `/leistungen` (fuer Direktverlinkung aus anderen Seiten). */
  anchor: string;
}

/** Reihenfolge der Abschnitte auf `/leistungen`. */
export const serviceGroups: ServiceGroup[] = [
  {
    id: 'aufbereitung',
    anchor: 'aufbereitung',
    eyebrow: 'Fahrzeugaufbereitung & Werterhalt',
    title: 'Pflege, die den Fahrzeugwert sichtbar hält.',
  },
  {
    id: 'unfall-lack',
    anchor: 'unfall-lack',
    eyebrow: 'Unfall, Karosserie & Lack',
    title: 'Von der Schadenaufnahme bis zur fertigen Lackierung.',
  },
  {
    id: 'rad-glas',
    anchor: 'rad-glas',
    eyebrow: 'Rad & Glas',
    title: 'Felgen und Fahrzeugglas im eigenen Haus.',
  },
  {
    id: 'gewerbe',
    anchor: 'gewerbe',
    eyebrow: 'Geschäftskunden & Flotten',
    title: 'Planbare Fahrzeugdienstleistungen für Unternehmen.',
  },
];

/** Kacheln der Startseiten-Uebersicht (`ServiceGrid`). */
export const overviewServices: OverviewService[] = serviceCatalog.filter(
  (service) => service.inOverviewGrid !== false
);

/** Leistungen einer Gruppe, in Katalogreihenfolge. */
export const servicesByGroup = (group: ServiceGroupId): ServiceCatalogEntry[] =>
  serviceCatalog.filter((service) => service.group === group);
