# Lektorat der Website, Seite für Seite

**Auftrag (User, 2026-10-06):** „Seite für Seite eine Lektoratsprüfung aus Sicht eines professionellen Lektoratsprüfers.
Erst den Plan, danach starten wir."

**Umfang:** 29 Routen (22 Seiten + 7 Wissensartikel) und alle Texte, die auf jeder Seite stehen (Navigation, Fußzeile,
Formulare, Dialoge). Gemessen am Suchindex des Builds vom 05.10.: **rund 18.700 Wörter** Seiteninhalt einschließlich FAQ,
dazu Navigation, Knöpfe, Formulare, Bildtexte und Meta-Angaben, die der Suchindex bewusst nicht enthält.

**Arbeitsweise:** Je Seite ein Stopp. Ich lege die Befunde vor, du entscheidest, ich setze um und prüfe nach.

---

## Lösungswege, abgewogen

| Weg | Vorteil | Nachteil |
|---|---|---|
| A: Quelldateien lesen (`pages/`, `components/`, `data/`) | Änderung direkt an der Stelle | Text zerstückelt über viele Dateien, geteilte Bausteine (z. B. `data/services.ts`) mehrfach gelesen, eingeklappte und bedingte Texte fallen durch |
| B: Seite im Browser durchlesen | Leseeindruck wie beim Besucher | keine Nachweisbarkeit, kein Vorher/Nachher, Bildtexte und Meta unsichtbar |
| **C: Gerenderten Text je Route ausziehen, lesen, Befund zur Quelle zurückverfolgen** | Text in Lesereihenfolge wie beim Besucher, inklusive Bildtexten, Meta und aufgeklappter Inhalte; nach der Korrektur erneut ausziehen und vergleichen | ein Auszugsskript nötig (Puppeteer und `scripts/lib/preview-server.mjs` sind vorhanden) |

**Gewählt: C**, ergänzt um die Quelldateien für Texte, die erst nach einer Handlung erscheinen (Fehlermeldungen,
Erfolgsmeldungen, Suchergebnisse).

---

## Prüfkatalog (gilt für jede Seite)

Grundlage: Duden, 29. Auflage (2024), und das **amtliche Regelwerk 2024** (verbindlich seit 01.07.2024). Wichtigste
Änderung für uns: Erweiterte Infinitivgruppen mit „zu“ werden **immer** mit Komma abgetrennt, das Komma ist nicht mehr frei.

| Ebene | Was geprüft wird |
|---|---|
| **1 Korrektorat** | Rechtschreibung, Grammatik (Kongruenz, Kasus, Bezüge), Zeichensetzung (Kommas inkl. Infinitivgruppen 2024), Getrennt- und Zusammenschreibung, Bindestrich und Durchkopplung (z. B. „Smart-Repair-Verfahren“) |
| **2 Typografie** | deutsche Anführungszeichen „…“ und ‚…‘, Apostroph ’, Auslassungspunkte …, Bis-Strich – ohne Leerzeichen („8–17 Uhr“), Abkürzungen („z. B.“), Zahl und Einheit („3.500 m²“, „849 €“), Tausenderpunkt, doppelte Leerzeichen |
| **3 Projektregeln** (`CLAUDE.md`, Textregeln 1–6) | „CarCare Center“ nie allein und nie Subjekt in dritter Person, Wir-Form, „Sie“, „seit 1998“, „über 3.500 m²“, „Meisterbetrieb“, keine Gedankenstriche |
| **4 Stil und Verständlichkeit** | Satzlänge (ab 25 Wörtern prüfen), Nominalstil, Passiv, Füllwörter, Werbefloskeln ohne Fakt (SEO-GEO 4.3), Wiederholungen auf derselben Seite, Antwort zuerst, gleichbleibender Ton |
| **5 Konsistenz und Fakten** | Fachbegriffe nach Stilblatt, Zahlen, Preise und Zeiten seitenübergreifend gleich, Linktexte beschreiben das Ziel, Überschriften passen zum Abschnitt, Title, Description und H1 passen zum Inhalt |
| **6 Sprachliche Risiken** (Hinweis, keine Rechtsberatung) | Alleinstellungen und Superlative („bester“, „einzige“), Garantie- und „kostenlos“-Aussagen, Preisangaben, Stellenanzeigen (AGG) |
| **7 Barrierefreiheit der Sprache** | Bildbeschreibungen (`alt`), Beschriftungen für Vorlesegeräte (`aria-label`), Linktexte, Abkürzungen |

