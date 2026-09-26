# Schleife 4 – Backlog

Quelle: Feedbackliste von André Bosse, `car-Care-Center_Website_Feedback Schleife 4.xlsx`
(OneDrive, Kunden/CarCare-Center; angelegt 2026-09-09, Stand 2026-09-10), ein Blatt „Änderungen Website",
21 Punkte. Werte unverändert als CSV: `docs/backlog/quelle/2026-09-10-schleife-4.csv`.

> **Die Nummern sind original.** Anders als bei Schleife 2 und 3 trägt diese Liste eine eigene Spalte
> „Nr." (1–21). 4.1–4.21 entsprechen genau diesen Nummern — keine Rekonstruktion, keine Umsortierung.

**Aufgabentext und Anmerkungen sind unverändert aus der Quelle übernommen** (Spalten „Mangel / gewünschte
Änderung" und „Anmerkung / offene Frage"). Ergänzungen von uns stehen kursiv in „Stand im Projekt".

**Stand 2026-09-16:** **18 von 21** Punkten umgesetzt — Sofortpaket (2026-09-11), Flächenentscheidung 4.2 mit 4.18 (2026-09-14) und die Kundenentscheidungen vom 2026-09-16 (4.3, 4.4, 4.7, 4.8, 4.9, 4.10, 4.13, 4.21). **Offen:** 4.1 (Retusche), 4.14 (ganzer Film), 4.19 (Jahr für Meilenstein 3).

**Stand 2026-09-25 (Schleife 5):** 4.19 beantwortet (2017 → 5.24); 4.4, 4.7 und 4.8 abgenommen. 4.1 hat der User
gestrichen, 4.14 ist durch die Bereichsvideos erledigt. **Schleife 4 ist damit abgeschlossen**; 4.19 wird mit 5.24 umgesetzt.

**Priorität laut Kunde:** 1–3, die Richtung steht nicht in der Liste. Wahrscheinlich ist **1 = hoch**: Die
kurzen Textkorrekturen tragen fast alle 1, die aufwendigen Punkte (Bildretusche, Video, Preisentscheidung)
tragen 3. *Beim Kunden bestätigen.* **Status laut Kunde:** alle 21 `offen`.

---

## Startseite (4.1)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.1 | Startbildschirm, Porsche-Bilder | Beim blauen Porsche müssen die Felgen bildbearbeitet werden – Verschmutzungen bzw. Kalkflecken/Kalkränder entfernen. | — | 3 | ✅ **entfällt** (Entscheidung des Users, 2026-09-25) | *2026-09-25 (Schleife 5): Im Meeting angesprochen und nicht umgesetzt, weil eine KI-Retusche das ganze Bild verändern kann. Danach vom User gestrichen.* *Das Startmotiv mit den zwei Porsche Taycan (`components/HeroSection.tsx`), zwei Dateien: `hero-leipzig-carcare-desktop.webp` und `-mobile.webp`. Retusche an der Quelldatei, danach beide Fassungen neu erzeugen (`npm run images`). Kann mit der laufenden Fotosichtung zusammen erledigt werden.* |

