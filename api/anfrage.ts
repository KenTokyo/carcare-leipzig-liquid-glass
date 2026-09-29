import { createElement } from 'react';
import { render, toPlainText } from 'react-email';
import nodemailer from 'nodemailer';
import { randomInt } from 'node:crypto';
import type { RequestFormKind } from '../types.js';
import {
  ANHANG_MAX_BYTES, ANHANG_MAX_DATEIEN, ANHANG_TYPEN, BETREFF, FELDBESCHRIFTUNG, HONIGTOPF, KONTAKT_POSTFACH, MAX_FELDER,
  MAX_LAENGE, LEISTUNGS_IDS, PFLICHTFELDER, PFLICHT_EINS_VON, ZUSATZ_IDS, anhangEndung, passtSignatur,
} from '../data/anfrageSchema.js';
import { bereinigteZusaetze } from '../data/zusatzleistungen.js';
import AnfrageEmail from '../emails/AnfrageEmail.js';

/** Node.js is required for SMTP. Credentials stay in the server environment. */
export const maxDuration = 30;
const EMAIL = /^[^@\s<>\r\n]+@[^@\s<>\r\n]+\.[^@\s<>\r\n]+$/;
const ZEICHEN = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
const MAX_BODY_BYTES = 48_000;
/**
 * Backlog 5.29: Nur Bewerbungen duerfen Anhaenge tragen. 3 MB roh sind als Base64 rund 4 MB — die
 * Grenze liegt knapp darueber und unter Vercels 4,5 MB. Alle uebrigen Anfragen behalten 48 KB; das
 * wird nach dem Lesen der Anfrageart geprueft, weil sie erst im Koerper steht.
 */
const MAX_BODY_BYTES_ANHANG = 4_400_000;
const BASE64 = /^[A-Za-z0-9+/]*={0,2}$/;
const antwort = (koerper: unknown, status: number) => new Response(JSON.stringify(koerper), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export const einrichtung = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const absender = process.env.ANFRAGE_ABSENDER;
  const empfaenger = process.env.ANFRAGE_EMPFAENGER;
  const business = process.env.ANFRAGE_EMPFAENGER_BUSINESS;
  // Backlog 6.13: Bewerbungen an ein eigenes Postfach (Livegang: bewerbung@carcare-center.de). OPTIONAL, anders als
  // Business: Ohne Eintrag gehen sie wie bisher an den allgemeinen Empfaenger — nichts geht verloren, und eine fehlende
  // Variable schaltet nicht alle Formulare ab. Steht etwas darin, muss es eine gueltige Adresse sein.
  const bewerbung = process.env.ANFRAGE_EMPFAENGER_BEWERBUNG || undefined;
  const bereit = Boolean(host && [465, 587].includes(port) && user && pass &&
    absender && EMAIL.test(absender) && empfaenger && EMAIL.test(empfaenger) && business && EMAIL.test(business) &&
    (!bewerbung || EMAIL.test(bewerbung)));
  return { host, port, user, pass, absender, empfaenger, business, bewerbung, bereit };
};

/**
 * No silent fallback for business: routing must be configured before enabling forms. Applications (6.13) fall back
 * to the general inbox on purpose — that is where they went until 2026-09-28.
 */
export const empfaengerFuer = (art: RequestFormKind, stand = einrichtung()) =>
  art === 'business' ? stand.business : art === 'bewerbung' ? stand.bewerbung ?? stand.empfaenger : stand.empfaenger;

export const smtpTransport = (stand = einrichtung()) => nodemailer.createTransport({
  host: stand.host, port: stand.port, secure: stand.port === 465, requireTLS: true,
  auth: { user: stand.user, pass: stand.pass },
  connectionTimeout: 8_000, greetingTimeout: 8_000, socketTimeout: 15_000,
  disableFileAccess: true, disableUrlAccess: true,
});

const vorgangsnummer = () => {
  const datum = new Date().toISOString().slice(5, 10).replace('-', '');
  return `CC-${datum}-${Array.from({ length: 5 }, () => ZEICHEN[randomInt(ZEICHEN.length)]).join('')}`;
};
const istObjekt = (wert: unknown): wert is Record<string, unknown> =>
  typeof wert === 'object' && wert !== null && !Array.isArray(wert);

export interface Anhang { filename: string; content: Buffer; contentType: string }

/**
 * Prueft die Anhaenge einer Bewerbung (Backlog 5.29) — verbindlich; das Formular prueft dasselbe nur
 * zur Bequemlichkeit. Typ ueber die SIGNATUR der Datei, nicht nur die Endung. Dateinamen ohne Pfad-
 * und Steuerzeichen, damit im Mailprogramm nichts anderes ankommt als eine Datei.
 */
