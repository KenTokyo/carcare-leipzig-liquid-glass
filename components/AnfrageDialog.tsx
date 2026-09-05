import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import RequestForm, { formularTitel } from './RequestForm';
import { getLenis } from '../hooks/useSmoothScroll';
import { leistungFuerRoute } from '../data/leistungsauswahl';
import { RequestFormKind } from '../types';

/**
 * Anfrage-Dialog (Backlog 1.20) — ein Pop-up-Fenster mit dem Anfrageformular.
 *
 * WARUM EIGENSTAENDIGE KOMPONENTE UND KEIN SONDERFALL EINER SEITE: `#contact-termin`
 * steht an rund 40 Stellen im Projekt — in Seiten-Heros, Abschluss-Aufrufen, der
 * Navigation, dem Footer, der Kachelreihe, der Preistabelle und den Wissensartikeln.
 * Ein Dialog, der an jeder dieser Stellen einzeln verdrahtet werden muesste, waere nach
 * dem dritten Einbau bereits uneinheitlich. Deshalb: einmal in `Layout` gehaengt, von
 * ueberall ausloesbar.
 *
 * ZWEI WEGE, IHN ZU OEFFNEN
 *
 *  1. ÜBER DIE DATEN. `ANFRAGE_ZIELE` bildet Sprungziele auf Formularvarianten ab. Jeder
 *     bestehende Link mit diesem Ziel oeffnet den Dialog — ohne dass eine der 40
 *     Fundstellen angefasst wird. Eine weitere Stelle einzuhaengen ist eine Zeile hier.
 *  2. ÜBER DEN HOOK. `useAnfrageDialog().oeffnen('termin')` fuer alles, was kein Link
 *     ist — etwa die Knoepfe der mobilen Aktionsleiste.
 *
 * ⚠️ WEG 1 IST FERNWIRKUNG, UND DAS IST BEWUSST SO. Ein Klick auf einen ganz normalen
 * `<a href>` tut etwas anderes als das, was im Markup steht. Damit das auffindbar bleibt,
 * steht die Zuordnung als sichtbare Liste hier oben und nicht als Bedingung irgendwo im
 * Code. Wer wissen will, welche Links abgefangen werden, liest `ANFRAGE_ZIELE`.
 *
 * OHNE JAVASCRIPT BLEIBT DER LINK EIN LINK. Das Abfangen passiert im Klick-Handler; faellt
 * er aus, fuehrt der Link weiterhin zum Formular auf der Kontaktseite. Der bestehende Weg
 * geht nicht verloren, er wird nur ueberholt.
 *
 * AUF /kontakt WIRD NICHT ABGEFANGEN. Dort ist das Formular sichtbarer Seiteninhalt, und
 * `#contact-termin` schaltet den Reiter um (siehe `ContactSection`). Ein Dialog ueber dem
 * bereits offenen Formular waere sinnlos und wuerde die Reiterlogik brechen.
 *
 * WARUM PORTAL: `.site-main-shell` traegt `transform: translateZ(0)` (index.css). Ein
 * Transform macht das Element zum Bezugsrahmen fuer `position: fixed` — der Dialog klebte
 * damit an `<main>` statt am Viewport. Empirisch belegt beim Stellen-Pop-up: im DOM
 * vorhanden, im Screenshot nicht zu sehen.
 */

/**
 * Sprungziel → Formularvariante. **Hier wird eingehaengt.**
 *
 * Seit 2026-09-05 alle drei Anfragearten (Backlog 1.20 vollstaendig). Vorher nur die
 * Terminanfrage — mit der Folge, dass zwei der drei Handlungsaufrufe weiterhin auf die
 * Kontaktseite sprangen und derselbe Knopf je nach Anliegen etwas anderes tat.
 */
export const ANFRAGE_ZIELE: Record<string, RequestFormKind> = {
  '#contact-termin': 'termin',
  '#contact-schaden': 'schaden',
  '#contact-business': 'business',
};

/** Seiten, auf denen NICHT abgefangen wird, weil das Formular dort schon steht. */
const AUSGENOMMENE_PFADE = ['/kontakt'];

interface AnfrageDialogWerte {
  /**
   * `vorauswahl` ist die Leistung, die im Terminformular vorbelegt wird (Backlog 1.19).
   * Wird sie weggelassen, leitet der Dialog sie aus dem aktuellen Seitenpfad ab.
   */
  oeffnen: (art: RequestFormKind, vorauswahl?: string) => void;
  schliessen: () => void;
  offen: boolean;
}

const AnfrageDialogContext = createContext<AnfrageDialogWerte | null>(null);

export const useAnfrageDialog = (): AnfrageDialogWerte => {
  const werte = useContext(AnfrageDialogContext);
  if (!werte) {
    throw new Error('useAnfrageDialog ausserhalb von <AnfrageDialogProvider> benutzt — Provider sitzt in Layout.tsx.');
  }
  return werte;
};

