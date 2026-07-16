import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { AlertTriangle, CalendarClock, CheckCircle2 } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

const highlights = [
  'Unfallinstandsetzung Leipzig',
  'Fahrzeugaufbereitung',
  'Lackierung & Smart Repair',
];

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Vertikaler Bild-Parallax (skiper29 / „Siena"): das ueberformatige Bild zieht
  // langsamer als die Seite durch den overflow-hidden-Rahmen. Fortschritt robust
  // ueber die eigene Sektionshoehe gemessen (siehe useScrollProgress).
  //
  // STAERKE = REFERENZ (live gemessen an skiper-ui.com/v1/preview/skiper29):
  // Dort laeuft das Bild (800 px) im Rahmen (560 px) ueber seinen *vollen* Ueberhang
  // von 240 px, fertig nach genau einer Rahmenhoehe Scroll → Rate 240/560 = 0.4286
  // → das Bild zieht mit 0.571x der Scrollgeschwindigkeit.
  // Nachgebaut: Ebene h-[147%] (Referenz-Verhaeltnis 1.4286 + 2 x 2 % Deckungspuffer),
  // Reise ±14.6 % der Ebenenhoehe = ±21.5 % der Rahmenhoehe → Δ 0.4292 → 0.5708x.
  // Zentriert statt `items-end` wie die Referenz: deren Bottom-Crop passt zu ihrem
  // 70vh-Layout, unsere Veils sind auf die Bildmitte abgestimmt. Uebernommen wird die
  // Bewegung, nicht der Ausschnitt. Aendern? Dann Reise UND -top gemeinsam anpassen,
  // sonst grauer Rand an den Extremen (Details: docs/hero-parallax/.../Phase 6).
  //
  // BEWUSST NICHT auf prefers-reduced-motion gegated: Windows meldet bei
  // deaktivierten „Animationseffekten" reduced-motion systemweit an alle Browser —
  // ein Gate toetet die Marken-Animation daher auch bei Nutzern ohne vestibulaeren
  // Bedarf. Die uebrige Site animiert konsistent ungegated (whileInView-Reveals,
  // ExpandingCardAccordion). Siehe mobile-accordion-animation-tasks.md, Phase 5.
  const progress = useScrollProgress(sectionRef);
  const parallaxY = useTransform(progress, [0, 1], ['-14.6%', '14.6%']);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="home-heading"
      className="relative overflow-hidden bg-transparent"
    >
      <div className="hero-card-shell relative min-h-[92svh] overflow-hidden rounded-[1.45rem] bg-gray-950 md:min-h-[calc(100svh-2rem)] md:rounded-[1.75rem]">
      <div className="absolute inset-0">
        {/* Bewegte Bild-Ebene: 147 % Hoehe, vertikal zentriert (-23.5 %), damit die
            translateY-Reise (±14.6 % = ±21.5 % der Rahmenhoehe) an beiden Extremen
            den Rahmen voll deckt (kein grauer Rand, ~2 % Reserve).
            Die Veils darunter bleiben statisch. */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-x-0 -top-[23.5%] h-[147%] will-change-transform"
        >
          {/* Art Direction statt einem Bild fuer alles: Das Desktop-Motiv ist ein 21:9-Panorama
              (2400x1029). Der mobile Hero-Rahmen ist hochkant (~0.34) — dort wuerde `object-cover`
              nur ~15 % der Bildbreite zeigen und sie 2,2x strecken (unscharfer Streifen).
              Der Hochkant-Shot (1360x2048) fuellt denselben Rahmen mit ~51 % Bildbreite bei 1,1x.
              Breakpoint 767px = Tailwinds `md`, passend zu den `md:`-Klassen der Sektion. */}
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/hero-leipzig-carcare-mobile.webp"
              width={1360}
              height={2048}
            />
            <img
              src="/assets/hero-leipzig-carcare.webp"
              alt="Fahrzeuge im Showroom des CarCare Center Leipzig, An den Tierkliniken 42"
              width={2400}
              height={1029}
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </motion.div>
        {/* Seitlicher Textteppich (dunkel, links stark -> rechts frei): laesst das
            CarCare-Logo an der Hallenwand sichtbar. Definition in index.css. */}
        <div className="hero-copy-veil absolute inset-0" />
        {/* Dunkler Uebergang nach oben: oben kraeftig (setzt Navbar + Headline ab und
            gibt Tiefe), nach unten hin frei, damit der Showroom-Boden offen bleibt.
            `to-t` => `from` sitzt unten, `to` oben. */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/20 via-gray-950/45 to-gray-950/85" />
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
            className="max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-white drop-shadow-[0_2px_24px_rgb(0_0_0/0.55)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unfallschaden, Reparatur oder Autoaufbereitung in Leipzig? CarCare kümmert sich.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-200 drop-shadow-[0_1px_12px_rgb(0_0_0/0.5)] md:text-xl">
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
