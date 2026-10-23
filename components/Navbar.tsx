import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, Search, X } from 'lucide-react';
import NavMegaMenu, { NAV_MEGA_PANEL_ID } from './NavMegaMenu';
import { navSections } from '../data/navigation';
import { ExternMarke, externAttribute, istExtern } from './ExternerLink';
import { SUCHE_EREIGNIS, oeffneSuche } from '../lib/suche';
import { getLenis } from '../hooks/useSmoothScroll';

/**
 * Animiertes Markenzeichen, auch in Footer und Zielgruppenkarten. Seit 2026-10-05 160 × 160 px, 30 fps, ohne Tonspur, 33 KB.
 * Vorher 720 × 720 px, 60 fps, mit Stereoton, 1,6 MB, fuer eine Anzeige von hoechstens 44 px und bis zu fuenf gleichzeitige
 * Decoder pro Seite. Befehl und Vergleich: docs/performance/tasks/2026-10-05-ruckeln-und-cta-glas-tasks.md.
 */
const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';
const logoWordmarkSrc = '/assets/carcare-center-wordmark.png';

const navLinks = [
  { label: 'Leistungen', href: '/leistungen', hasDropdown: true, dropdownKey: 'leistungen' },
  { label: 'Wissen', href: '/autoaufbereitung-wissen' },
  { label: 'Über uns', href: '/ueber-uns' },
  { label: 'Karriere', href: '/karriere' },
  { label: 'Kontakt', href: '/kontakt', hasDropdown: true, dropdownKey: 'kontakt' },
];

/**
 * Die Teilung ist NICHT beliebig: Das Logo steht auf Desktop mittig zwischen beiden
 * Haelften. Mit vier Eintraegen war 2/2 symmetrisch; „Über uns" (Backlog 1.25) macht es
 * zu fuenf. Deshalb 3/2 statt 2/3 — „Über uns" schliesst die linke, inhaltliche Haelfte
 * ab, waehrend „Karriere" und „Kontakt" rechts die handlungsnahen Ziele bleiben.
 * Wer hier einen Eintrag ergaenzt, entscheidet die Teilung mit.
 */
const desktopLeftLinks = navLinks.slice(0, 3);
const desktopRightLinks = navLinks.slice(3);

/*
 * KEINE AKTIONSKNOEPFE MEHR IN DER NAVBAR (Wunsch des Users vom 2026-09-24, „komplett raus"):
 * „Schaden melden" stand links, „Anrufen" rechts, je als Kreis, der beim Ueberfahren seine
 * Beschriftung ausklappte. Beide sitzen jetzt dauerhaft in der weissen Aussparung oben rechts
 * (`AktionsAussparung`, ab `lg`) bzw. unten in der Leiste (`MobileStickyCTA`, darunter). An ihrer
 * Stelle rechts: die globale Suche.
 */
const suchKreis =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-[var(--cc-carbon)] shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cc-ice-blue)]';

/** Ab hier steht die Desktop-Navigation; das Hamburger-Menue ist `xl:hidden`. */
const DESKTOP_NAVIGATION = '(min-width: 1280px)';

/*
 * HOEHE DES MOBILEN MENUES (R34, 2026-10-19). Bis dahin ohne Grenze und `overflow: hidden`: 995 px hoch in der festen
 * Ebene, also nicht scrollbar. Bei 393 × 659 (iPhone in Safari) lagen ab „Wissen“ alle Eintraege ausserhalb, bei 390 × 844
 * „Karriere“ unter der Knopfleiste; ein Wischen ueber dem Menue scrollte die Seite dahinter.
 * Jetzt scrollt der Inhalt in sich und endet ueber der Knopfleiste. Abgezogen werden:
 *   oben   Navbar 4,85 rem, ab 768 px 6,25 rem (wie `h-[4.85rem] md:h-[6.25rem]` der Navbar) und 12 px Abstand
 *          (`top-[calc(100%+12px)]`),
 *   unten  Knopfleiste `MobileStickyCTA` und 12 px; ab 1024 px gibt es sie nicht (`lg:hidden`), dann nur die 12 px.
 *          Die Leiste ist 83 px hoch (gemessen bei 390, 393 und 768 px Breite), davon 3 rem Abstaende (`pt-2`, `pb-3`, je
 *          Knopf `py-3` und `gap-1`) und 35 px fest (Symbol 18, Textzeile 15, Rand 2). Deshalb `3rem + 47px` statt 95 px:
 *          Mit groesserer Grundschrift (Android „Textgroesse“, Chrome „Schriftgroesse“) waechst die Leiste mit, bei 20 px auf
 *          95, bei 24 px auf 107 px; mit festen 95 px lag das Menue dann 2 bzw. 14 px ueber ihr.
 * `svh` ist das Fenster mit eingeblendeten Browserleisten (Safari, Chrome mobil): so passt das Menue immer, auch beim
 * Laden. `vh` davor nur als Rueckfall fuer Browser ohne `svh` (Safari unter 15.4, Chrome unter 108). Aendert sich die
 * Leiste, meldet `npm run nav` es (Menue muss ueber ihr enden).
 */
