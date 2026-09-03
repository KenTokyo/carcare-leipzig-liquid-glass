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
/**
 * Harter Abbruch statt Warnung.
 *
 * AUF VERCEL IMMER. Die nicht-blockierende Philosophie war als Schutz vor einem
 * Deploy-Totalausfall gedacht. Tatsaechlich hat sie am 2026-09-02 einen wochenlangen
 * SEO-Totalausfall unsichtbar gemacht: Chromium startete nicht (fehlende
 * `libnspr4.so` im Build-Image), der Deploy wurde gruen, und die Seite ging als leere
 * SPA-Huelle live — kein JSON-LD, kein Text im ausgelieferten HTML. Ein gruener Deploy,
 * der die Crawlbarkeit still abschaltet, ist schlechter als ein roter, den jemand sieht.
 *
 * LOKAL WEITERHIN NUR WARNUNG, damit ein fehlendes Chromium auf einer
 * Entwicklungsmaschine nicht jeden Build blockiert.
 *
 * Unterschieden ueber `VERCEL` (setzt Vercel in jeder Buildumgebung), NICHT ueber
 * NODE_ENV: das steht auch bei einem lokalen Produktionsbuild auf "production" und
 * wuerde die beiden Faelle vermischen.
 */
const AUF_VERCEL = Boolean(process.env.VERCEL);
const STRICT = process.env.PRERENDER_STRICT === '1' || AUF_VERCEL;

const routes = getRoutes().map((r) => r.path);

function outPathFor(route) {
  return route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
}

// Fehler nicht verschlucken, aber den Deploy nicht abwürgen (außer im STRICT-Modus).
function bail(msg) {
  const bar = '='.repeat(66);
  console.error(
    `\n${bar}\n` +
      `[prerender] ${STRICT ? 'FEHLER' : 'WARNUNG'}: ${msg}\n` +
      (STRICT
        ? AUF_VERCEL
          ? '[prerender] Buildumgebung Vercel -> BUILD WIRD ABGEBROCHEN.\n' +
            '[prerender] Ohne Prerender ginge die Seite als leere SPA-Huelle live:\n' +
            '[prerender] kein JSON-LD, kein Text im ausgelieferten HTML.\n'
          : '[prerender] PRERENDER_STRICT=1 -> Build wird abgebrochen.\n'
        : '[prerender] Build läuft weiter mit normaler Client-SPA (ohne Prerender).\n' +
          '[prerender] Folge: Crawlbarkeit/GEO eingeschränkt, bis behoben.\n') +
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

  /**
   * ZWEI CHROMIUM-WEGE, bewusst getrennt.
   *
   * AUF VERCEL: `@sparticuz/chromium` statt des von puppeteer gebuendelten Browsers.
   * Grund steht im Build-Log vom 2026-09-02: Das gebuendelte Chromium liegt zwar
   * korrekt im Cache, startet aber nicht —
   *   "error while loading shared libraries: libnspr4.so: cannot open shared object file"
   * Dem Vercel-Build-Image fehlen die NSS/NSPR-Bibliotheken. Sie waren bis Node 14 im
   * Image enthalten und sind ab Node 18 entfernt, betreffen also alle heute
   * unterstuetzten Versionen. `@sparticuz/chromium` bringt einen Build mit, der ohne
   * diese Systembibliotheken auskommt.
   *
   * LOKAL UNVERAENDERT: Das Paket liefert ausschliesslich Linux-Binaries und ist auf
   * einer Windows- oder macOS-Maschine nutzlos. Dort bleibt es beim gebuendelten
   * Chromium bzw. an PUPPETEER_EXECUTABLE_PATH.
   *
   * ⚠️ VERSIONSPAARUNG IST EXAKT, NICHT UNGEFAEHR:
   *   @sparticuz/chromium 149.0.0  ->  Chromium 149
   *   puppeteer-core      25.1.0   ->  Chromium 149.0.7827.22
   * Das lokal genutzte `puppeteer` 25.3.0 faehrt dagegen Chromium 150 — deshalb ist
   * `puppeteer-core` in package.json OHNE Caret festgenagelt. Ein Minor-Sprung auf
   * 25.2 wuerde auf Chromium 150 zeigen und nicht mehr zum Sparticuz-Build passen.
   * Beim Anheben also BEIDE Pakete gemeinsam bewegen.
   */
  let browser;
  try {
    if (AUF_VERCEL) {
      const { default: chromium } = await import('@sparticuz/chromium');
      const { default: puppeteerCore } = await import('puppeteer-core');
      browser = await puppeteerCore.launch({
        headless: true,
        executablePath: await chromium.executablePath(),
        args: chromium.args,
      });
      console.log('[prerender] Chromium-Quelle: @sparticuz/chromium (Vercel-Build).');
    } else {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    }
  } catch (err) {
    await closeServer();
    bail(`Headless-Chromium konnte nicht starten: ${err.message}`);
  }

  let ok = 0;
  const failed = [];
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      /**
       * Unbehandelte Ausnahmen der Seite als solche melden — und sofort.
       *
       * Ohne das endete jeder Renderfehler in „Waiting failed: 30000ms exceeded": 30
       * Sekunden Wartezeit je Route und eine Meldung, die die Ursache verschweigt.
       * Gemessen am 2026-09-03 beim Gegentest zu `ServiceLayout`, das bei fehlendem
       * Katalogeintrag bewusst wirft — die aussagekraeftige Fehlermeldung stand im
       * Browser und kam nirgends an.
       */
      const seitenfehler = new Promise((_, reject) => {
        page.once('pageerror', (e) => reject(new Error(`Unbehandelte Ausnahme der Seite: ${e.message}`)));
      });
      // Feuert die Ausnahme ERST, nachdem das Rennen unten entschieden ist (z. B. ein
      // Fehler nach erfolgreichem Render), stuende sie ohne Empfaenger da — Node beendet
      // den Prozess bei unbehandelten Rejections. Dieser Griff haelt sie behandelt,
      // ohne dem Rennen etwas zu nehmen.
      seitenfehler.catch(() => {});
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
        // Gegen `seitenfehler` gerennt, damit ein Renderfehler nicht als Zeitueberschreitung
        // maskiert wird, sondern mit seiner eigenen Meldung ankommt.
        await Promise.race([
          page.waitForFunction(
            () => {
              const rootEl = document.getElementById('root');
              const hasContent = !!(rootEl && rootEl.querySelector('h1, main, footer'));
              const hasJsonLd = !!document.querySelector('script[type="application/ld+json"]');
              return hasContent && hasJsonLd;
            },
            { timeout: 30000 }
          ),
          seitenfehler,
        ]);
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
