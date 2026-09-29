// Gedankenstriche im AUSGELIEFERTEN Text (Backlog 6.26, Mail André 2026-09-28: „Gedankenstriche im Text durch Punkt
// und Komma ersetzen"). Laeuft im `postbuild` nach dem Prerender und bricht den Build, sobald wieder einer auftaucht.
//
// AUFRUF: `node scripts/check-gedankenstriche.mjs` (Waechter, Exit 1 bei Fund) · `-- --liste` (alle Funde mit Umfeld)
//
// WAS ALS GEDANKENSTRICH GILT: Halbgeviert- oder Geviertstrich (auch U+2012/U+2015) mit Leerzeichen davor und danach,
// ein Geviertstrich direkt zwischen zwei Woertern, und ein Bindestrich mit Leerzeichen auf beiden Seiten.
// WAS BLEIBT: Bis-Striche zwischen Zahlen („1–2 Tage", „8–17 Uhr") und zwischen Wochentagen („Mo–Fr"), die
// Telefonnummer in der Schreibweise des Betriebs („0341 - 261 77 90").
// WO GESUCHT WIRD: sichtbarer Text aller vorgerenderten Seiten (ohne script, style, noscript, template) sowie Titel und
// Beschreibung im Kopf (erscheinen in den Suchergebnissen). NICHT: JSON-LD — Maschinendaten, nicht sichtbar.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus CLAUDE.md):
//  1. Text, der erst im Browser entsteht, steht nicht im vorgerenderten HTML: das Stellenfenster auf /karriere, der
//     Oeffnungsstatus, Meldungen der Formulare nach dem Absenden. Seit 2026-09-28 (Optimierung O3) liest deshalb eine
//     ZWEITE STUFE den Quelltext genau dieser Komponenten (`NUR_IM_BROWSER`), Kommentare ausgenommen. Eine neue
//     Komponente dieser Art gehoert in die Liste — sonst bleibt sie blind.
//  2. Ein Gedankenstrich OHNE Leerzeichen als Bindestrich getippt („Innen-Aussen") ist von einem Kompositum nicht zu
//     unterscheiden und faellt durch.
//  3. Sie sagt nichts darueber, ob der umgestellte Satz stimmt — Punkt oder Komma ist eine Entscheidung je Satz.
//  4. Sie liest nur `dist/`. Ohne frischen Build prueft sie den alten Stand (im `postbuild` ist er immer frisch).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(wurzel, 'dist');
const LISTE = process.argv.includes('--liste');

const STRICH = '[\\u2012\\u2013\\u2014\\u2015]';
const MUSTER = [
  { art: 'Strich mit Leerzeichen', re: new RegExp(`(?<=\\S)\\s${STRICH}\\s(?=\\S)`, 'g') },
  { art: 'Geviertstrich zwischen Woertern', re: /(?<=[\p{L})"“])[—―](?=[\p{L}("„])/gu },
  { art: 'Bindestrich mit Leerzeichen', re: /(?<=\S)\s-\s(?=\S)/g },
];
/** Erlaubt: Zahlenbereich, Wochentagsbereich, Telefonnummer. Geprueft am Umfeld des Fundes. */
const ERLAUBT = [
  // Nur Ziffern-, Halbgeviert- und Bindestrich: Ein Geviertstrich zwischen Zahlen (etwa der alte Vorlesetext der
  // Zeitleiste, "1 — 1998: ...") ist ein Gedankenstrich, kein Bereich. Gefunden vom Helfer am 2026-09-28.
  /\d\s?[‒–-]\s?\d/,
  /\b(Mo|Di|Mi|Do|Fr|Sa|So)\.?\s?[–-]\s?(Mo|Di|Mi|Do|Fr|Sa|So)\b/,
  /0341 - 261/,
];

const entitaeten = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', shy: '' };
const dekodiere = (s) => s
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, n) => entitaeten[n.toLowerCase()] ?? m);

const sichtbarerText = (html) => {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  const ohne = body.replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ');
  return dekodiere(ohne.replace(/<[^>]+>/g, ' ')).replace(/[\s ]+/g, ' ');
};
const kopfText = (html) => {
  const teile = [];
  const titel = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  if (titel) teile.push(['Titel', dekodiere(titel)]);
  for (const m of html.matchAll(/<meta\s+(?:name|property)="(description|og:description|twitter:description|og:title|twitter:title)"\s+content="([^"]*)"/gi)) {
    teile.push([m[1], dekodiere(m[2])]);
  }
  return teile;
};

