import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  homeServiceListSchema,
  itemListSchema,
  jobPostingSchema,
  serviceSchema,
} from './structuredData';
import { knowledgeArticles } from '../data/knowledgeArticles';

const servicesFaq = [
  { id: 'umfang', question: 'Welche Leistungen bietet CarCare in Leipzig an?', answer: 'CarCare bündelt Fahrzeugaufbereitung, Unfallinstandsetzung, Autolackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Leasingrückgabe und Fuhrparkservice.' },
  { id: 'beratung', question: 'Welche Leistung ist für mein Fahrzeug sinnvoll?', answer: 'Das hängt von Fahrzeugzustand, Schadenbild und Ziel ab. CarCare berät vor Ort oder telefonisch und empfiehlt den passenden Ablauf.' },
  { id: 'business', question: 'Sind die Leistungen auch für Geschäftskunden verfügbar?', answer: 'Ja. Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen erhalten strukturierte Abläufe und feste Ansprechpartner.' },
];

const homeFaq = [
  { id: 'unfall', question: 'Kann ich bei CarCare einen Unfallschaden in Leipzig melden?', answer: 'Ja. Sie können Ihren Unfallschaden online über das Formular oder telefonisch melden. CarCare unterstützt bei Schadenaufnahme, Kalkulation und Reparatur.' },
  { id: 'versicherung', question: 'Unterstützt CarCare bei der Abstimmung mit Versicherung oder Gutachter?', answer: 'Auf Wunsch begleitet CarCare die Abstimmung mit Gutachtern und Versicherern und hält Sie während der Reparatur persönlich auf dem Laufenden.' },
  { id: 'aufbereitung', question: 'Kann ich einen Termin für Fahrzeugaufbereitung online anfragen?', answer: 'Ja. Über das Formular Termin anfragen können Sie Fahrzeug, Wunschleistung und bevorzugten Termin übermitteln.' },
  { id: 'business', question: 'Arbeitet CarCare auch für Autohäuser, Fuhrparks und Agenturen?', answer: 'Ja. Geschäftskunden erhalten strukturierte Abläufe, feste Ansprechpartner und planbare Fahrzeugdienstleistungen.' },
];

const accidentFaq = [
  { id: 'melden', question: 'Wie melde ich einen Unfallschaden bei CarCare Leipzig?', answer: 'Sie können den Schaden telefonisch oder über die Kontaktseite melden. Hilfreich sind Fahrzeugdaten, Schadenart, Bilder und Informationen zur Versicherung.' },
  { id: 'versicherung', question: 'Kann CarCare mit der Versicherung abstimmen?', answer: 'Ja. Auf Wunsch unterstützt CarCare bei der Abstimmung mit Versicherern, Agenturen und Gutachtern.' },
  { id: 'ersatzmobilitaet', question: 'Gibt es Ersatzmobilität während der Reparatur?', answer: 'Ersatzmobilität wird nach Verfügbarkeit besprochen und im Schadenprozess kommuniziert.' },
];

