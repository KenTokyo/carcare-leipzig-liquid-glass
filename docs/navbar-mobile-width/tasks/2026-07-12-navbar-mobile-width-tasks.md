# Mobile Navbar schmaler (Abstand zu den Seitenrändern) — Desktop unverändert

> **Ziel:** Die Navbar liegt in der **mobilen** Ansicht bündig an den Außenkanten. Sie soll
> links + rechts eingerückt werden (schmaler, mehr „schwebend" wie auf dem Desktop).
> **Harte Vorgabe:** Die **Desktop-Version bleibt zu 100 % unverändert.**

## Analyse (verifiziert im Browser)

- Sichtbare Leiste = `.solidroad-nav-frame` (CSS, in `components/Layout.tsx`): `width:100%`,
  `max-width: var(--cc-nav-width)` (= **1000px**), `margin:auto`. Interaktiver Inhalt = `.solidroad-nav-shell`
  (die `motion.div` in `Navbar.tsx`, Tailwind `mx-auto max-w-[1000px]`). Beide zentriert, gleiche Breite.
- Messung vor Änderung @375px: Frame **und** Shell je `left 0 / right 0 / width 375` → bündig.
  @1280px: Frame `width 1000`, `140px` Gap je Seite → schon „schwebend" (= Desktop-Look, den der User meint).
- Mobile-Dropdown (`Navbar.tsx`) nutzte `w-[calc(100vw-24px)]` (viewport-basiert) → würde bei eingerückter
  Leiste überlaufen (h-Scroll).

## Umsetzung (mobile-only)

- **`index.css`:** neue `@media (max-width: 767px)`-Regel rückt `.solidroad-nav-frame` **und**
  `.solidroad-nav-shell` gemeinsam ein: `width: calc(100% - 6.875rem)` (beide behalten `margin:auto` →
  zentriert, 55px Gap je Seite, deckungsgleich). Desktop-Regeln (`width:100%` / `max-width`) unberührt.
- **`components/Navbar.tsx`:** Mobile-Dropdown `w-[calc(100vw-24px)]` → `w-auto` (Breite jetzt über
  `left-3 right-3` = relativ zur eingerückten Leiste, kein Viewport-Bezug, kein Overflow). Zeile ist
  `xl:hidden` → nur Mobile.

## Phasen

### ✅ Phase 1 — Analyse & mobile-only Umsetzung
* [x] Navbar-Aufbau (Frame/Shell/Dropdown), CSS `--cc-nav-width=1000px` und Ist-Maße gemessen
* [x] Mobile-Inset via CSS-Media-Query (Frame + Shell, `calc(100% - 6.875rem)`)
* [x] Dropdown auf `w-auto` (leiste-relativ) umgestellt → kein Overflow
**Referenzen:** `index.css`, `components/Navbar.tsx`

### ✅ Phase 2 — Verifikation
* [x] Mobile 375px: Frame + Shell je `55px` Gap, `width 265` (final), deckungsgleich, kein h-Scroll (vorher 0/0/375)
* [x] Dropdown geöffnet: Rand skaliert mit dem Inset (Leiste + 12px), symmetrisch, kein Overflow, alle Items sichtbar
* [x] **Desktop 1280px: Frame unverändert `width 1000` / `140px` Gap zentriert, Voll-Nav sichtbar** (Beweis: Media-Query greift nicht)
* [x] `tsc --noEmit` grün, 0 Console-Fehler, Screenshots (vorher/nachher)
**Referenzen:** `index.css`, `components/Navbar.tsx`

### ✅ Phase 3 — Cutout-Rundung (konkave obere Aussenecken) auf Mobile
**Ziel:** Die konkaven Cutout-Coves an den oberen Aussenecken (Desktop-Look, `.solidroad-cutout-*`)
auch auf Mobile zeigen – auf Userwunsch „genau wie Desktop".
* [x] Mechanik verstanden: Cutouts sind Frame-Kinder (`right/left:100%`, `top:shell-gap`, 28px inner-radius, weisser box-shadow) → sitzen automatisch an den eingerueckten Navbar-Kanten
* [x] Vorab im Browser per JS geprueft (display:block erzwungen + Screenshot), dann sauber in CSS umgesetzt
* [x] Cutouts per `@media (max-width:767px) { display:block }` aktiviert – MUSS nach der Basisregel (`.solidroad-cutout-* { display:none }`) stehen (gleiche Spezifitaet → Quell-Reihenfolge entscheidet)
* [x] Verifiziert: Mobile 375px Cutouts `display:block`, kein h-Scroll, 0 Console-Fehler; Desktop 1280px unveraendert (Frame 1000px zentriert, Cutouts wie zuvor)
**Referenzen:** `index.css`

### ✅ Phase 4 — Feinschliff: 55px final, Hamburger-Styling, Logo-Anpassung
**Ziel:** Seitenabstand iterativ auf den finalen Wunschwert; Hamburger entblaut + Striche in CI-Blau;
Logo mobil verkleinert, damit bei 55px genug Luft bleibt.
* [x] Seitenabstand iterativ 30 → 36 → 45 → **55px** (`calc(100% - 6.875rem)`) je Seite
* [x] Bei 55px berührten sich mittiges Logo (fix) und rechter Hamburger fast (1px) → **Logo mobil `w-[152px]` → `w-[132px]`** (nur Base; `sm:`/`xl:` unberührt) → **11px** Abstand
* [x] Hamburger-Button: „blaue Kontur" war `border-gray-200` (im Theme eisblau) → Border entfernt (`border-width:0`)
* [x] Hamburger-Striche: `text-[var(--cc-carbon)]` → `text-blue-600` (`rgb(11,61,145)` = der beim offenen Menü als `bg-blue-600` hinterlegte Blauton)
* [x] Verifiziert: Mobile Logo 132px / Gap 11px / kein h-Scroll; Desktop 1280px unverändert (Logo 184px, Frame 1000px, Hamburger `xl:hidden`); `tsc` grün
**Referenzen:** `index.css`, `components/Navbar.tsx`

## Kommentare
### Phase 1–2
**Eingehalten:** strikt mobile-only (Media-Query `max-width:767px` + `xl:hidden`-Zeile) ✅, **Desktop
messbar unverändert** (Frame 1000px zentriert wie zuvor) ✅, Frame+Shell deckungsgleich eingerückt ✅,
kein horizontales Scrollen ✅, Dropdown ohne Overflow nachgezogen ✅, `tsc` grün ✅, 0 Console-Fehler ✅,
Encoding sauber, Kommentar im CSS erklärt die Absicht ✅.

**Findings:** keine. Die eine Nebenwirkung (Dropdown-Overflow bei eingerückter Leiste) wurde vorausschauend
mitgefixt. Gap-Wert final `6.875rem` (55px) je Seite — zentral in der Media-Query anpassbar.

**Hauptkomponenten (max. 3):** `index.css` (Mobile-Media-Query), `components/Navbar.tsx` (Dropdown-Breite).

### Phase 3 (Cutout-Rundung auf Mobile)
**Eingehalten:** mobile-only (`max-width:767px`), Desktop messbar unveraendert ✅, bestehende Cutout-Mechanik
wiederverwendet (kein neues Markup, keine neue Klasse) ✅, 0 Console-Fehler ✅, im Browser vorab per JS
geprueft und dann in CSS sauber umgesetzt ✅.
**Findings:**
1. 🟡 **Mittel (Stolperstein, geloest):** Regel zuerst VOR der Basisregel `display:none` platziert → wurde
   ueberschrieben (gleiche Spezifitaet, spaetere Quellregel gewinnt). Fix: hinter die Basis-/`min-width:1080px`-Regeln verschoben.
2. 🟢 **Hinweis (Design-Tradeoff):** Der Cove verbindet die Leiste optisch staerker mit dem oberen Rand (wie Desktop)
   → wirkt minimal weniger „frei schwebend" als nur mit den 55px-Seitenabstaenden. Cove-Radius zentral ueber
   `--cc-nav-inner-radius` (28px) justierbar.
**Hauptkomponenten (max. 3):** `index.css` (Cutout-Media-Query `@media max-width:767px`).

### Phase 4 (Feinschliff: 55px final + Hamburger/Logo)
**Eingehalten:** strikt mobile-only (Base-Utility `w-[132px]` unter `sm:w-[176px]`/`xl:w-[184px]`; Media-Query
`max-width:767px`) ✅, Desktop messbar unverändert (Logo 184px, Frame 1000px zentriert, Hamburger `xl:hidden`) ✅,
Theme-Tokens korrekt erkannt (`blue-600` = trust-blue `#0b3d91`; „gray"-Border = eisblau `rgb(216,232,255)`) ✅,
`tsc` grün, kein h-Scroll ✅.
**Findings:**
1. 🟢 **Geklärt (Theme-Eigenheit):** Die `gray-*`-Tokens sind in diesem Projekt blau-getönt (eisblau-basiert)
   → `border-gray-200` erschien als „blaue Kontur". Deshalb Border entfernt statt umgefärbt.
2. 🟢 **Hinweis (Platzgrenze):** Bei 55px ist der Platz zwischen mittigem Logo und rechtem Hamburger knapp
   (vorher 1px) → gelöst durch mobiles Verkleinern des Logos (152→132px, 11px Abstand). Noch schmaler bräuchte
   weitere Logo-Verkleinerung.
**Hauptkomponenten (max. 3):** `index.css` (55px-Inset), `components/Navbar.tsx` (Hamburger-Styling + Logo-Breite).
