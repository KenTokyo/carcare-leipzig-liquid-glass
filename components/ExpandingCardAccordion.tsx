import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/**
 * Ein Item des ExpandOnHover-Akkordeons. Bewusst minimal, damit sowohl
 * Leistungskarten (`OverviewService`) als auch Wissens-/Expertise-Karten
 * darauf gemappt werden koennen.
 */
export interface ExpandingCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Kurzer CTA-Text der aufgeklappten Karte (Fallback: "Mehr ansehen"). */
  cta?: string;
  /** Hintergrundbild der Karte (Pfad in /public/assets). Pro Karte austauschbar. */
  backgroundImage?: string;
}

/**
 * Standard-Hintergrundbild der Karten. Pro Karte via `backgroundImage`
 * ueberschreibbar (neue Bilder in /public/assets ablegen und Pfad eintragen).
 * Der ExpandOnHover-Effekt (skiper52/53) wirkt am staerksten mit UNTERSCHIEDLICHEN
 * Bildern je Karte.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.jpeg';

/**
 * CarCare-Logo-Badge. Bewusst das STATISCHE Logo (nicht das animierte MP4):
 * bei vielen Karten waeren das viele parallele Autoplay-Videos (Perf). Das WebP
 * ist leichtgewichtig, konsistent und zuverlaessig.
 */
const logoMarkSrc = '/assets/carcare-center-logo.webp';

interface ExpandingCardAccordionProps {
  items: ExpandingCardItem[];
  /** Optionales aria-Label-Suffix pro Karte (Default: item.cta bzw. "Mehr ansehen"). */
  className?: string;
}

/**
 * ExpandOnHover-Akkordeon (skiper52 Desktop horizontal / skiper53 Mobile vertikal).
 * Kollabierte Karten zeigen nur den Titel; eine Karte expandiert und blendet eine
 * weiße Textbox (Titel + blauer Punkt + Beschreibung + CTA/Pfeil-Badge) + Logo-Badge ein.
 * Geteilt von Leistungsuebersicht (`ServiceGrid`) und Autoaufbereitungs-Expertise.
 */
const ExpandingCardAccordion: React.FC<ExpandingCardAccordionProps> = ({ items, className }) => {
  // Aktiv (aufgeklappt): Desktop = horizontales Akkordeon (skiper52),
  // Mobile = vertikales Akkordeon (skiper53).
  const [active, setActive] = useState(0);

  // Hover-faehig (Desktop) vs. Touch: auf Touch expandiert der erste Tap, erst der
  // zweite folgt dem Link. Hover/Focus setzen `active` nur auf Hover-Geraeten,
  // damit der Tap-Handler nicht durch ein vorab gefeuertes Focus-Event ausgehebelt
  // wird. Default true (SSR/Desktop-Erstrender), Hydration korrigiert auf Touch.
  const [hoverCapable, setHoverCapable] = useState(true);
  useEffect(() => {
    setHoverCapable(window.matchMedia('(hover: hover)').matches);
  }, []);

  return (
    // Akkordeon: Mobile vertikal (Hoehe animiert, skiper53), Desktop horizontal
    // (flex-grow animiert, skiper52). Kein horizontales Scrollen.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col gap-2.5 lg:h-[460px] lg:flex-row lg:gap-3 ${className ?? ''}`}
    >
      {items.map((item, idx) => {
        const isActive = active === idx;
        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={`${item.title} – ${item.cta ?? 'Mehr ansehen'}`}
            aria-expanded={isActive}
            onMouseEnter={hoverCapable ? () => setActive(idx) : undefined}
            onFocus={hoverCapable ? () => setActive(idx) : undefined}
            onClick={(event) => {
              // Touch: erster Tap klappt auf, zweiter folgt dem Link.
              if (!hoverCapable && !isActive) {
                event.preventDefault();
                setActive(idx);
              }
            }}
            style={{ flexGrow: isActive ? 6 : 1 }}
            className={`group relative min-w-0 overflow-hidden rounded-[1.5rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] outline-none transition-[height] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none lg:h-full lg:basis-0 lg:transition-[flex-grow] ${isActive ? 'h-[340px]' : 'h-[64px]'}`}
          >
            {/* Layer 1 – Hintergrundbild (pro Karte austauschbar) */}
            <img
              src={item.backgroundImage ?? DEFAULT_CARD_BG}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none ${isActive ? 'scale-100' : 'scale-105'}`}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.62)] via-[rgb(var(--cc-carbon-rgb)/0.14)] to-transparent" />

            {/* Kollabiert: Kartenname – horizontal (Mobile) bzw. vertikal (Desktop),
                faded bei aktiv aus */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-[13px] font-bold uppercase tracking-wide text-white [text-shadow:0_1px_10px_rgb(var(--cc-carbon-rgb)/0.85)] transition-opacity duration-300 motion-reduce:transition-none lg:rotate-180 lg:text-[15px] lg:[writing-mode:vertical-rl] ${isActive ? 'opacity-0' : 'opacity-100'}`}
            >
              {item.title}
            </span>

            {/* Aktiv: weiße Textbox im TargetGroupCards-Design */}
            <div
              className={`absolute inset-y-3 left-3 z-10 flex w-[78%] flex-col rounded-2xl bg-[rgb(255_255_255/0.92)] p-6 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] transition duration-300 motion-reduce:transition-none sm:w-[62%] lg:w-[300px] ${isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'}`}
            >
              <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-950 md:text-2xl">
                {item.title}
                <span aria-hidden="true" className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-top" />
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{item.cta ?? 'Mehr ansehen'}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>

            {/* Logo-Badge unten rechts – nur auf der aufgeklappten Karte
                (kollabierte Streifen sind zu schmal/niedrig) */}
            <span
              className={`absolute bottom-3 right-3 z-20 h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-200 md:h-14 md:w-14 ${isActive ? 'flex' : 'hidden'}`}
            >
              <img
                src={logoMarkSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </span>
          </a>
        );
      })}
    </motion.div>
  );
};

export default ExpandingCardAccordion;
