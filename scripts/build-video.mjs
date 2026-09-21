// Rechnet die gelieferten Videos in die Web-Fassungen um.
//
// AUFRUF:
//   npm run video                      alle Schnitte, jeder aus seiner eigenen Quelle
//   npm run video -- --nur hero        nur einen Schnitt neu rechnen
//   npm run video -- --nur hero --quelle "D:/…/CarCare .mov"   Quelle fuer DIESEN Schnitt ersetzen
//
// SEIT 2026-09-21 MEHRERE QUELLEN: Neben dem Betriebsvideo kam das Lackiervideo fuer die
// Startseite (B11). Jeder Schnitt nennt seine Quelle deshalb selbst; `--quelle` gilt nur
// zusammen mit `--nur`, sonst waere unklar, welchen Film sie ersetzt.
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

const BETRIEBSVIDEO =
  'C:/Users/Moham/Downloads/transfer-01a06d3d/CarCare/2. Video/CarCare .mov';
/**
 * Lieferung vom 2026-09-21 („Neue Fotos Schleife September“): iPhone, 28,17 s, 1920 × 1080
 * H.264 mit Drehvermerk −90° (also Hochformat 1080 × 1920), 15 Mbit/s, dazu eine AAC- und eine
 * raeumliche Tonspur und sechs Metadatenspuren (Geraet, Aufnahmezeit) — 51 MiB.
 */
const LACKIERVIDEO =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/Neue Fotos Schleife September/Video - Lackieren.mov';

const BREITE = 1280;
const CRF = 29;
const URHEBER = 'CarCare Center Leipzig (BS CarCare GmbH)';
const RECHTE = '(c) 2026 BS CarCare GmbH, Leipzig';

/**
 * Die drei Videoplaetze aus `data/videos.ts`. `id` ist dort der Schluessel — wer hier
 * einen Ausschnitt aendert, aendert genau den Platz, der so heisst.
 */
