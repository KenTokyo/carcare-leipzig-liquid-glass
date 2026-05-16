import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertTriangle, CalendarClock, Building2 } from 'lucide-react';
import { RequestFormKind } from '../types';

interface RequestFormProps {
  kind: RequestFormKind;
}

interface FormFieldsByKind {
  schaden: {
    name: string;
    email: string;
    phone: string;
    plate: string;
    vehicle: string;
    incident: string;
    insurance: string;
    description: string;
  };
  termin: {
    name: string;
    email: string;
    phone: string;
    vehicle: string;
    service: string;
    preferredDate: string;
    description: string;
  };
  business: {
    company: string;
    contact: string;
    email: string;
    phone: string;
    partnerType: string;
    description: string;
  };
}

const initialState: FormFieldsByKind = {
  schaden: { name: '', email: '', phone: '', plate: '', vehicle: '', incident: '', insurance: '', description: '' },
  termin: { name: '', email: '', phone: '', vehicle: '', service: '', preferredDate: '', description: '' },
  business: { company: '', contact: '', email: '', phone: '', partnerType: '', description: '' },
};

const headlineByKind: Record<RequestFormKind, { icon: React.ReactNode; eyebrow: string; title: string; subtitle: string }> = {
  schaden: {
    icon: <AlertTriangle size={14} />,
    eyebrow: 'Schaden melden',
    title: 'Unfall- oder Hagelschaden direkt melden.',
    subtitle: 'Wir nehmen Ihre Daten auf und melden uns unverzüglich für die Schadenabwicklung.',
  },
  termin: {
    icon: <CalendarClock size={14} />,
    eyebrow: 'Termin anfragen',
    title: 'Termin für Aufbereitung oder Pflege.',
    subtitle: 'Beschreiben Sie Ihren Wunsch — wir bestätigen einen passenden Termin in Leipzig.',
  },
  business: {
    icon: <Building2 size={14} />,
    eyebrow: 'Geschäftskunden',
    title: 'Partneranfrage für Autohäuser, Fuhrparks & Versicherungen.',
    subtitle: 'Rahmenvertrag, digitale Schadenübermittlung oder Einzelaufträge — sprechen Sie uns an.',
  },
};

const RequestForm: React.FC<RequestFormProps> = ({ kind }) => {
  const [values, setValues] = useState(initialState[kind]);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setValues(initialState[kind] as never);
    setSubmitted(false);
  }, [kind]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value } as never));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const head = headlineByKind[kind];

  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 transition-all';
  const labelClass = 'block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-2';

  return (
    <motion.div
      key={kind}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-gray-50/60 rounded-3xl p-6 md:p-10 border border-gray-100"
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 mb-4">
          <span className="text-gray-900">{head.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">{head.eyebrow}</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">{head.title}</h3>
        <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed">{head.subtitle}</p>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-200 rounded-2xl p-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-900 text-white mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Anfrage übermittelt.</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            Vielen Dank — wir melden uns zeitnah bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter
            <span className="font-semibold text-gray-900"> 0341 - 261 77 90</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {kind === 'schaden' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="schaden-name">Name</label>
                  <input id="schaden-name" name="name" required value={(values as FormFieldsByKind['schaden']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-phone">Telefon</label>
                  <input id="schaden-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['schaden']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - 261 77 90" />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-email">E-Mail</label>
                <input id="schaden-email" name="email" required type="email" value={(values as FormFieldsByKind['schaden']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="schaden-plate">Kennzeichen</label>
                  <input id="schaden-plate" name="plate" value={(values as FormFieldsByKind['schaden']).plate} onChange={handleChange} className={inputClass} placeholder="L-AB 1234" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-vehicle">Fahrzeug</label>
                  <input id="schaden-vehicle" name="vehicle" value={(values as FormFieldsByKind['schaden']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="schaden-incident">Schadentyp</label>
                  <select id="schaden-incident" name="incident" value={(values as FormFieldsByKind['schaden']).incident} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="unfall">Unfallschaden</option>
                    <option value="hagel">Hagelschaden</option>
                    <option value="lack">Lackschaden</option>
                    <option value="glas">Glasschaden</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-insurance">Versicherung</label>
                  <input id="schaden-insurance" name="insurance" value={(values as FormFieldsByKind['schaden']).insurance} onChange={handleChange} className={inputClass} placeholder="z. B. Allianz" />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-description">Schaden beschreiben</label>
                <textarea id="schaden-description" name="description" required rows={4} value={(values as FormFieldsByKind['schaden']).description} onChange={handleChange} className={inputClass} placeholder="Hergang, Datum, Umfang ..." />
              </div>
            </>
          )}

          {kind === 'termin' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="termin-name">Name</label>
                  <input id="termin-name" name="name" required value={(values as FormFieldsByKind['termin']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-phone">Telefon</label>
                  <input id="termin-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['termin']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="termin-email">E-Mail</label>
                <input id="termin-email" name="email" required type="email" value={(values as FormFieldsByKind['termin']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="termin-vehicle">Fahrzeug</label>
                  <input id="termin-vehicle" name="vehicle" value={(values as FormFieldsByKind['termin']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-service">Leistung</label>
                  <select id="termin-service" name="service" value={(values as FormFieldsByKind['termin']).service} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="innen">Innenaufbereitung</option>
                    <option value="aussen">Außenaufbereitung</option>
                    <option value="komplett">Komplettaufbereitung</option>
                    <option value="lack">Lackpflege / Politur</option>
                    <option value="leasing">Leasingrückgabe</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="termin-date">Wunschtermin</label>
                <input id="termin-date" name="preferredDate" type="date" value={(values as FormFieldsByKind['termin']).preferredDate} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="termin-description">Anmerkungen</label>
                <textarea id="termin-description" name="description" rows={4} value={(values as FormFieldsByKind['termin']).description} onChange={handleChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand ..." />
              </div>
            </>
          )}

          {kind === 'business' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="business-company">Unternehmen</label>
                  <input id="business-company" name="company" required value={(values as FormFieldsByKind['business']).company} onChange={handleChange} className={inputClass} placeholder="Autohaus / Fuhrpark / Agentur" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-contact">Ansprechpartner</label>
                  <input id="business-contact" name="contact" required value={(values as FormFieldsByKind['business']).contact} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="business-email">E-Mail</label>
                  <input id="business-email" name="email" required type="email" value={(values as FormFieldsByKind['business']).email} onChange={handleChange} className={inputClass} placeholder="kontakt@firma.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-phone">Telefon</label>
                  <input id="business-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['business']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-partner">Partnertyp</label>
                <select id="business-partner" name="partnerType" value={(values as FormFieldsByKind['business']).partnerType} onChange={handleChange} className={inputClass}>
                  <option value="">Bitte wählen</option>
                  <option value="autohaus">Autohaus / Werksniederlassung</option>
                  <option value="fuhrpark">Fuhrpark</option>
                  <option value="versicherung">Versicherungsagentur</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-description">Anfrage</label>
                <textarea id="business-description" name="description" required rows={4} value={(values as FormFieldsByKind['business']).description} onChange={handleChange} className={inputClass} placeholder="Umfang, Frequenz, Sonderwünsche ..." />
              </div>
            </>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-7 py-4 rounded-full text-sm font-bold hover:bg-black transition-colors w-full sm:w-auto justify-center"
            >
              <Send size={14} />
              Anfrage absenden
            </button>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß Datenschutzerklärung zu.
            </p>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default RequestForm;
