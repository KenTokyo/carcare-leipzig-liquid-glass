import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';
import LeistungsKarten from '../components/LeistungsKarten';
import { SCHADEN_ZIEL } from '../data/schadenmeldung';
import { privatkundenVorteile } from '../data/privatkunden';

/**
 * Zielgruppenseite Privatkunden — Gegenstueck zu `BusinessCustomersPage`.
 *
 * Schwerpunkt laut Auftrag: die **Vorteile** fuer Privatkunden herausarbeiten.
 *
 * Inhaltliche Leitplanke: Alle Aussagen sind durch bereits im Projekt belegte Angaben
 * gedeckt (CLAUDE.md §0, bestehende Leistungsseiten, Preisliste in `data/detailing.ts`).
 * Preise werden nur dort genannt, wo sie tatsaechlich vorliegen — das ist die
 * Aufbereitung. Fuer Reparaturen gibt es keine Listenpreise; dort wird bewusst der
 * Kostenvoranschlag genannt statt einer erfundenen Spanne.
 */

/**
 * Vorteile: Lang- und Kurzfassung stehen seit Backlog 6.4 (2026-09-28) in `data/privatkunden.ts` — die Kurzfassung
 * steht als Textkachel auf der Privatkunden-Karte der Startseite. Hier die Langfassung.
 */
const advantages = privatkundenVorteile.map(({ title, beschreibung }) => ({ title, description: beschreibung }));

const services = [
  {
    title: 'Fahrzeugaufbereitung',
    description: 'Innen- und Außenaufbereitung, Politur und Versiegelung, mit festen Paketpreisen ab 169 €.',
    href: '/fahrzeugaufbereitung-leipzig',
  },
  {
    title: 'Unfallschaden & Reparatur',
    description: 'Schadenaufnahme, Kalkulation und Instandsetzung aus einer Hand, auf Wunsch inklusive Abstimmung mit Versicherung und Gutachter.',
    href: '/unfallinstandsetzung-leipzig',
  },
  {
    title: 'Smart Repair',
    description: 'Bei kleineren Lackschäden bearbeiten wir gezielt nur die betroffene Stelle statt des ganzen Bauteils, weniger aufwendig als eine Komplettlackierung.',
    href: '/smart-repair-leipzig',
  },
  {
    title: 'Dellen ohne Lackieren',
    description: 'Parkplatzdellen bei intaktem Lack entfernen wir lackfrei. Der Originallack bleibt erhalten, die Methode ist bei Versicherungen und Gutachtern anerkannt.',
    href: '/dellenentfernung-leipzig',
  },
  {
    title: 'Neu- und Reparaturlackierung',
    description: 'Farbtongenaue Lackierung als Glasurit-Lackpartner, ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung.',
    href: '/autolackierung-leipzig',
  },
  {
    title: 'Hagelschaden',
    description: 'Kalkulation über das anerkannte System Audatex, komplette Abwicklung mit Ihrer Versicherung, ohne Anzahlung.',
    href: '/hagelschadenreparatur-leipzig',
  },
  {
    title: 'Felgenreparatur',
    description: 'Bordstein- und Korrosionsschäden bis 1 mm Tiefe im TÜV-zertifizierten Verfahren, auch an glanzgedrehten Felgen.',
    href: '/felgenreparatur-leipzig',
  },
  {
    title: 'Autoglas & Scheibenfolien',
    description: 'Steinschlagreparatur, Scheibentausch und Folierungen als WINTEC-Partner, mit 30 Jahren Garantie.',
    href: '/autoglas-leipzig',
  },
];

const situations = [
  { title: 'Vor dem Fahrzeugverkauf', description: 'Ein aufbereitetes Fahrzeug wirkt gepflegter und lässt sich besser präsentieren. Die Premiumpflege ab 299 € kombiniert dafür Innen- und Außenaufbereitung.', href: '/fahrzeugaufbereitung-leipzig#preise' },
  { title: 'Vor der Leasingrückgabe', description: 'Der Rückgabegutachter bewertet Dellen, Lackschäden, Felgen und Innenraum nach den Sätzen des Leasinggebers. Vorher instand gesetzt, ist vieles davon günstiger.', href: '/leasingrueckgabe-leipzig' },
  { title: 'Nach einem Unfall', description: 'Wir nehmen den Schaden auf, kalkulieren nachvollziehbar und übernehmen auf Wunsch die komplette Abstimmung mit der Versicherung.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Nach dem Parkplatzrempler', description: 'Kleine Dellen und Kratzer müssen kein Fall für die Komplettlackierung sein. Wir prüfen zuerst die lackfreie Variante und Spot-Repair.', href: '/dellenentfernung-leipzig' },
];

