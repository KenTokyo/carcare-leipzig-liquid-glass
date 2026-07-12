import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { OverviewService } from '../types';

/**
 * Standard-Hintergrundbild der Leistungskarten. Pro Karte via `backgroundImage`
 * ueberschreibbar (neue Bilder in /public/assets ablegen und Pfad eintragen).
 * Der ExpandOnHover-Effekt (skiper52/53) wirkt am staerksten mit UNTERSCHIEDLICHEN
 * Bildern je Karte.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.jpeg';

/**
 * CarCare-Logo-Badge. Bewusst das STATISCHE Logo (nicht das animierte MP4 aus
 * TargetGroupCards): bei 10 Karten waeren das viele parallele Autoplay-Videos
 * (Perf). Das WebP ist leichtgewichtig, konsistent und zuverlaessig.
 */
const logoMarkSrc = '/assets/carcare-center-logo.webp';

const overviewServices: OverviewService[] = [
  { id: 'aufbereitung', title: 'Fahrzeugaufbereitung', description: 'Innen, außen, Lackpflege und Pflegepakete für sichtbaren Werterhalt.', iconName: 'Sparkles', href: '/fahrzeugaufbereitung-leipzig', cta: 'Zur Aufbereitung' },
  { id: 'unfall', title: 'Unfallinstandsetzung', description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.', iconName: 'Wrench', href: '/unfallinstandsetzung-leipzig', cta: 'Unfall melden' },
  { id: 'lackierung', title: 'Neu- und Reparaturlackierung', description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.', iconName: 'PaintBucket', href: '/autolackierung-leipzig', cta: 'Zur Lackierung' },
  { id: 'smart', title: 'Smart Repair', description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.', iconName: 'ScanLine', href: '/smart-repair-leipzig', cta: 'Smart Repair ansehen' },
  { id: 'dellen', title: 'Dellenentfernung', description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.', iconName: 'Hammer', href: '/dellenentfernung-leipzig', cta: 'Dellen entfernen' },
  { id: 'hagel', title: 'Hagelschadenreparatur', description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.', iconName: 'CloudHail', href: '/hagelschadenreparatur-leipzig', cta: 'Hagelschaden prüfen' },
  { id: 'felgen', title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.', iconName: 'CircleDot', href: '/felgenreparatur-leipzig', cta: 'Felgen reparieren' },
  { id: 'glas', title: 'Autoglas / Scheibenfolien', description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.', iconName: 'Glasses', href: '/autoglas-leipzig', cta: 'Zum Autoglas' },
  { id: 'leasing', title: 'Leasingrückgabe', description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.', iconName: 'KeyRound', href: '/fahrzeugaufbereitung-leipzig', cta: 'Leasing vorbereiten' },
  { id: 'fuhrpark', title: 'Fuhrparkservice', description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.', iconName: 'TruckIcon', href: '/fuhrparkservice-leipzig', cta: 'Fuhrparkservice' },
];

const ServiceGrid: React.FC = () => {
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
    <section id="leistungen" aria-labelledby="services-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Leistungsübersicht</span>
            <h2 id="services-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Unsere Leistungen rund ums Fahrzeug.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
              Von der gründlichen Fahrzeugaufbereitung bis zur kompletten Unfallinstandsetzung: CarCare Leipzig bietet Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand.
            </p>
          </div>
          <a href="#contact-termin" className="cc-gradient-button inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-white">
            Termin oder Beratung anfragen
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* Akkordeon: Mobile vertikal (Hoehe animiert, skiper53), Desktop horizontal
            (flex-grow animiert, skiper52). Kein horizontales Scrollen. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col gap-2.5 lg:h-[460px] lg:flex-row lg:gap-3"
        >
          {overviewServices.map((service, idx) => {
            const isActive = active === idx;
            return (
              <a
                key={service.id}
                href={service.href}
                aria-label={`${service.title} – ${service.cta ?? 'Mehr ansehen'}`}
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
                  src={service.backgroundImage ?? DEFAULT_CARD_BG}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none ${isActive ? 'scale-100' : 'scale-105'}`}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.62)] via-[rgb(var(--cc-carbon-rgb)/0.14)] to-transparent" />

                {/* Kollabiert: Leistungsname – horizontal (Mobile) bzw. vertikal (Desktop),
                    faded bei aktiv aus */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-[13px] font-bold uppercase tracking-wide text-white [text-shadow:0_1px_10px_rgb(var(--cc-carbon-rgb)/0.85)] transition-opacity duration-300 motion-reduce:transition-none lg:rotate-180 lg:text-[15px] lg:[writing-mode:vertical-rl] ${isActive ? 'opacity-0' : 'opacity-100'}`}
                >
                  {service.title}
                </span>

                {/* Aktiv: weiße Textbox im TargetGroupCards-Design */}
                <div
                  className={`absolute inset-y-3 left-3 z-10 flex w-[78%] flex-col rounded-2xl bg-[rgb(255_255_255/0.92)] p-6 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] transition duration-300 motion-reduce:transition-none sm:w-[62%] lg:w-[300px] ${isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'}`}
                >
                  <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-950 md:text-2xl">
                    {service.title}
                    <span aria-hidden="true" className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-top" />
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.description}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{service.cta ?? 'Mehr ansehen'}</span>
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
      </div>
    </section>
  );
};

export default ServiceGrid;
