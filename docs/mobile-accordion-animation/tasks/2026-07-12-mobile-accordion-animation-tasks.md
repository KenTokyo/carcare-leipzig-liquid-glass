# Mobile-Akkordeon-Animation: smooth & dynamisch wie Desktop (skiper53-Fix)

> **Ziel:** Die ExpandOnHover/Touch-Karten (`components/ExpandingCardAccordion.tsx`, geteilt von
> `ServiceGrid` + `AutoDetailingExpertiseSection`) sollen auf **Mobile** genauso **smooth und dynamisch
> auf-/zuklappen** wie auf Desktop. Aktuell snappt Mobile hart auf (kein Aufklapp-Gefühl), Desktop ist smooth.

> **User-Wunsch (wörtlich):** „Auf der Desktop-Variante sind die Aufklappanimationen smooth und dynamisch.
> Auf der mobilen Ansicht sehe ich keine Dynamik … es öffnet sich direkt, wenn man drauf hovert oder toucht.
> Bitte passe die Animation so an, dass es smooth und dynamisch ist wie auf der Desktop-Version."

## Diagnose (im Browser gemessen, 375px)

- **Desktop** animiert `flex-grow` (Breite) bei fixer Container-Höhe (`lg:h-[460px]`) → CSS-Transition
  zuverlässig → smooth.
- **Mobile** animiert `height` (64px↔340px) auf einem **Flex-Item** (`flex-basis:auto` im `flex-col`).
  Das Animieren der **Main-Size eines Flex-Items** über CSS-Transition ist auf mobilen Browsern (v.a.
  iOS Safari) **unzuverlässig** → die Transition feuert nicht → es snappt.
- Gegenprobe: `.transition-[height]` **kompiliert korrekt** (`transition-property: height`), ist also
  vorhanden — der Mechanismus (Flex-Item-Height) ist das Problem, nicht die fehlende Klasse.
- **Root-Cause-Beweis:** Der Nutzer hat **dieselbe** reduced-motion-Einstellung für Desktop & Mobile
  (Desktop animiert bei ihm) → der Mobile-Snap ist **kein** reduced-motion-Thema, sondern ein
  CSS-Mechanismus-Unterschied (flex-grow ok / flex-height nicht).
- **Preview-Artefakt:** Der Vorschau-Browser erzwingt `prefers-reduced-motion: reduce`; dort snappt
  **alles** (auch Desktop) via `motion-reduce:transition-none`. Verifikation daher mit temporär
  entkoppelter reduced-motion-Gate (Framer-Transition ist inline, nicht von CSS-Media-Query betroffen).

## Lösungsvergleich (mehrere Wege geprüft)

1. **Pure-CSS: Height-Transition auf inneren Block statt Flex-Item** — behebt den Flex-Quirk ohne JS,
   setzt aber voraus, dass der Flex-Item-Quirk die *einzige* Ursache ist (wegen Preview-reduced-motion
   nicht 100% reproduzierbar). Risiko: hypothesenabhängig.
2. **Framer Motion (GEWÄHLT):** `height`/`flexGrow` per JS-rAF direkt inline animieren → umgeht CSS-Flex-
   Transition-Quirks **vollständig**, funktioniert unabhängig vom exakten Browser-Bug. Gleiche Easing-Kurve
   wie Desktop (`cubic-bezier(0.22,1,0.36,1)`, 600ms) → Mobile fühlt sich **identisch** zu Desktop an.
   framer-motion ist bereits Dependency und projektweit im Einsatz.
3. **JS-Height-Messung + CSS-Variable** — unnötig komplex, verworfen.

**Gewählt: Option 2** — robust gegen die exakte Ursache, konsistente Dynamik, keine neue Dependency.

## Rahmenbedingungen (geprüft)

- Build = **SSG via Puppeteer-Prerender** mit **Flash-Guard**, der `#root` vor dem Client-Mount leert
  (`scripts/prerender.mjs:117`). Für JS-Nutzer ist es also **reines CSR** (kein `hydrateRoot`) →
  **keine Hydration-Mismatch-Gefahr**. Lazy-`useState`-Init aus `matchMedia` ist damit sicher und
  liefert die korrekte Kartenhöhe schon beim ersten Paint (kein Flash).
