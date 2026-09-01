import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

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

const advantages = [
  {
    title: 'Ein Betrieb statt drei Werkstätten',
    description: 'Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung liegen auf über 3.000 m² im eigenen Haus. Ihr Fahrzeug wird zwischen den Schritten nicht weitergereicht — und Sie haben einen Ansprechpartner statt drei.',
  },
  {
    title: 'Feste Preise bei der Aufbereitung',
    description: 'Die Pflegepakete haben feste Preise: 169,00 € für die Außenpflege, 199,00 € für die Innenreinigung, 299,00 € für beides kombiniert. Sie wissen vorher, was es kostet.',
  },
  {
    title: 'Wir empfehlen die kleinere Lösung zuerst',
    description: 'Wo Spot-Repair fachlich ausreicht, raten wir dazu statt zur Komplettlackierung. Ist die Delle lackfrei zu drücken, wird gar nicht lackiert. Reicht das nicht aus, sagen wir das ebenso deutlich.',
  },
  {
    title: 'Sie verhandeln nicht mit der Versicherung',
    description: 'Auf Wunsch übernehmen wir Kostenvoranschlag, Schriftverkehr und die Abstimmung mit Versicherern, Agenturen und Gutachtern. Bei Hagelschäden rechnen wir direkt ab — ohne Anzahlung Ihrerseits.',
  },
  {
    title: 'Sie bleiben mobil',
    description: 'Für die Dauer der Reparatur organisieren wir nach Verfügbarkeit ein Werkstattersatzfahrzeug. Sprechen Sie uns bei der Terminvereinbarung darauf an.',
  },
  {
    title: 'Reparatur ohne Wertminderung',
    description: 'Die lackfreie Dellenentfernung ist lackschonend und im Nachhinein nicht nachweisbar — es entsteht keine Wertminderung. Sie ist von allen Versicherungen und Gutachtern anerkannt.',
  },
  {
    title: 'Farbtongenau als Glasurit-Lackpartner',
    description: 'Ziel jeder Lackreparatur ist, dass weder Farbton noch Effektunterschiede zur Originallackierung für das Auge erkennbar sind — mit umweltschonenden Wasserbasislacken.',
  },
  {
    title: 'Markenunabhängig und erfahren',
    description: 'Meisterbetrieb des Kfz-Lackierhandwerks seit 1998, über 50 Mitarbeiter, alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.',
  },
];

const services = [
  {
    title: 'Fahrzeugaufbereitung',
    description: 'Innen- und Außenaufbereitung, Lackreinigung, Politur und Versiegelung — mit festen Paketpreisen ab 169,00 €.',
    href: '/fahrzeugaufbereitung-leipzig',
  },
  {
    title: 'Unfallschaden & Reparatur',
    description: 'Schadenaufnahme, Kalkulation und Instandsetzung aus einer Hand — auf Wunsch inklusive Abstimmung mit Versicherung und Gutachter.',
    href: '/unfallinstandsetzung-leipzig',
  },
  {
    title: 'Smart Repair',
    description: 'Bei kleineren Lackschäden bearbeiten wir gezielt nur die betroffene Stelle statt des ganzen Bauteils — weniger aufwendig als eine Komplettlackierung.',
    href: '/smart-repair-leipzig',
  },
  {
    title: 'Dellen ohne Lackieren',
    description: 'Parkplatzdellen bei intaktem Lack entfernen wir lackfrei. Von Versicherungen und Gutachtern anerkannt, ohne Wertminderung.',
    href: '/dellenentfernung-leipzig',
  },
  {
    title: 'Neu- und Reparaturlackierung',
    description: 'Farbtongenaue Lackierung als Glasurit-Lackpartner — ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung.',
    href: '/autolackierung-leipzig',
  },
  {
    title: 'Hagelschaden',
    description: 'Kalkulation über das anerkannte System Audatex, komplette Abwicklung mit Ihrer Versicherung — ohne Anzahlung.',
    href: '/hagelschadenreparatur-leipzig',
  },
  {
    title: 'Felgenreparatur',
    description: 'Bordstein- und Korrosionsschäden bis 1 mm Tiefe im TÜV-zertifizierten Verfahren — auch an glanzgedrehten Felgen.',
    href: '/felgenreparatur-leipzig',
  },
  {
    title: 'Autoglas & Scheibenfolien',
    description: 'Steinschlagreparatur, Scheibentausch und Folierungen als WINTEC-Partner, mit 30 Jahren Garantie.',
    href: '/autoglas-leipzig',
  },
];

