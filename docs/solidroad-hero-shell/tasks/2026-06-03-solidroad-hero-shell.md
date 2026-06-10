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

### Phase 10 -- Navbar als Top-Dock
**Ziel:** User-Feedback umsetzen: Die Navbar muss wie bei Solidroad mit der oberen weissen Flaeche verbunden sein, nicht wie ein separater Balken mit eigener Umrandung wirken.
* [x] Eigene Border-/Floating-Optik der Navbar entfernt.
* [x] Weisse Top-Dock-Flaeche per CSS-Pseudo-Element nach oben verbunden.
* [x] Nur die untere Kante/Rundung subtil markiert.
* [x] Build, TypeScript und Playwright-Vergleich erneut geprueft.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 10 Kommentar
**Eingehalten:** Navbar als oben angedockte Flaeche umgesetzt, keine Text-/Farbstruktur geaendert, Mobile-First geprueft, Dateien unter 700 Zeilen, Port-Konfiguration bei 3007 belassen.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. `npx tsc --noEmit` und `npm run build` erfolgreich.
**Playwright:** `output/playwright/carcare-nav-top-dock-top.png`, `output/playwright/carcare-nav-top-dock-scrolled.png`, `output/playwright/carcare-nav-top-dock-mobile-390.png`.

### Phase 11 -- Navbar-Ecken verbinden
**Ziel:** User-Feedback umsetzen: Die linke/rechte obere Navbar-Ecke muss sichtbar mit der weissen HUD-Flaeche verbunden werden; im roten Markierungsbereich darf keine getrennte Kante bleiben.
* [x] Navbar-Maske links/rechts ueber die eigentliche Navbar-Breite hinaus erweitert.
* [x] Inhalts-Layer ueber der erweiterten Maske gehalten, damit Klickflaechen/Layout gleich bleiben.
* [x] Bridge bewusst verstaerkt, damit die markierte linke obere Ecke geschlossen wirkt.
* [x] Playwright-Screenshot oben/gescrollt/mobile neu geprueft.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 11 Kommentar
**Eingehalten:** Eckverbindung ohne Text-/Farbstruktur-Aenderung umgesetzt, Mobile-First geprueft, Dateien unter 700 Zeilen, `npx tsc --noEmit` und `npm run build` erfolgreich.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Die Bridge ist rein visuell und veraendert die Klickbereiche nicht.
**Playwright:** `output/playwright/carcare-nav-corner-bridge-strong-top.png`, `output/playwright/carcare-nav-corner-bridge-strong-scrolled.png`, `output/playwright/carcare-nav-corner-bridge-strong-mobile-390.png`.

### Phase 12 -- Navbar-Dock als eine Flaeche
**Ziel:** User-Feedback umsetzen: Die Navbar darf nicht durch eine breite weisse Lasche getrennt wirken; die obere Navbar-Ecke muss wie bei Solidroad als ein sauber angedocktes, zusammenhaengendes Top-Dock erscheinen.
* [x] Solidroad-Referenz erneut gegen den aktuellen CarCare-Screenshot verglichen.
* [x] Zu breite `cc-nav-bridge` entfernt und durch eine exakt zentrierte Dock-Maske ersetzt.
* [x] Navbar-Shadow nur noch auf der gemeinsamen Dock-Flaeche gefuehrt, damit keine doppelten Kanten entstehen.
* [x] Desktop, Scroll-Zustand und Mobile per Playwright sowie Build/TypeScript geprueft.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 12 Kommentar
**Eingehalten:** Solidroad-Top-Dock erneut verglichen, breite Bridge als Ursache der losen weissen Lasche entfernt, Dock/Nav pixelgleich ausgerichtet, Mobile-First und Max-700-Zeilen-Regel geprueft, Port 3007 nicht neu gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Phase 11 war visuell zu aggressiv; die verbreiterte Bridge schloss zwar Flaeche, erzeugte aber eine getrennte Lasche. In Phase 12 durch eine einzelne Dock-Maske ersetzt.
**Playwright:** `output/playwright/solidroad-reference-nav-redock-top.png`, `output/playwright/solidroad-reference-nav-redock-scrolled.png`, `output/playwright/carcare-nav-dock-mask-top-3007.png`, `output/playwright/carcare-nav-dock-mask-scrolled-3007.png`, `output/playwright/carcare-nav-dock-mask-mobile-3007.png`.

