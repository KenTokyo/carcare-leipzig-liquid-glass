# Tailwind-Opacity-Modifier — Zentraler Fix

**Datum:** 2026-07-08
**Feature-Ordner:** `docs/tailwind-opacity-fix/`
**Betroffene Dateien:** `index.html` (tailwind.config), `index.css` (:root Tokens)

## Problem (verifiziert)

In `index.html` mappt die `tailwind.config` Theme-Farben auf reine Hex-CSS-Variablen
(`white: 'var(--cc-white)'`, `black: 'var(--cc-carbon)'`, gray/blue/premium/tech).
Tailwinds Opacity-Modifier erzeugt daraus ungültiges CSS, z. B.
`bg-white/90` → `rgb(var(--cc-white) / 0.9)` → `rgb(#ffffff / 0.9)` (ungültig) → transparent.

**Folge:** Alle halbtransparenten Theme-Flächen rendern als `rgba(0,0,0,0)`.
Betroffen: **82 Fundstellen in 33 Quelldateien** (Hero-Karten/Badges, Section-Backgrounds
`bg-gray-50/70`, Glass-Effekte `bg-white/10`, Hero-Verläufe `from-black/80`,
Deko-Glows `bg-blue-600/15`, getönte Schatten `shadow-gray-200/60` u. v. m.).

## Lösungsstrategie (mehrere Ansätze geprüft)

- **Ansatz A — nur white/black fixen:** verworfen, lässt `bg-gray-50/70`,
  `bg-blue-600/15`, `shadow-gray-200/…` weiter defekt (sehr häufig).
- **Ansatz B — ganze Ramp naiv auf `<alpha-value>`:** verworfen. Die Text-Ramp
  `gray-300…700` hat *eingebackene* Alphas (z. B. `gray-400 = graphite@0.42`).
  Naiv umgestellt würde `text-gray-400`/`-500`/`-600` volldeckend (fast schwarz) →
  massive Regression im Fließtext.
- **Ansatz C (gewählt) — chirurgisch + appearance-preserving:**
  1. Jede **reine Hex**-Farbe → `rgb(var(--…-rgb) / <alpha-value>)` (Solid-Look identisch,
     Opacity funktioniert). Fehlende Kanal-Vars ergänzen (`--cc-white-rgb`, `--cc-soft-ice-rgb`).
  2. Die drei **eingebackenen-Alpha-Keys, die MIT Opacity genutzt werden**
     (`gray-100`, `blue-50`, `blue-200`) bekommen **geflachte Kanal-Vars**
     (Farbe über Weiß vorberechnet), damit der Solid-Look 1:1 bleibt und `/xx` korrekt wirkt.
  3. Die Text-Ramp `gray-300…700` (nie mit Opacity genutzt) bleibt **unverändert**.

