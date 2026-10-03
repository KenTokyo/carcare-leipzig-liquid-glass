# Karriere „Aus dem Team“: Mitarbeiterstimmen als aufklappende Karten mit Foto und Vorname

**Auftrag (User, 2026-10-03):** Im Abschnitt „Was Kolleginnen und Kollegen über die Arbeit sagen.“ auf `/karriere`:
- den Untertext „Bewusst ohne Namen …“ entfernen;
- die Stimmen im Design der Leistungskarten der Startseite zeigen. Eingeklappt sind nur Berufsbezeichnung und
  Bildvorschau zu sehen. Beim Überfahren mit der Maus klappt die Karte auf und zeigt Kommentar, Vornamen und Bild;
- die Textkachel steht diesmal NICHT links, sondern im unteren Drittel der Karte;
- die Gesichter dürfen nicht von Textkacheln überdeckt werden;
- Berufe und Vornamen stehen in den Dateinamen der Fotos;
- „Es handelt sich hier um echte Mitarbeiter, die ihr Einverständnis zur Nutzung der Bilder gegeben haben.“

**Backlog:** 5.28 (Porträts zu den Stimmen), berührt 3.19 („keine Namen“, damit aufgehoben) · **Branch:**
`2026-10-02-stimmen-zusatzregeln`
**Wunsch des Users (03.10.):** keine lange Prüfung. Eine Kurzprüfung genügt, den Abschlusstest macht der User.

## Bestandsaufnahme vor dem Code

**Fotos:** Die Originale liegen in `Downloads/wetransfer_image00001-jpeg_2026-10-02_1001/`, die Chat-Anhänge sind
umbenannte Kopien. Alle fünf sind 5712 × 4284, EXIF-gedreht (Hochformat 3:4), laut EXIF mit einem iPhone 17 Pro am
02.10.2026 zwischen 08:07 und 10:11 aufgenommen. Weder EXIF noch XMP nennen eine Bearbeitungssoftware.

| Datei | Vorname | Beruf auf der Seite (`data/stimmen.ts`) |
|---|---|---|
| `Josie-Lackiererin-Carcare-leipzig.jpeg` | Josie | Fahrzeuglackiererin |
| `Marko-Serviceberater-Carcare-leipzig.jpeg` | Marko | Serviceberater |
| `Michal-Lackierer-Carcare-leipzig.jpeg` | Michal | Fahrzeuglackierer |
| `Eshan-Aufbereiter-carcare-leipzig.jpeg` | Eshan | Kfz-Aufbereiter |
| `Karol-Karosseriebauer-carcare-leipzig.jpeg` | Karol | Karosserie- und Fahrzeugbaumechaniker |

„Karosseriebauer“ im Dateinamen ist die Kurzform. Auf der Seite bleibt der Beruf aus den Stellenkarten derselben Seite
(`data/jobs.ts`), wie bei den Aussagen am 02.10.

**Vorlage:** `components/ExpandingCardAccordion.tsx`, Leistungsübersicht der Startseite (`ServiceGrid`).
- Desktop ein waagerechtes Akkordeon (Höhe 460 px, `flexGrow` 6 zu 1, Titel der eingeklappten Streifen senkrecht).
- Mobil ein senkrechtes Akkordeon (64 px Streifen, Höhe animiert).
- Weiße Kachel (92 %) links, blauer Punkt, Verlauf und Vignette in Schwarzblau, Logo-Abzeichen.
- Jede Karte ist ein Link.

**Warum nicht einfach dieselbe Komponente:**
1. Eine Stimme ist kein Link. Es gibt kein Ziel, und eine Aussage gehört in `figure`/`blockquote`/`figcaption`.
2. Die Kachel steht unten statt links.
3. Die Hochformat-Porträts brauchen eine andere Geometrie. Bei 6 zu 1 und voller Breite wäre die offene Karte bei
   1440 px rund 830 × 460 groß (1,8 : 1). Von einem Hochformat blieben dann 42 % der Höhe, und das Gesicht füllte die
   Karte bis ins untere Drittel.

