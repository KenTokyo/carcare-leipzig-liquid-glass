import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { STELLEN_POPUP_AKTIV, offeneStellen } from '../data/jobs';

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
 *  1. NERVEN. Es erscheint einmal je Sitzung. Wer es schliesst, sieht es bis zum
 *     naechsten Besuch nicht wieder (`sessionStorage`). Bewusst NICHT `localStorage`:
 *     Ein halbes Jahr Stille waere fuer eine Stellenanzeige zu lang.
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

const VERZOEGERUNG_MS = 2600;
const SPEICHER_SCHLUESSEL = 'cc-stellen-popup-geschlossen';

interface JobPopupProps {
  /** Ziel des Handlungsaufrufs. */
  href: string;
}

const JobPopup: React.FC<JobPopupProps> = ({ href }) => {
  const [sichtbar, setSichtbar] = useState(false);
  const schliessenRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!STELLEN_POPUP_AKTIV || offeneStellen.length === 0) return;
    // Zugriff gekapselt: In privaten Fenstern und bei blockierten Site-Daten wirft
    // sessionStorage, statt nur leer zu sein.
    try {
      if (window.sessionStorage.getItem(SPEICHER_SCHLUESSEL) === '1') return;
    } catch {
      /* kein Speicher verfuegbar - dann eben ohne Gedaechtnis */
    }
    const timer = window.setTimeout(() => setSichtbar(true), VERZOEGERUNG_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const schliessen = () => {
    setSichtbar(false);
    try {
      window.sessionStorage.setItem(SPEICHER_SCHLUESSEL, '1');
    } catch {
      /* siehe oben */
    }
  };

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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          // `bottom-28` auf Mobile: darueber sitzt die feste Aktionsleiste
          // (MobileStickyCTA). Ohne den Abstand laegen zwei Elemente uebereinander.
          className="fixed bottom-28 left-4 right-4 z-40 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_28px_60px_-24px_rgb(var(--cc-carbon-rgb)/0.45)] sm:left-auto sm:right-6 sm:w-[340px] lg:bottom-6"
        >
          <button
            ref={schliessenRef}
            type="button"
            onClick={schliessen}
            aria-label="Hinweis zu offenen Stellen schließen"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X size={16} />
          </button>

          <p className="pr-8 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-600">
            {offeneStellen.length === 1 ? 'Eine offene Stelle' : `${offeneStellen.length} offene Stellen`}
          </p>
          <p className="mt-2 text-base font-bold leading-tight tracking-tight text-gray-950">
            Wir suchen Verstärkung.
          </p>
          <ul className="mt-3 space-y-1.5">
            {offeneStellen.map((job) => (
              <li key={job.id} className="flex gap-2 text-sm leading-snug text-gray-600">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                {job.title}
              </li>
            ))}
          </ul>
          <a
            href={href}
            onClick={schliessen}
            className="cc-gradient-button mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-white"
          >
            Bewerbung starten
            <ArrowRight size={15} />
          </a>
        </motion.aside>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default JobPopup;
