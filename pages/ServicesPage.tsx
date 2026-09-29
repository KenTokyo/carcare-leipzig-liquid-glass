import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';
import LeistungsKarten from '../components/LeistungsKarten';
import { serviceGroups, servicesByGroup } from '../data/services';
import { SCHADEN_ZIEL } from '../data/schadenmeldung';

/**
 * Vollstaendige Leistungsuebersicht. Die Leistungen kommen aus `data/services.ts` —
 * derselben Quelle wie die Kachelreihe auf der Startseite (`components/ServiceGrid.tsx`).
 * Dadurch kann diese Seite nicht mehr unbemerkt hinter der Startseite zurueckfallen.
 *
 * NEU GESTALTET 2026-09-27 (Backlog 5.44, Meeting 2026-09-25): Die Seite war „relativ leer" und
 * sah nicht aus wie die uebrigen Unterseiten — kein stehendes Foto, reine Textkarten, keine
 * Vorteile, kein Ablauf. Jetzt derselbe Aufbau wie Privat- und Geschaeftskundenseite:
 * `BackdropLayout` mit echtem Foto, Vorteile, je Gruppe Bildkarten (`LeistungsKarten`, Motiv aus dem
 * Katalog), Ablauf, FAQ, CTA. Die Gruppen-Anker (`#aufbereitung`, `#unfall-lack`, `#rad-glas`,
 * `#gewerbe`) bleiben — das Mega-Menue verlinkt sie.
 */

/** Tragende Aussagen, alle im Projekt belegt (CLAUDE.md, Ueber uns, Leistungsseiten). */
const vorteile = [
  {
    title: 'Alles an einem Standort',
    description: 'Aufbereitung, Karosserie, Lackierung, Smart Repair, Felgen und Autoglas liegen auf über 3.500 m² im eigenen Haus. Ihr Fahrzeug wird zwischen den Arbeitsschritten nicht weitergereicht.',
  },
  {
    title: 'Meisterbetrieb seit 1998',
    description: 'Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk, seit 1998 am Markt, mit über 50 Mitarbeitern. Für alle Marken, vom Kleinwagen bis zum Premiumfahrzeug.',
  },
  {
    title: 'Farbtongenau als Glasurit-Lackpartner',
    description: 'Ziel jeder Lackreparatur ist, dass weder Farbton noch Effekt zur Originallackierung abweichen. Dafür arbeiten wir mit umweltschonenden Wasserbasislacken.',
  },
  {
    title: 'Abwicklung mit der Versicherung',
    description: 'Auf Wunsch übernehmen wir Kalkulation über Audatex, Schriftverkehr und Abstimmung mit Versicherer und Gutachter. Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug.',
  },
];

/** Beschreibende Einleitung je Gruppe — der Gruppentitel steht im Katalog, der Satz hier. */
const gruppenText: Record<string, string> = {
  aufbereitung: 'Innen- und Außenaufbereitung mit festen Paketpreisen ab 169,00 €, Lackaufbereitung nach Aufwand und die Vorbereitung auf die Leasingrückgabe.',
  'unfall-lack': 'Vom Unfallschaden bis zum kleinen Kratzer: Karosserie, Lackierung, Smart Repair, lackfreie Dellenentfernung und Hagelschäden, mit Versicherungsabwicklung auf Wunsch.',
  'rad-glas': 'Felgenreparatur im TÜV-zertifizierten Verfahren und Autoglas als WINTEC-Partner, ohne Umweg über einen weiteren Betrieb.',
  gewerbe: 'Für Autohäuser, Fuhrparks, Versicherungen und Agenturen: feste Ansprechpartner und planbare Abläufe über viele Fahrzeuge hinweg.',
};

