// Akkordeon-Check: Klappen die Bildkarten mobil auf, ohne in jedem Bild das Layout neu zu rechnen? Stimmt danach die
// Ruhelage, auch nach einem Tipp mitten in der Animation?
//
// AUFRUF:
//   npm run akkordeon                  Startseite (Leistungen, Autoaufbereitung) und /karriere (Stellen)
//   npm run akkordeon -- /karriere      nur die Akkordeons dieser Route (unter Git Bash `MSYS_NO_PATHCONV=1` davor)
//   npm run akkordeon -- --protokoll   jeden Schritt mit Zustand ausgeben, Spuren nach output/akkordeon/ (Fehlersuche)
//   npm run akkordeon -- --gegenprobe  PRUEFT DEN PRUEFER: spielt eine Hoehen-Transition per CSS ein (so ruckelte es bis
//                                      2026-10-16) und verlangt, dass sie als Layout pro Bild gemeldet wird (Exit 1 sonst)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst.
//
// ANLASS: Der User sah auf einem Galaxy A56, dass die Karten der Startseite „nicht so schön weich“ aufgehen. Gemessen:
// Framer animierte die Hoehe, jedes Bild loeste Layout, Stil, Malen und Ebenenaufbau der ganzen Seite aus (16–18 ms je
// Bild bei 4-facher CPU-Drosselung). Seitdem springt die Hoehe einmal und die Bewegung laeuft per `transform` auf dem
// Compositor (`components/akkordeonMobil.ts`). Plan und Messwerte: docs/mobil-startseite/tasks/.
//
// GEMESSEN (393 × 851, Pixeldichte 2,75, Touch, CPU 4-fach gedrosselt, echter Tipp per `touchscreen.tap`):
//   HART (Exit 1):
//   - LAYOUT PRO BILD: Layout-Laeufe des Hauptthreads SPAET in der Animation, also 150–650 ms nach dem Tipp. Der
//     Wechsel selbst braucht Layout nur am Anfang (Zustand, Messen vor und nach dem Wechsel, Ausgleich der
//     Scrollposition); spaeter kommen hoechstens einzelne (Hintergrundfoto nach dem Dekodieren, Videostart der
//     Lackierkarte). Eine Hoehen-Animation rechnet dagegen bis zum Schluss in jedem Bild. Gemessen wird deshalb der
//     ANTEIL der Hauptthread-Bilder dieses Zeitraums, die ein Layout rechnen (Layouts je `BeginMainThreadFrame`): Ab
//     ANTEIL_LAYOUT und mindestens MIN_SPAETE_LAYOUTS gilt es als Layout pro Bild.
//     BILDER, NICHT RUECKRUFE: Chrome schreibt je `requestAnimationFrame`-Rueckruf ein `FireAnimationFrame`. Seit die
//     Seite beim Tipp zur Mitte mitgleitet (2026-10-17), rufen Scroll-Horcher je Bild weitere Rueckrufe ab (gemessen bis
//     zu sechs je Bild); als Bilder gezaehlt galt die eingespielte Hoehen-Animation nur als 24 %. Parallel entstanden
//     zwei Abhilfen: Rueckrufe ohne Luecke ueber 2 ms als ein Bild (Zweig Akkordeon/FAQ) und `BeginMainThreadFrame`
//     (R26, unten). Beim Zusammenfuehren am 2026-10-18 blieb `BeginMainThreadFrame`: Es zaehlt jedes Bild genau einmal,
//     gleich wie viele Rueckrufe es hat, und auch Bilder ganz ohne Rueckruf.
//     WARUM KEINE FESTE ANZAHL (so bis 2026-10-16 spaet): Unter Rechnerlast schafft eine Hoehen-Animation nur wenige
//     Bilder. Die Gesamtzahl in 700 ms fiel in der Gegenprobe auf 13 (Grenze 20), die spaeten auf 4 bis 5: Beides
//     meldete nichts, obwohl in jedem Bild Layout lief. Der Anteil bleibt auch dann bei rund 100 %.
//     WARUM `BeginMainThreadFrame` UND NICHT `FireAnimationFrame` (seit 2026-10-17, R26): Bis dahin zaehlte der Pruefer
//     rAF-Rueckrufe als Bilder. Die lieferte fast nur Lenis' Dauerschleife, eins je Bild. Seit Lenis im Leerlauf steht,
//     kommen beim Tipp nur noch einzelne; der Nenner fiel auf 0 bis 1 (`Math.max(1, …)`), gemeldet wurden „3 Layouts in
//     1 Bild, 300 %“ (Fehlalarm), und die Gegenprobe war nur zufaellig gruen. `BeginMainThreadFrame` zaehlt jedes Bild,
//     das der Hauptthread rechnet, egal wer es anfordert (Hoehen-Animation, laufende Compositor-Animationen, rAF).
//   - COMPOSITOR: jede Animation mit `compositeFailed` ungleich 0 (Chrome rechnet sie auf dem Hauptthread).
//   - RUHELAGE nach dem Tipp und nach einer Unterbrechung (zweiter Tipp nach 150 ms): genau die getippte Karte offen,
//     die uebrigen 64 px, Fenster so hoch wie die Karte, keine laufende Skript-Animation, Abstaende 10 px, und die
//     getippte Karte steht noch im Bild. Letzteres fand am 2026-10-16 einen alten Fehler: Lenis scrollte beim ersten
//     Tipp auf eine Stellenkarte (/karriere#bewerbung) rund 7.000 px weit (Behebung in `hooks/useSmoothScroll.ts`).
//   - GETIPPTE KARTE GLEITET OHNE SPRUNG IN DIE MITTE (seit 2026-10-17; bis dahin „bleibt stehen“): offene Karte
//     OBERHALB des Fensters (der Normalfall beim Herunterscrollen), Tipp auf die letzte Karte. Deren Oberkante wird in
//     jedem Bild gemessen:
//       SPRUNG — keine Bewegung schneller als MAX_TEMPO px/ms zwischen zwei Bildern. Das Gleiten zur Mitte erreicht
//       hoechstens rund 2 px/ms; der echte Fehler vom 16.10. (Build 19:24, Rueckmeldung vom A56) sprang in EINEM Bild
//       um 276 px nach oben aus dem Bild (Oberkante 268 → −8 px, rund 17 px/ms). Gelesen wird nach jedem Bild, nicht im
//       rAF-Rueckruf (`scripts/lib/bahn.mjs`, seit 18.10.: sonst Scheinspruenge, seit Lenis sich erst beim Gleiten anmeldet).
//       MITTE — nach dem Auslaufen steht die Oberkante hoechstens GRENZE_MITTE px neben der Mitte des freien Bereichs
//       (zwischen den Leisten mit `data-feste-leiste`, wie `lib/freierBereich.ts`) und die Karte ganz darin. Ausnahme
//       nur, wenn die Seite am Anfang oder Ende anschlaegt und gar nicht weiter scrollen kann (dann: ganz sichtbar).
//       Anlass (User, 2026-10-17): Bei 60 % Fensterhoehe getippt, lagen 83 px der Karte unter der Knopfleiste.
//   - SCHATTEN NUR AN DER SICHTBAREN KARTE (seit 2026-10-17): kein Element einer Karte mit sichtbarem `box-shadow`
//     (Deckkraft samt Vorfahren ueber 2 %), das ueber die Karte hinausragt. Der echte Fehler: Das 340 px hohe Fenster
//     jeder eingeklappten Karte stand 276 px ueber dem Streifen und warf seinen Schatten; zehn davon dunkelten den Rand
//     neben der Spalte ab, die Spalte wirkte wie ein „weißes Rechteck“ bis zur Ueberschrift (gemessen 144 statt 179).
//   - TIPP-HERVORHEBUNG: Jede Karte muss `-webkit-tap-highlight-color: transparent` tragen. Android zeichnet die
//     Hervorhebung ueber den Kasten des Links, der mobil sofort so hoch ist wie die offene Karte: Sie lag ueber den
//     naechsten Karten („die naechste Karte blitzt weiss auf“, User 16.10.). Kopfloses Chrome zeichnet sie nicht,
//     darum wird die berechnete Eigenschaft geprueft.
//   HINWEIS (kein Exit): Hauptthread-Zeit je Hauptthread-Bild und Anteile (Stil, Layout, Malen, Ebenen, Skript).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md):
//  1. KEIN ECHTES GERAET: Kopfloses Chrome mit gedrosselter CPU. Rastern und GPU des Telefons misst es nicht, die
//     Zeitwerte sind Vergleichswerte zwischen zwei Builds, keine Geraetewerte. Darum sind sie nur Hinweis.
//  2. NUR DIESE DREI AKKORDEONS. Die Mitarbeiterstimmen auf /karriere (`Stimmen.tsx`) animieren mobil weiterhin die
//     Hoehe, ebenso die FAQ (`FAQSection.tsx`, 0,24 s); beide misst sie nicht.
//  3. GEOMETRIE, KEIN AUSSEHEN: Ob ein Zwischenbild gut aussieht (Bildausschnitt, Schleier, Plaketten), zeigt nur ein
//     Bildschirmfoto mitten in der Animation (`document.getAnimations()` anhalten).
//  4. LAYOUT ZAEHLT EREIGNISSE, NICHT DAUER. Eine Animation, die statt Layout in jedem Bild neu MALT (z. B. `clip-path`
//     auf dem Hauptthread), bleibt unter der Grenze; sie faellt nur ueber COMPOSITOR oder die Zeitwerte auf.
//  5. DESKTOP NICHT GEPRUEFT: Dort animiert Framer weiter `flexGrow` (unveraendert, kein Befund).
//  6. SPRUNG UND MITTE werden je Akkordeon in EINER Lage geprueft (offene Karte oben, Tipp auf die letzte), ohne
//     CPU-Drossel. Die Gegenprobe (`--gegenprobe`) schaltet dafuer `window.scrollTo` ab (Lenis scrollt darueber): ohne
//     Verankerung und ohne Gleiten muss SPRUNG oder MITTE fallen. Die erste Bildluecke nach dem Laden (im Kopflosen
//     rund 100 ms im GPU-Prozess) misst sie nicht. Ob die Bewegung SCHOEN aussieht (Kurve, Gleichlauf von Karte und
//     Seite), zeigt nur ein Telefon: Ein Gleiten mit falscher Kurve besteht beide Kriterien.
//  9. SCHATTEN prueft nur `box-shadow` (nicht `filter: drop-shadow`) und nur in der Ruhelage. Waehrend der Animation
//     ragt die Schattenebene der zuklappenden Karte kurz ueber sie hinaus, blendet dabei aber mit dem Oeffnungsgrad aus.
// 10. MAUS IM SCHMALEN FENSTER (seit 2026-10-19, R33; vom 17. bis 19.10. „Hover ohne Gleiten“). Unter 1024 px gibt es
//     Geraete mit Maus; dort klappt Darueberfahren auf und gleitet mittig wie ein Tipp (User: „dass wenn ich mit der Maus
//     drueber hover, das zentriert angezeigt wird“). Das Risiko ist die Kette von O8: Seite gleitet, naechste Karte unter
//     dem ruhenden Zeiger, geht auf, Seite gleitet weiter. Geprueft in 900 × 800 und 393 × 851 mit Maus, Karte 5 bei
//     75 % der Fensterhoehe: (a) nach dem Darueberfahren offen und mittig wie beim Tipp, (b) danach Ruhe ohne Kette,
//     (c) Weg ueber die Streifen zur offenen Karte (20 ms je Schritt, schneller als die Ruhe) oeffnet nichts, (d) Mausrad
//     bei ruhendem Zeiger oeffnet nichts, (f) danach auf eine andere Karte fahren und ruhen oeffnet sie, mittig (der
//     Schutz darf das Darueberfahren nicht abwuergen), (e) Klick auf eine zugeklappte Karte klappt auf, mittig, ohne
//     Seitenwechsel.
//     GEGENPROBE: Mitgleiten aus (`window.scrollTo` leer, muss „nicht mittig“ melden) und die alte Kette eingespielt (die
//     Seite klickt jede zugeklappte Karte an, die unter den Zeiger kommt, wie das fruehere `mouseenter`; muss „Kette“
//     melden). WAS SIE NICHT ZEIGT: Puppeteers Mausschritte sind sofort da, ein echtes Trackpad rollt nach; wer langsamer
//     als die Ruhezeit (120 ms) ueber einen Streifen faehrt, oeffnet ihn mit Absicht. Safari ist nicht geprueft; dort
//     schuetzt dieselbe Regel, solange Safari bei bewegtem Inhalt die Bildschirmkoordinaten nicht aendert.
//     Die Ausgangslage wird erst genommen, wenn der Behaelter eingeblendet ist und die Karte ruhig steht (seit 18.10.).
//  7. HERVORHEBUNG nur als Eigenschaft: Ob ein Geraet trotzdem etwas zeichnet (z. B. Fokusring), sieht nur ein Telefon.
//  8. EREIGNISSE VON VOR DEM START (gefunden 2026-10-16 spaet): Ein Renderer, der waehrend der vorigen Messung entstand
//     (Chrome haelt ihn fuer die naechste Seite vor), liefert beim Stopp seinen ganzen Puffer mit, auch Laden der Seite
//     und den Schliessklick des Pop-ups. Der Pruefer verankerte sein Fenster am ersten Klick der Spur, also an diesem
//     Schliessklick 1,5 s VOR dem Start, und zaehlte die 18 beim Laden gestarteten Animationen (Scroll-Verlauf der
//     Kartentexte, Glas der festen Leiste) als Compositor-Fehler. /karriere allein: nie; als dritte Seite im vollen Lauf:
//     meist, auch in der Gegenprobe (dort 2 von 3). Seitdem nur Ereignisse ab `TracingStartedInBrowser`; Hauptthread
//     und Fensteranfang kommen aus einer Marke, die der Klick-Horcher beim Treffer der Zielkarte setzt
//     (`console.timeStamp`). Fehlt die Marke: Messfehler (Exit 2) statt eines Urteils ueber die Seite. Und jede Seite
//     laeuft in einem eigenen Browser: Im gemeinsamen fehlte die Marke danach noch in 2 von 4 Laeufen ganz.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import puppeteer from 'puppeteer';
import { startePreview } from './lib/preview-server.mjs';
import { BAHN, schnellsteBewegung, zuVieleVerworfen } from './lib/bahn.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEGENPROBE = process.argv.includes('--gegenprobe');
const PROTOKOLL = process.argv.includes('--protokoll');
const NUR_ROUTEN = process.argv.slice(2).filter((a) => a.startsWith('/'));
const DROSSEL = 4;
/**
 * Layout pro Bild (Begruendung im Kopf): Anteil der Hauptthread-Bilder 150–650 ms nach dem Tipp mit Layout, und
 * Mindestzahl. 0,8 seit 2026-10-17 (vorher 0,6 gegen rAF-Rueckrufe): Ohne Lenis-Dauerschleife rechnet der Hauptthread
 * spaet nur noch die Bilder der laufenden Animationen, auf /#leistungen bei 4× nur 6–9. Gemessen (Build 17.10. 00:16):
 * normal 1–50 % (je nach Rechnerlast), Gegenprobe 93–112 %. Bei 0,6 laegen drei Einzel-Layouts in fuenf Bildern schon auf der Grenze.
 */
