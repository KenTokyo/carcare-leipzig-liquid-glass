import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BriefcaseBusiness, Building2, CalendarClock, CheckCircle2, Send } from 'lucide-react';
import { ausbildungsberufe, berufsbilder } from '../data/jobs';
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
  bewerbung: {
    name: string;
    email: string;
    phone: string;
    position: string;
    description: string;
  };
}

const initialState: FormFieldsByKind = {
  schaden: { name: '', phone: '', email: '', vehicle: '', incident: '', insuranceAvailable: '', description: '' },
  termin: { name: '', phone: '', email: '', vehicle: '', service: '', preferredDate: '', description: '' },
  business: { company: '', contact: '', phone: '', email: '', partnerType: '', description: '' },
  bewerbung: { name: '', email: '', phone: '', position: '', description: '' },
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
  bewerbung: {
    icon: <BriefcaseBusiness size={14} />,
    eyebrow: 'Bewerbung',
    title: 'Bewerbung senden.',
    subtitle: 'Name, Kontakt und ein paar Sätze zu Ihrer Erfahrung genügen. Ein Lebenslauf hilft, ist aber keine Bedingung.',
  },
};

/**
 * VERSAND IST NOCH NICHT ANGEBUNDEN (Backlog 1.17, Paket E).
 *
 * `handleSubmit` setzt bis heute nur `submitted = true` — es geht nichts raus. Bei einer
 * BEWERBUNG ist das nicht vertretbar: Wer seinen Werdegang schickt und „wir melden uns"
 * liest, waehrend niemand etwas bekommen hat, wartet auf eine Antwort, die nie kommt.
 * Deshalb ist der Absenden-Knopf dieser Variante inaktiv und nennt den Weg, der
 * funktioniert. Sobald 1.17 steht, wird hier `true` gesetzt — sonst nichts.
 *
 * Die drei aelteren Varianten bleiben unveraendert: Sie sind seit Langem so live, und
 * ihre Umstellung ist eine eigene Entscheidung, nicht Teil von 1.22. Festgehalten im
 * Paket-D-Plan, Abschnitt 5.
 */
