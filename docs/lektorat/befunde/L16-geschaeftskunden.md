# L16 · Geschäftskunden `/geschaeftskunden`

> Auszug `output/lektorat/auszuege/geschaeftskunden.md`, rund 1.060 Wörter: Titelbild, „Wen wir betreuen“ (vier Karten),
> Schwerpunkte Leasingrückgabe und Fuhrparkservice, acht Leistungskarten, Zusammenarbeit (acht Kacheln), Referenzen
> (fünf Autohäuser, 31 Versicherer, riparo), Ablauf, FAQ (acht Fragen), Abschluss, JSON-LD. Der Ton ist sachlich und
> passt zur Zielgruppe; Garantie-Umfang und „Schadenfall“ sind seit L13/L14 bereinigt.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · F = Frage an André · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L16-01 | **G:** Referenzen › Versicherer, Startseite › Zielgruppen | Nexible · Wefox | nexible · wefox | Markennamen wie der Inhaber (Stilblatt); beide schreiben sich klein („nexible GmbH“, „wefox Insurance AG“), wie „janitos“ und „freeyou“ in derselben Liste (L01-05) | `data/partners.ts:84/92` |

## S · Vorschläge

**Entscheidung des Users (08.10.): alle angenommen und umgesetzt** (L16-10 als „eine langfristige Rahmenvereinbarung“).
**Nebenwirkung L16-13:** „Geschäftskundenanfrage stellen“ braucht 246 px; im Abschluss-Band stehen bei 390 px nur 218 px
zur Verfügung (bis etwa 420 px Fensterbreite), der Knopf bricht dort zweizeilig um. Im Titelbild passt er ab 375 px
(bei 360 px brach er schon vorher um). Dem User zur Wahl vorgelegt: zweizeilig lassen oder kürzer für beide Knöpfe.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L16-02 | „Wen wir betreuen“, Einleitung | Autohäuser brauchen Präsentationsqualität, Flotten brauchen Planbarkeit, Versicherer und Schadensteuerer brauchen nachvollziehbare Kalkulation. Wir bedienen alle drei Logiken. | … Versicherer und Schadensteuerer brauchen eine nachvollziehbare Kalkulation, Agenturen einen festen Ansprechpartner. Unsere Abläufe sind auf alle vier ausgelegt. | Die Überschrift sagt „Vier Arten“, darunter stehen vier Karten, der Text zählt drei. „Logiken bedienen“ ist Beraterjargon | `pages/BusinessCustomersPage.tsx:124` |
| L16-03 | „Schwerpunkte“, Einleitung | Zwei Angebote, die für gewerbliche Kunden den größten Unterschied machen, weil … | Zwei Angebote, die für gewerbliche Kunden am stärksten ins Gewicht fallen, weil … | „den Unterschied machen“ ist dem Englischen nachgebildet („make the difference“) | `pages/BusinessCustomersPage.tsx:135` |
| L16-04 | Karte Leasingrückgabe | Fahrzeuge vor der Rückgabe begutachten und instand setzen, bevor der Rückgabegutachter sie nach den Sätzen des Leasinggebers bewertet. | Wir begutachten Fahrzeuge und setzen sie instand, bevor der Rückgabegutachter sie nach den Sätzen des Leasinggebers bewertet. | „vor der Rückgabe … bevor“ sagt dasselbe zweimal; der Infinitivsatz hat kein Subjekt | `pages/BusinessCustomersPage.tsx:36` |
| L16-05 | **G:** Karte Fuhrparkservice, Fuhrparkseite › Leistungsumfang | Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf, sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge(, aus einer Hand). | Geschäftskunden: Wir übernehmen sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge, von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf. · Fuhrparkseite: Sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge aus einer Hand, von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf. | Das Komma stand für einen früheren Gedankenstrich; so hängt „sämtliche Arbeiten“ ohne Satzbau an der Aufzählung. In L14 übersehen | `BusinessCustomersPage.tsx:47`, `FuhrparkservicePage.tsx:52` |
| L16-06 | Karte Fuhrparkservice, Liste | Im Schadenfall halten wir Sie mobil und leiten die Schritte ein | … und leiten alle weiteren Schritte ein | „die Schritte“ verweist auf nichts | `pages/BusinessCustomersPage.tsx:50` |
| L16-07 | Leistungskarte Unfallinstandsetzung | Kompletter Schadenfall inklusive Karosserie, Lack und Abstimmung mit Versicherung und Gutachter. | Abwicklung des kompletten Schadenfalls, inklusive Karosserie, Lack und Abstimmung mit Versicherung und Gutachter. | Ein Schadenfall „enthält“ keine Karosserie; gemeint ist die Abwicklung | `pages/BusinessCustomersPage.tsx:58` |
| L16-08 | Leistungskarte Smart Repair | … bei Flotten und Rückläufern der wirtschaftlichste Weg. | … bei Flotten und Rückläufern oft der wirtschaftlichste Weg. | Ohne Einschränkung eine Alleinstellung (Ebene 6); ob Smart Repair reicht, hängt vom Schaden ab (Karte selbst: „kleinerer Schäden“) | `pages/BusinessCustomersPage.tsx:60` |
| L16-09 | Kacheln „Dokumentierte Prozesse“, „Ersatzmobilität“ | … saubere Übergaben und Endabnahme gehören zum Ablauf. · …, damit Fahrzeugausfall nicht zum Betriebsausfall wird. | … saubere Übergaben und eine Endabnahme gehören … · …, damit ein Fahrzeugausfall nicht zum Betriebsausfall wird. | Artikel fehlt; im Kachelstil vertretbar, liest sich mit Artikel flüssiger | `pages/BusinessCustomersPage.tsx:76/78` |
| L16-10 | Kachel „Flexible Zusammenarbeit“ | Einzelauftrag, laufende Betreuung oder perspektivische Rahmenprozesse, je nach Bedarf. | Einzelauftrag, laufende Betreuung oder eine langfristige Rahmenvereinbarung, je nach Bedarf. | „perspektivisch“ heißt „künftig“ und klingt nach interner Planung. Falls Rahmenvereinbarungen noch gar nicht angeboten werden: den dritten Teil streichen | `pages/BusinessCustomersPage.tsx:79` |
| L16-11 | FAQ „Hat das CarCare Center Erfahrung mit Premiumfahrzeugen?“ | Ja. Wir arbeiten als Glasurit-Lackpartner farbtongenau und mit sorgfältigem Umgang bei hochwertigen Fahrzeugen und sensiblen Oberflächen. | Ja. Wir arbeiten unter anderem für das Porsche Zentrum und das Porsche Werk Leipzig. Als Glasurit-Lackpartner lackieren wir farbtongenau und gehen sorgfältig mit hochwertigen Fahrzeugen und sensiblen Oberflächen um. | „arbeiten … mit sorgfältigem Umgang“ passt nicht zusammen. Die Antwort belegt die Erfahrung mit einer Tatsache von derselben Seite (SEO-GEO 4.3: Fakten statt Floskel) | `data/faqs.ts:146` |
| L16-12 | FAQ-Frage | Gibt es digitale Schadenübermittlung? | Kann ich Schäden digital übermitteln? | Kundensicht (Stilblatt 10); ohne Artikel klingt die Frage abgehackt | `data/faqs.ts:150` |
| L16-13 | Abschluss, Knopf | Partneranfrage stellen | Geschäftskundenanfrage stellen | Derselbe Knopf oben im Titelbild heißt so, und das Formular, zu dem beide führen, ebenfalls („Geschäftskundenanfrage stellen.“) | `pages/BusinessCustomersPage.tsx:226` |

