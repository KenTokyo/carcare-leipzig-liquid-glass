// Schwebende Knoepfe „Anrufen" und „Schaden melden" (`components/SchwebendeAktionen.tsx`):
// Liegen sie irgendwo DAUERHAFT ueber Text oder Bedienelementen der Seite?
//
// AUFRUF:
//   npm run schwebend                      alle Routen, drei Fenster
//   npm run schwebend -- /karriere /       nur diese Routen
//   (unter Git Bash `MSYS_NO_PATHCONV=1` davor — sonst kommt `/karriere` als
//    `C:/Program Files/Git/karriere` an, dieselbe Falle wie bei `npm run shots`)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// WAS GEMESSEN WIRD: Jede Route wird in Schritten einer halben Fensterhoehe durchgescrollt. An
// jeder Position, an der die Knoepfe sichtbar sind (nicht `inert`), wird gesammelt, welche
// Textstellen und Bedienelemente unter ihnen OBEN liegen — per `elementsFromPoint`, nicht nur
// geometrisch; was hinter einer anderen Flaeche liegt, zaehlt nicht.
//
// DAUERHAFT heisst: an zwei aufeinanderfolgenden Positionen verdeckt UND nicht mitbewegt (die
// Oberkante verschiebt sich um weniger als 20 px, obwohl eine halbe Fensterhoehe gescrollt
// wurde). Das trifft gepinnte Flaechen (`position: sticky`) und bildschirmhohe Bereiche. Was
// unter den Knoepfen nur vorbeizieht, zaehlt nicht — das tut jeder schwebende Knopf.
// Die erste Fassung (2026-09-24) zaehlte „an zwei Positionen verdeckt" und meldete damit neun
// grosse Karten-Links, die nur vorbeiscrollten.
//
// ABHILFE BEI EINEM BEFUND: Die Flaeche mit `data-aktionen-ausweichen` markieren
// (`hooks/useAusweichzone.ts`) — aber nur, wenn sie die Ecke dauerhaft belegt UND die Aktionen
// selbst anbietet (so bei Hero und Zielgruppenstapel der Startseite). Sonst den Inhalt aus der
// rechten unteren Ecke nehmen.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. GRUEN DURCH VERSTECKEN. Wer ueberall `data-aktionen-ausweichen` setzt, bekommt 0 Befunde
//     und Knoepfe, die nie zu sehen sind. Deshalb steht je Route der Anteil der Positionen, an
//     denen sie sichtbar sind; unter 50 % gibt es einen Hinweis (kein Fehler — kurze Seiten
//     verstecken sie vor dem Footer zu Recht an vielen Positionen).
//  2. DREI FENSTER (1920 × 945, 1280 × 800, 1024 × 700). Dazwischen und darunter nicht; unter
//     1024 px sind die Knoepfe ausgeblendet (dort gilt die mobile Leiste).
//  3. SCHRITTWEITE eine halbe Fensterhoehe: Eine gepinnte Flaeche, die kuerzer steht, faellt durch.
//  4. TEXT UND BEDIENELEMENTE, keine Bilder. Ein verdecktes Motiv, Logo oder Siegel meldet sie nicht.
//  5. GESCHLOSSENE KNOEPFE. Beim Ueberfahren klappen sie nach links auf und sind breiter; dieser
//     Zustand dauert, solange die Maus darauf steht, und wird nicht geprueft.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const FENSTER = [
  [1920, 945], // Full HD, Browser maximiert (siehe CLAUDE.md: nicht 1080)
  [1280, 800],
  [1024, 700], // kleinstes Fenster mit Knoepfen (`lg`)
];
/** Oberkante darf sich um weniger bewegen, dann gilt das Element als stehend. */
const STEHT = 20;
const SICHTBAR_MINDESTENS = 0.5;

const nurRouten = process.argv.slice(2).filter((a) => a.startsWith('/'));
const routen = nurRouten.length ? nurRouten : (await getRoutes()).map((r) => r.path);

