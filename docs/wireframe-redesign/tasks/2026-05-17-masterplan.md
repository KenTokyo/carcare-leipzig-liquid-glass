# Masterplan — CarCare Leipzig Redesign nach WIREFRAME-GOAL

**Erstellt:** 2026-05-17
**Status:** In Umsetzung
**Modus:** Phasenweise ohne Stops, dokumentiert nach jeder Phase

## Pflicht-Referenzen (immer mitgeben bei Kontext-Kondensation!)
- `WIREFRAME-GOAL.md` — Definiert Zielstruktur, Sektionen, Inhalte, URL-Struktur, SEO-Anforderungen
- `DESIGN.md` — Design-System (Farben, Typografie, Animationen, Komponenten-Patterns)
- `phasenweise-oder-stopps-implementieren.md` — Workflow-Regeln (Phasenformat, Kommentar-Sektion, TS-Zero-Tolerance, Loop)
- `shared-docs/CODING-RULES.md` (Nachbarprojekt-Referenz) — Max 700 Zeilen/Datei, Component-per-File, Zero TS-Errors, Mobile-First
- `AGENTS.md` (Projekt-Root — derzeit leer)

## Grundprinzip
1. **Bestehender Text bleibt erhalten** (DESIGN.md-Stil bleibt, Hero-Text, About-Text, Services, Jobs nicht ändern)
2. **Aufbauen, nicht ersetzen** — neue Sektionen werden ergänzt
3. **TypeScript-Zero-Errors nach jeder Phase**
4. **Max 700 Zeilen pro Datei** — modular auslagern
5. **Liquid Glass / Premium Light-Mode-Ästhetik beibehalten** (gemäß DESIGN.md)
6. **Mobile-First** — Sticky CTA-Bar unten dauerhaft sichtbar

## Aktueller Stand (Ist-Analyse)
Vorhandene Komponenten in `components/`:
- `Navbar.tsx` (257 Zeilen) — Scroll-Animation, Glass-Pill ✅
- `Hero.tsx` (102 Zeilen) — Hero mit PREMIUM CARE Headline ✅
- `About.tsx` (75 Zeilen) — Über-uns mit CarCare-Center Leipzig ✅
- `Services.tsx` (307 Zeilen) — Services Grid mit Filter & Akkordeon ✅
- `Jobs.tsx` (107 Zeilen) — Karriere Split-View ✅
- `Footer.tsx` (91 Zeilen) — Footer mit Kontakt, Öffnungszeiten ✅

## SOLL-Architektur (gemäß WIREFRAME-GOAL.md)
Startseite-Sektionen (12 Stück):
1. Header ✅ vorhanden (Erweiterung CTAs)
2. Hero ✅ vorhanden (Erweiterung CTAs + Trust-Zeile)
3. Zielgruppen-Einstieg (NEU)
4. Leistungsübersicht (NEU — neben Services-Preisliste)
5. Schwerpunkt Unfall & Schaden (NEU)
6. Autoaufbereitung Expertise (NEU)
7. Prozess-Timeline (NEU)
8. Geschäftskunden-Bereich (NEU)
9. Karriere-Teaser (Anpassung Jobs)
10. Referenzen (NEU)
11. FAQ Startseite (NEU)
12. Kontaktabschluss (NEU — Forms)
+ MobileStickyCTA (NEU)

---

## Phasenplan

