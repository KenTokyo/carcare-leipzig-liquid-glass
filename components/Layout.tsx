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
      {/* Unified Solidroad Frame Border-Layer (With 3D Filter Shadow) */}
      <div className="solidroad-shell-border-container">
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
      </div>

      {/* Integrativer Solidroad Header HUD-Layer (Separated to fix Chrome Backdrop-Filter bug) */}
      <header className="solidroad-hud-layer fixed left-0 right-0 top-0 z-50 pointer-events-none">
        <div aria-hidden="true" className={`solidroad-nav-frame ${scrolled ? 'is-scrolled' : ''}`}>
          <div aria-hidden="true" className="solidroad-cutout-left" />
          <div aria-hidden="true" className="solidroad-cutout-right" />
        </div>
        <div aria-hidden="true" className={`solidroad-nav-cutouts ${footerVisible ? 'is-footer' : ''}`} />
        <Navbar />
      </header>

      <main className="site-main-shell relative z-10 overflow-x-hidden bg-white">
        {children}
      </main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
};

export default Layout;
