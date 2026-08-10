/**
 * Puppeteer-Konfiguration — legt Chromium INS PROJEKT statt nach ~/.cache/puppeteer.
 *
 * WARUM: Auf Vercel lief der Prerender nicht (gemessen 2026-08-10: ausgelieferte Seiten
 * 10.844 Bytes statt ~150.000, null JSON-LD). Ursache ist das Zusammenspiel zweier
 * Mechanismen:
 *   1. Puppeteer laedt Chromium in seinem `postinstall` nach `$HOME/.cache/puppeteer`.
 *   2. Vercel cached `node_modules` (im Projektverzeichnis), aber NICHT `$HOME/.cache`.
 * Bei einem Build mit warmem Cache ist das Paket also bereits installiert, npm fuehrt den
 * `postinstall` nicht erneut aus — und Chromium fehlt. `puppeteer.launch()` scheitert, der
 * Prerender steigt per Design still aus und die Seite geht ohne vorgerendertes HTML live.
 *
 * Mit `cacheDirectory` im Projekt liegt Chromium innerhalb dessen, was Vercel cachen kann.
 *
 * ⚠️ `.cjs` ist Pflicht: `package.json` hat `"type": "module"`, eine `.puppeteerrc.js`
 * wuerde als ESM gelesen und `module.exports` waere dort nicht definiert.
 *
 * Das allein reicht aber nicht als Garantie — ob Vercel diesen Ordner tatsaechlich
 * wiederherstellt, haengt an dessen Cache-Heuristik. Deshalb stellt zusaetzlich
 * `scripts/ensure-chromium.mjs` im prebuild sicher, dass der Browser vorhanden ist.
 */
const { join } = require('node:path');

module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
