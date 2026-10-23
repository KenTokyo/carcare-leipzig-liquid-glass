# Mitarbeiterstimmen unter 1024 px: dieselbe Mechanik wie die Leistungskarten (R33-a)

**Auftrag (Sitzung R33, 2026-10-19):** Das Akkordeon „Aus dem Team“ auf /karriere (`components/Stimmen.tsx`) unter
1024 px auf die Mechanik der Leistungskarten bringen (`ExpandingCardAccordion` + `akkordeonMobil.ts`): Höhe springt
einmal, sichtbar bewegt sich nur `transform`, jede aufgehende Stimme gleitet mittig zwischen Navbar und Knopfleiste,
Maus nur über `useZeigerAbsicht`. Desktop ab 1024 px und Gestaltung (Kachel unten, Bildlage, senkrechter Beruf)
unverändert. `npm run akkordeon` deckt die Stimmen ab, mit Gegenprobe.

**Nummer:** R33-a aus `2026-10-19-akkordeon-mittig-maus-optimierung-tasks.md`. Deckt zugleich **R25** aus
`docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-optimierung-tasks.md` ab (Stimmen animieren mobil die Höhe).

**Branch:** `claude/quizzical-driscoll-12ff68` (Worktree). **Basis:** `origin/main` = `dcaa814` (R33 committet als
`e90d026`, Merge `b9c1513`). Bis dahin lag R33 nur uncommittet im Haupt-Checkout; ich hatte den Stand als ersten Commit
übernommen (`03391a0`, Prüfsummen gleich). Nach dem Commit von R33 auf diesen Stand umgesetzt (`git rebase --onto
origin/main 03391a0`), `03391a0` dabei weggelassen; Code-Dateien von R33 waren identisch, ein Konflikt nur im
R33-Optimierungsplan (benachbarte Zeilen R33-a/b/c, beide Seiten übernommen). Danach alle Werkzeuge neu gemessen
(Phase 5). **Status:** umgesetzt, gemessen, committet, nicht gepusht (Push nur mit Zustimmung des Users, vorher
`npm run push-stand`).
**Nummer des Dreh-Fehlers:** R33-e (Unterpunkt von R33 wie R33-a bis R33-d), nicht R34: R34 hat die Sitzung
`nav-mobil-menue` reserviert (Notizordner, 20.10.), deren Änderung am Nummernzeiger in
`docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-optimierung-tasks.md` (Zeile 8) noch nicht committet ist. Eine
neue Hauptnummer hätte dieselbe Zeile geändert.

---

### ✅ Phase 1 — Ist-Zustand messen
**Ziel:** Vor dem Umbau wissen, was die Stimmen heute tun, und Vergleichsbilder für „Gestaltung unverändert“ haben.
* [x] Build des Ausgangsstands (**22:43:06**, Basis-Commit) als Kopie gesichert; Messskript im Scratchpad
      (`stimmen/messen.mjs`: eigener `vite preview` je Build, also alt und neu am selben Rechner).
* [x] **Tipp** (393 × 851, Touch, frisch geladen, Stimme 1 offen):
      | Fall | vorher (Streifen) | nachher (Karte) | mittig wäre | verdeckt | Karten darüber |
      |---|---|---|---|---|---|
      | Stimme 2 bei 78 % | 644–708 | 208–708 | 173 | 0 | Stimme 1 bleibt bei 134 |
      | Stimme 3 bei 50 % | 405–469 | **−31**–469 | 173 | **109 px unter der Navbar** | Stimme 2: 331 → −105 |
      | Stimme 5 bei 20 % | 150–214 | 150–650 | 173 | 0 | Stimme 1 (oberhalb): −582 → −146 |
      | Stimme 5 bei 78 % | 644–708 | 226–726 | 173 | 0 | Stimmen 2–4: 422/496/570 → 4/78/152 |
      Die Stimme wächst je nach Lage nach oben oder unten (Chromes Scroll-Verankerung während der Höhen-Animation),
      steht nie mittig und verschwindet bei 50 % mit dem Kopf unter der Navbar: dasselbe Muster wie O6 vom 16.10.
