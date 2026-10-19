# Navbar mobil: Karriere im Menü, Menü scrollt, Logo immer zur Startseite (R34)

**Angelegt:** 2026-10-19 · **Branch:** `2026-10-19-nav-mobil-menue` (von `main`, Stand `8565cde`; am 20.10. ohne
Commit auf `main` = `dcaa814` vorgespult, also mit R33), eigener Worktree `.claude/worktrees/nav-mobil-menue`, damit die
damals offenen Änderungen zu R33 im Hauptordner unberührt blieben.
**Nummer:** R34 (laut `docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-optimierung-tasks.md` im Hauptordner
die nächste freie; im gemeinsamen Notizordner der Sitzungen reserviert). Unterbefunde R34-a, R34-b …
**Optimierungsplan:** `2026-10-19-navbar-mobil-menue-optimierung-tasks.md` (gleicher Ordner)

**Status:** Phasen 1–6 erledigt. Branch auf `main` = `dcaa814` (mit R33) vorgespult, alle Werkzeuge gegen den Build
**20.10.2026, 00:32:15** grün. Mit Zustimmung des Users am 20.10. auf dem Branch committet, nicht gepusht. Offen: Sichtprobe am iPhone und Android-Telefon
(Touch hier emuliert).

**Auftrag (über die Sitzung „Akkordeon Layout-Bug auf Mac“, User: „fix nur das“):**
1. Im mobilen Dropdown-Menü der Navbar (Hamburger, unter 1280 px) fehlt „Karriere“.
2. Das Menü lässt sich nicht scrollen.
3. Ein Klick auf das Navbar-Logo soll **immer** zur Startseite führen: von jeder Unterseite, auf der Startseite selbst
   nach oben, auch bei offenem Menü.

Fertig, wenn: Karriere steht im Menü an der Stelle wie in der Desktop-Navbar; das Menü scrollt per Finger, Mausrad und
Trackpad bis zum letzten Eintrag, auch bei 393 × 659 (iPhone in Safari), ohne dass die Seite dahinter mitläuft; das
Logo führt von jeder Route und bei offenem Menü auf `/`, Menü zu, Seite oben.

**Planungsvalidierung:** Keine bestehende Planung enthält diese Punkte (`docs/navbar-dritte-ebene/`,
`docs/navbar-mobile-width/`, `docs/header/` beschreiben das Menü, aber weder Höhe noch Scrollen noch das Logo).
Deshalb diese neue Planung.

---

## Analyse (gemessen, Build von `main` 8565cde, 19.10.2026, headless Chrome, Bewegung ein)

Skript im Scratchpad dieser Sitzung (`diagnose-menue.mjs`): Menü auf `/leistungen` (Seite bei 600 px) öffnen, dann
wischen (Touch), Mausrad (13 × 300) und „Trackpad“ (90 × 18 px) über dem Menü und daneben; Logo-Klick aus 9 Lagen.

| Befund | Messung |
|---|---|
| **„Karriere fehlt“: steht im DOM, liegt aber unterhalb des Fensters** | Menü 995 px hoch (90 → 1085 px), `overflow: hidden`, keine Höhenbegrenzung. Einträge: Leistungen 111, Wissen 712, Über uns 757, **Karriere 802**, Kontakt 847, letzter Link („Direkt anrufen“) endet bei 1064 px. Bei 393 × 659 liegt schon „Wissen“ außerhalb, bei 390 × 844 liegen Über uns und Karriere über der Knopfleiste (ab 761 px), Kontakt ist außerhalb. Reihenfolge = Desktop (Leistungen, Wissen, Über uns · Karriere, Kontakt) |
| **Menü scrollt nicht, die Seite dahinter schon** | Das Menü hängt in der festen Ebene (`.solidroad-shell-frame-container`, `position: fixed`) und hat keinen Scrollbereich. Wischen über dem Menü: Seite 600 → 972 → 3.081 px, Menü bleibt stehen. Mausrad (Lenis übernimmt): 600 → 2.549 px. Trackpad: 2.550 → 3.360 px. Daneben: Seite läuft ebenso. Gleich bei 390 × 844, 393 × 659, 768 × 1024, 1024 × 700 |
| **Logo auf der Startseite ohne Wirkung** | `/` bei 2.500 px: bleibt bei 2.500 (mit und ohne offenes Menü, Menü schließt nur). `/#faq` (15.241 px): Adresse wird `/`, Seite bleibt bei 15.257. Desktop 1440 × 900, `/` bei 3.000: bleibt. Ursache: `handleLinkClick('/')` setzt `pushState('/')`, die App vergleicht nur den Pfad (`App.tsx`, Effekt an `[path]`), der ist unverändert, also läuft kein Sprung nach oben |
| Logo von Unterseiten: funktioniert | `/karriere` (1.500 px), `/leistungen`, `/kontakt` (mit offenem Menü, Touch und Maus), `/ueber-uns` am Desktop: jeweils `/`, Seite bei 0, Menü zu. Das Logo ist überall treffbar (Treffertest auf das Wortmarkenbild) |

