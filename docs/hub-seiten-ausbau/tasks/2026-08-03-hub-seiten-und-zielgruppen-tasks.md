# Hub-Seiten ausbauen: Aufbereitung, Unfallinstandsetzung, Privat- und Geschäftskunden

**Auftrag (User, 2026-08-03), im Anschluss an
`docs/leistungen-nav-restructure/tasks/2026-08-03-leistungsuebersicht-und-navigation-tasks.md`:**

1. **Navbar:** Bei „Unfallinstandsetzung" gehört **Lackierung** mit in die Beschreibung.
2. **Zwei Subpages = zwei Serviceleistungsstränge.**
   * **Autoaufbereitung** (`/fahrzeugaufbereitung-leipzig`): alle wichtigen Infos aus der
     Fahrzeugaufbereitungskarte, Leasingrückgabe, Innenaufbereitung, Außenaufbereitung,
     Lackaufbereitung, die aktuellen FAQs **und** die Prozesskarten. Dazu das **direkte
     Pricing** der einzelnen Aufbereitungsangebote.
   * **Unfallinstandsetzung** (`/unfallinstandsetzung-leipzig`): folgende Karten darstellen
     **und beschreiben** — Unfallinstandsetzung, Neu- und Reparaturlackierung, Smart Repair,
     Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas & Scheibenfolien.
3. **Privatkunden** (`/privatkunden`): stärker die **Vorteile** für Privatkunden erläutern,
   auf bestehende Infos eingehen und weitere wichtige Aspekte ergänzen.
4. **Geschäftskunden** (`/geschaeftskunden`): Angebote spezifiziert erläutern, die
   **Zusammenarbeit** mit bestehenden Unternehmen in den Vordergrund rücken, die auf der
   Mainpage genannten Unternehmen erwähnen, die Karten **Leasingrückgabe** und
   **Fuhrparkservice** highlighten und **Schadensteuerer + Versicherungen** als
   Geschäftskunden benennen.

---

## Ausgangsbefund (verifiziert 2026-08-03)

* **Preise existieren bereits** in `pages/VehicleDetailingPage.tsx`: 4 Pflegepakete
  (169,00 € / 199,00 € / 299,00 € / ab 348,00 €) und 2 Desinfektionsleistungen
  (45,00 € / 59,00 €). Sie sind aber **nicht** als strukturierte Daten ausgezeichnet —
  für KI-Antworten ist genau das der zitierbare Teil.
* Die zwei Preis-Raster auf der Aufbereitungsseite sind **markup-identisch** dupliziert
  (Zeilen 89–109 und 122–142) → gehört in eine Komponente.
* Die Prozesskarten liegen in `components/DetailingProcessSection.tsx` (5 Schritte) und
  `components/AccidentDamageSection.tsx` (5 Schritte), Wortlaut mit der Geschäftsführung
  abgestimmt. Die Hub-Seiten führen bisher **abweichende** eigene Ablauflisten.
* Die auf der Mainpage genannten Unternehmen stehen fest verdrahtet in
  `components/TargetGroupCards.tsx`: **5 Autohäuser** (Volkswagen Automobile Leipzig,
  Audi Zentrum Leipzig, Porsche Zentrum Leipzig, Porsche Werk Leipzig, Autohaus Otto Grimm)
  und **31 Versicherer**. Für die Geschäftskundenseite müssen sie geteilt nutzbar sein.
* Die 7 vom User genannten Unfall-Karten entsprechen exakt den Katalog-Gruppen
  `unfall-lack` (5) + `rad-glas` (2) aus `data/services.ts` → ableitbar statt neu pflegen.

---

## Phasenplanung

### ✅ Phase 3 — Fundament: Schema, Preis-Komponente, geteilte Daten
* [x] `offerCatalogSchema()` in `seo/structuredData.ts` — „ab"-Preise werden bewusst als
      `PriceSpecification.minPrice` ausgezeichnet, nicht als Fixpreis
* [x] `PricingGrid` in `components/PageBlocks.tsx` — entdoppelt die zwei identischen Raster
* [x] `data/detailing.ts` (137 Z.): Pakete, Desinfektion, 3 Aufbereitungsbereiche, Ablauf
* [x] `data/partners.ts` (61 Z.): 5 Autohäuser + 31 Versicherer, geteilt mit `TargetGroupCards`

### ✅ Phase 4 — Hub „Autoaufbereitung" (`pages/VehicleDetailingPage.tsx`, 197 Z.)
* [x] Innen-/Außen-/Lackaufbereitung als eigene Blöcke mit je 4–5 konkreten Arbeitsschritten
* [x] Leasingrückgabe als eigener Abschnitt (`#leasingrueckgabe`) mit 4 Karten + 3 Querlinks
* [x] Ablauf **wortgleich** zu `components/DetailingProcessSection.tsx`
* [x] Preise nach oben gezogen (`#preise`) — häufigste Frage und zitierbarster Teil
* [x] FAQ 3 → **8** Fragen, inkl. konkreter Preisantwort
* [x] `Offer`-Schema: 6 Preise maschinenlesbar

### ✅ Phase 5 — Hub „Unfallinstandsetzung" (`pages/AccidentRepairPage.tsx`, 183 Z.)
* [x] Die 7 Karten dargestellt und beschrieben; erste Karte bewusst **ohne** Link
      (kein Selbstverweis), die übrigen 6 verlinken in die Detailseiten
* [x] Ablauf **wortgleich** zur Schadenreise `components/AccidentDamageSection.tsx`
* [x] „Leistungen im Schadenfall" auf 8 Punkte erweitert, Zielgruppen verlinkt
* [x] FAQ 3 → **7** Fragen