const ANTEIL_LAYOUT = 0.8;
const MIN_SPAETE_LAYOUTS = 3;
/** Schnellste erlaubte Bewegung der getippten Karte zwischen zwei Bildern, in px/ms (Begruendung im Kopf: SPRUNG). */
const MAX_TEMPO = 6;
/** Hoechste erlaubte Abweichung der offenen Karte von der Mitte des freien Bereichs nach dem Auslaufen, in px. */
const GRENZE_MITTE = 3;
const FENSTER = { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true };
/** Marke in der Spur (`console.timeStamp`), gesetzt vom Klick-Horcher, wenn der gemessene Tipp die Zielkarte trifft. */
const KLICK_MARKE = 'cc-akkordeon-klick';
/** `tipp`: Karte des gemessenen Tipps. Das Ziel der Unterbrechung waehlt der Lauf selbst (sichtbare Karte, siehe 2.). */
const ZIELE = [
  { route: '/', sektion: '#leistungen', tipp: 2 },
  { route: '/', sektion: '#autoaufbereitung', tipp: 2 },
  { route: '/karriere', sektion: '#jobbereiche', tipp: 1 },
];
/**
 * So ruckelte es bis 2026-10-16: Die Hoehe animiert, Layout in jedem Bild. Dazu die Tipp-Hervorhebung von vorher und
 * der Schatten am 340-px-Fenster vom 16./17.10. (das „weisse Rechteck“).
 */
