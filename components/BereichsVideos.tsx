import React from 'react';
import { ArrowRight, Film } from 'lucide-react';
import type { VideoPlatz } from '../data/videos';

/**
 * Drei Bereichsvideos in einer Reihe — Backlog R18 (Wunsch des Users vom 2026-09-21):
 * Karosserie- und Mechanik-, Lackier- und Aufbereitungsbereich auf `/ueber-uns` und `/karriere`.
 *
 * KARTENMUSTER wie `LeistungsKarten` (Medium oben im 16:10-Rahmen, Titel, Text, optionaler
 * Link) — „das Kartendesign, das wir bisher genutzt haben". Eigene Komponente statt
 * `LeistungsKarten`, weil deren Bild ueber den Leistungskatalog aufgeloest wird; hier kommt das
 * Medium aus `data/videos.ts`.
 *
 * ZWEI ZUSTAENDE JE KARTE:
 *  - kein Video → sichtbar gekennzeichneter Platzhalter im Medienrahmen, wie `BetriebsVideo`:
 *    Titel „Videoplatz …" (den erkennt der Dummy-Waechter), Liefervorgabe, Hinweis auf die
 *    Nachlieferung. `data-videoplatz` fuehrt ihn im Bildinventar (`npm run bilder`) als Stelle.
 *  - Video geliefert → Wiedergabe erst auf Klick (`controls`, `preload="none"`). Drei
 *    selbststartende Videos nebeneinander kosteten Datenvolumen und Aufmerksamkeit; ein
 *    vom Besucher gestartetes Video braucht auch keinen Ersatz fuer WCAG 2.2.2.
 *
 * DREI IN EINER REIHE ab Tabletbreite (`md`), darunter untereinander (Mobile-First). Der
 * Platzhalter waechst mit seinem Text, wenn die Karte schmal wird — `aspect-ratio` gibt nur die
 * bevorzugte Hoehe vor, der Inhalt wird nie abgeschnitten.
 */

export interface BereichsKarte {
  platz: VideoPlatz;
  titel: string;
  text: string;
  href?: string;
  /** Beschriftung des Textlinks. Default: „Mehr erfahren". */
  linkLabel?: string;
}

const Medium: React.FC<{ platz: VideoPlatz; titel: string }> = ({ platz, titel }) => {
  if (platz.quelle) {
    return (
      <video
        className="aspect-[16/10] w-full rounded-xl bg-gray-900 object-cover"
        src={platz.quelle}
        poster={platz.poster ?? undefined}
        controls
        muted
        playsInline
        preload="none"
        aria-label={`Video: ${titel}`}
      />
    );
  }
  return (
    <div
      className="flex aspect-[16/10] w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-6 text-center"
      data-videoplatz={platz.id}
      data-platzhalter-label={titel}
    >
      <Film aria-hidden="true" className="mb-3 h-7 w-7 text-gray-400" />
      {/* `gray-600`, nicht `gray-500` wie in `BetriebsVideo`: Gemessen am 2026-09-21
          (`npm run kontrast`) erreicht gray-500 auf gray-50 nur 4,23:1 — zu wenig fuer 10–11 px. */}
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-600">{platz.titel}</p>
      <p className="mt-2 text-xs leading-relaxed text-gray-600">{platz.zweck}</p>
      <p className="mt-3 text-[11px] text-gray-600">Das Material wird nachgeliefert.</p>
    </div>
  );
};

const BereichsVideos: React.FC<{ karten: BereichsKarte[]; kicker?: string }> = ({ karten, kicker }) => (
  <div className="mt-12">
    {/* Bewusst kein Ueberschriftenelement: Die Kartentitel sind h3 unter dem h2 der Sektion.
        Eine h3 hier davor braeuchte h4-Karten und braeche die Gleichfoermigkeit mit den
        uebrigen Kartenreihen. */}
    {kicker && <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-700">{kicker}</p>}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {karten.map((k) => (
        <article key={k.platz.id} className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-5">
            <Medium platz={k.platz} titel={k.titel} />
          </div>
          <h3 className="text-xl font-bold leading-tight text-gray-950">{k.titel}</h3>
          <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{k.text}</p>
          {k.href && (
            <a
              href={k.href}
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600"
            >
              {k.linkLabel ?? 'Mehr erfahren'} <ArrowRight size={14} />
            </a>
          )}
        </article>
      ))}
    </div>
  </div>
);

export default BereichsVideos;
