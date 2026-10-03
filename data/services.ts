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

/**
 * „Care" oder „Repair" (Backlog 6.8, Meeting 2026-09-28): Plakette an allem zur Aufbereitung (Care) und an
 * Unfallinstandsetzung und Lackierung (Repair). Felgen und Glas sind Reparaturen und bekommen Repair. Die
 * Geschaeftskunden-Gruppe umfasst beides und traegt deshalb keine — eine Plakette muss eindeutig sein.
 * Abgeleitet aus der Gruppe: Eine neue Leistung bekommt ihre Plakette mit dem Katalogeintrag, ohne zweite Liste.
 */
export type Bereich = 'care' | 'repair';
/**
 * Eine Plakette, mehrere (Leasingrueckgabe: Care und Repair, User 2026-10-03) oder keine. Die Komponente
 * `BereichsPlakette` setzt mehrere nebeneinander, in der Reihenfolge des Slogans („We Care. We Repair.“).
 */
export type BereichsAngabe = Bereich | readonly Bereich[] | null;
const BEREICH_JE_GRUPPE: Record<ServiceGroupId, Bereich | null> = {
  aufbereitung: 'care',
  'unfall-lack': 'repair',
  'rad-glas': 'repair',
  gewerbe: null,
};

export interface ServiceCatalogEntry extends OverviewService {
  /** Gruppierung auf `/leistungen`. */
  group: ServiceGroupId;
  /**
   * Diese Leistung ist die Uebersichtsseite ihrer Gruppe.
   *
   * Gelesen von `data/navigation.ts`: Im Mega-Menue wird die Gruppe zu einer Karte, und
   * diese Karte braucht ein Ziel. Ohne Markierung muesste die Navigation eine zweite
   * Liste fuehren, welche Route zu welcher Gruppe gehoert — genau die Doppelpflege, die
   * dieser Katalog abgeschafft hat.
   *
   * Hoechstens EINE Leistung je Gruppe traegt das Flag. `rad-glas` hat bewusst keine:
   * Felgen und Glas haben keine gemeinsame Uebersichtsseite, die Karte faellt dort auf
   * den Abschnitt in `/leistungen` zurueck.
   */
  groupHub?: boolean;
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
  /**
   * Alternativtext und Masse des Kachelmotivs.
   *
   * WARUM HIER UND NICHT JE SEITE: Dasselbe Foto erscheint auf der Startseiten-Kachel,
   * auf `/leistungen`, in den Leistungskarten mehrerer Seiten und als Seitenhintergrund
   * der Zielseite. Stuenden Alternativtext und Masse je Verwendung dort, muesste ein
   * Motivwechsel an fuenf Stellen nachgezogen werden — und die fuenfte wird vergessen.
   *
   * Die Masse gehoeren dazu, weil sie sich je Datei unterscheiden (1200x896, 1400x1045,
   * 2400x1340). Ein pauschaler Wert waere schlicht falsch.
   */
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /**
   * Eigener Ausschnitt DESSELBEN Fotos fuer den Seitenhintergrund der Zielseite.
   *
   * WARUM ES DAS GIBT (2026-09-21): Der Seitenhintergrund zeigt das Foto nur rechts der Mitte,
   * links liegt der weisse Textschutz. Steht das Motiv im linken Drittel, sieht man dort nur
   * Nebensachen — bei Unfallinstandsetzung ein abgedecktes Auto statt des Schweissers, bei der
   * Lackierung eine graue Flaeche statt der Pistole (gemessen an Bildschirmfotos 1440 × 900).
   * Der Ausschnitt rueckt das Motiv nach rechts. Erzeugt von `npm run fotos` aus demselben
   * Original — die Wiedererkennung zwischen Kachel und Zielseite bleibt. Ohne Angabe gilt
   * `backgroundImage`.
   */
  pageImage?: string;
  /**
   * Video statt Foto auf den Karten dieser Leistung: ID eines Videoplatzes aus `data/videos.ts` (Quelle + Standbild).
   *
   * Seit 2026-10-03 fuer die Neu- und Reparaturlackierung UEBERALL (User: „das Video fuer Neu- und Reparaturlackierung
   * ueberall“): Startseiten-Kachel (`ServiceGrid`) und alle Leistungskarten (`LeistungsKarten`). Bis dahin nur die
   * Startseite (Wunsch vom 2026-09-21, Datenvolumen). Geladen wird es erst, wenn die Karte im Bild ist (`preload="none"`),
   * vorher steht das Standbild. `backgroundImage` bleibt der Rueckfall, falls der Videoplatz einmal leer ist.
   */
  video?: string;
  /**
   * Plaketten abweichend von der Gruppe (Backlog 6.8 ff.). Leasingrueckgabe traegt seit 2026-10-03 Care UND Repair
   * (User): Aufbereitung und Instandsetzung von Gebrauchsspuren. Ohne Angabe gilt die Gruppe (`BEREICH_JE_GRUPPE`).
   */
  bereiche?: readonly Bereich[];
}

