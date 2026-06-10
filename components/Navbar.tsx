import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Menu,
  Phone,
  X,
  ChevronRight
} from 'lucide-react';

const logoSrc = '/assets/carcare-center-logo.webp';

const navLinks = [
  { label: 'Start', href: '/' },
  { label: 'Leistungen', href: '/leistungen', hasDropdown: true, dropdownKey: 'leistungen' },
  { label: 'Wissen', href: '/autoaufbereitung-wissen' },
  { label: 'Karriere', href: '/karriere' },
  { label: 'Kontakt', href: '/kontakt', hasDropdown: true, dropdownKey: 'kontakt' },
];

const dropdownItems: Record<string, { label: string; description: string; href: string }[]> = {
  leistungen: [
    {
      label: 'Fahrzeugaufbereitung',
      description: 'Lackschutz, Keramik & Premium-Pflege',
      href: '/fahrzeugaufbereitung-leipzig',
    },
    {
      label: 'Unfallinstandsetzung',
      description: 'Smart Repair & Karosseriearbeiten',
      href: '/unfallinstandsetzung-leipzig',
    },
    {
      label: 'Geschäftskunden',
      description: 'Fuhrparkservice & Autohaus-Lösungen',
      href: '/geschaeftskunden',
    },
    {
      label: 'Leistungen Übersicht',
      description: 'Unser gesamtes Portfolio im Überblick',
      href: '/leistungen',
    },
  ],
  kontakt: [
    {
      label: 'Kontakt & Anfahrt',
      description: 'Ansprechpartner & Standort Leipzig',
      href: '/kontakt',
    },
    {
      label: 'Schaden melden',
      description: 'Online Schadenformular ausfüllen',
      href: '/kontakt#contact-schaden',
    },
    {
      label: 'Direkt anrufen',
      description: '0341 - 261 77 90',
      href: 'tel:+493412617790',
    },
  ],
};

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Click outside and escape key handling
  useEffect(() => {
    if (!activeDropdown && !isMobileOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (navbarRef.current && !navbarRef.current.contains(target)) {
        setActiveDropdown(null);
        setIsMobileOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeDropdown, isMobileOpen]);

  const handleDropdownToggle = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, closeAll = false) => {
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return;

    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState(null, '', href);
      window.dispatchEvent(new Event('carcare:navigate'));
      if (closeAll) {
        setActiveDropdown(null);
        setIsMobileOpen(false);
      }
      return;
    }

    if (!href.startsWith('#')) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    const offset = 86;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    window.history.pushState(null, '', href);
    if (closeAll) {
      setActiveDropdown(null);
      setIsMobileOpen(false);
    }
  };

  return (
    <motion.div
      ref={navbarRef}
      animate={{
        y: 0,
      }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className="solidroad-nav-shell pointer-events-auto mx-auto grid grid-cols-[auto_auto] items-center justify-between px-3 h-[4.85rem] max-w-[1000px] md:h-[6.25rem] md:px-6 xl:grid-cols-[1fr_auto_1fr] xl:justify-items-stretch relative"
    >
          <a href="/" onClick={(e) => handleLinkClick(e, '/', true)} className="flex items-center justify-start xl:justify-self-start">
            <span className="block h-12 w-[152px] overflow-hidden rounded-xl bg-white sm:w-[176px] xl:w-[184px]">
              <img
                src={logoSrc}
                alt="CarCare Center"
                className="h-full w-full object-cover object-center"
                decoding="async"
                loading="eager"
              />
            </span>
          </a>

          {/* Desktop navigation with inline dropdowns */}
          <nav aria-label="Hauptnavigation" className="hidden items-center justify-center gap-6 xl:flex h-full justify-self-center">
            {navLinks.map((link) => {
              const hasDropdown = link.hasDropdown;
              const isOpen = activeDropdown === link.dropdownKey;
              return (
                <div key={link.href} className="relative flex items-center h-full py-4">
                  {hasDropdown ? (
                    <button
                      onClick={(e) => handleDropdownToggle(link.dropdownKey!, e)}
                      className={`flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 ${
                        isOpen ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      <span>{link.label}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="inline-block"
                      >
                        <ChevronRight size={10} className="rotate-90 text-gray-400" />
                      </motion.span>
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href, true)}
                      className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-blue-700"
                    >
                      {link.label}
                    </a>
                  )}

                  {/* Inline Dropdown for individual links */}
                  {hasDropdown && (
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-72 rounded-[20px] border border-white/80 bg-white/90 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl z-50 pointer-events-auto flex flex-col gap-0.5"
                        >
                          <div className="absolute -top-1 w-2.5 h-2.5 bg-white border-t border-l border-white/60 rotate-45 left-1/2 -translate-x-1/2" />
                          {dropdownItems[link.dropdownKey!].map((item) => (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={(e) => handleLinkClick(e, item.href, true)}
                              className="group flex flex-col rounded-xl p-2.5 transition-colors hover:bg-gray-50/80"
                            >
                              <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-gray-900 group-hover:text-blue-700 transition-colors">
                                {item.label}
                              </span>
                              <span className="text-[9.5px] text-gray-500 font-medium mt-0.5 leading-normal">
                                {item.description}
                              </span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 justify-end xl:justify-self-end">
            <a
              href="tel:+493412617790"
              className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-gray-200 bg-white/90 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gray-950 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700 xl:inline-flex"
            >
              <Phone size={15} />
              0341 - 261 77 90
            </a>
            <a
              href="/kontakt#contact-schaden"
              onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden', true)}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-blue-600 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_18px_34px_-22px_rgb(var(--cc-trust-blue-rgb)/0.95)] transition-colors hover:bg-blue-700 md:inline-flex"
            >
              <AlertTriangle size={15} />
              Schaden melden
            </a>

            {/* Mobile Hamburger toggle (visible below xl breakpoint) */}
            <button
              type="button"
              aria-label={isMobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 xl:hidden ${
                isMobileOpen
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/95 text-gray-950 border border-gray-200 hover:border-blue-200 hover:text-blue-700 shadow-sm'
              }`}
            >
              {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* modern mobile menu dropdown slider */}
          <AnimatePresence>
            {isMobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[calc(100%+12px)] right-3 left-3 w-[calc(100vw-24px)] rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl z-50 pointer-events-auto overflow-hidden xl:hidden"
              >
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <div key={link.href} className="flex flex-col border-b border-gray-100/50 pb-3 last:border-0 last:pb-0">
                      {link.hasDropdown ? (
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-gray-400 block mb-2 px-1">
                            {link.label}
                          </span>
                          <div className="flex flex-col gap-2.5 pl-3">
                            {dropdownItems[link.dropdownKey!].map((subItem) => (
                              <a
                                key={subItem.href}
                                href={subItem.href}
                                onClick={(e) => handleLinkClick(e, subItem.href, true)}
                                className="text-xs font-bold uppercase tracking-[0.06em] text-gray-800 hover:text-blue-700 transition-colors"
                              >
                                {subItem.label}
                                <span className="normal-case font-medium text-[10px] text-gray-500 block mt-0.5">{subItem.description}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href, true)}
                          className="text-xs font-extrabold uppercase tracking-[0.12em] text-gray-950 hover:text-blue-700 transition-colors px-1"
                        >
                          {link.label}
                        </a>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-5 border-t border-gray-100 pt-4 flex flex-col gap-2">
                  <a
                    href="tel:+493412617790"
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-250 bg-white py-3 text-xs font-bold uppercase tracking-[0.1em] text-gray-950"
                  >
                    <Phone size={14} />
                    Direkt anrufen
                  </a>
                  <a
                    href="/kontakt#contact-schaden"
                    onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden', true)}
                    className="flex items-center justify-center gap-2 rounded-full bg-blue-600 py-3 text-xs font-bold uppercase tracking-[0.1em] text-white"
                  >
                    <AlertTriangle size={14} />
                    Schaden melden
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
