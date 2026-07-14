import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, CalendarClock, Clock, MapPin, Phone } from 'lucide-react';
import { RequestFormConfig, RequestFormKind } from '../types';
import RequestForm from './RequestForm';

const tabs: RequestFormConfig[] = [
  { kind: 'schaden', label: 'Schaden melden', description: 'Unfall, Hagel, Lack oder Glas', iconName: 'AlertTriangle' },
  { kind: 'termin', label: 'Aufbereitungstermin', description: 'Aufbereitung & Pflege', iconName: 'CalendarClock' },
  { kind: 'business', label: 'Geschäftskunden', description: 'Autohäuser, Fuhrparks, Agenturen', iconName: 'Building2' },
];

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle size={18} />,
  CalendarClock: <CalendarClock size={18} />,
  Building2: <Building2 size={18} />,
};

const kindFromHash = (): RequestFormKind | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.replace('#', '');
  if (hash === 'contact-schaden') return 'schaden';
  if (hash === 'contact-termin') return 'termin';
  if (hash === 'contact-business') return 'business';
  return null;
};

const ContactSection: React.FC = () => {
  const [active, setActive] = useState<RequestFormKind>('schaden');

  useEffect(() => {
    const sync = () => {
      const next = kindFromHash();
      if (next) setActive(next);
    };
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('carcare:navigate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('carcare:navigate', sync);
    };
  }, []);

  return (
    <section id="contact-form" aria-labelledby="contact-form-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Kontaktformular</span>
          <h2 id="contact-form-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            Ihre Anfrage in wenigen Schritten.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Wählen Sie das passende Anliegen - wir kümmern uns um den Rest. Für sofortige Hilfe rufen Sie uns gerne unter <span className="font-semibold text-gray-950">0341 - 261 77 90</span> an.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            {/* Scroll-Anker mit Offset via scroll-mt (kein Layout-verzerrender -mt/pt-Hack mehr) */}
            <span id="contact-schaden" className="block h-0 scroll-mt-32" aria-hidden />
            <span id="contact-termin" className="block h-0 scroll-mt-32" aria-hidden />
            <span id="contact-business" className="block h-0 scroll-mt-32" aria-hidden />
            <div className="space-y-3">
              {tabs.map((tab) => {
                const isActive = active === tab.kind;
                return (
                  <motion.button
                    key={tab.kind}
                    type="button"
                    onClick={() => {
                      setActive(tab.kind);
                      const newHash = `#contact-${tab.kind}`;
                      if (window.location.hash !== newHash) history.replaceState(null, '', newHash);
                    }}
                    whileHover={{ y: -1 }}
                    className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-5 text-left transition-all ${
                      isActive ? 'cc-gradient-button text-white' : 'border-gray-200 bg-white text-gray-950 hover:border-blue-200'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-white/15 text-white' : 'border border-gray-100 bg-gray-50 text-blue-700'}`}>
                      {iconMap[tab.iconName]}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold leading-tight">{tab.label}</div>
                      <div className={`mt-1 text-xs ${isActive ? 'text-white/75' : 'text-gray-500'}`}>{tab.description}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-8">
            <RequestForm kind={active} />
          </div>
        </div>

        {/* Kontaktinfos – volle Breite unter dem Formular (aus dem vormaligen „Kontaktabschluss" / ContactCTA) */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><MapPin size={18} /></span>
              <h3 className="text-sm font-bold text-gray-950">Adresse</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">An den Tierkliniken 42<br />04103 Leipzig</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Clock size={18} /></span>
              <h3 className="text-sm font-bold text-gray-950">Öffnungszeiten</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">Mo - Fr: 07:00 - 18:00 Uhr<br />Sa: nach Vereinbarung</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Phone size={18} /></span>
              <h3 className="text-sm font-bold text-gray-950">Telefon</h3>
            </div>
            <a href="tel:+493412617790" className="text-lg font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-700">0341 - 261 77 90</a>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">Für akute Schadenfälle ist der direkte Anruf oft der schnellste Weg.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
