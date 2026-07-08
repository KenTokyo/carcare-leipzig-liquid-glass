import React from 'react';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import TargetGroupCards from '../components/TargetGroupCards';
import ServiceGrid from '../components/ServiceGrid';
import AccidentDamageSection from '../components/AccidentDamageSection';
import AutoDetailingExpertiseSection from '../components/AutoDetailingExpertiseSection';
import CinematicShowcase from '../components/CinematicShowcase';
import ProcessTimeline from '../components/ProcessTimeline';
import BusinessCustomerSection from '../components/BusinessCustomerSection';
import CareerTeaser from '../components/CareerTeaser';
import References from '../components/References';
import FAQSection from '../components/FAQSection';
import ContactCTA from '../components/ContactCTA';
import ContactSection from '../components/ContactSection';
import { PageMeta } from '../components/PageBlocks';

const HomePage: React.FC = () => (
  <>
    <PageMeta
      canonical="/"
      title="CarCare Center Leipzig | Unfallinstandsetzung, Autoreparatur & Fahrzeugaufbereitung"
      description="CarCare Center Leipzig: Unfallinstandsetzung, Autoreparatur, Fahrzeugaufbereitung, Lackierung, Smart Repair und Schadenabwicklung."
    />
    <HeroSection />
    <TrustBar />
    <TargetGroupCards />
    <ServiceGrid />
    <AccidentDamageSection />
    <AutoDetailingExpertiseSection />
    <CinematicShowcase />
    <ProcessTimeline />
    <BusinessCustomerSection />
    <CareerTeaser />
    <References />
    <FAQSection />
    <ContactCTA />
    <ContactSection />
  </>
);

export default HomePage;