const FEHLER_CSS = 'a[aria-expanded]{transition:height 600ms ease !important;-webkit-tap-highlight-color:rgb(47 128 237 / 0.18) !important}'
  + '[data-akk="fenster"]{box-shadow:0 26px 60px -32px rgb(21 26 33 / 0.55) !important}';
const KATEGORIEN = { UpdateLayoutTree: 'Stil', Layout: 'Layout', Paint: 'Malen', PrePaint: 'Malen', Layerize: 'Ebenen', Commit: 'Ebenen', FireAnimationFrame: 'Skript', EventDispatch: 'Skript' };

if (!fs.existsSync(path.join(wurzel, 'dist', 'index.html'))) {
  console.error('[akkordeon] dist/ fehlt, bitte zuerst `npm run build`.');
  process.exit(1);
}

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const befunde = [];
const zeilen = [];
/** Messfehler (Tipp nicht moeglich): kein Befund ueber die Seite, aber Exit 2, damit niemand ein Gruen falsch liest. */
const messfehler = [];

/**
 * Karten EINES Akkordeons: die Geschwister der ersten Karte in der Sektion. Auf /karriere stehen zwei Akkordeons
 * (Stellen, Ausbildung) in derselben Sektion; zusammengezaehlt waere „genau eine offen“ dort immer falsch.
 */
const KARTEN = `window.__ccKarten = (sel) => {
  const erste = document.querySelector(sel + ' a[aria-expanded]');
  return erste ? [...erste.parentElement.querySelectorAll(':scope > a[aria-expanded]')] : [];
};`;

/** Lage aller Karten des Akkordeons, wie gerade zu sehen. */
const ZUSTAND = (sel) => window.__ccKarten(sel).map((a) => {
  const r = a.getBoundingClientRect();
  const fenster = a.querySelector('[data-akk="fenster"]')?.getBoundingClientRect();
  return {
    offen: a.getAttribute('aria-expanded') === 'true',
    oben: r.top,
    hoehe: r.height,
    sichtbar: fenster ? fenster.bottom - r.top : r.height,
    skript: a.getAnimations({ subtree: true }).filter((x) => x.playState === 'running' && x.constructor === Animation).length,
    fensterHoehe: window.innerHeight,
  };
});

/**
 * Schatten ausserhalb der sichtbaren Karte (Kopf: SCHATTEN). Je Fund: Karte, Element, wie weit es ueber die Karte ragt.
 * Deckkraft samt Vorfahren bis zur Karte, damit die ausgeblendete Schattenebene eingeklappter Karten nicht zaehlt.
 */
const SCHATTEN = (sel) => window.__ccKarten(sel).flatMap((karte, i) => {
  const kr = karte.getBoundingClientRect();
  return [karte, ...karte.querySelectorAll('*')].flatMap((el) => {
    const stil = getComputedStyle(el);
    if (stil.boxShadow === 'none' || stil.display === 'none' || stil.visibility === 'hidden') return [];
    let deckkraft = 1;
    for (let e = el; e && e !== karte.parentElement; e = e.parentElement) deckkraft *= Number(getComputedStyle(e).opacity);
    if (deckkraft <= 0.02) return [];
    const r = el.getBoundingClientRect();
    const oben = kr.top - r.top;
    const unten = r.bottom - kr.bottom;
    if (oben <= 1 && unten <= 1) return [];
    return [`Karte ${i}: ${el.dataset.akk ? `[data-akk="${el.dataset.akk}"]` : el.tagName.toLowerCase()} ragt ${Math.round(Math.max(oben, unten))} px ${oben > unten ? 'ueber' : 'unter'} die Karte und wirft Schatten`];
  });
});

/** Freier Bereich zwischen den festen Leisten wie in `lib/freierBereich.ts`, dazu Scrollgrenzen (`window.__ccFrei`). */
const FREI = `window.__ccFrei = () => {
  let oben = 0;
  let unten = window.innerHeight;
  document.querySelectorAll('[data-feste-leiste]').forEach((leiste) => {
    const r = leiste.getBoundingClientRect();
    if (r.height === 0 || r.bottom <= 0 || r.top >= window.innerHeight) return;
    if (leiste.dataset.festeLeiste === 'oben') oben = Math.max(oben, r.bottom);
    else unten = Math.min(unten, r.top);
  });
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return { oben, unten, amRand: window.scrollY <= 1 || window.scrollY >= max - 1 };
};`;

