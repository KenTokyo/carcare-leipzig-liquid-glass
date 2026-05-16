import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Jobs from './components/Jobs';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-gray-900 selection:text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <section id="home">
          <Hero />
        </section>

        <section id="about" className="relative z-10">
          <About />
        </section>

        <section id="services" className="relative z-10">
          <Services />
        </section>

        <section id="jobs" className="relative z-10">
          <Jobs />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;