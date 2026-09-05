import React from 'react';
import { sichtbareFelder, type SchadenFeld } from '../../data/schadenFelder';
import { inputClass, labelClass, type FeldAenderung } from './felder';

/**
 * Felder der Schadenmeldung — vollstaendig aus `data/schadenFelder.ts` gerendert.
 *
 * ⚠️ HIER STEHT KEIN FELD FEST VERDRAHTET. Wer eines streichen, umbenennen, zur Pflicht
 * machen oder an eine Bedingung haengen will, aendert die Datenquelle. Diese Datei kennt
 * nur die fuenf Feldarten und die Zweispaltigkeit.
 *
 * BEDINGTE FELDER: `nurWenn` blendet die Versicherungsangaben ein, sobald der
 * Kostentraeger eine Versicherung ist. Der Reparaturfall sieht damit ein KUERZERES
 * Formular, kein anderes — das ist der richtige Unterschied zwischen den beiden Faellen.
 *
 * Dass ausgeblendete Felder ihren Wert verlieren, erledigt `RequestForm`: Sonst stuende
 * eine Schadennummer in der Mail, obwohl der Absender am Ende „Ich selbst" gewaehlt hat.
 */

interface SchadenFelderProps {
  werte: Record<string, string>;
  onChange: FeldAenderung;
}

const halbeBreite = (feld: SchadenFeld) => feld.breite !== 'voll';

const Feld: React.FC<{ feld: SchadenFeld; wert: string; onChange: FeldAenderung }> = ({
  feld,
  wert,
  onChange,
}) => {
  const id = `schaden-${feld.id}`;
  const beschrieben = feld.hinweis ? `${id}-hinweis` : undefined;
  const gemeinsam = {
    id,
    name: feld.id,
    value: wert,
    onChange,
    className: inputClass,
    required: feld.pflicht,
    'aria-describedby': beschrieben,
  };

  return (
    <div>
      <label className={labelClass} htmlFor={id}>
        {feld.label}
      </label>

      {feld.typ === 'select' ? (
        <select {...gemeinsam}>
          <option value="">Bitte wählen</option>
          {feld.optionen?.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      ) : feld.typ === 'textarea' ? (
        <textarea {...gemeinsam} rows={4} placeholder={feld.platzhalter} />
      ) : (
        <input {...gemeinsam} type={feld.typ} placeholder={feld.platzhalter} />
      )}

      {feld.hinweis && (
        <p id={beschrieben} className="mt-2 text-[11px] leading-relaxed text-gray-600">
          {feld.hinweis}
        </p>
      )}
    </div>
  );
};

const SchadenFelder: React.FC<SchadenFelderProps> = ({ werte, onChange }) => {
  const felder = sichtbareFelder(werte);

  // Halbbreite Felder paarweise in eine Zeile, ganzbreite allein. Aus der Liste
  // gerechnet, damit das Streichen eines Feldes die Zeilen nicht zerreisst.
  const zeilen: SchadenFeld[][] = [];
  for (const feld of felder) {
    const letzte = zeilen[zeilen.length - 1];
    if (halbeBreite(feld) && letzte && letzte.length === 1 && halbeBreite(letzte[0])) letzte.push(feld);
    else zeilen.push([feld]);
  }

  return (
    <>
      {zeilen.map((zeile) => (
        <div
          key={zeile.map((f) => f.id).join('-')}
          className={zeile.length === 2 ? 'grid grid-cols-1 gap-4 md:grid-cols-2' : ''}
        >
          {zeile.map((feld) => (
            <Feld key={feld.id} feld={feld} wert={werte[feld.id] ?? ''} onChange={onChange} />
          ))}
        </div>
      ))}
    </>
  );
};

export default SchadenFelder;
