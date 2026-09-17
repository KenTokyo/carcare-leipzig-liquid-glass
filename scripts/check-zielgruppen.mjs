// Zielgruppenkarten der Startseite: Sind Text, CTAs und Partnerlisten auf jeder
// Fenstergroesse sichtbar und lesbar?
//
// AUFRUF (braucht ein aktuelles `dist/`, also vorher `npm run build`):
//   npm run zielgruppen                Tabelle je Fenster + Urteil, Exit 1 bei Fehlern
//   npm run zielgruppen -- --bilder    zusaetzlich Aufnahmen nach output/zielgruppen/
//   npm run zielgruppen -- 1920 390    nur Fenster dieser Breiten (schneller, z. B. fuer Gegenproben)
//
// WARUM ES DIESES SKRIPT GIBT: Der Kartenstapel haengt in der Hoehe am Viewport
// (`100svh - i x --bar`). Zweimal ist dort etwas an Fenstergroessen kaputtgegangen, die beim
// Einbau niemand angesehen hatte: 2026-07-24 lief der Kartentext auf 1366x768 ueber, am
// 2026-09-17 waren die Partner auf einem Full-HD-Bildschirm unsichtbar. Eine Sichtpruefung
// trifft immer nur das eigene Fenster.
//
// WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage CLAUDE.md):
//  1. Ein Eintrag steht im DOM und hat eine Groesse, liegt aber unter der naechsten Karte.
//     → Treffertest per `elementFromPoint` an fuenf Punkten, nicht nur Rechteck-Geometrie.
//  2. Ein Eintrag liegt in einem Scrollbereich, den das Mausrad nicht erreicht — Lenis faengt
//     Wheel-Events seitenweit ab. → Mit der Maus wird das Rad ECHT gedreht (CDP-Radereignis)
//     und geprueft, ob der Bereich unter dem Zeiger scrollt, ohne dass die Seite wegrollt —
//     und ob er an seinem Ende an die Seite abgibt (sonst haengt der Nutzer fest). Ein
//     Attribut wie `data-lenis-prevent` zu pruefen, belegte nur die Absicht, nicht die Wirkung.
//     Das gilt auch fuer schmale Fenster am PC (halb angedockt): Massgeblich ist das
//     Eingabegeraet, nicht die Breite — jedes Fenster traegt deshalb `maus: true|false`.
//  3. Die Liste ist nur im exakten Park-Pixel frei und gleich danach verdeckt.
//     → Gemessen wird der Scrollweg, den die Liste vollstaendig frei bleibt (Untergrenze).
//  4. Die Fensterliste trifft das Fenster des Users nicht. → Full HD steht mit Browserleisten,
//     Lesezeichenleiste und Zoom drin, mobil mit der Hoehe bei sichtbaren Browserleisten
//     (`svh`) — Puppeteer kennt keine einklappenden Leisten.
//  5. Schrift noch nicht geladen → anderer Zeilenumbruch. → `document.fonts.ready` abwarten.
//  6. Elemente mit `pointer-events: none` sieht der Treffertest nicht — die Ueberschrift ab
//     `lg` ist so eins. → Ihre Ueberlappung mit der weissen Karte wird separat geprueft.
//  7. BLEIBT OFFEN: Kontrast prueft dieses Skript nicht, dafuer ist `npm run kontrast` da.
//     Und gemessen wird ein Mausrad-Nutzer — wer die Scrollleiste der Liste nicht bemerkt,
//     sieht trotzdem nur den sichtbaren Teil. Deshalb gilt zusaetzlich eine Mindestzahl
//     sofort sichtbarer Eintraege.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'zielgruppen');
const BILDER = process.argv.includes('--bilder');
const NUR_BREITEN = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n) && n > 100);
const PORT = 4188;

/** Ab dieser Breite gilt das Desktop-Layout (Tailwind `lg`) — und damit das Mausrad-Problem. */
const LG = 1024;

/** Mindestens so viele Eintraege muessen ohne jedes Scrollen lesbar sein. */
const MIN_SOFORT = 4;

/**
 * Mindest-Scrollweg in Prozent der Fensterhoehe, den die sichtbare Liste frei bleibt, bevor
 * die naechste Karte sie anschneidet. Ein Mausrad-Rasten scrollt mit Lenis etwa 100 px;
 * 20 % sind auf 945 px Hoehe knapp zwei Rasten — genug, um die Namen zu lesen.
 */
const MIN_FENSTER = 0.2;

/**
 * Hoehen = was die SEITE bekommt, nicht die Bildschirmaufloesung. Werte fuer Browserleisten
 * sind typische Groessen (Chrome/Edge, Windows 11, Taskleiste 48 px), keine Normwerte.
 */
