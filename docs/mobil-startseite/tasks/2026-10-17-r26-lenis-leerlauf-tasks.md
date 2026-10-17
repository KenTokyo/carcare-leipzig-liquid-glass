# R26: Lenis-Schleife nur bei Bewegung

**Angelegt:** 2026-10-17 · **Bezug:** R26 in `2026-10-16-mobil-startseite-optimierung-tasks.md`
**Auftrag (gekürzt):** `hooks/useSmoothScroll.ts` ruft Lenis per `requestAnimationFrame` in jedem Bild auf, auch ohne
Scrollen. Gemessen am 16.10.: Chrome rechnet dadurch auch reine Compositor-Animationen in jedem Bild auf dem
Hauptthread nach (Stil der animierten Teilbäume, rund 125 Elemente, 0,9 ms je Bild ungedrosselt; Stil 70–230 ms je
Kartentipp bei CPU 4×, obwohl 0 Layout). Ziel: Die Schleife läuft nur, solange sich etwas bewegt, danach hält sie an.
Gerät des Users: Galaxy A56, 120 Hz, 8,3 ms je Bild.
**Fertig, wenn:** die Schleife im Leerlauf nachweislich steht, `npm run akkordeon` (auch `--gegenprobe`),
`npm run zielgruppen`, `npm run mobil`, `npm run aussparung` grün sind und Anker sowie Kartentipps wie vorher gleiten.

**Status:** ✅ Alle Phasen umgesetzt (17.10.2026). Im Leerlauf steht die Schleife nachweislich (0 rAF-Rückrufe auf
29 Routen, Hauptthread im Leerlauf rund 95–99 % entlastet), Anker, Rad und Navigation gleiten wie vorher, alle
Werkzeuge grün. Der Kartentipp wird dadurch NICHT schneller (A/B unten); dafür neuer Befund R30.

---

## Analyse (gemessen, nicht geschätzt)

Messaufbau: Puppeteer gegen `dist/` (`vite preview`), 393 × 851, Pixeldichte 2,75, Touch, CPU 4-fach gedrosselt, je
Messung ein eigener Browser, nur Ereignisse ab `TracingStartedInBrowser`, Hauptthread und Fensteranfang aus einer
eigenen `console.timeStamp`-Marke (Lehre O13). Skript `scripts/_r26-messung.mjs` (nur für diese Messung, danach
gelöscht), Rohdaten `output/r26/vorher.json`. Build 17.10.2026, 00:08:27 (Stand `00330ce`).

**Vorher, Leerlauf** (2 s ohne jede Eingabe, je Route 3 Läufe):

| Route | rAF-Rückrufe | Hauptthread-Bilder | Hauptthread belegt | davon Skript / Ebenen (Commit) / Malen |
|---|---|---|---|---|
| `/` bei `#leistungen` | 201–227 | 201–227 | 520–609 ms | 113–127 / 115–145 / 11–17 ms |
| `/` oben (Hero) | 169–245 | 169–245 | 432–791 ms | 112–195 / 86–180 / 8–21 ms |
| `/karriere` bei `#jobbereiche` | 203–249 | 204–249 | 459–555 ms | 114–134 / 104–128 / 11–20 ms |

Alle rAF-Rückrufe stammen aus **einer** Quelle: `index-*.js:6:3218`, im Bundle `const a=i=>{n.raf(i),t=requestAnimationFrame(a)}`,
also die Lenis-Schleife in `useSmoothScroll.ts`. Ohne sie gäbe es im Leerlauf kein einziges Hauptthread-Bild.
Der Hauptthread ist bei CPU 4× damit **21–40 % der Zeit belegt, ohne dass sich etwas bewegt.**

**Vorher, Kartentipp** (700 ms ab Klick-Marke, Startseite, Karte 2, je 3 Läufe):

| Akkordeon | rAF | Hauptthread-Bilder | Stil | Layout | Malen | Ebenen | belegt |
|---|---|---|---|---|---|---|---|
| `#leistungen` | 18–23 | 7–13 | 16–22×, 87–100 ms | 11–12×, 13–18 ms | 78–100 ms | 50–74 ms | 313–326 ms |
| `#autoaufbereitung` | 16–27 | 4–12 | 6–14×, 77–172 ms | 4–5×, 8–10 ms | 50–94 ms | 61–109 ms | 231–458 ms |

