# Unfall-Sektion: Pin-Jitter beheben (linker Text „bounct" beim Scrollen)

> **Ziel (User, 2026-07-19):** In der Sektion „Unfall & Schaden Leipzig" soll beim Scrollen **nur**
> die rechte Karten-Bühne animieren. Der linke Text („Unfallschaden? …") soll **wirklich still
> stehen** und nicht mitbouncen. Alle potenziellen Ursachen beheben, damit der Pin absolut ruhig ist.

## Diagnose (empirisch belegt, 2026-07-19)

Der „Pin" war **kein** echtes `position: sticky`, sondern ein **JS-Transform**: Die gesamte Bühne
(linker Text **und** rechte Karten) lag in **einem** `motion.div` mit `style={{ y: pinY }}`, wobei
`pinY = useTransform(progress, [0,1], ['0vh','300vh'])` beim Scrollen gegenrechnet.

**Warum es bounct:** `useScrollProgress` ist **rAF-gedrosselt** (`requestAnimationFrame(update)` im
scroll-Handler). Der Gegen-Translate landet damit **einen Frame nach** dem nativen Scroll: Die Bühne
wandert pro Frame erst mit dem Scroll hoch und wird dann zurückgeschoben → sichtbarer **Jitter/Bounce**.
Er trifft links **und** rechts gleich stark — fällt aber nur beim statischen Text auf, weil die Karten
ohnehin animieren und ihn kaschieren. Im Ruhezustand ist der Drift 0 (deshalb fiel er in der
ursprünglichen Verifikation über Einzelmesspunkte nicht auf — Jitter ist ein Bewegungs-Transient).

**Warum überhaupt der Transform-Hack:** `position: sticky` war hier gebrochen, weil
`<main class="site-main-shell">` `overflow-x: hidden` trägt (→ computed `overflow-y: auto` →
Phantom-Scroll-Container). Sticky haftet dann an `main` statt am Viewport.

**Empirische Belege (Preview localhost:3007, in-App-Browser):**
- Sticky-Probe in `<main>`, Scroll 1200 → `stickyTop = −1187` (wandert weg) = **STICKY BROKEN**.
- `main` computed: `overflow-x: hidden`, `overflow-y: auto`, `transform: matrix(1,0,0,1,0,0)` (Identität,
  nur Layer/Stacking — **kein** Sticky-Blocker).
- Gegentest `overflow: clip` (beide Achsen) → computed `clip/clip`, Sticky-Probe `stickyTop = 0` =
  **STICKY WORKS**, `scrollWidth == clientWidth` (kein horizontaler Overflow).

## Lösungsvergleich (mehrere Wege geprüft)

1. **Transform-Pin frame-synchron via Lenis-Callback** (Style direkt in Lenis' scroll-Event schreiben):
   behebt den Lag ohne Shell-Änderung, koppelt die Sektion aber an Lenis-Interna, bleibt JS-getrieben.
2. **`position: fixed`-Toggle-Pin:** vom Shell-`transform` re-basiert (fixed relativ zu `main`) → im
   Shell ebenso gebrochen wie sticky. Verworfen.
3. **Shell reparieren → native `position: sticky` ✅ (gewählt):** `overflow: clip` statt `hidden`
   entfernt den Scroll-Container, sticky wird compositor-getrieben → **strukturell jitterfrei**, weil
   kein JS mehr im Pin-Loop steht. Sauberste, wartbarste Lösung; empirisch validiert.

---

## Phasen

### ✅ Phase 1 — Diagnose & empirische Bestätigung
* [x] `AccidentDamageSection.tsx` gelesen: Pin = Transform (`pinY`, `useTransform 0→300vh`), links+rechts
      in **einem** `motion.div`
* [x] Lag-Quelle isoliert: `useScrollProgress` rAF-gedrosselt → Gegen-Translate 1 Frame zu spät
* [x] Shell-Ursache bestätigt: `main` `overflow-x:hidden`→`overflow-y:auto` (Sticky-Probe: top 0→−1187)
* [x] Fix validiert: `overflow: clip` → Sticky-Probe top 0, kein h-Overflow
**Referenzen:** `components/AccidentDamageSection.tsx`, `hooks/useScrollProgress.ts`, `components/Layout.tsx`

### ✅ Phase 2 — Shell-Fix (Scroll-Container entfernen)
**Ziel:** `main.site-main-shell` darf kein Scroll-Container mehr sein, damit natives Sticky greift.
* [x] `components/Layout.tsx`: `overflow-x-hidden` → `overflow-clip` (beide Achsen clippen wie bisher,
      aber **ohne** Scroll-Container; horizontaler Overflow bleibt geclippt) — mit erklärendem Kommentar
* [x] Kommentar in `hooks/useScrollProgress.ts` an neuen Shell-Zustand angeglichen (Hook bleibt für
      Karten-Progress/Hero-Parallax in Betrieb, window-basierte Messung unverändert korrekt)
**Referenzen:** `components/Layout.tsx`, `hooks/useScrollProgress.ts`

### ✅ Phase 3 — AccidentDamageSection: Transform-Pin → natives Sticky
**Ziel:** Pin über `position: sticky`; linker Text absolut still, nur Karten animieren.
* [x] `pinY` + zugehöriges `useTransform(progress,[0,1],['0vh','300vh'])` entfernt
* [x] Bühne von `<motion.div style={{y:pinY}} …will-change-transform>` auf `<div class="sticky top-0
      h-screen px-6">` umgestellt (Geometrie identisch: 400vh Track, 100vh Pin, 300vh Reise)
* [x] `useScrollProgress` + `cardProgress = useSpring(progress)` unverändert (Karten-Crossfade, Dots)
* [x] Kein `pinY`/`motion.div`-Rest (per grep verifiziert); `useTransform`/`motion` bleiben für Karten
**Referenzen:** `components/AccidentDamageSection.tsx`

### ✅ Phase 4 — Verifikation (Preview-Browser, localhost:3007)
* [x] Struktur: `scrollContainerAncestors = 0` über der Sticky-Bühne; `main` computed `overflow: clip`;
      `position: sticky` aktiv (auch nach Reload → Fix kommt aus Source)
* [x] **Pin hält:** `stickyTop = 0` und `headingTop = 150px` **konstant** über 5 Scroll-Tiefen
      (scrollY 2169→4113) → **Drift 0 px**. Karten wechseln: `[1,0,0,0]` (f=0.1, „Schadenaufnahme") …
      `[0,0,0,1]` (tiefer, „Ersatzwagen")
* [x] Inhalt zeichnet beim Scrollen normal (`elementFromPoint` bei scrollY 6877 → echte Folgesektion)
* [x] Kein horizontaler Overflow (`scrollWidth == clientWidth == 1280`)
* [x] Hero nicht regrediert: h1 DOM `color rgb(255,255,255)`, `opacity 1`, `transform none`
* [x] `tsc --noEmit` → Exit 0, keine App-Konsolenfehler (nur Vite-HMR + react-grab-Devtool-Logs)
* [ ] ⚠️ Visueller Screenshot des gepinnten Zustands **nicht** erbracht — das Screenshot-Capture des
      Preview-Panes wurde in dieser Session mit Lenis unzuverlässig (Blanks während Animation, veraltete
      Frames, `innerH:0`-Transienten nach Navigate). **Tooling-Limit, kein Produktfehler** — durch die
      DOM-Messungen oben vollständig abgedeckt. Live im Browser gegenprüfbar.
**Referenzen:** `components/AccidentDamageSection.tsx`, `components/Layout.tsx`

### ✅ Phase 5 — Doku & Kommentare
* [x] Phasen abgehakt, Kommentar-Sektion gefüllt (Eingehalten + Findings nach Schwere)
* [x] „Update 2026-07-19"-Verweis in `2026-07-17-accident-scrollytelling-tasks.md` ergänzt

---

## Kommentare

### Phase 1–5 (Pin-Jitter-Fix)
**Eingehalten:** Ursache empirisch belegt statt geraten (Sticky-Probe: top 0→−1187 = broken; `clip`-Probe:
top 0 = fixed) ✅, mehrere Lösungswege evaluiert und der wartbarste gewählt (natives Sticky statt
Lenis-gekoppelter Transform-Hack) ✅, Planung vor Code ✅, Root-Cause-Fix statt Symptom­pflaster ✅,
minimale, gezielte Diffs (3 Dateien) ✅, `tsc` grün ✅, Content im initialen HTML unverändert (SEO/GEO) ✅,
mobile-first/Geometrie identisch beibehalten ✅, kein reduced-motion-Gate neu eingeführt ✅, Encoding
sauber (keine Mojibake) ✅, < 700 Zeilen/Datei ✅.

**Messwerte:** Pin-Drift **0 px** (Kopf konstant bei viewport-top+150 über scrollY 2169→4113);
`scrollContainerAncestors = 0`; `main` `overflow: clip`; `scrollWidth == clientWidth`.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (behoben, war der gemeldete Bug):** Der „Pin" war ein rAF-verzögerter JS-Transform → der
   statische Kopf hinkte pro Frame nach und bounc*te. Ersetzt durch natives `position: sticky`
   (compositor-getrieben, kein JS im Pin-Loop). Voraussetzung war der Shell-Fix (`overflow: clip`).
2. 🟡 **Mittel (behoben, Kollateralnutzen — ein still gebrochener Live-Bug mitrepariert):** Der App-Shell
   erzwang site-weit `overflow-y: auto` und machte `position: sticky` **überall** unmöglich. Da jede
   Seite via `App.tsx` in denselben `<Layout>` rendert (auf `/karriere` `main overflow: clip` bestätigt),
   ist damit auch diese bestehende **live** genutzte Sticky-Sidebar repariert:
   - `components/ArticleLayout.tsx:120` — `lg:sticky lg:top-28`-Sidebar in Wissensartikeln (Route
     `KnowledgeArticlePage`). Blieb vorher NICHT stehen, jetzt strukturell garantiert (kein Scroll-
     Container mehr über dem Sticky). Live noch nicht einzeln gegengeprüft (gleiche Mechanik + gleicher
     Shell wie der hier verifizierte Accident-Pin).
   - `components/Jobs.tsx:46` (`sticky top-32`) trägt ebenfalls Sticky, ist aktuell aber nicht eingebunden
     (**bewusst geparkt** für die spätere `/karriere`-Subseite, siehe Finding 5). Sobald sie dort live geht,
     profitiert ihr Sticky-Infobereich vom selben Shell-Fix.
3. 🟢 **Niedrig (Verifikations-Tooling, offen):** Der Preview-Pane konnte den gescrollten Zustand nicht
   screenshotten (Lenis-Animation → Blank-Frames; rAF-Freeze bricht sowohl Lenis als auch das Capture;
   `innerH:0` nach Navigate). Umgangen über DOM-Messungen. Kein Code-Impact. Empfehlung: für künftige
   Scroll-Verifikationen echten Chrome (Claude-in-Chrome) statt des In-App-Panes nutzen.
4. 🟢 **Niedrig (Aufräum-Kandidat, bewusst NICHT jetzt):** Seit der Shell kein Scroll-Container mehr ist,
   *könnte* `useScrollProgress` theoretisch durch Framers `useScroll({target})` ersetzt werden. Bewusst
   belassen: window-basierte Messung ist robuster (immun gegen Layout-Shifts durch Lazy-Bilder) und wird
   auch vom Hero-Parallax genutzt — ein Umbau wäre unnötiges Risiko ohne Mehrwert.
5. 🟢 **Niedrig (geklärt — KEIN toter Code):** `components/Jobs.tsx` wird aktuell nirgends importiert,
   ist aber **bewusst geparkt** (User-Klarstellung 2026-07-19): Die Jobkarten wurden nur vorübergehend
   von der Startseite genommen (zu viel Info für die Mainpage) und kommen später auf die `/karriere`-
   Subseite. **Nicht löschen.** Schutz-Kommentar am Dateikopf ergänzt, damit ein künftiger „unused
   component"-Sweep sie nicht fälschlich entfernt. (Der ursprünglich geflaggte Lösch-Task wurde
   zurückgenommen.)

**Hauptkomponenten (max. 3):** `components/AccidentDamageSection.tsx` (Pin-Mechanik getauscht),
`components/Layout.tsx` (Shell `overflow-clip`), `hooks/useScrollProgress.ts` (Kommentar angeglichen).

**Fazit:** Der linke Text steht jetzt absolut still (Drift 0 px, native Sticky), nur die rechten Karten
animieren beim Scrollen — exakt das gewünschte Ziel. Root-Cause behoben, keine Regression (Hero/Overflow
verifiziert). Einziger offener Punkt ist der fehlende visuelle Screenshot (Tooling-Limit, live prüfbar).