**Lösungswege:**
- (a) `ExpandingCardAccordion` um eine Variante erweitern: Links optional, Kachel oben oder unten, andere Inhalte. Das
  ergäbe drei Sonderfälle in einer 459-Zeilen-Komponente, die Startseite, Karriere und Expertise trägt.
- (b) ✔ Eigene Komponente im selben Design, mit geteilter Mechanik.
  - Neu: `components/akkordeon.ts` mit Gerät (Desktop, Hover), Übergang und Kartenrahmen. Das Startseiten-Akkordeon
    nutzt es ebenfalls, so gibt es keine zweite Kopie der Erkennung.
  - Gestaltung wie dort: Rahmen, Verlauf, Vignette, senkrechte Titel, weiße Kachel mit blauem Punkt, Logo-Abzeichen,
    gleiche Animation.
- (c) Kartenraster ohne Akkordeon: einfacher, aber nicht das Design der Startseite.

**Geometrie** (gerechnet, im Kurztest per Bildschirmfoto geprüft):
- Desktop: Höhe 520 px, `flexGrow` 3 zu 1, höchstens 1152 px breit (`max-w-6xl`). Die offene Karte ist dann
  473 × 520 (1440 px) bzw. 398 × 520 (1024 px). Von einem 3:4-Bild bleiben 82 bis 98 % der Höhe sichtbar.
- Mobil: offene Karte 500 px hoch.
- Die Kachel bleibt im unteren Drittel. Jedes Porträt wird deshalb so auf 3:4 zugeschnitten, dass Kopf und Kinn
  zwischen rund 14 und 60 % der Bildhöhe liegen. So bleibt in jedem Fenster (82 bis 98 % sichtbar, mittig) das
  Gesicht über 2/3 der Karte. Gemessen am Raster der Originale, nicht geschätzt.
- Fokuspunkt (Gesichtsmitte, Augenlinie) je Foto für `object-position`: Er hält das Gesicht im schmalen Streifen
  der eingeklappten Karte (Bildvorschau) und mobil im 64-px-Streifen.

### ✅ Phase 1 — Fotos
* [x] `scripts/build-fotos.mjs`: fünf Einträge `team/stimme-<beruf>-leipzig-carcare.webp` (900 × 1200, 38–92 KB), Ordner
      `ORDNER_STIMMEN_OKT26` (WeTransfer-Download), 3:4-Ausschnitt je Foto am Raster gemessen, Metadaten ohne Namen,
      `digitalCapture`
* [x] Ausschnitte mit eingezeichnetem Kartenfenster geprüft: alle Gesichter über der Kachelkante. Keine fremden
      Kennzeichen im Bild. Beim Serviceberater lagen ein handschriftlicher Zettel und Auftragsblätter am Klemmbrett auf dem
      Tisch: kaum lesbar, aber möglicherweise mit Kundendaten, deshalb weichgezeichnet (`unkenntlich`).
* [x] `data/bildherkunft.ts`: 5 × „echt“ mit Beleg (Angabe des Users, EXIF ohne Bearbeitungssoftware);
      `docs/bilder/motive.json`: Motiv und Herkunft je Datei (ohne Vornamen), B142–B146 „angepasst“, Platzhaltervermerk
      „stimmen“ auf erledigt
**Referenzen:**
`scripts/build-fotos.mjs`
`data/bildherkunft.ts`

### ✅ Phase 2 — Daten und Komponente
* [x] `data/stimmen.ts`: `vorname`, `foto` mit Maßen und Fokuspunkt (Augenlinie und Gesichtsmitte am 2-%-Raster
      gemessen), Kopf neu (Namen auf Wunsch des Users, Widerruf = zwei Zeilen und Datei löschen)
* [x] `components/akkordeonKarten.tsx` (Gerät, Übergang, Rahmen, Schleier, Logo). `ExpandingCardAccordion` nutzt es,
      Klassen unverändert. Im Dev-Server geprüft: Startseite, Hover auf die vierte Karte klappt sie auf (469 px), die erste
      zu (78 px), Logo an der offenen Karte
