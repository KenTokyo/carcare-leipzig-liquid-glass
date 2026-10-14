#!/usr/bin/env node
/**
 * Rechnet eine Fotolieferung des Kunden in die Web-Fassung um: `npm run fotos`.
 *
 * AUFRUF:
 *   npm run fotos                          alle Fotos der Liste unten
 *   npm run fotos -- --nur ersatzwagen     nur Ziele, deren Name das Wort enthaelt
 *   npm run fotos -- --ordner "D:/…"       andere Quelle als der Lieferordner unten
 *
 * WARUM NEBEN `npm run images`: Das Ursprungskonzept bleibt — dieselben Werte wie dort (WebP,
 * Qualitaet 82, effort 6, hoechstens 2400 px breit, Zielname aus `name.webp.jpeg`). Diese
 * Lieferung braucht aber je Foto Entscheidungen, die ein Stapelumwandler nicht treffen kann:
 *  - HOCHFORMAT: Vier der elf Handyfotos liegen nur per EXIF-Vermerk aufrecht (orientation 6).
 *    Ohne Drehung kaemen sie quer heraus. Alle Einsatzorte sind Querformate (Karten 16:10,
 *    Akkordeon, Seitenhintergrund), deshalb bekommt jedes Hochformat einen 4:3-Ausschnitt um
 *    das Motiv — gewaehlt und hier festgehalten, nicht der Bildmitte ueberlassen.
 *  - KENNZEICHEN fremder Fahrzeuge werden unkenntlich gemacht. Gleiche Linie wie Backlog R16
 *    (Karriere-Video): Die Einwilligung der Mitarbeitenden deckt Personen, nicht die Halter der
 *    Kundenfahrzeuge. Eigene Fahrzeuge (Miet-Polos, Transporter) bleiben, wie sie sind.
 *    Das ist ein gewoehnlicher Weichzeichner, keine KI-Bearbeitung.
 *  - METADATEN: Titel, Beschreibung, Urheber, Rechtevermerk, Ort und Stichwoerter als XMP,
 *    dazu IPTC „Digital Source Type“ = digitalCapture. Das ist die maschinenlesbare Angabe
 *    „echtes Foto“ (Gegenstueck zu `trainedAlgorithmicMedia` fuer KI-Bilder, Art. 50 KI-VO).
 *    GPS-Position, Geraet und Seriennummern aus dem Handy-EXIF fallen weg.
 *    SEIT 2026-10-14 JE FOTO ABWEICHEND: `quelltyp` (z. B. `compositeWithTrainedAlgorithmicMedia`, „Edited using
 *    Generative AI“, fuer echte Fotos mit KI-Bearbeitung) und `ki` → IPTC 2025.1 `AISystemUsed`/`AISystemVersionUsed`.
 *
 * DIE QUELLE LIEGT NICHT IM REPOSITORY (wie beim Betriebsvideo, `scripts/build-video.mjs`).
 * Ausgeliefert wird nur, was hier daraus entsteht. `public/` wird 1:1 deployt — Originale
 * gehoeren nicht hinein.
 *
 * ⚠️ WAS DIESES SKRIPT BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus CLAUDE.md):
 *  1. Es rechnet, es beurteilt nicht. Ob ein Ausschnitt das Motiv trifft und ob ein
 *     Kennzeichen wirklich unlesbar ist, sieht nur ein Mensch — deshalb der Pruefbogen in
 *     `output/fotos-pruef/` (Ausschnitt eingezeichnet, jede weichgezeichnete Stelle vergroessert).
 *  2. Die Kennzeichen-Liste kennt nur, was bei der Sichtung gefunden wurde. Ein uebersehenes
 *     Kennzeichen geht durch — beim naechsten Foto also wieder ansehen, nicht nur rechnen.
 *  3. „digitalCapture“ steht hier, weil der User fuer diese Lieferung bestaetigt hat: echt,
 *     weder KI-generiert noch -bearbeitet (2026-09-21). Fuer ein Foto ohne diese Angabe gehoert
 *     der Wert NICHT hinein: Dann `quelltyp` am Eintrag setzen, und zwar nach Aussage des Users,
 *     nie nach Augenschein. Das Skript prueft nicht, ob `quelltyp` zu `data/bildherkunft.ts` passt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { FOTOS, VERGLEICHE } from './lib/fotos-liste.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(wurzel, 'public', 'assets');
const PRUEFUNG = path.join(wurzel, 'output', 'fotos-pruef');

const STANDARD_ORDNER =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/Neue Fotos Schleife September';

/** Werte aus `scripts/convert-images.mjs` — das Ursprungskonzept. Nicht hier abweichend drehen. */
const QUALITAET = 82;
const AUFWAND = 6;
/**
 * Zielformat aller Fotos dieser Lieferung (quer) und ihre Breite.
 *
 * WARUM 4:3 UND NICHT 16:9 wie die echten Fotos vom Juli (2400 × 1357): Die meisten Einsatzorte
 * sind Karten — das aufgeklappte Akkordeon ist nahezu quadratisch, die Leistungskarten 16:10.
 * Aus 4:3 bleiben dort drei Viertel der Bildbreite stehen, aus 16:9 kaum mehr als die Haelfte.
 *
 * WARUM 2000 STATT DER HOECHSTBREITE 2400: dasselbe Pixelbudget wie die Juli-Fotos
 * (2000 × 1500 = 3,0 MP gegen 2400 × 1357 = 3,3 MP) und damit dieselbe Dateigroesse. Gemessen am
 * 2026-09-21: bei 2400 × 1800 lagen vier Fotos zwischen 495 und 555 KB, bei 2000 × 1500 zwischen
 * 211 und 339 KB. 2000 px decken den Seitenhintergrund auf Full-HD (1920) noch ohne Hochskalieren.
 */
