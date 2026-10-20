// MAUS IM SCHMALEN FENSTER fuer `scripts/check-akkordeon.mjs` (dort Kopf, Punkt 10; Schritte a bis g unten).
//
// Seit 2026-10-19 (R33-a) ein eigenes Modul: Es prueft jetzt zwei Akkordeons, die Leistungskarten der Startseite und die
// Mitarbeiterstimmen auf /karriere. Beide klappen unter 1024 px beim Darueberfahren auf und gleiten mittig, geschuetzt
// durch die Zeigerabsicht (`useZeigerAbsicht` in `components/akkordeonMobil.ts`). In der Hauptdatei laege der Pruefer
// sonst ueber 700 Zeilen.
//
// WAS FUER DIE STIMMEN ANDERS IST: Die offene Stimme ist 500 px hoch und fuellt fast den freien Bereich. Nach dem Gleiten
// liegt der Zeiger deshalb meist auf ihr. Der Weg in (c) beginnt dann am naechsten Streifen (ohne dort zu ruhen), und das
// Mausrad in (d) dreht genau so weit, dass ein zugeklappter Streifen unter den Zeiger kommt. Mit festen 260 px wie bis
// dahin lag der Zeiger danach auf keinem Streifen (am alten Build mit Stimme 5 gemessen: unter der letzten Stimme, Plan
// R33-a Phase 1), und (d) haette auch die alte Kette bestanden. Liegt nach dem Rad keine zugeklappte Karte unter dem
// Zeiger: Messfehler.
import { FREI, KARTEN, popupSchliessen } from './akkordeon-seite.mjs';

/**
 * `karte`: wird in (a) bei 75 % der Fensterhoehe ueberfahren. `zweiterKlick`: Ein Klick auf die offene, angeschnittene
 * Karte holt sie mittig ins Bild (Stimmen, `zeigen`); bei den Leistungskarten folgt er dem Link und wird nicht geprueft.
 */
export const MAUS_ZIELE = [
  { route: '/', sektion: '#leistungen', karte: 4, zweiterKlick: false },
  { route: '/karriere', sektion: '#stimmen', karte: 3, zweiterKlick: true },
];

/** Zwei echte Fenster; die Gegenprobe nur in 900 × 800, einmal ohne Mitgleiten, einmal mit eingespielter Kette. */
export const mausFenster = (gegenprobe) => (gegenprobe
  ? [{ width: 900, height: 800, fehler: 'ohne Gleiten' }, { width: 900, height: 800, fehler: 'Kette' }]
  : [{ width: 900, height: 800 }, { width: 393, height: 851 }]);

/** Die alte Kette (O8): Was unter den Zeiger kommt, geht auf, wie frueher per `mouseenter`. */
const KETTE = () => document.addEventListener('pointerover', (e) => {
  const karte = e.target instanceof Element ? e.target.closest('[data-akk-offen="false"]') : null;
  if (karte && window.__ccKetteAn) karte.click();
}, true);

/** Lage der Karte i samt Soll-Oberkante (mittig im freien Bereich wie `mittigeOberkante`). */
const LAGE = (sel, i) => {
  const karten = window.__ccKarten(sel);
  const r = karten[i].getBoundingClientRect();
  const f = window.__ccFrei();
  const platz = f.unten - f.oben;
  const soll = r.height + 24 <= platz ? f.oben + (platz - r.height) / 2 : f.oben + 12;
  return { oben: r.top, unten: r.bottom, x: r.left + r.width / 2, soll, frei: f, offen: karten.findIndex((k) => window.__ccOffen(k)), pfad: location.pathname };
};

/**
 * Mitte des zugeklappten Streifens, der `y` am naechsten liegt, lieber darunter. `sichtbar`: nur Streifen, deren Mitte
 * der Zeiger an Stelle `x` wirklich trifft (Treffertest, also nicht unter einer festen Leiste).
 */
const STREIFEN_BEI = (sel, x, y, sichtbar) => {
  const mitten = window.__ccKarten(sel).filter((k) => !window.__ccOffen(k)).map((k) => {
    const r = k.getBoundingClientRect();
    const m = r.top + r.height / 2;
    return sichtbar && document.elementFromPoint(x, m)?.closest('[data-akk-offen]') !== k ? null : m;
  }).filter((m) => m !== null);
  const unten = mitten.filter((m) => m > y).sort((a, b) => a - b)[0];
  const oben = mitten.filter((m) => m < y).sort((a, b) => b - a)[0];
  return unten ?? oben ?? null;
};

