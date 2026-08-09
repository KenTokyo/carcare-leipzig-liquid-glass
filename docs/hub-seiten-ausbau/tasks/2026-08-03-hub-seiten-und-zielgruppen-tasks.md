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

### ✅ Phase 9 — Foto-Hintergrund im Überschriftsbereich (Nachtrag User, 2026-08-03)
**Ziel:** In den Hero-Bereichen der vier Seiten das Foto der jeweiligen Startseiten-Kachel
als Hintergrund zeigen — in derselben Behandlung wie die Leistungsübersicht (weiß
auslaufend, mit Einblenden). **Keine** Karte, nur das Bild.
* [x] `components/PhotoBackdrop.tsx` (78 Z.) angelegt: Foto + drei Weiß-Ebenen + Crossfade
* [x] `components/ServiceGrid.tsx` nutzt die Komponente jetzt ebenfalls — 34 Zeilen
      kopierter Gradienten entfernt, Optik per Screenshot als unverändert belegt
* [x] `PageHero` um `backgroundImage` erweitert; `isolate` ergänzt, sonst rutscht die
      `-z-10`-Ebene in den Stacking-Context des App-Shell-`main`
* [x] Vier Seiten verdrahtet, jeweils mit dem Motiv ihrer Kachel:
      Aufbereitung · Unfall (Schadenabwicklung) · Privatkunden · Autohäuser & Fuhrparks
* [x] Neue Variante `textGuard="wide"` für die Heroes — Begründung siehe Kommentar
* [x] Belegt per Puppeteer-Screenshots (1440×900) je Seite, plus Regressionsbild der
      Leistungsübersicht; Build STRICT 21/21, Motiv in allen vier statischen HTMLs

**Referenzen:**
`components/PhotoBackdrop.tsx`
`components/PageBlocks.tsx`
`components/ServiceGrid.tsx`

### ✅ Phase 10 — Foto bleibt beim Scrollen stehen (Nachtrag User, 2026-08-04)
**Ziel:** Das Foto soll nicht nur im Überschriftsbereich sichtbar sein, sondern beim
Scrollen an seiner Position hängen bleiben — nur Text und Inhalt scrollen darüber.
**User-Entscheidung (per Rückfrage):** über die **ganze Seite bis zum Footer**, die
Inhaltssektionen geben dafür ihren eigenen Hintergrund ab.
* [x] `BackdropLayout` in `components/PageBlocks.tsx`: Sticky-Block über eine Viewporthöhe,
      Inhalt per `-mt-[100svh]` darübergezogen
* [x] `sticky` statt `fixed` — der App-Shell spannt einen eigenen Containing Block auf,
      `fixed` ist dort gebrochen (siehe Projektnotiz), `sticky` greift nativ
* [x] `100svh` statt `100vh`, sonst laufen Sticky-Höhe und negativer Rand auf Mobile
      mit der ein-/ausfahrenden Browserleiste auseinander
* [x] `.cc-backdrop-content > section` in `index.css`: nimmt Sektionen Hintergrundfarbe
      **und** `background-image` (der Hero trägt einen Farbverlauf, der sonst stehen bliebe).
      Nur direkte Sektionskinder — Karten und Bildbänder behalten ihren Hintergrund
* [x] `backgroundImage` aus `PageHero` entfernt und `overflow-hidden` dort abgebaut
      (hätte den Sticky-Kontext beschnitten); vier Seiten auf `BackdropLayout` umgestellt
* [x] Textschutz nachgezogen (siehe Kommentar)
* [x] Belegt: je Seite 4 Scrollpositionen (0/1100/2400/4200 px) per Puppeteer,
      Build STRICT 21/21, kein Mojibake

**Referenzen:**
`components/PageBlocks.tsx`
`components/PhotoBackdrop.tsx`
`index.css`

### ✅ Phase 11 — Zoom auf der Aufbereitungsseite herausgenommen (Nachtrag User, 2026-08-04)
**Ziel:** Das Foto auf `/fahrzeugaufbereitung-leipzig` wirkte zu nah herangeholt; es soll
mehr vom Motiv im Hintergrund-Übergang zu sehen sein.
* [x] Optionale Eigenschaft `zoom` in `PhotoBackdrop` (und durchgereicht über
      `BackdropLayout`): ohne Angabe unverändert `object-cover`, mit Angabe
      `object-contain` plus Skalierung
* [x] Bild dabei **rechts verankert** (`object-right` + `transform-origin: right center`)
* [x] `/fahrzeugaufbereitung-leipzig` auf `zoom={0.74}` gesetzt; die anderen drei Seiten
      bleiben unverändert auf `object-cover` (im Build gegengeprüft)
