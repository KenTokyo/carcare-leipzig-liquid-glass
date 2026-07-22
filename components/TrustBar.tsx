import React from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, PaintBucket, Users } from 'lucide-react';

/**
 * Vertrauensmerkmale — 2026-07-22 auf ausschliesslich HARTE Fakten umgestellt (§4.3:
 * konkrete Fakten statt Marketing-Floskeln, §4.2 E-E-A-T).
 *
 * Rein: „Meisterbetrieb" und „Glasurit-Lackpartner" — die staerksten Vertrauenssignale der
 * Seite. Sie standen zuvor als gequetschte Pille ueber der H1 im Hero, waehrend ausgerechnet
 * der Trust-Streifen sie nicht fuehrte.
 * Raus: „Premium-Erfahrung" (Werbeadjektiv ohne Substanz; die Zielgruppen deckt die eigene
 * Sektion „Fuer wen wir arbeiten" ab) und „Alles aus einer Hand" (wiederholte die Hero-Subline
 * und die Leistungsuebersicht).
 */
const trustItems = [
  { icon: <Award size={20} />, label: 'Meisterbetrieb', sub: 'Kfz-Lackierhandwerk, seit 1993' },
  { icon: <PaintBucket size={20} />, label: 'Glasurit-Lackpartner', sub: 'farbtongenaue Reparaturlackierung' },
  { icon: <Users size={20} />, label: 'Über 50 Mitarbeiter', sub: 'eingespielte Teams und klare Abläufe' },
  { icon: <MapPin size={20} />, label: 'Standort Leipzig', sub: 'An den Tierkliniken 42' },
];

const TrustBar: React.FC = () => {
  return (
    <section id="trust" aria-label="CarCare Vertrauensmerkmale" className="bg-white px-6 py-8 md:py-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-3 rounded-[1.5rem] border border-gray-100 bg-gray-50/70 p-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                {item.icon}
              </div>
              <div>
                <p className="font-bold leading-tight text-gray-950">{item.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-gray-500">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