const SCHNITTE = [
  {
    id: 'hero',
    quelle: BETRIEBSVIDEO,
    datei: 'carcare-ueber-uns-hero',
    start: 9.0,
    dauer: 12.2,
    standbildBei: 9.0,
    zweck: 'Hintergrundschleife /ueber-uns (3.20) — laengste schnittfreie Einstellung',
  },
  {
    id: 'rundgang',
    quelle: BETRIEBSVIDEO,
    datei: 'carcare-betriebsrundgang',
    start: 21.5,
    dauer: 30.7,
    standbildBei: 31.1,
    zweck: 'Betriebsrundgang /ueber-uns (3.21) — Waschplatz, Schadenaufnahme, Halle, Karosserie, Lackierkabine',
    // R16, mitgeprueft am 2026-09-21: In der Hallen-Einstellung (8,30–10,86 s) steht das
    // Kennzeichen eines silbernen VW up! klein, bei Vergroesserung aber entzifferbar im Bild —
    // auch im Standbild (31,1 s der Quelle = 9,6 s hier). Verfolgt wie beim Karriere-Schnitt
    // (Trefferguete 0,92–1,00). Die uebrigen Wagen tragen leere Halter oder sind nur als
    // unleserliche Randstuecke zu sehen (Einzelbilder 1,0 / 4,5 / 7,0 / 14,3 / 20,5 s).
    unkenntlich: [
      {
        was: 'Kennzeichen des silbernen VW up! in der Halle (Kundenfahrzeug)',
        von: 8.29,
        bis: 10.84,
        w: 130,
        h: 60,
        pfad: [[8.3, 1200, 621], [8.71, 1234, 621], [9.11, 1274, 621], [9.5, 1314, 621], [9.9, 1358, 623],
          [10.29, 1410, 627], [10.68, 1468, 633], [10.84, 1490, 637]],
      },
    ],
  },
  {
    id: 'arbeitsplatz',
    quelle: BETRIEBSVIDEO,
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
    // BACKLOG R16 (seit 2026-09-21 umgesetzt): In der Mercedes-Einstellung (Schnittzeit 22,86–26,78 s,
    // per Szenenerkennung) stehen zwei Kennzeichen DESSELBEN Kundenfahrzeugs lesbar im Bild —
    // hinten am Wagen und vorn am abgebauten Stossfaenger im Hintergrund. Zurueckgestellt war
    // das, solange offen war, ob der Ausschnitt wegen fehlender Einwilligung der Mitarbeitenden
    // ohnehin fliegt. Die Einwilligung liegt laut User vollstaendig vor (2026-09-21).
    //
    // WIE DER PFAD ENTSTAND (gemessen, nicht geschaetzt): Jedes Kennzeichen wurde Bild fuer Bild
    // verfolgt (normierte Kreuzkorrelation auf halber Aufloesung, 98 Bilder, Trefferguete
    // 0,93–1,00); hier steht etwa jeder fuenfte Punkt. Das vordere laeuft so durch.
    // Das HINTERE ist nachgemessen: Die Verfolgung driftete bis 24,9 s um bis zu 34 px nach
    // unten (Vorlage wandert auf dem wachsenden Kennzeichen), und ab 25,0 s laeuft es unten aus
    // dem Bild, wo die Verfolgung abreisst. Ab dort Mittelpunkte aus Einzelbildern im
    // 0,2-s-Raster abgelesen; bei 26,3 s ist nichts mehr davon zu sehen. Ein erster Lauf mit
    // FORTGESCHRIEBENEM Pfad liess bei 25,6 s Buchstaben am Bildrand durch — gesehen im
    // Pruefbogen, nicht an einer Zahl. Die Boxen sind bewusst grosszuegig: Das Kennzeichen
    // waechst beim Anflug von rund 115 auf 190 px Breite.
    unkenntlich: [
      {
        was: 'Kennzeichen hinten am grauen Mercedes (Kundenfahrzeug)',
        von: 22.85,
        bis: 26.3,
        w: 280,
        h: 170,
        pfad: [[22.86, 1752, 860], [23.26, 1740, 887], [23.66, 1727, 918], [24.06, 1710, 946], [24.46, 1696, 973],
          [24.9, 1675, 1002], [25.1, 1659, 1020], [25.3, 1642, 1045], [25.5, 1628, 1055], [25.7, 1615, 1070],
          [25.9, 1620, 1085], [26.1, 1625, 1100], [26.3, 1625, 1118]],
      },
      // HEBEBUEHNEN-EINSTELLUNG (17,22–20,74 s): zwei weitere Kennzeichen, die der erste Befund
      // (R16: „etwa Sekunde 22–26“) nicht genannt hatte — gefunden beim Nachpruefen der
      // uebrigen Einstellungen. Der BMW auf der Buehne ist beim Anflug lesbar; derselbe Mercedes
      // wie oben gleitet am unteren Bildrand durch und steht bei 19,1 s vollstaendig im Bild.
      {
        was: 'Kennzeichen des BMW auf der Hebebuehne (Kundenfahrzeug)',
        von: 17.21,
        bis: 20.72,
        w: 170,
        h: 80,
        // Durchgehend verfolgt, Trefferguete 0,92–0,99.
        pfad: [[17.22, 1174, 644], [17.62, 1170, 644], [18.02, 1166, 644], [18.42, 1164, 644], [18.62, 1160, 644],
          [18.82, 1150, 648], [19.02, 1134, 652], [19.22, 1114, 656], [19.42, 1096, 658], [19.62, 1084, 658],
          [19.82, 1078, 658], [20.22, 1068, 658], [20.7, 1056, 658]],
      },
      {
        was: 'Kennzeichen des grauen Mercedes am unteren Bildrand (dasselbe Fahrzeug wie oben)',
        von: 17.21,
        bis: 20.2,
        w: 260,
        h: 140,
        // Am Rand reisst die Verfolgung ab — Mittelpunkte aus Einzelbildern abgelesen
        // (rechtes Ende des sichtbaren Teils minus halbe Schildbreite von rund 85 px).
        pfad: [[17.22, 455, 1095], [17.9, 394, 1090], [18.3, 352, 1085], [18.6, 308, 1078], [18.8, 244, 1070],
          [19.1, 119, 1050], [19.5, -25, 997], [19.7, -47, 983], [19.9, -65, 976], [20.2, -80, 950]],
      },
      {
        was: 'Kennzeichen vorn am abgebauten Stossfaenger (dasselbe Fahrzeug)',
        von: 22.85,
        bis: 26.75,
        w: 170,
        h: 90,
        pfad: [[22.86, 666, 270], [23.26, 692, 266], [23.66, 720, 264], [24.06, 740, 264], [24.46, 760, 264],
          [24.86, 780, 264], [25.26, 800, 264], [25.66, 824, 264], [26.06, 844, 264], [26.46, 860, 264], [26.74, 878, 264]],
      },
    ],
  },
  {
    id: 'startseite-lackierung',
    quelle: LACKIERVIDEO,
    datei: 'carcare-autolackierung',
    // WIE GEWAEHLT: eine durchgehende Einstellung ohne Schnitt (Szenenerkennung wie oben:
    // 0 Treffer). Je Sekunde ein quadratischer Ausschnitt angesehen: Ab 2 s lackiert der
    // Kollege sichtbar (Spruehnebel), bis 15 s fuehrt die Pistole an der Kante der Motorhaube
    // entlang bis in die Nahaufnahme. 13 s als Schleife statt der ganzen Aufnahme, weil der
    // User ausdruecklich auf das Datenvolumen achtet.
    start: 2.0,
    dauer: 13.0,
    // Kollege mit Maske, Pistole und Spruehnebel — traegt die Karte auch allein.
    standbildBei: 4.0,
    // HOCHFORMAT → QUADRAT: Die Karte ist aufgeklappt nahezu quadratisch (Desktop etwa
    // 450–570 × 460 px, Smartphone 342 × 340). Oberkante 680 von 1920 px: So bleiben Pistole,
    // Handschuh und Nebel in allen 13 Sekunden im Bild; die Decke der Kabine faellt weg.
    bild: 'crop=1080:1080:0:680',
    // 720 px reichen fuer eine Karte dieser Groesse; die volle Quelle (1080) kostete nur Ladezeit.
    breite: 720,
    zweck: 'Startseite, Karte „Neu- und Reparaturlackierung“ (B11) — NUR dort, Wunsch des Users 2026-09-21',
    titel: 'Lackieren in der Lackierkabine – CarCare Center Leipzig',
    beschreibung: 'Lackierer in Schutzkleidung und Atemschutz lackiert eine Motorhaube in der Lackierkabine des CarCare Center in Leipzig.',
  },
];

