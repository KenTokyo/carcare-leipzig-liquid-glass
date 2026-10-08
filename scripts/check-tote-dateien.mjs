// Messwerkzeug: Quelldateien, die von keinem Einstieg aus erreichbar sind (`npm run tote-dateien`).
//
// HINTERGRUND: `components/Hero.tsx` lag seit dem Redesign a701ce9 ohne Import im Repository
// und stoerte mit veralteten Saetzen die Textsuchen im Lektorat (L17-17). Geloescht am
// 2026-10-08, siehe docs/tote-komponenten/tasks/2026-10-08-tote-komponenten-tasks.md.
// Paket C hatte festgehalten: Verwaisung ueber den Importgraphen belegen, nicht per Pfad-Grep.
// Genau das macht dieses Skript, wiederholbar.
//
// VERFAHREN: Alle Quelldateien (getrackt und neu, ohne docs/ public/ output/ dist/), Importe
// ueber den TypeScript-Compiler (statisch, dynamisch mit festem Pfad, Re-Exporte, require),
// aufgeloest mit den Optionen aus tsconfig.json (`@/`-Alias). Einstiege: die Modul-Skripte aus
// index.html, alles unter api/ und scripts/, die Konfigdateien im Wurzelordner. Was von dort
// nicht erreichbar ist, ist tot, auch wenn eine andere tote Datei es importiert.
// Dateien mit „BEWUSST GEPARKT" im Kopf werden gezeigt, aber nicht als Fehler gezaehlt.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus
// CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md):
//
//  1. Erreichbar heisst nicht gerendert. Ein Import, der nie benutzt wird, oder eine Komponente
//     hinter einer Bedingung, die nie zutrifft, haelt die Datei am Leben. Gegenmittel fuer den
//     ersten Fall: `tsc --noEmit --noUnusedLocals` (2026-10-08: keine Komponente betroffen).
//  2. Jedes Skript unter scripts/ zaehlt als Einstieg. Ein Skript, das niemand mehr aufruft,
//     haelt seine Importe am Leben und wird selbst nie als tot gemeldet.
//  3. Der Vermerk „BEWUSST GEPARKT" nimmt eine Datei dauerhaft aus. Deshalb steht jede
//     geparkte Datei bei jedem Lauf in der Ausgabe, statt still zu verschwinden.
//  4. Nur Code. CSS unter styles/ und Dateien unter public/ sieht es nicht (Bilder: `npm run bilder`).
//
// In die andere Richtung, also LAUT statt still: Laedt jemand eine Datei nur ueber einen
// berechneten Pfad (`import(variable)`, `new URL(..., import.meta.url)`, `fs.readFileSync`),
// meldet das Skript sie als tot. Solche Stellen listet es als Hinweis, und bei jedem Fund nennt
// es Dateien, die den Dateinamen als Text enthalten. `import.meta.glob` bricht die Messung ab.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SELBST = 'scripts/check-tote-dateien.mjs';
const AUSSEN_VOR = /^(docs|public|output|dist|node_modules|parallax-scroll-kit|\.cache)\//;
const QUELLE = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/;
const TEXT = /\.(ts|tsx|mts|cts|js|jsx|mjs|cjs|json|html|css)$/;

const alle = execSync('git ls-files --cached --others --exclude-standard', { cwd: wurzel, encoding: 'utf8' })
  .split('\n').filter((f) => f && !AUSSEN_VOR.test(f) && fs.existsSync(path.join(wurzel, f)));
const quellen = alle.filter((f) => QUELLE.test(f));
const lies = (f) => fs.readFileSync(path.join(wurzel, f), 'utf8');
const rel = (abs) => path.relative(wurzel, abs).split(path.sep).join('/');

const tsconfig = ts.parseJsonConfigFileContent(
  ts.readConfigFile(path.join(wurzel, 'tsconfig.json'), ts.sys.readFile).config, ts.sys, wurzel);
const optionen = { ...tsconfig.options, allowJs: true };

