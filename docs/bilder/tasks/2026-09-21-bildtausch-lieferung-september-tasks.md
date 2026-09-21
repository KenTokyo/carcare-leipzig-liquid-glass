# Bildtausch nach Andrés Liste: Lieferung „Neue Fotos Schleife September“

**Angelegt:** 2026-09-21 · **Branch:** `2026-09-18-bilder-inventar`
**Quelle der Fotos:** `…/Kunden/CarCare-Center/Fotos/Neue Fotos Schleife September/` (außerhalb des Repos,
wie beim Betriebsvideo). Benannt nach dem Muster `ziel.webp.jpeg`, das `npm run images` erwartet.

**Auftrag des Users (2026-09-21), je B-Nummer:**

| Stelle | Wunsch | Umfang laut User |
|---|---|---|
| B10 | Foto `Unfallinstandsetzung…` | **alle** Stellen, die das B10-Bild nutzten (B10, B36, B37, B77, B85, B95; B105 bekommt ein eigenes) |
| altes B10-Bild | „kann im Hintergrund bleiben und dort genutzt werden, wo über Versicherungsschäden gesprochen wird“ | → **B20** Schadenaufnahme (Rückfrage beantwortet, Phase 9) |
| B11 | Video `Video - Lackieren.mov`, umbenennen, fürs Web optimieren | **nur Startseite** (Datenvolumen) |
| übrige Autolackierungs-Stellen | Foto `autolackierung…` (gleicher Name) | wo über Autolackierung gesprochen wird |
| B13 | Foto `dellenentfernung…` (gleicher Name) | überall |
| B23 | Foto `ersatzwagen…` (gleicher Name) | **nur B23** |
| B26 | Foto `autohaueser-und- fuhrparks…` (gleicher Name) | überall (B26, B84) |
| B27 | Foto `innenaufbereitung…` (gleicher Name) | überall (B27, B45, B67; B103 bekommt ein eigenes) |
| B28 | Motiv `Lackaufbereitung…` (war nur Platzhalter) | B28, nach Rückfrage auch B46, B66 und B47 |
| B29 | `leasingrueckgabe-aufbereitung…` | überall, wo das bisherige B29-Foto **für diesen Servicepunkt** stand (nur B29) |
| B31, B33 | Vermerk „In Ordnung“ | — |
| B34 | `Aufbereitung-aktiv…` | nur B34 („ab hier auf meine Kommentare achten, im Zweifel fragen“) |
| B48–B58 | kommen später | — |
| B103, B108 | `karriere-aufbereiter…` | B103; B108 nach Rückfrage mit dem Karosseriebau-Foto wie B105 |
| B104 | so lassen | — |
| B105 | `karriere-fahrzeugbau…` | B105 |
| B106, B107, B109 | erstmal stehen lassen | — |
| neu | Videoplätze Karosserie-/Mechanik-, Lackier-, Aufbereitungsbereich auf `/ueber-uns` und `/karriere`, in einer Reihe im Kartendesign | — |

Dazu: **Einwilligung der Mitarbeitenden liegt vollständig vor. Alle Anhänge sind echt, nichts KI-generiert oder -bearbeitet.**

**Referenzen:** [`2026-09-18-bilder-inventar-tasks.md`](2026-09-18-bilder-inventar-tasks.md) ·
[`2026-09-21-ki-kennzeichnung-tasks.md`](2026-09-21-ki-kennzeichnung-tasks.md) ·
[Optimierung](2026-09-21-bildtausch-lieferung-september-optimierung-tasks.md) · Backlog R2, R15, R16, 2.14–2.16, 2.20, 2.21, 3.4, 3.11, 3.24, 3.26, 3.29

---