const FORMAT = 4 / 3;
const MAX_BREITE = 2000;

const URHEBER = 'CarCare Center Leipzig (BS CarCare GmbH)';
const RECHTE = '© 2026 BS CarCare GmbH, Leipzig. Alle Rechte vorbehalten.';
const QUELLTYP_ECHT = 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture';

// Die Fotoliste (FOTOS, VERGLEICHE) steht seit 2026-10-14 in `scripts/lib/fotos-liste.mjs`, Feldbeschreibung dort.
const QUELLTYP_ZUSAMMENSTELLUNG = 'http://cv.iptc.org/newscodes/digitalsourcetype/compositeCapture';
const FUGE = 8;

const args = process.argv.slice(2);
const wert = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const ordner = wert('--ordner') ?? STANDARD_ORDNER;
const nur = wert('--nur');
const auswahl = FOTOS.filter((f) => !nur || f.ziel.includes(nur));
const vergleichsAuswahl = VERGLEICHE.filter((v) => !nur || v.ziel.includes(nur));

if (!fs.existsSync(ordner)) {
  console.error(`[fotos] Lieferordner nicht gefunden:\n        ${ordner}`);
  console.error('[fotos] Er liegt bewusst ausserhalb des Repositories. Pfad angeben mit:  npm run fotos -- --ordner "<Pfad>"');
  process.exit(1);
}
if (!auswahl.length && !vergleichsAuswahl.length) {
  const bekannt = [...FOTOS, ...VERGLEICHE].map((f) => path.basename(f.ziel, '.webp')).join(', ');
  console.error(`[fotos] Kein Ziel enthaelt "${nur}". Bekannt: ${bekannt}`);
  process.exit(1);
}
// Eintraege mit eigenem `ordner` (seit 2026-10-03) lesen von dort, alle anderen aus dem Standard bzw. `--ordner`.
const quellpfad = (f) => path.join(f.ordner ?? ordner, f.quelle);
const quellen = [...auswahl.map(quellpfad), ...vergleichsAuswahl.flatMap((v) => [v.vorher.quelle, v.nachher.quelle].map((q) => path.join(ordner, q)))];
const fehlend = quellen.filter((q) => !fs.existsSync(q));
if (fehlend.length) {
  console.error(`[fotos] Quelle fehlt im Lieferordner: ${fehlend.join(', ')}`);
  process.exit(1);
}

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Aufnahmezeit aus dem Handy-EXIF: die frueheste Zeitangabe (DateTimeOriginal), ohne Zeitzone. */
const aufnahmezeit = (exif) => {
  if (!exif) return null;
  const zeiten = [...exif.toString('latin1').matchAll(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/g)]
    .map((m) => `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`)
    .sort();
  return zeiten[0] ?? null;
};

