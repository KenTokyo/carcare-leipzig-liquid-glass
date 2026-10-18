// FAQ-Check mobil: Ist die FAQ auf JEDER Seite mit FAQ dasselbe Akkordeon, und springt beim Aufklappen nichts?
//
// AUFRUF:
//   npm run faq-mobil                  alle Routen (Liste aus scripts/routes.mjs), Routen ohne FAQ werden uebersprungen
//   npm run faq-mobil -- /karriere      nur diese Route(n) (unter Git Bash `MSYS_NO_PATHCONV=1` davor)
//   npm run faq-mobil -- --gegenprobe  PRUEFT DEN PRUEFER auf `/` und einer Unterseite: spielt das alte Auto-Schliessen
//                                      (bis 2026-10-17) und abgeschaltetes Nachscrollen ein; beides muss gemeldet werden
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// ANLASS (User, 2026-10-17): „auf der Mainpage die FAQs so eingerichtet, dass man da draufklicken muss … Auf den
// Subpages hast du das nicht so gemacht. Ich möchte, dass du das gerne vereinheitlichst … und achte darauf, dass es
// nicht ruckelt.“ Gemessen: Auf der Startseite klappte beim Tipp auf Frage 3 die offene Frage 1 zu, die getippte Frage
// rutschte in 300 ms 137 px nach oben, unter dem Finger weg. Seitdem `components/FaqListe.tsx` auf allen Seiten.
//
// GEMESSEN (393 × 851, Touch, echter Tipp per `touchscreen.tap`), je Route mit FAQ (HART, Exit 1):
//   - AKKORDEON: jede Frage ein Knopf mit `aria-expanded` in einer `h3`, der eine Antwort steuert (`aria-controls`), und
//     jede Antwort steht mit Text im DOM, auch geschlossen (dann `inert` und `aria-hidden`).
//   - START: genau die erste Frage offen.
//   - NACHBARN: Ein Tipp aendert nur die getippte Frage. Das alte Auto-Schliessen faellt hier auf.
//   - SPRUNG: Die getippte Frage bewegt sich nie schneller als MAX_TEMPO px/ms zwischen zwei Bildern. Das Nachgleiten
//     erreicht rund 2 px/ms; das Wegrutschen vom 17.10. waren bis zu 3 px/ms in den ersten Bildern UND ein Wechsel der
//     Nachbarn, das faellt also spaetestens unter NACHBARN.
//   - GANZ SICHTBAR: Nach dem Aufklappen steht die ganze Frage samt Antwort im freien Bereich (zwischen den Leisten mit
//     `data-feste-leiste`, wie `lib/freierBereich.ts`), sofern sie hineinpasst; die Frage nie unter der Navbar. Zwei
//     Tipps je Route: eine Frage bei 45 % der Fensterhoehe (passt meist ohne Scrollen) und eine bei 85 % (die Antwort
//     liefe unter die Knopfleiste, die Seite muss nachgleiten).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md):
//  1. KEIN ECHTES GERAET: Kopfloses Chrome. Ob Safari den Uebergang auf `grid-template-rows` weich zeichnet (ab Safari 16),
//     sieht nur ein iPhone. Ruckeln durch Rechenlast misst sie nicht (gemessen am 17.10.: 1,3 ms Hauptthread je Bild).
//  2. GEOMETRIE, KEIN AUSSEHEN: Ob der Text sauber einblendet oder halb abgeschnitten vor der Kante steht, zeigt nur ein
//     Bildschirmfoto mitten in der Animation.
//  3. NUR AUFKLAPPEN, zwei Fragen je Route. Zuklappen und mehrere offene Fragen nacheinander prueft sie nicht.
//  4. DER FREIE BEREICH kennt nur Leisten mit `data-feste-leiste`. Eine neue feste Leiste ohne das Merkmal (z. B. ein
//     Hinweisbanner) verdeckt Antworten, ohne dass es hier auffaellt.
//  5. DIE GEGENPROBE spielt das Auto-Schliessen ueber Attribute ein, nicht ueber den React-Zustand. Sie beweist, dass
//     NACHBARN und SPRUNG greifen, nicht, dass jede denkbare Fehlerart auffiele.
//  6. DAS AUSGELIEFERTE HTML prueft `check-faq-html` (im `postbuild`), nicht dieser Check.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEGENPROBE = process.argv.includes('--gegenprobe');
const NUR_ROUTEN = process.argv.slice(2).filter((a) => a.startsWith('/'));
const FENSTER = { width: 393, height: 851, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
/** Schnellste erlaubte Bewegung der getippten Frage zwischen zwei Bildern, in px/ms. */
const MAX_TEMPO = 6;
/** Wo die getippten Fragen vor dem Tipp stehen, als Anteil der Fensterhoehe (Kopf: GANZ SICHTBAR). */
const LAGEN = [0.45, 0.85];

if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[faq-mobil] dist/ fehlt, bitte zuerst `npm run build`.');
  process.exit(1);
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const routen = GEGENPROBE ? ['/', '/fahrzeugaufbereitung-leipzig'] : NUR_ROUTEN.length ? NUR_ROUTEN : getRoutes().map((r) => r.path ?? r);
/**
 * Laeufe: je Route einer, in der Gegenprobe je Route zwei getrennte (jeder Fehler fuer sich, sonst verdeckt einer den
 * anderen: Das Auto-Schliessen schiebt die zweite Frage um eine ganze Antwort nach oben, ihre Antwort passt dann wieder).
 */
const laeufe = GEGENPROBE ? routen.flatMap((route) => [{ route, fehler: 'schliessen' }, { route, fehler: 'ohneScrollen' }]) : routen.map((route) => ({ route, fehler: null }));
const befunde = [];
const messfehler = [];
const zeilen = [];

/** FAQ-Knoepfe der Seite (nur Knoepfe, die eine FAQ-Antwort steuern) und freier Bereich, im Fenster abgelegt. */
const HILFEN = `
  window.__ccFaq = () => [...document.querySelectorAll('h3 > button[aria-expanded][aria-controls]')]
    .filter((b) => document.getElementById(b.getAttribute('aria-controls'))?.classList.contains('cc-faq-antwort'));
  window.__ccFrei = () => {
    let oben = 0;
    let unten = window.innerHeight;
    document.querySelectorAll('[data-feste-leiste]').forEach((leiste) => {
      const r = leiste.getBoundingClientRect();
      if (r.height === 0 || r.bottom <= 0 || r.top >= window.innerHeight) return;
      if (leiste.dataset.festeLeiste === 'oben') oben = Math.max(oben, r.bottom);
      else unten = Math.min(unten, r.top);
    });
    return { oben, unten };
  };
`;

/**
 * Gegenprobe, zwei getrennte Fehler:
 *  `schliessen`   — das alte Auto-Schliessen: Beim Tipp auf eine geschlossene Frage klappen alle uebrigen offenen zu
 *                   (wie bis 2026-10-17 auf der Startseite). Muss unter NACHBARN fallen.
 *  `ohneScrollen` — kein Nachgleiten (Lenis scrollt ueber `window.scrollTo`). Muss unter GANZ SICHTBAR fallen.
 */
const FEHLER = {
  schliessen: `
    document.addEventListener('click', (e) => {
      const knopf = e.target instanceof Element ? e.target.closest('h3 > button[aria-expanded]') : null;
      if (!knopf || knopf.getAttribute('aria-expanded') === 'true') return;
      for (const andere of window.__ccFaq()) {
        if (andere === knopf || andere.getAttribute('aria-expanded') !== 'true') continue;
        andere.setAttribute('aria-expanded', 'false');
        document.getElementById(andere.getAttribute('aria-controls')).dataset.offen = 'false';
      }
    }, true);
  `,
  ohneScrollen: 'window.scrollTo = () => {};',
};

const { basis, stopp } = await startePreview(4189);
let browser;
try {
  browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
  for (const { route, fehler } of laeufe) {
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await seite.evaluateOnNewDocument(HILFEN);
    await seite.setViewport(FENSTER);
    await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
    const anzahl = await seite.evaluate(() => window.__ccFaq().length);
    const alleFragen = await seite.evaluate(() => document.querySelectorAll('h3 > button[aria-expanded]').length);
    if (!anzahl) {
      // Eine sichtbare FAQ ohne Akkordeon (wie bis 2026-10-17 auf den Unterseiten) erkennt man am FAQPage-Markup.
      const markup = await seite.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].some((s) => s.textContent.includes('FAQPage')));
      if (markup) befunde.push(`${route}: FAQPage-Markup, aber keine aufklappbare FAQ (Knopf in h3, der eine .cc-faq-antwort steuert)`);
      await seite.close();
      continue;
    }
    if (route === '/karriere') {
      await seite.waitForSelector('[role="dialog"]', { timeout: 6000 }).catch(() => {});
      await seite.evaluate(() => document.querySelector('[role="dialog"] button[aria-label*="schließen"]')?.click());
      await seite.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 4000 }).catch(() => {});
    }
    if (fehler) await seite.evaluate(FEHLER[fehler]);
    const kennung = fehler ? `${route} [${fehler}]` : route;

    // AKKORDEON und START
    const aufbau = await seite.evaluate(() => window.__ccFaq().map((b) => {
      const antwort = document.getElementById(b.getAttribute('aria-controls'));
      return {
        offen: b.getAttribute('aria-expanded') === 'true',
        text: antwort.textContent.trim().length,
        inert: antwort.inert,
        verborgen: antwort.getAttribute('aria-hidden') === 'true',
      };
    }));
    aufbau.forEach((f, i) => {
      if (!f.text) befunde.push(`${route}: Antwort ${i + 1} ohne Text im DOM`);
      if (!f.offen && !(f.inert && f.verborgen)) befunde.push(`${route}: Antwort ${i + 1} geschlossen, aber nicht inert/aria-hidden`);
    });
    const offenAmStart = aufbau.map((f, i) => (f.offen ? i + 1 : 0)).filter(Boolean);
    if (offenAmStart.join() !== '1') befunde.push(`${route}: am Start offen ${offenAmStart.join(', ') || 'keine'}, erwartet nur Frage 1`);
    if (alleFragen !== anzahl) befunde.push(`${route}: ${alleFragen - anzahl} Knopf/Knoepfe mit aria-expanded in h3 ohne FAQ-Antwort`);

    // Zwei Tipps: Frage 3 (bzw. die letzte) bei 45 %, die naechste geschlossene bei 85 %
    const ziele = [Math.min(2, anzahl - 1)];
    const zweite = [3, anzahl - 1, 1].find((i) => i < anzahl && i !== ziele[0] && i !== 0);
    if (zweite !== undefined) ziele.push(zweite);
    const spalten = [];
    for (const [n, ziel] of ziele.entries()) {
      if (ziel === 0) continue;
      const anteil = LAGEN[n];
      await seite.evaluate((z, a) => {
        const b = window.__ccFaq()[z];
        window.scrollBy(0, b.getBoundingClientRect().top - window.innerHeight * a);
      }, ziel, anteil);
      await warte(1300); // Einblenden der Fragen (whileInView) und Lenis
      const vorher = await seite.evaluate(() => window.__ccFaq().map((b) => b.getAttribute('aria-expanded')));
      const punkt = await seite.evaluate((z) => {
        const b = window.__ccFaq()[z];
        const r = b.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + Math.min(r.height / 2, 30);
        return { x, y, frei: document.elementFromPoint(x, y)?.closest('button') === b && y > 0 && y < window.innerHeight };
      }, ziel);
      if (!punkt.frei) {
        messfehler.push(`${kennung}: Frage ${ziel + 1} liegt nicht frei (Treffertest), Tipp ausgelassen`);
        continue;
      }
      await seite.evaluate((z) => {
        const artikel = window.__ccFaq()[z].closest('article');
        window.__ccBahn = [];
        window.__ccBahnLauf = true;
        const tick = (zeit) => {
          window.__ccBahn.push([zeit ?? performance.now(), artikel.getBoundingClientRect().top]);
          if (window.__ccBahnLauf) requestAnimationFrame(tick);
        };
        tick();
      }, ziel);
      await seite.touchscreen.tap(punkt.x, punkt.y);
      await warte(1000);
      // Scrollen ausgelaufen: zwei Messungen im Abstand von 200 ms gleich
      await seite.waitForFunction(() => new Promise((r) => { const y = window.scrollY; setTimeout(() => r(window.scrollY === y), 200); }), { timeout: 3000, polling: 250 }).catch(() => {});
      const bahn = await seite.evaluate(() => { window.__ccBahnLauf = false; return window.__ccBahn; });
      const ende = await seite.evaluate((z) => {
        const artikel = window.__ccFaq()[z].closest('article').getBoundingClientRect();
        return { offen: window.__ccFaq().map((b) => b.getAttribute('aria-expanded')), oben: artikel.top, unten: artikel.bottom, frei: window.__ccFrei() };
      }, ziel);
      const name = `${kennung}, Frage ${ziel + 1} bei ${Math.round(anteil * 100)} %`;
      // NACHBARN
      const geaendert = ende.offen.map((o, i) => (i !== ziel && o !== vorher[i] ? i + 1 : 0)).filter(Boolean);
      if (geaendert.length) befunde.push(`${name}: Tipp aendert auch Frage(n) ${geaendert.join(', ')} (Auto-Schliessen, die getippte Frage rutscht)`);
      if (ende.offen[ziel] !== 'true') befunde.push(`${name}: Frage geht nicht auf`);
      // SPRUNG
      let tempo = 0;
      for (let i = 1; i < bahn.length; i++) tempo = Math.max(tempo, Math.abs(bahn[i][1] - bahn[i - 1][1]) / Math.max(1, bahn[i][0] - bahn[i - 1][0]));
      if (tempo > MAX_TEMPO) befunde.push(`${name}: getippte Frage springt (${tempo.toFixed(1)} px/ms, Grenze ${MAX_TEMPO})`);
      // GANZ SICHTBAR
      const passt = ende.unten - ende.oben <= ende.frei.unten - ende.frei.oben - 24;
      if (ende.oben < ende.frei.oben - 1) befunde.push(`${name}: Frage unter der Navbar (Oberkante ${Math.round(ende.oben)}, frei ab ${Math.round(ende.frei.oben)})`);
      else if (passt && ende.unten > ende.frei.unten + 1) befunde.push(`${name}: Antwort endet ${Math.round(ende.unten - ende.frei.unten)} px unter der Knopfleiste`);
      spalten.push(`${Math.round(bahn[0]?.[1] ?? 0)} → ${Math.round(ende.oben)}–${Math.round(ende.unten)} px, ${tempo.toFixed(1)} px/ms`);
    }
    zeilen.push(`| ${kennung} | ${anzahl} | ${offenAmStart.join(', ')} | ${spalten.join(' | ')} |`);
    await seite.close();
    process.stdout.write('.');
  }
} finally {
  await browser?.close();
  stopp();
}

