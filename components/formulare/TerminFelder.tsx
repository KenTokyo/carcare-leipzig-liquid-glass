import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { NUR_ZUSATZ, terminLeistungen } from '../../data/leistungsauswahl';
import { ANDERE_MARKE, ANDERES_MODELL, markenListe, modelleVon } from '../../data/fahrzeugmarken';
import { enthaeltDummies, zusatzleistungen } from '../../data/zusatzleistungen';
import {
  FEHLT_ZUSATZLEISTUNG,
  festAngehakt,
  fehltZusatzleistung,
  hinweisVorDerWahl,
  istZusatzAlsLeistung,
  paketHinweis,
  sperrgrund,
} from '../../data/zusatzregeln';
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
  /** Beim letzten Wechsel der Leistung herausgefallene Zusatzleistungen, mit Grund (6.7, `RequestForm`). */
  abgewaehlt: { id: string; label: string; grund: string }[];
}

/** „Nur zusammen mit …“ mitten im Satz: erster Buchstabe klein. */
const imSatz = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const TerminFelder: React.FC<TerminFelderProps> = ({ werte, onChange, onZusatzleistung, abgewaehlt }) => {
  // `?? []`: Beim Reiterwechsel laeuft genau ein Renderdurchlauf mit den Werten der VORHERIGEN
  // Variante, in denen es dieses Feld nicht gibt. Siehe die Begruendung am Variantenwechsel.
  const gewaehlteZusaetze = werte.zusatzleistungen ?? [];
  const leistung = werte.service ?? '';
  // Aufklappliste offen, wenn schon etwas gewaehlt ist — etwa ueber die Preiskachel „Keramikversiegelung“.
  const [zusaetzeOffen, setZusaetzeOffen] = useState(() => gewaehlteZusaetze.length > 0);
  const gewaehlteNamen = zusatzleistungen.filter((z) => gewaehlteZusaetze.includes(z.id)).map((z) => z.label);
  /*
   * „NUR ZUSATZLEISTUNGEN“ OHNE KAESTCHEN (6.7) ist keine Anfrage. Die Meldung haengt als Gueltigkeit am Auswahlfeld:
   * Der Browser haelt das Absenden an, zeigt sie dort und sagt sie an — wie bei jedem Pflichtfeld, ohne eigene
   * Fehlerlogik. Am Auswahlfeld und nicht am ersten Kaestchen, weil die Liste zugeklappt sein kann; ein unsichtbares
   * ungueltiges Feld blockiert das Absenden ohne jede Meldung. Verbindlich prueft `api/anfrage.ts` dasselbe.
   */
  const leistungFeld = useRef<HTMLSelectElement>(null);
  const fehltZusatz = fehltZusatzleistung(leistung, gewaehlteZusaetze);
  // Versiegelung als Leistung (6.6, seit 2026-10-03): Andres Regel unter der Auswahl, sonst laese der Kunde
  // „Keramikversiegelung“ als vollstaendige Buchung. Ohne Versiegelung kein Hinweis und kein `aria-describedby`.
  const hinweisZumPaket = paketHinweis(leistung);
  useEffect(() => {
    leistungFeld.current?.setCustomValidity(fehltZusatz ? FEHLT_ZUSATZLEISTUNG : '');
  }, [fehltZusatz]);
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
        <input id="termin-name" name="name" required autoComplete="name" value={werte.name} onChange={onChange} className={inputClass} placeholder="Max" />
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
            placeholder="0341 - …"
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
          Telefon oder E-Mail genügt. Eine der beiden Angaben brauchen wir, um uns bei Ihnen zu melden.
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
            <input id="termin-modell-frei" name="modellFrei" value={werte.modellFrei ?? ''} onChange={onChange} className={inputClass} placeholder="z. B. Lynk & Co 01" />
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
            <input id="termin-modell-anderes" name="modellFrei" value={werte.modellFrei ?? ''} onChange={onChange} className={inputClass} placeholder="z. B. Golf Sportsvan" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="termin-service">Gewünschte Leistung</label>
          {/* Optionen aus `data/leistungsauswahl.ts` — dieselbe Quelle, aus der
              die Vorauswahl abgeleitet wird (1.19). Seit 2026-09-28 Pflicht. „Nur Zusatzleistungen“ (6.7) klappt
              die Liste darunter auf: Dort wird jetzt gewaehlt. Eine Versiegelung als Leistung (6.6, seit 2026-10-03)
              ebenso: Dort steht sie fest angehakt, mit ihrem Preis. */}
          <select
            ref={leistungFeld}
            id="termin-service"
            name="service"
            required
            value={werte.service}
            aria-describedby={hinweisZumPaket ? 'termin-service-hinweis' : undefined}
            onChange={(e) => {
              onChange(e);
              if (e.target.value === NUR_ZUSATZ || istZusatzAlsLeistung(e.target.value)) setZusaetzeOffen(true);
            }}
            className={inputClass}
          >
            <option value="">Bitte wählen</option>
            {terminLeistungen.map((leistung) => (
              <option key={leistung.id} value={leistung.id}>{leistung.label}</option>
            ))}
          </select>
          {hinweisZumPaket && (
            <p id="termin-service-hinweis" className="mt-2 text-[11px] leading-relaxed text-gray-600">
              {hinweisZumPaket}
            </p>
          )}
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

        BUCHUNGSREGELN (6.7, Andres Liste, Auswertung in `data/zusatzregeln.ts`): Solange keine Leistung gewaehlt ist,
        nennen eingeschraenkte Zusatzleistungen ihre Bedingung als Hinweis, statt gesperrt zu sein — die Preiskachel
        hakt sie an, bevor das Paket feststeht. Faellt beim Wechsel der Leistung etwas heraus, sagt der Hinweis ueber
        der Liste, was und warum: Bei zugeklappter Liste verschwaende es sonst unbemerkt.
      */}
      <p
        role="status"
        className={abgewaehlt.length ? 'rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-relaxed text-gray-800' : 'sr-only'}
      >
        {abgewaehlt.length > 0 &&
          `Abgewählt: ${abgewaehlt.map((a) => (a.grund ? `${a.label} (${imSatz(a.grund)})` : a.label)).join(', ')}.`}
      </p>
      <details
        open={zusaetzeOffen}
        onToggle={(e) => setZusaetzeOffen(e.currentTarget.open)}
        className="group rounded-xl border border-gray-200"
      >
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 py-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0">
            <span className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
              {leistung === NUR_ZUSATZ ? 'Zusatzleistungen (mindestens eine)' : 'Zusatzleistungen (freiwillig)'}
            </span>
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
          {fehltZusatz && (
            <p className="mb-3 text-[11px] font-semibold leading-relaxed text-gray-800">{FEHLT_ZUSATZLEISTUNG}</p>
          )}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {zusatzleistungen.map((zusatz) => {
              // Fest angehakt (Zustand 4): Die Zusatzleistung IST die gewaehlte Leistung. Inaktiv wie ein gesperrtes
              // Kaestchen, aber angehakt und blau wie ein gewaehltes; der Satz darunter sagt, warum.
              const fest = festAngehakt(zusatz, leistung);
              const gewaehlt = fest || gewaehlteZusaetze.includes(zusatz.id);
              const grund = sperrgrund(zusatz, leistung, gewaehlteZusaetze);
              const hinweis = fest ? 'Als gewünschte Leistung gewählt' : grund ? null : hinweisVorDerWahl(zusatz, leistung);
              return (
                <label
                  key={zusatz.id}
                  htmlFor={`termin-${zusatz.id}`}
                  className={`flex min-h-12 gap-3 rounded-lg border p-3 transition-colors ${
                    grund
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50'
                      : fest
                        ? 'cursor-default border-blue-600 bg-blue-50'
                        : gewaehlt
                          ? 'cursor-pointer border-blue-600 bg-blue-50'
                        : 'cursor-pointer border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <input
                    id={`termin-${zusatz.id}`}
                    type="checkbox"
                    name="zusatzleistungen"
                    value={zusatz.id}
                    checked={gewaehlt}
                    disabled={Boolean(grund) || fest}
                    onChange={(e) => onZusatzleistung(zusatz.id, e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`flex items-baseline justify-between gap-2 ${grund ? 'opacity-60' : ''}`}>
                      <span className="min-w-0 hyphens-auto break-words text-sm font-semibold text-gray-950">{zusatz.label}</span>
                      <span className="shrink-0 text-xs font-bold text-gray-700">{zusatz.preis}</span>
                    </span>
                    {grund && <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-700">{grund}</span>}
                    {hinweis && <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-600">{hinweis}</span>}
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
        <textarea id="termin-description" name="description" rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand …" />
      </div>
    </>
  );
};

export default TerminFelder;
