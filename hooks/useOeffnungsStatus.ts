import { useEffect, useState } from 'react';
import { oeffnungsStatus, type OeffnungsStatus } from '../data/oeffnungszeiten';

/**
 * Live-Status „geoeffnet / geschlossen" fuer die Telefon-Aktionen — oben rechts in der
 * `AktionsAussparung` (ab 1024 px) und in der Leiste unten (`MobileStickyCTA`, darunter).
 * Jede Minute neu gerechnet, immer in Leipziger Zeit (`data/oeffnungszeiten.ts`).
 *
 * `null` = neutral: keine Aussage, kein Punkt, Text `OEFFNUNG_NEUTRAL` („Mo–Fr 7–18 Uhr").
 * NEUTRAL BLEIBT ES IN AUTOMATISIERTEN BROWSERN (`navigator.webdriver`): Der Prerender speichert die
 * Seite als statisches HTML — ein „Jetzt geöffnet" vom Build-Zeitpunkt stuende dort fest. Auch die
 * Pruefskripte bekommen so bei jedem Lauf dasselbe Bild. Wer den Status im Skript sehen will:
 * `navigator.webdriver` per `evaluateOnNewDocument` auf `false` stellen, die Uhr per `Date`-Ersatz.
 */
export const useOeffnungsStatus = (): OeffnungsStatus | null => {
  const [status, setStatus] = useState<OeffnungsStatus | null>(null);
  useEffect(() => {
    if (navigator.webdriver) return;
    const rechne = () => setStatus(oeffnungsStatus());
    rechne();
    const takt = window.setInterval(rechne, 60_000);
    return () => window.clearInterval(takt);
  }, []);
  return status;
};
