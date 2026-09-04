// Prueft, ob `vercel.json` noch zur Routenliste passt (prebuild).
//
// WOZU
// `vercel.json` wird NICHT im Build erzeugt, sondern von Hand (`npm run vercel-config`)
// und mitcommittet — Vercel liest die Datei aus dem Repository, bevor der Build startet.
// Genau daraus folgt die Fehlerquelle: Wer eine Route in `scripts/routes.mjs` ergaenzt
// und den Generator vergisst, merkt davon zunaechst nichts. Prerender und Sitemap
// nehmen die Route sofort auf, lokal ist alles gruen.
//
// Auffallen wuerde es erst in dem Fall, fuer den die Rewrites ueberhaupt existieren:
// Setzt der Prerender auf Vercel aus (Chromium startet nicht — er ueberspringt sich
// dann bewusst, statt den Deploy zu blockieren), faengt normalerweise die Rewrite-Regel
// die Route ab. Fehlt sie, gibt es keinen Fallback, und die Seite antwortet mit 404.
// Am 2026-08-10 ist genau das passiert, damals fuer ALLE Routen.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST
// (Pflichtfrage aus CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md)
//
//  1. Sie vergleicht `vercel.json` gegen `routes.mjs` — nicht gegen `App.tsx`. Fehlt
//     eine Route in BEIDEN, sind sie einig und die Pruefung ist gruen, obwohl die Seite
//     unerreichbar ist. Sie beweist Konsistenz, nicht Vollstaendigkeit.
//  2. Sie prueft die Datei auf der Platte, nicht die committete. Wer regeneriert und
//     nicht committet, kommt hier durch — und Vercel bekommt trotzdem die alte Datei.
//     Der Hinweistext unten sagt deshalb ausdruecklich „und mitcommitten".
//  3. Sie sagt nichts darueber, ob eine Regel auch funktioniert. Ein Rewrite auf ein
//     falsches Ziel besteht sie anstandslos.
//
// Sie faengt genau einen Fall: Routenliste geaendert, Generator vergessen. Das ist
// der Fall, der tatsaechlich eintritt.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRoutes } from './routes.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const datei = path.join(wurzel, 'vercel.json');

if (!fs.existsSync(datei)) {
  console.error('\n[check-vercel-config] BUILD ABGEBROCHEN — vercel.json fehlt.');
  console.error('  Erzeugen mit: npm run vercel-config  (und mitcommitten)\n');
  process.exit(1);
}

/** `/` braucht keine Regel — dafuer liegt `dist/index.html` immer vor. Gleiche Logik
 *  wie in generate-vercel-config.mjs; weicht sie dort ab, schlaegt diese Pruefung an. */
const erwartet = new Set(getRoutes().map((r) => r.path).filter((p) => p !== '/'));
const vorhanden = new Set((JSON.parse(fs.readFileSync(datei, 'utf8')).rewrites ?? []).map((r) => r.source));

const fehlen = [...erwartet].filter((p) => !vorhanden.has(p));
const zuviel = [...vorhanden].filter((p) => !erwartet.has(p));

if (fehlen.length || zuviel.length) {
  console.error('\n[check-vercel-config] BUILD ABGEBROCHEN — vercel.json passt nicht zur Routenliste.');
  if (fehlen.length) {
    console.error(`\n  ${fehlen.length} Route(n) ohne Rewrite-Regel:`);
    for (const p of fehlen) console.error('    - ' + p);
    console.error('\n  Folge: Setzt der Prerender auf Vercel aus, antworten diese Routen mit 404.');
  }
  if (zuviel.length) {
    console.error(`\n  ${zuviel.length} Regel(n) ohne Route:`);
    for (const p of zuviel) console.error('    - ' + p);
    console.error('\n  Folge: Geloeschte Pfade antworten mit 200 statt 404 (Soft-404).');
  }
  console.error('\n  Beheben mit: npm run vercel-config  — und die Datei MITCOMMITTEN.');
  console.error('  Vercel liest sie aus dem Repository, bevor der Build startet.\n');
  process.exit(1);
}

console.log(`[check-vercel-config] ok: ${vorhanden.size} Rewrite-Regeln, deckungsgleich mit der Routenliste.`);
