import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, MapPin, Layers } from 'lucide-react';

const trustItems = [
  { icon: <Users size={20} />, label: 'Über 50 Mitarbeiter', sub: 'an 10 Standorten' },
  { icon: <Award size={20} />, label: 'Premiumhersteller', sub: 'Werksniederlassungen & Autohäuser' },
  { icon: <MapPin size={20} />, label: 'Standort Leipzig', sub: 'An den Tierkliniken 42' },
  { icon: <Layers size={20} />, label: 'Aus einer Hand', sub: 'Pflege, Lack, Schaden' },
];

const TrustBar: React.FC = () => {
  return (
    <div className="relative z-20 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {trustItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="flex items-start gap-4"
            >
              <div className="w-11 h-11 shrink-0 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-900">
                {item.icon}
              </div>
              <div>
                <p className="text-sm md:text-base font-bold text-gray-900 leading-tight">{item.label}</p>
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 uppercase tracking-widest">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
