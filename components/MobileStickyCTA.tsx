import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, AlertTriangle, CalendarClock } from 'lucide-react';

const MobileStickyCTA: React.FC = () => {
  const [nearBottom, setNearBottom] = useState(false);

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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: nearBottom ? 120 : 0, opacity: nearBottom ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 24 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-3 pt-2 pointer-events-none"
    >
      <div className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] grid grid-cols-3 overflow-hidden">
        <a
          href="tel:03412617790"
          className="flex flex-col items-center justify-center gap-1 py-3 active:bg-gray-100 transition-colors"
          aria-label="Anrufen"
        >
          <Phone size={18} className="text-gray-900" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-900">Anrufen</span>
        </a>
        <button
          type="button"
          onClick={() => scrollTo('contact-schaden')}
          className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-900 text-white active:bg-black transition-colors"
        >
          <AlertTriangle size={18} />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Schaden</span>
        </button>
        <button
          type="button"
          onClick={() => scrollTo('contact-termin')}
          className="flex flex-col items-center justify-center gap-1 py-3 active:bg-gray-100 transition-colors"
        >
          <CalendarClock size={18} className="text-gray-900" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-900">Termin</span>
        </button>
      </div>
    </motion.div>
  );
};

export default MobileStickyCTA;
