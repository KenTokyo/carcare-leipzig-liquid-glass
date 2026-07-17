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

### ✅ Phase 6 — Section-Hintergrund flutet beim Hovern (Full-Bleed-Crossfade)
**Ziel (User, 2026-07-16):** Beim Hovern einer Kachel erscheint deren Bild als vollflaechiger
Hintergrund (`object-cover`) der **gesamten** Section — hinter dem Grid, mit weichem Crossfade
zwischen den Bildern. Ohne Hover blendet der Hintergrund wieder aus. State `hoveredImage` +
absolut positionierte Hintergrund-Ebene (`inset-0`, negativer z-index).

**Architektur-Entscheidung (mehrere Wege geprueft):**
- **A) Hover-State per Callback hochheben (GEWAEHLT):** `ExpandingCardAccordion` ist **geteilt**
  (`ServiceGrid` **und** `AutoDetailingExpertiseSection`). Die Hintergrund-Ebene gehoert aber auf die
  `<section>` in `ServiceGrid`. Loesung: das Akkordeon meldet via optionalem `onHoverChange(image|null)`,
  welche Karte gehovert wird; `ServiceGrid` haelt `hoveredImage` und rendert die Ebene. **Opt-in** —
  ohne den Callback (AutoDetailingExpertiseSection) aendert sich nichts.
- **B) Ebene im Akkordeon selbst:** VERWORFEN — traefe **beide** Sektionen und die `motion.div` des
  Akkordeons spannt nicht die ganze Section (Header liegt darueber).
- **C) Wrapper-Komponente:** VERWORFEN — Overkill fuer einen Callback + eine Ebene.

**Umsetzungsdetails (belegt durchdacht):**
* [x] `ServiceGrid`: `useState<string|null>` `hoveredImage`; Section `relative isolate` (eigener
      Stacking-Context, noetig weil der App-Shell `main` per `transform` bereits einen aufspannt —
      sonst rutscht `-z-10` in dessen Context; siehe [[site-shell-breaks-sticky]]).
* [x] Hintergrund-Ebene: `absolute inset-0 -z-10 overflow-hidden pointer-events-none aria-hidden`.
      Innerhalb `isolate` malt `-z-10` **ueber** die Section-Bg (`bg-gray-50/70`), aber **unter** den
      Content → exakt „hinter dem Grid" (im Browser bestaetigt: `zIndex: -10`).
* [x] Crossfade via Framer `AnimatePresence` + **keyed** `motion.div` (`key=hoveredImage`):
      Bildwechsel = altes Layer faded raus, neues rein (echtes Crossfade, `mode=sync`).
      `hoveredImage=null` → nichts gerendert → Section zeigt wieder ihre normale Bg (Idle **unveraendert**).
* [x] Heller Veil-Verlauf ueber dem Bild (`from-white/85 via-white/55 to-white/[0.72]`): haelt den dunklen
      Header (`text-gray-950/600`) lesbar; Teil des Fade-Layers, also nur bei Hover sichtbar.
* [x] `ExpandingCardAccordion`: Prop `onHoverChange?`; `onMouseEnter/onFocus` emittieren das
      **aufgeloeste** Kartenbild (`item.backgroundImage ?? DEFAULT_CARD_BG` = exakt das sichtbare Bild),
      `onMouseLeave`/`onBlur` **auf dem Container** (nicht pro Karte!) → beim Wechsel zwischen Karten
      kein Flackern zu null, nur beim Verlassen des ganzen Strips Reset.
* [x] **Kein** reduced-motion-Gate (Projektregel [[no-reduced-motion-gates]]); Opacity-Fade ist ohnehin
      unkritisch.
* [x] Perf: die Bilder sind **dieselben** WebP wie die Karten-Hintergruende → Cache-Hit, **kein**
      zusaetzlicher Download; Opacity-Fade ist GPU-guenstig.
* [x] Mobile: kein Hover → `hoveredImage` bleibt null → Section unveraendert (kein Extra-Gate noetig).
**Referenzen:** `components/ServiceGrid.tsx`, `components/ExpandingCardAccordion.tsx`

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

