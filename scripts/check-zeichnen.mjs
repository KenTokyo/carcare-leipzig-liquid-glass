// Zeichenluecken: Stellen, an denen der Browser den Seiteninhalt nicht zeichnet (R31, 2026-10-19).
//
// AUFRUF:
//   npm run zeichnen                          alle Routen, vier Fenster (1440 × 790 Retina, 1920 × 945, 1024 × 700 Retina, 390 × 844)
//   npm run zeichnen -- / /leistungen         nur diese Routen (unter Git Bash `MSYS_NO_PATHCONV=1` davor)
//   npm run zeichnen -- --gegenprobe          spielt den Fehler vom 19.10. auf / wieder ein und verlangt beide Meldungen
//   npm run zeichnen -- --url https://carcare-center.vercel.app   misst ein Deployment statt `dist/`
//   npm run zeichnen -- --sichtbar            sichtbares Chrome-Fenster mit echter Grafikkarte (langsamer, nur ein Tab)
//   npm run zeichnen -- --protokoll           Aufnahme jeder Position nach `output/zeichnen/`, nicht nur der Befunde
//
// BRAUCHT ohne `--url` ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst. Bericht:
// `output/zeichnen/bericht.md` (Gegenprobe: `gegenprobe.md`), Aufnahmen der Befunde daneben.
//
// WOZU
// Am 2026-10-19 meldete der User vom MacBook: Startseite „komplett zerschossen“, sobald man zum Akkordeon scrollt; weg
// davon wieder normal. Am Windows-Rechner nichts. Ursache: zwoelf unsichtbare Glas-Plaketten (`backdrop-filter`,
// `opacity: 0`) in den eingeklappten Karten. Chrome macht aus jeder eine eigene Grafikebene und zerlegt dahinter den
// Seiteninhalt in weitere Ebenen, jede so gross wie der ganze Hauptbereich (gemessen: 16 Stueck zu 1892 × 17679 px).
// Das sprengt das Kachelbudget: Chrome laesst Kacheln leer, man sieht die fixierte Fusszeile durch. Kein Werkzeug sah
// das. Alle anderen messen DOM, Layout oder Pixel einer neu gezeichneten Aufnahme; hier fehlte der Inhalt nur in der
// Ausgabe des Compositors. Plan: docs/mac-zeichenluecken/tasks/2026-10-19-mac-zeichenluecken-tasks.md
//
// WIE
// 1. LUECKEN (hart, Exit 1): Seitengrund und Fusszeile magenta, Grund des Hauptbereichs tuerkis. Beides liegt hinter
//    dem Seiteninhalt und ist nirgends zu sehen, solange der Browser alles zeichnet. Jede Route wird mit dem Mausrad in
//    Schritten von 55 % der Fensterhoehe durchgescrollt; je Position nach Ruhe der Seite eine Aufnahme ueber das
//    DevTools-Protokoll (zeigt, was der Compositor ausgibt, samt leerer Kacheln). Magenta oder Tuerkis innerhalb des
//    sichtbaren Hauptbereichs ab 0,5 % der Flaeche = Luecke. Jede Luecke wird an derselben Position einmal nachgemessen.
// 2. MASKEN (hart ab 4, Hinweis ab 2): An jeder Position der Ebenenbaum (CDP `LayerTree`). Masken sind Ebenen, die
//    hoeher als drei Fenster sind, KEINEN eigenen Grund haben und GLEICH GROSS sind: Mit ihnen wendet Chrome einen runden
//    Beschnitt auf Glas-, Video- oder `will-change`-Ebenen an, je Ebene eine in voller Groesse des Beschnitts. Gezaehlt
//    wird die groesste Gruppe gleicher Groesse. Das ist die URSACHE, und sie ist auf jedem Rechner gleich, auch dort, wo
//    das Budget (noch) reicht. Gemessen am 19.10.: vor dem Fix 16 bis 36 (Luecken auf dem Mac), danach 0.
//    WARUM GLEICH GROSS: Die erste Fassung zaehlte jede grundlose seitengrosse Ebene und meldete auf 22 einfachen Seiten
//    (Impressum, Kontakt, Wissen) „1 Maske“. Das war die Inhaltsebene des Seiten-Scrollers, die Chrome dort ohne Grund
//    meldet. Eine einzelne echte Maske sieht genauso aus und bleibt damit ungezaehlt; sie allein sprengt kein Budget.
//    Daneben stehen zur Einordnung alle Ebenen, alle seitengrossen (darunter immer `main` und der Seiten-Scroller) und
//    die mit Weichzeichner (`BackdropFilter`).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md)
//  1. DAS BUDGET HAENGT AM RECHNER. Ob Chrome Kacheln leer laesst, haengt von Plattform, Grafikspeicher und Treiber
//     ab. Auf dem Mac (19.10.) zeigte JEDES Chromium den Fehler, auch headless und ohne GPU; ob ein Windows-Rechner ihn
//     zeigt, ist nicht gemessen. Ein Lauf ohne Luecken auf einem grosszuegigen Rechner sagt nichts ueber ein MacBook.
//     Deshalb (a) misst das Werkzeug zusaetzlich die Ebenen (rechnerunabhaengig) und (b) prueft vorab mit einer
//     EICHUNG, ob dieser Rechner den eingespielten Fehler ueberhaupt zeigt. Zeigt er ihn nicht, gibt es fuer die
//     Luecken kein gruenes Urteil, sondern Exit 2 (die Ebenenpruefung gilt trotzdem).
//  2. SAFARI NICHT. Gemessen wird Chrome. WebKits Aufnahmen zeichnen die Seite neu und zeigen Compositor-Luecken nicht;
//     ein echtes Fensterfoto braucht die Bildschirmaufnahme-Freigabe von macOS. Safari bleibt Sichtpruefung am Geraet.
//  3. ABTASTUNG: Gemessen wird an Positionen im Abstand von 55 % der Fensterhoehe, in Ruhe. Eine Luecke, die nur an
//     einer Zwischenposition oder nur waehrend des Scrollens entsteht, kann durchrutschen. Der Fehler vom 19.10. stand
//     ueber rund anderthalb Bildschirme und blieb in Ruhe stehen.
//  4. NUR DER HAUPTBEREICH. Luecken in fixierten Ebenen (Navbar, Dialoge, Fusszeile selbst) faerbt nichts ein.
//  5. ZUSTAENDE: Gemessen wird der Ausgangszustand jeder Seite beim Durchscrollen (Maus am linken Rand, keine Hover).
//     Aufgeklappte Karten, offene Dialoge oder Menues misst sie nicht.
//  6. VIER FENSTER, Chrome-Standardeinstellungen. Andere Zoomstufen, Bildschirme und Browser nicht.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';
import { getRoutes } from './routes.mjs';
import { startePreview } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'zeichnen');
const FENSTER = [
  { name: '1440r', width: 1440, height: 790, dpr: 2, mobil: false, text: '1440 × 790 Retina (MacBook)' },
  { name: '1920', width: 1920, height: 945, dpr: 1, mobil: false, text: '1920 × 945 (Full HD maximiert)' },
  { name: '1024r', width: 1024, height: 700, dpr: 2, mobil: false, text: '1024 × 700 Retina' },
  { name: '390', width: 390, height: 844, dpr: 3, mobil: true, text: '390 × 844 (iPhone)' },
];
const SCHRITT = 0.55;
const LUECKE_AB = 0.005;
const MASKEN_HART = 4;
const MASKEN_HINWEIS = 2;
const RUHE_MS = 700;
const PARALLEL = 4;

