# Akkordeon unter 1024 px: Karte geht auch mit der Maus mittig auf (R33)

**Auftrag (User, 2026-10-19, „es geht wirklich nur um die mobile Ansicht“):** Fährt man mit der Maus über eine Karte,
geht sie nur nach unten auf und verschwindet unter der Knopfleiste; die Karten darüber rutschen dabei nach unten in die
Mitte. Gewünscht: „dass wenn ich auf eine Karte hover oder drauf tippe … diese Karte prominent gezeigt wird … zentriert
angezeigt … die obere Karte als auch die untere Karte nach oben jeweils und nach unten jeweils gepusht werden und nicht
einfach nur die unteren Karten nach unten“.

**Nummer:** R33 (Repo-Befund, nächste freie nach R32). Bezug: O8 im Optimierungsplan vom 17.10. (Gleiten beim
Darüberfahren damals bewusst abgeschaltet, weil es eine Kette auslöste).

**Branch:** `2026-10-19-akkordeon-mittig-maus` · **Status:** abgeschlossen. Vom User lokal im schmalen Fenster getestet
(2026-10-20: „R33 passt“), mit `main` zusammengeführt und gepusht. Offen nur die Folgeaufgabe R33-a (Stimmen, eigene
Session). `vite.config.ts` gehört nicht zu R33 (eigener Commit `655d574`, Dev-Server ignoriert `.claude/worktrees`).

---

### ✅ Phase 1 — Ist-Zustand gemessen
**Ziel:** Die Beschreibung des Users nachstellen, bevor etwas geändert wird.
* [x] Build 19:24:44, 390 × 844 mit Maus (`hover: hover`), Startseite #leistungen, je Fall von links auf die
      Streifenmitte gefahren, 1,5 s gewartet (Skript im Scratchpad, `mittig/ist.mjs`):
      | Fall | vorher (Streifen) | nachher (Karte) | verdeckt | Karten darüber |
      |---|---|---|---|---|
      | Karte 2 bei 78 % (Beispiel 1 des Users) | 638–702 | 638–978 | **217 px** unter der Knopfleiste (ab 761) | Karte 1: 288 → **564** (rutscht 276 px nach unten) |
      | Karte 3 bei 50 % (Beispiel 2) | 422–486 | 422–762 | 1 px | Karten 1, 2: −2 → **274**, 72 → **348** |
      | Karte 6 bei 20 % | 168–232 | 168–508 | 0 | 4 und 5 unverändert |
* [x] **Ursache:** Beim Darüberfahren hält `akkordeonMobil.ts` die Oberkante der Karte fest (Verankerung) und gleicht
      das Zuklappen der offenen Karte darüber per Scrollen aus. Ohne Mitgleiten wächst die Karte nur nach unten, und
      alles darüber rückt um die Höhendifferenz (276 px) nach unten: „das obere Akkordeon wird runter ins Zentrum
      geschoben“.
* [x] **Tippen ist schon richtig** (390 × 844, Touch): alle drei Fälle mittig bei 249–589, 0 px verdeckt.
* [x] **Warum die Maus nicht mitgleitet (O8, 17.10.):** Glitt die Seite beim Darüberfahren, rutschte die nächste Karte
      unter den ruhenden Zeiger, ging auf, die Seite glitt weiter: eine Kette ohne Zutun.
* [x] **Ereignisse geprüft** (Chrome sichtbar und headless, `mittig/zeiger.mjs`): Bewegt sich Inhalt unter einer ruhenden
      Maus (Scrollen, Mausrad), feuert Chrome `pointerover`/`pointerenter`/`mouseover`/`mouseenter`, **kein**
      `pointermove`/`mousemove`, und die Bildschirmkoordinaten bleiben gleich. Die alte Kette lief über `onMouseEnter`.
**Referenzen:**
`components/akkordeonMobil.ts`
`components/ExpandingCardAccordion.tsx`
`docs/mobil-akkordeon-faq/tasks/2026-10-17-mobil-akkordeon-faq-tasks.md`