### ✅ Phase 1 — Sichtung und Zuordnung (vor jeder Änderung)
**Ziel:** Nichts einbauen, was nicht eindeutig zugeordnet ist.
* [x] 11 benannte Dateien im Lieferordner, 9 davon auch als Chat-Anhang (per Bildvergleich zugeordnet, Abstand 1,2–1,8 gegen ≥ 38 beim nächstbesten)
* [x] **Zwei Chat-Anhänge ohne Zielnamen:** „Dellenentfernung - ende.jpeg“ und „Ozonbehandlung.jpeg“ — nicht eingebaut, im Bericht genannt. **Zwei benannte Dateien kamen nur aus dem Ordner**, nicht aus dem Chat: `autohaueser-und- fuhrparks…` (grüner Cayenne auf unserem Transporter) und `karriere-aufbereiter…`
* [x] **4 der 11 Fotos sind Hochformat per EXIF-Drehung** (orientation 6): Aufbereitung-aktiv, autolackierung, dellenentfernung, ersatzwagen. `npm run images` dreht nicht → sie wären **quer liegend** ausgeliefert worden (Befund O1)
* [x] Lesbare Kennzeichen fremder Fahrzeuge: Unfallinstandsetzung (schwarzer SUV im Hintergrund), Autohäuser (grüner Cayenne, silbernes BMW-Cabrio). Eigene Fahrzeuge (Miet-Polos, Transporter) bleiben
* [x] Mehrfachnutzung je Datei geprüft (Tabelle oben); Konflikte mit „nur diese Stelle“ bei B23 (Datei auch an B33) und B11 (Datei an 11 Stellen, B104/B107 bleiben) → die alte Datei wird **umbenannt** und bleibt an ihren Stellen, die neue übernimmt den vom User vergebenen Namen

### ✅ Phase 2 — Bildpipeline nach dem Ursprungskonzept (`npm run fotos`)
**Ziel:** Jedes Foto reproduzierbar aus dem Original, mit denselben Werten wie `npm run images` (WebP q82, effort 6, höchstens 2400 px breit), plus das, was diese Lieferung zusätzlich braucht.
* [x] `scripts/build-fotos.mjs` (neu, `npm run fotos`): je Foto Quelle, Ziel, Stellen, Ausschnitt, Kennzeichen, Titel, Beschreibung, Stichwörter — Muster wie `SCHNITTE` in `build-video.mjs`, Quelle bleibt außerhalb des Repos
* [x] Drehung nach EXIF, **4:3 quer, 2000 × 1500**: gleiches Pixelbudget wie die echten Juli-Fotos (2400 × 1357). Gemessen: bei 2400 × 1800 lagen vier Fotos bei 495–555 KB, jetzt **125–416 KB**
* [x] Hochformate mit gewähltem Ausschnitt (Oberkante 0,10 / 0,21 / 0,30 / 0,32 der Bildhöhe), im Prüfbogen kontrolliert: Werkzeug, Hand und Person liegen jeweils im Bild
* [x] Farbraum: Display-P3 → sRGB wie der Standardweg von sharp (Stichprobe identisch: 81/91/92 gegen 83/91/92 ungewandelt)
* [x] Kennzeichen unkenntlich: schwarzer SUV (Unfallinstandsetzung), silbernes Cabrio (Autohäuser). Der grüne Wagen auf dem Transporter trägt keins. Vergrößerung im Prüfbogen: beide nicht mehr lesbar
* [x] Metadaten geprüft: XMP 1,8 KB mit Titel, Beschreibung, Urheber, Rechtevermerk, Ort, Stichwörtern und `DigitalSourceType = digitalCapture`, Umlaute intakt; EXIF nur noch Urheber/Rechte — **kein GPS, kein Gerät** (vorher iPhone-EXIF mit 11–12 KB)
* [x] 🔴 **Eigener Fehler im ersten Lauf, behoben:** Die zwei Fotos mit Weichzeichnung kamen zerschossen heraus (`composite` liefert 4 statt 3 Kanäle). Gesehen im Prüfbogen, nicht an der Dateigröße — genau dafür gibt es ihn
* [x] `convert-images.mjs`: Drehung nachgerüstet (Befund O1 · fixed), gegengeprüft an einem Hochformat: vorher 5712 × 4284 quer, jetzt 2400 × 3200 hoch
* [x] Alte Dateien per `git mv` umbenannt: `autolackierung…` → `lackierkabine…` (bleibt an B104, B107 und vorerst B47), `ersatzwagen…` → `fahrzeugabgabe…` (bleibt an B33)
**Referenzen:**
`scripts/build-fotos.mjs`
`scripts/convert-images.mjs`
`output/fotos-pruef/` (lokal)

