# B24 überall: neues Empfangsfoto (Kundenempfang, Schlüsselübergabe)

**Angelegt:** 2026-10-14
**Auftrag des Users:** „B24 überall anpassen mit Anhangsfoto. Bitte ändere auch die Benennung der Datei und achte darauf,
saubere Metadaten zu hinterlegen […] bevor du es ersetzt auf allen Seiten.“
**Herkunft laut User:** mit „Chat GPT Image 2.5 Sunburst“ aufgewertet; Ursprungsdatei und Motiv sind original; für alle
abgebildeten Personen liegen die Zustimmungen vor. → `aufgewertet` (Plakette „KI-bearbeitet“).

**Betroffen:** Die Datei hinter B24 (`kacheln/privatkunden-leipzig-carcare.webp`) steht an drei Stellen, „überall“ meint alle:
- **B24** Startseite › „Der richtige Ansprechpartner für Ihr Fahrzeug“ › Karte „Privatkunden“ (`components/TargetGroupCards.tsx`)
- **B32** Startseite › Ablauf der Aufbereitung › Karte „Termin anfragen“ (`components/DetailingProcessSection.tsx`)
- **B75** `/privatkunden` › Titelbild und Seitenhintergrund (`pages/PrivatkundenPage.tsx`)

Die Nummern hängen am Ort, nicht an der Datei (`docs/bilder/nummern.json`, Schlüssel ohne Dateinamen), bleiben also.

**Lösungswege verglichen:**
1. Chat-Anhang direkt nach `public/` kopieren: verworfen. Er ist eine neu komprimierte WebP-Kopie ohne Metadaten,
   und eine zweite verlustbehaftete Kompression kostet Qualität.
2. Eigenes Einmal-Skript: verworfen. Doppelt `xmpPaket` aus `scripts/build-fotos.mjs`, der Weg wäre beim nächsten
   Tausch nicht mehr nachvollziehbar.
3. **Gewählt:** Eintrag in `npm run fotos` (`scripts/build-fotos.mjs`) mit der verlustfreien PNG aus den Downloads als
   Quelle. Das Skript bekommt den IPTC-Wert für KI-Bearbeitung und die KI-Felder aus IPTC 2025.1. Weil die Datei damit
   über 700 Zeilen käme, wandert die Fotoliste (reine Daten) nach `scripts/lib/fotos-liste.mjs`.

### ✅ Phase 1 — Quelle sichern, Fotoliste auslagern, Web-Fassung mit Metadaten
**Ziel:** sprechend benannte WebP-Datei mit sauberen, ehrlichen Metadaten.
* [x] Quelle: Der Chat-Anhang (1344 × 752 WebP, 100 KB) ist bildgleich mit `Downloads/hf_20261013_234003_….png` (verlustfrei,
  1,2 MB, mittlere Abweichung 2,8 von 255 im Graustufenvergleich; die beiden anderen PNG vom selben Abend 66–71). Kopiert, nicht
  verschoben, nach `C:/Users/Moham/Downloads/carcare-empfang-foto-2026-10-14/kundenempfang-schluesseluebergabe-carcare-leipzig.png`
  (byte-gleich geprüft). Die PNG trägt keinerlei Metadaten (kein EXIF/XMP/C2PA), höher aufgelöst gibt es das Bild nicht.
* [x] Sichtung am vergrößerten Bild: Schlüsselübergabe am Tresen erkennbar; kein Kennzeichen (Auto vorn links unscharf);
  Namensschild, Tischaufsteller und Monitorschriftzug sind KI-typische Scheinschrift, unlesbar. Nichts weichzuzeichnen.
* [x] `FOTOS`/`VERGLEICHE` samt Lieferordnern nach `scripts/lib/fotos-liste.mjs` (426 Zeilen), `build-fotos.mjs` 691 → 313 Zeilen.
* [x] `xmpPaket` liest je Eintrag `quelltyp` und `ki` → `Iptc4xmpExt:DigitalSourceType`, `AISystemUsed`, `AISystemVersionUsed`
  (Feldnamen und Werte gegen IPTC Photo Metadata 2025.1 und das Vokabular `digitalsourcetype` geprüft, siehe Kommentare).
