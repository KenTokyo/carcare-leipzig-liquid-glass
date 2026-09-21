# Vermerke in der Bildliste + Kennzeichnung der KI-Bilder

**Angelegt:** 2026-09-21 · **Branch:** `2026-09-18-bilder-inventar`
**Auftrag des Users (2026-09-20/21):**
1. B4–B6 auf die To-do-Liste (Vorschaubild kommt später).
2. Vermerk „Anzupassen“ auf 30 Bildstellen: B10, B23, B26, B27, B28, B29, B34, B36, B37, B47,
   B48–B58, B84, B85, B95, B103, B105, B106, B107, B108, B109.
3. Kennzeichnung am Bild: **alles außer den Videos zunächst „KI-generiert“**, ein Marker je Bild,
   sichtbar, aber dezent. Welche Motive nur aufgewertet sind, folgt später.

**Referenzen:** [`2026-09-18-bilder-inventar-tasks.md`](2026-09-18-bilder-inventar-tasks.md) ·
Skill `ki-bildkennzeichnung` · Backlog **R15**

---

### ✅ Phase 1 — Vermerke in der Liste
**Ziel:** Die Wünsche des Kunden stehen an der Bildstelle, nicht in einer Chatnachricht.
* [x] `docs/bilder/motive.json` → `stellen`: 30 × `anzupassen`, 3 × `todo` (B4–B6, Notiz „Echtes Vorschaubild statt Unsplash-Stockfoto, Backlog R7“)
* [x] `scripts/bilder-inventar.mjs`: Spalte **Vermerk** je Zeile, Sammelzeilen im Überblick, Zeichen an den Nummern der Datei-Tabelle
* [x] Kontaktbogen: farbige Plakette an der Zeile, über das Suchfeld findbar („anzupassen“)
* [x] **Wächter:** Ein Vermerk auf einer Nummer, die es nicht gibt (Tippfehler), bricht den Lauf mit Fehler ab — sonst verschwände der Wunsch still
* [x] Lauf: 30 + 3 Vermerke gesetzt, keine unbekannte Nummer
**Referenzen:**
`docs/bilder/motive.json`
`scripts/bilder-inventar.mjs`

### ✅ Phase 2 — Kennzeichnung am Bild
**Ziel:** Jedes fotorealistische Motiv trägt sichtbar seine Herkunft (Art. 50 KI-VO, seit 02.08.2026).
* [x] `data/bildherkunft.ts` als einzige Quelle: Standard `generiert`, Ausnahmen für Videos und ihre Standbilder, Grafiken und externe Bilder tragen nie eine Plakette
* [x] `components/KiMarke.tsx` + `.cc-ki-marke` in `index.css`: 10 px, Chip mit deckendem Grund (Kontrast gerechnet, nicht geschätzt), `pointer-events: none`
* [x] Eingebaut an sieben Stellen: Startmotiv (`HeroSection`), Seitenhintergrund (`BackdropLayout`), Karten (`ExpandingCardAccordion`, `ScrollPinnedProcess`, `TargetGroupCards`, `LeistungsKarten`), Fußzeile (`Footer`)
* [x] Nicht gekennzeichnet: Videos und Standbilder (echte Aufnahmen), Logos und Siegel (keine fotorealistische Darstellung), Sektionshintergründe, die nur das Bild der aktiven Karte spiegeln (dieselbe Datei trägt die Plakette bereits auf der Karte)
* [x] `tsc --noEmit` grün
**Referenzen:**
`data/bildherkunft.ts`
`components/KiMarke.tsx`
`index.css`

### ✅ Phase 3 — Sichtprüfung und Messung
* [x] Bildschirmfotos Desktop + Smartphone: Startmotiv, Leistungskarten, Seitenhintergrund, Karriere, Fußzeile — Plakette 79 × 19 px, 10 px Schrift, sitzt überall frei
* [x] Sichtbarkeit **am Bild gemessen**, nicht am DOM: Aufnahme mit und ohne Plakette, Pixelvergleich je Plakette. Zwei Fehlversuche vorher: `elementFromPoint` übergeht `pointer-events: none`, und es meldet auch völlig durchsichtige Elemente als Überdeckung
* [x] Gestapelte Zielgruppenkarten: Plakette erreicht 70 (Desktop) bzw. 115 (mobil) mittlere Abweichung, sobald die Karte steht — also klar sichtbar
* [x] `npm run kontrast`: **drei Befunde durch die Plakette**, alle in den scroll-gepinnten Ablauf-Sektionen (Karten blenden über, Plakette zeitweise bei 33–67 % Deckkraft) → Plakette an die feststehende Kartenbühne verschoben, danach **5199 Textstellen, 0 Befunde durch die Kennzeichnung**
* [x] Mobil überlagerte die Plakette in den Zielgruppenkacheln die Partnerliste (die weiße Karte deckt das Foto dort bis auf 20 px ab) → unterhalb `lg` in die Kartenkopfzeile, mit Vorsatz „Foto:“
* [x] Neuer Build grün, `npm run kontrast`: **5186 Textstellen, 0 unter AA** · `npm run bilder`: 111 Stellen, **0 Abweichungen** bei den Nummern, 30 + 3 Vermerke stehen
* [x] Kennzeichnung im ausgelieferten HTML gezählt: Startseite 29, Unfallseite 9, Karriere 8, Über uns 7, Kontakt 1 (Fußzeile)

