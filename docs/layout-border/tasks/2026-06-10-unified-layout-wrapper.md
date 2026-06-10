# Redesign: Unified Layout Wrapper (Navbar + Page Frame)

Dieses Dokument beschreibt die Phasen zur Konsolidierung der globalen weißen Seitenumrandung (Page Frame) und des Headers / der Navbar in eine einzige Layout-Komponente (`Layout.tsx`), um eine nahtlose, integrierte Solidroad-Optik zu erzielen.

## Phasenplanung

### Phase 1 — Bereinigung und Syntax-Fix in App.tsx
**Ziel:** Die fehlerhafte, doppelte Struktur in `App.tsx` bereinigen, damit das Projekt wieder fehlerfrei kompiliert.
* [x] Fehlerhaften, doppelten Codeblock in `App.tsx` entfernen.
* [x] Erfolgreichen Kompilierungs- und TypeScript-Check durchführen.

**Referenzen:**
`App.tsx`
`npx tsc --noEmit` ausgeführt (0 Fehler)

---

### Phase 2 — Konzeption und Erstellung der Layout-Komponente
**Ziel:** Eine neue Komponente `components/Layout.tsx` erstellen, die als Parent-Wrapper für die gesamte Seite dient und Navbar sowie die weiße Umrandung vereint.
* [x] Die neue Komponente `components/Layout.tsx` erstellen.
* [x] Den globalen weißen Seitenrahmen aus `App.tsx` in `Layout.tsx` überführen.
* [x] Die Navbar und den Footer in `Layout.tsx` einbinden.
* [x] Scroll-State (`scrolled`) und Footer-Visibility-Logic (`footerVisible`) aus `Navbar.tsx` in `Layout.tsx` verlagern, damit das Gehäuse von einer zentralen Stelle gesteuert wird.

**Referenzen:**
`components/Layout.tsx`

---

### Phase 3 — Anpassung der Navbar-Komponente
**Ziel:** `components/Navbar.tsx` bereinigen, so dass sie sich nur noch auf die inneren Navigationselemente konzentriert, während die äußeren Gehäuse-Elemente von `Layout.tsx` gerendert werden.
* [x] Die äußeren Gehäuse-Elemente (`solidroad-hud-layer`, `solidroad-header-rail`, `solidroad-nav-frame`, `solidroad-nav-cutouts`) aus `Navbar.tsx` entfernen.
* [x] `Navbar.tsx` so anpassen, dass sie nur noch die eigentliche Navigationsleiste (`solidroad-nav-shell`) rendert und nötige State-Props empfängt (z. B. `scrolled`).

**Referenzen:**
`components/Navbar.tsx`

---

### Phase 4 — Integration in App.tsx & Validierung
**Ziel:** Die Seiten und das Routing in `App.tsx` durch das neue `Layout` umschließen und die Gesamtfunktion prüfen.
* [x] Die `App.tsx` anpassen, um `<Layout>` um die Seiten und Routen zu legen.
* [x] Lokalen Build- und TypeScript-Check (`npx tsc --noEmit` & `npm run build`) durchführen.

**Referenzen:**
`App.tsx`
`npx tsc --noEmit` ausgeführt (0 Fehler)
`npm run build` ausgeführt (Erfolgreich, 0 Fehler)

---

## Kommentare
### Phase 1
**Eingehalten**: unter 700 Zeilen ✅, Syntax repariert ✅, Compilierung erfolgreich ✅
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere)**: Keine. Der fehlerhafte Merge-Konflikt (doppelter Importblock in App.tsx) wurde vollständig bereinigt.

### Phase 2
**Eingehalten**: unter 700 Zeilen ✅, Mobile-First beibehalten ✅, Modularität ✅
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere)**: Keine. Die Logik für Scroll und Footer-Sichtbarkeit wurde sauber in den Parent-Wrapper verlagert.

### Phase 3
**Eingehalten**: unter 700 Zeilen ✅, Dateigröße reduziert (auf 317 Zeilen) ✅, Modularität ✅
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere)**: Keine. Die Navbar verhält sich nun rein als Inhaltskomponente und ist unabhängig von globalen Layout-Schalen.

### Phase 4
**Eingehalten**: unter 700 Zeilen ✅, Build erfolgreich ✅, TypeScript-Verifizierung erfolgreich ✅
**Auffälligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere)**: Keine. Die App läuft stabil und das neue unified Layout bindet alle Bestandteile sauber zusammen.
