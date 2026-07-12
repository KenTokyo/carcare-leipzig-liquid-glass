# Autoaufbereitung-Expertise-Karten als ExpandOnHover-Akkordeon (wie Leistungsübersicht)

> **Ziel:** Die 5 Karten in `components/AutoDetailingExpertiseSection.tsx`
> ("Autoaufbereitung als Expertise", aktuell statisches Icon-Grid) erhalten **dasselbe**
> ExpandOnHover-Akkordeon wie die Leistungsübersicht (`ServiceGrid.tsx`, skiper52 Desktop
> horizontal / skiper53 Mobile vertikal). Umsetzung DRY über eine **gemeinsame Komponente**
> `ExpandingCardAccordion`, die aus dem bewährten ServiceGrid-Markup extrahiert und in
> **beiden** Sektionen genutzt wird — so sind sie garantiert identisch und driften nicht auseinander.

## Ausgangslage (gelesen)

- `ServiceGrid.tsx` (156 Z.) = Referenz-Akkordeon: Desktop `lg:flex-row lg:h-[460px]` (flex-grow
  animiert), Mobile `flex-col` (height animiert `h-[64px]`↔`h-[340px]`), Hintergrundbild +
  weiße Textbox (Titel + blauer Punkt + Beschreibung + CTA/Pfeil-Badge) + Logo-Badge.
  Touch: 1. Tap klappt auf, 2. folgt Link (`matchMedia('(hover: hover)')`). a11y + reduced-motion vorhanden.
- `AutoDetailingExpertiseSection.tsx` (79 Z.) = statisches Grid (`grid-cols-5`), 5 Icon-Karten,
  nur Hover-Lift. Links auf `/autoaufbereitung-wissen/...` (Wissenshub) — bleiben erhalten.
- Assets: nur **ein** Werkstattbild (`carcare-hero-workshop.jpeg`); ServiceGrid nutzt es für alle
  10 Karten (Fallback `DEFAULT_CARD_BG`). "Das Gleiche" = gleiches Muster + gleiches Default-Bild.

## Entscheidung (Ansatz-Vergleich)

- **Verworfen A — Markup duplizieren** in AutoDetailing: schnell, aber zwei Kopien driften (DRY-Verstoß).
- **Verworfen B — Icon-Optik als eigenes Expand-Grid** nachbauen: nicht "das Gleiche", Extra-Code.
- **✅ Gewählt C — Shared `ExpandingCardAccordion`**: Markup 1×, beide Sektionen konsumieren es →
  wirklich identisch, weniger Code, unter 700 Z./Datei. Icons entfallen im Akkordeon (ServiceGrid
  hat keine) — `KnowledgeCard`-Typ bleibt unverändert, Icon-Daten werden nur nicht gerendert.

---

## Phasen

### ✅ Phase 1 — Analyse & Ansatzwahl
* [x] Beide Komponenten + Referenz-Plan (`services-expand-hover`) + `types.ts` gelesen
* [x] Assets geprüft (nur 1 geteiltes Werkstattbild → gleiches Muster wie ServiceGrid)
* [x] Ansätze A/B/C verglichen, **C (Shared-Komponente)** gewählt
**Referenzen:** `components/ServiceGrid.tsx`, `components/AutoDetailingExpertiseSection.tsx`

### ✅ Phase 2 — Shared `ExpandingCardAccordion` extrahieren
**Ziel:** Bewährtes ServiceGrid-Akkordeon 1:1 in eine props-getriebene Komponente heben.
* [x] `components/ExpandingCardAccordion.tsx` erstellt (Item-Typ `ExpandingCardItem {id,title,description,href,cta?,backgroundImage?}`)
* [x] Verhalten exakt übernommen: `active`-State, `hoverCapable` (matchMedia), Desktop/Mobile-Klassen,
      Bild + Overlay + Label + weiße Textbox + Logo-Badge, Touch-Tap-Logik, a11y, reduced-motion
* [x] Section-Entrance (`whileInView`) in die Komponente gezogen (beide Sektionen erben sie)
**Referenzen:** `components/ExpandingCardAccordion.tsx`

