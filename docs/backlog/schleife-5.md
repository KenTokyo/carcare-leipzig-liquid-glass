# Schleife 5 – Backlog

Quelle: Meeting „oalab x carcare center – finale Anpassungen der Website" mit André Bosse am
**25.09.2026** (Teams, Beginn 14:21 Uhr laut Kopfzeile, Dauer 1:19:18). Ali (OALAB) geht die
Vorschau Seite für Seite durch, André kommentiert; André sah den geteilten Bildschirm nicht und
hatte die Seite parallel offen. Aufgenommen als Transkript (DOCX beim User).

> **Die Nummern hat OALAB vergeben**, auf ausdrücklichen Wunsch des Users (25.09.2026). André hat
> zu diesem Termin keine eigene Liste. Vergeben in der **Reihenfolge des Gesprächs** (erste Nennung);
> die Spalte „Zeitmarke" nennt die Minute im Transkript. Ab jetzt gilt dieselbe Regel wie für alle
> Kundenräume: nicht umnummerieren, entfallene Nummern nicht neu vergeben.

> **Das Transkript liegt bewusst nicht im Repository.** Es ist ein vollständiges Gesprächsprotokoll
> mit persönlichen Nebenbemerkungen und Namen von Mitarbeitenden. Die Aufgabentexte sind unsere
> Zusammenfassung, wörtliche Äußerungen stehen in „…". Die Zeitmarken führen zur Stelle im Original.

**Stand 2026-09-25:** **44 Punkte**, davon 43 offen (30 bei OALAB, 8 bei André, 5 gemeinsam) und
eine Vereinbarung (5.2).
**Stand 2026-09-27:** Paket 1 umgesetzt (13 Punkte: 5.13, 5.16–5.18, 5.24–5.26, 5.29–5.33, 5.44) — **30 offen**
(17 bei OALAB, 8 bei André, 5 gemeinsam). Planung und Nachweise: `docs/schleife-5-umsetzung/tasks/2026-09-27-paket-1-tasks.md`.
**Stand 2026-09-28:** 5.20 umgesetzt (Zusatzleistungen aus Andres Mail, Preiskacheln), 5.19 umgesetzt (Verkaufsaufbereitung gestrichen) — **28 offen**.
**Stand 2026-09-28 nach dem Meeting (Schleife 6):** 5.22 erledigt (André hat die Buchung getestet), 5.3, 5.4, 5.5 und 5.8 in Schleife 6 aufgegangen — **23 offen**. Ergänzungen aus dem Meeting stehen in der Spalte „Stand im Projekt" (`schleife-6.md`).
**Stand 2026-10-03:** Bildtausch nach Wunsch des Users: 5.6, 5.7, 5.10, 5.14 und 5.15 erledigt — **18 offen**.
**Stand 2026-10-03 (Herkunftsbogen):** 5.9 erledigt, die Herkunft aller Fotos ist geklärt (R15) — **17 offen**.
**Stand 2026-10-03 (Mitarbeiterfotos):** 5.28 erledigt, fünf Porträts mit Vornamen als aufklappende Karten — **16 offen**.
**Stand 2026-10-02:** 5.28 teilweise — Andrés fünf Mitarbeiterstimmen eingesetzt, Porträtplätze bereit, die Fotos folgen. Weiter **23 offen** (5.28 zählt bis zu den Fotos mit).
**Livegang:** geplant für die Woche ab **28.09.2026** (5.1).
**Nächster Termin:** Montag, **28.09.2026, 10:00–11:30 Uhr**. André möchte die Punkte „frisch"
noch einmal durchgehen; Ali setzt bis dahin um, was ohne Zulieferung geht, und verschickt die Einladung.

> ⚠️ **Nicht besprochen, aber Livegang-Blocker:** die fehlenden **Impressumsangaben** (R5:
> Handwerkskammer, berufsrechtliche Regelung, Verbraucherstreitbeilegung) und die
> **Datenschutzerklärung** (R6). Am 16.09. wurde entschieden, beides „zum Schluss" zu klären. Mit dem
> Livegang in dieser Woche ist dieser Zeitpunkt erreicht. Aus dem Meeting kommt dazu nur die
> Telefonnummer (5.30).

---

## Einstieg: Livegang, KI-Plakette, Slogan (5.1 – 5.5)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.1 | Projekt | **Livegang in der Woche ab 28.09.2026 vorbereiten.** Dieses Meeting ist die letzte Abstimmung davor; KUPA IT (Falk) weiß Bescheid. Ausgeliefert wird bei „95 %", denn die Wissensdatenbank wächst danach weiter. | OALAB | offen | 0:11–0:41 | *2026-09-28 (Schleife 6 umgesetzt): Für den Livegang in Vercel zusätzlich `ANFRAGE_EMPFAENGER_BEWERBUNG=bewerbung@carcare-center.de` setzen (6.13) — ohne den Eintrag gehen Bewerbungen weiter an info@.* *2026-09-28 (Schleife 6): Nach der Umsetzung schickt Ali André ein „Bitte einmal prüfen" per Mail; nach Andrés Go folgt der Termin mit Falk (KUPA IT). Dazu 6.10 (Indexierung) und 6.19 (Backup der alten Seite).* *Hängt an R5 und R6 (Hinweis oben), am Formulartest R10 und an den **sichtbaren Platzhaltern**. Der Wächter `check-dummies` nennt beim Build neun, die „VOR dem Livegang ersetzt werden" müssen: Zusatzleistung 1/2 (5.20), Meilenstein 3 (5.24) und drei Mitarbeiterstimmen (5.28; bis zur Lieferung die Sektion ausblenden). Alles andere darf nach dem Livegang folgen (5.2).* |
| 5.2 | Grundsatz | **Nach dem Livegang weiter anpassen.** Textkorrekturen und das Ersetzen noch vorhandener KI-Bilder sind keine Voraussetzung für den Livegang; die Wissensdatenbank folgt Schritt für Schritt. | OALAB / André | vereinbart | 0:41, 20:27, 1:15:44 | *Bestätigt 3.3 und 3.22.* |
| 5.3 | Alle Seiten | ~~KI-Plakette dezenter gestalten. Andrés Tochter und ihre Studienkollegen finden das Label „KI-generiert" zu präsent; es nehme „ein bisschen Authentizität raus". Die Kennzeichnung bleibt an jedem betroffenen Bild, denn sie ist Pflicht (von André akzeptiert). Sie soll aber unauffälliger werden: „auskrauen [ausgrauen] oder … nur diese weiße Schrift", kein „hervorstechendes Icon".~~ | OALAB | 🔁 **in 6.9 aufgegangen** | 2:33–4:30 | *2026-09-28 (Schleife 6): konkretisiert — Plakette unten in eine Ecke, dezent, aber sofort sichtbar; geführt als 6.9.* *Heute eine dunkle Pille `rgb(17 24 39 / 0.78)` mit 10 px weißer Schrift (`.cc-ki-marke` in `index.css`, `components/KiMarke.tsx`). ⚠️ Dezent heißt nicht unlesbar: Art. 50 KI-VO verlangt eine klar erkennbare Kennzeichnung. Weiße Schrift ohne Grund verliert auf hellen Fotos den Kontrast, deshalb die Varianten an hellen und dunklen Motiven messen, bevor eine gewählt wird.* |
| 5.4 | Startseite › Titelbild | ~~Slogan statt „Unfallinstandsetzung, Karosserie und Lack in Leipzig." Die Begrüßung soll mehr sein als eine Aufzählung von Leistungen („sehr generisch"). André arbeitet einen Vorschlag zu, Ali überlegt parallel. Zum Layout: Der Slogan steht groß. Die Leistungszeile bleibt erhalten, kommt aber kleiner zwischen die Zeile „Meisterbetrieb …" und den Slogan (über dem Kennzeichenhalter des blauen Porsche ist Platz, alles rückt etwas nach unten). Die Vorgaben aus 2.7 gelten weiter: „Premium" bleibt, Fahrzeugpflege weniger betont, Unfallinstandsetzung sowie Karosserie- und Lackierarbeiten aufnehmen, ggf. „alles aus einer Hand". Danach den Slogan überall gleich einsetzen (2.8).~~ | André (Wortlaut) · OALAB (Layout) | 🔁 **in 6.8 aufgegangen** | 4:30–5:41, 1:17:36–1:19:07 | *2026-09-28 (Schleife 6): Slogan geliefert — „We Care and Repair", mit Care-/Repair-Plaketten seitenweit; geführt als 6.8.* *Führt **3.36**, **2.7** und **2.8** zusammen (dort gestrichen). **SEO:** Die H1 trägt seit 2.4 die Suchbegriffe. Empfehlung: Die kleine Leistungszeile bleibt das `<h1>`, der Slogan wird groß gesetzt, aber nicht als H1. So bleibt „Unfallinstandsetzung … Leipzig" die Überschrift für Suchmaschinen.* |
| 5.5 | Startseite › Titelbild | ~~„Karosserie" nicht trennen. André stört, dass das Wort in der Überschrift „so auseinandergehackt" ist.~~ | OALAB | 🔁 **in 6.8 aufgegangen** | 4:30 | *2026-09-28 (Schleife 6): Die bisherige Zeile wird Untertext unter dem Slogan (6.8); dort gilt „Karosserie" nicht trennen.* *Ursache im Code: `hyphens-auto` an der H1 (`components/HeroSection.tsx`). Es ist gesetzt, damit „Unfallinstandsetzung," mobil nicht überläuft, trennt aber auch „Karosserie". Lösung: Trennung nur dort erlauben, wo sie nötig ist (weiches Trennzeichen in „Unfall­instand­setzung", sonst `hyphens: manual`), und an den Breiten aus `npm run shots` prüfen. Mit 5.4 wird die Zeile kleiner, das entschärft es zusätzlich.* |

