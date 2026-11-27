# Gutscheinaktion: Begrüßungs-Pop-up, Startseiten-Bereich, Anfrage in vier Schritten (OA-14)

## Improved prompt
Kundenanfrage OA-14 (BS CarCare GmbH, NoteTree Business, Projekt „Anpassung Gutschein Website“). Gutscheine anfragen statt kaufen: kein Shop, keine Online-Zahlung.
- **Pop-up beim Öffnen:** Hinweis auf Gutscheinaktion, Knopf „Gutschein anfragen“; schließbar, nicht bei jedem Seitenwechsel erneut
- **Startseiten-Bereich:** derselbe Knopf für alle, die das Pop-up weggeklickt haben
- **Anfragefenster:**
  - Schritt 1: Paket (Brillant Außenpflege, Intensiv Innenraumreinigung, Premiumpflege, große Aufbereitung) je mit Anzahl, oder Geldbetrag
  - Schritt 2: Rechnungsadresse (Vor- und Nachname, Firma optional, Straße, PLZ, Ort, E-Mail, Telefon)
  - Schritt 3: Versandadresse, Häkchen „wie Rechnungsadresse“, sonst abweichend
  - Schritt 4: Übersicht, „Versandkostenfrei“, „Sie erhalten zuerst eine Rechnung. Nach Zahlungseingang senden wir Ihnen den Gutschein per Post.“, Datenschutz-Einwilligung
- **Bestätigung:** auf der Seite und per E-Mail an Anfragende; Anfrage mit allen Angaben per E-Mail an den Betrieb
- **Rahmen:** Design der Website (Space Grotesk, Blau sparsam, Framer Motion), Textregeln aus `CLAUDE.md` (Sie, keine Gedankenstriche, geschütztes Leerzeichen vor €); nur Branch `test`, Testseite `carcare-center-test.vercel.app`, nie `main`
- **Annahmen:** „Große Aufbereitung“ im Wortlaut des Kunden; Betrag 10 bis 5.000 €; je Paket höchstens 10; Pop-up nach Schließen 14 Tage Pause; nicht auf Datenschutz, Impressum, Kontakt

### ✅ Phase 1: Daten und Versand (Backend)
* [x] `data/gutschein.ts`: Pakete, Prüfregeln je Schritt, Serverprüfung `pruefeGutschein` (eine Quelle für Formular und Funktion)
* [x] `api/anfrage.ts`: Anfrageart `gutschein` → Mail an `ANFRAGE_EMPFAENGER`, danach Bestätigung an Anfragende; scheitert nur die Bestätigung → trotzdem angenommen (`bestaetigung: false`)
* [x] `emails/GutscheinEmail.tsx`: Betrieb- und Kundenfassung; `.gitignore` für erzeugte `.js`
* [x] `scripts/test-email.tsx`: Gutschein-Fälle (zwei Mails, Paket/Betrag, ungültige Angaben, Honigtopf, Bestätigung scheitert)
**Referenzen:**
`api/anfrage.ts`
`data/gutschein.ts`
`emails/GutscheinEmail.tsx`

### ✅ Phase 2: Oberfläche (Frontend)
* [x] `components/gutschein/GutscheinDialog.tsx`: Provider in `Layout`, Pop-up nach Preloader, `#gutschein`-Links öffnen das Fenster, Fokusfalle, Escape, Lenis-Stopp, Portal an `body`
* [x] `components/gutschein/GutscheinFormular.tsx`: vier Schritte mit Fortschritt, Zähler, Betragsfeld, Versand-Häkchen, Übersicht mit „Ändern“, Einwilligung, Bestätigung mit Vorgangsnummer
* [x] `components/gutschein/GutscheinBereich.tsx` auf der Startseite nach dem Aufbereitungsablauf
* [x] Fokus beim Öffnen aufs Panel statt auf den Schließen-Knopf (kein Fokusring auf dem X)
**Referenzen:**
`components/gutschein/GutscheinFormular.tsx`
`components/gutschein/GutscheinDialog.tsx`
`components/gutschein/GutscheinBereich.tsx`