const args = process.argv.slice(2);
const ersatzQuelle = args.includes('--quelle') ? args[args.indexOf('--quelle') + 1] : null;
const nur = args.includes('--nur') ? args[args.indexOf('--nur') + 1] : null;

if (nur && !SCHNITTE.some((s) => s.id === nur)) {
  console.error(`[video] Unbekannter Schnitt "${nur}". Bekannt: ${SCHNITTE.map((s) => s.id).join(', ')}`);
  process.exit(1);
}
if (ersatzQuelle && !nur) {
  console.error('[video] --quelle gilt nur zusammen mit --nur <schnitt>: Die Schnitte haben verschiedene Quellen.');
  process.exit(1);
}
const auswahl = SCHNITTE.filter((s) => !nur || s.id === nur).map((s) => ({ ...s, quelle: ersatzQuelle ?? s.quelle }));
for (const s of auswahl) {
  if (fs.existsSync(s.quelle)) continue;
  console.error(`[video] Quelle fuer "${s.id}" nicht gefunden:\n        ${s.quelle}`);
  console.error('[video] Die Dateien liegen bewusst ausserhalb des Repositories.');
  console.error(`[video] Pfad angeben mit:  npm run video -- --nur ${s.id} --quelle "<Pfad zur .mov>"`);
  process.exit(1);
}

fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(PRUEFUNG, { recursive: true });

const lauf = (argumente) =>
  execFileSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', ...argumente], { stdio: 'inherit' });
const mib = (p) => (fs.statSync(p).size / 1048576).toFixed(2);

/**
 * Weichzeichnung beweglicher Stellen (R16). `pfad` = Stuetzpunkte [Schnittzeit, x, y] des
 * MITTELPUNKTS in Quellpixeln, dazwischen linear. `t` ist die Schnittzeit: Nach dem Suchen per
 * `-ss` VOR `-i` beginnt ffmpeg die Zeitstempel wieder bei 0.
 */
const strecke = (pfad, achse, versatz) => {
  const wert = (k) => pfad[k][achse] - versatz;
  let ausdruck = String(wert(pfad.length - 1));
  for (let k = pfad.length - 2; k >= 0; k--) {
    const t0 = pfad[k][0];
    const t1 = pfad[k + 1][0];
    ausdruck = `if(lt(t,${t1}),${wert(k)}+(${wert(k + 1) - wert(k)})*(t-${t0})/${+(t1 - t0).toFixed(3)},${ausdruck})`;
  }
  return `if(lt(t,${pfad[0][0]}),${wert(0)},${ausdruck})`;
};
/** Dieselbe Strecke in JavaScript — fuer den Pruefbogen. */
const mitteBei = (pfad, t) => {
  if (t <= pfad[0][0]) return pfad[0].slice(1);
  for (let k = 0; k < pfad.length - 1; k++) {
    const [t0, x0, y0] = pfad[k];
    const [t1, x1, y1] = pfad[k + 1];
    if (t < t1) return [x0 + ((x1 - x0) * (t - t0)) / (t1 - t0), y0 + ((y1 - y0) * (t - t0)) / (t1 - t0)];
  }
  return pfad[pfad.length - 1].slice(1);
};

/**
 * ffmpeg-Argumente der Bildkette: erst Weichzeichnung (in Quellpixeln), dann Ausschnitt, dann
 * Skalierung (`breite` = null: keine, fuer Standbilder in voller Aufloesung).
 * Die Box wird an den Bildrand geklemmt — ein Kennzeichen, das unten hinauslaeuft, bleibt bis
 * zuletzt abgedeckt.
 */
