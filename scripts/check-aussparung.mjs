// Aktions-Aussparung oben rechts („Anrufen", „Schaden melden", `components/AktionsAussparung.tsx`):
// Liegt irgendwo DAUERHAFT Text oder ein Bedienelement der Seite darunter?
//
// AUFRUF:
//   npm run aussparung                     alle Routen, drei Fenster
//   npm run aussparung -- /karriere /      nur diese Routen
//   (unter Git Bash `MSYS_NO_PATHCONV=1` davor — sonst kommt `/karriere` als
//    `C:/Program Files/Git/karriere` an, dieselbe Falle wie bei `npm run shots`)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// GESCHICHTE: Am 2026-09-24 als `npm run schwebend` fuer zwei schwebende Knoepfe UNTEN rechts
// entstanden — die erste Fassung dort verdeckte die Versichererliste. Am selben Tag wanderten
// die Knoepfe in die Aussparung OBEN rechts (Wunsch des Users); die Frage bleibt dieselbe.
// Oben rechts ist die Gefahr kleiner — die Aussparung liegt im 100-px-Band der Navbar, in dem
// kein Inhalt stehen bleibt —, aber nicht null: Alles, was mit `position: sticky` HOEHER als
// die Navbar gepinnt wird, stuende rechts dauerhaft darunter.
//
// WAS GEMESSEN WIRD: Jede Route wird in Schritten einer halben Fensterhoehe durchgescrollt. An
// jeder Position wird gesammelt, welche Textstellen und Bedienelemente unter der Aussparung
// OBEN liegen — per `elementsFromPoint`, nicht nur geometrisch; was hinter einer anderen
// Flaeche liegt, zaehlt nicht.
//
// DAUERHAFT heisst: an zwei aufeinanderfolgenden Positionen verdeckt UND nicht mitbewegt (die
// Oberkante verschiebt sich um weniger als 20 px, obwohl eine halbe Fensterhoehe gescrollt
// wurde). Das trifft gepinnte Flaechen. Was nur darunter vorbeizieht, zaehlt nicht — das tut
// jeder Inhalt unter der Navbar. Die erste Fassung zaehlte „an zwei Positionen verdeckt" und
// meldete neun grosse Karten-Links, die nur vorbeiscrollten.
//
// ABHILFE BEI EINEM BEFUND: Die gepinnte Flaeche unter die Navbar-Hoehe setzen (Muster: die
// CSS-Variable `--nav` in den Zielgruppenkarten, 5,35 rem mobil / 6,75 rem ab `md`).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. GRUEN DURCH VERSTECKEN. Ist die Aussparung ausgeblendet, gibt es nichts zu verdecken. Deshalb
//     steht je Route der Anteil der Positionen, an denen sie sichtbar ist; unter 50 % ein Hinweis.
//     Seit sie immer steht, muss dort 100 % stehen — alles andere ist ein Befund fuer sich.
//  2. DREI FENSTER (1920 × 945, 1280 × 800, 1024 × 700). Dazwischen und darunter nicht; unter
//     1024 px gibt es keine Aussparung (dort gilt die Leiste unten).
//  3. SCHRITTWEITE eine halbe Fensterhoehe: Eine gepinnte Flaeche, die kuerzer steht, faellt durch.
//  4. TEXT UND BEDIENELEMENTE, keine Bilder. Ein verdecktes Motiv, Logo oder Siegel meldet sie nicht.
//  5. DIE HINWEISE UNTER DEN KNOEPFEN (beim Ueberfahren) prueft sie nicht — sie stehen nur, solange
//     die Maus darauf ist.
//  6. (behoben) DIE AUSSPARUNG SELBST. Bis zur zweiten Fassung prueften wir nur, was UNTER ihr liegt.
//     Dass ihr rechter Knopf um 15 px angeschnitten war (der weisse Schatten des konkaven Uebergangs
//     `::after` lag darueber), meldete die Pruefung gruen — gesehen hat es erst ein Bildschirmfoto.
//     Seitdem: PIXELPROBE je Knopf — 5 px innerhalb jedes Randes muss der dunkle Verlauf stehen,
//     kein Weiss. Ein Treffertest (`elementFromPoint`) haette es NICHT gefunden: Schatten nehmen am
//     Treffertest nicht teil, der Knopf galt als „oben", obwohl Weiss ueber ihm gemalt war. Die
//     Gegenprobe auf dem alten Stand hat genau das gezeigt, bevor die Pixelprobe kam.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const FENSTER = [
  [1920, 945], // Full HD, Browser maximiert (siehe CLAUDE.md: nicht 1080)
  [1280, 800],
  [1024, 700], // kleinstes Fenster mit Aussparung (`lg`)
];
/** Oberkante darf sich um weniger bewegen, dann gilt das Element als stehend. */
const STEHT = 20;
const SICHTBAR_MINDESTENS = 0.5;

