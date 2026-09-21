import type { PriceItem } from '../components/PageBlocks';

/**
 * Inhalte des Aufbereitungs-Strangs (`/fahrzeugaufbereitung-leipzig`).
 *
 * Ausgelagert, damit die Hub-Seite eine reine Komposition bleibt und die 700-Zeilen-Regen
 * aus CLAUDE.md nicht reisst. Die Preise sind Bestandsdaten des Betriebs — unveraendert
 * uebernommen und zusaetzlich als `Offer`-Schema ausgezeichnet (siehe `seo/pageSchemas.ts`).
 */

/**
 * Aufpreise nach Fahrzeugklasse (Backlog 4.7, Entscheidung 2026-09-16: als Fussnote).
 *
 * EINE QUELLE fuer alle Stellen, die einen Paketpreis nennen: Fussnote unter den Paketen,
 * Preis-FAQ, Schema-Beschreibung und die Preisangaben auf Innen- und Aussenseite. Wer die
 * Prozentsaetze aendert, aendert sie hier. Die Stellen, die den Satz als Fliesstext
 * einbauen, lesen ihn von hier — keine zweite Schreibweise.
 */
export const AUFPREIS_SATZ =
  'Für Geländewagen und Großraumlimousinen kommt ein Aufpreis von 20 % hinzu, für Transporter von 50 %.';

/** Pflegepakete inkl. Preis. Reihenfolge = aufsteigender Leistungsumfang. */
export const carePackages: PriceItem[] = [
  {
    id: 'p1',
    title: 'Brillant Außenpflege',
    price: '169,00 €',
    fussnote: true,
    leistung: 'aussen',
    // Backlog 2.10: Der zweite Satz trennt zwei Dinge, die sonst verwechselt werden —
    // die im Paket enthaltene Lackversiegelung und die separat buchbare
    // Keramikversiegelung. Das Paket ist deren Voraussetzung, nicht deren Ersatz.
    // Backlog 4.5: „schonende Handoberwäsche" statt „Oberwäsche inkl. Abledern" — Wortlaut des Kunden.
    // Backlog 4.3 (2026-09-16): „Lackreinigung" entfaellt insgesamt, Entscheidung des Kunden.
    description:
      'Intensive Vorreinigung, Felgenreinigung, Insektenentfernung, schonende Handoberwäsche, Scheibenreinigung, Hochglanzpolitur und Lackversiegelung. Dieses Paket ist zugleich die Voraussetzung für eine Keramikversiegelung: Der Lack muss vorher gereinigt und poliert sein. Die Keramikversiegelung selbst ist nicht enthalten und wird zusätzlich beauftragt.',
  },
  {
    id: 'p2',
    // Backlog 4.21: Programmname des Kunden. Bis 2026-09-16 stand hier „Intensiv Innenreinigung".
    title: 'Intensiv Innenraumreinigung',
    price: '199,00 €',
    fussnote: true,
    leistung: 'innen',
    // Backlog 4.6: Teppichreinigung ergaenzt, „Schonende Oberwaesche" statt „inkl. Abledern".
    // Die Polstershampoonierung stand schon drin — als Alternative zur Lederpflege, und
    // so bleibt sie: Stoff wird shampooniert, Leder gepflegt. Die Teppiche gelten fuer beide.
    description:
      'Schonende Oberwäsche, intensive Reinigung des gesamten Innenraumes, Polstershampoonierung – alternativ Lederpflege –, Teppichreinigung sowie Scheibenreinigung innen und außen.',
  },
  {
    id: 'p3',
    title: 'Premiumpflege',
    price: '299,00 €',
    fussnote: true,
    leistung: 'komplett',
    description:
      'Brillant Außenpflege und Intensiv Innenraumreinigung kombiniert, inklusive Motorreinigung und Versiegelung. Fahrzeuge mit extremen Verschmutzungen (z. B. Tierhaare) bedürfen einer gesonderten Absprache.',
  },
  {
    id: 'p4',
    title: 'Premiumpflege „exklusiv“',
    // Backlog 4.4 + 4.10 (2026-09-16): kein Festpreis mehr. Bis dahin „ab 348,00 €" — an fuenf
    // Stellen gemeinsam umgestellt: hier, `priceOffers`, Preis-Einleitung, zwei FAQ.
    price: 'Preis nach Absprache',
    leistung: 'exklusiv',
    // Backlog 2.9: Der Zusatz „Aussen UND Innen" ist ausdruecklich ergaenzt. Ohne ihn
    // las sich das Paket wie eine reine Lackbehandlung — die Nennung von Wachs,
    // Carnauba und Glanzgrad zieht den Blick nach aussen. Es umfasst beides.
    description:
      'Aufbereitung von außen und innen in liebevoller Handarbeit mit ausgesuchten Produktlinien – u. a. Wachse von Swissvax mit Carnaubaanteilen von 30 bis 60 %. Je höher der Anteil, desto höher der Glanzgrad Ihres Lackes. Der Innenraum wird dabei ebenso behandelt wie der Lack. Den Preis stimmen wir nach Aufwand persönlich mit Ihnen ab.',
  },
  {
    // Backlog 4.9 (2026-09-16): Die Lackaufbereitung steht jetzt BEI den Paketen, mit
    // „Preis nach Aufwand" — ausdruecklich ohne Stundenverrechnungssatz (Kunde). Sie ist
    // kein fuenftes Paket in der aufbauenden Reihe, deshalb ueber die volle Breite.
    id: 'p5',
    title: 'Lackaufbereitung',
    price: 'Preis nach Aufwand',
    breit: true,
    leistung: 'lack',
    anfrageLabel: 'Lackaufbereitung anfragen',
    description:
      'Hochglanzpolitur und Lackversiegelung, abgestimmt auf den Zustand Ihres Lackes — auf Wunsch mit Swissvax-Wachsen. Wie viel Arbeit nötig ist, zeigt erst die Begutachtung; danach nennen wir Ihnen den Preis.',
  },
];

