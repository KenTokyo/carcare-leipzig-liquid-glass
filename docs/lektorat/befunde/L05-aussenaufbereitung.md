# L05 · Außenaufbereitung `/aussenaufbereitung-leipzig`

> Auszug `output/lektorat/auszuege/aussenaufbereitung-leipzig.md`, rund 1.080 Wörter: Titelbild, Pakete und Preise,
> Umfang der Außenaufbereitung (fünf Schritte), Lackaufbereitung (vier Schritte), Versiegelungen und Zusatzleistungen
> (geteilt mit L03), „Warum CarCare Center Leipzig“, FAQ (sechs Fragen), Ratgeber-Hinweis, Abschluss.
> Einleitung („gewünschte Frische“, „perfekt kombinieren“) und die Schrittbeschreibungen der Außenpflege sind Andrés
> Wortlaut (05.10., 4.5, 6.24).
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L05-01 | Kachel „Full-Service auf über 3.500 m²“, **G:** jede Überschrift über `GanzwortTitel` | „3.500“ und „m²“ trennbar, obwohl im Text ein geschütztes Leerzeichen steht | bleibt zusammen | Stilblatt 5. Fehler im Code: `GanzwortTitel` zerlegte Überschriften mit `split(/\s+/)`, und `\s` schließt in JavaScript das geschützte Leerzeichen ein. Jetzt trennt die Komponente nur an normalem Leerraum; die Breitentabelle kennt U+00A0. Gefunden von der Vorprüfung | `components/GanzwortTitel.tsx:57–60, 42` |

Dabei auch das unsichtbare Trennzeichen (U+00AD) in derselben Funktion als sichtbares Escape `\u00AD` geschrieben.

## S · Vorschläge

**Entscheidung des Users (08.10.): alle angenommen und umgesetzt** (04 auf allen vier Seiten).

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L05-02 | Lackaufbereitung, Schritt 4 | Nach Absprache erweitern wir die Lackaufbereitung mit Wachs-, Nano- oder Keramikversiegelung. | Nach Absprache erweitern wir die Lackaufbereitung um eine Wachs-, Nano- oder Keramikversiegelung. | „erweitern um“ ist die übliche Fügung | `pages/AussenaufbereitungPage.tsx:48` |
| L05-03 | „Warum CarCare Center Leipzig“, Kachel 1 | Titel „Meisterbetrieb seit 1998“, Text „Meisterbetrieb seit 1998. Das Lackwissen aus der Reparatur kommt der Pflege zugute.“ | Text nur „Das Lackwissen aus der Reparatur kommt der Pflege zugute.“ | Der erste Satz wiederholt den Titel wörtlich | `pages/AussenaufbereitungPage.tsx:52` |
| L05-04 | Kachel „Full-Service auf über 3.500 m²“ (**G:** Außen, Innen, Felgen, Autoglas) | … Karosserie, Smart Repair, Spot-Repair und Felgen … | … Karosserie, Smart Repair und Felgen … | Spot-Repair ist Teil von Smart Repair (so erklärt es der eigene Ratgeber); die Aufzählung nennt es doppelt. Entstand aus „Smart/Spot Repair“ (Stilblatt-Durchgang 06.10.) | `AussenaufbereitungPage.tsx:53`, `InnenaufbereitungPage.tsx:45`, `FelgenreparaturPage.tsx:24`, `AutoglasPage.tsx:14` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L05-05 | Einleitung | „gibt Ihrem Lack die gewünschte Frische zurück“ und „perfekt kombinieren“ sind werblich, aber Andrés Wortlaut vom 05.10. |
| L05-06 | Schritt „Intensive Handoberwäsche“: „Intensive Oberwäsche von Hand.“ | Wiederholt den Titel, ist aber Andrés Pakettext (4.5, 6.24). |
| L05-07 | Motorreinigung „wasserlösliche Schutzschicht“ | Frage an André, siehe L03-11. |

## Geprüft und ohne Befund

Pakete und Preise (Fließtextpreise seit L03 ohne Cent), Aufpreis- und Preis-Hinweise, Außenpflege-Schritte, Lackaufbereitung
1–3, Versiegelungen und Zusatzleistungen (wie L03), Kacheln „Full-Service“ (außer L05-04) und „Privat-, Geschäfts- und
Flottenkunden“, FAQ, Ratgeber-Hinweis, Abschluss. Bilder: Die Seite nutzt nur das Hintergrundfoto (CSS), kein `img`.
