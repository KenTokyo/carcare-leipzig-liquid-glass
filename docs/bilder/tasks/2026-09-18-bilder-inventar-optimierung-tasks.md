# Optimierung zum Bildinventar — Befunde aus dem Rundgang

**Referenz:** [`2026-09-18-bilder-inventar-tasks.md`](2026-09-18-bilder-inventar-tasks.md)
**Angelegt:** 2026-09-18 · **Branch:** `2026-09-18-bilder-inventar`

Die Befunde sind nach Schwere sortiert. `O<n>` sind Nummern **dieser Datei**, keine
Backlog-Nummern. Was André beantworten muss, steht zusätzlich als `R15`/`R16` in
`docs/backlog/offene-punkte-konsolidiert.md`.

| # | Schwere | Befund | Wer | Status |
|---|---|---|---|---|
| O1 | 🟠 Hoch | **Kennzeichen eines Kundenfahrzeugs lesbar** im Karriere-Video und seinem Standbild (B110, B111; Clip etwa Sekunde 22–26). Für den Betrieb ist der Halter bestimmbar, also personenbezogenes Datum. Dazu zeigen alle drei Videos Mitarbeitende (§ 22 KUG) | OALAB · André | → **R16** |
| O2 | 🟠 Hoch | **Herkunft keines Fotos dokumentiert.** Art. 50 KI-VO gilt seit 02.08.2026. Der Backlog nennt selbst ein „KI-Bild“ (2.15) und ein „KI-Bild mit Hammer-Artefakt“ (nicht-relevant.md). Nicht raten, zuordnen lassen | André · User | → **R15**, Rückfrage an den User |
| O3 | 🟠 Hoch | **Stockfoto von Unsplash als Vorschaubild beim Teilen und als Unternehmensbild für Google** (B4–B6). Bekannt als **R7**, liegt bei André | André | Empfehlung: bis zur Lieferung das Startmotiv als 1200 × 630 setzen. Nicht umgesetzt, weil R7 dem Kunden gehört |
| O4 | 🟡 Mittel | **Favicon ist das nicht quadratische Gesamtlogo** (842 × 596, 73 KB WebP). Google zeigt in der Suche nur quadratische Favicons; im Tab wird der Schriftzug auf 16 px gestaucht | OALAB | ✅ erledigt — Phase O-A |
| O5 | 🟢 Niedrig | **Zwei unbenutzte Dateien werden mit ausgeliefert:** `carcare-button-gradient.webp` (Verlauf ist seit Langem reines CSS) und `kacheln/fuhrparkservice-leipzig-carcare.webp` (fast pixelgleich mit `carcare-hero-workshop.webp`, gemessen: mittlere Abweichung 13,6 von 255, fremdes Motiv 80,9) | OALAB | ✅ erledigt — Phase O-B |
| O6 | 🟢 Niedrig | **Die Gegenprobe meldet zwei bekannte Fälle bei jedem Lauf als „bitte prüfen“:** das Ersatzbild `carcare-hero-workshop.webp` (greift nur, wenn einer Karte das Motiv fehlt) und das Unsplash-Foto in `components/Hero.tsx`, das **laut Vorgabe unangetastet bleibt** (`offene-punkte-konsolidiert.md`, Paket G). Wer das jedes Mal liest, überliest irgendwann den echten Fall | OALAB | ✅ erledigt — Phase O-B |
| O7 | 🟢 Info | **Starke Mehrfachnutzung:** `autolackierung` 11×, `fahrzeugaufbereitung` 10×, `smart-repair` 8×. Ein Tausch trifft alle Stellen. Soll nur eine Stelle ein anderes Motiv bekommen, braucht sie eine eigene Datei | User | Hinweis in der Liste |
| O8 | 🟢 Info | **2.15 vielleicht schon erledigt:** „KI-Bild ersetzen – kein Transporter“. Das heutige Innenaufbereitungsmotiv ist ein Kundenmotiv mit Ferrari (Commit `de2069b`, 23.07.2026) | André | im Motiv-Eintrag vermerkt |
| O9 | 🟢 Info | **`DESIGN.md` 5.1 beschreibt noch `Hero.tsx`** als Hero-Komponente. Tatsächlich rendert `HeroSection.tsx`. Verbindliche Datei, deshalb nicht eigenmächtig geändert | User | Hinweis |
| O10 | 🟠 Hoch | **Der Push-Stand übersah diese Planung.** Beim Push am 20.09.2026 meldete `npm run push-stand` „keine offenen Folgepunkte", obwohl Phase O-C ein offenes Kästchen trägt: Der Generator erkannte nur `### ⬜`, nicht `### ⏸️`. Ein zurückgestellter Punkt wäre damit an anderen Standorten unsichtbar gewesen — der Wächter prüfte die Schreibweise der Überschrift, nicht den Stand der Arbeit (`CLAUDE.md`: „notwendig, aber nicht hinreichend") | OALAB | ✅ **fixed 2026-09-20** — `scripts/push-stand.mjs` zählt `⏸️` mit und kennzeichnet es in der Tabelle; gegengeprüft: O-C erscheint jetzt |

---

### ✅ Phase O-A — Favicon quadratisch (O4) · fixed
* [x] `scripts/build-favicons.mjs` (`npm run favicons`) erzeugt aus dem freigestellten Siegel `carcare-center-favicon-48.png` (2,7 KB), `-192.png` (15,6 KB) und `carcare-center-apple-touch-icon.png` (180 px, weiß hinterlegt, 12 % Rand, ohne Alphakanal, 8,2 KB), alle als Palette-PNG. Bricht ab, wenn die Quelle nicht quadratisch ist
* [x] Sichtprüfung der drei Dateien (Siegel sauber, kein Halo, Apple-Icon mit Rand gegen die iOS-Rundung)
* [x] `index.html`: drei Icon-Links statt des Gesamtlogos, mit Begründung im Kommentar
* [x] Kontrolle im ausgelieferten HTML: Nach frischem Build meldet `npm run bilder` alle drei Dateien als „Favicon (Browser-Tab), alle Seiten“; das Gesamtlogo steht nur noch als Logo-Plakette in Karten
**Referenzen:**
`scripts/build-favicons.mjs`
`index.html`