const bildkette = (schnitt, breite) => {
  const danach = [schnitt.bild, breite ? `scale=${breite}:-2` : null].filter(Boolean).join(',') || 'null';
  const flecken = schnitt.unkenntlich ?? [];
  if (!flecken.length) return ['-map', '0:v:0', '-vf', danach];
  const graph = [`[0:v]split=${flecken.length + 1}[b0]${flecken.map((_, i) => `[u${i}]`).join('')}`];
  flecken.forEach((f, i) => {
    const x = strecke(f.pfad, 1, f.w / 2);
    const y = strecke(f.pfad, 2, f.h / 2);
    // Weiche Kante (16 px Alpha-Verlauf): Ein hartes graues Rechteck faellt im Bild mehr auf als
    // das Kennzeichen selbst. Die Boxen haben rundum mehr als 16 px Rand um das Kennzeichen.
    //
    // ⚠️ AM BILDRAND darf die weiche Kante NICHT im Bild liegen: Laeuft ein Kennzeichen unten
    // hinaus, stehen seine Buchstaben genau in den letzten Pixelzeilen — und eine an den Rand
    // geklemmte Box waere dort halb durchsichtig. So geschehen im Lauf vom 2026-09-21. Deshalb
    // wird das Bild vorher um RAND Pixel erweitert (Randpixel verlaengert) und die Box darf
    // bis zu RAND Pixel ueber den Bildrand hinausragen; der weiche Saum liegt dann ausserhalb.
    const RAND = 64;
    graph.push(`[u${i}]pad=iw+${2 * RAND}:ih+${2 * RAND}:${RAND}:${RAND},`
      + `fillborders=left=${RAND}:right=${RAND}:top=${RAND}:bottom=${RAND}:mode=smear,`
      + `crop=w=${f.w}:h=${f.h}:x='clip(${x}+${RAND},0,iw-ow)':y='clip(${y}+${RAND},0,ih-oh)',`
      + 'boxblur=luma_radius=24:luma_power=3:chroma_radius=12:chroma_power=2,format=yuva420p,'
      + `geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='255*clip(min(min(X,W-1-X),min(Y,H-1-Y))/16,0,1)'[k${i}]`);
    graph.push(`[b${i}][k${i}]overlay=x='clip(${x},-${RAND},W-w+${RAND})':y='clip(${y},-${RAND},H-h+${RAND})'`
      + `:enable='between(t,${f.von},${f.bis})'[b${i + 1}]`);
  });
  graph.push(`[b${flecken.length}]${danach}[aus]`);
  return ['-filter_complex', graph.join(';'), '-map', '[aus]'];
};

/**
 * Einzelbild bei Quellzeit `zeit` durch dieselbe Bildkette — so sind Standbild und Kontrollbilder
 * genauso entschaerft wie das Video. Mit zeitabhaengigen Filtern ab Schnittbeginn einlesen und
 * erst im Ergebnis springen, sonst stimmt `t` nicht.
 */
const einzelbild = (schnitt, zeit, ziel) => {
  if (!(schnitt.unkenntlich ?? []).length) {
    lauf(['-ss', String(zeit), '-i', schnitt.quelle, ...(schnitt.bild ? ['-vf', schnitt.bild] : []), '-frames:v', '1', '-y', ziel]);
    return;
  }
  lauf(['-ss', String(schnitt.start), '-i', schnitt.quelle, '-ss', String(+(zeit - schnitt.start).toFixed(3)),
    ...bildkette(schnitt, null), '-frames:v', '1', '-y', ziel]);
};

const ergebnis = [];

