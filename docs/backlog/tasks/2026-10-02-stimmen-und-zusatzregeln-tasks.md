# Mitarbeiterstimmen mit Fotoplatz (5.28) und Buchungsregeln der Zusatzleistungen (6.7)

**Auftrag (User, 2026-10-02):** „Nun möchte ich die Platzhalter unter ‚Aus dem Team‘ unter Karriere füllen mit Inhalt.
Dazu habe ich eine Mail von Andre bekommen. Ich möchte, dass du zu jeder Mitarbeiterstimme noch ein Foto des Mitarbeiters
vorsiehst. Die Fotos werden noch zugesandt.“ Dazu: „Außerdem soll im Formular zur Terminanfrage von
Aufbereitungsdienstleistungen folgende Regeln gelten“ (Liste aus Andrés Mail, unten wörtlich).
**Backlog:** 5.28 (`docs/backlog/schleife-5.md`, Stimmen + Foto-Option) · 6.7 (`docs/backlog/schleife-6.md`, Ausgrau-Regeln)
· berührt 6.6 (Versiegelungen als „Gewünschte Leistung“)
**Branch:** `2026-10-02-stimmen-zusatzregeln`

## Andrés Lieferung (Mail, vom User am 2026-10-02 weitergegeben)

**Mitarbeiterstimmen** (Beruf: Aussage)

| Andrés Bezeichnung | Aussage |
|---|---|
| Lackiererin | „ich mag die Leute und meine Arbeit , ich fühle mich wohl!“ |
| Serviceberater | „es macht mir Spaß und ich mag die Bude!“ |
| Lackierer | „gute Atmosphäre, schöne Firma, gutes Geld!“ |
| Aufbereiter | „ich kann mich hier weiterentwickeln und habe ein gutes Team in dem ich arbeite.“ |
| Karosseriebaumechaniker | „ich kann hier das machen, was ich liebe!“ |

**Buchungsregeln der Zusatzleistungen**

| Zusatzleistung | Regel (Andrés Wortlaut) |
|---|---|
| Motorreinigung | buchbar allein oder mit Intensiv Innenraumreinigung/Brillant Außenpflege/Lackaufbereitung |
| Ozonbehandlung | buchbar allein oder zu allen Programmen |
| Heißvernebelung | buchbar allein oder zu allen Programmen |
| Cabrioverdeck | buchbar allein oder zu allen Programmen |
| Felgenintensivreinigung | buchbar allein oder zu allen Paketen |
| Frontscheibenversiegelung | buchbar allein oder zu allen Paketen |
| Keramikversiegelung | buchbar nur in Kombination mit Brillant oder Lackaufbereitung |
| Nanoversiegelung | buchbar nur in Verbindung mit Brillant oder Lackaufbereitung |

## Auslegung (vor dem Code festgelegt)

* **„allein“** = ohne Paket. Dafür gibt es im Feld „Gewünschte Leistung“ bisher nur „Sonstiges“, was niemand findet → neue
  Option **„Nur Zusatzleistungen“**. „Sonstiges“ zählt ebenfalls als „ohne Paket“ (es ist keins).
* **„zu allen Programmen/Paketen“** = zu jeder Leistung der Auswahl (fünf Pakete und Leasingrückgabe), keine Sperre.
* **Motorreinigung** wörtlich: nur ohne Paket oder zu Intensiv Innenraumreinigung, Brillant Außenpflege, Lackaufbereitung.
  Gesperrt also auch zu Premiumpflege „exklusiv“ und Leasingrückgabe (nicht genannt → Rückfrage an André, siehe unten).
  Zur Premiumpflege bleibt der genauere Grund „In der Premiumpflege enthalten“.
* **Keramik/Nano** wörtlich: nur zu Brillant Außenpflege oder Lackaufbereitung, **nicht allein**. Das widerspricht 6.6
  (beide als „Gewünschte Leistung“ allein wählbar) → 6.6 geht für Keramik/Nano in 6.7 auf. Keramik ⟂ Nano bleibt
  (Seitentext: „Wachs-, Nano- oder Keramikversiegelung“, Alternativen).
* **Felgenintensivreinigung** zur Premiumpflege: Im Meeting (6.7) hieß es „würdest du dir eigentlich nicht wählen“, die
  Mail sagt „zu allen Paketen“ → die Mail ist neuer und ausdrücklich, also **keine** Sperre.
