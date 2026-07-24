// Verifikation des Preloaders gegen den laufenden Dev-Server.
//
// Warum ein eigenes Skript: Die Preview-Pane laeuft im Tab-Status "hidden" — dort feuert
// kein rAF, also laeuft keine Framer-Animation, und Screenshots timeouten. Visuelle
// Nachweise entstehen in diesem Projekt deshalb grundsaetzlich per Puppeteer.
//
// Warum pro Frame ein eigener Reload: Die Animation haengt an der Zeit seit Navigations-
// start. Ein Screenshot-Burst waere durch die Screenshot-Dauer selbst verzerrt. Ein
// frischer Load je Zeitpunkt liefert dagegen exakt reproduzierbare Frames.
//
// Aufruf: node scripts/verify-preloader.mjs [baseUrl]

import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] || 'http://localhost:3007';
const OUT = join(root, 'output', 'preloader-verify');
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 1 };
/** Zeitpunkte (ms ab Navigationsstart), an denen ein Frame festgehalten wird. */
const FRAMES = [120, 450, 780, 950, 1150, 1400, 1750, 2200];

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const results = [];
const consoleErrors = [];

/**
 * Neue Seite = neuer Tab = von Haus aus leerer sessionStorage. Genau deshalb hier KEIN
 * `evaluateOnNewDocument(() => sessionStorage.clear())`: Ein solcher Hook laeuft bei
 * JEDER Navigation dieser Seite und wuerde damit ausgerechnet den Session-Gate-Test
 * unbrauchbar machen (der zweite Aufruf saehe wieder eine „frische" Session).
 */
async function freshPage() {
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  page.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    // ERR_FAILED stammt aus dem absichtlichen Request-Blocking im Anti-Flash-Test —
    // das ist der Testaufbau selbst, kein Befund.
    if (m.type() === 'error' && !m.text().includes('net::ERR_FAILED')) {
      consoleErrors.push(`console: ${m.text()}`);
    }
  });
  return page;
}

// Vite-Kaltstart aus den Messungen heraushalten: Beim allerersten Aufruf transformiert
// der Dev-Server den gesamten Modulgraphen, das verschiebt den ersten Frame um Sekunden.
const warmup = await freshPage();
await warmup.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await warmup.close();

// ---------------------------------------------------------------- Frames
for (const t of FRAMES) {
  const page = await freshPage();
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
  // `goto` kehrt erst bei DOMContentLoaded zurueck. Stumpf `t` ms nachzuwarten wuerde die
  // bereits verstrichene Zeit doppelt zaehlen. Deshalb die Restzeit aus der Seitenuhr
  // (performance.now() = ms seit Navigationsstart) berechnen.
  const rest = await page.evaluate((target) => Math.max(0, target - performance.now()), t);
  if (rest > 0) await new Promise((r) => setTimeout(r, rest));
  await page.screenshot({ path: join(OUT, `frame-${String(t).padStart(4, '0')}ms.png`) });
  const state = await page.evaluate(() => ({
    // Echte Seitenzeit mitprotokollieren: Wenn der Screenshot spaeter als geplant faellt
    // (Dev-Server langsam), soll das im Report sichtbar sein statt still zu verfaelschen.
    pageTime: Math.round(performance.now()),
    preloadingClass: document.documentElement.classList.contains('cc-preloading'),
    bootLayer: !!document.getElementById('cc-boot'),
    overlay: !!document.querySelector('[data-preloader]'),
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));
  results.push({ t, ...state });
  await page.close();
}

// ----------------------------------------------- Boot-Layer: Anti-Flash-Garantie
// Der Boot-Layer ist die Existenzberechtigung des Hybrid-Ansatzes: Er soll die Luecke
// zwischen erstem Paint und React-Mount decken.
//
// Diese Luecke per CPU-Drosselung zu treffen funktioniert NICHT: `goto` kehrt erst bei
// DOMContentLoaded zurueck, und bis dahin ist das Fenster vorbei (gemessen: bei Rate 20
// lag die erste moegliche Probe schon bei ~7,9 s). Stattdessen wird hier der Grenzfall
// erzwungen — das JS-Bundle wird geblockt, React kommt also NIE. Deckt der Boot-Layer
// dann immer noch den Viewport, ist die Luecke per Konstruktion geschlossen.
const noJs = await freshPage();
await noJs.setRequestInterception(true);
noJs.on('request', (req) => {
  const url = req.url();
  // prod: /assets/index-*.js · dev: /index.tsx + Vite-Client
  if (/\/assets\/index-.*\.js$/.test(url) || /\/index\.tsx/.test(url) || /@vite\/client/.test(url)) {
    req.abort().catch(() => {});
    return;
  }
  req.continue().catch(() => {});
});
await noJs.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 900));
const bootGuard = await noJs.evaluate(() => {
  const boot = document.getElementById('cc-boot');
  const cs = boot ? getComputedStyle(boot) : null;
  const hit = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
  return {
    bootExists: !!boot,
    bootDisplay: cs?.display ?? null,
    bootBackground: cs?.backgroundColor ?? null,
    reactMounted: !!document.querySelector('[data-preloader]'),
    // Was liegt in der Bildmitte ganz oben? Muss der Boot-Layer sein.
    centerIsBoot: !!hit?.closest('#cc-boot'),
    // Deckt er wirklich den ganzen Viewport?
    coversViewport: boot
      ? (() => { const r = boot.getBoundingClientRect(); return Math.round(r.width) >= innerWidth && Math.round(r.height) >= innerHeight; })()
      : false,
  };
});
await noJs.screenshot({ path: join(OUT, 'boot-layer-without-js.png') });
await noJs.close();

