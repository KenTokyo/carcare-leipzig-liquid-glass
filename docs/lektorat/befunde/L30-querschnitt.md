# L30 · Querschnitt über alle Seiten

> Grundlage: Build vom 14.10.2026, 01:41, alle 30 Auszüge (`npm run lektorat`), dazu der Quelltext aller Texte, die der
> Auszug nicht sieht (`api/`, `emails/`, `lib/`). Geprüft wurde, was erst im Ganzen sichtbar wird: Titel und
> Beschreibungen nebeneinander, JSON-LD (127 Zeilen), Bildbeschreibungen (32 Texte, 78 dekorative Bilder), Begriffe
> über Seitengrenzen, Gegenprobe des Stilblatts (Zeilen 1–11 und feste Regeln) über den ganzen Code.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis (keine Änderung) · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 14.10.)

Beide Texte zeigt das Formular, wenn der Server eine Anfrage ablehnt; im Auszug erscheinen sie deshalb nie.

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L30-01 | Formularserver, Anhänge zu groß | Die Anhänge sind zusammen größer als 3 MB. (normales Leerzeichen) | … größer als 3 MB. (geschützt) | Stilblatt 5 | `api/anfrage.ts:100` |
| L30-02 | Formularserver, Feld zu lang | Feld "nachricht" ist zu lang. | Feld „nachricht“ ist zu lang. | Feste Regel: deutsche Anführungszeichen | `api/anfrage.ts:153` |

## S · Vorschläge

**Entscheidung des Users (14.10.): alle abgelehnt, nichts geändert** („Lass bitte alles so, wie es ist“). Bildtexte,
„lackierfrei“ und die ISO-Formulierung bleiben; nicht erneut vorschlagen.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L30-03 | Bild `fahrzeugaufbereitung-leipzig-carcare.webp`, **G:** Leistungskarten (5 Seiten) und Ablauf Aufbereitung, Schritt 1 (Startseite) | Fahrzeug nach der Aufbereitung im CarCare Center Leipzig · Fahrzeugaufbereitung im CarCare Center Leipzig: Ein Fahrzeug wird fachgerecht gepflegt. | Mitarbeiter poliert mit der Poliermaschine die Fahrertür eines silbergrauen Fahrzeugs, die Fensterrahmen sind abgeklebt. Fahrzeugaufbereitung im CarCare Center Leipzig | **Sachlich falsch:** Das Bild zeigt das Polieren, nicht ein fertiges Fahrzeug. Zwei verschiedene Texte für dasselbe Bild; SEO-GEO 3.3 verlangt den konkreten Bildinhalt | `data/services.ts:127`, `components/DetailingProcessSection.tsx:28` |
| L30-04 | Bild `leasingrueckgabe-leipzig-carcare.webp`, **G:** Leistungsübersicht und Ablauf Aufbereitung, Schritt 5 „Gepflegt zurückerhalten“ (Startseite) | Fahrzeug in Vorbereitung auf die Leasingrückgabe im CarCare Center Leipzig · Gepflegtes Fahrzeug nach der Aufbereitung im CarCare Center Leipzig. | Grauer SUV mit geöffneten Türen und Heckklappe in unserer Halle, ein Mitarbeiter arbeitet im Innenraum. Vorbereitung auf die Leasingrückgabe im CarCare Center Leipzig | Das Bild zeigt laufende Arbeit, kein fertig gepflegtes Fahrzeug; beide Texte sagen nicht, was zu sehen ist | `data/services.ts:307`, `components/DetailingProcessSection.tsx:49` |
| L30-05 | Bild `autoglas-scheibenreparatur-leipzig-carcare.webp`, **G:** Leistungskarten (5 Seiten) | Scheibentausch an einem Fahrzeug im CarCare Center Leipzig | Zwei Mitarbeiter setzen mit Saughebern die neue Frontscheibe in einen roten Mercedes SLS mit geöffneten Flügeltüren ein. Autoglas im CarCare Center Leipzig | richtig, aber ohne Bildinhalt; die übrigen Leistungsbilder sind konkret beschrieben (Schweißen an der Dachsäule, Leuchtschirm …) | `data/services.ts:251` |
| L30-06 | **G:** „lackierfrei“ an 6 Stellen | Lackierfreie Instandsetzung · lackierfreie Reparaturmethode · Lackierfreie Dellenentfernung | lackfreie … | Dasselbe Verfahren heißt 31-mal „lackfrei“, auch im Titel der Dellenseite („lackfreie Methode“). Ein Begriff je Sache (Prüfkatalog 5). Wissensartikel („lackschadenfrei“, zurückgestellt) und die BVAT-Beschreibung (Wortlaut des Verbands) bleiben | `pages/AccidentRepairPage.tsx:41`, `pages/DellenentfernungPage.tsx:39`, `data/faqs.ts:89`, `data/services.ts:197`, `data/services.ts:198`, `seo/pageSchemas.ts:103` |
| L30-07 | JSON-LD Autoglas | WINTEC-Partner, ISO 9001 TÜV-zertifiziert, 30 Jahre Garantie. | WINTEC-Partner, nach ISO 9001 TÜV-zertifiziert, 30 Jahre Garantie. | wie L13-01 im sichtbaren Text („nach ISO 9001 TÜV-zertifiziert“); ohne „nach“ liest sich „ISO 9001“ als Teil eines Worts | `seo/pageSchemas.ts:123` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L30-08 | Titel, Markenteil | 19 Titel enden auf „\| CarCare Center“. Abweichungen sind entschieden: Unfallinstandsetzung (L02-12, sonst 71 Zeichen), Privatkunden (L15-02), Geschäftskunden (L16), Impressum/Datenschutz (Firmenname). Wissensartikel mischen „\| CarCare Center“ und „\| CarCare Center Wissen“: mit dem Ausbau des Wissensbereichs vereinheitlichen. |
| L30-09 | Titel, Leasingrückgabe | „Leasingrückgabe vorbereiten in Leipzig \| CarCare Center“ (Leistung) und „Leasingrückgabe vorbereiten \| CarCare Center Wissen“ (Ratgeber) zielen auf dieselbe Suche. Beim Ausbau des Wissensbereichs den Ratgeber auf die Frage ausrichten (H1 „Wie bereitet man …?“), sonst konkurrieren die Seiten. |
| L30-10 | JSON-LD `Article` | Kein `datePublished`/`dateModified` (SEO-GEO 5.3, aus L20–L23). Mit dem Ausbau des Wissensbereichs nachtragen, mit echten Daten, nicht erfunden. |
| L30-11 | Bildbeschreibungen, Satzzeichen | Die zehn Texte im Ablauf der Startseite enden mit Punkt, die übrigen 22 ohne. Beides zulässig; bei neuen Bildern der Quelle folgen, in der sie stehen. |
| L30-12 | „Parkdelle“ (6) und „Parkplatzdelle“ (11) | Beides verständlich, „Parkdelle reparieren“ ist ein Suchwort der Dellenseite. Bleibt. |
| L30-13 | Formularserver, Feldnamen | „Feld „nachricht“ ist zu lang.“ nennt den internen Feldnamen. Kommt nur vor, wenn die Längenbegrenzung des Formulars umgangen wird. Bleibt. |
| L30-14 | Autoglas, „ISO-9001-zertifiziert“ | In Beschreibung und Kachel-Überschrift durchgekoppelt (richtig, Duden); im Fließtext „nach ISO 9001 TÜV-zertifiziert“ (L13-01). Zwei Formen, beide richtig. |
| L30-15 | Offen aus früheren Seiten | Rückfragen an André: L01-20, L01-21, L03-11 (Motorreinigung „wasserlöslich“, steht auch im JSON-LD), L16-14. Zum Weitergeben gebündelt in `docs/lektorat/rueckfragen-andre.md`. |

