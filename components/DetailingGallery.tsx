import React from 'react';
import { Car, Droplets, Gauge, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { SectionIntro } from './PageBlocks';
import GanzwortTitel from './GanzwortTitel';
import CoverflowKarussell from './CoverflowKarussell';

/**
 * DetailingGallery: Sektion „Einblicke · Ergebnisse, die man sieht.“ auf /fahrzeugaufbereitung-leipzig.
 *
 * SEIT 2026-10-14 EIN KARUSSELL nach skiper49 (User: „genau in der Art und Weise wie im Link“): drei Karten nebeneinander,
 * die mittlere flach, die seitlichen nach hinten gekippt, Ziehen/Wischen, Endlosschleife, Punkte darunter. Mechanik in
 * `components/CoverflowKarussell.tsx`, Vorlage, Messwerte und Entscheidung in `docs/einblicke-karussell/tasks/`. Bis dahin
 * eine Parallax-Galerie in vier Spalten (skiper30) mit ruhigem Raster bei reduzierter Bewegung; beides ist entfallen.
 *
 * DIE KARTEN BLEIBEN, WIE SIE SIND (User): abgerundet, Foto mit Vignette im Galerie-Blau, Symbol und Name weiss unten
 * links (`Tile`). Sie sind nur groesser: Drei Karten fuellen die Breite, auf dem Smartphone steht die mittlere gross, die
 * Nachbarn sind angeschnitten.
 *
 * Fotos: `src` (+ `alt`) je Eintrag, erzeugt mit `npm run fotos` (Eintraege „GALERIE“ in `scripts/lib/fotos-liste.mjs`).
 * Ohne `src` rendert die Kachel den Platzhalter (Verlauf, „Beispiel“); seit 2026-10-14 hat jede Kachel ein Foto.
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

// Motive rund um die Fahrzeugaufbereitung, in dieser Reihenfolge im Karussell (das erste steht beim Laden in der Mitte).
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

/* ------------------------------------------------------------------ */
/* Einzelne Kachel: echtes Foto oder Platzhalter-Verlauf               */
/* ------------------------------------------------------------------ */
const Tile: React.FC<{ item: GalleryItem }> = ({ item }) => {
  const Icon = ICONS[item.iconName];
  // Symbol und Name unten links, weiss: auf dem Platzhalter UND auf dem Foto (User 2026-10-14, nach dem ersten Foto B54:
  // Name und Symbol fehlten dort). Eine Quelle, damit beide Kachelarten gleich beschriftet bleiben.
  //
  // NAME OHNE TRENNSTRICH (`GanzwortTitel` als `span`): Silbentrennung scheidet aus (User 03.10.: keine Bindestriche zur
  // Worttrennung in Kacheln). Jedes Wort bleibt ganz; nur wenn es nicht passt, wird die Schrift so weit kleiner. Bis
  // 2026-10-14 wurde „Innenaufbereitung“ in der 145 px schmalen Mobilkachel abgeschnitten („Innenaufbereitu“).
  // Die Groesse waechst mit der Karte (Karussell seit 2026-10-14): 13 px mobil, 16 px ab `md`.
  const beschriftung = (
    <div className="flex items-center gap-1.5 text-white md:gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 md:h-9 md:w-9">
        <Icon size={16} />
      </span>
      <GanzwortTitel
        als="span"
        text={item.label}
        laufweite={-0.025}
        huelle="min-w-0 flex-1"
        className="block font-bold leading-tight tracking-tight [--titel-max:0.8125rem] md:[--titel-max:1rem]"
      />
    </div>
  );
  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-2xl shadow-lg shadow-black/20 ring-1 ring-white/10"
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
            decoding="async"
            // Kein natives Bild-Ziehen: Es wuerde das Wischen des Karussells abfangen.
            draggable={false}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {/*
            Vignette ringsum im Blau der leeren Kacheln (`.cc-galerie-vignette`, styles/karten.css), seit 2026-10-14 statt
            eines Verlaufs von unten (User). Liegt ueber dem Bild und skaliert beim Hover nicht mit, damit Rand und Schrift
            ruhig stehen. Keine „Beispiel“-Plakette: Das ist ein echtes Foto, kein Beispielmotiv.
          */}
          <div aria-hidden="true" className="cc-galerie-vignette absolute inset-0" />
          {/* Leichter Textschatten: Die Vignette ist an der Unterkante schwaecher als in der Ecke; helle Bildstellen bleiben so lesbar. */}
          <div className="absolute inset-x-0 bottom-0 p-3 [text-shadow:0_1px_6px_rgb(var(--cc-carbon-rgb)/0.65)] md:p-5">{beschriftung}</div>
        </>
      ) : (
        <div
          // Markiert die Stelle fuer `npm run bilder` als „hier fehlt ein Foto“ (Backlog 3.23).
          // Ein Verlauf ist fuer den Rundgang sonst nicht von Dekoration zu unterscheiden.
          data-bild-platzhalter={item.label}
          className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${item.gradient} p-3 transition-transform duration-700 ease-out group-hover:scale-[1.04] md:p-5`}
        >
          {/* KEIN `backdrop-blur` auf Badge und Icon-Feld (entfernt 2026-08-10): auf einem gleichmaessigen Verlauf kaum
              sichtbar, in bewegten Kacheln aber eine typische Quelle fuer Flimmern und Schlieren. */}
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
/* Sektion                                                             */
/* ------------------------------------------------------------------ */
const DetailingGallery: React.FC = () => (
  <section id="einblicke" className="bg-white px-6 py-20 md:py-28">
    <div className="container mx-auto">
      <SectionIntro
        eyebrow="Einblicke"
        title="Ergebnisse, die man sieht."
        description="Beispielhafte Eindrücke aus Innen-, Außen- und Lackaufbereitung."
      />
      {/*
        KARTENBREITE `--karte` in `cqi` der Karussell-Huelle (= Containerbreite). Drei Karten fuellen die Breite, wenn die
        mittlere rund 34 % misst: Die gekippten Nachbarn reichen nach der Coverflow-Projektion bis rund 1,43 Kartenbreiten
        aus der Mitte (an der Vorlage gemessen: 300-px-Karten in einer 856 px breiten Buehne). Obergrenze 30rem, damit die
        Karten auf grossen Bildschirmen nicht hoeher werden als das Fenster. Mobil 62 %: Die mittlere Karte steht gross, die
        Nachbarn sind angeschnitten.
      */}
      <CoverflowKarussell
        eintraege={ITEMS}
        karte={(item) => <Tile item={item} />}
        name={(item) => item.label}
        bezeichnung="Einblicke in unsere Fahrzeugaufbereitung"
        className="[--karte:62cqi] md:[--karte:min(34cqi,30rem)]"
      />
    </div>
  </section>
);

export default DetailingGallery;
