import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';

const scope = [
  { title: 'TÜV-zertifiziertes Verfahren', description: 'Als zertifizierter Wheel-Doctor-Fachbetrieb arbeiten wir nach den strengen gesetzlichen TÜV-Richtlinien.' },
  { title: 'Bis zu 90 % der Schäden', description: 'Bis zu 90 % der Bordstein- und Korrosionsschäden lassen sich kostengünstig beheben.' },
  { title: 'Bis 1 mm Tiefe zulässig', description: 'Beschädigungen bis zu 1 mm Tiefe im Grundmetall der Felge dürfen behoben werden.' },
  { title: 'Keine Eingriffe ins Materialgefüge', description: 'Schweißarbeiten und Rückverformungen sind gesetzlich abzulehnen und werden nicht durchgeführt.' },
  { title: 'Glanzgedrehte Felgen', description: 'Auch glanzgedrehte, im Volksmund polierte Alufelgen lassen wir wieder optisch wie neu erscheinen.' },
  { title: 'Werterhalt statt Neukauf', description: 'Statt der teuren Anschaffung neuer Originalfelgen bleibt der Wert des Fahrzeugs erhalten.' },
];

const faqs = [
  { id: 'welche', question: 'Welche Felgenschäden dürfen repariert werden?', answer: 'Behoben werden dürfen Bordstein- und Korrosionsschäden bis zu 1 mm Tiefe im Grundmetall der Felge. Eingriffe in das Materialgefüge wie Schweißarbeiten und Rückverformungen sind gesetzlich grundsätzlich abzulehnen.' },
  { id: 'sicher', question: 'Ist die Reparatur TÜV-konform und sicher?', answer: 'Wir arbeiten mit einem TÜV-zertifizierten Alufelgenreparaturverfahren als zertifizierter Wheel-Doctor-Fachbetrieb und kennen alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien. Nicht in jedem Fall ist eine Felgenreparatur erlaubt.' },
  { id: 'poliert', question: 'Repariert ihr auch polierte bzw. glanzgedrehte Felgen?', answer: 'Ja. Auch glanzgedrehte, im Volksmund polierte Alufelgen können wir wieder optisch wie neu erscheinen lassen.' },
  { id: 'anteil', question: 'Wie viele Felgenschäden lassen sich beheben?', answer: 'Mit unserem Verfahren können bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig behoben werden – statt teure neue Originalfelgen anzuschaffen.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1993', description: 'Über 30 Jahre Erfahrung im Kfz-Lackier- und Karosseriehandwerk.' },
  { title: 'Full-Service auf 3.000 m²', description: 'Felgen, Lackierung, Karosserie, Smart/Spot Repair und Fahrzeugaufbereitung aus einer Hand.' },
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue Lackierung der Felgen für ein Ergebnis optisch wie neu.' },
];

const FelgenreparaturPage: React.FC = () => (
  <>
    <PageMeta canonical="/felgenreparatur-leipzig" title="Felgenreparatur Leipzig | TÜV-zertifiziert, Wheel-Doctor | CarCare" description="Felgenreparatur in Leipzig: TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb – bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig behoben." />
    <PageHero
      eyebrow="Felgenreparatur Leipzig"
      title="Felgenreparatur in Leipzig."
      description="Einmal versehentlich am Bordstein entlang geschrammt und schon ist die Alufelge beschädigt – nicht nur die Optik leidet, auch der Wert des Fahrzeugs sinkt. Mit unserem TÜV-zertifizierten Alufelgenreparaturverfahren beheben wir bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig."
      primaryCta={{ label: 'Felgenreparatur anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Felgenreparatur Leipzig', 'Alufelgen reparieren Leipzig', 'Bordsteinschaden Felge Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungsumfang" title="Zertifizierte Felgenreparatur als Wheel-Doctor-Fachbetrieb." description="Das CarCare-Center Leipzig ist einer der zertifizierten Wheel-Doctor-Fachbetriebe und kennt alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien – denn nicht in jedem Fall ist eine Felgenreparatur erlaubt." />
        <FeatureGrid items={scope} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Leipzig" title="Zertifizierter Meisterbetrieb – Full-Service in Leipzig." />
        <FeatureGrid items={usp} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Felgenreparatur." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Bordsteinschaden an der Felge? Kommen Sie vorbei." description="Lassen Sie sich vor Ort beraten – wir prüfen, ob der Schaden nach den TÜV-Richtlinien reparabel ist, und beheben ihn kostengünstig." primaryLabel="Felgenreparatur anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default FelgenreparaturPage;