### ✅ Phase O-B — Aufräumen (O5, O6) · fixed
* [x] `carcare-button-gradient.webp` und `kacheln/fuhrparkservice-leipzig-carcare.webp` per `git rm` entfernt (zusammen 152 KB weniger im Deploy), Einträge in `motive.json` ebenso
* [x] `motive.json` → `bekannt` mit zwei begründeten Fällen (Ersatzbild, `Hero.tsx`). Das Skript listet sie unter „Bekannt und begründet“; nur neue Fälle erscheinen als 🟠 „bitte prüfen“. Ein `bekannt`-Eintrag, der nicht mehr zutrifft, wird in der Konsole gemeldet
* [x] Veraltetes `dist/` wird erkannt: Lauf mit Exit 1 verweigert (offen aus Phase 3, jetzt belegt)
**Referenzen:**
`docs/bilder/motive.json`
`scripts/bilder-inventar.mjs`

### ⏸️ Phase O-C — Kennzeichen im Karriere-Video (O1, Teil OALAB) · bewusst zurückgestellt
* [x] Befund belegt: Kennzeichen im Standbild (71,1 s der Quelle) und im Clip etwa Sekunde 22–26 lesbar; Quelle `CarCare .mov` liegt lokal bereit, `npm run video` baut reproduzierbar
* [x] **Zurückgestellt mit Grund:** Dasselbe Video zeigt Mitarbeitende erkennbar. Fehlt deren Einwilligung (R16, André), muss der Ausschnitt ohnehin ersetzt werden, und eine Unkenntlichmachung wäre verlorene Arbeit. Nur das Standbild zu entschärfen, täuschte Sicherheit vor: Das Video zeigt das Kennzeichen trotzdem
* [ ] Nach Andrés Antwort: Weichzeichnung als Zeitfenster mit Position in `scripts/build-video.mjs` (Schnitt `karriere-betrieb`), Standbild aus der entschärften Fassung, Kontrolle Bild für Bild im Kontaktbogen `output/video-pruef/`

---

### ✅ Endlauf
* [x] `npm run build` grün (inkl. `tsc`, Prerender 29 Routen, Nummernraum-Wächter), danach `npm run bilder`: 100 Bildstellen, B1–B111, **0 Abweichungen** zu den Nummern des ersten Laufs (fünf Läufe insgesamt)
* [x] Gegenprobe sauber: 42 Dateien, 41 gesehen, 1 bekanntes Ersatzbild, 0 unbenutzt, nichts Neues „im Code, nicht gesehen“
* [x] Kontaktbogen per Puppeteer geprüft (1280 und 390 px): 111 Einträge, 97 mit Vorschau (111 − 11 Platzhalter − 3 extern), kein Querüberlauf, Suche „ferrari“ trifft genau B19–B22, B27, B45, B67, B103, B108, B109
* [x] Mobil nachgebessert: Datum bricht nicht mehr mitten durch, Nummer steht oben; Kürzung an Wortgrenzen

---

## Kommentare

### Phase O-A
**Eingehalten**: Messen statt Schätzen ✅ (Maße, Kanäle, Sichtprüfung), reproduzierbares Skript statt Einzelbearbeitung ✅, unter 700 Zeilen ✅ (63)
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig · fixed:** Die 192-px-Datei wog in voller Farbtiefe 46,8 KB. **Eigene Annahme korrigiert:** Ich hatte zuerst notiert, eine Palette-PNG zeige im Kugelverlauf Streifen, ohne es zu prüfen. Gemessen: 15,6 KB, in doppelter Vergrößerung kein sichtbarer Unterschied. Alle drei Favicons jetzt als Palette-PNG

### Phase O-B
**Eingehalten**: Vorgaben aus dem Backlog vor dem Löschen gelesen ✅ (`Hero.tsx` bleibt), gelöscht nur, was weder angezeigt noch im Code steht ✅, bekannte Fälle mit Begründung statt stummgeschaltet ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig:** `carcare-hero-workshop.webp` (419 KB) wird nie angezeigt, aber mit ausgeliefert, weil drei Komponenten es als Rückfall nennen. Browser laden es nicht, solange keine Karte ohne Motiv ist; bewusst belassen

### Phase O-C
**Eingehalten**: nicht halb gefixt ✅ (nur das Standbild zu entschärfen täuschte Sicherheit vor), Befund mit Zeitfenster und Weg übergeben ✅

## Nächste sinnvolle Schritte
1. **Bildtausch nach Andrés Liste:** B-Nummern durchgeben → je Nummer prüfen, ob die Datei mehrfach steht; wenn nur eine Stelle gemeint ist, eigene Datei anlegen
2. **R7 als Zwischenlösung:** Startmotiv als Vorschaubild 1200 × 630 (JPEG) für B4–B6, bis André ein eigenes liefert
3. **Zuordnungsbogen für die Fotolieferung vom 10.09.:** Kontaktbogen der gelieferten Fotos mit Vorschlag, welche B-Nummer oder welcher Platzhalter (B48–B58, Backlog 3.23) damit gefüllt wird
4. **R16 nach Andrés Antwort:** Kennzeichen in `npm run video` unkenntlich machen oder den Ausschnitt tauschen