const situations = [
  { title: 'Vor dem Fahrzeugverkauf', description: 'Ein aufbereitetes Fahrzeug wirkt gepflegter und lässt sich besser präsentieren. Die Premiumpflege für 299,00 € kombiniert dafür Innen- und Außenaufbereitung.', href: '/fahrzeugaufbereitung-leipzig#preise' },
  { title: 'Vor der Leasingrückgabe', description: 'Der Rückgabegutachter bewertet Dellen, Lackschäden, Felgen und Innenraum nach den Sätzen des Leasinggebers. Vorher instand gesetzt, ist vieles davon günstiger.', href: '/leasingrueckgabe-leipzig' },
  { title: 'Nach einem Unfall', description: 'Wir nehmen den Schaden auf, kalkulieren nachvollziehbar und übernehmen auf Wunsch die komplette Abstimmung mit der Versicherung.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Nach dem Parkplatzrempler', description: 'Kleine Dellen und Kratzer müssen kein Fall für die Komplettlackierung sein — wir prüfen zuerst die lackfreie Variante und Spot-Repair.', href: '/dellenentfernung-leipzig' },
];

const steps = [
  { title: 'Melden', description: 'Rufen Sie an oder schildern Sie Ihr Anliegen über das Formular. Fotos des Schadens helfen uns bei der ersten Einschätzung.' },
  { title: 'Fahrzeug ansehen', description: 'Wir begutachten das Fahrzeug vor Ort in Leipzig und besprechen, welcher Weg fachlich und wirtschaftlich sinnvoll ist.' },
  { title: 'Preis klären', description: 'Bei der Aufbereitung gelten die festen Paketpreise. Bei Reparaturen erhalten Sie einen Kostenvoranschlag; im Versicherungsfall übernehmen wir auf Wunsch die Abstimmung.' },
  { title: 'Reparatur & Übergabe', description: 'Wir arbeiten das Fahrzeug ab und übergeben es gereinigt zurück — mit Erklärung, was gemacht wurde.' },
];

