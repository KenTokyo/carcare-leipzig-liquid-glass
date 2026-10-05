# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 05.10.2026, 03:24, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 05.10.2026, 03:24 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `fcbb625` | `380e728` | 3 vor GitHub (kommt mit dem Push) |
| `2026-10-04-rechtsseiten-und-texte` | `fcbb625` | — | neu, 3 Commit(s) noch nicht auf GitHub |
| 15 weitere lokale Branches | – | – | gleich mit GitHub |
| 1 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `c656524` | 05.10.2026, 03:24 | oalabhypercode | Rechtsseiten: Impressum, Datenschutzerklärung und KI-Verzeichnis | 10 (3 neu) | — | **kommt mit diesem Push** |
| `d8e0269` | 05.10.2026, 03:24 | oalabhypercode | Karriere: Bürokaufmann/-frau statt Industriekaufmann/-frau | 3 | — | **kommt mit diesem Push** |
| `fcbb625` | 05.10.2026, 03:24 | oalabhypercode | Aufbereitung und Lackierung: Texte nach Andrés Anmerkungen vom 05.10. | 10 (2 neu) | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| Kontrolle | `git log --oneline -4 main`: oben „Docs: Push-Stand …", darunter `fcbb625`, `d8e0269`, `c656524` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | `parallax-scroll-kit/` |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 19, alle Commits schon auf GitHub: `2026-09-25-schleife-5-import`, `2026-09-27-schleife-5-paket-1`, `2026-09-28-schleife-6-import`, `2026-09-28-schleife-6-umsetzung`, `2026-10-02-stimmen-zusatzregeln`, `aussparung-beschriftete-aktionen`, `claude/frosty-chaum-e06c4d`, `fix/dummy-waechter-anerkennung`, `fix/matomo-aussage`, `fix/prerender-vercel`, `nachtraege/versand-und-waechterdoku`, `optimierung/react-typen`, `paket-d/karriere-navigation`, `paket-e/formularversand`, `paket-e/vorauswahl-und-alle-anfragearten`, `paket-e/zusatzleistungen-zeitstrahl-dialog`, `paket-f/schadenformular`, `rechtsseiten/impressum-datenschutz`, `schleife-1/paket-b` |
| Weitere Worktrees | 2 |
| Stash-Einträge | 0 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

| Punkt | Planung |
|---|---|
| O1 — Formularversand beim Hosting über KUPPER IT (🟠 hoch) | `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md` |
| O2 — Kopien im Versandpostfach (🟡 mittel) | `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md` |
| O3 — „KUPA IT“ heißt KUPPER IT GmbH (🟢 niedrig) | `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md` |
| Phase 5 — Offene Punkte vor dem Livegang (mit André und KUPPER IT klären) | `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md` |

### Backlog gesamt: 47 offene Punkte

Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.

<details>
<summary>Schleife 2: 2 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | offen | Oalab |
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizi… | offen | André |

Quelle: `docs/backlog/schleife-2.md`

</details>

