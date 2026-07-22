# Unfall & Schaden Leipzig — Karten mit Hintergrundbild + weißer Textbox

> **Feature:** Die 4 Prozesskarten der Sektion „Unfall & Schaden Leipzig" (`AccidentDamageSection.tsx`)
> erhalten je ein echtes Foto als Hintergrundbild und werden optisch an die Leistungsübersicht-Karten
> (`ServiceGrid` / `ExpandingCardAccordion`) angeglichen: klares Hintergrundbild + weiße Textbox mit
> Überschrift (blauer Punkt-Akzent) und Beschreibung darunter.
> **Scope-Grenze (verbindlich):** NUR diese 4 Karten. Scroll-Pin-/Stacking-Verhalten bleibt unverändert.

**Erstellt:** 2026-07-22 · **Modus:** LOKAL · **Ansprache:** Sie

---

## Ausgangslage / Analyse

- **Betroffene Komponente:** `components/AccidentDamageSection.tsx` — 400vh Scroll-Track, natives
  `position: sticky`-Pin, 4 gestapelte `ProcessCard`s (Crossfade per Scroll-Progress).
- **Referenzdesign:** `components/ExpandingCardAccordion.tsx` (genutzt von `ServiceGrid`) — Bild-Layer
  (`object-cover`) + Carbon-Gradient + weiße Textbox (`bg-white/92`, `rounded-2xl`), h3 mit blauem
  Punkt + Beschreibung.
- **Bild-Workflow:** Quell-PNG/JPEG in `public/assets/kacheln/` ablegen → `npm run images` (sharp,
  q82, max 2400px) → WebP. Originale via `--replace` entfernen (public/ wird 1:1 deployed).
- **Vom User gelieferte & benannte Bilder** (in `~/Downloads`, je 2688×1520):
  - `Schadenaufnahme-leipzig-carcare.webp.png` → Berater + Kundin am beschädigten Wagen (Tablet)
  - `Kalkulation-leipzig-carcare.webp.png` → Kundin unterschreibt am Tresen, Berater zeigt Tablet
  - `Versicherungsabwicklung-leipzig-carcare.webp.png` → Mitarbeiterin am Telefon mit Tablet/Unterlagen
  - `Ersatzwagen-leipzig-carcare.webp.png` → Schlüsselübergabe vor der Werkstatt
- **Zuordnung Bild → Schritt** (Dateiname deckt sich mit Schrittnamen):
  - 01 Schadenaufnahme · 02 Gutachten & Kalkulation · 03 Versicherungsabwicklung · 04 Ersatzwagen
- **Benennungs-Prüfung (Auftrag des Users):** Inhalt passt zu den Namen. Anmerkung: das
  `Kalkulation`-Foto zeigt eine Unterschrift/Freigabe-Szene — für „Gutachten & Kalkulation"
  (Kostenvoranschlag-Freigabe) inhaltlich vertretbar, daher übernommen.

---

## Phasen

### ✅ Phase 1 — Bild-Assets vorbereiten & konvertieren
**Ziel:** Die 4 Fotos SEO-konform (lowercase, Bindestriche) als WebP in `public/assets/kacheln/`.
* [x] 4 Downloads-Dateien mit sauberen **lowercase**-Namen nach `public/assets/kacheln/` kopiert
      (kein `.webp.png`-Doppelsuffix; Linux-Server ist case-sensitiv → alle bestehenden Kacheln lowercase).
* [x] `npm run images -- public/assets/kacheln --replace` → PNG→WebP (19,72 MB → 621 KB, −97 %), Quell-PNG entfernt.
* [x] Ergebnis geprüft: 4 neue `.webp` (120–200 KB) vorhanden, 0 `.png`-Reste in `public/`.
      Dateien: `schadenaufnahme-`, `kalkulation-`, `versicherungsabwicklung-`, `ersatzwagen-leipzig-carcare.webp`.

