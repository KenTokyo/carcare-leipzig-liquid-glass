import React, { useEffect, useState } from 'react';
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
  /**
   * Optionale Videoquelle (Backlog 3.20). Ist sie gesetzt, tritt das Video an die
   * Stelle des Fotos und `image` wird automatisch zu seinem Standbild.
   *
   * NUR IM `zoom`-LOSEN FALL: Der `zoom`-Zweig bemisst das Bild ueber seine Hoehe und
   * blendet die linke Kante per `mask-image` aus — beides waere fuer ein Video eigens
   * zu pruefen. Die einzige Seite mit Videowunsch (`/ueber-uns`) nutzt `zoom` nicht.
   * Wird beides zugleich gesetzt, gewinnt sichtbar das Foto; das ist der harmlosere
   * Fehler als ein Video mit sichtbarer Kante.
   *
   * Die drei Veil-Ebenen darueber bleiben unveraendert — der Textschutz haengt am
   * Hintergrund, nicht an seiner Herkunft.
   */
  video?: string | null;
  /**
   * Eigene Fassung unter 1024 px (seit 2026-10-16, Wunsch des Users: das Foto der Startseite „auch in der mobilen
   * Ansicht“). Ohne Angabe gilt auf allen Breiten dasselbe wie bisher.
   *
   * `stehend` — fuer hohe Sektionen (Leistungen, Autoaufbereitung: Kopf plus Kartenspalte, rund 1.500 px). Das Foto
   *             steht in Fensterhoehe (`sticky`, wie `BackdropLayout`) und laeuft nicht ueber die ganze Sektion: Ein
   *             Querformatfoto, formatfuellend ueber 393 × 1.500 px, waere nur ein stark vergroesserter Mittelstreifen.
   * `flaeche` — fuer Flaechen, die selbst schon fensterhoch stehen (gepinnte Buehne von `ScrollPinnedProcess`).
   *
   * Unter 1024 px gelten statt der drei Desktop-Ebenen eigene, denn deren Vignette (`closest-side`) liesse auf einem
   * Hochformat nur einen schmalen Streifen in der Mitte frei, genau hinter den Karten. Ab 1024 px aendert sich nichts.
   *  - `flaeche` (seit 2026-10-18 wie `stehend`, User: den weissen Verlauf in den Ablaeufen „so wie bei den Karten“
   *    raus, R30): gleichmaessiger Schleier `.cc-guard-mobil-licht` und Auslauf ins Weiss an der Unterkante der Buehne.
   *    Den Kopf haelt `ScrollPinnedProcess` selbst frei (`.cc-ablauf-kopf`: deckend weiss bis zur Schrittkarte). Bis
   *    dahin `.cc-guard-mobil` ueber der ganzen Buehne (Weiss 82 → 78 %, durch das das Foto hinter dem Kopf schimmerte).
   *  - `stehend` (seit 2026-10-16 abends, Rueckmeldung des Users vom A56: „hinter den Karten … ein weißer Hintergrund
   *    mit einem Übergang … soll raus“): Am stehenden Foto haengt nur ein gleichmaessiger Schleier
   *    (`.cc-guard-mobil-licht`, Weiss 60 %, Herleitung in styles/textschutz.css), dazu die Auslaeufe ins Weiss an
   *    Ober- und Unterkante (unten, ausserhalb der stehenden Flaeche).
   *    SEIT 2026-10-17 OHNE TEXTSCHUTZ AM KOPF (User: „ein weißes Rechteck, das bis zur Überschrift hin quasi vergeht …
   *    den vor allem bei den Akkordeons bitte immer weg“). Stattdessen beginnt das Foto unter 1024 px erst 48 px ueber
   *    der ersten Karte (`FOTO_UEBER_KARTEN`), der Kopf steht auf reinem Weiss und braucht keinen Schutz.
   */
  mobil?: 'stehend' | 'flaeche';
}

