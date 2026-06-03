import React from 'react';
import ContactSection from '../components/ContactSection';
import { FeatureGrid, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const contactWays = [
  { title: 'Schaden melden', description: 'Für Unfall, Hagel, Lack- oder Glasschäden mit Fahrzeugdaten, Schadenart und Bildern.', href: '#contact-schaden' },
  { title: 'Aufbereitungstermin anfragen', description: 'Für Innenaufbereitung, Außenaufbereitung, Lackpflege, Leasingrückgabe oder Verkaufsaufbereitung.', href: '#contact-termin' },
  { title: 'Geschäftskundenanfrage', description: 'Für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen.', href: '#contact-business' },
];

const ContactPage: React.FC = () => (
  <>
    <PageMeta canonical="/kontakt" title="Kontakt | CarCare Center Leipzig" description="Kontakt zu CarCare Center Leipzig: Schaden melden, Aufbereitungstermin anfragen oder Geschäftskundenanfrage senden." />
    <PageHero
      eyebrow="Kontakt"
      title="Kontakt zu CarCare Leipzig"
      description="Wählen Sie die passende Anfrageart: Schaden melden, Aufbereitungstermin anfragen oder Geschäftskundenanfrage senden. CarCare meldet sich persönlich zurück."
      primaryCta={{ label: 'Schaden melden', href: '#contact-schaden' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Schaden melden Leipzig', 'Aufbereitungstermin Leipzig', 'Geschäftskundenanfrage']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Anfragearten" title="Drei Wege zur richtigen Anfrage." />
        <FeatureGrid items={contactWays} />
      </div>
    </section>
    <ContactSection />
  </>
);

export default ContactPage;