## Fahrzeugaufbereitung – Texte und Pakete (4.2 – 4.9)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.2 | Reiter "Fahrzeug" – Überschrift | Quadratmeterzahl in "Professionelle Fahrzeugaufbereitung in Leipzig" auf über 3.500 m² anpassen. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-14 vom User entschieden: **überall 3.500 m².** Gemessen nach der Umstellung: **33 Fundstellen in 20 Dateien** unter `components/`, `pages/`, `data/`, `seo/` — sichtbarer Text, FAQ und strukturierte Daten — dazu **Textregel 4 in `CLAUDE.md`** und die USP-Bausteine in `SEO-GEO-STANDARDS.md`. Alle zugleich, nie einzeln. ⚠️ **Falle:** `pages/DatenschutzPage.tsx` nennt „rund 23.000 Zeichen" — eine Textlänge, keine Fläche; ein globales Ersetzen hätte genau dort danebengegriffen. Nur „3.000 m²" und „3.000 Quadratmeter" treffen. `npm run meta` danach: 0 Descriptions außerhalb 140–160 (die Zahl ist zeichengleich, das musste aber gemessen werden). **Entsperrt 4.18.*** |
| 4.3 | Reiter "Fahrzeug" – Leistungsaufzählung | Statt "Innenraum, Außenpflege, Lackreinigung" neu: "Innenraum und Außenpflege, Politur, Versiegelung, Geruchsentfernung". | Offen: entfällt "Lackreinigung" komplett oder geht sie in "Politur/Versiegelung" auf? | 2 | ✅ **umgesetzt** | *✅ 2026-09-16: Wortlaut des Kunden im Hero von `/fahrzeugaufbereitung-leipzig`. **„Lackreinigung" entfällt insgesamt** (Entscheidung): gemessen 17 Stellen in 9 Dateien → 0 — Paket, Schema, Außenseite (beide Listen, Meta, FAQ), Startseitenkarte, Leistungskatalog, Service-Schema, Stellenkarte, Bereichs-Teaser. **Bewusst nicht:** die vier Nennungen in den Wissensartikeln — sie erklären das Handwerk allgemein, ohne Angebot. Zur Abnahme zeigen.* *Vorher:* *Einleitungstext `/fahrzeugaufbereitung-leipzig` (`pages/VehicleDetailingPage.tsx`). Die Rückfrage stellt der Kunde selbst. Zu beachten: „Lackreinigung" steht heute auch im Paketinhalt der Brillant-Außenpflege (`data/detailing.ts`) — entfällt sie, ist dort mitzuändern.* |
| 4.4 | Sektion "Was kostet eine Autoaufbereitung in Leipzig" | Swissvax / Premiumpflege exklusiv nicht mehr mit Festpreis, sondern "Preis nach Absprache" (je nach Aufwand). | — | 2 | ✅ **umgesetzt** · abgenommen 2026-09-25 (Swissvax) | *✅ 2026-09-16 gemeinsam mit 4.10: **„Preis nach Absprache"** an allen Stellen (gemessen 6 Nennungen von 348 in 3 Dateien → 0), im Schema ohne Preisfelder. Marke **Swissvax**: 9 Stellen „SWIZÖL" ersetzt — Swizöl ist der frühere DACH-Name derselben Marke (swissvax.de); die FAQ nennt ihn einmal, damit die Seite unter dem alten Namen auffindbar bleibt.* *Vorher:* *Heute „ab 348,00 €" — in `data/detailing.ts` (Karte und `Offer`-Schema), im Einleitungstext der Preissektion und in zwei FAQ-Antworten (`data/faqs.ts`). **Alle Stellen gemeinsam ändern**, sonst widerspricht das Schema dem sichtbaren Text (SEO-Standard 5: nur Sichtbares auszeichnen). Die Seite schreibt die Wachsmarke „SWIZÖL", der Kunde „Swissvax" — Schreibweise festlegen. Deckt sich mit 4.10.* |
| 4.5 | Paket "Brilliant Außenpflege" | "Schonende Oberwäsche inkl. Abledern" ändern in "Schonende Handoberwäsche". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Paketinhalt, Leistungskarte (Titel „Schonende Handoberwäsche"), FAQ, Leistungskatalog und Service-Schema — sichtbarer Text und strukturierte Daten gleich.* *Vorher: Drei Fundstellen: Paketinhalt (`data/detailing.ts`), Leistungskarte auf `/aussenaufbereitung-leipzig` („Schonende Oberwäsche inklusive Abledern") und FAQ „Was gehört zur Außenaufbereitung?". Schreibweise: Kunde „Brilliant", Seite „Brillant" — siehe 4.21.* |
| 4.6 | Programm "Intensiv Innenraumreinigung" | Polstershampoonierung und Teppichreinigung ergänzen. "Oberwäsche inkl. Abledern" ändern in "Schonende Oberwäsche". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: „Schonende Oberwäsche" und Teppichreinigung im Paket, im `Offer`-Schema, in der FAQ, auf der Innenaufbereitungsseite (Karte „Innenraum komplett"), im Leistungskatalog und im Service-Schema. „alternativ Lederpflege" bleibt — Stoff wird shampooniert, Leder gepflegt, die Teppiche gelten für beide.* *Vorher: `data/detailing.ts`: Polstershampoonierung steht schon drin, aber als „Polstershampoonierung – alternativ Lederpflege". Neu ist die Teppichreinigung. Beim Umsetzen klären: bleibt „alternativ Lederpflege"?* |
| 4.7 | Preisgestaltung allgemein | Aufpreise klären: Geländewagen/Großraumlimousinen +20%, Transporter +50%. Entweder als Fußnote bei den Paketen ausweisen oder Preise entfernen und auf "Preis nach Absprache" umstellen. | Entscheidung noch offen (Fußnote vs. Preis nach Absprache) | 3 | ✅ **umgesetzt (Fußnote)** · abgenommen 2026-09-25; alle Preise mit „ab" → 5.32 | *✅ 2026-09-16: Fußnote an den drei Festpreis-Paketen (Sternchen, für Vorlesegeräte angesagt). Der Satz kommt aus EINER Quelle (`AUFPREIS_SATZ`, `data/detailing.ts`) und steht auch in fünf FAQ-Antworten, bei den Preisangaben der Innen- und Außenseite und in den Schema-Offers. Preise ohne „ab" auf „ab" gezogen, wo der Aufpreis sie sonst falsch machte.* *Vorher:* *Grundsatzentscheidung mit Folgen für die Auffindbarkeit: Die Seite wirbt mit festen Preisen in H1 („… mit festen Paketpreisen"), Meta-Description, FAQ und `Offer`-Schema. **Unsere Empfehlung: Fußnote.** Sie hält die konkreten Preise, die KI-Antworten und Suchende zitieren (SEO-Standard 4.3 „Preisrahmen statt Floskeln", 4.2 „transparente Preisinfos"); „Preis nach Absprache" nimmt sie. Verwandt: 3.35.* |
| 4.8 | Struktur "Innen/Außen/Lack im Überblick" | Inhaltliche Doppelung zwischen "Außenaufbereitung" und "Lackaufbereitung" – Abgrenzung der Leistungsinhalte überarbeiten. | — | 2 | ✅ **umgesetzt mit 4.3**, abgenommen 2026-09-25 | *2026-09-25 (Schleife 5): Abgrenzung bestätigt (außen = Wäsche und Vorbereitung, Lack geht tiefer). Die Außenaufbereitung bekommt ein eigenes Foto (5.36).* *✅ 2026-09-16: Mit dem Wegfall der Lackreinigung trennen sich die Bereiche: **außen = reinigen** (Vorreinigung, Felgen, Insekten, Handoberwäsche, Scheiben), **Lack = Politur, Versiegelung, Wachs**. Die Außen-FAQ sagt, dass Politur und Versiegelung im Paketpreis enthalten sind; die Lackaufbereitung steht als eigene Karte „nach Aufwand" (4.9). Im Review bestätigen lassen.* *Vorher:* *Sektion „Aufbereitungsumfang" auf `/fahrzeugaufbereitung-leipzig` (`detailingScopes`). Die Abgrenzung ist eine fachliche Aussage — braucht vom Kunden, was zu welchem Bereich gehört. Hängt mit 4.3 (Lackreinigung) und 4.9 zusammen.* |
| 4.9 | Preisdarstellung Lackaufbereitung | Lackaufbereitung bereits bei den Paketen vorne mit ausweisen, z. B. "Preis nach Aufwand" oder nach Stundenverrechnungssatz. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-16: Karte **„Lackaufbereitung — Preis nach Aufwand"** über volle Breite bei den Paketen, ausdrücklich ohne Stundensatz (Kunde). Auch im Schema (ohne Preis) und in der Formularauswahl.* *Vorher:* *Wortlaut offen: „Preis nach Aufwand" oder ein Stundensatz. Der Stundensatz wäre die konkretere, zitierbare Angabe — dafür fehlt der Betrag.* |

