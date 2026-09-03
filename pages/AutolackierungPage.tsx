import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

const scope = [
  { title: 'Spot-Repair', description: 'Die möglichst perfekte Lackinstandsetzung mit geringem Aufwand – unsere bevorzugte Reparaturmethode.' },
  { title: 'Komplettlackierung', description: 'Wenn Spot-Repair nicht ausreicht, lackieren wir das Bauteil unter modernen Bedingungen mit bestmöglichem Ergebnis.' },
  { title: 'Stoßfänger lackieren', description: 'Fachgerechte Lackierung beschädigter Stoßfänger inklusive farblicher Angleichung.' },
  { title: 'Motorhaube lackieren', description: 'Lackinstandsetzung der Motorhaube bei Kratzern, Steinschlägen oder Lackschäden.' },
  { title: 'Radlauf lackieren', description: 'Lackierung beschädigter Radläufe für ein einheitliches Erscheinungsbild.' },
  { title: 'Farbtongenaue Angleichung', description: 'Ziel ist, dass weder Farbton noch Effektunterschiede zur Originallackierung erkennbar sind.' },
];

const usp = [
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue, makellose Reparaturen mit langlebigem Premium-Finish und umweltschonenden Wasserbasislacken.' },
  { title: 'Meisterbetrieb seit 1998', description: 'Meisterbetrieb des Kfz-Lackierhandwerks, am Markt seit 1998.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
];

const AutolackierungPage: React.FC = () => (
  <ServiceLayout
    route="/autolackierung-leipzig"
    meta={{
      title: 'Neu- & Reparaturlackierung Leipzig | CarCare Center',
      description:
        'Neu- und Reparaturlackierung in Leipzig: Unser Ziel ist die unsichtbare Reparatur – weder Farbton noch Effektunterschiede zur Originallackierung. Spot-Repair bevorzugt.',
    }}
    hero={{
      eyebrow: 'Neu- und Reparaturlackierung Leipzig',
      title: 'Neu- und Reparaturlackierung in Leipzig.',
      description:
        'Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind. Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges.',
      primaryCta: { label: 'Lackierung anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Autolackierung Leipzig', 'Reparaturlackierung Leipzig', 'Spot-Repair Leipzig'],
    }}
    // TODO 1.15 — eigenstaendige Erklaerung der Leistung. Text steht noch aus; bis dahin
    // bleibt das Feld ausdruecklich leer statt mit Platzhaltertext gefuellt.
    erklaerung={null}
    leistung={{
      eyebrow: 'Leistungsumfang',
      title: 'Von Spot-Repair bis zur Komplettlackierung.',
      description:
        'Spot-Repair, die möglichst perfekte Lackinstandsetzung mit geringem Aufwand, ist unsere bevorzugte Reparaturmethode. Wo sie nicht ausreicht, folgt die Komplettlackierung des Bauteils.',
      items: scope,
    }}
    usp={{ title: 'Glasurit-Lackpartner und Meisterbetrieb – seit 1998.', items: usp }}
    faq={{ title: 'Häufige Fragen zur Lackierung.' }}
    cta={{
      title: 'Lackschaden in Leipzig? Wir beraten Sie zur unsichtbaren Reparatur.',
      description:
        'Beschreiben Sie Ihr Anliegen oder senden Sie Fotos – wir prüfen, ob Spot-Repair ausreicht oder eine Komplettlackierung sinnvoll ist.',
      primaryLabel: 'Lackierung anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default AutolackierungPage;