* **Mitarbeiterstimmen:** Wortlaut unverändert, nur Rechtschreibung (Satzanfang groß, Leerzeichen vor dem Komma weg,
  Komma vor „in dem“). Berufe in der Schreibweise der Stellenkarten derselben Seite (Abschnittstext: „Die Berufsbezeichnung
  sagt mehr darüber aus, ob die Stelle zu Ihnen passt“): Fahrzeuglackiererin, Serviceberater, Fahrzeuglackierer,
  Kfz-Aufbereiter, Karosserie- und Fahrzeugbaumechaniker. Reihenfolge wie in der Mail.

**Rückfragen an André (nicht blockierend, umgesetzt ist die wörtliche Fassung):**
1. Motorreinigung zur **Leasingrückgabe** und zur **Premiumpflege „exklusiv“**: nicht genannt, deshalb gesperrt. Gewollt?
2. Keramik-/Nanoversiegelung zur **Premiumpflege** (enthält die Brillant Außenpflege): nicht genannt, deshalb gesperrt. Gewollt?

---

### ✅ Phase 1 — Regeln als Daten: eine Quelle für Formular, Server, Kacheln und FAQ *6.7, 6.6*
**Ziel:** Andrés Tabelle als Daten in `data/zusatzleistungen.ts` (ohne Laufzeit-Importe, `check-dummies` führt die Datei
aus), die Auswertung samt sichtbarer Gründe in einem eigenen Modul, das die Paketnamen kennt.
* [x] `buchbar: { einzeln, zu }` je Zusatzleistung statt `auchAlsLeistung`, Andrés Wortlaut als Kommentar am Eintrag;
      zwei Bausteine `UEBERALL` und `NUR_ZU_BRILLANT_ODER_LACK`. Kacheltexte: Motorreinigung ohne „zu den übrigen
      Paketen buchen Sie sie einzeln dazu“ (stimmt seit 6.7 nicht mehr), Keramik ohne „etwa nach der Brillant Außenpflege“
      (die Kachelzeile nennt jetzt beide Pakete)
* [x] `data/leistungsauswahl.ts`: Option „Nur Zusatzleistungen“ (`NUR_ZUSATZ = 'nur-zusatz'`), Merkmal `ohnePaket` an ihr
      und an „Sonstiges“; die drei Versiegelungen nicht mehr als Leistung (6.6 → 6.7) und damit kein Import mehr aus
      `zusatzleistungen.ts` (8 statt 10 Optionen)
* [x] Neues Modul `data/zusatzregeln.ts` (147 Zeilen): `regelText` (Satzteil aus den Paketnamen der Auswahl),
      `buchbarText`, `sperrgrund`, `hinweisVorDerWahl`, `bereinigteZusaetze`, `abgewaehlteZusaetze`,
      `fehltZusatzleistung` + `FEHLT_ZUSATZLEISTUNG`, `zusatzFaqAntwort`. Prüfung beim Laden: unbekannte IDs in `zu`/
      `nichtMit`, „ohne Paket“-Leistung in `zu`, ID zugleich Leistung und Zusatz (vorher in `anfrageSchema.ts` mit
      6.6-Ausnahme), fehlende Option `nur-zusatz`, Name nicht auf „-ung“ (die FAQ setzt „die“ davor)
* [x] `data/anfrageSchema.ts`: Doppel-ID-Prüfung samt Ausnahme entfernt (Verweis auf die neue Stelle); `.gitignore`:
      erzeugtes `data/zusatzregeln.js`
* [x] Matrix am kompilierten Stand (`build-email` + Node), 8 Zusatzleistungen × 9 Leistungszustände, Zeile für Zeile
      gegen Andrés Tabelle: Keramik/Nano nur bei Brillant und Lackaufbereitung; Motorreinigung bei „Nur Zusatzleistungen“,
      Sonstiges, Innenraum, Brillant, Lack, gesperrt bei Premiumpflege („In der Premiumpflege enthalten“), „exklusiv“ und
      Leasingrückgabe; die übrigen fünf überall. Keramik ⟂ Nano unverändert. `tsc --noEmit` grün
