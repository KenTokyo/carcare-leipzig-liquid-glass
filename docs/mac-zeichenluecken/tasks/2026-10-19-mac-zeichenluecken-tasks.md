# Zeichenlücken am Akkordeon der Startseite (MacBook) — R31

**Anlass (User, 2026-10-19, Bildschirmaufnahme vom MacBook Pro 13", M5):** Auf der Vercel-Seite (`main`) sieht die
Startseite „komplett zerschossen“ aus, sobald man Richtung Akkordeon scrollt, und „lädt nicht sauber“. Entfernt man
sich vom Akkordeon, ist wieder alles normal. Auf dem Windows-Rechner, an dem zuletzt gearbeitet wurde, war nichts zu sehen.

**Nummer:** R31 (eigener Befund; höchste vergebene R-Nummer war R30). Keine Kundennummer.

**Status:** umgesetzt 2026-10-19, nicht committet. Offen: Safari-Sichtprüfung (R31-a), Windows-Gegenprobe (R31-b).

---

### ✅ Phase 1 — Reproduktion und Ursache
**Ziel:** Den Fehler auf dem Mac selbst sehen und den Verursacher eingrenzen, bevor etwas geändert wird.
* [x] Bildschirmaufnahme: von macOS gesperrt (Fotos-Zwischenablage, `Operation not permitted` auch außerhalb der
      Sandbox). Stattdessen selbst reproduziert.
* [x] In-App-Browser: zeigte die Lücken, lief aber verborgen (11 Bilder/s) — als Beleg verworfen
      (Memory `layoutpruefung-headless-statt-pane`).
* [x] **Echtes Chrome 155 auf dem Mac, sichtbares Fenster, Retina, Trackpad-artiges Scrollen:** am Akkordeon fehlen
      ganze Kacheln des Seiteninhalts. Weiße Rechtecke, dazwischen scheint die **fixierte Fußzeile** (dunkles Foto)
      durch. Das ist kein Layoutfehler, sondern ein Zeichenfehler (Kacheln werden nicht gerastert).
* [x] **Ausschlussverfahren** (je Versuch frisch geladen, eine CSS-Regel eingespielt):
      | Versuch | Ergebnis |
      |---|---|
      | Basis (2×) | kaputt |
      | alle Glas-Elemente `.cc-liquid` weg | **sauber** |
      | nur die Plaketten im Akkordeon weg | **sauber** |
      | Plaketten im Akkordeon ohne `backdrop-filter` | **sauber** |
      | nur die Plaketten der **eingeklappten** Karten weg | **sauber** |
      | Plaketten der eingeklappten Karten `visibility: hidden` | **sauber** |
      | Lichtkante (Maske) der Plaketten weg | kaputt |
      | alle Glas-Elemente außerhalb des Akkordeons weg | kaputt |
      | Kartenbilder / Fotohintergrund / Kartenschatten / Schleier / KI-Marke / senkrechte Titel / `transform` am `main` weg | kaputt oder nur teilweise besser |
* [x] **Verursacher:** die Care/Repair-Plaketten (`BereichsPlakette`, Liquid Glass mit `backdrop-filter: blur(20px)`)
      der **zwölf eingeklappten Karten**. Sie sind unsichtbar (`opacity: 0`), Chrome behandelt jede trotzdem als eigene
      Grafikebene (Grund `BackdropFilter`). Hinter jeder solchen Ebene zerlegt Chrome den restlichen Seiteninhalt in
      eine weitere Ebene, und die haben jeweils die **volle Größe des Hauptbereichs**.
* [x] **Ebenenbaum gemessen** (CDP `LayerTree`, 1920 × 945, am Akkordeon): **61 Ebenen, davon 16 in Seitengröße
      (1892 × 17679 px) und 13 mit `BackdropFilter`**. Mit `visibility: hidden` an den eingeklappten Plaketten:
      **43 Ebenen, 7 in Seitengröße**. Die vielen seitengroßen Ebenen sprengen das Kachelbudget; Chrome lässt dann
      Kacheln des Hauptbereichs leer.
* [x] **Warum „nur am Mac“ — gemessen statt vermutet:**
      - Chrome 155 sichtbar mit Skalierung 1, 1,25, 1,5 und 2: **überall kaputt**. Also nicht der Retina-Faktor.
      - Mit und ohne Skia Graphite, ohne GPU (`--disable-gpu`), ohne GPU-Raster: **überall kaputt**. Also nicht der
        Grafiktreiber des Macs.
      - Unsichtbar (headless) bei 1440 × 790, 1920 × 945, 1536 × 730 (125 %), 1280 × 680: **überall kaputt**.
      - Mauszeiger auf den Karten oder am Rand: **beides kaputt**.
      - Chromium 143, 150, 152 (In-App-Browser), 155: **alle kaputt**. Kein frischer Chrome-Fehler.
      - WebKit 26 (Safari-Engine, Playwright): Bildschirmfotos sauber. Diese Fotos zeichnet WebKit aber neu, Lücken
        des Compositors zeigen sie nicht zuverlässig. Ein echtes Fensterfoto lässt macOS ohne
        Bildschirmaufnahme-Freigabe nicht zu. **Safari ist damit nicht belegt.**
      - Folgerung: Auf diesem Mac zeigt **jedes** Chromium den Fehler. Dass Windows sauber war, lässt sich hier nicht
        nachmessen (kein Windows-Rechner). Das Kachelbudget von Chrome hängt von Plattform, Grafikspeicher und Treiber
        ab; Windows mit DirectX hat in der Regel mehr Spielraum. Vermutung, nicht gemessen.
**Referenzen:**
`components/BereichsPlakette.tsx`
`components/ExpandingCardAccordion.tsx`
`styles/glas.css`

### ✅ Phase 2 — Messwerkzeug `npm run zeichnen`
**Ziel:** Zeichenlücken auf jeder Route messbar machen, mit Gegenprobe. Erst messen, dann reparieren, dann wieder messen.
* [x] `scripts/check-zeichnen.mjs` (378 Zeilen): Seitengrund und Fußzeile magenta, Grund von `main` türkis. Jede Route
      in vier Fenstern (1440 × 790 Retina, 1920 × 945, 1024 × 700 Retina, 390 × 844) mit dem Mausrad in Schritten von
      55 % der Fensterhöhe durchscrollen; je Position nach Ruhe eine Aufnahme aus dem Compositor (CDP). Magenta oder
      Türkis innerhalb des sichtbaren `main` ab 0,5 % = Lücke, an derselben Stelle nachgemessen.
* [x] Je Position der **Ebenenbaum** (CDP `LayerTree`): alle Ebenen, seitengroße (höher als drei Fenster), davon
      **Masken** (seitengroß, **ohne eigenen Grund, gleich groß**; gezählt die größte Gruppe ab 2), mit Weichzeichner.
      Hart ab 4 Masken, Hinweis ab 2. Rechnerunabhängig, anders als die Lücke selbst. Zwei Schärfungen nach Läufen:
      1. Erste Fassung zählte alle seitengroßen Ebenen (hart ab 10). Darunter sind immer `main` und der Seiten-Scroller
         sowie normale Inhaltsebenen (`Overlap`): nach dem Fix 8 Hinweise „4 seitengroße Ebenen“ ohne Befund.
      2. Zweite Fassung zählte jede grundlose seitengroße Ebene (Hinweis ab 1): 22 Hinweise „1 Maske“ auf den
         einfachsten Seiten (Impressum, Kontakt, Wissen). Das ist die Inhaltsebene des Seiten-Scrollers, die Chrome dort
         ohne Grund meldet. Echte Masken eines Beschnitts kommen im Rudel und gleich groß (16 × 1892 × 17679 px).
* [x] **Eichung** vor jedem Lauf und `--gegenprobe`: spielt den alten Fehler (Rundung am `main` + unsichtbare
      Plaketten als Ebenen) auf `/` ein. Ebenen nicht erkannt → Exit 1; Lücke auf diesem Rechner nicht sichtbar →
      kein Lückenurteil, Exit 2.
* [x] Pflichtfrage beantwortet (Kopf des Skripts, sechs Punkte: Budget hängt am Rechner, Safari nicht, Abtastung,
      nur `main`, nur Ausgangszustand, vier Fenster).
* [x] Drei Kinderkrankheiten beim Bau gefunden und behoben:
      1. Ausschnitt einen Pixel außerhalb des Bildes (`extract_area`) → auf das Bild begrenzt.
      2. Handy-Aufnahmen kommen in CSS-Pixeln, nicht in Gerätepixeln → Maßstab aus Bildbreite / Fensterbreite.
         Vorher Fehlalarm 36 % am Seitenende (die Fußzeile im Fluss lag in der Messfläche).
      3. Drei Tabs in einem Browser: Der hintere Tab lieferte ein Bild in falscher Größe (756 × 469) → Scheinlücke
         48 %. Jetzt je Messstrang ein eigener Browser mit einem Tab.
      4. Ebenenbaum blieb ohne Neuzeichnen aus (Eichung zählte 0 Ebenen) → 1-px-Fühler wechselt die Farbe.
* [x] **Basislauf gegen die Live-Seite (vor dem Fix), Startseite:**
      | Fenster | größte Lücke | seitengroße Ebenen | Weichzeichner-Ebenen |
      |---|---|---|---|
      | 1920 × 945 | **90,5 %** (y 1560, Akkordeon) | 19 | 13 |
      | 1024 × 700 Retina | **62,3 %** (y 1540) | 28 | 18 |
      | 390 × 844 | — | 36 | 21 |
      | 1440 × 790 Retina | Messung hing (Seite antwortete nicht mehr auf Eingaben) | — | — |
**Referenzen:**
`scripts/check-zeichnen.mjs`
`package.json`
`CLAUDE.md`

### ✅ Phase 3 — Fix
**Ziel:** Unsichtbare Plaketten erzeugen keine Grafikebene mehr, und der Multiplikator dahinter verschwindet.
* [x] **Fix 1, `BereichsPlakette`:** bei `sichtbar={false}` zusätzlich `visibility: hidden`. Wirkung allein
      (Startseite 1920): 19 → 11 seitengroße Ebenen, Lücke am Akkordeon weg. Vier Anläufe, bis auch
      `npm run akkordeon` („alle Animationen auf dem Compositor“) wieder grün war:
      1. CSS-Übergang `visibility 300ms`: optisch richtig, aber eine Hauptthread-Animation → akkordeon: 3 bzw. 7
         Animationen abseits des Compositors.
      2. `visibility` per Zeitgeber nach 300 ms, Einblenden zwei Bilder verzögert: noch 1 je Akkordeon, Code 131072.
         In der Chromium-Quelle (`compositor_animations.h`) ist das `kAnimationHasNoVisibleChange`.
      3. Spur ausgewertet (`--protokoll`): Es war das **Ausblenden**. Der Zeitgeber startet vor dem CSS-Übergang und
         setzte `hidden` rund 30 ms vor dessen Ende (332 statt 361 ms), Chrome rechnete den Rest im Hauptthread.
         → `hidden` erst am `transitionend` (Zeitgeber 500 ms bleibt als Rückfall): akkordeon 2 × ok.
      4. Gegenprobe zur Einblend-Verzögerung: ohne sie 3 × ok → entfernt, Code einfacher.
      Vergleich alter Code (Plakette nur `opacity`): akkordeon 2 × ok. Der vierte Anlauf ist also gleichwertig.
      Blendprüfung (finaler Build, Maus auf Karte 6): alte Plakette 0,96 → 0,33 → 0,05 in 260 ms, danach `hidden`;
      neue sofort `visible` und 0,04 → 0,67 → 0,95 → 1. Das Ausblenden sieht aus wie vorher.
* [x] **Der eigentliche Multiplikator gefunden:** Die seitengroßen Ebenen (1892 × 17679 px, ohne eigenen Grund)
      sind **Masken für die runden oberen Ecken von `main`** (`border-radius` + `overflow: clip`). Chrome wendet
      einen runden Beschnitt auf Ebenen mit Weichzeichner, Video usw. über eine eigene Maske in voller Größe des
      Beschnitts an, je Ebene eine. Gegenprobe auf der Live-Seite: `border-radius: 0` am `main` → **0** seitengroße
      Ebenen (45 statt 61 Ebenen); `overflow: visible` ebenso.
* [x] **Fix 2, `index.css` `.site-main-shell`: keine Rundung mehr.** Sichtbar war sie nur beim Laden, und genau dort
      zeichnet der feste Seitenrahmen dieselben Ecken (`.solidroad-shell-corner-tl/-tr`, gleiche Lage
      `--cc-shell-gap`, gleicher Radius `--cc-shell-radius`) über den Inhalt. Pixelvergleich der Ecken mit und ohne
      Rundung: 6 Seiten × 4 Breiten, Aufnahmen nebeneinander identisch; die gezählten Abweichungen kamen von der
      einblendenden Aussparung oben rechts und der Parallaxe im Titelbild (zweimal „mit“ weicht genauso ab).
      Der Beschnitt bleibt (horizontaler Überhang, `sticky`), ist aber rechteckig und kostet keine Maske.
* [x] Wirkung beider Fixes, Startseite (Build 16:15:31): 1920 × 945 **0 Lücke, unter 4 seitengroße Ebenen**;
      390 × 844 höchstens 4 (Hinweis). Gegenprobe erkennt den wieder eingespielten Fehler weiter (90–97 %, 19 Ebenen).
* [x] **Volllauf `npm run zeichnen`, Build 16:15:31: 29 Routen × 4 Fenster, 0 Lücken, 0 harte Befunde, Exit 0.**
      Eichung: dieser Mac zeigt den eingespielten Fehler (97,1 %), das Lückenurteil gilt. Die verbleibenden höchstens
      4 seitengroßen Ebenen sind `main` (`Trivial3DTransform`), der Seiten-Scroller (`RootScroller`) und
      Inhaltsebenen (`Overlap`, `Video`), **keine Masken** (CDP-Gründe je Ebene gelistet für `/` und `/ueber-uns`).
* [x] Build 16:59:46 (nur Kommentar in `BereichsPlakette` geändert): **JS- und CSS-Dateien bytegleich** mit
      16:15:31 (gleiche Inhalts-Hashes), der Volllauf gilt damit auch für ihn. Gegenprobe auf 16:59:46: 16 Masken und
      90,5 % Lücke erkannt, bestanden.
**Referenzen:**
`components/BereichsPlakette.tsx`
`index.css`
`scripts/check-zeichnen.mjs`

### ✅ Phase 4 — Build und alle Werkzeuge gegen den neuen Build
**Ziel:** Nach der letzten Korrektur jedes Werkzeug gegen denselben, finalen Build.
* [x] Finaler Build **17:23:45** (danach nur noch `scripts/check-zeichnen.mjs` und Doku geändert, kein ausgelieferter Code).
* [x] `npm run kontrast`: 6339 Textstellen, 29 Routen, **kein Text unter WCAG AA**.
* [x] `npm run akkordeon`: **ok**, dreimal in Folge (alle Animationen auf dem Compositor, Ruhelage, Gleiten zur Mitte,
      kein Schatten außerhalb, keine Tipp-Hervorhebung, kein Gleiten beim Darüberfahren).
* [x] `npm run mobil`: 29 Routen × 3 Fenster, **0 harte Befunde**; 257 Hinweise „Schrift unter 12 px“ wie seit dem 15.10.
* [x] `npm run cls`: 29 Routen × 4 Fenster, **0 harte Befunde, 0 Hinweise**.
* [x] `npm run aussparung`: keine dauerhafte Überdeckung, Knöpfe unversehrt, 29 Routen × 3 Fenster, Geometrie an 23 Breiten.
* [x] `npm run faq-mobil`: ok, 26 Routen mit FAQ.
* [x] `npm run zielgruppen`: alle Karten auf allen Fenstern in Ordnung.
* [x] `npm run meta`: 0 außerhalb des Korridors. `npm run tote-dateien`: keine toten Dateien.
      `gedankenstriche`, `check-faq-html`, `check-dummies`: im Build grün.
* [x] `npm run zeichnen -- --gegenprobe`: bestanden (16 Masken, 97,1 % Lücke beim eingespielten Fehler).
* [x] `npm run zeichnen` (Volllauf, Build 17:23:45, zweite Masken-Fassung): **29 Routen × 4 Fenster, 0 Lücken, 0 harte
      Befunde, 22 Hinweise „1 Maske“** (siehe Phase 2, Schärfung 2). Ergebnis der dritten Fassung: siehe nächste Zeile.
* [x] `npm run zeichnen` (Volllauf, dritte Masken-Fassung, Build 17:23:45): **29 Routen × 4 Fenster, 0 Lücken, 0 harte
      Befunde, 0 Hinweise, Exit 0.** Eichung: 97,1 % Lücke und 16 Masken beim eingespielten Fehler, das Urteil gilt.

### ✅ Phase 5 — Doku
* [x] `CLAUDE.md`: Zeile `npm run zeichnen` in den Messwerkzeugen; Umsetzungsprinzip „Kein runder Beschnitt um große
      Behälter, unsichtbares Glas zusätzlich `visibility: hidden`“.
* [x] `package.json`: Skript `zeichnen`.
* [x] Optimierungsplan: `2026-10-19-mac-zeichenluecken-optimierung-tasks.md` (R31-a bis R31-e).
* [x] Memory: Anhänge aus der Fotos-App sind für Werkzeuge gesperrt (`anhaenge-aus-fotos-gesperrt`).

---

## Kommentare

### Phase 1
**Eingehalten:** messen statt schätzen ✅, verborgenen In-App-Browser als Beleg verworfen ✅, Ausschlussverfahren je
Versuch frisch geladen ✅, Gegentests für „nur Mac“ (Skalierung, GPU, Graphite, Fenster, Version, Maus) ✅, Safari
ehrlich als nicht belegt markiert ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Kein Werkzeug sah den Fehler. Alle maßen DOM, Layout oder neu gezeichnete Aufnahmen; die Lücke stand
   nur in der Ausgabe des Compositors. → behoben mit `npm run zeichnen` (Phase 2).
2. 🟡 **Mittel:** „Nur am Mac“ ist nicht erklärt. Auf dem Mac zeigt jedes Chromium den Fehler, Windows ist ungemessen
   (R31-b).

### Phase 2
**Eingehalten:** unter 700 Zeilen ✅ (399), Pflichtfrage im Kopf beantwortet ✅, Gegenprobe mit Exit 2 statt Scheingrün ✅,
Eichung vor jedem Lauf ✅, Muster der anderen Werkzeuge (Preview, Routenliste, Bericht unter `output/`) ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (behoben):** Hintergrund-Tab lieferte falsch große Aufnahmen → Scheinlücke 48 %. Eigener Browser je Strang.
2. 🟡 **Mittel (behoben):** Handy-Aufnahmen in CSS-Pixeln → Fehlalarm 36 %. Maßstab aus dem Bild.
3. 🟡 **Mittel (behoben):** Kennzahl zweimal geschärft (alle großen Ebenen → grundlose → grundlose gleich große).
4. 🟢 **Niedrig:** Volllauf rund 25 bis 30 min (R31-c).

### Phase 3
**Eingehalten:** Ursache statt Symptom (runder Beschnitt als Multiplikator gefunden) ✅, Optik pixelgenau gegengeprüft ✅,
keine Inhalte entfernt ✅, Blende unverändert (gemessen) ✅, CSS vor JavaScript wo möglich ✅ (Ecken), Kommentare mit
Begründung und Messwert ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (behoben):** Erster Blend-Ansatz (`visibility`-Übergang) verletzte die Compositor-Regel; gefunden von
   `npm run akkordeon`, erst der vierte Anlauf war gleichwertig zum alten Code.
2. 🟢 **Niedrig:** Die Plakette braucht jetzt einen kleinen Hook (`useBlende`) statt reiner Inline-Werte.

### Phase 4 und 5
**Eingehalten:** nach jeder Korrektur alle Werkzeuge gegen den neuen Build ✅, Ergebnisse mit Build-Zeit belegt ✅.
**Auffälligkeiten:** keine neuen.
