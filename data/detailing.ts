import type { PriceItem } from '../components/PageBlocks';
import { zusatzleistungen } from './zusatzleistungen';

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

/**
 * Pflegepakete inkl. Preis. Reihenfolge = aufsteigender Leistungsumfang.
 *
 * Backlog 5.32 (Meeting 2026-09-25): Die drei Festpreise tragen ein „ab" — wegen der Aufpreise nach
 * Fahrzeugklasse (`AUFPREIS_SATZ`). Gleich umgestellt: Preis-FAQ, Seitentexte und im Schema
 * `from: true` in `priceOffers` (→ `PriceSpecification.minPrice` statt Fixpreis).
 */
export const carePackages: PriceItem[] = [
  {
    id: 'p1',
    title: 'Brillant Außenpflege',
    price: 'ab 169,00 €',
    fussnote: true,
    leistung: 'aussen',
    // Backlog 2.10: Der zweite Satz trennt zwei Dinge, die sonst verwechselt werden —
    // die im Paket enthaltene Lackversiegelung und die separat buchbare
    // Keramikversiegelung. Das Paket ist deren Voraussetzung, nicht deren Ersatz.
    // Backlog 4.5: „schonende Handoberwäsche" statt „Oberwäsche inkl. Abledern" — Wortlaut des Kunden.
    // Backlog 4.3 (2026-09-16): „Lackreinigung" entfaellt insgesamt, Entscheidung des Kunden.
    // Backlog 6.24 (Mail Andre 2026-09-28): „Intensive Vorreinigung inkl. Entfernung von Ablagerungen".
    description:
      'Intensive Vorreinigung inklusive Entfernung von Ablagerungen, Felgenreinigung, Insektenentfernung, schonende Handoberwäsche, Scheibenreinigung, Hochglanzpolitur und Lackversiegelung. Dieses Paket ist zugleich die Voraussetzung für eine Keramikversiegelung: Der Lack muss vorher gereinigt und poliert sein. Die Keramikversiegelung selbst ist nicht enthalten und wird zusätzlich beauftragt.',
  },
  {
    id: 'p2',
    // Backlog 4.21: Programmname des Kunden. Bis 2026-09-16 stand hier „Intensiv Innenreinigung".
    title: 'Intensiv Innenraumreinigung',
    price: 'ab 199,00 €',
    fussnote: true,
    leistung: 'innen',
    // Backlog 4.6: Teppichreinigung ergaenzt, „Schonende Oberwaesche" statt „inkl. Abledern".
    // Die Polstershampoonierung stand schon drin — als Alternative zur Lederpflege, und
    // so bleibt sie: Stoff wird shampooniert, Leder gepflegt. Die Teppiche gelten fuer beide.
    // Backlog 6.24 (Mail Andre 2026-09-28): „Reinigung aller Ablagen und Fächer, Dachhimmelreinigung".
    description:
      'Schonende Oberwäsche, intensive Reinigung des gesamten Innenraumes mit allen Ablagen und Fächern, Dachhimmelreinigung, Polstershampoonierung oder alternativ Lederpflege, Teppichreinigung sowie Scheibenreinigung innen und außen.',
  },
  {
    id: 'p3',
    title: 'Premiumpflege',
    price: 'ab 299,00 €',
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
      'Aufbereitung von außen und innen in liebevoller Handarbeit mit ausgesuchten Produktlinien, u. a. Wachsen von Swissvax mit Carnaubaanteilen von 30 bis 60 %. Je höher der Anteil, desto höher der Glanzgrad Ihres Lackes. Der Innenraum wird dabei ebenso behandelt wie der Lack. Den Preis stimmen wir nach Aufwand persönlich mit Ihnen ab.',
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
      // Backlog 5.33 (Meeting 2026-09-25): Die Lackaufbereitung geht tiefer als die Brillant Außenpflege
      // und soll staerker herausgestellt werden. Swissvax gehoert zur Premiumpflege „exklusiv" und steht
      // deshalb hier nicht mehr — dafuer Keramik- und Nanoversiegelung, die Andre pushen moechte.
      // Backlog 6.24 (Mail Andre 2026-09-28): Umfang in Andres Worten, im Stil der Paketlisten darueber.
      'Lacktiefenpolitur, Entfernung von Oberflächenkratzern und Antihologramm-Bearbeitung, abgestimmt auf den Zustand Ihres Fahrzeuglackes. Nach Absprache und auf Wunsch erweiterbar mit Wachs-, Nano- oder Keramikversiegelung. Wie viel Arbeit nötig ist, zeigt erst die Begutachtung. Danach nennen wir Ihnen den Preis.',
  },
];

