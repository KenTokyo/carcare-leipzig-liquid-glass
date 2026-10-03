import React from 'react';

/**
 * Überschrift OHNE Silbentrennung (User, 2026-10-03: „Ich möchte keine Bindestriche für die Trennung von Wörtern
 * nutzen“).
 * Auftrag waren die Kacheln mit Leistungen und Aufbereitungsleistungen: aufklappende Karten der Startseite
 * (`ExpandingCardAccordion`), dazu Leistungs-, Preis-, Merkmals-, Ablauf- und FAQ-Kacheln.
 * Dieselbe Regel gilt für die Seitentitel (`PageHero`, H1) und die Abschnittstitel (`SectionIntro`, H2). Gemessen
 * trennte die H1 sogar am Desktop („Fahrzeugaufbe-reitung“, „repa-riert“), die H2 brachen an Bindestrichen
 * („Full-/Service“).
 *
 * DREI REGELN:
 *  1. Umbrochen wird nur an Leerzeichen. Jedes Wort steht in einem `nowrap`-Teil und bleibt ganz, auch an „-“ und „/“
 *     („Kfz-Aufbereiter/in“, „Cabrio-Verdeckimprägnierung“). Weiche Trennstellen (U+00AD) aus den Daten fallen weg.
 *  2. Einzelzeichen wie „/“ oder „&“ hängen am Wort davor: „Autoglas /“ statt einer Zeile, die mit „/“ beginnt.
 *  3. Ist das längste Wort breiter als der Platz, wird die Schrift genau so weit kleiner, dass es in eine Zeile passt.
 *     Kurze Titel behalten ihre Normalgröße. Rechnung in CSS:
 *     `font-size: min(Normalgröße, 100cqi ÷ Breite des längsten Wortes in em)`. Die Hülle ist der Container
 *     (`container-type: inline-size`), `cqi` ist also die Breite, die der Überschrift tatsächlich zur Verfügung steht.
 *     Es gibt kein Messen per Skript und kein Nachrücken nach dem Laden der Schrift.
 *
 * WARUM NICHT EINFACH KLEINER: Bis 2026-10-03 trennte der Browser nach Silbenregel (`hyphens-auto`, Backlog 5.25:
 * „Fahrzeugbaumechaniker/in“ lief bei 24 px über den Kasten). Gemessen trennten danach 42 Wörter in den Akkordeon-Kacheln
 * und 40 in weiteren Kacheln, zum Beispiel „Hagelschaden-reparatur“ oder „Reparatur-lackierung“. Eine feste kleinere
 * Größe hätte jeden Titel geschrumpft. Bei 320 px hätte sie trotzdem nicht gereicht.
 *
 * ⚠️ DIE ZEICHENBREITEN SIND GEMESSEN (Space Grotesk Bold, Canvas `measureText` bei 100 px, 2026-10-03). Die Summe der
 * Einzelzeichen liegt 0,4 bis 1,8 % über der echten Wortbreite (Unterschneidung), sie rechnet also vorsichtig. Wer die
 * Schrift wechselt, misst neu. Ein unbekanntes Zeichen zählt mit 0,7 em, also eher zu breit als zu schmal.
 */

/** Breite je Zeichen in em, Space Grotesk 700, ohne Laufweite. */
const BREITE_EM: Record<string, number> = {
  A: 0.63, B: 0.66, C: 0.64, D: 0.67, E: 0.55, F: 0.53, G: 0.66, H: 0.66, I: 0.26, J: 0.61, K: 0.63, L: 0.54, M: 0.88,
  N: 0.67, O: 0.68, P: 0.6, Q: 0.68, R: 0.63, S: 0.61, T: 0.59, U: 0.67, V: 0.62, W: 0.9, X: 0.64, Y: 0.62, Z: 0.58,
  a: 0.58, b: 0.64, c: 0.59, d: 0.64, e: 0.58, f: 0.44, g: 0.64, h: 0.62, i: 0.27, j: 0.27, k: 0.56, l: 0.27, m: 0.85,
  n: 0.62, o: 0.61, p: 0.64, q: 0.64, r: 0.4, s: 0.52, t: 0.46, u: 0.62, v: 0.55, w: 0.78, x: 0.59, y: 0.62, z: 0.52,
  Ä: 0.63, Ö: 0.68, Ü: 0.67, ä: 0.58, ö: 0.61, ü: 0.62, ß: 0.65,
  0: 0.65, 1: 0.45, 2: 0.59, 3: 0.61, 4: 0.64, 5: 0.6, 6: 0.62, 7: 0.55, 8: 0.6, 9: 0.62,
  '-': 0.43, '/': 0.39, '(': 0.4, ')': 0.39, '.': 0.3, ',': 0.29, ':': 0.3, ';': 0.3, '?': 0.58, '!': 0.3, '&': 0.59,
  '„': 0.51, '“': 0.51, '"': 0.51, "'": 0.29, '•': 0.4, '+': 0.62, '*': 0.54, '–': 0.58, '…': 0.8, '%': 0.76, '€': 0.68,
  ' ': 0.254,
};
const UNBEKANNT_EM = 0.7;
/** Spielraum für Rundung und Kantenglättung. */
const RESERVE = 1.02;
/** Blauer Punkt der Akkordeon-Kacheln: Zeichen bei 0,9 em plus 0,06 em Abstand. */
const PUNKT_EM = 0.4 * 0.9 + 0.06;

