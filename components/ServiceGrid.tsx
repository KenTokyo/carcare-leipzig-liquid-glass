import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { OverviewService } from '../types';
import ExpandingCardAccordion from './ExpandingCardAccordion';

/**
 * Eigenes Foto je Kachel: Der ExpandOnHover-Effekt (skiper52/53) lebt davon, dass sich die
 * Karten optisch unterscheiden — mit einem gemeinsamen Default-Bild wirkt das Aufklappen flach.
 * Dateien liegen in /public/assets/kacheln (aus PNG konvertiert via `npm run images`).
 */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

const overviewServices: OverviewService[] = [
  { id: 'aufbereitung', title: 'Fahrzeugaufbereitung', description: 'Innen, außen, Lackpflege und Pflegepakete für sichtbaren Werterhalt.', iconName: 'Sparkles', href: '/fahrzeugaufbereitung-leipzig', cta: 'Zur Aufbereitung', backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare') },
  { id: 'unfall', title: 'Unfallinstandsetzung', description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.', iconName: 'Wrench', href: '/unfallinstandsetzung-leipzig', cta: 'Unfall melden', backgroundImage: kachel('versicherung-schadenabwicklung-leipzig-carcare') },
  { id: 'lackierung', title: 'Neu- und Reparaturlackierung', description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.', iconName: 'PaintBucket', href: '/autolackierung-leipzig', cta: 'Zur Lackierung', backgroundImage: kachel('autolackierung-leipzig-carcare') },
  { id: 'smart', title: 'Smart Repair', description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.', iconName: 'ScanLine', href: '/smart-repair-leipzig', cta: 'Smart Repair ansehen', backgroundImage: kachel('smart-repair-leipzig-carcare') },
  { id: 'dellen', title: 'Dellenentfernung', description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.', iconName: 'Hammer', href: '/dellenentfernung-leipzig', cta: 'Dellen entfernen', backgroundImage: kachel('dellenentfernung-leipzig-carcare') },
  { id: 'hagel', title: 'Hagelschadenreparatur', description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.', iconName: 'CloudHail', href: '/hagelschadenreparatur-leipzig', cta: 'Hagelschaden prüfen', backgroundImage: kachel('hagelschadenreparatur-leipzig') },
  { id: 'felgen', title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.', iconName: 'CircleDot', href: '/felgenreparatur-leipzig', cta: 'Felgen reparieren', backgroundImage: kachel('felgenreparatur-leipzig-carcare') },
  { id: 'glas', title: 'Autoglas / Scheibenfolien', description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.', iconName: 'Glasses', href: '/autoglas-leipzig', cta: 'Zum Autoglas', backgroundImage: kachel('autoglas-scheibenreparatur-leipzig-carcare') },
  { id: 'leasing', title: 'Leasingrückgabe', description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.', iconName: 'KeyRound', href: '/fahrzeugaufbereitung-leipzig', cta: 'Leasing vorbereiten', backgroundImage: kachel('leasingrueckgabe-leipzig-carcare') },
  { id: 'fuhrpark', title: 'Fuhrparkservice', description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.', iconName: 'TruckIcon', href: '/fuhrparkservice-leipzig', cta: 'Fuhrparkservice', backgroundImage: kachel('autohaus-fuhrpark-service-leipzig-carcare') },
];

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
          Ecken im Navbar-Radius (--cc-nav-radius = 24px) abgerundet (overflow-hidden clippt
          Bild + Overlays auf die runde Form). pointer-events-none + aria-hidden. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[var(--cc-nav-radius)]">
        <AnimatePresence>
          {activeImage && (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img src={activeImage} alt="" decoding="async" className="h-full w-full object-cover" />
              {/* Heller Veil (vertikal): haelt den Header-Bereich oben lesbar; Mitte duenn. */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/[0.18] to-white/45" />
              {/* Header-Schutz (leicht): horizontaler Verlauf, links etwas weisser, damit die
                  Ueberschrift „Leistungsuebersicht" auch am rechten H2-Ende sicher lesbar bleibt.
                  Die eigentliche Rechts-Verschiebung macht die verschobene Radiale unten. */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgb(255 255 255 / 0.85) 0%, rgb(255 255 255 / 0.45) 28%, rgb(255 255 255 / 0) 52%)' }}
              />
              {/* Weisse Rand-Vignette: die Raender laufen ins Weiss aus (Foto „fliesst" randlos
                  in den hellen Hintergrund). `closest-side` = Verlauf endet an den NAECHSTEN
                  Kanten → alle vier Raender sind zu 100 % weiss. WICHTIG: transparentes WEISS
                  statt `transparent` (sonst grauer Saum). Staerke ~10 % reduziert (33/90).
                  Zentrum bei 58 % → das klare Bildfenster sitzt RECHTS der Mitte, links (Header)
                  wird dadurch weiss. */}
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse closest-side at 58% 48%, rgb(255 255 255 / 0) 33%, rgb(255 255 255 / 1) 90%)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container relative mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Leistungsübersicht</span>
            <h2 id="services-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Unsere Leistungen rund ums Fahrzeug.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
              Von der gründlichen Fahrzeugaufbereitung bis zur kompletten Unfallinstandsetzung: CarCare Leipzig bietet Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand.
            </p>
          </div>
          <a href="#contact-termin" className="cc-gradient-button inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-white">
            Termin oder Beratung anfragen
            <ArrowUpRight size={16} />
          </a>
        </div>

        <ExpandingCardAccordion items={overviewServices} onActiveImageChange={setActiveImage} />
      </div>
    </section>
  );
};

export default ServiceGrid;
