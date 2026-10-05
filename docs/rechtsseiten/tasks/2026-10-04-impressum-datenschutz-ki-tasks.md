# Rechtsseiten: Impressum, Datenschutzerklärung und KI-Verzeichnis

**Angelegt:** 2026-10-04
**Auftrag des Users (04.10.):** Impressum und Datenschutzerklärung angehen. Firmendaten laut User (Block unten),
alte Datenschutzerklärung der Altseite als Vorlage, Matomo nur „(unter Vorbehalt)“, Domainhosting weiter bei
KUPPER IT in Leipzig, KI-Verzeichnis mit Werkzeug „ChatGPT Image 2.5“ und den Bedeutungen der Kennzeichnungen.
Ausdrücklich: „erstmal nur diese Sachen“, „keine unnötigen vielen Prüfungen“.
**Backlog:** R5 (Impressum), R6 (Datenschutzerklärung), 6.20 (Matomo), 6.21 (allgemeiner KI-Hinweis)
**Vorgänger:** `docs/rechtsseiten/tasks/2026-09-04-rechtsseiten-tasks.md`, Faktenblatt `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`
**Optimierung:** `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md`

## Firmendaten laut User (04.10.)

BS CarCare GmbH · Rechtsform GmbH, Sitz Leipzig · An den Tierkliniken 42, 04103 Leipzig · Geschäftsführer André Bosse ·
Registergericht Leipzig HRB 23667 · „USt-IdNr.: DE 231/106/12214“ · Tel. (0341) 222 96 20 · Fax (0341) 962 74 87 ·
info@carcare-center.de

## Abgleich mit dem Stand (vor dem Schreiben)

| Angabe | Bisher im Impressum | Laut User | Entscheidung |
|---|---|---|---|
| Firma, Anschrift, HRB, E-Mail | gleich | gleich | bleibt |
| Rechtsform, Sitz | nur im Namen | GmbH, Sitz Leipzig | **ergänzt** |
| Vertretung | „André Bosse, Geschäftsführung“ | Geschäftsführer | **„Geschäftsführer André Bosse“** |
| Telefon | 0341 - 261 77 90 | (0341) 222 96 20 | **bleibt 261 77 90**: André im Meeting 25.09. (5.30: „die Nummer mit der 90 am Ende reicht“) und 28.09. (R5: „die alte Nummer mit 29620 nicht mehr nennen“). Der Block ist erkennbar seine E-Mail-Signatur. |
| Fax | entfallen | (0341) 962 74 87 | **bleibt entfallen** (5.30: „braucht ja heute sowieso kein Mensch mehr“) |
| USt-IdNr. | DE 257 851 313 (Altseite) | DE 231/106/12214 | **bleibt DE 257 851 313**: André hat sie am 28.09. bestätigt (R5: „Ja, die passt“). „231/106/12214“ hat das Format einer sächsischen **Steuernummer** (Finanzamt Leipzig I), eine USt-IdNr. ist „DE“ + 9 Ziffern. § 5 Abs. 1 Nr. 6 DDG verlangt die USt-IdNr.; die Steuernummer muss nicht veröffentlicht werden. VIES am 04.10. ohne Ergebnis (deutscher Dienst überlastet, `MS_MAX_CONCURRENT_REQ`). |

Recherche (04.10.): KUPPER IT GmbH, Prager Straße 15, 04103 Leipzig (`kupper-it.com/unternehmen/standorte`; im Backlog
als „KUPA IT“ transkribiert) · Sächsische Datenschutz- und Transparenzbeauftragte seit April 2025 in der
Maternistraße 17, 01067 Dresden · Vercel ist nach dem EU-US Data Privacy Framework zertifiziert · „ChatGPT Images 2.5“
(Modell GPT Image 2.5) von OpenAI, erschienen am 08.09.2026.
**Gemessen (04.10.):** Seiten kommen aus Frankfurt (`X-Vercel-Id: fra1::…`), die **Formularfunktion läuft in den USA**
(`fra1::iad1::…` auf `/api/anfrage`, keine `regions` in `vercel.json`). Das Faktenblatt kannte nur die Auslieferung.

---

