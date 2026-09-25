# Liquid-Glass-Buttons mit Kartenvignette — Pilot „Anrufen"

**Auftrag (User, 2026-09-24, nach Abnahme der beschrifteten Aussparung):** „Nun ändere mir bitte das
Buttondesign in liquid glass. Sowohl auf der Desktoppage als auch Mobil. Aber mach das Liquid Glass
bitte mit der farblichen Vignette wie es auch bei den Bilderkarten hinterlegt ist … Beginne bitte mit
einem CTA Button (Anrufen), wenn mir das gefällt passen wir das auf alles an."

**Vorgaenger:** `docs/startseite-karten-aktionen/tasks/2026-09-24-aussparung-beschriftete-aktionen-tasks.md`
(beschriftete Pillen oben rechts, Live-Status, mobile Leiste mit Punkt).

## Ausgangslage (gelesen, nicht geschaetzt)

* **Kartenvignette** `.cc-karten-vignette` (`styles/karten.css`): Ellipse `farthest-corner`, Mitte frei
  bis 52 %, dann Schwarzblau `--cc-cta-blue-rgb` (62 80 100) mit 0,32 bei 78 % und 0,74 am Rand; dazu
  innen ein 1-px-Ring (0,55) und ein 22-px-Saum (0,58). Genutzt von `ExpandingCardAccordion`,
  `ScrollPinnedProcess`, `TargetGroupCards`.
* **Vorhandenes „Liquid Glass"** `.cc-glass-button` (index.css): Weiss-Tinte 0,12 + `blur(14px)` +
  Glanzverlauf + Lichtkante — ausdruecklich NUR fuer dunkle Untergruende (Hero). Auf Weiss
  „kontrastarm, liest sich wie deaktiviert" (Kommentar dort).
* **Masterplan-Leitlinie:** „Liquid Glass / Premium Light-Mode-Aesthetik beibehalten".
* **Untergruende der beiden Anrufen-Knoepfe:**
  - Desktop: Pille in der WEISSEN Aussparung (fest, Hintergrund steht) — dahinter gibt es nichts zu
    brechen oder zu verwischen.
  - Mobil: Kachel in der Leiste `fixed bottom-0` UEBER dem Seiteninhalt (Fotos, weisse Sektionen).
* **Performance-Vorgeschichte:** `backdrop-filter` wurde 2026-08-10 an zwei Stellen entfernt — beide
  Male auf Elementen, die sich INNERHALB des kompositierten `.site-main-shell` bewegen (sticky,
  Parallax). Die mobile Leiste liegt ausserhalb von `<main>`.

## Loesungswege (verglichen)

| Weg | Wie es aussieht | Browser | Urteil |
|---|---|---|---|
| A. `.cc-glass-button` wiederverwenden | Weiss-Tinte auf dunklem Grund | alle | verworfen — auf Weiss unsichtbar, keine Vignette |
| B. Dunkles Glas (Schwarzblau getoent, weisse Schrift) | wie getoentes Autoglas | alle | verworfen als Standard — ueber weissen Sektionen wird es grau, weisse Schrift faellt unter AA; widerspricht „Light-Mode" |
| C. **Helles Glas + Kartenvignette + Lichtkanten** (Mitte klar/gefrostet, Rand schwarzblau, Glanzrand, Lichtpunkt folgt dem Zeiger) | wie die Bildkarten, als Glaskoerper | alle (Frost ueberall) | **gewaehlt** |
| D. C + echte Lichtbrechung per SVG (`backdrop-filter: url()`) | Hintergrund biegt sich am Rand | nur Chromium | zurueckgestellt — auf der weissen Aussparung unsichtbar, auf iPhones gar nicht; als Aufwertung nach Abnahme anbieten |

## Entscheidungen
* **EIN Material** `cc-liquid` in `styles/glas.css` — damit „auf alles anpassen" spaeter eine
  Klasse ist, keine Kopie. Pilot nur an „Anrufen" (Desktop-Pille oben rechts, Kachel mobil).
