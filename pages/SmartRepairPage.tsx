import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

const scope = [
  { title: 'Spot-Repair am Lack', description: 'Möglichst perfekte Lackinstandsetzung mit geringem Aufwand – unsere bevorzugte Methode bei kleineren Lackschäden.' },
  { title: 'Unsichtbare Reparatur', description: 'Ziel ist ein Ergebnis, bei dem weder Farbton noch Effektunterschiede zur Originallackierung erkennbar sind.' },
  { title: 'Lackfreie Dellenentfernung', description: 'Kleine Dellen bei intaktem Lack entfernen wir lackfrei – Details auf unserer Seite zur Dellenentfernung.', href: '/dellenentfernung-leipzig' },
  { title: 'Komplettlackierung bei Bedarf', description: 'Wo Spot-Repair nicht ausreicht, folgt die Komplettlackierung des Bauteils mit bestmöglichem Ergebnis.', href: '/autolackierung-leipzig' },
];

const usp = [
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue Lackinstandsetzung mit langlebigem Premium-Finish und umweltschonenden Wasserbasislacken.' },
  { title: 'Meisterbetrieb seit 1998', description: 'Meisterbetrieb des Kfz-Lackierhandwerks, am Markt seit 1998.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
];

const SmartRepairPage: React.FC = () => (
  <ServiceLayout
    route="/smart-repair-leipzig"
    meta={{
      title: 'Smart Repair Leipzig | Spot-Repair | CarCare Center',
      description:
        'Smart Repair in Leipzig: punktuelle Lackinstandsetzung mit geringem Aufwand. Ziel ist die unsichtbare Reparatur – kleine Schäden gezielt statt Komplettlackierung.',
    }}
    hero={{
      eyebrow: 'Smart Repair Leipzig',
      title: 'Smart Repair in Leipzig – punktuelle Reparatur mit geringem Aufwand.',
      description:
        'Bei kleineren Schäden ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand unsere bevorzugte Reparaturmethode. Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges – ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung.',
      primaryCta: { label: 'Smart Repair anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Smart Repair Leipzig', 'Spot-Repair Leipzig', 'kleine Lackschäden reparieren Leipzig'],
    }}
    // TODO 1.15 — eigenstaendige Erklaerung der Leistung. Text steht noch aus; bis dahin
    // bleibt das Feld ausdruecklich leer statt mit Platzhaltertext gefuellt.
    erklaerung={null}
    leistung={{
      eyebrow: 'Leistungsumfang',
      title: 'Kleine Schäden gezielt statt Komplettlackierung.',
      description:
        'Smart bzw. Spot-Repair bearbeitet nur den betroffenen Bereich. Reicht das nicht aus, folgt die Komplettlackierung – dazu beraten wir Sie ehrlich.',
      items: scope,
    }}
    usp={{ title: 'Glasurit-Lackpartner und Meisterbetrieb – seit 1998.', items: usp }}
    faq={{ title: 'Häufige Fragen zu Smart Repair.' }}
    cta={{
      title: 'Kleiner Schaden am Fahrzeug? Wir prüfen Smart Repair.',
      description:
        'Zeigen Sie uns den Schaden oder senden Sie Fotos – wir schätzen ein, ob eine punktuelle Reparatur mit geringem Aufwand der passende Weg ist.',
      primaryLabel: 'Smart Repair anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default SmartRepairPage;
