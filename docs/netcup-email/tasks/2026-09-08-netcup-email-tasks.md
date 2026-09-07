# Netcup-Formularversand und gestaltete E-Mails

## Abnahmekriterien
- Nur Geschäftskundenanfragen gehen über carcare.center.business@oalab.de an abosse@carcare-center.de.
- Schaden, Termin und Bewerbung gehen über carcare.center.info@oalab.de an info@carcare-center.de.
- E-Mail enthält alle erfassten Angaben, lesbare Auswahlwerte, Vorgangsnummer und direkte Antwortmöglichkeit. Mobil lesbar, auch ohne Bilder.
- Fehler führen zu keiner falschen Versandbestätigung. SMTP-Annahme und tatsächlicher Eingang werden getrennt bewertet.
- Deployment unter carcare-center.vercel.app prüfen; keine Zugangsdaten ins Repository.

### Phase 1 — Bestand und Einrichtung
* [x] Vorhandenen Handler, gemeinsames Schema, Formular und Backlog 1.17/2.24 geprüft. Keine weitere parallele Formularimplementierung erforderlich.
* [x] Resend-HTTP, Netcup-SMTP und reine Weiterleitung verglichen: Netcup-SMTP nutzt das vom Nutzer eingerichtete Postfach und braucht kein zusätzliches Resend-Konto.
* [x] SMTP-Host mxe989.netcup.net, TLS-Port 465 im WCP verifiziert.
* [x] Beide Weiterleitungen im WCP bestätigt. Business ohne Postfach und zusätzlichen Plesk-Login angelegt; Info behält zunächst Kopien für Eingangstests.

### Phase 2 — Umsetzung
* [x] Gemeinsame React-Email-Vorlage für vier Anfragearten mit Klartextalternative, Textmarke, Kontaktdaten, Vorgangsnummer und Antwort-Button.
* [x] SMTP-Versand, sichere Validierung und verbindliche Empfängertrennung. SMTP-TLS und Anmeldung real verifiziert.
* [x] Formularstatus und direkte Kontaktwege angepasst. Geschäftskunden reichen Unterlagen an die Geschäftsführung nach; Fehler und Vorgangsnummer werden beim Formularwechsel zurückgesetzt.

### Phase 3 — Prüfung und Deployment
* [x] Routing aller vier Arten, Reply-To, lesbare Auswahlwerte, Fehler, HTML-Escaping, Body-Limit, unbekannte Felder und fehlende Business-Konfiguration geprüft (`npx tsx scripts/test-email.tsx`). Tests verwenden Mock-SMTP und sind kein Zustellnachweis.
* [x] Geschäftskunden-Mail am Desktop und bei 390 px mobil fachlich bewertet: klare Hierarchie, vollständige Nachricht, lesbare Daten, sichtbarer Antwort-Button. Gemeinsame Vorlage für alle Varianten. Dies ist ein Browser-Render, kein Outlook-/Gmail-Zustellnachweis.
* [ ] Build, Deployment, vier Formulararten und reale Testmails prüfen.
* [ ] Weiterleitungseingang nachweisen oder konkrete Nachweislücke dokumentieren.

## Referenzen
api/anfrage.ts
components/RequestForm.tsx
data/anfrageSchema.ts
https://react.email/templates
https://react.email/docs/utilities/render
https://nodemailer.com/smtp

## Kommentare
Status: in Arbeit. Technischen Nachtrag im Datenschutz-Faktenblatt ergänzt. Keine rechtliche Abnahme behaupten.

### Phase 1 und 2
**Eingehalten:** bestehende Formularlogik erweitert, keine Duplikate, unter 700 Zeilen pro Datei, serverseitige Secrets, TLS, keine personenbezogenen Versandlogs.
**Befunde:** Mobiler Überschriftenüberlauf in der Geschäftskunden-Mail gefunden und mit bedingten Trennstellen behoben; DOM-Messung bei 390 px: clientWidth = scrollWidth = 375 px. Alte Schadenbilder-Aufforderung und Info-Adresse für Geschäftskunden korrigiert. Fünf behebbare Entwicklungsabhängigkeiten mit kompatiblem `npm audit fix` aktualisiert; danach null gemeldete Schwachstellen. Node-24-Build mit 29/29 vorgerenderten Routen und nachgelagerten Inhaltsprüfungen bestanden.

## Betriebsdaten
- SMTP-Host: mxe989.netcup.net, Port 465 mit TLS.
- SMTP-Login und Absender: carcare.center.info@oalab.de; Passwort ausschließlich in lokaler ignorierter `.env.local`, Nutzer-Accountdatei und Vercel-Secrets.
- Sieben Vercel-Variablen als Secrets ausschließlich für Production gespeichert; Vorschau-Branches senden ohne gesonderte Konfiguration keine E-Mail.
- Plesk-Business-Adresse dient nur der Weiterleitung, kein Postfach/SMTP-Login. Das vom WCP auch hierfür verlangte Zufallspasswort wird für den Betrieb nicht benötigt und wurde nicht ausgelesen.