### ✅ Phase 1 — Setup, Types, Navbar-Update & MobileStickyCTA
**Ziel:** Grundstruktur erweitern. Mobile Sticky CTA-Bar. Navbar-Navigation um neue Bereiche ergänzen.
* [x] `docs/wireframe-redesign/tasks/2026-05-17-masterplan.md` erstellen
* [x] `types.ts` um neue Interfaces erweitern (TargetGroup, FAQItem, ProcessStep, TimelineTab, Reference, AnyRequestForm)
* [x] `components/MobileStickyCTA.tsx` neu — fixed bottom Bar mit Anrufen / Schaden melden / Termin anfragen
* [x] `components/Navbar.tsx` — Navigation um Unfall/Schaden, Geschäftskunden, Wissen, Karriere ergänzen + "Schaden melden"-Button
* [x] `App.tsx` MobileStickyCTA mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/Navbar.tsx`, `components/MobileStickyCTA.tsx`, `App.tsx`

### ✅ Phase 2 — Hero-Erweiterung & TrustBar
**Ziel:** Hero behält PREMIUM CARE Headline, ergänzt um Sub-CTA "Schaden melden" + Trust-Zeile (>50 Mitarbeiter, Premiumhersteller, Leipzig, aus einer Hand). Trust-Bar als eigener kleiner Block direkt unter Hero.
* [x] `components/Hero.tsx` — dritten CTA-Button "Schaden melden" hinzufügen (vorhandene Texte unverändert)
* [x] `components/TrustBar.tsx` neu — vier Trust-Punkte horizontal
* [x] `App.tsx` TrustBar-Section nach Hero mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/Hero.tsx`, `components/TrustBar.tsx`

### ✅ Phase 3 — Zielgruppen-Einstieg
**Ziel:** 4-Card-Block "Der richtige Ansprechpartner": Privatkunden / Versicherungen & Agenturen / Autohäuser & Fuhrparks / Bewerber.
* [x] `components/TargetGroups.tsx` neu — Bento-Grid 4 Karten, Glass-Hover, jeweils CTA
* [x] `App.tsx` einbinden zwischen About und Services
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/TargetGroups.tsx`, `App.tsx`

### ✅ Phase 4 — Leistungsübersicht (10er-Kachelgrid)
**Ziel:** Hochrangige Leistungsübersicht (Fahrzeugaufbereitung, Unfallinstandsetzung, …) als 10-Card-Grid. Ergänzt die bestehende Preisliste-Services, ersetzt sie NICHT.
* [x] `components/ServiceGrid.tsx` neu — 10 Cards mit Icon, Titel, Subtext, "Mehr ansehen"
* [x] `App.tsx` — ServiceGrid vor bestehendem Services-Block einbinden
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/ServiceGrid.tsx`, `App.tsx`

### ✅ Phase 5 — Unfall & Schaden + Autoaufbereitung Expertise
**Ziel:** Zwei nebeneinanderliegende Schwerpunkt-Sektionen.
* [x] `components/AccidentFocus.tsx` neu — Headline, Bulletpoints, 2 CTAs
* [x] `components/DetailingExpertise.tsx` neu — Headline, 5 Wissens-Cards (Innen, Außen, Lack, Leasing, Pflegepakete), CTA
* [x] `App.tsx` mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/AccidentFocus.tsx`, `components/DetailingExpertise.tsx`

### ✅ Phase 6 — Prozess-Timeline mit Tabs
**Ziel:** Tabs "Unfallschaden" / "Autoaufbereitung" mit jeweils 5-Schritt-Timeline.
* [x] `components/ProcessTimeline.tsx` neu — Tabs + animierte Step-Visualisierung
* [x] `App.tsx` mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/ProcessTimeline.tsx`

### ✅ Phase 7 — Geschäftskunden-Bereich & Karriere-Teaser
**Ziel:** B2B-Sektion mit Vorteilen + Hinweis auf digitale Schadenübermittlung. Karriere-Teaser auf bestehender Jobs-Komponente.
* [x] `components/BusinessSection.tsx` neu — Headline, Vorteile-Liste, CTA
* [x] `components/Jobs.tsx` — leichte Anpassung (Hinweis: Texte unverändert, nur Eyecatcher/Heading minimal angepasst falls nötig)
* [x] `App.tsx` mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/BusinessSection.tsx`, `components/Jobs.tsx`

### ✅ Phase 8 — Referenzen + FAQ Startseite
**Ziel:** Vertrauens-Sektion mit Referenz-Punkten. FAQ-Block mit 5 Fragen (Akkordeon).
* [x] `components/References.tsx` neu — Trust-Logos-Style, 4 Punkte
* [x] `components/FAQSection.tsx` neu — Akkordeon mit Framer Motion AnimatePresence
* [x] `App.tsx` mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/References.tsx`, `components/FAQSection.tsx`

