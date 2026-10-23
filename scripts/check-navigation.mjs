// Prueft die globale Navigation: Erreichbarkeit aller Leistungen und die dritte Ebene.
//
// AUFRUF:
//   npm run nav                          gegen `vite preview` (also gegen dist/)
//   npm run nav -- --basis http://localhost:3007   gegen den laufenden Dev-Server
//
// WARUM ES DIESE PRUEFUNG GIBT: Bis 2026-09-07 fuehrte `Navbar.tsx` eine eigene Liste
// von vier Menuekarten, unabhaengig von `data/services.ts`. Sie ist auseinandergelaufen —
// `Felgenreparatur` und `Autoglas / Scheibenfolien` waren ueber die Navigation
// UEBERHAUPT NICHT erreichbar und nur ueber `/leistungen` zu finden. Aufgefallen ist es
// niemandem, weil beide Listen fuer sich betrachtet in Ordnung aussahen.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus
// CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md):
//
//  1. Sie prueft ERREICHBARKEIT, nicht Sinn. Eine Leistung, die unter der falschen
//     Gruppe haengt, ist erreichbar und besteht die Pruefung. Die Zuordnung entscheidet
//     `group` in `data/services.ts` — das bleibt eine Lesefrage.
//  2. Sie prueft die dritte Ebene gegen eine ERWARTUNGSLISTE weiter unten. Wer eine
//     Leistung ergaenzt, muss die Liste nachziehen; sonst meldet die Pruefung rot,
//     obwohl alles stimmt. Das ist Absicht: Eine Ebene, die sich unbemerkt aendert,
//     ist genau das Problem von oben.
//  3. Sie fuehrt den Mauszeiger und die Tastatur, aber sie SIEHT NICHTS. Ob das Panel
//     ueber den Bildschirmrand laeuft oder der Text umbricht, faellt nicht auf.
//     Dafuer sind die Bildschirmfotos da, die sie nebenbei in `output/nav-shots/`
//     ablegt (mit `--basis` in `output/nav-shots-basis/`) — die bewertet ein Mensch.
//  4. Sie laeuft mit `--force-prefers-no-reduced-motion`, also mit BEWEGUNG EIN. Ein
//     Fehler, der nur bei reduzierter Bewegung auftritt, kommt hier durch.
//     (Diese Zeile stand bis 2026-09-07 andersherum da: „Headless meldet KEIN
//     prefers-reduced-motion". Das ist falsch — headless meldet es von sich aus. Ohne
//     den Schalter lief die Pruefung also genau in der Fassung, von der sie behauptete,
//     sie laufe nicht darin.)
//
// SEIT 2026-10-19 (R34) AUCH DAS MOBILE MENUE UND DAS LOGO. Anlass: Das Menue war 995 px hoch,
// nicht scrollbar und hing in der festen Ebene; „Karriere“ und „Kontakt“ lagen bei 393 × 659
// ausserhalb des Fensters, ein Wischen scrollte die Seite dahinter. Das Logo tat auf der
// Startseite nichts. Geprueft wird je Fenster (Touch und Maus, bis 360 × 560, einmal mit 20 px
// Grundschrift): Hauptpunkte in derselben Reihenfolge wie am Desktop, Menue endet ueber der
// Knopfleiste, Finger, Mausrad und Trackpad scrollen es bis zum letzten Link (ganz sichtbar und
// treffbar, „Karriere“ unterwegs ebenso), die Seite dahinter bleibt, auch bei Rad und Wischen
// neben dem Menue; nach dem Schliessen ist die Seite wieder frei. Logo aus sieben Lagen: `/`,
// Seite oben, Menue zu, Sperre frei.
// Gegenprobe: gegen den Build vor R34 (`--basis`) meldet sie alle drei Punkte.
// Was das NICHT abdeckt (Pflichtfrage):
//  5. Touch ist emuliert (Chrome erkennt die Geste), nicht Safari: Gummiband, Schwung nach
//     dem Loslassen und Safaris eigenes `overscroll-behavior` laufen hier nicht. Am iPhone
//     bleibt eine Sichtprobe noetig.
//  6. „Trackpad“ sind viele kleine Radereignisse. Ein echtes Trackpad schiebt nach dem
//     Loslassen weiter (macOS-Schwung); Chrome und Lenis behandeln beides als Rad, der
//     Nachlauf selbst wird nicht gespielt.
//  7. Die Fensterhoehen sind abgeleitet (CLAUDE.md, iPhone 14 Pro in Safari 659 px), nicht
//     am Geraet gemessen. Die Knopfleiste findet sie ueber `data-feste-leiste="unten"`; fehlt
//     das Attribut unter 1024 px, ist das ein Befund und kein stilles Gruen.
//  8. Headless hat keine Scrollleisten, die Platz belegen: Dass `overflow: hidden` beim
//     Oeffnen unter Windows die Leiste wegnimmt und die Seite um ihre Breite verschiebt,
//     sieht sie nicht (betrifft nur 1024 bis 1279 px mit Maus).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const basisArg = args.includes('--basis') ? args[args.indexOf('--basis') + 1] : null;
// Laeufe gegen eine andere Basis (Dev-Server, alter Build als Gegenprobe) in einen eigenen Ordner: Sonst ueberschreiben
// sie die Bilder des Laufs gegen dist/, und die sehen danach aus wie der aktuelle Stand (2026-10-19 passiert, R34).
const AUS = path.join(wurzel, 'output', basisArg ? 'nav-shots-basis' : 'nav-shots');