const args = process.argv.slice(2);
const gegenprobe = args.includes('--gegenprobe');
const sichtbar = args.includes('--sichtbar');
const protokoll = args.includes('--protokoll');
const urlArg = args.includes('--url') ? args[args.indexOf('--url') + 1] : null;
const nurRouten = args.filter((a) => a.startsWith('/'));
const routen = gegenprobe ? ['/'] : nurRouten.length ? nurRouten : getRoutes().map((r) => r.path ?? r);
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Faerbt ein, was hinter dem Seiteninhalt liegt. Fusszeile: nur ihr Foto samt Schleier aus, damit ihr Grund
 * magenta durchkommt; Text und Ebenen bleiben (eine leere Fusszeile haette weniger Ebenen und weniger Speicher).
 */
const FAERBUNG = `
  html, body, .carcare-shell-root { background: #ff00ff !important; }
  #contact { background: #ff00ff !important; }
  #contact > div[aria-hidden="true"]:first-child { display: none !important; }
  main.site-main-shell { background-color: #00ffff !important; }
`;
/**
 * Der Fehler vom 19.10., so wie er vor dem Fix im Code stand: Rundung am <main> (runder Beschnitt um die ganze Seite)
 * und die unsichtbaren Glas-Plaketten der eingeklappten Karten wieder als Ebenen. Beide Haelften sind behoben; die
 * Gegenprobe spielt beide ein, sonst zeigte sie nur einen Teil der Wirkung.
 */
