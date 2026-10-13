# L28–L29 · Impressum `/impressum` und Datenschutz `/datenschutz`

> Auszüge `output/lektorat/auszuege/impressum.md` (303 Wörter) und `datenschutz.md` (1.485 Wörter), Build vom
> 14.10.2026, 00:00. **Nur Korrektorat** (Plan Phase 10): Rechtstexte werden nicht umformuliert. Jede Änderung steht
> hier mit Vorher/Nachher, weil sie mit in die anwaltliche Prüfung geht (R6). Sachangaben (Anschriften, Speicherwerte,
> Links) sind gegen Code, ausgeliefertes HTML und Quellen geprüft, Ergebnis unter H.
>
> **Arten:** K = Korrektur, umgesetzt · S = Vorschlag · H = Hinweis (keine Änderung) · **G** = geteilte Quelle.

## K · Korrekturen (umgesetzt am 14.10.)

Beide ändern keinen Inhalt; das Stand-Datum blieb dafür bei 04.10.2026 (mit den S unten dann auf 14.10.2026 gesetzt).

| Nr | Stelle | Vorher | Nachher | Regel | Quelle |
|---|---|---|---|---|---|
| L28-01 | Impressum › Registereintrag, Umsatzsteuer-ID | gemäß § 27 a Umsatzsteuergesetz | gemäß § 27a Umsatzsteuergesetz | amtliche Bezeichnung der Vorschrift („§ 27a UStG“), Buchstabe ohne Leerzeichen an der Zahl | `pages/ImpressumPage.tsx:116` |
| L29-01 | Datenschutz › Bewerbungen | zusammen höchstens 3 MB (normales Leerzeichen) | zusammen höchstens 3 MB (geschützt) | Stilblatt 5; das Formular selbst schreibt die Grenze schon geschützt (`AnhangFeld.tsx:20`) | `pages/DatenschutzPage.tsx:211` |

## S · Vorschläge

