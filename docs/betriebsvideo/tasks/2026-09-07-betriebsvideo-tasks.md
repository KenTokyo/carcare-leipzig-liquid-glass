# Betriebsvideo einhängen (Backlog 3.20, 3.21, 3.18)

**Status:** ✅ abgeschlossen am 2026-09-07 — alle drei Videoplätze gefüllt und laufend.
**Ein Punkt bleibt offen:** Anhalte-Möglichkeit nach WCAG 2.2.2, siehe Phase 6.

**Angelegt:** 2026-09-07
**Auslöser:** Der Kunde hat das Videomaterial geliefert. Wörtlich: „das Drohnenvideo …
es hat aber 118 MB."

---

## Was geliefert wurde

Ein ganzer Ordner, nicht nur eine Datei — `Downloads/transfer-01a06d3d/CarCare/`:

| Ordner | Inhalt | Größe |
|---|---|---|
| `1. Roh Dateien Bearbeitet` | 16 kurze Clips | 62,8 MiB |
| `2. Video` | **`CarCare .mov`** — der fertige Film | **115,6 MiB** |
| `3. Drohnen Videos` | 12 Dateien, u. a. `CarCare Drohne CG.mov` (143,3 MiB) | 348,3 MiB |
| `4. GEMA freie Musik` | 2 Titel | 6,8 MiB |
| `5. Verwendetes Logo` | 1 PNG | 1,0 MiB |
| `CarCare Monatsplan` | `Content Plan CarCare.pdf` | — |

**Vom Kunden gewählt:** `2. Video/CarCare .mov`. Technisch: 1920×1080, 86,68 s,
H.264 mit 11 Mbit/s, AAC-Ton. Struktur: Luftaufnahme mit Logo → Rundgang durch alle
Bereiche → Luftaufnahme mit Logo.

**Ebenfalls entschieden:** selbst ausliefern, nicht bei YouTube/Vimeo einbetten. Eine
Einbettung bräuchte nach § 25 TDDDG eine Einwilligung **vor** dem Laden, also einen
Cookie-Banner und einen Abschnitt in der Datenschutzerklärung. Beides existiert nicht —
die Datenschutzerklärung ist selbst ein Livegang-Blocker (**R6**).

---

## Phasen

### ✅ Phase 1 — Ausschnitt bestimmen, nicht raten
**Ziel:** `data/videos.ts` verlangt für den Hero „einen ruhigen Ausschnitt … ohne harte
Schnitte, ohne Text im Bild". Das ist prüfbar.
* [x] Schnitterkennung (`select='gt(scene,0.30)'`): **20 Schnitte**. Längste
      ununterbrochene Einstellung **8,76–21,44 s (12,68 s)**.
* [x] Kontrollbilder aus allen langen Einstellungen angesehen. **Bei 3 s und 81 s liegt
      das Firmenlogo im Bild** — beide Luftaufnahmen sind als Hintergrundschleife damit
      raus. Der Werkstattschwenk dazwischen ist ruhig, schnittfrei und textfrei.
* [x] Genommen: **9,0–21,2 s**, mit Abstand zu beiden Schnittkanten.

### ✅ Phase 2 — Umrechnen und messen
* [x] `scripts/build-video.mjs` + `npm run video` — reproduzierbar, wie `npm run images`.
      `ffmpeg-static` als devDependency.
* [x] Messreihe statt Bauchgefühl:

  | Fassung | Größe |
  |---|---|
  | 1080p, CRF 24 | 7,63 MiB |
  | 1080p, CRF 27 | 5,36 MiB |
  | 1080p, CRF 30 | 3,82 MiB |
  | **720p, CRF 29** | **2,12 MiB** ← genommen |
  | VP9/WebM, CRF 36 | 6,92 MiB — *größer als H.264* |

* [x] **720p, weil die Schleife unter `hero-radial-veil` liegt**, das dort zwischen 40 %
      und 94 % abdunkelt. Auflösung, die niemand sieht, kostet nur Ladezeit.
