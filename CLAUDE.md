# CLAUDE.md

> Führende Regeldatei dieses Projekts; `AGENTS.md` verweist nur hierher.

## Verbindliche Standards

Für alle SEO-/GEO-/Meta-/Content-Aufgaben gilt verbindlich:
@SEO-GEO-STANDARDS.md

Design/Verhalten gemäß:
@DESIGN.md

## Arbeitsweise & Workflow

Phasenweises Vorgehen und Stopp-Punkte gemäß:
@phasenweise-oder-stopps-implementieren.md

## Code, UI, Dev-Server

- **Mobile-First**; **höchstens 700 Zeilen je Datei**
- **Nie automatisch `npm run dev` oder `pnpm dev` starten** (läuft oft schon → `EADDRINUSE`)

## Kunde

- CarCare Center, Leipzig: Kfz-Meisterbetrieb mit Lackierhandwerk
- Zwei Hauptbereiche: **Fahrzeugaufbereitung** und **Unfallinstandsetzung**
- Ansprechpartner: André Bosse

## Verbindliche Textregeln

Gelten für alle Seiten, auch neue; ergänzend zu @SEO-GEO-STANDARDS.md.

1. **Name:** „CarCare Center“, ohne Bindestrich; „CarCare“ nie allein (sonst „CarCare Center“ oder „wir“)
   - falsch, ersetzen: „Kcare“, „KCare“, „K-Care“, „Kare“, „KKR“
2. **Ansprache:** erste Person Plural, Kunde mit „Sie“
   - dritte Person **umformulieren, nicht wortweise ersetzen** (Verbform, Possessiv, Satzbau): „CarCare Center kümmert sich“ → „Wir kümmern uns“ (nie „Wir kümmert sich“); „In seinem Betrieb“ → „In unserem Betrieb“; „Das Unternehmen bietet“ → „Wir bieten“
   - Ausnahme Firmenname: bleibt, wo er aus SEO-Gründen stehen soll (Hero, strukturierte Daten); Faustregel: Name darf stehen, nie als Subjekt eines Verbs in dritter Person („Warum CarCare Center Leipzig“ ✓)
   - Ausnahme JSON-LD: `description` in `seo/structuredData.ts` und `seo/pageSchemas.ts` (z. B. `AutoRepair`, `aboutPageSchema`) bleibt in dritter Person (Maschinen-Metadaten); sichtbarer Text nie; Entscheidung steht, nicht neu aufmachen
   - Ausnahme FAQ-Fragen: Frage = Kundenstimme, darf den Firmennamen als Subjekt tragen („Arbeitet das CarCare Center auch für Autohäuser …?“); Antwort in Wir-Form, wo möglich mit „Ja.“/„Nein.“ beginnend
3. **Gründungsjahr:** „seit 1998“ (nicht 1993, nicht 1996)
4. **Betriebsfläche:** „über 3.500 m²“ bzw. „über 3.500 Quadratmeter“; 3.000 ist ungültig, auch nicht als Alternative
   - gilt in sichtbarem Text, FAQ, strukturierten Daten (`components/`, `pages/`, `data/`, `seo/`) und USP-Bausteinen in `SEO-GEO-STANDARDS.md`
   - ⚠️ nie global „3.000“ ersetzen: `pages/DatenschutzPage.tsx` nennt „23.000 Zeichen“; nur „3.000 m²“/„3.000 Quadratmeter“ treffen
5. **Meisterbetrieb:** bleibt auch im Aufbereitungsbereich (SEO), obwohl Aufbereitung kein Meisterhandwerk ist
6. **Keine Gedankenstriche** in sichtbarem Text, Titeln, Beschreibungen (Kundenwunsch, Backlog 6.26): Satz für Satz durch Punkt oder Komma ersetzen, nie per Suchen/Ersetzen
   - erlaubt: Bis-Striche zwischen Zahlen („1–2 Tage“, „8–17 Uhr“) und Wochentagen, Telefonnummer „0341 - 261 77 90“; Code-Kommentare frei
   - Build bricht bei neuem Strich (`scripts/check-gedankenstriche.mjs` im `postbuild`)
7. **Stilblatt** `docs/lektorat/stilblatt.md`: u. a. „Spot-Repair“, „Smart Repair“, „Pkw/Lkw“, „Ersatzwagen“ (nicht „Werkstattersatzfahrzeug“), geschütztes Leerzeichen zwischen Zahl und Einheit (m², €, %, km, Uhr) und in „z. B.“, Komma vor jeder Infinitivgruppe mit „zu“; prüfen `npm run lektorat`

## Inhaltliche SEO-Vorgaben des Kunden

Abgenommen, nicht wegoptimieren:

