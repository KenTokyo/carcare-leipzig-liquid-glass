# Bereichsvideos R18 — drei Drohnenclips einhaengen

**Auftrag (User, 2026-09-23):** Die drei freigelassenen Videoplaetze der Bereichskarten mit
Material aus dem Drohnenordner fuellen. Zuordnung wortwoertlich vom User:

| Bereichskarte | Datei |
|---|---|
| Karosserie- und Mechanikbereich | `CarCare 2 Hebebühne.mov` |
| Lackierbereich | `CarCare Lackieren.mov` |
| Aufbereitungsbereich | `CarCare 1 Polieren .mov` |

**Zusatz des Users:** „Achte drauf, dass die Videos optimiert werden, bevor sie eingefuegt werden
fuer Websites." — also derselbe Weg wie bei den vier bestehenden Schnitten: `npm run video`,
stumm, ohne Metadaten, in der Breite, die die Karte tatsaechlich rendert.

**Backlog:** R18 (`docs/backlog/offene-punkte-konsolidiert.md`, Abschnitt 2) · Platzhalter
B113–B118 im Bildinventar · Wunsch des Users vom 2026-09-21.

**Quellen** (liegen ausserhalb des Repositories, Ordner `CarCare Drohne/3. Drohnen Videos/`):
alle drei 1920 × 1080, 25 fps, H.264 mit rund 11 Mbit/s, dazu eine AAC-Tonspur.
Polieren 25,40 s / 34,9 MiB · Hebebuehne 10,16 s / 14,1 MiB · Lackieren 11,92 s / 16,6 MiB.

---

### ✅ Phase 1 — Sichtung und Rechtspruefung der drei Quellen
**Ziel:** Wissen, was in jedem Film steht, bevor ein Ausschnitt gewaehlt wird — Inhalt, Text im
Bild, Kennzeichen, Personen.
* [x] Quellen geprobt: alle drei 1920 × 1080, 25 B/s, H.264 ~11 Mbit/s, je eine AAC-Tonspur.
      Hebebuehne 10,16 s · Lackieren 11,92 s · Polieren 25,40 s
* [x] Szenenerkennung: **kein einziger Schnitt** in keinem der drei — je eine durchgehende
      Einstellung. Die Ausschnitte richten sich deshalb nach dem Inhalt, nicht nach Schnittgrenzen
* [x] Kontaktbogen angesehen (0,5 s bzw. 1 s Raster). Alle drei passen zu ihrem Bereich.
      Kein Firmenlogo im Bild; sichtbar sind nur Geraeteaufschriften Dritter (Lackierkabine
      „WOLF"/„REPIT vision", Hebebuehne „NORD LIFT", „MAHA") — Hersteller der eigenen Ausstattung
* [x] **Kennzeichen je Einstellung geprueft**, in voller Aufloesung, Bildviertel einzeln:
      · **Hebebuehne: ZWEI lesbare Kundenkennzeichen** — Mercedes im Vordergrund (ab dem ersten
        Bild vollstaendig lesbar) und BMW auf der Buehne (ab etwa 5 s). Beide verfolgt und
        weichgezeichnet, siehe Phase 2
      · Lackieren: keines — das Fahrzeug ist vollstaendig abgeklebt, der Rohbau rechts ebenso
      · Polieren: keines — der schwarze Kombi rechts traegt ab 21 s einen LEEREN Schilderhalter
* [x] Personen: In allen drei Filmen sind Mitarbeitende erkennbar bei der Arbeit, im Polierfilm
      auch das Gesicht. Einwilligung liegt laut User seit 2026-09-21 vollumfaenglich vor (§ 22 KUG)
* [x] **Zusaetzlich gefunden:** Der Hebebuehnen-Clip ist bildstabilisiert und traegt schwarze
      Raender (oben 12, links 20 px). `cropdetect` meldet in 252 von 254 Bildern denselben Wert;
      ohne Zuschnitt haetten schwarze Kanten in der Karte gestanden

### ✅ Phase 2 — Ausschnitte festlegen und eintragen
**Ziel:** Je Bereich ein Ausschnitt, der als Karte allein traegt.
* [x] Kartenbreite **gemessen** (Puppeteer gegen `dist/`, 7 Fenster): Der Medienrahmen rendert
      hoechstens **451 × 282 CSS-px** (1920), 366 bei 1440, 276 auf dem Smartphone.
      → **960 statt 1280** als Ausgabebreite: doppelte Aufloesung des groessten Falls
* [x] Ausschnitte: Karosserie 0–10,1 s (ganz) · Lack 1,6–11,9 s (davor steht eine rote
      Hubarbeitsbuehne im Bild) · Aufbereitung 0,8–16,8 s von 25,4 s (ab ~17 s mehr Boden als Arbeit)
* [x] Standbilder: 7,5 s · 10,8 s · 4,5 s. **Bei diesen Karten laeuft das Video erst auf Klick** —
      das Standbild ist damit das, was praktisch jeder sieht, nicht nur bei reduzierter Bewegung