### ✅ Phase 9 — Kontaktabschluss + Anfrageformulare
**Ziel:** Kontakt-Abschluss-Sektion mit 3 Tab-Anfragearten. Forms: Schaden melden, Termin anfragen, Geschäftskundenanfrage.
* [x] `components/ContactCTA.tsx` neu — Sektion mit Adresse, Öffnungszeiten, 3 Buttons
* [x] `components/RequestForm.tsx` neu — Polymorphes Formular für 3 Anfragearten
* [x] `components/ContactSection.tsx` neu — Tabs + RequestForm einbinden
* [x] `App.tsx` mounten
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/ContactSection.tsx`, `components/RequestForm.tsx`, `components/ContactCTA.tsx`

### ✅ Phase 10 — Footer-Update + Sitemap
**Ziel:** Footer um Sitemap-Sektion erweitern (Leistungen, Wissen, Karriere, Geschäftskunden) — Pflichtangaben bleiben.
* [x] `components/Footer.tsx` — Spalten erweitern, bestehende Texte unverändert
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `components/Footer.tsx`

### ✅ Phase 11 — SEO Meta & StructuredData JSON-LD
**Ziel:** index.html SEO-Meta, JSON-LD für AutoRepair / LocalBusiness / Organization / FAQPage.
* [x] `index.html` — Title, Description, OG-Tags
* [x] `components/StructuredData.tsx` neu — JSON-LD Components (LocalBusiness, FAQ, Service)
* [x] `App.tsx` StructuredData einbinden
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** `index.html`, `components/StructuredData.tsx`

### ✅ Phase 12 — Final Polish & Auffälligkeiten-Fix
**Ziel:** Cleanup, Mojibake-Check, Mobile-Test mental, alle Sektionen auf Konsistenz prüfen.
* [x] Alle Komponenten auf Konsistenz prüfen
* [x] Bestehende Text-Inhalte verifiziert unverändert
* [x] Optimierungsplan erstellen bei Findings
* [x] `tsc --noEmit` 0 Fehler
**Referenzen:** Alle geänderten Komponenten

---

## Kommentare

### Phase 1 — Setup, Types, Navbar-Update & MobileStickyCTA ✅
**Eingehaltene Kriterien:**
- types.ts um TargetGroup, OverviewService, FAQItem, ProcessStep, TimelineTab, ReferencePoint, BusinessBenefit, KnowledgeCard, RequestFormKind, RequestFormConfig erweitert
- MobileStickyCTA fixed bottom mit drei Quick-Aktionen
- Navbar erweitert um Schaden/Geschäftskunden/Wissen/Karriere + "Schaden melden"-Button
- App.tsx MobileStickyCTA gemountet
- 0 TS-Fehler

### Phase 2 — Hero & TrustBar ✅
- Hero unverändert (PREMIUM CARE Headline), nur dritte CTA "Leistungen ansehen" + zwei neue CTAs vorne (Schaden / Termin)
- TrustBar mit vier Vertrauens-Punkten
- 0 TS-Fehler

### Phase 3 — Zielgruppen ✅
- 4-Card Bento Grid (Privat, Versicherung, Gewerbe, Karriere), eine Dark-Card als Akzent
- 0 TS-Fehler

### Phase 4 — Leistungsübersicht ✅
- 10 Leistungs-Cards in 5er Grid (xl), Glass-Hover, "Mehr ansehen"
- 0 TS-Fehler

### Phase 5 — Unfall & Autoaufbereitung ✅
- AccidentFocus Dark-Section mit Bulletpoints + 2 CTAs (#contact-schaden, #unfall-details)
- DetailingExpertise hell mit 5 Wissens-Cards
- 0 TS-Fehler

### Phase 6 — Prozess-Timeline ✅
- Tab-Switcher (Unfall / Autoaufbereitung) + 5-Step Timeline mit Framer Motion
- 0 TS-Fehler

### Phase 7 — Geschäftskunden-Bereich ✅
- 6 Benefit-Cards + Dark-CTA-Block für digitale Schadenübermittlung
- Fix: doppelte `id="contact-business"` auf Button entfernt (kollidierte mit ContactSection-Anker)
- 0 TS-Fehler

### Phase 8 — Referenzen + FAQ ✅
- References mit 4 Trust-Punkten
- FAQSection mit Akkordeon (Framer Motion AnimatePresence)
- 0 TS-Fehler

### Phase 9 — Kontaktabschluss + Anfrageformulare ✅
- ContactCTA mit Adresse, Öffnungszeiten, Telefon + 3 Quick-CTAs
- RequestForm polymorph für schaden / termin / business mit jeweils passenden Feldern + Erfolgsstate
- ContactSection mit Tab-Switcher, Hash-Sync (hashchange Listener) + drei unsichtbaren Anker-Spans für `#contact-schaden`, `#contact-termin`, `#contact-business`
- Tabs bei Hash-Change automatisch aktiv (Deep-Linking aus Navbar, Hero, MobileStickyCTA, ProcessTimeline, BusinessSection)
- 0 TS-Fehler

