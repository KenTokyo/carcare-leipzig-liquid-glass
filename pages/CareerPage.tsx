import React from 'react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';
import { BEWERBUNGS_ZIEL } from '../data/jobs';
import JobBanner from '../components/JobBanner';
import JobCards from '../components/JobCards';
import JobPopup from '../components/JobPopup';
import RequestForm from '../components/RequestForm';
import BetriebsVideo from '../components/BetriebsVideo';
import Stimmen from '../components/Stimmen';
import { videoPlatz } from '../data/videos';

const benefits = [
  { title: 'Professionelles Umfeld', description: 'Arbeiten mit Fahrzeugen, Qualität und klaren Abläufen.' },
  { title: 'Starkes Team', description: 'Kollegen, die saubere Arbeit und gegenseitige Unterstützung schätzen.' },
  { title: 'Abwechslungsreiche Aufgaben', description: 'Aufbereitung, Reparatur, Lack, Service und Kundenkontakt.' },
  { title: 'Qualitätsanspruch', description: 'Sichtbare Ergebnisse und Arbeit, auf die man stolz sein kann.' },
];

const process = [
  { title: 'Kontakt aufnehmen', description: 'Kurze Bewerbung oder Initiativkontakt über die Kontaktseite senden.' },
  { title: 'Rückmeldung erhalten', description: 'Wir prüfen den passenden Bereich und melden uns persönlich.' },
  { title: 'Kennenlernen', description: 'Gemeinsames Gespräch über Erfahrung, Stärken und Aufgabenbereich.' },
  { title: 'Start im Team', description: 'Wenn es passt, beginnt der Einstieg in einem professionellen Umfeld.' },
];

const CareerPage: React.FC = () => (
  <>
    <PageMeta canonical="/karriere" title="Jobs & Ausbildung in Leipzig | CarCare Center Karriere" description="Jobs & Ausbildung in Leipzig | CarCare Center Karriere: Jobs für Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater." />
    <PageHero
      eyebrow="Karriere"
      title="Jobs & Ausbildung in Leipzig | CarCare Center Karriere"
      description="Dein Job bei uns: Fahrzeuge, Qualität und ein starkes Team. Entdecke Jobbereiche in Aufbereitung, Lackierung, Karosserie und Service."
      primaryCta={{ label: 'Initiativ bewerben', href: '/kontakt' }}
      secondaryCta={{ label: 'Jobbereiche ansehen', href: '#jobbereiche' }}
      keywords={['Kfz-Aufbereiter Leipzig', 'Fahrzeuglackierer Leipzig', 'Karosserie Jobs Leipzig']}
    />
    <JobBanner href={BEWERBUNGS_ZIEL} />
    <JobCards />
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Arbeitgeberversprechen" title="Ein professionelles Umfeld für Menschen, die Qualität mögen." />
        <FeatureGrid items={benefits} columns="four" />
      </div>
    </section>
    {/* Backlog 3.18: Nicht nur Vorteile aufzaehlen, sondern den Betrieb zeigen. Steht
        direkt nach dem Arbeitgeberversprechen — die Aufzaehlung behauptet, das Video
        belegt. */}
    <section id="betrieb" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Ihr künftiger Arbeitsplatz"
          title="So sieht der Betrieb aus, in dem Sie arbeiten würden."
          description="Hallen, Ausstattung und Arbeitsplätze im laufenden Betrieb — damit Sie vor dem ersten Gespräch wissen, worauf Sie sich bewerben."
        />
        <div className="mt-12">
          <BetriebsVideo platz={videoPlatz('karriere-betrieb')} />
        </div>
      </div>
    </section>

    {/* Backlog 3.19: Stimmen aus dem Betrieb, ausdruecklich anonymisiert —
        Berufsbezeichnung statt Name. Steht nach dem Video: erst der Ort, dann die
        Menschen, die dort arbeiten. */}
    <section id="stimmen" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Aus dem Team"
          title="Was Kolleginnen und Kollegen über die Arbeit sagen."
          description="Bewusst ohne Namen — die Berufsbezeichnung sagt mehr darüber aus, ob die Stelle zu Ihnen passt."
        />
        <div className="mt-12">
          <Stimmen />
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Bewerbungsprozess" title="So läuft der Kontakt zu uns." />
        <ProcessList steps={process} />
      </div>
    </section>
    <section id="bewerbung" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Bewerbung"
          title="Bewerben Sie sich in wenigen Minuten."
          description="Name, Kontakt und ein paar Sätze reichen. Den Rest klären wir im Gespräch."
        />
        <div className="mx-auto max-w-3xl">
          <RequestForm kind="bewerbung" />
        </div>
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Karriere." />
        <PageFAQ route="/karriere" />
      </div>
    </section>
    <JobPopup href={BEWERBUNGS_ZIEL} />
    <PageCTA title="Du willst Teil des Teams werden?" description="Sende eine kurze Initiativbewerbung oder melde dich direkt. Wir prüfen gemeinsam mit dir den passenden Bereich." primaryLabel="Initiativbewerbung starten" primaryHref="/kontakt" />
  </>
);

export default CareerPage;
