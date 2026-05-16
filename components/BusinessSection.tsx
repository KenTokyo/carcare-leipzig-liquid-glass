import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Workflow, Crown, BadgeCheck, Handshake, Network, ArrowUpRight, Send } from 'lucide-react';
import { BusinessBenefit } from '../types';

const benefits: BusinessBenefit[] = [
  { id: 'b1', title: 'Feste Ansprechpartner', description: 'Persönlicher Kontakt für planbare Kommunikation.', iconName: 'UserCheck' },
  { id: 'b2', title: 'Strukturierte Abläufe', description: 'Standardisierte Prozesse für Aufbereitung und Reparatur.', iconName: 'Workflow' },
  { id: 'b3', title: 'Erfahrung mit Premiumfahrzeugen', description: 'Werksniederlassungen und anspruchsvolle Fuhrparks.', iconName: 'Crown' },
  { id: 'b4', title: 'Qualitätssicherung', description: 'Dokumentierte Endabnahme und transparente Standards.', iconName: 'BadgeCheck' },
  { id: 'b5', title: 'Flexible Zusammenarbeit', description: 'Vom Einzelauftrag bis zum Rahmenvertrag.', iconName: 'Handshake' },
  { id: 'b6', title: 'Digitale Schadenübermittlung', description: 'Perspektivisch online für Versicherungsagenturen.', iconName: 'Network' },
];

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck size={20} />,
  Workflow: <Workflow size={20} />,
  Crown: <Crown size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  Handshake: <Handshake size={20} />,
  Network: <Network size={20} />,
};

const BusinessSection: React.FC = () => {
  return (
    <div id="geschaeft" className="bg-white py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Geschäftskunden</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Fahrzeugdienstleistungen für Autohäuser, Fuhrparks{' '}
              <span className="text-gray-400">und Versicherungsagenturen.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-6"
          >
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed mb-6">
              CarCare unterstützt gewerbliche Partner mit professioneller Fahrzeugaufbereitung, Reparaturlösungen, Schadenabwicklung und verlässlichen Prozessen. Besonders für Autohäuser, Fuhrparks und Versicherungsagenturen ist CarCare ein zuverlässiger Ansprechpartner in Leipzig.
            </p>
            <a href="#contact-business" className="inline-flex items-center gap-2 text-gray-900 font-semibold border-b-2 border-gray-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-colors">
              Geschäftskundenbereich ansehen <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-16">
          {benefits.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="bg-gray-50/50 rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-400"
            >
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-900 flex items-center justify-center mb-4">
                {iconMap[b.iconName]}
              </div>
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">{b.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{b.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] bg-gray-900 text-white p-8 md:p-12"
        >
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-3 mb-5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                <Send size={12} />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Perspektivisch</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-4">Digitale Schadenübermittlung für Partner.</h3>
              <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
                Für Versicherungsagenturen und Geschäftspartner kann perspektivisch ein digitaler Anfrage- oder Schadenmeldebereich entstehen, über den Kundendaten und Schadeninformationen schnell an CarCare übermittelt werden.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <a href="#contact-business" className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-4 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                Partneranfrage stellen
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessSection;
