# Bildinventar — jede Bildstelle der Website mit fester Nummer

**Angelegt:** 2026-09-18 · **Branch:** `2026-09-18-bilder-inventar`
**Auslöser:** Gespräch des Users mit André über Bilder, die angepasst werden sollen. Gewünscht
ist eine Tabelle mit den Spalten **Ort des Bildes · Dateiname · Datum der Anpassung**, über die
der User künftig sagen kann, welche Bilder genau zu ändern sind.

**Ergebnis:** [`docs/bilder/README.md`](../README.md) — erzeugt von `npm run bilder`.

---

## Rohprompt → Zielprompt (intern geschärft)

> Erstelle ein vollständiges, gemessenes Inventar aller Bildstellen der ausgelieferten Website
> (nicht der Dateien im Ordner): je Stelle eine **feste, nie neu vergebene Nummer**, der Ort in
> Worten, die man auf der Seite wiederfindet (Seite › Sektion › Karte), der Dateiname und das
> Datum der letzten Änderung aus Git. Zeige, welche Datei an mehreren Stellen steht (ein Tausch
> ändert alle), wo Fotos fehlen (Platzhalter) und welche offenen Backlog-Punkte ein Bild
> betreffen. Wiederholbar per Skript, damit das Datum nach jedem Tausch stimmt.

**Rolle:** Web-Engineer mit Blick für Redaktion und Recht (Bildherkunft, KI-VO Art. 50).

## Lösungswege abgewogen

| Weg | Pro | Contra | Entscheidung |
|---|---|---|---|
| A · Tabelle von Hand aus dem Code | schnell | ~110 Zeilen fehleranfällig, veraltet beim ersten Bildtausch, Datum von Hand | ❌ |
| B · Statische Code-Analyse (Import-Graph) | ohne Browser | Bilder laufen über Datendateien und geteilte Komponenten auf viele Seiten; Sektions- und Kartennamen stehen erst im gerenderten DOM | ❌ allein zu blind |
| C · **Rundgang im Browser über alle Routen** (Desktop + Smartphone) **plus** Abgleich mit Dateisystem und Code | misst, was ausgeliefert wird; Namen aus den echten Überschriften | braucht `dist/` | ✅ **gewählt**, B und Dateiliste als Gegenprobe |

**Feste Nummern:** Laut Projektgedächtnis nutzt der User Nummern als Absprache („mach 3 und 4“),
sie dürfen nicht stillschweigend umsortiert werden. Deshalb Register `docs/bilder/nummern.json`:
Eine Stelle behält ihre Nummer, auch wenn das Bild getauscht wird. Neue Stellen bekommen die
nächste freie Nummer, entfallene werden als entfallen geführt und **nie neu vergeben**.
Präfix `B` (Bild), damit keine Verwechslung mit Backlog-Nummern `x.y` oder Repo-Befunden `R<n>`.

---

### ✅ Phase 1 — Bestandsaufnahme
**Ziel:** Wissen, was es gibt, wo es steht und was schon offen ist.
* [x] 41 Mediendateien unter `public/assets/` (30 Fotos/Standbilder, 4 Videos, 7 Grafiken/Logos) mit Git-Datum erfasst
* [x] Einbindung im Code: Kacheln laufen über `data/services.ts`, `data/jobs.ts`, `data/detailing.ts`, `data/videos.ts` und Komponenten-Konstanten auf viele Seiten
* [x] Erkundungsrundgang 29 Routen × 2 Breiten (1440 / 390 px), jede Bildverwendung mit DOM-Umfeld protokolliert: Sektionen haben stabile IDs, Karten ein `h3`
* [x] Alle Motive angesehen (für die Spalte „Motiv“; André beschreibt Bilder nach Inhalt, nicht nach Dateinamen)
* [x] Offene Bildpunkte im Backlog zusammengetragen: 4.1, 2.14/R2, 2.15/3.29, 2.16, 2.20, 2.21/3.4, 3.8, 3.10, 3.11, 3.23–3.28, 2.2/3.6, 4.14, R7
* [x] Skill `ki-bildkennzeichnung` geladen: Herkunft je Bild wird **nicht geraten**, sondern beim User/André erfragt
**Referenzen:**
`docs/schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md`
`docs/backlog/offene-punkte-konsolidiert.md`
`scripts/routes.mjs`