* [x] `components/Stimmen.tsx`: Akkordeon im Startseiten-Design, Kachel unten (höchstens ein Drittel, scrollt im
      Notfall), `figure`/`blockquote`/`figcaption`, Name mit blauem Punkt, Logo oben rechts. Fokus und Tipp klappen auf.
      Der Beruf steht im eingeklappten Streifen am Desktop senkrecht unten (bricht nach 40 % um), mobil oben über der
      Stirn mit Verlauf. `data-bild-ort` unverändert, also bleiben B142–B146
* [x] `pages/CareerPage.tsx`: Untertext „Bewusst ohne Namen …“ entfernt, Kommentar nachgezogen
**Referenzen:**
`components/Stimmen.tsx`
`components/akkordeon.ts`
`data/stimmen.ts`

### ✅ Phase 3 — Doku und Kurzprüfung (kein Messlauf)
* [x] Backlog 5.28 ✅, 3.19 (Vorgabe „keine Namen“ aufgehoben), Schleife 5 17 → 16, zusammen **49 → 48** (nachgezählt mit
      den Regeln von `npm run push-stand`); Memory `mitarbeiterstimmen-fotos`
* [x] `tsc` grün · **Build 03.10., 02:32:18** grün (Prerender 29/29, FAQ, Dummies, Gedankenstriche 0) · ausgeliefertes
      `/karriere` nennt die fünf Vornamen, der Untertext ist weg
* [x] **Gesicht gegen Kachel gemessen** (Puppeteer gegen den Dev-Server; je Fenster jede Karte aufgeklappt, wie ein Mensch
      per Maus bzw. Tipp). Gerechnet aus Bildgeometrie, `object-position` und Kopf-/Kinnlage je Foto: **25 von 25 ✓** (1920,
      1440, 1024, 390, 320). Kopf nie angeschnitten, Kinn bzw. Bartende 50–163 px über der Kachel, Kachel 21–32 % der
      Kartenhöhe, keine scrollt. Erster Lauf bei 320 px: vier Karten blieben zu, weil der Test unter die mobile
      Aktionsleiste tippte (Testfehler, kein Seitenfehler). Seitdem scrollt er vorher hin.
* [x] Bildschirmfotos 1440 (offen: Josie bzw. Karol) und 390 angesehen. Mobil stand der Beruf im 64-px-Streifen zuerst
      unten auf dem Mund. Er steht jetzt oben, die Augen darunter (`fokus.y − 6`)

### ✅ Phase 4 — Volle Containerbreite (User, 2026-10-03, zweiter Auftrag)
**Ziel:** „Bitte zieh die Karten breiter auf die normale Breite, wie es beispielsweise bei der Mainpage mit den
Autoaufbereitungs als Expertise Karten ist. Jetzt sind links und rechts jeweils zuviel Platz.“
* [x] `max-w-6xl` entfernt: Das Akkordeon nutzt den ganzen Container wie `AutoDetailingExpertiseSection`.
* [x] Neu gerechnet. Bei voller Breite wird die offene Karte breiter: 528 px bei 1280 bis 1535 px, 638 px ab 1536 px.
      Mit 520 px Höhe blieben ab 1536 px nur 61 % des Hochformats sichtbar, und Karols Kopf oder Bart lägen außerhalb.
      Deshalb gilt ab 1536 px eine Höhe von 600 px (`2xl:h-[600px]`). Die offene Karte ist damit nie breiter als
      1,07 × ihre Höhe, und mindestens 70 % des Bildes sind sichtbar.
* [x] Bildlage am Desktop 30 % statt 50 %: Das Fenster rückt nach oben. So bleibt über Karols Kopf Luft, und sein
      Bartende (61 %) endet trotzdem über der Kachel.
* [x] Gemessen an 7 Breiten (1920, 1600, 1440, 1280, 1024, 390, 320) × 5 Karten: **35 von 35 ✓**. Der Kopf ist nie
      angeschnitten (mindestens 31 px Luft). Kinn bzw. Bartende liegen mindestens 46 px über der Kachel, die Kachel nimmt
      18–32 % der Kartenhöhe ein und scrollt nirgends. Bildschirmfotos 1440 und 1920 px angesehen.
