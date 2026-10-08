# L17 · Über uns `/ueber-uns`

> Auszug `output/lektorat/auszuege/ueber-uns.md`, rund 1.350 Wörter: Titelbild, „Der Betrieb in Zahlen“ (vier Kacheln),
> Leistungsspektrum (sechs Karten), Qualifikation und Partnerschaften (sechs Kacheln, BVAT), Rundgang mit drei
> Bereichsvideos, Zeitstrahl (sechs Stationen), Zielgruppen, Google-Bewertungen, Arbeiten im Betrieb, FAQ (sieben Fragen),
> Abschluss, JSON-LD. Die Stationen 1998, 2000, 2013, 2017 (erster Satz) und 2026 sind **Andrés Wortlaut**
> (Schleife 4, 4.16–4.20, `data/historie.ts`); dort schlage ich nur vor, was grammatisch hakt.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L17-01 | Zeitstrahl 2000, Titel (auch im Vorlesetext) | Spot- und Smart-Repair | Spot-Repair und Smart Repair | Stilblatt 2: „Smart Repair“ getrennt. Der Ergänzungsstrich setzt „Smart-Repair“ voraus, deshalb ausschreiben (wie L08-01). Der Titel ist von uns abgeleitet, Andrés Text darunter schreibt es schon so | `data/historie.ts:50` |
| L17-02 | Kachel „Glasurit-Lackpartner“ | … erkennbar sind, mit umweltschonenden Wasserbasislacken. | … erkennbar sind. Wir arbeiten dafür mit umweltschonenden Wasserbasislacken. | wortgleicher Satz wie L15-04 (vom User angenommen) | `pages/UeberUnsPage.tsx:46` |
| L17-03 | „Qualifikation & Partnerschaften“, Einleitung | Zertifizierungen, Partnerschaften und Mitgliedschaften sind überprüfbar, anders als Qualitätsversprechen. Diese stehen hinter jeder Reparatur. | Zertifizierungen, Partnerschaften und Mitgliedschaften stehen hinter jeder Reparatur. Anders als Qualitätsversprechen sind sie überprüfbar. | Falscher Bezug: „Diese“ greift das zuletzt Genannte auf, also die Qualitätsversprechen. Gleiche Wörter, umgestellt | `pages/UeberUnsPage.tsx:174` |

