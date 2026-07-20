# Schriftumstellung: Inter → Space Grotesk (self-hosted), inkl. Layout-Bruchprüfung

> **Ziel (User, 2026-07-20):** Die **gesamte** Schrift auf Desktop **und** Mobile auf „Space Grotesk"
> umstellen. Ausdrücklich: „Wenn irgendwo dadurch Brüche in den Textboxen entstehen, erwarte ich von
> dir, dass du das anpasst."

## Ausgangslage

* Schrift war **Inter**, geladen per **Google-Fonts-CDN** (`index.html`), `font-family` in
  `index.css` + `tailwind.config.js`.
* 167 Nutzungen von `font-*`-Gewichtsklassen über 28 Dateien, davon **3× `font-extrabold` (800)`.

## Entscheidung: self-hosted statt CDN

Space Grotesk wird **selbst gehostet**, nicht über den Font-CDN geladen. Gründe:
1. **SEO-GEO-STANDARDS §2.2** nennt „self-hosted oder vorab geladen" ausdrücklich.
2. **DSGVO:** Ein CDN-Abruf überträgt die Nutzer-IP an den Anbieter — für eine deutsche Firmenseite
   ein reales Risiko (LG München I, 20.01.2022, Az. 3 O 17493/20).
3. **LCP:** ein Drittanbieter-Handshake (DNS + TLS) weniger vor dem größten Bildaufbau.

Space Grotesk steht unter der **OFL-1.1** — Weiterverbreitung ist erlaubt, die Lizenz liegt bei
(`public/assets/fonts/OFL.txt`).

---

## Phasen

### ✅ Phase 1 — Schrift beschaffen & einbinden
* [x] **Variable Font** (ein File deckt 300–700) als WOFF2 geladen, Subsets `latin` + `latin-ext`
      (Vietnamese bewusst weggelassen): **21,8 KB + 18,5 KB = 40,3 KB**
* [x] `OFL.txt` mit ausgeliefert (Pflicht beim Selbsthosten)
* [x] `@font-face` in `index.css` inkl. `unicode-range` je Subset und `font-display: swap`
* [x] `font-family` in `index.css` (`body`) und `tailwind.config.js` (`fontFamily.sans`) umgestellt
* [x] Google-Fonts-`<link>` + beide `preconnect` aus `index.html` entfernt
* [x] Stattdessen `<link rel="preload">` auf den Latin-Schnitt (LCP)
* [x] **Kein 800er in Space Grotesk:** die 3 `font-extrabold` in `Navbar.tsx` auf `font-bold`
      gesetzt. Der Browser hätte ohnehin auf 700 geklemmt — jetzt sagt der Code, was passiert.
**Referenzen:** `index.css`, `index.html`, `tailwind.config.js`

### ✅ Phase 2 — Brüche suchen (mit Baseline, nicht auf Verdacht)
**Methode:** Zwei Messläufe über **20 echte Routen × 3 Breakpoints** — einmal mit Space Grotesk,
einmal mit per CSS injizierter Inter-Baseline. Nur die **Differenz** ist eine echte Regression;
Fehlalarme des Detektors treten in beiden Läufen auf und kürzen sich heraus.

* [x] ⚠️ **Erster Anlauf war wertlos:** Audit ohne Baseline meldete 97 „Befunde" — grösstenteils
      Fehlalarme (bewusst überformatige Bild-Ebenen). Ohne Vergleichswert sagt so ein Lauf nichts.
* [x] ⚠️ **Zweiter Anlauf war zu streng:** verfeinerter Detektor filterte jedes `div` mit SVG darin
      → 0/0 Treffer. Zu gut, um wahr zu sein. Konsequenz: Detektor muss nicht *präzise*, sondern
      **konsistent** sein.
* [x] ⚠️ **Routenliste war falsch:** `/unfallinstandsetzung` etc. existieren nicht — die echten
      Routen tragen den Suffix `-leipzig`. Mehrere „geprüfte" Seiten waren in Wahrheit die
      404-Seite. Korrigiert gegen `scripts/prerender.mjs`.
* [x] Ergebnis nach Korrektur: **0 neue Überlauf-/Clipping-Stellen** durch die Schrift,
      **1 Stelle sogar behoben**
* [x] Zusätzlich Zeilenumbruch-Diff (Elementhöhen Inter vs. Space Grotesk): 32 Elemente brechen
      eine Zeile länger um — ausschließlich Fließtext/Listen, deren Container mitwachsen
**Referenzen:** `components/Footer.tsx`

### ✅ Phase 3 — Gefundene Brüche beheben
* [x] **Echte Regression (durch die Schrift):** `info@carcare-center.de` im Footer brach ab ~1440 px
      mitten in der Domain um („carcare-" / „center.de") — auf **allen** Seiten. Space Grotesk
      braucht 163 px, verfügbar sind 159 px. Behoben mit `tracking-tight` auf genau diesem String
      (156 px). Bewusst das Letterspacing statt der Schriftgröße: hält 14 px konsistent zu Telefon
      und Fax daneben. Bei ≤1280 px bricht die Adresse weiterhin um — **das tat sie mit Inter auch**
      (vorbestehend, Spalte ist schlicht 1/6 breit).
* [x] **Vorbestehender Bruch (nicht von der Schrift, trotzdem gefixt):** In `TargetGroupCards`
      presste `md:grid-cols-3` drei Karten auf je ~221 px; die Textbox darf davon 60 % nutzen →
      abzüglich Padding blieben **~85 px** Textbreite. Folge: Beschreibung und CTA liefen aus der
      weissen Box aufs Bild, Wörter wurden abgeschnitten, der Pfeil-Button rutschte aus der
      `overflow-hidden`-Kachel (gemessen: `right` 277 px bei 221 px Kartenbreite).
      Behoben durch **`md:grid-cols-2 lg:grid-cols-3`** (~350 px statt 221 px pro Karte) plus
      **`[hyphens:auto]`** auf der Textbox — die langen deutschen Komposita
      („Fahrzeugdienstleistungen", „Geschäftskundenservice") sind als EIN Wort breiter als die Box.
* [x] ⚠️ **Erster Fix-Versuch war falsch und wurde zurückgenommen:** `min-w-0 break-words` auf dem
      CTA zerhackte den Text buchstabenweise („GES CHÄ FTS KUN DEN"). `break-words` bricht an
      beliebiger Stelle; für deutsche Komposita ist **`hyphens:auto`** (greift über `<html lang="de">`)
      die richtige Wahl, weil es an Silbengrenzen trennt.
**Referenzen:** `components/TargetGroupCards.tsx`, `components/Footer.tsx`

### ✅ Phase 4 — Verifikation
* [x] Schrift lädt und rendert: `Space Grotesk 300 700 loaded`, `font-weight: 700` auf der H1
* [x] **Keine Fremd-Requests in Produktion:** Build-Output auf Font-CDN-Referenzen geprüft →
      0 Treffer (der einzige Fund war der eigene HTML-Kommentar; Kommentar deshalb umformuliert,
      damit er künftige Audit-Greps nicht wieder fehlalarmiert)
* [x] Der in DEV sichtbare Google-Request für „Geist" stammt aus **`react-grab`** (Dev-Tool,
      `node_modules`) und ist über `import.meta.env.DEV` gegated — in Produktion nicht vorhanden
* [x] `npm run build` inkl. Prerender: **20/20 Routen** als statisches HTML
* [x] `tsc --noEmit` → Exit 0
* [x] Visuell geprüft (Puppeteer): Hero Desktop/Tablet/Mobil, Zielgruppen-Sektion bei 768/1024/1440
**Referenzen:** `index.css`, `index.html`

---

## Kommentare

### Phase 1–4 (Space Grotesk)
**Eingehalten:** Regression gegen **Baseline** gemessen statt auf Verdacht ✅, eigene Messfehler
erkannt und korrigiert statt Ergebnisse geschönt ✅, self-hosted nach §2.2 ✅, OFL-Lizenz beigelegt ✅,
`font-display: swap` + Preload ✅, Variable Font statt Schnitt-Zoo (40 KB gesamt) ✅, Mobile-First
unverändert ✅, Encoding sauber ✅, < 700 Zeilen/Datei ✅, `tsc` grün ✅, Produktions-Build grün ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (behoben):** Zielgruppen-Kacheln waren bei 768–1024 px **sichtbar kaputt** (Text aus der
   Box, Pfeil abgeschnitten). Vorbestehend, unabhängig von der Schrift — fiel nur auf, weil der
   Font-Diff die Stelle markierte. Zeigt: Der Bruch war schon vorher live.
2. 🟡 **Mittel (behoben):** Footer-Mail brach durch die breitere Schrift site-weit um.
3. 🟡 **Mittel (Methodik, dokumentiert):** Drei Messläufe waren fehlerhaft (keine Baseline / zu
   strenger Filter / falsche Routen). Lehre: Ein Audit ohne Vergleichswert ist wertlos, und die
   Routenliste gehört gegen `scripts/prerender.mjs` geprüft, nicht geraten.
4. 🟢 **Niedrig (offen, bewusst nicht geändert):** Der CTA „Geschäftskundenservice ansehen" braucht
   288 px auf einer Zeile und passt in **keiner** Kachelbreite ausser der einspaltigen Mobilansicht.
   Er wird jetzt sauber getrennt umbrochen. Kürzere Copy (z. B. „Für Geschäftskunden", analog zu
   Kachel 1) wäre die schönere Lösung — das ist aber eine **Content-Entscheidung des Users**.
5. 🟢 **Niedrig (kein Fehler):** Die 9 Leistungskarten zeigen konstant 18 px Überlauf — das ist der
   gewollte `scale`-Hover-Zoom des Bildes, der von `overflow-hidden` geclippt wird. Nicht anfassen.

**Hauptkomponenten (max. 3):** `index.css` (`@font-face` + `font-family`),
`components/TargetGroupCards.tsx` (Grid + Silbentrennung), `components/Footer.tsx` (Mail-Tracking).

**Fazit:** Schrift site-weit auf Space Grotesk, self-hosted, 40 KB, ohne Fremd-Requests in
Produktion. **Null neue Layout-Brüche** (gegen Inter-Baseline über 20 Routen × 3 Breakpoints
gemessen); die eine Regression im Footer ist behoben, ein vorbestehender Bruch gleich mit.
