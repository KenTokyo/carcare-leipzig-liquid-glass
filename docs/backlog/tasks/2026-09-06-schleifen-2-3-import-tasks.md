# Import Schleife 2 und 3 aus der Kundenliste

**Angelegt:** 2026-09-06
**Auslöser:** André/Oalab hat die vollständige Aufgabenliste als CSV geliefert
(`docs/backlog/quelle/2026-09-06-alle-schleifen.csv`, 103 Einträge, alle drei Schleifen).
> **Nachtrag 2026-09-06:** Die Umbenennung auf `R1`–`R12` ist **ausgeführt**.
> Wo unten noch von „3.33" u. Ä. als Repo-Befund die Rede ist, heißt das heute `R5`.
> Zuordnungstabelle: `docs/backlog/offene-punkte-konsolidiert.md`

**Vorgeschichte:** `docs/backlog/offene-punkte-konsolidiert.md` hatte festgehalten, dass
Schleife 2 und 3 im Repository fehlen und dass die Nummern R4–R12 repo-lokal vergeben
wurden — mit unbekanntem Kollisionsrisiko. Die CSV löst genau das auf.

---

### ✅ Phase 1 — Nummernsystem rekonstruieren und beweisen
**Ziel:** Die CSV trägt keine Nummern. Vor dem Schreiben musste bewiesen sein, welcher
Eintrag welche Backlog-Nummer ist — geraten wäre schlimmer als gar nicht importiert.