const menueHoehe =
  '[--cc-menue-oben:calc(4.85rem_+_12px)] md:[--cc-menue-oben:calc(6.25rem_+_12px)] [--cc-menue-unten:calc(3rem_+_47px)] lg:[--cc-menue-unten:12px] ' +
  'max-h-[calc(100vh_-_var(--cc-menue-oben)_-_var(--cc-menue-unten))] ' +
  'supports-[height:1svh]:max-h-[calc(100svh_-_var(--cc-menue-oben)_-_var(--cc-menue-unten))]';

/** Pfad ohne Schraegstrich am Ende, wie `normalizePath` in App.tsx. */
const aktuellerPfad = () => window.location.pathname.replace(/\/+$/, '') || '/';

const Navbar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  // Click outside and escape key handling
  useEffect(() => {
    if (!activeDropdown && !isMobileOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      /*
       * Ein Ziel, das nicht mehr im Dokument haengt, kann nicht "ausserhalb" sein — es
       * wurde von unserem eigenen Neuzeichnen entfernt.
       *
       * DER FALL, DEN DAS BEHEBT (gemessen am 2026-09-07, mobil, 390 px): Ein Tipp auf
       * das Hamburger-Icon oeffnete das Menue und schloss es sofort wieder. Der Ablauf:
       * Der Klick trifft das `path`-Element im SVG. React setzt `isMobileOpen`, tauscht
       * dabei das Icon `Menu` gegen `X` — das getroffene `path` verschwindet also mitten
       * in der Ereignisausbreitung. Wenn derselbe Klick danach `document` erreicht, ist
       * `target` losgeloest, `contains()` meldet false, und dieser Handler schliesst das
       * gerade geoeffnete Menue. Ein Tipp auf die Polsterung neben dem Icon funktionierte,
       * ein Tipp auf das Icon selbst nicht — deshalb wirkte es wie ein Wackelkontakt.
       */
      if (!target.isConnected) return;
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

  /*
   * SEITE HINTER DEM OFFENEN MENUE FESTHALTEN (R34, 2026-10-19), gleiches Muster wie AnfrageDialog und SuchDialog:
   * Lenis anhalten (verwirft Rad und Wischen ausserhalb des Menues) und `body` sperren (Tastatur, Scrollleiste, und ein
   * Menue, das ganz ins Fenster passt und deshalb nichts zu scrollen hat). Im Menue selbst kommt Lenis nicht zum Zug
   * (`data-lenis-prevent` am Scrollbehaelter), dort scrollt der Browser nativ, `overscroll-behavior: contain` haelt am
   * Ende an. Freigabe in umgekehrter Reihenfolge wie in `usePreloader`: erst `body`, dann Lenis.
   * Die Sperre darf nie ohne sichtbares Menue stehen bleiben, deshalb schliesst es
   *   - bei jedem Seitenwechsel (Zurueck-Geste, Treffer der Suche): sonst bliebe Lenis gestoppt, und der Sprung nach
   *     oben auf der neuen Seite (App.tsx, `scrollTo` ohne `force`) fiele aus,
   *   - wenn die Suche aufgeht: Sie sperrt und entsperrt selbst und gaebe Lenis beim Schliessen frei, waehrend das Menue
   *     noch offen waere,
   *   - ab 1280 px Fensterbreite: dort ist es `xl:hidden`.
   */
  useEffect(() => {
    if (!isMobileOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    const vorherigerUeberlauf = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const schliessen = () => setIsMobileOpen(false);
    const breit = window.matchMedia(DESKTOP_NAVIGATION);
    const beiBreite = () => {
      if (breit.matches) schliessen();
    };
    window.addEventListener('popstate', schliessen);
    window.addEventListener('carcare:navigate', schliessen);
    window.addEventListener(SUCHE_EREIGNIS, schliessen);
    breit.addEventListener('change', beiBreite);
    return () => {
      window.removeEventListener('popstate', schliessen);
      window.removeEventListener('carcare:navigate', schliessen);
      window.removeEventListener(SUCHE_EREIGNIS, schliessen);
      breit.removeEventListener('change', beiBreite);
      document.body.style.overflow = vorherigerUeberlauf;
      lenis?.start();
    };
  }, [isMobileOpen]);

  // Hover-Steuerung des Mega-Menüs. Der Close-Delay überbrückt die Lücke zwischen
  // Trigger und abgesetztem Panel, damit es beim Rüberfahren offen bleibt.
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (key: string) => {
    cancelClose();
    setActiveDropdown(key);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActiveDropdown(null), 140);
  };

  useEffect(() => cancelClose, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, closeAll = false) => {
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return;

    // Externe Ziele (reparatur.info, seit 2026-09-16): nichts abfangen — der Browser oeffnet
    // den neuen Tab selbst. Die Menues schliessen trotzdem, sonst steht beim Zurueckkommen
    // das mobile Menue noch offen.
    if (istExtern(href)) {
      if (closeAll) {
        setActiveDropdown(null);
        setIsMobileOpen(false);
      }
      return;
    }

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

  /**
   * DAS LOGO FUEHRT IMMER ZUR STARTSEITE, OBEN (R34, 2026-10-19).
   *
   * Bis dahin lief es ueber `handleLinkClick('/')`: `pushState('/')` plus `carcare:navigate`. Die App springt aber nur
   * nach oben, wenn sich der PFAD aendert (App.tsx, Effekt an `[path]`). Auf der Startseite selbst geschah deshalb nichts
   * (gemessen: `/` bei 2.500 px blieb bei 2.500, `/#faq` bei 15.241 px wurde zu `/` und blieb stehen, auch am Desktop).
   * Von Unterseiten bleibt der Weg wie er war. Auf der Startseite: Menues zu, Adresse ohne Anker, dann selbst nach oben
   * gleiten, wie der Suchdialog bei Treffern auf derselben Seite. Erst nach dem Schliessen, denn die Sperre des Menues
   * gibt Lenis frei, und `start()` setzt eine laufende Bewegung zurueck. Steht die Seite weiter als zwei Fenster unten,
   * zuerst ohne Bewegung auf ein Fenster Abstand: So laeuft die Seite nicht im Schnelldurchlauf durch alle Sektionen
   * (Bilder auf dem Weg wuerden nachgeladen, Ablauf-Animationen abgespielt).
   * Strg, ⌘, Umschalt oder Alt: Das gehoert dem Browser (neuer Tab, neues Fenster).
   */
  const zurStartseite = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    cancelClose();
    setActiveDropdown(null);
    setIsMobileOpen(false);

    if (aktuellerPfad() !== '/') {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new Event('carcare:navigate'));
      return;
    }
    if (window.location.hash || window.location.search) window.history.pushState(null, '', '/');
    window.setTimeout(() => {
      const lenis = getLenis();
      if (!lenis) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      if (window.scrollY > 2 * window.innerHeight) lenis.scrollTo(window.innerHeight, { immediate: true, force: true });
      lenis.scrollTo(0, { force: true });
    }, 50);
  };

  /**
   * Tab vom geoeffneten Trigger springt in das Mega-Menue statt zum naechsten Menuepunkt.
   *
   * WARUM UEBERHAUPT: Das Panel liegt im DOM hinter beiden `<nav>`-Bloecken, weil es sich
   * an der vollen Navbar-Breite ausrichtet. In der natuerlichen Tab-Reihenfolge kaeme es
   * also erst nach allen Menuepunkten — wer mit der Tastatur „Leistungen" oeffnet, landet
   * mit dem naechsten Tab bei „Wissen" und sieht die geoeffneten Inhalte nie.
   * Gegenrichtung (Shift+Tab aus der ersten Karte) sitzt in `NavMegaMenu`.
   */
  const handleTriggerTab = (e: React.KeyboardEvent<HTMLAnchorElement>, isOpen: boolean) => {
    if (e.key !== 'Tab' || e.shiftKey || !isOpen) return;
    const ersteKarte = document
      .getElementById(NAV_MEGA_PANEL_ID)
      ?.querySelector<HTMLAnchorElement>('a[href]');
    if (!ersteKarte) return;
    e.preventDefault();
    cancelClose();
    ersteKarte.focus();
  };

  const renderDesktopNavLink = (link: (typeof navLinks)[number]) => {
    const hasDropdown = link.hasDropdown;
    const isOpen = activeDropdown === link.dropdownKey;

    return (
      <div
        key={link.href}
        className="relative flex h-full items-center py-4"
        onMouseEnter={hasDropdown ? () => openMenu(link.dropdownKey!) : undefined}
        onMouseLeave={hasDropdown ? scheduleClose : undefined}
        onFocus={hasDropdown ? () => openMenu(link.dropdownKey!) : undefined}
        onBlur={hasDropdown ? scheduleClose : undefined}
      >
        <a
          href={link.href}
          id={hasDropdown ? `nav-trigger-${link.dropdownKey}` : undefined}
          onClick={(e) => handleLinkClick(e, link.href, true)}
          onKeyDown={hasDropdown ? (e) => handleTriggerTab(e, isOpen) : undefined}
          aria-haspopup={hasDropdown ? 'true' : undefined}
          aria-expanded={hasDropdown ? isOpen : undefined}
          aria-controls={hasDropdown && isOpen ? NAV_MEGA_PANEL_ID : undefined}
          className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-bold uppercase tracking-[var(--cc-nav-laufweite)] text-[var(--cc-carbon)] transition-colors hover:text-[var(--cc-carbon)]"
        >
          <span>{link.label}</span>
          {hasDropdown && (
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="inline-block"
            >
              <ChevronRight size={12} className="rotate-90 text-[rgb(var(--cc-carbon-rgb)/0.72)]" />
            </motion.span>
          )}
        </a>
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
      className="solidroad-nav-shell pointer-events-auto mx-auto grid grid-cols-[auto_auto] items-center justify-between px-3 h-[4.85rem] max-w-[var(--cc-nav-width)] md:h-[6.25rem] md:px-6 xl:grid-cols-[1fr_auto_1fr] xl:justify-items-stretch relative"
    >
          <a
            href="/"
            onClick={zurStartseite}
            aria-label="CarCare Center Startseite"
            className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          >
            <span className="flex h-12 w-[132px] items-center justify-center gap-1 overflow-hidden rounded-xl bg-white pl-2 pr-2.5 sm:w-[176px] sm:pl-2.5 sm:pr-3 xl:w-[184px]">
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

          {/* Desktop navigation with inline dropdowns. Einzug, Abstand und Laufweite kommen aus
              styles/aussparung.css: Zwischen 1280 und 1535 stehen die Links enger, damit der Reiter
              schmaler sein kann und rechts die beschriftete Aktions-Aussparung Platz hat. */}
          <nav
            aria-label="Hauptnavigation links"
            className="absolute top-1/2 z-20 hidden -translate-y-1/2 items-center justify-end gap-[var(--cc-nav-abstand)] xl:flex"
            style={{ right: 'calc(50% + var(--cc-nav-einzug))' }}
          >
            {desktopLeftLinks.map(renderDesktopNavLink)}
          </nav>

          <nav
            aria-label="Hauptnavigation rechts"
            className="absolute top-1/2 z-20 hidden -translate-y-1/2 items-center justify-start gap-[var(--cc-nav-abstand)] xl:flex"
            style={{ left: 'calc(50% + var(--cc-nav-einzug))' }}
          >
            {desktopRightLinks.map(renderDesktopNavLink)}
            {/* GLOBALE SUCHE rechts neben „Kontakt" (User 2026-09-24). Ab 1536 px als Feld, darunter
                als Kreis: Zwischen 1280 und 1535 ist der Reiter nur 810–840 px breit (Platz fuer die
                Aktions-Aussparung oben rechts, styles/aussparung.css), ein Feld liefe dort ueber
                seinen Rand hinaus — gemessen: rechte Haelfte 356 px ab Mitte mit Kreis, 433 px mit Feld. */}
            <button
              type="button"
              onClick={oeffneSuche}
              aria-label="Suche öffnen"
              aria-keyshortcuts="Control+K"
              className={`${suchKreis} min-[1536px]:w-auto min-[1536px]:justify-start min-[1536px]:gap-2.5 min-[1536px]:pl-3.5 min-[1536px]:pr-5`}
            >
              <Search size={16} strokeWidth={2.4} aria-hidden="true" />
              <span className="hidden text-[13px] font-medium text-gray-600 min-[1536px]:inline">Suchen …</span>
            </button>
          </nav>

          <NavMegaMenu
            activeKey={activeDropdown}
            sections={navSections}
            triggerId={activeDropdown ? `nav-trigger-${activeDropdown}` : null}
            onNavigate={handleLinkClick}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          />

          {/* Suche unter `xl`: LINKS im Reiter, spiegelbildlich zum Menue. Rechts daneben war kein
              Platz — mobil ist der Reiter 280 px breit, ein zweiter Knopf neben dem Menue ragte 34 px
              ins Logo (gemessen 2026-09-24 bei 390 px). */}
          <div className="absolute left-3 top-1/2 z-20 -translate-y-1/2 md:left-6 xl:hidden">
            <button type="button" onClick={oeffneSuche} aria-label="Suche öffnen" className={suchKreis}>
              <Search size={17} strokeWidth={2.4} aria-hidden="true" className="text-blue-600" />
            </button>
          </div>

          <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 items-center gap-2 justify-end md:right-6">
            {/* Mobile Hamburger toggle (visible below xl breakpoint) */}
            <button
              type="button"
              aria-label={isMobileOpen ? "Menü schließen" : "Menü öffnen"}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 xl:hidden ${
                isMobileOpen
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/95 text-blue-600 shadow-sm'
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
                className="absolute top-[calc(100%+12px)] right-3 left-3 w-auto rounded-3xl border border-black/[0.05] bg-white shadow-2xl z-50 pointer-events-auto overflow-hidden xl:hidden"
              >
                {/* Scrollbehaelter (R34): Hoehe siehe `menueHoehe`, Sperre der Seite im Effekt oben. Die Huelle drumherum
                    behaelt Auf- und Zuklappen, Rundung und Schatten. */}
                <div data-lenis-prevent className={`${menueHoehe} overflow-y-auto overscroll-contain p-5`}>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <div key={link.href} className="flex flex-col border-b border-gray-100/50 pb-3 last:border-0 last:pb-0">
                        {link.hasDropdown ? (
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--cc-carbon)] block mb-2 px-1">
                              {link.label}
                            </span>
                            {/*
                              Auf Touch gibt es kein Hover. Die dritte Ebene steht deshalb
                              dauerhaft offen statt hinter einer Geste — die Frage „was
                              gehoert darunter?" ist damit ohne Tippen beantwortet.
                            */}
                            <div className="flex flex-col gap-3.5 pl-3">
                              {navSections[link.dropdownKey!].cards.map((card) => (
                                <div key={card.id} className="flex flex-col">
                                  <a
                                    href={card.href}
                                    {...externAttribute(card.href)}
                                    onClick={(e) => handleLinkClick(e, card.href, true)}
                                    className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--cc-carbon)] hover:text-[var(--cc-carbon)] transition-colors"
                                  >
                                    {card.label}
                                    <ExternMarke href={card.href} pfeil={false} />
                                    <span className="normal-case font-medium text-[10px] text-[rgb(var(--cc-graphite-rgb)/0.72)] block mt-0.5">{card.description}</span>
                                  </a>
                                  {card.children.length > 0 && (
                                    <ul className="mt-2 flex flex-col gap-2 border-l border-gray-100 pl-3">
                                      {card.children.map((child) => (
                                        <li key={child.href}>
                                          <a
                                            href={child.href}
                                            onClick={(e) => handleLinkClick(e, child.href, true)}
                                            className="block text-[11px] font-semibold leading-snug text-[rgb(var(--cc-graphite-rgb)/0.8)] transition-colors hover:text-[var(--cc-carbon)]"
                                          >
                                            {child.label}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                              {navSections[link.dropdownKey!].footerLinks?.length ? (
                                <div className="flex flex-col gap-2 border-t border-gray-100 pt-3">
                                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[rgb(var(--cc-graphite-rgb)/0.5)]">
                                    {navSections[link.dropdownKey!].footerLabel}
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {navSections[link.dropdownKey!].footerLinks!.map((child) => (
                                      <a
                                        key={child.href}
                                        href={child.href}
                                        onClick={(e) => handleLinkClick(e, child.href, true)}
                                        className="rounded-full border border-black/[0.06] bg-gray-50/70 px-3 py-1.5 text-[11px] font-bold leading-none text-[var(--cc-carbon)] transition-colors hover:border-blue-100 hover:bg-gray-100/70"
                                      >
                                        {child.label}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          <a
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href, true)}
                            className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--cc-carbon)] hover:text-[var(--cc-carbon)] transition-colors px-1"
                          >
                            {link.label}
                          </a>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </motion.div>
  );
};

export default Navbar;
