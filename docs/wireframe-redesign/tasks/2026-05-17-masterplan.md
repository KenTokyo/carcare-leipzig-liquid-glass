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

### ✅ Phase 13 — Startseite Light Relaunch 2026
**Ziel:** Bestehenden Onepager gezielt zu einer hellen, hochwertigen, lokalen SEO-Startseite weiterentwickeln. Kein Komplett-Neubau, sondern Modernisierung der vorhandenen Struktur mit klarer H1, semantischen Sektionen, starken CTAs und prominentem Unfall-&-Schaden-Fokus.
* [x] `App.tsx` semantisch und in sinnvoller Startseiten-Reihenfolge strukturiert.
* [x] `HeroSection` mit vorgegebener H1, Subheadline, CTAs und heller Werkstatt-/Fahrzeugästhetik umgesetzt.
* [x] `TargetGroupCards`, `ServiceGrid`, `AccidentDamageSection`, `AutoDetailingExpertiseSection`, `BusinessCustomerSection`, `CareerTeaser`, `ContactCTA` modernisiert bzw. als wiederverwendbare Komponenten bereitgestellt.
* [x] Navigation, interne Links und Kontaktanker konsistent auf geplante Unterseiten und Formularziele ausgerichtet.
* [x] `index.html` Meta-Basis bereinigt und Build-Warnungen vermieden.
* [x] `npm run build`, `npx tsc --noEmit` und Browser-Sichtprüfung durchgeführt.
**Referenzen:**
`App.tsx`
`components/HeroSection.tsx`
`components/AccidentDamageSection.tsx`

### ✅ Phase 14 — Wichtige Unterseiten & SPA-Routing
**Ziel:** Die wichtigsten lokalen SEO-Unterseiten als React/Vite-Routen anlegen, ohne neue Dependencies. Bestehende Startseiten-Designsprache und Komponenten weiterverwenden.
* [x] Routing für `/leistungen`, `/unfallinstandsetzung-leipzig`, `/fahrzeugaufbereitung-leipzig`, `/geschaeftskunden`, `/karriere`, `/kontakt` eingeführt.
* [x] Wiederverwendbare Page-Komponenten für Hero, Feature-Grids, Prozess, FAQ und CTA erstellt.
* [x] Sechs Unterseiten mit eindeutiger H1, H2/H3-Struktur, internen Links und lokalen SEO-Inhalten umgesetzt.
* [x] Kontaktformularfelder für Schaden, Aufbereitung und Geschäftskunden nach Vorgabe erweitert.
* [x] Navigation, MobileStickyCTA und Footer auf neue Unterseiten abgestimmt.
* [x] `npx tsc --noEmit`, `npm run build` und Browser-Check durchgeführt.
**Referenzen:**
`App.tsx`
`pages/`
`components/RequestForm.tsx`

### ✅ Phase 15 — Technische SEO & KI-Suchmaschinenstruktur
**Ziel:** Prüfen, ob Next.js App Router/Pages Router vorhanden ist, und anschließend die tatsächlich genutzte Vite/React-SPA mit wartbaren Metadata-, Canonical-, Open-Graph- und JSON-LD-Utilities optimieren.
* [x] Router-Befund dokumentiert: kein Next.js, stattdessen Vite/React-SPA mit manuellem Routing.
* [x] Zentrale SEO-Head-Komponente für Title, Description, Canonical und Open Graph erstellt.
* [x] Wartbare JSON-LD-Utility für AutoRepair, LocalBusiness, Organization, Service, FAQPage, JobPosting und BreadcrumbList vorbereitet.
* [x] Alle wichtigen Seiten mit individueller Metadata und strukturierten Daten verbunden.
* [x] Interne Links, FAQ-Strukturen und natürliche Alt-Texte geprüft und nachgezogen.
* [x] `npx tsc --noEmit`, `npm run build` und Browser-SEO-Check durchgeführt.
**Referenzen:**
`components/SEOHead.tsx`
`seo/structuredData.ts`
`pages/`