const nurRouten = process.argv.slice(2).filter((a) => a.startsWith('/'));
const routen = nurRouten.length ? nurRouten : (await getRoutes()).map((r) => r.path);

/** Im Browser: was liegt unter der Aussparung oben auf? `null` = Aussparung nicht sichtbar. */
const UNTER_DEN_KNOEPFEN = () => {
  const k = document.querySelector('[data-aktions-aussparung]');
  if (!k || getComputedStyle(k).display === 'none') return null;
  const kr = k.getBoundingClientRect();
  const r = { l: kr.left - 4, t: kr.top - 4, r: kr.right + 4, b: kr.bottom + 4 };
  const schneidet = (a) => a.left < r.r && a.right > r.l && a.top < r.b && a.bottom > r.t;
  const mitte = (a) => [
    Math.max(a.left, r.l) + (Math.min(a.right, r.r) - Math.max(a.left, r.l)) / 2,
    Math.max(a.top, r.t) + (Math.min(a.bottom, r.b) - Math.max(a.top, r.t)) / 2,
  ];
  const obenAuf = (el, [x, y]) => {
    const h = document.elementsFromPoint(x, y).find((e) => !k.contains(e));
    return Boolean(h) && (h === el || el.contains(h) || h.contains(el));
  };
  const funde = [];
  const main = document.querySelector('main');
  const gehe = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (gehe.nextNode()) {
    const t = gehe.currentNode;
    const text = t.textContent.trim();
    if (!text) continue;
    const el = t.parentElement;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.1) continue;
    const bereich = document.createRange();
    bereich.selectNodeContents(t);
    for (const rr of bereich.getClientRects()) {
      if (schneidet(rr) && obenAuf(el, mitte(rr))) {
        funde.push({ name: `Text „${text.slice(0, 48)}"`, oben: Math.round(el.getBoundingClientRect().top) });
        break;
      }
    }
  }
  for (const el of main.querySelectorAll('a[href], button, input, select, textarea')) {
    const er = el.getBoundingClientRect();
    if (!er.width || !schneidet(er) || !obenAuf(el, mitte(er))) continue;
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
    funde.push({ name: `${el.tagName.toLowerCase()} „${name.slice(0, 48)}"`, oben: Math.round(er.top) });
  }
  return funde;
};

/**
 * Pixelprobe: Die Knoepfe tragen einen dunklen Verlauf. 5 px innerhalb jedes Randes (Mitte der
 * jeweiligen Kante, dort reicht der fast runde Knopf bis an den Rand) darf nichts Helles stehen.
 * Die Mitte wird NICHT geprueft — dort steht das weisse Symbol.
 */
