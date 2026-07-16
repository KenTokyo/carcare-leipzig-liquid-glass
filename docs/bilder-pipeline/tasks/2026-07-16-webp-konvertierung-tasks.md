# Bilder-Pipeline: PNG/JPEG → WebP (Kachel-Fotos Startseite)

> **Anlass (User, 2026-07-16):** „Ich brauche Hilfe mit den Fotos der Kacheln auf der Mainpage.
> Du hast mir Benennungen mit WEBP mitgegeben, meine Fotos haben aber PNG. Ist das schlimm?"

## Antwort in Kurz

- **Dateiname:** unkritisch, muss nur zum Code passen (`.webp` im Pfad + `.png` auf der Platte = 404).
  Aktuell ist **nichts kaputt**: keine Kachel hat einen eigenen `backgroundImage`-Pfad, alle 10 fallen
  auf `DEFAULT_CARD_BG` zurueck.
- **Format:** **nicht** egal. PNG ist verlustfrei und fuer Grafik/Transparenz gedacht; fuer **Fotos**
  typisch **3–5x groesser** als WebP bei optisch gleichem Ergebnis. 10 Kacheln auf der Startseite
  schlagen direkt auf LCP durch. Projektvorgabe ist eindeutig: SEO-GEO-STANDARDS §2.2
  „Bilder: modernes Format (WebP/AVIF)", LCP < 2,5 s.

## Ausgangslage (gemessen)

```
public/assets/
  4.6M  carcare-hero-workshop.jpeg   <- LCP-Bild UND Default-Hintergrund ALLER 10 Kacheln
  1.6M  carcare-center-mark-animated.mp4
   85K  carcare-center-wordmark.png
   73K  carcare-center-logo.webp
   20K  carcare-button-gradient.png
```

- `ExpandingCardItem.backgroundImage?` und `OverviewService.backgroundImage?` existieren bereits
  (`types.ts:22`, `types.ts:34`) → Kacheln sind vorbereitet, nur nicht befuellt.
- `ExpandingCardAccordion.tsx:27` kommentiert das Muster ausdruecklich: „neue Bilder in /public/assets
  ablegen und Pfad eintragen … wirkt am staerksten mit UNTERSCHIEDLICHEN Bildern je Karte".
- **Kein** Konvertierungswerkzeug vorhanden: kein `sharp`, kein ImageMagick.
  ⚠️ Falle: `which convert` findet unter Windows `C:\WINDOWS\system32\convert` — das ist der
  **FAT→NTFS-Konverter**, nicht ImageMagick.

## Loesungswege geprueft

- **A) `sharp` + npm-Script (GEWAEHLT)** — Industriestandard, sehr schnell (libvips), praezise Kontrolle
  ueber Qualitaet/Groesse, laeuft offline und reproduzierbar. Nur **devDependency** → kein Byte im
  Client-Bundle. Passt zum vorhandenen `scripts/`-Muster (`generate-sitemap.mjs`, `prerender.mjs`).
- **B) Chrome/Canvas via Puppeteer (`toDataURL('image/webp')`)** — VERWORFEN: keine neue Dependency,
  aber schlechte Qualitaetskontrolle, kein Resize-Workflow, umstaendlich fuer Batches.
- **C) Online-Konverter / manuell** — VERWORFEN: nicht reproduzierbar, nicht automatisierbar,
  Fotos muessten das Haus verlassen.
- **D) Vite-Plugin (z. B. vite-imagetools)** — VERWORFEN: haengt die Konvertierung in den Build und
  verlangsamt jeden Dev-Start; die Assets liegen statisch in `public/` (an Vite vorbei).

## Phasen

### ✅ Phase 1 — Analyse & Entscheidung
* [x] Kachel-Mechanik geklaert (`backgroundImage` optional, Fallback `DEFAULT_CARD_BG`)
* [x] Ist-Groessen gemessen; 4,6-MB-Hero als eigentlichen LCP-Brocken identifiziert
* [x] Werkzeuglage geprueft (kein sharp/ImageMagick; Windows-`convert`-Falle dokumentiert)
* [x] 4 Wege verglichen, `sharp` als devDependency gewaehlt
**Referenzen:** `docs/bilder-pipeline/tasks/2026-07-16-webp-konvertierung-tasks.md`, `types.ts`

