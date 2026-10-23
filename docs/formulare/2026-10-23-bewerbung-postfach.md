# Bewerbungen an bewerbung@carcare-center.de (2026-10-23)

Backlog 6.13. Der Code war seit 28.09. fertig (`empfaengerFuer` in `api/anfrage.ts`), es fehlte nur der Eintrag in Vercel.

## Weg der Mail

Formular Karriere → `POST /api/anfrage` (`art: 'bewerbung'`) → Netcup-SMTP `mxe989.netcup.net` mit dem Postfach
`carcare.center.info@oalab.de` als Absender → direkt an `bewerbung@carcare-center.de` (MX: Microsoft 365).
Antwortadresse ist die E-Mail des Bewerbers. Andere Anfragen bleiben bei `ANFRAGE_EMPFAENGER` und `…_BUSINESS`.

## Gemacht

- [x] Vercel, Projekt `carcare-center`, Production: `ANFRAGE_EMPFAENGER_BEWERBUNG=bewerbung@carcare-center.de` (Secret).
- [x] Neu ausgerollt über einen Push auf `main` (Knopf „Redeploy“ im Dashboard hatte keinen Build ausgelöst).
- [ ] Testbewerbung über die Live-Seite, Ergebnis unten.

## Prüfung

Die API nennt den Empfänger nicht. Beleg darum über das Netcup-Postfach `carcare.center.info@oalab.de`:
landet der Test **nicht** dort und kommt **keine** Unzustellbar-Meldung zurück, ging er an bewerbung@.
Ob die Mail im Postfach bewerbung@ ankommt, sieht nur CarCare Center (Microsoft 365, kein Zugang bei uns).
Das Postfach selbst konnten wir nicht abfragen: Microsoft lehnt Anfragen von privaten Anschlüssen ab (Spamhaus).
