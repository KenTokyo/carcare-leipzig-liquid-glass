// DREHEN fuer `scripts/check-akkordeon.mjs` (dort Kopf, Punkt 12): schmal → breit → schmal, ohne neu zu laden.
//
// ANLASS (2026-10-19, R33-e): Nach dem Wechsel von schmal auf breit (iPad hoch → quer, 820 → 1180, oder Fenster
// aufziehen) waren alle Leistungs- und Stellenkarten 0 px breit, das Akkordeon verschwand. Seit dem 16.10. bekam Framer
// `animate` nur am Desktop, und ein erst nach dem Einhaengen gesetztes `animate` uebernahm es nie. Kein Pruefer wechselte
// die Fensterbreite mitten im Lauf; gefunden hat es eine Handprobe beim Umbau der Stimmen (R33-a).
//
// GEPRUEFT je Akkordeon der Ziele: in 820 × 1180 laden (senkrecht, eine Karte offen), auf 1180 × 820 wechseln: jede Karte
// breiter als 20 px, die offene breiter als jede andere, alle gleich hoch; zurueck auf 820 × 1180: genau eine Karte offen
// und hoeher als 64 px, die uebrigen 64 px.
// GEGENPROBE: am Desktop `flex-grow: 0` (das Bild von R33-e); muss je Akkordeon „0 px breit“ melden.
// ⚠️ WAS ES NICHT ZEIGT: nur diese eine Wechselfolge und ohne echtes Drehen (iOS feuert dabei `orientationchange` und
// aendert die sichtbare Hoehe schrittweise). Lage im Fenster, Bildlage und Bewegung nach dem Wechsel prueft es nicht.
import { KARTEN, popupSchliessen } from './akkordeon-seite.mjs';

const warte = (ms) => new Promise((r) => setTimeout(r, ms));
const SCHMAL = { width: 820, height: 1180 };
const BREIT = { width: 1180, height: 820 };

/** Breite, Hoehe und Zustand jeder Karte des Akkordeons. */
const LAGEN = (sel) => window.__ccKarten(sel).map((k) => {
  const r = k.getBoundingClientRect();
  return { b: r.width, h: r.height, offen: window.__ccOffen(k) };
});

const senkrecht = (lagen) => lagen.filter((k) => k.offen).length === 1 && lagen.every((k) => (k.offen ? k.h > 70 : Math.abs(k.h - 64) <= 1));
const liste = (lagen, was) => lagen.map((k) => Math.round(k[was])).join('/');

/** Alle Ziele pruefen, je Route ein frischer Browser; schreibt in `befunde`, `messfehler` und `zeilen`. */
export async function pruefeDrehen({ puppeteer, basis, ziele, befunde, messfehler, zeilen, gegenprobe }) {
  for (const route of [...new Set(ziele.map((z) => z.route))]) {
    const sektionen = ziele.filter((z) => z.route === route).map((z) => z.sektion);
    const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
    try {
      const seite = await browser.newPage();
      await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
      await seite.evaluateOnNewDocument(KARTEN);
      await seite.setViewport(SCHMAL);
      await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 45000 });
      if (gegenprobe) await seite.addStyleTag({ content: '@media (min-width: 1024px){[data-akk-offen]{flex-grow:0 !important}}' });
      await popupSchliessen(seite, route);
      const lagen = async () => Object.fromEntries(await Promise.all(sektionen.map(async (sel) => [sel, await seite.evaluate(LAGEN, sel)])));
      const vorher = await lagen();
      await seite.setViewport(BREIT);
      await warte(1500); // Framer: 0,6 s
      const breit = await lagen();
      await seite.setViewport(SCHMAL);
      await warte(1500);
      const zurueck = await lagen();
      for (const sel of sektionen) {
        const name = `${route} ${sel}, Drehen 820 → 1180 → 820`;
        const [v, b, z] = [vorher[sel], breit[sel], zurueck[sel]];
        if (!v.length) {
          messfehler.push(`${name}: keine Karten mit data-akk-offen gefunden`);
          continue;
        }
        if (!senkrecht(v)) messfehler.push(`${name}: schon vor dem Wechsel nicht senkrecht (Hoehen ${liste(v, 'h')}), Schritt nicht aussagekraeftig`);
        const offen = b.find((k) => k.offen)?.b ?? 0;
        const andere = Math.max(0, ...b.filter((k) => !k.offen).map((k) => k.b));
        if (Math.min(...b.map((k) => k.b)) <= 20) befunde.push(`${name}: nach dem Wechsel auf 1180 px Karten ${liste(b, 'b')} px breit, 0 px breit heisst: Akkordeon verschwunden (R33-e)`);
        else if (offen <= andere) befunde.push(`${name}: nach dem Wechsel ist die offene Karte nicht breiter als die uebrigen (${liste(b, 'b')} px)`);
        if (new Set(b.map((k) => Math.round(k.h))).size > 1) befunde.push(`${name}: nach dem Wechsel ungleich hoch (${liste(b, 'h')} px)`);
        if (!senkrecht(z)) befunde.push(`${name}: zurueck auf 820 px nicht senkrecht (Hoehen ${liste(z, 'h')} px)`);
        zeilen.push(`| ${name}${gegenprobe ? ' (Gegenprobe: flex-grow 0)' : ''} | – | – | 1180 px breit: ${liste(b, 'b')} px, zurueck hoch: ${liste(z, 'h')} px | – | – | – | – |`);
      }
    } finally {
      await browser.close();
    }
  }
}
