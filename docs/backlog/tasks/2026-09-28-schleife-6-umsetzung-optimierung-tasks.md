# Optimierung zu Schleife 6 — Funde aus der Umsetzung vom 28.09.2026

**Bezug:** `docs/backlog/tasks/2026-09-28-schleife-6-umsetzung-tasks.md` (Kommentare je Phase)
**Regel:** Funde, die während der Arbeit auffielen, sofort beheben und hier als ✅ führen; was eine Entscheidung braucht,
bleibt ⬜ mit Empfehlung.

---

### ✅ O1 — `npm run test:email` schlug seit dem 28.09. fehl 🟠
**Fund:** Seit „Gewünschte Leistung" Pflicht ist (Wunsch des Users vom 28.09.), schickte der Test die Terminanfrage ohne
`service` → 400 statt 200. Der Mailtest lief damit nicht mehr durch, ohne dass es jemand gemerkt hätte (er ist kein
Teil des Builds).
* [x] Test schickt `service: 'keramik'` (prüft 6.6 mit), dazu neue Fälle für 6.13 und die Zusatzleistungen (O2) — PASS

### ✅ O2 — Der Server nahm beliebige und unvereinbare Zusatzleistungen an 🟠
**Fund:** Die Ausgrau-Regeln galten nur im Browser. Ein altes oder umgangenes Formular konnte unbekannte IDs oder
Unvereinbares schicken (Keramik als Leistung UND als Zusatz, Keramik neben Nano); in der Mail stand das dann so.
* [x] `api/anfrage.ts`: unbekannte Zusatzleistung → 400, sonst `bereinigteZusaetze` wie im Formular; andere Anfragearten
      verlieren das Feld. `ZUSATZ_IDS` in `data/anfrageSchema.ts`. Test: Keramik + Felgen bei Leistung Keramik → nur Felgen

### ✅ O3 — Der Gedankenstrich-Wächter sah nur vorgerenderten Text 🟡
**Fund:** Stellenfenster, Dialoginhalte und Meldungen nach dem Absenden entstehen erst im Browser. Sie waren in dieser
Runde im Quelltext mit umgestellt, ein neuer Strich dort hätte den Build aber nicht gebrochen.
* [x] Zweite Stufe in `scripts/check-gedankenstriche.mjs`: Quelltext von `JobPopup`, `AnfrageDialog`, `RequestForm`,
      `SuchDialog` und `formulare/*` ohne Kommentare, auch Striche am Zeilenende/-anfang (mehrzeiliger JSX-Text)
* [x] Dabei zwei eigene Fehler gefunden und behoben: `\r` der Windows-Zeilenenden verhinderte das Entfernen der
      Zeilenkommentare (40 Scheinfunde); ein Geviertstrich zwischen Zahlen galt als Bereich
* [x] Gegenprobe: eingesetzter Strich am Zeilenende in `JobPopup` → gemeldet; danach wiederhergestellt

### ⬜ O7 — `index.css` steht bei 683 von 700 Zeilen 🟡
**Fund:** Die Care/Repair-Tokens (6.8) brachten die Datei auf 683 Zeilen.
**Empfehlung:** Die nächste Regel nicht hier, sondern in `styles/` ablegen (wie `zielgruppen.css`, `aussparung.css`);
bei Gelegenheit die Tokens in eine eigene `styles/tokens.css` verschieben.

### ⬜ O4 — Früheres Hintergrundfoto der Lackierseite ist jetzt nur Rückfall 🟢
**Fund:** Seit 6.12 zeigt `/autolackierung-leipzig` das Video; `autolackierung-hintergrund-leipzig-carcare.webp` bleibt
als `pageImage` im Katalog, wird aber nicht angezeigt und trotzdem ausgeliefert.
**Empfehlung:** nach Andrés Freigabe des Videos löschen (Datei, `pageImage`, Eintrag in `scripts/build-fotos.mjs`) —
oder bewusst als Rückfall behalten. Entscheidung beim User.

