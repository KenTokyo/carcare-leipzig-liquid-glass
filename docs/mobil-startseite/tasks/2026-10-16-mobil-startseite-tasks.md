# Startseite mobil: flüssige Karten, Hintergrundfoto, gleich hohe Ablaufkarten, ein Farbton

**Angelegt:** 2026-10-16 · **Branch:** `2026-10-06-lektorat`
**Auftrag des Users (gekürzt):** Auf dem Samsung Galaxy A56 klappen die Karten der Startseite (Leistungen und
Autoaufbereitung) „mit Low Performance“ auf, „nicht so schön weich“. Das Hintergrundfoto, das am Desktop als weicher
Übergang hinter den Karten steht, fehlt mobil: bitte überall so wie am Desktop. Schritt 1 unter „Unfallschaden? …“ hat
eine größere Textkachel als die Schritte 2 bis 5: angleichen. Den Ratgeber unter „Autoaufbereitung“ mobil komplett
herausnehmen. Hinter der FAQ (und bei Autoaufbereitung) steht ein anderer Farbton als sonst: durchgehend ein Ton.

**Status:** Phasen 1–5 umgesetzt und gepusht (16.10., `963f741`). Rückmeldung vom A56 am selben Abend → Phasen 6–9
umgesetzt und gepusht (`5147fa8`). Dritte Rückmeldung (Foto hinter den Karten, Titelgröße, Hero im iPhone) →
Phasen 10–13 (Abschnitt „Dritte Rückmeldung“). R29 (Hero unter 640 px Höhe) am 17.10. nach Wahl des Users umgesetzt
→ Phase 14. Sichtabnahme auf A56 und iPhone steht aus. Optimierungsplan:
`2026-10-16-mobil-startseite-optimierung-tasks.md`.

### Phasen 6–9 (Rückmeldung vom A56)
**Eingehalten:** Ursache je Rückmeldung gemessen statt vermutet (Bahn je Bild, Ablation mit und ohne Foto, mit und
ohne vorab angelegte Ebenen) ✅, Lösungswege verglichen ✅, Kontrast gerechnet und gemessen samt Gegenprobe ✅, Prüfwerkzeug
um die neuen Fehlerarten erweitert samt Gegenprobe ✅, Desktop unverändert ✅, unter 700 Zeilen ✅.
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch (behoben):** Meine Phase 1 verließ sich auf die Scroll-Verankerung des Browsers („Koordinaten des
   Akkordeons“). Die setzt bei Transform-Animationen aus; die getippte Karte wuchs nach oben aus dem Bild. Mein
   Funktionstest hatte die offene Karte immer im Bild und konnte das nicht sehen. Jetzt eigene Verankerung und ein
   hartes Kriterium im Werkzeug.
2. 🟠 **Hoch (behoben):** Projektweite Tipp-Hervorhebung (`index.css`) über dem sofort hohen Link-Kasten.
3. 🟠 **Hoch (behoben):** Textschutz am stehenden Foto statt am Kopf.
4. 🟡 **Mittel (behoben):** Der Unterbrechungstest tippte auf ein vorab festgelegtes Ziel, das nach dem Wegschieben
   außerhalb des Fensters lag (Tipp ins Leere, Test zeigte trotzdem grün an einer anderen Stelle).
5. 🟢 **Niedrig (Hinweis):** Erster Tipp nach dem Laden im Kopflosen 104–117 ms Bildlücke im GPU-Prozess; auf dem Gerät
   nicht gemessen.

---

## Analyse (gemessen, nicht geschätzt)

Messaufbau: Puppeteer gegen `dist/` (`vite preview`), Fenster 393 × 851 bei Pixeldichte 2,75 (Galaxy-A-Klasse),
Touch, CPU 4-fach gedrosselt, echter Tipp (`touchscreen.tap`) auf eine eingeklappte Karte, Chrome-Trace des
Hauptthreads. Skripte im Scratchpad dieser Sitzung (`ruckeln-messung.mjs`, `ruckeln-varianten.mjs`,
`invalidierung.mjs`, `clip-experiment.mjs`, `komposit.mjs`).

| Befund | Messung |
|---|---|
| Hauptthread beim Aufklappen fast voll ausgelastet | 4×: 615–675 ms Arbeit in 700 ms Animation, **16–18 ms je Bild**; Leerlauf ohne Tipp: 107 ms |
| Kosten verteilt, nicht Layout | je Tipp 4×: Stil 175–220 ms, Malen 180–200 ms, Ebenenaufbau 145–160 ms, Layout nur 30–35 ms, Framer-JS 25 ms |
| Jedes Bild malt die ganze Seite neu | `#document` 393 × 13.321 px: 52 Malvorgänge in 800 ms (1 je Bild), dazu jede eingeklappte Karte einzeln |
| Einzelne Ebenen sind nicht schuld | Ablation (je 6 Tipps): ohne Scroll-Verlauf, Schatten, Glas, Vignette, KI-Plakette, Bildzoom, Bilder, mit `contain`, mit eigenen Ebenen: alle 14–18 ms je Bild, kein Gewinn |
| Seitengröße zählt nur zu einem Drittel | nur die Leistungssektion sichtbar: 10,9 statt 16 ms je Bild |
| Ursache | Framer animiert `height` zweier Karten: **jedes Bild ändert das Layout**, danach Stil, Malen und Ebenenaufbau der ganzen Seite. Solange die Höhe pro Bild wechselt, bleibt das teuer, egal was in der Karte steckt (fester Karteninhalt getestet: kein Gewinn) |
| Gerät | Galaxy A56: 120-Hz-Anzeige, Chrome rechnet dort mit 8,3 ms je Bild. Bei rund 2,5-mal langsamerer CPU als der Messrechner liegen 4 ms (ungedrosselt) je Bild schon darüber |

**Lösungswege verglichen:**
1. Einzelne teure Ebenen entfernen (Schatten, Glas, Masken): gemessen wirkungslos, siehe Ablation.
2. `content-visibility: auto` für die übrigen Sektionen: 14 statt 16 ms, zu wenig; berührt dazu Suche, Lektorat, Anker.
3. Framer-`layout`-Animation (FLIP mit Skalierung): verzerrt Text, Bild, Schatten und Rundungen, braucht Korrektur
   an jedem Kind per JS je Bild.
4. `clip-path` animieren: läuft in Chrome nicht sicher auf dem Compositor (Stand 2026 noch im Ausrollen, crbug 40503852).
5. **Gewählt:** Höhe springt einmal, die Bewegung läuft nur noch über `transform` (Web Animations API, Compositor):
   Nachbarkarten gleiten, ein „Fenster“ mit festem Inhalt wird per Gegenverschiebung aufgezogen (Fenster nach oben,
   Inhalt nach unten, gleiche Kurve). Kein Layout, kein Malen pro Bild. Desktop bleibt unverändert (`flexGrow`).

**Weitere Befunde:**
- Farbton: `bg-gray-50/70` (Eisblau `#f5f8fc` zu 70 %) an Leistungen, Autoaufbereitung und FAQ der Startseite; alle
  übrigen Startseiten-Sektionen sind weiß. Am Desktop deckt das Foto den Ton bei Leistungen und Aufbereitung zu, mobil
  nicht. Die FAQ trägt ihn überall.
- Schritt 1 (Unfall) und Schritt 2 (Aufbereitung) tragen als einzige einen Knopf in der Textkachel. Mobil steht
  dieselbe Aktion in der festen Leiste („Schaden“, „Termin“).
