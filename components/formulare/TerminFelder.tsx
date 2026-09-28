import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { terminLeistungen } from '../../data/leistungsauswahl';
import { ANDERE_MARKE, ANDERES_MODELL, markenListe, modelleVon } from '../../data/fahrzeugmarken';
import { enthaeltDummies, sperrgrund, zusatzleistungen } from '../../data/zusatzleistungen';
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

const TerminFelder: React.FC<TerminFelderProps> = ({ werte, onChange, onZusatzleistung }) => {
  // `?? []`: Beim Reiterwechsel laeuft genau ein Renderdurchlauf mit den Werten der VORHERIGEN
  // Variante, in denen es dieses Feld nicht gibt. Siehe die Begruendung am Variantenwechsel.
  const gewaehlteZusaetze = werte.zusatzleistungen ?? [];
  // Aufklappliste offen, wenn schon etwas gewaehlt ist — etwa ueber die Preiskachel „Keramikversiegelung“.
  const [zusaetzeOffen, setZusaetzeOffen] = useState(() => gewaehlteZusaetze.length > 0);
  const gewaehlteNamen = zusatzleistungen.filter((z) => gewaehlteZusaetze.includes(z.id)).map((z) => z.label);
  return (
    <>
      {/* PFLICHTANGABEN (User, 2026-09-28): Name, gewuenschte Leistung und Telefon ODER E-Mail — eins von
          beiden genuegt, damit wir uns melden koennen. Der Wunschtermin bleibt freiwillig. Genannt statt
          nur per Sternchen markiert (WCAG 3.3.2); verbindlich prueft `api/anfrage.ts` dieselbe Regel. */}
      <p className="text-[11px] leading-relaxed text-gray-600">
        Pflichtangaben: Name, gewünschte Leistung und Telefon oder E-Mail.
      </p>
      <div>
        <label className={labelClass} htmlFor="termin-name">Name</label>
        <input id="termin-name" name="name" required autoComplete="name" value={werte.name} onChange={onChange} className={inputClass} placeholder="Max Mustermann" />
      </div>
      {/* TELEFON ODER E-MAIL: `required` haengt jeweils am LEEREN Gegenstueck. Ist eins ausgefuellt, ist das
          andere frei; sind beide leer, meldet der Browser das erste. Ohne Skriptlogik, mit der ueblichen
          Fehlermeldung des Browsers und fuer Vorlesegeraete als Pflichtfeld angesagt, solange es eins ist. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="termin-phone">Telefon</label>
          <input
            id="termin-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required={!(werte.email ?? '').trim()}
            aria-describedby="termin-kontakt-hinweis"
            value={werte.phone}
            onChange={onChange}
            className={inputClass}
            placeholder="0341 - ..."
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="termin-email">E-Mail</label>
          <input
            id="termin-email"
            name="email"
            type="email"
            autoComplete="email"
            required={!(werte.phone ?? '').trim()}
            aria-describedby="termin-kontakt-hinweis"
            value={werte.email}
            onChange={onChange}
            className={inputClass}
            placeholder="name@beispiel.de"
          />
        </div>
        <p id="termin-kontakt-hinweis" className="text-[11px] leading-relaxed text-gray-600 md:col-span-2">
          Telefon oder E-Mail genügt. Eins davon brauchen wir, um uns bei Ihnen zu melden.
        </p>
      </div>
      {/* MARKE UND MODELL als zwei Auswahllisten (User, 2026-09-28) statt Freitext „Fahrzeug“. Das Modell
          haengt an der Marke und ist bis dahin gesperrt. Fehlt etwas in der Liste, fuehren „Andere Marke“
          und „Anderes Modell“ zu einem Freitextfeld — keine Sackgasse. Liste: `data/fahrzeugmarken.ts`. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="termin-marke">Marke</label>
          <select id="termin-marke" name="marke" value={werte.marke ?? ''} onChange={onChange} className={inputClass}>
            <option value="">Bitte wählen</option>
            {markenListe.map((marke) => (
              <option key={marke} value={marke}>{marke}</option>
            ))}
            <option value={ANDERE_MARKE}>{ANDERE_MARKE}</option>
          </select>
        </div>
        {werte.marke === ANDERE_MARKE ? (
          <div>
            <label className={labelClass} htmlFor="termin-modell-frei">Marke und Modell</label>
            <input id="termin-modell-frei" name="modellFrei" value={werte.modellFrei ?? ''} onChange={onChange} className={inputClass} placeholder="z. B. Lynk & Co 01" />
          </div>
        ) : (
          <div>
            <label className={labelClass} htmlFor="termin-modell">Modell</label>
            <select
              id="termin-modell"
              name="modell"
              value={werte.modell ?? ''}
              onChange={onChange}
              disabled={!werte.marke}
              className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <option value="">{werte.marke ? 'Bitte wählen' : 'Zuerst die Marke wählen'}</option>
              {modelleVon(werte.marke).map((modell) => (
                <option key={modell} value={modell}>{modell}</option>
              ))}
              {werte.marke && <option value={ANDERES_MODELL}>{ANDERES_MODELL}</option>}
            </select>
          </div>
        )}
        {werte.modell === ANDERES_MODELL && (
          <div className="md:col-span-2">
            <label className={labelClass} htmlFor="termin-modell-anderes">Welches Modell?</label>
            <input id="termin-modell-anderes" name="modellFrei" value={werte.modellFrei ?? ''} onChange={onChange} className={inputClass} placeholder="z. B. Golf Sportsvan" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="termin-service">Gewünschte Leistung</label>
          {/* Optionen aus `data/leistungsauswahl.ts` — dieselbe Quelle, aus der
              die Vorauswahl abgeleitet wird (1.19). Seit 2026-09-28 Pflicht. */}
          <select id="termin-service" name="service" required value={werte.service} onChange={onChange} className={inputClass}>
            <option value="">Bitte wählen</option>
            {terminLeistungen.map((leistung) => (
              <option key={leistung.id} value={leistung.id}>{leistung.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="termin-date">Wunschtermin (freiwillig)</label>
          <input id="termin-date" name="preferredDate" type="date" value={werte.preferredDate} onChange={onChange} className={inputClass} />
        </div>
      </div>
      {/*
        ZUSATZLEISTUNGEN (Backlog 1.18, seit 2026-09-28 die echte Liste aus 5.20). Alles kommt aus
        `data/zusatzleistungen.ts` — Name, Preis und die Regeln fuers Ausgrauen. Ergaenzen ist eine Zeile dort.

        AUFKLAPPLISTE (Meeting 2026-09-25: „bei vielen Eintraegen wird es eine Aufklappliste“): acht Eintraege
        haetten das Formular im Dialog mobil um gut 500 px verlaengert. `<details>` ist ohne Skript bedienbar
        und wird als Schalter angesagt; die Zusammenfassung nennt, was schon gewaehlt ist.

        <fieldset> mit <legend>: Screenreader sagen die Gruppenbeschriftung bei JEDEM Kaestchen mit an.

        GESPERRT statt versteckt: Passt eine Zusatzleistung nicht zur gewaehlten Leistung (Motorreinigung
        steckt in der Premiumpflege), bleibt sie sichtbar, ist inaktiv und nennt den Grund. Verschwaende
        sie, suchte der Kunde sie. Abgewaehlt wird sie beim Wechsel der Leistung in `RequestForm`.
      */}
      <details
        open={zusaetzeOffen}
        onToggle={(e) => setZusaetzeOffen(e.currentTarget.open)}
        className="group rounded-xl border border-gray-200"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-600">Zusatzleistungen (freiwillig)</span>
            <span className="mt-0.5 block text-sm text-gray-950">
              {gewaehlteNamen.length ? `Gewählt: ${gewaehlteNamen.join(', ')}` : 'Versiegelung, Felgen, Motorraum, Desinfektion und mehr'}
            </span>
          </span>
          <ChevronDown size={18} aria-hidden="true" className="shrink-0 text-gray-600 transition-transform group-open:rotate-180" />
        </summary>
        <fieldset className="border-t border-gray-200 p-4">
          <legend className="sr-only">Gewünschte Zusatzleistungen</legend>
          {enthaeltDummies && (
            <p className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-relaxed text-gray-700">
              Diese Auswahl ist noch in Abstimmung. Nennen Sie Ihren Wunsch gern zusätzlich in der Nachricht.
            </p>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {zusatzleistungen.map((leistung) => {
              const gewaehlt = gewaehlteZusaetze.includes(leistung.id);
              const grund = sperrgrund(leistung, werte.service ?? '', gewaehlteZusaetze);
              return (
                <label
                  key={leistung.id}
                  htmlFor={`termin-${leistung.id}`}
                  className={`flex min-h-12 gap-3 rounded-lg border p-3 transition-colors ${
                    grund
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                      : gewaehlt
                        ? 'cursor-pointer border-blue-600 bg-blue-50'
                        : 'cursor-pointer border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    id={`termin-${leistung.id}`}
                    type="checkbox"
                    name="zusatzleistungen"
                    value={leistung.id}
                    checked={gewaehlt}
                    disabled={Boolean(grund)}
                    onChange={(e) => onZusatzleistung(leistung.id, e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-baseline justify-between gap-2 ${grund ? 'opacity-60' : ''}`}>
                      <span className="min-w-0 hyphens-auto break-words text-sm font-semibold text-gray-950">{leistung.label}</span>
                      <span className="shrink-0 text-xs font-bold text-gray-700">{leistung.preis}</span>
                    </span>
                    {grund && <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-700">{grund}</span>}
                  </span>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-gray-600">Alle Preise inkl. gesetzlicher Mehrwertsteuer.</p>
        </fieldset>
      </details>
      <div>
        <label className={labelClass} htmlFor="termin-description">Nachricht</label>
        <textarea id="termin-description" name="description" rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand ..." />
      </div>
    </>
  );
};

export default TerminFelder;
