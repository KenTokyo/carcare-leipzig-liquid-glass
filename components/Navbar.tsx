import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Menu, Phone, X } from 'lucide-react';

const logoSrc = '/assets/carcare-center-logo.webp';

const navLinks = [
  { label: 'Start', href: '/' },
  { label: 'Leistungen', href: '/leistungen' },
  { label: 'Wissen', href: '/autoaufbereitung-wissen' },
  { label: 'Unfall & Schaden', href: '/unfallinstandsetzung-leipzig' },
  { label: 'Geschäftskunden', href: '/geschaeftskunden' },
  { label: 'Karriere', href: '/karriere' },
  { label: 'Kontakt', href: '/kontakt' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return;

    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState(null, '', href);
      window.dispatchEvent(new Event('carcare:navigate'));
      setIsOpen(false);
      return;
    }

    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const offset = 86;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    window.history.pushState(null, '', href);
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 md:px-6">
        <motion.div
          animate={{
            boxShadow: scrolled ? '0 18px 45px -28px rgb(var(--cc-carbon-rgb) / 0.3)' : '0 0 0 rgb(var(--cc-carbon-rgb) / 0)',
          }}
          className="mx-auto flex h-[4.75rem] max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/90 px-4 backdrop-blur-xl md:px-6"
        >
          <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center">
            <span className="block h-12 w-[168px] overflow-hidden rounded-xl bg-white ring-1 ring-blue-100 sm:w-[196px] xl:w-[218px]">
              <img
                src={logoSrc}
                alt="CarCare Center"
                className="h-full w-full object-cover object-center"
                decoding="async"
                loading="eager"
              />
            </span>
          </a>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600 transition-colors hover:text-blue-700"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="tel:+493412617790"
              className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-950 transition-colors hover:border-blue-200 hover:text-blue-700 xl:inline-flex"
            >
              <Phone size={15} />
              0341 - 261 77 90
            </a>
            <a
              href="/kontakt#contact-schaden"
              onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden')}
              className="hidden items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-blue-700 md:inline-flex"
            >
              <AlertTriangle size={15} />
              Schaden melden
            </a>
            <button
              type="button"
              aria-label="Menü öffnen"
              onClick={() => setIsOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-950 text-white lg:hidden"
            >
              <Menu size={21} />
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white px-6 py-5 lg:hidden"
          >
            <div className="mb-10 flex items-center justify-between">
              <div className="block h-14 w-[212px] overflow-hidden rounded-xl bg-white ring-1 ring-blue-100">
                <img
                  src={logoSrc}
                  alt="CarCare Center"
                  className="h-full w-full object-cover object-center"
                  decoding="async"
                />
              </div>
              <button type="button" aria-label="Menü schließen" onClick={() => setIsOpen(false)} className="rounded-full bg-gray-50 p-3">
                <X size={22} />
              </button>
            </div>

            <nav aria-label="Mobile Navigation" className="flex flex-col gap-5">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="border-b border-gray-100 pb-4 text-3xl font-semibold tracking-tight text-gray-950"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <div className="mt-10 grid grid-cols-1 gap-3">
              <a href="/kontakt#contact-schaden" onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden')} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-bold text-white">
                <AlertTriangle size={17} />
                Schaden melden
              </a>
              <a href="tel:+493412617790" className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-4 text-sm font-bold text-gray-950">
                <Phone size={17} />
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
