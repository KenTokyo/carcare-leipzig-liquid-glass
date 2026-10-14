# Galerie „Einblicke“ als Karussell nach skiper49 („Inverted perspective carousel“)

**Angelegt:** 2026-10-14
**Auftrag des Users:** Die Sektion „Einblicke · Ergebnisse, die man sieht.“ (`/fahrzeugaufbereitung-leipzig`,
`components/DetailingGallery.tsx`) wird zum Karussell wie https://skiper-ui.com/v1/skiper49. „Bitte schau dir das ganz genau
an und pass das genau in der Art und Weise an.“ Die Bilder bleiben (B48–B58). Die Karten bleiben, wie sie sind (abgerundet,
Vignette, Symbol und Name), „nur wirklich die Animation hinzufügen“. Drei Karten sichtbar, etwas größer, über die Breite
verteilt wie bisher das Raster.

## Vorlage, gemessen (Swiper-Instanz auf skiper-ui.com, 14.10.2026)

| Wert | skiper49 |
|---|---|
| Effekt | Swiper `coverflow`: `rotate` 40, `depth` 100, `stretch` 0, `modifier` 1, `scale` 1, `slideShadows` an |
| Anordnung | `slidesPerView: 'auto'`, `centeredSlides`, `spaceBetween` 0, Karte 300 × 300 px |
| Perspektive | `.swiper-3d { perspective: 1200px }` (Mitte der Bühne) |
| Bewegung | `speed` 300 ms (CSS `ease`), `loop`, `grabCursor`, Ziehen/Wischen; Autoplay und Pfeile in der Live-Demo AUS |
| Schatten | Seitenkarte: Verlauf `rgba(0,0,0,.5)` → transparent zur inneren Kante, Deckkraft = Abstand zur Mitte |
| Punkte | 8 px, Abstand 2 × 4 px, aktiv deckend, sonst 20 %, klickbar, unter der Bühne |

Formel (Swiper `effect-coverflow`): je Karte `versatz` = Abstand zur Mitte in Kartenbreiten (links negativ):
`rotateY = −40° · versatz`, `translateZ = −100 px · |versatz|`, `z-index = −|round(versatz)| + 1`. Dadurch kippen die
Seitenkarten mit der INNEREN Kante nach hinten (die äußere wirkt näher, daher „inverted“).

## Lösungswege verglichen

1. **Swiper als Abhängigkeit** (wie die Vorlage): exakt, aber rund 15–20 KB gz zusätzlich plus globales CSS, für eine Sektion
   auf einer Seite. Verworfen.
2. **CSS Scroll-Snap + scroll-getriebene Animationen:** CSS-nativ, aber keine Endlosschleife, kein Ziehen mit der Maus, und
   `animation-timeline` gibt es nicht in allen Browsern. Verworfen.
3. **Gewählt: Nachbau in Framer Motion** (schon im Projekt, Projektentscheidung „Skiper in Framer Motion nachbauen“):
   dieselbe Coverflow-Formel auf einem MotionValue `position`, keine Re-Renders pro Bild, Endlosschleife per Modulo,
   Ziehen mit Zeigerereignissen und Einrasten wie Swiper (kurzer schneller Wisch = eine Karte, sonst nächste Karte).

### ✅ Phase 1 — Karussell-Komponente
**Ziel:** Coverflow wie skiper49, Karten unverändert.
* [x] `components/CoverflowKarussell.tsx` (neu, generisch): Swiper-Coverflow-Formel auf einem MotionValue `position`
  (`useTransform` je Karte, kein Re-Render pro Bild), Endlosschleife per Modulo, Schatten an der inneren Kante,
  Einrasten 300 ms mit CSS-`ease`, Ziehen/Wischen (Zeigerereignisse, kurzer Wisch unter 300 ms = eine Karte, sonst
  nächste Karte), Pfeiltasten, 11 Punkte (aktiv deckend, sonst 20 %, Trefferfläche 24 × 24 px), Ansage per `aria-live`.
* [x] Maßstab: Perspektive = 4 × Kartenbreite, Tiefe = ⅓ Kartenbreite (Vorlage: 1200/100 px bei 300-px-Karten), damit die
  Kippung bei jeder Kartengröße gleich aussieht. Alles aus CSS (`--karte` in `cqi`), nichts gemessen: Der Prerender
  zeigt sofort das fertige Bild.