const xmpPaket = (f, datum, quelltyp = QUELLTYP_ECHT) => `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    photoshop:Headline="${xml(f.titel)}"
    photoshop:Credit="CarCare Center Leipzig"
    photoshop:City="Leipzig"
    photoshop:State="Sachsen"
    photoshop:Country="Deutschland"${datum ? `\n    photoshop:DateCreated="${datum}"` : ''}
    Iptc4xmpCore:CountryCode="DE"
    Iptc4xmpExt:DigitalSourceType="${quelltyp}"${f.ki ? `\n    Iptc4xmpExt:AISystemUsed="${xml(f.ki.system)}"` : ''}${f.ki?.version ? `\n    Iptc4xmpExt:AISystemVersionUsed="${xml(f.ki.version)}"` : ''}
    xmpRights:Marked="True">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xml(f.titel)}</rdf:li></rdf:Alt></dc:title>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${xml(f.beschreibung)}</rdf:li></rdf:Alt></dc:description>
   <dc:creator><rdf:Seq><rdf:li>${xml(URHEBER)}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xml(RECHTE)}</rdf:li></rdf:Alt></dc:rights>
   <dc:subject><rdf:Bag>${[...f.stichwoerter, 'Leipzig', 'CarCare Center'].map((s) => `<rdf:li>${xml(s)}</rdf:li>`).join('')}</rdf:Bag></dc:subject>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

fs.mkdirSync(PRUEFUNG, { recursive: true });
const kb = (p) => `${Math.round(fs.statSync(p).size / 1024)} KB`;
const ergebnis = [];

for (const f of auswahl) {
  const quelle = quellpfad(f);
  const meta = await sharp(quelle).metadata();
  const datum = aufnahmezeit(meta.exif);

  // 1. Aufrichten (EXIF-Drehung) und als Rohdaten halten — sRGB, ohne Alphakanal.
  const { data, info } = await sharp(quelle).rotate().removeAlpha().toColourspace('srgb').raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const roh = { raw: { width: W, height: H, channels: info.channels } };

  // 2. Kennzeichen unkenntlich: Stelle ausschneiden, stark weichzeichnen, zurueck einsetzen.
  //    Sigma nach der Hoehe der Stelle: Schrift dieser Groesse verschwindet vollstaendig.
  const flecken = [];
  for (const u of f.unkenntlich ?? []) {
    const left = Math.round(u.x0 * W);
    const top = Math.round(u.y0 * H);
    const width = Math.round((u.x1 - u.x0) * W);
    const height = Math.round((u.y1 - u.y0) * H);
    const sigma = Math.max(12, Math.round(height / 2));
    const fleck = await sharp(data, roh).extract({ left, top, width, height }).blur(sigma).raw().toBuffer();
    flecken.push({ input: fleck, raw: { width, height, channels: info.channels }, left, top, was: u.was });
  }
  // ⚠️ `composite` liefert Rohdaten MIT Alphakanal (4 statt 3 Kanaele). Wer sie danach mit der
  // alten Kanalzahl liest, bekommt ein zerschossenes Bild — so geschehen im ersten Lauf am
  // 2026-09-21, sichtbar nur im Pruefbogen. Deshalb Alpha weg und die Masse neu uebernehmen.
  let entschaerft = data;
  let rohFertig = roh;
  if (flecken.length) {
    const r = await sharp(data, roh)
      .composite(flecken.map(({ input, raw, left, top }) => ({ input, raw, left, top })))
      .removeAlpha().raw().toBuffer({ resolveWithObject: true });
    entschaerft = r.data;
    rohFertig = { raw: { width: r.info.width, height: r.info.height, channels: r.info.channels } };
  }

  // 3. Ausschnitt 4:3 quer (oder `format`). Querformate im Zielformat bleiben vollstaendig.
  //    Ausnahme `ausschnitt` (Hintergrund-Fassungen): fester Rahmen, ohne `y1` im Format 16:10.
  const format = f.format ?? FORMAT;
  let ausschnitt = { left: 0, top: 0, width: W, height: H };
  if (f.ausschnitt) {
    const a = f.ausschnitt;
    const width = Math.round((a.x1 - a.x0) * W);
    const height = Math.round(a.y1 !== undefined ? (a.y1 - a.y0) * H : width / 1.6);
    ausschnitt = { left: Math.round(a.x0 * W), top: Math.min(H - height, Math.round(a.y0 * H)), width, height };
  } else if (W / H < format - 0.01) {
    const hoehe = Math.round(W / format);
    const top = Math.min(H - hoehe, Math.max(0, Math.round((f.oben ?? 0.5 - hoehe / H / 2) * H)));
    ausschnitt = { left: 0, top, width: W, height: hoehe };
  } else if (W / H > format + 0.01) {
    const breite = Math.round(H * format);
    ausschnitt = { left: Math.round((W - breite) / 2), top: 0, width: breite, height: H };
  }

  // 4. Web-Fassung nach dem Ursprungskonzept, mit neuen Metadaten statt der Handy-Metadaten.
  const ziel = path.join(ZIEL, f.ziel);
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  await sharp(entschaerft, rohFertig)
    .extract(ausschnitt)
    .resize({ width: f.breite ?? MAX_BREITE, withoutEnlargement: true })
    .webp({ quality: QUALITAET, effort: AUFWAND })
    .withExif({ IFD0: { Artist: 'BS CarCare GmbH', Copyright: '(c) 2026 BS CarCare GmbH, Leipzig' } })
    .withXmp(xmpPaket(f, datum, f.quelltyp))
    .toFile(ziel);
  const fertig = await sharp(ziel).metadata();

  // 5. Pruefbogen: ganzes Bild mit eingezeichnetem Ausschnitt (rot) und Weichzeichnung (gelb),
  //    daneben das Ergebnis; je weichgezeichnete Stelle eine Vergroesserung aus dem ERGEBNIS.
  const name = path.basename(f.ziel, '.webp');
  const vb = 520;
  const skala = vb / W;
  const rahmen = (r, farbe) => `<rect x="${r.left * skala}" y="${r.top * skala}" width="${r.width * skala}" height="${r.height * skala}" fill="none" stroke="${farbe}" stroke-width="3"/>`;
  const ueberlagerung = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${vb}" height="${Math.round(H * skala)}">${rahmen(ausschnitt, '#ef4444')}${flecken.map((fl) => rahmen({ left: fl.left, top: fl.top, width: fl.raw.width, height: fl.raw.height }, '#facc15')).join('')}</svg>`);
  const links = await sharp(entschaerft, rohFertig).resize({ width: vb }).composite([{ input: ueberlagerung, left: 0, top: 0 }]).jpeg().toBuffer();
  const rechts = await sharp(ziel).resize({ width: 640 }).jpeg().toBuffer();
  const hl = Math.round(H * skala);
  const hr = Math.round(640 / (fertig.width / fertig.height));
  await sharp({ create: { width: vb + 640 + 36, height: Math.max(hl, hr) + 24, channels: 3, background: '#111111' } })
    .composite([{ input: links, left: 12, top: 12 }, { input: rechts, left: vb + 24, top: 12 }])
    .jpeg({ quality: 80 })
    .toFile(path.join(PRUEFUNG, `${name}.jpg`));
  let n = 0;
  for (const fl of flecken) {
    // Lage der Stelle im Ergebnis: erst Ausschnitt, dann Skalierung auf die Zielbreite.
    const s = fertig.width / ausschnitt.width;
    const rand = 40;
    const left = Math.max(0, Math.round((fl.left - ausschnitt.left) * s) - rand);
    const top = Math.max(0, Math.round((fl.top - ausschnitt.top) * s) - rand);
    const width = Math.min(fertig.width - left, Math.round(fl.raw.width * s) + 2 * rand);
    const height = Math.min(fertig.height - top, Math.round(fl.raw.height * s) + 2 * rand);
    await sharp(ziel).extract({ left, top, width, height }).resize({ width: width * 4, kernel: 'nearest' }).jpeg({ quality: 90 })
      .toFile(path.join(PRUEFUNG, `${name}-unkenntlich-${++n}.jpg`));
  }

  ergebnis.push({ f, ziel, fertig, datum, flecken: flecken.map((fl) => fl.was), hochformat: !f.ausschnitt && ausschnitt.height < H });
}