### ✅ Phase 2 — Maus wie Finger: mittig, ohne Kette
**Ziel:** Unter 1024 px geht jede Karte mittig im freien Bereich auf, egal ob per Tipp, Klick, Tastatur oder
Darüberfahren. Die Nachbarn weichen nach oben und unten aus. Keine Kette, kein Aufgehen beim Scrollen mit dem Mausrad.
* [x] **Lösungswege abgewogen:**
      (a) Mitgleiten auch beim Darüberfahren, Schutz über die Zeigerabsicht. Gewählt: genau der Wunsch („zentriert“),
          gleiches Verhalten wie beim Tipp, das der User seit dem 17.10. kennt.
      (b) Karte um ihre eigene Mitte aufgehen lassen und nur so weit schieben, dass sie ganz sichtbar ist (Zeiger bleibt
          auf der Karte). Verworfen: Unten im Fenster stünde sie unten statt mittig, „zentriert“ wäre nicht erfüllt.
      (c) Unter 1024 px nur noch per Klick aufklappen. Verworfen: widerspricht „wenn ich mit der Maus drüber hover“.
* [x] `akkordeonMobil.ts`: Mitgleiten immer (Parameter `mittig` entfällt). Neu `useZeigerAbsicht` (257 Zeilen gesamt):
      1. nur echte Bewegung: `pointermove` mit anderen Bildschirmkoordinaten als das vorige, im ganzen Fenster verglichen,
         und nicht während oder bis 250 ms nach einem Scrollen;
      2. Ruhe 120 ms (Zittern unter 4 px zählt nicht), dann Treffertest an der Zeigerstelle;
      3. läuft eine Kartenbewegung oder gleitet Lenis, verfällt die Absicht.
* [x] `ExpandingCardAccordion`: `onMouseEnter` nur noch am Desktop; unter 1024 px klappt ein Klick auf eine zugeklappte
      Karte auf (wie ein Tipp, zweiter Klick folgt dem Link); Tastaturfokus nur bei `:focus-visible`, dann mittig.
* [x] **Gemessen nach dem Umbau** (390 × 844, Maus, `mittig/ist.mjs`): alle drei Fälle mittig bei 249–589, 0 px
      verdeckt. Beispiel 1: Karte 1 geht jetzt 288 → 175 (nach oben) statt 288 → 564.
* [x] **WebKit (Safari-Engine), `pw/maus-webkit.mjs`:** Nach dem Scrollen schickt WebKit Ersatzbewegungen als
      `pointermove`, meist mit denselben Koordinaten. Im sichtbaren WebKit kam nach dem Mausrad aber eine an anderer
      Stelle (663,474 → 450,409), und Karte 7 ging auf (900 × 800, 2 von 2 Läufen). Darum die 250 ms Scroll-Stille
      in Regel 1. Danach 8 von 8 Läufen sauber (6 sichtbar, 2 headless): mittig (239/253 = Soll), keine Kette in Ruhe,
      auf dem Weg und beim Mausrad.
* [x] Gegenkontrollen: Desktop 1440 × 900 klappt nach 60 ms beim Darüberfahren auf, Scroll unverändert (1082 → 1082).
      Schmal 393 × 851 mit Tab: Fokus auf Karte 2 (`:focus-visible`), offen und mittig (253 = Soll).
* [x] Bildstreifen der Animation für den User: `output/akkordeon-maus-mittig.png` (Beispiel 1 oben, Beispiel 2 unten).
* [x] Beim Durchsehen des Diffs: Die aktuelle `oeffnen`-Fassung wurde im Rendern in einen Ref geschrieben (React rät
      davon ab, ein verworfener Render hinterließe einen veralteten Stand). Jetzt im `useLayoutEffect`. Danach Build
      21:27:54 und alle Messungen dieser Phase erneut: gleich (WebKit 6 von 6, Beispiele mittig, Desktop, Tastatur).
**Referenzen:**
`components/akkordeonMobil.ts`
`components/ExpandingCardAccordion.tsx`

