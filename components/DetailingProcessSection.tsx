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

// ⚠️ TEILWEISE NOCH INTERIM-FOTOS: Schritt 04 zeigt seit 2026-09-21 ein echtes Foto (B34), Schritte 02, 03 und 05 seit
// 2026-10-14 eigene Motive (User), Schritt 01 eine vorhandene Kachel — bewusst FUENF UNTERSCHIEDLICHE, denn Karten- und
// Hintergrund-Crossfade leben vom Bildwechsel. Beim Tausch bitte `image` UND `imageAlt` gemeinsam
// aktualisieren (der Alt-Text beschreibt jeweils das tatsaechlich gezeigte Motiv, SEO §3.3).
// REIHENFOLGE = Reihenfolge von `detailingSteps`: Eintrag i gehoert zu Schritt i.
const bilder: Array<Pick<ProcessStepCard, 'image' | 'imageAlt' | 'cta'>> = [
  {
    image: kachel('fahrzeugaufbereitung-leipzig-carcare'),
    imageAlt: 'Fahrzeugaufbereitung im CarCare Center Leipzig: Ein Fahrzeug wird fachgerecht gepflegt.',
  },
  {
    // Seit 2026-10-14 (User) das echte Bürofoto der Karriere-Karte „Serviceberater“ (B32; dort B106, bleibt), hier als
    // eigener Ausschnitt mit dem Laptop oben, damit er über dem Textkasten der Karte steht (`scripts/lib/fotos-liste.mjs`).
    image: kachel('terminanfrage-buero-laptop-leipzig-carcare'),
    imageAlt:
      'Unsere Mitarbeiterin am Laptop in unserem Büro in Leipzig, auf dem Bildschirm unsere Website.',
    cta: { label: 'Termin anfragen', href: '#contact-termin' },
  },
  {
    // Seit 2026-10-14 (User) das Empfangsfoto, das bis dahin Schritt 02 zeigte (B33, wie B24 und B75). Das fruehere
    // Motiv `fahrzeugabgabe-…` stand nur hier und liegt jetzt in `docs/bilder/archiv/`.
    image: kachel('kundenempfang-schluesseluebergabe-leipzig-carcare'),
    imageAlt:
      'Kunde übergibt am Empfangstresen des CarCare Center Leipzig seinen Fahrzeugschlüssel an unsere Mitarbeiterin.',
  },
  {
    // Seit 2026-09-21 echtes Foto (B34, nur diese Stelle).
    image: kachel('aufbereitung-aktiv-leipzig-carcare'),
    imageAlt: 'Unser Mitarbeiter reinigt kniend die Scheibe der geöffneten Fahrertür eines kupferfarbenen SUV in unserer Aufbereitungshalle in Leipzig.',
  },
  {
    // Seit 2026-10-14 (User) eigenes Rueckgabefoto NUR hier (B35). `leasingrueckgabe-…` bleibt an B17, B59 und B129.
    image: kachel('fahrzeugrueckgabe-kundenannahme-leipzig-carcare'),
    imageAlt:
      'Unsere Mitarbeiterin übergibt einem Kunden vor unserer Kundenannahme in Leipzig den Fahrzeugschlüssel.',
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
    // Backlog 6.8: Care an allem zur Aufbereitung.
    bereich="care"
    heading="Fahrzeug aufbereiten lassen? Wir übernehmen Innenraum, Lack und Werterhalt bis zur Übergabe."
    intro="Von der Leistungsauswahl bis zur gepflegten Übergabe in fünf klaren Schritten, aus einer Hand."
    steps={steps}
    ctas={[
      { label: 'Termin anfragen', href: '#contact-termin' },
      { label: 'Direkt anrufen', href: 'tel:+493412617790', icon: <Phone size={16} /> },
    ]}
  />
);

export default DetailingProcessSection;
