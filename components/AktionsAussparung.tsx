import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import { useAnfrageDialog } from './AnfrageDialog';
import { SCHADENMELDUNG_EXTERN, SCHADENMELDUNG_URL } from '../data/schadenmeldung';
import { ExternMarke, externAttribute } from './ExternerLink';

/**
 * „Anrufen" und „Schaden melden" in einer weissen Aussparung oben rechts — ab `lg` (1024 px),
 * sofort und dauerhaft sichtbar. Wunsch des Users vom 2026-09-24 (zweite Runde): „direkt
 * ersichtlich … immer rechts oben … in einem weissen Punchhole-Design mit den selben Rundungen".
 * Form und Reiterbreite der Navbar: `styles/aussparung.css`.
 *
 * ERSETZT `SchwebendeAktionen` (erste Runde am selben Tag: zwei Kreise unten rechts, die ueber dem
 * Hero und dem Zielgruppenstapel auswichen — dadurch erst nach dem Hero zu sehen). Mit der Ecke
 * oben rechts entfaellt das Ausweichen: Die Aussparung liegt im 100-px-Band der Navbar, in dem
 * ohnehin kein Inhalt steht; die KI-Plakette des Heros beginnt darunter (gemessen y 125).
 *
 * WARUM IM SEITENRAHMEN (`Layout`, `.solidroad-shell-frame-container`): Dort liegt auch der
 * Navbar-Reiter. Innerhalb von `<main>` griffe `position: fixed` nicht — der Transform auf
 * `.site-main-shell` bindet es an `<main>` statt ans Fenster.
 *
 * KEINE AUFKLAPPENDE BESCHRIFTUNG wie frueher in der Navbar: Die Aussparung haengt fest in der
 * Ecke, ein aufklappender Knopf liesse sie nach links in den Navbar-Reiter wachsen (bei 1280 px
 * liegen nur rund 20 px zwischen beiden). Stattdessen ein Hinweis UNTER dem Knopf beim Ueberfahren
 * oder Fokussieren — beim Telefon mit der Nummer: Am Desktop fuehrt `tel:` ohne verknuepfte
 * Telefon-App oft ins Leere, dann ist die Nummer das, was man braucht.
 *
 * Unter `lg` steht die Aussparung nicht — oben rechts sitzt dort das Menue, und die Aktionen liegen
 * in der Leiste am unteren Rand (`MobileStickyCTA`).
 */

/**
 * Knopf im Stil der frueheren Navbar-Aktionen (44 px, Radius 20 px, Verlauf der CTAs).
 *
 * ⚠️ `z-[1]` IST NICHT KOSMETISCH. Der konkave Uebergang rechts unten (`::after` in
 * styles/aussparung.css) malt seinen weissen Schatten 80 px nach oben — bis mitten in die Aussparung.
 * Als letztes Kind liegt `::after` ueber allem, was keinen z-Index hat: Der rechte Knopf war dadurch
 * um rund 15 px angeschnitten (gesehen 2026-09-24 im Bild von `npm run nav`, 1440 px). In der Navbar
 * tritt das nicht auf, weil ihr Inhalt auf einer eigenen Ebene ueber dem Reiter liegt.
 */
const KNOPF =
  'cc-gradient-button group relative z-[1] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] border text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cc-ice-blue)]';

/**
 * Hinweis unter dem Knopf. Rechtsbuendig am Knopf verankert, damit er nie ueber den rechten
 * Fensterrand hinauslaeuft. Nur Anzeige (`aria-hidden`) — die Ansage traegt `aria-label`.
 */
const HINWEIS =
  'pointer-events-none absolute right-0 top-[calc(100%+0.7rem)] whitespace-nowrap rounded-lg bg-[var(--cc-carbon)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100';

const AktionsAussparung: React.FC = () => {
  const { oeffnen } = useAnfrageDialog();

  return (
    <div
      role="group"
      aria-label="Schnellkontakt"
      // Fester Haken fuer `npm run aussparung` — Klassen aendern sich, der Name nicht.
      data-aktions-aussparung=""
      className="cc-aussparung hidden lg:flex print:hidden"
    >
      <a href="tel:+493412617790" className={KNOPF} aria-label="CarCare Center anrufen: 0341 - 261 77 90">
        <Phone size={16} strokeWidth={2.4} aria-hidden="true" />
        <span aria-hidden="true" className={HINWEIS}>
          Anrufen · 0341 - 261 77 90
        </span>
      </a>
      {/* Wie in `MobileStickyCTA`: seit 2026-09-16 ein Link zur Schadenseite auf reparatur.info
          (Backlog 2.23). Mit dem Schalter in `data/schadenmeldung.ts` wieder das eigene Formular. */}
      {SCHADENMELDUNG_EXTERN ? (
        <a
          href={SCHADENMELDUNG_URL}
          {...externAttribute(SCHADENMELDUNG_URL)}
          className={KNOPF}
          aria-label="Schaden melden (öffnet in einem neuen Tab)"
        >
          <AlertTriangle size={16} strokeWidth={2.4} aria-hidden="true" />
          <span aria-hidden="true" className={`${HINWEIS} inline-flex items-center gap-1`}>
            Schaden melden
            <ExternMarke href={SCHADENMELDUNG_URL} groesse={12} />
          </span>
        </a>
      ) : (
        <button type="button" onClick={() => oeffnen('schaden')} className={KNOPF} aria-label="Schaden melden">
          <AlertTriangle size={16} strokeWidth={2.4} aria-hidden="true" />
          <span aria-hidden="true" className={HINWEIS}>
            Schaden melden
          </span>
        </button>
      )}
    </div>
  );
};

export default AktionsAussparung;
