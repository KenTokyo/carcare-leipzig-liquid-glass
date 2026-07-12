import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const scope = [
  { title: 'Spot-Repair', description: 'Die möglichst perfekte Lackinstandsetzung mit geringem Aufwand – unsere bevorzugte Reparaturmethode.' },
  { title: 'Komplettlackierung', description: 'Wenn Spot-Repair nicht ausreicht, lackieren wir das Bauteil unter modernen Bedingungen mit bestmöglichem Ergebnis.' },
  { title: 'Stoßfänger lackieren', description: 'Fachgerechte Lackierung beschädigter Stoßfänger inklusive farblicher Angleichung.' },
  { title: 'Motorhaube lackieren', description: 'Lackinstandsetzung der Motorhaube bei Kratzern, Steinschlägen oder Lackschäden.' },
  { title: 'Radlauf lackieren', description: 'Lackierung beschädigter Radläufe für ein einheitliches Erscheinungsbild.' },
  { title: 'Farbtongenaue Angleichung', description: 'Ziel ist, dass weder Farbton noch Effektunterschiede zur Originallackierung erkennbar sind.' },
];

const faqs = [
  { id: 'unsichtbar', question: 'Sieht man die Lackreparatur später?', answer: 'Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges. Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind.' },
  { id: 'spot', question: 'Was ist Spot-Repair?', answer: 'Spot-Repair ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand. Sie ist unsere bevorzugte Reparaturmethode, weil nur der betroffene Bereich bearbeitet wird.' },
  { id: 'komplett', question: 'Wann ist eine Komplettlackierung nötig?', answer: 'Nicht immer kann Spot-Repair angewendet werden. Dann bleibt die Komplettlackierung des Bauteils, die unter modernen Bedingungen mit bestmöglichem Ergebnis ausgeführt wird.' },
];

const usp = [
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue, makellose Reparaturen mit langlebigem Premium-Finish und umweltschonenden Wasserbasislacken.' },
  { title: 'Meisterbetrieb seit 1993', description: 'Meisterbetrieb des Kfz-Lackierhandwerks mit über 30 Jahren Erfahrung am Markt.' },
  { title: 'Full-Service auf 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
];

const AutolackierungPage: React.FC = () => (
  <>
    <PageMeta canonical="/autolackierung-leipzig" title="Neu- & Reparaturlackierung Leipzig | unsichtbar | CarCare" description="Neu- und Reparaturlackierung in Leipzig: Unser Ziel ist die unsichtbare Reparatur – weder Farbton noch Effektunterschiede zur Originallackierung. Spot-Repair bevorzugt." />
    <PageHero
      eyebrow="Neu- und Reparaturlackierung Leipzig"
      title="Neu- und Reparaturlackierung in Leipzig."
      description="Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind. Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges."
      primaryCta={{ label: 'Lackierung anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Autolackierung Leipzig', 'Reparaturlackierung Leipzig', 'Spot-Repair Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungsumfang" title="Von Spot-Repair bis zur Komplettlackierung." description="Spot-Repair, die möglichst perfekte Lackinstandsetzung mit geringem Aufwand, ist unsere bevorzugte Reparaturmethode. Wo sie nicht ausreicht, folgt die Komplettlackierung des Bauteils." />
        <FeatureGrid items={scope} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Leipzig" title="Glasurit-Lackpartner und Meisterbetrieb – seit über 30 Jahren." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Lackierung." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Lackschaden in Leipzig? Wir beraten Sie zur unsichtbaren Reparatur." description="Beschreiben Sie Ihr Anliegen oder senden Sie Fotos – wir prüfen, ob Spot-Repair ausreicht oder eine Komplettlackierung sinnvoll ist." primaryLabel="Lackierung anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default AutolackierungPage;
