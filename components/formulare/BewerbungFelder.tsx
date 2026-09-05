import React from 'react';
import { ausbildungsberufe, berufsbilder } from '../../data/jobs';
import { inputClass, labelClass, type FeldAenderung, type FormFieldsByKind } from './felder';

/**
 * Felder der Variante „Bewerbung".
 *
 * Herausgeloest aus `RequestForm.tsx` am 2026-09-05 (reiner Umzug, kein Verhalten
 * geaendert). Rahmen, Zustand, Versand und Absenden bleiben dort; hier stehen nur die
 * Felder dieser Variante.
 */
interface BewerbungFelderProps {
  werte: FormFieldsByKind['bewerbung'];
  onChange: FeldAenderung;
}

const BewerbungFelder: React.FC<BewerbungFelderProps> = ({ werte, onChange }) => (
  <>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="bewerbung-name">Name</label>
        <input id="bewerbung-name" name="name" required value={werte.name} onChange={onChange} className={inputClass} placeholder="Vor- und Nachname" />
      </div>
      <div>
        <label className={labelClass} htmlFor="bewerbung-phone">Telefon</label>
        <input id="bewerbung-phone" name="phone" required type="tel" value={werte.phone} onChange={onChange} className={inputClass} placeholder="0341 - ..." />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className={labelClass} htmlFor="bewerbung-email">E-Mail</label>
        <input id="bewerbung-email" name="email" required type="email" value={werte.email} onChange={onChange} className={inputClass} placeholder="name@beispiel.de" />
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
        <select id="bewerbung-position" name="position" value={werte.position} onChange={onChange} className={inputClass} aria-describedby="bewerbung-position-hinweis">
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
      <textarea id="bewerbung-description" name="description" required rows={4} value={werte.description} onChange={onChange} className={inputClass} placeholder="Ein paar Sätze zu Ihrer Erfahrung und dazu, ab wann Sie können ..." />
    </div>
  </>
);

export default BewerbungFelder;
