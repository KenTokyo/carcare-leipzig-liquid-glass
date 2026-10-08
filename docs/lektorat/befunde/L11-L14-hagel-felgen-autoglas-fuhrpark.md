# L11–L14 · Hagelschaden, Felgen, Autoglas, Fuhrparkservice

> Vier kurze Leistungsseiten (je rund 280–380 Wörter): Titelbild, Leistungsumfang, „Warum CarCare Center Leipzig“, FAQ,
> Abschluss. Auszüge `output/lektorat/auszuege/hagelschadenreparatur-leipzig.md`, `felgenreparatur-leipzig.md`,
> `autoglas-leipzig.md`, `fuhrparkservice-leipzig.md`. Viele Formulierungen stammen erkennbar von der alten Website
> („Kein Problem!“, „Einmal versehentlich am Bordstein entlang geschrammt …“, „Gern stehen wir Ihnen … zur Seite“).
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Seite | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|---|
| L13-01 | Autoglas | Kachel „ISO 9001 TÜV-zertifiziert“ | Unsere Arbeit ist nach ISO 9001 TÜV zertifiziert. | Unsere Arbeit ist nach ISO 9001 TÜV-zertifiziert. | Zusammensetzung mit Abkürzung braucht den Bindestrich (wie im Kacheltitel) | `pages/AutoglasPage.tsx` (USP) |
| L14-01 | Fuhrpark | Einleitung | Gern stehen wir Ihnen in der Betreuung Ihres Firmenfuhrparks zur Seite. | Gern stehen wir Ihnen bei der Betreuung Ihres Firmenfuhrparks zur Seite. | „jemandem bei etwas zur Seite stehen“ | `pages/FuhrparkservicePage.tsx:29` |

Die Vorprüfung meldete auf der Hagelseite „e.V., und“ als doppeltes Satzzeichen. Das ist richtig (Komma nach dem
Abkürzungspunkt); die Regel nimmt Abkürzungen seitdem aus. „e.V.“ bleibt in der Schreibweise des Verbands (3.12).

## S · Vorschläge

**Entscheidung des Users (08.10.): alle angenommen und umgesetzt** (L11-03 behält „System Audatex“). Die FAQ-Antwort
zu L11-04 („Übernehmen Sie die Abstimmung …?“) beginnt dabei nach Textregel 2, Ausnahme 3 mit „Ja.“.

