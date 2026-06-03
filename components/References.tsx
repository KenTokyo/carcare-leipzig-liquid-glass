import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Building2, Handshake, ShieldCheck } from 'lucide-react';
import { ReferencePoint } from '../types';

const references: ReferencePoint[] = [
  { id: 'premium', title: 'Autohäuser & Premiumhersteller', description: 'Erfahrung mit hochwertigen Fahrzeugen und professionellen Partnern.', iconName: 'Building2' },
  { id: 'fuhrparks', title: 'Große Fuhrparks', description: 'Planbare Abläufe für Firmenfuhrparks und gewerbliche Flotten.', iconName: 'Handshake' },
  { id: 'standards', title: 'Professionelle Standards', description: 'Dokumentierte Prozesse von der Annahme bis zur Übergabe.', iconName: 'BadgeCheck' },
  { id: 'qualitaet', title: 'Qualitätssicherung', description: 'Geschulte Mitarbeiter, geprüfte Verfahren und klare Endabnahme.', iconName: 'ShieldCheck' },
];

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 size={21} />,
  Handshake: <Handshake size={21} />,
  BadgeCheck: <BadgeCheck size={21} />,
  ShieldCheck: <ShieldCheck size={21} />,
};

const References: React.FC = () => {
  return (
    <section id="vertrauen" aria-labelledby="trust-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Vertrauen / Erfahrung</span>
          <h2 id="trust-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            Qualität entsteht durch Erfahrung, klare Prozesse und saubere Arbeit.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {references.map((reference, idx) => (
            <motion.article
              key={reference.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm ring-1 ring-gray-100">
                {iconMap[reference.iconName]}
              </div>
              <h3 className="text-lg font-bold leading-tight text-gray-950">{reference.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{reference.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default References;
