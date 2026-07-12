import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const scope = [
  { title: 'Neuverglasung PKW, LKW & Bus', description: 'Fachgerechter Scheibentausch für PKW, LKW und Bus.' },
  { title: 'Steinschlagreparaturen', description: 'Reparatur von Steinschlägen, bevor sich Risse in der Scheibe ausbreiten.' },
  { title: 'Folienbeschichtungen aller Art', description: 'Scheibenfolierung sowie Schutzfolien für Ihren Lack.' },
  { title: 'Werkstatt-Ersatzfahrzeug gratis', description: 'Während der Arbeiten stellen wir Ihnen ein Werkstatt-Ersatzfahrzeug kostenlos zur Verfügung.' },
];

const usp = [
  { title: 'WINTEC-Autoglas-Partner', description: 'Als WINTEC-Partner geben wir 30 Jahre Garantie auf die Autoglas-Reparatur und die Dichtigkeit ausgetauschter Scheiben.' },
  { title: 'ISO 9001 TÜV-zertifiziert', description: 'Unsere Arbeit ist nach ISO 9001 TÜV zertifiziert.' },
  { title: 'Full-Service auf 3.000 m²', description: 'Autoglas, Lackierung, Karosserie, Smart/Spot Repair und Fahrzeugaufbereitung aus einer Hand.' },
];

const faqs = [
  { id: 'garantie', question: 'Gibt es eine Garantie auf die Autoglas-Reparatur?', answer: 'Ja. Als WINTEC-Partner geben wir 30 Jahre Garantie auf die Autoglas-Reparatur und die Dichtigkeit ausgetauschter Scheiben.' },
  { id: 'leistungen', question: 'Welche Autoglas-Leistungen bietet CarCare?', answer: 'Neuverglasung für PKW, LKW und Bus, Steinschlagreparaturen sowie Folienbeschichtungen aller Art – von der Scheibenfolierung bis zu Schutzfolien für den Lack.' },
  { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Ja. Während der Arbeiten stellen wir Ihnen ein Werkstatt-Ersatzfahrzeug gratis zur Verfügung.' },
  { id: 'steinschlag', question: 'Kann ein Steinschlag repariert werden oder muss die Scheibe getauscht werden?', answer: 'Je nach Größe und Lage lässt sich ein Steinschlag reparieren, bevor sich Risse ausbreiten. Ist das nicht möglich, tauschen wir die Scheibe fachgerecht aus.' },
];

const AutoglasPage: React.FC = () => (
  <>
    <PageMeta canonical="/autoglas-leipzig" title="Autoglas & Scheibenfolien Leipzig | WINTEC-Partner | CarCare" description="Autoglas in Leipzig: Scheibentausch, Steinschlagreparatur und Scheibenfolierung. Als WINTEC-Partner ISO-9001-TÜV-zertifiziert mit 30 Jahren Garantie und gratis Ersatzfahrzeug." />
    <PageHero
      eyebrow="Autoglas & Scheibenfolien Leipzig"
      title="Autoglas und Scheibenfolien in Leipzig."
      description="Ob Scheibentausch oder Steinschlagreparatur, ob Scheibenfolierung oder Schutzfolien für Ihren Lack – bei unserem WINTEC-Autoglas-Partner sind Sie in den besten Händen."
      primaryCta={{ label: 'Autoglas anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Autoglas Leipzig', 'Steinschlagreparatur Leipzig', 'Scheibenfolierung Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungen im Überblick" title="Autoglas, Steinschlag und Folien aus einer Hand." />
        <FeatureGrid items={scope} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Leipzig" title="WINTEC-Partner, ISO-9001-zertifiziert, 30 Jahre Garantie." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zu Autoglas und Scheibenfolien." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Steinschlag oder Scheibenschaden in Leipzig?" description="Melden Sie sich bei CarCare – wir prüfen, ob eine Steinschlagreparatur reicht oder die Scheibe getauscht wird, und stellen ein Ersatzfahrzeug bereit." primaryLabel="Autoglas anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default AutoglasPage;
