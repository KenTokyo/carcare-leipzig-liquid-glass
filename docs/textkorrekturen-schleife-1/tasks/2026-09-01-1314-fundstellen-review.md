# 1.3 + 1.4 — Fundstellen und Formulierungsvorschläge (Review, noch nicht umgesetzt)

Branch: `paket-a/textkorrekturen`
Referenz: `docs/textkorrekturen-schleife-1/tasks/2026-09-01-paket-a-tasks.md`
Stand: 164 Fundstellen „CarCare" ohne „Center", davon **149 zu bearbeiten**

> **An keiner dieser Stellen ist etwas geändert.** Diese Datei ist die Vorlage zur Freigabe.

---

## Das Ordnungsprinzip

Aus den Textregeln in `CLAUDE.md` ergibt sich eine Trennlinie, die fast alle
149 Stellen von allein sortiert:

> **Der Firmenname darf stehen — aber nie als Subjekt eines Verbs in der dritten Person.**

`CLAUDE.md` führt genau diesen Fall als falsch auf: „CarCare Center kümmert sich um
Ihr Fahrzeug." Der Name ist dort korrekt geschrieben, der Satz trotzdem falsch.
Die SEO-Ausnahme („wo der Firmenname bewusst stehen soll") rettet den Namen,
nicht die dritte Person. Daraus fünf Fälle:

| | Fall | Behandlung |
|---|---|---|
| **A** | Name in nominaler Position — Label, Überschrift, Präpositionalgefüge („Karriere bei …", „Warum … Leipzig") | Name bleibt, wird zu **„CarCare Center"** ergänzt |
| **B** | Name als Subjekt eines Aussagesatzes („CarCare übernimmt/bündelt/arbeitet …") | Satz **vollständig in 1. Person Plural** |
| **C** | FAQ-**Fragen** in Kundenstimme („Übernimmt CarCare …?") | **Entscheidung offen — siehe unten** |
| **D** | Juristische Firmierung „BS CarCare GmbH" | **unangetastet** |
| **E** | Code-Kommentare | **unangetastet** |

Fälle nach B sind gleichzeitig 1.3 **und** 1.4 — ein Satz, eine Änderung.
Deshalb steht in jeder Zeile der fertige Zielsatz, nicht zwei Schritte.

---

## Drei Entscheidungen, bevor irgendetwas geschrieben wird

### Entscheidung 1 — FAQ-Fragen: Name oder direkte Anrede?

**20 FAQ-Fragen** stehen in der Stimme des Kunden und nennen dabei den Betrieb
in der dritten Person: „Übernimmt CarCare die Abwicklung mit der Versicherung?"

Zwei saubere Wege, beide regelkonform:

| | Variante | Wirkung |
|---|---|---|
| **1a** | „Übernimmt **das CarCare Center** die Abwicklung mit der Versicherung?" | Marke bleibt im Frage-Anker. FAQ-Fragen sind das, woran KI-Suchmaschinen zitieren — der Name steht dort, wo er gefunden wird. Die dritte Person ist hier **die Stimme des Kunden**, nicht die Selbstbeschreibung des Betriebs. |
| **1b** | „**Übernehmen Sie** die Abwicklung mit der Versicherung?" | Konsequent dialogisch, spiegelt das „Sie"/„wir"-Verhältnis. Verliert den Markennamen als Entitätsanker in der Frage. |

**Meine Empfehlung: 1a.** Die Regel adressiert, wie der Betrieb über sich spricht.
Eine Kundenfrage ist keine Selbstbeschreibung, und `SEO-GEO-STANDARDS.md §4.3`
verlangt für die GEO-Sichtbarkeit ausdrücklich eigenständig verständliche
Frage-Antwort-Blöcke — „Übernehmen Sie …?" ist aus dem Kontext gerissen nicht mehr
zuordenbar, „Übernimmt das CarCare Center …?" schon.

### Entscheidung 2 — neun Meta-Titles werden zu lang

Ich hatte zuletzt von sieben Titles geschrieben; es sind **neun**. Mit
`| CarCare Center` statt `| CarCare` liegen sie bei 63–73 Zeichen. Vorschläge,
alle unter 60:

| Datei | aktuell (Z.) | Vorschlag (Z.) |
|---|---|---|
| AutoglasPage.tsx:26 | Autoglas & Scheibenfolien Leipzig \| WINTEC-Partner \| CarCare (60) | **Autoglas Leipzig \| WINTEC-Partner \| CarCare Center** (50) |
| AutolackierungPage.tsx:27 | Neu- & Reparaturlackierung Leipzig \| unsichtbar \| CarCare (57) | **Neu- & Reparaturlackierung Leipzig \| CarCare Center** (51) |
| DellenentfernungPage.tsx:27 | Dellenentfernung Leipzig \| ohne lackieren (PDR) \| CarCare (57) | **Dellenentfernung Leipzig \| ohne Lackieren \| CarCare Center** (58) |
| FelgenreparaturPage.tsx:28 | Felgenreparatur Leipzig \| TÜV-zertifiziert, Wheel-Doctor \| CarCare (66) | **Felgenreparatur Leipzig \| TÜV-zertifiziert \| CarCare Center** (59) |
| FuhrparkservicePage.tsx:25 | Fuhrparkservice Leipzig \| Firmenfuhrpark-Betreuung \| CarCare (60) | **Fuhrparkservice Leipzig \| Firmenflotte \| CarCare Center** (55) |
| HagelschadenreparaturPage.tsx:26 | Hagelschadenreparatur Leipzig \| Audatex, Versicherung \| CarCare (63) | **Hagelschadenreparatur Leipzig \| Audatex \| CarCare Center** (56) |
| ServicesPage.tsx:48 | Leistungen in Leipzig \| Aufbereitung, Unfall & Lack \| CarCare (61) | **Leistungen Leipzig \| Aufbereitung & Lack \| CarCare Center** (57) |
| SmartRepairPage.tsx:25 | Smart Repair Leipzig \| Spot-Repair, geringer Aufwand \| CarCare (62) | **Smart Repair Leipzig \| Spot-Repair \| CarCare Center** (51) |
| VehicleDetailingPage.tsx:83 | Fahrzeugaufbereitung Leipzig \| Preise ab 169 € \| CarCare (56) | **Fahrzeugaufbereitung Leipzig \| ab 169 € \| CarCare Center** (56) |

Jeder Vorschlag opfert einen Nebenbegriff, nie das Hauptkeyword und nie den Ort.
Wenn du einen Begriff behalten willst, sag welchen — dann fällt ein anderer.

**Nicht betroffen, weil bereits korrekt:** `HomePage.tsx`, `ContactPage.tsx`,
`NotFoundPage.tsx`, `PrivatkundenPage.tsx` führen „CarCare Center" schon heute.

### Entscheidung 3 — Alt-Texte: Marke oder „unser"?

**Zehn Bild-Alt-Texte** enthalten Komposita wie „CarCare-Mitarbeiter". Alt-Texte
beschreiben ein Bild, stehen also naturgemäß in der dritten Person — die Regel
zielt darauf nicht. Trotzdem steht „CarCare" dort allein.

- **3a (Empfehlung):** „**Unser Mitarbeiter** nimmt den Unfallschaden auf …" — löst
  1.3 und 1.4 zugleich, klingt natürlich.
- **3b:** „Mitarbeiter des **CarCare Center Leipzig** nimmt …" — hält den Markennamen
  in der Bildersuche.

---

## Teil 0 — Was nicht angefasst wird (15 Stellen)

**Juristische Firmierung (9):** `index.html:13` · `components/Footer.tsx:165`, `:287`,
`:290` · `seo/structuredData.ts:13`, `:23`, `:142`, `:167`, `:172`.
NAP-Konsistenz zu Impressum und Google Business Profile.

**Code-Kommentare (6):** `components/DetailingProcessSection.tsx:19` ·
`components/ExpandingCardAccordion.tsx:30` · `components/ScrollPinnedProcess.tsx:57` ·
`components/TargetGroupCards.tsx:14`, `:451` · `data/partners.ts:31`.

**`components/Hero.tsx`:** außen vor, gemäß Vorgabe.

---

## Teil 1 — Fall A: Name bleibt, „Center" ergänzt (28 Stellen)

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| components/About.tsx:26 | CarCare-**Center** | **CarCare Center** ⚠️ Bindestrich-Verstoß |
| components/ArticleLayout.tsx:54 | Profi-Tipps von CarCare | Profi-Tipps vom CarCare Center |
| components/ArticleLayout.tsx:99 | CarCare Leipzig | CarCare Center Leipzig |
| components/FAQSection.tsx:54 | Häufige Fragen zu CarCare Leipzig. | Häufige Fragen zum CarCare Center Leipzig. |
| components/HeroSection.tsx:184 | Dafür steht CarCare Leipzig | Dafür steht das CarCare Center Leipzig |
| components/Jobs.tsx:63 | Karriere bei CarCare | Karriere im CarCare Center |
| pages/AccidentRepairPage.tsx:168 | So läuft die Unfallinstandsetzung bei CarCare. | So läuft die Unfallinstandsetzung bei uns. |
| pages/AutoglasPage.tsx:43 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/AutolackierungPage.tsx:44 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/DellenentfernungPage.tsx:44 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/FelgenreparaturPage.tsx:45 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/FuhrparkservicePage.tsx:42 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/HagelschadenreparaturPage.tsx:43 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/SmartRepairPage.tsx:42 | eyebrow: Warum CarCare Leipzig | Warum CarCare Center Leipzig |
| pages/BusinessCustomersPage.tsx:201 | Wie die Zusammenarbeit mit CarCare aussieht. | Wie die Zusammenarbeit mit uns aussieht. |
| pages/BusinessCustomersPage.tsx:237 | So startet die Zusammenarbeit mit CarCare. | So startet die Zusammenarbeit mit uns. |
| pages/CareerPage.tsx:36 | Karriere bei CarCare Leipzig | Karriere beim CarCare Center Leipzig |
| pages/CareerPage.tsx:44 | Jobbereiche bei CarCare. | Jobbereiche bei uns. |
| pages/CareerPage.tsx:56 | So läuft der Kontakt zu CarCare. | So läuft der Kontakt zu uns. |
| pages/ContactPage.tsx:16 | Kontakt zu CarCare Leipzig | Kontakt zum CarCare Center Leipzig |
| pages/PrivatkundenPage.tsx:172 | Warum Privatkunden zu CarCare kommen. | Warum Privatkunden zu uns kommen. |
| pages/ServicesPage.tsx:53 | Alle Leistungen von CarCare Leipzig im Überblick. | Alle Leistungen vom CarCare Center Leipzig im Überblick. |
| pages/VehicleDetailingPage.tsx:168 | So läuft Ihre Autoaufbereitung bei CarCare. | So läuft Ihre Autoaufbereitung bei uns. |
| data/knowledgeArticles.ts:38 | … \| CarCare Wissen | … \| CarCare Center Wissen |
| data/knowledgeArticles.ts:110 | … \| CarCare Wissen | … \| CarCare Center Wissen |
| data/knowledgeArticles.ts:182 | … \| CarCare Wissen | … \| CarCare Center Wissen |
| data/knowledgeArticles.ts:254 | … \| CarCare Wissen | … \| CarCare Center Wissen |
| data/knowledgeArticles.ts:326 | … \| CarCare Wissen | … \| CarCare Center Wissen |

**Zu den fünf `metaTitle`:** +7 Zeichen, die Titel stehen dann bei 69–83 Zeichen.
Sie reißen die 50–60-Vorgabe **schon heute** (62–76). Das ist der Meta-Längen-Punkt
im Optimierungsplan, nicht Teil dieses Pakets — ich weise nur darauf hin, dass
dieses Paket ihn geringfügig verschärft.

---

## Teil 2 — Fall B: Umformulierung in die erste Person Plural (57 Stellen)

Der Firmenname ist Subjekt. Verbform, Possessivpronomen und Satzbau ziehen mit.

### Fließtext und Sektionen

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| index.html:29 | … in Leipzig? **CarCare kümmert sich.** | … in Leipzig? **Wir kümmern uns.** |
| components/AccidentFocus.tsx:38 | Ein Unfallschaden ist ärgerlich genug. **CarCare unterstützt Sie** von der ersten Schadenaufnahme über die Kalkulation bis zur fachgerechten Reparatur. Auf Wunsch stimmen wir uns … ab | Ein Unfallschaden ist ärgerlich genug. **Wir unterstützen Sie** von der ersten Schadenaufnahme über die Kalkulation bis zur fachgerechten Reparatur. (Folgesatz steht bereits in 1. Person, bleibt.) |
| components/ArticleLayout.tsx:105 | … wünschen, **unterstützt CarCare Leipzig** bei Autoaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und Smart Repair. | … wünschen, **unterstützen wir Sie** bei Autoaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und Smart Repair. |
| components/AutoDetailingExpertiseSection.tsx:136 | **CarCare bereitet** Fahrzeuge … **auf und erklärt** transparent … worauf **Kunden** … achten sollten | **Wir bereiten** Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung auf **und erklären** transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf **Sie** bei Lack, Innenraum und Leasingrückgabe achten sollten. |
| components/ContactCTA.tsx:22 | … **CarCare Leipzig meldet sich** persönlich zurück. | … **Wir melden uns** persönlich zurück. |
| components/HeroSection.tsx:139 | … in Leipzig? **CarCare kümmert sich.** | … in Leipzig? **Wir kümmern uns.** |
| components/ServiceGrid.tsx:44 | … Unfallinstandsetzung: **CarCare Leipzig bietet** Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand. | … Unfallinstandsetzung: **Wir bieten** Pflege, Werterhalt, Reparatur und Schadenabwicklung aus einer Hand. |
| components/TargetGroupCards.tsx:242 | … nach einem Unfall: **CarCare verbindet** persönliche Beratung mit professionellen Werkstattprozessen. | … nach einem Unfall: **Wir verbinden** persönliche Beratung mit professionellen Werkstattprozessen. |
| pages/BusinessCustomersPage.tsx:219 | Leipziger Autohäuser und Werke, für die **CarCare** Aufbereitung, Instandsetzung und Lackarbeiten **übernimmt**. | Leipziger Autohäuser und Werke, für die **wir** Aufbereitung, Instandsetzung und Lackarbeiten **übernehmen**. |
| pages/BusinessCustomersPage.tsx:226 | Mit diesen {n} Versicherern **wickelt CarCare** Schadenfälle **ab** — … | Mit diesen {n} Versicherern **wickeln wir** Schadenfälle **ab** — … |
| pages/FelgenreparaturPage.tsx:39 | **Das CarCare-Center Leipzig ist** einer der zertifizierten Wheel-Doctor-Fachbetriebe und **kennt** alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien – denn nicht in jedem Fall ist eine Felgenreparatur erlaubt. | **Wir sind** einer der zertifizierten Wheel-Doctor-Fachbetriebe und **kennen** alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien – denn nicht in jedem Fall ist eine Felgenreparatur erlaubt. ⚠️ zugleich Bindestrich-Verstoß |
| pages/KnowledgeHubPage.tsx:65 | … können Sie **CarCare** direkt mit Fahrzeugdaten **kontaktieren**. | … können Sie **uns** direkt mit Fahrzeugdaten **kontaktieren**. |

### FAQ-Antworten (Seite + Spiegelung in `seo/pageSchemas.ts`)

Jede Zeile ist **zweimal** zu ändern, wortgleich — sonst zeichnet das Schema
Inhalte aus, die auf der Seite nicht stehen.

| Seite:Zeile | Schema:Zeile | aktuell | Zielsatz |
|---|---|---|---|
| components/FAQSection.tsx:11 | pageSchemas.ts:25 | … melden. **CarCare unterstützt** bei Schadenaufnahme, Kalkulation und Reparatur. | … melden. **Wir unterstützen Sie** bei Schadenaufnahme, Kalkulation und Reparatur. |
| components/FAQSection.tsx:17 | pageSchemas.ts:26 | Auf Wunsch **begleitet CarCare** die Abstimmung mit Gutachtern und Versicherern und **hält** Sie … auf dem Laufenden. | Auf Wunsch **begleiten wir** die Abstimmung mit Gutachtern und Versicherern und **halten** Sie während der Reparatur persönlich auf dem Laufenden. |
| AccidentRepairPage.tsx:96 | pageSchemas.ts:34 | Ja. Auf Wunsch **übernimmt CarCare** die Kommunikation … und **stimmt sich** … **ab**. | Ja. Auf Wunsch **übernehmen wir** die Kommunikation mit Ihrer Versicherung sowie den Schriftverkehr rund um den Schadenfall und **stimmen uns** bei Bedarf mit dem Gutachter **ab**. |
| AccidentRepairPage.tsx:121 | pageSchemas.ts:39 | Ja. **CarCare ist** ein markenunabhängiger Meisterbetrieb … und **bearbeitet** alle Marken … | Ja. **Wir sind** ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und **bearbeiten** alle Marken – vom Kleinwagen bis zum Premiumfahrzeug. |
| BusinessCustomersPage.tsx:87 | pageSchemas.ts:68 | Ja. **CarCare strukturiert** wiederkehrende Prozesse … | Ja. **Wir strukturieren** wiederkehrende Prozesse für Autohäuser, Fuhrparks, Versicherungen und Agenturen — mit festem Ansprechpartner, vereinbarter Frequenz und definierten Kommunikationswegen. |
| BusinessCustomersPage.tsx:92 | pageSchemas.ts:69 | Ja. Versicherer und Schadensteuerer gehören zu den **Geschäftskunden von CarCare.** Wir übernehmen … | Ja. Versicherer und Schadensteuerer gehören zu **unseren Geschäftskunden.** Wir übernehmen Schadenaufnahme, Kalkulation über das anerkannte System Audatex und die Instandsetzung aus einer Hand — inklusive Schriftverkehr und Abstimmung mit dem Gutachter. |
| BusinessCustomersPage.tsx:97 | pageSchemas.ts:70 | Zu den Betrieben, **für die CarCare arbeitet**, zählen … Im Schadenbereich **wickelt CarCare** Fälle mit über 30 Versicherern **ab**, … | Zu den Betrieben, **für die wir arbeiten**, zählen unter anderem Volkswagen Automobile Leipzig, das Audi Zentrum Leipzig, das Porsche Zentrum Leipzig, das Porsche Werk Leipzig und das Autohaus Otto Grimm. Im Schadenbereich **wickeln wir** Fälle mit über 30 Versicherern **ab**, darunter HUK Coburg, Gothaer, VHV, Generali, R+V und Signal Iduna. |
| BusinessCustomersPage.tsx:112 | pageSchemas.ts:73 | Ja. **CarCare arbeitet** als Glasurit-Lackpartner farbtongenau … | Ja. **Wir arbeiten** als Glasurit-Lackpartner farbtongenau und mit sorgfältigem Umgang bei hochwertigen Fahrzeugen und sensiblen Oberflächen. |
| CareerPage.tsx:27 | pageSchemas.ts:125 | **CarCare sucht** unter anderem Kfz-Aufbereiter, … | **Wir suchen** unter anderem Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater. |
| CareerPage.tsx:28 | pageSchemas.ts:126 | Am einfachsten über die Kontaktseite oder telefonisch. **CarCare meldet sich** anschließend persönlich zurück. | Am einfachsten über die Kontaktseite oder telefonisch. **Wir melden uns** anschließend persönlich zurück. |
| PrivatkundenPage.tsx:112 | pageSchemas.ts:56 | … festen Ansprechpartner. **CarCare ist** markenunabhängig, **arbeitet** als Glasurit-Lackpartner farbtongenau und **empfiehlt** grundsätzlich die kleinere Reparaturlösung … | … festen Ansprechpartner. **Wir sind** markenunabhängig, **arbeiten** als Glasurit-Lackpartner farbtongenau und **empfehlen** grundsätzlich die kleinere Reparaturlösung, wo sie fachlich ausreicht. |
| PrivatkundenPage.tsx:132 | pageSchemas.ts:60 | Nein. Auf Wunsch **übernimmt CarCare** die komplette Abwicklung: … | Nein. Auf Wunsch **übernehmen wir** die komplette Abwicklung: Kostenvoranschlag, Abstimmung mit Versicherern und Gutachtern sowie die Kommunikation während der Reparatur. Bei einem Hagelschaden rechnen wir direkt mit der Versicherung ab, eine Anzahlung ist nicht nötig. |
| ServicesPage.tsx:16 | pageSchemas.ts:17 | **CarCare bündelt** Fahrzeugaufbereitung, … | **Wir bündeln** Fahrzeugaufbereitung, Leasingrückgabe-Vorbereitung, Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas mit Scheibenfolierung sowie Fuhrpark- und Geschäftskundenservice — alles an einem Standort in Leipzig. |
| ServicesPage.tsx:28 | pageSchemas.ts:19 | … Komplettlackierung. **CarCare berät** vor Ort oder telefonisch und **empfiehlt** den passenden Ablauf. | … Komplettlackierung. **Wir beraten** vor Ort oder telefonisch und **empfehlen** den passenden Ablauf. |
| ServicesPage.tsx:34 | pageSchemas.ts:20 | Ja. Auf Wunsch **übernimmt CarCare** die Abstimmung mit Versicherern, … | Ja. Auf Wunsch **übernehmen wir** die Abstimmung mit Versicherern, Agenturen und Gutachtern — von der Schadenaufnahme über die Kalkulation bis zur Freigabe. |
| VehicleDetailingPage.tsx:35 | pageSchemas.ts:44 | … Versiegelung. **CarCare stimmt** den Ablauf nach der Anfrage persönlich **ab und nennt** Ihnen dabei den Zeitrahmen … | … Versiegelung. **Wir stimmen** den Ablauf nach der Anfrage persönlich **ab und nennen** Ihnen dabei den Zeitrahmen für Ihr Fahrzeug. |
| VehicleDetailingPage.tsx:70 | pageSchemas.ts:51 | Ja. **CarCare arbeitet** für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards. | Ja. **Wir arbeiten** für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards. |
| — | pageSchemas.ts:132 | Ja. **CarCare Leipzig unterstützt** bei Fahrzeugaufbereitung, Lackpflege, … | Ja. **Wir unterstützen Sie** bei Fahrzeugaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und ausgewählten Smart-Repair-Themen. |

### Karten-, CTA- und Sektionsbeschreibungen

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| pages/AccidentRepairPage.tsx:62 | Auf Wunsch **übernimmt CarCare** Schriftverkehr und Abstimmung mit Versicherern und Agenturen. | Auf Wunsch **übernehmen wir** Schriftverkehr und Abstimmung mit Versicherern und Agenturen. |
| pages/AccidentRepairPage.tsx:158 | **CarCare bündelt** technische Reparatur, persönliche Betreuung und strukturierte Abstimmung in einem Prozess. | **Wir bündeln** technische Reparatur, persönliche Betreuung und strukturierte Abstimmung in einem Prozess. |
| pages/AccidentRepairPage.tsx:191 | Senden Sie die wichtigsten Informationen direkt **an CarCare** oder rufen Sie an, … | Senden Sie die wichtigsten Informationen direkt **an uns** oder rufen Sie an, wenn es schnell gehen muss. |
| pages/AutoglasPage.tsx:53 | Melden Sie sich **bei CarCare** – wir prüfen, … | Melden Sie sich **bei uns** – wir prüfen, ob eine Steinschlagreparatur reicht oder die Scheibe getauscht wird, und stellen ein Ersatzfahrzeug bereit. |
| pages/BusinessCustomersPage.tsx:213 | Namensnennung als Referenz – **CarCare ist** ein markenunabhängiger freier Meisterbetrieb und keine autorisierte Vertragswerkstatt der genannten Hersteller. | Namensnennung als Referenz – **wir sind** ein markenunabhängiger freier Meisterbetrieb und keine autorisierte Vertragswerkstatt der genannten Hersteller. |
| pages/BusinessCustomersPage.tsx:251 | Sprechen Sie **mit CarCare** über feste Ansprechpartner, … | Sprechen Sie **mit uns** über feste Ansprechpartner, wiederkehrende Abläufe und passende Prozesse. |
| pages/CareerPage.tsx:20 | **CarCare prüft** den passenden Bereich und **meldet sich** persönlich. | **Wir prüfen** den passenden Bereich und **melden uns** persönlich. |
| pages/CareerPage.tsx:37 | Dein Job **bei CarCare**: Fahrzeuge, Qualität und ein starkes Team. | Dein Job **bei uns**: Fahrzeuge, Qualität und ein starkes Team. |
| pages/CareerPage.tsx:66 | … melde dich direkt. **CarCare prüft** gemeinsam mit dir den passenden Bereich. | … melde dich direkt. **Wir prüfen** gemeinsam mit dir den passenden Bereich. |
| pages/ContactPage.tsx:17 | … Geschäftskundenanfrage senden. **CarCare meldet sich** persönlich zurück. | … Geschäftskundenanfrage senden. **Wir melden uns** persönlich zurück. |
| pages/FuhrparkservicePage.tsx:52 | Sprechen Sie **mit CarCare Leipzig** über die Betreuung Ihrer Fahrzeuge – … | Sprechen Sie **mit uns** über die Betreuung Ihrer Fahrzeuge – von der regelmäßigen Pflege bis zur Schadenabwicklung. |
| pages/KnowledgeHubPage.tsx:18 | **Der Wissensbereich von CarCare erklärt** fachlich und praxisnah, … | **In unserem Wissensbereich erklären wir** fachlich und praxisnah, wann professionelle Fahrzeugaufbereitung sinnvoll ist, wie typische Arbeiten ablaufen und wo Smart Repair oder Leasingrückgabe-Vorbereitung helfen können. |
| pages/NotFoundPage.tsx:14 | **CarCare Leipzig hilft** bei Schadenmeldung, Aufbereitungstermin oder Geschäftskundenanfrage. | **Wir helfen Ihnen** bei Schadenmeldung, Aufbereitungstermin oder Geschäftskundenanfrage. |
| pages/ServicesPage.tsx:88 | **CarCare Leipzig berät** persönlich und **findet** den passenden Weg … | **Wir beraten** persönlich und **finden** den passenden Weg für Aufbereitung, Reparatur oder Schadenabwicklung. |
| pages/VehicleDetailingPage.tsx:195 | **CarCare arbeitet** neutral, professionell und mit dem Anspruch, Fahrzeugzustand und Wert sichtbar zu verbessern. | **Wir arbeiten** neutral, professionell und mit dem Anspruch, Fahrzeugzustand und Wert sichtbar zu verbessern. |
| pages/VehicleDetailingPage.tsx:210 | Fragen Sie Ihren Aufbereitungstermin in Leipzig an. **CarCare empfiehlt** die passende Leistung für Zustand und Ziel. | Fragen Sie Ihren Aufbereitungstermin in Leipzig an. **Wir empfehlen** die passende Leistung für Zustand und Ziel. |
| data/detailing.ts:142 | Innen, außen, Lack und Details **nach CarCare-Standard**. | Innen, außen, Lack und Details **nach unserem Standard**. |
| components/DetailingProcessSection.tsx:50 | Innen, außen, Lack und Details **nach CarCare-Standard**. | Innen, außen, Lack und Details **nach unserem Standard**. (Dublette zu `data/detailing.ts:142`) |

### Meta-Descriptions mit dritter Person (Name darf bleiben, Verb nicht)

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| pages/BusinessCustomersPage.tsx:138 | **CarCare Leipzig für** Autohäuser, Fuhrparks, … | **CarCare Center Leipzig für** Autohäuser, Fuhrparks, Versicherungen und Schadensteuerer: … (nominal, kein Verb — bleibt) |
| pages/CareerPage.tsx:33 | Karriere bei **CarCare Leipzig**: Jobs für … | Karriere beim **CarCare Center Leipzig**: Jobs für … (nominal) |
| pages/KnowledgeHubPage.tsx:13 | Autoaufbereitung Wissen **von CarCare**: verständliche Ratgeber … | Autoaufbereitung Wissen **vom CarCare Center**: verständliche Ratgeber … (nominal) |
| pages/PrivatkundenPage.tsx:157 | Ihre Vorteile als Privatkunde **bei CarCare Leipzig**: … | Ihre Vorteile als Privatkunde **im CarCare Center Leipzig**: … (nominal) |
| pages/ServicesPage.tsx:49 | Alle Leistungen **von CarCare Leipzig** im Überblick: … | Alle Leistungen **vom CarCare Center Leipzig** im Überblick: … (nominal) |
| data/knowledgeArticles.ts:40 | … Fehler Sie vermeiden sollten. Fachlicher Ratgeber **von CarCare**. | … Fehler Sie vermeiden sollten. Fachlicher Ratgeber **vom CarCare Center**. (nominal) |
| seo/pageSchemas.ts:206–209 | „… **bei CarCare Leipzig** für …" (4 × `jobPostingSchema`) | „… **beim CarCare Center Leipzig** für …" (nominal, JSON-LD → Name bleibt) |

---

## Teil 3 — Fall C: FAQ-Fragen (20 Stellen, Entscheidung 1 abwarten)

Zielsatz jeweils nach **Variante 1a**. Jede ist doppelt zu ändern (Seite + Schema).

| Seite:Zeile | Schema:Zeile | aktuell → Zielsatz (1a) |
|---|---|---|
| FAQSection.tsx:9 | pageSchemas.ts:25 | Kann ich bei **CarCare** einen Unfallschaden in Leipzig melden? → bei **CarCare Center** |
| FAQSection.tsx:15 | pageSchemas.ts:26 | Unterstützt **CarCare** bei der Abstimmung …? → Unterstützt **das CarCare Center** … |
| FAQSection.tsx:27 | pageSchemas.ts:28 | Arbeitet **CarCare** auch für Autohäuser …? → Arbeitet **das CarCare Center** … |
| AccidentRepairPage.tsx:90 | pageSchemas.ts:33 | Wie melde ich einen Unfallschaden bei **CarCare Leipzig**? → **CarCare Center Leipzig** |
| AccidentRepairPage.tsx:95 | pageSchemas.ts:34 | Übernimmt **CarCare** die Abstimmung …? → Übernimmt **das CarCare Center** … |
| AccidentRepairPage.tsx:120 | pageSchemas.ts:39 | Repariert **CarCare** auch mein Fahrzeugfabrikat? → Repariert **das CarCare Center** … |
| AutoglasPage.tsx:19 | pageSchemas.ts:118 | Welche Autoglas-Leistungen bietet **CarCare**? → bietet **das CarCare Center**? |
| BusinessCustomersPage.tsx:91 | pageSchemas.ts:69 | Arbeitet **CarCare** mit Versicherungen …? → Arbeitet **das CarCare Center** … |
| BusinessCustomersPage.tsx:96 | pageSchemas.ts:70 | Für welche Unternehmen arbeitet **CarCare** bereits? → arbeitet **das CarCare Center** bereits? |
| BusinessCustomersPage.tsx:111 | pageSchemas.ts:73 | Hat **CarCare** Erfahrung mit Premiumfahrzeugen? → Hat **das CarCare Center** … |
| FuhrparkservicePage.tsx:14 | pageSchemas.ts:113 | Arbeitet **CarCare** mit Partnern aus der Branche zusammen? → Arbeitet **das CarCare Center** … |
| PrivatkundenPage.tsx:111 | pageSchemas.ts:56 | Was habe ich als Privatkunde von **CarCare** gegenüber …? → von **CarCare Center** … |
| PrivatkundenPage.tsx:126 | pageSchemas.ts:59 | Arbeitet **CarCare** an allen Fahrzeugmarken? → Arbeitet **das CarCare Center** … |
| PrivatkundenPage.tsx:141 | pageSchemas.ts:62 | Kann **CarCare** mein Auto auf die Leasingrückgabe vorbereiten? → Kann **das CarCare Center** … |
| ServicesPage.tsx:14 | pageSchemas.ts:17 | Welche Leistungen bietet **CarCare** in Leipzig an? → bietet **das CarCare Center** … |
| ServicesPage.tsx:32 | pageSchemas.ts:20 | Übernimmt **CarCare** die Abwicklung mit der Versicherung? → Übernimmt **das CarCare Center** … |
| VehicleDetailingPage.tsx:39 | pageSchemas.ts:45 | Was kostet eine Autoaufbereitung bei **CarCare Leipzig**? → **CarCare Center Leipzig** |
| VehicleDetailingPage.tsx:54 | pageSchemas.ts:48 | Hilft **CarCare** bei der Leasingrückgabe? → Hilft **das CarCare Center** … |
| — | pageSchemas.ts:132 | Kann **CarCare** die beschriebenen Leistungen in Leipzig umsetzen? → Kann **das CarCare Center** … |

---

## Teil 4 — Alt-Texte (10 Stellen, Entscheidung 3 abwarten)

Zielsatz jeweils nach **Variante 3a**.

| Datei:Zeile | aktuell | Zielsatz (3a) |
|---|---|---|
| AccidentDamageSection.tsx:28 | … Online-Schadenformular **von CarCare Leipzig** – … | … Online-Schadenformular **des CarCare Center Leipzig** – … |
| AccidentDamageSection.tsx:38 | **CarCare-Mitarbeiter** nimmt … auf | **Unser Mitarbeiter** nimmt … auf |
| AccidentDamageSection.tsx:47 | … während der **CarCare-Berater** die Kalkulation … erläutert. | … während **unser Berater** die Kalkulation auf dem Tablet erläutert. |
| AccidentDamageSection.tsx:56 | **CarCare-Mitarbeiterin** klärt am Telefon … | **Unsere Mitarbeiterin** klärt am Telefon … |
| AccidentDamageSection.tsx:65 | **CarCare-Mitarbeiter** übergibt … den Schlüssel … | **Unser Mitarbeiter** übergibt … den Schlüssel … |
| DetailingProcessSection.tsx:29 | Fahrzeugaufbereitung **bei CarCare Leipzig**: … | Fahrzeugaufbereitung **im CarCare Center Leipzig**: … |
| DetailingProcessSection.tsx:37 | … am Empfangstresen **von CarCare Leipzig** … | … am Empfangstresen **des CarCare Center Leipzig** … |
| DetailingProcessSection.tsx:45 | … vor der Werkstatt **von CarCare Leipzig** … | … vor der Werkstatt **des CarCare Center Leipzig** … |
| DetailingProcessSection.tsx:52 | … in der **CarCare-Werkstatt** in Leipzig. | … in **unserer Werkstatt** in Leipzig. |
| DetailingProcessSection.tsx:59 | … nach der Aufbereitung **bei CarCare Leipzig**. | … nach der Aufbereitung **im CarCare Center Leipzig**. |

---

## Teil 5 — Spiegelungen, die zwingend gemeinsam geändert werden

`seo/pageSchemas.ts` hält wortgleiche Kopien der sichtbaren FAQ-Texte. Betroffen
sind **31 Paare**. Läuft eines auseinander, zeichnet `FAQPage` aus, was nicht auf
der Seite steht — der 🔴-Punkt aus dem Optimierungsplan.

**Absicherung bei der Umsetzung:** dasselbe Paritätsskript wie in Phase 2, erweitert
auf alle Paare; läuft vor dem Commit und bricht bei jeder Abweichung ab.

---

## Umfang

| Teil | Stellen |
|---|---|
| 0 — unangetastet | 15 |
| 1 — Fall A, Namensergänzung | 28 |
| 2 — Fall B, Umformulierung | 57 |
| 3 — Fall C, FAQ-Fragen | 20 (× 2 durch Spiegelung) |
| 4 — Alt-Texte | 10 |
| Titles aus Entscheidung 2 | 9 |
| **Summe bearbeitet** | **149** |

Nach Freigabe: Umsetzung per Skript mit Eindeutigkeitsprüfung je Ersetzung,
danach `tsc --noEmit`, Build mit Prerender, Paritätsprüfung Schema ↔ Seite,
Kontrollsuche auf verbliebene Treffer, eigener Commit.
