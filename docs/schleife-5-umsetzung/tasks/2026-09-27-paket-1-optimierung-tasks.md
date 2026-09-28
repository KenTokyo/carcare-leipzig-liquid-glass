# Optimierung zu Schleife 5 — Paket 1

**Bezug:** `docs/schleife-5-umsetzung/tasks/2026-09-27-paket-1-tasks.md` (Kommentare)
**Stand:** 2026-09-27

---

### ✅ O1 — `JobPosting` ohne Pflichtfeld `datePosted` (🟠 hoch)
**Befund:** Das Stellen-Markup auf `/karriere` hatte nie `datePosted` — für die Stellenanzeigen bei Google ein
Pflichtfeld —, und die Adresse ohne Straße und PLZ. Aufgefallen, weil 5.26 drei weitere Einträge dazubringt.
* [x] `ausgeschriebenSeit` je Stelle in `data/jobs.ts`, `datePosted` im Schema; Anschrift aus `localBusiness` (NAP an einer Stelle)

### ✅ O2 — Überlauf auch bei „Industriekaufmann/-frau" (🟠 hoch)
**Befund:** Gemeldet war nur der Karosserie-Titel. Die Messung am Build fand einen dritten: +32 px an allen drei Breiten.
* [x] Mit 5.25 behoben — 9 Überläufe → 0

### ✅ O3 — Silbentrennung greift nicht bei „…/in" (🟡 mittel)
**Befund:** Nach dem ersten Fix lief kein Titel mehr über, aber der Notfallumbruch schnitt „Fahrzeugbaumechanik / er/in"
ohne Trennstrich. Die reine Überlaufmessung zeigte das nicht; gefunden am Bildschirmfoto.
* [x] Anzeigetitel mit weichen Trennstellen an den Wortfugen (nur Karten; Schema, Formular, Pop-up behalten `title`)
* [x] Suche: `normalisiere()` entfernt weiche Trennzeichen, Wortverbinder und Nullbreitenleerzeichen — sonst wäre der
      Kartentitel unter „Fahrzeugbaumechaniker" nicht mehr gefunden worden

### ✅ O7 — Neue Knöpfe unter AA-Kontrast (🟠 hoch)
**Befund:** `npm run kontrast` meldete 6 Stellen, alle aus Paket 1: „Ablauf überspringen“ / „Überspringen“ (Startseite, beide
Abläufe, Desktop und mobil) und „Lebenslauf oder Zeugnisse anhängen“ (`/karriere` mobil) — **3,87:1** auf Weiß bzw. **3,64:1** im
grauen Hinweiskasten, Soll 4,5. Ursache: `text-blue-700` ist in diesem Projekt **Signalblau** (`#2F80ED`), nicht das dunkle
Vertrauensblau; die übrigen Pillen der Seite tragen `text-blue-600`. Dieselbe Klasse stand auch an den Ratgeber-Pillen der
Startseite — die hat der Messer nicht gesehen, weil er je Route nur vier Scrollpositionen aufnimmt (Falle 2 in seinem Kopf).
* [x] Alle vier Stellen auf `text-blue-600` (Vertrauensblau), Hover über `bg-blue-50` statt Farbwechsel; `text-blue-700` kommt in
      `components/` und `pages/` nicht mehr vor
* [x] Nachgemessen am neuen Build: `npm run kontrast` **0 Stellen unter AA** (5.436 Textstellen, 29 Routen); gezielte Messung
      jedes neuen Elements an 1440 und 390 px (Aufnahme ohne Text, Textfarbe rechnerisch): Pillen, Überspringen, Anhang
      **9,61–10,04:1**, Beschriftung „Ratgeber“ **6,74–6,89:1**. Dabei auch der Sprung beider Überspringen-Knöpfe der
      Startseite: → `#zielgruppen` bzw. `#faq`, Oberkante 88 px, Fokus dort — Desktop und mobil
* **Lehre:** Der Kontrastmesser ist notwendig, nicht hinreichend (Falle 2) — neue Bedienelemente einzeln anfahren.

### ✅ O8 — KI-Plakette überdeckt Titel auf zugeklappten Mobil-Karten (🟠 hoch, vorbestehend)
**Befund:** Auf dem Bildschirmfoto von `/karriere` (390 px) lag „KI-generiert“ über „…-FRAU“. Gemessen an allen zugeklappten
Karten von `ExpandingCardAccordion` (Startseite: Leistungen + Aufbereitung, `/karriere`) bei 360–1023 px: **11 von 96**
Streifen mit überdecktem Titel, bis 36 × 8 px („Autoglas / Scheibenfolien“, „Hagelschadenreparatur“, „Industriekaufmann/-frau“).
Ursache: Titel mittig im 64 px hohen Streifen, Plakette oben rechts — bei langen Titeln kreuzen sie sich.
**Lösungswege:** (a) Plakette auf zugeklappten Mobil-Streifen weglassen — verworfen, die Kennzeichnung (Art. 50 KI-VO) muss
sichtbar bleiben, solange das Bild sichtbar ist · (b) Titel mit Innenabstand um die Plakette — lange Titel würden dreizeilig
· (c) ✔ Titel mobil an den unteren Rand (dunklerer Teil des Verlaufs), Plakette auf dem Streifen 4 px höher
* [x] `ExpandingCardAccordion`: Titel mobil `items-end pb-2.5 leading-tight`, ab `lg` unverändert (mittig, senkrecht, Zeilenhöhe
      1,5 — am Build geprüft); Plakette zugeklappt `top-2`, aufgeklappt wie bisher `top-3`
