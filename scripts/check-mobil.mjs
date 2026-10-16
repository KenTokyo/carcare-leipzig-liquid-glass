// Mobile-Check: Was auf dem Smartphone kaputt aussieht, ohne dass es jemand sieht.
//
// AUFRUF:
//   npm run mobil                          alle Routen, drei Fenster (360 × 640, 390 × 844, 430 × 932)
//   npm run mobil -- /kontakt /            nur diese Routen
//   npm run mobil -- --breite=390          nur dieses Fenster
//   npm run mobil -- --gegenprobe          PRUEFT DEN PRUEFER: spielt auf / bekannte Fehler ein und verlangt,
//                                          dass jeder gemeldet wird (Exit 1 sonst)
//   (unter Git Bash `MSYS_NO_PATHCONV=1` davor, sonst kommt `/kontakt` als `C:/Program Files/Git/kontakt` an)
//
// BRAUCHT ein aktuelles `dist/` (`npm run build`), startet `vite preview` selbst. Bericht: `output/mobil/bericht.md`,
// die Gegenprobe schreibt nach `output/mobil/gegenprobe.md` (bis 2026-10-15 ueberschrieb sie den echten Bericht).
//
// WAS GEMESSEN WIRD (je Route und Fenster, nachdem die Seite einmal ganz durchgescrollt wurde, damit
// eingeblendete Inhalte stehen):
//   HART (Exit 1):
//   - Seite scrollt waagerecht (`scrollWidth` > Fensterbreite).
//   - ABGESCHNITTEN: Text, dessen Zeilen ueber den Rand eines Vorfahren mit `overflow: hidden/clip` hinausreichen
//     (gemessen an den echten Textzeilen per `Range`, nicht an der Elementbox: ein `nowrap`-Wort laeuft aus seiner
//     Box heraus, ohne dass die Box waechst). Behaelter mit `overflow: auto/scroll` zaehlen nicht, dort scrollt man.
//   - AUSSERHALB: Text, der rechts oder links aus dem Fenster ragt, ohne dass ein Vorfahr ihn abschneidet.
//   - TREFFERFLAECHE unter 24 × 24 px (WCAG 2.5.8). Ausnahmen wie in der Norm: Links im Fliesstext und kleine
//     Ziele, um die ein 24-px-Quadrat frei bleibt.
//   - FUSSZEILE UNSICHTBAR: Am Seitenende muessen mindestens 50 % ihrer Texte sichtbar sein (Deckkraft ab 50 %).
//   - FUSSZEILE: Sie ist `position: fixed` am unteren Rand. Ragt sie am Seitenende oben aus dem Fenster, ist der
//     obere Teil nie erreichbar. Und: Inhalte der Fusszeile, die von etwas anderem verdeckt sind (mobile Leiste,
//     Navbar), per `elementFromPoint`.
//   - EINBLENDUNG ZU GROSS: Ein Dialog (`role="dialog"`, fest positioniert), der ohne Zutun erscheint (Stellen-Pop-up
//     auf /karriere), belegt mehr als 30 % der Fensterhoehe. Massstab: Better Ads Standard (mobil ueber 30 % der Hoehe =
//     stoerend) und Google Search Central („Avoid intrusive interstitials and dialogs“: Banner sollen nur einen kleinen
//     Teil des Bildschirms belegen). Gemessen frühestens 3 s nach dem Laden.
//   - EINBLENDUNG NICHT SCHLIESSBAR: kein Schliessknopf, Knopf verdeckt oder ausserhalb des Fensters, oder Tippen
//     darauf laesst sie stehen. Danach bleibt sie geschlossen, wie beim Besucher: „Fußzeile verdeckt“ meldet so nur
//     Dauerhaftes (bis 2026-10-15 meldete es zehnmal das Stellen-Pop-up).
//   - ERSTER BILDSCHIRM VERDECKT (seit 2026-10-16): Elemente mit `data-erster-bildschirm` (derzeit die
//     Vertrauensleiste im Titelbild der Startseite) muessen bei Scrollposition 0 mit jeder Textzeile ganz im Fenster
//     stehen und duerfen von nichts verdeckt sein (`elementFromPoint`, z. B. die feste Leiste unten). Gemessen in den
//     drei Fenstern UND zusaetzlich in den niedrigen Fenstern von Safari und Chrome (FENSTER_ERSTER_BILDSCHIRM):
//     Der User sah dort die Knoepfe auf der Vertrauensleiste (iPhone 14 Pro, Safari mit Leisten 393 × 659: 84 px
//     verdeckt), waehrend die Bildschirmmasse 393 × 852 frei waren.
//     ODER GANZ UNTERHALB (seit 2026-10-17, R29): Unter 640 px Hoehe beginnt die Leiste auf Wunsch des Users erst unter
//     dem Fensterrand (styles/hero.css). Das gilt als in Ordnung, wenn Kasten und Text ganz unter dem Rand liegen und
//     hoechstens UNTER_RAND_MAX px tief beginnen; tiefer meldet sie als ERSTER BILDSCHIRM ZU TIEF. Angeschnitten (teils
//     im Fenster, teils darunter) oder verdeckt ist nie erlaubt.
//   HINWEIS (kein Exit 1):
//   - Schrift unter 12 px (sichtbarer Text).
//
// BEWUSSTER ANSCHNITT: Ein Behaelter mit `data-mobil-anschnitt` (Begruendung als Wert) wird ausgenommen, etwa das
// Karussell „Einblicke“, dessen Nachbarkarten absichtlich am Rand angeschnitten sind.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage, CLAUDE.md):
//  1. ZUSTAENDE: Gemessen wird der Ruhezustand nach dem Durchscrollen, oben und am Seitenende. Aufgeklappte Menues,
//     Akkordeons, Dialoge, die erst auf Klick aufgehen (Suche, Menue), andere Karussellstellungen und Zwischenzustaende
//     gepinnter Sektionen sieht sie nicht.
//  2. DREI FENSTER. Dazwischen nicht; Tablet und Querformat gar nicht. Und es sind BILDSCHIRMMASSE: Im echten Browser
//     ziehen Adress- und Werkzeugleiste Hoehe ab, solange sie ausgeklappt sind (iOS Safari aendert `innerHeight` mit
//     ihnen). Was hier bei 844 px gerade noch passt (fixierte Fusszeile, Anteil einer Einblendung), passt dort nicht
//     unbedingt; 360 × 640 kommt dem echten Fenster am naechsten. Nicht nachgemessen an echten Geraeten.
//  3. GEOMETRIE, KEIN URTEIL: Ein Text kann ganz im Rahmen liegen und trotzdem schlecht aussehen (Umbruch nach einem
//     Wort, Witwen, gequetschte Karten). Dafuer sind die Bildschirmfotos da (`npm run shots -- 390`).
//  4. VERDECKUNG nur in der Fusszeile und nur am Seitenende. Was die mobile Leiste im Seitenverlauf ueberdeckt,
//     zieht vorbei und zaehlt nicht.
//  5. UNSICHTBARES: Text mit Deckkraft unter 5 % (noch nicht eingeblendet, weit entfernte Karussellkarten) zaehlt nicht.
//     Blendet eine Sektion ihren Inhalt erst sehr spaet ein, faellt sie durch.
//  6. `data-mobil-anschnitt` ist ein Freibrief. Wer es setzt, schreibt die Begruendung als Wert dazu.
//  7. NUR WAAGERECHT: Abgeschnitten heisst hier „seitlich ueber den Rand“. Text, den `line-clamp` oder eine feste
//     Hoehe UNTEN abschneidet (dritte Zeile eines zweizeiligen Titels), meldet sie nicht.
//  8. GEGENPROBE (`--gegenprobe`) prueft die vier harten Inhaltsarten, die unsichtbare Fusszeile, eine eingespielte,
//     zu grosse Einblendung ohne Schliessknopf und den ersten Bildschirm dreifach (angeschnitten, verdeckt, zu tief;
//     seit 2026-10-17), zusammen zehn Fehler; nicht „Fusszeile nicht erreichbar“ und „Fusszeile verdeckt“. Diese
//     beiden haben sich am 2026-10-14 am echten Fehler bewiesen (Fusszeile 1117 px auf 844 px Fenster, oben 281 px unerreichbar; Copyright
//     unter der mobilen Leiste), „zu groß“ am 2026-10-15 am Stellen-Pop-up (66 % bei 360 × 640).
//  9. EINBLENDUNGEN zaehlen nur mit Dialog-Rolle und `position: fixed`. Ein Overlay ohne Rolle, eines, das spaeter als
//     3 s nach dem Laden kommt oder erst beim Scrollen ausgeloest wird und dann wieder geht, faellt durch. Der Anteil ist
//     die HOEHE im Fenster: Ein schmales Pop-up am Rand eines breiten Fensters waere damit zu streng gemessen; hier
//     laufen nur Handybreiten.
// 10. ERSTER BILDSCHIRM nur fuer markierte Elemente (`data-erster-bildschirm`) und nur bei Scrollposition 0, in den
//     Fensterhoehen dieser Datei. Safari aendert die Hoehe mit seinen Leisten: 659 px beim iPhone 14 Pro mit
//     eingeblendeten Leisten (so fuehrt es u. a. Rocket Validator), rund 739 px eingeklappt; 629 px beim iPhone 13 mini
//     und 548 px beim iPhone SE in Safari, 560 px bei einem 360 × 640 grossen Android mit Chrome-Leisten (ausser 659
//     alle abgeleitet, keines am Geraet nachgemessen). 375 × 667 ist das BILDSCHIRMMASS des SE. Querformat prueft sie nicht.
//     SEIT 2026-10-17 GILT AUCH „GANZ UNTERHALB“ (R29). Was damit durchgeht, ohne in Ordnung zu sein:
//     a) Der KOPFBLOCK ueber der Leiste ist nicht markiert. Ragt er selbst unter die Knoepfe (bei 320 × 480 die
//        Unterzeile, Fenster nicht in der Liste), meldet sie nichts.
//     b) UNTER_RAND_MAX ist eine Annahme, wie weit ein erstes Wischen traegt, keine Messung.
//     c) Der Treffertest sieht nur, was Zeigerereignisse annimmt: Eine Flaeche mit `pointer-events: none` ueber dem Text
//        faellt durch (die Knoepfe der festen Leiste nehmen sie an, ihr Behaelter nicht). Er tastet jede Zeile alle 8 px
//        ab, an Ober- und Unterkante und in der Mitte; bis 2026-10-16 an drei Punkten der Mitte, die bei 375 px Breite
//        alle in Luecken oder Raender der Leiste fallen konnten (Luecken 10 px, Rand 12 px).
//     d) Puppeteer setzt `100svh` gleich der Fensterhoehe. Dass Safari beim Laden genau `100svh` zeigt (kleiner Viewport
//        = Leisten eingeblendet), folgt aus der Definition, ist am Geraet aber nicht nachgemessen.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview, HALTE_SCROLL } from './lib/preview-server.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'mobil');
const FENSTER = [
  { name: '360', width: 360, height: 640 },
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
];
/**
 * Zusaetzliche, NIEDRIGE Fenster nur fuer ERSTER BILDSCHIRM und nur auf Routen mit `data-erster-bildschirm`: so viel
 * Hoehe bleibt einem iPhone 14 Pro in Safari mit ein- und mit ausgeblendeten Leisten, dazu das Bildschirmmass des
 * iPhone SE und seit 2026-10-17 (R29) die Fenster unter 640 px, in denen die Leiste unter dem Rand beginnt
 * (Herkunft der Werte: Pflichtfrage 10).
 */
