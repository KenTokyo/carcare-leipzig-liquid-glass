// Aktions-Aussparung oben rechts („Anrufen", „Schaden melden", `components/AktionsAussparung.tsx`):
// Liegt irgendwo DAUERHAFT Text oder ein Bedienelement der Seite darunter?
//
// AUFRUF:
//   npm run aussparung                     alle Routen, drei Fenster
//   npm run aussparung -- /karriere /      nur diese Routen
//   npm run aussparung -- --gegenprobe     PRUEFT DEN PRUEFER: spielt vier bekannte Fehler per CSS
//                                          ein und verlangt, dass jeder gemeldet wird (Exit 1 sonst)
//   (unter Git Bash `MSYS_NO_PATHCONV=1` davor — sonst kommt `/karriere` als
//    `C:/Program Files/Git/karriere` an, dieselbe Falle wie bei `npm run shots`)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// GESCHICHTE: Am 2026-09-24 als `npm run schwebend` fuer zwei schwebende Knoepfe UNTEN rechts
// entstanden — die erste Fassung dort verdeckte die Versichererliste. Am selben Tag wanderten
// die Knoepfe in die Aussparung OBEN rechts (Wunsch des Users); die Frage bleibt dieselbe.
// Oben rechts ist die Gefahr kleiner — die Aussparung liegt im 100-px-Band der Navbar, in dem
// kein Inhalt stehen bleibt —, aber nicht null: Alles, was mit `position: sticky` HOEHER als
// die Navbar gepinnt wird, stuende rechts dauerhaft darunter.
//
// WAS GEMESSEN WIRD: Jede Route wird in Schritten einer halben Fensterhoehe durchgescrollt. An
// jeder Position wird gesammelt, welche Textstellen und Bedienelemente unter der Aussparung
// OBEN liegen — per `elementsFromPoint`, nicht nur geometrisch; was hinter einer anderen
// Flaeche liegt, zaehlt nicht.
//
// DAUERHAFT heisst: an zwei aufeinanderfolgenden Positionen verdeckt UND nicht mitbewegt (die
// Oberkante verschiebt sich um weniger als 20 px, obwohl eine halbe Fensterhoehe gescrollt
// wurde). Das trifft gepinnte Flaechen. Was nur darunter vorbeizieht, zaehlt nicht — das tut
// jeder Inhalt unter der Navbar. Die erste Fassung zaehlte „an zwei Positionen verdeckt" und
// meldete neun grosse Karten-Links, die nur vorbeiscrollten.
//
// ABHILFE BEI EINEM BEFUND: Die gepinnte Flaeche unter die Navbar-Hoehe setzen (Muster: die
// CSS-Variable `--nav` in den Zielgruppenkarten, 5,35 rem mobil / 6,75 rem ab `md`).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. GRUEN DURCH VERSTECKEN. Ist die Aussparung ausgeblendet, gibt es nichts zu verdecken. Deshalb
//     steht je Route der Anteil der Positionen, an denen sie sichtbar ist; unter 50 % ein Hinweis.
//     Seit sie immer steht, muss dort 100 % stehen — alles andere ist ein Befund fuer sich.
//  2. DREI FENSTER (1920 × 945, 1280 × 800, 1024 × 700). Dazwischen und darunter nicht; unter
//     1024 px gibt es keine Aussparung (dort gilt die Leiste unten).
//  3. SCHRITTWEITE eine halbe Fensterhoehe: Eine gepinnte Flaeche, die kuerzer steht, faellt durch.
//  4. TEXT UND BEDIENELEMENTE, keine Bilder. Ein verdecktes Motiv, Logo oder Siegel meldet sie nicht.
//  5. DIE HINWEISE UNTER DEN KNOEPFEN (beim Ueberfahren) prueft sie nicht — sie stehen nur, solange
//     die Maus darauf ist.
//  6. (behoben) DIE AUSSPARUNG SELBST. Bis zur zweiten Fassung prueften wir nur, was UNTER ihr liegt.
//     Dass ihr rechter Knopf um 15 px angeschnitten war (der weisse Schatten des konkaven Uebergangs
//     `::after` lag darueber), meldete die Pruefung gruen — gesehen hat es erst ein Bildschirmfoto.
//     Seitdem: PIXELPROBE je Pille (heute als Differenzprobe, Falle 8). Ein Treffertest
//     (`elementFromPoint`) haette es NICHT gefunden: Schatten nehmen am Treffertest nicht teil, der
//     Knopf galt als „oben", obwohl Weiss ueber ihm gemalt war. Die Gegenprobe auf dem alten Stand
//     hat genau das gezeigt, bevor die Pixelprobe kam.
//  7. (behoben 2026-09-24, dritte Runde) DIE PROBE MASS EINE HALB EINGEBLENDETE PILLE. Die Pillen
//     blenden beim Laden ein. Puppeteers `screenshot({ clip })` vergroessert zum Aufnehmen kurz das
//     Fenster (`captureBeyondViewport`) — das startete den Eintritt NEU, die Probe sah eine fast
//     durchsichtige Pille und haette Weiss gemeldet, wo keins ist. Jetzt: erst warten, bis die
//     endlichen Animationen der Aussparung durch sind, dann ohne Vergroessern aufnehmen.
//  8. HELLE PILLEN — AUS DER FARBPROBE WURDE EINE DIFFERENZPROBE. Die Probe verlangte erst „dunkel
//     am Rand", dann „mindestens 20 Stufen unter Weiss" (Eisblau, Glas mit Vignette: 37–89 Stufen).
//     Das neutrale Liquid Glass (2026-09-25) liegt auf der weissen Aussparung nur 4–9 Stufen unter
//     Weiss, ein darueber gemalter weisser Schatten aenderte es um ~8 — keine feste Farbschwelle
//     trennt das. Jetzt: jede Pille zweimal aufnehmen, wie ausgeliefert und mit ausgeblendeten
//     Uebergaengen. GEMESSEN (1024/1440/1920): richtig 0 px Unterschied, sporadisch bis 56 px
//     Rasterrauschen im Hoerer-Symbol (tritt auch zwischen zwei gleichen Aufnahmen auf);
//     eingespielter z-Index-Fehler 397–583 px. Schwelle 150 px.
//     Das Glas ist oben rechts seit 2026-09-25 wieder zurueckgenommen (nur noch mobile Leiste); die
//     Differenzprobe bleibt — sie haengt nicht von der Pillenfarbe ab, die Farbproben davor schon.
//     ⚠️ Was sie NICHT sieht: Etwas anderes als die beiden Uebergaenge, das ueber der Pille liegt.
//
// GEOMETRIE (seit der dritten Runde, 2026-09-24): Die Pillen tragen jetzt Beschriftungen, und
// die brauchen Platz neben dem Navbar-Reiter. Je Fensterbreite (23 Stueck, alle Spannengrenzen
// 1279/1280, 1439/1440, 1535/1536, 1595/1596 dabei) wird auf `/` geprueft:
//   - Luecke zwischen den konkaven Uebergaengen von Reiter und Aussparung >= 20 px
//   - jede Pille liegt in der Aussparung, ihre Beschriftung ist sichtbar und nicht abgeschnitten
//   - der sichtbare Text steht in der Ansage (`aria-label`, WCAG 2.5.3 „Label in Name")
//   - die Navbar-Links liegen mit >= 12 px Rand im Reiter (sie ruecken dafuer 1280–1535 zusammen)
// ⚠️ WAS DIE GEOMETRIE BESTEHT, OHNE DASS ES STIMMT: Sie misst Lage, nicht Lesbarkeit (Kontrast:
// `npm run kontrast`, dort nur 1440) und nicht Verstaendlichkeit. Sie prueft mit der echten Schrift;
// faellt die Webschrift beim Besucher aus, ist die Ersatzschrift breiter oder schmaler. Zwischen den
// 23 Breiten misst sie nicht — die Breiten folgen aber `clamp()`-Geraden, deren Extreme an den
// Spannengrenzen liegen, und die sind alle dabei.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));

