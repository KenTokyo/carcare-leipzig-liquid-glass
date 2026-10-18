# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 19.10.2026, 00:48, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 19.10.2026, 00:48 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `ae66be6` | `c130660` | 8 vor GitHub (kommt mit dem Push) |
| `2026-10-06-lektorat` | `ae66be6` | — | neu, 8 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `2026-10-16-r23-fusszeile-cls` | `d5c0319` | — | neu, 1 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `2026-10-17-r24-404-seite` | `ea6aa36` | — | neu, 2 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `claude/affectionate-shirley-ebfce4` | `5004a36` | — | neu, 1 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `claude/frosty-chaum-e06c4d` | `318aaee` | — | neu, 1 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `claude/gracious-nightingale-5061fb` | `ae66be6` | — | neu, 8 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| `claude/hopeful-colden-aa3a3f` | `92fadf0` | — | neu, 1 Commit(s) noch nicht auf GitHub, Branch wird nicht gepusht |
| 16 weitere lokale Branches | – | – | gleich mit GitHub |
| 1 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `d5c0319` | 17.10.2026, 00:32 | oalabhypercode | Docs: R23 und R28 live geprüft (CLS 0 auf Handys, kein Pop-up-Rest) | 3 | — | **kommt mit diesem Push** |
| `ea6aa36` | 17.10.2026, 01:32 | oalabhypercode | Eigene 404-Seite (R24): Prerender schreibt dist/404.html, Smoke-Test prüft Status und Seite | 11 (1 neu) | — | **kommt mit diesem Push** |
| `5004a36` | 17.10.2026, 01:32 | oalabhypercode | Hero R29: Vertrauensleiste unter 640 px Höhe unter dem Fensterrand (Variante a), Prüfer erweitert | 8 | — | **kommt mit diesem Push** |
| `a1f1b1f` | 17.10.2026, 17:51 | oalabhypercode | Merge: Hero R29 (Vertrauensleiste in niedrigen Fenstern, Prüfer erweitert) | 8 | — | **kommt mit diesem Push** |
| `92fadf0` | 17.10.2026, 01:19 | oalabhypercode | Lenis: Schleife nur beim Gleiten (R26), Leerlauf-Wächter, Akkordeon-Prüfer zählt Hauptthread-Bilder | 9 (2 neu) | package.json | **kommt mit diesem Push** |
| `048d9b9` | 17.10.2026, 17:51 | oalabhypercode | Merge: Lenis R26 (Schleife nur beim Gleiten, Leerlauf-Wächter, Akkordeon-Prüfer) | 9 (2 neu) | package.json | **kommt mit diesem Push** |
| `64bb51c` | 18.10.2026, 23:44 | oalabhypercode | Merge: origin/main (18.10.: Karte mittig, FAQ-Akkordeon, Abläufe ohne Schleier R30, ruhigeres Aufklappen) | 28 (6 neu) | package.json | **kommt mit diesem Push** |
| `ae66be6` | 19.10.2026, 00:41 | oalabhypercode | Prüfer nach dem Merge: Bahn nach dem Bild lesen, Hover-Test wartet aufs Einblenden | 5 (1 neu) | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| npm-Skripte | neu: `npm run faq-mobil`, neu: `npm run leerlauf` |
| Kontrolle | `git log --oneline -9 main`: oben „Docs: Push-Stand …", darunter `ae66be6`, `64bb51c`, `048d9b9`, `92fadf0`, `a1f1b1f`, `5004a36`, `ea6aa36`, `d5c0319` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | nichts |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 22, alle Commits schon auf GitHub: `2026-09-25-schleife-5-import`, `2026-09-27-schleife-5-paket-1`, `2026-09-28-schleife-6-import`, `2026-09-28-schleife-6-umsetzung`, `2026-10-02-stimmen-zusatzregeln`, `2026-10-04-rechtsseiten-und-texte`, `2026-10-05-karriere-fotos`, `2026-10-05-performance-glas`, `aussparung-beschriftete-aktionen`, `claude/mystifying-heisenberg-57ec44`, `fix/dummy-waechter-anerkennung`, `fix/matomo-aussage`, `fix/prerender-vercel`, `nachtraege/versand-und-waechterdoku`, `optimierung/react-typen`, `paket-d/karriere-navigation`, `paket-e/formularversand`, `paket-e/vorauswahl-und-alle-anfragearten`, `paket-e/zusatzleistungen-zeitstrahl-dialog`, `paket-f/schadenformular`, `rechtsseiten/impressum-datenschutz`, `schleife-1/paket-b` |
| Weitere Worktrees | 7 |
| Stash-Einträge | 0 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

| Punkt | Planung |
|---|---|
| Phase 3 — Build, Messwerkzeuge, Doku, Push nach Freigabe, Live-Nachweis | `docs/404-seite/tasks/2026-10-17-404-seite-tasks.md` |
| O1 — Kleiner Sprung am Desktop beobachten · OALAB (mit der Sitzung „mobil-startseite“) | `docs/cls-layoutspruenge/tasks/2026-10-16-cls-layoutspruenge-optimierung-tasks.md` |
| O3 — Felddaten nach dem Livegang · OALAB mit Zugang zur Search Console | `docs/cls-layoutspruenge/tasks/2026-10-16-cls-layoutspruenge-optimierung-tasks.md` |

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
