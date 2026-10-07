# Stilblatt CarCare Center

> **Verbindliche Schreibweisen für alle sichtbaren Texte** (Seiten, Formulare, Titel, Beschreibungen, Bildtexte).
> Entschieden vom User am **2026-10-06** im Rahmen des Lektorats (`docs/lektorat/tasks/2026-10-06-lektorat-seitenweise-tasks.md`).
> Ergänzt die Textregeln 1–6 in `CLAUDE.md`, ersetzt sie nicht.
>
> Grundlage: Duden, 29. Auflage (2024), amtliches Regelwerk 2024 (verbindlich seit 01.07.2024).
> Die mechanische Vorprüfung (`npm run lektorat`) meldet Abweichungen von diesem Blatt im ausgelieferten Text.

---

## Entscheidungen vom 2026-10-06

| # | Thema | So schreiben wir | Nicht | Regel / Grund | Umgesetzt |
|---|---|---|---|---|---|
| 1 | Spot-Repair | **Spot-Repair**, in Zusammensetzungen „Spot-Repair-Verfahren“ | „Spot Repair“, „Smart/Spot Repair“ | Zwei Substantive aus dem Englischen: Bindestrich oder Zusammenschreibung (§ 37, § 45 Regelwerk) | 06.10.: 12 Stellen im Wissensartikel, 4 USP-Karten („Smart Repair, Spot-Repair und …“), Zeitstrahl 2013 |
| 2 | Smart Repair | **Smart Repair** (getrennt); in Zusammensetzungen durchgekoppelt: „Smart-Repair-Arbeiten“, „Smart-Repair-Bereich“ | „Smart-Repair“ allein, „Smart Repair-Verfahren“ | Adjektiv + Substantiv: Getrenntschreibung zulässig; Zusammensetzung mit deutschem Grundwort wird durchgekoppelt (§ 44) | Bestand war richtig, keine Änderung |
| 3 | Pkw, Lkw | **Pkw**, **Lkw** | „PKW“, „LKW“ | Duden-Empfehlung (Großschreibung als Variante zulässig, wir legen uns fest) | 06.10.: 6 Stellen (Autoglas, WINTEC-Text auf 5 Seiten und in der FAQ) |
| 4 | Ersatzauto | **Ersatzwagen** | „Werkstattersatzfahrzeug“, „Werkstatt-Ersatzfahrzeug“, „Ersatzfahrzeug“ im sichtbaren Text; „Mietwagen“ nur für echte Mietwagen | ein Begriff für eine Sache; Artikel und Pronomen mitziehen („einen Ersatzwagen … damit wir ihn einplanen“) | 06.10.: 23 Stellen; Suchwörter „Ersatzfahrzeug“ und „Werkstattersatzfahrzeug“ führen über `SYNONYME` (`lib/suche.ts`) weiter zum Ersatzwagen |
| 5 | Zahl und Einheit | **geschütztes Leerzeichen** (U+00A0) zwischen Zahl und Einheit: m², €, %, km, Uhr, seit 07.10. auch mm, cm, kg; dazu in „z. B.“ | normales Leerzeichen (Umbruch „3.500 / m²“) | Duden-Empfehlung: Zahl und Einheit nicht trennen | 06.10.: 97 Einheiten und 5 × „z. B.“ in 34 Dateien, Kommentare ausgenommen; 07.10.: 11 × „1 mm“ (Felgen) |
| 6 | Uhrzeiten | **„7–18 Uhr“**, „Mo–Fr“; Minuten mit Doppelpunkt („7:30 Uhr“) | „08:00–17:00 Uhr“ im Fließtext | DIN-Form wirkt im Fließtext steif; Bis-Strich ohne Leerzeichen | Bestand, über `data/oeffnungszeiten.ts` |
| 7 | Telefonnummer | **„0341 - 261 77 90“**, Link `tel:+493412617790` | andere Gliederungen | NAP-Schreibweise (`SEO-GEO-STANDARDS.md`), Textregel 6 erlaubt den Strich; DIN 5008 wäre „0341 2617790“ | Bestand |
| 8 | Berufsbezeichnungen in Stellen | **einheitlich** mit „(m/w/d)“ im Titel, z. B. „Fahrzeuglackierer (m/w/d)“ | „Fahrzeuglackierer/in“ neben „Fahrzeuglackierer“ | AGG: geschlechtsneutrale Ausschreibung; eine Form für alle Stellen | **wird mit L18 (Karriere) umgesetzt**, dort auch Stellenfenster, Formularauswahl und `JobPosting` |

## Feste Regeln (aus Duden und Projekt, keine Entscheidung nötig)

| Thema | So | Nicht |
|---|---|---|
| Anführungszeichen | „…“ (U+201E, U+201C), innen ‚…‘ | "…", “…”, »…« |
| Apostroph | ’ (U+2019) | ' |
| Auslassungspunkte | … (ein Zeichen) | ... |
| Bis-Strich | – ohne Leerzeichen: „1–2 Tage“, „8–17 Uhr“ | „1 - 2 Tage“ |
| Gedankenstrich | **keiner** (Textregel 6) | „ – “ |
| Komma bei Infinitivgruppe mit „zu“ | **immer** („Wir empfehlen, den Termin früh zu vereinbaren.“) | ohne Komma (seit Regelwerk 2024 nicht mehr frei) |
| Abkürzungen im Fließtext | ausschreiben: „inklusive“, „zum Beispiel“ oder „z. B.“ | „inkl.“ im Fließtext (in Preis-Hinweisen und Tabellen zulässig) |
| Kfz, E-Mail | „Kfz“, „E-Mail“ | „KFZ“, „Email“, „eMail“ |
| Markennamen | wie der Inhaber: Glasurit, WINTEC, riparo, PDR.cloud, Swissvax, Audatex | eigene Schreibweisen |
| Betriebsfläche, Gründung | „über 3.500 m²“, „seit 1998“ (Textregeln 3 und 4) | – |

## Entscheidungen vom 2026-10-07 (Lektorat L01)

| # | Thema | So schreiben wir | Nicht | Grund | Umgesetzt |
|---|---|---|---|---|---|
| 9 | Preisformat | **Preiskacheln, Preistabellen und Preis-Hinweise mit Cent** („ab 169,00 €“), **Fließtext, FAQ-Antworten, Titel und Beschreibungen ohne** („ab 169 €“) | „169,00 €“ im Fließtext | ein Format je Textsorte; ganze Euro lesen sich im Satz leichter, in der Kachel zeigt der Cent-Betrag den genauen Preis | 07.10.: Startseite (Privatkunden-Vorteil); übrige Seiten mit ihrem Lektorat |
| 10 | FAQ-Fragen | in **Kundensicht** erlaubt, auch mit Firmenname als Subjekt („Arbeitet das CarCare Center auch für Autohäuser …?“) | – | Die Frage ist Kundenstimme, nicht Selbstbeschreibung; der Name in der Frage hilft KI-Suchmaschinen (SEO-GEO 4.3). Antworten bleiben in der Wir-Form und beginnen, wo möglich, mit „Ja.“/„Nein.“ | 07.10.: Textregel 2, Ausnahme 3 in `CLAUDE.md` |