const FENSTER = [
  { name: 'Full HD, Vollbild (F11)', w: 1920, h: 1080, maus: true },
  { name: 'Full HD, Browser maximiert', w: 1920, h: 945, maus: true },
  { name: 'Full HD + Lesezeichenleiste', w: 1920, h: 913, maus: true },
  { name: 'Full HD + Zoom 110 %', w: 1745, h: 830, maus: true },
  { name: 'Full HD + Zoom 125 %', w: 1536, h: 730, maus: true },
  { name: '1440 x 900 (Fensterinhalt)', w: 1440, h: 900, maus: true },
  { name: 'MacBook 1440 x 900, maximiert', w: 1440, h: 790, maus: true },
  { name: 'Laptop 1366 x 768, maximiert', w: 1366, h: 657, maus: true },
  { name: 'Full HD + Skalierung 150 %', w: 1280, h: 593, maus: true },
  { name: 'Tablet quer', w: 1024, h: 700, maus: false },
  // Halb angedocktes Fenster am PC: schmales Layout, aber MAUS — Lenis faengt das Rad ab.
  { name: 'Full HD, halbe Breite', w: 960, h: 945, maus: true },
  { name: 'Tablet hoch', w: 768, h: 954, maus: false },
  { name: 'iPhone, Leisten eingeklappt', w: 390, h: 844, maus: false },
  { name: 'iPhone, Leisten sichtbar', w: 390, h: 664, maus: false },
  { name: 'Android klein', w: 360, h: 640, maus: false },
];

/**
 * Laeuft IM Browser. Misst Karte `i`, geparkt bei `basis`, fuer jeden Scrollversatz in
 * `versaetze`. Muss selbsttragend sein (wird serialisiert).
 */
