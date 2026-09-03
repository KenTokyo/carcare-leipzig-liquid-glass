import { FAQItem } from '../types';

/**
 * EINZIGE QUELLE aller FAQ-Inhalte, geschluesselt nach Route.
 *
 * Sichtbarer Block und JSON-LD lesen beide hier — `PageFAQ route="…"` rendert
 * daraus, `seo/pageSchemas.ts` leitet `faqSchema` daraus ab. Damit kann der
 * ausgezeichnete Text vom sichtbaren nicht mehr abweichen.
 *
 * Vorgeschichte: Bis 2026-09-01 lagen die Inhalte doppelt — je einmal in der
 * Seitenkomponente und einmal in `seo/pageSchemas.ts`. Von 68 Eintraegen waren
 * bereits zwei auseinandergelaufen (Startseite: fehlende Anfuehrungszeichen in
 * der Antwort `aufbereitung`; `ersatzwagen` sichtbar, aber nicht ausgezeichnet),
 * und drei Eintraege des Wissensbereichs existierten ueberhaupt nur im Markup.
 * Details: docs/faq-single-source/tasks/2026-09-01-faq-single-source-tasks.md
 *
 * REGEL: Eine Route gehoert nur dann hierher, wenn ihre Seite den Block auch
 * rendert. `scripts/check-faq.mjs` bricht den Build ab, wenn das nicht stimmt.
 * Artikel-FAQs liegen bewusst NICHT hier, sondern bei ihrem Artikel in
 * `data/knowledgeArticles.ts` — dort gilt dieselbe Ein-Quellen-Regel.
 */
