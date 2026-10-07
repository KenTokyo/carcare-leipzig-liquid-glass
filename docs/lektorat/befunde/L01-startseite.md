# L01 · Startseite `/`

> Auszug `output/lektorat/auszuege/startseite.md` (Build vom 06.10.2026), rund 1.080 Wörter: Titelbild, Leistungskarten,
> Schadenablauf, Zielgruppen mit Partnerlisten, Aufbereitung, Aufbereitungsablauf, Google-Bewertungen, FAQ, Kontaktblock,
> 11 Bildbeschreibungen, Vorlesetexte, JSON-LD.
> Öffnungszeiten und Mega-Menü sind in L00 erledigt.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag, wartet auf Entscheidung · F = Frage an André · H = Hinweis.
> **G** = geteilte Quelle, die Änderung wirkt auch auf den genannten anderen Seiten.

## K · Korrekturen (umgesetzt am 06.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L01-01 | Zielgruppen › Versicherer (G: Geschäftskunden) | HUK Coburg | HUK-Coburg | Markenname wie der Inhaber (HUK-COBURG), Stilblatt | `data/partners.ts:63`, FAQ `data/faqs.ts:143` |
| L01-02 | dto. | HUK 24 | HUK24 | dto. (HUK24 AG) | `data/partners.ts:64` |
| L01-03 | dto. | Cosmos Direkt | CosmosDirekt | dto. | `data/partners.ts:69` |
| L01-04 | dto. | S-direkt | S-Direkt | dto. (Sparkassen DirektVersicherung, Marke „S-Direkt“) | `data/partners.ts:88` |
| L01-05 | dto. | freeyou ag | freeyou | Rechtsform klein geschrieben; die übrigen Einträge stehen ohne Rechtsform | `data/partners.ts:79` |
| L01-06 | Aufbereitung, Einleitung | Wir bereiten Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung auf … | Mit langjähriger Erfahrung bereiten wir Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks auf … | falscher Bezug: „mit langjähriger Erfahrung“ hing an „Fuhrparks“ | `components/AutoDetailingExpertiseSection.tsx:149` |

## S · Vorschläge

