# Mobile-Check aller Seiten (mit Backlog 5.21 „Fußzeile verkleinern“)

**Angelegt:** 2026-10-14
**Auftrag des Users:** „Dann mit dem Mobile Check beginnen bitte.“ 5.21 („Fußzeile verkleinern, sie ist sehr breit,
wird auf das Wesentliche reduziert“) wollte er ausdrücklich dabei prüfen.

**Lösungswege verglichen:**
1. Nur Bildschirmfotos (`npm run shots -- 390`): zeigt viel, misst nichts; abgeschnittene Wörter und zu kleine
   Trefferflächen fallen auf 29 Seiten × mehreren Positionen leicht durch.
2. Lighthouse/PageSpeed mobil: misst Leistung und einige Barrierefreiheitsregeln, aber nicht Überlauf je Element,
   abgeschnittene Texte oder die fixierte Fußzeile dieses Projekts.
3. **Gewählt:** eigenes Messwerkzeug `npm run mobil` (Puppeteer, wie die übrigen Messwerkzeuge) für das Messbare, dazu
   Bildschirmfotos für das Urteil. Mit Gegenprobe (eingespielte Fehler müssen gemeldet werden).

### ✅ Phase 1 — Messwerkzeug `npm run mobil`
**Ziel:** Messen statt schätzen, je Route und Fenster (360 × 640, 390 × 844, 430 × 932).
* [x] `scripts/check-mobil.mjs` (~310 Zeilen): waagerechter Überlauf, abgeschnittene Texte (echte Textzeilen per
  `Range` gegen `overflow: hidden/clip`), Text außerhalb des Fensters, Trefferflächen unter 24 px (WCAG 2.5.8 mit
  Kreisregel), Schrift unter 12 px (Hinweis), Fußzeile unsichtbar / nicht erreichbar / verdeckt, Skriptfehler,
  Viewport-Meta. Bericht `output/mobil/bericht.md`, Exit 1 bei harten Befunden.
* [x] Gegenprobe `--gegenprobe` (5 eingespielte Fehler, alle gemeldet; seit Phase 4 sieben), Pflichtfrage im Kopf beantwortet (8 Punkte),
  Zeile in CLAUDE.md (Messwerkzeuge), `npm run mobil` in `package.json`.
**Referenzen:**
`scripts/check-mobil.mjs`

### ✅ Phase 2 — Lauf über alle 29 Routen, Befunde sortieren
* [x] Erster Lauf: fixierte Fußzeile höher als jedes Handyfenster (1117–1160 px auf 640–932 px, oben 193–528 px nie
  erreichbar), auch bei 1024 × 700 (782 px); Zielgruppen-Titel bei 360/390 abgeschnitten; Wissens-H1 bei 360.
* [x] Karussell „Einblicke“: Nachbarkarten bewusst angeschnitten, mit `data-mobil-anschnitt` begründet ausgenommen.
**Referenzen:**
`components/CoverflowKarussell.tsx`
`output/mobil/bericht.md` (nicht versioniert)

### ✅ Phase 3 — Fußzeile mobil und 5.21 „auf das Wesentliche reduziert“
**Ziel:** Fußzeile erreichbar und deutlich kleiner, ohne Pflichtangaben und ohne SEO-Verlust.
* [x] Fixiert nur, wenn sie ins Fenster passt; sonst im Seitenfluss ohne Freilegen (`components/Footer.tsx`,
  `styles/fusszeile.css`). Fehlerfall dabei gefunden und behoben: im Seitenfluss blieb Deckkraft 0 stehen (Framer
  Motion), Fußzeile leer → eigene Prüfung „Fußzeile unsichtbar“.
