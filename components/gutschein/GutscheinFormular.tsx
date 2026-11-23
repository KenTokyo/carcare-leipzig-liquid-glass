import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Gift, Minus, Plus, Send, Truck } from 'lucide-react';
import {
  GUTSCHEIN_ART, GUTSCHEIN_BETRAG_MAX, GUTSCHEIN_BETRAG_MIN, GUTSCHEIN_HINWEIS_ABLAUF, GUTSCHEIN_MAX_ANZAHL,
  GUTSCHEIN_PAKETE, adresseZeilen, auswahlText, betragAlsZahl, euro, leereEingabe, schrittFehler,
  type GutscheinAdresse, type GutscheinEingabe, type GutscheinPaketId,
} from '../../data/gutschein';
import { HONIGTOPF } from '../../data/anfrageSchema';
import { useVersandBereitschaft } from '../../hooks/useVersandBereitschaft';
import { inputClass, labelClass } from '../formulare/felder';

/**
 * Gutscheinanfrage in vier Schritten (OA-14): Auswahl → Rechnung → Versand → Uebersicht & Absenden.
 * Pruefregeln aus `data/gutschein.ts` (dieselben wie auf dem Server). Rechnung und Zahlung laufen nicht ueber die Website.
 */

const SCHRITTE = ['Gutschein', 'Rechnung', 'Versand', 'Übersicht'] as const;
type Schritt = 1 | 2 | 3 | 4;

const Feld: React.FC<{
  id: string; label: string; wert: string; onWert: (w: string) => void; optional?: boolean;
  typ?: string; auto?: string; modus?: React.HTMLAttributes<HTMLInputElement>['inputMode']; breit?: boolean; platzhalter?: string;
}> = ({ id, label, wert, onWert, optional, typ = 'text', auto, modus, breit, platzhalter }) => (
  <div className={breit ? 'sm:col-span-2' : undefined}>
    <label className={labelClass} htmlFor={id}>
      {label}
      {optional && <span className="ml-1 font-medium normal-case tracking-normal text-gray-500">(optional)</span>}
    </label>
    <input
      id={id} type={typ} value={wert} onChange={(e) => onWert(e.target.value)} required={!optional}
      autoComplete={auto} inputMode={modus} placeholder={platzhalter} className={inputClass}
    />
  </div>
);

const AdressFelder: React.FC<{ praefix: string; adresse: GutscheinAdresse; onFeld: (f: keyof GutscheinAdresse, w: string) => void; versand?: boolean }> = ({
  praefix, adresse, onFeld, versand,
}) => {
  const auto = versand ? 'shipping' : 'billing';
  return (
    <>
      <Feld id={`${praefix}-name`} label="Vor- und Nachname" wert={adresse.name} onWert={(w) => onFeld('name', w)} auto={`${auto} name`} breit />
      <Feld id={`${praefix}-firma`} label="Firma" wert={adresse.firma} onWert={(w) => onFeld('firma', w)} optional auto={`${auto} organization`} breit />
      <Feld id={`${praefix}-strasse`} label="Straße und Hausnummer" wert={adresse.strasse} onWert={(w) => onFeld('strasse', w)} auto={`${auto} street-address`} breit />
      <Feld id={`${praefix}-plz`} label="PLZ" wert={adresse.plz} onWert={(w) => onFeld('plz', w.replace(/\D/g, '').slice(0, 5))} auto={`${auto} postal-code`} modus="numeric" />
      <Feld id={`${praefix}-ort`} label="Ort" wert={adresse.ort} onWert={(w) => onFeld('ort', w)} auto={`${auto} address-level2`} />
    </>
  );
};

