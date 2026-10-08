# L18 · Karriere `/karriere`

> Auszug `output/lektorat/auszuege/karriere.md`, rund 970 Wörter: Titelbild mit Stellen-Banner, Berufsbilder (vier Karten)
> und Ausbildung (drei Karten), Arbeitgeberversprechen, Arbeitsplätze mit Videos, Mitarbeiterstimmen, Bewerbungsablauf,
> Bewerbungsformular, FAQ, Abschluss, Stellen-Pop-up, sechs `JobPosting`. Stellentitel kommen alle aus `data/jobs.ts`.
> **Mitarbeiterstimmen sind Zitate** und bleiben unverändert. Stellenanzeigen zusätzlich auf AGG-neutrale Fassung geprüft.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis.

## K · Korrekturen (umgesetzt am 08.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L18-01 | Alle Stellentitel: sieben Karten, Banner, Pop-up, Formularauswahl, sechs `JobPosting`, Vorlesetexte der Karten | Kfz-Aufbereiter · Fahrzeuglackierer/in · Bürokaufmann/-frau … (gemischt) | Kfz-Aufbereiter (m/w/d) · Fahrzeuglackierer (m/w/d) · Bürokaufmann (m/w/d) …; im Banner einmal „(jeweils m/w/d)“ je Zeile | **Stilblatt 8** (AGG, eine Form für alle Stellen). Ein Helfer `stellenTitel` in `data/jobs.ts`, `title` bleibt die reine Berufsbezeichnung; Fließtext (FAQ, Meta, Über uns) ohne Zusatz | `data/jobs.ts`, `JobCards`, `JobBanner`, `JobPopup`, `BewerbungFelder`, `seo/pageSchemas.ts` |
| L18-02 | Stichwortleiste | Karosserie Jobs Leipzig | Karosserie-Jobs Leipzig | Zusammensetzung: zusammen oder mit Bindestrich, nie getrennt | `pages/CareerPage.tsx:62` |
| L18-03 | Formularhinweis „Bereich“, zwei Meldungen beim Anhängen (nur nach Handlung sichtbar) | „Anderer Bereich / Initiativbewerbung" · „datei.pdf" passt nicht … | … Initiativbewerbung“ · „datei.pdf“ passt nicht … | schließendes deutsches Anführungszeichen; die Anhang-Meldungen fehlten im Auszug von L00 (Vorlagen-Strings) | `BewerbungFelder.tsx:80`, `AnhangFeld.tsx:44/53` |
| L18-04 | Vorlesetext des Arbeitsplatz-Videos | Zeigt den Betrieb, in dem gearbeitet wird, nicht nur eine Liste von Vorteilen. | Ausschnitt aus dem Betriebsrundgang: Lackierkabine, Teilevorbereitung, Politur, Hebebühne und Reifenraum. | Ein Vorlesetext beschreibt, was zu sehen ist; der alte war eine Notiz zum Zweck | `data/videos.ts:83` |
| L18-05 | Anhangfeld: „zusammen höchstens 3 MB“, Größenangaben | 3 MB (normales Leerzeichen) | 3 MB (geschützt), ebenso KB | Stilblatt 5 um MB und KB erweitert, Vorprüfung mit | `AnhangFeld.tsx:20/21`, `docs/lektorat/stilblatt.md` |
| L18-06 | Vorlesetext aller Klappkarten (`aria-label`) | enthielt die weiche Trennstelle des Anzeigetitels | ohne Trennstelle | vorsorglich: eine Trennstelle hat im Vorlesetext nichts zu suchen | `ExpandingCardAccordion.tsx:217` |

**Werkzeug:** Der Auszug machte aus einer weichen Trennstelle ein Leerzeichen („Fahrzeug lackiererin“ bei den
Mitarbeiterstimmen, „Fahrzeug lackierer/in“ in den Vorlesetexten). Auf der Seite stand das nie so; behoben in
`scripts/lib/lektorat-dom.mjs`. Durch die MB-Regel meldet die Vorprüfung „3 MB“ jetzt auch in der Datenschutzerklärung
(kommt mit L29, Rechtstext).

**Gemessen** (Build 08.10. 18:15): Alle Kartentitel passen. Der längste, „Karosserie- und Fahrzeugbaumechaniker (m/w/d)“,
wird von `GanzwortTitel` leicht kleiner gesetzt (Desktop 22,6 statt 24 px, mobil 18,7 statt 20 px), dreizeilig, ohne
Überlauf. `meta` 0/29.

## S · Vorschläge

