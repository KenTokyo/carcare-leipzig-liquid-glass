# L02 · Unfallinstandsetzung `/unfallinstandsetzung-leipzig`

> Auszug `output/lektorat/auszuege/unfallinstandsetzung-leipzig.md`, rund 890 Wörter: Titelbild, Reparaturleistungen
> (sieben Karten), Leistungen im Schadenfall (acht Kacheln), Ablauf, Zielgruppen, FAQ (sieben Fragen), Abschluss,
> sechs Bildbeschreibungen, JSON-LD. Ablauf und Ersatzwagen-Schritt sind mit der Startseite geteilt (L01).
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · F = Frage an André · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 07.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L02-01 | Karte Neu- und Reparaturlackierung | Ziel ist die unsichtbare Reparatur: weder Farbton noch Effektunterschiede … sollen erkennbar sein. | Ziel ist die unsichtbare Reparatur: Weder Farbton- noch Effektunterschiede … sollen erkennbar sein. | Ergänzungsstrich (gemeint sind Farbton- und Effektunterschiede); nach dem Doppelpunkt groß, weil ein ganzer Satz folgt | `pages/AccidentRepairPage.tsx:31` |
| L02-02 | **G:** derselbe Fehler auf fünf weiteren Seiten (die Stelle in `faqs.ts:74` mit großem „Weder“ hatte die erste Suche übersehen, Suche danach ohne Groß-/Kleinschreibung: 0 Reste) | weder Farbton noch Effektunterschiede | weder Farbton- noch Effektunterschiede | dto. | `AutolackierungPage.tsx:49`, `SmartRepairPage.tsx:10`, `UeberUnsPage.tsx:46`, `data/faqs.ts:74/80/175`, `data/privatkunden.ts:63` |
| L02-03 | Karte Felgenreparatur, **G:** zehn weitere Stellen | 1 mm (mit normalem Leerzeichen) | 1 mm (geschützt) | Stilblatt 5, seit 07.10. auch mm, cm, kg | 11 Stellen in 10 Dateien, u. a. `AccidentRepairPage.tsx:51`, `data/faqs.ts:105`, `data/services.ts:231`, `seo/pageSchemas.ts` |

„weder Farbton noch Effekt zur Originallackierung abweichen“ (`ServicesPage.tsx:32`) ist richtig und bleibt.

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L02-04 | Karte Smart Repair | Statt das ganze Bauteil zu lackieren, wird gezielt nur der betroffene Bereich bearbeitet, unsere bevorzugte Methode bei kleineren Lack- und Kunststoffschäden. | Statt das ganze Bauteil zu lackieren, bearbeiten wir gezielt nur den betroffenen Bereich. Bei kleineren Lack- und Kunststoffschäden ist das unsere bevorzugte Methode. | Der Nachsatz „unsere bevorzugte Methode“ hängt an einem Passivsatz und bezieht sich auf nichts Bestimmtes; zwei Sätze in der Wir-Form | `pages/AccidentRepairPage.tsx:36` |
| L02-05 | Karte Hagelschadenreparatur | Strukturierte Hilfe nach Hagelereignissen: … Bei intaktem Lack werden die Dellen lackfrei entfernt. | Strukturierte Hilfe nach Hagelschäden: … Bei intaktem Lack entfernen wir die Dellen lackfrei. | wie L01-11 („Hagelereignis“ ist Fachjargon); Wir-Form statt Passiv | `pages/AccidentRepairPage.tsx:46` |
| L02-06 | Karte Felgenreparatur (G: JSON-LD Felgen) | TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb. | TÜV-zertifiziertes Reparaturverfahren für Alufelgen, als Wheel-Doctor-Fachbetrieb. | fünfgliedriges Wort, schwer lesbar | `pages/AccidentRepairPage.tsx:51`, `seo/pageSchemas.ts:113` |
| L02-07 | Kachel „Schadenskalkulation“ | Schadenskalkulation | Schadenkalkulation | Fugen-s einheitlich wie „Schadenaufnahme“, „Schadenabwicklung“, „Schadenmeldung“ (beides richtig, die Seite nutzt sonst die Form ohne s) | `pages/AccidentRepairPage.tsx:63` |
| L02-08 | Kachel und FAQ zum Ersatzauto | Kachel „Ersatzmobilität“ · FAQ „Gibt es Ersatzmobilität während der Reparatur?“ | Kachel „Ersatzwagen“ · FAQ „Bekomme ich bei einem Unfallschaden einen Ersatzwagen?“ | wie L01-16; die Antwort sagt ohnehin „Ersatzwagen“. Auf der Geschäftskundenseite bleibt „Ersatzmobilität“, dort ist es der übliche Flottenbegriff | `pages/AccidentRepairPage.tsx:68`, `data/faqs.ts:52` |
| L02-09 | Kachel „Alle Marken“ | … bearbeiten wir alle Fabrikate unter Verwendung von ausschließlich Originalersatzteilen. | … bearbeiten wir alle Fabrikate und verwenden dabei ausschließlich Originalersatzteile. | Nominalstil, „ausschließlich“ stand an der falschen Stelle | `pages/AccidentRepairPage.tsx:71` |
| L02-10 | Neun Links „Mehr erfahren“ | Mehr erfahren (neunmal, verschiedene Ziele) | sichtbar gleich lassen, aber Vorlesetext je Ziel, z. B. „Mehr erfahren: Neu- und Reparaturlackierung“ | Vorlesegeräte listen Links ohne Umfeld; neunmal „Mehr erfahren“ ist dort nicht unterscheidbar (Ebene 7) | Karten in `AccidentRepairPage.tsx`, Zielgruppen-Kacheln |