### ✅ Phase 2 — Konvertierungs-Skript
**Ziel:** Ein Befehl konvertiert alles Neue nach WebP — ohne Handarbeit, ohne Originale zu zerstoeren.
* [x] `npm i -D sharp` (0.35.3; `npm audit --omit=dev` = 0 vulnerabilities)
* [x] `scripts/convert-images.mjs`: scannt `public/assets/**`, konvertiert PNG/JPEG → WebP
* [x] **Originale bleiben liegen** (Quelldateien sind wertvoll; nur `--replace` loescht sie bewusst)
* [x] Qualitaet 82 (visuell verlustfrei bei Fotos), `effort: 6`; Breite gedeckelt (Default 2400 px)
* [x] Ueberspringt bereits konvertierte Dateien, `--force` erzwingt neu
* [x] Gibt Vorher/Nachher-Tabelle mit Ersparnis aus
* [x] npm-Script `"images"` ergaenzt
**Referenzen:** `scripts/convert-images.mjs`, `package.json`

### ✅ Phase 5 — Neues Hero-Bild + dunkler Verlauf (User-Wunsch 2026-07-16)
**Ziel:** Hero-Foto gegen den Showroom-Shot tauschen, Weissverlauf raus, dunkler Uebergang nach oben.
* [x] `Hero-leipzig-carcare.webp.png` (2688x1152 PNG, 4,33 MB) aus Downloads geholt
      → `public/assets/hero-leipzig-carcare.webp`: **221 KB (−95 %)**, 2400x1029
* [x] **Bug im eigenen Skript gefixt:** Doppel-Endung `name.webp.png` haette `name.webp.webp`
      erzeugt (Export-Tools haengen die echte Endung an den Wunschnamen). `zielName()` strippt
      jetzt ein zusaetzliches `.webp` aus dem Stamm.
* [x] `HeroSection`: neue `src`, neuer `alt` (Showroom statt Werkstatt), `width/height` 2400x1029
* [x] **Weissverlauf entfernt:** `bg-gradient-to-t from-white/[0.92] …` und der weisse Top-Verlauf raus
* [x] **`.hero-copy-veil` von weiss auf dunkel gedreht** (index.css): links `carbon/0.72` →
      rechts `carbon/0.08`, damit das CarCare-Logo an der Hallenwand frei bleibt; Maske (Navbar-Zone) behalten
* [x] **Dunkler Uebergang nach oben** ergaenzt: `bg-gradient-to-t from-gray-950/20 via-gray-950/45 to-gray-950/85`
* [x] **Typografie zwingend mitgezogen:** `h1` `text-gray-950` → `text-white` (weisser Drop-Shadow →
      dunkler), `p` `text-gray-600` → `text-gray-200`. Ohne das waere die Headline auf den dunklen
      Fahrzeugen des neuen Fotos unlesbar. Badges/Buttons/Info-Karten sind solide Flaechen → unveraendert.
