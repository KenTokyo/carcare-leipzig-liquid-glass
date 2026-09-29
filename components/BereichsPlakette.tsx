import React from 'react';
import type { Bereich } from '../data/services';

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
  bereich: Bereich | null | undefined;
  className?: string;
}

const BereichsPlakette: React.FC<BereichsPlaketteProps> = ({ bereich, className = '' }) => {
  if (!bereich) return null;
  return (
    <span
      aria-hidden="true"
      data-suche="aus"
      data-bereich={bereich}
      lang="en"
      style={{ '--plakette-rand': `rgb(var(--cc-${bereich}-rgb))` } as React.CSSProperties}
      // 18 px hoch: 2 px Innenabstand plus 2 px Rand oben und unten um die 10-px-Zeile.
      className={`cc-liquid cc-liquid--plakette inline-flex w-fit shrink-0 items-center rounded-full border-2 px-2 py-0.5 text-[10px] font-bold uppercase leading-none tracking-[0.18em] text-gray-950 ${className}`}
    >
      {TEXT[bereich]}
    </span>
  );
};

export default BereichsPlakette;