const FEHLER = `
  .site-main-shell { border-radius: var(--cc-shell-radius) var(--cc-shell-radius) 0 0 !important; }
  .cc-liquid[style*="opacity: 0"] { visibility: visible !important; }
`;

function regelnEinspielen(regeln) {
  const setzen = () => {
    const s = document.createElement('style');
    s.dataset.zeichnen = '';
    s.textContent = regeln;
    document.head.appendChild(s);
  };
  if (document.head) setzen();
  else document.addEventListener('DOMContentLoaded', setzen);
}

/** Sichtbarer Teil des Hauptbereichs im Fenster, abzueglich Rand (Rundung oben, Schattenkante seitlich). */
const MESSFLAECHE = () => {
  const main = document.querySelector('main.site-main-shell');
  if (!main) return null;
  const r = main.getBoundingClientRect();
  const oben = Math.max(0, r.top + (r.top > -1 ? 40 : 0));
  const unten = Math.min(innerHeight, r.bottom - 2);
  const links = Math.max(0, r.left + 24);
  const rechts = Math.min(innerWidth, r.right - 24);
  if (unten - oben < 40 || rechts - links < 40) return null;
  return { x: links, y: oben, w: rechts - links, h: unten - oben, fensterBreite: innerWidth };
};

/**
 * Anteil magenta und tuerkis in der Messflaeche. Der Massstab kommt aus der Aufnahme selbst (Bildbreite durch
 * Fensterbreite), nicht aus der Pixeldichte: In der Handy-Emulation liefert Chrome die Aufnahme je nach Version in
 * CSS-Pixeln. Mit Faktor 3 gerechnet lag die Messflaeche dann ueber dem ganzen Bild samt Fusszeile (Fehlalarm 19.10.).
 */
async function luecke(png, flaeche) {
  const meta = await sharp(png).metadata();
  const dpr = meta.width / flaeche.fensterBreite;
  // Auf das Bild begrenzen: Gerundete Geraetepixel liegen sonst am Rand einen Pixel ausserhalb.
  const links = Math.min(meta.width - 1, Math.round(flaeche.x * dpr));
  const oben = Math.min(meta.height - 1, Math.round(flaeche.y * dpr));
  const breite = Math.max(1, Math.min(meta.width - links, Math.round(flaeche.w * dpr)));
  const hoehe = Math.max(1, Math.min(meta.height - oben, Math.round(flaeche.h * dpr)));
  const { data, info } = await sharp(png)
    .extract({ left: links, top: oben, width: breite, height: hoehe })
    .resize({ width: Math.max(1, Math.round(breite / dpr)), kernel: 'nearest' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let magenta = 0;
  let tuerkis = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 215 && g < 50 && b > 215) magenta++;
    else if (r < 50 && g > 215 && b > 215) tuerkis++;
  }
  const n = info.width * info.height;
  return { anteil: (magenta + tuerkis) / n, magenta: magenta / n, tuerkis: tuerkis / n };
}

/**
 * Ebenenbaum: alle, seitengross (hoeher als drei Fenster), davon Masken (ohne eigenen Grund, groesste Gruppe gleicher
 * Groesse ab 2, siehe Kopf), mit Weichzeichner.
 * Chrome meldet den Baum nur nach einem Neuzeichnen. Eine Aenderung ohne Malwirkung (z. B. `outline-offset` ohne
 * Umriss) loest keins aus; dann blieb der Baum aus, und die Eichung zaehlte 0 Ebenen (19.10.). Deshalb wechselt ein
 * 1-px-Fuehler oben im Fenster seine Farbe. Kommt trotzdem nichts, gilt der zuletzt gemeldete Baum (Ebenen haengen am
 * Dokument, nicht an der Scrollposition).
 */
