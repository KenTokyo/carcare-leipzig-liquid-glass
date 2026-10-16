# Optimierung: Layout-Sprünge beim Laden

**Bezug:** `docs/cls-layoutspruenge/tasks/2026-10-16-cls-layoutspruenge-tasks.md`
**Angelegt:** 2026-10-16

### ⬜ O1 — Kleiner Sprung am Desktop beobachten · OALAB (mit der Sitzung „mobil-startseite“)
* [ ] Seit dem Zusammenführen mit „Startseite mobil“ (17.10.): auf vielen Desktop-Seiten 0,010 durch `body`, auch
  einzeln; unter Parallellast vereinzelte Spitzen bis 0,170 mit neuer Quelle `div.absolute` (Kandidat:
  `components/PhotoBackdrop.tsx`, `useDekodiert` zeigt das Foto erst nach `decode()`), einzeln nicht reproduzierbar.
  Alles unter Googles Grenze 0,1. Erst angehen, wenn die parallele Sitzung `PhotoBackdrop` fertig hat (dort laufen
  noch uncommittete Änderungen).
* [ ] Im ersten Lauf nach der Korrektur je 0,043 auf `/autolackierung-leipzig` und `/hagelschadenreparatur-leipzig`,
  Verursacher `body` nach etwa 300 ms. In vier Einzelläufen ohne Parallellast nicht reproduzierbar; Scrollbalken
  ausgeschlossen (headless 0 px). Unter Googles Grenze 0,1. Bei den nächsten `npm run cls`-Läufen mitlesen: Kommt er
  regelmäßig, Vorher- und Nachher-Rechteck je Quelle protokollieren (wie `cls-hinweis` im Scratchpad der Sitzung) und
  die Ursache suchen (Kandidat: erstes Bild vor dem Flash-Guard, dann neuer Aufbau).

### ⬜ O2 — Nachweis auf der Vorschau · OALAB, nach dem Push
* [ ] `/karriere` live: kein Pop-up beim Laden, eines nach 1,2 s, keines nach dem Schließen (390 und 1440 px)
* [ ] CLS live mit Drossel auf den Seiten, die vorher 1,0 hatten (z. B. `/`, `/karriere`, `/leistungen` bei 360/390)

### ⬜ O3 — Felddaten nach dem Livegang · OALAB mit Zugang zur Search Console
* [ ] Bericht „Core Web Vitals“ nach etwa 28 Tagen Besucherdaten prüfen; erst die Felddaten belegen CLS für echte
  Geräte (Pflichtfrage von `npm run cls`, Punkt 3)

### ✅ O4 — Pop-up-Gespenst blieb in `npm run mobil` unsichtbar · erledigt durch die Ursache
* [x] Die Kopie hatte 22 % Deckkraft und lag unter der Sichtbarkeitsschwelle des Mobile-Checks. Statt den Check
  aufzuweichen, behebt der Prerender die Ursache für jedes Portal und meldet entfernte Reste im Build-Protokoll.
