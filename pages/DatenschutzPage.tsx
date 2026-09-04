import React from 'react';
import { PageHero, PageMeta } from '../components/PageBlocks';

/**
 * Datenschutzerklaerung — GERUEST, noch ohne Erklaerungstext.
 *
 * WARUM HIER KEIN TEXT STEHT: Die Altseite fuehrt eine Datenschutzerklaerung von 2020
 * (rund 23.000 Zeichen). Sie wird bewusst WEDER uebernommen NOCH verlinkt. Sie
 * beschreibt einen anderen Hoster, nennt Matomo als eingesetztes Analysewerkzeug und
 * kennt die vier Formulare dieser Seite nicht. Sie zu verlinken hiesse, denselben
 * Fehler zu wiederholen, den der Matomo-Satz im Footer gemacht hat: einen fremden Text
 * als Aussage ueber das eigene System auszugeben.
 *
 * WAS STATTDESSEN PASSIERT: Der technische Stand ist gemessen und liegt als Faktenblatt
 * fuer den Datenschutzbeauftragten des Kunden bereit
 * (`docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`). Er formuliert die
 * Erklaerung, sie ersetzt dieses Geruest. Backlog 3.34.
 *
 * NOINDEX UND NICHT IN DER SITEMAP: Ein Geruest gehoert nicht in den Suchindex.
 * Ausgeliefert wird die Seite trotzdem statisch (`scripts/routes.mjs`, `sitemap: false`),
 * damit die Route existiert und kein Footer-Link mehr ins Leere zeigt.
 *
 * KEINE RECHTSPFLICHT VERLETZT, SOLANGE DIE SEITE NICHT OEFFENTLICH IST: Oeffentlich
 * erreichbar ist weiterhin die Altseite unter der Kundendomain. Dies hier ist ein
 * Vorbereitungsstand. Vor dem Livegang muss die Erklaerung stehen — deshalb der
 * Vermerk im Backlog, nicht nur ein TODO im Code.
 */

/** Themen, die die fertige Erklaerung abdecken muss — abgeleitet aus dem GEMESSENEN
 *  Stand der Seite, nicht aus einer Vorlage. Reihenfolge wie im Faktenblatt. */
const THEMEN = [
  'Verantwortliche Stelle und Kontakt zum Datenschutzbeauftragten',
  'Hosting und Server-Logdateien',
  'Kontakt- und Anfrageformulare',
  'Bewerbungen und übermittelte Unterlagen',
  'Funktionale Speicherung im Browser',
  'Ihre Rechte und die zuständige Aufsichtsbehörde',
];

const DatenschutzPage: React.FC = () => (
  <>
    <PageMeta
      noindex
      canonical="/datenschutz"
      title="Datenschutzerklärung | CarCare Center Leipzig"
      description="Datenschutzerklärung der BS CarCare GmbH Leipzig. Die vollständige Fassung wird derzeit erstellt."
    />
    <PageHero
      eyebrow="Datenschutz"
      title="Datenschutzerklärung"
      description="Die vollständige Datenschutzerklärung für diese Website wird derzeit erstellt. Verantwortliche Stelle und Kontaktweg stehen hier bereits."
    />

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-3xl">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
          <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            In Vorbereitung
          </span>
          <p className="text-base leading-relaxed text-gray-950">
            Diese Website wird derzeit neu aufgebaut. Die Datenschutzerklärung wird dafür neu
            erstellt und nicht aus dem alten Auftritt übernommen — der beschreibt eine andere
            technische Grundlage.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Bis sie vorliegt, erreichen Sie uns für alle Fragen zum Datenschutz direkt über die
            unten genannte verantwortliche Stelle. Sie erhalten dieselben Auskünfte, die Ihnen
            nach der Datenschutz-Grundverordnung zustehen.
          </p>
        </div>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
            Verantwortliche Stelle
          </h2>
          <p className="text-base leading-relaxed text-gray-950">
            BS CarCare GmbH
            <br />
            An den Tierkliniken 42
            <br />
            04103 Leipzig
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            <a className="font-semibold text-blue-600 underline" href="mailto:info@carcare-center.de">
              info@carcare-center.de
            </a>
            {' · '}
            <a className="font-semibold text-blue-600 underline" href="/impressum">
              Impressum
            </a>
          </p>
        </section>

        <section className="mt-14">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">
            Was die vollständige Fassung behandeln wird
          </h2>
          <ul className="space-y-3">
            {THEMEN.map((thema) => (
              <li key={thema} className="flex gap-3 text-base leading-relaxed text-gray-600">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {thema}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  </>
);

export default DatenschutzPage;
