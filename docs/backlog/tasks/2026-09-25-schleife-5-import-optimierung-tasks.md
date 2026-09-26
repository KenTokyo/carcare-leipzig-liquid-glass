# Optimierung zum Import von Schleife 5

**Bezug:** `docs/backlog/tasks/2026-09-25-schleife-5-import-tasks.md` (Kommentare, Auffälligkeiten 1–6)
**Stand:** 2026-09-25

---

### ⬜ O1 — Livegang-Blocker sichtbar machen (🔴 kritisch)
**Befund:** Der Livegang ist für die Woche ab 28.09. geplant, aber Impressum (R5) und Datenschutzerklärung (R6)
kamen im Meeting nicht vor. „Zum Schluss" (Entscheidung 16.09.) ist jetzt.
* [x] Hinweis oben in `schleife-5.md`, in 5.1, in `docs/backlog/README.md` (Schnellzugriff) und an R5/R6 im konsolidierten Backlog
* [ ] Klärung mit André am 28.09. (liegt beim User, steht in den Rückfragen von `schleife-5.md`)

### ✅ O2 — Kopfzeile von `npm run bilder` mit falschem Datum (🟡 mittel)
**Befund:** „Erzeugt am 23.09.2026, 00:04", der Lauf war aber am 24.09. Ursache: `toISOString()` liefert das Datum in
UTC, die Uhrzeit kam aus der Ortszeit. Betraf auch den `dist/`-Stempel, das „seit"-Datum entfallener Nummern und
den Hinweis „Datei geändert am".
* [x] `lokalISO()` in `scripts/bilder-inventar.mjs`, an allen drei Stellen eingesetzt; keine `toISOString()` mehr im Skript
* [x] Gegenprobe: 2026-09-23T22:04Z → alt „2026-09-23", neu „2026-09-24", Uhrzeit 00:04

### ✅ O3 — Veralteter Vermerk in `docs/bilder/motive.json` (🟢 niedrig)
**Befund:** Bei `smart-repair` stand noch „R2 steht auch leihweise für Leasingrückgabe vorbereiten", seit 21.09. überholt.
* [x] Ersetzt durch den Stand aus Schleife 5 (5.6); dazu die offenen Punkte von 11 weiteren Dateien und 40 Vermerke je Stelle

### ⬜ O4 — Sichtbare Platzhalter vor dem Livegang (🟠 hoch)
**Befund:** Beim Build meldet `check-dummies` neun anerkannte Platzhalter mit dem Satz „Diese müssen VOR dem Livegang
ersetzt werden": Zusatzleistung 1/2, Meilenstein 3, drei Mitarbeiterstimmen samt Seitentexten. Schleife 5 sagt
zugleich „alles andere darf nach dem Livegang folgen" (5.2) — ohne diesen Befund hätte das die Platzhalter mit erlaubt.
* [x] In 5.1 und im Paketvorschlag von `schleife-5.md` als Voraussetzung für den Livegang geführt
* [ ] Umsetzen mit 5.20 (drei Zusatzleistungen einsetzen), 5.24 (Meilenstein 3) und 5.28 (Stimmen oder Sektion ausblenden)

### ⬜ O5 — Derselbe Ablaufschritt in zwei Quellen (🟡 mittel)
**Befund:** „Innen, außen, Lack und Details nach unserem Standard." steht in `components/DetailingProcessSection.tsx`
(Startseite, mit Bildern je Schritt) und in `data/detailing.ts` (Ablauf der Aufbereitungsseite). Jede Textkorrektur
muss zweimal gemacht werden, und die beiden laufen auseinander.
* [ ] Mit 5.18 zusammen lösen: Die Startseite liest Titel und Text aus `data/detailing.ts`, nur die Bilder bleiben in der
      Komponente. Nicht vorab erledigt, weil es Seitencode ist und zum Umsetzungspaket gehört, nicht zum Import.

---

## Kommentare

**Eingehalten**: jeder Befund mit Beleg (Build-Ausgabe, Zeitpunkt-Gegenprobe, Fundstellen) ✅, Seitencode unangetastet
(nur Werkzeug und Doku) ✅, JSON-Rundlauf vor dem Schreiben geprüft ✅, UTF-8 ✅

**Offen nach diesem Plan:** O1 (Termin mit André), O4 und O5 (gehören zu den Umsetzungspaketen aus `schleife-5.md`).
