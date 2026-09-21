import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import ScrollPinnedProcess, { type ProcessStepCard } from './ScrollPinnedProcess';
import { SCHADEN_ZIEL } from '../data/schadenmeldung';

/**
 * Schadenreise „Unfall & Schaden Leipzig".
 *
 * Die komplette Mechanik (Sticky-Pin, Scroll-Progress, Karten-Crossfade, Fortschritts-Dots,
 * Full-Bleed-Hintergrund) liegt seit 2026-07-22 in `ScrollPinnedProcess` — geteilt mit der
 * Autoaufbereitungs-Sektion, damit beide garantiert identisch aussehen und sich identisch
 * verhalten. Hier stehen nur noch die Inhalte.
 */

/** Kachel-Foto je Schritt — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

// 5 Schritte der Schadenreise (Titel + kurze, konkrete Erklaerung, Sie-Ansprache).
// Jeder Schritt traegt sein eigenes Foto (Motiv passend zum Schrittnamen) + Alt-Text.
// Schritt 01 ist der Einstieg (Online-Meldung) und traegt als einziger einen Karten-CTA.
const steps: ProcessStepCard[] = [
  {
    n: '01',
    title: 'Schaden melden',
    description:
      'Melden Sie Ihren Unfallschaden online über unsere Schadenseite auf reparatur.info – mit Schadendaten und Fotos. Telefonisch geht es genauso.',
    image: kachel('schaden-melden-leipzig-carcare'),
    imageAlt:
      'Autofahrerin meldet ihren Unfallschaden unterwegs per Smartphone über die Online-Schadenseite des CarCare Center Leipzig – im Hintergrund das beschädigte Fahrzeug.',
    // Seit 2026-09-16: Schadenseite auf reparatur.info (Backlog 2.23), Ziel aus EINER Quelle.
    cta: { label: 'Schaden melden', href: SCHADEN_ZIEL },
  },
  {
    n: '02',
    title: 'Schadenaufnahme',
    description:
      'Wir erfassen den Schaden – vor Ort oder anhand Ihrer Fotos – und dokumentieren Umfang und Hergang für die weitere Bearbeitung.',
    // Seit 2026-09-21 das fruehere Motiv der Unfall-Kachel (B10), auf Wunsch des Users hierher
    // versetzt: ruhiger als das vorige Bild mit Kundin und gelbem Sportwagen (Backlog 3.8).
    // Gilt bis zur Klaerung als KI-generiert (`data/bildherkunft.ts`) — der Text beschreibt
    // deshalb das Bild, ohne es als unsere Werkstatt auszugeben.
    image: kachel('versicherung-schadenabwicklung-leipzig-carcare'),
    imageAlt:
      'Mitarbeiter mit Tablet dokumentiert den Heckschaden an einem silbernen Elektro-Sportwagen.',
  },
  {
    n: '03',
    title: 'Gutachten & Kalkulation',
    description:
      'Auf Wunsch stimmen wir uns mit einem Gutachter ab und erstellen eine nachvollziehbare Kostenkalkulation für die Reparatur.',
    image: kachel('kalkulation-leipzig-carcare'),
    imageAlt:
      'Kundin unterschreibt am Empfangstresen den Kostenvoranschlag, während unser Berater die Kalkulation auf dem Tablet erläutert.',
  },
  {
    n: '04',
    title: 'Versicherungsabwicklung',
    description:
      'Wir übernehmen die Kommunikation mit Ihrer Versicherung und kümmern uns um den Schriftverkehr rund um den Schadenfall.',
    image: kachel('versicherungsabwicklung-leipzig-carcare'),
    imageAlt:
      'Unsere Mitarbeiterin klärt am Telefon mit Tablet und Unterlagen die Versicherungsabwicklung eines Schadenfalls.',
  },
  {
    n: '05',
    title: 'Ersatzwagen nach Verfügbarkeit',
    description:
      'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit einen Ersatzwagen für die Dauer der Reparatur.',
    // Seit 2026-09-21 unsere eigene Mietwagenflotte statt Symbolbild (Backlog 2.21/3.4, B23).
    // Das fruehere Motiv (Schluesseluebergabe) steht weiter bei „Fahrzeug abgeben" als
    // `fahrzeugabgabe-leipzig-carcare.webp`.
    image: kachel('ersatzwagen-leipzig-carcare'),
    imageAlt:
      'Unsere Ersatzwagen: eine Reihe weißer Kleinwagen mit der Beschriftung des CarCare Center vor unserer Werkstatt in Leipzig.',
  },
];

const AccidentDamageSection: React.FC = () => (
  <ScrollPinnedProcess
    id="unfall-schaden"
    headingId="accident-heading"
    badgeIcon={<AlertTriangle size={15} />}
    badgeLabel="Unfall & Schaden Leipzig"
    heading="Unfallschaden? Wir übernehmen Reparatur, Gutachten und Abstimmung mit der Versicherung."
    intro="Von der Schadenmeldung bis zum Ersatzwagen – in fünf klaren Schritten, aus einer Hand."
    steps={steps}
    ctas={[
      { label: 'Schaden jetzt melden', href: SCHADEN_ZIEL },
      { label: 'Direkt anrufen', href: 'tel:+493412617790', icon: <Phone size={16} /> },
    ]}
  />
);

export default AccidentDamageSection;
