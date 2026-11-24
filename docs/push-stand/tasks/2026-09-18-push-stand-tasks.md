# Push-Stand: Übersicht für Pulls an anderen Standorten, bei jedem Push

**Angelegt:** 2026-09-18 · **Branch:** `2026-09-16-preise-partner-schadenlink` → `main`

## Auftrag (User, 2026-09-18)

> Saubere Tabelle, was in der Branch offen ist und was gerade gepusht wurde — wichtig, weil
> Kollegen an anderen Standorten damit ihre Pulls abgleichen. Die Übersicht ins Repo legen,
> **nicht nur jetzt, sondern immer, wenn ein Push gemacht wird.**

## Lösungswege

| Weg | Urteil |
| --- | --- |
| Übersicht von Hand schreiben und pflegen | verworfen — veraltet beim ersten vergessenen Push, Hashes falsch abgetippt |
| Nur eine Regel in `CLAUDE.md` | verworfen als alleinige Lösung — eine Regel erinnert, erzwingt aber nichts |
| git-`pre-push`-Hook | nicht als Hauptweg — er kann die Übersicht nicht mehr in den laufenden Push legen und muss je Rechner aktiviert werden; als Option für Terminal-Pushes angeboten |
| **Generator aus git + Backlog (`npm run push-stand`), Claude-Code-Hook sperrt `git push` ohne aktuelle Übersicht, Regel in `CLAUDE.md`** | **gewählt** — Fakten kommen aus git statt aus dem Gedächtnis, die Sperre greift für jede Claude-Sitzung im Team |

## Phasen

### ✅ Phase 1 — Generator `scripts/push-stand.mjs` (518 Zeilen)
**Ziel:** Die Übersicht kommt aus git und dem Backlog, nicht aus dem Gedächtnis.
* [x] `git fetch --prune`, dann aus git: Branches lokal ↔ GitHub (wichtige einzeln, gleiche
      zusammengefasst, Branches nur auf GitHub und nicht in `main` einzeln), Commits des Pushs
      mit Datum, Autor, Dateien, Abhängigkeiten und „war schon oben / kommt mit diesem Push"
* [x] Nach-dem-Pull-Tabelle: `npm install` nur wenn nötig, mit Versionen — direkte
      Abhängigkeiten zuerst, Scope-Gruppen zusammengefasst (29 Lockfile-Pakete → 5 Einträge);
      neue/entfernte npm-Skripte; geänderte Konfiguration; Kontrollzeile für `git log`
* [x] Nur lokal: Unversioniertes, Uncommittetes, lokale Branches ohne Gegenstück, Worktrees,
      Stash — die Übersicht selbst ausgenommen
* [x] Offenes: `### ⬜`-Folgepunkte der Planungen, die der Push berührt; offene Zeilen der
      Backlog-Tabellen (Schleife 2–4, Repo-Befunde), je Quelle aufklappbar
* [x] `verlauf.md`: je Push eine Zeile, erneuter Lauf für denselben Stand ersetzt sie
* [x] `--seit <ref>` (rückwirkend), `--pruefen`, `--hook`; Pflichtfrage im Kopf (6 Punkte)

**Referenzen:**
`scripts/push-stand.mjs`

### ✅ Phase 2 — Sperre vor dem Push
* [x] `.claude/settings.json` (Projekt, versioniert — gilt für jede Claude-Sitzung im Team):
      PreToolUse auf `Bash|PowerShell`; ein Shell-Vorfilter startet Node nur, wenn „push" im
      Befehl steht
* [x] Erkennt `git push` auch hinter `cd … &&`, mit `git -C <pfad>`, in PowerShell-Schreibweise
      (`& git …`), mit Refspecs `quelle:ziel`, `--all`; lässt `--dry-run` und `--delete` durch
* [x] Sechs Fälle getestet (Wegwerf-Branch per `git commit-tree`, ohne den Arbeitsbaum zu
      berühren): sperrt ungenannte Commits (Exit 2), lässt `main` ohne Neues, `--dry-run` und
      Nicht-Push-Befehle durch; derselbe Befehl wie in der Einstellung im Pipe-Test bestätigt
* [x] In DIESER Sitzung noch nicht aktiv (gemessen mit einer Markierungsdatei): Claude Code
      beobachtet `.claude/` nur, wenn dort beim Start schon eine Einstellungsdatei lag. Ab der
      nächsten Sitzung aktiv. Heute stattdessen `npm run push-stand -- --pruefen` von Hand
* [x] Regel in `CLAUDE.md` (Abschnitt „Push-Stand"), npm-Skript `push-stand`

**Referenzen:**
`.claude/settings.json`
`CLAUDE.md`

### ✅ Phase 3 — Erste Übersicht und Push (2026-09-18)
* [x] Eigener Branch `2026-09-18-push-stand`, Werkzeug-Commit, `main` vorgespult
* [x] Übersicht mit `--seit efd549b` — dokumentiert den Push vom 2026-09-17 mit; im Verlauf
      als nachgetragene Zeile. Übersichts-Commit, `--pruefen` grün, Push. Protokoll:
      `docs/push-stand/verlauf.md`
* [x] Veraltetes „Push offen"-Kästchen in der Folgeliste von Paket 2 abgehakt; der
      Firefox-Hinweis in der Folgeliste R14 ist keine offene Aufgabe mehr

## Kommentare

### Phase 1
**Eingehalten:** Fakten aus git statt von Hand ✅, Backlog als einzige Quelle für Offenes ✅, unter 700 Zeilen ✅, Pflichtfrage beantwortet ✅, kein Mojibake ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (von mir, im Chat am 2026-09-18, durch den Generator aufgedeckt):** Meine
   Handtabelle nannte „smol-toml 1.11.2 → 1.11.3". Richtig ist **1.6.1 → 1.8.0**; 1.11.x gehört
   zu `@emnapi/runtime`. Genau der Fehler, den eine erzeugte Übersicht verhindert.
2. 🟡 **Mittel (gefixt vor dem ersten Commit):** `git status --porcelain` getrimmt — das
   führende Leerzeichen gehört zum Statuscode, die Pfade verloren ihren ersten Buchstaben
   (`LAUDE.md`).
3. 🟢 **Niedrig (gefixt):** Klärungstabellen heißen „Frage" statt „Aufgabe" — drei Zeilen
   standen ohne Text da.

### Phase 2
**Eingehalten:** Hook-Anleitung befolgt (Pipe-Test, JSON geprüft, Wirkung gemessen) ✅, Fehler im Werkzeug sperren keinen Push ✅, kein fremder Arbeitsbaum berührt ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (offen, bewusst):** Pushes aus Terminal, IDE oder GitHub Desktop prüft der Hook
   nicht. Ein git-`pre-push`-Hook je Rechner könnte das — muss aber jeder Kollege einmal
   aktivieren (`git config core.hooksPath`), deshalb nur angeboten.
2. 🟢 **Niedrig (offen):** Auf einem Rechner ohne Git Bash läuft der Hook nicht (Shell `bash`).
   Ein Fehlschlag sperrt nichts — der Push läuft dann ungeprüft.

Folgepunkte: [`2026-09-18-push-stand-optimierung-tasks.md`](2026-09-18-push-stand-optimierung-tasks.md)

### Phase 3
**Eingehalten:** Übersichts-Commit enthält nur die beiden Übersichtsdateien (sonst müsste er sich selbst nennen) ✅, Prüfung vor dem Push ✅
**Auffälligkeiten:** keine neuen.
