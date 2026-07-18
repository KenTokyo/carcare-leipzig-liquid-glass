import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import {
  AlertTriangle,
  FileSearch,
  ClipboardCheck,
  ShieldCheck,
  Car,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface Step {
  n: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// 4 Schritte der Schadenreise (Titel + kurze, konkrete Erklaerung, Sie-Ansprache).
const steps: Step[] = [
  {
    n: '01',
    title: 'Schadenaufnahme',
    description:
      'Wir erfassen den Schaden – vor Ort oder anhand Ihrer Fotos – und dokumentieren Umfang und Hergang für die weitere Bearbeitung.',
    icon: <FileSearch size={22} />,
  },
  {
    n: '02',
    title: 'Gutachten & Kalkulation',
    description:
      'Auf Wunsch stimmen wir uns mit einem Gutachter ab und erstellen eine nachvollziehbare Kostenkalkulation für die Reparatur.',
    icon: <ClipboardCheck size={22} />,
  },
  {
    n: '03',
    title: 'Versicherungsabwicklung',
    description:
      'Wir übernehmen die Kommunikation mit Ihrer Versicherung und kümmern uns um den Schriftverkehr rund um den Schadenfall.',
    icon: <ShieldCheck size={22} />,
  },
  {
    n: '04',
    title: 'Ersatzwagen nach Verfügbarkeit',
    description:
      'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit einen Ersatzwagen für die Dauer der Reparatur.',
    icon: <Car size={22} />,
  },
];

// Weiche Crossfade-Ueberlappung an den Intervallgrenzen (kein harter Cut).
const OVERLAP = 0.06;
const STEP = 1 / steps.length; // 0.25

/**
 * Eine Prozess-Karte. Leitet aus dem (gefederten) Scroll-Progress ihr eigenes
 * Opacity-/Y-Intervall ab. Erste Karte startet sichtbar (progress 0), letzte bleibt
 * bis zum Ende. Dazwischen Trapez-Rampe [0,1,1,0].
 */
const ProcessCard: React.FC<{ step: Step; index: number; progress: MotionValue<number> }> = ({
  step,
  index,
  progress,
}) => {
  const start = index * STEP;
  const end = (index + 1) * STEP;
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

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
      className="absolute inset-0 flex flex-col justify-center rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-white p-6 shadow-[0_30px_90px_-60px_rgb(var(--cc-trust-blue-rgb)/0.55)] md:p-10"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          {step.icon}
        </span>
        <span className="text-5xl font-bold text-blue-100 md:text-6xl">{step.n}</span>
      </div>
      <h3 className="mt-6 text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-3xl">
        {step.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">{step.description}</p>
    </motion.article>
  );
};

const AccidentDamageSection: React.FC = () => {
  const trackRef = useRef<HTMLElement>(null);

  // Fortschritt (0..1) window-basiert ueber den 400vh-Track messen — treibt AUSSCHLIESSLICH die
  // Karten-Sequenz + Fortschritts-Dots. Der Pin selbst laeuft jetzt ueber natives `position: sticky`
  // (siehe unten): compositor-getrieben und damit frei von JS-Frame-Lag. Fruehere Fassung pinnte per
  // Transform (progress → translateY 0→300vh); der rAF-gedrosselte Progress hinkte dem Scroll einen
  // Frame nach → der statische Kopf „bounc*te" beim Scrollen mit. Behoben, seit `<main>` nun
  // `overflow: clip` statt `hidden` traegt (kein Scroll-Container mehr → Sticky haftet am Viewport).
  const progress = useScrollProgress(trackRef, { distance: 'through' });

  // Karten leicht federn → smoothe, ruckelfreie Ein-/Ausblendungen (darf minimal nachlaufen).
  const cardProgress = useSpring(progress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Aktiver Karten-Index nur fuer die Fortschrittsanzeige (re-rendert nur bei Wechsel, 4x).
  const [active, setActive] = useState(0);
  useEffect(() => {
    const unsub = progress.on('change', (v) => {
      const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v / STEP)));
      setActive((prev) => (prev === i ? prev : i));
    });
    return unsub;
  }, [progress]);

  return (
    // Track: definierte Scroll-Hoehe fuer 4 Karten (400vh). Der Pin ist natives `position: sticky`.
    <section ref={trackRef} id="unfall-schaden" aria-labelledby="accident-heading" className="relative h-[400vh] bg-white">
      {/* Sticky-Pin: die 100vh-Buehne haftet am Viewport-Top, bis der 400vh-Track durch ist (300vh
          Reise). Compositor-getrieben → der linke Kopf steht absolut still, kein Bounce beim Scrollen. */}
      <div className="sticky top-0 h-screen px-6">
        <div className="container mx-auto flex h-full flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-14">
          {/* Links/oben: statischer Header + CTAs + Fortschritt */}
          <div className="lg:w-[45%]">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
              <AlertTriangle size={15} />
              Unfall & Schaden Leipzig
            </div>
            <h2
              id="accident-heading"
              className="text-2xl font-bold leading-tight tracking-tight text-gray-950 sm:text-3xl md:text-5xl"
            >
              Unfallschaden? Wir übernehmen Reparatur, Gutachten und Abstimmung mit der Versicherung.
            </h2>
            {/* Intro nur ab Desktop – auf Mobile zaehlt jeder vertikale Pixel (Pin = h-screen). */}
            <p className="mt-5 hidden max-w-xl text-base leading-relaxed text-gray-600 md:text-lg lg:block">
              Von der ersten Schadenaufnahme bis zur Übergabe des reparierten Fahrzeugs – in vier
              klaren Schritten, aus einer Hand.
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
            <div className="mt-8 hidden gap-3 lg:flex lg:flex-row lg:flex-wrap">
              <a
                href="/kontakt#contact-schaden"
                className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
              >
                Schaden jetzt melden
                <ArrowRight size={16} />
              </a>
              <a
                href="tel:+493412617790"
                className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
              >
                <Phone size={16} />
                Direkt anrufen
              </a>
            </div>
          </div>

          {/* Rechts/unten: Karten-Buehne. Karten liegen gestapelt (absolute) und blenden
              je nach Scroll nacheinander ein/aus. Feste Hoehe = Platz fuer die absolute Ebene. */}
          <div className="relative h-[260px] w-full sm:h-[300px] lg:h-[380px] lg:w-[55%]">
            {steps.map((step, i) => (
              <ProcessCard key={step.n} step={step} index={i} progress={cardProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccidentDamageSection;
