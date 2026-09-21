# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 22.09.2026, 00:55, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 22.09.2026, 00:55 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `53264d9` | `53264d9` | gleich |
| `2026-09-18-bilder-inventar` | `965eb9c` | `53264d9` | 2 vor GitHub (kommt mit dem Push) |
| 12 weitere lokale Branches | – | – | gleich mit GitHub |
| 1 weitere Branches nur auf GitHub | – | – | alle in `main` enthalten |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `9875e8e` | 22.09.2026, 00:55 | oalabhypercode | Bilder: Lieferung September eingebaut, Kartenvideo B11, Bereichsvideos, KI-Plakette | 49 (16 neu) | package.json | **kommt mit diesem Push** |
| `965eb9c` | 22.09.2026, 00:55 | oalabhypercode | Docs: Bildliste B1-B118 mit Vermerken, Backlog und Aufgaben zum Bildtausch | 13 (3 neu) | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| npm-Skripte | neu: `npm run fotos` |
| Kontrolle | `git log --oneline -3 main`: oben „Docs: Push-Stand …", darunter `965eb9c`, `9875e8e` |

## 4. Nur auf dem Rechner, von dem gepusht wurde

| Was | Stand |
|---|---|
| Unversioniert | `parallax-scroll-kit/` |
| Uncommittete Änderungen | keine |
| Lokale Branches ohne GitHub-Gegenstück | 13, alle Commits schon auf GitHub: `claude/frosty-chaum-e06c4d`, `fix/dummy-waechter-anerkennung`, `fix/matomo-aussage`, `fix/prerender-vercel`, `nachtraege/versand-und-waechterdoku`, `optimierung/react-typen`, `paket-d/karriere-navigation`, `paket-e/formularversand`, `paket-e/vorauswahl-und-alle-anfragearten`, `paket-e/zusatzleistungen-zeitstrahl-dialog`, `paket-f/schadenformular`, `rechtsseiten/impressum-datenschutz`, `schleife-1/paket-b` |
| Weitere Worktrees | 2 |
| Stash-Einträge | 0 |

## 5. Inhaltlich offen

### Folgepunkte aus den Planungen dieses Pushs

| Punkt | Planung |
|---|---|
| Phase 4 — offen, braucht Angaben des Users | `docs/bilder/tasks/2026-09-21-ki-kennzeichnung-tasks.md` |

### Backlog gesamt: 45 offene Punkte

Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.

