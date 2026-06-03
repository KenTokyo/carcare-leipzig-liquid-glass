import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock, ArrowRight, CheckCircle2 } from 'lucide-react';

const highlights = [
  'Unfallinstandsetzung Leipzig',
  'Fahrzeugaufbereitung',
  'Lackierung & Smart Repair',
];

const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      aria-labelledby="home-heading"
      className="relative min-h-[92svh] overflow-hidden bg-white pt-28 md:pt-32"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2400&auto=format&fit=crop"
          alt="Helles Fahrzeug in professioneller Werkstatt"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 to-white/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[calc(92svh-7rem)] items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-4xl pb-16"
        >
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
              CarCare Center Leipzig
            </span>
            <span className="rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600 backdrop-blur">
              An den Tierkliniken 42
            </span>
          </div>

          <h1
            id="home-heading"
            className="max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-gray-950 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unfallschaden, Reparatur oder Autoaufbereitung in Leipzig? CarCare kümmert sich.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-xl">
            Professionelle Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair und Schadenabwicklung für Privatkunden, Versicherungen, Autohäuser und Fuhrparks.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/kontakt#contact-schaden"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-[0_18px_45px_-22px_rgb(var(--cc-trust-blue-rgb)/0.82)] transition-colors hover:bg-blue-700"
            >
              <AlertTriangle size={18} />
              Schaden melden
            </a>
            <a
              href="/kontakt#contact-termin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-950 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
              <CalendarClock size={18} />
              Termin für Aufbereitung anfragen
            </a>
            <a
              href="/leistungen"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/85 px-7 py-4 text-sm font-bold text-gray-950 backdrop-blur transition-colors hover:border-gray-400 hover:bg-white"
            >
              Leistungen ansehen
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/78 px-4 py-3 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur"
              >
                <CheckCircle2 size={17} className="shrink-0 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
