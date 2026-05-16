import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQItem } from '../types';

const faqs: FAQItem[] = [
  {
    id: 'q1',
    question: 'Kann ich bei CarCare einen Unfallschaden melden?',
    answer: 'Ja. Sie können Ihren Schaden online über das Formular „Schaden melden" oder telefonisch übermitteln. Wir nehmen den Fall auf und stimmen die nächsten Schritte mit Ihnen ab.',
  },
  {
    id: 'q2',
    question: 'Unterstützt CarCare bei der Abwicklung mit der Versicherung?',
    answer: 'Auf Wunsch übernehmen wir Schadenaufnahme, Kalkulation, Abstimmung mit Gutachtern und Versicherern sowie die komplette Reparatur. Sie haben einen festen Ansprechpartner.',
  },
  {
    id: 'q3',
    question: 'Kann ich einen Termin für Fahrzeugaufbereitung online anfragen?',
    answer: 'Ja. Über das Formular „Termin anfragen" können Sie Ihre Wunschleistung und einen Wunschtermin nennen. Wir bestätigen kurzfristig.',
  },
  {
    id: 'q4',
    question: 'Arbeitet CarCare auch für Autohäuser und Fuhrparks?',
    answer: 'Ja. Wir betreuen Werksniederlassungen deutscher Premiumhersteller, Autohäuser, Firmenfuhrparks und Versicherungsagenturen mit strukturierten Abläufen und festen Ansprechpartnern.',
  },
  {
    id: 'q5',
    question: 'Welche Jobs bietet CarCare an?',
    answer: 'Wir suchen kontinuierlich Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater. Initiativbewerbungen sind jederzeit willkommen.',
  },
];

const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <div className="bg-white py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-gray-400 mb-4">FAQ</h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Häufige Fragen zu <span className="text-gray-400">CarCare Leipzig.</span>
            </h3>
            <p className="text-gray-600 text-base font-light leading-relaxed max-w-sm">
              Antworten auf die wichtigsten Fragen rund um Schadenmeldung, Aufbereitung und Geschäftskundenservice.
            </p>
          </motion.div>

          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className={`bg-gray-50/50 rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-gray-300 shadow-md' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                  >
                    <span className="text-base md:text-lg font-semibold text-gray-900 leading-snug">{faq.question}</span>
                    <span className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-900 text-white rotate-45' : 'bg-white border border-gray-200 text-gray-900'}`}>
                      <Plus size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 md:px-6 pb-6 text-sm md:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
