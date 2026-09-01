# Paket B — Informationsarchitektur Fahrzeugaufbereitung

Branch: `schleife-1/paket-b` (auf `main` @ `d5244b5`)
Backlog: `docs/backlog/schleife-1.md`, Paket B — 1.8, 1.9, 1.7, 1.6, 1.10–1.13
Mit dabei: **1.16** (Data Motive, nicht mehr blockiert)

> **Abgeschlossen am 2026-09-02.** Acht Commits, Reihenfolge 1.8/1.9 vor 1.7 eingehalten.
> Nach jedem Commit Build mit beiden Wächtern — durchgehend grün.

Reihenfolge zwingend: **1.8 und 1.9 anlegen, dann 1.7.** Andernfalls zeigen die
Kacheln zwischenzeitlich ins Leere.

---

## 1 — Anatomie einer bestehenden Subseite

Eine Leistungsseite hängt an **sieben** Stellen. Fehlt eine, bricht entweder der
Build oder die Seite ist unerreichbar. Referenz: `pages/DellenentfernungPage.tsx`
(58 Zeilen, die schlankste).

| # | Datei | Was dort steht | Bricht sonst |
|---|---|---|---|
| 1 | `pages/<Name>Page.tsx` | `PageMeta` (canonical, title 50–60, description 140–160) · `PageHero` (eyebrow, title, description, 2 CTAs, keywords) · Sektionen aus `FeatureGrid`/`SectionIntro` · `<PageFAQ route="…" />` · `PageCTA` | — |
| 2 | `App.tsx` | `import` + `case '/route':` im Switch | Seite rendert 404 |
| 3 | `scripts/routes.mjs` | Eintrag in `staticRoutes` mit `changefreq`/`priority` | **Sitemap UND Prerender** — beide lesen dieselbe Quelle |
| 4 | `data/faqs.ts` | `faqsByRoute['/route']` mit den FAQ-Einträgen | `check-faq` bricht `prebuild` ab |
| 5 | `seo/pageSchemas.ts` | `breadcrumbSchema` + `serviceSchema` + `faqSchema(faqsByRoute['/route'])` | `check-faq` bricht ab, wenn die Route fehlt |
| 6 | `data/services.ts` | Katalogeintrag (`group`, `localTitle`, `listDescription`, `href`, Kachelbild) | Leistung fehlt auf Startseite und `/leistungen` |
| 7 | Navigation / interne Links | `components/Navbar.tsx` (`megaSections.leistungen`, aktuell nur 4 Einträge) und thematisch passende Bestandsseiten | Verwaiste Seite, SEO-GEO §4.4 |

**Zwei Wächter prüfen das anschließend automatisch:**
`check-faq.mjs` (prebuild) — jede Route in `faqsByRoute` wird gerendert, jedes
`faqSchema` speist sich aus der Quelle. `check-faq-html.mjs` (postbuild) — jeder
ausgezeichnete FAQ-Text steht im ausgelieferten HTML. `PageFAQ` rendert eine
offene Liste, erfüllt das also von selbst.

