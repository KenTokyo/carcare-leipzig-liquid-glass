# Messwerkzeuge – was sie prüfen

> Kurzliste und Pflichten: `CLAUDE.md` → „Messwerkzeuge“. Hier die Einzelheiten je Werkzeug.

## Gemeinsam

- Alle brauchen aktuelles `dist/` (`npm run build`), starten `vite preview` selbst; **nie** `npm run dev` dafür
- Beim Start nennen sie den gemessenen Build (`[dist] Build vom …`) und brechen ab, wenn eine getrackte Quelldatei neuer ist als `dist/` (`scripts/lib/dist-stand.mjs`; alten Stand absichtlich messen: `CC_ALTEN_STAND_MESSEN=1`)
- Ergebnisse in der Doku mit diesem Build belegen; nach jeder Korrektur **alle** Werkzeuge gegen den neuen Build, nicht nur das mit dem Befund
- `-- --gegenprobe` spielt bekannte Fehler ein und verlangt jede Meldung (wo vorhanden)
- Lagen nach jedem Bild lesen, nicht im eigenen rAF-Rückruf (`scripts/lib/bahn.mjs`; sonst Scheinsprünge, weil Lenis sich erst beim Gleiten anmeldet)
- Git Bash: Routenargumente mit `MSYS_NO_PATHCONV=1`

## `npm run kontrast`

- WCAG-AA-Kontrast im ausgelieferten HTML je Route/Breite/Textstelle; Standardfenster 1440 × 900 und 390 × 844
- `-- / --sektionen`: zusätzlich jeder Sektionskopf und jeder Schritt der gepinnten Abläufe (die vier festen Stellen treffen mobile Fotoflächen nicht sicher)
- `-- / --fenster=375x548,375x629`: misst diese Fenster statt der Standardfenster (Hero steht unter 640 px Höhe anders; dort sieht nur dieser Lauf Unterschreitungen)
- Sechs Fallen des Aufbaus im Kopf von `scripts/check-kontrast.mjs` – vor Änderungen lesen
- Wann: nach jeder Farb-, Verlaufs- oder Transparenzänderung

## `npm run akkordeon`

- Bildkarten-Akkordeons mobil (Startseite ×2, /karriere: Stellen + Mitarbeiterstimmen; Karten an `data-akk-offen`), echter Tipp, CPU 4×
- **Layout pro Bild:** hart, wenn 150–650 ms nach dem Klick ≥ 80 % der Hauptthread-Bilder ein Layout rechnen und ≥ 3 späte Layouts; normal 0–50 % bei ≤ 2 späten Layouts, Höhen-Animation 60–117 %
  - gezählt über `BeginMainThreadFrame`, nicht rAF-Rückrufe (Lenis steht im Leerlauf, beim Mitgleiten bis zu sechs je Bild)
  - unter Last teils nur 1 spätes Bild → Gegenprobe kann sie übersehen (offen als O12 in `docs/mobil-akkordeon-faq/tasks/`)
- Prüft außerdem: Animationen abseits des Compositors; Ruhelage nach Tipp und Unterbrechung
- **Getippte Karte gleitet ohne Sprung in die Mitte des freien Bereichs** (zwischen Navbar und Knopfleiste, beide `data-feste-leiste`)
- **Kein Schatten außerhalb der sichtbaren Karte** („weißes Rechteck“), **keine Tipp-Hervorhebung**
- **Bildlage der Stimmen im Streifen:** Foto bedeckt den Streifen; Augenlinie und Gesichtsmitte ≤ 1,5 px neben der Soll-Lage aus `data/stimmen.ts` (graue Ränder sieht nur dieser Pixelvergleich)
- **Maus im schmalen Fenster** (`scripts/lib/akkordeon-maus.mjs`; 900 × 800 und 393 × 851, Ausgangslage nach dem Einblenden): Darüberfahren und Klick klappen auf und gleiten mittig wie ein Tipp; **keine Kette** in Ruhe, auf dem Weg über die Streifen und beim Mausrad; danach öffnet Darüberfahren wieder; zweiter Klick auf angeschnittene offene Stimme holt sie mittig
- **Nach dem Drehen** (820 × 1180 → 1180 × 820 → zurück, ohne Neuladen): jede Karte sichtbar breit, offene am breitesten, zurück wieder senkrecht
- Hauptthread-Zeit je Bild als Hinweis
- Ausgewertet nur ab Spurstart und ab der Marke, die der Klick auf die Zielkarte setzt; ohne Marke **Messfehler (Exit 2)** statt Urteil
- `-- --gegenprobe`: Höhen-Animation, Hervorhebung, Fensterschatten, abgeschaltetes Scrollen, Maus „ohne Gleiten“, alte Kette (O8) je Ziel, Stimmen Bildmitte + Fotokasten, Desktop `flex-grow: 0`
- `-- /karriere` nur diese Route; `-- --protokoll` Zustand je Schritt, Spuren nach `output/akkordeon/`
- Wann: nach jeder Änderung an `ExpandingCardAccordion`, `Stimmen.tsx`, `akkordeonMobil.ts`, `akkordeonKarten.tsx`, `lib/freierBereich.ts`, Fotos in `data/stimmen.ts`, Lenis (`useSmoothScroll`)

