/**
 * Adresse und Routenziele — EINE Quelle für die mobile Aktionsleiste („Route") und die Links an der Adresse
 * (Kontaktkarten, Fußzeile; Backlog 6.23, Meeting 2026-09-28).
 *
 * Wortlaut EXAKT wie NAP_ADRESSE in CLAUDE.md / Impressum / Footer — NAP-Konsistenz (SEO-GEO §6.1) gilt auch für
 * Kartendienste.
 *
 * ERST NACH KLICK AKTIV (6.23): Das sind gewöhnliche Links, keine eingebettete Karte. Bis jemand klickt, baut die Seite
 * keine Verbindung zu Google oder Apple auf; erst der Klick öffnet den Kartendienst in einem neuen Tab (mit
 * `noreferrer`, der Dienst erfährt die Unterseite nicht). Eine eingebettete Karte bräuchte dagegen eine Zwei-Klick-
 * Freigabe und einen Absatz in der Datenschutzerklärung.
 *
 * Beide Dienste bekommen eine ROUTEN-URL (nicht nur einen Pin), damit die Navigation direkt startet. Auf dem Handy
 * übernimmt die installierte App, sonst öffnet die Web-Fassung. Apple: `daddr` = Ziel, `dirflg=d` = Auto. Google:
 * offizielle Directions-API-URL.
 */
export const ADRESSE = 'An den Tierkliniken 42, 04103 Leipzig';
const ZIEL = encodeURIComponent(ADRESSE);

export const GOOGLE_MAPS_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${ZIEL}&travelmode=driving`;
export const APPLE_KARTEN_ROUTE = `https://maps.apple.com/?daddr=${ZIEL}&dirflg=d`;

export const KARTEN_ZIELE = [
  { label: 'Apple Karten', href: APPLE_KARTEN_ROUTE },
  { label: 'Google Maps', href: GOOGLE_MAPS_ROUTE },
];
