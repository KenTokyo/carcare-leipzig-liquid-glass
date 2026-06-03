import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

const audiences = [
  { title: 'Autohäuser', description: 'Aufbereitung, Reparatur und Fahrzeugübergabeprozesse mit verlässlicher Kommunikation.' },
  { title: 'Fuhrparks', description: 'Planbare Abläufe für wiederkehrende Pflege, Reparatur und Werterhalt von Flotten.' },
  { title: 'Versicherungen', description: 'Strukturierte Schadenprozesse und klare Ansprechpartner für die Abwicklung.' },
  { title: 'Versicherungsagenturen', description: 'Persönliche Zusammenarbeit bei Schadenaufnahme und Kundenkommunikation.' },
];

const benefits = [
  { title: 'Feste Ansprechpartner', description: 'Kurze Wege, klare Zuständigkeiten und verlässliche Kommunikation.' },
  { title: 'Strukturierte Abläufe', description: 'Standardisierte Prozesse für Aufbereitung, Reparatur und Schadenfälle.' },
  { title: 'Dokumentierte Prozesse', description: 'Nachvollziehbare Schritte und transparente Übergaben.' },
  { title: 'Erfahrung mit Premiumfahrzeugen', description: 'Sorgfältiger Umgang mit hochwertigen Fahrzeugen und hohen Erwartungen.' },
  { title: 'Qualitätssicherung', description: 'Endabnahme, Prozessqualität und sichtbarer Anspruch an das Ergebnis.' },
  { title: 'Flexible Zusammenarbeit', description: 'Einzelauftrag, laufende Betreuung oder perspektivische Rahmenprozesse.' },
  { title: 'Digitale Schadenübermittlung', description: 'Perspektivisch können Schadeninformationen digital übermittelt werden.' },
];

const steps = [
  { title: 'Kontakt aufnehmen', description: 'Unternehmen, Ansprechpartner und Bedarf übermitteln.' },
  { title: 'Abläufe klären', description: 'CarCare bespricht Umfang, Frequenz, Ansprechpartner und Kommunikationswege.' },
  { title: 'Prozess starten', description: 'Fahrzeuge oder Schadenfälle werden nach vereinbartem Ablauf bearbeitet.' },
  { title: 'Qualität sichern', description: 'Dokumentation, Endabnahme und transparente Rückmeldung gehören zum Prozess.' },
];

const faqs = [
  { id: 'rahmen', question: 'Sind feste Abläufe für Geschäftskunden möglich?', answer: 'Ja. CarCare kann wiederkehrende Prozesse für Autohäuser, Fuhrparks und Agenturen strukturieren.' },
  { id: 'premium', question: 'Hat CarCare Erfahrung mit Premiumfahrzeugen?', answer: 'Ja. CarCare arbeitet mit hohen Qualitätsstandards und sorgfältigem Umgang bei hochwertigen Fahrzeugen.' },
  { id: 'digital', question: 'Gibt es digitale Schadenübermittlung?', answer: 'Eine digitale Schadenübermittlung ist perspektivisch vorgesehen und kann in der Zusammenarbeit berücksichtigt werden.' },
];

const BusinessCustomersPage: React.FC = () => (
  <>
    <PageMeta canonical="/geschaeftskunden" title="Geschäftskunden | CarCare Center Leipzig" description="CarCare Leipzig für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen: feste Ansprechpartner, strukturierte Abläufe, dokumentierte Prozesse und Qualitätssicherung." />
    <PageHero
      eyebrow="Geschäftskunden"
      title="Fahrzeugdienstleistungen für Autohäuser, Fuhrparks und Versicherungen."
      description="CarCare Center Leipzig unterstützt gewerbliche Partner mit Aufbereitung, Reparaturlösungen, Schadenabwicklung, Qualitätssicherung und flexibler Zusammenarbeit."
      primaryCta={{ label: 'Geschäftskundenanfrage stellen', href: '/kontakt#contact-business' }}
      secondaryCta={{ label: 'Leistungen ansehen', href: '/leistungen' }}
      keywords={['Fuhrparkservice Leipzig', 'Autohäuser Leipzig', 'Versicherungsagenturen']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Zielgruppen" title="Für professionelle Partner mit klaren Anforderungen." />
        <FeatureGrid items={audiences} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Vorteile" title="Struktur, Qualität und persönliche Zusammenarbeit." />
        <FeatureGrid items={benefits} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So startet die Zusammenarbeit mit CarCare." />
        <ProcessList steps={steps} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen für Geschäftskunden." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Sie betreuen Fahrzeuge gewerblich?" description="Sprechen Sie mit CarCare über feste Ansprechpartner, wiederkehrende Abläufe und passende Prozesse." primaryLabel="Partneranfrage stellen" primaryHref="/kontakt#contact-business" />
  </>
);

export default BusinessCustomersPage;
