# Statusabgleich mit dem User (2026-10-06)

**Auftrag (User, 06.10.):** „2.18, 3.13, 3.16, 3.31, 3.37, 5.23, 5.27, 5.34, 5.36, 5.38 bis 5.40, 5.41, 6.5, 6.8, 6.9,
6.22, R7, R11, R9, R12 ist erledigt."

**Vorher (05.10., Push-Stand 17:48):** 46 offen. **Nachher:** 24 offen, gezählt nach den Regeln von `npm run push-stand`.

---

### ✅ Phase 1 — Abgleich gegen den Code
**Ziel:** Vor dem Abhaken nachsehen, ob der Code den gemeldeten Stand zeigt. Nicht prüfbar sind Entscheidungen und
Freigaben (2.18, 3.13, 3.16, 3.31, 3.37, 6.8, R12).
* [x] Kein neuerer Stand bei Kollegen: `git fetch`, `origin/main` = `19647ec`, beide Alt-Worktrees vom Juli.
* [x] Im Code bestätigt: **6.9** (Plakette unten rechts, `components/KiMarke.tsx`), **5.23** (Über uns nutzt `LeistungsKarten`).
* [x] Erledigt als Entscheidung, Code anders als ursprünglich verlangt: **5.27** (Ausbildungskarte behält `lackierkabine…`,
  Kunde 21.09.: „erstmal stehen lassen“), **6.5** (Otto Grimm und Porsche Werk ohne Link), **6.22** (nur Gesamtwertung,
  `bewertungen` leer), **R9** (Anhänge nur bei Bewerbungen).
* [x] ⚠️ Im Code noch nicht so: **R7**, **5.34**, **5.36**, **5.38**, **5.39**, **5.40**, **5.41** (Einzelheiten unten).

### ✅ Phase 2 — Backlog fortschreiben
**Ziel:** Status auf „✅ erledigt“ setzen, alten Status als „vorher“ erhalten, Code-Befund als Vermerk an der Zeile.
* [x] 22 Zeilen abgehakt: 2.18 · 3.13, 3.16, 3.31, 3.37 · 5.23, 5.27, 5.34, 5.36, 5.38, 5.39, 5.40, 5.41 · 6.5, 6.8, 6.9,
  6.22 · R7, R9, R11, R12 · dazu die Zeile „Partnerlogos“ (ohne Nr.), inhaltlich dieselbe Aufgabe wie 3.31.
* [x] Zählstände nachgezogen: Kopf von `schleife-2.md`, `schleife-3.md` (auch Abschnitt „Offene Fragen“), `schleife-5.md`,
  `schleife-6.md`, `README.md` (Kopf und Listentabelle), `offene-punkte-konsolidiert.md` (Kopf und Zusammenfassung).
* [x] Nachgezählt mit der Logik von `scripts/push-stand.mjs`: S1 **1** · S2 **1** · S3 **1** · S4 **0** · S5 **8** · S6 **3** ·
  Repo/Querschnitt ohne 1.26 **10** = **24**.
* [x] Zeilenenden: Das Skript hatte CRLF zu LF gemacht, wiederhergestellt (`file`: CRLF); `git diff --stat` zeigt nur die
  geänderten Zeilen.

**Referenzen:**
`docs/backlog/schleife-5.md`
`docs/backlog/offene-punkte-konsolidiert.md`
`docs/backlog/README.md`

---

## Noch offen (24)

| Schleife | Punkte |
|---|---|
| 1 | 1.26 (Benefits) |
| 2 | 2.27 |
| 3 | 3.22 |
| 5 | 5.1, 5.11, 5.12, 5.21, 5.35, 5.37, 5.42, 5.43 |
| 6 | 6.10, 6.19 ⏸️, 6.20 ⏸️ |
| Repo/Querschnitt | R5, R6, R3, R4, Video-Pause (WCAG 2.2.2), Drohnen- und Rohclips, R17, `ITEMS`/`serviceCatalog`, Footer-Icons, gepinnter Zustand |

## Kommentare

### Phase 1 und 2
**Eingehalten:** Kundennummern unverändert, keine neue Nummer vergeben ✅, alter Status erhalten statt überschrieben ✅,
Zählung nach push-stand-Regeln ✅, CRLF erhalten ✅, kein Mojibake ✅, nur Doku geändert ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch: R7, `og:image` ist weiter ein Unsplash-Stockfoto.** `index.html` (Zeilen 24 und 31), `components/SEOHead.tsx`
   (Standardwert) und `image` im `AutoRepair`-Schema (`seo/structuredData.ts`). Jede geteilte Seite zeigt damit ein fremdes
   Fahrzeug, und das Schema zeichnet ein Bild aus, das nicht von uns ist. Abgehakt laut User; Rückfrage, ob ein eigenes
   Bild gesetzt werden soll (Kandidat: echtes Startbild, Herkunft „echt“ laut R15).
2. 🟡 **Mittel: Galerie der Fahrzeugaufbereitung unverändert.** `components/DetailingGallery.tsx` zeigt elf Platzhalterkacheln
   ohne Foto, „Versiegelung“ und „Keramikschutz“ getrennt (5.38–5.41). 5.37 (Galerie füllen) bleibt offen und umfasst das.
3. 🟡 **Mittel: 5.34 und 5.36.** Kein Ozonfoto im Projekt; B46 (Außenaufbereitung) zeigt weiter das Politurfoto.
   `docs/bilder/README.md` führt B46 deshalb weiter als „Anzupassen“ (5.36), bis `npm run bilder` den neuen Stand kennt.
4. 🔵 **Niedrig: „Wartet auf André“ und „Ohne Zulieferung“ waren in `offene-punkte-konsolidiert.md` uneinheitlich gezählt**
   (17 als Summe bei 3 + 5 + 8). Jetzt nachgezählt: 3 + 3 + 6 = 12.

**Empfehlung:** Punkte 1–3 dem User als Rückfrage vorlegen (bewusst entfallen oder umsetzen?). Kein eigener
Optimierungsplan, weil jede Umsetzung eine Entscheidung des Users braucht.
