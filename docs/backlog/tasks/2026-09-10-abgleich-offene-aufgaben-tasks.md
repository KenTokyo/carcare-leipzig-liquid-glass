# Abgleich offene Aufgaben Schleife 1–3 gegen den Code

**Angelegt:** 2026-09-10
**Auftrag (User):** (1) Localhost starten, Liste aller offenen Aufgaben der Schleifen 1 bis 3.
(2) Danach: „Pull mal bitte erstmal alle potenziellen Veränderungen und dann aktualisier die Liste wieder."
**Anlass für die Zusatzphasen:** Die Backlog-Dateien tragen den Stand 2026-09-06/07. Beim Abgleich zeigte
sich Doku-Drift. Nach Workflow-Regel sofort mitbehoben. Der Pull brachte 8 Commits (07.–08.09.), die einen
Teil davon bereits enthielten — Phase 5 führt beides zusammen.

---

### ✅ Phase 1 — Dev-Server und Abgleich gegen den Code
**Ziel:** Server starten, jeden offenen Punkt am Code prüfen statt aus der Doku übernehmen.
* [x] Vorher geprüft: Ports 3007/4173/5173 frei, kein Vite-Prozess → kein `EADDRINUSE`-Risiko
* [x] Dev-Server über `.claude/launch.json` („carcare") gestartet: `http://localhost:3007`, Konsole fehlerfrei
* [x] Stichproben am Code: `erklaerung={null}` auf 7 Seiten (1.15/R3), 2 Dummy-Zusatzleistungen (1.18/2.26),
      3 Platzhalter-Stimmen (1.26/3.19), Außenaufbereitung teilt das Motiv mit Fahrzeugaufbereitung (R2),
      BVAT-Satz ohne Logo (3.12), LKW/Bus-Angabe unverändert (3.13)
* [x] Befund: **3.9 ist umgesetzt** (Paket G, Phase 10) — Doku sagte noch „Entscheidung beim Kunden"
* [x] Befund: **2.13 ist im Code erfüllt** — Pakete ohne Foto, Abgrenzung per Text (2.9/2.12)
* [x] Befund: **2.2 und 3.6 meinen dieselbe Fläche** — Parallax-Galerie mit blauen Platzhalterkacheln
**Referenzen:**
`docs/backlog/schleife-1.md`
`docs/backlog/schleife-2.md`
`docs/backlog/schleife-3.md`

### ✅ Phase 2 — Wächterlücke schließen (`check-nummernraeume.mjs`)
**Ziel:** Neun Altnummern 3.32–3.40 in `schleife-1.md` wurden nicht gemeldet.
* [x] Regel: In einer Schleifendatei ist ein **fremder** Präfix in der ersten Tabellenzelle immer ein Befund
* [x] Pflichtfrage beantwortet und im Kopf des Skripts dokumentiert
* [x] Gegenprobe: 9 von 9 Altzeilen gemeldet, danach grün, 0 Fehlalarme
**Referenzen:**
`scripts/check-nummernraeume.mjs`

### ✅ Phase 3 — Doku-Drift beheben
* [x] Bereich „3.1 – R9" → „3.1 – 3.37" in `CLAUDE.md` und `README.md`
* [x] `schleife-1.md`, `schleife-2.md`, `schleife-3.md`, `offene-punkte-konsolidiert.md` nachgezogen
**Referenzen:**
`docs/backlog/schleife-1.md`
`docs/backlog/offene-punkte-konsolidiert.md`

### ✅ Phase 4 — Prüfen (vor dem Pull)
* [x] `npm run build` grün (29/29), `npm run meta` 0 von 29, kein Mojibake

### ✅ Phase 5 — Pull und Zusammenführen
**Ziel:** Alle entfernten Änderungen holen, ohne die lokale Arbeit zu verlieren oder Doppeltes einzuspielen.
* [x] `git fetch --all --prune`: 8 Commits auf `main` (07.–08.09.), neuer Branch
      `2026-09-07-navigation-kontrast-video` — **vollständig in `main` enthalten** (0 Commits voraus)
* [x] Lokale Änderungen gesichert: Stash „abgleich-2026-09-10 lokal (vor Pull)" + Patch im Scratchpad
* [x] `git pull --ff-only` ohne Konflikt (kein ausgehender Commit)
* [x] **Doppelte Arbeit erkannt:** `d3379ae` (07.09.) enthielt die Umbenennung R4–R12 in `schleife-1.md`
      bereits — genauer als meine (drei Querverweise zeigten auf andere Kundenpunkte). Nicht erneut angewendet.
* [x] Neu angewendet, was im Pull fehlte: „3.1 – R9"-Korrektur, 1.16/1.17/1.22-Stände, R4-Querverweis,
      2.13, 2.2, 2.14, zerbrochene Tabelle in `schleife-2.md`, Kollisionswarnung, 3.5, 3.6, 3.9, 3.22, R3-Verweise
* [x] **Wächter neu aufgesetzt** auf die Upstream-Fassung (die prüft Schleifendateien jetzt mit, aber nur auf
      Überlauf). Gegenprobe gegen die alte `schleife-1.md`: **Upstream 3 von 9, neue Regel 9 von 9** —
      3.33 „Impressum" und 3.34 „Datenschutz" liegen innerhalb von 3.1–3.37 und wären durchgegangen
* [x] **Encoding-Fehler aus dem Pull behoben:** echtes Backspace-Zeichen (0x08) statt `\b` in
      `docs\backlog` — in `scripts/check-nummernraeume.mjs` und `2026-09-06-nummernkonflikt-optimierung-tasks.md`
**Referenzen:**
`scripts/check-nummernraeume.mjs`
`docs/backlog/tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`

### ✅ Phase 6 — Neuer Abgleich nach dem Pull
**Ziel:** Die Liste gegen den gepullten Code neu prüfen.
* [x] **3.18, 3.20, 3.21 erledigt** (Videos eingehängt, `data/videos.ts`: alle drei mit Quelle). Im Browser
      geprüft: `/ueber-uns` lädt beide Videos, Hero läuft, Konsole fehlerfrei
* [x] **Formularversand scharf:** Netcup-SMTP statt Resend (`api/anfrage.ts`), 7 Vercel-Secrets nur für
      Production. GET auf `carcare-center.vercel.app/api/anfrage` → `{"bereit":true}` (sendet nichts).
      → 1.17/1.22 nur noch Live-Test, 2.24 eingerichtet, R10 hinterlegt
* [x] Doku-Drift aus dem Pull nachgezogen: 2.24 „optional mit Rückfall" (Code: *No silent fallback*),
      R6/R10 nannten noch Resend, 3.20/3.21 behaupteten „bei reduzierter Bewegung nur Standbild"
      (am 07.09. auf Kundenwunsch zurückgenommen), Zählung im Konsolidat (6 statt 7 offene Zeilen)
* [x] Neu aufgenommen: **WCAG 2.2.2** — die drei Videos laufen automatisch in Schleife ohne Anhalte-
      Möglichkeit (im Browser bestätigt: `controls` fehlt). Offen im Betriebsvideo-Plan, Phase 6
* [x] Liste neu gezählt: **Schleife 1: 5 · Schleife 2: 13 · Schleife 3: 25 = 43 offen**
      (vorher 46; 1.17 und 1.22 fehlt nur noch der Live-Test)
* [x] `npm run nummern` grün, Dev-Server läuft mit dem neuen Stand
* [ ] `npm install` für die 5 neuen Pakete (nodemailer, react-email, @types/nodemailer, ffmpeg-static, tsx)
      — **nicht ausgeführt**, lädt u. a. eine ffmpeg-Binärdatei nach; Rückfrage an den User. Ohne sie bricht
      `npm run build` im `prebuild` (`scripts/build-email.mjs`). Das Frontend braucht sie nicht
**Referenzen:**
`docs/backlog/offene-punkte-konsolidiert.md`
`docs/netcup-email/tasks/2026-09-08-netcup-email-tasks.md`
`docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`

---

## Kommentare

### Phasen 1–4
**Eingehalten:** Dev-Server nur auf ausdrücklichen Wunsch und nach Portprüfung gestartet ✅, jeder Status
am Code geprüft ✅, Meta-Längen gemessen ✅, Kundennummern unangetastet ✅, kein Seitentext geändert ✅,
Wächter mit Gegenprobe getestet ✅, unter 700 Zeilen ✅, kein Mojibake ✅, nicht committet ✅.

### Phasen 5–6
**Eingehalten:** vor dem Pull gesichert (Stash + Patch) ✅, Fast-Forward statt Merge ✅, eingehende Arbeit
nicht überschrieben ✅, nur Fehlendes neu angewendet ✅, Produktivsystem nur lesend abgefragt ✅, keine
Pakete ohne Rückfrage nachgeladen ✅, Steuerzeichen-Scan über alle gepullten Textdateien ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🔴 **Kritisch, offen (Entscheidung User/Kunde): Die Reihenfolge Datenschutz → Versand ist gekippt.**
   Die Doku verlangte, dass R6 (Datenschutzerklärung) steht, **bevor** R10 den Versand freischaltet.
   Seit 2026-09-08 sendet die Kundenvorschau Formulare tatsächlich; `/datenschutz` ist weiter ein Gerüst.
   Laut Projektentscheidung blockieren Rechtstexte die Vorschau nicht — mit echtem Versand verarbeitet sie
   aber echte personenbezogene Daten. Nicht von mir zu entscheiden, deshalb deutlich markiert.
2. 🟠 **Hoch, behoben: Die Upstream-Wächterregel fing nur 3 der 9 Altzeilen.** Ausgerechnet die beiden
   Livegang-Blocker lagen innerhalb des Kundenraums. Neue Regel fängt 9 von 9.
3. 🟠 **Hoch, behoben: Doku sagte bei 2.24 „optional mit Rückfall"** — der Code macht seit 08.09. das
   Gegenteil. Wer der Doku folgt, erwartet Geschäftskundenpost im Info-Postfach.
4. 🟡 **Mittel, behoben: 3.20/3.21 beschrieben ein Verhalten, das der Kunde zurückdrehen ließ.**
5. 🟡 **Mittel, behoben: Steuerzeichen 0x08 in zwei Dateien** — ein Werkzeug hat `\b` als Backspace
   geschrieben. Unsichtbar im Editor, sichtbar als „docsacklog".
6. 🟡 **Mittel, behoben: Doppelte Arbeit.** Meine Korrektur aus Phase 3 lag seit dem 07.09. bereits auf
   `origin/main`, nur nicht lokal. *Lehre: vor einem Abgleich zuerst `git fetch`.*
7. 🔵 **Niedrig, offen: `npm install` ausstehend** (siehe Phase 6).
8. 🔵 **Niedrig, offen → Optimierungsplan: Wächterlücke 3** (Grenzen aus der Kunden-CSV ableiten).

**Optimierungsplan:** `docs/backlog/tasks/2026-09-10-abgleich-optimierung-tasks.md`
