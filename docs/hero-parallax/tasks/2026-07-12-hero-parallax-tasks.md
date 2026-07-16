# Hero-Parallax (skiper29 / „Siena parallax")

> **Ziel:** Die Hero-Sektion (`components/HeroSection.tsx`) erhaelt den vertikalen
> Bild-Parallax der skiper29-Referenz: ein ueberformatiges Hintergrundbild, das
> per `translateY` langsamer als die Seite scrollt (Tiefen-/Lag-Effekt). **Kein**
> SVG-Masken-Reveal, **kein** Zoom — nur das reine Parallax der Hero-Sektion.

## Referenz-Messung (live an https://skiper-ui.com/v1/skiper29 gemessen)

Aufgezeichnete Live-Transforms beim Scrollen (Browser-Inspektion):

- **Hero-Bild** (`.h-[70vh] > img`): `transform: matrix(1,0,0,1,0,TY)` — **reines translateY**,
  **kein Scale, kein clip-path**. `TY` laeuft 0 → 231 px und wird dann geclampt.
  231 px = exakt der Bild-Ueberhang (Bild 770 px in ~539 px-Rahmen). Effektiv
  bewegt sich das Bild mit ~0,6x der Scroll-Geschwindigkeit.
- Der `clip-path: url(#video)` + `scale(1 → 0.87)` liegt **nicht** auf dem Hero,
  sondern auf der sekundaeren „WATCH TRAILER"-Karte (`aspect-video`) → das ist der
  Masken-Effekt, den wir bewusst NICHT wollen.
- Seite nutzt **Lenis** (`<html class="dark lenis">`) nur zum Glaetten — der Effekt
  selbst ist reines scroll-gekoppeltes `translateY`.

## Gepruefte Loesungswege (bester gewaehlt)

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

### ✅ Phase 5 — KORREKTUR: reduced-motion-Gate machte den Parallax beim User tot
**Symptom (User, 2026-07-16):** „Durch den Pull ist die Scroll-Animation vom Hero-Bereich nicht mehr da."
**Ziel:** Ursache belegen (Pull? Gate?) und den Parallax fuer den User sichtbar machen.

**Diagnose (belegt, nicht geraten):**
* [x] Pull-Diff geprueft: `9b73d0b`/`998b007` aendern an `HeroSection.tsx` **nur** Badge-Text +
      entfernten „Leistungen ansehen"-Button (+ `ArrowRight`-Import). Die Parallax-Zeilen
      (`enabled: !reduceMotion`, `useTransform`, `y`) sind **bit-identisch** zu vorher;
      `hooks/useScrollProgress.ts` war gar nicht Teil des Pulls → **Pull ist NICHT die Ursache.**
* [x] `git log -S"enabled: !reduceMotion"` → Gate kam mit **`bf95b56` (2026-07-12)**, also im
      **selben Commit, der den Parallax einfuehrte**. Er war beim User nie an.
* [x] Im Browser gemessen: `prefers-reduced-motion: reduce` = **true**, Parallax-Ebene
      `transform: none` → Gate schaltet ab wie vorgesehen.
* [x] **Widerspruch aufgedeckt:** Die Akkordeon-Korrektur (`6b87b1b`, 2026-07-13, Phase 5 dort)
      entfernte ihr eigenes Gate und begruendete das ausdruecklich mit „Konsistenz mit
      **ungegated Hero-Parallax**" — diese Annahme war **falsch**, der Hero war die ganze Zeit gegated.
      Damit ist der Hero der letzte Ausreisser gegen die am 13.07. getroffene Projektentscheidung.

**Umsetzung:**
* [x] Gate entfernt: `useReducedMotion`-Import + Aufruf raus, `enabled`-Option entfaellt
      (Default `true`), `style={{ y: parallaxY }}` immer aktiv
* [x] Begruendung im Code dokumentiert (Windows „Animationseffekte aus" meldet reduced-motion
      systemweit → Gate toetet die Marken-Animation beim echten Nutzer; Site animiert ungegated)