**Entscheidung des Users (08.10.):** 08–14 umgesetzt. **07 bleibt** „Bürokaufmann (m/w/d)“ („auch wenn es das schon
lange nicht mehr so gibt, bitte stehen lassen, aber mit m/w/d ergänzen“); als Hinweis **R20** in
`docs/backlog/nice-to-have.md`. Die FAQ-Antwort aus 12 nennt deshalb „zum Bürokaufmann“.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L18-07 | Ausbildung: Kartentitel, Banner, Pop-up, Formular, `JobPosting`, Einleitung „Ausbildung im Betrieb“ | Bürokaufmann (m/w/d) · „… zum Bürokaufmann oder zur Bürokauffrau …“ | **Kaufmann für Büromanagement (m/w/d)** · „… zum Kaufmann oder zur Kauffrau für Büromanagement (früher Bürokaufmann) …“; „Bürokaufmann“ als Suchwort in `SYNONYME` | Den Ausbildungsberuf „Bürokaufmann/-frau“ gibt es seit 2014 nicht mehr; er heißt „Kaufmann/Kauffrau für Büromanagement“, auch nach der Neuordnung zum 01.08.2025. Bewerber, Arbeitsagentur und IHK suchen unter diesem Namen | `data/jobs.ts:215`, `components/JobCards.tsx:133`, `lib/suche.ts` |
| L18-08 | Banner unter den Stellen | Bewerbung mit Name, Kontakt und ein paar Sätzen … | Bewerbung mit Namen, Kontakt und ein paar Sätzen … | Dativ: „mit Namen“ | `components/JobBanner.tsx:56` |
| L18-09 | „Vier Gewerke unter einem Dach“, Einleitung | Ausgegraute Karten gehören zum Betrieb, werden aber gerade nicht neu besetzt. Eine Initiativbewerbung ist dort trotzdem willkommen. | Ausgegraute Karten zeigen Berufe, die es im Betrieb gibt, die wir aber gerade nicht neu besetzen. Eine Initiativbewerbung ist trotzdem willkommen. | Besetzt wird eine Stelle, keine Karte; „dort“ verweist auf nichts | `components/JobCards.tsx:100` |
| L18-10 | Karte Karosserie- und Fahrzeugbaumechaniker (auch `JobPosting`) | Instandsetzung nach Unfallschäden, Karosseriearbeiten und Richtbank. | Instandsetzung nach Unfallschäden, Karosseriearbeiten und Arbeit an der Richtbank. | Die Richtbank ist ein Gerät, keine Tätigkeit | `data/jobs.ts:120` |
| L18-11 | **Bewerbungsweg:** Ablauf Schritt 1, FAQ „Wie starte ich die Bewerbung?“, Knöpfe „Initiativ bewerben“ (Titelbild) und „Initiativbewerbung starten“ (Abschluss) | „… über die Kontaktseite senden“ · „Am einfachsten über die Kontaktseite oder telefonisch.“ · beide Knöpfe → `/kontakt` | Schritt 1: „Kurze Bewerbung über das Formular auf dieser Seite, per E-Mail oder telefonisch.“ · FAQ: „Am einfachsten über das Bewerbungsformular auf dieser Seite, per E-Mail an bewerbung@carcare-center.de oder telefonisch unter 0341 - 261 77 90. Wir melden uns anschließend persönlich.“ · beide Knöpfe → Formular `/karriere#bewerbung` | Die Kontaktseite hat keine Bewerbungsauswahl; das Formular hier hat „Anderer Bereich / Initiativbewerbung“, und Karten, Banner und Pop-up führen schon dorthin | `pages/CareerPage.tsx:44/60/127`, `data/faqs.ts:159` |
| L18-12 | FAQ „Welche Stellen sind aktuell ausgeschrieben?“ | Aktuell suchen wir Kfz-Aufbereiter, Fahrzeuglackierer sowie Karosserie- und Fahrzeugbaumechaniker. Weitere Berufsbilder wie den Serviceberater besetzen wir zurzeit nicht neu. Eine Initiativbewerbung ist trotzdem willkommen. | Aktuell suchen wir Kfz-Aufbereiter, Fahrzeuglackierer sowie Karosserie- und Fahrzeugbaumechaniker (jeweils m/w/d). Ausbildungsplätze bieten wir zum Fahrzeuglackierer, zum Karosserie- und Fahrzeugbaumechaniker und zum Kaufmann für Büromanagement. Die Stelle als Serviceberater besetzen wir zurzeit nicht neu, eine Initiativbewerbung ist trotzdem willkommen. | Die drei Ausbildungsplätze fehlten in der Antwort; man besetzt Stellen, keine „Berufsbilder“ | `data/faqs.ts:158` |
| L18-13 | Kachel „Professionelles Umfeld“ | Arbeiten mit Fahrzeugen, Qualität und klaren Abläufen. | Arbeit an hochwertigen Fahrzeugen, mit klaren Abläufen. | Man arbeitet nicht „mit Qualität“ wie mit einem Werkzeug | `pages/CareerPage.tsx:14` |
| L18-14 | Ablauf Schritt 4 | Wenn es passt, beginnt der Einstieg in einem professionellen Umfeld. | Wenn es passt, starten Sie in Ihrem neuen Team. | Dritte Nennung von „professionell“ auf der Seite; der Satz sagt sonst nichts | `pages/CareerPage.tsx:47` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L18-15 | Meta-Beschreibung, FAQ, Über uns | Nennen die Berufe ohne „(m/w/d)“. Stilblatt 8 gilt für Stellentitel; in der Beschreibung fehlt außerdem der Platz (148 von 160 Zeichen). |
| L18-16 | FAQ „Welche Stellen …?“ | Steht als fester Text in `data/faqs.ts`, die Karten kommen aus `data/jobs.ts`. Wechselt eine Stelle, muss die Antwort von Hand mit. Als Verbesserung vorgemerkt (Antwort aus den Daten erzeugen). |
| L18-17 | Banner, Formular, Ablauf | Viermal derselbe Hinweis „Name, Kontakt und ein paar Sätze, Unterlagen freiwillig“. Gewollt niedrige Schwelle; so lassen. |
| L18-18 | Mitarbeiterstimmen | Zitate, unverändert. „Fahrzeuglackiererin“ (Josie) ist die Berufsangabe einer Person, keine Stelle. |

## Geprüft und ohne Befund

Titel und Beschreibung (54/148 Zeichen), H1, Einleitung, Kicker „3 offene Stellen · 3 Ausbildungsplätze“, Kartentexte
und Anforderungen (außer L18-10), Serviceberater-Hinweis, Ausbildungstexte, Arbeitgeberversprechen (außer L18-13),
Arbeitsplätze und Videos, Bewerbungsformular mit Feldern, Platzhaltern und Hinweisen, Versandhinweis, FAQ 1, Abschluss,
Bildbeschreibungen der Stimmen, `JobPosting`-Beschreibungen.
