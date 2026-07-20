import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { Car, Droplets, Gauge, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { SectionIntro } from './PageBlocks';

/**
 * DetailingGallery — Mehrspalten-Parallax-Galerie (inspiriert von skiper-ui
 * skiper30 / olivierlarose). Mehrere Bild-Spalten wandern beim Scrollen mit
 * unterschiedlicher Geschwindigkeit -> Tiefen-/Parallax-Effekt.
 *
 * Nur Framer Motion (bereits im Projekt). Die globale `scroll-behavior: smooth`
 * (index.css) ersetzt Lenis, daher KEINE zusaetzliche Dependency.
 *
 * Bilder sind aktuell Marken-Platzhalter (Verlaufskacheln mit Icon + Label).
 * Zum Austausch bei einem Eintrag `src` (+ optional `alt`) setzen -> es wird dann
 * ein <img> statt des Platzhalters gerendert. Sonst nichts weiter noetig.
 *
 * Mechanik (gap-frei per Konstruktion): Jede Spalte ist hoeher als das
 * `overflow-hidden`-Band und wird ueber ihren gesamten Ueberhang verschoben.
 * Spalten mit mehr Kacheln haben mehr Ueberhang -> driften schneller -> Parallax.
 *
 * Mobile-First: 2 Spalten (Mobile) -> 3 (md) -> 4 (lg). Bei prefers-reduced-motion
 * wird eine ruhige statische Galerie ohne Parallax gerendert.
 */

const ICONS = { Sparkles, Car, Droplets, Wrench, Gauge, ShieldCheck } as const;

type GalleryItem = {
  label: string;
  iconName: keyof typeof ICONS;
  gradient: string;
  src?: string; // echtes Foto (optional) — ueberschreibt den Platzhalter
  alt?: string;
};

// Premium-Verlaeufe aus den CI-Tokens (carbon / graphite / trust- & signal-blue).
const GRADIENTS = [
  'from-gray-900 to-gray-950',
  'from-blue-900 via-gray-900 to-gray-950',
  'from-gray-800 via-gray-900 to-blue-900',
  'from-blue-800 via-gray-900 to-gray-950',
  'from-gray-900 via-blue-900 to-gray-950',
  'from-gray-950 via-gray-900 to-blue-800',
];

// Platzhalter-Motive rund um die Fahrzeugaufbereitung. `src` je Eintrag ergaenzen,
// sobald echte Fotos vorliegen (z. B. src: '/assets/galerie/innenraum.jpg').
const ITEMS: GalleryItem[] = [
  { label: 'Innenaufbereitung', iconName: 'Sparkles', gradient: GRADIENTS[0] },
  { label: 'Außenreinigung', iconName: 'Droplets', gradient: GRADIENTS[1] },
  { label: 'Lackpolitur', iconName: 'Gauge', gradient: GRADIENTS[2] },
  { label: 'Cockpit-Detail', iconName: 'Car', gradient: GRADIENTS[3] },
  { label: 'Versiegelung', iconName: 'ShieldCheck', gradient: GRADIENTS[4] },
  { label: 'Felgenreinigung', iconName: 'Wrench', gradient: GRADIENTS[5] },
  { label: 'Lederpflege', iconName: 'Sparkles', gradient: GRADIENTS[1] },
  { label: 'Scheinwerfer-Politur', iconName: 'Gauge', gradient: GRADIENTS[2] },
  { label: 'Motorraumpflege', iconName: 'Wrench', gradient: GRADIENTS[0] },
  { label: 'Keramikschutz', iconName: 'ShieldCheck', gradient: GRADIENTS[3] },
  { label: 'Politur-Finish', iconName: 'Droplets', gradient: GRADIENTS[4] },
  { label: 'Endkontrolle', iconName: 'Car', gradient: GRADIENTS[5] },
];

// Kachel-Anzahl je Spalte -> unterschiedliche Ueberhaenge = unterschiedliche
// Drift-Geschwindigkeit. Offsets streuen die Motive ueber die Spalten.
const COLUMNS: { count: number; offset: number; visibility: string }[] = [
  { count: 4, offset: 0, visibility: '' },
  { count: 5, offset: 4, visibility: '' },
  { count: 4, offset: 9, visibility: 'hidden md:flex' },
  { count: 5, offset: 1, visibility: 'hidden lg:flex' },
];

const buildColumn = (count: number, offset: number): GalleryItem[] =>
  Array.from({ length: count }, (_, i) => ITEMS[(offset + i) % ITEMS.length]);

/* ------------------------------------------------------------------ */
/* Einzelne Kachel — Platzhalter-Verlauf oder echtes Foto              */
/* ------------------------------------------------------------------ */
const Tile: React.FC<{ item: GalleryItem; heightPx?: number }> = ({ item, heightPx }) => {
  const Icon = ICONS[item.iconName];
  return (
    <div
      className="group relative w-full shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/10"
      style={heightPx ? { height: `${heightPx}px` } : undefined}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.alt ?? item.label}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div
          className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${item.gradient} p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
        >
          <span className="self-end rounded-full bg-white/10 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
            Beispiel
          </span>
          <div className="flex items-center gap-2 text-white">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
              <Icon size={16} />
            </span>
            <span className="text-xs font-bold leading-tight tracking-tight">{item.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Eine driftende Spalte                                               */
/* ------------------------------------------------------------------ */
const Column: React.FC<{
  items: GalleryItem[];
  y: MotionValue<number>;
  gapPx: number;
  tileHpx: number;
  visibility: string;
}> = ({ items, y, gapPx, tileHpx, visibility }) => (
  <motion.div
    aria-hidden="true"
    className={`relative flex min-w-0 flex-1 flex-col ${visibility}`}
    style={{ y, gap: `${gapPx}px` }}
  >
    {items.map((item, i) => (
      <Tile key={`${item.label}-${i}`} item={item} heightPx={tileHpx} />
    ))}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Statischer Fallback (prefers-reduced-motion)                        */
/* ------------------------------------------------------------------ */
const StaticGrid: React.FC = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
    {ITEMS.map((item, i) => (
      <div key={`${item.label}-${i}`} className="aspect-[3/4]">
        <Tile item={item} />
      </div>
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Galerie                                                             */
/* ------------------------------------------------------------------ */
const DetailingGallery: React.FC = () => {
  const bandRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [viewport, setViewport] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ['start end', 'end start'],
  });

  // Massgaben skalieren mit der Viewport-Hoehe; auf Mobile flacher/kompakter.
  const isMobile = viewport.w < 768;
  const tileHpx = Math.round((isMobile ? 0.34 : 0.42) * viewport.h);
  const gapPx = Math.round((isMobile ? 0.02 : 0.028) * viewport.h);
  const bandHpx = Math.round((isMobile ? 1.05 : 1.4) * viewport.h);

  const overflow = (count: number) =>
    Math.max(count * tileHpx + (count - 1) * gapPx - bandHpx, 0);

  // 4 feste Transforms (Hooks duerfen nicht in Schleifen laufen).
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -overflow(COLUMNS[0].count)]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -overflow(COLUMNS[1].count)]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -overflow(COLUMNS[2].count)]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -overflow(COLUMNS[3].count)]);
  const ys = [y0, y1, y2, y3];

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Einblicke"
          title="Ergebnisse, die man sieht."
          description="Beispielhafte Eindrücke aus Innen-, Außen- und Lackaufbereitung – die Spalten bewegen sich sanft beim Scrollen."
        />

        {prefersReducedMotion ? (
          <StaticGrid />
        ) : (
          <div
            ref={bandRef}
            className="relative flex items-start gap-3 overflow-hidden rounded-[2rem] bg-gray-950 p-3 shadow-[0_34px_90px_-62px_rgb(var(--cc-carbon-rgb)/0.58)] ring-1 ring-white/10 sm:gap-4 sm:p-4"
            style={{ height: `${bandHpx}px` }}
          >
            {COLUMNS.map((col, i) => (
              <Column
                key={i}
                items={buildColumn(col.count, col.offset)}
                y={ys[i]}
                gapPx={gapPx}
                tileHpx={tileHpx}
                visibility={col.visibility}
              />
            ))}

            {/* Weiche Kaschierung oben/unten, damit Kacheln am Bandrand einfaden */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-gray-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-950 to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
};

export default DetailingGallery;
