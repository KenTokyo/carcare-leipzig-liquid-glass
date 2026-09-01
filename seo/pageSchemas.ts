import {
  aboutPageSchema,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  homeServiceListSchema,
  itemListSchema,
  jobPostingSchema,
  offerCatalogSchema,
  serviceSchema,
} from './structuredData';
import { faqsByRoute } from '../data/faqs';
import { knowledgeArticles } from '../data/knowledgeArticles';
import { priceOffers } from '../data/detailing';
















// MUSS mit den sichtbaren FAQs in `pages/LeasingrueckgabePage.tsx` uebereinstimmen.

// MUSS mit den sichtbaren FAQs in `pages/UeberUnsPage.tsx` uebereinstimmen.

export const pageSchemas: Record<string, unknown[]> = {
  '/': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }]),
    homeServiceListSchema(),
    faqSchema(faqsByRoute['/']),
  ],
  '/leistungen': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Leistungen', path: '/leistungen' }]),
    serviceSchema('Fahrzeugdienstleistungen Leipzig', 'Fahrzeugaufbereitung, Leasingrückgabe, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice in Leipzig.', '/leistungen'),
    faqSchema(faqsByRoute['/leistungen']),
  ],
  '/unfallinstandsetzung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Unfallinstandsetzung Leipzig', path: '/unfallinstandsetzung-leipzig' }]),
    serviceSchema('Unfallinstandsetzung Leipzig', 'Schadenaufnahme, Audatex-Kalkulation, Gutachterservice, Versicherungsabwicklung, Karosseriearbeiten und Reparaturlackierung — dazu Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur und Autoglas in Leipzig.', '/unfallinstandsetzung-leipzig'),
    faqSchema(faqsByRoute['/unfallinstandsetzung-leipzig']),
  ],
  '/fahrzeugaufbereitung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Fahrzeugaufbereitung Leipzig', path: '/fahrzeugaufbereitung-leipzig' }]),
    serviceSchema('Fahrzeugaufbereitung Leipzig', 'Professionelle Innenaufbereitung, Außenaufbereitung, Lackreinigung, Politur, Versiegelung, Geruchsentfernung und Leasingrückgabe-Vorbereitung mit festen Paketpreisen ab 169,00 €.', '/fahrzeugaufbereitung-leipzig'),
    // Die Preise stehen sichtbar auf der Seite; als `Offer` sind sie zusaetzlich
    // maschinenlesbar und damit fuer KI-Antworten zitierbar.
    offerCatalogSchema('Pflegepakete und Desinfektion', '/fahrzeugaufbereitung-leipzig', priceOffers),
    faqSchema(faqsByRoute['/fahrzeugaufbereitung-leipzig']),
  ],
  '/leasingrueckgabe-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Leasingrückgabe Leipzig', path: '/leasingrueckgabe-leipzig' }]),
    serviceSchema('Leasingrückgabe-Vorbereitung Leipzig', 'Begutachtung vor der Leasingrückgabe sowie Instandsetzung von Dellen, Lackschäden, Felgen und Glas mit anschließender Fahrzeugaufbereitung — für Privatkunden und Fuhrparks in Leipzig.', '/leasingrueckgabe-leipzig'),
    faqSchema(faqsByRoute['/leasingrueckgabe-leipzig']),
  ],
  '/smart-repair-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Smart Repair Leipzig', path: '/smart-repair-leipzig' }]),
    serviceSchema('Smart Repair Leipzig', 'Punktuelle Lackinstandsetzung mit geringem Aufwand (Spot-Repair) als Glasurit-Lackpartner und Meisterbetrieb – Ziel ist die unsichtbare Reparatur ohne Komplettlackierung.', '/smart-repair-leipzig'),
    faqSchema(faqsByRoute['/smart-repair-leipzig']),
  ],
  '/autolackierung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Autolackierung Leipzig', path: '/autolackierung-leipzig' }]),
    serviceSchema('Autolackierung Leipzig', 'Neu- und Reparaturlackierung mit dem Ziel der unsichtbaren Reparatur – als Glasurit-Lackpartner und Meisterbetrieb farbtongenau, Spot-Repair bevorzugt, Komplettlackierung bei Bedarf.', '/autolackierung-leipzig'),
    faqSchema(faqsByRoute['/autolackierung-leipzig']),
  ],
  '/dellenentfernung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Dellenentfernung Leipzig', path: '/dellenentfernung-leipzig' }]),
    serviceSchema('Dellenentfernung Leipzig', 'Lackierfreie Dellenentfernung bei Parkplatzdellen und Hagelschäden – keine Wertminderung, von Versicherungen anerkannt.', '/dellenentfernung-leipzig'),
    faqSchema(faqsByRoute['/dellenentfernung-leipzig']),
  ],
  '/hagelschadenreparatur-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Hagelschadenreparatur Leipzig', path: '/hagelschadenreparatur-leipzig' }]),
    serviceSchema('Hagelschadenreparatur Leipzig', 'Hagelschadenreparatur mit Audatex-Kalkulation und kompletter Versicherungsabwicklung ohne Anzahlung.', '/hagelschadenreparatur-leipzig'),
    faqSchema(faqsByRoute['/hagelschadenreparatur-leipzig']),
  ],
  '/felgenreparatur-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Felgenreparatur Leipzig', path: '/felgenreparatur-leipzig' }]),
    serviceSchema('Felgenreparatur Leipzig', 'TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb – Bordstein- und Korrosionsschäden bis 1 mm Tiefe.', '/felgenreparatur-leipzig'),
    faqSchema(faqsByRoute['/felgenreparatur-leipzig']),
  ],
  '/fuhrparkservice-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Fuhrparkservice Leipzig', path: '/fuhrparkservice-leipzig' }]),
    serviceSchema('Fuhrparkservice Leipzig', 'Betreuung des Firmenfuhrparks von regelmäßiger Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf.', '/fuhrparkservice-leipzig'),
    faqSchema(faqsByRoute['/fuhrparkservice-leipzig']),
  ],
  '/autoglas-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Autoglas & Scheibenfolien Leipzig', path: '/autoglas-leipzig' }]),
    serviceSchema('Autoglas & Scheibenfolien Leipzig', 'Scheibentausch, Steinschlagreparatur und Scheibenfolierung – WINTEC-Partner, ISO 9001 TÜV-zertifiziert, 30 Jahre Garantie.', '/autoglas-leipzig'),
    faqSchema(faqsByRoute['/autoglas-leipzig']),
  ],
  '/privatkunden': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Privatkunden', path: '/privatkunden' }]),
    serviceSchema('Fahrzeugservice für Privatkunden Leipzig', 'Fahrzeugaufbereitung, Unfallreparatur, Smart Repair, Dellenentfernung, Lackierung, Felgen, Autoglas und Leasingrückgabe-Vorbereitung für Privatkunden in Leipzig.', '/privatkunden'),
    faqSchema(faqsByRoute['/privatkunden']),
  ],
  '/geschaeftskunden': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Geschäftskunden', path: '/geschaeftskunden' }]),
    serviceSchema('Fuhrparkservice und Geschäftskundenservice Leipzig', 'Fahrzeugdienstleistungen für Autohäuser, Fuhrparks, Versicherungen, Schadensteuerer und Versicherungsagenturen — inklusive Leasingrückgabe-Vorbereitung und Fuhrparkservice.', '/geschaeftskunden'),
    faqSchema(faqsByRoute['/geschaeftskunden']),
  ],
  '/ueber-uns': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Über uns', path: '/ueber-uns' }]),
    aboutPageSchema('/ueber-uns', 'Die BS CarCare GmbH ist seit 1998 Meisterbetrieb des Kfz-Lackierhandwerks in Leipzig. Über 50 Mitarbeiter bearbeiten auf über 3.000 m² Karosserie, Lack, Smart Repair, Felgen, Autoglas und Fahrzeugaufbereitung — als Glasurit-Lackpartner und WINTEC-Partner.'),
    faqSchema(faqsByRoute['/ueber-uns']),
  ],
  '/karriere': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Karriere', path: '/karriere' }]),
    jobPostingSchema('Kfz-Aufbereiter', 'Kfz-Aufbereiter beim CarCare Center Leipzig für professionelle Fahrzeugaufbereitung und Detailarbeit.'),
    jobPostingSchema('Fahrzeuglackierer', 'Fahrzeuglackierer beim CarCare Center Leipzig für Lackierarbeiten und Reparaturlackierung.'),
    jobPostingSchema('Karosserie- und Fahrzeugbaumechaniker', 'Karosserie- und Fahrzeugbaumechaniker beim CarCare Center Leipzig für Instandsetzung und Karosseriearbeiten.'),
    jobPostingSchema('Serviceberater', 'Serviceberater beim CarCare Center Leipzig für Kundenkontakt und Auftragskoordination.'),
    faqSchema(faqsByRoute['/karriere']),
  ],
  '/kontakt': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Kontakt', path: '/kontakt' }]),
  ],
  '/autoaufbereitung-wissen': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Autoaufbereitung Wissen', path: '/autoaufbereitung-wissen' }]),
    itemListSchema(
      'Autoaufbereitung Wissen',
      'Ratgeberartikel zu Autoaufbereitung, Fahrzeugpflege, Werterhalt, Leasingrückgabe und Smart Repair.',
      knowledgeArticles.map((article) => ({
        name: article.cardTitle,
        description: article.cardDescription,
        path: article.path,
      }))
    ),
    faqSchema(faqsByRoute['/autoaufbereitung-wissen']),
  ],
  ...Object.fromEntries(
    knowledgeArticles.map((article) => [
      article.path,
      [
        breadcrumbSchema([
          { name: 'Startseite', path: '/' },
          { name: 'Autoaufbereitung Wissen', path: '/autoaufbereitung-wissen' },
          { name: article.cardTitle, path: article.path },
        ]),
        articleSchema({
          category: article.category,
          description: article.metaDescription,
          path: article.path,
          title: article.title,
        }),
        faqSchema(article.faqs),
      ],
    ])
  ),
};
