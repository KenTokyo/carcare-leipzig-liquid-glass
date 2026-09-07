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
//     ablegt — die bewertet ein Mensch.
//  4. Sie laeuft mit `--force-prefers-no-reduced-motion`, also mit BEWEGUNG EIN. Ein
//     Fehler, der nur bei reduzierter Bewegung auftritt, kommt hier durch.
//     (Diese Zeile stand bis 2026-09-07 andersherum da: „Headless meldet KEIN
//     prefers-reduced-motion". Das ist falsch — headless meldet es von sich aus. Ohne
//     den Schalter lief die Pruefung also genau in der Fassung, von der sie behauptete,
//     sie laufe nicht darin.)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUS = path.join(wurzel, 'output', 'nav-shots');

const args = process.argv.slice(2);
const basisArg = args.includes('--basis') ? args[args.indexOf('--basis') + 1] : null;

const TRIGGER = 'nav[aria-label^="Hauptnavigation"] a[href="/leistungen"]';
const PANEL = 'div[class*="top-[calc(100%+14px)]"]';
const KARTE = `${PANEL} a[aria-haspopup="true"]`;

/**
 * Erwartete dritte Ebene je Karte. Bewusst getippt und nicht aus dem Katalog abgeleitet:
 * Eine Erwartung, die sich aus derselben Quelle speist wie das Geprueftе, prueft nichts.
 */
const ERWARTET = {
  'Fahrzeugaufbereitung': ['Innenaufbereitung', 'Außenaufbereitung', 'Leasingrückgabe'],
  'Unfall & Lack': ['Neu- und Reparaturlackierung', 'Smart Repair', 'Dellenentfernung', 'Hagelschadenreparatur'],
  'Rad & Glas': ['Felgenreparatur', 'Autoglas / Scheibenfolien'],
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
  const MOBILMENUE = 'div[class*="top-[calc(100%+12px)]"]';
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
} finally {
  await browser.close();
  stopp();
}

const fehl = befunde.filter((b) => !b.ok).length;
console.log(`\n[nav] ${befunde.length - fehl}/${befunde.length} bestanden. Bilder: output/nav-shots/`);
if (fehl) {
  console.error('[nav] BUILD ABGEBROCHEN — Navigation stimmt nicht mit dem Leistungskatalog ueberein.');
  process.exit(1);
}
