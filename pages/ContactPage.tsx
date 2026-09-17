import React from 'react';
import ContactSection from '../components/ContactSection';
import { FeatureGrid, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';
import { SCHADEN_ZIEL } from '../data/schadenmeldung';

const contactWays = [
  // Seit 2026-09-16 direkt zur Schadenseite auf reparatur.info (Backlog 2.23).
  { title: 'Schaden melden', description: 'Für Unfall-, Hagel-, Lack- oder Glasschäden: Schadendaten und Fotos über unsere Schadenseite auf reparatur.info übermitteln.', href: SCHADEN_ZIEL },
  { title: 'Aufbereitungstermin anfragen', description: 'Für Innenaufbereitung, Außenaufbereitung, Lackaufbereitung, Leasingrückgabe oder Verkaufsaufbereitung.', href: '#contact-termin' },
  { title: 'Geschäftskundenanfrage', description: 'Für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen.', href: '#contact-business' },
];

const ContactPage: React.FC = () => (
  <>
    <PageMeta canonical="/kontakt" title="Kontakt, Anfahrt & Öffnungszeiten | CarCare Center Leipzig" description="Kontakt zum CarCare Center Leipzig: Schaden melden, Aufbereitungstermin anfragen oder Geschäftskundenanfrage senden. An den Tierkliniken 42, 04103 Leipzig." />
    <PageHero
      eyebrow="Kontakt"
      title="Kontakt zum CarCare Center Leipzig"
      description="Wählen Sie die passende Anfrageart: Schaden melden, Aufbereitungstermin anfragen oder Geschäftskundenanfrage senden. Wir melden uns persönlich zurück."
      primaryCta={{ label: 'Schaden melden', href: SCHADEN_ZIEL }}
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
