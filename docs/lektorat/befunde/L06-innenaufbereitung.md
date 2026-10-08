# L06 · Innenaufbereitung `/innenaufbereitung-leipzig`

> Auszug `output/lektorat/auszuege/innenaufbereitung-leipzig.md`, rund 725 Wörter: Titelbild, Paket und Preis, Umfang
> (sechs Schritte), Geruchsbehandlung (Ozon, Heißvernebelung, geteilt mit L03), Exklusivleistungen Alcantara, „Warum
> CarCare Center Leipzig“, FAQ (fünf Fragen), Ratgeber-Hinweis, Abschluss, zwei Bildbeschreibungen, JSON-LD.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis.

## K · Korrekturen

Keine. Die Seite ist sprachlich sauber; Preise, Einheiten und geteilte Texte waren schon mit L03 und L05 bereinigt
(„ab 199 €“ im Fließtext, „Smart Repair und Felgen“ in der Kachel „Full-Service“).

## S · Vorschläge

**Entscheidung des Users (08.10.): alle angenommen und umgesetzt.**

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L06-01 | Geruchsbehandlung, Überschrift | Geruchsbehandlung zur Innenaufbereitung dazu. | Geruchsbehandlung zur Innenaufbereitung buchen. | Der Überschrift fehlt das Verb; „… dazu.“ liest sich wie ein abgebrochener Satz | `pages/InnenaufbereitungPage.tsx:113` |
| L06-02 | FAQ, Frage 5 | Was ist bei starker Verschmutzung oder Tierhaaren? | Was gilt bei starker Verschmutzung oder Tierhaaren? | „Was ist bei …?“ ist gesprochene Sprache | `data/faqs.ts:214` |
| L06-03 | Abschluss, Überschrift | Innenraum stark genutzt, verschmutzt oder riecht? | Innenraum stark genutzt, verschmutzt oder geruchsbelastet? | „riecht“ bricht die Reihe der Partizipien („genutzt, verschmutzt“) | `pages/InnenaufbereitungPage.tsx:235` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L06-04 | Exklusivleistungen „Alcantara-Lenkrad und Schaum-/Tornador-Verfahren“ | Zwei Vorher-nachher-Bilder mit Bildunterschriften, aber ohne Leistungstext und ohne Preis. Text und Preis sind seit dem 28.09. als Frage an André offen (`docs/aufbereitung-zusatzleistungen/tasks/2026-09-28-zusatzleistungen-kacheln-optimierung-tasks.md`). Sprachlich sind die Bildunterschriften in Ordnung. |
| L06-05 | Ozonbehandlung | „eines der stärksten Desinfektionsmittel“, „zerstört zuverlässig“: wie L03-13. |

## Geprüft und ohne Befund

Titelbild, Stichwortleiste, Paket und Preis mit Aufpreis- und Preis-Hinweis, die sechs Umfangsschritte, Heißvernebelung
(Quelle seit L03-10 genannt), „Warum CarCare Center Leipzig“, FAQ 1–4, Ratgeber-Hinweis, Abschlusstext, zwei
Bildbeschreibungen (Alcantara vorher/nachher, Schaumreinigung), JSON-LD, Meta (Titel 60, Beschreibung 143 Zeichen).
