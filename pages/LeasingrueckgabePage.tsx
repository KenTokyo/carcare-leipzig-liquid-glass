import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

/**
 * Leistungsseite Leasingrueckgabe.
 *
 * WARUM EIGENE SEITE: Die Kachel „Leasingrueckgabe" zeigte bis 2026-08-09 auf
 * `/fahrzeugaufbereitung-leipzig` (TODO in `data/services.ts`). Damit liefen drei
 * verschiedene Startseiten-Karten auf dasselbe Ziel — vier Anker, ein Ziel.
 *
 * ABGRENZUNG ZUM RATGEBER: `/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten` bedient
 * die informationale Suchintention („wie bereite ich vor?"). Diese Seite bedient die
 * kommerzielle („wer macht das in Leipzig?"). Keine Vermischung — SEO-GEO-STANDARDS §4.1.
 * Beide verlinken sich gegenseitig.
 *
 * ZIELGRUPPEN: Laut Auftrag ausdruecklich BEIDE — Privatkunden und Geschaeftskunden.
 * Deshalb zwei eigene Abschnitte statt eines gemischten Texts.
 *
 * FAKTENLAGE: Fuer die Leasingrueckgabe gibt es keine Listenpreise, weil der Aufwand am
 * Schadenbild haengt. Genannt wird daher der Kostenvoranschlag. Die Aufbereitungspreise
 * (169/199/299 EUR) sind belegt und duerfen zitiert werden.
 */

const gutachterChecks = [
  {
    title: 'Was der Rückgabegutachter bewertet',
    description: 'Lackschäden, Beschädigungen an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe sowie der Zustand des Innenraums fließen in das Rückgabeprotokoll ein.',
  },
  {
    title: 'Was als normale Abnutzung gilt',
    description: 'Gebrauchsspuren, die sich bei vertragsgemäßer Nutzung nicht vermeiden lassen, sind in der Regel abgedeckt. Die Grenze zieht der Leasingvertrag — sie ist je nach Anbieter unterschiedlich.',
  },
  {
    title: 'Warum die Reparatur vorab günstiger ist',
    description: 'Der Leasinggeber rechnet festgestellte Schäden nach eigenen Sätzen ab. Eine vorherige Instandsetzung im Fachbetrieb reduziert vermeidbare Nachbelastungen.',
  },
  {
    title: 'Wann Sie starten sollten',
    description: 'Planen Sie den Termin einige Wochen vor der Rückgabe. So bleibt Zeit für Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin eng wird.',
  },
];

const repairs = [
  {
    title: 'Dellen ohne Lackieren',
    description: 'Parkplatzdellen bei intaktem Lack drücken wir lackfrei aus. Die Methode ist im Nachhinein nicht nachweisbar, verursacht keine Wertminderung und ist von Versicherungen und Gutachtern anerkannt.',
    href: '/dellenentfernung-leipzig',
  },
  {
    title: 'Spot-Repair bei Lackschäden',
    description: 'Bei kleineren Kratzern und Lackschäden bearbeiten wir gezielt nur die betroffene Stelle statt des ganzen Bauteils — deutlich weniger aufwendig als eine Komplettlackierung.',
    href: '/smart-repair-leipzig',
  },
  {
    title: 'Felgen mit Bordsteinschäden',
    description: 'Bordstein- und Korrosionsschäden bis 1 mm Tiefe setzen wir im TÜV-zertifizierten Verfahren instand — auch an glanzgedrehten Felgen.',
    href: '/felgenreparatur-leipzig',
  },
  {
    title: 'Steinschlag und Scheibenschäden',
    description: 'Steinschläge reparieren wir, wo es fachlich vertretbar ist; sonst tauschen wir die Scheibe. Als WINTEC-Partner mit 30 Jahren Garantie auf die Verglasung.',
    href: '/autoglas-leipzig',
  },
  {
    title: 'Größere Lack- und Karosserieschäden',
    description: 'Reicht Spot-Repair nicht aus, lackieren wir farbtongenau als Glasurit-Lackpartner — ohne für das Auge erkennbare Farbton- oder Effektunterschiede zur Originallackierung.',
    href: '/autolackierung-leipzig',
  },
  {
    title: 'Aufbereitung innen und außen',
    description: 'Der Innenraum fließt in die Bewertung ein. Die Intensiv Innenreinigung kostet 199,00 €, die Premiumpflege mit Außenaufbereitung 299,00 € — inklusive gesetzlicher Mehrwertsteuer.',
    href: '/fahrzeugaufbereitung-leipzig#preise',
  },
];

