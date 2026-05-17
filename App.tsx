import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Jobs from './components/Jobs';
import Footer from './components/Footer';
import MobileStickyCTA from './components/MobileStickyCTA';
import TrustBar from './components/TrustBar';
import TargetGroups from './components/TargetGroups';
import ServiceGrid from './components/ServiceGrid';
import AccidentFocus from './components/AccidentFocus';
import DetailingExpertise from './components/DetailingExpertise';
import ProcessTimeline from './components/ProcessTimeline';
import BusinessSection from './components/BusinessSection';
import References from './components/References';
import FAQSection from './components/FAQSection';
import ContactCTA from './components/ContactCTA';
import ContactSection from './components/ContactSection';
import StructuredData from './components/StructuredData';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-900 selection:bg-gray-900 selection:text-white overflow-x-hidden">
      <StructuredData />
      <Navbar />

      <main
        className="relative z-10 bg-white"
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        <section id="home">
          <Hero />
        </section>

        <section id="trust" className="relative z-10">
          <TrustBar />
        </section>

        <section id="about" className="relative z-10">
          <About />
        </section>

        <section id="zielgruppen" className="relative z-10">
          <TargetGroups />
        </section>

        <section id="leistungen" className="relative z-10">
          <ServiceGrid />
        </section>

        <section id="services" className="relative z-10">
          <Services />
        </section>

        <section id="unfall" className="relative z-10">
          <AccidentFocus />
        </section>

        <section id="expertise" className="relative z-10">
          <DetailingExpertise />
        </section>

        <section id="prozess" className="relative z-10">
          <ProcessTimeline />
        </section>

        <section id="jobs" className="relative z-10">
          <Jobs />
        </section>

        <section id="business-zone" className="relative z-10">
          <BusinessSection />
        </section>

        <section id="referenzen" className="relative z-10">
          <References />
        </section>

        <section id="faq" className="relative z-10">
          <FAQSection />
        </section>

        <section id="kontakt-cta" className="relative z-10">
          <ContactCTA />
        </section>

        <section id="kontakt" className="relative z-10">
          <ContactSection />
        </section>
      </main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
};

export default App;
