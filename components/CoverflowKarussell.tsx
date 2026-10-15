import React, { useCallback, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform, type AnimationPlaybackControls, type MotionValue } from 'framer-motion';

/**
 * Coverflow-Karussell nach skiper49 („Inverted perspective carousel“, https://skiper-ui.com/v1/skiper49), nachgebaut in
 * Framer Motion statt mit Swiper (keine zusaetzliche Abhaengigkeit; Begruendung und Messwerte der Vorlage in
 * `docs/einblicke-karussell/tasks/2026-10-14-einblicke-karussell-tasks.md`).
 *
 * VORLAGE (gemessen an der Swiper-Instanz der Demo, 14.10.2026): `effect: 'coverflow'` mit rotate 40, depth 100,
 * stretch 0, modifier 1, slideShadows; zentriert, ohne Abstand, Endlosschleife, 300 ms, Ziehen/Wischen, Punkte darunter.
 * FORMEL (Swiper `effect-coverflow`), je Karte `o` = Abstand zur Mitte in Kartenbreiten, links negativ:
 *   rotateY = −40° · o, translateZ = −Tiefe · |o|, z-index = 1 − |round(o)|, Schatten an der INNEREN Kante mit Deckkraft |o|.
 * So kippen die Seitenkarten mit der inneren Kante nach hinten, die aeussere wirkt naeher („inverted“).
 *
 * MASSSTAB: Die Vorlage hat 300-px-Karten bei Perspektive 1200 px und Tiefe 100 px. Unsere Karten sind groesser; damit die
 * Kippung bei jeder Groesse gleich AUSSIEHT, wachsen beide mit: Perspektive = 4 × Kartenbreite, Tiefe = ⅓ Kartenbreite.
 * Die Kartenbreite ist die CSS-Variable `--karte` (in `cqi` der Huelle), gesetzt vom Aufrufer ueber `className`.
 * Alles Sichtbare entsteht aus CSS (Prozent, `calc`), nicht aus gemessenen Pixeln: Der Prerender liefert schon das
 * fertige Bild, nichts springt nach dem Laden. Gemessen wird nur beim Ziehen (Pixel → Kartenbreiten).
 */

const DREHUNG = 40; // Grad je Kartenbreite (Swiper `rotate`)
const TEMPO = 0.3; // Sekunden (Swiper `speed` 300)
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1]; // CSS `ease`, wie Swiper
const KURZWISCH_MS = 300; // Swiper `shortSwipes`: schneller Wisch unter 300 ms = eine Karte weiter
const KURZWISCH_PX = 10;

/** Abstand der Karte `i` zur Mitte, in Kartenbreiten, ueber die Schleife gefaltet: (−n/2, n/2]. */
const versatzVon = (i: number, p: number, n: number) => {
  let o = (((i - p) % n) + n) % n;
  if (o > n / 2) o -= n;
  return o;
};
const modulo = (a: number, n: number) => ((a % n) + n) % n;

const Folie: React.FC<{
  index: number;
  anzahl: number;
  position: MotionValue<number>;
  beschriftung: string;
  children: React.ReactNode;
}> = ({ index, anzahl, position, beschriftung, children }) => {
  const versatz = useTransform(position, (p) => versatzVon(index, p, anzahl));
  const transform = useTransform(versatz, (o) =>
    `translateX(${o * 100}%) translateZ(calc(var(--karte) * ${(-Math.abs(o) / 3).toFixed(4)})) rotateY(${(-DREHUNG * o).toFixed(3)}deg)`,
  );
  const zIndex = useTransform(versatz, (o) => 1 - Math.abs(Math.round(o)));
  // Weiter als zweieinhalb Karten liegt eine Karte ausserhalb der Buehne; ausblenden, damit keine Rueckseite aufblitzt.
  const opacity = useTransform(versatz, (o) => (Math.abs(o) > 2.6 ? 0 : 1));
  const schattenLinks = useTransform(versatz, (o) => (o < 0 ? Math.min(1, -o) : 0));
  const schattenRechts = useTransform(versatz, (o) => (o > 0 ? Math.min(1, o) : 0));
  return (
    <motion.div
      role="group"
      aria-roledescription="Bild"
      aria-label={`${index + 1} von ${anzahl}: ${beschriftung}`}
      className="absolute inset-0 [backface-visibility:hidden]"
      style={{ transform, zIndex, opacity }}
    >
      {children}
      {/* Schatten wie Swiper `slideShadows`: dunkel an der inneren Kante, Deckkraft mit dem Abstand zur Mitte. */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(270deg,rgb(0_0_0/0.5),rgb(0_0_0/0))]" style={{ opacity: schattenLinks }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,rgb(0_0_0/0.5),rgb(0_0_0/0))]" style={{ opacity: schattenRechts }} />
    </motion.div>
  );
};

interface CoverflowKarussellProps<T> {
  eintraege: T[];
  /** Inhalt einer Karte; fuellt die Karte ganz (`h-full`). */
  karte: (eintrag: T, index: number) => React.ReactNode;
  /** Name je Karte fuer Vorleser und Punkte. */
  name: (eintrag: T, index: number) => string;
  /** Name des Karussells (Region). */
  bezeichnung: string;
  /** Huelle; setzt `--karte` (Kartenbreite in `cqi`), z. B. `[--karte:60cqi] md:[--karte:34cqi]`. */
  className?: string;
}

