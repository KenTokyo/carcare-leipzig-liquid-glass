import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

const services = [
  { title: 'Schadenaufnahme', description: 'Erste Einschätzung des Unfallschadens mit relevanten Fahrzeug- und Schadendaten.' },
  { title: 'Schadenskalkulation', description: 'Strukturierte Kalkulation als Grundlage für Reparatur und weitere Abstimmung.' },
  { title: 'Gutachterservice', description: 'Koordination und Kommunikation mit Gutachtern, sofern für den Schadenfall sinnvoll.' },
  { title: 'Abstimmung mit Versicherern', description: 'Auf Wunsch begleitet CarCare die Kommunikation mit Versicherungen und Agenturen.' },
  { title: 'Karosseriearbeiten', description: 'Fachgerechte Instandsetzung beschädigter Karosserie- und Anbauteile.' },
  { title: 'Reparaturlackierung', description: 'Saubere Lackierarbeiten mit Fokus auf Oberfläche, Farbton und Finish.' },
  { title: 'Ersatzmobilität', description: 'Ersatzmobilität wird besprochen und nach Verfügbarkeit organisiert.' },
  { title: 'Dokumentation', description: 'Nachvollziehbare Dokumentation der Schritte und Übergabe nach Abschluss.' },
];

const steps = [
  { title: 'Schaden melden', description: 'Über Formular oder Telefon werden die wichtigsten Daten aufgenommen.' },
  { title: 'Fahrzeug besichtigen lassen', description: 'CarCare prüft Schadenbild, Umfang und nächste Schritte direkt am Fahrzeug.' },
  { title: 'Kalkulation erstellen', description: 'Die Reparatur wird transparent kalkuliert und vorbereitet.' },
  { title: 'Abstimmung mit Versicherung oder Gutachter', description: 'Je nach Fall erfolgt die Abstimmung mit Versicherung, Agentur oder Gutachter.' },
  { title: 'Reparatur durchführen', description: 'Karosseriearbeiten und Reparaturlackierung werden fachgerecht umgesetzt.' },
  { title: 'Fahrzeugübergabe', description: 'Das Fahrzeug wird dokumentiert, sauber und repariert übergeben.' },
];

const audiences = [
  { title: 'Privatkunden', description: 'Schnelle Orientierung nach einem Unfall und persönliche Betreuung bis zur Übergabe.' },
  { title: 'Versicherungsagenturen', description: 'Strukturierte Schadenaufnahme und klare Kommunikation im Reparaturprozess.' },
  { title: 'Fuhrparks', description: 'Planbare Abläufe, kurze Wege und transparente Reparaturkommunikation für Flotten.' },
];

const faqs = [
  { id: 'melden', question: 'Wie melde ich einen Unfallschaden bei CarCare Leipzig?', answer: 'Sie können den Schaden telefonisch oder über die Kontaktseite melden. Hilfreich sind Fahrzeugdaten, Schadenart, Bilder und Informationen zur Versicherung.' },
  { id: 'versicherung', question: 'Kann CarCare mit der Versicherung abstimmen?', answer: 'Ja. Auf Wunsch unterstützt CarCare bei der Abstimmung mit Versicherern, Agenturen und Gutachtern.' },
  { id: 'ersatzmobilitaet', question: 'Gibt es Ersatzmobilität während der Reparatur?', answer: 'Ersatzmobilität wird nach Verfügbarkeit besprochen und im Schadenprozess kommuniziert.' },
];

const AccidentRepairPage: React.FC = () => (
  <>
    <PageMeta canonical="/unfallinstandsetzung-leipzig" title="Unfallinstandsetzung Leipzig | CarCare begleitet Ihren Schadenfall" description="Unfallinstandsetzung in Leipzig: CarCare unterstützt bei Schadenaufnahme, Schadenskalkulation, Gutachterservice, Versicherungsabwicklung, Karosseriearbeiten und Reparaturlackierung." />
    <PageHero
      eyebrow="Unfallinstandsetzung Leipzig"
      title="Unfallinstandsetzung in Leipzig – CarCare repariert und begleitet Ihren Schadenfall."
      description="Vom ersten Kontakt bis zur Fahrzeugübergabe: CarCare Center Leipzig unterstützt bei Unfallschaden, Schadenskalkulation, Gutachterservice, Versicherungsabstimmung, Karosseriearbeiten und Reparaturlackierung."
      primaryCta={{ label: 'Schaden melden', href: '/kontakt#contact-schaden' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Unfallschaden Leipzig', 'Autoreparatur Leipzig', 'Schadenabwicklung Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Leistungen im Schadenfall" title="Alles Wichtige für die Reparatur Ihres Unfallschadens." description="CarCare bündelt technische Reparatur, persönliche Betreuung und strukturierte Abstimmung in einem Prozess." />
        <FeatureGrid items={services} columns="four" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So läuft die Unfallinstandsetzung bei CarCare." />
        <ProcessList steps={steps} />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Zielgruppen" title="Für Privatkunden, Versicherungsagenturen und Fuhrparks." />
        <FeatureGrid items={audiences} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Unfallinstandsetzung." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Unfallschaden in Leipzig? Wir nehmen den Fall auf." description="Senden Sie die wichtigsten Informationen direkt an CarCare oder rufen Sie an, wenn es schnell gehen muss." primaryLabel="Schaden jetzt melden" primaryHref="/kontakt#contact-schaden" />
  </>
);

export default AccidentRepairPage;
