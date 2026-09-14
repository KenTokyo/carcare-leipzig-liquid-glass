# Schleife 4 – Backlog

Quelle: Feedbackliste von André Bosse, `car-Care-Center_Website_Feedback Schleife 4.xlsx`
(OneDrive, Kunden/CarCare-Center; angelegt 2026-09-09, Stand 2026-09-10), ein Blatt „Änderungen Website",
21 Punkte. Werte unverändert als CSV: `docs/backlog/quelle/2026-09-10-schleife-4.csv`.

> **Die Nummern sind original.** Anders als bei Schleife 2 und 3 trägt diese Liste eine eigene Spalte
> „Nr." (1–21). 4.1–4.21 entsprechen genau diesen Nummern — keine Rekonstruktion, keine Umsortierung.

**Aufgabentext und Anmerkungen sind unverändert aus der Quelle übernommen** (Spalten „Mangel / gewünschte
Änderung" und „Anmerkung / offene Frage"). Ergänzungen von uns stehen kursiv in „Stand im Projekt".

**Priorität laut Kunde:** 1–3, die Richtung steht nicht in der Liste. Wahrscheinlich ist **1 = hoch**: Die
kurzen Textkorrekturen tragen fast alle 1, die aufwendigen Punkte (Bildretusche, Video, Preisentscheidung)
tragen 3. *Beim Kunden bestätigen.* **Status laut Kunde:** alle 21 `offen`.

---

## Startseite (4.1)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.1 | Startbildschirm, Porsche-Bilder | Beim blauen Porsche müssen die Felgen bildbearbeitet werden – Verschmutzungen bzw. Kalkflecken/Kalkränder entfernen. | — | 3 | offen | *Das Startmotiv mit den zwei Porsche Taycan (`components/HeroSection.tsx`), zwei Dateien: `hero-leipzig-carcare-desktop.webp` und `-mobile.webp`. Retusche an der Quelldatei, danach beide Fassungen neu erzeugen (`npm run images`). Kann mit der laufenden Fotosichtung zusammen erledigt werden.* |

