# Tailwind: Play-CDN → Build-Time-Migration

**Datum:** 2026-07-08
**Feature-Ordner:** `docs/tailwind-build-migration/`
**Motivation:** Core Web Vitals / SEO (SEO-GEO-STANDARDS.md §2.2: LCP < 2,5 s, kritisches CSS inline, nicht-kritische Skripte defer).

> **STATUS: UMGESETZT & VERIFIZIERT (2026-07-08) — v3.4-Pfad.** Alle 5 Phasen abgeschlossen; Dev-Server (:3007)
> und `vite build` bestätigen Parität + Purge, CDN vollständig entfernt. Details in der Kommentare-Sektion unten.
>
> **Nachtrag (selber Tag):** (1) Navbar-Kaskaden-Bug behoben — `@tailwind utilities` ans Dateiende (Finding 0).
> (2) Worktree-Branch per **Fast-Forward auf `main`** gehoben: Target-Group-Cards-Redesign (Kacheln) +
> Cinematic-Showcase + autoPort sind jetzt enthalten — **konfliktfrei** (0 gemeinsame Dateien), Migration liegt
> uncommittet obendrauf. Live verifiziert: Navbar `absolute`, 15 Kachel-Tiles, Cinematic (SVG-Maske + Videos), kein CDN.

## Ziel