const faqs = [
  {
    id: 'vorteil',
    question: 'Was habe ich als Privatkunde vom CarCare Center gegenüber einer Vertragswerkstatt?',
    answer: 'Sie bekommen Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung an einem Standort statt bei mehreren Betrieben, mit einem festen Ansprechpartner. Wir sind markenunabhängig, arbeiten als Glasurit-Lackpartner farbtongenau und empfehlen grundsätzlich die kleinere Reparaturlösung, wo sie fachlich ausreicht.',
  },
  {
    id: 'kosten',
    question: 'Was kostet die Aufbereitung meines Autos?',
    answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider 299,00 €. Die Premiumpflege „exklusiv“ beginnt bei 348,00 €. Alle Preise inklusive gesetzlicher Mehrwertsteuer. Für Reparaturen erhalten Sie einen individuellen Kostenvoranschlag, weil der Aufwand vom Schadenbild abhängt.',
  },
  {
    id: 'termin',
    question: 'Brauche ich als Privatkunde einen Termin?',
    answer: 'Für Aufbereitung und planbare Reparaturen ist ein Termin sinnvoll, damit Ihr Fahrzeug ohne Wartezeit bearbeitet wird. Bei einem frischen Unfallschaden melden Sie sich direkt telefonisch unter 0341 - 261 77 90 — wir besprechen dann das weitere Vorgehen.',
  },
  {
    id: 'marken',
    question: 'Arbeitet das CarCare Center an allen Fahrzeugmarken?',
    answer: 'Ja. Als markenunabhängiger Meisterbetrieb bearbeiten wir alle Marken — vom Kleinwagen bis zum Premiumfahrzeug.',
  },
  {
    id: 'versicherung',
    question: 'Muss ich den Schaden selbst mit der Versicherung klären?',
    answer: 'Nein. Auf Wunsch übernehmen wir die komplette Abwicklung: Kostenvoranschlag, Abstimmung mit Versicherern und Gutachtern sowie die Kommunikation während der Reparatur. Bei einem Hagelschaden rechnen wir direkt mit der Versicherung ab, eine Anzahlung ist nicht nötig.',
  },
  {
    id: 'klein',
    question: 'Lohnt sich eine Reparatur auch bei kleinen Schäden?',
    answer: 'Häufig ja. Bei kleineren Lackschäden ist Spot-Repair unsere bevorzugte Methode, weil nur der betroffene Bereich bearbeitet wird. Bei Dellen mit intaktem Lack entfällt das Lackieren sogar ganz. Beides ist deutlich weniger aufwendig als eine Komplettlackierung.',
  },
  {
    id: 'leasing',
    question: 'Kann das CarCare Center mein Auto auf die Leasingrückgabe vorbereiten?',
    answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe und setzen Gebrauchsspuren fachgerecht instand, um vermeidbare Nachbelastungen durch den Rückgabegutachter zu reduzieren.',
  },
  {
    id: 'mobil',
    question: 'Bleibe ich während der Reparatur mobil?',
    answer: 'Nach Verfügbarkeit stellen wir Ihnen ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.',
  },
];

const PrivatkundenPage: React.FC = () => (
  // Motiv der Kachel „Privatkunden" aus „Fuer wen wir arbeiten" (Startseite).
  <BackdropLayout image="/assets/kacheln/privatkunden-leipzig-carcare.webp">
    <PageMeta
      canonical="/privatkunden"
      title="Privatkunden Leipzig | Ihre Vorteile bei CarCare Center"
      description="Ihre Vorteile als Privatkunde im CarCare Center Leipzig: alles an einem Standort, feste Aufbereitungspreise ab 169 €, Versicherungsabwicklung inklusive und Ersatzfahrzeug."
    />
    <PageHero
      eyebrow="Privatkunden"
      title="Ihr Auto in Leipzig – gepflegt, repariert und wieder wie neu."
      description="Ob Aufbereitung, Parkplatzdelle, Steinschlag oder Unfallschaden: Im CarCare Center Leipzig übernehmen wir Pflege, Reparatur und Lackierung an einem Standort — als Meisterbetrieb und Glasurit-Lackpartner seit 1998, für alle Marken."
      primaryCta={{ label: 'Termin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Schaden melden', href: '/kontakt#contact-schaden' }}
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
          description="Vier Situationen, in denen sich der Gang in den Fachbetrieb rechnet — mit dem jeweils passenden Einstieg."
        />
        <FeatureGrid items={situations} columns="four" />
      </div>
    </section>

    <section id="leistungen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Leistungen für Privatkunden"
          title="Was wir für Ihr Fahrzeug tun können."
          description="Von der Pflege bis zum Unfallschaden — wählen Sie den Bereich, der zu Ihrem Anliegen passt."
        />
        <FeatureGrid items={services} columns="four" />
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
        <PageFAQ faqs={faqs} />
      </div>
    </section>

    <PageCTA
      title="Sagen Sie uns, was Ihr Auto braucht."
      description="Beschreiben Sie Ihr Anliegen oder senden Sie Fotos des Schadens — wir schätzen ein, welcher Weg für Ihr Fahrzeug der passende ist."
      primaryLabel="Anfrage starten"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default PrivatkundenPage;
