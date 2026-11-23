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

## Kommentare
### Phasen 1–3
**Eingehalten:** unter 700 Zeilen je Datei ✅, eine Quelle für Prüfregeln ✅, Server prüft verbindlich ✅, Textregeln (Gedankenstrich-Wächter 0 Funde) ✅, Mobile-First ✅, nur `test` ✅
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch:** Testseite kann nicht senden: SMTP-Variablen bei Vercel nur für Production → Schritt 4 zeigt dort „Online-Versand gerade nicht erreichbar“; live funktioniert der Versand. Nicht ergänzt, sonst landen Testanfragen im echten Postfach.
2. 🟡 **Mittel:** `scripts/test-email.tsx` (Bestand auf `main`) prüft Preise mit normalem Leerzeichen, Daten nutzen geschütztes → `npm run test:email` scheitert schon vor OA-14; Gutschein-Fälle mit angepassten Mustern grün. Nicht Teil des Auftrags, nicht geändert.
3. 🟢 **Gering:** „Große Aufbereitung“ ist kein Paketname der Preisliste (vermutlich Premiumpflege „exklusiv“) → beim Kunden bestätigen.