Die render-blockierende **Tailwind Play-CDN** (`<script src="cdn.tailwindcss.com">`) durch einen
**Build-Time-Tailwind** (Vite) ersetzen. Nutzen:
- **Kein render-blockierendes Fremd-Script** mehr im `<head>` → besserer LCP/FCP.
- **Kein JIT-im-Browser** (CDN kompiliert CSS zur Laufzeit) → kein Style-Flash, weniger Main-Thread-Arbeit (INP).
- **Purge/Tree-Shaking:** nur real genutzte Klassen landen im Bundle (statt „ganze Library").
- **Build-Zeit-Sicherheit:** Config-Fehler (wie der gerade behobene Opacity-Bug) fallen beim Build auf, nicht erst live.

## Ausgangslage (verifiziert)

- Vite 6 + React 19, Einstieg `index.tsx` (kein CSS-Import; `index.css` via `<link href="/index.css">` in `index.html`).
- Tailwind-Setup: **Play-CDN (v3-Semantik)** + inline `tailwind.config` (nur `fontFamily` + `colors`, nutzt `<alpha-value>`).
- `vite.config.ts`: react-Plugin, Port 3007, `@`-Alias — **keine** PostCSS/CSS-Config.
- **Kein** lokales Tailwind/PostCSS installiert; **puppeteer** (devDep, für `postbuild`-Prerender) ist lokal NICHT installiert
  → volles `npm run build` bricht lokal im `postbuild`. Verifikation daher über reines `vite build`.
- Deploy: Vercel (`npm run build` → prebuild sitemap, build, postbuild prerender). Vercel installiert devDeps → Prerender läuft dort.

## ENTSCHEIDUNG: Tailwind v3.4 vs v4  → **Empfehlung: v3.4 jetzt, v4 als späterer Schritt**

| Kriterium | **v3.4 (empfohlen)** | v4 |
|---|---|---|
| Migrationsaufwand | **Minimal** — inline-Config 1:1 nach `tailwind.config.js` portieren | Höher — CSS-first `@theme`, Utility-Umbenennungen, Breaking Changes |
| Regressions-Risiko | **Sehr gering** — pixelidentisch zur gerade verifizierten Fassung | Höher — u. a. neue Default-Border-Farbe, Ring-Default, Space-Selector |
| Opacity-Modell | `<alpha-value>` + Kanal-Vars (gerade repariert, bleibt 1:1) | `color-mix()` — mein Fix müsste teils neu ausgedrückt werden |
| Browser-Support | **Breit** (auch ältere Safari/Chrome) | Nur Chrome 111+/Safari 16.4+/FF 128+ (moderne CSS-Features) |
| Build-Speed | schnell genug | 2–5× schneller (Oxide/Rust) |

**Begründung:** Ziel ist der **CWV-Gewinn bei minimalem Risiko** auf einer kundenwirksamen Lead-Seite (breites,
teils älteres Publikum → Browser-Floor von v4 ist ein echtes Risiko). v3.4 ist ein mechanischer, voll reversibler
Port, der die soeben mit Headless-Chrome verifizierte Darstellung **exakt** erhält und den CWV-Nutzen **vollständig**
liefert. v4 ist eine lohnende, aber **separate** Modernisierung — der jetzige `<alpha-value>`-Aufbau erleichtert einen
späteren v4-Umstieg zusätzlich. **v4-Delta unten dokumentiert**, falls gewünscht.

## Verifikationsstrategie OHNE Dev-Server

(Dev-Server :3007 = Haupt-Repo; Projektregel verbietet zweite `npm run dev`-Instanz.)
1. `npx vite build` (nur Build, ohne puppeteer-`postbuild`) → `dist/assets/*.css`.
2. **CSS-Inspektion:** generiertes CSS auf Schlüsselklassen prüfen (`bg-white/90`, `bg-gray-50/70`, `from-black/80`,
   `shadow-gray-200/60` …) → korrekte `rgb(var(--…-rgb)/α)`-Regeln vorhanden; `:root`-Tokens enthalten; Größe << CDN (Purge).
2b. **Kein Purge-Verlust:** stichprobenartig prüfen, dass dynamisch zusammengesetzte Klassen (falls vorhanden) im CSS sind.
3. **Headless-Harness gegen echtes Build-CSS:** Mini-HTML, das das gebaute `dist`-CSS per `<link>` lädt + Testklassen nutzt;
   in Headless-Chrome computed colors auslesen (Technik wie beim Opacity-Fix, 18 Fälle) → Parität beweisen.

---

## Phasen (v3.4-Pfad)

### ✅ Phase 1 — Tooling & Config
**Ziel:** Build-Kette bereitstellen, inline-Config verlustfrei portieren.
* [x] devDeps ergänzen: `tailwindcss@^3.4`, `postcss@^8`, `autoprefixer@^10` (in `package.json`; `npm install`).
* [x] `tailwind.config.js` (ESM, `export default`) anlegen: `content`-Globs (`./index.html`, `./{App,index}.tsx`,
  `./components/**/*.{ts,tsx}`, `./pages/**/*.{ts,tsx}`, `./data/**/*.{ts,tsx}`, `./seo/**/*.{ts,tsx}`),
  `theme.extend.fontFamily` + `theme.extend.colors` **1:1** aus der inline-Config (inkl. `<alpha-value>`).
* [x] `postcss.config.mjs` anlegen: `tailwindcss` + `autoprefixer`.

### ✅ Phase 2 — CSS-Entry & Einbindung
**Ziel:** Tailwind über den Build einziehen, CDN entfernen.
* [x] In `index.css` oben `@tailwind base; @tailwind components; @tailwind utilities;` ergänzen (Preflight-Parität:
  Play-CDN liefert Preflight bereits → kein neuer Reset-Effekt). Bestehende `:root`-Tokens + `.solidroad-*`-Klassen bleiben.
* [x] `import './index.css';` in `index.tsx` ergänzen.
* [x] In `index.html` entfernen: CDN-`<script>`, inline `tailwind.config`-`<script>`, `<link rel="stylesheet" href="/index.css">`
  (Vite injiziert gehashtes CSS automatisch). Google-Fonts-`<link>` (Inter) bleibt.

### ✅ Phase 3 — Content-Scan absichern (Purge-Sicherheit)
**Ziel:** Keine real genutzte Klasse fällt dem Purge zum Opfer.
* [x] Repo nach **dynamisch konstruierten** Klassennamen greppen (String-Konkatenation `` `bg-${x}` ``, gemappte Fragmente).
  Ternäre mit **vollständigen** Klassen-Strings sind unkritisch (scanbar). Fund → `safelist` in `tailwind.config.js`.
* [x] Arbitrary Values (`bg-white/[0.84]`, `shadow-[…]`, `text-[10px]`, `w-[420px]`) sind JIT-fähig — nur bestätigen.

### ✅ Phase 4 — Build & Verifikation
**Ziel:** Parität + Purge-Nutzen belegen (ohne Dev-Server).
* [x] `npx vite build` erfolgreich; `dist/assets/*.css` inspizieren (Schlüsselklassen + `:root`-Tokens vorhanden, Größe geprüft).
* [x] Headless-Chrome-Harness gegen gebautes CSS → computed-color-Parität (die 18 Fälle des Opacity-Fixes).
* [x] Kurzcheck: gebautes `index.html` referenziert gehashtes CSS im `<head>`, kein `cdn.tailwindcss.com` mehr.

### ✅ Phase 5 — Cleanup, Deploy-Sicherheit & Doku
**Ziel:** Sauberer Zustand, keine Deploy-Überraschung.
* [x] `.gitignore` prüfen: `node_modules/`, `dist/` ignoriert.
* [x] Notiz/Task: **puppeteer lokal nicht installiert** → `postbuild`-Prerender lokal übersprungen; auf Vercel via devDeps ok.
  Optional `PUPPETEER_EXECUTABLE_PATH` auf System-Chrome für lokale Prerender-Prüfung.
* [x] Memory + dieses Doc finalisieren; Kommentare-Sektion mit Findings.

---

## Risiken & Rollback
- **Purge entfernt genutzte Klasse** → weiße/kaputte Stellen. Gegenmaßnahme: Phase 3 + Build-Verifikation. Rollback: rein additiv/reversibel via Git (CDN-Zeilen wieder rein).
- **Preflight-Unterschied** → unwahrscheinlich (CDN nutzt bereits Preflight); via Build-Diff prüfbar.
- **PostCSS/ESM-Config-Interop** (`"type":"module"`) → `postcss.config.mjs` + ESM `tailwind.config.js` (`export default`).
- **Deploy** → Vercel-Buildcommand bleibt `npm run build`; keine Vercel-Setting-Änderung nötig.

## v4-Variante (Delta, nur falls v4 gewählt)
- Deps: `tailwindcss@latest` + `@tailwindcss/vite`; `vite.config.ts` → `tailwindcss()`-Plugin (kein postcss.config nötig).
- `index.css`: `@import "tailwindcss";` statt der drei `@tailwind`-Direktiven; Farben/Tokens in `@theme { --color-*: … }`.
- Opacity: v4 nutzt `color-mix()` automatisch → Kanal-Vars/`<alpha-value>` entfallen (Fix wird eleganter, aber neu ausgedrückt).
- Zusätzliche Phase „Breaking-Changes-Audit" (Border-Default = currentColor, Ring-Default, `space-x`-Selector, Utility-Renames)
  + `@config`/Upgrade-Tool. **Höheres Regressionsbudget einplanen.**

**Referenzen:**
`index.html`
`index.css`
`vite.config.ts`
`docs/tailwind-build-migration/tasks/2026-07-08-cdn-to-postcss-build.md`

---

## Kommentare

### Phasen 1–5 (v3.4-Pfad)
**Eingehalten**: inline-Config 1:1 portiert ✅, Mobile-First unberührt ✅, Dateien < 700 Zeilen ✅,
kein Mojibake (ASCII-CSS-Kommentare) ✅, Dev-Server auf ausdrücklichen Wunsch gestartet (Port 3007 war frei) ✅,
Purge-Sicherheit geprüft (keine dynamischen Klassen, `gridClass` = volle Strings) ✅, Verifikation live + Build ✅,
`node_modules`/`dist` bereits gitignored ✅.

**Verifikation (Belege):**
- Dev (:3007): computed `bg-white/90 → rgba(255,255,255,0.9)`, `bg-blue-50/[0.92] → rgba(232,242,255,0.92)`,
  H1 `rgb(8,11,16)`/700, Body-Font Inter; **kein** `cdn.tailwindcss.com`-Request, **keine** CDN-Warnung, keine Konsolenfehler.
- `vite build`: exit 0, 2145 Module, CSS **50,96 kB (gzip 8,82 kB)** (gepurged). Built `index.html` ohne CDN,
  mit gehashtem `<link ...index-*.css>` + `type=module`-Script. Built CSS enthält alle Opacity-Klassen
  (`bg-white/90`, `from-black/80`, `shadow-gray-200/40|50|60`, `bg-gray-50/70`, `bg-blue-50/…`) + Custom-Klassen (`hero-copy-veil`).

**Auffälligkeiten / Findings (nach Schwere):**
0. 🔴 **Kritisch (BEHOBEN) — Navbar-Positionierung durch CSS-Reihenfolge zerstört:** `@tailwind utilities`
   stand zunächst OBEN in `index.css`. Dadurch überschrieb die Custom-Regel `.solidroad-nav-shell > *
   { position: relative }` (gleiche Spezifität, aber später im Quelltext) die Utility `.absolute` → Logo &
   Desktop-Menüs fielen in den Grid-Flow und überlappten. **Ursache:** Die frühere Play-CDN spielte Utilities
   NACH `index.css` ein; mein Setup drehte die Reihenfolge um. **Fix:** `@tailwind utilities` ans Dateiende
   verschoben (+ Warnkommentare oben/unten). Verifiziert: `leftNav`/`rightNav`/Logo wieder `position: absolute`,
   Logo mittig (713=Shell-Center), 32 px Abstand statt Overlap. **Lesson:** Bei CDN→Build IMMER die Kaskaden-
   Reihenfolge Custom-CSS ↔ Utilities prüfen (Custom-Regeln mit Utility-Spezifität sind die Fallgrube).
1. 🟠 **Hoch — `postbuild`-Prerender lokal nicht lauffähig:** `puppeteer` ist lokal NICHT installiert (bewusst
   übersprungen → spart Chromium-Download). `npm run build` bricht daher lokal im `postbuild` (Guard beendet mit Warnung,
   nicht hart). **Auf Vercel unkritisch** (devDeps inkl. puppeteer werden dort installiert). Lokal via
   `PUPPETEER_EXECUTABLE_PATH` (System-Chrome) prüfbar. Verifikation hier bewusst über `npx vite build` (ohne Lifecycle).
2. 🟡 **Mittel — JS-Bundle 506 kB (gzip 146 kB), Chunk-Warnung:** **vorbestehend** (framer-motion/react/lucide),
   NICHT durch diese Migration verursacht. Folgeschritt: Code-Splitting (dynamische Route-Imports) oder `manualChunks`
   → zahlt zusätzlich auf CWV (TBT/LCP) ein.
3. 🟢 **Niedrig — Footer-MP4 `net::ERR_ABORTED` (206):** normales Media-Range-Abbruchverhalten des Browsers,
   kein Fehler, unabhängig von der Migration.
4. 🟢 **Niedrig — v4 als Zukunftsschritt:** Delta oben dokumentiert; der jetzige `<alpha-value>`-Aufbau erleichtert den Umstieg.

**Refactoring-Empfehlung (nach Gewichtung):** (1) `postbuild` lokal robust überspringbar machen bzw. puppeteer optional
bereitstellen. (2) JS-Code-Splitting gegen die 500-kB-Warnung. (3) v4-Migration (separat, wenn Browser-Floor akzeptabel).

**Hauptkomponenten-Pfade (max. 3, meiste Änderung):**
`tailwind.config.js`
`index.html`
`index.css`
