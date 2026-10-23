import React, { useEffect, useState } from 'react';
import type { Bereich, BereichsAngabe } from '../data/services';

/**
 * „Care" und „Repair" als kleine Plaketten über die ganze Seite (Backlog 6.8, Meeting 2026-09-28).
 *
 * IDEE: Der Slogan im Titelbild („We Care. We Repair.") führt die beiden Wörter ein. Dieselben Wörter tauchen danach
 * an jeder Leistung wieder auf: Care an allem zur Aufbereitung, Repair an Unfallinstandsetzung und Lackierung.
 *
 * GESTALT: Liquid Glass (`.cc-liquid`, dasselbe Material wie die mobile Leiste; `styles/glas.css`) mit 2-px-Rand in der
 * Wagenfarbe und dunkler Schrift. Entstanden im Seitendurchgang mit dem User auf der Startseite: „nicht die Schrift blau,
 * sondern nur die Buttonkontur" (2026-09-28), „der Hintergrund der Labels soll in Liquid Glass sein und nicht weiß"
 * (2026-09-29), danach „super vom Design her, bitte auf alle anderen Stellen der gesamten Website" (2026-09-29).
 * Bis dahin stand auf den Unterseiten eine farbige Fläche mit weißer Schrift; diese Fassung gibt es nicht mehr.
 * Der Rand ist Schmuck, die Schrift trägt die Information; die helle Glastinte hält sie auch über Fotos lesbar.
 * KEIN `shadow-sm` hier: Der Tailwind-Schatten stünde in der CSS später und löschte die Lichtkanten des Glases, die
 * `.cc-liquid` über `box-shadow` zeichnet.
 *
 * FARBEN: gemessen am Titelbild (blauer und roter Porsche), Herleitung bei `--cc-care-rgb` in index.css. Die Randfarbe
 * kommt als Variable `--plakette-rand`; `.cc-liquid--plakette` hält sie auch beim Zeigen fest.
 *
 * WELCHE LEISTUNG WELCHE PLAKETTE TRÄGT, steht NICHT hier, sondern in `data/services.ts` (`bereichVon`,
 * `bereichDerGruppe`), abgeleitet aus der Gruppe des Katalogeintrags.
 *
 * `aria-hidden`: Die Plakette ist Markenzeichen, keine Information, die nicht auch im Titel daneben stünde.
 * Vorlesegeräte sagten sonst vor jeder Leistung „Care" oder „Repair". Aus der Seitensuche genommen
 * (`data-suche="aus"`), sonst liefert die Suche nach „Care" jede Leistungsseite.
 */
const TEXT: Record<Bereich, string> = { care: 'Care', repair: 'Repair' };

interface BereichsPlaketteProps {
  /** Eine Plakette oder mehrere (Leasingrueckgabe: Care und Repair, User 2026-10-03), `null` = keine. */
  bereich: BereichsAngabe | undefined;
  /** Lage und Abstand — bei mehreren Plaketten fuer die ganze Gruppe. */
  className?: string;
  /** Groesse JEDER Plakette, z. B. `py-1.5` im Seitenkopf. Bei einer Plakette dasselbe wie `className`. */
  plaketteClassName?: string;
  /**
   * Die Plakette blendet sich SELBST ein und aus (300 ms). `undefined` = immer sichtbar, ohne Uebergang.
   *
   * WARUM (2026-10-05): Chrome schaltet `backdrop-filter` aus, solange ein Vorfahr nicht voll deckt. Lag die Plakette in
   * einem einblendenden Block (Seitenkopf, Abschnitt, Akkordeon), zeigte sie waehrend der Einblendung den Hintergrund
   * scharf und sprang am Ende auf Glas. Der Aufrufer setzt `sichtbar` deshalb erst, wenn sein Block fertig eingeblendet
   * ist (`onAnimationComplete`), und blendet NIE einen Vorfahren der Plakette ein. Gemessene Faelle und Plan:
   * docs/performance/tasks/2026-10-05-ruckeln-und-cta-glas-tasks.md.
   */
  sichtbar?: boolean;
}

/** Dauer des Ein- und Ausblendens. */
const BLENDE_MS = 300;