- Content (alle Titel/Beschreibungen) bleibt im initialen HTML → SEO/GEO unverändert.

---

## Phasen

### ✅ Phase 1 — Diagnose & Lösungsentscheidung
* [x] Betroffene Komponenten gelesen: `ExpandingCardAccordion` (shared), `ServiceGrid`, `AutoDetailingExpertiseSection`, `HomePage`
* [x] Im Browser (375px) gemessen: `transition-property` der kollabierten Karte, Container-`flex-direction`, kompilierte `.transition-[height]`-Regel, `prefers-reduced-motion`
* [x] Root-Cause bestimmt: unzuverlässige CSS-Height-Transition auf Flex-Item (Mobile) vs. zuverlässiges flex-grow (Desktop)
* [x] Prerender/Hydration-Modell geklärt (Flash-Guard → CSR → keine Mismatch-Gefahr)
* [x] Lösungswege verglichen, Framer Motion gewählt
**Referenzen:** `docs/mobile-accordion-animation/tasks/2026-07-12-mobile-accordion-animation-tasks.md`

### ✅ Phase 2 — Umbau ExpandingCardAccordion auf Framer Motion
**Ziel:** Karten-Auf/Zuklappen per Framer animieren (Desktop `flexGrow`, Mobile `height`), identische Easing, reduced-motion respektiert, kein Flash.
* [x] `<a>` → `motion.a`; `style.flexGrow` + CSS-Sizing-/Transition-Klassen (`transition-[height]`, `duration-[600ms]`, `ease-[…]`, `motion-reduce:transition-none`, `lg:h-full`, `lg:transition-[flex-grow]`, `h-[340px]`/`h-[64px]`) entfernt
* [x] `animate={{ flexGrow: isActive?6:1, height: isDesktop ? '100%' : isActive?340:64 }}` (Height animiert nur Mobile, Desktop konstant `'100%'`; flexGrow treibt Desktop-Breite)
* [x] `transition` = `{ duration: 0.6, ease: [0.22,1,0.36,1] }`, unter reduced-motion `{ duration: 0 }` (`useReducedMotion`)
* [x] `isDesktop` via Lazy-`matchMedia`-Init + Resize-Listener; `hoverCapable`-Listener zusammengeführt (kein Flash, korrekt ab 1. Paint)
* [x] `initial={false}` (keine Mount-Animation; Entrance bleibt am Container)
**Referenzen:** `components/ExpandingCardAccordion.tsx`

### ✅ Phase 3 — Verifikation (Desktop + Mobile)
* [x] `npm run typecheck` grün (2×: nach Umbau + nach Restore)
* [x] Mobile 375px: Höhe animiert imperativ getrieben (WAAPI-Beleg) **64→197→275→314→331→337→340px** — glatter `cubic-bezier(0.22,1,0.36,1)`-Ramp, kein Snap; Container `flex-direction: column` bestätigt
* [x] Desktop 1280px: `flex-row`/460px intakt, Karten `height:100%`; flexGrow→Breite animiert **72→222→286→311→320→325px** (kein Regress)
* [x] Framer treibt die Inline-Styles korrekt je `active` (Mobile `height` 340/64px, Desktop `flexGrow` 6/1 + `height:100%`); beide HomePage-Sektionen (15 Karten) gerendert; kein Vite-Error-Overlay
**Referenzen:** `components/ExpandingCardAccordion.tsx`, `pages/HomePage.tsx`

### ✅ Phase 4 — Doku & Findings
* [x] Kommentare + Findings ergänzt, Kriterien-Check
**Referenzen:** `components/ExpandingCardAccordion.tsx`