* [x] **Maus** (Darüberfahren, Stimme 5 bei 75 %): 900 × 800 → 227–727 statt mittig 159, **10 px unter der
      Knopfleiste**; 393 × 851 → 198–698 statt 173. Geht sofort per `mouseenter` auf. Der Mausrad-Test meldete nichts,
      ist aber schwach: Danach lag der Zeiger noch auf der offenen Stimme, kein Streifen kam unter ihn.
* [x] **Spur** (393 × 851, CPU 4×, Tipp auf Stimme 3, 3 Läufe gleich): **27 Layouts in 30 Hauptthread-Bildern**
      150–650 ms nach dem Tipp (90 %, Grenze im Prüfer 80 %), 34 Layouts in 700 ms, 2 Animationen nicht auf dem
      Compositor (`object-position`), 3,7 ms Hauptthread je Bild.
* [x] **Aufnahmen** je Breite (360, 390, 430, 768) jede Stimme einmal offen (feste Leisten ausgeblendet), Pixeldichte 2:
      20 Bilder als Sollbild für „Gestaltung unverändert“ (Streifen und offene Karten).
**Referenzen:**
`components/Stimmen.tsx`
`docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-optimierung-tasks.md`

### ✅ Phase 2 — Lösungsweg wählen
* [x] **Wege:**
      (a) Stimmen auf `useMobilAkkordeon` und `useZeigerAbsicht` umstellen, Fenster/Inhalt/Bildebene/Schatten wie die
          Leistungskarten, das Gerüst (Schatten, Fenster, Inhalt) als gemeinsamer Baustein für beide. **Gewählt.**
      (b) Stimmen als Spielart von `ExpandingCardAccordion`. Verworfen: Links gegen Zitate (`figure`), Kachel unten,
          senkrechter Beruf unten, eigene Bildlage; die Datei hat 538 Zeilen und läge danach über 700.
      (c) Höhe weiter per Framer, nur Mitgleiten und Zeigerabsicht ergänzen. Verworfen: Layout in jedem Bild (R25)
          bliebe, genau das soll weg.
      (d) CSS (`interpolate-size`, `scrollIntoView`). Verworfen: wieder Layout je Bild, Safari ohne `interpolate-size`.
* [x] **Bildebene, die eigentliche Frage:** Mit Fenster/Inhalt steht das Bild immer im Format der offenen Karte
      (500 px hoch). Die Leistungskarten zeigen im Streifen die Bildmitte; bei den Stimmen läge dort Mund und Kinn.
      (a1) Bildmitte wie die Leistungskarten: verworfen, Gesichter falsch angeschnitten.
      (a2) nur verschieben, Augenlinie wie bisher: Gesicht im Streifen 1,1-fach (390 px) bis 1,4-fach (320 px) näher.
      (a3) **gewählt:** Bildebene eingeklappt verschieben UND skalieren (eine Abbildung, Ursprung oben links), aus
          Fotomaßen, Fokuspunkt und gemessener Kartenbreite gerechnet. Der Streifen zeigt damit denselben Ausschnitt wie
          bisher (`object-position` x % (y − 6) %, Zoom 1,05); geprüft per Pixelvergleich alt gegen neu.
* [x] **Zweiter Klick auf die offene Stimme:** (a) nichts, (b) zuklappen, (c) ganz ins Bild holen. Zuklappen verworfen:
      Es ist immer genau eine Stimme offen (wie auf der Startseite), einen Zustand „keine offen“ kennt auch das
      Desktop-Layout nicht. **Gewählt (c):** Steht die offene Stimme nicht ganz im freien Bereich, gleitet sie mittig
      (wie beim Aufgehen); steht sie ganz darin, passiert nichts. Nur unter 1024 px und nur per Klick oder Tipp, nicht
      beim Darüberfahren. Das ist der Wunsch hinter R33 („prominent gezeigt“), und eine Stimme hat kein Ziel, dem ein
      zweiter Klick folgen könnte.

