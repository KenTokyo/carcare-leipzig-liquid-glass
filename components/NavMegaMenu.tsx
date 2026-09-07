import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { NavSection } from '../data/navigation';

/**
 * Feste Id des Panels.
 *
 * Das Panel steht im DOM hinter BEIDEN `<nav>`-Bloecken — es muss dort stehen, weil es
 * `left-0 right-0` an der Navbar ausrichtet und ein Platz im Trigger-Container es an den
 * schmalen, absolut gesetzten `<nav>` binden wuerde. Die Folge: Tab springt vom Trigger
 * zum naechsten Menuepunkt, nicht in das geoeffnete Panel. `Navbar.tsx` haengt sich
 * deshalb in die Tab-Taste und leitet den Fokus ueber diese Id um.
 */
export const NAV_MEGA_PANEL_ID = 'nav-mega-panel';

interface NavMegaMenuProps {
  activeKey: string | null;
  sections: Record<string, NavSection>;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string, closeAll?: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  /** Id des Trigger-Links, zu dem Shift+Tab aus der ersten Karte zurueckfuehrt. */
  triggerId: string | null;
}

/**
 * Breites Mega-Menue unter der globalen Navbar, mit dritter Ebene.
 *
 * - Positioniert absolut im nav-shell -> spannt exakt die Navbar-Breite (left-0/right-0),
 *   geht nie ueber die Aussenkanten hinaus und ist per Offset leicht abgesetzt.
 * - Nur Desktop (xl:block); mobil greift das Menue in `Navbar.tsx` mit dauerhaft
 *   sichtbarer Unterebene, weil es auf Touch kein Hover gibt.
 *
 * WARUM DIE DRITTE EBENE UNTER DER KARTE AUFKLAPPT UND NICHT SEITLICH:
 * Ein Flyout rechts neben der Karte liefe bei der rechten Spalte aus dem Panel heraus,
 * und der diagonale Mausweg dorthin kreuzt die Nachbarkarte — dagegen braucht man sonst
 * ein „Safe Triangle". Der aufklappende Bereich grenzt stattdessen lueckenlos an seine
 * Karte an: Der Zeiger faehrt geradeaus nach unten und kreuzt nichts. Damit eruebrigt
 * sich die Mechanik ersatzlos, statt sie nachzubauen.
 *
 * BARRIEREFREIHEIT (WCAG 1.4.13 „Content on Hover or Focus"):
 * - dismissible: Escape schliesst erst die dritte Ebene, dann das ganze Menue.
 * - hoverable:   Karte und Unterebene liegen im selben Container, der Zeiger darf
 *                hineinfahren, ohne dass zugeklappt wird.
 * - persistent:  bleibt offen, bis der Zeiger den Container verlaesst oder Escape kommt.
 * Geoeffnet wird zusaetzlich per Tastaturfokus — Hover allein schliesst Tastaturnutzer
 * aus. Die Unterpunkte stehen nur im DOM, wenn ihre Ebene offen ist; so landet der Fokus
 * nie auf etwas Unsichtbarem.
 */