- Hintergrundfoto mobil: `ExpandingCardAccordion` meldet unter 1024 px bewusst `null`, `ScrollPinnedProcess` blendet
  es mit `hidden lg:block` aus. Ein Querformatfoto füllt eine 393 × 1.500 px hohe Sektion nur als stark gezoomter
  Mittelstreifen; deshalb mobil als stehendes Foto in Fensterhöhe (wie `BackdropLayout`).

---

### ✅ Phase 1 — Karten mobil ohne Layout pro Bild
**Ziel:** Aufklappen der Leistungs- und Aufbereitungskarten (und der Stellenkarten, gleiche Komponente) mobil nur per
Compositor; Desktop unverändert.
* [x] `ExpandingCardAccordion`: mobil Fenster (`data-akk="fenster"`, schneidet zu, trägt den Schatten) und Inhalt
  (`data-akk="inhalt"`) in Höhe der offenen Karte, Bildebene (`data-akk="bild"`) eingeklappt um die halbe Differenz
  höher (Streifen zeigt die Bildmitte). Ruhelage per Inline-Transform. Zwei Schleier: 64-px-Streifen (eingeklappt)
  und groß (aufgeklappt), am Desktop nur der große. Framer animiert nur noch am Desktop (`flexGrow`); mobil hatte das
  animierte `flexGrow` ohne sichtbare Wirkung je Bild ein Layout ausgelöst.
* [x] `components/akkordeonMobil.ts` (neu, 120 Zeilen): FLIP per Web Animations API, Messung vor dem Wechsel
  (`messen()` im Ereignis), Start im `useLayoutEffect`, Koordinaten relativ zum Akkordeon (Scroll-Verankerung egal),
  unterbrechbar (misst die laufende Lage), bricht beim Wechsel auf Desktop ab.
  ⚠️ **Korrigiert in Phase 6:** „Scroll-Verankerung egal“ war falsch. Sie setzt bei Transform-Animationen aus, die
  getippte Karte wuchs dann nach oben aus dem Bild. Seither Fensterkoordinaten mit eigener Verankerung.
* [x] **Gemessen (Build 16.10. 18:42, 393 × 851, DPR 2,75, CPU 4×, je 6 Tipps):**

  | | vorher | nachher |
  |---|---|---|
  | Hauptthread je Animationsbild | 16–18 ms | **4–5 ms** |
  | Bilder in 700 ms (Kopflos, ohne Vsync) | 39–42 | **105–150** |
  | Layout je Tipp | 30–35 ms | **3 ms** |
  | Malen je Tipp | 180–195 ms | 57–81 ms |
  | Bilder über 20 ms je Tipp | 7–21 | **1–5** |
  | Composited-Fehlschläge | – | **0 von 24** Animationen |

  Erstes Bild nach dem Tipp (React-Neuaufbau, zwei erzwungene Layouts): 33 ms bei 4× (≈ 8 ms ungedrosselt).
* [x] Sichtprüfung 390 px: Ruhe, angehalten bei 240 ms, Ende (Scratchpad `fotos/leist-*.png`). Eingeklappte Streifen
  zeigen das Bild jetzt aus der Fassung der offenen Karte (feste Höhe), also etwas näher (Faktor ≈ 1,5 bei 3:2).
**Referenzen:**
`components/ExpandingCardAccordion.tsx`
`components/akkordeonMobil.ts`

### ✅ Phase 2 — Hintergrundfoto auch mobil
**Ziel:** Das Foto der offenen Karte bzw. des aktiven Schritts steht mobil hinter allen vier Sektionen wie am Desktop.
* [x] `PhotoBackdrop`: neue Option `mobil` (`stehend` = Foto in Fensterhöhe per `sticky`, Behälter `overflow-clip`
  statt `-hidden`, sonst haftete `sticky` am Behälter; `flaeche` = Fläche ist schon fensterhoch). Unter 1024 px eigener
  Textschutz `.cc-guard-mobil` (`styles/textschutz.css`) statt der drei Desktop-Ebenen, deren `closest-side`-Vignette
  auf Hochformat nur einen Streifen hinter den Karten freiließ. Ab 1024 px unverändert.
* [x] `ExpandingCardAccordion`: Option `mobilHintergrund` meldet das Bild auch mobil (Startseite ja, /karriere nein).
* [x] Leistungen und Autoaufbereitung: `mobil="stehend"`. Autoaufbereitung trug eine Kopie der drei Ebenen
  (gleiche Werte, inline), jetzt `PhotoBackdrop` selbst. Beide Abläufe (`ScrollPinnedProcess`): ebenfalls eine Kopie,
  bis dahin `hidden lg:block`, jetzt `PhotoBackdrop` mit `mobil="flaeche"`.
* [x] Textschutz für den schlechtesten Fall gerechnet (schwarzes Foto): bis 62 % der Höhe Weiß ≥ 78 %, `gray-600`
  5,26 : 1, `blue-600` 5,94 : 1.
* [x] `npm run kontrast -- / --sektionen` (neue Option, misst Sektionsköpfe und jeden Ablaufschritt): **981
  Textstellen, 0 unter AA**. **Gegenprobe:** Textschutz testweise auf 10 % → gemeldet: Leistungen (4,36 : 1),
  Autoaufbereitung (4,15 : 1), „Überspringen“ im Ablauf (4,09 : 1). Danach zurückgesetzt.
**Referenzen:**
`components/PhotoBackdrop.tsx`
`styles/textschutz.css`
`scripts/check-kontrast.mjs`

### ✅ Phase 3 — Ablaufkarten gleich hoch, Ratgeber mobil weg, ein Farbton
* [x] Knopf in der Textkachel („Schaden melden“, „Termin anfragen“) erst ab 1024 px; mobil steht dieselbe Aktion in der
  festen Leiste („Schaden“, „Termin“). Link bleibt im HTML.
* [x] Zusätzlich alle Textkacheln eines Ablaufs mobil gleich hoch: `--kachel-hoehe` = höchster Inhalt
  (`data-kachel-inhalt`, ResizeObserver), sonst sprang die weiße Fläche beim Überblenden (zweizeilige Titel).
  **Gemessen (Build 19:01):**

  | Fenster | Unfall vorher (ohne Knopf, Schritt 1–5) | Unfall nachher | Aufbereitung nachher |
  |---|---|---|---|
  | 360 × 640 | 219 / 219 / 244 / 244 / 221 | 5 × 244 | 5 × 198 |
  | 390 × 844 | 196 / 196 / 196 / 196 / 221 | 5 × 221 | 5 × 176 |
  | 430 × 932 | 196 / 196 / 196 / 196 / 198 | 5 × 198 | 5 × 151 |
  | 1440 × 900 | 274 / 216 / 216 / 216 / 224 | unverändert | unverändert |

  Mit Knopf war Schritt 1 mobil rund 60 px höher als Schritt 2.
* [x] Ratgeber-Zeile unter Autoaufbereitung: `hidden lg:flex`. Die fünf Links bleiben im vorgerenderten HTML
  (SEO-GEO §4.4), mobil über „Wissen“ in der Navigation erreichbar.
* [x] Weiß statt Eisblau: `ServiceGrid`, `AutoDetailingExpertiseSection`, `FAQSection` (Standard; die Artikelseiten
  setzen schon `bg-white`). Damit sind alle Sektionen der Startseite weiß.
