# Subpages & Verlinkung — Startseiten-Karten auf die richtigen Ziele

**Auftrag vom User (2026-08-09), Schritt für Schritt durch die Startseiten-Karten.**

Ausgangspunkt ist die im selben Chat erstellte Linkliste der Startseite. Der User hat sie
Karte für Karte durchgegangen und pro Position entschieden: bleibt, wird geändert, oder
kommt auf die To-Do-Liste.

---

## Abgenommen — KEINE Änderung (User bestätigt)

Diese Leistungskarten zeigen bereits auf das richtige Ziel und werden **nicht** angefasst:

| Karte | Ziel |
|---|---|
| Fahrzeugaufbereitung | `/fahrzeugaufbereitung-leipzig` |
| Unfallinstandsetzung | `/unfallinstandsetzung-leipzig` |
| Neu- und Reparaturlackierung | `/autolackierung-leipzig` |
| Smart Repair | `/smart-repair-leipzig` |
| Hagelschadenreparatur | `/hagelschadenreparatur-leipzig` |
| Felgenreparatur | `/felgenreparatur-leipzig` |
| Autoglas / Scheibenfolien | `/autoglas-leipzig` |
| Fuhrparkservice | `/fuhrparkservice-leipzig` |

> **Anmerkung zu „Dellenentfernung":** In der Aufzählung des Users nicht genannt, liegt
> aber in der Liste **vor** dem Punkt „ab hier ändern" (= Leasingrückgabe) und zeigt
> korrekt auf `/dellenentfernung-leipzig`. Wird daher wie die übrigen als abgenommen
> behandelt und **nicht** geändert. Falls das ein Versehen war: einzeilige Korrektur.

---

## 📋 To-Do-Liste — vom User bewusst vertagt, HEUTE NICHT umsetzen

Diese vier Punkte sind aufgenommen, aber ausdrücklich **nicht** Teil dieses Durchgangs.

* [ ] **T1 — Hero-Sektion Action-Buttons.** Die beiden Hero-CTAs (`Schaden melden`,
      `Termin für Aufbereitung anfragen`) sollen später überarbeitet werden.
      Aktuell: `/kontakt#contact-schaden` und `/kontakt#contact-termin`.
* [ ] **T2 — Unfall: „Schaden jetzt melden" (2×).** In `AccidentDamageSection`.
      Aktuell beide auf `/kontakt#contact-schaden`.
* [ ] **T3 — Zielgruppen: „Partnerschaft anfragen" (2×).** Sekundär-CTA der Karten
      „Versicherungen & Agenturen" und „Autohäuser & Fuhrparks".
      Aktuell beide auf `/kontakt#contact-business`.
* [ ] **T4 — Zweiter Knopf auf den Mainpage-Aufbereitungskarten → Wissensdatenbank.**
      Nach Phase 5 zeigen diese Karten auf die Aufbereitungsseite. Der Wissens-Link
      (bisheriges Ziel) soll später als **zusätzlicher** zweiter Button zurückkommen,
      damit der Ratgeber-Strang nicht verloren geht. Ausdrücklich „aber nicht jetzt".

---

## ✅ Phase 1 — Planung, Bestandsaufnahme, Entscheidungen
**Ziel:** Auftrag in Phasen zerlegen, Ist-Stand der betroffenen Dateien erfassen,
Slugs und inhaltliche Leitplanken festlegen, bevor Code entsteht.

* [x] Startseiten-Links vollständig erhoben (DOM-Scan im laufenden Localhost)
* [x] Betroffene Dateien gelesen: `VehicleDetailingPage.tsx` (217 Z.),
      `AutoDetailingExpertiseSection.tsx`, `TargetGroupCards.tsx`, `data/services.ts`,
      `data/detailing.ts`, `PageBlocks.tsx`, `App.tsx`, `seo/pageSchemas.ts`,
      `scripts/routes.mjs`
* [x] `PrivatkundenPage.tsx` als Bauvorlage für neue Seiten identifiziert
* [x] **Fund:** `components/About.tsx` ist verwaist (nirgends importiert), enthält aber
      **echte Kundentexte** zum Unternehmen → Quelle für die Über-uns-Seite, nicht neu erfinden
* [x] Slugs festgelegt (Begründung unten)
* [x] Diese Datei angelegt

