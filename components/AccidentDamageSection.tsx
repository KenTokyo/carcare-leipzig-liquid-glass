import React from 'react';
import { AlertTriangle, Phone } from 'lucide-react';
import ScrollPinnedProcess, { type ProcessStepCard } from './ScrollPinnedProcess';

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
      'Melden Sie Ihren Unfallschaden online über unser Formular – mit Fahrzeugdaten, Schadenart, Fotos und Angaben zur Versicherung. Telefonisch geht es genauso.',
    image: kachel('schaden-melden-leipzig-carcare'),
    imageAlt:
      'Autofahrerin meldet ihren Unfallschaden unterwegs per Smartphone über das Online-Schadenformular von CarCare Leipzig – im Hintergrund das beschädigte Fahrzeug.',
    cta: { label: 'Schaden melden', href: '/kontakt#contact-schaden' },
  },
  {
    n: '02',
    title: 'Schadenaufnahme',
    description:
      'Wir erfassen den Schaden – vor Ort oder anhand Ihrer Fotos – und dokumentieren Umfang und Hergang für die weitere Bearbeitung.',
    image: kachel('schadenaufnahme-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiter nimmt gemeinsam mit einer Kundin den Unfallschaden an einem gelben Sportwagen auf und dokumentiert ihn per Tablet.',
  },
  {
    n: '03',
    title: 'Gutachten & Kalkulation',
    description:
      'Auf Wunsch stimmen wir uns mit einem Gutachter ab und erstellen eine nachvollziehbare Kostenkalkulation für die Reparatur.',
    image: kachel('kalkulation-leipzig-carcare'),
    imageAlt:
      'Kundin unterschreibt am Empfangstresen den Kostenvoranschlag, während der CarCare-Berater die Kalkulation auf dem Tablet erläutert.',
  },
  {
    n: '04',
    title: 'Versicherungsabwicklung',
    description:
      'Wir übernehmen die Kommunikation mit Ihrer Versicherung und kümmern uns um den Schriftverkehr rund um den Schadenfall.',
    image: kachel('versicherungsabwicklung-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiterin klärt am Telefon mit Tablet und Unterlagen die Versicherungsabwicklung eines Schadenfalls.',
  },
  {
    n: '05',
    title: 'Ersatzwagen nach Verfügbarkeit',
    description:
      'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit einen Ersatzwagen für die Dauer der Reparatur.',
    image: kachel('ersatzwagen-leipzig-carcare'),
    imageAlt:
      'CarCare-Mitarbeiter übergibt einer Kundin vor der Werkstatt den Schlüssel für einen Ersatzwagen.',
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
      { label: 'Schaden jetzt melden', href: '/kontakt#contact-schaden' },
      { label: 'Direkt anrufen', href: 'tel:+493412617790', icon: <Phone size={16} /> },
    ]}
  />
);

export default AccidentDamageSection;
