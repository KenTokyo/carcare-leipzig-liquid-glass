# L00 · Globale Bausteine

> Navigation, Mega-Menü, Mobilmenü, Fußzeile, Aktions-Pillen, mobile Aktionsleiste, Anfrage-Dialog, Formulare
> (Termin, Geschäftskunden, Bewerbung, Schaden), Suchdialog, 404-Seite, Meldungen nach dem Absenden.
> Grundlage: Auszug `output/lektorat/auszuege/00-global.md` (Build vom 06.10.2026, 01:29), dazu der Quelltext der
> Komponenten, deren Text erst nach einer Handlung erscheint. Rund 980 Wörter.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag, wartet auf Entscheidung · H = Hinweis, keine Änderung.
> Plan und Regeln: `docs/lektorat/tasks/2026-10-06-lektorat-seitenweise-tasks.md`, Stilblatt: `docs/lektorat/stilblatt.md`.

## K · Korrekturen (umgesetzt am 06.10.)

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L00-01 | Öffnungszeiten in Fußzeile, Kontaktblock aller Seiten, Kontaktseite und Formularen | „Mo – Fr: 07:00 – 18:00“ (Fußzeile ohne „Uhr“) | „Mo–Fr: 7–18 Uhr“ | Bis-Strich ohne Leerzeichen; Stilblatt 6; gleiche Form wie die Ansage am Anrufknopf („Mo–Fr 7–18 Uhr“) | `data/oeffnungszeiten.ts` (`OEFFNUNG_ANZEIGE`), `components/Footer.tsx:226` |
| L00-02 | Suche ohne Treffer | Keine Treffer für „xqzvw". | Keine Treffer für „xqzvw“. | deutsches schließendes Anführungszeichen | `components/SuchDialog.tsx:344` |
| L00-03 | Bewerbung, Datei im falschen Format | „lebenslauf.pages" hat ein anderes Format. | „lebenslauf.pages“ hat ein anderes Format. | dto. | `components/formulare/AnhangFeld.tsx:39` |
| L00-04 | Platzhalter in allen Formularen | „0341 - ...“, „Sonderwünsche, Fahrzeugzustand ...“, „Umfang, Frequenz, Sonderwünsche ...“, „… ab wann Sie können ...“ | jeweils „…“ | Auslassungszeichen statt drei Punkten | `TerminFelder.tsx:85/289`, `GeschaeftskundenFelder.tsx:32/48`, `BewerbungFelder.tsx:30/112`, `data/schadenFelder.ts:52` |
| L00-05 | Geschäftskundenformular | „Autohaus / Fuhrpark / Agentur“, „Versicherung / Versicherungsagentur“ | „Autohaus/Fuhrpark/Agentur“, „Versicherung/Versicherungsagentur“ | Schrägstrich zwischen einzelnen Wörtern ohne Leerzeichen (bei Wortgruppen wie „Rahmenvertrag / laufende Zusammenarbeit“ bleibt es) | `GeschaeftskundenFelder.tsx:22`, `data/anfrageSchema.ts:8` |
| L00-06 | Mega-Menü „Geschäftskunden“ | Fuhrpark & Autohaus-Lösungen | Fuhrpark- & Autohaus-Lösungen | Ergänzungsstrich: gemeint sind Fuhrpark-Lösungen und Autohaus-Lösungen | `data/services.ts:400` |
| L00-07 | Suchdialog, Tastenhinweis | Strg K öffnet die Suche überall | Strg + K öffnet die Suche überall | Tastenkombination mit Pluszeichen | `components/SuchDialog.tsx:412` |

## S · Vorschläge