### Phase 13 -- Top-HUD ohne getrennte Eck-Schatten
**Ziel:** User-Feedback umsetzen: Die oberen linken/rechten Anschlussstellen duerfen nicht wie getrennte Schatten-Layer wirken; Top-Rail, Navbar und Card-Ausschnitt sollen als eine gemeinsame HUD-Komponente erscheinen.
* [x] Globalen HUD-Frame oben wieder als echte Rail mit Shell-Gap gefuehrt.
* [x] Separate obere Schatten/Border der globalen Maske entfernt.
* [x] Navbar-Dock-Shadow auf eine reine Unterkanten-Schattierung begrenzt.
* [x] Top-Dock als eigenes `solidroad-nav-frame`-Div aufgebaut, das Rail und Navbar-Flaeche zusammen zeichnet.
* [x] Desktop/Scroll/Mobile per Playwright auf `localhost:3007`, TypeScript und Build geprueft.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 13 Kommentar
**Eingehalten:** Einteiliger Top-Dock-Layer statt separater Schatten-Layer, Solidroad bei 1244px erneut verglichen, keine Text-/Farbstruktur-Aenderung, Mobile-First und Max-700-Zeilen-Regel geprueft, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Die fruehere Dock-Maske war geometrisch korrekt, aber die separate obere HUD-Outline liess die Ecken weiterhin getrennt wirken. Durch `solidroad-nav-frame` plus top-shadowfreie HUD-Rail behoben.
**Playwright:** `output/playwright/solidroad-reference-onepiece-1244.png`, `output/playwright/carcare-nav-onepiece-top-3007.png`, `output/playwright/carcare-nav-onepiece-scrolled-3007.png`, `output/playwright/carcare-nav-onepiece-mobile-3007.png`.

### Phase 14 -- Dock-Schultern abrunden
**Ziel:** User-Feedback umsetzen: Die oberen linken/rechten Uebergaenge des einteiligen Top-Docks sollen weicher in die weisse Rail laufen und nicht eckig wirken.
* [x] Top-Schulter-Radius fuer `solidroad-nav-frame` erhoeht.
* [x] Weisse Top-Rail beibehalten, damit Navbar und Umgebung weiterhin eine Komponente bleiben.
* [x] Desktop/Scroll/Mobile per Playwright auf `localhost:3007`, TypeScript und Build geprueft.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 14 Kommentar
**Eingehalten:** Nur Radius/Geometrie angepasst, keine Inhalte/Farben/Navigation geaendert, Mobile-First geprueft, Dateien unter 700 Zeilen, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Der groessere Schulter-Radius macht die oberen Dock-Uebergaenge weicher, ohne die gemeinsame Top-Rail zu trennen.
**Playwright:** `output/playwright/carcare-nav-rounded-shoulders-top-3007.png`, `output/playwright/carcare-nav-rounded-shoulders-scrolled-3007.png`, `output/playwright/carcare-nav-rounded-shoulders-mobile-3007.png`.

### Phase 15 -- Dock-Radius umdrehen
**Ziel:** User-Feedback umsetzen: Der Radius darf oben links/rechts nicht als ausgeschnittene Aussenrundung trennen; die Navbar soll oben gerade an der Rail sitzen und die weiche Rundung nur unten/seitlich als zusammenhaengender Dock-Uebergang erscheinen.
* [x] Oberen Schulter-Radius wieder entfernt.
* [x] Unteren Dock-Radius und Schattenkante weicher abgestimmt.
* [x] Desktop/Scroll/Mobile per Playwright auf `localhost:3007`, TypeScript und Build geprueft.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 15 Kommentar
**Eingehalten:** Radius-Logik umgedreht, Top-Rail bleibt gerade verbunden, weicher Uebergang liegt unten/seitlich, keine Inhalte/Farben/Navigation geaendert, Mobile-First geprueft, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Der vorige Top-Schulter-Radius erzeugte sichtbare Aussparungen; durch obere Radiuswerte `0` und groesseren unteren Dock-Radius behoben.
**Playwright:** `output/playwright/carcare-nav-inverted-radius-top-3007.png`, `output/playwright/carcare-nav-inverted-radius-scrolled-3007.png`, `output/playwright/carcare-nav-inverted-radius-mobile-3007.png`.

