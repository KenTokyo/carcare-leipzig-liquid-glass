# Technisches Faktenblatt zur neuen Website

**Für:** den Datenschutzbeauftragten der BS CarCare GmbH
**Gegenstand:** `carcare-center.vercel.app` — Neuaufbau der Website, noch nicht öffentlich
**Stand:** 2026-09-04
**Erstellt von:** OALAB (technische Umsetzung)

**Technischer Nachtrag 2026-09-08:** Der aktuelle Formularversand verwendet Node.js bei Vercel und Netcup-SMTP (TLS, Port 465), nicht mehr Resend. Geschäftskunden werden über `carcare.center.business@oalab.de` an `abosse@carcare-center.de`, alle anderen Anfragen über `carcare.center.info@oalab.de` an `info@carcare-center.de` weitergeleitet. Die folgenden Resend-Angaben dokumentieren den früheren Entwurf; aktuelle Datenflüsse, Postfachkopien und Prüfstatus stehen in [Netcup-Versand](../netcup-email/tasks/2026-09-08-netcup-email-tasks.md). Dies ersetzt keine rechtliche Abnahme.

**Technischer Nachtrag 2026-09-16:** „Schaden melden" führt jetzt auf die Schadenseite des Betriebs bei **reparatur.info** (Anwendung der PDR.cloud GmbH) — neuer Abschnitt **3a**. Das eigene Schadenformular der Website ist abgeschaltet. Dazu kommen **ausgehende Links** zu Partnern und zum BVAT — Abschnitt 2, Sonderfall 3.

**Technischer Nachtrag 2026-09-27:** Das **Bewerbungsformular überträgt jetzt Anhänge** (Backlog 5.29): bis zu drei
Dateien, zusammen höchstens 3 MB, nur PDF, DOC/DOCX, ODT, JPG oder PNG (geprüft an der Dateisignatur). Die Dateien
gehen im Anfragekörper an die Vercel-Funktion und von dort als **Anhang der Benachrichtigungs-E-Mail** über den
Netcup-Versand an `info@carcare-center.de` — **keine Speicherung** auf dem Server, keine Speicherdienste. Bewerbungsunterlagen
sind besonders schutzbedürftig (Beschäftigtendatenschutz): Die Datenschutzerklärung muss diesen Weg, Zweck und
Löschfristen im Postfach nennen. Abschnitt 3, „Anhänge", ist entsprechend angepasst.

**Nachtrag 2026-10-04:** Die Datenschutzerklärung steht jetzt als Volltext auf `/datenschutz`, geschrieben aus diesem Blatt
und den Vorgaben des Users (Plan: `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md`). Ihre Prüfung steht aus.
**Neu gemessen:** Die Seiten kommen aus Frankfurt, die **Formularfunktion läuft aber in den USA** (`X-Vercel-Id: fra1::iad1::…`
auf `/api/anfrage`, Vercel-Standardregion Washington, D.C., keine `regions` in `vercel.json`). Abschnitt 1 nannte nur die
Auslieferung. **Später am 04.10. (User):** Die Website wird über die **KUPPER IT GmbH**, Prager Straße 15, 04103 Leipzig,
gehostet, ebenso Domain und E-Mail-Postfächer; die Erklärung nennt deshalb KUPPER IT als Hoster und Vercel nicht mehr. Die
Messung oben betrifft die Vorschau auf Vercel. Läuft der Formularversand (`/api/anfrage`, eine Vercel-Funktion) weiter bei
Vercel, gehört Vercel als Empfänger zurück in die Erklärung.

---

## Wozu dieses Blatt

Dieses Blatt beschreibt, **was die neue Website technisch tut**, damit die
Datenschutzerklärung daraus geschrieben werden kann. Es ist ausdrücklich **keine**
Datenschutzerklärung und enthält **keine** rechtliche Bewertung — die Einordnung
(Rechtsgrundlagen, Löschfristen, Informationspflichten) liegt bei Ihnen.

Alle Angaben sind am gebauten und ausgelieferten Stand **gemessen**, nicht aus einer
Vorlage übernommen. Wo eine Angabe nicht aus dem Code belegbar ist, steht das dabei.

