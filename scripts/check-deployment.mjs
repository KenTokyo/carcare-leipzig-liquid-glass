/**
 * Smoke-Test gegen ein DEPLOYMENT, nicht gegen den lokalen Build.
 *
 * WARUM ES DEN BRAUCHT
 * `check-faq.mjs` und `check-faq-html.mjs` pruefen, was `npm run build` hier auf der
 * Maschine erzeugt. Das ist nicht dasselbe wie das, was Vercel ausliefert — und der
 * Unterschied war am 2026-09-02 kein theoretischer:
 *   - Zwei neue Routen gaben 404, weil `vercel.json` sie nicht kannte. Lokal fiel das
 *     nie auf, weil dort statische Prerender-Dateien direkt ausgeliefert werden und
 *     die Rewrite-Regeln gar nicht gebraucht werden.
 *   - Der Prerender setzt auf Vercel aus. Alle Routen lieferten dieselbe 12-KB-
 *     SPA-Huelle: kein JSON-LD, kein FAQPage, kein Text im HTML. `check-faq-html.mjs`
 *     findet dort schlicht nichts zu pruefen und meldet deshalb "ok".
 *
 * Dieses Skript schliesst genau diese Luecke. Es laeuft NICHT im Build (das Deployment
 * existiert dann noch nicht), sondern nach einem Deploy von Hand:
 *
 *     npm run smoke                        # gegen die Standard-URL unten
 *     npm run smoke -- https://…           # gegen eine beliebige Deployment-URL
 *
 * Exitcode 1, sobald eine Pruefung fehlschlaegt — damit taugt es auch fuer CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRoutes } from './routes.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STANDARD_URL = 'https://carcare-center.vercel.app';
const basis = (process.argv[2] || process.env.SMOKE_URL || STANDARD_URL).replace(/\/$/, '');

/**
 * Routen, die eine `FAQPage` fuehren muessen:
 *  - alle Schluessel aus `data/faqs.ts` (textuell gelesen wie in check-faq.mjs)
 *  - alle Wissens-Artikel — die speisen ihr `faqSchema` aus `article.faqs`
 *    (siehe seo/pageSchemas.ts) und stehen deshalb nicht in faqsByRoute.
 */
const faqRouten = new Set([
  ...[...fs.readFileSync(path.join(wurzel, 'data/faqs.ts'), 'utf8').matchAll(/^ {2}'(\/[^']*)':/gm)].map((m) => m[1]),
  ...[...fs.readFileSync(path.join(wurzel, 'data/knowledgeArticles.ts'), 'utf8')
    .matchAll(/path:\s*'(\/autoaufbereitung-wissen\/[^']+)'/g)].map((m) => m[1]),
]);

const MARKER = 'Meisterbetrieb';

const sichtbarerText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

const jsonLdBloecke = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        return null;
      }
    });

const routen = getRoutes().map((r) => r.path);
console.log(`[smoke] ${basis} — ${routen.length} Routen\n`);

const zeilen = [];
const fehler = [];

for (const route of routen) {
  const url = basis + route;
  let res, html;
  try {
    res = await fetch(url, { redirect: 'follow' });
    html = await res.text();
  } catch (err) {
    fehler.push(`${route}: nicht erreichbar — ${err.message}`);
    zeilen.push({ route, status: 'ERR', groesse: 0, jsonLd: 0, faq: '—', marker: '—' });
    continue;
  }

  const bloecke = jsonLdBloecke(html);
  const hatFaq = bloecke.some((b) => b && b['@type'] === 'FAQPage');
  const text = sichtbarerText(html);
  const hatMarker = text.includes(MARKER);
  const faqErwartet = faqRouten.has(route);

  zeilen.push({
    route,
    status: res.status,
    groesse: html.length,
    jsonLd: bloecke.filter(Boolean).length,
    faq: faqErwartet ? (hatFaq ? 'ja' : 'FEHLT') : '—',
    marker: hatMarker ? 'ja' : 'FEHLT',
  });

  if (res.status !== 200) fehler.push(`${route}: HTTP ${res.status}`);
  if (bloecke.filter(Boolean).length === 0) fehler.push(`${route}: kein JSON-LD im ausgelieferten HTML`);
  if (faqErwartet && !hatFaq) fehler.push(`${route}: FAQPage fehlt im ausgelieferten HTML`);
  if (!hatMarker) fehler.push(`${route}: Marker "${MARKER}" nicht im ausgelieferten Text`);
}

const b = (s, n) => String(s).padEnd(n);
console.log(b('Route', 58) + b('HTTP', 6) + b('Bytes', 9) + b('JSON-LD', 9) + b('FAQPage', 9) + 'Marker');
console.log('-'.repeat(100));
for (const z of zeilen) {
  console.log(b(z.route, 58) + b(z.status, 6) + b(z.groesse, 9) + b(z.jsonLd, 9) + b(z.faq, 9) + z.marker);
}

const groessen = [...new Set(zeilen.map((z) => z.groesse))];
if (groessen.length === 1 && zeilen.length > 1) {
  console.log(
    `\n[smoke] HINWEIS: Alle ${zeilen.length} Routen liefern exakt ${groessen[0]} Bytes.\n` +
      '        Das ist das Muster einer reinen SPA-Huelle — der Prerender hat nicht gegriffen.'
  );
}

if (fehler.length) {
  console.error(`\n[smoke] FEHLGESCHLAGEN — ${fehler.length} Befund(e):\n`);
  for (const f of fehler) console.error('  - ' + f);
  console.error('');
  process.exit(1);
}
console.log(`\n[smoke] ok: ${routen.length} Routen, alle mit JSON-LD, FAQPage und Marker.`);