const FENSTER = [
  [1920, 945], // Full HD, Browser maximiert (siehe CLAUDE.md: nicht 1080)
  [1280, 800],
  [1024, 700], // kleinstes Fenster mit Aussparung (`lg`)
];
/** Oberkante darf sich um weniger bewegen, dann gilt das Element als stehend. */
const STEHT = 20;
const SICHTBAR_MINDESTENS = 0.5;
/** Geometrie der Aussparung neben dem Reiter — Breiten siehe Kopf. */
const GEOMETRIE_BREITEN = [
  1024, 1100, 1152, 1200, 1279, 1280, 1300, 1366, 1380, 1400, 1439, 1440, 1500, 1535, 1536, 1566, 1595, 1596,
  1600, 1680, 1800, 1920, 2560,
];
const LUECKE_MIN = 20;
const RAND_LINKS_MIN = 12;

/**
 * GEGENPROBE: Fehler, die es schon gab oder die beim naechsten Umbau naheliegen — je einer per CSS
 * eingespielt. Wird einer NICHT gemeldet, ist die Pruefung an dieser Stelle blind geworden.
 */
const GEGENPROBEN = {
  'Pillen ohne z-Index — Schatten des Uebergangs liegt darueber (der Fehler vom 2026-09-24)':
    '.cc-aussparung .cc-aktion { z-index: auto !important; }',
  'Reiter zu breit — Luecke zwischen den Uebergaengen unter 20 px': ':root { --cc-nav-width: 1060px !important; }',
  'Beschriftung abgeschnitten': '.cc-aktion__rolle { max-width: 3em !important; }',
  'Navbar-Links ragen an den Reiterrand': ':root { --cc-nav-einzug: 190px !important; }',
};