* [x] `npm run fotos -- --nur kundenempfang` → `public/assets/kacheln/kundenempfang-schluesseluebergabe-leipzig-carcare.webp`,
  1344 × 752, **67 KB** (alt: 2400 × 1018, 192 KB). Ausgelesen: XMP 1,9 KB mit Titel, Beschreibung (inkl. „Echtes Foto, mit KI
  bearbeitet“), Urheber, Rechtevermerk, Ort, Stichwörtern, `compositeWithTrainedAlgorithmicMedia`, KI-System; EXIF nur Urheber
  und Rechte. Umlaute intakt.
* [x] Nebenbei behoben: Die Schlusszeile von `npm run fotos` nannte bei jedem Lauf die Septemberlieferung.
**Referenzen:**
`scripts/lib/fotos-liste.mjs`
`scripts/build-fotos.mjs`
`public/assets/kacheln/kundenempfang-schluesseluebergabe-leipzig-carcare.webp`

### ✅ Phase 2 — Einbau an allen drei Stellen
* [x] `components/TargetGroupCards.tsx` (B24, dekoratives `<img alt="">`, Plakette über `KiMarke`),
  `components/DetailingProcessSection.tsx` (B32), `pages/PrivatkundenPage.tsx` (B75, `BackdropLayout`) zeigen die neue Datei.
* [x] Alternativtext B32 beschreibt jetzt das gezeigte Motiv: „Kunde übergibt am Empfangstresen des CarCare Center Leipzig
  seinen Fahrzeugschlüssel an unsere Mitarbeiterin.“ (vorher „bespricht … den Wunschtermin“). B24 und B75 sind dekorativ.
* [x] `data/bildherkunft.ts`: neue Datei `aufgewertet` (Plakette „KI-bearbeitet“, wie das alte Motiv), Zeile Nr. 13 als
  abgelöst vermerkt. Das KI-Verzeichnis nennt „ChatGPT Images 2.5“ bereits (`KI_WERKZEUGE`), Impressum und Datenschutz
  brauchen keine Änderung.
* [x] Alte Datei nach `docs/bilder/archiv/privatkunden-leipzig-carcare_bis-2026-10-14.webp` (Zeile im Archiv-README),
  kein Verweis mehr im Code (grep über `components/`, `pages/`, `data/`, `lib/`, `seo/`, `scripts/`).
* [x] `docs/bilder/motive.json`: Motiv und Herkunft unter dem neuen Dateinamen, Vermerk „angepasst“ an B24, B32, B75.
**Referenzen:**
`components/DetailingProcessSection.tsx`
`data/bildherkunft.ts`
`docs/bilder/motive.json`

### ✅ Phase 3 — Build, Sichtprüfung, eigener Hintergrund-Ausschnitt für B75, Prüfläufe
* [x] Aufnahmeskript `output/b24/aufnahme.mjs` (Puppeteer, `HALTE_SCROLL`, nicht reduzierte Bewegung): fährt jede Stelle an,
  bis ein `<img>` mit der neuen Datei ganz sichtbar und deckend ist; Fenster 1440 × 900, 1920 × 945 (Full HD im Browser),
  390 × 844. Bogen: `output/b24/b24-sichtpruefung.jpg`.
* [x] B24 und B32: ganzes Motiv lesbar, Plakette „KI-bearbeitet“ an jeder Stelle (mobil „Foto: KI-bearbeitet“).
* [x] **B75 nachgebessert:** Mit dem ganzen Bild lagen Mitarbeiterin, Schlüssel und Logo unter dem Textschutz; im Bildfenster
  stand der Rücken des Kunden, in Full HD vor allem Aktenregale (die alte Datei zeigte dort ebenfalls nur den Kunden von
  hinten, `output/shots/privatkunden/desktop-00-y0.png` vom 08.10.). Zwei Ausschnitte verglichen: ohne rechtes Drittel
  (zu stark vergrößert, Kopf ab) und **ohne rechtes Fünftel (gewählt, 1075 × 672, 54 KB)**: Kunde im Profil mit Schlüssel in
  der Hand, mobil die Übergabe am Rand. Eigene Datei `kundenempfang-schluesseluebergabe-hintergrund-leipzig-carcare.webp`,
  gleiche Metadaten, Herkunft `aufgewertet`, Motiv in `motive.json`.