const FENSTER_ERSTER_BILDSCHIRM = [
  { name: '393x659 (iPhone 14 Pro, Safari mit Leisten)', width: 393, height: 659 },
  { name: '393x739 (iPhone 14 Pro, Safari ohne Leisten)', width: 393, height: 739 },
  { name: '375x667 (iPhone SE, Bildschirmmass)', width: 375, height: 667 },
  { name: '375x629 (iPhone 13 mini, Safari mit Leisten)', width: 375, height: 629 },
  { name: '375x600 (zwischen mini und SE)', width: 375, height: 600 },
  { name: '360x560 (kleines Android, Chrome mit Leisten)', width: 360, height: 560 },
  { name: '375x548 (iPhone SE, Safari mit Leisten)', width: 375, height: 548 },
];
/**
 * Hoechstens so tief darf ein markiertes Element unter dem Fensterrand beginnen, damit es mit dem ersten Wischen ins
 * Bild kommt (ERSTER BILDSCHIRM, „ganz unterhalb“). Eine Annahme (Pflichtfrage 10 b); die Vertrauensleiste beginnt
 * 8 px darunter.
 */
const UNTER_RAND_MAX = 120;
/** Hoechstanteil einer Einblendung an der Fensterhoehe in Prozent (Begruendung im Kopf, EINBLENDUNG ZU GROSS). */
const EINBLENDUNG_MAX = 30;
const args = process.argv.slice(2);
const gegenprobe = args.includes('--gegenprobe');
const nurBreite = args.find((a) => a.startsWith('--breite='))?.split('=')[1];
const nurRouten = args.filter((a) => a.startsWith('/'));
const routen = gegenprobe ? ['/'] : nurRouten.length ? nurRouten : getRoutes().map((r) => r.path ?? r);
const fenster = FENSTER.filter((f) => !nurBreite || f.name === nurBreite);
const BERICHT = gegenprobe ? 'gegenprobe.md' : 'bericht.md';
const warte = (ms) => new Promise((r) => setTimeout(r, ms));

