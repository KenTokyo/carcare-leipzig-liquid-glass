import type { RequestFormKind } from '../types';

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
  schaden: ['name', 'phone', 'email', 'description'],
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
  vehicle: 'Fahrzeug',
  incident: 'Schadenart',
  insuranceAvailable: 'Versicherung vorhanden',
  service: 'Gewünschte Leistung',
  zusatzleistungen: 'Zusatzleistungen',
  preferredDate: 'Wunschtermin',
  partnerType: 'Art der Partnerschaft',
  position: 'Bereich',
  description: 'Nachricht',
};

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