**Referenzen:**
`data/zusatzregeln.ts`
`data/zusatzleistungen.ts`
`data/leistungsauswahl.ts`
**Lösungswege „allein buchbar“:** (a) jede allein buchbare Zusatzleistung zusätzlich als Leistung (wie 6.6) — 13
Optionen, Pakete und Extras gemischt, Regeln bräuchten den Sonderfall „Leistung ist ein Extra“ · (b) nur „Sonstiges“ —
niemand findet es, und in der Mail steht „Sonstiges“ · (c) ✔ eine Option „Nur Zusatzleistungen“: genau Andrés Modell
(Paket oder allein, dazu Extras), jede Zusatzleistung steht an EINER Stelle im Formular
**Lösungswege Gründe:** (a) Gründe als Freitext je Regel — läuft beim Umbenennen eines Pakets auseinander · (b) ✔ aus
den Paketnamen abgeleitet (`terminLeistungen`), dieselben Wörter wie in der Auswahl

### ✅ Phase 2 — Formular und Server *6.7*
**Ziel:** Gesperrt mit Grund statt versteckt (wie bisher), Hinweis vor der Wahl, keine stille Abwahl, „Nur
Zusatzleistungen“ nur mit mindestens einem Kästchen — im Browser und verbindlich auf dem Server.
* [x] `TerminFelder`: Hinweis (grau, `text-[11px]`) an Keramik, Nano und Motorreinigung, solange keine Leistung gewählt
      ist; danach gesperrt mit demselben Satz als Grund oder ohne Hinweis. „Nur Zusatzleistungen“ klappt die Liste auf,
      die Überschrift wird „Zusatzleistungen (mindestens eine)“, ohne Kästchen steht „Bitte wählen Sie mindestens eine
      Zusatzleistung.“ in der Liste und als Gültigkeitsmeldung am Auswahlfeld (Browser hält das Absenden an, auch bei
      zugeklappter Liste)
* [x] `RequestForm`: `abgewaehlteZusaetze` beim Leistungswechsel → Hinweis über der Liste „Abgewählt: Keramikversiegelung
      (nur zusammen mit Brillant Außenpflege oder Lackaufbereitung).“; Live-Region steht immer im DOM (`role=status`,
      leer als `sr-only`), damit Vorlesegeräte die Änderung ansagen; Anhaken eines Kästchens räumt den Hinweis.
      Kommentar in `startwerte`: Kachel hakt an, Leistung bleibt offen, ohne Leistung sperrt keine Buchungsregel
* [x] `api/anfrage.ts`: Import aus `zusatzregeln.js`; „Nur Zusatzleistungen“ ohne allein buchbare Zusatzleistung → 400
      „Bitte wählen Sie mindestens eine Zusatzleistung.“ (auch „nur Keramik“); sonst wie bisher bereinigt
* [x] `npm run test:email` **PASS**: Leistung jetzt „aussen“; neu: Keramik als Leistung → 400, Keramik + Felgen zur Brillant
      Außenpflege mit Preisen in der Mail, Keramik zur Innenraumreinigung fällt heraus (Ozon bleibt), Motorreinigung zur
      „exklusiv“ heraus (Cabrio bleibt) und zur Lackaufbereitung drin, „Nur Zusatzleistungen“ leer → 400, nur Keramik → 400
      mit Meldung, Ozon + Heißvernebelung → 200 mit „Nur Zusatzleistungen“ in der Mail
**Lösungswege Abwahl-Hinweis:** (a) nur das gesperrte Kästchen zeigen — bei zugeklappter Liste unsichtbar · (b) Wechsel
der Leistung verweigern, solange Unpassendes angehakt ist — bevormundet · (c) ✔ abwählen und es sagen, sichtbar und
angesagt, direkt über der Liste
**Referenzen:**
`components/formulare/TerminFelder.tsx`
`components/RequestForm.tsx`
`api/anfrage.ts`

### ✅ Phase 3 — Seiten: Kacheln, Texte, FAQ *6.7*
**Ziel:** Was das Formular sperrt, steht vorher auf der Seite — aus derselben Regel, nicht abgeschrieben.
* [x] `PriceItem.buchbar` + Zeile in `PricingGrid` (klein, `gray-700`, über dem Anfrage-Link); `zusatzKachel` setzt sie
      aus `buchbarText`: „Einzeln oder zu jedem Paket buchbar.“ (5×), „Nur einzeln oder zusammen mit Intensiv
      Innenraumreinigung, Brillant Außenpflege oder Lackaufbereitung buchbar.“ (Motor), „Nur zusammen mit Brillant
      Außenpflege oder Lackaufbereitung buchbar.“ (Keramik, Nano). Geht mit in die `OfferCatalog`-Beschreibung (sichtbar)