* Aufbau in Schichten: Frost (`backdrop-filter`) · Vignette (Kartenwerte) · Glanzrand (Verlaufsring
  per Maske, hell oben links) · Lichtkanten innen (oben weiss, unten Kaustik) · Lichtpunkt am Zeiger
  (Desktop beim Ueberfahren, mobil beim Antippen) · weicher Schatten.
* Schrift dunkel (`--cc-carbon`), Hoerer Schwarzblau — Kontrast ueber jedem Untergrund.
* Druck: kurzes „Eindruecken" mit federndem Loslassen (Liquid-Glass-Gefuehl), ohne reduced-motion-Gate.

---

### ✅ Phase 1 — Material `cc-liquid`
* [x] `styles/glas.css` (neu, ~160 Zeilen, per @import NACH `aussparung.css`): Frost `blur(12px)
      saturate(180%)`, Koerper weiss → Eisblau (Licht sammelt sich unten; ohne den Ton war die Pille
      auf der weissen Aussparung „weisser Kunststoff" — erste Aufnahme), Vignette mit den Kartenwerten
      (Saum 8 px Pille / 12 px Kachel statt 22 px), Glanzrand per Masken-Ring, Lichtkante oben +
      Kaustik unten, schwarzblauer Schatten, Druck mit federndem Loslassen
* [x] Lichtpunkt: `lib/glasLicht.ts` (kein Hook noetig — reine Handler, setzen `--glas-x/-y` direkt am
      Element, kein React-Neuzeichnen), per `@property` gleitend. Auf dem hellen Koerper kaum sichtbar
      (Bild) → zusaetzlich leuchtet der **Glanzrand am Zeiger** auf — so faengt echtes Glas Licht
* [x] Fokus als `outline` + Schatten als Variable `--liquid-schatten`: Der `box-shadow`-Fokusring der
      Aussparung haette Vignette und Lichtkanten beim Tabben geloescht

### ✅ Phase 2 — Pilot „Anrufen"
* [x] Desktop: Telefon-Pille in `AktionsAussparung` → `cc-liquid` + `{...glasLicht}`, Symbol als
      Glasperle, Hoerer Schwarzblau
* [x] Mobil: „Anrufen" in `MobileStickyCTA` → `cc-liquid cc-liquid--kachel`, dunkle Schrift, Live-Punkt
      bleibt; die drei anderen Kacheln bewusst unveraendert (Vergleich fuer den User)
* [x] Rueckweg ohne Suchen: Klasse + `{...glasLicht}` entfernen genuegt — die Eisblau-Regeln der Pille
      stehen noch in `aussparung.css` und werden nur ueberstimmt (Optimierungsplan L1)

### ✅ Phase 3 — Pruefen
* [x] Aufnahmen aus dem Produktions-Build: 1920/1440 in Ruhe und mit Maus, mobil 390 ueber Foto und
      ueber Weiss (`liquid-glass-pilot.png`); Lichtpunkt links/rechts/Ruhe im Zoom (3x)
* [x] **Pixelprobe angepasst** (`check-aussparung.mjs`, Falle 8): einheitlich „kein Probenpunkt fast
      Weiss" (dunkelster Kanal ≤ 235). Gemessen: Glas 37–89 Stufen unter Weiss, dunkle Pille ~210,
      eingespielter z-Index-Fehler 0. Die alte Regel haette das Glas als „helle Stelle" gemeldet
* [x] `npm run build` 29/29 · `npm run kontrast` **5438 Stellen, keine unter AA** (Glas-Beschriftungen
      Desktop 1440 und mobil 390 mitgemessen) · `npm run aussparung` 5 Routen × 3 Fenster + Geometrie
      23 Breiten **gruen** · `--gegenprobe` **4/4** (z-Index-Fehler an der Glas-Pille erkannt) ·
      `npm run nav` **16/16**

### ✅ Phase 4 — Dokumentation
* [x] Kommentare unten, Optimierungsplan `2026-09-24-liquid-glass-anrufen-optimierung-tasks.md`

### ✅ Phase 4b — Zweite Fassung: Original-Liquid-Glass ohne Vignette (2026-09-25)
**Auftrag (User, mit Referenzbild einer dunklen Liquid-Glass-Tableiste):** „Versuch das bitte so zu
machen und mach diese Vignette weg. Uebernimm nicht die Farben, sondern wirklich nur das blurry
Design eines originalen Liquid Glass Designs. Auch wieder nur fuer den Anrufen-Button."
* [x] Referenz gelesen: starker Hintergrund-Blur, durchscheinender Koerper, duenne helle Lichtkante
      rundum (am hellsten oben links und unten rechts), hellere Glasscheibe fuer das aktive Element
* [x] `styles/glas.css` neu: Vignette ENTFERNT; Frost `blur(20px) saturate(180%)`; neutrale Tinte
      (Weiss 0,55 → 0,38 ueber einem Hauch kuehlem Grau, damit das Glas auf Weiss sichtbar bleibt);
      Linsenrand heller statt dunkler; Lichtkante 1,5 px (oben links/unten rechts hell); neutrale
      Schatten + Haarlinie; Symbol-Plakette als hellere Glasscheibe; Hoerer und Schrift neutral dunkel
* [x] 🟠 **Im Bild gefunden: beim Ueberfahren wurde die Pille blau.** `.cc-aktion--telefon:hover`
      (Eisblau, aussparung.css) ist spezifischer als `.cc-liquid` und setzte Hintergrund, Rand und
      Schatten. ✅ `.cc-liquid:hover` setzt alle drei jetzt selbst (gleiche Spezifitaet, spaeter eingelesen)
* [x] 🟠 **Pixelprobe → Differenzprobe** (`check-aussparung.mjs`, Falle 8): Das neutrale Glas liegt
      auf Weiss nur 4–9 Stufen unter Weiss; ein darueber gemalter Schatten aenderte es um ~8. Jetzt
      je Pille: Aufnahme wie ausgeliefert gegen Aufnahme mit ausgeblendeten Uebergaengen. Gemessen:
      richtig 0 px (sporadisch ≤ 56 px Rasterrauschen im Hoerer — auch zwischen zwei gleichen
      Aufnahmen), eingespielter Fehler 397–583 px → Schwelle 150 px. Unabhaengig von der Pillenfarbe
* [x] Verifikation (Build 29/29): `kontrast` **5438 Stellen, keine unter AA** · `aussparung` 5 Routen
      × 3 Fenster + Geometrie 23 Breiten **gruen** · `--gegenprobe` **4/4** (z-Index-Fehler: 415 bzw.
      583 px Abweichung) · `nav` **16/16** · Bilder aus dem Produktions-Build (`pilot-v2`)

### ✅ Phase 5 — Abnahme: NUR die mobilen Sticky-Buttons (2026-09-25)
**Entscheidung des Users:** „Ok ich finde das gut, aber uebernimm das nun nur fuer die Sticky
Buttons in der mobilen Ansicht." → Glas an allen vier Knoepfen der Leiste unten, NICHT mehr oben
rechts am Desktop (dort liegt die Pille auf Weiss — kein Blur sichtbar, siehe L5).
* [x] `MobileStickyCTA`: Anrufen, Schaden, Termin, Route → `cc-liquid cc-liquid--kachel` +
      `{...glasLicht}`; Symbole neutral dunkel (`strokeWidth 2.2`); `.cc-gradient-button` dort entfallen
* [x] Desktop-Pille oben rechts zurueck auf Eisblau (Klasse und `glasLicht` entfernt — die Altregeln
      standen dafuer bewusst noch in `aussparung.css`, L1)
* [x] `glas.css` aufgeraeumt: Plakette und Aussparungs-Fokusregel entfernt (nur Desktop), Kopf auf
      „nur mobile Leiste"; neu: Aktiv-Zustand `[aria-expanded='true']` fuer „Route", solange die
      Auswahl Apple/Google offen ist — erst heller (wie im Referenzbild, auf hellem Glas unsichtbar),
      dann „eingedrueckt" (dunklerer Innenring, Hauch dunklere Toenung), im Bild klar erkennbar
* [x] Verifikation (Build 29/29): `kontrast` **5433 Stellen, keine unter AA** (alle vier Glas-
      Beschriftungen mobil an jeder Messposition) · `aussparung` + Geometrie **gruen** ·
      `--gegenprobe` **4/4** · `nav` **16/16** · `zielgruppen` **alle Karten in Ordnung** ·
      Bilder aus dem Produktions-Build (ueber Foto, ueber Weiss, Hero, Route offen, Desktop)

### ⏸️ Phase 6 — Offen nach der Abnahme (zurueckgestellt, braucht Geraet bzw. Entscheidung)
* [ ] **Android-Test** (L2): vier `backdrop-filter`-Flaechen auf der festen Leiste an einem echten
      Mittelklasse-Android scrollen. Ruckelt es: `blur(20px)` → `blur(10px)` in `styles/glas.css`
* [ ] **Knoepfe im Route-Fenster** (L7): „Apple Karten" / „Google Maps" noch im dunklen Verlauf —
      Rueckfrage an den User: mit auf Glas oder bewusst dunkel lassen?
* [ ] Optional **echte Lichtbrechung** (L3, nur Chromium) — nur auf Wunsch des Users

**Referenzen:**
`styles/glas.css`
`components/MobileStickyCTA.tsx`
`scripts/check-aussparung.mjs`
`docs/liquid-glass/tasks/2026-09-24-liquid-glass-anrufen-optimierung-tasks.md`

---

## Kommentare

### Phasen 1–4
**Eingehalten**: Planung vor Code ✅, vier Wege verglichen (helles/dunkles Glas, Wiederverwendung,
SVG-Brechung) ✅, Kartenvignette mit IHREN Werten statt nachempfunden ✅, gemessen statt geschaetzt
(Pixelwerte der Probe, Kontrast, Bilder in drei Zustaenden) ✅, Mobile-First (Leiste ueber Foto und
Weiss geprueft) ✅, unter 700 Zeilen ✅, Pilot rueckbaubar mit zwei Zeilen ✅, kein reduced-motion-Gate ✅,
kein `npm run dev` gestartet ✅, UTF-8 ✅

**Auffaelligkeiten (nach Schwere):**
1. 🟠 **Hoch — Die Pixelprobe haette das Glas als Fehler gemeldet** (Verlaufsbild galt als „dunkle
   Pille"). ✅ **fixed**, kalibriert an gemessenen Werten. **Eigenfehler dabei gefunden, bevor er lief:**
   die erste Fassung der neuen Regel nahm den HELLSTEN statt des dunkelsten Kanals — ein sattes Hellblau
   (230,241,255) haette als Weiss gegolten. Lehre: „fast Weiss" heisst ALLE Kanaele nahe 255.
2. 🟡 **Mittel — Fokusring haette das Glas geloescht** (Ring im `box-shadow`). ✅ **fixed** (outline).
3. 🟡 **Mittel — Glas auf Weiss wirkte zuerst wie weisser Kunststoff.** ✅ **fixed** (Eisblau im Koerper).
4. 🟢 **Niedrig — Lichtpunkt auf hellem Glas kaum sichtbar.** ✅ **fixed** (Glanzrand folgt dem Zeiger);
   bleibt bewusst dezent — Urteil des Users abwarten.
5. 🟢 **Niedrig — `backdrop-filter` auf der festen Leiste ueber dem kompositierten `<main>`**: hier nicht
   messbar, ob schwache Android-Geraete ruckeln. Auf echtem Geraet pruefen, bevor alle vier Kacheln
   Glas bekommen (L2).
