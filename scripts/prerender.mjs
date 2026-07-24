// Prerender (SSG) — läuft als postbuild NACH `vite build`.
// Startet einen Vorschau-Server auf dem gebauten dist/, lädt jede Route in einem
// Headless-Browser (führt das echte JS aus -> SEOHead/JsonLd füllen das DOM) und
// speichert das fertig gerenderte HTML pro Route als statische Datei.
// So sehen JS-lose KI-/Suchmaschinen-Crawler Inhalt + Meta + JSON-LD im initialen HTML.
//
// Kein Eingriff in den App-Code: Der Client-Boot (createRoot) bleibt unverändert;
// die vorgerenderte HTML ist nur der statische Fallback für Crawler.
//
// Fehlerverhalten: Der Prerender darf einen (Vercel-)Deploy NICHT blockieren. Schlägt
// er fehl (z. B. Chromium startet nicht), läuft der Deploy mit der normalen Client-SPA
// weiter – aber mit unübersehbarer Warnung. Mit PRERENDER_STRICT=1 bricht er stattdessen
// hart ab (für lokale Prüfung / CI-Gates).
//
// Chromium: nutzt standardmäßig das von puppeteer gebündelte Chromium (funktioniert
// im Vercel-Build). Lokal kann via PUPPETEER_EXECUTABLE_PATH ein System-Chrome
// verwendet werden, um den Download zu sparen.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');
const PORT = 4319;
const STRICT = process.env.PRERENDER_STRICT === '1';

const routes = getRoutes().map((r) => r.path);

function outPathFor(route) {
  return route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
}

// Fehler nicht verschlucken, aber den Deploy nicht abwürgen (außer im STRICT-Modus).
function bail(msg) {
  const bar = '='.repeat(66);
  console.error(
    `\n${bar}\n` +
      `[prerender] WARNUNG: ${msg}\n` +
      `[prerender] Deploy läuft weiter mit normaler Client-SPA (ohne Prerender).\n` +
      `[prerender] Folge: Crawlbarkeit/GEO eingeschränkt, bis behoben.\n` +
      (STRICT ? '[prerender] PRERENDER_STRICT=1 -> harter Abbruch.\n' : '') +
      `${bar}\n`
  );
  process.exit(STRICT ? 1 : 0);
}

// whileInView-Reveals auslösen, damit auch below-the-fold-Inhalt im Snapshot steht.
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((res) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          res();
        }
      }, 50);
    });
  });
  await new Promise((r) => setTimeout(r, 350));
}

async function run() {
  if (!existsSync(join(distDir, 'index.html'))) {
    bail('dist/index.html fehlt – `vite build` hat keinen Output erzeugt.');
  }

  let server;
  try {
    server = await preview({ root, preview: { port: PORT, strictPort: true } });
  } catch (err) {
    bail(`Vorschau-Server konnte nicht starten: ${err.message}`);
  }
  const base = `http://localhost:${PORT}`;
  const closeServer = () => new Promise((res) => server.httpServer.close(res));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
    await closeServer();
    bail(`Headless-Chromium konnte nicht starten: ${err.message}`);
  }

  let ok = 0;
  const failed = [];
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      try {
        // Preloader im Prerender hart aus. `evaluateOnNewDocument` laeuft VOR allen
        // Seitenskripten — also auch vor dem Inline-Script in index.html, das sonst
        // `html.cc-preloading` setzen wuerde. Folge waere ein deckendes Overlay im
        // Snapshot und ein `autoScroll()`, das die whileInView-Reveals hinter einer
        // Blende auslaesst.
        await page.evaluateOnNewDocument(() => {
          window.__CC_NO_PRELOADER__ = true;
        });
        await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        // Warten bis die App gerendert hat: #root hat Inhalt UND JSON-LD ist da.
        await page.waitForFunction(
          () => {
            const rootEl = document.getElementById('root');
            const hasContent = !!(rootEl && rootEl.querySelector('h1, main, footer'));
            const hasJsonLd = !!document.querySelector('script[type="application/ld+json"]');
            return hasContent && hasJsonLd;
          },
          { timeout: 30000 }
        );
        await autoScroll(page);

        let html = await page.content();
        // Flash-Guard: leert #root synchron VOR dem Client-Mount. Sonst sehen Nutzer
        // (JS an) kurz das prerenderte DOM, das createRoot danach komplett verwirft und
        // neu aufbaut -> sichtbarer Doppel-Flash + erneute Einblend-Animationen.
        // Nach dem Leeren rendert React in ein leeres #root wie bisher (blank -> render),
        // also identisch zum aktuellen Live-Verhalten. Crawler ohne JS führen das Script
        // NICHT aus und behalten den vollständigen Inhalt für die Indexierung.
        html = html.replace(
          '</body>',
          '<script data-prerender-guard>var r=document.getElementById("root");if(r)r.replaceChildren();</script></body>'
        );
        // Laufzeit-Klassen aus dem <html>-Tag des Snapshots entfernen. Das sind Zustaende
        // aus DIESEM Headless-Lauf, die im ausgelieferten HTML nichts verloren haben:
        //
        // - `cc-preloading`: Guertel und Hosentraeger zum Guard oben. Landet der Name doch
        //   je im Snapshot (geaenderte Skript-Reihenfolge, manueller Lauf), waere im
        //   statischen HTML ein deckendes Overlay eingebacken.
        // - `lenis`, `lenis-smooth`, `lenis-scrolling`, …: setzt Lenis beim Initialisieren.
        //   Fachlich harmlos (die Lenis-CSS kommt erst mit dem Bundle, danach verwaltet
        //   Lenis die Klassen selbst neu), aber `lenis-scrolling` behauptet einen
        //   Scroll-Zustand, den es beim echten Seitenaufruf gar nicht gibt.
        //
        // Die Inline-Scripts bleiben unangetastet und entscheiden beim echten Aufruf normal.
        const RUNTIME_CLASSES = /^(cc-preloading|lenis(-.*)?)$/;
        html = html.replace(
          /(<html\b[^>]*\sclass=")([^"]*)(")/i,
          (_m, pre, classes, post) =>
            pre + classes.split(/\s+/).filter((c) => c && !RUNTIME_CLASSES.test(c)).join(' ') + post
        );
        // Ein danach leeres class="" ganz weglassen statt als Rest stehen zu lassen.
        html = html.replace(/(<html\b[^>]*?)\s+class=""/i, '$1');
        const outPath = outPathFor(route);
        mkdirSync(dirname(outPath), { recursive: true });
        writeFileSync(outPath, `<!DOCTYPE html>\n${html.replace(/^<!DOCTYPE html>/i, '').trimStart()}`);
        ok += 1;
        console.log(`[prerender] ok  ${route}`);
      } catch (err) {
        failed.push(route);
        console.error(`[prerender] FEHLER ${route}: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    await closeServer();
  }

  console.log(`[prerender] Fertig: ${ok}/${routes.length} Routen als statisches HTML.`);
  if (failed.length) {
    bail(`${failed.length} Route(n) fehlgeschlagen: ${failed.join(', ')}`);
  }
}

run().catch((err) => bail(`Unerwarteter Fehler: ${err.message}`));
