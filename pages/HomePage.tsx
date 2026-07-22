import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ServiceGrid from '../components/ServiceGrid';
import AccidentDamageSection from '../components/AccidentDamageSection';
import TargetGroupCards from '../components/TargetGroupCards';
import AutoDetailingExpertiseSection from '../components/AutoDetailingExpertiseSection';
import DetailingProcessSection from '../components/DetailingProcessSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import { PageMeta } from '../components/PageBlocks';

// Schlanke, conversion-fokussierte Startseite (8 Sektionen statt 13).
// 2026-07-22: Sektion „Prozess" (ProcessTimeline) entfernt — der Unfallablauf stand dreifach
// (hier, in AccidentDamageSection und auf /unfallinstandsetzung-leipzig). Der Aufbereitungs-
// ablauf ist in AutoDetailingExpertiseSection gewandert, der Unfallablauf ist als 5. Karte
// in AccidentDamageSection aufgegangen. Siehe docs/prozess-konsolidierung/.
// Ausgelagert: Geschäftskunden -> /geschaeftskunden, Karriere -> /karriere.
// Zusammengeführt: Kontaktabschluss (ContactCTA) in ContactSection.
// Ersetzt (offen): generische „Vertrauen"-Sektion -> echte Google-Bewertungen (echte Daten nötig).
const HomePage: React.FC = () => (
  <>
    <PageMeta
      canonical="/"
      title="CarCare Center Leipzig | Unfallinstandsetzung, Autoreparatur & Fahrzeugaufbereitung"
      description="CarCare Center Leipzig: Unfallinstandsetzung, Autoreparatur, Fahrzeugaufbereitung, Lackierung, Smart Repair und Schadenabwicklung."
    />
    <HeroSection />
    <TrustBar />
    <ServiceGrid />
    <AccidentDamageSection />
    <TargetGroupCards />
    <AutoDetailingExpertiseSection />
    <DetailingProcessSection />
    <FAQSection />
    <ContactSection />
  </>
);

export default HomePage;
