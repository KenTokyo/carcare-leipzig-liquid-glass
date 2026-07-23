import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle, CalendarClock, Navigation } from 'lucide-react';

/**
 * Navigationsziel. Wortlaut EXAKT wie NAP_ADRESSE in CLAUDE.md / Impressum / Footer —
 * NAP-Konsistenz (SEO-GEO §6.1) gilt auch fuer Kartendienste.
 */
const ADRESSE = 'An den Tierkliniken 42, 04103 Leipzig';
const ZIEL = encodeURIComponent(ADRESSE);

/**
 * Beide Dienste bekommen eine ROUTEN-URL (nicht nur einen Pin), damit die Navigation direkt
 * startet. Auf dem Handy uebernimmt die installierte App, sonst oeffnet die Web-Fassung.
 * Apple: `daddr` = Ziel, `dirflg=d` = Auto. Google: offizielle Directions-API-URL.
 */
const KARTEN_ZIELE = [
  { label: 'Apple Karten', href: `https://maps.apple.com/?daddr=${ZIEL}&dirflg=d` },
  { label: 'Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${ZIEL}&travelmode=driving` },
];

const MobileStickyCTA: React.FC = () => {
  const [nearBottom, setNearBottom] = useState(false);
  // Auswahl-Popover fuer die Navigation. Bewusst eine Nachfrage statt Plattform-Automatik:
  // Auto-Erkennung liegt bei Android-Nutzern mit Apple-Konto bzw. Desktop-Safari regelmaessig
  // daneben — und der Nutzer soll seine gewohnte App behalten duerfen.
  const [kartenOffen, setKartenOffen] = useState(false);
  const kartenRef = useRef<HTMLDivElement>(null);

  // Beim Reveal-Footer (letzte ~70% Bildschirmhöhe vor Doku-Ende) ausblenden, sonst überdeckt der CTA den Footer.
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const threshold = document.documentElement.scrollHeight - window.innerHeight * 0.7;
      setNearBottom(scrolled >= threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Popover schliessen bei Klick ausserhalb und mit Escape.
  useEffect(() => {
    if (!kartenOffen) return;
    const beiKlick = (e: PointerEvent) => {
      if (!kartenRef.current?.contains(e.target as Node)) setKartenOffen(false);
    };
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setKartenOffen(false);
    };
    document.addEventListener('pointerdown', beiKlick);
    document.addEventListener('keydown', beiTaste);
    return () => {
      document.removeEventListener('pointerdown', beiKlick);
      document.removeEventListener('keydown', beiTaste);
    };
  }, [kartenOffen]);

  // Blendet der Balken aus (Footer-Bereich), darf kein offenes Popover zurueckbleiben.
  useEffect(() => {
    if (nearBottom) setKartenOffen(false);
  }, [nearBottom]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
      window.history.pushState(null, '', `/kontakt#${id}`);
      window.dispatchEvent(new Event('carcare:navigate'));
      return;
    }
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const buttonKlassen =
    'cc-gradient-button pointer-events-auto flex flex-col items-center justify-center gap-1 rounded-2xl border py-3 text-white';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: nearBottom ? 120 : 0, opacity: nearBottom ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 pointer-events-none"
    >
      {/* Auswahl-Popover ueber der Leiste. Sitzt im selben Container, damit es mit der Leiste
          ein- und ausblendet und nie ohne sie stehenbleibt. */}
      <AnimatePresence>
        {kartenOffen && (
          <motion.div
            ref={kartenRef}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="dialog"
            aria-label="Navigation starten"
            className="pointer-events-auto mb-2.5 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-[0_20px_40px_-10px_rgb(var(--cc-carbon-rgb)/0.25)] backdrop-blur-xl"
          >
            <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Route zu {ADRESSE}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {KARTEN_ZIELE.map((ziel) => (
                <a
                  key={ziel.label}
                  href={ziel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setKartenOffen(false)}
                  className="cc-gradient-button flex items-center justify-center rounded-xl border px-3 py-3 text-[11px] font-bold text-white"
                >
                  {ziel.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vier EIGENSTAENDIGE Buttons (2026-07-23). Der frueher umschliessende weisse Container
          entfiel, weil er die Flaechen zu einem Block verschmolz. Jeder Button traegt eigenen
          Radius, Rahmen und Schatten (Letztere aus `.cc-gradient-button`).
          `pointer-events-auto` sitzt bewusst auf den BUTTONS statt auf dem Grid: So lassen die
          Luecken dazwischen Klicks auf den Seiteninhalt dahinter durch. */}
      <div className="grid grid-cols-4 gap-2.5">
        <a href="tel:03412617790" className={buttonKlassen} aria-label="Anrufen">
          <Phone size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Anrufen</span>
        </a>
        <button type="button" onClick={() => scrollTo('contact-schaden')} className={buttonKlassen}>
          <AlertTriangle size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Schaden</span>
        </button>
        <button type="button" onClick={() => scrollTo('contact-termin')} className={buttonKlassen}>
          <CalendarClock size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Termin</span>
        </button>
        <button
          type="button"
          onClick={() => setKartenOffen((offen) => !offen)}
          aria-expanded={kartenOffen}
          aria-haspopup="dialog"
          aria-label="Navigation zur Werkstatt starten"
          className={buttonKlassen}
        >
          <Navigation size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Route</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileStickyCTA;
