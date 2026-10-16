# Weiterleitungen der alten Website (R22, Livegang-Blocker)

**Angelegt:** 2026-10-16 · **Stand:** alle Phasen erledigt, live geprüft am 16.10. (Commit `0b269a7`, Push 19:12, Vercel
live 19:18). Offen ist nur, was rund um die DNS-Umstellung zu tun ist (Optimierung O2).
**Auftrag des Users:** „Lass uns mit 2 beginnen … alle offenen und nicht genutzten Links mit einer Weiterleitung auf die
neuen Seiten versehen … frag mich ruhig, welche Zuteilung am meisten Sinn macht.“ (Punkt 2 der Livegang-Liste vom 16.10.)

**Befund (Audit 16.10.):** Die alte Website `www.carcare-center.de` (Joomla-Export, nginx/Plesk bei KUPPER IT) hat
**48 Seitenadressen** und **6 verlinkte PDFs**. Die neue Seite kannte keine davon: auf `carcare-center.vercel.app`
antworteten sie mit **404** (gemessen, z. B. `/jobangebote.html`). Beim Livegang auf derselben Domain verlören Google-
Rankings, Lesezeichen und Fremdlinks ihr Ziel. In keiner Planung bisher erfasst.

**Lösungswege verglichen:**
1. Pauschal alles auf die Startseite (`*.html` → `/`): einfach, aber Google wertet massenhafte Weiterleitungen auf die
   Startseite als Soft-404; die Rankings der Unterseiten gingen trotzdem verloren.
2. In der 404-Seite per JavaScript umleiten: Crawler ohne JavaScript sehen weiter 404, der Statuscode bleibt falsch.
3. Meta-Refresh-Dateien je alter Adresse: laufen auf jedem Host, liefern aber 200 statt 301. Nur eine Notlösung.
4. **Gewählt:** serverseitige **301 je alter Adresse auf die inhaltlich passende neue Seite** (1:1), aus **einer** Liste
   erzeugt: `vercel.json` (`redirects`, sofort aktiv) und fertige Regeln für Apache und nginx, falls das Hosting zu
   KUPPER IT wechselt (Livegang-Punkt 1 offen). Dazu ein Wächter im `prebuild` und eine Live-Prüfung nach dem Deploy.

**Bewusst ausgenommen:**
* `/index.html`: liefert die Startseite schon heute mit 200 und `canonical` auf `/` (gemessen). Eine Regel
  `/index.html` → `/` riskiert auf Vercel eine Schleife, weil `/` intern aus `index.html` bedient wird.
* Bilder, Skripte und Videos der Altseite (`/images/…`, `/media/…`; 56 JPG, 33 PNG, 7 GIF, 5 MP4 …): laufen aus.
  Bildadressen auf Seiten umzuleiten bringt der Bildersuche nichts.
* `/index.php`, `/sitemap.xml`, `/standorte/`: antworten schon auf der Altseite mit 500, sind also nie erreichbar
  gewesen. Ausnahme: `/standorte/leipzig.html` ist von jeder Altseite verlinkt und bekommt eine Regel.

## Zuordnung (entschieden)

Grundlage ist der **Inhalt** der Altseite (Haupttext am 16.10. ausgelesen), nicht nur ihr Titel. Die vier offenen
Punkte hat der User am 16.10. entschieden, jeweils wie vorgeschlagen. Maßgeblich ist die Liste in
`scripts/lib/weiterleitungen.mjs`; diese Tabelle ist die Begründung.