const ablauf = [
  { title: 'Anfragen', description: 'Rufen Sie an oder fragen Sie online einen Termin an. Einen Unfallschaden melden Sie samt Fotos über unsere Schadenseite auf reparatur.info.' },
  { title: 'Begutachten', description: 'Wir sehen uns das Fahrzeug in Leipzig an und besprechen, welches Verfahren fachlich und wirtschaftlich sinnvoll ist.' },
  { title: 'Preis klären', description: 'Für die Aufbereitung gelten feste Paketpreise ab 169,00 €. Für Reparaturen erhalten Sie einen Kostenvoranschlag; im Versicherungsfall übernehmen wir auf Wunsch die Abstimmung.' },
  { title: 'Ausführen und übergeben', description: 'Wir arbeiten das Fahrzeug im eigenen Haus ab und übergeben es gereinigt zurück, mit Erklärung, was gemacht wurde.' },
];

const ServicesPage: React.FC = () => (
  // Echtes Foto aus unserer Werkhalle (Standbild des Betriebsrundgangs, B101) — die Seite zeigt alle
  // Bereiche, also die Halle statt eines einzelnen Leistungsmotivs.
  <BackdropLayout image="/assets/carcare-betriebsrundgang-standbild.webp">
    <PageMeta
      canonical="/leistungen"
      title="Leistungen Leipzig | Aufbereitung & Lack | CarCare Center"
      description="Alle Leistungen im Überblick: Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair, Dellen, Hagel, Felgen und Autoglas in Leipzig, im Haus."
    />
    <PageHero
      eyebrow="Leistungen"
      title="Alle Leistungen vom CarCare Center Leipzig im Überblick."
      description="Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair, Felgen und Autoglas, auf über 3.500 m² aus einer Hand, als Meisterbetrieb und Glasurit-Lackpartner seit 1998."
      primaryCta={{ label: 'Termin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Schaden melden', href: SCHADEN_ZIEL }}
      keywords={['Fahrzeugaufbereitung Leipzig', 'Unfallinstandsetzung Leipzig', 'Autolackierung Leipzig', 'Smart Repair Leipzig']}
    />

    <section id="vorteile" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Alles aus einer Hand"
          title="Warum ein Betrieb für alles besser ist als drei."
          description="Pflege, Reparatur und Lackierung greifen ineinander. Liegen sie unter einem Dach, gibt es keine Übergaben zwischen Werkstätten und einen Ansprechpartner für das ganze Fahrzeug."
        />
        <FeatureGrid items={vorteile} columns="four" />
      </div>
    </section>

    {serviceGroups.map((group, idx) => {
      const leistungen = servicesByGroup(group.id);
      return (
        <section
          key={group.id}
          id={group.anchor}
          className={`${idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'} px-6 py-20 md:py-28`}
        >
          <div className="container mx-auto">
            <SectionIntro eyebrow={group.eyebrow} title={group.title} description={gruppenText[group.id]} />
            {/* Bildkarten wie auf den uebrigen Seiten; das Foto kommt ueber `href` aus dem Katalog.
                Linktext beschreibend statt „Mehr erfahren" (SEO-GEO §4.4) — und bewusst NICHT das `cta`
                der Kachel: „Unfall melden" auf einem Link zur Informationsseite versprache etwas anderes. */}
            <LeistungsKarten
              items={leistungen.map((service) => ({
                title: service.localTitle,
                description: service.listDescription,
                href: service.href,
                linkLabel: `${service.title} ansehen`,
              }))}
              columns={leistungen.length === 4 ? 'four' : 'three'}
            />
          </div>
        </section>
      );
    })}

    <section id="ablauf" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So läuft Ihr Auftrag bei uns ab." />
        <ProcessList steps={ablauf} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zu den Leistungen." />
        <PageFAQ route="/leistungen" />
      </div>
    </section>

    <PageCTA
      title="Welche Leistung passt zu Ihrem Fahrzeug?"
      description="Wir beraten persönlich und finden den passenden Weg für Aufbereitung, Reparatur oder Schadenabwicklung."
      primaryLabel="Kontakt aufnehmen"
      primaryHref="/kontakt"
    />
  </BackdropLayout>
);

export default ServicesPage;
