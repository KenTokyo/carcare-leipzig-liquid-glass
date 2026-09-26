# Schleife 5 aus dem Meeting-Transkript — Import in den Backlog

**Auftrag (User, 2026-09-25):** Aus dem Transkript des Meetings mit André vom 25.09.2026
(„oalab x carcare center – finale Anpassungen der Website", DOCX, 1:19:18) die **Schleife 5**
erzeugen. Doppelungen mit bisherigen To-dos streichen, was Schleife 5 in anderen Schleifen
erledigt, als erledigt markieren. Bei Unklarheiten fragen.

**Ergebnis:** `docs/backlog/schleife-5.md` (5.1 – 5.44) plus Querverweise in allen Listen.

---

### ✅ Phase 1 — Quelle lesen und Punkte herausziehen
**Ziel:** Jeder Wunsch, jede Entscheidung, jede Zulieferung aus dem Gespräch mit Zeitmarke.
* [x] DOCX entpackt (kein pandoc auf dem Rechner) und mit eigenem Skript nach Text gewandelt; erster Lauf
      schrieb cp1252 statt UTF-8 („Andr[Ersatzzeichen U+FFFD]") → mit `PYTHONIOENCODING=utf-8` neu, 1.211 Zeilen, 463 Sprecherbilder entfernt
* [x] Transkript vollständig gelesen, 44 Aufgaben + 21 Entscheidungen/Abnahmen + 4 Ideen notiert
* [x] Nummern in **Gesprächsreihenfolge** vergeben (erste Nennung), Zeitmarken je Punkt
**Referenzen:**
`Quelle: DOCX beim User (Downloads), bewusst nicht im Repo`

### ✅ Phase 2 — Abgleich gegen Code, Bildinventar und Backlog
**Ziel:** Jeder Punkt mit Fundstelle, Mehrfachnutzung und Bezug zu alten Nummern — gemessen, nicht erinnert.
* [x] Fundstellen gezählt: Fax 2×, „Verkaufsaufbereitung" 4×, „nach unserem Standard" 2× (doppelte Quelle),
      „Innen, außen" 7× in 6 Dateien, Footer-Zeile, `hyphens-auto` an der Hero-H1, Ausbildung 3× `nicht-suchend`
* [x] Bildstellen je Datei aus `docs/bilder/README.md` (Stand 24.09., seither keine Bildänderung — geprüft):
      Mehrfachnutzung bei Fuhrpark (B106 Serviceberater!), Transporter (B84 bleibt), Lackierkabine (B104/B107), Politurfoto (B28/B46/B47/B66)
* [x] Plaketten aus dem Meeting den Dateien zugeordnet: 4 × echt, 2 × KI-bearbeitet, 3 × KI-generiert bestätigt
* [x] Bezüge zu 2.x, 3.x, 4.x, 1.x, R-Befunden bestimmt (erledigt / aufgegangen / wieder offen / bestätigt)
**Referenzen:**
`docs/bilder/README.md`
`data/bildherkunft.ts`

### ✅ Phase 3 — `schleife-5.md` schreiben
* [x] 44 Punkte in 8 Abschnitten, Spalten kompatibel zu `push-stand` (Nr., Bereich / Seite, Aufgabe, Verantw., Status)
* [x] Unterlage „Herkunft laut Meeting" (zu 5.9), Entscheidungen ohne Aufgabe, Wirkungstabelle auf alte Punkte,
      nicht besprochene offene Punkte, Bringschuld André, Rückfragen, Ideen, Paketvorschlag
**Referenzen:**
`docs/backlog/schleife-5.md`

### ✅ Phase 4 — Querverweise in den bisherigen Listen
* [x] Schleife 2: 2.2, 2.7, 2.8, 2.26 gestrichen (🔁), 2.11/2.24 ergänzt
* [x] Schleife 3: 3.6, 3.10, 3.19, 3.23, 3.36 gestrichen (🔁); 3.25, 3.27 geliefert; 3.28 entfällt; 3.32 beantwortet; 3.11 wieder offen; 3.14/3.16/3.22/3.31 ergänzt
* [x] Schleife 4: 4.19 beantwortet; 4.4, 4.7, 4.8 abgenommen; 4.1 und 4.14 mit Stand aus dem Meeting
* [x] Schleife 1: 1.18, 1.22, 1.26 mit Verweis
* [x] Konsolidiert: R1, R4, R5, R6, R9, R10, R15, 1.18, 1.26, Partnerlogos, Footer-Icons, T4, WCAG 2.2.2 + Zählung
      (Wartet auf André 8 → 6, Summe echt offen 20 → 18). Zeilen per Skript mit Prüfung je Zeile (genau ein Treffer,
      Zellenzahl) — der erste Lauf brach ab, weil R1–R12 auch in der Zuordnungstabelle alt → neu stehen; nichts
      wurde halb geschrieben (alle Dateien erst nach bestandener Prüfung)
**Referenzen:**
`docs/backlog/offene-punkte-konsolidiert.md`
`docs/backlog/schleife-3.md`

### ✅ Phase 5 — Index und Werkzeuge
* [x] `docs/backlog/README.md`: fünfte Liste, Zählung neu (72 offen), Statuszeichen inkl. 🔁, Quelle, Livegang-Hinweis
* [x] `CLAUDE.md`: Backlog-Tabelle um Schleife 5
* [x] `scripts/check-nummernraeume.mjs`: Raum 5 (sonst wäre jede 5.x-Zeile außerhalb aller Räume)
* [x] `scripts/push-stand.mjs`: Schleife 5 als Quelle, 🔁 zählt nicht als offen, `auslassen` um 5 erweitert
* [x] Memory: Schleife 5 + nächster Termin
**Referenzen:**
`scripts/check-nummernraeume.mjs`
`scripts/push-stand.mjs`

### ✅ Phase 6 — Prüfen
* [x] `npm run nummern` grün, Raum 5.1–5.44 erkannt
* [x] Zählung offen je Liste mit dem Parser aus `push-stand` nachgerechnet: Schleife 2: 3 (vorher 7) · Schleife 3: 6 (15)
      · Schleife 4: 2 (3) · Schleife 5: 43 · Repo/1.x/Querschnitt: 18 (19) → 72 statt 44; die alten Listen schrumpfen um 15
* [x] Encoding: alle geänderten Dateien streng als UTF-8 lesbar, 0 Treffer auf Mojibake-Muster (einziger Treffer war das
      zitierte Ersatzzeichen in dieser Datei selbst — ersetzt durch eine Beschreibung)
**Referenzen:**
`docs/backlog/README.md`

### ✅ Phase 7 — Rückfragen an den User einarbeiten
* [x] Antworten (25.09.): 5.13 **bauen** · 4.14 **erledigt** (Bereichsvideos) · 3.30 **freigegeben** · 4.1 **gestrichen**
* [x] Eingetragen in Schleife 5 (Rückfragen, Wirkungstabelle, 5.13, Paketvorschlag), Schleife 3 (3.30), Schleife 4 (4.1, 4.14;
      **Schleife 4 damit abgeschlossen**), konsolidiert (WCAG-Zeile), `docs/bilder/motive.json` (4.1 an beiden Startbildern entfernt)
* [x] Neu gezählt: Schleife 2: 3 · Schleife 3: 5 · Schleife 4: 0 · Schleife 5: 43 · Repo/1.x/Querschnitt: 18 → **69**

### ✅ Phase 8 — Bildliste auf Schleife 5 bringen (nachgezogen)
**Ziel:** Die Bildentscheidungen des Meetings stehen an den Bildstellen, nicht nur im Backlog („Andrés Liste samt Stand an der Stelle").
* [x] `docs/bilder/motive.json`: 40 Vermerke, davon 16 neu und 24 geändert (Smart Repair 7, Hagel 6, Delle 6, Fuhrpark 2,
      B20, B26, B30, B46, B96, B107, Galerie B48–B58 → 🟠; B47 und B84 → 🟢), „offen" je Datei für 12 Dateien (bei Felge und
      beiden Startbildern geleert: 3.28 entfällt, 4.1 gestrichen); Rundlauf vorab byte-gleich geprüft
* [x] `scripts/bilder-inventar.mjs`: Datum in Ortszeit statt UTC (O2), geprüft: derselbe Zeitpunkt ergibt jetzt 24.09. statt 23.09.
* [x] `npm run build` (grün, alle Wächter) und `npm run bilder` → `docs/bilder/README.md` + Kontaktbogen neu.
      Nachweis: Kopfzeile „25.09.2026, 18:36 Uhr, gemessen an dist/ vom 25.09.2026, 18:23 Uhr" (Ortszeit stimmt);
      `nummern.json` inhaltlich unverändert (keine Nummer verschoben); Vermerke: 40 anzupassen · 3 später · 30 angepasst · 5 in Ordnung
**Referenzen:**
`docs/bilder/motive.json`
`scripts/bilder-inventar.mjs`

---

## Kommentare

### Phasen 1–8
**Eingehalten**: Planung vor der Umsetzung ✅, Kundennummern unangetastet (5.x auf ausdrücklichen Wunsch des Users,
Herkunft dokumentiert) ✅, keine fremde Nummer in der ersten Tabellenzelle (Wächter grün, Raum 5.1–5.44) ✅,
Mehrfachnutzung jeder Bilddatei geprüft ✅, gemessen statt geschätzt (Fundstellen, Bildstellen, Zählung mit dem
`push-stand`-Parser) ✅, Rückfragen gestellt statt geraten (4 Punkte) ✅, Transkript nicht ins Repo (persönliche
Nebenbemerkungen, Namen von Mitarbeitenden) ✅, Textregeln (erste Person Plural, „CarCare Center") ✅, alle
Änderungen per Skript mit Prüfung je Zeile und erst nach bestandener Prüfung geschrieben ✅, UTF-8 ohne Mojibake ✅,
Seitencode unangetastet (nur Doku, Daten der Bildliste, Werkzeuge) ✅, kein `npm run dev` ✅

**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch — Livegang in KW 40, aber Impressum (R5) und Datenschutzerklärung (R6) wurden im Meeting nicht
   besprochen.** „Zum Schluss" (Entscheidung 16.09.) ist jetzt. An vier Stellen sichtbar gemacht; die Klärung liegt beim
   Termin am 28.09. → Optimierung O1.
2. 🟠 **Hoch — Neun sichtbare Platzhalter müssen laut `check-dummies` vor dem Livegang weg** (Zusatzleistung 1/2,
   Meilenstein 3, drei Mitarbeiterstimmen). Gefunden erst beim Build für die Bildliste, nicht beim Lesen des
   Backlogs. Hätte 5.2 („alles andere nach dem Livegang") wörtlich gegolten, wären sie live gegangen. → O4, in 5.1 geführt.
3. 🟠 **Hoch — `push-stand` und der Nummernwächter kannten nur vier Schleifen.** Ohne Nachtrag hätte der Wächter
   alle 44 Punkte als „außerhalb der Kundenräume" gemeldet und den Build gebrochen; `push-stand` hätte Schleife 5
   nicht gezählt und 🔁-Zeilen doppelt. ✅ **fixed** (Phase 5).
4. 🟡 **Mittel — Derselbe Ablaufschritt steht in zwei Quellen** (`components/DetailingProcessSection.tsx` und
   `data/detailing.ts`). Jede Textkorrektur (5.18) muss zweimal gemacht werden. → O5, mit 5.18 lösen.
5. 🟡 **Mittel — Kopfzeile von `npm run bilder` nannte das falsche Datum** (UTC-Datum mit Ortszeit). ✅ **fixed** (O2).
6. 🟢 **Niedrig — veralteter Vermerk in `docs/bilder/motive.json`** (R2 bei `smart-repair`). ✅ **fixed** (O3).

**Refactoring-Empfehlung:** `docs/backlog/tasks/2026-09-25-schleife-5-import-optimierung-tasks.md` — offen bleiben
O1 (Termin), O4 und O5 (Umsetzungspakete aus `schleife-5.md`).
