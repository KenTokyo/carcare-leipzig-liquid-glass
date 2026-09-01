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
const leasingFaq = [
  { id: 'lohnt', question: 'Lohnt es sich, vor der Leasingrückgabe reparieren zu lassen?', answer: 'In der Regel ja, wenn erkennbare Schäden vorliegen. Der Leasinggeber rechnet festgestellte Schäden nach seinen eigenen Sätzen ab, die meist über den Kosten einer Reparatur im Fachbetrieb liegen. Bei reiner Gebrauchsspur ohne Substanzschaden raten wir dagegen häufig ab — wir sagen Ihnen bei der Begutachtung, was in Ihrem Fall sinnvoll ist.' },
  { id: 'wann', question: 'Wie früh vor der Rückgabe sollte ich mich melden?', answer: 'Planen Sie einige Wochen Vorlauf ein. Dann bleibt genug Zeit für Begutachtung, Kostenvoranschlag, Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin knapp wird. Bei mehreren Fuhrparkfahrzeugen sollte der Vorlauf entsprechend größer sein.' },
  { id: 'was', question: 'Was bewertet der Rückgabegutachter?', answer: 'Bewertet werden unter anderem Lackschäden, Beschädigungen an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe und der Zustand des Innenraums. Normale Abnutzung bei vertragsgemäßer Nutzung ist in der Regel abgedeckt; wo genau die Grenze liegt, legt Ihr Leasingvertrag fest.' },
  { id: 'kosten', question: 'Was kostet die Vorbereitung auf die Leasingrückgabe?', answer: 'Für die Reparaturen gibt es keinen Listenpreis, weil der Aufwand vom Schadenbild abhängt — Sie erhalten dafür einen Kostenvoranschlag. Für die Aufbereitung gelten feste Preise: Intensiv Innenreinigung 199,00 €, Premiumpflege mit Innen- und Außenaufbereitung 299,00 €, jeweils inklusive gesetzlicher Mehrwertsteuer.' },
  { id: 'wertminderung', question: 'Entsteht durch die Reparatur eine Wertminderung?', answer: 'Bei der lackfreien Dellenentfernung nicht: Sie ist lackschonend und im Nachhinein nicht nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur — als Glasurit-Lackpartner arbeiten wir farbtongenau, sodass weder Farbton noch Effektunterschiede für das Auge erkennbar sind.' },
  { id: 'fuhrpark', question: 'Bereitet das CarCare Center auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?', answer: 'Ja. Auf über 3.000 m² mit über 50 Mitarbeitern lassen sich mehrere Rückläufer parallel bearbeiten. Sie erhalten einen festen Ansprechpartner und je Fahrzeug eine nachvollziehbare Aufstellung, sodass sich Reparaturkosten gegen die erwartete Nachbelastung abwägen lassen.' },
  { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.' },
  { id: 'marken', question: 'Gilt das für alle Fahrzeugmarken?', answer: 'Ja. Wir sind ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.' },
];

// MUSS mit den sichtbaren FAQs in `pages/UeberUnsPage.tsx` uebereinstimmen.
const ueberUnsFaq = [
  { id: 'wer', question: 'Wer steht hinter dem CarCare Center Leipzig?', answer: 'Betreiber ist die BS CarCare GmbH mit Sitz An den Tierkliniken 42, 04103 Leipzig. Wir bestehen seit 1998, sind Meisterbetrieb des Kfz-Lackierhandwerks und beschäftigen über 50 Mitarbeiter auf über 3.000 m² Betriebsfläche.' },
  { id: 'groesse', question: 'Wie groß ist der Betrieb?', answer: 'Wir gehören mit über 3.000 m² Betriebsfläche und über 50 Mitarbeitern zu den größten Karosserie- und Lackierbetrieben in Leipzig und Umgebung. Die Größe erlaubt es uns, mehrere Fahrzeuge parallel zu bearbeiten und Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung vollständig im eigenen Haus abzudecken.' },
  { id: 'marken', question: 'Ist das CarCare Center an eine Fahrzeugmarke gebunden?', answer: 'Nein. Wir sind markenunabhängig und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug. Zu unseren Kunden zählen unter anderem Werksniederlassungen deutscher Premiumhersteller.' },
  { id: 'zertifikate', question: 'Welche Qualifikationen und Partnerschaften hat das CarCare Center?', answer: 'Wir sind Meisterbetrieb des Kfz-Lackierhandwerks, Glasurit-Lackpartner, WINTEC-Partner für Autoglas nach ISO 9001 mit TÜV-Zertifizierung und arbeiten mit einem TÜV-zertifizierten Felgenreparaturverfahren. Schäden werden mit dem anerkannten System Audatex kalkuliert.' },
  { id: 'einzugsgebiet', question: 'Welches Gebiet betreut das CarCare Center?', answer: 'Schwerpunkt ist Leipzig mit dem Umland bis etwa 50 km — darunter Markkleeberg, Schkeuditz, Taucha, Markranstädt, Zwenkau, Borna, Grimma, Wurzen, Delitzsch, Eilenburg und Halle (Saale). Geschäftskunden wie Autohäuser und Fuhrparks werden auch darüber hinaus betreut.' },
  { id: 'bewerbung', question: 'Sucht das CarCare Center neue Mitarbeiter?', answer: 'Wir beschäftigen Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater. Offene Stellen und der Weg zur Initiativbewerbung stehen auf der Karriereseite.' },
  { id: 'partner', question: 'Kann mein Autohaus oder meine Versicherung Partner werden?', answer: 'Ja. Wir arbeiten mit Autohäusern, Fuhrparks, Versicherungen und Versicherungsagenturen zusammen. Für die Zusammenarbeit gibt es feste Ansprechpartner, strukturierte Abläufe und die komplette Schadenabwicklung inklusive Audatex-Kalkulation.' },
];

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
    faqSchema(leasingFaq),
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
    faqSchema(ueberUnsFaq),
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