const seiten = [];
const sammle = (ordner) => {
  for (const e of fs.readdirSync(ordner, { withFileTypes: true })) {
    const p = path.join(ordner, e.name);
    if (e.isDirectory()) sammle(p);
    else if (e.name === 'index.html') seiten.push(p);
  }
};
if (!fs.existsSync(DIST)) {
  console.error('[gedankenstriche] dist/ fehlt — zuerst `npm run build`.');
  process.exit(1);
}
sammle(DIST);

const funde = [];
for (const datei of seiten.sort()) {
  const rel = path.relative(DIST, path.dirname(datei)).split(path.sep).join('/');
  const route = rel ? `/${rel}` : '/';
  const html = fs.readFileSync(datei, 'utf8');
  const quellen = [['Text', sichtbarerText(html)], ...kopfText(html)];
  for (const [wo, text] of quellen) {
    for (const { art, re } of MUSTER) {
      for (const m of text.matchAll(re)) {
        const umfeld = text.slice(Math.max(0, m.index - 3), m.index + m[0].length + 3);
        if (ERLAUBT.some((e) => e.test(umfeld))) continue;
        funde.push({ route, wo, art, ausschnitt: text.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45).trim() });
      }
    }
  }
}

/*
 * ZWEITE STUFE (O3): Komponenten, deren Text erst im Browser erscheint. Gelesen wird der Quelltext ohne Kommentare —
 * Block- und JSX-Kommentare komplett, Zeilenkommentare ab `//`, sofern davor Zeilenanfang oder Leerraum steht (so
 * bleibt `https://` in Zeichenketten unberuehrt). Was danach noch einen Strich traegt, steht in einer Zeichenkette oder
 * im JSX-Text — Operatoren kennen keinen Halbgeviertstrich.
 */
const NUR_IM_BROWSER = [
  'components/JobPopup.tsx',
  'components/AnfrageDialog.tsx',
  'components/RequestForm.tsx',
  'components/SuchDialog.tsx',
  ...fs.readdirSync(path.join(wurzel, 'components', 'formulare')).filter((d) => d.endsWith('.tsx')).map((d) => `components/formulare/${d}`),
];
for (const rel of NUR_IM_BROWSER) {
  const quelle = fs.readFileSync(path.join(wurzel, rel), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    // `\r?\n`: Die Quellen tragen Windows-Zeilenenden. Bliebe das `\r` stehen, faende `.*$` kein Zeilenende und
    // kein einziger Zeilenkommentar fiele weg (erster Lauf am 2026-09-28: 40 Scheinfunde aus Kommentaren).
    .split(/\r?\n/)
    .map((z) => z.replace(/(^|\s)\/\/.*$/, '$1'));
  // Mehrzeiliger JSX-Text bricht gern direkt am Strich um („… besetzt —⏎ eine …", so am 2026-09-28 in JobCards):
  // Dann steht er am Zeilenende oder -anfang, und die Muster oben brauchen ein Zeichen auf beiden Seiten.
  const RAND = [
    { art: 'Strich am Zeilenende', re: /(?<=\S)\s[‒–—―]\s*$/g },
    { art: 'Strich am Zeilenanfang', re: /^\s*[‒–—―]\s(?=\S)/g },
  ];
  quelle.forEach((zeile, i) => {
    for (const { art, re } of [...MUSTER.slice(0, 2), ...RAND]) {
      for (const m of zeile.matchAll(re)) {
        const umfeld = zeile.slice(Math.max(0, m.index - 3), m.index + m[0].length + 3);
        if (ERLAUBT.some((e) => e.test(umfeld))) continue;
        funde.push({ route: `${rel}:${i + 1}`, wo: 'Quelltext', art, ausschnitt: zeile.trim().slice(0, 140) });
      }
    }
  });
}

const jeRoute = funde.reduce((z, f) => ((z[f.route] = (z[f.route] ?? 0) + 1), z), {});
if (LISTE || funde.length) {
  for (const f of funde) console.log(`${f.route.padEnd(48)} ${f.wo.padEnd(12)} …${f.ausschnitt}…`);
}
console.log(`[gedankenstriche] ${seiten.length} Seiten und ${NUR_IM_BROWSER.length} Browser-Komponenten, ${funde.length} Funde${funde.length ? ` an ${Object.keys(jeRoute).length} Stellen` : ''}.`);
if (funde.length && !LISTE) {
  console.error('[gedankenstriche] Gedankenstriche durch Punkt oder Komma ersetzen (Backlog 6.26). Bis-Striche zwischen Zahlen bleiben.');
  process.exit(1);
}