* [x] **Kein WebM.** Zwei Gründe: `PhotoBackdrop` und `BetriebsVideo` binden ein einzelnes
      `src`, keine `<source>`-Liste — ein zweites Format wäre totes Gewicht. Und gemessen
      war VP9 hier *größer*, nicht kleiner (die CRF-Skalen sind nicht vergleichbar).
* [x] **Ergebnis: 115,6 MiB → 2,12 MiB.** Faktor 55.

### ✅ Phase 3 — Standbild
* [x] Aus dem **ersten Bild der Schleife**, nicht aus einem beliebigen Motiv. Das bisher
      hinterlegte `carcare-hero-workshop.webp` zeigt eine **andere Halle** — das Bild wäre
      beim Anlaufen des Videos sichtbar umgesprungen.
* [x] Die alte Datei bleibt unangetastet: `ExpandingCardAccordion` und `TargetGroupCards`
      nutzen sie als Standardhintergrund.

### ✅ Phase 4 — Einhängen und prüfen
* [x] `data/videos.ts`: `ueber-uns-hero` trägt `quelle` und `poster`.
* [x] `pages/UeberUnsPage.tsx`: `image` kommt jetzt aus dem Videoplatz, damit Standbild
      und Backdrop dieselbe Aufnahme zeigen.
* [x] Im Browser geprüft: läuft, stumm, in Schleife, 1280×720, **läuft beim Scrollen
      weiter** (3,26 s → 4,77 s über einen Scrollvorgang).
* [x] `npm run build` grün, 29/29 Routen, alle Wächter.

### ✅ Phase 5 — Die beiden anderen Videoplätze
**Entscheidung des Kunden am 2026-09-07: Weg (a)** — kurze stumme Schnitte, im Rahmen der
bestehenden Komponente. `BetriebsVideo` bleibt unverändert.

* [x] Schnitte aus derselben Quelle, je Platz eigener Ausschnitt:

  | Platz | Ausschnitt | Inhalt | Größe |
  |---|---|---|---|
  | `ueber-uns-hero` (3.20) | 9,0–21,2 s | Werkstattschwenk, schnittfrei | 2,12 MiB |
  | `ueber-uns-betrieb` (3.21) | 21,5–52,2 s | Waschplatz, Schadenaufnahme, Halle, Karosserie, Lackierkabine | 3,38 MiB |
  | `karriere-betrieb` (3.18) | 46,3–75,9 s | Lackierkabine, Teilevorbereitung, Politur, Hebebühne, Reifenraum | 3,35 MiB |

* [x] Der Arbeitsplatz-Schnitt beginnt bei 46,3 s statt direkt am Schnitt (45,6 s): Davor
      fährt die Kamera an einer Säule vorbei, die halbe linke Bildhälfte ist schwarz.
* [x] **Standbilder je Platz eigens gewählt, nicht das erste Bild** — 31,1 s (weite Halle)
      für den Rundgang, 71,1 s (zwei Kollegen am Fahrzeug) für die Karriereseite. Grund:
      Bei reduzierter Bewegung zeigt die Komponente **ausschließlich** das Standbild. Der
      Sprung beim Autostart dauert Sekundenbruchteile, ein schwaches Standbild bleibt.
* [x] `ANERKANNT` in `scripts/check-dummies.mjs` um vier Zeilen erleichtert — sonst hätte
      der Build gebrochen. Genau der Fall, den Eigenschaft 3 der Liste beschreibt.
* [x] Geprüft: alle drei laufen, stumm, in Schleife, 1280×720, kein Platzhaltertext mehr.
      Build grün, **0 von 3 Videoplätzen noch Platzhalter** (anerkannte Dummies 15 → 11).

**Der Film mit Ton bleibt ungenutzt.** Das ist die Folge von Weg (a) und bewusst so
entschieden. Wer ihn später zeigen will, braucht Weg (b): `BetriebsVideo` auf
Klick-Wiedergabe mit Bedienelementen umbauen.

---

### ✅ Phase 6 — Korrektur: Es lief gar kein Video

**Der Kunde meldete: „Ich wollte doch ein Video und kein statisches Foto."** Er hatte
recht — auf seinem Rechner lief nie eines.

