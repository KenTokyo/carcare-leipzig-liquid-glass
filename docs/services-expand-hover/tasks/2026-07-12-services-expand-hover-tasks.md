# Leistungsübersicht als ExpandOnHover-Akkordeon (skiper52)

> **Ziel:** Die Leistungsübersicht (`components/ServiceGrid.tsx`, 10 Karten) wird zum
> horizontalen **ExpandOnHover-Akkordeon** (skiper52) umgebaut — im **Kartendesign von
> „Für wen wir arbeiten"** (`TargetGroupCards.tsx`: Bild + weiße Textbox + blauer Punkt +
> CTA/Pfeil-Badge + animiertes Logo-Badge). Desktop = Akkordeon, Mobile = vertikaler
> Kartenstapel. Vorerst geteiltes Werkstattbild (pro Karte austauschbar).

## Referenz-Messung (live an skiper-ui.com/v1/skiper52, „ExpandOnHover")

- Eine `flex`-Reihe mit Bild-Panels (`rounded-3xl overflow-hidden`), kollabiert zu
  ~46px-Streifen; **ein Panel expandiert** (~288px), animiert über **`width`** (Inline-Style).
- Aktives Panel: Gradient-Overlay + Content-Text faden ein (`opacity` 0→1).
- Seite nutzt Lenis nur zum Glätten; der Effekt selbst = scroll-/hover-gekoppeltes Resize.

## Entscheidungen (mit User abgestimmt)

- **Umsetzung:** ExpandOnHover (Desktop) + vertikaler Stapel (Mobile), **mit vertikalen
  Labels** auf kollabierten Streifen (bleibt scannbar).
- **Bilder:** vorerst geteiltes `carcare-hero-workshop.jpeg`, pro Karte via
  `backgroundImage` austauschbar.
- **Technik:** Eigenbau. **Kein** `npx shadcn add` (shadcn/Next-Setup, würde Lenis/fremde
  Struktur reinziehen). Expand über **CSS-Transition auf `flex-grow`** (im Prototyp
  bestätigt smooth) statt Framer-`layout` (Flex-Layout-Thrash vermeiden); Section-Entrance
  bleibt Framer `whileInView`.

## Prototyp-Beleg (throwaway, wieder entfernt)

`public/_skiper52-preview.html` gebaut, im Browser mit **allen 10 Leistungen** verifiziert
(Desktop-Akkordeon + Hover-Wechsel + Mobile-Stapel), danach gelöscht. Ergebnis: on-brand,
scannbar, Mobile sauber.

---

## Phasen

### ✅ Phase 1 — Referenz, Prototyp & Entscheidung
* [x] skiper52 „ExpandOnHover" live inspiziert (flex-row, animierte `width`, opacity-Overlay)
* [x] Betroffene Komponenten gelesen: `ServiceGrid.tsx` (10 Karten), `TargetGroupCards.tsx` (Zieldesign)
* [x] Throwaway-Prototyp mit allen 10 Karten gebaut + im Browser gezeigt (Desktop/Hover/Mobile), dann entfernt
* [x] Optionen mit User abgestimmt (vertikale Labels, geteiltes Bild)
**Referenzen:** `docs/services-expand-hover/tasks/2026-07-12-services-expand-hover-tasks.md`

### ✅ Phase 2 — Typen & Daten
* [x] `OverviewService` um optional `cta` + `backgroundImage` erweitert (`types.ts`)
* [x] Pro Leistung kurzen `cta` gesetzt (TargetGroupCards-Stil)
**Referenzen:** `types.ts`, `components/ServiceGrid.tsx`

### ✅ Phase 3 — ServiceGrid Umbau
* [x] Reihe: Mobile `flex-col` (Stapel), Desktop `lg:flex-row lg:h-[460px]` (Akkordeon)
* [x] Panel: `flex-grow` per State (`active`), CSS-Transition; `onMouseEnter`/`onFocus` (Keyboard-a11y)
* [x] Kollabiert: vertikaler Leistungsname (`writing-mode`), faded bei aktiv aus (nur Desktop)
* [x] Expandiert/Mobile: weiße Textbox (Titel + blauer Punkt, Beschreibung, CTA + Pfeil-Badge) + Logo-Badge
* [x] `prefers-reduced-motion` respektiert; Content im initialen HTML (SEO/GEO crawlbar)
**Referenzen:** `components/ServiceGrid.tsx`

