import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gift, Truck, X } from 'lucide-react';
import { getLenis } from '../../hooks/useSmoothScroll';
import { PRELOADER_HTML_CLASS } from '../../hooks/usePreloader';
import GutscheinFormular, { GutscheinKopf } from './GutscheinFormular';

/**
 * Gutscheinaktion (OA-14): Begruessungs-Pop-up, Anfragefenster und Ausloeser `#gutschein`.
 *
 * - Einmal in `Layout`; jeder Link mit `#gutschein` oeffnet das Fenster (wie `ANFRAGE_ZIELE` im Anfrage-Dialog).
 * - Pop-up erscheint nach dem Preloader mit kurzer Pause; geschlossen bleibt es `HINWEIS_PAUSE_TAGE` weg
 *   (`localStorage`), auch ueber Seitenwechsel und neue Besuche; `?gutschein-hinweis` zeigt es trotzdem. Nie auf Rechtsseiten, nie im Prerender/Pruefbrowser
 *   (`navigator.webdriver`, wie `useOeffnungsStatus`), sonst stuende es in Messungen und im Suchindex.
 * - Portal an `body`: `.site-main-shell` traegt einen Transform (siehe `AnfrageDialog.tsx`).
 */

const HINWEIS_SCHLUESSEL = 'cc-gutschein-hinweis-v1';
const HINWEIS_PAUSE_TAGE = 14;
const HINWEIS_VERZOEGERUNG_MS = 1800;
const OHNE_HINWEIS = ['/datenschutz', '/impressum', '/kontakt'];
export const GUTSCHEIN_ZIEL = '#gutschein';
export const GUTSCHEIN_BILD = '/assets/galerie/politur-finish-lackglanz-leipzig-carcare.webp';

const FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
const KURVE = [0.22, 1, 0.36, 1] as const;

interface GutscheinWerte { oeffnen: () => void }
const GutscheinContext = createContext<GutscheinWerte | null>(null);
export const useGutschein = () => useContext(GutscheinContext);

const hinweisGesehen = () => {
  try {
    const zeit = Number(localStorage.getItem(HINWEIS_SCHLUESSEL));
    return Number.isFinite(zeit) && zeit > 0 && Date.now() - zeit < HINWEIS_PAUSE_TAGE * 86_400_000;
  } catch { return true; }
};
const hinweisMerken = () => { try { localStorage.setItem(HINWEIS_SCHLUESSEL, String(Date.now())); } catch { /* privat */ } };

/** Sperrt Scrollen und Lenis, haelt den Fokus im Panel, Escape schliesst. */
const useModal = (offen: boolean, panel: React.RefObject<HTMLElement | null>, schliessen: () => void) => {
  useEffect(() => {
    if (!offen) return;
    const ausloeser = document.activeElement as HTMLElement | null;
    const lenis = getLenis();
    lenis?.stop();
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { schliessen(); return; }
      if (e.key !== 'Tab' || !panel.current) return;
      const ziele = Array.from(panel.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR)).filter((el) => el.offsetParent !== null);
      if (!ziele.length) return;
      const [erstes, letztes] = [ziele[0], ziele[ziele.length - 1]];
      if (e.shiftKey && document.activeElement === erstes) { e.preventDefault(); letztes.focus(); }
      else if (!e.shiftKey && document.activeElement === letztes) { e.preventDefault(); erstes.focus(); }
    };
    document.addEventListener('keydown', beiTaste);
    // Fokus aufs Panel selbst: Screenreader lesen den Dialog, und der Schliessen-Knopf traegt beim Oeffnen keinen Fokusring.
    const fokus = window.setTimeout(() => panel.current?.focus({ preventScroll: true }), 80);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      window.clearTimeout(fokus);
      document.body.style.overflow = vorher;
      lenis?.start();
      ausloeser?.focus?.();
    };
  }, [offen, panel, schliessen]);
};

const Schliessen: React.FC<{ onClick: () => void; label: string; hell?: boolean }> = ({ onClick, label, hell }) => (
  <button
    type="button" onClick={onClick} aria-label={label}
    className={`absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border shadow-sm transition-colors ${
      hell ? 'border-white/30 bg-black/35 text-white backdrop-blur-md hover:bg-white hover:text-gray-950' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-950 hover:text-white'
    }`}
  >
    <X size={17} />
  </button>
);