export const pruefeAnhaenge = (roh: unknown): { anhaenge: Anhang[] } | { fehler: string; status: number } => {
  if (roh === undefined) return { anhaenge: [] };
  if (!Array.isArray(roh)) return { fehler: 'Ungültige Anhänge.', status: 400 };
  if (roh.length > ANHANG_MAX_DATEIEN) return { fehler: `Bitte höchstens ${ANHANG_MAX_DATEIEN} Dateien anhängen.`, status: 400 };
  const anhaenge: Anhang[] = [];
  let gesamt = 0;
  for (const eintrag of roh) {
    if (!istObjekt(eintrag) || typeof eintrag.name !== 'string' || typeof eintrag.daten !== 'string') {
      return { fehler: 'Ungültige Anhänge.', status: 400 };
    }
    // eslint-disable-next-line no-control-regex
    const name = eintrag.name.replace(/[\\/:*?"<>|\u0000-\u001f\u007f]+/g, '_').trim().slice(-120) || 'anhang';
    const endung = anhangEndung(name);
    const typ = ANHANG_TYPEN[endung];
    if (!typ) return { fehler: `Dieser Dateityp ist nicht erlaubt: ${name}. Bitte PDF, Word, ODT, JPG oder PNG.`, status: 400 };
    if (!BASE64.test(eintrag.daten)) return { fehler: `Der Anhang ist nicht lesbar: ${name}.`, status: 400 };
    const inhalt = Buffer.from(eintrag.daten, 'base64');
    if (!inhalt.length) return { fehler: `Die Datei ist leer: ${name}.`, status: 400 };
    gesamt += inhalt.length;
    if (gesamt > ANHANG_MAX_BYTES) return { fehler: 'Die Anhänge sind zusammen größer als 3 MB.', status: 413 };
    if (!passtSignatur(inhalt.subarray(0, 8), endung)) return { fehler: `Die Datei passt nicht zu ihrer Endung: ${name}.`, status: 400 };
    anhaenge.push({ filename: name, content: inhalt, contentType: typ.mime });
  }
  return { anhaenge };
};

export async function handler(request: Request): Promise<Response> {
  const stand = einrichtung();
  if (request.method === 'GET') return antwort({ bereit: stand.bereit }, stand.bereit ? 200 : 503);
  if (request.method !== 'POST') return antwort({ fehler: 'Nur GET und POST.' }, 405);
  if (!stand.bereit) return antwort({ bereit: false, fehler: 'Der Online-Versand ist derzeit nicht eingerichtet. Bitte kontaktieren Sie uns per E-Mail oder Telefon.' }, 503);
  // Bound the actual stream, not only Content-Length (which clients can omit).
  let roh: unknown;
  let bytes = 0;
  try {
    const reader = request.body?.getReader();
    if (!reader) return antwort({ fehler: 'Anfrage nicht lesbar.' }, 400);
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES_ANHANG) {
        await reader.cancel();
        return antwort({ fehler: 'Anfrage ist zu groß.' }, 413);
      }
      chunks.push(value);
    }
    roh = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch { return antwort({ fehler: 'Anfrage nicht lesbar.' }, 400); }
  if (!istObjekt(roh) || typeof roh.art !== 'string' || !Object.hasOwn(PFLICHTFELDER, roh.art)) {
    return antwort({ fehler: 'Unbekannte Anfrageart.' }, 400);
  }
  const art = roh.art as RequestFormKind;
  // Die hohe Grenze gilt nur fuer Bewerbungen mit Anhang (5.29) — alle anderen bleiben bei 48 KB.
  if (art !== 'bewerbung' && bytes > MAX_BODY_BYTES) return antwort({ fehler: 'Anfrage ist zu groß.' }, 413);
  if (art !== 'bewerbung' && roh.anhaenge !== undefined) return antwort({ fehler: 'Anhänge sind nur bei Bewerbungen möglich.' }, 400);
  const geprueft = pruefeAnhaenge(roh.anhaenge);
  if ('fehler' in geprueft) return antwort({ fehler: geprueft.fehler }, geprueft.status);
  const { anhaenge } = geprueft;
  const eingang = roh.daten;
  if (!istObjekt(eingang)) return antwort({ fehler: 'Ungültige Formularfelder.' }, 400);
  if (Object.keys(eingang).length > MAX_FELDER) return antwort({ fehler: 'Zu viele Felder.' }, 400);
  if (typeof eingang[HONIGTOPF] === 'string' && eingang[HONIGTOPF].trim()) return antwort({ ok: true }, 202);
  const daten: Record<string, string> = {};
  for (const [feld, wert] of Object.entries(eingang)) {
    if (feld === HONIGTOPF) continue;
    if (!Object.hasOwn(FELDBESCHRIFTUNG, feld)) return antwort({ fehler: 'Unbekanntes Formularfeld.' }, 400);
    if (typeof wert !== 'string' && !(feld === 'zusatzleistungen' && Array.isArray(wert) && wert.every((v) => typeof v === 'string'))) {
      return antwort({ fehler: 'Ungültiger Feldwert.' }, 400);
    }
    const text = (Array.isArray(wert) ? wert.join(', ') : wert as string).trim();
    if (text.length > MAX_LAENGE) return antwort({ fehler: `Feld "${feld}" ist zu lang.` }, 400);
    if (text) daten[feld] = text;
  }
  const fehlend = PFLICHTFELDER[art].filter((feld) => !daten[feld]);
  if (fehlend.length) return antwort({ fehler: `Pflichtangaben fehlen: ${fehlend.join(', ')}` }, 400);
  // Mindestens eins je Gruppe (Terminanfrage: Telefon oder E-Mail, 2026-09-28).
  const keinsVon = (PFLICHT_EINS_VON[art] ?? []).filter((gruppe) => !gruppe.some((feld) => daten[feld]));
  if (keinsVon.length) return antwort({ fehler: `Bitte mindestens eine Angabe: ${keinsVon.map((g) => g.join(' oder ')).join('; ')}` }, 400);
  // Die E-Mail wird nur geprueft, wenn es eine gibt — bei der Terminanfrage darf sie fehlen.
  if (daten.email && !EMAIL.test(daten.email)) return antwort({ fehler: 'E-Mail-Adresse sieht nicht gültig aus.' }, 400);
  if (art === 'termin' && !LEISTUNGS_IDS.has(daten.service)) return antwort({ fehler: 'Unbekannte Leistung.' }, 400);
  // Zusatzleistungen (seit 2026-09-28): nur bekannte IDs und nur, was zur gewaehlten Leistung passt — dieselbe Regel
  // wie im Formular (`bereinigteZusaetze`). Ein veraltetes oder umgangenes Formular schickte sonst Unvereinbares mit
  // (Keramik als Leistung UND als Zusatz, Keramik neben Nano). Andere Anfragearten kennen keine Zusatzleistungen.
  if (art === 'termin' && Array.isArray(eingang.zusatzleistungen)) {
    const ids = eingang.zusatzleistungen as string[];
    if (ids.some((id) => !ZUSATZ_IDS.has(id))) return antwort({ fehler: 'Unbekannte Zusatzleistung.' }, 400);
    const passend = bereinigteZusaetze(daten.service, ids);
    if (passend.length) daten.zusatzleistungen = passend.join(', ');
    else delete daten.zusatzleistungen;
  } else if (art !== 'termin') delete daten.zusatzleistungen;
  const vorgang = vorgangsnummer();
  const transport = smtpTransport(stand);
  try {
    const anhangListe = anhaenge.map((a) => ({ name: a.filename, bytes: a.content.length }));
    const html = await render(createElement(AnfrageEmail, { art, daten, vorgang, anhaenge: anhangListe }));
    const ziel = empfaengerFuer(art, stand)!;
    const result = await transport.sendMail({
      from: { name: 'CarCare Center · Website', address: stand.absender! },
      // Antwortadresse nur, wenn der Kunde eine E-Mail genannt hat — sonst meldet sich der Betrieb telefonisch.
      to: ziel, ...(daten.email ? { replyTo: { address: daten.email } } : {}),
      subject: `[${vorgang}] ${BETREFF[art]} — ${(daten.company || daten.name || daten.contact).replace(/[\r\n]/g, ' ').slice(0, 160)}`,
      text: toPlainText(html), html,
      // Backlog 5.29: Anhaenge nur als Speicherinhalt (Buffer) — `disableFileAccess`/`disableUrlAccess`
      // bleiben wirksam, es wird nie ein Pfad oder eine URL aufgeloest. Nichts wird gespeichert.
      ...(anhaenge.length ? { attachments: anhaenge } : {}),
    });
    if (!result.accepted.length || result.rejected.length) throw new Error('SMTP_REJECTED');
    // SMTP acceptance is not proof of final delivery or forwarding. No customer data in logs.
    console.info('[anfrage] SMTP angenommen', { vorgang, art, anhaenge: anhaenge.length, messageId: result.messageId });
    return antwort({ ok: true, vorgang }, 200);
  } catch (error) {
    const code = istObjekt(error) && typeof error.code === 'string' ? error.code : 'SEND_FAILED';
    console.error('[anfrage] Versand fehlgeschlagen', { code });
    return antwort({ fehler: `Die Anfrage konnte nicht versendet werden. Bitte schreiben Sie direkt an ${KONTAKT_POSTFACH[art]}.` }, 502);
  } finally { transport.close(); }
}
export default { fetch: handler };
