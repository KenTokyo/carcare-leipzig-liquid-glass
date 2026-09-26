# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 26.09.2026, 15:22, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 26.09.2026, 15:22 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `2ba47f0` | `3daf563` | 2 vor GitHub (kommt mit dem Push) |
| `2026-09-25-schleife-5-import` | `2ba47f0` | — | neu, 2 Commit(s) noch nicht auf GitHub |
| 15 weitere lokale Branches | – | – | gleich mit GitHub |
| 1 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `28a7691` | 26.09.2026, 15:22 | oalabhypercode | Backlog: Schleife 5 aus dem Meeting mit Andre (25.09.), Querverweise in Schleife 1-4 | 12 (3 neu) | — | **kommt mit diesem Push** |
| `2ba47f0` | 26.09.2026, 15:22 | oalabhypercode | Bildliste: Vermerke aus Schleife 5, Datum in Ortszeit | 3 | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| Kontrolle | `git log --oneline -3 main`: oben „Docs: Push-Stand …", darunter `2ba47f0`, `28a7691` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | `parallax-scroll-kit/` |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 14, alle Commits schon auf GitHub: `aussparung-beschriftete-aktionen`, `claude/frosty-chaum-e06c4d`, `fix/dummy-waechter-anerkennung`, `fix/matomo-aussage`, `fix/prerender-vercel`, `nachtraege/versand-und-waechterdoku`, `optimierung/react-typen`, `paket-d/karriere-navigation`, `paket-e/formularversand`, `paket-e/vorauswahl-und-alle-anfragearten`, `paket-e/zusatzleistungen-zeitstrahl-dialog`, `paket-f/schadenformular`, `rechtsseiten/impressum-datenschutz`, `schleife-1/paket-b` |
| Weitere Worktrees | 2 |
| Stash-Einträge | 0 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

| Punkt | Planung |
|---|---|
| O1 — Livegang-Blocker sichtbar machen (🔴 kritisch) | `docs/backlog/tasks/2026-09-25-schleife-5-import-optimierung-tasks.md` |
| O4 — Sichtbare Platzhalter vor dem Livegang (🟠 hoch) | `docs/backlog/tasks/2026-09-25-schleife-5-import-optimierung-tasks.md` |
| O5 — Derselbe Ablaufschritt in zwei Quellen (🟡 mittel) | `docs/backlog/tasks/2026-09-25-schleife-5-import-optimierung-tasks.md` |

### Backlog gesamt: 69 offene Punkte

Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.

<details>
<summary>Schleife 2: 3 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 2.11 | Zusatzleistungen als optionale, wählbare Zusatzleistungen auf der Subseite aufführen (Fußnote/Hinweis) | ⏸️ später | Oalab |
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | offen | Oalab |
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizi… | offen | André |

Quelle: `docs/backlog/schleife-2.md`

</details>

