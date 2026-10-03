/**
 * Auswahlfeld „Gewuenschte Leistung" im Aufbereitungsformular — und die Zuordnung,
 * von welcher Seite aus welche Leistung vorausgewaehlt wird (Backlog 1.19).
 *
 * EINE QUELLE FUER BEIDES. Die Optionen standen bisher als sieben `<option>`-Zeilen im
 * Formular. Damit haette 1.19 eine zweite Liste gebraucht, die dieselben Schluessel
 * fuehrt — und die beim naechsten neuen Paket auseinanderlaeuft. Jetzt liefert diese
 * Datei die Optionen UND die Vorauswahl; eine neue Leistung ist ein Eintrag.
 *
 * ⚠️ NUR ECHTE ENTSPRECHUNGEN WERDEN ZUGEORDNET. Wer von `/innenaufbereitung-leipzig`
 * kommt, meint die Innenaufbereitung — das ist eindeutig. Fuer Seiten ohne passende
 * Option bleibt das Feld auf „Bitte waehlen". Eine falsche Vorauswahl ist schlechter
 * als keine: Sie sieht aus wie eine Entscheidung des Nutzers und wird deshalb nicht
 * korrigiert.
 *
 * PROGRAMMNAMEN (Backlog 4.21, 2026-09-16): Die Beschriftungen sind die Paketnamen des
 * Kunden — „Intensiv Innenraumreinigung", „Brillant Außenpflege", „Premiumpflege" —, nicht
 * mehr die Bereichsnamen. Die Seiten `/innenaufbereitung-leipzig` und
 * `/aussenaufbereitung-leipzig` behalten ihre Namen: Sie tragen die Suchbegriffe und meinen
 * den Bereich, nicht das Paket. Die `id`s bleiben unveraendert (Versand, Vorauswahl).
 *
 * REPARATURSEITEN STEHEN NICHT IN DIESER LISTE, sondern in `TERMIN_UEBERSCHREIBUNG`
 * weiter unten: Ihr Handlungsaufruf zeigt zwar auf `#contact-termin`, gemeint ist aber
 * eine Schadenmeldung. Behoben mit R8 am 2026-09-05.
 *
 * „NUR ZUSATZLEISTUNGEN“ (Backlog 6.7, Andres Regeln, 2026-10-02): Die meisten Zusatzleistungen sind laut Andre
 * „allein buchbar“. Bis dahin ging das nur ueber „Sonstiges“, was niemand findet. Wer jetzt nur eine Zusatzleistung
 * will, waehlt diese Option und hakt sie darunter an. Sie ersetzte 6.6 (Keramik-, Nano- und Frontscheibenversiegelung
 * standen vom 28.09. bis 02.10. zusaetzlich als eigene Leistung hier).
 *
 * VERSIEGELUNGEN ALS LEISTUNG (6.6 fuer Keramik und Nano wieder aufgenommen, User, 2026-10-03): Wer eine Versiegelung
 * sucht, sucht sie hier. Gewaehlt, ist ihr Kaestchen unter „Zusatzleistungen“ fest angehakt. Andres Regel (nur zur
 * Brillant Außenpflege oder Lackaufbereitung) gilt weiter: Das Paket klaert die Werkstatt, Formular und Mail sagen das.
 * Die Optionen entstehen aus `data/zusatzleistungen.ts` (`auchAlsLeistung`), mit derselben ID und demselben Namen.
 */
import { zusatzleistungen } from './zusatzleistungen.js';

export interface Leistungsoption {
  /** Wert im Formular. Geht spaeter so in den Versand — nicht nachtraeglich umbenennen. */
  id: string;
  label: string;
  /**
   * Seiten, von denen aus diese Leistung vorausgewaehlt wird.
   * Leer lassen, wenn keine Seite eindeutig darauf zeigt.
   */
  routen?: string[];
  /**
   * Kein Paket (6.7): Zusatzleistungen gelten hier als „allein“ gebucht — erlaubt ist nur, was `buchbar.einzeln`
   * traegt (`data/zusatzregeln.ts`). Gilt fuer „Nur Zusatzleistungen“ und „Sonstiges“.
   */
  ohnePaket?: boolean;
  /**
   * Die Leistung IST eine Zusatzleistung mit derselben ID (Keramik, Nano). Ihr Kaestchen ist dann fest angehakt, das
   * Paket dazu offen (`data/zusatzregeln.ts`). Nicht von Hand setzen: Die Eintraege entstehen aus `auchAlsLeistung`.
   */
  zusatzleistung?: boolean;
}

/** Wert der Option „Nur Zusatzleistungen“: braucht mindestens eine Zusatzleistung (Formular und Server). */
export const NUR_ZUSATZ = 'nur-zusatz';