**Entscheidung des Users (06.10.):** angenommen und umgesetzt: 08, 12, 13, 14, 16, 17, 18, 19. **11 bleibt** („Jobangebote“).
**09 und 10 offen:** Der User will vorher wissen, warum die Fußzeile so heißt (Antwort unten). **15 offen:** „nur Vornamen“,
Rückfrage zur Umsetzung läuft.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L00-08 | Fußzeile, Öffnungszeiten | Sa: n. Vereinbarung | Sa: nach Vereinbarung | „n.“ ist keine übliche Abkürzung; überall sonst steht es ausgeschrieben. Die Spalte bricht dann um, das ist vertretbar | `data/oeffnungszeiten.ts` (`samstagKurz`), `Footer.tsx:227` |
| L00-09 | Fußzeile „Bereiche“ | Autoaufbereitung Wissen | Wissen | Leerzeichen mitten in der Zusammensetzung (richtig wäre „Autoaufbereitungswissen“); die Navigation sagt „Wissen“ | `components/Footer.tsx:240` |
| L00-10 | Fußzeile „Sitemap“ | Wissensbereich | Wissen | dieselbe Seite heißt in Navigation, „Bereiche“ und „Sitemap“ dreimal anders | `components/Footer.tsx:255` |
| L00-11 | Fußzeile „Bereiche“ | Jobangebote | Karriere | wie Navigation und Seitentitel | `components/Footer.tsx:241` |
| L00-12 | Fußzeile „Anfragen“ | „Geschäftskunden“ (→ Formular), „B2B-Bereich“ (→ Geschäftskundenseite), „Zielgruppen“ (→ Startseite) | „Als Geschäftskunde anfragen“; „B2B-Bereich“ und „Zielgruppen“ streichen | „Geschäftskunden“ führt hier ins Formular, in der Sitemap auf die Seite; „B2B-Bereich“ doppelt den Sitemap-Link, „Zielgruppen“ ist ohne Zusammenhang unklar. **Mit 5.21 (Fußzeile verkleinern) bündeln** | `components/Footer.tsx:268–270` |
| L00-13 | Mega-Menü „Kontakt“ › Termin anfragen | Aufbereitung & Reparatur buchen | Aufbereitung & Pflege anfragen | „buchen“ klingt verbindlich, es ist eine Anfrage; Reparaturen laufen über „Schaden melden“. Der Dialog nennt die Option schon „Aufbereitung & Pflege“ | `data/navigation.ts:128` |
| L00-14 | Terminformular, Hinweis unter den Kontaktfeldern | Telefon oder E-Mail genügt. Eins davon brauchen wir, um uns bei Ihnen zu melden. | Telefon oder E-Mail genügt. Eine der beiden Angaben brauchen wir, um uns bei Ihnen zu melden. | „Eins davon“ ist umgangssprachlich | `components/formulare/TerminFelder.tsx:104` |
| L00-15 | Platzhalter „Name“ | „Max Mustermann“ (Termin, Schaden) neben „Vor- und Nachname“ (Bewerbung, Geschäftskunden) | überall „Vor- und Nachname“ | ein Muster für dasselbe Feld | `TerminFelder.tsx:67`, `data/schadenFelder.ts:51` |
| L00-16 | Bewerbung, Platzhalter „Nachricht“ | Ein paar Sätze zu Ihrer Erfahrung und dazu, ab wann Sie können … | Ein paar Sätze zu Ihrer Erfahrung und dazu, ab wann Sie anfangen können … | „ab wann Sie können“ lässt das Verb weg, umgangssprachlich | `components/formulare/BewerbungFelder.tsx:112` |
| L00-17 | Fehlermeldung ohne Verbindung | … oder rufen Sie uns an unter 0341 - 261 77 90. | … oder rufen Sie uns unter 0341 - 261 77 90 an. | Satzklammer schließen; die Ausklammerung ist gesprochene Sprache | `components/RequestForm.tsx:226` |
| L00-18 | 404-Seite | Die gewünschte Adresse existiert aktuell nicht. | Diese Adresse gibt es auf unserer Website nicht oder nicht mehr. | „aktuell“ klingt nach vorübergehend; der Besucher will wissen, dass die Seite fehlt | `pages/NotFoundPage.tsx:10` |
| L00-19 | Mobile Aktionsleiste, Fenster „Route“ | ROUTE ZU AN DEN TIERKLINIKEN 42, 04103 LEIPZIG | Route zur Werkstatt: An den Tierkliniken 42, 04103 Leipzig | „zu An den …“ stolpert; der Doppelpunkt trennt Ziel und Adresse | `components/MobileStickyCTA.tsx:98` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L00-20 | Fußzeile: „Diese Website nutzt keine Analyse- oder Tracking-Dienste und setzt keine Cookies.“ | Stimmt heute. Kommt Matomo (6.20, zurückgestellt), muss der Satz mit der Datenschutzerklärung zusammen geändert werden. |
| L00-21 | Formulare: „Anfragen nehmen wir derzeit telefonisch oder per E-Mail entgegen. Der Online-Versand wird gerade eingerichtet.“ | Erscheint nur, wenn `/api/anfrage` keinen Versand meldet, also im lokalen Build. Live (Vercel, Versand aktiv) ist er nicht zu sehen. |
| L00-22 | Mega-Menü, dritte Ebene (einzelne Leistungen je Gruppe) | Klappt per Mauszeiger ohne `aria-expanded` auf und fehlt deshalb im Auszug. Die Texte kommen aus `data/services.ts` und werden auf den Leistungsseiten (L04–L14) mitgelesen. |

## Geprüft und ohne Befund

Navigation (Leistungen, Wissen, Über uns, Karriere, Kontakt), Vorlesetexte (`aria-label`) der Navigation, der Suche, der
Aktions-Pillen und der Aktionsleiste, Anfrage-Dialog „Worum geht es?“ mit seinen drei Optionen, Formular-Einleitungen und
Pflichtangaben, Erfolgsmeldungen („Anfrage übermittelt.“, Vorgangsnummer, Unterlagen nachreichen), Anhang-Hinweise,
Suchdialog „Häufig gesucht“, EU-Förderhinweis, Copyright und verantwortliche Stelle in der Fußzeile.

## Warum heißt es in der Fußzeile „Autoaufbereitung Wissen“ und „Wissensbereich“? (zu 09/10)

- Beide Bezeichnungen kamen am **03.06.2026** mit dem großen Redesign-Commit `a701ce9` („Apply CarCare site redesign and
  branding updates“) in die Fußzeile. Weder der Commit noch eine Planung unter `docs/` nennt einen Grund.
- „Autoaufbereitung Wissen“ folgt erkennbar der Adresse `/autoaufbereitung-wissen`; in der Planung vom 12.07. heißt
  der Startseitenblock ebenso „Autoaufbereitung-Wissen (Teaser)“. Vermutlich sollte das Suchwort „Autoaufbereitung“
  im Linktext stehen. Die Navigation (seit 17.05., `86c8cd6`) sagt dagegen schlicht „Wissen“.
- „Wissensbereich“ ist die Beschreibung, mit der sich die Seite selbst nennt (Einleitung der Wissensseite, FAQ in
  `data/faqs.ts`). Ihr Seitentitel lautet „Autoaufbereitung: Wissen & Ratgeber“.
- Für Suchmaschinen bringt ein Fußzeilenlink wenig: Er steht auf jeder Seite gleich und wird entsprechend schwach
  gewichtet. Der Leerzeichenfehler in „Autoaufbereitung Wissen“ bleibt in jedem Fall ein Fehler.

