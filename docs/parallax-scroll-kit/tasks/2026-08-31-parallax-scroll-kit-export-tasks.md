# Parallax-Scroll-Kit — portabler Export für Fremdprojekte

> **Ziel:** Die Scroll-/Parallax-Mechanik dieser Seite so herauslösen, dass sie in einem
> **anderen** Projekt per Copy-Paste läuft — ohne Tailwind-Zwang, ohne CarCare-Inhalte,
> ohne Design-Tokens dieses Projekts.
>
> **Harte Randbedingung (User-Vorgabe 2026-08-31):** An der bestehenden Seite wird
> **nichts** verändert. Der Export liegt in einem eigenen, nirgends importierten Ordner
> (`parallax-scroll-kit/`). Kein bestehender Pfad wird angefasst.

## Bestandsaufnahme — was „die Scroll-Animation" dieser Seite tatsächlich ist

Die wahrgenommene Scroll-Animation entsteht aus **vier** getrennten Bausteinen, nicht aus einem:

| # | Baustein | Quelle im Projekt | Rolle |
|---|---|---|---|
| 1 | Lenis Smooth-Scroll (global) | `hooks/useSmoothScroll.ts` | Das *Gefühl*. Interpoliert Wheel/Touch Frame für Frame — **alle** scroll-gekoppelten Effekte erben die Flüssigkeit. |
| 2 | `useScrollProgress` | `hooks/useScrollProgress.ts` | Die *Messung*. window-basiert (`scroll` + `getBoundingClientRect`, rAF-gedrosselt) statt Framers `useScroll({target})`. |
| 3 | Hero-Bild-Parallax | `components/HeroSection.tsx` | Der eigentliche *Parallax*: überformatige Bildebene zieht langsamer durch einen `overflow-hidden`-Rahmen. |
| 4 | Sekundäreffekte | `ScrollPinnedProcess.tsx`, `DetailingGallery.tsx`, `Footer.tsx` | Sticky-Pin-Sequenz, Mehrspalten-Drift, Footer-Reveal — alle auf derselben Basis. |

**Konsequenz für den Export:** Wer nur die Hero-Bildebene kopiert, bekommt den Effekt *technisch*,
aber nicht das *Gefühl* — das kommt von Lenis (1). Deshalb exportiert das Kit beides zusammen.

## Geprüfte Lösungswege für den Export (bester gewählt)

- **A) Dateien 1:1 kopieren** → **VERWORFEN.** `HeroSection.tsx` trägt CarCare-Texte, `lucide-react`-Icons,
  Tailwind-Klassen und CSS-Custom-Properties (`--cc-carbon-rgb`) aus `index.css`. Im Fremdprojekt
  bricht das an drei Stellen gleichzeitig.
- **B) npm-Paket bauen** → **VERWORFEN.** Overhead (Build, Versionierung, Registry) für einen
  einmaligen Transfer; der User will „einfügen", nicht „installieren".
- **C) Entkoppelter Quellcode-Ordner, Tailwind-frei, prop-getrieben** → **GEWÄHLT.**
  Komponenten bringen ihr eigenes CSS mit (eine Datei), akzeptieren aber `className`-Passthrough,
  damit Tailwind-Projekte weiter überschreiben können. Inhalte kommen über `children`/Props.
- **Zusatzentscheidung:** `useParallax` als **framer-motion-freie** Variante mitliefern —
  falls das Zielprojekt Framer Motion nicht hat, läuft der Kern-Parallax trotzdem (nur React).

---

## Phasen

### ✅ Phase 1 — Analyse & Planung
**Ziel:** Alle Scroll-Effekte der Seite inventarisieren, Portabilitäts-Hürden benennen, Planung anlegen.
* [x] Alle Dateien mit `useScroll|useTransform|useScrollProgress|parallax` gefunden (8 Treffer)
* [x] Vier Bausteine identifiziert und ihre Abhängigkeiten untereinander geklärt (Tabelle oben)
* [x] Portabilitäts-Hürden benannt: Tailwind, `--cc-*`-Tokens, `lucide-react`, CarCare-Texte,
      `overflow: clip` am App-Shell, `scroll-behavior: smooth` muss entfernt sein
* [x] Diese Planungsdatei angelegt
**Referenzen:**
`components/HeroSection.tsx`
`hooks/useScrollProgress.ts`
`hooks/useSmoothScroll.ts`

### ✅ Phase 2 — Kern-Primitiven portieren (projektneutral)
**Ziel:** Die drei Hooks ohne Projektbezug in das Kit übernehmen.
* [x] `useScrollProgress.ts` übernommen — Logik unverändert, Kommentare auf Fremdprojekt umgeschrieben
* [x] `useSmoothScroll.ts` übernommen — inkl. `getLenis()`, Optionen (`lerp`, `anchors`) als Props geöffnet
* [x] `useMediaQuery.ts` übernommen (SSR-sicherer Start bei `false`)
* [x] `useParallax.ts` **neu** — framer-motion-freie Variante, schreibt `transform` direkt per rAF
**Referenzen:**
`parallax-scroll-kit/src/hooks/useScrollProgress.ts`
`parallax-scroll-kit/src/hooks/useParallax.ts`
`parallax-scroll-kit/src/hooks/useSmoothScroll.ts`

