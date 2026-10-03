import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import React from 'react';
import nodemailer from 'nodemailer';
import { render, toPlainText } from 'react-email';
import { handler } from '../api/anfrage';
import AnfrageEmail from '../emails/AnfrageEmail';
import type { RequestFormKind } from '../types';

// A deliberately fake SMTP transport: these tests never send mail.
Object.assign(process.env, {
  SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_USER: 'website@example.com', SMTP_PASS: 'test-only',
  ANFRAGE_ABSENDER: 'website@example.com', ANFRAGE_EMPFAENGER: 'info@example.com', ANFRAGE_EMPFAENGER_BUSINESS: 'business@example.com',
  // Backlog 6.13: eigenes Postfach fuer Bewerbungen.
  ANFRAGE_EMPFAENGER_BEWERBUNG: 'bewerbung@example.com',
});
const base = { name: 'OALAB Funktionstest', company: 'OALAB Testbetrieb', contact: 'OALAB Testkontakt', phone: '0341 000000', email: 'test@example.com', description: 'TEST — keine echte Kundenanfrage.\nBitte ignorieren. <script>alert(1)</script> & Grüße', partnerType: 'rahmenvertrag' };
// Seit 2026-09-28 ist die Leistung bei der Terminanfrage Pflicht (bis dahin schlug dieser Test deshalb fehl).
// Bis 2026-10-02 stand hier „keramik“ (6.6, Versiegelung als Leistung). Seit 2026-10-03 ist sie wieder eine Leistung,
// mit eigenem Fall weiter unten; die Grundfaelle laufen mit einem Paket.
const datenFuer = (art: RequestFormKind) => (art === 'termin' ? { ...base, service: 'aussen' } : base);
const zielFuer: Record<RequestFormKind, string> = {
  business: 'business@example.com', termin: 'info@example.com', schaden: 'info@example.com', bewerbung: 'bewerbung@example.com',
};
const send = (body: unknown) => handler(new Request('https://example.com/api/anfrage', { method: 'POST', body: JSON.stringify(body) }));
let sends = 0;
let mail: Record<string, unknown> = {};
let failure = false;
const original = nodemailer.createTransport;
nodemailer.createTransport = (() => ({
  sendMail: async (value: Record<string, unknown>) => { sends++; mail = value; if (failure) throw new Error('test'); return { accepted: [value.to], rejected: [], messageId: 'test' }; },
  close() {},
})) as unknown as typeof original;
try {
  for (const art of ['business', 'termin', 'schaden', 'bewerbung'] as RequestFormKind[]) {
    const response = await send({ art, daten: datenFuer(art) });
    assert.equal(response.status, 200, `${art}: ${await response.clone().text()}`);
    assert.equal(mail.to, zielFuer[art]);
    assert.deepEqual(mail.replyTo, { address: base.email });
    assert.match(String(mail.html), /&lt;script&gt;/);
    assert.ok(!String(mail.html).includes('<script>'));
    assert.match(String(mail.text), /Rahmenvertrag \/ laufende Zusammenarbeit/);
    assert.match((await response.json()).vorgang, /^CC-\d{4}-[A-Z2-9]{5}$/);
  }
  assert.equal(sends, 4);
  // Leistung im Klartext; veraltete Werte werden abgewiesen: die gestrichene Verkaufsaufbereitung (5.19) und die
  // Frontscheibenversiegelung, die seit 6.7 nur noch Zusatzleistung ist.
  await send({ art: 'termin', daten: datenFuer('termin') });
  assert.match(String(mail.text), /Brillant Außenpflege/);
  assert.equal((await send({ art: 'termin', daten: { ...base, service: 'verkauf' } })).status, 400);
  assert.equal((await send({ art: 'termin', daten: { ...base, service: 'frontscheibe' } })).status, 400);
  // 6.6, seit 2026-10-03 wieder: Keramik als Leistung. Das Kaestchen kommt mit, auch wenn das Formular es nicht
  // schickt, und die Mail sagt, dass das Paket offen ist (Andre: nur zu Brillant oder Lackaufbereitung).
  assert.equal((await send({ art: 'termin', daten: { ...base, service: 'keramik' } })).status, 200);
  assert.match(String(mail.text), /Keramikversiegelung \(Paket offen: Brillant Außenpflege oder Lackaufbereitung\)/);
  assert.match(String(mail.text), /Keramikversiegelung \(ab 849,00 €\)/);
  // Nano als Leistung: Keramik faellt heraus (nur eine Versiegelung), die Motorreinigung passt zu beiden Paketen.
  assert.equal((await send({ art: 'termin', daten: { ...base, service: 'nano', zusatzleistungen: ['keramik', 'motor'] } })).status, 200);
  assert.ok(!String(mail.text).includes('Keramikversiegelung'), 'Keramik neben Nano');
  assert.match(String(mail.text), /Nanoversiegelung \(ab 299,00 €\)/);
  assert.match(String(mail.text), /Motorreinigung \(49,00 €\)/);
  // 6.7 serverseitig, dieselbe Regel wie im Formular. Keramik zur Brillant Außenpflege bleibt, mit Preis:
  assert.equal((await send({ art: 'termin', daten: { ...datenFuer('termin'), zusatzleistungen: ['keramik', 'felgen'] } })).status, 200);
  assert.match(String(mail.text), /Keramikversiegelung \(ab 849,00 €\)/);
  assert.match(String(mail.text), /Felgenintensivreinigung \(95,20 €\)/);
  // … zur Intensiv Innenraumreinigung faellt sie heraus, Ozon (zu allen Programmen) bleibt:
  assert.equal((await send({ art: 'termin', daten: { ...base, service: 'innen', zusatzleistungen: ['keramik', 'ozon'] } })).status, 200);
  assert.ok(!String(mail.text).includes('Keramikversiegelung'), 'Keramik ist zur Innenraumreinigung nicht buchbar');
  assert.match(String(mail.text), /Ozonbehandlung \(45,00 €\)/);
  // Motorreinigung: zur Premiumpflege „exklusiv“ nicht buchbar (nicht in Andres Liste), zur Lackaufbereitung schon.
  await send({ art: 'termin', daten: { ...base, service: 'exklusiv', zusatzleistungen: ['motor', 'cabrio'] } });
  assert.ok(!String(mail.text).includes('Motorreinigung') && String(mail.text).includes('Cabrio-Verdeckimprägnierung'));
  await send({ art: 'termin', daten: { ...base, service: 'lack', zusatzleistungen: ['motor'] } });
  assert.match(String(mail.text), /Motorreinigung \(49,00 €\)/);
  // „Nur Zusatzleistungen“: mindestens eine, die allein buchbar ist; Keramik allein zaehlt nicht.
  const nurZusatz = { ...base, service: 'nur-zusatz' };
  assert.equal((await send({ art: 'termin', daten: nurZusatz })).status, 400);
  const ohneEinzelne = await send({ art: 'termin', daten: { ...nurZusatz, zusatzleistungen: ['keramik'] } });
  assert.equal(ohneEinzelne.status, 400);
  assert.match((await ohneEinzelne.json()).fehler, /mindestens eine Zusatzleistung/);
  assert.equal((await send({ art: 'termin', daten: { ...nurZusatz, zusatzleistungen: ['ozon', 'heissvernebelung'] } })).status, 200);
  assert.match(String(mail.text), /Nur Zusatzleistungen/);
  assert.match(String(mail.text), /Heißvernebelung \(KC-Refresher\) \(59,00 €\)/);
  assert.equal((await send({ art: 'termin', daten: { ...datenFuer('termin'), zusatzleistungen: ['politur'] } })).status, 400);
  // 6.13: ohne eigenes Postfach gehen Bewerbungen an den allgemeinen Empfaenger, ein ungueltiges schaltet ab.
  delete process.env.ANFRAGE_EMPFAENGER_BEWERBUNG;
  assert.equal((await send({ art: 'bewerbung', daten: base })).status, 200);
  assert.equal(mail.to, 'info@example.com');
  process.env.ANFRAGE_EMPFAENGER_BEWERBUNG = 'keine-adresse';
  assert.equal((await handler(new Request('https://example.com/api/anfrage'))).status, 503);
  process.env.ANFRAGE_EMPFAENGER_BEWERBUNG = 'bewerbung@example.com';
  // Zaehler auf den Stand nach den vier Routen: Die Zusatzfaelle oben haben gesendet, die Pruefung darunter
  // („ungueltige Anfragen und Honigtopf senden nicht") zaehlt ab hier.
  sends = 4;
  for (const invalid of [null, [], { art: 'toString', daten: base }, { art: 'business', daten: null }, { art: 'business', daten: { ...base, email: 'a@b.de\r\nBcc:evil@b.de' } }, { art: 'business', daten: { ...base, description: {} } }, { art: 'business', daten: { ...base, to: 'evil@example.com' } }, { art: 'business', daten: { email: 'a@b.de' } }]) {
    assert.equal((await send(invalid)).status, 400);
  }
  assert.equal((await send({ art: 'business', daten: { ...base, website: 'bot' } })).status, 202);
  assert.equal(sends, 4, 'Invalid requests and honeypot must not send');
  assert.equal((await send({ art: 'business', daten: { ...base, description: 'x'.repeat(50_000) } })).status, 413);
  failure = true;
  const failed = await send({ art: 'business', daten: base });
  assert.equal(failed.status, 502);
  assert.ok(!(await failed.json()).vorgang);
  // 6.13: Die Fehlermeldung einer Bewerbung nennt das Bewerbungspostfach, nicht info@.
  assert.match((await (await send({ art: 'bewerbung', daten: base })).json()).fehler, /bewerbung@carcare-center\.de/);
  delete process.env.ANFRAGE_EMPFAENGER_BUSINESS;
  assert.equal((await send({ art: 'business', daten: base })).status, 503);
  assert.equal((await handler(new Request('https://example.com/api/anfrage'))).status, 503);
  console.log('PASS: four routes (applications to their own inbox, fallback, invalid address), booking rules of the add-on services (6.7) and sealings as service (6.6), reply-to, escaping, readable values, invalid input, size, SMTP failure, missing routing.');
} finally { nodemailer.createTransport = original; }