for (const schnitt of auswahl) {
  const { quelle } = schnitt;
  const breite = schnitt.breite ?? BREITE;
  console.log(`[video] ${schnitt.datei} — ${schnitt.zweck}`);

  const video = path.join(ZIEL, `${schnitt.datei}.mp4`);
  lauf([
    '-ss', String(schnitt.start),
    '-t', String(schnitt.dauer),
    '-i', quelle,
    // Nur die Bildspur (`bildkette` waehlt sie aus). Handyvideos tragen daneben Ton- und
    // Metadatenspuren (Geraet, Aufnahmezeit, unter Umstaenden der Ort) — nichts davon gehoert ins Netz.
    ...bildkette(schnitt, breite),
    '-an',
    '-map_metadata', '-1',
    ...(schnitt.titel
      ? ['-metadata', `title=${schnitt.titel}`, '-metadata', `comment=${schnitt.beschreibung}`,
        '-metadata', `artist=${URHEBER}`, '-metadata', `copyright=${RECHTE}`]
      : []),
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
  einzelbild(schnitt, schnitt.standbildBei, roh);
  // Hoechstens 1920 breit und nie hochgerechnet — der quadratische Ausschnitt ist nur 1080 breit.
  await sharp(roh).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 76 }).toFile(standbild);
  fs.rmSync(roh, { force: true });

  // Kontrollbogen: fuenf Bilder ueber den Schnitt verteilt.
  const teile = [];
  for (let i = 0; i < 5; i++) {
    const t = schnitt.start + (schnitt.dauer * i) / 5;
    const p = path.join(PRUEFUNG, `tmp-${i}.png`);
    einzelbild(schnitt, t, p);
    teile.push(await sharp(p).resize(400).toBuffer());
    fs.rmSync(p, { force: true });
  }
  const { width: bw, height: bh } = await sharp(teile[0]).metadata();
  await sharp({ create: { width: bw + 12, height: teile.length * (bh + 6) + 6, channels: 3, background: '#111111' } })
    .composite(teile.map((input, i) => ({ input, left: 6, top: 6 + i * (bh + 6) })))
    .jpeg({ quality: 78 })
    .toFile(path.join(PRUEFUNG, `${schnitt.datei}-kontrolle.jpg`));

  // Pruefbogen der Weichzeichnung: je Stelle acht Zeitpunkte, Ausschnitt in voller Aufloesung um
  // die Box (doppelte Groesse). Ob das Kennzeichen wirklich unlesbar ist, sieht nur ein Mensch.
  for (const [nr, f] of (schnitt.unkenntlich ?? []).entries()) {
    const kacheln = [];
    for (let i = 0; i < 8; i++) {
      const t = f.von + ((f.bis - f.von) * (i + 0.5)) / 8;
      const p = path.join(PRUEFUNG, `tmp-u${i}.png`);
      einzelbild(schnitt, schnitt.start + t, p);
      const { width: iw, height: ih } = await sharp(p).metadata();
      const [cx, cy] = mitteBei(f.pfad, t);
      const w2 = Math.min(iw, f.w * 2);
      const h2 = Math.min(ih, f.h * 2);
      const left = Math.max(0, Math.min(iw - w2, Math.round(cx - w2 / 2)));
      const top = Math.max(0, Math.min(ih - h2, Math.round(cy - h2 / 2)));
      const beschriftung = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="24"><rect width="360" height="24" fill="#000" fill-opacity="0.6"/><text x="6" y="17" fill="#facc15" font-size="15" font-family="sans-serif">t = ${t.toFixed(2)} s</text></svg>`);
      kacheln.push(await sharp(p).extract({ left, top, width: w2, height: h2 }).resize({ width: 360 })
        .composite([{ input: beschriftung, left: 0, top: 0 }]).jpeg().toBuffer());
      fs.rmSync(p, { force: true });
    }
    const { height: kh } = await sharp(kacheln[0]).metadata();
    await sharp({ create: { width: 4 * 366 + 6, height: 2 * (kh + 6) + 6, channels: 3, background: '#111111' } })
      .composite(kacheln.map((input, i) => ({ input, left: 6 + (i % 4) * 366, top: 6 + Math.floor(i / 4) * (kh + 6) })))
      .jpeg({ quality: 82 })
      .toFile(path.join(PRUEFUNG, `${schnitt.datei}-unkenntlich-${nr + 1}.jpg`));
  }

  ergebnis.push({ schnitt, video, standbild });
}

console.log('\n[video] fertig:');
for (const { schnitt, video, standbild } of ergebnis) {
  const rel = (p) => path.relative(wurzel, p).replace(/\\/g, '/');
  console.log(`  ${rel(video).padEnd(48)} ${mib(video).padStart(6)} MiB   ${schnitt.dauer} s, stumm, ${schnitt.breite ?? BREITE} breit`);
  console.log(`  ${rel(standbild).padEnd(48)} ${mib(standbild).padStart(6)} MiB`);
}
const quellen = [...new Set(auswahl.map((s) => s.quelle))].map((q) => `${path.basename(q)} (${mib(q)} MiB)`);
console.log(`\n  Quellen: ${quellen.join(', ')}. Kontrollbilder: output/video-pruef/*-kontrolle.jpg`);
console.log('  Eintragen in data/videos.ts: quelle + poster + istPlatzhalter.');
console.log('  ⚠️ Platzhalter entfernt? Dann auch den Eintrag in ANERKANNT (scripts/check-dummies.mjs).');
