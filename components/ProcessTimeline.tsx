import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { TimelineTab } from '../types';

const tabs: TimelineTab[] = [
  {
    id: 'unfall',
    label: 'Unfallschaden',
    iconName: 'AlertTriangle',
    intro: 'So strukturiert läuft Ihr Schadenfall – von der ersten Meldung bis zur Fahrzeugübergabe.',
    steps: [
      { step: 1, title: 'Schaden melden', description: 'Online oder telefonisch – wir nehmen die wichtigsten Daten und Bilder Ihres Schadens auf.' },
      { step: 2, title: 'Schaden prüfen lassen', description: 'Wir besichtigen das Fahrzeug und erfassen den Schadenumfang exakt.' },
      { step: 3, title: 'Kalkulation und Abstimmung', description: 'Wir erstellen die Kalkulation und stimmen sie mit Versicherung oder Gutachter ab.' },
      { step: 4, title: 'Reparatur und Lackierung', description: 'Karosseriearbeiten und Reparaturlackierung werden fachgerecht durchgeführt.' },
      { step: 5, title: 'Fahrzeug abholen', description: 'Sauberes, dokumentiert repariertes Fahrzeug zurück in den Alltag.' },
    ],
  },
  {
    id: 'aufbereitung',
    label: 'Autoaufbereitung',
    iconName: 'Sparkles',
    intro: 'Vom ersten Klick bis zur strahlenden Übergabe – klare Schritte für Ihre Aufbereitung.',
    steps: [
      { step: 1, title: 'Leistung auswählen', description: 'Brillant, Intensiv, Premium oder Premium exklusiv – passend für Ihr Fahrzeug.' },
      { step: 2, title: 'Termin anfragen', description: 'Wunschtermin online angeben – wir bestätigen kurzfristig.' },
      { step: 3, title: 'Fahrzeug abgeben', description: 'Übergabe im CarCare-Center, persönliche Beratung vor Ort.' },
      { step: 4, title: 'Professionelle Aufbereitung', description: 'Detailing nach Premium-Standards mit ausgesuchten Produkten.' },
      { step: 5, title: 'Gepflegt zurückerhalten', description: 'Hochwertig aufbereitetes Fahrzeug, mit Sorgfalt und Liebe zum Detail.' },
    ],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle size={16} />,
  Sparkles: <Sparkles size={16} />,
};

const ProcessTimeline: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(tabs[0].id);
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="bg-gray-50/50 py-24 md:py-32 px-6 border-y border-gray-100">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 mb-4">Prozess</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              So einfach läuft <span className="text-gray-400">Ihre Anfrage bei CarCare.</span>
            </h3>
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-gray-100 rounded-full mb-12 md:mb-16 w-fit shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`px-5 md:px-7 py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2 ${
                activeId === tab.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {iconMap[tab.iconName]}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed max-w-2xl mb-12">{active.intro}</p>
            <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
              <div className="hidden md:block absolute top-7 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent pointer-events-none" />
              {active.steps.map((step, idx) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative flex md:flex-col gap-4 md:gap-0"
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-gray-900/20">
                      {step.step}
                    </div>
                    {idx < active.steps.length - 1 && (
                      <div className="md:hidden absolute left-7 top-14 w-[1px] h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="md:mt-6">
                    <h4 className="text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight">{step.title}</h4>
                    <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap gap-3">
              <a href={active.id === 'unfall' ? '#contact-schaden' : '#contact-termin'} className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-bold hover:bg-black transition-colors">
                {active.id === 'unfall' ? 'Schaden jetzt melden' : 'Termin anfragen'}
                <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessTimeline;
