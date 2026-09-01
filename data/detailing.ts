import { PriceItem } from '../components/PageBlocks';

/**
 * Inhalte des Aufbereitungs-Strangs (`/fahrzeugaufbereitung-leipzig`).
 *
 * Ausgelagert, damit die Hub-Seite eine reine Komposition bleibt und die 700-Zeilen-Regen
 * aus CLAUDE.md nicht reisst. Die Preise sind Bestandsdaten des Betriebs — unveraendert
 * uebernommen und zusaetzlich als `Offer`-Schema ausgezeichnet (siehe `seo/pageSchemas.ts`).
 */

/** Pflegepakete inkl. Preis. Reihenfolge = aufsteigender Leistungsumfang. */
export const carePackages: PriceItem[] = [
  {
    id: 'p1',
    title: 'Brillant Außenpflege',
    price: '169,00 €',
    description:
      'Intensive Vorreinigung, Felgenreinigung, Insektenentfernung, schonende Oberwäsche inkl. Abledern, Scheibenreinigung, Lackreinigung, Hochglanzpolitur und Lackversiegelung.',
  },
  {
    id: 'p2',
    title: 'Intensiv Innenreinigung',
    price: '199,00 €',
    description:
      'Oberwäsche inkl. Abledern, intensive Reinigung des gesamten Innenraumes, Polstershampoonierung – alternativ Lederpflege – sowie Scheibenreinigung innen und außen.',
  },
  {
    id: 'p3',
    title: 'Premiumpflege',
    price: '299,00 €',
    description:
      'Brillant- und Intensivpflege kombiniert, inklusive Motorreinigung und Versiegelung. Fahrzeuge mit extremen Verschmutzungen (z. B. Tierhaare) bedürfen einer gesonderten Absprache.',
  },
  {
    id: 'p4',
    title: 'Premiumpflege „exklusiv“',
    price: 'ab 348,00 €',
    description:
      'Aufbereitung in liebevoller Handarbeit mit ausgesuchten Produktlinien – u. a. Wachse von SWIZÖL mit Carnaubaanteilen von 30 bis 60 %. Je höher der Anteil, desto höher der Glanzgrad Ihres Lackes.',
  },
];

/** Desinfektions- und Hygieneleistungen inkl. Preis. */
export const disinfectionServices: PriceItem[] = [
  {
    id: 'd1',
    title: 'Ozonbehandlung',
    price: '45,00 €',
    description:
      'Ozon ist eines der stärksten Desinfektionsmittel und verteilt sich als Gas gleichmäßig bis in unzugängliche Bereiche. Es zerstört zuverlässig die Zellwände von Mikroorganismen. Ca. 30 Minuten Einwirkzeit, danach etwa 30 Minuten sorgfältiges Ablüften.',
  },
  {
    id: 'd2',
    title: 'Heißvernebelung (KC-Refresher)',
    price: '59,00 €',
    description:
      'Der KC-Refresher bekämpft Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Die Wirksamkeit gegenüber Bakterien und Schimmel wurde vom Institut für Biochemie der Universität Mannheim bestätigt.',
  },
];

/**
 * Maschinenlesbare Fassung der Preise fuer `offerCatalogSchema`.
 * `from: true` = „ab"-Preis, wird als `PriceSpecification.minPrice` ausgezeichnet.
 */
export const priceOffers = [
  { name: 'Brillant Außenpflege', price: '169.00', description: 'Außenaufbereitung mit Lackreinigung, Hochglanzpolitur und Lackversiegelung.' },
  { name: 'Intensiv Innenreinigung', price: '199.00', description: 'Intensive Innenraumreinigung mit Polstershampoonierung oder Lederpflege.' },
  { name: 'Premiumpflege', price: '299.00', description: 'Brillant- und Intensivpflege kombiniert, inklusive Motorreinigung und Versiegelung.' },
  { name: 'Premiumpflege „exklusiv“', price: '348.00', from: true, description: 'Handarbeit mit SWIZÖL-Wachsen, Carnaubaanteil 30 bis 60 %.' },
  { name: 'Ozonbehandlung', price: '45.00', description: 'Innenraum-Desinfektion mit Ozon, ca. 30 Minuten Einwirkzeit.' },
  { name: 'Heißvernebelung (KC-Refresher)', price: '59.00', description: 'Lang anhaltende Innenraum-Desinfektion gegen Bakterien, behüllte Viren und Schimmelpilze.' },
];

