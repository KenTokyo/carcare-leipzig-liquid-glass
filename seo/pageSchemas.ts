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

const smartRepairFaq = [
  { id: 'was', question: 'Was ist Smart bzw. Spot-Repair?', answer: 'Spot-Repair ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand und unsere bevorzugte Reparaturmethode bei kleineren Schäden. Statt das ganze Bauteil zu lackieren, wird gezielt nur der betroffene Bereich bearbeitet.' },
  { id: 'unsichtbar', question: 'Sieht man die reparierte Stelle?', answer: 'Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges – weder Farbton noch Effektunterschiede zur Originallackierung sollen für das menschliche Auge erkennbar sein.' },
  { id: 'grenzen', question: 'Wann reicht Smart Repair nicht aus?', answer: 'Nicht immer kann Spot-Repair angewendet werden. Bei größeren Schäden bleibt die Komplettlackierung des Bauteils, die unter modernen Bedingungen mit bestmöglichem Ergebnis ausgeführt wird.' },
];

const autolackierungFaq = [
  { id: 'unsichtbar', question: 'Sieht man die Lackreparatur später?', answer: 'Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges. Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind.' },
  { id: 'spot', question: 'Was ist Spot-Repair?', answer: 'Spot-Repair ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand. Sie ist unsere bevorzugte Reparaturmethode, weil nur der betroffene Bereich bearbeitet wird.' },
  { id: 'komplett', question: 'Wann ist eine Komplettlackierung nötig?', answer: 'Nicht immer kann Spot-Repair angewendet werden. Dann bleibt die Komplettlackierung des Bauteils, die unter modernen Bedingungen mit bestmöglichem Ergebnis ausgeführt wird.' },
];

const dellenentfernungFaq = [
  { id: 'wann', question: 'Bei welchen Schäden funktioniert die lackfreie Dellenentfernung?', answer: 'Die lackierfreie Reparaturmethode gilt heute als Standard bei Parkplatzdellen oder Hagelschäden. Voraussetzung ist, dass der Lack keine Beschädigungen aufweist.' },
  { id: 'wie', question: 'Wie funktioniert die Methode?', answer: 'Durch eigens entwickelte Druck- bzw. Ziehtechniken wird das Fahrzeugteil unter Verwendung spezieller Werkzeuge so weit bearbeitet, bis der Originalzustand wieder hergestellt ist.' },
  { id: 'wert', question: 'Bleibt der Wert des Fahrzeugs erhalten?', answer: 'Ja. Die Methode ist schonend für den Lack und im Nachhinein nicht sicht- bzw. nachweisbar, sodass keine Wertminderung entsteht.' },
  { id: 'versicherung', question: 'Erkennen Versicherungen die Methode an?', answer: 'Ja, die lackfreie Dellenentfernung ist von allen Versicherungen und Gutachtern anerkannt.' },
];

const hagelschadenFaq = [
  { id: 'anzahlung', question: 'Muss ich eine Anzahlung leisten?', answer: 'Nein. Eine Anzahlung ist nicht nötig – wir rechnen direkt mit der Versicherung ab.' },
  { id: 'abwicklung', question: 'Übernehmt ihr die Abstimmung mit Versicherung und Gutachter?', answer: 'Auf Wunsch sprechen wir mit Ihrem Gutachter bzw. Ihrer Versicherung und wickeln das gesamte Schadensereignis für Sie ab.' },
  { id: 'audatex', question: 'Wie wird der Hagelschaden kalkuliert?', answer: 'Die Kalkulation erfolgt mit dem durch Versicherer und Gutachter anerkannten System Audatex.' },
  { id: 'zustand', question: 'Wird das Fahrzeug wieder wie vorher?', answer: 'Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird. Bei intaktem Lack werden die Hageldellen lackfrei entfernt.' },
];

const felgenreparaturFaq = [
  { id: 'welche', question: 'Welche Felgenschäden dürfen repariert werden?', answer: 'Behoben werden dürfen Bordstein- und Korrosionsschäden bis zu 1 mm Tiefe im Grundmetall der Felge. Eingriffe in das Materialgefüge wie Schweißarbeiten und Rückverformungen sind gesetzlich grundsätzlich abzulehnen.' },
  { id: 'sicher', question: 'Ist die Reparatur TÜV-konform und sicher?', answer: 'Wir arbeiten mit einem TÜV-zertifizierten Alufelgenreparaturverfahren als zertifizierter Wheel-Doctor-Fachbetrieb und kennen alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien. Nicht in jedem Fall ist eine Felgenreparatur erlaubt.' },
  { id: 'poliert', question: 'Repariert ihr auch polierte bzw. glanzgedrehte Felgen?', answer: 'Ja. Auch glanzgedrehte, im Volksmund polierte Alufelgen können wir wieder optisch wie neu erscheinen lassen.' },
  { id: 'anteil', question: 'Wie viele Felgenschäden lassen sich beheben?', answer: 'Mit unserem Verfahren können bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig behoben werden – statt teure neue Originalfelgen anzuschaffen.' },
];