**Anlass, das ausdrücklich zu sagen:** Im Seitenfuß der neuen Website stand bis zum
2026-09-04 der Satz „Anonymisierte Webanalyse via Matomo, gemäß DSGVO". Es gibt kein
Matomo und hat auf dieser Website nie eines gegeben. Der Satz war aus der
Datenschutzerklärung des alten Auftritts übernommen worden — wo seit dem 25.05.2018
selbst vermerkt ist, dass kein Tracking mehr stattfindet. Er ist entfernt. Die alte
Datenschutzerklärung von 2020 wird aus demselben Grund **nicht** übernommen: Sie
beschreibt einen anderen Hoster, nennt Matomo und kennt die heutigen Formulare nicht.

---

## 1. Hosting

| | |
|---|---|
| Plattform | Vercel (`Server: Vercel` im Antwort-Header) |
| Betreiber | Vercel Inc., Unternehmen mit Sitz in den USA |
| Auslieferungsregion | `fra1` (Frankfurt am Main), aus `X-Vercel-Id` aller Antworten |
| Transportverschlüsselung | HTTPS erzwungen, HSTS `max-age=63072000; includeSubDomains; preload` |
| Eigene Datenbank | **keine** |
| Serverseitige Anwendungslogik | **eine** serverlose Funktion für den Formularversand (siehe Abschnitt 3); alles übrige sind vorgefertigte statische Dateien |
| Weiterer Auftragsverarbeiter | **Resend** (Mail-Versand), Resend Inc., Unternehmen mit Sitz in den USA |

**Was ich nicht aus dem Code belegen kann und was Sie beim Hoster prüfen müssen:**
Umfang und Aufbewahrungsdauer der Server-Logdateien, die Liste der Unterauftragsverarbeiter
und der Stand des Auftragsverarbeitungsvertrags. Die Website selbst schreibt keine Logs
und legt nichts ab; was auf Plattformebene protokolliert wird, bestimmt Vercel.

Die US-Ansässigkeit des Anbieters bei gleichzeitiger Auslieferung aus Frankfurt ist die
Konstellation, die Sie bewerten müssen — ich stelle sie nur fest.

---

## 2. Was beim bloßen Seitenaufruf passiert

Der Browser lädt HTML, eine CSS-Datei, JavaScript-Dateien, Bilder und zwei Schriftdateien —
**alle vom selben Host**. Es entsteht keine Verbindung zu einem Dritten.

Gemessen am ausgelieferten HTML aller Seiten:

| Prüfung | Ergebnis |
|---|---|
| `Set-Cookie` in den Antworten | **keine**, geprüft auf `/`, `/karriere`, `/kontakt` |
| Analyse-/Tracking-Werkzeuge (Matomo, Google Analytics, Piwik, `_paq`) | **keine**, weder im HTML noch im JavaScript-Bundle |
| Werbe- oder Retargeting-Pixel | **keine** |
| Einbindungen von Fremdhosts (`img`, `link`, `script`, `source`) | **0** |
| Schriftarten | self-hosted (`Space Grotesk`, zwei `.woff2`-Dateien vom eigenen Host), **kein** Google Fonts |
| Eingebettete Karte (Google Maps, OpenStreetMap) | **keine** |
| Eingebettete Videos, Social-Media-Plugins | **keine** |
| Einwilligungsbanner | **keines** — mangels einwilligungsbedürftiger Vorgänge |

### Zwei Sonderfälle, die nach außen aussehen und es nicht sind

1. **Unsplash.** In den Metadaten jeder Seite (`og:image` und die strukturierten Daten)
   steht eine Bildadresse bei `images.unsplash.com`. Der Browser des Besuchers ruft sie
   **nicht** ab — sie ist reine Angabe für Suchmaschinen und für Vorschaubilder beim
   Teilen. Gemessen: 0 Elemente laden von diesem Host.
2. **Karten-Links.** Auf Mobilgeräten gibt es Schaltflächen „Google Maps" und „Apple
   Karten". Das sind **ausgehende Links**, keine Einbettungen. Es fließt erst etwas ab,
   wenn der Besucher sie bewusst antippt.