// Vercel runs emitted ESM without tsx's forgiving extension resolution.
// A successful Vite build and the tests above did not catch ERR_MODULE_NOT_FOUND.
execFileSync(process.execPath, ['node_modules/typescript/bin/tsc', 'api/anfrage.ts',
  '--target', 'ES2022', '--module', 'NodeNext', '--moduleResolution', 'NodeNext',
  '--jsx', 'react-jsx', '--esModuleInterop', '--skipLibCheck', '--outDir', 'output/email-runtime'], { stdio: 'inherit' });
execFileSync(process.execPath, ['--input-type=module', '-e',
  "import api from './output/email-runtime/api/anfrage.js'; const response = await api.fetch(new Request('http://localhost/api/anfrage')); if (response.status !== 503) throw new Error('Expected disabled configuration'); console.log('PASS: emitted ESM starts in plain Node without tsx or a bundler.');"], { stdio: 'inherit' });

await mkdir('output/email-preview', { recursive: true });
for (const art of ['business', 'termin', 'schaden', 'bewerbung'] as RequestFormKind[]) {
  const daten = { ...base, description: 'Dies ist eine Testnachricht für die Einrichtung des Formularversands. Keine echte Kundenanfrage.\n\nWir interessieren uns für eine regelmäßige Fahrzeugaufbereitung und möchten die Möglichkeiten einer Zusammenarbeit besprechen.' };
  const html = await render(<AnfrageEmail art={art} daten={daten} vorgang="CC-0908-TEST2" />);
  await writeFile(`output/email-preview/${art}.html`, html);
  assert.ok(toPlainText(html).includes(daten.email));
}
