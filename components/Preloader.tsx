import React, { useEffect, useLayoutEffect } from 'react';
import { motion, type Variants } from 'framer-motion';

/**
 * Preloader „Double Stairs" — Markenauftritt beim ersten Aufruf der Startseite.
 *
 * Vorlage war Skiper UI „skiper10". Deren Quelltext ist Pro-gated (Registry antwortet
 * mit HTTP 401, Install verlangt einen Lizenzschluessel), lag hier also nicht vor. Der
 * Effekt ist deshalb aus der offiziellen Beschreibung nachgebaut: zwei Treppen, die
 * gegenlaeufig von oben und unten auffahren, mit gestaffeltem Delay pro Spalte.
 * Einzige Abhaengigkeit ist framer-motion — die hat das Projekt ohnehin.
 *
 * Zusammenspiel mit dem Boot-Layer (index.html):
 * `#cc-boot` zeigt dieselbe Lockup bereits ab dem ersten Frame — noch bevor React
 * gebootet ist. Diese Komponente uebernimmt pixelidentisch (gleiche `.cc-lockup*`-
 * Klassen aus dem Inline-CSS) und raeumt den Boot-Layer in einem `useLayoutEffect`
 * weg, also nach dem DOM-Update und VOR dem Paint. Dadurch gibt es keinen Frame, in
 * dem beide oder keiner von beiden sichtbar waere.
 *
 * Wer entscheidet was:
 * - OB der Preloader laeuft  -> hooks/usePreloader.ts (Pfad, Session, Prerender)
 * - WIE LANGE er haelt       -> diese Datei (Timing-Konstanten unten)
 * - WANN entsperrt wird      -> App.tsx via `onExitComplete` der AnimatePresence
 */

/** Anzahl der Spalten je Treppe. 6 ist der Kompromiss aus sichtbarer Staffelung und Ruhe. */
export const STAIR_COLUMNS = 6;

/**
 * Zielzeitpunkt (ms ab Navigationsstart), an dem die Marke auszublenden beginnt.
 * Bewusst NICHT ab Komponenten-Mount gerechnet: Auf langsamen Verbindungen bootet React
 * spaet, und ein fixer Timer ab Mount wuerde die Wartezeit ein zweites Mal draufschlagen.
 * `performance.now()` liefert im Seitenkontext genau die Zeit seit Navigationsstart.
 */
const HOLD_TARGET_MS = 700;
/** Untergrenze, damit die Marke bei schnellem Boot nicht nur aufblitzt. */
const HOLD_MIN_MS = 250;

/** Marke ausblenden. */
const LOGO_OUT_MS = 380;
/** Vorlauf der Treppen gegenueber dem Logo-Fade — die Marke ist beim Aufziehen fast weg. */
const STAIR_LEAD_MS = 120;
/** Versatz zwischen zwei benachbarten Spalten — erzeugt die Treppenstufe. */
const STAIR_STAGGER_MS = 65;
/** Laufzeit einer einzelnen Spalte. */
const STAIR_DURATION_MS = 720;

/**
 * Gesamtdauer der Exit-Animation ab dem Moment, in dem `showPreloader` auf false geht.
 * App.tsx nutzt das als Basis fuer seinen Sicherheits-Timeout.
 */
export const PRELOADER_EXIT_MS =
  STAIR_LEAD_MS + (STAIR_COLUMNS - 1) * STAIR_STAGGER_MS + STAIR_DURATION_MS;

/** easeInOutQuint-artig: traeger Start, schneller Kern, weiches Auslaufen. */
const STAIR_EASE = [0.83, 0, 0.17, 1] as const;

const columns = Array.from({ length: STAIR_COLUMNS }, (_, i) => i);

/**
 * Treppen-Variante. `custom` ist der Stufen-Index — NICHT der Spalten-Index: die untere
 * Treppe zaehlt gespiegelt (siehe unten), damit beide Haelften gegenlaeufig aufziehen
 * statt wie ein einfacher Reissverschluss in dieselbe Richtung zu laufen.
 */
const makeStairVariants = (direction: -1 | 1): Variants => ({
  exit: (step: number) => ({
    y: `${direction * 101}%`,
    transition: {
      duration: STAIR_DURATION_MS / 1000,
      delay: (STAIR_LEAD_MS + step * STAIR_STAGGER_MS) / 1000,
      ease: STAIR_EASE,
    },
  }),
});

const topStairVariants = makeStairVariants(-1);
const bottomStairVariants = makeStairVariants(1);

const logoVariants: Variants = {
  exit: {
    opacity: 0,
    y: -14,
    transition: { duration: LOGO_OUT_MS / 1000, ease: [0.4, 0, 0.2, 1] },
  },
};

