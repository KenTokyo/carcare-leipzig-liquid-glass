// Erzeugt die beiden Bild-Assets des Preloaders aus den vorhandenen Marken-Dateien.
//
// Der Preloader ist das ERSTE, was ein Besucher der Startseite sieht — seine Bilder liegen
// damit auf dem kritischen Pfad. Beide Quellen sind fuer diesen Zweck deutlich zu gross:
//   carcare-center-logo.webp      842x596, 73,0 KB  — enthaelt Siegel UND Wortmarke
//   carcare-center-wordmark.png  3711x1205, 84,4 KB — dargestellt werden max. 420 px Breite
//
// --- Siegel (carcare-center-mark.webp) ---------------------------------------------
// Aus dem Kombi-Logo wird nur das Siegel ausgeschnitten; die Wortmarke kommt separat und
// in hoeherer Qualitaet aus der eigenen Datei.
//
// FREISTELLUNG per KREISMASKE — nicht per Alpha-Threshold auf Weiss:
// Seit der Preloader das Hero-Foto zeigt, reicht ein weisser Grund nicht mehr. Ein
// Threshold auf Weiss waere hier der falsche Weg: Das Siegel traegt einen weichen
// Schlagschatten, der dabei als grauer Halo stehen bliebe.
//
// Stattdessen wurde die Geometrie ausgemessen: Die Kugel ist ein exakter Kreis —
// Bounding-Box bei Luminanz-Schwelle 200 ist 265x265 (also quadratisch), Mittelpunkt
// (144, 143), Radius 132,5. Eine SVG-Kreismaske schneidet damit pixelgenau frei, mit
// natuerlicher Kantenglaettung durch das SVG-Rendering. Der Schlagschatten faellt weg —
// gewollt: Ein eingebackener Schatten wuerde auf dem Foto ohnehin falsch wirken.
//
// WEISSPUNKT-KORREKTUR VORHER: Der Grund des Quell-Logos ist NICHT reines Weiss, sondern
// ein warmes Off-White (gemessen: 255,253,252). Ohne Korrektur zoegen die kantengeglaetteten
// Randpixel der Kugel einen warmen Saum mit. `linear()` bildet genau diese Farbe auf
// 255,255,255 ab; die Farbverschiebung im Siegel selbst liegt unter 1,2 %.
//
// Crop-Werte per sharp am Original vermessen, nicht geschaetzt: Inhalts-Bounding-Box des
// Siegels = x 32..300 (269 px), y 165..436 (272 px). Daraus ein Quadrat um den Mittelpunkt
// (166 / 300.5) mit etwas Luft, damit der Schlagschatten nicht am Rand abgeschnitten wird.
//
// --- Wortmarke (carcare-center-wordmark-dark.webp) ----------------------------------
// Verkleinert auf 840 px Breite = 2x der groessten Darstellung (420 px), also scharf bis
// zu Retina-Displays.
//
// WebP LOSSLESS, nicht lossy: Die Wortmarke hat harte Kanten und einen Alphakanal —
// verlustbehaftetes WebP erzeugt dort sichtbare Artefakte (gleiche Ueberlegung wie in
// components/Footer.tsx, wo die weisse Wortmarke deshalb als PNG bleibt). Lossless ist
// pixelgenau und hier trotzdem klein, weil das Bild grossflaechig transparent ist.
//
// Aufruf: node scripts/build-preloader-assets.mjs

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { statSync } from 'node:fs';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (rel) => resolve(root, rel);
const kb = (file) => (statSync(file).size / 1024).toFixed(1);

// ---------------------------------------------------------------- Siegel
const LOGO_SRC = p('public/assets/carcare-center-logo.webp');
const MARK_OUT = p('public/assets/carcare-center-mark.webp');

/** Vermessene Siegel-Bounding-Box im Quell-WebP. */
const SEAL = { x0: 32, x1: 300, y0: 165, y1: 436 };
/** Kantenlaenge des quadratischen Crops (272 px Inhalt + 2x10 px Luft). */
const CROP = 292;
/** Ausgabegroesse — 288 px reicht fuer die groesste Darstellung (144 px @2x). */
const MARK_SIZE = 288;

const cx = Math.round((SEAL.x0 + SEAL.x1) / 2);
const cy = Math.round((SEAL.y0 + SEAL.y1) / 2);
const logoMeta = await sharp(LOGO_SRC).metadata();
const left = Math.round(Math.max(0, Math.min(cx - CROP / 2, logoMeta.width - CROP)));
const top = Math.round(Math.max(0, Math.min(cy - CROP / 2, logoMeta.height - CROP)));

/** Gemessener Grundton des Quell-Logos im Siegel-Bereich. Wird auf reines Weiss gezogen. */
const MEASURED_BG = [255, 253, 252];
const whitePoint = MEASURED_BG.map((v) => 255 / v);