/**
 * Klassen fuer `mobil="stehend"` in Sektionen mit Kopf ueber Karten (Leistungen, Autoaufbereitung), seit 2026-10-17.
 *
 * UNTER 1024 PX BEGINNT DAS FOTO ERST 48 PX UEBER DER ERSTEN KARTE. Bis dahin lag es hinter der ganzen Sektion, auch
 * hinter dem Kopf, und der Kopf brauchte einen weissen Textschutz (`.cc-kopfschutz`, Weiss 88 % bis 96 px unter den Kopf).
 * Den sah der User als „weißes Rechteck“ hinter den ersten Karten und wollte ihn weg. Ohne Foto hinter dem Kopf steht der
 * Text auf reinem Weiss (`gray-600` = Graphit 72 %: 6,92 : 1), ganz ohne Schleier.
 *
 * CSS-NATIV, OHNE MESSEN: Die Sektion ist unter 1024 px ein Raster (`max-lg:grid`) mit dem Kopf in Zeile 1 (samt seinem
 * Abstand nach unten) und den Karten in Zeile 2. Ein absolut positioniertes Kind eines Rasters nimmt seine Rasterflaeche
 * als Bezug: `row-start-2` = ab der Oberkante der Karten bis zum unteren Innenrand der Sektion, `-top-12` = 48 px davor
 * (dort laeuft das Foto aus dem Weiss ein, im Abstand zwischen Kopf und Karten). Am Desktop ist die Sektion kein Raster,
 * die Klassen greifen nicht (`max-lg:`), das Foto liegt wie bisher hinter der ganzen Sektion.
 * `max-lg:rounded-none`: Mobil beginnt das Foto mitten in der Sektion; runde Ecken zeichneten dort oben die Kante eines
 * Kastens ins Bild (Aufnahme 390 px, 17.10.).
 * ⚠️ Nur in einer Sektion mit `max-lg:grid` und genau dieser Zeilenfolge verwenden; sonst ragte `-top-12` 48 px ueber
 * die Sektion hinaus.
 */
export const FOTO_UEBER_KARTEN = 'rounded-[var(--cc-nav-radius)] max-lg:row-start-2 max-lg:-top-12 max-lg:rounded-none';

/**
 * Bild erst zeigen, wenn es dekodiert ist (2026-10-16 abends). Beim Wechsel blendete die neue Ebene sofort ein, waehrend
 * das Foto noch dekodierte: Sichtbar waren fuer einige Bilder nur ihre weissen Schleier, und der Hintergrund blitzte
 * hell auf, auf dem Telefon laenger als am Rechner. Jetzt bleibt das alte Foto stehen, bis das neue bereit ist.
 * Schlaegt das Dekodieren fehl, wird trotzdem gewechselt (Verhalten wie vorher).
 */
const useDekodiert = (bild: string | null): string | null => {
  const [bereit, setBereit] = useState<string | null>(null);
  useEffect(() => {
    if (!bild) {
      setBereit(null);
      return;
    }
    let gueltig = true;
    const vorlauf = new Image();
    vorlauf.src = bild;
    const zeigen = () => {
      if (gueltig) setBereit(bild);
    };
    (typeof vorlauf.decode === 'function' ? vorlauf.decode() : Promise.resolve()).then(zeigen, zeigen);
    return () => {
      gueltig = false;
    };
  }, [bild]);
  return bereit;
};