* [x] Widersprüche beseitigt: Brillant Außenpflege („zugleich die Voraussetzung für eine Keramikversiegelung“ → „Keramik-
      und Nanoversiegelung sind nicht enthalten. Sie buchen sie zu diesem Paket oder zur Lackaufbereitung dazu, …“; die
      Trennung aus 2.10 bleibt), Innenseite `#optional` („zusätzlich zur gebuchten Innenaufbereitung“ → „Beide gibt es
      auch einzeln.“), Übersicht „die Sie zu Ihrem Paket buchen oder direkt anfragen“ (stimmte für die Motorreinigung
      nicht) → Regelsatz + „Wozu Sie welche Leistung buchen können, steht auf der jeweiligen Kachel.“
* [x] Regelsätze abgeleitet (`regelSaetze`): Einleitungen Übersicht und Außenseite, Außen-FAQ „keramik“ („… etwa nach
      der Brillant Außenpflege“ → „Keramikversiegelung und Nanoversiegelung buchen Sie nur zusammen mit Brillant
      Außenpflege oder Lackaufbereitung.“)
* [x] Neue FAQ `zusatz` „Kann ich Zusatzleistungen auch einzeln buchen?“ auf `/fahrzeugaufbereitung-leipzig` (nach
      „paketwahl“), Antwort aus `zusatzFaqAntwort()`, damit auch im `FAQPage`-Markup
* [x] Von Hand formulierte Stellen im Kopf von `data/zusatzleistungen.ts` aufgelistet; `tsc` grün, alle Dateien < 700
**Lösungswege Kachelhinweis:** (a) Bedingung in jeden Kacheltext schreiben — acht Abschriften der Regel · (b) nur im
Formular zeigen — der Kunde erfährt es erst beim Anfragen · (c) ✔ abgeleitete Zeile je Kachel, dieselbe Regel wie im
Formular
**Referenzen:**
`data/detailing.ts`
`data/faqs.ts`
`components/PageBlocks.tsx`

### ✅ Phase 4 — Mitarbeiterstimmen mit Fotoplatz *5.28*
**Ziel:** Fünf echte Stimmen statt drei Platzhaltern, je Stimme ein Porträtplatz, der ohne Foto fertig aussieht und
mit Foto nur ein Feld braucht.
* [x] `data/stimmen.ts`: fünf Stimmen in Andrés Reihenfolge, Wortlaut unverändert (Rechtschreibung siehe Auslegung),
      Felder `bereich` (Symbol), `foto` (`null` bis zur Lieferung: Pfad, Kantenlänge, Alternativtext ohne Namen),
      `anzeigeBeruf` mit weicher Trennstelle für die drei langen Berufe; Kopf mit dem Ablauf „So kommt ein Foto hinein“
      (Einwilligung → `npm run fotos` → Herkunft → `foto`), Widerruf = `foto: null`. Ungenutztes `echteStimmen` entfernt
* [x] `components/Stimmen.tsx`: Zitat `text-lg`/`md:text-xl` halbfett statt `text-sm` grau, Anführungszeichen als
      Schmuck oben rechts (`pr-10` hält den Text frei), Porträt rund 64 px (ab `lg` 72 px) neben der Berufsbezeichnung;
      ohne Foto das Symbol des Gewerks (Sprühdose, Headset, Funkeln, Schraubenschlüssel) auf hellem Kreis, `aria-hidden`.
      Raster: Flex mit zentrierter letzter Reihe (3 + 2 ab `lg`, 2 + 2 + 1 ab `sm`, mobil untereinander), Einblenden wie
      `PricingGrid`, `role="list"`. Berufsbezeichnung mit `text-balance` (sonst „…FAHRZEUGBAU- / MECHANIKER“ bei 1440 px)
* [x] Herkunftssperre im Prerender: Foto außerhalb `/assets/team/`, ohne Eintrag in `data/bildherkunft.ts` oder mit
      „generiert“ → Fehler mit Anleitung; „aufgewertet“ → Unterschrift „Foto KI-bearbeitet“; „echt“ → nichts
* [x] `scripts/check-dummies.mjs`: fünf Anerkennungen zu 3.19 entfernt (sonst „verrottet“), `ANERKANNT` ist damit leer;
      Quelle `data/stimmen.ts` auf Backlog 5.28. Build: „data/stimmen.ts: 5 Einträge, davon 0 als Platzhalter markiert“
