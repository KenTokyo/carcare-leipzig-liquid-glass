import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

// Schlanker Wissens-Teaser (statt zweitem Akkordeon): verweist auf den Wissenshub.
// Die volle Tiefe liegt auf /autoaufbereitung-wissen und den dedizierten Artikeln.
const articles = [
  { title: 'Innenaufbereitung', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Außenaufbereitung', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
  { title: 'Lackaufbereitung', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Leasingrückgabe vorbereiten', href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten' },
];

const AutoDetailingExpertiseSection: React.FC = () => {
  return (
    <section id="autoaufbereitung" aria-labelledby="detailing-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Autoaufbereitung als Expertise</span>
            <h2 id="detailing-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Autoaufbereitung ist mehr als Reinigung. Es ist Werterhalt.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              CarCare bereitet Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung auf und erklärt transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Kunden bei Lack, Innenraum und Leasingrückgabe achten sollten.
            </p>
            <a href="/autoaufbereitung-wissen" className="mt-6 inline-flex items-center gap-2 font-bold text-gray-950 transition-colors hover:text-blue-700">
              Autoaufbereitung Wissen ansehen
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Schlanker Teaser: Artikel-Chips statt Akkordeon – Tiefe liegt im Wissenshub */}
        <div className="mt-10 flex flex-wrap gap-3">
          {articles.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-950 shadow-sm transition-colors hover:border-blue-200 hover:text-blue-700"
            >
              {a.title}
              <ArrowUpRight size={15} className="text-gray-400 transition-colors group-hover:text-blue-600" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AutoDetailingExpertiseSection;
