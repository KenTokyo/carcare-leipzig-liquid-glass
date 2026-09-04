// Waechter gegen Platzhalter-Inhalte (postbuild).
//
// WOZU
// Dummy-Texte gehen live, weil sie beim Review niemand sucht. „Zusatzleistung 1" und
// „Meilenstein 2" sehen auf einem Screenshot aus wie Inhalt; erst wer sie liest, merkt,
// dass sie keiner sind. Dieselbe Logik wie bei den TODO-Kommentaren im Code — nur dass
// diese hier auf der Kundenseite stehen, nicht in einer Datei, die nur wir oeffnen.
//
// ZWEI NETZE, ABSICHTLICH VERSCHIEDEN AUFGEHAENGT
//
//  1. ÜBER DAS FELD, nicht ueber den Text. Die Datenmodule werden mit esbuild
//     uebersetzt und AUSGEFUEHRT; gelesen wird der echte Wert von `istDummy` bzw.
//     `istPlatzhalter`. Damit schlaegt der Waechter auch dann an, wenn jemand
//     „Zusatzleistung 1" in „Politur XL" umbenennt, ohne den Inhalt zu ersetzen — der
//     haeufigste Weg, auf dem ein Platzhalter unbemerkt live geht.
//
//  2. ÜBER DEN TEXT im ausgelieferten HTML. Faengt Platzhalter, die gar kein Feld
//     haben — etwa in einer Komponente, die noch niemand an dieses Skript angeschlossen
//     hat. Grober, aber unabhaengig vom ersten Netz.
//
// Die beiden fangen sich gegenseitig auf: Netz 1 ueberlebt Umbenennen, Netz 2 ueberlebt
// das Entfernen der Flagge.
//
// HART AUF VERCEL, WARNUNG LOKAL
// Lokal wird staendig mit Platzhaltern gearbeitet — ein harter Abbruch waere dort nur
// im Weg und wuerde nach der dritten Umgehung abgeschaltet. Was zaehlt, ist der
// Moment vor dem Ausliefern. Auf Vercel (und in jeder CI) bricht er deshalb wie der
// Prerender.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST
// (Pflichtfrage aus CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md)
//
//  1. Sie kennt nur die unten registrierten Quellen. Ein neues Datenmodul mit
//     Platzhaltern faellt durch, bis es in `QUELLEN` steht. Netz 2 mildert das, aber nur
//     fuer die dort aufgezaehlten Wendungen.
//  2. Wer BEIDES tut — umbenennen UND die Flagge entfernen — kommt durch. Dann steht
//     erfundener, echt aussehender Text auf der Seite, und keine Maschine sieht den
//     Unterschied. Dagegen hilft nur das Review.
//  3. Sie prueft, ob Platzhalter DA sind. Sie sagt nichts darueber, ob der echte Inhalt
//     stimmt, vollstaendig ist oder vom Kunden freigegeben wurde.
//  4. Netz 2 liest `dist/`. Wer ohne Build ausliefert, wird davon nicht erfasst.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Registrierte Datenquellen mit Platzhalter-Kennzeichen.
 *
 * Neue Quelle anschliessen = ein Eintrag hier. Die Datei muss ohne Laufzeit-Importe
 * auskommen (`import type` ist in Ordnung, es wird beim Uebersetzen entfernt) —
 * deshalb liegen solche Listen in `data/`, nicht in Seitenkomponenten.
 */
const QUELLEN = [
  {
    datei: 'data/zusatzleistungen.ts',
    ausfuhr: 'zusatzleistungen',
    flagge: 'istDummy',
    bezeichner: 'label',
    was: 'Zusatzleistung im Aufbereitungsformular',
    backlog: '1.18',
  },
  {
    datei: 'data/historie.ts',
    ausfuhr: 'historie',
    flagge: 'istPlatzhalter',
    bezeichner: 'title',
    was: 'Station im Zeitstrahl auf /ueber-uns',
    backlog: '1.27',
  },
];

/** Wendungen, die im ausgelieferten HTML nichts verloren haben. */
const VERDAECHTIGE_TEXTE = [
  'Zusatzleistung 1',
  'Zusatzleistung 2',
  'Meilenstein 1',
  'Meilenstein 2',
  'Meilenstein 3',
  'Jahr offen',
  'Platzhalter — wird durch',
  'Lorem ipsum',
];

const HART = Boolean(process.env.VERCEL || process.env.CI);
const AUSGABE = 'dist';

// ------------------------------------------------- Netz 1: ueber das Feld ----