<details>
<summary>Schleife 3: 5 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 3.13 | Autoglas: Angaben PKW/LKW-Neuverglasung inhaltlich prüfen | offen | Oalab / André |
| 3.16 | Partner nach Freigabe direkt verlinken („geschenkte Leads") | 🟨 teilweise | Oalab |
| 3.22 | Wissensdatenbank-Seite bleibt vorerst Platzhalter, wird komplett neu gestaltet | offen | Oalab |
| 3.31 | Freigaben Partner-Logos (Autohäuser, Versicherungen, Agenturen) für Logo-Nutzung und Verlinkung einholen | 🟨 teilweise — riparo, Porsche Zentrum Leipzig (2026-09-16)… | André |
| 3.37 | „Bildtechnisch noch was ändern" (Teil 1) – unklar, ob Bildgrößen/-formate oder Darstellung gemeint waren | Klärung | André |

Quelle: `docs/backlog/schleife-3.md`

</details>

<details>
<summary>Schleife 4: 0 offen</summary>


Quelle: `docs/backlog/schleife-4.md`

</details>

<details>
<summary>Schleife 5: 43 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 5.1 | Projekt: Livegang in der Woche ab 28.09.2026 vorbereiten. Dieses Meeting ist die letzte Abstimmung davor; KUP… | offen | OALAB |
| 5.3 | Alle Seiten: KI-Plakette dezenter gestalten. Andrés Tochter und ihre Studienkollegen finden das Label „KI-gen… | offen | OALAB |
| 5.4 | Startseite › Titelbild: Slogan statt „Unfallinstandsetzung, Karosserie und Lack in Leipzig." Die Begrüßung so… | wartet auf Vorschlag | André (Wortlaut) · OALAB (Lay… |
| 5.5 | Startseite › Titelbild: „Karosserie" nicht trennen. André stört, dass das Wort in der Überschrift „so auseina… | offen | OALAB |
| 5.6 | Alle Seiten › Smart Repair: Smart-Repair-Foto durch den weißen Porsche Macan ersetzen. André hat eine Stoßfän… | offen | OALAB |
| 5.7 | Alle Seiten › Hagelschaden: Hagelschaden-Foto durch ein echtes ersetzen. Das heutige ist mit KI aufgewertet u… | offen | OALAB |
| 5.8 | Innenaufbereitung: Bilder zum Alcantara-Lenkrad einfügen. Die Fotos hat André geschickt, sie liegen bei Ali (… | offen | OALAB |
| 5.9 | Alle Seiten: Herkunft der Bilder aus dem Meeting eintragen. Beim Durchgang hat Ali für neun Dateien die Herku… | offen | OALAB |
| 5.10 | Alle Seiten › Dellenentfernung: Dellenfoto tauschen. André gefällt das Motiv nicht: Die Delle ist nicht zu er… | offen | OALAB |
| 5.11 | Alle Seiten › Fuhrparkservice: Fuhrparkfoto ohne die generierte Person. Links im Bild wurde eine Person hinzu… | offen | OALAB |
| 5.12 | Startseite › Schadenreise, Schritt 02: Eine echte Schadenaufnahme fotografieren. André: „Ich kann auch eine s… | offen | André |
| 5.13 | Startseite › gepinnte Abläufe: „Überspringen"-Knopf für die gepinnten Abläufe. Rückmeldung aus Andrés Umfeld:… | offen | OALAB |
| 5.14 | Startseite › „Der richtige Ansprechpartner": Transporterbild auf der Startseite tauschen. Der grüne Cayenne a… | offen | OALAB |
| 5.15 | Startseite: Neues Transporterfoto: ein sauberer Transporter, im Mittelpunkt das Fahrzeug auf der Ladefläche u… | offen | André |
| 5.16 | Startseite › „Autohäuser & Fuhrparks", Geschäftskunden: Volkswagen Automobile Leipzig und Audi Zentrum Leipzi… | offen | OALAB |
| 5.17 | Startseite › „Autoaufbereitung ist mehr als Reinigung": Vierte Karte „Mehr über Aufbereitung erfahren" prüfen… | offen | OALAB |
| 5.18 | Startseite, Fahrzeugaufbereitung › Ablauf: Zwei Korrekturen in Schritt 04 „Professionelle Aufbereitung": „auß… | offen | OALAB |
| 5.19 | Anfrage-Dialog › Aufbereitungstermin: „Verkaufsaufbereitung" aus der Auswahl streichen, denn die „gibt es so… | offen | OALAB |
| 5.20 | Anfrage-Dialog › Aufbereitungstermin: Zusatzleistungen statt der Platzhalter „Zusatzleistung 1/2". Im Meeting… | 🟨 Teilliste | André (Liste) · OALAB (Einbau) |
| 5.21 | Alle Seiten › Fußzeile: Fußzeile verkleinern. Sie ist „sehr breit" und wird auf das Wesentliche reduziert. | offen | OALAB |
| 5.22 | reparatur.info: Terminvereinbarung über reparatur.info testen. Weder Ali noch André wissen, ob ein Termin ode… | offen | André · OALAB |
| 5.23 | Über uns › „Alles im eigenen Haus": Die Leistungskarten wie auf der Startseite bebildern. Die Karte „Neu- und… | offen | OALAB |
| 5.24 | Über uns › Zeitstrahl: Meilenstein 3 einsetzen: 2017 „Eintritt in die Schadensteuerung", darunter eine kurze… | offen | OALAB |
| 5.25 | Karriere › Ausbildung: Ausbildungskarte „Karosserie- und Fahrzeugbaumechaniker/in": Der Text ragt über den Ka… | offen | OALAB |
| 5.26 | Karriere › Ausbildung: Ausbildung freischalten. Karosserie- und Fahrzeugbaumechaniker/in und Fahrzeuglackiere… | offen | OALAB |
| 5.27 | Karriere › Ausbildung „Fahrzeuglackierer/in": Foto einer jungen Lackiererin (Azubi) bei der Arbeit. Die Ausbi… | offen | André |
| 5.28 | Karriere › „Aus dem Team": Mitarbeiterstimmen einsammeln. Die Frage an die Kolleginnen und Kollegen: „Was sch… | offen | André (Stimmen, Einwilligunge… |
| 5.29 | Karriere › Bewerbungsformular: Anhänge ermöglichen (Lebenslauf als PDF, Word o. Ä.). Das geht heute noch nich… | offen | OALAB |
| 5.30 | Fußzeile, Impressum: Faxnummer entfernen. „0341 - 962 74 87" ist das Fax, und das „braucht ja heute sowieso k… | offen | OALAB |
| 5.31 | Fußzeile: Neue Zeile unter dem Logo: „BS CarCare GmbH – Ihr Premium-Partner für Fahrzeugaufbereitung und Unfa… | offen | OALAB |
| 5.32 | Fahrzeugaufbereitung › Preise: Alle Paketpreise mit „ab" versehen („ab 169 €", „ab 199 €" …). André: „ab ist… | offen | OALAB |
| 5.33 | Fahrzeugaufbereitung › Lackaufbereitung: Die Lackaufbereitung stärker herausstellen. „auf Wunsch mit Swissvax… | offen | OALAB |
| 5.34 | Fahrzeugaufbereitung › Innenraumdesinfektion: Fotos der Ozonbehandlung einbauen; darauf ist von außen das Sch… | offen | OALAB |
| 5.35 | Fahrzeugaufbereitung: Foto einer Heißvernebelung mit sichtbarem Dampf. André: Das „kann ich auch noch mal ver… | offen | André |
| 5.36 | Fahrzeugaufbereitung › „Innen, außen und Lack": Die Außenaufbereitung bekommt das Foto vom gelben Ferrari bei… | offen | OALAB |
| 5.37 | Fahrzeugaufbereitung › „Ergebnisse, die man sieht": Die Galerie mit den gelieferten Fotos füllen: Innenaufber… | offen | OALAB |
| 5.38 | Fahrzeugaufbereitung › Galerie: Foto Cockpit-Detailing: das Wischen über das Cockpit, am besten mit Schaum od… | angefragt | André |
| 5.39 | Fahrzeugaufbereitung › Galerie: Foto einer Keramikversiegelung beim Auftragen: Sie wird mit einem kleinen Sch… | offen | André |
| 5.40 | Fahrzeugaufbereitung › Galerie: Foto Lederpflege beim Auftragen. Bisher gibt es nur Stoffinnenräume. Das Alca… | angefragt | André |
| 5.41 | Fahrzeugaufbereitung › Galerie: „Versiegelung" und „Keramikschutz" zu einer Kachel zusammenlegen, denn beides… | offen | OALAB |
| 5.42 | Fahrzeugaufbereitung › Galerie: Foto Endkontrolle: ein Mitarbeiter prüft den Lack eines fertigen Fahrzeugs. A… | offen | André |
| 5.43 | Unfallinstandsetzung › Reparaturleistungen: Neue Karte „Classic Cars (Old- und Youngtimer)". Bilder: der vorh… | offen | OALAB (Karte, Text) · André (… |
| 5.44 | Leistungen (Übersicht): Seite `/leistungen` inhaltlich ausbauen. Sie ist „relativ leer" und soll die Informat… | offen | OALAB |

Quelle: `docs/backlog/schleife-5.md`

</details>

<details>
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 18 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| R5 | Impressumsangaben vervollständigen. Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer… | offen · Berufsbezeichnung geliefert (4.11: „Meisterbetrieb… | André |
| R6 | Datenschutzerklärung schreiben. `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nach… | offen · Zeitpunkt: zum Schluss (User 2026-09-16) · neues Pf… | André + Datenschutzbeauftragt… |
| R12 | Feldliste der Schadenmeldung durchgehen. 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streich… | ⏸️ ruht — das eigene Schadenformular ist seit 2026-09-16 ab… | André |
| R3 | Erklärtexte für sieben Leistungsseiten, je 2–3 Absätze „Was ist X?" | offen · im Meeting 2026-09-25 nicht besprochen | André |
| R4 | Ausbildung bestätigen (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen,… | 🟨 bestätigt 2026-09-25 — Ausbildung aktiv, Karosserie und… | André |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite | offen · Mitarbeiterstimmen → 🔁 5.28 (neu: Foto optional);… | André |
| R7 | Echtes Vorschaubild statt Unsplash-Stockfoto (`og:image`, JSON-LD). Deckungsgleich mit dem offenen OG-Bild-Pu… | offen · im Meeting 2026-09-25 nicht besprochen | André |
| R15 | Herkunft jedes Fotos bestätigen: echtes Foto · KI-bearbeitet · KI-generiert. Seit 02.08.2026 gilt die Kennzei… | offen, aufgenommen 2026-09-18 (Bildinventar) · 2026-09-21:… | André (und OALAB, falls selbs… |
| – | Partnerlogos: schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schu… | 🟨 teilweise — riparo (Logo + Link), Porsche Zentrum Leipzi… | André |
| R9 | Anhänge mitsenden. Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | 🟨 für Schäden gelöst — Fotos gehen seit 2026-09-16 über re… | OALAB |
| R11 | Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen. Beim Schadenformular ist Streichen seit… | offen | OALAB |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | Drohnen- und Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotopunkte 3.23… | 🟨 teilweise — am 2026-09-23 sind 3 der 12 Drohnenclips als… | OALAB |
| R17 | Der Kontrastwächter kann Text am Verlaufsrand der Partnerliste melden. Am 2026-09-21 meldete ein Lauf „Porsch… | offen, aufgenommen 2026-09-21 | OALAB |
| T4 | Zweiter Knopf auf den Aufbereitungskarten → Wissensbereich | offen · mit 5.17 mitentscheiden (fällt die Wissens-Karte we… | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund | offen · mit 5.21 (Fußzeile verkleinern) mitentscheiden | André (Gestaltungsfrage) |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
