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
4. **Globale HUD-/Aperture-Shell:** Nach User-Feedback notwendig, weil Solidroad den Effekt ueber die gesamte Website fortsetzt: fixed Navbar-Layer, heller Canvas-Rahmen oben/unten/seitlich und gerundete Content-/Footer-Flaechen.

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
**Finaler Global-Shell-Check:** `output/playwright/solidroad-live-fluid-reference.png`, `output/playwright/carcare-fluid-nav-soft-top.png`, `output/playwright/carcare-fluid-nav-soft-mid.png`, `output/playwright/carcare-fluid-nav-soft-footer.png`, `output/playwright/carcare-fluid-nav-mobile-top.png`. Build-Preview auf `127.0.0.1:4173`, keine Console-Errors, eine bestehende Tailwind-CDN-Warnung, Mobile-Overflow `0`.

### Phase 5 -- Nachanalyse Global Shell
**Ziel:** User-Feedback pruefen: Solidroad-Effekt nicht nur im Hero, sondern als globale HUD-/Card-Shell ueber die ganze Website verstehen.
* [x] Solidroad im In-App-Browser oben, mittig und unten gescrollt.
* [x] Befund dokumentiert: Solidroad nutzt einen fixed Full-Viewport-Overlay-Layer fuer die Navbar und darunter gerundete Inhalts-/Footer-Paneele mit ca. 16px Canvas-Inset.
* [x] CarCare-Befund dokumentiert: bisher nur Hero-Karte und Navbar, Footer bleibt full-width und nicht als globale Card.
**Referenzen:**
`App.tsx`
`components/Navbar.tsx`
`components/Footer.tsx`

### Phase 5 Kommentar
**Eingehalten:** User-Feedback neu bewertet und Solidroad nicht nur im Hero, sondern ueber Top/Mid/Footer analysiert.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Mittel: Der erste Umbau rahmte Hero/Navbar, aber nicht die gesamte Scroll-Flaeche. Dadurch wirkte der Footer nicht wie eine globale Karte.

### Phase 6 -- Globale Website-Shell
**Ziel:** Main-Content und Footer als globale gerundete Shell umsetzen, damit der Effekt beim Scrollen bis zum Footer erhalten bleibt.
* [x] `App.tsx` mit globaler Shell-Klasse fuer Root/Main versehen.
* [x] `HeroSection.tsx` doppelte Aussen-Paddings entfernen, damit Hero in der globalen Shell sitzt.
* [x] `Footer.tsx` fixed Reveal-Footer als inset/rounded Card statt full-width Flaeche darstellen.
* [x] `index.css` mit globalen Shell-Variablen und Helfern erweitern.
**Referenzen:**
`App.tsx`
`components/HeroSection.tsx`
`components/Footer.tsx`

### Phase 6 Kommentar
**Eingehalten:** Root/Main/Footer erhielten eine gemeinsame Shell, Hero-Padding wurde entfernt, Footer ist nun als inset/rounded fixed Reveal-Karte sichtbar.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Der laufende `localhost:3000` lieferte teilweise stale transformierte Module. Fuer finale Screenshots wurde deshalb die Build-Preview genutzt; der Dev-Server wurde gemaess Projektregel nicht automatisch neu gestartet.

### Phase 7 -- Navbar HUD-Fix und Validierung
**Ziel:** Navbar wie Solidroad als schmaleren, oben fixierten HUD-Layer korrigieren und mit Browser-Vergleich pruefen.
* [x] Navbar auf top-flush Fixed-HUD ohne y-Shift umbauen.
* [x] Desktop-Breite an Solidroad annaehren, Phone-CTA erst bei sehr breiten Viewports zeigen.
* [x] `npx tsc --noEmit`, `npm run build` und Playwright-CLI-Check auf Build-Preview durchgefuehrt.
**Referenzen:**
`components/Navbar.tsx`
`output/playwright/solidroad-ref-footer-iab.png`
`output/playwright/carcare-local-footer-iab.png`

### Phase 8 -- Fluid Navbar/Frame-Korrektur
**Ziel:** User-Feedback umsetzen: Navbar darf nicht wie eine separate Box wirken, sondern muss mit den globalen Linien/Ausschnittkanten fluessig zusammengehoeren.
* [x] Eigene Navbar-Aussenkontur entfernt; nur weiche Unterkante und Shadow behalten.
* [x] Globale HUD-Kontur stark reduziert, damit keine zweite Rahmenbox hinter der Navbar entsteht.
* [x] Top-, Mid-, Footer- und Mobile-Zustaende per Playwright CLI erneut verglichen.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`output/playwright/carcare-fluid-nav-soft-top.png`
`output/playwright/carcare-fluid-nav-soft-mid.png`
`output/playwright/carcare-fluid-nav-soft-footer.png`
`output/playwright/carcare-fluid-nav-mobile-top.png`

### Phase 7 Kommentar
**Eingehalten:** Navbar ist top-flush, fixed und ohne Scroll-y-Versatz; Breite/Radius orientieren sich an Solidroad, CTAs bleiben responsiv.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. `npx tsc --noEmit` und `npm run build` erfolgreich.

### Phase 8 Kommentar
**Eingehalten:** Die Navbar-Kontur wurde reduziert, damit sie wie eine Aussparung im globalen HUD wirkt. Die globale Frame-Kante bleibt sichtbar, ohne als zweite Karte hinter der Navbar zu erscheinen.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Mittel: Bestehende Tailwind-CDN-Warnung bleibt unveraendert; keine Runtime-Fehler im Playwright-Check.

### Phase 9 -- Navbar-Randverbindung
**Ziel:** User-Feedback umsetzen: Die Navbar-Raender muessen sichtbar und mit dem globalen Card-Rahmen verbunden wirken, statt als lose weisse Flaeche ueber dem Hero zu stehen.
* [x] Linke/rechte Navbar-Kanten mit subtiler Umrandung ausgearbeitet.
* [x] Separate Connector-Kurven verworfen, weil sie als Einzelkurve statt als zusammenhaengende Linie wirkten.
* [x] Globale HUD-Kante so abgestimmt, dass die Linien an der Navbar optisch zusammenlaufen.
* [x] Desktop/Mobile per Playwright CLI geprueft und Build/TypeScript erneut validiert.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 9 Kommentar
**Eingehalten:** Navbar-Raender sichtbar nachgezogen, keine Inhalts-/Farb-/Textaenderungen, Mobile-First kontrolliert, Dateien unter 700 Zeilen, `npx tsc --noEmit` und `npm run build` erfolgreich.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Ein erster Connector-Ansatz erzeugte links eine sichtbare Einzelkurve; direkt entfernt und durch eine saubere gemeinsame Border an der Navbar ersetzt.
**Playwright:** `output/playwright/carcare-nav-border-fix-top.png`, `output/playwright/carcare-nav-border-fix-scrolled.png`, `output/playwright/carcare-nav-border-fix-mobile-390.png`.