### ✅ Phase 3 — ServiceGrid auf Shared-Komponente umstellen
* [x] `ServiceGrid` konsumiert `<ExpandingCardAccordion items={overviewServices} />` (Header/Daten unverändert)
* [x] Verifiziert (Preview): 10 Karten, `flex-direction: row`, aktiv "Fahrzeugaufbereitung", href `/fahrzeugaufbereitung-leipzig` → **kein Regression** (156 → 41 Zeilen)
**Referenzen:** `components/ServiceGrid.tsx`

### ✅ Phase 4 — AutoDetailingExpertiseSection umstellen
* [x] Statisches Grid durch `<ExpandingCardAccordion items={cards} />` ersetzt; Heading + Intro + "Wissen ansehen"-Link bleiben
* [x] Pro Karte kurzen `cta` ergänzt (Innenraum/Außenpflege/Lackpflege/Leasing/Wissenshub); Wissenshub-Links unverändert
* [x] Nicht mehr genutzte Icon-Imports (Armchair, SprayCan, …) + `iconMap` entfernt (Cleanup); Daten auf `ExpandingCardItem` typisiert
**Referenzen:** `components/AutoDetailingExpertiseSection.tsx`

### ✅ Phase 5 — Verifikation & Doku
* [x] `tsc --noEmit` grün (Exit 0)
* [x] Preview Desktop 1280px: horizontales Akkordeon, echter Hover schaltet Karte (Lackaufbereitung aktiv, `flexGrow [1,1,6,1,1]`); Mobile 800px: vertikaler Stapel, volle Breite; 0 Console-Fehler
* [x] Screenshots als Beleg; Kommentare + Findings ergänzt
**Referenzen:** `components/AutoDetailingExpertiseSection.tsx`, `components/ExpandingCardAccordion.tsx`

