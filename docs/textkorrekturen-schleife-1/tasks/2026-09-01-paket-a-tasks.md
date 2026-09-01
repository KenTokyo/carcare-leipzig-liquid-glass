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

### ✅ Phase 3 + 4 — 1.3 Namensschreibweise und 1.4 erste Person Plural
**Ziel:** „CarCare" steht nirgends mehr allein; alle Aussagesätze über den eigenen
Betrieb stehen in der ersten Person Plural. Kundenansprache bleibt „Sie".
1.3 und 1.4 greifen in denselben Satz und wurden gemeinsam bearbeitet — ein Satz,
eine Änderung, kein Suchen-und-Ersetzen.

**Ordnungsprinzip (aus CLAUDE.md abgeleitet):** Der Firmenname darf stehen, aber
nie als Subjekt eines Verbs in der dritten Person. `CLAUDE.md` führt „CarCare Center
kümmert sich um Ihr Fahrzeug" ausdrücklich als falsch auf — die SEO-Ausnahme rettet
den Namen, nicht die dritte Person.

* [x] Bestandsaufnahme aller 164 Fundstellen, Review-Datei mit fertigem Zielsatz
      je Stelle erstellt und vom User freigegeben
* [x] Falschschreibweisen (Kcare, KCare, K-Care, Kare, KKR) gesucht — **null Treffer**
* [x] Dritte Person ohne Markennamen („Das Unternehmen", „Der Betrieb", „In seinem
      Betrieb") gesucht — **null Treffer**, 1.4 deckt sich vollständig mit 1.3
* [x] Fall A (28): nominale Positionen, „Center" ergänzt
* [x] Fall B (57): Aussagesätze vollständig umformuliert, inkl. Verbform,
      Possessivpronomen und Satzbau
* [x] Fall C (20 × 2): FAQ-Fragen auf „das CarCare Center" (User-Entscheidung),
      Seite und Schema wortgleich
* [x] Alt-Texte (10): „Unser Mitarbeiter" statt „CarCare-Mitarbeiter" (User-Entscheidung)
* [x] Neun Meta-Titles gekürzt, damit „CarCare Center" hineinpasst — alle jetzt
      50–59 Zeichen (vorher 57–66, mit Namensergänzung wären es 63–73 gewesen)
* [x] Bindestrich-Verstöße „CarCare-Center" behoben: `components/About.tsx:26`,
      `pages/FelgenreparaturPage.tsx:39`
* [x] Unangetastet: 9 × juristische Firmierung „BS CarCare GmbH", 6 Code-Kommentare,
      `components/Hero.tsx` (User-Vorgabe)
* [x] 158 Regeln, 162 Ersetzungen in 32 Dateien, jede Regel mit Trefferzahl-Assertion
* [x] **Nachtrag nach der Gegenprobe:** zwei sichtbare PageHero-Leadtexte hatten
      den Firmennamen weiterhin als Subjekt in dritter Person —
      `pages/BusinessCustomersPage.tsx:143` und `pages/PrivatkundenPage.tsx:162`.
      Ursache: die erste Restsuche prüfte „CarCare Center" + Verb, aber nicht
      „CarCare Center **Leipzig**" + Verb. Behoben, Name bleibt erhalten und
      wandert ins Präpositionalgefüge („Im CarCare Center Leipzig arbeiten wir …")
* [x] Bewusste Ausnahme: `seo/structuredData.ts:61` (JSON-LD `AutoRepair.description`)
      bleibt in dritter Person. Strukturierte Daten sind Maschinen-Metadaten über
      die Entität; `CLAUDE.md` nennt sie ausdrücklich als Ausnahme

**Referenzen:**
`seo/pageSchemas.ts`
`pages/BusinessCustomersPage.tsx`
`pages/CareerPage.tsx`
`docs/textkorrekturen-schleife-1/tasks/2026-09-01-1314-fundstellen-review.md`

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
   (SEO-GEO §5). Genau dieser Backlog-Punkt hat die Divergenz erzeugt.
2. 🟠 **Hoch:** `components/Hero.tsx` ist toter Code (kein Import, Unsplash-Hotlink,
   Jahreszahl 2010).
3. 🟡 **Mittel:** Kartentitel und Kartenbeschreibung tragen auf fünf Serviceseiten
   beide „seit 1998". Inhaltlich korrekt, sprachlich redundant.
4. 🟡 **Mittel:** 16 von 17 `PageMeta`-Descriptions außerhalb 140–160 Zeichen.

### Phase 2
**Eingehalten**: Einheit `m²` durchgehend ✅, „über" ergänzt ✅,
Schema wortgleich mit sichtbarem Inhalt ✅, Regeldatei mitkorrigiert ✅

**Auffälligkeiten:** keine neuen über Phase 1 hinaus.

### Phase 3 + 4
**Eingehalten**: vollständige Umformulierung statt Ersetzung ✅, Kundenansprache
„Sie" durchgehend ✅, juristische Firmierung unangetastet ✅, Hero.tsx unangetastet ✅,
Schema-Seite-Parität gemessen statt behauptet ✅, Titles im Zielkorridor ✅,
Encoding sauber ✅, Freigabe vor Umsetzung eingeholt ✅

**Auffälligkeiten/Kritische Findings (nach Schwere):**
1. 🔴 **Kritisch, neu belegt:** **Sieben FAQ-Texte in `seo/pageSchemas.ts` haben
   überhaupt keine sichtbare Entsprechung** — sie sind nicht bloß doppelt gepflegt,
   sie stehen auf keiner Seite. Betroffen: der Kontaktseiten-Eintrag „Über das
   Formular Termin anfragen …" sowie vier Einträge des Wissensbereichs
   („Wofür ist der Wissensbereich gedacht?", „Ersetzt der Ratgeber eine
   Fahrzeugprüfung?", „Kann das CarCare Center die beschriebenen Leistungen in
   Leipzig umsetzen?"). Das ist ein direkter Verstoß gegen die Google-Richtlinie
   für `FAQPage` (Markup nur für sichtbaren Seiteninhalt) und gegen SEO-GEO §5.
   **Bestand schon vor diesem Paket** — Messung vor und nach der Änderung ergibt
   identisch 7 von 135. Die Änderung hat es weder verursacht noch verschlimmert.
2. 🟡 **Mittel:** Drei `PageMeta`-Titles liegen weiterhin außerhalb 50–60 Zeichen:
   `HomePage.tsx` (83), `KnowledgeHubPage.tsx` (65), `AccidentRepairPage.tsx` (62).
   Nicht Teil dieses Pakets, weil sie „CarCare Center" bereits korrekt führen
   bzw. den Namen nicht enthalten.
3. 🟡 **Mittel:** Fünf `metaTitle` in `data/knowledgeArticles.ts` sind durch die
   Namensergänzung um 7 Zeichen länger geworden (jetzt 69–83). Sie lagen schon
   vorher über der Vorgabe; das Paket verschärft es geringfügig.

→ Findings 1 bis 3 sind in `2026-09-01-paket-a-optimierung-tasks.md` aufgenommen.