/** Ruhelage pruefen; liefert Fehlertexte. */
const ruhelageFehler = (karten, offen) => {
  const fehler = [];
  karten.forEach((k, i) => {
    if (k.offen !== (i === offen)) fehler.push(`Karte ${i} ${k.offen ? 'offen' : 'zu'}, erwartet ${i === offen ? 'offen' : 'zu'}`);
    if (i !== offen && Math.abs(k.hoehe - 64) > 1) fehler.push(`Karte ${i} ${Math.round(k.hoehe)} px statt 64`);
    if (Math.abs(k.sichtbar - k.hoehe) > 1) fehler.push(`Karte ${i}: Fenster ${Math.round(k.sichtbar)} px, Karte ${Math.round(k.hoehe)} px`);
    if (k.skript) fehler.push(`Karte ${i}: ${k.skript} Animation(en) laufen noch`);
    if (i === offen && (k.oben >= k.fensterHoehe || k.oben + k.hoehe <= 0)) {
      fehler.push(`getippte Karte ${i} nicht mehr im Bild (Oberkante ${Math.round(k.oben)} px), die Seite ist gesprungen`);
    }
    if (i > 0) {
      const abstand = k.oben - (karten[i - 1].oben + karten[i - 1].hoehe);
      if (Math.abs(abstand - 10) > 1) fehler.push(`Abstand vor Karte ${i}: ${Math.round(abstand)} px statt 10`);
    }
  });
  return fehler;
};

const { basis, stopp } = await startePreview(4187);
/**
 * Jede Seite in einem EIGENEN Browser (Pflichtfrage 8): In einem gemeinsamen Browser uebernahm die dritte Seite einen
 * Renderer, der waehrend der vorigen Messung entstanden war. Dessen Spur enthielt Ereignisse von vor dem Start, oder es
 * fehlten die nach dem Start ganz (Klick-Marke nicht aufgezeichnet, 2 von 4 Laeufen am 2026-10-16).
 */