* [x] 5.21 umgesetzt (`components/Footer.tsx`, Liste `BEREICHE`). **Gemessen vorher:** 1117 px bei 390, 761 px bei 1440 (Spalte „Anfragen“ rutscht dort allein in
  eine zweite Zeile, 6-Spalten-Raster mit 7 Spalten Inhalt), Symbole bei Kontrast 1,00:1 (`text-gray-400` =
  Graphit 42 % auf Graphit).
  **Was bleibt (begründet):** Marke mit Andrés Zeile (5.31); Kontakt mit Adresse, Route, Telefon, E-Mail (NAP, lokale
  SEO, SEO-GEO-STANDARDS 6.1); Öffnungszeiten; **die fünf Säulenseiten** Unfall & Schaden, Autoaufbereitung,
  Leasingrückgabe, Privatkunden, Geschäftskunden: Im vorgerenderten HTML sind die Fußzeilen-Links die EINZIGEN
  seitenweiten Links dorthin (die Untermenüs der Navbar entstehen erst im Browser; gezählt auf `/kontakt`: je 1 Link,
  davon 1 in der Fußzeile); Impressum und Datenschutz (Pflicht, auf jeder Seite); EU-Hinweis (Förderpflicht);
  Cookie-Satz (Vertrauen, geprüft 2026-09-04).
  **Was entfällt (Dopplungen):** Spalte „Bereiche“ (Startseite, Über uns, Leistungen, Wissen, Jobangebote: stehen
  vorgerendert in der Navbar; Impressum/Datenschutz wandern in die Rechtszeile), Spalte „Anfragen“ (Schaden melden,
  Termin anfragen: Navbar-Pillen und mobile Leiste; Geschäftskunden-Anfrage: über die Säulenseite), Zeile
  „Verantwortliche Stelle“ (steht zwei Blöcke darüber als Kontakt und im Impressum), Sitemap-Einträge Leistungen,
  Wissen, Kontakt (Navbar).
* [x] Raster ohne Waisenzeile: mobil Marke / Kontakt / Öffnungszeiten | Bereiche; ab md drei Spalten; ab lg 4-3-2-3
  auf 12 Spalten. Symbole sichtbar (Eisblau 60 %, **gemessen 5,35 bis 9,45 : 1** am Bildschirmfoto). Feinschrift 12
  statt 10 px. Impressum/Datenschutz neben dem Copyright mit 24 px Trefferhöhe.
* [x] Höhe gemessen (Build 15.10. 00:48): **360: 1160 → 899 px, 390: 1117 → 848 px, 430: 1117 → 848 px (passt jetzt,
  wieder fixiert mit Freilegen), 768: 698 px, 1440: 761 → 489 px, 1920: 489 px.** Fotos `output/b24/fuss-vorher-*.png`,
  `fuss-nachher-*.png` (nicht versioniert).
* [x] Kontrast und Mobile-Check gegen den Endstand (Phase 4, letzte Zeile).
**Referenzen:**
`components/Footer.tsx`
`styles/fusszeile.css`
`docs/backlog/schleife-5.md` (5.21)

### ✅ Phase 4 — Objektive Mängel beheben, Nachmessung gegen neuen Build
* [x] Zielgruppen-Titel (`TargetGroupCards`) und Wissens-H1 (`ArticleLayout`) über `GanzwortTitel`: passen sich an,
  statt abgeschnitten zu werden („Versicherungen & Agenturen“ bei 360 mit 16,5 px).
* [x] **Stellen-Pop-up `/karriere` als Einblendung** (letzte 10 harte Befunde, alle „Fußzeile verdeckt“ durch
  `JobPopup`): verdeckt 66 % der Fensterfläche bei 360 × 640, 51 % bei 390 × 844, 42 % bei 430 × 932 (an der
  Höhe gemessen wie im Werkzeug: 73 %, 55 %, 45 %); bei 360 rutscht
  seine Oberkante (62 px) unter die Navbar (78 px). Google: Dialoge, die Inhalt verdecken, „may lead to poor search
  performance“, Alternative sind Banner mit „only a small fraction of the screen“ (Search Central, Stand 2025-12-10).
  Better Ads Standard: mobil mehr als 30 % der Höhe = störend. **Lösungswege:** (a) später einblenden: verdeckt
  genauso viel; (b) Liste im Pop-up scrollbar: Scrollfläche im Pop-up, schlecht bedienbar; (c) **gewählt:** kompakte
  Fassung, wo die volle nicht sinnvoll passt (schmaler als 640 px oder niedriger als 640 px): Kopf mit Zähler und
  „Jetzt bewerben“, die Stellenliste steht direkt unter dem Hero im Stellen-Banner (`JobBanner`), das das große
  Pop-up bisher selbst verdeckte. Ab 640 × 640 bleibt das Pop-up wie in 6.15 abgenommen. Querformat-Handys (z. B.
  844 × 390) bekommen ebenfalls die kompakte Fassung; die volle hätte dort den Schließknopf über den oberen Rand
  geschoben. **Gemessen nachher:** kompakt 163 px statt 466 px, Anteil an der Fensterhöhe 25 % (360 × 640), 24 %
  (375 × 667), 19 % (390 × 844), 17 % (430 × 932); Querformat 844 × 390 und 640 × 360 kompakt mit erreichbarem
  Schließknopf; ab 768 × 1024 und am Desktop (1024 × 700, 1920 × 945) unverändert voll. `components/JobPopup.tsx`.
