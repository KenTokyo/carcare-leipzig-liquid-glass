# Überschriften in den Textkacheln ohne Silbentrennung

**Auftrag (User, 2026-10-03):** „Nun kümmere dich um die Umbrüche der Überschriften in den Textkacheln, welche wir für die
Services oder Aufbereitungsservices genutzt haben. Ich möchte keine Bindestriche für die Trennung von Wörtern nutzen.“
**Gemeint:** die weißen Textkacheln der aufklappenden Karten (`components/ExpandingCardAccordion.tsx`). Sie stehen auf der
Startseite in der Leistungsübersicht (`ServiceGrid`) und bei „Autoaufbereitung ist mehr als Reinigung“
(`AutoDetailingExpertiseSection`); dieselbe Komponente trägt die Stellenkarten auf `/karriere`. Weitere Kachelüberschriften
für Leistungen (Leistungskarten, Preiskacheln) prüft die Messung mit.
**Branch:** `2026-10-02-stimmen-zusatzregeln` · **Wunsch des Users:** keine lange Prüfung, Abschlusstest macht der User.

## Bestandsaufnahme vor dem Code
- Die Überschrift der Kachel hat seit Backlog 5.25 (27.09.) `hyphens-auto break-words`. Der Grund war
  „Fahrzeugbaumechaniker/in“: Es ist bei 24 px breiter als die 252 px der Kachel und lief über ihren Rand. Seitdem trennt
  der Browser nach deutscher Silbenregel, zum Beispiel „Fahrzeugaufberei-tung“, „Unfallinstand-setzung“ oder
  „Hagelschaden-reparatur“.
- Mit `hyphens: none` allein lägen die langen Wörter wieder über dem Kachelrand. Dazu bräche `break-words` sie ohne
  Strich mitten im Wort, und das ist genauso eine Worttrennung.

**Lösungswege:**
- (a) Schrift überall kleiner (`text-xl`). Am Desktop passte dann jedes Wort, mobil bei 320 px nicht. Kurze Titel würden
  ohne Not kleiner.
- (b) Kachel breiter. Mobil liegt rechts das Logo, die Kachel lässt 22 % frei. Am Desktop wäre die Kachel breiter als nötig.
- (c) ✔ **Schrift passt sich dem längsten Wort an**, nur wo nötig.
  - Die Kachel wird Container (`container-type: inline-size`).
  - Die Schriftgröße ist `min(Normalgröße, verfügbare Breite ÷ Breite des längsten Wortes in em)`.
  - Kurze Titel bleiben unverändert groß, lange werden genau so weit kleiner, dass das Wort in eine Zeile passt.
  - Umbrochen wird nur an Leerzeichen. Jedes Wort ist für sich unteilbar, auch an „-“ und „/“ („Kfz-Aufbereiter/in“).
  - Keine Trennstriche, keine Notumbrüche, kein Überlauf.
  - Wortbreite in em: je Zeichen gemessen in Space Grotesk Bold mit `tracking-tight` (Tabelle im Code), nicht geschätzt.
- (d) Schriftgröße per JavaScript messen und setzen. Das wäre genau, braucht aber geladene Schrift, ResizeObserver und
  ein Nachrücken nach dem ersten Bild. (c) erreicht dasselbe mit CSS.

### ✅ Phase 1 — Messen (vorher)
* [x] Puppeteer gegen den Dev-Server: jede Überschrift (h1–h4) auf allen 28 Seiten der Sitemap, 5 Breiten (320, 390, 1024,
      1440, 1920). Gemeldet wird jedes Wort, das über zwei Zeilen läuft (`Range.getClientRects`), dazu Überlauf.
* [x] **162 getrennte Wörter:**
  * 42 in Akkordeon-Kacheln, auch am Desktop: „Hagelschadenreparatur“, „Reparaturlackierung“, „Fahrzeugbau·mechaniker“
    (weiche Trennstelle), „Industrie·kaufmann/-frau“, „Scheibenfolien“, „vorbereiten“.
  * 40 in weiteren Kacheln: Preis-, Merkmals-, Ablauf- und FAQ-Kacheln, etwa „Cabrio-Verdeckimprägnierung“,
    „Antihologramm-Bearbeitung“, „Versicherungsabwicklung“, „TÜV-konform“.
  * 55 in Seitentiteln (H1), auch am Desktop: „Fahrzeugaufbe-reitung“, „repa-riert“, „verständ-lich“.
  * 23 in Abschnittstiteln (H2), dort an Bindestrichen: „Full-/Service“, „ISO-9001-/zertifiziert“.
  * 2 im Zeitstrahl.
  * Kein Überlauf.