## Seitenweit (4.10 – 4.11)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.10 | Alle Inhalte | Bezeichnung "Premium-Exklusiv" nicht mehr mit dem Preis von 48 € verknüpfen/nennen – überall anpassen. | — | 1 | ✅ **umgesetzt mit 4.4** | *✅ 2026-09-16: gemeinsam mit 4.4 — „48 €" war „ab 348,00 €" (vom Kunden bestätigt).* *Vorher:* *„48 €" kommt im Code nicht vor (gezählt: 0). Gemeint ist sehr wahrscheinlich **„ab 348,00 €"** der Premiumpflege „exklusiv". Damit derselbe Punkt wie 4.4 — gemeinsam umsetzen.* |
| 4.11 | Allgemein / Impressum | Bezeichnung ändern/ergänzen: "Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11 an allen 14 Stellen, dazu Impressum (als Betriebsbezeichnung beschriftet, nicht als § 5-Pflichtangabe) und der USP-Baustein in `SEO-GEO-STANDARDS.md`. **Wo „seit 1998" an der Bezeichnung hing, steht jetzt „seit 1998 am Markt"** — der ursprüngliche USP-Baustein des Kunden. Wörtlich ersetzt hätte die Seite den Karosseriebau-Meister seit 1998 behauptet, den es laut 4.18 so nicht gibt (R13). Das Hero-Abzeichen nennt die Gewerke ohne Jahr; 1998 steht in der Subline direkt darüber.* *Vorher: Heute steht „Meisterbetrieb des Kfz-Lackierhandwerks" an **12 Stellen** (Über uns, Privatkunden, USP-Karten, strukturierte Daten). **Beantwortet R5 teilweise** (Impressum: Berufsbezeichnung). ⚠️ Siehe **R13** unten: seit wann gilt die Meisterqualifikation?* |

