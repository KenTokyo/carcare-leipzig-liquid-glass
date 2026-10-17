import React from 'react';
import { FAQItem } from '../types';
import { faqsByRoute } from '../data/faqs';
import FaqListe from './FaqListe';


interface FAQSectionProps {
  className?: string;
  description?: string;
  eyebrow?: string;
  faqs?: FAQItem[];
  id?: string;
  title?: string;
}

/**
 * Grund WEISS seit 2026-10-16 (User: „einen anderen Farbton hinter FAQ, als ich es insgesamt auf der ganzen Website
 * habe … Ich möchte, dass es durchgehend einen Farbton hat“). Bis dahin Eisblau (`bg-gray-50/70`); die Startseite ist
 * der einzige Aufrufer ohne eigene Klasse, die Artikelseiten setzen schon `bg-white`. Die Fragekarten behalten ihren
 * Kartenton (`.cc-karte`) und den Rand, sie heben sich auf Weiss wie in den uebrigen weissen Sektionen ab.
 *
 * Die Fragen selbst stehen seit 2026-10-17 in `FaqListe`, derselben Liste wie auf den Unterseiten (`PageFAQ`). Dort auch,
 * warum die Antwort immer im DOM bleibt und warum jede Frage fuer sich aufgeht (das Ruckeln auf der Startseite).
 */
const FAQSection: React.FC<FAQSectionProps> = ({
  className = 'bg-white',
  description = 'Kurz beantwortet: Schadenmeldung, Aufbereitung, Geschäftskunden und Ersatzwagen.',
  eyebrow = 'FAQ',
  faqs = faqsByRoute['/'],
  id = 'faq',
  title = 'Häufige Fragen zum CarCare Center Leipzig.',
}) => {
  const headingId = `${id}-heading`;

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

          <div className="lg:col-span-7">
            <FaqListe faqs={faqs} idPraefix={id} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