* [x] Ursache gemessen: `HKCU:Control PanelDesktopWindowMetricsMinAnimate = 0`,
      also **Windows-Animationen aus**. Chrome meldet daraufhin
      `prefers-reduced-motion: reduce`, und beide Komponenten trugen
      `motion-reduce:hidden` auf dem `<video>` plus ein `<img>` als Ersatz. Ergebnis:
      Video `display: none`, dauerhaft nur das Standbild.
* [x] **Das widersprach einer bestehenden Projektentscheidung**, Marken-Animationen nicht
      an dieses Flag zu haengen — genau weil Windows es systemweit meldet. Ich hatte das
      Verhalten in Phase 4 als richtig dokumentiert, statt es zu hinterfragen.
* [x] Sperre aus `PhotoBackdrop` und `BetriebsVideo` entfernt, die `<img>`-Ersatzbilder
      mit. Gegenprobe **mit gemeldeter reduzierter Bewegung**: alle drei Videos sichtbar
      (1411×900 bzw. 1278×718) und laufend.
* [x] `npm run kontrast` erneut: **0 unter AA bei 5152 Textstellen** — jetzt gegen das
      tatsaechlich laufende Video gemessen, nicht mehr gegen das Standbild.
* [ ] **Offen, bewusst nicht nebenbei gebaut:** WCAG 2.2.2 verlangt fuer automatisch
      startende Bewegung ueber 5 Sekunden eine Moeglichkeit zum Anhalten. Das Flag war
      bisher diese Moeglichkeit. Ersatz ist ein sichtbares Bedienelement — in
      `BetriebsVideo` einfach, im Hero schwierig, weil die Ebene `pointer-events: none`
      und `-z-10` traegt.

---

## Kommentare

### Phasen 1–5
**Eingehalten:** messen statt schätzen ✅ · Werkzeug statt Wegwerfskript ✅ · Quelle bleibt
außerhalb der Versionierung ✅ · Sichtprüfung vor jeder Auswahl ✅ · DSGVO-Weg bewusst
gewählt ✅ · kein Mojibake ✅

**Auffälligkeiten (nach Schwere):**

1. 🔴 **Kritisch — behoben, betrifft das ganze Projekt.** **Headless Chrome meldet
   `prefers-reduced-motion: reduce` von sich aus.** Gemessen: ohne Schalter `true`, mit
   `--force-prefers-no-reduced-motion` `false`. Folge: Elemente mit `motion-reduce:hidden`
   sind headless `display: none` — **alle bisherigen Bildschirmfotos des Projekts zeigten
   die Standbild-Fassung**, nicht die bewegte. Bei den Videoplätzen also das Poster statt
   des laufenden Videos. Aufgefallen, weil ein Video mit laufender Wiedergabe ein Rechteck
   von `0x0` meldete.
   **Das widerlegt eine bestehende Projektnotiz**, die das Gegenteil behauptete — und die
   ich in Phase 5 des Navigationspakets selbst in `check-navigation.mjs` übernommen hatte.
   **Fix:** `shots.mjs` und `check-navigation.mjs` laufen jetzt mit dem Schalter.
   `check-kontrast.mjs` bleibt bewusst ohne — ein bewegter Hintergrund liefert je
   Einzelbild einen anderen Messwert, und ein Wächter, der bei jedem Lauf etwas anderes
   sagt, ist wertlos. Der Preis steht jetzt im Skript.

2. 🟡 **Mittel — Hinweis.** Die Schleifen haben keinen weichen Übergang am Schleifenpunkt.
   Beim Hero fällt das unter dem dunklen Schleier kaum auf; bei den beiden Karten liegt
   dort ein harter Schnitt des Films selbst, was als Schnitt gelesen wird und nicht stört.

3. 🟢 **Niedrig — offen.** Der gelieferte Ordner enthält **12 Drohnenclips** und 16
   Rohclips, die hier ungenutzt bleiben. Sie decken die offenen Fotopunkte **3.23–3.29**
   vermutlich teilweise ab — Einzelbilder daraus wären besser als gar kein Motiv.

---

**Referenzen:**
`scripts/build-video.mjs`
`data/videos.ts`
`pages/UeberUnsPage.tsx`
