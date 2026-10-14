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
