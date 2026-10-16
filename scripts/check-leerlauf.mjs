// Leerlauf-Check (R26): Steht der Hauptthread, wenn sich nichts bewegt? Und gleitet Lenis trotzdem, wenn er soll?
//
// AUFRUF:
//   npm run leerlauf                   alle Routen, Smartphone (393 × 851, Touch) und Desktop (1920 × 945, Maus)
//   npm run leerlauf -- /karriere      nur diese Route(n) im Leerlauf (unter Git Bash `MSYS_NO_PATHCONV=1` davor)
//   npm run leerlauf -- --gleiten      nur die drei Gleitfaelle
//   npm run leerlauf -- --gegenprobe   PRUEFT DEN PRUEFER: spielt (A) eine rAF-Dauerschleife ein, so lief Lenis bis
//                                      2026-10-17, und (B) eine springende Uhr, so saehe ein Wiederanlauf ohne
//                                      Nachfuehren von `lenis.time` aus. Verlangt jede Meldung (Exit 1 sonst).
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// ANLASS (R26, 2026-10-17): `hooks/useSmoothScroll.ts` rief Lenis in JEDEM Bild auf, auch ohne Bewegung. Gemessen
// (393 × 851, CPU 4×): rund 110 rAF-Rueckrufe je Sekunde, alle von dieser Schleife, der Hauptthread 21–40 % der Zeit
// belegt, ohne dass sich etwas bewegt. Seitdem laeuft die Schleife nur, solange Lenis gleitet. Diese Pruefung haelt
// beides fest: kein Bild im Leerlauf, und Gleiten ohne Sprung, wo Lenis gleiten soll.
//
// HART (Exit 1):
//  - LEERLAUF: je Route und Fenster oben und in der Seitenmitte, nach dem Einschwingen MESSDAUER ms ohne Eingabe:
//    hoechstens GRENZE_LEERLAUF Hauptthread-Bilder (`BeginMainThreadFrame`). Gemessen nach R26: 0–4 in 2 s, mit
//    Dauerschleife je nach Takt 150–300 in 1,5 s. Bei einem Befund nennt sie die Quelle jedes rAF-Rueckrufs (Datei,
//    Zeile, Spalte und den Code an der Stelle in dist/).
//  - GLEITEN in drei Faellen, die die Schleife auf drei Wegen wecken:
//      Rad       Desktop, Startseite, ein Mausrad-Ereignis ueber 400 px (Lenis `onVirtualScroll` → `scrollTo`)
//      Anker     Smartphone, /karriere, Tipp auf „Jobbereiche ansehen“ (`beiAnkerKlick` → `scrollTo`)
//      Navigation Desktop, /karriere → /#leistungen wie ein Navbar-Link (App.tsx, `scrollTo` aus einem Zeitgeber)
//    Je Fall: Lenis gleitet (Klasse `lenis-smooth` gesehen) in mindestens MIN_LAGEN Lagen, KEIN SPRUNG, Ankunft am
//    Ziel, und danach steht der Hauptthread wieder (Leerlauf wie oben).
//    SPRUNG heisst: Ein Bild legt mehr vom Restweg zurueck, als Lenis' Daempfung fuer die tatsaechlich vergangene Zeit
//    erlaubt (`lerp: 0.1` → Anteil 1 − e^(−6·dt) bei dt in Sekunden), um mehr als TOLERANZ_SCHRITT. So entsteht der
//    Fehler, vor dem `useSmoothScroll` schuetzt: Laeuft die Schleife mit alter Lenis-Uhr wieder an, setzt das erste Bild
//    die Seite ans Ziel. Und der erste Schritt (ANLAUF) darf hoechstens MAX_ANLAUF-mal so gross sein wie bei
//    durchlaufender Schleife und gemessenem Bildtakt (rund 1 = wie vor R26; ohne Einmessen des Takts waren es 2 bis 4).
//    WARUM NICHT „Schritt hoechstens x % des Wegs“ (so im ersten Entwurf, 2026-10-17): Lange Bilder (neue Seite wird
//    gerendert, Bilder dekodieren) geben Lenis zu Recht grosse Schritte, gemessen 42 % beim Rad und 74 % bei der
//    Navigation, beides zeitrichtig und vor R26 genauso. Ein Wegkriterium meldete das als Sprung.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md):
//  1. NUR ZWEI LAGEN JE SEITE (oben, Mitte) und ein Fenster von MESSDAUER ms. Eine Schleife, die nur an einer anderen
//     Stelle laeuft (z. B. solange ein bestimmtes Element im Bild ist) oder nur alle paar Sekunden kurz, faellt nicht auf.
//  2. KOPFLOS: Gezaehlt werden Bilder, nicht Energie. Wie viel das auf dem Telefon spart, misst sie nicht.
//  3. GLEITEN IN DREI FAELLEN. „Ablauf ueberspringen“ (ScrollPinnedProcess) und die Suche laufen ueber dasselbe
//     `scrollTo`, werden aber nicht einzeln ausgeloest. Touch-Scrollen ist nativ (`syncTouch` aus) und braucht Lenis nicht.
//  4. SPRUNG GEGEN DIE ZEIT ERKANNT: Ein Wiederanlauf, der zu langsam statt zu schnell anlaeuft, besteht (gemessen
//     ×0,51, wenn der Takt beim Gleiten langsamer ist als beim Einmessen). Die Gegenprobe (B) belegt, dass ein Sprung
//     gemeldet wird; das Anlauf-Kriterium ist nur einmal am alten Build belegt (siehe MAX_ANLAUF), nicht bei jedem Lauf.
//  5. GEWOLLTE DAUERANIMATIONEN gaebe es dann als Befund. Derzeit gibt es keine (gemessen 29 Routen); kommt eine dazu,
//     gehoert sie hier mit Begruendung ausgenommen, nicht die Grenze hochgesetzt.
//  6. EREIGNISSE VON VOR DEM START (Lehre aus `check-akkordeon.mjs`, Pflichtfrage 8): nur Ereignisse ab
//     `TracingStartedInBrowser`, Thread und Fensteranfang aus einer eigenen Marke (`console.timeStamp`), je Messung ein
//     eigener Browser. Fehlt die Marke: Messfehler (Exit 2), kein Urteil.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEGENPROBE = process.argv.includes('--gegenprobe');
const NUR_ROUTEN = process.argv.slice(2).filter((a) => a.startsWith('/'));
const NUR_GLEITEN = process.argv.includes('--gleiten');
const FENSTER = {
  mobil: { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true },
  desktop: { width: 1920, height: 945, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
};
/** Hoechstens so viele Hauptthread-Bilder in MESSDAUER ms ohne Eingabe. */
const GRENZE_LEERLAUF = 10;
const MESSDAUER = 1500;
const MIN_LAGEN = 3;
/** Ein Bild darf so viel mehr vom Restweg zuruecklegen als Lenis' Daempfung fuer seine Dauer erlaubt (Anteil). */
const TOLERANZ_SCHRITT = 0.25;
/**
 * Erster Schritt hoechstens so oft wie bei durchlaufender Schleife. Gemessen (2026-10-17): mit Einmessen 0,51–1,00;
 * ohne Einmessen (60 Hz angenommen, Build 00:16) 1,96 bei 8,3 ms Takt und 3,82 bei 4,2 ms. Das ist die Gegenprobe
 * dieses Kriteriums, einmalig am alten Build gemessen; eine alte Uhr gaebe rund 20.
 */
const MAX_ANLAUF = 1.5;
/** Schritte am Ende (Restweg unter so vielen px) nicht bewerten: Lenis rastet dort aufs Ziel ein. */
const MIN_REST = 10;
/** Gleichzeitige Browser im Leerlauf-Teil. Gezaehlt werden Bilder, nicht Zeiten; Last verfaelscht das nicht. */
const PARALLEL = 3;
const KATEGORIEN = ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame'];
/** Fehler fuer die Gegenprobe, je vor dem Laden eingespielt. */
const FEHLER = {
  dauerschleife: () => { const f = () => requestAnimationFrame(f); requestAnimationFrame(f); },
  uhr: () => {
    const echt = window.requestAnimationFrame.bind(window);
    window.__ccEchtesRaf = echt; // die Bahn misst mit der echten Uhr, sonst „erklaerte“ sie den Sprung selbst
    let n = 0;
    window.requestAnimationFrame = (cb) => echt((t) => cb(t + ++n * 1000));
  },
};

if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[leerlauf] dist/ fehlt, bitte zuerst `npm run build`.');
  process.exit(1);
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const befunde = [];
const messfehler = [];
const zeilen = [];
let markenNr = 0;

/** Code an einer Stelle des ausgelieferten Bundles, damit eine Quelle ohne Quellkarte lesbar ist. */
const codeAn = (url, zeile, spalte) => {
  try {
    const datei = path.join(wurzel, 'dist', new URL(url).pathname);
    const text = fs.readFileSync(datei, 'utf8').split('\n')[zeile] ?? '';
    return text.slice(Math.max(0, spalte - 30), spalte + 70).replace(/\s+/g, ' ');
  } catch {
    return '';
  }
};

async function neueSeite(basis, route, fenster, fehler) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
  const seite = await browser.newPage();
  await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
  if (fehler) await seite.evaluateOnNewDocument(FEHLER[fehler]);
  await seite.setViewport(FENSTER[fenster]);
  await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await seite.evaluate(() => document.fonts.ready);
  // Einblendungen (z. B. Stellen-Pop-up auf /karriere nach 1,2 s) erst abwarten, dann schliessen: Sie animieren.
  await warte(2200);
  await seite.evaluate(() => document.querySelector('[role="dialog"] button[aria-label*="schließen"]')?.click());
  await warte(1300);
  return { browser, seite };
}

