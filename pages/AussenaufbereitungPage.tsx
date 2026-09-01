import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

/**
 * Aussenaufbereitung als eigene Leistungsseite (Backlog 1.8).
 *
 * Traegt bewusst AUCH die Lackaufbereitung ausfuehrlich: Der Kunde hat im Review
 * festgelegt, dass die Lackaufbereitung keine eigene Kachel mehr bekommt (1.7),
 * sondern hier vollstaendig aufgeht. Deshalb zwei fachliche Sektionen statt einer.
 *
 * Die Inhalte stammen aus `data/detailing.ts` (`detailingScopes`), wo sie mit der
 * Geschaeftsfuehrung abgestimmt sind. Auf `/fahrzeugaufbereitung-leipzig` steht
 * dazu nur noch ein eigenstaendig formulierter Teaser — nicht derselbe Text
 * (Dublettenvermeidung, SEO-GEO-STANDARDS.md §4.5).
 */

const aussenLeistungen = [
  { title: 'Vorreinigung und Felgen', description: 'Intensive Vorreinigung und Felgenreinigung.' },
  { title: 'Insektenentfernung', description: 'Rückstände an Front, Spiegeln und Scheiben werden gezielt gelöst.' },
  { title: 'Schonende Oberwäsche', description: 'Schonende Oberwäsche inklusive Abledern.' },
  { title: 'Lackreinigung', description: 'Lackreinigung als Grundlage für die weitere Bearbeitung.' },
  { title: 'Scheibenreinigung', description: 'Scheibenreinigung als Abschluss der Außenpflege.' },
];

const lackLeistungen = [
  { title: 'Lackreinigung', description: 'Lackreinigung und Entfernung typischer Anhaftungen.' },
  { title: 'Hochglanzpolitur', description: 'Hochglanzpolitur für glattere Oberflächen und sichtbaren Glanz.' },
  { title: 'Lackversiegelung', description: 'Lackversiegelung für Schutz und Werterhalt.' },
  { title: 'SWIZÖL-Wachse', description: 'Auf Wunsch Wachse von SWIZÖL mit 30 bis 60 % Carnaubaanteil.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Aufbereitung, Lackierung, Karosserie, Smart/Spot Repair und Felgen aus einer Hand.' },
  { title: 'Privat-, Geschäfts- und Flottenkunden', description: 'Erfahrung mit Privatkunden, Autohäusern und Firmenfuhrparks.' },
];

const AussenaufbereitungPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/aussenaufbereitung-leipzig"
      title="Außenaufbereitung Leipzig | Politur & Lack | CarCare Center"
      description="Außenaufbereitung in Leipzig: Vorreinigung, Oberwäsche, Lackreinigung, Hochglanzpolitur und Versiegelung. Brillant Außenpflege ab 169,00 € im Meisterbetrieb."
    />
    <PageHero
      eyebrow="Außenaufbereitung Leipzig"
      title="Außen- und Lackaufbereitung in Leipzig."
      description="Die Außenaufbereitung entfernt Verschmutzungen, die eine gewöhnliche Wäsche stehen lässt, und bereitet den Lack auf Politur und Versiegelung vor. Die Lackaufbereitung arbeitet anschließend die Lackoberfläche selbst auf. Beides lässt sich einzeln oder kombiniert beauftragen."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Außenaufbereitung Leipzig', 'Lackaufbereitung Leipzig', 'Autopolitur Leipzig', 'Lackversiegelung Leipzig']}
    />

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Außenaufbereitung"
          title="Was zur Außenaufbereitung gehört."
          description="Die Brillant Außenpflege kostet 169,00 € inklusive gesetzlicher Mehrwertsteuer und enthält die folgenden Schritte."
        />
        <FeatureGrid items={aussenLeistungen} />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Lackaufbereitung"
          title="Wie wir die Lackoberfläche aufarbeiten."
          description="Die Lackaufbereitung entfernt Anhaftungen und matte Stellen, holt Glanz zurück und schützt das Ergebnis anschließend."
        />
        <FeatureGrid items={lackLeistungen} />
      </div>
    </section>

    {/*
      TODO 1.18 – Beschreibungen ausstehend, Zulieferung André

      Die drei Bezeichnungen stammen aus dem Kundenreview und sind belegt; die
      Beschreibungstexte liegen noch beim Kunden. BEWUSST KEINE PLATZHALTER:
      erfundener Text sieht im Review wie fertiger Text aus und geht so live.
    */}
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Exklusivleistungen" title="Keramikversiegelung, Nanoversiegelung und Lackbausteine." />
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {['Keramikversiegelung', 'Nanoversiegelung', 'Lackbausteine'].map((leistung) => (
            <li key={leistung} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6 text-lg font-bold leading-tight text-gray-950">
              {leistung}
            </li>
          ))}
        </ul>
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Center Leipzig" title="Aufbereitung im Meisterbetrieb, nicht in der Waschstraße." />
        <FeatureGrid items={usp} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Außen- und Lackaufbereitung." />
        <PageFAQ route="/aussenaufbereitung-leipzig" />
      </div>
    </section>

    <PageCTA
      title="Lack matt, stumpf oder verschmutzt?"
      description="Sagen Sie uns, in welchem Zustand das Fahrzeug ist und was Sie erreichen wollen — wir empfehlen den passenden Umfang zwischen Außenpflege und vollständiger Lackaufbereitung."
      primaryLabel="Aufbereitungstermin anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </>
);

export default AussenaufbereitungPage;