### ✅ Phase 3 — Einbau je B-Nummer
* [x] `data/services.ts`: Unfall → `unfallinstandsetzung…` (wirkt über den Katalog an B10, B36, B37, B77, B85, B95); Lackierung, Dellen, Innenaufbereitung → neue Maße 2000 × 1500 und Alternativtexte, die das neue Motiv beschreiben
* [x] `pages/AccidentRepairPage.tsx` (B36): Hintergrund aus dem Katalog statt eines zweiten, fest verdrahteten Pfads — fehlt der Eintrag, bricht der Prerender laut ab (wie `videoPlatz()`)
* [x] `components/AccidentDamageSection.tsx` (B23): Alternativtext zur Mietwagenflotte
* [x] `components/DetailingProcessSection.tsx`: B33 → `fahrzeugabgabe…` (Motiv unverändert), B34 → `aufbereitung-aktiv…` mit neuem Alternativtext
* [x] `data/detailing.ts`: `leasing` → eigenes Motiv (B29), `lack` → `lackierkabine…` (B47 unverändert), neuer Schlüssel `aussenStartseite` nur für B28; B45 neue Maße + Text
* [x] Nebenbei korrigiert: Der Alternativtext von B47 versprach eine „polierte und versiegelte Lackoberfläche“ — zu sehen ist die Lackierkabine. Jetzt beschreibt er das Bild, und zwar ohne „im CarCare Center“, weil das Motiv als KI-generiert gilt
* [x] `data/jobs.ts`: B103/B108 → Aufbereiter, B104/B107 → `lackierkabine…`, B105 → Fahrzeugbau (Zuordnung je Eintrag geprüft, nicht per Suchen-und-Ersetzen: derselbe Pfad stand mehrfach)
* [x] `tsc --noEmit` grün; `versicherung-schadenabwicklung…` wird im Code nicht mehr verwendet (bleibt als Datei, Rückfrage in Phase 9)
**Referenzen:**
`data/services.ts`
`data/detailing.ts`
`data/jobs.ts`

### ✅ Phase 4 — Video an B11 (nur Startseite)
* [x] `scripts/build-video.mjs`: **Quelle je Schnitt** statt einer für alle (`--quelle` nur noch mit `--nur`), optional Bildausschnitt und Breite je Schnitt, `-map 0:v:0 -map_metadata -1` (keine Ton- und Metadatenspuren aus dem Handy), Titel/Beschreibung/Urheber/Rechte als MP4-Metadaten
* [x] Schnitt `startseite-lackierung` → `carcare-autolackierung.mp4`: 2,0–15,0 s, **quadratisch** (Oberkante 680 von 1920 px, im Kontrollbogen je Stichprobe geprüft: Pistole und Sprühnebel immer im Bild), 720 × 720, H.264 High, yuv420p, faststart, stumm — **0,90 MiB statt 51 MiB**; Standbild bei 4,0 s (Kollege mit Maske beim Lackieren), 1080 × 1080, 60 KB
* [x] Gemessen: vorhandene Videos tragen keine Ortsdaten (Quelle hatte keine) — nicht neu gerechnet
* [x] `data/videos.ts`: Platz `startseite-lackierung` (Backlog-Feld „B11“)
* [x] `ExpandingCardAccordion`: `backgroundVideo` + `KartenVideo` — `preload="none"`, startet per Code nur, wenn die Karte **aufgeklappt und im Bild** ist, pausiert beim Wechsel. Kein `autoPlay`, kein Pause-Knopf im Link (unzulässiges HTML); Anhalten = andere Karte öffnen (WCAG 2.2.2)
* [x] `ServiceGrid`: Video nur für die Kachel `lackierung` der Startseite; der Katalog bleibt unberührt, alle anderen Stellen zeigen das Foto
**Referenzen:**
`scripts/build-video.mjs`
`components/ExpandingCardAccordion.tsx`
`components/ServiceGrid.tsx`

