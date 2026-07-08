import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';

// Eigener rAF-Tween auf einem MotionValue. Bewusst NICHT Framers animate(),
// weil dessen deklarative Animationen bei prefers-reduced-motion unterdrueckt
// werden — progress.set() pro Frame wird hingegen immer angewandt (wie im
// Scroll-Driver), sodass die nutzerausgeloeste Wiedergabe zuverlaessig laeuft.
const tweenMotionValue = (
  value: MotionValue<number>,
  to: number,
  duration: number,
  onFrame: (raf: number) => void,
) => {
  const from = value.get();
  const t0 = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const step = (now: number) => {
    const t = Math.min((now - t0) / duration, 1);
    value.set(from + (to - from) * easeOutCubic(t));
    if (t < 1) onFrame(requestAnimationFrame(step));
  };
  onFrame(requestAnimationFrame(step));
};

/**
 * Cinematic Scroll-Showcase (inspiriert von siena.film / skiper-ui skiper29).
 *
 * Beim Scrollen (oder per Klick auf "Play") oeffnet sich eine weisse Matte ueber
 * eine wachsende SVG-Maske ("Player-Fenster"), das Bild skaliert cinematisch,
 * Play-Button + Intro faden aus, Outro-Headline + CTA faden ein.
 *
 * Zwei Wiedergabe-Wege ("Reveal per Klick abspielen"):
 *   - Standard: Klick auf Play scrollt sanft durch die Enthuellung (Scroll-Driver).
 *   - Reduced-Motion: Klick spielt die Enthuellung per Tween an Ort und Stelle ab
 *     (kein Scroll-Hijack) — explizit nutzerausgeloest, daher a11y-konform.
 *
 * Nur Framer Motion (bereits im Projekt), keine Lenis-Dependency noetig.
 *
 * Hinweis Farben: Die Tailwind-Config (index.html) mappt white/black/blue auf
 * CSS-Variablen; der Tailwind-Opacity-Modifier (bg-black/45) funktioniert damit
 * NICHT. Fuer Transparenzen daher Kanal-Variablen als Arbitrary-Value nutzen:
 * rgb(var(--cc-carbon-rgb)/0.55) — analog zur bestehenden HeroSection.
 */

// Zentrales Dokumentations-Bild. Lokales Asset (robust, SEO-konform: lokal,
// explizite Dimensionen) — bei Bedarf gegen ein anderes /assets-WebP austauschbar.
const SHOWCASE_IMAGE = '/assets/carcare-hero-workshop.jpeg';
const SHOWCASE_ALT =
  'Blick in die CarCare Meisterwerkstatt Leipzig – Premiumfahrzeuge bei Aufbereitung und Lackierung';

