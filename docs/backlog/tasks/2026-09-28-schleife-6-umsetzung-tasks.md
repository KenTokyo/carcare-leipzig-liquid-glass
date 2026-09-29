# Schleife 6 umsetzen — alle Punkte außer 6.7, 6.9, 6.10 (und den zurückgestellten)

**Auftrag (User, 2026-09-28):** „Bitte setze aus der Schleife 6 alle Punkte um bis auf 6.10, 6.9, 6.7. Bei 6.4 damit ist
gemeint, dass die Texte in kurzer Form aus der Subseite der Privatkunden auf die Textkacheln auf der Hauptseite unter
Privatkunden aufgeschrieben werden sollen. 6.2 Bilder liegen im Anhang – nur mach hier ein sauberes Vorher/Nachher-Bild,
was genau den Unterschied einer solchen Dienstleistung zeigt. 6.14 ignorieren/streichen. 6.16 wird noch geliefert. 6.19
muss erstmal nicht gemacht werden. 6.20 und 6.21 auch nicht."
**Backlog:** `docs/backlog/schleife-6.md` · **Import:** `docs/backlog/tasks/2026-09-28-schleife-6-import-tasks.md`
**Branch:** `2026-09-28-schleife-6-umsetzung` (trägt die noch nicht committeten Import-Dateien mit; beim Committen zuerst
den Import als eigenen Commit, dann die Umsetzung)

## Umfang

| Umsetzen | Nicht umsetzen (Grund) |
|---|---|
| 6.1, 6.2, 6.3, 6.4, 6.6, 6.8, 6.11, 6.12, 6.13, 6.15, 6.17, 6.18, 6.22, 6.23, 6.24, 6.25, 6.26 | 6.7, 6.9, 6.10 (User) · 6.14 gestrichen (User) · 6.16 Foto kommt von André · 6.19, 6.20, 6.21 zurückgestellt (User) |
| 6.5 nur vorbereiten | Link auf Otto Grimm erst mit Andrés Freigabe (Regel in `data/partners.ts`); beide Namen stehen schon in der Liste |

---

