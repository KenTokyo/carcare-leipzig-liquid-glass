// Stellt vor dem Build sicher, dass der von puppeteer benoetigte Chromium vorhanden ist.
//
// WARUM NICHT AUF DEN `postinstall` VERLASSEN: Der laeuft nur, wenn npm das Paket
// tatsaechlich (neu) installiert. Auf Vercel wird `node_modules` aus dem Build-Cache
// wiederhergestellt — dann ist puppeteer da, sein `postinstall` lief aber nie in diesem
// Build. Zusammen mit dem Cache-Verzeichnis ausserhalb des Projekts fehlte dadurch der
// Browser, und der Prerender uebersprang sich stillschweigend (gemessen 2026-08-10:
// ausgelieferte Seiten 10.844 Bytes statt ~150.000, null JSON-LD).
//
// `puppeteer browsers install chrome` ist idempotent: Liegt der Browser bereits im
// konfigurierten `cacheDirectory` (siehe .puppeteerrc.cjs), kehrt es in Sekunden zurueck.
//
// CLI-PFAD BEWUSST AUFGELOEST STATT HART KODIERT: Puppeteer hat sein CLI-Skript zwischen
// Versionen verschoben (bis v22 `lib/cjs/puppeteer/node/cli.js`, ab v23
// `lib/puppeteer/node/cli.js`). Ein fester Pfad brach hier beim ersten Test sofort.
// Die `bin`-Angabe der package.json ist die verlaessliche Quelle.
//
// FEHLERVERHALTEN: bewusst NICHT blockierend — identisch zur Philosophie des Prerenders
// (scripts/prerender.mjs). Schlaegt der Download fehl, soll der Deploy trotzdem
// durchlaufen; der Prerender meldet sich danach mit seiner eigenen Warnung. Ein harter
// Abbruch hier wuerde aus einem SEO-Problem einen kompletten Deploy-Ausfall machen.

import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const bar = '='.repeat(66);
const require = createRequire(import.meta.url);

/**
 * AUF VERCEL NICHT NOETIG — seit 2026-09-03.
 *
 * Dort rendert `scripts/prerender.mjs` mit `@sparticuz/chromium`, weil das von
 * puppeteer gebuendelte Chromium im Vercel-Image nicht startet (fehlende
 * `libnspr4.so`). Der Download hier lief trotzdem weiter und zog bei JEDEM Build
 * rund 8 Sekunden und ~150 MB Cache-Volumen fuer einen Browser, den niemand
 * benutzt — nachweisbar im Build-Log vom 2026-09-02, Zeile 26.
 *
 * Lokal bleibt alles wie gehabt: Dort ist das gebuendelte Chromium der Weg, weil
 * `@sparticuz/chromium` ausschliesslich Linux-Binaries liefert.
 *
 * Unterschieden ueber `VERCEL` wie in prerender.mjs — nicht ueber NODE_ENV, das
 * auch bei lokalen Produktionsbuilds auf "production" steht.
 */
if (process.env.VERCEL) {
  console.log('[ensure-chromium] Uebersprungen: auf Vercel rendert der Prerender mit @sparticuz/chromium.');
  process.exit(0);
}

function warn(msg) {
  console.error(
    `\n${bar}\n` +
      `[ensure-chromium] WARNUNG: ${msg}\n` +
      `[ensure-chromium] Der Build laeuft weiter; der Prerender wird sich danach\n` +
      `[ensure-chromium] voraussichtlich ueberspringen (Folge: kein statisches HTML).\n` +
      `${bar}\n`
  );
  process.exit(0);
}

let cli;
try {
  const pkgPath = require.resolve('puppeteer/package.json');
  const pkg = require('puppeteer/package.json');
  const binRel = typeof pkg.bin === 'string' ? pkg.bin : Object.values(pkg.bin ?? {})[0];
  if (!binRel) warn('puppeteer/package.json enthaelt keinen `bin`-Eintrag.');
  cli = resolve(dirname(pkgPath), binRel);
} catch (err) {
  warn(`puppeteer nicht aufloesbar: ${err.message}`);
}

const res = spawnSync(process.execPath, [cli, 'browsers', 'install', 'chrome'], { stdio: 'inherit' });

if (res.error || res.status !== 0) {
  warn(res.error ? res.error.message : `\`browsers install chrome\` endete mit Exit-Code ${res.status}`);
}

console.log('[ensure-chromium] Chromium steht bereit.');
process.exit(0);
