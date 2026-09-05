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
 * ⚠️ BEKANNTE UNSTIMMIGKEIT, NICHT HIER ZU LOESEN: Mehrere REPARATUR-Seiten
 * (Dellenentfernung, Hagelschaden, Felgen, Autoglas, Smart Repair, Fuhrpark) fuehren
 * ihren Handlungsaufruf auf `#contact-termin`, also auf das AUFBEREITUNGS-Formular.
 * Fuer sie gibt es hier bewusst keine Zuordnung — es gaebe keine richtige. Der passende
 * Ort waere das Schadenformular; das ist eine inhaltliche Entscheidung ueber rund ein
 * Dutzend Handlungsaufrufe und steht als Backlog 3.36.
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
