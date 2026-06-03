import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

const jobs = [
  { title: 'Kfz-Aufbereiter', description: 'Fahrzeugpflege, Innen- und Außenaufbereitung sowie sorgfältige Detailarbeit.' },
  { title: 'Fahrzeuglackierer', description: 'Lackierarbeiten, Oberflächenqualität und saubere Reparaturlackierung.' },
  { title: 'Karosserie- und Fahrzeugbaumechaniker', description: 'Karosseriearbeiten, Instandsetzung und handwerkliche Präzision.' },
  { title: 'Serviceberater', description: 'Kundenkontakt, Auftragskoordination und Kommunikation im Team.' },
];

const benefits = [
  { title: 'Professionelles Umfeld', description: 'Arbeiten mit Fahrzeugen, Qualität und klaren Abläufen.' },
  { title: 'Starkes Team', description: 'Kollegen, die saubere Arbeit und gegenseitige Unterstützung schätzen.' },
  { title: 'Abwechslungsreiche Aufgaben', description: 'Aufbereitung, Reparatur, Lack, Service und Kundenkontakt.' },
  { title: 'Qualitätsanspruch', description: 'Sichtbare Ergebnisse und Arbeit, auf die man stolz sein kann.' },
];

const process = [
  { title: 'Kontakt aufnehmen', description: 'Kurze Bewerbung oder Initiativkontakt über die Kontaktseite senden.' },
  { title: 'Rückmeldung erhalten', description: 'CarCare prüft den passenden Bereich und meldet sich persönlich.' },
  { title: 'Kennenlernen', description: 'Gemeinsames Gespräch über Erfahrung, Stärken und Aufgabenbereich.' },
  { title: 'Start im Team', description: 'Wenn es passt, beginnt der Einstieg in einem professionellen Umfeld.' },
];

const faqs = [
  { id: 'initiativ', question: 'Kann ich mich initiativ bewerben?', answer: 'Ja. Initiativbewerbungen sind willkommen, besonders für Aufbereitung, Lackierung, Karosserie und Service.' },
  { id: 'bereiche', question: 'Welche Jobbereiche gibt es?', answer: 'CarCare sucht unter anderem Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater.' },
  { id: 'kontakt', question: 'Wie starte ich die Bewerbung?', answer: 'Am einfachsten über die Kontaktseite oder telefonisch. CarCare meldet sich anschließend persönlich zurück.' },
];

const CareerPage: React.FC = () => (
  <>
    <PageMeta canonical="/karriere" title="Karriere bei CarCare Leipzig" description="Karriere bei CarCare Leipzig: Jobs für Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater." />
    <PageHero
      eyebrow="Karriere"
      title="Karriere bei CarCare Leipzig"
      description="Dein Job bei CarCare: Fahrzeuge, Qualität und ein starkes Team. Entdecke Jobbereiche in Aufbereitung, Lackierung, Karosserie und Service."
      primaryCta={{ label: 'Initiativ bewerben', href: '/kontakt' }}
      secondaryCta={{ label: 'Jobbereiche ansehen', href: '#jobbereiche' }}
      keywords={['Kfz-Aufbereiter Leipzig', 'Fahrzeuglackierer Leipzig', 'Karosserie Jobs Leipzig']}
    />
    <section id="jobbereiche" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Job-Cards" title="Jobbereiche bei CarCare." />
        <FeatureGrid items={jobs} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Arbeitgeberversprechen" title="Ein professionelles Umfeld für Menschen, die Qualität mögen." />
        <FeatureGrid items={benefits} columns="four" />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Bewerbungsprozess" title="So läuft der Kontakt zu CarCare." />
        <ProcessList steps={process} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Karriere." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Du willst Teil des Teams werden?" description="Sende eine kurze Initiativbewerbung oder melde dich direkt. CarCare prüft gemeinsam mit dir den passenden Bereich." primaryLabel="Initiativbewerbung starten" primaryHref="/kontakt" />
  </>
);

export default CareerPage;
