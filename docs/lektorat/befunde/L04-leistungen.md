# L04 · Leistungsübersicht `/leistungen`

> Auszug `output/lektorat/auszuege/leistungen.md`, rund 815 Wörter: Titelbild, „Alles aus einer Hand“ (vier Kacheln),
> vier Leistungsgruppen mit zwölf Karten, Ablauf in vier Schritten, FAQ (fünf Fragen), Abschluss, zwölf Bildbeschreibungen,
> JSON-LD. Die Kartentexte kommen aus `data/services.ts` (`listDescription`) und stehen teils auch auf anderen Seiten.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L04-01 | Titelbild, **G:** Privatkunden-Titelbild | … als Meisterbetrieb und Glasurit-Lackpartner seit 1998. | … als Meisterbetrieb seit 1998 und Glasurit-Lackpartner. | falscher Bezug mit sachlicher Folge: „seit 1998“ galt für beide. Lackierung und Karosserie kamen laut Zeitstrahl erst 2013 dazu (4.18), die Glasurit-Partnerschaft kann nicht von 1998 sein | `pages/ServicesPage.tsx:67`, `pages/PrivatkundenPage.tsx:93` |
| L04-02 | Karte Dellenentfernung, **G:** Geschäftskunden, Privatkunden | … von Versicherungen und Gutachtern anerkannt, ohne Wertminderung. | … bei Versicherungen und Gutachtern anerkannt, der Originallack bleibt erhalten. | Folge der Entscheidung zu L02-11 (vorsichtige Fassung der Dellen-Aussagen); diese drei Stellen hatte die erste Suche nach „keine Wertminderung“ nicht erfasst | `data/services.ts:198`, `pages/BusinessCustomersPage.tsx:61`, `pages/PrivatkundenPage.tsx:43` |

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L04-03 | H1 | Alle Leistungen vom CarCare Center Leipzig im Überblick. | Alle Leistungen des CarCare Center Leipzig im Überblick. | „vom“ statt Genitiv ist gesprochene Sprache | `pages/ServicesPage.tsx:66` |
| L04-04 | Gruppe „Unfall, Karosserie & Lack“, Einleitung | … Smart Repair, lackfreie Dellenentfernung und Hagelschäden, mit Versicherungsabwicklung auf Wunsch. | … Smart Repair, lackfreie Dellenentfernung und Hagelschadenreparatur, mit Versicherungsabwicklung auf Wunsch. | Die Aufzählung nennt Leistungen; „Hagelschäden“ ist der Schaden, nicht die Leistung | `pages/ServicesPage.tsx:43` |
| L04-05 | Karte Smart Repair (G: wo `listDescription` steht) | Spot-Repair bearbeitet gezielt nur den beschädigten Bereich statt des ganzen Bauteils, die bevorzugte Methode bei kleineren Schäden. | Spot-Repair bearbeitet gezielt nur den beschädigten Bereich statt des ganzen Bauteils. Bei kleineren Schäden ist das unsere bevorzugte Methode. | wie L02-04: Der Nachsatz hängt ohne Bezug am Satz | `data/services.ts:179` |
| L04-06 | Ablauf, Schritt 4 | Wir arbeiten das Fahrzeug im eigenen Haus ab und übergeben es gereinigt zurück, mit Erklärung, was gemacht wurde. | Wir erledigen alle Arbeiten im eigenen Haus und geben Ihnen das Fahrzeug gereinigt zurück, mit einer Erklärung, was wir gemacht haben. | „abarbeiten“ für ein Fahrzeug ist Werkstattjargon; „übergeben … zurück“ doppelt; Passiv am Ende | `pages/ServicesPage.tsx:52` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L04-07 | Meta-Beschreibung „… in Leipzig, im Haus.“ | Knapp; „im eigenen Haus“ wäre klarer, sprengt aber mit 162 Zeichen den Korridor. So lassen. |
| L04-08 | FAQ „Welche Leistungen bietet das CarCare Center …?“, Antwort mit 26 Wörtern | Aufzählung aller Leistungen; als Antwort für KI-Suchmaschinen gewollt lang. |

## Geprüft und ohne Befund

Stichwortleiste, „Alles aus einer Hand“ (vier Kacheln), Gruppen Aufbereitung, Rad & Glas und Geschäftskunden mit allen
Karten, Ablauf Schritte 1–3, FAQ, Abschluss, zwölf Bildbeschreibungen, Vorlesetext des Videoknopfs, JSON-LD.