## Gegenprobe des Stilblatts (ganzer Code, ohne Kommentare)

Gezählt am 14.10. in `pages/`, `components/`, `data/`, `seo/`, `lib/`, `emails/`, `api/`, `index.html`:

| Stilblatt | Verworfene Schreibweise | Fundstellen |
|---|---|---|
| 1 | „Spot Repair“, „Smart/Spot Repair“ | 0 |
| 2 | „Smart-Repair“ allein, „Smart Repair-…“ | 0 |
| 3 | „PKW“, „LKW“ | 0 |
| 4 | „Werkstattersatzfahrzeug“, „Ersatzfahrzeug“, „Mietwagen“ | 0 |
| 5 | Zahl und Einheit, „z. B.“ ohne geschütztes Leerzeichen | 1 → 0 (L30-01) |
| 6 | Uhrzeit „08:00“ im Text | 0 (nur der Datenwert `07:00` in `data/oeffnungszeiten.ts`, angezeigt als „7–18 Uhr“) |
| 8 | „…/in“, „…/-frau“ | 0 |
| 11 | „§ 5“, „Art. 6“ ohne geschütztes Leerzeichen | 0 |
| Feste Regeln | „KFZ“, „Email“, „...“, gerade Anführungszeichen | 1 → 0 (L30-02) |
| Feste Regeln | „inkl.“ | 8, alle im Preis-Hinweis „Alle Preise inkl. gesetzlicher Mehrwertsteuer.“ (dort zulässig) |
| Textregeln 1, 3, 4 | „KCare“ u. Ä., „seit 1993/1996“, „3.000 m²“ | 0 |

Telefonnummern: sichtbar nur „0341 - 261 77 90“; die Altnummern und das Fax stehen nur in Kommentaren.

## Geprüft und ohne Befund

Alle 29 Titel und Beschreibungen einzigartig, im Korridor (`meta` 0/29) und mit Open Graph und Twitter gleich; H1 passt
je Seite zu Titel und Suchabsicht. JSON-LD: `AutoRepair` in dritter Person (Textregel 2, Ausnahme 2), `Service` und
`Offer` sachlich gleich mit dem sichtbaren Text, sechs `JobPosting` mit „(m/w/d)“, KC-Refresher dem Hersteller
zugeschrieben (L03-10). Bildbeschreibungen der Mitarbeiterstimmen mit Vornamen, Hero, Alcantara, Schadenreise konkret.