### Phase 16 -- Solidroad-Zielgeometrie exakt vergleichen
**Ziel:** User-Feedback umsetzen: Die lokalen Screenshots muessen direkt gegen Solidroad Screenshot 2 verglichen werden; die Navbar soll im Card-Inset sitzen und links/rechts weiterhin Bild zeigen, statt eine falsche volle Top-Rail zu erzeugen.
* [x] Solidroad und CarCare bei gleicher Viewport-Breite per Playwright gemessen.
* [x] Vollbreite Top-Rail am Navbar-Frame entfernt, weil Solidroad nur die Canvas-/Card-Maske nutzt.
* [x] Navbar-Frame und Navbar-Inhalt auf dieselbe Zielgeometrie gesetzt: `x=183`, `y=0`, `w=1000`, `h=100`, Radius `0 0 24px 24px`, Shadow `none`.
* [x] Desktop/Scroll/Mobile per Playwright auf `localhost:3007`, TypeScript und Build geprueft.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 16 Kommentar
**Eingehalten:** Ziel-Screenshot Solidroad bei gleicher Breite verglichen, Messwerte statt Bauchgefuehl verwendet, Frame und Nav auf identische Geometrie gebracht, keine Texte/Farben/Inhaltsstruktur geaendert, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Vorherige lokale Screenshots waren ohne Zielvergleich irrefuehrend; der echte Unterschied war Radius/Shadow/Extra-Rail, nicht die Position.
**Playwright:** `output/playwright/solidroad-target-1365-top.png`, `output/playwright/carcare-solidroad-matched-final-1365-top.png`, `output/playwright/carcare-solidroad-matched-1365-scrolled.png`, `output/playwright/carcare-solidroad-matched-mobile-3007.png`.