export const GutscheinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fenster, setFenster] = useState(false);
  const [hinweis, setHinweis] = useState(false);
  const fensterRef = useRef<HTMLDivElement>(null);
  const hinweisRef = useRef<HTMLDivElement>(null);

  const oeffnen = useCallback(() => { hinweisMerken(); setHinweis(false); setFenster(true); }, []);
  const fensterZu = useCallback(() => setFenster(false), []);
  const hinweisZu = useCallback(() => { hinweisMerken(); setHinweis(false); }, []);

  useModal(fenster, fensterRef, fensterZu);
  useModal(hinweis, hinweisRef, hinweisZu);

  // Links mit `#gutschein` abfangen. Ohne JavaScript bleibt es ein Sprung zum Gutschein-Bereich der Startseite.
  useEffect(() => {
    const beiKlick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || link.hash !== GUTSCHEIN_ZIEL || link.target === '_blank') return;
      e.preventDefault();
      oeffnen();
    };
    document.addEventListener('click', beiKlick);
    return () => document.removeEventListener('click', beiKlick);
  }, [oeffnen]);

  // Direktaufruf `…/#gutschein` (z. B. aus einem Newsletter) oeffnet das Fenster gleich.
  useEffect(() => { if (window.location.hash === GUTSCHEIN_ZIEL) oeffnen(); }, [oeffnen]);

  // Begruessungs-Pop-up: erst nach dem Preloader, einmal, dann Pause.
  useEffect(() => {
    // `?gutschein-hinweis` zeigt das Pop-up trotz Pause erneut (Abnahme, Vorfuehren beim Kunden).
    const erneut = new URLSearchParams(window.location.search).has('gutschein-hinweis');
    if (navigator.webdriver || OHNE_HINWEIS.includes(window.location.pathname) || (!erneut && hinweisGesehen())) return;
    let zeit = 0;
    const planen = () => { zeit = window.setTimeout(() => { if (erneut || !hinweisGesehen()) setHinweis(true); }, HINWEIS_VERZOEGERUNG_MS); };
    const html = document.documentElement;
    if (!html.classList.contains(PRELOADER_HTML_CLASS)) { planen(); return () => window.clearTimeout(zeit); }
    const beobachter = new MutationObserver(() => {
      if (html.classList.contains(PRELOADER_HTML_CLASS)) return;
      beobachter.disconnect();
      planen();
    });
    beobachter.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => { beobachter.disconnect(); window.clearTimeout(zeit); };
  }, []);

  const huelle = (offen: boolean, ref: React.RefObject<HTMLDivElement | null>, zu: () => void, label: string, inhalt: React.ReactNode, breite: string) => (
    <AnimatePresence>
      {offen && (
        <motion.div
          key={label}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.22, delay: 0.06 } }} transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] overflow-y-auto bg-[radial-gradient(120%_90%_at_50%_45%,rgb(var(--cc-carbon-rgb)/0.66),rgb(var(--cc-carbon-rgb)/0.88))] backdrop-blur-md"
          onClick={(e) => { if (!ref.current?.contains(e.target as Node)) zu(); }}
        >
          <div className="flex min-h-full items-end justify-center sm:items-center sm:p-6">
            <motion.div
              ref={ref} role="dialog" aria-modal="true" aria-label={label} tabIndex={-1}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 } }}
              exit={{ opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.2, ease: KURVE } }}
              className={`relative w-full outline-none ${breite}`}
            >
              {inhalt}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const gestaffelt = (i: number) => ({
    initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: KURVE, delay: 0.16 + i * 0.07 },
  });

  return (
    <GutscheinContext.Provider value={{ oeffnen }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <>
          {huelle(hinweis, hinweisRef, hinweisZu, 'Gutscheinaktion', (
            <div className="overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
              <Schliessen onClick={hinweisZu} label="Hinweis schließen" hell />
              <div className="relative h-44 overflow-hidden bg-gray-950 sm:h-56">
                <motion.img
                  src={GUTSCHEIN_BILD} alt="" width={900} height={1200} decoding="async"
                  initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: KURVE }}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent" />
                <motion.span {...gestaffelt(0)} className="absolute bottom-4 left-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                  <Gift size={13} /> Gutscheinaktion
                </motion.span>
              </div>
              <div className="p-6 md:p-8">
                <motion.h2 {...gestaffelt(1)} className="text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-3xl">
                  Glanz verschenken.
                </motion.h2>
                <motion.p {...gestaffelt(2)} className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                  Unsere Aufbereitungspakete oder ein Wunschbetrag als Gutschein. Ideal für alle, die ihr Auto lieben.
                </motion.p>
                <motion.p {...gestaffelt(3)} className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-950">
                  <Truck size={16} className="text-blue-600" /> Versandkostenfrei per Post
                </motion.p>
                <motion.div {...gestaffelt(4)} className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <button type="button" onClick={oeffnen} className="cc-gradient-button group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-7 text-sm font-bold text-white">
                    <Gift size={16} /> Gutschein anfragen
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <button type="button" onClick={hinweisZu} className="min-h-12 rounded-full px-5 text-sm font-bold text-gray-600 transition-colors hover:text-gray-950">
                    Später
                  </button>
                </motion.div>
              </div>
            </div>
          ), 'max-w-lg')}
          {huelle(fenster, fensterRef, fensterZu, 'Gutschein anfragen', (
            <div className="flex h-[88dvh] flex-col rounded-t-[2rem] border border-gray-100 bg-white p-6 shadow-xl sm:h-[min(50rem,calc(100dvh-3rem))] sm:rounded-[2rem] md:p-10">
              <Schliessen onClick={fensterZu} label="Gutscheinanfrage schließen" />
              <GutscheinKopf />
              <GutscheinFormular />
            </div>
          ), 'max-w-2xl')}
        </>,
        document.body,
      )}
    </GutscheinContext.Provider>
  );
};

export default GutscheinProvider;