const VERSAND_AKTIV = false;

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
  const labelClass = 'block text-xs font-bold uppercase tracking-[0.15em] text-gray-600 mb-2';

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
          <span className="text-blue-600">{head.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">{head.eyebrow}</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">{head.title}</h3>
        <p className="text-sm leading-relaxed text-gray-600 md:text-base">{head.subtitle}</p>
      </div>

      {submitted ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="mb-2 text-lg font-bold text-gray-950">Anfrage übermittelt.</h4>
          <p className="text-sm leading-relaxed text-gray-600">
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

          {kind === 'bewerbung' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="bewerbung-name">Name</label>
                  <input id="bewerbung-name" name="name" required value={(values as FormFieldsByKind['bewerbung']).name} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bewerbung-phone">Telefon</label>
                  <input id="bewerbung-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['bewerbung']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="bewerbung-email">E-Mail</label>
                  <input id="bewerbung-email" name="email" required type="email" value={(values as FormFieldsByKind['bewerbung']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bewerbung-position">Bereich</label>
                  {/*
                    NICHT AUSGESCHRIEBENE BEREICHE BLEIBEN SICHTBAR, sind aber nicht
                    waehlbar — man soll sehen, dass es den Beruf gibt.

                    NATIVES `disabled`, NICHT `aria-disabled`: Die Sorge, deaktivierte
                    Elemente seien fuer Screenreader unerreichbar, gilt fuer `<button>`
                    und `<input>` — die fallen aus der Tabreihenfolge. Ein `<option>`
                    ist ein anderer Fall: Der `<select>` bleibt fokussierbar, die Option
                    bleibt in der Liste. `aria-disabled` waere hier schlechter, weil die
                    ARIA-Zuordnung fuer native Optionen duenn ist UND die Auswahl nicht
                    verhindert — man haette eine Option, die als „nicht verfuegbar"
                    angesagt wird und sich trotzdem waehlen laesst.

                    ABSICHERUNG: Manche Screenreader ueberspringen deaktivierte Optionen
                    beim Durchgehen. Deshalb steht der Grund IM BESCHRIFTUNGSTEXT, nicht
                    nur im Zustand — plus ein sichtbarer Hinweis unter dem Feld.
                  */}
                  <select id="bewerbung-position" name="position" value={(values as FormFieldsByKind['bewerbung']).position} onChange={handleChange} className={inputClass} aria-describedby="bewerbung-position-hinweis">
                    <option value="">Bitte wählen</option>
                    <optgroup label="Berufsbilder">
                      {berufsbilder.map((job) => (
                        <option key={job.id} value={job.id} disabled={job.status !== 'suchend'}>
                          {job.title}
                          {job.status === 'suchend' ? '' : ' — zurzeit keine offene Stelle'}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ausbildung">
                      {ausbildungsberufe.map((job) => (
                        <option key={job.id} value={job.id} disabled={job.status !== 'suchend'}>
                          {job.title}
                          {job.status === 'suchend' ? '' : ' — zurzeit keine offene Stelle'}
                        </option>
                      ))}
                    </optgroup>
                    <option value="initiativ">Anderer Bereich / Initiativbewerbung</option>
                  </select>
                  <p id="bewerbung-position-hinweis" className="mt-2 text-[11px] leading-relaxed text-gray-600">
                    Ausgegraute Bereiche gehören zum Betrieb, sind aber gerade nicht ausgeschrieben.
                    Wählen Sie dafür „Anderer Bereich / Initiativbewerbung" und nennen Sie den Beruf in der Nachricht.
                  </p>
                </div>
              </div>
              {/* Lebenslauf ausdruecklich OPTIONAL, und das Formular ist auch ohne Anhang
                  absendbar — beides Vorgabe aus 1.22. Deshalb kein `required` und ein
                  Hinweis, der das benennt, statt es nur wegzulassen. */}
              <div>
                <label className={labelClass} htmlFor="bewerbung-cv">Lebenslauf <span className="text-gray-500">(optional)</span></label>
                <input id="bewerbung-cv" name="cv" type="file" accept=".pdf,.doc,.docx,image/*" className={inputClass} />
                <p className="mt-2 text-[11px] leading-relaxed text-gray-600">
                  PDF, Word oder Foto. Ohne Anhang geht es genauso — wir melden uns und klären den Rest.
                </p>
              </div>
              <div>
                <label className={labelClass} htmlFor="bewerbung-description">Nachricht</label>
                <textarea id="bewerbung-description" name="description" required rows={4} value={(values as FormFieldsByKind['bewerbung']).description} onChange={handleChange} className={inputClass} placeholder="Ein paar Sätze zu Ihrer Erfahrung und dazu, ab wann Sie können ..." />
              </div>
            </>
          )}

          {/* Absenden: fuer die Bewerbung inaktiv, solange der Versand nicht angebunden ist
              (siehe `VERSAND_AKTIV`). Ein Knopf, der „uebermittelt" meldet und nichts
              versendet, kostet hier eine Bewerbung — nicht nur eine Anfrage. */}
          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={kind === 'bewerbung' && !VERSAND_AKTIV}
              className="cc-gradient-button inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={14} />
              {kind === 'bewerbung' ? 'Bewerbung senden' : 'Anfrage absenden'}
            </button>
            {kind === 'bewerbung' && !VERSAND_AKTIV ? (
              <p className="text-[11px] leading-relaxed text-gray-600">
                Der Online-Versand wird gerade eingerichtet. Bis dahin erreichen Sie uns unter{' '}
                <a href="tel:+493412617790" className="font-semibold text-gray-950 underline">0341 - 261 77 90</a>
                {' '}oder{' '}
                <a href="mailto:info@carcare-center.de" className="font-semibold text-gray-950 underline">info@carcare-center.de</a>.
              </p>
            ) : (
              <p className="text-[11px] leading-relaxed text-gray-600">
                Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß{' '}
                <a href="/datenschutz" className="font-semibold text-gray-950 underline">Datenschutzerklärung</a> zu.
              </p>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default RequestForm;
