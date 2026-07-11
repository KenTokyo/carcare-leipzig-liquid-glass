# Hero-Parallax (skiper29 / „Siena parallax")

> **Ziel:** Die Hero-Sektion (`components/HeroSection.tsx`) erhaelt den vertikalen
> Bild-Parallax der skiper29-Referenz: ein ueberformatiges Hintergrundbild, das
> per `translateY` langsamer als die Seite scrollt (Tiefen-/Lag-Effekt). **Kein**
> SVG-Masken-Reveal, **kein** Zoom — nur das reine Parallax der Hero-Sektion.

## Referenz-Messung (live an https://skiper-ui.com/v1/skiper29 gemessen)

Aufgezeichnete Live-Transforms beim Scrollen (Browser-Inspektion):

- **Hero-Bild** (`.h-[70vh] > img`): `transform: matrix(1,0,0,1,0,TY)` — **reines translateY**,
  **kein Scale, kein clip-path**. `TY` laeuft 0 → 231 px und wird dann geклapmt.
  231 px = exakt der Bild-Ueberhang (Bild 770 px in ~539 px-Rahmen). Effektiv
  bewegt sich das Bild mit ~0,6x der Scroll-Geschwindigkeit.
- Der `clip-path: url(#video)` + `scale(1 → 0.87)` liegt **nicht** auf dem Hero,
  sondern auf der sekundaeren „WATCH TRAILER"-Karte (`aspect-video`) → das ist der
  Masken-Effekt, den wir bewusst NICHT wollen.
- Seite nutzt **Lenis** (`<html class="dark lenis">`) nur zum Glaetten — der Effekt
  selbst ist reines scroll-gekoppeltes `translateY`.

## Geprуefte Loesungswege (bester gewaehlt)

- **A) Framer `useScroll({target})` + `useTransform`** → **VERWORFEN.** Der App-Shell
  `<main class="site-main-shell">` traegt `overflow-x-hidden` (computed
  `overflow-y:auto`) + `transform:translateZ(0)`. Framer erkennt ihn faelschlich als
  Scroll-Container (dessen `scrollTop` bleibt 0) → `scrollYProgress` friert bei 0 ein.
  Dokumentiert bereits im CinematicShowcase (Finding 2).
- **B) Lenis + useScroll** → **VERWORFEN.** Zusatz-Dependency; das Projekt vermeidet
  Lenis bewusst (siehe cinematic-scroll-Planung).
- **C) Manuelle Messung: window-`scroll` + `getBoundingClientRect`, rAF-gedrosselt,
  in eine `useMotionValue` gespeist** → **GEWAEHLT.** Immun gegen den
  overflow/transform-Vorfahren-Bug, bereits im CinematicShowcase bewaehrt. Als
  wiederverwendbaren Hook `useScrollProgress` extrahiert (DRY, spaeter auch fuer
  CinematicShowcase nutzbar).
- **Geometrie (deckungssicher):** Bild-Ebene `h-[130%]`, vertikal zentriert
  (`-top-[15%]`), `y` interpoliert progress 0..1 → `-10% … +10%` (der Ebenenhoehe).
  Bei ±10 % bleibt die Ebene immer >= Rahmen (Ueberhang 15 % je Seite) → **kein
  grauer Rand** an den Extremen. Gesamt-Travel ~26 % der Rahmenhoehe.
- **a11y:** `prefers-reduced-motion` → Parallax aus (Hook `enabled=false`), Bild
  statisch zentriert (`y=0`).

---

## Phasen

### ✅ Phase 1 — Analyse, Referenz-Messung & Entscheidung
**Ziel:** skiper29-Hero-Animation exakt bestimmen, Codebase-Randbedingungen klaeren.
* [x] skiper29 live inspiziert: Hero = **translateY-Parallax** (0→231 px), Maske/Scale nur auf Sekundaerkarte
* [x] Aktive Hero-Komponente identifiziert: `HeroSection.tsx` (nicht `Hero.tsx`)
* [x] `<main>`-overflow/transform-Bug bestaetigt → `useScroll({target})` unbrauchbar
* [x] Loesungsweg C (manuelle Messung + Hook) + deckungssichere Geometrie festgelegt
**Referenzen:** `docs/hero-parallax/tasks/2026-07-12-hero-parallax-tasks.md`, `components/HeroSection.tsx`, `index.css`

### ✅ Phase 2 — Hook `useScrollProgress`
**Ziel:** Wiederverwendbaren, robusten 0..1-Scroll-Fortschritt bereitstellen.
* [x] `hooks/useScrollProgress.ts` erstellt (window-scroll + getBoundingClientRect, rAF-gedrosselt)
* [x] Optionen `distance: 'self' | 'through'` und `enabled` (fuer reduced-motion)
* [x] Kommentar-Doku warum NICHT `useScroll` (overflow/transform-Vorfahren)
**Referenzen:** `hooks/useScrollProgress.ts`

### ✅ Phase 3 — Parallax in `HeroSection` einbauen
**Ziel:** Hintergrundbild als bewegte, ueberformatige Ebene mit translateY-Parallax.
* [x] Bild in bewegte `motion.div`-Ebene gekapselt (`h-[130%]`, `-top-[15%]`, `will-change-transform`)
* [x] `y = useTransform(progress, [0,1], ['-10%','10%'])`; `prefers-reduced-motion` → `y=0`
* [x] Veils/Verlaeufe bleiben statisch ueber der bewegten Ebene (Bild zieht darunter durch)
* [x] Inline-Verbesserung: `width/height` + `fetchpriority="high"` am LCP-Bild (CWV: CLS/LCP)
**Referenzen:** `components/HeroSection.tsx`