* [x] Finaler Build 14.10.2026, 02:24:54: Prerender 29/29, FAQ 242/242, Platzhalter ok, Gedankenstriche 0.
* [x] `npm run bilder`: 140 Stellen, Nummern bis B153 unverändert, B24/B32 → neue Datei, B75 → Hintergrund-Ausschnitt;
  `nummern.json` ändert nur die drei Dateinamen, keine Nummer verschoben, kein FEHLER.
* [x] `npm run kontrast -- /` (166 Textstellen) und `-- /privatkunden` (245): kein Text unter WCAG AA.
* [x] `npm run zielgruppen`: alle Karten auf allen Fenstern in Ordnung.
* [x] `npm run lektorat -- start privatkunden`: 0 K, 2 H; beide H betreffen bestehende lange Sätze, nicht den neuen Alternativtext.
**Referenzen:**
`pages/PrivatkundenPage.tsx`
`scripts/lib/fotos-liste.mjs`
`output/b24/b24-sichtpruefung.jpg`

### ✅ Phase 4 — B26 nur Startseite: neues Transporterfoto (gleicher Ablauf, ohne Prüfläufe)
**Auftrag des Users (14.10.):** „B26 nur mit dem angehangenen Bild anpassen. Keine unnötig langen Prüfungen, lediglich
ersetzen; sauberer Name und Metadaten.“ Herkunft auf Nachfrage: **KI-bearbeitet**. Fassadenschild („Lackschutzfolien“,
„Oldtimer-Pflege“) soll unbeachtet bleiben; gezeigt wird der Schlepper für Zusammenarbeit und Mobilitätsgarantie gegenüber
Autohaus-Partnern.
* [x] Quelle: `Downloads/hf_20261013_234333_….png` (bildgleich, Abweichung 4,2) → Kopie
  `Downloads/carcare-transporter-foto-2026-10-14/autotransporter-anhaenger-sportwagen-carcare-leipzig.png`.
* [x] `npm run fotos -- --nur autohaus-partner` → `kacheln/autohaus-partner-fahrzeugtransport-leipzig-carcare.webp`,
  1344 × 752, 102 KB (alt 2000 × 1500, 400 KB); XMP mit `compositeWithTrainedAlgorithmicMedia`, **ohne** `AISystemUsed`
  (System für dieses Bild nicht genannt).
* [x] `TargetGroupCards` (B26) umgestellt, Herkunft `aufgewertet`, altes Anhängerfoto archiviert (sein Eintrag und der nur
  dafür genutzte Lieferordner `ORDNER_GESICHTET_AUG26` aus der Fotoliste entfernt), Motiv und Vermerk B26 in `motive.json`.
* [ ] Bewusst nicht gelaufen (Wunsch des User): Build, `npm run bilder` (README zeigt für B26 bis zum nächsten Lauf noch die
  alte Datei), Kontrast, Aufnahmen. Nur geprüft: Fotoliste lädt, alle Pfade in Karte und Herkunft existieren.
**Referenzen:**
`scripts/lib/fotos-liste.mjs`
`components/TargetGroupCards.tsx`
`data/bildherkunft.ts`

### ✅ Phase 5 — Ablauf der Aufbereitung (Startseite): Schritte 02, 03, 05 neu belegt, ohne Prüfläufe
**Auftrag des Users (14.10.):** Schritt 02 (B32) bekommt das Serviceberater-Foto der Karriereseite (dort bleibt es), Schritt 03
(B33) das bisherige Bild aus Schritt 02, das alte Bild von Schritt 03 komplett raus; Schritt 05 (B35) bekommt NUR dort ein
neues Foto (KI-bearbeitet, Lichtverhältnisse). „Mach keine Wächterprüfungen, das machen wir später.“
* [x] Mehrfachnutzung vorab geprüft: `fahrzeugabgabe-…` stand nur an B33 → archiviert
  (`docs/bilder/archiv/fahrzeugabgabe-leipzig-carcare_bis-2026-10-14.webp`, Herkunftszeile Nr. 15 als abgelöst vermerkt).
  `leasingrueckgabe-…` steht an B17, B35, B59, B129 → nur an B35 ersetzt, Datei bleibt.