### ✅ Phase 3: Testseite und Nachweise
* [x] Branch `test` aus `origin/main`, gepusht; Vercel-Domain `carcare-center-test.vercel.app` → Branch `test`; Vercel Authentication für Vorschauen aus
* [x] Nachweisdatei `public/.well-known/notetree-business.json`; Bilder in `public/.well-known/notetree-business/oa-14-r0/` (Vorher live, Nachher Testseite, Computer und Handy, je Bereich)
**Referenzen:**
`public/.well-known/notetree-business.json`

### ✅ Phase 4: Prüfung und Prüfpaket
* [x] `npm run build` (Prerender, FAQ, Platzhalter, Gedankenstriche 0) ✅; `npm run kontrast` 6348 Stellen ohne AA-Fehler ✅; `npm run mobil` 0 harte Befunde ✅; `npm run zeichnen -- /` 0 Befunde ✅
* [x] Bilder je Bereich: Pop-up (Vorher live / Nachher Test, Computer + Handy), Gutschein-Bereich (neu, Computer, Handy in zwei Teilen), Anfragefenster Schritt 1 bis 4 (neu, Computer + Handy); frühere Bilder unverändert
* [x] Kundentext als Entwurf in NoteTree Business, nicht gesendet
**Referenzen:**
`public/.well-known/notetree-business/oa-14-r0/`

### ✅ Phase 5: Testseiten-Link für den Kunden sichtbar
**Ziel:** Kunde sieht im Service-Ticket OA-14 keinen Link zur Testseite → beheben
* [x] **Ursache:** erste Automatik-Runde endete mit Fehler → Automatik „blockiert“; weitere Arbeit direkt im Chat → Worker übernahm Ergebnis-JSON nie
  - keine Testdomain am Projekt (`customer_projects.test_url` leer)
  - veröffentlichte Antwort nur Text (`draft.save` kennt keinen Anhang) → kein Link, keine Bilder, kein „Gefällt mir“
* [x] Testdomain `https://carcare-center-test.vercel.app` am Hub-Projekt „Anpassung Gutschein Website“ eingetragen (Hub-Werkzeug `update_project`) → Service-Kopfzeile und Ticket-Details zeigen „Testseite“
* [x] `work.result` mit Vorschau-Anhang (Link, Commit `eb79c7d`, Prüfungen, 17 Bilder: Pop-up Vorher/Nachher Computer + Handy, Gutschein-Bereich und Schritte 1 bis 4 neu) über `notetree-tanstack/scripts/business-operator.ts`
* [x] Ergebnis per `draft.publish` im Kunden-Chat veröffentlicht; Benachrichtigungs-Mail eingeplant
* [x] Geprüft: Datenbank-Nachricht sichtbar für Kunde mit Anhang; Anhang gegen `TicketDeliverySchema` der Service-App gültig; alle 17 Bilder laden im Browser (Breite > 0)
* [ ] Service-Ansicht als Bild: nicht geprüft (Hub-Anmeldung verlangt Mail-Code, Postfach-Server per IMAP gerade nicht erreichbar)
**Referenzen:**
`notetree-tanstack/scripts/business-operator.ts`
`service-oalab/apps/web/server/client-projects.ts`
`service-oalab/apps/web/features/client-workspace/chat/request-chat.tsx`

### ✅ Phase 6: Pop-up-Hintergrund dunkler (Kundenwunsch r1)
* [x] `GutscheinDialog.tsx`: Hintergrund radialer Verlauf Carbon 66 → 88 %, `backdrop-blur-md`; Bilder `oa-14-r1/vorher|nachher-popup-*`
* [x] Kundenantwort mit Vorschau-Anhang veröffentlicht
* [x] Automatik blockierte: Nachweisdatei als `.well-known/…` statt `public/.well-known/…` gemeldet → NoteTree-Worker sucht Nachweisdatei auch in `public/`, `static/`, `www/` (`notetree-tanstack` `business/worker/src/delivery-verification.ts`, Test, wirkt nach nächstem NoteTree-Start)
**Referenzen:**
`components/gutschein/GutscheinDialog.tsx`
`notetree-tanstack/business/worker/src/delivery-verification.ts`