**Nebenbefund für die Prüfwerkzeuge:** `npm run akkordeon` zählt „Bilder“ über `FireAnimationFrame`, also über
rAF-Rückrufe. Die lieferte fast nur die Lenis-Schleife. Steht sie, fällt der Nenner für „Layout pro Bild“ und
„Hauptthread je Bild“ weg (`Math.max(1, 0)`), das Werkzeug würde falsch urteilen. Compositor-`DrawFrame` taugt als
Ersatz nicht: unter CPU 4× nur 17 eingereichte von 145 begonnenen Bildern (138 verworfen).

**Lenis 1.3.25 gelesen** (`node_modules/lenis/dist/lenis.mjs`):
- `raf(time)` macht nur `animate.advance(time − this.time)`. `animate` läuft ausschließlich nach `scrollTo` ohne
  `immediate` (einzige Stelle mit `animate.fromTo`). Dann steht `isScrolling` auf `'smooth'`, bis `reset()` kommt
  (Ziel erreicht, `stop()`, Touch, `scrollTo` mit `immediate`).
- Das Mausrad läuft über `onVirtualScroll` → `this.scrollTo(…)`. Touch ist nativ (`syncTouch` aus), Tastatur auch;
  beide gleicht Lenis nur über das scroll-Ereignis ab (`onNativeScroll`), ohne `raf`.
- ⚠️ **Sprungfalle:** Der Schritt ist `time − (this.time || time)`. Nach einer Pause ist `this.time` Sekunden alt,
  `damp` setzt den Wert im ersten Bild aufs Ziel. Eine Schleife, die einfach wieder anläuft, springt.

**Lösungswege verglichen:**
1. `autoRaf: true` (Lenis-Empfehlung): läuft ebenfalls in jedem Bild, kein Gewinn.
2. Schleife bei Eingabeereignissen wecken (`wheel`, `touchstart`, `keydown`, `click`) und nach N ms stoppen: verfehlt
   programmatisches Gleiten (App.tsx nach 50 ms Zeitgeber, Suche nach dem Schließen, `onComplete`-Ketten), Touch und
   Tasten brauchen die Schleife gar nicht; feste Laufzeit ist geraten.
