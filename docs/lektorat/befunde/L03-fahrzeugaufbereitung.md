# L03 · Fahrzeugaufbereitung `/fahrzeugaufbereitung-leipzig`

> Auszug `output/lektorat/auszuege/fahrzeugaufbereitung-leipzig.md`, rund 1.700 Wörter (längste Seite): Titelbild,
> Pflegepakete mit Preisen, Desinfektion, Exklusiv- und Zusatzleistungen, drei Bereiche, Leasingrückgabe, Galerie,
> Ablauf, Expertise, FAQ (neun Fragen), Abschluss, Bildbeschreibungen, JSON-LD mit Angebotskatalog.
> Paketnamen („Brillant Außenpflege“, „Intensiv Innenraumreinigung“, „Premiumpflege „exklusiv““) und die Buchungsregeln
> sind Andrés Wortlaut (6.7, 6.24) und werden nicht umformuliert.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · F = Frage an André · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 07.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L03-01 | Titelbild, Untertitel | Innenraum und Außenpflege, Politur, … | Innenraum- und Außenpflege, Politur, … | Ergänzungsstrich (gemeint: Innenraumpflege und Außenpflege) | `pages/VehicleDetailingPage.tsx:50` |
| L03-02 | **G: Preise im Fließtext, alle Seiten** (Titelbild, Paket-Einleitung, Zusatzleistungen, FAQ, Beschreibungen, JSON-LD) | „ab 169,00 €“, „für 45,00 €“ … | „ab 169 €“, „für 45 €“ … | Stilblatt 9 (07.10.): Kacheln mit Cent, Fließtext ohne. 34 feste Stellen in 10 Dateien; dazu der Helfer `fliesstextPreis`, der FAQ- und Einleitungspreise aus den Kacheldaten bildet („95,20 €“ bleibt). Die Preise in den Kacheln sind unverändert | `data/detailing.ts` (Helfer), `data/faqs.ts` (15), `data/privatkunden.ts`, `seo/pageSchemas.ts`, sieben Seiten |
| L03-03 | Paket Premiumpflege „exklusiv“ | … mit ausgesuchten Produktlinien, u. a. Wachsen von Swissvax … | … unter anderem Wachsen von Swissvax … | Abkürzungen im Fließtext ausschreiben (Stilblatt, feste Regeln) | `data/detailing.ts:88` |
| L03-04 | Ozonbehandlung | Ca. 30 Minuten Einwirkzeit, danach etwa 30 Minuten … | Rund 30 Minuten Einwirkzeit, danach etwa 30 Minuten … | dto.; „ca.“ und „etwa“ im selben Satz | `data/zusatzleistungen.ts` (Ozon) |

Die Vorprüfung meldete „Anhaftungen, **die die** Wäsche stehen lässt“ als Wortdoppelung. Das ist richtig
(Relativpronomen plus Artikel); die Regel nimmt Artikel und Pronomen seitdem aus. Reine Preiskacheln meldet die
Preisregel nicht mehr.

## S · Vorschläge