* [x] Drei Eintraege in `scripts/build-video.mjs`, je mit hergeleiteten Parametern
* [x] Zwei Weichzeichnungsbahnen fuer den Karosserieclip, per normierter Kreuzkorrelation auf
      halber Aufloesung verfolgt (254 Bilder), an abgelesenen Einzelbildern gegengeprueft
* [x] **Zusaetzlich behoben:** Die Quelldateien liegen in NFD-Form auf der Platte (Mac-Herkunft:
      „ü" = u + kombinierendes Trema). `fs.existsSync` mit der zusammengesetzten Form meldet unter
      Windows `false`, obwohl die Datei danebenliegt — `vorhandenerPfad()` dreht das jetzt um

### ✅ Phase 3 — Kodieren und messen
* [x] `npm run video -- --nur <id>` je Bereich, stumm, ohne Metadaten
* [x] Groessen: **0,57 + 0,73 + 1,58 = 2,88 MiB** aus 62,5 MiB Quellmaterial
* [x] Kontrollbogen je Schnitt angesehen; keine schwarzen Raender mehr im Karosserieclip
* [x] Pruefbogen der Weichzeichnung angesehen (8 Zeitpunkte je Stelle) **und danach am fertigen
      Video jedes fuenfte Bild gegengeprueft** — Ausschnitt 1,7-fache Boxgroesse, damit ein
      danebenliegendes Schild auffiele. 37 bzw. 51 Bilder, kein Buchstabe sichtbar

### ✅ Phase 4 — Einhaengen
* [x] `data/videos.ts`: `quelle`, `poster`, `istPlatzhalter: false` je Bereich
* [x] `scripts/check-dummies.mjs`: **fuenf** `ANERKANNT`-Eintraege entfernt (drei Titel plus die
      beiden Rahmenwendungen). Damit steht im Projekt kein anerkannter Videoplatzhalter mehr
* [x] `data/bildherkunft.ts`: sechs Zeilen `echt` — die Weichzeichnung ist eine Unkenntlichmachung
      aus Datenschutzgruenden, keine generative Veraenderung
* [x] `docs/bilder/motive.json`: sechs Dateien beschrieben, Vermerke B113–B118 von „todo" auf
      „angepasst", zwei tote Platzhalterhinweise entfernt
* [x] 🔴 **Fehler gefunden und behoben — dieselbe Klasse wie Befund O4:** Der erste Lauf von
      `npm run bilder` liess **B113–B118 entfallen** und vergab B119–B130 neu. Genau das, was die
      Zusage „eine Nummer uebersteht den Bildtausch" ausschliesst — und genau die Nummern, unter
      denen der User die Videos bestellt hatte. Ursache: Die O4-Regel deckte nur `bild → standbild`
      ab, nicht `platzhalter → standbild`. `nummern.json` zurueckgesetzt, Regel erweitert, neu
      gelaufen: **„umbenannt (Nummer behalten): B113–B118"**, die Videos selbst tragen B119–B124

### ✅ Phase 5 — Verifikation
* [x] `npm run build`: Typen gruen, 29/29 Routen vorgerendert, `data/videos.ts` meldet
      **7 Eintraege, davon 0 als Platzhalter markiert**, keine unbekannten Platzhalter
* [x] `npm run kontrast`: **5200 Textstellen, kein Text unter WCAG AA**
* [x] `npm run bilder`: „umbenannt (Nummer behalten): B113–B118", keine entfallene Nummer
* [x] Bildschirmfotos `/ueber-uns` und `/karriere`, Desktop (1440) und Smartphone (390):
      `output/bereichsvideos/`. Drei Karten nebeneinander ab Tablet, darunter untereinander;
      Standbild, Steuerleiste und Kartentext sitzen auf allen vier Aufnahmen richtig

### ✅ Phase 6 — Dokumentation
* [x] `docs/backlog/offene-punkte-konsolidiert.md`: R18 abgehakt, Zaehlungen 9 → 8 und 21 → 20,
      Kopfzeile ergaenzt; die Drohnenclip-Zeile auf „3 von 12 verwendet" nachgezogen
* [x] Bildliste neu erzeugt (`docs/bilder/README.md`, `nummern.json`, Kontaktbogen)
* [x] Kommentarsektion unten

**Referenzen:**
`scripts/build-video.mjs`
`data/videos.ts`
`components/BereichsVideos.tsx`

---

## Kommentare

### Phase 1–6 (ein Durchgang)
**Eingehalten**: Planung vor Code ✅, Mobile-First geprueft (390 px) ✅, unter 700 Zeilen je Datei ✅
(`build-video.mjs` 569), gemessen statt geschaetzt (Kartenbreite, schwarze Raender, Kennzeichenbahnen,
Kontrast) ✅, Dateinamen und Nummern als Absprache behandelt ✅, kein `npm run dev` gestartet ✅,
Herkunft nur mit Beleg eingetragen ✅

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch — die Bildnummern B113–B118 waeren still entfallen.** Der erste Lauf von
   `npm run bilder` meldete „entfallene Nummern: B113–B118" und vergab fuer dieselben sechs Orte
   B119–B130 neu. Genau die Nummern, unter denen der User die Videos bestellt hatte. Ursache: Die
   am 2026-09-21 eingefuehrte Regel (Befund O4) deckte nur den Wechsel `bild → standbild` ab, nicht
   `platzhalter → standbild` — die Schluessel unterscheiden sich in genau einem Feld, der Rolle.
   ✅ **fixed**: `nummern.json` per `git checkout` zurueckgesetzt (sonst waeren B119–B130 vergeben
   geblieben und nie wieder frei), Regel in `scripts/bilder-inventar.mjs` um `platzhalter` erweitert,
   neu gelaufen. Ergebnis: „umbenannt (Nummer behalten): B113–B118".
   **Lehre:** O4 war als Einzelfall repariert worden („Foto wird Video"), nicht als Klasse
   („die Rolle wechselt, der Ort bleibt"). Der zweite Fall derselben Klasse kam neun Tage spaeter.

2. 🟠 **Hoch — zwei lesbare Kundenkennzeichen im Hebebuehnen-Clip.** Mercedes im Vordergrund ab dem
   ersten Bild, BMW auf der Buehne ab etwa 5 s (vollstaendig lesbar: Ort, Buchstaben, Ziffern).
   ✅ **fixed**: beide Bahnen verfolgt und weichgezeichnet, danach am fertigen Video jedes fuenfte
   Bild kontrolliert — mit einem Ausschnitt von der 1,7-fachen Boxgroesse, damit ein knapp
   danebenliegendes Schild auffiele. Kein Buchstabe sichtbar.
   **Bestaetigt die Lehre aus O2:** Im Zeitraster waere der BMW durchgerutscht — er wird erst in der
   zweiten Haelfte lesbar, und die Vorschau im Sekundenraster zeigt ihn nur klein.

3. 🟠 **Hoch — schwarze Raender im Hebebuehnen-Clip.** Der Clip ist als einziger der drei
   bildstabilisiert; `cropdetect` meldet in 252 von 254 Bildern oben 12 und links 20 px Schwarz.
   Ohne Zuschnitt haetten schwarze Kanten in der Karte gestanden. ✅ **fixed** (`crop=1880:1058:20:12`).
   **Das faellt nur auf, wenn man misst** — im Kontaktbogen sind 12 px Rand unsichtbar.

4. 🟠 **Hoch — Quelldateien nicht gefunden, obwohl sie danebenliegen.** Die Drohnenclips kommen von
   einem Apple-Geraet und tragen ihre Umlaute ZERLEGT (NFD: „u" + kombinierendes Trema). Windows
   vergleicht Dateinamen ohne Ruecksicht auf Gross- und Kleinschreibung, aber nicht ohne Ruecksicht
   auf diese Zerlegung — `fs.existsSync` meldete `false`. ✅ **fixed**: `vorhandenerPfad()` in
   `scripts/build-video.mjs` probiert beide Formen. Betrifft jede kuenftige Lieferung vom Mac.

5. 🟡 **Mittel — eigener Fehler beim Bildschirmfoto.** Puppeteers `clip` rechnet in DOKUMENT-, nicht
   in Fensterkoordinaten. Mit den Werten aus `getBoundingClientRect` landete der Ausschnitt am
   Seitenanfang; die erste Aufnahme zeigte den Hero statt der Karten und sah aus wie ein
   Layoutfehler. ✅ **fixed** (`+ scrollX/scrollY`). `npm run shots` und `npm run zielgruppen` sind
   NICHT betroffen — beide nehmen das ganze Fenster auf und uebergeben kein `clip`. Wer das naechste
   Mal einen Ausschnitt aufnimmt, faellt sonst in dieselbe Grube.

6. 🟢 **Niedrig — die Karten koennen in den Vollbildmodus.** Mit 960 px Breite (gemessen als das
   Doppelte des groessten Kartenrahmens) sieht ein Vollbild auf einem Full-HD-Schirm hochgerechnet
   aus. Bewusst so entschieden: Der Regelfall ist die Karte, und 1280 haette die drei Dateien um
   rund drei Viertel schwerer gemacht. Bei Beschwerden ist es ein Zahlenwechsel in `BREITE_KARTE`.

**Kein Optimierungsplan noetig** — alle sechs Punkte sind in diesem Durchgang behoben oder bewusst
entschieden. Offene Folgepunkte liegen ausserhalb dieser Aufgabe (O9 `srcset`, O12 B47).

**Referenzen:**
`scripts/build-video.mjs`
`scripts/bilder-inventar.mjs`
`data/videos.ts`