const privateBenefits = [
  {
    title: 'Erst prüfen, dann entscheiden',
    description: 'Wir sehen uns das Fahrzeug an und sagen Ihnen, was der Gutachter voraussichtlich anmerken wird und was sich davon wirtschaftlich vorher beheben lässt. Ohne Reparaturzwang.',
  },
  {
    title: 'Wir empfehlen die kleinere Lösung zuerst',
    description: 'Wo die Delle lackfrei zu drücken ist, wird nicht lackiert. Wo Spot-Repair reicht, gibt es keine Komplettlackierung. Reicht das nicht aus, sagen wir das ebenso deutlich.',
  },
  {
    title: 'Alles an einem Standort',
    description: 'Lack, Karosserie, Smart Repair, Felgen, Glas und Aufbereitung liegen auf 3.000 qm im eigenen Haus. Ihr Fahrzeug wird zwischen den Schritten nicht weitergereicht.',
  },
  {
    title: 'Sie bleiben mobil',
    description: 'Für die Dauer der Arbeiten organisieren wir nach Verfügbarkeit ein Werkstattersatzfahrzeug. Sprechen Sie uns bei der Terminvereinbarung darauf an.',
  },
];

const businessBenefits = [
  {
    title: 'Mehrere Fahrzeuge parallel',
    description: 'Auf 3.000 qm mit über 50 Mitarbeitern lassen sich auch mehrere Rückläufer gleichzeitig bearbeiten — relevant, wenn im Fuhrpark mehrere Verträge zum selben Termin auslaufen.',
  },
  {
    title: 'Fester Ansprechpartner',
    description: 'Ein Ansprechpartner für den gesamten Rückgabeprozess statt wechselnder Zuständigkeiten — mit strukturierten Abläufen und planbarer Rückmeldung.',
  },
  {
    title: 'Nachvollziehbare Kalkulation',
    description: 'Sie erhalten je Fahrzeug eine Aufstellung, was gemacht werden sollte und was es kostet. Damit lässt sich Reparatur gegen erwartete Nachbelastung abwägen.',
  },
  {
    title: 'Erfahrung mit Flotten und Autohäusern',
    description: 'CarCare arbeitet für Autohäuser, Firmenfuhrparks und Werksniederlassungen deutscher Premiumhersteller — wiederkehrende Abläufe sind eingespielt.',
  },
];

const steps = [
  { title: 'Termin vereinbaren', description: 'Melden Sie sich einige Wochen vor dem Rückgabetermin unter 0341 - 261 77 90 oder über das Formular. Nennen Sie dabei das Rückgabedatum.' },
  { title: 'Fahrzeug begutachten', description: 'Wir sehen uns Lack, Karosserie, Felgen, Glas und Innenraum an und gleichen den Zustand mit dem ab, was bei der Rückgabe bewertet wird.' },
  { title: 'Aufstellung erhalten', description: 'Sie bekommen einen Kostenvoranschlag mit klarer Empfehlung: was sich vorher lohnt und was Sie getrost dem Rückgabeprotokoll überlassen können.' },
  { title: 'Instandsetzen und aufbereiten', description: 'Wir arbeiten die freigegebenen Punkte ab — Dellen, Lack, Felgen, Glas — und bereiten das Fahrzeug innen und außen auf.' },
  { title: 'Fahrzeug übernehmen', description: 'Sie erhalten das Fahrzeug gereinigt zurück, mit Erklärung, was gemacht wurde. Danach geht es in die Rückgabe.' },
];

const faqs = [
  {
    id: 'lohnt',
    question: 'Lohnt es sich, vor der Leasingrückgabe reparieren zu lassen?',
    answer: 'In der Regel ja, wenn erkennbare Schäden vorliegen. Der Leasinggeber rechnet festgestellte Schäden nach seinen eigenen Sätzen ab, die meist über den Kosten einer Reparatur im Fachbetrieb liegen. Bei reiner Gebrauchsspur ohne Substanzschaden raten wir dagegen häufig ab — wir sagen Ihnen bei der Begutachtung, was in Ihrem Fall sinnvoll ist.',
  },
  {
    id: 'wann',
    question: 'Wie früh vor der Rückgabe sollte ich mich melden?',
    answer: 'Planen Sie einige Wochen Vorlauf ein. Dann bleibt genug Zeit für Begutachtung, Kostenvoranschlag, Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin knapp wird. Bei mehreren Fuhrparkfahrzeugen sollte der Vorlauf entsprechend größer sein.',
  },
  {
    id: 'was',
    question: 'Was bewertet der Rückgabegutachter?',
    answer: 'Bewertet werden unter anderem Lackschäden, Beschädigungen an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe und der Zustand des Innenraums. Normale Abnutzung bei vertragsgemäßer Nutzung ist in der Regel abgedeckt; wo genau die Grenze liegt, legt Ihr Leasingvertrag fest.',
  },
  {
    id: 'kosten',
    question: 'Was kostet die Vorbereitung auf die Leasingrückgabe?',
    answer: 'Für die Reparaturen gibt es keinen Listenpreis, weil der Aufwand vom Schadenbild abhängt — Sie erhalten dafür einen Kostenvoranschlag. Für die Aufbereitung gelten feste Preise: Intensiv Innenreinigung 199,00 €, Premiumpflege mit Innen- und Außenaufbereitung 299,00 €, jeweils inklusive gesetzlicher Mehrwertsteuer.',
  },
  {
    id: 'wertminderung',
    question: 'Entsteht durch die Reparatur eine Wertminderung?',
    answer: 'Bei der lackfreien Dellenentfernung nicht: Sie ist lackschonend und im Nachhinein nicht nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur — als Glasurit-Lackpartner arbeiten wir farbtongenau, sodass weder Farbton noch Effektunterschiede für das Auge erkennbar sind.',
  },
  {
    id: 'fuhrpark',
    question: 'Bereitet CarCare auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?',
    answer: 'Ja. Auf 3.000 qm mit über 50 Mitarbeitern lassen sich mehrere Rückläufer parallel bearbeiten. Sie erhalten einen festen Ansprechpartner und je Fahrzeug eine nachvollziehbare Aufstellung, sodass sich Reparaturkosten gegen die erwartete Nachbelastung abwägen lassen.',
  },
  {
    id: 'ersatz',
    question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?',
    answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.',
  },
  {
    id: 'marken',
    question: 'Gilt das für alle Fahrzeugmarken?',
    answer: 'Ja. CarCare ist ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeitet alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.',
  },
];

