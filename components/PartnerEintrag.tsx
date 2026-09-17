import React from 'react';
import type { TargetGroupPartner } from '../types';
import { ExternMarke, externAttribute } from './ExternerLink';

/**
 * Ein Referenzpartner in einer Liste — Name, bei Freigabe Logo und Link (Backlog 3.16/3.31).
 *
 * EIN BAUSTEIN FUER BEIDE LISTEN. Die Zielgruppenkarten der Startseite und die
 * Geschaeftskundenseite zeigen dieselben Partner aus `data/partners.ts`. Stuende die
 * Darstellung zweimal da, bekaeme die naechste Freigabe ihr Logo nur an einer Stelle.
 *
 * DARSTELLUNG
 *   `liste` — Zielgruppenkarten: Logo ueber dem Namen, kleine Schrift.
 *   `pille` — Geschaeftskundenseite: Name in einer Pille, Logo davor.
 *
 * WORTMARKE (`logoIstName`): Ist das Logo selbst der Name, steht der Name nur fuer
 * Vorlesegeraete da — sichtbar stuende „riparo" sonst zweimal. Das Bild hat deshalb IMMER
 * `alt=""`: Den Namen liefert der Text, nicht das Bild.
 */
const PartnerEintrag: React.FC<{ partner: TargetGroupPartner; darstellung: 'liste' | 'pille' }> = ({
  partner,
  darstellung,
}) => {
  const wortmarke = Boolean(partner.logo && partner.logoIstName);
  const pille = darstellung === 'pille';

  const bild = partner.logo ? (
    <img
      src={partner.logo}
      alt=""
      aria-hidden="true"
      width={partner.logoBreite}
      height={partner.logoHoehe}
      loading="lazy"
      decoding="async"
      className={`w-auto shrink-0 object-contain ${pille ? 'h-3.5 opacity-80' : 'h-6 opacity-60'} ${
        !pille && !wortmarke ? 'self-start' : ''
      }`}
    />
  ) : null;

  const name = <span className={wortmarke ? 'sr-only' : undefined}>{partner.name}</span>;
  const pfeil = <ExternMarke href={partner.url} groesse={pille ? 12 : 11} />;

  const inhalt = pille ? (
    <>
      {bild}
      {name}
      {pfeil}
    </>
  ) : wortmarke ? (
    <span className="inline-flex items-center gap-1.5 text-gray-600">
      {bild}
      {name}
      {pfeil}
    </span>
  ) : (
    <>
      {bild}
      {/* 12 px seit 2026-09-17 (vorher 11 px): Auf Full HD waren die Namen schwer lesbar. */}
      <span className="inline-flex items-center gap-1 text-xs font-semibold leading-snug text-gray-600 [hyphens:none]">
        {name}
        {pfeil}
      </span>
    </>
  );

  const klassen = pille
    ? 'inline-flex items-center gap-2 rounded-full border border-gray-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm [hyphens:none]'
    : 'flex flex-col gap-1';

  // Link nur bei freigegebenen Partnern (`url` gesetzt).
  return partner.url ? (
    <a
      href={partner.url}
      {...externAttribute(partner.url)}
      className={`${klassen} transition-colors ${pille ? 'hover:border-blue-200 hover:text-gray-950' : 'hover:opacity-80'}`}
    >
      {inhalt}
    </a>
  ) : (
    <span className={klassen}>{inhalt}</span>
  );
};

export default PartnerEintrag;