const fuhrparkFaq = [
  { id: 'umfang', question: 'Welche Arbeiten übernimmt der Fuhrparkservice?', answer: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf übernehmen wir sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge.' },
  { id: 'schaden', question: 'Was passiert im Schadensfall?', answer: 'Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein, damit Ihr Betrieb weiterläuft.' },
  { id: 'partner', question: 'Arbeitet CarCare mit Partnern aus der Branche zusammen?', answer: 'Ja. Sie profitieren von unseren langjährigen Kooperationspartnern aus der Automobilbranche.' },
];

const autoglasFaq = [
  { id: 'garantie', question: 'Gibt es eine Garantie auf die Autoglas-Reparatur?', answer: 'Ja. Als WINTEC-Partner geben wir 30 Jahre Garantie auf die Autoglas-Reparatur und die Dichtigkeit ausgetauschter Scheiben.' },
  { id: 'leistungen', question: 'Welche Autoglas-Leistungen bietet CarCare?', answer: 'Neuverglasung für PKW, LKW und Bus, Steinschlagreparaturen sowie Folienbeschichtungen aller Art – von der Scheibenfolierung bis zu Schutzfolien für den Lack.' },
  { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Ja. Während der Arbeiten stellen wir Ihnen ein Werkstatt-Ersatzfahrzeug gratis zur Verfügung.' },
  { id: 'steinschlag', question: 'Kann ein Steinschlag repariert werden oder muss die Scheibe getauscht werden?', answer: 'Je nach Größe und Lage lässt sich ein Steinschlag reparieren, bevor sich Risse ausbreiten. Ist das nicht möglich, tauschen wir die Scheibe fachgerecht aus.' },
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
  '/smart-repair-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Smart Repair Leipzig', path: '/smart-repair-leipzig' }]),
    serviceSchema('Smart Repair Leipzig', 'Punktuelle Lackinstandsetzung mit geringem Aufwand (Spot-Repair) als Glasurit-Lackpartner und Meisterbetrieb – Ziel ist die unsichtbare Reparatur ohne Komplettlackierung.', '/smart-repair-leipzig'),
    faqSchema(smartRepairFaq),
  ],
  '/autolackierung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Autolackierung Leipzig', path: '/autolackierung-leipzig' }]),
    serviceSchema('Autolackierung Leipzig', 'Neu- und Reparaturlackierung mit dem Ziel der unsichtbaren Reparatur – als Glasurit-Lackpartner und Meisterbetrieb farbtongenau, Spot-Repair bevorzugt, Komplettlackierung bei Bedarf.', '/autolackierung-leipzig'),
    faqSchema(autolackierungFaq),
  ],
  '/dellenentfernung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Dellenentfernung Leipzig', path: '/dellenentfernung-leipzig' }]),
    serviceSchema('Dellenentfernung Leipzig', 'Lackierfreie Dellenentfernung bei Parkplatzdellen und Hagelschäden – keine Wertminderung, von Versicherungen anerkannt.', '/dellenentfernung-leipzig'),
    faqSchema(dellenentfernungFaq),
  ],
  '/hagelschadenreparatur-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Hagelschadenreparatur Leipzig', path: '/hagelschadenreparatur-leipzig' }]),
    serviceSchema('Hagelschadenreparatur Leipzig', 'Hagelschadenreparatur mit Audatex-Kalkulation und kompletter Versicherungsabwicklung ohne Anzahlung.', '/hagelschadenreparatur-leipzig'),
    faqSchema(hagelschadenFaq),
  ],
  '/felgenreparatur-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Felgenreparatur Leipzig', path: '/felgenreparatur-leipzig' }]),
    serviceSchema('Felgenreparatur Leipzig', 'TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb – Bordstein- und Korrosionsschäden bis 1 mm Tiefe.', '/felgenreparatur-leipzig'),
    faqSchema(felgenreparaturFaq),
  ],
  '/fuhrparkservice-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Fuhrparkservice Leipzig', path: '/fuhrparkservice-leipzig' }]),
    serviceSchema('Fuhrparkservice Leipzig', 'Betreuung des Firmenfuhrparks von regelmäßiger Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf.', '/fuhrparkservice-leipzig'),
    faqSchema(fuhrparkFaq),
  ],
  '/autoglas-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Autoglas & Scheibenfolien Leipzig', path: '/autoglas-leipzig' }]),
    serviceSchema('Autoglas & Scheibenfolien Leipzig', 'Scheibentausch, Steinschlagreparatur und Scheibenfolierung – WINTEC-Partner, ISO 9001 TÜV-zertifiziert, 30 Jahre Garantie.', '/autoglas-leipzig'),
    faqSchema(autoglasFaq),
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