* [x] Quelle des neuen Fotos: `Downloads/hf_20261013_222814_….png` (bildgleich, Abweichung 3,8) → Kopie
  `Downloads/carcare-rueckgabe-foto-2026-10-14/fahrzeugrueckgabe-kundenannahme-carcare-leipzig.png`;
  `npm run fotos -- --nur fahrzeugrueckgabe` → `kacheln/fahrzeugrueckgabe-kundenannahme-leipzig-carcare.webp`, 1344 × 752,
  72 KB, XMP mit `compositeWithTrainedAlgorithmicMedia`, ohne `AISystemUsed` (System nicht genannt).
* [x] `components/DetailingProcessSection.tsx`: Bilder und Alternativtexte der Schritte 02, 03, 05 neu (der Text beschreibt
  jeweils das gezeigte Motiv). Weiter fünf unterschiedliche Bilder (Crossfade). Plaketten folgen `bildherkunft.ts`:
  Schritt 02 echt (keine), 03 und 05 „KI-bearbeitet“.
* [x] Verweise nachgezogen: `stellen` des Empfangsfotos jetzt B24, B33, B75; Kommentare in `TargetGroupCards`,
  `AccidentDamageSection`, `bildherkunft.ts`; `motive.json` (Datei-Eintrag neu, `fahrzeugabgabe` entfernt, Vermerke B32, B33,
  B35 „angepasst“, der B33-Vermerk „neues Foto kommt“ ist damit erledigt).
* [ ] Bewusst nicht gelaufen (Wunsch des Users): Build, `npm run bilder`, Kontrast, Aufnahmen. Nur geprüft: alle fünf Bildpfade
  des Ablaufs existieren in `public/`.
**Referenzen:**
`components/DetailingProcessSection.tsx`
`scripts/lib/fotos-liste.mjs`
`docs/bilder/motive.json`

### ✅ Phase 6 — Schritt 02 (B32): weniger Kopf, mehr Laptop, nur dort
**Auftrag des Users (14.10.):** Im Bild von Schritt 02 zu viel Kopf rechts; nach rechts verschieben oder Richtung Laptop
(links unten) heranzoomen. „Bitte auch wirklich nur dort.“
* [x] Befund: In der Ablaufkarte liegt der Textkasten unten links über dem Laptop (Desktop frei: oberes Drittel und rechte
  40 %, mobil nur das obere Viertel; gemessen an `output/b24/B32-1440.png` und `B32-390.png`). Deshalb sah man den Kopf.
* [x] Drei Ausschnitte mit eingezeichnetem Kasten verglichen (aktuell, Laptop links unten, Laptop oben). Gewählt: Laptop
  oben, ohne das rechte Viertel des Originals (`ausschnitt` x 0–0,76, y 0,39–0,714, Format 1,76 wie die Desktop-Karte).
  Ergebnis: Bildschirm mit „We Care. We Repair.“ über dem Kasten, rechts Hände und nur noch Haare statt Hinterkopf.
* [x] Eigene Datei `kacheln/terminanfrage-buero-laptop-leipzig-carcare.webp` (825 × 469, 42 KB, `digitalCapture` wie das
  Original, Herkunft `echt`), nur in `DetailingProcessSection` Schritt 02. Karriere (B106) zeigt unverändert
  `karriere-serviceberater-…` (`data/jobs.ts`).
* [ ] Wie gewünscht keine Prüfläufe; nach dem nächsten Build lohnt ein Blick auf Schritt 02 mobil (nur das obere Viertel frei).
**Referenzen:**
`scripts/lib/fotos-liste.mjs`
`components/DetailingProcessSection.tsx`

### ✅ Phase 7 — B46 eins zu eins ersetzt: Ferrari-Waschfoto (Backlog 5.36)
**Auftrag des Users (14.10.):** „B46 eins zu eins mit dem Anhang ersetzen, saubere Benennung und Metadaten; echtes Bild.“
* [x] Original statt Anhang (2000 × 1500 ohne EXIF): per Bildvergleich über 908 Lieferfotos gefunden,
  `Fotos/Gesichtet/Fotos 3/image00051.jpeg` (Abweichung 1,1; 5712 × 4284, iPhone 17 Pro, 16.07.2026, keine Software).