### ✅ Phase 3 — Umbau `Stimmen.tsx` (und gemeinsame Teile)
**Ziel:** Stimmen unter 1024 px mit der Mechanik der Leistungskarten, Gestaltung und Desktop unverändert.
* [x] `akkordeonKarten.tsx`: `KARTEN_RAHMEN` jetzt in der mobilen Fassung (Beschnitt und Schatten erst ab `lg`, keine
      Tipp-Hervorhebung; vorher als `RAHMEN` nur in `ExpandingCardAccordion`) und neu **`KartenFenster`**: Schatten,
      Fenster und Inhalt als ein Baustein für beide Akkordeons. Bis hierher hatte jede Kopie ihr eigenes Gerüst; genau so
      waren die Stimmen am 16./17.10. zurückgeblieben.
* [x] `akkordeonMobil.ts`: `mobilLage(sichtbar, hoehe, bildZu?)` mit **`BildZu`** (Bildebene im Streifen als Abbildung:
      Maßstab, dann Verschiebung, linear mit dem Öffnungsgrad; ohne Angabe wie bisher die Bildmitte, Leistungskarten
      unverändert), `useMobilAkkordeon(…, bildZu?)`, neu **`zeigen(idx)`** (offene Karte mittig, wenn angeschnitten),
      `bewegtSich` (Regel 3 der Zeigerabsicht, jetzt auch von `zeigen` genutzt), `fokusSichtbar` hierher verschoben.
* [x] `Stimmen.tsx` (316 Zeilen): Höhe springt über `style`, Framer nur am Desktop (`flexGrow`), Fenster/Inhalt/Bildebene/
      Schatten über `KartenFenster` und `data-akk="bild"`, `useMobilAkkordeon`, `useZeigerAbsicht`, `data-akk-offen`.
      Schleier und Platzhalterrand in zwei Fassungen wie auf der Startseite (Streifen eingeklappt, groß offen).
      Ereignisse: `mouseenter` nur am Desktop; Fokus unter 1024 px nur sichtbar (Tabulator); Klick auf eine zugeklappte
      Stimme klappt auf, auf die offene ruft `zeigen`.
* [x] **Bildlage im Streifen** (`bildGeometrie`): Abbildung aus Fotomaßen, Fokuspunkt und gemessener Kartenbreite
      (`ResizeObserver` im Layout-Effekt, also vor dem ersten Bild). Erster Pixelvergleich: Gesichter deckungsgleich, aber
      links und rechts **graue Ränder** (360 px: 8 bis 13 % der Streifenpixel um mehr als 24 von 255 verschieden).
      Ursache: `object-cover` schneidet das Foto am eigenen Kasten ab, verkleinert im Streifen reicht es nicht mehr bis
      zum Rand. Behoben: Mobil steht das Bild in **fester Größe** (so groß und so verschoben, wie `object-cover` mit
      x % 30 % es offen zeigt), zugeschnitten wird nur vom Fenster.
* [x] **Gemessen, Build 23:08:27** (alter Build 22:43:06 am selben Rechner, `stimmen/messen.mjs`; nach R33-e am Build
      23:42:32 wiederholt, gleich):
      | | alt | neu |
      |---|---|---|
      | Tipp Stimme 2 bei 78 % | 208–708 | **173–673** (Soll 173) |
      | Tipp Stimme 3 bei 50 % | −31–469, 109 px unter der Navbar | **173–673** |
      | Tipp Stimme 5 bei 20 % / 78 % | 150–650 / 226–726 | **173–673** / **173–673** |
      | Maus 900 × 800, Stimme 5 | 225–725, 8 px unter der Knopfleiste | **158–658** (Soll 159) |
      | Maus 393 × 851, Stimme 5 | 199–699 | **173–673** |
      | Spur: Layouts spät / Bilder | 26–27 / 28–30 (90–93 %) | **1 / 29–30 (3 %)** |
      | Spur: nicht auf dem Compositor | 2 (`object-position` am Bild) | **0** |
      | Hauptthread je Bild (4×) | 3,5–3,7 ms | **1,0–1,3 ms** |
      Die Karten darüber weichen nach oben aus (z. B. Stimme 1: 134 → 99), die darunter nach unten.
