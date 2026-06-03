import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

const services = [
  { title: 'Innenaufbereitung', description: 'Sorgfältige Reinigung und Pflege von Cockpit, Oberflächen, Polstern und Innenraumdetails.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Außenaufbereitung', description: 'Schonende Außenreinigung, Lackreinigung und gepflegtes Erscheinungsbild.', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
  { title: 'Lackreinigung', description: 'Entfernung von typischen Anhaftungen und Vorbereitung für Politur oder Versiegelung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Lackpolitur', description: 'Politur für mehr Glanz, glattere Oberflächen und optische Aufwertung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Versiegelung', description: 'Schutz und Werterhalt für Lackoberflächen nach der Aufbereitung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Geruchsentfernung', description: 'Innenraumbehandlung gegen unangenehme Gerüche und belastete Luft im Fahrzeug.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Polster- und Lederpflege', description: 'Materialgerechte Pflege für Sitzflächen, Leder und textile Innenraumteile.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Leasingrückgabe-Vorbereitung', description: 'Prüfung und Aufbereitung vor der Fahrzeugrückgabe.', href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten' },
  { title: 'Verkaufsaufbereitung', description: 'Professionelle optische Aufwertung vor Verkauf, Übergabe oder Präsentation.', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
];

const expertPoints = [
  { title: 'Premiumfahrzeuge', description: 'Sorgfältiger Umgang mit hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
  { title: 'Autohäuser', description: 'Planbare Aufbereitung für Präsentation, Übergabe und Fahrzeugbestand.' },
  { title: 'Fuhrparks', description: 'Wiederkehrende Pflege- und Werterhaltungsprozesse für gewerbliche Fahrzeuge.' },
  { title: 'Hohe Qualitätsstandards', description: 'Strukturierte Arbeitsweise, saubere Übergabe und sichtbarer Anspruch an Details.' },
];

const steps = [
  { title: 'Anfrage stellen', description: 'Fahrzeug, gewünschte Leistung und Wunschtermin an CarCare übermitteln.' },
  { title: 'Bedarf einschätzen', description: 'Gemeinsam wird geklärt, welche Aufbereitung sinnvoll ist.' },
  { title: 'Fahrzeug abgeben', description: 'Übergabe vor Ort mit kurzer Abstimmung zum Zustand.' },
  { title: 'Professionell aufbereiten', description: 'Innen, außen, Lack und Details werden passend bearbeitet.' },
  { title: 'Gepflegt zurückerhalten', description: 'Das Fahrzeug wird sauber, hochwertig und nachvollziehbar übergeben.' },
];

const faqs = [
  { id: 'dauer', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Das hängt von Leistung, Zustand und Umfang ab. CarCare stimmt den Ablauf nach der Anfrage persönlich ab.' },
  { id: 'leasing', question: 'Hilft CarCare bei der Leasingrückgabe?', answer: 'Ja. Die Aufbereitung kann helfen, den Fahrzeugzustand vor der Rückgabe professionell zu verbessern.' },
  { id: 'business', question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?', answer: 'Ja. CarCare arbeitet für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards.' },
];

const VehicleDetailingPage: React.FC = () => (
  <>
    <PageMeta canonical="/fahrzeugaufbereitung-leipzig" title="Fahrzeugaufbereitung Leipzig | Professionelle Autoaufbereitung" description="Professionelle Fahrzeugaufbereitung in Leipzig: Innenaufbereitung, Außenaufbereitung, Lackreinigung, Lackpolitur, Versiegelung, Geruchsentfernung, Polster- und Lederpflege sowie Leasingrückgabe-Vorbereitung." />
    <PageHero
      eyebrow="Fahrzeugaufbereitung Leipzig"
      title="Professionelle Fahrzeugaufbereitung in Leipzig"
      description="CarCare ist Experte für professionelle Autoaufbereitung: Innenraum, Außenpflege, Lackreinigung, Politur, Versiegelung, Geruchsentfernung und Vorbereitung auf Verkauf oder Leasingrückgabe."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Ratgeber lesen', href: '/autoaufbereitung-wissen' }}
      keywords={['Autoaufbereitung Leipzig', 'Lackpolitur Leipzig', 'Leasingrückgabe Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Aufbereitungsleistungen" title="Innen, außen, Lack und Details professionell gepflegt." />
        <FeatureGrid items={services} columns="three" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Expertise" title="Für Premiumfahrzeuge, Autohäuser, Fuhrparks und hohe Qualitätsstandards." description="CarCare arbeitet neutral, professionell und mit dem Anspruch, Fahrzeugzustand und Wert sichtbar zu verbessern." />
        <FeatureGrid items={expertPoints} columns="four" />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So läuft Ihre Autoaufbereitung bei CarCare." />
        <ProcessList steps={steps} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Fahrzeugaufbereitung." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Ihr Fahrzeug soll sichtbar gepflegter wirken?" description="Fragen Sie Ihren Aufbereitungstermin in Leipzig an. CarCare empfiehlt die passende Leistung für Zustand und Ziel." primaryLabel="Termin anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default VehicleDetailingPage;