// VERGLEICHSBILDER (6.2): zwei Ausschnitte 4:5 gleicher Groesse nebeneinander, weisse Fuge dazwischen.
for (const v of vergleichsAuswahl) {
  const haelfteBreite = Math.floor((MAX_BREITE - FUGE) / 2);
  const haelfteHoehe = Math.round(haelfteBreite * 1.25);
  const teile = [];
  for (const seite of [v.vorher, v.nachher]) {
    const quelle = path.join(ordner, seite.quelle);
    const datum = aufnahmezeit((await sharp(quelle).metadata()).exif);
    const { data, info } = await sharp(quelle).rotate().removeAlpha().toColourspace('srgb').raw()
      .toBuffer({ resolveWithObject: true });
    const W = info.width;
    const H = info.height;
    const width = Math.round(seite.b * W);
    const height = Math.round(width * 1.25);
    if (height > H) throw new Error(`[fotos] ${seite.quelle}: Ausschnitt ${width} x ${height} ist hoeher als das Bild (${H})`);
    const rahmen = { left: Math.round(seite.x0 * W), top: Math.min(H - height, Math.round(seite.y0 * H)), width, height };
    const roh = { raw: { width: W, height: H, channels: info.channels } };
    const bild = await sharp(data, roh).extract(rahmen).resize({ width: haelfteBreite, height: haelfteHoehe }).raw().toBuffer();
    teile.push({ seite, datum, rahmen, W, H, data, roh, bild });
  }
  const ziel = path.join(ZIEL, v.ziel);
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  const kanaele = { raw: { width: haelfteBreite, height: haelfteHoehe, channels: 3 } };
  await sharp({ create: { width: 2 * haelfteBreite + FUGE, height: haelfteHoehe, channels: 3, background: '#ffffff' } })
    .composite([{ input: teile[0].bild, ...kanaele, left: 0, top: 0 }, { input: teile[1].bild, ...kanaele, left: haelfteBreite + FUGE, top: 0 }])
    .webp({ quality: QUALITAET, effort: AUFWAND })
    .withExif({ IFD0: { Artist: 'BS CarCare GmbH', Copyright: '(c) 2026 BS CarCare GmbH, Leipzig' } })
    .withXmp(xmpPaket(v, teile[0].datum, QUELLTYP_ZUSAMMENSTELLUNG))
    .toFile(ziel);
  const fertig = await sharp(ziel).metadata();

  // Pruefbogen: beide Quellen mit rotem Ausschnitt, darunter das Ergebnis.
  const vb = 420;
  const quellbilder = [];
  for (const t of teile) {
    const skala = vb / t.W;
    const rot = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${vb}" height="${Math.round(t.H * skala)}"><rect x="${t.rahmen.left * skala}" y="${t.rahmen.top * skala}" width="${t.rahmen.width * skala}" height="${t.rahmen.height * skala}" fill="none" stroke="#ef4444" stroke-width="3"/></svg>`);
    quellbilder.push({ bild: await sharp(t.data, t.roh).resize({ width: vb }).composite([{ input: rot, left: 0, top: 0 }]).jpeg().toBuffer(), hoehe: Math.round(t.H * skala) });
  }
  const ergebnisBild = await sharp(ziel).resize({ width: 2 * vb + 12 }).jpeg().toBuffer();
  const hq = Math.max(...quellbilder.map((q) => q.hoehe));
  const he = Math.round((2 * vb + 12) / (fertig.width / fertig.height));
  await sharp({ create: { width: 2 * vb + 36, height: hq + he + 36, channels: 3, background: '#111111' } })
    .composite([
      { input: quellbilder[0].bild, left: 12, top: 12 },
      { input: quellbilder[1].bild, left: vb + 24, top: 12 },
      { input: ergebnisBild, left: 12, top: hq + 24 },
    ])
    .jpeg({ quality: 80 })
    .toFile(path.join(PRUEFUNG, `${path.basename(v.ziel, '.webp')}.jpg`));

  ergebnis.push({
    f: v, ziel, fertig, datum: `${teile[0].datum ?? '?'} / ${teile[1].datum ?? '?'}`, flecken: [], hochformat: false, vergleich: true,
  });
}

