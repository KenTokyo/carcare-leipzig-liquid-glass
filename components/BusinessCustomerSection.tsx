import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Crown, Handshake, Network, UserCheck, Workflow, ArrowUpRight } from 'lucide-react';
import { BusinessBenefit } from '../types';

const benefits: BusinessBenefit[] = [
  { id: 'ansprechpartner', title: 'Feste Ansprechpartner', description: 'Persönlicher Kontakt für planbare Kommunikation.', iconName: 'UserCheck' },
  { id: 'ablaeufe', title: 'Strukturierte Abläufe', description: 'Standardisierte Prozesse für Aufbereitung und Reparatur.', iconName: 'Workflow' },
  { id: 'premium', title: 'Erfahrung mit Premiumfahrzeugen', description: 'Routine mit hochwertigen Fahrzeugen und Werksniederlassungen.', iconName: 'Crown' },
  { id: 'qualitaet', title: 'Qualitätssicherung', description: 'Dokumentierte Endabnahme und transparente Standards.', iconName: 'BadgeCheck' },
  { id: 'flexibel', title: 'Flexible Zusammenarbeit', description: 'Vom Einzelauftrag bis zur laufenden Betreuung.', iconName: 'Handshake' },
  { id: 'digital', title: 'Digitale Schadenübermittlung', description: 'Perspektivisch online für Versicherungsagenturen.', iconName: 'Network' },
];

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck size={20} />,
  Workflow: <Workflow size={20} />,
  Crown: <Crown size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  Handshake: <Handshake size={20} />,
  Network: <Network size={20} />,
};

const BusinessCustomerSection: React.FC = () => {
  return (
    <section id="geschaeftskunden" aria-labelledby="business-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Geschäftskunden</span>
            <h2 id="business-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Fahrzeugdienstleistungen für Autohäuser, Fuhrparks und Versicherungsagenturen.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              CarCare unterstützt gewerbliche Partner mit professioneller Fahrzeugaufbereitung, Reparaturlösungen, Schadenabwicklung und verlässlichen Prozessen in Leipzig.
            </p>
            <a href="/kontakt#contact-business" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              Partneranfrage stellen
              <ArrowUpRight size={16} />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.04 }}
                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6 transition-colors hover:border-blue-200 hover:bg-white"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-gray-100">
                  {iconMap[benefit.iconName]}
                </div>
                <h3 className="text-base font-bold text-gray-950">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessCustomerSection;