**Entscheidung des Users (14.10.): alle angenommen und umgesetzt.** Stand-Datum der Erklärung auf 14.10.2026 gesetzt,
weil 03, 05 und 06 den Wortlaut ändern. L29-07 wie vorgeschlagen nur nach „§“ und „Art.“ (Impressum 3, Datenschutz 26
Stellen; Kommentare im Code unberührt), „Abs.“, „Nr.“, „lit.“ bleiben. Daraus Stilblatt-Zeile 11 und eine neue Regel der
Vorprüfung, die ungeschützte Normzitate auf allen Routen meldet (Lauf 14.10.: 0 auf 30 Auszügen). Mit L28-02 entfällt
der Sprung vom KI-Verzeichnis direkt zum KI-Abschnitt der Erklärung (`/datenschutz#ki`); der Abschnitt „Datenschutz“
darunter verlinkt die ganze Erklärung.

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L28-02 | Impressum › KI-Verzeichnis, Schlusssatz | … und keine Vorher-Nachher-Ergebnisse. Wie wir dabei mit personenbezogenen Daten umgehen, steht in unserer Datenschutzerklärung. | … und keine Vorher-Nachher-Ergebnisse. *(Satz gestrichen)* | Der Abschnitt „Datenschutz“ direkt darunter sagt fast wortgleich dasselbe („Wie wir mit personenbezogenen Daten umgehen, steht in unserer Datenschutzerklärung.“) | `pages/ImpressumPage.tsx:194` |
| L28-03 | Impressum › KI-Verzeichnis, „KI-generiert“ | Ein Foto, in das wir mit KI Gegenstände oder Personen hineingeneriert haben. | Ein Foto, dem wir mit KI erzeugte Gegenstände oder Personen hinzugefügt haben. | „hineingenerieren“ steht in keinem Wörterbuch; der Satz ist eine Kennzeichnungsdefinition (Art. 50 KI-VO) und sollte ohne Kunstwort auskommen. Wortlaut stammt aus deiner Definition vom 04.10., deshalb nur Vorschlag | `data/bildherkunft.ts:50` |
| L29-02 | Datenschutz › Server-Logdateien | Browsertyp und Version | Browsertyp und -version | Ergänzungsstrich: gemeint ist die Browserversion, nicht irgendeine Version | `pages/DatenschutzPage.tsx:119` |
| L29-03 | Datenschutz › Startanimation | … legen wir im Sitzungsspeicher Ihres Browsers (sessionStorage) einen Eintrag mit dem Wert „bereits gesehen“ ab. | … legen wir im Sitzungsspeicher Ihres Browsers (sessionStorage) einen Eintrag ab, der nur vermerkt, dass die Animation schon gelaufen ist. | **Sachlich ungenau:** Der Code speichert unter `cc-preloader-v1` den Wert `1`, nicht „bereits gesehen“. Die Bedeutung stimmt, der genannte Wert nicht; in einem Rechtstext soll beides stimmen | `pages/DatenschutzPage.tsx:133`, `hooks/usePreloader.ts:75` |
| L29-04 | Datenschutz › Schriften, Bilder und Videos | Schriftarten, Bilder und Videos laden vom selben Server wie die Seite. | Schriftarten, Bilder und Videos werden vom selben Server geladen wie die Seite. | „laden“ ohne Objekt ist Technikjargon (Duden: transitiv); „Auf einen Blick“ sagt „kommen vom selben Server“ | `pages/DatenschutzPage.tsx:141` |
| L29-05 | Datenschutz › Anfrageformulare (44 Wörter, Vorprüfung H) | … einen Wunschtermin und Ihre Nachricht, bei Geschäftskunden Firma, Ansprechpartner, … | … einen Wunschtermin und Ihre Nachricht; bei Geschäftskunden Firma, Ansprechpartner, … | Zwei Aufzählungen nur durch Komma getrennt; man sieht nicht, wo die erste endet. Das Semikolon gliedert Aufzählungsgruppen (Duden, Regel zum Semikolon) | `pages/DatenschutzPage.tsx:172` |
| L29-06 | Datenschutz › Schadenmeldung über reparatur.info | Die PDR.cloud GmbH verarbeitet diese Daten in unserem Auftrag (Art. 28 DSGVO). Wir nutzen sie für die Schadenaufnahme, … | … Wir nutzen die Daten für die Schadenaufnahme, … | „sie“ kann sich auf „die PDR.cloud GmbH“ oder auf „diese Daten“ beziehen; gemeint sind die Daten | `pages/DatenschutzPage.tsx:201` |
| L29-07 | **G:** Normzitate in beiden Texten | § 5 DDG, Art. 6 Abs. 1 lit. f DSGVO (normale Leerzeichen) | Geschütztes Leerzeichen nach „§“ und „Art.“ (§ 5, Art. 6); auf Wunsch auch nach „Abs.“, „Nr.“, „lit.“ | Verhindert Umbrüche wie „§ ⏎ 5“ (Duden empfiehlt das wie bei „z. B.“). Neue Stilblatt-Zeile 11 (9 und 10 waren schon vergeben), Gegenprobe dann in L30. Sichtbar: § 2-mal im Impressum und 4-mal im Datenschutz, Art. 22-mal, Abs./Nr./lit. 27-mal | `pages/ImpressumPage.tsx`, `pages/DatenschutzPage.tsx`, Beschreibung Impressum in `seo/` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L28-04 | Impressum › Umsatzsteuer-ID | „DE 257 851 313“ mit Leerzeichen; amtlich ohne („DE257851313“). Lesbar und üblich, bleibt. |
| L28-05 | Impressum › Berufsbezeichnung | „Karosserie- und Fahrzeugbauer, Maler und Lackierer“ ist aus 4.11 abgeleitet (⚠️ im Code). Gegen die Handwerksrolle prüfen: schon geführt in `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md` (offener Punkt). |
| L28-06 | Impressum › Einleitung | Reihenfolge „Anschrift, Vertretung, Registereintrag, Kammer und Kontakt“ weicht leicht von der Seite ab (Kontakt kommt vor dem Registereintrag). Für eine Aufzählung ohne Belang. |
| L29-08 | Datenschutz › Hosting | Die Erklärung nennt KUPPER IT als Hoster; die Vorschau läuft bei Vercel. Gilt erst nach dem Umzug, geführt als O1 in `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md`. |
| L29-09 | Datenschutz › Datenschutzbeauftragter | Ob er noch benannt und `datenschutzbeauftragter@carcare-center.de` erreichbar ist, ist offen (Rechtsseiten-Plan, R6). Nicht Sache des Korrektorats. |
| L29-10 | Datenschutz › Bewerbungen, Rechtsgrundlage | „§ 26 Abs. 1 BDSG“: Seit dem EuGH-Urteil vom 30.03.2023 (C-34/21) ist umstritten, ob diese Vorschrift neben der DSGVO noch trägt. Art. 6 Abs. 1 lit. b DSGVO steht schon daneben. **Für die anwaltliche Prüfung (R6)**, keine Änderung im Korrektorat. |
| L29-11 | Vorprüfung | „Doppeltes Satzzeichen“ bei „OpenAI Ireland Ltd., Dublin“ war ein Fehlalarm (Abkürzungspunkt, danach Komma). Am 14.10. in `scripts/lib/lektorat-pruefung.mjs` behoben: „Ltd.,“, „Inc.,“, „Corp.,“ gelten als Abkürzung. |
| L29-12 | Vorprüfung, lange Sätze | Server-Logdateien (33 Wörter): eine Aufzählung, gut lesbar. Widerspruchsrecht (34 Wörter): folgt dem Wortlaut von Art. 21 DSGVO, so lassen. Anfrageformulare (44 Wörter): siehe L29-05. |