/** Ausgemessene Kugel im 288er-Zwischenbild: Mittelpunkt (144, 143), Radius 132,5. */
const SPHERE = { cx: 144, cy: 143, r: 132.5 };
/** 0,5 px nach innen — schneidet den kantengeglaetteten Uebergang zum Weiss mit weg. */
const MASK_R = SPHERE.r - 0.5;

// Zwischenschritt im Speicher: zuschneiden, Weisspunkt korrigieren, auf 288 bringen.
const flattened = await sharp(LOGO_SRC)
  // Das Quell-WebP hat "dirty alpha" (Ecken teils 255/255/255/128). Ohne flatten
  // schlaegt das beim Re-Encode als fleckiger Rand durch.
  .flatten({ background: '#ffffff' })
  .extract({ left, top, width: CROP, height: CROP })
  .linear(whitePoint, [0, 0, 0])
  .resize(MARK_SIZE, MARK_SIZE, { fit: 'cover' })
  .png()
  .toBuffer();

// SVG erst explizit auf exakt MARK_SIZE rastern: sharp leitet die Groesse sonst aus
// Density/Viewport ab und liefert je nach Umgebung ein paar Pixel mehr — composite
// bricht dann mit "must have same dimensions or smaller" ab.
const circleMask = await sharp(
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${MARK_SIZE}" height="${MARK_SIZE}" viewBox="0 0 ${MARK_SIZE} ${MARK_SIZE}">` +
      `<circle cx="${SPHERE.cx}" cy="${SPHERE.cy}" r="${MASK_R}" fill="#fff"/></svg>`
  )
)
  .resize(MARK_SIZE, MARK_SIZE, { fit: 'fill' })
  .png()
  .toBuffer();

// Maskieren und Zuschneiden MUESSEN zwei getrennte sharp-Durchlaeufe sein: sharp fuehrt
// die Operationen in fester interner Reihenfolge aus, nicht in Aufrufreihenfolge — `trim`
// gehoert zur Resize-Phase und liefe damit VOR `composite`. Ergebnis waere ein bereits
// verkleinertes Bild und der Abbruch "Image to composite must have same dimensions".
const masked = await sharp(flattened)
  .ensureAlpha()
  // `dest-in` behaelt vom Bild nur, was in der Maske deckend ist -> alles ausserhalb
  // des Kreises wird transparent.
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(masked)
  // Auf den Kreis zuschneiden, damit die Elementgroesse im CSS direkt der sichtbaren
  // Marke entspricht (kein unsichtbarer Rand, der die Lockup-Geometrie verfaelscht).
  .trim({ threshold: 0 })
  .webp({ quality: 92, alphaQuality: 100 })
  .toFile(MARK_OUT);

const markMeta = await sharp(MARK_OUT).metadata();
console.log(`[preloader-assets] Siegel    ${kb(LOGO_SRC)} KB -> ${kb(MARK_OUT)} KB  (${markMeta.width}x${markMeta.height}, freigestellt per Kreismaske r=${MASK_R})`);

// Selbstpruefung: Die Ecken MUESSEN jetzt vollstaendig transparent sein, sonst zeichnet
// sich auf dem Hero-Foto wieder ein Kasten um das Siegel ab.
{
  const { data, info } = await sharp(MARK_OUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
  const corners = [alphaAt(0, 0), alphaAt(info.width - 1, 0), alphaAt(0, info.height - 1), alphaAt(info.width - 1, info.height - 1)];
  const centre = alphaAt(info.width >> 1, info.height >> 1);
  const ok = corners.every((a) => a === 0) && centre === 255;
  console.log(`[preloader-assets] Alpha-Pruefung: Ecken=${corners.join(',')} Mitte=${centre}  ${ok ? '-> freigestellt OK' : '-> FEHLER!'}`);
  if (!ok) process.exitCode = 1;
}

// ---------------------------------------------------------------- Wortmarke
const WORD_SRC = p('public/assets/carcare-center-wordmark.png');
const WORD_OUT = p('public/assets/carcare-center-wordmark-dark.webp');
/** 2x der groessten Darstellung (420 px) — scharf bis Retina, ohne Ueberschuss. */
const WORD_WIDTH = 840;

const wordMeta = await sharp(WORD_SRC).metadata();
await sharp(WORD_SRC)
  .resize({ width: WORD_WIDTH, withoutEnlargement: true })
  .webp({ lossless: true })
  .toFile(WORD_OUT);

const outMeta = await sharp(WORD_OUT).metadata();
console.log(`[preloader-assets] Wortmarke ${kb(WORD_SRC)} KB -> ${kb(WORD_OUT)} KB  (${wordMeta.width}x${wordMeta.height} -> ${outMeta.width}x${outMeta.height})`);
console.log(`[preloader-assets] Seitenverhaeltnis Wortmarke: ${(outMeta.width / outMeta.height).toFixed(3)}  <- muss als aspect-ratio in index.html stehen`);