* [x] Kein Kennzeichen (beide Wagen vorn ohne, vergrößert geprüft).
* [x] `kacheln/aussenaufbereitung-fahrzeugwaesche-leipzig-carcare.webp`, 1200 × 900 (`breite: 1200`, nur Karte im
  Dreierraster), 159 KB statt 410 KB bei 2000 px; XMP `digitalCapture`, Aufnahmedatum aus dem EXIF, kein GPS/Gerät.
* [x] NUR B46: `data/detailing.ts` › `detailingScopes` › Außenaufbereitung bekommt den Pfad direkt (Alternativtext und
  Maße neu). `aufbereitungKacheln.aussen` bleibt beim Politurfoto, das weiter B28, B47, B66, B128 speist.
* [x] Herkunft `echt` (keine Plakette), `motive.json` (Datei, Vermerk B46 „angepasst“), Backlog 5.36: Code-Vermerk ergänzt.
* [x] `tsc --noEmit` ohne Fehler. Kein Build, kein `npm run bilder`.
* [x] **Nachgebessert (User: „etwas heranzoomen, mehr Fokus auf das gelbe Auto und die Waschung“):** Ausschnitt rund 1,35-fach
  direkt im Kartenformat 16:10 (`ausschnitt` x 0,17–0,91, ab y 0,315), verglichen mit 1,28 und 1,41. Ergebnis 1200 × 750,
  150 KB; `imageHeight` in `data/detailing.ts` auf 750. Nur B46 (die Karte rendert `scope.image` allein auf
  `VehicleDetailingPage`).
**Referenzen:**
`data/detailing.ts`
`scripts/lib/fotos-liste.mjs`
`docs/backlog/schleife-5.md`

### ✅ Phase 8 — Galerie „Ergebnisse, die man sieht“ (B48–B58): je Platzhalter ein echtes Foto
**Auftrag des Users (14.10.):** Je Anhang eine Nummer aus B48–B58, saubere Benennung und Metadaten; alle Fotos echt.
**Ablauf je Foto:** Original per Bildvergleich in den Lieferordnern suchen → Hochformat-Ausschnitt 3:4 (Kachel Desktop
rund 3:4, mobil rund 0,54:1, mittig beschnitten) → Eintrag „GALERIE“ in `scripts/lib/fotos-liste.mjs`, 900 px breit →
`src`/`alt` in `components/DetailingGallery.tsx` → `bildherkunft.ts` echt → `motive.json` → Backlog-Vermerk.
* [x] **B54 Lederpflege** (5.40): `galerie/lederpflege-sportsitz-leipzig-carcare.webp`, 900 × 1200, 180 KB; Original
  „CarCare Innenaufbereitung Exklusiv mit Leder/image00006.jpeg“ (iPhone 17 Pro, 08.10.2026). Ausschnitt x 0,06–0,5775,
  y 0–0,92 (Desktop mit Gesicht, mobil Hand, Tuch und Pflegemittel mittig). `tsc` ohne Fehler.
* [x] **Nachgebessert (User: Symbol und Name fehlten auf der Fotokachel):** `Tile` in `DetailingGallery.tsx` legt über
  das Foto den Blauübergang als Verlauf von unten (`from-gray-950/90 via-blue-900/45 to-transparent`, untere zwei Drittel)
  und setzt Symbol und Namen weiß unten links, aus EINER Quelle wie beim Platzhalter. Keine „Beispiel“-Plakette auf Fotos.
* [x] Dabei behoben (bestand schon vorher): Mobil wurde „Innenaufbereitung“ abgeschnitten („Innenaufbereitu“). Erst mit
  `hyphens-auto` versucht, verworfen (trennte auch „Außenreini-gung“, gegen die Vorgabe des Users vom 03.10.: keine
  Trennstriche in Kacheln). Jetzt `GanzwortTitel` mit neuer Variante `als="span"` (keine Überschrift, sonst 18
  zusätzliche h-Elemente), mobil `p-3`, Symbolfeld 28 px, Abstand 6 px. Aufnahmen `output/b24/galerie-1440.png` und
  `galerie-390.png` (Build 14.10., 17:25): alle Namen ganz, Desktop unverändert 12 px.