**Nicht umformuliert wird:** wörtliche Zitate (Mitarbeiterstimmen in `data/stimmen.ts`, Google-Bewertungen, Aussagen
Andrés), Markennamen in der Schreibweise des Inhabers (Glasurit, WINTEC, riparo, PDR.cloud), Rechtstexte (dort nur
Korrektorat, jede Änderung für die anwaltliche Prüfung markiert), JSON-LD-Beschreibungen in dritter Person (Textregel 2,
Ausnahme 2). Dort melde ich nur eindeutige Fehler.

---

## Befundformat (je Seite eine Datei unter `docs/lektorat/befunde/`)

| Nr | Stelle | Vorher | Nachher | Art | Regel / Begründung | Quelle |
|---|---|---|---|---|---|---|
| L01-03 | Hero, Untertitel | … | … | K | Komma Infinitivgruppe (Regelwerk 2024) | `components/HeroSection.tsx:24` |

**Nummern** `L<Seite>-<Fund>` mit Bindestrich, damit sie mit keinem Kundennummernraum (x.y) und keinem `R<n>` kollidieren.

**Arten und was damit passiert:**
- **K (Korrektur):** eindeutiger Regelverstoß. Setze ich um, du siehst die Liste.
- **S (Stil):** Vorschlag mit Vorher/Nachher. Setze ich erst nach deinem Ja um („alle S annehmen außer L01-07“ genügt).
- **F (Frage):** Fakt oder Inhalt, den nur André klären kann. Landet in `docs/lektorat/rueckfragen-andre.md`, im Text ändert
  sich nichts.
- **G (geteilt):** Die Quelle speist mehrere Seiten (z. B. `data/services.ts`, `data/faqs.ts`). Wird einmal geändert, die
  betroffenen Seiten stehen dabei.

---

## Seitenreihenfolge

Globale Bausteine zuerst, denn sie stehen auf jeder Seite. Danach nach Besucherzahl und Gewicht. Wörter laut Suchindex
(Inhalt + FAQ), ohne Navigation und Fußzeile.

| Seite | Route | Wörter | Stopp |
|---|---|---|---|
| L00 | Global: Navigation, Mega-Menü, Mobilmenü, Fußzeile, mobile Aktionsleiste, Aktions-Pillen, Anfrage-Dialog mit allen Formulararten und Meldungen, Suchdialog, Stellenfenster, 404, KI-Plaketten | ca. 2.000 (schätzen nach dem Auszug) | einzeln |
| L01 | `/` Startseite | 834 + 121 | einzeln |
| L02 | `/unfallinstandsetzung-leipzig` | 617 + 255 | einzeln |
| L03 | `/fahrzeugaufbereitung-leipzig` | 1.289 + 420 | einzeln |
| L04 | `/leistungen` | 652 + 158 | einzeln |
| L05 | `/aussenaufbereitung-leipzig` | 802 + 289 | einzeln |
| L06 | `/innenaufbereitung-leipzig` | 540 + 192 | einzeln |
| L07 | `/leasingrueckgabe-leipzig` | 841 + 336 | einzeln |
| L08–L10 | `/smart-repair-leipzig`, `/autolackierung-leipzig`, `/dellenentfernung-leipzig` | je 300–400 | zusammen |
| L11–L14 | `/hagelschadenreparatur-leipzig`, `/felgenreparatur-leipzig`, `/autoglas-leipzig`, `/fuhrparkservice-leipzig` | je 280–380 | zusammen |
| L15 | `/privatkunden` | 748 + 326 | einzeln |
| L16 | `/geschaeftskunden` | 780 + 277 | einzeln |
| L17 | `/ueber-uns` | 1.036 + 251 | einzeln |
| L18 | `/karriere` | 921 + 60 | einzeln |
| L19 | `/kontakt` | 258 | mit L18 oder einzeln |
| L20–L27 | `/autoaufbereitung-wissen` und 7 Artikel | je 330–570 | 2 Stopps (Hub + 3, dann 4) |
| L28–L29 | `/impressum`, `/datenschutz` | 333 und 603+ | zusammen, nur Korrektorat |
| L30 | Querschnitt: alle Titles, Descriptions, OG-Texte, JSON-LD, Bildbeschreibungen | – | einzeln |

