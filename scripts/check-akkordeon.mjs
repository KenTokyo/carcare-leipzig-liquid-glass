// Akkordeon-Check: Klappen die Bildkarten mobil auf, ohne in jedem Bild das Layout neu zu rechnen? Stimmt danach die
// Ruhelage, auch nach einem Tipp mitten in der Animation?
//
// AUFRUF:
//   npm run akkordeon                  Startseite (Leistungen, Autoaufbereitung) und /karriere (Stellen)
//   npm run akkordeon -- --gegenprobe  PRUEFT DEN PRUEFER: spielt eine Hoehen-Transition per CSS ein (so ruckelte es bis
//                                      2026-10-16) und verlangt, dass sie als Layout pro Bild gemeldet wird (Exit 1 sonst)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// ANLASS: Der User sah auf einem Galaxy A56, dass die Karten der Startseite „nicht so schön weich“ aufgehen. Gemessen:
// Framer animierte die Hoehe, jedes Bild loeste Layout, Stil, Malen und Ebenenaufbau der ganzen Seite aus (16–18 ms je
// Bild bei 4-facher CPU-Drosselung). Seitdem springt die Hoehe einmal und die Bewegung laeuft per `transform` auf dem
// Compositor (`components/akkordeonMobil.ts`). Plan und Messwerte: docs/mobil-startseite/tasks/.
//
// GEMESSEN (393 × 851, Pixeldichte 2,75, Touch, CPU 4-fach gedrosselt, echter Tipp per `touchscreen.tap`):
//   HART (Exit 1):
//   - LAYOUT PRO BILD: Layout-Laeufe des Hauptthreads in den 700 ms nach dem Tipp. Der Wechsel selbst braucht einige
//     (Zustand, Messen vor und nach dem Wechsel, neues Hintergrundfoto, auf der Lackierkarte der Videostart); gemessen
//     1–8. Ab GRENZE_LAYOUTS gilt es als Layout pro Bild: Mit der alten Hoehen-Animation waren es 29–40 je Tipp.
//   - COMPOSITOR: jede Animation mit `compositeFailed` ungleich 0 (Chrome rechnet sie auf dem Hauptthread).
//   - RUHELAGE nach dem Tipp und nach einer Unterbrechung (zweiter Tipp nach 150 ms): genau die getippte Karte offen,
//     die uebrigen 64 px, Fenster so hoch wie die Karte, keine laufende Skript-Animation, Abstaende 10 px, und die
//     getippte Karte steht noch im Bild. Letzteres fand am 2026-10-16 einen alten Fehler: Lenis scrollte beim ersten
//     Tipp auf eine Stellenkarte (/karriere#bewerbung) rund 7.000 px weit (Behebung in `hooks/useSmoothScroll.ts`).
//   HINWEIS (kein Exit): Hauptthread-Zeit je Bild und Anteile (Stil, Layout, Malen, Ebenen, Skript).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md):
//  1. KEIN ECHTES GERAET: Kopfloses Chrome mit gedrosselter CPU. Rastern und GPU des Telefons misst es nicht, die
//     Zeitwerte sind Vergleichswerte zwischen zwei Builds, keine Geraetewerte. Darum sind sie nur Hinweis.
//  2. NUR DIESE DREI AKKORDEONS. Die Mitarbeiterstimmen auf /karriere (`Stimmen.tsx`) animieren mobil weiterhin die
//     Hoehe, ebenso die FAQ (`FAQSection.tsx`, 0,24 s); beide misst sie nicht.
//  3. GEOMETRIE, KEIN AUSSEHEN: Ob ein Zwischenbild gut aussieht (Bildausschnitt, Schleier, Plaketten), zeigt nur ein
//     Bildschirmfoto mitten in der Animation (`document.getAnimations()` anhalten).
//  4. LAYOUT ZAEHLT EREIGNISSE, NICHT DAUER. Eine Animation, die statt Layout in jedem Bild neu MALT (z. B. `clip-path`
//     auf dem Hauptthread), bleibt unter der Grenze; sie faellt nur ueber COMPOSITOR oder die Zeitwerte auf.
//  5. DESKTOP NICHT GEPRUEFT: Dort animiert Framer weiter `flexGrow` (unveraendert, kein Befund).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEGENPROBE = process.argv.includes('--gegenprobe');
const DROSSEL = 4;
const GRENZE_LAYOUTS = 15;
const FENSTER = { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true };
const ZIELE = [
  { route: '/', sektion: '#leistungen', tipps: [2, 5] },
  { route: '/', sektion: '#autoaufbereitung', tipps: [2, 1] },
  { route: '/karriere', sektion: '#jobbereiche', tipps: [1, 2] },
];
/** So ruckelte es bis 2026-10-16: Die Hoehe animiert, Layout in jedem Bild. */
const FEHLER_CSS = 'a[aria-expanded]{transition:height 600ms ease !important}';
const KATEGORIEN = { UpdateLayoutTree: 'Stil', Layout: 'Layout', Paint: 'Malen', PrePaint: 'Malen', Layerize: 'Ebenen', Commit: 'Ebenen', FireAnimationFrame: 'Skript', EventDispatch: 'Skript' };