3. Wecken über das Lenis-Ereignis `virtual-scroll`, Anhalten bei `scrollend` (Vorschlag in Lenis-Issue
   [#549](https://github.com/darkroomengineering/lenis/issues/549), 04.10.2026, ohne Antwort): kommt nur vom Rad,
   Anker und `scrollTo` aus dem Code blieben stehen; dazu die Sprungfalle oben.
4. Zustand von außen in jedem Bild abfragen (`isScrolling`): braucht wieder eine Dauerschleife.
5. **Gewählt:** Unterklasse `WeckendesLenis` überschreibt `scrollTo` (öffentliche Methode, auch der Radweg ruft sie
   über `this`). Gleitet Lenis danach (`isScrolling === 'smooth'`, öffentlicher Getter), startet die Schleife; sie
   hält im ersten Bild an, in dem Lenis nicht mehr gleitet. Beim Wiederanlauf wird `lenis.time` (öffentliches Feld)
   auf genau einen Bildabstand vor das erste Bild gestellt, wie es die durchlaufende Schleife gesehen hätte.
   Kein Zugriff auf private Teile (`animate`), keine Zeitgeber, keine geratene Laufzeit.

## Nachher (gemessen)

**Leerlauf**, gleicher Aufbau, Build 17.10.2026, 00:47:39 (Endstand), je Route 3 Läufe (`output/r26/nachher-final.json`):

| Route | rAF-Rückrufe vorher → nachher | Hauptthread-Bilder | Hauptthread belegt in 2 s (CPU 4×) |
|---|---|---|---|
| `/` bei `#leistungen` | 201–227 → **0** | 201–227 → 0 | 520–609 → **7–9 ms** |
| `/` oben (Hero) | 169–245 → **0** | 169–245 → 0–4 | 432–791 → **4–25 ms** |
| `/karriere` bei `#jobbereiche` | 203–249 → **0** | 204–249 → 3–4 | 459–555 → **19–23 ms** |

Über alle 29 Routen, Smartphone und Desktop, oben und in der Seitenmitte (`npm run leerlauf`): 0–5 Hauptthread-Bilder in
1,5 s, nirgends ein rAF-Rückruf. Der Hauptthread ist im Leerlauf also **rund 95–99 % entlastet**.

**Kartentipp: kein messbarer Gewinn.** Die Annahme in R26 („Lenis zwingt Chrome, Compositor-Animationen in jedem Bild
nachzurechnen“) hält dem A/B nicht stand. A/B im selben Build (00:16), Kartentipp mit und ohne eingespielte leere
rAF-Dauerschleife (so lief Lenis vorher), je 4 Läufe, Median (Spanne), `output/r26/ab.json`:

| CPU | Akkordeon | Schleife | Hauptthread-Bilder 150–700 ms | Stil 0–700 ms | belegt 0–700 ms |
|---|---|---|---|---|---|
| 1× | `#leistungen` | mit / ohne | 44 (35–46) / 37 (24–38) | 32 / 30 ms | 145 / 119 ms |
| 1× | `#autoaufbereitung` | mit / ohne | 97 (74–117) / 95 (21–113) | 70 / 71 ms | 222 / 203 ms |
| 4× | `#leistungen` | mit / ohne | 8 (6–14) / 13 (5–19) | 120 / 110 ms | 380 / 382 ms |
| 4× | `#autoaufbereitung` | mit / ohne | 19 (5–37) / 28 (13–39) | 148 / 174 ms | 533 / 524 ms |

Die Spur zeigt warum: Auch ohne einen einzigen rAF-Rückruf rechnet Chrome, solange die Kartenanimationen laufen, in
jedem Bild den Stil der animierten Elemente nach (79 → 37 → 9 Elemente, bis der Bildzoom `scale-105` → `scale-100`
nach 700 ms endet), obwohl alle Animationen auf dem Compositor laufen (`compositeFailed: 0`). Das ist Chromes
Verhalten bei laufenden Animationen, nicht Lenis. Neuer Befund dafür: **R30** im Optimierungsplan.

**Natives Touch-Scrollen** (die Hauptbedienung auf dem A56), A/B im selben Build, 3 Wischgesten mit je 12 Bewegungen,
3 Läufe: bei CPU 4× Hauptthread-Bilder 243–260 → 118–165, belegt in 1,8 s 996–1135 → 879–955 ms (rund 12 % weniger);
ungedrosselt in der Streuung.

**Gleiten wie vorher** (`npm run leerlauf`, Build 00:47): Rad 400 px, Anker-Tipp 1.282 px, Navigation 841 px; jeder
Schritt innerhalb der Lenis-Dämpfung für seine Bildzeit (Überschuss 0–8 %, Grenze 25 %), erster Schritt ×0,51–1,00
gegenüber der früheren Dauerschleife; nach jedem Gleiten wieder 0 Hauptthread-Bilder.

## Risiken (geprüft)

| Stelle | Weg | Ergebnis |
|---|---|---|
| Mausrad (Desktop) | `onVirtualScroll` → `this.scrollTo` → Unterklasse | gleitet, `npm run leerlauf` (Rad), `npm run zielgruppen` (echtes Rad, Listen und Übergabe) grün |
| In-Page-Anker (`beiAnkerKlick`) | `lenis.scrollTo(hash)` | gleitet, Test „Anker“ (Tipp auf „Jobbereiche ansehen“, /karriere); nativer Fragmentsprung wird wie vorher im selben Bild vor dem Malen zurückgenommen |
| Hash-Navigation (`App.tsx`) | `scrollTo` aus Zeitgeber, `onComplete` mit `immediate` | gleitet und kommt an (#leistungen bei 88 px), Test „Navigation“ |
| „Ablauf überspringen“, Suche | `lenis.scrollTo` (ohne `immediate`) | gleicher Weg wie Anker und Navigation, nicht einzeln ausgelöst (Pflichtfrage 3 im Wächter) |
| Kartentipp (`akkordeonMobil.ts`, `scrollenUm`) | `scrollTo` mit `immediate` + `force` | braucht keine Schleife (springt im selben Aufruf, `reset`); `npm run akkordeon` ×2: getippte Karte 0,0 px Wanderung, Ruhelage stimmt |
| Dialoge, Preloader | `stop()`/`start()` → `reset` | Schleife hält im nächsten Bild an; nichts zu wecken |
| Touch, Tastatur | nativ (`syncTouch` aus) | Lenis gleicht nur über das scroll-Ereignis ab, ohne `raf` |
| Tab im Hintergrund während des Gleitens | rAF pausiert | großer Schritt beim Zurückkommen wie vor R26 (dieselbe Lenis-Uhr) |
| Prüfskripte mit `HALTE_SCROLL` | Reihenfolge der rAF-Rückrufe | Lenis meldet sich erst beim Gleiten an, läuft dann NACH einer Halteschleife; kein Werkzeug hält während Rad/Anker. Kommentar in `preview-server.mjs` |
| `npm run akkordeon` | zählte Bilder über rAF | umgestellt auf `BeginMainThreadFrame` (Fund 1) |

## Werkzeuge gegen den Endstand (Build 17.10.2026, 00:47:39)

Danach nur noch ein Kommentar in `hooks/useSmoothScroll.ts` (widerlegte Annahme zum Kartentipp richtiggestellt). Neuer
Build 17.10.2026, 01:18:48: alle 41 Dateien in `dist/assets` mit unverändertem Inhalts-Hash, die Ergebnisse gelten also
auch für ihn.

| Werkzeug | Ergebnis |
|---|---|
| `npm run leerlauf` | ✅ 29 Routen × 2 Fenster × 2 Lagen ohne Bilder im Leerlauf; Rad, Anker, Navigation gleiten, danach Leerlauf |
| `npm run leerlauf -- --gegenprobe` | ✅ 8 von 8 Dauerschleifen, 3 von 3 Sprünge gemeldet |
| `npm run akkordeon` (2 Läufe) | ✅ späte Layouts 3/34, 4/72, 1/83 und 3/57, 3/73, 2/101 Hauptthread-Bilder; 0 abseits des Compositors; 0,0 px Wanderung |
| `npm run akkordeon -- --gegenprobe` | ✅ 3 von 3 Höhen-Animationen (19/19, 36/35, 38/37) und 3 von 3 Hervorhebungen gemeldet |
| `npm run zielgruppen` | ✅ alle Karten auf allen Fenstern, Rad und Übergabe ok |
| `npm run mobil` | ✅ 29 Routen × 3 Fenster, 0 harte Befunde (257 Hinweise Schrift unter 12 px, unverändert) |
| `npm run aussparung` | ✅ keine dauerhafte Überdeckung, 23 Breiten in Ordnung |
| `npm run nav` | ✅ 16/16, nach Nachziehen einer veralteten Erwartung (Fund 4, nicht durch R26) |

### ✅ Phase 1 — Vorher messen
**Ziel:** Hauptthread je Bild im Leerlauf und beim Kartentipp (393 × 851, DPR 2,75, Touch, CPU 4×), Quellen aller
rAF-Rückrufe im Leerlauf, Ereignisnamen der Spur für einen rAF-unabhängigen Bildzähler.
* [x] Messskript (Leerlauf + Tipp), je Messung eigener Browser, nur Ereignisse ab `TracingStartedInBrowser`
* [x] Werte vorher in die Analyse (oben), einzige rAF-Quelle im Leerlauf belegt
**Referenzen:**
`hooks/useSmoothScroll.ts`
`output/r26/vorher.json` (nicht versioniert)

### ✅ Phase 2 — Lösungswege vergleichen, Lenis-Verhalten belegen
**Ziel:** Weg wählen, der alle Bewegungsquellen weckt und beim Wiederanlauf nicht springt.
* [x] Lenis 1.3.25 gelesen: was `raf()` tut, wer `scrollTo` aufruft, wann `isScrolling` zurückfällt
* [x] Fünf Wege verglichen (siehe Analyse), Unterklasse mit Wecken in `scrollTo` gewählt
**Referenzen:**
`node_modules/lenis/dist/lenis.mjs`

### ✅ Phase 3 — Umsetzung `hooks/useSmoothScroll.ts`
* [x] `WeckendesLenis`: `scrollTo` meldet den Beginn einer Gleitbewegung (`beimGleiten`)
* [x] `schritt`: läuft nur, solange `isScrolling === 'smooth'`; Uhr beim Wiederanlauf um einen Bildabstand zurück
      (kleinster gemessener Abstand)
* [x] **Einmessen** (nachgezogen in Phase 4, Fund 2): Nach dem Start läuft die Schleife zehn Bilder lang nur zum
      Messen des Bildtakts. Ohne das nahm sie bis zum ersten Gleiten 60 Hz an; auf 120 Hz war der erste Schritt doppelt
      so groß wie früher (gemessen ×1,96, bei 240 Hz ×3,82). Mit Einmessen ×0,51–1,00, also nie größer als vor R26.
**Referenzen:**
`hooks/useSmoothScroll.ts`

### ✅ Phase 4 — Prüfwerkzeuge
**Ziel:** Die Werkzeuge messen nach der Umstellung noch richtig, und der neue Zustand ist dauerhaft bewacht.
* [x] `npm run akkordeon`: Bilder über `BeginMainThreadFrame` statt `FireAnimationFrame` (Fund 1); Grenze „Layout pro
      Bild“ 60 → 80 %, begründet mit den Messwerten (normal 1–50 % je nach Rechnerlast, Gegenprobe 93–112 %)
* [x] Neuer Wächter `npm run leerlauf` (`scripts/check-leerlauf.mjs`): Leerlauf aller 29 Routen × Smartphone/Desktop ×
      oben/Mitte, dazu Gleiten bei Rad, Anker-Tipp und App-Navigation mit Leerlauf danach. Pflichtfrage im Kopf
      beantwortet (sechs Punkte), `--gegenprobe` (Dauerschleife + springende Uhr), `--gleiten`, Routenfilter
* [x] Sprungkriterium gegen die Zeit statt gegen den Weg (Fund 5), Anlauf-Kriterium gegen den alten Build belegt
* [x] `HALTE_SCROLL`: Reihenfolge geprüft und im Kommentar festgehalten (Lenis meldet sich erst beim Gleiten an, läuft
      dann NACH einer Halteschleife; kein Werkzeug hält während eines Rad- oder Ankertests, `check-zielgruppen` lässt los)
* [x] `CLAUDE.md`: Zeile `npm run leerlauf`, Zeile `npm run akkordeon` nachgezogen
**Referenzen:**
`scripts/check-leerlauf.mjs`
`scripts/check-akkordeon.mjs`
`scripts/lib/preview-server.mjs`

### ✅ Phase 5 — Risiken und Gegenprobe aller Werkzeuge
**Ziel:** Nichts, was vorher gleitete oder stand, verhält sich anders.
* [x] Risiken im Code geprüft (Tabelle „Risiken“ unten): Anker, Hash-Navigation, „Ablauf überspringen“, Suche,
      Kartentipp (`scrollTo` mit `immediate`/`force`), Dialoge und Preloader (`stop`/`start`), Tab im Hintergrund
* [x] Alle Werkzeuge gegen den Build vom 17.10.2026, 00:47:39 (Ergebnisse unten)
**Referenzen:**
`components/akkordeonMobil.ts`
`App.tsx`
`components/ScrollPinnedProcess.tsx`

### ✅ Phase 6 — Nachher messen, Doku, Commit
* [x] Nachher-Messung mit demselben Aufbau (Analyse „Nachher“), A/B für Kartentipp und Touch-Scrollen
* [x] R26 im Optimierungsplan erledigt, Folgebefund R30 eingetragen, Messskripte gelöscht

---

## Kommentare
### Phasen 1–6
**Eingehalten**: vorher gemessen statt geschätzt ✅, Ursache im Bundle belegt (einzige rAF-Quelle) ✅, Lenis-Quelltext
gelesen statt angenommen ✅, fünf Lösungswege verglichen (inkl. Lenis-Issue #549) ✅, nur öffentliche Lenis-API
(`scrollTo`, `isScrolling`, `time`, `raf`) ✅, Annahme des Auftrags per A/B im selben Build geprüft und widerlegt statt
bestätigt ✅, je Messung eigener Browser und Marke (Lehre O13) ✅, neuer Wächter mit Pflichtfrage und Gegenprobe ✅, alle
Werkzeuge gegen den Endstand ✅, keine prefers-reduced-motion-Gates ✅, unter 700 Zeilen (Hook 157, Wächter 391,
Akkordeon-Prüfer 428) ✅, keine Kundennummern vergeben (R30 im Notizordner reserviert) ✅, Encoding UTF-8 ✅.
**Auffälligkeiten/Probleme (nach Schwere):**
1. 🟠 **Hoch (behoben):** `npm run akkordeon` zählte Bilder über `FireAnimationFrame`, also über Lenis' Dauerschleife.
   Ohne sie fiel der Nenner auf 0 bis 1: Fehlalarm „3 Layouts in 1 Bild, 300 %“ und eine nur zufällig grüne Gegenprobe.
   Jetzt `BeginMainThreadFrame`, Grenze 80 % mit Messwerten begründet.
2. 🟠 **Hoch (behoben):** Ohne Einmessen nahm die Schleife bis zum ersten Gleiten 60 Hz an; auf dem 120-Hz-A56 wäre der
   erste Schritt nach dem Laden doppelt so groß gewesen wie früher (gemessen ×1,96, bei 240 Hz ×3,82). Jetzt zehn Bilder
   Einmessen beim Start, gemessen ×0,51–1,00; der Wächter meldet ab ×1,5.
3. 🟡 **Mittel (offen, R30):** Die Annahme des Auftrags, Lenis treibe die Stilkosten beim Kartentipp, stimmt nicht
   (A/B). Chrome rechnet laufende Animationen in jedem Bild auf dem Hauptthread nach; Hebel sind weniger gleichzeitige
   Animationen und die Dauer des Bildzooms. Eigener Schritt, siehe Optimierungsplan.
4. 🟡 **Mittel (behoben, nicht durch R26):** `npm run nav` war rot: Erwartungsliste noch „Autoglas / Scheibenfolien“,
   das Lektorat hatte den Titel in `3549114` auf „Autoglas & Scheibenfolien“ geändert. Liste nachgezogen, 16/16.
5. 🟡 **Mittel (behoben, eigener Entwurf):** Der erste Entwurf des Wächters bewertete Sprünge gegen den Weg (Schritt
   höchstens 35 %) und meldete lange Bilder als Sprung (42 % beim Rad, 74 % bei der Navigation, beide zeitrichtig).
   Jetzt gegen Lenis' Dämpfung für die tatsächliche Bildzeit; die Bahn misst mit der echten Uhr, damit die Gegenprobe
   den Sprung nicht selbst „erklärt“.
6. 🟢 **Niedrig (dokumentiert):** `HALTE_SCROLL` läuft jetzt vor Lenis' Rückruf, wenn Lenis während des Haltens gleitet.
   Kein Werkzeug tut das; Hinweis im Kommentar der Halteschleife.
7. 🟢 **Niedrig (Hinweis):** Der Bildtakt wird als kleinster gemessener Abstand geführt. Schaltet ein Gerät nach dem
   Einmessen von 120 auf 60 Hz, ist der erste Schritt halb so groß wie früher (gemessen ×0,51), nie größer.
**Refactoring-Empfehlung:** keine im geänderten Code. Nächster sinnvoller Schritt ist R30 (Animationen beim Kartentipp
bündeln oder begrenzen), vorher mit `npm run akkordeon` und dem A/B-Aufbau dieser Datei messen.