## Geprüft und ohne Befund

**Sachangaben gegengeprüft (14.10.):**
- Anschriften: Sächsische Datenschutz- und Transparenzbeauftragte, Maternistraße 17, 01067 Dresden (dort seit April 2025,
  Postfach weiter gültig); KUPPER IT GmbH, Prager Straße 15, 04103 Leipzig; Handwerkskammer zu Leipzig, Dresdner Straße
  11/13, 04103 Leipzig; netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe; PDR.cloud GmbH, Attilastraße 16, 12529 Schönefeld
  (laut Faktenblatt `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md` mit AG Cottbus HRB 18136 CB; das Impressum
  von reparatur.info war für den Abruf nicht erreichbar).
- „Von welcher unserer Seiten Sie kommen, übermitteln wir dabei nicht“: alle 147 externen Links im ausgelieferten HTML
  tragen `noreferrer` (`components/ExternerLink.tsx`).
- „Wir setzen keine Cookies“: im Code kein `document.cookie`, kein `localStorage`, nur der eine `sessionStorage`-Eintrag.
- Bewerbungen „bis zu drei Dateien, zusammen höchstens 3 MB“: stimmt mit `ANHANG_MAX_DATEIEN` und `ANHANG_MAX_BYTES`.

**Text:** Titel und Beschreibung (Impressum 54/151, Datenschutz 51/157 Zeichen), H1 ohne Punkt (reine Bezeichnung, wie
in L19-01 festgehalten), Überschriftenfolge, Wir-Form, Textregel 1 („BS CarCare GmbH“ ist der juristische Name),
Gedankenstriche 0, Anführungszeichen, Abkürzungen („Art.“, „Abs.“, „lit.“, „Nr.“), Rechte-Liste Art. 15–21, 77 DSGVO,
VSBG-Hinweis, Haftung für Links, Widerspruch gegen Werbe-E-Mails, KI-Abschnitt mit dem Impressum abgestimmt.