/**
 * Reihenfolge = Reihenfolge der Kacheln auf der Startseite. Nicht ohne Grund umsortieren;
 * `/leistungen` sortiert ueber `group` und ist davon unabhaengig.
 */
export const serviceCatalog: ServiceCatalogEntry[] = [
  {
    id: 'aufbereitung',
    group: 'aufbereitung',
    groupHub: true,
    title: 'Fahrzeugaufbereitung',
    localTitle: 'Fahrzeugaufbereitung Leipzig',
    description: 'Innen, Außen und Lack. Wohlfühlen im Alltag und sichtbarer Werterhalt.',
    listDescription: 'Innen- und Außenaufbereitung, Politur und Versiegelung, für den Alltag, für den Werterhalt und für Verkauf oder Leasingrückgabe.',
    iconName: 'Sparkles',
    href: '/fahrzeugaufbereitung-leipzig',
    cta: 'Zur Aufbereitung',
    backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare'),
    imageAlt: 'Fahrzeug nach der Aufbereitung im CarCare Center Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
  },
  {
    id: 'unfall',
    group: 'unfall-lack',
    groupHub: true,
    title: 'Unfallinstandsetzung',
    localTitle: 'Unfallinstandsetzung Leipzig',
    description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.',
    listDescription: 'Schadenaufnahme, Kalkulation, Karosserie- und Lackierarbeiten sowie Reparaturbegleitung, inklusive Abstimmung mit Versicherung und Gutachter.', // Backlog 2.17
    iconName: 'Wrench',
    href: '/unfallinstandsetzung-leipzig',
    cta: 'Unfall melden',
    // Seit 2026-09-21 echtes Foto (Backlog 2.16: das alte Motiv wirkte wie Schadenaufnahme,
    // nicht wie Instandsetzung). Das alte Bild bleibt als Datei im Bestand, siehe motive.json.
    backgroundImage: kachel('unfallinstandsetzung-leipzig-carcare'),
    imageAlt: 'Karosseriebauer schweißt an der Dachsäule eines abgeklebten Unfallfahrzeugs, Unfallinstandsetzung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    pageImage: kachel('unfallinstandsetzung-hintergrund-leipzig-carcare'),
  },
  {
    id: 'lackierung',
    group: 'unfall-lack',
    title: 'Neu- und Reparaturlackierung',
    localTitle: 'Neu- und Reparaturlackierung Leipzig',
    description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.',
    listDescription: 'Farbtongenaue Lackierung als Glasurit-Lackpartner. Ziel ist die unsichtbare Reparatur ohne erkennbare Farbton- oder Effektunterschiede.',
    iconName: 'PaintBucket',
    href: '/autolackierung-leipzig',
    cta: 'Zur Lackierung',
    // Seit 2026-09-21 echtes Foto (Backlog 3.26). Seit 2026-10-03 zeigen ALLE Karten der Leistung das Lackiervideo
    // (`video`), das Foto bleibt Rueckfall. Dasselbe Foto ist seitdem das Motiv von Smart Repair (eigene Datei).
    backgroundImage: kachel('autolackierung-leipzig-carcare'),
    video: 'startseite-lackierung',
    imageAlt: 'Lackierer trägt mit der Lackierpistole Lack auf einen abgeklebten Stoßfänger auf, Reparaturlackierung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    // Seit 2026-09-28 (6.12) zeigt die Seite stattdessen das Lackiervideo als Hintergrund
    // (`hintergrundVideo` in pages/AutolackierungPage.tsx). Das Foto bleibt als Rueckfall stehen,
    // falls der Videoplatz einmal entfaellt — ohne Eintrag hier stuende dann das Kachelfoto mit
    // der Pistole im linken Drittel unter dem Textschutz.
    pageImage: kachel('autolackierung-hintergrund-leipzig-carcare'),
  },
  {
    id: 'smart',
    group: 'unfall-lack',
    title: 'Smart Repair',
    localTitle: 'Smart Repair Leipzig',
    description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.',
    listDescription: 'Spot-Repair bearbeitet gezielt nur den beschädigten Bereich statt des ganzen Bauteils, die bevorzugte Methode bei kleineren Schäden.',
    iconName: 'ScanLine',
    href: '/smart-repair-leipzig',
    cta: 'Smart Repair ansehen',
    // Seit 2026-10-03 das Lackierfoto (User: „das aktuelle Standfoto von Neu und Reparaturlackierung ueberall bei Smart
    // Repair“), eigener Dateiname aus `npm run fotos`. Das fruehere Motiv liegt in `docs/bilder/archiv/`.
    backgroundImage: kachel('smart-repair-leipzig-carcare'),
    imageAlt: 'Lackierer trägt mit der Lackierpistole Lack auf einen abgeklebten Stoßfänger auf, Smart Repair im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    // Die Pistole steht im linken Drittel; der Seitenhintergrund zeigt nur rechts der Mitte (wie bei der Lackierseite).
    pageImage: kachel('smart-repair-hintergrund-leipzig-carcare'),
  },
  {
    id: 'dellen',
    group: 'unfall-lack',
    title: 'Dellenentfernung',
    localTitle: 'Dellenentfernung Leipzig',
    description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.',
    listDescription: 'Lackierfreie Instandsetzung bei Parkplatzdellen und Hagelschäden, von Versicherungen und Gutachtern anerkannt, ohne Wertminderung.',
    iconName: 'Hammer',
    href: '/dellenentfernung-leipzig',
    cta: 'Dellen entfernen',
    // Seit 2026-10-03 neues echtes Foto (User, Backlog 5.10): Leuchtschirm macht die Delle neben der Heckleuchte sichtbar.
    // Vorher (2026-09-21) das Ausbeulen an der A-Saeule — diese Szene zeigt jetzt die Hagelschadenreparatur.
    backgroundImage: kachel('dellenentfernung-leipzig-carcare'),
    imageAlt: 'Leuchtschirm über dem Heck eines weißen Porsche macht eine Delle neben der Heckleuchte sichtbar, Dellenentfernung im CarCare Center Leipzig',
    imageWidth: 1600,
    imageHeight: 1200,
  },
  {
    id: 'hagel',
    group: 'unfall-lack',
    title: 'Hagelschadenreparatur',
    localTitle: 'Hagelschadenreparatur Leipzig',
    description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.',
    listDescription: 'Kalkulation über das anerkannte System Audatex und komplette Abwicklung mit Ihrer Versicherung, ohne Anzahlung.',
    iconName: 'CloudHail',
    href: '/hagelschadenreparatur-leipzig',
    cta: 'Hagelschaden prüfen',
    // Seit 2026-10-03 echtes Foto (User, Backlog 5.7); das fruehere, mit KI aufgewertete Motiv ist ganz raus (archiviert).
    backgroundImage: kachel('hagelschadenreparatur-leipzig-carcare'),
    imageAlt: 'Techniker zieht unter dem Leuchtschirm mit Gleithammer und Klebepad eine Delle an der Dachsäule heraus, Hagelschadenreparatur im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
  },
  {
    id: 'felgen',
    group: 'rad-glas',
    title: 'Felgenreparatur',
    localTitle: 'Felgenreparatur Leipzig',
    description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.',
    listDescription: 'TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb. Bordstein- und Korrosionsschäden bis 1 mm Tiefe.',
    iconName: 'CircleDot',
    href: '/felgenreparatur-leipzig',
    cta: 'Felgen reparieren',
    backgroundImage: kachel('felgenreparatur-leipzig-carcare'),
    imageAlt: 'Aufbereitete Alufelge nach der Felgenreparatur im CarCare Center Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
  },
  {
    id: 'glas',
    group: 'rad-glas',
    title: 'Autoglas / Scheibenfolien',
    localTitle: 'Autoglas & Scheibenfolien Leipzig',
    description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.',
    listDescription: 'Steinschlagreparatur, Neuverglasung für PKW, LKW und Bus sowie Folierungen aller Art, als WINTEC-Partner mit 30 Jahren Garantie.',
    iconName: 'Glasses',
    href: '/autoglas-leipzig',
    cta: 'Zum Autoglas',
    backgroundImage: kachel('autoglas-scheibenreparatur-leipzig-carcare'),
    imageAlt: 'Scheibentausch an einem Fahrzeug im CarCare Center Leipzig',
    imageWidth: 1200,
    imageHeight: 896,
  },
  {
    id: 'innenaufbereitung',
    group: 'aufbereitung',
    title: 'Innenaufbereitung',
    localTitle: 'Innenaufbereitung Leipzig',
    description: 'Cockpit, Polster oder Leder, Scheiben und Geruchsentfernung.',
    listDescription: 'Intensive Reinigung des gesamten Innenraumes, Polstershampoonierung oder Lederpflege, Teppichreinigung, Scheibenreinigung und auf Wunsch Geruchsentfernung.',
    iconName: 'Sparkles',
    href: '/innenaufbereitung-leipzig',
    cta: 'Innenaufbereitung ansehen',
    // Seit 2026-09-21 echtes Foto eines exklusiven Fahrzeugs (Backlog 2.15/3.29).
    backgroundImage: kachel('innenaufbereitung-leipzig-carcare'),
    imageAlt: 'Mitarbeiter reinigt mit dem Detailpinsel die Mittelkonsole eines Sportwagens, Innenaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    // Nur auf `/leistungen`, siehe Hinweis beim Eintrag `aussenaufbereitung`.
    inOverviewGrid: false,
  },
  {
    id: 'aussenaufbereitung',
    group: 'aufbereitung',
    title: 'Außenaufbereitung',
    localTitle: 'Außenaufbereitung Leipzig',
    description: 'Außenreinigung, Politur und Versiegelung.',
    listDescription: 'Vorreinigung, Felgenreinigung und schonende Handoberwäsche, dazu Hochglanzpolitur und Lackversiegelung.',
    iconName: 'Sparkles',
    href: '/aussenaufbereitung-leipzig',
    cta: 'Außenaufbereitung ansehen',
    // Seit 2026-09-21 eigenes, echtes Motiv statt der Leihgabe von `fahrzeugaufbereitung-…` (R2) —
    // dasselbe Foto wie `aufbereitungKacheln.aussen` in data/detailing.ts.
    backgroundImage: kachel('lackaufbereitung-leipzig-carcare'),
    imageAlt: 'Mitarbeiterin poliert mit der Poliermaschine den Kotflügel eines dunkelblauen SUV, Außen- und Lackaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
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
    // User 2026-10-03: Care UND Repair, ueberall wo die Leasingrueckgabe steht (Karten, Seitenkopf, Startseite).
    bereiche: ['care', 'repair'],
    backgroundImage: kachel('leasingrueckgabe-leipzig-carcare'),
    imageAlt: 'Fahrzeug in Vorbereitung auf die Leasingrückgabe im CarCare Center Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
  },
  {
    id: 'fuhrpark',
    group: 'gewerbe',
    title: 'Fuhrparkservice',
    localTitle: 'Fuhrparkservice Leipzig',
    description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.',
    listDescription: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf, planbare Abläufe für gewerbliche Flotten.',
    iconName: 'TruckIcon',
    href: '/fuhrparkservice-leipzig',
    cta: 'Fuhrparkservice',
    backgroundImage: kachel('autohaus-fuhrpark-service-leipzig-carcare'),
    imageAlt: 'Firmenfahrzeuge im Fuhrparkservice des CarCare Center Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
  },
  {
    id: 'geschaeftskunden',
    group: 'gewerbe',
    groupHub: true,
    title: 'Geschäftskundenbetreuung',
    localTitle: 'Geschäftskundenbetreuung Leipzig',
    description: 'Feste Ansprechpartner für Autohäuser, Fuhrparks und Versicherungen.',
    listDescription: 'Feste Ansprechpartner und strukturierte Abläufe für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen.',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    cta: 'Geschäftskunden ansehen',
    // Erscheint nur auf /leistungen, nicht in der Kachelreihe. Seit 2026-09-27 MIT Motiv (Backlog 5.44):
    // `/leistungen` zeigt jetzt Bildkarten wie die uebrigen Seiten — ohne Motiv waere diese die einzige
    // Karte ohne Foto. Dasselbe Motiv wie der Seitenhintergrund von `/geschaeftskunden`, wo es auf
    // Wunsch von André bleibt (Meeting 2026-09-25, 5.14).
    backgroundImage: kachel('autohaeuser-und-fuhrparks-leipzig-carcare'),
    imageAlt: 'Grüner Porsche Cayenne auf unserem Autotransporter vor der Werkstatthalle, Service für Autohäuser und Fuhrparks',
    imageWidth: 2000,
    imageHeight: 1500,
    inOverviewGrid: false,
  },
];

