// Layout-Spruenge beim Laden (Cumulative Layout Shift), je Route und Fenster, mit Handy-Drosselung.
//
// AUFRUF:
//   npm run cls                         alle Routen, vier Fenster (360 × 640, 390 × 844, 1024 × 700, 1366 × 657)
//   npm run cls -- /karriere /          nur diese Routen (unter Git Bash `MSYS_NO_PATHCONV=1` davor)
//   npm run cls -- --gegenprobe         spielt auf / einen Sprung ein und verlangt, dass er gemeldet wird (Exit 1 sonst)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst. Bericht: `output/cls/bericht.md`.
//
// WOZU (2026-10-16, Backlog R23 und R28)
// Google wertet CLS als Ranking-Signal; „gut“ ist unter 0,1. Zwei Fehler standen live, ohne dass ein Werkzeug sie sah:
// Die Fusszeile rendert zuerst fixiert und sprang erst nach der Messung in den Seitenfluss (CLS 1,0 auf Handys), und
// eine eingefrorene Kopie des Stellen-Pop-ups aus dem Prerender verschob sich auf /karriere (0,14 bei 1024 × 700).
// Beide hingen am Timing: lokal ohne Drossel 0, erst mit CPU 4× sichtbar.
//
// WIE
// Je Route und Fenster ein frischer Tab mit CPU-Drosselung 4× (Lighthouse-Standard fuer mobil), Preloader aus wie bei
// den anderen Werkzeugen. Ein PerformanceObserver (`layout-shift`, vor allen Seitenskripten) sammelt die Spruenge ohne
// vorherige Eingabe, vom Laden bis 2,5 s nach Netzwerkruhe. CLS wie in web-vitals: groesstes Sitzungsfenster (Luecke
// unter 1 s, hoechstens 5 s). Gemeldet mit Verursacher (Element und Text).
//   HART (Exit 1): CLS ab 0,1.   HINWEIS: ab 0,01.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md)
//  1. TIMING: Spruenge, die nur entstehen, wenn der Browser zwischen zwei Renderschritten malt, sind auch mit CPU 4×
//     nur wahrscheinlich, nicht sicher (lokal 2026-10-16: der Fusszeilenfehler in 4 von 12 Handy-Laeufen). Ein
//     sauberer Lauf beweist keine Abwesenheit; deshalb alle Routen in zwei Handyfenstern, wo derselbe Fehler auf
//     vielen Seiten zugleich steckt.
//  2. NUR DAS LADEN: Spruenge beim Scrollen, nach Timern ueber 2,5 s, durch spaet nachladende Inhalte oder nach
//     Klicks misst sie nicht. Googles Felddaten (CrUX) zaehlen den ganzen Besuch.
//  3. LABOR, NICHT FELD: Das Netz ist lokal und schnell. Schriften und Bilder, die auf echten Verbindungen spaet kommen
//     und dann Inhalt verschieben (Bild ohne Groesse), sieht sie nicht. Endgueltig belegen nur die Felddaten in der
//     Search Console (Bericht „Core Web Vitals“), sobald die Seite live Besucher hat.
//  4. VIER FENSTER. Tablets hochkant, Querformat und grosse Bildschirme nicht.
//  5. Preloader aus: Beim ersten Besuch deckt er die ersten Sekunden ab. Spruenge dahinter zaehlen fuer Google trotzdem
//     und werden hier gemessen; nur das Timing weicht vom ersten Besuch ab.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'cls');
const FENSTER = [
  { name: '360', width: 360, height: 640, mobil: true },
  { name: '390', width: 390, height: 844, mobil: true },
  { name: '1024', width: 1024, height: 700, mobil: false },
  { name: '1366', width: 1366, height: 657, mobil: false },
];
const DROSSEL = 4;
const HART_AB = 0.1;
const HINWEIS_AB = 0.01;
const NACHLAUF_MS = 2500;
const PARALLEL = 3;