3. **Partner- und Verbandslinks (seit 2026-09-16).** riparo (`riparo.de`), Porsche Zentrum
   Leipzig (`porsche-leipzig.de`) und der BVAT (`bvat.de`) sind verlinkt. Wie bei den
   Karten-Links: **ausgehende Links, keine Einbettung.** Die Logos liegen **auf dem eigenen
   Host** (`/assets/partner/`) — beim Seitenaufruf geht keine Anfrage an einen Partner.
   Alle externen Links tragen `rel="noopener noreferrer"`: Der Browser sendet dem Ziel
   **keinen Referer**, der Partner erfährt also nicht, von welcher Unterseite jemand kommt.

---

## 3. Formulare

Es gibt vier Formularvarianten auf drei Seiten:

| Variante | Wo |
|---|---|
| Schaden melden, Aufbereitungstermin, Geschäftskunden | Startseite `/` und `/kontakt` (drei Reiter) |
| Bewerbung | `/karriere` |

### Der Weg einer abgesendeten Anfrage

*Geändert am 2026-09-05. Bis dahin übertrug kein Formular etwas; die Absendefunktion
setzte nur eine Bestätigungsansicht.*

1. Der Browser sendet die ausgefüllten Felder als JSON an eine **serverlose Funktion**
   im selben Projekt (`/api/anfrage`), die bei Vercel in der Edge-Laufzeit läuft.
2. Die Funktion prüft die Pflichtangaben und übergibt den Inhalt als **E-Mail** an den
   Dienst **Resend** (HTTPS an `api.resend.com`).
3. Resend stellt die Mail an das hinterlegte Postfach zu. Als Antwortadresse
   (`Reply-To`) steht die E-Mail-Adresse des Absenders, damit eine Antwort direkt bei
   ihm landet.

**Was dabei NICHT passiert:** Es wird nichts in einer Datenbank abgelegt, nichts
zwischengespeichert und nichts an weitere Dritte gegeben. Die Funktion hält keinen
Zustand; nach dem Versand ist der Vorgang für die Website beendet. Der Inhalt liegt
danach im Postfach — und, nach den Regeln des Anbieters, zeitweise bei Resend.

**Für Sie zu klären:** Resend Inc. ist ein **US-Unternehmen** und damit ein zweiter
Auftragsverarbeiter neben Vercel. Nötig sind ein Auftragsverarbeitungsvertrag, die
Aufnahme ins Verzeichnis der Verarbeitungstätigkeiten und ein Abschnitt in der
Datenschutzerklärung. Ob Resend so bleibt, ist offen — der Versandweg steckt an einer
Stelle im Code und ist austauschbar.

**Ohne hinterlegte Zugangsdaten sendet die Website nichts.** Fehlen die
Umgebungsvariablen, meldet die Funktion das, und der Absenden-Knopf bleibt gesperrt mit
dem Hinweis auf Telefon und E-Mail. Der ehrliche Zustand ist der Ausgangszustand.

### Schutz vor automatisierten Einsendungen