* [x] Entspricht wieder DESIGN.md §5.1 („stark verdunkeltes Overlay … extremer Kontrast zur weissen Typografie")
* [x] **Tote Assets aus `public/` entfernt** (public/ wird 1:1 mitdeployed!):
      `carcare-hero-workshop.jpeg` (4,6 MB), `carcare-button-gradient.png`,
      `carcare-center-wordmark.webp` (unbenutzt), `hero-leipzig-carcare.webp.png` (Quelle).
      **`public/assets`: ~11 MB → 2,4 MB** (davon 1,6 MB Logo-Video, separat geflaggt)
* [x] Verifiziert: `tsc` gruen, Parallax unveraendert (Versatz −382 → −259), kein horizontaler Scroll
**Referenzen:** `components/HeroSection.tsx`, `index.css`, `scripts/convert-images.mjs`

### ✅ Phase 6 — Mobiler Hero: eigenes Hochkant-Foto (erledigt)
**Problem (gemessen):** Das neue Foto ist ein **21:9-Panorama** (2.33:1), der mobile Hero ist hochkant
(390x1141 Ebene = 0.34). `object-cover` zeigt dort nur **15 % der Bildbreite**, 352 Quellpixel auf
780 Geraetepixel = **2,2x gestreckt** → unscharfer, inhaltsleerer Streifen. Desktop dagegen: 47 % der
Breite, auf DPR-1-Monitoren 1,1x → gut. **Geometrisch nicht loesbar** — ein 2.33:1-Bild kann einen
0.34-Rahmen nicht sinnvoll fuellen.
**User-Entscheidung (2026-07-16):** eigenes Hochkant-Foto fuer Mobile (statt kuerzerem Hero oder
zweitem Motiv).
* [x] User lieferte `Hero-leipzig-carcare-mobile.webp.png` — **1360x2048** Hochkant (3,85 MB PNG)
* [x] Konvertiert: **183 KB (−95 %)**, native Breite behalten (1360 < max 2400 → kein Resize)
* [x] `<picture>` in `HeroSection`: `<source media="(max-width: 767px)">` = Hochkant,
      `<img>` = Panorama (Desktop + Fallback). Breakpoint 767px = Tailwind `md`, passend zu den
      `md:`-Klassen der Sektion.
* [x] `width`/`height` je Quelle gesetzt (CLS): 1360x2048 mobil, 2400x1029 Desktop
* [x] **Verbesserung belegt:** mobil vorher 15 % Bildbreite bei 2,2x Streckung (unscharf) →
      jetzt **51 % bei 1,1x** (scharf). Im echten Chrome verifiziert: `currentSrc` mobil =
      `hero-leipzig-carcare-mobile.webp` (natural 1360x2048), Desktop = Panorama (2400x1029).
**Referenzen:** `components/HeroSection.tsx`

### ✅ Phase 3 — Kachel-Fotos eingepflegt (erledigt)
> **Gefunden 2026-07-16:** In `C:\Users\Moham\Downloads\` liegen bereits **12 Fotos** mit exakt den
> vorgegebenen Namen — allerdings als **PNG mit Doppel-Endung** (`…webp.png`, zusammen ~54 MB).
> Zuordnung zu den 10 `ServiceGrid`-Kacheln ist eindeutig (autolackierung, dellenentfernung,
> fahrzeugaufbereitung, felgenreparatur, smart-repair, hagelschadenreparatur, autoglas,
> leasingrueckgabe, fuhrparkservice, versicherung-schadenabwicklung + autohaus-fuhrpark-service).
**Ziel:** Jede der 10 Leistungs-Kacheln bekommt ein eigenes Foto (der skiper52/53-Effekt lebt davon).
* [x] 11 Fotos nach `public/assets/kacheln/` kopiert und konvertiert
      (`npm run images -- public/assets/kacheln --max=1400 --replace`)
* [x] **48,71 MB → 1,25 MB (−97 %)**; Breite auf 1400 px gedeckelt (aktive Karte ist ~684 px breit,
      bei DPR 2 = 1368 px → 1400 reicht; die 2336 px der Quellen waeren Verschwendung)
* [x] `backgroundImage` fuer alle **10** `ServiceGrid`-Eintraege gesetzt (via `kachel()`-Helfer)
* [x] Verifiziert (echter Chrome): **10 Kacheln, 10 verschiedene Fotos**, Desktop **und** Mobile,
      **0 × 404**, `tsc` gruen
* [x] Dateinamen bereits SEO-konform (Leistung + Ort + Marke, SEO-GEO §3.3)
**Korrektur durch User (2026-07-16):** Meine Annahme, `autohaus-fuhrpark-service-leipzig-carcare.webp`
gehoere zu den `TargetGroupCards`, war **falsch** — es gehoert auf die Kachel **Fuhrparkservice**.
Getauscht. Inhaltlich die bessere Wahl, per Bildsichtung bestaetigt: das Motiv zeigt einen Mitarbeiter
mit Tablet vor einer Porsche-Flotte (= der **Service**), waehrend `fuhrparkservice-leipzig-carcare.webp`
nur geparkte Fahrzeuge ohne Person zeigt.
**Lehre:** Zuordnung nach **Dateinamen** ist eine Vermutung, keine Verifikation — Motive vor dem
Einpflegen ansehen. Gegenprobe danach: `versicherung-schadenabwicklung` → „Unfallinstandsetzung"
stimmt (Mitarbeiter dokumentiert per Tablet einen Heckschaden am Taycan = Schadenaufnahme).
**Zweite Korrektur durch User:** `fuhrparkservice-leipzig-carcare.webp` gehoert in die Sektion
**„Fuer wen wir arbeiten"** (= `TargetGroupCards`, `#zielgruppen`) — dort auf **„Autohaeuser &
Fuhrparks"** gesetzt. Verifiziert (echter Chrome): Kachel laedt das Foto, 0×404.
**Merke fuer kuenftige Zuordnungen:** Die beiden Fuhrpark-Dateinamen sind gegenlaeufig zur Intuition —
`autohaus-fuhrpark-service` → **Leistungs**-Kachel „Fuhrparkservice"; `fuhrparkservice-leipzig-carcare`
→ **Zielgruppen**-Kachel „Autohaeuser & Fuhrparks". Genau deshalb: Motive ansehen, nicht Namen raten.

### ⬜ Phase 7 — Restliche Zielgruppen-Kacheln (wartet auf Motive)
**Stand:** 1 von 3 Kacheln in „Fuer wen wir arbeiten" hat ein eigenes Foto.
* [x] „Autohaeuser & Fuhrparks" → `kacheln/fuhrparkservice-leipzig-carcare.webp`
* [ ] „Privatkunden" — haengt noch an `DEFAULT_CARD_BG` (Motiv fehlt)
* [ ] „Versicherungen & Agenturen" — haengt noch an `DEFAULT_CARD_BG` (Motiv fehlt)
> Hinweis: `DEFAULT_CARD_BG` ist `carcare-hero-workshop.webp` — das **alte** Hero-Motiv. Es lebt nur
> noch als Platzhalter fuer diese 2 Kacheln + `AutoDetailingExpertiseSection`. Sobald alle Kacheln
> eigene Fotos haben, kann es (419 KB) raus.
**Referenzen:** `components/TargetGroupCards.tsx`
**Referenzen:** `components/ServiceGrid.tsx`, `components/ExpandingCardAccordion.tsx`

### ✅ Phase 4 — Hero-Bild entschaerft (direkt mitgefixt)
**Ziel:** 4,6-MB-LCP-Bild auf ein vertretbares Mass bringen.
* [x] `carcare-hero-workshop.jpeg` → WebP: **4,57 MB → 419 KB (−91 %)**, Breite **5712 → 2400 px**
* [x] 3 Referenzen umgehaengt: `HeroSection.tsx`, `ExpandingCardAccordion.tsx`, `TargetGroupCards.tsx`
* [x] `carcare-button-gradient.png` → WebP (20 → 5 KB, −75 %), Referenz in `index.css` umgehaengt
* [x] **`carcare-center-wordmark.png` BEWUSST behalten** — nur −12 % (Grafik mit Transparenz, PNG legitim);
      der WebP-Rat gilt fuer **Fotos**, nicht pauschal
* [x] **Vorbestehenden CLS-Bug gefunden und gefixt:** Das `<img>` deklarierte `width={2400} height={1350}`
      (16:9) — das Bild ist aber **4:3** (Original 5712×4284, neu 2400×1800). Die in Hero-Phase 3 als
      „CWV: CLS/LCP ✅" ergaenzten Masse hatten das **falsche Seitenverhaeltnis**. Jetzt `height={1800}`,
      deckungsgleich mit der Datei.
* [x] Verifiziert (echter Chrome, Cache an): **0 × 404**, Hero laedt (`naturalWidth 2400`),
      Summe `/assets` **2.277 KB** (vorher ~6,4 MB)
**Referenzen:** `components/HeroSection.tsx`, `components/ExpandingCardAccordion.tsx`, `components/TargetGroupCards.tsx`

---

## Kommentare

### Phase 1–2 & 4
**Eingehalten:** Ist-Zustand gemessen statt vermutet ✅, 4 Loesungswege verglichen ✅, Planung vor Code ✅,
Konvertierer nur als **devDependency** (kein Client-Bundle-Zuwachs) ✅, Originale werden nicht zerstoert ✅,
`npm audit --omit=dev` = 0 ✅, in echtem Chrome verifiziert (0×404, Masse, Bytes) ✅, `tsc --noEmit` gruen ✅,
< 700 Zeilen ✅, Encoding sauber ✅, Format-Rat differenziert (Foto vs. Transparenz-Grafik) statt pauschal ✅.

**Messwerte:**
| Datei | vorher | nachher | Ersparnis |
|---|---|---|---|
| `carcare-hero-workshop` | 4,57 MB (5712 px breit) | **419 KB** (2400 px) | **−91 %** |
| `carcare-button-gradient` | 20 KB (3715 px) | 5 KB | −75 % |
| `carcare-center-wordmark` | 84 KB | (behalten) | — (nur −12 %, PNG legitim) |
| **Summe `/assets` (Chrome, Cache an)** | ~6,4 MB | **2.277 KB** | **~−64 %** |

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🔴 **Kritisch (vorbestehend, BEHOBEN):** `carcare-hero-workshop.jpeg` war **4,57 MB** bei **5712 px
   Breite** — LCP-Bild **und** Hintergrund aller 10 Kacheln. Verfehlte die Projektvorgabe (LCP < 2,5 s)
   im Alleingang. **Fix:** WebP @2400 px → 419 KB (−91 %).
2. 🟠 **Hoch (vorbestehend, BEHOBEN):** Das Hero-`<img>` deklarierte `width={2400} height={1350}` (16:9),
   das Bild ist aber **4:3** (5712×4284 → 2400×1800). Hero-Phase 3 hatte diese Masse ausdruecklich
   „gegen CLS" ergaenzt und dabei das **Seitenverhaeltnis falsch** geraten. Praktische Auswirkung war
   gering (`object-cover` + `h-full w-full` → CSS gewinnt), die Angabe war aber schlicht falsch und
   haette bei jeder Layout-Aenderung zugeschlagen. **Fix:** `height={1800}`.
3. 🟠 **Hoch (vorbestehend, NICHT gefixt — Marken-Entscheidung, als Task geflaggt):**
   `carcare-center-mark-animated.mp4` (**1,6 MB**) laeuft als `<video autoPlay loop>` in **Navbar**,
   **Footer** und **4× in `TargetGroupCards`** — fuer ein 40–56 px grosses Logo-Badge. Nach der
   Hero-Optimierung ist das mit Abstand der groesste Posten (**71 %** der verbleibenden 2,28 MB).
   Pikant: `ExpandingCardAccordion.tsx:29-34` hat exakt diese Lehre bereits gezogen und nutzt dort
   bewusst das **statische** `carcare-center-logo.webp` (73 KB) — „bei vielen Karten waeren das viele
   parallele Autoplay-Videos (Perf)". `TargetGroupCards` (ebenfalls Karten!) folgt dem nicht.
   Nicht eigenmaechtig geaendert, weil es die **animierte Marke** betrifft = Design-/Brand-Entscheidung.
4. 🟡 **Mittel (Werkzeug-Falle, dokumentiert):** `which convert` liefert unter Windows den
   FAT→NTFS-Konverter aus `system32`, nicht ImageMagick. Wer das uebersieht, glaubt faelschlich,
   ein Konverter sei vorhanden.
5. 🟢 **Niedrig (Messfalle, geklaert):** Erste Messung lief mit `setCacheEnabled(false)` und zeigte das
   MP4 **5×** (8,1 MB) — realitaetsfern. Mit Cache laedt die Datei **einmal**. Die 5 parallelen
   Autoplay-Decoder bleiben trotzdem ein echtes Thema (CPU/Speicher), nur nicht als Traffic.

**Hauptkomponenten (max. 3):** `scripts/convert-images.mjs`, `components/HeroSection.tsx`, `package.json`.

### Phase 3, 5 & 6 (neues Hero-Motiv, Art Direction, Kachel-Fotos)
**Eingehalten:** Fotos vor der Verarbeitung vermessen (Format/Masse/Seitenverhaeltnis) statt blind
konvertiert ✅, Mobile-Problem **gerechnet und belegt** statt „sieht komisch aus" ✅, Design-Fork
(Panorama vs. Hochkant) dem User zur Entscheidung vorgelegt statt eigenmaechtig entschieden ✅,
Typo-Umstellung als **zwingende Folge** erkannt und begruendet ✅, in echtem Chrome verifiziert
(Desktop + Mobile, `currentSrc`, 10/10 Kacheln, 0×404) ✅, `tsc` gruen ✅, Encoding sauber ✅,
Format-Rat differenziert (Foto → WebP, Logo mit Transparenz → PNG) ✅.

**Messwerte:**
| Schritt | vorher | nachher |
|---|---|---|
| Hero Desktop | 4,33 MB PNG (2688 px) | **221 KB** WebP (2400x1029) |
| Hero Mobile | 3,85 MB PNG | **183 KB** WebP (1360x2048) |
| 11 Kachel-Fotos | **48,71 MB** PNG | **1,25 MB** WebP (−97 %) |
| Mobile-Bildnutzung | 15 % Breite @ 2,2x (unscharf) | **51 % @ 1,1x** (scharf) |
| `public/assets` gesamt | ~11 MB + 54 MB Quellen | **3,9 MB** |

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🔴 **Kritisch (Selbstverschulden, sofort behoben):** `npm run images -- --replace` **ohne Pfad**
   lief ueber **ganz** `public/assets` und loeschte dabei `carcare-center-wordmark.png` — eine Datei,
   die ich eine Phase vorher **bewusst als PNG behalten** hatte und die `Navbar` + `Footer`
   referenzieren. Waere unbemerkt ein 404 auf dem Logo gewesen. Aufgefallen nur durch die
   Referenz-Gegenprobe. **Fix:** `git checkout` der PNG, verlustbehaftetes WebP geloescht.
   **Doppelter Fehler:** Das erzeugte WebP war **lossy q82** — bei Logo-Schrift entstehen dabei
   Artefakte; fuer Transparenz-Grafik mit Text ist PNG (oder lossless WebP) richtig, genau deshalb
   hatte ich sie behalten. **Lehre:** `--replace` **nie** auf einen ganzen Ordner mit gemischtem
   Inhalt; immer den konkreten Zielpfad angeben.
2. 🟠 **Hoch (eigener Denkfehler, behoben):** Skript-Doku behauptete, Originale koennten in
   `public/` liegen bleiben („wird ohnehin nur statisch ausgeliefert"). Genau falsch herum —
   `public/` wird **1:1 mitdeployed**, ein Original dort landet auf dem Server. Waeren ~54 MB
   Kachel-PNGs gewesen. **Fix:** Kommentar korrigiert + aktive Warnung im Skript, wenn Originale
   in `public/` verbleiben.
3. 🟠 **Hoch (Skript-Bug, behoben):** Doppel-Endung `name.webp.png` (Export-Tool haengt die echte
   Endung an den Wunschnamen) haette `name.webp.webp` erzeugt. `zielName()` strippt jetzt ein
   zusaetzliches `.webp` aus dem Stamm. War exakt der Ausloeser der urspruenglichen User-Frage.
4. 🟡 **Mittel (Geometrie, geloest):** Ein 2.33:1-Panorama kann einen 0.34-Rahmen nicht fuellen —
   `object-cover` zeigt dann 15 % der Breite. **Kein** CSS-Trick loest das; die Antwort ist Art
   Direction (`<picture>` + zweites Motiv). Merke fuer kuenftige Hero-Wechsel: **erst** das
   Seitenverhaeltnis gegen Desktop- **und** Mobile-Rahmen rechnen, dann Motiv waehlen.
5. 🟢 **Niedrig (bewusst):** Kachel-Quellen waren 2336 px breit, gedeckelt auf **1400 px** — die
   aktive Karte ist ~684 px breit (DPR 2 → 1368 px). Mehr waere reine Verschwendung.

**Hauptkomponenten (max. 3):** `components/HeroSection.tsx`, `components/ServiceGrid.tsx`,
`scripts/convert-images.mjs`.