/** Hauptthread-Bilder und rAF-Rueckrufe in MESSDAUER ms ohne Eingabe; Thread und Anfang aus der eigenen Marke. */
async function leerlauf(seite) {
  const marke = `cc-leerlauf-${++markenNr}`;
  await seite.tracing.start({ categories: KATEGORIEN });
  await seite.evaluate((m) => console.timeStamp(m), marke);
  await warte(MESSDAUER + 150);
  const spur = JSON.parse(Buffer.from(await seite.tracing.stop()).toString('utf8'));
  const alle = spur.traceEvents ?? spur;
  const start = alle.find((e) => e.name === 'TracingStartedInBrowser')?.ts ?? 0;
  const m = alle.find((e) => e.ts >= start && e.name === 'TimeStamp' && e.args?.data?.message === marke);
  if (!m) return null;
  const haupt = alle.filter((e) => e.pid === m.pid && e.tid === m.tid && e.ts >= m.ts && e.ts < m.ts + MESSDAUER * 1000);
  const x = haupt.filter((e) => e.ph === 'X' && e.dur);
  const raf = x.filter((e) => e.name === 'FireAnimationFrame');
  const quellen = {};
  for (const r of raf) {
    for (const f of x.filter((e) => e.name === 'FunctionCall' && e.ts >= r.ts && e.ts < r.ts + r.dur)) {
      const d = f.args?.data ?? {};
      const k = `${String(d.url).split('/').pop()}:${d.lineNumber}:${d.columnNumber}  ${codeAn(d.url, d.lineNumber ?? 0, d.columnNumber ?? 0)}`;
      quellen[k] = (quellen[k] ?? 0) + 1;
    }
  }
  return {
    bilder: haupt.filter((e) => e.name === 'BeginMainThreadFrame').length,
    raf: raf.length,
    belegt: x.filter((e) => e.name === 'RunTask').reduce((s, e) => s + e.dur, 0) / 1000,
    quellen,
  };
}

