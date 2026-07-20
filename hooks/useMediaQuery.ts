import { useEffect, useState } from 'react';

/**
 * Reaktive Media-Query-Auswertung fuer Faelle, in denen eine CSS-Klasse nicht reicht —
 * also wenn **JavaScript-Werte** breakpoint-abhaengig sein muessen (z. B. eine
 * Framer-Motion-Transform-Range, die sich nicht per Tailwind-Praefix umschalten laesst).
 *
 * Fuer alles rein Visuelle bitte weiterhin Tailwind-Breakpoints nutzen (`md:` etc.) —
 * die brauchen kein JS und greifen schon vor der Hydration.
 *
 * SSR/Prerender: startet mit `false` und korrigiert sich im ersten Effect. Der Prerender
 * (scripts/prerender.mjs) backt damit den Mobile-Zweig ins HTML; das ist unkritisch, weil
 * der Wert nur Animations-Amplituden steuert, keine Inhalte.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};
