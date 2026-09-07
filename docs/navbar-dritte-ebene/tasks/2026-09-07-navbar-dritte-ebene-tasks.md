# Navbar: dritte Ebene im Mega-Menü

**Angelegt:** 2026-09-07
**Auslöser:** Kundenwunsch in der Sitzung — „Wenn man auf die einzelnen Punkte klickt
und ein Untermenü bekommt, sieht man nicht, was alles darunter gehört. Ich möchte, dass
zu dem Untermenü noch ein weiteres Untermenü entsteht, wenn man über einen Punkt hovert."

---

## Das Problem in einem Satz

Das Mega-Menü zeigt vier Karten, die auf Hub-Seiten führen — dass unter
„Fahrzeugaufbereitung" noch Innen-, Außenaufbereitung und Leasingrückgabe liegen, ist
im Menü nicht sichtbar. Zwei Leistungen (Felgenreparatur, Autoglas) sind über die
Navigation **überhaupt nicht** erreichbar.

## Entschieden vor dem Bau

**Aufbau nach Katalog-Gruppen** (vom Kunden am 2026-09-07 gewählt). Die vier Karten
spiegeln die vier Gruppen aus `data/services.ts` statt einer eigenen Liste:

| Karte (= Gruppe) | Ziel der Karte | Kinder |
|---|---|---|
| Fahrzeugaufbereitung | `/fahrzeugaufbereitung-leipzig` | Innenaufbereitung, Außenaufbereitung, Leasingrückgabe |
| Unfall & Lack | `/unfallinstandsetzung-leipzig` | Autolackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur |
| Rad & Glas | `/leistungen#rad-glas` *(kein Hub vorhanden)* | Felgenreparatur, Autoglas |
| Geschäftskunden | `/geschaeftskunden` | Fuhrparkservice |

Darunter eine schmale Zeile **„Für wen?"** mit Privatkunden und Geschäftskunden — die
beiden Zielgruppenseiten sind keine Leistungsgruppe und hätten als Karte kein Untermenü.

## Warum die Kinder *unter* der Karte aufklappen und nicht seitlich

Drei Wege standen zur Wahl:

1. **Flyout rechts neben der Karte.** Verworfen: Bei der rechten Spalte liefe es aus dem
   Panel heraus, und der diagonale Mausweg zum Flyout kreuzt die Nachbarkarte — das ist
   genau das Problem, gegen das man sonst ein „Safe Triangle" bauen muss.
2. **Master-Detail** (Karten links, Kinderliste rechts). Sauber, aber ein kompletter
   Umbau des Panels und die Zuordnung Karte→Liste ist optisch schwächer.
3. **Gewählt: Die Kinder klappen in der eigenen Spalte direkt unter der Karte auf.**
   Der Bereich grenzt lückenlos an die Karte an — der Mauszeiger fährt geradeaus nach
   unten, kreuzt nichts. Damit erübrigt sich die Safe-Triangle-Mechanik ersatzlos, statt
   sie nachzubauen. Das Panel animiert seine Höhe mit.

## Barrierefreiheit — verbindlich

Recherchiert am 2026-09-07, Quellen unten. **Hover allein reicht nicht:**

* **WCAG 1.4.13** (Content on Hover or Focus): Der aufgeklappte Bereich muss
  *dismissible* (Escape), *hoverable* (mit der Maus erreichbar, ohne dass er zuklappt)
  und *persistent* (bleibt bis zum Verlassen) sein.
* **Tastatur:** Fokus auf der Karte öffnet die Ebene ebenfalls. Escape schließt.
  Reines Hover-Öffnen schließt Tastaturnutzer aus.
* **Fokus darf nie auf Unsichtbarem landen.** Die Kinder stehen deshalb nur im DOM,
  wenn ihre Ebene offen ist — nicht per `opacity: 0` versteckt.
* `aria-expanded` und `aria-controls` auf der Karte.

## Mobil

Auf Touch gibt es kein Hover. Das mobile Menü bekommt **keine** dritte Interaktionsebene,
sondern zeigt die Kinder als eingerückte Liste unter ihrer Gruppe — dort ist die Frage
„was gehört darunter?" damit sofort beantwortet, ohne eine Geste zu erfordern.

