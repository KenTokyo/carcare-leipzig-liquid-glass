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
      {/* Global White Page Frame */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-[var(--cc-shell-gap)] bg-white" />
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-[var(--cc-shell-gap)] bg-white" />
        {/* Bottom border */}
        <div className="absolute left-0 right-0 bottom-0 h-[var(--cc-shell-gap)] bg-white" />
        {/* Top border (Rail) */}
        <div className="absolute left-0 right-0 top-0 h-[var(--cc-shell-gap)] bg-white" />

        {/* Top-Left Corner Mask */}
        <div className="absolute left-[var(--cc-shell-gap)] top-[var(--cc-shell-gap)] w-[var(--cc-shell-radius)] h-[var(--cc-shell-radius)] rounded-tl-[var(--cc-shell-radius)] shadow-[-20px_-20px_0_20px_#ffffff]" />
        {/* Top-Right Corner Mask */}
        <div className="absolute right-[var(--cc-shell-gap)] top-[var(--cc-shell-gap)] w-[var(--cc-shell-radius)] h-[var(--cc-shell-radius)] rounded-tr-[var(--cc-shell-radius)] shadow-[20px_-20px_0_20px_#ffffff]" />
        {/* Bottom-Left Corner Mask */}
        <div className="absolute left-[var(--cc-shell-gap)] bottom-[var(--cc-shell-gap)] w-[var(--cc-shell-radius)] h-[var(--cc-shell-radius)] rounded-bl-[var(--cc-shell-radius)] shadow-[-20px_20px_0_20px_#ffffff]" />
        {/* Bottom-Right Corner Mask */}
        <div className="absolute right-[var(--cc-shell-gap)] bottom-[var(--cc-shell-gap)] w-[var(--cc-shell-radius)] h-[var(--cc-shell-radius)] rounded-br-[var(--cc-shell-radius)] shadow-[20px_20px_0_20px_#ffffff]" />
      </div>

      {/* Integrativer Solidroad Header HUD-Layer */}
      <header className="solidroad-hud-layer fixed left-0 right-0 top-0 z-50 pointer-events-none">
        <div aria-hidden="true" className="solidroad-header-rail" />
        <div aria-hidden="true" className={`solidroad-nav-frame ${scrolled ? 'is-scrolled' : ''}`} />
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