const args = process.argv.slice(2);
const gegenprobe = args.includes('--gegenprobe');
const nurRouten = args.filter((a) => a.startsWith('/'));
const routen = gegenprobe ? ['/'] : nurRouten.length ? nurRouten : getRoutes().map((r) => r.path ?? r);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/** Laeuft vor allen Seitenskripten: sammelt Layout-Spruenge mit Verursacher. */
function beobachten() {
  window.__ccSpruenge = [];
  const beschreibe = (n) => {
    if (!n || n.nodeType !== 1) return '?';
    const klasse = typeof n.className === 'string' && n.className ? `.${n.className.split(' ')[0]}` : '';
    const name = n.getAttribute('aria-label') || (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    return `${n.tagName.toLowerCase()}${klasse}${name ? ` „${name}“` : ''}`;
  };
  new PerformanceObserver((liste) => {
    for (const e of liste.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__ccSpruenge.push({ t: Math.round(e.startTime), wert: e.value, quellen: (e.sources || []).map((q) => beschreibe(q.node)) });
    }
  }).observe({ type: 'layout-shift', buffered: true });
}

/** Spielt nach dem Laden einen Sprung ein: 300 px Block oben in <main> (nur `--gegenprobe`). */
function sprungEinspielen() {
  addEventListener('load', () => setTimeout(() => {
    const block = document.createElement('div');
    block.style.height = '300px';
    block.textContent = 'GEGENPROBE_SPRUNG';
    (document.querySelector('main') || document.body).prepend(block);
  }, 400));
}

/** CLS wie web-vitals: groesstes Sitzungsfenster (Luecke unter 1000 ms, Fenster hoechstens 5000 ms). */
function clsAus(spruenge) {
  let groesstes = { summe: 0, eintraege: [] };
  let aktuell = { summe: 0, eintraege: [] };
  for (const s of [...spruenge].sort((a, b) => a.t - b.t)) {
    const erster = aktuell.eintraege[0];
    const letzter = aktuell.eintraege[aktuell.eintraege.length - 1];
    if (letzter && (s.t - letzter.t >= 1000 || s.t - erster.t >= 5000)) aktuell = { summe: 0, eintraege: [] };
    aktuell.summe += s.wert;
    aktuell.eintraege.push(s);
    if (aktuell.summe > groesstes.summe) groesstes = { summe: aktuell.summe, eintraege: [...aktuell.eintraege] };
  }
  return groesstes;
}

async function messe(browser, basis, route, f) {
  const s = await browser.newPage();
  try {
    await s.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    await s.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await s.evaluateOnNewDocument(beobachten);
    if (gegenprobe) await s.evaluateOnNewDocument(sprungEinspielen);
    const cdp = await s.createCDPSession();
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: DROSSEL });
    await s.setViewport({ width: f.width, height: f.height, deviceScaleFactor: 1, isMobile: f.mobil, hasTouch: f.mobil });
    await s.goto(basis + route, { waitUntil: 'networkidle0', timeout: 90000 });
    await warte(NACHLAUF_MS);
    const { summe, eintraege } = clsAus(await s.evaluate(() => window.__ccSpruenge));
    const haupt = [...eintraege].sort((a, b) => b.wert - a.wert)[0];
    return { route, fenster: f.name, cls: Math.round(summe * 1000) / 1000, quelle: haupt ? `${haupt.quellen.slice(0, 2).join(' + ') || '?'} (${haupt.t} ms)` : '' };
  } finally {
    await s.close();
  }
}

const { basis, stopp } = await startePreview(4207);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const auftraege = routen.flatMap((route) => FENSTER.map((f) => ({ route, f })));
const ergebnisse = [];
try {
  let naechster = 0;
  const arbeiter = async () => {
    while (naechster < auftraege.length) {
      const { route, f } = auftraege[naechster++];
      ergebnisse.push(await messe(browser, basis, route, f));
      process.stdout.write('.');
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, arbeiter));
} finally {
  await browser.close();
  stopp();
}
process.stdout.write('\n');

const ordnung = (a, b) => routen.indexOf(a.route) - routen.indexOf(b.route) || FENSTER.findIndex((f) => f.name === a.fenster) - FENSTER.findIndex((f) => f.name === b.fenster);
ergebnisse.sort(ordnung);
const harte = ergebnisse.filter((e) => e.cls >= HART_AB);
const hinweise = ergebnisse.filter((e) => e.cls >= HINWEIS_AB && e.cls < HART_AB);

fs.mkdirSync(AUSGABE, { recursive: true });
const zeile = (e) => `| \`${e.route}\` | ${e.fenster} | ${e.cls.toFixed(3)} | ${e.quelle.replace(/\|/g, '/')} |`;
const md = [
  '# Layout-Sprünge beim Laden (CLS)', '',
  `> Erzeugt von \`npm run cls\` am ${new Date().toLocaleString('de-DE')}, ${routen.length} Routen × ${FENSTER.map((f) => `${f.width} × ${f.height}`).join(', ')}, CPU ${DROSSEL}×. Nicht von Hand bearbeiten.`, '',
  `**${harte.length} harte Befunde** (CLS ab ${HART_AB}), ${hinweise.length} Hinweise (ab ${HINWEIS_AB}).`, '',
  ...(harte.length ? ['## Hart', '', '| Route | Fenster | CLS | Hauptverursacher |', '|---|---|---|---|', ...harte.map(zeile), ''] : []),
  ...(hinweise.length ? ['## Hinweise', '', '| Route | Fenster | CLS | Hauptverursacher |', '|---|---|---|---|', ...hinweise.map(zeile), ''] : []),
  '## Alle Messungen', '', '| Route | Fenster | CLS | Hauptverursacher |', '|---|---|---|---|', ...ergebnisse.map(zeile), '',
];
fs.writeFileSync(path.join(AUSGABE, gegenprobe ? 'gegenprobe.md' : 'bericht.md'), md.join('\n'));

console.log(`[cls] ${routen.length} Routen × ${FENSTER.length} Fenster, CPU ${DROSSEL}×. ${harte.length} harte Befunde (ab ${HART_AB}), ${hinweise.length} Hinweise. Bericht: output/cls/${gegenprobe ? 'gegenprobe' : 'bericht'}.md`);
for (const e of [...harte, ...hinweise]) console.log(`  ${e.cls >= HART_AB ? 'HART' : 'Hinweis'} ${e.route} @${e.fenster}: ${e.cls.toFixed(3)} · ${e.quelle}`);

if (gegenprobe) {
  const getroffen = harte.some((e) => e.route === '/');
  console.log(getroffen ? '[cls] Gegenprobe bestanden: eingespielter Sprung gemeldet.' : '[cls] GEGENPROBE FEHLGESCHLAGEN: eingespielter Sprung nicht gemeldet.');
  process.exit(getroffen ? 0 : 1);
}
process.exit(harte.length ? 1 : 0);