## F · Frage an André (mit Vorschlag)

| Nr | Stelle | Frage | Vorschlag, falls die Aussagen nicht belegt sind |
|---|---|---|---|
| L02-11 | Dellenentfernung, **G:** fünf Stellen (Unfallinstandsetzung, Dellenentfernung, Leasingrückgabe, Privatkunden, zwei FAQ) | „Von allen Versicherungen und Gutachtern anerkannt“, „im Nachhinein nicht nachweisbar“, „Es entsteht keine Wertminderung“: Sind diese drei Aussagen so belegbar? „Alle“ und „keine“ sind Absolutaussagen, „nicht nachweisbar“ liest sich, als ginge es ums Verbergen. | „Die Methode ist bei Versicherungen und Gutachtern anerkannt. Die reparierte Stelle ist danach nicht zu sehen, der Originallack bleibt erhalten.“ |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L02-12 | Titel „Unfallinstandsetzung Leipzig \| Karosserie, Lack & Glas“ | Ohne Marke am Ende (SEO-GEO 3.1). Mit „\| CarCare Center“ würde er 71 Zeichen lang; eine kürzere Fassung verlöre Suchwörter. Bewusst so lassen. |
| L02-13 | Kachel „Alle Marken“: „ausschließlich Originalersatzteile“ | Absolutaussage. Falls auf Kundenwunsch auch Identteile oder Gebrauchtteile vorkommen, abschwächen (sonst bleibt sie). |
| L02-14 | Startseite mobil (aus der Prüfung zu L01) | Die Überschrift „Versicherungen & Agenturen“ in den Zielgruppenkarten ist 6 px breiter als ihr Kasten (173 > 167 px bei 390 px Breite). Älter als das Lektorat, Text unverändert; für die Layoutprüfung in Phase 11 vorgemerkt. |

## Geprüft und ohne Befund

Titelbild und Einleitung, Stichwortleiste, Karten Unfallinstandsetzung, Dellenentfernung (bis auf L02-11) und Autoglas,
Kacheln Schadenaufnahme, Gutachterservice, Versicherungsabwicklung, Karosserie- und Lackierarbeiten, Dokumentation,
Ablauf (wie Startseite), Zielgruppen-Kacheln, FAQ 1–5 und 7, Abschluss, sechs Bildbeschreibungen, JSON-LD (dritte Person
dort erlaubt), Vorlesetext des Videoknopfs.