## Fahrzeugaufbereitung – Texte und Pakete (4.2 – 4.9)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.2 | Reiter "Fahrzeug" – Überschrift | Quadratmeterzahl in "Professionelle Fahrzeugaufbereitung in Leipzig" auf über 3.500 m² anpassen. | — | 1 | offen | *Steht im Einleitungstext unter der H1 von `/fahrzeugaufbereitung-leipzig` („… ausgeführt im Meisterbetrieb auf über 3.000 m²"). ⚠️ **Widerspricht Textregel 4 in `CLAUDE.md` („über 3.000 m²") und dem abgenommenen 1.2** („überall auf über 3.000 m² vereinheitlichen"). 4.18 nennt 3.500 m² ebenfalls — es ist also eine neue Angabe, kein Tippfehler. Gezählt: **30 Fundstellen in 20 Dateien** (Leistungskarten, Meta-Texte, FAQ, strukturierte Daten). Nur hier zu ändern, erzeugte einen Widerspruch auf der eigenen Seite. **Rückfrage: überall auf 3.500 m²?** Dann Textregel 4 und `SEO-GEO-STANDARDS.md` (USP-Bausteine) mitziehen.* |
| 4.3 | Reiter "Fahrzeug" – Leistungsaufzählung | Statt "Innenraum, Außenpflege, Lackreinigung" neu: "Innenraum und Außenpflege, Politur, Versiegelung, Geruchsentfernung". | Offen: entfällt "Lackreinigung" komplett oder geht sie in "Politur/Versiegelung" auf? | 2 | offen | *Einleitungstext `/fahrzeugaufbereitung-leipzig` (`pages/VehicleDetailingPage.tsx`). Die Rückfrage stellt der Kunde selbst. Zu beachten: „Lackreinigung" steht heute auch im Paketinhalt der Brillant-Außenpflege (`data/detailing.ts`) — entfällt sie, ist dort mitzuändern.* |
| 4.4 | Sektion "Was kostet eine Autoaufbereitung in Leipzig" | Swissvax / Premiumpflege exklusiv nicht mehr mit Festpreis, sondern "Preis nach Absprache" (je nach Aufwand). | — | 2 | offen | *Heute „ab 348,00 €" — in `data/detailing.ts` (Karte und `Offer`-Schema), im Einleitungstext der Preissektion und in zwei FAQ-Antworten (`data/faqs.ts`). **Alle Stellen gemeinsam ändern**, sonst widerspricht das Schema dem sichtbaren Text (SEO-Standard 5: nur Sichtbares auszeichnen). Die Seite schreibt die Wachsmarke „SWIZÖL", der Kunde „Swissvax" — Schreibweise festlegen. Deckt sich mit 4.10.* |
| 4.5 | Paket "Brilliant Außenpflege" | "Schonende Oberwäsche inkl. Abledern" ändern in "Schonende Handoberwäsche". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Paketinhalt, Leistungskarte (Titel „Schonende Handoberwäsche"), FAQ, Leistungskatalog und Service-Schema — sichtbarer Text und strukturierte Daten gleich.* *Vorher: Drei Fundstellen: Paketinhalt (`data/detailing.ts`), Leistungskarte auf `/aussenaufbereitung-leipzig` („Schonende Oberwäsche inklusive Abledern") und FAQ „Was gehört zur Außenaufbereitung?". Schreibweise: Kunde „Brilliant", Seite „Brillant" — siehe 4.21.* |
| 4.6 | Programm "Intensiv Innenraumreinigung" | Polstershampoonierung und Teppichreinigung ergänzen. "Oberwäsche inkl. Abledern" ändern in "Schonende Oberwäsche". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: „Schonende Oberwäsche" und Teppichreinigung im Paket, im `Offer`-Schema, in der FAQ, auf der Innenaufbereitungsseite (Karte „Innenraum komplett"), im Leistungskatalog und im Service-Schema. „alternativ Lederpflege" bleibt — Stoff wird shampooniert, Leder gepflegt, die Teppiche gelten für beide.* *Vorher: `data/detailing.ts`: Polstershampoonierung steht schon drin, aber als „Polstershampoonierung – alternativ Lederpflege". Neu ist die Teppichreinigung. Beim Umsetzen klären: bleibt „alternativ Lederpflege"?* |
| 4.7 | Preisgestaltung allgemein | Aufpreise klären: Geländewagen/Großraumlimousinen +20%, Transporter +50%. Entweder als Fußnote bei den Paketen ausweisen oder Preise entfernen und auf "Preis nach Absprache" umstellen. | Entscheidung noch offen (Fußnote vs. Preis nach Absprache) | 3 | offen | *Grundsatzentscheidung mit Folgen für die Auffindbarkeit: Die Seite wirbt mit festen Preisen in H1 („… mit festen Paketpreisen"), Meta-Description, FAQ und `Offer`-Schema. **Unsere Empfehlung: Fußnote.** Sie hält die konkreten Preise, die KI-Antworten und Suchende zitieren (SEO-Standard 4.3 „Preisrahmen statt Floskeln", 4.2 „transparente Preisinfos"); „Preis nach Absprache" nimmt sie. Verwandt: 3.35.* |
| 4.8 | Struktur "Innen/Außen/Lack im Überblick" | Inhaltliche Doppelung zwischen "Außenaufbereitung" und "Lackaufbereitung" – Abgrenzung der Leistungsinhalte überarbeiten. | — | 2 | offen | *Sektion „Aufbereitungsumfang" auf `/fahrzeugaufbereitung-leipzig` (`detailingScopes`). Die Abgrenzung ist eine fachliche Aussage — braucht vom Kunden, was zu welchem Bereich gehört. Hängt mit 4.3 (Lackreinigung) und 4.9 zusammen.* |
| 4.9 | Preisdarstellung Lackaufbereitung | Lackaufbereitung bereits bei den Paketen vorne mit ausweisen, z. B. "Preis nach Aufwand" oder nach Stundenverrechnungssatz. | — | 1 | offen | *Wortlaut offen: „Preis nach Aufwand" oder ein Stundensatz. Der Stundensatz wäre die konkretere, zitierbare Angabe — dafür fehlt der Betrag.* |

## Seitenweit (4.10 – 4.11)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.10 | Alle Inhalte | Bezeichnung "Premium-Exklusiv" nicht mehr mit dem Preis von 48 € verknüpfen/nennen – überall anpassen. | — | 1 | offen | *„48 €" kommt im Code nicht vor (gezählt: 0). Gemeint ist sehr wahrscheinlich **„ab 348,00 €"** der Premiumpflege „exklusiv". Damit derselbe Punkt wie 4.4 — gemeinsam umsetzen.* |
| 4.11 | Allgemein / Impressum | Bezeichnung ändern/ergänzen: "Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11 an allen 14 Stellen, dazu Impressum (als Betriebsbezeichnung beschriftet, nicht als § 5-Pflichtangabe) und der USP-Baustein in `SEO-GEO-STANDARDS.md`. **Wo „seit 1998" an der Bezeichnung hing, steht jetzt „seit 1998 am Markt"** — der ursprüngliche USP-Baustein des Kunden. Wörtlich ersetzt hätte die Seite den Karosseriebau-Meister seit 1998 behauptet, den es laut 4.18 so nicht gibt (R13). Das Hero-Abzeichen nennt die Gewerke ohne Jahr; 1998 steht in der Subline direkt darüber.* *Vorher: Heute steht „Meisterbetrieb des Kfz-Lackierhandwerks" an **12 Stellen** (Über uns, Privatkunden, USP-Karten, strukturierte Daten). **Beantwortet R5 teilweise** (Impressum: Berufsbezeichnung). ⚠️ Siehe **R13** unten: seit wann gilt die Meisterqualifikation?* |

## Geschäftskunden (4.12)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.12 | Bereich "Versicherungsagenturen" | "Instandsetzen statt Tauschen" korrekt zusammenschreiben: "Instandsetzung statt Tauschen". | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11 an allen 6 Stellen (`/geschaeftskunden` Kartentitel + Text, `/ueber-uns` zweimal, Zielgruppenkarte, Kommentar).* *Vorher: „Instand setzen statt tauschen" (getrennt) — Kartentitel auf `/geschaeftskunden` plus weitere Stellen auf `/ueber-uns` und in den Zielgruppenkarten, **6 Fundstellen**. Einheitlich an allen umsetzen, nicht nur im genannten Bereich.* |

## Über uns (4.13 – 4.20)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.13 | "Woran sich die Arbeitsqualität festmachen lässt" | Ergänzung um Autotex/DAT-Kalkulationen sowie "Mitglied im BVAT" (Bundesverband Autoreparatur-Technik). | — | 1 | offen | *Sektion auf `/ueber-uns`; dort steht bereits eine Karte „Audatex-Kalkulation" — „Autotex" ist vermutlich Audatex, neu wäre DAT. ⚠️ **Die Langform stimmt nicht:** BVAT ist laut Verbandsseite der **„Bundesverband für Ausbeultechnik und Hagelinstandsetzung e.V."** (bvat.de, geprüft 2026-09-10) — ein Verband der Ausbeul- und Hageltechnik, passend zu 3.12. **Nicht mit der Langform aus der Liste veröffentlichen.** Beantwortet 3.12 teilweise.* |
| 4.14 | Drohnenvideo | Aktuell nur Teilausschnitt eingebunden – der Schwenk durch die Karosserieabteilung fehlt. Vollständiges Video ergänzen. | ganzes Video ist zu Groß für einzelner Upload, Überlegung einzelne Bereiche nochmals separat mit Video zu Beleuchten | 3 | offen | *Folgepunkt zu 3.21 (dort eingebaut: Ausschnitt 21,5–52,2 s). **Idee, die zwei offene Punkte zugleich löst:** den ganzen Film als Klick-Video mit Steuerung zeigen — lädt erst beim Klick, lässt sich anhalten. Das erfüllt nebenbei das offene WCAG 2.2.2 (Anhalten automatisch laufender Videos). Die drei Ausschnitte (zusammen rund 73 s) wiegen ausgeliefert 8,9 MiB.* |
| 4.15 | Sektion "Entwicklung" – Überschrift | Überschrift ändern in "Von der Fahrzeugaufbereitung zum Full-Service-Betrieb" (nicht "von der Lackiererei..."). | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11.* *Vorher: `pages/UeberUnsPage.tsx`: „Von der Lackiererei zum Full-Service-Betrieb." Reine Textänderung.* |
| 4.16 | Sektion "Entwicklung" – 1998 | 1998: Gründung in Leipzig, Start als Kfz-Aufbereitungsbetrieb und Anbieter/Dienstleister für Premiumhersteller in Leipzig und im gesamten Bundesgebiet – von Anfang an fachliche Grundlage. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 1998 im Wortlaut des Kunden. Sie ersetzt „Start als Betrieb des Kfz-Lackierhandwerks. Der Meisterbrief ist von Anfang an die fachliche Grundlage." — den Meisterbrief hat der Kunde bei 1998 selbst gestrichen (stützt R13). **Beantwortet R1** zusammen mit 4.17–4.20.* |
| 4.17 | Sektion "Entwicklung" – Meilenstein 1 (2000) | Erweiterung um das Geschäftsfeld Spot- und Smart-Repair. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 2000, Titel „Spot- und Smart-Repair". Beantwortet R1 (Jahr + Satz).* |
| 4.18 | Sektion "Entwicklung" – Meilenstein 2 (2013) | Umzug in ein neues Objekt auf über 3.500 m² Fläche mit modernster Ausstattung. Erweiterung des gesamten Dienstleistungsportfolios um Komplettreparatur, Neuteillackierung und gesamte Karosserieinstandsetzung sowie Schaffung komplett neuer Arbeitsbereiche. | — | 1 | offen | *Beantwortet R1. Nennt 3.500 m² — mit 4.2 zusammen entscheiden, sonst steht im Zeitstrahl eine andere Fläche als im Rest der Seite.* |
| 4.19 | Sektion "Entwicklung" – Meilenstein 3 | Beginn/Ausweitung der Zusammenarbeit im Schadens- und Versicherungsbereich durch großflächige Partnerschaften mit der Versicherungswirtschaft; Ausbildungsbetrieb im Lackierhandwerk und Karosseriebauhandwerk. | — | 1 | offen | *Beantwortet R1 — **aber ohne Jahreszahl.** Die fehlt noch; eine geratene Zahl sähe aus wie eine geprüfte. „Ausbildungsbetrieb im Lackier- und Karosseriebauhandwerk" **beantwortet 3.32 teilweise**.* |
| 4.20 | Sektion "Entwicklung" – Meilenstein 4 (2026) | Vollständige Digitalisierung aller Geschäftsprozesse. | — | 1 | ✅ **umgesetzt** | *✅ 2026-09-11: Station 2026 „Vollständig digital" vor „Heute" eingefügt; „Heute" bleibt. Mit sechs Stationen wurden die Karten zu schmal und ragten gemessen bis 230px aus dem Zeitstrahl — die Komponente ist dafür umgebaut (Höhe aus dem Inhalt, waagerecht ab 1280px), siehe `docs/backlog/tasks/2026-09-11-schleife-4-sofortpaket-tasks.md`.* *Vorher: Beantwortet R1. Der Zeitstrahl hatte fünf Stationen (1998, drei Platzhalter, „Heute"); mit vier Meilensteinen werden es sechs, oder 2026 ersetzt „Heute". Beim Umsetzen entscheiden. Passt zu 1.16 (volldigitale Abwicklung, Data Motive).* |

