// Bildschirmfotos je Route und Breite — Sichtpruefung als Werkzeug statt Wegwerfskript.
//
// AUFRUF:
//   npm run shots                      alle Routen, Desktop + mobil
//   npm run shots -- /ueber-uns        nur diese Route
//   npm run shots -- /karriere 390     nur diese Route, nur diese Breite
//
// DREI DINGE, DIE OHNE SIE FALSCHE BILDER ERGEBEN — alle empirisch belegt:
//  1. LENIS FEDERT ZURUECK. Ein `window.scrollTo` allein haelt nicht: Der
//     Smooth-Scroller zieht die Seite nach der Aufnahme wieder weg. Deshalb haelt
//     `HALTE_SCROLL` die Position in einer eigenen rAF-Schleife fest.
//  2. DIE BLENDE LIEGT IM BILD. `window.__CC_NO_PRELOADER__` muss VOR dem ersten
//     Skript stehen, also ueber `evaluateOnNewDocument`.
//  3. FESTE VIEWPORT-VIELFACHE TREFFEN DAS FALSCHE. Interessant sind die
//     SEKTIONSGRENZEN — dort geht Foto in Weiss ueber, dort sitzt der Kontrastfehler.
//     Deshalb werden die Grenzen aus dem DOM gelesen und angefahren.
//
//  4. DIE AUFNAHME DARF NICHT IN DIE ANIMATION FALLEN. Bis 2026-09-14 wurden nach dem
//     Scrollen 550 ms gewartet. Die Zeitstrahl- und Ablauf-Animation laeuft aber laenger:
//     Achse 1,1 s, der letzte Punkt startet bei 1,22 s, seine Karte bei 1,38 s und
//     braucht 0,45 s — Ende also bei rund 1,83 s. Die Aufnahme der Ablauf-Sektion auf
//     /privatkunden zeigte deshalb Karte 1 fertig, Punkt 2 halb und die Karten 3 und 4
//     GAR NICHT. Das sah aus wie ein Layoutfehler und war ein Aufnahmefehler — genau die
//     Sorte Befund, an der die naechste Sitzung etwas repariert, das nicht kaputt ist.
//     `BERUHIGUNG` liegt deshalb ueber der laengsten Animation, mit Reserve.
//
//  5. ALTE AUFNAHMEN MISCHEN SICH UNTER. Bis 2026-10-15 blieben Bilder frueherer Laeufe liegen; wurde eine Seite
//     kuerzer, standen ihre alten hinteren Aufnahmen neben den neuen. Jetzt werden je Route und Breite die alten
//     Bilder vor dem Lauf entfernt, und der Kontaktbogen nennt je Gruppe den Zeitpunkt.
//  6. MOBIL HEISST TOUCH. Die 390er-Aufnahmen laufen seit 2026-10-15 als Touch-Geraet (`isMobile`, `hasTouch`) wie
//     `npm run mobil`; vorher sah die Seite eine schmale Maus-Ansicht.
//
// KONTAKTBOGEN: `output/shots/kontaktbogen.html` zeigt alle vorhandenen Aufnahmen je Seite und Breite auf einer Seite
// (lokal im Browser oeffnen). Fuer die Sichtpruefung mit dem User (Mobile-Check 2026-10-15).
//
// ⚠️ Was diese Pruefung besteht, ohne dass die Sache in Ordnung ist: Sie macht Bilder,
// sie bewertet nichts. Ein schiefes Layout faellt nur auf, wenn jemand hinsieht.
// Fuer die messbare Aussage sind `npm run kontrast` und `npm run mobil` zustaendig.
//
// ⚠️ ROUTENFILTER UNTER GIT BASH: `npm run shots -- /ueber-uns` kommt dort als
// `C:/Program Files/Git/ueber-uns` an — MSYS wandelt fuehrende Schraegstriche in
// Windows-Pfade um, der Filter greift nicht und es laufen ALLE Routen. Mit
// `MSYS_NO_PATHCONV=1` davor gestellt funktioniert er. In PowerShell und cmd nicht noetig.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'shots');

/**
 * Wartezeit zwischen Scrollen und Ausloesen, in Millisekunden.
 *
 * Muss ueber der laengsten Einblend-Animation liegen (gemessen 1,83 s, siehe Punkt 4 im
 * Kopf). Wer die Werte in `components/ablaufAnimation.ts` erhoeht, erhoeht auch diese
 * Zahl — sonst nehmen die Review-Bilder wieder halbe Sektionen auf.
 */
const BERUHIGUNG = 2100;

const args = process.argv.slice(2);
const nurRoute = args.find((a) => a.startsWith('/'));
const nurBreite = args.map(Number).find((n) => Number.isFinite(n) && n > 100);

const BREITEN = [
  { name: 'desktop', breite: 1440, hoehe: 900, touch: false },
  { name: 'mobil', breite: 390, hoehe: 844, touch: true },
].filter((b) => !nurBreite || b.breite === nurBreite);

/** Sektionsgrenzen aus dem DOM — das sind die Stellen, die man sehen will. */
const GRENZEN = `(() => {
  const ys = new Set([0]);
  for (const el of document.querySelectorAll('section, footer')) {
    const r = el.getBoundingClientRect();
    const y = Math.round(r.top + window.scrollY);
    if (y > 40) ys.add(Math.max(0, y - 120));
  }
  const max = document.body.scrollHeight - window.innerHeight;
  return [...ys].filter((y) => y <= max).sort((a, b) => a - b);
})()`;

