// Rechnet das gelieferte Betriebsvideo in die Web-Fassungen um.
//
// AUFRUF:
//   npm run video                      nutzt den Standardpfad unten
//   npm run video -- --quelle "D:/…/CarCare .mov"
//   npm run video -- --nur hero        nur einen Schnitt neu rechnen
//
// WARUM ALS SKRIPT UND NICHT VON HAND: Beim naechsten Videoschnitt muss niemand die
// Parameter rekonstruieren. Dieselbe Ueberlegung wie bei `npm run images`.
//
// DIE QUELLE LIEGT NICHT IM REPOSITORY. Der Kunde hat am 2026-09-07 einen Ordner
// geliefert (`transfer-01a06d3d/CarCare/`), darin `2. Video/CarCare .mov`: 1920x1080,
// 86,68 s, H.264 mit 11 Mbit/s, dazu AAC-Ton — 115,6 MiB. Solche Dateien gehoeren nicht
// in die Versionierung; ausgeliefert wird nur, was hier daraus entsteht.
//
// WIE DIE AUSSCHNITTE GEWAEHLT WURDEN (nicht geraten, gemessen und angesehen):
// `ffmpeg -filter:v "select='gt(scene,0.30)',showinfo"` findet 20 Schnitte. Aus jeder
// Einstellung wurde ein Kontrollbild gezogen und angesehen. Zwei Erkenntnisse:
//  * Bei 3 s und 81 s liegt das FIRMENLOGO im Bild. Beide Luftaufnahmen (0–8,76 s und
//    76,0–86,68 s) sind damit als Hintergrund unbrauchbar — Text im Bild ist in
//    `data/videos.ts` ausdruecklich ausgeschlossen.
//  * Die laengste ununterbrochene Einstellung liegt bei 8,76–21,44 s (12,68 s): ein
//    ruhiger Werkstattschwenk, schnittfrei und textfrei.
// Die Schnittgrenzen unten liegen jeweils knapp INNERHALB der erkannten Schnitte, damit
// kein Uebergangsbild mitkommt.
//
// WARUM 1280 BREIT: Gemessen, nicht geschaetzt. Die Videokarte von `BetriebsVideo`
// rendert bei 1440 px Viewport exakt 1280x720; bei 1920 px sind es 1536 px. Schmaler
// waere sichtbar weich, breiter zahlt niemand ein. Die Hintergrundschleife liegt
// zusaetzlich unter `hero-radial-veil`, das dort zwischen 40 % und 94 % abdunkelt —
// Aufloesung, die dort niemand sieht, kostet nur Ladezeit (1080p/CRF 30 = 3,82 MiB
// gegenueber 720p/CRF 29 = 2,12 MiB fuer denselben Ausschnitt).
//
// WARUM KEIN WEBM: `PhotoBackdrop` und `BetriebsVideo` binden EIN `src`, keine
// `<source>`-Liste. Ein zweites Format waere totes Gewicht im Repo, solange das so ist.
// Ausserdem gemessen: VP9 bei CRF 36 ergab 6,92 MiB — mehr als H.264, nicht weniger.
// Die CRF-Skalen der beiden Encoder sind nicht vergleichbar; ohne eigene Messreihe
// bringt der Wechsel hier nichts.
//
// WARUM STUMM: Alle drei Plaetze spielen ueber `autoplay` an, und Browser lassen das
// ausschliesslich stumm zu. Eine Tonspur waere Ballast, den niemand hoert. Der Film MIT
// Ton bleibt damit ungenutzt — das ist bewusst so entschieden (Backlog-Notiz in
// `docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`, Phase 5).
//
// ⚠️ Was diese Pruefung besteht, ohne dass die Sache in Ordnung ist: Sie kodiert, sie
// beurteilt nicht. Ob ein Ausschnitt inhaltlich passt, sieht nur ein Mensch — deshalb
// legt sie je Schnitt einen Kontaktbogen mit Einzelbildern in `output/video-pruef/` ab.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';
import sharp from 'sharp';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(wurzel, 'public', 'assets');
const PRUEFUNG = path.join(wurzel, 'output', 'video-pruef');

const STANDARD_QUELLE =
  'C:/Users/Moham/Downloads/transfer-01a06d3d/CarCare/2. Video/CarCare .mov';

const BREITE = 1280;
const CRF = 29;

/**
 * Die drei Videoplaetze aus `data/videos.ts`. `id` ist dort der Schluessel — wer hier
 * einen Ausschnitt aendert, aendert genau den Platz, der so heisst.
 */
const SCHNITTE = [
  {
    id: 'hero',
    datei: 'carcare-ueber-uns-hero',
    start: 9.0,
    dauer: 12.2,
    standbildBei: 9.0,
    zweck: 'Hintergrundschleife /ueber-uns (3.20) — laengste schnittfreie Einstellung',
  },
  {
    id: 'rundgang',
    datei: 'carcare-betriebsrundgang',
    start: 21.5,
    dauer: 30.7,
    standbildBei: 31.1,
    zweck: 'Betriebsrundgang /ueber-uns (3.21) — Waschplatz, Schadenaufnahme, Halle, Karosserie, Lackierkabine',
  },
  {
    id: 'arbeitsplatz',
    datei: 'carcare-arbeitsplatz',
    // Beginnt bewusst NICHT bei 45,7 s, direkt hinter dem Schnitt: Dort faehrt die Kamera
    // noch an einer Saeule vorbei, die halbe linke Bildhaelfte ist schwarz. Ab 46,3 s
    // steht die Lackierkabine frei im Bild.
    start: 46.3,
    dauer: 29.6,
    standbildBei: 71.1,
    // Laut `data/videos.ts` ausdruecklich „derselbe Rundgang, auf den Arbeitsplatz hin
    // geschnitten" — die Ueberschneidung mit dem Rundgang ist also gewollt, nicht faul.
    zweck: 'Karriere (3.18) — Lackierkabine, Teilevorbereitung, Politur, Hebebuehne, Reifenraum',
  },
];

