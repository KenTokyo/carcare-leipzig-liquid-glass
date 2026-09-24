import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CircleHelp, CornerDownLeft, FileText, Hash, LoaderCircle, Search, X } from 'lucide-react';
import { getLenis } from '../hooks/useSmoothScroll';
import {
  SUCHE_EREIGNIS,
  ausschnitt,
  ladeIndex,
  markiere,
  suche,
  suchwoerter,
  type Stueck,
  type Treffer,
  type TrefferArt,
} from '../lib/suche';

/**
 * Globale Suche — Dialog. Wunsch des Users vom 2026-09-24: „eine globale Suche in die Navbar rechts
 * neben Kontakt, damit man ueber das Suchfeld alles auf der Seite finden kann".
 *
 * OEFFNEN: Knopf in der Navbar (Ereignis `carcare:suche`, siehe `lib/suche.ts`), Strg/⌘ + K oder
 * „/" (ausser beim Tippen in einem Feld). Liegt im `Layout`, einmal fuer alle Seiten.
 *
 * WIE DER ANFRAGE-DIALOG: Portal an `document.body` (in `<main>` griffe `position: fixed` nicht),
 * Lenis angehalten (sonst scrollt die Seite unter dem Dialog weiter), Fokusfalle, Escape schliesst,
 * der Fokus kehrt zum Ausloeser zurueck.
 *
 * TASTATUR NACH DEM COMBOBOX-MUSTER (WAI-ARIA APG): Der Fokus bleibt im Eingabefeld, ↑/↓ waehlen
 * einen Treffer (`aria-activedescendant`), Enter oeffnet ihn. Die Treffer sind echte Links (`href`)
 * — Mittelklick oder Strg-Klick oeffnen sie in einem neuen Tab —, aber ohne eigenen Tab-Halt.
 *
 * SPRUNG ZUM TREFFER: andere Seite → `pushState` + `carcare:navigate` wie die Navbar; die App
 * scrollt nach dem Wechsel zum `#anker` (App.tsx). Dieselbe Seite → direkt dorthin scrollen, denn
 * ohne Seitenwechsel laeuft der Effekt der App nicht.
 */

const VORSCHLAEGE = [
  { titel: 'Unfallinstandsetzung', url: '/unfallinstandsetzung-leipzig' },
  { titel: 'Fahrzeugaufbereitung', url: '/fahrzeugaufbereitung-leipzig' },
  { titel: 'Autolackierung', url: '/autolackierung-leipzig' },
  { titel: 'Smart Repair', url: '/smart-repair-leipzig' },
  { titel: 'Alle Leistungen', url: '/leistungen' },
  { titel: 'Karriere', url: '/karriere' },
  { titel: 'Kontakt', url: '/kontakt' },
];

const SYMBOL: Record<TrefferArt, React.ReactNode> = {
  seite: <FileText size={16} aria-hidden="true" />,
  abschnitt: <Hash size={16} aria-hidden="true" />,
  frage: <CircleHelp size={16} aria-hidden="true" />,
};

const FOKUSSIERBAR = 'a[href]:not([tabindex="-1"]), button:not([disabled]), input:not([disabled])';

const aktuellerPfad = () => window.location.pathname.replace(/\/+$/, '') || '/';

/**
 * Anzeigetitel: nur der erste Teil des SEO-Titels. „Hagelschadenreparatur Leipzig | Audatex" liest
 * sich in der Trefferliste als „Hagelschadenreparatur Leipzig". Gesucht wird weiter ueber den VOLLEN
 * Titel (`lib/suche.ts`) — „Audatex" findet die Seite also trotzdem.
 */
const kurztitel = (t: string) => t.split(' | ')[0];