---

## Ablauf je Seite (Stopp-Punkt)

1. Auszug der Route lesen (`output/lektorat/auszuege/<route>.md`) und die mechanische Vorprüfung dazunehmen.
2. Befundtabelle schreiben (`docs/lektorat/befunde/Lnn-<seite>.md`), jede Stelle zur Quelle zurückverfolgt.
3. **Stopp:** dir die Tabelle vorlegen, K bereits umgesetzt, S und F zur Entscheidung.
4. Angenommenes umsetzen, geteilte Quellen mit Hinweis auf die anderen Seiten.
5. Nachprüfen: `npm run build` (darin Nummern, FAQ-Abgleich, Suchindex, Gedankenstriche), bei Meta-Änderung
   `npm run meta`, Auszug neu erzeugen und mit dem alten vergleichen: Es darf sich nur ändern, was in der Tabelle steht.
6. Planungsdatei fortschreiben, Commit je Seite.

---

### ✅ Phase 0 — Vorbereitung: Stilblatt, Auszug, Vorprüfung
**Ziel:** Werkzeuge und verbindliche Schreibweisen, bevor die erste Seite gelesen wird. Ohne Stilblatt würde jede Seite
dieselben Fragen neu stellen.
* [x] Branch `2026-10-06-lektorat` angelegt; vorher Statusabgleich auf `main` committet (`c8454b9`).
* [x] **Stilblatt** `docs/lektorat/stilblatt.md`: User hat am 06.10. alle acht Empfehlungen übernommen („Setz bitte alles
  so um, wie du es vorgeschlagen hast“). Als Textregel 7 in `CLAUDE.md` verlinkt.
* [x] **Stilblatt durchgezogen** (Entscheidungen 1–5, nicht 8: die kommt mit L18), jede Stelle im Zusammenhang gelesen,
  Skript mit erwarteter Trefferzahl je Ersetzung: 12 + 4 + 1 × Spot-Repair, 6 × Pkw/Lkw, 23 × Ersatzwagen (Artikel und
  Pronomen mitgezogen), 97 Einheiten und 5 × „z. B.“ mit geschütztem Leerzeichen in 34 Dateien. Kommentare ausgenommen
  (erster Trockenlauf hätte 15 Kommentarzeilen erfasst, Skript danach auf Kommentarbereiche umgestellt). CRLF erhalten.
  Suchwörter „Ersatzfahrzeug“ und „Werkstattersatzfahrzeug“ in `SYNONYME` (`lib/suche.ts`).
* [x] **Gebaut** (06.10., Build 01:29): `scripts/lektorat-auszug.mjs` (Runner), `scripts/lib/lektorat-dom.mjs` (Browserteil),
  `scripts/lib/lektorat-pruefung.mjs` (Vorprüfung, 27 Regeln + Satzlänge). Build grün: tsc, 29/29 Prerender, FAQ-Abgleich,
  0 Gedankenstriche. Voller Lauf 1:31 min: 30 Auszüge, 41 K / 36 H; jede Route ≥ 90 % der Index-Wörter.
  Probelauf (Start, Fahrzeugaufbereitung, Karriere) deckte vier Schwächen auf, alle behoben: FAQ-Antworten galten nach dem
  Aufklappen weiter als „ausgeblendet“ und fielen aus der Prüfung; `sr-only`-Texte standen unmarkiert; Feldnamen kamen
  über `innerText` in Versalien; ausgeblendete Doppelungen („Fahrzeugaufbereitung“ neben „Fahrzeugaufbereitung•“,
  „Care“/„Repair“ an jeder Karte) wiederholten sich.
* [x] ~~Auszugsskript~~ (Beschreibung des Plans, umgesetzt wie folgt) `scripts/lektorat-auszug.mjs` (`npm run lektorat`): startet `vite preview` über
  `scripts/lib/preview-server.mjs`, lädt jede Route aus `dist/`, klappt alle Akkordeons und FAQ auf, liest in
  Lesereihenfolge Überschriften (mit Ebene), Absätze, Listen, Knöpfe, Linktexte, `alt`, `aria-label`, Title, Description,
  OG-Texte und JSON-LD-Beschreibungen. Schreibt je Route eine Markdown-Datei nach `output/lektorat/auszuege/`. Globale
  Bausteine einmal gesondert, dazu Dialoge durch Öffnen.
