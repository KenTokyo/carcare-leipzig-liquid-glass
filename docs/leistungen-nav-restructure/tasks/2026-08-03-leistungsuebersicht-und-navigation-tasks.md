# Leistungsseite vervollständigen & Navigation auf Zielgruppen umstellen

**Auftrag (User, 2026-08-03):**
1. `/leistungen` soll **alle** Leistungen enthalten, die auch in der Leistungsübersicht
   (Startseite, `ServiceGrid`) stehen — „auch alles, was wirklich dazugehört".
2. Das Mega-Menü unter „Leistungen" in der Navbar zeigt aktuell alle Leistungen. Das ist
   nach (1) überflüssig → **Geschäftskunden** dorthin, und an die Stelle, wo Geschäftskunden
   jetzt steht, **Privatkunden** aufnehmen.

**Danach (vom User angekündigt, NICHT Teil dieser Planung):** je eine ausgebaute Hub-Seite
für **Fahrzeugaufbereitung** und **Unfallinstandsetzung** (dort alles bündeln, was auf der
Mainpage zum jeweiligen Thema vorkommt; Karosserie, Smart Repair, Lackierung untergliedern).
Noch detailliertere Seiten folgen später.

---

## Ausgangsbefund (verifiziert am 2026-08-03)

* `components/ServiceGrid.tsx` führt **10** Leistungen als eigene Liste (`overviewServices`).
* `pages/ServicesPage.tsx` führt **12** Einträge als **zweite, getrennte** Liste.
* Folge der Doppelpflege — die Listen sind auseinandergelaufen:
  * **`Autoglas / Scheibenfolien` fehlt auf `/leistungen` komplett.**
  * 3 Einträge (`Autoaufbereitung`, `Leasingrückgabe`, `Werterhalt & Verkaufsaufbereitung`)
    zeigen alle auf dieselbe URL `/fahrzeugaufbereitung-leipzig` wie `Fahrzeugaufbereitung`
    → vier Anker auf ein Ziel, kein eigener Wert.
* `components/Navbar.tsx` → `megaSections.leistungen` mit 4 Einträgen:
  Fahrzeugaufbereitung · Unfallinstandsetzung · Geschäftskunden · **Alle Leistungen**.
* **`/privatkunden` existiert nicht** — weder Route in `App.tsx` noch in `scripts/routes.mjs`
  noch Datei in `pages/`.

---

## Phasenplanung

### ✅ Phase 1 — Single Source of Truth für Leistungen + `/leistungen` vervollständigen
**Ziel:** Eine gepflegte Liste, aus der **beide** Ansichten lesen. Damit ist die Drift
(fehlendes Autoglas) strukturell ausgeschlossen, nicht nur einmalig repariert.
* [x] `data/services.ts` angelegt (207 Zeilen): Katalog mit 11 Leistungen, 4 Gruppen,
      Helfer `overviewServices` (Kacheln) und `servicesByGroup()` (Leistungsseite)
* [x] `components/ServiceGrid.tsx` auf den Katalog umgestellt — 30 Zeilen Datenduplikat
      entfernt, Kachel-Reihenfolge unverändert
* [x] `pages/ServicesPage.tsx` neu aufgebaut (99 Zeilen): rendert die Gruppen per `map`,
      statt 4 handgepflegte Sections mit eigenen Listen
* [x] Doppelziele entfernt (`Autoaufbereitung`, `Werterhalt & Verkaufsaufbereitung` zeigten
      auf dieselbe URL wie `Fahrzeugaufbereitung`), **`Autoglas & Scheibenfolien` ergänzt**
* [x] Title/Description/FAQ an den vollständigen Umfang angeglichen (FAQ 3 → 5 Fragen)
* [x] `seo/pageSchemas.ts` nachgezogen: `servicesFaq` + `serviceSchema` decken jetzt den
      sichtbaren Inhalt ab (Schema darf nur auszeichnen, was auf der Seite steht)
* [x] `npx tsc --noEmit` fehlerfrei
* [x] Browser-Verifikation auf `localhost:3007`: `/leistungen` listet **11** Leistungen in
      4 Gruppen, Startseite unverändert **10** Kacheln in gleicher Reihenfolge/Zielen,
      keine Konsolenfehler, keine Mojibake

**Referenzen:**
`data/services.ts`
`pages/ServicesPage.tsx`
`components/ServiceGrid.tsx`

