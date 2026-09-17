import React from 'react';
import type { Mitgliedschaft } from '../data/mitgliedschaften';
import { ExternMarke, externAttribute } from './ExternerLink';

/**
 * Verbandssiegel mit Link zur Verbandsseite (Backlog 3.12, 4.13).
 *
 * ⚠️ DECKENDE FLAECHE, KEIN `.cc-karte`. Das Siegel ist schwarze Schrift auf transparentem
 * Grund. Auf den Seiten mit stehendem Foto (`BackdropLayout`) laege es mit der
 * durchscheinenden Kartenflaeche ueber dunklen Fahrzeugen — unlesbar. Dieselbe Grenze wie
 * bei den Logo-Chips in Paket 1 (`docs/schleife-2-4-karten-ablauf-flaeche/`): Logos stehen
 * auf Weiss.
 *
 * EIN LINK FUER DIE GANZE KARTE. Der Name des Verbands steht als Text daneben, der
 * Alternativtext des Bildes bleibt deshalb kurz — sonst lese ein Vorlesegeraet den Namen
 * zweimal vor.
 */
const Mitgliedssiegel: React.FC<{ verband: Mitgliedschaft; className?: string }> = ({ verband, className = '' }) => (
  <a
    href={verband.url}
    {...externAttribute(verband.url)}
    className={`group flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors hover:border-blue-200 sm:flex-row sm:items-center md:p-6 ${className}`}
  >
    <img
      src={verband.logo}
      alt={`Logo ${verband.kurz}`}
      width={verband.logoBreite}
      height={verband.logoHoehe}
      loading="lazy"
      decoding="async"
      className="h-12 w-auto shrink-0 self-start sm:self-center md:h-14"
    />
    <span className="min-w-0">
      <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Mitgliedschaft</span>
      <span className="mt-1 block text-base font-bold leading-snug text-gray-950">Mitglied im {verband.name}</span>
      <span className="mt-1 block text-sm leading-relaxed text-gray-600">{verband.beschreibung}</span>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
        {verband.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
        <ExternMarke href={verband.url} groesse={13} />
      </span>
    </span>
  </a>
);

export default Mitgliedssiegel;
