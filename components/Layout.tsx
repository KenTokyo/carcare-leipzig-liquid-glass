import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileStickyCTA from './MobileStickyCTA';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      const footer = document.querySelector('footer');
      if (!footer) {
        setFooterVisible(false);
        return;
      }
      const main = document.querySelector('main');
      const rect = footer.getBoundingClientRect();
      const mainBottom = main?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY;
      setFooterVisible(mainBottom <= 112 && rect.top <= 32 && rect.bottom > 112);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="carcare-shell-root min-h-screen text-gray-950 selection:bg-blue-600 selection:text-white">
      {/* Unified Solidroad Frame & Header HUD-Layer */}
      <div className="solidroad-shell-frame-container">
        {/* Borders */}
        <div className="solidroad-shell-border-left" />
        <div className="solidroad-shell-border-right" />
        <div className="solidroad-shell-border-bottom" />
        <div className="solidroad-shell-border-top" />

        {/* Corner Masks */}
        <div className="solidroad-shell-corner-tl" />
        <div className="solidroad-shell-corner-tr" />
        <div className="solidroad-shell-corner-bl" />
        <div className="solidroad-shell-corner-br" />

        {/* Integrativer Solidroad Header HUD-Layer */}
        <header className="solidroad-hud-layer absolute left-0 right-0 top-0 pointer-events-none">
          <div aria-hidden="true" className={`solidroad-nav-frame ${scrolled ? 'is-scrolled' : ''}`}>
            <div aria-hidden="true" className="solidroad-cutout-left" />
            <div aria-hidden="true" className="solidroad-cutout-right" />
          </div>
          <div aria-hidden="true" className={`solidroad-nav-cutouts ${footerVisible ? 'is-footer' : ''}`} />
          <Navbar />
        </header>
      </div>

      {/* overflow-clip (nicht -hidden): clippt horizontalen Überhang weiterhin, erzeugt aber KEINEN
          Scroll-Container. Das ist die Voraussetzung dafuer, dass `position: sticky` in Sektionen
          (z. B. AccidentDamageSection-Pin) wieder am Viewport haftet statt an <main>. `overflow-x:hidden`
          erzwang computed `overflow-y:auto` → Phantom-Scroll-Container → Sticky gebrochen (empirisch
          belegt: docs/accident-scrollytelling/tasks/2026-07-19-pin-jitter-fix-tasks.md). */}
      <main className="site-main-shell relative z-10 overflow-clip bg-white">
        {children}
      </main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
};

export default Layout;
