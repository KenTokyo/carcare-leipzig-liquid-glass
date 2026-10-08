# L08–L10 · Smart Repair, Neu- und Reparaturlackierung, Dellenentfernung

> Drei kurze Leistungsseiten (je rund 330–400 Wörter) mit gleichem Aufbau: Titelbild, Leistungsumfang, „Warum CarCare
> Center Leipzig“, FAQ, Abschluss. Auszüge `output/lektorat/auszuege/smart-repair-leipzig.md`,
> `autolackierung-leipzig.md`, `dellenentfernung-leipzig.md`.
> Der Leistungsumfang der Lackierseite ist Andrés Wortlaut (6.11, „nur grammatisch gefasst“). Die Dellen-Aussagen sind
> seit L02-11 vorsichtig gefasst, „Farbton- noch Effektunterschiede“ seit L02.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Seite | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|---|
| L08-01 | Smart Repair | Leistungsumfang und FAQ-Frage | Smart bzw. Spot-Repair | Smart Repair bzw. Spot-Repair | „Smart bzw. Spot-Repair“ setzt ein „Smart-Repair“ voraus (Ergänzung); nach Stilblatt 2 steht „Smart Repair“ getrennt und muss ausgeschrieben werden | `pages/SmartRepairPage.tsx:56`, `data/faqs.ts:73` |
| L10-01 | Dellenentfernung | H1 | Dellenentfernung (ohne lackieren) in Leipzig. | Dellenentfernung (ohne Lackieren) in Leipzig. | Nach einer Präposition ist der Infinitiv ein Substantiv und wird großgeschrieben; so steht es auch im Seitentitel | `pages/DellenentfernungPage.tsx:37` |
| L10-02 | Dellenentfernung | Einleitung und FAQ „Wie funktioniert die Methode?“ | … bis der Originalzustand wieder hergestellt ist. | … bis der Originalzustand wiederhergestellt ist. | „wiederherstellen“ wird zusammengeschrieben | `pages/DellenentfernungPage.tsx:39`, `data/faqs.ts:90` |

## S · Vorschläge

**Entscheidung des Users (08.10.):** L08-03, L09-01, L10-03 umgesetzt; **L08-02 bleibt** („möglichst perfekte“).

| Nr | Seite | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|---|
| L08-02 | Smart Repair, **G:** Lackierung, FAQ | fünf Stellen | die möglichst perfekte Lackinstandsetzung mit geringem Aufwand | die bestmögliche Lackinstandsetzung mit geringem Aufwand | „perfekt“ lässt sich nicht steigern; „möglichst perfekt“ ist umgangssprachlich. „bestmöglich“ sagt dasselbe | `SmartRepairPage.tsx:7/33`, `AutolackierungPage.tsx:23`, `data/faqs.ts:73/81` |
| L08-03 | Smart Repair | Kachel „Meisterbetrieb seit 1998“ | Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk, seit 1998 am Markt, auch auf kleinsten Flächen. | Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk, seit 1998 am Markt. Dieselbe Sorgfalt gilt auch für kleinste Flächen. | „auch auf kleinsten Flächen“ hängt ohne Bezug am Satz (ein Betrieb „auf kleinsten Flächen“?) | `pages/SmartRepairPage.tsx:17` |
| L09-01 | Lackierung | FAQ „Was kostet eine Lackierung?“ | … berechnen wir nach Aufwand, weil der Aufwand vom Schadenbild abhängt. | … berechnen wir nach Aufwand, weil er vom Schadenbild abhängt. | „Aufwand“ zweimal hintereinander | `data/faqs.ts:84` |
| L10-03 | Dellenentfernung | FAQ „Wie funktioniert die Methode?“ | … wird das Fahrzeugteil unter Verwendung spezieller Werkzeuge so weit bearbeitet, bis der Originalzustand wiederhergestellt ist. | … wird das Fahrzeugteil mit speziellen Werkzeugen so lange bearbeitet, bis der Originalzustand wiederhergestellt ist. | „so weit …, bis“ mischt zwei Fügungen („so weit, dass“ / „so lange, bis“); „unter Verwendung“ ist Nominalstil. Die Einleitung sagt schon „mit speziellen Werkzeugen“ | `data/faqs.ts:90` |

## H · Hinweise (keine Änderung)

| Nr | Seite | Hinweis |
|---|---|---|
| L09-02 | Lackierung | Leistungsumfang („Auslesewert des Farbtones“, „unter modernen Bedingungen mit bestmöglichem Ergebnis“) ist Andrés Wortlaut (6.11). Fachjargon, aber so gewollt. |
| L09-03 | Lackierung | Kachel Glasurit: „makellose Reparaturen“ ist eine Werbeaussage aus den USP-Bausteinen (`SEO-GEO-STANDARDS.md`). Ohne Änderung. |
| L10-04 | Dellenentfernung | „Parkdelle“ und „Parkplatzdelle“ stehen beide; als Suchwortvarianten vertretbar. |
| L08-04 | alle drei | Im Code steht je ein ausgeblendeter Platz für den Erklärtext „Was ist …?“ (R3, Zulieferung André). Für Besucher unsichtbar. |

## Geprüft und ohne Befund

Smart Repair: Titelbild, Kacheln „Unsichtbare Reparatur“, „Lackfreie Dellenentfernung“, „Komplettlackierung bei Bedarf“,
Glasurit- und Full-Service-Kachel, FAQ 2–3, Abschluss. Lackierung: Titelbild, „Preis nach Aufwand“, Warum-Kacheln, FAQ 1–3,
Abschluss, JSON-LD. Dellenentfernung: Einleitung (außer L10-02), fünf Vorteilskacheln, Warum-Kacheln, FAQ 1, 3, 4,
Abschluss. Titel und Beschreibungen aller drei Seiten im Korridor.
