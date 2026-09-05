import React from 'react';
import { terminLeistungen } from '../../data/leistungsauswahl';
import { enthaeltDummies, zusatzleistungen } from '../../data/zusatzleistungen';
import { inputClass, labelClass, type FeldAenderung, type FormFieldsByKind } from './felder';

/**
 * Felder der Variante „Aufbereitungstermin".
 *
 * Herausgeloest aus `RequestForm.tsx` am 2026-09-05 (reiner Umzug, kein Verhalten
 * geaendert). Rahmen, Zustand, Versand und Absenden bleiben dort; hier stehen nur die
 * Felder dieser Variante.
 */
interface TerminFelderProps {
  werte: FormFieldsByKind['termin'];
  onChange: FeldAenderung;
  onZusatzleistung: (id: string, aktiv: boolean) => void;
}

const TerminFelder: React.FC<TerminFelderProps> = ({ werte, onChange, onZusatzleistung }) => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="termin-name">Name</label>
        <input id="termin-name" name="name" required value={werte.name} onChange={onChange} className={inputClass} placeholder="Max Mustermann" />
      </div>
      <div>
        <label className={labelClass} htmlFor="termin-phone">Telefon</label>
        <input id="termin-phone" name="phone" required type="tel" value={werte.phone} onChange={onChange} className={inputClass} placeholder="0341 - ..." />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="termin-email">E-Mail</label>
        <input id="termin-email" name="email" required type="email" value={werte.email} onChange={onChange} className={inputClass} placeholder="name@beispiel.de" />
      </div>
      <div>
        <label className={labelClass} htmlFor="termin-vehicle">Fahrzeug</label>
        <input id="termin-vehicle" name="vehicle" value={werte.vehicle} onChange={onChange} className={inputClass} placeholder="Marke / Modell" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="termin-service">Gewünschte Leistung</label>
        {/* Optionen aus `data/leistungsauswahl.ts` — dieselbe Quelle, aus der
            die Vorauswahl abgeleitet wird (1.19). Zwei Listen waeren zwei Orte,
            an denen dieselben Schluessel gepflegt werden muessten. */}
        <select id="termin-service" name="service" value={werte.service} onChange={onChange} className={inputClass}>
          <option value="">Bitte wählen</option>
          {terminLeistungen.map((leistung) => (
            <option key={leistung.id} value={leistung.id}>{leistung.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="termin-date">Wunschtermin</label>
        <input id="termin-date" name="preferredDate" type="date" value={werte.preferredDate} onChange={onChange} className={inputClass} />
      </div>
    </div>
    {/*
      ZUSATZLEISTUNGEN (Backlog 1.18). Die Liste kommt vollstaendig aus
      `data/zusatzleistungen.ts` — hier steht kein einziger Eintrag fest
      verdrahtet. Ergaenzen ist eine Zeile in den Daten.

      <fieldset> mit <legend> statt eines <div> mit Ueberschrift: Screenreader
      sagen die Gruppenbeschriftung dann bei JEDEM Kaestchen mit an. Ohne das
      hoert man fuenfmal „Kontrollkaestchen" ohne zu wissen, wozu sie gehoeren.
    */}
    <fieldset className="rounded-xl border border-gray-200 p-4">
      <legend className="px-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
        Gewünschte Zusatzleistungen
      </legend>
      {enthaeltDummies && (
        <p className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-relaxed text-gray-700">
          Diese Auswahl ist noch in Abstimmung — die endgültigen Zusatzleistungen folgen.
          Nennen Sie Ihren Wunsch gern zusätzlich in der Nachricht.
        </p>
      )}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {zusatzleistungen.map((leistung) => {
          // `?? []`: Beim Reiterwechsel laeuft genau ein Renderdurchlauf mit den
          // Werten der VORHERIGEN Variante, in denen es dieses Feld nicht gibt.
          // Siehe die Begruendung oben am Variantenwechsel.
          const gewaehlt = (werte.zusatzleistungen ?? []).includes(leistung.id);
          return (
            <label
              key={leistung.id}
              htmlFor={`termin-${leistung.id}`}
              className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
                gewaehlt ? 'border-blue-600 bg-blue-600/5' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                id={`termin-${leistung.id}`}
                type="checkbox"
                name="zusatzleistungen"
                value={leistung.id}
                checked={gewaehlt}
                onChange={(e) => onZusatzleistung(leistung.id, e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-950">{leistung.label}</span>
                {leistung.hinweis && (
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-600">{leistung.hinweis}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
    <div>
      <label className={labelClass} htmlFor="termin-description">Nachricht</label>
      <textarea id="termin-description" name="description" rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand ..." />
    </div>
  </>
);

export default TerminFelder;
