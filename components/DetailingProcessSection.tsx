import React from 'react';
import { Phone, Sparkles } from 'lucide-react';
import ScrollPinnedProcess, { type ProcessStepCard } from './ScrollPinnedProcess';

/**
 * Ablauf der Autoaufbereitung — seit 2026-07-22 als eigene, scroll-gepinnte Sektion im
 * exakt gleichen Aufbau wie „Unfall & Schaden Leipzig". Beide nutzen dieselbe Komponente
 * `ScrollPinnedProcess`, deshalb sind Layout, Scroll-Animation, Karten-Crossfade,
 * Fortschritts-Dots und Full-Bleed-Hintergrund garantiert identisch.
 *
 * Inhalt stammt 1:1 aus der frueheren Sektion „Prozess" (Tab „Autoaufbereitung") — mit der
 * Geschaeftsfuehrung abgestimmter Wortlaut, deshalb unveraendert uebernommen.
 * Die volle Tiefe bleibt auf /fahrzeugaufbereitung-leipzig.
 */

/** Kachel-Foto je Schritt — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

// ⚠️ INTERIM-FOTOS: Bis die finalen Motive vom Kunden kommen, sind vorhandene CarCare-Kacheln
// eingesetzt — bewusst FUENF UNTERSCHIEDLICHE, denn Karten- und Hintergrund-Crossfade leben vom
// Bildwechsel. Beim Tausch bitte `image` UND `imageAlt` gemeinsam aktualisieren (der Alt-Text
// beschreibt jeweils das tatsaechlich gezeigte Motiv, SEO §3.3).
const steps: ProcessStepCard[] = [
  {
    n: '01',
    title: 'Leistung auswählen',
    description: 'Passendes Paket oder individuelle Aufbereitung wählen.',
    image: kachel('fahrzeugaufbereitung-leipzig-carcare'),
    imageAlt: 'Fahrzeugaufbereitung bei CarCare Leipzig: Ein Fahrzeug wird fachgerecht gepflegt.',
  },
  {
    n: '02',
    title: 'Termin anfragen',
    description: 'Wunschtermin online oder telefonisch übermitteln.',
    image: kachel('privatkunden-leipzig-carcare'),
    imageAlt:
      'Kunde bespricht am Empfangstresen von CarCare Leipzig den Wunschtermin für die Fahrzeugaufbereitung.',
    cta: { label: 'Termin anfragen', href: '#contact-termin' },
  },
  {
    n: '03',
    title: 'Fahrzeug abgeben',
    description: 'Persönliche Übergabe mit kurzer Beratung vor Ort.',
    image: kachel('ersatzwagen-leipzig-carcare'),
    imageAlt: 'Fahrzeugschlüssel wird vor der Werkstatt von CarCare Leipzig persönlich übergeben.',
  },
  {
    n: '04',
    title: 'Professionelle Aufbereitung',
    description: 'Innen, außen, Lack und Details nach CarCare-Standard.',
    image: kachel('autolackierung-leipzig-carcare'),
    imageAlt: 'Lack- und Oberflächenbearbeitung in der CarCare-Werkstatt in Leipzig.',
  },
  {
    n: '05',
    title: 'Gepflegt zurückerhalten',
    description: 'Sichtbar aufgewertet und bereit für Alltag oder Rückgabe.',
    image: kachel('leasingrueckgabe-leipzig-carcare'),
    imageAlt: 'Gepflegtes Fahrzeug nach der Aufbereitung bei CarCare Leipzig.',
  },
];

const DetailingProcessSection: React.FC = () => (
  <ScrollPinnedProcess
    id="autoaufbereitung-ablauf"
    headingId="detailing-process-heading"
    badgeIcon={<Sparkles size={15} />}
    badgeLabel="Autoaufbereitung Leipzig"
    heading="Fahrzeug aufbereiten lassen? Wir übernehmen Innenraum, Lack und Werterhalt bis zur Übergabe."
    intro="Von der Leistungsauswahl bis zur gepflegten Übergabe – in fünf klaren Schritten, aus einer Hand."
    steps={steps}
    ctas={[
      { label: 'Termin anfragen', href: '#contact-termin' },
      { label: 'Direkt anrufen', href: 'tel:+493412617790', icon: <Phone size={16} /> },
    ]}
  />
);

export default DetailingProcessSection;