* [x] Nebenbefund behoben: Bei 320 px brachen „Fahrzeuglackiererin/-lackierer“ ohne Trennstrich mitten im Wort
      („…LACKIERE / RIN“, Spalte ≈ 144 px, Wort ≈ 158 px) → weiche Trennstelle an der Wortfuge
**Lösungswege Fotoplatz:** (a) großes Porträt über dem Zitat — bei fehlenden oder abgelehnten Fotos (freiwillig!) wirken
die Karten leer und ungleich · (b) gestrichelter „Foto folgt“-Platz — sähe live unfertig aus · (c) ✔ kleines rundes
Porträt neben dem Beruf, wie im Meeting vereinbart; ohne Foto ein fertiges Symbol des Gewerks
**Referenzen:**
`components/Stimmen.tsx`
`data/stimmen.ts`
`scripts/check-dummies.mjs`

### ✅ Phase 5 — Bildinventar: feste Nummern für die Porträtplätze
**Ziel:** Jeder Porträtplatz bekommt eine B-Nummer, und sie bleibt, wenn das Foto kommt — damit der User Andrés Fotos
per Nummer zuordnen kann.
* [x] `scripts/lib/bilder-rundgang.mjs`: Ort aus `data-bild-ort`, wo gesetzt (Porträts haben keine Überschrift);
      `scripts/bilder-inventar.mjs`: Regel `VORGAENGER` — Platzhalter → Foto am selben Ort behält die Nummer (bisher nur
      Foto/Platzhalter → Videostandbild). Gefunden beim Lesen der Nummernvergabe: Rahmen und Datei passten nie, jedes
      gelieferte Foto hätte eine neue Nummer bekommen, die des Platzhalters wäre „entfallen“
* [x] Porträtplätze: `data-bild-platzhalter="Porträt <Beruf>"` ohne Foto, `data-bild-ort` mit demselben Namen am Foto;
      gleiche Berufe würden gezählt („… 2“)
* [x] Galerie „Einblicke“ (3.23, B48 ff.): `data-bild-ort={item.label}` an der Kachel — ihre Nummern überstehen die
      Fotolieferung jetzt ebenso
* [x] `docs/bilder/motive.json`: Hinweis zum Platzhalterblock „stimmen“; `scripts/build-fotos.mjs`: Hinweise für die
      Porträts (quadratischer `ausschnitt` mit allen vier Werten, `breite: 480`, eigener `--ordner`)
**Referenzen:**
`scripts/bilder-inventar.mjs`
`scripts/lib/bilder-rundgang.mjs`
`components/DetailingGallery.tsx`

### ✅ Phase 6 — Messen und belegen
**Ziel:** Alle Werkzeuge gegen EINEN neuen Build, Funktionstest der Regeln im Browser, Gegenproben der neuen Wächter,
Bildschirmfotos.
* [x] Funktionstest im Browser (Puppeteer, `dist/`, 85 Prüfungen): Stimmen an 1440/1024/768/390/320 px (Wortlaut,
      Reihenfolge, Porträtplätze, kein Platzhaltertext, kein Überlauf, 3 + 2 mittig, 2 + 2 + 1, untereinander),
      Kachelzeilen auf drei Seiten, FAQ, Formular: Optionen, Keramik-Kachel → Hinweis, Innenraum → gesperrt + Abwahl-
      Hinweis, Brillant → frei, **Matrix 8 Leistungen × 8 Zusatzleistungen gegen Andrés Tabelle**, „Nur Zusatzleistungen“
      (klappt auf, ungültig ohne Kästchen, gültig mit Ozon), Motorreinigung → „exklusiv“ → Abwahl, Desktop und mobil
* [x] Kontrast der Zustände, die der Messer nicht erreicht (Dialog nach Eingaben), 24 Stellen: alle ≥ AA, niedrigster
      5,50:1 (Überschrift „Zusatzleistungen (mindestens eine)“, `gray-600`)
* [x] Gegenprobe Ladeprüfung `data/zusatzregeln.ts` an Kopien: Tippfehler in `zu`, „Sonstiges“ als Paket, unbekannter
      `nichtMit`-Partner, Name ohne „-ung“ → alle vier brechen ab; unveränderte Kopie lädt
* [x] Gegenprobe Herkunftssperre (Prerender-Rendering per `renderToString`): ohne Eintrag → Abbruch, außerhalb
      `/assets/team/` → Abbruch, „generiert“ → Abbruch, „aufgewertet“ → Foto + „Foto KI-bearbeitet“, „echt“ → Foto ohne
      Vermerk. Dateien danach mit `cp -p` wiederhergestellt (byte-gleich)