* [x] **Mechanische Vorprüfung** (`scripts/lib/lektorat-pruefung.mjs`), Rauchtest mit einem Satz voller Fehler: alle erkannt, je Fund mit Route und Umfeld: gerade Anführungszeichen, falscher
  Apostroph, „ - “ als Strich, doppelte Leerzeichen, Leerzeichen vor Satzzeichen, „z.B.“, Wortdoppelungen („die die“),
  Abweichungen vom Stilblatt (z. B. „Spot Repair“, „PKW“), „3.000 m²“, „CarCare“ allein, verbotene Namensformen,
  Sätze über 25 Wörter, „du/dein“.
* [x] **Wächterfrage** beantwortet, steht im Kopf aller drei Skripte (`CLAUDE.md`): *Was besteht die Vorprüfung, ohne dass der Text in Ordnung ist?* Sie findet nur
  bekannte Muster, Grammatik und Stil nie; ein leerer Lauf heißt nicht „fehlerfrei“. Und: Klappt ein Akkordeon nicht auf,
  fehlt sein Text still. Gegenmaßnahme: Das Skript meldet je Route, wie viele Elemente zugeklappt blieben, und vergleicht
  die Wortzahl mit dem Suchindex.
* [x] Probelauf auf 3 Routen (Start, Fahrzeugaufbereitung, Karriere), Auszug gegen die Seite gelesen. Danach im globalen
  Auszug zwei weitere Lücken: `<br>` wurde beim Zusammenfassen der Leerzeichen verschluckt (Fußzeile las sich als ein
  Satz), und der Anfrage-Dialog zeigt nur die Auswahl. Behoben: Zeilenumbruch über U+2028, Formulare über
  `/kontakt#contact-termin` und `#contact-business`; Linkziele auch an Listenpunkten. Zwei unsichtbare Zeichen (ZWSP, SHY),
  die das Schreibwerkzeug aus `\u200b`/`\u00ad` gemacht hatte, wieder als sichtbare Escapes.
* [x] Rückfragenliste `docs/lektorat/rueckfragen-andre.md` angelegt. `npm run lektorat` in die Messwerkzeug-Tabelle von `CLAUDE.md`.

### ✅ Phase 1 — L00 Globale Bausteine
**Ziel:** Texte, die auf jeder Seite stehen, einmal sauber, damit sie in den Seitenbefunden nicht 29-mal auftauchen.
* [x] Navigation, Mega-Menü, Mobilmenü, Fußzeile, Aktionsleiste, Aktions-Pillen
* [x] Anfrage-Dialog: alle Formulararten, Feldbeschriftungen, Platzhalter, Hilfetexte, Fehler- und Erfolgsmeldungen
  (Quelle zusätzlich `data/anfrageSchema.ts`, `components/formulare/`, `components/RequestForm.tsx`)
* [x] Suchdialog (inkl. „keine Treffer“), 404-Seite; Stellenfenster und KI-Plaketten erscheinen in den Seitenauszügen
* [x] **Befund** `docs/lektorat/befunde/L00-global.md`: 7 K umgesetzt (Öffnungszeiten „Mo–Fr: 7–18 Uhr“ an allen
  vier Stellen, zwei schließende Anführungszeichen, „…“ in sieben Platzhaltern, Schrägstriche, Ergänzungsstrich
  „Fuhrpark- & Autohaus-Lösungen“, „Strg + K“), 12 S zur Entscheidung, 3 H. Keine Sachfrage an André.
* [x] Nachgeprüft (Build 01:43): Build grün, `npm run meta` 0/29 außerhalb, Auszug vorher/nachher verglichen: nur die
  sieben Korrekturen geändert; Vorprüfung global 0 K, 2 H (lange Markenliste, „inkl.“ im Preis-Hinweis, beides gewollt).
* [x] **Entscheidung User 06.10.:** 08, 12, 13, 14, 16, 17, 18, 19 umgesetzt (tsc grün); 11 bleibt („Jobangebote“).
* [x] **09/10** (07.10.): nach der Erklärung wie vorgeschlagen „Wissen“. Vorher: User wollte erst wissen, warum die Fußzeile „Autoaufbereitung Wissen“/„Wissensbereich“ sagt.
  Antwort in `L00-global.md` (Redesign-Commit a701ce9 vom 03.06., keine Begründung dokumentiert, vermutlich Suchwort).