* [x] Messwerkzeug: Einblendungen (`role="dialog"`, ohne Zutun sichtbar) als eigene Prüfung. Anteil am Fenster über
  30 % = hart, Schließknopf nicht erreichbar oder wirkungslos = hart; danach geschlossen, damit „Fußzeile verdeckt“
  nur noch Dauerhaftes meldet. Gegenprobe um eine eingespielte, nicht schließbare Einblendung erweitert:
  **bestanden, 7 von 7** (Build 15.10. 00:48). Kopf um Punkt 9 (was die Einblendungsprüfung nicht sieht) und den
  Hinweis auf Bildschirm- statt Browsermaße ergänzt.
* [x] `npm run shots`: Kontaktbogen `output/shots/kontaktbogen.html`, alte Aufnahmen je Route/Breite werden vorher
  entfernt (sonst mischten sich Bilder früherer Läufe darunter), mobil als Touch-Gerät wie `npm run mobil`.
* [x] Neben dem Weg gefunden: Zähltabelle in `docs/backlog/offene-punkte-konsolidiert.md` stand noch vor dem
  Statusabgleich vom 14.10. (R3, R4, 1.26) → nachgezogen, Summe echt offen 12 → 8. SEO-Befund Navbar-Untermenüs als
  Vorschlag **R21** in `docs/backlog/nice-to-have.md` geparkt (nicht beauftragt).
* [x] Nachmessung aller Werkzeuge gegen den Endstand. `npm run mobil` gegen Build 15.10. 00:48:52: **0 harte Befunde**
  (vorher 10), 257 Hinweise (vorher 374); Stellen-Pop-up 25/19/17 %; Fußzeile 899/848/848 px (430: fixiert).
  Danach nur ein Kommentar geändert, Neubau 01:02:03 mit **byte-gleichen Bundles** (Assets-Liste verglichen), der
  Lauf gilt also für den Endstand. Gegen Build 01:02:03: `npm run kontrast` 6267 Textstellen, 29 Routen, kein Text
  unter AA; `npm run zielgruppen` alle Karten in Ordnung; `npm run aussparung` 29 Routen × 3 Fenster, Geometrie an
  23 Breiten in Ordnung; `npm run tote-dateien` keine toten Dateien; postbuild Gedankenstriche 0 Funde.
* [x] **Nachtrag aus den Bildschirmfotos:** Wer das Stellen-Pop-up nicht schließt und bis ans Ende scrollt, hatte es
  über der Fußzeile (mobil über Öffnungszeiten/Bereiche, am Desktop über der rechten Fußzeilenhälfte,
  `output/shots/karriere/desktop-10-*.png` vom Build 01:02). Jetzt weicht es am Seitenende aus wie die mobile Leiste
  (`useNaheSeitenende`) und kommt beim Hochscrollen wieder; das zählt nicht als Schließen, der Fokus springt nicht.
  Geprüft per Skript (390 × 844 und 1440 × 900): oben sichtbar, am Seitenende weg, wieder oben sichtbar ohne
  Fokussprung, nach dem Schließen dauerhaft weg. **Endstand, Build 15.10. 01:37:20:** `npm run mobil` 0 harte
  Befunde (257 Hinweise), Gegenprobe 7/7; `npm run kontrast` 6273 Textstellen ohne Befund; `npm run zielgruppen` und
  `npm run aussparung` in Ordnung; neue Aufnahmen `/karriere` mobil und Desktop (Fußzeile am Ende frei).
* [x] Messwerkzeug: Die Gegenprobe schrieb in `output/mobil/bericht.md` und überschrieb damit den echten Bericht;
  jetzt `output/mobil/gegenprobe.md`. Der volle Lauf danach erzeugt den Bericht zum Endstand neu.
* [x] Hinweise „Schrift unter 12 px“ geordnet: 116 von 257 sind die Beschriftungen der mobilen Leiste (Anrufen,
  Schaden, Termin, Route; 10 px wie Tab-Leisten unter iOS), 43 die Care-/Repair-/KI-Plaketten, der Rest Kicker.
  Bewusst so gestaltet, nicht geändert.