## Geschäftskunden (4.12)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.12 | Bereich "Versicherungsagenturen" | "Instandsetzen statt Tauschen" korrekt zusammenschreiben: "Instandsetzung statt Tauschen". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11 an allen 6 Stellen (`/geschaeftskunden` Kartentitel + Text, `/ueber-uns` zweimal, Zielgruppenkarte, Kommentar).* *Vorher: „Instand setzen statt tauschen" (getrennt) — Kartentitel auf `/geschaeftskunden` plus weitere Stellen auf `/ueber-uns` und in den Zielgruppenkarten, **6 Fundstellen**. Einheitlich an allen umsetzen, nicht nur im genannten Bereich.* |

## Über uns (4.13 – 4.20)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.13 | "Woran sich die Arbeitsqualität festmachen lässt" | Ergänzung um Autotex/DAT-Kalkulationen sowie "Mitglied im BVAT" (Bundesverband Autoreparatur-Technik). | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-16: Karte **„Audatex- und DAT-Kalkulation"** auf `/ueber-uns` — „Autotex" ist Audatex, ein Kalkulationssystem namens Autotex gibt es nicht (marktüblich: Audatex, DAT, GT Motive). **BVAT** als offizielles Siegel unter den Qualifikationen, verlinkt, mit dem am Verbandsimpressum geprüften Namen **„Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V."**. ⚠️ Die Langform aus dieser Liste war falsch — und die hier bis 2026-09-16 notierte Korrektur mit „für" ebenso. Siehe 3.12.* |
| 4.14 | Drohnenvideo | Aktuell nur Teilausschnitt eingebunden – der Schwenk durch die Karosserieabteilung fehlt. Vollständiges Video ergänzen. | ganzes Video ist zu Groß für einzelner Upload, Überlegung einzelne Bereiche nochmals separat mit Video zu Beleuchten | 3 | ✅ **erledigt** durch die Bereichsvideos (2026-09-25) | *2026-09-25 (Schleife 5): Im Meeting wurden die drei Bereichsvideos gezeigt (R18), André hat sie angesehen. Laut User decken sie den Wunsch ab.* *Folgepunkt zu 3.21 (dort eingebaut: Ausschnitt 21,5–52,2 s). **Idee, die zwei offene Punkte zugleich löst:** den ganzen Film als Klick-Video mit Steuerung zeigen — lädt erst beim Klick, lässt sich anhalten. Das erfüllt nebenbei das offene WCAG 2.2.2 (Anhalten automatisch laufender Videos). Die drei Ausschnitte (zusammen rund 73 s) wiegen ausgeliefert 8,9 MiB.* |
| 4.15 | Sektion "Entwicklung" – Überschrift | Überschrift ändern in "Von der Fahrzeugaufbereitung zum Full-Service-Betrieb" (nicht "von der Lackiererei..."). | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11.* *Vorher: `pages/UeberUnsPage.tsx`: „Von der Lackiererei zum Full-Service-Betrieb." Reine Textänderung.* |
| 4.16 | Sektion "Entwicklung" – 1998 | 1998: Gründung in Leipzig, Start als Kfz-Aufbereitungsbetrieb und Anbieter/Dienstleister für Premiumhersteller in Leipzig und im gesamten Bundesgebiet – von Anfang an fachliche Grundlage. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 1998 im Wortlaut des Kunden. Sie ersetzt „Start als Betrieb des Kfz-Lackierhandwerks. Der Meisterbrief ist von Anfang an die fachliche Grundlage." — den Meisterbrief hat der Kunde bei 1998 selbst gestrichen (stützt R13). **Beantwortet R1** zusammen mit 4.17–4.20.* |
| 4.17 | Sektion "Entwicklung" – Meilenstein 1 (2000) | Erweiterung um das Geschäftsfeld Spot- und Smart-Repair. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 2000, Titel „Spot- und Smart-Repair". Beantwortet R1 (Jahr + Satz).* |
| 4.18 | Sektion "Entwicklung" – Meilenstein 2 (2013) | Umzug in ein neues Objekt auf über 3.500 m² Fläche mit modernster Ausstattung. Erweiterung des gesamten Dienstleistungsportfolios um Komplettreparatur, Neuteillackierung und gesamte Karosserieinstandsetzung sowie Schaffung komplett neuer Arbeitsbereiche. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-14: Station 2013 im Wortlaut des Kunden. Sie war **ausschließlich** durch die Flächenfrage blockiert — ihr Text nennt 3.500 m², die Seite sagte 3.000. Mit der Entscheidung zu 4.2 ist der Widerspruch weg. `istPlatzhalter` entfernt und der Eintrag aus der `ANERKANNT`-Liste von `scripts/check-dummies.mjs` genommen, sonst hätte der Wächter den Build gebrochen. Der Zeitstrahl trägt damit **5 von 6** Stationen; offen bleibt nur **4.19** (Jahr fehlt). Beantwortet **R1** bis auf dieses Jahr.* |
| 4.19 | Sektion "Entwicklung" – Meilenstein 3 | Beginn/Ausweitung der Zusammenarbeit im Schadens- und Versicherungsbereich durch großflächige Partnerschaften mit der Versicherungswirtschaft; Ausbildungsbetrieb im Lackierhandwerk und Karosseriebauhandwerk. | — | 1 | ✅ **beantwortet** (2026-09-25) | *2026-09-25 (Schleife 5): Jahr 2017, Titel „Eintritt in die Schadensteuerung", dazu eine kurze Erklärung. André hat das Jahr geschätzt (2016/2017), bitte bestätigen lassen. Umsetzung 5.24.* *Beantwortet R1 — **aber ohne Jahreszahl.** Die fehlt noch; eine geratene Zahl sähe aus wie eine geprüfte. „Ausbildungsbetrieb im Lackier- und Karosseriebauhandwerk" **beantwortet 3.32 teilweise**.* |
| 4.20 | Sektion "Entwicklung" – Meilenstein 4 (2026) | Vollständige Digitalisierung aller Geschäftsprozesse. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 2026 „Vollständig digital" vor „Heute" eingefügt; „Heute" bleibt. Mit sechs Stationen wurden die Karten zu schmal und ragten gemessen bis 230px aus dem Zeitstrahl — die Komponente ist dafür umgebaut (Höhe aus dem Inhalt, waagerecht ab 1280px), siehe `docs/backlog/tasks/2026-09-11-schleife-4-sofortpaket-tasks.md`.* *Vorher: Beantwortet R1. Der Zeitstrahl hatte fünf Stationen (1998, drei Platzhalter, „Heute"); mit vier Meilensteinen werden es sechs, oder 2026 ersetzt „Heute". Beim Umsetzen entscheiden. Passt zu 1.16 (volldigitale Abwicklung, Data Motive).* |

