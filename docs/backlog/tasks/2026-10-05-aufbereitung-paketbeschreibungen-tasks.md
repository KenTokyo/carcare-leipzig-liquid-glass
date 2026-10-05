# Aufbereitung: Paketbeschreibungen nach Andrés Anmerkungen (05.10.)

**Angelegt:** 2026-10-05
**Quelle:** Andrés „inhaltliche Anmerkungen zu den Leistungspaketen“, vom User am 05.10. weitergegeben.
**Backlog:** Nachtrag zu **6.24** („André liefert außerdem saubere Paketbeschreibungen“). Keine neue Nummer
(CLAUDE.md: Nummern nicht selbst vergeben).
**Vorgabe des User:** umsetzen, nur bei Unklarheit fragen.

## Andrés Punkte und wo sie stehen

| Punkt | Stelle im Projekt |
|---|---|
| Brillant Außenpflege: Lackversiegelung entfernen | `data/detailing.ts` (Paket `p1`), dazu alle Stellen, die den Paketumfang wiederholen: FAQ „umfang“ und „paketwahl“, `data/services.ts` (`listDescription`), Schema in `seo/pageSchemas.ts`, Einleitung „Was zur Außenaufbereitung gehört“ |
| Frontscheibenversiegelung: Eis haftet weniger an | `data/zusatzleistungen.ts` (`frontscheibe`) |
| Motorreinigung: Motorraum reinigen und mit wasserlöslicher Schutzschicht versiegeln | `data/zusatzleistungen.ts` (`motor`) |
| Außenaufbereitung (Text) | Teaser-Karte „Außenaufbereitung“ in `data/detailing.ts` (`detailingScopes`) |
| Intro „Außen- und Lackaufbereitung in Leipzig“ | Seitenkopf `pages/AussenaufbereitungPage.tsx` |
| Fließbild 1–4: „schonende“ wird „intensive“, Hochglanzpolitur ergänzen | Ablauf `aussenLeistungen` in `pages/AussenaufbereitungPage.tsx` |
| Fließbild Lackaufbereitung Punkt 4: „Hochglanzpolitur oder Versiegelung nach Wunsch“, Text „Nach Absprache erweitern wir die Lackaufbereitung …“ | Ablauf `lackLeistungen`, gleiche Datei |

---

### ✅ Phase 1 — Texte umsetzen
**Ziel:** Andrés Wortlaut, in „wir/Sie“ und ohne Gedankenstriche (Textregeln 2 und 6).
* [x] Brillant Außenpflege ohne Lackversiegelung: Paket `p1`, FAQ „umfang“, `listDescription` in `data/services.ts`, Schema-Beschreibung, Einleitung „Was zur Außenaufbereitung gehört“ (dort stand „dazu Hochglanzpolitur und Lackversiegelung“). FAQ „paketwahl“ sagte „Glanz und Lackschutz“, jetzt „Sauberkeit und Glanz“: Ohne Versiegelung kein Lackschutz im Paket.
* [x] „Intensive Handoberwäsche“ im Ablauf (Titel und Text) und an denselben Stellen wie oben. Andrés Fließbild-Notiz sagt „intensive Handwäsche“, sein Außenaufbereitungs-Text „intensive Handoberwäsche“: Der Begriff „Handoberwäsche“ bleibt (Wortlaut des Kunden seit 4.5), nur das Adjektiv wechselt. Die „Schonende Oberwäsche“ der Intensiv Innenraumreinigung ist nicht gemeint und bleibt.
* [x] Ablauf Außenaufbereitung mit fünf Schritten: Vorreinigung und Felgen, Insektenentfernung, Intensive Handoberwäsche, **Hochglanzpolitur** (neu), Scheibenreinigung „Innen und außen, für klaren Durchblick“. `ProcessList` setzt fünf Schritte ab `xl` in eine Reihe.
* [x] Ablauf Lackaufbereitung, Punkt 4: Titel „Hochglanzpolitur oder Versiegelung nach Wunsch“, Text unverändert.
* [x] Frontscheibe („Eis haftet weniger an“), Motorreinigung („… versiegeln ihn mit einer wasserlöslichen Schutzschicht“), Teaser „Außenaufbereitung“ in „wir/Sie“ gesetzt, Seitenkopf im Wortlaut (nur „Ihrem“ groß).
**Referenzen:**
`pages/AussenaufbereitungPage.tsx`
`data/detailing.ts`
`data/zusatzleistungen.ts`

### ✅ Phase 2 — Gegenprobe
* [x] `npm run build` grün (05.10.): FAQ-Quelle und FAQ-HTML ok, Prerender 29/29, keine Platzhalter, **0 Gedankenstriche**. Im ausgelieferten HTML: Ablauf 1–5 wie geplant, Punkt 4 der Lackaufbereitung, Frontscheibe, Motorreinigung, Intro, Teaser auf `/fahrzeugaufbereitung-leipzig`; „schonende“ auf der Außenseite 0-mal. „Lackversiegelung“ steht dort noch 3-mal, alles erlaubt: Suchbegriff-Chip, FAQ „Wie lange hält eine Lackversiegelung?“ sichtbar und im Schema.
* [x] Backlog 6.24 fortgeschrieben.

---

## Kommentare

### Phase 1 und 2
**Eingehalten:** Andrés Wortlaut, wo er grammatisch trägt (Intro, Motorreinigung, Frontscheibe) ✅, sonst in „wir/Sie“ umformuliert statt ersetzt (Teaser) ✅, alle Stellen mit demselben Paketumfang gleichgezogen statt nur die genannte ✅, keine Gedankenstriche ✅, kein Mojibake (Escape-Prüfung der sechs Dateien) ✅, Dateien unter 700 Zeilen ✅.
**Auffälligkeiten (nach Schwere):**
1. ✅ **Geklärt (User, 05.10.: „passt auch“, bleibt):** Die Premiumpflege heißt weiter „Brillant Außenpflege und Intensiv Innenraumreinigung kombiniert, inklusive Motorreinigung und Versiegelung“ (auch FAQ „dauer“). Seit die Brillant Außenpflege keine Lackversiegelung mehr enthält, ist offen, welche Versiegelung gemeint ist: Lack oder Motorraum (die Motorreinigung versiegelt jetzt laut André den Motorraum). Nicht geändert, weil André dazu nichts sagt.
2. ✅ **Geklärt (User, 05.10.: „passt so, nicht ändern“):** „wasserlöslichen Schutzschicht“ wörtlich übernommen. Falls „wasserbasiert“ gemeint ist, eine Zeile in `data/zusatzleistungen.ts`.