### ✅ Phase 5 — Videoplätze auf „Über uns“ und „Karriere“ (Backlog R18)
* [x] `data/videos.ts`: drei Plätze (`bereich-karosserie`, `bereich-lack`, `bereich-aufbereitung`), **ein Eintrag je Bereich, von beiden Seiten geteilt** — Nachliefern bleibt eine Zeile und wirkt auf beiden Seiten
* [x] `components/BereichsVideos.tsx` (neu, 95 Zeilen): Kartenmuster von `LeistungsKarten`, drei in einer Reihe ab `md`, darunter gestapelt; Platzhalter wie `BetriebsVideo` („Videoplatz …“, Liefervorgabe, Hinweis). Geliefertes Video spielt erst auf Klick (`controls`, `preload="none"`)
* [x] Einbau unter dem Betriebsvideo: `/ueber-uns` („Die Bereiche im Einzelnen“, Texte für Kunden, Links auf Unfall-, Lackier- und Aufbereitungsseite) und `/karriere` („Ihre Arbeitsplätze im Einzelnen“, je Beruf beschrieben, ohne Link)
* [x] `check-dummies.mjs`: fünf Anerkennungen mit Backlog R18 und Datum → Build grün, Wächter nennt sie bei jedem Build
* [x] Bildinventar: `data-videoplatz` → Platzhalter „(Video fehlt)“, **B113–B115** (Über uns) und **B116–B118** (Karriere), Vermerk „Später einfügen“
* [x] 🟠 `npm run kontrast` fand **3 Stellen unter AA in den neuen Platzhaltern** (gray-500 auf gray-50: 4,23:1) → gray-600; dieselbe Schwäche im bestehenden `BetriebsVideo`-Platzhalter gleich mit behoben (dort zurzeit nicht sichtbar)
**Referenzen:**
`components/BereichsVideos.tsx`
`data/videos.ts`
`scripts/check-dummies.mjs`

### ✅ Phase 6 — Kennzeichnung, Liste, Backlog
* [x] `data/bildherkunft.ts`: 11 Fotos + Video + Standbild der Lieferung „echt“ → **keine KI-Plakette** mehr an diesen Stellen. Die umbenannten Altmotive (`lackierkabine-…`, `fahrzeugabgabe-…`) bleiben unter dem Standard „KI-generiert“
* [x] `motive.json`: Motiv/Herkunft/offene Punkte für 13 neue bzw. ersetzte Dateien und die zwei umbenannten; Vermerke nach den Rückfragen **36 × Angepasst, 3 × In Ordnung** (B31, B33, B104), weiter offen 14 × Anzupassen (B48–B58, B106, B107, B109), 9 × Später einfügen (B4–B6, B113–B118)
* [x] Inventar (`bilder-inventar.mjs`, `bilder-rundgang.mjs`, `bilder-kontaktbogen.mjs`): Vermerkarten „Angepasst“/„In Ordnung“ (grün im Kontaktbogen), **Regel „Foto wird Video“: B11 behält seine Nummer** am Standbild, das Video bekommt B112; Videoplätze als Platzhalter „(Video fehlt)“; Überblick „Später einfügen“ nach Notiz gruppiert (vorher trug die erste Notiz für alle); Hinweis zur Herkunft aktualisiert
* [x] Gemessen gegen den letzten Commit: **110 von 111 Nummern unverändert**, B11 nur Rolle Foto → Standbild, neu B112–B118, **0 entfallen**
* [x] Backlog: 2.14, 2.15, 2.16, 2.20, 2.21, 3.4, 3.11 ✅ erledigt; 3.24, 3.26, 3.29 ✅ geliefert (je mit B-Nummer); R2 🟨 teilweise; R15 ergänzt; R16 ✅ erledigt (Phase 8); **R18 neu**; Summen „wartet auf André“ 10, „echt offen“ 22. `npm run nummern` ok
**Referenzen:**
`data/bildherkunft.ts`
`docs/bilder/motive.json`
`scripts/bilder-inventar.mjs`