async function ebenen(seite, cdp, fensterHoehe, stand) {
  const vorher = stand.zaehler;
  await seite.evaluate(() => {
    let f = document.getElementById('cc-zeichnen-fuehler');
    if (!f) {
      f = document.createElement('div');
      f.id = 'cc-zeichnen-fuehler';
      f.setAttribute('aria-hidden', 'true');
      f.style.cssText = 'position:absolute;left:0;top:0;width:1px;height:1px;pointer-events:none;';
      document.body.appendChild(f);
    }
    // Im Fenster halten: Ausserhalb malt Chrome den Fuehler nicht neu, dann bleibt die Meldung aus (am Seitenende 3 s
    // Wartezeit je Position, 19.10.).
    f.style.top = `${Math.round(scrollY + 2)}px`;
    f.style.background = f.style.background === 'rgb(1, 2, 3)' ? 'rgb(3, 2, 1)' : 'rgb(1, 2, 3)';
  });
  for (let i = 0; i < 75 && stand.zaehler === vorher; i++) await warte(40);
  const baum = stand.baum;
  if (!baum) return null;
  const zeichnend = baum.filter((l) => l.drawsContent);
  const gruende = async (l) => {
    try {
      return (await cdp.send('LayerTree.compositingReasons', { layerId: l.layerId })).compositingReasonIds ?? [];
    } catch {
      return null; // Ebene inzwischen weg
    }
  };
  const gross = zeichnend.filter((l) => l.height > fensterHoehe * 3);
  const gruppen = {};
  for (const l of gross) {
    if ((await gruende(l))?.length !== 0) continue;
    const groesse = `${Math.round(l.width)}x${Math.round(l.height)}`;
    gruppen[groesse] = (gruppen[groesse] ?? 0) + 1;
  }
  const groesste = Math.max(0, ...Object.values(gruppen));
  const masken = groesste >= 2 ? groesste : 0;
  let weich = 0;
  for (const l of zeichnend.filter((x) => x.width * x.height < 400 * 400)) {
    if ((await gruende(l))?.some((g) => /backdropfilter/i.test(g))) weich++;
  }
  return { alle: zeichnend.length, seitengross: gross.length, masken, weich, frisch: stand.zaehler !== vorher };
}

/** Wartet, bis die Scrollposition 200 ms steht (Lenis gleitet nach), hoechstens 2,5 s. */
async function ruhe(seite) {
  let letzte = -1;
  let seit = Date.now();
  const ende = Date.now() + 2500;
  while (Date.now() < ende) {
    const y = await seite.evaluate(() => Math.round(scrollY));
    if (y !== letzte) { letzte = y; seit = Date.now(); }
    else if (Date.now() - seit > 200) break;
    await warte(50);
  }
  return letzte;
}

async function oeffnen(browser, basis, route, f, regeln) {
  const seite = await browser.newPage();
  await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
  await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
  await seite.evaluateOnNewDocument(regelnEinspielen, regeln);
  if (!sichtbar || f.mobil) {
    await seite.setViewport({ width: f.width, height: f.height, deviceScaleFactor: f.dpr, isMobile: f.mobil, hasTouch: f.mobil });
  }
  await seite.goto(basis + route, { waitUntil: 'networkidle2', timeout: 90000 });
  await warte(1200);
  return seite;
}