### Slug-Entscheidungen
| Seite | Slug | Begründung |
|---|---|---|
| Leasingrückgabe | `/leasingrueckgabe-leipzig` | Leistungsseite → `-leipzig`-Muster wie alle anderen Leistungen; Keyword „Leasingrückgabe Leipzig" (SEO-GEO §3.1 LOKAL-Muster) |
| Über uns | `/ueber-uns` | Unternehmensseite ohne Ortskeyword → Muster von `/privatkunden`, `/geschaeftskunden`, `/karriere`, `/kontakt` |

### Inhaltliche Leitplanken
- Nur belegte Fakten (SEO-GEO §4.5). Verfügbar: seit 1993, über 30 Jahre, Meisterbetrieb
  des Kfz-Lackierhandwerks, Glasurit-Lackpartner, 3.000 qm, über 50 Mitarbeiter,
  WINTEC-Partner (Glas), Audatex (Kalkulation), SWIZÖL-Wachse, Werkstattersatzfahrzeug.
- Keine erfundenen Preise. Leasingrückgabe hat **keine** Listenpreise → Kostenvoranschlag
  nennen; Aufbereitungspreise (169/199/299/ab 348 €) sind belegt und dürfen zitiert werden.
- Ansprache „Sie", `de-DE` (CLAUDE.md §0).