/** Im Browser: was liegt unter den Knoepfen oben auf? `null` = Knoepfe nicht sichtbar. */
const UNTER_DEN_KNOEPFEN = () => {
  const k = document.querySelector('[data-schwebende-aktionen]');
  if (!k || k.inert || getComputedStyle(k).display === 'none') return null;
  const kr = k.getBoundingClientRect();
  const r = { l: kr.left - 4, t: kr.top - 4, r: kr.right + 4, b: kr.bottom + 4 };
  const schneidet = (a) => a.left < r.r && a.right > r.l && a.top < r.b && a.bottom > r.t;
  const mitte = (a) => [
    Math.max(a.left, r.l) + (Math.min(a.right, r.r) - Math.max(a.left, r.l)) / 2,
    Math.max(a.top, r.t) + (Math.min(a.bottom, r.b) - Math.max(a.top, r.t)) / 2,
  ];
  const obenAuf = (el, [x, y]) => {
    const h = document.elementsFromPoint(x, y).find((e) => !k.contains(e));
    return Boolean(h) && (h === el || el.contains(h) || h.contains(el));
  };
  const funde = [];
  const main = document.querySelector('main');
  const gehe = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (gehe.nextNode()) {
    const t = gehe.currentNode;
    const text = t.textContent.trim();
    if (!text) continue;
    const el = t.parentElement;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.1) continue;
    const bereich = document.createRange();
    bereich.selectNodeContents(t);
    for (const rr of bereich.getClientRects()) {
      if (schneidet(rr) && obenAuf(el, mitte(rr))) {
        funde.push({ name: `Text „${text.slice(0, 48)}"`, oben: Math.round(el.getBoundingClientRect().top) });
        break;
      }
    }
  }
  for (const el of main.querySelectorAll('a[href], button, input, select, textarea')) {
    const er = el.getBoundingClientRect();
    if (!er.width || !schneidet(er) || !obenAuf(el, mitte(er))) continue;
    const name = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ');
    funde.push({ name: `${el.tagName.toLowerCase()} „${name.slice(0, 48)}"`, oben: Math.round(er.top) });
  }
  return funde;
};

const { basis, stopp } = await startePreview(4193);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let befunde = 0;
let hinweise = 0;

try {
  for (const [b, h] of FENSTER) {
    const seite = await browser.newPage();
    await seite.setViewport({ width: b, height: h, deviceScaleFactor: 1 });
    await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    await seite.evaluateOnNewDocument(HALTE_SCROLL);
    console.log(`\n${b} × ${h}`);
    for (const route of routen) {
      await seite.goto(basis + route, { waitUntil: 'networkidle0' });
      const weg = await seite.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      let vorige = new Map();
      const dauerhaft = new Map();
      let positionen = 0;
      let sichtbar = 0;
      for (let y = 0; y <= weg; y += Math.round(h / 2)) {
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        // Gepinnte Flaechen brauchen ein, zwei Bilder; `inert` setzt React sofort.
        await warte(160);
        const funde = await seite.evaluate(UNTER_DEN_KNOEPFEN);
        positionen++;
        const jetzt = new Map();
        if (funde) {
          sichtbar++;
          for (const f of funde) jetzt.set(f.name, f.oben);
          for (const [name, oben] of jetzt) {
            if (vorige.has(name) && Math.abs(vorige.get(name) - oben) < STEHT) {
              dauerhaft.set(name, (dauerhaft.get(name) ?? 1) + 1);
            }
          }
        }
        vorige = jetzt;
        await seite.evaluate(() => window.__ccLoslassen());
      }
      const anteil = positionen ? sichtbar / positionen : 0;
      const zeichen = dauerhaft.size ? '✗' : anteil < SICHTBAR_MINDESTENS ? '⚠' : '✓';
      console.log(`  ${zeichen} ${route.padEnd(52)} sichtbar an ${String(Math.round(anteil * 100)).padStart(3)} % von ${positionen} Positionen`);
      for (const [name, n] of dauerhaft) console.log(`      → ${name} liegt an ${n} Positionen fest darunter`);
      befunde += dauerhaft.size;
      if (!dauerhaft.size && anteil < SICHTBAR_MINDESTENS) hinweise++;
    }
    await seite.close();
  }
} finally {
  await browser.close();
  stopp();
}

console.log(
  befunde
    ? `\n✗ ${befunde} dauerhafte Ueberdeckung(en)`
    : `\n✓ Keine dauerhafte Ueberdeckung — ${routen.length} Routen × ${FENSTER.length} Fenster`
      + (hinweise ? ` (${hinweise} Route(n) mit Knoepfen an weniger als der Haelfte der Positionen, siehe ⚠)` : '')
);
process.exit(befunde ? 1 : 0);
