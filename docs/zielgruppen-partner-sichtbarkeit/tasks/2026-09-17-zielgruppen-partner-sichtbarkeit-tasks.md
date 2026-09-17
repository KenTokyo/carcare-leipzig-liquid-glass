# Partnerlisten der Zielgruppenkarten auf jeder Bildschirmgröße sichtbar

**Angelegt:** 2026-09-17 · **Backlog:** R14 · **Branch:** `2026-09-16-preise-partner-schadenlink`
(Befund aus der Sichtprüfung dieses Pakets, deshalb im selben Arbeitsbaum — geht mit in den
Commit von Paket 2; noch nichts committet)
**Vorgänger:** `docs/zielgruppen-partner/tasks/2026-07-24-partnerbetriebe-autohaeuser-tasks.md`
(dort wurde die Ausblendung unter 860 px eingeführt — Finding 3 „bewusste Abwägung")
**Folgepunkte:** [`2026-09-17-zielgruppen-partner-sichtbarkeit-optimierung-tasks.md`](2026-09-17-zielgruppen-partner-sichtbarkeit-optimierung-tasks.md)

## Auftrag (User, 2026-09-17)

> Startseite, Full HD 1920 × 1080: Bei „Versicherungen & Agenturen" und „Autohäuser &
> Fuhrparks" sind keine Partner lesbar. Im halb so breiten Fenster sind sie da. Prüfen, was
> los ist, und so lösen, dass in diesem Format alles Wichtige sichtbar ist — und mobil auch.

## Ursache

1. **Ausblendung per Höhen-Query.** `[@media(min-width:1024px)_and_(max-height:860px)]:hidden`
   an der Partnerliste. Bildschirm des Users (nur lesend geprüft): 2 × 1920 × 1080,
   Skalierung 100 %, Arbeitsfläche 1920 × 1032. Ein maximierter Browser gibt der Seite davon
   913–945 px, mit Zoom 110 % nur 830 px — die Liste verschwand. Im halben Fenster (960 px)
   gilt das schmale Layout ohne diese Regel, deshalb waren die Partner dort da.
2. **Feste Listenhöhe** (96/160/224 px): Auch oberhalb der Schwelle standen auf 1920 × 945
   nur 12 von 32 Versicherern, darunter blieb weißer Leerraum.
3. **Sofort überdeckt:** Die Liste sitzt unten in der Karte, die nächste Karte schiebt sich
   von unten darüber — auf 1920 × 945 nach 150 px Scrollweg, auf 1440 × 900 nach 70 px.
4. **Mausrad erreichte keinen inneren Scrollbereich** außer der Liste selbst: Lenis fängt das
   Rad seitenweit ab. Im halb angedockten Fenster (960 px, Maus) lief der Kartentext 150 px
   über — 8 Versicherer waren nur über die dünne Scrollleiste erreichbar.

## Lösungswege (verglichen vor der Umsetzung)

| Weg | Urteil |
| --- | --- |
| Schwelle nur senken (z. B. 760) | verworfen — 2026-07-24 schon probiert: Inhalt läuft aus der Karte, per Mausrad unerreichbar |
| Liste als Laufband (Marquee) | verworfen — bewegter Text ist schwer lesbar, WCAG 2.2.2 verlangt Pause |
| Nur „+ 27 weitere" mit Link | verworfen — der User will die Partner **lesen** |
| Liste auf die Bildfläche (70 %) legen | verworfen — auf niedrigen Fenstern belegt die Überschrift die Bildfläche, Kontrast auf Foto heikel |
| `data-lenis-prevent` auf mehr Bereiche | verworfen — gibt am Bereichsende nur ruckartig (nativ) an die Seite weiter |
| **Liste nimmt den Restplatz und scrollt; breitere Karte; drei Höhenstufen; Verweilstrecke; `allowNestedScroll`** | **gewählt** — ohne feste Schwellen auf jeder Höhe, Text und CTAs unangetastet, Lenis-eigener Mechanismus |

## Phasen

### ✅ Phase 1 — Messwerkzeug und Ist-Zustand
**Ziel:** Belegen statt schätzen — über realistische Fenster statt Bildschirmauflösungen.
* [x] `scripts/check-zielgruppen.mjs` (`npm run zielgruppen`, 15 Fenster: Full HD mit
      Leisten/Lesezeichen/Zoom, 125 %/150 %, MacBook, 1366er-Laptop, Tablet, halbes Fenster,
      iPhone mit und ohne Leisten, kleines Android). Misst je Karte im Park-Moment: sichtbare
      Partner per Treffertest an fünf Punkten, Überlauf des Kartentexts, Text und CTAs,
      Scrollweg bis zur Überdeckung, Überlappung der Überschrift. Mit Maus: **echtes
      Mausrad** (CDP) auf Liste und Kartentext, inklusive Übergabe an die Seite am Ende.
      Filter `-- 1920 390`, Aufnahmen `-- --bilder`
* [x] Pflichtfrage aus `CLAUDE.md` im Skriptkopf beantwortet (7 Punkte)
* [x] Ist-Zustand gemessen: **23 Befunde** (`output/zielgruppen/ist-2026-09-17.txt`)
* [x] Zwei eigene Messfehler gefunden und behoben, bevor gewertet wurde: Eckpunkte des
      Treffertests fielen aus Pillenformen (Chrome trifft runde Ecken nicht) → alle CTAs
      „unsichtbar"; Schriftgröße vom Link statt vom Namen gelesen → „16 px"
* [x] `HALTE_SCROLL` mit eigener Kennung je Schleife (Folgepunkt 3 vom 2026-09-16)

**Referenzen:**
`scripts/check-zielgruppen.mjs`
`scripts/lib/preview-server.mjs`
`package.json`

### ✅ Phase 2 — Umsetzung
* [x] Höhen-Ausblendung entfernt (`PARTNER_HIDE_CLASS`, `partnersHideBelow` in `types.ts`)
* [x] Neue Komponente `components/ZielgruppenPartner.tsx` (60 Zeilen): Block `lg:flex-1`,
      Liste `min-h-0 flex-1 overflow-y-auto`, Mindesthöhe `--liste-min` (Titel + 2 Zeilen),
      Spalten `repeat(auto-fill, minmax(9rem, 1fr))` ab `sm` (drei auf Full HD, fünf im
      halben Fenster — dort anfangs fest zwei, aus der Aufnahme 960 × 945 nachgezogen;
      Telefon fest zwei), `content-start`, Anzahl rechts im Titel
* [x] Namen 11 → 12 px (`PartnerEintrag`, Darstellung `liste`)
* [x] Stapel-Variablen aus Tailwind-Klassen nach `styles/zielgruppen.css` (`.zielgruppen-stapel`),
      mit **drei Höhenstufen** ab `lg`: normal ≥ 860 px · kompakt ≤ 859 px (Schritt 5rem,
      Titel 24 px einzeilig) · flach ≤ 679 px (kein Stapelschritt). Neue Variable `--kopf`
      entkoppelt Titelzeile und Stapelschritt
* [x] `.zielgruppen-titel`-Regeln aus `index.css` mit umgezogen (index.css 688 → 637 Zeilen)
* [x] Weiße Karte `30 %` → `--karte-b: clamp(25rem, 35vw, 38rem)`; Überschrift auf
      `min(54vw, 40rem, 100vw − Karte − 8rem)` begrenzt, damit sie auf 1024 px nicht über
      der Karte liegt
* [x] **Verweilstrecke** als eigenes Element zwischen den Karten (`--verweil`: 12svh mobil,
      20svh ab md, 25svh ab lg) — nicht als `margin-bottom`, sonst lösten die Karten am
      Stapelende zu verschiedenen Zeitpunkten (Sticky begrenzt über die Margin-Box)
* [x] **Scroll-Verlauf** `styles/scrollverlauf.css` (`.cc-scroll-verlauf`): CSS-Maske,
      gesteuert von `animation-timeline: scroll(self)` — ohne JS, nur aktiv wenn der Bereich
      scrollt; zweite Fassung mit getrennten `animation-range` je Kante, weil die erste bei
      1 px Überlauf die letzte, voll sichtbare Zeile ausblendete
* [x] **`allowNestedScroll: true`** in `hooks/useSmoothScroll.ts`; `data-lenis-prevent`
      entfernt
* [x] `data-karte` / `data-partner` als stabile Messpunkte
* [x] Mitgefixt: `tsconfig.json` schließt `output/` und `dist/` aus — die Paket-1-Sicherung
      unter `output/` (vom 2026-09-16) hätte `npm run build` rot gemacht
* [x] Mitgefixt: veralteter Kopfkommentar in `styles/textschutz.css` (Einbindungsort)
* [x] Mitgefixt: überlappende Höhenregeln am CTA-Container (`max-height:700px` → `mt-2.5`,
      `max-height:900px` → `mt-4`). Tailwind gibt die 900er-Regel später aus, unter 700 px
      gewann sie — der engere Abstand aus der Doku vom 2026-07-24 war nie wirksam. Jetzt
      `min-height:701px and max-height:900px`. Suche über alle Komponenten nach demselben
      Muster: kein weiterer Fall (Gegenprobe am alten Stand findet genau diesen)

**Referenzen:**
`components/TargetGroupCards.tsx`
`components/ZielgruppenPartner.tsx`
`styles/zielgruppen.css`

### ✅ Phase 3 — Nachweis
* [x] `npm run zielgruppen`: **15/15 Fenster ohne Befund** (vorher 23 Befunde)
* [x] **Gegenprobe** — `allowNestedScroll` kurz auf `false`, gebaut, gemessen: **8 Befunde**
      („Mausrad erreicht die Liste nicht", „Kartentext per Mausrad nicht erreichbar"). Der
      Wächter schlägt also an; Einstellung zurückgesetzt, neu gebaut
* [x] Vorher/nachher außerhalb der Startseite (Probe): Karten-Texte auf `/karriere`
      (7 Karten, 73–163 px verdeckt) — vorher lief das Rad am Text vorbei auf die Seite
      (`scrollTop 0`, Seite +298 px), jetzt scrollt erst der Text (73 px), dann die Seite.
      Anfragedialog in 1280 × 480 (104 px Überlauf, Lenis gestoppt): vorher `scrollTop 0`,
      jetzt 104
* [x] `npm run build` grün (29/29 Routen, Typecheck sauber), neue Regeln im ausgelieferten
      CSS nachgewiesen (`@import` ging schon einmal still verloren)
* [x] `npm run kontrast`, `npm run nav`, `npm run meta` — Ergebnisse unten
* [x] Aufnahmen `output/zielgruppen/*.png` (15 Fenster × 2 Karten)

**Referenzen:**
`output/zielgruppen/final.txt`
`output/zielgruppen/gegenprobe-ohne-nested.txt`
`hooks/useSmoothScroll.ts`

## Messung vorher / nachher

„sofort" = ohne jedes Scrollen vollständig lesbar (Treffertest). „+n" = per Mausrad in der
Liste erreichbar. „frei" = Seitenscroll, bis die nächste Karte die Liste anschneidet.

| Fenster | Versicherer vorher | Versicherer nachher | Autohäuser vorher | Autohäuser nachher |
| --- | --- | --- | --- | --- |
| 1920 × 1080 | 18/32, frei 210 px | **32/32**, frei 450 px | 5/5 | 5/5 |
| 1920 × 945 | 12/32, frei 150 px | **32/32**, frei 290 px | 5/5 | 5/5 |
| 1920 × 913 | 12/32, frei 120 px | 30 + 2, frei 290 px | 5/5 | 5/5 |
| 1745 × 830 (Zoom 110 %) | **ausgeblendet** | 30 + 2, frei 280 px | **ausgeblendet** | 5/5 |
| 1536 × 730 (125 %) | **ausgeblendet** | 18 + 14, frei 240 px | **ausgeblendet** | 5/5 |
| 1440 × 900 | 12/32, frei 70 px | 16 + 16, frei 270 px | 5/5 | 5/5 |
| 1440 × 790 | **ausgeblendet** | 12 + 20, frei 260 px | **ausgeblendet** | 5/5 |
| 1366 × 657 | **ausgeblendet** | 14 + 18, frei 230 px | **ausgeblendet**, Text 24 px abgeschnitten | 5/5 |
| 1280 × 593 (150 %) | **ausgeblendet** | 10 + 22, frei 190 px | **ausgeblendet**, Text 88 px abgeschnitten | 5/5 |
| 1024 × 700 Tablet | **ausgeblendet** | 10 + 22 | **ausgeblendet** | 4 + 1 |
| 960 × 945 Maus | 24/32, **8 unerreichbar**, Kartentext 150 px über, frei 40 px | **32/32** (5 Spalten), frei 320 px | 5/5 | 5/5 |
| 768 × 954 Tablet | 24 (32 nach Kartenscroll) | **32/32** (4 Spalten) | 5/5 | 5/5 |
| 390 × 844 | 8 (32) | 8 (30) | 2 (5) | 2 (5) |
| 390 × 664 | 0 (18) | 0 (18) | 0 (5) | 0 (5) |
| 360 × 640 | 0 (14) | 0 (12) | 0 (5) | 0 (5) |

Auf dem Telefon ist der Zugang unverändert (Wischen im Kartentext); neu sind dort der Verlauf
an der Unterkante, die Anzahl im Titel und die Verweilstrecke. Tablet und halbes Fenster
zeigen alle 32 sofort, seit die Spaltenzahl ab 640 px automatisch ist. Die mobilen „nachher"-Zahlen nach
Kartenscroll sind wegen der 12-px-Schrift um bis zu zwei Namen kleiner — der Rest folgt
beim Weiterwischen.

## Kommentare

### Phase 1
**Eingehalten:** gemessen statt geschätzt ✅, Pflichtfrage vor dem Wächter beantwortet ✅, reale Fensterhöhen statt Auflösung ✅, Maus und Touch getrennt ✅, unter 700 Zeilen (390) ✅, kein `npm run dev` ✅
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch (Ursache):** Partnerlisten auf Full HD mit Zoom sowie auf allen gängigen
   Laptops **komplett ausgeblendet** — die Ausblendung war 2026-07-24 als Abwägung
   dokumentiert, aber nur an 1366 × 768 gedacht, nicht am Full-HD-Browser mit Leisten.
2. 🟠 **Hoch:** Mausrad erreichte keinen überlaufenden Kartentext (Lenis) — 8 Versicherer
   im halb angedockten Fenster unerreichbar. Betraf auch `/karriere` und den Dialog (Phase 3).
3. 🟡 **Mittel (eigene Messfehler, vor der Wertung behoben):** Treffertest an runden Ecken,
   Schriftgröße am falschen Element, danach ein Radtest, der die gewollte Übergabe an die
   Seite als Fehler wertete. Alle drei hätten falsche Befunde erzeugt.

### Phase 2
**Eingehalten:** CSS-native vor JS (Maske per Scroll-Zeitleiste, keine Listener) ✅, Mobile-First (mobil unverändert zugänglich, nur ergänzt) ✅, 700-Zeilen-Regel (index.css 688 → 637, TargetGroupCards 510 → 442) ✅, Radius-Regel (`--gap` in allen Stufen gleich) ✅, bestehende Kommentar-Begründungen fortgeschrieben statt gelöscht ✅, kein Mojibake ✅
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch (von mir verursacht am 2026-09-16, gefixt):** Die Paket-1-Sicherung unter
   `output/` enthält `.tsx`-Dateien; `tsconfig.json` hatte kein `exclude` → `tsc --noEmit`
   meldete 20+ Fehler, `npm run build` wäre rot gewesen. `exclude: node_modules, dist, output`.
2. 🟠 **Hoch (gefixt):** Scroll-Verlauf der ersten Fassung blendete bei 1 px Überlauf die
   letzte, voll sichtbare Zeile aus (auf 1920 × 945 sichtbar).
3. 🟡 **Mittel (gefixt):** `text-2xl` bringt 32 px Zeilenhöhe mit — zweizeilig 64 px in einer
   60-px-Titelzeile. `leading-tight` in der kompakten Stufe ergänzt.
4. 🟡 **Mittel (Bestand seit 2026-07-24, gefixt):** Tote Höhenregel am CTA-Container — zwei
   überlappende `max-height`-Varianten, die spätere im CSS gewann immer. Kostete in der
   flachen Stufe 6 px, die jetzt der Liste zugutekommen.
5. 🟡 **Mittel (gefixt):** Im halben Fenster standen die 32 Versicherer in zwei Spalten auf
   856 px Breite — Spaltenzahl jetzt ab `sm` automatisch.
6. 🟢 **Niedrig (gefixt):** veralteter Kopfkommentar in `styles/textschutz.css`.

### Phase 3
**Eingehalten:** Gegenprobe gegen den eigenen Wächter ✅, Behauptungen im Code-Kommentar nachgemessen statt aus dem Quelltext abgeleitet ✅, frischer Build vor jeder Messung ✅, abgebrochener Zwischenlauf samt Restprozessen beendet (nur Mess-Ports 4183–4189, Dev-Server 3007 unberührt) ✅
**Auffälligkeiten (nach Schwere):**
0. 🟠 **Hoch (von mir verursacht am 2026-09-16, gefixt):** `pruefe_html.py` brach in einer
   Windows-Konsole (cp1252) bei der ersten `→`-Zeile ab — genau der Aufruf, den die
   Folgepunkte für nach dem Merge empfehlen. Ausgabe fest auf UTF-8.
1. 🟠 **Hoch (Nebenbefund, durch `allowNestedScroll` mitbehoben):** `/karriere` — sieben
   Karten-Texte waren per Mausrad nie erreichbar; der Anfragedialog ließ sich in Fenstern
   unter 536 px Höhe nicht per Rad scrollen.
2. 🟡 **Mittel (entschieden 2026-09-17: bleibt so):** Mobil sind die Partner auf kurzen
   Telefonen erst nach einem Wisch im Kartentext zu sehen — der Kartenstapel lässt dort nicht
   mehr Platz. Der User hat die Variante ohne Stapel abgelehnt („mobil so lassen").
3. 🟢 **Niedrig (offen, Folgepunkt):** Das exportierte `parallax-scroll-kit/` hat dieselbe
   Lenis-Einstellung noch nicht — es läuft gespiegelt in einem anderen Projekt.

## Messwerte der übrigen Werkzeuge (2026-09-17)

Alle am selben, endgültigen Build (`output/zielgruppen/*.txt`):
* `npm run build`: grün, Typecheck sauber, 29/29 Routen, 236 FAQPage-Texte, keine unbekannten Platzhalter
* `npm run zielgruppen`: **15/15 Fenster ohne Befund**
* `npm run kontrast`: 5197 Textstellen (29 Routen × 2 Breiten × 4 Positionen), **0 unter WCAG AA**
  — zwei mehr als am 2026-09-16, das sind die neuen Anzahlen im Listentitel
* `npm run nav`: **16/16**
* `npm run meta`: **0** Titles/Descriptions außerhalb des Korridors
* Paket-2-Prüfung `pruefe_html.py`: **37/37** (`docs/preise-partner-schadenlink/pruefung/ergebnis-2026-09-17.txt`)
* Kodierung: 19 angefasste Dateien ohne Mojibake