### ✅ Phase 16 — Autoaufbereitung Wissensbereich
**Ziel:** Einen datengetriebenen Wissenshub mit fünf fachlichen Artikeln aufbauen, der deutschlandweite Informationssuchen zu Autoaufbereitung, Fahrzeugpflege, Werterhalt, Leasingrückgabe und Smart Repair abdeckt und lokal sauber zu CarCare Leipzig verlinkt.
* [x] Lösungsansätze geprüft: einzelne Hartcode-Seiten, Markdown/MDX oder datengetriebene React-Artikelstruktur. Gewählt wurde datengetriebenes React, weil Vite-SPA ohne MDX-Pipeline arbeitet und spätere Artikel so wartbar bleiben.
* [x] Wiederverwendbare Wissenskomponenten für Kategoriegrid, Artikelkarte und Artikel-Layout erstellt.
* [x] Übersichtsseite `/autoaufbereitung-wissen` mit Kategorie- und Card-Struktur umgesetzt.
* [x] Fünf Artikelrouten mit H1, direkter Antwort, Definition, Nutzen, Ablauf, Kostenfaktoren, Profi-Tipps, Fehlern, lokalem CTA und FAQ erstellt.
* [x] Interne Verlinkung zu `/fahrzeugaufbereitung-leipzig`, `/kontakt#contact-termin` und passenden Artikeln eingebaut.
* [x] Metadata und strukturierte Daten für Hub und Artikel ergänzt.
* [x] `npx tsc --noEmit`, `npm run build` und Browser-Check durchgeführt.
**Referenzen:**
`data/knowledgeArticles.ts`
`components/ArticleLayout.tsx`
`pages/KnowledgeHubPage.tsx`

### Phase 17 -- Premium Tech Blue CI-Farbpalette
**Ziel:** Bestehende Struktur, Komponenten und Funktionalitaet behalten, aber die visuelle Sprache zentral auf Pure White, Soft Ice, Carbon Black, Graphite Black, Deep Trust Blue, Clear Signal Blue und Ice Blue umstellen.
* [x] Loesungsansaetze geprueft: reine Einzelklassen-Ersetzung, globale CSS-Overrides oder zentrale Tailwind/CDN-Tokens. Gewaehlt wurde zentrale Tokenisierung, weil vorhandene Komponenten so konsistent bleiben und alte Tailwind-Farbklassen kontrolliert auf die neue CI-Palette zeigen.
* [x] `index.css` mit Premium-Tech-Blue CSS-Variablen und Basisfarben erweitern.
* [x] `index.html` Tailwind-Farbwerte auf die neuen CI-Tokens mappen.
* [x] Sichtbare Kernkomponenten fuer Header, Hero, Buttons, Cards, Formulare, Footer, Links, Hover- und Mobile-Zustaende harmonisieren.
* [x] `npx tsc --noEmit`, `npm run build` und Browser-Check Desktop/Mobile durchfuehren.
**Referenzen:**
`index.css`
`index.html`
`components/Navbar.tsx`

### Phase 18 -- Wortbildmarke als Logo-Asset
**Ziel:** Die gebaute C/Text-Marke durch die angelieferte CarCare-Center-Wortbildmarke ersetzen, ohne Navigation, Footer-Funktion oder Layoutstruktur umzubauen.
* [x] Loesungsansaetze geprueft: externen OneDrive-Pfad direkt referenzieren, Datei ins Projekt kopieren oder neues SVG nachbauen. Gewaehlt wurde Projekt-Asset, weil es build- und deployfaehig ist und keine lokale Fremdpfad-Abhaengigkeit erzeugt.
* [x] Logo-Datei als statisches Asset ins Projekt uebernehmen.
* [x] Header-Desktop, Header-Mobile und Footer-Brand auf die Wortbildmarke umstellen.
* [x] `npx tsc --noEmit`, `npm run build` und Browser-Check Desktop/Mobile durchfuehren.
**Referenzen:**
`public/assets/carcare-center-logo.webp`
`components/Navbar.tsx`
`components/Footer.tsx`

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
- Section-IDs Stand Phase 12: home, trust, about, zielgruppen, leistungen, services, unfall, expertise, prozess, jobs, business-zone, referenzen, faq, kontakt-cta, kontakt
- Anker für Forms: contact-schaden, contact-termin, contact-business (in ContactSection)
- 0 TS-Fehler