/**
 * UNSICHTBAR HEISST AUCH `visibility: hidden` (2026-10-19, R32, Aufnahme des Users vom MacBook: Startseite am Akkordeon
 * „komplett zerschossen“). Mit `opacity: 0` allein blieb jede verborgene Plakette eine eigene Grafikebene (Grund
 * `BackdropFilter`), und fuer jede legte Chrome wegen der damals runden Ecken am `<main>` eine Maske in Groesse des ganzen
 * Hauptbereichs an (Rundung inzwischen entfernt, `index.css` `.site-main-shell`). Zwoelf eingeklappte Karten je
 * Akkordeon ergaben so 19 seitengrosse Ebenen; Chrome liess Kacheln leer, die fixierte Fusszeile schien durch.
 * `visibility: hidden` nimmt die Plakette aus dem Zeichnen und damit aus dem Ebenenbaum.
 *
 * ABLAUF, damit beide Blenden auf dem Compositor laufen (`npm run akkordeon` verlangt das):
 *  - Ausblenden: Deckkraft sofort auf 0 (Uebergang BLENDE_MS), `visibility: hidden` erst am `transitionend`. Ein
 *    Zeitgeber ueber BLENDE_MS allein schlug rund 30 ms zu frueh zu (er startet vor dem Uebergang); das letzte Stueck lief
 *    dann im Hauptthread (Code 131072, `kAnimationHasNoVisibleChange`, dritter Versuch). Der Zeitgeber bleibt als
 *    Rueckfall mit Reserve, falls kein Uebergang laeuft (z. B. Plakette gar nicht gezeichnet).
 *  - Einblenden: `visibility` und Deckkraft sofort (im selben Bild; gemessen auf dem Compositor).
 *  Ein CSS-Uebergang `visibility 300ms` saehe gleich aus, laeuft aber selbst im Hauptthread (erster Versuch).
 * Messung: `npm run zeichnen`, Plan: docs/mac-zeichenluecken/tasks/2026-10-19-mac-zeichenluecken-tasks.md.
 */
const useBlende = (sichtbar?: boolean) => {
  const [verborgen, setVerborgen] = useState(sichtbar === false);
  useEffect(() => {
    if (sichtbar !== false) {
      setVerborgen(false);
      return;
    }
    const zeit = window.setTimeout(() => setVerborgen(true), BLENDE_MS + 200);
    return () => window.clearTimeout(zeit);
  }, [sichtbar]);
  const amEnde = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === 'opacity' && sichtbar === false) setVerborgen(true);
  };
  // Sichtbar heisst sofort sichtbar, auch wenn der Zustand `verborgen` erst im naechsten Durchlauf zurueckfaellt.
  return { zeigen: sichtbar === true, verborgen: sichtbar === false && verborgen, amEnde };
};

/** Inline statt Klasse: `.cc-liquid` setzt eine eigene `transition`-Liste, eine Utility-Klasse wuerde sie ersetzen. */
const einblendStil = (sichtbar: boolean | undefined, { zeigen, verborgen }: { zeigen: boolean; verborgen: boolean }): React.CSSProperties =>
  sichtbar === undefined
    ? {}
    : { opacity: zeigen ? 1 : 0, transition: `opacity ${BLENDE_MS}ms ease`, ...(verborgen ? { visibility: 'hidden' as const } : {}) };

const Plakette: React.FC<{ bereich: Bereich; className: string; sichtbar?: boolean }> = ({ bereich, className, sichtbar }) => {
  const blende = useBlende(sichtbar);
  return (
    <span
      aria-hidden="true"
      data-suche="aus"
      data-bereich={bereich}
      lang="en"
      onTransitionEnd={sichtbar === undefined ? undefined : blende.amEnde}
      style={{ '--plakette-rand': `rgb(var(--cc-${bereich}-rgb))`, ...einblendStil(sichtbar, blende) } as React.CSSProperties}
      // 18 px hoch: 2 px Innenabstand plus 2 px Rand oben und unten um die 10-px-Zeile.
      className={`cc-liquid cc-liquid--plakette inline-flex w-fit shrink-0 items-center rounded-full border-2 px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-gray-950 ${className}`}
    >
      {TEXT[bereich]}
    </span>
  );
};

/**
 * MEHRERE PLAKETTEN (seit 2026-10-03): nebeneinander mit 4 px Abstand, in der Reihenfolge der Angabe (Care vor Repair
 * wie im Slogan). Die Gruppe bekommt Lage und Abstand (`className`), jede Plakette ihre Groesse (`plaketteClassName`).
 */
const BereichsPlakette: React.FC<BereichsPlaketteProps> = ({ bereich, className = '', plaketteClassName = '', sichtbar }) => {
  const liste: Bereich[] = !bereich ? [] : typeof bereich === 'string' ? [bereich] : [...bereich];
  if (!liste.length) return null;
  if (liste.length === 1) return <Plakette bereich={liste[0]} className={`${className} ${plaketteClassName}`.trim()} sichtbar={sichtbar} />;
  return (
    <span aria-hidden="true" data-suche="aus" className={`inline-flex w-fit shrink-0 items-center gap-1 ${className}`}>
      {liste.map((b) => (
        <Plakette key={b} bereich={b} className={plaketteClassName} sichtbar={sichtbar} />
      ))}
    </span>
  );
};

export default BereichsPlakette;
