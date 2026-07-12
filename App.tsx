import React, { useEffect, useMemo, useState } from 'react';
import Layout from './components/Layout';
import JsonLd from './components/JsonLd';
import StructuredData from './components/StructuredData';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AccidentRepairPage from './pages/AccidentRepairPage';
import VehicleDetailingPage from './pages/VehicleDetailingPage';
import SmartRepairPage from './pages/SmartRepairPage';
import AutolackierungPage from './pages/AutolackierungPage';
import DellenentfernungPage from './pages/DellenentfernungPage';
import HagelschadenreparaturPage from './pages/HagelschadenreparaturPage';
import FelgenreparaturPage from './pages/FelgenreparaturPage';
import FuhrparkservicePage from './pages/FuhrparkservicePage';
import AutoglasPage from './pages/AutoglasPage';
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
      case '/smart-repair-leipzig':
        return <SmartRepairPage />;
      case '/autolackierung-leipzig':
        return <AutolackierungPage />;
      case '/dellenentfernung-leipzig':
        return <DellenentfernungPage />;
      case '/hagelschadenreparatur-leipzig':
        return <HagelschadenreparaturPage />;
      case '/felgenreparatur-leipzig':
        return <FelgenreparaturPage />;
      case '/fuhrparkservice-leipzig':
        return <FuhrparkservicePage />;
      case '/autoglas-leipzig':
        return <AutoglasPage />;
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
    <Layout>
      <StructuredData />
      {pageSchemas[path] && <JsonLd data={pageSchemas[path]} />}
      {page}
    </Layout>
  );
};

export default App;
