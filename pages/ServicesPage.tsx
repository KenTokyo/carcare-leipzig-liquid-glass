import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';
import { serviceGroups, servicesByGroup } from '../data/services';

/**
 * Vollstaendige Leistungsuebersicht. Die Leistungen kommen aus `data/services.ts` —
 * derselben Quelle wie die Kachelreihe auf der Startseite (`components/ServiceGrid.tsx`).
 * Dadurch kann diese Seite nicht mehr unbemerkt hinter der Startseite zurueckfallen.
 */

const faqs = [
  {
    id: 'umfang',
    question: 'Welche Leistungen bietet CarCare in Leipzig an?',
    answer:
      'CarCare bündelt Fahrzeugaufbereitung, Leasingrückgabe-Vorbereitung, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice — alles an einem Standort in Leipzig.',
  },
  {
    id: 'einhaus',
    question: 'Bekomme ich Reparatur und Lackierung aus einer Hand?',
    answer:
      'Ja. Karosseriearbeiten, Lackierung, Smart Repair, Felgen und Aufbereitung finden auf 3.000 qm im eigenen Haus statt. Ihr Fahrzeug wird für die einzelnen Schritte nicht an Fremdbetriebe weitergereicht.',
  },
  {
    id: 'beratung',
    question: 'Welche Leistung ist für mein Fahrzeug sinnvoll?',
    answer:
      'Das hängt von Fahrzeugzustand, Schadenbild und Ziel ab. Bei kleineren Lackschäden prüfen wir zuerst Smart Repair, weil es günstiger und schneller ist als eine Komplettlackierung. CarCare berät vor Ort oder telefonisch und empfiehlt den passenden Ablauf.',
  },
  {
    id: 'versicherung',
    question: 'Übernimmt CarCare die Abwicklung mit der Versicherung?',
    answer:
      'Ja. Auf Wunsch übernimmt CarCare die Abstimmung mit Versicherern, Agenturen und Gutachtern — von der Schadenaufnahme über die Kalkulation bis zur Freigabe.',
  },
  {
    id: 'business',
    question: 'Sind die Leistungen auch für Geschäftskunden verfügbar?',
    answer:
      'Ja. Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen erhalten strukturierte Abläufe und feste Ansprechpartner.',
  },
];

const ServicesPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/leistungen"
      title="Leistungen in Leipzig | Aufbereitung, Unfall & Lack | CarCare"
      description="Alle Leistungen von CarCare Leipzig im Überblick: Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair, Dellen, Hagel, Felgen, Autoglas und Fuhrparkservice."
    />
    <PageHero
      eyebrow="Leistungen"
      title="Alle Leistungen von CarCare Leipzig im Überblick."
      description="Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair, Felgen und Autoglas — auf 3.000 qm aus einer Hand, als Meisterbetrieb und Glasurit-Lackpartner seit 1993."
      primaryCta={{ label: 'Termin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Schaden melden', href: '/kontakt#contact-schaden' }}
      keywords={['Fahrzeugaufbereitung Leipzig', 'Unfallinstandsetzung Leipzig', 'Autolackierung Leipzig', 'Smart Repair Leipzig']}
    />

    {serviceGroups.map((group, idx) => (
      <section
        key={group.id}
        id={group.anchor}
        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'} px-6 py-20 md:py-28`}
      >
        <div className="container mx-auto">
          <SectionIntro eyebrow={group.eyebrow} title={group.title} />
          <FeatureGrid
            items={servicesByGroup(group.id).map((service) => ({
              title: service.localTitle,
              description: service.listDescription,
              href: service.href,
            }))}
          />
        </div>
      </section>
    ))}

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zu den Leistungen." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>

    <PageCTA
      title="Welche Leistung passt zu Ihrem Fahrzeug?"
      description="CarCare Leipzig berät persönlich und findet den passenden Weg für Aufbereitung, Reparatur oder Schadenabwicklung."
      primaryLabel="Kontakt aufnehmen"
      primaryHref="/kontakt"
    />
  </>
);

export default ServicesPage;