**Referenzen:**
`components/JobPopup.tsx`
`scripts/check-mobil.mjs`
`scripts/shots.mjs`

### 🔄 Phase 5 — Sichtprüfung mit dem User (Bildschirmfotos je Seite)
* [x] `npm run shots` mobil (Build 01:02) und Desktop (Build 01:02, die alten vom 08.10. ersetzt), `/karriere` beide
  Breiten neu gegen Build 01:37 (Pop-up am Seitenende). Übersicht `output/shots/kontaktbogen.html`. Die übrigen
  Seiten sind vom Pop-up-Nachtrag nicht betroffen (es erscheint nur auf `/karriere`).
* [ ] Sichtabnahme durch den User: Fußzeile (5.21) mobil und Desktop, kompaktes Stellen-Pop-up, übrige Seiten.

---

## Kommentare

### Phase 1–5
**Eingehalten:** unter 700 Zeilen ✅ (Footer 373, JobPopup 203, check-mobil 417, shots 171), Mobile-First ✅, messen statt
schätzen ✅ (Höhen, Anteile, Kontrast am Bildschirmfoto, Linkzählung im ausgelieferten HTML), Pflichtfrage je Prüfung
beantwortet ✅, Gegenprobe ✅, keine Gedankenstriche im sichtbaren Text ✅ (postbuild 0 Funde), Wir-Form und Textregeln
unberührt ✅ (kein neuer sichtbarer Text), SEO-Links und Pflichtangaben erhalten ✅, keine Backlog-Nummer vergeben ✅
(eigener Vorschlag als R21), Dev-Server nicht gestartet ✅ (`vite preview` über die Messwerkzeuge).

**Auffälligkeiten/Probleme (nach Schwere):**
1. 🔴 **Kritisch (behoben):** Fixierte Fußzeile auf allen Handys höher als das Fenster, oberer Teil (Logo, Kontakt,
   Adresse) nie erreichbar. Bei der Korrektur zweiter Fehler: im Seitenfluss blieb Framer-Deckkraft 0 stehen, Fußzeile
   leer. Beides behoben, beides prüft `npm run mobil`.
2. 🟠 **Hoch (behoben):** Stellen-Pop-up als aufdringliche Einblendung (66 % bei 360 × 640, Oberkante unter der Navbar;
   im Querformat Schließknopf über dem Rand); dazu lag es am Seitenende über der Fußzeile → weicht dort jetzt aus.
3. 🟠 **Hoch (behoben):** Abgeschnittene Überschriften (Zielgruppenkarten 360/390, Wissens-H1 360).
4. 🟡 **Mittel (behoben):** Footer-Symbole unsichtbar (1,00 : 1); Desktop-Fußzeile mit Waisenzeile „Anfragen“.
5. 🟡 **Mittel (behoben):** Zähltabelle im konsolidierten Backlog stand vor dem Statusabgleich vom 14.10.
6. 🟢 **Niedrig (behoben):** `npm run shots` mischte alte Aufnahmen unter neue und nahm mobil ohne Touch auf;
   die Gegenprobe von `npm run mobil` überschrieb den echten Bericht.
7. 🟢 **Hinweis (bewusst nicht geändert):** Schrift unter 12 px an Kickern, Care/Repair- und KI-Plaketten, Leisten-
   beschriftung und Formular-Hilfetexten: Gestaltungsentscheidungen (DESIGN.md „Labels & Kicker“, 5.3/6.9).
8. 🟢 **Hinweis:** „Versicherungen & Agenturen“ steht bei 360 px mit 16,5 px kleiner als die übrigen Kartentitel
   (passt sich an, statt abgeschnitten zu werden). Alternative: Plakette unter den Titel umbrechen; berührt die
   Stapelgeometrie der Karten, nur auf Wunsch.
9. 🟢 **Für später (R21, nicht beauftragt):** Navbar-Untermenüs vorrendern, damit die Leistungsseiten seitenweit
   verlinkt sind.

**Refactoring-Plan:** Kein eigener Optimierungsplan nötig: Alle Funde 1–6 sind in diesem Paket behoben und
nachgemessen; 7 und 8 sind Gestaltungsfragen für den User, 9 ist als R21 geparkt.