* [x] Verifiziert: Preview erzwingt reduced-motion → **genau deshalb** ist sie jetzt der
      haerteste Testfall; Parallax laeuft dort messbar (Transform-Sampling ueber den Scroll)
* [x] `npm run typecheck` gruen
* [x] Encoding-Defekte in dieser Datei behoben: `geклapmt` → `geclampt`, `Geprуefte` → `Gepruefte`
      (kyrillische Homoglyphe к/л/у statt lateinischer cl/u)
**Referenzen:** `components/HeroSection.tsx`, `docs/mobile-accordion-animation/tasks/2026-07-12-mobile-accordion-animation-tasks.md`

### ✅ Phase 6 — Parallax-STAERKE an die Referenz angeglichen (Rate 0.75x -> 0.571x)
**Symptom (User, 2026-07-16):** „Es ist nicht angepasst … es geht um die Scroll-Animation von der
Hero-Sektion [von skiper29] und nicht darunter. Bau es bitte wieder nach."
**Ziel:** Die skiper29-Hero-Bewegung **exakt** treffen, nicht nur „ein Parallax".

**Referenz-Neumessung (live, echter Chrome via Puppeteer, `https://skiper-ui.com/v1/preview/skiper29`):**
* [x] Bestaetigt: Hero = **reines translateY**, Maske/Zoom liegen auf der Karte **darunter**
      (`div.mt-35` mit `clip-path:url(#video)` + Scale 1→0.854; inneres Bild Scale 1→1.146).
      Die Abgrenzung aus Phase 1 war also **richtig** — der User bestaetigt sie ausdruecklich.
* [x] **Exakte Geometrie neu erfasst** (das fehlte in Phase 1):
      Rahmen `relative flex h-[70vh] w-screen items-end overflow-hidden` = **560 px**;
      Bild `h-screen w-full object-cover` = **800 px**; **Ueberhang 240 px**;
      Verhaeltnis Bild/Rahmen = **1.4286**.
      `ty` laeuft **0 → 240 px** und ist **exakt nach einer Rahmenhoehe (560 px) Scroll** fertig,
      danach geclampt. Deckung an beiden Enden **exakt 0** (bei `ty=0` bündig unten, bei `ty=240` bündig oben).
* [x] **Kernformel abgeleitet:** Reise = **voller Ueberhang** → Rate = `Ueberhang/Rahmen` = **0.4286**
      → Bild zieht mit **1 − 0.4286 = 0.571x** der Scrollgeschwindigkeit.

**Abweichung unserer Umsetzung (die eigentliche Ursache der Beschwerde):**
* [x] Wir hatten `h-[130%]` + Reise `±10 %` = **26 % der Rahmenhoehe** → Rate 0.26 → **0.74x**.
      Der Ueberhang (30 %) wurde also **nicht ausgereizt** (nur 26 von 30 %), und das Verhaeltnis
      war mit 1.30 statt 1.4286 zu klein. Ergebnis: Effekt ca. **40 % zu schwach** — technisch
      „ein Parallax", aber nicht **die** Referenz-Bewegung. Phase 1 hatte die Rate (~0.6x) zwar
      notiert, sie aber **nie gegen die eigene Geometrie gerechnet**.

**Umsetzung (Rate exakt getroffen, Komposition bewusst behalten):**
* [x] Ebene `h-[130%]` → **`h-[147%]`**, `-top-[15%]` → **`-top-[23.5%]`** (weiterhin zentriert)
* [x] Reise `['-10%','10%']` → **`['-14.6%','14.6%']`** (% der Ebenenhoehe)
      → Δ = 0.292 × 1.47 = **0.4292 der Rahmenhoehe** → **0.5708x** (Referenz: 0.5714x)