function messeKarte({ i, basis, versaetze }) {
  const karten = [...document.querySelectorAll('#zielgruppen article')];
  const karte = karten[i];
  const weiss = karte.querySelector('[data-karte="weiss"]') ?? karte.querySelector('.z-10');
  const inhalt = weiss.querySelector('[data-karte="inhalt"]') ?? weiss.querySelector('.cc-card-scroll');
  const liste = karte.querySelector('[data-partner="liste"]') ?? karte.querySelector('ul');
  const block = liste ? karte.querySelector('[data-partner="block"]') ?? liste.parentElement : null;
  const titel = block ? block.querySelector('[data-partner="titel"]') ?? block.querySelector('p') : null;
  const text = inhalt.querySelector('p');
  const ctas = [...inhalt.querySelectorAll('[data-karte="ctas"] > a, :scope > div > a')];

  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { l: r.left, t: r.top, r: r.right, b: r.bottom };
  };
  const schnitt = (a, b) => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
  const flaeche = (x) => Math.max(0, x.r - x.l) * Math.max(0, x.b - x.t);
  const sichtbarerTeil = (el) => {
    let s = box(el);
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') s = schnitt(s, box(a));
    }
    return schnitt(s, { l: 0, t: 0, r: innerWidth, b: innerHeight });
  };
  const getroffen = (el, x, y) => {
    const h = document.elementFromPoint(x, y);
    return Boolean(h) && (h === el || el.contains(h));
  };
  /**
   * Vollstaendig sichtbar = Rechteck ungeschnitten UND an fuenf Punkten selbst getroffen.
   * Keine Eckpunkte: Chrome trifft abgerundete Ecken nicht (Pillen-CTAs haben `rounded-full`),
   * ein Eckpunkt meldete sonst jede Pille als verdeckt. Oben/unten mittig erfasst eine von
   * unten aufziehende Karte trotzdem.
   */
  const voll = (el) => {
    if (!el) return false;
    const r = box(el);
    if (flaeche(r) === 0 || flaeche(sichtbarerTeil(el)) < flaeche(r) * 0.98) return false;
    const cx = (r.l + r.r) / 2;
    const cy = (r.t + r.b) / 2;
    const rand = Math.min((r.r - r.l) / 2, Math.max(2, (r.b - r.t) / 2));
    const punkte = [
      [cx, cy],
      [cx, r.t + 1.5],
      [cx, r.b - 1.5],
      [r.l + rand, cy],
      [r.r - rand, cy],
    ];
    return punkte.every(([x, y]) => getroffen(el, x, y));
  };
  /** Schriftgroesse des ersten sichtbaren Namens (nicht die des Links drumherum). */
  const namensSchrift = (wurzel) => {
    for (const el of wurzel ? wurzel.querySelectorAll('span') : []) {
      const eigenerText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (eigenerText && !el.closest('.sr-only')) return parseFloat(getComputedStyle(el).fontSize);
    }
    return 0;
  };

  const eintraege = liste ? [...liste.children] : [];
  const zaehle = () => eintraege.filter(voll).length;
  const geh = (y) => window.scrollTo({ top: y, behavior: 'instant' });

  // --- Zustand im Park-Moment ---
  geh(basis);
  const parkTop = parseFloat(getComputedStyle(karte).top);
  const geparkt = Math.abs(karte.getBoundingClientRect().top - parkTop) < 1.5;
  const blockDa = Boolean(block) && getComputedStyle(block).display !== 'none';
  const listeScrollt = Boolean(liste) && liste.scrollHeight > liste.clientHeight + 1;
  const ueberlauf = Math.max(0, Math.round(inhalt.scrollHeight - inhalt.clientHeight));
  const sofort = blockDa ? zaehle() : 0;
  const titelDa = voll(titel);
  const textDa = voll(text);
  const ctasDa = ctas.length > 0 && ctas.every(voll);
  const listeHoehe = liste && blockDa ? Math.max(0, Math.round(sichtbarerTeil(liste).b - sichtbarerTeil(liste).t)) : 0;
  const schrift = namensSchrift(liste);
  const spalten = liste ? getComputedStyle(liste).gridTemplateColumns.split(' ').filter(Boolean).length : 0;

  // Ueberschrift (pointer-events: none, fuer den Treffertest unsichtbar) gegen die weisse Karte.
  const kopf = document.querySelector('.zielgruppen-titel > div');
  const kopfUeberlappt = kopf ? flaeche(schnitt(box(kopf), box(weiss))) > 0 : false;

  // Kartentext bis zur Liste scrollen und erneut zaehlen (Touch nativ, Maus per Radtest belegt).
  let nachKartenscroll = sofort;
  if (blockDa && ueberlauf > 0) {
    inhalt.scrollTop = block.getBoundingClientRect().top - inhalt.getBoundingClientRect().top + inhalt.scrollTop;
    nachKartenscroll = zaehle();
    inhalt.scrollTop = 0;
  }

  // --- Scrollfenster: wie lange bleibt die sichtbare Liste vollstaendig frei? ---
  let fenster = null;
  if (blockDa && sofort > 0) {
    for (const d of versaetze) {
      geh(basis + d);
      if (zaehle() < sofort || !voll(titel)) {
        fenster = d;
        break;
      }
    }
    if (fenster === null) fenster = versaetze[versaetze.length - 1];
  }
  geh(basis);

  return {
    id: karte.getAttribute('aria-labelledby')?.replace('zielgruppe-', '') ?? String(i),
    geparkt,
    eintraege: eintraege.length,
    blockDa,
    sofort,
    nachKartenscroll,
    listeScrollt,
    listeHoehe,
    ueberlauf,
    titelDa,
    textDa,
    ctasDa,
    fenster,
    schrift,
    spalten,
    kopfUeberlappt,
  };
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Echter Mausrad-Test fuer `ziel` = 'liste' | 'inhalt' der Karte `i`, geparkt bei `park`.
 * Liefert `rad` (Bereich scrollt, die Seite bleibt, bis er am Ende ist) und `uebergabe` (am
 * Bereichsende scrollt die Seite weiter). Lenis gleitet nach: Vor und nach dem Test wird gewartet, sonst zoege eine
 * laufende Lenis-Animation die naechste Messung von ihrer Position weg.
 */