**Sektionsfolge, wie sie alle Subseiten teilen:**
`PageMeta` → `PageHero` → fachliche Sektion (weiß) → USP-Sektion (grau,
„Warum CarCare Center Leipzig") → FAQ-Sektion (weiß) → `PageCTA`.
Der Wechsel `bg-white` / `bg-gray-50/70` ist das durchgehende Rhythmus-Muster.

---

## 2 — Was für 1.8 und 1.9 schon da ist, was fehlt

### Vorhanden und übernehmbar

`data/detailing.ts` führt in `detailingScopes` bereits **vollständige, abgestimmte
Blöcke** für Innen-, Außen- und Lackaufbereitung: Intro-Satz plus 4–5 konkrete
Leistungspunkte je Bereich. Das ist die inhaltliche Substanz der neuen Seiten —
sie muss nicht geschrieben, sondern umgezogen werden.

| Baustein | Quelle |
|---|---|
| Intro + Leistungspunkte Innen | `data/detailing.ts` → `detailingScopes[innenaufbereitung]` |
| Intro + Leistungspunkte Außen | `data/detailing.ts` → `detailingScopes[aussenaufbereitung]` |
| USP-Block (3 Karten) | jede bestehende Subseite, wortgleich |
| Preisrahmen | `data/detailing.ts` → `carePackages` (169/199/299/348 €) |
| Ablauf-Sektion | `data/detailing.ts` → `detailingSteps` |
| Bilder | `public/assets/kacheln/innenaufbereitung-…`, s. Abschnitt 4 |

### Fehlt und muss neu entstehen

| Fehlt | Anmerkung |
|---|---|
| FAQ-Einträge je Route | Es gibt **keine**. Ohne sie bricht `check-faq` nicht, aber die Seiten verlieren ihren GEO-Anker. Pro Seite 4–6 echte Kundenfragen. |
| `PageMeta` title + description | Muster: `{Leistung} Leipzig \| {Nutzen} \| CarCare Center`, 50–60 Zeichen |
| `PageHero`-Copy | Antwort-zuerst, SEO-GEO §4.3 |
| Katalogeintrag in `data/services.ts` | inkl. Kachelbild |
| **Exklusivleistungen** | **strukturell leer, siehe unten** |

### Exklusivleistungen — bewusst leer

Vorgabe: Abschnitte anlegen, **keine Platzhaltertexte**. Erfundene Inhalte sehen
im Review wie fertiger Text aus und gehen live.

Der Backlog nennt die Leistungen namentlich — sie stammen aus dem Kundenreview,
sind also keine Erfindung: Außen — Keramikversiegelung, Nanoversiegelung,
Lackbausteine. Innen — Alcantara-Lenkrad ausbauen und aufarbeiten,
Schaum-/Tornador-Verfahren.

**Entscheidung nötig:** Sektionsüberschrift plus die **nackten Bezeichnungen**
ohne Beschreibungstext — oder Sektion komplett leer bis zur Zulieferung? Ich
neige zu den nackten Bezeichnungen: sie sind belegt, und die Lücke ist im Review
sichtbar, weil keine Beschreibung darunter steht. Eine völlig leere Sektion
fällt beim Durchsehen dagegen gar nicht auf.

### Konflikt, der vorab zu klären ist: Dublette zur Bestandsseite

`/fahrzeugaufbereitung-leipzig` rendert die drei `detailingScopes` heute als
eigene Sektionen mit Ankern `#innenaufbereitung`, `#aussenaufbereitung`,
`#lackaufbereitung`. Bekommen Innen und Außen eigene Seiten, steht derselbe Text
an zwei URLs — Thin/Duplicate Content, SEO-GEO §4.5.

Drei Wege:

| | Ansatz | Folge |
|---|---|---|
| **a** *(Empfehlung)* | Auf der Bestandsseite bleiben Innen/Außen als **kurzer Teaser** (2 Sätze) mit Link auf die neue Seite; die Detailliste zieht um | Klare Hierarchie Pillar → Detail, keine Dublette, Anker bleiben gültig |
| b | Bestandsseite unverändert, neue Seiten mit komplett neuem Text | Doppelter Schreibaufwand, Dublettenrisiko bleibt |
| c | Sektionen auf der Bestandsseite ersatzlos streichen | Pillar-Seite verliert Substanz |

Außerdem: die Ratgeber `/autoaufbereitung-wissen/innenaufbereitung` und
`…/lackaufbereitung` bleiben unangetastet. Sie bedienen **informational**, die
neuen Seiten **kommerziell** (SEO-GEO §4.1) — beide werden wechselseitig verlinkt.

**Routen-Vorschlag:** `/innenaufbereitung-leipzig` und `/aussenaufbereitung-leipzig`,
konsistent zum Bestandsmuster `{leistung}-leipzig`.

---

## 3 — Was alles an 1.7 hängt

„Kachel Lackaufbereitung auf der Mainpage entfernen." Betroffen ist genau **eine**
Kachel — aber die Prüfliste ist länger als die Änderung.

| Anschlusspunkt | Betroffen? | Warum |
|---|---|---|
| `components/AutoDetailingExpertiseSection.tsx` → `expertiseCards` | **ja** | Hier liegt die Kachel (`id: 'lack'`). Entfernen. |
| Verbleibende Kacheln | **prüfen** | Danach: Innen, Außen, Leasingrückgabe **plus** die fünfte Karte „Mehr über Aufbereitung erfahren". Der Backlog nennt nur drei — **soll die Wissens-Karte bleiben?** Sie ist keine Leistung, sondern der Hub-Einstieg. |
| Aufklapp-Mechanik | **ja, indirekt** | Der Kommentar in der Datei sagt: „Der Aufklapp-Effekt lebt vom Bildwechsel." Von 5 auf 4 Karten ändert sich die Grid-Aufteilung — nach dem Umbau visuell prüfen. |
| Link `#lackaufbereitung` | **nein** | Der Anker auf `/fahrzeugaufbereitung-leipzig` bleibt bestehen, nur die Kachel zeigt nicht mehr darauf. |
| `data/detailing.ts` → `detailingScopes[lackaufbereitung]` | **nein** | Das ist die Subseiten-Sektion, nicht die Mainpage-Kachel. Bleibt. |
| `App.tsx` · `scripts/routes.mjs` · Sitemap · Prerender | **nein** | Es verschwindet keine Route, nur eine Kachel. |
| `data/faqs.ts` · `seo/pageSchemas.ts` | **nein** | Keine FAQ und kein Schema hängen an der Kachel. |
| `check-faq` / `check-faq-html` | **nein**, laufen aber mit | Beide müssen nach dem Umbau grün sein. |
| `data/services.ts` | **nein** | „Lackaufbereitung" ist dort keine eigene Leistung. |
| Sitemap-URL-Zahl | **nein** | bleibt bei 23 |

**Ergebnis:** 1.7 ist eine Ein-Datei-Änderung. Die Liste ist trotzdem nötig,
um genau das zu belegen — nicht um sie abzuarbeiten.

---

## 4 — 1.13, Bild-Rochade

Vorgabe: Lackaufbereitungsbild → Außenaufbereitung, bisheriges
Außenaufbereitungsbild → Leasingrückgabe.

| Karte | heute | nach der Rochade |
|---|---|---|
| Außenaufbereitung | `smart-repair-leipzig-carcare.webp` | `fahrzeugaufbereitung-leipzig-carcare.webp` |
| Leasingrückgabe | `leasingrueckgabe-leipzig-carcare.webp` *(Interim)* | `smart-repair-leipzig-carcare.webp` |
| Lackaufbereitung | `fahrzeugaufbereitung-leipzig-carcare.webp` | entfällt mit 1.7 |

**Zwei Fallstricke:**

1. **Die Bildzuordnung liegt doppelt.** `data/detailing.ts` (`detailingScopes`)
   und `components/AutoDetailingExpertiseSection.tsx` (`expertiseCards`)
   referenzieren dieselben Dateien getrennt voneinander. Wird nur eine Stelle
   gedreht, laufen Kachel und Subseiten-Sektion auseinander — dasselbe Muster
   wie bei den FAQ vor dem Single-Source-Umbau. **Beide Stellen gemeinsam.**
2. **Die Dateinamen passen danach nicht mehr zum Inhalt.** `smart-repair-…webp`
   als Leasingrückgabe-Motiv ist verwirrend für jeden, der später daran arbeitet.
   Vorschlag: Dateien mitumbenennen (`npm run images` erzeugt sie aus den
   Originalen) — oder bewusst so lassen und im Dateikommentar festhalten.
   **Entscheidung nötig.**

Die `imageAlt`-Texte müssen mit den Bildern wandern, sonst beschreibt der
Alt-Text das falsche Motiv.

---

## 5 — Commit-Aufteilung

Reihenfolge folgt der Abhängigkeit, jeder Commit für sich baubar.

| # | Commit | Inhalt |
|---|---|---|
| 1 | `Feat: Subseite Aussenaufbereitung` | 1.8 — Seite, Route, `faqsByRoute`, Schema, `services.ts`, Navigation. Exklusivleistungen strukturell leer. |
| 2 | `Feat: Subseite Innenaufbereitung` | 1.9 — analog |
| 3 | `Refactor: Aufbereitungsseite verweist auf die neuen Subseiten` | Weg (a): Teaser statt Volltext auf `/fahrzeugaufbereitung-leipzig`, wechselseitige Links zu den Ratgebern |
| 4 | `Feat: Kachel Lackaufbereitung entfernt, Bild-Rochade` | 1.7 + 1.13 zusammen — sie greifen in dieselbe Datei und dieselben Bildpfade |
| 5 | `Content: Kacheltext Aufbereitung auf Werterhalt erweitert` | 1.6 |
| 6 | `Content: Ozon und Heissvernebelung nach oben` | 1.10 + 1.11 |
| 7 | `Content: Scheinwerferaufbereitung entfernt` | 1.12 |
| 8 | `Content: Data Motive auf der Geschaeftskundenseite` | 1.16 |
| 9 | `Docs: Paket B dokumentiert` | Phasenprotokoll, Backlog-Status, Optimierungsplan |

Nach **jedem** Commit: `npm run build` mit beiden Wächtern. Nach Commit 1 und 2
zusätzlich die Route im gebauten `dist/` prüfen (Prerender 23 → 25 Routen).

---

## Offene Entscheidungen vor dem ersten Commit

1. **Dublettenstrategie** — Weg (a), (b) oder (c) aus Abschnitt 2?
2. **Exklusivleistungen** — nackte Bezeichnungen oder komplett leere Sektion?
3. **Wissens-Karte** — bleibt sie nach 1.7 als vierte Kachel stehen?
4. **Bilddateinamen** — nach der Rochade umbenennen oder so lassen?
5. **Routen** — `/innenaufbereitung-leipzig` und `/aussenaufbereitung-leipzig`?

## Zulieferung, die noch fehlt

- **1.18** — Liste der Zusatzleistungen fürs Aufbereitungsformular (beim Kunden).
  Betrifft Paket E, nicht Paket B; die Exklusivleistungs-Abschnitte hier bleiben
  davon unabhängig strukturell leer.
- **1.26** — Benefits und Mitarbeiterstimmen für die Karriereseite (Paket D).


---

## Phasenprotokoll

### ✅ 1.8 / 1.9 — die beiden neuen Subseiten
* [x] `/aussenaufbereitung-leipzig` — trägt auch die Lackaufbereitung ausführlich,
      weil deren Kachel mit 1.7 entfällt und der Inhalt hier aufgeht
* [x] `/innenaufbereitung-leipzig`
* [x] Je alle sieben Anschlusspunkte: Seite, `App.tsx`, `scripts/routes.mjs`,
      `data/faqs.ts`, `seo/pageSchemas.ts`, `data/services.ts`, interne Verlinkung
* [x] Je fünf FAQ-Einträge mit echten Preisen aus `data/detailing.ts`
* [x] Titles 59/60 Zeichen, Descriptions 157/157 — beide im SEO-GEO-Korridor
* [x] Exklusivleistungen strukturell, ohne Text, mit `TODO 1.18`-Kommentar
* [x] Nachträglich auf `BackdropLayout` und die halbtransparenten Ablauf-Karten
      umgestellt (User-Sichtung); gegen die Referenzseite gemessen, nicht geschaut

**Referenzen:** `pages/AussenaufbereitungPage.tsx` · `pages/InnenaufbereitungPage.tsx` · `data/faqs.ts`

### ✅ Dublettenstrategie (a)
* [x] Teaser auf `/fahrzeugaufbereitung-leipzig`, **eigenständig formuliert**
* [x] `DetailingScope.items` optional, Detaillisten stehen auf den neuen Seiten
* [x] Ratgeber-Links auf die neuen Seiten gewandert, wechselseitige Verlinkung

### ✅ 1.7 / 1.13 — Kachel raus, Bilder gedreht
* [x] Lack-Kachel entfernt, vier Karten bleiben (Wissens-Karte inklusive)
* [x] Rochade samt `imageAlt`; Bildzuordnung einquellig in `aufbereitungKacheln`
* [x] Grid 5→4 gemessen: Desktop 1440 px eine Zeile, mobil 375 px gestapelt,
      kein horizontaler Überlauf
* [x] Dateinamen **nicht** umbenannt — Begründung im Commit und in
      `data/detailing.ts`, Nachfolge als Backlog 1.28

### ✅ 1.6 · 1.10 · 1.11 · 1.12 · 1.16
* [x] 1.6 Kacheltext auf Alltag und Werterhalt erweitert
* [x] 1.10 Desinfektion direkt unter die Pflegepakete — im gebauten HTML
      nachgemessen (4186 → 5421 → 6370 → 8823)
* [x] 1.11 zusätzlich als „Optional buchbar" auf der **neuen** Subseite
* [x] 1.12 Scheinwerferaufbereitung entfernt — vollständige Suche vorgelegt,
      genau eine Fundstelle, nie im JSON-LD
* [x] 1.16 Data Motive, Karte plus FAQ-Eintrag in der Single Source

---

## Kommentare

### Paket B gesamt
**Eingehalten**: Reihenfolge 1.8/1.9 vor 1.7 ✅, Build mit beiden Wächtern nach
jedem Commit ✅, keine erfundenen Inhalte auf Kundenseiten ✅, SEO-GEO-Korridore
für Title und Description ✅, alle Dateien unter 700 Zeilen ✅, Encoding sauber ✅

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch:** `DetailingGallery` führt eine zweite, ungeprüfte Leistungsliste.
   Solange Platzhalter, folgenlos; mit echten Fotos wird sie zur Aussage über das
   Angebot. → eigener Optimierungsplan, Punkt 1.
2. 🟡 **Mittel:** Bildmotive doppelt belegt, Umbenennen scheidet aus. → Backlog 1.28.
3. 🟡 **Mittel, behoben:** Die Bildzuordnung lag doppelt (Daten + Komponente). Der
   Umbau war klein genug, um ihn in 1.13 mitzunehmen statt zu vertagen.

**Zwei Selbstkorrekturen unterwegs:** In den Teasern hatte ich „Bremsstaub an den
Felgen" und „Rückstände an Front, Spiegeln und Scheiben" ergänzt — plausibel, aber
in der abgestimmten Quelle nicht belegt. Zurückgenommen. Auf einer Kundenseite ist
das der Unterschied zwischen Übernehmen und Ausschmücken.