* [x] **Zentrierte Komposition beibehalten** statt `items-end` der Referenz zu kopieren: deren
      Bottom-Alignment ist auf ihr 70vh-Layout gemuenzt; unser Hero ist ~92svh mit auf die Bildmitte
      abgestimmten Veils (`hero-copy-veil`, Weiss-Verlaeufe). Uebernommen wird die **Bewegung**
      (Rate/Reise), nicht der Bildausschnitt. Bewegung ist identisch, nur der sichtbare Crop bleibt.
* [x] **Deckung:** Ueberhang 23.5 % je Seite, Reise ±21.46 % → Reserve **~2 %** an jedem Extrem
      (Referenz faehrt mit exakt 0 Reserve — wir halten bewusst Sub-Pixel-Puffer)
* [x] Bekannter Trade-off: hoehere Ebene → `object-cover` beschneidet ~8 % mehr Bildbreite
      (unvermeidbar, mehr Reise braucht mehr Ueberhang; die Referenz hat denselben Effekt)
**Referenzen:** `components/HeroSection.tsx`

### ✅ Phase 7 — „Fluessiger": Lenis-Smooth-Scrolling (der eigentliche Referenz-Unterschied)
**Symptom (User, 2026-07-16):** „Bei Skiper UI ist das Siena-Parallax **viel fluessiger**, dadurch sieht
die Animation auch besser aus. Schau nochmal richtig nach und pass das an."
**Ziel:** Die Fluessigkeit der Referenz reproduzieren — nicht die Staerke (die stimmt seit Phase 6).

**Diagnose (live gemessen, echter Chrome):**
* [x] **Wheel-Vergleich** — EIN `WheelEvent(deltaY:300)`:
      Referenz: `scrollY 94 → 162 → 205 → 235 → 255 → 269 → 279 → 285 → 290 → 293` (10 Zwischenwerte,
      weich ausgerollt ueber ~600 ms). Unsere Seite: **0 → 0 → …** (synthetisches Wheel loest nativ
      gar kein Scrollen aus — genau **weil** kein Lenis das Event abfaengt und programmatisch scrollt).
* [x] `document.documentElement.className` der Referenz: **`"dark lenis lenis-scrolling lenis-smooth"`**
      → **Lenis ist aktiv**. Unsere Seite: `""`.
* [x] **Gegenprobe, dass es NICHT am Effekt liegt:** Die Parallax-Kurve der Referenz ist **linear**
      (`ty = 0.4412 × scrollY − 7.1`, geclampt bei 240) — **keine** Daempfung, **kein** Spring.
      Die Fluessigkeit kommt also **zu 100 % vom Scrollen selbst**, nicht vom Parallax-Mapping.
* [x] **Lenis-Parameter aus der Ausrollkurve rueckgerechnet:** Restdistanz faellt je 60 ms auf ~0.685
      → pro Frame (~3.6 Frames/60 ms) Faktor **0.90** → **`lerp: 0.1`** = **Lenis-Default**.
      Die Referenz nutzt also Standard-Lenis, keine Spezialkonfiguration.

**Loesungswege geprueft:**
- **A) Lenis (GEWAEHLT)** — exakt das, was die Referenz tut; glaettet den *gesamten* Seiten-Scroll,
  der Parallax erbt die Fluessigkeit automatisch (er ist ja scroll-gekoppelt). `lenis@1.3.25`, ~3 KB gz.
- **B) `useSpring` nur auf den Parallax-Progress** — VERWORFEN: keine Dependency, aber es glaettet nur
  **das Bild**; Headline/Seite wuerden weiter stufig springen → Bild „gummibandet" gegen eine hakelige
  Seite. Loest das gemeldete Problem also nicht, sondern verschiebt es. (Muster existiert im Projekt
  bereits im `Footer` — dort passend, hier nicht.)
- **C) Eigener Lerp-Smooth-Scroll** — VERWORFEN: waere ein schlechteres Lenis (Touch, Overscroll,
  Anker, Resize, `prevent` … alles selbst bauen).