* [x] **15** (07.10.): Variante B, Feld bleibt „Name“, Platzhalter „Max“ in allen vier Formularen. Vorher: User schrieb „nur Vornamen“; Rückfrage, ob das Feld nur den Vornamen abfragen oder nur der
  Platzhalter einen Vornamen zeigen soll.

### ✅ Phase 2 — L01 Startseite
* [x] Auszug gelesen (rund 1.080 Wörter, 11 Bildtexte, JSON-LD), Befund `docs/lektorat/befunde/L01-startseite.md`:
  6 K umgesetzt (fünf Versicherernamen in Inhaberschreibweise, auch im FAQ der Geschäftskundenseite; falscher Bezug
  „Fuhrparks mit langjähriger Erfahrung“), 13 S, 2 F an André (Deutsche Post als Versicherer? „vrk+“?), 3 H.
  „Instandsetzung statt Tauschen“ ist Kundenwortlaut (4.12) und bleibt.
* [x] Nachgeprüft (Build 06.10. nach L01-K): Build grün, `meta` 0/29, Auszüge global und Start vorher/nachher verglichen:
  nur die beschlossenen Änderungen (Zähler „01 / 05“ und drei KI-Plaketten wechseln mit dem Erfassungszeitpunkt).
* [x] **Entscheidung User 07.10.:** alle S angenommen und umgesetzt (07–17 im Text, 18 Preisformat als Stilblatt 9,
  19 FAQ-Kundensicht als Stilblatt 10 und Textregel 2, Ausnahme 3). Build grün, Auszüge vorher/nachher: nur das
  Beschlossene. Überlaufprüfung Startseite und L02 (ad hoc, Desktop + mobil): keine neuen Überläufe; ein älterer
  (Überschrift „Versicherungen & Agenturen“ mobil 6 px) als L02-14 vorgemerkt.
### ✅ Phase 3 — L02 Unfallinstandsetzung, L03 Fahrzeugaufbereitung (je ein Stopp)
* [x] L02 gelesen, Befund `docs/lektorat/befunde/L02-unfallinstandsetzung.md`: 3 K (Ergänzungsstrich „Farbton- noch
  Effektunterschiede“ an 7 Stellen auf 6 Seiten, Großschreibung nach Doppelpunkt, „1 mm“ an 11 Stellen; Stilblatt 5
  und Vorprüfung um mm/cm/kg und um eine Preis-Regel (Stilblatt 9) erweitert), 7 S, 1 F (Dellen-Aussagen, 5 Seiten), 3 H.
* [x] Nachgeprüft (Build 07.10.): grün, `meta` 0/29, alle 30 Auszüge neu; L02 ohne K. Dabei eine Stelle mit großem
  „Weder“ (`faqs.ts:74`, Smart Repair) gefunden, die die erste Suche (Kleinschreibung) übersehen hatte: nachkorrigiert,
  neu gebaut, Auszug Smart Repair geprüft. Lehre: Suchen über Text immer ohne Groß-/Kleinschreibung.
* [x] **Entscheidung User 07.10.:** L02-S 04–10 und die vorsichtige Fassung zu L02-11 übernommen (neun Stellen plus zwei
  Kartentitel und JSON-LD), dazu 15 = B. Build grün, `meta` 0/29, alle Auszüge neu: geändert nur Unfall, Dellen, Felgen,
  Leasing, Leistungen, Privatkunden (erwartet), Platzhalter „Max“ in allen Formularen, sechs neue Vorlesetexte auf L02.
* [x] L03 Fahrzeugaufbereitung gelesen (rund 1.700 Wörter), Befund `docs/lektorat/befunde/L03-fahrzeugaufbereitung.md`:
  4 K (Ergänzungsstrich „Innenraum- und Außenpflege“, „unter anderem“, „Rund 30 Minuten“, **Stilblatt 9 auf allen Seiten**:
  34 Fließtextpreise ohne Cent plus Helfer `fliesstextPreis`), 6 S, 1 F (Motorreinigung „wasserlöslich“?), 3 H.
  Vorprüfung geschärft: Wortdoppelung ohne Artikel/Pronomen („die die“), Preisregel ohne reine Kacheln. Build grün,
  `meta` 0/29, Auszüge: geändert nur die sieben Seiten mit Fließtextpreisen und L03; Kacheln behalten den Cent-Betrag.
