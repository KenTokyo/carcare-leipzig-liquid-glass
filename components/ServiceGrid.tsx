import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { overviewServices } from '../data/services';
import { videoPlatz } from '../data/videos';
import ExpandingCardAccordion, { type ExpandingCardItem } from './ExpandingCardAccordion';
import PhotoBackdrop from './PhotoBackdrop';

/**
 * Die Kacheldaten liegen zentral in `data/services.ts` — dieselbe Quelle speist die
 * vollstaendige Leistungsseite (`/leistungen`). Neue Leistungen dort ergaenzen, nicht hier.
 *
 * Eigenes Foto je Kachel: Der ExpandOnHover-Effekt (skiper52/53) lebt davon, dass sich die
 * Karten optisch unterscheiden — mit einem gemeinsamen Default-Bild wirkt das Aufklappen flach.
 * Dateien liegen in /public/assets/kacheln (aus PNG konvertiert via `npm run images`).
 */

/**
 * Videos NUR fuer diese Kachelreihe der Startseite (Bildstelle B11, Wunsch des Users vom
 * 2026-09-21: „nur für die Mainpage …, damit wir nicht zu viel Datenvolumen mit der gesamten
 * Seite fressen"). Bewusst hier und nicht im Katalog: `data/services.ts` speist auch die
 * Leistungskarten und Seitenhintergruende der anderen Seiten — dort bleibt das Foto.
 * Das Standbild ersetzt das Kachelfoto, damit beim Anlaufen nichts umspringt.
 */
const STARTSEITEN_VIDEOS: Record<string, string> = {
  lackierung: 'startseite-lackierung',
};

const karten: ExpandingCardItem[] = overviewServices.map((service) => {
  const platzId = STARTSEITEN_VIDEOS[service.id];
  if (!platzId) return service;
  const platz = videoPlatz(platzId);
  if (!platz.quelle || !platz.poster) return service;
  return { ...service, backgroundImage: platz.poster, backgroundVideo: platz.quelle };
});

const ServiceGrid: React.FC = () => {
  // Full-Bleed-Section-Hintergrund: das ExpandingCardAccordion reicht via onActiveImageChange
  // das Bild der AKTUELL AUFGEKLAPPTEN Karte hoch. Der Hintergrund bleibt also stehen, solange
  // eine Karte offen ist (auf Desktop immer) — nicht nur beim Hovern. null = Mobile/kein Bild.
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <section
      id="leistungen"
      aria-labelledby="services-heading"
      // `relative isolate` = eigener Stacking-Context, damit die -z-10-Ebene sauber hinter
      // dem Content und ueber der Section-Bg bleibt (der App-Shell `main` spannt per
      // transform bereits einen Context auf; ohne `isolate` rutschte -z-10 dorthin).
      className="relative isolate bg-gray-50/70 px-6 py-20 md:py-28"
    >
      {/* Hintergrund hinter dem Grid: Bild der aufgeklappten Karte, Crossfade beim Wechsel.
          Die Behandlung (Veils + Vignette) liegt seit 2026-08-03 in `PhotoBackdrop` — die
          Hero-Bereiche der Hub-Seiten nutzen dieselbe Komponente. */}
      <PhotoBackdrop image={activeImage} />

      <div className="container relative mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Leistungsübersicht</span>
            <h2 id="services-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Unsere Leistungen rund ums Fahrzeug.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
              Von der gründlichen Fahrzeugaufbereitung bis zur kompletten Unfallinstandsetzung: Wir bieten Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand.
            </p>
          </div>
          <a href="#contact-termin" className="cc-gradient-button inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-white">
            Termin oder Beratung anfragen
            <ArrowUpRight size={16} />
          </a>
        </div>

        <ExpandingCardAccordion items={karten} onActiveImageChange={setActiveImage} />
      </div>
    </section>
  );
};

export default ServiceGrid;