### ✅ Phase 7: Anfragefenster feste Höhe, Pop-up erneut zeigen
**Ziel:** Fenster springt zwischen Schritten (Handy 781/902/370/997 px) → gleichbleibende Höhe; Pop-up für Abnahme wiederholbar
* [x] Feste Höhe: Handy `88dvh`, Computer `min(50rem, 100dvh − 3rem)`; Kopf, Fortschritt, Knopfleiste fest, Inhalt scrollt innen (`data-lenis-prevent`, `overscroll-contain`), beginnt je Schritt oben; Fehlerliste wird ins Bild gescrollt
* [x] Weicher Auslauf unten → sichtbar, dass Schritt 4 weitergeht
* [x] `?gutschein-hinweis` zeigt Pop-up trotz 14-Tage-Pause (Abnahme, Vorführen)
* [x] Geprüft Testseite: Höhe je Schritt gleich (Computer 800, Handy 743), Pop-up 1. Besuch ja, nach Schließen nein, mit Parameter ja; Build mit Prerender grün
* [x] Bilder `oa-14-r1/vorher|nachher-schritt1–4-computer|handy.webp`
* [x] Kundenantwort mit Vorschau-Anhang (Commit `5bb8a1b`, 16 Bilder Schritt 1–4 Vorher/Nachher Computer + Handy, Link `?gutschein-hinweis`) per `work.result` + `draft.publish` veröffentlicht; Benachrichtigungs-Mail an Kunden eingeplant
**Referenzen:**
`components/gutschein/GutscheinFormular.tsx`
`components/gutschein/GutscheinDialog.tsx`

### ✅ Phase 8: Pop-up bei jedem Startseiten-Aufruf, Seitenleiste, Bild Außenaufbereitung (Kundenwunsch r2)
**Ziel:** Pop-up immer beim Aufruf der Startseite; geschlossen → schwebende Leiste rechts „Hier Gutschein kaufen“ mit Pfeil, auf allen Seiten; Bild → Außenaufbereitung
* [x] `GutscheinDialog.tsx`: 14-Tage-Pause (`localStorage`) entfernt; Pop-up bei erstem Laden der Startseite (nach Preloader), `carcare:navigate`, `popstate`, neuem `carcare:startseite` (Logo-Klick auf der Startseite, `Navbar.tsx`)
* [x] `GutscheinSeitenleiste.tsx` neu: ab `lg`, rechts mittig, Verlaufsknopf, Pfeil stupst in Abständen nach links, öffnet Anfragefenster; auf Startseite erst nach dem Pop-up, auf Unterseiten sofort; nie im Prerender (`navigator.webdriver`) → nicht im Suchindex
  - Pop-up gleitet beim Schließen (ab `lg`) nach rechts zur Leiste, Leiste federt ein
  - Annahme: „Web-Ansicht“ = Computer; Handy ohne Leiste (dort Aktionsleiste unten)
* [x] Bild Popup + Startseiten-Bereich: Kachel Außenaufbereitung (B46, `aussenaufbereitung-fahrzeugwaesche-leipzig-carcare.webp`), Alt-Text angepasst
* [x] Geprüft: Typprüfung ✅, Build mit Prerender ✅ (Leiste nicht im HTML), `npm run zeichnen -- /` 0 Befunde ✅, `npm run mobil` ohne harte Befunde ✅; Testseite: Pop-up nach Klick auf Startseite erneut ✅, Leiste auf Unterseite ✅
* [x] Bilder `oa-14-r2/vorher|nachher-*` (Pop-up Computer/Handy, Startseite nach Schließen, Gutschein-Bereich, Unterseite)
**Referenzen:**
`components/gutschein/GutscheinDialog.tsx`
`components/gutschein/GutscheinSeitenleiste.tsx`
`components/Navbar.tsx`