## F · Frage an André

| Nr | Stelle | Frage |
|---|---|---|
| L16-14 | Referenzen › Versicherer | Sind **nexible** und **wefox** noch aktuelle Partner? nexible (ERGO) hat das Kfz-Neugeschäft zur Wechselsaison 2022/23 eingestellt; wefox hat sich 2024 aus dem deutschen Markt zurückgezogen, sein Kfz-Bestand ging an einen Abwickler. Schadenfälle aus dem Bestand kann es weiter geben, als Referenz wirken beide Namen aber veraltet. |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L16-15 | Titelbild-Einleitung (30 Wörter), FAQ „Für welche Unternehmen …“ (30 Wörter) | Lang, aber Aufzählungen; so lassen. |
| L16-16 | Karte Leasingrückgabe | „nach den Sätzen des Leasinggebers“ steht wortgleich auf Leasing-, Privatkunden- und Aufbereitungsseite (dort „abrechnen nach den Sätzen“). Einheitlich, so lassen. |
| L16-17 | Karte „Versicherungen & Schadensteuerer“, Kachel „Instandsetzung statt Tauschen“ | Kundenwortlaut (4.12), bleibt. |

## Geprüft und ohne Befund

Titel und Beschreibung (59/154 Zeichen), H1, Stichwortleiste, Karten Autohäuser, Fuhrparks, Versicherungen,
Agenturen, Listenpunkte Leasingrückgabe, Leistungskarten Lackierung, Dellen, Hagel, Felgen, Autoglas, Aufbereitung,
Kacheln „Fester Ansprechpartner“, „Alles im eigenen Haus“, „Nachvollziehbare Kalkulation“, „Volldigitale Abwicklung“,
„Erfahrung mit Premiumfahrzeugen“, Referenztexte und Hersteller-Hinweis, Ablauf, FAQ 1–6, Abschluss, Bildbeschreibungen,
Vorlesetexte, JSON-LD.
