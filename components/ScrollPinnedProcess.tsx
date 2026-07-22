import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * Gemeinsame Mechanik der scroll-gepinnten Prozess-Sektionen.
 *
 * Am 2026-07-22 aus `AccidentDamageSection` extrahiert, weil die Autoaufbereitung dieselbe
 * Darstellung bekommen sollte. Bewusst EINE geteilte Komponente statt Copy-Paste: so sind
 * Layout, Scroll-Animation, Crossfade, Fortschritts-Dots und Full-Bleed-Hintergrund garantiert
 * identisch — und bleiben es auch bei kuenftigen Aenderungen (genau wie beim geteilten
 * `ExpandingCardAccordion` von Leistungsuebersicht + Expertise).
 *
 * Verhalten unveraendert uebernommen: 100vh-Buehne per nativem `position: sticky` gepinnt,
 * Fortschritt window-basiert gemessen (`useScrollProgress`), Karten per Feder leicht gedaempft.
 */

export interface ProcessStepCard {
  /** Zweistellige Schrittnummer, z. B. „01". Dient zugleich als React-Key -> muss eindeutig sein. */
  n: string;
  title: string;
  description: string;
  /** Hintergrundfoto der Karte (WebP in /public/assets/kacheln). */
  image: string;
  /** Aussagekraeftiger Alt-Text (SEO §3.3) — beschreibt das konkrete Motiv. */
  imageAlt: string;
  /** Optionaler CTA IN der Karte — nur wo er echten Nutzen bringt (z. B. Einstiegsschritt). */
  cta?: { label: string; href: string };
}

export interface ProcessSectionCta {
  label: string;
  href: string;
  /** Optionales Icon VOR dem Label (sonst steht rechts ein Pfeil). */
  icon?: React.ReactNode;
}

interface ScrollPinnedProcessProps {
  /** Anker-Id der Sektion (z. B. „unfall-schaden"). */
  id: string;
  /** Id der h2 fuer `aria-labelledby` — muss seitenweit eindeutig sein. */
  headingId: string;
  badgeIcon: React.ReactNode;
  badgeLabel: string;
  heading: string;
  intro: string;
  steps: ProcessStepCard[];
  /** Sektions-CTAs (Desktop). Auf Mobile deckt die fixierte Bottom-Nav dieselben Aktionen ab. */
  ctas?: ProcessSectionCta[];
}

// Weiche Crossfade-Ueberlappung an den Intervallgrenzen (kein harter Cut).
const OVERLAP = 0.06;

/**
 * CarCare-Logo-Siegel (statisches WebP, kein Autoplay-Video): identisch zum
 * ExpandingCardAccordion, damit die Karten sich einheitlich anfuehlen.
 */
const logoMarkSrc = '/assets/carcare-center-logo.webp';

/**
 * Eine Prozess-Karte. Leitet aus dem (gefederten) Scroll-Progress ihr eigenes
 * Opacity-/Y-Intervall ab. Erste Karte startet sichtbar (progress 0), letzte bleibt
 * bis zum Ende. Dazwischen Trapez-Rampe [0,1,1,0].
 */
