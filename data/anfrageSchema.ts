import type { RequestFormKind } from '../types';
import { schadenFelder } from './schadenFelder';
import { terminLeistungen } from './leistungsauswahl';

/**
 * Was eine Anfrage enthalten muss und wie die Felder in der E-Mail heissen (Backlog 1.17).
 *
 * EINE QUELLE FUER FORMULAR UND FUNKTION. Die serverlose Funktion `api/anfrage.ts` prueft
 * gegen diese Liste, und die Betreffzeile wie die Feldbeschriftungen der Mail kommen von
 * hier. Ohne das haette der Server eine zweite, stillschweigend abweichende Vorstellung
 * davon, was eine gueltige Anfrage ist.
 *
 * ⚠️ SERVERSEITIGE PRUEFUNG IST NICHT DOPPELT GEMOPPELT. Die `required`-Attribute im
 * Formular sind Bedienkomfort — sie halten niemanden auf, der das Formular umgeht. Die
 * Pruefung hier ist die verbindliche.
 */

/** Felder, ohne die eine Anfrage nicht angenommen wird. */
export const PFLICHTFELDER: Record<RequestFormKind, string[]> = {
  // Aus der Feldliste abgeleitet: Wer dort `pflicht` streicht, aendert damit auch die
  // serverseitige Pruefung. Zwei Listen waeren zwei Wahrheiten.
  schaden: schadenFelder.filter((f) => f.pflicht).map((f) => f.id),
  termin: ['name', 'phone', 'email'],
  business: ['company', 'contact', 'phone', 'email', 'description'],
  bewerbung: ['name', 'phone', 'email', 'description'],
};

/** Beschriftung je Feld in der E-Mail. Reihenfolge bestimmt die Reihenfolge in der Mail. */
export const FELDBESCHRIFTUNG: Record<string, string> = {
  name: 'Name',
  company: 'Firma',
  contact: 'Ansprechpartner',
  phone: 'Telefon',
  email: 'E-Mail',
  kennzeichen: 'Kennzeichen',
  vehicle: 'Fahrzeug',
  baujahr: 'Erstzulassung',
  incident: 'Schadenart',
  fahrbereit: 'Fahrbereit',
  kostentraeger: 'Kostenträger',
  versicherung: 'Versicherung',
  schadennummer: 'Schaden-/Vorgangsnummer',
  schadendatum: 'Schadendatum',
  gutachter: 'Gutachter beauftragt',
  service: 'Gewünschte Leistung',
  zusatzleistungen: 'Zusatzleistungen',
  preferredDate: 'Wunschtermin',
  wunsch: 'Gewünschter nächster Schritt',
  ersatzfahrzeug: 'Ersatzfahrzeug gewünscht',
  partnerType: 'Art der Partnerschaft',
  position: 'Bereich',
  description: 'Nachricht',
};

/**
 * Auswahlwerte in Klartext.
 *
 * In der Mail stand bisher der technische Wert („kostentraeger: haftpflicht"). Wer sie
 * liest, soll den Satz lesen, den der Absender angeklickt hat — nicht dessen Schluessel.
 * Quellen sind dieselben Listen, aus denen das Formular seine Optionen baut.
 */
const AUSWAHLTEXTE: Record<string, Record<string, string>> = {
  ...Object.fromEntries(
    schadenFelder
      .filter((f) => f.optionen?.length)
      .map((f) => [f.id, Object.fromEntries(f.optionen!.map((o) => [o.id, o.label]))])
  ),
  service: Object.fromEntries(terminLeistungen.map((l) => [l.id, l.label])),
};

/** Uebersetzt einen Feldwert in seinen Klartext, sofern es einen gibt. */
export const lesbarerWert = (feld: string, wert: string): string =>
  AUSWAHLTEXTE[feld]?.[wert] ?? wert;

/** Betreffzeile je Anfrageart. */
export const BETREFF: Record<RequestFormKind, string> = {
  schaden: 'Schadenmeldung über die Website',
  termin: 'Terminanfrage Aufbereitung über die Website',
  business: 'Geschäftskundenanfrage über die Website',
  bewerbung: 'Bewerbung über die Website',
};

/**
 * Name des Honigtopf-Feldes.
 *
 * Ein fuer Menschen unsichtbares Feld, das Formularroboter trotzdem ausfuellen. Ist es
 * belegt, nimmt die Funktion die Anfrage entgegen und verwirft sie stillschweigend —
 * eine Fehlermeldung wuerde dem Absender verraten, woran er gescheitert ist.
 */
export const HONIGTOPF = 'website';

/** Obergrenzen je Feld. Schuetzt die Mail vor Textwuesten und die Funktion vor Missbrauch. */
export const MAX_LAENGE = 4000;
export const MAX_FELDER = 20;