const detailingFaq = [
  { id: 'dauer', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Das hängt von Leistung, Zustand und Umfang ab. CarCare stimmt den Ablauf nach der Anfrage persönlich ab.' },
  { id: 'leasing', question: 'Hilft CarCare bei der Leasingrückgabe?', answer: 'Ja. Die Aufbereitung kann helfen, den Fahrzeugzustand vor der Rückgabe professionell zu verbessern.' },
  { id: 'business', question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?', answer: 'Ja. CarCare arbeitet für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards.' },
];

const businessFaq = [
  { id: 'rahmen', question: 'Sind feste Abläufe für Geschäftskunden möglich?', answer: 'Ja. CarCare kann wiederkehrende Prozesse für Autohäuser, Fuhrparks und Agenturen strukturieren.' },
  { id: 'premium', question: 'Hat CarCare Erfahrung mit Premiumfahrzeugen?', answer: 'Ja. CarCare arbeitet mit hohen Qualitätsstandards und sorgfältigem Umgang bei hochwertigen Fahrzeugen.' },
  { id: 'digital', question: 'Gibt es digitale Schadenübermittlung?', answer: 'Eine digitale Schadenübermittlung ist perspektivisch vorgesehen und kann in der Zusammenarbeit berücksichtigt werden.' },
];

const careerFaq = [
  { id: 'initiativ', question: 'Kann ich mich initiativ bewerben?', answer: 'Ja. Initiativbewerbungen sind willkommen, besonders für Aufbereitung, Lackierung, Karosserie und Service.' },
  { id: 'bereiche', question: 'Welche Jobbereiche gibt es?', answer: 'CarCare sucht unter anderem Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater.' },
  { id: 'kontakt', question: 'Wie starte ich die Bewerbung?', answer: 'Am einfachsten über die Kontaktseite oder telefonisch. CarCare meldet sich anschließend persönlich zurück.' },
];

const knowledgeHubFaq = [
  { id: 'ziel', question: 'Wofür ist der Wissensbereich gedacht?', answer: 'Der Wissensbereich erklärt Autoaufbereitung, Fahrzeugpflege, Werterhalt, Leasingrückgabe und Smart Repair fachlich und verständlich.' },
  { id: 'beratung', question: 'Ersetzt der Ratgeber eine Fahrzeugprüfung?', answer: 'Nein. Die Artikel geben Orientierung. Für konkrete Empfehlungen sollte der Fahrzeugzustand fachlich geprüft werden.' },
  { id: 'leipzig', question: 'Kann CarCare die beschriebenen Leistungen in Leipzig umsetzen?', answer: 'Ja. CarCare Leipzig unterstützt bei Fahrzeugaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und ausgewählten Smart-Repair-Themen.' },
];

export const pageSchemas: Record<string, unknown[]> = {
  '/': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }]),
    homeServiceListSchema(),
    faqSchema(homeFaq),
  ],
  '/leistungen': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Leistungen', path: '/leistungen' }]),
    serviceSchema('Fahrzeugdienstleistungen Leipzig', 'Fahrzeugaufbereitung, Unfallinstandsetzung, Autolackierung, Smart Repair und Fuhrparkservice in Leipzig.', '/leistungen'),
    faqSchema(servicesFaq),
  ],
  '/unfallinstandsetzung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Unfallinstandsetzung Leipzig', path: '/unfallinstandsetzung-leipzig' }]),
    serviceSchema('Unfallinstandsetzung Leipzig', 'Schadenaufnahme, Schadenskalkulation, Gutachterservice, Versicherungsabstimmung und Reparatur in Leipzig.', '/unfallinstandsetzung-leipzig'),
    faqSchema(accidentFaq),
  ],
  '/fahrzeugaufbereitung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Fahrzeugaufbereitung Leipzig', path: '/fahrzeugaufbereitung-leipzig' }]),
    serviceSchema('Fahrzeugaufbereitung Leipzig', 'Professionelle Innenaufbereitung, Außenaufbereitung, Lackreinigung, Politur, Versiegelung und Leasingrückgabe-Vorbereitung.', '/fahrzeugaufbereitung-leipzig'),
    faqSchema(detailingFaq),
  ],
  '/geschaeftskunden': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Geschäftskunden', path: '/geschaeftskunden' }]),
    serviceSchema('Fuhrparkservice und Geschäftskundenservice Leipzig', 'Fahrzeugdienstleistungen für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen.', '/geschaeftskunden'),
    faqSchema(businessFaq),
  ],
  '/karriere': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Karriere', path: '/karriere' }]),
    jobPostingSchema('Kfz-Aufbereiter', 'Kfz-Aufbereiter bei CarCare Leipzig für professionelle Fahrzeugaufbereitung und Detailarbeit.'),
    jobPostingSchema('Fahrzeuglackierer', 'Fahrzeuglackierer bei CarCare Leipzig für Lackierarbeiten und Reparaturlackierung.'),
    jobPostingSchema('Karosserie- und Fahrzeugbaumechaniker', 'Karosserie- und Fahrzeugbaumechaniker bei CarCare Leipzig für Instandsetzung und Karosseriearbeiten.'),
    jobPostingSchema('Serviceberater', 'Serviceberater bei CarCare Leipzig für Kundenkontakt und Auftragskoordination.'),
    faqSchema(careerFaq),
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
    faqSchema(knowledgeHubFaq),
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