const nurRouten = process.argv.slice(2).filter((a) => a.startsWith('/'));
const routen = nurRouten.length ? nurRouten : (await getRoutes()).map((r) => r.path);

/** Im Browser: was liegt unter der Aussparung oben auf? `null` = Aussparung nicht sichtbar. */
const UNTER_DEN_KNOEPFEN = () => {
  const k = document.querySelector('[data-aktions-aussparung]');
  if (!k || getComputedStyle(k).display === 'none') return null;
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

/**
 * Endliche Animationen der Aussparung (Eintritt, Status-Puls) sofort ans Ende setzen — Falle 7.
 * Geprueft wird der Ruhezustand; Warten statt `finish()` kostete je Route bis zu 2,1 s (damals
 * wegen des Lichtstreifs ueber „Schaden melden", seit 2026-09-25 entfernt).
 */
const AUSSPARUNG_RUHIG = () => {
  for (const a of document.querySelector('[data-aktions-aussparung]')?.getAnimations({ subtree: true }) ?? []) {
    if (a.effect?.getComputedTiming().iterations !== Infinity) a.finish();
  }
};

/** Blendet die konkaven Uebergaenge der Aussparung aus — Vergleichsbild der Differenzprobe. */
const OHNE_UEBERGAENGE = '.cc-aussparung::before, .cc-aussparung::after { display: none !important; }';
/** Ab so vielen abweichenden Pixeln (je Kanal > 3) liegt etwas ueber der Pille — Falle 8. */
const DIFFERENZ_MIN_PX = 150;

/**
 * DIFFERENZPROBE je Pille (Falle 8): einmal aufnehmen wie ausgeliefert, einmal mit ausgeblendeten
 * Uebergaengen (`::before`/`::after` der Aussparung). Liegt deren weisser Schatten UEBER der Pille,
 * unterscheiden sich die Bilder; liegt er (richtig) darunter, sind sie gleich — dort ist hinter der
 * Pille ohnehin das Weiss der Aussparung. Die Farbe der Pille spielt keine Rolle mehr.
 */
const pruefeKnoepfe = async (seite) => {
  const kaputt = [];
  await seite.evaluate(AUSSPARUNG_RUHIG);
  const knoepfe = await seite.$$('[data-aktions-aussparung] .cc-aktion');
  const aufnehmen = async () => {
    const bilder = [];
    for (const knopf of knoepfe) {
      const box = await knopf.boundingBox();
      // Falle 7: ohne Vergroessern aufnehmen, sonst startet der Eintritt neu.
      bilder.push(box && box.width >= 10
        ? await sharp(await seite.screenshot({ clip: box, type: 'png', captureBeyondViewport: false })).raw().toBuffer({ resolveWithObject: true })
        : null);
    }
    return bilder;
  };
  const zweiBilder = () => seite.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const mit = await aufnehmen();
  await seite.evaluate((css) => {
    const s = document.createElement('style');
    s.id = 'cc-probe-ohne-uebergaenge';
    s.textContent = css;
    document.head.appendChild(s);
  }, OHNE_UEBERGAENGE);
  await zweiBilder();
  const ohne = await aufnehmen();
  await seite.evaluate(() => document.getElementById('cc-probe-ohne-uebergaenge')?.remove());
  await zweiBilder();
  for (const [i, knopf] of knoepfe.entries()) {
    const a = mit[i];
    const b = ohne[i];
    if (!a || !b || a.data.length !== b.data.length) continue;
    let abweichend = 0;
    for (let p = 0; p < a.data.length; p += a.info.channels) {
      if (Math.abs(a.data[p] - b.data[p]) > 3 || Math.abs(a.data[p + 1] - b.data[p + 1]) > 3 || Math.abs(a.data[p + 2] - b.data[p + 2]) > 3) abweichend++;
    }
    if (abweichend >= DIFFERENZ_MIN_PX) {
      const name = await knopf.evaluate((el) => el.getAttribute('aria-label'));
      kaputt.push(`${name} — von den Uebergaengen der Aussparung ueberdeckt (${abweichend} px weichen ab)`);
    }
  }
  return kaputt;
};

/** Im Browser: Lage der Aussparung neben dem Reiter und ihrer Beschriftungen. */
const GEOMETRIE = ({ luckeMin, randMin }) => {
  const fehler = [];
  const aus = document.querySelector('[data-aktions-aussparung]');
  const reiter = document.querySelector('.solidroad-nav-frame');
  if (!aus || getComputedStyle(aus).display === 'none') return { fehler: ['Aussparung nicht sichtbar'] };
  const a = aus.getBoundingClientRect();
  const f = reiter.getBoundingClientRect();
  const radius = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--cc-nav-inner-radius')) || 28;
  const luecke = a.left - radius - (f.right + radius);
  if (luecke < luckeMin) fehler.push(`Luecke zwischen den Uebergaengen nur ${luecke.toFixed(1)} px`);
  if (a.right > innerWidth + 0.5 || a.top < -0.5) fehler.push('Aussparung ragt aus dem Fenster');
  for (const pille of aus.querySelectorAll('.cc-aktion')) {
    const name = pille.getAttribute('aria-label') ?? '(ohne Ansage)';
    const p = pille.getBoundingClientRect();
    if (p.left < a.left - 0.5 || p.right > a.right + 0.5 || p.top < a.top - 0.5 || p.bottom > a.bottom + 0.5) {
      fehler.push(`${name}: ragt aus der Aussparung`);
    }
    const rolle = pille.querySelector('.cc-aktion__rolle');
    const text = rolle?.querySelector('.cc-aktion__spur > span')?.textContent.trim() ?? '';
    if (!rolle || !text || !rolle.checkVisibility({ opacityProperty: true, visibilityProperty: true })) {
      fehler.push(`${name}: keine sichtbare Beschriftung`);
      continue;
    }
    if (rolle.scrollWidth > rolle.clientWidth + 0.5) fehler.push(`${name}: Beschriftung „${text}" abgeschnitten`);
    if (rolle.getBoundingClientRect().right > p.right - 4) fehler.push(`${name}: Beschriftung stoesst an den Rand`);
    if (!name.includes(text)) fehler.push(`${name}: sichtbarer Text „${text}" fehlt in der Ansage (WCAG 2.5.3)`);
  }
  for (const nav of document.querySelectorAll('nav[aria-label^="Hauptnavigation"]')) {
    if (getComputedStyle(nav).display === 'none') continue;
    const n = nav.getBoundingClientRect();
    const rand = Math.min(n.left - f.left, f.right - n.right);
    if (rand < randMin) fehler.push(`${nav.getAttribute('aria-label')}: nur ${rand.toFixed(1)} px bis zum Reiterrand`);
  }
  return { fehler, luecke: Math.round(luecke * 10) / 10, breite: Math.round(a.width) };
};

const { basis, stopp } = await startePreview(4193);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const warte = (ms) => new Promise((r) => setTimeout(r, ms));
let befunde = 0;
let angeschnittenGesamt = 0;
let hinweise = 0;
let geometrieFehler = 0;

if (process.argv.includes('--gegenprobe')) {
  // Je Fehler eine frische Seite bei 1440 × 900: Fehler-CSS einspielen, dann Geometrie und Pixelprobe.
  let blind = 0;
  try {
    for (const [fehler, css] of Object.entries(GEGENPROBEN)) {
      const seite = await browser.newPage();
      await seite.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
      await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await seite.goto(basis + '/', { waitUntil: 'networkidle0' });
      await seite.addStyleTag({ content: css });
      await warte(200);
      await seite.evaluate(AUSSPARUNG_RUHIG);
      const meldungen = [
        ...(await seite.evaluate(GEOMETRIE, { luckeMin: LUECKE_MIN, randMin: RAND_LINKS_MIN })).fehler,
        ...(await pruefeKnoepfe(seite)),
      ];
      console.log(`  ${meldungen.length ? '✓ erkannt ' : '✗ BLIND   '} ${fehler}`);
      for (const m of meldungen.slice(0, 2)) console.log(`      → ${m}`);
      if (!meldungen.length) blind++;
      await seite.close();
    }
  } finally {
    await browser.close();
    stopp();
  }
  console.log(blind ? `\n✗ ${blind} eingespielte(r) Fehler NICHT erkannt` : `\n✓ Gegenprobe: alle ${Object.keys(GEGENPROBEN).length} eingespielten Fehler erkannt`);
  process.exit(blind ? 1 : 0);
}

try {
  // GEOMETRIE: einmal auf `/` je Breite — Reiter und Aussparung sind auf allen Routen gleich.
  {
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    console.log(`\nGeometrie auf / (${GEOMETRIE_BREITEN.length} Breiten)`);
    const zeilen = [];
    for (const b of GEOMETRIE_BREITEN) {
      await seite.setViewport({ width: b, height: 800, deviceScaleFactor: 1 });
      if (!zeilen.length) await seite.goto(basis + '/', { waitUntil: 'networkidle0' });
      await warte(200);
      await seite.evaluate(AUSSPARUNG_RUHIG);
      const g = await seite.evaluate(GEOMETRIE, { luckeMin: LUECKE_MIN, randMin: RAND_LINKS_MIN });
      zeilen.push(`${b}: ${g.luecke ?? '—'}`);
      for (const f of g.fehler) console.log(`  ✗ ${String(b).padStart(4)} px  ${f}`);
      geometrieFehler += g.fehler.length;
    }
    console.log(`  Luecke je Breite (px): ${zeilen.join(' · ')}`);
    if (!geometrieFehler) console.log(`  ✓ alle ${GEOMETRIE_BREITEN.length} Breiten: Luecke >= ${LUECKE_MIN} px, Beschriftungen vollstaendig, Links im Reiter`);
    await seite.close();
  }

  for (const [b, h] of FENSTER) {
    const seite = await browser.newPage();
    await seite.setViewport({ width: b, height: h, deviceScaleFactor: 1 });
    await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    await seite.evaluateOnNewDocument(HALTE_SCROLL);
    console.log(`\n${b} × ${h}`);
    for (const route of routen) {
      await seite.goto(basis + route, { waitUntil: 'networkidle0' });
      const angeschnitten = await pruefeKnoepfe(seite);
      if (angeschnitten.length) {
        console.log(`  ✗ ${route.padEnd(52)} Knopf der Aussparung angeschnitten: ${angeschnitten.join(', ')}`);
        angeschnittenGesamt += angeschnitten.length;
      }
      const weg = await seite.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      let vorige = new Map();
      const dauerhaft = new Map();
      let positionen = 0;
      let sichtbar = 0;
      for (let y = 0; y <= weg; y += Math.round(h / 2)) {
        await seite.evaluate((yy) => { window.scrollTo(0, yy); window.__ccHalte(yy); }, y);
        // Gepinnte Flaechen brauchen ein, zwei Bilder.
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
      for (const [name, n] of dauerhaft) console.log(`      → ${name} liegt an ${n} Positionen fest unter der Aussparung`);
      befunde += dauerhaft.size;
      if (!dauerhaft.size && anteil < SICHTBAR_MINDESTENS) hinweise++;
    }
    await seite.close();
  }
} finally {
  await browser.close();
  stopp();
}

const alle = befunde + angeschnittenGesamt + geometrieFehler;
console.log(
  alle
    ? `
✗ ${alle} Befund(e): ${befunde} dauerhafte Ueberdeckung(en), ${angeschnittenGesamt} angeschnittene(r) Knopf/Knoepfe, ${geometrieFehler} Geometrie-Fehler`
    : `
✓ Keine dauerhafte Ueberdeckung, Knoepfe unversehrt — ${routen.length} Routen × ${FENSTER.length} Fenster;`
      + ` Geometrie an ${GEOMETRIE_BREITEN.length} Breiten in Ordnung`
      + (hinweise ? ` (${hinweise} Route(n) mit Aussparung an weniger als der Haelfte der Positionen, siehe ⚠)` : '')
);
process.exit(alle ? 1 : 0);