**Recherche (2026-10-19):**
- Lenis: Für einen inneren Scrollbereich in einer festen Ebene ist `data-lenis-prevent` am Behälter der dokumentierte
  Weg ([npm lenis](https://npmjs.com/package/lenis), [Motion-Doku zu Lenis](https://motion.dev/docs/lenis)); der Code
  von 1.3.25 prüft das Attribut in `onVirtualScroll` VOR der Sperre durch `stop()`, Ereignisse im Menü gehen also
  nativ an den Behälter, alle anderen verwirft das gestoppte Lenis (`preventDefault`).
- `overscroll-behavior: contain` hält das Weiterreichen an die Seite am Ende eines Scrollbereichs an
  ([Chrome-Blog](https://developer.chrome.com/blog/overscroll-behavior),
  [Ben Nadel](https://www.bennadel.com/blog/3698-using-css-overscroll-behavior-to-prevent-scrolling-of-parent-containers-from-within-overflow-containers)).
  Ob es auch an einem Behälter wirkt, der gerade nicht überläuft (Menü passt ins Fenster), ist nicht belegt; deshalb
  zusätzlich die Seitensperre wie bei Anfrage- und Suchdialog (`body` `overflow: hidden`, Lenis gestoppt).
- Höhe: `100svh` (kleines Fenster, Leisten des Browsers eingeblendet) ist der stabile Bezug für Telefone
  ([OpenReplay](https://blog.openreplay.com/fr/5-mobile-web-problemes-solutions/)); `100vh` läge in Safari und Chrome
  mit eingeblendeten Leisten zu hoch.

**Lösungswege verglichen:**
- *Scrollen:* (a) ganzes Menü `position: fixed` mit `top`/`bottom` statt `absolute` in der Navbar (verschiebt Lage und
  Breite, die an der Navbar hängen) · (b) Höhe per Skript aus `lib/freierBereich.ts` messen (passt sich an, braucht
  aber Messung, Zustand und Neuberechnung bei jeder Größenänderung, und die Leiste gleitet beim Laden erst ein)
  · **(c) gewählt:** innerer Scrollbehälter mit `max-height` aus `100svh` minus Navbar, Abstand und Knopfleiste per CSS
  (Werte je Breite wie die Navbar selbst: 4,85 rem, ab 768 px 6,25 rem; Leiste nur unter 1024 px), dazu
  `overflow-y: auto`, `overscroll-behavior: contain`, `data-lenis-prevent`. Die äußere Hülle behält die Auf- und
  Zuklapp-Animation. Der Wächter prüft je Fenster, dass das Menü über der Leiste endet; ändert sich die Leiste, meldet er
  es.
- *Seite dahinter:* nur `overscroll-behavior` (reicht nicht, wenn das Menü passt, und nicht für Wischen neben dem Menü)
  · **gewählt:** Seitensperre solange offen, gleiches Muster wie `AnfrageDialog` und `SuchDialog` (Lenis `stop()`,
  `body` `overflow: hidden`, beides beim Schließen zurück). Damit die Sperre nie an einem unsichtbaren Menü hängt
  (Fenster auf 1280 px oder breiter gezogen, Menü dort `xl:hidden`), schließt das Menü ab dieser Breite.
- *Logo:* (a) App so ändern, dass jedes `carcare:navigate` auch bei gleichem Pfad scrollt (würde jeden Link auf die
  eigene Seite mitändern, das ist nicht beauftragt) · **gewählt:** eigener Klick für das Logo. Andere Seite: wie bisher
  `pushState` + `carcare:navigate`, die App springt nach oben. Startseite: Menü zu, Adresse ohne `#anker`, dann selbst
  nach oben gleiten (wie der Suchdialog bei Treffern auf derselben Seite). Steht die Seite weiter als zwei Fenster
  unten, zuerst ohne Bewegung auf ein Fenster Abstand, dann gleiten: Die Seite läuft so nicht durch alle Sektionen
  (keine nachgeladenen Bilder auf dem Weg, keine Ablauf-Animationen im Schnelldurchlauf). Klicks mit Strg, ⌘, Umschalt
  oder Mittelklick lässt das Logo dem Browser (neuer Tab).

---

## Phasen

### ✅ Phase 1 — Nachstellen und messen
**Ziel:** Ursache je Punkt belegen, bevor Code geändert wird.
* [x] Worktree von `main` angelegt, `node_modules` und Chromium per APFS-Klon übernommen, Build von `main` als
  Vergleichsstand gesichert (Scratchpad `dist-vorher`).
* [x] Menü in sechs Fenstern gemessen (390 × 844 und 393 × 659 je Touch und Maus, 768 × 1024 Touch, 1024 × 700 Maus):
  Ergebnisse in der Tabelle oben.
* [x] Logo in neun Lagen gemessen: 4 von 9 rot, alle auf der Startseite.
**Referenzen:**
`components/Navbar.tsx`
`App.tsx`
`hooks/useSmoothScroll.ts`

### ✅ Phase 2 — Menü als Scrollbereich, Seite dahinter fest
**Ziel:** Alle Einträge (Karriere, Kontakt, „Direkt anrufen“) per Finger, Rad und Trackpad erreichbar.
* [x] Innerer Scrollbehälter (`data-lenis-prevent`, `overflow-y: auto`, `overscroll-behavior: contain`, Polsterung
  `p-5` von der Hülle hierher). Höhe `menueHoehe` in `Navbar.tsx`: `100svh` minus (Navbar 4,85 rem bzw. ab 768 px
  6,25 rem + 12 px) minus (Knopfleiste + 12 px, ab 1024 px nur 12 px); `100vh` als Rückfall ohne `svh`
  (`supports-[height:1svh]:`). Die Hülle behält Auf- und Zuklappen (`height` 0 → auto), Rundung, Schatten.
* [x] **Knopfleiste mit `rem` statt fester 95 px** (beim Messen gefunden, R34-i): Die Leiste ist 3 rem Abstände plus
  35 px fest. Mit größerer Grundschrift (Android „Textgröße“, Chrome „Schriftgröße“) wuchs sie auf 89 / 95 / 107 px
  (18 / 20 / 24 px), das Menü lag mit festen 95 px dann 2 bzw. 14 px über ihr. Jetzt `calc(3rem + 47px)`: Abstand bei
  allen vier Schriftgrößen und drei Fenstern konstant 10 px (12 px minus 2 px Rand der Hülle).
* [x] Seitensperre solange offen: Lenis `stop()`, `body` `overflow: hidden`, Freigabe erst `body`, dann Lenis (wie
  `usePreloader`). Das Menü schließt bei Seitenwechsel (`popstate`, `carcare:navigate`), wenn die Suche aufgeht
  (`carcare:suche`) und ab 1280 px Breite, damit die Sperre nie ohne sichtbares Menü stehen bleibt.
* [x] Gemessen (Build 19.10.2026, 23:32:49, wiederholt gegen 23:57:02 mit denselben Werten): Menü endet über der Leiste (390 × 844: 90–751, Leiste ab 761; 393 × 659:
  90–566, Leiste ab 576; 768 × 1024: 112–931, Leiste ab 941; 1024 × 700: 112–690, Fenster 700). Finger, Rad und
  Trackpad scrollen bis zum letzten Link (scrollTop 334/334, 519/519, 95/95, 336/336), die Seite bleibt bei 600 px,
  auch beim Wischen und Rad neben dem Menü (vorher 600 → 3.081 bzw. 3.809).
* [x] Randfälle: Menülink „Karriere“ aus dem offenen Menü → `/karriere` bei 0, Sperre frei; Zurück-Geste bei offenem
  Menü → `/leistungen` bei 0, Menü zu; Suche über dem Menü → Menü zu, nach Escape alles frei; Fenster bei offenem Menü
  von 1100 auf 1300 px → Menü zu, frei; Menü passt ganz ins Fenster (1024 × 1366 Touch, 1100 × 1400 Maus, 914 px, kein
  Scrollen nötig) → Seite bleibt bei Rad und Wischen über dem Menü.
**Referenzen:**
`components/Navbar.tsx`

### ✅ Phase 3 — Logo immer zur Startseite
* [x] `zurStartseite` in `Navbar.tsx`: Menüs zu; andere Seite wie bisher (`pushState` + `carcare:navigate`, die App
  springt nach oben); Startseite: Adresse ohne Anker oder Abfrage, nach 50 ms (Sperre frei) über Lenis nach oben,
  aus mehr als zwei Fenstern Tiefe zuerst ohne Bewegung auf ein Fenster Abstand. Strg, ⌘, Umschalt, Alt bleiben beim
  Browser.
* [x] Gemessen: 9/9 Lagen grün (vorher 5/9): `/` bei 2.500 → 0, `/#faq` bei 15.215 → `/` bei 0, `/` mit offenem Menü
  → 0, Menü zu, Unterseiten mit und ohne Menü → `/` bei 0, Desktop `/` bei 3.000 → 0. Verlauf ab `/#faq` (15.257):
  erster Stand nach dem Klick 844 (ein Fenster), dann 770, 692, 626 … 0, kein Durchlauf durch die Seite.
* [x] **Alle 29 Routen** (`scripts/routes.mjs`), 393 × 659 Touch, Seite zur Mitte gescrollt (2.086 bis 9.016 px),
  Menü offen: 29/29 → `/` bei 0, Menü zu, Sperre frei (Scratchpad `logo-alle-routen.mjs`, einmalig; im Wächter stehen
  sieben typische Lagen). Gegen Build 23:57:02 wiederholt: 29/29. Dazu die 404-Seite (`/gibt-es-nicht`, Menü offen):
  `/` bei 0, Menü zu, Sperre frei.
* [x] Strg-Klick (Desktop, `/karriere`): kein Abfangen, Seite bleibt.
**Referenzen:**
`components/Navbar.tsx`

### ✅ Phase 4 — Wächter: `npm run nav` prüft die drei Punkte
* [x] `scripts/check-navigation.mjs`: Mobilteil je Fenster (393 × 659, auch mit 20 px Grundschrift, 360 × 560,
  390 × 844 mit Touch; 393 × 659, 1024 × 700 mit Maus): Hauptpunkte in Desktop-Reihenfolge samt Karriere, Knopfleiste
  gefunden, Menü endet über ihr,
  je Eingabe (Finger bzw. Mausrad und Trackpad) „Karriere“ unterwegs sichtbar und treffbar, letzter Link sichtbar und
  treffbar, Seite bleibt; Rad bzw. Wischen neben dem Menü; nach dem Schließen frei. Logo aus sieben Lagen.
  Bildschirmfotos `output/nav-shots/mobil-menue-ende-*.png`.
* [x] Pflichtfrage im Kopf des Skripts (Punkte 5–8): emuliertes Touch statt Safari, Trackpad ohne Nachlauf,
  abgeleitete Fensterhöhen, keine Scrollleisten in headless.
* [x] Gegenprobe gegen den Build von `main` (`--basis`): **36/76**, 40 Meldungen in allen drei Punkten (Unterkante 1.085
  statt ≤ 576, „Karriere“ nie treffbar, gescrollt 0/0, Seite 600 → 5.610, Logo auf `/` bleibt bei 2.500, 15.257,
  3.000). Gezielte Gegenprobe für R34-i: Build mit festen 95 px (23:32:49, `CC_ALTEN_STAND_MESSEN=1`) → **75/76**,
  einzige Meldung „Grundschrift 20 px: Unterkante 566, frei bis 564“. Gegen den neuen Build (23:57:02) **76/76**.
* [x] Läufe mit `--basis` schreiben ihre Bilder jetzt nach `output/nav-shots-basis/` (die Gegenprobe hatte die Bilder
  des regulären Laufs überschrieben).
**Referenzen:**
`scripts/check-navigation.mjs`

### ✅ Phase 5 — Build und Werkzeuge gegen den neuen Build
**Ziel:** Alle berührten Werkzeuge gegen den Build nach der letzten Korrektur (R34-i).
* [x] `npm run build`: grün, Build **19.10.2026, 23:57:02** (Prerender 30/30, Gedankenstriche 0 Funde, FAQ-HTML 29/29).
* [x] `npm run nav`: **76/76** (Gegenprobe gegen `main` 36/76, gegen den 95-px-Stand 75/76, siehe Phase 4).
* [x] `npm run mobil`: 29 Routen × 3 Fenster, **0 harte Befunde**, 257 Hinweise „Schrift unter 12 px“ (dieselbe Zahl wie
  in allen Läufen seit dem 15.10.).
* [x] `npm run aussparung`: **in Ordnung**, keine dauerhafte Überdeckung, Knöpfe unversehrt, 29 Routen × 3 Fenster,
  Geometrie an 23 Breiten.
* [x] `npm run leerlauf`: **in Ordnung**, 29 Routen × 2 Fenster ohne Bilder im Leerlauf, Lenis gleitet bei Rad, Anker und
  Navigation und steht danach wieder. Der erste Anlauf brach nach einer Sekunde ab: Port 4189 war von der parallelen
  Sitzung (Stimmen, R33-a) mit demselben Werkzeug belegt (`vite preview beendet mit 1`). Kein Befund, nach Freiwerden
  des Ports neu gestartet.
* [x] `npm run cls`: 29 Routen × 4 Fenster, CPU 4×, **0 harte Befunde, 0 Hinweise**.
* [x] Nicht nötig, begründet: `zeichnen` (das Menü ist bei der Messung zu, keine Glas-, Video- oder `will-change`-Ebene
  darin, kein großer Behälter), `akkordeon`, `faq-mobil`, `zielgruppen` (Lenis-Optionen und Leisten unverändert; die
  Sperre greift nur bei offenem Menü), `kontrast` (keine Farbe geändert).
* [x] Rechner war belastet (Adobe-Dienst 99 % CPU, zweiter Headless-Chrome der parallelen Sitzung); `cls` und
  `leerlauf` sind trotzdem ohne Befund, `cls` bestätigt harte Befunde ohnehin einzeln nach.
* [x] **Nach dem Vorspulen auf `dcaa814` (R33 dabei) alles erneut**, Build **20.10.2026, 00:32:15** (Prerender 30/30,
  Gedankenstriche 0): `nav` **76/76**; `mobil` 29 × 3, **0 harte Befunde**, 257 Hinweise; `aussparung` **in Ordnung**
  (29 Routen × 3 Fenster, Geometrie an 23 Breiten); `leerlauf` **in Ordnung** (Rad 22 Lagen, Anker 49, Navigation 53,
  größter Überschuss je Bild 1 / 4 / 6 %); `cls` 29 × 4, CPU 4×, **0 harte Befunde, 0 Hinweise**. Logo dazu auf allen
  29 Routen mit offenem Menü: 29/29.
**Referenzen:**
`scripts/check-navigation.mjs`

### ✅ Phase 6 — Dokumentation
* [x] Diese Datei, Optimierungsplan (`2026-10-19-navbar-mobil-menue-optimierung-tasks.md`), Nummernzeiger in
  `docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-optimierung-tasks.md` (nächste freie R35), Werkzeugzeile
  `npm run nav` in `CLAUDE.md`.
* [x] **Zusammengeführt:** R33 kam am 20.10., 00:22 in `main` (`b9c1513`, Push-Stand `dcaa814`). Auf Bitte der
  Ausgangssitzung `origin/main` geholt und den Branch (ohne eigene Commits) per `--ff-only` auf `dcaa814` vorgespult,
  ohne Commit. Vorher gesichert (Patch und Kopien im Scratchpad), danach eingespielt: `Navbar.tsx` und
  `check-navigation.mjs` unverändert (byte-gleich), Zeile `npm run nav` in `CLAUDE.md` hinter `faq-mobil` (neben der
  R33-Zeile `npm run akkordeon`), Zeile 8 des R-Registers mit R33 und R34, Zeiger weiter auf R35. Der Branch legt sich
  damit ohne Konflikt auf `main`.
* [x] Vorher/Nachher-Bild 393 × 659: `output/nav-shots/vorher-nachher-393x659.png` (nicht versioniert, wie alle
  Bildschirmfotos).
* [x] Kodierung: 6 geänderte Dateien gültiges UTF-8, keine Steuerzeichen, kein Mojibake (Python und Perl, Gegenprobe
  mit eingespielten Fehlern meldet sie).
* [x] **Committet auf dem Branch, nicht gepusht:** Zustimmung des Users am 20.10.; vor einem Push `npm run push-stand`
  (CLAUDE.md, Abschnitt Push-Stand).

---

## Kommentare
### Phasen 1–6
**Eingehalten:** gemessen statt geschätzt (Ursache je Punkt vor dem Code belegt) ✅, Planung vor Code ✅, „fix nur das“
(Nebenbefunde nur notiert, R34-a bis R34-g) ✅, Lösungswege verglichen ✅, eigener Worktree, Hauptordner und
R33-Dateien unberührt ✅, unter 700 Zeilen (`Navbar.tsx` 515, `check-navigation.mjs` 517) ✅, kein sichtbarer Text
geändert, keine Gedankenstriche (Wächter 0 Funde) ✅, Mobile-First (Telefone zuerst, 360 × 560 bis 1024 × 700) ✅,
CSS vor Skript (Höhe per CSS, keine Messung zur Laufzeit) ✅, Wächterfrage beantwortet (Punkte 5–8 im Skriptkopf) ✅,
Gegenproben gegen alte Stände ✅, alle Werkzeuge gegen den Build nach der letzten Korrektur ✅, Encoding ✅, keine
Kundennummer vergeben ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **R34-i, eigener Fehler:** Erster Abzug für die Knopfleiste fest 95 px, bei großer Grundschrift lag das Menü bis zu
   14 px über ihr. Behoben (`3rem + 47px`), Wächter misst den Fall, Gegenprobe meldet ihn.
2. 🟡 **R34-a:** Menülinks auf die eigene Seite bewegen nichts (z. B. „Rad & Glas“ auf `/leistungen`, Anker 6.316 px
   tiefer). Offen, Weg im Optimierungsplan.
3. 🟡 **R34-d:** „Karriere“ erst nach dem Scrollen erreichbar (Leistungsbaum davor rund 600 px). Entscheidung des Users.
4. 🟢 R34-b (Modifikator-Klick), R34-c (Scrollleiste Windows, nicht messbar), R34-e (ARIA Hamburger), R34-f (`tel:`
   lässt das Menü offen), R34-g (`index.css` 701 Zeilen): offen. R34-h (Bilder der Gegenprobe) behoben.
**Refactoring-Empfehlung:** R34-a und R34-b gemeinsam lösen, indem Navbar und Suchdialog einen Helfer für interne
Links teilen (gleiche Seite: selbst zum Anker oder nach oben gleiten; Modifikatoren durchlassen). Danach `npm run nav` um
„Link auf die eigene Seite“ erweitern.
