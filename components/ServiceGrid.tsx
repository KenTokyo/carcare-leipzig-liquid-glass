import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OverviewService } from '../types';
import ExpandingCardAccordion from './ExpandingCardAccordion';

const overviewServices: OverviewService[] = [
  { id: 'aufbereitung', title: 'Fahrzeugaufbereitung', description: 'Innen, außen, Lackpflege und Pflegepakete für sichtbaren Werterhalt.', iconName: 'Sparkles', href: '/fahrzeugaufbereitung-leipzig', cta: 'Zur Aufbereitung' },
  { id: 'unfall', title: 'Unfallinstandsetzung', description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.', iconName: 'Wrench', href: '/unfallinstandsetzung-leipzig', cta: 'Unfall melden' },
  { id: 'lackierung', title: 'Neu- und Reparaturlackierung', description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.', iconName: 'PaintBucket', href: '/autolackierung-leipzig', cta: 'Zur Lackierung' },
  { id: 'smart', title: 'Smart Repair', description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.', iconName: 'ScanLine', href: '/smart-repair-leipzig', cta: 'Smart Repair ansehen' },
  { id: 'dellen', title: 'Dellenentfernung', description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.', iconName: 'Hammer', href: '/dellenentfernung-leipzig', cta: 'Dellen entfernen' },
  { id: 'hagel', title: 'Hagelschadenreparatur', description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.', iconName: 'CloudHail', href: '/hagelschadenreparatur-leipzig', cta: 'Hagelschaden prüfen' },
  { id: 'felgen', title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.', iconName: 'CircleDot', href: '/felgenreparatur-leipzig', cta: 'Felgen reparieren' },
  { id: 'glas', title: 'Autoglas / Scheibenfolien', description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.', iconName: 'Glasses', href: '/autoglas-leipzig', cta: 'Zum Autoglas' },
  { id: 'leasing', title: 'Leasingrückgabe', description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.', iconName: 'KeyRound', href: '/fahrzeugaufbereitung-leipzig', cta: 'Leasing vorbereiten' },
  { id: 'fuhrpark', title: 'Fuhrparkservice', description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.', iconName: 'TruckIcon', href: '/fuhrparkservice-leipzig', cta: 'Fuhrparkservice' },
];

const ServiceGrid: React.FC = () => {
  return (
    <section id="leistungen" aria-labelledby="services-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
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

        <ExpandingCardAccordion items={overviewServices} />
      </div>
    </section>
  );
};

export default ServiceGrid;