- **Revision der alten Entscheidung:** Phase 1 hatte Lenis als „Zusatz-Dependency" verworfen. Der User
  fordert die Fluessigkeit jetzt **explizit** — damit ist die Abwaegung neu entschieden, bewusst.

**Umsetzung:**
* [x] `npm i lenis` (1.3.25)
* [x] `hooks/useSmoothScroll.ts`: Lenis-Init + eigener rAF-Loop, sauberes `destroy()` beim Unmount,
      Modul-Singleton `getLenis()` fuer programmatische Scrolls
* [x] `anchors: { offset: -88 }` → Lenis uebernimmt die vielen In-Page-Anker (`#contact-schaden` …)
      mit Navbar-Offset, statt dass native Anker-Spruenge gegen Lenis laufen
* [x] `App.tsx`: Hook an der Wurzel; der Hash-/Route-Scroll-Effekt laeuft jetzt ueber `lenis.scrollTo`
      (mit `window.scrollTo`-Fallback, falls Lenis nicht initialisiert ist)
* [x] `index.css`: `html { scroll-behavior: smooth }` entfernt — Lenis besitzt die Glaettung jetzt;
      die CSS-Regel wuerde native Spruenge zusaetzlich animieren (Lenis-Doku: explizit entfernen)
* [x] **Kein** reduced-motion-Gate (Projektentscheidung; der User hat reduced-motion systemweit an und
      will die Animation ausdruecklich — ein Gate waere exakt der Bug aus Phase 5)
**Referenzen:** `hooks/useSmoothScroll.ts`, `App.tsx`, `index.css`

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

### Phase 5 (Korrektur reduced-motion-Gate) — Nachtrag/Selbstkritik
**Eingehalten:** Ursache belegt statt geraten (Pull-Diff + `git log -S` + Browser-Messung) ✅,
User-Vermutung ergebnisoffen gegengeprueft statt uebernommen ✅, Planung vor Code (diese Phase) ✅,
Verifikations-Blockade aktiv durchbrochen statt Mechanismus daneben belegt ✅, Desktop **und**
Mobile (375 px) gemessen ✅, Deckung an beiden Extremen nachgewiesen ✅, `tsc --noEmit` gruen ✅,
< 700 Zeilen/Datei ✅, keine neue Dependency ✅, Encoding sauber (+ 2 Altlasten gefixt) ✅.

**Verifikations-Messwerte (Preview, `prefers-reduced-motion: reduce` **erzwungen** = der haerteste Fall):**
- Desktop 1280 px (Hero 921 px): `translateY` **-119.8 → -74 → -26.1 → +22 → +69.8 → +117.7 px**,
  streng monoton, Travel 237.5 px (= 20 % der Ebenenhoehe 1197 px — exakt die geplante Geometrie).
- Mobile 375 px (Hero 1064 px): **-138.3 → -49.1 → +42.1 → +136.2 px**, monoton, Travel 274.5 px.
- Deckung (Luecke Ebene↔Rahmen, negativ = Ueberhang): oben-Extrem **-258/-18**, Mitte **-140/-136**,
  unten-Extrem **-20/-256** → nie > 0 → **kein grauer Rand**; min. Reserve 18 px ≈ die geplanten 2 %.
- `horizontalerScroll: false` (Desktop + Mobile).

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🔴 **Kritisch (behoben):** Der Parallax war **seit seiner Einfuehrung (`bf95b56`) beim User tot**.
   Das in Phase 1/3 als „a11y ✅" gewertete `prefers-reduced-motion`-Gate ist unter Windows mit
   deaktivierten „Animationseffekten" **immer** aktiv (systemweite Meldung an alle Browser) →
   `transform: none`. Die Feature-Wertung „a11y ✅" war also in Wahrheit der Bug. **Fix:** Gate
   entfernt, Begruendung im Code. **Lehre (identisch zur Akkordeon-Phase-5):** In diesem Projekt ist
   ein reduced-motion-Gate auf einer **gewuenschten Marken-Animation** faktisch ein Abschalter.
