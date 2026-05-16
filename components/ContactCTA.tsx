import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Phone, AlertTriangle, CalendarClock, Building2 } from 'lucide-react';

const ContactCTA: React.FC = () => {
  return (
    <div className="bg-gray-50 py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-gray-900" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900">CarCare Leipzig</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
              Direkt vor Ort. <span className="text-gray-400">Persönlich erreichbar.</span>
            </h2>
            <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">
              An den Tierkliniken 42, 04103 Leipzig — zentral und gut erreichbar. Wir nehmen uns Zeit für ein persönliches Gespräch und eine ehrliche Einschätzung Ihres Anliegens.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Adresse</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                An den Tierkliniken 42<br />04103 Leipzig
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Öffnungszeiten</h4>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Mo - Fr: 07.00 - 18.00 Uhr<br />Sa: nach Vereinbarung
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-900 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <h4 className="text-sm font-bold text-gray-900">Telefon</h4>
              </div>
              <a href="tel:+493412617790" className="text-sm text-gray-900 font-semibold hover:text-blue-600 transition-colors">
                0341 - 261 77 90
              </a>
            </div>
            <div className="bg-gray-900 rounded-2xl border border-gray-900 p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center">
                  <CalendarClock size={18} />
                </div>
                <h4 className="text-sm font-bold">Direkt anfragen</h4>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Nutzen Sie die Schnellauswahl im Anfrageformular.
              </p>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors"
              >
                Zum Formular
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 md:mt-14"
        >
          <a
            href="#contact-schaden"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-full text-sm font-bold hover:bg-black transition-colors"
          >
            <AlertTriangle size={16} />
            Schaden melden
          </a>
          <a
            href="#contact-termin"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-full text-sm font-bold hover:border-gray-400 transition-colors"
          >
            <CalendarClock size={16} />
            Termin anfragen
          </a>
          <a
            href="#contact-business"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-full text-sm font-bold hover:border-gray-400 transition-colors"
          >
            <Building2 size={16} />
            Geschäftskunden
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactCTA;