### ✅ Phase 1 — Aufbereitung: Texte, Preise, Formular *6.6, 6.17, 6.18, 6.24*
**Ziel:** Andrés Mail-Texte und die Meeting-Punkte zur Aufbereitung in die EINE Quelle (`data/zusatzleistungen.ts`,
`data/detailing.ts`, `data/leistungsauswahl.ts`) — Kacheln, Formular, Schema und Mail ziehen nach.
* [x] 6.17: Keramik „ab 849,00 €", Nano „ab 299,00 €" — eine Zeile je Preis; Kachel, Kästchen, Fließtexte
      (`zusatzPreis`), Mail („Keramikversiegelung (ab 849,00 €)") und Schema (`from` → `minPrice`) lesen daraus.
      Außenseite: Überschrift „… zum Festpreis" stimmte damit nicht mehr → „Was kosten Versiegelungen und Zusatzleistungen?"
* [x] 6.18: Keramik-Kacheltext und Außen-FAQ „keramik": „Wir empfehlen, die … jährlich auffrischen zu lassen." —
      ohne Haltbarkeitsangabe, wie vereinbart
* [x] 6.24: Preis-Einleitung der Übersicht (Premiumpflege-Satz „Wünschen Sie beides für sich und Ihr Fahrzeug …",
      Lackaufbereitung „mit speziellen und abrasiven Polituren in die Tiefe des Lackes, wir berechnen sie nach Aufwand"),
      Paket Lackaufbereitung (Lacktiefenpolitur, Oberflächenkratzer, Antihologramm, „erweiterbar mit Wachs-, Nano- oder
      Keramikversiegelung"), Intensiv Innenraumreinigung (+ Ablagen und Fächer, Dachhimmel), Brillant Außenpflege
      (+ Entfernung von Ablagerungen). Nachgezogen: Schrittlisten Innen (neu „Dachhimmel") und Außen (Lackaufbereitung
      jetzt in Andres vier Begriffen), FAQ „paketwahl", „preise", Außen „umfang"/„unterschied", Innen „umfang".
      Premiumpflege „exklusiv" unverändert: Andres Satz dazu endet mit „…" (Paketbeschreibungen liefert er nach)
* [x] 6.6: `auchAlsLeistung` an Keramik, Nano, Frontscheibe; `data/leistungsauswahl.ts` liest Name und ID daraus
      (zehn Optionen, Versiegelungen nach der Lackaufbereitung). `sperrgrund` sperrt das gleichnamige Kästchen
      („Bereits als gewünschte Leistung gewählt"), Keramik ⟂ Nano gilt für Leistung wie Zusatz. Vorauswahl der Kachel:
      Leistung hat Vorrang (`startwerte`). Kollisionsprüfung lässt NUR markierte IDs doppelt zu. Server prüft über
      `LEISTUNGS_IDS` automatisch mit.
* [x] Nachgerechnet am kompilierten Stand (`build-email` + Node): Leistung keramik → Kästchen keramik gesperrt,
      nano „Entweder Keramik- oder Nanoversiegelung", felgen frei; `bereinigteZusaetze('nano', [keramik, felgen])` → [felgen];
      `tsc --noEmit` grün
* [x] 6.1 wandert mit den Bildern in Phase 2 (dieselbe Stelle im Code)
**Lösungswege 6.6:** (a) eigene IDs wie `keramik-leistung` — zwei Schlüssel für eine Sache, die Kachel wüsste nicht,
welchen sie schicken soll · (b) ✔ dieselbe ID, als `auchAlsLeistung` markiert: Die Kachel wählt die Leistung vor, das
gleichnamige Kästchen ist gesperrt, die Ausgrau-Regel Keramik ⟂ Nano greift für Leistung und Zusatz gleich; die
Kollisionsprüfung bleibt für alle anderen IDs scharf
**Referenzen:**
`data/zusatzleistungen.ts`
`data/detailing.ts`
`data/leistungsauswahl.ts`

### ✅ Phase 2 — Alcantara: Vorher/Nachher und Schaumverfahren *6.1, 6.2*
**Ziel:** Ein sauberes Vorher/Nachher-Bild aus den Originalen der Lieferung (nicht aus den verkleinerten Chat-Anhängen),
dazu das Schaumfoto; Exklusivleistungen auf der Innenseite als Bildkarten statt Namensliste.
* [x] Quellen zugeordnet (Kontaktbogen der fünf Alcantara-Dateien im Lieferordner): Anhang 2 = „Alcantara Lenkrad
      Vorher.jpeg" (4032×3024), Anhang 3 = „Alacantara Lenkrad nachher.jpeg" (5712×4284), Anhang 1 = „Alcantara
      Aufbereitung Waschen.jpeg" (5712×4284). EXIF: alle drei iPhone 16, 20.08.2026 — Vorher 14:55, Schaum 16:46,
      Nachher 17:06: eine echte Abfolge an einem Tag
* [x] Drei Rahmungen verglichen (ganzes Bild / Speichenübergang / eng am Flor) → mittlere: Kranz, Carbonblende und
      Schalter in beiden Hälften an derselben Stelle, Kranz gleich dick (Nachher enger, weil weiter weg fotografiert)
* [x] `scripts/build-fotos.mjs`: neue Liste `VERGLEICHE` (zwei 4:5-Ausschnitte, 8-px-Fuge, 2000×1245, 276 KB,
      IPTC `compositeCapture`, Prüfbogen mit beiden Quellrahmen); Einzelfotos können jetzt `format` und `breite`
      tragen — Schaumfoto 1:1, 1200 px, 187 KB, ohne den tätowierten Unterarm. Aufruf `npm run fotos -- --nur alcantara`
* [x] Innenseite, Sektion `#exklusivleistungen`: zwei Bildkarten 3/5 zu 2/5 (gleich hohe Bilder bei 16:10 und 1:1);
      „Alcantara-Lenkrad aufarbeiten" (6.1, ohne „ausbauen") mit Vorher/Nachher und HTML-Beschriftung, „Schaum-/Tornador-
      Verfahren" mit Schaumfoto. Unterschriften beschreiben nur das Foto — Leistungstexte bleiben bei André (1.18)
* [x] Herkunft: `data/bildherkunft.ts` „echt" (Beleg EXIF + Auswahl durch den User; Bestätigung erbeten),
      `docs/bilder/motive.json` mit Motiv, Herkunft und offenem Punkt. Bildnummern vergibt `npm run bilder` in Phase 8
**Lösungswege:** (a) Schieberegler — braucht deckungsgleiche Aufnahmen, diese sind aus verschiedenen Winkeln ·
(b) zwei getrennte Bilder im HTML — kein „ein Bild", mobil ungleich hoch · (c) ✔ EIN Bild mit zwei gleich großen,
gleich gerahmten Ausschnitten und Trennfuge; Beschriftung „Vorher/Nachher" als HTML darüber (scharf, vorlesbar)
**Referenzen:**
`scripts/build-fotos.mjs`
`pages/InnenaufbereitungPage.tsx`

### ✅ Phase 3 — Startseite: Slogan, Care/Repair, Überspringen, Privatkunden *6.3, 6.4, 6.8*
**Ziel:** „We Care and Repair" im Titelbild, Care/Repair-Plaketten seitenweit, „Ablauf überspringen" dezent rechts,
Privatkunden-Karte mit Kurzfassungen der Unterseite.
* [x] Farben gemessen am Titelbild: Median der beleuchteten Lackpixel je Wagen (Farbton gefiltert, Glanz und Schatten
      raus) — Blau `#315C86`, Rot `#C91825`; weiße Schrift darauf 6,99:1 / 5,77:1. Tokens `--cc-care-rgb`,
      `--cc-repair-rgb` (index.css), Tailwind `care` / `repair`
* [x] 6.8 Slogan: `<p lang="en">` „We Care and Repair", „Care"/„Repair" als Plaketten (`box-decoration-break: clone`),
      2,6 rem mobil bis 8xl ab 1280. H1 unverändert als Untertitel (SEO-GEO §3.2), jetzt `text-xl`–`3xl` mit
      `hyphens: manual` — „Karosserie" wird nirgends mehr getrennt (5.5), auch auf 360 px nicht. Gedankenstrich der
      Unterzeile gleich mit ersetzt (6.26)
* [x] 6.8 Plaketten: `components/BereichsPlakette.tsx`; Zuordnung aus der Katalog-Gruppe (`bereichVon`,
      `bereichDerGruppe` in `data/services.ts`: Aufbereitung → Care, Unfall/Lack und Rad/Glas → Repair, Gewerbe → keine).
      Eingebaut: Seitenköpfe (`PageHero`, automatisch über `ServiceLayout`, fünf Seiten ausdrücklich), Leistungskacheln der
      Startseite, Expertise-Karten, beide gepinnten Abläufe, Kopfzeile „Autoaufbereitung als Expertise", alle
      `LeistungsKarten` (u. a. `/leistungen`, Privatkunden, Über uns) — oben links im Bild, KI-Plakette bleibt unten rechts
* [x] 6.3: Pille neben den Punkten → dezenter Textlink (kleine Versalien, `gray-700`, 48 px Trefferfläche), unter `lg`
      rechts in der Punktezeile, ab `lg` unten rechts am Inhaltsbereich
* [x] 6.4: `data/privatkunden.ts` mit Lang- (Unterseite) und Kurzfassung (Startseite) der acht Vorteile; vier davon als
      Textkacheln „Ihre Vorteile" auf der Privatkunden-Karte (`components/ZielgruppenKacheln.tsx`, gleiche Mechanik
      und `data-partner`-Merkmale wie die Partnerliste — `npm run zielgruppen` misst sie mit). Einleitungssatz = Kurzfassung
      der Unterseiten-Einleitung. Langfassungen dabei ohne Gedankenstriche
* [x] Bildschirmfotos (1440, 1366×657, 1024, 768, 390, 360): zwei Funde gleich behoben — „Repair" stieß bei 768 px an die
      KI-Plakette (Slogan dort `md:text-5xl`), „169,00 / €" brach auf 1366 px um (geschützte Leerzeichen); dazu der
      Zähler „01 / 05" neben „Überspringen" (`whitespace-nowrap`)
**Lösungswege 6.8 (Farbe):** (a) Wörter in Porsche-Farbe — gemessen zu dunkel auf dem abgedunkelten Foto (Rot auf
L≈0,07 unter 2:1) · (b) aufgehellte Töne — erfüllen den Kontrast, sind aber nicht mehr die Farben der Autos ·
(c) ✔ weiße Schrift auf Plaketten in den echten Farben: Kontrast über 5,9:1, und es ist dieselbe Form wie die kleinen
Plaketten auf den Seiten — der Slogan führt sie ein
**Lösungswege 6.3:** (a) Pille nur verschieben — bleibt ein Knopf · (b) ✔ dezenter Textlink rechts, 48 px Trefferfläche ·
(c) fixierte Schaltfläche am Fensterrand — kollidiert mit mobiler Leiste und Stellenfenster
**Referenzen:**
`components/HeroSection.tsx`
`components/BereichsPlakette.tsx`
`components/TargetGroupCards.tsx`

### ✅ Phase 4 — Neu- und Reparaturlackierung *6.11, 6.12, 6.25*
**Ziel:** Leistungsumfang als zusammenhängender Text mit „Preis nach Aufwand", Seitenhintergrund als Lackiervideo.
* [x] Transkript nachgelesen (30:58): „Das Subbild muss bitte angepasst werden in das Video, was wir in der Hauptpage
      genutzt haben. Und das Hintergrundbild" — gemeint ist das stehende Foto der Unterseite
* [x] 6.11: sechs Karten → drei Absätze in einer Karte, Inhalt unverändert verbunden, neu nur „Motorradteile";
      `ServiceLayout` kennt dafür `leistung.fliesstext` (Karten ODER Text, fehlt beides, bricht der Prerender laut)
* [x] 6.25: „Preis nach Aufwand" als Pille unter dem Text (dieselbe Form wie auf den Aufbereitungskarten), Hinweis auf
      Kostenvoranschlag und Versicherung; neue FAQ „Was kostet eine Lackierung?" (FAQ-Schema zieht automatisch mit)
* [x] 6.12: Kontaktbogen der Aufnahme (12 Zeitpunkte), zwei Querschnitt-Höhen mit nachgestelltem Textschutz verglichen
      → `crop=1080:675:0:900`, 2,0–15,0 s wie die Startseitenkarte, Standbild bei 6,5 s (Pistole rechts);
      neuer Schnitt `lackierung-hintergrund` in `scripts/build-video.mjs` (1,27 MiB), Videoplatz in `data/videos.ts`,
      `ServiceLayout.hintergrundVideo`; Herkunft „echt" und Motive eingetragen. Das bisherige Hintergrundfoto bleibt
      als Rückfall im Katalog
* [x] Nebenbei: Gedankenstriche der Seite (Meta, USP, CTA) gleich mit ersetzt (6.26)
**Lösungswege 6.12:** (a) das quadratische 720-px-Video der Startseitenkarte — auf 1440 px doppelt hochgerechnet ·
(b) ✔ Querformat-Schnitt aus der Originalaufnahme, volle Quellbreite 1080 px · (c) Standbild statt Video — nicht gewünscht
**Referenzen:**
`pages/AutolackierungPage.tsx`
`components/ServiceLayout.tsx`
`scripts/build-video.mjs`

### ✅ Phase 5 — Karriere *6.13, 6.15*
* [x] 6.13: `ANFRAGE_EMPFAENGER_BEWERBUNG` in `api/anfrage.ts` — optional, ohne Eintrag wie bisher an den allgemeinen
      Empfänger, ein ungültiger Eintrag schaltet den Versand ab (wie bei den anderen Variablen). Sichtbare Postfächer
      jetzt EINE Liste `KONTAKT_POSTFACH` (data/anfrageSchema.ts) für Formular-Rückfall und Fehlermeldung — Bewerbungen
      nennen bewerbung@carcare-center.de. `.env.example` ergänzt. Adresse im Netz der BS CarCare GmbH zugeordnet
      (Stellenportal), auf der alten Seite spamgeschützt — ob das Postfach eingerichtet ist, klärt der Livegang (KUPA IT)
* [x] Altfehler behoben: `npm run test:email` schlug seit der Pflicht-Leistung (28.09.) fehl — Terminanfrage ohne
      `service`. Test schickt jetzt `keramik` (prüft 6.6 mit) und deckt 6.13 ab: eigenes Postfach, Rückfall, ungültige
      Adresse → 503, Fehlermeldung nennt bewerbung@; dazu „Verkauf" als Leistung → 400. Ergebnis: PASS
* [x] 6.15: Stellenfenster mit Kopf im CTA-Verlauf (Symbol, Zähler, „Wir suchen Verstärkung."), Stellen einzeln und fett,
      Ausbildung als eigene Gruppe; Beginn nur dann einmal in der Zwischenzeile, wenn ALLE Plätze ihn teilen
      (Industriekaufmann/-frau hat keinen — sonst hätte das Fenster ihn behauptet). 380 statt 340 px, erscheint nach
      1,2 statt 2,6 s, fährt federnd von rechts ein, Ring um das Symbol pulsiert dreimal und steht dann
**Lösungswege 6.13:** (a) Pflichtvariable wie bei Geschäftskunden — alle Formulare wären bis zur Einrichtung aus ·
(b) ✔ eigene Variable, ohne sie wie heute an den allgemeinen Empfänger; Eintrag in der Livegang-Liste ·
(c) Adresse fest im Code — Testbewerbungen der Vorschau landeten im echten Postfach
**Referenzen:**
`api/anfrage.ts`
`components/JobPopup.tsx`

### ✅ Phase 6 — Kontakt und Vertrauen *6.22, 6.23*
* [x] 6.23: `data/anfahrt.ts` (Adresse, Google-Maps- und Apple-Karten-Route) — dieselbe Quelle für die mobile Leiste und
      die neuen Links: Kontaktkarte „Adresse" (Startseite und `/kontakt`) mit „Route mit Google Maps" und „Apple Karten",
      Fußzeile mit „Route mit Google Maps". Gewöhnliche Links mit `noopener noreferrer`: bis zum Klick keine Verbindung
      zu Google, deshalb auch kein Datenschutzabsatz nötig
* [x] 6.22: Gesamtwertung im Profil abgelesen (Browser, „Alle ablehnen"): 4,7 von 5, 236 Rezensionen, Stand 28.09.;
      Profil-Link als dauerhafte CID-Adresse (`maps.google.com/?cid=…`, geprüft). `data/bewertungen.ts` +
      `components/GoogleBewertungen.tsx` auf „Über uns" nach „Für wen wir arbeiten": Zahl, Sterne (letzter anteilig),
      „Alle Bewertungen auf Google lesen", Hinweis nach § 5b Abs. 3 UWG. Kein `AggregateRating`-Schema (self-serving)
* [ ] 6.22 Rest: Die AUSWAHL einzelner Bewertungen liefert der User/André — bewusst nicht von uns abgeschrieben (die
      Texte gehören den Verfassern). Sobald sie da sind: Einträge in `bewertungen`, die Karten erscheinen automatisch
**Lösungswege 6.23:** (a) eingebettete Karte mit Zwei-Klick-Freigabe — mehr Datenschutzaufwand, nicht verlangt ·
(b) ✔ Link an der Adresse: vor dem Klick keine Verbindung zu Google
**Referenzen:**
`components/KontaktDaten.tsx`
`components/GoogleBewertungen.tsx`

### ✅ Phase 7 — Gedankenstriche *6.26*
* [x] Messskript `scripts/check-gedankenstriche.mjs` über den AUSGELIEFERTEN Text (dist, ohne script/style/JSON-LD) plus
      Titel und Beschreibungen: Halbgeviert-/Geviertstrich mit Leerzeichen, Geviertstrich zwischen Wörtern, Bindestrich
      mit Leerzeichen. Erlaubt: Bis-Striche zwischen Zahlen und Wochentagen, „0341 - 261 77 90". Erster Lauf nach den
      Umstellungen der Phasen 1–6: 221 Funde auf 23 Seiten
* [x] Quelltext-Zählung (ohne Kommentare): 249 Stellen in 44 Dateien → auf drei Helfer mit getrennten Dateilisten verteilt
      (Datenquellen 70, große Seiten 82, übrige Seiten/Komponenten/Schema 89), Regeln: Satz umbauen statt ersetzen, Punkt
      oder Komma, Doppelpunkt nur bei echter Aufzählung, Meta-Längen halten, Textregeln (wir/Sie). Jede Änderung mit
      alt → neu zurückgemeldet und von mir durchgesehen; elf Sätze nachgeglättet (Satzfragmente, wortgleiche Stellen
      angeglichen, z. B. „Von … bis … in fünf klaren Schritten, aus einer Hand.")
* [x] Platzhalter der Mitarbeiterstimmen („Platzhalter, wird durch …") in `data/stimmen.ts` UND in `check-dummies.mjs`
      zugleich umgestellt — einzeln hätte der anerkannte Eintrag „verrottet" und Vercel gebrochen
* [x] Wächter im `postbuild`; zweite Stufe (O3) liest den Quelltext der Komponenten, die nur im Browser rendern, auch
      Striche am Zeilenende/-anfang. Zwei Lücken im eigenen Aufbau gefunden und geschlossen: Windows-Zeilenenden (40
      Scheinfunde) und der Geviertstrich zwischen Zahlen („1 — 1998", Hinweis des dritten Helfers). Gegenprobe: eingesetzter
      Strich in `JobPopup` wird gefunden
* [x] Letzter Build: `[gedankenstriche] 29 Seiten und 9 Browser-Komponenten, 0 Funde`; `npm run meta` 0 außerhalb des
      Korridors. Textregel 6 in CLAUDE.md, `npm run gedankenstriche` in der Messwerkzeug-Tabelle
**Referenzen:**
`scripts/check-gedankenstriche.mjs`

### ✅ Phase 8 — Messen und belegen
* [x] `npm run build`: grün — FAQ 19 Routen / 240 FAQPage-Texte im HTML, Nummernräume ok, Platzhalter nur die anerkannten,
      `[gedankenstriche] 29 Seiten und 9 Browser-Komponenten, 0 Funde`; `tsc --noEmit` grün
* [x] `npm run kontrast`: **5554 Textstellen, 0 unter AA** (29 Routen, 2 Breiten, 4 Positionen)
* [x] `npm run meta`: 0 Titel und 0 Beschreibungen außerhalb des Korridors
* [x] `npm run zielgruppen`: erster Lauf **3 Befunde** an den neuen Privatkunden-Kacheln (1280 × 593: 2 von 4 lesbar,
      390 × 664 und 360 × 640: 3 von 4) → bei niedrigen Fenstern nur die Titel, zweispaltig (Schwellen je Breite, der
      Laptop 1366 × 657 behält den Kurztext) → **45/45 ✓**
* [x] `npm run aussparung`: erster Lauf 1 Befund („Fuhrparkservice" fest unter der Aussparung, 1024 × 700) — ein
      Messfehler: Titel und gleichlautende Knopfzeile derselben Karte lagen an zwei Positionen 10 px auseinander und
      galten als ein gepinntes Element. Werkzeug vergleicht jetzt je Element (Pfad ab `<main>`), neue Gegenprobe
      „gepinnter Text" (zuerst selbst blind: nur eine Messposition, dann korrigiert) → Gegenprobe **5/5**, Lauf **✓**
      (29 Routen × 3 Fenster, Geometrie an 23 Breiten)
* [x] `npm run bilder`: 129 Bildstellen, neu **B139** (Alcantara Vorher/Nachher), **B140** (Schaumverfahren), **B141**
      (Lackiervideo als Hintergrund); B69 behält seine Nummer mit dem Videostandbild; „im Code, nicht gesehen": das
      frühere Hintergrundfoto (Rückfall, O4)
* [x] `npm run test:email`: PASS (neu: Bewerbungspostfach, Rückfall, ungültige Adresse, Versiegelung als Leistung,
      Zusatzleistungen serverseitig)
* [x] Funktionstest am ausgelieferten `dist/` (Puppeteer, 29 Prüfungen): **29/29 ✓** — 6.3 (Klick springt hinter den
      Ablauf, desktop und mobil), 6.4, 6.6 (Sperren und Vorauswahl), 6.8 (Slogan, ein H1, Plaketten je Seite), 6.11/6.12/6.25,
      6.15, 6.22, 6.23. Zwei rote Prüfungen im ersten Lauf lagen am Test (innerText in der zugeklappten Liste, erstes
      Video der Seite = Logo), nicht an der Seite
* [x] Bildschirmfotos (1440, 1366 × 657, 1024, 768, 390, 360) und Übersicht `scratchpad/schleife6-uebersicht.jpg`
* [x] **Nachmessung (Auftrag des Users, 28.09. abends):** `kontrast-s6.log` war grün (5554 Textstellen, 0 unter AA), lief
      aber um 17:12 gegen den Build von 17:05, also vor der Kachel-Verdichtung O9 (Build 17:15). „Alle Werkzeuge gegen
      frisches `dist/`" stimmte damit nicht ganz (O10). Deshalb alle acht Werkzeuge nacheinander gegen jeweils **einen**
      Build, zuletzt gegen den maßgeblichen vom **28.09., 18:38:07**; alle acht Protokolle nennen ihn in der ersten Zeile
* [x] Zwei Funde auf dem Weg, beide behoben und mit der ganzen Kette nachgemessen: O10 (Protokolle ohne Build →
      `scripts/lib/dist-stand.mjs`) und O11 (Karriere: H1 = Seitentitel mit „|", Beschreibung mit nicht offener Stelle,
      Du neben Sie; danach mobil „Ausbil-dung" → `PageHero`-Option `ohneTrennung`)

| Werkzeug | Build 17:15:13 | Build 18:17:52 (O11) | **Build 18:38:07 (maßgeblich)** |
|---|---|---|---|
| `npm run kontrast` | 5549 Stellen, 0 unter AA | 5558, 0 unter AA | **5557, 0 unter AA** |
| `npm run meta` | 0 außerhalb | 0 | **0** |
| `npm run zielgruppen` | 45/45 ✓ | 45/45 ✓ | **45/45 ✓** |
| `npm run aussparung` · `-- --gegenprobe` | ✓ (29 Routen × 3 Fenster, 23 Breiten) · 5/5 | ✓ · 5/5 | **✓ · 5/5** |
| `npm run bilder` | 129 Stellen, bis B141 | gleich | **gleich** |
| Funktionstest (29 Prüfungen) | 29/29 | 29/29 | **29/29** |
| Bildschirmfotos (21 + 6 aus dem Funktionstest) | gleich wie 17:45 außer Videoflächen | Karriere geändert (O11) | **nur Karriere mobil (O11) und Videoflächen** |

Die Zahl der Textstellen ist kein Gütemaß: Sie hängt davon ab, welche Zeilen an den vier Messpositionen im Bild liegen
(die Startseite zählte in drei Wiederholungen stabil 167). Videoflächen (Logo, Lackier- und Über-uns-Video) weichen in
jedem Fotovergleich ab, weil das Einzelbild wechselt. Übersicht: `scratchpad/schleife6-phase8-uebersicht.jpg`
(12 Desktop- und 6 Mobilaufnahmen, mobil ungeschnitten).

**Referenzen:**
`scripts/lib/dist-stand.mjs`
`scripts/check-aussparung.mjs`
`pages/CareerPage.tsx`

### ✅ Phase 9 — Backlog und Doku
* [x] `schleife-6.md`: Status und Stand je Punkt, 6.14 „entfällt" (gestrichen), 6.19–6.21 zurückgestellt; Kopfzeile
      16 erledigt / 10 offen
* [x] 5.1 (Livegang): `ANFRAGE_EMPFAENGER_BEWERBUNG` in Vercel setzen; Backlog-README: offen **57** (vorher 73)
* [x] CLAUDE.md: Textregel 6 (Gedankenstriche), Messwerkzeug `npm run gedankenstriche`
* [x] Memory `schleife-6-meeting-2026-09-28` und Index fortgeschrieben
* [x] Optimierungsliste `2026-09-28-schleife-6-umsetzung-optimierung-tasks.md`

### ✅ Phase 10 — Rückmeldung des Users: Stellenfenster auf der Karriereseite *6.15*
**Ziel:** „Rechts unten das Pop-up, wo ich vorher gesehen habe, was für Stellen noch offen sind, hast du komplett
weggemacht. Die Anfrage war nur, die Schrift mehr in den Vordergrund zu stellen." (User, 28.09. abends)
* [x] Ursache gemessen statt vermutet: Erstbesuch mit Vorlader und frischer Sitzung, Dev-Server 3007 und Build,
      1920 × 945 und 390 × 844, mit und ohne reduzierte Bewegung → erscheint überall nach rund 2 s. Nach einmaligem
      Schließen und Neuladen im selben Tab blieb es weg: Seit 1.23 merkte sich das Fenster das Schließen für die ganze
      Sitzung (`sessionStorage`), auch ein Klick auf seinen Bewerben-Knopf zählte als Schließen
* [x] `components/JobPopup.tsx`: erscheint bei jedem Aufruf der Karriereseite nach 1,2 s, Schließen gilt nur für diesen
      Aufruf, kein Sitzungsspeicher mehr. Gestaltung aus 6.15 unverändert
* [x] Datenschutz-Faktenblatt (`docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`, Abschnitt 4): Eintrag
      `cc-stellen-popup-geschlossen` entfällt, es bleibt nur `cc-preloader-v1`
* [x] Prüfung 16/16: mit altem Sitzungseintrag (Lage des Users) sichtbar nach 1,2–1,4 s, nach Schließen 3 s lang zu,
      nach Neuladen wieder da, keine neuen Sitzungseinträge; Dev-Server und Build, Desktop und mobil
* [x] Build 19:51:13 grün (FAQ 29/29, Gedankenstriche 0), danach die ganze Messkette gegen diesen Build, alle acht
      Protokolle nennen ihn: Kontrast 5557 Stellen, 0 unter AA · Meta 0 · Zielgruppen 45/45 · Aussparung ✓, Gegenprobe
      5/5 · Bilder 129 Stellen bis B141 · Funktionstest 29/29 · Fotos gleich wie beim Build 18:38 außer der Videofläche
      der Lackierseite. **Maßgeblicher Stand ab jetzt: Build 19:51:13**
**Lösungswege:** (a) nur erklären (ein neuer Tab zeigt es) — das Missverständnis käme bei André und bei Kunden wieder ·
(b) nach dem Schließen zu einer beschrifteten Pille einklappen — ein neues Element, nicht beauftragt · (c) ✔ bei jedem
Aufruf zeigen, Schließen nur für den Aufruf — auf der Karriereseite sind die offenen Stellen der Grund des Besuchs
**Referenzen:**
`components/JobPopup.tsx`
`docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`

### ✅ Phase 11 — Seitendurchgang mit dem User: Startseite *6.8, 6.22*
**Ziel (User, 28.09. abends, „jetzt alle Pages Schritt für Schritt, erst die Startseite"):** Care/Repair im Titelbild ohne
farbigen Hintergrund, nur dezent als Schrift · Slogan „WeCare.WeRepair." · Google-Bewertungen von „Über uns" auch auf der
Startseite, nach „Autoaufbereitung Leipzig" und vor der FAQ · Plaketten oben links VOR der weißen Textkachel statt darin ·
Plaketten mit farbiger Kontur (Blau/Rot der Porsche), Schrift nicht farbig · „Das Ganze erst mal auf der Main-Seite"
* [x] Slogan „WeCare.WeRepair." ohne Plaketten, weiß wie der Rest; `<wbr>` nach „WeCare." (sonst ein unteilbares Wort auf
      dem Handy); Vorlesefassung „We care. We repair." — gemessen an 6 Breiten: ab 768 px eine Zeile, 390/360 px zwei,
      nirgends Überlauf
* [x] `BereichsPlakette`: Stil `kontur` (weiße Fläche, 2-px-Kontur Care-Blau/Repair-Rot, dunkle Schrift), senkrechte Fassung
      für eingeklappte Streifen; Unterseiten behalten vorerst die Fläche (geprüft: `/autolackierung-leipzig`,
      `/innenaufbereitung-leipzig`, `/leistungen`)
* [x] Leistungs- und Aufbereitungskarten (`ExpandingCardAccordion`): Plakette aus der Textkachel heraus, vor die Kachel;
      an JEDER Karte sichtbar (bisher nur an der offenen, weil sie in der ausgeblendeten Kachel steckte); eingeklappte
      Desktop-Streifen (57–95 px breit, gemessen) senkrecht, mobil waagerecht oben links. Geprüft an 1920/1440/1280/1024/
      390/360 px: jede Karte eine sichtbare Plakette, vorn (Trefferprobe), im Kartenrand, frei von Titel und KI-Plakette.
      Ausnahme Fuhrparkservice: Geschäftskunden tragen seit 6.8 bewusst keine Plakette (Care und Repair zugleich)
* [x] Kontur-Stil auch an den übrigen Plaketten der Startseite (Kopfzeile „Autoaufbereitung als Expertise", beide Abläufe)
* [x] `GoogleBewertungen` zwischen `DetailingProcessSection` („Autoaufbereitung Leipzig") und `FAQSection` (Reihenfolge im
      DOM geprüft)
* [x] Farben geprüft: häufigste Lackfarbe des blauen Wagens #2C5C84 (≈ Token #315C86), rot #C91825 trifft den Wagen;
      Konturfarben im Browser gemessen rgb(49, 92, 134) und rgb(201, 24, 37)
* [x] Nebenbei gefunden und behoben (älter, Startseite mobil): Die Kartentitel brachen auf 390/360 px mitten im Wort und ohne
      Trennstrich, zuerst die offene Karte „Fahrzeugaufbereitun / g". Ursache: Der Wortverbinder, der den blauen Punkt ans
      Wort klebte, schaltete die Silbentrennung ab. Der Punkt ist jetzt ein Schriftzeichen „•": 13 Titel × 320/360/390 px,
      0 Mal allein in der nächsten Zeile (mit geschütztem Leerzeichen wären es 5 gewesen), Trennung mit Strich im Bild
      belegt. Dazu darf der Titel 12 px in den rechten Innenrand der Kachel ragen (`-mr-3`): So steht
      „Fahrzeugaufbereitung•" am Desktop (252 px Titelbreite) und auf 390 px wieder in einer Zeile. Vorher stand dort das
      Wort ganz und der Punkt allein darunter; gemessen an 1024–1920 und 320–390 px: nur weniger Zeilen, kein Überlauf
* [x] Prüfskript Startseite 23/23, Funktionstest 30/30 (6.8 auf den neuen Slogan und den Kontur-Stil umgestellt)
* [x] Ganze Messkette gegen den Build 21:31:33, alle acht Protokolle nennen ihn: Kontrast 5553 Stellen, 0 unter AA · Meta 0
      · Zielgruppen 45/45 · Aussparung ✓, Gegenprobe 5/5 · Bilder 129 Stellen bis B141 (unverändert) · Funktionstest 30/30
      · Fotos. Danach noch `-mr-3` am Titel (siehe oben) → Build 22:05:07, Prüfskript Startseite erneut 23/23
* [x] Ganze Messkette gegen den Build 22:05:07, alle acht Protokolle nennen ihn: Kontrast 5553 Stellen, 0 unter AA · Meta 0
      · Zielgruppen 45/45 · Aussparung ✓, Gegenprobe 5/5 · Bilder 129 Stellen bis B141 · Funktionstest 30/30 · Fotos.
      **Maßgeblicher Stand ab jetzt: Build 22:05:07**
**Lösungswege Plakette „vor der Kachel":** (a) in der Kachel lassen, nur an eingeklappten Streifen zusätzlich zeigen —
die offene Karte sähe aus wie vorher · (b) Kachel tiefer beginnen lassen, Plakette aufs Foto — kostet Texthöhe in allen
Karten · (c) ✔ Plakette als eigene Ebene vor der Kachel: offen als Reiter auf der Oberkante der Kachel, eingeklappt oben
links auf dem Streifen
**Referenzen:**
`components/ExpandingCardAccordion.tsx`
`components/BereichsPlakette.tsx`
`components/HeroSection.tsx`

### ✅ Phase 12 — Rückmeldung des Users zur Startseite (29.09.) *6.8*
**Ziel (User):** „zwischen dem We und dem Care bzw. dem Repair einen normalen Space" · „in einer eingeklappten Karte sollte
das Care- und Repair-Label nicht gesehen werden" · „der Hintergrund der Labels soll auch in Liquid Glass sein und nicht
wie jetzt weiß"
* [x] Slogan „We Care. We Repair.": normale Leerzeichen; auch nach dem Punkt, sonst klebte „Care.We" (dem User gesagt).
      Geschützte Leerzeichen innerhalb der Hälften, damit das Handy nur zwischen „We Care." und „We Repair." bricht;
      `<wbr>` und Vorlesefassung entfallen (normale Wörter). Gemessen: ab 768 px eine Zeile, 390/360 px
      „We Care." / „We Repair.", kein Überlauf
* [x] Plakette NUR an der offenen Karte: die senkrechte Fassung auf den eingeklappten Desktop-Streifen und die waagerechte
      auf den mobilen Streifen entfernt (Phase 11 zurückgenommen); die Plakette blendet mit der Kachel ein und aus.
      Prop `senkrechtAbLg` aus `BereichsPlakette` entfernt
* [x] Liquid Glass: Stil `kontur` nutzt `.cc-liquid` (dasselbe Material wie die mobile Leiste) plus `.cc-liquid--plakette`
      in `styles/glas.css`: Rand bleibt in der Wagenfarbe (`--plakette-rand`, auch beim Zeigen), kein Eindrücken. Ohne
      `shadow-sm`, der die Lichtkanten überschrieben hätte
* [x] Prüfskript Startseite 21/21 (jede Karte einzeln geöffnet, 5 Breiten: Plakette nur an der offenen, vorn, Glas, Rand
      in der Wagenfarbe; keine an eingeklappten; Plaketten außerhalb der Karten ebenfalls Glas), Funktionstest 30/30,
      Nahaufnahmen 2x
* [x] Ganze Messkette gegen den Build 29.09., 00:53:36, alle acht Protokolle nennen ihn: Kontrast 5548 Stellen, 0 unter AA
      (die Glas-Plaketten inbegriffen) · Meta 0 · Zielgruppen 45/45 · Aussparung ✓, Gegenprobe 5/5 · Bilder 129 Stellen bis
      B141 · Funktionstest 30/30 · Fotos. **Maßgeblicher Stand ab jetzt: Build 29.09., 00:53:36**
**Referenzen:**
`components/BereichsPlakette.tsx`
`styles/glas.css`
`components/ExpandingCardAccordion.tsx`

### ✅ Phase 13 — Glas-Plaketten auf der ganzen Website (User, 29.09.) *6.8*
**Ziel (User):** „Die Badges auf der Hauptseite (Care und Repair) sind super vom Design her, bitte passe das nun auf alle
anderen Stellen auf der gesamten Website so an."
* [x] Bestand erhoben: Plaketten auf 16 Routen aus drei Bausteinen — Seitenköpfe (`PageHero`, alle Leistungsseiten),
      `LeistungsKarten` (/leistungen, /privatkunden, /geschaeftskunden, /ueber-uns, /leasingrueckgabe-leipzig,
      /unfallinstandsetzung-leipzig) und die Startseite; die Wagenfarben kommen sonst nirgends vor
* [x] `BereichsPlakette`: nur noch EIN Stil (Liquid Glass, Rand in der Wagenfarbe, dunkle Schrift); die Flächen-Fassung und
      die Prop `stil` entfallen, die drei `stil="kontur"` an den Aufrufen ebenso; Kommentare in `glas.css` und
      `ExpandingCardAccordion` nachgezogen
* [x] Build 29.09., 01:29:36 grün; im ausgelieferten HTML 72 Plaketten auf 16 Routen, alle Glas, keine Fläche. Im Browser
      je Plakette geprüft (`pruefe-plaketten-alle.mjs`, 16/16): Glas, 2-px-Rand in der Wagenfarbe, dunkle Schrift; die 46
      in Leistungskarten absolut oben links im Bild, frei von der KI-Plakette. Bildschirmfotos der Seitenköpfe und der
      Leistungskarten, Desktop und mobil
* [x] Prüfskript Startseite 21/21 (Teil „Unterseiten" auf Glas umgestellt), Funktionstest 30/30
* [x] Ganze Messkette gegen den Build 29.09., 01:29:36, alle acht Protokolle nennen ihn: Kontrast 5552 Stellen, 0 unter AA
      (alle 72 Glas-Plaketten inbegriffen, auch über Fotos) · Meta 0 · Zielgruppen 45/45 · Aussparung ✓, Gegenprobe 5/5 ·
      Bilder 129 Stellen bis B141 · Funktionstest 30/30 · Fotos. **Maßgeblicher Stand ab jetzt: Build 29.09., 01:29:36**
**Referenzen:**
`components/BereichsPlakette.tsx`
`components/LeistungsKarten.tsx`
`components/PageBlocks.tsx`

---

## Kommentare

### Phasen 1–2 (Aufbereitung, Alcantara)
**Eingehalten**: eine Quelle je Tatsache (Preis, Kacheltext, Sperrregel nur in `data/zusatzleistungen.ts`) ✅, Andrés
Wortlaut inhaltlich unverändert, nur in „wir/Sie" ✅, keine erfundenen Leistungstexte (1.18 bleibt offen) ✅, Bildherkunft
mit Beleg (EXIF, Auswahl des Users) statt Augenschein ✅, Originale statt Chat-Anhänge ✅, unter 700 Zeilen ✅, UTF-8 ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — `npm run test:email` war seit dem 28.09. kaputt** (Terminanfrage ohne Pflicht-Leistung) → behoben (O1).
2. 🟠 **Hoch — der Server nahm unvereinbare Zusatzleistungen an** (Regeln nur im Browser) → behoben (O2).
3. 🟢 **Niedrig — Bildhöhen der Exklusivkarten** weichen um bis zu 9 px ab (16:10 neben 1:1) — gerechnet, bewusst so.

### Phase 3 (Startseite)
**Eingehalten**: Farben gemessen statt geschätzt ✅, Kontrast als Fläche statt Schriftfarbe begründet und gemessen ✅, H1
unverändert (SEO) ✅, Plaketten aus dem Katalog abgeleitet statt Liste je Seite ✅, beschriftete CTA (keine Symbolknöpfe) ✅,
48-px-Trefferflächen ✅, Mobile-First geprüft (360–1440) ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Privatkunden-Kacheln zu hoch für niedrige Fenster** (Messung) → kompakte Fassung, 45/45 ✓.
2. 🟢 **Niedrig — `data-partner`-Merkmale an den Kacheln** (Namensschuld, damit die Messung greift) → O6.

### Phasen 4–6 (Lackierung, Karriere, Kontakt)
**Eingehalten**: Video in voller Quellbreite statt hochgerechnet ✅, „Preis nach Aufwand" einheitlich gestaltet ✅,
Pflichtvariablen nicht verschärft (Formulare bleiben an) ✅, Links statt Kartenfenster (keine Verbindung vor dem Klick) ✅,
UWG-Hinweis bei Bewertungen ✅, keine fremden Texte abgeschrieben ✅, kein `AggregateRating`-Schema ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Gesamtwertung 4,7/236 veraltet von selbst** → O5.
2. 🟢 **Niedrig — früheres Hintergrundfoto der Lackierseite wird nur noch als Rückfall ausgeliefert** → O4.

### Phase 7 (Gedankenstriche)
**Eingehalten**: am ausgelieferten HTML gemessen, nicht nur am Quelltext ✅, Satz für Satz statt Suchen-und-Ersetzen ✅,
Bis-Striche und Telefonnummer ausgenommen ✅, Meta-Längen gehalten (0 außerhalb) ✅, Wächter mit Pflichtfrage „was
besteht, ohne dass es stimmt" und Gegenprobe ✅, Helferarbeit vollständig durchgesehen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Wächter sah Browser-Text nicht** → zweite Stufe (O3), dabei zwei eigene Fehler gefunden und behoben
   (Windows-Zeilenenden, Geviertstrich als Bereich).
2. 🟡 **Mittel — Platzhaltertext und Platzhalter-Wächter hängen wortgleich zusammen** → beide zugleich geändert; wer
   den Platzhaltertext ändert, muss `scripts/check-dummies.mjs` mitziehen (steht dort jetzt als Kommentar).

### Phase 8 (Messen)
**Eingehalten**: alle Werkzeuge gegen **denselben** Build, jedes Ergebnis mit seinem Build belegt (erst seit der
Nachmessung, vorher lag der Kontrastlauf vor dem letzten Build) ✅, nach jeder Korrektur die ganze Kette neu ✅, Befunde
behoben statt Schwellen gesenkt ✅, Messwerkzeug nur genauer gemacht, nicht nachsichtiger, mit Gegenprobe belegt ✅, neuer
Wächter mit Pflichtfrage und Gegenprobe ✅, unter 700 Zeilen ✅, UTF-8/CRLF wie die Nachbardateien ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Kontrastprotokoll belegte einen älteren Build** (kein Build im Protokoll) → Nachmessung; die Werkzeuge
   nennen jetzt den Build und brechen bei veraltetem `dist/` ab (O10).
2. 🟡 **Mittel — Karriereseite: H1 = Seitentitel mit „|", Beschreibung warb mit einer nicht offenen Stelle, Du neben
   Sie** (seit 06.09.) → behoben, mobil zusätzlich ohne Silbentrennung (O11).
3. 🟡 **Mittel — Aussparungs-Werkzeug verglich Texte am Wortlaut** (Scheinbefund) → je Element, Gegenprobe 5/5 (O8).
4. 🟡 **Mittel — `index.css` bei 683 von 700 Zeilen** → O7 (nächste Regeln in `styles/`).

### Phase 10 (Stellenfenster)
**Eingehalten**: Ursache gemessen, bevor etwas geändert wurde ✅, kleinste Änderung, die das Erwartete herstellt ✅,
Datenschutz-Faktenblatt mitgezogen ✅, Gestaltung aus 6.15 nicht angefasst ✅, ganze Messkette gegen den neuen Build ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — „einmal je Sitzung" sah für Prüfende wie „entfernt" aus:** Wer ein Pop-up bei einer Durchsicht schließt,
   sieht die nächste Fassung im selben Tab nicht mehr → behoben.
2. 🟢 **Niedrig — das offene Fenster verdeckt den Knopf „Jetzt bewerben" im Banner darunter**, gemessen: 1920 × 945 zu
   95 % (mit den früheren 340 px: 74 %), 1440 × 900 zu 100 % (früher ebenso). Das Fenster trägt denselben Knopf, und
   nach dem Schließen ist er frei → so gelassen.

### Phase 11 (Seitendurchgang Startseite)
**Eingehalten**: nur die Startseite angefasst, wie gewünscht (Unterseiten gemessen unverändert) ✅, Wortlaut des Slogans
genau wie vorgegeben ✅, Farben gemessen statt geschätzt ✅, Ursache der Titeltrennung erst gemessen, drei Varianten
verglichen ✅, Mobile-First an 6 Breiten ✅, unter 700 Zeilen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Plaketten steckten in der ausgeblendeten Textkachel**: an eingeklappten Karten unsichtbar → eigene Ebene.
2. 🟡 **Mittel — Kartentitel ohne Silbentrennung** (Wortverbinder vor dem Punkt, älter) → Punkt als Schriftzeichen.
3. 🟢 **Niedrig — Blau wirkt als Fläche dunkler als der Wagen im Foto**, obwohl es seine häufigste Lackfarbe ist (Umfeld aus
   Weiß und Glanz) → Farbe belassen, dem User zur Entscheidung gezeigt.
4. 🟢 **Niedrig — mehrteilige Titel trennen jetzt auch dann, wenn ein Umbruch am Leerzeichen gereicht hätte**
   („Leasingrückgabe vor-bereiten" auf 390 px statt „… / vorbereiten") → Preis der funktionierenden Trennung, so gelassen.

### Phase 12 (Rückmeldung Startseite)
**Eingehalten**: genau die drei Wünsche, Unterseiten unverändert (gemessen) ✅, vorhandenes Glas-Material wiederverwendet
statt ein zweites zu bauen ✅, Zurückgenommenes auch im Code entfernt (Prop, Kommentar) statt nur ausgeblendet ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig — Leerzeichen nach dem Punkt** war nicht ausdrücklich gewünscht → gesetzt und dem User gesagt.
2. 🟢 **Niedrig — die Memory-Regel „Liquid Glass nur an der mobilen Leiste"** galt bis heute → um die Plaketten erweitert.

### Phase 13 (Glas-Plaketten überall)
**Eingehalten**: Bestand vor der Änderung erhoben (keine Stelle übersehen) ✅, eine Fassung statt zwei (alte Flächen-Fassung
gelöscht, nicht nur ungenutzt) ✅, je Plakette im Browser gemessen statt stichprobenhaft ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig — mein Prüfskript erwartete Tailwinds Standard-Grau als Schriftfarbe**; das Projekt belegt die Grautöne um
   → Prüfung auf Leuchtdichte (dunkel) umgestellt, statt einen Farbwert fest einzutragen.

**Refactoring-Plan (Rest, nach Gewichtung):** O7 (Tokens nach `styles/tokens.css`) · O5 (Stand der Bewertungen) ·
O4 (Rückfallfoto entscheiden) · O6 (Merkmal `data-liste`) — Details in
`docs/backlog/tasks/2026-09-28-schleife-6-umsetzung-optimierung-tasks.md`