/** Fokussierbares im Dialog, fuer die Fokusfalle. */
const FOKUSSIERBAR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const AnfrageDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [art, setArt] = useState<RequestFormKind | null>(null);
  const [vorauswahl, setVorauswahl] = useState<string | undefined>(undefined);
  const panelRef = useRef<HTMLDivElement>(null);
  const schliessenRef = useRef<HTMLButtonElement>(null);
  /** Element, das den Dialog geoeffnet hat — dorthin geht der Fokus zurueck. */
  const ausloeserRef = useRef<HTMLElement | null>(null);

  const oeffnen = useCallback((neueArt: RequestFormKind, gewuenscht?: string) => {
    ausloeserRef.current = document.activeElement as HTMLElement | null;
    // Ohne ausdrueckliche Angabe aus dem aktuellen Seitenpfad ableiten: Wer von
    // `/innenaufbereitung-leipzig` kommt, meint die Innenaufbereitung (Backlog 1.19).
    // Gibt es keine eindeutige Entsprechung, bleibt das Feld auf „Bitte waehlen" —
    // eine falsche Vorauswahl sieht aus wie eine Entscheidung des Nutzers und wird
    // deshalb nicht korrigiert.
    setVorauswahl(gewuenscht ?? leistungFuerRoute(window.location.pathname));
    setArt(neueArt);
  }, []);

  const schliessen = useCallback(() => setArt(null), []);

  // ---------------------------------------------------- Links abfangen --------
  useEffect(() => {
    const beiKlick = (e: MouseEvent) => {
      // Nur der schlichte Linksklick. Mittelklick, Strg/Cmd und Umschalt gehoeren dem
      // Nutzer — wer bewusst in einem neuen Tab oeffnet, will keinen Dialog.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank') return;
      if (AUSGENOMMENE_PFADE.includes(window.location.pathname)) return;
      const ziel = ANFRAGE_ZIELE[link.hash];
      if (!ziel) return;
      e.preventDefault();
      oeffnen(ziel);
    };
    document.addEventListener('click', beiKlick);
    return () => document.removeEventListener('click', beiKlick);
  }, [oeffnen]);

  // ------------------------------------ Escape, Fokusfalle, Scroll sperren ----
  useEffect(() => {
    if (!art) return;

    // Lenis mitanhalten: Ein reines `overflow: hidden` auf <body> haelt den
    // Smooth-Scroller nicht auf, der Hintergrund liefe unter dem Dialog weiter.
    const lenis = getLenis();
    lenis?.stop();
    const vorherigerUeberlauf = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        schliessen();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const ziele = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOKUSSIERBAR)).filter(
        (el) => el.offsetParent !== null
      );
      if (ziele.length === 0) return;
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

    const fokus = window.setTimeout(() => schliessenRef.current?.focus(), 60);

    return () => {
      document.removeEventListener('keydown', beiTaste);
      window.clearTimeout(fokus);
      document.body.style.overflow = vorherigerUeberlauf;
      lenis?.start();
      // Fokus zurueck an den Ausloeser. Ohne das landet er am Seitenanfang, und wer mit
      // der Tastatur arbeitet, muss sich seinen Platz neu suchen.
      ausloeserRef.current?.focus?.();
    };
  }, [art, schliessen]);

  return (
    <AnfrageDialogContext.Provider value={{ oeffnen, schliessen, offen: art !== null }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {art && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] overflow-y-auto bg-[rgb(var(--cc-carbon-rgb)/0.55)] backdrop-blur-sm"
                onClick={(e) => {
                  // Alles ausserhalb des Panels schliesst. Bewusst NICHT
                  // `e.target === e.currentTarget`: Seit die Ausrichtung in einem eigenen
                  // Zwischenelement steckt, waeren Klicks daneben sonst wirkungslos.
                  if (!panelRef.current?.contains(e.target as Node)) schliessen();
                }}
              >
                {/*
                  ⚠️ DIESES ZWISCHENELEMENT IST NICHT DEKORATIV. Zuerst stand
                  `flex items-end sm:items-center` direkt auf dem scrollenden Overlay.
                  Bei einem Panel, das hoeher ist als der Viewport, laeuft der Ueberschuss
                  dann nach OBEN aus dem Container — und dorthin kann man nicht scrollen.
                  Gemessen auf 390x844: Panel 1371px hoch, Oberkante bei -527px,
                  `scrollHeight === clientHeight`, der Formularkopf war unerreichbar.

                  Die Ausrichtung gehoert deshalb in ein eigenes Kind mit `min-h-full`:
                  Das Overlay scrollt, das Kind richtet aus. Kurze Inhalte bleiben unten
                  bzw. mittig, lange werden vollstaendig erreichbar.
                */}
                <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-6">
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-label={formularTitel[art]}
                  initial={{ opacity: 0, y: 24, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 16, scale: 0.99 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full max-w-2xl"
                >
                  <button
                    ref={schliessenRef}
                    type="button"
                    onClick={schliessen}
                    aria-label="Anfrage schließen"
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-950 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                  <RequestForm kind={art} vorauswahl={vorauswahl} />
                </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </AnfrageDialogContext.Provider>
  );
};

export default AnfrageDialogProvider;