### ⚠️ Zwei Punkte, die der User bestätigen muss
1. **„größter und bester Betrieb"** — vom User so beauftragt. Eine unbelegte
   Alleinstellungsbehauptung ist in Deutschland nach UWG §5 abmahnfähig. Umgesetzt wird
   daher die belegbare Variante („einer der größten … in Leipzig und Umgebung") plus die
   harten Fakten, die die Aussage selbst tragen. Umstellung auf den harten Superlativ ist
   eine Einzeiländerung, sobald der User die Belegbarkeit bestätigt.
2. **„10 Standorte"** — steht so in `components/About.tsx` (Kundentext), ist aber nirgends
   belegt und widerspricht dem Ein-Standort-`LocalBusiness`-Schema (eine Adresse, ein
   `geo`). **Entscheidung: NICHT übernommen.** Eine unbelegte Standortzahl auf einer
   Unternehmensseite ist gegenüber Versicherern und Geschäftspartnern das falsche Risiko,
   und `About.tsx` ist nicht live (nirgends importiert) — es wird also nichts entfernt,
   sondern nur nicht neu behauptet. Nachtragen ist ein Einzeiler, sobald bestätigt.
   Übernommen wurde stattdessen die belegbare Kundenaussage „betreuen vor allem
   Werksniederlassungen der deutschen Premiumhersteller".

**Referenzen:**
`docs/subpages-verlinkung/tasks/2026-08-09-subpages-verlinkung-tasks.md`
`components/About.tsx`
`pages/PrivatkundenPage.tsx`

---

## ✅ Phase 2 — Subpage Leasingrückgabe *(Auftragspunkt 1)*
**Ziel:** Eigene Seite für Leasingrückgabe mit den wichtigsten Infos für **beide**
Zielgruppen (Privatkunden **und** Geschäftskunden). Beendet das „drei Karten, ein Ziel"-
Problem auf `/fahrzeugaufbereitung-leipzig`.

* [x] `pages/LeasingrueckgabePage.tsx` angelegt (265 Z., Komposition aus `PageBlocks`)
* [x] Route `/leasingrueckgabe-leipzig` in `App.tsx`
* [x] `scripts/routes.mjs` erweitert (Sitemap + Prerender ziehen automatisch nach)
* [x] `seo/pageSchemas.ts`: Service + FAQPage + BreadcrumbList, `leasingFaq` wortgleich zur Seite
* [x] `data/services.ts`: `href` umgestellt, `TODO` entfernt
* [x] Zwei getrennte Abschnitte `#privatkunden` und `#geschaeftskunden` statt Mischtext
* [x] Abgrenzung zum Ratgeber gesetzt: Leistungsseite (kommerziell) verlinkt auf
      `/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten` (informational) — §4.1
* [x] **Verifiziert:** Title 56 Z., Description 155 Z., genau eine `h1`, Canonical korrekt,
      Schema `BreadcrumbList + Service + FAQPage` im DOM, `tsc` Exit 0

**Referenzen:**
`pages/LeasingrueckgabePage.tsx`
`seo/pageSchemas.ts`
`data/services.ts`

---

## ✅ Phase 3 — Zielgruppen-Karte „Für Privatkunden" *(Auftragspunkt 3)*
**Ziel:** Die Karte zeigt auf die vorhandene Privatkundenseite statt auf die Aufbereitung.

* [x] `components/TargetGroupCards.tsx`: `href` → `/privatkunden`
* [x] Ursache im Code kommentiert (Zeiger stammte aus der Zeit vor Existenz der Seite)

**Referenzen:**
`components/TargetGroupCards.tsx`

---

## ✅ Phase 4 — Subpage „Über uns" *(Auftragspunkt 4)*
**Ziel:** BS CarCare GmbH vorstellen — Größe, Können, Historie. Zahlt gleichzeitig auf
drei Zielgruppen ein: neue Mitarbeiter, Geschäftspartner, Neukunden.

* [x] `pages/UeberUnsPage.tsx` angelegt (219 Z.), Texte aus `components/About.tsx` übernommen
      und um belegte Betriebsfakten ergänzt; `About.tsx` bleibt unangetastet
* [x] Route `/ueber-uns` in `App.tsx`
* [x] `scripts/routes.mjs` erweitert
* [x] `seo/structuredData.ts`: `aboutPageSchema()` neu — `AboutPage` mit `foundingDate 1993`,
      `numberOfEmployees ≥ 50`, `knowsAbout` (9 Leistungen)
* [x] `seo/pageSchemas.ts`: AboutPage + FAQPage + BreadcrumbList
* [x] `TargetGroupCards.tsx`: „Schadenpartner kennenlernen" → `/ueber-uns`
* [x] Je ein eigener Abschnitt für die drei Zielgruppen: `#kunden` (Neukunden/Partner),
      `#karriere` (Mitarbeiter), `#qualifikationen` (Geschäftspartner)
* [x] **Verifiziert:** Title 57 Z., Description auf 153 Z. korrigiert (war 161, ein Zeichen
      über §3.1), genau eine `h1`, Schema `AboutPage + FAQPage` im DOM, `tsc` Exit 0

**Referenzen:**
`pages/UeberUnsPage.tsx`
`seo/structuredData.ts`
`components/TargetGroupCards.tsx`

---

## ✅ Phase 5 — Aufbereitungskarten auf Sektions-Anker + Fotos *(Auftragspunkt 6)*
**Ziel:** Die Karten der Startseiten-Sektion „Autoaufbereitung" führen auf den jeweiligen
**Textbereich** der Aufbereitungsseite statt in den Wissensbereich. Das Kachelfoto wird
in der Zielsektion wiederverwendet, damit Karte und Ziel sichtbar zusammengehören.

* [x] `data/detailing.ts`: `DetailingScope` um `id`, `image`, `imageAlt`,
      `imageWidth`, `imageHeight` erweitert
* [x] `VehicleDetailingPage.tsx`: **Layout unverändert** — jede Karte des bestehenden
      Rasters bekommt `id` als Sprungziel, `scroll-mt-28` und ihr Kachelfoto
* [x] `AutoDetailingExpertiseSection.tsx`: drei Karten auf `#`-Anker,
      „Leasingrückgabe vorbereiten" auf die neue Seite aus Phase 2
* [x] **Verifiziert:** Hash-Sprung landet bei exakt 112 px (= `scroll-mt-28`), Karte
      sichtbar, Fotos korrekt zugeordnet, kein horizontaler Overflow, `tsc` Exit 0,
      Build + Prerender 23/23

### ⚠️ Zwischenzeitlicher Umbau — vom User zurückgewiesen, rückgängig gemacht
Im ersten Anlauf hatte ich das Kartenraster durch **drei volle Bildsektionen** ersetzt
(`components/DetailingScopeSections.tsx`, Bild links/rechts alternierend). Begründung
damals: Im Raster stehen auf Desktop alle drei Karten in derselben Zeile, ein Anker
differenziert dort nicht.

**Der User meldete daraufhin, dass die Seite „ab dem Punkt *Ergebnisse, die man sieht*
visuell rumbuggt", und forderte den Effekt von vorher zurück.** Der Umbau ist deshalb
vollständig zurückgenommen, die Komponente gelöscht.

**Was der Umbau tatsächlich angerichtet hat — nachgemessen im direkten Vorher/Nachher-
Vergleich (`git stash`):**

| | Original | Nach Umbau | Nach Rücknahme |
|---|---|---|---|
| Sektionen der Seite | 10 | 13 | **10** |
| `#umfang` Höhe | 967 px | 2.356 px | **1.216 px** |
| Galerie beginnt bei | 3.563 px | 5.008 px | **3.812 px** |
| Dokumenthöhe | 10.422 px | 11.923 px | **10.726 px** |

Auf dieser Seite ist **jede** Sektion transparent (`.cc-backdrop-content > section`), das
Sticky-Foto und seine drei Verlaufsebenen werden also unter dem gesamten Inhalt pro
Scrollframe neu gezeichnet. Der Umbau legte darüber 2.040 px zusätzliche Fläche mit drei
großformatigen Bildern und `shadow-lg` — grosse weiche Schatten sind teuer im Repaint.
Bemerkbar macht sich so etwas zuerst dort, wo etwas **animiert**: in der Parallax-Galerie
direkt darunter. Deren Code war nie verändert, nur ihre Umgebung.

**Lehre:** Auf einer Seite mit seitenlangem Sticky-Hintergrund ist zusätzliche Bildfläche
mit weichen Schatten nicht kosmetisch, sondern eine Performance-Entscheidung. Und: Der
Auftrag verlangte ein Sprungziel plus Fotowiederverwendung — **kein** neues Layout. Der
Umbau war unnötige Eigenmächtigkeit über den Auftrag hinaus.

**Zur ursprünglichen Anker-Sorge:** Sie war real, wiegt aber leichter als gedacht. Die
drei Karten stehen zwar nebeneinander, aber jede trägt jetzt ihr eigenes Foto — wer aus
der Startseiten-Kachel „Innenaufbereitung" kommt, sieht dasselbe Motiv wieder und findet
sich sofort zurecht. Auf Mobile stapeln die Karten ohnehin, dort trennen die Anker exakt.

### Werkzeug-Notiz zur Fehlersuche
Der gemeldete Fehler war mit dem Vorschau-Panel **nicht reproduzierbar**: DOM-Geometrie,
Container-Breiten, `CLS` (0 Shifts) und Overflow waren in beiden Ständen fehlerfrei, und
die Panel-Screenshots sahen im **Original** exakt so „kaputt" aus wie nach dem Umbau —
also Panel-Artefakt, nicht Produktfehler. Erst der gemessene Vorher/Nachher-Vergleich per
`git stash` lieferte die belastbare Ursache. **Merke:** Bei „sieht komisch aus"-Meldungen
auf dieser Seite nicht den Screenshots glauben, sondern Geometrie messen und gegen HEAD
vergleichen.

**Referenzen:**
`pages/VehicleDetailingPage.tsx`
`data/detailing.ts`
`components/AutoDetailingExpertiseSection.tsx`

---

## ✅ Phase 6 — Interne Verlinkung, Navigation, Sitemap
**Ziel:** Neue Seiten sind keine Waisen (SEO-GEO §2.1 / §4.4).

* [x] Footer „Bereiche": `Über uns` ergänzt
* [x] Footer „Sitemap": `Leasingrückgabe` und `Privatkunden` ergänzt
* [x] `PrivatkundenPage`: Anlass „Vor der Leasingrückgabe" → neue Seite
* [x] `BusinessCustomersPage`: Highlight „Leasingrückgabe" → neue Seite
* [x] `VehicleDetailingPage`: Sektion `#leasingrueckgabe` verlinkt jetzt zusätzlich die
      neue Seite („Alles zur Leasingrückgabe"); der Ratgeber-Link bleibt daneben stehen
* [x] Sitemap neu erzeugt: **23 URLs** (18 statisch + 5 Artikel)
* [x] Navbar bewusst **nicht** verändert — Begründung unten

### Warum die Navbar unverändert bleibt
`navLinks` wird über `slice(0,2)` / `slice(2)` in eine linke und rechte Hälfte um das
zentrierte Logo geteilt. Ein fünfter Eintrag macht daraus 2/3 und kippt die Symmetrie,
die `DESIGN.md` §5.2 als tragendes Element beschreibt. Beide neuen Seiten sind ohne
Navbar-Eintrag erreichbar: über Startseiten-Kacheln, den Footer und `/leistungen`.
Falls „Über uns" trotzdem in die Hauptnavigation soll, ist das eine eigene kleine
Aufgabe inklusive Layout-Entscheidung — kein Nebenbei-Edit.

**Referenzen:**
`components/Footer.tsx`
`pages/BusinessCustomersPage.tsx`
`pages/PrivatkundenPage.tsx`

---

## ✅ Phase 7 — Verifikation
* [x] `tsc --noEmit` → Exit 0
* [x] DOM-Linkscan Startseite: 27 Inhaltslinks, **0 tote, 0 fehlende Routen, 0 tote Anker**
* [x] Routen-Parität geprüft: App 23 ↔ `routes.mjs` 23, keine Abweichung in beide Richtungen
* [x] Anker-Sprung live: `#lackaufbereitung` landet bei exakt 112 px (= `scroll-mt-28`),
      Karte im Viewport, korrekte Überschrift
* [x] Seitenstruktur nach dem Rückbau wieder bei 10 Sektionen wie im Original
* [x] Kein horizontaler Overflow bei 1440 px
* [x] `npm run build` → **Prerender 23/23 Routen**, beide neuen Seiten dabei
* [x] Statisches HTML geprüft: Titles, `h1`, JSON-LD (`AboutPage`, `Service`, `FAQPage`,
      `BreadcrumbList`) und alle drei neuen Anker sind **ohne JavaScript** vorhanden
* [x] **Encoding: 0 Mojibake-Treffer** (`Ã` / `â€`) in beiden neuen Seiten
* [x] Konsolenfehler geprüft — siehe Finding 4, war ein veralteter HMR-Eintrag

---

## ✅ Phase 9 — Visuelle Fehler in Galerie und Zielgruppen-Stapel *(Nachtrag 2026-08-10)*
**Ziel:** Der User meldete, dass „Ergebnisse, die man sieht" **weiterhin** stark visuell
buggt — und dass dasselbe für „Privatkunden, Geschäftskunden und Agenturen" auf der
Startseite gilt. Ursache finden statt weiter zu raten.

### Was der zweite Hinweis sofort ausschloss
In `components/TargetGroupCards.tsx` sind **nur zwei href-Strings** geändert (Diff geprüft).
`index.css`, `components/Layout.tsx`, `hooks/useSmoothScroll.ts` und
`components/DetailingGallery.tsx` sind **unberührt**. Der Startseiten-Fehler kann also nicht
von diesem Auftrag stammen — und weil der Rückbau aus Phase 5 die Galerie nicht geheilt hat,
gilt dasselbe dort. **Meine Repaint-These aus Phase 5 war falsch.**

* [x] **BEHOBEN — echter CSS-Bug in `DetailingGallery`:** Im `StaticGrid`-Zweig
      (`prefers-reduced-motion`) steckt die Kachel in einem `aspect-[3/4]`-Wrapper und
      bekommt keine Pixelhöhe. Ihr fehlte `h-full` → Höhe blieb `auto`, der innere Verlauf
      mit `h-full` kollabierte mit. **Nachgemessen bei 1200 px: Wrapper 291×388, Kachel
      291×80.** Sichtbar als flache Kacheln mit großen Lücken. Nach dem Fix: 291×388 = 291×388.
* [x] **BEHOBEN — Fehlschluss in der Projekthistorie korrigiert:** In
      `docs/hub-seiten-ausbau/…-tasks.md` stand genau dieses Symptom seit dem 2026-08-03
      als „kein Fehler, nur Headless-Chrome-Artefakt". Falsch: Der Screenshot-Lauf rendert
      den reduced-motion-Zweig, die damalige „Gegenprobe im echten Browser" den animierten —
      sie konnte den Fehler gar nicht sehen. Notiz dort richtiggestellt.
* [x] **`backdrop-filter` aus beiden Scroll-Sektionen entfernt.** Gemessen: 3 `backdrop-blur`
      lagen **innerhalb von `position: sticky`-Elementen** im Zielgruppen-Stapel, dazu je
      zwei pro Galeriekachel (~18 Kacheln in Bewegung). `backdrop-filter` muss seinen
      Hintergrund in jedem Frame neu abtasten, während sich das Element relativ dazu
      verschiebt — im zusätzlich per `transform: translateZ(0)` kompositierten
      `.site-main-shell` eine bekannte Flimmer-/Schlieren-Ursache.
      **Kosten-Nutzen:** Die weiße Karte ist bereits zu **94 %** deckend, der Blur dahinter
      also praktisch unsichtbar. Nach der Entfernung: 0 `backdrop-filter` in der Sektion,
      Kartengeometrie unverändert (764/652/540 px bei Top 108/220/332).
* [x] Gesamte Startseite auf dasselbe Kollaps-Muster abgesucht (`h-full` gegen auto-hohe
      Elternbox): **0 weitere Fundstellen**.
* [x] Zielgruppen-Geometrie gegen ihre Formel geprüft: sticky, Stufen von exakt 112 px bei
      `top` **und** Höhe, alle drei Karten enden bündig bei 872 px — **kein Geometriefehler**.
* [x] `tsc` Exit 0, Build + Prerender 23/23

### Symptom vom User präzisiert: „Flackern / Schlieren"
Auf Rückfrage nannte der User als Symptom **Flackern und Schlieren** — die Signatur von
Compositing-Effekten auf bewegten Elementen, nicht von Layout- oder Geometriefehlern. Damit
gezielt nachgemessen, was in den Sticky-Elementen der Zielgruppen-Sektion einen eigenen
Renderpass erzwingt:

| Fund | Anzahl | Behandlung |
|---|---|---|
| `backdrop-filter` in Sticky-Elementen | 3 | entfernt (Karte ist bereits 94 % deckend) |
| `filter: drop-shadow` auf `h2` und `p` | 2 | auf `text-shadow` umgestellt |
| Endstand nach den Fixes | **0 / 0** | nachgemessen im DOM |

* [x] **`filter: drop-shadow` → `text-shadow` am Überschriftenblock.** Der Block
      `.zielgruppen-titel` ist `lg:sticky` **und** wandert während des Scrollens (Stufe aus
      `--aktiv`). `drop-shadow` ist ein `filter`: eigener Stacking-Context, eigener
      Renderpass pro Frame, dessen Ergebnis beim Verschieben im kompositierten
      `.site-main-shell` neu gerastert werden muss — genau das erzeugt Schlieren.
      `text-shadow` wird mit der Schrift gezeichnet, ohne Filterpass. Bei reinem Text ist
      das optisch nicht zu unterscheiden; nachgemessen: `filter: none`,
      `text-shadow: rgba(0,0,0,0.6) 0px 2px 18px`, weiße Schrift und Layout unverändert.

### Offen / nicht angefasst
- Der Galerie-Kollaps ist **bewiesen** und behoben. Die Compositing-Fixes sind
  **mechanisch begründet, aber nicht durch mich verifizierbar**: Das Vorschau-Panel kann
  echtes Scroll-Ruckeln nicht reproduzieren (synthetische Wheel-Events springen instantan,
  Lenis interpoliert dabei nicht). Bestätigung muss vom User kommen.
- **`components/HeroSection.tsx` trägt sechs weitere `drop-shadow`-Filter** auf einem
  ebenfalls scroll-gekoppelten (Parallax-)Bereich. Der User hat den Hero **nicht** als
  fehlerhaft gemeldet, deshalb bewusst nicht angefasst. Wenn dort dasselbe Flackern
  auftritt, ist es dieselbe Ursache und derselbe Einzeiler-Fix.
- Die verbleibenden 12 `backdrop-filter` der Seite sitzen in der **Navbar** — gewollter
  Glassmorphismus laut `DESIGN.md` §2, und sie bewegt sich nicht gegen ihren Hintergrund.

**Referenzen:**
`components/DetailingGallery.tsx`
`components/TargetGroupCards.tsx`
`docs/hub-seiten-ausbau/tasks/2026-08-03-hub-seiten-und-zielgruppen-tasks.md`

---

## ✅ Phase 8 — Doku & Kommentare
* [x] Alle Phasen abgehakt, Kommentarsektion geschrieben
* [x] Kein separater Optimierungsplan nötig — Begründung am Ende

---

## Kommentare

### Phase 1
**Eingehalten:** Planung vor Code ✅, Ist-Stand aus dem laufenden System erhoben statt
angenommen ✅, Slugs nach bestehendem Muster begründet ✅, Bestandskomponente `About.tsx`
als Textquelle gefunden statt Inhalte neu zu erfinden ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — dem User gemeldet, Entscheidung offen:** „größter und bester Betrieb"
   ist als unbelegte Alleinstellungsbehauptung nach UWG §5 abmahnfähig. Umgesetzt ist die
   belegbare Variante („einer der größten"), die harten Fakten tragen die Aussage.
2. 🟡 **Mittel — dem User gemeldet, Entscheidung offen:** „10 Standorte" aus `About.tsx`
   ist nirgends belegt und widerspricht dem Ein-Standort-`LocalBusiness`-Schema. Bewusst
   **nicht** auf die neue Seite übernommen. Nachtragen ist ein Einzeiler.
3. 🟢 **Niedrig — Rückfrage:** „Dellenentfernung" fehlt in der Abnahmeliste des Users,
   liegt aber vor dem „ab hier ändern"-Punkt und zeigt korrekt. Als abgenommen behandelt.

### Phase 2–4
**Eingehalten:** unter 700 Zeilen ✅ (`LeasingrueckgabePage` 265 Z., `UeberUnsPage` 219 Z.),
genau eine `h1` je Seite ✅, Title/Description im Korridor §3.1 ✅, Antwort-zuerst §4.3 ✅,
Intent-Trennung Leistungsseite ↔ Ratgeber §4.1 ✅, Schema nur für Sichtbares §5 ✅,
FAQ-Konstanten wortgleich zur Seite ✅, keine erfundenen Preise ✅, Ansprache „Sie" ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — BEHOBEN, Kernbefund des Auftrags:** Die Privatkunden-Kachel zeigte auf
   `/fahrzeugaufbereitung-leipzig`, obwohl `/privatkunden` existiert. Ursache per
   `git log -L` belegt: Der `href` stammt aus `efed8a1`/`acfcd0c`, die Seite kam erst mit
   `78c3893`. Beim Anlegen wurde die Navbar umgestellt, die Startseiten-Kachel nicht.
   **Folge war doppelt:** falsches Ziel *und* `/privatkunden` nur über das Navbar-Menü
   erreichbar — für Crawler faktisch verwaist, obwohl in der Sitemap geführt.
   **Merke:** Wird eine Seite nachträglich angelegt, reicht der Navigationseintrag nicht.
   Alle Zeiger auf das bisherige Ersatzziel müssen mitgesucht werden.
2. 🟢 **Niedrig — BEHOBEN:** Meta-Description der Über-uns-Seite lag mit 161 Zeichen ein
   Zeichen über §3.1. Im Browser gemessen, nicht geschätzt — auf 153 gekürzt.

### Phase 5
**Eingehalten:** Bestandslayout unverändert ✅, Bilder mit `width`/`height` gegen CLS §2.2 ✅,
`loading="lazy"` ✅, sprechende `alt`-Texte §3.3 ✅, Sprungziel unter der Navigation
freigehalten (`scroll-mt-28`) ✅, Bildmaße in den Daten statt in einer Lookup-Tabelle ✅.

**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch — vom User zurückgewiesen, zurückgenommen:** Ich hatte das Kartenraster
   ungefragt durch drei volle Bildsektionen ersetzt. Der Auftrag lautete „Sprungziel plus
   Fotowiederverwendung" — ein Layoutwechsel war nicht verlangt. Folge: 2.040 px
   zusätzliche Bildfläche mit `shadow-lg` über einer Seite, deren Sektionen alle
   transparent sind, und damit spürbarer Repaint-Aufwand genau oberhalb der animierten
   Parallax-Galerie. Der User meldete das als „visuelles Rumbuggen ab *Ergebnisse, die man
   sieht*". Vollständig zurückgebaut, Zahlen im Vergleich oben.
   **Lehre:** Wenn ein Auftrag ein Ziel und ein Bild nennt, ist das kein Mandat für ein
   neues Layout. Und auf Seiten mit seitenlangem Sticky-Hintergrund ist zusätzliche
   Bildfläche eine Performance- und keine Geschmacksentscheidung.
2. 🟡 **Mittel — Fehldiagnose-Falle, dokumentiert:** Der gemeldete Fehler war im
   Vorschau-Panel nicht reproduzierbar (CLS 0, Geometrie korrekt, Screenshots im Original
   genauso „kaputt"). Wer sich hier auf Screenshots verlässt, repariert das Falsche.
   Belastbar war erst der `git stash`-Vergleich gegen HEAD.
3. 🟢 **Niedrig — beim Rückbau mitgenommen:** Die Bildmaße lagen im Umbau in einer
   separaten `Record`-Lookup neben den Daten. Jetzt stehen sie als `imageWidth` /
   `imageHeight` direkt am jeweiligen Scope — eine Quelle statt zwei, die auseinanderlaufen.

### Phase 6–7
**Eingehalten:** neue Seiten intern verlinkt §4.4 ✅, beschreibende Ankertexte ✅,
Routen-Parität App ↔ Sitemap geprüft ✅, Prerender gegengeprüft statt angenommen ✅,
Encoding explizit geprüft ✅, bestehende Verweise nachgezogen statt hängen gelassen ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟢 **Niedrig — eigener Fehlbefund, korrigiert:** Ich hatte die lokale
   `public/sitemap.xml` (13 statt 23 URLs) zunächst als „veraltete eingecheckte Datei"
   gemeldet. Das war falsch: Die Datei steht in `.gitignore:16`, ist also **nie
   committet** und rein lokales Build-Artefakt. `prebuild` erzeugt sie bei jedem Deploy
   frisch. Es gab folglich nie ein Repo-Problem und auch nichts zu bereinigen.
   **Merke:** Vor „Datei X ist veraltet im Repo" erst `git ls-files` / `git check-ignore`
   fragen — `git status` zeigt ignorierte Dateien nicht als geändert an, was den
   Fehlschluss stützt statt ihn aufzudecken.
2. 🟢 **Niedrig — Werkzeug, bereits aus früherer Session bekannt:** Der Konsolen-Puffer
   des Browser-Panels meldete `ueberUnsFaq is not defined`. Das war der Zwischenstand
   zwischen zwei Edits (Nutzung vor Deklaration). Selbst ein `location.reload()` leerte
   den Puffer nicht — die Modul-URL trug noch den alten `?t=`-Zeitstempel. Verlässlich
   war erst der Gegenbeweis am Ergebnis: Das `AboutPage`-Schema rendert mit
   `foundingDate 1993` und 7 FAQ-Einträgen, und `tsc` ist grün. **Merke:** Konsolenfehler
   in diesem Panel gegen ein Ergebnis prüfen, nicht gegen einen Reload.

---

## Kein separater Optimierungsplan
Alle in diesen Phasen gefundenen Punkte sind **innerhalb** dieses Durchgangs behoben
(Privatkunden-Zeiger, Description-Länge, veraltete Sitemap, tote Importe). Offen bleiben
nur die vier bewusst vertagten To-dos (T1–T4) oben und zwei Rückfragen an den User
(Superlativ, „10 Standorte"). Ein zweiter Plan würde diese nur duplizieren.

### Empfehlung für später (kein Defekt, aber Verbesserung)
`components/ArticleLayout.tsx` verlinkt bei **allen** Wissensartikeln pauschal auf
`/fahrzeugaufbereitung-leipzig`. Für den Leasing-Artikel wäre `/leasingrueckgabe-leipzig`
das passendere Ziel. Sauber gelöst über ein optionales Feld `serviceHref` je Artikel in
`data/knowledgeArticles.ts` — bewusst nicht in diesem Durchgang, weil es alle fünf
Artikel betrifft und nicht Teil des Auftrags war.

---

## Vorher / Nachher — Startseite

| Karte | Vorher | Nachher |
|---|---|---|
| Leistungen → Leasingrückgabe | `/fahrzeugaufbereitung-leipzig` | `/leasingrueckgabe-leipzig` ✨ neu |
| Zielgruppen → Für Privatkunden | `/fahrzeugaufbereitung-leipzig` | `/privatkunden` |
| Zielgruppen → Schadenpartner kennenlernen | `/unfallinstandsetzung-leipzig` | `/ueber-uns` ✨ neu |
| Aufbereitung → Innenaufbereitung | `…-wissen/innenaufbereitung` | `/fahrzeugaufbereitung-leipzig#innenaufbereitung` |
| Aufbereitung → Außenaufbereitung | `…-wissen/was-ist-autoaufbereitung` | `/fahrzeugaufbereitung-leipzig#aussenaufbereitung` |
| Aufbereitung → Lackaufbereitung | `…-wissen/lackaufbereitung` | `/fahrzeugaufbereitung-leipzig#lackaufbereitung` |
| Aufbereitung → Leasingrückgabe vorbereiten | `…-wissen/leasingrueckgabe-vorbereiten` | `/leasingrueckgabe-leipzig` |

**Nicht angefasst (wie beauftragt):** die 8 abgenommenen Leistungskarten, Dellenentfernung,
Hero-CTAs, „Schaden jetzt melden", „Partnerschaft anfragen", „Mehr über Aufbereitung erfahren".