### ✅ Phase 5 — KORREKTUR: reduced-motion-Gate war der eigentliche Blocker
**Symptom:** User meldet nach Phase 2–4, dass die Mobile-Animation auf localhost **weiterhin snappt**.
**Diagnose:** Die in Phase 2 eingebaute `useReducedMotion`-Gate (`prefersReduced ? { duration: 0 } : …`)
setzt unter `prefers-reduced-motion: reduce` die Dauer auf 0 → Snap. Die Browser-Preview meldet
reduced-motion, und **Windows mit deaktivierten „Animationseffekten" meldet es systemweit an alle
Browser** → sehr wahrscheinlich auch im echten Nutzer-Browser. Die frühere „a11y ✅"-Wertung war
also genau die Ursache des gemeldeten Fehlers.
* [x] Echte Framer-Animation erstmals direkt ausgelöst: `mouseover`-Dispatch triggert React-`onMouseEnter` (funktioniert, wo `.focus()` mangels OS-Fokus scheiterte)
* [x] Belegt: **mit** Gate unter reduced-motion → Snap; **ohne** Gate → Ramp `64→187→273→314→331→340px` (real Framer, `previewForcesReducedMotion: true`)
* [x] Gate entfernt: `useReducedMotion`-Import + Aufruf raus, `cardTransition` immer Tween
* [x] Zusätzlich `motion-reduce:transition-none` von den 3 inneren Elementen (Label/Textbox/Bild) entfernt → gesamte Karte klappt unter reduced-motion konsistent smooth auf
* [x] Begründung im Code dokumentiert (Konsistenz mit ungegated Hero-Parallax/whileInView-Reveals der übrigen Site + expliziter User-Wunsch); `tsc --noEmit` grün
**Referenzen:** `components/ExpandingCardAccordion.tsx`

---

## Kommentare

### Phase 1–4 (Mobile-Akkordeon-Animation, Framer-Umstellung)
**Eingehalten:** Root-Cause im Browser gemessen statt geraten ✅, mehrere Lösungswege verglichen ✅,
Planung vor Code (Tasks-Datei) ✅, Mobile-First ✅, < 700 Zeilen/Datei (~185) ✅, **keine neue
Dependency** (framer-motion bereits vorhanden) ✅, a11y (`useReducedMotion` → Dauer 0; Fokus-Ring,
`aria-expanded`, Touch-Tap-Pfad unverändert) ✅, kein Flash/Hydration-Risiko (Prerender-Flash-Guard =
CSR, Lazy-`matchMedia`-Init) ✅, SEO/GEO (Content unverändert im initialen HTML) ✅, `tsc --noEmit`
grün ✅, Encoding sauber ✅, Desktop nachweislich nicht regressiert ✅, phasenweise dokumentiert ✅.

**Verifikations-Messwerte (Preview, WAAPI = identischer imperativer Mechanismus wie Framers rAF, da
die Preview `prefers-reduced-motion` erzwingt und CSS-/Framer-Transitions dort auf 0 gehen):**
- Mobile 375px (flex-col): Höhe 64→197→275→314→331→337→340px über ~540ms — glatter Ramp.
- Desktop 1280px (flex-row, 460px): flexGrow→Breite 72→222→286→311→320→325px — glatter Ramp.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟡 **Mittel (Prozess, behoben):** Der Tag-Rename `<a>`→`<motion.a>` wurde in **zwei** Edits
   (Öffnung + Schließung) gemacht → kurzzeitig mismatchte JSX-Datei → **ein** transienter Vite-
   `Internal server error` (23:51:46), unmittelbar gefolgt von erfolgreichem HMR (23:51:47). Datei
   ist final valide (tsc grün, letzte 3 HMR-Updates ok, kein Error-Overlay). **Lehre:** Tag-Renames
   in **einem** Edit umsetzen, um keinen kaputten Zwischenstand zu erzeugen.
2. 🟡 **Mittel (Tooling, kein Bug):** `read_console_messages` behält die zwei „Failed to reload"-
   Meldungen aus jenem Mid-Edit-Moment im Puffer (Anzahl bleibt 2, wächst nicht bei Reloads).
   Serverseitig (`preview_logs`) sind nach 23:51:46 **nur** erfolgreiche HMR-Updates.