### Phase 10 — Footer-Update ✅
- Bestehende Footer-Texte unverändert (Brand, Kontakt, Öffnungszeiten, Bereiche, Legal-Bottom)
- Zwei zusätzliche Sitemap-Spalten: "Sitemap" (Leistungen, Unfall & Schaden, Autoaufbereitung, Prozess, FAQ) und "Anfragen" (Schaden, Termin, Geschäftskunden, B2B, Zielgruppen)
- Grid auf 6 Spalten erweitert, Brand-Spalte 2-cols breit auf lg
- 0 TS-Fehler

### Phase 11 — SEO Meta & StructuredData ✅
- index.html: Title verlängert (Leipzig + Keywords), description, keywords, robots, author, canonical, OG-Tags, Twitter-Card, theme-color
- StructuredData.tsx: drei JSON-LD-Blöcke (LocalBusiness/AutoRepair/AutoBodyShop, Service-ItemList, FAQPage mit 5 Fragen)
- In App.tsx direkt nach Root-Div gemountet
- 0 TS-Fehler

### Phase 12 — Final Polish ✅
- Mojibake-Scan über components/ und alle .tsx — keine Treffer
- UTF-8 Umlaute in allen neuen Files (Öffnungszeiten, Schaden, Geschäftskunden, Versicherungsagenturen) korrekt
- Section-IDs final: home, trust, about, zielgruppen, leistungen, services, unfall, expertise, prozess, jobs, business-zone, referenzen, faq, kontakt-cta, kontakt
- Anker für Forms: contact-schaden, contact-termin, contact-business (in ContactSection)
- 0 TS-Fehler

## Refactoring-Empfehlungen (Findings nach Schwere)

### Mittel
- `Navbar.tsx` Layout bei <1280px wird mit 7 Nav-Items + Phone-Button + Schaden-Button eng. Phone-Button ist auf `lg:flex` — bei `lg` (1024px) reicht die Breite kaum. Empfehlung: Phone-Button erst ab `xl:` einblenden ODER Navigation auf `lg`-Breakpoint zu Burger-Menü zurückfallen lassen.
- `BusinessSection.tsx` und ContactSection beide haben Sub-Anker mit `#contact-business` — Konflikt wurde behoben (Button-id entfernt). Künftige IDs nur an Sections vergeben, nie an inneren Buttons.

### Niedrig
- `Footer.tsx` Anker `#unfall` zeigt auf AccidentFocus-Section (Top Dark-Block), nicht auf inneren `#unfall-details` Bereich. Beide IDs koexistieren ohne Konflikt.
- `RequestForm.tsx` nutzt `as never`-Casts für State-Updates wegen Polymorph-Typing — funktional ok, aber Discriminated-Union mit getrennten useState pro Kind wäre sauberer.
- `StructuredData.tsx` Geo-Koordinaten sind Näherung (Leipzig-Zentrum, nicht exakte Adresse). Bei Bedarf verfeinern.

### Optional
- Bilder-Optimierung: Hero nutzt Unsplash-Live-URL; für Produktion eigene Assets via Vite `public/` einbinden.
- `index.html` Tailwind über CDN — für Produktion auf Tailwind-Build mit Purge umstellen.
- robots.txt / sitemap.xml als Public-Assets ergänzen für besseres Crawling.

