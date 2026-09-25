import React from 'react';
import { AlertTriangle, ArrowUpRight, Phone } from 'lucide-react';
import { useAnfrageDialog } from './AnfrageDialog';
import { SCHADENMELDUNG_EXTERN, SCHADENMELDUNG_PORTAL, SCHADENMELDUNG_URL } from '../data/schadenmeldung';
import { externAttribute } from './ExternerLink';
import { OEFFNUNG_NEUTRAL } from '../data/oeffnungszeiten';
import { useOeffnungsStatus } from '../hooks/useOeffnungsStatus';

/**
 * „Schaden melden" und Telefon in der weissen Aussparung oben rechts — ab `lg` (1024 px), sofort
 * und dauerhaft sichtbar. Form, Rundungen und Anordnung: `styles/aussparung.css`.
 *
 * GESCHICHTE (alles 2026-09-24): erst zwei schwebende Kreise unten rechts, dann zwei 44-px-Kreise
 * in dieser Aussparung, nur mit Symbol — Beschriftung erschien erst beim Ueberfahren. Der User fand
 * sie „zu unscheinbar und nicht selbsterklaerend". Zu Recht: Beschriftungen muessen IMMER sichtbar
 * sein, Einblenden beim Ueberfahren ersetzt sie nicht (NN/g, „Icon Usability"), und ein Warndreieck
 * liest sich als „Warnung", nicht als „Schaden melden". Planung und Messungen:
 * `docs/startseite-karten-aktionen/tasks/2026-09-24-aussparung-beschriftete-aktionen-tasks.md`.
 *
 * JETZT: zwei beschriftete Pillen im selben hellen Design (`cc-aktion--hell`, Eisblau). Bis
 * 2026-09-25 war „Schaden melden" als Hauptaktion dunkel mit Lichtstreif; der User wollte es „im
 * aehnlichen Design wie der Anruf-CTA" — NUR hier oben rechts, alle anderen „Schaden melden" bleiben.
 *  - „Schaden melden" mit Warn-Plakette und Pfeil ↗ (externes Ziel).
 *  - Telefon mit der NUMMER als Beschriftung: Symbol + Nummer ist
 *    eindeutig, und am Desktop fuehrt `tel:` ohne Telefon-App oft ins Leere — dann ist die Nummer
 *    das, was man braucht. Dazu ein Live-Punkt: geoeffnet / geschlossen (`hooks/useOeffnungsStatus.ts`,
 *    Zeiten und Feiertage in `data/oeffnungszeiten.ts`) — derselbe Punkt steht unter 1024 px am
 *    „Anrufen" der Leiste unten (`MobileStickyCTA`).
 *  - Unter beiden ein Hinweis beim Ueberfahren/Fokussieren mit dem, was nicht auf die Pille passt:
 *    Status in Worten bzw. das Ziel (reparatur.info, neuer Tab).
 * Die Symbolkreise von frueher leben als Plaketten links in den Pillen weiter.
 *
 * WARUM IM SEITENRAHMEN (`Layout`, `.solidroad-shell-frame-container`): Dort liegt auch der
 * Navbar-Reiter. Innerhalb von `<main>` griffe `position: fixed` nicht — der Transform auf
 * `.site-main-shell` bindet es an `<main>` statt ans Fenster.
 *
 * Unter `lg` steht die Aussparung nicht — oben rechts sitzt dort das Menue, und die Aktionen liegen
 * in der Leiste am unteren Rand (`MobileStickyCTA`).
 */

/** Anzeigeformat wie an allen anderen Stellen (SEO-GEO-STANDARDS, NAP_TELEFON). */
const TELEFON_ANZEIGE = '0341 - 261 77 90';

/**
 * Rollender Text beim Ueberfahren: zwei GLEICHE Zeilen, die zweite rollt von unten herein. Gleich,
 * damit die Nummer unter dem Mauszeiger lesbar bleibt — ein Wechsel auf „Jetzt anrufen" haette sie
 * genau dann weggenommen, wenn jemand sie abschreiben will.
 *
 * ⚠️ Die Kopie ist in Ruhe `visibility: hidden` (styles/aussparung.css). Sonst misst
 * `npm run kontrast` sie mit: Sie liegt unterhalb der Pille, und die Trefferprobe dort landet auf
 * der Pille selbst — weisse Schrift auf weissem Grund, ein Befund, den es nicht gibt.
 */