**Referenzen:**
`components/ScrollPinnedProcess.tsx`
`components/AutoDetailingExpertiseSection.tsx`
`components/FAQSection.tsx`

### ✅ Phase 4 — Prüfwerkzeug `npm run akkordeon` und dabei gefundener Lenis-Fehler
* [x] `scripts/check-akkordeon.mjs` (neu): je Akkordeon (Startseite ×2, /karriere) Layout-Läufe in 700 ms nach einem
  echten Tipp (hart ab 15; vorher 29–40, jetzt 5–9), Animationen abseits des Compositors (hart), Ruhelage nach Tipp und
  nach Unterbrechung (hart), getippte Karte im Bild (hart), Hauptthread-Zeit je Bild (Hinweis). Pflichtfrage im Kopf
  beantwortet (5 Punkte). **Gegenprobe** `--gegenprobe` (Höhen-Transition per CSS): 3 von 3 gemeldet (80 Layouts).
* [x] **Gefunden dabei (Altfehler):** Auf /karriere klappte der erste Tipp eine Stellenkarte auf UND scrollte rund
  7.000 px zum Formular. Ursache: Lenis' Anker-Handler (`anchors: true`) fragt `defaultPrevented` nicht ab, die Karten
  zeigen auf `/karriere#bewerbung`. Behoben in `hooks/useSmoothScroll.ts`: eigener Handler am `window` mit derselben
  Bedingung plus `defaultPrevented` und schlichtem Linksklick. Geprüft: zweiter Tipp scrollt sanft zu `#bewerbung`,
  Anker auf /kontakt gleitet (0 → 917 → 1256 → … → 1531).
**Referenzen:**
`scripts/check-akkordeon.mjs`
`hooks/useSmoothScroll.ts`

### ✅ Phase 5 — Gegenprobe aller Werkzeuge gegen den Endstand (Build 16.10.2026, 19:24:36)
* [x] Build grün (29/29 Routen, 0 Gedankenstriche), `tsc` ohne Fehler.
* [x] `npm run akkordeon`: 0 Befunde. Layouts je Tipp 7 / 8 / 5 (Leistungen / Autoaufbereitung / Stellen), 0 Animationen
  abseits des Compositors, Hauptthread 5,3 / 3,2 / 2,5 ms je Bild (4×). Gegenprobe 3/3.
* [x] `npm run kontrast`: 29 Routen, 6.283 Textstellen, 0 unter AA. `-- / --sektionen`: 982 Textstellen, 0 unter AA.
* [x] `npm run mobil`: 29 Routen × 3 Fenster, 0 harte Befunde; 257 Hinweise „Schrift unter 12 px“ wie am 15.10. (keine
  neuen). Fußzeile 926 / 863 / 848 px statt 899 / 848 / 848: kommt vom EU-Link der parallelen Sitzung (R22), nicht von hier.
