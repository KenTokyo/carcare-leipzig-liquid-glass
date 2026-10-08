# L07 · Leasingrückgabe `/leasingrueckgabe-leipzig`

> Auszug `output/lektorat/auszuege/leasingrueckgabe-leipzig.md`, rund 1.190 Wörter: Titelbild, „Worum es geht“ (vier
> Kacheln), Privatkunden (vier Kacheln), Geschäftskunden und Fuhrparks (vier Kacheln), sechs Leistungskarten, Ablauf in
> fünf Schritten, FAQ (acht Fragen), Abschluss, fünf Bildbeschreibungen, JSON-LD.
> Dellen-Aussagen (L02-11), Fließtextpreise (L03) und Vorlesetexte der Kartenlinks (L02-10) waren schon bereinigt.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L07-01 | **G:** Privatkunden, Ablauf „Reparatur & Übergabe“ | Wir arbeiten das Fahrzeug ab und übergeben es gereinigt zurück, mit Erklärung, was gemacht wurde. | Wir erledigen alle Arbeiten im eigenen Haus und geben Ihnen das Fahrzeug gereinigt zurück, mit einer Erklärung, was wir gemacht haben. | wörtlich derselbe Satz wie L04-06, dort vom User so entschieden | `pages/PrivatkundenPage.tsx:79` |

Auf L07 selbst keine Korrektur nötig; die Vorprüfung meldete nichts, beim Lesen fand sich kein Regelverstoß.

## S · Vorschläge

**Entscheidung des Users (08.10.):** 02, 04, 05, 06, 07 umgesetzt (04 auch auf Über uns); **03 bleibt**.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L07-02 | Seitentitel | Leasingrückgabe Leipzig \| vorbereiten \| CarCare Center | Leasingrückgabe vorbereiten in Leipzig \| CarCare Center | „vorbereiten“ als eigenes Titelstück liest sich wie ein Stichwort; Muster nach SEO-GEO 3.1 („{Leistung} in {Stadt} \| {Marke}“), 55 Zeichen | `pages/LeasingrueckgabePage.tsx:130` |
| L07-03 | Karte Spot-Repair | … gezielt nur die betroffene Stelle statt des ganzen Bauteils, deutlich weniger aufwendig als eine Komplettlackierung. | … gezielt nur die betroffene Stelle statt des ganzen Bauteils. Das ist deutlich weniger aufwendig als eine Komplettlackierung. | Nachsatz ohne Bezug, wie L02-04 und L04-05 | `pages/LeasingrueckgabePage.tsx:53` |
| L07-04 | Karte Steinschlag, **G:** Über uns | Als WINTEC-Partner mit 30 Jahren Garantie auf die Verglasung. | Als WINTEC-Partner mit 30 Jahren Garantie auf die Reparatur und die Dichtigkeit ausgetauschter Scheiben. | „auf die Verglasung“ klingt nach Garantie auf das Glas selbst. Die Autoglasseite und die FAQ nennen den genauen Umfang; eine Garantieaussage soll sagen, worauf sie sich bezieht | `pages/LeasingrueckgabePage.tsx:63`, `pages/UeberUnsPage.tsx:47` |
| L07-05 | Ablauf, Schritt 5 | Sie erhalten das Fahrzeug gereinigt zurück, mit Erklärung, was gemacht wurde. | Sie erhalten das Fahrzeug gereinigt zurück, mit einer Erklärung, was wir gemacht haben. | wie L04-06: Artikel fehlt, Passiv | `pages/LeasingrueckgabePage.tsx:121` |
| L07-06 | FAQ „Lohnt es sich …?“ | Bei reiner Gebrauchsspur ohne Substanzschaden raten wir dagegen häufig ab. | Bei reinen Gebrauchsspuren ohne Substanzschaden raten wir dagegen häufig ab. | Plural, wie überall sonst auf der Seite | `data/faqs.ts:171` |
| L07-07 | FAQ „Bekomme ich … einen Ersatzwagen?“ | Nach Verfügbarkeit stellen wir einen Ersatzwagen zur Verfügung. | Nach Verfügbarkeit stellen wir Ihnen einen Ersatzwagen bereit. | „Verfügbarkeit … zur Verfügung“ im selben Satz | `data/faqs.ts:177` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L07-08 | „30 Jahre Garantie“ ohne Umfang (Geschäftskunden, Privatkunden, Leistungsliste, Autoglas-Merkmale, JSON-LD Autoglas) | Fünf Stellen nennen nur „mit 30 Jahren Garantie“. Wird mit L13 Autoglas entschieden, damit der Umfang überall gleich und richtig steht. |
| L07-09 | „Werksniederlassungen deutscher Premiumhersteller“ | Plausibel (Volkswagen Automobile Leipzig gehört zum Konzernhandel); keine Änderung. |

## Geprüft und ohne Befund

Titelbild, Stichwortleiste, „Worum es geht“, Privatkunden- und Geschäftskunden-Kacheln, Leistungskarten Dellen, Felgen,
Lack und Aufbereitung, Ablauf 1–4, FAQ (außer L07-06/07), Abschluss, fünf Bildbeschreibungen, sieben Vorlesetexte,
JSON-LD, Meta-Beschreibung (154 Zeichen).
