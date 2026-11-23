/**
 * Gutscheinanfrage (OA-14): EINE QUELLE fuer Formular, Funktion und Mail.
 *
 * - Kein Shop, keine Online-Zahlung: Die Website nimmt nur die Anfrage an. Der Betrieb schreibt die Rechnung,
 *   prueft den Zahlungseingang und schickt den Gutschein per Post (versandkostenfrei).
 * - Formular `components/gutschein/GutscheinFormular.tsx` prueft zur Bequemlichkeit; verbindlich ist
 *   `pruefeGutschein` in `api/anfrage.ts` (Anfrageart `gutschein`).
 * - Paketnamen im Wortlaut des Kunden; keine Preise (Paketpreise haengen von der Fahrzeugklasse ab).
 */

export const GUTSCHEIN_ART = 'gutschein';

export const GUTSCHEIN_PAKETE = [
  { id: 'brillant', label: 'Brillant Außenpflege' },
  { id: 'innen', label: 'Intensiv Innenraumreinigung' },
  { id: 'premium', label: 'Premiumpflege' },
  { id: 'gross', label: 'Große Aufbereitung' },
] as const;

export type GutscheinPaketId = (typeof GUTSCHEIN_PAKETE)[number]['id'];
export const GUTSCHEIN_MAX_ANZAHL = 10;
export const GUTSCHEIN_BETRAG_MIN = 10;
export const GUTSCHEIN_BETRAG_MAX = 5000;

export interface GutscheinAdresse {
  name: string;
  firma: string;
  strasse: string;
  plz: string;
  ort: string;
}

export interface GutscheinRechnung extends GutscheinAdresse {
  email: string;
  telefon: string;
}

export interface GutscheinEingabe {
  auswahl: 'paket' | 'betrag';
  pakete: Partial<Record<GutscheinPaketId, number>>;
  betrag: string;
  rechnung: GutscheinRechnung;
  versandGleich: boolean;
  versand: GutscheinAdresse;
  einwilligung: boolean;
}

/** Gepruefte, bereinigte Anfrage: das, was Mail und Bestaetigung zeigen. */
export interface GutscheinDaten {
  auswahl: 'paket' | 'betrag';
  pakete: Array<{ id: GutscheinPaketId; label: string; anzahl: number }>;
  betrag: number | null;
  rechnung: GutscheinRechnung;
  versandGleich: boolean;
  versand: GutscheinAdresse;
}

export const leereAdresse = (): GutscheinAdresse => ({ name: '', firma: '', strasse: '', plz: '', ort: '' });
export const leereEingabe = (): GutscheinEingabe => ({
  auswahl: 'paket',
  pakete: {},
  betrag: '',
  rechnung: { ...leereAdresse(), email: '', telefon: '' },
  versandGleich: true,
  versand: leereAdresse(),
  einwilligung: false,
});

const EMAIL = /^[^@\s<>\r\n]+@[^@\s<>\r\n]+\.[^@\s<>\r\n]+$/;
const PLZ = /^\d{5}$/;
const TELEFON = /^[+\d][\d\s/().-]{5,29}$/;
const MAX_TEXT = 120;

const istObjekt = (wert: unknown): wert is Record<string, unknown> =>
  typeof wert === 'object' && wert !== null && !Array.isArray(wert);

// eslint-disable-next-line no-control-regex
const text = (wert: unknown) => (typeof wert === 'string' ? wert.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim() : '');

/** „50“, „50,00“ oder „50.5“ → Zahl; sonst NaN. */
export const betragAlsZahl = (roh: string): number => {
  const sauber = roh.replace(/\s|€/g, '').replace(',', '.');
  return /^\d+(\.\d{1,2})?$/.test(sauber) ? Number(sauber) : Number.NaN;
};

export const euro = (wert: number) =>
  `${wert.toLocaleString('de-DE', { minimumFractionDigits: wert % 1 ? 2 : 0, maximumFractionDigits: 2 })} €`;

/** Fehler je Schritt (1 Auswahl, 2 Rechnung, 3 Versand, 4 Einwilligung) — leer = Schritt in Ordnung. */
export const schrittFehler = (eingabe: GutscheinEingabe, schritt: 1 | 2 | 3 | 4): string[] => {
  const fehler: string[] = [];
  if (schritt === 1) {
    if (eingabe.auswahl === 'paket') {
      const summe = Object.values(eingabe.pakete).reduce((a, b) => a + (b ?? 0), 0);
      if (!summe) fehler.push('Bitte wählen Sie mindestens ein Paket.');
    } else {
      const zahl = betragAlsZahl(eingabe.betrag);
      if (!Number.isFinite(zahl) || zahl < GUTSCHEIN_BETRAG_MIN || zahl > GUTSCHEIN_BETRAG_MAX) {
        fehler.push(`Bitte einen Betrag zwischen ${euro(GUTSCHEIN_BETRAG_MIN)} und ${euro(GUTSCHEIN_BETRAG_MAX)} eingeben.`);
      }
    }
  }
  const adresse = (a: GutscheinAdresse, wer: string) => {
    if (!text(a.name)) fehler.push(`${wer}: Bitte Vor- und Nachname angeben.`);
    if (!text(a.strasse)) fehler.push(`${wer}: Bitte Straße und Hausnummer angeben.`);
    if (!PLZ.test(text(a.plz))) fehler.push(`${wer}: Bitte eine fünfstellige Postleitzahl angeben.`);
    if (!text(a.ort)) fehler.push(`${wer}: Bitte den Ort angeben.`);
  };
  if (schritt === 2) {
    adresse(eingabe.rechnung, 'Rechnungsadresse');
    if (!EMAIL.test(text(eingabe.rechnung.email))) fehler.push('Bitte eine gültige E-Mail-Adresse angeben.');
    if (!TELEFON.test(text(eingabe.rechnung.telefon))) fehler.push('Bitte eine Telefonnummer angeben.');
  }
  if (schritt === 3 && !eingabe.versandGleich) adresse(eingabe.versand, 'Versandadresse');
  if (schritt === 4 && !eingabe.einwilligung) fehler.push('Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.');
  return fehler;
};