// ------------------------------------------- Hero-Foto: ein Download, nicht zwei
// Der Preloader zeigt dasselbe Hero-Bild wie die Sektion darunter. Behauptung: Weil es
// dieselbe URL ist, entsteht KEIN zweiter Download — der Preloader waermt das Bild
// stattdessen vor. Das wird hier gezaehlt statt geglaubt.
const netPage = await freshPage();
const heroRequests = [];
netPage.on('request', (r) => {
  if (/hero-leipzig-carcare-(desktop|mobile)\.webp/.test(r.url())) heroRequests.push(r.url());
});
await netPage.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 });
await new Promise((r) => setTimeout(r, 1200));
const heroNet = {
  anfragen: heroRequests.length,
  dateien: [...new Set(heroRequests.map((u) => u.split('/').pop()))],
};
await netPage.close();

// ---------------------------------------------------------------- Mobile
// Mobile-First ist Projektvorgabe (CLAUDE.md) — der Lockup muss auf 390 px mit Rand
// stehen, nicht randlos kleben.
const mobile = await freshPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
await mobile.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
const mobileRest = await mobile.evaluate(() => Math.max(0, 550 - performance.now()));
if (mobileRest > 0) await new Promise((r) => setTimeout(r, mobileRest));
await mobile.screenshot({ path: join(OUT, 'mobile-390-hold.png') });
const mobileBox = await mobile.evaluate(() => {
  const el = document.querySelector('.cc-lockup');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { w: Math.round(r.width), h: Math.round(r.height), left: Math.round(r.left), vw: window.innerWidth };
});
await mobile.close();

// ---------------------------------------------------- Endzustand + Session-Gate
const page = await freshPage();
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 3200));

const afterFirst = await page.evaluate(() => ({
  overlay: !!document.querySelector('[data-preloader]'),
  bootLayer: !!document.getElementById('cc-boot'),
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
  sessionFlag: sessionStorage.getItem('cc-preloader-v1'),
  bodyOverflow: getComputedStyle(document.body).overflow,
  h1: document.querySelector('h1')?.textContent?.slice(0, 60) ?? null,
}));

// Scrollbarkeit belegen (Lenis wieder entsperrt?)
await page.evaluate(() => window.scrollTo(0, 600));
await new Promise((r) => setTimeout(r, 900));
const scrolled = await page.evaluate(() => Math.round(window.scrollY));
await page.screenshot({ path: join(OUT, 'after-exit-scrolled.png') });

// Zweiter Aufruf in DERSELBEN Session.
// Erwartung haengt vom Modus ab:
//   Produktion (`vite preview`, echtes Deploy) -> Session-Gate greift, KEIN Preloader
//   Dev-Server                                 -> `__CC_DEV__` haebelt das Gate aus,
//                                                 Preloader laeuft bei jedem Reload,
//                                                 sonst koennte man nicht daran arbeiten
await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 300));
const secondVisit = await page.evaluate(() => ({
  isDev: !!window.__CC_DEV__,
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
  overlay: !!document.querySelector('[data-preloader]'),
  sessionFlag: sessionStorage.getItem('cc-preloader-v1'),
}));
secondVisit.erwartet = secondVisit.isDev ? 'Preloader laeuft (Dev)' : 'kein Preloader (Gate)';
secondVisit.ok = secondVisit.isDev ? secondVisit.preloadingClass : !secondVisit.preloadingClass;

// Schalter ?preloader=1 muss den Preloader auch auf einer Unterseite erzwingen
const forced = await freshPage();
await forced.goto(`${BASE}/leistungen?preloader=1`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 300));
const forcedState = await forced.evaluate(() => ({
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
  overlay: !!document.querySelector('[data-preloader]'),
}));
// …und ?preloader=0 ihn auf der Startseite abschalten
await forced.goto(`${BASE}/?preloader=0`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 300));
const offState = await forced.evaluate(() => ({
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
}));
await forced.close();
await page.screenshot({ path: join(OUT, 'second-visit.png') });