### ✅ Phase 2 — Generator `npm run bilder`
**Ziel:** Tabelle aus dem ausgelieferten Stand erzeugen, reproduzierbar.
* [x] `scripts/bilder-inventar.mjs` (531 Zeilen) + `scripts/lib/bilder-rundgang.mjs` (128) + `scripts/lib/bilder-kontaktbogen.mjs` (83), alle unter 700
* [x] Rundgang über alle 29 Routen aus `scripts/routes.mjs`, je 1440 px und 390 px, mit `--force-prefers-no-reduced-motion` (Projektgedächtnis: Headless meldet sonst reduzierte Bewegung)
* [x] Ortsbestimmung aus dem DOM: Seite › Sektion (h1/h2) › Gruppe › Karte (h3). Gruppe greift z. B. auf `/karriere`: „Vier Gewerke …“ › „Ausbildung im Betrieb“ › Karte „Industriekaufmann/-frau“
* [x] `<picture>` liefert die tatsächlich gewählte Quelle (`currentSrc`), daher Titelbild der Startseite getrennt nach Desktop und Smartphone
* [x] Sektionshintergründe, die das Bild der aktiven Karte spiegeln: keine eigene Zeile, Hinweis unter der Seite (Startseite 4 Sektionen, Karriere 1)
* [x] Kopfbilder erfasst: Vorschaubild beim Teilen (B4), JSON-LD `LocalBusiness.image` (B5) und `AutoRepair.image` (B6), Ladebildschirm (B1/B2), Fußzeile (B3)
* [x] `components/DetailingGallery.tsx`: `data-bild-platzhalter` am Platzhalter und `id="einblicke"` an der Sektion. Ergebnis: 11 Platzhalter B48–B58 („Foto fehlt“)
* [x] Register `docs/bilder/nummern.json`, Motiv/Herkunft/offene Punkte aus `docs/bilder/motive.json` (von Hand, nur mit Beleg)
* [x] Datum aus Git, nicht committete Dateien werden als solche ausgewiesen; Maße und Größe je Datei aus `sharp`
* [x] Ausgabe `docs/bilder/README.md` (Nach Seite · Nach Datei mit Vorschau · Platzhalter · Grafiken · Gegenprobe) und `output/bilder/bilder-uebersicht.html` (Vorschau je Stelle, Suchfeld, eigenständig)
* [x] `npm run bilder` in `package.json`
**Ergebnis:** 100 Bildstellen aus 30 Dateien auf 17 Seiten + 11 Platzhalter = **B1–B111**.
**Referenzen:**
`scripts/bilder-inventar.mjs`
`scripts/lib/bilder-rundgang.mjs`
`docs/bilder/motive.json`

### ✅ Phase 3 — Gegenprobe
**Ziel:** Beweisen, dass nichts fehlt — nicht nur, dass etwas gefunden wurde.
* [x] 29 von 29 Routen besucht, jede mit gerenderter h1 (sonst Abbruch statt leerer Seite)
* [x] 41 Dateien unter `public/assets/` (ohne Schriften): 38 gesehen, 1 nur im Code (`carcare-hero-workshop.webp` als Ersatzbild), 2 unbenutzt
* [x] Bildpfade im Quellcode ohne Kommentare gegengeprüft: nicht gesehen nur das Ersatzbild und das Unsplash-Foto im toten `components/Hero.tsx`
* [x] Zuordnung Karte → Datei gegen die Datenquellen geprüft (`data/services.ts`, `data/jobs.ts`, `data/detailing.ts`, `AccidentDamageSection`, `DetailingProcessSection`, `TargetGroupCards`): alle Kartenfotos stimmen
* [x] Nummern stabil: zweiter Lauf 111 von 111 Nummern gleich
* [x] Umbenennung simuliert (Titel von B12 geändert): „umbenannt, Nummer behalten: B12“ ✅
* [x] Verschwundene Stelle simuliert: als „B112 entfallen“ gelistet, `naechste` bleibt 113, Nummer wird nicht neu vergeben ✅. Register danach zurückgespielt
* [x] Veraltetes `dist/` wird erkannt: Nach den Favicon-Änderungen an `index.html` und `public/assets/` brach `npm run bilder` mit Exit 1 ab („dist/ … ist aelter als Quellcode/Bilder … Zuerst `npm run build`“)
* [x] Pflichtfrage „Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?“ im Skriptkopf beantwortet (7 Punkte)
**Referenzen:**
`docs/bilder/README.md`
`docs/bilder/nummern.json`

