import React from 'react';
import { inputClass, labelClass, type FeldAenderung, type FormFieldsByKind } from './felder';

/**
 * Felder der Variante „Schadenmeldung".
 *
 * Herausgeloest aus `RequestForm.tsx` am 2026-09-05 (reiner Umzug, kein Verhalten
 * geaendert). Rahmen, Zustand, Versand und Absenden bleiben dort; hier stehen nur die
 * Felder dieser Variante.
 */
interface SchadenFelderProps {
  werte: FormFieldsByKind['schaden'];
  onChange: FeldAenderung;
}

const SchadenFelder: React.FC<SchadenFelderProps> = ({ werte, onChange }) => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="schaden-name">Name</label>
        <input id="schaden-name" name="name" required value={werte.name} onChange={onChange} className={inputClass} placeholder="Max Mustermann" />
      </div>
      <div>
        <label className={labelClass} htmlFor="schaden-phone">Telefon</label>
        <input id="schaden-phone" name="phone" required type="tel" value={werte.phone} onChange={onChange} className={inputClass} placeholder="0341 - ..." />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="schaden-email">E-Mail</label>
        <input id="schaden-email" name="email" required type="email" value={werte.email} onChange={onChange} className={inputClass} placeholder="name@beispiel.de" />
      </div>
      <div>
        <label className={labelClass} htmlFor="schaden-vehicle">Fahrzeug</label>
        <input id="schaden-vehicle" name="vehicle" value={werte.vehicle} onChange={onChange} className={inputClass} placeholder="Marke / Modell" />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="schaden-incident">Schadenart</label>
        <select id="schaden-incident" name="incident" value={werte.incident} onChange={onChange} className={inputClass}>
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
        <select id="schaden-insurance" name="insuranceAvailable" value={werte.insuranceAvailable} onChange={onChange} className={inputClass}>
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
      <textarea id="schaden-description" name="description" required rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Hergang, Datum, Umfang ..." />
    </div>
  </>
);

export default SchadenFelder;
