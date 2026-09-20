// Erzeugt die Favicons aus dem freigestellten Siegel.
//
// AUFRUF: npm run favicons
//
// QUELLE: public/assets/carcare-center-mark.webp (264 x 264, per Kreismaske freigestellt,
// erzeugt von scripts/build-preloader-assets.mjs). Aendert sich das Siegel, erst dort neu
// bauen, dann hier.
//
// WARUM (2026-09-18, Befund aus `npm run bilder`): Das Favicon war das komplette Logo,
// 842 x 596 mit Siegel UND Schriftzug. Google zeigt in den Suchergebnissen nur quadratische
// Favicons (Seitenverhaeltnis 1:1, empfohlen ein Vielfaches von 48 px); ein anderes wird
// nicht angezeigt. Im Browser-Tab wurde der Schriftzug auf 16 px gestaucht und war
// unlesbar. Das Siegel ist das Markenzeichen, rund und von Haus aus quadratisch.
//
// DREI DATEIEN, weil die Empfaenger Verschiedenes erwarten:
//  * 48 px   — Browser-Tab und Google-Suche (Vielfaches von 48)
//  * 192 px  — Android-Startbildschirm, hochaufloesende Tabs
//  * 180 px  — Apple-Touch-Icon. iOS kann keine Transparenz (zeigt Schwarz) und rundet die
//              Ecken selbst ab. Deshalb weiss hinterlegt und mit Rand, sonst schneidet die
//              Rundung in die Kugel.
// PNG statt WebP: Nicht jeder Crawler und nicht jedes Betriebssystem liest WebP als Icon.
//
// ⚠️ Was dieser Lauf besteht, ohne dass die Sache in Ordnung ist: Er prueft nicht, ob
// index.html die Dateien auch einbindet. Das zeigt `npm run bilder` (Tabelle „Grafiken und
// Logos“, Zeile „Favicon“), gemessen am ausgelieferten HTML.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (rel) => path.join(wurzel, rel);
const QUELLE = p('public/assets/carcare-center-mark.webp');

const ZIELE = [
  { datei: 'public/assets/carcare-center-favicon-48.png', groesse: 48 },
  { datei: 'public/assets/carcare-center-favicon-192.png', groesse: 192 },
  { datei: 'public/assets/carcare-center-apple-touch-icon.png', groesse: 180, weiss: true, rand: 0.12 },
];

const meta = await sharp(QUELLE).metadata();
if (meta.width !== meta.height) {
  console.error(`[favicons] Quelle ist nicht quadratisch (${meta.width} x ${meta.height}) — Siegel neu bauen.`);
  process.exit(1);
}

for (const z of ZIELE) {
  const innen = Math.round(z.groesse * (1 - 2 * (z.rand ?? 0)));
  const siegel = await sharp(QUELLE).resize(innen, innen, { kernel: 'lanczos3' }).png().toBuffer();
  let bild = sharp({
    create: {
      width: z.groesse,
      height: z.groesse,
      channels: 4,
      background: z.weiss ? { r: 255, g: 255, b: 255, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: siegel, gravity: 'center' }]);
  // Apple-Touch-Icon ohne Alphakanal: vollstaendig deckend, iOS setzt sonst Schwarz ein.
  if (z.weiss) bild = sharp(await bild.png().toBuffer()).removeAlpha();
  // Palette-PNG: gemessen 15,6 statt 46,8 KB bei 192 px, auch in doppelter Vergroesserung
  // kein sichtbarer Unterschied im Kugelverlauf (die Farbreduktion rastert ihn).
  await bild.png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(p(z.datei));
  console.log(`[favicons] ${z.datei}  ${z.groesse} x ${z.groesse}  ${(fs.statSync(p(z.datei)).size / 1024).toFixed(1)} KB`);
}
