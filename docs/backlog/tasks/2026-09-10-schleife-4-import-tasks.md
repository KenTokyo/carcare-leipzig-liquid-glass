# Schleife 4 importieren und offene Punkte beantworten

**Angelegt:** 2026-09-10
**Auftrag (User):** „Installier die Pakete, aber schau dir auch den Anhang an — das ist schon mal eine
Feedbackliste von André. Benenne sie als Schleife 4, wenn es offene Aufgaben sind, ansonsten nutze sie zur
Beantwortung offener Aufgaben in den Schleifen. Fotos habe ich bekommen, ich sichte die nun und kann danach
entscheiden, was wohin kommt."
**Quelle:** `car-Care-Center_Website_Feedback Schleife 4.xlsx` (OneDrive, Kunden/CarCare-Center), ein Blatt
„Änderungen Website", 21 Zeilen, Spalten Nr. · Bereich/Seite · Mangel/gewünschte Änderung · Anmerkung/offene
Frage · Priorität · offen. Autor André Bosse (2026-09-09), zuletzt geändert 2026-09-10.
**Umsetzung der 21 Punkte ist NICHT Teil dieses Auftrags** — hier werden sie eingeordnet, belegt und mit den
offenen Punkten verknüpft. Umsetzungsvorschlag in `docs/backlog/schleife-4.md`, letzter Abschnitt.

---

### ✅ Phase 1 — Pakete installieren und absichern
* [x] `npm install`: 106 Pakete neu, 24 geändert; die 5 aus dem Pull (nodemailer, react-email,
      @types/nodemailer, ffmpeg-static, tsx) vorhanden
* [x] Lockfile-Änderung geprüft: nur `"peer": true`-Metadaten der lokalen npm-Version (11.6.2)
* [x] `npm audit`: 2 × hoch (sharp < 0.35.4 / libheif, smol-toml ≤ 1.7.0 über react-grab) →
      `npm audit fix` ohne `--force`, nur kompatible Patch-Updates, `package.json` unverändert → **0**
