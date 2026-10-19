# CLAUDE.md

> Führende Regel- und Konfigurationsdatei für Claude Code in diesem Projekt.
> Ersetzt die frühere `AGENTS.md` (diese verweist jetzt nur noch hierher).

## Verbindliche Standards

Für alle SEO-/GEO-/Meta-/Content-Aufgaben gilt verbindlich:
@SEO-GEO-STANDARDS.md

Design/Verhalten gemäß:
@DESIGN.md

## Arbeitsweise & Workflow

Phasenweises Vorgehen und Stopp-Punkte gemäß:
@phasenweise-oder-stopps-implementieren.md

## Code- & UI-Regeln

- **Mobile-First** entwickeln.
- **Maximal 700 Zeilen pro Datei.**

## Dev-Server

- **NIEMALS automatisch `npm run dev` oder `pnpm dev` starten.**
- Der Dev-Server läuft oft bereits im Hintergrund.
- Automatisches Starten verursacht Port-Konflikte (`EADDRINUSE`).

## Kunde

CarCare Center, Leipzig. Kfz-Meisterbetrieb mit Lackierhandwerk.
Zwei Hauptgeschäftsbereiche: **Fahrzeugaufbereitung** und **Unfallinstandsetzung**.
Ansprechpartner beim Kunden: André Bosse.

## Verbindliche Textregeln

Gelten für alle Seiten, auch für neu erstellte. Ergänzend zu @SEO-GEO-STANDARDS.md.

1. **Namensschreibweise:** „CarCare Center", ohne Bindestrich.
   „CarCare" darf nicht allein stehen – entweder „CarCare Center" oder „wir".
   Falsch und zu ersetzen: „Kcare", „KCare", „K-Care", „Kare", „KKR".
2. **Ansprache:** Alle Texte stehen in der ersten Person Plural. Sätze in der
   dritten Person werden **umformuliert, nicht wortweise ersetzt** – das
   betrifft Verbform, Possessivpronomen und ggf. den Satzbau.
   Falsch: „CarCare Center kümmert sich um Ihr Fahrzeug."
   Falsch: „Wir kümmert sich um Ihr Fahrzeug." (reine Ersetzung)
   Richtig: „Wir kümmern uns um Ihr Fahrzeug."
   Ebenso: „In seinem Betrieb …" → „In unserem Betrieb …",
   „Das Unternehmen bietet …" → „Wir bieten …".
   Die Kundenansprache bleibt beim „Sie".
   Ausnahme 1 – Firmenname: Wo er aus SEO-Gründen bewusst stehen soll
   (Hero, strukturierte Daten), bleibt er erhalten. Faustregel für den
   Fließtext: **Der Name darf stehen, aber nie als Subjekt eines Verbs in
   der dritten Person.** „Warum CarCare Center Leipzig" ist richtig,
   „CarCare Center kümmert sich" ist falsch.
   Ausnahme 2 – strukturierte Daten: In JSON-LD-Beschreibungen
   (`description` in `seo/structuredData.ts` und `seo/pageSchemas.ts`, z. B.
   `AutoRepair` und `aboutPageSchema`) bleibt auch die **dritte Person**
   erhalten. Das sind Maschinen-Metadaten über die Entität, nicht die
   Selbstbeschreibung im Fließtext; dort ist die dritte Person die
   konventionelle Form. Sichtbarer Seitentext fällt nicht darunter.
   Entschieden am 2026-09-02, nicht neu aufmachen.
   Ausnahme 3 – FAQ-Fragen (seit 2026-10-07, Lektorat): Die Frage ist Kundenstimme und darf den
   Firmennamen als Subjekt tragen („Arbeitet das CarCare Center auch für Autohäuser …?“). Die
   Antwort steht in der Wir-Form und beginnt, wo möglich, mit „Ja.“ oder „Nein.“
