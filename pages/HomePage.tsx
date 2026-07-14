import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import ServiceGrid from '../components/ServiceGrid';
import AccidentDamageSection from '../components/AccidentDamageSection';
import TargetGroupCards from '../components/TargetGroupCards';
import ProcessTimeline from '../components/ProcessTimeline';
import AutoDetailingExpertiseSection from '../components/AutoDetailingExpertiseSection';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';
import { PageMeta } from '../components/PageBlocks';

// Schlanke, conversion-fokussierte Startseite (9 Sektionen statt 13).
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
    <ProcessTimeline />
    <AutoDetailingExpertiseSection />
    <FAQSection />
    <ContactSection />
  </>
);

export default HomePage;