### ✅ Phase 4 — Doku
* [x] `CLAUDE.md` → Messwerkzeuge: `npm run bilder`; Abschnitt Backlog: Bildnummern `B<n>` sind Absprachen, nur das Skript vergibt sie
* [x] Projektgedächtnis `bildnummern-inventar.md` + Index
* [x] Backlog `offene-punkte-konsolidiert.md`: **R15** (KI-Herkunft, Art. 50 KI-VO) und **R16** (Kennzeichen im Karriere-Video, Einwilligungen der gezeigten Mitarbeitenden), Zählungen nachgezogen
* [x] Optimierungsplan: [`2026-09-18-bilder-inventar-optimierung-tasks.md`](2026-09-18-bilder-inventar-optimierung-tasks.md)
**Referenzen:**
`CLAUDE.md`
`docs/backlog/offene-punkte-konsolidiert.md`

---

## Kommentare

### Phase 1
**Eingehalten**: Planung vor Code ✅, drei Lösungswege abgewogen ✅, Backlog statt Gedächtnis als Quelle ✅, Herkunft nicht geraten (Skill `ki-bildkennzeichnung`) ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Für kein Foto ist dokumentiert, ob KI beteiligt war. Der Backlog nennt selbst ein „KI-Bild“ (2.15). Art. 50 KI-VO gilt seit 02.08.2026 → **R15**
2. 🟠 **Hoch:** Vorschaubild beim Teilen und Unternehmensbild im JSON-LD sind ein Unsplash-Stockfoto → bekannt als **R7**
3. 🟢 **Niedrig:** 2.15 („KI-Bild ersetzen – kein Transporter“) ist vielleicht schon erledigt: Das heutige Motiv ist ein Kundenmotiv mit Ferrari

### Phase 2
**Eingehalten**: unter 700 Zeilen je Datei ✅ (531 / 128 / 83), Messen statt Schätzen ✅, `vite preview` statt Dev-Server ✅, Mobile und Desktop ✅, kein Mojibake (UTF-8, deutsche Anführungszeichen geprüft) ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel:** Erste Fassung 657 Zeilen in einer Datei, knapp an der Grenze → Rundgang und Kontaktbogen in `scripts/lib/` ausgelagert
2. 🟢 **Niedrig:** Beispielpfade in Code-Kommentaren („z. B. `/assets/galerie/innenraum.jpg`“) wären als Verwendung gezählt worden → Kommentare vor der Gegenprobe entfernt, `//` nur nach Trennzeichen (sonst bräche `https://`)
3. 🟢 **Niedrig:** Kürzung mitten im Wort („… Abst…“) → Kürzung an Wortgrenzen

### Phase 3
**Eingehalten**: Soll/Ist statt „nichts gefunden“ ✅, Sonderfälle der Nummernvergabe simuliert ✅, Register nach dem Test zurückgespielt ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Kennzeichen eines Kundenfahrzeugs im Karriere-Video lesbar, Mitarbeitende erkennbar → **R16**, Optimierung O1
2. 🟡 **Mittel:** Favicon nicht quadratisch → O4
3. 🟢 **Niedrig:** zwei unbenutzte Dateien, zwei bekannte Fälle, die bei jedem Lauf „bitte prüfen“ riefen → O5, O6
4. 🟢 **Niedrig (eigener Fehler, korrigiert):** In R16 stand zunächst „alle drei Videos zeigen Mitarbeitende“, geprüft war nur eines. Nachgesehen: Karriere- und Rundgang-Video ja, Über-uns-Video nur klein im Hintergrund. Text korrigiert

### Phase 4
**Eingehalten**: R-Nummern statt eigener x.y-Nummern ✅, Zählungen im Backlog nachgezogen ✅, `Hero.tsx` bleibt laut Vorgabe unangetastet ✅ (fast gelöscht, erst die Vorgabe in `offene-punkte-konsolidiert.md` hat es verhindert)