### ✅ Phase 4 — Verifikation & Doku
* [x] Preview: Desktop-Akkordeon (Ruhe/Hover/Keyboard-Focus), Mobile-Stapel, 0 Console-Fehler
* [x] Performance/Deckung geprüft; `tsc --noEmit` grün
* [x] Kommentare + Findings ergänzt
**Referenzen:** `components/ServiceGrid.tsx`

### ✅ Phase 5 — Mobile-Animation (skiper53) + CinematicShowcase entfernt
**Ziel:** Mobile-Karten wie skiper53 („ExpandOnHover vertical") animieren; die SVG-Scroll-Sektion nach der Autoaufbereitungs-Expertise entfernen.
* [x] skiper53 live gemessen: vertikales Akkordeon, volle Breite, kollabiert ~40px, aktiv ~291px (Hoehe animiert)
* [x] `ServiceGrid` Mobile: vertikales Akkordeon (`h-[64px]` ↔ `h-[340px]`, `transition-[height]`), Desktop unveraendert (`lg:transition-[flex-grow]`)
* [x] Label reagiert responsiv: horizontal (Mobile) / vertikal (Desktop); Badge nur auf aktiver Karte
* [x] Touch-Interaktion: Tap-to-expand via `hover`-Faehigkeitspruefung (`matchMedia('(hover: hover)')`), Hover/Focus nur auf Hover-Geraeten → kein Focus/Click-Konflikt
* [x] `CinematicShowcase` aus `pages/HomePage.tsx` entfernt (Import + Element); Datei bleibt (nicht importiert = nicht gebundelt), Hook `useScrollProgress` weiter von HeroSection genutzt
**Referenzen:** `components/ServiceGrid.tsx`, `pages/HomePage.tsx`

---

## Kommentare

### Phase 1–4 (ExpandOnHover-Leistungsübersicht)
**Eingehalten:** Referenz live gemessen ✅, Machbarkeit per Prototyp mit allen 10 Karten belegt ✅,
Planung + User-Abstimmung vor Code ✅, phasenweise dokumentiert ✅, Mobile-First (kein horizontales
Scrollen, sauberer Stapel-Fallback) ✅, < 700 Zeilen/Datei ✅ (~130), keine neue Dependency
(Framer + CSS-Transition, **kein** shadcn/Lenis) ✅, a11y (Fokus-Ring, `onFocus` klappt Karte auf,
`aria-label`, `prefers-reduced-motion` → `motion-reduce:transition-none`) ✅, SEO/GEO (alle Titel +
Beschreibungen im initialen HTML, crawlbar trotz Hover-Ausblendung) ✅, `tsc --noEmit` grün ✅,
Encoding sauber (Umlaute im UI korrekt, Kommentare ASCII-safe) ✅.

**Verifikations-Messwerte (Preview):**
- Desktop-Akkordeon: aktives Panel **447 px**, 9 kollabierte je **75 px**, kein Overflow; Fokus/State
  springt korrekt (Panel 3 fokussiert → `flexGrow` [.,.,.,6,.,.,.,.,.,.], Karten-Opacity 1).
- Mobile 375 px: `horizontalScroll=false`, 10 Karten als Stapel (je 311×260, 16 px Abstand), Textbox + Badge sichtbar.

**Auffälligkeiten/Findings (nach Schwere) — alle behoben/geklärt:**
1. 🟠 **Hoch (behoben):** Logo-Badge zunächst als animiertes MP4 (wie TargetGroupCards) → auf Mobile
   **10 parallele Autoplay-Videos** (Perf) und im Screenshot teils leerer weißer Kasten. **Fix:** statisches
   `carcare-center-logo.webp` (leicht, konsistent, zuverlässig). Desktop zeigt das Badge nur auf der aktiven
   Karte (kollabierte 75 px-Streifen: `lg:hidden`, zu eng).
2. 🟡 **Mittel (Tooling, kein Bug):** Die Preview-`computer hover`-Aktion triggert React-`onMouseEnter`
   nicht (Headless). Verifikation daher über den `onFocus`-Pfad (identische `setActive`-Logik) + direkte
   `flex-grow`-Messung → Interaktion nachweislich korrekt. Für echte Nutzer feuert Hover normal.
3. 🟡 **Mittel (Mess-Artefakt, kein Bug):** `flex-grow` transitioniert über 600 ms; eine Messung bei 150 ms
   zeigte scheinbar ein „falsches" aktives Panel (die alte, noch schrumpfende Karte war > 1.5). Nach Ablauf
   (800 ms) korrekt. Lehre: animierte Werte erst nach Transition messen (Inline-`style.flexGrow` = Wahrheit).
4. 🟢 **Niedrig (bewusst):** Beschreibungen sind auf Desktop erst beim Aufklappen sichtbar. Text bleibt im
   DOM (SEO/GEO unkritisch); vertikale Labels halten die Streifen scannbar.

**Empfehlung (kein offener Bug):** Der Skiper52-Effekt lebt von **unterschiedlichen** Bildern je Karte.
Aktuell teilen sich alle das Werkstattbild (`backgroundImage` pro Karte ist vorbereitet). Sobald 10
Leistungsfotos vorliegen, nur die `backgroundImage`-Felder setzen — kein Struktur-Umbau nötig.

**Hauptkomponenten (max. 3):** `components/ServiceGrid.tsx` (Umbau), `types.ts` (`OverviewService` erweitert),
`components/TargetGroupCards.tsx` (Design-Referenz).

**Fazit:** Alle Findings inline behoben/geklärt — kein separates Optimierungs-Task-File nötig.

### Phase 5 (Mobile skiper53 + CinematicShowcase-Entfernung)
**Eingehalten:** Referenz (skiper53) live gemessen ✅, Mobile-First ✅, Desktop-Akkordeon nachweislich
unveraendert (aktiv 447×460 / kollabiert 75×460) ✅, a11y (Fokus-Ring, `aria-expanded`, reduced-motion) ✅,
Touch-Pfad end-to-end verifiziert ✅, `tsc --noEmit` grün ✅, keine neue Dependency ✅, kein Mojibake ✅.

**Verifikations-Messwerte:**
- Mobile 375px: vertikales Akkordeon, aktiv **340px** / 9 kollabiert je **64px**, volle Breite, kein h-Scroll.
- Touch-Tap (mit erzwungenem `hoverCapable=false`): Klick auf kollabierten Streifen → `location='/'` (kein Navigieren),
  aktive Karte wechselt (idx 0 → 3). Zweiter Tap auf aktive Karte folgt dem Link. Desktop-Klick navigiert normal.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (VORBESTEHEND, ausgelagert — NICHT von dieser Aufgabe):** 6 der 10 Leistungskarten-`href`
   zeigen auf in `App.tsx` nicht definierte Routen → **404** (`/autolackierung-leipzig`, `/smart-repair-leipzig`,
   `/dellenentfernung-leipzig`, `/hagelschadenreparatur-leipzig`, `/felgenreparatur-leipzig`,
   `/fuhrparkservice-leipzig`). SEO-relevant (interne Verlinkung). Nicht stillschweigend umgebogen (Struktur-/
   SEO-Entscheidung; Standard fordert dedizierte Seiten je Leistung). Als Hintergrund-Task `task_fd7bf13d` angelegt.
2. 🟡 **Mittel (Tooling, kein Bug):** Die Preview meldet `hover: hover` (emuliert kein Touch), und synthetische
   Events triggern React nicht → der Touch-Tap-Pfad war nur durch temporaeres Hardcoden von `hoverCapable=false`
   testbar. Danach sauber zurueckgesetzt (echte `matchMedia`-Erkennung). Auf echten Geraeten greift der Pfad normal.
3. 🟢 **Niedrig (Hinweis):** `CinematicShowcase.tsx` ist nun verwaist (nicht importiert → nicht gebundelt). Bewusst
   nicht geloescht (leicht reaktivierbar). Auf Wunsch entfernbar.

**Hauptkomponenten (max. 3):** `components/ServiceGrid.tsx`, `pages/HomePage.tsx`, `App.tsx` (Routen-Analyse).

**Fazit Phase 5:** Beide Wuensche umgesetzt und verifiziert. Ein vorbestehendes 404-Link-Thema entdeckt und
sauber als separater Task ausgelagert statt es unpassend mitzufixen.