if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[akkordeon] dist/ fehlt, bitte zuerst `npm run build`.');
  process.exit(1);
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const befunde = [];
const zeilen = [];

/**
 * Karten EINES Akkordeons: die Geschwister der ersten Karte in der Sektion. Auf /karriere stehen zwei Akkordeons
 * (Stellen, Ausbildung) in derselben Sektion; zusammengezaehlt waere „genau eine offen“ dort immer falsch.
 */
const KARTEN = `window.__ccKarten = (sel) => {
  const erste = document.querySelector(sel + ' a[aria-expanded]');
  return erste ? [...erste.parentElement.querySelectorAll(':scope > a[aria-expanded]')] : [];
};`;

/** Lage aller Karten des Akkordeons, wie gerade zu sehen. */
const ZUSTAND = (sel) => window.__ccKarten(sel).map((a) => {
  const r = a.getBoundingClientRect();
  const fenster = a.querySelector('[data-akk="fenster"]')?.getBoundingClientRect();
  return {
    offen: a.getAttribute('aria-expanded') === 'true',
    oben: r.top,
    hoehe: r.height,
    sichtbar: fenster ? fenster.bottom - r.top : r.height,
    skript: a.getAnimations({ subtree: true }).filter((x) => x.playState === 'running' && x.constructor === Animation).length,
    fensterHoehe: window.innerHeight,
  };
});

/** Ruhelage pruefen; liefert Fehlertexte. */
const ruhelageFehler = (karten, offen) => {
  const fehler = [];
  karten.forEach((k, i) => {
    if (k.offen !== (i === offen)) fehler.push(`Karte ${i} ${k.offen ? 'offen' : 'zu'}, erwartet ${i === offen ? 'offen' : 'zu'}`);
    if (i !== offen && Math.abs(k.hoehe - 64) > 1) fehler.push(`Karte ${i} ${Math.round(k.hoehe)} px statt 64`);
    if (Math.abs(k.sichtbar - k.hoehe) > 1) fehler.push(`Karte ${i}: Fenster ${Math.round(k.sichtbar)} px, Karte ${Math.round(k.hoehe)} px`);
    if (k.skript) fehler.push(`Karte ${i}: ${k.skript} Animation(en) laufen noch`);
    if (i === offen && (k.oben >= k.fensterHoehe || k.oben + k.hoehe <= 0)) {
      fehler.push(`getippte Karte ${i} nicht mehr im Bild (Oberkante ${Math.round(k.oben)} px), die Seite ist gesprungen`);
    }
    if (i > 0) {
      const abstand = k.oben - (karten[i - 1].oben + karten[i - 1].hoehe);
      if (Math.abs(abstand - 10) > 1) fehler.push(`Abstand vor Karte ${i}: ${Math.round(abstand)} px statt 10`);
    }
  });
  return fehler;
};

