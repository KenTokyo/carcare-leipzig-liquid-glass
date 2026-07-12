import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ExpandingCardAccordion, { ExpandingCardItem } from './ExpandingCardAccordion';

const cards: ExpandingCardItem[] = [
  { id: 'innen', title: 'Innenaufbereitung', description: 'Polster, Leder, Geruchsentfernung und gepflegte Oberflächen.', href: '/autoaufbereitung-wissen/innenaufbereitung', cta: 'Innenraum ansehen' },
  { id: 'aussen', title: 'Außenaufbereitung', description: 'Schonende Wäsche, Lackreinigung und sichtbarer Glanz.', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung', cta: 'Außenpflege ansehen' },
  { id: 'lack', title: 'Lackaufbereitung', description: 'Politur, Versiegelung und Werterhalt für gepflegte Fahrzeuge.', href: '/autoaufbereitung-wissen/lackaufbereitung', cta: 'Lackpflege ansehen' },
  { id: 'leasing', title: 'Leasingrückgabe vorbereiten', description: 'Professionelle Begutachtung vor der Rückgabe.', href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten', cta: 'Leasing vorbereiten' },
  { id: 'pakete', title: 'Wissenshub', description: 'Grundlagen, Profi-Tipps und häufige Fehler verständlich erklärt.', href: '/autoaufbereitung-wissen', cta: 'Zum Wissenshub' },
];

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
              CarCare bereitet Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung auf und erklärt transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Kunden bei Lack, Innenraum und Leasingrückgabe achten sollten.
            </p>
            <a href="/autoaufbereitung-wissen" className="mt-6 inline-flex items-center gap-2 font-bold text-gray-950 transition-colors hover:text-blue-700">
              Autoaufbereitung Wissen ansehen
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Gleiche ExpandOnHover-Karten wie die Leistungsuebersicht (skiper52/53) */}
        <div className="mt-12">
          <ExpandingCardAccordion items={cards} />
        </div>
      </div>
    </section>
  );
};

export default AutoDetailingExpertiseSection;