const PhotoBackdrop: React.FC<PhotoBackdropProps> = ({ image: angefragt, className = 'rounded-[var(--cc-nav-radius)]', textGuard = 'default', zoom, video, mobil }) => {
  const image = useDekodiert(angefragt);
  return (
    // `overflow-clip` statt `-hidden` bei `stehend`: Ein Behaelter mit `overflow: hidden` ist ein Scroll-Container, und
    // `sticky` haftete dann an ihm statt am Fenster (dieselbe Lehre wie beim `main`, siehe Memory site-shell-breaks-sticky).
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${mobil === 'stehend' ? 'overflow-clip' : 'overflow-hidden'} ${className}`}>
      <div className={mobil === 'stehend' ? 'sticky top-0 h-[100svh] w-full lg:static lg:h-full' : 'absolute inset-0'}>
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
            {zoom === undefined && video ? (
              /*
               * KEIN `motion-reduce:hidden` (entfernt 2026-09-07).
               *
               * Es stand hier und hat genau das bewirkt, was niemand wollte: Windows meldet
               * `prefers-reduced-motion: reduce`, sobald in den Systemeinstellungen
               * „Animationen anzeigen" aus ist — das ist eine verbreitete Einstellung und
               * keine Aussage ueber Videos. Auf solchen Rechnern war das Video komplett
               * ausgeblendet und es stand dauerhaft nur das Standbild da. Der Kunde hat
               * genau das gemeldet: „Ich wollte doch ein Video und kein statisches Foto."
               *
               * Deckt sich mit der bereits bestehenden Projektentscheidung, Marken-
               * Animationen nicht an dieses Flag zu haengen.
               *
               * ⚠️ OFFEN: WCAG 2.2.2 verlangt fuer automatisch startende Bewegung ueber
               * 5 Sekunden eine Moeglichkeit zum Anhalten. Das Flag war bisher diese
               * Moeglichkeit. Ersatz muss ein sichtbares Bedienelement sein — hier
               * schwierig, weil diese Ebene `pointer-events: none` und `-z-10` traegt.
               * Notiert in `docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`.
               */
              <video
                className="h-full w-full object-cover"
                src={video}
                poster={image}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : zoom === undefined ? (
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
            {/* Mit `mobil` gelten die drei Desktop-Ebenen erst ab 1024 px, darunter der mobile Schleier (siehe `mobil`). */}
            <div className={`absolute inset-0 bg-gradient-to-b from-white/75 via-white/[0.18] to-white/45 ${mobil ? 'max-lg:hidden' : ''}`} />
            <div className={`absolute inset-0 ${GUARD[textGuard].klasse} ${mobil ? 'max-lg:hidden' : ''}`} />
            <div
              className={`absolute inset-0 ${mobil ? 'max-lg:hidden' : ''}`}
              style={{ background: `radial-gradient(ellipse closest-side at ${GUARD[textGuard].radialCenter}, rgb(255 255 255 / 0) 33%, rgb(255 255 255 / 1) 90%)` }}
            />
            {mobil && <div className="cc-guard-mobil-licht absolute inset-0 lg:hidden" />}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
      {/* `stehend`, unter 1024 px: Auslauf ins Weiss an Ober- und Unterkante. Ausserhalb der stehenden Flaeche, damit er
          mit der Sektion scrollt und beim Durchscrollen nicht als Band hinter den Karten steht. `white/0` statt
          `transparent`: Transparent ist transparentes Schwarz und gaebe einen grauen Saum (siehe Kopf dieser Datei).
          HOEHEN SEIT 2026-10-17 GENAU DIE FREIEN STREIFEN, nie hinter Karten: oben die 48 px ueber der ersten Karte
          (`FOTO_UEBER_KARTEN`), unten der Innenabstand der Sektion unter der letzten (`py-20` = 80 px, ab 768 px `py-28`).
          Vorher 96 und 160 px: Beide liefen hinter die erste bzw. letzte Karte. Verlauf flach an beiden Enden
          (`.cc-auslauf-*` in styles/textschutz.css), auf 48 px zeigte der lineare eine Kante. */}
      {mobil === 'stehend' && (
        <>
          <div className="cc-auslauf-oben absolute inset-x-0 top-0 h-12 lg:hidden" />
          <div className="cc-auslauf-unten absolute inset-x-0 bottom-0 h-20 md:h-28 lg:hidden" />
        </>
      )}
      {/* `flaeche` (gepinnte Buehne, seit 2026-10-18): nur unten ein Auslauf. Waehrend die Buehne steht, liegt er hinter
          der Knopfleiste; scrollt sie am Ende weg, endet das Foto nicht mit harter Kante an der naechsten Sektion. Oben
          haelt `.cc-ablauf-kopf` (ScrollPinnedProcess) den Kopf frei. */}
      {mobil === 'flaeche' && <div className="cc-auslauf-unten absolute inset-x-0 bottom-0 h-20 lg:hidden" />}
    </div>
  );
};

export default PhotoBackdrop;