const ProcessCard: React.FC<{
  step: ProcessStepCard;
  index: number;
  /** Gesamtzahl der Karten — bestimmt die Intervallbreite je Karte. */
  total: number;
  progress: MotionValue<number>;
  /** Nur die aktive Karte ist bedienbar — sonst waere der CTA der unsichtbaren (opacity 0)
   *  Karten weiterhin klick- und per Tab fokussierbar. */
  isActive: boolean;
}> = ({ step, index, total, progress, isActive }) => {
  const stepSize = 1 / total;
  const start = index * stepSize;
  const end = (index + 1) * stepSize;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const range = isFirst
    ? [0, end - OVERLAP, end + OVERLAP]
    : isLast
      ? [start - OVERLAP, start + OVERLAP, 1]
      : [start - OVERLAP, start + OVERLAP, end - OVERLAP, end + OVERLAP];
  const opacityOut = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const yOut = isFirst ? [0, 0, -28] : isLast ? [28, 0, 0] : [28, 0, 0, -28];

  const opacity = useTransform(progress, range, opacityOut);
  const y = useTransform(progress, range, yOut);

  return (
    <motion.article
      style={{ opacity, y }}
      className={`absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] ${
        isActive ? '' : 'pointer-events-none'
      }`}
    >
      {/* Layer 1 – Hintergrundfoto (pro Schritt eigenes Motiv, wie Leistungsuebersicht) */}
      <img
        src={step.image}
        alt={step.imageAlt}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Layer 2 – Carbon-Verlauf von unten: Tiefe + Halt fuer die Textbox; die Bildoberkante
          bleibt „klar" sichtbar. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.5)] via-[rgb(var(--cc-carbon-rgb)/0.1)] to-transparent"
      />

      {/* Layer 3 – weisse Textbox im ExpandingCardAccordion-Design: Kicker (Schritt-Nr.) +
          Titel mit blauem Punkt + Beschreibung. Unten verankert, Breite gedeckelt -> das Foto
          bleibt oben/rechts sichtbar. */}
      <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-[rgb(255_255_255/0.92)] p-5 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] backdrop-blur-sm sm:right-auto sm:max-w-[68%] sm:p-6 lg:max-w-[380px]">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700">
          Schritt {step.n}
        </span>
        <h3 className="mt-1.5 text-xl font-bold leading-tight tracking-tight text-gray-950 md:text-2xl">
          {step.title}
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-top"
          />
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-gray-600 md:text-base">{step.description}</p>
        {/* Optionaler Karten-CTA. `tabIndex -1`, solange die Karte nicht aktiv ist — sonst liesse
            sich der unsichtbare Link per Tab-Taste erreichen. */}
        {step.cta && (
          <a
            href={step.cta.href}
            tabIndex={isActive ? 0 : -1}
            className="cc-gradient-button mt-4 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-bold text-white"
          >
            {step.cta.label}
            <ArrowRight size={15} />
          </a>
        )}
      </div>

      {/* Logo-Siegel unten rechts – erst ab sm (auf Mobile spannt die Textbox voll -> wuerde
          ueberlappen). Gleiches Siegel wie in der Leistungsuebersicht. */}
      <span className="absolute bottom-4 right-4 hidden h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-200 sm:flex lg:h-14 lg:w-14">
        <img
          src={logoMarkSrc}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </span>
    </motion.article>
  );
};