console.log('[fotos] fertig:');
for (const e of ergebnis) {
  const rel = path.relative(wurzel, e.ziel).split(path.sep).join('/');
  const zusatz = [e.hochformat ? `${e.f.format === 1 ? '1:1' : '4:3'}-Ausschnitt aus Hochformat` : '', e.f.ausschnitt ? 'Hintergrund-Ausschnitt' : '', e.vergleich ? 'Vorher/Nachher aus zwei Aufnahmen' : '', e.flecken.length ? `unkenntlich: ${e.flecken.join('; ')}` : '']
    .filter(Boolean).join(' · ');
  console.log(`  ${rel.padEnd(62)} ${`${e.fertig.width}x${e.fertig.height}`.padEnd(10)} ${kb(e.ziel).padStart(7)}  ${e.datum ?? 'ohne Aufnahmezeit'}${zusatz ? `  · ${zusatz}` : ''}`);
}
console.log(`\n  Pruefbogen: output/fotos-pruef/*.jpg — Ausschnitt (rot) und Kennzeichen (gelb) ansehen, bevor eingebaut wird.`);
// Bis 2026-10-14 stand hier bei jedem Lauf die Septemberlieferung, auch fuer spaetere Fotos.
console.log('  Herkunft und Kennzeichnung: docs/bilder/motive.json und data/bildherkunft.ts nachziehen.');
