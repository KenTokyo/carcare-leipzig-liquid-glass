import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, AlertTriangle } from 'lucide-react';

const navLinks = [
  { label: 'Start', href: '#home' },
  { label: 'Leistungen', href: '#services' },
  { label: 'Unfall & Schaden', href: '#unfall' },
  { label: 'Geschäftskunden', href: '#geschaeft' },
  { label: 'Wissen', href: '#wissen' },
  { label: 'Karriere', href: '#jobs' },
  { label: 'Kontakt', href: '#contact' },
];

// Scroll-Threshold ab dem die Pill-Transformation komplett ist.
// Längere Range = sanfterer Übergang, kürzere = "schneller Snap".
const SCROLL_RANGE = [0, 140];

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  // --- Pill-Transformation (Desktop) ---
  // Width: Full-Bleed → kompakte Pille (max 1280px / ~88%)
  const width = useTransform(scrollY, SCROLL_RANGE, ['100%', '88%']);
  const maxWidth = useTransform(scrollY, SCROLL_RANGE, ['1920px', '1280px']);

  // Float: rutscht beim Scrollen nach unten weg vom Viewport-Rand
  const top = useTransform(scrollY, SCROLL_RANGE, ['0px', '18px']);

  // Höhe: prominent (Hero) → kompakt (Pill)
  const height = useTransform(scrollY, SCROLL_RANGE, ['6rem', '4.25rem']);

  // Pill-Shape: rechteckig → komplett rund
  const borderRadius = useTransform(scrollY, SCROLL_RANGE, ['0px', '9999px']);

  // Glas: transparent → Premium White-Glass
  const backgroundColor = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']
  );
  const backdropFilter = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['blur(0px) saturate(100%)', 'blur(20px) saturate(180%)']
  );

  // Hairline-Border: keiner → subtile Glass-Kante
  const borderColor = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['rgba(255,255,255,0)', 'rgba(17, 24, 39, 0.06)']
  );

  // Premium Schlagschatten
  const boxShadow = useTransform(
    scrollY,
    SCROLL_RANGE,
    [
      '0 0 0 0 rgba(0,0,0,0)',
      '0 20px 50px -20px rgba(17,24,39,0.18), 0 8px 24px -12px rgba(17,24,39,0.12)',
    ]
  );

  // Hero-Lesbarkeit: Top-Vignette wenn navbar transparent
  const backgroundGradient = useTransform(
    scrollY,
    [0, 60],
    [
      'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)',
      'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 100%)',
    ]
  );

  // Padding skaliert leicht mit (innen weniger Luft im kompakten Zustand)
  const paddingX = useTransform(scrollY, SCROLL_RANGE, ['3rem', '1.75rem']);

  // Farb-Crossfade Text: weiss (Hero) → gray-900 (Pill)
  const textColor = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['rgba(255, 255, 255, 1)', 'rgba(17, 24, 39, 1)']
  );

  // CTA-Button (Telefon) Crossfade
  const buttonBg = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['rgba(255, 255, 255, 0.12)', 'rgba(243, 244, 246, 1)']
  );
  const buttonText = useTransform(
    scrollY,
    SCROLL_RANGE,
    ['rgba(255, 255, 255, 1)', 'rgba(17, 24, 39, 1)']
  );

  useEffect(() => {
    const checkResize = () => setIsDesktop(window.innerWidth > 1024);
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  // Synchroner Flag wann die Pill "eingerastet" ist (für conditional Styles/Spacing)
  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      const next = v > SCROLL_RANGE[1] * 0.6;
      setIsCompact((prev) => (prev === next ? prev : next));
    });
    return () => unsub();
  }, [scrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.header
          style={
            isDesktop
              ? {
                  width,
                  maxWidth,
                  top,
                  height,
                  borderRadius,
                  backgroundColor,
                  backdropFilter,
                  WebkitBackdropFilter: backdropFilter,
                  boxShadow,
                  backgroundImage: backgroundGradient,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor,
                }
              : {
                  width: '100%',
                  top: 0,
                  height: '4.5rem',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(14px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(180%)',
                  borderBottom: '1px solid rgba(17,24,39,0.06)',
                }
          }
          className="pointer-events-auto will-change-transform"
        >
          <motion.div
            style={isDesktop ? { paddingLeft: paddingX, paddingRight: paddingX } : {}}
            className="h-full w-full px-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          >
            {/* Left: Brand */}
            <div className="flex justify-start">
              <motion.a
                href="#home"
                onClick={(e) => handleNavClick(e, '#home')}
                className="flex items-center gap-3 group"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    width: isDesktop && isCompact ? 36 : 40,
                    height: isDesktop && isCompact ? 36 : 40,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="bg-white rounded-full flex items-center justify-center text-gray-900 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
                >
                  <span className="font-bold text-lg">C</span>
                </motion.div>
                <motion.span
                  style={{ color: isDesktop ? textColor : '#111827' }}
                  className="font-bold text-xl tracking-tight uppercase hidden sm:block"
                >
                  CarCare
                </motion.span>
              </motion.a>
            </div>

            {/* Center: Navigation */}
            <div className="flex justify-center">
              {isDesktop ? (
                <nav className="flex items-center gap-5 xl:gap-7">
                  {navLinks.map((link) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      style={{ color: textColor }}
                      className="text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.18em] xl:tracking-[0.2em] hover:opacity-70 transition-opacity relative group whitespace-nowrap cursor-pointer"
                    >
                      {link.label}
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full" />
                    </motion.a>
                  ))}
                </nav>
              ) : null}
            </div>

            {/* Right: Actions */}
            <div className="flex justify-end items-center gap-2 xl:gap-3">
              <motion.a
                href="#contact-schaden"
                onClick={(e) => handleNavClick(e, '#contact-schaden')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-900 text-white hover:bg-black transition-colors whitespace-nowrap cursor-pointer shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)]"
              >
                <AlertTriangle size={14} />
                <span>Schaden melden</span>
              </motion.a>

              <motion.a
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                style={
                  isDesktop
                    ? { backgroundColor: buttonBg, color: buttonText }
                    : {}
                }
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-900 hover:!text-white transition-colors duration-300 whitespace-nowrap cursor-pointer"
              >
                <Phone size={14} />
                <span>0341 - 261 77 90</span>
              </motion.a>

              {/* Mobile Menu Trigger */}
              <button
                aria-label="Menü öffnen"
                className="lg:hidden p-2 text-gray-900 bg-white/90 rounded-full shadow-sm ring-1 ring-black/5"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </motion.div>
        </motion.header>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white p-6 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white">
                  <span className="font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-lg text-gray-900">CarCare</span>
              </div>
              <button
                aria-label="Menü schließen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-gray-50 rounded-full"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08 }}
                  className="text-3xl font-light text-gray-900"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-auto pb-8">
              <p className="text-gray-400 text-sm mb-2">Kontaktieren Sie uns</p>
              <a
                href="tel:03412617790"
                className="text-xl font-bold text-gray-900"
              >
                0341 - 261 77 90
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
