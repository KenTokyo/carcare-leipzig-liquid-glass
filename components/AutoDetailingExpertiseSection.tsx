import React from 'react';
import { motion } from 'framer-motion';
import { Armchair, SprayCan, Droplets, KeyRound, Package, ArrowUpRight } from 'lucide-react';
import { KnowledgeCard } from '../types';

const cards: KnowledgeCard[] = [
  { id: 'innen', title: 'Innenaufbereitung', description: 'Polster, Leder, Geruchsentfernung und gepflegte Oberflächen.', iconName: 'Armchair', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { id: 'aussen', title: 'Außenaufbereitung', description: 'Schonende Wäsche, Lackreinigung und sichtbarer Glanz.', iconName: 'SprayCan', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
  { id: 'lack', title: 'Lackaufbereitung', description: 'Politur, Versiegelung und Werterhalt für gepflegte Fahrzeuge.', iconName: 'Droplets', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { id: 'leasing', title: 'Leasingrückgabe vorbereiten', description: 'Professionelle Begutachtung vor der Rückgabe.', iconName: 'KeyRound', href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten' },
  { id: 'pakete', title: 'Wissenshub', description: 'Grundlagen, Profi-Tipps und häufige Fehler verständlich erklärt.', iconName: 'Package', href: '/autoaufbereitung-wissen' },
];

const iconMap: Record<string, React.ReactNode> = {
  Armchair: <Armchair size={22} />,
  SprayCan: <SprayCan size={22} />,
  Droplets: <Droplets size={22} />,
  KeyRound: <KeyRound size={22} />,
  Package: <Package size={22} />,
};

const AutoDetailingExpertiseSection: React.FC = () => {
  return (
    <section id="autoaufbereitung" aria-labelledby="detailing-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Autoaufbereitung als Expertise</span>
            <h2 id="detailing-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Autoaufbereitung ist mehr als Reinigung. Es ist Werterhalt.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              CarCare erklärt transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Kunden bei Lack, Innenraum und Leasingrückgabe achten sollten.
            </p>
            <a href="/autoaufbereitung-wissen" className="mt-6 inline-flex items-center gap-2 font-bold text-gray-950 transition-colors hover:text-blue-700">
              Autoaufbereitung Wissen ansehen
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card, idx) => (
            <motion.a
              key={card.id}
              href={card.href}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                {iconMap[card.iconName]}
              </div>
              <h3 className="text-lg font-bold leading-tight text-gray-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{card.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AutoDetailingExpertiseSection;