| Alte Adresse(n) | Ziel | Begründung |
|---|---|---|
| `/carcarecenter.html` | `/ueber-uns` | Unternehmensseite |
| `/carcarecenter/referenzen.html` | `/geschaeftskunden` | „Folgende Kunden werden u. a. von uns betreut“ + Kundenlogos; neu: Partnerlisten |
| `/carcarecenter/bildergalerie.html` | `/ueber-uns` | 11 Betriebsfotos (Außenansicht, Halle, Lackierkabine, Waschhalle) |
| `/carcarecenter/videos.html` | `/ueber-uns` | Betriebsvideo 2022, Wheeldoctor, MDR um 4, LexiTV, Imagevideo |
| `/privat-geschaeftskunden.html` | `/leistungen` | „Privat- & Geschäftskunden: Unser Dienstleistungsspektrum“ = Leistungsübersicht (**User**) |
| `/pflegepakete.html`, `/privat-geschaeftskunden/pflegepakete.html` | `/fahrzeugaufbereitung-leipzig` | Pakete mit Preisen (Brillant Außenpflege …) |
| `/fahrzeugdesinfektion.html`, `/pflegepakete/fahrzeugdesinfektion.html`, `/privat-geschaeftskunden/fahrzeugdesinfektion.html` | `/innenaufbereitung-leipzig` | Ozonbehandlung 45 € steht dort wie auf der Altseite (**User**) |
| `/neu-und-reparaturlackierung.html`, `/neu-reparaturlackierung-leipzig.html`, `/privat-geschaeftskunden/neu-und-reparaturlackierung.html` | `/autolackierung-leipzig` | Lackierung |
| `/lackreparatur.html` | `/smart-repair-leipzig` | „Das Spot-Repair-Verfahren …“; neu: „Smart Repair Leipzig, Spot-Repair“ |
| `/reparaturloesungen-mit-system.html`, `/privat-geschaeftskunden/reparaturloesungen-mit-system.html`, `/kunststoffreparatur.html` | `/smart-repair-leipzig` | Übersicht der Reparaturlösungen und Kunststoff (**User**: aufteilen) |
| `/lederreparatur.html`, `/stoffreparatur.html` | `/innenaufbereitung-leipzig` | Polster und Leder (**User**: aufteilen) |
| `/felgenreparatur.html`, `/privat-geschaeftskunden/felgenreparatur.html` | `/felgenreparatur-leipzig` | 1:1 |
| `/dellenentfernung-leipzig.html`, `/dellen-entfernung-leipzig.html`, `/privat-geschaeftskunden/dellenentfernung.html` | `/dellenentfernung-leipzig` | 1:1 |
| `/hagelschadenreparatur-leipzig.html`, `/privat-geschaeftskunden/hagelschadenreparatur.html` | `/hagelschadenreparatur-leipzig` | 1:1 |
| `/autoglas-scheibenfolien.html`, `/privat-geschaeftskunden/autoglas-scheibenfolien.html` | `/autoglas-leipzig` | 1:1 |
| `/unfallinstandsetzung.html`, `/privat-geschaeftskunden/unfallinstandsetzung.html` | `/unfallinstandsetzung-leipzig` | 1:1 |
| `/leasingbegleitung.html`, `/privat-geschaeftskunden/leasingbegleitung.html` | `/leasingrueckgabe-leipzig` | „Wir kümmern uns um Ihr Leasingfahrzeug“ |
| `/fuhrparkservice.html`, `/privat-geschaeftskunden/fuhrparkservice.html` | `/fuhrparkservice-leipzig` | 1:1 |
| `/autohaeuser-fuhrparks.html` | `/geschaeftskunden` | Zielgruppe Autohäuser und Fuhrparks |
| `/jobangebote.html` und die vier Stellen (`/jobangebote/serviceberater.html` …) | `/karriere` | Stellen stehen dort; eigene Stellenseiten erst mit R19 |
| `/kontakt.html`, `/kontakt/anfahrt.html`, `/standorte/leipzig.html` | `/kontakt` | Kontakt, Anfahrt, Standort |
| `/kontakt/impressum.html` | `/impressum` | 1:1 |
| `/kontakt/datenschutzerklaerung.html`, `/datenschutz.html` | `/datenschutz` | 1:1 |
| `/kontakt/sitemap.html` | `/` | Keine HTML-Sitemap mehr; die Navigation übernimmt |
| PDFs: Flyer 2022 → `/`, Desinfektion → `/innenaufbereitung-leipzig`, 2 Felgenzertifikate → `/felgenreparatur-leipzig`, Datenschutzhinweise 2020 → `/datenschutz` | wie links | auf die passende Seite (**User**) |
| `/images/EU_POS.pdf` | **bleibt** unter derselben Adresse | EU-Vorhabensbeschreibung, siehe unten (**User**) |

**EU-Publizität (offen seit 24.07., `docs/eu-foerderhinweis/`):** `/images/EU_POS.pdf` ist die **Vorhabensbeschreibung**
nach Art. 50 VO (EU) 2021/1060: „Unser Digitalisierungsvorhaben, gefördert durch die Europäische Union … im Rahmen der
Förderrichtlinie Digitalisierungszuschuss des EFRE 2021–2027 … normierte Datenschnittstelle (API) für unser
bestehendes ERP-System DATACAR2“ (Word, 01.09.2025). Die Altseite verlinkte sie auf jeder Seite. Seit 16.10. liegt sie
unverändert unter `public/images/EU_POS.pdf` (145.702 Byte, gleiche Größe wie auf der Altseite) und ist im
Förderhinweis der Fußzeile verlinkt („Unser Digitalisierungsvorhaben (PDF)“).

## Phasen

### ✅ Phase 1 — Bestandsaufnahme der Altseite festhalten
**Ziel:** Das Inventar überlebt die Abschaltung der Altseite und ist die Messlatte für den Wächter.
* [x] Crawl am 16.10. (Breitensuche ab `/index.html`, nur eigene Domain): 48 Seiten, 6 PDFs; Server nginx/Plesk,
  Joomla-Reste; `/sitemap.xml`, `/index.php` und `/standorte/…` antworten mit 500, Verzeichnisse mit 403.
