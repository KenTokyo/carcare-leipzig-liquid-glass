# Mainpage Lean-Restructure (v2-Umsetzung)

> **Ziel:** Die Startseite von der Katalog-Struktur (13 Sektionen) auf eine conversion-fokussierte
> Struktur (**9 Sektionen**) bringen — Redundanzen zusammenführen, Tiefe auf die bestehenden
> Unterseiten auslagern. Basis: freigegebener v2-Wireframe.
> **Grundprinzip:** Nichts löschen → zusammenführen / auslagern. Content lebt auf den dedizierten Seiten weiter.

## Präzisierungen ggü. v2-Wireframe
- **FAQ bleibt** (im Wireframe versehentlich weggelassen) — SEO/GEO-wertvoll, nicht redundant.
- **Bewertungen:** KEINE Fake-Reviews. Struktur wird vorbereitet/geflaggt; echte Google-Daten sind Voraussetzung (separater Schritt).

## Ziel-Reihenfolge HomePage
1. Hero (USP hoch, 3→2 CTAs) · 2. TrustBar · 3. Leistungen (ServiceGrid) · 4. Unfall & Schaden (straff)
· 5. Für wen wir arbeiten (3 Karten) · 6. Prozess · 7. Autoaufbereitung-Wissen (Teaser) [+ Reviews pending]
· 8. FAQ · 9. Kontakt (Formular + Infos gemergt)

**Von der Startseite entfernt (Content bleibt auf Unterseiten/Komponenten):**
BusinessCustomerSection → `/geschaeftskunden` · CareerTeaser → `/karriere` · References (generisch, ersetzt durch künftige Reviews) · ContactCTA (in Kontakt gemergt).

---

## Phasen

### ✅ Phase 1 — Plan & Entscheidungen
* [x] v2 freigegeben; Präzisierungen (FAQ bleibt, keine Fake-Reviews) festgehalten
* [x] Ziel-Reihenfolge + Merge-/Auslager-Matrix definiert
**Referenzen:** `pages/HomePage.tsx`

### ✅ Phase 2 — Hero: USP hoch, 3→2 CTAs
* [x] USP-Eyebrow „Meisterbetrieb · Glasurit-Lackpartner · seit 1993" (aus USP_BAUSTEINE); Standort-Pille bleibt
* [x] 3 CTAs → 2 (Schaden melden + Termin anfragen), „Leistungen ansehen" entfernt (Leistungen steht direkt darunter + Navbar)
**Referenzen:** `components/HeroSection.tsx`

### ✅ Phase 3 — Unfall & Schaden straffen
* [x] 8 Feature-Chips → 4 Kern-Schritte (Schadenaufnahme · Gutachten & Kalkulation · Versicherungsabwicklung · Ersatzwagen)
* [x] CTAs beibehalten (Schaden melden + Anrufen — hoher Intent, Telefon bei Unfall wertvoll)
**Referenzen:** `components/AccidentDamageSection.tsx`

### ✅ Phase 4 — „Für wen wir arbeiten" (Merge 03+08)
* [x] `TargetGroupCards` 4→3 Karten (Bewerber entfernt; lebt auf `/karriere`)
* [x] `BusinessCustomerSection` von HomePage entfernt (6 Benefits leben auf `/geschaeftskunden`); B2B-Karte verlinkt dorthin
**Referenzen:** `components/TargetGroupCards.tsx`, `pages/HomePage.tsx`

### ✅ Phase 5 — Autoaufbereitung → Wissens-Teaser
* [x] Zweites Akkordeon entfernt; schlanker Teaser (Heading + Intro + Artikel-Chips → `/autoaufbereitung-wissen` + CTA)
**Referenzen:** `components/AutoDetailingExpertiseSection.tsx`

### ✅ Phase 6 — Kontakt (Merge 12+13)
* [x] Kontaktinfos (Adresse/Öffnungszeiten/Telefon) aus `ContactCTA` in `ContactSection` integriert; `ContactCTA` von HomePage entfernt
**Referenzen:** `components/ContactSection.tsx`

### ✅ Phase 7 — HomePage neu ordnen
* [x] Neue Reihenfolge; Imports/Usage von BusinessCustomerSection, CareerTeaser, References, ContactCTA entfernt; FAQ bleibt
**Referenzen:** `pages/HomePage.tsx`