Die Formulare enthalten ein für Menschen unsichtbares Feld („Honigtopf"). Füllt ein
Programm es aus, nimmt die Funktion die Anfrage entgegen und **verwirft sie
stillschweigend**, ohne eine Mail zu erzeugen. Es findet keine Auswertung des
Nutzerverhaltens statt, es wird kein CAPTCHA eingebunden und keine IP-basierte Bewertung
vorgenommen.

### Anhänge: seit 2026-09-27 nur bei der Bewerbung übertragen

**Stand 2026-09-27 (Backlog 5.29):** Die Bewerbung nimmt bis zu drei Dateien (zusammen 3 MB; PDF, Word, ODT, JPG,
PNG) und schickt sie als Anhang der E-Mail mit. Die übrigen Formulare übertragen weiterhin keine Dateien; die Funktion
weist Anhänge dort ab. Der Text darunter beschreibt den Stand bis zu dieser Änderung.

**Bis 2026-09-26:**

Die Upload-Felder für Schadenbilder und den Lebenslauf sind im Formular vorhanden, ihr
Inhalt wird aber **nicht** mitgesendet. Grund ist eine technische Grenze: Der
Anfragekörper einer solchen Funktion ist auf wenige Megabyte begrenzt, während
Handyfotos oft 3–8 MB je Bild wiegen. Ein Versand, der bei großen Dateien scheitert,
wäre schlechter als keiner — er sieht für den Absender wie ein Erfolg aus.

Das Formular weist darauf hin, dass Bilder und Unterlagen per E-Mail nachgereicht werden
können. Sobald das anders gelöst wird (interne Aufgabe R9), ändert sich die Datenlage
erneut — insbesondere für Bewerbungsunterlagen.

### Erhobene Felder je Variante

**Schaden melden**

| Feld | Pflicht |
|---|---|
| Name | ja |
| Telefon | ja |
| E-Mail | ja |
| Fahrzeug | nein |
| Schadenart (Auswahl) | nein |
| Versicherung vorhanden (Auswahl) | nein |
| Beschreibung (Freitext) | ja |
| **Bilderupload, mehrere Dateien, nur Bildformate** | nein |

**Aufbereitungstermin**

| Feld | Pflicht |
|---|---|
| Name | ja |
| Telefon | ja |
| E-Mail | ja |
| Fahrzeug | nein |
| Gewünschte Leistung (Auswahl) | nein |
| Wunschtermin (Datum) | nein |
| Beschreibung (Freitext) | nein |

**Geschäftskunden**

| Feld | Pflicht |
|---|---|
| Firma | ja |
| Ansprechpartner | ja |
| Telefon | ja |
| E-Mail | ja |
| Art der Partnerschaft (Auswahl) | nein |
| Beschreibung (Freitext) | ja |

**Bewerbung**

| Feld | Pflicht |
|---|---|
| Name | ja |
| Telefon | ja |
| E-Mail | ja |
| Bereich/Position (Auswahl) | nein |
| **Lebenslauf-Upload, eine Datei: PDF, Word oder Bild** | nein, ausdrücklich optional |
| Nachricht (Freitext) | ja |

---

## 3a. Schadenmeldung über reparatur.info (seit 2026-09-16)

Alle Schaltflächen „Schaden melden" führen auf **`https://reparatur.info/bs-carcare-gmbh`**
(neuer Tab, ohne Referer). Die Website selbst überträgt dabei **nichts** — die Daten gibt der
Besucher erst auf der Zielseite ein.

**Was die Zielseite ist** (am 2026-09-16 aufgerufen, nichts abgesendet):

| Frage | Befund |
|---|---|
| Anbieter | Anwendung der **PDR.cloud GmbH**, Attilastraße 16, 12529 Schönefeld, AG Cottbus HRB 18136 CB („Powered by PDR.cloud") |
| Wessen Seite | **Die Schadenseite von BS CarCare** — Seitentitel „BS CarCare GmbH", Text „Übermitteln Sie … die Schadensdaten **an uns**" |
| Angebotene Wege | „Schadeninformation übermitteln — Daten hochladen" und „Besichtigungstermin vereinbaren" |
| Datenarten | nach Produktbeschreibung von PDR.cloud: Schadendaten und Fotos; die genaue Feldliste zeigt sich erst im Upload-Schritt (nicht ausgefüllt) |
| Server | Die App ruft eine Cloud-Funktion in **`europe-west3`** auf (Google Cloud, Frankfurt) — beobachtet, **nicht** vom Anbieter bestätigt |
| Datenschutz-/Impressumslink | Die App lädt **je Betrieb eine eigene** Datenschutz- und Impressums-Adresse (`datenschutz_url`, `impressum_url`). Auf der Startansicht der Seite von BS CarCare war **keiner** der beiden Links sichtbar |

**Technische Einordnung, zur Prüfung durch Sie:** Die Seite tritt als Seite von BS CarCare auf
und nimmt Daten „an uns" entgegen; PDR.cloud stellt die Anwendung. Das spricht für eine
**Verarbeitung im Auftrag** von BS CarCare — dann gehören Anbieter, Zweck, Datenarten und
Speicherort in die Datenschutzerklärung, und ein Vertrag nach Art. 28 DSGVO muss vorliegen.
Das eigene Schadenformular der Website (Abschnitt 3) ist abgeschaltet, bleibt aber im Code;
die Angaben dort gelten wieder, falls es zurückgeschaltet wird.

---

## 4. Speicherung im Browser des Besuchers

Es werden **keine Cookies** gesetzt. Es gibt einen Eintrag im `sessionStorage` — er
gilt nur für das laufende Browserfenster und ist beim Schließen fort. Er enthält keine
Kennung, mit der sich jemand wiedererkennen ließe; er speichert lediglich den Wert
„schon gesehen".

| Schlüssel | Zweck | Inhalt |
|---|---|---|
| `cc-preloader-v1` | Die Startanimation wird nur beim ersten Aufruf gezeigt | `"1"` |

*Nachtrag 2026-09-28:* Der zweite Eintrag `cc-stellen-popup-geschlossen` entfällt. Der
Stellenhinweis auf `/karriere` erscheint jetzt bei jedem Aufruf und merkt sich das
Schließen nicht mehr.

`localStorage` wird bewusst nicht verwendet, damit nichts über die Sitzung hinaus bleibt.

---

## 5. Was mir dabei aufgefallen ist

Vier Punkte, die über die technische Bestandsaufnahme hinausgehen:

1. **Bilder von Unfallschäden enthalten in aller Regel das Kennzeichen**, häufig auch
   Umgebung und gelegentlich Personen. Das Schadenformular erlaubt mehrere Bilder. Sobald
   der Versand steht, ist das eine Datenkategorie, die über „Kontaktdaten" hinausgeht —
   und die der Absender oft nicht bewusst mitschickt. Vielleicht ist ein kurzer Hinweis
   direkt am Uploadfeld sinnvoll; das ist Ihre Einschätzung, ich stelle es nur fest.

2. **Bewerbungsunterlagen sind der sensibelste Datenbestand der Seite** und der einzige,
   für den es eine eigene Aufbewahrungsfrage gibt (Aufbewahrung nach Absage, Aufnahme in
   einen Bewerberpool, Umgang mit Angaben, die jemand freiwillig im Lebenslauf macht).
   Der Upload akzeptiert auch Bilddateien, also faktisch abfotografierte Zeugnisse.

3. **Der alte Auftritt nennt eine Adresse `datenschutzbeauftragter@carcare-center.de`.**
   Ob diese Rolle heute noch so besetzt ist und ob die Adresse erreichbar bleibt, konnte
   ich nicht prüfen. Falls sie in die neue Erklärung soll, wäre das vorab zu bestätigen.

4. **Der Seitenfuß trägt den Hinweis „Kofinanziert von der Europäischen Union".** Damit
   hängen eigene Publizitätspflichten zusammen, die nichts mit Datenschutz zu tun haben,
   aber gemeinsam mit den Rechtstexten vor dem Livegang stehen sollten. Nur als
   Erinnerung, falls es an derselben Stelle mitläuft.

---

## 6. Offene Fragen, die ich nicht beantworten kann

- Umfang, Speicherdauer und Zugriff auf die Server-Logdateien bei Vercel
- Auftragsverarbeitungsvertrag und Unterauftragsverarbeiter — **bei Vercel und bei Resend**
  *(Resend seit 2026-09-08 nicht mehr im Einsatz, stattdessen Netcup)*
- **Seit 2026-09-16:** Auftragsverarbeitungsvertrag mit der **PDR.cloud GmbH** (reparatur.info),
  Speicherort und Löschfristen der dort hochgeladenen Schadendaten und Fotos
- **Seit 2026-09-16:** Sind in PDR.cloud die Datenschutz- und Impressums-Adresse von BS CarCare
  hinterlegt? Auf der Startansicht der Schadenseite war keine zu sehen
- Wie lange Resend zugestellte Nachrichten vorhält
- Aufbewahrungsfristen für Anfragen und Bewerbungsunterlagen im Postfach
- Zuständige Aufsichtsbehörde in der heute korrekten Bezeichnung — im Seitenfuß stand
  bisher eine Angabe, die ich nicht verifizieren konnte, deshalb ist sie entfernt
- Ob der Wissensbereich der Website als journalistisch-redaktionelles Angebot im Sinne
  des § 18 Abs. 2 MStV gilt und deshalb ein Verantwortlicher zu benennen ist

---

## 7. Zusammenfassung in drei Sätzen

Die neue Website ist eine statische Seite ohne Cookies, ohne Analyse- oder Werbewerkzeuge
und ohne eine einzige Einbindung von einem fremden Server. Personenbezogene Daten
entstehen ausschließlich dort, wo jemand ein Formular ausfüllt und absendet; sie gehen
dann als E-Mail ins Postfach und werden nirgendwo sonst gespeichert. Zu klären sind daher
im Wesentlichen zwei Dinge: **Vercel als Hoster und Resend als Mail-Versender** — beides
US-Unternehmen, beides Auftragsverarbeiter.