## Formular (4.21)

| Nr. | Bereich / Seite | Aufgabe | Anmerkung Kunde | Prio | Status | Stand im Projekt |
|---|---|---|---|---|---|---|
| 4.21 | Formular "Aufbereitungstermin anfragen" | Programmbezeichnungen ans einheitliche Wording anpassen: "Innenaufbereitung" → "Intensiv Innenraumreinigung", "Außenaufbereitung" → "Brilliant Außenpflege", "Komplettaufbereitung" → "Premiumpflege". Konsistent auf der gesamten Seite durchziehen. | — | 1 | offen | *Formularauswahl in `data/leistungsauswahl.ts`. **Beantwortet 1.18/2.26 teilweise:** Die Auswahl „Gewünschte Leistung" sind künftig die Pakete — genau die offene Frage „was ist Paket, was Zusatz". ⚠️ **„Auf der gesamten Seite" vorher abgrenzen:** `/innenaufbereitung-leipzig` und `/aussenaufbereitung-leipzig` sind Leistungsbereiche (1.8/1.9) und tragen die Suchbegriffe „Innenaufbereitung/Außenaufbereitung Leipzig". Ein Paket ist nicht dasselbe wie der Bereich. **Vorschlag:** Paketnamen überall, wo Pakete gemeint sind (Formular, Preise, FAQ); Bereichsnamen für Seiten und Navigation bleiben. Schreibweise „Brilliant" (Liste) vs. „Brillant" (Seite) festlegen.* |