if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[shots] dist/ fehlt — bitte zuerst `npm run build`.');
  process.exit(1);
}

fs.mkdirSync(AUSGABE, { recursive: true });
const routen = (nurRoute ? [nurRoute] : getRoutes().map((r) => r.path ?? r)).filter(Boolean);
const { basis, stopp } = await startePreview(4184);
/*
 * `--force-prefers-no-reduced-motion` ist hier PFLICHT.
 *
 * Headless Chrome meldet `prefers-reduced-motion: reduce` von sich aus — gemessen am
 * 2026-09-07. Ohne diesen Schalter zeigen die Aufnahmen also die REDUZIERTE Fassung:
 * Videos tragen `motion-reduce:hidden`, sie waeren `display: none` und im Bild stuende
 * nur das Standbild. Aufgefallen ist es, weil ein Video mit laufender Wiedergabe ein
 * Rechteck von 0x0 meldete.
 *
 * Die uebliche Einstellung auf Windows und macOS ist Bewegung EIN. Bildschirmfotos
 * sollen zeigen, was die meisten Besucher sehen.
 */
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
let anzahl = 0;

try {
  for (const route of routen) {
    for (const b of BREITEN) {
      const seite = await browser.newPage();
      await seite.setViewport({ width: b.breite, height: b.hoehe, deviceScaleFactor: 1, isMobile: b.touch, hasTouch: b.touch });
      await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await seite.evaluateOnNewDocument(HALTE_SCROLL);
      await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 700));

      const grenzen = await seite.evaluate(GRENZEN);
      const name = (route === '/' ? 'start' : route.replace(/^\//, '').replace(/\//g, '_'));
      const ordner = path.join(AUSGABE, name);
      fs.mkdirSync(ordner, { recursive: true });
      // Alte Aufnahmen dieser Route und Breite weg (Punkt 5 im Kopf).
      for (const alt of fs.readdirSync(ordner)) if (alt.startsWith(`${b.name}-`) && alt.endsWith('.png')) fs.rmSync(path.join(ordner, alt));

      for (let i = 0; i < grenzen.length; i++) {
        const y = grenzen[i];
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        await new Promise((r) => setTimeout(r, BERUHIGUNG));
        const datei = path.join(ordner, `${b.name}-${String(i).padStart(2, '0')}-y${y}.png`);
        await seite.screenshot({ path: datei });
        await seite.evaluate(() => window.__ccLoslassen());
        anzahl++;
      }
      await seite.close();
    }
    process.stdout.write('.');
  }
} finally {
  await browser.close();
  stopp();
}

/** Kontaktbogen aus ALLEN vorhandenen Aufnahmen (auch frueherer Laeufe mit Routenfilter), je Gruppe mit Zeitpunkt. */
function schreibeKontaktbogen() {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const ordner = fs.readdirSync(AUSGABE, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    .sort((a, b) => (a === 'start' ? -1 : b === 'start' ? 1 : a.localeCompare(b, 'de')));
  const teile = [];
  for (const name of ordner) {
    const dateien = fs.readdirSync(path.join(AUSGABE, name)).filter((f) => f.endsWith('.png')).sort();
    for (const b of ['mobil', 'desktop']) {
      const eigene = dateien.filter((f) => f.startsWith(`${b}-`));
      if (!eigene.length) continue;
      const stand = new Date(Math.max(...eigene.map((f) => fs.statSync(path.join(AUSGABE, name, f)).mtimeMs))).toLocaleString('de-DE');
      const route = name === 'start' ? '/' : `/${name.replace(/_/g, '/')}`;
      const bilder = eigene.map((f) => `<a href="${esc(`${name}/${f}`)}"><img loading="lazy" src="${esc(`${name}/${f}`)}" alt="${esc(`${route} ${f}`)}"></a>`).join('');
      teile.push(`<section><h2>${esc(route)} <small>${b}, ${eigene.length} Aufnahmen, ${stand}</small></h2><div class="reihe ${b}">${bilder}</div></section>`);
    }
  }
  const stil = 'body{font:14px system-ui,sans-serif;margin:16px;background:#f4f6fa;color:#111}h1{font-size:20px;margin:0 0 4px}'
    + 'h2{font-size:15px;margin:28px 0 8px}small{color:#555;font-weight:400}.reihe{display:flex;gap:8px;overflow-x:auto;padding-bottom:6px}'
    + '.mobil img{width:195px}.desktop img{width:480px}img{display:block;border:1px solid #ccd;border-radius:6px;background:#fff}';
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`
    + `<title>Bildschirmfotos</title><style>${stil}</style></head><body><h1>Bildschirmfotos je Seite</h1>`
    + `<p>Erzeugt von <code>npm run shots</code> am ${new Date().toLocaleString('de-DE')}. Je Gruppe der Zeitpunkt der Aufnahmen; Klick öffnet ein Bild in voller Größe.</p>`
    + `${teile.join('')}</body></html>`;
  fs.writeFileSync(path.join(AUSGABE, 'kontaktbogen.html'), html);
}
schreibeKontaktbogen();

console.log(`\n[shots] ${anzahl} Aufnahmen in ${path.relative(wurzel, AUSGABE)}/ abgelegt, Übersicht: ${path.relative(wurzel, path.join(AUSGABE, 'kontaktbogen.html'))}`);