/**
 * Zugeklappte Karte, die frei im Bild liegt (fuer f und e). Lieber nicht die unter dem Zeiger (`zeigerY`): Nach dem
 * Mausrad in (d) liegt ein Streifen genau mittig unter ihm, die Fahrt zu seiner Mitte waere keine Bewegung (gefunden im
 * ersten Lauf, 19.10.). Gibt es keine andere (Stimmen: neben der 500 px hohen offenen Karte oft nur dieser Streifen), dann
 * dieselbe Karte an anderer Stelle, ein Viertel der Breite von links: auch das ist eine echte Bewegung.
 */
const FREIE_KARTE = (sel, zeigerY = -1) => {
  const f = window.__ccFrei();
  const karten = window.__ccKarten(sel);
  let notfall = null;
  for (let i = 0; i < karten.length; i++) {
    if (window.__ccOffen(karten[i])) continue;
    const r = karten[i].getBoundingClientRect();
    const unterZeiger = zeigerY >= r.top && zeigerY <= r.bottom;
    const x = r.left + r.width * (unterZeiger ? 0.25 : 0.5);
    const y = r.top + 32;
    // Treffertest genuegt gegen die festen Leisten; der Rand von 4 px nur gegen Kanten. (Bis R33-a 20 px: In 900 × 800
    // bleiben neben der 500 px hohen offenen Stimme oben und unten je 58 px, kein Streifen laege dann noch „frei“.)
    if (y > f.oben + 4 && y < f.unten - 4 && document.elementFromPoint(x, y)?.closest('[data-akk-offen]') === karten[i]) {
      if (!unterZeiger) return { i, x, y };
      notfall ??= { i, x, y };
    }
  }
  return notfall;
};

