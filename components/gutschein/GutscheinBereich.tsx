import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, ReceiptText, Truck } from 'lucide-react';
import { GUTSCHEIN_PAKETE } from '../../data/gutschein';
import { GUTSCHEIN_BILD, GUTSCHEIN_BILD_ALT, GUTSCHEIN_ZIEL } from './GutscheinDialog';

/**
 * Gutschein-Bereich der Startseite (OA-14): derselbe Knopf wie im Begruessungs-Pop-up, fuer alle, die es
 * weggeklickt haben. Der Link `#gutschein` oeffnet das Fenster (`GutscheinDialog.tsx`).
 */
const ABLAUF = [
  { icon: <Gift size={18} />, titel: 'Gutschein wählen', text: 'Ein Paket oder einen Wunschbetrag.' },
  { icon: <ReceiptText size={18} />, titel: 'Rechnung erhalten', text: 'Wir schicken sie an Ihre Adresse.' },
  { icon: <Truck size={18} />, titel: 'Per Post erhalten', text: 'Nach Zahlungseingang, versandkostenfrei.' },
];

const GutscheinBereich: React.FC = () => (
  <section id="gutschein" aria-labelledby="gutschein-heading" className="bg-white px-6 py-20 md:py-28">
    <div className="container mx-auto">
      <div className="cc-karte grid grid-cols-1 overflow-hidden rounded-[2rem] border border-gray-100 lg:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="p-6 md:p-10 lg:col-span-7 lg:p-14"
        >
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Gutscheinaktion</span>
          <h2 id="gutschein-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            Fahrzeugpflege als Geschenk.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Verschenken Sie eines unserer Aufbereitungspakete oder einen Geldbetrag nach Wunsch. Wir schicken den Gutschein
            per Post, auf Wunsch direkt an die beschenkte Person.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {GUTSCHEIN_PAKETE.map((p) => (
              <li key={p.id} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700">{p.label}</li>
            ))}
            <li className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-bold text-gray-700">Wunschbetrag</li>
          </ul>
          <ol className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {ABLAUF.map((s, i) => (
              <motion.li
                key={s.titel}
                initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.08 }}
                className="cc-karte-hell rounded-2xl border border-gray-100 p-4"
              >
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{s.icon}</span>
                <h3 className="text-sm font-bold text-gray-950">{s.titel}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.text}</p>
              </motion.li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href={GUTSCHEIN_ZIEL} className="cc-gradient-button group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-7 text-sm font-bold text-white sm:w-auto">
              <Gift size={16} /> Gutschein anfragen
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <Truck size={15} className="shrink-0 text-blue-600" /> Versandkostenfrei per Post
            </p>
          </div>
        </motion.div>
        <div className="relative min-h-72 lg:col-span-5 lg:min-h-full">
          <img
            src={GUTSCHEIN_BILD} alt={GUTSCHEIN_BILD_ALT}
            width={1200} height={750} loading="lazy" decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
);

export default GutscheinBereich;
