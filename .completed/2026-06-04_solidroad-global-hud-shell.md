---
title: Solidroad Global HUD Shell Nachbesserung
description: Globalen Card-/Aperture-Effekt und fluidere Navbar-Anbindung nach Solidroad-Referenz umgesetzt.
date: 2026-06-04
status: success
effort: M
files:
  - App.tsx
  - components/Navbar.tsx
  - components/HeroSection.tsx
  - components/Footer.tsx
  - index.css
  - docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md
tags: [feature, ui, docs, playwright]
---

## Zusammenfassung
Der Solidroad-Effekt wurde von einer Hero-/Navbar-Anpassung zu einer globalen HUD-Shell erweitert. Root/Main/Footer nutzen nun einen hellen Canvas mit gerundeter Card-Wirkung, der Footer bleibt als inset/rounded Reveal-Karte sichtbar, und die Navbar ist als top-flush fixed HUD-Ausschnitt statt separater Box gestaltet. Farben, Texte und Inhaltsstruktur blieben unveraendert.

## Nachbesserung
Die Navbar-Raender wurden zusaetzlich nachgezogen: linke/rechte Kante und Unterkante nutzen nun eine sichtbare, aber subtile Border in derselben Linienfamilie wie der globale Frame. Ein Connector-Ansatz mit separaten Kurven wurde verworfen, weil er nicht zusammenhaengend genug wirkte.

## Top-Dock-Korrektur
Die Navbar wurde anschliessend von einer separaten Border-/Floating-Card auf eine Solidroad-naehere Top-Dock-Form umgestellt. Die weisse Flaeche verbindet sich per Pseudo-Element nach oben mit dem Canvas; sichtbar bleibt nur die subtile untere Rundung/Kante.

## Dock-Masken-Korrektur
Die breite Eck-Bridge wurde wieder entfernt, weil sie wie eine getrennte weisse Lasche neben der Navbar wirkte. Stattdessen liegt jetzt eine einzelne, exakt zentrierte Dock-Maske hinter der Navbar; Dock und Navbar teilen dieselbe Breite, Hoehe, untere Rundung und denselben Shadow.

## Einteiliger Top-Dock
Die Dock-Maske wurde danach zu einem echten `solidroad-nav-frame`-Div erweitert: Dieses Div zeichnet die obere weisse Rail und die Navbar-Flaeche zusammen. Die globale HUD-Outline hat oben keinen eigenen Schatten/Border mehr; der Schatten liegt nur noch unten an der Dock-Kante.

## Abgerundete Dock-Schultern
Die oberen linken/rechten Uebergaenge des Top-Docks wurden staerker gerundet. Dadurch laeuft die Navbar-Flaeche weicher in die weisse Top-Rail und wirkt weniger wie ein eckiger Absatz.

## Radius-Umkehr
Der Schulter-Radius wurde wieder umgedreht: oben bleibt der Top-Dock gerade und verbunden, damit keine ausgeschnittenen Trenn-Ecken entstehen. Die weichere Rundung sitzt nun unten/seitlich am Dock und fuehrt die Navbar in die Card-Flaeche.

## Solidroad-Zielabgleich
Die Navbar wurde anschliessend bei gleicher Viewport-Breite direkt gegen Solidroad gemessen. Solidroad nutzt fuer die Nav-Box `x=183`, `y=0`, `w=1000`, `h=100`, Radius `0 0 24px 24px` und keinen eigenen Shadow. CarCare nutzt jetzt dieselbe sichtbare Frame-/Nav-Geometrie; die vorherige Extra-Rail und der abweichende `35.2px`-Radius wurden entfernt.

## Bildfreilegung neben Navbar
Der Hero-Overlay wurde oben maskiert, damit links und rechts neben der Navbar wieder Bildflaeche sichtbar bleibt wie im Solidroad-Ziel. Die weisse Lesemaske beginnt nun erst unterhalb der Navbar-Zone und erhaelt die Lesbarkeit des Hero-Texts.

## Header-gebundene Top-Rail
Die weisse obere Linie wurde aus dem reinen Hero-/Main-Kontext geloest und als `solidroad-header-rail` in den fixed Header gelegt. Dadurch bleiben Top-Rail und Seitenkanten beim Scrollen ueber dem Inhalt stehen, waehrend die Navbar weiterhin als ein Dock mit Solidroad-Geometrie darin sitzt. Der verworfene Hero-Crop-Ansatz wurde nicht als Produktiv-Code uebernommen.

## Innere Header-Ecken
Die nachtraeglichen Corner-Caps und der obere Pillenradius wurden verworfen, weil sie als weisse Zusatzsicheln bzw. falsche Navbar-Pillen-Ecken sichtbar wurden. Die finale Variante nutzt `solidroad-nav-cutouts` als fixed Header-Layer: Der Nav-Frame bleibt oben gerade, waehrend die angrenzenden linken/rechten Ausschnitte auch im Scroll- und Footer-Zustand weich nach innen gerundet werden.

## Footer-Scroll-Nachbesserung
Im echten In-App-Browser-Footer-Zustand begann der dunkle Footer bei `y=26`, der Cutout sass aber noch bei `y=12`. Die Cutout-Ebene bekommt nun im Scroll-Zustand dieselbe sichtbare Y-Kante wie der Footer, damit die Rundung unten im Footer genauso an der Navbar haengt wie oben im Hero.

## Scroll-Corner-Fix
Die Cutout-Absenkung wurde von generischem Scroll auf echte Footer-Sichtbarkeit umgestellt, damit die innere Navbar-Rundung beim normalen Hero-Scroll nicht verschwindet. Zusaetzlich zeichnet die fixed `solidroad-header-rail` die aeusseren Top-Shell-Ecken links/rechts nun selbst per radialer Maske; dadurch bleibt die obere linke Aussenrundung auch dann rund, wenn die echte Main-Rundung bereits aus dem Viewport gescrollt ist.

## Validierung
`npx tsc --noEmit` und `npm run build` waren erfolgreich. Playwright CLI verglich Solidroad live sowie CarCare Top-, Scroll- und Mobile-Zustaende auf dem bereits laufenden `localhost:3007`. Der finale Zielvergleich nutzt `phase21-solidroad-1365-top.png`, `phase21-carcare-1365-top.png`, `phase21-carcare-1365-scrolled.png` und `phase21-carcare-mobile-3007.png`; Frame und Navbar messen beide `x=183`, `y=0`, `w=1000`, `h=100`, Radius `0 0 24px 24px`, Shadow `none`, die Header-Rail misst desktop `x=0`, `y=0`, `w=1365`, `h=100`. Fuer den aktuellen Scroll-Corner-Fix wurden `phase26-hero-scroll-left-corner.png`, `phase26-hero-scroll.png` und `phase26-footer-end.png` erzeugt; Hero-Scroll bleibt bei Cutout `y=12`, Footer-Endzustand bei Cutout `y=26` mit `is-footer`.