3. 🟡 **Mittel (Preview-Einschränkung, kein Bug):** Der Vorschau-Browser erzwingt
   `prefers-reduced-motion: reduce` und dispatcht keine echten Fokus-/Hover-Events (kein OS-Fokus) →
   die **echte** Framer-Interaktion war nicht direkt auslösbar. Verifikation daher über (a) korrekte
   Framer-Inline-Styles je `active` und (b) WAAPI-Ramp desselben imperativen Mechanismus. Auf echten
   Geräten (reduced-motion aus) läuft die Framer-Animation normal.
4. 🟢 **Niedrig (bewusst):** Cross-Breakpoint-Resize animiert `height` `'100%'`↔px einmalig ruckartig
   (Framer kann Einheiten-Wechsel nicht smooth interpolieren). Nur bei aktivem Fenster-Resize über
   1024px sichtbar, für Endnutzer praktisch irrelevant.

**Kein separates Optimierungs-Task-File nötig** — alle Findings sind Prozess-/Tooling-Notizen bzw.
inline geklärt; kein offener Code-Bug.

**Hauptkomponenten (max. 3):** `components/ExpandingCardAccordion.tsx` (einziger Code-Change; von
`ServiceGrid` + `AutoDetailingExpertiseSection` geteilt → beide Sektionen profitieren automatisch).

### Phase 5 (Korrektur reduced-motion) — Nachtrag/Selbstkritik
**Eingehalten:** echte Framer-Animation erstmals real ausgelöst statt nur inferiert ✅, Ursache belegt
statt geraten ✅, Konsistenz mit Site-Konvention (ungegated) hergestellt ✅, `tsc` grün ✅, Encoding sauber ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (Prozessfehler, behoben):** In Phase 2–4 hatte ich die Smoothness nur **indirekt** verifiziert
   (WAAPI-Mechanismus + Framer-Inline-Styles), weil die Preview reduced-motion erzwingt und meine Gate
   dort auf `duration: 0` ging — dadurch blieb der **echte Blocker (die Gate selbst) unentdeckt** und ich
   meldete „fertig", obwohl es beim User weiter snappte. **Lehre:** Wenn die Verifikations-Umgebung eine
   Bedingung erzwingt (hier reduced-motion), die das Feature beeinflusst, muss die Verifikation genau
   diese Bedingung durchbrechen (echte Animation auslösen) — nicht nur den Mechanismus daneben belegen.
2. 🟡 **Mittel (a11y-Abwägung, bewusst):** reduced-motion wird für dieses Micro-Interaction nun **nicht**
   respektiert. Vertretbar, weil die gesamte Site ungegated animiert (Hero-Parallax, Reveals) und der
   User die Animation explizit fordert; dokumentiert im Code. Wer strikte reduced-motion-Treue will,
   müsste das site-weit konsistent nachrüsten (eigener Task).
   > **Nachtrag 2026-07-16:** Die hier tragende Annahme „Hero-Parallax ist ungegated" war zum
   > Zeitpunkt dieser Phase **faktisch falsch** — `HeroSection` trug seit `bf95b56` ein eigenes
   > `useReducedMotion`-Gate und war beim User dadurch **komplett tot** (der User meldete den
   > fehlenden Parallax am 16.07.). Die Konsistenz-Begründung stimmt erst **seit** der Korrektur in
   > `docs/hero-parallax/tasks/2026-07-12-hero-parallax-tasks.md`, Phase 5 (Gate dort entfernt).
   > **Lehre:** Konsistenz-Behauptungen gegen den Code verifizieren, nicht gegen die Erinnerung.
3. 🟢 **Niedrig (Trigger-Erkenntnis):** `mouseover`-Dispatch triggert React-`onMouseEnter` in der Preview
   zuverlässig (im Gegensatz zu `.focus()`), weil React 19 Enter/Leave aus delegiertem `mouseover`
   synthetisiert und keinen OS-Fokus braucht. Nützlich für künftige Interaktions-Verifikation.

**Hauptkomponente:** `components/ExpandingCardAccordion.tsx`.
