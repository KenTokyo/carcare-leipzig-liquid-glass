import React from 'react';
import { motion } from 'framer-motion';
import { Handshake, Building2, BadgeCheck, ShieldCheck } from 'lucide-react';
import { ReferencePoint } from '../types';

const references: ReferencePoint[] = [
  { id: 'r1', title: 'Autohäuser & Premiumhersteller', description: 'Zusammenarbeit mit Werksniederlassungen deutscher Premiummarken.', iconName: 'Building2' },
  { id: 'r2', title: 'Große Fuhrparks', description: 'Erfahrung mit Firmenfuhrparks und gewerblichen Flotten.', iconName: 'Handshake' },
  { id: 'r3', title: 'Professionelle Standards', description: 'Strukturierte Abläufe und dokumentierte Endabnahme.', iconName: 'BadgeCheck' },
  { id: 'r4', title: 'Qualitätssicherung', description: 'Geprüfte Verfahren und langjährig geschulte Mitarbeiter.', iconName: 'ShieldCheck' },
];

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 size={20} />,
  Handshake: <Handshake size={20} />,
  BadgeCheck: <BadgeCheck size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
};

const References: React.FC = () => {
  return (
    <div className="bg-gray-50/50 py-24 md:py-32 px-6 border-y border-gray-100">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 mb-4">Referenzen</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Vertrauen <span className="text-gray-400 font-light">durch Erfahrung.</span>
            </h3>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {references.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="bg-white rounded-2xl p-6 md:p-7 border border-gray-100 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-400"
            >
              <div className="w-11 h-11 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center mb-4 border border-gray-100">
                {iconMap[r.iconName]}
              </div>
              <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">{r.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default References;
