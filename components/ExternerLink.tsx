import React from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * Kennzeichnung externer Ziele — Schadenportal, Partner-Websites, Verbandsseite.
 *
 * WARUM EIN HELFER UND KEINE ZEILE JE STELLE: Seit 2026-09-16 fuehren „Schaden melden"
 * (reparatur.info) und die Partnerlogos nach aussen. Die Ziele laufen durch generische
 * Bausteine (`PageHero`, `PageCTA`, `FeatureGrid`, `ScrollPinnedProcess`, Mega-Menue), die
 * nicht wissen, ob ein `href` intern ist. Der Helfer entscheidet das am Ziel selbst — wer
 * einem dieser Bausteine eine `https://`-Adresse gibt, bekommt die Kennzeichnung mit.
 *
 * DREI DINGE PRO EXTERNEM LINK:
 *  1. `target="_blank"` — die Seite bleibt offen, wer zurueckkommt, steht noch am selben Ort.
 *  2. `rel="noopener noreferrer"` — `noopener` trennt den neuen Tab von diesem Fenster,
 *     `noreferrer` unterdrueckt den Referer. Das Ziel erfaehrt damit NICHT, von welcher
 *     Unterseite jemand kam. Datenschutzrechtlich ist das der Grund, weshalb ein reiner
 *     Partnerlink keinen Abschnitt in der Datenschutzerklaerung braucht — siehe
 *     `docs/preise-partner-schadenlink/tasks/`, Phase 6.
 *  3. Ansage fuer Vorlesegeraete und ein sichtbarer Pfeil — ein neuer Tab, der
 *     unangekuendigt aufgeht, ist fuer Screenreader-Nutzer ein Orientierungsverlust
 *     (WCAG-Technik G201).
 *
 * ⚠️ `AnfrageDialog` faengt Links mit `target="_blank"` bewusst NICHT ab. Das ist hier
 * Voraussetzung: Ein externer Link darf nie in den Dialog umgeleitet werden.
 */

/** `true` fuer `http(s)://…`. `tel:`, `mailto:`, `/pfad` und `#anker` sind intern. */
export const istExtern = (href?: string | null): boolean => Boolean(href && /^https?:\/\//i.test(href));

/** `target` und `rel` fuer externe Ziele, sonst nichts — zum Spreizen an `<a>`. */
export const externAttribute = (href?: string | null) =>
  istExtern(href) ? ({ target: '_blank', rel: 'noopener noreferrer' } as const) : {};

/**
 * Sichtbarer Pfeil plus Ansage „oeffnet in einem neuen Tab" — nur bei externem Ziel.
 * `pfeil={false}` dort, wo der Knopf schon ein Symbol traegt und kein Platz ist.
 */
export const ExternMarke: React.FC<{ href?: string | null; pfeil?: boolean; groesse?: number }> = ({
  href,
  pfeil = true,
  groesse = 14,
}) =>
  istExtern(href) ? (
    <>
      {pfeil && <ArrowUpRight aria-hidden="true" size={groesse} className="shrink-0" />}
      <span className="sr-only"> (öffnet in einem neuen Tab)</span>
    </>
  ) : null;
