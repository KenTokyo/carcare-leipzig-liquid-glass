# L20–L23 · Wissensbereich: Übersicht, Was ist Autoaufbereitung?, Innenaufbereitung, Lackaufbereitung

> Erster von zwei Stopps im Wissensbereich (Plan: Übersicht + drei Artikel, dann vier). Auszüge
> `output/lektorat/auszuege/autoaufbereitung-wissen.md` und `autoaufbereitung-wissen_was-ist-autoaufbereitung.md`,
> `…_innenaufbereitung.md`, `…_lackaufbereitung.md` (je rund 420–480 Wörter). Ratgebertexte sind informativ
> (SEO-GEO 4.1); die Fachaussagen habe ich auf Richtigkeit gelesen und keine falsche gefunden. Alle Artikel teilen
> denselben Rahmen (`components/ArticleLayout.tsx`): Abschluss „Beratung und professionelle Umsetzung vor Ort“, „Im Artikel“,
> „Weiterlesen“, FAQ-Einleitung.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L20-01 | Übersicht, Überschrift über den Artikelkarten | Fünf Artikel für bessere Entscheidungen rund ums Fahrzeug. | Sieben Artikel für bessere Entscheidungen rund ums Fahrzeug. | Darunter stehen sieben Karten. Die Zahl kommt jetzt aus den Daten (`knowledgeArticles.length`), damit sie beim nächsten Artikel nicht wieder veraltet | `pages/KnowledgeHubPage.tsx` |
| L21-01 | Seitentitel „Was ist Autoaufbereitung?“ | Was ist Autoaufbereitung? Definition & Ablauf \| CarCare | Autoaufbereitung: Definition & Ablauf \| CarCare Center (54) | Textregel 1: „CarCare“ nie allein. Mit der Frage und vollem Namen wären es 62 Zeichen; die Frage steht weiter in H1 und `headline` | `data/knowledgeArticles.ts:38` |
| L22-01 | Seitentitel Innenaufbereitung | … \| CarCare Wissen | … \| CarCare Center (53) | Textregel 1 | `data/knowledgeArticles.ts:110` |
| L23-01 | Seitentitel Lackaufbereitung | … \| CarCare | … \| CarCare Center (59) | Textregel 1 | `data/knowledgeArticles.ts:182` |

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L20-02 | Übersicht, „Themenbereiche“, Einleitung | … oder springen Sie direkt zu Innenraum, Lack, Leasingrückgabe und Dellenentfernung. | … oder springen Sie direkt zu Innenraum, Lack, Leasingrückgabe oder Dellenentfernung. | Man springt zu einem davon | `pages/KnowledgeHubPage.tsx:29` |
| L20-03 | Bereich „Werterhalt & Leasing“ | Wissenswertes zu Leasingrückgabe, Aufbereitung vor dem Verkauf und sinnvoller Vorbereitung vor Bewertung oder Übergabe. | Wissenswertes zur Leasingrückgabe: typische Gebrauchsspuren, sinnvolle Vorbereitung und was vor der Bewertung zu tun ist. | Zur „Aufbereitung vor dem Verkauf“ gibt es keinen Artikel; der Bereich enthält nur den Leasing-Ratgeber | `data/knowledgeArticles.ts:552` |
| L20-04 | Bereich „Smart Repair & kleine Schäden“ | Einordnung kleiner Dellen, Lackspuren und reparaturnaher Themen, die vor Rückgabe oder Verkauf wichtig werden. | Wann sich kleine Dellen und Lackschäden punktuell reparieren lassen und warum der Farbton dabei entscheidend ist. | „reparaturnahe Themen“ sagt nichts; der Vorschlag nennt die drei Artikel darunter | `data/knowledgeArticles.ts:558` |
| L20-05 | Plakette am Artikel „Farbtongenauigkeit beim Lackieren“ (Karte und Artikelkopf) | Smart Repair | Lackierung | Der Artikel handelt vom Farbton jeder Lackierung, nicht von Smart Repair | `data/knowledgeArticles.ts:469` |
| L20-06 | Übersicht, FAQ „Setzen Sie die beschriebenen Leistungen in Leipzig um?“ | Ja. Wir unterstützen Sie bei Fahrzeugaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und ausgewählten Smart-Repair-Themen. | Ja. Wir übernehmen Fahrzeugaufbereitung, Lackpflege, die Vorbereitung der Leasingrückgabe und Smart Repair in unserem Betrieb in Leipzig. | Smart Repair bieten wir vollständig an (eigene Leistungsseite), nicht nur „ausgewählte Themen“; „unterstützen“ klingt, als machte es jemand anderes | `data/faqs.ts:166` |
| L21-02 | **G:** alle sieben Artikel, Abschluss „Beratung und professionelle Umsetzung vor Ort.“ | Wenn Sie eine fachliche Einschätzung für Ihr Fahrzeug wünschen, unterstützen wir Sie bei Autoaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und Smart Repair. | Sie möchten eine fachliche Einschätzung für Ihr Fahrzeug? Wir beraten Sie und übernehmen Autoaufbereitung, Lackpflege, die Vorbereitung der Leasingrückgabe und Smart Repair. | Bedingung und Hauptsatz passen nicht zusammen („wenn Sie eine Einschätzung wünschen, unterstützen wir Sie bei Autoaufbereitung“) | `components/ArticleLayout.tsx:105` |
| L21-03 | Was ist Autoaufbereitung?, „Wann lohnt sich das?“ | vor dem Verkauf, damit das Fahrzeug gepflegt und nachvollziehbar präsentiert wird | vor dem Verkauf, damit das Fahrzeug gepflegt und überzeugend präsentiert wird | „nachvollziehbar präsentiert“ passt nicht zu einem Fahrzeug | `data/knowledgeArticles.ts` |
| L21-04 | Was ist Autoaufbereitung?, Profi-Tipp 4 | Eine gute Aufbereitung dokumentiert nicht nur Glanz, sondern auch Materialschonung und saubere Übergabe. | Eine gute Aufbereitung erkennt man nicht nur am Glanz, sondern auch an schonend behandelten Materialien und einer sauberen Übergabe. | Eine Aufbereitung „dokumentiert“ keinen Glanz | `data/knowledgeArticles.ts` |
| L21-05 | Was ist Autoaufbereitung?, FAQ „Steigert Autoaufbereitung den Fahrzeugwert?“ | Sie kann den optischen Eindruck und die Verkaufschancen verbessern. Eine realistische Bewertung hängt aber immer von Fahrzeugzustand, Technik, Laufleistung und Markt ab. | Indirekt ja: Sie verbessert den Eindruck und damit die Verkaufschancen. Den Wert selbst bestimmen aber Zustand, Technik, Laufleistung und Markt. | Antwort zuerst (Textregel 2, Ausnahme 3) | `data/knowledgeArticles.ts` |
| L22-02 | Innenaufbereitung, Definition | Professionell wird vor allem dort gearbeitet, wo Alltagsschmutz lange sitzt: … | Gründlich gearbeitet wird vor allem dort, wo sich Alltagsschmutz festsetzt: … | „Professionell wird vor allem dort gearbeitet“ klingt, als arbeite man anderswo unprofessionell | `data/knowledgeArticles.ts` |
| L22-03 | Innenaufbereitung, Profi-Tipp 2 | … bevor sie tief in Fasern ziehen. | … bevor sie tief in die Fasern ziehen. | Artikel fehlt | `data/knowledgeArticles.ts` |
| L22-04 | Innenaufbereitung, Häufige Fehler | Leder nur einfetten, ohne es vorher sauber zu reinigen | Leder nur einfetten, ohne es vorher gründlich zu reinigen | „sauber reinigen“ sagt dasselbe zweimal | `data/knowledgeArticles.ts` |
| L23-02 | Lackaufbereitung, „Wann lohnt sich das?“ | bei hochwertigen Fahrzeugen, die optisch präzise wirken sollen | bei hochwertigen Fahrzeugen mit hohem Anspruch an die Optik | „optisch präzise wirken“ ist kein üblicher Ausdruck | `data/knowledgeArticles.ts` |
| L23-03 | Lackaufbereitung, Kostenfaktoren | Lackgröße, Fahrzeugform und Zugänglichkeit | Größe der Lackfläche, Fahrzeugform und Zugänglichkeit | „Lackgröße“ gibt es nicht | `data/knowledgeArticles.ts` |
| L23-04 | Lackaufbereitung, Kostenfaktoren | gewünschter Schutz durch Wachs, Polymer- oder Keramik-nahe Versiegelung | gewünschter Schutz durch Wachs, Polymer- oder Keramikversiegelung | „Keramik-nahe“ ist falsch gekoppelt (wenn, dann „keramiknahe“); wir bieten Keramikversiegelung als Leistung an | `data/knowledgeArticles.ts` |
| L23-05 | Lackaufbereitung, Häufige Fehler | Kanten, Sicken und Kunststoffteile nicht schützen | Kanten, Sicken und Kunststoffteile vor dem Polieren nicht abkleben | sagt, wie man sie schützt | `data/knowledgeArticles.ts` |
| L23-06 | Lackaufbereitung, FAQ „Kann eine Lackaufbereitung Kratzer entfernen?“ | Leichte Waschspuren und oberflächliche Defekte können oft deutlich reduziert werden. Tiefe Kratzer, die durch den Klarlack gehen, brauchen meist Lackreparatur. | Teilweise. Leichte Waschspuren und oberflächliche Kratzer lassen sich oft deutlich reduzieren. Tiefe Kratzer, die durch den Klarlack gehen, brauchen meist eine Lackreparatur. | Antwort zuerst; Artikel vor „Lackreparatur“ | `data/knowledgeArticles.ts` |
| L23-07 | Lackaufbereitung, Meta-Beschreibung | … Hochglanzpolitur und Versiegelung. Wann sie sich lohnt, was sie kostet und welche Fehler teuer werden. | … Politur und Versiegelung. Wann sie sich lohnt, wovon der Preis abhängt und welche Fehler teuer werden. (152 Zeichen) | Der Artikel nennt keinen Preis, nur Kostenfaktoren; Lackaufbereitung rechnen wir nach Aufwand ab | `data/knowledgeArticles.ts:183` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L20-07 | alle Artikel | Kein „zuletzt aktualisiert“ (SEO-GEO 4.3), weder sichtbar noch als `dateModified` im JSON-LD (`Article` ohne Datum; SEO-GEO 5.3 nennt `datePublished`/`dateModified`). Für L30 vorgemerkt. |
| L22-05 | Innenaufbereitung, Titel „Ablauf und Kosten“ | Der Artikel nennt Kostenfaktoren, keinen Preis. Die Pakete mit Preisen stehen auf der Leistungsseite; ein Satz mit Verweis wäre für KI-Antworten stark. Vorschlag für später, nicht Lektorat. |
| L21-06 | Listen „Wann lohnt sich das?“ und „Häufige Fehler“ | beginnen klein (Satzfortsetzung), „Kostenfaktoren“ und „Profi-Tipps“ groß. Beides zulässig, je Liste einheitlich. So lassen. |
| L23-08 | Lackaufbereitung, Profi-Tipp 1 | „nicht zum Wunsch nach maximalem Abtrag“: gemeint ist der Wunsch, möglichst jeden Kratzer wegzupolieren. Verständlich, so lassen. |

## Geprüft und ohne Befund

Übersicht: Titel, Beschreibung, H1, Einleitung, Bereich „Grundlagen & Pflege“, Kartentexte, Hinweise zu Aufbereitung und
Unfall, FAQ 1–2, Kontaktabschluss, JSON-LD. Artikel: Einleitungen, Definitionen, Abläufe, übrige Listenpunkte, übrige FAQ,
Beschreibungen, Breadcrumb, `Article`-Auszeichnung.