/** Desinfektions- und Hygieneleistungen inkl. Preis. */
export const disinfectionServices: PriceItem[] = [
  {
    id: 'd1',
    title: 'Ozonbehandlung',
    price: '45,00 €',
    // Keine passende Formularoption — bewusst KEINE Vorauswahl statt einer falschen.
    leistung: '',
    description:
      'Ozon ist eines der stärksten Desinfektionsmittel und verteilt sich als Gas gleichmäßig bis in unzugängliche Bereiche. Es zerstört zuverlässig die Zellwände von Mikroorganismen. Ca. 30 Minuten Einwirkzeit, danach etwa 30 Minuten sorgfältiges Ablüften.',
  },
  {
    id: 'd2',
    title: 'Heißvernebelung (KC-Refresher)',
    price: '59,00 €',
    leistung: '',
    description:
      'Der KC-Refresher bekämpft Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Die Wirksamkeit gegenüber Bakterien und Schimmel wurde vom Institut für Biochemie der Universität Mannheim bestätigt.',
  },
];

/**
 * Maschinenlesbare Fassung der Preise fuer `offerCatalogSchema`.
 * `from: true` = „ab"-Preis, wird als `PriceSpecification.minPrice` ausgezeichnet.
 */
export const priceOffers = [
  { name: 'Brillant Außenpflege', price: '169.00', description: `Außenaufbereitung mit Handoberwäsche, Hochglanzpolitur und Lackversiegelung. ${AUFPREIS_SATZ}` },
  { name: 'Intensiv Innenraumreinigung', price: '199.00', description: `Intensive Innenraumreinigung mit Polstershampoonierung oder Lederpflege sowie Teppichreinigung. ${AUFPREIS_SATZ}` },
  { name: 'Premiumpflege', price: '299.00', description: `Brillant Außenpflege und Intensiv Innenraumreinigung kombiniert, inklusive Motorreinigung und Versiegelung. ${AUFPREIS_SATZ}` },
  // Backlog 2.9 / 4.4: ohne `price` — Preis nach Absprache, im Schema daher keine Preisfelder.
  { name: 'Premiumpflege „exklusiv“', description: 'Aufbereitung außen und innen in Handarbeit, mit Swissvax-Wachsen, Carnaubaanteil 30 bis 60 %. Preis nach Absprache.' },
  // Backlog 4.9: sichtbar bei den Paketen, deshalb auch hier — ebenfalls ohne Preis.
  { name: 'Lackaufbereitung', description: 'Hochglanzpolitur und Lackversiegelung nach Zustand des Lackes. Preis nach Aufwand.' },
  { name: 'Ozonbehandlung', price: '45.00', description: 'Innenraum-Desinfektion mit Ozon, ca. 30 Minuten Einwirkzeit.' },
  { name: 'Heißvernebelung (KC-Refresher)', price: '59.00', description: 'Lang anhaltende Innenraum-Desinfektion gegen Bakterien, behüllte Viren und Schimmelpilze.' },
];