### ✅ Phase 4 — Verifikation & Doku
**Ziel:** Im Browser pruefen (Scroll, Screenshots, Console), Findings dokumentieren.
* [x] Preview: Parallax sichtbar (Bild zieht langsamer als Seite), 0 Console-Fehler
* [x] Deckung geprueft (kein grauer Rand an den Scroll-Extremen), Mobile + Desktop
* [x] Reduced-Motion gegengeprueft (statisch, kein Scroll-Hijack)
* [x] Kommentare + Findings ergaenzt
**Referenzen:** `components/HeroSection.tsx`, `hooks/useScrollProgress.ts`

---

## Kommentare

### Phase 1–4 (Hero-Parallax)
**Eingehalten:** Referenz zuerst live gemessen statt geraten ✅, Planung vor Code ✅,
mehrere Loesungswege geprueft + besten gewaehlt ✅, phasenweise + dokumentiert ✅,
Mobile-First (kein horizontales Scrollen, Deckung geprueft) ✅, < 700 Zeilen/Datei ✅
(HeroSection ~120, Hook ~70), keine neue Dependency (nur vorhandenes Framer Motion,
kein Lenis) ✅, a11y (`prefers-reduced-motion` → Parallax aus, kein Scroll-Hijack) ✅,
SSR/Prerender-tauglich (Bild im initialen HTML, nur Transform per JS) ✅, im Browser
verifiziert (Transform-Messung + Deckung + Screenshots) ✅, Encoding sauber (Umlaute in
User-Text korrekt, Kommentare ASCII-safe → kein Mojibake) ✅.

**Verifikations-Messwerte (Preview, Desktop):**
- progress 0 → `translateY(-106.9px)`; progress 1 → `translateY(+106.9px)` (Travel ~214 px ≈ 26 % Rahmenhoehe).
- Deckung an beiden Extremen intakt (min. 16 px Reserve), 0 Deckungs-Verletzungen ueber den ganzen Scroll.
- Mobile 375 px: `horizontalScroll=false`, Deckung intakt.
- Reduced-Motion (statisch, y=0): Deckung -123/+123 px (voll zentriert).

**Auffaelligkeiten/Findings (nach Schwere) — alle behoben:**
1. 🔴 **Kritisch (umgangen):** Framer `useScroll({target})` friert im App-Shell ein
   (`<main>` `overflow-x-hidden` → computed `overflow-y:auto` + `translateZ(0)`).
   **Fix:** manuelle window-Scroll-Messung (`useScrollProgress`), immun gegen den Vorfahren-Bug.
2. 🟠 **Hoch (behoben):** Duplikat — die identische Scroll-Progress-Logik lag inline im
   `CinematicShowcase` **und** waere im Hero erneut entstanden. **Fix:** in
   `hooks/useScrollProgress.ts` extrahiert (Optionen `distance` / `enabled`) und
   `CinematicShowcase` darauf refactored (−24 Zeilen). Reveal dort verifiziert
   (progress 0.5 @ Track-Mitte → Masken-Fenster W116/H109, exakt wie zuvor).
3. 🟡 **Mittel (behoben, Inline-Verbesserung):** Hero-LCP-Bild hatte **kein** `width/height`
   (CLS-Risiko) und keine Ladepriorisierung. **Fix:** `width={2400} height={1350}` +
   `fetchPriority="high"` (CWV: LCP/CLS) — direkt am ohnehin bearbeiteten Element.
4. 🟠 **Hoch (vorbestehend, behoben):** `tsc --noEmit` deckte **2 latente Typfehler** in
   `CinematicShowcase` auf (`introPointer`/`outroPointer`): Framers `useTransform` scheitert
   bei einem String-Literal-Union-Rueckgabewert (`'none' | 'auto'`) an der Overload-Aufloesung
   und typt den Callback-Parameter als `unknown` → `TS2365`. Nie aufgefallen, weil der Build
   (esbuild/vite) keinen echten Typecheck macht. **Fix:** explizite Annotation `(v: number)`.
   Danach `tsc --noEmit` = Exit 0. **Zusatz-Fix (umgesetzt):** `"typecheck": "tsc --noEmit"`
   als npm-Script ergaenzt (`package.json`), damit solche Fehler kuenftig auffallen; laeuft
   gruen (Exit 0). Optional spaeter in CI/`prebuild` verdrahten.
5. 🟢 **Niedrig (bewusst akzeptiert):** `will-change: transform` haelt eine dauerhafte
   Compositing-Ebene (minimaler Speicher). Fuer genau ein Hero-Element vertretbar und
   ruckelfreier; kein Handlungsbedarf.

**Deckungs-Geometrie (Nachweis kein grauer Rand):** Ebene `h-[130%]`, `-top-[15%]`
(→ 15 % Ueberhang je Seite), Travel `y ∈ [-10%, +10%]` der Ebenenhoehe (= ±13 % Rahmen).
Da 13 % < 15 %, bleibt an jedem Extrem >= 2 % Ueberhang stehen → Rahmen immer voll gedeckt.

**Hauptkomponenten (max. 3):** `components/HeroSection.tsx`, `hooks/useScrollProgress.ts`,
`components/CinematicShowcase.tsx` (Refactor auf den Hook).

**Fazit:** Alle Findings inline behoben — kein separates Optimierungs-Task-File noetig.
Empfehlung fuer spaeter (kein offener Bug): Parallax-Staerke (`h-[130%]` / `±10%`) bei
Bedarf zentral als Konstanten fuehren, falls weitere Sektionen denselben Effekt bekommen.
