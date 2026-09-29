import React from 'react';

/**
 * Textkacheln in einer Zielgruppenkarte der Startseite (Backlog 6.4, User 2026-09-28): die Vorteile der
 * Privatkunden-Unterseite in Kurzform — dort, wo die beiden anderen Karten ihre Partnerliste haben.
 *
 * GLEICHER PLATZ, GLEICHES VERHALTEN WIE `ZielgruppenPartner`: Der Block nimmt den Rest der Karte (`flex-1`)
 * und scrollt darin, falls ein niedriges Fenster nicht alles zeigt. Deshalb auch dieselben `data-partner`-
 * Merkmale — `npm run zielgruppen` misst die Kacheln damit genauso wie die Partner (Treffertest, Mausrad,
 * Mindestzahl sofort sichtbarer Eintraege). Der Name der Merkmale ist historisch, die Messung ist dieselbe.
 *
 * INHALT kommt aus `data/privatkunden.ts` (`kurz`), derselben Datei wie die Langfassung der Unterseite.
 * SPALTEN: ab `sm` zwei (Kartenspalte ab 25 rem), auf dem Telefon eine — zwei Spalten ergaeben dort bei
 * 264–294 px Textbreite Kacheln mit drei Woertern pro Zeile.
 *
 * NIEDRIGE FENSTER (gemessen mit `npm run zielgruppen`, 2026-09-28): Mit Kurztext waren bei 1280 × 593 (Full HD,
 * 150 % Skalierung) nur 2 von 4 Kacheln ohne Scrollen lesbar, auf 390 × 664 und 360 × 640 nach dem Kartenscroll 3 —
 * die naechste Karte schiebt sich dort ueber die letzte. Dort stehen deshalb NUR DIE TITEL, zweispaltig: Sie sind
 * selbst ganze Aussagen („Sie verhandeln nicht mit der Versicherung"), der Kurztext ergaenzt sie nur. Schwellen je
 * Breite getrennt, damit der Laptop (1366 × 657), auf dem alles passt, den Kurztext behaelt.
 */
const OHNE_TEXT = '[@media(min-width:1024px)_and_(max-height:620px)]:hidden [@media(max-width:1023px)_and_(max-height:700px)]:hidden';
export interface ZielgruppenKachel {
  title: string;
  text: string;
}

const ZielgruppenKacheln: React.FC<{ kacheln: ZielgruppenKachel[]; titel: string }> = ({ kacheln, titel }) => (
  <div
    data-partner="block"
    className="mt-5 flex flex-col border-t border-gray-100 pt-4 [@media(max-height:859px)]:mt-4 [@media(max-height:859px)]:pt-3 lg:min-h-[var(--liste-min)] lg:flex-1"
  >
    <p data-partner="titel" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">
      {titel}
    </p>
    <ul
      data-partner="liste"
      className="cc-card-scroll cc-scroll-verlauf mt-2.5 grid grid-cols-1 content-start gap-2 [@media(max-width:1023px)_and_(max-height:700px)]:grid-cols-2 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2"
    >
      {kacheln.map((kachel) => (
        <li key={kachel.title} className="rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 [@media(max-height:760px)]:px-3 [@media(max-height:760px)]:py-2">
          <p className="text-sm font-bold leading-snug text-gray-950 [@media(max-height:760px)]:text-xs">{kachel.title}</p>
          <p className={`mt-1 text-xs leading-relaxed text-gray-600 ${OHNE_TEXT}`}>{kachel.text}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ZielgruppenKacheln;
