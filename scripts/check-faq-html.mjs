/**
 * Post-Build-Waechter: steht jeder ausgezeichnete FAQ-Text auch im
 * AUSGELIEFERTEN HTML — und ist ueberhaupt jede Route vorgerendert worden?
 *
 * `scripts/check-faq.mjs` prueft vor dem Build die Quellen. Das genuegt nicht: eine
 * Komponente kann den Block rendern und den Text trotzdem nicht ausliefern. Genau das
 * war bis 2026-09-01 der Fall — `FAQSection` haengte geschlossene Antworten per
 * `{isOpen && …}` aus dem DOM aus.
 *
 * ⚠️ VOLLSTAENDIGKEITSPRUEFUNG (ergaenzt 2026-09-03, aus Schaden gelernt)
 * Dieses Skript prueft, was es findet. Findet es nichts, meldete es frueher "ok".
 * Am 2026-09-02 brach der Prerender auf Vercel ab (Chromium ohne `libnspr4.so`),
 * es blieb allein `dist/index.html` uebrig — und im Build-Log stand:
 *
 *     [check-faq-html] ok: 1 Seiten, 0 FAQPage-Texte, alle im ausgelieferten HTML.
 *
 * Ein Totalausfall als Erfolg gemeldet. Deshalb steht der Abgleich gegen
 * `scripts/routes.mjs` jetzt VOR der Inhaltspruefung: weniger Seiten als erwartet ist
 * ein Fehler, kein "ok". Dasselbe gilt, wenn kein einziger FAQPage-Block gefunden wird,
 * obwohl `data/faqs.ts` welche vorsieht.
 *
 * Laeuft in `postbuild` NACH dem Prerender — vorher existiert `dist/` nicht.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRoutes } from './routes.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WURZEL = 'dist';

if (!fs.existsSync(WURZEL)) {
  console.error('[check-faq-html] dist/ fehlt — laeuft dieses Skript vor dem Prerender?');
  process.exit(1);
}

const seiten = [];
(function w(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    f.isDirectory() ? w(p) : f.name === 'index.html' && seiten.push(p);
  }
})(WURZEL);

// ---------- 1. Vollstaendigkeit: ist jede Route ueberhaupt vorgerendert? ----------
const erwartet = getRoutes().map((r) => r.path);
const dateiFuer = (route) =>
  route === '/' ? path.join(WURZEL, 'index.html') : path.join(WURZEL, route.slice(1), 'index.html');
const fehlendeSeiten = erwartet.filter((r) => !fs.existsSync(dateiFuer(r)));

if (fehlendeSeiten.length) {
  console.error(
    `\n[check-faq-html] BUILD ABGEBROCHEN — ${seiten.length} von ${erwartet.length} Seiten vorgerendert.` +
      `\n  Es fehlen ${fehlendeSeiten.length} Route(n):\n`
  );
  for (const r of fehlendeSeiten.slice(0, 10)) console.error('  - ' + r);
  if (fehlendeSeiten.length > 10) console.error(`  … und ${fehlendeSeiten.length - 10} weitere`);
  console.error(
    '\n  Fast immer heisst das: der Prerender ist ausgestiegen. Die Ursache steht' +
      '\n  weiter oben im Log, in der Warnung von scripts/prerender.mjs.\n'
  );
  process.exit(1);
}

/** Wie viele Routen laut Quelle einen FAQ-Block fuehren. */
const faqRoutenAnzahl = [
  ...fs.readFileSync(path.join(wurzel, 'data/faqs.ts'), 'utf8').matchAll(/^ {2}'(\/[^']*)':/gm),
].length;

// ---------- 2. Inhalt: steht jeder ausgezeichnete Text auch im HTML? ----------
const entitaeten = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

/** Sichtbarer Text: Skripte raus, Tags raus, Entitaeten aufloesen, Whitespace normalisieren. */
const sichtbarerText = (html) =>
  entitaeten(html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');

const normal = (s) => entitaeten(s).replace(/\s+/g, ' ').trim();

let geprueft = 0;
const fehler = [];

for (const datei of seiten) {
  const html = fs.readFileSync(datei, 'utf8');
  const text = sichtbarerText(html);
  const route = '/' + path.relative(WURZEL, path.dirname(datei)).split(path.sep).join('/');

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let daten;
    try {
      daten = JSON.parse(m[1]);
    } catch {
      fehler.push(`${route}: JSON-LD laesst sich nicht parsen.`);
      continue;
    }
    if (daten['@type'] !== 'FAQPage') continue;
    for (const eintrag of daten.mainEntity ?? []) {
      const frage = normal(eintrag.name ?? '');
      const antwort = normal(eintrag.acceptedAnswer?.text ?? '');
      geprueft += 2;
      if (!frage || !text.includes(frage)) {
        fehler.push(`${route}: FRAGE ausgezeichnet, aber nicht im HTML — "${frage.slice(0, 80)}"`);
      }
      if (!antwort || !text.includes(antwort)) {
        fehler.push(`${route}: ANTWORT ausgezeichnet, aber nicht im HTML — "${antwort.slice(0, 80)}"`);
      }
    }
  }
}

if (fehler.length) {
  console.error('\n[check-faq-html] BUILD ABGEBROCHEN — FAQPage zeichnet Text aus, der nicht ausgeliefert wird:\n');
  for (const f of fehler) console.error('  - ' + f);
  console.error(
    '\n  Ursache ist fast immer bedingtes Rendern (z. B. `{isOpen && …}`).' +
      '\n  Inhalt hinter Aufklapp-Elementen muss im DOM bleiben; animiert wird die Hoehe.\n'
  );
  process.exit(1);
}

// ---------- 3. Gar kein FAQPage, obwohl die Quelle welche vorsieht ----------
if (geprueft === 0 && faqRoutenAnzahl > 0) {
  console.error(
    `\n[check-faq-html] BUILD ABGEBROCHEN — kein einziger FAQPage-Block im gebauten HTML,` +
      `\n  obwohl data/faqs.ts ${faqRoutenAnzahl} Routen mit FAQ-Block fuehrt.` +
      '\n  Das Markup entsteht dann erst im Browser und fehlt im ausgelieferten HTML vollstaendig.\n'
  );
  process.exit(1);
}

console.log(
  `[check-faq-html] ok: ${seiten.length}/${erwartet.length} Seiten, ${geprueft} FAQPage-Texte, alle im ausgelieferten HTML.`
);
