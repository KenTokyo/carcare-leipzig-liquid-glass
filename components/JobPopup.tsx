import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, X } from 'lucide-react';
import { STELLEN_POPUP_AKTIV, offeneAusbildungen, offeneBerufe, offeneStellen, offeneStellenKicker, stellenTitel } from '../data/jobs';

/**
 * Pop-up mit den offenen Stellen auf `/karriere` (Backlog 1.23).
 *
 * EIN SCHALTER, EIN ORT: `STELLEN_POPUP_AKTIV` in `data/jobs.ts`. Auf `false`
 * verschwindet es vollstaendig — niemand muss Markup anfassen oder Bedingungen suchen.
 * Standard ist `true`, wie abgestimmt.
 *
 * DREI DINGE, DIE EIN POP-UP AUF EINER KUNDENSEITE NICHT DARF, und wie sie hier
 * geloest sind:
 *
 *  1. NERVEN. Es erscheint bei jedem Aufruf der Karriereseite einmal. Wer es schliesst,
 *     sieht es erst beim naechsten Aufruf wieder; gespeichert wird dabei nichts.
 *     BIS 2026-09-28 merkte es sich das Schliessen fuer die ganze Sitzung (`sessionStorage`).
 *     Wer es bei einer Durchsicht einmal geschlossen hatte, sah es im selben Tab nie wieder,
 *     auch nicht die Neugestaltung aus 6.15, und hielt es fuer entfernt (Rueckmeldung des
 *     Users am 28.09.). Auf der Karriereseite sind die offenen Stellen der Grund des Besuchs;
 *     einmal je Aufruf nervt dort nicht.
 *  2. DEN WEG VERSTELLEN. Es sitzt unten rechts und ist schmal; auf Mobile unten mit
 *     Abstand zur festen Aktionsleiste. Kein Vollbild-Overlay, keine Sperre des
 *     Hintergrunds — die Seite bleibt bedienbar.
 *  3. NICHT WEGGEHEN. Schliessen per Knopf UND per Escape. Der Schliessknopf bekommt
 *     beim Erscheinen den Fokus, damit Tastaturnutzer nicht erst durch die Seite
 *     wandern muessen.
 *
 * WARUM PORTAL UND NICHT EINFACH `position: fixed`: `.site-main-shell` traegt
 * `transform: translateZ(0)` (index.css). Ein Transform macht das Element zum
 * Bezugsrahmen fuer `fixed` — das Pop-up klebte damit an `<main>` statt am Viewport und
 * war ausserhalb des sichtbaren Bereichs. Empirisch belegt: im DOM vorhanden, im
 * Screenshot nicht zu sehen. `MobileStickyCTA` umgeht das, indem es in `Layout` neben
 * `<main>` steht; hier tut es ein Portal an `document.body`.
 *
 * NICHT IM VORGERENDERTEN HTML: Es erscheint erst nach einer Verzoegerung im Client.
 * Damit taucht es weder im Snapshot noch bei Crawlern auf — eine Stellenanzeige, die
 * im statischen HTML steht, wuerde dort als Seiteninhalt gelesen.
 */

/**
 * Backlog 6.15 (Meeting 2026-09-28): die offenen Stellen prominenter. Deshalb frueher (1,2 statt 2,6 s) — wer die
 * Karriereseite oeffnet, sucht genau das. Seit 28.09. abends bei jedem Aufruf, siehe Punkt 1 oben.
 */
const VERZOEGERUNG_MS = 1200;

/**
 * Beginn, den ALLE offenen Ausbildungsplaetze teilen — dann steht er einmal in der Zwischenzeile. Weichen sie ab
 * (Bürokaufmann/-frau hat keinen), steht er je Platz: Sonst laese sich „Beginn Sommer 2027“ auch fuer den Platz
 * ohne Angabe.
 */
const gemeinsamerBeginn =
  offeneAusbildungen.length > 0 && offeneAusbildungen.every((job) => job.hinweis === offeneAusbildungen[0].hinweis)
    ? offeneAusbildungen[0].hinweis
    : undefined;

interface JobPopupProps {
  /** Ziel des Handlungsaufrufs. */
  href: string;
}