* [x] `npm run build` grün: 29/29 Routen, `build-email` + alle Wächter; `npm run test:email` PASS
      (Mock-SMTP, sendet nichts; der „Versand fehlgeschlagen"-Eintrag ist der absichtliche Fehlerfall)
* [x] Hinweis: `package.json` verlangt Node 24.x, lokal läuft 25.2.1 — nur Warnung, Build läuft
**Referenzen:**
`package-lock.json`

### ✅ Phase 2 — Liste lesen und einordnen
* [x] Ohne Zusatzpakete gelesen (openpyxl fehlte; xlsx = ZIP + XML, Standardbibliothek). Formatierung
      geprüft: keine Durchstreichungen, Farben, Kommentare oder verborgenen Blätter, die Status tragen
* [x] Ergebnis: **alle 21 Zeilen sind offene Aufgaben** → Schleife 4. **Sieben davon beantworten
      zugleich offene Punkte** (R1, 3.32/R4, R5, 3.12, 1.18/2.26; Richtung für 3.35; Folgepunkt zu 3.21)
* [x] Gegen den Code gezählt statt geschätzt: 3.000 m² = 30 Stellen/20 Dateien, „Meisterbetrieb des
      Kfz-Lackierhandwerks" = 12, „Meisterbetrieb seit 1998" = 12, „instand setzen statt tauschen" = 6,
      „48 €" = 0
* [x] BVAT-Langform gegen die Verbandsseite geprüft → **Kundenangabe falsch** (siehe Finding 2)
**Referenzen:**
`docs/backlog/quelle/2026-09-10-schleife-4.csv`

### ✅ Phase 3 — Schleife 4 anlegen
* [x] `docs/backlog/schleife-4.md`, 4.1–4.21 = Andrés Spalte „Nr.", lückenlos; Rückleseprobe: alle
      Aufgaben, Bereiche und Anmerkungen wörtlich enthalten, 7 Spalten je Zeile
* [x] Quelle als CSV im Format der bestehenden Kunden-CSV (UTF-8 mit BOM, alle Felder gequotet),
      Rückleseprobe identisch; SharePoint-Metadaten der xlsx bewusst nicht ins Repo
* [x] Eigener Befund als **R13** (Meisterbetrieb seit wann?), keine freie x.y-Nummer
* [x] 10 Rückfragen gebündelt, Umsetzung in drei Pakete geschnitten (sofort / nach Antwort / Bild+Video)
**Referenzen:**
`docs/backlog/schleife-4.md`

### ✅ Phase 4 — Offene Punkte aus Schleife 1–3 beantworten
* [x] R1 geliefert (bis auf ein Jahr), R4/3.32 und R5 teilweise, 3.12 (Langform korrigiert), 1.18/2.26
      (Paket-Frage), 3.35 (Richtung), 3.21 (Folgepunkt 4.14) — in `schleife-1/2/3.md` und im Konsolidat
* [x] Fotolieferung vermerkt: eingegangen, Sichtung läuft — **nichts als erledigt markiert**
* [x] README (fünf Listen, 124 Punkte, zweite Quelle), `CLAUDE.md`-Backlogtabelle, Hinweis bei Textregel 4
**Referenzen:**
`docs/backlog/offene-punkte-konsolidiert.md`
`docs/backlog/schleife-3.md`
`CLAUDE.md`

### ✅ Phase 5 — Wächter und Nachweis
* [x] `check-nummernraeume.mjs`: Schleife 4 in `QUELLEN`; die Präfix-Regex wird jetzt **aus `QUELLEN`
      abgeleitet** — eine fünfte Schleife ist ein Eintrag, kein zweiter Ort zum Vergessen
* [x] Gegenproben: Überlauf „4.22" gemeldet · fremder Präfix „3.5" in `schleife-4.md` gemeldet ·
      alte `schleife-1.md` 9/9 gemeldet · echter Stand grün
* [x] Memory „Backlog-Nummernräume" auf vier Schleifen und die Nummernherkunft von Schleife 4 aktualisiert
**Referenzen:**
`scripts/check-nummernraeume.mjs`

---

## Kommentare

### Phasen 1–5
**Eingehalten:** Pakete erst nach ausdrücklichem Auftrag installiert ✅, Sicherheitsupdates nur kompatibel
(ohne `--force`) ✅, keine Zusatzpakete für die xlsx ✅, Kundentext wörtlich übernommen ✅, Nummern vom
Kunden statt selbst vergeben ✅, Kundenangabe vor Veröffentlichung geprüft (BVAT) ✅, nichts von der Seite
entfernt ✅, keine Umsetzung ohne Freigabe ✅, Wächter mit Gegenproben ✅, unter 700 Zeilen ✅, kein
Mojibake ✅, nicht committet ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🔴 **Kritisch, offen (André): „Meisterbetrieb seit 1998" passt nicht zur neuen Chronik (R13).**
   12 Stellen behaupten die Meisterqualifikation seit 1998; laut 4.16/4.18 war der Betrieb 1998 ein
   Aufbereitungsbetrieb, Lackierung und Karosserie kamen 2013. Stimmt „seit 1998" für die Meisterschaft
   nicht, ist es eine irreführende Angabe auf sieben Leistungsseiten und in den strukturierten Daten.
   Nichts geändert — Frage an André.
2. 🟠 **Hoch, abgefangen: Die BVAT-Langform in Andrés Liste ist falsch.** „Bundesverband Autoreparatur-
   Technik" — laut bvat.de „Bundesverband für Ausbeultechnik und Hagelinstandsetzung e.V.". Wörtlich
   umgesetzt, stünde ein falscher Verbandsname auf der Seite. Als Rückfrage markiert.
   ⚠️ **Korrektur 2026-09-16:** Auch diese Fassung war falsch. Laut Impressum des Verbands lautet der
   Name „Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V." — **ohne „für"**. Die Angabe oben
   stammte aus einer Suchzusammenfassung, nicht aus dem Impressum. Umgesetzt in
   `docs/preise-partner-schadenlink/`.
3. 🟠 **Hoch, offen: 3.500 m² widerspricht der verbindlichen Textregel 4 und dem abgenommenen 1.2.**
   30 Fundstellen. Hinweis in `CLAUDE.md` gesetzt, damit niemand einzelne Stellen ändert.
4. 🟠 **Hoch, offen: 4.21 „auf der gesamten Seite" würde wörtlich zwei SEO-Landingpages umbenennen**
   (Innen-/Außenaufbereitung, 1.8/1.9). Abgrenzung Paket ↔ Bereich als Rückfrage mit Vorschlag.
5. 🟡 **Mittel: Preisänderungen (4.4/4.7/4.10) greifen in H1, Meta, FAQ und `Offer`-Schema.** Nur
   gemeinsam umsetzbar; H1 „mit festen Paketpreisen" wird je nach Entscheidung falsch.
6. 🟡 **Mittel: „48 €" (4.10) gibt es auf der Seite nicht** — sehr wahrscheinlich „ab 348,00 €".
7. 🔵 **Niedrig, behoben: zwei Schwachstellen in Entwicklungsabhängigkeiten** (sharp, smol-toml) → 0.
8. 🔵 **Niedrig, offen: Node-Version** — Projekt verlangt 24.x, lokal 25.2.1. Build läuft, Vercel baut
   mit 24; lokal könnte `nvm use 24` Abweichungen ausschließen.

**Optimierungsplan:** Findings 1, 3, 4, 5, 6 sind Kundenrückfragen und stehen gebündelt in
`docs/backlog/schleife-4.md` („Rückfragen an André"); die Umsetzung folgt als eigenes Paket.
Finding 8 als Hinweis in `docs/backlog/tasks/2026-09-10-abgleich-optimierung-tasks.md`, Phase 3.
