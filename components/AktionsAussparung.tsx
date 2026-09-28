import React from 'react';
import { AlertTriangle, ArrowUpRight, CalendarClock } from 'lucide-react';
import { useAnfrageDialog } from './AnfrageDialog';
import { SCHADENMELDUNG_EXTERN, SCHADENMELDUNG_PORTAL, SCHADENMELDUNG_URL } from '../data/schadenmeldung';
import { externAttribute } from './ExternerLink';

/**
 * „Aufbereitung anfragen“ und „Schaden melden“ in der weissen Aussparung oben rechts — ab `lg`
 * (1024 px), sofort und dauerhaft sichtbar. Form, Rundungen und Anordnung: `styles/aussparung.css`.
 *
 * VIERTE RUNDE (User, 2026-09-28): Die Telefon-Pille ist durch „Aufbereitung anfragen“ ersetzt —
 * „fuer Andre ist es wichtiger, nicht direkt anzurufen, sondern einen Termin immer auf jeder Seite
 * anzufragen“. NUR hier am Desktop: Mobil behaelt die Leiste unten ihr „Anrufen“ (`MobileStickyCTA`),
 * und in den Seiten steht der Anruf weiter (Hero, Abschluss-CTA, Fusszeile). Der Live-Punkt
 * geoeffnet/geschlossen lebt seitdem nur noch in der mobilen Leiste.
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
 *  - „Aufbereitung anfragen“ mit Kalender-Plakette (wie „Termin“ in der mobilen Leiste), oeffnet den
 *    Anfrage-Dialog. Bis 2026-09-28 stand hier die Telefonnummer mit Live-Punkt geoeffnet/geschlossen;
 *    der Punkt lebt am „Anrufen“ der Leiste unten weiter (`MobileStickyCTA`).
 *  - „Schaden melden" mit Warn-Plakette und Pfeil ↗ (externes Ziel).
 *  - Unter beiden ein Hinweis beim Ueberfahren/Fokussieren mit dem, was nicht auf die Pille passt:
 *    was sich oeffnet bzw. das Ziel (reparatur.info, neuer Tab).
 * Die Symbolkreise von frueher leben als Plaketten links in den Pillen weiter.
 *
 * WARUM IM SEITENRAHMEN (`Layout`, `.solidroad-shell-frame-container`): Dort liegt auch der
 * Navbar-Reiter. Innerhalb von `<main>` griffe `position: fixed` nicht — der Transform auf
 * `.site-main-shell` bindet es an `<main>` statt ans Fenster.
 *
 * Unter `lg` steht die Aussparung nicht — oben rechts sitzt dort das Menue, und die Aktionen liegen
 * in der Leiste am unteren Rand (`MobileStickyCTA`).
 */

/**
 * Rollender Text beim Ueberfahren: zwei GLEICHE Zeilen, die zweite rollt von unten herein. Gleich,
 * damit die Beschriftung unter dem Mauszeiger lesbar bleibt (eingefuehrt fuer die Telefonnummer, die
 * man beim Zeigen abschreiben koennen sollte).
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
      {/* KNOPF statt Link auf `#contact-termin`: Der Dialog faengt solche Links ab und leitet sie auf
          Reparaturseiten zur Schadenmeldung um (R8, `TERMIN_UEBERSCHREIBUNG`). Diese Pille meint aber
          ueberall die Aufbereitung — `oeffnen('termin')` geht an der Umleitung vorbei. Die Leistung
          waehlt der Dialog wie gewohnt aus der Seite vor (auf `/innenaufbereitung-leipzig` die
          Innenaufbereitung), sonst bleibt sie offen. Symbol wie „Termin“ in der mobilen Leiste. */}
      <button
        type="button"
        onClick={() => oeffnen('termin')}
        className="cc-aktion cc-aktion--aufbereitung cc-aktion--hell"
        aria-label="Aufbereitung anfragen: Formular für Ihren Wunschtermin öffnen"
      >
        <span className="cc-aktion__symbol" aria-hidden="true">
          <CalendarClock className="cc-aktion__kalender" size={14} strokeWidth={2.4} />
        </span>
        <Rolle text="Aufbereitung anfragen" />
      </button>

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
      <span className="cc-aktion-hinweis cc-aktion-hinweis--aufbereitung" aria-hidden="true">
        Formular für Ihren Wunschtermin
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
