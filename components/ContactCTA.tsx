import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, CalendarClock, Clock, MapPin, Phone } from 'lucide-react';

const ContactCTA: React.FC = () => {
  return (
    <section id="kontakt" aria-labelledby="contact-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-gray-50/70 p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5"
            >
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Kontaktabschluss</span>
              <h2 id="contact-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
                Schnell zur richtigen Anfrage.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
                Schaden melden, Aufbereitungstermin anfragen oder Geschäftskundenkontakt starten. CarCare Leipzig meldet sich persönlich zurück.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="/kontakt#contact-schaden" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  <AlertTriangle size={17} />
                  Schaden melden
                </a>
                <a href="/kontakt#contact-termin" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  <CalendarClock size={17} />
                  Termin anfragen
                </a>
                <a href="/kontakt#contact-business" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  <Building2 size={17} />
                  Geschäftskunden
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7"
            >
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MapPin size={18} /></span>
                  <h3 className="text-sm font-bold text-gray-950">Adresse</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">An den Tierkliniken 42<br />04103 Leipzig</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Clock size={18} /></span>
                  <h3 className="text-sm font-bold text-gray-950">Öffnungszeiten</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">Mo - Fr: 07:00 - 18:00 Uhr<br />Sa: nach Vereinbarung</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:col-span-2">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Phone size={18} /></span>
                  <h3 className="text-sm font-bold text-gray-950">Telefonische Soforthilfe</h3>
                </div>
                <a href="tel:+493412617790" className="text-2xl font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-700">0341 - 261 77 90</a>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">Für akute Schadenfälle ist der direkte Anruf oft der schnellste Weg.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