3. **Gründungsjahr:** „seit 1998". Nicht 1993, nicht 1996.
4. **Betriebsfläche:** „über 3.500 m²" bzw. „über 3.500 Quadratmeter".
   **Geändert am 2026-09-14** von 3.000 auf 3.500. André nennt die Zahl in Schleife 4
   zweimal unabhängig (4.2 für die Aufbereitungsseite, 4.18 für den Zeitstrahl); der
   User hat sie bestätigt. Gemessen nach der Umstellung: **33 Fundstellen in 20 Dateien**
   unter `components/`, `pages/`, `data/`, `seo/` — sichtbarer Text, FAQ und strukturierte
   Daten — dazu die USP-Bausteine in `SEO-GEO-STANDARDS.md`. Alle zugleich umgestellt.
   Die frühere Angabe 3.000 gilt nicht mehr und ist auch nicht als Alternative zulässig.
   ⚠️ **Falle beim Nachziehen:** Nicht global auf „3.000" ersetzen.
   `pages/DatenschutzPage.tsx` nennt „23.000 Zeichen" — eine Textlänge, keine Fläche.
   Nur die Muster „3.000 m²" und „3.000 Quadratmeter" treffen.
5. **Meisterbetrieb:** Der Begriff bleibt auch im Aufbereitungsbereich erhalten
   (SEO-relevant), obwohl Aufbereitung kein Meisterhandwerk ist.