const Zaehler: React.FC<{ label: string; anzahl: number; onAnzahl: (n: number) => void }> = ({ label, anzahl, onAnzahl }) => {
  const aktiv = anzahl > 0;
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${aktiv ? 'border-blue-300 bg-blue-50/60' : 'border-gray-200 bg-white'}`}>
      <span className="min-w-0 flex-1 text-sm font-bold leading-tight text-gray-950">{label}</span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button" onClick={() => onAnzahl(Math.max(0, anzahl - 1))} disabled={!aktiv} aria-label={`${label}: einen weniger`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-950 hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-700"
        >
          <Minus size={15} />
        </button>
        <span aria-live="polite" className="w-8 text-center text-base font-bold tabular-nums text-gray-950">{anzahl}</span>
        <button
          type="button" onClick={() => onAnzahl(Math.min(GUTSCHEIN_MAX_ANZAHL, anzahl + 1))} disabled={anzahl >= GUTSCHEIN_MAX_ANZAHL}
          aria-label={`${label}: einen mehr`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-950 hover:text-white disabled:opacity-40"
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
};

const Uebersicht: React.FC<{ titel: string; zeilen: string[]; onAendern: () => void }> = ({ titel, zeilen, onAendern }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4">
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">{titel}</span>
      <button type="button" onClick={onAendern} className="text-xs font-bold text-blue-600 underline-offset-2 hover:underline">Ändern</button>
    </div>
    {zeilen.map((z, i) => <p key={i} className="text-sm leading-relaxed text-gray-950">{z}</p>)}
  </div>
);

const GutscheinFormular: React.FC = () => {
  const [schritt, setSchritt] = useState<Schritt>(1);
  const [richtung, setRichtung] = useState(1);
  const [eingabe, setEingabe] = useState<GutscheinEingabe>(leereEingabe);
  const [fehler, setFehler] = useState<string[]>([]);
  const [honigtopf, setHonigtopf] = useState('');
  const [sendet, setSendet] = useState(false);
  const [ergebnis, setErgebnis] = useState<{ vorgang: string; bestaetigung: boolean } | null>(null);
  const { ready: bereit, disable } = useVersandBereitschaft();

  const setze = (teil: Partial<GutscheinEingabe>) => { setFehler([]); setEingabe((e) => ({ ...e, ...teil })); };
  const setzeAdresse = (wo: 'rechnung' | 'versand', feld: string, wert: string) => {
    setFehler([]);
    setEingabe((e) => ({ ...e, [wo]: { ...e[wo], [feld]: wert } }));
  };
  const gehe = (ziel: Schritt) => { setRichtung(ziel > schritt ? 1 : -1); setFehler([]); setSchritt(ziel); };
  const weiter = () => {
    const f = schrittFehler(eingabe, schritt);
    if (f.length) { setFehler(f); return; }
    gehe((schritt + 1) as Schritt);
  };

  const absenden = async () => {
    const f = ([1, 2, 3, 4] as const).flatMap((s) => schrittFehler(eingabe, s));
    if (f.length) { setFehler(f); return; }
    if (!bereit || sendet) return;
    setSendet(true);
    setFehler([]);
    try {
      const antwort = await fetch('/api/anfrage', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ art: GUTSCHEIN_ART, daten: { ...eingabe, [HONIGTOPF]: honigtopf } }),
        signal: AbortSignal.timeout(35_000),
      });
      const inhalt = await antwort.json().catch(() => ({}));
      if (!antwort.ok) {
        if (antwort.status === 503) disable();
        setFehler([inhalt?.fehler ?? 'Die Anfrage konnte nicht versendet werden. Bitte rufen Sie uns an: 0341 - 261 77 90.']);
        return;
      }
      if (inhalt?.ok !== true || typeof inhalt?.vorgang !== 'string') {
        setFehler(['Der Versand wurde nicht bestätigt. Bitte kontaktieren Sie uns direkt per E-Mail.']);
        return;
      }
      setErgebnis({ vorgang: inhalt.vorgang, bestaetigung: inhalt.bestaetigung !== false });
    } catch {
      setFehler(['Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung, oder rufen Sie uns unter 0341 - 261 77 90 an.']);
    } finally {
      setSendet(false);
    }
  };

  if (ergebnis) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="text-center">
        <motion.div
          initial={{ scale: 0.4, rotate: -12 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.08 }}
          className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white"
        >
          <CheckCircle2 size={28} />
        </motion.div>
        <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-950">Vielen Dank, Ihre Anfrage ist da.</h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600 md:text-base">
          {GUTSCHEIN_HINWEIS_ABLAUF}{' '}
          {ergebnis.bestaetigung
            ? <>Eine Bestätigung ist unterwegs an <span className="font-semibold text-gray-950">{eingabe.rechnung.email}</span>.</>
            : 'Die Bestätigung per E-Mail kommt etwas später, Ihre Anfrage liegt uns aber vor.'}
        </p>
        <div className="mx-auto mt-6 max-w-xs rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">Ihre Vorgangsnummer</p>
          <p className="mt-1 font-mono text-lg font-bold tracking-wide text-gray-950">{ergebnis.vorgang}</p>
        </div>
      </motion.div>
    );
  }

  const r = eingabe.rechnung;
  const betragZahl = betragAlsZahl(eingabe.betrag);
  const auswahlZeile = auswahlText({
    auswahl: eingabe.auswahl,
    betrag: Number.isFinite(betragZahl) ? betragZahl : null,
    pakete: GUTSCHEIN_PAKETE.filter((p) => (eingabe.pakete[p.id] ?? 0) > 0).map((p) => ({ id: p.id, label: p.label, anzahl: eingabe.pakete[p.id]! })),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (schritt < 4) weiter(); else void absenden(); }} noValidate className="relative">
      {/* Fortschritt: vier Stufen, die erreichte Linie fuellt sich. */}
      <ol className="mb-7 grid grid-cols-4 gap-2" aria-label="Fortschritt">
        {SCHRITTE.map((name, i) => {
          const nr = (i + 1) as Schritt;
          const erreicht = nr <= schritt;
          return (
            <li key={name} aria-current={nr === schritt ? 'step' : undefined}>
              <div className="h-1 overflow-hidden rounded-full bg-gray-200">
                <motion.div className="h-full rounded-full bg-blue-600" initial={false} animate={{ width: erreicht ? '100%' : '0%' }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
              </div>
              <span className={`mt-2 block text-[10px] font-bold uppercase tracking-[0.14em] ${erreicht ? 'text-gray-950' : 'text-gray-500'}`}>
                <span className="tabular-nums">{nr}</span> {name}
              </span>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait" initial={false} custom={richtung}>
        <motion.div
          key={schritt}
          custom={richtung}
          initial={{ opacity: 0, x: richtung * 28, filter: 'blur(4px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: richtung * -20, filter: 'blur(3px)' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {schritt === 1 && (
            <fieldset>
              <legend className="mb-4 text-lg font-bold text-gray-950">Welchen Gutschein möchten Sie verschenken?</legend>
              <div role="radiogroup" aria-label="Art des Gutscheins" className="mb-5 grid grid-cols-2 gap-2 rounded-full border border-gray-200 bg-white p-1">
                {(['paket', 'betrag'] as const).map((art) => (
                  <button
                    key={art} type="button" role="radio" aria-checked={eingabe.auswahl === art} onClick={() => setze({ auswahl: art })}
                    className={`relative min-h-11 rounded-full px-4 text-sm font-bold transition-colors ${eingabe.auswahl === art ? 'text-white' : 'text-gray-700 hover:text-gray-950'}`}
                  >
                    {eingabe.auswahl === art && <motion.span layoutId="gutschein-art" className="absolute inset-0 rounded-full bg-gray-950" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="relative">{art === 'paket' ? 'Paket' : 'Geldbetrag'}</span>
                  </button>
                ))}
              </div>
              {eingabe.auswahl === 'paket' ? (
                <div className="space-y-2.5">
                  {GUTSCHEIN_PAKETE.map((p) => (
                    <Zaehler
                      key={p.id} label={p.label} anzahl={eingabe.pakete[p.id] ?? 0}
                      onAnzahl={(n) => setze({ pakete: { ...eingabe.pakete, [p.id as GutscheinPaketId]: n } })}
                    />
                  ))}
                  <p className="pt-1 text-xs leading-relaxed text-gray-600">Mehrere Pakete und mehrere Gutscheine je Paket sind möglich.</p>
                </div>
              ) : (
                <div>
                  <label className={labelClass} htmlFor="gutschein-betrag">Betrag in Euro</label>
                  <div className="relative">
                    <input
                      id="gutschein-betrag" inputMode="decimal" value={eingabe.betrag} required placeholder={"z.\u00a0B. 100"}
                      onChange={(e) => setze({ betrag: e.target.value.replace(/[^\d,.]/g, '').slice(0, 8) })}
                      className={`${inputClass} pr-10 text-lg font-bold`}
                    />
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-500">€</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">Von {euro(GUTSCHEIN_BETRAG_MIN)} bis {euro(GUTSCHEIN_BETRAG_MAX)}, frei einlösbar für unsere Leistungen.</p>
                </div>
              )}
            </fieldset>
          )}

          {schritt === 2 && (
            <fieldset>
              <legend className="mb-4 text-lg font-bold text-gray-950">An wen geht die Rechnung?</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AdressFelder praefix="gutschein-rechnung" adresse={r} onFeld={(f, w) => setzeAdresse('rechnung', f, w)} />
                <Feld id="gutschein-email" label="E-Mail" typ="email" wert={r.email} onWert={(w) => setzeAdresse('rechnung', 'email', w)} auto="email" modus="email" />
                <Feld id="gutschein-telefon" label="Telefon" typ="tel" wert={r.telefon} onWert={(w) => setzeAdresse('rechnung', 'telefon', w)} auto="tel" modus="tel" />
              </div>
            </fieldset>
          )}

          {schritt === 3 && (
            <fieldset>
              <legend className="mb-4 text-lg font-bold text-gray-950">Wohin schicken wir den Gutschein?</legend>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-4">
                <input
                  type="checkbox" checked={eingabe.versandGleich} onChange={(e) => setze({ versandGleich: e.target.checked })}
                  className="h-5 w-5 shrink-0 accent-blue-600"
                />
                <span className="text-sm font-bold text-gray-950">Wie Rechnungsadresse</span>
              </label>
              <AnimatePresence initial={false}>
                {!eingabe.versandGleich && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden"
                  >
                    <p className="pb-4 pt-4 text-sm leading-relaxed text-gray-600">Zum Beispiel direkt an die beschenkte Person.</p>
                    <div className="grid grid-cols-1 gap-4 pb-1 sm:grid-cols-2">
                      <AdressFelder praefix="gutschein-versand" adresse={eingabe.versand} onFeld={(f, w) => setzeAdresse('versand', f, w)} versand />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </fieldset>
          )}

          {schritt === 4 && (
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-950">Alles richtig?</h3>
              <div className="space-y-2.5">
                <Uebersicht titel="Gutschein" zeilen={[auswahlZeile]} onAendern={() => gehe(1)} />
                <Uebersicht titel="Rechnungsadresse" zeilen={[...adresseZeilen(r), r.email, r.telefon]} onAendern={() => gehe(2)} />
                <Uebersicht titel="Versandadresse" zeilen={eingabe.versandGleich ? ['Wie Rechnungsadresse'] : adresseZeilen(eingabe.versand)} onAendern={() => gehe(3)} />
              </div>
              <div className="mt-4 space-y-2 rounded-2xl bg-gray-950 p-4 text-white">
                <p className="flex items-center gap-2 text-sm font-bold"><Truck size={16} className="text-blue-300" /> Versandkostenfrei</p>
                <p className="text-sm leading-relaxed text-gray-300">{GUTSCHEIN_HINWEIS_ABLAUF}</p>
              </div>
              <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-gray-700">
                <input
                  type="checkbox" required checked={eingabe.einwilligung} onChange={(e) => setze({ einwilligung: e.target.checked })}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-blue-600"
                />
                <span>
                  Ich bin einverstanden, dass das CarCare Center meine Angaben zur Bearbeitung dieser Gutscheinanfrage verwendet.
                  Mehr dazu in der <a href="/datenschutz" target="_blank" rel="noopener" className="font-semibold text-gray-950 underline">Datenschutzerklärung</a>.
                </span>
              </label>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor={`gutschein-${HONIGTOPF}`}>Bitte nicht ausfüllen</label>
        <input id={`gutschein-${HONIGTOPF}`} name={HONIGTOPF} type="text" tabIndex={-1} autoComplete="off" value={honigtopf} onChange={(e) => setHonigtopf(e.target.value)} />
      </div>

      {fehler.length > 0 && (
        <motion.ul role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-1 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900">
          {fehler.map((f) => <li key={f}>{f}</li>)}
        </motion.ul>
      )}

      {schritt === 4 && !bereit && (
        <p className="mt-4 text-xs leading-relaxed text-gray-700">
          Der Online-Versand ist gerade nicht erreichbar. Gutscheine erhalten Sie auch unter{' '}
          <a href="tel:+493412617790" className="font-semibold text-gray-950 underline">0341 - 261 77 90</a> oder{' '}
          <a href="mailto:info@carcare-center.de" className="font-semibold text-gray-950 underline">info@carcare-center.de</a>.
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        {schritt > 1 && (
          <button
            type="button" onClick={() => gehe((schritt - 1) as Schritt)}
            className="inline-flex min-h-12 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-950 hover:text-white"
          >
            <ArrowLeft size={15} /> Zurück
          </button>
        )}
        <button
          type="submit" disabled={schritt === 4 && (!bereit || sendet)}
          className="cc-gradient-button group ml-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-7 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {schritt < 4 ? (
            <>Weiter <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" /></>
          ) : sendet ? 'Wird gesendet …' : (
            <><Send size={15} /> Gutschein anfragen</>
          )}
        </button>
      </div>
    </form>
  );
};

export const GutscheinKopf: React.FC = () => (
  <div className="mb-6 pr-12">
    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
      <Gift size={14} className="text-blue-600" />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">Gutschein</span>
    </div>
    <h2 className="text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-3xl">Gutschein anfragen</h2>
  </div>
);

export default GutscheinFormular;