### ⬜ Phase 4 — offen, braucht Angaben des Users
* [x] **Teilantwort 2026-09-21:** Die 11 Fotos und das Lackiervideo der Lieferung „Neue Fotos Schleife September“ sind laut User **echt, weder KI-generiert noch -bearbeitet** → in `data/bildherkunft.ts` als `echt` eingetragen (keine Plakette), in den Dateien maschinenlesbar als IPTC `digitalCapture`. Die umbenannten Altmotive (`lackierkabine-…`, `fahrzeugabgabe-…`) bleiben unter dem Standard. Einbau: [`2026-09-21-bildtausch-lieferung-september-tasks.md`](2026-09-21-bildtausch-lieferung-september-tasks.md)
* [ ] Welche der **übrigen** Motive sind **nur aufgewertet** (dann „KI-bearbeitet“) und welche vollständig erzeugt? Eintrag je Datei in `data/bildherkunft.ts`. Dabei sinnvoll: den KI-Motiven im Gegenzug `DigitalSourceType = trainedAlgorithmicMedia` (bzw. `compositeWithTrainedAlgorithmicMedia`) in die Datei schreiben — das Gegenstück zu den echten Fotos
* [ ] Mit welchem Werkzeug erzeugt? (für die Nutzungsrechte und die Erklärseite)
* [ ] Seite **Bildnachweise** mit Fußzeilenlink, Kurzverweise in Impressum und Datenschutzerklärung (Stufe 1 und 3 des Skills). Erst sinnvoll, wenn die Herkunft je Bild feststeht
* [ ] Herkunft zusätzlich in die `alt`-Texte, damit Vorlesegeräte sie mitlesen

---

## Kommentare

### Phase 1
**Eingehalten**: Wünsche als Daten statt im Chat ✅, Wächter gegen Tippfehler bei Nummern ✅, Nummern unverändert ✅
**Auffälligkeiten:** keine.

### Phase 2
**Eingehalten**: eine Quelle für die Herkunft ✅, Herkunft nicht geraten ✅ (Vorgabe des Users übernommen, Videos ausgenommen), unter 700 Zeilen ✅, Grafiken und Logos bewusst NICHT gekennzeichnet ✅ (eine falsche Kennzeichnung wäre derselbe Mangel wie eine fehlende)
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch · fixed:** Plakette in den überblendenden Ablaufkarten fiel zeitweise unter den AA-Kontrast (33–67 % Deckkraft). An die feststehende Bühne verschoben
2. 🟡 **Mittel · fixed:** Mobil lag die Plakette der Zielgruppenkacheln auf der Partnerliste — die weiße Karte deckt das Foto dort bis auf 20 px ab. Jetzt in der Kartenkopfzeile mit „Foto:“
3. 🟢 **Niedrig:** Am Desktop tragen eingeklappte Akkordeon-Streifen (82 px breit) keine Plakette; sie zeigen nur einen Bildstreifen hinter einem dunklen Verlauf. Die aufgeklappte Karte trägt sie. Mobil tragen alle Karten sie

### Phase 3
**Eingehalten**: am Bild gemessen statt am DOM ✅, Pflichtmessungen gelaufen ✅, eigene Fehlversuche dokumentiert ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (eigener Messfehler, zweimal):** `elementFromPoint` übergeht Elemente mit `pointer-events: none` und meldet durchsichtige Elemente als Überdeckung. Beide Male hätte die Messung „alles verdeckt“ behauptet, obwohl die Plakette sichtbar war. Erst der Pixelvergleich mit und ohne Plakette trug
2. 🟢 **Niedrig:** Der Kontrastwächter meldete einmal einen Partnernamen am Verlaufsrand (nicht von dieser Änderung), im nächsten Lauf nicht mehr → **R17** im Backlog
