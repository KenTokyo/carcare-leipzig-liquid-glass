import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, CalendarClock } from 'lucide-react';
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
          <div className="space-y-3 lg:col-span-4">
            <span id="contact-schaden" className="invisible block h-0 -mt-32 pt-32" aria-hidden />
            <span id="contact-termin" className="invisible block h-0 -mt-32 pt-32" aria-hidden />
            <span id="contact-business" className="invisible block h-0 -mt-32 pt-32" aria-hidden />
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

          <div className="lg:col-span-8">
            <RequestForm kind={active} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