const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/** Ein Ziel in einem Fenster pruefen; schreibt in `befunde`, `messfehler` und `zeilen` (Tabelle der Hauptdatei). */
export async function pruefeMaus({ puppeteer, basis, ziel, fenster: mf, befunde, messfehler, zeilen, grenzeMitte }) {
  const { route, sektion, karte: k, zweiterKlick } = ziel;
  const name = `${route} ${sektion}, Maus ${mf.width} × ${mf.height}${mf.fehler ? ` (Gegenprobe: ${mf.fehler})` : ''}`;
  const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
  try {
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await seite.evaluateOnNewDocument(KARTEN);
    await seite.evaluateOnNewDocument(FREI);
    if (mf.fehler === 'Kette') await seite.evaluateOnNewDocument(KETTE);
    await seite.setViewport({ width: mf.width, height: mf.height, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
    await popupSchliessen(seite, route);
    await seite.evaluate((sel, i) => { const karte = window.__ccKarten(sel)[i]; window.scrollTo(0, karte.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.75); }, sektion, k);
    // Erst messen, wenn der Behaelter eingeblendet ist und die Karte ruhig steht: Er blendet beim ersten Erscheinen ein
    // (`whileInView`, y 20 → 0, 0,5 s), beim ersten Laden eines Browsers erst nach rund 1,2 s (Hauptthread belegt).
    const ruhig = await seite.waitForFunction((sel, i) => new Promise((r) => {
      const karte = window.__ccKarten(sel)[i];
      const stil = getComputedStyle(karte.parentElement);
      if (stil.opacity !== '1' || stil.transform !== 'none') return r(false);
      const a = karte.getBoundingClientRect().top;
      setTimeout(() => r(Math.abs(karte.getBoundingClientRect().top - a) < 0.5), 300);
    }), { timeout: 8000, polling: 350 }, sektion, k).then(() => true, () => false);
    if (!ruhig) messfehler.push(`${name}: Karten nach dem Scrollen nach 8 s nicht eingeblendet oder nicht ruhig, Test nicht aussagekraeftig`);
    if (!(await seite.evaluate(() => matchMedia('(hover: hover)').matches))) messfehler.push(`${name}: Fenster meldet kein (hover: hover), Test nicht aussagekraeftig`);
    if (mf.fehler === 'ohne Gleiten') await seite.evaluate(() => { window.scrollTo = () => {}; });
    if (mf.fehler === 'Kette') await seite.evaluate(() => { window.__ccKetteAn = true; });
    const lage = (i) => seite.evaluate(LAGE, sektion, i);
    const start = await lage(k);
    const kette = [];
    const mittigFehler = (l, was) => {
      const ganz = l.oben >= l.frei.oben - 1 && l.unten <= l.frei.unten + 1;
      if (Math.abs(l.oben - l.soll) > grenzeMitte && !(l.frei.amRand && ganz)) {
        befunde.push(`${name}: ${was}: offene Karte nicht mittig im freien Bereich (${Math.round(l.frei.oben)}–${Math.round(l.frei.unten)} px), Oberkante ${Math.round(l.oben)} statt ${Math.round(l.soll)}${ganz ? '' : `, ${Math.round(Math.max(l.frei.oben - l.oben, l.unten - l.frei.unten))} px verdeckt`}`);
      }
    };
    // (a) Waagerecht von links heran (Rand ausserhalb der Karten), dann ruhen
    const y0 = start.oben + 32;
    await seite.mouse.move(4, y0);
    await seite.mouse.move(start.x, y0, { steps: 4 });
    await warte(1600);
    const a = await lage(k);
    if (a.offen !== k) befunde.push(`${name}: nach dem Darueberfahren ist Karte ${a.offen + 1} offen statt der unter dem Zeiger (${k + 1})`);
    else mittigFehler(a, 'Darueberfahren');
    // (b) Ruhe: Es darf nichts mehr aufgehen oder gleiten
    await warte(1200);
    const b = await lage(k);
    if (b.offen !== a.offen || Math.abs(b.oben - a.oben) > 2) kette.push(`in Ruhe nach dem Gleiten: offen ${a.offen + 1} → ${b.offen + 1}, Karte ${k + 1} ${Math.round(a.oben)} → ${Math.round(b.oben)} px`);
    // (c) Weg ueber die Streifen zur Mitte der offenen Karte, 20 ms je Schritt (schneller als die Ruhe von 120 ms). Liegt
    //     der Zeiger schon auf der offenen Karte (Stimmen), beginnt der Weg am naechsten Streifen, ohne dort zu ruhen.
    const zielY = (b.oben + b.unten) / 2;
    let startY = y0;
    if (y0 >= b.oben && y0 <= b.unten) {
      const streifen = await seite.evaluate(STREIFEN_BEI, sektion, start.x, zielY, true);
      if (streifen === null) messfehler.push(`${name}: kein zugeklappter Streifen frei im Bild fuer den Weg (c)`);
      else startY = streifen;
    }
    await seite.mouse.move(start.x, startY);
    for (let s = 1; s <= 8; s++) {
      await seite.mouse.move(start.x, startY + ((zielY - startY) * s) / 8);
      await warte(20);
    }
    await warte(1200);
    const c = await lage(k);
    if (c.offen !== b.offen) kette.push(`auf dem Weg zur offenen Karte: offen ${b.offen + 1} → ${c.offen + 1}`);
    // (d) Mausrad bei ruhendem Zeiger, genau so weit, dass ein zugeklappter Streifen unter ihn kommt (Kopf)
    const streifenRad = await seite.evaluate(STREIFEN_BEI, sektion, start.x, zielY, false);
    await seite.mouse.wheel({ deltaY: streifenRad === null ? 260 : streifenRad - zielY });
    await warte(1500);
    const d = await lage(k);
    if (d.offen !== c.offen) kette.push(`Mausrad bei ruhendem Zeiger: offen ${c.offen + 1} → ${d.offen + 1}`);
    else if (!mf.fehler) {
      // Liegt nach dem Rad kein zugeklappter Streifen unter dem Zeiger, haette auch die alte Kette nichts geoeffnet (Kopf).
      // Nicht in der Gegenprobe: Ohne Mitgleiten (`scrollTo` leer) scrollt dort auch das Rad nicht, das ist gewollt.
      const darunter = await seite.evaluate((sel, x, y) => {
        const karte = document.elementFromPoint(x, y)?.closest('[data-akk-offen]');
        return karte && window.__ccKarten(sel).includes(karte) ? !window.__ccOffen(karte) : null;
      }, sektion, start.x, zielY);
      if (darunter !== true) messfehler.push(`${name}: nach dem Mausrad liegt keine zugeklappte Karte unter dem Zeiger, Schritt (d) nicht aussagekraeftig`);
    }
    if (kette.length) befunde.push(`${name}: Kette (${kette.join('; ')})`);
    // (f) Nach dem Mausrad auf eine andere Karte fahren und ruhen: Sie muss aufgehen (Gegenstueck zu d)
    let hoverText = '';
    const neu = mf.fehler ? null : await seite.evaluate(FREIE_KARTE, sektion, zielY);
    if (!mf.fehler && !neu) messfehler.push(`${name}: keine zugeklappte Karte frei im Bild fuer das Darueberfahren nach dem Mausrad`);
    else if (neu) {
      await warte(400);
      await seite.mouse.move(neu.x, neu.y, { steps: 5 });
      await warte(1600);
      const f = await lage(neu.i);
      hoverText = `, danach Karte ${neu.i + 1} per Darueberfahren ${f.offen === neu.i ? 'offen' : 'NICHT offen'}`;
      if (f.offen !== neu.i) befunde.push(`${name}: nach dem Mausrad oeffnet Darueberfahren die Karte ${neu.i + 1} nicht (offen ist ${f.offen + 1})`);
      else mittigFehler(f, `Darueberfahren nach dem Mausrad (Karte ${neu.i + 1})`);
    }
    // (e) Klick auf eine zugeklappte Karte, die frei im Bild liegt: klappt auf und gleitet mittig, kein Seitenwechsel
    const ziel2 = mf.fehler ? null : await seite.evaluate(FREIE_KARTE, sektion);
    let klickText = 'keine freie Karte';
    if (!mf.fehler && !ziel2) messfehler.push(`${name}: keine zugeklappte Karte frei im Bild fuer den Klick`);
    else if (ziel2) {
      await seite.mouse.click(ziel2.x, ziel2.y);
      await warte(1600);
      const e = await lage(ziel2.i);
      klickText = `Klick auf Karte ${ziel2.i + 1}: ${e.pfad === route ? 'aufgeklappt' : `Seitenwechsel nach ${e.pfad}`}`;
      if (e.pfad !== route) befunde.push(`${name}: Klick auf die zugeklappte Karte ${ziel2.i + 1} folgte dem Link (${e.pfad}) statt aufzuklappen`);
      else if (e.offen !== ziel2.i) befunde.push(`${name}: nach dem Klick auf Karte ${ziel2.i + 1} ist Karte ${e.offen + 1} offen`);
      else mittigFehler(e, `Klick auf Karte ${ziel2.i + 1}`);
    }
    // (g) Nur Stimmen: offene Karte zur Haelfte unter die Knopfleiste schieben, auf ihren sichtbaren Teil klicken. Sie bleibt
    //     offen und gleitet mittig (`zeigen`). Der Zeiger faehrt vorher echt hin; die Zeigerabsicht darf dabei nichts tun.
    let zweitText = '';
    if (zweiterKlick && ziel2 && !mf.fehler) {
      await seite.evaluate((sel, i) => {
        const r = window.__ccKarten(sel)[i].getBoundingClientRect();
        window.scrollBy(0, r.top - (window.__ccFrei().unten - 140));
      }, sektion, ziel2.i);
      await warte(900);
      const g0 = await lage(ziel2.i);
      const verdeckt = Math.round(g0.unten - g0.frei.unten);
      await seite.mouse.move(g0.x, g0.oben + 70, { steps: 5 });
      await warte(400);
      await seite.mouse.click(g0.x, g0.oben + 70);
      await warte(1600);
      const g = await lage(ziel2.i);
      zweitText = `, zweiter Klick: ${verdeckt} px verdeckt → Oberkante ${Math.round(g.oben)} (Mitte ${Math.round(g.soll)})`;
      if (verdeckt < 100) messfehler.push(`${name}: Karte ${ziel2.i + 1} vor dem zweiten Klick nur ${verdeckt} px verdeckt, Schritt (g) nicht aussagekraeftig`);
      if (g.offen !== ziel2.i) befunde.push(`${name}: nach dem zweiten Klick auf die offene Karte ${ziel2.i + 1} ist Karte ${g.offen + 1} offen`);
      else mittigFehler(g, `zweiter Klick auf die angeschnittene offene Karte ${ziel2.i + 1}`);
    }
    zeilen.push(`| ${name} | – | – | Karte ${k + 1} ${Math.round(start.oben)} → ${Math.round(a.oben)} px (Mitte ${Math.round(a.soll)}), ${kette.length ? 'Kette' : 'keine Kette'}${hoverText}, ${klickText}${zweitText} | ${(a.oben - a.soll >= 0 ? '+' : '') + (a.oben - a.soll).toFixed(1)} px | – | – | – |`);
  } finally {
    await browser.close();
  }
}