### ✅ Phase 1 — Impressum: Firmendaten und KI-Verzeichnis
**Ziel:** Bestätigte Firmendaten eintragen, das KI-Verzeichnis (6.21) als eigenen Abschnitt anlegen.
* [x] Zeile „Rechtsform und Sitz“ (GmbH, Sitz Leipzig), Vertretung „Geschäftsführer André Bosse“.
* [x] Telefon, Fax, USt-IdNr. wie oben entschieden; Begründung mit Andrés Zitaten als Kommentar an jeder Stelle.
* [x] Abschnitt „KI-Verzeichnis“ (`/impressum#ki-verzeichnis`): eingesetzte KI, beide Plaketten in ihrer echten Gestalt (`.cc-ki-marke`) mit Bedeutung, Bilder ohne Kennzeichnung, Abgrenzung (keine konkreten Arbeiten, keine Vorher-Nachher-Ergebnisse), Link zur Datenschutzerklärung.
* [x] Eine Quelle in `data/bildherkunft.ts`: `HERKUNFT_ERKLAERUNG` neben `HERKUNFT_TEXT`, `KI_WERKZEUGE`. Kopfkommentar dort nach der Definition des Users berichtigt (bis dahin hieß „aufgewertet“ auch „Hintergrund getauscht“).
* [x] `components/Rechtstext.tsx` (Rahmen, Abschnitt, Unterabschnitt, Absatz, Anschrift, Aufzählung, Angabe, Verweis); `break-words` gegen die lange DSB-Adresse auf 375 px.
* [x] Meta-Description und Seitenkopf nennen das KI-Verzeichnis.
**Referenzen:**
`pages/ImpressumPage.tsx`
`data/bildherkunft.ts`
`components/Rechtstext.tsx`

### ✅ Phase 2 — Datenschutzerklärung: Volltext statt Gerüst
**Ziel:** Erklärung aus dem gemessenen Stand und den Vorgaben des Users; die alte Erklärung nur als Vorlage für Eigenaussagen des Kunden.
* [x] Auf einen Blick, Verantwortliche Stelle, Datenschutzbeauftragter (Adresse aus der Altseite).
* [x] Hosting und E-Mail: Vercel mit Anschrift, Auslieferung Frankfurt, **Formularfunktion in den USA**, DPF und Art. 45; Domain und Postfächer bei der KUPPER IT GmbH.
* [x] Server-Logs, keine Cookies, `sessionStorage`-Eintrag der Startanimation (§ 25 Abs. 2 Nr. 2 TDDDG), Schriften und Medien vom eigenen Server, TLS.
* [x] Kontakt per E-Mail/Telefon (mit dem Sicherheitshinweis der Altseite), Anfrageformulare mit den tatsächlichen Feldern und dem Weg über netcup, Schadenmeldung (reparatur.info, PDR.cloud), Bewerbungen mit Anhängen (6 Monate), Links zu anderen Anbietern.
* [x] Matomo als „(unter Vorbehalt)“ mit Kasten „gilt erst, wenn wir Matomo einsetzen. Derzeit findet keine Webanalyse statt.“ Einwilligung als Grundlage für den Fall des Einsatzes.
* [x] KI bei Bildern: Werkzeug aus `KI_WERKZEUGE` (OpenAI Ireland Ltd.), Einwilligung abgebildeter Personen, keine Übermittlung beim Besuch, Link auf `#ki-verzeichnis`.
* [x] Rechte, **Widerspruchsrecht als eigener Kasten** (Art. 21 Abs. 4), Aufsichtsbehörde mit neuer Anschrift, automatisierte Entscheidungen, Pflicht zur Angabe, Werbewiderspruch der Altseite, „Stand: 04.10.2026“.
* [x] `noindex` entfernt, `sitemap: false` in `scripts/routes.mjs` entfernt: Die Seite ist kein Gerüst mehr.
**Referenzen:**
`pages/DatenschutzPage.tsx`
`scripts/routes.mjs`

### ✅ Phase 3 — Formularhinweis, Backlog, Build
**Ziel:** Kein Widerspruch zwischen Formular und Erklärung, Stand im Backlog, ein Build.
* [x] Formularhinweis ohne Einwilligungsformel: „Wir verwenden Ihre Angaben nur für die Bearbeitung Ihrer Anfrage / Ihre Bewerbung. Mehr dazu in unserer Datenschutzerklärung.“
* [x] Backlog: R5 und R6 (`offene-punkte-konsolidiert.md`), 6.20 (Abschnitt unter Vorbehalt, Firmenname KUPPER IT) und 6.21 (✅) in `schleife-6.md`, Standzeile „8 offen“. Nachtrag im Faktenblatt (Formularfunktion USA).
* [x] `npm run build` grün: `tsc`, Vite, Nummernräume ok, Sitemap 29 URLs (jetzt mit `/datenschutz`), Prerender 29/29, Suchindex 29 Seiten, FAQ-HTML ok, keine Platzhalter, **0 Gedankenstriche**. Build vom 04.10.2026, 20:25.
* [x] Ausgeliefertes HTML geprüft: `/datenschutz` mit `index, follow` und allen Abschnitten, `/impressum` ohne 222 96 20 und ohne 231/106, mit KI-Verzeichnis; alte Formel „stimmen Sie … zu“ nicht mehr im Bundle.
* [x] `npm run meta` gegen diesen Build: 29 Seiten, 0 außerhalb 50–60 / 140–160.
**Referenzen:**
`components/RequestForm.tsx`
`docs/backlog/schleife-6.md`
`docs/backlog/offene-punkte-konsolidiert.md`