* [x] **Entscheidung User 08.10.:** L03-S 05–10 umgesetzt; F 11 bleibt bei André.

### ✅ Phase 4 — L04 Leistungsübersicht
* [x] L04 gelesen (rund 815 Wörter), Befund `docs/lektorat/befunde/L04-leistungen.md`: 2 K, beide seitenübergreifend
  („Meisterbetrieb seit 1998 und Glasurit-Lackpartner“ statt „… Glasurit-Lackpartner seit 1998“, Lackierung erst seit 2013;
  „ohne Wertminderung“ an drei weiteren Stellen nach L02-11), 4 S, 2 H. Build grün, `meta` 0/29, alle Auszüge neu:
  geändert nur Fahrzeugaufbereitung (L03-S), Innenaufbereitung (KC-Refresher), Leistungen, Privat- und Geschäftskunden.
* [x] **Entscheidung User 08.10.:** 03, 05, 06 umgesetzt, 04 bleibt.
### 🟨 Phase 5 — L05 Außen-, L06 Innenaufbereitung, L07 Leasingrückgabe (je ein Stopp)
* [x] L05 gelesen (rund 1.080 Wörter), Befund `docs/lektorat/befunde/L05-aussenaufbereitung.md`: 1 K mit Codefehler
  (`GanzwortTitel` trennte am geschützten Leerzeichen, weil `\s` in JavaScript U+00A0 einschließt; behoben, wirkt auf
  alle Überschriften), 3 S, 3 H. Einleitung und Außenpflege-Schritte sind Andrés Wortlaut.
* [x] Nachgeprüft (Build 08.10., 01:44): grün, `meta` 0/29, alle Auszüge neu: elf Überschriften auf neun Seiten tragen
  jetzt das geschützte Leerzeichen (K über alle Seiten 25 → 14, keine Einheit mehr ohne). Überlaufprüfung Außen, Felgen,
  Über uns: nur 1-px-Vorlesetexte. Notiert für L17: Zeitstrahl „2000: Spot- und Smart-Repair“ (Stilblatt 2).
* [ ] **Stopp:** L05-S (02–04) beim User.
### ⬜ Phase 6 — L08–L14 Reparaturleistungen und Fuhrpark (zwei Stopps)
### ⬜ Phase 7 — L15 Privatkunden, L16 Geschäftskunden
### ⬜ Phase 8 — L17 Über uns, L18 Karriere, L19 Kontakt
**Achtung:** Mitarbeiterstimmen sind Zitate, nur eindeutige Tippfehler und nur nach Rücksprache. Stellenanzeigen
zusätzlich auf AGG-neutrale Formulierung prüfen.
### ⬜ Phase 9 — L20–L27 Wissensbereich (zwei Stopps)
**Achtung:** Ratgebertexte sind informativ (SEO-GEO 4.1); Fachbegriffe hier besonders auf richtige Erklärung prüfen.
### ⬜ Phase 10 — L28–L29 Impressum und Datenschutz
**Achtung:** nur Korrektorat. Jede Änderung markieren, sie geht mit in die anwaltliche Prüfung (R6).

### ⬜ Phase 11 — L30 Querschnitt und Abschluss
**Ziel:** Was erst im Ganzen sichtbar wird.
* [ ] Alle Titles und Descriptions nebeneinander: einzigartig, Muster nach SEO-GEO 3.1, `npm run meta`
* [ ] JSON-LD-Beschreibungen und Bildbeschreibungen über alle Seiten
* [ ] Stilblatt-Gegenprobe über den ganzen Code: jede verworfene Schreibweise 0-mal
* [ ] Text kann Umbrüche verschieben: `npm run zielgruppen`, `npm run aussparung`, `npm run kontrast`, `npm run shots`
  gegen den letzten Build
* [ ] Kommentare und Optimierungsplan, Rückfragen an André bündeln, Push-Stand

**Referenzen:**
`CLAUDE.md` (Textregeln 1–6)
`SEO-GEO-STANDARDS.md` (3.1, 4.1–4.5)
`scripts/lib/suchindex.mjs` (Wortzahlen, Auswahlregeln des Index)

---

## Vor dem Start zu entscheiden (Stilblatt)

Gezählt in `pages/`, `components/`, `data/` am 06.10. Empfehlung jeweils zuerst.

