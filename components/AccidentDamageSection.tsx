import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
  Car,
  ArrowRight,
  Phone,
} from 'lucide-react';

// Bewusst auf 4 Kern-Schritte gestrafft (Schadenreise); Reparaturdetails stehen in der
// Leistungsübersicht und auf /unfallinstandsetzung-leipzig.
const points = [
  { label: 'Schadenaufnahme', icon: <FileSearch size={18} /> },
  { label: 'Gutachten & Kalkulation', icon: <ClipboardCheck size={18} /> },
  { label: 'Versicherungsabwicklung', icon: <ShieldCheck size={18} /> },
  { label: 'Ersatzwagen nach Verfügbarkeit', icon: <Car size={18} /> },
];

const AccidentDamageSection: React.FC = () => {
  return (
    <section id="unfall-schaden" aria-labelledby="accident-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 shadow-[0_30px_90px_-60px_rgb(var(--cc-trust-blue-rgb)/0.55)] md:p-10 lg:p-14">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-6"
            >
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
                <AlertTriangle size={15} />
                Unfall & Schaden Leipzig
              </div>
              <h2 id="accident-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                Unfallschaden? Wir übernehmen Reparatur, Gutachten und Abstimmung mit der Versicherung.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
                Ein Unfallschaden ist ärgerlich genug. CarCare unterstützt von der ersten Schadenaufnahme über die Kalkulation bis zur fachgerechten Reparatur. Auf Wunsch erfolgt die Abstimmung mit Gutachtern und Versicherern. Während der Reparatur kommunizieren wir Ersatzmobilität, sofern verfügbar.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="/kontakt#contact-schaden"
                  className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
                >
                  Schaden jetzt melden
                  <ArrowRight size={16} />
                </a>
                <a
                  href="tel:+493412617790"
                  className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
                >
                  <Phone size={16} />
                  Direkt anrufen
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="lg:col-span-6"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {points.map((point) => (
                  <div key={point.label} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                      {point.icon}
                    </div>
                    <p className="text-sm font-bold leading-snug text-gray-900">{point.label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-blue-100 bg-white/80 p-5 text-sm leading-relaxed text-gray-600">
                Unfallinstandsetzung, Autoreparatur und Schadenabwicklung in Leipzig – von der Schadenaufnahme bis zur Übergabe des reparierten Fahrzeugs aus einer Hand.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccidentDamageSection;