export const faqsByRoute: Record<string, FAQItem[]> = {
  // Startseite
  '/': [
    { id: 'unfall', question: 'Kann ich beim CarCare Center einen Unfallschaden in Leipzig melden?', answer: 'Ja. Sie können Ihren Unfallschaden online über das Formular oder telefonisch melden. Wir unterstützen Sie bei Schadenaufnahme, Kalkulation und Reparatur.' },
    { id: 'versicherung', question: 'Unterstützt das CarCare Center bei der Abstimmung mit Versicherung oder Gutachter?', answer: 'Auf Wunsch begleiten wir die Abstimmung mit Gutachtern und Versicherern und halten Sie während der Reparatur persönlich auf dem Laufenden.' },
    { id: 'aufbereitung', question: 'Kann ich einen Termin für Fahrzeugaufbereitung online anfragen?', answer: 'Ja. Über das Formular „Termin anfragen“ können Sie Fahrzeug, Wunschleistung und bevorzugten Termin übermitteln.' },
    { id: 'business', question: 'Arbeitet das CarCare Center auch für Autohäuser, Fuhrparks und Agenturen?', answer: 'Ja. Geschäftskunden erhalten strukturierte Abläufe, feste Ansprechpartner und planbare Fahrzeugdienstleistungen.' },
    { id: 'ersatzwagen', question: 'Gibt es während der Reparatur Ersatzmobilität?', answer: 'Ersatzmobilität wird kommuniziert und organisiert, sofern ein passendes Fahrzeug verfügbar ist und die Rahmenbedingungen stimmen.' },
  ],

  // Leistungsuebersicht
  '/leistungen': [
    { id: 'umfang', question: 'Welche Leistungen bietet das CarCare Center in Leipzig an?', answer: 'Wir bündeln Fahrzeugaufbereitung, Leasingrückgabe-Vorbereitung, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice — alles an einem Standort in Leipzig.' },
    { id: 'einhaus', question: 'Bekomme ich Reparatur und Lackierung aus einer Hand?', answer: 'Ja. Karosseriearbeiten, Lackierung, Smart Repair, Felgen und Aufbereitung finden auf über 3.000 m² im eigenen Haus statt. Ihr Fahrzeug wird für die einzelnen Schritte nicht an Fremdbetriebe weitergereicht.' },
    { id: 'beratung', question: 'Welche Leistung ist für mein Fahrzeug sinnvoll?', answer: 'Das hängt von Fahrzeugzustand, Schadenbild und Ziel ab. Bei kleineren Lackschäden prüfen wir zuerst Smart Repair, weil es günstiger und schneller ist als eine Komplettlackierung. Wir beraten vor Ort oder telefonisch und empfehlen den passenden Ablauf.' },
    { id: 'versicherung', question: 'Übernimmt das CarCare Center die Abwicklung mit der Versicherung?', answer: 'Ja. Auf Wunsch übernehmen wir die Abstimmung mit Versicherern, Agenturen und Gutachtern — von der Schadenaufnahme über die Kalkulation bis zur Freigabe.' },
    { id: 'business', question: 'Sind die Leistungen auch für Geschäftskunden verfügbar?', answer: 'Ja. Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen erhalten strukturierte Abläufe und feste Ansprechpartner.' },
  ],

  // Unfallinstandsetzung
  '/unfallinstandsetzung-leipzig': [
    { id: 'melden', question: 'Wie melde ich einen Unfallschaden beim CarCare Center Leipzig?', answer: 'Sie können den Schaden telefonisch unter 0341 - 261 77 90 oder über das Online-Formular melden. Hilfreich sind Fahrzeugdaten, Schadenart, Fotos des Schadens und Informationen zur Versicherung.' },
    { id: 'versicherung', question: 'Übernimmt das CarCare Center die Abstimmung mit der Versicherung?', answer: 'Ja. Auf Wunsch übernehmen wir die Kommunikation mit Ihrer Versicherung sowie den Schriftverkehr rund um den Schadenfall und stimmen uns bei Bedarf mit dem Gutachter ab.' },
    { id: 'welche', question: 'Welche Reparaturmethode kommt bei meinem Schaden infrage?', answer: 'Das hängt vom Schadenbild ab. Ist der Lack intakt und die Delle zugänglich, entfernen wir sie lackfrei. Bei kleineren Lackschäden greift Spot-Repair, bei dem nur der betroffene Bereich bearbeitet wird. Erst wenn beides nicht ausreicht, folgt die Komplettlackierung des Bauteils.' },
    { id: 'wertminderung', question: 'Entsteht durch die Reparatur eine Wertminderung?', answer: 'Bei der lackfreien Dellenentfernung nicht: Die Methode ist lackschonend und im Nachhinein nicht sicht- oder nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur ohne erkennbare Farbton- oder Effektunterschiede zur Originallackierung.' },
    { id: 'anzahlung', question: 'Muss ich bei einem Hagelschaden in Vorleistung gehen?', answer: 'Nein. Eine Anzahlung ist nicht nötig – wir rechnen direkt mit der Versicherung ab. Die Kalkulation erfolgt über das von Versicherern und Gutachtern anerkannte System Audatex.' },
    { id: 'ersatzmobilitaet', question: 'Gibt es Ersatzmobilität während der Reparatur?', answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug bereit, damit Sie während der Reparatur mobil bleiben. Sprechen Sie uns bei der Schadenmeldung darauf an, damit wir es einplanen können.' },
    { id: 'marken', question: 'Repariert das CarCare Center auch mein Fahrzeugfabrikat?', answer: 'Ja. Wir sind ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeiten alle Marken – vom Kleinwagen bis zum Premiumfahrzeug.' },
  ],

  // Fahrzeugaufbereitung
  '/fahrzeugaufbereitung-leipzig': [
    { id: 'dauer', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Das hängt von Leistung, Zustand und Umfang ab. Eine reine Außenpflege ist deutlich schneller erledigt als die kombinierte Premiumpflege mit Motorreinigung und Versiegelung. Wir stimmen den Ablauf nach der Anfrage persönlich ab und nennen Ihnen dabei den Zeitrahmen für Ihr Fahrzeug.' },
    { id: 'preise', question: 'Was kostet eine Autoaufbereitung beim CarCare Center Leipzig?', answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider Pakete 299,00 €. Die Premiumpflege „exklusiv“ mit SWIZÖL-Wachsen beginnt bei 348,00 €. Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer.' },
    { id: 'paketwahl', question: 'Welches Pflegepaket ist das richtige für mich?', answer: 'Geht es um Glanz und Lackschutz von außen, reicht die Brillant Außenpflege. Steht der Innenraum im Vordergrund – etwa Polster, Leder oder Gerüche –, ist die Intensiv Innenreinigung passend. Wer beides braucht, etwa vor Verkauf oder Leasingrückgabe, wählt die Premiumpflege.' },
    { id: 'unterschied', question: 'Was ist der Unterschied zwischen Autowäsche und Aufbereitung?', answer: 'Eine Wäsche reinigt die Oberfläche. Die Aufbereitung geht darüber hinaus: Sie entfernt Anhaftungen, die die Wäsche stehen lässt, arbeitet den Lack durch Politur auf, versiegelt ihn anschließend und behandelt den Innenraum materialgerecht bis in die Details.' },
    { id: 'leasing', question: 'Hilft das CarCare Center bei der Leasingrückgabe?', answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe, setzen Gebrauchsspuren wie Dellen, Lackschäden oder Felgenschäden fachgerecht instand und bereiten es auf. Das reduziert vermeidbare Nachbelastungen durch den Rückgabegutachter.' },
    { id: 'tierhaare', question: 'Werden auch stark verschmutzte Fahrzeuge angenommen?', answer: 'Ja, allerdings mit gesonderter Absprache. Fahrzeuge mit extremen Verschmutzungen – zum Beispiel Tierhaare – bedürfen eines höheren Aufwands und werden deshalb vorab individuell besprochen.' },
    { id: 'geruch', question: 'Was hilft gegen hartnäckige Gerüche im Innenraum?', answer: 'Für belastete Innenraumluft bieten wir zwei Verfahren an: die Ozonbehandlung für 45,00 € mit rund 30 Minuten Einwirkzeit sowie die Heißvernebelung mit dem KC-Refresher für 59,00 €, die länger anhaltend gegen Bakterien, behüllte Viren und Schimmelpilze wirkt.' },
    { id: 'business', question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?', answer: 'Ja. Wir arbeiten für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards. Für wiederkehrende Aufbereitung gibt es feste Ansprechpartner und planbare Abläufe.' },
  ],

  // Smart Repair
  '/smart-repair-leipzig': [
    { id: 'was', question: 'Was ist Smart bzw. Spot-Repair?', answer: 'Spot-Repair ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand und unsere bevorzugte Reparaturmethode bei kleineren Schäden. Statt das ganze Bauteil zu lackieren, wird gezielt nur der betroffene Bereich bearbeitet.' },
    { id: 'unsichtbar', question: 'Sieht man die reparierte Stelle?', answer: 'Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges – weder Farbton noch Effektunterschiede zur Originallackierung sollen für das menschliche Auge erkennbar sein.' },
    { id: 'grenzen', question: 'Wann reicht Smart Repair nicht aus?', answer: 'Nicht immer kann Spot-Repair angewendet werden. Bei größeren Schäden bleibt die Komplettlackierung des Bauteils, die unter modernen Bedingungen mit bestmöglichem Ergebnis ausgeführt wird.' },
  ],

  // Neu- und Reparaturlackierung
  '/autolackierung-leipzig': [
    { id: 'unsichtbar', question: 'Sieht man die Lackreparatur später?', answer: 'Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges. Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind.' },
    { id: 'spot', question: 'Was ist Spot-Repair?', answer: 'Spot-Repair ist die möglichst perfekte Lackinstandsetzung mit geringem Aufwand. Sie ist unsere bevorzugte Reparaturmethode, weil nur der betroffene Bereich bearbeitet wird.' },
    { id: 'komplett', question: 'Wann ist eine Komplettlackierung nötig?', answer: 'Nicht immer kann Spot-Repair angewendet werden. Dann bleibt die Komplettlackierung des Bauteils, die unter modernen Bedingungen mit bestmöglichem Ergebnis ausgeführt wird.' },
  ],

  // Dellenentfernung
  '/dellenentfernung-leipzig': [
    { id: 'wann', question: 'Bei welchen Schäden funktioniert die lackfreie Dellenentfernung?', answer: 'Die lackierfreie Reparaturmethode gilt heute als Standard bei Parkplatzdellen oder Hagelschäden. Voraussetzung ist, dass der Lack keine Beschädigungen aufweist.' },
    { id: 'wie', question: 'Wie funktioniert die Methode?', answer: 'Durch eigens entwickelte Druck- bzw. Ziehtechniken wird das Fahrzeugteil unter Verwendung spezieller Werkzeuge so weit bearbeitet, bis der Originalzustand wieder hergestellt ist.' },
    { id: 'wert', question: 'Bleibt der Wert des Fahrzeugs erhalten?', answer: 'Ja. Die Methode ist schonend für den Lack und im Nachhinein nicht sicht- bzw. nachweisbar, sodass keine Wertminderung entsteht.' },
    { id: 'versicherung', question: 'Erkennen Versicherungen die Methode an?', answer: 'Ja, die lackfreie Dellenentfernung ist von allen Versicherungen und Gutachtern anerkannt.' },
  ],

  // Hagelschadenreparatur
  '/hagelschadenreparatur-leipzig': [
    { id: 'anzahlung', question: 'Muss ich eine Anzahlung leisten?', answer: 'Nein. Eine Anzahlung ist nicht nötig – wir rechnen direkt mit der Versicherung ab.' },
    { id: 'abwicklung', question: 'Übernehmt ihr die Abstimmung mit Versicherung und Gutachter?', answer: 'Auf Wunsch sprechen wir mit Ihrem Gutachter bzw. Ihrer Versicherung und wickeln das gesamte Schadensereignis für Sie ab.' },
    { id: 'audatex', question: 'Wie wird der Hagelschaden kalkuliert?', answer: 'Die Kalkulation erfolgt mit dem durch Versicherer und Gutachter anerkannten System Audatex.' },
    { id: 'zustand', question: 'Wird das Fahrzeug wieder wie vorher?', answer: 'Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird. Bei intaktem Lack werden die Hageldellen lackfrei entfernt.' },
  ],

  // Felgenreparatur
  '/felgenreparatur-leipzig': [
    { id: 'welche', question: 'Welche Felgenschäden dürfen repariert werden?', answer: 'Behoben werden dürfen Bordstein- und Korrosionsschäden bis zu 1 mm Tiefe im Grundmetall der Felge. Eingriffe in das Materialgefüge wie Schweißarbeiten und Rückverformungen sind gesetzlich grundsätzlich abzulehnen.' },
    { id: 'sicher', question: 'Ist die Reparatur TÜV-konform und sicher?', answer: 'Wir arbeiten mit einem TÜV-zertifizierten Alufelgenreparaturverfahren als zertifizierter Wheel-Doctor-Fachbetrieb und kennen alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien. Nicht in jedem Fall ist eine Felgenreparatur erlaubt.' },
    { id: 'poliert', question: 'Repariert ihr auch polierte bzw. glanzgedrehte Felgen?', answer: 'Ja. Auch glanzgedrehte, im Volksmund polierte Alufelgen können wir wieder optisch wie neu erscheinen lassen.' },
    { id: 'anteil', question: 'Wie viele Felgenschäden lassen sich beheben?', answer: 'Mit unserem Verfahren können bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig behoben werden – statt teure neue Originalfelgen anzuschaffen.' },
  ],

  // Fuhrparkservice
  '/fuhrparkservice-leipzig': [
    { id: 'umfang', question: 'Welche Arbeiten übernimmt der Fuhrparkservice?', answer: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf übernehmen wir sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge.' },
    { id: 'schaden', question: 'Was passiert im Schadensfall?', answer: 'Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein, damit Ihr Betrieb weiterläuft.' },
    { id: 'partner', question: 'Arbeitet das CarCare Center mit Partnern aus der Branche zusammen?', answer: 'Ja. Sie profitieren von unseren langjährigen Kooperationspartnern aus der Automobilbranche.' },
  ],

  // Autoglas und Scheibenfolien
  '/autoglas-leipzig': [
    { id: 'garantie', question: 'Gibt es eine Garantie auf die Autoglas-Reparatur?', answer: 'Ja. Als WINTEC-Partner geben wir 30 Jahre Garantie auf die Autoglas-Reparatur und die Dichtigkeit ausgetauschter Scheiben.' },
    { id: 'leistungen', question: 'Welche Autoglas-Leistungen bietet das CarCare Center?', answer: 'Neuverglasung für PKW, LKW und Bus, Steinschlagreparaturen sowie Folienbeschichtungen aller Art – von der Scheibenfolierung bis zu Schutzfolien für den Lack.' },
    { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Ja. Während der Arbeiten stellen wir Ihnen ein Werkstatt-Ersatzfahrzeug gratis zur Verfügung.' },
    { id: 'steinschlag', question: 'Kann ein Steinschlag repariert werden oder muss die Scheibe getauscht werden?', answer: 'Je nach Größe und Lage lässt sich ein Steinschlag reparieren, bevor sich Risse ausbreiten. Ist das nicht möglich, tauschen wir die Scheibe fachgerecht aus.' },
  ],

  // Privatkunden
  '/privatkunden': [
    { id: 'vorteil', question: 'Was habe ich als Privatkunde vom CarCare Center gegenüber einer Vertragswerkstatt?', answer: 'Sie bekommen Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung an einem Standort statt bei mehreren Betrieben, mit einem festen Ansprechpartner. Wir sind markenunabhängig, arbeiten als Glasurit-Lackpartner farbtongenau und empfehlen grundsätzlich die kleinere Reparaturlösung, wo sie fachlich ausreicht.' },
    { id: 'kosten', question: 'Was kostet die Aufbereitung meines Autos?', answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider 299,00 €. Die Premiumpflege „exklusiv“ beginnt bei 348,00 €. Alle Preise inklusive gesetzlicher Mehrwertsteuer. Für Reparaturen erhalten Sie einen individuellen Kostenvoranschlag, weil der Aufwand vom Schadenbild abhängt.' },
    { id: 'termin', question: 'Brauche ich als Privatkunde einen Termin?', answer: 'Für Aufbereitung und planbare Reparaturen ist ein Termin sinnvoll, damit Ihr Fahrzeug ohne Wartezeit bearbeitet wird. Bei einem frischen Unfallschaden melden Sie sich direkt telefonisch unter 0341 - 261 77 90 — wir besprechen dann das weitere Vorgehen.' },
    { id: 'marken', question: 'Arbeitet das CarCare Center an allen Fahrzeugmarken?', answer: 'Ja. Als markenunabhängiger Meisterbetrieb bearbeiten wir alle Marken — vom Kleinwagen bis zum Premiumfahrzeug.' },
    { id: 'versicherung', question: 'Muss ich den Schaden selbst mit der Versicherung klären?', answer: 'Nein. Auf Wunsch übernehmen wir die komplette Abwicklung: Kostenvoranschlag, Abstimmung mit Versicherern und Gutachtern sowie die Kommunikation während der Reparatur. Bei einem Hagelschaden rechnen wir direkt mit der Versicherung ab, eine Anzahlung ist nicht nötig.' },
    { id: 'klein', question: 'Lohnt sich eine Reparatur auch bei kleinen Schäden?', answer: 'Häufig ja. Bei kleineren Lackschäden ist Spot-Repair unsere bevorzugte Methode, weil nur der betroffene Bereich bearbeitet wird. Bei Dellen mit intaktem Lack entfällt das Lackieren sogar ganz. Beides ist deutlich weniger aufwendig als eine Komplettlackierung.' },
    { id: 'leasing', question: 'Kann das CarCare Center mein Auto auf die Leasingrückgabe vorbereiten?', answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe und setzen Gebrauchsspuren fachgerecht instand, um vermeidbare Nachbelastungen durch den Rückgabegutachter zu reduzieren.' },
    { id: 'mobil', question: 'Bleibe ich während der Reparatur mobil?', answer: 'Nach Verfügbarkeit stellen wir Ihnen ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.' },
  ],

  // Geschaeftskunden
  '/geschaeftskunden': [
    { id: 'rahmen', question: 'Sind feste Abläufe für Geschäftskunden möglich?', answer: 'Ja. Wir strukturieren wiederkehrende Prozesse für Autohäuser, Fuhrparks, Versicherungen und Agenturen — mit festem Ansprechpartner, vereinbarter Frequenz und definierten Kommunikationswegen.' },
    { id: 'digital', question: 'Wie läuft die Abwicklung digital ab?', answer: 'Über unser eigenes Programm Data Motive. Auftragsannahme, Dokumentation und Rückmeldung laufen darüber, sodass zwischen den Schritten kein Medienbruch entsteht. Die Schadenkalkulation erfolgt zusätzlich über das von Versicherern und Gutachtern anerkannte System Audatex.' },
    { id: 'schadensteuerung', question: 'Arbeitet das CarCare Center mit Versicherungen und Schadensteuerern zusammen?', answer: 'Ja. Versicherer und Schadensteuerer gehören zu unseren Geschäftskunden. Wir übernehmen Schadenaufnahme, Kalkulation über das anerkannte System Audatex und die Instandsetzung aus einer Hand — inklusive Schriftverkehr und Abstimmung mit dem Gutachter.' },
    { id: 'partner', question: 'Für welche Unternehmen arbeitet das CarCare Center bereits?', answer: 'Zu den Betrieben, für die wir arbeiten, zählen unter anderem Volkswagen Automobile Leipzig, das Audi Zentrum Leipzig, das Porsche Zentrum Leipzig, das Porsche Werk Leipzig und das Autohaus Otto Grimm. Im Schadenbereich wickeln wir Fälle mit über 30 Versicherern ab, darunter HUK Coburg, Gothaer, VHV, Generali, R+V und Signal Iduna.' },
    { id: 'flotte', question: 'Können mehrere Fahrzeuge gleichzeitig bearbeitet werden?', answer: 'Ja. Auf über 3.000 m² mit über 50 Mitarbeitern lassen sich auch mehrere Fahrzeuge parallel bearbeiten — etwa bei Hagelereignissen oder wiederkehrender Flottenpflege. Umfang und Zeitfenster werden vorab abgestimmt.' },
    { id: 'einhaus', question: 'Werden Arbeiten an Fremdbetriebe weitergegeben?', answer: 'Nein. Karosserie, Lackierung, Smart Repair, Felgeninstandsetzung, Autoglas und Aufbereitung finden im eigenen Haus statt. Das spart eine Schnittstelle und hält die Verantwortung an einer Stelle.' },
    { id: 'premium', question: 'Hat das CarCare Center Erfahrung mit Premiumfahrzeugen?', answer: 'Ja. Wir arbeiten als Glasurit-Lackpartner farbtongenau und mit sorgfältigem Umgang bei hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
    { id: 'digital', question: 'Gibt es digitale Schadenübermittlung?', answer: 'Eine digitale Schadenübermittlung ist perspektivisch vorgesehen und kann in der Zusammenarbeit berücksichtigt werden. Aktuell erfolgt die Übermittlung telefonisch, per E-Mail oder über das Formular.' },
  ],

  // Karriere
  '/karriere': [
    { id: 'initiativ', question: 'Kann ich mich initiativ bewerben?', answer: 'Ja. Initiativbewerbungen sind willkommen, besonders für Aufbereitung, Lackierung, Karosserie und Service.' },
    // Antwort nennt die derzeit AUSGESCHRIEBENEN Stellen. Der Serviceberater gehoert zum
    // Betrieb, ist aber nicht ausgeschrieben (data/jobs.ts) — deshalb steht er hier nicht.
    { id: 'bereiche', question: 'Welche Stellen sind aktuell ausgeschrieben?', answer: 'Aktuell suchen wir Kfz-Aufbereiter, Fahrzeuglackierer sowie Karosserie- und Fahrzeugbaumechaniker. Weitere Berufsbilder wie den Serviceberater besetzen wir zurzeit nicht neu — eine Initiativbewerbung ist trotzdem willkommen.' },
    { id: 'kontakt', question: 'Wie starte ich die Bewerbung?', answer: 'Am einfachsten über die Kontaktseite oder telefonisch. Wir melden uns anschließend persönlich zurück.' },
  ],

  // Wissensbereich
  '/autoaufbereitung-wissen': [
    { id: 'ziel', question: 'Wofür ist der Wissensbereich gedacht?', answer: 'Der Wissensbereich erklärt Autoaufbereitung, Fahrzeugpflege, Werterhalt, Leasingrückgabe und Smart Repair fachlich und verständlich.' },
    { id: 'beratung', question: 'Ersetzt der Ratgeber eine Fahrzeugprüfung?', answer: 'Nein. Die Artikel geben Orientierung. Für konkrete Empfehlungen sollte der Fahrzeugzustand fachlich geprüft werden.' },
    { id: 'leipzig', question: 'Setzen Sie die beschriebenen Leistungen in Leipzig um?', answer: 'Ja. Wir unterstützen Sie bei Fahrzeugaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und ausgewählten Smart-Repair-Themen.' },
  ],

  // Leasingrueckgabe (nachgezogen 2026-09-02; kam mit 0b666d1 als eigene Kopie)
  '/leasingrueckgabe-leipzig': [
    { id: 'lohnt', question: 'Lohnt es sich, vor der Leasingrückgabe reparieren zu lassen?', answer: 'In der Regel ja, wenn erkennbare Schäden vorliegen. Der Leasinggeber rechnet festgestellte Schäden nach seinen eigenen Sätzen ab, die meist über den Kosten einer Reparatur im Fachbetrieb liegen. Bei reiner Gebrauchsspur ohne Substanzschaden raten wir dagegen häufig ab — wir sagen Ihnen bei der Begutachtung, was in Ihrem Fall sinnvoll ist.' },
    { id: 'wann', question: 'Wie früh vor der Rückgabe sollte ich mich melden?', answer: 'Planen Sie einige Wochen Vorlauf ein. Dann bleibt genug Zeit für Begutachtung, Kostenvoranschlag, Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin knapp wird. Bei mehreren Fuhrparkfahrzeugen sollte der Vorlauf entsprechend größer sein.' },
    { id: 'was', question: 'Was bewertet der Rückgabegutachter?', answer: 'Bewertet werden unter anderem Lackschäden, Beschädigungen an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe und der Zustand des Innenraums. Normale Abnutzung bei vertragsgemäßer Nutzung ist in der Regel abgedeckt; wo genau die Grenze liegt, legt Ihr Leasingvertrag fest.' },
    { id: 'kosten', question: 'Was kostet die Vorbereitung auf die Leasingrückgabe?', answer: 'Für die Reparaturen gibt es keinen Listenpreis, weil der Aufwand vom Schadenbild abhängt — Sie erhalten dafür einen Kostenvoranschlag. Für die Aufbereitung gelten feste Preise: Intensiv Innenreinigung 199,00 €, Premiumpflege mit Innen- und Außenaufbereitung 299,00 €, jeweils inklusive gesetzlicher Mehrwertsteuer.' },
    { id: 'wertminderung', question: 'Entsteht durch die Reparatur eine Wertminderung?', answer: 'Bei der lackfreien Dellenentfernung nicht: Sie ist lackschonend und im Nachhinein nicht nachweisbar. Bei Lackarbeiten ist unser Ziel die unsichtbare Reparatur — als Glasurit-Lackpartner arbeiten wir farbtongenau, sodass weder Farbton noch Effektunterschiede für das Auge erkennbar sind.' },
    { id: 'fuhrpark', question: 'Bereitet das CarCare Center auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?', answer: 'Ja. Auf über 3.000 m² mit über 50 Mitarbeitern lassen sich mehrere Rückläufer parallel bearbeiten. Sie erhalten einen festen Ansprechpartner und je Fahrzeug eine nachvollziehbare Aufstellung, sodass sich Reparaturkosten gegen die erwartete Nachbelastung abwägen lassen.' },
    { id: 'ersatz', question: 'Bekomme ich während der Arbeiten ein Ersatzfahrzeug?', answer: 'Nach Verfügbarkeit stellen wir ein Werkstattersatzfahrzeug zur Verfügung. Sprechen Sie uns bei der Terminvereinbarung darauf an, damit wir es einplanen können.' },
    { id: 'marken', question: 'Gilt das für alle Fahrzeugmarken?', answer: 'Ja. Wir sind ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.' },
  ],

  // Ueber uns (nachgezogen 2026-09-02; kam mit 0b666d1 als eigene Kopie)
  '/ueber-uns': [
    { id: 'wer', question: 'Wer steht hinter dem CarCare Center Leipzig?', answer: 'Betreiber ist die BS CarCare GmbH mit Sitz An den Tierkliniken 42, 04103 Leipzig. Wir bestehen seit 1998, sind Meisterbetrieb des Kfz-Lackierhandwerks und beschäftigen über 50 Mitarbeiter auf über 3.000 m² Betriebsfläche.' },
    { id: 'groesse', question: 'Wie groß ist der Betrieb?', answer: 'Wir gehören mit über 3.000 m² Betriebsfläche und über 50 Mitarbeitern zu den größten Karosserie- und Lackierbetrieben in Leipzig und Umgebung. Die Größe erlaubt es uns, mehrere Fahrzeuge parallel zu bearbeiten und Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung vollständig im eigenen Haus abzudecken.' },
    { id: 'marken', question: 'Ist das CarCare Center an eine Fahrzeugmarke gebunden?', answer: 'Nein. Wir sind markenunabhängig und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug. Zu unseren Kunden zählen unter anderem Werksniederlassungen deutscher Premiumhersteller.' },
    { id: 'zertifikate', question: 'Welche Qualifikationen und Partnerschaften hat das CarCare Center?', answer: 'Wir sind Meisterbetrieb des Kfz-Lackierhandwerks, Glasurit-Lackpartner, WINTEC-Partner für Autoglas nach ISO 9001 mit TÜV-Zertifizierung und arbeiten mit einem TÜV-zertifizierten Felgenreparaturverfahren. Schäden werden mit dem anerkannten System Audatex kalkuliert.' },
    { id: 'einzugsgebiet', question: 'Welches Gebiet betreut das CarCare Center?', answer: 'Schwerpunkt ist Leipzig mit dem Umland bis etwa 50 km — darunter Markkleeberg, Schkeuditz, Taucha, Markranstädt, Zwenkau, Borna, Grimma, Wurzen, Delitzsch, Eilenburg und Halle (Saale). Geschäftskunden wie Autohäuser und Fuhrparks werden auch darüber hinaus betreut.' },
    { id: 'bewerbung', question: 'Sucht das CarCare Center neue Mitarbeiter?', answer: 'Wir beschäftigen Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater. Offene Stellen und der Weg zur Initiativbewerbung stehen auf der Karriereseite.' },
    { id: 'partner', question: 'Kann mein Autohaus oder meine Versicherung Partner werden?', answer: 'Ja. Wir arbeiten mit Autohäusern, Fuhrparks, Versicherungen und Versicherungsagenturen zusammen. Für die Zusammenarbeit gibt es feste Ansprechpartner, strukturierte Abläufe und die komplette Schadenabwicklung inklusive Audatex-Kalkulation.' },
  ],

  // Aussenaufbereitung (Backlog 1.8)
  '/aussenaufbereitung-leipzig': [
    { id: 'umfang', question: 'Was gehört zur Außenaufbereitung?', answer: 'Intensive Vorreinigung und Felgenreinigung, Insektenentfernung, schonende Oberwäsche inklusive Abledern, Lackreinigung und Scheibenreinigung. Als Brillant Außenpflege kostet dieser Umfang 169,00 € inklusive gesetzlicher Mehrwertsteuer.' },
    { id: 'unterschied', question: 'Worin unterscheiden sich Außenaufbereitung und Lackaufbereitung?', answer: 'Die Außenaufbereitung reinigt das Fahrzeug und bereitet den Lack vor. Die Lackaufbereitung arbeitet die Lackoberfläche selbst auf: Sie entfernt Anhaftungen und matte Stellen durch Politur und schützt das Ergebnis mit einer Versiegelung. Beides lässt sich einzeln oder kombiniert beauftragen.' },
    { id: 'politur', question: 'Was bringt eine Hochglanzpolitur?', answer: 'Die Politur glättet die Lackoberfläche und holt Glanz zurück, der durch Anhaftungen und matte Stellen verloren gegangen ist. Tiefe Kratzer bis ins Grundmetall lassen sich damit nicht beheben — dort ist eine Lackreparatur nötig.' },
    { id: 'versiegelung', question: 'Wie lange hält eine Lackversiegelung?', answer: 'Das hängt von Nutzung, Pflege und Stellplatz ab. Die Versiegelung schützt den vorbereiteten Lack und erleichtert die Reinigung. Wir sagen Ihnen bei der Begutachtung, welcher Schutz für Ihr Fahrzeug sinnvoll ist.' },
    { id: 'wachs', question: 'Was hat es mit den SWIZÖL-Wachsen auf sich?', answer: 'Auf Wunsch arbeiten wir mit Wachsen von SWIZÖL mit einem Carnaubaanteil von 30 bis 60 %. Je höher der Anteil, desto höher der Glanzgrad. Diese Handarbeit ist Teil der Premiumpflege „exklusiv" ab 348,00 €.' },
  ],

  // Innenaufbereitung (Backlog 1.9)
  '/innenaufbereitung-leipzig': [
    { id: 'umfang', question: 'Was gehört zur Innenaufbereitung?', answer: 'Intensive Reinigung des gesamten Innenraumes inklusive Cockpit und Oberflächen, Polstershampoonierung oder materialgerechte Lederpflege, Scheibenreinigung innen und außen sowie auf Wunsch Geruchsentfernung. Als Intensiv Innenreinigung kostet dieser Umfang 199,00 € inklusive gesetzlicher Mehrwertsteuer.' },
    { id: 'leder', question: 'Wird Leder anders behandelt als Stoffpolster?', answer: 'Ja. Stoffpolster werden shampooniert, Leder bekommt stattdessen eine materialgerechte Pflege. Welches Verfahren zum Einsatz kommt, richtet sich nach der Ausstattung Ihres Fahrzeugs.' },
    { id: 'geruch', question: 'Lassen sich Gerüche dauerhaft entfernen?', answer: 'Oft ja, wenn die Ursache mitbehandelt wird. Zur Innenaufbereitung kommen bei Bedarf Ozonbehandlung für 45,00 € oder Heißvernebelung mit dem KC-Refresher für 59,00 € dazu. Sitzt die Ursache in durchfeuchtetem Material, klären wir das vorab bei der Begutachtung.' },
    { id: 'motorreinigung', question: 'Ist die Motorreinigung enthalten?', answer: 'Nicht in der Intensiv Innenreinigung. Sie ist Teil der Premiumpflege für 299,00 €, die Innen- und Außenaufbereitung kombiniert.' },
    { id: 'tierhaare', question: 'Was ist bei starker Verschmutzung oder Tierhaaren?', answer: 'Fahrzeuge mit extremen Verschmutzungen, etwa Tierhaaren, bedürfen einer gesonderten Absprache. Der Aufwand liegt dort über dem Paketumfang — wir schätzen ihn vorab ein und stimmen ihn mit Ihnen ab.' },
  ],
};

/** Routen mit sichtbarem FAQ-Block. Basis fuer Schema-Ableitung und Build-Pruefung. */
export const faqRoutes = Object.keys(faqsByRoute);
