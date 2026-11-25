import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Gift } from 'lucide-react';

/**
 * Schwebende Gutschein-Leiste am rechten Rand (OA-14, Kundenwunsch r2), ab `lg` auf jeder Seite.
 *
 * - Erscheint, sobald das Begruessungs-Pop-up zu ist: Das Pop-up gleitet nach rechts, die Leiste faehrt ein.
 * - Pfeil stupst in Abstaenden nach links: Hinweis, dass hier etwas aufgeht.
 * - Klick oeffnet das Anfragefenster (wie jeder `#gutschein`-Link, `GutscheinDialog.tsx`).
 * - Eigene Huelle fuer die Lage (`-translate-y-1/2`), Motion nur innen: framer-motion ueberschreibt sonst `transform`.
 * - Unter `lg` nicht: dort liegen Menue und Aktionsleiste unten (`MobileStickyCTA`).
 */
const KURVE = [0.22, 1, 0.36, 1] as const;

const GutscheinSeitenleiste: React.FC<{ sichtbar: boolean; oeffnen: () => void }> = ({ sichtbar, oeffnen }) => (
  <div className="pointer-events-none fixed right-0 top-1/2 z-[90] hidden -translate-y-1/2 lg:block" data-suche="aus">
    <AnimatePresence>
      {sichtbar && (
        <motion.button
          key="gutschein-leiste"
          type="button" onClick={oeffnen} aria-label="Hier Gutschein kaufen"
          initial={{ x: '115%' }}
          animate={{ x: 0, transition: { type: 'spring', stiffness: 210, damping: 19, mass: 0.9, delay: 0.32 } }}
          exit={{ x: '115%', transition: { duration: 0.28, ease: KURVE } }}
          whileHover={{ x: -6 }} whileTap={{ scale: 0.97 }}
          className="group pointer-events-auto block rounded-l-[1.35rem] outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          <span className="cc-gradient-button flex flex-col items-center gap-3 rounded-l-[1.35rem] border border-r-0 px-3 pb-5 pt-4 text-white">
            <motion.span
              aria-hidden="true"
              animate={{ x: [0, -7, 0, -7, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2.6, delay: 1.2 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30"
            >
              <ArrowLeft size={16} strokeWidth={2.4} />
            </motion.span>
            <Gift size={18} aria-hidden="true" className="text-white/90" />
            <span className="rotate-180 text-sm font-bold tracking-wide [writing-mode:vertical-rl]">Hier Gutschein kaufen</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  </div>
);

export default GutscheinSeitenleiste;