/** Eine Route in einem Fenster: durchscrollen, je Position Luecke und Ebenen. */
async function messe(browser, basis, route, f, { regeln = FAERBUNG, bis = Infinity } = {}) {
  const seite = await oeffnen(browser, basis, route, f, regeln);
  const cdp = await seite.createCDPSession();
  const stand = { baum: null, zaehler: 0 };
  cdp.on('LayerTree.layerTreeDidChange', (e) => {
    if (e.layers) { stand.baum = e.layers; stand.zaehler++; }
  });
  await cdp.send('LayerTree.enable');
  const positionen = [];
  try {
    const { hoehe, innen } = await seite.evaluate(() => ({ hoehe: document.documentElement.scrollHeight, innen: innerHeight }));
    await seite.mouse.move(3, Math.round(innen / 2));
    const schritt = Math.round(innen * SCHRITT);
    let y = 0;
    for (let n = 0; n < 80 && y <= Math.min(hoehe, bis); n++) {
      const istY = await ruhe(seite);
      await warte(RUHE_MS);
      const flaeche = await seite.evaluate(MESSFLAECHE);
      const png = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }).then((x) => Buffer.from(x.data, 'base64'));
      const l = flaeche ? await luecke(png, flaeche) : { anteil: 0, magenta: 0, tuerkis: 0 };
      const e = await ebenen(seite, cdp, innen, stand);
      const eintrag = { y: istY, ...l, ebenen: e };
      if (l.anteil >= LUECKE_AB || protokoll) eintrag.png = png;
      positionen.push(eintrag);
      const vorher = istY;
      if (f.mobil) await seite.evaluate((d) => window.scrollBy(0, d), schritt);
      else await seite.mouse.wheel({ deltaY: schritt });
      y = await ruhe(seite);
      if (y === vorher) break; // Seitenende
    }
  } finally {
    await seite.close();
  }
  return positionen;
}

/** Nachmessung einer Luecke: frisch laden, bis zur Position scrollen, nur diese Position werten. */
async function nachmessen(browser, basis, route, f, zielY) {
  const pos = await messe(browser, basis, route, f, { bis: zielY + 1 });
  const naechste = pos.reduce((a, b) => (Math.abs(b.y - zielY) < Math.abs(a.y - zielY) ? b : a), pos[0]);
  return naechste?.anteil ?? 0;
}

const prozent = (x) => `${(x * 100).toFixed(1).replace('.', ',')} %`;
const ebenenText = (e) => (e ? `${e.alle} Ebenen, ${e.seitengross} seitengroß, davon ${e.masken} Masken, ${e.weich} mit Weichzeichner` : 'Ebenenbaum fehlt');

