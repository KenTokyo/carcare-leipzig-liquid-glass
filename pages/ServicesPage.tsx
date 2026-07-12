import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const care = [
  { title: 'Fahrzeugaufbereitung Leipzig', description: 'Innen- und Außenaufbereitung für gepflegte Fahrzeuge, Werterhalt und sichtbaren Glanz.', href: '/fahrzeugaufbereitung-leipzig' },
  { title: 'Autoaufbereitung Leipzig', description: 'Professionelle Reinigung, Pflege und Aufwertung für Privatkunden, Autohäuser und Fuhrparks.', href: '/fahrzeugaufbereitung-leipzig' },
  { title: 'Leasingrückgabe Leipzig', description: 'Vorbereitung vor der Fahrzeugrückgabe, um vermeidbare Nachbelastungen zu reduzieren.', href: '/fahrzeugaufbereitung-leipzig' },
];

const repair = [
  { title: 'Unfallinstandsetzung Leipzig', description: 'Schadenaufnahme, Kalkulation, Karosseriearbeiten und Reparaturbegleitung.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Smart Repair Leipzig', description: 'Punktuelle Reparaturen bei kleineren Lack-, Kunststoff- und Gebrauchsschäden.', href: '/smart-repair-leipzig' },
  { title: 'Dellenentfernung Leipzig', description: 'Lackierfreie Instandsetzung bei Dellen, Parkremplern und Hagelschäden.', href: '/dellenentfernung-leipzig' },
];

const paint = [
  { title: 'Autolackierung Leipzig', description: 'Neu- und Reparaturlackierung mit sauberer Farbton- und Oberflächenqualität.', href: '/autolackierung-leipzig' },
  { title: 'Hagelschadenreparatur Leipzig', description: 'Strukturierte Reparatur bei Hagelereignissen inklusive Schadenbewertung.', href: '/hagelschadenreparatur-leipzig' },
  { title: 'Felgenreparatur Leipzig', description: 'Aufbereitung und Reparatur leichter Oberflächenschäden an Felgen.', href: '/felgenreparatur-leipzig' },
];

const business = [
  { title: 'Fuhrparkservice Leipzig', description: 'Planbare Fahrzeugpflege, Reparaturprozesse und transparente Abläufe für Flotten.', href: '/fuhrparkservice-leipzig' },
  { title: 'Geschäftskundenbetreuung', description: 'Feste Ansprechpartner für Autohäuser, Fuhrparks, Versicherungen und Agenturen.', href: '/geschaeftskunden' },
  { title: 'Werterhalt & Verkaufsaufbereitung', description: 'Professionelle Aufwertung vor Verkauf, Übergabe oder Rückgabe.', href: '/fahrzeugaufbereitung-leipzig' },
];

const faqs = [
  { id: 'umfang', question: 'Welche Leistungen bietet CarCare in Leipzig an?', answer: 'CarCare bündelt Fahrzeugaufbereitung, Unfallinstandsetzung, Autolackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Leasingrückgabe und Fuhrparkservice.' },
  { id: 'beratung', question: 'Welche Leistung ist für mein Fahrzeug sinnvoll?', answer: 'Das hängt von Fahrzeugzustand, Schadenbild und Ziel ab. CarCare berät vor Ort oder telefonisch und empfiehlt den passenden Ablauf.' },
  { id: 'business', question: 'Sind die Leistungen auch für Geschäftskunden verfügbar?', answer: 'Ja. Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen erhalten strukturierte Abläufe und feste Ansprechpartner.' },
];

const ServicesPage: React.FC = () => (
  <>
    <PageMeta canonical="/leistungen" title="Leistungen | CarCare Center Leipzig" description="Leistungen von CarCare Leipzig: Fahrzeugaufbereitung, Unfallinstandsetzung, Autolackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Leasingrückgabe und Fuhrparkservice." />
    <PageHero
      eyebrow="Leistungen"
      title="Fahrzeugpflege, Reparatur und Werterhalt in Leipzig."
      description="CarCare Center Leipzig verbindet professionelle Fahrzeugaufbereitung mit Unfallinstandsetzung, Lackierung, Smart Repair und Geschäftskundenservice."
      primaryCta={{ label: 'Termin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Schaden melden', href: '/kontakt#contact-schaden' }}
      keywords={['Fahrzeugaufbereitung Leipzig', 'Unfallinstandsetzung Leipzig', 'Smart Repair Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Fahrzeugpflege & Aufbereitung" title="Saubere Aufbereitung für Alltag, Verkauf und Leasingrückgabe." />
        <FeatureGrid items={care} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Reparatur & Smart Repair" title="Schnelle Hilfe bei Schäden, Dellen und Gebrauchsspuren." />
        <FeatureGrid items={repair} />
      </div>
    </section>
    <section id="lack" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Lack & Karosserie" title="Karosseriearbeiten, Reparaturlackierung und Oberflächenqualität." />
        <FeatureGrid items={paint} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Geschäftskunden & Werterhalt" title="Planbare Fahrzeugdienstleistungen für Unternehmen." />
        <FeatureGrid items={business} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zu den Leistungen." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Welche Leistung passt zu Ihrem Fahrzeug?" description="CarCare Leipzig berät persönlich und findet den passenden Weg für Aufbereitung, Reparatur oder Schadenabwicklung." primaryLabel="Kontakt aufnehmen" primaryHref="/kontakt" />
  </>
);

export default ServicesPage;