2. 🟠 **Hoch (Prozess/Doku, behoben):** Die Akkordeon-Korrektur (`6b87b1b`) begruendete ihr eigenes
   Ent-Gaten mit „Konsistenz mit **ungegated** Hero-Parallax" — diese Annahme war **falsch**
   (Hero war gegated). Zwei Planungen widersprachen sich, ungeprueft. Mit dieser Phase stimmen
   Doku und Code wieder ueberein. **Lehre:** Konsistenz-Behauptungen gegen den Code pruefen, nicht
   gegen die Erinnerung.
3. 🟠 **Hoch (Verifikations-Umgebung, umgangen):** Der Preview-Tab laeuft **`visibilityState: "hidden"`**
   → `requestAnimationFrame` feuert **0× in 500 ms** und `scroll`-Events werden **gar nicht** zugestellt.
   Ein rAF-getriebener Effekt (`useScrollProgress`) steht dort damit prinzipiell still — die naive
   Messung „Transform aendert sich nicht" ist ein **Umgebungsartefakt, kein Bug**. Erklaert auch die
   Screenshot-Timeouts. **Umgehung:** `requestAnimationFrame` temporaer synchron patchen +
   `scroll`-Event selbst dispatchen → echter Hook-Pfad laeuft, danach Patches zurueckgesetzt.
