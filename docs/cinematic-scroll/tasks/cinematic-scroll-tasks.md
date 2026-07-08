# Cinematic Scroll-Animation (siena.film / skiper29)

> **Ziel:** Eine kinoreife, scroll-getriebene Reveal-Sektion auf der Startseite einbauen,
> inspiriert von [skiper29](https://skiper-ui.com/v1/skiper29) bzw. siena.film:
> scroll-basiertes Bild-Scaling + custom SVG-Masken-Reveal + Play-Button-Overlay
> (video-artige Präsentation).

## Feasibility-Analyse (Ergebnis: MACHBAR ✅)

- **Framer Motion** ist bereits als Dependency vorhanden (`framer-motion@^12`) — die
  Kern-Voraussetzung. `useScroll` / `useTransform` / `useReducedMotion` stehen bereit.
- **Lenis (Smooth Scroll)** wird bewusst **NICHT** ergänzt: `useScroll` arbeitet mit
  nativem Scroll, `html { scroll-behavior: smooth }` ist bereits gesetzt. Vermeidet eine
  zusätzliche Dependency + globalen RAF-Loop (Konfliktrisiko). Optionale Erweiterung.
- Der skiper29-Original-Code liegt hinter einer Pro-Paywall. Technik-Grundlage sind zwei
  offen dokumentierte Verfahren von Olivier Larose (Original-Autor):
  - **Zoom Parallax** — sticky Container + `useTransform` scale beim Scrollen.
  - **SVG Mask Scroll** — wachsende SVG-Maske gibt das Bild frei.
- **Eigenbau statt Copy** ist sinnvoll: Original nutzt Next.js + Lenis; dieses Projekt ist
  Vite + eigener Router + eigene CI (Blau/Graphit). Eigene Komponente = passgenau, on-brand,
  ohne Fremd-Dependencies.

## Technische Umsetzung

- Sticky-Track (`h-[320vh]`) → `sticky h-[100svh]` Viewport.
- Bild-Ebene mit `scale`-Transform (scroll-based image scaling).
- **Custom SVG-Maske:** weisse Matte (Seiten-BG) mit einem zentrierten Fenster-Rechteck,
  das per MotionValues (`width/height/x/y/rx` als SVG-Attribute) beim Scrollen aufgeht →
  Bild wird sichtbar. Authentischer „custom SVG mask effect".
- **Play-Button + Intro-Caption** (video-like) zentriert, faden früh aus.
- **Outro:** Headline + CTA faden gegen Ende ein (auf full-bleed Bild, dunkler Grade).
- **Reduced-Motion:** separate statische Variante (kein Scroll-Hijack), a11y-konform.
- **SEO/Prerender:** gesamtes DOM (Bild, `<h2>`, CTA) im initialen HTML; nur Transforms
  per JS → Puppeteer-Prerender erfasst Inhalt. Faktenbasierte Copy (3.000 m², 30+ Jahre,
  Glasurit, Meisterbetrieb) statt Floskeln (E-E-A-T).

---

## Phasen

### ✅ Phase 1 — Feasibility & Planung
**Ziel:** Referenz analysieren, Machbarkeit prüfen, Technik + Platzierung festlegen.
* [x] skiper29 / siena.film-Effekt analysiert (Framer Motion + Lenis, SVG-Maske + Zoom)
* [x] Codebase geprüft: React 19 + Vite, Framer Motion vorhanden, Tailwind-CDN, Prerender
* [x] Entscheidung: Eigenbau mit Framer Motion, ohne Lenis
* [x] Platzierung festgelegt: HomePage nach `AutoDetailingExpertiseSection`, vor `ProcessTimeline`
* [x] Planungsdoc angelegt
**Referenzen:** `docs/cinematic-scroll/tasks/cinematic-scroll-tasks.md`

### ✅ Phase 2 — Komponente `CinematicShowcase.tsx`
**Ziel:** Scroll-Reveal-Komponente bauen (Zoom + SVG-Maske + Play + Outro + Reduced-Motion).
* [x] `ScrollShowcase`: pinbare Ebene, Bild-Scale (1.32→1.04), SVG-Masken-Fenster (MotionValues `width/height/x/y/rx`)
* [x] Play-Button-Overlay (Puls-Animation) + Intro-Pill + Caption, faden aus (0→0.16)
* [x] Outro-Headline (`<h2 id="cinematic-heading">`) + CTA, faden ein (0.6→0.92), cinematic Grade
* [x] `StaticShowcase` für `prefers-reduced-motion` (Bild + Play oben, dunkles Text-Panel darunter)
* [x] Mobile-First, ~260 Zeilen (< 700), faktenbasierte deutsche Copy (Sie): 3.000 m², 30+ Jahre, Glasurit, Meisterbetrieb
**Referenzen:** `components/CinematicShowcase.tsx`

### ✅ Phase 3 — Integration HomePage
**Ziel:** Sektion in den Startseiten-Flow einbinden.
* [x] Import + Platzierung in `pages/HomePage.tsx` (nach `AutoDetailingExpertiseSection`, vor `ProcessTimeline`)
**Referenzen:** `pages/HomePage.tsx`

### ✅ Phase 4 — Verifikation & Doku
**Ziel:** Im Browser prüfen (Preview), Phasen dokumentieren, Kommentare + Findings.
* [x] Preview verifiziert: Intro (Play) → Reveal → Outro (Screenshots) auf Mobile **und** Desktop
* [x] Console auf Fehler geprüft (0 Fehler)
* [x] Reduced-Motion (statische Variante) gegengeprüft — sauberes Bild-+-Panel-Layout
* [x] Alle Findings inline gefixt; projektweites Tailwind-Thema als separate Aufgabe ausgelagert
**Referenzen:** `components/CinematicShowcase.tsx`, `pages/HomePage.tsx`

### ✅ Phase 5 — Play-Button funktional machen (User-Feedback)
**Ziel:** Play-Button war (originalgetreu) dekorativ; Nutzer erwartete eine echte Interaktion. Gewählt: „Reveal per Klick abspielen".
* [x] Gemeinsame `RevealStage` extrahiert (aus `progress` abgeleitet), echter `<button>` mit `aria-label`
* [x] Scroll-Variante: Klick → sanftes Auto-Scrollen (eased rAF) durch die Enthüllung
* [x] Reduced-Motion-Variante: Klick → In-place-Wiedergabe per eigenem rAF-Tween (`progress.set`), + „Zurückspulen"
* [x] Verifiziert: Klick öffnet Reveal (Screenshot geschlossen → offen mit Headline/CTA)
**Referenzen:** `components/CinematicShowcase.tsx`

---

## Kommentare

### Phase 1–4 (Cinematic Scroll-Showcase)
**Eingehalten:** Feasibility zuerst geprüft ✅, Planungsdoc vor Code ✅, phasenweise + dokumentiert ✅,
Mobile-First ✅, < 700 Zeilen/Datei ✅ (~260), keine neue Dependency (nur vorhandenes Framer Motion) ✅,
SSR/Prerender-tauglich (Inhalt im initialen DOM) ✅, a11y (Reduced-Motion-Variante, `aria-labelledby`) ✅,
faktenbasierte Copy statt Floskeln (E-E-A-T) ✅, genau eine `<h1>`-Regel respektiert (Sektion nutzt `<h2>`) ✅,
lokales Bild statt fragiler externer Quelle (SEO) ✅, Encoding sauber (Umlaute korrekt, kein Mojibake) ✅.

**Auffälligkeiten/Findings (nach Schwere) — alle behoben:**
1. 🔴 **Kritisch (behoben):** `position: sticky` pinnt nicht. Das umgebende `<main class="site-main-shell">`
   nutzt `overflow-y:auto` + `transform:translateZ(0)` (gegen Scroll-Flackern) → bricht `sticky`/`fixed`.
   **Fix:** Manuelles Pinning per `translateY`-Transform (0→220 % der Ebenenhöhe = Track 320svh − 100svh).
2. 🔴 **Kritisch (behoben):** Framer `useScroll({target})` friert bei `scrollYProgress = 0` ein — erkennt
   `<main overflow-y:auto>` als Scroll-Container, dessen `scrollTop` bleibt aber 0 (gescrollt wird das window).
   **Fix:** Eigener Scroll-Fortschritt via window-`scroll`-Listener + `getBoundingClientRect` (rAF-gedrosselt),
   robust gegen `overflow`/`transform`-Vorfahren **und** Layout-Shifts durch Lazy-Bilder.
3. 🟠 **Hoch (behoben, + projektweit ausgelagert):** Tailwind-Opacity-Modifier (`bg-black/45`, `text-white/90`,
   `from-black/75`) funktionieren NICHT — die Config (`index.html`) mappt white/black/blue auf reine CSS-`var()`,
   die Tailwind nicht in RGB-Kanäle zerlegen kann → transparent bzw. Fallback-Farbe.
   **Fix (hier):** Kanal-Variablen als Arbitrary-Value, z. B. `rgb(var(--cc-carbon-rgb)/0.55)` (wie HeroSection-Shadows).
   **Projektweit:** Verifiziert, dass auch bestehende Komponenten betroffen sind — HeroSection `bg-white/90`,
   `bg-white/[0.84]`, `bg-white/95` rendern zu `rgba(0,0,0,0)`. → Als eigenständige Aufgabe ausgelagert
   (Task „Tailwind Opacity-Modifier projektweit reparieren", `task_d385fdbe`), da cross-cutting und Regressions-riskant.
4. 🟡 **Mittel (behoben):** Mobile Fixed-Bottom-Bar (`lg:hidden`, 83 px) überlappte den Outro-CTA.
   **Fix:** `pb-28 lg:pb-16` am Outro.
5. 🟡 **Mittel (behoben):** Statische Variante — zentrierter Play-Button überlappte den Overlay-Text auf niedrigem Bild.
   **Fix:** Umbau auf „Bild + Play oben, dunkles Text-Panel darunter" (keine Überlappung).
6. 🟢 **Niedrig (behoben):** Ursprünglich externes Unsplash-Bild → auf lokales Asset
   `/assets/carcare-hero-workshop.jpeg` umgestellt (Robustheit + SEO: lokal, explizite Dimensionen).

**Hauptkomponenten (max. 3):** `components/CinematicShowcase.tsx`, `pages/HomePage.tsx`, `index.html` (Tailwind-Config-Kontext).

**Fazit:** Alle Findings dieser Planung wurden inline behoben. Kein Optimierungs-Task-File nötig (nichts offen);
das einzige nicht-inline-fixbare, projektweite Thema (Finding 3) ist als separate Aufgabe dokumentiert und ausgelagert.
Nachtrag: Finding 3 wurde am 2026-07-08 in einer separaten Session zentral gefixt (Config nutzt jetzt `<alpha-value>`);
der hier genutzte Kanal-Var-Workaround funktioniert weiterhin.

### Phase 5 (Play-Button funktional)
**Eingehalten:** Nutzer-Feedback direkt umgesetzt ✅, echte Interaktion + a11y (`<button>`, `aria-label`, Focus-Ring) ✅,
Reduced-Motion respektiert (Wiedergabe nur nutzerausgelöst, kein Scroll-Hijack) ✅, < 700 Zeilen ✅, im Browser verifiziert ✅.

**Auffälligkeiten/Findings (nach Schwere) — alle behoben:**
1. 🟠 **Hoch (behoben):** Framer Motions `animate()` bewegt den `progress`-Wert bei `prefers-reduced-motion` NICHT.
   **Fix:** Eigener rAF-Tween mit `progress.set()` pro Frame (imperativ → nicht unterdrückt), analog zum Scroll-Driver.
2. 🟡 **Mittel (Tooling, kein Code-Bug):** Die Preview rendert als **verstecktes Dokument** (`visibilityState:'hidden'`) →
   `requestAnimationFrame` ist pausiert, Timer auf 1 s gedrosselt. Zeit-basierte Animationen sind dort nicht im Leerlauf
   testbar (nur während Scroll/Paint). Real sichtbare Browser sind nicht betroffen. Verifikation daher über Klick →
   Screenshot (Sichtbarkeits-Fenster) + geteilte, bereits bewiesene `RevealStage`-Rendering-Zustände.
3. 🟢 **Niedrig (behoben):** Perpetuelle Puls-Animation (erst Framer, dann CSS `animate-ping`) → entfernt.
   Grund: unnötiger Dauer-Repaint + Screenshot-Timeouts; der weiße Play-Button mit Hover-Skalierung reicht als Affordance.

**Hinweis Verifikation:** Der Screenshot-Renderer hing zwischenzeitlich (alter Preview-Prozess); nach Neustart des
Preview-Servers sauber: geschlossener „Player" → Klick → voll enthüllter Zustand mit Headline/CTA bestätigt.