* [x] **Gegenprobe Nummernversprechen (O1), ganz durchgespielt:** Testfoto für die Fahrzeuglackiererin, Herkunft „echt“,
      `vite build`, `npm run bilder` → „umbenannt (Nummer behalten): B142“, B143–B146 unverändert, nächste Nummer weiter
      147, nichts entfallen außer dem alten B30. Danach Daten, Testfoto, `docs/bilder` und `output/bilder` zurückgesetzt
* [x] Ganze Messkette zweimal, je gegen EINEN Build; danach ein Rückbau (siehe Tabelle). Der ausgelieferte Stand
      02:19:14 hat für alles Ausgelieferte dieselben Quellen wie der voll gemessene Build 01:07:57 (der Rückbau stellt die
      Zeile in `data/stimmen.ts` wörtlich wieder her; geändert wurden danach nur `api/`, `scripts/` und `docs/`)

| Werkzeug | Build 01:07:57 | Build 01:38:28 (geschütztes Leerzeichen) | **Build 02:19:14 (ausgeliefert)** |
|---|---|---|---|
| Build-Wächter (Prerender 29/29, FAQ 29/29, Dummies, Gedankenstriche 0) | ✓ | ✓ | **✓** |
| `npm run meta` | 0 außerhalb | 0 | — (Quellen wie 01:07:57) |
| `npm run kontrast` | 5580 Stellen, 0 unter AA | 5582, 0 unter AA | — (Quellen wie 01:07:57) |
| `npm run aussparung` · `-- --gegenprobe` | ✓ · 5/5 | ✓ · 5/5 | — (Quellen wie 01:07:57) |
| `npm run zielgruppen` | ✓ | ✓ | — (Quellen wie 01:07:57) |
| `npm run bilder` | 129 Stellen + 16 Platzhalter, bis B146 | gleich; auch direkt nach dem Mailtest ohne Abbruch (O8) | — (Quellen wie 01:07:57) |
| Funktionstest (85) | 85/85 | 80/85 → Fehler im Test (geschütztes Leerzeichen), korrigiert: 85/85 | **85/85** |
| Kontrast Formularzustände und Stimmen (24) | 24/24 | 24/24 | **24/24** |
| `npm run test:email` | PASS | PASS (mit Vorgangsnummer in deutscher Zeit, O5) | — (nur `api/`) |
| `npm run shots` | — | abgebrochen (Rückfrage des Users zur Dauer); gezielte Fotos aller geänderten Stellen an 5 Breiten liegen vor | — |

**Warum der Rückbau:** Das geschützte Leerzeichen nach „Karosserie-“ sollte „KAROSSERIE- UND / FAHRZEUGBAUMECHANIKER“
erzwingen. Der Bindestrich selbst ist aber eine Umbruchstelle, die Zeile brach weiter dort, und das Leerzeichen stand
sichtbar als Einzug vor „UND“ (Bildschirmfoto 1440 px). „KAROSSERIE- / UND FAHRZEUGBAUMECHANIKER“ ist ein gewöhnlicher
Umbruch nach dem Ergänzungsstrich, also zurück zum gemessenen Stand.
**Referenzen:**
`scripts/bilder-inventar.mjs`
`data/zusatzregeln.ts`
`components/Stimmen.tsx`

### ✅ Phase 7 — Backlog und Doku
* [x] `schleife-6.md`: 6.7 ✅ (02.10.) mit Umsetzung und den zwei Rückfragen an André, 6.6 „in 6.7 aufgegangen“, Stand
      „9 offen“; `schleife-5.md`: 5.28 🟨 teilweise (Stimmen da, Fotos folgen), Stand-Zeile, Bringschuld, Übersicht
      (dabei 5.20 nachgezogen, O7); `README.md`: gezählt am 02.10. — Schleife 6: 9, zusammen 56; „Zuletzt erledigt“;
      `offene-punkte-konsolidiert.md` (1.26)
* [x] Optimierungsdatei mit O1–O9 (`2026-10-02-stimmen-und-zusatzregeln-optimierung-tasks.md`)
* [x] Projektgedächtnis: `zusatzleistungen-single-source` neu gefasst, neu `mitarbeiterstimmen-fotos` und
      `bash-heredoc-backslash`, `schleife-6-meeting-2026-09-28` nachgetragen, Index aktualisiert
