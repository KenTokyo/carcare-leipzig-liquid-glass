// Bahn eines Elements je Bild, fuer die SPRUNG-Kriterien von `check-akkordeon.mjs` und `check-faq-mobil.mjs`.
//
// GELESEN WIRD NACH DEM BILD, NICHT IM rAF-RUECKRUF (seit 2026-10-18). Bis dahin las jeder Pruefer die Lage in seinem
// eigenen `requestAnimationFrame`-Rueckruf. Rueckrufe eines Bildes laufen in der Reihenfolge ihrer Anmeldung. Solange
// Lenis dauernd lief, war sein Rueckruf seit dem Laden angemeldet und lief VOR dem des Pruefers: Lage und Zeitstempel
// gehoerten zum selben Bild. Seit R26 meldet sich Lenis erst beim Gleiten an (`hooks/useSmoothScroll.ts`), also NACH der
// schon laufenden Messschleife. Der Pruefer las dann in Bild N die Lage nach Bild N−1, teilte aber durch den Abstand
// N−1 → N. Nach einem langen Bild (der Tipp selbst, im Kopflosen 100–760 ms) holt Lenis den Weg dieser Zeit in EINEM
// Schritt auf; geteilt durch das folgende kurze Bild (4 ms) ergab das 14–66 px/ms, also „Sprung“, bei echten
// hoechstens 2,1 px/ms. Gefunden beim Zusammenfuehren von R26 mit dem Mitgleiten der FAQ (18.10.): `npm run faq-mobil`
// meldete je vollem Lauf 1–2 Seiten, jedes Mal andere, auf dem Stand ohne R26 nie.
//
// Jetzt: Der rAF-Rueckruf merkt sich nur die Zeit des Bildes und schickt eine Nachricht (`MessageChannel`). Die kommt als
// eigene Aufgabe nach dem Bild an, wenn alle Rueckrufe dieses Bildes gelaufen sind, egal in welcher Reihenfolge sie sich
// angemeldet haben. Erst dort wird gelesen. Lage und Zeit gehoeren so wieder zum selben Bild.
//
// ⚠️ WAS DAS BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. Kommt die Nachricht erst nach dem naechsten Bild an (Hauptthread ueberlastet), wird die Probe verworfen; die
//     Bewegung verteilt sich dann auf zwei Bilder und erscheint bis zu halb so schnell. In der Probe am 18.10.
//     hoechstens 5 verworfene bei 19–215 Proben je Tipp. Ab einem Viertel (`zuVieleVerworfen`) melden beide Pruefer
//     einen Messfehler statt eines Urteils.
//  2. Ein Sprung NACH einem langen Bild bleibt gerechtfertigt (Weg durch die tatsaechlich vergangene Zeit). Wer einen
//     Ruckler selbst finden will, braucht die Bildabstaende, nicht das Tempo.

/** Im Fenster: `__ccBahnStart(element)` beginnt, `__ccBahnStopp()` beendet und liefert `{ bahn, verworfen }`. */
export const BAHN = `
  window.__ccBahnStart = (element) => {
    const bahn = [[performance.now(), element.getBoundingClientRect().top]];
    let bild = 0;
    let offen = null;
    let lauf = true;
    let verworfen = 0;
    const kanal = new MessageChannel();
    kanal.port1.onmessage = () => {
      if (offen && offen.bild === bild) bahn.push([offen.zeit, element.getBoundingClientRect().top]);
      else verworfen++;
      offen = null;
    };
    const tick = (zeit) => {
      bild++;
      offen = { bild, zeit };
      kanal.port2.postMessage(0);
      if (lauf) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.__ccBahnStopp = () => {
      lauf = false;
      kanal.port1.onmessage = null;
      return { bahn, verworfen };
    };
  };
`;

/** Zu viele Proben verworfen (siehe Kopf, 1.): Das Tempo waere dann nicht mehr aussagekraeftig. */
export const zuVieleVerworfen = ({ bahn, verworfen }) => verworfen > bahn.length / 4;

/** Schnellste Bewegung zwischen zwei Proben, in px/ms. */
export const schnellsteBewegung = (bahn) => {
  let tempo = 0;
  for (let i = 1; i < bahn.length; i++) {
    tempo = Math.max(tempo, Math.abs(bahn[i][1] - bahn[i - 1][1]) / Math.max(1, bahn[i][0] - bahn[i - 1][0]));
  }
  return tempo;
};