// Unterseite -> nie ein Preloader
const sub = await freshPage();
await sub.goto(`${BASE}/leistungen`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 300));
const subPage = await sub.evaluate(() => ({
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
  overlay: !!document.querySelector('[data-preloader]'),
}));
await sub.screenshot({ path: join(OUT, 'subpage-leistungen.png') });
await sub.close();

// Deep-Link mit Hash -> kein Preloader (Anker gewinnt)
const hashPage = await freshPage();
await hashPage.goto(`${BASE}/#kontakt-schaden`, { waitUntil: 'domcontentloaded' });
await new Promise((r) => setTimeout(r, 300));
const hashState = await hashPage.evaluate(() => ({
  preloadingClass: document.documentElement.classList.contains('cc-preloading'),
}));
await hashPage.close();
await page.close();
await browser.close();

// ---------------------------------------------------------------- Report
const report = { base: BASE, frames: results, bootGuard, forcedState, offState, heroNet, mobileBox, afterFirst, scrolled, secondVisit, subPage, hashState, consoleErrors };
writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 2));

console.log('\n=== FRAMES (Zeit ab Navigationsstart) ===');
for (const r of results) {
  console.log(`  Ziel ${String(r.t).padStart(4)}ms / real ${String(r.pageTime).padStart(4)}ms  overlay=${r.overlay ? 'ja ' : 'nein'}  boot=${r.bootLayer ? 'ja ' : 'nein'}  html.cc-preloading=${r.preloadingClass ? 'ja ' : 'nein'}  body.overflow=${r.bodyOverflow}`);
}
console.log('\n=== BOOT-LAYER ohne JS (Anti-Flash-Grenzfall) ===');
console.log(`  #cc-boot vorhanden : ${bootGuard.bootExists ? 'ja' : 'NEIN'}   display=${bootGuard.bootDisplay}   bg=${bootGuard.bootBackground}`);
console.log(`  React gemountet    : ${bootGuard.reactMounted ? 'ja (Blocking hat nicht gegriffen!)' : 'nein (erwartet)'}`);
console.log(`  Bildmitte = Boot   : ${bootGuard.centerIsBoot ? 'ja' : 'NEIN'}`);
console.log(`  deckt Viewport     : ${bootGuard.coversViewport ? 'ja' : 'NEIN'}`);

console.log('\n=== HERO-FOTO: Netzwerk ===');
console.log(`  Anfragen fuer das Hero-Bild: ${heroNet.anfragen}  (${heroNet.dateien.join(', ')})  -> ${heroNet.anfragen <= 1 ? 'OK, kein Doppel-Download' : 'ACHTUNG: mehrfach geladen'}`);

console.log('\n=== MOBILE 390px ===');
console.log('  Lockup:', JSON.stringify(mobileBox), mobileBox ? `-> ${Math.round((mobileBox.w / mobileBox.vw) * 100)}% der Breite, Rand ${mobileBox.left}px` : '');

console.log('\n=== ENDZUSTAND (3,2 s, erster Besuch) ===');
console.log(' ', JSON.stringify(afterFirst));
console.log(`  scrollY nach window.scrollTo(0,600): ${scrolled}`);
console.log(`\n=== SESSION-GATE (Modus: ${secondVisit.isDev ? 'DEV' : 'PRODUKTION'}) ===`);
console.log(`  2. Aufruf /               : Preloader=${secondVisit.preloadingClass ? 'ja' : 'nein'}  erwartet: ${secondVisit.erwartet}  -> ${secondVisit.ok ? 'OK' : 'FEHLER'}`);
console.log(`  /leistungen               : Preloader=${subPage.preloadingClass ? 'ja' : 'nein'}  -> ${!subPage.preloadingClass ? 'OK' : 'FEHLER'}`);
console.log(`  /#kontakt-schaden         : Preloader=${hashState.preloadingClass ? 'ja' : 'nein'}  -> ${!hashState.preloadingClass ? 'OK' : 'FEHLER'}`);
console.log(`  /leistungen?preloader=1   : Preloader=${forcedState.preloadingClass ? 'ja' : 'nein'}  -> ${forcedState.preloadingClass ? 'OK' : 'FEHLER'}`);
console.log(`  /?preloader=0             : Preloader=${offState.preloadingClass ? 'ja' : 'nein'}  -> ${!offState.preloadingClass ? 'OK' : 'FEHLER'}`);
console.log('\n=== CONSOLE ===');
console.log(consoleErrors.length ? consoleErrors.map((e) => '  ' + e).join('\n') : '  keine Fehler');
console.log(`\nScreenshots: ${OUT}`);
