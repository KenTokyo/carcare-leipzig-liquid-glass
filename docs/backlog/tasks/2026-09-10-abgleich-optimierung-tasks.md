# Optimierung nach dem Abgleich vom 2026-09-10

**Referenz:** `docs/backlog/tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md`, Findings 1, 7, 8

---

### ⏳ Phase 1 — Nummerngrenzen aus der Kunden-CSV ableiten
**Ziel:** Wächterlücke 3 schließen. `scripts/check-nummernraeume.mjs` leitet die Obergrenzen aus unseren
eigenen Schleifendateien ab. Wer dort eine Zeile „| 1.27 |" ergänzt, verschiebt die Grenze selbst — so
sind 1.27–1.29 überhaupt erst entstanden.
* [ ] Blockgrößen aus `docs/backlog/quelle/2026-09-06-alle-schleifen.csv` zählen (erwartet 26 / 27 / 37)
* [ ] Grenze = CSV-Zählung; Abweichung zur Schleifendatei bricht den Build mit klarer Meldung
* [ ] Pflichtfrage beantworten (u. a. neue Kundenlieferung ersetzt die CSV → Grenze wandert mit, gewollt)
* [ ] Gegenprobe: Testzeile „| 1.27 |" in einer Kopie von `schleife-1.md` muss gemeldet werden

### ⏳ Phase 2 — Datenschutz vor Versand (Entscheidung User/Kunde)
**Ziel:** Finding 1 auflösen. Die Vorschau versendet seit 2026-09-08, `/datenschutz` ist ein Gerüst.
* [ ] Entscheiden: Versand in der Vorschau bis R6 wieder sperren (Variable entfernen) **oder** bewusst
      offen lassen und im Faktenblatt/Backlog als Entscheidung festhalten
* [ ] Live-Test der vier Formulararten + Empfangsnachweis (`docs/netcup-email/tasks/2026-09-08-netcup-email-tasks.md`, Phase 3)

### ✅ Phase 3 — Abhängigkeiten nach dem Pull
* [x] `npm install` (5 neue Pakete), danach `npm run build` und `npm run test:email` — grün (2026-09-10)
* [x] `npm audit fix` (kompatibel): sharp + smol-toml, 2 × hoch → 0
* [ ] Optional: lokal Node 24 statt 25.2.1 (`package.json` → `engines: 24.x`), damit lokal wie auf Vercel gebaut wird

### ⏳ Phase 4 — Doku-Drift an der Wurzel angehen
**Ziel:** Code ändert sich schneller als die Statusspalten (3.9, 2.24, 3.20/3.21, R6/R10 — alle in dieser
Sitzung nachgezogen). Vorschlag: In der Abschlussphase jedes Pakets ein To-do „Schleifendatei und
Konsolidat für jede berührte Nummer nachgezogen" — geprüft per `git diff --stat`.
* [ ] Als Standard-To-do in künftige Paket-Pläne aufnehmen