/** Verbindliche Pruefung auf dem Server. Unbekannte Felder und zu lange Werte werden abgewiesen. */
export const pruefeGutschein = (roh: unknown): { daten: GutscheinDaten } | { fehler: string } => {
  if (!istObjekt(roh) || !istObjekt(roh.rechnung) || !istObjekt(roh.versand) || !istObjekt(roh.pakete)) {
    return { fehler: 'Ungültige Gutscheinanfrage.' };
  }
  const zuLang = [roh.betrag, ...Object.values(roh.rechnung), ...Object.values(roh.versand)]
    .some((w) => typeof w === 'string' && w.length > MAX_TEXT);
  if (zuLang) return { fehler: 'Eine Angabe ist zu lang.' };
  const adresse = (a: Record<string, unknown>): GutscheinAdresse => ({
    name: text(a.name), firma: text(a.firma), strasse: text(a.strasse), plz: text(a.plz), ort: text(a.ort),
  });
  const auswahl = roh.auswahl === 'betrag' ? 'betrag' : roh.auswahl === 'paket' ? 'paket' : null;
  if (!auswahl) return { fehler: 'Bitte Paket oder Betrag wählen.' };
  const pakete: GutscheinEingabe['pakete'] = {};
  for (const [id, anzahl] of Object.entries(roh.pakete)) {
    if (!GUTSCHEIN_PAKETE.some((p) => p.id === id)) return { fehler: 'Unbekanntes Paket.' };
    if (!Number.isInteger(anzahl) || (anzahl as number) < 0 || (anzahl as number) > GUTSCHEIN_MAX_ANZAHL) {
      return { fehler: `Bitte je Paket höchstens ${GUTSCHEIN_MAX_ANZAHL} Gutscheine.` };
    }
    pakete[id as GutscheinPaketId] = anzahl as number;
  }
  const eingabe: GutscheinEingabe = {
    auswahl,
    pakete: auswahl === 'paket' ? pakete : {},
    betrag: auswahl === 'betrag' ? text(roh.betrag) : '',
    rechnung: { ...adresse(roh.rechnung), email: text(roh.rechnung.email), telefon: text(roh.rechnung.telefon) },
    versandGleich: roh.versandGleich !== false,
    versand: adresse(roh.versand),
    einwilligung: roh.einwilligung === true,
  };
  const fehler = ([1, 2, 3, 4] as const).flatMap((s) => schrittFehler(eingabe, s));
  if (fehler.length) return { fehler: fehler[0] };
  return {
    daten: {
      auswahl,
      pakete: GUTSCHEIN_PAKETE.filter((p) => (eingabe.pakete[p.id] ?? 0) > 0)
        .map((p) => ({ id: p.id, label: p.label, anzahl: eingabe.pakete[p.id]! })),
      betrag: auswahl === 'betrag' ? betragAlsZahl(eingabe.betrag) : null,
      rechnung: eingabe.rechnung,
      versandGleich: eingabe.versandGleich,
      versand: eingabe.versandGleich ? { ...eingabe.rechnung } : eingabe.versand,
    },
  };
};

/** Lesbare Zeile der Auswahl: „2 × Premiumpflege, 1 × Brillant Außenpflege“ oder „Wertgutschein über 100 €“. */
export const auswahlText = (d: Pick<GutscheinDaten, 'auswahl' | 'pakete' | 'betrag'>) =>
  d.auswahl === 'betrag' && d.betrag !== null
    ? `Wertgutschein über ${euro(d.betrag)}`
    : d.pakete.map((p) => `${p.anzahl} × ${p.label}`).join(', ');

export const adresseZeilen = (a: GutscheinAdresse) =>
  [a.name, a.firma, a.strasse, `${a.plz} ${a.ort}`].filter((z) => z.trim());

export const GUTSCHEIN_BETREFF = 'Gutscheinanfrage über die Website';
export const GUTSCHEIN_HINWEIS_VERSAND = 'Versandkostenfrei';
export const GUTSCHEIN_HINWEIS_ABLAUF =
  'Sie erhalten zuerst eine Rechnung. Nach Zahlungseingang senden wir Ihnen den Gutschein per Post.';
