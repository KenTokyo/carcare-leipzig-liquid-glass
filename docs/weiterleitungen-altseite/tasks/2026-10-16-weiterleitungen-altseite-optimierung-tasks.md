# Optimierung: Weiterleitungen der alten Website

**Bezug:** `docs/weiterleitungen-altseite/tasks/2026-10-16-weiterleitungen-altseite-tasks.md` (Kommentare, Funde 1–5)
**Angelegt:** 2026-10-16

Keiner der Funde ist ohne Zulieferung oder Freigabe im Code lösbar; deshalb stehen sie hier mit Zuständigkeit statt als
erledigt.

### ✅ O1 — Live-Prüfung nach dem Deploy (Fund 1) · OALAB
* [x] Push auf `main` am 16.10. um 19:12 (Freigabe User), Vercel live um 19:18; `npm run weiterleitungen -- --live`:
  52 von 52 alten Adressen 301 aufs richtige Ziel, Ziele 200, EU-PDF 200, `/index.html` 200
* [x] Ergebnis in der Planung (Phase 5) und in R22 (`docs/backlog/offene-punkte-konsolidiert.md`) eingetragen

### ⬜ O2 — Rund um die DNS-Umstellung · OALAB mit KUPPER IT
* [ ] Unmittelbar davor `npm run altseite`: Kam auf der Altseite etwas dazu? Danach `npm run weiterleitungen`
* [ ] Läuft die neue Seite bei KUPPER IT: `docs/weiterleitungen-altseite/uebergabe/` dort einspielen lassen
  (Apache `.htaccess` oder nginx/Plesk)
* [ ] Danach `npm run weiterleitungen -- --live https://www.carcare-center.de`
* [ ] 2 bis 4 Wochen später in der Search Console den Bericht „Nicht gefunden (404)“ prüfen: Adressen, die nur Google
  kannte, in `scripts/lib/weiterleitungen.mjs` nachtragen (Pflichtfrage, Punkt 2)

### ⬜ O3 — Leder-, Stoff- und Kunststoffreparatur (Fund 2) · André
* [ ] Werden sie noch angeboten? Wenn ja: Inhalt auf der neuen Seite ergänzen (eigener Abschnitt bei Smart Repair bzw.
  Innenaufbereitung) und die Weiterleitungen darauf prüfen. Wenn nein: Weiterleitungen bleiben wie sie sind.

### ⬜ O4 — Branchenverzeichnisse mit alten Daten (Fund 3) · André oder OALAB mit Zugang
* [ ] nochoffen.de nennt „seit 1993“, „An den Tierkliniken 4“ und Telefon 222 96 22; richtig sind seit 1998,
  An den Tierkliniken 42, 0341 261 77 90 (Textregel 3, NAP laut SEO-GEO-STANDARDS Abschnitt 0)
* [ ] Weitere Verzeichnisse (Gelbe Seiten, 11880, Das Örtliche, Google-Unternehmensprofil) beim Livegang abgleichen

### ⬜ O5 — Belege der Altseite nutzen (Fund 4) · Vorschlag, nur auf Zuruf des Users
* [ ] Felgenzertifikate (Alufelgenaufbereitung, glanzgedrehte Felgen) auf `/felgenreparatur-leipzig` verlinken
* [ ] Presseclips (MDR um 4, LexiTV) auf `/ueber-uns`, Rechte vorher klären (Sendermaterial)
