# Optimierung: Hero-Bildausschnitt (Desktop 48 %, Mobile bis 69 % weggeschnitten)

> **Referenz-Planung:** `2026-07-20-hero-desktop-bild-radialverlauf-tasks.md` (Findings 1 + 2b)
> **Status:** ⏸️ **Wartet auf Design-Entscheidung des Users** — bewusst nicht eigenmächtig umgesetzt,
> weil es eine Komposition-/Gestaltungsfrage ist und die dokumentierte Parallax-Mathematik berührt.
>
> **Beide Breakpoints betroffen, gleiche Ursache:** die `h-[147%]`-Parallax-Ebene. Sie macht die
> Bildebene deutlich höher als den Rahmen — `object-cover` skaliert dann auf die Höhe und schneidet
> die Breite weg. Am Desktop kostet das Bildaussage, mobil zusätzlich **Schärfe**.

## Problem (gemessen, nicht geschätzt)

Bei Viewport **1920x1080**:

| Größe | Wert |
|---|---|
| Parallax-Ebene | 1873 x 1541 px → **AR 1,22** |
| Bild nativ | 2400 x 1029 px → **AR 2,33** |
| Bild gerendert (`object-cover`) | 3593 x 1541 px → **Zoom 1,50x** |
| **Sichtbare Bildbreite** | **52 %** |
| **Seitlich abgeschnitten** | **48 %** |

**Ursache (bestehende Mechanik, kein neuer Fehler):** Die Parallax-Ebene ist `h-[147%]` der
Rahmenhöhe — nötig für die Parallax-Reise (`-top-[23.5%]`, Reise ±14,6 % der Ebenenhöhe). Dadurch ist
die Ebene *hoch* (AR 1,22), das Motiv aber *breit* (AR 2,33). `object-cover` skaliert auf die Höhe und
schneidet die Breite weg. Das alte Motiv (ebenfalls 21:9) traf dasselbe Schicksal — es fiel nur weniger
auf, weil dort kein einzelnes Hauptobjekt im Zentrum stand.

**Praktische Folge:** Vom gewählten Motiv (blauer Taycan **und** roter Unfallwagen, beide vollständig)
sieht man am Desktop im Wesentlichen die Front des blauen Wagens. Die Bildaussage
„Aufbereitung **und** Unfallinstandsetzung nebeneinander" geht verloren.

## Mobile ist stärker betroffen — inklusive Schärfeverlust

Gemessen mit dem neuen Hochkant-Motiv (1744x2336):

| Gerät | Ebene | sichtbare Bildbreite | effektive Pixeldichte |
|---|---|---|---|
| iPhone SE (375, DPR 2) | 359x1564 | 31 % | 0,75x |
| iPhone 14 (390, DPR 3) | 374x1510 | 33 % | **0,52x** |
| Pixel 7 (412, DPR 2.6) | 396x1510 | 35 % | 0,60x |
| iPhone Pro Max (430, DPR 3) | 414x1471 | 38 % | 0,53x |

Die Ebene ist mobil **AR 0,25** (374x1510) — das Motiv hat AR 0,75. `object-cover` skaliert auf die
Höhe, schneidet ~2/3 der Breite weg **und** rechnet das Bild dabei hoch. Dichte < 1,0 = sichtbar weich
auf Retina.

> ⚠️ **Nicht durch eine größere Datei lösbar:** Für 1,0x bräuchte es ~3300 px Quellbreite. Als
> Mobile-LCP-Asset ist das unvertretbar (SEO-GEO §2.2, LCP < 2,5 s). Die 373 KB sind **nicht zu viel** —
> das Problem ist die Ebenengeometrie, nicht die Dateigröße. Ein Verkleinern würde es verschlimmern.

## Wie stark hilft welches Seitenverhältnis? (gerechnet für Desktop 1920x1080)

| Quell-AR | Beispielmaß | sichtbare Breite | abgeschnitten |
|---|---|---|---|
| 2,33 (21:9) — **aktuell** | 2400x1029 | 52 % | **48 %** |
| 1,78 (16:9) | 2400x1350 | 68 % | 32 % |
| 1,50 (3:2) | 2400x1600 | 81 % | 19 % |
| **1,22** | 2400x1966 | **100 %** | **0 %** |

---

## Lösungswege (nach Aufwand/Wirkung)

### Option A — `object-position` verschieben *(1 Zeile, sofort, reversibel)*
`object-center` → z. B. `object-[35%_center]`, damit der rote Unfallwagen mit ins Bild rückt.
**Wirkung:** verschiebt den Ausschnitt, **reduziert ihn nicht**. Zoom bleibt 1,50x.
**Aufwand:** minimal. **Risiko:** keins.

### Option B — Höheren Bildzuschnitt liefern *(beste Bildwirkung)*
Vom **Original-Foto** einen höheren Ausschnitt exportieren (Ziel-AR ~1,2–1,5 statt 2,33), z. B.
2400x1750. Dann steht deutlich mehr vom Motiv im Rahmen, Zoom sinkt spürbar.
**Wirkung:** löst das Problem an der Wurzel. **Voraussetzung:** das Originalfoto muss oben/unten mehr
Bildinhalt haben als der gelieferte 21:9-Beschnitt — **das kann ich nicht prüfen, das weißt du.**
**Aufwand:** ein neuer Export + `npm run images`. **Risiko:** keins.

### Option C — Parallax-Ebene flacher *(Kompromiss, berührt dokumentierte Mathematik)*
`h-[147%]` → z. B. `h-[115%]`, dazu `-top` und Reise **gemeinsam** neu herleiten
(sonst grauer Rand an den Extremen — genau davor warnt der Kommentar in `HeroSection.tsx`).
**Wirkung:** sichtbare Breite 52 % → ~67 %. **Preis:** die Parallax-Bewegung wird deutlich schwächer.
**Aufwand:** mittel + erneute Verifikation an beiden Scroll-Extremen. **Risiko:** mittel.

