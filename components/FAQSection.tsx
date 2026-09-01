import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQItem } from '../types';
import { faqsByRoute } from '../data/faqs';


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
  faqs = faqsByRoute['/'],
  id = 'faq',
  title = 'Häufige Fragen zum CarCare Center Leipzig.',
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
              const triggerId = `${id}-trigger-${faq.id}`;
              const panelId = `${id}-panel-${faq.id}`;
              return (
                <motion.article
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  className={`overflow-hidden rounded-2xl border bg-white transition-colors ${isOpen ? 'border-blue-200' : 'border-gray-100'}`}
                >
                  {/*
                    Die Frage sitzt in einer echten Ueberschrift, damit sie per
                    Ueberschriften-Navigation erreichbar ist (ARIA-APG-Muster fuer
                    Akkordeons). h3 passt unter die h2 der Sektion und ist identisch
                    zur offenen Liste in `PageFAQ`.
                  */}
                  <h3>
                    <button
                      type="button"
                      id={triggerId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left md:p-6"
                    >
                      <span className="text-base font-bold leading-snug text-gray-950 md:text-lg">{faq.question}</span>
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? 'rotate-45 bg-blue-600 text-white' : 'bg-gray-50 text-gray-950'}`}>
                        <Plus size={17} />
                      </span>
                    </button>
                  </h3>
                  {/*
                    ⚠️ DAS PANEL BLEIBT IMMER GEMOUNTET. Bis 2026-09-01 stand hier
                    `{isOpen && …}` in einer AnimatePresence — geschlossene Antworten
                    waren dadurch NICHT im DOM. Im ausgelieferten statischen HTML
                    fehlten 14 Antworten, die im FAQPage-Markup derselben Seite
                    ausgezeichnet sind (Startseite 4 von 5, je 2 auf fuenf
                    Artikelseiten). Google erlaubt FAQ-Inhalte hinter Aufklapp-
                    Elementen, verlangt aber, dass sie im initialen HTML stehen;
                    SEO-GEO §2.1 ebenso, weil viele KI-Crawler kein JS rendern.
                    Animiert wird deshalb nur die HOEHE eines dauerhaft
                    gemounteten Panels — nie wieder das Ein- und Aushaengen.
                    scripts/check-faq-html.mjs prueft das nach jedem Build.

                    Geschlossen ist das Panel `inert`: kein Tastaturfokus, nicht im
                    Accessibility-Tree, nicht selektierbar. Dadurch traegt auch nur
                    das GEOEFFNETE Panel seine `role="region"` bei — die von der
                    ARIA-APG gewarnte Landmark-Flut bei vielen Panels entsteht nicht.
                  */}
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.24 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-6 text-sm leading-relaxed text-gray-600 md:px-6 md:text-base">{faq.answer}</p>
                  </motion.div>
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