### Phase 17 -- Bildbereiche neben Navbar freilegen
**Ziel:** User-Feedback umsetzen: Oben links/rechts neben der Navbar darf keine helle HUD-/Gradient-Flaeche dominieren; wie bei Solidroad soll dort das Hero-Bild bis an die Navbar-Kante sichtbar bleiben.
* [x] Solidroad-Zielbild und aktuellen CarCare-Screenshot an den markierten Ecken verglichen.
* [x] Hero-Top-Maske so angepasst, dass links/rechts neben der Navbar mehr Bild sichtbar bleibt.
* [x] Navbar-Geometrie aus Phase 16 beibehalten.
* [x] Desktop/Scroll/Mobile per Playwright auf `localhost:3007`, TypeScript und Build geprueft.
**Referenzen:**
`components/HeroSection.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 17 Kommentar
**Eingehalten:** Ziel-Screenshot direkt daneben geprueft, markierte Top-Ecken durch Bildfreilegung korrigiert, Navbar-Position/Radius/Shadow aus Phase 16 beibehalten, Mobile-First geprueft, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Die helle Lesemaske war oben zu dominant; sie startet jetzt erst unterhalb der Navbar-Zone und erhaelt die Textlesbarkeit im Hero.
**Playwright:** `output/playwright/solidroad-target-1365-top.png`, `output/playwright/carcare-hero-reveal-1648-top.png`, `output/playwright/carcare-hero-reveal-1365-top.png`, `output/playwright/carcare-hero-reveal-1365-scrolled.png`, `output/playwright/carcare-hero-reveal-mobile-3007.png`.

### Phase 18 -- Extra-HUD-Maske entfernen
**Ziel:** User-Feedback umsetzen: Der Topbereich soll direkt aus Hero-Card und Navbar bestehen wie bei Solidroad; ein zusaetzlicher Full-Viewport-HUD-Layer darf keine hellen Nebenflaechen oder falschen Eckmasken erzeugen.
* [x] Full-Viewport-HUD-Pseudo-Masken am Header entfernen.
* [x] Header nur noch als kompakter fixed Navbar-Layer fuehren.
* [x] Bestehende Main-/Footer-Shells beibehalten, damit der globale Card-Rahmen nicht verloren geht.
* [x] Desktop/Scroll/Mobile direkt gegen Solidroad per Playwright pruefen.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 18 Kommentar
**Eingehalten:** Extra-HUD-Masken entfernt, Navbar-Frame auf Solidroad-Geometrie belassen, Main-/Footer-Shell nicht zurueckgebaut, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Das Entfernen der Full-Viewport-Maske machte die Top-Geometrie ruhiger, liess aber im Scroll-Zustand die weisse Top-Rail noch nicht am Header haengen.
**Playwright:** `output/playwright/phase18-solidroad-1365-top.png`, `output/playwright/phase18-carcare-1365-top.png`, `output/playwright/phase18-carcare-1365-scrolled.png`.

### Phase 19 -- Topbild und Lesemaske beruhigen
**Ziel:** User-Feedback umsetzen: Nach dem direkten Referenzvergleich sollen die markierten Top-Ecken nicht durch einen dunklen Bildblock oder eine harte horizontale Weiss-Fade-Linie falsch wirken; Bild bleibt oben sichtbar, Lesemaske greift erst tiefer im Hero.
* [x] Dunkle Top-Abdunklung im Hero entfernen.
* [x] Lesemaske weiter nach unten und weicher auslaufen lassen.
* [x] Navbar-Geometrie aus Phase 16/18 unveraendert beibehalten.
* [x] Desktop/Scroll/Mobile direkt gegen Solidroad per Playwright pruefen.
**Referenzen:**
`components/HeroSection.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 19 Kommentar
**Eingehalten:** Top-Abdunklung reduziert, Lesemaske tiefer gefuehrt, Navbar-Geometrie unveraendert gelassen, Playwright-Screenshots fuer Top/Scroll/Mobile erzeugt.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Die Bild-/Overlay-Anpassung verbesserte die Top-Zone, loeste aber nicht die eigentliche Layer-Ursache der hero-gebundenen weissen Linie.
**Playwright:** `output/playwright/phase19-carcare-1365-top.png`, `output/playwright/phase19-carcare-1365-scrolled.png`, `output/playwright/phase19-carcare-mobile-3007.png`.