async function radTest(seite, i, park, ziel) {
  const vorbereiten = (anEnde) =>
    seite.evaluate(
      ({ i, park, ziel, anEnde }) => {
        const karte = document.querySelectorAll('#zielgruppen article')[i];
        const el = karte.querySelector(ziel === 'liste' ? '[data-partner="liste"]' : '[data-karte="inhalt"]');
        el.scrollTop = anEnde ? el.scrollHeight : 0;
        window.scrollTo({ top: park, behavior: 'instant' });
        // Zeiger auf ein Stueck, das nur zu diesem Bereich gehoert: Liste → Mitte, Kartentext → Beschreibung.
        const r = (ziel === 'liste' ? el : el.querySelector('p')).getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, 30) };
      },
      { i, park, ziel, anEnde },
    );
  const lesen = () =>
    seite.evaluate(
      ({ i, park, ziel }) => {
        const karte = document.querySelectorAll('#zielgruppen article')[i];
        const el = karte.querySelector(ziel === 'liste' ? '[data-partner="liste"]' : '[data-karte="inhalt"]');
        return { bereich: el.scrollTop, max: el.scrollHeight - el.clientHeight, seite: Math.round(window.scrollY - park) };
      },
      { i, park, ziel },
    );
  const drehen = async (punkt) => {
    await seite.mouse.move(punkt.x, punkt.y);
    for (let n = 0; n < 3; n++) {
      await seite.mouse.wheel({ deltaY: 100 });
      await warte(60);
    }
  };

  await warte(300);
  await drehen(await vorbereiten(false));
  await warte(500);
  const imBereich = await lesen();
  await drehen(await vorbereiten(true));
  await warte(900);
  const amEnde = await lesen();
  await warte(900);
  await vorbereiten(false);
  await warte(300);
  // Die Seite darf sich erst bewegen, wenn der Bereich am Ende ist — drei Rasten (300 px)
  // sind bei kurzem Ueberlauf mehr als der Bereich hergibt, dann uebernimmt die Seite zu Recht.
  const amBereichsende = imBereich.bereich >= imBereich.max - 1;
  return {
    rad: imBereich.bereich > 0 && (amBereichsende || Math.abs(imBereich.seite) < 2),
    uebergabe: amEnde.seite > 20,
  };
}

function urteile(f, k) {
  const desktop = f.w >= LG;
  const fehler = [];
  if (!k.geparkt) fehler.push('Karte nicht in Parkposition gemessen');
  if (desktop && k.kopfUeberlappt) fehler.push('Ueberschrift liegt ueber der weissen Karte');
  // Mit der Maus muss ein ueberlaufender Kartentext per Rad scrollen — egal wie breit.
  const kartenscrollMaus = k.ueberlauf > 1 && k.inhaltRad && k.inhaltUebergabe;
  if (f.maus && k.ueberlauf > 1 && !k.inhaltRad) fehler.push(`Kartentext laeuft ${k.ueberlauf} px ueber und ist per Mausrad nicht erreichbar`);
  if (f.maus && k.ueberlauf > 1 && k.inhaltRad && !k.inhaltUebergabe) fehler.push('Mausrad bleibt am Ende des Kartentexts haengen');
  if (f.maus && !k.textDa) fehler.push('Beschreibung nicht vollstaendig sichtbar');
  if (f.maus && !k.ctasDa) fehler.push('CTAs nicht vollstaendig sichtbar');
  if (k.eintraege === 0) return fehler;
  if (!k.blockDa) {
    fehler.push('Partnerliste ausgeblendet');
    return fehler;
  }
  const perKartenscroll = k.ueberlauf > 0 && (!f.maus || kartenscrollMaus);
  const lesbar = perKartenscroll ? k.nachKartenscroll : k.sofort;
  const mindest = Math.min(MIN_SOFORT, k.eintraege);
  if (lesbar < mindest) fehler.push(`nur ${lesbar} Partner lesbar (min. ${mindest})`);
  const perListenscroll = k.listeScrollt && (!f.maus || (k.listeRad && k.listeUebergabe));
  if (lesbar < k.eintraege && !perListenscroll && !perKartenscroll) {
    fehler.push(`${k.eintraege - lesbar} Partner weder sichtbar noch per Scrollen erreichbar`);
  }
  if (f.maus && k.listeScrollt && !k.listeRad) fehler.push('Liste scrollt, das Mausrad erreicht sie aber nicht');
  if (f.maus && k.listeScrollt && k.listeRad && !k.listeUebergabe) fehler.push('Mausrad bleibt am Listenende haengen (Seite scrollt nicht weiter)');
  // Wer im Kartentext per Rad scrollt, bewegt die Seite nicht — dann verdeckt auch nichts.
  if (f.maus && !kartenscrollMaus && k.fenster !== null && k.fenster < MIN_FENSTER * f.h) {
    fehler.push(`Liste nur ${k.fenster} px Scrollweg frei (min. ${Math.round(MIN_FENSTER * f.h)})`);
  }
  return fehler;
}

const { basis, stopp } = await startePreview(PORT);
const browser = await puppeteer.launch({ headless: 'new' });
if (BILDER) fs.mkdirSync(AUSGABE, { recursive: true });

