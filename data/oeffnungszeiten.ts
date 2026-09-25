/**
 * Oeffnungszeiten — EINE Quelle fuer den Live-Status oben rechts (`AktionsAussparung`) und das
 * JSON-LD (`seo/structuredData.ts`, `openingHoursSpecification`). Angelegt 2026-09-24.
 *
 * WARUM EINE QUELLE: Der Status „Jetzt geoeffnet" ist eine Tatsachenbehauptung. Stuende die Zeit
 * hier anders als im JSON-LD oder im Footer, behauptete die Seite an zwei Stellen Verschiedenes —
 * und eine davon waere falsch. Deshalb lesen alle vier Stellen von hier: Live-Status
 * (`AktionsAussparung`), JSON-LD (`seo/structuredData.ts`) und die sichtbaren Angaben in `Footer`,
 * `KontaktDaten` und `ContactCTA` (`OEFFNUNG_ANZEIGE`). Wer die Zeiten aendert, aendert nur diese Datei.
 *
 * FEIERTAGE: die elf landesweiten gesetzlichen Feiertage in Sachsen (SaechsSFG). Fronleichnam gilt
 * nur in Gemeinden um Bautzen, nicht in Leipzig. Heiligabend und Silvester sind keine gesetzlichen
 * Feiertage — ob der Betrieb dann offen hat, wissen wir nicht, also behaupten wir nichts Besonderes.
 * BETRIEBSFERIEN kennt diese Datei nicht. Stehen welche an, gehoeren sie in `BETRIEBSRUHE`.
 *
 * ZEITZONE: immer Europe/Berlin, nicht die des Besuchers. Wer um 19 Uhr in New York schaut, soll
 * „Geschlossen" lesen, weil es in Leipzig 1 Uhr nachts ist.
 *
 * Reines Datenmodul ohne Importe: Es wird von Komponenten und vom SEO-Modul gelesen.
 */

/** Oeffnungszeit an Werktagen, 24-h-Format wie im JSON-LD. */
export const OEFFNUNG = { von: '07:00', bis: '18:00' } as const;

/** Wochentage mit `OEFFNUNG` in der Schreibweise von schema.org. */
export const SCHEMA_WOCHENTAGE = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

/** Wochentage mit `OEFFNUNG`, ISO-Zaehlung (1 = Montag … 7 = Sonntag). */
const WERKTAGE = new Set([1, 2, 3, 4, 5]);

/** Samstag: nach Vereinbarung — kein fester Zeitraum, deshalb nie „geoeffnet". */
const SAMSTAG = 6;

/** `'07:00'` → `'7'`, `'07:30'` → `'7:30'` — fuer die kurze Schreibweise „7–18 Uhr". */
const stunde = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}:${String(m).padStart(2, '0')}` : String(h);
};

/** Neutrale Fassung ohne Uhrzeit-Bezug — fuer das statische HTML und vor dem ersten Rechnen. */
export const OEFFNUNG_NEUTRAL = `Mo–Fr ${stunde(OEFFNUNG.von)}–${stunde(OEFFNUNG.bis)} Uhr`;

/**
 * Sichtbare Angaben fuer Footer und Kontaktkarten. Halbgeviertstrich mit Leerzeichen wie bisher
 * im Footer; `KontaktDaten` und `ContactCTA` hatten bis 2026-09-24 den Bindestrich („Mo - Fr").
 */
export const OEFFNUNG_ANZEIGE = {
  werktage: 'Mo – Fr',
  zeit: `${OEFFNUNG.von} – ${OEFFNUNG.bis}`,
  samstag: 'nach Vereinbarung',
  /** Fuer die schmale Footer-Spalte. */
  samstagKurz: 'n. Vereinbarung',
} as const;

/**
 * Tage ohne Betrieb ausser Wochenende und Feiertagen, als `JJJJ-MM-TT`. Leer = keine bekannt.
 * Beispiel: `['2026-12-24', '2026-12-31']`, wenn der Kunde diese Tage schliesst.
 */
export const BETRIEBSRUHE: readonly string[] = [];

const WOCHENTAG_KURZ = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export interface OeffnungsStatus {
  /** Nimmt gerade jemand ab? */
  offen: boolean;
  /** Fuer Hinweis und Ansage, z. B. „Jetzt geöffnet · bis 18 Uhr". */
  text: string;
}

/** `'07:00'` → `'7 Uhr'`, `'07:30'` → `'7:30 Uhr'`. */
const uhr = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}:${String(m).padStart(2, '0')} Uhr` : `${h} Uhr`;
};

const minuten = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Kalenderdatum als Zahl-Tripel ohne Zeitzone — gerechnet wird in UTC, damit nichts verrutscht. */
type Tag = { j: number; m: number; t: number };

const schluessel = ({ j, m, t }: Tag) => `${j}-${String(m).padStart(2, '0')}-${String(t).padStart(2, '0')}`;

const plusTage = ({ j, m, t }: Tag, n: number): Tag => {
  const d = new Date(Date.UTC(j, m - 1, t + n));
  return { j: d.getUTCFullYear(), m: d.getUTCMonth() + 1, t: d.getUTCDate() };
};

