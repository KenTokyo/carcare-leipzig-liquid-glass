import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Gift, Truck, X } from 'lucide-react';
import { getLenis } from '../../hooks/useSmoothScroll';
import { PRELOADER_HTML_CLASS } from '../../hooks/usePreloader';
import GutscheinFormular, { GutscheinKopf } from './GutscheinFormular';
import GutscheinSeitenleiste from './GutscheinSeitenleiste';

/**
 * Gutscheinaktion (OA-14): Begruessungs-Pop-up, Anfragefenster und Ausloeser `#gutschein`.
 *
 * - Einmal in `Layout`; jeder Link mit `#gutschein` oeffnet das Fenster (wie `ANFRAGE_ZIELE` im Anfrage-Dialog).
 * - Pop-up erscheint bei JEDEM Aufruf der Startseite (Kundenwunsch r2): erster Besuch nach dem Preloader, Seitenwechsel
 *   (`carcare:navigate`, `popstate`) nach kurzer Pause. Geschlossen wird es zur Leiste rechts (`GutscheinSeitenleiste`),
 *   die auf allen Seiten bleibt. Nie im Prerender/Pruefbrowser (`navigator.webdriver`, wie `useOeffnungsStatus`),
 *   sonst stuenden Pop-up und Leiste in Messungen und im Suchindex.
 * - Portal an `body`: `.site-main-shell` traegt einen Transform (siehe `AnfrageDialog.tsx`).
 */

const HINWEIS_VERZOEGERUNG_MS = 1800;
const HINWEIS_NACH_WECHSEL_MS = 900;
export const GUTSCHEIN_ZIEL = '#gutschein';
/** Bild der Aussenaufbereitung (Kachel B46), wie auf der Fahrzeugaufbereitungsseite. */
export const GUTSCHEIN_BILD = '/assets/kacheln/aussenaufbereitung-fahrzeugwaesche-leipzig-carcare.webp';
export const GUTSCHEIN_BILD_ALT = 'Zwei Mitarbeiter waschen in unserer Waschhalle einen gelben Sportwagen, Außenaufbereitung im CarCare Center Leipzig';
const istStartseite = () => window.location.pathname === '/' || window.location.pathname === '';

const FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
const KURVE = [0.22, 1, 0.36, 1] as const;

interface GutscheinWerte { oeffnen: () => void }
const GutscheinContext = createContext<GutscheinWerte | null>(null);
export const useGutschein = () => useContext(GutscheinContext);

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
  // Leiste erst, wenn auf der Startseite das Pop-up durch ist; auf Unterseiten sofort. Nie im Prerender.
  const [leisteFrei, setLeisteFrei] = useState(false);
  const fensterRef = useRef<HTMLDivElement>(null);
  const hinweisRef = useRef<HTMLDivElement>(null);

  const oeffnen = useCallback(() => { setHinweis(false); setLeisteFrei(true); setFenster(true); }, []);
  const fensterZu = useCallback(() => setFenster(false), []);
  const hinweisZu = useCallback(() => { setHinweis(false); setLeisteFrei(true); }, []);

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

  // Begruessungs-Pop-up: bei jedem Aufruf der Startseite; erster Besuch erst nach dem Preloader.
  useEffect(() => {
    if (navigator.webdriver) return;
    let zeit = 0;
    let beobachter: MutationObserver | null = null;
    const planen = (ms: number) => {
      window.clearTimeout(zeit);
      if (!istStartseite()) { setLeisteFrei(true); return; }
      setLeisteFrei(false);
      zeit = window.setTimeout(() => { if (istStartseite()) setHinweis(true); else setLeisteFrei(true); }, ms);
    };
    const html = document.documentElement;
    if (html.classList.contains(PRELOADER_HTML_CLASS) && istStartseite()) {
      beobachter = new MutationObserver(() => {
        if (html.classList.contains(PRELOADER_HTML_CLASS)) return;
        beobachter?.disconnect();
        planen(HINWEIS_VERZOEGERUNG_MS);
      });
      beobachter.observe(html, { attributes: true, attributeFilter: ['class'] });
    } else planen(HINWEIS_VERZOEGERUNG_MS);
    // Seitenwechsel: `Navbar` und Links feuern `carcare:navigate`, Zurueck/Vor `popstate` (wie `App.tsx`).
    const beiWechsel = () => planen(HINWEIS_NACH_WECHSEL_MS);
    window.addEventListener('carcare:navigate', beiWechsel);
    window.addEventListener('popstate', beiWechsel);
    window.addEventListener('carcare:startseite', beiWechsel);
    return () => {
      beobachter?.disconnect();
      window.clearTimeout(zeit);
      window.removeEventListener('carcare:navigate', beiWechsel);
      window.removeEventListener('popstate', beiWechsel);
      window.removeEventListener('carcare:startseite', beiWechsel);
    };
  }, []);

    // Ab `lg` gleitet das Pop-up beim Schliessen nach rechts zur Leiste; mobil (ohne Leiste) sinkt es weg.
  const zurLeiste = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  const huelle = (offen: boolean, ref: React.RefObject<HTMLDivElement | null>, zu: () => void, label: string, inhalt: React.ReactNode, breite: string, nachRechts = false) => (
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
              exit={nachRechts && zurLeiste
                ? { opacity: 0, x: '45vw', scale: 0.35, transition: { duration: 0.42, ease: [0.55, 0, 0.75, 0.2] } }
                : { opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.2, ease: KURVE } }}
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
                  src={GUTSCHEIN_BILD} alt="" width={1200} height={750} decoding="async"
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
          ), 'max-w-lg', true)}
          {huelle(fenster, fensterRef, fensterZu, 'Gutschein anfragen', (
            <div className="flex h-[88dvh] flex-col rounded-t-[2rem] border border-gray-100 bg-white p-6 shadow-xl sm:h-[min(50rem,calc(100dvh-3rem))] sm:rounded-[2rem] md:p-10">
              <Schliessen onClick={fensterZu} label="Gutscheinanfrage schließen" />
              <GutscheinKopf />
              <GutscheinFormular />
            </div>
          ), 'max-w-2xl')}
          <GutscheinSeitenleiste sichtbar={leisteFrei && !hinweis && !fenster} oeffnen={oeffnen} />
        </>,
        document.body,
      )}
    </GutscheinContext.Provider>
  );
};

export default GutscheinProvider;