const args = process.argv.slice(2);
const quelle = args.includes('--quelle') ? args[args.indexOf('--quelle') + 1] : STANDARD_QUELLE;
const nur = args.includes('--nur') ? args[args.indexOf('--nur') + 1] : null;

if (!fs.existsSync(quelle)) {
  console.error(`[video] Quelle nicht gefunden:\n        ${quelle}`);
  console.error('[video] Die Datei liegt bewusst ausserhalb des Repositories.');
  console.error('[video] Pfad angeben mit:  npm run video -- --quelle "<Pfad zur .mov>"');
  process.exit(1);
}
if (nur && !SCHNITTE.some((s) => s.id === nur)) {
  console.error(`[video] Unbekannter Schnitt "${nur}". Bekannt: ${SCHNITTE.map((s) => s.id).join(', ')}`);
  process.exit(1);
}

fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(PRUEFUNG, { recursive: true });

const lauf = (argumente) =>
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...argumente], { stdio: 'inherit' });
const mib = (p) => (fs.statSync(p).size / 1048576).toFixed(2);

const ergebnis = [];

for (const schnitt of SCHNITTE.filter((s) => !nur || s.id === nur)) {
  console.log(`[video] ${schnitt.datei} — ${schnitt.zweck}`);

  const video = path.join(ZIEL, `${schnitt.datei}.mp4`);
  lauf([
    '-ss', String(schnitt.start),
    '-t', String(schnitt.dauer),
    '-i', quelle,
    '-an',
    '-vf', `scale=${BREITE}:-2`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(CRF),
    // `yuv420p` ist Pflicht fuer Safari; ohne das bleibt das Bild dort schwarz.
    '-pix_fmt', 'yuv420p',
    // Index nach vorn — sonst laedt der Browser erst die ganze Datei, bevor er startet.
    '-movflags', '+faststart',
    '-y', video,
  ]);

  /*
   * Standbild: `standbildBei` je Schnitt, NICHT pauschal das erste Bild.
   *
   * Der naheliegende Weg waere das erste Bild — dann springt beim Anlaufen nichts um.
   * Er ist hier trotzdem falsch: Bei `prefers-reduced-motion` blenden beide Komponenten
   * das Video aus und zeigen NUR das Standbild. Windows meldet reduzierte Bewegung
   * systemweit, ein erheblicher Teil der Besucher sieht also ausschliesslich dieses
   * Bild. Es muss die Sektion allein tragen koennen.
   *
   * Der Sprung beim Autostart dauert Sekundenbruchteile; ein schwaches Standbild bleibt.
   * Deshalb gewinnt das aussagekraeftige Bild. Fuer den Hero faellt beides zusammen —
   * dessen erstes Bild ist bereits die Werkstatthalle.
   */
  const roh = path.join(PRUEFUNG, `${schnitt.datei}-roh.png`);
  const standbild = path.join(ZIEL, `${schnitt.datei}-standbild.webp`);
  lauf(['-ss', String(schnitt.standbildBei), '-i', quelle, '-frames:v', '1', '-y', roh]);
  await sharp(roh).resize(1920).webp({ quality: 76 }).toFile(standbild);
  fs.rmSync(roh, { force: true });

  // Kontrollbogen: fuenf Bilder ueber den Schnitt verteilt.
  const teile = [];
  for (let i = 0; i < 5; i++) {
    const t = schnitt.start + (schnitt.dauer * i) / 5;
    const p = path.join(PRUEFUNG, `tmp-${i}.png`);
    lauf(['-ss', String(t), '-i', quelle, '-frames:v', '1', '-y', p]);
    teile.push(await sharp(p).resize(400).toBuffer());
    fs.rmSync(p, { force: true });
  }
  const { width: bw, height: bh } = await sharp(teile[0]).metadata();
  await sharp({ create: { width: bw + 12, height: teile.length * (bh + 6) + 6, channels: 3, background: '#111111' } })
    .composite(teile.map((input, i) => ({ input, left: 6, top: 6 + i * (bh + 6) })))
    .jpeg({ quality: 78 })
    .toFile(path.join(PRUEFUNG, `${schnitt.datei}-kontrolle.jpg`));

  ergebnis.push({ schnitt, video, standbild });
}

console.log('\n[video] fertig:');
for (const { schnitt, video, standbild } of ergebnis) {
  const rel = (p) => path.relative(wurzel, p).replace(/\\/g, '/');
  console.log(`  ${rel(video).padEnd(48)} ${mib(video).padStart(6)} MiB   ${schnitt.dauer} s, stumm, ${BREITE} breit`);
  console.log(`  ${rel(standbild).padEnd(48)} ${mib(standbild).padStart(6)} MiB`);
}
console.log(`\n  Quelle war ${mib(quelle)} MiB. Kontrollbilder: output/video-pruef/*-kontrolle.jpg`);
console.log('  Eintragen in data/videos.ts: quelle + poster + istPlatzhalter.');
console.log('  ⚠️ Platzhalter entfernt? Dann auch den Eintrag in ANERKANNT (scripts/check-dummies.mjs).');