const kanten = new Map();
const importeure = new Map();
const unaufgeloest = [];
const berechnet = [];
const globs = [];
for (const datei of quellen) {
  const text = lies(datei);
  const ziele = new Set();
  for (const { fileName: spec } of ts.preProcessFile(text, true, true).importedFiles) {
    if (!/^(\.|\/|@\/)/.test(spec) || /\.(css|json|svg|png|jpe?g|webp|avif|woff2?|mp4|webm)(\?.*)?$/.test(spec)) continue;
    const treffer = ts.resolveModuleName(spec, path.join(wurzel, datei), optionen, ts.sys).resolvedModule;
    if (!treffer) { unaufgeloest.push(`${datei}: ${spec}`); continue; }
    const ziel = rel(treffer.resolvedFileName);
    if (ziel.startsWith('node_modules/')) continue;
    ziele.add(ziel);
    if (!importeure.has(ziel)) importeure.set(ziel, new Set());
    importeure.get(ziel).add(datei);
  }
  text.split('\n').forEach((zeile, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(zeile)) return; // Kommentare (auch dieser Kopf) nennen die Muster nur
    if (/\bimport\(\s*[^'"`\s)]/.test(zeile) || /new URL\([^)]*import\.meta\.url/.test(zeile)) berechnet.push(`${datei}:${i + 1}`);
    if (/import\.meta\.glob\s*[(<]/.test(zeile)) globs.push(`${datei}:${i + 1}`);
  });
  kanten.set(datei, ziele);
}

const ausHtml = [...lies('index.html').matchAll(/<script[^>]*type="module"[^>]*src="\/?([^"]+)"/g)].map((m) => m[1]);
const einstiege = [...new Set([
  ...ausHtml,
  ...quellen.filter((f) => /^(api|scripts)\//.test(f) || /^[^/]*(\.config\.[cm]?[jt]s|rc\.c?js)$/.test(f)),
])];
const erreicht = new Set();
const offen = [...einstiege];
while (offen.length) {
  const f = offen.pop();
  if (erreicht.has(f)) continue;
  erreicht.add(f);
  offen.push(...(kanten.get(f) ?? []));
}

const textdateien = alle.filter((f) => TEXT.test(f));
const tot = [];
const geparkt = [];
for (const datei of quellen.filter((f) => !erreicht.has(f))) {
  const kopf = lies(datei).split('\n').slice(0, 15).join('\n');
  // Wortgrenzen: `components/Hero` darf `components/HeroSection` nicht treffen.
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  const muster = new RegExp(`(?<![\\w-])${esc(path.basename(datei))}|${esc(datei.replace(QUELLE, ''))}(?![\\w-])`);
  const erwaehnt = textdateien.filter((f) => f !== datei && f !== SELBST && muster.test(lies(f)));
  const von = [...(importeure.get(datei) ?? [])];
  const zeile = [datei,
    von.length ? `importiert nur von toten Dateien: ${von.join(', ')}` : '0 Importe',
    erwaehnt.length ? `Name steht als Text in: ${erwaehnt.join(', ')} (per Pfad gelesen?)` : null,
  ].filter(Boolean).join(' · ');
  (/BEWUSST GEPARKT/.test(kopf) ? geparkt : tot).push(zeile);
}

console.log(`[tote-dateien] ${quellen.length} Quelldateien, ${einstiege.length} Einstiege, ${erreicht.size} erreichbar.`);
if (berechnet.length) console.log(`[tote-dateien] Hinweis, berechnete Importpfade (Ziel unbekannt): ${berechnet.join(', ')}`);
if (unaufgeloest.length) console.log(`[tote-dateien] Unaufgeloeste Importe:\n  ${unaufgeloest.join('\n  ')}`);
for (const g of geparkt) console.log(`[tote-dateien] geparkt (Kopfvermerk): ${g}`);
if (globs.length) {
  console.error(`[tote-dateien] FEHLER: import.meta.glob in ${globs.join(', ')}. Das Skript kann Glob-Ziele nicht aufloesen; erst erweitern, dann messen.`);
  process.exit(1);
}
if (tot.length) {
  console.error(`[tote-dateien] ${tot.length} tote Datei(en), von keinem Einstieg erreichbar:`);
  for (const t of tot) console.error(`  ${t}`);
  process.exit(1);
}
console.log('[tote-dateien] OK: keine toten Dateien.');