### ✅ Phase 7 — Messen und Sichtprüfung
* [x] `npm run build` grün (tsc, Prerender 29/29, FAQ-Wächter, Dummy-Wächter mit den fünf R18-Anerkennungen)
* [x] `npm run kontrast`: erst **3 Befunde** in den neuen Platzhaltern (O5) → nach der Korrektur und mit den neuen Hintergründen **5206 Textstellen, 0 unter AA**; Schlusslauf nach den Rückfragen **5204 Stellen, 0 unter AA**
* [x] `npm run bilder`: **101 Bildstellen, 41 Dateien, 17 Platzhalter**, Nummern bis B118, 0 entfallen, B11 behalten (gegen den letzten Commit: 110 von 111 Schlüsseln unverändert); unbenutzt am Ende nur das frühere B20-Motiv `schadenaufnahme-…` (O11, Entscheidung beim User)
* [x] **Kartenvideo B11 im Browser gemessen** (Puppeteer, ausgelieferter Build): nach dem Laden **0 Anfragen** an das Video (`preload="none"`), nach dem Aufklappen 1 Anfrage und Wiedergabe (2,49 s nach 2,5 s), beim Kartenwechsel angehalten; Smartphone per Tipp genauso
* [x] Bereichsvideos: Desktop drei gleich große Karten in einer Reihe (366 × 229 je Medienfeld), Smartphone untereinander
* [x] 🟠 **Sichtprüfung der Seitenhintergründe fand O3:** Auf der Unfall- und der Lackierseite war das Motiv unter dem Textschutz verschwunden → eigene Hintergrund-Ausschnitte (Feld `pageImage`), danach Schweißer bzw. Lackierpistole rechts der Mitte sichtbar. Dellen, Innenaufbereitung, Geschäftskunden tragen ohne Ausschnitt
* [x] Bildschirmfotos (lokal, Scratchpad): Startseite mit laufendem Kartenvideo (Desktop, Smartphone), Bereichsvideos auf beiden Seiten, fünf Seitenhintergründe
**Referenzen:**
`components/ServiceLayout.tsx`
`pages/AccidentRepairPage.tsx`
`data/services.ts`

### ✅ Phase 8 — R16: Kennzeichen in den Betriebsvideos
* [x] Durch die Einwilligung entsperrt (der Grund der Zurückstellung in Phase O-C entfällt)
* [x] `npm run video` kann jetzt **bewegte Weichzeichnung**: Stützpunkte [Zeit, x, y] je Kennzeichen, dazwischen linear, Box mit weichem 16-px-Rand; Standbild und Kontrollbilder laufen durch dieselbe Bildkette; neuer Prüfbogen `output/video-pruef/<datei>-unkenntlich-<n>.jpg`
* [x] Pfade **gemessen**: Bild-für-Bild-Verfolgung (normierte Kreuzkorrelation, Güte 0,92–1,00), wo sie abreißt (Bildrand), Stützpunkte aus Einzelbildern im 0,2-s-Raster
* [x] **Karriere-Video: vier Stellen statt der einen aus R16** — Mercedes hinten (22,9–26,3 s), derselbe Wagen vorn am abgebauten Stoßfänger (22,9–26,8 s), **BMW auf der Hebebühne (17,2–20,7 s)** und **der Mercedes am unteren Rand (17,2–20,2 s, bei 19,1 s voll lesbar)**. Die zwei letzten hatte die Sichtung vom 18.09. nicht gefunden
* [x] **Rundgang-Video: eine Stelle** (VW up!, 8,3–10,9 s, auch im Standbild). Hero-Video: Wagen nur fern und unter 40–94 % Schleier — nichts lesbar
* [x] 🔴 **Zwei eigene Fehler unterwegs, beide im Prüfbogen gefunden und behoben:** (1) fortgeschriebener statt gemessener Pfad → Buchstaben am Bildrand sichtbar; (2) weicher Rand an der Bildkante halb durchsichtig → Box darf jetzt 64 px über den Rand hinausragen (Bild vorher mit Randpixeln erweitert), der Saum liegt außerhalb
* [x] Kontrolle am **fertigen** Video, nicht an Einzelbildern der Quelle: jedes zweite Bild in allen kritischen Abschnitten (24,9–26,4 s; 17,2–20,8 s; 22,8–26,8 s; Rundgang 8,3–10,9 s) — nirgends ein Zeichen lesbar
* [x] Größen praktisch unverändert (gemessen gegen den letzten Commit): Karriere 3 496 020 statt 3 512 114 Byte, Rundgang 3 540 201 statt 3 540 075 Byte
**Referenzen:**
`scripts/build-video.mjs`
`output/video-pruef/` (lokal)
`docs/bilder/tasks/2026-09-18-bilder-inventar-optimierung-tasks.md` (Phase O-C)