### ✅ Phase 4 — Rückmeldung des Users (04.10., abends)
**Ziel:** Hoster, Einwilligung und die letzten Impressumsangaben nach den Antworten des Users.
* [x] „Nein bitte ändere Vercel als Hoster, weil das auch über Kupper IT gehostet wird“: „Hosting und E-Mail“ nennt nur noch die KUPPER IT GmbH (Website, Domain, Postfächer), ohne Vercel, USA und DPF. Formularweg jetzt „an unseren Webserver“, dann netcup.
* [x] ⚠️ Technische Folge im Code-Kopf von `pages/DatenschutzPage.tsx` und in Optimierung O1: `/api/anfrage` ist eine Vercel-Funktion. Beim Hosting über KUPPER IT muss der Versand mit umziehen, sonst gehört Vercel wieder in die Erklärung.
* [x] „3. Ja“ (Einwilligung der abgebildeten Personen): Die Erklärung sagt es jetzt bestimmt; das KI-Verzeichnis ergänzt bei „KI-bearbeitet“: „Abgebildete Personen sind real und haben der Bearbeitung zugestimmt.“
* [x] „4. Dann pack die dazu“: Abschnitt „Berufsrechtliche Angaben“ (Handwerkskammer zu Leipzig, Dresdner Straße 11/13; Berufsbezeichnung Karosserie- und Fahrzeugbauer, Maler und Lackierer; verliehen in der Bundesrepublik Deutschland; HwO mit Link) und „Verbraucherstreitbeilegung“ („nicht bereit und nicht verpflichtet“). Abgeleitetes ist im Code mit ⚠️ markiert.
* [x] Build erneut, Gegenprobe im ausgelieferten HTML.
**Referenzen:**
`pages/DatenschutzPage.tsx`
`pages/ImpressumPage.tsx`
`data/bildherkunft.ts`

---

### ⬜ Phase 5 — Offene Punkte vor dem Livegang (mit André und KUPPER IT klären)
**Ziel:** Was Impressum und Datenschutzerklärung voraussetzen, ist bestätigt oder angepasst. Bis 04.10. stand das als
„Offene Fragen an André“ hier; auf Wunsch des Users als To-dos.
* [ ] **Datenschutzbeauftragter:** Gibt es ihn noch, und ist `datenschutzbeauftragter@carcare-center.de` erreichbar? Die Erklärung nennt ihn wie die Altseite. Er darf nicht zugleich Geschäftsführer sein (Art. 38 Abs. 6 DSGVO). Sonst den Abschnitt anpassen.
* [ ] **AV-Verträge** nach Art. 28 DSGVO, die die Erklärung voraussetzt: KUPPER IT (Hosting, Domain, Postfächer), netcup (Versandpostfach), PDR.cloud (reparatur.info). Vercel nur, falls der Formularversand dort bleibt.
* [ ] **Formularversand beim Hosting über KUPPER IT** (Optimierung O1): Node.js für `/api/anfrage` bei KUPPER IT, oder den Versand bei Vercel lassen und Vercel in die Erklärung aufnehmen.
* [ ] **Löschfrist Bewerbungen** bestätigen: sechs Monate nach Abschluss des Verfahrens, so steht es in der Erklärung.
* [ ] **Berufsbezeichnung im Impressum** gegen den Eintrag in der Handwerksrolle prüfen (steht dort ein weiteres Handwerk, etwa Kraftfahrzeugtechniker?).
* [ ] **Verbraucherschlichtung:** Ist der Betrieb Innungsbetrieb mit Kfz-Schiedsstelle? Dann den Satz ersetzen und die Schlichtungsstelle nennen; sonst bleibt „nicht bereit und nicht verpflichtet“.
* [ ] **Hinweis an André:** Seine Signatur nennt die Steuernummer als „USt-IdNr.“ und noch Telefon 222 96 20 und Fax. Die Website ist davon nicht betroffen.
* [ ] **Anwaltliche Prüfung** von Impressum und Datenschutzerklärung vor dem Livegang.
* [x] **Einwilligung** der Personen auf den Fotos, die mit KI bearbeitet wurden: bestätigt (User, 04.10.: „Ja“).
* [x] **Impressum (R5):** Kammer, berufsrechtliche Angaben und Verbraucherstreitbeilegung eingetragen (User, 04.10.: „Dann pack die dazu“, Phase 4).
**Referenzen:**
`pages/DatenschutzPage.tsx`
`pages/ImpressumPage.tsx`
`docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-optimierung-tasks.md`