* [x] **Pixelvergleich alt gegen neu** (je Breite jede Stimme einmal offen, Pixeldichte 2, `stimmen/vergleich.mjs`):
      offene Karten gleich (höchstens 36 von 255 an einzelnen Pixeln); Streifen 0 bis 2,3 % der Pixel über 24, im
      Mittel 0,2 bis 3,7 von 255. Versatzsuche (±3 Gerätepixel): beste Deckung in 14 von 16 Streifen bei (0, 0), sonst
      ein Gerätepixel (halber CSS-Pixel) mit kaum besserem Mittel. Der Rest ist Kantenglättung (das Bild wird jetzt als
      Ebene skaliert statt direkt in Streifengröße gemalt), im Differenzbild nur Konturen.
* [x] **Zwischenbilder** (alle Animationen der Liste bei 25/50/75 % angehalten, auf- und zuklappend): Bild durchgehend,
      keine Ränder; die Kachel wird von der wandernden Fensterkante aufgedeckt, der Streifenschleier blendet in 300 ms
      über, wie auf der Startseite.
* [x] **Desktop** 1024 × 768, 1440 × 900, 1920 × 945, jede Stimme einmal offen: pixelgleich (höchstens 3 von 255),
      Lagen gleich. **Startseiten- und Stellenkarten**: DOM in 393 und 1440 px (Startseite) und 393 px (/karriere)
      gleich, bis auf das neue `data-akk-offen`.
**Referenzen:**
`components/Stimmen.tsx`
`components/akkordeonMobil.ts`
`components/akkordeonKarten.tsx`

### ✅ Phase 4 — Prüfer `npm run akkordeon`
**Ziel:** Die Stimmen messen wie die Leistungskarten, mit Gegenprobe, und beantworten, was der Prüfer bei ihnen übersähe.
* [x] **Karten an `data-akk-offen`** statt an `a[aria-expanded]` (Stimmen sind Listeneinträge, `aria-expanded` ist dort
      in ARIA nicht erlaubt). Beide Akkordeons schreiben den Zustand aus React, nicht aus der Höhe.
* [x] Aufgeteilt, damit keine Datei über 700 Zeilen kommt: `scripts/lib/akkordeon-seite.mjs` (44 Zeilen: Karten, freier
      Bereich, Stellen-Pop-up), `scripts/lib/akkordeon-maus.mjs` (221 Zeilen, Maus-Teil jetzt je Ziel), `check-akkordeon.mjs` 591 (vorher 652).
* [x] **Tipp-Teil:** Ziel `/karriere #stimmen` (Tipp auf Stimme 2, Unterbrechung, offene Stimme oberhalb und Tipp auf
      die letzte). Alle Kriterien unverändert, dazu neu **BILDLAGE** (Pflichtfrage beantwortet: Die Kartengeometrie hätte
      die grauen Ränder aus Phase 3 nicht gemeldet): je zugeklappte Stimme Foto deckt den Streifen, Augenlinie und
      Gesichtsmitte höchstens 1,5 px neben der Lage von vor R33-a, nachgerechnet aus `data/stimmen.ts` (per esbuild wie in
      `check-dummies.mjs`), unabhängig von `bildGeometrie`. Die Tabelle nennt die Werte, damit ein grüner Lauf belegt, dass
      gemessen wurde („Bildlage in 12 Streifen: höchstens 0.0 px daneben, Rand bedeckt“).