/** ISO-Wochentag, 1 = Montag … 7 = Sonntag. */
const wochentag = ({ j, m, t }: Tag) => new Date(Date.UTC(j, m - 1, t)).getUTCDay() || 7;

/** Ostersonntag nach der Gaussschen Osterformel (gregorianisch, anonymer Algorithmus). */
const ostersonntag = (j: number): Tag => {
  const a = j % 19;
  const b = Math.floor(j / 100);
  const c = j % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const n = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * n + 114) / 31);
  return { j, m: monat, t: ((h + l - 7 * n + 114) % 31) + 1 };
};

const feiertageCache = new Map<number, Map<string, string>>();

/** Gesetzliche Feiertage in Sachsen fuer ein Jahr: `JJJJ-MM-TT` → Name. */
export const feiertageSachsen = (j: number): Map<string, string> => {
  const vorhanden = feiertageCache.get(j);
  if (vorhanden) return vorhanden;
  const ostern = ostersonntag(j);
  // Buss- und Bettag: der Mittwoch vor dem 23. November (also zwischen dem 16. und 22.).
  const nov22: Tag = { j, m: 11, t: 22 };
  const bussUndBettag = plusTage(nov22, -((wochentag(nov22) - 3 + 7) % 7));
  const tage: [Tag, string][] = [
    [{ j, m: 1, t: 1 }, 'Neujahr'],
    [plusTage(ostern, -2), 'Karfreitag'],
    [plusTage(ostern, 1), 'Ostermontag'],
    [{ j, m: 5, t: 1 }, 'Tag der Arbeit'],
    [plusTage(ostern, 39), 'Christi Himmelfahrt'],
    [plusTage(ostern, 50), 'Pfingstmontag'],
    [{ j, m: 10, t: 3 }, 'Tag der Deutschen Einheit'],
    [{ j, m: 10, t: 31 }, 'Reformationstag'],
    [bussUndBettag, 'Buß- und Bettag'],
    [{ j, m: 12, t: 25 }, '1. Weihnachtstag'],
    [{ j, m: 12, t: 26 }, '2. Weihnachtstag'],
  ];
  const karte = new Map(tage.map(([tag, name]) => [schluessel(tag), name]));
  feiertageCache.set(j, karte);
  return karte;
};

const geschlossenWegen = (tag: Tag): string | null =>
  feiertageSachsen(tag.j).get(schluessel(tag)) ?? (BETRIEBSRUHE.includes(schluessel(tag)) ? 'Betriebsruhe' : null);

const istOeffnungstag = (tag: Tag) => WERKTAGE.has(wochentag(tag)) && !geschlossenWegen(tag);

/** Datum und Uhrzeit in Leipzig, unabhaengig von der Zeitzone des Geraets. */
const inLeipzig = (datum: Date): { tag: Tag; min: number } => {
  const teile = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(datum);
  const wert = (typ: string) => Number(teile.find((p) => p.type === typ)?.value ?? 0);
  return { tag: { j: wert('year'), m: wert('month'), t: wert('day') }, min: wert('hour') * 60 + wert('minute') };
};

/**
 * Status zum Zeitpunkt `datum` in Leipzig. Liefert Saetze fuer Hinweis und Ansage:
 *   „Jetzt geöffnet · bis 18 Uhr" · „Geschlossen · heute ab 7 Uhr" · „Geschlossen · morgen ab 7 Uhr"
 *   „Geschlossen · Mo ab 7 Uhr" · „Sa nach Vereinbarung · Mo ab 7 Uhr" · „Feiertag · Mo ab 7 Uhr"
 */
export const oeffnungsStatus = (datum: Date = new Date()): OeffnungsStatus => {
  const { tag, min } = inLeipzig(datum);
  const von = minuten(OEFFNUNG.von);
  const bis = minuten(OEFFNUNG.bis);
  const heuteOffen = istOeffnungstag(tag);

  if (heuteOffen && min >= von && min < bis) return { offen: true, text: `Jetzt geöffnet · bis ${uhr(OEFFNUNG.bis)}` };
  if (heuteOffen && min < von) return { offen: false, text: `Geschlossen · heute ab ${uhr(OEFFNUNG.von)}` };

  // Naechster Oeffnungstag — hoechstens drei Wochen voraus (Weihnachten + Betriebsruhe).
  let naechster = plusTage(tag, 1);
  for (let i = 0; i < 21 && !istOeffnungstag(naechster); i++) naechster = plusTage(naechster, 1);
  const wann = schluessel(naechster) === schluessel(plusTage(tag, 1)) ? 'morgen' : WOCHENTAG_KURZ[wochentag(naechster)];
  const ab = `${wann} ab ${uhr(OEFFNUNG.von)}`;

  const grund = geschlossenWegen(tag);
  if (grund) return { offen: false, text: `${grund === 'Betriebsruhe' ? 'Betriebsruhe' : 'Feiertag'} · ${ab}` };
  if (wochentag(tag) === SAMSTAG) return { offen: false, text: `Sa nach Vereinbarung · ${ab}` };
  return { offen: false, text: `Geschlossen · ${ab}` };
};
