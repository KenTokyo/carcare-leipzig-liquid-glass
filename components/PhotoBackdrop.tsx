import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Foto als Sektions-Hintergrund, das randlos ins Weiss auslaeuft.
 *
 * Herkunft: Die Behandlung stammt aus der Leistungsuebersicht (`ServiceGrid`), wo beim
 * Aufklappen einer Karte deren Foto hinter dem Grid erscheint. Seit 2026-08-03 liegt sie
 * hier zentral, weil die Hero-Bereiche der Hub- und Zielgruppenseiten denselben Look
 * bekommen — geteilte Komponente statt kopierter Gradienten, sonst driften die Optiken
 * beim naechsten Feinschliff auseinander.
 *
 * DREI EBENEN ueber dem Foto, jede mit eigener Aufgabe:
 *  1. vertikaler Veil  — haelt den Kopfbereich oben lesbar, Mitte duenn
 *  2. horizontaler Veil — links zusaetzlich weisser, damit Ueberschrift und Fliesstext
 *                         auch an ihrem rechten Ende sicher lesbar bleiben
 *  3. radiale Vignette  — alle vier Raender laufen zu 100 % ins Weiss aus, das klare
 *                         Bildfenster sitzt bei 58 % also RECHTS der Mitte
 *
 * WICHTIG bei der Vignette: transparentes WEISS statt `transparent` — `transparent` ist
 * in CSS transparentes SCHWARZ und erzeugt beim Interpolieren einen grauen Saum.
 *
 * Der Elternknoten braucht `relative isolate`: `isolate` spannt einen eigenen
 * Stacking-Context auf, damit die `-z-10`-Ebene hinter dem Inhalt UND ueber dem
 * Sektions-Hintergrund bleibt. Ohne `isolate` rutscht sie in den Context, den der
 * App-Shell-`main` per `transform` bereits aufspannt.
 */
/**
 * Wie weit der weisse Textschutz nach rechts reicht.
 *
 * `default` — abgestimmt auf den Kopfbereich der Leistungsuebersicht.
 * `wide`    — fuer `BackdropLayout`, wo das Foto die GANZE Seite traegt. Zwei Gruende
 *             fuer den breiteren Schutz: Die Textspalten sind mit `max-w-3xl` breiter
 *             als der Kopfbereich der Uebersicht (sie reichen bis ~59 % der Breite), und
 *             weil das Foto im Viewport stehen bleibt, trifft eine dunkle Bildstelle
 *             nicht eine Ueberschrift, sondern jede Textzeile auf dieser Hoehe — ueber
 *             die ganze Seite hinweg. Gleiche Ebenen, nur der linke Schutz reicht weiter;
 *             der Bildeindruck (Foto rechts, randlos ins Weiss auslaufend) bleibt.
 */
export type TextGuard = 'default' | 'wide';

/**
 * Weiche linke Bildkante fuer den `zoom`-Modus. Ohne sie stuende dort eine sichtbare
 * senkrechte Linie, sobald das Bild schmaler als die Flaeche ist — der Textschutz allein
 * deckt sie nicht zuverlaessig ab.
 */
const EDGE_FADE = 'linear-gradient(to right, transparent 0%, #000 22%)';

/**
 * Der horizontale Veil liegt als KLASSE in index.css, nicht als Inline-Style.
 *
 * Grund: Unter 768 px laeuft die Textspalte ueber die volle Breite, waehrend sich der
 * Verlauf auf die Viewport-Breite bezieht — das letzte Drittel jeder Zeile stand dort
 * auf blankem Foto und verfehlte den WCAG-Kontrast deutlich. Der schmale Fall braucht
 * also einen eigenen Verlauf, und ein Media Query gehoert ins Stylesheet. Die Messwerte
 * und die Begruendung der gewaehlten Staerke stehen dort bei `.cc-guard-wide`.
 */