const { basis, stopp } = await startePreview(4187);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
try {
  for (const { route, sektion, tipps } of ZIELE) {
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await seite.evaluateOnNewDocument(KARTEN);
    await seite.setViewport(FENSTER);
    await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
    if (GEGENPROBE) await seite.addStyleTag({ content: FEHLER_CSS });
    await seite.evaluate((sel) => window.scrollTo(0, document.querySelector(`${sel} a[aria-expanded]`).getBoundingClientRect().top + window.scrollY - 140), sektion);
    await warte(1600);
    // Das Stellen-Pop-up auf /karriere (nach 1,2 s, unten) laege sonst ueber den getippten Karten.
    // Es blendet nach dem Schliessen noch aus; vorher faengt es den Tipp ab (gemessen: nach 400 ms noch, nach 600 ms nicht mehr).
    await seite.evaluate(() => document.querySelector('[role="dialog"] button[aria-label*="schließen"]')?.click());
    await warte(1000);
    const tippe = async (i) => {
      const p = await seite.evaluate((sel, k) => {
        const r = window.__ccKarten(sel)[k].getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + 24 };
      }, sektion, i);
      await seite.touchscreen.tap(p.x, p.y);
    };
    const cdp = await seite.createCDPSession();

    // 1. Gemessener Tipp
    const [ziel, unterbrechung] = tipps;
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: DROSSEL });
    await seite.tracing.start({ categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'devtools.timeline.animation', 'blink.animations'] });
    await tippe(ziel);
    await warte(900);
    const spur = JSON.parse(Buffer.from(await seite.tracing.stop()).toString('utf8'));
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    const ereignisse = spur.traceEvents ?? spur;
    const haupt = ereignisse
      .filter((e) => e.name === 'thread_name' && e.args?.name === 'CrRendererMain')
      .map((t) => ({ t, n: ereignisse.filter((e) => e.pid === t.pid && e.tid === t.tid && e.ph === 'X').length }))
      .sort((a, b) => b.n - a.n)[0]?.t;
    const lauf = ereignisse.filter((e) => haupt && e.pid === haupt.pid && e.tid === haupt.tid && e.ph === 'X' && e.dur);
    const tipp = lauf.filter((e) => e.name === 'EventDispatch').map((e) => e.ts).sort((a, b) => a - b)[0] ?? 0;
    const fenster = lauf.filter((e) => e.ts >= tipp && e.ts < tipp + 700_000);
    const layouts = fenster.filter((e) => e.name === 'Layout').length;
    const anteile = {};
    for (const e of fenster) if (KATEGORIEN[e.name]) anteile[KATEGORIEN[e.name]] = (anteile[KATEGORIEN[e.name]] ?? 0) + e.dur / 1000;
    const bilder = Math.max(1, ereignisse.filter((e) => haupt && e.pid === haupt.pid && e.name === 'FireAnimationFrame' && e.ts >= tipp && e.ts < tipp + 700_000).length);
    const summe = Object.values(anteile).reduce((a, b) => a + b, 0);
    const fehlgeschlagen = ereignisse.filter((e) => e.name === 'Animation' && e.args?.data?.compositeFailed > 0).length;

    const name = `${route} ${sektion}`;
    if (layouts >= GRENZE_LAYOUTS) befunde.push(`${name}: ${layouts} Layout-Laeufe in 700 ms nach dem Tipp (Grenze ${GRENZE_LAYOUTS}), also Layout pro Bild`);
    if (fehlgeschlagen) befunde.push(`${name}: ${fehlgeschlagen} Animation(en) nicht auf dem Compositor`);
    await warte(300);
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), ziel)) befunde.push(`${name}, nach Tipp auf ${ziel}: ${f}`);

    // 2. Unterbrechung: andere Karte, nach 150 ms die naechste
    const andere = ziel === 0 ? 1 : 0;
    await tippe(andere);
    await warte(150);
    await tippe(unterbrechung);
    await warte(1100);
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), unterbrechung)) befunde.push(`${name}, nach Unterbrechung: ${f}`);

    const ms = (k) => (anteile[k] ?? 0).toFixed(0);
    zeilen.push(`| ${name} | ${layouts} | ${fehlgeschlagen} | ${(summe / bilder).toFixed(1)} ms | ${ms('Stil')} / ${ms('Layout')} / ${ms('Malen')} / ${ms('Ebenen')} / ${ms('Skript')} |`);
    await seite.close();
    process.stdout.write('.');
  }
} finally {
  await browser.close();
  stopp();
}

console.log(`\n\n| Akkordeon | Layouts in 700 ms | nicht auf Compositor | Hauptthread je Bild (${DROSSEL}×) | Stil / Layout / Malen / Ebenen / Skript (ms) |`);
console.log('|---|---|---|---|---|');
console.log(zeilen.join('\n'));

if (GEGENPROBE) {
  const gemeldet = befunde.filter((b) => b.includes('Layout pro Bild')).length;
  console.log(`\n[akkordeon] Gegenprobe: ${gemeldet} von ${ZIELE.length} eingespielten Hoehen-Animationen gemeldet.`);
  process.exit(gemeldet === ZIELE.length ? 0 : 1);
}
if (befunde.length) {
  console.log(`\n[akkordeon] ${befunde.length} Befund(e):`);
  for (const b of befunde) console.log(`  - ${b}`);
  process.exit(1);
}
console.log('\n[akkordeon] ok: kein Layout pro Bild, alle Animationen auf dem Compositor, Ruhelage stimmt.');
