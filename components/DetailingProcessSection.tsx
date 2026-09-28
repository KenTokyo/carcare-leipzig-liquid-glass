import React from 'react';
import { Phone, Sparkles } from 'lucide-react';
import ScrollPinnedProcess, { type ProcessStepCard } from './ScrollPinnedProcess';
import { detailingSteps } from '../data/detailing';

/**
 * Ablauf der Autoaufbereitung — seit 2026-07-22 als eigene, scroll-gepinnte Sektion im
 * exakt gleichen Aufbau wie „Unfall & Schaden Leipzig". Beide nutzen dieselbe Komponente
 * `ScrollPinnedProcess`, deshalb sind Layout, Scroll-Animation, Karten-Crossfade,
 * Fortschritts-Dots und Full-Bleed-Hintergrund garantiert identisch.
 *
 * TITEL UND TEXT KOMMEN AUS `detailingSteps` (data/detailing.ts) — derselben Quelle wie der
 * Ablauf auf /fahrzeugaufbereitung-leipzig. Bis 2026-09-27 stand hier eine Kopie des Wortlauts
 * (Backlog 5.18, Optimierung O5). Hier stehen nur noch die Bilder und der Karten-CTA.
 */

/** Kachel-Foto je Schritt — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

// ⚠️ TEILWEISE NOCH INTERIM-FOTOS: Schritt 04 zeigt seit 2026-09-21 ein echtes Foto (B34), die
// uebrigen sind vorhandene CarCare-Kacheln — bewusst FUENF UNTERSCHIEDLICHE, denn Karten- und
// Hintergrund-Crossfade leben vom Bildwechsel. Beim Tausch bitte `image` UND `imageAlt` gemeinsam
// aktualisieren (der Alt-Text beschreibt jeweils das tatsaechlich gezeigte Motiv, SEO §3.3).
// REIHENFOLGE = Reihenfolge von `detailingSteps`: Eintrag i gehoert zu Schritt i.
const bilder: Array<Pick<ProcessStepCard, 'image' | 'imageAlt' | 'cta'>> = [
  {
    image: kachel('fahrzeugaufbereitung-leipzig-carcare'),
    imageAlt: 'Fahrzeugaufbereitung im CarCare Center Leipzig: Ein Fahrzeug wird fachgerecht gepflegt.',
  },
  {
    image: kachel('privatkunden-leipzig-carcare'),
    imageAlt:
      'Kunde bespricht am Empfangstresen des CarCare Center Leipzig den Wunschtermin für die Fahrzeugaufbereitung.',
    cta: { label: 'Termin anfragen', href: '#contact-termin' },
  },
  {
    // Motiv unveraendert (vom Kunden als „in Ordnung" bestaetigt, B33). Die Datei hiess bis
    // 2026-09-21 `ersatzwagen-…`; der Name gehoert jetzt dem Foto unserer Mietwagenflotte (B23).
    image: kachel('fahrzeugabgabe-leipzig-carcare'),
    imageAlt: 'Fahrzeugschlüssel wird vor der Werkstatt des CarCare Center Leipzig persönlich übergeben.',
  },
  {
    // Seit 2026-09-21 echtes Foto (B34, nur diese Stelle).
    image: kachel('aufbereitung-aktiv-leipzig-carcare'),
    imageAlt: 'Unser Mitarbeiter reinigt kniend die Scheibe der geöffneten Fahrertür eines kupferfarbenen SUV in unserer Aufbereitungshalle in Leipzig.',
  },
  {
    image: kachel('leasingrueckgabe-leipzig-carcare'),
    imageAlt: 'Gepflegtes Fahrzeug nach der Aufbereitung im CarCare Center Leipzig.',
  },
];

// Laut statt still: Ein Schritt ohne Bild wuerde als leere Karte gepinnt stehen.
if (bilder.length !== detailingSteps.length) {
  throw new Error(`DetailingProcessSection: ${detailingSteps.length} Schritte, aber ${bilder.length} Bilder`);
}

const steps: ProcessStepCard[] = detailingSteps.map((schritt, i) => ({
  n: String(i + 1).padStart(2, '0'),
  ...schritt,
  ...bilder[i],
}));

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
