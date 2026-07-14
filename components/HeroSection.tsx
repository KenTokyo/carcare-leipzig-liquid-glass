import React, { useRef } from 'react';
import { motion, useTransform, useReducedMotion } from 'framer-motion';
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

const highlights = [
  'Unfallinstandsetzung Leipzig',
  'Fahrzeugaufbereitung',
  'Lackierung & Smart Repair',
];

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Vertikaler Bild-Parallax (skiper29 / „Siena"): das ueberformatige Bild zieht
  // langsamer als die Seite durch den overflow-hidden-Rahmen. Fortschritt robust
  // ueber die eigene Sektionshoehe gemessen (siehe useScrollProgress).
  const progress = useScrollProgress(sectionRef, { enabled: !reduceMotion });
  const parallaxY = useTransform(progress, [0, 1], ['-10%', '10%']);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="home-heading"
      className="relative overflow-hidden bg-transparent"
    >
      <div className="hero-card-shell relative min-h-[92svh] overflow-hidden rounded-[1.45rem] bg-gray-950 md:min-h-[calc(100svh-2rem)] md:rounded-[1.75rem]">
      <div className="absolute inset-0">
        {/* Bewegte Bild-Ebene: 130 % Hoehe, vertikal zentriert (-15 %), damit die
            translateY-Reise (±10 %) an beiden Extremen den Rahmen voll deckt
            (kein grauer Rand). Die Veils darunter bleiben statisch. */}
        <motion.div
          style={{ y: reduceMotion ? 0 : parallaxY }}
          className="absolute inset-x-0 -top-[15%] h-[130%] will-change-transform"
        >
          <img
            src="/assets/carcare-hero-workshop.jpeg"
            alt="Premiumfahrzeuge in der CarCare Werkstatt Leipzig"
            width={2400}
            height={1350}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>
        <div className="hero-copy-veil absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.92] via-white/[0.14] to-white/5" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.08] to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[92svh] items-center px-5 pt-28 md:min-h-[calc(100svh-2rem)] md:px-8 md:pt-32 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-4xl pb-16 pt-6 md:pt-0"
        >
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-200 bg-blue-50/[0.92] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-700 shadow-sm">
              Meisterbetrieb · Glasurit-Lackpartner · seit 1993
            </span>
            <span className="rounded-full border border-white/80 bg-white/[0.84] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600 shadow-sm">
              An den Tierkliniken 42
            </span>
          </div>

          <h1
            id="home-heading"
            className="max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-gray-950 drop-shadow-[0_1px_0_rgb(255_255_255/0.65)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unfallschaden, Reparatur oder Autoaufbereitung in Leipzig? CarCare kümmert sich.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
            Professionelle Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair und Schadenabwicklung für Privatkunden, Versicherungen, Autohäuser und Fuhrparks.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/kontakt#contact-schaden"
              className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
            >
              <AlertTriangle size={18} />
              Schaden melden
            </a>
            <a
              href="/kontakt#contact-termin"
              className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
            >
              <CalendarClock size={18} />
              Termin für Aufbereitung anfragen
            </a>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/75 bg-white/90 px-4 py-3 text-sm font-semibold text-gray-800 shadow-[0_16px_40px_-28px_rgb(var(--cc-carbon-rgb)/0.6)]"
              >
                <CheckCircle2 size={17} className="shrink-0 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
