// Waechter: Backlog-Nummern muessen im Nummernraum des Kunden liegen.
//
// HINTERGRUND: Bis 2026-09-06 lagen zwoelf repo-lokale Befunde unter Nummern, die der
// Kunde bereits vergeben hatte (3.32-3.40, 1.27-1.29). Fuenf bedeuteten auf beiden
// Seiten etwas anderes, darunter zwei Livegang-Blocker. Aufgeloest durch Umbenennung
// auf R1-R12. Dieser Waechter verhindert den Rueckfall.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus
// CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md):
//
//  1. Sie faengt nur den UEBERLAUF. Wer einen eigenen Befund unter einer freien
//     NIEDRIGEN Kundennummer ablegt — etwa 3.20, das beim Kunden „Hero-Video" heisst —
//     kommt durch. Dagegen hilft nur das Review. Der haeufige Fehler war der Ueberlauf
//     (man zaehlt hinter dem letzten bekannten Punkt weiter), deshalb greift sie dort.
//  2. Sie prueft NICHT, ob der Inhalt hinter einer Nummer stimmt.
//  3. Sie kennt die Obergrenzen aus den Schleifendateien. Wer dort eine Zeile
//     ergaenzt, verschiebt die Grenze — das ist gewollt (neue Kundenlieferung), macht
//     die Pruefung aber wertlos, wenn jemand die Grenze nur verschiebt, um
//     durchzukommen.
//  4. Sie sieht nur `docs/backlog/*.md` und nur TABELLENZEILEN. Ein Ueberlauf im
//     Fliesstext irgendeiner Task-Datei faellt durch.
//
// WARUM SO ENG: Die erste Fassung durchsuchte alle Dateien nach `x.y` und meldete
// 15 Befunde — davon 13 Fehltreffer: Kontrastwerte (3.93), `strokeWidth={1.75}`,
// Seitenverhaeltnisse (2.33:1), Skalierungen (1.32). Ein Waechter, der zu 87 %
// Fehlalarm meldet, wird nach dem zweiten Mal ignoriert und ist dann schaedlicher als
// keiner. Vergeben werden Nummern ausschliesslich in den Backlog-Tabellen — genau
// dort und nur dort wird geprueft.
//
// Die Obergrenzen werden ABGELEITET, nicht eingetragen: Sonst laufen sie mit der
// naechsten Kundenlieferung auseinander und der Waechter meldet Fehlalarme.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lies = (p) => fs.readFileSync(path.join(wurzel, p), 'utf8');

/** Die Schleifendateien sind die Quelle der Wahrheit fuer den erlaubten Raum. */
const QUELLEN = [
  { datei: 'docs/backlog/schleife-1.md', praefix: '1' },
  { datei: 'docs/backlog/schleife-2.md', praefix: '2' },
  { datei: 'docs/backlog/schleife-3.md', praefix: '3' },
];

const grenzen = {};
for (const q of QUELLEN) {
  const nummern = [...lies(q.datei).matchAll(new RegExp(`^\\|\\s*\\**(${q.praefix})\\.(\\d+)`, 'gm'))]
    .map((m) => Number(m[2]));
  if (!nummern.length) {
    console.error(`[check-nummernraeume] ${q.datei}: keine Nummern gefunden — Datei umgebaut?`);
    process.exit(1);
  }
  grenzen[q.praefix] = Math.max(...nummern);
}

/**
 * Geprueft wird ausschliesslich `docs/backlog/*.md` (ohne Unterordner) und dort nur die
 * ERSTE ZELLE einer Tabellenzeile — also die Stelle, an der eine Nummer vergeben wird.
 * Fliesstext, Ueberschriften und alle uebrigen Dateien bleiben aussen vor.
 */
const ORDNER = path.join(wurzel, 'docs/backlog');
const IST_QUELLE = new Set(QUELLEN.map((q) => q.datei));
const ZELLE = /^\|\s*\**~*([123])\.(\d{1,2})~*\**\s*\|/;

const befunde = [];
for (const name of fs.readdirSync(ORDNER)) {
  if (!name.endsWith('.md')) continue;
  const rel = path.join('docs/backlog', name);
  if (IST_QUELLE.has(rel)) continue;
  fs.readFileSync(path.join(ORDNER, name), 'utf8').split('\n').forEach((zeile, i) => {
    const m = ZELLE.exec(zeile);
    if (!m) return;
    const [, praefix, n] = m;
    if (Number(n) <= grenzen[praefix]) return;
    befunde.push({ datei: rel, zeile: i + 1, nummer: `${praefix}.${n}`, text: zeile.trim().slice(0, 90) });
  });
}

console.log(
  `[check-nummernraeume] Raeume laut Schleifendateien: ` +
  Object.entries(grenzen).map(([p, m]) => `${p}.1-${p}.${m}`).join(', ')
);

if (befunde.length) {
  console.error('\n[check-nummernraeume] BUILD ABGEBROCHEN — Nummern ausserhalb des Kundenraums:\n');
  for (const b of befunde) console.error(`  - ${b.datei}:${b.zeile}  „${b.nummer}"  ${b.text}`);
  console.error('\n  Eigene Befunde bekommen ein R-Kuerzel (R1, R2, ...), keine freie x.y-Nummer.');
  console.error('  Begruendung: docs/backlog/offene-punkte-konsolidiert.md\n');
  process.exit(1);
}
console.log('[check-nummernraeume] ok: keine Nummer ausserhalb der Kundenraeume.');