4. 🟡 **Mittel (Messartefakt, geklaert):** `html { scroll-behavior: smooth }` laesst `window.scrollTo`
   animieren → zu frueh gelesene Samples zeigen Zwischenstaende („eingefrorene" Werte). Fuer Messungen
   `scroll-behavior: auto` setzen und danach restaurieren.
5. 🟡 **Mittel (a11y-Abwaegung, bewusst):** reduced-motion wird fuer den Hero-Parallax nun **nicht**
   respektiert — konsistent zur Site-Konvention und zum expliziten User-Wunsch, im Code begruendet.
   Wer strikte reduced-motion-Treue will, muesste sie **site-weit** nachruesten (eigener Task) —
   dann aber bewusst und einheitlich, nicht als stiller Einzel-Gate.
6. 🟢 **Niedrig (Altlast, behoben):** Zwei kyrillische Homoglyphe in dieser Datei (`geклapmt` → `geclampt`,
   `Geprуefte` → `Gepruefte`) — unsichtbarer Encoding-Muell, brach `grep`-Suchen nach diesen Woertern.

**Hauptkomponenten (max. 3):** `components/HeroSection.tsx` (einziger Code-Change),
`docs/hero-parallax/tasks/2026-07-12-hero-parallax-tasks.md`,
`docs/mobile-accordion-animation/tasks/2026-07-12-mobile-accordion-animation-tasks.md` (Widerspruch).

**Kein separates Optimierungs-Task-File noetig** — alle Findings sind in dieser Phase behoben.

### Phase 6 (Parallax-Staerke an Referenz angeglichen) — Nachtrag/Selbstkritik
**Eingehalten:** Referenz **live neu gemessen** statt der alten Doku vertraut ✅, Geometrie in Zahlen
statt Gefuehl ✅, Planung vor Code ✅, in echtem Chrome verifiziert (Desktop + Mobile) ✅, Deckung an
allen Messpunkten nachgewiesen ✅, `tsc --noEmit` gruen ✅, keine neue Dependency ✅, < 700 Zeilen ✅,
Encoding sauber ✅, Trade-off (Bild-Crop) benannt statt verschwiegen ✅.

**Verifikations-Messwerte (echter Chrome, `prefers-reduced-motion: reduce` erzwungen = User-Zustand):**
| | Rate (Rueckstand) | Bild-Tempo | Abweichung zur Referenz | Reise |
|---|---|---|---|---|
| **Referenz skiper29** | 0.4286 | 0.5714x | — | 240 px / 560 px Rahmen |
| Desktop 1280 (Rahmen 851) | 0.4222 | **0.5778x** | **0.64 pp** | **358 px** (vorher 221) |
| Mobile 375 (Rahmen 1064) | 0.4258 | **0.5742x** | **0.28 pp** | **453 px** |
- Deckung an **allen 9 Messpunkten** je Breakpoint intakt; kleinste Reserve 17 px (Desktop) / 22 px (Mobile).
- Verhaeltnis Ebene/Rahmen 1.469 (Referenz 1.4286 + bewusst 2 x ~2 % Deckungspuffer).

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (behoben):** Phase 1 hatte die Referenz-Rate („~0,6x") zwar **notiert**, aber nie gegen die
   **eigene** Geometrie gerechnet. Gewaehlt wurden `h-[130%]` + `±10 %` → 0.74x. Damit war der Effekt
   ~40 % zu schwach und schoepfte nicht mal den eigenen Ueberhang aus (26 von 30 %). **Lehre:** Eine
   gemessene Referenz-Kennzahl ist erst dann uebernommen, wenn die eigene Umsetzung sie **reproduziert** —
   „Parallax vorhanden" ist kein Abnahmekriterium, die **Rate** ist es.
2. 🟡 **Mittel (bewusst, Trade-off):** Hoehere Ebene (130 % → 147 %) laesst `object-cover` ~8 % mehr
   Bildbreite beschneiden. Unvermeidbar — mehr Reise braucht mehr Ueberhang; die Referenz hat denselben
   Effekt (800 px Bild in 560 px Rahmen). Optisch geprueft: Komposition/Headline-Lesbarkeit intakt.
3. 🟡 **Mittel (bewusste Abweichung):** Referenz nutzt `items-end` (Bild startet unten buendig, pant nach
   oben); wir bleiben zentriert, weil `hero-copy-veil` + Weiss-Verlaeufe auf die Bildmitte abgestimmt sind.
   **Bewegung** ist identisch, nur der Ausschnitt unterscheidet sich. Umstellbar — dann Reise **und**
   `-top` gemeinsam anpassen, sonst grauer Rand.
4. 🟢 **Niedrig (Referenz-Detail, bewusst nicht uebernommen):** skiper29 clampt nach einer Rahmenhoehe
   hart (`ty` bleibt auf 240). Unser `useScrollProgress` clampt bereits auf 0..1 → identisches Verhalten,
   kein Extra-Code noetig.

**Hauptkomponenten (max. 3):** `components/HeroSection.tsx` (einziger Code-Change),
`docs/hero-parallax/tasks/2026-07-12-hero-parallax-tasks.md`.

**Offen (User-Entscheidung, kein Bug):** Falls der Effekt weiterhin zu schwach wirkt, ist die Referenz
selbst die Grenze (0.571x). Staerker ginge nur ueber ein Verhaeltnis > 1.4286 — dann weicht man bewusst
von skiper29 ab und beschneidet das Bild weiter.

### Phase 7 (Lenis-Smooth-Scrolling) — Nachtrag/Selbstkritik
**Eingehalten:** Ursache **gemessen** statt vermutet (Wheel-Vergleich + html-Klassen + Bundle-Scan) ✅,
Lenis-Parameter aus der Referenz-Kurve **rueckgerechnet** statt geraten ✅, 3 Loesungswege verglichen
und begruendet ✅, Planung vor Code ✅, Regressionstests (Anker, Footer-Reveal, Parallax-Rate, Konsole) ✅,
`tsc --noEmit` gruen ✅, < 700 Zeilen ✅, Encoding sauber ✅, kein reduced-motion-Gate (Projektregel) ✅.

**Verifikations-Messwerte (echter Chrome):**
- **Wheel(300), scrollY-Verlauf** — Referenz: `94→143→203→233→254→268→278→285→290→293`;
  **wir jetzt:** `99→165→205→233→253→268→278→284→289→293`. **10 Zwischenwerte, gleicher Endpunkt,
  praktisch deckungsgleiche Daempfung.** Vorher: nativ, kein Ausrollen.
- `html.class` = `lenis lenis-scrolling lenis-smooth` (Referenz: `dark lenis lenis-scrolling lenis-smooth`);
  `scroll-behavior` jetzt `auto` (CSS-Regel entfernt).
- **Parallax unveraendert korrekt** (Lenis stoert `useScrollProgress` nicht): Desktop 0.5778x /
  Reise 358 px, Mobile 0.5742x / Reise 453 px, Deckung an allen Messpunkten intakt.
- **Footer-Reveal intakt:** bei Vollausschlag `opacity: 1`, Identity-Transform.
- **Anker konvergiert auf 128 px** = exakt das im CSS deklarierte `scroll-mt-32` (Vorher-Verhalten).
- **Lenis-Kosten:** `npm audit --omit=dev` = **0 vulnerabilities**, **0 eigene Dependencies**,
  32 KB unminified (~3–4 KB gz). Die „2 vulnerabilities"-Meldung beim Install stammt aus den
  **devDependencies** und ist vorbestehend.

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (Selbstverschulden, behoben):** Ich hatte `anchors: { offset: -88 }` gesetzt und damit den
   Navbar-Abstand **doppelt** gezaehlt — die Ankerziele tragen bereits `scroll-mt-32` (128 px, bewusstes
   Projektmuster in `ContactSection`/`ArticleLayout`), und Lenis respektiert `scroll-margin-top`.
   Gemessen: Ziel landete bei **216 px** (= 128 + 88) statt 128. **Fix:** `anchors: true`, Offset raus →
   konvergiert auf 128 px. **Lehre:** Vor eigenen Offsets pruefen, ob das Projekt den Abstand schon
   deklariert — sonst addiert man stillschweigend zwei Loesungen.
2. 🟠 **Hoch (Diagnose-Erkenntnis, geklaert):** Der Wheel-Test „unsere Seite: 0→0→0" wirkte zunaechst wie
   „unsere Seite scrollt nicht". Tatsaechlich loesen **synthetische** WheelEvents nativ **kein** Scrollen
   aus (nur trusted Events tun das) — die Referenz „scrollte", **weil** Lenis das Event abfaengt und
   programmatisch scrollt. Das Negativ-Ergebnis war also selbst der Beweis fuer Lenis' Anwesenheit.
3. 🟡 **Mittel (Entscheidungs-Revision, bewusst):** Phase 1 verwarf Lenis als „Zusatz-Dependency". Diese
   Abwaegung ist hiermit **umgedreht** — auf expliziten, wiederholten User-Wunsch nach der Fluessigkeit
   der Referenz. Kosten sind vertretbar (0 Deps, ~3–4 KB gz, 0 Vulns). Trade-off ehrlich benannt:
   Lenis ist **Scroll-Hijacking** — der gesamte Seiten-Scroll fuehlt sich anders an, nicht nur der Hero.
4. 🟡 **Mittel (vorbestehend, NICHT von mir):** Konsole meldet auf `/` eine React-Warnung
   „A component is changing an uncontrolled input to be controlled" — ein Formular-Input in
   `ContactSection` startet ohne `value`. Stammt aus dem gepullten Commit `998b007`
   („Kontaktformular-Fix") und ist unabhaengig von Lenis. Als eigener Task geflaggt.
5. 🟢 **Niedrig (bewusst):** Eigener rAF-Loop statt Lenis' `autoRaf`, damit der Teardown deterministisch
   ist (`cancelAnimationFrame` + `destroy()`), passend zum Muster von `useScrollProgress`.

**Hauptkomponenten (max. 3):** `hooks/useSmoothScroll.ts` (neu), `App.tsx`, `index.css`.
