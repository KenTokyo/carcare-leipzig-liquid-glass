# Schleife 4 — Sofortpaket (8 Punkte)

**Angelegt:** 2026-09-11 · **Branch:** `2026-09-10-schleife-4-sofortpaket`
**Auftrag (User):** „ja setze die 8 punkte sofort um" — die als „sofort machbar" eingestuften Punkte aus
`docs/backlog/schleife-4.md`: 4.5, 4.6, 4.11, 4.12, 4.15, 4.16, 4.17, 4.20.
**Nicht in diesem Paket** (warten auf Antwort): 4.2/4.18 (3.500 m²), 4.19 (Jahr), 4.21 (Paketnamen), Preise.

## Umsetzungsentscheidung zu 4.11 (vor dem Code geprüft)

An 8 von 14 Fundstellen hängt „seit 1998" direkt an der Meister-Bezeichnung. Drei Wege:

1. **Wörtlich ersetzen** → „Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk seit 1998". Behauptet
   den Karosseriebau-Meister seit 1998 — laut Andrés eigener Chronik (4.18) kam die Karosserie 2013 dazu.
   Macht die offene Frage R13 schlimmer statt neutral. **Verworfen.**
2. **Nur Stellen ohne Jahr ändern** → zwei Bezeichnungen nebeneinander auf der Seite. **Verworfen.**
3. **Bezeichnung ersetzen, das Jahr an die Firma hängen:** „…, seit 1998 am Markt". Das ist der
   **ursprüngliche USP-Baustein des Kunden** (`SEO-GEO-STANDARDS.md`, Abschnitt 0). Stimmt unabhängig davon,
   wie R13 beantwortet wird. „Meisterbetrieb" (Textregel 5) und 1998 (Textregel 3) bleiben überall erhalten.
   **Gewählt.**

Die Kartentitel „Meisterbetrieb seit 1998" und die Startseiten-Subline tragen die Bezeichnung nicht — sie
bleiben bis zur Antwort auf R13 unverändert.

---

### ✅ Phase 1 — Pakettexte (4.5, 4.6)
* [x] 4.5 „schonende Handoberwäsche": Paket, Leistungskarte `/aussenaufbereitung-leipzig`, FAQ,
      Leistungskatalog, Service-Schema (6 Stellen)