const TRIGGER = 'nav[aria-label^="Hauptnavigation"] a[href="/leistungen"]';
const PANEL = 'div[class*="top-[calc(100%+14px)]"]';
const KARTE = `${PANEL} a[aria-haspopup="true"]`;
const MOBILMENUE = 'div[class*="top-[calc(100%+12px)]"]';
const LOGO = 'a[aria-label="CarCare Center Startseite"]';

/**
 * Erwartete dritte Ebene je Karte. Bewusst getippt und nicht aus dem Katalog abgeleitet:
 * Eine Erwartung, die sich aus derselben Quelle speist wie das Geprueftе, prueft nichts.
 */
const ERWARTET = {
  'Fahrzeugaufbereitung': ['Innenaufbereitung', 'Außenaufbereitung', 'Leasingrückgabe'],
  'Unfall & Lack': ['Neu- und Reparaturlackierung', 'Smart Repair', 'Dellenentfernung', 'Hagelschadenreparatur'],
  // „&“ statt „/“ seit dem Lektorat L01 (2026-10-07, `data/services.ts`); hier erst am 2026-10-17 nachgezogen, bis dahin
  // meldete `npm run nav` diese Karte als Abweichung (der Check laeuft nicht im Build mit).
  'Rad & Glas': ['Felgenreparatur', 'Autoglas & Scheibenfolien'],
  'Geschäftskunden': ['Fuhrparkservice'],
};

/** Alle `href` aus dem Katalogblock von `data/services.ts` — ohne die Datei zu laden. */
const katalogRouten = () => {
  const text = fs.readFileSync(path.join(wurzel, 'data', 'services.ts'), 'utf8');
  const start = text.indexOf('export const serviceCatalog');
  const ende = text.indexOf('\nexport interface ServiceGroup', start);
  if (start === -1 || ende === -1) throw new Error('serviceCatalog in data/services.ts nicht abgrenzbar');
  return [...text.slice(start, ende).matchAll(/^\s*href: '([^']+)',/gm)].map((m) => m[1]);
};