* [x] Vier Stufen (1,0 / 0,82 / 0,74 / 0,68) gerendert und verglichen
* [x] **Korrektur nach Rückmeldung des Users:** Alle Zwischenstände zeigten sichtbare
      Bildkanten. Verfahren umgestellt — Bild wird jetzt über die **Höhe** bemessen
      (nach unten auf `1` begrenzt), rechts verankert, linke Kante per `mask-image`
      weich ausgeblendet. Ergebnis: oben, rechts und unten bündig, links aufgelöst
* [x] Nachgemessen statt geschätzt: Bildkanten und H1-Überlauf auf 4 Seiten × 2 Viewports
      (1440×900 und 390×844) — 8/8 ohne Kante, ohne Überlauf, ohne Querscroll
* [x] Build STRICT 21/21

**Referenzen:**
`components/PhotoBackdrop.tsx`
`pages/VehicleDetailingPage.tsx`

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

### Phase 9
**Eingehalten:** unter 700 Zeilen ✅, geteilte Komponente statt kopierter Gradienten ✅,
Bild rein dekorativ (`aria-hidden`, leerer `alt`, `pointer-events-none`) ✅, Motive aus dem
Bestand ohne neue Assets ✅, visuell belegt statt behauptet ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — BEHOBEN, erst im Screenshot sichtbar:** Mit den unveränderten Verläufen der
   Leistungsübersicht lief der helle Fließtext (`gray-600`, `max-w-3xl`) in den Heroes ins
   klare Bildfenster und wurde auf dunklen Motiven schwer lesbar — am deutlichsten auf
   Unfall (dunkler Kofferraum), Privatkunden (dunkler Pullover) und Geschäftskunden
   (dunkles Fahrzeug). Ursache: Die Verläufe waren auf den schmaleren Kopfbereich der
   Leistungsübersicht abgestimmt. **Fix:** Variante `textGuard="wide"` — gleiche drei
   Ebenen, linker Schutz reicht bis 72 % statt 52 %, radiales Bildfenster bei 68 % statt
   58 %. Der Bildeindruck bleibt, der Text steht wieder auf Weiß. Die Leistungsübersicht
   nutzt unverändert `default`.
   **Merke:** Rein visuelle Änderungen sind über DOM-Abfragen nicht abnehmbar. Der
   Strukturcheck war grün, während der Text schlecht lesbar war.
2. 🟢 **Niedrig — Werkzeug, für künftige Screenshots festgehalten:** Drei Fallstricke beim
   Puppeteer-Beleg gekostet, alle in `[[puppeteer-lenis-scroll-hold]]` nachgetragen:
   `window.lenis` ist nur ein Versions-Objekt (die Instanz hält der Hook privat), ein
   direktes `scrollTop=…` wird von Lenis in der nächsten rAF zurückgesetzt, und `clip` bei
   `page.screenshot` ist **dokument-**, nicht viewport-relativ. Zuverlässig ist:
   Hash-Route aufrufen (App scrollt selbst über Lenis), settlen lassen, ohne `clip`
   aufnehmen.

### Phase 10
**Eingehalten:** unter 700 Zeilen ✅, `sticky` statt des hier gebrochenen `fixed` ✅,
`svh` statt `vh` für Mobile ✅, Sektionsregel nur auf direkte Kinder ✅, Bild weiterhin
rein dekorativ ✅, an vier Scrollpositionen je Seite visuell belegt ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — BEHOBEN:** Mit dem seitenweit stehenden Foto reichte der Textschutz aus
   Phase 9 nicht mehr. Grund ist eine Eigenschaft des Sticky-Hintergrunds, die vorher
   nicht galt: Weil das Bild im Viewport stehen bleibt, trifft eine dunkle Bildstelle
   nicht mehr eine einzelne Überschrift, sondern **jede Textzeile auf dieser Höhe über
   die ganze Seite**. Sichtbar wurde es an der Beschreibung auf `/geschaeftskunden`, die
   über den dunklen Anzug lief. **Fix:** `wide`-Preset verstärkt (Schutz bis 76 % statt
   72 %, Zwischenstufen angehoben, radiales Bildfenster von 68 % auf 72 %). Foto bleibt
   deutlich sichtbar, Text steht wieder auf Weiß.