---

## Was Schleife 4 an offenen Punkten beantwortet

| Offener Punkt | Antwort aus | Was danach noch fehlt |
|---|---|---|
| **R1** Meilensteine Zeitstrahl | 4.16–4.20 | nur das **Jahr für Meilenstein 3** (4.19) |
| **3.32** / **R4** Ausbildung | 4.19: „Ausbildungsbetrieb im Lackierhandwerk und Karosseriebauhandwerk" | Werden im kommenden Jahrgang Plätze besetzt? Bleibt **Industriekaufmann/-frau** auf `/karriere` (in 4.19 nicht genannt)? Eckdaten je Beruf (R4) |
| **R5** Impressum | 4.11: Berufsbezeichnung | Handwerkskammer, Verleihungsstaat, berufsrechtliche Regelung, Telefonnummer, Verbraucherstreitbeilegung |
| **3.12** BVAT | 4.13: Mitgliedschaft + Langform | Langform aus der Liste ist falsch → offizielle Form bestätigen lassen; Logodatei + Freigabe |
| **1.18** / **2.26** Paket vs. Zusatz | 4.21: Formularauswahl = Pakete | die Zusatzleistungsliste selbst |
| **3.35** Preise Zusatzleistungen | Richtung aus 4.4, 4.7, 4.9: variable Leistungen „nach Absprache/Aufwand" | Entscheidung für die Zusatzleistungen selbst |
| **3.21** Drohnenvideo | 4.14: Karosserie-Schwenk fehlt | — (Folgepunkt, 3.21 bleibt erledigt) |