const steps = [
  { title: 'Melden', description: 'Rufen Sie an oder schildern Sie Ihr Anliegen online. Einen Schaden melden Sie samt Fotos über unsere Schadenseite auf reparatur.info. Das hilft uns bei der ersten Einschätzung.' },
  { title: 'Fahrzeug ansehen', description: 'Wir begutachten das Fahrzeug vor Ort in Leipzig und besprechen, welcher Weg fachlich und wirtschaftlich sinnvoll ist.' },
  { title: 'Preis klären', description: 'Bei der Aufbereitung gelten die festen Paketpreise. Bei Reparaturen erhalten Sie einen Kostenvoranschlag; im Versicherungsfall übernehmen wir auf Wunsch die Abstimmung.' },
  { title: 'Reparatur & Übergabe', description: 'Wir erledigen alle Arbeiten im eigenen Haus und geben Ihnen das Fahrzeug gereinigt zurück, mit einer Erklärung, was wir gemacht haben.' },
];

const PrivatkundenPage: React.FC = () => (
  // Motiv der Kachel „Privatkunden" aus „Fuer wen wir arbeiten" (Startseite).
  <BackdropLayout image="/assets/kacheln/privatkunden-leipzig-carcare.webp">
    <PageMeta
      canonical="/privatkunden"
      title="Privatkunden Leipzig | Ihre Vorteile bei CarCare Center"
      description="Ihre Vorteile als Privatkunde in Leipzig: alles an einem Standort, feste Aufbereitungspreise ab 169 €, Versicherungsabwicklung inklusive und Ersatzwagen."
    />
    <PageHero
      eyebrow="Privatkunden"
      title="Ihr Auto in Leipzig, gepflegt, repariert und wieder wie neu."
      description="Ob Aufbereitung, Parkplatzdelle, Steinschlag oder Unfallschaden: Im CarCare Center Leipzig übernehmen wir Pflege, Reparatur und Lackierung an einem Standort, als Meisterbetrieb seit 1998 und Glasurit-Lackpartner, für alle Marken."
      primaryCta={{ label: 'Termin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Schaden melden', href: SCHADEN_ZIEL }}
      keywords={['Autoaufbereitung Leipzig', 'Autoreparatur Leipzig', 'Smart Repair Leipzig', 'Leasingrückgabe Leipzig']}
    />

    <section id="vorteile" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Ihre Vorteile"
          title="Warum Privatkunden zu uns kommen."
          description="Nicht Werbeversprechen, sondern das, was im Alltag den Unterschied macht: kurze Wege, klare Preise und eine ehrliche Empfehlung zur Reparaturmethode."
        />
        <FeatureGrid items={advantages} columns="four" />
      </div>
    </section>

    <section id="situationen" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Typische Anlässe"
          title="Wann Privatkunden uns brauchen."
          description="Vier Situationen, in denen sich der Gang in den Fachbetrieb rechnet, mit dem jeweils passenden Einstieg."
        />
        <FeatureGrid items={situations} columns="four" />
      </div>
    </section>

    <section id="leistungen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Leistungen für Privatkunden"
          title="Was wir für Ihr Fahrzeug tun können."
          description="Wählen Sie den Bereich, der zu Ihrem Anliegen passt, von der Pflege bis zum Unfallschaden."
        />
        {/* Backlog-Design 2026-09-07: dieselbe Kartenform wie auf den uebrigen Seiten. */}
        <LeistungsKarten items={services} columns="four" />
      </div>
    </section>

    <section id="ablauf" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So läuft Ihr Auftrag bei uns ab." />
        <ProcessList steps={steps} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen von Privatkunden." />
        <PageFAQ route="/privatkunden" />
      </div>
    </section>

    <PageCTA
      title="Sagen Sie uns, was Ihr Auto braucht."
      description="Beschreiben Sie Ihr Anliegen oder senden Sie Fotos des Schadens. Wir schätzen ein, welcher Weg für Ihr Fahrzeug der passende ist."
      primaryLabel="Anfrage starten"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default PrivatkundenPage;