const GUARD: Record<TextGuard, { klasse: string; radialCenter: string }> = {
  default: { klasse: 'cc-guard-default', radialCenter: '58% 48%' },
  wide: { klasse: 'cc-guard-wide', radialCenter: '72% 48%' },
};

export interface PhotoBackdropProps {
  /** Bildpfad, oder `null` fuer „kein Bild" (ServiceGrid: keine Karte aufgeklappt). */
  image: string | null;
  /**
   * Klassen des Maskenrahmens. Default entspricht der Leistungsuebersicht.
   * `overflow-hidden` clippt Foto und Ebenen auf die runde Form.
   */
  className?: string;
  /** Breite des weissen Textschutzes, siehe `TextGuard`. */
  textGuard?: TextGuard;
  /**
   * Bildausschnitt. Ohne Angabe fuellt das Foto die Flaeche formatfuellend
   * (`object-cover`) und wird dabei beschnitten — bei hochformatigen Motiven oben und
   * unten spuerbar, das Bild wirkt dann zu nah herangeholt.
   *
   * Mit Angabe wird das Bild stattdessen ueber seine HOEHE bemessen und rechts verankert:
   *   `1`    = Bildhoehe exakt Backdrop-Hoehe — der weiteste Blick OHNE sichtbare Kante
   *   `> 1`  = naeher heran (`1.2` entspricht etwa formatfuellend bei 3:2-Flaeche)
   * Unter `1` waere das Bild niedriger als die Flaeche und bekaeme oben und unten
   * sichtbare Kanten — deshalb ist der Wert nach unten auf `1` begrenzt.
   *
   * KEINE SICHTBAREN KANTEN, und zwar konstruktiv:
   *  - oben/unten: durch `>= 1` immer mindestens flaechenhoch
   *  - rechts:     bündig verankert
   *  - links:      die einzige Kante, die hineinragen kann, wird per `mask-image` weich
   *                ausgeblendet — sie loest sich auf, statt als Linie zu stehen
   *
   * WARUM NICHT `object-contain` mit Skalierung (erster Versuch, verworfen): Damit wird
   * das Bild in der Flaeche eingepasst und ist unterhalb von formatfuellend an ALLEN
   * Seiten kleiner — oben und unten standen dann sichtbare Kanten im Bild.
   *
   * WARUM NICHT `transform: scale()` auf `object-cover`: Der Beschnitt wird vor der
   * Transformation berechnet — man saehe denselben Ausschnitt, nur kleiner.
   */
  zoom?: number;
}

const PhotoBackdrop: React.FC<PhotoBackdropProps> = ({ image, className = 'rounded-[var(--cc-nav-radius)]', textGuard = 'default', zoom }) => (
  <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
    <AnimatePresence>
      {image && (
        <motion.div
          key={image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {zoom === undefined ? (
            <img src={image} alt="" decoding="async" className="h-full w-full object-cover" />
          ) : (
            <img
              src={image}
              alt=""
              decoding="async"
              className="absolute right-0 top-1/2 max-w-none -translate-y-1/2"
              style={{
                // Ueber die Hoehe bemessen, Breite folgt dem Seitenverhaeltnis. Nach unten
                // auf 1 begrenzt: darunter waere das Bild niedriger als die Flaeche und
                // bekaeme oben/unten sichtbare Kanten.
                height: `${Math.max(zoom, 1) * 100}%`,
                width: 'auto',
                // Linke Kante weich ausblenden — die einzige, die in die Flaeche ragen
                // kann. Prozent beziehen sich auf die BILDbreite, nicht auf die Flaeche.
                maskImage: EDGE_FADE,
                WebkitMaskImage: EDGE_FADE,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/[0.18] to-white/45" />
          <div className={`absolute inset-0 ${GUARD[textGuard].klasse}`} />
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse closest-side at ${GUARD[textGuard].radialCenter}, rgb(255 255 255 / 0) 33%, rgb(255 255 255 / 1) 90%)` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default PhotoBackdrop;
