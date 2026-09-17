import type { TimelineStation } from '../components/Timeline';

/**
 * Stationen des Zeitstrahls auf `/ueber-uns` (Backlog R1, Inhalte aus Schleife 4).
 *
 * EIGENE DATENQUELLE, NICHT IN DER SEITE. Zwei Gruende:
 *  1. Dieselbe Regel wie bei `services`, `faqs`, `jobs` — Inhalte, die der Kunde
 *     nachliefert, stehen an einer Stelle und nicht mitten in einer Komponente.
 *  2. Der Dummy-Waechter (`scripts/check-dummies.mjs`) LAEDT diese Datei und liest
 *     `istPlatzhalter` als echten Wert aus. Aus `pages/UeberUnsPage.tsx` ginge das
 *     nicht: Die Seite zieht React und ein halbes Dutzend Komponenten mit.
 *
 * STAND 2026-09-14: Die Chronik hat Andre am 2026-09-10 geliefert (Schleife 4, 4.16–4.20).
 * Wortlaut der Stationen 1998, 2000, 2013 und 2026 unveraendert aus seiner Liste; die
 * kurzen Titel sind daraus abgeleitet.
 *
 *   Meilenstein 2 (2013) — am 2026-09-14 eingesetzt (4.18). Er war ALLEIN durch die
 *     Flaechenfrage blockiert: Sein Text nennt „über 3.500 m²", die Seite sagte damals
 *     ueberall 3.000. Mit der Entscheidung zu 4.2 (Textregel 4, ebenfalls 2026-09-14 auf
 *     3.500 umgestellt) ist der Widerspruch weg.
 *   Meilenstein 3 — bleibt Platzhalter. Text liegt vor (4.19), das JAHR fehlt. Ein
 *     geratenes Jahr sieht aus wie eine gepruefte Angabe.
 *
 * ⚠️ WER EINEN PLATZHALTER ERSETZT, ENTFERNT `istPlatzhalter` — und den Titel aus der
 * `ANERKANNT`-Liste von `scripts/check-dummies.mjs`. Sonst bricht der Build. Das ist
 * Absicht: Ein umbenannter Platzhalter bleibt ein Platzhalter, und genau den findet beim
 * Review niemand.
 *
 * Die frueheren Kandidatentexte („Ausbau zum Full-Service-Betrieb", „Aufbereitung als
 * eigener Bereich") sind durch die Chronik des Kunden ueberholt. Sie hatten ausserdem die
 * Reihenfolge verdreht: Der Betrieb begann 1998 als AUFBEREITUNGSbetrieb (4.16), nicht als
 * Lackiererei — deshalb auch die neue Ueberschrift der Sektion (4.15).
 */
export const historie: TimelineStation[] = [
  {
    zeit: '1998',
    title: 'Gründung in Leipzig',
    // Backlog 4.16, Wortlaut des Kunden. Er ersetzt „Start als Betrieb des Kfz-Lackierhandwerks.
    // Der Meisterbrief ist von Anfang an die fachliche Grundlage." — siehe offene Frage R13.
    description:
      'Start als Kfz-Aufbereitungsbetrieb und Anbieter/Dienstleister für Premiumhersteller in Leipzig und im gesamten Bundesgebiet – von Anfang an fachliche Grundlage.',
  },
  {
    zeit: '2000',
    title: 'Spot- und Smart-Repair',
    // Backlog 4.17, Wortlaut des Kunden.
    description: 'Erweiterung um das Geschäftsfeld Spot- und Smart-Repair.',
  },
  {
    zeit: '2013',
    title: 'Umzug auf über 3.500 m²',
    // Backlog 4.18, Wortlaut des Kunden. Entsperrt durch die Entscheidung zu 4.2.
    description:
      'Umzug in ein neues Objekt auf über 3.500 m² Fläche mit modernster Ausstattung. Erweiterung des Portfolios um Komplettreparatur, Neuteillackierung und gesamte Karosserieinstandsetzung sowie komplett neue Arbeitsbereiche.',
  },
  {
    title: 'Meilenstein 3',
    description: 'Platzhalter — wird durch die abgestimmte Station ersetzt.',
    istPlatzhalter: true,
  },
  {
    zeit: '2026',
    title: 'Vollständig digital',
    // Backlog 4.20, Wortlaut des Kunden. Passt zu 1.16 (volldigitale Abwicklung ueber Data Motive).
    description: 'Vollständige Digitalisierung aller Geschäftsprozesse.',
  },
  {
    zeit: 'Heute',
    title: 'Über 3.500 m² in Leipzig',
    description:
      'Über 50 Mitarbeiter betreuen Privatkunden, Autohäuser, Fuhrparks, Versicherungen und Werksniederlassungen deutscher Premiumhersteller.',
  },
];
