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
//   - GETIPPTE KARTE BLEIBT STEHEN (seit 2026-10-16 abends): offene Karte OBERHALB des Fensters (der Normalfall beim
//     Herunterscrollen), Tipp auf die letzte Karte; deren Oberkante wird in jedem Bild gemessen und darf hoechstens
//     GRENZE_STEHEN px von der Lage vor dem Tipp abweichen. Bewiesen am echten Fehler (Build 16.10., 19:24): Die
//     Karte wuchs dort nach oben aus dem Bild, Oberkante 268 → −8 px (Rueckmeldung des Users vom A56).
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
//  6. STEHEN BLEIBEN wird je Akkordeon in EINER Lage geprueft (offene Karte oben, Tipp auf die letzte). Die Gegenprobe
//     (`--gegenprobe`) spielt dafuer nichts ein; den Beweis lieferte der echte Fehler (siehe oben). Die erste Bildluecke
//     nach dem Laden (im Kopflosen rund 100 ms im GPU-Prozess) misst sie nicht.
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
/** Hoechste erlaubte Abweichung der getippten Karte von ihrer Lage vor dem Tipp, in px, in irgendeinem Bild. */
const GRENZE_STEHEN = 2;
const FENSTER = { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true };
/** Marke in der Spur (`console.timeStamp`), gesetzt vom Klick-Horcher, wenn der gemessene Tipp die Zielkarte trifft. */
const KLICK_MARKE = 'cc-akkordeon-klick';
/** `tipp`: Karte des gemessenen Tipps. Das Ziel der Unterbrechung waehlt der Lauf selbst (sichtbare Karte, siehe 2.). */
const ZIELE = [
  { route: '/', sektion: '#leistungen', tipp: 2 },
  { route: '/', sektion: '#autoaufbereitung', tipp: 2 },
  { route: '/karriere', sektion: '#jobbereiche', tipp: 1 },
];
/** So ruckelte es bis 2026-10-16: Die Hoehe animiert, Layout in jedem Bild. Dazu die Tipp-Hervorhebung von vorher. */
const FEHLER_CSS = 'a[aria-expanded]{transition:height 600ms ease !important;-webkit-tap-highlight-color:rgb(47 128 237 / 0.18) !important}';
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

    // 3. Offene Karte OBERHALB des Fensters, Tipp auf die letzte Karte: Diese muss in jedem Bild stehen bleiben.
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
    await seite.evaluate((sel, k) => {
      const karte = window.__ccKarten(sel)[k];
      window.__ccBahn = [];
      window.__ccBahnLauf = true;
      const tick = () => {
        window.__ccBahn.push(karte.getBoundingClientRect().top);
        if (window.__ccBahnLauf) requestAnimationFrame(tick);
      };
      tick();
    }, sektion, letzte);
    await tippe(letzte);
    await warte(900);
    const bahn = await seite.evaluate(() => { window.__ccBahnLauf = false; return window.__ccBahn; });
    const abweichung = Math.max(0, ...bahn.map((y) => Math.abs(y - bahn[0])));
    if (abweichung > GRENZE_STEHEN) {
      befunde.push(`${name}: getippte Karte ${letzte} (offene Karte oberhalb) wandert um bis zu ${Math.round(abweichung)} px statt stehen zu bleiben (${Math.round(bahn[0])} → ${Math.round(bahn.at(-1))})`);
    }
    await ausgelaufen();
    for (const f of ruhelageFehler(await seite.evaluate(ZUSTAND, sektion), letzte)) befunde.push(`${name}, offene Karte oberhalb: ${f}`);

    const ms = (k) => (anteile[k] ?? 0).toFixed(0);
    zeilen.push(`| ${name} | ${spaete}/${spaeteBilder} Bilder (${layouts}) | ${fehlgeschlagen} | ${abweichung.toFixed(1)} px | ${(summe / bilder).toFixed(1)} ms | ${ms('Stil')} / ${ms('Layout')} / ${ms('Malen')} / ${ms('Ebenen')} / ${ms('Skript')} |`);
    await browser.close();
    browser = undefined;
    process.stdout.write('.');
  }
} finally {
  await browser?.close();
  stopp();
}

console.log(`\n\n| Akkordeon | Layouts spaet / Hauptthread-Bilder (Layouts gesamt) | nicht auf Compositor | getippte Karte wandert | Hauptthread je Hauptthread-Bild (${DROSSEL}×) | Stil / Layout / Malen / Ebenen / Skript (ms) |`);
console.log('|---|---|---|---|---|---|');
console.log(zeilen.join('\n'));

if (messfehler.length) {
  console.log(`\n[akkordeon] ${messfehler.length} Messfehler (Ergebnis nicht verwertbar, bitte wiederholen):`);
  for (const m of messfehler) console.log(`  - ${m}`);
}
if (GEGENPROBE) {
  const erwartet = ZIELE.filter((z) => !NUR_ROUTEN.length || NUR_ROUTEN.includes(z.route)).length;
  const gemeldet = befunde.filter((b) => b.includes('Layout pro Bild')).length;
  const hervor = befunde.filter((b) => b.includes('Tipp-Hervorhebung')).length;
  console.log(`\n[akkordeon] Gegenprobe: ${gemeldet} von ${erwartet} eingespielten Hoehen-Animationen und ${hervor} von ${erwartet} Tipp-Hervorhebungen gemeldet.`);
  process.exit(gemeldet === erwartet && hervor === erwartet ? 0 : 1);
}
if (messfehler.length) process.exit(2);
if (befunde.length) {
  console.log(`\n[akkordeon] ${befunde.length} Befund(e):`);
  for (const b of befunde) console.log(`  - ${b}`);
  process.exit(1);
}
console.log('\n[akkordeon] ok: kein Layout pro Bild, alle Animationen auf dem Compositor, Ruhelage stimmt, getippte Karte bleibt stehen, keine Tipp-Hervorhebung.');
