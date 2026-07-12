# Fix: 6 Leistungs-Links (404) → dedizierte Landingpages bauen

> **Problem:** 6 der 10 Karten in `components/ServiceGrid.tsx` verlinkten auf Routen, die in
> `App.tsx` nicht existierten → 404. Diese URLs (`{{Leistung}}-leipzig`) sind **bewusste SEO-Slugs**
> nach `SEO-GEO-STANDARDS.md` („je Kernleistung eine Seite mit lokalem Bezug"). Sie sind für die
> Auffindbarkeit der Seiten wichtig und dürfen NICHT umgebogen werden.

## Kurskorrektur (wichtig)

- **Erster (falscher) Ansatz:** die 6 Links auf `/leistungen` etc. umgebogen. → Verstößt gegen die
  SEO-/GEO-Strategie (zerstört die geplanten Leistungs-URLs). **Auf User-Hinweis zurückgenommen.**
- **Richtiger Ansatz (umgesetzt):** die 6 **dedizierten Landingpages an genau diesen URLs bauen**,
  Slugs bleiben erhalten. So lösen die Links auf echte, indexierbare Seiten auf (kein 404).

## Gebaute Seiten (je nach Muster `AccidentRepairPage` + `PageBlocks`)

| Seite | URL |
|---|---|
| Smart Repair | `/smart-repair-leipzig` |
| Autolackierung | `/autolackierung-leipzig` |
| Dellenentfernung | `/dellenentfernung-leipzig` |
| Hagelschadenreparatur | `/hagelschadenreparatur-leipzig` |
| Felgenreparatur | `/felgenreparatur-leipzig` |
| Fuhrparkservice | `/fuhrparkservice-leipzig` |

Jede Seite: genau eine `<h1>`, einzigartige `PageMeta` (Title 50–60 Z., Description 140–160 Z.),
Antwort-zuerst-Hero, `Leistungsumfang`/`Ablauf`/`Vorteile`(bzw. `Zielgruppen`)/`FAQ`/`CTA`,
JSON-LD (`BreadcrumbList` + `Service` + `FAQPage`). Faktenbasiert (Glasurit, Meisterbetrieb,
Wheel-Doctor/TÜV bei Felgen), keine erfundenen Preise; sicherheitskritische Felgenschäden explizit
ausgenommen (E-E-A-T/Seriosität).

## Registrierung (pro Seite)

- `App.tsx`: `case '/…-leipzig': return <…Page />;`
- `scripts/routes.mjs`: Eintrag in `staticRoutes` → **Sitemap + Prerender** (gemeinsame Quelle).
- `seo/pageSchemas.ts`: FAQ-Konstante + `breadcrumb/service/faq`-Schema unter dem Pfad.

## Interne Verlinkung (Auffindbarkeit gestärkt)

- Homepage `ServiceGrid`: Karten zeigen (wieder) auf die Leistungs-Slugs.
- `pages/ServicesPage.tsx`: die 6 Leistungskarten zeigen jetzt auf die neuen dedizierten Seiten
  (vorher `/leistungen`/`/geschaeftskunden`) — SEO-Standard 4.4 (Bestandsseiten → neue Seiten).

---

## Phasen

### ✅ Phase 1 — Analyse & Kurskorrektur
* [x] Erkannt: Slugs sind bewusste SEO-Landingpage-URLs, nicht „kaputte Links" → Ansatz gewechselt
* [x] Falschen Repoint zurückgenommen (ServiceGrid-Hrefs + Anker in ServicesPage)
* [x] Seiten-Muster studiert (`AccidentRepairPage`, `PageBlocks`, `pageSchemas`, `structuredData`, `routes.mjs`)
**Referenzen:** `components/ServiceGrid.tsx`, `pages/AccidentRepairPage.tsx`, `seo/pageSchemas.ts`

### ✅ Phase 2 — 6 Landingpages bauen + registrieren
* [x] 6 Seitenkomponenten (`pages/*Page.tsx`) mit einzigartigem, faktenbasiertem Inhalt
* [x] Routen in `App.tsx` (6 cases), `scripts/routes.mjs` (6 Einträge → Sitemap/Prerender)
* [x] Schemas in `seo/pageSchemas.ts` (Breadcrumb + Service + FAQPage je Seite)
* [x] Interne Verlinkung aus `ServicesPage` auf die neuen Seiten
**Referenzen:** `App.tsx`, `scripts/routes.mjs`, `seo/pageSchemas.ts`

### ✅ Phase 3 — Verifikation
* [x] `tsc --noEmit` grün (alle 6 Seiten + Routen + Schemas)
* [x] Sitemap: 19 URLs (14 statisch), alle 6 neuen Slugs enthalten → Prerender identisch
* [x] Jede der 10 `ServiceGrid`-Karten löst auf einen definierten `App.tsx`-case auf → kein 404
**Referenzen:** `components/ServiceGrid.tsx`, `App.tsx`

---

## Kommentare

**Eingehalten:** SEO-/GEO-Strategie respektiert (Slugs erhalten) ✅, je Kernleistung eine Seite ✅,
eine `<h1>`, einzigartige Meta, Antwort-zuerst, FAQ, Service-/FAQ-/Breadcrumb-Schema ✅,
Inhalte im initialen HTML (SSR/Prerender-tauglich) ✅, interne Verlinkung gesetzt ✅,
faktenbasiert ohne erfundene Preise ✅, `< 700` Zeilen/Datei ✅, Encoding sauber ✅.

**Auffälligkeiten/Findings:**
1. 🟠 **Eigener Fehler (korrigiert):** Zuerst SEO-Slugs auf Bestandsseiten umgebogen statt Seiten zu
   bauen. Auf User-Hinweis revidiert. Lehre: `{{Leistung}}-{{Stadt}}`-404 = fehlende Landingpage, NICHT
   ein umzubiegender Link (SEO-GEO-STANDARDS Abschnitt 6.1 „Lokale Landingpages").
2. 🟢 **Hinweis (Content):** Die Seiten sind solide, aber Textbausteine sind bewusst konservativ
   (keine Preise/Garantien). Feinschliff der Copy pro Seite jederzeit möglich.
3. 🟢 **Hinweis (Bilder):** Seiten sind rein textbasiert (wie bestehende Service-Seiten). Optional
   später Vorher-Nachher-Bilder je Leistung (E-E-A-T) ergänzen.

**Hauptkomponenten (max. 3):** `App.tsx`, `seo/pageSchemas.ts`, `pages/` (6 neue Seiten).

**Fazit:** Slugs erhalten, 6 indexierbare Landingpages gebaut und verdrahtet (Route + Sitemap +
Prerender + Schema), interne Verlinkung gestärkt. Kein 404 mehr — und die URLs sind jetzt echte
Ranking-/Auffindbarkeitsziele statt Platzhalter.

## Nachtrag — echte Texte von carcare-center.de übernommen

Auf User-Wunsch tragen die 6 Seiten nun **die echten Texte der Live-Seite carcare-center.de**
(per WebFetch geholt, da die Browser-Pane die Domain nicht erreichte), nicht meine Platzhalter-Copy:

- **Autolackierung** (`neu-und-reparaturlackierung.html`): „unsichtbare Reparatur", Spot-Repair bevorzugt, sonst Komplettlackierung.
- **Felgenreparatur** (`felgenreparatur.html`): TÜV-zertifiziertes Verfahren, Wheel-Doctor-Fachbetrieb, bis 90 % / 1 mm Tiefe, glanzgedrehte Felgen.
- **Dellenentfernung** (`dellen-entfernung-leipzig.html`): „ohne lackieren", Druck-/Ziehtechnik, echte Vorteilsliste (keine Wertminderung, von Versicherungen anerkannt …).
- **Hagelschaden** (`hagelschadenreparatur-leipzig.html`): Audatex-Kalkulation, direkte Versicherungsabrechnung, keine Anzahlung.
- **Fuhrparkservice** (`fuhrparkservice.html`): Firmenfuhrpark-Betreuung, Pflege bis Aufarbeitung, im Schadensfall mobil, Kooperationspartner.
- **Smart Repair**: Live-Seite hat **keine** eigene Seite → auf dem **Spot-Repair**-Konzept der Lackierungsseite aufgebaut (klar als solches formuliert).

Die USP-Bausteine (Glasurit-Lackpartner, Meisterbetrieb seit 1993, Full-Service 3.000 m², komplette
Versicherungsabwicklung, Flottenerfahrung) bleiben als „Warum CarCare Leipzig"-Sektion auf jeder Seite
erhalten — **kombiniert** mit den echten Live-Texten (nichts entfernt; USP = aktuelle Variante laut User).
Sicherheitsaussage bei Felgen (keine Schweiß-/Rückverform-Eingriffe) stammt 1:1 aus dem Live-Text.
Schema-FAQ + Service-Beschreibungen an die echten Texte angeglichen (Glasurit/Meisterbetrieb in
Lack-nahen Service-Schemas ergänzt).

**Arbeitsregel (gemerkt):** Keine bestehenden Seiteninhalte ohne ausdrückliche Aufforderung entfernen –
nur ergänzen. Siehe Memory `no-unrequested-content-removal`.

## Nachtrag 2 — Autoglas als 7. dedizierte Seite (auf User-Wunsch)

Autoglas war nicht unter den 6 kaputten Links (die Karte zeigte auf `/leistungen`, kein 404). Auf
User-Wunsch als eigene Seite gebaut: `/autoglas-leipzig` (`pages/AutoglasPage.tsx`), Route + `routes.mjs`
+ Schema ergänzt, ServiceGrid-Karte „Autoglas / Scheibenfolien" von `/leistungen` auf `/autoglas-leipzig`
umgestellt. Inhalt = echte Live-Texte (`autoglas-scheibenfolien.html`): WINTEC-Autoglas-Partner,
ISO 9001 TÜV-zertifiziert, 30 Jahre Garantie, Neuverglasung PKW/LKW/Bus, Steinschlagreparaturen,
Folienbeschichtungen, gratis Werkstatt-Ersatzfahrzeug. Sitemap jetzt 15 statische Seiten.