### Phase 11
**Eingehalten:** Änderung strikt auf die eine Seite begrenzt ✅, Default-Verhalten der
anderen drei unverändert und im Build gegengeprüft ✅, Entscheidung anhand gerenderter
Stufen statt nach Gefühl ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Denkfehler beim ersten Versuch, korrigiert:** Der naheliegende Weg
   (`object-contain`, zentriert) machte es *schlechter*: Weil das klare Bildfenster rechts
   liegt und links der Textschutz abdeckt, wandert ein zentriertes Motiv beim Verkleinern
   aus genau diesem Fenster heraus — sichtbar wurde weniger statt mehr, und rechts entstand
   eine weiße Lücke. Erst die **Rechtsverankerung** dreht das um: Herauszoomen rückt
   fortlaufend mehr Motiv ins Fenster. Bei 0,74 sind Poliermaschine, Türgriff und
   Fensterlinie erkennbar statt nur einer glatten Karosseriefläche.
2. 🔴 **Kritisch — vom User zurückgewiesen, behoben:** Ich hatte sichtbare Bildkanten als
   unvermeidbare Abwägung dargestellt („weniger Zoom kostet Randabdeckung") und nur den
   Wert so gewählt, dass die Kante *wenig* auffällt. Das war die falsche Schlussfolgerung:
   Nicht der Zoomwert war das Problem, sondern das Verfahren. Mit `object-contain` wird
   das Bild an **allen vier** Seiten kleiner, also entstehen zwangsläufig Kanten.
   **Richtig ist:** über die **Höhe** bemessen und rechts verankern — dann bleiben oben,
   rechts und unten bündig, und nur die linke Kante kann hineinragen. Die wird per
   `mask-image` ausgeblendet. Damit ist „kein sichtbarer Rand" konstruktiv garantiert
   statt durch einen glücklich gewählten Wert erkauft.
   **Lehre:** Wenn eine Anforderung als Zielkonflikt erscheint, erst das Verfahren
   hinterfragen — nicht den Kompromiss verhandeln.
3. 🟠 **Hoch — nebenbei gefunden und behoben:** Auf 375 px lief die `h1` in `PageHero` um
   **61 px** aus ihrem Kasten und wurde abgeschnitten („Fahrzeugaufbereitun"). Ursache:
   `hyphens: manual`, automatische Silbentrennung griff nie — lange deutsche Komposita
   passen dort in keine Zeile. **Fix:** `[hyphens:auto]` + `break-words` an der `h1`.
   Betraf alle Seiten mit `PageHero`, nicht nur die Aufbereitungsseite.

4. 🔴 **DIESE EINSCHÄTZUNG WAR FALSCH — korrigiert am 2026-08-10.**
   *Ursprünglich hier notiert:* „Im Screenshot bei 4200 px wirkte die Bildergalerie
   zerrissen (flache Kacheln, große Lücken). Gegenprobe im echten Browser: korrekt
   aufgebaut — `aspect-[3/4]` kollabiert nur im Headless-Chrome des Screenshot-Laufs."

   **Das war ein echter Bug, kein Werkzeug-Artefakt.** Der Screenshot-Lauf hatte recht.
   `components/DetailingGallery.tsx` hat zwei Zweige: den animierten (Kachel bekommt eine
   Pixelhöhe) und `StaticGrid` für `prefers-reduced-motion` (Kachel steckt in einem
   `aspect-[3/4]`-Wrapper und bekommt **keine** Höhe). Im zweiten Zweig fehlte der Kachel
   `h-full` — ihre Höhe blieb `auto`, der innere Verlauf mit `h-full` fand eine auto-hohe
   Elternbox vor und kollabierte mit. Nachgemessen bei 1200 px Breite: Wrapper 291×388,
   Kachel 291×**80**.

   Die damalige „Gegenprobe im echten Browser" traf den **animierten** Zweig (reduced
   motion aus) und konnte den Fehler deshalb gar nicht sehen. Headless-Chrome meldet
   reduced motion — der Screenshot zeigte den kaputten Zweig.

   **Folgekosten:** Der Fehlschluss stand über eine Woche als „kein Fehler" im Log. Als der
   User am 2026-08-09/10 „ab *Ergebnisse, die man sieht* visuell buggy" meldete, führte
   genau diese Notiz die Suche zunächst in die Irre.

   **Merke — die Lehre lautet anders herum als hier ursprünglich notiert:** Wenn Screenshot
   und Live-Browser sich widersprechen, ist die Frage nicht „welches Werkzeug lügt", sondern
   **„welchen Zweig hat welcher Lauf gerendert"**. Unterschiedliche Umgebungen melden
   `prefers-reduced-motion` unterschiedlich und rendern damit unterschiedlichen Code.
   Behoben in `components/DetailingGallery.tsx`, siehe
   `docs/subpages-verlinkung/tasks/2026-08-09-subpages-verlinkung-tasks.md`.