/**
 * Zusatzleistung als Preiskachel. Name, Preis und Text kommen aus `data/zusatzleistungen.ts` — derselben
 * Liste wie die Kaestchen im Formular. `leistung` = ID der Zusatzleistung: Der Anfrage-Link der Kachel
 * hakt sie im Formular an (`startwerte` in `components/RequestForm.tsx`).
 */
const zusatzKachel = (id: string): PriceItem => {
  const z = zusatzleistungen.find((eintrag) => eintrag.id === id);
  if (!z) throw new Error(`data/detailing.ts: Zusatzleistung „${id}“ fehlt in data/zusatzleistungen.ts`);
  return { id: `zusatz-${z.id}`, title: z.label, price: z.preis, description: z.beschreibung, leistung: z.id };
};

/**
 * Anzeigepreis einer Zusatzleistung fuer Fliesstext (Einleitungen, FAQ) — keine zweite Schreibweise des Preises.
 * Mit geschuetzten Leerzeichen: Im Fliesstext brach mobil sonst „169,00 / €“ zwischen Betrag und Waehrung um.
 */
const fliesstextPreis = (preis: string) => preis.replace(/ /g, '\u00A0');
export const zusatzPreis = (id: string): string => fliesstextPreis(zusatzKachel(id).price);

/** Desinfektions- und Hygieneleistungen inkl. Preis (Backlog 1.10 / 1.11). */
export const disinfectionServices: PriceItem[] = ['ozon', 'heissvernebelung'].map(zusatzKachel);

/**
 * Exklusiv- und Zusatzleistungen mit Preis (Mail Andre 2026-09-28): Versiegelungen und Pflege-Extras.
 * Keramik und Nano als eigene Kacheln „zur besseren Vermarktung“ (Andre), seit 6.17 mit „ab“-Preis.
 */
export const zusatzAngebote: PriceItem[] = ['keramik', 'nano', 'frontscheibe', 'felgen', 'cabrio', 'motor'].map(zusatzKachel);

const paket = (id: string): PriceItem => {
  const gefunden = carePackages.find((p) => p.id === id);
  if (!gefunden) throw new Error(`data/detailing.ts: Paket „${id}“ fehlt in carePackages`);
  return gefunden;
};

/**
 * WELCHE KACHEL AUF WELCHER SEITE (User, 2026-09-28): Die Uebersicht `/fahrzeugaufbereitung-leipzig`
 * zeigt ALLE Aufbereitungsleistungen, Aussen- und Innenseite nur die zugeordneten. Die kombinierten
 * Pakete (Premiumpflege, „exklusiv“) gehoeren keiner Seite allein — sie stehen auf der Uebersicht,
 * die beiden Unterseiten verweisen darauf. Umhaengen = eine ID hier verschieben.
 */
/** Anzeigepreis eines Pakets fuer Fliesstext — wie `zusatzPreis`. */
export const paketPreis = (id: string): string => fliesstextPreis(paket(id).price);

export const angeboteAussen = {
  pakete: [paket('p1'), paket('p5')],
  zusatz: zusatzAngebote,
};
export const angeboteInnen = {
  // Einzelne Karte ueber die volle Breite, damit sie nicht allein in der halben Spalte steht.
  pakete: [{ ...paket('p2'), breit: true }],
  zusatz: disinfectionServices,
};

