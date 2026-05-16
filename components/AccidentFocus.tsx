import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ShieldCheck, FileSearch, ClipboardCheck, Hammer, PaintBucket, Car, Check, ArrowUpRight } from 'lucide-react';

const bullets = [
  { icon: <FileSearch size={16} />, text: 'Schadenaufnahme' },
  { icon: <ClipboardCheck size={16} />, text: 'Kalkulation' },
  { icon: <ShieldCheck size={16} />, text: 'Gutachterservice' },
  { icon: <ShieldCheck size={16} />, text: 'Versicherungsabwicklung' },
  { icon: <Hammer size={16} />, text: 'Karosseriearbeiten' },
  { icon: <PaintBucket size={16} />, text: 'Reparaturlackierung' },
  { icon: <Car size={16} />, text: 'Ersatzwagen nach Verfügbarkeit' },
];

const AccidentFocus: React.FC = () => {
  return (
    <div className="relative bg-gray-900 text-white py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-32 w-[420px] h-[420px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              <AlertTriangle size={14} className="text-red-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white">Schwerpunkt Unfall &amp; Schaden</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-8">
              Unfallschaden? Wir übernehmen{' '}
              <span className="text-gray-400">Reparatur, Gutachten und Abstimmung mit der Versicherung.</span>
            </h2>
            <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed max-w-xl mb-10">
              Ein Unfallschaden ist ärgerlich genug. CarCare unterstützt Sie von der ersten Schadenaufnahme über die Kalkulation bis zur fachgerechten Reparatur. Auf Wunsch stimmen wir uns mit Gutachtern und Versicherern ab und sorgen dafür, dass Sie während der Reparatur mobil bleiben.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#contact-schaden" className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-4 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                <AlertTriangle size={16} />
                Schaden jetzt melden
              </a>
              <a href="#unfall-details" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-7 py-4 rounded-full text-sm font-medium hover:bg-white/20 transition-colors">
                Mehr zur Unfallinstandsetzung
                <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div
            id="unfall-details"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-6"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-6">Unsere Leistungen im Schadenfall</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bullets.map((b) => (
                  <li key={b.text} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="w-9 h-9 rounded-lg bg-white text-gray-900 flex items-center justify-center shrink-0">
                      <Check size={16} />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span className="text-gray-400">{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AccidentFocus;
