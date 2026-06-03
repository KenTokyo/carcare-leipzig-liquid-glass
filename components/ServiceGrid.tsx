import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CircleDot,
  CloudHail,
  Glasses,
  Hammer,
  KeyRound,
  PaintBucket,
  ScanLine,
  Sparkles,
  TruckIcon,
  Wrench,
} from 'lucide-react';
import { OverviewService } from '../types';

const overviewServices: OverviewService[] = [
  { id: 'aufbereitung', title: 'Fahrzeugaufbereitung', description: 'Innen, außen, Lackpflege und Pflegepakete für sichtbaren Werterhalt.', iconName: 'Sparkles', href: '/fahrzeugaufbereitung-leipzig' },
  { id: 'unfall', title: 'Unfallinstandsetzung', description: 'Schadenaufnahme, Kalkulation und Reparatur aus einer Hand.', iconName: 'Wrench', href: '/unfallinstandsetzung-leipzig' },
  { id: 'lackierung', title: 'Neu- und Reparaturlackierung', description: 'Saubere Lackierungen ohne sichtbare Farbtonunterschiede.', iconName: 'PaintBucket', href: '/autolackierung-leipzig' },
  { id: 'smart', title: 'Smart Repair', description: 'Punktgenaue Lack- und Kunststoffreparatur für kleinere Schäden.', iconName: 'ScanLine', href: '/smart-repair-leipzig' },
  { id: 'dellen', title: 'Dellenentfernung', description: 'Lackierfreie Instandsetzung bei Dellen und kleinen Karosserieschäden.', iconName: 'Hammer', href: '/dellenentfernung-leipzig' },
  { id: 'hagel', title: 'Hagelschadenreparatur', description: 'Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern.', iconName: 'CloudHail', href: '/hagelschadenreparatur-leipzig' },
  { id: 'felgen', title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb.', iconName: 'CircleDot', href: '/felgenreparatur-leipzig' },
  { id: 'glas', title: 'Autoglas / Scheibenfolien', description: 'Steinschlagreparatur, Scheibentausch und Folien über WINTEC.', iconName: 'Glasses', href: '/leistungen' },
  { id: 'leasing', title: 'Leasingrückgabe', description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.', iconName: 'KeyRound', href: '/fahrzeugaufbereitung-leipzig' },
  { id: 'fuhrpark', title: 'Fuhrparkservice', description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.', iconName: 'TruckIcon', href: '/fuhrparkservice-leipzig' },
];

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={21} />,
  Wrench: <Wrench size={21} />,
  PaintBucket: <PaintBucket size={21} />,
  ScanLine: <ScanLine size={21} />,
  Hammer: <Hammer size={21} />,
  CloudHail: <CloudHail size={21} />,
  CircleDot: <CircleDot size={21} />,
  Glasses: <Glasses size={21} />,
  KeyRound: <KeyRound size={21} />,
  TruckIcon: <TruckIcon size={21} />,
};

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
          <a href="#contact-termin" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-950 shadow-sm ring-1 ring-gray-200 transition-colors hover:text-blue-700">
            Termin oder Beratung anfragen
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {overviewServices.map((service, idx) => (
            <motion.a
              key={service.id}
              href={service.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (idx % 5) * 0.04 }}
              className="group relative flex min-h-[230px] flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {iconMap[service.iconName]}
              </div>
              <h3 className="text-lg font-bold leading-tight text-gray-950">{service.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.description}</p>
              <div className="mt-auto pt-6">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-gray-500 group-hover:text-blue-700">
                  Mehr ansehen
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceGrid;