### ✅ Phase 8 — Verifikation & Doku
* [x] `tsc --noEmit` grün; Preview Desktop + Mobile: 9 Sektionen in Reihenfolge, 0 Console-Fehler, Screenshots
* [x] Orphan-Check (entfernte Komponenten); Reviews-Slot als offen dokumentiert
* [x] Kommentare + Findings
**Referenzen:** `pages/HomePage.tsx`

## Kommentare

### Phase 1–8
**Eingehalten:** phasenweise + dokumentiert ✅, **kein Content gelöscht** (Komponenten bleiben im Code; Tiefe
lebt auf `/geschaeftskunden`, `/karriere`, den Leistungsseiten & dem Wissenshub) ✅, Themencluster-Prinzip
(Startseite = eine Intention, Unterseiten = Keyword-Tiefe) ✅, `tsc --noEmit` grün ✅, 0 Console-Fehler ✅,
Mobile-First (kein h-Scroll @375px, Grids stacken) ✅, keine Fake-Daten ✅, Encoding sauber ✅.

**Verifikation (Preview):**
- Reihenfolge (9 Sektionen): `home · trust · leistungen · unfall-schaden · zielgruppen · prozess · autoaufbereitung · faq · contact-form`.
- Hero: USP-Eyebrow „Meisterbetrieb · Glasurit-Lackpartner · seit 1993", **2 CTAs** (Schaden/Termin).
- „Für wen": **3 Karten**, Desktop 3-Spalten / Mobile 1-Spalte (browser-sichtbar bestätigt).
- Autoaufbereitung: Teaser-Chips statt Akkordeon; FAQ vorhanden & funktionsfähig; Kontakt mit integrierten Infos.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (OFFEN, Voraussetzung Daten):** Sektion „Bewertungen" wurde **bewusst nicht** gebaut – ich
   fabriziere **keine** Fake-Google-Reviews (Verstoß gegen SEO-Standard 5.3 + Google-Richtlinien). Sobald echte
   Rezensionen / ein Widget vorliegen, ergänze ich die Sektion (Rating + Review-Karten, ggf. `AggregateRating`-Schema).
2. ✅ **Erledigt (Dead-Code entfernt):** `BusinessCustomerSection.tsx`, `CareerTeaser.tsx`, `References.tsx`
   gelöscht (`git rm`); ungenutzten `ReferencePoint`-Typ aus `types.ts` entfernt; `tsc` grün.
   `ContactCTA.tsx` bleibt (nutzt `KnowledgeHubPage`). **Weitere Orphans auf User-Wunsch ebenfalls gelöscht:**
   `BusinessSection.tsx` (+ `BusinessBenefit`-Typ), `CinematicShowcase.tsx`, `Services.tsx` (+ `ServiceItem`-Typ).
   → Insgesamt **6 verwaiste Komponenten + 3 Typen** entfernt; `tsc` grün, 0 hängende Referenzen.
   `useScrollProgress`-Hook bleibt (von `HeroSection` genutzt). Falls Inhalte zurückgewünscht: über die normalen Unterseiten.

### Nachtrag — Kontaktformular-Layout-Fix
**Problem (vom User gemeldet):** 292px Leerraum über den Tabs (alter `-mt-32 pt-32`-Scroll-Anker-Hack × 3 +
`space-y-3`) + linke Spalte durch eingedrückte Info-Karten zu hoch (1054 vs. 859px).
**Fix (`ContactSection.tsx`):** Anker via `scroll-mt-32` (kein Layout-Verzug, Lücke = 0px); Kontaktinfos als
volle 3-Spalten-Reihe unter dem Formular (je 391px). `tsc` grün, browser-verifiziert.
3. 🟢 **Niedrig (bewusst):** FAQ behalten (Wireframe-Korrektur) · Unfall-Chips 8→4 gestrafft (Reparaturdetails
   in der Leistungsübersicht & auf `/unfallinstandsetzung-leipzig`) · Hero-Chips (Service-Keywords) bewusst behalten.

**Hauptkomponenten (max. 3):** `pages/HomePage.tsx` (Reihenfolge/Komposition), `components/HeroSection.tsx`
(USP + CTAs), `components/ContactSection.tsx` (Merge Kontaktinfos).

**Fazit:** Startseite von 13 → **9** Sektionen gestrafft, conversion-fokussiert, ohne Content-Verlust –
browser-verifiziert (Desktop + Mobile). Zwei offene Punkte: echte Bewertungen (Daten nötig) + Dead-Code-Entscheidung.
