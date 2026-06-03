import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, CalendarClock, CheckCircle2, Send } from 'lucide-react';
import { RequestFormKind } from '../types';

interface RequestFormProps {
  kind: RequestFormKind;
}

interface FormFieldsByKind {
  schaden: {
    name: string;
    phone: string;
    email: string;
    vehicle: string;
    incident: string;
    insuranceAvailable: string;
    description: string;
  };
  termin: {
    name: string;
    phone: string;
    email: string;
    vehicle: string;
    service: string;
    preferredDate: string;
    description: string;
  };
  business: {
    company: string;
    contact: string;
    phone: string;
    email: string;
    partnerType: string;
    description: string;
  };
}

const initialState: FormFieldsByKind = {
  schaden: { name: '', phone: '', email: '', vehicle: '', incident: '', insuranceAvailable: '', description: '' },
  termin: { name: '', phone: '', email: '', vehicle: '', service: '', preferredDate: '', description: '' },
  business: { company: '', contact: '', phone: '', email: '', partnerType: '', description: '' },
};

const headlineByKind: Record<RequestFormKind, { icon: React.ReactNode; eyebrow: string; title: string; subtitle: string }> = {
  schaden: {
    icon: <AlertTriangle size={14} />,
    eyebrow: 'Schaden melden',
    title: 'Unfall- oder Hagelschaden direkt melden.',
    subtitle: 'Name, Fahrzeug, Schadenart, Versicherung und Bilder helfen uns bei der schnellen Ersteinschätzung.',
  },
  termin: {
    icon: <CalendarClock size={14} />,
    eyebrow: 'Aufbereitungstermin',
    title: 'Aufbereitungstermin anfragen.',
    subtitle: 'Nennen Sie Fahrzeug, gewünschte Leistung und Wunschtermin. Wir melden uns persönlich zurück.',
  },
  business: {
    icon: <Building2 size={14} />,
    eyebrow: 'Geschäftskunden',
    title: 'Geschäftskundenanfrage stellen.',
    subtitle: 'Für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen mit strukturierten Abläufen.',
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
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all';
  const labelClass = 'block text-xs font-bold uppercase tracking-[0.15em] text-gray-500 mb-2';

  return (
    <motion.div
      key={kind}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-100 bg-gray-50/70 p-6 md:p-10"
    >
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
          <span className="text-blue-700">{head.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">{head.eyebrow}</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">{head.title}</h3>
        <p className="text-sm leading-relaxed text-gray-500 md:text-base">{head.subtitle}</p>
      </div>

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="mb-2 text-lg font-bold text-gray-950">Anfrage übermittelt.</h4>
          <p className="text-sm leading-relaxed text-gray-500">
            Vielen Dank - wir melden uns zeitnah bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter
            <span className="font-semibold text-gray-950"> 0341 - 261 77 90</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {kind === 'schaden' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-name">Name</label>
                  <input id="schaden-name" name="name" required value={(values as FormFieldsByKind['schaden']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-phone">Telefon</label>
                  <input id="schaden-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['schaden']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-email">E-Mail</label>
                  <input id="schaden-email" name="email" required type="email" value={(values as FormFieldsByKind['schaden']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-vehicle">Fahrzeug</label>
                  <input id="schaden-vehicle" name="vehicle" value={(values as FormFieldsByKind['schaden']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-incident">Schadenart</label>
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
                  <label className={labelClass} htmlFor="schaden-insurance">Versicherung vorhanden?</label>
                  <select id="schaden-insurance" name="insuranceAvailable" value={(values as FormFieldsByKind['schaden']).insuranceAvailable} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="ja">Ja</option>
                    <option value="nein">Nein</option>
                    <option value="unklar">Noch unklar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-images">Bilderupload</label>
                <input id="schaden-images" name="images" type="file" multiple accept="image/*" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-description">Nachricht</label>
                <textarea id="schaden-description" name="description" required rows={4} value={(values as FormFieldsByKind['schaden']).description} onChange={handleChange} className={inputClass} placeholder="Hergang, Datum, Umfang ..." />
              </div>
            </>
          )}

          {kind === 'termin' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-name">Name</label>
                  <input id="termin-name" name="name" required value={(values as FormFieldsByKind['termin']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-phone">Telefon</label>
                  <input id="termin-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['termin']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-email">E-Mail</label>
                  <input id="termin-email" name="email" required type="email" value={(values as FormFieldsByKind['termin']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-vehicle">Fahrzeug</label>
                  <input id="termin-vehicle" name="vehicle" value={(values as FormFieldsByKind['termin']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-service">Gewünschte Leistung</label>
                  <select id="termin-service" name="service" value={(values as FormFieldsByKind['termin']).service} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="innen">Innenaufbereitung</option>
                    <option value="aussen">Außenaufbereitung</option>
                    <option value="komplett">Komplettaufbereitung</option>
                    <option value="lack">Lackpflege / Politur</option>
                    <option value="leasing">Leasingrückgabe</option>
                    <option value="verkauf">Verkaufsaufbereitung</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-date">Wunschtermin</label>
                  <input id="termin-date" name="preferredDate" type="date" value={(values as FormFieldsByKind['termin']).preferredDate} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="termin-description">Nachricht</label>
                <textarea id="termin-description" name="description" rows={4} value={(values as FormFieldsByKind['termin']).description} onChange={handleChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand ..." />
              </div>
            </>
          )}

          {kind === 'business' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="business-company">Firma</label>
                  <input id="business-company" name="company" required value={(values as FormFieldsByKind['business']).company} onChange={handleChange} className={inputClass} placeholder="Autohaus / Fuhrpark / Agentur" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-contact">Ansprechpartner</label>
                  <input id="business-contact" name="contact" required value={(values as FormFieldsByKind['business']).contact} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="business-phone">Telefon</label>
                  <input id="business-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['business']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-email">E-Mail</label>
                  <input id="business-email" name="email" required type="email" value={(values as FormFieldsByKind['business']).email} onChange={handleChange} className={inputClass} placeholder="kontakt@firma.de" />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-partner">Art der Zusammenarbeit</label>
                <select id="business-partner" name="partnerType" value={(values as FormFieldsByKind['business']).partnerType} onChange={handleChange} className={inputClass}>
                  <option value="">Bitte wählen</option>
                  <option value="autohaus">Autohaus</option>
                  <option value="fuhrpark">Fuhrpark</option>
                  <option value="versicherung">Versicherung / Versicherungsagentur</option>
                  <option value="rahmenvertrag">Rahmenvertrag / laufende Zusammenarbeit</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-description">Nachricht</label>
                <textarea id="business-description" name="description" required rows={4} value={(values as FormFieldsByKind['business']).description} onChange={handleChange} className={inputClass} placeholder="Umfang, Frequenz, Sonderwünsche ..." />
              </div>
            </>
          )}

          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-blue-700 sm:w-auto">
              <Send size={14} />
              Anfrage absenden
            </button>
            <p className="text-[11px] leading-relaxed text-gray-400">
              Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß Datenschutzerklärung zu.
            </p>
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default RequestForm;