### ✅ Phase 3 — Prüfer `npm run akkordeon`
* [x] Test „Hover ohne Gleiten“ ersetzt durch „Maus im schmalen Fenster“ (Kopf Punkt 10), in 900 × 800 und 393 × 851:
      (a) Darüberfahren → offen und mittig, (b) Ruhe → keine Kette, (c) Weg über die Streifen (20 ms je Schritt) → nichts
      geht auf, (d) Mausrad bei ruhendem Zeiger → nichts geht auf, (f) danach Darüberfahren über eine andere Karte →
      geht auf, mittig (der Schutz würgt das Darüberfahren nicht ab), (e) Klick auf eine zugeklappte Karte → klappt auf,
      mittig, kein Seitenwechsel. 652 Zeilen.
* [x] Ergebnis (Build 21:27:54, vorher gleich auf 21:20:28): 900 × 800 Karte 5 580 → 238 (Soll 239), 393 × 851 618 → 253 (Soll 253), keine Kette,
      Karte 6 per Darüberfahren offen, Klick auf Karte 4 aufgeklappt. Tipp-Teil unverändert grün.
* [x] **Gegenprobe:** „ohne Gleiten“ (`window.scrollTo` leer) → 304 statt 239 gemeldet; „Kette“ (die Seite klickt jede
      zugeklappte Karte unter dem Zeiger an, wie das frühere `mouseenter`) → Kette gemeldet, Karte 5 wandert auf −132 px.
      Zusammen mit den vier bisherigen Fehlerarten: alle gemeldet.
**Referenzen:**
`scripts/check-akkordeon.mjs`
`CLAUDE.md`

### ✅ Phase 4 — Build und alle Werkzeuge
* [x] Alles gegen denselben Build **21:27:54**: `akkordeon` ok (und Gegenprobe ok), `kontrast` 6338 Stellen ok, `mobil`
      0 harte Befunde (257 Hinweise „Schrift unter 12 px“ wie seit dem 15.10.), `faq-mobil` ok (26 Routen), `leerlauf`
      ok (29 Routen × 2 Fenster ohne Bilder im Leerlauf), `cls` 0/0, `aussparung` ok, `zielgruppen` ok, `meta` 0,
      `tote-dateien` ok, `zeichnen` 29 Routen × 4 Fenster ohne Befund (Eichung 90,5 %, 16 Masken).

### ✅ Phase 5 — Doku
* [x] `CLAUDE.md`: Zeile `npm run akkordeon` (Maus im schmalen Fenster, Gegenprobe).
* [x] Optimierungsplan: `2026-10-19-akkordeon-mittig-maus-optimierung-tasks.md`.

---

## Kommentare

### Phase 1
**Eingehalten:** erst gemessen, dann geändert ✅, Tippen als Vergleich gemessen ✅, früheren Grund (O8) gelesen statt
übergangen ✅, Ereignisse im Browser geprüft statt angenommen ✅.
**Auffälligkeiten:** keine neuen; die Beschreibung des Users deckt sich mit der Messung bis auf den Pixel.

### Phase 2
**Eingehalten:** unter 700 Zeilen ✅ (538 und 257), Desktop unverändert ✅, CSS/Compositor-Bewegung unverändert (nur
Auslöser geändert) ✅, Kommentare mit Messwerten ✅, Safari-Engine geprüft statt nur Chrome ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (behoben):** Erste Fassung der Bewegungsprüfung verglich nur Bewegungen über den Karten; WebKit hätte nach
   dem Scrollen einmal falsch geöffnet. Jetzt im ganzen Fenster plus Scroll-Stille.
2. 🟡 **Mittel (offen, Folgeaufgabe):** Die Mitarbeiterstimmen (`Stimmen.tsx`, /karriere) öffnen unter 1024 px weiter per
   `mouseenter`, animieren die Höhe und gleiten nicht mittig (R33-a).
3. 🟢 **Niedrig:** 120 ms Ruhe vor dem Aufgehen mit der Maus; am echten Trackpad nicht gefühlt geprüft (R33-b).

### Phase 4
**Eingehalten:** nach der letzten Korrektur alle Werkzeuge gegen denselben Build ✅.
**Auffälligkeiten:** keine.

### Phase 3
**Eingehalten:** Pflichtfrage im Kopf beantwortet (was der Test nicht zeigt) ✅, Gegenprobe für beide neuen Fehlerarten ✅,
Positivprobe gegen einen zu strengen Schutz ✅, unter 700 Zeilen ✅ (652).
**Auffälligkeiten:** keine.