/** Uebersetzt ein TS-Datenmodul und gibt seine Ausfuhren zurueck. */
async function ladeDatenmodul(relativ) {
  const voll = path.join(wurzel, relativ);
  if (!fs.existsSync(voll)) return { fehler: `Datei fehlt: ${relativ}` };
  const quelle = fs.readFileSync(voll, 'utf8');
  const { code } = await transform(quelle, { loader: 'ts', format: 'cjs', target: 'es2022' });
  const modul = { exports: {} };
  const benoetigt = (name) => {
    throw new Error(
      `${relativ} laedt zur Laufzeit "${name}". Dieses Skript uebersetzt die Datei einzeln ` +
        `und kann das nicht aufloesen. Reine Datenmodule sollten keine Laufzeit-Importe haben ` +
        `(\`import type\` ist in Ordnung).`
    );
  };
  try {
    // eslint-disable-next-line no-new-func
    new Function('module', 'exports', 'require', code)(modul, modul.exports, benoetigt);
  } catch (err) {
    return { fehler: `${relativ} nicht auswertbar — ${err.message}` };
  }
  return { ausfuhren: modul.exports };
}

const befunde = [];
const hinweise = [];

for (const q of QUELLEN) {
  const { ausfuhren, fehler } = await ladeDatenmodul(q.datei);
  if (fehler) {
    befunde.push({ art: 'quelle', text: fehler });
    continue;
  }
  const liste = ausfuhren[q.ausfuhr];
  if (!Array.isArray(liste)) {
    befunde.push({ art: 'quelle', text: `${q.datei}: Ausfuhr "${q.ausfuhr}" fehlt oder ist keine Liste.` });
    continue;
  }
  const markiert = liste.filter((eintrag) => eintrag && eintrag[q.flagge] === true);
  hinweise.push(`${q.datei}: ${liste.length} Eintraege, davon ${markiert.length} als Platzhalter markiert`);
  for (const eintrag of markiert) {
    befunde.push({
      art: 'flagge',
      text: `${q.was}: "${eintrag[q.bezeichner]}" traegt ${q.flagge}: true`,
      datei: q.datei,
      backlog: q.backlog,
    });
  }
}

// ------------------------------------------------- Netz 2: ueber den Text ----

const seiten = [];
if (fs.existsSync(path.join(wurzel, AUSGABE))) {
  (function durchlaufe(ordner) {
    for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
      const voll = path.join(ordner, eintrag.name);
      if (eintrag.isDirectory()) durchlaufe(voll);
      else if (eintrag.name === 'index.html') seiten.push(voll);
    }
  })(path.join(wurzel, AUSGABE));
} else {
  hinweise.push(`${AUSGABE}/ fehlt — Textpruefung uebersprungen (laeuft dieses Skript vor dem Build?)`);
}

const textTreffer = new Map();
for (const seite of seiten) {
  const html = fs.readFileSync(seite, 'utf8');
  for (const wendung of VERDAECHTIGE_TEXTE) {
    if (!html.includes(wendung)) continue;
    const route = '/' + path.relative(path.join(wurzel, AUSGABE), path.dirname(seite)).split(path.sep).join('/');
    if (!textTreffer.has(wendung)) textTreffer.set(wendung, new Set());
    textTreffer.get(wendung).add(route === '/.' ? '/' : route);
  }
}
for (const [wendung, routen] of textTreffer) {
  befunde.push({ art: 'text', text: `"${wendung}" steht im ausgelieferten HTML`, routen: [...routen] });
}

// --------------------------------------------------------------- Ausgabe -----

for (const h of hinweise) console.log(`[check-dummies] ${h}`);

if (befunde.length === 0) {
  console.log(`[check-dummies] ok: ${seiten.length} Seiten geprueft, keine Platzhalter gefunden.`);
  process.exit(0);
}

const kopf = HART ? 'BUILD ABGEBROCHEN' : 'WARNUNG';
console.error(`\n[check-dummies] ${kopf} — ${befunde.length} Platzhalter-Befund(e).\n`);

const nachFlagge = befunde.filter((b) => b.art === 'flagge');
const nachText = befunde.filter((b) => b.art === 'text');
const nachQuelle = befunde.filter((b) => b.art === 'quelle');

if (nachFlagge.length) {
  console.error('  Ueber das Kennzeichen gefunden (zuverlaessig, ueberlebt Umbenennen):');
  for (const b of nachFlagge) console.error(`    - ${b.text}\n      ${b.datei} — Zulieferung Backlog ${b.backlog}`);
  console.error('');
}
if (nachText.length) {
  console.error('  Ueber den Text im ausgelieferten HTML gefunden:');
  for (const b of nachText) console.error(`    - ${b.text}\n      auf: ${b.routen.join(', ')}`);
  console.error('');
}
if (nachQuelle.length) {
  console.error('  Quelle nicht auswertbar:');
  for (const b of nachQuelle) console.error(`    - ${b.text}`);
  console.error('');
}

if (HART) {
  console.error('  Diese Inhalte duerfen nicht ausgeliefert werden. Entweder den echten Text');
  console.error('  einsetzen UND das Kennzeichen entfernen, oder den Eintrag ganz herausnehmen.');
  console.error('  Ein umbenannter Platzhalter mit stehendem Kennzeichen bleibt ein Platzhalter.\n');
  process.exit(1);
}

console.error('  Lokal nur ein Hinweis — auf Vercel bricht der Build damit ab.');
console.error('  Vor dem Ausliefern also entweder ersetzen oder herausnehmen.\n');
process.exit(0);
