import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { TimelineTab } from '../types';

const tabs: TimelineTab[] = [
  {
    id: 'unfall',
    label: 'Unfallschaden',
    iconName: 'AlertTriangle',
    intro: 'So läuft ein Schadenfall bei CarCare strukturiert ab.',
    steps: [
      { step: 1, title: 'Schaden melden', description: 'Online oder telefonisch mit ersten Daten und Bildern.' },
      { step: 2, title: 'Schaden prüfen lassen', description: 'Wir besichtigen das Fahrzeug und erfassen den Umfang.' },
      { step: 3, title: 'Kalkulation & Abstimmung', description: 'Kostenermittlung und Abstimmung mit Gutachter oder Versicherung.' },
      { step: 4, title: 'Reparatur & Lackierung', description: 'Karosseriearbeiten und Reparaturlackierung durch das Team.' },
      { step: 5, title: 'Fahrzeug abholen', description: 'Sauber repariert, dokumentiert und bereit für den Alltag.' },
    ],
  },
  {
    id: 'aufbereitung',
    label: 'Autoaufbereitung',
    iconName: 'Sparkles',
    intro: 'Vom ersten Terminwunsch bis zur gepflegten Übergabe.',
    steps: [
      { step: 1, title: 'Leistung auswählen', description: 'Passendes Paket oder individuelle Aufbereitung wählen.' },
      { step: 2, title: 'Termin anfragen', description: 'Wunschtermin online oder telefonisch übermitteln.' },
      { step: 3, title: 'Fahrzeug abgeben', description: 'Persönliche Übergabe mit kurzer Beratung vor Ort.' },
      { step: 4, title: 'Professionelle Aufbereitung', description: 'Innen, außen, Lack und Details nach CarCare-Standard.' },
      { step: 5, title: 'Gepflegt zurückerhalten', description: 'Sichtbar aufgewertet und bereit für Alltag oder Rückgabe.' },
    ],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle size={16} />,
  Sparkles: <Sparkles size={16} />,
};

const ProcessTimeline: React.FC = () => {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <section id="prozess" aria-labelledby="process-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-10 max-w-3xl md:mb-14">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Prozess</span>
          <h2 id="process-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            So einfach läuft Ihre Anfrage bei CarCare.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Zwei typische Wege, ein Prinzip: klare Schritte, persönliche Betreuung und transparente Kommunikation.
          </p>
        </div>

        <div className="mb-10 flex w-fit flex-wrap gap-2 rounded-full border border-gray-100 bg-gray-50 p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors md:px-6 ${
                activeId === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-950'
              }`}
            >
              {iconMap[tab.iconName]}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600">{active.intro}</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {active.steps.map((step, idx) => (
                <motion.article
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className="relative rounded-2xl border border-gray-100 bg-gray-50/70 p-5"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-blue-700 shadow-sm ring-1 ring-gray-100">
                    {step.step}
                  </div>
                  <h3 className="text-base font-bold leading-tight text-gray-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </motion.article>
              ))}
            </div>
            <a
              href={active.id === 'unfall' ? '#contact-schaden' : '#contact-termin'}
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-gray-950 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
              {active.id === 'unfall' ? 'Schaden melden' : 'Termin anfragen'}
              <ArrowRight size={16} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProcessTimeline;