/** Urteil ueber eine Leerlauf-Messung; liefert true bei Befund. */
function leerlaufUrteil(name, r) {
  if (!r) {
    messfehler.push(`${name}: Marke nicht in der Spur, nicht ausgewertet`);
    return false;
  }
  zeilen.push(`| ${name} | ${r.bilder} | ${r.raf} | ${r.belegt.toFixed(0)} ms |`);
  if (r.bilder <= GRENZE_LEERLAUF) return false;
  const quellen = Object.entries(r.quellen).sort((a, b) => b[1] - a[1]).map(([q, n]) => `${n}× ${q}`);
  befunde.push(`${name}: ${r.bilder} Hauptthread-Bilder in ${MESSDAUER} ms ohne Eingabe (Grenze ${GRENZE_LEERLAUF}), ${r.raf} rAF-Rueckrufe${quellen.length ? `:\n      ${quellen.slice(0, 4).join('\n      ')}` : ''}`);
  return true;
}

async function leerlaufRoute(basis, route, fenster, fehler) {
  const { browser, seite } = await neueSeite(basis, route, fenster, fehler);
  let gemeldet = 0;
  try {
    gemeldet += leerlaufUrteil(`${route} ${fenster} oben`, await leerlauf(seite));
    await seite.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) / 2));
    await warte(2500);
    gemeldet += leerlaufUrteil(`${route} ${fenster} Mitte`, await leerlauf(seite));
  } finally {
    await browser.close();
  }
  return gemeldet;
}