export const terminLeistungen: Leistungsoption[] = [
  {
    id: 'innen',
    label: 'Intensiv Innenraumreinigung',
    routen: ['/innenaufbereitung-leipzig', '/autoaufbereitung-wissen/innenaufbereitung'],
  },
  {
    id: 'aussen',
    label: 'Brillant Außenpflege',
    routen: ['/aussenaufbereitung-leipzig'],
  },
  {
    id: 'komplett',
    label: 'Premiumpflege',
    // Bis 2026-09-16 von der Hub-Seite und dem Grundlagenartikel vorausgewaehlt — damals hiess
    // die Option „Komplettaufbereitung" und passte zu beiden. Als „Premiumpflege" ist sie ein
    // bestimmtes Paket; wer die Uebersicht liest, hat sich noch nicht entschieden. Die
    // Preiskarten waehlen ihr Paket seither selbst vor (`data-leistung`).
    routen: [],
  },
  // Neu 2026-09-16: das vierte Paket. Ohne eigene Option landete es bei „Sonstiges".
  { id: 'exklusiv', label: 'Premiumpflege „exklusiv“' },
  {
    id: 'lack',
    // Wie die Karte bei den Paketen (Backlog 4.9) — vorher „Lackpflege / Politur".
    label: 'Lackaufbereitung',
    routen: ['/autoaufbereitung-wissen/lackaufbereitung'],
  },
  {
    id: 'leasing',
    label: 'Leasingrückgabe',
    routen: ['/leasingrueckgabe-leipzig', '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten'],
  },
  // „Verkaufsaufbereitung“ am 2026-09-28 gestrichen (Backlog 5.19, Andre: „gibt es so als solches eigentlich
  // nicht“). Wer vor dem Verkauf aufbereiten laesst, waehlt ein Paket — die Leasingrueckgabe bleibt (Andre: „lass es so“).
  // 6.6 fuer Keramik und Nano, seit 2026-10-03 wieder (User): ID und Name aus `data/zusatzleistungen.ts`, damit die
  // Versiegelung hier nicht anders heisst als an ihrem Kaestchen. Keine Route waehlt sie vor, nur ihre Preiskachel.
  ...zusatzleistungen
    .filter((zusatz) => zusatz.auchAlsLeistung)
    .map((zusatz): Leistungsoption => ({ id: zusatz.id, label: zusatz.label, zusatzleistung: true })),
  // 6.7: Zusatzleistungen ohne Paket. Keine Route waehlt sie vor — auch die Preiskachel einer Zusatzleistung nicht:
  // Ob der Kunde sie allein oder zu einem Paket will, entscheidet er (siehe `startwerte` in RequestForm).
  { id: NUR_ZUSATZ, label: 'Nur Zusatzleistungen', ohnePaket: true },
  { id: 'sonstiges', label: 'Sonstiges', ohnePaket: true },
];

/**
 * Vorauswahl fuer einen Seitenpfad, oder `undefined`, wenn es keine eindeutige gibt.
 * Der Pfad kommt ohne abschliessenden Schraegstrich (wie `normalizePath` in App.tsx).
 */
export const leistungFuerRoute = (pfad: string): string | undefined =>
  terminLeistungen.find((leistung) => leistung.routen?.includes(pfad))?.id;

/**
 * Seiten, auf denen „Termin anfragen" etwas ANDERES meint (Backlog R8).
 *
 * Der Befund: Wer auf einer Reparaturseite „Dellenentfernung anfragen" klickte, landete
 * im Aufbereitungsformular und bekam Felder fuer Pflegepakete und Wunschtermin statt
 * fuer Schadenart, Versicherung und Fahrbereitschaft. **Nicht die Beschriftung war
 * falsch, sondern das Ziel.**
 *
 * Diese Tabelle greift NUR, wenn die Variante sonst `termin` waere. Ein
 * `#contact-business`-Aufruf auf derselben Seite behaelt seine Bedeutung — sonst
 * risse die Ueberschreibung Aufrufe mit, die richtig waren.
 *
 * `/hagelschadenreparatur-leipzig` zeigt bereits korrekt auf `#contact-schaden` und wird
 * deshalb nicht umgeleitet — die Vorauswahl bekommt es trotzdem, weil die Seite eindeutig
 * sagt, worum es geht.
 */
export const TERMIN_UEBERSCHREIBUNG: Record<string, { art: 'schaden' | 'business'; vorauswahl?: string }> = {
  '/hagelschadenreparatur-leipzig': { art: 'schaden', vorauswahl: 'hagel' },
  '/dellenentfernung-leipzig': { art: 'schaden', vorauswahl: 'delle' },
  '/felgenreparatur-leipzig': { art: 'schaden', vorauswahl: 'felge' },
  '/autoglas-leipzig': { art: 'schaden', vorauswahl: 'glas' },
  '/smart-repair-leipzig': { art: 'schaden', vorauswahl: 'lack' },
  '/autolackierung-leipzig': { art: 'schaden', vorauswahl: 'lack' },
  // Anders gelagert: Fuhrparkservice ist B2B und gehoert ins Geschaeftskundenformular.
  '/fuhrparkservice-leipzig': { art: 'business' },
};