/* ------------------------------------------------------------------ */
/* Gemeinsame Reveal-Buehne (aus progress 0..1 abgeleitet)             */
/* ------------------------------------------------------------------ */
const RevealStage: React.FC<{ progress: MotionValue<number>; onPlay: () => void }> = ({
  progress,
  onPlay,
}) => {
  // Cinematische Bild-Skalierung (scroll-based image scaling)
  const imageScale = useTransform(progress, [0, 1], [1.32, 1.04]);

  // Custom SVG-Masken-Fenster oeffnet sich (viewBox 0 0 100 100)
  const winW = useTransform(progress, [0, 0.92], [46, 175]);
  const winH = useTransform(progress, [0, 0.92], [30, 175]);
  const winX = useTransform(progress, [0, 0.92], [27, -37.5]);
  const winY = useTransform(progress, [0, 0.92], [35, -37.5]);
  const winR = useTransform(progress, [0, 0.92], [3.4, 0]);

  // Play-Button + Intro (video-like presentation) — faden frueh aus
  const introOpacity = useTransform(progress, [0, 0.16], [1, 0]);
  const introScale = useTransform(progress, [0, 0.18], [1, 0.86]);
  const introPointer = useTransform(progress, (v) => (v > 0.14 ? 'none' : 'auto'));

  // Cinematic Grade + Outro-Headline erscheinen gegen Ende
  const gradeOpacity = useTransform(progress, [0.42, 0.9], [0, 1]);
  const outroOpacity = useTransform(progress, [0.6, 0.92], [0, 1]);
  const outroY = useTransform(progress, [0.6, 0.92], [44, 0]);
  const outroPointer = useTransform(progress, (v) => (v > 0.7 ? 'auto' : 'none'));

  return (
    <>
      {/* Bild-Ebene */}
      <motion.div style={{ scale: imageScale }} className="absolute inset-0">
        <img
          src={SHOWCASE_IMAGE}
          alt={SHOWCASE_ALT}
          width={2400}
          height={1350}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
        <motion.div
          style={{ opacity: gradeOpacity }}
          className="absolute inset-0 bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.85)] via-[rgb(var(--cc-carbon-rgb)/0.25)] to-transparent"
        />
      </motion.div>

      {/* Weisse Matte mit wachsendem SVG-Masken-Fenster */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask id="cc-cinematic-reveal">
            {/* weiss = Matte sichtbar, schwarz = Matte ausgeblendet (Bild frei) */}
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <motion.rect fill="black" width={winW} height={winH} x={winX} y={winY} rx={winR} />
          </mask>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="#ffffff" mask="url(#cc-cinematic-reveal)" />
      </svg>

      {/* Intro: Kicker + Play-Button (klickbar) + Hinweis */}
      <motion.div
        style={{ opacity: introOpacity, scale: introScale, pointerEvents: introPointer }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
      >
        <span className="pointer-events-none mb-6 inline-flex items-center rounded-full bg-[rgb(var(--cc-carbon-rgb)/0.55)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-lg backdrop-blur-sm">
          CarCare Dokumentation
        </span>
        <button
          type="button"
          onClick={onPlay}
          aria-label="Cinematische Werkstatt-Enthüllung abspielen"
          className="group relative flex h-20 w-20 items-center justify-center rounded-full outline-none"
        >
          <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-[rgb(255_255_255/0.7)] bg-white text-gray-950 shadow-[0_20px_45px_-20px_rgb(var(--cc-carbon-rgb)/0.7)] backdrop-blur-sm transition-transform duration-200 group-hover:scale-110 group-active:scale-95 group-focus-visible:ring-4 group-focus-visible:ring-[rgb(var(--cc-signal-blue-rgb)/0.55)]">
            <Play size={26} className="ml-1 fill-current" />
          </span>
        </button>
        <span className="pointer-events-none mt-5 text-xs font-semibold tracking-wide text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
          Abspielen
        </span>
      </motion.div>

      {/* Outro: Headline + CTA */}
      <motion.div
        style={{ opacity: outroOpacity, y: outroY, pointerEvents: outroPointer }}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-28 lg:pb-16"
      >
        <div className="container mx-auto max-w-5xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
            Einblick in die Meisterwerkstatt
          </span>
          <h2
            id="cinematic-heading"
            className="max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl"
          >
            3.000 m² Werkstatt. Über 30 Jahre Präzision.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[rgb(255_255_255/0.85)] md:text-lg">
            Als Glasurit-Lackpartner und Meisterbetrieb in Leipzig bringen wir Fahrzeuge
            farbtongenau und makellos zurück – in Erstausrüster-Qualität, inklusive
            kompletter Unfall- und Versicherungsabwicklung.
          </p>
          <a
            href="/leistungen"
            className="cc-gradient-button mt-8 inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
          >
            Leistungen entdecken
            <ArrowUpRight size={16} />
          </a>
        </div>
      </motion.div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll-Variante (Standard): Scroll ODER Klick spielt die Enthuellung */
/* ------------------------------------------------------------------ */
const ScrollShowcase: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(0);

  // Scroll-Fortschritt selbst berechnen. Framer useScroll({target}) erkennt hier
  // faelschlich <main overflow-y:auto> als Scroll-Container (scrollTop bleibt 0),
  // daher messen wir robust per getBoundingClientRect gegen das window.
  const progress = useMotionValue(0);
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const dist = el.offsetHeight - window.innerHeight;
      const p = dist > 0 ? -rect.top / dist : 0;
      progress.set(Math.min(Math.max(p, 0), 1));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [progress]);

  // "Play": sanftes Auto-Scrollen durch die Enthuellung. Der Scroll-Driver oben
  // uebersetzt die Scroll-Position live in progress — die Enthuellung spielt sich
  // also waehrend des Auto-Scrolls ab.
  const playReveal = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    cancelAnimationFrame(autoScrollRef.current);
    const rect = el.getBoundingClientRect();
    const startAbs = rect.top + window.scrollY;
    const dist = el.offsetHeight - window.innerHeight;
    const startY = window.scrollY;
    const targetY = startAbs + dist * 0.96;
    const delta = targetY - startY;
    if (Math.abs(delta) < 8) return;
    const duration = 2600;
    const t0 = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const t = Math.min((now - t0) / duration, 1);
      window.scrollTo(0, startY + delta * easeOutCubic(t));
      if (t < 1) autoScrollRef.current = requestAnimationFrame(step);
    };
    autoScrollRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => () => cancelAnimationFrame(autoScrollRef.current), []);

  // Manuelles "Pinning" per Transform statt CSS-sticky (<main> nutzt
  // overflow-y:auto + transform:translateZ(0) gegen Scroll-Flackern, was
  // sticky/fixed unbrauchbar macht). Track 320svh - 100svh = 220% Ebenenhoehe.
  const pinY = useTransform(progress, [0, 1], ['0%', '220%']);

  return (
    <section aria-labelledby="cinematic-heading" className="relative bg-white">
      <div ref={trackRef} className="relative h-[320svh]">
        <motion.div
          style={{ y: pinY }}
          className="absolute inset-x-0 top-0 flex h-[100svh] items-center justify-center overflow-hidden"
        >
          <RevealStage progress={progress} onPlay={playReveal} />
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Reduced-Motion-Variante: Klick spielt die Enthuellung in-place ab   */
/* ------------------------------------------------------------------ */
const StaticShowcase: React.FC = () => {
  const progress = useMotionValue(0);
  const [open, setOpen] = useState(false);
  const tweenRef = useRef(0);

  const playReveal = useCallback(() => {
    cancelAnimationFrame(tweenRef.current);
    const target = progress.get() > 0.5 ? 0 : 1;
    setOpen(target === 1);
    tweenMotionValue(progress, target, 1900, (raf) => {
      tweenRef.current = raf;
    });
  }, [progress]);

  useEffect(() => () => cancelAnimationFrame(tweenRef.current), []);

  return (
    <section aria-labelledby="cinematic-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="relative h-[68svh] min-h-[440px] overflow-hidden rounded-[1.75rem] shadow-[0_40px_90px_-60px_rgb(var(--cc-carbon-rgb)/0.7)]">
          <RevealStage progress={progress} onPlay={playReveal} />
          {open && (
            <button
              type="button"
              onClick={playReveal}
              className="absolute right-5 top-5 z-20 inline-flex items-center gap-2 rounded-full bg-[rgb(var(--cc-carbon-rgb)/0.55)] px-4 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-105"
            >
              Zurückspulen
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

const CinematicShowcase: React.FC = () => {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <StaticShowcase /> : <ScrollShowcase />;
};

export default CinematicShowcase;