* [x] CSV-Struktur analysiert: `Bereich, Aufgabe, Verantwortlich, Status, Relevanz`.
      Sortiert nach `Relevanz` absteigend (3. Schleife → 2. → 1. → „Nicht relevant"),
      innerhalb dessen nach Bereich.
* [x] **Regel gefunden:** Innerhalb jedes Schleifen-Blocks läuft die CSV **rückwärts**
      zur Backlog-Nummerierung. Die letzte Zeile eines Blocks ist `x.1`, die erste die
      höchste Nummer.
* [x] **Formel:** `Nr. = (letzte Zeile des Blocks) − (Zeile) + 1`
* [x] Blockgrenzen bestimmt: 1. Schleife = Zeilen 66–91 (26 Punkte, 1.1–1.26) ·
      2. Schleife = Zeilen 39–65 (27 Punkte, 2.1–2.27) ·
      3. Schleife = Zeilen 2–38 (37 Punkte, 3.1–R9) ·
      „Nicht relevant" = Zeilen 92–104 (13 Punkte, ohne Nummer)
* [x] **Gegen das Repo verifiziert, nicht nur plausibilisiert.** `schleife-1.md` führt
      1.1–1.26 bereits aus. Alle 26 Ableitungen stimmen mit der bestehenden Datei überein
      — u. a. 1.14 (Layout vereinheitlichen), 1.15 (jede Leistung erklären),
      1.17 (eigenes Formular ins Postfach), 1.21 (Positionskarten), 1.26 (Benefits).
* [x] **Beide bisher toten Verweise aufgelöst — exakter Treffer:**
      **2.26** = Zeile 40 = „Liste aller Sonder-/Zusatzleistungen Aufbereitung … per Mail".
      Deckt sich wortgenau mit dem Verweis in `schleife-1.md`
      („1.18 hängt zudem an der Zulieferung der Zusatzleistungsliste durch André (2.26)").
      **3.17** = Zeile 22 = „Formularbau zum Schluss, nachdem alle Inhalte stehen".
      Deckt sich wortgenau mit „André hat im Review festgelegt, dass der Formularbau
      zuletzt erfolgt (Punkt 3.17)".
* [x] Gegenprobe: Alle übrigen 2.x-/3.x-Treffer in `docs/` sind **Fehltreffer** —
      Versionsnummern (`lenis@1.3.25`), CSS-Werte (`2.25rem`), Seitenverhältnis
      (`2.33:1`) und Verweise auf **Abschnitte** in `SEO-GEO-STANDARDS.md` (§2.1, §3.2).

**Referenzen:**
`docs/backlog/quelle/2026-09-06-alle-schleifen.csv`
`docs/backlog/schleife-1.md`

---

### ✅ Phase 2 — `schleife-2.md` erzeugt
**Ziel:** 27 Punkte in der Form von `schleife-1.md` ablegen, nach Bereich gruppiert.

* [x] `docs/backlog/schleife-2.md` angelegt, 2.1–2.27, Wortlaut **unverändert** aus der CSV
* [x] Spalten `Verantwortlich` und `Status` aus der Quelle übernommen
* [x] Abgleich gegen den Ist-Stand ergänzt: Was Schleife 1 bereits miterledigt hat
* [x] Unauflösbare Fremdverweise („Nr. 78") als solche gekennzeichnet, **nicht geraten**

**Referenzen:**
`docs/backlog/schleife-2.md`

---

### ✅ Phase 3 — `schleife-3.md` erzeugt
**Ziel:** 37 Punkte, gleiche Form.

* [x] `docs/backlog/schleife-3.md` angelegt, 3.1–R9, Wortlaut unverändert
* [x] Sechs „Offene Fragen" (R4–R9) als eigener Block — sie blockieren Umsetzung
* [x] Neun Foto-/Freigabe-Bringschulden (3.23–3.31) gebündelt
* [x] Abgleich gegen den Ist-Stand ergänzt

**Referenzen:**
`docs/backlog/schleife-3.md`

---

### ✅ Phase 4 — „Nicht relevant" abgelegt
**Ziel:** Die 13 Einträge ohne Schleifenzuordnung nicht verlieren. Mehrere sind
abgenommene Entscheidungen, die den Code erklären (z. B. „Expertise-Block bleibt").

* [x] `docs/backlog/nicht-relevant.md` angelegt, 13 Einträge, ohne Nummern
* [x] Kenntlich gemacht, dass diese Einträge **keine** Backlog-Nummer tragen

**Referenzen:**
`docs/backlog/nicht-relevant.md`

---

### ✅ Phase 5 — Nummernkollision belegt
**Ziel:** Der in `offene-punkte-konsolidiert.md` vermutete Konflikt ist jetzt messbar.
Nicht raten, sondern auszählen.

* [x] Gegenüberstellung erzeugt: echte Nummer (Kunde) vs. repo-lokal vergebene Nummer
* [x] **5 harte Kollisionen** gefunden: die damaligen 3.33 bis 3.37
      (heißen seit der Umbenennung R5 bis R9)
* [x] **1 Beinahe-Treffer:** das damalige 3.32 (heute R4) meint auf beiden Seiten die Ausbildungsfrage
* [x] **6 Nummern außerhalb des echten Raums:** die damaligen 1.27–1.29 und 3.38–3.40
      (heute R1–R3 und R10–R12)
      (Schleife 1 endet bei 1.26, Schleife 3 bei 3.37)
* [x] Kollisionstabelle in `offene-punkte-konsolidiert.md` eingesetzt, der bisherige
      Abschnitt „Die Nummerierung ist auseinandergelaufen" ersetzt
* [ ] **Umbenennung noch nicht ausgeführt** — bewusster Stopp-Punkt, siehe unten

**Referenzen:**
`docs/backlog/offene-punkte-konsolidiert.md`

---

### ✅ Phase 6 — Auffindbarkeit
**Ziel:** Von überall wiederfindbar, nicht nur von jemandem, der den Pfad kennt.

* [x] `docs/backlog/README.md` als Einstiegspunkt — verlinkt alle vier Listen, die Quelle
      und die Konsolidierung, mit Zahlen je Liste
* [x] `CLAUDE.md` zeigt auf das README statt nur auf `schleife-1.md`
* [x] Quell-CSV unverändert im Repository abgelegt
* [x] Nach `origin/main` gepusht — damit über GitHub von jedem Gerät erreichbar

**Referenzen:**
`docs/backlog/README.md`
`CLAUDE.md`

---

## Kommentare

### Phase 1–6
**Eingehalten:** Nummernableitung bewiesen statt geraten (26 unabhängige Gegenproben) ✅,
beide toten Verweise wortgenau aufgelöst ✅, Wortlaut der Quelle unverändert ✅,
Quelle mit abgelegt ✅, unter 700 Zeilen je Datei ✅, kein Mojibake ✅,
unauflösbare Fremdverweise als unauflösbar gekennzeichnet statt erfunden ✅.

**Auffälligkeiten/Kritische Findings (nach Schwere):**

1. 🔴 **Kritisch: Fünf Nummern sind doppelt belegt — und zwei davon stehen in der
   Kundenkommunikation.** Die Übergabe nennt **R5** (Impressumsangaben) und
   **R6** (Datenschutzerklärung) als Livegang-Blocker für André. In Andrés eigener
   Liste bedeuten dieselben Nummern **„Bilder-Upload im Formular"** und
   **„reparatur.info / PDR Cloud: wird das aktiv genutzt?"**. Wer die Nummer
   nachschlägt, findet die falsche Aufgabe — bei genau den zwei Punkten, die den
   Livegang blockieren. Behebung ist Phase 7, siehe Optimierungsplan.

2. 🟠 **Hoch: 2.23 widerspricht einer bereits getroffenen Umsetzungsentscheidung.**
   Der Review verlangt „Unfallinstandsetzung → Weiterleitung zu PDR Cloud /
   reparatur.info-Link (kein eigenes Formular)". Umgesetzt wurde am 2026-09-05 das
   Gegenteil: ein vollwertiges Schadenformular im Haus (R8 repo-lokal), mit
   reparatur.info ausdrücklich nur als „spätere Option". Zusätzlich hängt 2.23 an der
   offenen Kundenfrage 3.34: Wird reparatur.info überhaupt genutzt? Das ist
   keine Nachlässigkeit, sondern eine Entscheidung, die jemand bestätigen muss.

3. 🟠 **Hoch: Sechs sichtbare Aufgaben waren dem Projekt bisher unbekannt.**
   Sie stehen in Schleife 2/3 und in keiner Repo-Datei — u. a. 3.7 (fertig
   ausformulierter Ersatztext für „Alle Marken"), 2.17 („Karosseriearbeiten" →
   „Karosserie- und Lackierarbeiten"), 2.19 (vier konkrete „Mehr erfahren"-Ziele,
   davon zwei neu anzulegende Wissensbeiträge). Alle drei sind ohne Zulieferung
   umsetzbar und kosten je wenige Minuten.

4. 🟡 **Mittel: 3.5 ist nur halb erledigt.** Verlangt ist ein schaltbarer
   „Jetzt bewerben"-Banner. `STELLEN_POPUP_AKTIV` schaltet das **Popup**
   (`data/jobs.ts:206`); `components/JobBanner.tsx` hat keinen Schalter und blendet
   sich nur aus, wenn die Stellenzahl auf null fällt. Ein Schalter fehlt.

5. 🟡 **Mittel: 2.25 ist auslegungsbedürftig.** Verlangt ist, „laufende Zusammenarbeit"
   zu streichen. Die fünf Optionen stimmen exakt, aber Option 4 heißt
   `Rahmenvertrag / laufende Zusammenarbeit` (`GeschaeftskundenFelder.tsx:45`) — der
   Begriff ist zusammengeführt, nicht entfernt. Vermutlich im Sinne des Reviews,
   aber wörtlich nicht erfüllt.

6. 🟡 **Mittel: R2 ist eine Dopplung.** Der repo-lokal vergebene Punkt R2
   („eigene Motive für Leasingrückgabe und Außenaufbereitung") deckt sich inhaltlich
   mit dem echten **2.14** („Leasingrückgabe braucht ein eigenes Bild") und
   **2.15/3.29** (Innenaufbereitung: kein Transporter). Beim Zusammenführen als ein
   Punkt führen, sonst wird dieselbe Lieferung zweimal angefordert.

7. 🔵 **Niedrig: Drei Fremdverweise bleiben unauflösbar.** 3.16 verweist auf „Nr. 78",
   R6 auf „Nr. 66 und 103". Diese Zahlen gehören zu einer globalen Durchnummerierung
   der Originalliste, die sich aus der CSV **nicht** rekonstruieren lässt — die Datei
   ist nach Relevanz umsortiert. Sie sind im Wortlaut belassen und als unauflösbar
   markiert; die naheliegende inhaltliche Lesart steht als solche gekennzeichnet daneben.

**Refactoring-/Optimierungsplan:** `docs/backlog/tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`
