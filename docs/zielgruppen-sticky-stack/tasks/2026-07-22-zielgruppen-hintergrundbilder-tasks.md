# Zielgruppen-Sektion „Für wen wir arbeiten" — echte Hintergrundbilder

> **Feature:** Die 3 Karten der Sektion `TargetGroupCards` (Privatkunden, Versicherungen & Agenturen,
> Autohäuser & Fuhrparks) bekommen je ein echtes Foto als Karten-Hintergrund statt des Default-/
> Fuhrpark-Bildes.
> **Scope-Grenze (verbindlich, Wunsch des Users):** NUR die 3 `backgroundImage`-Pfade tauschen —
> „sauber einsetzen und mehr erst mal nicht". Kein Redesign, keine Verlinkungsänderung, keine Full-Bleed-
> Section-Bg (das ist ein separater, späterer Schritt).

**Erstellt:** 2026-07-22 · **Modus:** LOKAL · **Ansprache:** Sie

## Analyse
- **Komponente:** `components/TargetGroupCards.tsx` — Sticky Stacking Cards (rein CSS-sticky, kein Scroll-JS).
  Jede Karte hat bereits `backgroundImage` + fertiges Design (weiße Karte, Titel, Beschreibung, CTA, Logo).
- **Aktuell:** privatkunden → `carcare-hero-workshop.webp` (Default) · versicherungen → Default ·
  gewerbe → `kacheln/fuhrparkservice-leipzig-carcare.webp`.
- **Vom User gelieferte & benannte Bilder** (`~/Downloads`):
  - `Privatkunden-leipzig-carcare.webp.png` → Empfangstresen, persönliche Beratung (1200 px breit – kleiner!)
  - `Versicherungen-und-Agenturen-leipzig-carcare.webp.png` → Werkstatt-Übersicht, viele Fahrzeuge
  - `Autohäuser-und-Fuhrparks-leipzig.carcare.webp.png` → Bentley auf Transporter + Handschlag
- **Benennungs-Prüfung:** Inhalt passt zu den Kartentiteln (Handschlag = feste Ansprechpartner;
  Werkstatt-Kapazität = strukturierte Reparaturprozesse; Empfang = persönliche Beratung).

## Phasen

### ✅ Phase 1 — Bild-Assets
* [x] 3 Dateien lowercase/ASCII nach `public/assets/kacheln/` kopiert (Umlaut `ä→ae`, Punkt-Tippfehler
      `.carcare→-carcare`, Doppelendung `.webp.png` weg).
* [x] `npm run images -- public/assets/kacheln --replace` → WebP (14,2 MB → 799 KB, −95 %), Quell-PNG entfernt.
      `privatkunden` (97 KB) blieb bei ~1200 px (nicht hochskaliert), `versicherungen`/`autohaeuser` je 2400 px.

### ✅ Phase 2 — Verdrahtung
* [x] 3 `backgroundImage`-Pfade in `TargetGroupCards.tsx` eingetragen (nur diese Felder; `DEFAULT_CARD_BG`
      bleibt als JSX-Fallback). privatkunden → `privatkunden-…`, versicherungen → `versicherungen-und-agenturen-…`,
      gewerbe → `autohaeuser-und-fuhrparks-leipzig-carcare.webp`.

### ✅ Phase 3 — Verifikation
* [x] `npm run typecheck` fehlerfrei (Exit 0).
* [x] Screenshots Desktop + Mobile aller 3 Karten (Hintergründe korrekt zugeordnet), **Konsole fehlerfrei**,
      Sticky-Stack-Mechanik unverändert.

**Referenzen:** `components/TargetGroupCards.tsx` (einzige Code-Änderung)

## Kommentare
### Phase 1–3
**Eingehalten:** Scope „nur 3 Hintergründe, sonst nichts" ✅, SEO-/ASCII-Dateinamen ✅, WebP (§2.2) ✅,
keine PNG-Reste ✅, Sticky-Stack-/Scroll-Mechanik unangetastet ✅, kein Mojibake ✅, kein Console-Error ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Niedrig:** `public/assets/kacheln/fuhrparkservice-leipzig-carcare.webp` ist nach dem Tausch im Code
   **verwaist** (nur noch in Docs referenziert). Bewusst NICHT gelöscht (Scope). → Optionaler Cleanup später.
2. 🟡 **Niedrig:** `privatkunden`-Foto ist nur ~1200 px breit (kleiner als die anderen 2400 px). Für die
   Karte ausreichend, auf sehr großen Screens minimal weicher. Bei Bedarf höher aufgelöst nachreichen.
3. 🟢 **Info:** Zuordnung Werkstatt-Übersicht → „Versicherungen & Agenturen" und Bentley/Handschlag →
   „Autohäuser & Fuhrparks" ist vom User so benannt und durch die Kartentexte gedeckt (Handschlag =
   „feste Ansprechpartner"). Falls gewünscht, ließen sich die beiden in 30 s tauschen.

**Fazit:** Keine offenen kritischen/hohen Findings. Ein optionaler Cleanup (verwaistes Fuhrpark-WebP) ist
notiert und wartet auf Freigabe.

---

## Nachtrag 2026-07-22 — EXPERIMENT: Bilder linksbündig + Blauverlauf nach rechts