* [x] **Maus-Teil** je Ziel (Leistungen Karte 5, Stimmen Stimme 4, je bei 75 %): Für die 500 px hohe Stimme beginnt der
      Weg (c) am nächsten Streifen, wenn der Zeiger nach dem Gleiten auf ihr liegt; das Mausrad (d) dreht genau so weit,
      dass ein zugeklappter Streifen unter den Zeiger kommt (mit festen 260 px hätte die alte Kette bei den Stimmen
      bestanden, siehe Phase 1), sonst Messfehler; neu (g): zweiter Klick auf die zur Hälfte verdeckte offene Stimme.
      Zwei Prüferfehler im ersten Lauf behoben: (f) fuhr nach dem genau dosierten Rad auf die Stelle, an der der Zeiger
      schon stand (keine Bewegung, also zu Recht nichts geöffnet), jetzt eine andere Karte oder eine andere Stelle; (c)
      und (f) verlangten Streifen ganz im freien Bereich, neben der offenen Stimme bleiben in 900 × 800 nur 58 px, jetzt
      Treffertest.
* [x] **Ergebnis** (Build 23:42:32, voller Lauf): Stimmen 1 spätes Layout in 22 bis 30 Bildern, 0 abseits des
      Compositors, 0,5 px/ms, +0,2 px neben der Mitte, 0 Schatten außerhalb, Bildlage 0,0 px; Maus 900 × 800 Stimme 4
      580 → 158 (Mitte 159), 393 × 851 618 → 173 (173), keine Kette, Darüberfahren nach dem Rad öffnet, Klick klappt auf,
      zweiter Klick: 360 px verdeckt → mittig. Leistungen, Autoaufbereitung, Stellen unverändert grün.
* [x] **Gegenprobe** (alle Ziele): 4 von 4 Höhen-Animationen (Stimmen 29 von 29 Bildern mit Layout), 4 von 4
      Tipp-Hervorhebungen, 4 von 4 Fensterschatten, 4 von 4 abgeschaltete Scrollbewegungen (Stimmen 287 px neben der
      Mitte), 4 von 4 Maus-Fehlern (je Ziel ohne Gleiten und Kette), 2 von 2 Bildlage-Fehlern (Bildmitte wie bei den
      Leistungskarten: 127,5 px daneben; Foto im Kasten der Bildebene: 13 px frei). Exit 0.
**Referenzen:**
`scripts/check-akkordeon.mjs`
`scripts/lib/akkordeon-maus.mjs`
`scripts/lib/akkordeon-seite.mjs`

### ✅ Phase 4b — Gefunden beim Gegencheck: Karten nach dem Drehen 0 px breit (R33-e)
**Ziel:** Randfälle prüfen, die kein Werkzeug abdeckt: Tabulator im schmalen Fenster, Wechsel schmal ↔ Desktop.
* [x] Tabulator (393 × 851): Fokus auf Stimme 2 sichtbar, offen, mittig (173 = Soll). Desktop: Klick auf die offene
      Stimme scrollt nicht. Schmal → Desktop → schmal: Inline-Stile wie beim ersten Laden.
* [x] **Befund R33-e:** Nach dem Wechsel von schmal auf breit (iPad hoch → quer, 820 → 1180, oder Fenster aufziehen)
      waren **alle Karten 0 px breit**, das Akkordeon verschwand. Gemessen am alten Build: Leistungen und Stellen
      betroffen (seit 16.10., `animate` nur am Desktop), die alten Stimmen nicht (418/139 px); mein erster Umbau hätte es
      auf die Stimmen übertragen. Ursache: Framer übernahm ein `animate`, das erst nach dem Einhängen dazukam, nie
      (Inline-Stil leer, `flex-grow` 0, keine Animation, auch nach 3 s).
* [x] Behoben in beiden: `animate` immer gesetzt, unter 1024 px `flexGrow` fest 1 (bewegt dort nichts, also kein Layout
      je Bild, O3 vom 16.10. bleibt erfüllt), Höhe am Desktop per `lg:h-full` in `KARTEN_RAHMEN` statt Framers
      `height: 100%`. Danach 820 → 1180: Leistungen 366/61 px, Stellen 659/110, Stimmen 418/139 (wie vorher).