export interface ServiceGroup {
  id: ServiceGroupId;
  eyebrow: string;
  title: string;
  /** Anker-Id der Section auf `/leistungen` (fuer Direktverlinkung aus anderen Seiten). */
  anchor: string;
  /**
   * Kurzform fuer die Navigation. `eyebrow` und `title` sind fuer eine Seitensektion
   * geschrieben und in einer Menuekarte zu lang — „Fahrzeugaufbereitung & Werterhalt"
   * bricht dort um. Der Menuetext steht deshalb eigenstaendig hier und nicht als
   * gekuerzte Ableitung: Kuerzen per Code wuerde bei der naechsten Gruppe raten.
   */
  navLabel: string;
  navDescription: string;
  /** Lucide-Iconname, aufgeloest in `data/navigation.ts`. */
  navIconName: string;
}

/** Reihenfolge der Abschnitte auf `/leistungen`. */
export const serviceGroups: ServiceGroup[] = [
  {
    id: 'aufbereitung',
    anchor: 'aufbereitung',
    navLabel: 'Fahrzeugaufbereitung',
    navDescription: 'Innen, Außen, Lack & Werterhalt',
    navIconName: 'Sparkles',
    eyebrow: 'Fahrzeugaufbereitung & Werterhalt',
    title: 'Pflege, die den Fahrzeugwert sichtbar hält.',
  },
  {
    id: 'unfall-lack',
    anchor: 'unfall-lack',
    navLabel: 'Unfall & Lack',
    navDescription: 'Karosserie, Lackierung & Smart Repair',
    navIconName: 'Wrench',
    eyebrow: 'Unfall, Karosserie & Lack',
    title: 'Von der Schadenaufnahme bis zur fertigen Lackierung.',
  },
  {
    id: 'rad-glas',
    anchor: 'rad-glas',
    navLabel: 'Rad & Glas',
    navDescription: 'Felgen und Fahrzeugglas im eigenen Haus',
    navIconName: 'CircleDot',
    eyebrow: 'Rad & Glas',
    title: 'Felgen und Fahrzeugglas im eigenen Haus.',
  },
  {
    id: 'gewerbe',
    anchor: 'gewerbe',
    navLabel: 'Geschäftskunden',
    navDescription: 'Fuhrpark & Autohaus-Lösungen',
    navIconName: 'Building2',
    eyebrow: 'Geschäftskunden & Flotten',
    title: 'Planbare Fahrzeugdienstleistungen für Unternehmen.',
  },
];