6. **Keine Gedankenstriche** im sichtbaren Text, in Titeln und Beschreibungen (Wunsch André,
   Mail vom 2026-09-28, Backlog 6.26): Satz für Satz durch Punkt oder Komma ersetzen, nicht
   durch Suchen und Ersetzen. Bleiben dürfen Bis-Striche zwischen Zahlen („1–2 Tage",
   „8–17 Uhr") und Wochentagen sowie die Telefonnummer „0341 - 261 77 90". Der Build bricht
   bei einem neuen Strich (`scripts/check-gedankenstriche.mjs` im `postbuild`); Kommentare im
   Code sind nicht betroffen.
7. **Stilblatt** (seit 2026-10-06, Lektorat): Schreibweisen nach `docs/lektorat/stilblatt.md`,
   u. a. „Spot-Repair“, „Smart Repair“, „Pkw/Lkw“, „Ersatzwagen“ (nicht „Werkstattersatzfahrzeug“),
   geschütztes Leerzeichen zwischen Zahl und Einheit (m², €, %, km, Uhr) und in „z. B.“, Komma vor
   jeder Infinitivgruppe mit „zu“. Prüfen: `npm run lektorat` (Auszug und Vorprüfung je Route).

## Inhaltliche SEO-Vorgaben des Kunden

Vom Kunden abgenommen, nicht wegoptimieren:

- FAQ-Block pro Subseite bleibt: dient als maschinenlesbare Zusammenfassung
  für KI-Suchmaschinen, die Karteninhalte nicht auslesen können.
- Ablauf-/Prozess-Sektionen bleiben: werden von KI-Suchmaschinen bevorzugt.
- Expertise-/Über-uns-Block am Ende jeder Subseite bleibt: hebt das Ranking
  der Subseite, nicht der Hauptseite.
- Technische Fachbegriffe sind Auffindbarkeitspotenzial und werden
  perspektivisch mit Wissensbeiträgen unterfüttert.

## Umsetzungsprinzipien

- CSS-native Lösungen vor JavaScript, wo Performance relevant ist
  (z. B. `position: sticky` mit gestaffelten Offsets statt Scroll-Listener).
- Sticky- und Scroll-Verhalten früh auf Tablet und Smartphone prüfen,
  nicht erst am Ende.
- **Vor jedem neuen Build-Wächter oder Prüfskript die Frage beantworten:**
  *Was besteht diese Prüfung, ohne dass die Sache tatsächlich in Ordnung ist?*
  Fünf Wächter haben 2026-09-03 grün gemeldet, während sie hätten greifen müssen.
  Begründung, Fälle und Anwendung:
  `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`
- **Kein runder Beschnitt um große Behälter** (`border-radius` zusammen mit `overflow: hidden/clip` an `main`,
  Seiten- oder Sektionshüllen). Chrome wendet ihn auf jede Glas-, Video- oder `will-change`-Ebene darin über eine
  eigene Maske in Behältergröße an. **Unsichtbares Glas** (`backdrop-filter` mit `opacity: 0`) zusätzlich
  `visibility: hidden`, sonst bleibt es eine Ebene. Beides zusammen ergab 2026-10-19 16 seitengroße Masken und
  leere Kacheln am MacBook (R32, `npm run zeichnen`).

## Globale Suche

Suchdialog in der Navbar (rechts neben „Kontakt", Strg/⌘ + K, „/"). Der **Index entsteht beim Build
im Prerender** aus dem gerenderten Inhalt jeder Route (`scripts/lib/suchindex.mjs` →
`dist/suchindex.json`): neue Seiten und Texte sind also automatisch auffindbar. Der Build bricht, wenn
eine Route fehlt oder unter 200 Zeichen Text liefert.
- Text von der Suche ausnehmen: `data-suche="aus"` am Element (Platzhalter, `aria-hidden`,
  CTA-Knöpfe `.cc-gradient-button` und KI-Plaketten `.cc-ki-marke` sind es schon).
- Kundenworte, die auf der Seite anders heißen („Leihwagen" → „Ersatzwagen"): `SYNONYME` in
  `lib/suche.ts` — nur für Dinge, die wir wirklich anbieten.

## Messwerkzeuge

Vor jeder Aussage über Kontrast, Meta-Längen oder Layout: **messen, nicht schätzen.**

| Befehl | Was er misst | Wann |
|---|---|---|
| `npm run kontrast` | WCAG-AA-Kontrast im ausgelieferten HTML, je Route/Breite/Textstelle. `-- / --sektionen` misst zusätzlich jeden Sektionskopf und jeden Schritt der gepinnten Abläufe (seit 2026-10-16; die vier festen Stellen treffen die mobilen Fotoflächen nicht sicher). `-- / --fenster=375x548,375x629` misst statt 1440 × 900 und 390 × 844 diese Fenster (seit 2026-10-17; der Hero steht unter 640 px Höhe anders, R29; dort fand er die Unterzeile bei 4,11 : 1, während der Standardlauf grün war) | nach jeder Farb-, Verlaufs- oder Transparenzänderung |
| `npm run akkordeon` | Bildkarten-Akkordeons mobil (Startseite ×2, /karriere) bei echtem Tipp, CPU 4×: **Layout pro Bild** (hart, wenn 150–650 ms nach dem Klick mindestens 80 % der Hauptthread-Bilder ein Layout rechnen, dazu mindestens 3 späte Layouts; gemessen 18.10. nach dem Merge: normal 0–50 % bei höchstens 2 späten Layouts, eingespielte Höhen-Animation 60–117 %; unter Last teils nur 1 spätes Bild, dann übersieht die Gegenprobe sie, offen als O12 in `docs/mobil-akkordeon-faq/tasks/`; gezählt über `BeginMainThreadFrame`, nicht über rAF-Rückrufe: Seit Lenis im Leerlauf steht (R26), fehlen sie in vielen Bildern, beim Mitgleiten zur Mitte kommen bis zu sechs je Bild), Animationen abseits des Compositors, Ruhelage nach Tipp und nach Unterbrechung, **getippte Karte gleitet ohne Sprung in die Mitte des freien Bereichs** (seit 2026-10-17; zwischen Navbar und Knopfleiste, beide mit `data-feste-leiste`; bis dahin „bleibt stehen“), **kein Schatten außerhalb der sichtbaren Karte** (das „weiße Rechteck“ vom 17.10.), **keine Tipp-Hervorhebung** an den Karten, **Maus im schmalen Fenster** (seit 2026-10-19, R33; 900 × 800 und 393 × 851 mit Maus, Ausgangslage erst nach dem Einblenden der Karten): Darüberfahren und Klick klappen auf und gleiten mittig wie ein Tipp, **keine Kette** in Ruhe, auf dem Weg über die Streifen und beim Mausrad, danach öffnet Darüberfahren wieder; Hauptthread-Zeit je Bild als Hinweis. Lagen werden nach jedem Bild gelesen, nicht im eigenen rAF-Rückruf (`scripts/lib/bahn.mjs`, seit 18.10.: sonst Scheinsprünge, seit Lenis sich erst beim Gleiten anmeldet). Ausgewertet wird nur ab Spurstart und ab einer Marke, die der Klick auf die Zielkarte setzt; ohne sie **Messfehler (Exit 2)** statt eines Urteils (vorher zählte ein mitgelieferter Puffer von vor dem Start, 2026-10-16). `-- --gegenprobe` spielt Höhen-Animation, Hervorhebung, Fensterschatten und abgeschaltetes Scrollen ein, dazu mit der Maus „ohne Gleiten“ und die alte Kette (O8), und verlangt alle Meldungen; `-- /karriere` nur diese Route (Git Bash: `MSYS_NO_PATHCONV=1`); `-- --protokoll` Zustand je Schritt, Spuren nach `output/akkordeon/` | nach jeder Änderung an `ExpandingCardAccordion`, `akkordeonMobil.ts`, `akkordeonKarten.tsx`, `lib/freierBereich.ts` oder Lenis (`useSmoothScroll`) |
| `npm run leerlauf` | **Leerlauf jeder Route** (Smartphone 393 × 851 Touch und Desktop 1920 × 945, oben und Seitenmitte): höchstens 10 Hauptthread-Bilder in 1,5 s ohne Eingabe, bei Befund mit Quelle jedes rAF-Rückrufs (Datei, Zeile, Code aus `dist/`). Dazu **Gleiten** bei Mausrad (Desktop, /), Anker-Tipp (Smartphone, /karriere) und App-Navigation (/karriere → /#leistungen): Lenis gleitet (`lenis-smooth`), mindestens 8 Zwischenlagen, kein Schritt über 35 % des Wegs, Ankunft, danach wieder Leerlauf; erster Schritt höchstens 1,5-mal so groß wie bei der früheren Dauerschleife. `-- --gegenprobe` spielt rAF-Dauerschleife und springende Uhr ein und verlangt jede Meldung; `-- /route` nur Leerlauf dieser Route(n) | nach jeder Änderung an `hooks/useSmoothScroll.ts`, an Lenis-Optionen oder an Komponenten mit eigener rAF-Schleife oder Daueranimation |
| `npm run faq-mobil` | FAQ auf **jeder** Route mit FAQ (seit 2026-10-17 überall dasselbe Akkordeon, `FaqListe`): Frage als Knopf in `h3`, Antwort mit Text im DOM (geschlossen `inert` + `aria-hidden`), am Start nur Frage 1 offen; echter Tipp auf eine Frage bei 45 % und eine bei 85 % der Fensterhöhe: **Nachbarn bleiben unverändert** (kein Auto-Schließen, an dem die getippte Frage wegrutschte), **kein Sprung**, danach **Frage samt Antwort ganz im freien Bereich** (Lage nach jedem Bild gelesen, `scripts/lib/bahn.mjs`). Eine Seite mit `FAQPage`-Markup ohne Akkordeon ist ein Befund. `-- --gegenprobe` spielt Auto-Schließen und abgeschaltetes Nachscrollen getrennt ein und verlangt beide Meldungen; `-- /route` nur diese Route | nach jeder Änderung an `FaqListe`, `FAQSection`, `PageFAQ`, `styles/faq.css`, `lib/freierBereich.ts` oder an den festen Leisten |
| `npm run meta` | Title- und Description-Länge gegen 50–60 / 140–160 Zeichen | nach jeder Meta-Änderung |
| `npm run shots` | Bildschirmfotos je Sektionsgrenze, Desktop + mobil (mobil als Touch-Gerät), dazu **Kontaktbogen** `output/shots/kontaktbogen.html` mit allen Aufnahmen je Seite und Zeitpunkt | vor jedem Review mit dem Kunden |
| `npm run zielgruppen` | Zielgruppenkarten der Startseite über 15 reale Fenstergrößen: Partner sichtbar (Treffertest), Mausrad erreicht Liste und Kartentext (echtes Rad), Scrollweg bis zur Überdeckung | nach jeder Änderung an `TargetGroupCards`, `ZielgruppenPartner`, `styles/zielgruppen.css` oder Lenis |
| `npm run aussparung` | Aktions-Aussparung oben rechts (beschriftete Pillen „Aufbereitung anfragen" + „Schaden melden", ab 1024 px; bis 2026-09-28 Telefon): liegt irgendwo Text oder ein Bedienelement **dauerhaft** darunter (z. B. etwas, das höher als die Navbar gepinnt ist)? 29 Routen × 3 Fenster, je Route Sichtbarkeit (muss 100 % sein) und Pixelprobe je Pille. Dazu **Geometrie an 23 Breiten**: Lücke zum Navbar-Reiter ≥ 20 px, Beschriftungen vollständig, Navbar-Links ≥ 12 px im Reiter, sichtbarer Text in der Ansage | nach jeder Änderung an gepinnten Flächen (`position: sticky`), an `AktionsAussparung`, an der Navbar-Höhe oder an Reiterbreite/Link-Abständen (`--cc-nav-*` in `styles/aussparung.css`) |
| `npm run mobil` | Smartphone-Ansicht jeder Route bei 360/390/430 px: waagerechter Überlauf, **abgeschnittene Texte** (echte Textzeilen gegen `overflow`-Vorfahren), Trefferflächen unter 24 px (WCAG 2.5.8 samt Ausnahmen), **Fußzeile** unsichtbar, oben unerreichbar oder verdeckt; **Einblendungen** ohne Zutun (`role="dialog"`, z. B. Stellen-Pop-up) über 30 % der Fensterhöhe oder ohne wirksamen Schließknopf; **erster Bildschirm**: was `data-erster-bildschirm` trägt (Vertrauensleiste im Hero), steht beim Laden ganz und unverdeckt im Fenster oder beginnt ganz knapp darunter (höchstens 120 px, seit 2026-10-17, R29), nie angeschnitten, auch in den niedrigen Fenstern von Safari und Chrome (393 × 659, 393 × 739, 375 × 667, 375 × 629, 375 × 600, 360 × 560, 375 × 548; Tabelle je Fenster im Bericht); Hinweis: Schrift unter 12 px. `-- --gegenprobe` spielt zehn Fehler ein und verlangt jede Meldung. Bewusster Anschnitt: `data-mobil-anschnitt="Begründung"` am Behälter. Bericht `output/mobil/bericht.md` (Gegenprobe: `gegenprobe.md`) | nach Änderungen an Layout, Schriftgrößen, Überschriften oder Fußzeile; vor jedem Mobile-Review |
| `npm run cls` | **Layout-Sprünge beim Laden** (CLS, Google-Grenze 0,1) je Route bei 360 × 640, 390 × 844, 1024 × 700 und 1366 × 657, mit CPU-Drosselung 4× wie Lighthouse mobil, drei Tabs parallel; hart ab 0,1, wenn eine Einzelmessung es bestätigt (sonst Hinweis „nur unter Last“), mit Verursacher (Element und Text). Ohne Drossel bleiben Timing-Fehler unsichtbar: Der Fußzeilensprung (R23) maß lokal ungedrosselt 0. `-- --gegenprobe` spielt einen Sprung ein. Bericht `output/cls/bericht.md` | nach Änderungen an Komponenten, die nach dem ersten Bild messen oder umschalten (Fußzeile, Pop-ups, Portale), an `scripts/prerender.mjs`, vor jedem Livegang |
| `npm run zeichnen` | **Zeichenlücken**: Stellen, an denen der Browser Seiteninhalt nicht zeichnet (R32, 2026-10-19: am MacBook war die Startseite am Akkordeon „zerschossen“, die fixierte Fußzeile schien durch; kein anderes Werkzeug sah es). Seitengrund und Fußzeile magenta, Grund von `main` türkis; jede Route in 1440 × 790 Retina, 1920 × 945, 1024 × 700 Retina und 390 × 844 durchscrollen, Aufnahme aus dem Compositor, Lücke ab 0,5 % der Fläche (nachgemessen). Dazu je Position der **Ebenenbaum**: **Masken in Seitengröße** (gleich große Ebenen höher als drei Fenster ohne eigenen Grund; so wendet Chrome einen runden Beschnitt auf Glas-, Video- und `will-change`-Ebenen an; hart ab 4, Hinweis ab 2; vor dem Fix 16 bis 36, danach 0). Das ist die Ursache und auf jedem Rechner gleich, auch wo das Kachelbudget noch reicht. **Eichung** vorab: spielt den alten Fehler ein; zeigt dieser Rechner ihn nicht als Lücke, gibt es für Lücken kein Urteil (**Exit 2**). Seite ohne `main` (z. B. Vercels Sicherheitsprüfung bei `--url`) = Messfehler, ebenfalls Exit 2. `-- --gegenprobe`, `-- --url <deployment>`, `-- --sichtbar` (echtes Fenster, echte Grafikkarte), `-- --protokoll` (Aufnahme jeder Position). Bericht `output/zeichnen/bericht.md` | nach Änderungen an Glas (`backdrop-filter`, `.cc-liquid`), `will-change`, Videos, an runden Ecken mit `overflow` an großen Behältern, an `Layout`/`.site-main-shell`; vor jedem Livegang |
| `npm run nummern` | Backlog-Nummern gegen die Kundenräume | läuft im `prebuild` mit |
| `npm run weiterleitungen` | 301-Weiterleitungen der **alten** Website (R22): jedes Ziel eine Route, keine Quelle eine Route, keine Ketten, jede Adresse des Altseiten-Inventars (`docs/weiterleitungen-altseite/altseite-inventar.json`) hat eine Regel, Datei oder begründete Ausnahme, `vercel.json` und die Übergabe für Apache/nginx sind synchron. `-- --gegenprobe` spielt 10 Fehler ein; `-- --live [url]` prüft am Deployment jede alte Adresse auf 301 und Ziel. Liste: `scripts/lib/weiterleitungen.mjs`, danach `npm run vercel-config`. Inventar neu: `npm run altseite` (nur solange die Altseite läuft) | läuft im `prebuild` mit; `--live` nach dem Deploy und nach der DNS-Umstellung (gegen `https://www.carcare-center.de`) |
| `npm run tote-dateien` | Quelldateien, die von keinem Einstieg erreichbar sind (Importgraph über den TS-Compiler, auch transitive Waisen). Dateien mit „BEWUSST GEPARKT“ im Kopf werden genannt, aber nicht gezählt (derzeit `components/Jobs.tsx`). Braucht **kein** `dist/` | bevor eine Komponente als „ungenutzt“ gilt oder gelöscht wird; nach Umbauten, die Sektionen ersetzen |
| `npm run gedankenstriche` | Gedankenstriche im ausgelieferten Text, in Titeln und Beschreibungen (Textregel 6), mit Umfeld je Fund | läuft als Wächter im `postbuild` mit; von Hand nach Textänderungen |
| `npm run bilder` | Jede Bildstelle der ausgelieferten Seite mit **fester Nummer B<n>**, Ort (Seite › Sektion › Karte), Datei, Git-Datum; je Datei alle Stellen; Platzhalter; Gegenprobe gegen Ordner und Code. Schreibt `docs/bilder/README.md` + Kontaktbogen `output/bilder/bilder-uebersicht.html` | nach jedem Bildtausch und bevor der User Bildwünsche des Kunden durchgibt |
| `npm run lektorat` | Text jeder Route **so, wie der Besucher ihn sieht** (Akkordeons und FAQ aufgeklappt, Desktop + mobil, Bildtexte, Vorlesetexte, Formularfelder, Title/Description, JSON-LD), dazu globale Bausteine, Formulare und Suche; mechanische Vorprüfung gegen Duden 2024, Stilblatt und Textregeln (K/H). Schreibt `output/lektorat/auszuege/*.md` + `uebersicht.md` (Wörter gegen Suchindex). Routen einzeln: `npm run lektorat -- karriere start`; nur global: `-- --global` | bei jeder Textänderung und für das Lektorat (`docs/lektorat/`) |

Alle brauchen ein aktuelles `dist/` (`npm run build`). Sie starten `vite preview`
selbst — **niemals** `npm run dev` dafür starten.
Seit 2026-09-28 nennen sie beim Start den gemessenen Build (`[dist] Build vom …`) und brechen ab,
wenn eine getrackte Quelldatei neuer ist als `dist/` (`scripts/lib/dist-stand.mjs`; absichtlich den
alten Stand messen: `CC_ALTEN_STAND_MESSEN=1`). **Ergebnisse in der Doku mit diesem Build belegen,
und nach jeder Korrektur alle Werkzeuge gegen den neuen Build**, nicht nur das mit dem Befund: Ein
grüner Kontrastlauf hatte einmal den Build vor der letzten Korrektur gemessen.

**„Full HD" heißt nicht 1080 px Seitenhöhe.** Ein maximierter Browser auf 1920 × 1080 gibt der
Seite etwa 913–945 px, mit 110 % Zoom 830 px. An genau dieser Lücke waren die Partnerlisten
2026-09-17 unsichtbar (Ausblendung unter 860 px). Höhenabhängige Layouts an den Fenstern aus
`scripts/check-zielgruppen.mjs` messen, nicht an der Bildschirmauflösung.

**„iPhone 14 Pro" heißt nicht 852 px.** Das ist das ganze Display, so zeigt es die Geräteansicht der DevTools.
In Safari bleiben der Seite mit eingeblendeten Leisten (so beim Laden) 659 px, so führt u. a. Rocket Validator das
Gerät; eingeklappt rund 739 px (abgeleitet, beides am Gerät nicht nachgemessen). 2026-10-16 lagen bei 659 px die Knöpfe
der festen Leiste 84 px über der Vertrauensleiste im Hero, in den DevTools war alles frei. Alles, was beim Laden ganz
zu sehen sein muss, trägt `data-erster-bildschirm`; `npm run mobil` prüft es in diesen Fenstern. Unter 640 px Höhe
(iPhone SE und mini in Safari, kleine Android-Telefone) beginnt die Vertrauensleiste beim Laden knapp unter dem
Fensterrand und kommt mit dem ersten Wischen (Entscheidung des Users 2026-10-17, R29, `styles/hero.css`).

**Der Kontrastmesser hat 2026-09-03 gefunden, was drei Sichtprüfungen nicht fanden.**
Die sechs Fallen seines Aufbaus stehen im Kopf von `scripts/check-kontrast.mjs`;
wer daran etwas ändert, liest sie zuerst.

## Push-Stand (vor JEDEM Push)

Kollegen an anderen Standorten gleichen ihre Pulls mit `docs/push-stand/README.md` ab:
Branches lokal ↔ GitHub, Commits des Pushs, was nach dem Pull zu tun ist (`npm install`?),
was nur lokal liegt, was inhaltlich offen ist. Früheres steht in `docs/push-stand/verlauf.md`.
**Wunsch des Users vom 2026-09-18: bei jedem Push, nicht nur einmal.**

1. Commits fertig, Branches gemergt
2. `npm run push-stand` — erzeugt beide Dateien aus git und dem Backlog, nichts von Hand.
   Wird nur ein Branch gepusht und `main` bleibt stehen: `npm run push-stand -- --nur <branch>`,
   sonst stehen ungepushte Commits paralleler Branches als „kommt mit diesem Push" darin
3. `git add docs/push-stand && git commit -m "Docs: Push-Stand <Datum>"`
4. pushen

Ein Hook in `.claude/settings.json` sperrt `git push`, solange die **committete** Übersicht einen
Commit nicht nennt, der mit dem Push auf GitHub käme. Pushes aus Terminal oder IDE prüft er nicht —
dort gilt dieselbe Reihenfolge von Hand. Prüfen ohne Push: `npm run push-stand -- --pruefen`.
Was die Sperre nicht abdeckt, steht im Kopf von `scripts/push-stand.mjs`.

## Backlog

**Einstiegspunkt für alle Kundenaufgaben:** `docs/backlog/README.md`

Dort liegen alle sechs Review-Schleifen mit 194 Aufgaben, die Auswertung „was ist
wirklich offen", und die vom Kunden gelieferten Quelllisten.

| Datei | Nummernraum |
|---|---|
| `docs/backlog/schleife-1.md` | 1.1 – 1.26 (abgeschlossen) |
| `docs/backlog/schleife-2.md` | 2.1 – 2.27 |
| `docs/backlog/schleife-3.md` | 3.1 – 3.37 |
| `docs/backlog/schleife-4.md` | 4.1 – 4.21 (Originalnummern aus Andrés Liste) |
| `docs/backlog/schleife-5.md` | 5.1 – 5.44 (Meeting 2026-09-25; von OALAB auf Wunsch des Users aus dem Transkript vergeben) |
| `docs/backlog/schleife-6.md` | 6.1 – 6.26 (Meeting 2026-09-28 plus Andrés Mail vom selben Tag; ebenfalls von OALAB vergeben) |
| `docs/backlog/nicht-relevant.md` | ohne Nummer |
| `docs/backlog/nice-to-have.md` | `R<n>` — eigene Vorschläge „für später“, nicht beauftragt, nicht gezählt |
| `docs/backlog/offene-punkte-konsolidiert.md` | Auswertung, gegen den Code geprüft |

Aufgaben werden über ihre Nummer referenziert (z. B. „setze 1.7 und 1.8 um").
Ein Arbeitspaket = ein Branch = eine Session.
Stopp-Punkte innerhalb eines Pakets gemäß @phasenweise-oder-stopps-implementieren.md.

**⚠️ Nummern nicht selbst vergeben.** Die Räume gehören dem Kunden. Eigene Befunde
bekommen das Kürzel `R<n>` („Repo-Befund"), niemals eine freie `x.y`-Nummer. Grund:
R4–R12 wurden einmal repo-lokal vergeben und kollidieren seitdem mit fünf echten
Kundenpunkten — darunter beide Livegang-Blocker. Auflösung:
`docs/backlog/tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`

**Bildnummern `B<n>`** (seit 2026-09-18) sind ebenfalls Absprachen: Der User nennt damit
die Bildwünsche des Kunden („B14 und B27 tauschen“). Vergeben und gehalten werden sie
ausschließlich von `npm run bilder` über `docs/bilder/nummern.json` — nie von Hand
umnummerieren, entfallene Nummern nie neu vergeben. Wird ein Bild getauscht, bleibt die
Nummer; eine Datei kann an vielen Stellen stehen (siehe „Nach Datei“ in
`docs/bilder/README.md`), also vor jedem Tausch prüfen, ob nur **eine** Stelle gemeint ist.
