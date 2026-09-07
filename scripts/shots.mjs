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
// ⚠️ Was diese Pruefung besteht, ohne dass die Sache in Ordnung ist: Sie macht Bilder,
// sie bewertet nichts. Ein schiefes Layout faellt nur auf, wenn jemand hinsieht.
// Fuer die messbare Aussage ist `npm run kontrast` zustaendig.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'shots');

const args = process.argv.slice(2);
const nurRoute = args.find((a) => a.startsWith('/'));
const nurBreite = args.map(Number).find((n) => Number.isFinite(n) && n > 100);

const BREITEN = [
  { name: 'desktop', breite: 1440, hoehe: 900 },
  { name: 'mobil', breite: 390, hoehe: 844 },
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
      await seite.setViewport({ width: b.breite, height: b.hoehe, deviceScaleFactor: 1 });
      await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await seite.evaluateOnNewDocument(HALTE_SCROLL);
      await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 700));

      const grenzen = await seite.evaluate(GRENZEN);
      const name = (route === '/' ? 'start' : route.replace(/^\//, '').replace(/\//g, '_'));
      const ordner = path.join(AUSGABE, name);
      fs.mkdirSync(ordner, { recursive: true });

      for (let i = 0; i < grenzen.length; i++) {
        const y = grenzen[i];
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        await new Promise((r) => setTimeout(r, 550));
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

console.log(`\n[shots] ${anzahl} Aufnahmen in ${path.relative(wurzel, AUSGABE)}/ abgelegt.`);
