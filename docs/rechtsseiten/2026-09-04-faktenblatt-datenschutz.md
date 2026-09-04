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
| Serverseitige Anwendungslogik | **keine** — es werden ausschließlich vorgefertigte statische Dateien ausgeliefert |

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

### ⚠️ Wichtig zum heutigen Stand: es wird nichts übertragen

**Derzeit verlässt kein Formulardatum den Browser.** Die Absendefunktion setzt lediglich
eine Bestätigungsansicht; im gesamten Projekt gibt es keinen einzigen Netzwerkaufruf
(kein `fetch`, kein `XMLHttpRequest`, kein `sendBeacon`). Die eingegebenen Daten
verbleiben im Arbeitsspeicher des Browsers und sind mit dem Schließen der Seite fort.

Der Versandweg wird **später** eingerichtet (interne Aufgabe 1.17). Erst damit entsteht
eine Verarbeitung. Beim Bewerbungsformular ist der Absendeknopf bereits jetzt sichtbar
deaktiviert und nennt Telefon und E-Mail als Weg; die drei übrigen Varianten zeigen die
Bestätigung ohne tatsächlichen Versand — das wird mit 1.17 mitbehoben.

**Für Sie heißt das:** Die Datenschutzerklärung muss den Zustand **nach** 1.17
beschreiben, und beides muss gemeinsam scharf gestellt werden. Eine Erklärung, die einen
Versandweg beschreibt, den es noch nicht gibt, wäre derselbe Fehler wie der Matomo-Satz —
nur in die andere Richtung.

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
- Stand des Auftragsverarbeitungsvertrags und der Unterauftragsverarbeiter
- Empfängeradresse und Übertragungsweg der Formulare nach 1.17 (E-Mail? Postfach? Dritter Dienst?)
- Aufbewahrungsfristen für Anfragen und für Bewerbungsunterlagen
- Zuständige Aufsichtsbehörde in der heute korrekten Bezeichnung — im Seitenfuß stand
  bisher eine Angabe, die ich nicht verifizieren konnte, deshalb ist sie entfernt
- Ob der Wissensbereich der Website als journalistisch-redaktionelles Angebot im Sinne
  des § 18 Abs. 2 MStV gilt und deshalb ein Verantwortlicher zu benennen ist

---

## 7. Zusammenfassung in drei Sätzen

Die neue Website ist eine rein statische Seite ohne Cookies, ohne Analyse- oder
Werbewerkzeuge und ohne eine einzige Einbindung von einem fremden Server. Personenbezogene
Daten entstehen ausschließlich dort, wo jemand ein Formular ausfüllt — und selbst das
wird derzeit noch nicht übertragen. Zu klären sind daher im Wesentlichen zwei Dinge: der
Hoster als Auftragsverarbeiter und der künftige Weg der Formulardaten.
