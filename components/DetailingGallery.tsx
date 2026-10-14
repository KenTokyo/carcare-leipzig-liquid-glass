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
import GanzwortTitel from './GanzwortTitel';

/**
 * DetailingGallery — Mehrspalten-Parallax-Galerie (inspiriert von skiper-ui
 * skiper30 / olivierlarose). Mehrere Bild-Spalten wandern beim Scrollen mit
 * unterschiedlicher Geschwindigkeit -> Tiefen-/Parallax-Effekt.
 *
 * Nur Framer Motion (bereits im Projekt). Die globale `scroll-behavior: smooth`
 * (index.css) ersetzt Lenis, daher KEINE zusaetzliche Dependency.
 *
 * Bilder sind Marken-Platzhalter (Verlaufskacheln mit Icon + Label), bis echte Fotos kommen (seit 2026-10-14 nach und
 * nach, B48–B58). Zum Austausch bei einem Eintrag `src` (+ `alt`) setzen -> es wird dann ein <img> statt des
 * Platzhalters gerendert. Die Fotos entstehen mit `npm run fotos` (Eintraege „GALERIE“ in `scripts/lib/fotos-liste.mjs`).
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
//
// NICHT WIEDER AUFNEHMEN: „Scheinwerfer-Politur“ wurde am 2026-09-02 entfernt
// (Backlog 1.12, rechtlich heikel). Es war die einzige Fundstelle im ganzen Projekt.
const ITEMS: GalleryItem[] = [
  {
    label: 'Innenaufbereitung',
    iconName: 'Sparkles',
    gradient: GRADIENTS[0],
    // B48, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/innenaufbereitung-fussraum-leipzig-carcare.webp',
    alt: 'Frisch gereinigter Fahrerfußraum mit sauberer Velours-Fußmatte nach der Innenaufbereitung',
  },
  {
    label: 'Außenreinigung',
    iconName: 'Droplets',
    gradient: GRADIENTS[1],
    // B49, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/aussenreinigung-sportwagen-leipzig-carcare.webp',
    alt: 'Frisch gereinigter hellblauer Sportwagen mit Heckflügel in unserer Halle',
  },
  {
    label: 'Lackpolitur',
    iconName: 'Gauge',
    gradient: GRADIENTS[2],
    // B50, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/lackpolitur-poliermaschine-leipzig-carcare.webp',
    alt: 'Rotationspoliermaschine mit Lammfellpad bei der Lackpolitur auf dunklem Lack',
  },
  {
    label: 'Cockpit-Detail',
    iconName: 'Car',
    gradient: GRADIENTS[3],
    // B51, echtes Foto seit 2026-10-14 (Backlog 5.38), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/cockpit-detailpinsel-leipzig-carcare.webp',
    alt: 'Reinigung der Mittelkonsole rund um den Wählhebel mit einem weichen Detailpinsel',
  },
  {
    label: 'Versiegelung',
    iconName: 'ShieldCheck',
    gradient: GRADIENTS[4],
    // B52, echtes Foto seit 2026-10-14 (User; die Kachel bleibt neben „Keramikschutz“ bestehen, 5.41 nicht umgesetzt).
    src: '/assets/galerie/versiegelung-cabriodach-leipzig-carcare.webp',
    alt: 'Versiegelung wird auf das Stoffverdeck eines Cabrios gesprüht',
  },
  {
    label: 'Felgenreinigung',
    iconName: 'Wrench',
    gradient: GRADIENTS[5],
    // B53, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/felgenreinigung-buerste-leipzig-carcare.webp',
    alt: 'Felgenbürste in den eingeschäumten Speichen eines Vorderrades',
  },
  {
    label: 'Lederpflege',
    iconName: 'Sparkles',
    gradient: GRADIENTS[1],
    // B54, echtes Foto seit 2026-10-14 (Backlog 5.40), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/lederpflege-sportsitz-leipzig-carcare.webp',
    alt: 'Mitarbeiter trägt mit Handschuh und Tuch Lederpflege auf die Lehne eines Ledersportsitzes auf',
  },
  {
    label: 'Motorraumpflege',
    iconName: 'Wrench',
    gradient: GRADIENTS[0],
    // B55, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/motorraumpflege-leipzig-carcare.webp',
    alt: 'Mitarbeiter reinigt die Abdeckungen im geöffneten Motorraum mit einem Mikrofasertuch',
  },
  {
    label: 'Keramikschutz',
    iconName: 'ShieldCheck',
    gradient: GRADIENTS[3],
    // B56, echtes Foto seit 2026-10-14 (Backlog 5.39), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/keramikversiegelung-auftragen-leipzig-carcare.webp',
    alt: 'Keramikversiegelung wird mit dem Applikator auf den Lack aufgetragen',
  },
  {
    label: 'Politur-Finish',
    iconName: 'Droplets',
    gradient: GRADIENTS[4],
    // B57, echtes Foto seit 2026-10-14 (Backlog 5.37), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/politur-finish-lackglanz-leipzig-carcare.webp',
    alt: 'Frisch polierter Lack an Haube und Kotflügel, die Hallenbeleuchtung spiegelt sich klar',
  },
  {
    label: 'Endkontrolle',
    iconName: 'Car',
    gradient: GRADIENTS[5],
    // B58, echtes Foto seit 2026-10-14 (Backlog 5.42), Ausschnitt in `scripts/lib/fotos-liste.mjs`.
    src: '/assets/galerie/endkontrolle-lackpruefung-leipzig-carcare.webp',
    alt: 'Mitarbeiter prüft bei der Endkontrolle den Lack einer Fahrzeugtür aus nächster Nähe',
  },
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
  // Symbol und Name unten links, weiss: auf dem Platzhalter UND auf dem Foto (User 2026-10-14, nach dem ersten Foto B54:
  // Name und Symbol fehlten dort). Eine Quelle, damit beide Kachelarten gleich beschriftet bleiben.
  //
  // NAME OHNE TRENNSTRICH (`GanzwortTitel` als `span`): Mobil ist die Kachel rund 145 px breit, „Innenaufbereitung“ lief
  // bis 2026-10-14 über den Rand und wurde abgeschnitten („Innenaufbereitu“). Silbentrennung scheidet aus (User 03.10.:
  // keine Bindestriche zur Worttrennung in Kacheln). Jetzt bleibt jedes Wort ganz; nur wenn es nicht passt, wird die
  // Schrift so weit kleiner. Dafuer mobil (2 Spalten, unter `md`) etwas weniger Innenabstand und ein kleineres Symbolfeld.
  const beschriftung = (
    <div className="flex items-center gap-1.5 text-white md:gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 md:h-8 md:w-8">
        <Icon size={16} />
      </span>
      <GanzwortTitel
        als="span"
        text={item.label}
        laufweite={-0.025}
        huelle="min-w-0 flex-1"
        className="block font-bold leading-tight tracking-tight [--titel-max:0.75rem]"
      />
    </div>
  );
  return (
    <div
      /*
       * `h-full` OHNE `heightPx` ist Pflicht, nicht Kosmetik: Im `StaticGrid`
       * (prefers-reduced-motion) steckt die Kachel in einem `aspect-[3/4]`-Wrapper und
       * bekommt KEINE Pixelhoehe. Ohne `h-full` blieb die Hoehe hier `auto` und richtete
       * sich nach dem Inhalt — der innere Verlauf mit `h-full` fand dann eine
       * auto-hohe Elternbox vor und kollabierte mit. Gemessen bei 1200 px Breite:
       * Wrapper 291x388, Kachel 291x80. Sichtbar als flache Kacheln mit grossen Luecken.
       *
       * ACHTUNG bei Aenderungen: Der animierte Zweig setzt `heightPx` und liegt in einem
       * Flex-Column-Container — dort waere `h-full` falsch und wuerde die Pixelhoehe
       * ueberschreiben. Deshalb genau eines von beidem, nie beides.
       */
      className={`group relative w-full shrink-0 overflow-hidden rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/10 ${heightPx ? '' : 'h-full'}`}
      style={heightPx ? { height: `${heightPx}px` } : undefined}
      // Platzname fuer `npm run bilder` (seit 2026-10-02): Kommt das Foto, behaelt es die Nummer des Platzhalters
      // mit demselben Namen (B48 ff.). Ohne das Merkmal entstuende eine neue Nummer, die alte entfiele.
      data-bild-ort={item.label}
    >
      {item.src ? (
        <>
          <img
            src={item.src}
            alt={item.alt ?? item.label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/*
            Vignette ringsum im Blau der leeren Kacheln (`.cc-galerie-vignette`, styles/karten.css), seit 2026-10-14 statt
            eines Verlaufs von unten (User). Liegt ueber dem Bild und skaliert beim Hover nicht mit, damit Rand und Schrift
            ruhig stehen. Keine „Beispiel“-Plakette: Das ist ein echtes Foto, kein Beispielmotiv.
          */}
          <div aria-hidden="true" className="cc-galerie-vignette absolute inset-0" />
          {/* Leichter Textschatten: Die Vignette ist an der Unterkante schwaecher als in der Ecke; helle Bildstellen bleiben so lesbar. */}
          <div className="absolute inset-x-0 bottom-0 p-3 [text-shadow:0_1px_6px_rgb(var(--cc-carbon-rgb)/0.65)] md:p-4">{beschriftung}</div>
        </>
      ) : (
        <div
          // Markiert die Stelle fuer `npm run bilder` als „hier fehlt ein Foto“ (Backlog 3.23).
          // Ein Verlauf ist fuer den Rundgang sonst nicht von Dekoration zu unterscheiden.
          data-bild-platzhalter={item.label}
          className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${item.gradient} p-3 transition-transform md:p-4 duration-700 ease-out group-hover:scale-[1.04]`}
        >
          {/*
            KEIN `backdrop-blur` auf Badge und Icon-Feld (entfernt 2026-08-10). Beide
            liegen auf einem gleichmaessigen Verlauf — ein Blur davon ist visuell kaum
            wahrnehmbar. Kosten dagegen erheblich: Bei aktivem Parallax bewegen sich rund
            18 Kacheln pro Frame, jede mit zwei `backdrop-filter`-Flaechen, die dabei
            ihren Hintergrund neu abtasten muessen. Das ist im kompositierten
            `.site-main-shell` (`transform: translateZ(0)`) eine typische Quelle fuer
            Flimmern und Schlieren.
          */}
          <span className="self-end rounded-full bg-white/10 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Beispiel
          </span>
          {beschriftung}
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
    <section id="einblicke" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Einblicke"
          title="Ergebnisse, die man sieht."
          description="Beispielhafte Eindrücke aus Innen-, Außen- und Lackaufbereitung."
        />

        {/*
          `bandRef` haengt am AEUSSEREN Container und damit in BEIDEN Zweigen.
          Vorher trug ihn nur der Animations-Zweig: Bei aktiviertem
          `prefers-reduced-motion` rendert `StaticGrid`, der Ref blieb leer und
          `useScroll({ target: bandRef })` warf „Target ref is defined but not hydrated" —
          ein ungefangener Fehler, der React die GESAMTE Seite abraeumen liess
          (/fahrzeugaufbereitung-leipzig blieb komplett weiss).

          Das traf real: Windows meldet reduced-motion systemweit (siehe Projektnotiz),
          und der Prerender bemerkt es nicht, weil Headless-Chrome es nicht meldet —
          das statische HTML war vollstaendig, erst der Client-Mount brach ab.
        */}
        <div ref={bandRef}>
          {prefersReducedMotion ? (
            <StaticGrid />
          ) : (
            <div
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
      </div>
    </section>
  );
};

export default DetailingGallery;