### ✅ Phase 2 — Umsetzen
* [x] `components/GanzwortTitel.tsx` (neu): Umbruch nur an Leerzeichen, jedes Wort in einem `nowrap`-Teil, Einzelzeichen
      („/“, „&“) am Wort davor. Schriftgröße `min(Normalgröße, 100cqi ÷ Wortbreite)`. Die Zeichenbreiten stammen aus Space
      Grotesk Bold, per Canvas gemessen. Die Summe liegt 0,4–1,8 % über der echten Breite, dazu kommen 2 % Reserve.
      `mindestens16px` lässt in einer Flex-Zeile den Nachbarn umbrechen.
* [x] `ExpandingCardAccordion`: Titel über `GanzwortTitel` (Punkt im selben `nowrap`-Teil, `-mr-3` als Hülle). Die
      Wortverbinder-Logik von 5.25 ist entfallen
* [x] Weitere Kachelüberschriften: `FeatureGrid`, `ProcessList`, Preiskachel (Titel und Preis jetzt in umbrechender
      Zeile, der Preis rutscht bei wenig Platz unter den Titel), `PageFAQ`, `LeistungsKarten`, Innenaufbereitung
      (Alcantara, Schaum), Fahrzeugaufbereitung (Bereiche)
* [x] Ausgeweitet auf `PageHero` (H1) sowie `SectionIntro` und `PageCTA` (H2). Die Messung zeigte dort dieselbe Trennung,
      sogar am Desktop. Die Ausnahme `ohneTrennung` (Karriere) ist entfallen, weil sie jetzt für alle gilt
* [x] **Bewusst nicht:** Zeitstrahl `Timeline.tsx` (Über uns). Seine Spalten sind bei 1024 px innen 106 px breit,
      „Kfz-Aufbereitungsbetrieb“ bräuchte dort rund 8 px Schrift. Die Startseiten-H1 (`HeroSection`) hat eigene weiche
      Trennstellen (5.5) und trennt gemessen nicht. `ScrollPinnedProcess` trennt ebenfalls nicht, weil seine Titel kurz
      sind
### ✅ Phase 3 — Messen (nachher) und Doku
* [x] Dieselbe Messung, alle 28 Seiten × 5 Breiten: **2 statt 162 getrennte Wörter, 0 Überlauf.** Beide verbliebenen sind
      „Smart-/Repair“ im Zeitstrahl auf `/ueber-uns` (bewusste Ausnahme, Phase 2). In Kacheln, H1 und H2 ist kein Wort
      mehr getrennt
* [x] Bildschirmfotos und Schriftgrößen der längsten Titel:
  * Startseite „Hagelschadenreparatur“: 22,6 px bei 1440, 18,7 px bei 390 (Normalgröße 24 bzw. 20).
  * „Neu- und Reparaturlackierung“ bei 320 px: 16,1 px.
  * Karriere „Karosserie- und Fahrzeugbaumechaniker/in“: 19,8 bzw. 16,4 px.
  * H1 „Hagelschadenreparatur in Leipzig.“ bei 320 px: 22,8 px statt 36, zwei Zeilen, ganze Wörter.
  * Preiskachel „Cabrio-Verdeckimprägnierung“: bei 320 px 13,8 px, der Preis darunter. Ab 1024 px 18 px, der Preis
    daneben.
* [x] `tsc` grün · **Build 03.10., 03:14:39** grün (Prerender 29/29, FAQ-Wächter 242 Texte trotz Wortteilen im HTML,
      Dummies, Gedankenstriche 0) · Kommentare (5.25 in `ExpandingCardAccordion`, H1 in `PageBlocks`) · Memory
      `ueberschriften-ohne-trennung`

---

## Kommentare
### Phasen 1–3
**Eingehalten**: vorher und nachher gemessen statt geschätzt (162 → 2) ✅, eine Komponente statt vieler Einzellösungen ✅,
keine Trennstriche, keine Notumbrüche, kein Überlauf ✅, Text im HTML unverändert (Suche, FAQ-Schema) ✅, unter 700 Zeilen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Zeitstrahl auf „Über uns“ trennt weiter** („Smart-/Repair“). Das ist bewusst so, denn die Spalten sind bei
   1024 px innen 106 px breit. Ganz ohne Trennung braucht es ein anderes Spaltenlayout (z. B. ab `lg` zwei Reihen à drei
   Stationen). Vorschlag an den User.
2. 🟢 **Niedrig — kleinere Schrift auf sehr schmalen Geräten**: Bei 320 px wird ein langes Wort kleiner, damit es ganz
   bleibt. Die H1 „Hagelschadenreparatur in Leipzig.“ hat dann 22,8 px statt 36, die Preiskachel „Cabrio-…“ 13,8 px.
   Ab 360 px sind es in Kacheln mindestens rund 16 px.
3. 🟢 **Niedrig — die Zeichentabelle hängt an der Schrift.** Bei einem Schriftwechsel muss sie neu gemessen werden. Das
   steht im Kopf von `GanzwortTitel`.