### Option D — Alles lassen
Der aktuelle Ausschnitt wirkt als dramatische Nahaufnahme durchaus premium (siehe Screenshot).
Wenn dir die Wirkung gefällt, ist **nichts zu tun** — dann bitte diesen Plan schließen.

---

## Empfehlung

**C — die Parallax-Ebene flacher machen.** Mit den Mobile-Zahlen hat sich meine Einschätzung gedreht:
Option B (höherer Zuschnitt) hilft nur am Desktop; mobil bleibt die Ebene mit **AR 0,25** so extrem
hochkant, dass **jedes** Motiv zu ~2/3 beschnitten und hochskaliert wird — dort ist die Ebenengeometrie
selbst die Ursache, nicht der Bildzuschnitt. Nur C wirkt auf **beide** Breakpoints und behebt
zusätzlich den Schärfeverlust.

Der Preis ist eine schwächere Parallax-Bewegung. Falls die Bewegung in ihrer jetzigen Stärke gesetzt
ist, wäre die Alternative, sie mobil ganz abzuschalten (Ebene = Rahmenhöhe, kein Überhang, kein
Zuschnitt) und nur am Desktop zu fahren — das kostet mobil nichts an Wirkung, weil die Bewegung auf
kleinen Displays ohnehin kaum auffällt.

**A** bleibt der billige Sofort-Hebel, falls dir am Desktop nur der rote Wagen im Bild fehlt.
**B** zusätzlich, wenn das Originalfoto mehr Höhe hergibt — kombiniert mit C wäre es das Optimum.

## Phasen

### ✅ Phase 1 — Entscheidung
* [x] User: „Zieh deine bevorzugte Option durch" → **Option C** umgesetzt (2026-07-20)
**Referenzen:** `components/HeroSection.tsx`

### ✅ Phase 2 — Umsetzung
**Ziel:** Ebene flacher, Reise sauber neu hergeleitet, mobil ganz aus.
* [x] Desktop: Ebene `h-[147%]` → **`md:h-[120%]`**, `-top-[23.5%]` → **`md:-top-[10%]`**
* [x] Reise neu hergeleitet: Ueberhang 10 % der Rahmenhoehe je Seite, minus 2 % Puffer
      → ±8 % der Rahmenhoehe = **±6.67 % der Ebenenhoehe** (Konstante `PARALLAX_REISE_PROZENT`)
* [x] Mobil: Ebene **`top-0 h-full`**, Reise **0** — kein Ueberhang, kein Zuschnittverlust
* [x] `hooks/useMediaQuery.ts` angelegt: die Reise ist ein JS-Wert (Framer-Transform-Range) und
      laesst sich nicht per Tailwind-Praefix umschalten. Breakpoint 768px = deckungsgleich `md:`
* [x] Kommentar in `HeroSection.tsx` auf den neuen Stand gebracht (die alte skiper29-Herleitung
      beschrieb Werte, die es nicht mehr gibt)
**Referenzen:** `components/HeroSection.tsx`, `hooks/useMediaQuery.ts`

### ✅ Phase 3 — Verifikation
**Messung ueber 5 Scroll-Tiefen je Ansicht, Sweep bewusst ueber die Sektion hinaus, damit beide
Extreme (progress 0 und 1) wirklich erreicht werden.**

| Ansicht | sichtbare Breite | Pixeldichte | Deckung oben/unten | grauer Rand |
|---|---|---|---|---|
| Desktop 1920 | 52 % → **64 %** | 0,82x | 20,9 / 20,9 px | ✅ nein |
| Desktop 1512 | → 58 % | 0,93x | 18,3 / 18,3 px | ✅ nein |
| Laptop 1280 | → 53 % | 1,01x | 17,0 / 17,0 px | ✅ nein |
| iPhone 14 | 33 % → **49 %** | 0,52x → **0,76x** | 0 / 0 (kein Ueberhang) | ✅ nein |
| iPhone SE | 31 % → **45 %** | 0,75x → **1,10x** | 0 / 0 | ✅ nein |
| Pixel 7 | 35 % → **52 %** | 0,60x → **0,87x** | 0 / 0 | ✅ nein |

* [x] Deckung an beiden Extremen **symmetrisch** = die hergeleiteten 2 % Puffer stimmen exakt
* [x] ⚠️ Erster Messlauf war unbrauchbar (Sweep zu kurz → oberes Extrem nie erreicht, Deckung
      las sich als 188,7 px statt 20,9 px). Erst der verlaengerte Sweep prueft, was er soll.
* [x] `tsc --noEmit` → Exit 0
**Referenzen:** `components/HeroSection.tsx`

---

## Ergebnis

Umgesetzt wie empfohlen. Der Zielkonflikt bleibt bestehen und ist bewusst entschieden:
**Parallax-Staerke am Desktop auf ~37 % der urspruenglichen Reise reduziert** (±21,5 % → ±8 % der
Rahmenhoehe), mobil auf 0. Dafuer sind Bildaussage und Schaerfe deutlich besser.
Wer die Bewegung zurueckwill, muss Ebenenhoehe, `-top` und Reise **gemeinsam** neu herleiten —
und den Zuschnitt wieder bezahlen.

Option B (hoeherer Zuschnitt vom Originalfoto) bleibt **zusaetzlich sinnvoll** und wuerde am
Desktop weiter helfen: Bei Quell-AR 1,5 statt 2,33 waeren ~81 % statt 64 % sichtbar.
