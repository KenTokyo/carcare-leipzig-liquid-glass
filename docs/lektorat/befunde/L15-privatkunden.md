# L15 · Privatkunden `/privatkunden`

> Auszug `output/lektorat/auszuege/privatkunden.md`, rund 1.085 Wörter: Titelbild, „Ihre Vorteile“ (acht Kacheln, Quelle
> `data/privatkunden.ts`, Kurzfassung auch auf der Startseite), typische Anlässe, acht Leistungskarten, Ablauf, FAQ (acht
> Fragen), Abschluss, sieben Bildbeschreibungen, JSON-LD. Vieles war schon mit L01–L14 bereinigt (Preise, Dellen-Aussagen,
> „Meisterbetrieb seit 1998 und Glasurit-Lackpartner“, Ablauf Schritt 4, Garantie-Umfang).
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L15-01 | FAQ „Bleibe ich während der Reparatur mobil?“ | Nach Verfügbarkeit stellen wir Ihnen einen Ersatzwagen zur Verfügung. | Nach Verfügbarkeit stellen wir Ihnen einen Ersatzwagen bereit. | wie L07-07 (vom User angenommen): „Verfügbarkeit … zur Verfügung“ im selben Satz | `data/faqs.ts:135` |

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L15-02 | Seitentitel | Privatkunden Leipzig \| Ihre Vorteile bei CarCare Center | Privatkunden Leipzig \| Ihre Vorteile beim CarCare Center | Die Website nennt den Betrieb sonst mit Artikel („beim CarCare Center Leipzig“); 56 Zeichen | `pages/PrivatkundenPage.tsx:87` |
| L15-03 | Meta-Beschreibung | … feste Aufbereitungspreise ab 169 €, Versicherungsabwicklung inklusive und Ersatzwagen. | … feste Aufbereitungspreise ab 169 €, Versicherungsabwicklung und Ersatzwagen inklusive. | „inklusive“ stand zwischen zwei Gliedern und bezog sich nur auf das erste; gleiche Länge | `pages/PrivatkundenPage.tsx:88` |
| L15-04 | Kachel „Farbtongenau als Glasurit-Lackpartner“ | Ziel jeder Lackreparatur ist, dass weder Farbton- noch Effektunterschiede … erkennbar sind, mit umweltschonenden Wasserbasislacken. | Ziel jeder Lackreparatur ist, dass weder Farbton- noch Effektunterschiede … erkennbar sind. Wir arbeiten dafür mit umweltschonenden Wasserbasislacken. | „mit … Wasserbasislacken“ hängt am Nebensatz „erkennbar sind“ und bezieht sich so auf das Falsche | `data/privatkunden.ts:63` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L15-05 | Karte Smart Repair: „…, weniger aufwendig als eine Komplettlackierung.“ | Nachsatz nach dem Muster, das der User bei L07-03 stehen lassen will; deshalb kein Vorschlag. |
| L15-06 | Titelbild-Einleitung, 27 Wörter | Lang, aber gut gegliedert (Doppelpunkt nach der Aufzählung). So lassen. |

## Geprüft und ohne Befund

H1, Stichwortleiste, „Ihre Vorteile“ (außer L15-04), typische Anlässe, Leistungskarten, Ablauf, FAQ (außer L15-01),
Abschluss, sieben Bildbeschreibungen, Vorlesetext des Videoknopfs, JSON-LD.
