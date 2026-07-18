# Unfall & Schaden: statische Karte → scroll-gepinnte Kartensequenz (Scrollytelling)

> **Ziel (User, 2026-07-17):** `components/AccidentDamageSection.tsx` von einer statischen Karte in
> ein **scroll-gepinntes Scrollytelling** umbauen: Sektion pinnt beim Scrollen, links steht statisch
> die Ueberschrift, rechts erscheinen nacheinander 4 Prozess-Karten (Fade + Y-Parallax), erst nach
> Karte 4 loest der Pin und der Scroll fuehrt zur naechsten Sektion („Fuer wen wir arbeiten").

> **📌 Update 2026-07-19 — Pin-Mechanik abgelöst (siehe `2026-07-19-pin-jitter-fix-tasks.md`):** Der hier
> beschriebene **Transform-Pin** (`pinY = useTransform(progress,[0,1],['0vh','300vh'])`) hatte einen
> rAF-bedingten Frame-Lag → der statische Kopf bounc*te beim Scrollen. Er wurde durch **natives
> `position: sticky`** ersetzt (compositor-getrieben, Drift 0 px). Möglich wurde das, indem der App-Shell
> `<main>` von `overflow-x: hidden` auf `overflow: clip` umgestellt wurde (kein Scroll-Container mehr →
> Sticky greift). Die unten dokumentierte „kritische Abweichung" (Transform statt Sticky) ist damit
> **überholt** — Sticky funktioniert jetzt. Die window-basierte `useScrollProgress`-Messung bleibt für
> den Karten-Fortschritt in Betrieb.

## Die 4 Karten
1. **Schadenaufnahme** — Schaden vor Ort/per Foto erfassen und dokumentieren.
2. **Gutachten & Kalkulation** — Abstimmung mit Gutachter + nachvollziehbare Kostenkalkulation.
3. **Versicherungsabwicklung** — Kommunikation + Schriftverkehr mit der Versicherung.
4. **Ersatzwagen nach Verfuegbarkeit** — Ersatzmobilitaet fuer die Reparaturzeit.

## 🔴 KRITISCHE ABWEICHUNG vom User-Spec (technisch zwingend)

Der Spec verlangt `position: sticky` + `useScroll({ target })`. **Beides bricht in diesem Projekt** —
empirisch belegt (2026-07-17):
- `<main class="site-main-shell">` hat `overflow-x:hidden` (→ computed `overflow-y:auto`) + `transform`.
- **Sticky-Probe:** injiziertes `position:sticky; top:0` in `<main>`, 400px gescrollt → `top` wandert
  `0 → -400px` statt bei 0 zu pinnen. → **Sticky pinnt NICHT.**
- Framer `useScroll({target})` friert bei 0 ein (misst gegen den falschen Scroll-Container) — bereits
  in Hero-Parallax + [[site-shell-breaks-sticky]] dokumentiert.

**Loesung (projektbewaehrt, treibt aktuell den Hero-Parallax):** `hooks/useScrollProgress` misst den
Fortschritt window-basiert (`-rect.top / (offsetHeight - innerHeight)`, rAF-gedrosselt, immun gegen
overflow/transform-Vorfahren). Der Pin wird **manuell per `translateY`-Transform** erzeugt: die
`h-screen`-Buehne wird um `progress * 300vh` nach unten geschoben und bleibt so im Viewport, bis der
400vh-Track durchlaufen ist. Semantisch identisch zum gewuenschten Verhalten, nur die Mechanik
unterscheidet sich.

## Geometrie des Pins
- Track (Section) `h-[400vh]`, `useScrollProgress(ref, {distance:'through'})` → progress über
  `400vh − 100vh = 300vh`.
- Pin-Buehne `h-screen`, `y = useTransform(progress,[0,1],['0vh','300vh'])` (RAW progress, **kein**
  Spring — sonst „schwimmt" der Pin gegen den Scroll).
- progress 0 = Track-Top am Viewport-Top (Buehne fuellt Viewport), progress 1 = Track-Bottom am
  Viewport-Bottom (Buehne am Track-Ende, Pin loest, naechste Sektion folgt).

## Karten-Intervalle (mit weichen Crossfade-Rampen, Overlap 0.06)
- Karte 1: 0.00–0.25 (startet voll sichtbar bei progress 0)
- Karte 2: 0.25–0.50
- Karte 3: 0.50–0.75
- Karte 4: 0.75–1.00 (bleibt bis Ende sichtbar)
- Je Karte `opacity` [0,1,1,0] + `y` [28,0,0,-28] (Parallax), **1. Karte** [1,1,0]/[0,0,-28],
  **4. Karte** [0,1,1]/[28,0,0]. Getrieben von `useSpring(progress)` (smooth, kein Ruckeln).

## Responsive
- Desktop: Ueberschrift links, Karten-Buehne rechts (nebeneinander).
- Mobile: Ueberschrift oben, Karten-Buehne darunter (gestapelt) — Pin-Scroll-Logik identisch.

---

## Phasen

### ⬜ Phase 1 — Analyse, Shell-Verifikation & Entscheidung
* [x] Ist-Zustand gelesen (`AccidentDamageSection.tsx`: statische Karte, 4 Punkte, 2 CTAs)
* [x] Sektionsreihenfolge bestaetigt: `AccidentDamageSection` → `TargetGroupCards` („Fuer wen wir arbeiten")
* [x] Shell-Bug **empirisch** belegt (Sticky-Probe: top 0→-400) → manueller Transform-Pin gewaehlt
* [x] `useScrollProgress` (`distance:'through'`) als Fortschrittsquelle bestaetigt
**Referenzen:** `components/AccidentDamageSection.tsx`, `hooks/useScrollProgress.ts`, `pages/HomePage.tsx`

### ✅ Phase 2 — Umbau AccidentDamageSection
* [x] Track-Section `h-[400vh] relative`, Pin-Buehne `h-screen` mit `translateY`-Pin (`0→300vh`)
* [x] Links/oben statisch: Badge + H2 + Intro (Desktop) + 2 CTAs (Desktop) + Fortschritts-Indikator
      (4 Dots + „0X / 04", folgt dem aktiven Schritt via `progress.on('change')`)
* [x] Rechts/unten Buehne: 4 Karten `absolute inset-0` (`ProcessCard`), Crossfade + Y-Parallax je
      Intervall; Karte 1 startet sichtbar, Karte 4 bleibt bis Ende (Trapez-Rampen, Overlap 0.06)
* [x] `useSpring` auf Karten-Progress (stiffness 140/damping 30/mass 0.4); Pin bleibt RAW; `will-change-transform`
* [x] Responsive: Desktop nebeneinander, Mobile gestapelt; Content im initialen HTML (SEO/GEO)
* [x] Kein reduced-motion-Gate ([[no-reduced-motion-gates]])
**Referenzen:** `components/AccidentDamageSection.tsx`

### ✅ Phase 3 — Verifikation (echter Chrome)
* [x] Pin haelt: `pinTop = 0` an allen Messpunkten (P 0.02→0.99), **max Drift 0 px** (vh-Rechnung exakt)
* [x] Karten korrekt: P 0.02/0.125→Karte1, 0.375→2, 0.625→3, 0.875/0.99→4; Crossfade an Grenzen sichtbar
* [x] Pin loest nach Track: P 1.15 → Buehne top −405 (weg), `#zielgruppen` top 495 (im Viewport)
* [x] Mobile 390px: gestapelt, Pin haelt (Drift 0), `hScroll=false`, Buehne `stageBottom=844` (passt);
      Header kompakt (H2 kleiner, Intro/CTAs ausgeblendet — Bottom-Nav deckt Aktionen)
* [x] `tsc --noEmit` gruen, 0 Konsolenfehler
**Referenzen:** `components/AccidentDamageSection.tsx`

---

## Kommentare

### Phase 1–3 (Scrollytelling-Umbau)
**Eingehalten:** Shell-Bug **empirisch belegt** (Sticky-Probe) statt nur auf Memory vertraut ✅,
Planung vor Code ✅, projektbewaehrter Pin-Mechanismus (`useScrollProgress` + Transform, immun gegen
overflow/transform) ✅, in echtem Chrome verifiziert (App-Preview kann Scroll/rAF nicht) ✅, Desktop
**und** Mobile gemessen (Pin-Drift, Karten-Reihenfolge, Pin-Aufloesung, kein h-Scroll) ✅, Content im
initialen HTML (alle 4 Schritte + H2 crawlbar) ✅, kein reduced-motion-Gate ✅, `tsc` gruen ✅,
< 700 Zeilen (~215) ✅, Encoding sauber ✅.

**Verifikations-Messwerte:** Pin-Drift **0 px** (Desktop 1440 + Mobile 390); Karten [1,0,0,0]→[0,1,0,0]
→[0,0,1,0]→[0,0,0,1] an den Intervall-Zentren; Pin loest nach P=1 → `#zielgruppen` folgt.

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🔴 **Kritisch (geloest, bewusste Spec-Abweichung):** Der User-Spec verlangte `position:sticky` +
   `useScroll({target})`. **Beides bricht** im App-Shell (`main` overflow+transform) — per Sticky-Probe
   belegt (top 0→−400 statt zu pinnen). Ersetzt durch **manuellen Transform-Pin** + window-basiertes
   `useScrollProgress`. Verhalten identisch, Mechanik anders. Zwingend, nicht optional.
2. 🟠 **Hoch (Mobile, behoben):** Erste Fassung sprengte den Mobile-Viewport (grosse H2 + 2 CTAs +
   Karten-Buehne > 844px → H2 unter Navbar, Karte unter Bottom-Nav). **Fix:** H2 kleiner (`text-2xl`),
   Intro + In-Section-CTAs auf Mobile ausgeblendet (die fixierte Bottom-Nav deckt Anrufen/Schaden/Termin
   ohnehin ab), Buehne `h-[260px]`. Danach passt alles in den Viewport (`stageBottom=844`).
3. 🟢 **Niedrig (Grenz-Artefakt):** Der Fortschritts-Zaehler nutzt `floor(progress/0.25)` und ist damit
   exakt an den 0.25-Grenzen 1-Frame-sensibel (z. B. bei genau 0.50 kurz „02" statt „03"). Zwischen den
   Grenzen und im Ruhezustand korrekt; waehrend echten Scrollens unauffaellig. Bewusst belassen.
4. 🟢 **Niedrig (bewusst):** 400vh Track = ~75vh Scroll je Karte (angenehmes Tempo). Track-Hoehe zentral
   ueber `h-[400vh]` + Pin-Reise `300vh` justierbar, falls die Sequenz kuerzer/laenger soll.

**Hauptkomponenten (max. 3):** `components/AccidentDamageSection.tsx` (kompletter Umbau),
`hooks/useScrollProgress.ts` (wiederverwendet), `docs/accident-scrollytelling/…` (Planung).

**Fazit:** Scrollytelling umgesetzt wie gewuenscht (Pin, statische Ueberschrift links, 4 nacheinander
ein-/ausblendende Karten mit Fade+Y-Parallax, Aufloesung erst nach Karte 4 → „Fuer wen wir arbeiten"),
Mobile gestapelt mit erhaltener Pin-Logik. Einzige bewusste Abweichung: Pin per Transform statt
`position:sticky` (im Shell zwingend, empirisch belegt).