## Bilder für Smart Repair und Hagel (5.6 – 5.7)

Ali brauchte nur noch zwei Motive. André stellte klar, dass beide schon geliefert sind, und zwar
in der Serie, die er an einem Tag fotografiert hat.

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.6 | Alle Seiten › Smart Repair | **Smart-Repair-Foto durch den weißen Porsche Macan ersetzen.** André hat eine Stoßfängerecke „in allen Facetten" fotografiert, jeden Reparaturschritt „von Anfang bis Ende"; die Serie liegt bei Ali. Motiv: der hintere Stoßfänger auf der Fahrerseite, abgeklebt, kurz vor dem Lackieren. Also die Arbeit, nicht die Schadstelle („man sieht, wie daran wirklich gearbeitet wird … welche Größe das ist"). André ist einverstanden. | OALAB | ✅ **erledigt** (03.10.), anders als geplant | 7:09–11:58, 15:01–15:47 | **2026-10-03 (User):** Statt des weißen Macan zeigt Smart Repair jetzt das Lackierfoto (Lackierer am abgeklebten Stoßfänger) an allen 8 Stellen, für den Seitenhintergrund ein eigener Ausschnitt. Das frühere Motiv liegt in `docs/bilder/archiv/`. Plan: `docs/backlog/tasks/2026-10-03-bildtausch-und-plaketten-tasks.md`. *2026-09-28 (Schleife 6): Tausch läuft (30:58).* *Datei `kacheln/smart-repair-leipzig-carcare.webp` an **7 Stellen**: B12, B39, B61, B68, B78, B87, B97. Alle zeigen Smart bzw. Spot Repair, also wird die Datei ersetzt. Erledigt damit **3.10**; das Motiv ist **3.25** (geliefert). Herkunft danach „echt".* |
| 5.7 | Alle Seiten › Hagelschaden | **Hagelschaden-Foto durch ein echtes ersetzen.** Das heutige ist mit KI aufgewertet und übertreibt: „als wäre das eine totale Wellblechpappe, das Dach". André: „da kannst du auch wirklich eins von uns nehmen". Kandidaten aus derselben Serie: der Dellentechniker am Dach eines dunkelgrünen Wagens mit Dellenlampe („ideal für einen Hagelschaden"), weitere Dachbilder mit Hagellampe, ein weißer SUV („irgendein Toyota"), das A-Säulen-Foto (dunkles Fahrzeug mit Lampe). | OALAB | ✅ **erledigt** (03.10.) | 7:09–11:22, 16:35–17:02 | **2026-10-03 (User):** Echtes Foto „Hagelschaden-carcare-center-leipzig.jpeg“ (Ausbeulen mit Gleithammer und Klebepad unter dem Leuchtschirm) an allen 7 Stellen, keine KI-Plakette; das KI-aufgewertete Bild ist ganz raus (archiviert). Plan: `docs/backlog/tasks/2026-10-03-bildtausch-und-plaketten-tasks.md`. *2026-09-28 (Schleife 6): Tausch läuft (30:58).* *Datei `kacheln/hagelschadenreparatur-leipzig.webp` an **6 Stellen**: B14, B41, B71, B81, B89, B98. Die Datei wird ersetzt. Das Motiv ist **3.27** (geliefert). ⚠️ Das A-Säulen-Foto ist das heutige Dellenmotiv (5.10); wird es hier genommen, braucht die Delle ein anderes.* |

## Startseite, Leistungskarten und Anfrage (5.8 – 5.22)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.8 | Innenaufbereitung | ~~Bilder zum Alcantara-Lenkrad einfügen. Die Fotos hat André geschickt, sie liegen bei Ali (aufgefallen bei der Vorführung der Suche: „Alcantara").~~ | OALAB | 🔁 **in 6.2 aufgegangen** | 13:27–13:58 | *2026-09-28 (Schleife 6): zusammen mit den Bildern zum Schaum-/Tornador-Verfahren als 6.2 geführt; „ausbauen" fällt aus dem Namen (6.1).* *Die Sektion „Exklusivleistungen" auf `/innenaufbereitung-leipzig` (`pages/InnenaufbereitungPage.tsx`) nennt „Alcantara-Lenkrad ausbauen und aufarbeiten" und „Schaum-/Tornador-Verfahren" bisher nur als Text. Neue Bildstellen bekommen ihre B-Nummer von `npm run bilder`.* |
| 5.9 | Alle Seiten | **Herkunft der Bilder aus dem Meeting eintragen.** Beim Durchgang hat Ali für neun Dateien die Herkunft genannt, siehe Tabelle „Herkunft laut Meeting" unter diesem Abschnitt. | OALAB | ✅ **erledigt** (03.10.) | 13:58–49:40 | **2026-10-03 (User, Herkunftsbogen, „final“):** Alle 16 bis dahin ungeklärten Fotos eingetragen (`data/bildherkunft.ts`, Belege in `docs/bilder/motive.json`). **Echt:** Startbild (B1, B2, B7, B8), Footer (B3), Fahrzeugaufbereitung, Leasingrückgabe, Lackierkabine. **KI-bearbeitet** (vom User „KI-aufgewertet“ genannt): Felge, Autoglas, Fuhrparkservice, Schaden melden, Schadenaufnahme (B20), Kalkulation, Versicherungsabwicklung, Privatkunden, Versicherungen und Agenturen, Fahrzeugabgabe. Kein Foto trägt mehr „KI-generiert“. ⚠️ Abweichend von der Tabelle unten heißt die Felge dort „echt“. Schaden melden, Privatkunden und Fahrzeugabgabe heißen dort „KI-generiert“. Es gilt die spätere Angabe des Users. Plan: `docs/backlog/tasks/2026-10-03-bildtausch-und-plaketten-tasks.md` (Phase 4). *2026-09-28 (Schleife 6): präzisiert — Autoglas (roter SLS) ist KI-**generiert**, die zwei Personen sind erzeugt; das Aufbereitungsfoto ist nur in Farbe und Hintergrund angepasst und braucht keine Plakette (22:31–23:03). Die Tags je Nummer gibt der User seit 28.09. durch.* *Beantwortet **R15** teilweise. Eintragen in `data/bildherkunft.ts` (die Plakette folgt automatisch, auch auf „Über uns") und `docs/bilder/motive.json` (Beleg: „Meeting mit André, 25.09.2026", Zeitmarke).* |
| 5.10 | Alle Seiten › Dellenentfernung | **Dellenfoto tauschen.** André gefällt das Motiv nicht: Die Delle ist nicht zu erkennen, dazu „der Teppich da hinten, mit dem Fußabtreter"; es gebe „coolere Bilder". Ali: aufbereiten (Zuschnitt) oder ein anderes nehmen, z. B. den Tesla aus der Lieferung. | OALAB | ✅ **erledigt** (03.10.) | 9:13, 15:55–16:22 | **2026-10-03 (User):** Neues echtes Foto „Dellenentfernung-leipzig-carcare-center.jpeg“ (Leuchtschirm, Delle neben der Heckleuchte eines weißen Porsche) an allen 7 Stellen, Kundenkennzeichen im Hintergrund weichgezeichnet. Plan: `docs/backlog/tasks/2026-10-03-bildtausch-und-plaketten-tasks.md`. *2026-09-28 (Schleife 6): Tausch läuft (30:58).* *Datei `kacheln/dellenentfernung-leipzig-carcare.webp` an **6 Stellen**: B13, B40, B60, B70, B79, B88 (seit 21.09., aus 3.24). **Öffnet 3.11 wieder.** Nur ohne KI aufbereiten, sonst ändert sich die Herkunft (heute „echt").* |
| 5.11 | Alle Seiten › Fuhrparkservice | **Fuhrparkfoto ohne die generierte Person.** Links im Bild wurde eine Person hinzugeneriert. André: „Muss man denn die Person dorthin werfen?" Also das Originalfoto mit den Porsche nebeneinander nehmen. | OALAB | offen | 18:25–19:59 | *Datei `kacheln/autohaus-fuhrpark-service-leipzig-carcare.webp` an 3 Stellen: B18 (Startseite), B73 (Titelbild `/fuhrparkservice-leipzig`) und **B106 (Karriere, Karte „Serviceberater")**. ⚠️ Mehrfachnutzung: Zum Serviceberater passt die Person mit Tablet. Vorschlag: das Original als **neue Datei** nur für B18 und B73; B106 behält das bearbeitete Bild mit der Plakette „KI-bearbeitet".* |
| 5.12 | Startseite › Schadenreise, Schritt 02 | **Eine echte Schadenaufnahme fotografieren.** André: „Ich kann auch eine separate Schadenaufnahme nochmal fotografieren und dir zuarbeiten." Ali: „Ja, noch besser." | André | offen | 20:00–20:27 | *2026-09-28 (Schleife 6): weiter offen, André hat die Liste vor sich (42:36–45:49).* *Ersetzt B20 (`kacheln/versicherung-schadenabwicklung-leipzig-carcare.webp`). Das Foto steht dort seit 21.09. als Zwischenlösung aus 3.8, weil das frühere Motiv „ziemlich unrealistisch" war. Kein Livegang-Blocker (5.2).* |
| 5.13 | Startseite › gepinnte Abläufe | **„Überspringen"-Knopf für die gepinnten Abläufe.** Rückmeldung aus Andrés Umfeld: Bei „Bild 1 von 5" müsse man „scrollen, scrollen, scrollen", und Ältere könnten an einen Fehler denken. Ali erklärt den Effekt als bewusstes Gestaltungsmittel (wie bei Apple) und bietet einen Knopf an, der den Ablauf überspringt und direkt zur nächsten Sektion („Für wen wir arbeiten") führt. André: „dann lassen wir das. Alles gut." | OALAB | ✅ **umgesetzt** (2026-09-27) | 20:43–24:08 | *Umgesetzt 2026-09-27 (Paket 1): Knopf „Ablauf überspringen“ (mobil „Überspringen“), 48 px, springt über Lenis zur nächsten Sektion und gibt ihr den Fokus — gilt für Unfall- und Aufbereitungsablauf. Geprüft am Build, beide Knöpfe: Unfallablauf → „Für wen wir arbeiten“, Aufbereitungsablauf → FAQ, Ziel jeweils bei 88 px, Fokus auf dem Ziel, Desktop und mobil; Kontrast 10:1.* *Das Sticky-Scrollen bleibt (entschieden, siehe 3.1). **Der Knopf kommt** (Entscheidung des Users am 25.09. nach Rückfrage). `components/ScrollPinnedProcess.tsx` hat bisher keinen; er muss per Tastatur erreichbar sein und hinter den Ablauf springen.* |
| 5.14 | Startseite › „Der richtige Ansprechpartner" | **Transporterbild auf der Startseite tauschen.** Der grüne Cayenne auf dem Transporter ist André zu dominant („ich will da kein grünes Auto haben", es soll farblich zur Seite passen). Auf `/geschaeftskunden` gefällt er beiden („als Kontrast richtig schön") und **bleibt dort**. Bis Andrés neues Foto da ist (5.15), kommt übergangsweise das Transporterfoto mit dem dunklen Macan (heller Wagen dahinter). | OALAB | ✅ **erledigt** (03.10.) | 24:19–26:48, 1:14:27–1:15:07 | **2026-10-03 (User):** Nur die Startseitenkarte „Autohäuser & Fuhrparks“ (B26) zeigt jetzt das Anhängerfoto (eigene Datei); `/geschaeftskunden` und `/leistungen` behalten ihr Bild. Plan: `docs/backlog/tasks/2026-10-03-bildtausch-und-plaketten-tasks.md`. *Datei `kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp` an B26 (Startseite) und B84 (Titelbild Geschäftskunden). **Nur B26 ändern, also eine neue Datei anlegen**; B84 bleibt.* |
| 5.15 | Startseite | **Neues Transporterfoto:** ein sauberer Transporter, im Mittelpunkt das Fahrzeug auf der Ladefläche und nicht der Transporter selbst, kein grünes Auto. | André | ✅ **geliefert und eingebaut** (03.10.) | 24:44–26:48 | **2026-10-03:** Anhängerfoto aus den gesichteten Augustfotos („Autohaueser und Geschaeftskunden Haenger.jpeg“), eingebaut als 5.14. *2026-09-28 (Schleife 6): weiter offen, André hat die Liste vor sich (42:36–45:49).* *Für B26 (5.14).* |
| 5.16 | Startseite › „Autohäuser & Fuhrparks", Geschäftskunden | **Volkswagen Automobile Leipzig und Audi Zentrum Leipzig verlinken**, so wie das Porsche Zentrum Leipzig. André: „Du kannst auch VW und Audi verlinken." | OALAB | ✅ **umgesetzt** (2026-09-27) | 29:07–29:16 | *Umgesetzt 2026-09-27 (Paket 1): Links `volkswagen-leipzig.de` und `audi-zentrum-leipzig.de` in `data/partners.ts` (Betreiber am 27.09. am Impressum bzw. auf der Seite geprüft), Protokoll in `docs/partnerlogos/README.md`. Kein Logo.* *Beide stehen schon ohne Link in `data/partners.ts` (gilt für Zielgruppenkarte und Geschäftskundenseite zugleich). **Nur Link, kein Logo:** Die Marken gehören der Volkswagen AG bzw. der AUDI AG, nicht den Autohäusern (Vorgehen wie bei Porsche, `docs/partnerlogos/README.md`). Die Adressen vor dem Eintragen beim Autohaus selbst prüfen. Mündliche Freigabe vom 25.09., damit sind 3.16, 3.31 und die Partnerlogos um zwei weitere teilweise erledigt.* |
| 5.17 | Startseite › „Autoaufbereitung ist mehr als Reinigung" | **Vierte Karte „Mehr über Aufbereitung erfahren" prüfen.** Ihr Bild ist ein Füllfoto. Ali prüft per SEO-Check, ob die Karte gebraucht wird; wenn nicht, fällt sie weg, und es bleiben Innenaufbereitung, Außenaufbereitung und Leasingrückgabe. | OALAB | ✅ **umgesetzt** (2026-09-27) | 30:00–30:40 | *Umgesetzt 2026-09-27 (Paket 1): Karte entfernt. Gemessen: Der Hub war von der Startseite weitere 3× verlinkt und von 29/29 Seiten erreichbar, KEIN Ratgeber hatte einen Link von der Startseite. Stattdessen eine Ratgeber-Zeile mit den vier Aufbereitungsartikeln und „Alle Ratgeber“ — löst T4. Bildstelle B30 damit entfallen (Nummer wird nicht neu vergeben), das Motiv bleibt im Bestand.* *Karte `id: 'wissen'` in `components/AutoDetailingExpertiseSection.tsx`, Bild B30. Fällt sie weg, fehlt an dieser Stelle der Weg in den Wissensbereich. Dann **T4** (zweiter Knopf auf den Aufbereitungskarten → Wissensbereich) gleich mitentscheiden.* |
| 5.18 | Startseite, Fahrzeugaufbereitung › Ablauf | **Zwei Korrekturen in Schritt 04 „Professionelle Aufbereitung":** „außen" großschreiben („Innen, Außen, Lack und Details") und „nach unserem Standard" durch „nach dem höchsten Standard" ersetzen. Begründung: „unserem Standard hört sich an, als hättet ihr einen eigenen Standard entwickelt". | OALAB | ✅ **umgesetzt** (2026-09-27) | 32:00–32:18 | *Umgesetzt 2026-09-27 (Paket 1): Neuer Wortlaut; die Startseite liest den Ablauf jetzt aus `data/detailing.ts` statt aus einer Kopie (eine Quelle). „Innen, Außen“ an fünf weiteren Stellen als Bereichsname groß.* *Der Satz steht **zweimal** im Code: in `components/DetailingProcessSection.tsx` und in `data/detailing.ts` (Ablauf der Aufbereitungsseite). Beide ändern, besser auf eine Quelle ziehen. „Innen, außen …" steht an fünf weiteren Stellen (Sektionstitel „Innen, außen und Lack – die drei Bereiche im Überblick", Meta-Description, Leistungskatalog); die Schreibweise einmal einheitlich festlegen.* |
| 5.19 | Anfrage-Dialog › Aufbereitungstermin | **„Verkaufsaufbereitung" aus der Auswahl streichen**, denn die „gibt es so als solches eigentlich nicht". Die Leasingrückgabe bleibt wählbar (André: „lass es so"), obwohl sie kein festes Paket ist. | OALAB | ✅ **umgesetzt** (2026-09-28) | 35:11–35:29, 37:32 | *Umgesetzt 2026-09-28: aus der Auswahl gestrichen (`data/leistungsauswahl.ts`), der Server weist den alten Wert ab; Kontaktseite ohne das Wort; Wissenskategorie „Aufbereitung vor dem Verkauf“ statt des Leistungsnamens (Thema bleibt). Zugleich auf Wunsch des Users: Leistung und Name Pflicht, Telefon ODER E-Mail, Marke/Modell als Auswahllisten — `docs/aussparung-aufbereitung/tasks/2026-09-28-aussparung-aufbereitung-tasks.md`.* *Gemessen: 4 Nennungen. Die Auswahl in `data/leistungsauswahl.ts` (`id: 'verkauf'`), die Beschreibung der Anfrageart in `pages/ContactPage.tsx`, ein Kommentar in `data/zusatzleistungen.ts` und die Beschreibung eines Wissensartikels (`data/knowledgeArticles.ts`). Der Wissensartikel erklärt das Thema allgemein; wie bei 4.3 bewusst entscheiden, nicht einfach mitstreichen.* |
| 5.20 | Anfrage-Dialog › Aufbereitungstermin | **Zusatzleistungen statt der Platzhalter „Zusatzleistung 1/2".** Im Meeting genannt: Geruchsneutralisierung (Ozonbehandlung / Heißvernebelung / Fahrzeugdesinfektion, „das will ich eigentlich pushen"), Cabrio-Verdeckimprägnierung und Motorreinigung. Das Feld bleibt freiwillig; bei vielen Einträgen wird es eine Aufklappliste. Die vollständige Liste schreibt André auf, denn auf dem Flyer stehen nicht alle Leistungen. | André (Liste) · OALAB (Einbau) | ✅ **umgesetzt** (2026-09-28) | 35:37–41:18 | *Umgesetzt 2026-09-28: Liste aus Andres Mail vom selben Tag — Keramik 849 €, Nano 299 €, Frontscheibenversiegelung 89 €, Felgenintensivreinigung 95,20 €, Cabrio-Verdeckimprägnierung 99 €, Motorreinigung 49 €, dazu Ozon 45 € und Heißvernebelung 59 €. Alle acht im Formular wählbar (Aufklappliste mit Preis, Mail mit Preis im Klartext); Ausgrauen je gewählter Leistung (aktiv: Motorreinigung bei Premiumpflege, Keramik oder Nano; weitere Regeln folgen mit Andres Paketbeschreibungen). Dazu Preiskacheln: Übersicht alle, Außen- und Innenseite nur die zugeordneten, jede Kachel wählt im Formular vor. Plan und Nachweise: `docs/aufbereitung-zusatzleistungen/tasks/2026-09-28-zusatzleistungen-kacheln-tasks.md`.* *Führt **2.26 = 1.18** fort (dort gestrichen). Die Preise sind seit 3.35 geregelt: bepreist, sonst „Preis nach Absprache". Die drei genannten Leistungen können die Platzhalter in `data/zusatzleistungen.ts` sofort ersetzen. Die Anzeige auf der Aufbereitungsseite (2.11) hängt an derselben Liste.* |
| 5.21 | Alle Seiten › Fußzeile | **Fußzeile verkleinern.** Sie ist „sehr breit" und wird auf das Wesentliche reduziert. | OALAB | offen | 42:44–43:03 | *`components/Footer.tsx`. Dabei mitentscheiden: die Footer-Icons mit Kontrast 1,00:1 (konsolidierter Backlog, Querschnitt) sowie 5.30 und 5.31, die an derselben Stelle stehen.* |
| 5.22 | reparatur.info | **Terminvereinbarung über reparatur.info testen.** Weder Ali noch André wissen, ob ein Termin oder Upload über „Schaden melden" direkt in Andrés PDR-Kalender landet. André: „Das müssen wir noch mal testen." | André · OALAB | ✅ **erledigt** (André, vor dem 28.09.) | 43:03–44:26 | *2026-09-28 (Schleife 6): André hat die Online-Terminbuchung über reparatur.info im Schadensbereich getestet — „das trägt es auch ein im PDR" (2:38).* *Ziel seit 2.23: `https://reparatur.info/bs-carcare-gmbh` („Daten hochladen", „Termin vereinbaren"). Den Testfall gemeinsam durchspielen und das Ergebnis hier eintragen. Passt zum offenen Formulartest R10.* |

### Herkunft laut Meeting (zu 5.9)

| Datei | Stellen | Herkunft | Aussage im Meeting |
|---|---|---|---|
| `kacheln/fahrzeugaufbereitung-leipzig-carcare.webp` | B9, B31, B44, B65, B76, B92, B100 | **echt** | „Fahrzeugaufbereitung Bild ist nicht KI-generiert. Tag rausnehmen." (13:58); bei „Leistung auswählen" ebenso (30:40) |
| `kacheln/felgenreparatur-leipzig-carcare.webp` | B15, B42, B62, B72, B82, B90, B99 | **echt** | echtes Foto einer Cupra-Felge von André (17:48) |
| `kacheln/leasingrueckgabe-leipzig-carcare.webp` | B17, B35, B59 | **echt** | Plakette bei der Leasingrückgabe (18:25) und bei „Gepflegt zurückerhalten" (32:00) weg |
| `kacheln/lackierkabine-leipzig-carcare.webp` | B104, B107 | **echt** | Karriere, „Fahrzeuglackierer": „Das stimmt nicht, das kann da raus." (48:51) |
| `kacheln/autoglas-scheibenreparatur-leipzig-carcare.webp` | B16, B43, B63, B74, B83, B91 | **KI-bearbeitet** | der rote Mercedes SLS ist echt, die zwei Personen an der Scheibe sind generiert (18:03) |
| `kacheln/autohaus-fuhrpark-service-leipzig-carcare.webp` | B18, B73, B106 | **KI-bearbeitet** | die Person links wurde hinzugeneriert (18:25); B18 und B73 bekommen das Original (5.11) |
| `kacheln/schaden-melden-leipzig-carcare.webp` | B19 | **KI-generiert** (bestätigt) | „das KI-generierte Bild von dem Parkplatzschaden" (19:59) |
| `kacheln/privatkunden-leipzig-carcare.webp` | B24, B32, B75 | **KI-generiert** (bestätigt) | „Termin anfragen": „die Menschen da doch KI-generiert" (30:40) |
| `kacheln/fahrzeugabgabe-leipzig-carcare.webp` | B33 | **KI-generiert** (bestätigt) | „Fahrzeug abgeben, das ist ja auch ein KI-generiertes Foto" (30:40) |

**Werden ersetzt:** Smart Repair (5.6), Hagelschaden (5.7; laut Ali KI-aufgewertet) und B20 (5.12).
Beim Nachfolger die Herkunft gleich mit eintragen.
**Stand 2026-10-03 (User, final):** Maßgeblich ist jetzt `data/bildherkunft.ts`, nicht mehr diese Tabelle. Abweichend von ihr ist die Felge KI-bearbeitet statt echt. Schaden melden, Privatkunden und Fahrzeugabgabe sind KI-bearbeitet statt KI-generiert (5.9).
**Bis 03.10. offen (R15), jetzt geklärt** (Startbild und Footer echt, die übrigen KI-bearbeitet): Startbild und Footer (B1–B3, B7, B8), `kalkulation` (B21, B109),
`versicherungsabwicklung` (B22), `versicherungen-und-agenturen` (B25) und `wissensdatenbank`
(B30 — seit 27.09. entfallen, mit der Karte aus 5.17).
**Grundsatz (Ali, 30:40–31:40):** Motive mit Menschen sind bewusst KI-generiert. Widerruft eine
gezeigte Person ihre Einwilligung, müsste ein echtes Foto sofort herunter. Echte Fotos der
Mitarbeitenden sind jederzeit möglich, wenn André das möchte; im Meeting kam dazu keine Antwort.

## Über uns (5.23 – 5.24)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.23 | Über uns › „Alles im eigenen Haus" | **Die Leistungskarten wie auf der Startseite bebildern.** Die Karte „Neu- und Reparaturlackierung" bekommt das Lackiervideo der Startseite statt des Fotos. Das neue Smart-Repair-Foto kommt auf „Smart Repair & Dellenentfernung", Hagelschaden usw. „sauber anpassen". Die KI-Plaketten sollen denen der Startseite entsprechen. | OALAB | offen | 45:00–46:12 | *B96 (Lackierung, heute das Foto `autolackierung…`) wird ein Video wie B11/B112. B97 und B98 ändern sich mit 5.6 und 5.7 automatisch (dieselben Dateien), die Plaketten mit 5.9. Laut Transkript zeigte die Lackierkarte das Smart-Repair-Foto; laut Bildinventar steht dort das echte Lackierfoto. Gemeint ist in beiden Fällen: so wie auf der Startseite.* |
| 5.24 | Über uns › Zeitstrahl | **Meilenstein 3 einsetzen: 2017 „Eintritt in die Schadensteuerung"**, darunter eine kurze Erklärung, warum das wichtig ist (Zusammenarbeit mit der Versicherungswirtschaft). | OALAB | ✅ **umgesetzt** (2026-09-27) | 46:14–48:07 | *Umgesetzt 2026-09-27 (Paket 1): Station 2017 „Eintritt in die Schadensteuerung“ (erster Teil von 4.19 + kurze Erklärung) eingesetzt, Platzhalter und zwei ANERKANNT-Zeilen entfernt — Zeitstrahl 6/6, Build grün. Das Jahr bitte bei André bestätigen lassen; „Ausbildungsbetrieb“ bewusst nicht unter 2017 gesetzt.* *Beantwortet **4.19** (Jahr) und schließt **R1** ab (dann 6 von 6 Stationen). ⚠️ André hat das Jahr im Gespräch geschätzt (zwischen 2016 und 2017); festgelegt wurde 2017. Beim nächsten Termin kurz bestätigen lassen. Offen ist noch der zweite Teil von 4.19 („Ausbildungsbetrieb im Lackier- und Karosseriebauhandwerk"): mitnehmen oder weglassen? Umsetzung in `data/historie.ts`: `istPlatzhalter` entfernen und den Eintrag aus `ANERKANNT` in `scripts/check-dummies.mjs` nehmen, wie bei 2013.* |