### ✅ Phase 2 — ProcessCard-Redesign + Step-Daten
**Ziel:** Karten = Hintergrundbild + weiße Textbox (Überschrift + Beschreibung), einheitlich mit Leistungsübersicht.
* [x] `Step`-Interface um `image` + `imageAlt` erweitert, `icon` entfernt; `kachel()`- + `logoMarkSrc`-Helper ergänzt.
* [x] 4 Steps mit Bildpfad + aussagekräftigem Alt-Text (SEO §3.3) befüllt.
* [x] `ProcessCard` umgebaut: `img` (object-cover, lazy) + Carbon-Gradient + weiße Textbox
      (`bg-white/92`, Kicker „Schritt 0X" + h3 mit blauem Punkt + p) + Logo-Siegel (ab `sm`). Textbox
      unten verankert, Breite gedeckelt → Foto bleibt oben/rechts „klar" sichtbar.
* [x] Ungenutzte lucide-Icons (`FileSearch`, `ClipboardCheck`, `ShieldCheck`, `Car`) entfernt.
* [x] Mobile-First: Bühne-Höhe mobil auf 300px erhöht (Bild-Klarheit über der Textbox); Textbox
      `bottom-4 left-4 right-4` (mobil voll) → `sm:max-w-[68%]` → `lg:max-w-[380px]`.

### ✅ Phase 3 — Verifikation
**Ziel:** Fehlerfreier Build + visueller Nachweis (Desktop + Mobile).
* [x] `npm run typecheck` fehlerfrei (Exit 0).
* [x] Dev-Server (Port 3007): alle 4 Karten geladen (Bilder 200), **Konsole fehlerfrei**; Scroll-Stacking
      + Fortschritts-Dots (01/04 … 04/04) folgen weiterhin korrekt.
* [x] Screenshots Desktop (1440) + Mobile (390) je 4 Karten via Puppeteer (Lenis per rAF-Halteschleife
      neutralisiert, `scrollY` == Ziel). Belege im Scratchpad.

**Referenzen:**
`components/AccidentDamageSection.tsx` (Hauptänderung: Step-Daten + ProcessCard-Markup)
`components/ExpandingCardAccordion.tsx` (Referenz-Design)
`public/assets/kacheln/` (4 neue WebP) · `scripts/convert-images.mjs`

---

## Kommentare

### Phase 1 — Bild-Assets
**Eingehalten:** SEO-konforme Dateinamen (lowercase, Bindestriche, Keyword+Leipzig) ✅, WebP-Pflicht (§2.2) ✅,
keine Originale in `public/` (−97 %, 621 KB gesamt) ✅, Case-Sensitivity Linux beachtet ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Niedrig:** User-Quelldateien hatten Doppelendung `.webp.png` + Großschreibung → beim Kopieren auf
   saubere lowercase-`.png` normalisiert (sonst Groß-/Kleinschreibungs-Bug auf dem Linux-Server). Behoben.
2. 🟡 **Niedrig/Inhalt:** `kalkulation`-Foto zeigt eine **Unterschrift/Freigabe-Szene**, nicht eine reine
   Kalkulation. Für „Gutachten & Kalkulation" (Kostenvoranschlag-Freigabe) vertretbar; Alt-Text beschreibt
   die Szene korrekt. Falls gewünscht, kann der User ein reines Kalkulations-Motiv nachreichen.

### Phase 2 — Redesign
**Eingehalten:** unter 700 Zeilen (Datei ~230) ✅, Mobile-First ✅, Design einheitlich mit Leistungsübersicht
(Bild + weiße Textbox + blauer Punkt + Logo-Siegel) ✅, Scope-Grenze „nur die 4 Karten" ✅, Scroll-Pin/Stacking
unangetastet ✅, kein Mojibake ✅, ungenutzte Imports entfernt ✅.
**Auffälligkeiten (nach Schwere):** keine offen. Shadow-Token bewusst von `--cc-trust-blue-rgb` auf
`--cc-carbon-rgb` umgestellt (Konsistenz mit Accordion-Karten).

### Phase 3 — Verifikation
**Eingehalten:** Typecheck ✅, Konsole fehlerfrei ✅, visueller Nachweis Desktop+Mobile ✅, Edge-Case
Lenis-vs-Screenshot gelöst ✅.
**Auffälligkeiten:** keine.

**Fazit:** Keine offenen kritischen/hohen Findings → **kein separater Optimierungs-Task nötig.** Alle
Auffälligkeiten waren niedrig und wurden inline behandelt bzw. sind bewusste, dokumentierte Entscheidungen.

---

## Nachtrag 2026-07-22 — Full-Bleed-Sektionshintergrund (Wunsch des Users)

**Auftrag:** Das Foto der AKTIVEN Karte zusätzlich als Full-Bleed-Hintergrund hinter die Karten über die
ganze (gepinnte) Sektion legen — **1:1 wie ServiceGrid/Leistungsübersicht** (gleiche Veils/Transparenz,
Crossfade beim Schrittwechsel). **Strikt:** KEINE Scroll-/Karten-Animation verändern; rein visueller Layer.

### ✅ Phase 4 — Full-Bleed-Hintergrund (Crossfade je aktiver Karte)
* [x] `AnimatePresence` importiert; bestehenden `active`-Index als Bildquelle genutzt (kein neuer State,
      keine Änderung an Progress/Spring/Pin).
* [x] Hintergrund-Ebene als erstes Kind der Sticky-Pin-`div`: `absolute inset-0 -z-10`
      (Sticky = eigener Stacking-Context → Ebene hinter dem Content, über dem weißen Section-Bg).
      Container zusätzlich `relative` (Content sicher über der -z-10-Ebene).
* [x] Bild + die **drei identischen Veils** aus ServiceGrid (vertikaler Veil, horizontaler Header-Schutz,
      radiale Rand-Vignette bei 58 %), Crossfade `key={steps[active].image}`, `duration 0.6`.
* [x] Nur `lg`+ (`hidden lg:block`) — Veils sind auf Header-links/Karte-rechts getunt (gilt erst ab lg,
      exakt wie ServiceGrid, das auf Mobile `null` liefert).
* [x] Verifikation: Typecheck 0, Screenshots aller 4 Karten (Hintergrund wechselt mit: 01→04),
      Scroll-Verhalten/Dots unverändert, **Konsole fehlerfrei**.

**Referenzen:**
`components/AccidentDamageSection.tsx` (Hauptänderung) · `components/ServiceGrid.tsx` (Veil-Vorlage)

### Kommentar Phase 4
**Eingehalten:** 1:1-Übernahme der ServiceGrid-Veils/Transparenz ✅, Crossfade je Schrittwechsel ✅,
**keine** Scroll-/Karten-/Pin-Animation angefasst ✅ (nur Add-only-Layer + Wiederverwendung `active`),
unter 700 Zeilen ✅, kein Mojibake ✅, kein Console-Error ✅.
**Auffälligkeiten:** keine. Bewusst: `-z-10` funktioniert ohne zusätzliches `isolate`, da `position: sticky`
bereits einen Stacking-Context erzeugt → Pin-Element blieb unangetastet (Pin ist laut Memory sensibel).
Hintergrund `lg`-only, da die horizontalen/radialen Veils das Header-links/Karte-rechts-Layout voraussetzen
(unter lg gestapelt → Veils würden nicht passen); deckt sich mit ServiceGrid (Mobile = kein Full-Bleed-Bg).