* [x] Gegengeprüft: Startseite (#leistungen, #autoaufbereitung) und /karriere (#jobbereiche) alt gegen neu als Bild in
      1440, 1024 und 390 px: pixelgleich (höchstens 10 von 255 an Einzelpixeln); Stimmen am Desktop pixelgleich, mobile
      Streifen wie in Phase 3.
* [x] **Wächter:** `npm run akkordeon` prüft das Drehen jetzt selbst (`scripts/lib/akkordeon-drehen.mjs`, je Akkordeon
      820 × 1180 → 1180 × 820 → zurück: breit jede Karte über 20 px und die offene am breitesten, zurück senkrecht).
      Pflichtfrage: Was bestünde er trotz Fehler? Andere Wechselfolgen und echtes Drehen (iOS ändert die Höhe
      schrittweise), Lage und Bewegung nach dem Wechsel (im Kopf des Moduls). **Gegen den echten Fehler geprüft:** Fix
      kurz zurückgenommen, gebaut, `npm run akkordeon -- /karriere` meldete Stellen 0/0/0/0 und Stimmen 0/0/0/0/0 px;
      Fix wiederhergestellt (Prüfsummen gleich). Gegenprobe zusätzlich per `flex-grow: 0` am Desktop.
**Referenzen:**
`components/ExpandingCardAccordion.tsx`
`components/akkordeonKarten.tsx`

### ✅ Phase 4c — Nachbesserungen aus der Durchsicht des Diffs
* [x] **O5:** `zeigen` (zweiter Klick) wartete auch, solange Lenis nach nativem Scrollen noch 400 ms `'native'` meldet;
      ein Tipp kurz nach dem Wischen tat nichts. Jetzt `bewegtSich(karten, false)`: nur Lenis' eigenes Gleiten und
      laufende Kartenanimationen. Die Zeigerabsicht prüft weiter auch `'native'` (dort ist der Inhalt unter dem Zeiger
      weitergerückt).
* [x] **O6:** Kartenbreite per `getBoundingClientRect().width` statt `clientWidth` (gerundet): bei Browser-Zoom krumme
      Breiten, die Bildlage im Streifen läge sonst um Bruchteile eines Pixels daneben.
* [x] Safari-Engine (Playwright-WebKit aus der R33-Sitzung, nur gelesen, `stimmen/webkit.mjs`, 3 Läufe kopflos):
      Maus 900 × 800 Stimme 4 580 → 159 (Soll 159), 393 × 851 619 → 173 (173), keine Kette in Ruhe, Mausrad 292 px mit
      Stimme 5 unter dem Zeiger: bleibt zu; Tipp 390 × 844 Stimme 3 → 170–670 (Soll 169, Rundung); Streifenbild alt gegen
      neu in WebKit 0 bis 0,12 % der Pixel über 24, im Mittel 0,2 bis 1,1 von 255.
**Referenzen:**
`components/akkordeonMobil.ts`
`components/Stimmen.tsx`

### ✅ Phase 5 — Alle Werkzeuge gegen denselben Build
**Ziel:** Nach der letzten Korrektur jedes Werkzeug aus CLAUDE.md gegen einen Build, nacheinander (nicht parallel: Läufe mit
CPU-Drossel und Bildzählung verfälschen sich unter Last).
* [x] Erster Durchgang abgebrochen: O5/O6 standen noch aus. Zweiter Durchgang: Build brach ab, weil eine parallele
      Sitzung (`nav-mobil-menue`) gleichzeitig baute und den festen Prerender-Port 4319 belegte (`check-faq-html`: 1 von 29
      Seiten, O10). Danach Läufe mit Warten auf freie Ports und Wiederholung bei Konflikt (Skript im Scratchpad).
* [x] **Build 23:58:32** (vorgerendert 30/30), dagegen alle grün:
      | Werkzeug | Ergebnis |
      |---|---|
      | `akkordeon` | ok: 4 Akkordeons im Tipp-Teil (Stimmen 1/29 Bilder mit spätem Layout, +0,2 px, Bildlage in 12 Streifen 0,0 px, Rand bedeckt), Maus je 2 Fenster für Leistungen und Stimmen (Stimme 4 → 158/173 = Mitte, zweiter Klick: 360 px verdeckt → mittig), Drehen 4 von 4 (Stimmen 418/139 px, zurück 500/64) |
      | `akkordeon -- --gegenprobe` | 4/4 Höhen-Animationen, 4/4 Hervorhebungen, 4/4 Fensterschatten, 4/4 Scrollbewegungen, 4/4 Maus-Fehler, 2/2 Bildlage, 4/4 Drehen; Exit 0 |
      | `mobil` | 0 harte Befunde (29 Routen × 3 Fenster), 257 Hinweise „Schrift unter 12 px“ wie seit dem 15.10. |
      | `cls` | 0 harte Befunde, 0 Hinweise (29 Routen × 4 Fenster, CPU 4×) |
      | `kontrast` | 6342 Textstellen, kein Text unter WCAG AA |
      | `leerlauf` | ok: 29 Routen × 2 Fenster ohne Bilder im Leerlauf, Lenis gleitet und steht wieder |
      | `zeichnen` | Eichung 90,5 % / 16 Masken; 29 Routen × 4 Fenster: 0 Befunde, 0 Lücken, 0 Hinweise |
      | `faq-mobil` | ok: 26 Routen |
      | `aussparung` | ok: 29 Routen × 3 Fenster, Geometrie an 23 Breiten |
      | `zielgruppen` | ok |
      | `meta` | 0 außerhalb des Korridors |
      | `tote-dateien` | ok (`Jobs.tsx` geparkt) |
* [x] **Nach dem Umsetzen auf `origin/main` (dcaa814) erneut, Build 20.10. 01:01:44**, wieder nacheinander: `akkordeon`
      ok (Stimmen 1/29 Bilder mit spätem Layout, +0,2 px, Bildlage 0,0 px, Maus 158/173 = Mitte, zweiter Klick mittig,
      Drehen 418/139 px), Gegenprobe vollständig (4/4, 4/4, 4/4, 4/4, 4/4, 2/2, 4/4), `mobil` 0 harte Befunde
      (257 Hinweise), `cls` 0/0, `kontrast` 6341 Textstellen ok, `leerlauf` ok, `zeichnen` 0/0/0 (Eichung 90,5 %),
      `faq-mobil` ok, `aussparung` ok, `zielgruppen` ok, `meta` 0, `tote-dateien` ok.
* [x] WebKit gegen den Build 23:58:32 wiederholt: unverändert (Maus 159/173 = Soll, keine Kette, Tipp 170 bei Soll 169,
      Streifen alt gegen neu Ø 0,2 bis 1,1 von 255).
* [x] **O5 geprüft:** Tipp auf die zur Hälfte verdeckte offene Stimme direkt nach nativem Scrollen (Lenis meldet dabei
      `lenis-scrolling`): gleitet mittig (173 = Soll), 3 von 3 Läufen. Mit der alten Bedingung (jedes `isScrolling`) hätte
      `zeigen` hier abgebrochen; abgeleitet aus dem gemessenen Zustand, nicht gegen einen alten Build gemessen.

### ✅ Phase 6 — Doku
* [x] `CLAUDE.md`: Zeile `npm run akkordeon` (Stimmen, `data-akk-offen`, BILDLAGE, Maus je Ziel, zweiter Klick, Drehen,
      Gegenprobe, Anlässe für einen Lauf um `Stimmen.tsx` und die Fotos in `data/stimmen.ts` ergänzt).
* [x] Optimierungspläne: R33-a ✅ und R33-e neu ✅ (R33), R33-c um WebKit ergänzt; R25 ✅ (16.10. und 17.10.); eigener Plan
      `2026-10-19-stimmen-mobil-mechanik-optimierung-tasks.md` (O1 bis O10).
* [x] Übergabenotiz für die R33-Sitzung im gemeinsamen Notizordner (Basis-Commit, R33-e betrifft ihre Karten, Ports).

---

## Kommentare
### Phase 1
**Eingehalten:** erst gemessen, dann geändert ✅, alter Build gesichert und am selben Rechner gegen den neuen gemessen ✅,
Tipp, Maus und Spur getrennt ✅, Sollbilder vor dem Umbau ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Getippte Stimme wächst bei halber Fensterhöhe mit dem Kopf 109 px unter die Navbar (Muster O6 vom 16.10.).
2. 🟡 **Mittel:** Layout in 27 von 30 Bildern, 2 Animationen abseits des Compositors (`object-position`).
3. 🟢 **Niedrig:** Der Mausrad-Test in R33 war für 500 px hohe Karten wirkungslos (Zeiger danach auf keiner Karte).

### Phase 2
**Eingehalten:** vier Wege und drei Bildlagen abgewogen ✅, Gestaltungsvorgabe als Messkriterium übersetzt (Pixelvergleich) ✅,
zweiter Klick begründet entschieden ✅.
**Auffälligkeiten:** keine.

### Phase 3
**Eingehalten:** unter 700 Zeilen ✅ (Stimmen 316, akkordeonMobil 323, akkordeonKarten 132, ExpandingCardAccordion 496),
Desktop pixelgleich ✅, eine Quelle für das Gerüst beider Akkordeons ✅, Kommentare mit Messwerten ✅, Startseite DOM-gleich ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (behoben):** Graue Ränder im Streifen der ersten Fassung (O1), gefunden nur über den Pixelvergleich.
2. 🟢 **Niedrig (offen, O7):** Kachel wird während des Aufgehens von der Fensterkante aufgedeckt; Sichtprüfung am Telefon.

### Phase 4
**Eingehalten:** Pflichtfrage beantwortet und als BILDLAGE umgesetzt ✅, Gegenprobe für jede neue Prüfung ✅, Messfehler statt
Schein-Grün bei wirkungslosen Schritten ✅, Prüferfehler an der Ursache behoben ✅, unter 700 Zeilen ✅ (602, 221, 70, 44).
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (behoben):** drei Prüferfehler im Maus-Teil (O2 bis O4).

### Phase 4b
**Eingehalten:** Randfälle von Hand geprüft, bevor „fertig“ gilt ✅, alter Build als Vergleich ✅, Wächter gegen den echten Fehler
geprüft ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (behoben):** R33-e, Akkordeons nach dem Drehen 0 px breit (Leistungen, Stellen seit 16.10.).

### Phase 4c
**Eingehalten:** Diff vollständig durchgesehen ✅, Safari-Engine geprüft ✅.
**Auffälligkeiten:** O5, O6 (beide 🟢, behoben).

### Phase 5
**Eingehalten:** nach der letzten Korrektur alle Werkzeuge gegen denselben Build ✅, nacheinander statt parallel ✅, abgebrochene
Läufe nicht als Ergebnis gewertet ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (offen, O10):** Feste Ports kollidieren zwischen parallelen Worktrees (Prerender 4319, Werkzeuge 4183 bis
   4211). Ein gleichzeitiger Build einer anderen Sitzung liefert sonst einen Build ohne Prerender.

### Vorschläge für danach (nach Nutzen)
1. **Ports je Worktree** (O10): `CC_PORT_BASIS` oder freier Port mit Rückmeldung in `preview-server.mjs` und Prerender.
   Heute zweimal Zeit verloren, und ein unbemerkt nicht vorgerenderter Build wäre ein SEO-Schaden.
2. **R31 für beide Akkordeons** (O8): FLIP nur für Karten im oder nahe am Fenster, Bildzoom mobil an die Kartendauer.
3. **`npm run stimmen`** (Vorschlag vom 03.10.): Gesicht gegen Kachel in der offenen Karte je Breite messen. Für die
   Streifen leistet BILDLAGE das jetzt; für die offene Karte gibt es weiter nur das Skript aus der Planung vom 03.10.
4. **Sichtprüfung am Telefon** (O7): Kachel und Streifenschleier während des Aufgehens; nur dort beurteilbar.