### ✅ Phase 9 — Rückfragen an den User (beantwortet 2026-09-21)
* [x] Altes B10-Bild → **B20 Schadenaufnahme** (Startseite, Unfall-Ablauf Schritt 2). Erledigt damit Backlog **3.8** (ruhigeres Motiv). Der Alternativtext beschreibt das Bild neutral, weil es als KI-generiert gilt; die Plakette steht an der Kartenbühne. Das bisherige B20-Motiv (`schadenaufnahme-…`, gelber Sportwagen) wird **nirgends mehr gezeigt**
* [x] B108 → **Karosseriebau-Foto wie B105** (nicht das Aufbereiter-Foto aus dem ersten Auftrag)
* [x] B28 → **B46 und B66 ziehen mit**: `aufbereitungKacheln.aussen` und Katalog `aussenaufbereitung` zeigen das Lackaufbereitungsfoto; der Sonderschlüssel `aussenStartseite` ist wieder entfernt. Seitenhintergrund `/aussenaufbereitung-leipzig` (zoom 1) zeigt Poliermaschine, Kotflügel und Scheinwerfer — kein eigener Ausschnitt nötig. **R2 damit erledigt**
* [x] B47 → **Lackaufbereitungsfoto**. Folge, im Code und in `motive.json` vermerkt: B46 und B47 stehen auf `/fahrzeugaufbereitung-leipzig` nebeneinander mit demselben Bild. Im Lieferordner liegen weitere Politurfotos (ohne Zielnamen) — Vorschlag im Bericht
* [x] Die frühere Lackierkabine (`lackierkabine-…`) steht nur noch an B104/B107 (Karriere)
**Referenzen:**
`data/detailing.ts`
`components/AccidentDamageSection.tsx`
`data/jobs.ts`

---

## Kommentare

### Phase 1
**Eingehalten**: erst zuordnen, dann ändern ✅, Mehrfachnutzung je Datei geprüft ✅, Herkunft nicht geraten (User-Angabe übernommen) ✅
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch:** `npm run images` ignoriert die EXIF-Drehung — vier Hochformate wären quer ausgeliefert worden → O1
2. 🟠 **Hoch:** Zwei Kennzeichen fremder Fahrzeuge lesbar (Datenschutz, gleiche Linie wie R16) → Weichzeichnung in Phase 2
3. 🟡 **Mittel:** Chat-Anhänge und benannte Dateien decken sich nicht vollständig (2 ohne Namen, 2 nur im Ordner) → im Bericht offenlegen

### Phase 2
**Eingehalten**: Ursprungskonzept (WebP q82, effort 6, Name aus `name.webp.jpeg`) ✅, reproduzierbar per Skript statt von Hand ✅, Quelle außerhalb des Repos ✅, Metadaten ohne GPS/Gerät ✅, unter 700 Zeilen (build-fotos 385, build-video 425, bilder-inventar 600) ✅, Prüfbogen statt blindem Vertrauen ✅
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch · fixed:** O1 — `convert-images.mjs` dreht nicht nach EXIF
2. 🟡 **Mittel · fixed:** O8 — eigener Kanal-Fehler beim Einsetzen der Weichzeichnung, im Prüfbogen gesehen
3. 🟢 **Niedrig · offen:** O9 — keine `srcset`-Stufen im Projekt, große Hintergründe laden auch mobil in 2000 px

### Phase 3
**Eingehalten**: Zuordnung je Eintrag statt Suchen-und-Ersetzen ✅, „nur diese Stelle“ über Umbenennen der Altdatei gelöst (kein Doppel-Pfad) ✅, Alternativtexte beschreiben das gezeigte Motiv ✅, erste Person Plural / „CarCare Center“ ohne Bindestrich ✅, `tsc` grün ✅
**Auffälligkeiten:** 🟡 Der Alternativtext von B47 beschrieb ein Bild, das es nicht gibt — mitkorrigiert. Der Unfall-Hintergrund stand als zweiter Pfad in der Seite — auf den Katalog umgestellt.

### Phase 4
**Eingehalten**: nur Startseite ✅, Datenvolumen gemessen statt behauptet (0 Anfragen bis zum Aufklappen) ✅, keine Bedienelemente im Link ✅, Metadaten ersetzt ✅
**Auffälligkeiten:** 🟢 Das Standbild (60 KB) lädt mit der Seite, nicht lazy — `<video poster>` kennt kein `loading="lazy"`. Bewusst hingenommen: ohne Standbild keine Nummer im Inventar und ein leerer Kartenstreifen

