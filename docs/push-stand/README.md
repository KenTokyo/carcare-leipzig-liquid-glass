# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 14.10.2026, 02:00, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 14.10.2026, 02:00 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `bd1f65f` | `b88695f` | 11 vor GitHub (kommt mit dem Push) |
| `2026-10-06-lektorat` | `bd1f65f` | — | neu, 5 Commit(s) noch nicht auf GitHub |
| 16 weitere lokale Branches | – | – | gleich mit GitHub |
| 1 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `7189ac2` | 13.10.2026, 23:58 | oalabhypercode | Merge: tote Komponenten (Hero.tsx entfernt, npm run tote-dateien, push-stand --nur) | 13 (2 neu) | package.json | **kommt mit diesem Push** |
| `168ec66` | 13.10.2026, 23:58 | oalabhypercode | Docs: Caching-Prüfung nach dem Deploy (Performance Phase 3) nachgetragen | 1 | — | **kommt mit diesem Push** |
| `411e7fe` | 14.10.2026, 00:08 | oalabhypercode | Lektorat: L28-L29 Impressum und Datenschutz korrigiert (2 K), Vorschlaege beim User | 5 (1 neu) | — | **kommt mit diesem Push** |
| `2d0befd` | 14.10.2026, 01:54 | oalabhypercode | Lektorat: L28-L29-Vorschlaege umgesetzt, Stilblatt 11 (Normzitate) | 7 | — | **kommt mit diesem Push** |
| `bd1f65f` | 14.10.2026, 02:00 | oalabhypercode | Bilder: Inventar neu erzeugt, Betriebsvideos B102/B111 im Rundgang wieder erfasst | 5 | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| npm-Skripte | neu: `npm run tote-dateien` |
| Kontrolle | `git log --oneline -6 main`: oben „Docs: Push-Stand …", darunter `bd1f65f`, `2d0befd`, `411e7fe`, `168ec66`, `7189ac2` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | `parallax-scroll-kit/` |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 23, alle Commits schon auf GitHub: `2026-09-25-schleife-5-import`, `2026-09-27-schleife-5-paket-1`, `2026-09-28-schleife-6-import`, `2026-09-28-schleife-6-umsetzung`, `2026-10-02-stimmen-zusatzregeln`, `2026-10-04-rechtsseiten-und-texte`, `2026-10-05-karriere-fotos`, `2026-10-05-performance-glas`, `aussparung-beschriftete-aktionen`, `claude/frosty-chaum-e06c4d`, `claude/mystifying-heisenberg-57ec44`, `fix/dummy-waechter-anerkennung`, `fix/matomo-aussage`, `fix/prerender-vercel`, `nachtraege/versand-und-waechterdoku`, `optimierung/react-typen`, `paket-d/karriere-navigation`, `paket-e/formularversand`, `paket-e/vorauswahl-und-alle-anfragearten`, `paket-e/zusatzleistungen-zeitstrahl-dialog`, `paket-f/schadenformular`, `rechtsseiten/impressum-datenschutz`, `schleife-1/paket-b` |
| Weitere Worktrees | 2 |
| Stash-Einträge | 0 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

| Punkt | Planung |
|---|---|
| Phase 11 — L30 Querschnitt und Abschluss | `docs/lektorat/tasks/2026-10-06-lektorat-seitenweise-tasks.md` |
| Phase 5 — Hydration statt Neuaufbau (größerer Eingriff, eigener Schritt) | `docs/performance/tasks/2026-10-05-ruckeln-und-cta-glas-tasks.md` |
| Phase 6 — Bilder in passenden Größen, Code-Splitting (später) | `docs/performance/tasks/2026-10-05-ruckeln-und-cta-glas-tasks.md` |

### Backlog gesamt: 24 offene Punkte

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
<summary>Schleife 5: 8 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 5.1 | Projekt: Livegang in der Woche ab 28.09.2026 vorbereiten. Dieses Meeting ist die letzte Abstimmung davor; KUP… | offen | OALAB |
| 5.11 | Alle Seiten › Fuhrparkservice: Fuhrparkfoto ohne die generierte Person. Links im Bild wurde eine Person hinzu… | offen | OALAB |
| 5.12 | Startseite › Schadenreise, Schritt 02: Eine echte Schadenaufnahme fotografieren. André: „Ich kann auch eine s… | offen | André |
| 5.21 | Alle Seiten › Fußzeile: Fußzeile verkleinern. Sie ist „sehr breit" und wird auf das Wesentliche reduziert. | offen | OALAB |
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
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 11 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| R5 | Impressumsangaben vervollständigen. Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer… | offen · Berufsbezeichnung geliefert (4.11: „Meisterbetrieb… | André |
| R6 | Datenschutzerklärung schreiben. `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nach… | offen · Zeitpunkt: zum Schluss (User 2026-09-16) · neues Pf… | André + Datenschutzbeauftragt… |
| R3 | Erklärtexte für sieben Leistungsseiten, je 2–3 Absätze „Was ist X?" | offen · im Meeting 2026-09-25 nicht besprochen | André |
| R4 | Ausbildung bestätigen (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen,… | 🟨 bestätigt 2026-09-25 — Ausbildung aktiv, Karosserie und… | André |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite | offen · Mitarbeiterstimmen → 🔁 5.28 (neu: Foto optional; S… | André |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | Drohnen- und Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotopunkte 3.23… | 🟨 teilweise — am 2026-09-23 sind 3 der 12 Drohnenclips als… | OALAB |
| R17 | Der Kontrastwächter kann Text am Verlaufsrand der Partnerliste melden. Am 2026-09-21 meldete ein Lauf „Porsch… | offen, aufgenommen 2026-09-21 | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund | offen · mit 5.21 (Fußzeile verkleinern) mitentscheiden | André (Gestaltungsfrage) |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