/** Laeuft IM Browser (nur `--gegenprobe`): vier bekannte Fehler oben in <main>, eine Einblendung und drei Faelle fuer den
 * ersten Bildschirm an <body>; mit `nurErsterBildschirm` nur die drei (Zusatzfenster, siehe unten). */
function einspielen(unterRandMax, nurErsterBildschirm = false) {
  if (!nurErsterBildschirm) {
    const box = document.createElement('div');
    box.id = 'mobil-gegenprobe';
    box.innerHTML = `
      <div style="width:150vw;white-space:nowrap">GEGENPROBE_UEBERLAUF ragt rechts aus dem Fenster hinaus</div>
      <div style="width:60px;overflow:hidden;white-space:nowrap">GEGENPROBE_ABGESCHNITTEN langer Text</div>
      <div style="display:flex;gap:4px"><button aria-label="GEGENPROBE_ZIEL" style="width:16px;height:16px;padding:0">a</button><button style="width:16px;height:16px;padding:0">b</button></div>
      <p style="font-size:9px">GEGENPROBE_KLEIN</p>
      <style>footer * { opacity: 0 !important; }</style>`;
    (document.querySelector('main') || document.body).prepend(box);
    // An <body>, nicht in <main>: `.site-main-shell` traegt einen Transform, `fixed` klebte sonst an <main>.
    const einblendung = document.createElement('div');
    einblendung.setAttribute('role', 'dialog');
    einblendung.setAttribute('aria-label', 'GEGENPROBE_EINBLENDUNG');
    einblendung.style.cssText = 'position:fixed;left:0;right:0;bottom:0;height:45vh;background:#fff;z-index:2147483000';
    einblendung.textContent = 'GEGENPROBE_EINBLENDUNG ohne Schließknopf';
    document.body.append(einblendung);
  }
  // ERSTER BILDSCHIRM, drei Fehler (seit 2026-10-17; bis dahin schob `margin-top: 60vh` die echte Leiste nach unten, in
  // niedrigen Fenstern landete sie damit ganz unterhalb und galt seit R29 als in Ordnung): ueber den unteren Rand
  // ragend, unter der festen Leiste (z-index darunter, links, wo ein Knopf liegt) und zu tief unter dem Rand. In den
  // Zusatzfenstern ohne die Einblendung oben: Sie belegt die unteren 45 % und haette dort statt der festen Leiste verdeckt.
  const stil = 'left:24px;font:16px/24px sans-serif;color:#000;background:#fff;padding:0 4px';
  for (const [text, lage] of [
    ['GEGENPROBE_ANGESCHNITTEN am Rand', 'position:fixed;bottom:-12px;z-index:2147483000'],
    ['GEGENPROBE_VERDECKT unter Leiste', 'position:fixed;bottom:30px;z-index:1'],
    ['GEGENPROBE_ZU_TIEF unter dem Rand', `position:absolute;top:calc(100vh + ${unterRandMax + 200}px)`],
  ]) {
    const el = document.createElement('div');
    el.setAttribute('data-erster-bildschirm', '');
    el.style.cssText = `${lage};${stil}`;
    el.textContent = text;
    document.body.append(el);
  }
}

