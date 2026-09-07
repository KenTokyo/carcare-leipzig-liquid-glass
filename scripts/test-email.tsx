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
});
const base = { name: 'OALAB Funktionstest', company: 'OALAB Testbetrieb', contact: 'OALAB Testkontakt', phone: '0341 000000', email: 'test@example.com', description: 'TEST — keine echte Kundenanfrage.\nBitte ignorieren. <script>alert(1)</script> & Grüße', partnerType: 'rahmenvertrag' };
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
    const response = await send({ art, daten: base });
    assert.equal(response.status, 200, `${art}: ${await response.clone().text()}`);
    assert.equal(mail.to, art === 'business' ? 'business@example.com' : 'info@example.com');
    assert.deepEqual(mail.replyTo, { address: base.email });
    assert.match(String(mail.html), /&lt;script&gt;/);
    assert.ok(!String(mail.html).includes('<script>'));
    assert.match(String(mail.text), /Rahmenvertrag \/ laufende Zusammenarbeit/);
    assert.match((await response.json()).vorgang, /^CC-\d{4}-[A-Z2-9]{5}$/);
  }
  assert.equal(sends, 4);
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
  delete process.env.ANFRAGE_EMPFAENGER_BUSINESS;
  assert.equal((await send({ art: 'business', daten: base })).status, 503);
  assert.equal((await handler(new Request('https://example.com/api/anfrage'))).status, 503);
  console.log('PASS: four routes, reply-to, escaping, readable values, invalid input, size, SMTP failure, missing routing.');
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