### ⬜ O5 — Gesamtwertung der Google-Bewertungen veraltet von selbst 🟢
**Fund:** 4,7 Sterne / 236 Bewertungen sind am 28.09. abgelesen und stehen fest im Code (`data/bewertungen.ts`, mit „Stand").
**Empfehlung:** beim Eintragen der ausgewählten Bewertungen neu ablesen; optional ein Hinweis in `npm run push-stand`,
wenn der Stand älter als drei Monate ist.

### ⬜ O6 — `data-partner`-Merkmale an den Privatkunden-Kacheln 🟢
**Fund:** `ZielgruppenKacheln` trägt bewusst dieselben Merkmale wie die Partnerliste, damit `npm run zielgruppen` sie
mitmisst. Der Name passt nicht mehr ganz.
**Empfehlung:** Merkmal allgemein benennen (`data-liste`) — in beiden Komponenten und im Messskript zugleich.

### ✅ O8 — Aussparungs-Werkzeug verglich Texte am Wortlaut 🟡
**Fund:** `npm run aussparung` meldete auf 1024 × 700 „Fuhrparkservice" als gepinnt. Tatsächlich lagen an zwei
Messpositionen zwei verschiedene Elemente derselben Karte (Titel und gleichlautende Knopfzeile) 10 px auseinander unter
der Aussparung; das Werkzeug kannte nur den Text. Sichtbar wurde es, weil die Care-Plakette den Titel verschob.
* [x] `scripts/check-aussparung.mjs`: Vergleich je Element (Wortlaut + Pfad ab `<main>`), Schleife als Funktion
      `dauerhafteUeberdeckung`
* [x] Neue Gegenprobe „gepinnter Text": eingespielter `position: sticky`-Block unter der Aussparung muss gemeldet werden.
      Erster Aufbau selbst blind (Scrollbereich ergab nur eine Messposition), korrigiert → Gegenprobe 5/5, voller Lauf ✓

### ✅ O9 — Privatkunden-Kacheln passten nicht in niedrige Fenster 🟡
**Fund:** `npm run zielgruppen` — 1280 × 593 zeigte 2 von 4 Kacheln, 390 × 664 und 360 × 640 nach dem Kartenscroll 3.
* [x] Dort nur die Titel, zweispaltig (`ZielgruppenKacheln`, Schwellen je Breite); Laptop 1366 × 657 behält den Kurztext
      → 45/45 ✓

### ✅ O10 — Ein Messprotokoll konnte unbemerkt einen älteren Build belegen 🟡
**Fund (bei der Auswertung von `kontrast-s6.log` auf Wunsch des Users):** Der Kontrastlauf (fertig 17:12, grün) hatte den
Build von 17:05 gemessen. Um 17:15 kam der Build mit der Kachel-Verdichtung (O9). Das Protokoll nannte keinen Build und
sah genauso aus wie eines vom letzten Stand; Phase 8 führte deshalb „alle Werkzeuge gegen frisches `dist/`" zu Unrecht.
Die Kachel-Verdichtung greift erst unter 700 px (mobil) bzw. 620 px Fensterhöhe (Desktop), die Kontrastfenster sind
1440 × 900 und 390 × 844, also ist das Ergebnis sehr wahrscheinlich dasselbe. Belegt war es trotzdem nicht.
* [x] Alle Werkzeuge nacheinander gegen denselben Build (28.09., 17:15:13), Ergebnisse in Phase 8 unter „Nachmessung"
* [x] `scripts/lib/dist-stand.mjs`, aufgerufen von `startePreview` (Kontrast, Zielgruppen, Aussparung, Bilder, Shots,
      Navigation) und von `check-meta.mjs`: jede Messung beginnt mit `[dist] Build vom …`; ist eine getrackte Quelldatei
      neuer als `dist/index.html`, bricht sie mit Code 2 ab und nennt die Dateien (Schalter `CC_ALTEN_STAND_MESSEN=1`)
* [x] Pflichtfrage „Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?": nicht getrackte Build-Eingänge
      (`.env`, die erzeugten `data/*.js`, bewusst, sonst Fehlalarm nach jedem Mailtest), alte Zeitstempel, gelöschte
      Dateien, und eine Messung, die erst nachträglich veraltet (der Anlass selbst). Dagegen hilft nur der Build in der
      Ausgabe. Eine Inhalts-Identität (Hash der Quellen im Build) wäre hinreichend, bräuchte aber einen Eingriff in die
      Build-Kette, die auch auf Vercel läuft, und ist deshalb bewusst nicht gebaut. Steht im Kopf der Datei und in
      `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`
* [x] Gegenprobe: frischer Stand → läuft durch · erzeugte `data/anfrageSchema.js` neuer → kein Fehlalarm · `types.ts`
      neuer → Abbruch mit Dateiname, Code 2 · mit Schalter → Hinweis, läuft durch · Zeitstempel danach zurückgesetzt.
      Eingebunden nachgeprüft: `npm run meta` und `startePreview` nennen den Build; mit neuerer `types.ts` brechen beide
      vor dem Start von `vite preview` ab (Code 2)

### ✅ O11 — Karriereseite: H1 war der Seitentitel, Beschreibung nannte eine nicht offene Stelle, Du neben Sie 🟡
**Fund (Übersichtsbild der Nachmessung, Stellenfenster auf `/karriere`):** Die H1 lautete „Jobs & Ausbildung in Leipzig |
CarCare Center Karriere". Die Meta-Umstellung vom 2026-09-06 (Commit `ba40d96`, Paket G) hatte den neuen Seitentitel
auch in die H1 geschrieben, weil die H1 bis dahin wortgleich mit dem alten Titel war. Die Beschreibung begann mit
demselben Titel und warb mit „Jobs für … Serviceberater", laut FAQ „bereiche" besetzen wir diese Stelle zurzeit nicht
neu. Dazu siezte die Seite überall, nur Einleitung und Abschluss duzten („Dein Job bei uns", „Du willst Teil des Teams
werden?"). Das waren die einzigen Du-Formen der ganzen Website (Suche über alle 29 Seiten im ausgelieferten HTML).
Ein weiterer Seitentitel in einer H1 findet sich auf keiner anderen Seite.
* [x] H1 „Jobs und Ausbildung in Leipzig." (Muster der Leistungsseiten); Title bleibt (54 Zeichen)
* [x] Beschreibung „Wir suchen in Leipzig Kfz-Aufbereiter, Fahrzeuglackierer sowie Karosserie- und
      Fahrzeugbaumechaniker und bilden aus. Jetzt bewerben, auch initiativ." (148 Zeichen, nur ausgeschriebene Stellen)
* [x] Einleitung und Abschluss im „Sie" wie der Rest der Seite (Textregel 2)
* [x] Build grün (Gedankenstriche 0, FAQ 29/29), danach alle Werkzeuge gegen diesen Build (Phase 8, „Nachmessung")
* [x] Folgefund im Foto der Nachmessung: mobil trennte der Browser die neue H1 als „Ausbil-dung" (dieselbe Art
      Trennung wie „Karosserie" in 5.5). `PageHero` bekommt die Option `ohneTrennung` (`hyphens: manual`), nur die
      Karriereseite nutzt sie; seitenweit ginge es nicht, weil „Unfallinstandsetzung" & Co. die Trennung brauchen.
      Gemessen an 320, 360, 390, 768, 1024 und 1440 px: kein Wort getrennt, kein Überlauf, mobil drei Zeilen
      („Jobs und / Ausbildung in / Leipzig."); die übrigen Seitenköpfe behalten `hyphens: auto`
