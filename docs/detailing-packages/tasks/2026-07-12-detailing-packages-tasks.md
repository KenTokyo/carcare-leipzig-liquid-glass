# Pflegepakete auf der Detailing-Landingpage sichtbar machen

> **Ziel:** Die 4 Pflegepakete (Brillant Außenpflege, Intensiv Innenreinigung, Premiumpflege,
> Premiumpflege „exklusiv") stecken aktuell nur im **verwaisten** `components/Services.tsx`
> (nicht importiert → nicht live). Sie werden als eigene, crawlbare Sektion „Pflegepakete & Preise"
> auf `/fahrzeugaufbereitung-leipzig` (`pages/VehicleDetailingPage.tsx`) sichtbar gemacht — mit
> echten Preisen und faktenreichen Beschreibungen (starkes SEO/GEO-Signal: konkrete Fakten + Preisrahmen).

## Quelle (verifiziert, `components/Services.tsx`)

| Paket | Preis | Umfang (longDescription) |
|---|---|---|
| Brillant Außenpflege | 169,00 € | Vorreinigung, Felgenreinigung, Insektenentfernung, Oberwäsche inkl. Abledern, Scheibenreinigung, Lackreinigung, Hochglanzpolitur, Lackversiegelung |
| Intensiv Innenreinigung | 199,00 € | Oberwäsche, intensive Innenraumreinigung, Polstershampoonierung / Lederpflege, Scheibenreinigung innen+außen |
| Premiumpflege | 299,00 € | Brillant + Intensiv + Motorreinigung inkl. Versiegelung |
| Premiumpflege „exklusiv" | ab 348,00 € | Handarbeit, SWIZÖL-Wachs, Carnauba 30–60 % → höherer Glanzgrad |

## Entscheidungen

- **Keine Bilder:** Quelle nutzte externe Unsplash-URLs → widerspricht dem self-hosted/CDN-freien
  Muster der Seite. Karten rein textbasiert (wie `FeatureGrid`), Preis als dunkle Pille.
- **Kein JS-Expand:** volle Beschreibung direkt im initialen HTML (crawlbar, GEO-freundlich).
- **Preis-Schema (Offer JSON-LD) vorerst NICHT:** Preise stammen aus stillgelegtem Code → Aktualität
  unbestätigt. Erst sichtbar rendern; Schema optional nach User-Freigabe der Preise.
- **Platzierung:** neue Sektion direkt nach „Aufbereitungsleistungen" (Einzelleistungen → gebündelte
  Pakete). Hintergrund-Alternierung der Folgesektionen entsprechend angepasst.
- **`Services.tsx` bleibt** unangetastet (enthält weitere Inhalte: Desinfektion/Reparatur) — Löschung
  nicht beauftragt; separat auszuweisen.

---

## Phasen

### ✅ Phase 1 — Quelle & Infrastruktur prüfen
* [x] `components/Services.tsx` vollständig gelesen (4 Pakete + Preise + longDescriptions verifiziert)
* [x] `components/PageBlocks.tsx` Design-Sprache gelesen (SectionIntro, Karten-Styling, CTA)
* [x] `seo/pageSchemas.ts` geprüft (serviceSchema vorhanden; Offer-Schema bewusst später)
**Referenzen:** `components/Services.tsx`, `components/PageBlocks.tsx`

### ✅ Phase 2 — Paket-Sektion in VehicleDetailingPage einbauen
* [x] Lokale `carePackages`-Daten (faithful aus Services.tsx, Preise exakt) + Imports (`motion`, `ArrowRight`)
* [x] Sektion „Pflegepakete & Preise" (SectionIntro + Karten-Grid + MwSt-Hinweis) vor der FAQ eingebaut
* [x] Karten: Titel + Preis-Pille + volle Beschreibung + „Paket anfragen"-CTA → `/kontakt#contact-termin`
* [x] Hintergrund sauber alterniert (Paket-Sektion gray, FAQ auf white geflippt) — kein Farb-Clash
**Referenzen:** `pages/VehicleDetailingPage.tsx`

### ✅ Phase 3 — Verifikation & Doku
* [x] `tsc --noEmit` grün (Exit 0)
* [x] Preview `/fahrzeugaufbereitung-leipzig`: Sektion sichtbar (4 Preise 169/199/299/ab 348 €, SWIZÖL), 0 Console-Fehler, Screenshot
* [x] Mobile 375px: 1 Spalte, 4 Karten, kein horizontales Scrollen; Desktop: 2 Spalten
* [x] Kommentare + Findings ergänzt; Preis-Aktualität als Freigabepunkt an User gemeldet
**Referenzen:** `pages/VehicleDetailingPage.tsx`

---

## Kommentare

### Phase 1–3 (Pflegepakete auf Detailing-Landingpage)
**Eingehalten:** genuine, faktenreiche Copy sichtbar gemacht (Preise, Materialien, Verfahren) → starkes SEO/GEO-Signal
✅, alles im initialen HTML (crawlbar, kein JS-Expand) ✅, Mobile-First (1 Spalte, kein h-Scroll @375px) ✅,
Design-konsistent (PageBlocks-Stil, Preis-Pille) ✅, keine externen Bilder (self-hosted/CDN-frei) ✅, < 700 Zeilen ✅,
`tsc` grün ✅, 0 Console-Fehler ✅, Encoding sauber (Außen, „exklusiv“, SWIZÖL, –, %) ✅.

**Verifikations-Messwerte:**
- `/fahrzeugaufbereitung-leipzig`: Sektion „Pflegepakete & Preise", 4 Karten, Preise 169/199/299/ab 348 €, SWIZÖL sichtbar.
- Desktop 2-Spalten (`sm:grid-cols-2`), Mobile 375px 1-Spalte, `scrollWidth <= innerWidth` (kein h-Scroll), Sektion-BG gray-50/70.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (FREIGABE nötig vor Commit/Deploy):** Die Preise (169 / 199 / 299 / ab 348 €) stammen aus dem
   stillgelegten `Services.tsx` — Aktualität ist NICHT bestätigt. Bitte vor dem Livegang prüfen/bestätigen.
   Danach optional `Offer`/`PriceSpecification`-JSON-LD ergänzen (Standard 5.3; „nur Sichtbares auszeichnen").
2. 🟢 **Niedrig (Hinweis, NICHT beauftragt):** `components/Services.tsx` bleibt verwaist und enthält weitere
   einzigartige, nicht-live Inhalte (Desinfektion: Ozonbehandlung / Heißvernebelung inkl. Uni-Mannheim-Validierung).
   Optional später als Desinfektions-Sektion sichtbar machen — bewusst hier nicht mitgemacht (Scope war „Pakete").

**Hauptkomponenten (max. 3):** `pages/VehicleDetailingPage.tsx` (neue Sektion), `components/Services.tsx` (Quelle/verifiziert).

**Fazit:** Die faktenreichen Pflegepakete sind jetzt live auf der Detailing-Landingpage sichtbar und crawlbar —
ein echter Sichtbarkeits-/GEO-Gewinn. Einziger offener Punkt: Preis-Aktualität durch User bestätigen.
