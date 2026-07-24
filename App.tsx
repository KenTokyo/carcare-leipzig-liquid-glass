import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Preloader from './components/Preloader';
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
import { useSmoothScroll, getLenis } from './hooks/useSmoothScroll';
import { usePreloader } from './hooks/usePreloader';

const normalizePath = (path: string) => {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
};

const App: React.FC = () => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  // Globales Smooth-Scrolling (Lenis) — gibt der ganzen Seite und damit auch dem
  // Hero-Parallax die Fluessigkeit der skiper29-Referenz. Siehe hooks/useSmoothScroll.ts.
  useSmoothScroll();

  // MUSS nach useSmoothScroll() stehen: Effects laufen in Deklarationsreihenfolge, und
  // der Preloader sperrt Lenis ueber `getLenis()`. Weiter oben waere die Instanz noch null.
  const { showPreloader, handleHoldComplete, handleExitComplete } = usePreloader();

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
      // Ueber Lenis scrollen, solange es laeuft: ein nativer window.scrollTo wuerde gegen
      // dessen Interpolation arbeiten (sichtbares Zurueckspringen). Fallback bleibt nativ.
      const lenis = getLenis();
      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          if (lenis) lenis.scrollTo(target, { offset: -88 });
          else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 88, behavior: 'smooth' });
          return;
        }
      }
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: 'auto' });
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
    <>
      {/* Ausserhalb von <Layout>, damit das Overlay nicht in dessen Stacking-Context
          (site-main-shell mit overflow-clip) faellt und dort beschnitten wuerde. */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {showPreloader && <Preloader onHoldComplete={handleHoldComplete} />}
      </AnimatePresence>

      <Layout>
        <StructuredData />
        {pageSchemas[path] && <JsonLd data={pageSchemas[path]} />}
        {page}
      </Layout>
    </>
  );
};

export default App;
