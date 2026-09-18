# Push-Stand

> **Automatisch erzeugt** mit `npm run push-stand` am 18.09.2026, 15:33, vor dem Push — nicht von Hand bearbeiten.
> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").
> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).

Repository `KenTokyo/carcare-leipzig-liquid-glass` · Hauptbranch `main` · Remote-Stand: 18.09.2026, 15:33 (`git fetch`)

## 1. Branches: lokal und GitHub

| Branch | Lokal | GitHub | Stand |
|---|---|---|---|
| `main` | `5488446` | `0898fda` | 2 vor GitHub (kommt mit dem Push) |
| `2026-09-10-schleife-4-sofortpaket` | `33b6f5d` | `33b6f5d` | gleich |
| `2026-09-14-karten-ablauf-flaeche` | `ed3bd69` | `ed3bd69` | gleich |
| `2026-09-16-preise-partner-schadenlink` | `0898fda` | `0898fda` | gleich |
| `2026-09-18-push-stand` | `5488446` | — | neu, 2 Commit(s) noch nicht auf GitHub |
| 8 weitere lokale Branches | – | – | gleich mit GitHub |

## 2. Commits in diesem Push

| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |
|---|---|---|---|---|---|---|
| `132d8f2` | 14.09.2026, 11:53 | oalabhypercode | Deps: Pakete aus dem Pull installiert, sharp und smol-toml abgesichert | 1 | package-lock.json | war schon oben |
| `4a281da` | 14.09.2026, 11:54 | oalabhypercode | Backlog: Schleife 4 importiert, Abgleich gegen den Code, Waechter prueft fremde Raeume | 13 (5 neu) | — | war schon oben |
| `33b6f5d` | 14.09.2026, 11:54 | oalabhypercode | Schleife 4: Sofortpaket umgesetzt, Zeitstrahl haelt lange Texte | 20 (1 neu) | — | war schon oben |
| `ed3bd69` | 17.09.2026, 02:27 | oalabhypercode | Schleife 2/4: Kartenflaechen, Ablauf-Animation, Betriebsflaeche 3.500 m2 | 44 (5 neu) | — | war schon oben |
| `0898fda` | 17.09.2026, 02:29 | oalabhypercode | Preise, Partner, Schadenlink nach Kundenentscheidung; Partner auf Full HD (R14) | 76 (23 neu) | package.json | war schon oben |
| `bbbcfc7` | 18.09.2026, 15:30 | oalabhypercode | Push-Stand: Uebersicht fuer Pulls an anderen Standorten, bei jedem Push | 8 (4 neu) | package.json | **kommt mit diesem Push** |
| `5488446` | 18.09.2026, 15:33 | oalabhypercode | Push-Stand: dieser Push getrennt von rueckwirkend dokumentierten Commits | 1 | — | **kommt mit diesem Push** |

Dazu als oberster Commit: diese Übersicht.

## 3. Nach dem Pull an anderen Standorten

