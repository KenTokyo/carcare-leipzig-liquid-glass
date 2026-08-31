# Paket A — Globale Text- und Namenskorrekturen (Backlog 1.1 – 1.4)

Branch: `paket-a/textkorrekturen`
Quelle: `docs/backlog/schleife-1.md`, Paket A
Vorgaben des Users in dieser Session:

1. Relative Altersangaben („über 30 Jahre") werden **nicht** durch eine neue
   relative Angabe ersetzt, sondern durch **„seit 1998"**. Relative Angaben
   veralten. Wo der Satzbau eine Dauer erzwingt, wird der **Satz umformuliert**,
   statt eine neue Zahl zu setzen.
2. `SEO-GEO-STANDARDS.md` wird mitkorrigiert. Solange dort „1993" und „3.000 qm"
   stehen, entsteht der Fehler bei jeder künftigen Content-Aufgabe neu.
3. Bei 1.2 zusätzlich „qm" → „m²" vereinheitlichen und „über" ergänzen,
   auch in `seo/pageSchemas.ts`.

---

### ✅ Phase 1 — 1.1 Jahreszahl: „seit 1993" / „über 30 Jahre" → „seit 1998"
**Ziel:** Eine einzige, nicht veraltende Gründungsangabe auf der gesamten Site
und in der Regeldatei, die künftige Inhalte speist.

* [x] `components/HeroSection.tsx:24` — Vertrauensmerkmal „Meisterbetrieb": seit 1993 → seit 1998
* [x] `pages/AutolackierungPage.tsx:21` — Kartentitel + Beschreibung („über 30 Jahren Erfahrung am Markt" → „am Markt seit 1998")
* [x] `pages/AutolackierungPage.tsx:44` — SectionIntro „seit über 30 Jahren" → „seit 1998"
* [x] `pages/SmartRepairPage.tsx:19` + `:42` — identisches Muster
* [x] `pages/DellenentfernungPage.tsx:20` — „Über 30 Jahre Erfahrung im Kfz-Handwerk" → „Erfahrung im Kfz-Handwerk seit 1998" (Satz umformuliert, keine Ersatzzahl)
* [x] `pages/FelgenreparaturPage.tsx:21` — dito, Kfz-Lackier- und Karosseriehandwerk
* [x] `pages/HagelschadenreparaturPage.tsx:21` — dito, „Schäden aller Art"
* [x] `pages/PrivatkundenPage.tsx:47` + `:162` — seit 1993 → seit 1998
* [x] `pages/ServicesPage.tsx:54` — PageHero: seit 1993 → seit 1998
* [x] `SEO-GEO-STANDARDS.md:21` (USP_ERWEITERT) — „Seit über 30 Jahren" → „Seit 1998"
* [x] `SEO-GEO-STANDARDS.md:24` (USP_BAUSTEINE) — „über 30 Jahre am Markt (seit 1993)" → „seit 1998 am Markt"
* [x] Bewusst **nicht** angefasst: 9 Stellen „30 Jahre Garantie" (WINTEC-Autoglas)
      in `data/services.ts:133`, `pages/AccidentRepairPage.tsx:53`,
      `pages/AutoglasPage.tsx:12/18/26/43`, `pages/BusinessCustomersPage.tsx:61`,
      `pages/PrivatkundenPage.tsx:89`, `seo/pageSchemas.ts:117/191`.
      Dort ist „30 Jahre" die Garantiedauer, nicht das Betriebsalter.
* [x] Bewusst **nicht** angefasst: `components/Hero.tsx:36` („Seit 2010").
      Toter Code, User-Vorgabe: nicht korrigieren, nicht löschen → Optimierungsplan.

**Referenzen:**
`pages/AutolackierungPage.tsx`
`pages/SmartRepairPage.tsx`
`SEO-GEO-STANDARDS.md`

---

### ✅ Phase 2 — 1.2 Flächenangabe: einheitlich „über 3.000 m²"
**Ziel:** Eine Schreibweise für die Betriebsfläche — Einheit `m²` statt `qm`,
immer mit „über", auch in den strukturierten Daten.

* [x] Nur „über" ergänzt (Einheit war bereits korrekt): `pages/AutoglasPage.tsx:14`,
      `AutolackierungPage.tsx:22`, `DellenentfernungPage.tsx:21`,
      `FelgenreparaturPage.tsx:22`, `FuhrparkservicePage.tsx:18`,
      `SmartRepairPage.tsx:20`, `components/TargetGroupCards.tsx:96`
* [x] „qm" → „m²" **und** „über" ergänzt: `pages/BusinessCustomersPage.tsx:67/102/143`,
      `pages/PrivatkundenPage.tsx:19`, `pages/ServicesPage.tsx:22/54`,
      `pages/VehicleDetailingPage.tsx:89`
* [x] `seo/pageSchemas.ts:18` + `:71` wortgleich nachgezogen — Schema darf nur
      auszeichnen, was sichtbar auf der Seite steht (SEO-GEO §5)
* [x] `SEO-GEO-STANDARDS.md:21` + `:25` — „3.000 qm" → „über 3.000 m²"

**Referenzen:**
`pages/BusinessCustomersPage.tsx`
`seo/pageSchemas.ts`
`SEO-GEO-STANDARDS.md`

---

### ⬜ Phase 3 — 1.3 „CarCare" allein ersetzen
**Ziel:** Durchgehend „CarCare Center" oder „wir"; Falschschreibweisen
(Kcare, KCare, K-Care, Kare, KKR) mit korrigieren. Kein Suchen-und-Ersetzen —
pro Fundstelle wird entschieden, ob der Name oder „wir" besser passt.

* [ ] Bestandsaufnahme aller Fundstellen „CarCare" ohne „Center"
* [ ] Falschschreibweisen suchen und korrigieren
* [ ] Titles/Meta-Descriptions gesondert prüfen (Zeichenlimit 50–60 / 140–160)

---

### ⬜ Phase 4 — 1.4 Dritte Person → erste Person Plural
**Ziel:** Eigenperspektive durchgehend „wir", Kundenansprache bleibt „Sie".
Vollständige Umformulierung inkl. Verbform, Possessivpronomen und Satzbau.

* [ ] Bestandsaufnahme aller Sätze in der 3. Person
* [ ] Satzweise umformulieren (gemeinsam mit 1.3, nicht in zwei Durchläufen)
* [ ] Ausnahme prüfen: Hero und strukturierte Daten dürfen den Firmennamen behalten

---

## Kommentare

### Phase 1
**Eingehalten**: Planungsvalidierung vor Code ✅, unter 700 Zeilen je Datei ✅,
Encoding UTF-8 ohne Mojibake ✅, Textregel Gründungsjahr (CLAUDE.md Nr. 3) ✅,
Garantieangaben vom Betriebsalter unterschieden ✅, keine relativen Altersangaben ✅

**Auffälligkeiten/Kritische Findings (nach Schwere):**
1. 🔴 **Kritisch:** FAQ-Antworten sind doppelt gepflegt — `seo/pageSchemas.ts:18/71`
   hält wortgleiche Kopien der sichtbaren Texte aus `pages/ServicesPage.tsx:22`
   und `pages/BusinessCustomersPage.tsx:102`. Läuft der Wortlaut auseinander,
   zeichnet das Schema Inhalte aus, die so nicht auf der Seite stehen
   (SEO-GEO §5: „Nur auszeichnen, was sichtbar ist"). Genau dieser Backlog-Punkt
   hat die Divergenz erzeugt.
2. 🟠 **Hoch:** `components/Hero.tsx` ist toter Code (kein Import, Unsplash-Hotlink,
   Jahreszahl 2010).
3. 🟡 **Mittel:** Kartentitel und Kartenbeschreibung tragen auf fünf Serviceseiten
   jetzt beide „seit 1998" (Titel „Meisterbetrieb seit 1998" + Beschreibung).
   Inhaltlich korrekt, sprachlich redundant.
4. 🟡 **Mittel:** 16 von 17 `PageMeta`-Descriptions liegen außerhalb der
   SEO-GEO-Vorgabe von 140–160 Zeichen (Spanne 67–180).

→ Alle vier in `2026-09-01-paket-a-optimierung-tasks.md` aufgenommen.

### Phase 2
**Eingehalten**: Einheit `m²` durchgehend ✅, „über" ergänzt ✅,
Schema wortgleich mit sichtbarem Inhalt ✅, Regeldatei mitkorrigiert ✅

**Auffälligkeiten:** keine neuen über Phase 1 hinaus.