### Phase 6 (Section-Hover-Hintergrund, Full-Bleed-Crossfade)
**Eingehalten:** Architektur bewusst gewaehlt (Hover-State per Callback hochgehoben statt Ebene in die
**geteilte** Komponente zu legen → andere Sektion unberuehrt, opt-in) ✅, Planung vor Code ✅,
Stacking-Context-Falle des App-Shells beruecksichtigt (`isolate`) ✅, in echtem Chrome mit **echten**
mouseover/mouseout-Events verifiziert (App-Preview kann Hover nicht ausloesen) ✅, kein reduced-motion-Gate
(Projektregel) ✅, **kein** zusaetzlicher Download (Kachel-WebP = Cache-Hit) ✅, a11y (Fokus-Pfad
`onFocus`/`onBlur` mit `relatedTarget`-Check) ✅, `tsc --noEmit` gruen ✅, Mobile unveraendert (kein Hover)
✅, Encoding sauber ✅, < 700 Zeilen ✅.

**Verifikations-Messwerte (echter Chrome, 1440px):**
- Idle: `bildAktiv = null` (Section zeigt normale Bg, unveraendert). Ebene `zIndex: -10` (hinter Grid).
- Hover Karte 0 → `fahrzeugaufbereitung-…webp`; Hover Karte 4 → `dellenentfernung-…webp` (Crossfade belegt).
- Kartenwechsel: bleibt gesetzt (**kein** Flackern zu null). Strip verlassen (`mouseout` → relatedTarget
  ausserhalb): **null** (Reset). 0 Konsolenfehler.
- Screenshots: Header ueber geflutetem Bild klar lesbar (Veil traegt), Grid sitzt sauber davor.

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🟡 **Mittel (Test-Artefakt, kein Bug):** Ein nacktes `mouseleave`-Dispatch triggert React-`onMouseLeave`
   **nicht** — React synthetisiert Enter/Leave aus `mouseover`/`mouseout` + `relatedTarget`. Erster
   Leave-Test schlug daher scheinbar fehl; mit korrektem `mouseout`(relatedTarget ausserhalb) → Reset
   bestaetigt. **Lehre:** Hover/Leave in Chrome immer via `mouseover`/`mouseout` mit `relatedTarget` testen.
2. 🟢 **Niedrig (Mess-Artefakt):** Waehrend des 600ms-Crossfades sind **zwei** Bild-Layer gemountet
   (AnimatePresence); ein Sampling < 600ms liest je nach Selektor das ausblendende Bild. Nach Ablauf
   eindeutig. Kein Verhalten, nur Messung.
3. 🟢 **Niedrig (Design, bewusst):** Veil-Staerke (`from-white/85 via-white/55 to-white/[0.72]`) haelt den
   dunklen Header lesbar und laesst das Foto in den Raendern wirken. Bei Bedarf zentral justierbar.

**Hauptkomponenten (max. 3):** `components/ServiceGrid.tsx` (Ebene + State), `components/ExpandingCardAccordion.tsx`
(`onHoverChange`-Emission), `docs/services-expand-hover/…` (Planung).

**Fazit Phase 6:** Umgesetzt wie gewuenscht (State `hoveredImage`, absolut positionierte -z-10-Ebene,
Full-Bleed `object-cover`, Crossfade, Ausblenden ohne Hover) und in echtem Chrome verifiziert.

**Nachtrag (User-Feinschliff): Vignette + Eckenrundung**
* [x] **Ecken im Navbar-Radius** abgerundet: `rounded-[var(--cc-nav-radius)]` auf dem `overflow-hidden`-
      Container → Bild **und** Overlays werden auf die runde Form geclippt. Bewusst die **Variable**
      statt Literal (bleibt synchron, falls `--cc-nav-radius` sich aendert). Verifiziert: Ebene
      `border-radius: 24px` == `.solidroad-nav-frame` `24px`, `overflow: hidden`.