async function main() {
  const vorschau = urlArg ? { basis: urlArg.replace(/\/$/, ''), stopp: () => {} } : await startePreview(4211);
  // JE MESSSTRANG EIN EIGENER BROWSER mit genau einem Tab (2026-10-19): Drei Tabs in einem Browser lieferten fuer den
  // gerade nicht vorderen Tab ein Bild in falscher Groesse (756 × 469 statt 390 × 844) und damit eine Scheinluecke von
  // 48 %. Ein Hintergrund-Tab rastert ausserdem gedrosselt, genau das, was hier gemessen wird.
  const starten = () =>
    puppeteer.launch({
      headless: sichtbar ? false : 'new',
      // Mit vielen seitengrossen Ebenen (dem Fehler, den das Werkzeug sucht) antwortet die Seite zaeh; ein haengender
      // Tab soll nicht die ganze Messung aufhalten.
      protocolTimeout: 120000,
      defaultViewport: sichtbar ? null : undefined,
      args: ['--force-prefers-no-reduced-motion', ...(sichtbar ? ['--window-size=1440,900'] : [])],
    });
  const browserListe = await Promise.all(Array.from({ length: sichtbar ? 1 : PARALLEL }, starten));
  const browser = browserListe[0];
  const fenster = sichtbar ? FENSTER.filter((f) => !f.mobil) : FENSTER;
  const befunde = [];
  const hinweise = [];
  const uebersicht = [];
  let eichung = null;
  fs.rmSync(AUSGABE, { recursive: true, force: true });
  fs.mkdirSync(AUSGABE, { recursive: true });
  try {
    // EICHUNG (Pflichtfrage 1): Zeigt dieser Rechner den eingespielten Fehler auf / ueberhaupt?
    const eichFenster = fenster.find((f) => f.name === '1920');
    const eichPos = await messe(browser, vorschau.basis, '/', eichFenster, { regeln: FAERBUNG + FEHLER, bis: 3200 });
    const eichMax = Math.max(0, ...eichPos.map((p) => p.anteil));
    const eichMasken = Math.max(0, ...eichPos.map((p) => p.ebenen?.masken ?? 0));
    eichung = { luecke: eichMax, masken: eichMasken, zeigt: eichMax >= LUECKE_AB };
    console.log(`[zeichnen] Eichung auf / @${eichFenster.name} mit eingespieltem Fehler: Luecke ${prozent(eichMax)}, ${eichMasken} Masken → ${eichung.zeigt ? 'dieser Rechner zeigt Zeichenluecken' : 'dieser Rechner zeigt KEINE Zeichenluecken (Budget gross genug)'}`);

    const auftraege = gegenprobe ? [] : routen.flatMap((route) => fenster.map((f) => ({ route, f })));
    let naechster = 0;
    const arbeiter = async (browser) => {
      while (naechster < auftraege.length) {
        const { route, f } = auftraege[naechster++];
        let pos;
        try {
          pos = await messe(browser, vorschau.basis, route, f);
        } catch (fehler) {
          hinweise.push({ route, fenster: f.name, text: `Messfehler: ${String(fehler.message).slice(0, 120)}` });
          process.stdout.write('x');
          continue;
        }
        const maxL = pos.reduce((a, b) => (b.anteil > a.anteil ? b : a), pos[0] ?? { anteil: 0 });
        const maxE = pos.reduce((a, b) => ((b.ebenen?.masken ?? 0) > (a.ebenen?.masken ?? 0) ? b : a), pos[0] ?? {});
        const maxW = Math.max(0, ...pos.map((p) => p.ebenen?.weich ?? 0));
        const maxS = Math.max(0, ...pos.map((p) => p.ebenen?.seitengross ?? 0));
        uebersicht.push({ route, fenster: f.name, positionen: pos.length, luecke: maxL?.anteil ?? 0, lueckeY: maxL?.y, masken: maxE?.ebenen?.masken ?? 0, maskenY: maxE?.y, seitengross: maxS, weich: maxW });
        for (const p of pos) {
          if (p.png) fs.writeFileSync(path.join(AUSGABE, `${route.replace(/\//g, '_') || '_'}-${f.name}-${p.y}.png`), p.png);
        }
        if ((maxL?.anteil ?? 0) >= LUECKE_AB) {
          const wieder = await nachmessen(browser, vorschau.basis, route, f, maxL.y);
          befunde.push({ art: 'Luecke', route, fenster: f.name, y: maxL.y, wert: maxL.anteil, wieder, ebenen: maxL.ebenen, bestaetigt: wieder >= LUECKE_AB });
        }
        const mk = maxE?.ebenen?.masken ?? 0;
        if (mk >= MASKEN_HART) befunde.push({ art: 'Masken', route, fenster: f.name, y: maxE.y, wert: mk, ebenen: maxE.ebenen, bestaetigt: true });
        else if (mk >= MASKEN_HINWEIS) hinweise.push({ route, fenster: f.name, text: `${mk} Maske(n) in Seitengröße bei y ${maxE.y} (${ebenenText(maxE.ebenen)})` });
        process.stdout.write(mk >= MASKEN_HART || (maxL?.anteil ?? 0) >= LUECKE_AB ? '!' : '.');
      }
    };
    await Promise.all(browserListe.map(arbeiter));
  } finally {
    await Promise.all(browserListe.map((b) => b.close()));
    vorschau.stopp();
  }
  process.stdout.write('\n');
  return { befunde, hinweise, uebersicht, eichung, fenster };
}