const befunde = [];
const pruefe = (name, ok, detail = '') => {
  befunde.push({ name, ok });
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ' — ' + detail : ''}`);
};

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------------------
// MOBILES MENUE UND LOGO (R34, 2026-10-19). Aufbau und Grenzen im Kopf dieser Datei.
// ------------------------------------------------------------------------------

/**
 * Fenster fuer das Menue: niedrige Telefone zuerst, dazu Maus im schmalen Fenster und 1024 px (Menue ohne Leiste).
 * `schrift`: groessere Grundschrift (Android „Textgroesse“, Chrome „Schriftgroesse“). Die Knopfleiste waechst damit
 * (Abstaende in rem), bei 20 px auf 95 px; ein fester Abzug fuer die Leiste liess das Menue dort 2 px ueber ihr enden.
 */
const FENSTER_MENUE = [
  { name: '393 × 659 Touch', width: 393, height: 659, touch: true },
  { name: '393 × 659 Touch, Grundschrift 20 px', width: 393, height: 659, touch: true, schrift: 20 },
  { name: '360 × 560 Touch', width: 360, height: 560, touch: true },
  { name: '390 × 844 Touch', width: 390, height: 844, touch: true },
  { name: '393 × 659 Maus', width: 393, height: 659, touch: false },
  { name: '1024 × 700 Maus', width: 1024, height: 700, touch: false },
];

/** Logo-Klick: Startseite unten, mit Anker, mit offenem Menue; Unterseiten mit offenem Menue; Desktop. */
const LOGO_FAELLE = [
  { name: '/ bei 2500 px, Touch', start: '/', y: 2500, fenster: FENSTER_MENUE[3] },
  { name: '/#faq, Touch', start: '/#faq', y: null, fenster: FENSTER_MENUE[3] },
  { name: '/ bei 2500 px, Menue offen, Touch', start: '/', y: 2500, fenster: FENSTER_MENUE[0], menue: true },
  { name: '/karriere bei 1500 px, Menue offen, Touch', start: '/karriere', y: 1500, fenster: FENSTER_MENUE[0], menue: true },
  { name: '/kontakt bei 900 px, Menue offen, Maus', start: '/kontakt', y: 900, fenster: FENSTER_MENUE[4], menue: true },
  { name: '/ bei 3000 px, Desktop', start: '/', y: 3000, fenster: { width: 1440, height: 900, touch: false } },
  { name: '/ueber-uns bei 1200 px, Desktop', start: '/ueber-uns', y: 1200, fenster: { width: 1440, height: 900, touch: false } },
];

const neueSeite = async (browser, f) => {
  const s = await browser.newPage();
  await s.evaluateOnNewDocument((schrift) => {
    window.__CC_NO_PRELOADER__ = true;
    if (schrift) document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = `${schrift}px`; });
  }, f.schrift ?? 0);
  await s.setViewport({ width: f.width, height: f.height, deviceScaleFactor: 2, isMobile: f.touch && f.width < 768, hasTouch: f.touch });
  return s;
};

/** Hamburger antippen bzw. anklicken; `false`, wenn er nicht zu finden ist. */
const hamburger = async (s, f, beschriftung) => {
  const knopf = await s.$(`button[aria-label="${beschriftung}"]`);
  if (!knopf) return false;
  if (f.touch) await knopf.tap(); else await knopf.click();
  await warte(700);
  return true;
};

/**
 * Lage des offenen Menues. „Frei unten“ ist die Oberkante der Knopfleiste oder der Fensterrand. Sichtbar heisst: ganz
 * im Scrollbehaelter UND ueber `frei unten`; treffbar: Treffertest am Element liefert das Element selbst.
 */
const menueLage = (s) =>
  s.evaluate((sel) => {
    const menue = document.querySelector(sel);
    const leiste = document.querySelector('[data-feste-leiste="unten"]');
    const lr = leiste?.getBoundingClientRect();
    const leisteDa = !!lr && lr.height > 0 && lr.top < innerHeight;
    const lage = {
      offen: !!menue,
      scrollY: Math.round(window.scrollY),
      gesperrt: document.documentElement.classList.contains('lenis-stopped') || document.body.style.overflow === 'hidden',
      leisteDa,
      freiUnten: leisteDa ? Math.round(lr.top) : innerHeight,
    };
    if (!menue) return lage;
    const r = menue.getBoundingClientRect();
    const scroller = [menue, ...menue.querySelectorAll('*')].find((el) => ['auto', 'scroll'].includes(getComputedStyle(el).overflowY));
    const sr = (scroller ?? menue).getBoundingClientRect();
    const oben = Math.max(sr.top, r.top);
    const unten = Math.min(sr.bottom, r.bottom, lage.freiUnten);
    const pruefen = (el) => {
      if (!el) return { da: false, sichtbar: false, treffbar: false };
      const e = el.getBoundingClientRect();
      const sichtbar = e.top >= oben - 1 && e.bottom <= unten + 1 && e.height > 0;
      const hit = sichtbar ? document.elementFromPoint(e.left + Math.min(e.width / 2, 20), e.top + e.height / 2) : null;
      return { da: true, sichtbar, treffbar: !!hit && (hit === el || el.contains(hit)) };
    };
    const links = [...menue.querySelectorAll('a')];
    return {
      ...lage,
      menueUnten: Math.round(r.bottom),
      sichtOben: Math.round(oben),
      sichtUnten: Math.round(unten),
      mitte: { x: Math.round(r.left + r.width / 2), y: Math.round((oben + unten) / 2) },
      daneben: { x: Math.max(4, Math.round(r.left / 2)), y: Math.round((oben + unten) / 2) },
      scrollTop: scroller ? Math.round(scroller.scrollTop) : 0,
      scrollMax: scroller ? scroller.scrollHeight - scroller.clientHeight : 0,
      punkte: [...menue.querySelectorAll('nav > div')].map((d) => d.querySelector(':scope > a, :scope > div > span')?.textContent.trim() ?? ''),
      karriere: pruefen(links.find((a) => a.getAttribute('href') === '/karriere')),
      letzter: pruefen(links[links.length - 1]),
      letzterText: links[links.length - 1]?.textContent.trim().slice(0, 40) ?? '',
    };
  }, MOBILMENUE);

/** Eine Eingabe Richtung Menueende: Wischen nach oben, Rad 300 px oder „Trackpad“ (viele kleine Schritte). */
const eingabe = async (s, art, punkt, l) => {
  if (art === 'Finger') {
    const y0 = l.sichtUnten - 30;
    const y1 = Math.max(l.sichtOben + 20, y0 - 260);
    await s.touchscreen.touchStart(punkt.x, y0);
    for (let i = 1; i <= 14; i++) {
      await s.touchscreen.touchMove(punkt.x, y0 + ((y1 - y0) * i) / 14);
      await warte(16);
    }
    await s.touchscreen.touchEnd();
  } else {
    await s.mouse.move(punkt.x, punkt.y);
    if (art === 'Mausrad') await s.mouse.wheel({ deltaY: 300 });
    else for (let i = 0; i < 20; i++) { await s.mouse.wheel({ deltaY: 15 }); await warte(8); }
  }
  await warte(art === 'Finger' ? 700 : 350);
};

async function pruefeMobilmenue(browser, basis, f, desktopPunkte) {
  const s = await neueSeite(browser, f);
  try {
    await s.goto(`${basis}/leistungen`, { waitUntil: 'networkidle2' });
    await s.evaluate(() => window.scrollTo(0, 600));
    await warte(400);
    if (!(await hamburger(s, f, 'Menü öffnen'))) {
      pruefe(`Menue ${f.name}: Hamburger vorhanden`, false);
      return;
    }
    const start = await menueLage(s);
    if (!start.offen) {
      pruefe(`Menue ${f.name}: oeffnet`, false);
      return;
    }
    const seiteVorher = start.scrollY;
    pruefe(
      `Menue ${f.name}: Hauptpunkte wie am Desktop, mit Karriere`,
      start.karriere.da && JSON.stringify(start.punkte) === JSON.stringify(desktopPunkte),
      start.punkte.join(' · ')
    );
    if (f.width < 1024) pruefe(`Menue ${f.name}: Knopfleiste gefunden`, start.leisteDa, 'data-feste-leiste="unten"');
    pruefe(`Menue ${f.name}: endet ueber der Knopfleiste bzw. im Fenster`, start.menueUnten <= start.freiUnten, `Unterkante ${start.menueUnten}, frei bis ${start.freiUnten}`);

    for (const art of f.touch ? ['Finger'] : ['Mausrad', 'Trackpad']) {
      await s.evaluate((sel) => {
        const m = document.querySelector(sel);
        const sc = m && [m, ...m.querySelectorAll('*')].find((el) => ['auto', 'scroll'].includes(getComputedStyle(el).overflowY));
        if (sc) sc.scrollTop = 0;
      }, MOBILMENUE);
      await warte(200);
      let l = await menueLage(s);
      let karriereGesehen = l.karriere.sichtbar && l.karriere.treffbar;
      for (let i = 0; i < 14 && !(l.scrollMax > 0 && l.scrollTop >= l.scrollMax - 1); i++) {
        await eingabe(s, art, l.mitte, l);
        l = await menueLage(s);
        karriereGesehen ||= l.karriere.sichtbar && l.karriere.treffbar;
      }
      pruefe(`Menue ${f.name}, ${art}: „Karriere“ sichtbar und treffbar`, karriereGesehen);
      pruefe(
        `Menue ${f.name}, ${art}: bis zum letzten Link`,
        l.letzter.sichtbar && l.letzter.treffbar,
        `„${l.letzterText}“, gescrollt ${l.scrollTop}/${l.scrollMax}`
      );
      pruefe(`Menue ${f.name}, ${art}: Seite dahinter bleibt`, l.scrollY === seiteVorher, `${seiteVorher} → ${l.scrollY}`);
    }

    // Neben dem Menue (Seitenstreifen): Die Seite darf sich auch dort nicht bewegen.
    const l = await menueLage(s);
    if (f.touch) {
      await s.touchscreen.touchStart(l.daneben.x, l.daneben.y + 100);
      for (let i = 1; i <= 14; i++) { await s.touchscreen.touchMove(l.daneben.x, l.daneben.y + 100 - i * 18); await warte(16); }
      await s.touchscreen.touchEnd();
    } else {
      await s.mouse.move(l.daneben.x, l.daneben.y);
      for (let i = 0; i < 3; i++) { await s.mouse.wheel({ deltaY: 300 }); await warte(100); }
    }
    await warte(800);
    const daneben = await menueLage(s);
    pruefe(`Menue ${f.name}: Seite bleibt auch neben dem Menue`, daneben.scrollY === seiteVorher, `${seiteVorher} → ${daneben.scrollY}`);
    await s.screenshot({
      path: path.join(AUS, `mobil-menue-ende-${f.width}x${f.height}-${f.touch ? 'touch' : 'maus'}${f.schrift ? `-schrift${f.schrift}` : ''}.png`),
    });

    await hamburger(s, f, 'Menü schließen');
    const zu = await menueLage(s);
    pruefe(`Menue ${f.name}: nach dem Schliessen ist die Seite frei`, !zu.offen && !zu.gesperrt);
  } finally {
    await s.close();
  }
}

async function pruefeLogo(browser, basis, fall) {
  const f = fall.fenster;
  const s = await neueSeite(browser, f);
  try {
    await s.goto(`${basis}${fall.start}`, { waitUntil: 'networkidle2' });
    await warte(400);
    if (fall.y !== null) {
      await s.evaluate((y) => window.scrollTo(0, y), fall.y);
      await warte(400);
    }
    if (fall.menue) await hamburger(s, f, 'Menü öffnen');
    const vorher = Math.round(await s.evaluate(() => window.scrollY));
    const punkt = await s.$$eval(LOGO, (els) => {
      const a = els.find((x) => x.getBoundingClientRect().width > 0);
      const r = a.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    if (f.touch) await s.touchscreen.tap(punkt.x, punkt.y); else await s.mouse.click(punkt.x, punkt.y);
    // Ziel: Startseite, ganz oben, Menue zu, und die Sperre des Menues (Lenis, `body`) wieder frei.
    const amZiel = (z) => z.pfad === '/' && z.y === 0 && !z.menue && !z.gesperrt;
    let stand = null;
    for (let i = 0; i < 30; i++) {
      await warte(100);
      stand = await s.evaluate(
        (sel) => ({
          pfad: location.pathname + location.hash,
          y: Math.round(window.scrollY),
          menue: !!document.querySelector(sel),
          gesperrt: document.documentElement.classList.contains('lenis-stopped') || document.body.style.overflow === 'hidden',
        }),
        MOBILMENUE
      );
      if (amZiel(stand)) break;
    }
    pruefe(
      `Logo ${fall.name}: Startseite, oben${fall.menue ? ', Menue zu' : ''}`,
      amZiel(stand),
      `${fall.start} bei ${vorher} → ${stand.pfad} bei ${stand.y}${stand.menue ? ', Menue offen' : ''}${stand.gesperrt ? ', Seite gesperrt' : ''}`
    );
  } finally {
    await s.close();
  }
}

let stopp = () => {};
let basis = basisArg;
if (!basis) {
  if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
    console.error('[nav] dist/ fehlt — bitte zuerst `npm run build`, oder --basis <url> angeben.');
    process.exit(1);
  }
  ({ basis, stopp } = await startePreview(4185));
}

fs.mkdirSync(AUS, { recursive: true });
console.log(`[nav] Basis: ${basis}\n`);

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
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--force-prefers-no-reduced-motion'] });
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => { window.__CC_NO_PRELOADER__ = true; });

try {
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(basis, { waitUntil: 'networkidle2' });

  // Reihenfolge der Hauptpunkte am Desktop (linke, dann rechte Haelfte): Massstab fuer das mobile Menue (R34).
  const desktopPunkte = await page.$$eval('nav[aria-label^="Hauptnavigation"] > div > a', (els) =>
    els.map((a) => a.textContent.trim())
  );

  // --- Desktop: Hover oeffnet das Panel ---------------------------------------
  await page.hover(TRIGGER);
  await page.waitForSelector(PANEL, { visible: true, timeout: 4000 }).catch(() => {});
  pruefe('Hover auf „Leistungen" oeffnet das Mega-Menue', !!(await page.$(PANEL)));

  const karten = await page.$$eval(KARTE, (els) => els.map((a) => a.innerText.split('\n')[0]));
  pruefe('Vier Karten', karten.length === 4, karten.join(' | '));

  // --- Desktop: dritte Ebene je Karte -----------------------------------------
  const gesehen = new Set();
  for (let i = 0; i < karten.length; i++) {
    const griffe = await page.$$(KARTE);
    await griffe[i].hover();
    await warte(340);
    const stand = await page.evaluate(
      (sel, idx) => {
        const a = document.querySelectorAll(sel)[idx];
        const id = a.getAttribute('aria-controls');
        const sub = id ? document.getElementById(id) : null;
        return {
          expanded: a.getAttribute('aria-expanded'),
          hoehe: sub ? Math.round(sub.getBoundingClientRect().height) : 0,
          kinder: sub ? [...sub.querySelectorAll('a')].map((x) => x.textContent.trim()) : [],
          hrefs: sub ? [...sub.querySelectorAll('a')].map((x) => x.getAttribute('href')) : [],
          eigenerHref: a.getAttribute('href'),
        };
      },
      KARTE,
      i
    );
    gesehen.add(stand.eigenerHref);
    stand.hrefs.forEach((h) => gesehen.add(h));

    const soll = ERWARTET[karten[i]] ?? null;
    const passt =
      soll !== null &&
      stand.expanded === 'true' &&
      stand.hoehe > 8 &&
      JSON.stringify(stand.kinder) === JSON.stringify(soll);
    pruefe(`Ebene 3 bei „${karten[i]}"`, passt, stand.kinder.join(', ') || 'keine Kinder');

    if (i === 0) await page.screenshot({ path: path.join(AUS, 'desktop-ebene3-aufbereitung.png') });
    if (i === 2) await page.screenshot({ path: path.join(AUS, 'desktop-ebene3-rad-glas.png') });
  }

  const offen = await page.$$eval(KARTE, (els) => els.filter((a) => a.getAttribute('aria-expanded') === 'true').length);
  pruefe('Nur eine Ebene gleichzeitig offen', offen === 1, `${offen} offen`);

  // --- Kein Katalogeintrag faellt aus der Navigation ---------------------------
  const fehlend = katalogRouten().filter((h) => !gesehen.has(h));
  pruefe(
    'Jede Leistung aus dem Katalog ist im Menue erreichbar',
    fehlend.length === 0,
    fehlend.length ? `fehlt: ${fehlend.join(', ')}` : `${gesehen.size} Ziele`
  );

  // --- Zielgruppen-Zeile -------------------------------------------------------
  const fuerWen = await page.$$eval(`${PANEL} a`, (els) =>
    els.map((a) => a.textContent.trim()).filter((t) => t === 'Privatkunden' || t === 'Geschäftskunden')
  );
  pruefe('Zielgruppen-Zeile vorhanden', fuerWen.includes('Privatkunden'), fuerWen.join(', '));

  // --- Tastatur ----------------------------------------------------------------
  await page.mouse.move(0, 700);
  await warte(400);
  await page.focus(TRIGGER);
  await warte(320);
  pruefe('Fokus auf dem Trigger oeffnet das Menue', !!(await page.$(PANEL)));

  await page.keyboard.press('Tab');
  await warte(340);
  const nachTab = await page.evaluate((sel) => {
    const panel = document.querySelector(sel);
    const a = document.activeElement;
    return {
      offen: !!panel,
      drin: panel ? panel.contains(a) : false,
      ziel: a?.getAttribute?.('href') ?? null,
      expanded: a?.getAttribute?.('aria-expanded') ?? null,
    };
  }, PANEL);
  pruefe('Tab traegt den Fokus ins Panel, Menue bleibt offen', nachTab.offen && nachTab.drin, `Ziel ${nachTab.ziel}`);
  pruefe('Fokus oeffnet die dritte Ebene', nachTab.expanded === 'true');
  await page.screenshot({ path: path.join(AUS, 'desktop-tastatur-fokus.png') });

  await page.keyboard.press('Escape');
  await warte(280);
  const nachEsc = await page.$$eval(KARTE, (els) => els.filter((a) => a.getAttribute('aria-expanded') === 'true').length).catch(() => -1);
  pruefe('Escape schliesst zuerst die dritte Ebene', nachEsc === 0, `offen: ${nachEsc}`);

  // --- Mobil -------------------------------------------------------------------
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(basis, { waitUntil: 'networkidle2' });
  await page.click('button[aria-label="Menü öffnen"]');
  await warte(600);
  /**
   * NUR im Menuecontainer suchen, nicht in der ganzen Seite.
   *
   * Die erste Fassung fragte `document.querySelectorAll('a')` ab und meldete Gruen,
   * waehrend das Menue nachweislich zu war: „Felgenreparatur" und „Privatkunden" stehen
   * auch in der Kachelreihe der Startseite. Der Bildschirmfoto-Beleg hat den Fehlalarm
   * aufgedeckt — genau dafuer wird er mitgeschrieben.
   */
  const mobilOffen = !!(await page.$(MOBILMENUE));
  pruefe('Mobil: Hamburger oeffnet das Menue', mobilOffen);

  const mobil = mobilOffen
    ? await page.$eval(MOBILMENUE, (box) => {
        const t = [...box.querySelectorAll('a')].map((a) => a.textContent.trim());
        return {
          innen: t.some((x) => x.startsWith('Innenaufbereitung')),
          felgen: t.some((x) => x.startsWith('Felgenreparatur')),
          privat: t.some((x) => x === 'Privatkunden'),
          anzahl: t.length,
        };
      })
    : { innen: false, felgen: false, privat: false, anzahl: 0 };
  pruefe(
    'Mobil: Unterebene ohne Geste sichtbar',
    mobil.innen && mobil.felgen,
    `${mobil.anzahl} Links im Menue, Innen ${mobil.innen}, Felgen ${mobil.felgen}`
  );
  pruefe('Mobil: Zielgruppen-Zeile vorhanden', mobil.privat);
  await page.screenshot({ path: path.join(AUS, 'mobil-menue.png') });

  // --- Mobil: Menue scrollt, Karriere erreichbar, Seite bleibt (R34) -----------
  for (const fenster of FENSTER_MENUE) await pruefeMobilmenue(browser, basis, fenster, desktopPunkte);

  // --- Logo fuehrt immer zur Startseite, oben (R34) ----------------------------
  for (const fall of LOGO_FAELLE) await pruefeLogo(browser, basis, fall);
} finally {
  await browser.close();
  stopp();
}

const fehl = befunde.filter((b) => !b.ok).length;
console.log(`\n[nav] ${befunde.length - fehl}/${befunde.length} bestanden. Bilder: ${path.relative(wurzel, AUS)}/`);
if (fehl) {
  // Laeuft nicht im Build mit (kein Abbruch dort), Exit 1 fuer Aufrufer und Skripte.
  console.error('[nav] FEHLER: Navigation stimmt nicht (Leistungskatalog, mobiles Menue oder Logo, siehe ✗ oben).');
  process.exit(1);
}