### Geflachte Kanal-Werte (Farbe @Alpha über Weiß)
- `--cc-gray-100-rgb: 227 238 255`  (ice-blue #d8e8ff @ 0.72)
- `--cc-blue-50-rgb: 232 242 255`   (ice-blue @ 0.58)
- `--cc-blue-200-rgb: 221 235 255`  (ice-blue @ 0.88)
- `--cc-white-rgb: 255 255 255`
- `--cc-soft-ice-rgb: 245 248 252`  (#f5f8fc)

---

## Phasen

### ✅ Phase 1 — Kanal-Variablen ergänzen (`index.css`)
**Ziel:** Fehlende `-rgb`-Tokens für den `<alpha-value>`-Mechanismus bereitstellen.
* [x] `--cc-white-rgb: 255 255 255`, `--cc-soft-ice-rgb: 245 248 252` in `:root` ergänzt.
* [x] Geflachte Tokens `--cc-gray-100-rgb: 227 238 255`, `--cc-blue-50-rgb: 232 242 255`,
  `--cc-blue-200-rgb: 221 235 255` ergänzt (ASCII-Kommentare, kein Mojibake).

### ✅ Phase 2 — tailwind.config Farben umstellen (`index.html`)
**Ziel:** Alle betroffenen Keys auf `<alpha-value>`-Form; Text-Ramp unangetastet.
* [x] `white`, `black`, `gray-50/100/200/800/900/950`, komplette `blue`-Ramp,
  `premium`, `tech` auf `rgb(var(--…-rgb) / <alpha-value>)` umgestellt (29 Slots).
* [x] `gray-300…700` unverändert gelassen (5 eingebackene Alphas; per Grep bestätigt:
  **0** Opacity-Nutzungen auf diesen Steps → keine Reparatur nötig, Solid-Look 1:1).

### ✅ Phase 3 — Verifikation (isolierte Tailwind-Harness)
**Ziel:** Beweisen, dass Opacity-Modifier jetzt gültige, nicht-transparente Farben liefern.
* [x] Harness (`scratchpad/tw-opacity-harness.html`) mit identischer CDN + Config + Vars;
  in **echtem Headless-Chrome** gerendert (`--dump-dom`, virtual-time). Ergebnis:
  **ALL PASS (18/18)** — jede zuvor transparente Klasse liefert nun korrekten RGBA-Wert.
* [x] Solid-Keys gegengeprüft: `bg-gray-100→rgb(227,238,255)`, `bg-gray-950→rgb(8,11,16)`,
  Text-Ramp `text-gray-600→rgba(21,26,33,0.72)` — **unverändert**.
* [x] Statischer Integritäts-Check gegen die realen Dateien: config = valides JS,
  alle 10 referenzierten `-rgb`-Vars in `index.css` definiert, 29 `<alpha-value>` + 5 baked.
* Hinweis: Live-Dev-Server auf :3007 gehört zum **Haupt-Repo** (Prozess-Check: vite aus
  `…/carcare-leipzig-liquid-glass/node_modules`), nicht zum Worktree; Projektregel
  „NIEMALS `npm run dev` automatisch starten" → bewusst KEINE zweite Instanz gestartet.

### ✅ Phase 4 — Regressions-Analyse & Doku
**Ziel:** Neu sichtbar werdende Flächen bewerten, Findings + Memory dokumentieren.
* [x] Erwartete sichtbare Änderungen inventarisiert (siehe Kommentare unten).
* [x] Memory `tailwind-opacity-modifier-broken` auf „gelöst" aktualisiert; MEMORY.md-Index angepasst.

**Referenzen:**
`index.html`
`index.css`
`docs/tailwind-opacity-fix/tasks/2026-07-08-opacity-modifier-fix.md`

---

## Kommentare

### Phasen 1–4
**Eingehalten**: Mobile-First unberührt ✅, Dateien < 700 Zeilen ✅ (index.html 113, index.css 314),
Dev-Server NICHT automatisch gestartet ✅, kein Mojibake (ASCII-Kommentare im CSS) ✅,
appearance-preserving (Solid-Look 1:1, Text-Ramp unangetastet) ✅, mehrere Lösungsansätze
abgewogen (A/B/C) ✅, Verifikation mit echter Tailwind-JIT (18/18) + statischer Check ✅.

**Neu SICHTBAR werdende Flächen (vorher fälschlich transparent → jetzt wie im Code intendiert):**
Diese sind Absicht des Codes, wurden aber nie gerendert. Nach Merge am Worktree-Server final abnehmen.
- **Section-Backgrounds** `bg-gray-50/70` / `bg-gray-50/50` (Services-, Karriere-, Unfall-,
  Aufbereitungs-, Geschäftskunden-, Wissen-Seiten, TrustBar, References, ProcessTimeline, FAQ …):
  zarter Kaltweiß-Ton (#f5f8fc) statt reinem Weiß → gewünschte Sektions-Trennung (DESIGN.md). Größte Fläche.
- **Hero-Karten/Badges** (`bg-white/90`, `bg-white/[0.84]`, `bg-blue-50/[0.92]`, Veil-Verlauf):
  Milchglas-Backing hinter Text/Badges wird sichtbar → deutliche Lesbarkeitsverbesserung.
- **Glass-Panels & Ränder** auf dunklen Sektionen (`bg-white/10`, `border-white/20` …): Frosted-Look.
- **MobileStickyCTA** `bg-white/90`: Milchglas-Balken jetzt deckend genug → Lesbarkeit.
- **Deko-Glows** `bg-blue-600/10–20`, `bg-blue-200/45`, `bg-white/5`-Blurs: sanfte Ambient-Schimmer.
- **Getönte Hover-Schatten** `shadow-gray-200/40–70`, `shadow-blue-600/20`: weiche Elevation.

**Auffälligkeiten / Findings (nach Schwere):**
1. 🟠 **Hoch — Visuelle Endabnahme steht aus (umgebungsbedingt).** Mechanik ist verifiziert
   (18/18 + statisch), aber die neu sichtbaren Halbtransparenzen wurden NICHT im laufenden UI
   gesichtet, weil der :3007-Server das Haupt-Repo bedient und die Projektregel eine zweite
   Dev-Instanz verbietet. **Empfehlung:** Am Worktree-Server Home/`/leistungen`/`/kontakt`
   mobil+desktop durchklicken; falls ein Glow/Ton zu kräftig wirkt, punktuell Opazität senken.
2. 🟡 **Mittel — `components/Hero.tsx` ist toter Code.** Nirgends importiert (HomePage nutzt
   `HeroSection`). Enthält u. a. die einzigen `from-black/*`-Nutzungen. Kandidat zum Entfernen
   → als separater Task ausgelagert (Fokus dieses Fixes bleibt der zentrale Config-Fix).
3. 🟢 **Niedrig — Text-Ramp `gray-300…700` ohne Opacity-Support (bewusst).** Falls künftig
   `text-gray-500/60` o. ä. gebraucht wird, analog auf geflachte Kanal-Vars umstellen.
4. 🟢 **Niedrig — Geflachte Werte über Weiß vorberechnet.** `bg-blue-50/[0.92]` / `bg-blue-200/45`
   sitzen im Hero über dem Bild; Abweichung ggü. „echtem" ice-blue praktisch unsichtbar.

**Refactoring-Empfehlung (nach Gewichtung):** (1) Visuelle Endabnahme am Worktree-Server →
ggf. Feintuning einzelner Opazitäten. (2) `Hero.tsx` (und evtl. weitere ungenutzte Alt-Varianten)
nach Audit entfernen. (3) Optional: Kanal-Var-Konvention projektweit dokumentieren, damit neue
Farben direkt `<alpha-value>`-fähig angelegt werden.

**Hauptkomponenten-Pfade (max. 3, meiste Änderung):**
`index.html`
`index.css`
`components/HeroSection.tsx` (Referenz-Verifikation der reparierten Klassen)