### ✅ Phase 2 — Navigation auf Zielgruppen umstellen
**Ziel:** Mega-Menü zeigt nicht mehr die (jetzt vollständige) Leistungsliste, sondern die
beiden künftigen Hubs plus die beiden Zielgruppen.
**User-Entscheidung (2026-08-03, per Rückfrage):** Variante „Hubs + beide Zielgruppen";
Ziel für Privatkunden = **eigene Seite `/privatkunden` anlegen**.
* [x] `Alle Leistungen` aus `megaSections.leistungen` entfernt (redundant: der Menütitel
      „Leistungen" verlinkt bereits auf `/leistungen`)
* [x] `Privatkunden` an der vorherigen Geschäftskunden-Position aufgenommen,
      `Geschäftskunden` rückt auf die frei gewordene letzte Position
* [x] `pages/PrivatkundenPage.tsx` neu angelegt (186 Zeilen): 8 verlinkte Leistungen,
      6 Gründe, 4 Ablaufschritte, **6 FAQs** — alle Aussagen aus belegten Projektangaben,
      bewusst **ohne** Preise und Dauern (liegen nicht vor)
* [x] Verdrahtung: Route in `App.tsx`, Eintrag in `scripts/routes.mjs`,
      `breadcrumbSchema` + `serviceSchema` + `faqSchema` in `seo/pageSchemas.ts`
* [x] Icon-Import in `Navbar.tsx` bereinigt (`LayoutGrid` raus, `User` rein)
* [x] Mobile-Menü liest dieselbe `megaSections`-Quelle → automatisch mitgezogen
* [x] Verifiziert: Desktop-Hover **und** mobiles Menü (375×812) zeigen beide exakt
      Fahrzeugaufbereitung · Unfallinstandsetzung · Privatkunden · Geschäftskunden
* [x] `npm run build` mit `PRERENDER_STRICT=1`: **21/21 Routen** prerendert,
      Sitemap 21 URLs; `dist/privatkunden/index.html` = 60,3 KB mit 1 × `h1`,
      6 JSON-LD-Blöcken inkl. `FAQPage` + `BreadcrumbList`, Encoding sauber (UTF-8)

**Referenzen:**
`components/Navbar.tsx`
`pages/PrivatkundenPage.tsx`
`seo/pageSchemas.ts`

---

## Kommentare

### Phase 1
**Eingehalten:** unter 700 Zeilen ✅ (größte Datei `data/services.ts`, 207 Z.), Mobile-First ✅,
Single Source of Truth statt Doppelpflege ✅, Schema nur für sichtbaren Inhalt (§5) ✅,
Ansprache „Sie" + de-DE (§0) ✅, kein Dev-Server-Autostart ✅ (lief bereits), Encoding geprüft ✅.

**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch — BEHOBEN:** `ServiceGrid` und `ServicesPage` pflegten zwei getrennte
   Leistungslisten. Sie waren auseinandergelaufen: **`Autoglas / Scheibenfolien` fehlte auf
   `/leistungen` vollständig**, und 3 von 12 Einträgen zeigten auf dieselbe URL wie
   `Fahrzeugaufbereitung` (vier Anker, ein Ziel). Ursache war die Doppelpflege, nicht ein
   einzelner Tippfehler — deshalb per `data/services.ts` strukturell gelöst statt nur
   nachgetragen.
2. 🟠 **Hoch — OFFEN:** `Leasingrückgabe` hat weiterhin kein eigenes Ziel und zeigt auf
   `/fahrzeugaufbereitung-leipzig`. Betrifft jetzt drei Stellen (Startseiten-Kachel,
   `/leistungen`, `/privatkunden`). Im Katalog als `TODO` markiert. Bewusst nicht in diesem
   Durchgang gelöst — der User hat die Hub-Seiten für den nächsten Schritt angekündigt.
3. 🟡 **Mittel — VORBESTEHEND, OFFEN:** Der „Warum CarCare"-USP-Block ist auf 7 Leistungs-
   seiten nahezu wortgleich (17 Treffer) → Near-Duplicate-Content. Die neue
   `PrivatkundenPage` wurde deshalb bewusst mit **eigenem** Text gebaut, um das Problem
   nicht zu vergrößern. Entdopplung der Bestandsseiten steht aus.

### Phase 2
**Eingehalten:** unter 700 Zeilen ✅ (`PrivatkundenPage.tsx` 186 Z.), genau eine `h1` ✅,
Title 57 Z. / Description 158 Z. im Zielkorridor (§3.1) ✅, Antwort-zuerst in den FAQs (§4.3) ✅,
interne Cluster-Verlinkung gesetzt (§4.4) ✅, `areaServed`/NAP unverändert konsistent ✅,
keine erfundenen Fakten (keine Preise, keine Dauern) ✅, Prerender + Sitemap nachgezogen ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — VORBESTEHEND, OFFEN:** `components/Footer.tsx` führt Impressum und Datenschutz
   weiterhin auf `href="#"`. Das erscheint jetzt auch im Footer der neuen Seite. Rechtlicher
   Rahmen und fehlende Registerdaten sind in `docs/`-Historie und Memory dokumentiert.
2. 🟡 **Mittel — VORBESTEHEND, OFFEN:** `og:image` zeigt weiter auf ein Unsplash-Stockfoto
   (`components/SEOHead.tsx`), gilt damit auch für `/privatkunden`.
3. 🟢 **Niedrig — Werkzeugbedingt:** Screenshot-Nachweis war nicht möglich (Browser-Pane
   kompositiert keine Frames). Verifikation daher textuell über DOM, Schema-Auszug und
   Prerender-Output — inhaltlich gleichwertig, aber ohne Bildbeleg.
4. 🟢 **Niedrig — geklärt:** Beim Prüfen des Prerender-HTML meldete PowerShell zunächst
   Mojibake. Falscher Alarm: PowerShell 5.1 liest UTF-8 ohne BOM als ANSI. Gegenprobe mit
   explizitem UTF-8 → sauber. **Merke:** Encoding-Checks immer über
   `[System.IO.File]::ReadAllText(path, [Text.Encoding]::UTF8)` fahren, nie über `Get-Content -Raw`.

**Kein separater Optimierungsplan angelegt:** Die drei offenen Punkte (Leasingrückgabe-Ziel,
USP-Entdopplung, Rechtsseiten) sind bereits in bestehenden Planungen bzw. im Memory geführt
und überschneiden sich mit den vom User für den nächsten Schritt angekündigten Hub-Seiten.
Ein zweiter Plan würde sie nur duplizieren.