* [x] 4.6 „Schonende Oberwäsche" + Teppichreinigung: Paket, `Offer`-Schema, FAQ, Innenaufbereitungsseite
      (in die Karte „Innenraum komplett" statt als sechste Karte — Raster bleibt), Leistungskatalog, Service-Schema
**Referenzen:**
`data/detailing.ts`
`data/faqs.ts`
`seo/pageSchemas.ts`

### ✅ Phase 2 — Bezeichnungen (4.11, 4.12)
* [x] 4.11 an allen 14 Stellen nach Entscheidung 3; Impressum als „Betrieb" (bewusst nicht „Berufs-
      bezeichnung" — das sähe nach erfüllter § 5-Pflichtangabe aus), TODO für R5 fortgeschrieben;
      USP-Baustein in `SEO-GEO-STANDARDS.md`; Hero-Abzeichen ohne Jahr (1998 steht in der Subline darüber)
* [x] 4.12 „Instandsetzung statt Tauschen" an allen 6 Stellen
**Referenzen:**
`pages/UeberUnsPage.tsx`
`components/HeroSection.tsx`
`pages/ImpressumPage.tsx`

### ✅ Phase 3 — Über uns (4.15, 4.16, 4.17, 4.20)
* [x] 4.15 Überschrift „Von der Fahrzeugaufbereitung zum Full-Service-Betrieb."
* [x] 4.16/4.17/4.20 Zeitstrahl: 1998 im Kundenwortlaut, 2000 und 2026 als echte Stationen, „Heute" bleibt;
      Meilenstein 2/3 bleiben markierte Platzhalter; `Meilenstein 1` aus `ANERKANNT` (11 → 10 anerkannte)
* [x] **Folgefehler gefunden und behoben:** sechs Stationen + längere Texte sprengten den Zeitstrahl
      (siehe Finding 1) → Komponente umgebaut: Höhe aus dem Inhalt (`1fr | 0 | 1fr`), waagerecht ab `xl`,
      darunter senkrecht mit `max-w-3xl`, Silbentrennung in den Karten
**Referenzen:**
`components/Timeline.tsx`
`data/historie.ts`
`scripts/check-dummies.mjs`

### ✅ Phase 4 — Nachweis
* [x] Quellcode: 0 Reste der alten Formulierungen; neue Bezeichnung 14×, „Instandsetzung statt Tauschen" 7×
* [x] `tsc --noEmit` sauber; `npm run build` grün (29/29, alle Wächter); `npm run meta` 0 von 29
* [x] **Echtes Rendering** (Puppeteer headless über `vite preview`, Animationen laufen): Zeitstrahl bei 390,
      768, 1024, 1280, 1440, 1920 px — keine Karte außerhalb, Punkte auf der Achse, Stichleitungen treffen,
      kein seitlicher Überlauf. Neue Formulierungen auf 9 Seiten (390 + 1280 px): kein Textüberlauf
* [x] Bildschirmfotos gesichtet (1280, 1440, 390, Hero 390/1280)
* [x] `npm run kontrast -- /ueber-uns` (167 Stellen) und `-- /` (152 Stellen): 0 unter AA
* [x] Backlog nachgezogen: `schleife-4.md` (8 × umgesetzt, R13 fortgeschrieben), R1, Konsolidat

---

## Kommentare

### Phasen 1–4
**Eingehalten:** eigener Branch ✅, Kundenwortlaut unverändert übernommen ✅, sichtbarer Text und
strukturierte Daten gleichgezogen ✅, nichts entfernt (Heute-Station, „alternativ Lederpflege",
1998 im Hero bleiben) ✅, Textregeln 1–5 ✅, Mobile-First geprüft ✅, gemessen statt geschätzt (Layout,
Kontrast, Meta) ✅, Dev-Server nur neu gestartet, weil die App ihn beendet hatte und der Port frei war ✅,
unter 700 Zeilen ✅, kein Mojibake ✅, nicht committet ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🔴 **Kritisch, behoben: Der Zeitstrahl brach mit den gelieferten Texten.** Feste Höhe `26rem`, Karten
   absolut darüber/darunter. Gemessen bei 1280px: 1998-Karte 133px nach oben in die Überschrift, „Heute"
   139px in die nächste Sektion; bei 1024px je über 220px, dazu seitlich bis 27px in die Nachbarkarte.
   **Build, Wächter und Kontrastmesser waren grün** — keiner misst Layoutüberlauf. Auch der alte Aufbau
   hielt nur, weil er das Innenpolster der Sektion mitbenutzte.
2. 🟠 **Hoch, vermieden: 4.11 wörtlich hätte eine neue Falschaussage erzeugt** („Karosseriebau-Meister
   seit 1998"). Lösung über den ursprünglichen USP-Baustein, unabhängig von der Antwort auf R13.
3. 🟠 **Hoch, offen (André): R13 steht noch an 11 Stellen** — Kartentitel, Subline, zwei Meta-Descriptions,
   Kennzahlkarte. Nicht angefasst, bis André antwortet.
4. 🟡 **Mittel, Werkzeugbefund: Das In-App-Browserfenster war verborgen** — `document.hidden`, 0
   Animationsframes/s. Framer-Animationen laufen dort nie; Messungen zeigten `opacity 0` und 14px Versatz.
   Layoutprüfung deshalb headless per Puppeteer. Wer im verborgenen Fenster misst, misst den Startzustand.
5. 🔵 **Niedrig: Impressum** trägt jetzt die Betriebsbezeichnung; die Pflichtangaben nach § 5 DDG (Kammer,
   Meistertitel, Staat, Regelung) fehlen weiter (R5).

**Optimierungsplan:**
* [ ] **Layout-Wächter erwägen** (Finding 1): ein Prüfskript, das an Sektionsgrenzen misst, ob Karten ihren
      Container verlassen oder Text überläuft — wie das Prüfskript dieser Sitzung, als `npm run layout`.
      Vor dem Bau die Pflichtfrage beantworten: Es besteht, wenn eine Animation beim Messen noch läuft
      (deshalb durchscrollen und warten), und es sieht nur die Breiten, die es misst.
* [ ] R13 und die übrigen Rückfragen gebündelt an André (`schleife-4.md`, „Rückfragen an André").