/**
 * Bahn je Bild aufzeichnen, mit der Bildzeit `t` (dieselbe, die Lenis im selben Bild bekommt). `beiEreignis`: erst beim
 * ersten Ereignis dieser Art starten, in einem Horcher am window. Der steht HINTER Lenis' eigenem (beim Start angelegt),
 * sein rAF-Rueckruf also hinter Lenis' Schritt: Jede Lage ist die, die in diesem Bild gemalt wird, und der Schritt dahin
 * gehoert zu diesem Bild. Ein frueher angelegter Rueckruf (Navigation: Lenis startet aus einem Zeitgeber der App) liest
 * die Lage des VORIGEN Bildes; `nachLenis: false` verschiebt die Zuordnung dann um ein Bild. Er saehe beim Anker auch den
 * nativen Sprung zum Ziel, den Lenis im selben Bild vor dem Malen zuruecknimmt.
 */
const BAHN = (beiEreignis) => {
  const raf = window.__ccEchtesRaf ?? window.requestAnimationFrame.bind(window);
  window.__ccBahn = [];
  window.__ccBahnLauf = true;
  const tick = (t) => {
    window.__ccBahn.push({ t, y: window.scrollY, gleitet: document.documentElement.classList.contains('lenis-smooth') });
    if (window.__ccBahnLauf) raf(tick);
  };
  if (beiEreignis) window.addEventListener(beiEreignis, () => raf(tick), { once: true });
  else raf(tick);
};

/**
 * Urteil ueber eine Gleitbahn (Kriterien im Kopf); `ziel` = Endlage, `ankunft` liefert Fehlertext oder null.
 * Liefert true bei Befund.
 */
function gleitUrteil(name, bahn, y0, ziel, nachLenis, ankunft) {
  const fehler = [];
  const gleitend = bahn.filter((p) => p.gleitet);
  const weg = Math.abs(ziel - y0) || 1;
  const lagen = new Set(gleitend.map((p) => Math.round(p.y * 10)).filter((y) => y !== Math.round(y0 * 10))).size;
  // Je Schritt: Anteil am Restweg gegen das, was Lenis fuer die Dauer seines Bildes erlaubt.
  let ueberschuss = 0;
  let stelle = '';
  for (let i = 1; i < bahn.length; i++) {
    const vorher = bahn[i - 1];
    if (!bahn[i].gleitet || Math.abs(ziel - vorher.y) < MIN_REST) continue;
    const dt = nachLenis ? bahn[i].t - vorher.t : i > 1 ? vorher.t - bahn[i - 2].t : NaN;
    if (!(dt > 0)) continue;
    const anteil = Math.abs(bahn[i].y - vorher.y) / Math.abs(ziel - vorher.y);
    const erlaubt = 1 - Math.exp(-6 * (dt / 1000));
    if (anteil - erlaubt > ueberschuss) {
      ueberschuss = anteil - erlaubt;
      stelle = `${Math.round(Math.abs(bahn[i].y - vorher.y))} px in ${dt.toFixed(1)} ms, ${Math.round(anteil * 100)} % des Restwegs statt hoechstens ${Math.round(erlaubt * 100)} %`;
    }
  }
  // ANLAUF: erster Schritt gegen die durchlaufende Schleife beim gemessenen Bildtakt (Median).
  const abstaende = gleitend.slice(1).map((p, i) => p.t - gleitend[i].t).filter((d) => d > 0).sort((a, b) => a - b);
  const takt = abstaende[Math.floor(abstaende.length / 2)] ?? 0;
  const erster = bahn.find((p) => Math.abs(p.y - y0) > 0.05);
  const anlauf = erster && takt ? Math.abs(erster.y - y0) / weg / (1 - Math.exp(-6 * (takt / 1000))) : NaN;

  if (!gleitend.length) fehler.push('Lenis gleitet nicht (Klasse `lenis-smooth` nie gesehen)');
  else if (lagen < MIN_LAGEN) fehler.push(`springt: nur ${lagen} Lage(n) beim Gleiten (mindestens ${MIN_LAGEN})`);
  if (ueberschuss > TOLERANZ_SCHRITT) fehler.push(`springt: ${stelle}`);
  if (anlauf > MAX_ANLAUF) fehler.push(`springt beim Anlauf: erster Schritt ${anlauf.toFixed(1)}-mal so gross wie bei durchlaufender Schleife (hoechstens ${MAX_ANLAUF})`);
  if (ankunft) fehler.push(ankunft);
  zeilen.push(`| ${name} | ${Math.round(weg)} px | ${lagen} | ${Math.round(ueberschuss * 100)} % | ${Number.isFinite(anlauf) ? `×${anlauf.toFixed(2)} (Takt ${takt.toFixed(1)} ms)` : '–'} | ${fehler.length ? 'NEIN' : 'ja'} |`);
  for (const f of fehler) befunde.push(`Gleiten ${name}: ${f}`);
  return fehler.length > 0;
}