### Phase 13 — Startseite Light Relaunch 2026 ✅
**Eingehalten:** Mobile-First ✅, helle Premium-Ästhetik ✅, klare H1 ✅, semantische Sektionen ✅, Unfall-&-Schaden-Fokus prominent ✅, interne Links zu geplanten Unterseiten ✅, alle neuen/aktiven Dateien unter 700 Zeilen ✅, keine neuen Dependencies ✅, `npx tsc --noEmit` ✅, `npm run build` ✅, Browser-Check Desktop/Mobile ✅
**Aktive Section-IDs:** home, trust, zielgruppen, leistungen, unfall-schaden, autoaufbereitung, prozess, geschaeftskunden, karriere, vertrauen, faq, kontakt, contact-schaden, contact-termin, contact-business
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Build läuft ohne die vorherigen HTML-Warnungen.
2. Niedrig: Alte Legacy-Komponenten bleiben als nicht geladene Reserve im Komponentenordner. Sie erzeugen keine Imports oder Build-Probleme und können später separat archiviert oder in Unterseiten überführt werden.

### Phase 14 — Wichtige Unterseiten & SPA-Routing ✅
**Eingehalten:** Mobile-First ✅, alle Seiten mit genau einer H1 ✅, H2/H3-Struktur ✅, lokale SEO-Begriffe integriert ✅, interne Links ✅, CTA-Bereiche ✅, FAQ wo sinnvoll ✅, keine neuen Dependencies ✅, alle Dateien unter 700 Zeilen ✅, `npx tsc --noEmit` ✅, `npm run build` ✅, Browser-Check für alle sechs Pfade ✅
**Erstellte Routen:** `/leistungen`, `/unfallinstandsetzung-leipzig`, `/fahrzeugaufbereitung-leipzig`, `/geschaeftskunden`, `/karriere`, `/kontakt`
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Alle sechs Pfade sind direkt erreichbar, jeweils mit genau einer H1 und ohne horizontalen Overflow.
2. Niedrig: Das Routing ist SPA-basiert in Vite. Für Produktion muss der Webserver alle Unterseiten auf `index.html` zurückfallen lassen oder später auf echtes SSG/Next.js migriert werden.

### Phase 15 — Technische SEO & KI-Suchmaschinenstruktur ✅
**Eingehalten:** Router-Prüfung ✅, kein Next.js App Router/Pages Router vorhanden ✅, Vite-SPA passend optimiert ✅, individuelle Title/Description/Canonical/OG pro wichtiger Route ✅, H1 je Route ✅, wartbare JSON-LD-Utilities ✅, AutoRepair/LocalBusiness/Organization/Service/FAQPage/JobPosting/BreadcrumbList vorbereitet ✅, interne Links bereinigt ✅, natürliche Alt-Texte geprüft ✅, `npx tsc --noEmit` ✅, `npm run build` ✅, Browser-SEO-Check ✅
**Browser-Check:** `/`, `/leistungen`, `/unfallinstandsetzung-leipzig`, `/fahrzeugaufbereitung-leipzig`, `/geschaeftskunden`, `/karriere`, `/kontakt` jeweils mit Metadata, Canonical, OG-URL, einer H1 und passenden JSON-LD-Typen.
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Metadata und JSON-LD werden clientseitig korrekt gesetzt.
2. Mittel: Da das Projekt eine Vite-SPA ist, liegen individuelle Route-Metadaten nicht als statisches HTML pro Route vor. Für maximale SEO sollte später Pre-Rendering/SSG oder eine Next.js/SSR-Migration geprüft werden.
3. Niedrig: `robots.txt`, `sitemap.xml`, exakte Geo-Koordinaten und eigene lokale Bildassets bleiben sinnvolle nächste technische SEO-Schritte.