### ✅ Phase 9: Paket „Große Aufbereitung“ raus, Weihnachtsbild mit „Schon ein Geschenk?“ (OA-17)
**Ziel:** Kundenwunsch OA-17: Paket entfernen, Gutscheinbild weihnachtlich, Text „Schon ein Geschenk?“
* [x] `data/gutschein.ts`: Paket `gross` entfernt → fehlt in Anfragefenster Schritt 1, Paketliste Startseite, Serverprüfung (alte Anfrage mit `gross` → „Unbekanntes Paket.“)
* [x] Bild neu `public/assets/gutschein/gutschein-weihnachtsgeschenk-fahrzeugpflege-leipzig.webp` (lokal erzeugt, FLUX.2 klein 4B, Apache-2.0; Geschenk mit roter Schleife auf Motorhaube, Lichterkette, Tannenzweige; ohne Logos, ohne Text); 1200 × 750, 58 KB
* [x] Text „Schon ein Geschenk?“ (`GUTSCHEIN_BILD_TEXT`) groß auf dem Bild: Pop-up über dem Aktions-Chip, Startseiten-Bereich unten links; Verlauf darunter für Lesbarkeit
  - Annahme: Text auf dem Bild statt neuer Überschrift → Überschriften „Glanz verschenken.“ / „Fahrzeugpflege als Geschenk.“ bleiben
* [x] Geprüft: Typprüfung ✅, Build mit Prerender ✅, Testseite ✅
* [x] Bilder `oa-17-r0/vorher|nachher-*` (Pop-up Computer/Handy, Schritt 1 Computer, Gutschein-Bereich Computer)
**Referenzen:**
`data/gutschein.ts`
`components/gutschein/GutscheinDialog.tsx`
`components/gutschein/GutscheinBereich.tsx`

## Kommentare
### Phase 9
**Eingehalten:** unter 700 Zeilen ✅, nur `test` ✅, Textregeln (kein Gedankenstrich) ✅, eine Quelle für Pakete ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Gering:** Bild ohne Nummer `B<n>` → beim nächsten `npm run bilder` vergeben
### Phase 8
**Eingehalten:** unter 700 Zeilen ✅, nur `test` ✅, Prerender/Suchindex sauber ✅, Testseite geprüft ✅
**Auffälligkeiten (nach Schwere):**
1. 🟢 **Gering:** Pop-up bei jedem Startseiten-Aufruf kann Stammbesucher stören → Kundenwunsch, bewusst so
### Phasen 6–7
**Eingehalten:** unter 700 Zeilen ✅, nur `test` ✅, Mobile-First ✅, CSS statt Messen per JS ✅, Testseite geprüft ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel:** Build ohne Prerender bei hoher Rechnerlast (Chromium-Start > 30 s) → Wächter bricht korrekt ab; zweiter Lauf grün
### Phase 5
**Eingehalten:** nichts an Live geändert ✅, Ergebnis über vorgesehene Befehle (keine Roh-SQL-Schreibzugriffe) ✅, Bilder auf derselben Testseite ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Direkt im Automatik-Chat weitergearbeitet → Worker prüft und übernimmt das Ergebnis nicht; Chat-Werkzeug darf bewusst kein `work.result` (Test `businessTools.test.ts`). Richtiger Weg: in Business „Fortsetzen“. Vorschlag: Worker übernimmt geprüfte Ergebnisse auch aus Handrunden.

### Phasen 1–3
**Eingehalten:** unter 700 Zeilen je Datei ✅, eine Quelle für Prüfregeln ✅, Server prüft verbindlich ✅, Textregeln (Gedankenstrich-Wächter 0 Funde) ✅, Mobile-First ✅, nur `test` ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Testseite kann nicht senden: SMTP-Variablen bei Vercel nur für Production → Schritt 4 zeigt dort „Online-Versand gerade nicht erreichbar“; live funktioniert der Versand. Nicht ergänzt, sonst landen Testanfragen im echten Postfach.
2. 🟡 **Mittel:** `scripts/test-email.tsx` (Bestand auf `main`) prüft Preise mit normalem Leerzeichen, Daten nutzen geschütztes → `npm run test:email` scheitert schon vor OA-14; Gutschein-Fälle mit angepassten Mustern grün. Nicht Teil des Auftrags, nicht geändert.
3. 🟢 **Gering:** „Große Aufbereitung“ ist kein Paketname der Preisliste (vermutlich Premiumpflege „exklusiv“) → beim Kunden bestätigen.