### ✅ Phase 6 — Karriere: Bürokaufmann/-frau statt Industriekaufmann/-frau
**Ziel:** Vorgabe des Users (04.10.): Die kaufmännische Ausbildung heißt Bürokaufmann/-frau.
* [x] `data/jobs.ts`: Titel, Anzeigetitel und ID (`ausbildung-buerokaufmann`; die ID steht als „Bereich“ in der Bewerbungs-Mail). Karte, Stellenhinweis, Bewerbungsformular und strukturierte Daten (`seo/pageSchemas.ts`) lesen von dort.
* [x] `components/JobCards.tsx`: Einleitungssatz „zum Bürokaufmann oder zur Bürokauffrau“; Kommentar in `components/JobPopup.tsx`.
* [x] Bildnummer B109 (Foto der Karte) bleibt: `npm run bilder` behält sie bei gleichem Rahmen und gleicher Datei („umbenannt, Nummer behalten“).
**Referenzen:**
`data/jobs.ts`
`components/JobCards.tsx`

---

## Kommentare

### Phase 1
**Eingehalten:** Firmendaten nur mit Beleg, Abweichungen begründet statt still übernommen ✅, eine Quelle für Plakette und Verzeichnis ✅, Textregeln (wir/Sie, keine Gedankenstriche, „seit“/Fläche unberührt) ✅, unter 700 Zeilen (Impressum 189, Rechtstext 67) ✅, Mobile-First (Umbruch langer Adressen) ✅, kein Mojibake ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (vermieden):** Der Block des Users hätte drei falsche Angaben ins Impressum gebracht: eine Steuernummer als USt-IdNr. und zwei Nummern, die André am 25./28.09. ausdrücklich gestrichen hat. Grund: Er ist eine E-Mail-Signatur, kein Impressumstext. Beleg im Backlog R5 gefunden, nicht vermutet.
2. 🟡 **Mittel (behoben):** `data/bildherkunft.ts` definierte „aufgewertet“ als „geschärft, freigestellt, Hintergrund getauscht“. Nach der Definition des Users ist es nur die Lichtanpassung; ein getauschter Hintergrund wäre ein Eingriff in den Bildinhalt. Kommentar berichtigt.

### Phase 2
**Eingehalten:** jede Aussage gegen den gemessenen Stand (Faktenblatt, Code, Header) ✅, nichts aus der Altseite übernommen, was das heutige System nicht tut (Newsletter, Session-Cookies) ✅, Matomo ohne Behauptung eines laufenden Einsatzes ✅, Widerspruchsrecht getrennt ✅, Stand-Datum ✅, unter 700 Zeilen (374) ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (dokumentiert, Optimierung O1):** Die Formularfunktion läuft in `iad1` (USA), nicht in Frankfurt. Rechtlich über das DPF gedeckt und so in der Erklärung beschrieben, aber Bewerbungsunterlagen gehen damit über US-Server. Eine Zeile `regions` in `vercel.json` hielte alles in Frankfurt. Nicht umgesetzt: Infrastruktur, außerhalb von „erstmal nur diese Sachen“.
2. 🟡 **Mittel (offen, Optimierung O2):** Das Versandpostfach bei netcup „behält zunächst Kopien für Eingangstests“ (Netcup-Plan). Bleibt das so, gehören diese Kopien in die Erklärung; besser vor dem Livegang abschalten.
3. 🟢 **Niedrig (offen, Optimierung O3):** Im Backlog heißt der Dienstleister „KUPA IT“ (Transkript). Richtig ist KUPPER IT GmbH. In 6.20 vermerkt, die übrigen Stellen nicht umbenannt.

### Phase 3
**Eingehalten:** ein Build, alle Wächter grün, Meta gegen diesen Build ✅, Backlog fortgeschrieben ✅, keine unnötigen Prüfläufe (Wunsch des Users: kein Kontrast-, Shot- oder Aussparungslauf) ✅.
**Auffälligkeiten:** keine neuen. Der Kontrast der Plakette auf weißem Grund ist gerechnet (rund 8,8:1), nicht mit `npm run kontrast` gemessen.

### Phase 4
**Eingehalten:** Anweisungen des Users umgesetzt ✅, Abgeleitetes als abgeleitet markiert statt als belegt ausgegeben ✅, technische Folge benannt statt verschwiegen ✅, ein Build ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (offen, O1):** Hosting über KUPPER IT und Formularversand als Vercel-Funktion passen nicht zusammen. Auf einem Webspace ohne Node.js gibt es `/api/anfrage` nicht, dann gehen keine Anfragen ein. Vor dem Umzug klären.
2. 🟡 **Mittel (offen):** Die Berufsbezeichnung ist aus Andrés Betriebsbezeichnung (4.11) abgeleitet. Gegen den Eintrag in der Handwerksrolle prüfen.