console.log(`\n\n| Route | Fragen | offen am Start | Tipp bei 45 %: vorher → Endlage, schnellste Bewegung | Tipp bei 85 % |`);
console.log('|---|---|---|---|---|');
console.log(zeilen.join('\n'));
if (messfehler.length) {
  console.log(`\n[faq-mobil] ${messfehler.length} Messfehler (Ergebnis nicht verwertbar, bitte wiederholen):`);
  for (const m of messfehler) console.log(`  - ${m}`);
}
if (GEGENPROBE) {
  const nachbarn = routen.filter((r) => befunde.some((b) => b.startsWith(`${r} [schliessen], `) && b.includes('aendert auch'))).length;
  const sichtbar = routen.filter((r) => befunde.some((b) => b.startsWith(`${r} [ohneScrollen], `) && b.includes('unter der Knopfleiste'))).length;
  console.log(`\n[faq-mobil] Gegenprobe: Auto-Schliessen auf ${nachbarn} von ${routen.length} Routen, fehlendes Nachscrollen auf ${sichtbar} von ${routen.length} gemeldet.`);
  process.exit(nachbarn === routen.length && sichtbar === routen.length ? 0 : 1);
}
if (messfehler.length) process.exit(2);
if (befunde.length) {
  console.log(`\n[faq-mobil] ${befunde.length} Befund(e):`);
  for (const b of befunde) console.log(`  - ${b}`);
  process.exit(1);
}
console.log(`\n[faq-mobil] ok: ${zeilen.length} Routen mit FAQ, ueberall dasselbe Akkordeon, Antworten im DOM, nur die erste offen, getippte Frage springt nicht, Antwort danach ganz sichtbar.`);
