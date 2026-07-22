import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { AlertTriangle, ArrowRight, Phone } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';

interface Step {
  n: string;
  title: string;
  description: string;
  /** Hintergrundfoto der Karte (WebP in /public/assets/kacheln). */
  image: string;
  /** Aussagekraeftiger Alt-Text (SEO §3.3) — beschreibt das konkrete Motiv. */
  imageAlt: string;
}

/** Kachel-Foto je Schritt — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

/**
 * CarCare-Logo-Siegel (statisches WebP, kein Autoplay-Video): identisch zum
 * ExpandingCardAccordion, damit die Karten sich einheitlich anfuehlen.
 */
const logoMarkSrc = '/assets/carcare-center-logo.webp';

// 4 Schritte der Schadenreise (Titel + kurze, konkrete Erklaerung, Sie-Ansprache).
// Jeder Schritt traegt sein eigenes Foto (Motiv passend zum Schrittnamen) + Alt-Text.
const steps: Step[] = [
  {
    n: '01',
    title: 'Schadenaufnahme',
    description:
      'Wir erfassen den Schaden – vor Ort oder anhand Ihrer Fotos – und dokumentieren Umfang und Hergang für die weitere Bearbeitung.',
    image: kachel('schadenaufnahme-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiter nimmt gemeinsam mit einer Kundin den Unfallschaden an einem gelben Sportwagen auf und dokumentiert ihn per Tablet.',
  },
  {
    n: '02',
    title: 'Gutachten & Kalkulation',
    description:
      'Auf Wunsch stimmen wir uns mit einem Gutachter ab und erstellen eine nachvollziehbare Kostenkalkulation für die Reparatur.',
    image: kachel('kalkulation-leipzig-carcare'),
    imageAlt:
      'Kundin unterschreibt am Empfangstresen den Kostenvoranschlag, während der CarCare-Berater die Kalkulation auf dem Tablet erläutert.',
  },
  {
    n: '03',
    title: 'Versicherungsabwicklung',
    description:
      'Wir übernehmen die Kommunikation mit Ihrer Versicherung und kümmern uns um den Schriftverkehr rund um den Schadenfall.',
    image: kachel('versicherungsabwicklung-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiterin klärt am Telefon mit Tablet und Unterlagen die Versicherungsabwicklung eines Schadenfalls.',
  },
  {
    n: '04',
    title: 'Ersatzwagen nach Verfügbarkeit',
    description:
      'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit einen Ersatzwagen für die Dauer der Reparatur.',
    image: kachel('ersatzwagen-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiter übergibt einer Kundin vor der Werkstatt den Schlüssel für einen Ersatzwagen.',
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
      className="absolute inset-0 overflow-hidden rounded-[2rem] shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)]"
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
          bleibt „klar" sichtbar (Wunsch des Users: klares Hintergrundbild). */}
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
        {/* Full-Bleed-Hintergrund: Foto der AKTIVEN Karte ueber die gesamte (gepinnte) Sektion —
            1:1 dieselbe Veil-/Transparenz-Anordnung + Crossfade wie ServiceGrid (Leistungsuebersicht).
            Rein visueller Layer HINTER dem Content: nutzt nur den bestehenden `active`-Index, ruehrt
            KEINE Scroll-/Karten-Animation an. `-z-10` bleibt im Stacking-Context der Sticky-`div`
            (sticky erzeugt ihn) → hinter Header+Karten, ueber dem weissen Section-Bg. Nur ab `lg`:
            die Veils sind auf Header-links/Karte-rechts getunt (dieses Layout gilt erst ab lg —
            exakt wie ServiceGrid, das auf Mobile `null` liefert). */}
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
              {/* Weisse Rand-Vignette (radial): klares Bildfenster rechts der Mitte (58 %), Raender ins Weiss. */}
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
          <div className="relative h-[300px] w-full sm:h-[340px] lg:h-[380px] lg:w-[55%]">
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
