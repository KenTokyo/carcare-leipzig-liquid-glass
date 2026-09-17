#!/usr/bin/env node
/**
 * Partner- und Verbandslogos: Original → ausgelieferte Datei.
 *
 * AUFRUF:  npm run partnerlogos
 *
 * WOZU: Seit 2026-09-16 duerfen Logos freigegebener Partner auf der Seite stehen
 * (Backlog 3.16/3.31). Der Kunde gibt Freigaben einzeln und nach und nach — dieses Skript
 * macht jede weitere Freigabe zu EINER Zeile in `LOGOS` statt zu Handarbeit.
 * Vorgehen vollstaendig: `docs/partnerlogos/README.md`.
 *
 * ZWEI MODI:
 *   `mono`     — Partnerlogo fuer die Referenzlisten. Die FORM kommt aus dem Alphakanal
 *                des Originals, die Farbe wird einheitlich Graphit. So stehen alle Partner
 *                gleich ruhig nebeneinander, und kein Markenrot/-gruen dominiert die Liste.
 *                Kantenglaettung bleibt erhalten, weil sie im Alphakanal steckt.
 *   `original` — Siegel und Verbandszeichen (z. B. BVAT). UNVERAENDERT in der Farbe:
 *                Ein Guete- oder Mitgliedssiegel wird nicht umgefaerbt.
 *
 * ⚠️ ORIGINALE LIEGEN IN `docs/partnerlogos/quelle/`, NICHT IN `public/`. `public/` wird
 * 1:1 ausgeliefert (siehe `scripts/convert-images.mjs`); ein Original dort waere
 * ausgelieferter Ballast. Die Quelldateien sind unveraendert von der offiziellen Website
 * des Partners — Quelle und Datum stehen im README.
 *
 * AUSGABE: verlustfreies WebP (Logos haben harte Kanten und Schrift — verlustbehaftete
 * Kompression erzeugt dort sichtbare Saeume) plus die Masse fuer `width`/`height`.
 * Die Masse gehoeren in `data/partners.ts` bzw. `data/mitgliedschaften.ts` (CLS, §2.2).
 *
 * ⚠️ WAS DIESES SKRIPT NICHT PRUEFT: ob eine Freigabe vorliegt. Das ist keine Dateifrage.
 * Ein Eintrag hier ohne Zeile im Freigabe-Protokoll des README ist ein Fehler.
 */
import { mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Graphit aus den CI-Tokens (`--cc-graphite`, index.css). */
const GRAPHIT = { r: 21, g: 26, b: 33 };

/** Eine Zeile je freigegebenem Logo. */
const LOGOS = [
  {
    name: 'riparo',
    quelle: 'docs/partnerlogos/quelle/riparo_logo.png',
    ziel: 'public/assets/partner/riparo.webp',
    modus: 'mono',
  },
  {
    name: 'BVAT',
    quelle: 'docs/partnerlogos/quelle/BVAT-Logo-2024-komplett-Web.png',
    ziel: 'public/assets/partner/bvat.webp',
    modus: 'original',
  },
];

const einfarbig = async (pfad) => {
  const { data, info } = await sharp(pfad).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = GRAPHIT.r;
    data[i + 1] = GRAPHIT.g;
    data[i + 2] = GRAPHIT.b;
    // data[i + 3] bleibt: der Alphakanal ist die Form des Logos.
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
};

let fehler = 0;
for (const logo of LOGOS) {
  const quelle = join(ROOT, logo.quelle);
  const ziel = join(ROOT, logo.ziel);
  try {
    await stat(quelle);
  } catch {
    console.error(`[partnerlogos] FEHLT: ${logo.quelle}`);
    fehler++;
    continue;
  }
  await mkdir(dirname(ziel), { recursive: true });
  const bild = logo.modus === 'mono' ? await einfarbig(quelle) : sharp(quelle).ensureAlpha();
  // Transparente Raender entfernen, damit `h-…`-Klassen die sichtbare Marke bemessen.
  const getrimmt = await bild.png().toBuffer().then((b) => sharp(b).trim().toBuffer());
  const info = await sharp(getrimmt).webp({ lossless: true }).toFile(ziel);
  const groesse = (await stat(ziel)).size;
  console.log(
    `[partnerlogos] ${logo.name.padEnd(8)} ${logo.modus.padEnd(8)} ${info.width}x${info.height}  ${groesse} B  → ${logo.ziel}`
  );
}
if (fehler) process.exit(1);
