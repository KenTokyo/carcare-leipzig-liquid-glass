import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQItem } from '../types';

const defaultFaqs: FAQItem[] = [
  {
    id: 'unfall',
    question: 'Kann ich bei CarCare einen Unfallschaden in Leipzig melden?',
    answer:
      'Ja. Sie können Ihren Unfallschaden online über das Formular oder telefonisch melden. CarCare unterstützt bei Schadenaufnahme, Kalkulation und Reparatur.',
  },
  {
    id: 'versicherung',
    question: 'Unterstützt CarCare bei der Abstimmung mit Versicherung oder Gutachter?',
    answer:
      'Auf Wunsch begleitet CarCare die Abstimmung mit Gutachtern und Versicherern und hält Sie während der Reparatur persönlich auf dem Laufenden.',
  },
  {
    id: 'aufbereitung',
    question: 'Kann ich einen Termin für Fahrzeugaufbereitung online anfragen?',
    answer:
      'Ja. Über das Formular „Termin anfragen“ können Sie Fahrzeug, Wunschleistung und bevorzugten Termin übermitteln.',
  },
  {
    id: 'business',
    question: 'Arbeitet CarCare auch für Autohäuser, Fuhrparks und Agenturen?',
    answer:
      'Ja. Geschäftskunden erhalten strukturierte Abläufe, feste Ansprechpartner und planbare Fahrzeugdienstleistungen.',
  },
  {
    id: 'ersatzwagen',
    question: 'Gibt es während der Reparatur Ersatzmobilität?',
    answer:
      'Ersatzmobilität wird kommuniziert und organisiert, sofern ein passendes Fahrzeug verfügbar ist und die Rahmenbedingungen stimmen.',
  },
];

interface FAQSectionProps {
  className?: string;
  description?: string;
  eyebrow?: string;
  faqs?: FAQItem[];
  id?: string;
  title?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
  className = 'bg-gray-50/70',
  description = 'Kurz beantwortet: Schadenmeldung, Aufbereitung, Geschäftskunden und Ersatzmobilität.',
  eyebrow = 'FAQ',
  faqs = defaultFaqs,
  id = 'faq',
  title = 'Häufige Fragen zu CarCare Leipzig.',
}) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const headingId = `${id}-heading`;

  useEffect(() => {
    setOpenId(faqs[0]?.id ?? null);
  }, [faqs]);

  return (
    <section id={id} aria-labelledby={headingId} className={`${className} px-6 py-20 md:py-28`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">{eyebrow}</span>
            <h2 id={headingId} className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              {title}
            </h2>
            {description && <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">{description}</p>}
          </div>

          <div className="space-y-3 lg:col-span-7">
            {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              return (
                <motion.article
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${isOpen ? 'border-blue-200' : 'border-gray-100'}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-6"
                  >
                    <span className="text-base font-bold leading-snug text-gray-950 md:text-lg">{faq.question}</span>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? 'rotate-45 bg-blue-600 text-white' : 'bg-gray-50 text-gray-950'}`}>
                      <Plus size={17} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-6 text-sm leading-relaxed text-gray-600 md:px-6 md:text-base">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