const ScrollPinnedProcess: React.FC<ScrollPinnedProcessProps> = ({
  id,
  headingId,
  badgeIcon,
  badgeLabel,
  heading,
  intro,
  steps,
  ctas = [],
}) => {
  const trackRef = useRef<HTMLElement>(null);
  const stepSize = 1 / steps.length;

  // Fortschritt (0..1) window-basiert ueber den Track messen — treibt AUSSCHLIESSLICH die
  // Karten-Sequenz + Fortschritts-Dots. Der Pin selbst laeuft ueber natives `position: sticky`:
  // compositor-getrieben und damit frei von JS-Frame-Lag. Fruehere Fassung pinnte per Transform;
  // der rAF-gedrosselte Progress hinkte dem Scroll einen Frame nach → der statische Kopf
  // „bounc*te" mit. Behoben, seit `<main>` `overflow: clip` statt `hidden` traegt.
  const progress = useScrollProgress(trackRef, { distance: 'through' });

  // Karten leicht federn → smoothe, ruckelfreie Ein-/Ausblendungen (darf minimal nachlaufen).
  const cardProgress = useSpring(progress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Aktiver Karten-Index nur fuer die Fortschrittsanzeige (re-rendert nur bei Wechsel).
  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v / stepSize)));
      setActive((prev) => (prev === i ? prev : i));
    });
    return unsub;
  }, [progress, steps.length, stepSize]);

  return (
    // Track: 100vh Scrollweg je Karte. Bewusst als Inline-Style statt Tailwind-Klasse — so
    // waechst die Hoehe automatisch mit `steps.length` mit. (Zuvor hartcodiert: eine zusaetzliche
    // Karte haette sich sonst denselben Scrollweg geteilt und jede Karte zu wenig Strecke bekommen.)
    <section
      ref={trackRef}
      id={id}
      aria-labelledby={headingId}
      className="relative bg-white"
      style={{ height: `${steps.length * 100}vh` }}
    >
      {/* Sticky-Pin: die 100vh-Buehne haftet am Viewport-Top, bis der Track durch ist.
          Compositor-getrieben → der linke Kopf steht absolut still, kein Bounce beim Scrollen. */}
      <div className="sticky top-0 h-screen px-6">
        {/* Full-Bleed-Hintergrund: Foto der AKTIVEN Karte ueber die gesamte (gepinnte) Sektion —
            1:1 dieselbe Veil-/Transparenz-Anordnung + Crossfade wie ServiceGrid. Rein visueller
            Layer HINTER dem Content. `-z-10` bleibt im Stacking-Context der Sticky-`div` (sticky
            erzeugt ihn) → hinter Header+Karten, ueber dem weissen Section-Bg. Nur ab `lg`: die
            Veils sind auf Header-links/Karte-rechts getunt (dieses Layout gilt erst ab lg). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block">
          <AnimatePresence>
            <motion.div
              key={steps[active].image}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img src={steps[active].image} alt="" decoding="async" className="h-full w-full object-cover" />
              {/* Heller Veil (vertikal): haelt den Content lesbar; Mitte duenn. */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/[0.18] to-white/45" />
              {/* Header-Schutz (horizontal): links weisser, damit die Ueberschrift lesbar bleibt. */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgb(255 255 255 / 0.85) 0%, rgb(255 255 255 / 0.45) 28%, rgb(255 255 255 / 0) 52%)' }}
              />
              {/* Weisse Rand-Vignette (radial): klares Bildfenster rechts der Mitte (58 %). */}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse closest-side at 58% 48%, rgb(255 255 255 / 0) 33%, rgb(255 255 255 / 1) 90%)' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="container relative mx-auto flex h-full flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-14">
          {/* Links/oben: statischer Header + CTAs + Fortschritt */}
          <div className="lg:w-[45%]">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
              {badgeIcon}
              {badgeLabel}
            </div>
            <h2
              id={headingId}
              className="text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl md:text-5xl"
            >
              {heading}
            </h2>
            {/* Intro nur ab Desktop – auf Mobile zaehlt jeder vertikale Pixel (Pin = h-screen). */}
            <p className="mt-5 hidden max-w-xl text-base leading-relaxed text-gray-600 md:text-lg lg:block">
              {intro}
            </p>

            {/* Fortschritts-Indikator: Dots + Zaehler, folgen dem aktiven Schritt */}
            <div className="mt-7 flex items-center gap-2.5" aria-hidden="true">
              {steps.map((s, i) => (
                <span
                  key={s.n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? 'w-9 bg-blue-600' : 'w-2.5 bg-blue-200'
                  }`}
                />
              ))}
              <span className="ml-2 text-xs font-bold tracking-wide text-gray-400">
                {steps[active].n} / {String(steps.length).padStart(2, '0')}
              </span>
            </div>

            {/* CTAs nur ab Desktop – auf Mobile deckt die fixierte Bottom-Nav (Anrufen/Schaden/
                Termin) dieselben Aktionen ab; hier wuerden sie nur den Pin-Viewport sprengen. */}
            {ctas.length > 0 && (
              <div className="mt-8 hidden gap-3 lg:flex lg:flex-row lg:flex-wrap">
                {ctas.map((cta) => (
                  <a
                    key={cta.href}
                    href={cta.href}
                    className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
                  >
                    {cta.icon}
                    {cta.label}
                    {!cta.icon && <ArrowRight size={16} />}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Rechts/unten: Karten-Buehne. Karten liegen gestapelt (absolute) und blenden
              je nach Scroll nacheinander ein/aus. Feste Hoehe = Platz fuer die absolute Ebene. */}
          <div className="relative h-[300px] w-full sm:h-[340px] lg:h-[380px] lg:w-[55%]">
            {steps.map((step, i) => (
              <ProcessCard
                key={step.n}
                step={step}
                index={i}
                total={steps.length}
                progress={cardProgress}
                isActive={i === active}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollPinnedProcess;
