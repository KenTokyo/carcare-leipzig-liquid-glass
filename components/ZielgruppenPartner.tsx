import React from 'react';
import type { TargetGroupPartner } from '../types';
import PartnerEintrag from './PartnerEintrag';

/**
 * Referenzpartner in einer Zielgruppenkarte der Startseite (Backlog 3.16/3.31).
 *
 * EIN RASTER FUER ALLE KARTEN — gleiche Spalten, Abstaende und Schrift, egal ob 5 oder 32
 * Partner. Ein frueherer Versuch, viele Namen als Fliesstext zu setzen, war deutlich
 * schlechter lesbar (2026-07-24).
 *
 * PLATZ (seit 2026-09-17): Die Kachelhoehe haengt am Fenster (`100svh - i x --bar`). Die
 * Liste bekommt deshalb keine feste Hoehe, sondern den REST der Karte (`flex-1`) und scrollt
 * darin. Vorher standen hier feste Hoehen (96/160/224 px) und darunter eine Ausblendung ab
 * 860 px Fensterhoehe — auf 1920 x 945 blieb unter der Liste weisser Leerraum, auf
 * 1745 x 830 (Full HD, 110 % Zoom) war sie ganz weg.
 * `--liste-min` (styles/zielgruppen.css) haelt Titel plus zwei Zeilen: Reicht der Rest
 * nicht, laeuft lieber der Kartentext ueber — der ist per Mausrad erreichbar.
 *
 * SCROLLEN: Kein `data-lenis-prevent` mehr. `allowNestedScroll` (hooks/useSmoothScroll.ts)
 * laesst die Liste scrollen, solange sie kann, und gibt an ihrem Ende weich an die Seite ab.
 * Unter `lg` hat die Liste keine eigene Hoehe: Dort scrollt der ganze Kartentext, zwei
 * ineinander liegende Scrollbereiche waeren per Touch unbedienbar.
 *
 * HINWEIS AUFS WEITERSCROLLEN: Verlauf an der Unterkante, solange Eintraege folgen
 * (`.cc-scroll-verlauf`), dazu die Anzahl rechts im Titel.
 *
 * SPALTEN: ab `sm` so viele, wie bei 9 rem Mindestbreite passen — auf Full HD drei, im halb
 * angedockten Fenster (960 px, Karte ueber die volle Breite) fuenf; so stehen die 32
 * Versicherer dort ohne Scrollen. Auf dem Telefon fest zwei: Bei 264–294 px Textbreite
 * ergaebe `auto-fill` nur eine Spalte. `content-start`, sonst verteilt das Raster wenige
 * Zeilen (5 Autohaeuser) ueber die ganze Hoehe.
 */
const ZielgruppenPartner: React.FC<{ partner: TargetGroupPartner[]; titel: string }> = ({ partner, titel }) => (
  <div
    data-partner="block"
    className="mt-5 flex flex-col border-t border-gray-100 pt-4 [@media(max-height:859px)]:mt-4 [@media(max-height:859px)]:pt-3 lg:min-h-[var(--liste-min)] lg:flex-1"
  >
    <p
      data-partner="titel"
      className="flex items-baseline justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600"
    >
      <span>{titel}</span>
      {/* Fuer Vorlesegeraete unnoetig: Die Liste nennt ihre Laenge selbst. */}
      <span aria-hidden="true" className="shrink-0 tabular-nums tracking-[0.12em]">
        {partner.length}
      </span>
    </p>
    <ul
      data-partner="liste"
      className="cc-card-scroll cc-scroll-verlauf mt-2.5 grid grid-cols-2 content-start gap-x-4 gap-y-2 sm:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-2"
    >
      {partner.map((eintrag) => (
        <li key={eintrag.name}>
          <PartnerEintrag partner={eintrag} darstellung="liste" />
        </li>
      ))}
    </ul>
  </div>
);

export default ZielgruppenPartner;