const alle = [];
let fehlerGesamt = 0;
try {
  for (const f of FENSTER.filter((x) => !NUR_BREITEN.length || NUR_BREITEN.includes(x.w))) {
    const desktop = f.w >= LG;
    const seite = await browser.newPage();
    await seite.setViewport({ width: f.w, height: f.h, deviceScaleFactor: 1, isMobile: !f.maus && f.w < 768, hasTouch: !f.maus });
    await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
    await seite.evaluateOnNewDocument(HALTE_SCROLL);
    await seite.goto(`${basis}/`, { waitUntil: 'networkidle0', timeout: 60000 });
    await seite.evaluate(async () => {
      await document.fonts.ready;
    });
    await warte(400);

    // Natuerliche Lage der Karten, gemessen VOR dem Einrasten (Seite ganz oben).
    const lage = await seite.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return [...document.querySelectorAll('#zielgruppen article')].map((k) => ({
        oben: k.getBoundingClientRect().top + window.scrollY,
        park: parseFloat(getComputedStyle(k).top),
      }));
    });
    const parkpunkte = lage.map((k) => Math.round(k.oben - k.park));

    console.log(`\n${f.name} — ${f.w} x ${f.h} · ${desktop ? 'Desktop-Layout' : 'schmales Layout'} · ${f.maus ? 'Maus' : 'Touch'}`);
    for (let i = 0; i < lage.length; i++) {
      const bis = i + 1 < lage.length ? parkpunkte[i + 1] - parkpunkte[i] : Math.round(f.h * 1.2);
      const versaetze = [];
      for (let d = 0; d <= bis; d += 10) versaetze.push(d);
      const k = await seite.evaluate(messeKarte, { i, basis: parkpunkte[i], versaetze });

      if (BILDER && k.eintraege) {
        await seite.evaluate((y) => {
          window.scrollTo(0, y);
          window.__ccHalte(y);
        }, parkpunkte[i]);
        await warte(700);
        await seite.screenshot({ path: path.join(AUSGABE, `${f.w}x${f.h}-${k.id}.png`) });
        await seite.evaluate(() => window.__ccLoslassen());
      }
      // Radtests zuletzt: Sie scrollen, und Lenis gleitet nach (radTest wartet das ab).
      if (f.maus && k.listeScrollt) {
        const { rad, uebergabe } = await radTest(seite, i, parkpunkte[i], 'liste');
        Object.assign(k, { listeRad: rad, listeUebergabe: uebergabe });
      }
      if (f.maus && k.ueberlauf > 1) {
        const { rad, uebergabe } = await radTest(seite, i, parkpunkte[i], 'inhalt');
        Object.assign(k, { inhaltRad: rad, inhaltUebergabe: uebergabe });
      }

      const fehler = urteile(f, k);
      fehlerGesamt += fehler.length;
      alle.push({ fenster: f, karte: k, fehler });

      const lesbar = k.nachKartenscroll === k.sofort ? `${k.sofort}` : `${k.sofort} (nach Kartenscroll ${k.nachKartenscroll})`;
      const liste = k.eintraege
        ? `Partner ${k.blockDa ? `${lesbar}/${k.eintraege} sofort lesbar` : 'AUSGEBLENDET'}` +
          (k.blockDa ? `, Liste ${k.listeHoehe} px${k.listeScrollt ? ' scrollt' : ''}, ${k.spalten} Sp., ${k.schrift} px` : '') +
          (k.blockDa && k.fenster !== null ? `, frei fuer ${k.fenster} px Scrollweg` : '') +
          (k.listeRad !== undefined ? `, Rad ${k.listeRad ? 'ok' : 'NEIN'}/Uebergabe ${k.listeUebergabe ? 'ok' : 'NEIN'}` : '')
        : 'ohne Partner';
      const rest =
        `Text ${k.textDa ? 'ok' : 'NEIN'}, CTAs ${k.ctasDa ? 'ok' : 'NEIN'}, Ueberlauf ${k.ueberlauf} px` +
        (k.inhaltRad !== undefined ? ` (Rad ${k.inhaltRad ? 'ok' : 'NEIN'}/Uebergabe ${k.inhaltUebergabe ? 'ok' : 'NEIN'})` : '');
      console.log(`  ${fehler.length ? '✗' : '✓'} ${k.id.padEnd(15)} ${liste} | ${rest}`);
      for (const text of fehler) console.log(`      → ${text}`);
    }
    await seite.close();
  }
} finally {
  await browser.close();
  stopp();
}

if (BILDER) {
  fs.writeFileSync(path.join(AUSGABE, 'messung.json'), JSON.stringify(alle, null, 2));
  console.log(`\nAufnahmen und messung.json: ${path.relative(wurzel, AUSGABE)}`);
}
console.log(fehlerGesamt ? `\n✗ ${fehlerGesamt} Befund(e)` : '\n✓ Alle Karten auf allen Fenstern in Ordnung');
process.exit(fehlerGesamt ? 1 : 0);
