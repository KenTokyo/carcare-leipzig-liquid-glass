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
import { getRoutes } from './routes.mjs';

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

/**
 * AUSDRUECKLICH ANERKANNTE PLATZHALTER.
 *
 * ⚠️ WARUM ES DIESE LISTE GIBT — und warum sie den Waechter nicht entwertet:
 *
 * Der Waechter war zuerst ohne sie gebaut, und die Folge trat sofort ein: Die
 * Platzhalter, die in derselben Sitzung bewusst angelegt wurden (1.18, 1.27), machten
 * `main` unbaubar. Damit stand nicht nur der Livegang still, sondern jedes
 * Review-Deployment auf `carcare-center.vercel.app` — also genau der Weg, auf dem der
 * Kunde die Zwischenstaende ueberhaupt sieht.
 *
 * Der Zweck des Waechters ist nicht „keine Platzhalter im Code". Er ist: „kein
 * Platzhalter geht unbemerkt live". Ein Platzhalter, der hier namentlich steht, mit
 * Datum und Backlog-Nummer, ist per Definition bemerkt. Ein neuer ist es nicht — und
 * bricht weiterhin den Build.
 *
 * DREI EIGENSCHAFTEN HALTEN DIE LISTE EHRLICH:
 *  1. Sie wird bei JEDEM Build laut ausgegeben, auch wenn alles gruen ist. Man kommt an
 *     ihr nicht vorbei, ohne sie zu lesen.
 *  2. Sie greift ueber den SICHTBAREN TEXT, nicht ueber eine ID. Wer einen Platzhalter
 *     umbenennt, verliert die Anerkennung — der Build bricht, weil ein umbenannter
 *     Platzhalter ein ungeprueter Zustand ist.
 *  3. Ein Eintrag, der auf nichts mehr passt, ist ein FEHLER. Die Liste kann nicht
 *     verrotten: Sobald Andre liefert und der Platzhalter verschwindet, muss der
 *     Eintrag hier mit weg, sonst bricht der Build.
 *
 * Wer den Waechter streng haben will, leert diese Liste. Dann bricht jeder Build,
 * solange irgendein Platzhalter im Projekt steht.
 */
const ANERKANNT = [
  { text: 'Zusatzleistung 1', backlog: '1.18', seit: '2026-09-04' },
  { text: 'Zusatzleistung 2', backlog: '1.18', seit: '2026-09-04' },
  { text: 'Meilenstein 1', backlog: '1.27', seit: '2026-09-04' },
  { text: 'Meilenstein 2', backlog: '1.27', seit: '2026-09-04' },
  { text: 'Meilenstein 3', backlog: '1.27', seit: '2026-09-04' },
  { text: 'Jahr offen', backlog: '1.27', seit: '2026-09-04' },
  { text: 'Platzhalter — wird durch', backlog: '1.18 / 1.27', seit: '2026-09-04' },
];