* [x] Vignette — 3 User-Iterationen: (1) **schwarz** (Tiefe) → (2) **weiss** (Raender laufen ins Weiss)
      → (3) **staerker weiss** („100 % weiss an den Raendern"). Finale Formel:
      `radial-gradient(ellipse closest-side at 50% 50%, rgb(255 255 255 / 0) 30%, rgb(255 255 255 / 1) 85%)`.
* [x] 🔑 **`closest-side` war der Schluessel:** Mit expliziter Groesse `120% 115%` lagen die **Seiten**
      nur bei ~42 % des Verlaufs (0.5w / 1.2w) → wurden nie ganz weiss, nur die Ecken (~57 %) etwas.
      `closest-side` legt das 100 %-Ende an die **naechsten Kanten** → alle vier Raender liegen hinter dem
      Weiss-Stop (85 %) und sind zu 100 % weiss. Objektiv per Pixel-Sampling belegt: 4 Ecken + Seiten =
      `rgb(255,255,255)`; Ober-Mitte 93 % (Navbar-Zone, praktisch weiss).
* [x] 🔑 **Kein `transparent` als Verlaufsstart** — `transparent` = Schwarz/Alpha0, interpoliert nach
      Weiss ueber einen **grauen** Zwischenton. Stattdessen `rgb(255 255 255 / 0)` (transparentes Weiss)
      → nur Alpha aendert sich, reiner Weiss-Feder ohne Saum.
* [x] Veil-Mitte reduziert (`from-white/80 via-white/25 to-white/55`), damit die Bildmitte neben der
      starken weissen Vignette sichtbar bleibt. Verifiziert (echter Chrome): Header lesbar, kein Grausaum,
      Bild sitzt zentral und laeuft randlos ins Weiss, `tsc` gruen.

**Nachtrag (User-Feinschliff 2): Persistenz + Rechts-Shift + Vignette −10 %**
* [x] **Hintergrund bleibt an der AUFGEKLAPPTEN Karte** (nicht mehr hover-transient). Umbau von
      Hover-Emission auf **aktiv-getrieben**: Prop `onHoverChange` → `onActiveImageChange`; das Akkordeon
      meldet via `useEffect([active, isDesktop])` das Bild der offenen Karte (Mount `active=0` + jeder
      Wechsel), Reset-Handler (`onMouseLeave`/`onBlur` → null) **entfernt**. Auf Desktop ist immer eine
      Karte offen → Hintergrund **sofort da** und **bleibt**, wenn die Maus den Strip verlaesst.
      Mobile: `null` (kein Full-Bleed hinter dem Stapel). Verifiziert: Idle (kein Hover) zeigt Karte 0;
      Hover Karte 5 → deren Bild; Strip verlassen → **bleibt** Karte 5. Schoener Effekt: offene Karte
      und Section-Hintergrund sind dasselbe Motiv.
* [x] **Bild nach rechts verschoben** (Desktop): Radial-Zentrum `50% 50%` → **`58% 48%`** → klares
      Bildfenster sitzt rechts der Mitte, die linke Haelfte (Header „Leistungsuebersicht") wird dadurch
      weiss. Zusaetzlich leichter horizontaler Links-Weiss-Verlauf fuer das rechte H2-Ende
      (`linear-gradient(to right, .../0.85 0%, .../0.45 28%, .../0 52%)`). Pixel-Sampling: Header-Zone
      links `rgb(255,255,255)`; Bild sichtbar center-right.
* [x] **Vignette ~10 % schwaecher:** klare Mitte `30 %→33 %`, deckendes Weiss `85 %→90 %`; Veil leicht
      runter (`from-white/75 via-white/[0.18] to-white/45`). `tsc` gruen, 0 Konsolenfehler.
* [x] 🟢 **Semantik-Klarstellung:** Der Effekt reagiert auf `active` (= aufgeklappte Karte). Da Hover auf
      Desktop die Karte aufklappt (`setActive`), folgt der Hintergrund weiterhin dem Hover — bleibt aber
      nun stehen, weil `active` nach dem Verlassen erhalten bleibt (statt auf null zurueckzusetzen).
