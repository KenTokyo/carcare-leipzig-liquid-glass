#!/usr/bin/env node
/**
 * PNG/JPEG -> WebP fuer /public/assets.
 *
 * Warum: SEO-GEO-STANDARDS §2.2 verlangt WebP/AVIF und LCP < 2,5 s. PNG ist verlustfrei
 * und fuer Grafik/Transparenz gedacht — bei FOTOS ist es typisch 3-5x groesser als WebP
 * bei optisch gleichem Ergebnis. Die Kacheln der Startseite bekommen je ein eigenes Foto
 * (siehe ExpandingCardAccordion), das summiert sich sonst schnell auf zweistellige MB.
 *
 * Nutzung:
 *   npm run images                      # alles in public/assets (rekursiv)
 *   npm run images -- public/assets/kacheln
 *   npm run images -- --force           # auch bereits konvertierte neu erzeugen
 *   npm run images -- --max=1600        # Breite staerker deckeln (Default 2400)
 *   npm run images -- --replace         # Originale nach Erfolg loeschen (bewusst opt-in)
 *
 * ⚠️ WICHTIG: `public/` wird **1:1 mitdeployed**. Ein dort liegengebliebenes Original
 * landet also auf dem Server und frisst Traffic, obwohl es niemand anfordert. Die
 * Originale gehoeren daher NICHT nach `public/` — dort nur die fertigen `.webp`.
 * Workflow: Quelldatei kopieren -> konvertieren -> Original wieder entfernen
 * (oder `--replace`). Das Skript warnt unten, wenn Originale in `public/` verbleiben.
 */
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUELL_FORMATE = new Set(['.png', '.jpg', '.jpeg']);

const args = process.argv.slice(2);
const force = args.includes('--force');
const replace = args.includes('--replace');
const maxArg = args.find((a) => a.startsWith('--max='));
const MAX_BREITE = maxArg ? Number(maxArg.split('=')[1]) : 2400;
const zielOrdner = args.find((a) => !a.startsWith('--')) ?? 'public/assets';

/** Rekursiv alle konvertierbaren Dateien einsammeln. */
const sammle = async (dir) => {
  let treffer = [];
  let eintraege;
  try {
    eintraege = await readdir(dir, { withFileTypes: true });
  } catch {
    return treffer;
  }
  for (const e of eintraege) {
    const p = join(dir, e.name);
    if (e.isDirectory()) treffer = treffer.concat(await sammle(p));
    else if (QUELL_FORMATE.has(extname(e.name).toLowerCase())) treffer.push(p);
  }
  return treffer;
};

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;
const mb = (bytes) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : kb(bytes));

/**
 * Zielnamen bilden. Faengt die Doppel-Endung `name.webp.png` ab: Export-Tools haengen
 * die echte Endung gern an den gewuenschten Namen an. Ohne diesen Schritt entstuende
 * `name.webp.webp`.
 */
const zielName = (quelle) => {
  let stamm = basename(quelle, extname(quelle));
  if (extname(stamm).toLowerCase() === '.webp') stamm = basename(stamm, '.webp');
  return join(dirname(quelle), `${stamm}.webp`);
};

const basis = join(ROOT, zielOrdner);
const dateien = await sammle(basis);

if (dateien.length === 0) {
  console.log(`Keine PNG/JPEG in "${zielOrdner}" gefunden.`);
  console.log('Tipp: Fotos dort ablegen und erneut ausfuehren.');
  process.exit(0);
}

console.log(`Konvertiere ${dateien.length} Datei(en) aus "${zielOrdner}" -> WebP`);
console.log(`Qualitaet 82 | max. Breite ${MAX_BREITE}px | Originale ${replace ? 'werden GELOESCHT' : 'bleiben erhalten'}\n`);

let summeVorher = 0;
let summeNachher = 0;
let uebersprungen = 0;
const zeilen = [];

for (const quelle of dateien) {
  const ziel = zielName(quelle);
  const relativ = quelle.slice(basis.length + 1).replace(/\\/g, '/');

  if (!force) {
    try {
      await stat(ziel);
      uebersprungen++;
      continue; // .webp existiert schon
    } catch {
      /* noch nicht konvertiert -> weiter */
    }
  }

  try {
    const vorher = (await stat(quelle)).size;
    const bild = sharp(quelle);
    const meta = await bild.metadata();
    // Nur verkleinern, nie hochskalieren.
    if (meta.width && meta.width > MAX_BREITE) bild.resize({ width: MAX_BREITE, withoutEnlargement: true });
    await bild.webp({ quality: 82, effort: 6 }).toFile(ziel);
    const nachher = (await stat(ziel)).size;

    summeVorher += vorher;
    summeNachher += nachher;
    const ersparnis = Math.round((1 - nachher / vorher) * 100);
    zeilen.push(
      `  ${relativ}\n    ${mb(vorher)} -> ${mb(nachher)}  (${ersparnis > 0 ? '-' : '+'}${Math.abs(ersparnis)}%)` +
        (meta.width && meta.width > MAX_BREITE ? `  [Breite ${meta.width} -> ${MAX_BREITE}px]` : ''),
    );
    if (replace) await unlink(quelle);
  } catch (err) {
    zeilen.push(`  ${relativ}\n    FEHLER: ${err.message}`);
  }
}

console.log(zeilen.join('\n'));
if (uebersprungen) console.log(`\n${uebersprungen} Datei(en) uebersprungen (WebP existiert bereits; --force erzwingt neu).`);
if (summeVorher > 0) {
  const gesamt = Math.round((1 - summeNachher / summeVorher) * 100);
  console.log(`\nGesamt: ${mb(summeVorher)} -> ${mb(summeNachher)}  (${gesamt}% gespart)`);
  if (!replace && zielOrdner.startsWith('public')) {
    console.log(
      `\n⚠️  Die ${dateien.length} Original(e) liegen noch in "${zielOrdner}" — public/ wird 1:1 mitdeployed!` +
        '\n   Bitte entfernen (oder beim naechsten Mal --replace nutzen), sonst landen sie auf dem Server.',
    );
  }
  console.log('\nNaechster Schritt: Pfade als `backgroundImage` in components/ServiceGrid.tsx eintragen.');
}
