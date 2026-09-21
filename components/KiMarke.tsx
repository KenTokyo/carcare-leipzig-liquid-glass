import React from 'react';
import { hinweisFuer } from '../data/bildherkunft';

/**
 * Kennzeichnung am Bild: kleine Plakette „KI-generiert“ bzw. „KI-bearbeitet“.
 *
 * WARUM AM BILD UND NICHT NUR IM FUSSBEREICH: Art. 50 KI-VO verlangt, dass die Kennzeichnung
 * spätestens beim ersten Betrachten erkennbar ist. Ein Link in der Fußzeile erfüllt das bei
 * bildschirmfüllenden Motiven nicht.
 *
 * GESTALTUNG (Vorgabe des Users: „subtil“): 10 px Schrift, abgerundeter Chip mit dunklem,
 * deckendem Grund, damit die Schrift auf hellen wie dunklen Bildstellen lesbar bleibt. Die
 * Messwerte stehen bei `.cc-ki-marke` in `index.css`.
 *
 * WELCHES BILD WELCHE PLAKETTE TRÄGT, entscheidet `data/bildherkunft.ts` — nicht die aufrufende
 * Komponente. Ändert sich die Herkunft eines Motivs, wird dort eine Zeile geändert; hier nichts.
 * Bilder ohne Kennzeichnungsbedarf (Videos, Standbilder, Logos) liefern leeren Text: Dann wird
 * nichts gerendert.
 *
 * Die Plakette ist normaler Text und wird von Vorlesegeräten mitgelesen. Sie liegt bewusst
 * NICHT in einem `aria-hidden`-Bereich; Aufrufer setzen sie deshalb neben die Bildebene, nicht
 * hinein.
 */
const KiMarke: React.FC<{
  /** Pfad des Bildes, das gekennzeichnet werden soll. */
  quelle?: string | null;
  /** Positionierung als Tailwind-Klassen, z. B. `top-3 right-3`. */
  className?: string;
  /**
   * Ohne absolute Position — fuer Stellen, an denen das Foto vom Inhalt fast vollstaendig
   * verdeckt wird (Zielgruppenkacheln unterhalb `lg`: dort bleibt vom Foto nur ein 20-px-Rahmen).
   * Dann steht die Plakette im Textbereich derselben Kachel.
   */
  statisch?: boolean;
  /**
   * Vorsatz, z. B. „Foto: “. Gehoert dorthin, wo die Plakette NICHT auf dem Bild liegt —
   * neben einer Ueberschrift liesse sich „KI-generiert“ sonst auf die Leistung beziehen
   * statt auf das Motiv.
   */
  praefix?: string;
}> = ({ quelle, className = 'bottom-3 right-3', statisch = false, praefix = '' }) => {
  const text = hinweisFuer(quelle);
  if (!text) return null;
  return <span className={`cc-ki-marke ${statisch ? 'inline-block' : 'absolute'} ${className}`}>{praefix}{text}</span>;
};

export default KiMarke;
