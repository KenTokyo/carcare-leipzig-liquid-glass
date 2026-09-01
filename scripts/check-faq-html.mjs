/**
 * Post-Build-Waechter: steht jeder ausgezeichnete FAQ-Text auch im
 * AUSGELIEFERTEN HTML?
 *
 * `scripts/check-faq.mjs` prueft vor dem Build die Quellen — dass jede Route mit
 * FAQ-Markup auch einen sichtbaren Block rendert. Das genuegt nicht: eine
 * Komponente kann den Block rendern und den Text trotzdem nicht ausliefern.
 * Genau das war bis 2026-09-01 der Fall — `FAQSection` haengte geschlossene
 * Antworten per `{isOpen && …}` aus dem DOM aus, 14 ausgezeichnete Antworten
 * fehlten im statischen HTML.
 *
 * Google erlaubt FAQ-Inhalte hinter Aufklapp-Elementen, verlangt aber, dass sie
 * im initialen HTML stehen. SEO-GEO §2.1 ebenso: viele KI-Crawler rendern kein
 * oder nur eingeschraenktes JavaScript, und laut CLAUDE.md ist der FAQ-Block
 * ausdruecklich als maschinenlesbare Zusammenfassung fuer genau diese Systeme
 * gedacht.
 *
 * Laeuft in `postbuild` NACH dem Prerender — vorher existiert `dist/` nicht.
 */
import fs from 'node:fs';
import path from 'node:path';

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

const entitaeten = (s) => s
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
    '\n  Ursache ist fast immer bedingtes Rendern (z. B. `{isOpen && …}`).\n' +
    '  Inhalt hinter Aufklapp-Elementen muss im DOM bleiben; animiert wird die Hoehe.\n'
  );
  process.exit(1);
}

console.log(`[check-faq-html] ok: ${seiten.length} Seiten, ${geprueft} FAQPage-Texte, alle im ausgelieferten HTML.`);
