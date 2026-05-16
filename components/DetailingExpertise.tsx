import React from 'react';
import { motion } from 'framer-motion';
import { Armchair, SprayCan, Droplets, KeyRound, Package, ArrowUpRight } from 'lucide-react';
import { KnowledgeCard } from '../types';

const knowledgeCards: KnowledgeCard[] = [
  { id: 'k1', title: 'Innenaufbereitung', description: 'Polster, Leder, Geruchsentfernung – tiefe Reinheit im Cockpit.', iconName: 'Armchair', href: '#wissen' },
  { id: 'k2', title: 'Außenaufbereitung', description: 'Schonende Wäsche, Lackreinigung und Versiegelung für sichtbaren Glanz.', iconName: 'SprayCan', href: '#wissen' },
  { id: 'k3', title: 'Lackaufbereitung', description: 'Politur, Hochglanzaufbereitung und Keramikversiegelung für Werterhalt.', iconName: 'Droplets', href: '#wissen' },
  { id: 'k4', title: 'Leasingrückgabe vorbereiten', description: 'Vermeiden Sie hohe Nachzahlungen durch professionelle Begutachtung.', iconName: 'KeyRound', href: '#wissen' },
  { id: 'k5', title: 'Pflegepakete', description: 'Brillant, Intensiv, Premium und Exklusiv – das richtige Paket für jedes Bedürfnis.', iconName: 'Package', href: '#services' },
];

const iconMap: Record<string, React.ReactNode> = {
  Armchair: <Armchair size={22} />,
  SprayCan: <SprayCan size={22} />,
  Droplets: <Droplets size={22} />,
  KeyRound: <KeyRound size={22} />,
  Package: <Package size={22} />,
};

const DetailingExpertise: React.FC = () => {
  return (
    <div id="wissen" className="bg-white py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14 md:mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Autoaufbereitung Wissen</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Autoaufbereitung ist mehr als Reinigung –{' '}
              <span className="text-gray-400">es ist Werterhalt.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5"
          >
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">
              CarCare verfügt über langjährige Erfahrung in professioneller Fahrzeugaufbereitung für Privatkunden, Autohäuser, Fuhrparks und hochwertige Fahrzeugmarken. Auf der Website erklären wir transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Kunden achten sollten.
            </p>
            <a href="#wissen-hub" className="mt-6 inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
              Autoaufbereitung Wissen entdecken <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        <div id="wissen-hub" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {knowledgeCards.map((card, idx) => (
            <motion.a
              key={card.id}
              href={card.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative bg-gray-50/50 rounded-2xl p-6 border border-gray-100 hover:border-gray-300 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-400"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-900 flex items-center justify-center mb-5 group-hover:bg-gray-900 group-hover:text-white group-hover:border-gray-900 transition-all duration-300">
                {iconMap[card.iconName]}
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-2 leading-tight">{card.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailingExpertise;