* [x] `components/DetailingGallery.tsx`: Parallax-Spalten, Scroll-Hooks und Raster-Ersatz für reduzierte Bewegung entfernt
  (Projektentscheidung: keine reduced-motion-Gates). `Tile` (Vignette, Symbol, Name) unverändert, Name 13/16 px, weil die
  Karten größer sind. Das dunkle Band um die Galerie entfällt, die Karten stehen wie in der Vorlage frei auf der Seite.
* [x] Barrierefreiheit und SEO: Region „Karussell“, Folien „n von 11: Name“, Bilder nicht mehr `aria-hidden` (die
  Alternativtexte zählen jetzt), Ansage mit `data-suche="aus"`.
**Referenzen:**
`components/CoverflowKarussell.tsx`
`components/DetailingGallery.tsx`

### ✅ Phase 2 — Maße und Sichtprüfung
* [x] `--karte`: mobil 62cqi, ab `md` min(34cqi, 30rem). Gemessen: 1440 → Karte 435 × 580, drei Karten über 1200 der
  1280 px; Full HD → 480 × 640; 390 → 202 × 269, Nachbarn angeschnitten.
* [x] Nachgebessert: In Full HD blitzten die übernächsten Karten als Streifen am Rand auf (Bühne breiter als 2,9 Karten,
  weil die Karte bei 30rem gedeckelt ist). Bühne jetzt höchstens 2,9 Kartenbreiten, wie die Vorlage (856 px bei 300 px).
* [x] Bedienung per Puppeteer (`output/b24/karussell.mjs`), alle drei Größen: Ziehen 300 px → nächste Karte, schneller Wisch
  60 px → zurück, Pfeil rechts, Klick auf Punkt 9, Touch-Wisch mobil: jeweils richtige Karte aktiv.
* [x] **Fehler gefunden und behoben:** Senkrechtes Wischen auf dem Handy (echte Touch-Ereignisse,
  `output/b24/karussell-touch3.mjs`, Gegenprobe auf der Überschrift) scrollte zwar die Seite, wechselte aber zusätzlich die
  Karte: `pointercancel` meldet `clientX` 0 und galt als schneller Wisch. Jetzt rastet ein Abbruch auf die Ausgangskarte
  zurück, die Strecke kommt aus der letzten echten Bewegung. Nachmessung: Seite scrollt 317 px, Karte bleibt.
* [x] Aufnahmen: `output/b24/karussell-bogen.jpg` (an den User geschickt).
**Referenzen:**
`components/CoverflowKarussell.tsx`
`output/b24/karussell-bogen.jpg`

### ✅ Phase 3 — Prüfläufe (Build 14.10.2026, 18:17:43)
* [x] Build: Prerender 29/29, Gedankenstriche 0, Suchindex ok.
* [x] `npm run kontrast -- /fahrzeugaufbereitung-leipzig`: 237 Textstellen, kein Text unter WCAG AA.
* [x] `npm run bilder`: 151 Bildstellen, 0 Platzhalter, keine Nummer verschoben; bei B57/B58 entfällt der Zusatz
  „nur Desktop“ (alle elf Karten stehen jetzt in beiden Ansichten im Karussell).
* [x] `tsc --noEmit` ohne Fehler; Konsole der Seite ohne Fehler.

---

## Kommentare

### Phase 1–3
**Eingehalten:** Vorlage gemessen statt geschätzt ✅, keine neue Abhängigkeit ✅, unter 700 Zeilen (181 + 239) ✅, Karten
unverändert ✅, Mobile-First ✅, Bedienung mit Maus, Touch und Tastatur ✅, Prüfläufe gegen denselben Build ✅.
**Was die Prüfung besteht, ohne dass die Sache in Ordnung ist:** `synthesizeScrollGesture` scrollte mit Lenis gar nicht,
auch nicht auf der Überschrift; ohne die Gegenprobe hätte das wie ein Fehler des Karussells ausgesehen. Erst echte
Touch-Ereignisse zeigten den tatsächlichen Fehler (Kartenwechsel beim Scrollen).
**Auffälligkeiten (nach Schwere):**
1. ✅ **Behoben (hoch):** senkrechtes Scrollen auf dem Handy wechselte die Karte (siehe Phase 2).
2. ✅ **Behoben (mittel):** Streifen der übernächsten Karten in Full HD.
3. ✅ **Erledigt (User 14.10.: „Ja, es sind nun echte Fotos“):** Untertitel jetzt „Eindrücke aus unserer Innen-, Außen-
   und Lackaufbereitung.“ Vorher: Die Beschreibung der Sektion sagte noch „Beispielhafte Eindrücke …“; seit 14.10. sind es echte
   Fotos. Textänderung nicht eigenmächtig (Lektorat abgeschlossen), vorgeschlagen.