* [x] Nachgemessen: **0 von 96** überdeckt, Abstand an allen 11 vorher betroffenen Streifen 10 px; Bildschirmfotos 360 px

### ✅ O9 — Meeting-Vermerk auf entfallener Bildstelle bricht `npm run bilder` (🟡 mittel)
**Befund:** Mit der Wissens-Karte (5.17) ist ihre Bildstelle **B30** entfallen — richtig so, die Nummer wird nie neu vergeben.
In `docs/bilder/motive.json` stand aber noch der Vermerk vom 25.09. („5.17: Karte wird per SEO-Check geprüft, entfällt evtl.“),
und das Inventar bricht bei Vermerken auf unbekannten Nummern mit Exit 1 ab.
* [x] Vermerk entfernt (erledigt durch 5.17); Dateieintrag `wissensdatenbank-…` auf „seit 27.09. ohne Verwendung“ fortgeschrieben
* [x] `npm run bilder` am neuen Build erneut gelaufen (Ergebnis in Phase 6 der Planung)

### ✅ O10 — Kleinigkeiten aus der Selbstprüfung des Diffs (🟢 niedrig)
* [x] „Entfernen“ im Anhangfeld 40 → **48 px** Klickziel (SEO-GEO §2.3), Zeile dafür mit weniger Innenabstand
* [x] Größenangabe „3,0 MB“ → „3 MB“ (Nachkommastelle nur, wo sie etwas sagt)
* [x] Wortverbinder im Kartentitel als Escape `'\u2060'` statt als unsichtbares Zeichen im Quelltext — sonst löscht ihn
      der nächste, der die Zeile bearbeitet, ohne es zu merken

### ✅ O11 — Unsichtbare Zeichen in Bild-Schlüsseln und README-Ortsangaben (🟡 mittel)
**Befund:** Nach 5.25 meldete `npm run bilder` 21 Stellen als „umbenannt“ (B9–B18, B27–B29, B103–B109, B112) — die Nummern
blieben, aber in `nummern.json` standen danach 42 Wortverbinder (U+2060) und 8 weiche Trennzeichen (U+00AD) in Schlüsseln und
Ortsangaben, 25 davon im README („Karte „Fahrzeugaufbereitung““ sieht gleich aus, wird von einer Textsuche aber nicht mehr
gefunden). Ursache: Der Rundgang liest den Kartentitel per `textContent` — samt der unsichtbaren Trennhilfen.
* [x] `scripts/lib/bilder-rundgang.mjs`: `text()` entfernt U+00AD, U+2060 und U+200B wie `normalisiere()` in der Suche
* [x] Inventar neu erzeugt: Schlüssel wieder wie vor Paket 1, 0 unsichtbare Zeichen in `docs/bilder/` (Ergebnis in Phase 6)
* **Was besteht diese Prüfung, ohne in Ordnung zu sein?** Der Rundgang meldete „umbenannt (Nummer behalten)“ — korrekt
  und grün. Dass der neue Name sich nur durch ein unsichtbares Zeichen unterschied, sagte er nicht; gefunden im Git-Diff.

### ⬜ O4 — KI-Plaketten an echten Fotos (🟡 mittel)
**Befund:** Auf `/leistungen` und der Startseite tragen Fahrzeugaufbereitung und Leasingrückgabe noch „KI-generiert",
obwohl beide laut Meeting echte Fotos sind. Das ist 5.9 — nicht in Paket 1 beauftragt.
* [ ] Mit 5.9 (Herkunft eintragen) und 5.3 (Plakette dezenter) als nächstes Paket

### ✅ O5 — Ausgelieferte, aber unbenutzte Bilder (🟢 niedrig) — entschieden: bleiben
**Befund:** `kacheln/wissensdatenbank-leipzig-carcare.webp` (seit 5.17) und `kacheln/schadenaufnahme-leipzig-carcare.webp`
(seit 21.09.) liegen in `public/` und werden mit ausgeliefert, ohne irgendwo zu stehen (`npm run bilder`, „unbenutzt").
* [x] Beide bleiben im Bestand: Für `schadenaufnahme-…` hat der User das am 22.09. so entschieden (`motive.json`), für
      `wissensdatenbank-…` (Kundenmotiv) gilt dasselbe — Kandidat für den Wissensbereich (3.22). Nichts gelöscht.

### ⬜ O6 — Footer-Symbole kaum sichtbar (🟢 niedrig)
**Befund:** Auf dem Bildschirmfoto der Fußzeile sind die Symbole vor Adresse, Telefon und E-Mail fast unsichtbar
(bekannt als „Footer-Icons 1,00:1" im konsolidierten Backlog).
* [ ] Mit 5.21 (Fußzeile verkleinern) entscheiden

---

## Kommentare

**Eingehalten**: Befund je Punkt mit Messwert oder Bildschirmfoto belegt ✅, Seiten- und Datenänderungen gemeinsam
(sichtbar + Schema) ✅, NAP an einer Stelle ✅, keine neue Abhängigkeit ✅, UTF-8 ✅

**Offen nach diesem Plan:** O4 (Paket mit 5.9/5.3), O6 (mit 5.21) — beide an Kundenpunkte gebunden.