### Phase 5
**Eingehalten**: ein Eintrag je Bereich für beide Seiten ✅, Kartenmuster der Leistungskarten ✅, Mobile-First (gestapelt, ab `md` in einer Reihe) ✅, Dummy-Wächter angemeldet statt umgangen ✅, Heading-Hierarchie h2 → h3 ✅
**Auffälligkeiten:** 🟠 O5 — Kontrast der Platzhalter-Beschriftung, fixed

### Phase 6
**Eingehalten**: Nummern nie von Hand ✅, Kundennummern nur im Status geändert, keine neue x.y ✅ (neu nur R18), Herkunft nur mit Beleg (User-Aussage) ✅
**Auffälligkeiten:** 🟠 O4 (Nummer beim Wechsel Foto → Video), 🟡 O6 (Datum nach Umbenennung), 🟡 O7 (Notiz im Überblick) — alle fixed

### Phase 7
**Eingehalten**: gemessen statt geschätzt (Kontrast, Nummern, Netzwerk, Bildschirmfotos) ✅, kein Dev-Server gestartet (alle Prüfungen gegen `dist/` über `vite preview`) ✅
**Auffälligkeiten:** 🟠 O3 — Seitenhintergründe ohne Motiv; nur durch Hinsehen gefunden, keine der Messungen hätte es gemeldet (Kontrast und Nummern waren grün). Fixed

### Phase 8
**Eingehalten**: am fertigen Video geprüft, nicht an der Quelle ✅, Pfade gemessen ✅, jede Stelle begründet im Skript ✅
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch · fixed:** O2 — Die ursprüngliche Sichtung hatte drei von vier Kennzeichen übersehen (Zeitraster zu grob)
2. 🟡 **Mittel · fixed:** eigener Fehler — fortgeschriebener Pfad und halbdurchsichtiger Rand an der Bildkante ließen Buchstaben durch; gefunden im Prüfbogen

### Phase 9
**Eingehalten**: im Zweifel gefragt statt geraten (Wunsch des Users) ✅, Antworten vollständig umgesetzt und neu gemessen ✅
**Auffälligkeiten:** 🟢 Eine Folge der Antworten stand nicht in der Frage: B46 und B47 zeigen nebeneinander dasselbe Foto (O12). 🟢 Das frühere B20-Motiv ist jetzt ohne Verwendung (O11)

## Nächste sinnvolle Schritte
1. **B48–B58 füllen** (Galerie „Ergebnisse, die man sieht“): Im Lieferordner liegen schon passende Fotos ohne Zielnamen — Felgenreinigung, Cabriodachversiegelung, Motorreinigung, Alcantara vorher/nachher, Politur-Nahaufnahmen. Ein Zuordnungsbogen (Foto → Platzhalter) spart dem User die Benennung: `npm run fotos` braucht nur je Eintrag Quelle und Ziel
2. **B47 entdoppeln** mit einem der weiteren Politurfotos (O12)
3. **`srcset` für Seitenhintergründe und Karten** (O9) — größter Hebel für die Ladezeit auf dem Smartphone, betrifft alle Bilder
4. **KI-Motive maschinenlesbar kennzeichnen:** Sobald feststeht, welche Motive generiert bzw. bearbeitet sind, schreibt derselbe Weg wie in `build-fotos.mjs` `DigitalSourceType = trainedAlgorithmicMedia` in die Dateien (Gegenstück zu `digitalCapture` der echten Fotos)

## Entscheidungen des Users am 2026-09-22
* [x] Das frühere B20-Motiv (`schadenaufnahme-…`) **bleibt im Bestand**, auch ohne Verwendung (O11)
* [x] **B47 wird später ersetzt** — Vermerk zurück auf „Anzupassen“, bis dahin steht das Lackaufbereitungsfoto wie bei B46 (O12)
* [x] Die zwei Chat-Anhänge ohne Zielnamen („Dellenentfernung - ende“, „Ozonbehandlung“) werden **später genutzt**; sie liegen im Lieferordner, nichts davon im Repository
* [x] Alles committen und pushen (Push-Stand nach CLAUDE.md)