/** Zur Stelle eines Treffers — siehe Kopfkommentar. */
const geheZu = (url: string) => {
  const [pfad, anker] = url.split('#');
  if (pfad === aktuellerPfad()) {
    window.history.pushState(null, '', url);
    // Nach dem Schliessen: Erst dann laeuft Lenis wieder und nimmt `scrollTo` an.
    window.setTimeout(() => {
      const ziel = anker ? document.getElementById(anker) : null;
      const lenis = getLenis();
      if (ziel) {
        if (lenis) lenis.scrollTo(ziel, { offset: -88 });
        else window.scrollTo({ top: ziel.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
      } else if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 80);
    return;
  }
  window.history.pushState(null, '', url);
  window.dispatchEvent(new Event('carcare:navigate'));
};

const Markiert: React.FC<{ stuecke: Stueck[] }> = ({ stuecke }) => (
  <>
    {stuecke.map((s, i) =>
      s.treffer ? (
        <mark key={i} className="rounded-[3px] bg-[rgb(var(--cc-ice-blue-rgb))] px-0.5 text-gray-950">
          {s.text}
        </mark>
      ) : (
        <React.Fragment key={i}>{s.text}</React.Fragment>
      )
    )}
  </>
);

type Zustand = 'bereit' | 'laedt' | 'fehler';

const SuchDialog: React.FC = () => {
  const [offen, setOffen] = useState(false);
  const [anfrage, setAnfrage] = useState('');
  const [zustand, setZustand] = useState<Zustand>('laedt');
  const [einheiten, setEinheiten] = useState<Awaited<ReturnType<typeof ladeIndex>> | null>(null);
  const [aktiv, setAktiv] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const eingabeRef = useRef<HTMLInputElement>(null);
  const listeRef = useRef<HTMLDivElement>(null);
  const ausloeserRef = useRef<HTMLElement | null>(null);
  const listenId = useId();

  // ---------------------------------------------------------------- Oeffnen ----
  useEffect(() => {
    const auf = () => {
      ausloeserRef.current = document.activeElement as HTMLElement | null;
      setOffen(true);
    };
    const beiTaste = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (offen) setOffen(false);
        else auf();
        return;
      }
      if (e.key !== '/' || offen || e.ctrlKey || e.metaKey || e.altKey) return;
      const ziel = e.target as HTMLElement | null;
      if (ziel?.closest('input, textarea, select, [contenteditable="true"]')) return;
      e.preventDefault();
      auf();
    };
    window.addEventListener(SUCHE_EREIGNIS, auf);
    window.addEventListener('keydown', beiTaste);
    return () => {
      window.removeEventListener(SUCHE_EREIGNIS, auf);
      window.removeEventListener('keydown', beiTaste);
    };
  }, [offen]);

  // Index beim ersten Oeffnen laden; schlug es fehl, beim naechsten Oeffnen erneut.
  useEffect(() => {
    if (!offen || einheiten) return;
    let aktuell = true;
    setZustand('laedt');
    ladeIndex()
      .then((e) => {
        if (!aktuell) return;
        setEinheiten(e);
        setZustand('bereit');
      })
      .catch(() => aktuell && setZustand('fehler'));
    return () => {
      aktuell = false;
    };
  }, [offen, einheiten]);

  // ------------------------------------------- Escape, Fokusfalle, Scroll-Sperre ----
  useEffect(() => {
    if (!offen) return;
    const lenis = getLenis();
    lenis?.stop();
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOffen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const ziele = [...panelRef.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR)].filter((el) => el.offsetParent !== null);
      if (!ziele.length) return;
      const erstes = ziele[0];
      const letztes = ziele[ziele.length - 1];
      if (e.shiftKey && document.activeElement === erstes) {
        e.preventDefault();
        letztes.focus();
      } else if (!e.shiftKey && document.activeElement === letztes) {
        e.preventDefault();
        erstes.focus();
      }
    };
    document.addEventListener('keydown', beiTaste);
    // Den letzten Suchbegriff stehen lassen, aber MARKIEREN: Wer weitertippt, ersetzt ihn; wer
    // dasselbe noch einmal sehen will, hat es sofort. Ohne das hing neuer Text an den alten an
    // („GlasuritSmart Repair" → 0 Treffer, gefunden 2026-09-24 im Test).
    const fokus = window.setTimeout(() => {
      eingabeRef.current?.focus();
      eingabeRef.current?.select();
    }, 40);
    return () => {
      document.removeEventListener('keydown', beiTaste);
      window.clearTimeout(fokus);
      document.body.style.overflow = vorher;
      lenis?.start();
      ausloeserRef.current?.focus?.();
    };
  }, [offen]);

  // ---------------------------------------------------------------- Treffer ----
  const woerter = useMemo(() => suchwoerter(anfrage), [anfrage]);
  const treffer: Treffer[] = useMemo(
    () => (einheiten && woerter.length ? suche(einheiten, anfrage) : []),
    [einheiten, anfrage, woerter.length]
  );
  useEffect(() => setAktiv(0), [anfrage]);
  // Gewaehlten Treffer im Blick halten, wenn ↑/↓ ueber den sichtbaren Rand hinausgehen.
  useEffect(() => {
    listeRef.current?.querySelector<HTMLElement>(`[data-index="${aktiv}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [aktiv]);

  const oeffneTreffer = (url: string) => {
    setOffen(false);
    setAnfrage('');
    // Der Fokus soll NICHT zum Ausloeser zurueck, wenn die Seite wechselt — er wuerde die Navbar
    // anspringen. Beim Schliessen ohne Auswahl bleibt es beim Ruecksprung.
    ausloeserRef.current = null;
    geheZu(url);
  };

  const beiEingabeTaste = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!treffer.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAktiv((i) => (i + 1) % treffer.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAktiv((i) => (i - 1 + treffer.length) % treffer.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      oeffneTreffer(treffer[aktiv].url);
    }
  };

  const optionId = (i: number) => `${listenId}-t${i}`;
  const hatAnfrage = woerter.length > 0;

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {offen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[110] bg-[rgb(var(--cc-carbon-rgb)/0.55)] backdrop-blur-sm"
          onMouseDown={(e) => {
            if (!panelRef.current?.contains(e.target as Node)) setOffen(false);
          }}
        >
          <div className="flex h-full items-start justify-center px-3 pt-[max(1rem,8vh)] sm:px-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Website durchsuchen"
              initial={{ opacity: 0, y: -12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex max-h-[min(84vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-[0_40px_90px_-40px_rgb(var(--cc-carbon-rgb)/0.6)]"
            >
              {/* Eingabe */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 md:px-6">
                <Search size={20} strokeWidth={2.2} aria-hidden="true" className="shrink-0 text-blue-600" />
                <input
                  ref={eingabeRef}
                  type="search"
                  value={anfrage}
                  onChange={(e) => setAnfrage(e.target.value)}
                  onKeyDown={beiEingabeTaste}
                  placeholder="Leistung, Frage oder Stichwort …"
                  aria-label="Suchbegriff"
                  role="combobox"
                  aria-expanded={treffer.length > 0}
                  aria-controls={listenId}
                  aria-autocomplete="list"
                  aria-activedescendant={treffer.length ? optionId(aktiv) : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  className="min-w-0 flex-1 bg-transparent text-base text-gray-950 placeholder:text-gray-500 focus:outline-none md:text-lg [&::-webkit-search-cancel-button]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setOffen(false)}
                  aria-label="Suche schließen"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition-colors hover:bg-gray-950 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Ergebnisbereich — eigener Scroll; `data-lenis-prevent` laesst das Mausrad hier
                  den Bereich scrollen statt die Seite. */}
              <div ref={listeRef} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 md:px-4">
                <p aria-live="polite" className="sr-only">
                  {hatAnfrage && zustand === 'bereit' ? `${treffer.length} Treffer` : ''}
                </p>

                {zustand === 'laedt' && (
                  <p className="flex items-center gap-2 px-3 py-6 text-sm text-gray-600">
                    <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> Suche wird vorbereitet …
                  </p>
                )}

                {zustand === 'fehler' && (
                  <p className="px-3 py-6 text-sm leading-relaxed text-gray-600">
                    Die Suche ist gerade nicht erreichbar. Die wichtigsten Seiten finden Sie hier — oder rufen
                    Sie uns an:{' '}
                    <a href="tel:+493412617790" className="font-semibold text-gray-950 underline-offset-2 hover:underline">
                      0341 - 261 77 90
                    </a>
                    .
                  </p>
                )}

                {(!hatAnfrage || zustand === 'fehler') && (
                  <div className="px-3 pb-2 pt-3">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Häufig gesucht</p>
                    <div className="flex flex-wrap gap-2">
                      {VORSCHLAEGE.map((v) => (
                        <a
                          key={v.url}
                          href={v.url}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                            e.preventDefault();
                            oeffneTreffer(v.url);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3.5 py-2 text-[13px] font-medium text-gray-800 transition-colors hover:border-gray-300 hover:bg-gray-50"
                        >
                          {v.titel}
                          <ArrowRight size={13} aria-hidden="true" className="text-gray-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {hatAnfrage && zustand === 'bereit' && treffer.length === 0 && (
                  <div className="px-3 py-6 text-sm leading-relaxed text-gray-600">
                    <p className="font-semibold text-gray-950">Keine Treffer für „{anfrage.trim()}".</p>
                    <p className="mt-2">
                      Versuchen Sie ein anderes Wort — oder fragen Sie uns direkt:{' '}
                      <a href="tel:+493412617790" className="font-semibold text-gray-950 underline-offset-2 hover:underline">
                        0341 - 261 77 90
                      </a>
                      .
                    </p>
                  </div>
                )}

                {treffer.length > 0 && (
                  <div role="listbox" id={listenId} aria-label="Treffer" className="space-y-1">
                    {treffer.map((t, i) => {
                      const gewaehlt = i === aktiv;
                      return (
                        <a
                          key={`${t.url}-${t.titel}`}
                          id={optionId(i)}
                          data-index={i}
                          href={t.url}
                          role="option"
                          aria-selected={gewaehlt}
                          tabIndex={-1}
                          onMouseMove={() => setAktiv(i)}
                          onClick={(e) => {
                            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                            e.preventDefault();
                            oeffneTreffer(t.url);
                          }}
                          className={`flex gap-3 rounded-2xl px-3 py-3 transition-colors ${gewaehlt ? 'bg-gray-50' : ''}`}
                        >
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                              gewaehlt ? 'cc-gradient-fill text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {SYMBOL[t.art]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                              {t.art === 'seite' ? 'Seite' : kurztitel(t.seite)}
                              {t.art === 'frage' && ' · Häufige Frage'}
                            </span>
                            <span className="mt-0.5 block text-[15px] font-semibold leading-snug text-gray-950">
                              <Markiert stuecke={markiere(t.art === 'seite' ? kurztitel(t.titel) : t.titel, woerter)} />
                            </span>
                            {t.text && (
                              <span className="mt-1 block text-[13px] leading-relaxed text-gray-600">
                                <Markiert stuecke={ausschnitt(t.text, woerter)} />
                              </span>
                            )}
                          </span>
                          {gewaehlt && (
                            <CornerDownLeft size={15} aria-hidden="true" className="mt-1 hidden shrink-0 text-gray-500 md:block" />
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tastaturhinweise — nur, wo es eine Tastatur gibt */}
              <div className="hidden items-center gap-4 border-t border-gray-100 px-6 py-3 text-[11px] text-gray-600 md:flex">
                <span><kbd className="font-sans font-semibold">↑ ↓</kbd> auswählen</span>
                <span><kbd className="font-sans font-semibold">Enter</kbd> öffnen</span>
                <span><kbd className="font-sans font-semibold">Esc</kbd> schließen</span>
                <span className="ml-auto"><kbd className="font-sans font-semibold">Strg K</kbd> öffnet die Suche überall</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SuchDialog;