## Formular (4.21)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.21 | Formular "Aufbereitungstermin anfragen" | Programmbezeichnungen ans einheitliche Wording anpassen: "Innenaufbereitung" → "Intensiv Innenraumreinigung", "Außenaufbereitung" → "Brilliant Außenpflege", "Komplettaufbereitung" → "Premiumpflege". Konsistent auf der gesamten Seite durchziehen. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-16: Schreibweise **Brillant** (Entscheidung; „Brilliant" kam im Code nie vor). Formularauswahl mit den Programmnamen: Intensiv Innenraumreinigung · Brillant Außenpflege · Premiumpflege · **neu** Premiumpflege „exklusiv" · Lackaufbereitung; `id`s unverändert, die Mail liest dieselbe Liste. Paketname **„Intensiv Innenraumreinigung"** überall (13 Stellen in 5 Dateien, vorher „Intensiv Innenreinigung"). **Seiten und Navigation behalten „Innen-/Außenaufbereitung"** — sie tragen die Suchbegriffe.* *Vorher:* *Formularauswahl in `data/leistungsauswahl.ts`. **Beantwortet 1.18/2.26 teilweise:** Die Auswahl „Gewünschte Leistung" sind künftig die Pakete — genau die offene Frage „was ist Paket, was Zusatz". ⚠️ **„Auf der gesamten Seite" vorher abgrenzen:** `/innenaufbereitung-leipzig` und `/aussenaufbereitung-leipzig` sind Leistungsbereiche (1.8/1.9) und tragen die Suchbegriffe „Innenaufbereitung/Außenaufbereitung Leipzig". Ein Paket ist nicht dasselbe wie der Bereich. **Vorschlag:** Paketnamen überall, wo Pakete gemeint sind (Formular, Preise, FAQ); Bereichsnamen für Seiten und Navigation bleiben. Schreibweise „Brilliant" (Liste) vs. „Brillant" (Seite) festlegen.* |

