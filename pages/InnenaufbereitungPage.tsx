import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, PricingGrid, ProcessList, SectionIntro } from '../components/PageBlocks';
import { aufbereitungKacheln, disinfectionServices } from '../data/detailing';

/**
 * Innenaufbereitung als eigene Leistungsseite (Backlog 1.9).
 *
 * Die Inhalte stammen aus `data/detailing.ts` (`detailingScopes`), wo sie mit der
 * Geschaeftsfuehrung abgestimmt sind. Auf `/fahrzeugaufbereitung-leipzig` steht
 * dazu nur noch ein eigenstaendig formulierter Teaser — nicht derselbe Text
 * (Dublettenvermeidung, SEO-GEO-STANDARDS.md §4.5).
 *
 * Abgrenzung zum Ratgeber `/autoaufbereitung-wissen/innenaufbereitung`: der
 * erklaert das Thema (informational), diese Seite verkauft die Leistung
 * (kommerziell). Beide verlinken wechselseitig, SEO-GEO §4.1.
 */

const innenLeistungen = [
  { title: 'Innenraum komplett', description: 'Intensive Reinigung des gesamten Innenraumes inklusive Cockpit und Oberflächen.' },
  { title: 'Polster oder Leder', description: 'Polstershampoonierung – alternativ materialgerechte Lederpflege.' },
  { title: 'Scheiben', description: 'Scheibenreinigung innen und außen.' },
  { title: 'Geruch und Luft', description: 'Geruchsentfernung und Behandlung belasteter Innenraumluft.' },
  { title: 'Motorreinigung', description: 'Auf Wunsch Motorreinigung im Rahmen der Premiumpflege.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung im Kfz-Handwerk seit 1998 – Aufbereitung, Karosserie und Lack aus einer Hand.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Aufbereitung, Lackierung, Karosserie, Smart/Spot Repair und Felgen an einem Standort.' },
  { title: 'Privat-, Geschäfts- und Flottenkunden', description: 'Erfahrung mit Privatkunden, Autohäusern und Firmenfuhrparks.' },
];

const InnenaufbereitungPage: React.FC = () => (
  // Stehendes Foto wie auf `/fahrzeugaufbereitung-leipzig` (User-Vorgabe 2026-09-02).
  // Motiv aus `aufbereitungKacheln`. Kein `zoom`: das Innenraum-Motiv (2400x1340) ist
  // querformatig und fuellt die Backdrop-Flaeche ohne sichtbare Bildkante.
  <BackdropLayout image={aufbereitungKacheln.innen}>
    <PageMeta
      canonical="/innenaufbereitung-leipzig"
      title="Innenaufbereitung Leipzig | Polster & Leder | CarCare Center"
      description="Innenaufbereitung Leipzig: Cockpit, Polsterreinigung oder Lederpflege, Scheiben und Geruchsentfernung. Intensiv Innenreinigung ab 199,00 € im Meisterbetrieb."
    />
    <PageHero
      eyebrow="Innenaufbereitung Leipzig"
      title="Innenaufbereitung in Leipzig."
      description="Die Innenaufbereitung reinigt und pflegt den kompletten Fahrzeuginnenraum – vom Cockpit über Polster und Leder bis in die Bereiche, die bei der normalen Wäsche ausgelassen werden. Auf Wunsch mit Geruchsentfernung und Behandlung belasteter Innenraumluft."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Innenaufbereitung Leipzig', 'Autoinnenreinigung Leipzig', 'Polsterreinigung Auto Leipzig', 'Geruchsentfernung Auto Leipzig']}
    />

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Innenaufbereitung"
          title="Was zur Innenaufbereitung gehört."
          description="Die Intensiv Innenreinigung kostet 199,00 € inklusive gesetzlicher Mehrwertsteuer und enthält die folgenden Schritte."
        />
        <ProcessList steps={innenLeistungen} />
      </div>
    </section>

    {/*
      Backlog 1.11: Ozon und Heissvernebelung sind hier als OPTIONAL BUCHBAR
      hinterlegt, nicht nur auf der Aufbereitungs-Bestandsseite. Wer gezielt die
      Innenaufbereitung sucht, ist genau die Zielgruppe fuer Geruchsbehandlung.
      Preise und Beschreibungen kommen aus `disinfectionServices` in
      data/detailing.ts — dieselbe Quelle wie dort, damit sie nicht auseinanderlaufen.
    */}
    <section id="optional" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Optional buchbar"
          title="Geruchsbehandlung zur Innenaufbereitung dazu."
          description="Sitzt der Geruch tiefer, als eine Reinigung erreicht, lassen sich diese beiden Verfahren zur Innenaufbereitung dazubuchen."
        />
        <PricingGrid
          items={disinfectionServices}
          ctaLabel="Termin anfragen"
          note="Alle Preise inkl. gesetzlicher Mehrwertsteuer, zusätzlich zur gebuchten Innenaufbereitung."
        />
      </div>
    </section>

    {/*
      TODO 1.18 – Beschreibungen ausstehend, Zulieferung André

      Die beiden Bezeichnungen stammen aus dem Kundenreview und sind belegt; die
      Beschreibungstexte liegen noch beim Kunden. BEWUSST KEINE PLATZHALTER:
      erfundener Text sieht im Review wie fertiger Text aus und geht so live.
    */}
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Exklusivleistungen" title="Alcantara-Lenkrad und Schaum-/Tornador-Verfahren." />
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {['Alcantara-Lenkrad ausbauen und aufarbeiten', 'Schaum-/Tornador-Verfahren'].map((leistung) => (
            <li key={leistung} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6 text-lg font-bold leading-tight text-gray-950">
              {leistung}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Center Leipzig" title="Aufbereitung im Meisterbetrieb, nicht in der Waschstraße." />
        <FeatureGrid items={usp} tone="translucent" />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Innenaufbereitung." />
        <PageFAQ route="/innenaufbereitung-leipzig" />
      </div>
    </section>

    <section className="bg-white px-6 py-16 md:py-20">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Zum Weiterlesen"
          title="Fachlich eingeordnet im Wissensbereich."
          description="Wie eine Innenaufbereitung abläuft, welche Kostenfaktoren es gibt und worauf bei Polstern und Leder zu achten ist, erklärt der Ratgeber unabhängig von der Beauftragung."
        />
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="/autoaufbereitung-wissen/innenaufbereitung" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Ratgeber Innenaufbereitung
          </a>
          <a href="/aussenaufbereitung-leipzig" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Außenaufbereitung ansehen
          </a>
        </div>
      </div>
    </section>

    <PageCTA
      title="Innenraum stark genutzt, verschmutzt oder riecht?"
      description="Beschreiben Sie uns den Zustand — wir sagen Ihnen, ob die Intensiv Innenreinigung reicht oder ob eine Geruchsbehandlung sinnvoll dazukommt."
      primaryLabel="Aufbereitungstermin anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default InnenaufbereitungPage;