/**
 * EINZIGE QUELLE der Motive im Aufbereitungs-Kontext.
 *
 * Bis 2026-09-02 lagen die Bildpfade doppelt: hier in `detailingScopes` und in
 * `components/AutoDetailingExpertiseSection.tsx` in `expertiseCards`. Wer nur eine
 * Stelle drehte, bekam auf Startseiten-Kachel und Subseiten-Karte verschiedene
 * Motive — dasselbe Muster wie bei den FAQ vor dem Single-Source-Umbau.
 *
 * ZUORDNUNG NACH DER ROCHADE (Backlog 1.13, Kundenvorgabe):
 *   aussen  <- vormals Lackaufbereitungsmotiv
 *   leasing <- vormals Aussenaufbereitungsmotiv
 *   lack    <- Lackiermotiv, durch die Rochade frei geworden
 *
 * DATEINAMEN BLEIBEN: `fahrzeugaufbereitung-…` und `smart-repair-…` sind KEINE
 * Ein-Zweck-Assets, sie tragen auch die Kacheln „Fahrzeugaufbereitung" bzw.
 * „Smart Repair" in `data/services.ts`. Ein Umbenennen nach dem neuen Einsatzort
 * wuerde die Namen dort falsch machen. Deshalb hier dokumentiert statt umbenannt.
 *
 * LIEFERUNG VOM 2026-09-21 (echte Fotos, Bildliste `docs/bilder/README.md`):
 *   innen   <- neues Foto unter demselben Namen (B27, B45, B67)
 *   leasing <- eigenes Motiv `leasingrueckgabe-aufbereitung-…` (B29, Backlog 2.14/R2)
 *   aussen  <- Lackaufbereitungsfoto (Mitarbeiterin mit Poliermaschine): B28, B46, B66.
 *              Damit endet die Leihgabe von `fahrzeugaufbereitung-…` an dieser Stelle (R2).
 *   lack    <- dasselbe Foto (B47). Auf Wunsch des Users vom 2026-09-21 — bewusst in Kauf
 *              genommen: Auf `/fahrzeugaufbereitung-leipzig` stehen die Karten „Außen" und
 *              „Lack" nebeneinander mit demselben Bild, bis ein zweites Politurmotiv kommt.
 *   Die fruehere Lackierkabine (`lackierkabine-…`) steht nur noch auf der Karriereseite.
 */
export const aufbereitungKacheln = {
  innen: '/assets/kacheln/innenaufbereitung-leipzig-carcare.webp',
  aussen: '/assets/kacheln/lackaufbereitung-leipzig-carcare.webp',
  lack: '/assets/kacheln/lackaufbereitung-leipzig-carcare.webp',
  leasing: '/assets/kacheln/leasingrueckgabe-aufbereitung-leipzig-carcare.webp',
  wissen: '/assets/kacheln/wissensdatenbank-leipzig-carcare.webp',
} as const;

export interface DetailingScope {
  /**
   * Anker-Ziel auf `/fahrzeugaufbereitung-leipzig`. Die gleichnamigen Kacheln der
   * Startseiten-Sektion „Autoaufbereitung" springen hierher, statt wie frueher in den
   * Wissensbereich abzubiegen (Auftrag User 2026-08-09).
   */
  id: string;
  title: string;
  /**
   * EIGENSTAENDIG formulierter Teaser — bewusst KEIN Anriss des Detailtexts der
   * Unterseite. Ein gekuerzter Auszug waere nur eine kleinere Dublette, keine
   * geloeste (SEO-GEO-STANDARDS.md §4.5).
   */
  intro: string;
  /**
   * Konkrete Arbeitsschritte. Seit 2026-09-02 optional: Innen-, Aussen- und
   * Lackaufbereitung haben eigene Seiten (Backlog 1.8/1.9), die Detailliste steht
   * dort. Hier bleibt nur der Teaser plus Link.
   */
  items?: string[];
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
    image: aufbereitungKacheln.innen,
    imageAlt: 'Mitarbeiter reinigt mit dem Detailpinsel die Mittelkonsole eines Sportwagens – Innenaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    title: 'Innenaufbereitung',
    intro:
      'Sitze, Cockpit, Oberflächen und Scheiben werden gereinigt und gepflegt, nicht nur gesaugt. Auf Wunsch kommen Geruchsentfernung und die Behandlung belasteter Innenraumluft dazu.',
    href: '/innenaufbereitung-leipzig',
    hrefLabel: 'Zur Innenaufbereitung',
  },
  {
    id: 'aussenaufbereitung',
    image: aufbereitungKacheln.aussen,
    imageAlt: 'Mitarbeiterin poliert mit der Poliermaschine den Kotflügel eines dunkelblauen SUV – Außen- und Lackaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    title: 'Außenaufbereitung',
    intro:
      'Was die Waschanlage stehen lässt, wird hier gelöst: Rückstände an den Felgen und Insektenrückstände, dazu eine schonende Handoberwäsche. Damit ist die Oberfläche für Politur und Versiegelung vorbereitet.',
    href: '/aussenaufbereitung-leipzig',
    hrefLabel: 'Zur Außenaufbereitung',
  },
  {
    id: 'lackaufbereitung',
    image: aufbereitungKacheln.lack,
    // Beschreibt das gezeigte Motiv. (Bis 2026-09-21 stand hier die Lackierkabine mit einem Text,
    // der eine polierte Lackoberflaeche versprach — die war auf dem Bild nicht zu sehen.)
    imageAlt: 'Poliermaschine auf dem Lack eines dunkelblauen SUV, der Radlauf ist abgeklebt – Lackaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    title: 'Lackaufbereitung',
    intro:
      'Politur und Versiegelung arbeiten den Lack selbst auf — für Glanz und einen Schutz, der die spätere Reinigung erleichtert. Ausführlich beschrieben auf der Seite zur Außenaufbereitung.',
    href: '/aussenaufbereitung-leipzig',
    hrefLabel: 'Zur Lackaufbereitung',
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
