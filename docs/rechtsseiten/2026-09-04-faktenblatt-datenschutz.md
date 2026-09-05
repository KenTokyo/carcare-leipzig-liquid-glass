# Technisches Faktenblatt zur neuen Website

**Für:** den Datenschutzbeauftragten der BS CarCare GmbH
**Gegenstand:** `carcare-center.vercel.app` — Neuaufbau der Website, noch nicht öffentlich
**Stand:** 2026-09-04
**Erstellt von:** OALAB (technische Umsetzung)

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

### ⚠️ Anhänge werden weiterhin nicht übertragen

Die Upload-Felder für Schadenbilder und den Lebenslauf sind im Formular vorhanden, ihr
Inhalt wird aber **nicht** mitgesendet. Grund ist eine technische Grenze: Der
Anfragekörper einer solchen Funktion ist auf wenige Megabyte begrenzt, während
Handyfotos oft 3–8 MB je Bild wiegen. Ein Versand, der bei großen Dateien scheitert,
wäre schlechter als keiner — er sieht für den Absender wie ein Erfolg aus.

Das Formular weist darauf hin, dass Bilder und Unterlagen per E-Mail nachgereicht werden
können. Sobald das anders gelöst wird (interne Aufgabe 3.37), ändert sich die Datenlage
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

## 4. Speicherung im Browser des Besuchers

Es werden **keine Cookies** gesetzt. Es gibt zwei Einträge im `sessionStorage` — sie
gelten nur für das laufende Browserfenster und sind beim Schließen fort. Kein Eintrag
enthält eine Kennung, mit der sich jemand wiedererkennen ließe; beide speichern lediglich
den Wert „schon gesehen".

| Schlüssel | Zweck | Inhalt |
|---|---|---|
| `cc-preloader-v1` | Die Startanimation wird nur beim ersten Aufruf gezeigt | `"1"` |
| `cc-stellen-popup-geschlossen` | Ein geschlossener Stellenhinweis kommt nicht sofort wieder | `"1"` |

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