- FAQ-Block je Subseite (maschinenlesbare Zusammenfassung für KI-Suche, die Karteninhalte nicht liest)
- Ablauf-/Prozess-Sektionen (von KI-Suche bevorzugt)
- Expertise-/Über-uns-Block am Ende jeder Subseite (hebt das Ranking der Subseite)
- Technische Fachbegriffe = Auffindbarkeit; später mit Wissensbeiträgen unterfüttern

## Umsetzungsprinzipien

- CSS-native vor JavaScript, wo Performance zählt (z. B. `position: sticky` mit gestaffelten Offsets statt Scroll-Listener)
- Sticky-/Scroll-Verhalten früh auf Tablet und Smartphone prüfen
- **Vor jedem neuen Build-Wächter/Prüfskript beantworten:** *Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?* (Fälle: `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`)
- **Kein runder Beschnitt um große Behälter** (`border-radius` + `overflow: hidden/clip` an `main`, Seiten- oder Sektionshüllen): Chrome legt dann je Glas-/Video-/`will-change`-Ebene darin eine Maske in Behältergröße an → leere Kacheln (prüft `npm run zeichnen`)
- **Unsichtbares Glas** (`backdrop-filter` mit `opacity: 0`) zusätzlich `visibility: hidden`, sonst bleibt es eine Ebene

## Globale Suche

- Suchdialog in der Navbar (rechts neben „Kontakt“, Strg/⌘ + K, „/“)
- Index entsteht beim Build im Prerender aus dem gerenderten Inhalt jeder Route (`scripts/lib/suchindex.mjs` → `dist/suchindex.json`) → neue Seiten automatisch auffindbar; Build bricht, wenn eine Route fehlt oder < 200 Zeichen liefert
- Ausnehmen: `data-suche="aus"` (Platzhalter, `aria-hidden`, `.cc-gradient-button`, `.cc-ki-marke` schon ausgenommen)
- Kundenworte mit anderem Seitenbegriff („Leihwagen“ → „Ersatzwagen“): `SYNONYME` in `lib/suche.ts`, nur für echte Angebote

## Messwerkzeuge

- Vor jeder Aussage über Kontrast, Meta-Längen oder Layout: **messen, nicht schätzen**
- Einzelheiten je Werkzeug (Fenster, Schwellen, Gegenproben, Optionen): [`docs/messwerkzeuge.md`](docs/messwerkzeuge.md)
- Alle brauchen aktuelles `dist/` (`npm run build`), starten `vite preview` selbst, nie `npm run dev`; brechen ab, wenn Quellen neuer als `dist/` sind
- Ergebnisse mit dem gemessenen Build belegen; nach jeder Korrektur **alle** Werkzeuge gegen den neuen Build

| Befehl | Prüft | Wann |
|---|---|---|
| `npm run kontrast` | WCAG-AA-Kontrast im ausgelieferten HTML | nach Farb-, Verlaufs-, Transparenzänderung |
| `npm run akkordeon` | Bildkarten-Akkordeons mobil + Maus: Layout pro Bild, Gleiten zur Mitte, Stimmen-Bildlage, Drehen | nach Änderung an Akkordeons, `data/stimmen.ts`, `lib/freierBereich.ts`, Lenis |
| `npm run leerlauf` | Leerlauf jeder Route, Lenis-Gleiten | nach Änderung an `useSmoothScroll`, Lenis, rAF-Schleifen |
| `npm run faq-mobil` | FAQ-Akkordeon jeder Route | nach Änderung an FAQ-Komponenten, `styles/faq.css`, festen Leisten |
| `npm run nav` | Mega-Menü, mobiles Menü (scrollt, Seite bleibt), Logo | nach Änderung an Navigation, `data/services.ts`, `MobileStickyCTA`, Lenis |
| `npm run meta` | Title 50–60, Description 140–160 Zeichen | nach Meta-Änderung |
| `npm run shots` | Fotos je Sektionsgrenze + Kontaktbogen | vor Kunden-Review |
| `npm run zielgruppen` | Zielgruppenkarten über 15 Fenstergrößen | nach Änderung an `TargetGroupCards`, `ZielgruppenPartner`, Lenis |
| `npm run aussparung` | Aktions-Aussparung oben rechts, Navbar-Geometrie | nach Änderung an Sticky-Flächen, `AktionsAussparung`, Navbar |
| `npm run mobil` | Überlauf, Anschnitt, Trefferflächen, Fußzeile, Einblendungen, erster Bildschirm | nach Layout-/Schrift-/Fußzeilenänderung; vor Mobile-Review |
| `npm run cls` | Layout-Sprünge beim Laden (CPU 4×) | nach Änderung an nachmessenden Komponenten, `scripts/prerender.mjs`; vor Livegang |
| `npm run zeichnen` | Zeichenlücken + Masken in Seitengröße | nach Änderung an Glas, `will-change`, Videos, Rundungen mit `overflow`; vor Livegang |
| `npm run nummern` | Backlog-Nummern gegen Kundenräume | im `prebuild` |
| `npm run weiterleitungen` | 301 der alten Website | im `prebuild`; `--live` nach Deploy und DNS-Umstellung |
| `npm run tote-dateien` | unerreichbare Quelldateien | vor dem Löschen „ungenutzter“ Komponenten |
| `npm run gedankenstriche` | Textregel 6 | im `postbuild`; nach Textänderung |
| `npm run bilder` | Bildstellen mit fester Nummer B<n> | nach Bildtausch; vor Bildwünschen |
| `npm run lektorat` | sichtbarer Text je Route gegen Duden, Stilblatt, Textregeln | bei jeder Textänderung |