### ✅ Phase 6 — Privatkunden vertiefen (`pages/PrivatkundenPage.tsx`, 209 Z.)
* [x] Neuer Schwerpunktabschnitt „Ihre Vorteile" mit 8 konkreten Punkten
* [x] Neuer Abschnitt „Typische Anlässe" (4 Situationen mit passendem Einstieg)
* [x] Feste Aufbereitungspreise als Transparenz-Vorteil eingebaut — jetzt möglich, weil die
      Preise belegt vorliegen; für Reparaturen weiterhin Kostenvoranschlag statt Fantasiespanne
* [x] FAQ 6 → **8** Fragen

### ✅ Phase 7 — Geschäftskunden vertiefen (`pages/BusinessCustomersPage.tsx`, 239 Z.)
* [x] Zielgruppen um **Schadensteuerer** erweitert und ausdrücklich benannt
* [x] Schwerpunktabschnitt: **Leasingrückgabe** und **Fuhrparkservice** als große Karten
* [x] Abschnitt „Angebote im Überblick" (8 verlinkte Leistungen)
* [x] Abschnitt „Zusammenarbeit" (8 Punkte) rückt die Partnerschaft in den Vordergrund
* [x] Abschnitt „Bestehende Zusammenarbeit": 5 Autohäuser + 31 Versicherer namentlich
* [x] FAQ 3 → **7** Fragen

### ✅ Phase 8 — Navbar, Schema-Abgleich, Verifikation
* [x] Navbar: „Smart Repair & Karosseriearbeiten" → **„Karosserie, Lackierung & Smart Repair"**
* [x] `seo/pageSchemas.ts`: alle vier FAQ-Sätze und drei `serviceSchema`-Texte abgeglichen
* [x] `npx tsc --noEmit` fehlerfrei, alle Dateien unter 700 Zeilen
* [x] `npm run build` mit `PRERENDER_STRICT=1`: **21/21 Routen**
* [x] Prerender-Kontrolle: je genau 1 × `h1`, FAQ 8/7/8/7/5, **6 × `Offer`**, kein Mojibake
* [x] Browser: Preise, 3 Umfangblöcke, Leasing-Abschnitt, 7 Unfallkarten, 31 Versicherer,
      Startseiten-Kacheln nach dem Partner-Refactor unverändert

---

## Kommentare

### Phasen 3–8
**Eingehalten:** unter 700 Zeilen ✅ (größte berührte Datei `TargetGroupCards.tsx`, 468 Z.),
Mobile-First ✅, Single Source of Truth für Partner und Aufbereitungsinhalte ✅,
Schema nur für sichtbaren Inhalt (§5) ✅, Antwort-zuerst in allen FAQs (§4.3) ✅,
konkrete Fakten statt Floskeln (§4.5) ✅, interne Cluster-Verlinkung (§4.4) ✅,
Ansprache „Sie" ✅, Encoding sauber ✅, kein Dev-Server-Autostart ✅.

**Auffälligkeiten (nach Schwere):**

1. 🔴 **Kritisch — GEFUNDEN UND BEHOBEN (vorbestehender Bug):**
   `components/DetailingGallery.tsx` rief `useScroll({ target: bandRef })` auf, hängte
   `bandRef` aber **nur im Animations-Zweig** an. Bei aktiviertem `prefers-reduced-motion`
   rendert stattdessen `StaticGrid`, der Ref blieb leer und Framer Motion warf
   „Target ref is defined but not hydrated". Der Fehler war ungefangen → React räumte den
   kompletten Baum ab, **`/fahrzeugaufbereitung-leipzig` blieb weiß**.
   *Warum es niemand bemerkt hat:* Der Prerender lief immer sauber durch, weil
   Headless-Chrome kein reduced-motion meldet — das statische HTML war vollständig, erst
   der Client-Mount brach ab. Laut Projektnotiz meldet **Windows reduced-motion systemweit**,
   der Ausfall traf also reale Besucher. **Fix:** `bandRef` hängt jetzt am äußeren
   Container und ist in beiden Zweigen hydriert.
   **Lehre für die Verifikation:** Ein grüner Prerender beweist nicht, dass die Seite im
   Browser lebt. Client-Mount separat prüfen.

2. 🟠 **Hoch — BEHOBEN:** Beim Auslagern der Partnerliste fiel zunächst **ein Versicherer
   (Wefox)** aus der Übertragung — 30 statt 31. Beim Gegenzählen aufgefallen und korrigiert;
   die Startseite zeigt wieder alle 31.

3. 🟡 **Mittel — BEHOBEN:** Die zwei Preis-Raster auf der Aufbereitungsseite waren
   markup-identisch dupliziert. Jetzt eine `PricingGrid`-Komponente.

4. 🟡 **Mittel — OFFEN, unverändert:** `Leasingrückgabe` hat weiterhin keine eigene Seite.
   Sie ist auf der Aufbereitungsseite jetzt ein vollwertiger Abschnitt
   (`/fahrzeugaufbereitung-leipzig#leasingrueckgabe`), auf den Kachel, `/leistungen`,
   `/privatkunden` und `/geschaeftskunden` zeigen. Eine eigene URL bleibt sinnvoll.

5. 🟢 **Niedrig — Werkzeug:** Der Konsolen-Puffer des Browser-Panels sammelt über die
   Session und leert sich beim Navigieren nicht; alte HMR-Fehler aus Zwischenständen
   (Nutzung vor Import) wirken dadurch wie aktuelle. Verlässlich ist erst ein echter
   Reload — genau der hat den Bug aus Punkt 1 dann auch sichtbar gemacht.