const pruefeKnoepfe = async (seite) => {
  const kaputt = [];
  for (const knopf of await seite.$$('[data-aktions-aussparung] a, [data-aktions-aussparung] button')) {
    const box = await knopf.boundingBox();
    if (!box || box.width < 10) continue;
    const bild = await seite.screenshot({ clip: box, type: 'png' });
    const { data, info } = await sharp(bild).raw().toBuffer({ resolveWithObject: true });
    const hell = (x, y) => {
      const i = (Math.round(y) * info.width + Math.round(x)) * info.channels;
      return (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    };
    const w = info.width - 1;
    const h = info.height - 1;
    const proben = { links: hell(5, h / 2), rechts: hell(w - 5, h / 2), oben: hell(w / 2, 5), unten: hell(w / 2, h - 5) };
    const helle = Object.entries(proben).filter(([, l]) => l > 0.75).map(([seite_]) => seite_);
    if (helle.length) {
      const name = await knopf.evaluate((el) => el.getAttribute('aria-label'));
      kaputt.push(`${name} — hell am Rand ${helle.join('/')}`);
    }
  }
  return kaputt;
};

const { basis, stopp } = await startePreview(4193);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let befunde = 0;
let angeschnittenGesamt = 0;
let hinweise = 0;

try {
  for (const [b, h] of FENSTER) {
    const seite = await browser.newPage();
    await seite.setViewport({ width: b, height: h, deviceScaleFactor: 1 });
    await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    await seite.evaluateOnNewDocument(HALTE_SCROLL);
    console.log(`\n${b} × ${h}`);
    for (const route of routen) {
      await seite.goto(basis + route, { waitUntil: 'networkidle0' });
      const angeschnitten = await pruefeKnoepfe(seite);
      if (angeschnitten.length) {
        console.log(`  ✗ ${route.padEnd(52)} Knopf der Aussparung angeschnitten: ${angeschnitten.join(', ')}`);
        angeschnittenGesamt += angeschnitten.length;
      }
      const weg = await seite.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      let vorige = new Map();
      const dauerhaft = new Map();
      let positionen = 0;
      let sichtbar = 0;
      for (let y = 0; y <= weg; y += Math.round(h / 2)) {
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        // Gepinnte Flaechen brauchen ein, zwei Bilder.
        await warte(160);
        const funde = await seite.evaluate(UNTER_DEN_KNOEPFEN);
        positionen++;
        const jetzt = new Map();
        if (funde) {
          sichtbar++;
          for (const f of funde) jetzt.set(f.name, f.oben);
          for (const [name, oben] of jetzt) {
            if (vorige.has(name) && Math.abs(vorige.get(name) - oben) < STEHT) {
              dauerhaft.set(name, (dauerhaft.get(name) ?? 1) + 1);
            }
          }
        }
        vorige = jetzt;
        await seite.evaluate(() => window.__ccLoslassen());
      }
      const anteil = positionen ? sichtbar / positionen : 0;
      const zeichen = dauerhaft.size ? '✗' : anteil < SICHTBAR_MINDESTENS ? '⚠' : '✓';
      console.log(`  ${zeichen} ${route.padEnd(52)} sichtbar an ${String(Math.round(anteil * 100)).padStart(3)} % von ${positionen} Positionen`);
      for (const [name, n] of dauerhaft) console.log(`      → ${name} liegt an ${n} Positionen fest unter der Aussparung`);
      befunde += dauerhaft.size;
      if (!dauerhaft.size && anteil < SICHTBAR_MINDESTENS) hinweise++;
    }
    await seite.close();
  }
} finally {
  await browser.close();
  stopp();
}

const alle = befunde + angeschnittenGesamt;
console.log(
  alle
    ? `
✗ ${alle} Befund(e): ${befunde} dauerhafte Ueberdeckung(en), ${angeschnittenGesamt} angeschnittene(r) Knopf/Knoepfe`
    : `
✓ Keine dauerhafte Ueberdeckung, Knoepfe unversehrt — ${routen.length} Routen × ${FENSTER.length} Fenster`
      + (hinweise ? ` (${hinweise} Route(n) mit Aussparung an weniger als der Haelfte der Positionen, siehe ⚠)` : '')
);
process.exit(alle ? 1 : 0);