/**
 * Kacheln der Startseiten-Uebersicht (`ServiceGrid`). Seit 2026-09-28 als Katalogeintraege typisiert statt als
 * `OverviewService`: `ServiceGrid` braucht die Gruppe fuer die Care/Repair-Plakette (6.8).
 */
export const overviewServices: ServiceCatalogEntry[] = serviceCatalog.filter(
  (service) => service.inOverviewGrid !== false
);

/** Leistungen einer Gruppe, in Katalogreihenfolge. */
export const servicesByGroup = (group: ServiceGroupId): ServiceCatalogEntry[] =>
  serviceCatalog.filter((service) => service.group === group);

/**
 * Katalogeintrag zu einer Route.
 *
 * Gelesen von `components/ServiceLayout.tsx`: Die Leistungs-Unterseiten beziehen ihren
 * Seitenhintergrund aus dem Kachelmotiv ihres eigenen Katalogeintrags. Damit zeigen
 * Uebersichtskachel und Zielseite zwangslaeufig dasselbe Foto, ohne dass die Zuordnung
 * ein zweites Mal gepflegt wird.
 */
export const serviceByHref = (href: string): ServiceCatalogEntry | undefined =>
  serviceCatalog.find((service) => service.href === href);

/**
 * Plakette(n) eines Katalogeintrags (Backlog 6.8): eigene `bereiche` (Leasingrueckgabe: Care und Repair), sonst die
 * Gruppe, `null` fuer die Geschaeftskunden-Gruppe.
 */
export const bereichDesEintrags = (eintrag: ServiceCatalogEntry): BereichsAngabe =>
  eintrag.bereiche ?? BEREICH_JE_GRUPPE[eintrag.group];

/**
 * Care oder Repair fuer einen Link oder eine Route (Backlog 6.8). Anker werden abgeschnitten
 * (`/fahrzeugaufbereitung-leipzig#preise`). Seiten ohne Katalogeintrag bekommen keine Plakette.
 */
export const bereichVon = (href?: string | null): BereichsAngabe => {
  if (!href) return null;
  const eintrag = serviceByHref(href.split('#')[0]);
  return eintrag ? bereichDesEintrags(eintrag) : null;
};
