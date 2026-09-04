import React from 'react';

/**
 * Zeitstrahl fuer Unternehmensstationen (Backlog 1.27).
 *
 * WARUM NICHT `ProcessList`: Die Ablauf-Sektionen zeigen gleichrangige Schritte in einem
 * Kartenraster — die Reihenfolge steht nur in der Nummer. Fuer eine Unternehmens-
 * geschichte ist die Abfolge aber die Aussage: dass etwas AUFEINANDER folgt. Ein Raster
 * kann das nicht zeigen, eine Linie schon.
 *
 * ⚠️ DIE KARTENFLAECHE IST KEINE DEKORATION, SIE IST PFLICHT. Die erste Fassung setzte
 * den Text ohne Flaeche direkt in die Sektion — optisch leichter und deutlicher als
 * Strahl lesbar. Auf `/ueber-uns` liegt die Sektion aber mit `bg-gray-50/70` ueber einem
 * Werkstattfoto (`BackdropLayout`), und ueber den dunklen Fahrzeugen war Station 4
 * praktisch nicht mehr lesbar. `ProcessList` und `FeatureGrid` loesen genau das seit
 * jeher mit `rounded-2xl border border-gray-100 bg-gray-50/70 p-6` — dieselbe Flaeche
 * steht deshalb auch hier. Wer sie entfernt, holt den Fehler zurueck.
 *
 * DIE LINIE LIEGT IN DER LUECKE ZWISCHEN DEN KARTEN, auf Hoehe der Ziffernmitte
 * (2,875rem = 1,5rem Innenabstand + halbe Knopfhoehe). Waagerecht ab `lg`, darunter
 * senkrecht. Bewusst KEIN zweiter Markup-Block fuer Mobil — sonst stuende derselbe Text
 * zweimal im HTML und Suchmaschinen wie Screenreader bekaemen ihn doppelt.
 *
 * DIE LINIE IST DEKORATION: Sie traegt `aria-hidden`, weil die Abfolge bereits in der
 * `<ol>` steckt. Wer die Seite hoert, bekommt „Listenelement 2 von 5" — das ist die
 * Information, die die Linie fuer Sehende transportiert.
 */

export interface TimelineStation {
  /** Jahr oder Zeitraum. Leer lassen, solange die Angabe fehlt — siehe `istPlatzhalter`. */
  zeit?: string;
  title: string;
  description: string;
  /**
   * Station ohne zugelieferten Inhalt. Wird als Platzhalter benannt und bekommt eine
   * ruhigere Ziffer — aber KEINE reduzierte Deckkraft auf dem Text: Das druecke den
   * Kontrast auf der halbtransparenten Karte unter AA. Die Kennzeichnung traegt das
   * Wort „Jahr offen", nicht die Farbe allein (WCAG 1.4.1).
   */
  istPlatzhalter?: boolean;
}

const Timeline: React.FC<{ stations: TimelineStation[] }> = ({ stations }) => (
  <ol className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-6">
    {stations.map((station, idx) => {
      const letzte = idx === stations.length - 1;
      return (
        <li
          key={station.title}
          className="relative rounded-2xl border border-gray-100 bg-gray-50/70 p-6"
        >
          {/* Verbindung in die Luecke zur naechsten Karte. Beim letzten Eintrag entfaellt
              sie — sonst zeigte der Strahl ins Nichts. */}
          {!letzte && (
            <span
              aria-hidden="true"
              className="absolute left-[2.875rem] top-full h-4 w-px bg-gray-300 lg:left-full lg:top-[2.875rem] lg:h-px lg:w-6"
            />
          )}

          <div
            className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-base font-bold shadow-sm ring-1 ring-gray-100 ${
              station.istPlatzhalter ? 'text-gray-500' : 'text-blue-600'
            }`}
          >
            {idx + 1}
          </div>

          {station.zeit ? (
            <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
              {station.zeit}
            </span>
          ) : (
            station.istPlatzhalter && (
              <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
                Jahr offen
              </span>
            )
          )}

          <h3 className="text-lg font-bold leading-snug text-gray-950">{station.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{station.description}</p>
        </li>
      );
    })}
  </ol>
);

export default Timeline;
