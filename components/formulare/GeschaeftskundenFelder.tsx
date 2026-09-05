import React from 'react';
import { inputClass, labelClass, type FeldAenderung, type FormFieldsByKind } from './felder';

/**
 * Felder der Variante „Geschaeftskundenanfrage".
 *
 * Herausgeloest aus `RequestForm.tsx` am 2026-09-05 (reiner Umzug, kein Verhalten
 * geaendert). Rahmen, Zustand, Versand und Absenden bleiben dort; hier stehen nur die
 * Felder dieser Variante.
 */
interface GeschaeftskundenFelderProps {
  werte: FormFieldsByKind['business'];
  onChange: FeldAenderung;
}

const GeschaeftskundenFelder: React.FC<GeschaeftskundenFelderProps> = ({ werte, onChange }) => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="business-company">Firma</label>
        <input id="business-company" name="company" required value={werte.company} onChange={onChange} className={inputClass} placeholder="Autohaus / Fuhrpark / Agentur" />
      </div>
      <div>
        <label className={labelClass} htmlFor="business-contact">Ansprechpartner</label>
        <input id="business-contact" name="contact" required value={werte.contact} onChange={onChange} className={inputClass} placeholder="Vor- und Nachname" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="business-phone">Telefon</label>
        <input id="business-phone" name="phone" required type="tel" value={werte.phone} onChange={onChange} className={inputClass} placeholder="0341 - ..." />
      </div>
      <div>
        <label className={labelClass} htmlFor="business-email">E-Mail</label>
        <input id="business-email" name="email" required type="email" value={werte.email} onChange={onChange} className={inputClass} placeholder="kontakt@firma.de" />
      </div>
    </div>
    <div>
      <label className={labelClass} htmlFor="business-partner">Art der Zusammenarbeit</label>
      <select id="business-partner" name="partnerType" value={werte.partnerType} onChange={onChange} className={inputClass}>
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
      <textarea id="business-description" name="description" required rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Umfang, Frequenz, Sonderwünsche ..." />
    </div>
  </>
);

export default GeschaeftskundenFelder;
