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
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.webp';

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
  /**
   * Optionaler Callback: meldet das aufgeloeste Bild der aktuell **aufgeklappten** Karte
   * (nicht nur beim Hovern, sondern solange die Karte offen ist — auf Desktop ist immer
   * genau eine offen). Damit kann die umgebende Sektion einen Full-Bleed-Hintergrund
   * einblenden, der bestehen bleibt (siehe ServiceGrid). Auf Mobile `null` (kein Hover-
   * getriebener Section-Hintergrund).
   */
  onActiveImageChange?: (image: string | null) => void;
}

/**
 * ExpandOnHover-Akkordeon (skiper52 Desktop horizontal / skiper53 Mobile vertikal).
 * Kollabierte Karten zeigen nur den Titel; eine Karte expandiert und blendet eine
 * weiße Textbox (Titel + blauer Punkt + Beschreibung + CTA/Pfeil-Badge) + Logo-Badge ein.
 * Geteilt von Leistungsuebersicht (`ServiceGrid`) und Autoaufbereitungs-Expertise.
 */
const ExpandingCardAccordion: React.FC<ExpandingCardAccordionProps> = ({ items, className, onActiveImageChange }) => {
  // Aktiv (aufgeklappt): Desktop = horizontales Akkordeon (skiper52),
  // Mobile = vertikales Akkordeon (skiper53).
  const [active, setActive] = useState(0);

  // Groesse wird von Framer getrieben (nicht per CSS-Transition): Desktop animiert
  // `flexGrow` (Breite bei fixer Container-Hoehe), Mobile animiert `height`. Grund:
  // die CSS-Height-Transition eines Flex-Items ist auf mobilen Browsern (v.a. iOS
  // Safari) unzuverlaessig und snappt hart; Framer setzt den Wert per rAF direkt
  // inline und umgeht den Flex-Quirk. Gleiche Easing/Dauer wie Desktop -> Mobile
  // fuehlt sich identisch an.
  //
  // Bewusst NICHT auf prefers-reduced-motion gegated: die Animation ist ein
  // gewuenschtes Marken-Micro-Interaction, und die uebrige Site animiert ebenfalls
  // durchgaengig ungegated (Hero-Parallax, whileInView-Reveals) -> ein gegatetes
  // Akkordeon (Dauer 0 unter reduced-motion) waere inkonsistent und liess die
  // Karten auf betroffenen Systemen hart aufspringen statt smooth aufzuklappen.
  const cardTransition = { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  // Viewport-Erkennung. Lazy-Init aus matchMedia -> korrekte Kartenhoehe schon beim
  // ersten Paint (kein Flash). Sicher, weil der Prerender #root vor dem Client-Mount
  // leert (scripts/prerender.mjs) -> reines CSR, keine Hydration-Mismatch-Gefahr.
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : true
  );

  // Hover-faehig (Desktop) vs. Touch: auf Touch expandiert der erste Tap, erst der
  // zweite folgt dem Link. Hover/Focus setzen `active` nur auf Hover-Geraeten,
  // damit der Tap-Handler nicht durch ein vorab gefeuertes Focus-Event ausgehebelt wird.
  const [hoverCapable, setHoverCapable] = useState(true);
  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover)');
    const desktopMq = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      setHoverCapable(hoverMq.matches);
      setIsDesktop(desktopMq.matches);
    };
    sync();
    hoverMq.addEventListener('change', sync);
    desktopMq.addEventListener('change', sync);
    return () => {
      hoverMq.removeEventListener('change', sync);
      desktopMq.removeEventListener('change', sync);
    };
  }, []);

  // Section-Hintergrund folgt der AKTIVEN (aufgeklappten) Karte — nicht dem Hover.
  // Auf Desktop ist immer genau eine Karte offen, der Hintergrund bleibt also stehen,
  // auch wenn die Maus den Strip verlaesst. Auf Mobile bewusst `null` (kein Full-Bleed-
  // Hintergrund hinter dem vertikalen Stapel). Deckt Mount (active=0) + jeden Wechsel ab.
  useEffect(() => {
    onActiveImageChange?.(isDesktop ? items[active]?.backgroundImage ?? DEFAULT_CARD_BG : null);
  }, [active, isDesktop, items, onActiveImageChange]);

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
        // Exakt das sichtbare Kartenbild — damit der Section-Hintergrund 1:1 dem Hover entspricht.
        const cardImage = item.backgroundImage ?? DEFAULT_CARD_BG;
        // Titel in „alles ausser letztem Wort" + „letztes Wort" zerlegen: Der blaue Akzentpunkt
        // wird unten mit dem letzten Wort in eine `whitespace-nowrap`-Klammer gesetzt. Ohne das
        // rutscht er bei mehrzeiligen Titeln allein in eine neue Zeile und wirkt wie ein Fehler
        // (gleiche Ueberlegung wie in TargetGroupCards, dort driftete er nach rechts weg).
        const woerter = item.title.split(' ');
        const letztesWort = woerter.pop() ?? '';
        const davor = woerter.join(' ');
        return (
          <motion.a
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
            initial={false}
            animate={{
              flexGrow: isActive ? 6 : 1,
              height: isDesktop ? '100%' : isActive ? 340 : 64,
            }}
            transition={cardTransition}
            className="group relative min-w-0 overflow-hidden rounded-[1.5rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 lg:basis-0"
          >
            {/* Layer 1 – Hintergrundbild (pro Karte austauschbar) */}
            <img
              src={cardImage}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-100' : 'scale-105'}`}
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.62)] via-[rgb(var(--cc-carbon-rgb)/0.14)] to-transparent" />

            {/* Kollabiert: Kartenname – horizontal (Mobile) bzw. vertikal (Desktop),
                faded bei aktiv aus */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-[13px] font-bold uppercase tracking-wide text-white [text-shadow:0_1px_10px_rgb(var(--cc-carbon-rgb)/0.85)] transition-opacity duration-300 lg:rotate-180 lg:text-[15px] lg:[writing-mode:vertical-rl] ${isActive ? 'opacity-0' : 'opacity-100'}`}
            >
              {item.title}
            </span>

            {/* Aktiv: weiße Textbox im TargetGroupCards-Design */}
            <div
              className={`absolute inset-y-3 left-3 z-10 flex w-[78%] flex-col rounded-2xl bg-[rgb(255_255_255/0.92)] p-6 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] transition duration-300 sm:w-[62%] lg:w-[300px] ${isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'}`}
            >
              <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-950 md:text-2xl">
                {davor && `${davor} `}
                <span className="whitespace-nowrap">
                  {letztesWort}
                  <span aria-hidden="true" className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-top" />
                </span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{item.cta ?? 'Mehr ansehen'}</span>
                <span className="cc-gradient-fill flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
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
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default ExpandingCardAccordion;