**Auftrag (experimentell, alle 3 Karten):** Bilder linksbündig ausrichten; den blauen Verlauf, der bisher
oben-links am dunkelsten war, auf die rechte Seite verlagern.

### ✅ Umsetzung
* [x] `img`: `object-cover` → `object-cover object-left` (linksbündig).
* [x] Neue CSS-Klasse `.cc-radial-veil-graphite-right` (index.css) — identische Deckkraft/Geometrie wie
      `.cc-radial-veil-graphite`, nur Zentrum `at 100% 50%` statt `0% 0%`. Geteilte Klasse blieb unangetastet.
* [x] Verifikation: Screenshots Desktop + Mobile aller 3 Karten, Konsole fehlerfrei, Scroll-Mechanik unverändert.

### Beobachtungen (ehrlich, nach Schwere)
1. 🟠 **Privatkunden weiterhin „gezoomt" (Desktop):** `object-left` wirkt nur bei HORIZONTALEM Überstand.
   Auf Desktop sind die Karten Querformat (~16:9), das Privatkunden-Foto ist 4:3 **und nur ~1200 px** →
   Überstand ist VERTIKAL, `object-left` ändert dort fast nichts; das Bild bleibt hochskaliert/beschnitten.
   Auf Mobile (Hochformat-Karte) greift `object-left` und zeigt die linke Bildhälfte (Tresen/Branding).
   **Echte Hebel:** (a) höher aufgelöstes/breiteres Privatkunden-Foto, (b) vertikalen Ausschnitt tunen
   (`object-top`/`object-bottom`), (c) Karten-/Bildhöhe anpassen. → Rückfrage an User.
2. 🟡 **Heading-Kontrast (Desktop, lg):** Der weiße Überschriften-Overlay oben-links hatte bisher das blaue
   Veil als Rückhalt; jetzt liegt er über hellerem Bild. Dank `drop-shadow` lesbar, aber kontrastärmer.
   Bei Bedarf: lokales dezentes Scrim nur hinter der Überschrift (Blau bleibt rechts).
3. 🟢 **Reversibel:** Rückbau = 2 Klassennamen zurücktauschen + `object-left` entfernen.

**Referenzen:** `components/TargetGroupCards.tsx` · `index.css` (`.cc-radial-veil-graphite-right`)

### ✅ Iteration 2 (2026-07-22) — zweiter Verlauf oben-links + neues Privatkunden-Foto
**Auftrag:** Zusätzlich zum rechten Verlauf wieder das dunkle Blau **oben links** einsetzen (beide behalten);
Privatkunden-Foto durch höher aufgelösten Anhang ersetzen.
* [x] Zweite Verlaufs-Ebene ergänzt: `.cc-radial-veil-graphite` (oben links) **+** `.cc-radial-veil-graphite-right`
      (rechts) — zwei `absolute inset-0`-Divs, überlagern sich additiv. Heading-Kontrast (Finding 🟡 aus Iter. 1)
      damit **behoben** (Rückhalt oben links wieder da).
* [x] Privatkunden-Foto ersetzt: neuer Anhang (3168×1344, ultrabreit) → `privatkunden-leipzig-carcare.webp`
      (2400 px, 192 KB) via `--force --replace`. Pfad unverändert → keine Verdrahtungsänderung. Desktop-Zoom
      (Finding 🟠 aus Iter. 1) damit **behoben**.
* [x] Verifikation: Typecheck 0, Screenshots Desktop+Mobile, Konsole fehlerfrei, Scroll-Mechanik unverändert.

**Beobachtungen:**
- 🟡 **Niedrig:** Durch die zwei überlagerten Veils wirken die Fotos etwas dunkler/blauer (gewünscht: beide
  Übergänge). Falls zu kräftig, kann die Deckkraft eines Verlaufs (z. B. oben-links 0.94→~0.75) reduziert werden.
- 🟡 **Niedrig (Mobile):** Das ultrabreite Privatkunden-Foto zeigt `object-left` auf Mobile eher den leeren
  Bürobereich links (Motiv sitzt mittig-rechts). Bei Bedarf mobil `object-center`/`object-right` gaten.

### ✅ Iteration 3 (2026-07-22) — oben-links-Verlauf konzentrieren (Schleier weg)
**Auftrag:** Den oben-links-Verlauf viel schwächer machen — Ecke oben links darf stark bleiben (Schrift
lesbar), das Bild soll aber überwiegend schleierfrei sichtbar sein.
* [x] `.cc-radial-veil-graphite` (nur hier genutzt, per Grep bestätigt): Stops von `0.94/0% · 0.45/50% ·
      0/100%` → **`0.92/0% · 0.42/28% · 0/55%`**. Ecke bleibt stark, Abfall auf 0 schon bei ~55 % Radius →
      Bildmitte/-rest schleierfrei. Rechter Verlauf unverändert.
* [x] Verifikation: Screenshots Desktop (01–03) + Mobile — Überschrift oben links weiterhin lesbar,
      Motive (Empfang/Werkstatt/Bentley) klar sichtbar; Konsole fehlerfrei, Typecheck unbeeinflusst (nur CSS).
**Damit erledigt:** Finding 🟡 „Fotos zu dunkel/blau" aus Iteration 2 (der Schleier stammte vom oben-links-Veil).