const anerkanntFuer = (text) => ANERKANNT.find((a) => a.text === text);

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
/** Platzhalter, die in ANERKANNT stehen — gemeldet, aber nicht fatal. */
const anerkannteTreffer = [];
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
    const name = eintrag[q.bezeichner];
    const ok = anerkanntFuer(name);
    (ok ? anerkannteTreffer : befunde).push({
      art: 'flagge',
      name,
      text: `${q.was}: "${name}" traegt ${q.flagge}: true`,
      datei: q.datei,
      backlog: ok ? ok.backlog : q.backlog,
      seit: ok?.seit,
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
  const ok = anerkanntFuer(wendung);
  (ok ? anerkannteTreffer : befunde).push({
    art: 'text',
    name: wendung,
    text: `"${wendung}" steht im ausgelieferten HTML`,
    routen: [...routen],
    backlog: ok?.backlog,
    seit: ok?.seit,
  });
}

// ------------------------------------------- Verrottete Anerkennungen --------
// Ein Eintrag, der auf nichts mehr passt, ist ein Fehler: Sonst bliebe die Liste
// stehen, nachdem der Platzhalter laengst ersetzt wurde — und der naechste Platzhalter
// mit demselben Wortlaut waere stillschweigend freigegeben.
//
// ⚠️ NUR BEI VOLLSTAENDIGEM `dist/`. Einige Anerkennungen ("Jahr offen") tauchen
// ausschliesslich im gerenderten HTML auf. Liegt nur eine Teilausgabe vor — etwa weil
// der Prerender abgebrochen ist —, findet das Textnetz sie nicht, und die Anerkennung
// saehe faelschlich verrottet aus. Gemessen am 2026-09-05: nach einem abgebrochenen
// Prerender meldete diese Pruefung zwei Eintraege als verrottet, die es nicht waren.
// Ein Waechter, der bei kaputter Eingabe falsche Befunde erzeugt, wird nach dem zweiten
// Mal ignoriert.
const erwarteteSeiten = getRoutes().length;
const vollstaendig = seiten.length >= erwarteteSeiten;

if (!vollstaendig) {
  hinweise.push(
    `nur ${seiten.length} von ${erwarteteSeiten} Seiten in ${AUSGABE}/ — Pruefung auf verrottete ` +
      'Anerkennungen uebersprungen (unvollstaendige Ausgabe)'
  );
} else {
  const gefundeneNamen = new Set([...befunde, ...anerkannteTreffer].map((b) => b.name).filter(Boolean));
  for (const a of ANERKANNT) {
    if (!gefundeneNamen.has(a.text)) {
      befunde.push({
        art: 'verrottet',
        text: `ANERKANNT enthaelt "${a.text}", aber dieser Platzhalter existiert nicht mehr`,
        backlog: a.backlog,
      });
    }
  }
}

// --------------------------------------------------------------- Ausgabe -----

for (const h of hinweise) console.log(`[check-dummies] ${h}`);

// Anerkannte Platzhalter werden IMMER gemeldet, auch wenn sonst alles gruen ist.
// Eine Ausnahme, die man nicht sieht, ist keine Ausnahme mehr, sondern eine Luecke.
if (anerkannteTreffer.length) {
  const namen = [...new Set(anerkannteTreffer.map((b) => b.name))];
  console.log(
    `[check-dummies] ${namen.length} Platzhalter ausdruecklich anerkannt (siehe ANERKANNT im Skript):`
  );
  for (const name of namen) {
    const eintrag = anerkannteTreffer.find((b) => b.name === name);
    const wo = anerkannteTreffer
      .filter((b) => b.name === name)
      .map((b) => (b.art === 'flagge' ? b.datei : (b.routen ?? []).join(', ')))
      .join(' + ');
    console.log(`                 - "${name}" — Backlog ${eintrag.backlog}, seit ${eintrag.seit} — ${wo}`);
  }
  console.log('[check-dummies] Diese muessen VOR dem Livegang ersetzt werden. Neue Platzhalter brechen den Build.');
}

if (befunde.length === 0) {
  console.log(`[check-dummies] ok: ${seiten.length} Seiten geprueft, keine unbekannten Platzhalter.`);
  process.exit(0);
}

const kopf = HART ? 'BUILD ABGEBROCHEN' : 'WARNUNG';
console.error(`
[check-dummies] ${kopf} — ${befunde.length} nicht anerkannte(r) Befund(e).
`);

const nachFlagge = befunde.filter((b) => b.art === 'flagge');
const nachText = befunde.filter((b) => b.art === 'text');
const nachQuelle = befunde.filter((b) => b.art === 'quelle');
const verrottet = befunde.filter((b) => b.art === 'verrottet');

if (nachFlagge.length) {
  console.error('  Ueber das Kennzeichen gefunden (zuverlaessig, ueberlebt Umbenennen):');
  for (const b of nachFlagge) console.error(`    - ${b.text}
      ${b.datei} — Zulieferung Backlog ${b.backlog}`);
  console.error('');
}
if (nachText.length) {
  console.error('  Ueber den Text im ausgelieferten HTML gefunden:');
  for (const b of nachText) console.error(`    - ${b.text}
      auf: ${b.routen.join(', ')}`);
  console.error('');
}
if (verrottet.length) {
  console.error('  Verrottete Anerkennung — Eintrag steht in ANERKANNT, passt aber auf nichts:');
  for (const b of verrottet) console.error(`    - ${b.text}
      Backlog ${b.backlog} — Eintrag aus ANERKANNT entfernen.`);
  console.error('');
}
if (nachQuelle.length) {
  console.error('  Quelle nicht auswertbar:');
  for (const b of nachQuelle) console.error(`    - ${b.text}`);
  console.error('');
}

if (HART) {
  console.error('  Diese Inhalte duerfen nicht ausgeliefert werden. Drei Wege:');
  console.error('    - den echten Text einsetzen UND das Kennzeichen entfernen (der Regelfall),');
  console.error('    - den Eintrag ganz herausnehmen,');
  console.error('    - oder ihn bewusst in ANERKANNT aufnehmen, mit Backlog-Nummer und Datum.');
  console.error('  Ein umbenannter Platzhalter mit stehendem Kennzeichen bleibt ein Platzhalter,');
  console.error('  und er verliert dabei seine Anerkennung — das ist Absicht.');
  console.error('');
  process.exit(1);
}

console.error('  Lokal nur ein Hinweis — auf Vercel bricht der Build damit ab.');
console.error('');
process.exit(0);
