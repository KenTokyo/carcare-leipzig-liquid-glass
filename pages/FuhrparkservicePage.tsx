import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const leistungen = [
  { title: 'Regelmäßige Pflege', description: 'Wir übernehmen die laufende Pflege und Aufbereitung Ihrer Fahrzeuge.' },
  { title: 'Aufarbeitung vor Rückgabe oder Verkauf', description: 'Aufbereitung der Fahrzeuge, bevor sie zurückgegeben oder verkauft werden.' },
  { title: 'Im Schadensfall mobil', description: 'Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein.' },
  { title: 'Starke Kooperationspartner', description: 'Profitieren Sie von unseren langjährigen Kooperationspartnern aus der Automobilbranche.' },
];

const faqs = [
  { id: 'umfang', question: 'Welche Arbeiten übernimmt der Fuhrparkservice?', answer: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf übernehmen wir sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge.' },
  { id: 'schaden', question: 'Was passiert im Schadensfall?', answer: 'Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein, damit Ihr Betrieb weiterläuft.' },
  { id: 'partner', question: 'Arbeitet CarCare mit Partnern aus der Branche zusammen?', answer: 'Ja. Sie profitieren von unseren langjährigen Kooperationspartnern aus der Automobilbranche.' },
];

const usp = [
  { title: 'Full-Service auf 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
  { title: 'Erfahrung mit Flottenkunden', description: 'Langjährige Erfahrung mit Autohäusern, Firmenfuhrparks und Geschäftskunden.' },
  { title: 'Komplette Versicherungsabwicklung', description: 'Im Schadensfall inklusive Kostenvoranschlag und Werkstattersatzfahrzeug.' },
];

const FuhrparkservicePage: React.FC = () => (
  <>
    <PageMeta canonical="/fuhrparkservice-leipzig" title="Fuhrparkservice Leipzig | Firmenfuhrpark-Betreuung | CarCare" description="Fuhrparkservice in Leipzig: Betreuung Ihres Firmenfuhrparks – von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf. Im Schadensfall halten wir Sie mobil." />
    <PageHero
      eyebrow="Fuhrparkservice Leipzig"
      title="Fuhrparkservice in Leipzig."
      description="Gern stehen wir Ihnen in der Betreuung Ihres Firmenfuhrparks zur Seite. Wir übernehmen von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge. Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein."
      primaryCta={{ label: 'Fuhrparkservice anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Mehr für Geschäftskunden', href: '/geschaeftskunden' }}
      keywords={['Fuhrparkservice Leipzig', 'Firmenfuhrpark Leipzig', 'Flottenservice Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungsumfang" title="Rundum-Betreuung für Ihren Firmenfuhrpark." description="Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf – sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge aus einer Hand." />
        <FeatureGrid items={leistungen} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Leipzig" title="Full-Service-Partner für Ihren Fuhrpark." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zum Fuhrparkservice." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Planbare Betreuung für Ihren Fuhrpark?" description="Sprechen Sie mit CarCare Leipzig über die Betreuung Ihrer Fahrzeuge – von der regelmäßigen Pflege bis zur Schadenabwicklung." primaryLabel="Fuhrparkservice anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default FuhrparkservicePage;