### Fallen beim Messen

- **„Full HD“ ≠ 1080 px Seitenhöhe:** maximierter Browser auf 1920 × 1080 gibt 913–945 px, mit 110 % Zoom 830 px → höhenabhängige Layouts an den Fenstern aus `scripts/check-zielgruppen.mjs` messen
- **„iPhone 14 Pro“ ≠ 852 px:** Safari mit eingeblendeten Leisten (beim Laden) 659 px, eingeklappt ~739 px; DevTools zeigen das ganze Display
  - alles, was beim Laden ganz sichtbar sein muss, trägt `data-erster-bildschirm`; `npm run mobil` prüft die niedrigen Fenster
  - unter 640 px Höhe (iPhone SE/mini, kleine Android) beginnt die Vertrauensleiste knapp unter dem Fensterrand und kommt mit dem ersten Wischen (gewollt, `styles/hero.css`)
- **Kontrast nur messen:** Messer findet, was Sichtprüfungen übersehen; sechs Fallen im Kopf von `scripts/check-kontrast.mjs` vor Änderungen lesen

## Push-Stand (vor JEDEM Push)

- Kollegen an anderen Standorten gleichen ihre Pulls mit `docs/push-stand/README.md` ab (Branches lokal ↔ GitHub, Commits, nach dem Pull nötig, nur lokal, inhaltlich offen); frühere in `docs/push-stand/verlauf.md`
- Bei **jedem** Push:
  1. Commits fertig, Branches gemergt
  2. `npm run push-stand` (erzeugt beide Dateien aus Git und Backlog, nichts von Hand); nur ein Branch, `main` bleibt stehen: `npm run push-stand -- --nur <branch>`
  3. `git add docs/push-stand && git commit -m "Docs: Push-Stand <Datum>"`
  4. pushen
- Hook in `.claude/settings.json` sperrt `git push`, solange die committete Übersicht einen mitkommenden Commit nicht nennt; Terminal/IDE prüft er nicht → dort von Hand; prüfen ohne Push `npm run push-stand -- --pruefen`; Lücken im Kopf von `scripts/push-stand.mjs`

## Backlog

- **Einstieg für alle Kundenaufgaben:** `docs/backlog/README.md` (sechs Review-Schleifen, Auswertung „wirklich offen“, Quelllisten des Kunden)

| Datei | Nummernraum |
|---|---|
| `docs/backlog/schleife-1.md` | 1.1 – 1.26 (abgeschlossen) |
| `docs/backlog/schleife-2.md` | 2.1 – 2.27 |
| `docs/backlog/schleife-3.md` | 3.1 – 3.37 |
| `docs/backlog/schleife-4.md` | 4.1 – 4.21 (Originalnummern aus Andrés Liste) |
| `docs/backlog/schleife-5.md` | 5.1 – 5.44 (von OALAB aus dem Meeting-Transkript vergeben) |
| `docs/backlog/schleife-6.md` | 6.1 – 6.26 (von OALAB aus Meeting + Andrés Mail vergeben) |
| `docs/backlog/nicht-relevant.md` | ohne Nummer |
| `docs/backlog/nice-to-have.md` | `R<n>`: eigene Vorschläge, nicht beauftragt, nicht gezählt |
| `docs/backlog/offene-punkte-konsolidiert.md` | Auswertung, gegen den Code geprüft |

- Aufgaben über ihre Nummer („setze 1.7 und 1.8 um“); ein Arbeitspaket = ein Branch = eine Session; Stopp-Punkte nach @phasenweise-oder-stopps-implementieren.md
- **⚠️ Nummern nie selbst vergeben:** Räume gehören dem Kunden; eigene Befunde = `R<n>` („Repo-Befund“), nie freie `x.y` (repo-lokal vergebene R4–R12 kollidieren mit Kundenpunkten; Auflösung `docs/backlog/tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`)
- **Bildnummern `B<n>`:** Absprache für Bildwünsche des Kunden („B14 und B27 tauschen“); vergibt und hält nur `npm run bilder` über `docs/bilder/nummern.json`
  - nie von Hand umnummerieren, entfallene Nummern nie neu vergeben; Bildtausch behält die Nummer
  - eine Datei kann an vielen Stellen stehen („Nach Datei“ in `docs/bilder/README.md`) → vor jedem Tausch prüfen, ob nur **eine** Stelle gemeint ist