function CoverflowKarussell<T>({ eintraege, karte, name, bezeichnung, className = '' }: CoverflowKarussellProps<T>) {
  const anzahl = eintraege.length;
  const position = useMotionValue(0);
  const [aktiv, setAktiv] = useState(0);
  const [ziehen, setZiehen] = useState(false);
  const slotRef = useRef<HTMLDivElement>(null);
  const laeuft = useRef<AnimationPlaybackControls | null>(null);
  const zug = useRef<{ id: number; x: number; letztesX: number; start: number; breite: number; t: number } | null>(null);

  useMotionValueEvent(position, 'change', (p) => {
    const i = modulo(Math.round(p), anzahl);
    setAktiv((vorher) => (vorher === i ? vorher : i));
  });

  const fahre = useCallback((ziel: number) => {
    laeuft.current?.stop();
    laeuft.current = animate(position, ziel, { duration: TEMPO, ease: EASE });
  }, [position]);

  const schritt = (richtung: number) => fahre(Math.round(position.get()) + richtung);
  // Punkt angeklickt: auf dem kuerzeren Weg durch die Schleife dorthin.
  const zuKarte = (ziel: number) => {
    const jetzt = Math.round(position.get());
    let d = modulo(ziel - jetzt, anzahl);
    if (d > anzahl / 2) d -= anzahl;
    fahre(jetzt + d);
  };

  const runter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    laeuft.current?.stop();
    zug.current = { id: e.pointerId, x: e.clientX, letztesX: e.clientX, start: position.get(), breite: slotRef.current?.offsetWidth || 1, t: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
    setZiehen(true);
  };
  const bewegen = (e: React.PointerEvent<HTMLDivElement>) => {
    const z = zug.current;
    if (!z || z.id !== e.pointerId) return;
    z.letztesX = e.clientX;
    position.set(z.start - (e.clientX - z.x) / z.breite);
  };
  const los = (e: React.PointerEvent<HTMLDivElement>) => {
    const z = zug.current;
    if (!z || z.id !== e.pointerId) return;
    zug.current = null;
    setZiehen(false);
    // ABBRUCH = DER BROWSER SCROLLT SENKRECHT (`pan-y`): zurueck auf die Ausgangskarte. `pointercancel` meldet `clientX` 0;
    // bis 2026-10-14 wurde das als schneller Wisch gewertet, und senkrechtes Scrollen auf dem Handy wechselte die Karte
    // (gemessen mit echten Touch-Ereignissen, `output/b24/karussell-touch3.mjs`).
    if (e.type === 'pointercancel') { fahre(Math.round(z.start)); return; }
    const dx = z.letztesX - z.x;
    const dauer = performance.now() - z.t;
    // Wie Swiper: kurzer, schneller Wisch → genau eine Karte weiter; sonst zur naechstgelegenen Karte einrasten.
    if (dauer < KURZWISCH_MS && Math.abs(dx) > KURZWISCH_PX) fahre(Math.round(z.start) + (dx < 0 ? 1 : -1));
    else fahre(Math.round(position.get()));
  };

  const taste = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); schritt(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); schritt(-1); }
  };

  return (
    <div role="region" aria-roledescription="Karussell" aria-label={bezeichnung} className={`[container-type:inline-size] ${className}`}>
      <div
        // Fuer `npm run mobil`: Die Nachbarkarten sind hier absichtlich angeschnitten (wie in der Vorlage).
        data-mobil-anschnitt="Nachbarkarten im Karussell bewusst angeschnitten"
        tabIndex={0}
        onKeyDown={taste}
        onPointerDown={runter}
        onPointerMove={bewegen}
        onPointerUp={los}
        onPointerCancel={los}
        // `pan-y`: senkrecht scrollt die Seite weiter, waagerecht zieht das Karussell. `overflow-x: clip` schneidet Karten
        // ausserhalb der Buehne ab, ohne (wie `hidden`) die gekippten Kanten oben und unten zu kappen.
        // BUEHNE HOECHSTENS 2,9 KARTENBREITEN: Die Nachbarn reichen bis rund 1,43 Breiten aus der Mitte, dahinter endet die
        // Buehne wie in der Vorlage (856 px bei 300-px-Karten). Ohne Grenze blitzten in Full HD (Karten bei 30rem gedeckelt,
        // Container 1536 px) die uebernaechsten Karten als schmale Streifen am Rand auf (Aufnahme 1920 × 945, 2026-10-14).
        className={`relative isolate mx-auto max-w-[calc(var(--karte)*2.9)] select-none rounded-2xl py-[calc(var(--karte)*0.06)] outline-none [overflow-x:clip] [touch-action:pan-y] focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 ${ziehen ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div ref={slotRef} className="relative mx-auto aspect-[3/4] w-[var(--karte)] [perspective:calc(var(--karte)*4)]">
          {eintraege.map((eintrag, i) => (
            <Folie key={i} index={i} anzahl={anzahl} position={position} beschriftung={name(eintrag, i)}>
              {karte(eintrag, i)}
            </Folie>
          ))}
        </div>
      </div>

      {/* Punkte wie in der Vorlage: 8 px, aktiv deckend, sonst 20 %. Trefferflaeche 24 px (WCAG 2.5.8). */}
      <div className="mt-6 flex justify-center">
        {eintraege.map((eintrag, i) => (
          <button
            key={i}
            type="button"
            onClick={() => zuKarte(i)}
            aria-label={`Bild ${i + 1} anzeigen: ${name(eintrag, i)}`}
            aria-current={i === aktiv ? 'true' : undefined}
            className="group flex h-6 w-6 items-center justify-center"
          >
            <span className={`h-2 w-2 rounded-full bg-gray-950 transition-opacity duration-200 ${i === aktiv ? 'opacity-100' : 'opacity-20 group-hover:opacity-50'}`} />
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only" data-suche="aus">
        {`${name(eintraege[aktiv], aktiv)}, Bild ${aktiv + 1} von ${anzahl}`}
      </p>
    </div>
  );
}

export default CoverflowKarussell;