/** Breite eines Textstücks in em, mit Laufweite je Zeichen (z. B. −0,025 für `tracking-tight`). */
const breiteEm = (text: string, laufweite: number) =>
  [...text].reduce((summe, zeichen) => summe + (BREITE_EM[zeichen] ?? UNBEKANNT_EM) + laufweite, 0);

/** Wörter (Regel 1), Einzelzeichen am Wort davor (Regel 2). */
const woerterVon = (text: string): string[] =>
  text
    .replace(/­/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .reduce<string[]>((liste, wort) => {
      if (liste.length && wort.length === 1 && !/[\p{L}\p{N}]/u.test(wort)) liste[liste.length - 1] += ` ${wort}`;
      else liste.push(wort);
      return liste;
    }, []);

interface GanzwortTitelProps {
  text: string;
  /** Überschriftenebene, Standard `h3`. */
  als?: 'h1' | 'h2' | 'h3' | 'h4';
  /**
   * Klassen der Überschrift: Gewicht, Farbe, Zeilenhöhe, Laufweite und die Normalgröße als Variable, z. B.
   * `[--titel-max:1.125rem]` oder `[--titel-max:1.25rem] md:[--titel-max:1.5rem]`. KEINE `text-…`-Größe: Die Größe
   * setzt diese Komponente (Regel 3).
   */
  className: string;
  /** Laufweite in em wie im `className` (`tracking-tight` = −0,025). Geht in die Wortbreite ein. */
  laufweite?: number;
  /** Blauer Punkt nach dem letzten Wort, wie in den Akkordeon-Kacheln. */
  punkt?: boolean;
  /**
   * Klassen der Hülle, die zugleich der Container ist. Im Fluss oder in einer Flex-Spalte genügt nichts: Sie ist dann so
   * breit wie ihr Platz. In einer Flex-ZEILE braucht sie `min-w-0 flex-1`, sonst hätte sie wegen der Größeneindämmung
   * die Breite 0. `-mr-3` gibt in der Akkordeon-Kachel 12 px des rechten Innenrands frei.
   */
  huelle?: string;
  /**
   * Nur in einer umbrechenden Flex-ZEILE (`flex-wrap`) mit einem Nachbarn, z. B. dem Preis der Preiskachel: Die Hülle
   * verlangt mindestens die Breite, in der das längste Wort bei 16 px passt (`flex-basis` in em der Hülle). Reicht die
   * Zeile dafür nicht, rutscht der Nachbar darunter, statt den Titel klein zu drücken. Gemessen am 03.10.: Neben dem
   * Preis wäre „Cabrio-Verdeckimprägnierung“ bei 320 px auf 8 px geschrumpft.
   */
  mindestens16px?: boolean;
  id?: string;
}

const GanzwortTitel: React.FC<GanzwortTitelProps> = ({ text, als: Ebene = 'h3', className, laufweite = 0, punkt = false, huelle = '', mindestens16px = false, id }) => {
  const woerter = woerterVon(text);
  const laengstes = Math.max(
    0,
    ...woerter.map((wort, i) => breiteEm(wort, laufweite) + (punkt && i === woerter.length - 1 ? PUNKT_EM : 0))
  );
  return (
    <div className={`[container-type:inline-size] ${huelle}`} style={mindestens16px ? { flexBasis: `${(laengstes * RESERVE).toFixed(3)}em` } : undefined}>
      <Ebene
        id={id}
        className={`break-normal hyphens-none ${className}`}
        style={{ fontSize: laengstes ? `min(var(--titel-max), calc(100cqi / ${(laengstes * RESERVE).toFixed(3)}))` : 'var(--titel-max)' }}
      >
        {woerter.map((wort, i) => (
          <React.Fragment key={i}>
            {i > 0 && ' '}
            <span className="whitespace-nowrap">
              {wort}
              {punkt && i === woerter.length - 1 && (
                // Der Punkt ist ein Schriftzeichen und steht im selben `nowrap`-Teil: Er rutscht nie allein in eine
                // neue Zeile (Backlog 5.25, Erfahrung vom 28.09. in `ExpandingCardAccordion`).
                <span aria-hidden="true" className="ml-[0.06em] align-[0.34em] text-[0.9em] leading-[0] text-blue-600">•</span>
              )}
            </span>
          </React.Fragment>
        ))}
      </Ebene>
    </div>
  );
};

export default GanzwortTitel;