interface PreloaderProps {
  /** Wird gerufen, wenn die Haltezeit vorbei ist. App.tsx setzt daraufhin showPreloader=false. */
  onHoldComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onHoldComplete }) => {
  // Nach dem DOM-Update, vor dem Paint: der statische Boot-Layer wird genau in dem
  // Moment entfernt, in dem dieses Overlay ihn ersetzt hat.
  useLayoutEffect(() => {
    document.getElementById('cc-boot')?.remove();
  }, []);

  useEffect(() => {
    const elapsed = performance.now();
    const hold = Math.max(HOLD_MIN_MS, HOLD_TARGET_MS - elapsed);
    const timer = window.setTimeout(onHoldComplete, hold);
    return () => window.clearTimeout(timer);
  }, [onHoldComplete]);

  return (
    // aria-hidden: Das Overlay ist rein dekorativ. Der echte Seiteninhalt liegt darunter
    // bereits vollstaendig im DOM — Screenreader-Nutzer werden also nicht ausgesperrt,
    // sondern koennen sofort lesen, waehrend die Animation nur visuell laeuft.
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      aria-hidden="true"
      data-preloader=""
    >
      <StairRow variants={topStairVariants} stepFor={(i) => i} photoOffsetY="0%" />
      <StairRow variants={bottomStairVariants} stepFor={(i) => STAIR_COLUMNS - 1 - i} photoOffsetY="-100%" />

      <motion.div
        variants={logoVariants}
        exit="exit"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        {/* Identisches Markup wie #cc-boot in index.html — die Klassen kommen aus dem
            dortigen Inline-CSS, damit Geometrie und Bildquellen nur EINMAL definiert sind. */}
        <div className="cc-lockup">
          <div className="cc-lockup-mark" />
          <div className="cc-lockup-word" />
        </div>
      </motion.div>
    </motion.div>
  );
};

interface StairRowProps {
  variants: Variants;
  /** Bildet den Spalten-Index auf die Stufe ab (identisch = links->rechts, gespiegelt = rechts->links). */
  stepFor: (columnIndex: number) => number;
  /** Vertikaler Versatz der Foto-Ebene: obere Reihe 0, untere eine Reihenhoehe nach oben. */
  photoOffsetY: string;
}

/**
 * Eine Treppenhaelfte.
 *
 * Das Hero-Foto darf NICHT je Spalte einzeln liegen — sonst zeigte jede Spalte das
 * ganze Bild in ihrem schmalen Kasten. Stattdessen traegt jede Spalte eine Foto-Ebene
 * in voller Overlay-Groesse, die per negativem Offset so verschoben ist, dass ueber alle
 * sechs Spalten hinweg EIN durchgehendes Bild entsteht. `overflow-hidden` je Spalte
 * schneidet den jeweiligen Ausschnitt zu.
 *
 * Masse bewusst in Prozent statt vw/vh: Die Spalte ist 1/6 der Breite und eine halbe
 * Overlay-Hoehe, also sind 600 % / 200 % exakt das Overlay. Mit `100vh` waere es auf
 * Mobile falsch — dort ist `vh` die GROSSE Viewport-Hoehe (ausgeblendete URL-Leiste),
 * waehrend das `inset-0`-Overlay die aktuelle Hoehe hat.
 *
 * Bewusst KEINE 1-px-Ueberlappung mehr (frueher `marginRight: -1` gegen Subpixel-Fugen):
 * Sie wuerde den Bildversatz je Spalte um 1 px aufaddieren — bei sechs Spalten also einen
 * sichtbaren Versatz im Foto erzeugen. Exakte Kachelung wiegt hier schwerer, und die
 * Fugen waren ohnehin nur zwischen gleichfarbigen Flaechen theoretisch sichtbar.
 */
const StairRow: React.FC<StairRowProps> = ({ variants, stepFor, photoOffsetY }) => (
  <div className="flex h-1/2 w-full overflow-hidden">
    {columns.map((i) => (
      <motion.div
        key={i}
        custom={stepFor(i)}
        variants={variants}
        exit="exit"
        // Literal statt `bg-white`: Die Farbe MUSS exakt dem Boot-Layer in index.html
        // entsprechen, sonst springt sie beim Uebergang. `bg-white` loest zwar auf
        // dieselbe Farbe auf, haengt aber an `--cc-white-rgb` aus index.css — und die
        // kommt erst mit dem JS-Bundle. Faellt die Variable je aus, waeren die Treppen
        // transparent statt weiss. Diese Abhaengigkeit hat der erste Paint nicht noetig.
        className="relative h-full flex-1 overflow-hidden bg-[#ffffff]"
      >
        {/* Gleiche Klasse wie #cc-boot in index.html -> identische Foto- und Weiss-Ebenen. */}
        <div
          aria-hidden="true"
          className="cc-photo-veil absolute"
          style={{
            width: `${STAIR_COLUMNS * 100}%`,
            height: '200%',
            left: `${-i * 100}%`,
            top: photoOffsetY,
          }}
        />
      </motion.div>
    ))}
  </div>
);

export default Preloader;