* [x] Werkzeug `scripts/altseite-inventar.mjs` (`npm run altseite`) schreibt
  `docs/weiterleitungen-altseite/altseite-inventar.json` (48 Seiten mit Status, Titel, Fundstelle; 6 Dokumente;
  Bilder und Skripte nur gezählt). Bricht ab, wenn unter der Domain schon die neue Seite läuft (Joomla-Merkmal fehlt),
  damit das Inventar nach der Umstellung nicht mit den neuen Adressen überschrieben wird.
**Referenzen:**
`scripts/altseite-inventar.mjs`
`docs/weiterleitungen-altseite/altseite-inventar.json`

### ✅ Phase 2 — Zuordnung entscheiden
* [x] 38 Adressen eindeutig nach Inhalt zugeordnet (Altseitentexte gegen den Suchindex der neuen Seite)
* [x] 4 Rückfragen an den User, alle wie vorgeschlagen entschieden: Leistungsübersicht → `/leistungen`, Reparaturen
  aufteilen, Desinfektion → Innenaufbereitung, PDFs weiterleiten und EU-PDF behalten

### ✅ Phase 3 — Eine Liste, drei Ausgaben
* [x] `scripts/lib/weiterleitungen.mjs`: 52 Regeln (47 Seiten, 5 PDFs), `BEHALTEN` (EU-PDF), `AUSNAHMEN` (`/index.html`)
* [x] `scripts/generate-vercel-config.mjs`: `redirects` mit `statusCode: 301` (Vercel-Doku geprüft: `statusCode` und
  `permanent` schließen sich aus, Quelle wird exakt verglichen); `vercel.json` neu erzeugt und gegen das JSON-Schema
  von Vercel (`openapi.vercel.sh/vercel.json`) geprüft: nur `source`, `destination`, `statusCode` (zusätzliche Felder
  verboten), 52 von höchstens 2048 Regeln
* [x] Übergabe an KUPPER IT: `docs/weiterleitungen-altseite/uebergabe/weiterleitungen.htaccess` (Apache,
  `RedirectMatch` mit Anker) und `weiterleitungen-nginx.conf` (`location =`, für Plesk „Zusätzliche nginx-Anweisungen“)
* [x] EU-PDF nach `public/images/EU_POS.pdf`, Link im Förderhinweis (`components/Footer.tsx`), eigenes Element neben
  dem Pflichtsatz (für den Satz selbst sind Unterstreichungen unzulässig)
**Referenzen:**
`scripts/lib/weiterleitungen.mjs`
`scripts/generate-vercel-config.mjs`
`components/Footer.tsx`

### ✅ Phase 4 — Wächter und Live-Prüfung
* [x] `scripts/check-weiterleitungen.mjs` im `prebuild` (`npm run weiterleitungen`): Ziel ist Route, Quelle ist keine
  Route und frei von Sonderzeichen, keine Dubletten und Ketten, jede Inventaradresse abgedeckt, behaltene Dateien
  vorhanden, Ausnahmen begründet, `vercel.json` und beide Übergabe-Dateien synchron
* [x] Pflichtfrage im Kopf beantwortet (5 Punkte); Gegenprobe `-- --gegenprobe`: 10 eingespielte Fehler, alle gemeldet,
  echter Stand ohne Befund
* [x] `-- --live [url]`: jede alte Adresse 301 aufs richtige Ziel, Ziele 200, EU-PDF 200 als PDF, `/index.html` 200
**Referenzen:**
`scripts/check-weiterleitungen.mjs`

### ✅ Phase 5 — Build, Doku, Live-Prüfung
* [x] Build 16.10. grün (`check-weiterleitungen` im prebuild: 52 Regeln, 54 Inventaradressen abgedeckt);
  `dist/images/EU_POS.pdf` ausgeliefert, Link auf jeder Seite; Bildschirmfoto Fußzeile 390 und 1440 px (Link 24 px hoch,
  12 px, sichtbar)
* [x] Messwerkzeuge gegen den neuen Build (16.10., 18:13:01): Kontrast 6.283 Textstellen ohne Befund (vorher 6.265,
  dazu kommt der neue Link) · Mobil 29 Routen × 3 Fenster, 0 harte Befunde (Fußzeile 360: 926 px statt 899, 390: 863
  statt 848, beide im Seitenfluss; 430: 848 px, fixiert) · Aussparung ohne Überdeckung, Geometrie an 23 Breiten ·
  Meta 0 von 29 außerhalb · tote Dateien 0 (172 Quelldateien, 50 Einstiege)
