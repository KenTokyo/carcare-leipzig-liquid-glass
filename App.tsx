import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JsonLd from './components/JsonLd';
import MobileStickyCTA from './components/MobileStickyCTA';
import StructuredData from './components/StructuredData';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AccidentRepairPage from './pages/AccidentRepairPage';
import VehicleDetailingPage from './pages/VehicleDetailingPage';
import BusinessCustomersPage from './pages/BusinessCustomersPage';
import CareerPage from './pages/CareerPage';
import ContactPage from './pages/ContactPage';
import KnowledgeArticlePage from './pages/KnowledgeArticlePage';
import KnowledgeHubPage from './pages/KnowledgeHubPage';
import NotFoundPage from './pages/NotFoundPage';
import { getKnowledgeArticleByPath } from './data/knowledgeArticles';
import { pageSchemas } from './seo/pageSchemas';

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
};

const App: React.FC = () => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const syncPath = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', syncPath);
    window.addEventListener('carcare:navigate', syncPath);
    return () => {
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('carcare:navigate', syncPath);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    window.setTimeout(() => {
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 50);
  }, [path]);

  const page = useMemo(() => {
    const knowledgeArticle = getKnowledgeArticleByPath(path);
    if (knowledgeArticle) return <KnowledgeArticlePage article={knowledgeArticle} />;

    switch (path) {
      case '/':
        return <HomePage />;
      case '/leistungen':
        return <ServicesPage />;
      case '/unfallinstandsetzung-leipzig':
        return <AccidentRepairPage />;
      case '/fahrzeugaufbereitung-leipzig':
        return <VehicleDetailingPage />;
      case '/geschaeftskunden':
        return <BusinessCustomersPage />;
      case '/karriere':
        return <CareerPage />;
      case '/kontakt':
        return <ContactPage />;
      case '/autoaufbereitung-wissen':
        return <KnowledgeHubPage />;
      default:
        return <NotFoundPage />;
    }
  }, [path]);

  return (
    <div className="min-h-screen bg-white text-gray-950 selection:bg-blue-600 selection:text-white">
      <StructuredData />
      {pageSchemas[path] && <JsonLd data={pageSchemas[path]} />}
      <Navbar />

      <main className="relative z-10 overflow-x-hidden bg-white">{page}</main>

      <Footer />
      <MobileStickyCTA />
    </div>
  );
};

export default App;