/**
 * Maschinenlesbare Fassung der Kacheln fuer `offerCatalogSchema` — ABGELEITET aus genau den Kacheln,
 * die eine Seite zeigt (SEO-GEO §5: nur Sichtbares auszeichnen). Bis 2026-09-28 stand hier eine
 * handgeschriebene Zweitliste (`priceOffers`) mit eigenen Kurztexten; jede neue Kachel haette dort
 * nachgetragen werden muessen.
 *
 * Betrag aus dem Anzeigepreis: „ab 169,00 €“ → `minPrice` 169.00 (`from`), „95,20 €“ → `price` 95.20,
 * „Preis nach Aufwand/Absprache“ → keine Preisfelder, der Wortlaut steht dann in der Beschreibung.
 */
export const schemaAngebote = (kacheln: PriceItem[]) =>
  kacheln.map((kachel) => {
    const treffer = kachel.price.match(/^(ab\s+)?([\d.]+),(\d{2})\s*€$/);
    const zusatz = kachel.fussnote ? ` ${AUFPREIS_SATZ}` : treffer ? '' : ` ${kachel.price}.`;
    return {
      name: kachel.title,
      description: `${kachel.description}${zusatz}`,
      ...(treffer ? { price: `${treffer[2].replace(/\./g, '')}.${treffer[3]}`, from: Boolean(treffer[1]) } : {}),
    };
  });

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
  // `wissen` entfallen (Backlog 5.17, 2026-09-27): Die Wissens-Karte der Startseite ist weg, das Motiv
  // `wissensdatenbank-…` wird nirgends mehr verwendet (Liste „unbenutzt" in `npm run bilder`).
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
    imageAlt: 'Mitarbeiter reinigt mit dem Detailpinsel die Mittelkonsole eines Sportwagens, Innenaufbereitung im CarCare Center Leipzig',
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
    imageAlt: 'Mitarbeiterin poliert mit der Poliermaschine den Kotflügel eines dunkelblauen SUV, Außen- und Lackaufbereitung im CarCare Center Leipzig',
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
    imageAlt: 'Poliermaschine auf dem Lack eines dunkelblauen SUV, der Radlauf ist abgeklebt. Lackaufbereitung im CarCare Center Leipzig',
    imageWidth: 2000,
    imageHeight: 1500,
    title: 'Lackaufbereitung',
    intro:
      'Die Lackaufbereitung geht tiefer als die Außenpflege: Politur nimmt leichte Kratzer und matte Stellen aus dem Lack, eine Versiegelung schützt den Glanz, auf Wunsch als Keramik- oder Nanoversiegelung. Ausführlich beschrieben auf der Seite zur Außenaufbereitung.',
    href: '/aussenaufbereitung-leipzig',
    hrefLabel: 'Zur Lackaufbereitung',
  },
];

/**
 * Ablauf der Aufbereitung — EINE QUELLE fuer die Prozesskarten der Startseite
 * (`components/DetailingProcessSection.tsx`) und den Ablauf auf `/fahrzeugaufbereitung-leipzig`.
 *
 * Bis 2026-09-27 stand der Wortlaut zweimal: hier und als Kopie in der Komponente. Beide waren
 * noch gleich, aber jede Korrektur musste doppelt gemacht werden (gefunden bei Backlog 5.18).
 * Die Startseite liest Titel und Text jetzt von hier; nur ihre Bilder stehen in der Komponente.
 *
 * Backlog 5.18 (Meeting 2026-09-25): „Außen" als Bereichsname gross wie „Lack", und „nach dem
 * hoechsten Standard" statt „nach unserem Standard" — das klang, als haetten wir einen eigenen
 * Standard erfunden.
 */
export const detailingSteps = [
  { title: 'Leistung auswählen', description: 'Passendes Paket oder individuelle Aufbereitung wählen.' },
  { title: 'Termin anfragen', description: 'Wunschtermin online oder telefonisch übermitteln.' },
  { title: 'Fahrzeug abgeben', description: 'Persönliche Übergabe mit kurzer Beratung vor Ort.' },
  { title: 'Professionelle Aufbereitung', description: 'Innen, Außen, Lack und Details nach dem höchsten Standard.' },
  { title: 'Gepflegt zurückerhalten', description: 'Sichtbar aufgewertet und bereit für Alltag oder Rückgabe.' },
];
