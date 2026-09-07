import React from 'react';
import { Film } from 'lucide-react';
import type { VideoPlatz } from '../data/videos';

/**
 * Ein Videoplatz auf der Seite — Backlog 3.18, 3.21.
 *
 * ZWEI ZUSTAENDE, EINE KOMPONENTE:
 *  - `quelle` gesetzt  → das Video laeuft, stumm und in Schleife, mit Standbild
 *  - `quelle` ist null → ein sichtbar als Platzhalter gekennzeichneter Rahmen, der
 *                        benennt, WAS an diese Stelle gehoert
 *
 * WARUM DER PLATZHALTER SICHTBAR IST und nicht einfach nichts: Eine leere Stelle sieht
 * im Review aus wie eine fertige Seite ohne Video — niemand vermisst, was er nie
 * gesehen hat. Der Rahmen macht die Luecke zum Gespraechsgegenstand. Ausgeliefert wird
 * ohnehin nur in die Abstimmungsumgebung, nicht unter die Kundendomain; und der
 * Dummy-Waechter bricht den Build, sobald jemand das doch live schieben will, ohne den
 * Platz vorher zu fuellen.
 *
 * BEWEGUNG: `autoPlay muted loop playsInline` ist die einzige Kombination, mit der
 * mobile Browser ueberhaupt selbst starten — ohne `muted` verweigern iOS und Android,
 * ohne `playsInline` geht iOS in den Vollbildmodus. Wer `prefers-reduced-motion`
 * gesetzt hat, bekommt das Standbild; das ist keine Einschraenkung, sondern der Grund,
 * warum es ein Standbild gibt.
 */

interface BetriebsVideoProps {
  platz: VideoPlatz;
  /** Seitenverhaeltnis des Rahmens. Default 16:9. */
  format?: '16/9' | '21/9';
}

const BetriebsVideo: React.FC<BetriebsVideoProps> = ({ platz, format = '16/9' }) => {
  const rahmen = 'overflow-hidden rounded-[2rem] border border-gray-200/80 bg-gray-50';

  if (platz.quelle) {
    return (
      <figure className={rahmen} style={{ aspectRatio: format }}>
        {/*
          KEIN `motion-reduce:hidden` (entfernt 2026-09-07).

          Es stand hier und hat genau das bewirkt, was niemand wollte: Windows meldet
          `prefers-reduced-motion: reduce`, sobald „Animationen anzeigen" in den
          Systemeinstellungen aus ist — eine verbreitete Einstellung, und keine Aussage
          ueber Videos. Auf solchen Rechnern lief das Video nie, es stand dauerhaft nur
          das Standbild da. Der Kunde hat genau das gemeldet.

          Deckt sich mit der bestehenden Projektentscheidung, Marken-Animationen nicht an
          dieses Flag zu haengen.

          ⚠️ OFFEN: WCAG 2.2.2 verlangt fuer automatisch startende Bewegung ueber
          5 Sekunden eine Moeglichkeit zum Anhalten. Das Flag war bisher diese
          Moeglichkeit; Ersatz ist ein sichtbares Bedienelement. Notiert in
          `docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`.
        */}
        <video
          className="h-full w-full object-cover"
          src={platz.quelle}
          poster={platz.poster ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={platz.beschreibung}
        />
      </figure>
    );
  }

  return (
    <div
      className={`${rahmen} flex items-center justify-center px-6 py-12 text-center`}
      style={{ aspectRatio: format }}
      data-videoplatz={platz.id}
    >
      <div className="max-w-xl">
        <Film aria-hidden="true" className="mx-auto mb-4 h-8 w-8 text-gray-400" />
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
          {platz.titel}
        </p>
        <p className="mt-3 text-base font-medium text-gray-800 md:text-lg">{platz.beschreibung}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{platz.zweck}</p>
        <p className="mt-5 text-xs text-gray-500">
          Das Material wird nachgeliefert und an dieser Stelle eingesetzt.
        </p>
      </div>
    </div>
  );
};

export default BetriebsVideo;