### ✅ Phase 3 — Parallax-Komponenten (Herzstück)
**Ziel:** Den Hero-Parallax als wiederverwendbare, inhaltsfreie Komponenten bereitstellen.
* [x] `ParallaxLayer.tsx` — generische Bildebene mit Überhang-Geometrie, Reise in % herleitbar
* [x] `ParallaxHero.tsx` — fertige Hero-Sektion (Art-Direction mobil/desktop, Veils, `children` für Inhalt)
* [x] Mobile-Abschaltung (`travelMobile = 0`) als Default übernommen — Begründung im Code
* [x] Geometrie-Invariante dokumentiert und in eine Hilfsfunktion gegossen (`deriveTravel`)
**Referenzen:**
`parallax-scroll-kit/src/components/ParallaxLayer.tsx`
`parallax-scroll-kit/src/components/ParallaxHero.tsx`

### ✅ Phase 4 — Sekundäreffekte (optional zuschaltbar)
**Ziel:** Die übrigen scroll-gekoppelten Effekte ebenfalls portabel anbieten.
* [x] `ParallaxColumns.tsx` — Mehrspalten-Drift (aus `DetailingGallery`), Kacheln über Props
* [x] `ScrollPinnedSequence.tsx` — Sticky-Pin + Crossfade-Sequenz (aus `ScrollPinnedProcess`), Render-Prop
* [x] `ScrollReveal.tsx` — Reveal beim Eintreten (die `whileInView`-Bewegung der Seite)
**Referenzen:**
`parallax-scroll-kit/src/components/ScrollPinnedSequence.tsx`
`parallax-scroll-kit/src/components/ParallaxColumns.tsx`
`parallax-scroll-kit/src/components/ScrollReveal.tsx`

### ✅ Phase 5 — CSS & Fallstricke
**Ziel:** Die unsichtbaren Voraussetzungen mitliefern, an denen ein Copy-Paste sonst scheitert.
* [x] `parallax-kit.css` — alle Klassen des Kits, ohne Tailwind, ohne Projekt-Tokens
* [x] `overflow: clip` statt `overflow-x: hidden` dokumentiert + als Utility-Klasse enthalten
* [x] `scroll-behavior: smooth`-Konflikt mit Lenis dokumentiert
* [x] `will-change`/`translateZ(0)`-Regeln für eigene Compositor-Layer enthalten
**Referenzen:**
`parallax-scroll-kit/src/styles/parallax-kit.css`

### ✅ Phase 6 — Demo & README
**Ziel:** Der Empfänger muss ohne Rückfragen starten können.
* [x] `demo/` — lauffähige Mini-App, die alle vier Bausteine zeigt
* [x] `README.md` — Installation in 3 Schritten, Props-Tabellen, Tuning-Werte, Troubleshooting
* [x] `package.deps.json` — exakte Versionen zum Kopieren
**Referenzen:**
`parallax-scroll-kit/README.md`
`parallax-scroll-kit/demo/Demo.tsx`

### ✅ Phase 7 — Verifikation
**Ziel:** Beweisen, dass (a) das Kit läuft und (b) die bestehende Seite unangetastet ist.
* [x] `npx tsc --noEmit` über das Kit — fehlerfrei
* [x] Eigenständiger Vite-Build des Kits im Scratchpad (nicht in diesem Projekt) — erfolgreich
* [x] Puppeteer-Screenshots bei zwei Scrollpositionen — Parallax-Versatz messbar nachgewiesen
* [x] `git status` — ausschließlich neue, nirgends importierte Dateien; kein Bestandspfad geändert
**Referenzen:**
`parallax-scroll-kit/README.md`

---

## Messwerte der Verifikation (Phase 7)

Gegen ein **frisch aufgesetztes** Vite-React-Projekt im Scratchpad, installiert mit
ausschliesslich den vier dokumentierten Abhaengigkeiten (react, react-dom, framer-motion, lenis):

| Pruefung | Ergebnis |
|---|---|
| `tsc --noEmit` mit `strict: true` und echten `@types/react@19` | fehlerfrei |
| `vite build` | erfolgreich (360 kB / 113 kB gzip inkl. React) |
| Console-Errors zur Laufzeit | keine |
| Hero-Parallax (1440x900, Ebene 1080 px = 120 %) | scrollY 0 → `translateY(-72px)`, 450 → `0`, 900 → `+72px` = exakt ±6.67 % der Ebenenhoehe, linear |
| Sticky-Pin | Buehne haelt `top: 0` ueber scrollY 1269–3059 (= exakt Trackhoehe minus Viewport), loest danach korrekt |
| Kartensequenz | schaltet bei den Dritteln, letzte Karte bleibt bis Trackende |
| Mehrspalten-Drift | 4er-Spalten -215 px, 5er-Spalten -480 px (unterschiedliche Geschwindigkeit bestaetigt) |
| Mobile (390x844) | Ebenenhoehe = Rahmenhoehe, `translateY` bleibt 0 → Parallax erwartungsgemaess aus |
| `overflow: clip` am Shell | `CSS.supports` true, sticky greift trotz Clipping |