| Nr | Seite | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|---|
| L11-01 | Hagel | Einleitung und FAQ „Wird das Fahrzeug wieder wie vorher?“ | Sie sind mit Ihrem Fahrzeug in einen Hagelschauer gekommen? Kein Problem! Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird, … · FAQ: Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird. | Ihr Fahrzeug ist in einen Hagelschauer geraten? Wir bringen es wieder in den Originalzustand, inklusive Kalkulation und Abwicklung mit Ihrer Versicherung. · FAQ: Ja, in aller Regel. Bei intaktem Lack entfernen wir die Hageldellen lackfrei. | „Kein Problem!“ verharmlost einen Schaden; „helfen dabei, dass … versetzt wird“ ist umständlich. Die FAQ-Antwort beginnt mit „Ja“ (Antwort zuerst) | `HagelschadenreparaturPage.tsx:32`, `data/faqs.ts:100` |
| L11-02 | Hagel | Kachel „Komplette Schadenabwicklung“ und FAQ | … und wickeln das gesamte Schadensereignis für Sie ab. | … und wickeln den gesamten Schadenfall für Sie ab. | Man wickelt einen Fall ab, kein Ereignis | `HagelschadenreparaturPage.tsx:9`, `data/faqs.ts:98` |
| L11-03 | Hagel | Kachel „Kalkulation mit Audatex“ und FAQ | … mit dem durch Versicherer und Gutachter anerkannten System Audatex. | … mit dem von Versicherern und Gutachtern anerkannten System Audatex. | Urheber im Passiv mit „von“; so steht es schon auf der Unfallseite | `HagelschadenreparaturPage.tsx:8`, `data/faqs.ts:99` |
| L11-04 | Hagel, Felgen | zwei FAQ-Fragen | Übernehmt ihr die Abstimmung …? · Repariert ihr auch polierte bzw. glanzgedrehte Felgen? | Übernehmen Sie die Abstimmung …? · Reparieren Sie auch polierte bzw. glanzgedrehte Felgen? | Alle anderen Fragen siezen; „ihr“ fällt aus dem Ton der Seite (wie L01-15) | `data/faqs.ts:98`, `data/faqs.ts:107` |
| L12-01 | Felgen | Kachel „TÜV-zertifiziertes Verfahren“ | … arbeiten wir nach den strengen gesetzlichen TÜV-Richtlinien. | … arbeiten wir nach den strengen TÜV-Richtlinien. | TÜV-Richtlinien sind keine Gesetze; die FAQ trennt es richtig („gesetzlichen Vorgaben und strengen TÜV-Richtlinien“) | `FelgenreparaturPage.tsx:14` |
| L12-02 | Felgen | Kachel „Keine Eingriffe ins Materialgefüge“ und FAQ | Schweißarbeiten und Rückverformungen sind gesetzlich abzulehnen und werden nicht durchgeführt. · FAQ: … sind gesetzlich grundsätzlich abzulehnen. | Schweißarbeiten und Rückverformungen sind nicht zulässig, deshalb führen wir sie nicht durch. · FAQ: … sind nicht zulässig. | „gesetzlich abzulehnen“ gibt es nicht; gemeint ist „unzulässig“ | `FelgenreparaturPage.tsx:17`, `data/faqs.ts:105` |
| L12-03 | Felgen | Kachel „Werterhalt statt Neukauf“ | Statt der teuren Anschaffung neuer Originalfelgen bleibt der Wert des Fahrzeugs erhalten. | Sie sparen die teure Anschaffung neuer Originalfelgen, und der Wert des Fahrzeugs bleibt erhalten. | „Statt der Anschaffung bleibt der Wert erhalten“ verknüpft zwei Dinge, die nicht zusammenpassen | `FelgenreparaturPage.tsx:19` |
| L13-02 | Autoglas | Einleitung | … bei unserem WINTEC-Autoglas-Partner sind Sie in den besten Händen. | … bei uns als WINTEC-Autoglas-Partner sind Sie in guten Händen. | „bei unserem … Partner“ klingt, als mache ein anderer Betrieb die Arbeit; die Seite sagt sonst „Als WINTEC-Partner geben wir …“. „in den besten Händen“ ist eine Spitzenaussage | `AutoglasPage.tsx:29` |
| L13-03 | Autoglas | Abschluss | Wir prüfen, ob eine Steinschlagreparatur reicht oder die Scheibe getauscht wird, … | Wir prüfen, ob eine Steinschlagreparatur reicht oder die Scheibe getauscht werden muss, … | Die Prüfung entscheidet, ob getauscht werden muss | `AutoglasPage.tsx:58` |
| L13-04 | **G:** Geschäftskunden, Privatkunden, Leistungsliste | Garantie ohne Umfang | … als WINTEC-Partner mit 30 Jahren Garantie. | … als WINTEC-Partner mit 30 Jahren Garantie auf Reparatur und Dichtigkeit. | Eine Garantieaussage soll sagen, worauf sie sich bezieht (L07-08). Kurzform passt in die Karten | `BusinessCustomersPage.tsx:64`, `PrivatkundenPage.tsx:63`, `data/services.ts:246` |
| L14-02 | **G:** Fuhrpark, Geschäftskunden, FAQ | „Schadensfall“ (7×) | Schadensfall | Schadenfall | Beide Formen sind richtig; die Website nutzt sonst „Schadenfall“ (9× plus 6× „Schadenfälle“), wie „Schadenkalkulation“ (L02-07) | `FuhrparkservicePage.tsx:7/14/29`, `BusinessCustomersPage.tsx:50`, `data/faqs.ts:114` |

## H · Hinweise (keine Änderung)

| Nr | Seite | Hinweis |
|---|---|---|
| L13-05 | Autoglas | Titelbeschreibung und Überschrift nennen „30 Jahre Garantie“ ohne Umfang; dort fehlt der Platz, die Kachel darunter nennt ihn. So lassen. |
| L13-06 | Autoglas | „Unsere Arbeit ist nach ISO 9001 TÜV-zertifiziert“: Die Zertifizierung gehört vermutlich zum WINTEC-Netz. Ist der eigene Betrieb zertifiziert? Bei Gelegenheit mit André klären; im Text bleibt es, weil es so seit der alten Seite steht. |
| L13-07 | Autoglas | „Ersatzwagen gratis“ / „kostenlos“: Werbeaussage, laut alter Seite Standard bei WINTEC. Ohne Änderung. |
| L14-03 | Fuhrpark | „Profitieren Sie von unseren langjährigen Kooperationspartnern“ ist allgemein gehalten, aber nicht falsch. |

## Geprüft und ohne Befund

Hagel: BVAT-Block, Kacheln „Keine Anzahlung“, „Lackfreie Instandsetzung“, Warum-Kacheln, FAQ 1, Abschluss.
Felgen: Einleitung, Kacheln „Bis zu 90 %“, „Bis 1 mm Tiefe“, „Glanzgedrehte Felgen“, Warum-Kacheln, FAQ 2 und 4, Abschluss.
Autoglas: Leistungskacheln, FAQ, Full-Service-Kachel. Fuhrpark: Leistungskacheln, Warum-Kacheln, FAQ, Abschluss.
Titel und Beschreibungen aller vier Seiten im Korridor.
