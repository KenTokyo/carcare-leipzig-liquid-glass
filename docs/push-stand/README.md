# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 20.10.2026, 02:54, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 20.10.2026, 02:54 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `85d76ad` | `dcaa814` | 7 vor GitHub (kommt mit dem Push) |
| `2026-10-19-nav-mobil-menue` | `f7e7983` | — | neu, 1 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `claude/quizzical-driscoll-12ff68` | `9ee0794` | — | neu, 3 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| 2 weitere lokale Branches | – | – | gleich mit GitHub |
| 15 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `f7e7983` | 20.10.2026, 01:36 | oalabhypercode | Navbar mobil: Menü scrollt, Karriere erreichbar, Logo immer zur Startseite (R34) | 6 (2 neu) | — | **kommt mit diesem Push** |
| `bd33094` | 20.10.2026, 01:53 | oalabhypercode | Merge: Navbar mobil, Menü scrollt, Karriere erreichbar, Logo immer zur Startseite (R34) | 6 (2 neu) | — | **kommt mit diesem Push** |
| `e2b9021` | 20.10.2026, 01:00 | oalabhypercode | Stimmen mobil wie die Leistungskarten (R33-a), Akkordeons nach dem Drehen sichtbar (R33-e) | 9 (3 neu) | — | **kommt mit diesem Push** |
| `230f550` | 20.10.2026, 01:00 | oalabhypercode | Docs: Stimmen mobil (R33-a), R33-e, R25 erledigt, Optimierungsplan O1–O10 | 5 (2 neu) | — | **kommt mit diesem Push** |
| `9ee0794` | 20.10.2026, 01:57 | oalabhypercode | Docs: R33-a auf main (dcaa814) umgesetzt und neu gemessen | 1 | — | **kommt mit diesem Push** |
| `9753fb7` | 20.10.2026, 02:09 | oalabhypercode | Merge: Stimmen auf /karriere mobil wie die Leistungskarten (R33-a), Akkordeons nach dem Drehen sichtbar (R33-e) | 14 (5 neu) | — | **kommt mit diesem Push** |
| `85d76ad` | 20.10.2026, 02:54 | oalabhypercode | Docs: R34-j, npm run nav stürzt bei hängendem Klick ab statt Messfehler zu melden | 1 | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| Kontrolle | `git log --oneline -8 main`: oben „Docs: Push-Stand …", darunter `85d76ad`, `9753fb7`, `9ee0794`, `230f550`, `e2b9021`, `bd33094`, `f7e7983` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | nichts |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 7, alle Commits schon auf GitHub: `2026-10-17-mobil-akkordeon-faq`, `2026-10-18-ablauf-schleier`, `2026-10-18-akkordeon-bewegung`, `2026-10-19-akkordeon-mittig-maus`, `2026-10-19-mac-zeichenluecken`, `2026-10-19-vite-worktrees-ignorieren`, `worktree-service-links-fix` |
| Weitere Worktrees | 3 |
| Stash-Einträge | 1 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

Keine offenen Folgepunkte in den berührten Planungsdateien.

### Backlog gesamt: 20 offene Punkte

Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.

<details>
<summary>Schleife 2: 1 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizi… | offen | André |

Quelle: `docs/backlog/schleife-2.md`

</details>

<details>
<summary>Schleife 3: 1 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 3.22 | Wissensdatenbank-Seite bleibt vorerst Platzhalter, wird komplett neu gestaltet | offen | Oalab |

Quelle: `docs/backlog/schleife-3.md`

</details>

<details>
<summary>Schleife 4: 0 offen</summary>


Quelle: `docs/backlog/schleife-4.md`

</details>

<details>
<summary>Schleife 5: 7 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 5.1 | Projekt: Livegang in der Woche ab 28.09.2026 vorbereiten. Dieses Meeting ist die letzte Abstimmung davor; KUP… | offen | OALAB |
| 5.11 | Alle Seiten › Fuhrparkservice: Fuhrparkfoto ohne die generierte Person. Links im Bild wurde eine Person hinzu… | offen | OALAB |
| 5.12 | Startseite › Schadenreise, Schritt 02: Eine echte Schadenaufnahme fotografieren. André: „Ich kann auch eine s… | offen | André |
| 5.35 | Fahrzeugaufbereitung: Foto einer Heißvernebelung mit sichtbarem Dampf. André: Das „kann ich auch noch mal ver… | offen | André |
| 5.37 | Fahrzeugaufbereitung › „Ergebnisse, die man sieht": Die Galerie mit den gelieferten Fotos füllen: Innenaufber… | offen | OALAB |
| 5.42 | Fahrzeugaufbereitung › Galerie: Foto Endkontrolle: ein Mitarbeiter prüft den Lack eines fertigen Fahrzeugs. A… | offen | André |
| 5.43 | Unfallinstandsetzung › Reparaturleistungen: Neue Karte „Classic Cars (Old- und Youngtimer)". Bilder: der vorh… | offen | OALAB (Karte, Text) · André (… |

Quelle: `docs/backlog/schleife-5.md`

</details>

<details>
<summary>Schleife 6: 3 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 6.10 | Livegang › Google: Indexierung der neuen Unterseiten mit Falk klären. Die vielen neuen Unterseiten müssen bei… | offen | OALAB · KUPA IT |
| 6.19 | Livegang › alte Website: Inhalte der alten Website sichern lassen (Backup), bevor umgestellt wird. | ⏸️ zurückgestellt (User, 28.09.) | OALAB · KUPA IT |
| 6.20 | Rechtliches › Analyse und Cookies: Matomo mit KUPA IT klären. Läuft die Analyse auf der neuen Seite weiter, k… | ⏸️ zurückgestellt (User, 28.09.) | OALAB · KUPA IT |

Quelle: `docs/backlog/schleife-6.md`

</details>

<details>
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 8 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| R5 | Impressumsangaben vervollständigen. Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer… | offen · Berufsbezeichnung geliefert (4.11: „Meisterbetrieb… | André |
| R6 | Datenschutzerklärung schreiben. `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nach… | offen · Zeitpunkt: zum Schluss (User 2026-09-16) · neues Pf… | André + Datenschutzbeauftragt… |
| R24 | Eigene 404-Seite wird nicht ausgeliefert. Unbekannte Adressen zeigen Vercels Textseite „NOT_FOUND“ (79 Byte)… | 🟨 umgesetzt 2026-10-17, lokal belegt: Der Prerender schrei… | OALAB |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | Drohnen- und Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotopunkte 3.23… | 🟨 teilweise — am 2026-09-23 sind 3 der 12 Drohnenclips als… | OALAB |
| R17 | Der Kontrastwächter kann Text am Verlaufsrand der Partnerliste melden. Am 2026-09-21 meldete ein Lauf „Porsch… | offen, aufgenommen 2026-09-21 | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
