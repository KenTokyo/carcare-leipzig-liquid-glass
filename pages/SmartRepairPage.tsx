import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

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
  <>
    <PageMeta canonical="/smart-repair-leipzig" title="Smart Repair Leipzig | Spot-Repair | CarCare Center" description="Smart Repair in Leipzig: punktuelle Lackinstandsetzung mit geringem Aufwand. Ziel ist die unsichtbare Reparatur – kleine Schäden gezielt statt Komplettlackierung." />
    <PageHero
      eyebrow="Smart Repair Leipzig"
      title="Smart Repair in Leipzig – punktuelle Reparatur mit geringem Aufwand."
      description="Bei kleineren Schäden ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand unsere bevorzugte Reparaturmethode. Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges – ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung."
      primaryCta={{ label: 'Smart Repair anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Smart Repair Leipzig', 'Spot-Repair Leipzig', 'kleine Lackschäden reparieren Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungsumfang" title="Kleine Schäden gezielt statt Komplettlackierung." description="Smart bzw. Spot-Repair bearbeitet nur den betroffenen Bereich. Reicht das nicht aus, folgt die Komplettlackierung – dazu beraten wir Sie ehrlich." />
        <FeatureGrid items={scope} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Center Leipzig" title="Glasurit-Lackpartner und Meisterbetrieb – seit 1998." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zu Smart Repair." />
        <PageFAQ route="/smart-repair-leipzig" />
      </div>
    </section>
    <PageCTA title="Kleiner Schaden am Fahrzeug? Wir prüfen Smart Repair." description="Zeigen Sie uns den Schaden oder senden Sie Fotos – wir schätzen ein, ob eine punktuelle Reparatur mit geringem Aufwand der passende Weg ist." primaryLabel="Smart Repair anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default SmartRepairPage;