export interface DetailingScope {
  /**
   * Anker-Ziel auf `/fahrzeugaufbereitung-leipzig`. Die gleichnamigen Kacheln der
   * Startseiten-Sektion „Autoaufbereitung" springen hierher, statt wie frueher in den
   * Wissensbereich abzubiegen (Auftrag User 2026-08-09).
   */
  id: string;
  title: string;
  intro: string;
  /** Konkrete Arbeitsschritte — bewusst Aufzaehlung, damit KI sie passagenweise zitieren kann. */
  items: string[];
  /**
   * DASSELBE Motiv wie auf der zugehoerigen Startseiten-Kachel. Der Wiedererkennungswert
   * ist der Punkt: Wer auf das Innenraum-Foto klickt, landet auf dem Innenraum-Foto.
   */
  image: string;
  imageAlt: string;
  /** Reale Dateimasse — gegen Layout-Shift (SEO-GEO-STANDARDS.md §2.2 / CLS < 0,1). */
  imageWidth: number;
  imageHeight: number;
  /** Weiterfuehrender Ratgeber im Wissens-Cluster. */
  href: string;
  hrefLabel: string;
}

/**
 * Die drei Aufbereitungsbereiche als eigenstaendig verstaendliche Bloecke
 * (Antwort-zuerst-Prinzip, SEO-GEO-STANDARDS.md §4.3).
 */
export const detailingScopes: DetailingScope[] = [
  {
    id: 'innenaufbereitung',
    image: '/assets/kacheln/innenaufbereitung-leipzig-carcare.webp',
    imageAlt: 'Gereinigter Fahrzeuginnenraum mit Cockpit und Polstern nach der Innenaufbereitung bei CarCare Leipzig',
    imageWidth: 2400,
    imageHeight: 1340,
    title: 'Innenaufbereitung',
    intro:
      'Die Innenaufbereitung reinigt und pflegt den kompletten Fahrzeuginnenraum – vom Cockpit über Polster und Leder bis in die Bereiche, die bei der normalen Wäsche ausgelassen werden.',
    items: [
      'Intensive Reinigung des gesamten Innenraumes inklusive Cockpit und Oberflächen',
      'Polstershampoonierung – alternativ materialgerechte Lederpflege',
      'Scheibenreinigung innen und außen',
      'Geruchsentfernung und Behandlung belasteter Innenraumluft',
      'Auf Wunsch Motorreinigung im Rahmen der Premiumpflege',
    ],
    href: '/autoaufbereitung-wissen/innenaufbereitung',
    hrefLabel: 'Ratgeber Innenaufbereitung',
  },
  {
    id: 'aussenaufbereitung',
    image: '/assets/kacheln/smart-repair-leipzig-carcare.webp',
    imageAlt: 'Fahrzeugaußenseite mit aufbereitetem Lack nach der Außenaufbereitung bei CarCare Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
    title: 'Außenaufbereitung',
    intro:
      'Die Außenaufbereitung entfernt Verschmutzungen, die eine gewöhnliche Wäsche stehen lässt, und bereitet den Lack auf Politur und Versiegelung vor.',
    items: [
      'Intensive Vorreinigung und Felgenreinigung',
      'Insektenentfernung',
      'Schonende Oberwäsche inklusive Abledern',
      'Lackreinigung als Grundlage für die weitere Bearbeitung',
      'Scheibenreinigung',
    ],
    href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung',
    hrefLabel: 'Ratgeber Autoaufbereitung',
  },
  {
    id: 'lackaufbereitung',
    image: '/assets/kacheln/fahrzeugaufbereitung-leipzig-carcare.webp',
    imageAlt: 'Polierte und versiegelte Lackoberfläche nach der Lackaufbereitung bei CarCare Leipzig',
    imageWidth: 1400,
    imageHeight: 1045,
    title: 'Lackaufbereitung',
    intro:
      'Die Lackaufbereitung arbeitet die Lackoberfläche selbst auf: Sie entfernt Anhaftungen und matte Stellen, holt Glanz zurück und schützt das Ergebnis anschließend.',
    items: [
      'Lackreinigung und Entfernung typischer Anhaftungen',
      'Hochglanzpolitur für glattere Oberflächen und sichtbaren Glanz',
      'Lackversiegelung für Schutz und Werterhalt',
      'Auf Wunsch Wachse von SWIZÖL mit 30 bis 60 % Carnaubaanteil',
    ],
    href: '/autoaufbereitung-wissen/lackaufbereitung',
    hrefLabel: 'Ratgeber Lackaufbereitung',
  },
];

/**
 * Ablauf der Aufbereitung — wortgleich zu den Prozesskarten der Startseite
 * (`components/DetailingProcessSection.tsx`, mit der Geschaeftsfuehrung abgestimmt).
 * Bewusst dieselbe Formulierung: Mainpage und Hub duerfen den Ablauf nicht
 * unterschiedlich beschreiben.
 */
export const detailingSteps = [
  { title: 'Leistung auswählen', description: 'Passendes Paket oder individuelle Aufbereitung wählen.' },
  { title: 'Termin anfragen', description: 'Wunschtermin online oder telefonisch übermitteln.' },
  { title: 'Fahrzeug abgeben', description: 'Persönliche Übergabe mit kurzer Beratung vor Ort.' },
  { title: 'Professionelle Aufbereitung', description: 'Innen, außen, Lack und Details nach unserem Standard.' },
  { title: 'Gepflegt zurückerhalten', description: 'Sichtbar aufgewertet und bereit für Alltag oder Rückgabe.' },
];
