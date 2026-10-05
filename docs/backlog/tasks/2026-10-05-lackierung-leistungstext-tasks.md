# Neu- und Reparaturlackierung: Leistungstext nach Andrés Anmerkungen (05.10.)

**Angelegt:** 2026-10-05
**Quelle:** Andrés Änderungen „im Bereich Neu und Reparaturlackierungen“, vom User am 05.10. weitergegeben.
**Backlog:** Nachtrag zu **6.11** (Leistungsumfang als zusammenhängender Text). Keine neue Nummer.
**Vorgänger am selben Tag:** `docs/backlog/tasks/2026-10-05-aufbereitung-paketbeschreibungen-tasks.md` (dort Rückfragen 1 und 2
vom User beantwortet: Premiumpflege „inklusive Motorreinigung und Versiegelung“ und „wasserlöslich“ bleiben).

## Andrés Punkte

André zitiert die Absatzanfänge mit „…“; gemeint sind die drei Absätze unter „Von Spot-Repair bis zur Komplettlackierung.“
auf `/autolackierung-leipzig` (`leistungsbeschreibung` in `pages/AutolackierungPage.tsx`).

| Absatz | Andrés Wortlaut | Umsetzung |
|---|---|---|
| 1 | „Wir übernehmen Neu und Reparaturlackierungen an Fahrzeugen aller Marken. ….. (Motorrad lassen wir gekonnt weg!)“ | „und lackieren auch Motorradteile“ gestrichen, Rest unverändert |
| 2 | „… . Typische Fälle sind Front/Heck-Stoßfänger nach Anfahrbeschädigungen, Frontklappen mit Steinschlägen, verkratzte Seitenwände, Radläufe und Außenspiegel. Eine notwendige farbliche Angleichung entscheidet der jeweilige Auslesewert des Farbtones und erfolgt nach Absprache.“ | Erster Satz bleibt; die beiden alten Sätze (Stoßfänger, Motorhaube, Radlauf; Stoßfänger „inklusive farblicher Angleichung“) ersetzt. Grammatisch gefasst: „Front- und Heckstoßfänger“, „Über eine notwendige farbliche Angleichung entscheidet der jeweilige Auslesewert des Farbtones. Sie erfolgt nach Absprache.“ |
| 3 | „…. . Dafür arbeiten wir als Glasurit - Lackpartner mit umweltschonenden Wasserbasislacken und einer digitalen Farbtonanalyse.“ | „und einer digitalen Farbtonanalyse“ ergänzt; „Glasurit-Lackpartner“ ohne Leerzeichen (Textregel 6) |

---

### ✅ Phase 1 — Texte umsetzen
**Ziel:** Andrés Wortlaut in den drei Absätzen, ohne Gedankenstriche.
* [x] Absatz 1 ohne Motorradteile. „Motorrad“ stand sonst nirgends (FAQ, Schema, Suche geprüft).
* [x] Absatz 2 mit den neuen typischen Fällen und der Regel zur farblichen Angleichung.
* [x] Absatz 3 mit „digitalen Farbtonanalyse“.
* [x] Kopfkommentar der Seite fortgeschrieben, Backlog 6.11 vermerkt.
**Referenzen:**
`pages/AutolackierungPage.tsx`
`docs/backlog/schleife-6.md`

### ✅ Phase 2 — Gegenprobe
* [x] `npm run build` grün (05.10.): Prerender 29/29, FAQ-HTML ok, keine Platzhalter, **0 Gedankenstriche**. Im ausgelieferten HTML von `/autolackierung-leipzig` stehen alle drei neuen Sätze, „Motorrad“ 0-mal.

---

## Kommentare

### Phase 1 und 2
**Eingehalten:** Andrés Wortlaut, nur grammatisch gefasst und ohne gespreizten Bindestrich („Glasurit - Lackpartner“) ✅, Auslassungen „…“ als „bleibt“ gelesen ✅, kein Mojibake (Escape-Prüfung) ✅, ein Build ✅.
**Auffälligkeiten:** keine.