* [x] **Umgestellt (User: „Blauübergang raus, daraus mit dem gleichen Blau eine Vignette“):** neue Klasse
  `.cc-galerie-vignette` in `styles/karten.css` im Blau der leeren Kacheln (`blue-900` = `--cc-trust-blue`, nicht das
  Grau-Blau `--cc-cta-blue` der Bildkarten), Aufbau wie `.cc-karten-vignette` (Ellipse plus Innensaum). Beschriftung mit
  leichtem Textschatten, weil die Vignette an der Unterkante schwächer ist als in der Ecke. Aufnahmen Build 17:29.
* [x] **B48 Innenaufbereitung** (5.37): `galerie/innenaufbereitung-fussraum-leipzig-carcare.webp`, 900 × 1200, 101 KB;
  Original „CarCare Innenaufbereitung Exklusiv mit Leder/image00002.jpeg“ (iPhone 17 Pro, 08.10.2026). Ausschnitt x 0,2–0,7625,
  volle Höhe: Matte mittig, Sitzecke, Armaturenbrett; endet vor dem Aufkleber mit der Fahrgestellnummer (rechter Rand).
  Backlog 5.37 bleibt „offen“ (Fortschritt vermerkt), bis alle Kacheln Fotos haben. `tsc` ohne Fehler.
* [x] **B51 Cockpit-Detail** (5.38): `galerie/cockpit-detailpinsel-leipzig-carcare.webp`, 900 × 1200, 110 KB; Original
  „CarCare Innenaufbereitung und Keramikversiegelung/image00007.jpeg“ (iPhone 17 Pro, 08.10.2026). Der Anhang kam als
  Zwischennachricht und lag nicht als Datei vor: per Kontaktbogen zugeordnet (00007 Pinsel am Wählhebel, nicht 00008).
  Ausschnitt x 0,12–0,62625, y 0,1–1. Hinweis an den User: 5.38 wünschte „Wischen über das Cockpit“; das zeigen 00009–00012.
* [x] **B56 Keramikschutz** (5.39): `galerie/keramikversiegelung-auftragen-leipzig-carcare.webp`, 900 × 1200, 96 KB;
  Original „… Keramikversiegelung/image00003.jpeg“ (iPhone 17 Pro, 08.10.2026, 14:15:42). Anhang nur im Chat: per Vergleich
  der fünf Keramikfotos zugeordnet (gelbes Tuch oben links, Flasche aufrecht). Ausschnitt x 0,24–0,8025, volle Höhe.
  Offen dazu: 5.41 („Versiegelung“ B52 und „Keramikschutz“ B56 werden eine Kachel), nicht beauftragt, beim User erwähnt.
* [x] **B57 Politur-Finish**, **B55 Motorraumpflege**, **B49 Außenreinigung**, **B53 Felgenreinigung**, **B50 Lackpolitur**,
  **B58 Endkontrolle**, **B52 Versiegelung**: alle aus dem Standard-Lieferordner „Neue Fotos Schleife September“ (iPhone 17 Pro,
  Juli/August 2026, unbearbeitet), per Kontaktbogen zugeordnet (Anhänge kamen als Zwischennachrichten, nur im Chat).
  B49: Kennzeichen des schwarzen SUV im Hintergrund weichgezeichnet (`unkenntlich`, im Prüfbogen unlesbar). B58 ist ein
  Ausschnitt desselben Fotos wie die Karriere-Karte Kfz-Aufbereiter (B103/B108). B52: User gibt „Versiegelung“ ein eigenes
  Foto, die Kacheln bleiben getrennt (5.41 vermerkt). B53/B52 Ausschnitt nach Sichtung nachgerückt (Bürste, Sprühnebel).
* [x] Build 14.10., 17:5x; `npm run bilder`: 151 Bildstellen, **0 Platzhalter**, B48–B58 „umbenannt (Nummer behalten)“, keine
  weitere Nummer entfallen. Gesamtansicht `output/b24/galerie-raster-1440.png` (ruhige Rasterfassung). `tsc` ohne Fehler.
**Referenzen:**
`components/DetailingGallery.tsx`
`scripts/lib/fotos-liste.mjs`

---

## Kommentare