* [x] Nicht committet, nicht gepusht (kein Auftrag); vor einem Push gilt der Ablauf `npm run push-stand` aus CLAUDE.md
**Referenzen:**
`docs/backlog/schleife-6.md`
`docs/backlog/schleife-5.md`
`docs/backlog/README.md`

---

## Kommentare

### Phasen 1–3 (Buchungsregeln 6.7)
**Eingehalten**: Andrés Tabelle wörtlich, Auslegung vor dem Code festgehalten ✅, eine Quelle für Formular, Server,
Kacheln, FAQ und Schema ✅, Regeln als Daten, Sätze abgeleitet statt abgeschrieben ✅, Ladeprüfung gegen Tippfehler
(mit der Pflichtfrage „was besteht sie, ohne dass es stimmt“ im Kopf) ✅, Matrix im Browser gegen die Tabelle ✅,
Textregeln (wir/Sie, keine Gedankenstriche, „CarCare Center“) ✅, alle Dateien < 700 Zeilen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — stille Abwahl** beim Leistungswechsel (seit 5.20, durch 6.7 häufiger) → Hinweis mit Grund (O2).
2. 🟡 **Mittel — Server prüfte `zusatzleistungen` nur als Liste**, eine Zeichenkette ging ungeprüft in die Mail (O3).
3. 🟡 **Mittel — vier Seitentexte widersprachen den neuen Regeln** (Motorreinigung, Brillant, Innenseite, Übersicht) (O4).
4. 🟢 **Niedrig — Vorgangsnummer mit UTC-Datum** (nachts der Vortag) (O5).
5. 🟢 **Niedrig — 6.6 widerspricht 6.7** (Keramik/Nano allein als Leistung): bewusst aufgelöst, im Backlog vermerkt.

### Phasen 4–5 (Mitarbeiterstimmen 5.28, Bildinventar)
**Eingehalten**: Wortlaut der Stimmen unverändert, keine Namen (Datenstruktur ohne Namensfeld) ✅, Foto freiwillig und
ohne „Foto folgt“-Lücke ✅, Herkunft nie geraten (Build bricht statt „KI-generiert“ an einem echten Porträt) ✅,
Mobile-First an fünf Breiten gemessen ✅, Bildnummern als Absprache geschützt ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — ein geliefertes Foto hätte die Nummer seines Platzhalters verloren** (Bildinventar) → `data-bild-ort` und
   Regel `VORGAENGER` (O1). Ohne die Korrektur hätte „B14x“ nach dem Einbau etwas anderes bedeutet.
2. 🟢 **Niedrig — Berufe brachen bei 320 px mitten im Wort**, bei 1440 px an der Trennstelle statt am Leerzeichen (O6).
3. 🟢 **Niedrig — Escape-Falle**: Edit-Werkzeug und Bash-Heredoc schrieben `\u00AD` als unsichtbares Zeichen in den
   Quelltext; korrigiert, im Projektgedächtnis vermerkt.

### Phasen 6–7 (Messen, Doku)
**Eingehalten**: jede Messung mit ihrem Build belegt ✅, nach jeder Korrektur die ganze Kette ✅, Gegenproben für alle
neuen Wächter (Ladeprüfung, Herkunftssperre, Nummernversprechen) ✅, Rückbau statt Schönreden eines Sichtfehlers ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — eigener Fehlgriff**: Das geschützte Leerzeichen nach „Karosserie-“ erzeugte einen sichtbaren Einzug →
   zurückgebaut, nur im Bildschirmfoto aufgefallen (kein Werkzeug misst Einzüge).
2. 🟢 **Niedrig — Testfehler**: Der Funktionstest verglich den Beruf mit normalem Leerzeichen → normalisiert.
3. 🟢 **Niedrig — Git Bash schreibt `/assets/…`-Argumente um** (bekannt, `MSYS_NO_PATHCONV=1`); erster Gegenprobenlauf
   dadurch ungültig, wiederholt.
4. 🟢 **Niedrig — O8** (Bildinventar brach nach dem Mailtest ab) → behoben, im Lauf nach dem Mailtest bestätigt.

**Refactoring-Plan (Rest, nach Gewichtung):** O9 (Rückfragen an André) — Details in
`docs/backlog/tasks/2026-10-02-stimmen-und-zusatzregeln-optimierung-tasks.md`