const LeasingrueckgabePage: React.FC = () => (
  // Motiv der Kachel „Leasingrueckgabe" aus der Leistungsuebersicht.
  <BackdropLayout image="/assets/kacheln/leasingrueckgabe-leipzig-carcare.webp">
    <PageMeta
      canonical="/leasingrueckgabe-leipzig"
      title="Leasingrückgabe Leipzig | Fahrzeug vorbereiten | CarCare"
      description="Fahrzeug vor der Leasingrückgabe prüfen und instand setzen lassen: Dellen, Lack, Felgen, Glas und Aufbereitung in Leipzig – für Privatkunden und Fuhrparks."
    />
    <PageHero
      eyebrow="Leasingrückgabe Leipzig"
      title="Leasingrückgabe vorbereiten – bevor der Gutachter abrechnet."
      description="Bei der Rückgabe bewertet ein Gutachter den Fahrzeugzustand und rechnet Schäden nach den Sätzen des Leasinggebers ab. Vieles davon lässt sich vorher im Fachbetrieb günstiger beheben. CarCare Leipzig begutachtet, setzt instand und bereitet auf – für Privatkunden und Fuhrparks."
      primaryCta={{ label: 'Fahrzeug begutachten lassen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Leasingrückgabe Leipzig', 'Leasingfahrzeug aufbereiten', 'Dellen entfernen Leipzig', 'Smart Repair Leipzig']}
    />

    {/* Antwort-zuerst (SEO-GEO §4.3): Die haeufigste Frage — „was wird bewertet und
        warum vorher reparieren" — steht als erster inhaltlicher Block. */}
    <section id="bewertung" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Worum es geht"
          title="Was bei der Rückgabe bewertet wird – und was das kostet."
          description="Der Rückgabegutachter dokumentiert den Fahrzeugzustand im Rückgabeprotokoll. Was über normale Abnutzung hinausgeht, wird nach den Sätzen des Leasinggebers berechnet."
        />
        <FeatureGrid items={gutachterChecks} columns="four" />
      </div>
    </section>

    <section id="privatkunden" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Für Privatkunden"
          title="Ein Fahrzeug, ein Termin, eine ehrliche Einschätzung."
          description="Sie geben Ihr Leasingfahrzeug zurück und wollen wissen, was vorher noch gemacht werden sollte. Wir sehen es uns an und sagen Ihnen, was sich rechnet."
        />
        <FeatureGrid items={privateBenefits} columns="four" />
      </div>
    </section>

    <section id="geschaeftskunden" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Für Geschäftskunden & Fuhrparks"
          title="Mehrere Rückläufer, ein Ansprechpartner."
          description="Laufen im Fuhrpark mehrere Leasingverträge zum selben Zeitpunkt aus, wird die Rückgabe zum Planungsthema. CarCare bearbeitet Rückläufer gebündelt und nachvollziehbar kalkuliert."
        />
        <FeatureGrid items={businessBenefits} columns="four" />
        <div className="mt-8">
          <a href="/geschaeftskunden" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Zum Geschäftskundenservice
          </a>
        </div>
      </div>
    </section>

    <section id="leistungen" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Was wir vorher instand setzen"
          title="Von der Parkplatzdelle bis zur Innenraumaufbereitung."
          description="Alle Arbeiten laufen im eigenen Haus — Sie müssen für Delle, Lack, Felge, Glas und Aufbereitung nicht vier Betriebe ansteuern."
        />
        <FeatureGrid items={repairs} columns="three" />
      </div>
    </section>

    <section id="ablauf" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Ablauf"
          title="So bereiten wir Ihre Leasingrückgabe vor."
          description="Fünf Schritte von der Terminvereinbarung bis zur Übergabe des vorbereiteten Fahrzeugs."
        />
        <ProcessList steps={steps} />
        <div className="mt-8">
          <a href="/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Ausführlicher Ratgeber zur Leasingrückgabe
          </a>
        </div>
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Leasingrückgabe." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>

    <PageCTA
      title="Wann geben Sie Ihr Fahrzeug zurück?"
      description="Melden Sie sich einige Wochen vorher. Wir sehen uns das Fahrzeug an und sagen Ihnen, was sich vor der Rückgabe wirklich lohnt."
      primaryLabel="Begutachtung anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default LeasingrueckgabePage;
