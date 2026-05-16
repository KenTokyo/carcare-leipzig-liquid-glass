import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock, Building2 } from 'lucide-react';
import { RequestFormKind, RequestFormConfig } from '../types';
import RequestForm from './RequestForm';

const tabs: RequestFormConfig[] = [
  { kind: 'schaden', label: 'Schaden melden', description: 'Unfall, Hagel, Lack oder Glas', iconName: 'AlertTriangle' },
  { kind: 'termin', label: 'Termin anfragen', description: 'Aufbereitung & Pflege', iconName: 'CalendarClock' },
  { kind: 'business', label: 'Geschäftskunden', description: 'Autohäuser, Fuhrparks, Agenturen', iconName: 'Building2' },
];

const iconMap: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle size={18} />,
  CalendarClock: <CalendarClock size={18} />,
  Building2: <Building2 size={18} />,
};

const kindFromHash = (): RequestFormKind | null => {
  if (typeof window === 'undefined') return null;
  const h = window.location.hash.replace('#', '');
  if (h === 'contact-schaden') return 'schaden';
  if (h === 'contact-termin') return 'termin';
  if (h === 'contact-business') return 'business';
  return null;
};

const ContactSection: React.FC = () => {
  const [active, setActive] = useState<RequestFormKind>('schaden');

  useEffect(() => {
    const sync = () => {
      const k = kindFromHash();
      if (k) setActive(k);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return (
    <div id="contact-form" className="bg-white py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-gray-900" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900">Kontakt</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-5">
            Ihre Anfrage in wenigen Schritten. <span className="text-gray-400">Persönlich. Verbindlich. Schnell.</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg font-light leading-relaxed">
            Wählen Sie das passende Anliegen — wir kümmern uns um den Rest. Für sofortige Hilfe rufen Sie uns gerne unter <span className="font-semibold text-gray-900">0341 - 261 77 90</span> an.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-4 space-y-3">
            <span id="contact-schaden" className="block -mt-32 pt-32 invisible h-0" aria-hidden />
            <span id="contact-termin" className="block -mt-32 pt-32 invisible h-0" aria-hidden />
            <span id="contact-business" className="block -mt-32 pt-32 invisible h-0" aria-hidden />
            {tabs.map((t) => {
              const isActive = active === t.kind;
              return (
                <motion.button
                  key={t.kind}
                  type="button"
                  onClick={() => {
                    setActive(t.kind);
                    if (typeof window !== 'undefined') {
                      const newHash = `#contact-${t.kind}`;
                      if (window.location.hash !== newHash) {
                        history.replaceState(null, '', newHash);
                      }
                    }
                  }}
                  whileHover={{ y: -1 }}
                  className={`w-full text-left rounded-2xl px-5 py-5 border transition-all flex items-center gap-4 ${
                    isActive
                      ? 'bg-gray-900 text-white border-gray-900 shadow-xl shadow-gray-900/10'
                      : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900 border border-gray-100'
                    }`}
                  >
                    {iconMap[t.iconName]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold leading-tight">{t.label}</div>
                    <div className={`text-xs mt-1 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>{t.description}</div>
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
    </div>
  );
};

export default ContactSection;