const Rolle: React.FC<{ text: string }> = ({ text }) => (
  <span className="cc-aktion__rolle" aria-hidden="true">
    <span className="cc-aktion__spur">
      <span>{text}</span>
      <span className="cc-aktion__kopie">{text}</span>
    </span>
  </span>
);

const AktionsAussparung: React.FC = () => {
  const { oeffnen } = useAnfrageDialog();
  const status = useOeffnungsStatus();
  const statusText = status?.text ?? OEFFNUNG_NEUTRAL;

  const schadenInhalt = (
    <>
      <span className="cc-aktion__symbol" aria-hidden="true">
        <AlertTriangle size={14} strokeWidth={2.4} />
      </span>
      <Rolle text="Schaden melden" />
      {SCHADENMELDUNG_EXTERN && (
        <ArrowUpRight className="cc-aktion__pfeil" size={14} strokeWidth={2.4} aria-hidden="true" />
      )}
    </>
  );

  return (
    <div
      role="group"
      aria-label="Schnellkontakt"
      // Fester Haken fuer `npm run aussparung` — Klassen aendern sich, der Name nicht.
      data-aktions-aussparung=""
      className="cc-aussparung hidden lg:flex print:hidden"
    >
      {/* Reihenfolge = Lesereihenfolge: Nebenaktion zuerst, die Hauptaktion schliesst ab (unten im
          Stapel, rechts in der Reihe) — wie der Haupt-CTA am Ende einer Kopfzeile. */}
      {/* KEIN LIQUID GLASS HIER (Entscheidung des Users 2026-09-25): Das Glas (`cc-liquid`,
          styles/glas.css) war hier zwei Tage Pilot und gilt jetzt NUR fuer die Sticky-Buttons der
          mobilen Leiste. Auf der weissen Aussparung gibt es hinter der Pille nichts zu verwischen —
          dort bleibt die Eisblau-Pille. */}
      <a
        href="tel:+493412617790"
        className="cc-aktion cc-aktion--telefon cc-aktion--hell"
        aria-label={`Anrufen: ${TELEFON_ANZEIGE}, ${statusText}`}
        data-offen={status ? String(status.offen) : undefined}
      >
        <span className="cc-aktion__symbol" aria-hidden="true">
          <Phone className="cc-aktion__hoerer" size={14} strokeWidth={2.4} />
          <span className="cc-aktion__punkt" />
        </span>
        <Rolle text={TELEFON_ANZEIGE} />
      </a>

      {/* Wie in `MobileStickyCTA`: seit 2026-09-16 ein Link zur Schadenseite auf reparatur.info
          (Backlog 2.23). Mit dem Schalter in `data/schadenmeldung.ts` wieder das eigene Formular. */}
      {SCHADENMELDUNG_EXTERN ? (
        <a
          href={SCHADENMELDUNG_URL}
          {...externAttribute(SCHADENMELDUNG_URL)}
          className="cc-aktion cc-aktion--schaden cc-aktion--hell"
          aria-label="Schaden melden (öffnet in einem neuen Tab)"
        >
          {schadenInhalt}
        </a>
      ) : (
        <button
          type="button"
          onClick={() => oeffnen('schaden')}
          className="cc-aktion cc-aktion--schaden cc-aktion--hell"
          aria-label="Schaden melden"
        >
          {schadenInhalt}
        </button>
      )}

      {/* Hinweise als GESCHWISTER der Pillen, nicht darin: Sie haengen an der Aussparung (unter
          ihr, rechtsbuendig) — im Stapel laege ein Hinweis unter der oberen Pille sonst ueber der
          unteren. Eingeblendet per `~`-Selektor beim Ueberfahren oder Fokussieren. Nur Anzeige:
          Die Ansage steht im `aria-label` der Pille. */}
      <span className="cc-aktion-hinweis cc-aktion-hinweis--telefon" aria-hidden="true">
        {status && <span className="cc-aktion-hinweis__punkt" data-offen={String(status.offen)} />}
        {statusText}
      </span>
      <span className="cc-aktion-hinweis cc-aktion-hinweis--schaden" aria-hidden="true">
        {SCHADENMELDUNG_EXTERN ? (
          <>
            Online über {SCHADENMELDUNG_PORTAL}
            <ArrowUpRight size={12} strokeWidth={2.6} />
          </>
        ) : (
          'Formular öffnen'
        )}
      </span>
    </div>
  );
};

export default AktionsAussparung;
