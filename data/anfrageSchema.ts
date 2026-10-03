import type { RequestFormKind } from '../types.js';
import { schadenFelder } from './schadenFelder.js';
import { terminLeistungen } from './leistungsauswahl.js';
import { zusatzleistungen } from './zusatzleistungen.js';
import { paketOffen } from './zusatzregeln.js';

export const PARTNER_TYPEN = {
  autohaus: 'Autohaus', fuhrpark: 'Fuhrpark', versicherung: 'Versicherung / Versicherungsagentur',
  rahmenvertrag: 'Rahmenvertrag / laufende Zusammenarbeit', sonstiges: 'Sonstiges',
};

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
  // Seit 2026-09-28 (User): Name und Leistung Pflicht, Telefon ODER E-Mail — siehe PFLICHT_EINS_VON.
  termin: ['name', 'service'],
  business: ['company', 'contact', 'phone', 'email', 'description'],
  bewerbung: ['name', 'phone', 'email', 'description'],
};

/**
 * Von jeder Gruppe muss MINDESTENS EIN Feld ausgefuellt sein. Terminanfrage (User, 2026-09-28): „entweder
 * Telefon oder E-Mail, damit man sich zurueckmelden kann“. Das Formular setzt `required` jeweils am leeren
 * Gegenstueck (`TerminFelder`); verbindlich ist diese Pruefung in `api/anfrage.ts`.
 */
export const PFLICHT_EINS_VON: Partial<Record<RequestFormKind, string[][]>> = {
  termin: [['phone', 'email']],
};

/** Gueltige Werte fuer „Gewuenschte Leistung“ — ein veralteter Wert (z. B. die gestrichene Verkaufsaufbereitung) wird abgewiesen. */
export const LEISTUNGS_IDS = new Set(terminLeistungen.map((l) => l.id));

/** Gueltige Zusatzleistungen (seit 2026-09-28 auch serverseitig geprueft, siehe `api/anfrage.ts`). */
export const ZUSATZ_IDS = new Set(zusatzleistungen.map((z) => z.id));

/** Beschriftung je Feld in der E-Mail. Reihenfolge bestimmt die Reihenfolge in der Mail. */
export const FELDBESCHRIFTUNG: Record<string, string> = {
  name: 'Name',
  company: 'Firma',
  contact: 'Ansprechpartner',
  phone: 'Telefon',
  email: 'E-Mail',
  kennzeichen: 'Kennzeichen',
  vehicle: 'Fahrzeug',
  // Terminanfrage seit 2026-09-28: Marke und Modell aus Auswahllisten, Freitext nur bei „Andere …“.
  marke: 'Marke',
  modell: 'Modell',
  modellFrei: 'Fahrzeug (Freitext)',
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
  // Versiegelung als Leistung (6.6, seit 2026-10-03) mit „Paket offen: …“: Laut Andre gibt es sie nur zu einem Paket,
  // und welches, klaert die Werkstatt mit dem Kunden. So steht es in der Mail, bevor jemand zurueckruft.
  service: Object.fromEntries(terminLeistungen.map((l) => [l.id, paketOffen(l.id) ? `${l.label} (${paketOffen(l.id)})` : l.label])),
  partnerType: PARTNER_TYPEN,
  // Mit Preis (seit 2026-09-28): Wer die Mail liest, sieht sofort, was die Anfrage kostet.
  zusatzleistungen: Object.fromEntries(zusatzleistungen.map((l) => [l.id, `${l.label} (${l.preis})`])),
};

/*
 * Die Pruefung „keine ID zugleich Leistung und Zusatzleistung“ (Vorauswahl der Preiskachel waere mehrdeutig) stand
 * bis 2026-10-02 hier, mit Ausnahme fuer die Versiegelungen aus 6.6. Seitdem steht sie bei den uebrigen
 * Regelpruefungen in `data/zusatzregeln.ts` — das Modul laeuft im Formular, auf dem Server und im Prerender. Seit
 * 2026-10-03 wieder mit Ausnahme, aber ausdruecklich: `auchAlsLeistung` (Keramik, Nano).
 */