/**
 * Laeuft IM Browser, bei Scrollposition 0. Je Element mit `data-erster-bildschirm` muss eines gelten:
 *  - GANZ SICHTBAR: jede Textzeile ganz im Fenster und von nichts verdeckt (Treffertest alle 8 px entlang der Zeile, an
 *    Ober- und Unterkante und in der Mitte), oder
 *  - GANZ UNTERHALB (seit 2026-10-17, R29): Kasten und Text beginnen unter dem Fensterrand, hoechstens `unterRandMax` px.
 * Angeschnitten, verdeckt oder tiefer wird gemeldet; `zustand` nennt je Element, was gemessen wurde (fuer den Bericht).
 */
function ersterBildschirm(unterRandMax) {
  const H = innerHeight;
  const knapp = (t, n = 50) => (t || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const raus = [];
  const zustand = [];
  const marken = [...document.querySelectorAll('[data-erster-bildschirm]')];
  for (const marke of marken) {
    const zeilen = [];
    const gehe = document.createTreeWalker(marke, NodeFilter.SHOW_TEXT);
    while (gehe.nextNode()) {
      const text = knapp(gehe.currentNode.nodeValue);
      if (text.length < 2) continue;
      const bereich = document.createRange();
      bereich.selectNodeContents(gehe.currentNode);
      for (const z of bereich.getClientRects()) if (z.width >= 4 && z.height >= 4) zeilen.push({ text, z });
    }
    const name = zeilen[0]?.text || knapp(marke.textContent, 40);
    const box = marke.getBoundingClientRect();
    const oben = Math.min(box.top, ...zeilen.map(({ z }) => z.top));
    if (oben >= H) {
      const tief = Math.round(oben - H);
      zustand.push({ text: name, wie: `ganz unterhalb, beginnt ${tief} px unter dem Rand` });
      if (tief > unterRandMax) raus.push({ art: 'Erster Bildschirm zu tief', ort: 'Erster Bildschirm', text: name, wie: `beginnt ${tief} px unter dem Rand (höchstens ${unterRandMax})` });
      continue;
    }
    const vorher = raus.length;
    for (const { text, z } of zeilen) {
      if (z.top < 0 || z.bottom > H) {
        const um = z.top < 0 ? `${Math.round(-z.top)} px über` : `${Math.round(z.bottom - H)} px unter`;
        raus.push({ art: 'Erster Bildschirm verdeckt', ort: 'Erster Bildschirm', text, wie: `angeschnitten, ${um} dem Fenster` });
        continue;
      }
      const xs = [];
      for (let x = z.left + 2; x < z.right - 2; x += 8) xs.push(x);
      xs.push(z.right - 2);
      treffer: for (const y of [z.top + 2, z.top + z.height / 2, z.bottom - 2]) {
        for (const x of xs) {
          const drauf = document.elementFromPoint(x, y);
          if (drauf && !marke.contains(drauf)) {
            const von = drauf.closest('[class]');
            raus.push({ art: 'Erster Bildschirm verdeckt', ort: 'Erster Bildschirm', text, wie: `verdeckt von ${knapp(von ? `${von.tagName.toLowerCase()}.${(von.getAttribute('class') || '').split(' ')[0]}` : drauf.tagName, 40)}` });
            break treffer;
          }
        }
      }
    }
    zustand.push({ text: name, wie: raus.length > vorher ? 'angeschnitten oder verdeckt' : `ganz sichtbar, endet ${Math.round(H - box.bottom)} px über dem Rand` });
  }
  return { marken: marken.length, zustand, befunde: raus.filter((b, i, a) => a.findIndex((c) => c.text === b.text && c.art === b.art) === i) };
}

/** Laeuft IM Browser: Einblendungen, die ohne Zutun stehen (Dialog-Rolle, fest positioniert, sichtbar). */
function findeEinblendungen() {
  const H = innerHeight;
  const W = innerWidth;
  const knapp = (s, n = 50) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const deckkraft = (el) => { let o = 1; for (let a = el; a && a !== document.documentElement; a = a.parentElement) o *= Number(getComputedStyle(a).opacity); return o; };
  const SCHLIESSEN = /schlie(ß|ss)en|close/i;
  return [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog[open]')]
    .filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.position === 'fixed' && cs.display !== 'none' && cs.visibility !== 'hidden' && deckkraft(el) > 0.05 && r.width > 1 && r.height > 1 && r.bottom > 0 && r.top < H;
    })
    .map((el, nr) => {
      el.setAttribute('data-mobil-einblendung', String(nr));
      const r = el.getBoundingClientRect();
      const anteil = Math.round((100 * (Math.min(r.bottom, H) - Math.max(r.top, 0))) / H);
      const knopf = [...el.querySelectorAll('button, [role="button"]')].find((b) => SCHLIESSEN.test(b.getAttribute('aria-label') || b.textContent || ''));
      // Erreichbar heisst: ganz im Fenster und beim Tippen auf seine Mitte trifft man ihn selbst, nicht die Navbar.
      let ziel = null;
      if (knopf) {
        const k = knopf.getBoundingClientRect();
        const x = k.left + k.width / 2;
        const y = k.top + k.height / 2;
        const drin = k.top >= 0 && k.bottom <= H && k.left >= 0 && k.right <= W;
        const oben = drin ? document.elementFromPoint(x, y) : null;
        if (oben && knopf.contains(oben)) ziel = { x: Math.round(x), y: Math.round(y) };
      }
      return { nr, text: knapp(el.getAttribute('aria-label') || el.textContent), anteil, hatKnopf: !!knopf, knopf: ziel };
    });
}