### ✅ Phase 6 — Toten Code entfernen (DetailingExpertise) + Copy-Rettung
**Ziel:** Verwaisten Vorgänger `DetailingExpertise.tsx` löschen; einzigartige Copy vorher sichern.
* [x] Analyse: beide Copy-Fragmente bereits abgedeckt — Pflegepakete (Brillant/Intensiv/Premium „exklusiv") DETAILLIERT in `components/Services.tsx`; Zielgruppen-E-E-A-T live in TrustBar/BusinessSection/VehicleDetailingPage
* [x] Rettung (nicht-redundant): Homepage-Intro der Autoaufbereitungs-Sektion um Erfahrungs-/Zielgruppen-Aussage ergänzt ("…für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung…")
* [x] `components/DetailingExpertise.tsx` per `git rm` entfernt; ungenutzten `KnowledgeCard`-Typ aus `types.ts` entfernt; Kommentar in `ExpandingCardAccordion` angepasst
* [x] `tsc --noEmit` grün; Preview: Intro live, 5 Akkordeon-Karten, 0 Console-Fehler
* [x] Entdeckt & ausgewiesen: `components/Services.tsx` ebenfalls verwaist — enthält die EINZIGE Detailversion der Pflegepakete (nicht live). Als Chance gemeldet (separater Scope, nicht ungefragt migriert)
**Referenzen:** `components/AutoDetailingExpertiseSection.tsx`, `types.ts`

---

## Kommentare

### Phase 1–5 (Autoaufbereitung-Karten als ExpandOnHover-Akkordeon)
**Eingehalten:** DRY über gemeinsame Komponente (ein Markup, zwei Sektionen — garantiert identisch) ✅,
Ansätze verglichen (A duplizieren / B Icon-Expand / **C Shared** gewählt) vor Code ✅, phasenweise
dokumentiert ✅, Mobile-First (Desktop horizontal / Mobile vertikal, kein h-Scroll) ✅, < 700 Zeilen/Datei
✅ (ExpandingCardAccordion ~160, ServiceGrid 41, AutoDetailing 55), keine neue Dependency ✅, a11y
(`aria-expanded`, `aria-label`, Fokus-Ring, `motion-reduce`) ✅, **kein Content entfernt** (Heading, Intro,
alle Links + "Wissen ansehen" bleiben) ✅, SEO/GEO (alle Titel + Beschreibungen im initialen HTML,
crawlbar) ✅, `tsc --noEmit` grün ✅, 0 Console-Fehler ✅, Encoding sauber (Umlaute korrekt) ✅.

**Verifikations-Messwerte (Preview):**
- Desktop 1280px: `flex-direction: row`; Ruhe → aktiv "Innenaufbereitung" 695px (flexGrow 6) / 4 Streifen je 116px.
  Echter Hover über 3. Streifen → aktiv "Lackaufbereitung", `flexGrow [1,1,6,1,1]` (Interaktion nachgewiesen).
- Mobile 800px (< lg): vertikaler Stapel, aktive Karte volle Breite mit Textbox + CTA + Logo-Badge.
- Regression ServiceGrid: 10 Karten, row-Layout, hrefs intakt.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟢 **Niedrig (bewusst, wie ServiceGrid):** Alle 5 Autoaufbereitung-Karten teilen aktuell dasselbe
   Werkstattbild (Default-BG). Der skiper52-Effekt lebt von UNTERSCHIEDLICHEN Bildern. Sobald Detailing-Fotos
   (Innenraum, Lack, Politur, …) vorliegen, nur `backgroundImage` je Item setzen — kein Struktur-Umbau nötig.
2. 🟢 **Niedrig (Tooling, kein Bug):** Programmatischer `.focus()` triggert React-`onFocus` im Headless-Preview
   nicht zuverlässig (dokumentierte Limitation). Verifikation daher über **echten** `computer hover` + direkte
   `flexGrow`-Messung → Interaktion einwandfrei. Für echte Nutzer feuern Hover/Focus normal.
3. 🟢 **Niedrig (VORBESTEHEND, NICHT von dieser Aufgabe):** `components/DetailingExpertise.tsx` ist verwaist
   (nirgends importiert) und hält die einzige Nutzung des `KnowledgeCard`-Typs am Leben. Nicht stillschweigend
   gelöscht (kein Auftrag). Empfehlung: als separates Cleanup entfernen → dann auch `KnowledgeCard` entfernbar.

**Hauptkomponenten (max. 3):** `components/ExpandingCardAccordion.tsx` (neu, geteilt),
`components/AutoDetailingExpertiseSection.tsx` (Umbau), `components/ServiceGrid.tsx` (auf Shared umgestellt).

**Fazit:** "Das Gleiche" umgesetzt — beide Kartensektionen nutzen jetzt exakt dasselbe Akkordeon (Desktop
skiper52 / Mobile skiper53), browser-verifiziert inkl. Regressionsprüfung. Alle Findings 🟢 niedrig; kein
separates Optimierungs-Task-File nötig. Ein vorbestehender toter `DetailingExpertise`-Rest sauber ausgewiesen.

### Phase 6 (Dead-Code-Cleanup DetailingExpertise + Copy-Rettung)
**Eingehalten:** vor dem Löschen Copy geprüft (keine Substanz verloren) ✅, **kein dünner/duplizierter Inhalt**
erzeugt (Teaser NICHT redundant eingestreut, Standard 4.5) ✅, additive E-E-A-T-Ergänzung statt Ersatz ✅,
`tsc` grün ✅, 0 Console-Fehler ✅, browser-verifiziert ✅, Encoding sauber ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (NEU entdeckt, ausgelagert — NICHT Teil dieser Aufgabe):** `components/Services.tsx` ist verwaist
   (nirgends importiert) und hält die EINZIGE ausführliche Pflegepaket-Darstellung: „Brillant Außenpflege",
   „Intensiv Innenreinigung", „Premiumpflege exklusiv" mit SWIZÖL-Wachs (Carnauba 30–60 %). Diese konkrete,
   GEO-wertvolle Fakten-Copy ist derzeit NICHT live. Empfehlung: als eigene Paket-Sektion auf
   `/fahrzeugaufbereitung-leipzig` (`VehicleDetailingPage`) sichtbar machen — bewusst NICHT ungefragt
   umgesetzt (Content-/SEO-Entscheidung, Freigabe abwarten).
2. 🟢 **Niedrig (erledigt):** `DetailingExpertise.tsx` war ein veralteter Vorgänger mit toten Anker-Links
   (`#wissen`, `#services`, `#wissen-hub`); gelöscht. `KnowledgeCard`-Typ danach ungenutzt → aus `types.ts` entfernt.

**Hauptkomponenten (max. 3):** `components/DetailingExpertise.tsx` (gelöscht),
`components/AutoDetailingExpertiseSection.tsx` (Intro-Rettung), `types.ts` (`KnowledgeCard` entfernt).
