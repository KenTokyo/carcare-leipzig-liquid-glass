import type { TimelineStation } from '../components/Timeline';

/**
 * Stationen des Zeitstrahls auf `/ueber-uns` (Backlog 1.27).
 *
 * EIGENE DATENQUELLE, NICHT IN DER SEITE. Zwei Gruende:
 *  1. Dieselbe Regel wie bei `services`, `faqs`, `jobs` — Inhalte, die der Kunde
 *     nachliefert, stehen an einer Stelle und nicht mitten in einer Komponente.
 *  2. Der Dummy-Waechter (`scripts/check-dummies.mjs`) LAEDT diese Datei und liest
 *     `istPlatzhalter` als echten Wert aus. Aus `pages/UeberUnsPage.tsx` ginge das
 *     nicht: Die Seite zieht React und ein halbes Dutzend Komponenten mit.
 *
 * ANFANG UND ENDE STEHEN, DIE MITTE FEHLT. Gruendung 1998 und der heutige Stand sind
 * belegt; was dazwischen liegt, ist Zulieferung von Andre (Backlog 1.27). Die drei
 * Platzhalter tragen BEWUSST KEIN JAHR — ein Zeitstrahl mit erfundenen Jahreszahlen
 * waere schlimmer als eine sichtbare Luecke, weil eine Jahreszahl wie eine gepruefte
 * Angabe aussieht.
 *
 * ⚠️ WER EINEN PLATZHALTER ERSETZT, ENTFERNT `istPlatzhalter`. Sonst bricht der Build
 * auf Vercel. Das ist Absicht: Ein umbenannter Platzhalter bleibt ein Platzhalter, und
 * genau den findet beim Review niemand.
 *
 * DIE BEIDEN BISHERIGEN TEXTE SIND NICHT VERLOREN. Sie standen frueher als undatierte
 * Phasen auf der Seite und sind Kandidaten fuer die Meilenstein-Plaetze:
 *
 *   „Ausbau zum Full-Service-Betrieb" — Karosserie, Smart Repair, Dellenentfernung,
 *   Felgen und Autoglas kommen zur Lackierung hinzu, damit ein Fahrzeug den Betrieb
 *   fuer keinen Arbeitsschritt verlassen muss.
 *
 *   „Aufbereitung als eigener Bereich" — die Fahrzeugaufbereitung waechst vom Zusatz
 *   zur eigenstaendigen Leistung mit festen Paketen, Desinfektionsverfahren und
 *   Leasingrueckgabe-Vorbereitung.
 *
 * Beide beschreiben zutreffend, WAS passiert ist, aber nicht WANN. Sobald die
 * Jahreszahlen vorliegen, werden daraus zwei echte Stationen.
 */
export const historie: TimelineStation[] = [
  {
    zeit: '1998',
    title: 'Gründung in Leipzig',
    description:
      'Start als Betrieb des Kfz-Lackierhandwerks. Der Meisterbrief ist von Anfang an die fachliche Grundlage.',
  },
  {
    title: 'Meilenstein 1',
    description: 'Platzhalter — wird durch die abgestimmte Station ersetzt.',
    istPlatzhalter: true,
  },
  {
    title: 'Meilenstein 2',
    description: 'Platzhalter — wird durch die abgestimmte Station ersetzt.',
    istPlatzhalter: true,
  },
  {
    title: 'Meilenstein 3',
    description: 'Platzhalter — wird durch die abgestimmte Station ersetzt.',
    istPlatzhalter: true,
  },
  {
    zeit: 'Heute',
    title: 'Über 3.000 m² in Leipzig',
    description:
      'Über 50 Mitarbeiter betreuen Privatkunden, Autohäuser, Fuhrparks, Versicherungen und Werksniederlassungen deutscher Premiumhersteller.',
  },
];