### Phase 20 -- Hero-Crop als falschen Hebel verwerfen
**Ziel:** User-Feedback einordnen: Der Hero-Crop sollte nicht weiter verfolgt werden, weil die spaeter geklaerte Ursache die an der Hero-Sektion haengende weisse Linie war.
* [x] Crop-Ansatz nach User-Klarstellung gestoppt.
* [x] Keine Produktiv-Aenderung am Bildausschnitt eingebaut.
* [x] Navbar-Frame unveraendert auf Solidroad-Zielgeometrie gelassen.
* [x] Naechste Phase auf Header-gebundene Rail ausgerichtet.
**Referenzen:**
`components/HeroSection.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 20 Kommentar
**Eingehalten:** Die Analyse wurde nicht als Code-Aenderung fortgefuehrt; Ursache wurde auf Header-/Hero-Layering eingegrenzt.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: Der Crop haette nur Farb-/Motivunterschiede kaschiert und die hero-gebundene Top-Linie nicht strukturell geloest.

### Phase 21 -- Top-Rail an Header binden
**Ziel:** User-Feedback umsetzen: Die weisse obere Linie/Umrandung darf nicht an der Hero-Sektion haengen, sondern muss vom fixed Header-HUD gezeichnet werden, damit Navbar und Top-Card-Ecken wie eine gemeinsame Komponente wirken.
* [x] Header-HUD um eine feste obere Rail mit Seitenkanten erweitert.
* [x] Hero-gebundene Top-Linie durch Header-Rail ueberzeichnet, damit sie beim Scrollen erhalten bleibt.
* [x] Navbar-Dock innerhalb der Header-Rail ohne getrennten Eckschatten gefuehrt.
* [x] Solidroad-Referenz und CarCare per Playwright oben/scrolled/mobile verglichen.
**Referenzen:**
`components/Navbar.tsx`
`components/HeroSection.tsx`
`index.css`

### Phase 21 Kommentar
**Eingehalten:** `solidroad-header-rail` als eigener fixed Header-Layer eingefuegt, Top- und Seitenrail liegen jetzt oberhalb der Seite statt nur in der Hero-Card, Navbar-Dock bleibt auf der live gemessenen Solidroad-Geometrie `x=183`, `y=0`, `w=1000`, `h=100`, Radius `0 0 24px 24px`, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Die Rail ist pointer-event-frei und bleibt hinter Nav-Content, aber ueber dem scrollenden Main-Inhalt.
**Playwright:** `output/playwright/phase21-solidroad-1365-top.png`, `output/playwright/phase21-carcare-1365-top.png`, `output/playwright/phase21-carcare-1365-scrolled.png`, `output/playwright/phase21-carcare-mobile-3007.png`.

### Phase 22 -- Innere Header-Ecken abrunden
**Ziel:** User-Feedback umsetzen: Die inneren oberen Uebergaenge links und rechts der Navbar sollen wie bei Solidroad weich gerundet sein und nicht als eckiger Anschluss zwischen Header-Rail und Nav-Dock wirken.
* [x] Innere Corner-Caps direkt am Header/Nav-Layer ergaenzen.
* [x] Nav-Dock-Geometrie und Inhalte unveraendert lassen.
* [x] Desktop/Scroll/Mobile per Playwright vergleichen.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 22 Kommentar
**Eingehalten:** Separaten Corner-Cap-Ansatz verworfen, innere Rundung am eigentlichen `solidroad-nav-frame` und `solidroad-nav-shell` umgesetzt, Navbar-Inhalte nicht veraendert, Mobile-First geprueft, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Die separaten Caps erzeugten sichtbare weisse Zusatzsicheln; korrigiert wurde auf eine echte Frame-Rundung mit `28px 28px 24px 24px`.
**Playwright:** `output/playwright/phase22-carcare-1365-top.png`, `output/playwright/phase22-carcare-left-inner-corner.png`, `output/playwright/phase22-carcare-right-inner-corner.png`, `output/playwright/phase22-carcare-1365-scrolled.png`.

### Phase 23 -- Innenausschnitt statt Pillen-Ecke
**Ziel:** User-Feedback umsetzen: Die sichtbare 90-Grad-Ecke am rechten Rand des linken Bildausschnitts soll als innere Ausschnitt-Rundung wirken, nicht als oben gerundete Navbar-Pille.
* [x] Oberen Pillenradius am Nav-Frame zuruecknehmen.
* [x] Innenausschnitt ueber Header-Rail/Frame-Maske weich fuehren.
* [x] Desktop/Scroll/Footer-Zustand per Playwright pruefen.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 23 Kommentar
**Eingehalten:** Nav-Frame wieder mit gerader Oberkante gefuehrt, inverse `solidroad-nav-cutouts` als fixed Header-Layer ergaenzt, linke/rechte Innenausschnitte bleiben auch ueber Footer-/Dark-Sections an der Navbar, Inhalte unveraendert, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Der vorherige Top-Radius machte eine Pillen-Ecke; die Cutout-Maske erzeugt stattdessen die gewuenschte innere Rundung am angrenzenden Bild-/Section-Ausschnitt.
**Playwright:** `output/playwright/phase23-carcare-1365-top.png`, `output/playwright/phase23-carcare-left-inner-corner.png`, `output/playwright/phase23-carcare-1365-scrolled.png`, `output/playwright/phase23-carcare-footer-target-scrolled.png`.

### Phase 24 -- Footer-Scroll-Rundung an Navbar fixieren
**Ziel:** User-Feedback umsetzen: Im Footer-/Dark-Section-Zustand sollen die linken und rechten Rundungen weiterhin wie oben an der fixed Navbar haengen und nicht als harte dunkle Ecken neben der Navbar stehen.
* [x] Footer-Scroll-Zustand gezielt im In-App-Browser aufnehmen.
* [x] Header-Cutout-Geometrie fuer dunkle Sektionen korrigieren.
* [x] Desktop/Footer-Scroll per Browser und Build pruefen.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 24 Kommentar
**Eingehalten:** Echten In-App-Browser-Footer-Zustand geprueft, `solidroad-nav-cutouts` im Scroll-Zustand auf dieselbe sichtbare Y-Kante wie der Footer gelegt, Navbar/Buttons/Inhalte unveraendert, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Der Cutout sass zuvor bei `y=12`, waehrend der Footer bei `y=26` begann; die Scroll-Klasse setzt ihn nun auf `top: calc(var(--cc-shell-gap) + 14px)`.
**Playwright/Browser:** In-App-Browser-Screenshot im Footer-Zustand, `output/playwright/phase24-top-left-corner-after-lower-cutout.png` als verworfener Zwischenstand.

### Phase 25 -- Cutout nur im Footer verschieben
**Ziel:** User-Feedback umsetzen: Beim normalen Runterscrollen soll die obere linke Rundung nicht verschwinden; die tiefere Cutout-Position darf nur aktiv werden, wenn der Footer wirklich unter der Navbar sichtbar ist.
* [x] Footer-Sichtbarkeit im Navbar-State erfassen.
* [x] Cutout-Klasse von generischem Scroll auf Footer-Zustand umstellen.
* [x] Hero-Scroll und Footer-Scroll per Playwright pruefen.
**Referenzen:**
`components/Navbar.tsx`
`index.css`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 26 -- Fixed Shell-Aussenecken beim Scroll
**Ziel:** User-Feedback umsetzen: Die aeussere obere linke/rechte Shell-Rundung darf beim Scrollen nicht spitz werden, weil die echte Main-Rundung aus dem Viewport verschwindet; der fixed Header muss diese Aussenecken selbst maskieren.
* [x] Header-Rail um feste Top-Corner-Masken links/rechts erweitert.
* [x] Normales Hero-Scrollbild und Footer-Zustand per Playwright geprueft.
* [x] TypeScript/Build und Zeilenlimit validiert.
**Referenzen:**
`index.css`
`components/Navbar.tsx`
`docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`

### Phase 25 Kommentar
**Eingehalten:** Cutout-Scrollklasse ist nicht mehr an jeden Scrollzustand gekoppelt, sondern nur an den sichtbaren Footer-Zustand; Hero-Scroll bleibt bei `y=12`, Footer-Endzustand setzt `is-footer` bei `y=26`, Dev-Server nicht gestartet.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Keine neuen Fehler. Die Ursache fuer die weiter sichtbare spitze Ecke lag danach nicht mehr am Footer-Cutout, sondern an der beim Scrollen verschwundenen Main-Aussenrundung.
**Playwright:** `output/playwright/phase25-top.png`, `output/playwright/phase25-hero-scroll.png`, `output/playwright/phase25-footer-scroll.png`.

### Phase 26 Kommentar
**Eingehalten:** Header-Rail zeichnet die aeusseren Shell-Ecken nun selbst mit festen radialen Masken, keine Text-/Farb-/Navigationsaenderung, Mobile-/Desktop-Dateien unter 700 Zeilen, `npx tsc --noEmit` und `npm run build` erfolgreich.
**Auffaelligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**
1. Niedrig: `npm run build` meldet weiterhin die bestehende Vite-Warnung fuer einen Chunk knapp ueber 500 kB; kein neuer Fehler aus dieser Aenderung.
**Playwright:** `output/playwright/phase26-hero-scroll-left-corner.png`, `output/playwright/phase26-hero-scroll.png`, `output/playwright/phase26-footer-end.png`.