* [x] `CLAUDE.md` (Messwerkzeuge), Backlog R22, neue Repo-Befunde R23 (Fußzeilen-CLS) und R24 (404-Seite)
* [x] Commit `0b269a7` (nur eigene Dateien; eine Zeile `"akkordeon"` aus `package.json` der parallelen Sitzung
  „mobil-startseite“ war mitgerutscht und vor dem Push wieder herausgenommen), Push-Stand `0181975`, Push auf `main`
  16.10. 19:12 nach Freigabe des Users; Vercel lieferte ab 19:18 aus.
* [x] **Live-Prüfung** `npm run weiterleitungen -- --live` gegen `carcare-center.vercel.app`: alle 52 alten Adressen
  301 aufs richtige Ziel, alle Ziele 200, `/images/EU_POS.pdf` 200 als PDF, `/index.html` 200. Stichproben per `curl`:
  `/jobangebote.html` → `/karriere`, `/lederreparatur.html` → `/innenaufbereitung-leipzig`, Felgenzertifikat-PDF →
  `/felgenreparatur-leipzig`; unbekannte Adresse weiter 404 (kein Sammelfang). `npm run smoke`: 29 Routen mit JSON-LD,
  FAQPage und Marker. Sein Hinweis „Bundle stammt nicht aus diesem Build“ ist erklärt: Das lokale `dist/` hatte die
  parallele Sitzung um 19:01 mit ihren uncommitteten Änderungen neu gebaut.
* [x] Was rund um die DNS-Umstellung zu tun ist (Inventar neu, Übergabe bei KUPPER IT, Live-Prüfung gegen die echte
  Domain, 404-Bericht der Search Console): Optimierung O2

---

## Kommentare

### Phase 1–5
**Eingehalten:** unter 700 Zeilen ✅ (check-weiterleitungen 192, weiterleitungen 153, altseite-inventar 114, Footer 385),
Lösungswege verglichen ✅, Inhalt statt Titel zugeordnet ✅, Rückfragen nur bei echten Ermessensfragen ✅, Pflichtfrage
beantwortet ✅, Gegenprobe ✅, Vercel-Doku geprüft statt angenommen ✅, keine Backlog-Nummer vergeben (R22–R24) ✅,
Dev-Server nicht gestartet ✅ (Bildschirmfoto über eigenen Dateiserver auf `dist/`), Textregeln ✅ (Wir-Form, kein
Gedankenstrich im sichtbaren Text, postbuild 0 Funde).

**Auffälligkeiten/Probleme (nach Schwere):**
1. 🟠 **Hoch (erledigt 16.10., 19:18):** Die Live-Prüfung war erst nach dem Deploy möglich; `vite preview` wertet
   `vercel.json` nicht aus. Nach dem Push bestanden: 52 von 52 Adressen 301 aufs richtige Ziel (Phase 5).
2. 🟠 **Hoch (Inhalt, André):** Leder-, Stoff- und Kunststoffreparatur hatten eigene Altseiten; die neue Seite nennt
   Leder und Polster nur bei der Pflege, Kunststoffreparatur gar nicht. Werden sie noch angeboten, fehlt der Inhalt
   (die Weiterleitung trifft dann nur das Nächstliegende).
3. 🟡 **Mittel (Verzeichnisse):** Fremde Branchenverzeichnisse führen alte Daten, z. B. nochoffen.de „seit 1993“,
   „An den Tierkliniken 4“, Telefon 222 96 22 (SEO-GEO-STANDARDS 6.1, NAP-Konsistenz). Nicht über die Website lösbar.
4. 🟡 **Mittel (ungenutzte Belege):** Die Altseite hatte zwei Felgenzertifikate (TÜV, Wheeldoctor) und Presseclips
   (MDR um 4, LexiTV). Auf der neuen Seite fehlen sie; als E-E-A-T-Belege wären sie wertvoll. Jetzt nur weitergeleitet.
5. 🟡 **Mittel (behoben):** Der Sync-Vergleich der Übergabe-Dateien verglich Rohtext. Mit `core.autocrlf=true`
   (gesetzt auf diesem Rechner, üblich unter Windows) kommen sie nach einem Checkout mit CRLF an, der Generator schreibt
   LF: Der prebuild wäre bei Kollegen grundlos gebrochen. Jetzt werden Zeilenenden vor dem Vergleich angeglichen;
   geprüft, indem die nginx-Datei auf CRLF umgestellt wurde (Wächter grün), danach neu erzeugt.
6. 🟢 **Niedrig:** Die Altseite zählte Besuche über Piwik bei KUPPER IT (`stats.kupper-computer.com`), obwohl ihre
   Datenschutzerklärung „kein Tracking“ sagte. Für 6.20 relevant: Die neue Seite hat keine Analyse.

Optimierungsplan: `docs/weiterleitungen-altseite/tasks/2026-10-16-weiterleitungen-altseite-optimierung-tasks.md`
