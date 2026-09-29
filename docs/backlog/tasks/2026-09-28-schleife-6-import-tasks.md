# Schleife 6 importieren — Meeting vom 28.09.2026 und Andrés Mail

**Auftrag (User, 2026-09-28):** „Hier habe ich nochmal für die Schleife 6 ein Meeting gehalten. Es könnte sein, dass hier
To-dos mit drin sind, die schon längst angepasst wurden, da André noch keine Anpassung sauber sichten konnte seit
Schleife 5. Bitte füge die To-dos in unsere allgemeine Liste hinzu und nimm schon erledigte raus."
**Quelle:** Transkript „oalab x carcare – Finalisierung der Website" (DOCX beim User, 58:06, nicht im Repository)
**Branch:** `2026-09-28-schleife-6-import`

---

### ✅ Phase 1 — Transkript lesen und Punkte herausziehen
* [x] DOCX ohne pandoc ausgelesen (276 Absätze, 52.604 Zeichen), vollständig gelesen
* [x] Beginn laut Dateiname 10:20 Uhr (der geplante Termin 10:00), Kopfzeile „08:20 AM" vermutlich UTC
* [x] Jede Aussage mit Handlungsbedarf notiert, mit Zeitmarke des Sprecherabschnitts (nicht geschätzt — beim Gegenlesen
      zwölf geschätzte Marken auf die echten Abschnitte korrigiert)
**Referenzen:**
`docs/backlog/schleife-6.md`

### ✅ Phase 2 — Gegen den Stand abgleichen: erledigt, doppelt, neu
* [x] **Bereits erledigt (19 Themen, nicht als offen eingetragen):** 5.13, 5.16–5.19, 5.20 samt Kacheln, 5.24–5.26,
      5.29–5.33, 2.23, „Aufbereitung anfragen" oben rechts; 5.22 durch Andrés Test; eigene Stellenseiten → R19
* [x] **Aufgegangen (🔁 in Schleife 5 gestrichen):** 5.3 → 6.9, 5.4 → 6.8, 5.5 → 6.8, 5.8 → 6.2
* [x] **Ergänzt, aber weiter in Schleife 5 geführt:** 5.1, 5.6, 5.7, 5.9, 5.10, 5.12, 5.15, 5.27, 5.28, 5.35, 5.43; R5, R6
* [x] **Neu:** 23 Punkte aus dem Meeting (6.1–6.23) und 3 aus Andrés Mail (6.24–6.26), die bis dahin nur im Chat standen
**Lösungswege:** (a) Erledigtes mit Nummer und Status ✅ führen — bläht die Zählung und den Nummernraum auf ·
(b) ✔ Erledigtes ohne Nummer in eigener Tabelle mit Verweis auf den Punkt, unter dem es umgesetzt wurde — so sieht André,
was schon da ist, und niemand setzt es zweimal um

### ✅ Phase 3 — Werkzeuge und Verzeichnisse
* [x] `scripts/check-nummernraeume.mjs` kennt Raum 6 (Ausgabe: `6.1-6.26`, ok); `scripts/push-stand.mjs` liest `schleife-6.md`
      und lässt `6.x` in der konsolidierten Liste aus
* [x] Rückverweise in der zweiten Tabellenspalte — in einer Schleifendatei ist ein fremder Präfix in der ersten Spalte ein Befund
* [x] Backlog-README (sieben Listen, 194 Aufgaben, offen 52 → **73**), CLAUDE.md (Backlog-Tabelle), R5/R6 fortgeschrieben
**Referenzen:**
`scripts/check-nummernraeume.mjs`
`scripts/push-stand.mjs`
`docs/backlog/README.md`

---

## Kommentare

### Phasen 1–3
**Eingehalten**: keine Nummer außerhalb der Kundenräume (Wächter grün) ✅, Nummern nur auf Wunsch des Users vergeben (wie
Schleife 5) ✅, Transkript nicht im Repository ✅, Erledigtes nachweisbar statt stillschweigend weggelassen ✅, wörtliche
Aussagen in „…", sonst Zusammenfassung ✅, keine Pronomen für André geraten ✅, UTF-8 ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — Livegang-Blocker weiter offen:** Impressum (R5) und Datenschutz (R6) sind nur teilweise geklärt; dazu
   kommen Matomo (6.20) und der KI-Hinweis (6.21). Die sichtbaren Platzhalter der Mitarbeiterstimmen bleiben laut Meeting
   vorerst stehen (5.28) — vor dem Livegang bewusst entscheiden, ob sie so online gehen.
2. 🟡 **Mittel — 6.9 widerspricht einer Entscheidung des Users:** Ali sprach im Meeting von einer dezenten Liquid-Glass-
   Plakette; der User hat Liquid Glass am 25.09. auf die mobile Leiste beschränkt. Vor der Umsetzung klären.
3. 🟡 **Mittel — zwei Punkte sind im Transkript unklar:** 6.4 (welcher Privatkunden-Text?) und 6.14 (Ausbildungsplatz
   Industriekaufmann/-frau frei oder besetzt?). Beide als Rückfrage markiert, nicht geraten.
4. 🟢 **Niedrig — eine Ausgrau-Regel ist genannt, aber noch nicht eingebaut** (Felgenintensivreinigung bei Premiumpflege,
   6.7) — eine Zeile in `data/zusatzleistungen.ts`, sobald umgesetzt wird.