**Entscheidung des Users (07.10.): alle angenommen und umgesetzt** („Setze deine Vorschläge um“). 18 und 19 stehen
seitdem als Entscheidungen 9 und 10 im Stilblatt; 19 als Ausnahme 3 von Textregel 2 in `CLAUDE.md`.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L01-07 | Leistungskarte Unfallinstandsetzung, Knopf (G: alle Kartenreihen) | Unfall melden | Zur Unfallinstandsetzung | Der Knopf führt auf die Leistungsseite, nicht zur Schadenmeldung; „melden“ verspricht etwas anderes | `data/services.ts:141` |
| L01-08 | Leistungskarte Autoglas, Titel (G) | Autoglas / Scheibenfolien | Autoglas & Scheibenfolien | Schrägstrich zwischen Einzelwörtern stünde ohne Leerzeichen („Autoglas/Scheibenfolien“), das wäre ein langes, schlecht umbrechendes Wort in der schmalen Karte; „&“ passt zu den übrigen Titeln | `data/services.ts:243` |
| L01-09 | Leistungskarte Leasingrückgabe, Knopf (G) | Leasing vorbereiten | Leasingrückgabe vorbereiten | vorbereitet wird die Rückgabe, nicht das Leasing; die Karte unten heißt schon „Leasingrückgabe vorbereiten“ | `data/services.ts:303` |
| L01-10 | Leistungskarte Fuhrparkservice, Knopf (G) | Fuhrparkservice | Zum Fuhrparkservice | alle anderen Knöpfe sind Handlungen; Vorlesetext lautet sonst „Fuhrparkservice: Fuhrparkservice“ | `data/services.ts:320` |
| L01-11 | Leistungskarte Hagelschaden (G) | Strukturierte Hilfe nach Hagelereignissen und Dellenfeldern. | Strukturierte Hilfe nach Hagelschäden, auch bei vielen Dellen. | „Hagelereignis“ und „Dellenfeld“ sind Fachjargon | `data/services.ts:214` |
| L01-12 | Schadenablauf, Überschrift | Unfallschaden? Wir übernehmen Reparatur, Gutachten und Abstimmung mit der Versicherung. | Unfallschaden? Wir übernehmen Reparatur, Kalkulation und die Abstimmung mit Gutachter und Versicherung. | „Gutachten übernehmen“ liest sich wie „wir erstellen das Gutachten“; Schritt 03 sagt richtig „stimmen wir uns mit einem Gutachter ab“ | `components/AccidentDamageSection.tsx:86` |
| L01-13 | Aufbereitung, Einleitung (nach L01-06) | … und erklären transparent, welche … achten sollten. (ein Satz, 35 Wörter) | Mit langjähriger Erfahrung bereiten wir Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks auf. Wir erklären, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Sie bei Lack, Innenraum und Leasingrückgabe achten sollten. | zwei Sätze lesen sich leichter; „transparent“ ist eine Floskel ohne Aussage | `components/AutoDetailingExpertiseSection.tsx:149` |
| L01-14 | Aufbereitungsablauf, Schritt 04 | Innen, Außen, Lack und Details nach dem höchsten Standard. | Innen, Außen, Lack und Details, gründlich und nach festem Ablauf. | „höchster Standard“ ist eine Spitzenstellungsaussage ohne Beleg (Werbung, Ebene 6) | `data/detailing.ts:319` |
| L01-15 | FAQ, Frage 2 und Antwort | Unterstützt das CarCare Center bei der Abstimmung mit Versicherung oder Gutachter? · Auf Wunsch begleiten wir … | Unterstützen Sie mich bei der Abstimmung mit Versicherung oder Gutachter? · Ja. Auf Wunsch begleiten wir … | „unterstützen“ ohne Objekt; Antwort zuerst (SEO-GEO 4.3), wie die anderen Antworten mit „Ja.“ | `data/faqs.ts:30` |
| L01-16 | FAQ, Frage 5 und Antwort, FAQ-Einleitung (G: alle FAQ-Blöcke mit Standardeinleitung) | Gibt es während der Reparatur Ersatzmobilität? · Ersatzmobilität wird kommuniziert und organisiert, sofern ein passendes Fahrzeug verfügbar ist und die Rahmenbedingungen stimmen. · „… Geschäftskunden und Ersatzmobilität.“ | Bekomme ich während der Reparatur einen Ersatzwagen? · Ja, nach Verfügbarkeit stellen wir Ihnen einen Ersatzwagen für die Dauer der Reparatur. Sprechen Sie uns bei der Schadenmeldung darauf an. · „… Geschäftskunden und Ersatzwagen.“ | Passiv, ohne Wir-Form und ohne klare Antwort; Stilblatt 4 („Ersatzwagen“); deckt sich dann mit den Antworten auf den Leistungsseiten | `data/faqs.ts:33`, `components/FAQSection.tsx:19` |
| L01-17 | Kontaktblock „Sprechen Sie uns an.“ (G: alle Seiten mit Kontaktblock) | Schadenmeldung, Aufbereitungstermin oder Anfrage als Geschäftskunde: Ihre Anfrage öffnet sich direkt hier auf der Seite. | Aufbereitungstermin oder Anfrage als Geschäftskunde: Das Formular öffnet sich direkt hier auf der Seite. Einen Schaden melden Sie online über reparatur.info. | Die Schadenmeldung öffnet sich nicht auf der Seite, sie führt seit 16.09. zu reparatur.info; „Ihre Anfrage öffnet sich“ ist schief | `components/KontaktDaten.tsx:111` |
| L01-18 | **Stilblatt: Preisformat** (erste betroffene Seite) | „ab 169,00 €“ im Fließtext (Zielgruppen › Ihre Vorteile) neben „ab 169 €“ in Titeln und Beschreibungen | Preiskacheln und Preis-Hinweise mit Cent („169,00 €“), Fließtext, Titel und Beschreibungen ohne („169 €“) | ein Format je Textsorte; im Fließtext lesen sich ganze Euro leichter | `data/privatkunden.ts:36` u. a. |
| L01-19 | **Grundsatz: FAQ-Fragen in Kundensicht** (alle Seiten) | „Arbeitet das CarCare Center auch für Autohäuser …?“, „Unterstützt das CarCare Center …?“ und weitere | als Kundensicht **zulassen** und Textregel 2 entsprechend präzisieren | Textregel 2 verbietet den Firmennamen als Subjekt in dritter Person. Die Fragen sind aber Kundenstimme, nicht Selbstbeschreibung, und der Name in der Frage hilft KI-Suchmaschinen (SEO-GEO 4.3). Betrifft auf allen Seiten etwa ein Dutzend Fragen | `data/faqs.ts` |

## F · Fragen an André

| Nr | Stelle | Frage |
|---|---|---|
| L01-20 | Zielgruppen › Versicherer | „Deutsche Post“ steht in der Liste der Versicherer. Ist das ein Versicherer, ein Schadensteuerer oder ein Flottenkunde? |
| L01-21 | dto. | „vrk+“: Gemeint ist vermutlich die VRK (Versicherer im Raum der Kirchen), die sich selbst „VRK“ schreibt. Ist „vrk+“ ein bestimmtes Produkt? |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L01-22 | Titelbild: „Dafür steht das CarCare Center Leipzig“ | Firmenname als Subjekt in dritter Person, aber im Titelbild durch Textregel 2, Ausnahme 1 gedeckt. |
| L01-23 | Zielgruppen › Versicherungen: „Instandsetzung statt Tauschen“ | Kundenwortlaut aus Backlog 4.12, bleibt. |
| L01-24 | Meta-Beschreibung | Ohne Handlungsaufforderung (SEO-GEO 3.1). Mit 146 Zeichen bleibt kaum Platz; ein Zusatz wie „Jetzt anfragen.“ ginge über 160. |

## Geprüft und ohne Befund

Titelbild und Vertrauensleiste, Einleitungen von Leistungen, Schadenablauf und Zielgruppen, Privatkunden-Vorteile,
Kartentexte Innen- und Außenaufbereitung, Ratgeber-Links, Aufbereitungsablauf (außer Schritt 04), Bewertungsblock samt
Hinweis nach § 5b UWG, FAQ-Fragen 1, 3, 4, alle elf Bildbeschreibungen, Vorlesetexte der Karten, JSON-LD (dritte Person
dort erlaubt).