/** Uebersetzt einen Feldwert in seinen Klartext, sofern es einen gibt. */
export const lesbarerWert = (feld: string, wert: string): string =>
  AUSWAHLTEXTE[feld]?.[wert] ?? wert;

/**
 * Postfach, das Absender SEHEN — im Formular, wenn der Online-Versand aus ist, und in der Fehlermeldung, wenn er
 * scheitert. EINE Liste fuer Formular und Funktion (bis 2026-09-28 stand die Zuordnung zweimal).
 *
 * Bewerbungen seit Backlog 6.13 (Meeting 2026-09-28) an bewerbung@carcare-center.de. Wohin die Funktion TATSAECHLICH
 * zustellt, bestimmen die Umgebungsvariablen in `api/anfrage.ts` — beim Livegang muss dort dasselbe Postfach stehen
 * (`ANFRAGE_EMPFAENGER_BEWERBUNG`), sonst landen Bewerbungen weiter beim allgemeinen Empfaenger.
 */
export const KONTAKT_POSTFACH: Record<RequestFormKind, string> = {
  schaden: 'info@carcare-center.de',
  termin: 'info@carcare-center.de',
  business: 'abosse@carcare-center.de',
  bewerbung: 'bewerbung@carcare-center.de',
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

/**
 * Anhaenge der Bewerbung (Backlog 5.29, Meeting 2026-09-25) — EINE QUELLE fuer Formular und Funktion.
 *
 * GRENZEN: Vercel nimmt hoechstens 4,5 MB Anfragekoerper an. Base64 macht aus 3 MB rund 4 MB; mit dem
 * JSON-Rahmen bleibt das darunter. Mehr als drei Dateien braucht eine Bewerbung nicht — groessere
 * Unterlagen gehen weiterhin nach dem Absenden per E-Mail mit Vorgangsnummer.
 *
 * TYPEN: nur Formate, die im Betrieb ohne Sonderprogramm aufgehen. Geprueft wird die SIGNATUR der
 * ersten Bytes, nicht nur die Endung — eine umbenannte ausfuehrbare Datei bleibt draussen. Dieselbe
 * Pruefung laeuft im Browser (fruehe, verstaendliche Meldung) und verbindlich auf dem Server.
 * DOCX und ODT sind ZIP-Container und teilen deshalb dieselbe Signatur.
 */
export const ANHANG_MAX_DATEIEN = 3;
export const ANHANG_MAX_BYTES = 3_000_000;
export const ANHANG_TYPEN: Record<string, { mime: string; signatur: number[] }> = {
  pdf: { mime: 'application/pdf', signatur: [0x25, 0x50, 0x44, 0x46, 0x2d] },
  doc: { mime: 'application/msword', signatur: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', signatur: [0x50, 0x4b, 0x03, 0x04] },
  odt: { mime: 'application/vnd.oasis.opendocument.text', signatur: [0x50, 0x4b, 0x03, 0x04] },
  jpg: { mime: 'image/jpeg', signatur: [0xff, 0xd8, 0xff] },
  jpeg: { mime: 'image/jpeg', signatur: [0xff, 0xd8, 0xff] },
  png: { mime: 'image/png', signatur: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
};
/** Fuer das `accept`-Attribut des Dateifelds. */
export const ANHANG_ACCEPT = Object.keys(ANHANG_TYPEN).map((endung) => `.${endung}`).join(',');
/** Dateiendung in Kleinbuchstaben, ohne Punkt; leer, wenn es keine gibt. */
export const anhangEndung = (name: string): string => name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? '';
/** Passen die ersten Bytes zur Endung? `kopf` = mindestens die ersten 8 Bytes der Datei. */
export const passtSignatur = (kopf: Uint8Array, endung: string): boolean => {
  const signatur = ANHANG_TYPEN[endung]?.signatur;
  return Boolean(signatur && signatur.every((byte, i) => kopf[i] === byte));
};