---

## Was Schleife 4 an offenen Punkten beantwortet

| Offener Punkt | Antwort aus | Was danach noch fehlt |
|---|---|---|
| **R1** Meilensteine Zeitstrahl | 4.16–4.20 | nur das **Jahr für Meilenstein 3** (4.19). *Stand 2026-09-14: 5 von 6 Stationen stehen, 2013 ist mit 4.2 entsperrt worden.* |
| **3.32** / **R4** Ausbildung | 4.19: „Ausbildungsbetrieb im Lackierhandwerk und Karosseriebauhandwerk" | Werden im kommenden Jahrgang Plätze besetzt? Bleibt **Industriekaufmann/-frau** auf `/karriere` (in 4.19 nicht genannt)? Eckdaten je Beruf (R4) |
| **R5** Impressum | 4.11: Berufsbezeichnung | Handwerkskammer, Verleihungsstaat, berufsrechtliche Regelung, Telefonnummer, Verbraucherstreitbeilegung |
| **3.12** BVAT | 4.13: Mitgliedschaft + Langform | ✅ erledigt 2026-09-16 — offizieller Name am Verbandsimpressum geprüft („Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V.", ohne „für"), offizielles Siegel eingebaut |
| **1.18** / **2.26** Paket vs. Zusatz | 4.21: Formularauswahl = Pakete | die Zusatzleistungsliste selbst |
| **3.35** Preise Zusatzleistungen | Richtung aus 4.4, 4.7, 4.9 | ✅ entschieden 2026-09-16: bepreist, sonst „Preis nach Absprache" — Umsetzung mit 2.26/2.11 (später) |
| **3.21** Drohnenvideo | 4.14: Karosserie-Schwenk fehlt | — (Folgepunkt, 3.21 bleibt erledigt) |

## Rückfragen an André (gebündelt)

