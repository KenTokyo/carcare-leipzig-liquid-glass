# Startseite mobil: flüssige Karten, Hintergrundfoto, gleich hohe Ablaufkarten, ein Farbton

**Angelegt:** 2026-10-16 · **Branch:** `2026-10-06-lektorat`
**Auftrag des Users (gekürzt):** Auf dem Samsung Galaxy A56 klappen die Karten der Startseite (Leistungen und
Autoaufbereitung) „mit Low Performance“ auf, „nicht so schön weich“. Das Hintergrundfoto, das am Desktop als weicher
Übergang hinter den Karten steht, fehlt mobil: bitte überall so wie am Desktop. Schritt 1 unter „Unfallschaden? …“ hat
eine größere Textkachel als die Schritte 2 bis 5: angleichen. Den Ratgeber unter „Autoaufbereitung“ mobil komplett
herausnehmen. Hinter der FAQ (und bei Autoaufbereitung) steht ein anderer Farbton als sonst: durchgehend ein Ton.

**Status:** Phasen 1–4 umgesetzt, Phase 5 (Gegenprobe gegen den Endstand) siehe unten. Sichtabnahme auf dem echten
Galaxy A56 durch den User steht aus. Optimierungsplan: `2026-10-16-mobil-startseite-optimierung-tasks.md`.

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
* [ ] **Sichtabnahme auf dem Galaxy A56 durch den User** (nach Push auf die Vorschau). Kopfloses Chrome misst den
  Hauptthread, nicht GPU und Anzeige des Geräts.
**Referenzen:**
`scripts/check-akkordeon.mjs`
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
