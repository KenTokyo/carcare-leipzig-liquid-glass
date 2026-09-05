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
 * REPARATURSEITEN STEHEN NICHT IN DIESER LISTE, sondern in `TERMIN_UEBERSCHREIBUNG`
 * weiter unten: Ihr Handlungsaufruf zeigt zwar auf `#contact-termin`, gemeint ist aber
 * eine Schadenmeldung. Behoben mit 3.36 am 2026-09-05.
 */

export interface Leistungsoption {
  /** Wert im Formular. Geht spaeter so in den Versand — nicht nachtraeglich umbenennen. */
  id: string;
  label: string;
  /**
   * Seiten, von denen aus diese Leistung vorausgewaehlt wird.
   * Leer lassen, wenn keine Seite eindeutig darauf zeigt.
   */
  routen?: string[];
}

export const terminLeistungen: Leistungsoption[] = [
  {
    id: 'innen',
    label: 'Innenaufbereitung',
    routen: ['/innenaufbereitung-leipzig', '/autoaufbereitung-wissen/innenaufbereitung'],
  },
  {
    id: 'aussen',
    label: 'Außenaufbereitung',
    routen: ['/aussenaufbereitung-leipzig'],
  },
  {
    id: 'komplett',
    label: 'Komplettaufbereitung',
    routen: ['/fahrzeugaufbereitung-leipzig', '/autoaufbereitung-wissen/was-ist-autoaufbereitung'],
  },
  {
    id: 'lack',
    label: 'Lackpflege / Politur',
    routen: ['/autoaufbereitung-wissen/lackaufbereitung'],
  },
  {
    id: 'leasing',
    label: 'Leasingrückgabe',
    routen: ['/leasingrueckgabe-leipzig', '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten'],
  },
  { id: 'verkauf', label: 'Verkaufsaufbereitung' },
  { id: 'sonstiges', label: 'Sonstiges' },
];

/**
 * Vorauswahl fuer einen Seitenpfad, oder `undefined`, wenn es keine eindeutige gibt.
 * Der Pfad kommt ohne abschliessenden Schraegstrich (wie `normalizePath` in App.tsx).
 */
export const leistungFuerRoute = (pfad: string): string | undefined =>
  terminLeistungen.find((leistung) => leistung.routen?.includes(pfad))?.id;

/**
 * Seiten, auf denen „Termin anfragen" etwas ANDERES meint (Backlog 3.36).
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
