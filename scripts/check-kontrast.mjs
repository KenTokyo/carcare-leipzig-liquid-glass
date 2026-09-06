// Misst den WCAG-Kontrast im AUSGELIEFERTEN HTML — nicht im Quelltext.
//
// WARUM ES DIESES SKRIPT GIBT: Am 2026-09-03 hat eine Messung gefunden, was drei
// Sichtpruefungen nicht gefunden haben — Text unter AA auf vier Leistungsseiten, weil
// ein Verlauf ueber die Viewportbreite lief. Auge und Quelltext reichen hier nicht.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. Sie misst nur SICHTBAREN Text im aufgenommenen Bereich. Was erst nach einer
//     Interaktion erscheint (Akkordeon, Dialog, Flyout), wird nicht gemessen.
//  2. Sie misst je Route nur die eingestellten Scrollpositionen, nicht die ganze Seite.
//  3. Sie prueft Text gegen Hintergrund. Nicht-Text-Kontrast (Rahmen, Icons,
//     Fokusringe — WCAG 1.4.11) bleibt aussen vor.
//  4. Ein Element, das der Trefferprobe entgeht (z. B. `pointer-events: none` darueber),
//     kann faelschlich gemessen ODER faelschlich uebersprungen werden.
//
// DIE SECHS FALLEN, in die der erste Aufbau getappt ist (Spezifikation:
// docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md, Abschnitt 7.2):
//  1. NICHT an gerenderten Textpixeln messen — Kantenglaettung erzeugt teildeckende
//     Pixel mit beliebig schlechtem Kontrast. Erkennungszeichen: ueberall gleiche Werte.
//  2. ZWEI Aufnahmen derselben Stelle, mit und ohne Text. Die Textfarbe rechnerisch
//     voll deckend ueber den gemessenen Hintergrund legen.
//  3. Halbtransparente Textfarben mitrechnen — `gray-300..700` tragen hier Alphas.
//  4. Nur HINTER DEN GLYPHEN messen, nicht ueber den ganzen Zeilenkasten.
//  5. Nur messen, was auch gemalt wird — `checkVisibility` plus Trefferprobe.
//  6. Sample-Rechteck auf die Leinwand begrenzen, sonst transparentes Schwarz.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BREITEN = [
  { name: 'desktop', breite: 1440, hoehe: 900 },
  { name: 'mobil', breite: 390, hoehe: 844 },
];
const AA_NORMAL = 4.5;
const AA_GROSS = 3.0;
/** Anteil der Seitenhoehe je Aufnahme. Mehr Stellen = laenger, aber vollstaendiger. */
const POSITIONEN = [0, 0.25, 0.5, 0.75];

const args = process.argv.slice(2);
const nurRoute = args.find((a) => a.startsWith('/'));
const strikt = args.includes('--strikt');

// ------------------------------------------------ Farbrechnung ---------------
const kanal = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const leuchtdichte = ([r, g, b]) => 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
const verhaeltnis = (a, b) => {
  const la = leuchtdichte(a), lb = leuchtdichte(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};
/** Falle 3: halbtransparente Schrift rechnerisch auf den Hintergrund legen. */
const ueberlagern = (vorne, alpha, hinten) =>
  vorne.map((v, i) => Math.round(v * alpha + hinten[i] * (1 - alpha)));

const schwelleFuer = (px, gewicht) =>
  px >= 24 || (px >= 18.66 && Number(gewicht) >= 700) ? AA_GROSS : AA_NORMAL;

// ------------------------------------------------ Textstellen einsammeln -----
const SAMMLE = `(() => {
  const raus = [];
  const gehe = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let k = 0;
  while (gehe.nextNode()) {
    const knoten = gehe.currentNode;
    const text = knoten.nodeValue.trim();
    if (text.length < 3) continue;
    const el = knoten.parentElement;
    if (!el || ['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(el.tagName)) continue;

    // Falle 5a: Blenden am Vorfahren (display/visibility/opacity 0).
    if (!el.checkVisibility?.({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true })) continue;

    const cs = getComputedStyle(el);
    const bereich = document.createRange();
    bereich.selectNodeContents(knoten);
    for (const r of bereich.getClientRects()) {
      if (r.width < 6 || r.height < 6) continue;
      if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;

      // Falle 5b: Trefferprobe — liegt an dieser Stelle wirklich unser Element oben?
      const mx = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 2);
      const my = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 2);
      const oben = document.elementFromPoint(mx, my);
      if (!oben || !(oben === el || el.contains(oben) || oben.contains(el))) continue;

      raus.push({
        id: 'k' + (k++),
        text: text.slice(0, 60),
        rect: { x: r.left, y: r.top, w: r.width, h: r.height },
        farbe: cs.color,
        px: parseFloat(cs.fontSize),
        gewicht: cs.fontWeight,
      });
    }
  }
  return raus;
})()`;

/** Falle 2: Text unsichtbar machen, Hintergrund bleibt stehen. */
const TEXT_AUS = `
  #cc-kontrast-aus * { color: transparent !important; -webkit-text-fill-color: transparent !important;
                       text-shadow: none !important; }
`;

const rgbLesen = (s) => {
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return { rgb: [0, 0, 0], alpha: 1 };
  const t = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return { rgb: [t[0], t[1], t[2]], alpha: t.length > 3 ? t[3] : 1 };
};

// ------------------------------------------------ Hauptlauf ------------------
if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[kontrast] dist/ fehlt — bitte zuerst `npm run build`.');
  process.exit(1);
}