### Phase 1
**Eingehalten:** unter 700 Zeilen (Liste ausgelagert, 313 + 426) ✅, Original nicht nach `public/` ✅, verlustfreie Quelle statt
Chat-Kopie ✅, Metadaten nach IPTC-Vokabular statt geraten ✅, Herkunft nur nach Aussage des Users ✅, Sichtung auf Kennzeichen
und personenbezogene Schrift ✅, Kopie statt Verschieben der Nutzerdatei ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (beim User):** Die Quelle heißt `hf_<Datum>_<Zeit>_<UUID>.png`. Das Namensmuster deutet auf eine Plattform hin,
   über die das Modell genutzt wurde (vermutlich Higgsfield), nicht auf ChatGPT direkt. Falls ja: Dort wurden Aufnahmen realer
   Personen hochgeladen; das KI-Verzeichnis und die Datenschutzerklärung nennen bisher nur OpenAI (`KI_WERKZEUGE`). Nicht geändert,
   ohne Bestätigung wäre das geraten.
2. 🟡 **Mittel (beim User):** Die KI hat kleine Schrift neu gezeichnet: Namensschild, Tischaufsteller und Monitorschriftzug sind
   Scheinschrift. Das ist mehr als „nur die Lichtverhältnisse“, wie das KI-Verzeichnis „KI-bearbeitet“ definiert. Sichtbar erst
   in der Vergrößerung; eingeordnet nach Aussage des Users.
3. 🟢 **Niedrig:** Die Quelle hat nur 1344 px Breite. Im Full-HD-Seitenhintergrund wird sie rund 1,8-fach vergrößert. Gibt es
   einen höher aufgelösten Export, genügt `npm run fotos -- --nur kundenempfang` (beide Fassungen).
4. ✅ **Behoben:** `npm run fotos` nannte am Ende jedes Laufs die Septemberlieferung.

**Antworten des Users (14.10.2026, nach Phase 3):**
- zu 1: „Ja Higgsfield, aber die Engine, die ich genannt habe, wurde genutzt.“ → Plattform in `motive.json` und
  `data/bildherkunft.ts` vermerkt. Die Metadaten bleiben bei der Engine (`AISystemUsed` fragt nach System/Modell).
  ⚠️ OFFEN: `KI_WERKZEUGE` (KI-Verzeichnis im Impressum, Datenschutzerklärung) nennt nur OpenAI; Higgsfield als Plattform,
  über die Fotos realer Personen liefen, ist dort nicht aufgeführt. Dem User vorgeschlagen, nicht eigenmächtig geändert.
- zu 2: „Das passt schon, das Urbild wurde nahezu sehr gering verändert.“ → `aufgewertet` bleibt, erledigt.
- zu 3: Höher aufgelöstes Bild angeboten, Frage nach der Performance (Antwort im Chat: bis 2000 px Breite, voraussichtlich
  ähnlich groß wie die alte Datei mit 192 KB). Wartet auf die Datei.
- zu 4: Neues Foto für B33 kommt später → Vermerk B33 „anzupassen“ in `motive.json`.

### Phase 2
**Eingehalten:** alle drei Stellen der Datei („überall“) ✅, Alternativtext beschreibt das gezeigte Motiv ✅, Plakette aus einer
Quelle (`bildherkunft.ts`) ✅, altes Motiv archiviert statt gelöscht ✅, Stilblatt („Fahrzeugschlüssel“, kein Gedankenstrich) ✅.
**Auffälligkeiten:**
1. 🟢 **Niedrig (inhaltlich, beim User):** Im Ablauf der Aufbereitung zeigen jetzt Schritt 02 („Termin anfragen“, B32) und
   Schritt 03 (Abgabe, B33) beide eine Schlüsselübergabe. Ausdrücklich gewünscht („überall“), deshalb so gelassen.

### Phase 3
**Eingehalten:** gemessen statt geschätzt (Kontrast, Zielgruppen, Inventar, Lektorat gegen denselben finalen Build) ✅,
Aufnahmen nur per Puppeteer mit Scroll-Halteschleife ✅, Full HD als Browserhöhe 945 statt 1080 ✅, Variante gegen den alten Stand
verglichen ✅.
**Was die Sichtprüfung besteht, ohne dass die Sache in Ordnung ist:** Das Aufnahmeskript meldet „gefunden“, sobald ein Bild
mit der Datei sichtbar ist. Ob der Ausschnitt gut ist, sagt es nicht; das stand im Bogen und ist dort beurteilt.