const JobPopup: React.FC<JobPopupProps> = ({ href }) => {
  const [sichtbar, setSichtbar] = useState(false);
  const schliessenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!STELLEN_POPUP_AKTIV || offeneStellen.length === 0) return;
    const timer = window.setTimeout(() => setSichtbar(true), VERZOEGERUNG_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Nur fuer diesen Aufruf: Beim naechsten Oeffnen der Karriereseite ist es wieder da (Punkt 1 oben).
  const schliessen = () => setSichtbar(false);

  useEffect(() => {
    if (!sichtbar) return;
    schliessenRef.current?.focus();
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') schliessen();
    };
    window.addEventListener('keydown', beiTaste);
    return () => window.removeEventListener('keydown', beiTaste);
  }, [sichtbar]);

  if (!STELLEN_POPUP_AKTIV || offeneStellen.length === 0) return null;

  return createPortal(
    <AnimatePresence>
      {sichtbar && (
        <motion.aside
          role="dialog"
          aria-label="Offene Stellen"
          // Backlog 6.15: faehrt von rechts ein und federt leicht nach — sichtbar, ohne zu springen.
          initial={{ opacity: 0, x: 48, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 32 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          // `bottom-28` auf Mobile: darueber sitzt die feste Aktionsleiste
          // (MobileStickyCTA). Ohne den Abstand laegen zwei Elemente uebereinander.
          className="fixed bottom-28 left-4 right-4 z-40 overflow-hidden rounded-2xl bg-white shadow-[0_32px_70px_-24px_rgb(var(--cc-carbon-rgb)/0.55)] ring-1 ring-gray-200 sm:left-auto sm:right-6 sm:w-[380px] lg:bottom-6"
        >
          {/*
            BACKLOG 6.15 — PROMINENTER: Kopf im CTA-Verlauf (`.cc-gradient-fill`, derselbe wie „Schaden melden")
            mit Symbol, Zaehler und Ueberschrift; darunter die Stellen einzeln und fett, Ausbildung getrennt mit
            Beginn. Weisse Schrift auf dem Verlauf: gleiche Flaeche wie die CTA-Knoepfe, dort gemessen AA.
            Der Ring um das Symbol pulsiert dreimal und steht dann — Aufmerksamkeit beim Erscheinen, keine Dauerbewegung.
          */}
          <div className="cc-gradient-fill relative px-5 pb-5 pt-5">
            <button
              ref={schliessenRef}
              type="button"
              onClick={schliessen}
              aria-label="Hinweis zu offenen Stellen schließen"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={17} />
            </button>
            <div className="flex items-center gap-3 pr-10">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-xl ring-2 ring-white/70"
                  initial={{ opacity: 0.9, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.45 }}
                  transition={{ duration: 1.1, repeat: 2, ease: 'easeOut', delay: 0.35 }}
                />
                <BriefcaseBusiness size={20} />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/85">{offeneStellenKicker()}</p>
                <p className="mt-1 text-xl font-bold leading-tight tracking-tight text-white">Wir suchen Verstärkung.</p>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            {offeneBerufe.length > 0 && (
              <ul className="space-y-1.5">
                {offeneBerufe.map((job) => (
                  <li key={job.id} className="flex items-center gap-2 text-[15px] font-bold leading-snug text-gray-950">
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                    {stellenTitel(job)}
                  </li>
                ))}
              </ul>
            )}
            {/* Backlog 5.26: Ausbildungsplaetze als solche kenntlich, sonst stuende „Fahrzeuglackierer/in"
                ohne Erklaerung neben „Fahrzeuglackierer". */}
            {offeneAusbildungen.length > 0 && (
              <>
                <p className={`${offeneBerufe.length ? 'mt-4' : ''} text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600`}>
                  Ausbildung{gemeinsamerBeginn ? ` · ${gemeinsamerBeginn}` : ''}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {offeneAusbildungen.map((job) => (
                    <li key={job.id} className="flex items-center gap-2 text-sm font-semibold leading-snug text-gray-800">
                      <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                      {stellenTitel(job)}
                      {!gemeinsamerBeginn && job.hinweis && `, ${job.hinweis}`}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <a
              href={href}
              onClick={schliessen}
              className="cc-gradient-button mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-bold text-white"
            >
              Jetzt bewerben
              <ArrowRight size={15} />
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default JobPopup;