## `npm run leerlauf`

- **Leerlauf jeder Route** (Smartphone 393 × 851 Touch, Desktop 1920 × 945; oben + Seitenmitte): ≤ 10 Hauptthread-Bilder in 1,5 s ohne Eingabe; bei Befund Quelle jedes rAF-Rückrufs (Datei, Zeile, Code aus `dist/`)
- **Gleiten** bei Mausrad (Desktop, /), Anker-Tipp (Smartphone, /karriere), App-Navigation (/karriere → /#leistungen): Lenis gleitet (`lenis-smooth`), ≥ 8 Zwischenlagen, kein Schritt über 35 % des Wegs, Ankunft, danach Leerlauf; erster Schritt ≤ 1,5 × Dauerschleifen-Referenz
- `-- --gegenprobe`: rAF-Dauerschleife + springende Uhr; `-- /route` nur Leerlauf dieser Route(n)
- Wann: nach Änderungen an `hooks/useSmoothScroll.ts`, Lenis-Optionen, Komponenten mit eigener rAF-Schleife oder Daueranimation

## `npm run faq-mobil`

- FAQ auf **jeder** Route mit FAQ (überall dasselbe Akkordeon `FaqListe`): Frage als Knopf in `h3`, Antwort mit Text im DOM (geschlossen `inert` + `aria-hidden`), am Start nur Frage 1 offen
- Echter Tipp bei 45 % und 85 % der Fensterhöhe: **Nachbarn bleiben** (kein Auto-Schließen), **kein Sprung**, danach **Frage samt Antwort ganz im freien Bereich**
- Seite mit `FAQPage`-Markup ohne Akkordeon = Befund
- `-- --gegenprobe`: Auto-Schließen und abgeschaltetes Nachscrollen getrennt; `-- /route` nur diese Route
- Wann: nach Änderungen an `FaqListe`, `FAQSection`, `PageFAQ`, `styles/faq.css`, `lib/freierBereich.ts`, festen Leisten

## `npm run nav`

- Desktop-Mega-Menü: Hover, dritte Ebene je Karte gegen getippte Erwartungsliste, jede Leistung aus `data/services.ts` erreichbar, Tastatur (Fokus, Tab ins Panel, Escape)
- Mobiles Menü mit Unterebene ohne Geste
- **Mobiles Menü scrollt** je Fenster (393 × 659, auch mit 20 px Grundschrift, 360 × 560, 390 × 844 Touch; 393 × 659 und 1024 × 700 Maus): Hauptpunkte in Desktop-Reihenfolge samt „Karriere“; Menü endet über der Knopfleiste (`data-feste-leiste="unten"`); Finger, Mausrad, Trackpad scrollen bis zum letzten Link (sichtbar, treffbar); **Seite dahinter bleibt**, auch bei Rad/Wischen neben dem Menü; nach dem Schließen frei
- **Logo** in sieben Lagen (Startseite unten, mit Anker, mit offenem Menü, Unterseiten, Desktop): `/`, Seite oben, Menü zu, Seite frei
- `-- --basis <url>` misst einen anderen Stand (Bilder `output/nav-shots-basis/`, sonst `output/nav-shots/`)
- Wann: nach Änderungen an `Navbar`, `NavMegaMenu`, `data/navigation.ts`, `data/services.ts`, Höhe der Knopfleiste (`MobileStickyCTA`), Lenis

## `npm run meta`

- Title 50–60, Description 140–160 Zeichen; nach jeder Meta-Änderung

## `npm run shots`

- Bildschirmfotos je Sektionsgrenze, Desktop + mobil (Touch), **Kontaktbogen** `output/shots/kontaktbogen.html`; vor jedem Kunden-Review

## `npm run zielgruppen`

- Zielgruppenkarten der Startseite über 15 reale Fenstergrößen: Partner sichtbar (Treffertest), Mausrad erreicht Liste und Kartentext (echtes Rad), Scrollweg bis zur Überdeckung
- Wann: nach Änderungen an `TargetGroupCards`, `ZielgruppenPartner`, `styles/zielgruppen.css`, Lenis

## `npm run aussparung`

- Aktions-Aussparung oben rechts (Pillen „Aufbereitung anfragen“ + „Schaden melden“, ab 1024 px): liegt Text oder Bedienelement **dauerhaft** darunter?
- 29 Routen × 3 Fenster, Sichtbarkeit 100 % + Pixelprobe je Pille
- **Geometrie an 23 Breiten:** Lücke zum Navbar-Reiter ≥ 20 px, Beschriftungen vollständig, Navbar-Links ≥ 12 px im Reiter, sichtbarer Text in der Ansage
- Wann: nach Änderungen an gepinnten Flächen (`position: sticky`), `AktionsAussparung`, Navbar-Höhe, Reiterbreite/Link-Abständen (`--cc-nav-*` in `styles/aussparung.css`)

## `npm run mobil`

- Jede Route bei 360/390/430 px: waagerechter Überlauf, **abgeschnittene Texte** (echte Textzeilen gegen `overflow`-Vorfahren), Trefferflächen < 24 px (WCAG 2.5.8 samt Ausnahmen), **Fußzeile** unsichtbar/unerreichbar/verdeckt
- **Einblendungen** ohne Zutun (`role="dialog"`, z. B. Stellen-Pop-up) über 30 % der Fensterhöhe oder ohne wirksamen Schließknopf
- **Erster Bildschirm:** `data-erster-bildschirm` (Vertrauensleiste im Hero) steht beim Laden ganz und unverdeckt im Fenster oder beginnt ≤ 120 px darunter, nie angeschnitten; Fenster 393 × 659, 393 × 739, 375 × 667, 375 × 629, 375 × 600, 360 × 560, 375 × 548 (Tabelle je Fenster im Bericht)
- Hinweis: Schrift unter 12 px
- Bewusster Anschnitt: `data-mobil-anschnitt="Begründung"` am Behälter
- `-- --gegenprobe` (zehn Fehler); Bericht `output/mobil/bericht.md` (Gegenprobe `gegenprobe.md`)
- Wann: nach Änderungen an Layout, Schriftgrößen, Überschriften, Fußzeile; vor jedem Mobile-Review

## `npm run cls`

- **Layout-Sprünge beim Laden** (CLS, Grenze 0,1) je Route bei 360 × 640, 390 × 844, 1024 × 700, 1366 × 657; CPU-Drosselung 4× wie Lighthouse mobil, drei Tabs parallel
- Hart ab 0,1, wenn eine Einzelmessung es bestätigt (sonst Hinweis „nur unter Last“), mit Verursacher (Element, Text)
- Ohne Drossel bleiben Timing-Fehler unsichtbar
- `-- --gegenprobe`; Bericht `output/cls/bericht.md`
- Wann: nach Änderungen an Komponenten, die nach dem ersten Bild messen oder umschalten (Fußzeile, Pop-ups, Portale), an `scripts/prerender.mjs`; vor jedem Livegang

## `npm run zeichnen`

- **Zeichenlücken:** Stellen, an denen der Browser Seiteninhalt nicht zeichnet (sieht kein anderes Werkzeug)
- Seitengrund + Fußzeile magenta, Grund von `main` türkis; jede Route in 1440 × 790 Retina, 1920 × 945, 1024 × 700 Retina, 390 × 844 durchscrollen; Aufnahme aus dem Compositor; Lücke ab 0,5 % der Fläche
- **Ebenenbaum** je Position: **Masken in Seitengröße** (gleich große Ebenen höher als drei Fenster ohne eigenen Grund = runder Beschnitt auf Glas-/Video-/`will-change`-Ebenen); hart ab 4, Hinweis ab 2; Soll 0; Ursache rechnerunabhängig
- **Eichung** vorab mit eingespieltem Altfehler; zeigt der Rechner ihn nicht als Lücke → kein Urteil (**Exit 2**); Seite ohne `main` (z. B. Vercel-Sicherheitsprüfung bei `--url`) ebenfalls Exit 2
- `-- --gegenprobe`, `-- --url <deployment>`, `-- --sichtbar` (echtes Fenster, echte Grafikkarte), `-- --protokoll` (Aufnahme jeder Position); Bericht `output/zeichnen/bericht.md`
- Wann: nach Änderungen an Glas (`backdrop-filter`, `.cc-liquid`), `will-change`, Videos, runden Ecken mit `overflow` an großen Behältern, `Layout`/`.site-main-shell`; vor jedem Livegang

## `npm run nummern`

- Backlog-Nummern gegen die Kundenräume; läuft im `prebuild`

## `npm run weiterleitungen`

- 301-Weiterleitungen der **alten** Website: jedes Ziel eine Route, keine Quelle eine Route, keine Ketten; jede Adresse des Altseiten-Inventars (`docs/weiterleitungen-altseite/altseite-inventar.json`) hat Regel, Datei oder begründete Ausnahme; `vercel.json` und Übergabe für Apache/nginx synchron
- `-- --gegenprobe` (10 Fehler); `-- --live [url]` prüft am Deployment jede alte Adresse auf 301 + Ziel
- Liste `scripts/lib/weiterleitungen.mjs`, danach `npm run vercel-config`; Inventar neu: `npm run altseite` (nur solange die Altseite läuft)
- Wann: im `prebuild`; `--live` nach Deploy und nach DNS-Umstellung (gegen `https://www.carcare-center.de`)

## `npm run tote-dateien`

- Quelldateien ohne Weg von einem Einstieg (Importgraph über TS-Compiler, auch transitive Waisen); „BEWUSST GEPARKT“ im Kopf = genannt, nicht gezählt (`components/Jobs.tsx`); braucht **kein** `dist/`
- Wann: bevor eine Komponente als ungenutzt gilt oder gelöscht wird; nach Umbauten, die Sektionen ersetzen

## `npm run gedankenstriche`

- Gedankenstriche im ausgelieferten Text, in Titeln und Beschreibungen (Textregel 6), mit Umfeld je Fund; Wächter im `postbuild`, von Hand nach Textänderungen

## `npm run bilder`

- Jede Bildstelle mit **fester Nummer B<n>**, Ort (Seite › Sektion › Karte), Datei, Git-Datum; je Datei alle Stellen; Platzhalter; Gegenprobe gegen Ordner und Code
- Schreibt `docs/bilder/README.md` + Kontaktbogen `output/bilder/bilder-uebersicht.html`
- Wann: nach jedem Bildtausch und bevor Bildwünsche des Kunden umgesetzt werden

## `npm run lektorat`

- Text jeder Route **wie der Besucher ihn sieht** (Akkordeons + FAQ offen, Desktop + mobil, Bildtexte, Vorlesetexte, Formularfelder, Title/Description, JSON-LD) + globale Bausteine, Formulare, Suche
- Mechanische Vorprüfung gegen Duden 2024, Stilblatt, Textregeln (K/H)
- Schreibt `output/lektorat/auszuege/*.md` + `uebersicht.md` (Wörter gegen Suchindex)
- Routen einzeln `npm run lektorat -- karriere start`; nur global `-- --global`
- Wann: bei jeder Textänderung und fürs Lektorat (`docs/lektorat/`)
