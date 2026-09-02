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
 *     npm run smoke -- --seit HEAD         # zusaetzlich: Deployment muss juenger sein
 *     npm run smoke -- --seit 2026-09-03T01:00:00Z
 *
 * WARUM `--seit`
 * Schlaegt ein Deploy fehl, bleibt der VORHERIGE Stand live. Von aussen sieht das
 * identisch aus — die Seite antwortet, der Inhalt stimmt, der Test wird gruen. Genau
 * so haette am 2026-09-03 die Aenderung an `ensure-chromium.mjs` als verifiziert
 * gegolten, obwohl der zugehoerige Build gar nicht gelaufen waere.
 *
 * Der `Last-Modified`-Header traegt die Bauzeit des ausgelieferten Deployments und
 * unterscheidet die beiden Faelle. Mit `--seit HEAD` verlangt der Test, dass das
 * Deployment juenger ist als der letzte lokale Commit.
 *
 * OHNE Parameter verhaelt sich alles wie bisher — ein schneller Lauf ohne Argumente
 * bleibt moeglich.
 *
 * Exitcode 1, sobald eine Pruefung fehlschlaegt — damit taugt es auch fuer CI.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getRoutes } from './routes.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STANDARD_URL = 'https://carcare-center.vercel.app';

const argv = process.argv.slice(2);
const seitIndex = argv.findIndex((a) => a === '--seit');
const seitRoh = seitIndex >= 0 ? argv[seitIndex + 1] : undefined;
const urlArg = argv.filter((a, i) => i !== seitIndex && i !== seitIndex + 1).find((a) => a.startsWith('http'));
const basis = (urlArg || process.env.SMOKE_URL || STANDARD_URL).replace(/\/$/, '');

/**
 * `--seit` aufloesen: HEAD -> Zeitstempel des letzten Commits, sonst als Datum parsen.
 *
 * `gesetzt` unterscheidet "Flag gar nicht angegeben" von "Flag ohne Wert". Ohne diese
 * Unterscheidung lief `npm run smoke -- --seit` stillschweigend als Lauf OHNE Pruefung
 * durch und meldete gruen — die Pruefung waere genau dann ausgefallen, wenn jemand sie
 * ausdruecklich wollte.
 */
function mindestalterBestimmen(roh, gesetzt) {
  if (!gesetzt) return null;
  if (roh === undefined || !roh || roh.startsWith('--')) {
    console.error('[smoke] --seit erwartet einen Wert: HEAD oder einen Zeitstempel.');
    process.exit(1);
  }
  if (roh.toUpperCase() === 'HEAD') {
    try {
      const iso = execFileSync('git', ['log', '-1', '--format=%cI'], { cwd: wurzel, encoding: 'utf8' }).trim();
      return { zeit: new Date(iso), quelle: `letzter Commit (${iso})` };
    } catch (err) {
      console.error(`[smoke] --seit HEAD: Commit-Zeitstempel nicht lesbar — ${err.message}`);
      process.exit(1);
    }
  }
  const d = new Date(roh);
  if (Number.isNaN(d.getTime())) {
    console.error(`[smoke] --seit: "${roh}" ist kein gueltiger Zeitstempel.`);
    process.exit(1);
  }
  return { zeit: d, quelle: roh };
}

const mindestalter = mindestalterBestimmen(seitRoh, seitIndex >= 0);

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

/**
 * Marker, der auf JEDER Seite im ausgelieferten Text stehen muss — er belegt, dass
 * ueberhaupt gerenderter Inhalt und nicht nur die SPA-Huelle ausgeliefert wird.
 *
 * Beim ersten Lauf stand hier "Meisterbetrieb". Das war falsch gewaehlt: Der Begriff
 * steht nicht auf Autoglas, Kontakt, Karriere und den Wissens-Artikeln. Der Test
 * meldete dort Fehler, obwohl die Seiten in Ordnung waren.
 *
 * "BS CarCare GmbH" steht ueber den Footer auf jeder Seite und ist als juristische
 * Firmierung zugleich der stabilste Textbaustein im Projekt — er faellt auch bei
 * kuenftigen Textueberarbeitungen nicht weg (CLAUDE.md, Textregel 1).
 */
const MARKER = 'BS CarCare GmbH';

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
console.log(`[smoke] ${basis} — ${routen.length} Routen`);
if (mindestalter) console.log(`[smoke] Deployment muss juenger sein als: ${mindestalter.quelle}`);
console.log('');

const zeilen = [];
const fehler = [];
/** Bauzeit des ausgelieferten Deployments, aus dem Last-Modified der ersten Antwort. */
let deploymentZeit = null;

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

  if (deploymentZeit === null) {
    const lm = res.headers.get('last-modified');
    deploymentZeit = lm ? new Date(lm) : undefined;
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

// ---------- Alter des Deployments ----------
if (mindestalter) {
  if (deploymentZeit === undefined) {
    fehler.push(
      'Alter des Deployments nicht pruefbar: die Antwort trug keinen Last-Modified-Header. ' +
        'Bei Vercel ist er normalerweise gesetzt — liegt ein Proxy oder CDN davor?'
    );
  } else if (deploymentZeit < mindestalter.zeit) {
    fehler.push(
      'AUSGELIEFERTES DEPLOYMENT IST AELTER ALS ERWARTET — vermutlich ist der letzte\n' +
        '    Deploy fehlgeschlagen und der vorherige Stand ist noch live. Schau ins\n' +
        '    Vercel-Dashboard auf den Status des juengsten Deployments, nicht in den Code.\n' +
        `    ausgeliefert : ${deploymentZeit.toISOString()}\n` +
        `    erwartet ab  : ${mindestalter.zeit.toISOString()}  (${mindestalter.quelle})`
    );
  } else {
    console.log(`\n[smoke] Deployment gebaut am ${deploymentZeit.toISOString()} — juenger als verlangt.`);
  }
}

if (fehler.length) {
  console.error(`\n[smoke] FEHLGESCHLAGEN — ${fehler.length} Befund(e):\n`);
  for (const f of fehler) console.error('  - ' + f);
  console.error('');
  process.exit(1);
}
console.log(`\n[smoke] ok: ${routen.length} Routen, alle mit JSON-LD, FAQPage und Marker.`);
