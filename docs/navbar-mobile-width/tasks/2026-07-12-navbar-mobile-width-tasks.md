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
  `.solidroad-nav-shell` gemeinsam ein: `width: calc(100% - 3.75rem)` (beide behalten `margin:auto` →
  zentriert, 1,875rem/30px Gap je Seite, deckungsgleich). Desktop-Regeln (`width:100%` / `max-width`) unberührt.
- **`components/Navbar.tsx`:** Mobile-Dropdown `w-[calc(100vw-24px)]` → `w-auto` (Breite jetzt über
  `left-3 right-3` = relativ zur eingerückten Leiste, kein Viewport-Bezug, kein Overflow). Zeile ist
  `xl:hidden` → nur Mobile.

## Phasen

### ✅ Phase 1 — Analyse & mobile-only Umsetzung
* [x] Navbar-Aufbau (Frame/Shell/Dropdown), CSS `--cc-nav-width=1000px` und Ist-Maße gemessen
* [x] Mobile-Inset via CSS-Media-Query (Frame + Shell, `calc(100% - 3.75rem)`)
* [x] Dropdown auf `w-auto` (leiste-relativ) umgestellt → kein Overflow
**Referenzen:** `index.css`, `components/Navbar.tsx`

### ✅ Phase 2 — Verifikation
* [x] Mobile 375px: Frame + Shell je `30px` Gap, `width 315`, deckungsgleich, kein h-Scroll (vorher 0/0/375)
* [x] Dropdown geöffnet: `42px` Gap (30 Leiste + 12), symmetrisch, kein Overflow, alle Items sichtbar
* [x] **Desktop 1280px: Frame unverändert `width 1000` / `140px` Gap zentriert, Voll-Nav sichtbar** (Beweis: Media-Query greift nicht)
* [x] `tsc --noEmit` grün, 0 Console-Fehler, Screenshots (vorher/nachher)
**Referenzen:** `index.css`, `components/Navbar.tsx`

## Kommentare
### Phase 1–2
**Eingehalten:** strikt mobile-only (Media-Query `max-width:767px` + `xl:hidden`-Zeile) ✅, **Desktop
messbar unverändert** (Frame 1000px zentriert wie zuvor) ✅, Frame+Shell deckungsgleich eingerückt ✅,
kein horizontales Scrollen ✅, Dropdown ohne Overflow nachgezogen ✅, `tsc` grün ✅, 0 Console-Fehler ✅,
Encoding sauber, Kommentar im CSS erklärt die Absicht ✅.

**Findings:** keine. Die eine Nebenwirkung (Dropdown-Overflow bei eingerückter Leiste) wurde vorausschauend
mitgefixt. Gap-Wert aktuell `1,875rem` (30px) je Seite — zentral in der Media-Query anpassbar, falls mehr/weniger gewünscht.

**Hauptkomponenten (max. 3):** `index.css` (Mobile-Media-Query), `components/Navbar.tsx` (Dropdown-Breite).