/** Laeuft IM Browser: Ist die Einblendung `nr` weg (entfernt, versteckt oder durchsichtig)? */
function istZu(nr) {
  const el = document.querySelector(`[data-mobil-einblendung="${nr}"]`);
  if (!el) return true;
  const cs = getComputedStyle(el);
  let o = 1;
  for (let a = el; a && a !== document.documentElement; a = a.parentElement) o *= Number(getComputedStyle(a).opacity);
  return cs.display === 'none' || cs.visibility === 'hidden' || o < 0.05;
}

/** Laeuft IM Browser. `fussMessen`: am Seitenende die Fusszeile pruefen, sonst den Inhalt. */
function messe(fussMessen) {
  const W = innerWidth;
  const H = innerHeight;
  const MAX = 80;
  const knapp = (s, n = 60) => (s || '').replace(/\s+/g, ' ').trim().slice(0, n);
  const anzeigbar = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const deckkraft = (el) => { let o = 1; for (let a = el; a && a !== document.documentElement; a = a.parentElement) o *= Number(getComputedStyle(a).opacity); return o; };
  const ort = (el) => {
    const sek = el.closest('section, footer, header, nav, [role="dialog"], aside');
    if (!sek) return 'Seite';
    let n = sek.id ? `#${sek.id}` : sek.tagName.toLowerCase();
    const h = sek.querySelector('h1, h2');
    if (h) n += ` „${knapp(h.textContent, 40)}“`;
    return n;
  };
  const name = (el) => knapp(el.getAttribute('aria-label') || el.innerText || el.id || el.tagName, 50);
  const ausgenommen = (el) => !!el.closest('[data-mobil-anschnitt]');

  // Textstellen: je Textknoten die echten Zeilen (Range), gruppiert nach Elternelement.
  const texte = [];
  const gang = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = gang.nextNode(); n; n = gang.nextNode()) {
    const t = n.textContent.trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || el.closest('script, style, noscript, template, svg')) continue;
    if (!anzeigbar(el)) continue;
    range.selectNodeContents(n);
    const r = range.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    texte.push({ el, r, t });
  }

  if (fussMessen) {
    const fuss = document.querySelector('footer');
    if (!fuss) return { fuss: null };
    const rf = fuss.getBoundingClientRect();
    // Nur die FIXIERTE Fusszeile kann oben unerreichbar sein; im Seitenfluss (passt nicht ins Fenster, seit 2026-10-14)
    // scrollt man zu ihrem oberen Teil einfach hoch.
    const fixiert = getComputedStyle(fuss).position === 'fixed';
    const verdeckt = [];
    const unerreichbar = [];
    const kandidaten = [...texte.filter((x) => fuss.contains(x.el)).map((x) => ({ el: x.el, r: x.r, t: x.t })),
      ...[...fuss.querySelectorAll('a[href], button')].filter(anzeigbar).map((el) => ({ el, r: el.getBoundingClientRect(), t: name(el) }))];
    for (const k of kandidaten) {
      if (deckkraft(k.el) < 0.05) continue;
      if (k.r.bottom < 0 || k.r.top < -1) { if (fixiert) unerreichbar.push({ ort: 'Fußzeile', text: knapp(k.t), um: Math.round(-k.r.top) }); continue; }
      const cx = Math.min(W - 1, Math.max(0, k.r.left + k.r.width / 2));
      const cy = Math.min(H - 1, Math.max(0, k.r.top + k.r.height / 2));
      // Im Seitenfluss zieht die obere Haelfte beim Scrollen unter der Navbar vorbei wie jeder Inhalt; dauerhaft liegen
      // kann dort nur etwas am unteren Rand (Leiste). Erste Fassung meldete 304 Mal die Navbar (2026-10-15).
      if (!fixiert && cy < H / 2) continue;
      const oben = document.elementFromPoint(cx, cy);
      if (oben && !fuss.contains(oben)) {
        const von = oben.closest('[class]');
        verdeckt.push({ ort: 'Fußzeile', text: knapp(k.t), von: knapp(von ? `${von.tagName.toLowerCase()}.${String(von.className).split(' ')[0]}` : oben.tagName, 40) });
      }
    }
    const eindeutig = (a) => [...new Map(a.map((x) => [x.text, x])).values()].slice(0, MAX);
    // SICHTBAR: Anteil der Fusszeilen-Texte mit Deckkraft ab 50 %. Am 2026-10-15 war die Fusszeile im Seitenfluss leer
    // (Framer Motion liess Deckkraft 0 stehen); alle anderen Pruefungen hier ueberspringen Unsichtbares und waren gruen.
    const fussTexte = texte.filter((x) => fuss.contains(x.el));
    const sichtbar = fussTexte.length ? Math.round((100 * fussTexte.filter((x) => deckkraft(x.el) >= 0.5).length) / fussTexte.length) : 0;
    return { fuss: { hoehe: Math.round(rf.height), oben: Math.round(rf.top), fenster: H, sichtbar, fixiert }, verdeckt: eindeutig(verdeckt), unerreichbar: eindeutig(unerreichbar) };
  }

  // 1. Abgeschnitten / ausserhalb
  const abgeschnitten = [];
  const ausserhalb = [];
  for (const { el, r, t } of texte) {
    if (ausgenommen(el) || deckkraft(el) < 0.05) continue;
    let geklemmt = false;
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      const ox = cs.overflowX;
      if (ox === 'auto' || ox === 'scroll') break; // scrollbarer Behaelter: erreichbar
      if (cs.position === 'fixed') break;
      if (ox === 'hidden' || ox === 'clip') {
        const ra = a.getBoundingClientRect();
        const ueber = Math.max(r.right - ra.right, ra.left - r.left);
        if (ueber > 1.5) { abgeschnitten.push({ ort: ort(el), text: knapp(t), um: Math.round(ueber), behaelter: `${a.tagName.toLowerCase()}${a.id ? `#${a.id}` : ''}` }); geklemmt = true; break; }
      }
    }
    if (!geklemmt && (r.right > W + 1.5 || r.left < -1.5)) ausserhalb.push({ ort: ort(el), text: knapp(t), um: Math.round(Math.max(r.right - W, -r.left)) });
  }

  // 2. Trefferflaechen
  const ZIELE = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [tabindex]:not([tabindex="-1"])';
  const alle = [...document.querySelectorAll(ZIELE)].filter((el) => anzeigbar(el) && deckkraft(el) >= 0.05);
  const rects = alle.map((el) => el.getBoundingClientRect());
  const mitte = rects.map((r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
  const zuKlein = rects.map((r) => r.width < 24 || r.height < 24);
  const abstandZuRechteck = (p, s) => Math.hypot(Math.max(s.left - p.x, 0, p.x - s.right), Math.max(s.top - p.y, 0, p.y - s.bottom));
  const ziele = [];
  alle.forEach((el, i) => {
    if (!zuKlein[i]) return;
    const r = rects[i];
    const cs = getComputedStyle(el);
    // Ausnahme „im Fliesstext“: inline und der Absatz hat deutlich mehr Text als der Link.
    const block = el.parentElement?.closest('p, li, dd, td, figcaption, label');
    if (cs.display === 'inline' && block && (block.textContent || '').trim().length > (el.textContent || '').trim().length + 15) return;
    // Ausnahme „Abstand“ (WCAG 2.5.8): Der 24-px-Kreis um die Mitte schneidet kein anderes Ziel und keinen Kreis eines
    // anderen zu kleinen Ziels. Bis zur Gegenprobe am 2026-10-14 stand hier ein Quadrat gegen Rechtecke, Kante an Kante
    // galt als frei: zwei 16-px-Knoepfe mit 4 px Abstand gingen durch.
    const eng = alle.some((anderes, j) => {
      if (j === i || anderes.contains(el) || el.contains(anderes)) return false;
      if (abstandZuRechteck(mitte[i], rects[j]) < 12) return true;
      return zuKlein[j] && Math.hypot(mitte[i].x - mitte[j].x, mitte[i].y - mitte[j].y) < 24;
    });
    if (!eng) return;
    ziele.push({ ort: ort(el), text: name(el), mass: `${Math.round(r.width)} × ${Math.round(r.height)}` });
  });

  // 3. Kleine Schrift (Hinweis)
  const klein = [];
  const gesehen = new Set();
  for (const { el, t } of texte) {
    if (gesehen.has(el) || deckkraft(el) < 0.05) continue;
    gesehen.add(el);
    const px = parseFloat(getComputedStyle(el).fontSize);
    if (px < 12) klein.push({ ort: ort(el), text: knapp(t, 40), px: Math.round(px * 10) / 10 });
  }

  const meta = document.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
  return {
    breite: document.documentElement.scrollWidth, fenster: W, viewportMeta: meta,
    abgeschnitten: abgeschnitten.slice(0, MAX), ausserhalb: ausserhalb.slice(0, MAX), ziele: ziele.slice(0, MAX), klein: klein.slice(0, MAX),
  };
}

const { basis, stopp } = await startePreview(4198);
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const ergebnisse = [];
try {
  for (const route of routen) {
    for (const f of fenster) {
      const s = await browser.newPage();
      const fehler = [];
      s.on('pageerror', (e) => fehler.push(e.message));
      await s.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await s.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
      await s.evaluateOnNewDocument(HALTE_SCROLL);
      await s.setViewport({ width: f.width, height: f.height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await s.goto(basis + route, { waitUntil: 'networkidle0', timeout: 60000 });
      const geladen = Date.now();
      await warte(700);
      if (gegenprobe) await s.evaluate(einspielen, UNTER_RAND_MAX);
      // Einmal ganz durchscrollen, damit eingeblendete Inhalte stehen; dann oben messen, am Ende die Fusszeile.
      const hoehe = await s.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < hoehe; y += Math.round(f.height * 0.8)) { await s.evaluate((p) => window.__ccHalte(p), y); await warte(110); }
      await s.evaluate(() => window.__ccHalte(0));
      await warte(800);
      const inhalt = await s.evaluate(messe, false);
      const erster = await s.evaluate(ersterBildschirm, UNTER_RAND_MAX);
      // Einblendungen fruehestens 3 s nach dem Laden (das Stellen-Pop-up kommt nach 1,2 s); messen, dann schliessen wie
      // ein Besucher, damit die Fusszeilen-Messung am Ende nur noch Dauerhaftes sieht.
      const rest = 3000 - (Date.now() - geladen);
      if (rest > 0) await warte(rest);
      const einblendungen = await s.evaluate(findeEinblendungen);
      for (const e of einblendungen) {
        if (e.knopf) { await s.touchscreen.tap(e.knopf.x, e.knopf.y); await warte(900); }
        e.geschlossen = await s.evaluate(istZu, e.nr);
      }
      await s.evaluate(() => window.__ccHalte(document.documentElement.scrollHeight));
      await warte(1600);
      const ende = await s.evaluate(messe, true);
      ergebnisse.push({ route, fenster: f.name, ...inhalt, ...ende, einblendungen, fehler, erster: erster.befunde, zustand: erster.zustand, marken: erster.marken });
      await s.close();
      process.stdout.write('.');
    }
  }
  // ERSTER BILDSCHIRM zusaetzlich in den niedrigen Fenstern eines iPhone, nur auf Routen mit Markierung.
  const mitMarke = [...new Set(ergebnisse.filter((r) => r.marken > 0).map((r) => r.route))];
  for (const route of mitMarke) {
    for (const f of FENSTER_ERSTER_BILDSCHIRM) {
      const s = await browser.newPage();
      await s.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
      await s.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
      await s.setViewport({ width: f.width, height: f.height, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      await s.goto(basis + route, { waitUntil: 'networkidle0', timeout: 60000 });
      await warte(1500);
      if (gegenprobe) await s.evaluate(einspielen, UNTER_RAND_MAX, true);
      const erster = await s.evaluate(ersterBildschirm, UNTER_RAND_MAX);
      ergebnisse.push({ route, fenster: f.name, zusatz: true, erster: erster.befunde, zustand: erster.zustand, marken: erster.marken, abgeschnitten: [], ausserhalb: [], ziele: [], klein: [], einblendungen: [], fehler: [], breite: 0, viewportMeta: 'width=device-width' });
      await s.close();
      process.stdout.write(':');
    }
  }
} finally {
  await browser.close();
  stopp();
}
process.stdout.write('\n');

// Zusammenfassen: gleiche Befunde ueber die Fenster buendeln.
const buendel = new Map();
const merke = (art, r, b, wert) => {
  const k = `${art}|${r.route}|${b.ort}|${b.text}`;
  if (!buendel.has(k)) buendel.set(k, { art, route: r.route, ort: b.ort, text: b.text, je: {} });
  buendel.get(k).je[r.fenster] = wert;
};
for (const r of ergebnisse) {
  if (r.breite > r.fenster + 1) merke('Seite scrollt waagerecht', r, { ort: 'Seite', text: `${r.breite} px Inhalt` }, `${r.breite - r.fenster} px`);
  for (const b of r.abgeschnitten) merke('abgeschnitten', r, b, `${b.um} px (${b.behaelter})`);
  for (const b of r.ausserhalb) merke('ragt aus dem Fenster', r, b, `${b.um} px`);
  for (const b of r.ziele) merke('Trefferfläche unter 24 px', r, b, b.mass);
  for (const e of r.einblendungen || []) {
    const b = { ort: 'Einblendung', text: e.text };
    if (e.anteil > EINBLENDUNG_MAX) merke('Einblendung zu groß', r, b, `${e.anteil} % der Fensterhöhe`);
    if (!e.geschlossen) merke('Einblendung nicht schließbar', r, b, !e.hatKnopf ? 'kein Schließknopf' : !e.knopf ? 'Schließknopf verdeckt oder außerhalb' : 'Tippen schließt nicht');
  }
  if (r.fuss && r.fuss.sichtbar < 50) merke('Fußzeile unsichtbar', r, { ort: 'Fußzeile', text: 'Texte am Seitenende' }, `${r.fuss.sichtbar} % sichtbar`);
  for (const b of r.unerreichbar || []) merke('Fußzeile nicht erreichbar', r, b, `${b.um} px über dem Fenster`);
  for (const b of r.verdeckt || []) merke('Fußzeile verdeckt', r, b, `von ${b.von}`);
  for (const b of r.klein) merke('Schrift unter 12 px', r, b, `${b.px} px`);
  for (const e of r.fehler) merke('Skriptfehler', r, { ort: 'Seite', text: e.slice(0, 80) }, 'Fehler');
  for (const b of r.erster || []) merke(b.art, r, b, b.wie);
  if (!/width=device-width/.test(r.viewportMeta)) merke('Viewport-Meta fehlt', r, { ort: 'Seite', text: r.viewportMeta || '(leer)' }, 'fehlt');
}
const HART = ['Seite scrollt waagerecht', 'abgeschnitten', 'ragt aus dem Fenster', 'Trefferfläche unter 24 px', 'Einblendung zu groß', 'Einblendung nicht schließbar', 'Fußzeile unsichtbar', 'Fußzeile nicht erreichbar', 'Fußzeile verdeckt', 'Erster Bildschirm verdeckt', 'Erster Bildschirm zu tief', 'Skriptfehler', 'Viewport-Meta fehlt'];
const alle = [...buendel.values()];
const harte = alle.filter((b) => HART.includes(b.art));

fs.mkdirSync(AUSGABE, { recursive: true });
const fussZeilen = [...new Map(ergebnisse.filter((r) => r.fuss).map((r) => [r.fenster, r.fuss])).entries()]
  .map(([n, f]) => `| ${n} | ${f.fenster} | ${f.hoehe} | ${f.fixiert ? 'fixiert' : 'im Seitenfluss'} | ${f.fixiert && f.oben < 0 ? `**${-f.oben} px über dem Fenster, nicht erreichbar**` : 'erreichbar'} |`);
const einblendZeilen = [];
for (const r of ergebnisse) {
  for (const e of r.einblendungen || []) {
    let z = einblendZeilen.find((x) => x.route === r.route && x.text === e.text);
    if (!z) einblendZeilen.push((z = { route: r.route, text: e.text, je: {} }));
    z.je[r.fenster] = `${e.anteil} %${e.geschlossen ? '' : ', bleibt stehen'}`;
  }
}
const ersterZeilen = ergebnisse.filter((r) => r.zustand?.length)
  .flatMap((r) => r.zustand.map((z) => `| \`${r.route}\` | ${r.fenster} | ${z.text.replace(/\|/g, '/')} | ${z.wie} |`));
const md = [
  '# Mobile-Check', '',
  `> Erzeugt von \`npm run mobil\` am ${new Date().toLocaleString('de-DE')}, ${routen.length} Routen × ${fenster.map((f) => f.name).join('/')} px. Nicht von Hand bearbeiten.`, '',
  `**${harte.length} harte Befunde**, ${alle.length - harte.length} Hinweise.`, '',
  '## Fußzeile am Seitenende (Route /, falls dabei)', '', '| Fenster | Höhe Fenster | Höhe Fußzeile | Zustand | Oberer Teil |', '|---|---|---|---|---|', ...fussZeilen, '',
  `## Einblendungen ohne Zutun (Anteil an der Fensterhöhe, höchstens ${EINBLENDUNG_MAX} %)`, '',
  ...(einblendZeilen.length
    ? ['| Route | Einblendung | je Fenster |', '|---|---|---|', ...einblendZeilen.map((z) => `| \`${z.route}\` | ${z.text.replace(/\|/g, '/')} | ${Object.entries(z.je).map(([n, w]) => `${n}: ${w}`).join(' · ')} |`)]
    : ['Keine.']),
  '',
  `## Erster Bildschirm (\`data-erster-bildschirm\`, Scrollposition 0: ganz sichtbar oder höchstens ${UNTER_RAND_MAX} px unter dem Rand)`, '',
  ...(ersterZeilen.length ? ['| Route | Fenster | Element | Zustand |', '|---|---|---|---|', ...ersterZeilen] : ['Keine markierten Elemente.']),
  '',
];
for (const art of [...HART, 'Schrift unter 12 px']) {
  const liste = alle.filter((b) => b.art === art);
  if (!liste.length) continue;
  md.push(`## ${art} (${liste.length})`, '', '| Route | Ort | Text | je Fenster |', '|---|---|---|---|');
  for (const b of liste) md.push(`| \`${b.route}\` | ${b.ort} | ${b.text.replace(/\|/g, '/')} | ${Object.entries(b.je).map(([n, w]) => `${n}: ${w}`).join(' · ')} |`);
  md.push('');
}
fs.writeFileSync(path.join(AUSGABE, BERICHT), md.join('\n'));

console.log(`[mobil] ${routen.length} Routen × ${fenster.length} Fenster. ${harte.length} harte Befunde, ${alle.length - harte.length} Hinweise. Bericht: output/mobil/${BERICHT}`);
for (const art of HART) { const n = alle.filter((b) => b.art === art).length; if (n) console.log(`  ${art}: ${n}`); }
const klein = alle.filter((b) => b.art === 'Schrift unter 12 px').length;
if (klein) console.log(`  (Hinweis) Schrift unter 12 px: ${klein}`);
for (const r of ergebnisse.filter((x) => x.zustand?.length)) console.log(`  Erster Bildschirm ${r.route} ${r.fenster}: ${r.zustand.map((z) => z.wie).join('; ')}`);
for (const z of einblendZeilen) console.log(`  Einblendung ${z.route} „${z.text}“: ${Object.entries(z.je).map(([n, w]) => `${n}: ${w}`).join(' · ')}`);
for (const [n, f] of new Map(ergebnisse.filter((r) => r.fuss).map((r) => [r.fenster, r.fuss]))) console.log(`  Fußzeile ${n}: ${f.hoehe} px hoch bei ${f.fenster} px Fenster, ${f.fixiert ? 'fixiert' : 'im Seitenfluss'}${f.fixiert && f.oben < 0 ? `, OBEN ${-f.oben} px NICHT ERREICHBAR` : ''}`);

if (gegenprobe) {
  const enthaelt = (wort) => (b) => JSON.stringify(b).includes(wort);
  const erwartet = [
    ['Überlauf', enthaelt('GEGENPROBE_UEBERLAUF')],
    ['abgeschnitten', enthaelt('GEGENPROBE_ABGESCHNITTEN')],
    ['Trefferfläche', enthaelt('GEGENPROBE_ZIEL')],
    ['kleine Schrift', enthaelt('GEGENPROBE_KLEIN')],
    ['unsichtbare Fußzeile', (b) => b.art === 'Fußzeile unsichtbar'],
    ['zu große Einblendung', (b) => b.art === 'Einblendung zu groß' && b.text.includes('GEGENPROBE_EINBLENDUNG')],
    ['nicht schließbare Einblendung', (b) => b.art === 'Einblendung nicht schließbar' && b.text.includes('GEGENPROBE_EINBLENDUNG')],
    ['erster Bildschirm angeschnitten', (b) => b.art === 'Erster Bildschirm verdeckt' && b.text.includes('GEGENPROBE_ANGESCHNITTEN')],
    ['erster Bildschirm verdeckt', (b) => b.art === 'Erster Bildschirm verdeckt' && b.text.includes('GEGENPROBE_VERDECKT')],
    ['erster Bildschirm zu tief', (b) => b.art === 'Erster Bildschirm zu tief' && b.text.includes('GEGENPROBE_ZU_TIEF')],
  ];
  const fehlt = erwartet.filter(([, trifft]) => !alle.some(trifft));
  console.log(fehlt.length ? `[mobil] GEGENPROBE FEHLGESCHLAGEN, nicht gemeldet: ${fehlt.map(([name]) => name).join(', ')}` : `[mobil] Gegenprobe bestanden: alle ${erwartet.length} eingespielten Fehler gemeldet.`);
  process.exit(fehlt.length ? 1 : 0);
}
process.exit(harte.length ? 1 : 0);
