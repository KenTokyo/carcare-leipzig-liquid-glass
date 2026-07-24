import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from './useSmoothScroll';
import { PRELOADER_EXIT_MS } from '../components/Preloader';

/**
 * Steuerlogik des Preloaders — bewusst getrennt von der Darstellung
 * (components/Preloader.tsx macht nur die Animation).
 *
 * WICHTIG zur Aufrufreihenfolge in App.tsx:
 * Dieser Hook muss NACH `useSmoothScroll()` aufgerufen werden. Effects laufen in
 * Deklarationsreihenfolge; erst dadurch existiert die Lenis-Instanz, wenn hier
 * `getLenis()?.stop()` passiert. Andersherum waere `getLenis()` noch `null` und der
 * Nutzer koennte hinter dem Overlay scrollen.
 */

/** Merker fuer „in dieser Session schon gesehen". Version im Namen, damit ein spaeteres Redesign den Preloader wieder zeigen darf. */
export const PRELOADER_SESSION_KEY = 'cc-preloader-v1';
/** Klasse auf <html>, die der Boot-Layer in index.html setzt. */
export const PRELOADER_HTML_CLASS = 'cc-preloading';

/**
 * Notbremse: Sollte `onExitComplete` nie feuern (Tab im Hintergrund pausiert rAF,
 * Animation abgebrochen, …), wird trotzdem entsperrt. Ohne das koennte die Seite
 * dauerhaft mit `overflow:hidden` und gestopptem Lenis feststecken.
 */
const SAFETY_RELEASE_MS = PRELOADER_EXIT_MS + 4000;

/**
 * Ob der Preloader laufen darf.
 *
 * Die Bedingungen (Pfad `/`, kein Hash, kein Session-Flag, kein Prerender) stehen
 * bewusst NICHT hier, sondern im Inline-Script in index.html: Das muss ohnehin vor
 * dem ersten Paint entscheiden. Diese Funktion liest nur dessen Ergebnis ab — eine
 * zweite Auswertung waere eine zweite Wahrheitsquelle, die auseinanderlaufen kann.
 */
const bootLayerDecided = (): boolean => {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains(PRELOADER_HTML_CLASS);
};

export interface PreloaderController {
  /** Steuert `{showPreloader && <Preloader />}` innerhalb einer AnimatePresence. */
  showPreloader: boolean;
  /** An `<Preloader onHoldComplete={…} />` geben — startet die Exit-Animation. */
  handleHoldComplete: () => void;
  /** An `<AnimatePresence onExitComplete={…}>` geben — entsperrt die Seite. */
  handleExitComplete: () => void;
}

/**
 * WARUM DER BOOT-LAYER HIER NICHT AUFGERAEUMT WIRD:
 * Naheliegend waere, `#cc-boot` zu entfernen, wenn kein Preloader laeuft. Genau das
 * war ein Bug: Im Prerender laeuft nie ein Preloader, React hat den Knoten also
 * entfernt — und `page.content()` in scripts/prerender.mjs fotografiert das DOM NACH
 * diesem Aufraeumen. Ergebnis waren 20 statische Snapshots ganz ohne Boot-Layer. Beim
 * echten Seitenaufruf setzte das Inline-Script dann `html.cc-preloading` (inkl.
 * `overflow:hidden`), ohne dass es noch etwas zum Anzeigen gab — also genau der
 * Content-Flash, den der Boot-Layer verhindern soll.
 *
 * Entfernt wird `#cc-boot` deshalb ausschliesslich von components/Preloader.tsx, und
 * zwar erst dann, wenn das Framer-Overlay ihn tatsaechlich ersetzt hat. Ohne Preloader
 * bleibt der Knoten stehen: `display:none`, und weil die Bilder CSS-Hintergruende sind,
 * kostet er auch keinen einzigen Request.
 */
export const usePreloader = (): PreloaderController => {
  // Lazy-Initializer: Die Entscheidung faellt genau einmal beim ersten Render.
  const [showPreloader, setShowPreloader] = useState(bootLayerDecided);
  const releasedRef = useRef(false);

  const release = useCallback(() => {
    if (releasedRef.current) return;
    releasedRef.current = true;

    try {
      sessionStorage.setItem(PRELOADER_SESSION_KEY, '1');
    } catch {
      // Private Mode o. ae.: dann laeuft der Preloader beim naechsten Aufruf erneut.
      // Kein Grund, den Rest der Freigabe zu ueberspringen.
    }

    // Erst die Klasse weg (hebt `overflow:hidden` auf), dann Lenis wieder anwerfen —
    // umgekehrt wuerde Lenis kurz gegen einen noch gesperrten Body arbeiten.
    document.documentElement.classList.remove(PRELOADER_HTML_CLASS);
    window.scrollTo(0, 0);
    getLenis()?.start();
  }, []);

  useEffect(() => {
    if (!showPreloader) return;

    getLenis()?.stop();
    const safety = window.setTimeout(release, SAFETY_RELEASE_MS);
    return () => window.clearTimeout(safety);
    // Absichtlich nur beim Mount: `showPreloader` wechselt genau einmal auf false,
    // und ab da haelt `onExitComplete` (bzw. der Safety-Timeout) die Freigabe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHoldComplete = useCallback(() => setShowPreloader(false), []);

  return { showPreloader, handleHoldComplete, handleExitComplete: release };
};
