# Solidroad Hero Shell und Floating Navbar

**Erstellt:** 2026-06-03  
**Status:** Abgeschlossen  
**Workflow:** Phasenweise ohne Stops, Dokumentation nach jeder Phase

## Ziel
Die Startseite soll den Solidroad-inspirierten Card-Shell-Effekt erhalten: weisser Seitenrahmen, innen eine grosszuegige Hero-Karte mit Bild, stark abgerundeten Ecken, Floating-Navbar, Backdrop-Blur und weichen Shadows. Farben, Texte, Navigation und bestehende Inhaltsstruktur von CarCare bleiben erhalten.

## Loesungsansaetze
1. **Nur Navbar anpassen:** Schnell, aber der weisse Rahmen/Karten-Scroll-Effekt entsteht nicht ausreichend.
2. **Nur HeroSection rahmen:** Gute Wirkung im ersten Viewport, aber Navbar und Scroll-Verhalten bleiben visuell getrennt.
3. **HeroSection als Card-Shell plus Navbar als ausgesparte Floating-Pill:** Beste Wahl, weil sie Solidroad am naechsten kommt und trotzdem die bestehende CarCare-Struktur, Texte und CI-Farben bewahrt.

## Phasenplan

### Phase 1 -- Referenzanalyse und Planung
**Ziel:** Solidroad Hero/Navbar mit Playwright CLI analysieren und Umsetzung auf betroffene CarCare-Komponenten begrenzen.
* [x] Projektregeln, DESIGN.md und Phasenworkflow gelesen.
* [x] Betroffene Dateien identifiziert: `components/Navbar.tsx`, `components/HeroSection.tsx`, `index.css`.
* [x] Solidroad per Playwright CLI visuell/technisch geprueft: Referenz-Navbar 1000px breit/100px hoch, Hero-Inset ca. 16-24px, Body hell, Navbar unten 24px gerundet.
**Referenzen:**
`components/Navbar.tsx`
`components/HeroSection.tsx`
`index.css`

### Phase 2 -- Floating Navbar
**Ziel:** Navbar als Solidroad-aehnliche weisse Pill-Bar mit Aussparungs-/Floating-Effekt, Blur und Scroll-Shadow umsetzen.
* [x] Desktop-Navbar mit weisser, oben angedockter Floating-Pill ueber dem Hero aufgebaut.
* [x] Mobile-Navbar kompakt und bedienbar gehalten.
* [x] Scroll-Zustand mit staerkerem Floating-Shadow und Blur verfeinert.
**Referenzen:**
`components/Navbar.tsx`

### Phase 3 -- Hero Card Shell
**Ziel:** HeroSection in weissen Seitenrahmen und innere Card mit Bild, Rundungen, Shadow und Inhalt aufwerten.
* [x] Hero-Text, CTAs und Highlights inhaltlich unveraendert gelassen.
* [x] Desktop- und Mobile-Shell responsive umgesetzt.
* [x] Globale Hilfsklassen fuer Shell/Shadows ergaenzt: `.hero-card-shell`, `.solidroad-nav-shell`.
**Referenzen:**
`components/HeroSection.tsx`
`index.css`

### Phase 4 -- Validierung und Dokumentation
**Ziel:** TypeScript/Build pruefen, Playwright-Vergleich lokal vs. Referenz durchfuehren und Findings dokumentieren.
* [x] `npx tsc --noEmit` ausgefuehrt.
* [x] `npm run build` ausgefuehrt.
* [x] Mit Playwright CLI Screenshots der Referenz und lokalen Preview-Seite verglichen.
* [x] Favicon-404 mit vorhandenem Logo-Asset gefixt.
* [x] Phasen und Auffaelligkeiten final dokumentiert.
**Referenzen:**
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`
`output/playwright/solidroad-hero-top.png`
`output/playwright/carcare-hero-top.png`

## Kommentare

### Phase 1
**Eingehalten:** Plan vor Code erstellt, bestehende Texte/Farben als Grenze definiert, Mobile-First beruecksichtigt, Max-700-Zeilen-Regel geprueft.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings vor Implementierung.

### Phase 2
**Eingehalten:** Solidroad-Referenz abstrahiert statt kopiert, vorhandene Navigation/Links beibehalten, Navbar unter 700 Zeilen, Mobile-Zustand erhalten, Scroll-Shadow umgesetzt.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Anfangs wurde der neue Tailwind-Arbitrary-Background nicht als computed Background sichtbar; gefixt durch feste `.solidroad-nav-shell` CSS-Regel.

### Phase 3
**Eingehalten:** Hero-Texte/CTAs unveraendert, CI-Farben beibehalten, weisser Canvas plus innere Bildkarte umgesetzt, responsive Inset/Radien gesetzt, Datei unter 700 Zeilen.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine kritischen Findings. Mobile-Hero wird durch Inhalt hoeher als ein Viewport, bleibt aber ohne horizontalen Overflow und mit sichtbarem Karteneffekt.

### Phase 4
**Eingehalten:** `npx tsc --noEmit` 0 Fehler, `npm run build` erfolgreich, Playwright CLI Referenz-Screenshots und lokale Screenshots erstellt, temporaerer Vite-Preview nach Test gestoppt.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Mittel: Tailwind CDN warnt weiterhin vor Produktionseinsatz. Bestehendes Projekt-Setup nutzt CDN in `index.html`; Migration ist separat geplant in `docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell-optimierung-tasks.md`.
2. Niedrig: `favicon.ico` 404 wurde im Playwright-Check entdeckt und durch `link rel="icon"` auf `/assets/carcare-center-logo.webp` gefixt.

## Playwright-Ergebnis
**Referenz Solidroad:** `output/playwright/solidroad-hero-top.png`, `output/playwright/solidroad-scrolled.png`.
**CarCare lokal:** `output/playwright/carcare-hero-top.png`, `output/playwright/carcare-scrolled.png`, `output/playwright/carcare-mobile-top.png`.
**Messwerte lokal Desktop:** Navbar `1280x90`, `border-radius: 0 0 26.4px 26.4px`, `background: rgba(255,255,255,0.92)`, `backdrop-filter: blur(40px)`. Hero `1568x868`, `x/y: 16/16`, Radius `28px`, kein horizontaler Overflow.
**Messwerte lokal Mobile:** Viewport `390x844`, Navbar `374x78`, Hero `374x1072`, kein horizontaler Overflow.
