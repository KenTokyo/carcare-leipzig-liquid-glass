# Kontrastbefunde aus dem ersten Gesamtlauf

**Angelegt:** 2026-09-06
**Auslöser:** `npm run kontrast` ist am 2026-09-06 ins Repo gekommen (Paket G) und lief
zum ersten Mal über **alle** Routen: **4.538 Textstellen auf 29 Routen, 2 Breiten,
4 Scrollpositionen. 23 davon unter WCAG AA.**
**Status:** ✅ **abgeschlossen am 2026-09-07** — 0 Stellen unter AA.
16 der 17 Befunde waren **Messartefakte**, einer war echt. Siehe unten.

---

## Der Befund ist EIN Problem, nicht 23

Sortiert man die Treffer nach ihrem gemessenen Hintergrund, fällt sofort auf:

| gemessener Hintergrund | was das ist |
|---|---|
| `rgb(78 100 127)` · `rgb(82 104 130)` · `rgb(88 106 128)` | das **Foto** |
| `rgb(116 125 134)` · `rgb(131 131 132)` · `rgb(146 161 178)` | das **Foto** |
| `rgb(246 249 252)` | `bg-gray-50/70` — nur die zwei eigenen Treffer |

**21 von 23 Stellen liegen über dem stehenden Hintergrundfoto** (`BackdropLayout` /
`PhotoBackdrop`). Der weiße Textschutz (`cc-guard-wide`) reicht dort an einzelnen
Scrollpositionen nicht aus — besonders **mobil**, wo die Textspalte über die volle
Breite läuft und der Verlauf sich auf die Viewportbreite bezieht.

**Das ist derselbe Fehler wie in Paket C** (2026-09-03, vier Leistungsseiten). Er wurde
damals nur an den vier gemessenen Seiten behoben, nicht an der Ursache. Jetzt, mit einem
Messwerkzeug über alle Routen, zeigt sich die volle Ausdehnung.

### Drei Untergruppen

1. **Dunkler Fließtext über Foto** (13 Stellen) — `rgba(21,26,33,0.72)` bzw. `0.84`,
   14–16 px. Betroffen: `/karriere`, `/fuhrparkservice-leipzig`,
   `/autolackierung-leipzig`, `/ueber-uns`, `/innenaufbereitung-leipzig`,
   `/aussenaufbereitung-leipzig`, `/privatkunden`, `/felgenreparatur-leipzig`,
   `/kontakt`, `/geschaeftskunden`, drei Wissensbeiträge.
2. **Weiße Schrift auf dem Verlaufsknopf über Foto** (4 Stellen) — „Anfrage absenden",
   „Bewerbung senden". `rgb(255,255,255)` auf `rgb(144…161)`. Der Knopf ist
   halbtransparent und lässt das Foto durch.
3. **Blaue Schrift auf Foto** (1 Stelle) — „Artikel lesen", `rgb(11,61,145)` auf
   `rgb(150 158 165)`, 3.70:1.

Dazu **1 Sonderfall:** Die Hero-Subline der Startseite (`rgb(216,232,255)` auf
`rgb(131,131,132)`, 3.05:1). ⚠️ **Hier misst das Werkzeug zu streng:** Der Hero trägt
`drop-shadow`, das die Lesbarkeit real verbessert, in der Kontrastformel aber nicht
vorkommt. Vor einer Änderung erst mit dem Auge prüfen.

---

## Was schon behoben ist