const { befunde, hinweise, uebersicht, eichung, fenster } = await main();
const harte = befunde.filter((b) => b.bestaetigt);
const unbestaetigt = befunde.filter((b) => !b.bestaetigt);
const ordnung = (a, b) => routen.indexOf(a.route) - routen.indexOf(b.route) || fenster.findIndex((f) => f.name === a.fenster) - fenster.findIndex((f) => f.name === b.fenster);
uebersicht.sort(ordnung);
const befundZeile = (b) => `| ${b.art} | \`${b.route}\` | ${b.fenster} | ${b.y} | ${b.art === 'Luecke' ? `${prozent(b.wert)} (nachgemessen ${prozent(b.wieder)})` : b.wert} | ${ebenenText(b.ebenen)} |`;
const md = [
  gegenprobe ? '# Zeichenlücken: Gegenprobe' : '# Zeichenlücken (Compositor)', '',
  `> Erzeugt von \`npm run zeichnen\` am ${new Date().toLocaleString('de-DE')}, ${urlArg ?? 'dist/ (vite preview)'}, ${sichtbar ? 'sichtbares Chrome' : 'Chrome headless'}, ${process.platform}. Fenster: ${fenster.map((f) => f.text).join(', ')}. Nicht von Hand bearbeiten.`, '',
  `**Eichung** (/ bei 1920 × 945 mit eingespieltem Fehler vom 19.10.): Lücke ${prozent(eichung.luecke)}, ${eichung.masken} Masken in Seitengröße. ${eichung.zeigt ? 'Dieser Rechner zeigt Zeichenlücken, das Lückenurteil gilt.' : '⚠️ Dieser Rechner zeigt den Fehler nicht als Lücke. Für Lücken gibt es hier kein Urteil, nur für die Ebenen.'}`, '',
  ...(gegenprobe ? [] : [
    `**${harte.length} harte Befunde**, ${unbestaetigt.length} unbestätigte Lücken, ${hinweise.length} Hinweise. Grenzen: Lücke ab ${prozent(LUECKE_AB)} der Fläche, Masken in Seitengröße hart ab ${MASKEN_HART}, Hinweis ab ${MASKEN_HINWEIS}.`, '',
    ...(befunde.length ? ['## Befunde', '', '| Art | Route | Fenster | Scroll-y | Wert | Ebenen an der Stelle |', '|---|---|---|---|---|---|', ...befunde.map(befundZeile), ''] : []),
    ...(hinweise.length ? ['## Hinweise', '', ...hinweise.map((h) => `- \`${h.route}\` @${h.fenster}: ${h.text}`), ''] : []),
    '## Alle Routen', '', '| Route | Fenster | Positionen | größte Lücke | Masken (max) | seitengroße Ebenen (max) | Weichzeichner (max) |', '|---|---|---|---|---|---|---|',
    ...uebersicht.map((u) => `| \`${u.route}\` | ${u.fenster} | ${u.positionen} | ${prozent(u.luecke)}${u.luecke ? ` (y ${u.lueckeY})` : ''} | ${u.masken}${u.masken ? ` (y ${u.maskenY})` : ''} | ${u.seitengross} | ${u.weich} |`), '',
  ]),
];
fs.writeFileSync(path.join(AUSGABE, gegenprobe ? 'gegenprobe.md' : 'bericht.md'), md.join('\n'));

if (gegenprobe) {
  const ebenenGetroffen = eichung.masken >= MASKEN_HART;
  const lueckeGetroffen = eichung.zeigt;
  console.log(`[zeichnen] Gegenprobe: Ebenen ${ebenenGetroffen ? 'gemeldet' : 'NICHT gemeldet'} (${eichung.masken} Masken, Grenze ${MASKEN_HART}), Lücke ${lueckeGetroffen ? 'gemeldet' : 'nicht sichtbar auf diesem Rechner'} (${prozent(eichung.luecke)}).`);
  if (!ebenenGetroffen) { console.log('[zeichnen] GEGENPROBE FEHLGESCHLAGEN: eingespielter Fehler nicht als Ebenen erkannt.'); process.exit(1); }
  if (!lueckeGetroffen) { console.log('[zeichnen] Gegenprobe nur halb: Dieser Rechner zeigt die Lücke nicht (Budget). Keine Aussage über Lücken (Exit 2).'); process.exit(2); }
  console.log('[zeichnen] Gegenprobe bestanden: Ebenen und Lücke gemeldet.');
  process.exit(0);
}

console.log(`[zeichnen] ${routen.length} Routen × ${fenster.length} Fenster. ${harte.length} harte Befunde, ${unbestaetigt.length} unbestätigte Lücken, ${hinweise.length} Hinweise. Bericht: output/zeichnen/bericht.md`);
for (const b of befunde) console.log(`  ${b.bestaetigt ? 'HART' : 'unbestätigt'} ${b.art} ${b.route} @${b.fenster} y ${b.y}: ${b.art === 'Luecke' ? `${prozent(b.wert)} (nachgemessen ${prozent(b.wieder)})` : `${b.wert} Masken in Seitengröße`} · ${ebenenText(b.ebenen)}`);
for (const h of hinweise) console.log(`  Hinweis ${h.route} @${h.fenster}: ${h.text}`);
if (harte.length) process.exit(1);
if (!eichung.zeigt) {
  console.log('[zeichnen] Ebenen in Ordnung. Für Lücken KEIN Urteil: Dieser Rechner zeigt den eingespielten Fehler nicht (Exit 2).');
  process.exit(2);
}
process.exit(0);