| # | Frage | Bestand | Empfehlung |
|---|---|---|---|
| 1 | „Spot-Repair“ oder „Spot Repair“? | 31 × mit, 16 × ohne Bindestrich | **„Spot-Repair“**: zwei Substantive, Duden verlangt Bindestrich oder Zusammenschreibung |
| 2 | „Smart Repair“ bleibt getrennt? | 66 × getrennt, 5 × „Smart-Repair“ | **getrennt** (Adjektiv + Substantiv zulässig); in Zusammensetzungen durchkoppeln: „Smart-Repair-Verfahren“ |
| 3 | „Pkw/Lkw“ oder „PKW/LKW“? | 6 + 6 × Großbuchstaben | **„Pkw/Lkw“** (Duden-Empfehlung), auch im WINTEC-Text |
| 4 | Ein Wort für das Ersatzauto? | 13 × Werkstattersatzfahrzeug, 10 × Ersatzfahrzeug, 8 × Ersatzwagen, 2 × Mietwagen | **„Ersatzwagen“** im Fließtext, „Werkstattersatzfahrzeug“ nur, wo der Fachbegriff gemeint ist; „Mietwagen“ nur für echte Mietwagen |
| 5 | Zahl und Einheit untrennbar (geschütztes Leerzeichen)? | normale Leerzeichen | **ja** bei m², €, %, km, Uhr und in „z. B.“ |
| 6 | Uhrzeiten | „8–17 Uhr“ | **so lassen**, nur einheitlich; DIN-Form „08:00“ wirkt im Fließtext steif |
| 7 | Telefonnummer | „0341 - 261 77 90“ | **bleibt** (NAP-Schreibweise laut `SEO-GEO-STANDARDS.md`, Textregel 6 erlaubt den Strich), obwohl DIN 5008 „0341 2617790“ wäre |
| 8 | Berufsbezeichnungen in Stellen | „Fahrzeuglackierer“, „Fahrzeuglackierer/in“, „Bürokaufmann/-frau“ gemischt | **einheitlich**, z. B. „Fahrzeuglackierer (m/w/d)“ in Titeln; Entscheidung bei dir bzw. André |

---

## Kommentare

### Phase 0 und 1
**Eingehalten:** Stilblatt vor dem ersten Lesen ✅, jede Ersetzung mit erwarteter Trefferzahl ✅, Kommentare und Zitate
unberührt ✅, CRLF erhalten ✅, Dateien unter 700 Zeilen (Runner 323, Browserteil 227, Prüfung 85) ✅, Wächterfrage in
allen drei Skripten ✅, Vorher/Nachher-Vergleich statt Annahme ✅, Build + `meta` gegen den neuen Build ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Das Schreibwerkzeug macht aus `\u200b`/`\u00ad` echte unsichtbare Zeichen, zweimal in dieser Sitzung
   (Regex im Browserteil, Text dieser Planung). Behoben, Prüfung per `chr()`-Zählung; Memory ergänzt.
2. 🟡 **Mittel:** Öffnungszeiten standen in zwei Schreibweisen im Code (`OEFFNUNG_NEUTRAL` „Mo–Fr 7–18 Uhr“ und
   `OEFFNUNG_ANZEIGE` „Mo – Fr: 07:00 – 18:00“). Jetzt beide aus `stunde()`; `samstagKurz` hängt an L00-08.
3. 🔵 **Niedrig:** Der Formularhinweis „Online-Versand wird gerade eingerichtet“ ist im lokalen Build sichtbar und
   könnte bei einer Sichtprüfung lokal für einen Fehler gehalten werden (L00-21).

## Quellen

- Rat für deutsche Rechtschreibung, Amtliches Regelwerk 2024: https://www.rechtschreibrat.com/DOX/RfdR_Amtliches-Regelwerk_2024.pdf
- Pressemitteilung zur Aktualisierung (03.07.2024): https://www.rechtschreibrat.com/DOX/RfdR_PM_2024-07-03_Aktualisierung_Regelwerk.pdf
- Duden, Handreichung Rechtschreibduden 2024: https://cdn.duden.de/public_files/2024-08/Handreichung_Rechtschreibduden_2024.pdf
- DIN 5008, Telefonnummern (Zusammenfassung): https://www.teltarif.de/festnetz/telefonnummer-schreibweise.html