**Entscheidung des Users (08.10.): alle angenommen und umgesetzt.** L03-11 (Motorreinigung) bleibt Frage an André.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L03-05 | Paket-Einleitung und FAQ „Welches Pflegepaket …?“ (G) | Wünschen Sie beides für sich und Ihr Fahrzeug oder stehen Verkauf oder Leasingrückgabe an, … | Wünschen Sie beides, oder stehen Verkauf oder Leasingrückgabe an, … | „für sich und Ihr Fahrzeug“ ist Füllstoff ohne Aussage | `pages/VehicleDetailingPage.tsx:64`, `data/faqs.ts:61` |
| L03-06 | Leasingrückgabe, „Was der Rückgabegutachter bewertet“ | Lackschäden, Diverses an Stoßfängern, Dellen, … | Lackschäden, Schäden an Stoßfängern, Dellen, … | „Diverses“ ist umgangssprachlich und unbestimmt | `pages/VehicleDetailingPage.tsx:21` |
| L03-07 | Galerie, Einleitung | … aus Innen-, Außen- und Lackaufbereitung. Die Spalten bewegen sich sanft beim Scrollen. | … aus Innen-, Außen- und Lackaufbereitung. | Der zweite Satz beschreibt die Technik der Seite, nicht das Angebot | `components/DetailingGallery.tsx:226` |
| L03-08 | Expertise, Überschrift | Für Premiumfahrzeuge, Autohäuser, Fuhrparks und hohe Qualitätsstandards. | Für Premiumfahrzeuge, Autohäuser und Fuhrparks, mit hohen Qualitätsstandards. | Man arbeitet nicht „für Qualitätsstandards“; die Aufzählung mischt Kunden und Anspruch | `pages/VehicleDetailingPage.tsx:222` |
| L03-09 | Expertise, Einleitung | Wir arbeiten neutral, professionell und mit dem Anspruch, … | Wir arbeiten markenunabhängig, sorgfältig und mit dem Anspruch, … | „neutral“ ist hier unklar (gegenüber wem?); gemeint ist vermutlich markenunabhängig. „professionell“ ist eine Floskel | `pages/VehicleDetailingPage.tsx:223` |
| L03-10 | Heißvernebelung (G: Kachel, Formular-Zusatzleistung, JSON-LD) | Die Wirksamkeit gegenüber Bakterien und Schimmel wurde vom Institut für Biochemie der Universität Mannheim bestätigt. | Laut Hersteller Koch-Chemie hat das Institut für Biochemie der Universität Mannheim die Wirksamkeit gegenüber Bakterien und Schimmel bestätigt. | Die Angabe stammt vom Hersteller (Koch-Chemie, Expertenbeitrag); einen veröffentlichten Prüfbericht gibt es nicht. Mit Quelle ist die Werbeaussage nachvollziehbar (Ebene 6) | `data/zusatzleistungen.ts` (Heißvernebelung) |

## F · Frage an André

| Nr | Stelle | Frage |
|---|---|---|
| L03-11 | Motorreinigung (G: Kachel, Formular, JSON-LD) | „Wir reinigen den Motorraum und versiegeln ihn mit einer wasserlöslichen Schutzschicht.“ Das ist Andrés Wortlaut (05.10.). Eine wasserlösliche Schicht würde beim nächsten Regen abgewaschen. Gemeint ist vermutlich „wasserbasiert“ (Pflegemittel auf Wasserbasis) oder „wasserabweisend“. Was ist richtig? |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L03-12 | Paketnamen „Brillant Außenpflege“, „Intensiv Innenraumreinigung“ | Nach Duden wären es Bindestrich-Wörter („Brillant-Außenpflege“). Als Andrés Produktnamen bleiben sie wie geliefert, einheitlich auf allen Seiten. |
| L03-13 | Ozonbehandlung: „eines der stärksten Desinfektionsmittel“, „zerstört zuverlässig die Zellwände“ | Fachlich vertretbare Aussagen über Ozon, aber werblich zugespitzt (Ebene 6). Ohne Änderung, falls André sie so will. |
| L03-14 | Galerie „Ergebnisse, die man sieht.“ | Zeigt weiter Platzhalterkacheln „Beispiel“, „Versiegelung“ und „Keramikschutz“ getrennt (Backlog 5.37 offen, 5.38–5.41 laut User erledigt). Sobald die Fotos kommen, die Kacheltitel mitprüfen. |

## Geprüft und ohne Befund

Titelbild und Stichwortleiste, Paketkacheln samt Aufpreis- und Preis-Hinweisen (dort ist „inkl.“ zulässig),
Desinfektion (außer L03-10/13), Keramik-, Nano- und Frontscheibenversiegelung, Felgenintensivreinigung,
Cabrio-Verdeckimprägnierung, drei Bereiche, Leasingrückgabe (außer L03-06), Ablauf (wie Startseite), Expertise-Kacheln,
FAQ (außer L03-05), Abschluss, Bildbeschreibungen, JSON-LD.
