import { createElement } from 'react';
import { render, toPlainText } from 'react-email';
import nodemailer from 'nodemailer';
import { randomInt } from 'node:crypto';
import type { RequestFormKind } from '../types';
import { BETREFF, FELDBESCHRIFTUNG, HONIGTOPF, MAX_FELDER, MAX_LAENGE, PFLICHTFELDER } from '../data/anfrageSchema';
import AnfrageEmail from '../emails/AnfrageEmail';

/** Node.js is required for SMTP. Credentials stay in the server environment. */
export const maxDuration = 30;
const EMAIL = /^[^@\s<>\r\n]+@[^@\s<>\r\n]+\.[^@\s<>\r\n]+$/;
const ZEICHEN = '23456789ABCDEFGHJKMNPQRSTVWXYZ';
const MAX_BODY_BYTES = 48_000;
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
  const bereit = Boolean(host && [465, 587].includes(port) && user && pass &&
    absender && EMAIL.test(absender) && empfaenger && EMAIL.test(empfaenger) && business && EMAIL.test(business));
  return { host, port, user, pass, absender, empfaenger, business, bereit };
};

/** No silent fallback: business routing must be configured before enabling forms. */
export const empfaengerFuer = (art: RequestFormKind, stand = einrichtung()) =>
  art === 'business' ? stand.business : stand.empfaenger;

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

export async function handler(request: Request): Promise<Response> {
  const stand = einrichtung();
  if (request.method === 'GET') return antwort({ bereit: stand.bereit }, stand.bereit ? 200 : 503);
  if (request.method !== 'POST') return antwort({ fehler: 'Nur GET und POST.' }, 405);
  if (!stand.bereit) return antwort({ bereit: false, fehler: 'Der Online-Versand ist derzeit nicht eingerichtet. Bitte kontaktieren Sie uns per E-Mail oder Telefon.' }, 503);
  // Bound the actual stream, not only Content-Length (which clients can omit).
  let roh: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return antwort({ fehler: 'Anfrage nicht lesbar.' }, 400);
    const chunks: Uint8Array[] = [];
    let bytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
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
  if (!EMAIL.test(daten.email)) return antwort({ fehler: 'E-Mail-Adresse sieht nicht gültig aus.' }, 400);
  const vorgang = vorgangsnummer();
  const transport = smtpTransport(stand);
  try {
    const html = await render(createElement(AnfrageEmail, { art, daten, vorgang }));
    const ziel = empfaengerFuer(art, stand)!;
    const result = await transport.sendMail({
      from: { name: 'CarCare Center · Website', address: stand.absender! },
      to: ziel, replyTo: { address: daten.email },
      subject: `[${vorgang}] ${BETREFF[art]} — ${(daten.company || daten.name || daten.contact).replace(/[\r\n]/g, ' ').slice(0, 160)}`,
      text: toPlainText(html), html,
    });
    if (!result.accepted.length || result.rejected.length) throw new Error('SMTP_REJECTED');
    // SMTP acceptance is not proof of final delivery or forwarding. No customer data in logs.
    console.info('[anfrage] SMTP angenommen', { vorgang, art, messageId: result.messageId });
    return antwort({ ok: true, vorgang }, 200);
  } catch (error) {
    const code = istObjekt(error) && typeof error.code === 'string' ? error.code : 'SEND_FAILED';
    console.error('[anfrage] Versand fehlgeschlagen', { code });
    return antwort({ fehler: `Die Anfrage konnte nicht versendet werden. Bitte schreiben Sie direkt an ${art === 'business' ? 'abosse@carcare-center.de' : 'info@carcare-center.de'}.` }, 502);
  } finally { transport.close(); }
}
export default { fetch: handler };
