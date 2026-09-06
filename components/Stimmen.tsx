import React from 'react';
import { Quote } from 'lucide-react';
import { stimmen } from '../data/stimmen';

/**
 * Mitarbeiterstimmen auf `/karriere` — Backlog 3.19.
 *
 * ANONYM PER BAUART: Die Komponente kennt kein Namensfeld. Wer spaeter einen Namen
 * anzeigen wollte, muesste die Datenstruktur aendern und dabei ueber den Kommentar in
 * `data/stimmen.ts` stolpern — das ist Absicht. Die Vorgabe aus dem Review
 * („keine Namen") ist damit nicht nur eine Bitte, sondern eine Eigenschaft des Codes.
 */
/**
 * ⚠️ FARBEN NICHT ABSCHWAECHEN. Die Berufsbezeichnung stand zuerst auf `text-gray-500`
 * und wurde von `npm run kontrast` mit 4.21:1 gemeldet — unter AA (4,5) bei 10 px.
 * Kleine, weit gesperrte Versalien auf `bg-gray-50/70` haben kaum Reserve; die
 * Graustufen tragen in diesem Projekt zudem eingebackene Alphas. Vor jeder Aenderung
 * hier `npm run kontrast -- /karriere` laufen lassen.
 */
const Stimmen: React.FC = () => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
    {stimmen.map((s) => (
      <figure
        key={s.id}
        className={`flex flex-col rounded-[1.5rem] border p-6 ${
          s.istPlatzhalter ? 'border-dashed border-gray-300 bg-gray-50/70' : 'border-gray-100 bg-white'
        }`}
      >
        <Quote aria-hidden="true" className="mb-4 h-6 w-6 shrink-0 text-gray-300" />
        <blockquote className="flex-1 text-sm leading-relaxed text-gray-700 md:text-base">
          {s.aussage}
        </blockquote>
        <figcaption className="mt-5 border-t border-gray-100 pt-4">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">
            {s.beruf}
          </span>
          {s.dabeiSeit && <span className="mt-1 block text-xs text-gray-600">seit {s.dabeiSeit} im Betrieb</span>}
        </figcaption>
      </figure>
    ))}
  </div>
);

export default Stimmen;