1. ~~**4.2 / 4.18** — 3.500 m² **überall** statt 3.000 m²?~~ ✅ **Am 2026-09-14 vom User bejaht und umgesetzt** (33 Fundstellen in 20 Dateien, Textregel 4 mitgezogen).
2. ~~**R13** — Seit wann ist der Betrieb Meisterbetrieb?~~ ✅ **Erledigt 2026-09-16:** 2013 ist ein Meilenstein, nicht der Beginn des Meisterbetriebs — „seit 1998" bleibt.
3. ~~**4.13** — BVAT-Langform, „Autotex" = Audatex?~~ ✅ **2026-09-16:** offizielles Logo und offizielle Bezeichnung gewünscht — am Verbandsimpressum geprüft: „Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V." (**ohne** „für"; die hier zuvor genannte Fassung war falsch). Autotex als Audatex gelesen (ein System dieses Namens gibt es nicht).
4. ~~**4.19** — Jahr für Meilenstein 3~~ ✅ **2017** (Meeting 2026-09-25) → 5.24
5. ~~**4.7** — Fußnote oder „Preis nach Absprache"?~~ ✅ **Fußnote** (2026-09-16).
6. ~~**4.3 / 4.8** — Lackreinigung?~~ ✅ **Entfällt insgesamt** (2026-09-16); die Abgrenzung außen/Lack ergibt sich daraus — im Review bestätigen.
7. ~~**4.9** — „Preis nach Aufwand" oder Stundensatz?~~ ✅ **Preis nach Aufwand**, keine Stundensätze (2026-09-16).
8. ~~**4.10** — „48 €" = „ab 348,00 €"?~~ ✅ **Ja**, gemeinsam mit 4.4 umgesetzt (2026-09-16).
9. ~~**4.21** — Pakete oder auch Seiten? „Brilliant" oder „Brillant"? „Swissvax" oder „SWIZÖL"?~~ ✅ **Brillant** (2026-09-16); Seiten- und Navigationsnamen bleiben (Vorschlag, im Review bestätigen). **Swissvax** ist der heutige Name der Marke, Swizöl der frühere — umgesetzt.
10. **Priorität** — ist 1 die höchste?

## Repo-Befund aus dem Import

| Nr. | Befund | Status |
|---|---|---|
| **R13** | **„Meisterbetrieb seit 1998" passt nicht zur Chronik des Kunden?** Die Seite sagt an 11 Stellen „Meisterbetrieb seit 1998"; die Chronik nennt 1998 die Aufbereitung und 2013 Lackierung/Karosserie. | ✅ **erledigt 2026-09-16** — Entscheidung des Users: 4.18 beschreibt einen **Meilenstein** (Umzug, Erweiterung), nicht den Beginn der Meisterqualifikation. „Seit 1998" bleibt an allen Stellen. |

## Vorschlag zur Umsetzung

| Paket | Punkte | Voraussetzung |
|---|---|---|
| ~~**Sofort** — reine Textkorrekturen mit eindeutigem Wortlaut~~ | 4.5, 4.6 (Teppichreinigung, Oberwäsche), 4.11, 4.12, 4.15, 4.16, 4.17, 4.20 | ✅ **umgesetzt 2026-09-11**, Branch `2026-09-10-schleife-4-sofortpaket` |
| ~~**Nach Antwort** — Flächenfrage~~ | ~~4.2 + 4.18~~ | ✅ **entschieden und umgesetzt 2026-09-14**, Branch `2026-09-14-karten-ablauf-flaeche` |
| ~~**Nach Antwort** — Entscheidung oder Rückfrage nötig~~ | ~~4.3, 4.4 + 4.10, 4.7, 4.8, 4.9, 4.13, 4.21~~ | ✅ **entschieden und umgesetzt 2026-09-16**, Branch `2026-09-16-preise-partner-schadenlink` |
| ~~**Noch offen** — Rückfrage~~ | ~~4.19 (Jahr für Meilenstein 3)~~ | ✅ beantwortet 2026-09-25 (2017), Umsetzung 5.24 |
| ~~**Bild und Video**~~ | ~~4.1 (Retusche), 4.14 (ganzer Film als Klick-Video, zugleich WCAG 2.2.2)~~ | ✅ 2026-09-25: 4.1 gestrichen, 4.14 durch die Bereichsvideos erledigt |

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-1.md` · `docs/backlog/schleife-2.md` ·
`docs/backlog/schleife-3.md` · `docs/backlog/offene-punkte-konsolidiert.md`
Import: `docs/backlog/tasks/2026-09-10-schleife-4-import-tasks.md`