Der längere Zeitstrahl-Titel läuft nirgends über (Prüfung Desktop 1440 und mobil 390, Build 08.10. 17:40: nur die
1-px-Vorlesetexte).

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L17-04 | **G:** Titelbild-Einleitung, JSON-LD `AboutPage` | Auf über 3.500 m² bearbeiten über 50 Mitarbeiter Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung, für … · JSON-LD: Über 50 Mitarbeiter bearbeiten auf über 3.500 m² Karosserie, Lack, … und Fahrzeugaufbereitung, … | Auf über 3.500 m² arbeiten über 50 Mitarbeiter in den Bereichen Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung, für … · JSON-LD entsprechend „arbeiten … in den Bereichen“ | Man bearbeitet eine Karosserie, aber keine „Aufbereitung“ und kein „Smart Repair“ | `pages/UeberUnsPage.tsx:135`, `seo/pageSchemas.ts:138` |
| L17-05 | Kachel „Seit 1998 am Markt“ | Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998, gewachsen mit den Fahrzeugen, Materialien und Reparaturverfahren, die heute Standard sind. | Seit 1998 in Leipzig, gewachsen von der Fahrzeugaufbereitung zum Karosserie- und Lackierbetrieb und mit den Fahrzeugen, Materialien und Reparaturverfahren, die heute Standard sind. | Widerspricht dem Zeitstrahl derselben Seite: 1998 Start als Aufbereitungsbetrieb, Karosserie und Neuteillackierung erst 2013 (vgl. L04, „Lackierung erst seit 2013“) | `pages/UeberUnsPage.tsx:37` |
| L17-06 | Kachel „Alle Fabrikate“ | …, ohne Bindung an eine Vertragswerkstatt. | …, ohne Bindung an einen Hersteller. | Eine Vertragswerkstatt ist an den Hersteller gebunden; gemeint ist, dass wir keine sind (so steht es auch bei den Referenzen der Geschäftskundenseite) | `pages/UeberUnsPage.tsx:40` |
| L17-07 | Zeitstrahl 1998 (André) | Start als Kfz-Aufbereitungsbetrieb und Anbieter/Dienstleister für Premiumhersteller in Leipzig und im gesamten Bundesgebiet, von Anfang an fachliche Grundlage. | Start als Kfz-Aufbereitungsbetrieb und Dienstleister für Premiumhersteller in Leipzig und im gesamten Bundesgebiet. | „Anbieter/Dienstleister“ nennt zwei Wörter für dasselbe. „von Anfang an fachliche Grundlage“ stand bei André hinter einem Gedankenstrich und hat ohne ihn keinen Satzbau mehr; es ist der Rest des früheren Satzes „Der Meisterbrief ist von Anfang an die fachliche Grundlage“. Wenn du den Gedanken behalten willst: „…, von Anfang an mit handwerklichem Anspruch.“ | `data/historie.ts:46` |
| L17-08 | Zeitstrahl 2013 (André) | Erweiterung des Portfolios um Komplettreparatur, Neuteillackierung und gesamte Karosserieinstandsetzung sowie … | … um Komplettreparatur, Neuteillackierung und die gesamte Karosserieinstandsetzung sowie … | Vor „gesamte“ fehlt der Artikel | `data/historie.ts:59` |
| L17-09 | Zeitstrahl 2017 (André, erster Satz) | Beginn der Zusammenarbeit im Schadens- und Versicherungsbereich durch großflächige Partnerschaften mit der Versicherungswirtschaft. | Beginn der Zusammenarbeit im Schaden- und Versicherungsbereich durch umfangreiche Partnerschaften mit der Versicherungswirtschaft. | „großflächig“ beschreibt Flächen, nicht Partnerschaften. „Schaden-“ wie überall sonst („Schadenfall“, „Schadenbereich“, L14-02) | `data/historie.ts:67` |
| L17-10 | „Für wen wir arbeiten“, Einleitung | Wir verstehen uns als Premium-Anbieter mit Fokus auf Dienstleistung auf qualitativ höchstem Niveau. | Wir verstehen uns als Premiumanbieter: Dienstleistung auf höchstem Niveau steht bei uns im Mittelpunkt. | „auf … auf“ und Nominalstil; „Premium…“ steht auf der Seite sonst zusammengeschrieben („Premiumhersteller“, „Premiumfahrzeug“) | `pages/UeberUnsPage.tsx:216` |
| L17-11 | „Arbeiten im CarCare Center“, Einleitung | Ein Betrieb dieser Größe bietet, was der Kleinbetrieb nicht kann: … | Ein Betrieb dieser Größe bietet, was ein Kleinbetrieb nicht bieten kann: … | „bietet, was … nicht kann“ lässt das Verb weg, das der Satz braucht | `pages/UeberUnsPage.tsx:231` |
| L17-12 | FAQ „Sucht das CarCare Center neue Mitarbeiter?“ | Wir beschäftigen Kfz-Aufbereiter, … sowie Serviceberater. Offene Stellen und der Weg zur Initiativbewerbung stehen auf der Karriereseite. | Ja. Offene Stellen und der Weg zur Initiativbewerbung stehen auf unserer Karriereseite. Wir beschäftigen Kfz-Aufbereiter, … sowie Serviceberater. | Antwort zuerst (Textregel 2, Ausnahme 3); die Karriereseite nennt vier Stellen und drei Ausbildungsplätze | `data/faqs.ts:188` |
| L17-13 | FAQ „Welches Gebiet betreut das CarCare Center?“ | … Geschäftskunden wie Autohäuser und Fuhrparks werden auch darüber hinaus betreut. | … Geschäftskunden wie Autohäuser und Fuhrparks betreuen wir auch darüber hinaus. | Antwort in Wir-Form (Ausnahme 3) statt Passiv | `data/faqs.ts:187` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L17-14 | H1, „Der Betrieb in Zahlen“, FAQ „Wie groß …?“ | „Einer der größten Karosserie- und Lackierbetriebe in Leipzig“ ist eine Spitzenaussage (Ebene 6). Sie ist gewollt und mit Fläche und Belegschaft begründet; so lassen. |
| L17-15 | Zeitstrahl 2013 | „mit modernster Ausstattung“: Superlativ im Wortlaut des Kunden (4.18). So lassen. |
| L17-16 | Kachel „Audatex- und DAT-Kalkulation“ | DAT steht nur hier, alle anderen Seiten nennen nur Audatex. Kein Fehler, wenn beide Systeme im Einsatz sind. |
| L17-17 | `components/Hero.tsx` | Enthält eine ältere Fassung des „Premium-Anbieter“-Satzes, wird aber nirgends eingebunden (seit dem Redesign a701ce9). Für Besucher unsichtbar; als Aufräumaufgabe vorgemerkt. |

## Geprüft und ohne Befund

Titel und Beschreibung (53/157 Zeichen), Stichwortleiste, Kacheln „Über 3.500 m²“, „Über 50 Mitarbeiter“,
Leistungskarten, Kacheln Meisterbetrieb, WINTEC, Felgen, Audatex/DAT, Versicherungsabwicklung, BVAT-Block, Rundgang und
Bereichstexte, Zeitstrahl 2026 und „Heute“, Zielgruppenkarten, Bewertungsblock mit Hinweis, Kacheln „Arbeiten im
CarCare Center“, FAQ 1–4 und „Partner werden“, Abschluss, Bildbeschreibungen, Vorlesetexte der Videos, JSON-LD.