| Schritt | Warum |
|---|---|
| `git fetch --prune`, `git checkout main`, `git pull` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |
| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |
| npm-Skripte | neu: `npm run push-stand` |
| Konfiguration geändert | `.claude/settings.json` |
| Nur wer noch vor `132d8f2` steht (Commits „war schon oben") | **`npm install`**: **sharp 0.35.3 → 0.35.4** · @emnapi/runtime 1.11.2 → 1.11.3 · @img/* (16 Pakete) 0.35.3 → 0.35.4 · @img/* (10 Pakete) 1.3.2 → 1.3.3 · smol-toml 1.6.1 → 1.8.0 — Lockfile: 29 Paket(e) geändert · npm-Skripte: neu: `npm run zielgruppen`, neu: `npm run partnerlogos` · Konfiguration geändert: `tsconfig.json` |
| Kontrolle | `git log --oneline -8 main`: oben „Docs: Push-Stand …", darunter `5488446`, `bbbcfc7`, `0898fda`, `ed3bd69`, `33b6f5d`, `4a281da`, `132d8f2` |

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
| 2 — Eigenes Schadenformular entfernen — erst nach Kundenbestätigung | `docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-optimierung-tasks.md` |
| 4 — reparatur.info: Datenschutz- und Impressumslink, AV-Vertrag | `docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-optimierung-tasks.md` |
| 5 — Porsche-Logo: nur mit Datei und Nutzungsrecht | `docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-optimierung-tasks.md` |
| 6 — Im Review mit André bestätigen lassen | `docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-optimierung-tasks.md` |
| 1 — Pushes aus Terminal und IDE ebenfalls prüfen — Entscheidung User | `docs/push-stand/tasks/2026-09-18-push-stand-optimierung-tasks.md` |
| 2 — Hook ohne Git Bash | `docs/push-stand/tasks/2026-09-18-push-stand-optimierung-tasks.md` |
| 1 — Wächter für die Kartenfläche: geprüft und bewusst zurückgestellt | `docs/schleife-2-4-karten-ablauf-flaeche/tasks/2026-09-14-karten-ablauf-optimierung-tasks.md` |
| 2 — Sektionshintergründe: zweite Fundstelle derselben Zahl | `docs/schleife-2-4-karten-ablauf-flaeche/tasks/2026-09-14-karten-ablauf-optimierung-tasks.md` |
| 3 — `ScrollPinnedProcess` bleibt das dritte Muster | `docs/schleife-2-4-karten-ablauf-flaeche/tasks/2026-09-14-karten-ablauf-optimierung-tasks.md` |
| 2 — `parallax-scroll-kit/`: `allowNestedScroll` nachziehen — Entscheidung User | `docs/zielgruppen-partner-sichtbarkeit/tasks/2026-09-17-zielgruppen-partner-sichtbarkeit-optimierung-tasks.md` |
| 3 — `ExpandingCardAccordion` auf `.cc-scroll-verlauf` umstellen (klein, optional) | `docs/zielgruppen-partner-sichtbarkeit/tasks/2026-09-17-zielgruppen-partner-sichtbarkeit-optimierung-tasks.md` |
| 5 — `npm run zielgruppen` im Review-Ablauf verankern | `docs/zielgruppen-partner-sichtbarkeit/tasks/2026-09-17-zielgruppen-partner-sichtbarkeit-optimierung-tasks.md` |

### Backlog gesamt: 54 offene Punkte

Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.

<details>
<summary>Schleife 2: 12 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 2.2 | Blaue Platzhalter-Füllung ersetzen | ⏸️ zurückgestellt | Oalab |
| 2.7 | Globalen Slogan anpassen: „Premium" bleibt, Fahrzeugpflege geringer gewichten, Unfallinstandsetzung / Karosse… | offen | Oalab |
| 2.8 | Angepassten Slogan überall konsistent platzieren | offen | Oalab |
| 2.11 | Zusatzleistungen als optionale, wählbare Zusatzleistungen auf der Subseite aufführen (Fußnote/Hinweis) | ⏸️ später | Oalab |
| 2.14 | Leasingrückgabe braucht ein eigenes Bild | offen | André |
| 2.15 | Innenaufbereitung: KI-Bild ersetzen – kein Transporter, eher exklusives Fahrzeug | offen | Oalab |
| 2.16 | Hero-Bild ersetzen – wirkt wie Schadensaufnahme, nicht wie Instandsetzung | offen | Oalab / André |
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | offen | Oalab |
| 2.20 | Foto Fuhrpark-/Autohausservice (Hänger) einbauen | offen | Oalab |
| 2.21 | Mietwagenbild / weiße Mietwagenflotte einarbeiten | offen | Oalab |
| 2.26 | Liste aller Sonder-/Zusatzleistungen Aufbereitung (Keramikversiegelung, Nanoversiegelung, leichte Kratzerentf… | ⏸️ später | André |
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizi… | offen | André |

Quelle: `docs/backlog/schleife-2.md`

</details>

<details>
<summary>Schleife 3: 21 offen</summary>

| Nr | Aufgabe | Status | Wer |
|---|---|---|---|
| 3.4 | Bild 5 (Ersatzwagen nach Verfügbarkeit) durch Foto eines eigenen Mietwagens ersetzen (nice to have) | offen | Oalab / André |
| 3.6 | Parallax-Bereich: keine „dreckig/sauber"-Vergleiche, sondern Endbilder bzw. Bilder kurz vor Fertigstellung /… | offen | Oalab |
| 3.8 | Sektion „Schadenaufnahme": Hintergrundbild ändern, ruhigeres Motiv im Stil der Aufbereitungsseite | offen | Oalab |
| 3.10 | Smart-Repair-Foto ersetzen – zeigt Kratzerentfernung/Aufbereitung, nicht Smart Repair | offen | Oalab |
| 3.11 | Dellenentfernung: sauberes Bild hinterlegen | offen | Oalab |
| 3.13 | Autoglas: Angaben PKW/LKW-Neuverglasung inhaltlich prüfen | offen | Oalab / André |
| 3.16 | Partner nach Freigabe direkt verlinken („geschenkte Leads") | 🟨 teilweise | Oalab |
| 3.19 | Mitarbeiterstimmen anonymisiert – nur Berufsbezeichnung + kurzer Kommentar, keine Namen | 🟦 Struktur steht | Oalab |
| 3.22 | Wissensdatenbank-Seite bleibt vorerst Platzhalter, wird komplett neu gestaltet | offen | Oalab |
| 3.23 | Fotopaket Aufbereitung: Versiegelung, Felgenreinigung, Politur, Keramikapplikation während der Arbeit (Termin… | offen | André |
| 3.24 | Foto: Delle, während sie entfernt wird | offen | André |
| 3.25 | Foto: Smart Repair, echte Nahaufnahme | offen | André |
| 3.26 | Foto: Neu-/Reparaturlackierung – Stoßstange beim Schleifen, angeschliffenes Teil oder Lackierkabine | offen | André |
| 3.27 | Foto: Hagelschaden (Archiv oder anstehendes Fahrzeug) | offen | André |
| 3.28 | Foto: Felge in Reparatur / beim Lackieren (vorhanden nur beschädigte Felgen) | offen | André |
| 3.29 | Bilder Innenaufbereitung: exklusives Fahrzeug, kein Transporter | offen | André |
| 3.30 | Klärung Vintech – ob und wie der Autoglaspartner genannt werden darf; Inhalte Autoglas-Subseite zuliefern | offen | André |
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
<summary>Repo-Befunde, Schleife 1 und Querschnitt: 18 offen</summary>

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
| R2 | Eigene Motive für Leasingrückgabe und Außenaufbereitung | offen | André |
| – | Partnerlogos: schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schu… | 🟨 teilweise — riparo (Logo + Link), Porsche Zentrum Leipzi… | André |
| R9 | Anhänge mitsenden. Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | 🟨 für Schäden gelöst — Fotos gehen seit 2026-09-16 über re… | OALAB |
| R11 | Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen. Beim Schadenformular ist Streichen seit… | offen | OALAB |
| – | Anhalte-Möglichkeit für die drei automatisch laufenden Videos (WCAG 2.2.2: Bewegung über 5 s braucht Pause/St… | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/20… | OALAB |
| – | 12 Drohnenclips und 16 Rohclips aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotop… | offen, zu prüfen | OALAB |
| T4 | Zweiter Knopf auf den Aufbereitungskarten → Wissensbereich | offen | OALAB |
| – | `ITEMS` gegen `serviceCatalog` prüfen, ableiten oder bewusst trennen; Wächter erwägen | offen | OALAB |
| – | Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund | offen | André (Gestaltungsfrage) |
| – | Visueller Nachweis des gepinnten Zustands wurde nie erbracht | offen | OALAB |

Quelle: `docs/backlog/offene-punkte-konsolidiert.md`

</details>
