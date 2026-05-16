import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wrench,
  PaintBucket,
  ScanLine,
  Hammer,
  CloudHail,
  CircleDot,
  Glasses,
  KeyRound,
  TruckIcon,
  ArrowUpRight,
} from 'lucide-react';
import { OverviewService } from '../types';

const overviewServices: OverviewService[] = [
  { id: 'a1', title: 'Fahrzeugaufbereitung', description: 'Innen, Außen, Lackpflege und Pflegepakete für sichtbaren Werterhalt.', iconName: 'Sparkles', href: '#services' },
  { id: 'a2', title: 'Unfallinstandsetzung', description: 'Komplette Schadenabwicklung – von der Aufnahme bis zur Reparaturlackierung.', iconName: 'Wrench', href: '#unfall' },
  { id: 'a3', title: 'Neu- und Reparaturlackierung', description: 'Lackierungen ohne sichtbare Farbton- oder Effektunterschiede zum Original.', iconName: 'PaintBucket', href: '#services' },
  { id: 'a4', title: 'Smart Repair', description: 'Punktgenaue Lack- und Kunststoffreparatur ohne komplette Neulackierung.', iconName: 'ScanLine', href: '#services' },
  { id: 'a5', title: 'Dellenentfernung', description: 'Lackierfreie Karosserieinstandsetzung – keine Wertminderung, kein Farbtonproblem.', iconName: 'Hammer', href: '#services' },
  { id: 'a6', title: 'Hagelschadenreparatur', description: 'Schnelle Soforthilfe nach Hagelereignissen mit strukturiertem Ablauf.', iconName: 'CloudHail', href: '#unfall' },
  { id: 'a7', title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren – wir sind Wheel-Doctor-Fachbetrieb.', iconName: 'CircleDot', href: '#services' },
  { id: 'a8', title: 'Autoglas & Scheibenfolien', description: 'WINTEC-Partner für Steinschlagreparatur, Scheibentausch und Folien.', iconName: 'Glasses', href: '#services' },
  { id: 'a9', title: 'Leasingrückgabe', description: 'Begutachtung und fachgerechte Instandsetzung vor der Rückgabe.', iconName: 'KeyRound', href: '#services' },
  { id: 'a10', title: 'Fuhrparkservice', description: 'Planbare Pflege- und Reparaturprozesse für gewerbliche Flotten.', iconName: 'TruckIcon', href: '#geschaeft' },
];

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles size={20} />,
  Wrench: <Wrench size={20} />,
  PaintBucket: <PaintBucket size={20} />,
  ScanLine: <ScanLine size={20} />,
  Hammer: <Hammer size={20} />,
  CloudHail: <CloudHail size={20} />,
  CircleDot: <CircleDot size={20} />,
  Glasses: <Glasses size={20} />,
  KeyRound: <KeyRound size={20} />,
  TruckIcon: <TruckIcon size={20} />,
};

const ServiceGrid: React.FC = () => {
  return (
    <div className="bg-gray-50/50 py-24 md:py-32 px-6 border-y border-gray-100">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 mb-4">Leistungsübersicht</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Unsere Leistungen <span className="text-gray-400 font-light">rund ums Fahrzeug.</span>
            </h3>
            <p className="mt-6 text-gray-600 text-base md:text-lg font-light leading-relaxed max-w-xl">
              Von der gründlichen Fahrzeugaufbereitung bis zur kompletten Unfallinstandsetzung: CarCare Leipzig bietet alle wichtigen Leistungen für Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand.
            </p>
          </motion.div>
          <motion.a
            href="#services"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors"
          >
            Alle Leistungen ansehen <ArrowUpRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-5">
          {overviewServices.map((service, idx) => (
            <motion.a
              key={service.id}
              href={service.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: (idx % 5) * 0.05 }}
              whileHover={{ y: -3 }}
              className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-400"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-gray-900 text-gray-900 group-hover:text-white flex items-center justify-center mb-5 transition-all duration-300">
                {iconMap[service.iconName]}
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{service.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
              <div className="absolute top-5 right-5 w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                <ArrowUpRight size={14} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceGrid;