<details>
<summary>Schleife 3: 5 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 3.13 | Autoglas: Angaben PKW/LKW-Neuverglasung inhaltlich prüfen | offen | Oalab / André |
| 3.16 | Partner nach Freigabe direkt verlinken („geschenkte Leads") | 🟨 teilweise · 2026-09-27: VW und Audi verlinkt (5.16) | Oalab |
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
<summary>Schleife 5: 16 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 5.1 | Projekt: Livegang in der Woche ab 28.09.2026 vorbereiten. Dieses Meeting ist die letzte Abstimmung davor; KUP… | offen | OALAB |
| 5.11 | Alle Seiten › Fuhrparkservice: Fuhrparkfoto ohne die generierte Person. Links im Bild wurde eine Person hinzu… | offen | OALAB |
| 5.12 | Startseite › Schadenreise, Schritt 02: Eine echte Schadenaufnahme fotografieren. André: „Ich kann auch eine s… | offen | André |
| 5.21 | Alle Seiten › Fußzeile: Fußzeile verkleinern. Sie ist „sehr breit" und wird auf das Wesentliche reduziert. | offen | OALAB |
| 5.23 | Über uns › „Alles im eigenen Haus": Die Leistungskarten wie auf der Startseite bebildern. Die Karte „Neu- und… | offen | OALAB |
| 5.27 | Karriere › Ausbildung „Fahrzeuglackierer/in": Foto einer jungen Lackiererin (Azubi) bei der Arbeit. Die Ausbi… | offen | André |
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

Quelle: `docs/backlog/schleife-5.md`

</details>

<details>
<summary>Schleife 6: 8 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 6.5 | Startseite / Geschäftskunden › Partner: Autohaus Otto Grimm und Porsche Werk Leipzig als Partner. Otto Grimm:… | offen · wartet auf Freigabe | André (Freigaben) · OALAB (Ei… |
| 6.8 | Startseite › Titelbild, seitenweit: Slogan „We Care and Repair". Im Titelbild groß „We Care and Repair", die… | 🟨 Entwurf umgesetzt, Freigabe André offen | OALAB (Entwurf) · André (Frei… |
| 6.9 | Alle Seiten › KI-Plakette: Plakette unten in eine Ecke statt oben, dezent gestaltet. Ali: Man schaue zuerst z… | offen | OALAB |
| 6.10 | Livegang › Google: Indexierung der neuen Unterseiten mit Falk klären. Die vielen neuen Unterseiten müssen bei… | offen | OALAB · KUPA IT |
| 6.16 | Karriere › Ausbildung Industriekaufmann/-frau: Foto einer Mitarbeiterin am Computer (Kundenannahme) für die A… | offen · Zulieferung André | André |
| 6.19 | Livegang › alte Website: Inhalte der alten Website sichern lassen (Backup), bevor umgestellt wird. | ⏸️ zurückgestellt (User, 28.09.) | OALAB · KUPA IT |
| 6.20 | Rechtliches › Analyse und Cookies: Matomo mit KUPA IT klären. Läuft die Analyse auf der neuen Seite weiter, k… | ⏸️ zurückgestellt (User, 28.09.) | OALAB · KUPA IT |
| 6.22 | Über uns (ggf. Fahrzeugaufbereitung) › Bewertungen: Google-Bewertungen statisch einbinden: ausgewählte, berei… | 🟨 teilweise — Auswahl der Bewertungen offen | OALAB (Auswahl) · André (ok) |

Quelle: `docs/backlog/schleife-6.md`

</details>

<details>
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 16 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| R5 | Impressumsangaben vervollständigen. Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer… | offen · Berufsbezeichnung geliefert (4.11: „Meisterbetrieb… | André |
| R6 | Datenschutzerklärung schreiben. `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nach… | offen · Zeitpunkt: zum Schluss (User 2026-09-16) · neues Pf… | André + Datenschutzbeauftragt… |
| R12 | Feldliste der Schadenmeldung durchgehen. 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streich… | ⏸️ ruht — das eigene Schadenformular ist seit 2026-09-16 ab… | André |
| R3 | Erklärtexte für sieben Leistungsseiten, je 2–3 Absätze „Was ist X?" | offen · im Meeting 2026-09-25 nicht besprochen | André |
| R4 | Ausbildung bestätigen (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen,… | 🟨 bestätigt 2026-09-25 — Ausbildung aktiv, Karosserie und… | André |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite | offen · Mitarbeiterstimmen → 🔁 5.28 (neu: Foto optional; S… | André |
| R7 | Echtes Vorschaubild statt Unsplash-Stockfoto (`og:image`, JSON-LD). Deckungsgleich mit dem offenen OG-Bild-Pu… | offen · im Meeting 2026-09-25 nicht besprochen | André |
| – | Partnerlogos: schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schu… | 🟨 teilweise — riparo (Logo + Link), Porsche Zentrum Leipzi… | André |
| R9 | Anhänge mitsenden. Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | 🟨 für Schäden gelöst — Fotos gehen seit 2026-09-16 über re… | OALAB |
| R11 | Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen. Beim Schadenformular ist Streichen seit… | offen | OALAB |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | Drohnen- und Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotopunkte 3.23… | 🟨 teilweise — am 2026-09-23 sind 3 der 12 Drohnenclips als… | OALAB |
| R17 | Der Kontrastwächter kann Text am Verlaufsrand der Partnerliste melden. Am 2026-09-21 meldete ein Lauf „Porsch… | offen, aufgenommen 2026-09-21 | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund | offen · mit 5.21 (Fußzeile verkleinern) mitentscheiden | André (Gestaltungsfrage) |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