const routen = (nurRoute ? [nurRoute] : getRoutes().map((r) => r.path ?? r)).filter(Boolean);
const { basis, stopp } = await startePreview();
const browser = await puppeteer.launch({ headless: 'new' });
const befunde = [];
let gemessen = 0;

try {
  for (const route of routen) {
    for (const b of BREITEN) {
      const seite = await browser.newPage();
      await seite.setViewport({ width: b.breite, height: b.hoehe, deviceScaleFactor: 1 });
      await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await seite.evaluateOnNewDocument(HALTE_SCROLL);
      await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 700));

      const hoehe = await seite.evaluate('document.body.scrollHeight');
      for (const anteil of POSITIONEN) {
        const y = Math.round(Math.max(0, Math.min(hoehe - b.hoehe, hoehe * anteil)));
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        await new Promise((r) => setTimeout(r, 550));

        const stellen = await seite.evaluate(SAMMLE);
        if (!stellen.length) continue;

        const mitText = await seite.screenshot({ type: 'png' });
        await seite.evaluate((css) => {
          const s = document.createElement('style');
          s.id = 'cc-kontrast-style';
          s.textContent = css.replace('#cc-kontrast-aus', 'html');
          document.head.appendChild(s);
        }, TEXT_AUS);
        await new Promise((r) => setTimeout(r, 220));
        const ohneText = await seite.screenshot({ type: 'png' });
        await seite.evaluate(() => document.getElementById('cc-kontrast-style')?.remove());

        const A = await sharp(mitText).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        const B = await sharp(ohneText).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
        const W = A.info.width, H = A.info.height;

        for (const s of stellen) {
          // Falle 6: Rechteck auf die Leinwand begrenzen.
          const x0 = Math.max(0, Math.floor(s.rect.x));
          const y0 = Math.max(0, Math.floor(s.rect.y));
          const x1 = Math.min(W, Math.ceil(s.rect.x + s.rect.w));
          const y1 = Math.min(H, Math.ceil(s.rect.y + s.rect.h));
          if (x1 - x0 < 3 || y1 - y0 < 3) continue;

          // Falle 1 + 4: Glyphenmaske aus der Differenz beider Aufnahmen.
          // Nur klar abweichende Pixel zaehlen — Kantenglaettung faellt raus.
          let sr = 0, sg = 0, sb = 0, n = 0;
          for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
              const i = (y * W + x) * 4;
              const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i+1] - B.data[i+1]) + Math.abs(A.data[i+2] - B.data[i+2]);
              if (d < 60) continue;               // kein Glyphenpixel
              sr += B.data[i]; sg += B.data[i+1]; sb += B.data[i+2]; n++;
            }
          }
          if (n < 4) continue;                     // zu wenig Glyphenflaeche
          const hintergrund = [Math.round(sr/n), Math.round(sg/n), Math.round(sb/n)];

          const { rgb, alpha } = rgbLesen(s.farbe);
          const wirksam = alpha < 1 ? ueberlagern(rgb, alpha, hintergrund) : rgb;
          const wert = verhaeltnis(wirksam, hintergrund);
          const soll = schwelleFuer(s.px, s.gewicht);
          gemessen++;
          if (wert + 0.01 < soll) {
            befunde.push({ route, breite: b.name, y, wert, soll, px: s.px, gewicht: s.gewicht,
                           text: s.text, farbe: s.farbe, hintergrund });
          }
        }
      }
      await seite.close();
    }
    process.stdout.write('.');
  }
} finally {
  await browser.close();
  stopp();
}

console.log(`\n[kontrast] ${gemessen} Textstellen gemessen auf ${routen.length} Routen, 2 Breiten, ${POSITIONEN.length} Positionen.`);

if (!befunde.length) {
  console.log('[kontrast] ok: kein Text unter WCAG AA.');
  process.exit(0);
}

befunde.sort((a, b) => a.wert - b.wert);
console.log(`\n[kontrast] ${befunde.length} Stelle(n) unter AA, schlechteste zuerst:\n`);
for (const f of befunde.slice(0, 40)) {
  const bg = `rgb(${f.hintergrund.join(' ')})`;
  console.log(`  ${f.wert.toFixed(2)}:1  (soll ${f.soll})  ${f.route} · ${f.breite} · y=${f.y}`);
  console.log(`      ${f.px}px/${f.gewicht}  ${f.farbe} auf ${bg}`);
  console.log(`      „${f.text}"`);
}
if (befunde.length > 40) console.log(`  … und ${befunde.length - 40} weitere.`);
process.exit(strikt ? 1 : 0);
