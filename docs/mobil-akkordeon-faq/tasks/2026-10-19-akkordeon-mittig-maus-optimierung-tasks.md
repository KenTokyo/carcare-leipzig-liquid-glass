# Optimierung zu R33 (Akkordeon mittig auch mit der Maus)

**Bezug:** `docs/mobil-akkordeon-faq/tasks/2026-10-19-akkordeon-mittig-maus-tasks.md`
**Stand:** 2026-10-19. Nummern sind Repo-Befunde (`R33-a` …), keine Kundennummern.

| Nr. | Schwere | Befund | Beleg | Stand |
|---|---|---|---|---|
| **R33-a** | 🟡 | **Mitarbeiterstimmen auf /karriere** (`Stimmen.tsx`, „Aus dem Team“) haben dasselbe Muster wie die Leistungskarten vor R33: unter 1024 px Aufgehen per `mouseenter` (öffnet auch, wenn der Inhalt unter einer ruhenden Maus vorbeiscrollt), Höhe per Framer animiert (Layout in jedem Bild, siehe `npm run akkordeon` Pflichtfrage 2), kein mittiges Gleiten, auch nicht beim Tipp. | `components/Stimmen.tsx` Zeilen 116–120 | ⬜ offen, eigene Aufgabe: auf `akkordeonMobil.ts` umstellen (Fenster/Inhalt, FLIP, Mitgleiten, `useZeigerAbsicht`), danach in `npm run akkordeon` aufnehmen |
| **R33-b** | 🟢 | **Ruhezeit 120 ms** vor dem Aufgehen mit der Maus unter 1024 px. Gegen die Kette nötig (Weg über die Streifen), am echten Trackpad aber nicht gefühlt geprüft. | `ZEIGER_RUHE_MS` in `akkordeonMobil.ts` | ✅ vom User lokal im schmalen Fenster getestet (2026-10-20: „R33 passt“), bleibt bei 120 ms |
| **R33-c** | 🟢 | **Safari selbst nicht geprüft**, nur die Engine (Playwright-WebKit 26). Dort Ersatzbewegungen nach dem Scrollen, einmal an anderer Stelle; abgefangen über die Scroll-Stille. | Phase 2 | ⬜ Sichtprüfung am MacBook in Safari, Fenster schmaler als 1024 px |
| **R33-d** | 🟢 | **Verhaltensänderung, bewusst:** Unter 1024 px klappt ein Mausklick auf eine zugeklappte Karte erst auf (wie ein Tipp), statt sofort dem Link zu folgen. Vorher hatte das Darüberfahren sie schon geöffnet, der Klick folgte dann dem Link. | Phase 2 | ✅ so gewollt („prominent gezeigt“), im Prüfer als Schritt (e) |