---

## Phasen

### ✅ Phase 1 — Navigationsbaum aus dem Leistungskatalog ableiten
**Ziel:** Eine Quelle statt zwei. Das Menü führt keine eigene Leistungsliste mehr.
* [x] `data/navigation.ts` (154 Zeilen) baut den Baum aus `serviceGroups` + `servicesByGroup()`
* [x] `data/services.ts`: `groupHub` je Gruppe markiert (Aufbereitung, Unfall, Geschäftskunden)
* [x] `data/services.ts`: `navLabel`, `navDescription`, `navIconName` je Gruppe — `eyebrow`/`title`
      sind für eine Seitensektion geschrieben und brechen in einer Menükarte um
* [x] Gruppe ohne Hub (`rad-glas`) fällt auf `/leistungen#rad-glas` zurück
* [x] Unbekannter Iconname wirft beim Laden, statt still ein leeres Feld zu rendern

### ✅ Phase 2 — Dritte Ebene auf dem Desktop
* [x] `NavMegaMenu.tsx`: Unterebene klappt in der eigenen Spalte unter der Karte auf
* [x] Öffnen per Hover **und** Fokus, Schließen per Mausaustritt und Escape
* [x] Escape in zwei Stufen: erst die dritte Ebene, dann das Menü
* [x] Nur eine Ebene gleichzeitig; 120 ms Verzögerung gegen Flackern im Spaltenabstand
* [x] Unterpunkte stehen nur im DOM, wenn ihre Ebene offen ist
* [x] `aria-haspopup`, `aria-expanded`, `aria-controls` gesetzt

### ✅ Phase 3 — „Für wen?"-Zeile
* [x] Privatkunden und Geschäftskunden als Pillen unter den Karten, Desktop und mobil

### ✅ Phase 4 — Mobiles Menü nachgezogen
* [x] Verschachtelte Liste statt flacher Aufzählung, ohne Geste sichtbar

### ✅ Phase 5 — Prüfen und ausliefern
* [x] `scripts/check-navigation.mjs` + `npm run nav`: 16 Prüfungen, alle grün
* [x] Bildschirmfotos in `output/nav-shots/` (Desktop Ebene 3, Tastaturfokus, mobil)
* [x] `npm run build` grün, `npx tsc --noEmit` grün
* [x] Drei Befunde unterwegs gefunden und behoben — siehe Kommentare

---

## Kommentare

### Phasen 1–5
**Eingehalten:** unter 700 Zeilen ✅ (Navbar 371, NavMegaMenu 268, navigation.ts 154,
check-navigation.mjs 205) · Mobile-First ✅ · Single Source ✅ · CSS-nativ vor JS ✅
(die Unterebene grenzt an ihre Karte, statt eine Safe-Triangle-Mechanik zu bauen) ·
Pflichtfrage zum neuen Wächter beantwortet ✅ · Recherche vor der Umsetzung ✅
(WCAG 1.4.13, Adobe Accessible Mega Menu, Safe-Triangle-Muster) · kein Mojibake ✅

**Auffälligkeiten (nach Schwere):**

1. 🔴 **Kritisch, Bestandsfehler — behoben.** Der Hamburger öffnete das mobile Menü und
   schloss es sofort wieder. Ursache: Der Tipp trifft das `path` im SVG; React tauscht
   beim Öffnen das Icon `Menu` gegen `X`, das getroffene Element verschwindet **mitten in
   der Ereignisausbreitung**. Erreicht derselbe Klick danach `document`, ist `target`
   losgelöst, `navbarRef.contains()` meldet false, und der Außenklick-Wächter schließt das
   gerade geöffnete Menü. Ein Tipp auf die Polsterung neben dem Icon funktionierte —
   deshalb wirkte es wie ein Wackelkontakt statt wie ein Fehler.
   Gemessenes Protokoll: 14 ms Klick an `document` (verbunden), 24 ms Menü offen +
   Klick erneut an `document` (losgelöst), 28 ms Menü wieder zu.
   **Fix:** `if (!target.isConnected) return;` — ein Ziel, das das eigene Neuzeichnen
   entfernt hat, kann nicht „außerhalb" sein. `components/Navbar.tsx`.