* [x] `npm run aussparung`: 29 Routen × 3 Fenster, Geometrie an 23 Breiten in Ordnung. `npm run tote-dateien`: keine.
* [x] Funktion (Scratchpad): Ruhelage, Abstände 10 px, Unterbrechung, zweiter Tipp folgt dem Link (beide Sektionen);
  Anker gleiten weiter (/kontakt, /karriere#bewerbung); Kachelhöhen wie in Phase 3.
* [x] Bildschirmfotos 390 px: Leistungen (Kopf, Kartenspalte), Unfall Schritt 1, Autoaufbereitung (ohne Ratgeber),
  Aufbereitungsablauf Schritt 2, FAQ; 1440 px: Leistungen (unverändert gegen `output/shots/start`); /karriere Stellen.
* [x] **Sichtabnahme auf dem Galaxy A56 durch den User** (nach Push auf die Vorschau): erledigt am 16.10. abends,
  Rückmeldung führte zu den Phasen 6–9. Kopfloses Chrome misst den Hauptthread, nicht GPU und Anzeige des Geräts.
**Referenzen:**
`scripts/check-akkordeon.mjs`
`scripts/check-kontrast.mjs`

---

## Rückmeldung des Users nach der Sichtprüfung auf dem A56 (2026-10-16, abends)

> „immer wenn ich auf eine Karte draufklicke, … dass auf einmal die nächste Karte so ein bisschen weiß aufblitzt.
> Außerdem ist hinter den Karten anscheinend ein weißer Hintergrund mit einem Übergang … Das soll bitte da einmal raus.“
> Betrifft die Leistungsübersicht, „unten bei Autoaufbereitung funktioniert es dann wieder ganz gut“. Dazu: Titel der
> eingeklappten Karten größer und mittiger („ein bisschen weiter nach unten“).

**Analyse (gemessen, Build 19:24):**

| Befund | Messung / Beleg |
|---|---|
| **Getippte Karte wächst nach OBEN aus dem Bild**, wenn die offene Karte oberhalb des Fensters liegt (der Normalfall beim Herunterscrollen durch die zehn Leistungen; bei drei Aufbereitungskarten liegt die offene Karte meist noch im Bild) | Bahn je Bild: Oberkante 268 → −8 px, Unterkante fest bei 332, `scrollY` unverändert. Früher glich Chromes Scroll-Verankerung den Höhensprung oberhalb aus; bei laufenden Transform-Animationen setzt sie aus (Suppression bei Transform-Änderung am Anker) |
| **Tipp-Hervorhebung über den Folgekarten** | `index.css`: `a { -webkit-tap-highlight-color: Signalblau 18 % }`. Android zeichnet sie über den Kasten des Links; der ist mit der neuen Mechanik sofort 340 px hoch und liegt in den ersten Bildern über den nächsten Karten (vorher wuchs er mit). Kopfloses Chrome zeichnet die Hervorhebung nicht, Pixelvergleich daher ohne Ausschlag |
| **Weißer Schleier hinter den Karten** | `.cc-guard-mobil` hängt am stehenden Foto (Fensterhöhe): oben 12 % Weiß-Auslauf, bis 62 % Weiß 78–82 % (Textschutz), unten 14 % Auslauf. Beim Durchscrollen der langen Kartenspalte bleibt dieser Textschutz hinter den Karten stehen. Bei drei Karten (Autoaufbereitung) steht er hinter dem Kopf, wo er hingehört |
| Erster Tipp nach dem Laden: 104–117 ms Bildlücke | Auch ohne Hintergrundfoto und mit vorab angelegten Ebenen (`will-change`); Ursache im GPU-Prozess (114 ms Dawn-Worker, Shader-Übersetzung von SwiftShader). Nicht am Code steuerbar, als Hinweis notiert |
| Titel eingeklappt | 13 px, unten bündig (`items-end pb-2.5`, Mitte bei 46 von 64 px). Breite bei 17 px gemessen: alle Titel mit KI-Plakette passen einzeilig (längster 247 px bei ≥ 264 px Platz) |

**Lösungswege:** Verankerung des Browsers zulassen (setzt bei Transforms aus, nicht steuerbar) · eigene Verankerung
(gewählt: die getippte Karte bleibt stehen, Scrollposition wird im selben Bild ausgeglichen, FLIP danach in
Fensterkoordinaten) · Höhe wieder animieren (verworfen, Ursache des Ruckelns).

### ✅ Phase 6 — Getippte Karte bleibt stehen, kein Aufblitzen
* [x] `akkordeonMobil.ts`: `messen(ziel)` misst in Fensterkoordinaten; nach dem Wechsel wird die Scrollposition um den
  Versatz der getippten Karte verschoben (Lenis `scrollTo(…, { immediate, force })`), danach FLIP. Liegt die offene Karte
  unterhalb, ist der Versatz 0 und nichts scrollt.
* [x] Karten-Links mit `-webkit-tap-highlight-color: transparent` (`RAHMEN` in `ExpandingCardAccordion`).
* [x] **Gemessen (Bahn der getippten Karte je Bild, 393 × 851):**

  | Fall | vorher (Build 19:24) | nachher |
  |---|---|---|
  | A: offene Karte oberhalb des Fensters, Tipp auf 6 | Oberkante 268 → −8 px (wächst nach oben aus dem Bild) | **268 → 268**, Scroll −276 px im selben Bild, Folgekarte gleitet 342 → 618 |
  | B: offene Karte sichtbar darüber, Tipp auf 2 | 544 → 268 | **544 → 544** |
  | C: offene Karte darunter, Tipp auf 3 | – | **120 → 120**, kein Scroll |
**Referenzen:**
`components/akkordeonMobil.ts`
`components/ExpandingCardAccordion.tsx`

### ✅ Phase 7 — Kein weißer Schleier hinter den Karten
* [x] `stehend`: am stehenden Foto nur `.cc-guard-mobil-licht` (Weiß 30 %, gleichmäßig). Textschutz `.cc-kopfschutz`
  am Kopf von Leistungen und Autoaufbereitung (Pseudo-Element hinter dem Text, Sektionsoberkante bis 6rem unter den Kopf,
  fensterbreit, scrollt mit). Ausläufe ins Weiß an Ober- und Unterkante der SEKTION (`PhotoBackdrop`, außerhalb der
  stehenden Fläche). `flaeche` (Abläufe) unverändert.
* [x] Foto erst wechseln, wenn das neue dekodiert ist (`useDekodiert` in `PhotoBackdrop`, `img.decode()`): sonst stand
  beim Wechsel für einige Bilder nur der Schleier der neuen Ebene da, der Hintergrund blitzte hell auf.
* [x] Kontrast gerechnet (schwarzes Foto): Grund rgb(234), `gray-600` 6,29 : 1, `blue-600` 8,32 : 1.
  `npm run kontrast -- / --sektionen`: **982 Stellen, 0 unter AA. Gegenprobe** (Kopfschutz 10 %): 17 Stellen gemeldet,
  u. a. „Leistungsübersicht“ 2,68 : 1, Autoaufbereitung 3,05 : 1. Danach zurückgesetzt und neu gebaut.
* [x] Sichtprüfung 390 px: Kopf lesbar, Kartenspalte vor dem Foto ohne Band, Auslauf am Sektionsende.
**Referenzen:**
`components/PhotoBackdrop.tsx`
`styles/textschutz.css`
`components/ServiceGrid.tsx`

### ✅ Phase 8 — Eingeklappte Titel größer und mittiger
* [x] Schrift `clamp(15px, 4,4vw, 18px)` statt 13 px (360: 15,8 · 390: 17,2 · ab 412: 18 px), senkrecht mittig mit
  `pt-2.5` (Titelmitte 36 von 64 px statt 46), KI-Plakette eingeklappt `top-1` statt `top-2`. Desktop unverändert.
* [x] **Gemessen (echte Textzeilen gegen Plakette, 360/375/390/412/430 px, Startseite und /karriere):** 0 Überdeckungen,
  kleinster Abstand 1,8 px (bei 18 px Schrift; mit `top-1.5` waren es −0,2 px an drei Streifen bei 412/430, daher
  `top-1`). Alle Titel mit Plakette einzeilig; zweizeilig nur „Neu- und Reparaturlackierung“ bei 360 px und die lange
  Stellenbezeichnung auf /karriere, beide ohne Plakette. Die Plakette bleibt innerhalb der Kartenrundung (Ecke 12 px vom
  Rand, Bogen auf 4 px Höhe bei 10,7 px).
**Referenzen:**
`components/ExpandingCardAccordion.tsx`

### ✅ Phase 9 — Prüfwerkzeug und Gegenprobe
* [x] `npm run akkordeon`: neu hart „getippte Karte bleibt stehen“ (offene Karte oberhalb, Bahn je Bild, Grenze 2 px)
  und „keine Tipp-Hervorhebung“; Ziel der Unterbrechung wird im laufenden Bild unter den sichtbaren Karten gewählt (ein
  festes Ziel lag nach dem Wegschieben außerhalb des Fensters, der Tipp ging ins Leere). Layout-Grenze 15 → 20: jetzt
  5–13 Läufe je Tipp (Ausgleich der Scrollposition, Fotowechsel, Videostart), alt 29–40, Gegenprobe rund 80.
  **Ergebnis:** 0 Befunde; getippte Karte wandert 0,0 / 0,0 / 0,0 px. **Gegenprobe:** 3/3 Höhen-Animationen, 3/3
  Hervorhebungen gemeldet.
* [x] Funktionstest (Ruhelage, Abstände, Unterbrechung, zweiter Tipp folgt dem Link): grün.
* [x] **Gegenprobe aller Werkzeuge gegen den Endstand (Build 16.10.2026, 20:45:40):** `npm run kontrast` 29 Routen,
  6.274 Stellen, 0 unter AA (auch die Unterseiten mit stehendem Foto: `PhotoBackdrop` wechselt dort jetzt erst nach dem
  Dekodieren); `npm run mobil` 29 × 3, 0 harte Befunde, 257 Hinweise wie zuvor; `npm run aussparung` in Ordnung;
  `npm run tote-dateien` keine; Anker gleiten weiter (/kontakt, /karriere#bewerbung; eine Pause im langen Anker-Scroll
  auf /karriere liegt nicht am Hauptthread: 0 Aufgaben über 40 ms, also Rastern im Kopflosen).
* [x] **Sichtabnahme auf dem A56 durch den User** (nach Push `5147fa8`): erledigt am 16.10. spät, Rückmeldung führte
  zu den Phasen 10–13. Zum Ruckeln und Aufblitzen kam keine Klage mehr.
**Referenzen:**
`scripts/check-akkordeon.mjs`

---

## Dritte Rückmeldung des Users (2026-10-16, spät)

> „die hintergrundbilder, die bei den akkordeon hinter den karten sind doch etwas weniger prominent sein, also eine
> höhere Transparenz haben. Außerdem kann die Schrift etwas kleiner weil es zurzeit nicht ästhetisch ausschaut. …
> In der Iphone 14 Pro ansicht bei der Landingpage sind die Buttons auf der Fußzeile der Hero Sektion. Bitte mach das
> so, dass es das nicht verdeckt und die fusszeile etwas nach oben verschoben wird.“

**Analyse (gemessen, Build 16.10., 20:45):**

| Befund | Messung |
|---|---|
| Foto hinter den Karten zu präsent | Am stehenden Foto lag seit Phase 7 nur `.cc-guard-mobil-licht` mit 30 % Weiß. Verglichen 30/50/60/70 % mit dem dunkelsten Motiv (Leasingrückgabe) als offener Karte: ab 60 % tritt das Foto hinter die dunklen Karten zurück und bleibt erkennbar, 70 % wirkt grau |
| Titel zu groß | `clamp(15px, 4,4vw, 18px)` aus Phase 8 ergab 17,2 px bei 390 px und füllte den 64-px-Streifen von Rand zu Rand. Die senkrechten Titel am Desktop stehen in 15 px |
| Knöpfe über der Vertrauensleiste | Die Leiste („Dafür steht …“, vier Fakten) endet bei 668 px, die feste Leiste `MobileStickyCTA` belegt die unteren 75 px des Fensters. 393 × 659 (iPhone 14 Pro in Safari, Leisten eingeblendet): **84 px verdeckt**; 393 × 739 (Leisten ausgeblendet): 4 px; 375 × 667 (iPhone SE): 76 px; 360 × 640: 103 px; 393 × 852 (iPhone-14-Pro-Ansicht der DevTools): frei, 97 px Luft |

Die iPhone-Ansicht der DevTools zeigt das ganze Display (852 px). In Safari nehmen Adress- und Werkzeugleiste bis zu
193 px davon; `npm run mobil` maß bis dahin nur volle Bildschirmhöhen und meldete nichts (O14).

**Lösungswege:**
- Foto: Deckkraft des Bildes senken (auf Weiß gleichwertig, aber ein zweiter Regler neben dem Schleier) · Weichzeichner
  (`filter: blur` auf einer fensterhohen Ebene, kostet mobil bei jedem Fotowechsel) · **Schleier stärker** (gewählt: ein
  Wert, kein neuer Effekt).
- Titel: engere `clamp`-Grenzen (bleibt breitenabhängig) · **fest 15 px wie die Desktop-Titel** (gewählt).
- Hero: unter einer Höhe etwas ausblenden (verworfen, Vorgabe des Users: nie per Höhenabfrage ausblenden) · feste
  Leiste über dem Hero ausblenden (nicht gewünscht: der User will die Fußzeile nach oben, nicht die Knöpfe weg) ·
  Schrift verkleinern (ändert das Erscheinungsbild am stärksten) · **Abstände unter 800 px Höhe zusammenziehen**
  (gewählt, genau der Wunsch „die Fußzeile etwas nach oben“).

### ✅ Phase 10 — Foto hinter den Karten zurückgenommen
**Ziel:** Das stehende Foto hinter Leistungen und Autoaufbereitung tritt mobil zurück, bleibt aber erkennbar.
* [x] `.cc-guard-mobil-licht` 30 → **60 % Weiß** (`styles/textschutz.css`, Vergleich und Herleitung im Kommentar). Gilt
  nur für `mobil="stehend"` unter 1024 px; die Abläufe (`flaeche`) und der Desktop bleiben unverändert.
* [x] Kontrast gerechnet für den schlechtesten Fall (schwarzes Foto, 60 % Schleier, Kopfschutz 88 %): Grund rgb(243),
  `gray-600` 6,6 : 1, `blue-600` 9,0 : 1. Der Kopfschutz trägt den Kontrast für sich (mit 30 % Schleier: 6,3 und 8,3 : 1).
* [x] Gemessen: `npm run kontrast -- / --sektionen` 978 Stellen, 0 unter AA (Build 22:36:53).
**Referenzen:**
`styles/textschutz.css`
`components/PhotoBackdrop.tsx`

### ✅ Phase 11 — Eingeklappte Titel 15 px
**Ziel:** Titel der eingeklappten Karten ruhiger, weiter mittig.
* [x] Fest `text-[15px]` statt `clamp(15px, 4,4vw, 18px)` (390 px: 17,2 → 15 px), senkrecht `pt-1.5` statt `pt-2.5`
  (Titelmitte bei 34 von 64 px; Versalien sitzen optisch hoch in ihrer Zeile). Desktop unverändert (dort schon 15 px).
* [x] Gemessen (Startseite und /karriere, 360/375/390/412/430 px, echte Textzeilen gegen die KI-Plakette):
  0 Überdeckungen, kleinster Abstand 1,6 px; auf der Startseite alle Titel einzeilig.
**Referenzen:**
`components/ExpandingCardAccordion.tsx`

### ✅ Phase 12 — Hero: Vertrauensleiste nicht mehr unter den Knöpfen
**Ziel:** Beim Laden steht die Vertrauensleiste auch in Safari ganz über der festen Leiste, ohne etwas auszublenden.
* [x] `styles/hero.css` (neu, per `@import` in `index.css`), nur unter 800 px Höhe und unter 1024 px Breite: Rahmen oben
  112 → 88 px, Kopfblock oben und unten 24 → 8 px (zusammen −56 px); Vertrauensleiste Abstand 32 → 16, Innenabstand
  24 → 16, um die Trennlinie 24 → 12, Zeilenabstand der Fakten 20 → 12 px (−56 px). Selektoren mit `#home`, damit sie die
  Tailwind-Klassen am Element unabhängig von der Reihenfolge schlagen.
* [x] `HeroSection`: Klassen `cc-hero-*`, Vertrauensleiste trägt `data-erster-bildschirm` (Prüfung in Phase 13).
* [x] **Gemessen (Build 22:36:53, Startseite, Scrollposition 0, Abstand Leistenende zu den Knöpfen):**

  | Fenster | vorher | nachher |
  |---|---|---|
  | 393 × 659 (iPhone 14 Pro, Safari, Leisten eingeblendet) | 84 px verdeckt | **28 px frei** |
  | 393 × 739 (Leisten ausgeblendet) | 4 px verdeckt | **88 px frei** |
  | 375 × 667 (iPhone SE) | 76 px verdeckt | **36 px frei** |
  | 360 × 640 (kleines Android) | 103 px verdeckt | **9 px frei** |
  | 393 × 852 (DevTools-Ansicht) | 97 px frei | 97 px frei (über 800 px, unverändert) |
**Referenzen:**
`styles/hero.css`
`components/HeroSection.tsx`

### ✅ Phase 13 — Prüfwerkzeuge: erster Bildschirm, Akkordeon-Prüfer belastbar
* [x] `npm run mobil`: neue harte Art **„Erster Bildschirm verdeckt“**. Textzeilen in `[data-erster-bildschirm]` müssen bei
  Scrollposition 0 ganz im Fenster stehen und unverdeckt sein (Treffertest an drei Punkten je Zeile); zusätzlich zu
  360/390/430 in 393 × 659, 393 × 739 und 375 × 667, nur auf Routen mit Markierung. **Beweis am echten Fehler:** ohne
  `hero.css` 4 Meldungen, mit 0. Gegenprobe jetzt 8 eingespielte Fehler, alle gemeldet. Pflichtfrage: Punkt 10 im Kopf.
* [x] `npm run akkordeon` unter Rechnerlast belastbar gemacht (Messrechner nebenher rund 50 % ausgelastet):
  - Layout pro Bild als **Anteil** der Bilder 150–650 ms nach dem Klick (ab 60 %, mindestens 3 Läufe) statt fester
    Anzahl: Unter Last schaffte eine Höhen-Animation zu wenige Bilder für die alte Grenze.
  - Treffertest vor jedem Tipp, nie ein Tipp auf eine offene Karte (folgte ihrem Link), Pop-up auf /karriere abwarten
    und schließen, Unterbrechung per Klick auf das Element (ein zweiter Tipp traf die schon gewachsene Karte), vor jeder
    Ruhelage auf das Ende der Animationen warten (höchstens 3 s, stockende Bilder im Kopflosen).
  - **Ereignisse von vor dem Start:** Ein Renderer, der während der vorigen Messung entstand, lieferte seinen Puffer mit
    (Laden der Seite, Schließklick des Pop-ups). Das Fenster lag am Schließklick 1,5 s vor dem Start, die 18 beim Laden
    gestarteten Animationen (Scroll-Verlauf der Kartentexte, Glas der festen Leiste) zählten als Compositor-Fehler.
    /karriere war davon als dritte Seite in 9 von 14 vollen Läufen betroffen, allein nie; die Gegenprobe fand dort die
    eingespielte Höhen-Animation nicht. Gefunden an der abgelegten Spur (`--protokoll`). Jetzt: nur Ereignisse ab
    `TracingStartedInBrowser`, Hauptthread aus dem Prozess des Hauptframes, Fenster an einer Marke, die der Klick auf die
    Zielkarte setzt (`console.timeStamp`). Fehlt sie: Messfehler (Exit 2) statt eines Urteils. Und jede Seite läuft in
    einem eigenen Browser: Im gemeinsamen fehlte die Marke danach noch in 2 von 4 Läufen ganz (Renderer zeichnete nach
    dem Start nicht auf); seitdem 7 von 7 Läufen verwertbar.
  - `-- /karriere` misst nur diese Route, `-- --protokoll` gibt jeden Schritt aus und legt die Spuren unter
    `output/akkordeon/` ab.
* [x] **Ergebnis, alle Werkzeuge gegen den Endstand (Build 16.10.2026, 23:30:35; Build grün, 29/29 Routen, 0 Gedankenstriche,
  `tsc` ohne Fehler):**
  - `npm run akkordeon`: 2 von 2 Läufen ohne Befund (dazu 5 von 5 gegen Build 22:36:53 mit eigenem Browser je Seite).
    Spät 1–3 Layouts in 5–72 Bildern, 0 Animationen abseits des Compositors, getippte Karte 0,0 px. **Gegenprobe 2 von 2:**
    je 3 von 3 Höhen-Animationen und 3 von 3 Hervorhebungen gemeldet, auch unter Last mit nur 5–7 Bildern im Fenster.
  - `npm run mobil`: 29 Routen × 3 Fenster plus die drei Safari-Fenster auf `/`, 0 harte Befunde, 257 Hinweise „Schrift
    unter 12 px“ wie zuvor. **Gegenprobe:** alle 8 eingespielten Fehler gemeldet.
  - `npm run kontrast`: 6.271 Textstellen auf 29 Routen, 0 unter AA. `-- / --sektionen`: 978 Stellen, 0 unter AA.
  - `npm run aussparung`: 29 Routen × 3 Fenster ohne dauerhafte Überdeckung, Geometrie an 23 Breiten in Ordnung.
    `npm run tote-dateien`: keine.
  - Hero (Scratchpad `hero-leiste.mjs`): alle Zielfenster frei (Tabelle Phase 12; A56 97 px, Pro Max 104 px, Tablet
    61 px). Darunter bleibt R29 (siehe Optimierungsplan).
  - Bildschirmfotos (Scratchpad `fotos/r3-*.png`): Hero bei 393 × 659 mit freier Vertrauensleiste, Leistungen und
    Autoaufbereitung bei 390 px mit 15-px-Titeln und zurückgenommenem Foto.
**Referenzen:**
`scripts/check-akkordeon.mjs`
`scripts/check-mobil.mjs`

## R29: Hero auf Fenstern unter 640 px (2026-10-17)

**Ausgang (gemessen, Build 17.10., 00:05, gleich dem Stand nach Phase 12):** Unter 800 px Höhe endet die Vertrauensleiste
immer bei 555,8 px, bei 360, 375 und 393 px Breite. Die Knöpfe der festen Leiste belegen die unteren 75 px.

| Fenster (abgeleitet, nicht am Gerät) | Knöpfe ab | Leiste |
|---|---|---|
| 375 × 548 (iPhone SE, Safari mit Leisten) | 473 px | 82,8 px verdeckt |
| 360 × 560 (kleines Android, Chrome mit Leisten) | 485 px | 70,8 px verdeckt |
| 375 × 600 | 525 px | 30,8 px verdeckt |
| 375 × 629 (iPhone 13 mini, Safari mit Leisten) | 554 px | 1,8 px verdeckt |
| 360 × 640 | 565 px | 9,2 px frei |

**Lösungswege:**
- (a) Leiste beim Laden ganz unter den Rand, per `min-height` am Kopfblock in `svh` hinter einer Höhenabfrage
  (**gewählt vom User**). Varianten davon: dieselbe Schwelle ohne Media Query per `clamp()`-Stufe in `svh` (verworfen:
  schwer lesbar; Chrome hält den Containing Block beim Ein- und Ausblenden der Adressleiste fest und folgt damit nach
  eigener Aussage Safari, die Höhenabfrage springt also nicht) und per Skript messen, ob die Leiste passt (verworfen:
  JavaScript für Layout, Risiko für CLS, CLAUDE.md „CSS-native Lösungen vor JavaScript“).
- (b) Überschrift und Abstände kleiner. Nötig waren bei 548 px rund 95 px (83 verdeckt plus Luft). Gebaut als Stufe 1
  unter 640 px (nur Abstände und Zeilenabstand der Unterzeile, 52 px) und Stufe 2 unter 600 px (Slogan einzeilig).
  Ein zweizeiliger Slogan hätte dafür allein von 41,6 auf rund 22 px schrumpfen müssen. Der einzeilige hatte bei
  `9.4vw` nur 1 bis 3 px Breitenreserve (Umbruch auf dem Gerät möglich), mit `min(2.25rem, calc(10.7vw - 6px))` 4 %.
  Grenze: unter rund 535 px Höhe passt auch b nicht mehr (320 × 480: 106 px verdeckt).
- Verworfen ohne Bau: etwas ausblenden (Vorgabe des Users), die feste Leiste über dem Hero ausblenden (nicht gewünscht,
  siehe dritte Rückmeldung).

### ✅ Phase 14 — R29: Vertrauensleiste unter 640 px Höhe unter dem Fensterrand (Variante a)
**Ziel:** Auch auf iPhone SE und mini in Safari und kleinen Android-Telefonen liegt beim Laden nichts von der
Vertrauensleiste unter den Knöpfen, ohne etwas auszublenden.
* [x] Beide Varianten gebaut (Varianten-CSS ins ausgelieferte HTML eingesetzt, nichts committet) und dem User als
  Vergleichsbogen vorgelegt: Puppeteer, Startseite oben, nach 2,5 s, 375 × 548 und 375 × 629, je heute, a, a nach dem
  ersten Wischen (234 px) und b. **Wahl des Users: a.**
* [x] `styles/hero.css`, unter 640 px Höhe und 768 px Breite: Kopfblock `min-height: calc(100svh - var(--cc-shell-gap) -
  6rem)`, `padding-bottom: 5.75rem`. Die Leiste beginnt 8 px unter dem Rand (0,5rem Reserve, ihre Trennlinie blitzt nicht
  hervor), Slogan, Überschrift und Text stehen mittig zwischen Navigation (78 px) und Knöpfen. Keine Schrift kleiner,
  nichts ausgeblendet. Ab 640 px Höhe (iPhone 14 Pro in Safari 393 × 659) und ab 768 px Breite unverändert.
* [x] `npm run mobil`: Kriterium „ganz sichtbar oder ganz unterhalb, nie angeschnitten oder verdeckt“. Ganz unterhalb
  zählt nur bis `UNTER_RAND_MAX` = 120 px, tiefer meldet die neue harte Art „Erster Bildschirm zu tief“ (sonst bestünde
  eine Leiste die Prüfung, die gar nicht mehr mit dem ersten Wischen kommt). Neue Fenster 375 × 629, 375 × 600,
  360 × 560, 375 × 548. Treffertest alle 8 px entlang jeder Zeile, an Ober- und Unterkante und in der Mitte, statt an
  drei Punkten der Mitte. Bericht mit Tabelle „Erster Bildschirm“ je Fenster. Gegenprobe: statt die echte Leiste per
  `margin-top: 60vh` zu verschieben (in niedrigen Fenstern landete sie damit ganz unterhalb und wäre jetzt in Ordnung
  gewesen) drei eigene Fälle an `<body>`: angeschnitten, unter der festen Leiste, zu tief. Zusammen 10 statt 8 Fehler.
  Pflichtfrage 10 a–d im Kopf.
* [x] `npm run kontrast -- / --fenster=375x548,375x629,…`: misst statt der zwei Standardfenster die angegebenen. 390 × 844
  erreicht den Hero unter 640 px nie, der Standardlauf hätte die neue Lage nicht gemessen.
* [x] **Kontrast nach Variante a (gefunden mit `--fenster`, der Standardlauf war grün):** Die erste Zeile der Unterzeile
  hatte 4,11 : 1 bei 375 × 548 und 4,29 : 1 bei 360 × 560 (Soll 4,5; ohne die R29-Regel in denselben Fenstern mindestens
  7,81 : 1). Ursache: Schleier und Foto wachsen beide mit der Kartenhöhe, das helle Wandband des Motivs liegt immer bei
  rund 34 bis 39 % des Schleierradius. Vor R29 stand dort die H1 (groß und fett, Soll 3 : 1), mit dem fensterhohen
  Kopfblock die Unterzeile. Gemessen mit einem Nachbau des Messverfahrens (zwei Aufnahmen, Glyphenmaske; gibt 4,11 und
  4,29 exakt wieder) an fünf Kandidaten:

  | Kandidat | 375 × 548 | 360 × 560 | 375 × 600 | 375 × 629 | 320 × 480 |
  |---|---|---|---|---|---|
  | a ohne Korrektur | 4,11 | 4,29 | 4,76 | 5,49 | 4,42 |
  | Kopfblock 16 px höher | 4,44 | 4,49 | nicht gemessen | nicht gemessen | nicht gemessen |
  | Kopfblock 28 px höher | 4,23 | 4,36 | nicht gemessen | nicht gemessen | nicht gemessen |
  | Kopfblock bündig oben (wie vor R29) | 4,23 | 4,25 | nicht gemessen | nicht gemessen | nicht gemessen |
  | Unterzeile weiß | 5,10 | 5,33 | 5,91 | 6,82 | nicht gemessen |
  | **Schleier-Stopp 0,62 bei 40 % (gewählt)** | **5,08** | **5,31** | **5,76** | **6,54** | **5,22** |
  | Schleier-Stopp 0,66 bei 40 % | 5,75 | 6,00 | 6,43 | 7,20 | 5,22 |

  Gewählt der kleinste Eingriff mit Reserve, nur unter 640 px Höhe: An der Stelle hatte die Gerade von 0,94 auf 0,4 bisher
  0,55, darüber und darunter ändert sich der Verlauf kaum (Vergleichsbogen: im Bild praktisch nicht zu sehen). Der Weg
  passt zur Geschichte des Schleiers (2026-09-07: Stopp „dort verdichtet, wo die Schrift steht“). Die weiße Unterzeile
  hätte die Typohierarchie nur auf kleinen Telefonen geändert. Vertrauensleiste nach dem ersten Wischen (234 px):
  mindestens 6,29 : 1, von der Korrektur unberührt.
* [x] CLAUDE.md: Zeilen zu `npm run mobil` und `npm run kontrast`, Absatz „iPhone 14 Pro heißt nicht 852 px“. Querverweis
  am Schleier in `index.css` (zweite Fassung in `hero.css`, beim Ändern nachziehen) und in `HeroSection`.
* [x] **Ergebnis, alle Werkzeuge gegen den Endstand (Build 17.10.2026, 01:01:55; Build grün, 29/29 Routen,
  0 Gedankenstriche, `tsc` ohne Fehler).** Danach nur noch Kommentare in `index.css` und `HeroSection`; Neubau 01:30:25
  mit byte-gleichen CSS- und JS-Dateien (gleiche Hashes), die Messungen gelten also unverändert.
  - `npm run mobil`: 29 Routen × 3 Fenster plus 7 Zusatzfenster auf `/`, 0 harte Befunde, 257 Hinweise „Schrift unter
    12 px“ wie zuvor. Erster Bildschirm:

    | Fenster | Vertrauensleiste | entspricht |
    |---|---|---|
    | 375 × 548 (iPhone SE, Safari mit Leisten) | ganz unterhalb, beginnt 8 px unter dem Rand | vorher 83 px verdeckt |
    | 360 × 560 (kleines Android, Chrome mit Leisten) | ganz unterhalb, 8 px | vorher 71 px verdeckt |
    | 375 × 600 | ganz unterhalb, 8 px | vorher 31 px verdeckt |
    | 375 × 629 (iPhone 13 mini, Safari mit Leisten) | ganz unterhalb, 8 px | vorher 1,8 px verdeckt |
    | 360 × 640 | ganz sichtbar, endet 84 px über dem Rand | 9 px über den Knöpfen, unverändert |
    | 393 × 659 (iPhone 14 Pro, Safari mit Leisten) | ganz sichtbar, 103 px | 28 px über den Knöpfen, unverändert |
    | 375 × 667 · 393 × 739 · 390 × 844 · 430 × 932 | ganz sichtbar, 111 · 163 · 172 · 179 px | unverändert |

  - `npm run mobil -- --gegenprobe`: alle 10 eingespielten Fehler gemeldet; „verdeckt“ in den Zusatzfenstern von der
    festen Leiste (`a.cc-liquid`), wie beabsichtigt.
  - `npm run kontrast`: 6.285 Textstellen auf 29 Routen, 0 unter AA. `-- / --fenster=375x548,375x629,360x560,375x600,320x480
    --strikt`: 247 Stellen, 0 unter AA.
  - `npm run aussparung`: 29 Routen × 3 Fenster ohne dauerhafte Überdeckung, Geometrie an 23 Breiten in Ordnung.
  - Bildschirmfotos vom Build (Startseite oben, nach 2,5 s): 375 × 548 und 375 × 629 vorher, nachher und nach dem ersten
    Wischen, dazu 393 × 659 unverändert. Dem User als Bogen gezeigt (`output/r29/`, nicht versioniert).
**Referenzen:**
`styles/hero.css`
`scripts/check-mobil.mjs`
`scripts/check-kontrast.mjs`

---

## Kommentare

### Phase 1
**Eingehalten:** erst gemessen (Trace, Ablation mit 14 Varianten), dann gebaut ✅, fünf Lösungswege verglichen ✅, Desktop
unverändert (Bildschirmfoto 1440 gegen `output/shots/start`) ✅, unterbrechbar und getestet ✅, unter 700 Zeilen
(`ExpandingCardAccordion` 483, `akkordeonMobil` 123) ✅, kein reduced-motion-Gate (Projektentscheidung) ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel:** Eingeklappte Streifen zeigen das Foto etwas näher als vorher (festes Bildformat der offenen Karte).
   Bewusst in Kauf genommen; ohne festes Format müsste das Bild pro Bild neu gerastert werden.
2. 🟢 **Niedrig:** `React.memo` je Karte gemessen ohne Gewinn (O5), daher nicht eingebaut.

### Phase 2
**Eingehalten:** Kontrast rechnerisch für den schlechtesten Fall (schwarzes Foto) und gemessen ✅, Gegenprobe ✅, Kopien
zusammengeführt (O2) ✅, Desktop-Ebenen unverändert ✅, `sticky` mit `overflow-clip` statt `-hidden` ✅.
**Auffälligkeiten:** 1. 🟢 Ein Querformatfoto im Hochformat zeigt nur rund ein Drittel seiner Breite; deshalb steht es
mobil in Fensterhöhe statt über die ganze Sektion (sonst ein Sechstel).

### Phase 3
**Eingehalten:** Link bleibt im HTML (SEO) ✅, Aktion mobil weiter erreichbar (feste Leiste) ✅, Höhen je Breite gemessen
✅, keine Textänderung (Lektorat abgeschlossen) ✅.

### Phase 4
**Eingehalten:** Pflichtfrage „Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?“ im Kopf beantwortet ✅,
Gegenprobe 3/3 ✅, Altfehler gefunden und an der Ursache behoben statt an der Karte umgangen ✅.
**Auffälligkeiten:** 1. 🔴 Lenis-Anker ohne `defaultPrevented` (O1, behoben). 2. 🟠 Mitarbeiterstimmen animieren mobil
noch die Höhe (R25). 3. 🟡 Lenis-Dauerschleife (R26). 4. 🟢 FAQ-Höhe (R27).
Optimierungsplan: `2026-10-16-mobil-startseite-optimierung-tasks.md`.

### Phasen 10–13 (dritte Rückmeldung)
**Eingehalten:** gemessen statt geschätzt (Fensterhöhen, Abstände, Kontrast, Titel gegen Plakette) ✅, Lösungswege
verglichen ✅, nichts per Höhenabfrage ausgeblendet (Vorgabe des Users) ✅, Desktop unverändert (alles unter 1024 px) ✅,
Pflichtfrage für das neue Kriterium in `check-mobil` (Punkt 10) und für die Prüferkorrektur in `check-akkordeon`
(Punkt 8) beantwortet ✅, Prüferfehler an der Ursache behoben statt Grenzen gelockert ✅, Herkunft der Safari-Höhe
genannt und Abgeleitetes gekennzeichnet ✅, unter 700 Zeilen (`check-mobil` 496, `ExpandingCardAccordion` 492,
`check-akkordeon` 415, `index.css` 687) ✅, Encoding ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (behoben, O13):** Der Akkordeon-Prüfer wertete Ereignisse von vor dem Spurstart aus und verankerte sein
   Fenster am falschen Klick. Auf /karriere hätte er eine echte Höhen-Animation übersehen (Gegenprobe dort 2 von 3).
2. 🟠 **Hoch (behoben, O14):** `npm run mobil` maß nur volle Bildschirmhöhen; die Fenster von Safari fehlten.
3. 🟡 **Mittel (behoben, O12):** Weitere Schwächen des Akkordeon-Prüfers unter Rechnerlast (siehe Phase 13).
4. 🟢 **Niedrig (Hinweis):** 659 px stammen aus einer Geräteliste (Rocket Validator), 739 px sind abgeleitet; beides am
   echten iPhone nicht nachgemessen.
5. 🟡 **Mittel (offen, R29):** Unter rund 631 px Fensterhöhe (iPhone SE und mini in Safari, kleine Android-Telefone mit
   Chrome-Leisten, alle abgeleitet) liegt die Vertrauensleiste beim Laden weiter teils unter den Knöpfen. Lösbar nur
   mit einer Gestaltungsentscheidung (Leiste ganz unter den Rand oder kleinere Schrift), deshalb dem User vorgelegt.
   → Erledigt 2026-10-17 in Phase 14 (Variante a).
Optimierungsplan: `2026-10-16-mobil-startseite-optimierung-tasks.md` (O12–O14, R29).

### Phase 14 (R29)
**Eingehalten:** beide Varianten vor jedem Commit als Bildschirmfotos vorgelegt und erst nach der Wahl umgesetzt ✅,
nichts ausgeblendet und keine Schrift kleiner ✅, gemessen statt geschätzt (Geometrie je Fenster, Breitenreserve des
einzeiligen Slogans, Kontrast in den neuen Fenstern) ✅, CSS statt JavaScript ✅, Desktop, `md` und alles ab 640 px
Höhe unverändert ✅, Pflichtfrage für das erweiterte Kriterium beantwortet (Punkt 10 a–d) ✅, jede neue Fehlerart mit
eigener Gegenprobe ✅, unter 700 Zeilen (`check-mobil` 569, `check-kontrast` 358, `hero.css` 95, `index.css` 691 von 700) ✅, Encoding und
Zeilenenden ✅, keine neue R-Nummer vergeben ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (behoben):** Variante a senkte den Kontrast der Unterzeile unter AA (4,11 : 1 bei 375 × 548), weil sie jetzt
   auf dem hellen Wandband des Fotos liegt. Der Standardlauf von `npm run kontrast` war grün, er misst nur 390 × 844; erst
   `--fenster` fand es. Behoben mit einem Schleier-Stopp nur unter 640 px (5,08 : 1). Lehre: Höhenabhängige Layouts in
   den Fenstern messen, in denen sie greifen, auch beim Kontrast.
2. 🟡 **Mittel (behoben):** Der Treffertest prüfte je Zeile drei Punkte der Mitte. Eine Zeile über die ganze Breite traf
   bei 375 px mit allen dreien Rand oder Lücke der festen Leiste (2, 187,5 und 373 px gegen Knöpfe bei 12–92, 102–183,
   193–273 und 283–363 px) und galt als frei, obwohl drei Knöpfe auf ihr lagen. Die echten Zeilen der Vertrauensleiste
   trafen bisher immer einen Knopf; jetzt wird alle 8 px an drei Höhen geprüft.
3. 🟡 **Mittel (behoben):** Die bisherige Gegenprobe (`margin-top: 60vh` an der echten Leiste) hätte mit dem neuen
   Kriterium in niedrigen Fenstern nur „ganz unterhalb“ erzeugt. Jetzt drei eigene Fälle.
4. 🟡 **Mittel (behoben):** `npm run kontrast` misst nur 1440 × 900 und 390 × 844 und damit nie den Hero unter 640 px.
   Jetzt `--fenster` (Befund 1 wäre sonst unentdeckt geblieben).
5. 🟢 **Niedrig (Hinweis, ohne Nummer):** Telefone im Querformat (844 × 390, 932 × 430): Schon die Unterzeile des
   Kopfblocks liegt unter den Knöpfen. Nicht Teil von R29, `npm run mobil` misst kein Querformat.
6. 🟢 **Niedrig (Hinweis):** Bei 320 × 480 (iPhone SE der 1. Generation in Safari, abgeleitet) beginnt die Leiste 74 px
   unter dem Rand, aber die Unterzeile reicht unter die Knöpfe. Der Kopfblock ist nicht markiert (Pflichtfrage 10 a).
7. 🟢 **Hinweis:** Außer 393 × 659 sind alle Fenster abgeleitet; am Gerät nicht nachgemessen.
