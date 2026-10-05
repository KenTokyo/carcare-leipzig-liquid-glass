import React, { useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { ANHANG_ACCEPT, ANHANG_MAX_BYTES, ANHANG_MAX_DATEIEN, ANHANG_TYPEN, anhangEndung, passtSignatur } from '../../data/anfrageSchema';
import { labelClass } from './felder';

/**
 * Dateifeld der Bewerbung (Backlog 5.29, Meeting 2026-09-25: „da soll ein ganz normaler Anhang mit
 * PDF … oder Word hinterlegt werden").
 *
 * DIESELBEN REGELN WIE AUF DEM SERVER, aus `data/anfrageSchema.ts`: Typ ueber die Signatur der ersten
 * Bytes, hoechstens drei Dateien, zusammen 3 MB. Hier nur fuer eine fruehe, verstaendliche Meldung —
 * verbindlich prueft `api/anfrage.ts`.
 *
 * WARUM DAS NATIVE FELD UNSICHTBAR IST: Wir fuehren die Liste selbst (Entfernen, Nachwaehlen), das
 * Browserfeld zeigte daneben weiter „Keine Datei ausgewaehlt". Es bleibt aber fokussierbar
 * (`sr-only`, nicht `hidden`); die Beschriftung darunter ist der sichtbare Knopf und zeigt dessen
 * Fokus (`peer-focus-visible`).
 */

const mb = (bytes: number) => `${(bytes / 1_000_000).toFixed(1).replace(/\.0$/, '').replace('.', ',')} MB`;
const groesse = (bytes: number) => (bytes >= 1_000_000 ? mb(bytes) : `${Math.max(1, Math.round(bytes / 1000))} KB`);

interface AnhangFeldProps {
  dateien: File[];
  onChange: (dateien: File[]) => void;
}

const AnhangFeld: React.FC<AnhangFeldProps> = ({ dateien, onChange }) => {
  const [meldung, setMeldung] = useState<string | null>(null);
  const summe = dateien.reduce((s, d) => s + d.size, 0);

  const hinzufuegen = async (auswahl: FileList | null) => {
    if (!auswahl?.length) return;
    const neu = [...dateien];
    let hinweis: string | null = null;
    for (const datei of Array.from(auswahl)) {
      const endung = anhangEndung(datei.name);
      if (!ANHANG_TYPEN[endung]) {
        hinweis = `„${datei.name}“ hat ein anderes Format. Bitte PDF, Word, ODT, JPG oder PNG.`;
        continue;
      }
      const kopf = new Uint8Array(await datei.slice(0, 8).arrayBuffer());
      if (!passtSignatur(kopf, endung)) {
        hinweis = `„${datei.name}" passt nicht zu seiner Dateiendung und wurde nicht angehängt.`;
        continue;
      }
      if (neu.some((d) => d.name === datei.name && d.size === datei.size)) continue;
      if (neu.length >= ANHANG_MAX_DATEIEN) {
        hinweis = `Bitte höchstens ${ANHANG_MAX_DATEIEN} Dateien. Weitere Unterlagen können Sie nach dem Absenden per E-Mail schicken.`;
        break;
      }
      if (neu.reduce((s, d) => s + d.size, 0) + datei.size > ANHANG_MAX_BYTES) {
        hinweis = `„${datei.name}" passt nicht mehr hinein: zusammen höchstens ${mb(ANHANG_MAX_BYTES)}. Größere Unterlagen bitte nach dem Absenden per E-Mail.`;
        continue;
      }
      neu.push(datei);
    }
    setMeldung(hinweis);
    onChange(neu);
  };

  return (
    <div>
      <p className={labelClass}>Unterlagen (freiwillig)</p>
      <input
        id="bewerbung-anhang"
        type="file"
        multiple
        accept={ANHANG_ACCEPT}
        className="peer sr-only"
        aria-describedby="bewerbung-anhang-hinweis"
        onChange={(e) => {
          void hinzufuegen(e.target.files);
          // Zuruecksetzen, damit dieselbe Datei nach dem Entfernen erneut gewaehlt werden kann.
          e.target.value = '';
        }}
      />
      <label
        htmlFor="bewerbung-anhang"
        className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-blue-200 bg-white px-5 text-sm font-bold text-blue-600 shadow-sm transition-colors hover:border-blue-400 hover:bg-blue-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600"
      >
        <Paperclip size={16} aria-hidden="true" />
        {dateien.length ? 'Weitere Datei anhängen' : 'Lebenslauf oder Zeugnisse anhängen'}
      </label>
      <p id="bewerbung-anhang-hinweis" className="mt-2 text-[11px] leading-relaxed text-gray-600">
        PDF, Word, ODT, JPG oder PNG · bis zu {ANHANG_MAX_DATEIEN} Dateien, zusammen höchstens {mb(ANHANG_MAX_BYTES)}.
      </p>

      {dateien.length > 0 && (
        <ul className="mt-3 space-y-2" aria-label="Angehängte Dateien">
          {dateien.map((datei, i) => (
            <li key={`${datei.name}-${datei.size}`} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white py-1 pl-4 pr-1 text-sm text-gray-950">
              <span className="min-w-0 truncate">
                {datei.name} <span className="text-gray-600">· {groesse(datei.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange(dateien.filter((_, j) => j !== i));
                  setMeldung(null);
                }}
                className="inline-flex min-h-12 min-w-12 shrink-0 items-center justify-center gap-1 rounded-full px-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950"
                aria-label={`${datei.name} entfernen`}
              >
                <X size={14} aria-hidden="true" />
                Entfernen
              </button>
            </li>
          ))}
          <li className="text-[11px] text-gray-600">Zusammen {groesse(summe)} von {mb(ANHANG_MAX_BYTES)}</li>
        </ul>
      )}

      {/* `role="status"`: Wird angesagt, ohne den Fokus zu verschieben — die Auswahl geht weiter. */}
      <p role="status" className={meldung ? 'mt-3 rounded-xl border border-gray-200 bg-white p-3 text-sm leading-relaxed text-gray-950' : 'sr-only'}>
        {meldung ?? ''}
      </p>
    </div>
  );
};

export default AnhangFeld;
