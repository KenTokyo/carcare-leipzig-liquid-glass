import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const leistungen = [
  { title: 'Kalkulation mit Audatex', description: 'Kalkulation des Schadens mit dem durch Versicherer und Gutachter anerkannten System Audatex.' },
  { title: 'Komplette Schadenabwicklung', description: 'Auf Wunsch sprechen wir mit Ihrem Gutachter bzw. Ihrer Versicherung und wickeln das gesamte Schadensereignis für Sie ab.' },
  { title: 'Keine Anzahlung nötig', description: 'Wir rechnen direkt mit der Versicherung ab – Sie müssen nicht in Vorleistung gehen.' },
  { title: 'Lackfreie Instandsetzung', description: 'Hageldellen werden bei intaktem Lack lackfrei entfernt und in den Originalzustand versetzt.', href: '/dellenentfernung-leipzig' },
];

const faqs = [
  { id: 'anzahlung', question: 'Muss ich eine Anzahlung leisten?', answer: 'Nein. Eine Anzahlung ist nicht nötig – wir rechnen direkt mit der Versicherung ab.' },
  { id: 'abwicklung', question: 'Übernehmt ihr die Abstimmung mit Versicherung und Gutachter?', answer: 'Auf Wunsch sprechen wir mit Ihrem Gutachter bzw. Ihrer Versicherung und wickeln das gesamte Schadensereignis für Sie ab.' },
  { id: 'audatex', question: 'Wie wird der Hagelschaden kalkuliert?', answer: 'Die Kalkulation erfolgt mit dem durch Versicherer und Gutachter anerkannten System Audatex.' },
  { id: 'zustand', question: 'Wird das Fahrzeug wieder wie vorher?', answer: 'Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird. Bei intaktem Lack werden die Hageldellen lackfrei entfernt.' },
];

const usp = [
  { title: 'Komplette Versicherungsabwicklung', description: 'Unfall- und Versicherungsabwicklung inklusive Kostenvoranschlag und Werkstattersatzfahrzeug.' },
  { title: 'Glasurit-Lackpartner', description: 'Wo lackiert werden muss, arbeiten wir als Glasurit-Lackpartner farbtongenau.' },
  { title: 'Meisterbetrieb seit 1993', description: 'Über 30 Jahre Erfahrung mit Schäden aller Art – Karosserie und Lack aus einer Hand.' },
];

const HagelschadenreparaturPage: React.FC = () => (
  <>
    <PageMeta canonical="/hagelschadenreparatur-leipzig" title="Hagelschadenreparatur Leipzig | Audatex, Versicherung | CarCare" description="Hagelschadenreparatur in Leipzig: Wir versetzen Ihr Fahrzeug in den Originalzustand – Kalkulation mit Audatex, komplette Abwicklung mit Versicherung und Gutachter, keine Anzahlung." />
    <PageHero
      eyebrow="Hagelschadenreparatur Leipzig"
      title="Hagelschadenreparatur in Leipzig."
      description="Sie sind mit Ihrem Fahrzeug in einen Hagelschauer gekommen? Kein Problem! Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird – inklusive Kalkulation und Abwicklung mit Ihrer Versicherung."
      primaryCta={{ label: 'Hagelschaden melden', href: '/kontakt#contact-schaden' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Hagelschadenreparatur Leipzig', 'Hagelschaden Auto Leipzig', 'Hageldellen entfernen Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Unsere Leistungen für Sie" title="Von der Kalkulation bis zur Versicherungsabwicklung." />
        <FeatureGrid items={leistungen} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Leipzig" title="Meisterbetrieb mit kompletter Versicherungsabwicklung." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Hagelschadenreparatur." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Hagelschaden in Leipzig? Wir wickeln alles für Sie ab." description="Melden Sie den Schaden mit den wichtigsten Informationen – wir kalkulieren mit Audatex und rechnen direkt mit Ihrer Versicherung ab." primaryLabel="Hagelschaden jetzt melden" primaryHref="/kontakt#contact-schaden" />
  </>
);

export default HagelschadenreparaturPage;