let browser;
try {
  for (const { route, sektion, tipp: ziel } of ZIELE.filter((z) => !NUR_ROUTEN.length || NUR_ROUTEN.includes(z.route))) {
    browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await seite.evaluateOnNewDocument(KARTEN);
    await seite.evaluateOnNewDocument(FREI);
    await seite.evaluateOnNewDocument(BAHN);
    await seite.setViewport(FENSTER);
    await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
    if (GEGENPROBE) await seite.addStyleTag({ content: FEHLER_CSS });
    await seite.evaluate((sel) => window.scrollTo(0, document.querySelector(`${sel} a[aria-expanded]`).getBoundingClientRect().top + window.scrollY - 140), sektion);
    await warte(1600);
    // Das Stellen-Pop-up auf /karriere (nach 1,2 s, unten) laege sonst ueber den getippten Karten. Unter Rechnerlast
    // kommt es spaeter; ein fester Zeitpunkt schloss es dann zu frueh, und es fing den gemessenen Tipp ab (2026-10-16).
    // Deshalb: auf das Pop-up warten (nur dort, wo es eins gibt), schliessen, warten bis es weg ist.
    if (route === '/karriere') {
      await seite.waitForSelector('[role="dialog"]', { timeout: 6000 }).catch(() => {});
      await seite.evaluate(() => document.querySelector('[role="dialog"] button[aria-label*="schließen"]')?.click());
      await seite.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 4000 }).catch(() => {});
    }
    await warte(1000);
    /**
     * Tippt auf Karte i, aber nur, wenn an dieser Stelle wirklich Karte i liegt (Treffertest). Sonst gaebe ein Tipp
     * ins Falsche falsche Befunde: Am 2026-10-16 traf unter Rechnerlast ein Tipp auf /karriere die Mitarbeiterstimmen
     * darunter (die noch die Hoehe animieren), gemeldet wurden 33 Layouts und 18 Animationen abseits des Compositors.
     * Liefert false, wenn die Karte auch nach einmaligem Hinscrollen nicht frei liegt (dann Messfehler, kein Befund).
     */
    const tippe = async (i, { warten = true } = {}) => {
      const lage = () => seite.evaluate((sel, k) => {
        const karte = window.__ccKarten(sel)[k];
        const r = karte.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + 24;
        const oben = document.elementFromPoint(x, y);
        return { x, y, frei: !!oben && oben.closest('a[aria-expanded]') === karte, offen: karte.getAttribute('aria-expanded') === 'true' };
      }, sektion, i);
      let p = await lage();
      if (p.offen) {
        // Ein Tipp auf die offene Karte folgt ihrem Link: Seite weg, alle weiteren Messungen ungueltig.
        messfehler.push(`${route} ${sektion}: Karte ${i} ist schon offen, Tipp ausgelassen`);
        return false;
      }
      if (!p.frei) {
        await seite.evaluate((sel, k) => window.scrollBy(0, window.__ccKarten(sel)[k].getBoundingClientRect().top - 250), sektion, i);
        await warte(700);
        p = await lage();
      }
      if (!p.frei) {
        messfehler.push(`${route} ${sektion}: Karte ${i} liegt nicht frei (Treffertest), Tipp ausgelassen`);
        return false;
      }
      await seite.touchscreen.tap(p.x, p.y);
      // Unter Last kommt der Tipp verspaetet an: warten, bis die Karte offen ist (hoechstens 5 s). Nicht beim
      // gemessenen Tipp: Das Abfragen liefe dort mit in die Spur.
      if (warten) {
        await seite.waitForFunction((sel, k) => window.__ccKarten(sel)[k]?.getAttribute('aria-expanded') === 'true', { timeout: 5000 }, sektion, i).catch(() => {
          messfehler.push(`${route} ${sektion}: Karte ${i} ging nach dem Tipp nicht auf`);
        });
      }
      return true;
    };
    /**
     * Wartet vor jeder Ruhelage, bis keine Skript-Animation der Karten mehr laeuft (hoechstens 3 s). Unter Rechnerlast
     * stocken die Bilder des Kopflosen; Lage und `playState` stehen dann auf dem letzten gemalten Bild (2026-10-16:
     * 98 % des Wegs 1,1 s nach dem Klick, gemeldet als „Animation laeuft noch“). Eine Animation, die nicht endet, faellt
     * weiter auf.
     */
    const ausgelaufen = () => seite.waitForFunction((sel) => window.__ccKarten(sel).every((a) => a.getAnimations({ subtree: true })
      .every((x) => x.constructor !== Animation || x.playState !== 'running')), { timeout: 3000, polling: 100 }, sektion).catch(() => {});
    const cdp = await seite.createCDPSession();
    const name = `${route} ${sektion}`;

    // 0. Tipp-Hervorhebung: muss an jeder Karte durchsichtig sein
    const hervorgehoben = await seite.evaluate((sel) => window.__ccKarten(sel).filter((a) => {
      const farbe = getComputedStyle(a).webkitTapHighlightColor;
      return farbe && farbe !== 'rgba(0, 0, 0, 0)' && farbe !== 'transparent';
    }).length, sektion);
    if (hervorgehoben) befunde.push(`${name}: ${hervorgehoben} Karte(n) mit Tipp-Hervorhebung (blitzt mobil ueber den naechsten Karten auf)`);

    /** Index der offenen Karte. */
    const offenIndex = () => seite.evaluate((sel) => window.__ccKarten(sel).findIndex((a) => a.getAttribute('aria-expanded') === 'true'), sektion);
    const protokoll = async (schritt) => {
      if (!PROTOKOLL) return;
      const z = await seite.evaluate((sel) => ({
        offen: window.__ccKarten(sel).findIndex((a) => a.getAttribute('aria-expanded') === 'true'),
        dialog: !!document.querySelector('[role="dialog"]'),
        y: Math.round(window.scrollY),
        pfad: location.pathname,
      }), sektion).catch(() => ({ fehler: 'Seite weg' }));
      console.log(`  [${route} ${sektion}] ${schritt}: ${JSON.stringify(z)}`);
    };

    // 1. Gemessener Tipp. Der Klick-Horcher (vor der Spur angelegt) haelt fest, ob der Tipp wirklich diese Karte traf,
    //    und setzt beim Treffer die Marke, an der das Messfenster beginnt (Pflichtfrage 8).
    await seite.evaluate((sel, k, marke) => {
      const karte = window.__ccKarten(sel)[k];
      window.__ccKlick = 'kein Klick';
      document.addEventListener('click', (e) => {
        const t = e.target instanceof Element ? e.target : null;
        const getroffen = t?.closest('a[aria-expanded]') === karte;
        if (getroffen) console.timeStamp(marke);
        window.__ccKlick = getroffen ? 'getroffen' : `${t?.tagName ?? '?'}.${String(t?.getAttribute('class') ?? '').slice(0, 40)}`;
      }, { capture: true, once: true });
    }, sektion, ziel, KLICK_MARKE);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: DROSSEL });
    // `.frame` liefert `BeginMainThreadFrame`, den Bildzaehler (siehe Kopf, R26).
    await seite.tracing.start({ categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame', 'devtools.timeline.animation', 'blink.animations'] });
    await protokoll(`vor gemessenem Tipp auf ${ziel}`);
    await tippe(ziel, { warten: false });
    await warte(900);
    const spur = JSON.parse(Buffer.from(await seite.tracing.stop()).toString('utf8'));
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    await protokoll('nach gemessenem Tipp');
    const klick = await seite.evaluate(() => window.__ccKlick);
    const alle = spur.traceEvents ?? spur;
    // Nur Ereignisse AB DEM START dieser Spur (Pflichtfrage 8).
    const spurStart = alle.find((e) => e.name === 'TracingStartedInBrowser')?.ts ?? 0;
    const ereignisse = alle.filter((e) => !e.ts || e.ts >= spurStart);
    // Hauptthread UND Fensteranfang aus der KLICK-MARKE, die der Horcher beim Treffer setzt (Pflichtfrage 8). Was davor
    // galt und warum es nicht hielt (alles 2026-10-16): der Thread mit den meisten Ereignissen (falsche Seite moeglich);
    // der Prozess des Hauptframes laut `TracingStartedInBrowser` (lieferte einmal einen Thread ohne ein Ereignis); der
    // erste Klick der Spur (Schliessklick des Pop-ups von vor dem Start); das erste Touch-Ereignis (unter Last kommt der
    // Klick spaet, der Wechsel rutschte in den spaeten Zeitraum).
    const marke = ereignisse.find((e) => e.name === 'TimeStamp' && e.args?.data?.message === KLICK_MARKE);
    const haupt = marke ? { pid: marke.pid, tid: marke.tid } : undefined;
    const tipp = marke?.ts ?? 0;
    const lauf = ereignisse.filter((e) => haupt && e.pid === haupt.pid && e.tid === haupt.tid && e.ph === 'X' && e.dur);
    const fenster = lauf.filter((e) => e.ts >= tipp && e.ts < tipp + 700_000);
    const layouts = fenster.filter((e) => e.name === 'Layout').length;
    const spaete = fenster.filter((e) => e.name === 'Layout' && e.ts >= tipp + 150_000 && e.ts < tipp + 650_000).length;
    /** Hauptthread-Bilder im Zeitraum (Begruendung im Kopf: nicht `FireAnimationFrame`, R26). */
    const hauptBilder = (von, bis) => ereignisse.filter((e) => haupt && e.pid === haupt.pid && e.tid === haupt.tid && e.name === 'BeginMainThreadFrame' && e.ts >= tipp + von && e.ts < tipp + bis).length;
    const spaeteBilder = hauptBilder(150_000, 650_000);
    const anteil = spaete / Math.max(1, spaeteBilder);
    const anteile = {};
    for (const e of fenster) if (KATEGORIEN[e.name]) anteile[KATEGORIEN[e.name]] = (anteile[KATEGORIEN[e.name]] ?? 0) + e.dur / 1000;
    const bilder = Math.max(1, hauptBilder(0, 700_000));
    const summe = Object.values(anteile).reduce((a, b) => a + b, 0);
    // Animationen nur aus dem Prozess der Seite; je Fehler Element und Eigenschaft (aus dem Start-Ereignis derselben id).
    const animationen = ereignisse.filter((e) => e.name === 'Animation' && haupt && e.pid === haupt.pid);
    const animId = (e) => e.id2?.local ?? e.id;
    const fehlerArten = {};
    for (const e of animationen.filter((x) => x.args?.data?.compositeFailed > 0)) {
      const start = animationen.find((x) => x.ph === 'b' && animId(x) === animId(e))?.args?.data ?? {};
      const art = `${start.nodeName ?? '?'} ${(e.args.data.unsupportedProperties ?? []).join('/') || `Code ${e.args.data.compositeFailed}`}`;
      fehlerArten[art] = (fehlerArten[art] ?? 0) + 1;
    }
    const fehlgeschlagen = Object.values(fehlerArten).reduce((a, b) => a + b, 0);
    if (PROTOKOLL) {
      // Spur ablegen, ungefiltert (in DevTools: Performance → Profil laden), und den Ablauf ab der Marke zusammenfassen.
      const ordner = path.join(wurzel, 'output', 'akkordeon');
      fs.mkdirSync(ordner, { recursive: true });
      const datei = path.join(ordner, `spur${route.replace(/\W+/g, '-')}${sektion.replace(/\W+/g, '-')}.json`);
      fs.writeFileSync(datei, JSON.stringify(alle));
      const ms = (e) => Math.round((e.ts - tipp) / 1000);
      const aufHaupt = lauf.filter((e) => e.name === 'Layout').map(ms);
      const starts = animationen.filter((e) => e.ph === 'b').map((e) => `${ms(e)}:${(e.args?.data?.nodeName ?? '?').replace(/ class='/, '.').slice(0, 24)}`);
      console.log(`  [${name}] Spur ${path.relative(wurzel, datei)}; Klick ${klick}; Layouts bei ${aufHaupt.join(', ')} ms; Animationsstarts ${starts.length}: ${starts.slice(0, 12).join(' | ')}`);
    }

    if (klick !== 'getroffen' || !marke) {
      // Ohne Beleg, dass die Spur den Wechsel dieser Karte enthaelt, kein Urteil ueber die Seite (Pflichtfrage 8).
      const vorStart = alle.some((e) => e.name === 'TimeStamp' && e.args?.data?.message === KLICK_MARKE);
      messfehler.push(`${name}: gemessener Tipp ${klick !== 'getroffen' ? `traf nicht Karte ${ziel} (${klick})` : `ohne Klick-Marke in der Spur (${vorStart ? 'nur vor dem Start' : 'nicht aufgezeichnet'})`}, Spur nicht ausgewertet`);
    } else {
      if (spaete >= MIN_SPAETE_LAYOUTS && anteil >= ANTEIL_LAYOUT) {
        befunde.push(`${name}: ${spaete} Layout-Laeufe in ${spaeteBilder} Bildern 150–650 ms nach dem Tipp (${Math.round(anteil * 100)} %, Grenze ${ANTEIL_LAYOUT * 100} %), also Layout pro Bild`);
      }
      if (fehlgeschlagen) {
        const arten = Object.entries(fehlerArten).map(([art, n]) => `${n}× ${art}`).join(', ');
        befunde.push(`${name}: ${fehlgeschlagen} Animation(en) nicht auf dem Compositor (${arten})`);
      }
    }
    await warte(300);
    await ausgelaufen();
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), ziel)) befunde.push(`${name}, nach Tipp auf ${ziel}: ${f}`);
    const schatten = await seite.evaluate(SCHATTEN, sektion);
    if (schatten.length) befunde.push(`${name}: ${schatten.length} Schatten ausserhalb der sichtbaren Karte (${schatten.slice(0, 2).join('; ')})`);

    // 2. Unterbrechung: andere Karte per Tipp, nach 150 ms eine dritte per KLICK AUF DAS ELEMENT. Kein zweiter Tipp:
    //    Bis er ankommt, ist die aufgehende Karte womoeglich ueber die Stelle gewachsen, der Tipp traefe die offene Karte
    //    und folgte ihrem Link (2026-10-16 auf /karriere: Seite sprang zu #bewerbung). Auf dem Telefon waere das genauso
    //    und richtig; geprueft werden soll hier aber die Unterbrechung einer laufenden Animation, nicht der Treffertest.
    const anzahlKarten = await seite.evaluate((sel) => window.__ccKarten(sel).length, sektion);
    const andere = ziel + 1 < anzahlKarten ? ziel + 1 : ziel - 1;
    await tippe(andere);
    await warte(150);
    // Ziel: nicht offen, nicht die gerade getippte, moeglichst nicht die, die selbst zuklappt (`ziel`).
    const unterbrechung = await seite.evaluate((sel, a, z) => {
      const karten = window.__ccKarten(sel);
      const passt = (k, i, ohneZiel) => i !== a && (!ohneZiel || i !== z) && k.getAttribute('aria-expanded') !== 'true';
      const ohne = karten.findIndex((k, i) => passt(k, i, true));
      return ohne >= 0 ? ohne : karten.findIndex((k, i) => passt(k, i, false));
    }, sektion, andere, ziel);
    if (unterbrechung < 0) messfehler.push(`${name}: keine Karte fuer die Unterbrechung`);
    else await seite.evaluate((sel, k) => window.__ccKarten(sel)[k].click(), sektion, unterbrechung);
    await warte(1100);
    await protokoll(`nach Unterbrechung (andere ${andere}, dann ${unterbrechung})`);
    await ausgelaufen();
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), unterbrechung)) befunde.push(`${name}, nach Unterbrechung: ${f}`);

    // 3. Offene Karte OBERHALB des Fensters, Tipp auf die letzte Karte: Sie darf nicht springen und muss danach mittig im
    //    freien Bereich stehen (Kopf: SPRUNG, MITTE).
    const anzahl = await seite.evaluate((sel) => window.__ccKarten(sel).length, sektion);
    await seite.evaluate((sel) => window.scrollBy(0, window.__ccKarten(sel)[0].getBoundingClientRect().top - 200), sektion);
    await warte(600);
    if ((await offenIndex()) !== 0) {
      await tippe(0);
      await warte(1100);
    }
    await seite.evaluate((sel) => window.scrollBy(0, window.__ccKarten(sel)[1].getBoundingClientRect().top - 100), sektion);
    await warte(800);
    const letzte = anzahl - 1;
    await protokoll(`vor Tipp auf die letzte Karte ${letzte}`);
    // Gegenprobe: Ohne `window.scrollTo` (Lenis scrollt darueber) fehlen Verankerung und Gleiten; SPRUNG oder MITTE
    // muss fallen (Pflichtfrage 6).
    if (GEGENPROBE) await seite.evaluate(() => { window.scrollTo = () => {}; });
    await seite.evaluate((sel, k) => window.__ccBahnStart(window.__ccKarten(sel)[k]), sektion, letzte);
    await tippe(letzte);
    await warte(900);
    const proben = await seite.evaluate(() => window.__ccBahnStopp());
    const { bahn } = proben;
    // SPRUNG: schnellste Bewegung zwischen zwei Bildern
    const tempo = schnellsteBewegung(bahn);
    if (zuVieleVerworfen(proben)) messfehler.push(`${name}: ${proben.verworfen} von ${bahn.length + proben.verworfen} Bahn-Proben verworfen, Tempo nicht aussagekraeftig`);
    if (tempo > MAX_TEMPO) {
      befunde.push(`${name}: getippte Karte ${letzte} (offene Karte oberhalb) springt, ${tempo.toFixed(1)} px/ms zwischen zwei Bildern (Grenze ${MAX_TEMPO}; ${Math.round(bahn[0][1])} → ${Math.round(bahn.at(-1)[1])})`);
    }
    await ausgelaufen();
    // Lenis gleitet noch, wenn die Kartenanimationen enden (gleiche Dauer, aber eigener Takt): kurz nachwarten.
    await warte(400);
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), letzte)) befunde.push(`${name}, offene Karte oberhalb: ${f}`);
    // MITTE: Oberkante gegen die Mitte des freien Bereichs, Karte ganz darin
    const mitte = await seite.evaluate((sel, k) => {
      const r = window.__ccKarten(sel)[k].getBoundingClientRect();
      const f = window.__ccFrei();
      const platz = f.unten - f.oben;
      const soll = r.height + 24 <= platz ? f.oben + (platz - r.height) / 2 : f.oben + 12;
      return { oben: r.top, unten: r.bottom, soll, frei: f };
    }, sektion, letzte);
    const neben = mitte.oben - mitte.soll;
    const ganz = mitte.oben >= mitte.frei.oben - 1 && mitte.unten <= mitte.frei.unten + 1;
    if (Math.abs(neben) > GRENZE_MITTE && !(mitte.frei.amRand && ganz)) {
      befunde.push(`${name}: offene Karte ${letzte} nicht mittig im freien Bereich (${Math.round(mitte.frei.oben)}–${Math.round(mitte.frei.unten)} px): Oberkante ${Math.round(mitte.oben)} statt ${Math.round(mitte.soll)}${ganz ? '' : `, ${Math.round(Math.max(mitte.frei.oben - mitte.oben, mitte.unten - mitte.frei.unten))} px verdeckt`}`);
    }

    const ms = (k) => (anteile[k] ?? 0).toFixed(0);
    zeilen.push(`| ${name} | ${spaete}/${spaeteBilder} Bilder (${layouts}) | ${fehlgeschlagen} | ${tempo.toFixed(1)} px/ms | ${neben >= 0 ? '+' : ''}${neben.toFixed(1)} px | ${schatten.length} | ${(summe / bilder).toFixed(1)} ms | ${ms('Stil')} / ${ms('Layout')} / ${ms('Malen')} / ${ms('Ebenen')} / ${ms('Skript')} |`);
    await browser.close();
    browser = undefined;
    process.stdout.write('.');
  }

  // 4. MAUS IM SCHMALEN FENSTER (Kopf, Punkt 10): je Fenster ein frischer Browser, Startseite #leistungen.
  //    Gegenprobe: dasselbe in 900 × 800, einmal ohne Mitgleiten, einmal mit eingespielter Kette.
  const MAUS = GEGENPROBE
    ? [{ width: 900, height: 800, fehler: 'ohne Gleiten' }, { width: 900, height: 800, fehler: 'Kette' }]
    : [{ width: 900, height: 800 }, { width: 393, height: 851 }];
  // Die alte Kette (O8): Was unter den Zeiger kommt, geht auf, wie frueher per `mouseenter`.
  const KETTE = () => document.addEventListener('pointerover', (e) => {
    const karte = e.target instanceof Element ? e.target.closest('a[aria-expanded="false"]') : null;
    if (karte && window.__ccKetteAn) karte.click();
  }, true);
  const MAUS_LAGE = (i) => {
    const karten = window.__ccKarten('#leistungen');
    const r = karten[i].getBoundingClientRect();
    const f = window.__ccFrei();
    const platz = f.unten - f.oben;
    const soll = r.height + 24 <= platz ? f.oben + (platz - r.height) / 2 : f.oben + 12;
    return { oben: r.top, unten: r.bottom, x: r.left + r.width / 2, soll, frei: f, offen: karten.findIndex((k) => k.getAttribute('aria-expanded') === 'true'), pfad: location.pathname };
  };
  for (const mf of (!NUR_ROUTEN.length || NUR_ROUTEN.includes('/')) ? MAUS : []) {
    const name = `/ #leistungen, Maus ${mf.width} × ${mf.height}${mf.fehler ? ` (Gegenprobe: ${mf.fehler})` : ''}`;
    browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
    const seite = await browser.newPage();
    await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
    await seite.evaluateOnNewDocument(KARTEN);
    await seite.evaluateOnNewDocument(FREI);
    if (mf.fehler === 'Kette') await seite.evaluateOnNewDocument(KETTE);
    await seite.setViewport({ width: mf.width, height: mf.height, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await seite.goto(basis + '/', { waitUntil: 'networkidle0', timeout: 45000 });
    await seite.evaluate(() => { const k = window.__ccKarten('#leistungen')[4]; window.scrollTo(0, k.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.75); });
    // Erst messen, wenn der Behaelter eingeblendet ist und die Karte ruhig steht: Er blendet beim ersten Erscheinen ein
    // (`whileInView`, y 20 → 0, 0,5 s), beim ersten Laden eines Browsers erst nach rund 1,2 s (Hauptthread belegt).
    const ruhig = await seite.waitForFunction(() => new Promise((r) => {
      const karte = window.__ccKarten('#leistungen')[4];
      const stil = getComputedStyle(karte.parentElement);
      if (stil.opacity !== '1' || stil.transform !== 'none') return r(false);
      const a = karte.getBoundingClientRect().top;
      setTimeout(() => r(Math.abs(karte.getBoundingClientRect().top - a) < 0.5), 300);
    }), { timeout: 8000, polling: 350 }).then(() => true, () => false);
    if (!ruhig) messfehler.push(`${name}: Karten nach dem Scrollen nach 8 s nicht eingeblendet oder nicht ruhig, Test nicht aussagekraeftig`);
    if (!(await seite.evaluate(() => matchMedia('(hover: hover)').matches))) messfehler.push(`${name}: Fenster meldet kein (hover: hover), Test nicht aussagekraeftig`);
    if (mf.fehler === 'ohne Gleiten') await seite.evaluate(() => { window.scrollTo = () => {}; });
    if (mf.fehler === 'Kette') await seite.evaluate(() => { window.__ccKetteAn = true; });
    const start = await seite.evaluate(MAUS_LAGE, 4);
    const kette = [];
    const mittigFehler = (l, was) => {
      const ganz = l.oben >= l.frei.oben - 1 && l.unten <= l.frei.unten + 1;
      if (Math.abs(l.oben - l.soll) > GRENZE_MITTE && !(l.frei.amRand && ganz)) {
        befunde.push(`${name}: ${was}: offene Karte nicht mittig im freien Bereich (${Math.round(l.frei.oben)}–${Math.round(l.frei.unten)} px), Oberkante ${Math.round(l.oben)} statt ${Math.round(l.soll)}${ganz ? '' : `, ${Math.round(Math.max(l.frei.oben - l.oben, l.unten - l.frei.unten))} px verdeckt`}`);
      }
    };
    // (a) Waagerecht von links heran (Rand ausserhalb der Karten), dann ruhen
    const y0 = start.oben + 32;
    await seite.mouse.move(4, y0);
    await seite.mouse.move(start.x, y0, { steps: 4 });
    await warte(1600);
    const a = await seite.evaluate(MAUS_LAGE, 4);
    if (a.offen !== 4) befunde.push(`${name}: nach dem Darueberfahren ist Karte ${a.offen + 1} offen statt der unter dem Zeiger (5)`);
    else mittigFehler(a, 'Darueberfahren');
    // (b) Ruhe: Es darf nichts mehr aufgehen oder gleiten
    await warte(1200);
    const b = await seite.evaluate(MAUS_LAGE, 4);
    if (b.offen !== a.offen || Math.abs(b.oben - a.oben) > 2) kette.push(`in Ruhe nach dem Gleiten: offen ${a.offen + 1} → ${b.offen + 1}, Karte 5 ${Math.round(a.oben)} → ${Math.round(b.oben)} px`);
    // (c) Weg ueber die Streifen zur Mitte der offenen Karte, 20 ms je Schritt
    const zielY = (b.oben + b.unten) / 2;
    for (let s = 1; s <= 8; s++) {
      await seite.mouse.move(start.x, y0 + ((zielY - y0) * s) / 8);
      await warte(20);
    }
    await warte(1200);
    const c = await seite.evaluate(MAUS_LAGE, 4);
    if (c.offen !== b.offen) kette.push(`auf dem Weg zur offenen Karte: offen ${b.offen + 1} → ${c.offen + 1}`);
    // (d) Mausrad bei ruhendem Zeiger: Der Inhalt bewegt sich unter ihm, es darf nichts aufgehen
    await seite.mouse.wheel({ deltaY: 260 });
    await warte(1500);
    const d = await seite.evaluate(MAUS_LAGE, 4);
    if (d.offen !== c.offen) kette.push(`Mausrad bei ruhendem Zeiger: offen ${c.offen + 1} → ${d.offen + 1}`);
    if (kette.length) befunde.push(`${name}: Kette (${kette.join('; ')})`);
    // Zugeklappte Karte, die frei im Bild liegt (fuer f und e)
    const freieKarte = () => seite.evaluate(() => {
      const f = window.__ccFrei();
      const karten = window.__ccKarten('#leistungen');
      for (let i = 0; i < karten.length; i++) {
        if (karten[i].getAttribute('aria-expanded') === 'true') continue;
        const r = karten[i].getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + 32;
        if (y > f.oben + 20 && y < f.unten - 20 && document.elementFromPoint(x, y)?.closest('a[aria-expanded]') === karten[i]) return { i, x, y };
      }
      return null;
    });
    // (f) Nach dem Mausrad auf eine andere Karte fahren und ruhen: Sie muss aufgehen (Gegenstueck zu d)
    let hoverText = '';
    const neu = mf.fehler ? null : await freieKarte();
    if (!mf.fehler && !neu) messfehler.push(`${name}: keine zugeklappte Karte frei im Bild fuer das Darueberfahren nach dem Mausrad`);
    else if (neu) {
      await warte(400);
      await seite.mouse.move(neu.x, neu.y, { steps: 5 });
      await warte(1600);
      const f = await seite.evaluate(MAUS_LAGE, neu.i);
      hoverText = `, danach Karte ${neu.i + 1} per Darueberfahren ${f.offen === neu.i ? 'offen' : 'NICHT offen'}`;
      if (f.offen !== neu.i) befunde.push(`${name}: nach dem Mausrad oeffnet Darueberfahren die Karte ${neu.i + 1} nicht (offen ist ${f.offen + 1})`);
      else mittigFehler(f, `Darueberfahren nach dem Mausrad (Karte ${neu.i + 1})`);
    }
    // (e) Klick auf eine zugeklappte Karte, die frei im Bild liegt: klappt auf und gleitet mittig, kein Seitenwechsel
    const ziel = mf.fehler ? null : await freieKarte();
    let klickText = 'keine freie Karte';
    if (!mf.fehler && !ziel) messfehler.push(`${name}: keine zugeklappte Karte frei im Bild fuer den Klick`);
    else if (ziel) {
      await seite.mouse.click(ziel.x, ziel.y);
      await warte(1600);
      const e = await seite.evaluate(MAUS_LAGE, ziel.i);
      klickText = `Klick auf Karte ${ziel.i + 1}: ${e.pfad === '/' ? 'aufgeklappt' : `Seitenwechsel nach ${e.pfad}`}`;
      if (e.pfad !== '/') befunde.push(`${name}: Klick auf die zugeklappte Karte ${ziel.i + 1} folgte dem Link (${e.pfad}) statt aufzuklappen`);
      else if (e.offen !== ziel.i) befunde.push(`${name}: nach dem Klick auf Karte ${ziel.i + 1} ist Karte ${e.offen + 1} offen`);
      else mittigFehler(e, `Klick auf Karte ${ziel.i + 1}`);
    }
    zeilen.push(`| ${name} | – | – | Karte 5 ${Math.round(start.oben)} → ${Math.round(a.oben)} px (Mitte ${Math.round(a.soll)}), ${kette.length ? 'Kette' : 'keine Kette'}${hoverText}, ${klickText} | ${(a.oben - a.soll >= 0 ? '+' : '') + (a.oben - a.soll).toFixed(1)} px | – | – | – |`);
    await browser.close();
    browser = undefined;
    process.stdout.write('.');
  }
} finally {
  await browser?.close();
  stopp();
}

console.log(`\n\n| Akkordeon | Layouts spaet / Hauptthread-Bilder (Layouts gesamt) | nicht auf Compositor | getippte Karte: schnellste Bewegung | Abstand zur Mitte | Schatten ausserhalb | Hauptthread je Hauptthread-Bild (${DROSSEL}×) | Stil / Layout / Malen / Ebenen / Skript (ms) |`);
console.log('|---|---|---|---|---|---|---|---|');
console.log(zeilen.join('\n'));

if (messfehler.length) {
  console.log(`\n[akkordeon] ${messfehler.length} Messfehler (Ergebnis nicht verwertbar, bitte wiederholen):`);
  for (const m of messfehler) console.log(`  - ${m}`);
}
if (GEGENPROBE) {
  const erwartet = ZIELE.filter((z) => !NUR_ROUTEN.length || NUR_ROUTEN.includes(z.route)).length;
  const gemeldet = befunde.filter((b) => b.includes('Layout pro Bild')).length;
  const hervor = befunde.filter((b) => b.includes('Tipp-Hervorhebung')).length;
  const schatten = befunde.filter((b) => b.includes('Schatten ausserhalb')).length;
  // Ohne `scrollTo`: je Akkordeon mindestens SPRUNG oder MITTE (beide aus derselben Lage, also je Akkordeon gezaehlt)
  const lage = ZIELE.filter((z) => !NUR_ROUTEN.length || NUR_ROUTEN.includes(z.route))
    .filter((z) => befunde.some((b) => b.startsWith(`${z.route} ${z.sektion}:`) && (b.includes('springt') || b.includes('nicht mittig')))).length;
  // Maus (nur mit der Startseite): ohne Gleiten muss „nicht mittig“ fallen, mit eingespielter Kette „Kette“.
  const mausErwartet = !NUR_ROUTEN.length || NUR_ROUTEN.includes('/') ? 2 : 0;
  const maus = (befunde.some((b) => b.includes('(Gegenprobe: ohne Gleiten)') && b.includes('nicht mittig')) ? 1 : 0)
    + (befunde.some((b) => b.includes('(Gegenprobe: Kette)') && b.includes('Kette (')) ? 1 : 0);
  console.log(`\n[akkordeon] Gegenprobe: ${gemeldet} von ${erwartet} eingespielten Hoehen-Animationen, ${hervor} von ${erwartet} Tipp-Hervorhebungen, ${schatten} von ${erwartet} Fensterschatten, ${lage} von ${erwartet} abgeschalteten Scrollbewegungen (Sprung oder nicht mittig) und ${maus} von ${mausErwartet} Maus-Fehlern (ohne Gleiten, Kette) gemeldet.`);
  process.exit(gemeldet === erwartet && hervor === erwartet && schatten === erwartet && lage === erwartet && maus === mausErwartet ? 0 : 1);
}
if (messfehler.length) process.exit(2);
if (befunde.length) {
  console.log(`\n[akkordeon] ${befunde.length} Befund(e):`);
  for (const b of befunde) console.log(`  - ${b}`);
  process.exit(1);
}
console.log('\n[akkordeon] ok: kein Layout pro Bild, alle Animationen auf dem Compositor, Ruhelage stimmt, getippte Karte gleitet ohne Sprung in die Mitte, kein Schatten ausserhalb der Karten, keine Tipp-Hervorhebung, mit der Maus mittig und ohne Kette.');
