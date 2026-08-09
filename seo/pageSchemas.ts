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
import { knowledgeArticles } from '../data/knowledgeArticles';
import { priceOffers } from '../data/detailing';

// MUSS mit den sichtbaren FAQs in `pages/ServicesPage.tsx` uebereinstimmen — Schema darf
// nur auszeichnen, was auf der Seite auch steht (SEO-GEO-STANDARDS.md §5).
const servicesFaq = [
  { id: 'umfang', question: 'Welche Leistungen bietet CarCare in Leipzig an?', answer: 'CarCare bündelt Fahrzeugaufbereitung, Leasingrückgabe-Vorbereitung, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice — alles an einem Standort in Leipzig.' },
  { id: 'einhaus', question: 'Bekomme ich Reparatur und Lackierung aus einer Hand?', answer: 'Ja. Karosseriearbeiten, Lackierung, Smart Repair, Felgen und Aufbereitung finden auf 3.000 qm im eigenen Haus statt. Ihr Fahrzeug wird für die einzelnen Schritte nicht an Fremdbetriebe weitergereicht.' },
  { id: 'beratung', question: 'Welche Leistung ist für mein Fahrzeug sinnvoll?', answer: 'Das hängt von Fahrzeugzustand, Schadenbild und Ziel ab. Bei kleineren Lackschäden prüfen wir zuerst Smart Repair, weil es günstiger und schneller ist als eine Komplettlackierung. CarCare berät vor Ort oder telefonisch und empfiehlt den passenden Ablauf.' },
  { id: 'versicherung', question: 'Übernimmt CarCare die Abwicklung mit der Versicherung?', answer: 'Ja. Auf Wunsch übernimmt CarCare die Abstimmung mit Versicherern, Agenturen und Gutachtern — von der Schadenaufnahme über die Kalkulation bis zur Freigabe.' },
  { id: 'business', question: 'Sind die Leistungen auch für Geschäftskunden verfügbar?', answer: 'Ja. Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen erhalten strukturierte Abläufe und feste Ansprechpartner.' },
];

const homeFaq = [
  { id: 'unfall', question: 'Kann ich bei CarCare einen Unfallschaden in Leipzig melden?', answer: 'Ja. Sie können Ihren Unfallschaden online über das Formular oder telefonisch melden. CarCare unterstützt bei Schadenaufnahme, Kalkulation und Reparatur.' },
  { id: 'versicherung', question: 'Unterstützt CarCare bei der Abstimmung mit Versicherung oder Gutachter?', answer: 'Auf Wunsch begleitet CarCare die Abstimmung mit Gutachtern und Versicherern und hält Sie während der Reparatur persönlich auf dem Laufenden.' },
  { id: 'aufbereitung', question: 'Kann ich einen Termin für Fahrzeugaufbereitung online anfragen?', answer: 'Ja. Über das Formular Termin anfragen können Sie Fahrzeug, Wunschleistung und bevorzugten Termin übermitteln.' },
  { id: 'business', question: 'Arbeitet CarCare auch für Autohäuser, Fuhrparks und Agenturen?', answer: 'Ja. Geschäftskunden erhalten strukturierte Abläufe, feste Ansprechpartner und planbare Fahrzeugdienstleistungen.' },
];