* [x] **Mitarbeiterstimmen auf `/karriere`** (4.21:1 → geprüft). Die Berufsbezeichnung
      stand auf `text-gray-500`; bei 10 px, weit gesperrt, auf `bg-gray-50/70` bleibt
      davon keine Reserve. Jetzt `tex## Was getan wurde

> **Die Ausgangsthese war falsch.** Der Kopf dieser Datei sortiert die Befunde nach
> gemessenem Hintergrund und schliesst daraus auf den Fotoschutz. Eine Nachrechnung am
> 2026-09-07 hat das widerlegt: Der schlechteste gemessene Hintergrund war
> `rgb(72 94 122)`. Bei 73 % Mindestdeckung des Schutzes — selbst über schwarzem Foto
> läge das Ergebnis dann bei mindestens 186 — ist so ein Wert **rechnerisch unmöglich**.
> Die Stellen lagen also gar nicht über dem Seitenfoto.

### ✅ Phase 1 — Erst messen, wo der Wert herkommt
* [x] Deckungsprofil des Schutzes über schwarzem Grund aufgenommen (Motiv ausgeblendet,
      Fläche schwarz → gemessen wird 255 × Alpha). Ergebnis: mobil nie unter 73 %,
      Desktop mit einem Loch bei x≈70 %, y≈50 % (29 %) — der bewusst transparenten
      Mitte des Radialverlaufs.
* [x] Damit war klar: Der horizontale Schutz aus Paket C ist in Ordnung und wird **nicht**
      angefasst. Er misst am Hero weiterhin 4.99–5.29:1.
* [x] Die schlimmste Stelle einzeln aufgesucht (`/karriere`, mobil, y=8626): Der Text
      steht **hinter der fixierten Aktionsleiste**. `rgb(72 94 122)` ist deren Verlauf.

### ✅ Phase 2 — Das Messwerkzeug ehrlich machen
**Ziel:** Erst wenn die Liste stimmt, darf am Design etwas geändert werden.
* [x] **Überdeckung durch fixierte Leisten** wird erkannt. Die Trefferprobe nutzte
      `elementFromPoint`; die Aktionsleiste trägt `pointer-events: none` und war für sie
      unsichtbar, malte aber darüber. Genau die im Kopf des Skripts notierte Falle 4.
      Jetzt zählen fixierte Elemente mit `z-index ≥ 1` **und eigener Fläche** als Decker —
      die Flächenbedingung ist nötig, sonst verschlucken der dekorative Rahmen (z 50) und
      die Analyse-Ebene (z 2147483647) jede Textstelle.
* [x] **Inaktive Bedienelemente** werden ausgenommen. WCAG 1.4.3 tut das ausdrücklich.
      Der Absendeknopf ist gesperrt, solange die Zugangsdaten fehlen (**R10**), und trägt
      dabei `opacity-50` — darunter scheint das Foto durch.
* [x] Kopfkommentar fortgeschrieben: zwei neue Einschränkungen benannt, statt die alte
      stillschweigend zu streichen.

**Wirkung: 17 Befunde → 1.** Fuenf waren überdeckt, vier waren gesperrte Knöpfe, sieben
weitere ebenfalls überdeckt. Keiner davon war ein Kontrastfehler.

### ✅ Phase 3 — Der eine echte Befund
* [x] Hero-Subline der Startseite, `rgb(216,232,255)` auf `rgb(130,130,131)`, 3.09:1.
      Der Kopf dieser Datei hatte ihn als „zu streng gemessen" markiert (`drop-shadow`).
      **Mit dem Auge gegengeprüft, wie dort verlangt: Der Befund ist echt.** Die Zeile
      „und Fahrzeugaufbereitung — alles aus" läuft über das rote Auto und ist dort
      schlecht zu lesen.
* [x] Gerechnet statt geraten: Auf diesem Grund erreicht **selbst reines Weiß nur
      3.84:1**. Farbe allein konnte es nicht lösen, der Grund musste rund 20 % dunkler.
* [x] Gelöst über den mittleren Stopp von `hero-radial-veil`: 40 % → 55 %. Der Stopp
      **wandert**, der Wert steigt nicht — so verdichtet sich der Verlauf dort, wo die
      Schrift steht, statt das Motiv insgesamt abzudunkeln. Grund danach gemessen:
      `rgb(74,68,77)`.

### ✅ Phase 4 — Nachmessen
* [x] `npm run kontrast` über alle Routen: **5147 Textstellen, 0 unter AA.**
* [ ] `--strikt` im Build erwägen. **Bewusst noch nicht:** Der Hero auf `/ueber-uns`
      trägt seit 2026-09-07 ein Video statt eines Fotos. Ein bewegter Hintergrund liefert
      je Bild einen anderen Messwert — ein Build, der daran bricht, wäre unzuverlässig.
      Erst klären, wie das Werkzeug mit Video umgeht.

---

## Kommentare

### Phasen 1–4
**Eingehalten:** messen statt schätzen ✅ · Ursache vor Symptom ✅ · schwächste Variante,
die trägt ✅ · Pflichtfrage zum Wächter beantwortet ✅ · Sichtprüfung vor Änderung ✅

**Auffälligkeiten (nach Schwere):**

1. 🔴 **Kritisch — der Wächter log, und zwar in beide Richtungen.** 16 von 17 Befunden
   waren falsch. Hätte man sie „repariert", wäre der Fotoschutz massiv verstärkt worden —
   also genau die Gestaltung beschädigt, die der Kunde abgenommen hat, gegen ein Problem,
   das es nicht gab. Ein Wächter mit 94 % Fehlalarm ist schädlicher als keiner.
   Deckt sich mit `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`.

2. 🟠 **Hoch — behoben, aber außerhalb dieser Planung gefunden.** Die H1 der Startseite
   lief auf dem Telefon aus dem Kasten: 32 px Überlauf bei 390 px, 62 px bei 360 px,
   102 px bei 320 px. Die `hero-card-shell` hat `overflow-hidden`, die Seite scrollte
   also **nicht** horizontal — das Wort wurde still abgeschnitten. Aufgefallen nur beim
   Bildschirmfoto zur Subline. `hyphens-auto` + `break-words`, `<html lang="de">` steht.

3. 🟡 **Mittel — offen, Folgefrage.** Vier Befunde waren gesperrte Absendeknöpfe. WCAG
   nimmt sie aus, aber ein Knopf, der über einem Foto zu `opacity-50` verblasst, ist auch
   im gesperrten Zustand schwer zu lesen. Sobald **R10** erledigt ist, ist die Frage weg;
   bis dahin bleibt es eine Gestaltungsfrage, keine Rechtsfrage.

---

Fehler zu
wiederholen, den Paket C dokumentiert hat — punktuell reparieren statt die Ursache
anfassen.

**Referenzen:**
`scripts/check-kontrast.mjs`
`docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`
`components/PhotoBackdrop.tsx`