/** Die drei Gleitfaelle. Liefert die Zahl der Faelle mit Befund. */
async function gleiten(basis, fehler) {
  let gemeldet = 0;
  const nachher = async (seite, name) => {
    await warte(1500);
    if (!fehler) leerlaufUrteil(`${name}, danach`, await leerlauf(seite));
  };

  // Rad: Desktop, Startseite
  {
    const { browser, seite } = await neueSeite(basis, '/', 'desktop', fehler);
    try {
      await seite.evaluate(() => window.scrollTo(0, 1200));
      await warte(1200);
      const y0 = await seite.evaluate(() => window.scrollY);
      const ziel = await seite.evaluate((y) => Math.min(y + 400, document.documentElement.scrollHeight - window.innerHeight), y0);
      await seite.evaluate(BAHN, 'wheel');
      await seite.mouse.move(960, 480);
      await seite.mouse.wheel({ deltaY: 400 });
      await warte(2500);
      const bahn = await seite.evaluate(() => { window.__ccBahnLauf = false; return window.__ccBahn; });
      const ende = bahn.at(-1)?.y ?? y0;
      gemeldet += gleitUrteil('Rad (Desktop, /)', bahn.length ? bahn : [{ t: 0, y: y0, gleitet: false }], y0, ziel, true, Math.abs(ende - ziel) > 2 ? `kommt nicht an: ${Math.round(ende)} statt ${Math.round(ziel)}` : null);
      await nachher(seite, 'Rad (Desktop, /)');
    } finally {
      await browser.close();
    }
  }

  // Anker: Smartphone, /karriere, Tipp auf „Jobbereiche ansehen“
  {
    const { browser, seite } = await neueSeite(basis, '/karriere', 'mobil', fehler);
    try {
      await seite.evaluate(() => window.scrollTo(0, 0));
      await warte(1200);
      const lage = await seite.evaluate(() => {
        const link = document.querySelector('a[href="#jobbereiche"]');
        const z = document.getElementById('jobbereiche');
        if (!link || !z) return null;
        const r = link.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const rand = (parseFloat(getComputedStyle(z).scrollMarginTop) || 0) + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
        const ziel = Math.min(z.getBoundingClientRect().top + window.scrollY - rand, document.documentElement.scrollHeight - window.innerHeight);
        return { x, y, frei: document.elementFromPoint(x, y)?.closest('a') === link, ziel, y0: window.scrollY };
      });
      if (!lage?.frei) messfehler.push(`Gleiten Anker: Link „Jobbereiche ansehen“ ${lage ? 'nicht frei (Treffertest)' : 'oder Ziel fehlt'}`);
      else {
        await seite.evaluate(BAHN, 'click');
        await seite.touchscreen.tap(lage.x, lage.y);
        await warte(3000);
        const bahn = await seite.evaluate(() => { window.__ccBahnLauf = false; return window.__ccBahn; });
        const ende = bahn.at(-1)?.y ?? lage.y0;
        gemeldet += gleitUrteil('Anker (Smartphone, /karriere)', bahn.length ? bahn : [{ t: 0, y: lage.y0, gleitet: false }], lage.y0, lage.ziel, true, Math.abs(ende - lage.ziel) > 2 ? `kommt nicht an: ${Math.round(ende)} statt ${Math.round(lage.ziel)}` : null);
        await nachher(seite, 'Anker (Smartphone, /karriere)');
      }
    } finally {
      await browser.close();
    }
  }

  // Navigation: Desktop, /karriere → /#leistungen wie ein Navbar-Link (pushState + carcare:navigate)
  {
    const { browser, seite } = await neueSeite(basis, '/karriere', 'desktop', fehler);
    try {
      await seite.evaluate(() => window.scrollTo(0, 0));
      await warte(1200);
      await seite.evaluate(BAHN, null);
      await seite.evaluate(() => {
        window.history.pushState(null, '', '/#leistungen');
        window.dispatchEvent(new Event('carcare:navigate'));
      });
      await warte(4000);
      const bahn = await seite.evaluate(() => { window.__ccBahnLauf = false; return window.__ccBahn; });
      const oben = await seite.evaluate(() => document.getElementById('leistungen')?.getBoundingClientRect().top ?? null);
      gemeldet += gleitUrteil('Navigation (Desktop, /karriere → /#leistungen)', bahn, bahn[0]?.y ?? 0, bahn.at(-1)?.y ?? 0, false, oben === null || Math.abs(oben - 88) > 4 ? `kommt nicht an: #leistungen ${oben === null ? 'fehlt' : `bei ${Math.round(oben)} px statt 88`}` : null);
      await nachher(seite, 'Navigation (Desktop)');
    } finally {
      await browser.close();
    }
  }
  return gemeldet;
}

