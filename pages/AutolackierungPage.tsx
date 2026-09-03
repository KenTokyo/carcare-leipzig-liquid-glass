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
    /*
      TODO 1.15 – Erklärtext ausstehend, Zulieferung André (Backlog 1.29)

      Zwei bis drei Absätze auf die Frage „Was ist Neu- und Reparaturlackierung?“ — was das
      Verfahren ist, wann es infrage kommt, wo seine Grenzen liegen. Das ist
      fachliche Aussage über Machbarkeit, keine Textarbeit.

      Die Sektion steht in `ServiceLayout` und sitzt vor der Fachsektion; das Feld
      ist Pflicht, ein Vergessen wäre ein Typfehler. `null` heisst „Text steht noch
      aus“, nicht „wird nicht gebraucht“. BEWUSST KEIN PLATZHALTER: erfundener Text
      sieht im Review wie fertiger Text aus und geht so live — gleiche Regel wie
      beim Exklusivleistungs-Block (1.18).
    */
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
