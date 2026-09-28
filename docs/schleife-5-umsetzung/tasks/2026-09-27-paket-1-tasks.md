# Schleife 5 — Paket 1: alles, was ohne Zulieferung geht

**Auftrag (User, 2026-09-27):** 5.16, 5.18, 5.24, 5.26, 5.30, 5.31, 5.32, 5.33, 5.13, 5.25, 5.17, 5.29, 5.44
umsetzen. Präzisiert: **5.17** = die Karte „Wissen" in der Aufbereitungssektion der Startseite;
**5.44** = `/leistungen` ist gestalterisch nicht wie die übrigen Unterseiten angepasst.
**Grundlage:** `docs/backlog/schleife-5.md` (Aufgabentext, Zeitmarken, Fundstellen)
**Branch:** `2026-09-27-schleife-5-paket-1`

---

### ✅ Phase 1 — Texte und Daten (5.30, 5.31, 5.18, 5.32, 5.33, 5.24, 5.26, 5.16)
**Ziel:** Alle Wortlaut- und Datenänderungen aus dem Meeting, sichtbarer Text und Schema gemeinsam.
* [x] **5.30** Fax aus Footer und Impressum; im Impressum stattdessen **Telefon 0341 - 261 77 90** (André: „die mit der 90 am Ende reicht") — beantwortet die Telefonfrage aus R5
* [x] **5.31** Footer: „Ihr Premium-Partner für Fahrzeugaufbereitung und Unfallinstandsetzung in Leipzig."
* [x] **5.18** Schritt 04: „Innen, Außen, Lack und Details nach dem höchsten Standard." — Startseite liest den Ablauf künftig aus `data/detailing.ts` (eine Quelle, O5); „Innen, außen" als Bereichsnamen überall groß
* [x] **5.32** „ab" an allen Paketpreisen: Preiskarten, 6 FAQ-Antworten, Seitentexte (Innen, Außen, Aufbereitung, Privatkunden), Schema über `from: true` → `minPrice`
* [x] **5.33** Lackaufbereitung: Swissvax raus, Keramik- und Nanoversiegelung rein, Tiefe herausstellen (Karte, Schema, Umfang, FAQ „Unterschied")
* [x] **5.24** Meilenstein 3: 2017 „Eintritt in die Schadensteuerung"; `istPlatzhalter` und die zwei ANERKANNT-Zeilen weg
* [x] **5.26** Ausbildung aktiv (Lack + Karosserie „Beginn Sommer 2027", Industrie ohne Hinweis); Zähler, Banner, Pop-up trennen Stellen und Ausbildungsplätze; JobPosting mit Pflichtfeld `datePosted` und vollständiger Adresse
* [x] **5.16** VW (`volkswagen-leipzig.de`) und Audi (`audi-zentrum-leipzig.de`) als Link, kein Logo — Adressen am Impressum bzw. Betreiber geprüft (26.09./27.09.)

* [x] Nebenbei: Impressum-Kopf auf zwei offene Angabengruppen korrigiert; Kommentarbeispiel „ab 169,00 €“ in `PageBlocks`
* [x] `tsc --noEmit` grün
**Gemessen:** 17 Preisstellen in 6 Dateien mit „ab“, danach 0 Paketpreise ohne „ab“ (Suche über components/pages/data/seo);
„Innen, außen“ 7 → 0 (alle als Bereichsnamen groß); Swissvax nur noch bei „exklusiv“ und in der Wachs-FAQ
**Lösungswege (gewählt ✔):**
- 5.18: (a) nur beide Texte ändern · (b) ✔ Startseite liest Titel/Text aus `detailingSteps`, Bilder bleiben in der Komponente — sonst muss jede künftige Korrektur zweimal gemacht werden
- 5.32 Schema: (a) Fixpreis lassen · (b) ✔ vorhandenes `from: true` → `PriceSpecification.minPrice`, das der Schema-Baustein schon kann
- 5.26 Abzeichen: (a) „Stelle offen" für alle · (b) ✔ eigenes Feld `hinweis` je Eintrag („Beginn Sommer 2027") und „Ausbildungsplatz frei" statt „Stelle offen"
- 5.24 Text: (a) 4.19 wörtlich inkl. „Ausbildungsbetrieb" · (b) ✔ nur der Schadensteuerungsteil — ob „Ausbildungsbetrieb" seit 2017 stimmt, ist eine offene Frage an André (schleife-5.md)
**Referenzen:**
`data/detailing.ts`
`data/jobs.ts`
`data/faqs.ts`

### ✅ Phase 2 — Darstellung (5.25, 5.13)
* [x] **5.25** Kartentitel: das letzte Wort steht in `whitespace-nowrap` (für den blauen Punkt) — „Fahrzeugbaumechaniker/in" läuft bei 24 px über den 252 px breiten Kasten. Punkt per Wortverbinder (U+2060) anhängen, Titel mit `hyphens-auto`; messen an Desktop und mobil
* [x] **5.13** „Ablauf überspringen" in `ScrollPinnedProcess` (gilt für Unfall- und Aufbereitungsablauf): sichtbare Beschriftung, Tastatur, Lenis-`scrollTo` auf die nächste Sektion, Fokus dorthin

* [x] Nebenbei: Fokus-Rahmen um die ganze Zielsektion unterdrückt (`[data-sprungziel]`), mobile Kurzfassung „Überspringen“ neben den Dots
**Lösungswege (gewählt ✔):**
- 5.25: (a) Schrift kleiner · (b) weiches Trennzeichen in den Daten (landet auch im Schema und im Formular) · (c) ✔ CSS-Silbentrennung nur im Kartentitel + Wortverbinder für den Punkt
- 5.13: (a) Anker-Link auf die nächste Sektion · (b) ✔ Knopf mit Lenis-`scrollTo` (wie Suche und Navbar) + Fokusübergabe; ein nativer Sprung arbeitete gegen Lenis
**Referenzen:**
`components/ScrollPinnedProcess.tsx`
`components/ExpandingCardAccordion.tsx`
`lib/suche.ts`

### ✅ Phase 3 — Wissens-Karte der Startseite (5.17)
* [x] Messen: Wie oft ist `/autoaufbereitung-wissen` und jeder Artikel von der Startseite und seitenweit verlinkt (Navigation, Footer, Karte)?
* [x] **Gemessen (dist, 29 Seiten):** Startseite → Hub 4× (Navigation, Footer 2×, Karte), Hub von 29/29 Seiten verlinkt; **kein** Ratgeber
      von der Startseite verlinkt, schwächster Artikel „Was ist Autoaufbereitung?“ mit 3 eingehenden Seiten
* [x] **Entscheidung:** Karte raus (redundant, Füllfoto mit KI-Plakette). Statt ihrer eine Ratgeber-Zeile mit den vier
      Aufbereitungsartikeln + „Alle Ratgeber“ — Titel/Pfad aus `knowledgeArticles.ts`. Kein Link IN die Karten (die Karte ist
      selbst ein `<a>`), daher Zeile statt „zweitem Knopf“ — löst T4
* [x] `aufbereitungKacheln.wissen` entfernt; Motiv `wissensdatenbank-…` bleibt als Datei liegen (unbenutzt, siehe `npm run bilder`)
**Referenzen:**
`components/AutoDetailingExpertiseSection.tsx`
`data/detailing.ts`

### ✅ Phase 4 — Anhänge im Bewerbungsformular (5.29)
* [x] Client: Dateiauswahl (PDF, DOC/DOCX, ODT, JPG, PNG), max. 3 Dateien und 3 MB gesamt, Liste mit Entfernen, klare Meldungen
* [x] Server: nur bei `bewerbung`, Grenze des Anfragekörpers nur dort angehoben, Typprüfung über die Dateisignatur, Dateinamen bereinigen, Anhang per nodemailer
* [x] Test gegen die Funktion mit abgefangenem Versand (kein echter Mailversand): **11/11 bestanden** — gültige PDF kommt als
      Anhang mit Typ und Namen an, Pfadzeichen entschärft, PNG-Inhalt mit .pdf-Endung / .exe / 4 Dateien / >3 MB / kein Base64 /
      Anhang bei Terminanfrage abgewiesen, Terminanfrage über 48 KB weiter 413, normale Terminanfrage unverändert
* [x] Mailvorlage: Abschnitt „Anhänge“ mit Name und Größe; Hinweiszeile unterscheidet mit/ohne Anhang
* [x] Faktenblatt Datenschutz: Nachtrag 2026-09-27 (neuer Datenweg für Bewerbungsunterlagen, relevant für R6)
* [x] Stolperstein beim Test: Die Funktion lädt nodemailer als ESM (`dist/esm`) — eine Attrappe am CJS-Modul greift nicht

**Lösungswege (gewählt ✔):** (a) Speicherdienst + Link in der Mail (neuer Dienst, Löschfristen) · (b) multipart mit Parser
(neue Abhängigkeit) · (c) ✔ Base64 im bestehenden JSON — keine neue Abhängigkeit, 3 MB roh bleiben unter der
Vercel-Grenze von 4,5 MB
**Referenzen:**
`api/anfrage.ts`
`components/formulare/AnhangFeld.tsx`
`data/anfrageSchema.ts`

### ✅ Phase 5 — `/leistungen` wie die übrigen Unterseiten (5.44)
* [x] `BackdropLayout` mit echtem Foto, Bildkarten (`LeistungsKarten`) je Gruppe statt Textkarten, Vorteile, Ablauf, FAQ, CTA — Aufbau wie Privat- und Geschäftskundenseite
* [x] Foto: Standbild des Betriebsrundgangs (echte Aufnahme, keine Plakette) — die Seite zeigt alle Bereiche, also die Halle
* [x] Je Gruppe eine eigene Einleitung; Linktext beschreibend („Unfallinstandsetzung ansehen“) statt „Mehr erfahren“ und bewusst nicht
      das Kachel-`cta` („Unfall melden“ auf einem Link zur Infoseite versprach etwas anderes)
* [x] Katalogeintrag Geschäftskundenbetreuung mit Motiv (grüner Cayenne wie `/geschaeftskunden`, 5.14) — sonst einzige Karte ohne Foto
* [x] Neuer Ablauf (4 Schritte) — Kundenvorgabe „Ablauf-Sektionen bleiben“, jetzt auch auf der Übersicht
**Referenzen:**
`pages/ServicesPage.tsx`
`data/services.ts`

### ✅ Phase 6 — Prüfen und Backlog nachziehen
* [x] `tsc --noEmit` und `npm run build` grün: 29/29 Prerender, `check-faq` (19 Routen), `check-faq-html` (236 FAQ-Texte),
      `check-nummernraeume` (kennt 5.1–5.44), `check-dummies` (7 anerkannte Platzhalter — Meilenstein 3 nicht mehr darunter)
* [x] `npm run meta`: **0 von 29** Seiten außerhalb des Korridors
* [x] `npm run kontrast`: zuerst **6 Stellen unter AA — alle an neuen Knöpfen** (O7) → behoben → **0** (5.436 Textstellen);
      dazu jedes neue Element einzeln gemessen, weil der Messer nur vier Scrollpositionen je Route sieht: **9,61–10,04:1**
* [x] `npm run aussparung`: ✓ keine dauerhafte Überdeckung (29 Routen × 3 Fenster), Geometrie an 23 Breiten in Ordnung
* [x] `npm run zielgruppen`: ✓ alle Karten auf allen 15 Fenstern
* [x] `npm run bilder`: 126 Bildstellen (bis B138), 46 Dateien; **B30** (Foto der Wissens-Karte) entfallen und nicht neu
      vergeben; B125–B138 neu = die 13 Bildkarten und das stehende Foto von `/leistungen`. Zwei Befunde: Vermerk auf B30 brach
      das Inventar (O9), und der Wortverbinder aus 5.25 stand in 21 Schlüsseln und Ortsangaben (O11) — beide behoben
* [x] Sichtprüfung am Build (Puppeteer): `/leistungen` Kopf + Aufbereitung (Desktop, mobil), Startseite Aufbereitung mit
      Ratgeber-Zeile, Überspringen vor/nach dem Klick (Desktop, mobil), Karriere-Ausbildungskarten (Desktop, mobil), Fußzeile,
      zugeklappte Mobil-Streifen bei 360 px
* [x] Dabei gefunden und behoben: **O7** Kontrast der neuen Knöpfe, **O8** KI-Plakette über Kartentiteln (11/96 → 0),
      **O9** Bildvermerk B30, **O10** Kleinigkeiten (48-px-Ziel, „3 MB“, Escape statt unsichtbarem Zeichen), **O11** Inventar-Schlüssel
* [x] Status in `schleife-5.md`, Querverweise (Schleife 1, 3, 4, konsolidiert, README), Optimierungsplan fortgeschrieben
**Referenzen:**
`docs/schleife-5-umsetzung/tasks/2026-09-27-paket-1-optimierung-tasks.md`
`components/ExpandingCardAccordion.tsx`
`scripts/lib/bilder-rundgang.mjs`

---

## Kommentare

### Phasen 1–5
**Eingehalten**: Planung vor Code ✅, je Punkt Lösungswege verglichen und begründet gewählt ✅, gemessen statt geschätzt
(Preise 17 → 0 ohne „ab“, Titel-Überläufe 9 → 0 vorher/nachher am Build, Verlinkung des Wissensbereichs über 29 Seiten,
Funktionstests 11/11, Meta 0/29 außerhalb) ✅, Mobile-First (jede Änderung auch bei 390 px geprüft, mobile Kurzform des
Knopfes) ✅, unter 700 Zeilen je Datei (größte: `index.css` 676, `RequestForm.tsx` 383) ✅, Textregeln (erste Person Plural,
„CarCare Center“, 3.500 m², seit 1998) ✅, sichtbarer Text und Schema gemeinsam geändert (Preise, Stellen) ✅, NAP an einer
Stelle ✅, keine neue Abhängigkeit ✅, kein Logo ohne Markenfreigabe (VW, Audi) ✅, Bildnummern nicht angefasst ✅,
Sicherheit bei Uploads (Signaturprüfung, Größen, Dateinamen, keine Speicherung) ✅, kein `npm run dev` ✅, UTF-8 ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — `JobPosting` ohne Pflichtfeld `datePosted`** und ohne Straße/PLZ, seit es das Markup gibt. ✅ **fixed** (O1).
2. 🟠 **Hoch — ein dritter überlaufender Titel** („Industriekaufmann/-frau“, +32 px), im Meeting nicht genannt, nur per
   Messung gefunden. ✅ **fixed** (O2).
3. 🟡 **Mittel — Silbentrennung greift nicht bei „…/in“**: Die Überlaufmessung war grün, das Bildschirmfoto zeigte trotzdem
   „Fahrzeugbaumechanik / er/in“. Lehre wie in `docs/waechter/…notwendig-aber-nicht-hinreichend.md`: „läuft nicht über“ ist
   nicht „bricht richtig um“. ✅ **fixed** (O3, weiche Trennstellen + Suche).
4. 🟡 **Mittel — KI-Plaketten an zwei echten Fotos** (Fahrzeugaufbereitung, Leasingrückgabe), sichtbar auf der neuen
   `/leistungen`. Gehört zu 5.9, nicht beauftragt. → O4.
5. 🟢 **Niedrig — zwei unbenutzte Bilder werden ausgeliefert** (`wissensdatenbank-…`, `schadenaufnahme-…`). → O5,
   entschieden: bleiben (wie vom User am 22.09. für `schadenaufnahme-…` festgelegt).
6. 🟢 **Niedrig — Footer-Symbole fast unsichtbar** (bekannt). → O6 mit 5.21.

### Phase 6
**Eingehalten**: jede Messung am frischen Build ✅, Befund → Fix → Nachmessung ✅, Werkzeuggrenzen ausgeglichen (Kontrast je
Element statt vier Scrollpositionen; Überdeckung Plakette ↔ Titel an 96 Streifen × 6 Breiten gemessen) ✅, Desktop nach dem
Mobil-Fix unverändert nachgewiesen (Zeilenhöhe, Ausrichtung) ✅, Bildnummern nur über `npm run bilder`, B30 nicht neu vergeben ✅,
Kennzeichnung nach Art. 50 KI-VO nirgends entfernt ✅, UTF-8 und keine unsichtbaren Zeichen im Quelltext ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — neue Knöpfe unter AA** (3,64–3,87:1): `text-blue-700` ist hier Signalblau. ✅ **fixed** (O7).
2. 🟠 **Hoch — KI-Plakette überdeckt Kartentitel** auf 11 von 96 zugeklappten Mobil-Streifen (vorbestehend, auch
   Startseite). ✅ **fixed** (O8).
3. 🟡 **Mittel — `npm run bilder` bricht** am Vermerk der entfallenen Stelle B30. ✅ **fixed** (O9).
4. 🟡 **Mittel — unsichtbare Zeichen in Bild-Schlüsseln und README-Ortsangaben** durch den Wortverbinder aus 5.25.
   ✅ **fixed** (O11, Normalisierung im Rundgang).
5. 🟢 **Niedrig — Kleinigkeiten** aus der Selbstprüfung des Diffs. ✅ **fixed** (O10).

**Refactoring-Empfehlung:** `docs/schleife-5-umsetzung/tasks/2026-09-27-paket-1-optimierung-tasks.md` — offen bleiben nur
O4 (mit 5.9/5.3) und O6 (mit 5.21), beide an Kundenpunkte gebunden.