const NavMegaMenu: React.FC<NavMegaMenuProps> = ({
  activeKey,
  sections,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
  triggerId,
}) => {
  const section = activeKey ? sections[activeKey] : null;
  const [openCardId, setOpenCardId] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  /**
   * Der kurze Verzug ist kein Schmuck: Beim Wechsel zwischen zwei Karten liegt fuer
   * wenige Millisekunden der Spaltenabstand unter dem Zeiger. Ohne Verzug klappt die
   * Ebene dort zu und sofort wieder auf — das flackert sichtbar.
   */
  const scheduleCardClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenCardId(null), 120);
  };

  const openCard = (id: string) => {
    cancelClose();
    setOpenCardId(id);
  };

  // Menuewechsel setzt die dritte Ebene zurueck, sonst steht sie beim naechsten
  // Oeffnen noch aufgeklappt da.
  useEffect(() => {
    cancelClose();
    setOpenCardId(null);
  }, [activeKey]);

  useEffect(() => cancelClose, []);

  /** Escape in zwei Stufen: erst die Unterebene, dann (ueber Navbar) das Menue. */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Escape' || !openCardId) return;
    e.stopPropagation();
    setOpenCardId(null);
  };

  /**
   * Shift+Tab aus der ersten Karte fuehrt zurueck zum Trigger statt an den Anfang der
   * Seite. Gegenstueck zur Tab-Umleitung in `Navbar.tsx` — ohne diese Rueckrichtung
   * waere der Weg in das Panel eine Einbahnstrasse.
   */
  const handleErsteKarteKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key !== 'Tab' || !e.shiftKey || !triggerId) return;
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;
    e.preventDefault();
    setOpenCardId(null);
    trigger.focus();
  };

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => {
            cancelClose();
            setOpenCardId(null);
            onMouseLeave();
          }}
          /*
           * Der Fokus muss denselben Schliess-Timer stoppen wie der Mauszeiger.
           * Ohne diese beiden Handler schloss sich das Menue 140 ms nachdem der Fokus
           * vom Trigger in das Panel wanderte: Der Trigger meldet `blur` und plant das
           * Schliessen, und nichts nahm den Plan zurueck. Mit der Maus fiel das nie auf,
           * per Tastatur war das Menue dadurch unbenutzbar.
           */
          onFocus={onMouseEnter}
          onBlur={(e) => {
            if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
            setOpenCardId(null);
            onMouseLeave();
          }}
          onKeyDown={handleKeyDown}
          id={NAV_MEGA_PANEL_ID}
          className="pointer-events-auto absolute left-0 right-0 top-[calc(100%+14px)] z-50 hidden rounded-[22px] border border-black/[0.05] bg-white p-5 shadow-[0_30px_70px_-34px_rgb(var(--cc-carbon-rgb)/0.4)] xl:block"
        >
          <div className="mb-4 border-b border-gray-100 px-1 pb-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--cc-graphite-rgb)/0.62)]">
              {section.label}
            </span>
          </div>

          <div className="grid grid-cols-4 items-start gap-3">
            {section.cards.map((card, index) => {
              const Icon = card.icon;
              const hasChildren = card.children.length > 0;
              const isOpen = hasChildren && openCardId === card.id;
              const submenuId = `nav-sub-${card.id}`;

              return (
                <div
                  key={card.id}
                  className="flex flex-col"
                  onMouseEnter={hasChildren ? () => openCard(card.id) : scheduleCardClose}
                  onMouseLeave={hasChildren ? scheduleCardClose : undefined}
                  onFocus={hasChildren ? () => openCard(card.id) : undefined}
                  onBlur={
                    hasChildren
                      ? (e) => {
                          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
                          setOpenCardId(null);
                        }
                      : undefined
                  }
                >
                  <a
                    href={card.href}
                    onClick={(e) => onNavigate(e, card.href, true)}
                    onKeyDown={index === 0 ? handleErsteKarteKeyDown : undefined}
                    aria-haspopup={hasChildren ? 'true' : undefined}
                    aria-expanded={hasChildren ? isOpen : undefined}
                    aria-controls={hasChildren && isOpen ? submenuId : undefined}
                    className={`group flex min-h-[132px] flex-col rounded-2xl border p-5 transition-colors duration-200 ${
                      isOpen
                        ? 'border-blue-100 bg-gray-100/70'
                        : 'border-black/[0.04] bg-gray-50/70 hover:border-blue-100 hover:bg-gray-100/70'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span
                        className={`transition-colors duration-200 ${
                          isOpen
                            ? 'text-blue-600'
                            : 'text-[rgb(var(--cc-graphite-rgb)/0.5)] group-hover:text-blue-600'
                        }`}
                      >
                        <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      {hasChildren && (
                        <motion.span
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.15 }}
                          className="inline-block text-[rgb(var(--cc-graphite-rgb)/0.4)]"
                        >
                          <ChevronRight size={14} aria-hidden="true" />
                        </motion.span>
                      )}
                    </span>
                    <span className="mt-auto pt-6 text-[15px] font-bold leading-tight tracking-tight text-[var(--cc-carbon)]">
                      {card.label}
                    </span>
                    <span className="mt-1 text-[12.5px] leading-snug text-[rgb(var(--cc-graphite-rgb)/0.6)]">
                      {card.description}
                    </span>
                  </a>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={submenuId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-1.5 flex flex-col rounded-2xl border border-blue-100 bg-white p-1.5">
                          {card.children.map((child) => (
                            <li key={child.href}>
                              <a
                                href={child.href}
                                onClick={(e) => onNavigate(e, child.href, true)}
                                className="flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] font-semibold leading-snug text-[rgb(var(--cc-graphite-rgb)/0.82)] transition-colors duration-150 hover:bg-gray-50 hover:text-[var(--cc-carbon)] focus-visible:bg-gray-50 focus-visible:text-[var(--cc-carbon)] focus-visible:outline-none"
                              >
                                <ChevronRight
                                  size={12}
                                  className="shrink-0 text-[rgb(var(--cc-graphite-rgb)/0.35)]"
                                  aria-hidden="true"
                                />
                                {child.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {section.footerLinks && section.footerLinks.length > 0 && (
            <div className="mt-4 flex items-center gap-4 border-t border-gray-100 px-1 pt-3.5">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[rgb(var(--cc-graphite-rgb)/0.5)]">
                {section.footerLabel}
              </span>
              <span className="flex items-center gap-2">
                {section.footerLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => onNavigate(e, link.href, true)}
                    className="rounded-full border border-black/[0.06] bg-gray-50/70 px-3.5 py-1.5 text-[12.5px] font-bold leading-none text-[var(--cc-carbon)] transition-colors duration-150 hover:border-blue-100 hover:bg-gray-100/70 focus-visible:border-blue-100 focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                ))}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMegaMenu;