* [x] **Build 03.10., 02:42:25** grün (Prerender 29/29, FAQ, Dummies, Gedankenstriche 0); `/karriere` ohne `max-w-6xl`
**Referenzen:**
`components/Stimmen.tsx`

---

## Kommentare
### Phasen 1–3
**Eingehalten**: Wunsch des Users wörtlich (Untertext weg, Startseiten-Design, eingeklappt Beruf + Bild, aufgeklappt
Aussage + Vorname + Bild, Kachel unten) ✅, Gesichter frei GEMESSEN statt geschätzt (25/25) ✅, Herkunft nur mit Beleg ✅,
Datenschutz (Vornamen nicht in den Bilddateien, Schreibtischzettel weichgezeichnet, Widerruf dokumentiert) ✅, eine Quelle
für die Akkordeon-Mechanik ✅, Bildnummern bleiben ✅, semantisches HTML (`figure`, `blockquote`, `figcaption`) und Tastatur
✅, keine Gedankenstriche ✅, unter 700 Zeilen ✅, kein Messlauf (Wunsch des Users) ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Originale liegen nur im Download-Ordner** (`Downloads/wetransfer_image00001-jpeg_2026-10-02_1001`). Ein
   Aufräumen dort, und `npm run fotos` findet die Quelle nicht mehr. Empfehlung: in den Lieferordner verschieben
   (`Kunden/CarCare-Center/Fotos/…`) und `ORDNER_STIMMEN_OKT26` anpassen. Das ist bewusst nicht von hier aus geschehen,
   denn der Ordner ist geteilt.
2. 🟢 **Niedrig — Vorgabe „keine Namen“ (3.19) aufgehoben.** Sie stammte aus dem Review. Aufgehoben hat sie jetzt der User,
   mit Einwilligung der Mitarbeitenden. Im Backlog vermerkt (3.19, 5.28). Die schriftlichen Einwilligungen gehören in den
   Betrieb (Kopf von `data/stimmen.ts`).
3. 🟢 **Niedrig — mobiler Streifen**: Auf 64 px passt kein ganzes Gesicht. Der Beruf steht über Stirn und Haar, Augen und Nase
   darunter (gemessen 41–50 px). Ganz ohne Überdeckung ginge es nur ohne Gesicht im Streifen (T-Shirt-Ausschnitt). Das ist
   als Alternative notiert, falls der User es so möchte.
4. 🟢 **Niedrig — für den Abschlusstest**: `npm run bilder` (B142–B146 wechseln von „Platzhalter“ zu „Bild“, Nummern
   bleiben über `VORGAENGER`) und `npm run kontrast -- /karriere` (weißer Beruf auf Foto mit Verlauf, wie auf der
   Startseite).
5. ✅ **Fixed — doppelte Akkordeon-Mechanik vermieden**: Statt einer Kopie teilen beide Akkordeons `akkordeonKarten.tsx`. Die
   Startseite ist im Dev-Server nachgeprüft.

### Phase 4
**Eingehalten**: Breite wie die Expertise-Karten der Startseite ✅, Gesichter weiter frei und an 7 Breiten gemessen (35/35) ✅,
Geometrie im Kopf von `components/Stimmen.tsx` neu begründet ✅, kein langer Messlauf ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig — die Gesichtsmessung ist kein Werkzeug im Repository.** Sie lief als Skript aus dem Scratchpad gegen den
   Dev-Server. Rechnung: Bildgeometrie und `object-position`, dazu Kopf- und Kinnlage je Foto gegen die Oberkante der
   Kachel, jede Karte per Maus bzw. Tipp aufgeklappt. Vorschlag: als `npm run stimmen` nach dem Muster der übrigen
   Messwerkzeuge aufnehmen (eigener `vite preview`, Build-Stand; Eintrag in der Tabelle in `CLAUDE.md`). Dann ist bei
   jedem neuen Porträt messbar, dass kein Gesicht unter der Kachel liegt. Die Kopf- und Kinnwerte gehören dafür neben
   den Fokuspunkt in `data/stimmen.ts`.