// MUSS mit den sichtbaren FAQs in `pages/AccidentRepairPage.tsx` uebereinstimmen.
const accidentFaq = [
  { id: 'melden', question: 'Wie melde ich einen Unfallschaden bei CarCare Leipzig?', answer: 'Sie können den Schaden telefonisch unter 0341 - 261 77 90 oder über das Online-Formular melden. Hilfreich sind Fahrzeugdaten, Schadenart, Fotos des Schadens und Informationen zur Versicherung.' },
  { id: 'versicherung', question: 'Übernimmt CarCare die Abstimmung mit der Versicherung?', answer: 'Ja. Auf Wunsch übernimmt CarCare die Kommunikation mit Ihrer Versicherung sowie den Schriftverkehr rund um den Schadenfall und stimmt sich bei Bedarf mit dem Gutachter ab.' },
  { id: 'welche', question: 'Welche Reparaturmethode kommt bei meinem Schaden infrage?', answer: 'Das hängt vom Schadenbild ab. Ist der Lack intakt und die Delle zugänglich, entfernen wir sie lackfrei. Bei kleineren Lackschäden greift Spot-Repair, bei dem nur der betroffene Bereich bearbeitet wird. Erst wenn beides nicht ausreicht, folgt die Komplettlackierung des Bauteils.' },
  { id: 'wertminderung', question: 'Entsteht durch die Reparatur eine Wertminderung?', answer: 'Bei der lackfreien Dellenentfernung nicht: Die Methode ist lackschonend und im Nachhinein nicht sicht- oder nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung.' },
  { id: 'anzahlung', question: 'Muss ich bei einem Hagelschaden in Vorleistung gehen?', answer: 'Nein. Eine Anzahlung ist nicht nötig – wir rechnen direkt mit der Versicherung ab. Die Kalkulation erfolgt über das von Versicherern und Gutachtern anerkannte System Audatex.' },
  { id: 'ersatzmobilitaet', question: 'Gibt es Ersatzmobilität während der Reparatur?', answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug bereit, damit Sie während der Reparatur mobil bleiben. Sprechen Sie uns bei der Schadenmeldung darauf an, damit wir es einplanen können.' },
  { id: 'marken', question: 'Repariert CarCare auch mein Fahrzeugfabrikat?', answer: 'Ja. CarCare ist ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeitet alle Marken – vom Kleinwagen bis zum Premiumfahrzeug.' },
];

// MUSS mit den sichtbaren FAQs in `pages/VehicleDetailingPage.tsx` uebereinstimmen.
const detailingFaq = [
  { id: 'dauer', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Das hängt von Leistung, Zustand und Umfang ab. Eine reine Außenpflege ist deutlich schneller erledigt als die kombinierte Premiumpflege mit Motorreinigung und Versiegelung. CarCare stimmt den Ablauf nach der Anfrage persönlich ab und nennt Ihnen dabei den Zeitrahmen für Ihr Fahrzeug.' },
  { id: 'preise', question: 'Was kostet eine Autoaufbereitung bei CarCare Leipzig?', answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider Pakete 299,00 €. Die Premiumpflege „exklusiv“ mit SWIZÖL-Wachsen beginnt bei 348,00 €. Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer.' },
  { id: 'paketwahl', question: 'Welches Pflegepaket ist das richtige für mich?', answer: 'Geht es um Glanz und Lackschutz von außen, reicht die Brillant Außenpflege. Steht der Innenraum im Vordergrund – etwa Polster, Leder oder Gerüche –, ist die Intensiv Innenreinigung passend. Wer beides braucht, etwa vor Verkauf oder Leasingrückgabe, wählt die Premiumpflege.' },
  { id: 'unterschied', question: 'Was ist der Unterschied zwischen Autowäsche und Aufbereitung?', answer: 'Eine Wäsche reinigt die Oberfläche. Die Aufbereitung geht darüber hinaus: Sie entfernt Anhaftungen, die die Wäsche stehen lässt, arbeitet den Lack durch Politur auf, versiegelt ihn anschließend und behandelt den Innenraum materialgerecht bis in die Details.' },
  { id: 'leasing', question: 'Hilft CarCare bei der Leasingrückgabe?', answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe, setzen Gebrauchsspuren wie Dellen, Lackschäden oder Felgenschäden fachgerecht instand und bereiten es auf. Das reduziert vermeidbare Nachbelastungen durch den Rückgabegutachter.' },
  { id: 'tierhaare', question: 'Werden auch stark verschmutzte Fahrzeuge angenommen?', answer: 'Ja, allerdings mit gesonderter Absprache. Fahrzeuge mit extremen Verschmutzungen – zum Beispiel Tierhaare – bedürfen eines höheren Aufwands und werden deshalb vorab individuell besprochen.' },
  { id: 'geruch', question: 'Was hilft gegen hartnäckige Gerüche im Innenraum?', answer: 'Für belastete Innenraumluft bieten wir zwei Verfahren an: die Ozonbehandlung für 45,00 € mit rund 30 Minuten Einwirkzeit sowie die Heißvernebelung mit dem KC-Refresher für 59,00 €, die länger anhaltend gegen Bakterien, behüllte Viren und Schimmelpilze wirkt.' },
  { id: 'business', question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?', answer: 'Ja. CarCare arbeitet für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards. Für wiederkehrende Aufbereitung gibt es feste Ansprechpartner und planbare Abläufe.' },
];

// MUSS mit den sichtbaren FAQs in `pages/PrivatkundenPage.tsx` uebereinstimmen.
const privatkundenFaq = [
  { id: 'vorteil', question: 'Was habe ich als Privatkunde von CarCare gegenüber einer Vertragswerkstatt?', answer: 'Sie bekommen Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung an einem Standort statt bei mehreren Betrieben, mit einem festen Ansprechpartner. CarCare ist markenunabhängig, arbeitet als Glasurit-Lackpartner farbtongenau und empfiehlt grundsätzlich die kleinere Reparaturlösung, wo sie fachlich ausreicht.' },
  { id: 'kosten', question: 'Was kostet die Aufbereitung meines Autos?', answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider 299,00 €. Die Premiumpflege „exklusiv“ beginnt bei 348,00 €. Alle Preise inklusive gesetzlicher Mehrwertsteuer. Für Reparaturen erhalten Sie einen individuellen Kostenvoranschlag, weil der Aufwand vom Schadenbild abhängt.' },
  { id: 'termin', question: 'Brauche ich als Privatkunde einen Termin?', answer: 'Für Aufbereitung und planbare Reparaturen ist ein Termin sinnvoll, damit Ihr Fahrzeug ohne Wartezeit bearbeitet wird. Bei einem frischen Unfallschaden melden Sie sich direkt telefonisch unter 0341 - 261 77 90 — wir besprechen dann das weitere Vorgehen.' },
  { id: 'marken', question: 'Arbeitet CarCare an allen Fahrzeugmarken?', answer: 'Ja. Als markenunabhängiger Meisterbetrieb bearbeiten wir alle Marken — vom Kleinwagen bis zum Premiumfahrzeug.' },
  { id: 'versicherung', question: 'Muss ich den Schaden selbst mit der Versicherung klären?', answer: 'Nein. Auf Wunsch übernimmt CarCare die komplette Abwicklung: Kostenvoranschlag, Abstimmung mit Versicherern und Gutachtern sowie die Kommunikation während der Reparatur. Bei einem Hagelschaden rechnen wir direkt mit der Versicherung ab, eine Anzahlung ist nicht nötig.' },
  { id: 'klein', question: 'Lohnt sich eine Reparatur auch bei kleinen Schäden?', answer: 'Häufig ja. Bei kleineren Lackschäden ist Spot-Repair unsere bevorzugte Methode, weil nur der betroffene Bereich bearbeitet wird. Bei Dellen mit intaktem Lack entfällt das Lackieren sogar ganz. Beides ist deutlich weniger aufwendig als eine Komplettlackierung.' },
  { id: 'leasing', question: 'Kann CarCare mein Auto auf die Leasingrückgabe vorbereiten?', answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe und setzen Gebrauchsspuren fachgerecht instand, um vermeidbare Nachbelastungen durch den Rückgabegutachter zu reduzieren.' },
  { id: 'mobil', question: 'Bleibe ich während der Reparatur mobil?', answer: 'Nach Verfügbarkeit stellen wir Ihnen ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.' },
];

// MUSS mit den sichtbaren FAQs in `pages/BusinessCustomersPage.tsx` uebereinstimmen.
const businessFaq = [
  { id: 'rahmen', question: 'Sind feste Abläufe für Geschäftskunden möglich?', answer: 'Ja. CarCare strukturiert wiederkehrende Prozesse für Autohäuser, Fuhrparks, Versicherungen und Agenturen — mit festem Ansprechpartner, vereinbarter Frequenz und definierten Kommunikationswegen.' },
  { id: 'schadensteuerung', question: 'Arbeitet CarCare mit Versicherungen und Schadensteuerern zusammen?', answer: 'Ja. Versicherer und Schadensteuerer gehören zu den Geschäftskunden von CarCare. Wir übernehmen Schadenaufnahme, Kalkulation über das anerkannte System Audatex und die Instandsetzung aus einer Hand — inklusive Schriftverkehr und Abstimmung mit dem Gutachter.' },
  { id: 'partner', question: 'Für welche Unternehmen arbeitet CarCare bereits?', answer: 'Zu den Betrieben, für die CarCare arbeitet, zählen unter anderem Volkswagen Automobile Leipzig, das Audi Zentrum Leipzig, das Porsche Zentrum Leipzig, das Porsche Werk Leipzig und das Autohaus Otto Grimm. Im Schadenbereich wickelt CarCare Fälle mit über 30 Versicherern ab, darunter HUK Coburg, Gothaer, VHV, Generali, R+V und Signal Iduna.' },
  { id: 'flotte', question: 'Können mehrere Fahrzeuge gleichzeitig bearbeitet werden?', answer: 'Ja. Auf 3.000 qm mit über 50 Mitarbeitern lassen sich auch mehrere Fahrzeuge parallel bearbeiten — etwa bei Hagelereignissen oder wiederkehrender Flottenpflege. Umfang und Zeitfenster werden vorab abgestimmt.' },
  { id: 'einhaus', question: 'Werden Arbeiten an Fremdbetriebe weitergegeben?', answer: 'Nein. Karosserie, Lackierung, Smart Repair, Felgeninstandsetzung, Autoglas und Aufbereitung finden im eigenen Haus statt. Das spart eine Schnittstelle und hält die Verantwortung an einer Stelle.' },
  { id: 'premium', question: 'Hat CarCare Erfahrung mit Premiumfahrzeugen?', answer: 'Ja. CarCare arbeitet als Glasurit-Lackpartner farbtongenau und mit sorgfältigem Umgang bei hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
  { id: 'digital', question: 'Gibt es digitale Schadenübermittlung?', answer: 'Eine digitale Schadenübermittlung ist perspektivisch vorgesehen und kann in der Zusammenarbeit berücksichtigt werden. Aktuell erfolgt die Übermittlung telefonisch, per E-Mail oder über das Formular.' },
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

// MUSS mit den sichtbaren FAQs in `pages/LeasingrueckgabePage.tsx` uebereinstimmen.
const leasingFaq = [
  { id: 'lohnt', question: 'Lohnt es sich, vor der Leasingrückgabe reparieren zu lassen?', answer: 'In der Regel ja, wenn erkennbare Schäden vorliegen. Der Leasinggeber rechnet festgestellte Schäden nach seinen eigenen Sätzen ab, die meist über den Kosten einer Reparatur im Fachbetrieb liegen. Bei reiner Gebrauchsspur ohne Substanzschaden raten wir dagegen häufig ab — wir sagen Ihnen bei der Begutachtung, was in Ihrem Fall sinnvoll ist.' },
  { id: 'wann', question: 'Wie früh vor der Rückgabe sollte ich mich melden?', answer: 'Planen Sie einige Wochen Vorlauf ein. Dann bleibt genug Zeit für Begutachtung, Kostenvoranschlag, Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin knapp wird. Bei mehreren Fuhrparkfahrzeugen sollte der Vorlauf entsprechend größer sein.' },
  { id: 'was', question: 'Was bewertet der Rückgabegutachter?', answer: 'Bewertet werden unter anderem Lackschäden, Beschädigungen an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe und der Zustand des Innenraums. Normale Abnutzung bei vertragsgemäßer Nutzung ist in der Regel abgedeckt; wo genau die Grenze liegt, legt Ihr Leasingvertrag fest.' },
  { id: 'kosten', question: 'Was kostet die Vorbereitung auf die Leasingrückgabe?', answer: 'Für die Reparaturen gibt es keinen Listenpreis, weil der Aufwand vom Schadenbild abhängt — Sie erhalten dafür einen Kostenvoranschlag. Für die Aufbereitung gelten feste Preise: Intensiv Innenreinigung 199,00 €, Premiumpflege mit Innen- und Außenaufbereitung 299,00 €, jeweils inklusive gesetzlicher Mehrwertsteuer.' },
  { id: 'wertminderung', question: 'Entsteht durch die Reparatur eine Wertminderung?', answer: 'Bei der lackfreien Dellenentfernung nicht: Sie ist lackschonend und im Nachhinein nicht nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur — als Glasurit-Lackpartner arbeiten wir farbtongenau, sodass weder Farbton noch Effektunterschiede für das Auge erkennbar sind.' },
  { id: 'fuhrpark', question: 'Bereitet CarCare auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?', answer: 'Ja. Auf 3.000 qm mit über 50 Mitarbeitern lassen sich mehrere Rückläufer parallel bearbeiten. Sie erhalten einen festen Ansprechpartner und je Fahrzeug eine nachvollziehbare Aufstellung, sodass sich Reparaturkosten gegen die erwartete Nachbelastung abwägen lassen.' },
  { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.' },
  { id: 'marken', question: 'Gilt das für alle Fahrzeugmarken?', answer: 'Ja. CarCare ist ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeitet alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.' },
];

// MUSS mit den sichtbaren FAQs in `pages/UeberUnsPage.tsx` uebereinstimmen.
const ueberUnsFaq = [
  { id: 'wer', question: 'Wer steht hinter dem CarCare Center Leipzig?', answer: 'Betreiber ist die BS CarCare GmbH mit Sitz An den Tierkliniken 42, 04103 Leipzig. Der Betrieb besteht seit 1993, ist Meisterbetrieb des Kfz-Lackierhandwerks und beschäftigt über 50 Mitarbeiter auf rund 3.000 qm Betriebsfläche.' },
  { id: 'groesse', question: 'Wie groß ist der Betrieb?', answer: 'CarCare gehört mit rund 3.000 qm Betriebsfläche und über 50 Mitarbeitern zu den größten Karosserie- und Lackierbetrieben in Leipzig und Umgebung. Die Größe erlaubt es, mehrere Fahrzeuge parallel zu bearbeiten und Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung vollständig im eigenen Haus abzudecken.' },
  { id: 'marken', question: 'Ist CarCare an eine Fahrzeugmarke gebunden?', answer: 'Nein. CarCare ist markenunabhängig und bearbeitet alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug. Zu den Kunden zählen unter anderem Werksniederlassungen deutscher Premiumhersteller.' },
  { id: 'zertifikate', question: 'Welche Qualifikationen und Partnerschaften hat CarCare?', answer: 'CarCare ist Meisterbetrieb des Kfz-Lackierhandwerks, Glasurit-Lackpartner, WINTEC-Partner für Autoglas nach ISO 9001 mit TÜV-Zertifizierung und arbeitet mit einem TÜV-zertifizierten Felgenreparaturverfahren. Schäden werden mit dem anerkannten System Audatex kalkuliert.' },
  { id: 'einzugsgebiet', question: 'Welches Gebiet betreut CarCare?', answer: 'Schwerpunkt ist Leipzig mit dem Umland bis etwa 50 km — darunter Markkleeberg, Schkeuditz, Taucha, Markranstädt, Zwenkau, Borna, Grimma, Wurzen, Delitzsch, Eilenburg und Halle (Saale). Geschäftskunden wie Autohäuser und Fuhrparks werden auch darüber hinaus betreut.' },
  { id: 'bewerbung', question: 'Sucht CarCare neue Mitarbeiter?', answer: 'CarCare beschäftigt Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater. Offene Stellen und der Weg zur Initiativbewerbung stehen auf der Karriereseite.' },
  { id: 'partner', question: 'Kann mein Autohaus oder meine Versicherung Partner werden?', answer: 'Ja. CarCare arbeitet mit Autohäusern, Fuhrparks, Versicherungen und Versicherungsagenturen zusammen. Für die Zusammenarbeit gibt es feste Ansprechpartner, strukturierte Abläufe und die komplette Schadenabwicklung inklusive Audatex-Kalkulation.' },
];

export const pageSchemas: Record<string, unknown[]> = {
  '/': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }]),
    homeServiceListSchema(),
    faqSchema(homeFaq),
  ],
  '/leistungen': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Leistungen', path: '/leistungen' }]),
    serviceSchema('Fahrzeugdienstleistungen Leipzig', 'Fahrzeugaufbereitung, Leasingrückgabe, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice in Leipzig.', '/leistungen'),
    faqSchema(servicesFaq),
  ],
  '/unfallinstandsetzung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Unfallinstandsetzung Leipzig', path: '/unfallinstandsetzung-leipzig' }]),
    serviceSchema('Unfallinstandsetzung Leipzig', 'Schadenaufnahme, Audatex-Kalkulation, Gutachterservice, Versicherungsabwicklung, Karosseriearbeiten und Reparaturlackierung — dazu Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur und Autoglas in Leipzig.', '/unfallinstandsetzung-leipzig'),
    faqSchema(accidentFaq),
  ],
  '/fahrzeugaufbereitung-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Fahrzeugaufbereitung Leipzig', path: '/fahrzeugaufbereitung-leipzig' }]),
    serviceSchema('Fahrzeugaufbereitung Leipzig', 'Professionelle Innenaufbereitung, Außenaufbereitung, Lackreinigung, Politur, Versiegelung, Geruchsentfernung und Leasingrückgabe-Vorbereitung mit festen Paketpreisen ab 169,00 €.', '/fahrzeugaufbereitung-leipzig'),
    // Die Preise stehen sichtbar auf der Seite; als `Offer` sind sie zusaetzlich
    // maschinenlesbar und damit fuer KI-Antworten zitierbar.
    offerCatalogSchema('Pflegepakete und Desinfektion', '/fahrzeugaufbereitung-leipzig', priceOffers),
    faqSchema(detailingFaq),
  ],
  '/leasingrueckgabe-leipzig': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Leasingrückgabe Leipzig', path: '/leasingrueckgabe-leipzig' }]),
    serviceSchema('Leasingrückgabe-Vorbereitung Leipzig', 'Begutachtung vor der Leasingrückgabe sowie Instandsetzung von Dellen, Lackschäden, Felgen und Glas mit anschließender Fahrzeugaufbereitung — für Privatkunden und Fuhrparks in Leipzig.', '/leasingrueckgabe-leipzig'),
    faqSchema(leasingFaq),
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
  '/privatkunden': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Privatkunden', path: '/privatkunden' }]),
    serviceSchema('Fahrzeugservice für Privatkunden Leipzig', 'Fahrzeugaufbereitung, Unfallreparatur, Smart Repair, Dellenentfernung, Lackierung, Felgen, Autoglas und Leasingrückgabe-Vorbereitung für Privatkunden in Leipzig.', '/privatkunden'),
    faqSchema(privatkundenFaq),
  ],
  '/geschaeftskunden': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Geschäftskunden', path: '/geschaeftskunden' }]),
    serviceSchema('Fuhrparkservice und Geschäftskundenservice Leipzig', 'Fahrzeugdienstleistungen für Autohäuser, Fuhrparks, Versicherungen, Schadensteuerer und Versicherungsagenturen — inklusive Leasingrückgabe-Vorbereitung und Fuhrparkservice.', '/geschaeftskunden'),
    faqSchema(businessFaq),
  ],
  '/ueber-uns': [
    breadcrumbSchema([{ name: 'Startseite', path: '/' }, { name: 'Über uns', path: '/ueber-uns' }]),
    aboutPageSchema('/ueber-uns', 'Die BS CarCare GmbH ist seit 1993 Meisterbetrieb des Kfz-Lackierhandwerks in Leipzig. Über 50 Mitarbeiter bearbeiten auf 3.000 qm Karosserie, Lack, Smart Repair, Felgen, Autoglas und Fahrzeugaufbereitung — als Glasurit-Lackpartner und WINTEC-Partner.'),
    faqSchema(ueberUnsFaq),
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