## Rückfragen an André (gebündelt)

1. **4.2 / 4.18** — 3.500 m² **überall** statt 3.000 m²? (30 Fundstellen, verbindliche Textregel)
2. **R13** — Seit wann ist der Betrieb Meisterbetrieb? (siehe unten)
3. **4.13** — BVAT-Langform: die offizielle lautet „Bundesverband für Ausbeultechnik und Hagelinstandsetzung e.V." — ist dieser Verband gemeint? Und „Autotex" = Audatex?
4. **4.19** — Jahr für Meilenstein 3
5. **4.7** — Aufpreise als Fußnote oder „Preis nach Absprache"? (Empfehlung: Fußnote)
6. **4.3 / 4.8** — Lackreinigung: entfällt sie oder geht sie in Politur/Versiegelung auf? Wie grenzen sich Außen- und Lackaufbereitung ab?
7. **4.9** — „Preis nach Aufwand" oder Stundensatz (dann: welcher Betrag)?
8. **4.10** — ist „48 €" = „ab 348,00 €"?
9. **4.21** — Umbenennung nur für Pakete oder auch für die Seiten Innen-/Außenaufbereitung? „Brilliant" oder „Brillant"? Und 4.4: „Swissvax" oder „SWIZÖL"?
10. **Priorität** — ist 1 die höchste?

## Repo-Befund aus dem Import

| Nr. | Befund | Status |
|---|---|---|
| **R13** | **„Meisterbetrieb seit 1998" passt nicht zur Chronik des Kunden.** Die Seite sagt an **12 Stellen** „Meisterbetrieb seit 1998" bzw. „Seit 1998 sind wir Meisterbetrieb des Kfz-Lackierhandwerks" (USP-Karten auf sieben Leistungsseiten, Über uns, Privatkunden, strukturierte Daten). Laut 4.16 begann der Betrieb 1998 als **Aufbereitungsbetrieb**; Neuteillackierung und Karosserieinstandsetzung kamen laut 4.18 erst **2013** dazu. Wurde die Meisterqualifikation im Lackier-/Karosseriebauhandwerk später erworben, ist „seit 1998" eine Aussage, die so nicht stimmt. **Nichts entfernt** — Frage an André: Seit wann ist der Betrieb Meisterbetrieb? „Seit 1998" als **Gründungsjahr** (Textregel 3) bleibt davon unberührt. **Stand 2026-09-11 (nach 4.11):** Wo die Bezeichnung stand, hängt 1998 jetzt am Betrieb („seit 1998 am Markt"). Offen sind noch **11 Stellen**: die Kartentitel „Meisterbetrieb seit 1998" auf sieben Leistungsseiten, die Startseiten-Subline, die Meta-Descriptions von Startseite und `/ueber-uns` sowie die Kennzahlkarte „Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998" auf `/ueber-uns`. Zusätzliches Indiz: André hat bei der Station 1998 den Satz „Der Meisterbrief ist von Anfang an die fachliche Grundlage" selbst gestrichen (4.16). | offen (André) |

## Vorschlag zur Umsetzung

| Paket | Punkte | Voraussetzung |
|---|---|---|
| ~~**Sofort** — reine Textkorrekturen mit eindeutigem Wortlaut~~ | 4.5, 4.6 (Teppichreinigung, Oberwäsche), 4.11, 4.12, 4.15, 4.16, 4.17, 4.20 | ✅ **umgesetzt 2026-09-11**, Branch `2026-09-10-schleife-4-sofortpaket` |
| **Nach Antwort** — Entscheidung oder Rückfrage nötig | 4.2 + 4.18, 4.3, 4.4 + 4.10, 4.7, 4.8, 4.9, 4.13, 4.19, 4.21 | Rückfragen oben |
| **Bild und Video** | 4.1 (Retusche), 4.14 (ganzer Film als Klick-Video, zugleich WCAG 2.2.2) | Fotosichtung läuft |

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-1.md` · `docs/backlog/schleife-2.md` ·
`docs/backlog/schleife-3.md` · `docs/backlog/offene-punkte-konsolidiert.md`
Import: `docs/backlog/tasks/2026-09-10-schleife-4-import-tasks.md`