## Nachweis: bestehende Seite unveraendert

| Pruefung | Ergebnis |
|---|---|
| `git diff --name-only` / `--cached` | leer — kein einziger Bestandspfad angefasst |
| `git status --porcelain` | nur neue, untracked Ordner (`parallax-scroll-kit/`, `docs/parallax-scroll-kit/`) |
| `grep parallax-scroll-kit` ueber App/Components/Pages/Scripts | kein Treffer — nirgends importiert, also nicht im Bundle |
| Tailwind `content`-Globs | enthalten `parallax-scroll-kit/` nicht → generiertes CSS unveraendert |
| `scripts/generate-sitemap.mjs` / `prerender.mjs` | scannen keine Verzeichnisse → unbeeinflusst |
| `npx tsc --noEmit` (Projekt) | weiterhin fehlerfrei |
| Zeilenlimit 700 | groesste Kit-Codedatei 156 Zeilen |

---

## Kommentare

### Phase 1–7
**Eingehalten**: unter 700 Zeilen ✅, Mobile-First ✅, Dev-Server nicht automatisch gestartet ✅ (Verifikation lief in einem eigenstaendigen Scratchpad-Projekt auf Port 4399, Port 3007 unberuehrt), keine Aenderung an Bestandsdateien ✅, Encoding UTF-8 ohne Mojibake ✅, mehrere Loesungswege vor der Umsetzung geprueft und begruendet verworfen ✅, Barrierefreiheit (inaktive Karten nicht fokussierbar, dekorative Ebenen `aria-hidden`) ✅

**Auffaelligkeiten/Findings (nach Schwere):**

1. 🟠 **Hoch — `@types/react` fehlt im Projekt, `npm run typecheck` ist dadurch weitgehend blind.**
   React 19 liefert keine gebuendelten Typen mehr, und `node_modules/@types/` enthaelt nur
   `node`, `estree` und babel-Pakete. Ergebnis: Jedes JSX-Element ist `any`, `React.FC`-Props
   werden nicht geprueft. `npx tsc --noEmit` laeuft nur deshalb gruen durch, weil `strict`
   in `tsconfig.json` aus ist — mit `strict: true` faellt sofort TS7026 („no interface
   JSX.IntrinsicElements exists") ueber die gesamte Codebasis.
   **Nicht gefixt** — bewusst: Der Auftrag lautete ausdruecklich, an der bestehenden Seite
   nichts zu veraendern, und `npm i -D @types/react @types/react-dom` wuerde `package.json`
   und `package-lock.json` anfassen und mit hoher Wahrscheinlichkeit eine Reihe bisher
   unsichtbarer Typfehler freilegen. Gehoert in eine eigene Sitzung. Siehe
   `docs/parallax-scroll-kit/tasks/2026-08-31-parallax-scroll-kit-optimierung-tasks.md`.

2. 🟡 **Mittel — `DetailingGallery` nutzt weiterhin `useScroll({ target })`.**
   Genau der Weg, den das Projekt in `hooks/useScrollProgress.ts` und in der
   hero-parallax-Planung als fragil dokumentiert hat (Einfrieren bei 0 durch
   overflow-Vorfahren, „Target ref is defined but not hydrated"). Letzteres hat real
   bereits eine weisse Seite auf `/fahrzeugaufbereitung-leipzig` verursacht.
   Das Kit hat dafuer den Messmodus `cover` bekommen, der genau das Framer-Offset
   `['start end', 'end start']` ersetzt — der Rueckbau in die Seite waere ein Einzeiler.
   **Nicht gefixt** — dieselbe Begruendung (keine Aenderung an der Seite).

3. 🟢 **Niedrig — 4-Spalten-Limit in `DetailingGallery` konstruktionsbedingt.**
   Dort erzeugt die Elternkomponente vier fest verdrahtete `useTransform`-Aufrufe, weil
   Hooks nicht in Schleifen laufen duerfen. Im Kit ist das geloest, indem jede Spalte eine
   eigene Komponente ist und ihr `useTransform` selbst aufruft → beliebig viele Spalten.
   Backport-faehig, aber ohne akuten Nutzen.

**Referenzen:**
`parallax-scroll-kit/README.md`
`parallax-scroll-kit/src/components/ParallaxLayer.tsx`
`parallax-scroll-kit/src/hooks/useScrollProgress.ts`