<details>
<summary>Schleife 2: 7 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 2.2 | Blaue Platzhalter-Füllung ersetzen | ⏸️ zurückgestellt | Oalab |
| 2.7 | Globalen Slogan anpassen: „Premium" bleibt, Fahrzeugpflege geringer gewichten, Unfallinstandsetzung / Karosse… | offen | Oalab |
| 2.8 | Angepassten Slogan überall konsistent platzieren | offen | Oalab |
| 2.11 | Zusatzleistungen als optionale, wählbare Zusatzleistungen auf der Subseite aufführen (Fußnote/Hinweis) | ⏸️ später | Oalab |
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | offen | Oalab |
| 2.26 | Liste aller Sonder-/Zusatzleistungen Aufbereitung (Keramikversiegelung, Nanoversiegelung, leichte Kratzerentf… | ⏸️ später | André |
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizi… | offen | André |

Quelle: `docs/backlog/schleife-2.md`

</details>

<details>
<summary>Schleife 3: 15 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 3.6 | Parallax-Bereich: keine „dreckig/sauber"-Vergleiche, sondern Endbilder bzw. Bilder kurz vor Fertigstellung /… | offen | Oalab |
| 3.10 | Smart-Repair-Foto ersetzen – zeigt Kratzerentfernung/Aufbereitung, nicht Smart Repair | offen | Oalab |
| 3.13 | Autoglas: Angaben PKW/LKW-Neuverglasung inhaltlich prüfen | offen | Oalab / André |
| 3.16 | Partner nach Freigabe direkt verlinken („geschenkte Leads") | 🟨 teilweise | Oalab |
| 3.19 | Mitarbeiterstimmen anonymisiert – nur Berufsbezeichnung + kurzer Kommentar, keine Namen | 🟦 Struktur steht | Oalab |
| 3.22 | Wissensdatenbank-Seite bleibt vorerst Platzhalter, wird komplett neu gestaltet | offen | Oalab |
| 3.23 | Fotopaket Aufbereitung: Versiegelung, Felgenreinigung, Politur, Keramikapplikation während der Arbeit (Termin… | offen | André |
| 3.25 | Foto: Smart Repair, echte Nahaufnahme | offen | André |
| 3.27 | Foto: Hagelschaden (Archiv oder anstehendes Fahrzeug) | offen | André |
| 3.28 | Foto: Felge in Reparatur / beim Lackieren (vorhanden nur beschädigte Felgen) | offen | André |
| 3.30 | Klärung Vintech – ob und wie der Autoglaspartner genannt werden darf; Inhalte Autoglas-Subseite zuliefern | offen · Abgleich 2026-09-17: „Vintech" ist sehr wahrscheinl… | André |
| 3.31 | Freigaben Partner-Logos (Autohäuser, Versicherungen, Agenturen) für Logo-Nutzung und Verlinkung einholen | 🟨 teilweise — riparo, Porsche Zentrum Leipzig (2026-09-16)… | André |
| 3.32 | Ausbildungsstellen: widersprüchlich – erst „nein", dann „haben wir aktuell auch schon". Vor Umsetzung der Kar… | Klärung | André |
| 3.36 | Slogan-Wortlaut: Richtung klar, exakte Formulierung noch offen | Klärung | Oalab / André |
| 3.37 | „Bildtechnisch noch was ändern" (Teil 1) – unklar, ob Bildgrößen/-formate oder Darstellung gemeint waren | Klärung | André |

Quelle: `docs/backlog/schleife-3.md`

</details>

<details>
<summary>Schleife 4: 3 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 4.1 | Startbildschirm, Porsche-Bilder: Beim blauen Porsche müssen die Felgen bildbearbeitet werden – Verschmutzunge… | offen | — |
| 4.14 | Drohnenvideo: Aktuell nur Teilausschnitt eingebunden – der Schwenk durch die Karosserieabteilung fehlt. Volls… | offen | — |
| 4.19 | Sektion "Entwicklung" – Meilenstein 3: Beginn/Ausweitung der Zusammenarbeit im Schadens- und Versicherungsber… | offen | — |

Quelle: `docs/backlog/schleife-4.md`

</details>

<details>
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 20 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| R5 | Impressumsangaben vervollständigen. Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer… | offen · Berufsbezeichnung geliefert (4.11: „Meisterbetrieb… | André |
| R6 | Datenschutzerklärung schreiben. `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nach… | offen · Zeitpunkt: zum Schluss (User 2026-09-16) · neues Pf… | André + Datenschutzbeauftragt… |
| R12 | Feldliste der Schadenmeldung durchgehen. 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streich… | ⏸️ ruht — das eigene Schadenformular ist seit 2026-09-16 ab… | André |
| R3 | Erklärtexte für sieben Leistungsseiten, je 2–3 Absätze „Was ist X?" | offen | André |
| 1.18 = 2.26 | Liste der Zusatzleistungen fürs Aufbereitungsformular. Dabei klären: Was ist Paket, was Zusatz | Struktur steht · Paket-Frage beantwortet (4.21: Formularaus… | André |
| R4 | Ausbildung bestätigen (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen,… | offen · Richtung „ja" (4.19: „Ausbildungsbetrieb im Lackier… | André |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite | offen | André |
| R7 | Echtes Vorschaubild statt Unsplash-Stockfoto (`og:image`, JSON-LD). Deckungsgleich mit dem offenen OG-Bild-Pu… | offen | André |
| R15 | Herkunft jedes Fotos bestätigen: echtes Foto · KI-bearbeitet · KI-generiert. Seit 02.08.2026 gilt die Kennzei… | offen, aufgenommen 2026-09-18 (Bildinventar) · 2026-09-21:… | André (und OALAB, falls selbs… |
| R18 | Drei Bereichsvideos (Karosserie- und Mechanik-, Lackier-, Aufbereitungsbereich) für `/ueber-uns` und `/karrie… | offen, aufgenommen 2026-09-21 (Wunsch User) · Platzhalter i… | André |
| – | Partnerlogos: schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schu… | 🟨 teilweise — riparo (Logo + Link), Porsche Zentrum Leipzi… | André |
| R9 | Anhänge mitsenden. Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | 🟨 für Schäden gelöst — Fotos gehen seit 2026-09-16 über re… | OALAB |
| R11 | Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen. Beim Schadenformular ist Streichen seit… | offen | OALAB |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | 12 Drohnenclips und 16 Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotop… | offen, zu prüfen | OALAB |
| R17 | Der Kontrastwächter kann Text am Verlaufsrand der Partnerliste melden. Am 2026-09-21 meldete ein Lauf „Porsch… | offen, aufgenommen 2026-09-21 | OALAB |
| T4 | Zweiter Knopf auf den Aufbereitungskarten → Wissensbereich | offen | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund | offen | André (Gestaltungsfrage) |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
