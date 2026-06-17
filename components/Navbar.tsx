import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Menu,
  Phone,
  X,
  ChevronRight
} from 'lucide-react';

const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';
const logoWordmarkSrc = '/assets/carcare-center-wordmark.png';

const navLinks = [
  { label: 'Leistungen', href: '/leistungen', hasDropdown: true, dropdownKey: 'leistungen' },
  { label: 'Wissen', href: '/autoaufbereitung-wissen' },
  { label: 'Karriere', href: '/karriere' },
  { label: 'Kontakt', href: '/kontakt', hasDropdown: true, dropdownKey: 'kontakt' },
];

const desktopLeftLinks = navLinks.slice(0, 2);
const desktopRightLinks = navLinks.slice(2);

const navActionClass =
  'cc-gradient-button group inline-flex h-11 w-11 items-center justify-start overflow-hidden whitespace-nowrap rounded-[20px] border text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition-[width,filter,transform,box-shadow] duration-300 hover:w-[168px] focus-visible:w-[168px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cc-ice-blue)]';
const navActionIconClass = 'flex h-11 w-11 shrink-0 items-center justify-center';
const navActionLabelClass =
  'max-w-0 overflow-hidden pr-0 opacity-0 transition-[max-width,opacity,padding] duration-200 group-hover:max-w-[112px] group-hover:pr-3 group-hover:opacity-100 group-focus-visible:max-w-[112px] group-focus-visible:pr-3 group-focus-visible:opacity-100';

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

  const renderDesktopNavLink = (link: (typeof navLinks)[number]) => {
    const hasDropdown = link.hasDropdown;
    const isOpen = activeDropdown === link.dropdownKey;

    return (
      <div key={link.href} className="relative flex h-full items-center py-4">
        {hasDropdown ? (
          <button
            onClick={(e) => handleDropdownToggle(link.dropdownKey!, e)}
            className={`flex items-center gap-1.5 whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.13em] transition-colors duration-200 ${
              isOpen ? 'text-[var(--cc-carbon)]' : 'text-[var(--cc-carbon)] hover:text-[var(--cc-carbon)]'
            }`}
          >
            <span>{link.label}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-block"
            >
              <ChevronRight size={12} className="rotate-90 text-[rgb(var(--cc-carbon-rgb)/0.72)]" />
            </motion.span>
          </button>
        ) : (
          <a
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href, true)}
            className="whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.13em] text-[var(--cc-carbon)] transition-colors hover:text-[var(--cc-carbon)]"
          >
            {link.label}
          </a>
        )}

        {hasDropdown && (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute top-[calc(100%+12px)] left-1/2 z-50 flex w-72 -translate-x-1/2 flex-col gap-0.5 rounded-[20px] border border-white/80 bg-white/90 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-2xl pointer-events-auto"
              >
                <div className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-white/60 bg-white" />
                {dropdownItems[link.dropdownKey!].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href, true)}
                    className="group flex flex-col rounded-xl p-2.5 transition-colors hover:bg-gray-50/80"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--cc-carbon)] transition-colors group-hover:text-[var(--cc-carbon)]">
                      {item.label}
                    </span>
                    <span className="mt-0.5 text-[9.5px] font-medium leading-normal text-[rgb(var(--cc-graphite-rgb)/0.72)]">
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
          <a
            href="/"
            onClick={(e) => handleLinkClick(e, '/', true)}
            aria-label="CarCare Center Startseite"
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span className="flex h-12 w-[152px] items-center justify-center gap-1 overflow-hidden rounded-xl bg-white pl-2 pr-2.5 sm:w-[176px] sm:pl-2.5 sm:pr-3 xl:w-[184px]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg sm:h-11 sm:w-11">
                <video
                  src={logoMarkVideoSrc}
                  className="h-full w-full object-contain object-center"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </span>
              <span className="flex h-10 min-w-0 flex-1 items-center justify-center overflow-hidden sm:h-11">
                <img
                  src={logoWordmarkSrc}
                  alt="CarCare Center"
                  className="h-[82%] w-full object-contain object-left"
                  decoding="async"
                  loading="eager"
                />
              </span>
            </span>
          </a>

          {/* Desktop navigation with inline dropdowns */}
          <nav
            aria-label="Hauptnavigation links"
            className="absolute top-1/2 z-20 hidden -translate-y-1/2 items-center justify-end gap-5 xl:flex"
            style={{ right: 'calc(50% + 124px)' }}
          >
            <a
              href="/kontakt#contact-schaden"
              onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden', true)}
              aria-label="Schaden melden"
              className={navActionClass}
            >
              <span className={navActionIconClass}>
                <AlertTriangle size={16} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className={navActionLabelClass}>Schaden melden</span>
            </a>
            {desktopLeftLinks.map(renderDesktopNavLink)}
          </nav>

          <nav
            aria-label="Hauptnavigation rechts"
            className="absolute top-1/2 z-20 hidden -translate-y-1/2 items-center justify-start gap-5 xl:flex"
            style={{ left: 'calc(50% + 124px)' }}
          >
            {desktopRightLinks.map(renderDesktopNavLink)}
            <a
              href="tel:+493412617790"
              aria-label="CarCare Center anrufen"
              className={navActionClass}
            >
              <span className={navActionIconClass}>
                <Phone size={16} strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className={navActionLabelClass}>Anrufen</span>
            </a>
          </nav>

          <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 justify-end md:right-6">
            {/* Mobile Hamburger toggle (visible below xl breakpoint) */}
            <button
              type="button"
              aria-label={isMobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 xl:hidden ${
                isMobileOpen
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/95 text-[var(--cc-carbon)] border border-gray-200 hover:border-blue-200 hover:text-[var(--cc-carbon)] shadow-sm'
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
                          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--cc-carbon)] block mb-2 px-1">
                            {link.label}
                          </span>
                          <div className="flex flex-col gap-2.5 pl-3">
                            {dropdownItems[link.dropdownKey!].map((subItem) => (
                              <a
                                key={subItem.href}
                                href={subItem.href}
                                onClick={(e) => handleLinkClick(e, subItem.href, true)}
                                className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--cc-carbon)] hover:text-[var(--cc-carbon)] transition-colors"
                              >
                                {subItem.label}
                                <span className="normal-case font-medium text-[10px] text-[rgb(var(--cc-graphite-rgb)/0.72)] block mt-0.5">{subItem.description}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href, true)}
                          className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--cc-carbon)] hover:text-[var(--cc-carbon)] transition-colors px-1"
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
                    className="cc-gradient-button flex items-center justify-center gap-2 rounded-full border py-3 text-xs font-bold uppercase tracking-[0.1em] text-white"
                  >
                    <Phone size={14} />
                    Direkt anrufen
                  </a>
                  <a
                    href="/kontakt#contact-schaden"
                    onClick={(e) => handleLinkClick(e, '/kontakt#contact-schaden', true)}
                    className="cc-gradient-button flex items-center justify-center gap-2 rounded-full border py-3 text-xs font-bold uppercase tracking-[0.1em] text-white"
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