/** Fuehrt Auftraege mit hoechstens `n` gleichzeitig aus. */
async function gebuendelt(auftraege, n) {
  const ergebnisse = [];
  let naechster = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (naechster < auftraege.length) {
      const i = naechster++;
      ergebnisse[i] = await auftraege[i]();
      process.stdout.write('.');
    }
  }));
  return ergebnisse;
}

const { basis, stopp } = await startePreview(4189);
let ausgang = 0;
try {
  if (GEGENPROBE) {
    const routen = NUR_ROUTEN.length ? NUR_ROUTEN : ['/', '/karriere'];
    const auftraege = routen.flatMap((r) => Object.keys(FENSTER).map((f) => () => leerlaufRoute(basis, r, f, 'dauerschleife')));
    const schleife = (await gebuendelt(auftraege, PARALLEL)).reduce((a, b) => a + b, 0);
    const sprung = await gleiten(basis, 'uhr');
    const erwartet = auftraege.length * 2;
    console.log(`\n\n[leerlauf] Gegenprobe: ${schleife} von ${erwartet} Leerlauf-Messungen mit Dauerschleife gemeldet, ${sprung} von 3 Gleitfaellen mit springender Uhr gemeldet.`);
    for (const b of befunde) console.log(`  - ${b.split('\n')[0]}`);
    if (messfehler.length) for (const m of messfehler) console.log(`  ! Messfehler: ${m}`);
    ausgang = schleife === erwartet && sprung === 3 && !messfehler.length ? 0 : 1;
  } else {
    const routen = NUR_GLEITEN ? [] : NUR_ROUTEN.length ? NUR_ROUTEN : getRoutes().map((r) => r.path);
    const auftraege = routen.flatMap((r) => Object.keys(FENSTER).map((f) => () => leerlaufRoute(basis, r, f)));
    await gebuendelt(auftraege, PARALLEL);
    const leer = zeilen.splice(0);
    if (!NUR_ROUTEN.length) await gleiten(basis);
    console.log(`\n\n| Leerlauf (${MESSDAUER} ms ohne Eingabe) | Hauptthread-Bilder | rAF-Rueckrufe | Hauptthread belegt |\n|---|---|---|---|`);
    console.log(leer.sort().join('\n'));
    const gleit = zeilen.filter((z) => z.split('|').length === 8);
    if (gleit.length) {
      console.log(`\n| Gleiten | Weg | Lagen | groesster Ueberschuss je Bild | Anlauf | in Ordnung |\n|---|---|---|---|---|---|`);
      console.log(gleit.join('\n'));
      console.log(`\n| Nach dem Gleiten | Hauptthread-Bilder | rAF-Rueckrufe | Hauptthread belegt |\n|---|---|---|---|`);
      console.log(zeilen.filter((z) => z.split('|').length === 6).join('\n'));
    }
    if (messfehler.length) {
      console.log(`\n[leerlauf] ${messfehler.length} Messfehler (Ergebnis nicht verwertbar, bitte wiederholen):`);
      for (const m of messfehler) console.log(`  - ${m}`);
      ausgang = 2;
    }
    if (befunde.length) {
      console.log(`\n[leerlauf] ${befunde.length} Befund(e):`);
      for (const b of befunde) console.log(`  - ${b}`);
      ausgang = 1;
    } else if (!messfehler.length) {
      console.log(`\n[leerlauf] ok: ${routen.length} Route(n) × ${Object.keys(FENSTER).length} Fenster ohne Bilder im Leerlauf${NUR_ROUTEN.length ? '' : ', Lenis gleitet bei Rad, Anker und Navigation und steht danach wieder'}.`);
    }
  }
} finally {
  stopp();
}
process.exit(ausgang);