## Karriere (5.25 – 5.29)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.25 | Karriere › Ausbildung | **Ausbildungskarte „Karosserie- und Fahrzeugbaumechaniker/in": Der Text ragt über den Kasten.** | OALAB | ✅ **umgesetzt** (2026-09-27) | 49:42–50:20 | *Umgesetzt 2026-09-27 (Paket 1): Gemessen am Build: 9 Überläufe (3 Titel × 3 Breiten, auch „Industriekaufmann/-frau“, +30 bis +59 px) → 0. Der blaue Punkt hängt per Wortverbinder am Wort, dazu Silbentrennung und weiche Trennstellen an den Wortfugen („Fahrzeugbau-/mechaniker/in“). Nebenbei behoben: Auf zugeklappten Mobil-Karten lag die KI-Plakette über langen Titeln (11 von 96 Streifen, auch Startseite) → 0.* *Langer Titel in `data/jobs.ts`. An den Breiten aus `npm run shots` prüfen (Silbentrennung wie bei 5.5 oder Umbruch).* |
| 5.26 | Karriere › Ausbildung | **Ausbildung freischalten.** Karosserie- und Fahrzeugbaumechaniker/in und Fahrzeuglackierer/in bekommen den Hinweis „Ausbildungsbeginn Sommer 2027". Industriekaufmann/-frau wird ebenfalls aktiv, aber **ohne** Hinweis („lassen wir es mal unkommentiert"), weil dort jetzt noch ein Nachzügler willkommen wäre. | OALAB | ✅ **umgesetzt** (2026-09-27) | 50:20–51:21 | *Umgesetzt 2026-09-27 (Paket 1): Alle drei Ausbildungen offen; Abzeichen „Beginn Sommer 2027“ bzw. „Ausbildungsplatz frei“; Banner und Pop-up „3 offene Stellen · 3 Ausbildungsplätze“; Formularauswahl nennt den Beginn; `JobPosting` jetzt mit dem Pflichtfeld `datePosted` und voller Adresse.* *Heute stehen alle drei auf `status: 'nicht-suchend'` (`data/jobs.ts`). Beantwortet **3.32** und **R4** bis auf die Eckdaten je Beruf. ⚠️ `suchend` erzeugt `JobPosting`-Markup (`seo/pageSchemas.ts`). Für Ausbildungsplätze mit Beginn 2027 prüfen, welche Angaben dort stehen (Beginn, Art der Stelle).* |
| 5.27 | Karriere › Ausbildung „Fahrzeuglackierer/in" | **Foto einer jungen Lackiererin (Azubi) bei der Arbeit.** Die Ausbildungskarte zeigt heute einen erfahrenen Kollegen; mit echten Azubis „wirkt es anders". Die Kollegin, an die André denkt, ist ab 25.09. zwei Wochen in der Berufsschule. | André | offen | 51:21–52:19 | *2026-09-28 (Schleife 6): weiter offen, André hat die Liste vor sich (42:36–45:49).* *Nur **B107** (neue Datei); B104 (Stellenkarte „Fahrzeuglackierer") behält `lackierkabine…`. Kein Livegang-Blocker. Die schriftliche Einwilligung der Mitarbeiterin (§ 22 KUG) gleich mit einholen.* |
| 5.28 | Karriere › „Aus dem Team" | **Mitarbeiterstimmen einsammeln.** Die Frage an die Kolleginnen und Kollegen: „Was schätzt du an der Arbeit und an dem Team oder generell an unserem Unternehmen am meisten?" Die Antwort erscheint als Zitat, **ohne Namen**. Neu: auf Wunsch ein kleines Foto der Person neben dem Zitat, aber nur, wenn sie das möchte; das fragt André. | André (Stimmen, Einwilligungen) · OALAB (Foto-Option) | ✅ **erledigt** (03.10.) | 53:14–55:20 | **2026-10-03 (User): Fotos geliefert und eingebaut, jetzt MIT VORNAMEN.** Josie (Fahrzeuglackiererin), Marko (Serviceberater), Michal (Fahrzeuglackierer), Eshan (Kfz-Aufbereiter), Karol (Karosserie- und Fahrzeugbaumechaniker), laut User echte Mitarbeitende mit Einverständnis. Der Untertext „Bewusst ohne Namen …“ ist entfallen, damit ist die Vorgabe „ohne Namen“ (3.19) auf Wunsch des Users aufgehoben. Darstellung im Design der Leistungskarten der Startseite: aufklappende Karten, eingeklappt Beruf und Bildvorschau, aufgeklappt Aussage, Vorname und Bild. Die Textkachel steht im unteren Drittel, kein Gesicht wird überdeckt (gemessen an 5 Breiten × 5 Karten). Herkunft „echt“ (EXIF: iPhone-Aufnahmen vom 02.10., ohne Bearbeitung), B142–B146 bleiben. Widerruf = `vorname: null`, `foto: null` in `data/stimmen.ts`. Plan: `docs/backlog/tasks/2026-10-03-stimmen-karten-fotos-tasks.md`. **2026-10-02 (Umsetzung):** Andrés fünf Aussagen aus seiner Mail ersetzen die drei Platzhalter, Wortlaut unverändert (nur Rechtschreibung), Berufe in der Schreibweise der Stellenkarten: Fahrzeuglackiererin, Serviceberater, Fahrzeuglackierer, Kfz-Aufbereiter, Karosserie- und Fahrzeugbaumechaniker. Je Stimme ein rundes Porträt neben dem Beruf; bis das Foto da ist, das Symbol des Gewerks (fertig gestaltet, kein „Foto folgt“). Die fünf Plätze stehen mit fester Nummer im Bildinventar (B-Nummern in `docs/bilder/README.md`, Block „Platzhalter“), und die Nummer bleibt, wenn das Foto eingebaut ist. Ohne bestätigte Herkunft in `data/bildherkunft.ts` bricht der Build, ein KI-generiertes Gesicht ist ausgeschlossen. **Offen:** die Fotos (laut User werden sie zugesandt), je Foto die schriftliche Einwilligung (§ 22 KUG, § 26 Abs. 2 BDSG). Plan: `docs/backlog/tasks/2026-10-02-stimmen-und-zusatzregeln-tasks.md`. *2026-09-28 (Schleife 6): Die Sektion bleibt vorerst so, André sammelt mit der Zeit (32:53, 42:36). Die sichtbaren Platzhaltertexte bleiben damit bis zur Lieferung stehen.* *Drei Platzhalter stehen schon (`components/Stimmen.tsx` kennt bisher nur Beruf und Zitat). Führt **3.19** und den Teil „Mitarbeiterstimmen" aus **1.26** fort (dort gestrichen); die Benefits aus 1.26 bleiben offen. Mit Foto braucht jede Stimme eine schriftliche Einwilligung (§ 22 KUG).* |
| 5.29 | Karriere › Bewerbungsformular | **Anhänge ermöglichen** (Lebenslauf als PDF, Word o. Ä.). Das geht heute noch nicht. | OALAB | ✅ **umgesetzt** (2026-09-27) | 55:20–55:43 | *Umgesetzt 2026-09-27 (Paket 1): Bis zu 3 Dateien, zusammen 3 MB (PDF, Word, ODT, JPG, PNG), Signaturprüfung im Browser und in der Funktion, Versand als Mail-Anhang, keine Speicherung. 11/11 Funktionstests bestanden (abgefangener Versand). Faktenblatt Datenschutz ergänzt (R6).* *Heute gibt es eine Vorgangsnummer, die Unterlagen kommen per E-Mail hinterher (`components/formulare/BewerbungFelder.tsx`, `components/RequestForm.tsx`). Führt **R9** für Bewerbungen fort; der Anhang bleibt freiwillig (1.22). ⚠️ Bewerbungsunterlagen sind besonders schutzbedürftig: Die Datenschutzerklärung (R6) muss sie nennen, Größe und Dateityp werden serverseitig begrenzt.* |

## Kontakt und Fußzeile (5.30 – 5.31)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.30 | Fußzeile, Impressum | **Faxnummer entfernen.** „0341 - 962 74 87" ist das Fax, und das „braucht ja heute sowieso kein Mensch mehr". Die Telefonnummer mit der 90 am Ende reicht. | OALAB | ✅ **umgesetzt** (2026-09-27) | 56:01–56:43 | *Umgesetzt 2026-09-27 (Paket 1): Fax aus Footer und Impressum entfernt; das Impressum nennt jetzt Telefon 0341 - 261 77 90.* *Gemessen: 2 Stellen, `components/Footer.tsx` (Kontakt) und `pages/ImpressumPage.tsx` („Telefax"). **Beantwortet die Telefonfrage aus R5** (die Altseite nennt zwei Nummern): Ins Impressum gehört 0341 261 77 90.* |
| 5.31 | Fußzeile | **Neue Zeile unter dem Logo:** „BS CarCare GmbH – Ihr Premium-Partner für Fahrzeugaufbereitung und Unfallinstandsetzung in Leipzig." Alis Vorschlag „…, Pflege und …" war André „zu viel". | OALAB | ✅ **umgesetzt** (2026-09-27) | 56:44–57:06 | *Umgesetzt 2026-09-27 (Paket 1): Neue Zeile unter dem Logo, am Build geprüft.* *Heute steht dort „Ihr Premium-Partner für Fahrzeugaufbereitung und -pflege in Leipzig." (`components/Footer.tsx`); die Unfallinstandsetzung fehlt bisher ganz.* |

## Fahrzeugaufbereitung (5.32 – 5.42)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.32 | Fahrzeugaufbereitung › Preise | **Alle Paketpreise mit „ab" versehen** („ab 169 €", „ab 199 €" …). André: „ab ist gar nicht schlecht", weil es ohnehin Aufpreise für Geländewagen, Großraumlimousinen und Transporter gibt. | OALAB | ✅ **umgesetzt** (2026-09-27) | 58:36–1:00:52 | *Umgesetzt 2026-09-27 (Paket 1): 17 Stellen in 6 Dateien mit „ab“, im Schema `minPrice` statt Fixpreis; danach 0 Paketpreise ohne „ab“ (gemessen über components, pages, data, seo).* *Sichtbaren Text, FAQ (`data/faqs.ts`), Meta-Description und `Offer`-Schema gemeinsam ändern (Standard 5: nur auszeichnen, was sichtbar ist). Seit 4.7 tragen nur einzelne Stellen ein „ab"; die FAQ z. B. sagt „kostet 169,00 €". Danach `npm run meta`.* |
| 5.33 | Fahrzeugaufbereitung › Lackaufbereitung | **Die Lackaufbereitung stärker herausstellen.** „auf Wunsch mit Swissvax-Wachsen" streicht André dort, denn Swissvax gehört zur Premiumpflege „exklusiv". Dafür kommen **Keramik- und Nanoversiegelung** hinein; die Keramikversiegelung will André pushen. Inhaltlich geht die Lackaufbereitung tiefer als die Außenaufbereitung (Kratzer herausarbeiten, mehr Feinschliff, Aufpreis, nicht im 169-€-Paket) und soll „mehr verkauft, mehr gepusht werden". | OALAB | ✅ **umgesetzt** (2026-09-27) | 1:01:02–1:02:51, 1:04:06–1:04:35 | *Umgesetzt 2026-09-27 (Paket 1): Paketkarte, Schema, Umfangstext, FAQ „Unterschied“ und die Lack-Liste auf `/aussenaufbereitung-leipzig`: Swissvax raus, Keramik- und Nanoversiegelung rein, „geht tiefer als die Außenpflege“.* *Karte „Lackaufbereitung — Preis nach Aufwand" in `data/detailing.ts` („… — auf Wunsch mit Swissvax-Wachsen."). Die Premiumpflege „exklusiv" bleibt, wie sie ist. Nicht besprochen: die Karte „Swissvax-Wachse" auf `/aussenaufbereitung-leipzig`.* |
| 5.34 | Fahrzeugaufbereitung › Innenraumdesinfektion | **Fotos der Ozonbehandlung einbauen**; darauf ist von außen das Schild am Fahrzeug zu sehen. Die Fotos liegen vor. Heißvernebelung und Ozonbehandlung bleiben im Angebot. | OALAB | offen | 1:02:51–1:03:19 | *Sektion „Innenraumdesinfektion gegen Keime, Viren und Gerüche" (siehe 1.10, 1.11).* |
| 5.35 | Fahrzeugaufbereitung | **Foto einer Heißvernebelung mit sichtbarem Dampf.** André: Das „kann ich auch noch mal versuchen zuzuarbeiten." | André | offen | 1:03:19–1:03:30 | *2026-09-28 (Schleife 6): weiter offen, André hat die Liste vor sich (42:36–45:49).* *Ergänzt 5.34, optional.* |
| 5.36 | Fahrzeugaufbereitung › „Innen, außen und Lack" | **Die Außenaufbereitung bekommt das Foto vom gelben Ferrari bei der Wäsche.** Das Politurfoto mit der Kollegin passt laut André eher zur Lackaufbereitung. Die Abgrenzung (außen = Wäsche und Vorbereitung, Lack = Politur und mehr) ist bestätigt (4.8). | OALAB | offen | 1:03:30–1:05:16 | *B46 (Außen) und B47 (Lack) zeigen heute nebeneinander dasselbe Politurfoto (`lackaufbereitung…`). B46 bekommt eine **neue Datei**, B47 behält das Politurfoto; damit hat sich der Vermerk „B47 wird später ersetzt" erledigt. Noch prüfen: B28 (Startseitenkarte „Außenaufbereitung") und B66 (Titelbild `/aussenaufbereitung-leipzig`) zeigen dasselbe Politurfoto ebenfalls unter „Außen".* |
| 5.37 | Fahrzeugaufbereitung › „Ergebnisse, die man sieht" | **Die Galerie mit den gelieferten Fotos füllen:** Innenaufbereitung („ganz viele"), Außenreinigung, Lackpolitur, Felgenreinigung (Porsche Taycan mit Weissach-Paket), Motorraum und Politur-Finish. Dazu die Polsterreinigung aus den Transporterfotos, als eigene Kachel oder bei der Innenaufbereitung. | OALAB | offen | 1:05:19–1:09:25 | *11 Platzhalter, B48–B58 (`components/DetailingGallery.tsx`). Führt **2.2** und **3.6** fort (dort gestrichen) und erfüllt **3.23** teilweise: Felgenreinigung und Politur sind geliefert, die Versiegelung kommt mit 5.39. Die Fotoregel gilt: Aufnahmen während der Arbeit, keine Vergleiche „dreckig/sauber" (3.6).* |
| 5.38 | Fahrzeugaufbereitung › Galerie | **Foto Cockpit-Detailing:** das Wischen über das Cockpit, am besten mit Schaum oder Dampf. Die vorhandenen Fotos passen eher zur allgemeinen Innenaufbereitung. | André | angefragt | 1:05:19–1:06:07 | *Für B51 („Cockpit-Detail"). Eine ausdrückliche Zusage gab es im Meeting nicht.* |
| 5.39 | Fahrzeugaufbereitung › Galerie | **Foto einer Keramikversiegelung beim Auftragen:** Sie wird mit einem kleinen Schwamm aufgetragen, „dann geht da noch so ein Nassschleier über den Lack". André macht das Foto. | André | offen | 1:06:07–1:06:54 | *Für die zusammengelegte Kachel aus 5.41. Das ist der Rest von **3.23**.* |
| 5.40 | Fahrzeugaufbereitung › Galerie | **Foto Lederpflege beim Auftragen.** Bisher gibt es nur Stoffinnenräume. Das Alcantara-Lenkrad ist eine eigene Leistung (5.8) und zählt nicht zur Lederpflege. | André | angefragt | 1:07:11–1:07:41 | *Für B54 („Lederpflege").* |
| 5.41 | Fahrzeugaufbereitung › Galerie | **„Versiegelung" und „Keramikschutz" zu einer Kachel zusammenlegen**, denn beides braucht es nicht. Ali recherchiert, welcher Begriff in der Suche stärker ist (Vermutung: Keramik). | OALAB | offen | 1:07:41–1:08:14 | *B52 und B56 (`components/DetailingGallery.tsx`). Passt zu 5.33, weil André die Keramik pushen will. Die frei werdende B-Nummer wird nicht neu vergeben (`npm run bilder`).* |
| 5.42 | Fahrzeugaufbereitung › Galerie | **Foto Endkontrolle:** ein Mitarbeiter prüft den Lack eines fertigen Fahrzeugs. André: „Das arbeite ich dir dann auch mal noch zu." | André | offen | 1:08:14–1:08:46 | *Für B58 („Endkontrolle", nur am Desktop sichtbar).* |

## Unfallinstandsetzung und Leistungen (5.43 – 5.44)

| Nr. | Bereich / Seite | Aufgabe | Verantw. | Status | Zeitmarke | Stand im Projekt |
|---|---|---|---|---|---|---|
| 5.43 | Unfallinstandsetzung › Reparaturleistungen | **Neue Karte „Classic Cars (Old- und Youngtimer)".** Bilder: der vorhandene BMW, dazu hat André alte Porsche-Bilder. Wohnwagen und Wohnmobile ausdrücklich **nicht**: „da haben wir gar keine Ahnung davon" (eine Stoßstange lackieren ja, ein Segment tauschen nein). | OALAB (Karte, Text) · André (Porsche-Bilder) | offen | 1:10:43–1:12:47 | *2026-09-28 (Schleife 6): André liefert die Porsche-Bilder; die Karte gehört in die Unterseiten (Neu- und Reparaturlackierung bzw. Unfallinstandsetzung), nicht als Kachel auf die Startseite (44:51–45:03).* *Sektion `#reparaturleistungen` in `pages/AccidentRepairPage.tsx` (heute sieben verlinkte Karten). Es gibt keine eigene Seite für Classic Cars, das Ziel der Karte ist also noch zu klären. Die Karte braucht einen eigenständigen Text (Standard 4.5). Bestätigt 3.14 (Caravan nicht bewerben).* |
| 5.44 | Leistungen (Übersicht) | **Seite `/leistungen` inhaltlich ausbauen.** Sie ist „relativ leer" und soll die Informationen aller Leistungsseiten übernehmen; heute stehen dort u. a. Felgenreparatur und Autoglas & Scheibenfolien. | OALAB | ✅ **umgesetzt** (2026-09-27) | 1:12:47–1:13:55 | *Umgesetzt 2026-09-27 (Paket 1): `BackdropLayout` mit Werkhallenfoto, Vorteile, 13 Bildkarten in 4 Gruppen, Ablauf, FAQ, CTA — gleicher Aufbau wie Privat- und Geschäftskundenseite; beschreibende Linktexte.* *`pages/ServicesPage.tsx`, Daten aus `data/services.ts` (die einzige Quelle des Leistungskatalogs). Laut Bildinventar gehört die Seite zu denen ohne eigene Fotos.* |

---

## Entscheidungen und Abnahmen ohne neue Aufgabe

| Thema | Entscheidung | Zeitmarke | Betrifft |
|---|---|---|---|
| KI-Kennzeichnung | Bleibt an jedem betroffenen Bild, weil es Pflicht ist. André akzeptiert das; sie soll nur dezenter werden (5.3). | 3:13–3:46 | R15 |
| Aussparung oben rechts, Suche | Vorgestellt ohne Einwände: Telefon mit Live-Status (7–18 Uhr, am Wochenende ausgegraut), „Schaden melden" → reparatur.info, globale Suche. | 12:01–13:23 | — |
| Lackiervideo Startseite | Bleibt auf der Karte „Neu- und Reparaturlackierung" („Das ist gut."). | 14:50–14:59 | B11, B112 |
| Felgenfoto | Die beschädigte Cupra-Felge bleibt: „das ist schon realistisch und das zeigt auch das Maximum" (gedreht, mehrfarbig, matt). | 17:12–17:48 | 3.28 entfällt |
| Autoglasfoto | Bleibt, mit der Plakette „KI-bearbeitet" (5.9). | 18:03–18:25 | — |
| Sticky-Scroll | Die gepinnten Abläufe bleiben. | 21:34–24:08 | 3.1, 5.13 |
| FAQ und Kontaktsektion | Bleiben auf den Seiten („die wir sowieso drin haben müssen"). | 32:18–32:40 | Kundenvorgaben in `CLAUDE.md` |
| Aufbereitungsformular | Es bleibt eine Anfrage, keine Buchung, also keine Anbindung an PDR oder einen Kalender. Die Leasingrückgabe bleibt wählbar. | 36:19–37:32 | 5.19 |
| Empfänger der Formulare | Geschäftskundenanfragen gehen an Andrés persönliche Adresse, Aufbereitungsanfragen weiter an info@ („ist korrekt so"); eine eigene Adresse vielleicht später. | 41:18–42:44 | 2.24, R10 |
| Preise in der Anfrage | Werden nicht mitgeschickt, die Angabe auf der Website genügt. | 58:06–58:36 | — |
| Sternchen-Fußnote (Aufpreise) | Deutlich genug („das passt"). | 1:00:34–1:00:55 | 4.7 abgenommen |
| Swissvax statt Swizöl | Richtig so. | 1:00:55–1:01:02 | 4.4 abgenommen |
| Keramik als Formularfeld | Kein eigenes Feld; die Keramik wird stattdessen in der Lackaufbereitung gestärkt (5.33). | 1:01:44–1:02:07 | — |
| Außen- vs. Lackaufbereitung | Die Abgrenzung ist bestätigt (5.36). | 1:03:30–1:04:35 | 4.8 abgenommen |
| Transporterreinigung | Wird nicht gesondert erwähnt („nö"); eine eigene Sektion bleibt eine Idee. | 1:09:06–1:09:25 | Ideen |
| Caravan | Nicht bewerben, nicht reparieren. | 1:11:10–1:11:54 | 3.14 bestätigt |
| Karriere-Titelbild | Keines, bewusst „ganz clean". | 48:51–49:20 | — |
| Offene Stellen | Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker; der Serviceberater bleibt ausgegraut, damit er sich schnell wieder aktivieren lässt. Entspricht dem heutigen Stand in `data/jobs.ts`. | 49:20–50:00 | 1.24 |
| Änderungen nach dem Livegang | Innerhalb von 24 Stunden laut Servicevertrag, meist schneller. | 52:24–53:13 | — |
| Kundenmix | Laut André etwa je ein Drittel, nicht überwiegend Schadensteuerung. | 1:10:42 | Info für Texte |
| Wissensdatenbank | Kommt bewusst erst nach dem Livegang. | 1:15:44 | 3.22, 5.2 |

## Was Schleife 5 in den anderen Listen bewirkt

🔁 = in einem Punkt von Schleife 5 aufgegangen, dort gestrichen (die Aufgabe ist nicht erledigt,
sie wird nur noch an einer Stelle geführt).

| Liste | Punkt | Wirkung | durch |
|---|---|---|---|
| Schleife 1 | 1.18 | 🔁 identisch mit 2.26 | 5.20 |
| Schleife 1 | 1.22 | Anhang kommt mit | 5.29 |
| Schleife 1 | 1.26 | 🔁 Teil „Mitarbeiterstimmen"; Benefits bleiben offen | 5.28 |
| Schleife 2 | 2.2 | 🔁 Galerie | 5.37 |
| Schleife 2 | 2.7, 2.8 | 🔁 Slogan, die Vorgaben sind übernommen | 5.4 |
| Schleife 2 | 2.24 | Empfänger bestätigt | Entscheidungen |
| Schleife 2 | 2.26 | 🔁 Teilliste im Meeting | 5.20 |
| Schleife 3 | 3.6 | 🔁 Galerie | 5.37 |
| Schleife 3 | 3.10 | 🔁 Smart-Repair-Foto | 5.6 |
| Schleife 3 | 3.11 | ⚠️ wieder offen, das Motiv hat André abgelehnt | 5.10 |
| Schleife 3 | 3.14 | bestätigt | Entscheidungen |
| Schleife 3 | 3.16, 3.31 | 🟨 dazu VW und Audi (nur Link) | 5.16 |
| Schleife 3 | 3.19 | 🔁 neu: Foto optional, weiter ohne Namen | 5.28 |
| Schleife 3 | 3.22 | bestätigt: nach dem Livegang | 5.2 |
| Schleife 3 | 3.23 | 🔁 teilweise geliefert | 5.37, 5.39 |
| Schleife 3 | 3.25 | ✅ geliefert (weißer Macan) | Einbau 5.6 |
| Schleife 3 | 3.27 | ✅ geliefert (Dellentechniker am Dach) | Einbau 5.7 |
| Schleife 3 | 3.28 | ✅ entfällt, das Felgenfoto bleibt | Entscheidungen |
| Schleife 3 | 3.30 | ✅ freigegeben (WINTEC, ISO 9001, 30 Jahre Garantie) | Rückfrage beantwortet |
| Schleife 3 | 3.32 | ✅ beantwortet | 5.26 |
| Schleife 3 | 3.36 | 🔁 Slogan | 5.4 |
| Schleife 4 | 4.1 | ✅ entfällt (Entscheidung des Users) | Rückfrage beantwortet |
| Schleife 4 | 4.4, 4.7, 4.8 | ✅ abgenommen | Entscheidungen, 5.32, 5.36 |
| Schleife 4 | 4.14 | ✅ erledigt durch die Bereichsvideos (R18) | Rückfrage beantwortet |
| Schleife 4 | 4.19 | ✅ beantwortet: 2017 | 5.24 |
| Repo-Befunde | R1 | ✅ das letzte Jahr ist geliefert | 5.24 |
| Repo-Befunde | R4 | 🟨 bestätigt, die Eckdaten fehlen | 5.26 |
| Repo-Befunde | R5 | 🟨 die Telefonnummer ist geklärt | 5.30 |
| Repo-Befunde | R9 | 🔁 für Bewerbungen | 5.29 |
| Repo-Befunde | R10 | Empfänger bestätigt | Entscheidungen |
| Repo-Befunde | R15 | ✅ alle Fotos geklärt (03.10., Herkunftsbogen) | 5.9 |
| Querschnitt | Partnerlogos | 🟨 dazu VW und Audi (nur Link) | 5.16 |
| Querschnitt | Footer-Icons 1,00:1 | beim Verkleinern mitentscheiden | 5.21 |
| Querschnitt | T4 | mitentscheiden | 5.17 |

**Schleife 4 ist damit abgeschlossen**; 4.19 wird mit 5.24 umgesetzt.

## Nicht besprochen und weiter offen

Für den Termin am 28.09.: **R5** (Handwerkskammer, berufsrechtliche Regelung,
Verbraucherstreitbeilegung) · **R6** Datenschutzerklärung · **R10** Formulartest mit
Empfangsnachweis · **R3** Erklärtexte für sieben Leistungsseiten · **R7** Vorschaubild ·
**1.26** Benefits · **2.18** Transparenz Schadenaufnahme · **2.27** Jobbörsen · **3.13**
LKW- und Busverglasung · **3.37** „Bildtechnisch noch was ändern" · Betriebsferien für den
Live-Status (`data/oeffnungszeiten.ts`, `BETRIEBSRUHE`) · Instagram-Beispiele (ohne
Schleifenzuordnung).

## Bringschuld André (gebündelt)

- **Texte:** Slogan (5.4) · vollständige Liste der Zusatzleistungen (5.20) · Mitarbeiterstimmen
  (5.28, ✅ geliefert und eingesetzt am 02.10.)
- **Fotos der Mitarbeitenden zu ihren Stimmen** (5.28), je mit schriftlicher Einwilligung
- **Fotos:** Schadenaufnahme (5.12) · Transporter (5.15) · junge Lackiererin (5.27) ·
  Heißvernebelung (5.35) · Cockpit (5.38) · Keramikversiegelung (5.39) · Lederpflege (5.40) ·
  Endkontrolle (5.42) · alte Porsche-Bilder für Classic Cars (5.43)
- **Gemeinsam:** Test reparatur.info → PDR-Kalender (5.22)
- **Vor dem Livegang:** Impressumsangaben und Datenschutzerklärung (R5, R6)

## Rückfragen

**An den User — am 25.09. beantwortet:**
1. **5.13:** Der Überspringen-Knopf wird gebaut.
2. **4.14:** Erledigt, die drei Bereichsvideos decken den Wunsch nach dem ganzen Film ab.
3. **3.30:** Die Autoglas-Angaben sind freigegeben (WINTEC-Partner, ISO 9001, 30 Jahre Garantie); WINTEC bleibt an allen 18 Stellen.
4. **4.1:** Die Felgenretusche am Startbild ist gestrichen.

**An André (28.09.):** Impressum und Datenschutz (R5, R6) · Jahr 2017 für Meilenstein 3
bestätigen, zweiten Teil von 4.19 mitnehmen? · Betriebsferien · LKW- und Busverglasung (3.13) ·
Wünscht er echte Fotos der Mitarbeitenden statt KI-Menschen (Grundsatz zu 5.9)?

## Ideen für später

- **QR-Code auf künftigen Flyern**, der direkt zur Anfrage führt, damit Kunden nicht nur lesen, sondern gleich anfragen können (40:37).
- **Sektion „Transporterreinigung"**: warum sie sich lohnt, welche Vorteile sie hat, dazu der Aufpreis von 50 % (1:09:25).
- **Mehr Inhalt zur Farbtonfindung** auf den Unfall- und Lackseiten; bisher „fürs Erste zu viel", passt aber zu 3.2 (Wissensbeiträge) (1:10:06).

## Vorschlag zur Umsetzung

| Paket | Punkte | Voraussetzung |
|---|---|---|
| **Texte und Daten** | 5.9, 5.19 offen · ✅ 5.16, 5.18, 5.24, 5.26, 5.30, 5.31, 5.32, 5.33 (2026-09-27) | keine; danach `npm run meta` |
| **Darstellung** | 5.3, 5.5, 5.21 offen · ✅ 5.13, 5.25 (2026-09-27) | danach `npm run kontrast`, `npm run shots` |
| **Bilder aus vorhandenen Lieferungen** | 5.6, 5.7, 5.8, 5.10, 5.11, 5.14 (Zwischenlösung), 5.23, 5.34, 5.36, 5.37, 5.41 | danach `npm run images`, `npm run build`, `npm run bilder` |
| **Neue Bausteine** | 5.43 offen · ✅ 5.17, 5.29, 5.44 (2026-09-27), 5.20 (2026-09-28), 5.28 Foto-Option (2026-10-02) | — |
| **Vor dem Livegang zwingend** | R5, R6, R10, 5.1 · ✅ die sichtbaren Platzhalter: 5.24 (2026-09-27), 5.20 (2026-09-28), 5.28 Stimmen (2026-10-02); seitdem nennt `check-dummies` keinen anerkannten Platzhalter mehr | R5 und R6 von André |
| **Wartet auf André** | 5.4, 5.12, 5.15, 5.20 (Rest), 5.22, 5.27, 5.28 (Fotos), 5.35, 5.38–5.40, 5.42, 5.43 (Bilder) | Termin 28.09. |

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-4.md` · `docs/backlog/offene-punkte-konsolidiert.md` ·
`docs/bilder/README.md` · Import: `docs/backlog/tasks/2026-09-25-schleife-5-import-tasks.md`