### Phase 16 — Autoaufbereitung Wissensbereich ✅
**Eingehalten:** Plan vor Code erweitert ✅, Mobile-First ✅, datengetriebene Artikelstruktur ✅, alle Dateien unter 700 Zeilen ✅, klare H1 je Wissensroute ✅, Artikelmuster vollständig umgesetzt ✅, fachliche neutrale Texte ohne Referenznamen ✅, interne Links zu Hub/Fahrzeugaufbereitung/Kontakt ✅, JSON-LD für Hub und Artikel ✅, keine neuen Dependencies ✅, `npx tsc --noEmit` ✅, `npm run build` ✅, Browser-Check ✅
**Browser-Check:** `/autoaufbereitung-wissen` plus fünf Artikelrouten jeweils mit Metadata, Canonical, OG-URL, einer H1, passenden JSON-LD-Typen, internen Links und ohne horizontalen Overflow.
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Hub und Artikel sind direkt erreichbar und strukturell konsistent.
2. Mittel: Auch der neue Wissensbereich bleibt SPA-seitig clientgerendert. Für maximale organische Sichtbarkeit sollten später Pre-Rendering/SSG und `sitemap.xml` umgesetzt werden.
3. Niedrig: Weitere Artikelcluster zu Felgen, Geruchsentfernung, Polsterpflege und Hagelschaden könnten die Informationsarchitektur sinnvoll ausbauen.

### Phase 17 -- Premium Tech Blue CI-Farbpalette
**Eingehalten:** Plan vor Code erweitert, zentrale Tokens, Mobile-First, keine Layout-Umbauten, keine neuen Dependencies, alte direkte RGBA-Blau/Schattenwerte ersetzt, `npx tsc --noEmit`, `npm run build`, Browser-Check Desktop/Mobile.
**Browser-Check:** `/` bei 1440x900 und 390x844 geprueft. Kein horizontaler Overflow, Desktop-Navigation sichtbar, Mobile-Menue sichtbar, Sticky-CTA sichtbar. Laufzeitfarben bestaetigt: Deep Trust Blue `rgb(11, 61, 145)`, Carbon Black `rgb(8, 11, 16)`, Ice Blue `rgb(216, 232, 255)`.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Farb-Tokens greifen zentral und Build/TypeScript laufen sauber.
2. Niedrig: Tailwind wird weiterhin per CDN genutzt. Fuer Produktion bleibt ein Tailwind-Build mit Purge/Content-Scan sinnvoll.

### Phase 18 -- Wortbildmarke als Logo-Asset
**Eingehalten:** Plan vor Code erweitert, vorhandene Struktur beibehalten, keine neuen Dependencies, Asset deployfaehig unter `public/assets`, Header-Desktop, Header-Mobile und Footer aktualisiert, alle aktiven Komponenten unter 700 Zeilen, `npx tsc --noEmit`, `npm run build`, Browser-Check Desktop/Mobile.
**Browser-Check:** Logo-Asset unter `/assets/carcare-center-logo.webp` geladen. Bei 1440x900 ist die Desktop-Navigation sichtbar und ohne horizontalen Overflow. Bei 390x844 bleibt das Burger-Menue sichtbar, das Logo ist 168x48 px und es gibt keinen horizontalen Overflow.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Wortbildmarke ist im Header und Footer eingebunden.
2. Niedrig: Die angelieferte WebP hat viel Weissraum. Das Layout nutzt deshalb einen maskierten `object-cover`-Container. Fuer spaetere Produktion waere eine nativ zugeschnittene Logo-Datei noch sauberer.

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