2. 🟠 **Hoch — behoben.** Tab vom geöffneten Trigger sprang zum nächsten Menüpunkt
   („Wissen"), nicht in das Panel: Das Panel steht im DOM hinter beiden `<nav>`-Blöcken,
   weil es sich an der vollen Navbar-Breite ausrichtet. Wer mit der Tastatur öffnete, sah
   die Inhalte nie. **Fix:** Tab-Umleitung über `NAV_MEGA_PANEL_ID`, Gegenrichtung
   (Shift+Tab aus der ersten Karte) in `NavMegaMenu`.

3. 🟠 **Hoch — behoben.** Der Fokus im Panel stoppte den Schließ-Timer der Navbar nicht;
   nur `onMouseEnter` tat das. Das Menü schloss sich 140 ms nach dem Fokuswechsel.
   **Fix:** `onFocus`/`onBlur` am Panel, mit `relatedTarget`-Prüfung.

4. 🟡 **Mittel — behoben, Fehler in der eigenen Prüfung.** Die erste Fassung von
   `check-navigation.mjs` fragte für den Mobiltest `document.querySelectorAll('a')` ab
   und meldete grün, während das Menü nachweislich zu war — „Felgenreparatur" und
   „Privatkunden" stehen auch in der Kachelreihe der Startseite. Aufgefallen ist es nur,
   weil das Bildschirmfoto das geschlossene Menü zeigte. Genau der Fall aus
   `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`.
   **Fix:** Suche auf den Menücontainer eingegrenzt, zusätzliche Prüfung „Hamburger
   öffnet das Menü".

5. 🔴 **Kritisch, Bestandsfehler — behoben.** `npm run kontrast` und `npm run shots`
   liefen auf Windows **gar nicht**, seit ihrer Auslieferung am 2026-09-06.
   `scripts/lib/preview-server.mjs` rief `spawn('npx', …)` — unter Windows gibt es keine
   ausführbare Datei `npx`, nur `npx.cmd`. Ohne `shell: true` bricht `spawn` mit
   `ENOENT` ab, und zwar als unbehandeltes `error`-Ereignis: Stapelspur statt Meldung.
   Aufgefallen erst, als `npm run nav` denselben Helfer benutzte.
   **Doppelt bitter:** Genau diese zwei Werkzeuge hatte ich am selben Vormittag im
   Backlog als erledigt abgehakt — geprüft hatte ich nur, ob sie in `package.json`
   stehen. **Ein Werkzeug gilt erst als vorhanden, wenn es einmal durchgelaufen ist.**
   **Fix:** Aufruf über `process.execPath` und `node_modules/vite/bin/vite.js` — kein
   Shell, kein PATH, keine Plattformabhängigkeit. Danach laufen `nav` und `kontrast`
   nachweislich durch; der Kontrastmesser meldet die bekannten Befunde aus
   `docs/kontrast-backdrop/tasks/2026-09-06-kontrast-befunde-tasks.md`.
   Backlog-Eintrag in `offene-punkte-konsolidiert.md` richtiggestellt.

6. 🟢 **Niedrig — Hinweis, nicht behoben.** Der Browser-Pane dieser Sitzung ist
   ausgeblendet; dort werden Fokus- und Maus-Ereignisse nicht zugestellt
   (`document.activeElement` ändert sich, `focusin` feuert nicht). Interaktion lässt sich
   dort **nicht** verifizieren — nur per Puppeteer. Deckt sich mit dem bekannten Befund
   zu rAF und Scroll-Ereignissen.

**Offen aus dieser Runde:** Der Backlog-Punkt **2.5** („Kacheln verlinken auf die
Detail-Subseite") galt als erledigt; die Navigation selbst war davon nicht erfasst. Mit
`npm run nav` ist das jetzt messbar statt behauptet.

---

**Referenzen**
`components/NavMegaMenu.tsx`
`components/Navbar.tsx`
`data/navigation.ts`

**Quellen zur Barrierefreiheit**
https://www.wcag.com/authors/1-4-13-content-on-hover-or-focus/
https://adobe-accessibility.github.io/Accessible-Mega-Menu/
https://www.smashingmagazine.com/2023/08/better-context-menus-safe-triangles/
