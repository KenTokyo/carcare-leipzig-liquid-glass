// Misst Title- und Description-Laenge im AUSGELIEFERTEN HTML (SEO-GEO §3.1).
//
// Zielkorridore: Title 50-60 Zeichen, Description 140-160 Zeichen.
//
// ⚠️ Was diese Pruefung besteht, ohne dass die Sache in Ordnung ist:
//  1. Sie zaehlt Zeichen. Ein Title im Korridor kann trotzdem nichtssagend sein.
//  2. Sie prueft NICHT auf Einzigartigkeit gegenueber anderen Seiten — das macht der
//     zweite Teil der Ausgabe (Dubletten), aber nur exakt gleiche Texte.
//  3. Google schneidet nach Pixelbreite ab, nicht nach Zeichen. Der Korridor ist eine
//     brauchbare Naeherung, keine Garantie.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUS = path.join(wurzel, 'dist');
const T = [50, 60], D = [140, 160];
const strikt = process.argv.includes('--strikt');

const entschluesseln = (s) => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&auml;/g, 'ä')
  .replace(/&ouml;/g, 'ö').replace(/&uuml;/g, 'ü').replace(/&szlig;/g, 'ß')
  .replace(/&nbsp;/g, ' ').replace(/&#x27;/g, "'");

const seiten = [];
(function lauf(o) {
  for (const e of fs.readdirSync(o, { withFileTypes: true })) {
    const v = path.join(o, e.name);
    if (e.isDirectory()) lauf(v);
    else if (e.name === 'index.html') seiten.push(v);
  }
})(AUS);

const zeilen = [];
for (const s of seiten) {
  const html = fs.readFileSync(s, 'utf8');
  const route = '/' + path.relative(AUS, path.dirname(s)).split(path.sep).join('/');
  const t = entschluesseln((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1]).trim();
  const d = entschluesseln((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i) || [, ''])[1]).trim();
  zeilen.push({ route: route === '/.' ? '/' : route, t, d, tl: t.length, dl: d.length });
}
zeilen.sort((a, b) => a.route.localeCompare(b.route));

const ausserhalb = (n, [min, max]) => n < min || n > max;
const schlecht = zeilen.filter((z) => ausserhalb(z.tl, T) || ausserhalb(z.dl, D));

console.log(`[meta] ${zeilen.length} Seiten geprueft. Title ${T[0]}-${T[1]}, Description ${D[0]}-${D[1]} Zeichen.\n`);
for (const z of zeilen) {
  const mt = ausserhalb(z.tl, T) ? (z.tl < T[0] ? 'kurz' : 'lang') : ' ok ';
  const md = ausserhalb(z.dl, D) ? (z.dl < D[0] ? 'kurz' : 'lang') : ' ok ';
  if (mt === ' ok ' && md === ' ok ') continue;
  console.log(`  ${z.route}`);
  console.log(`     Title  ${String(z.tl).padStart(3)} [${mt}]  ${z.t}`);
  console.log(`     Descr. ${String(z.dl).padStart(3)} [${md}]  ${z.d.slice(0, 110)}${z.d.length > 110 ? '…' : ''}`);
}

const dubletten = (feld) => {
  const m = new Map();
  for (const z of zeilen) m.set(z[feld], [...(m.get(z[feld]) || []), z.route]);
  return [...m.entries()].filter(([, r]) => r.length > 1);
};
for (const [feld, name] of [['t', 'Title'], ['d', 'Description']]) {
  const d = dubletten(feld);
  if (d.length) {
    console.log(`\n  ⚠️ ${name}-Dubletten:`);
    for (const [wert, routen] of d) console.log(`     „${wert.slice(0, 60)}" auf ${routen.join(', ')}`);
  }
}

const zt = zeilen.filter((z) => ausserhalb(z.tl, T)).length;
const zd = zeilen.filter((z) => ausserhalb(z.dl, D)).length;
console.log(`\n[meta] ${zt} Titles und ${zd} Descriptions ausserhalb des Korridors (${schlecht.length} Seiten betroffen).`);
process.exit(strikt && schlecht.length ? 1 : 0);
