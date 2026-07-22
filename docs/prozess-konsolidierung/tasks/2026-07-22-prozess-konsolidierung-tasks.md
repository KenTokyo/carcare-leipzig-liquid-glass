# Prozess-Konsolidierung — Redundanz auflösen (Startseite)

> **Ausgangsproblem:** Der Unfallprozess stand DREIFACH (Startseite `AccidentDamageSection`,
> Startseite `ProcessTimeline`, Unterseite `/unfallinstandsetzung-leipzig`), der Aufbereitungsprozess
> doppelt (`ProcessTimeline` + `/fahrzeugaufbereitung-leipzig`) — mit **uneinheitlichen** Schrittmodellen
> (4 vs. 5 vs. 6 Schritte). Das verstößt gegen SEO-GEO §4.5 (Duplicate Content) und §4.3 (eindeutige,
> konsistent benannte Entitäten) und schwächt die KI-Zitierfähigkeit.

**Erstellt:** 2026-07-22 · **Modus:** LOKAL · **Ansprache:** Sie

## Entscheidung (mit User abgestimmt)
1. `AccidentDamageSection` bekommt eine **neue erste Karte „Schaden melden"** (Online-Meldung + CTA) → 5 Karten.
2. `ProcessTimeline` (Sektion „Prozess") entfällt komplett von der Startseite.
3. Der **Aufbereitungsablauf** wandert 1:1 in `AutoDetailingExpertiseSection` (inkl. CTA „Termin anfragen").
4. Der **Unfallablauf** wird **NICHT** auf die Unterseite kopiert — er steht dort bereits vollständig
   (6 Schritte, feiner granuliert als die 5 der Startseite). Kopieren würde erneut Duplikate erzeugen.

**Abdeckungs-Nachweis (nichts geht verloren):**
| ProcessTimeline (Startseite) | Bereits auf `/unfallinstandsetzung-leipzig` |
|---|---|
| 1 Schaden melden | 1 Schaden melden |
| 2 Schaden prüfen lassen | 2 Fahrzeug besichtigen lassen |
| 3 Kalkulation & Abstimmung | 3 Kalkulation erstellen + 4 Abstimmung mit Versicherung/Gutachter |
| 4 Reparatur & Lackierung | 5 Reparatur durchführen |
| 5 Fahrzeug abholen | 6 Fahrzeugübergabe |

**Technische Vorprüfung:** `#prozess` ist **nirgends** verlinkt (Nav/Footer/Sitemap), `ProcessTimeline`
läuft **nur** auf der Startseite → Entfernen bricht keine Links.

---

## Phasen

### ✅ Phase 1 — Neue Karte „Schaden melden" (AccidentDamageSection)
* [x] Neuer Step an Index 0 („Schaden melden": Online-Formular, Fahrzeugdaten, Schadenart, Fotos,
      Versicherung — Wortlaut deckt sich mit der FAQ-Antwort auf `/unfallinstandsetzung-leipzig`).
      Bestehende Karten auf 02–05 umnummeriert.
* [x] **KRITISCH erledigt:** Track `h-[400vh]` → `h-[500vh]`. `STEP = 1/steps.length` und die
      Fortschritts-Dots skalieren automatisch → verifiziert 4500 px Track, Dots 01/05 … 05/05.
* [x] CTA „Schaden melden" → `/kontakt#contact-schaden` **in** der Karte (optionales `cta`-Feld,
      nur Schritt 01 nutzt es — andere Karten unverändert).
* [x] A11y: inaktive Karten `pointer-events-none` + CTA `tabIndex={-1}` — der unsichtbare Link
      (opacity 0) ist dadurch weder klick- noch per Tab erreichbar.
* [x] Foto: **Platzhalter** (`carcare-hero-workshop.webp`) mit dokumentiertem 1-Zeilen-Tausch.
* [x] **Bonus-Fix:** Intro-Text sagte noch „in vier klaren Schritten" und beschrieb die alte Spanne
      → korrigiert zu „Von der Schadenmeldung bis zum Ersatzwagen – in fünf klaren Schritten".

### ✅ Phase 2 — Aufbereitungsablauf → AutoDetailingExpertiseSection
* [x] 5 Schritte 1:1 übernommen (Wortlaut unverändert — mit der Geschäftsführung abgestimmter Inhalt).
* [x] Als `<ol>` unter echter Nutzerfrage-h3 „Wie läuft eine Autoaufbereitung bei CarCare ab?"
      (§3.2/§4.3) — eigenständig verständlich und sauber KI-extrahierbar.
* [x] CTA „Termin anfragen" (`#contact-termin`) mitgenommen.

### ✅ Phase 3 — ProcessTimeline entfernen
* [x] Aus `pages/HomePage.tsx` entfernt (Import + Verwendung), Kommentar auf 8 Sektionen aktualisiert.
* [x] `components/ProcessTimeline.tsx` gelöscht.
* [x] `TimelineTab` **und** `ProcessStep` aus `types.ts` entfernt (per Grep bestätigt: nur von
      ProcessTimeline genutzt; `ProcessList` in PageBlocks hat einen eigenen inline-Typ).

### ✅ Phase 4 — Verifikation
* [x] `npm run typecheck` fehlerfrei (Exit 0).
* [x] Screenshots: alle 5 Unfallkarten + Aufbereitungs-Ablauf (Desktop & Mobile).
* [x] **Frischer Seitenaufruf: 0 Errors, 0 Warnings**; 5 Karten im DOM, Track 4500 px.

**Referenzen:** `components/AccidentDamageSection.tsx` · `components/AutoDetailingExpertiseSection.tsx` · `pages/HomePage.tsx`

## Kommentare

### Phasen 1–4
**Eingehalten:** Scroll-Pin/Stacking unverändert (nur eine Karte ergänzt) ✅, unter 700 Zeilen ✅,
Mobile-First ✅, Sie-Ansprache ✅, kein Mojibake ✅, keine toten Links ✅, Typecheck 0 ✅, Konsole 0 ✅.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — behoben:** Der Track `h-[400vh]` war **hartcodiert**, während `STEP` aus `steps.length`
   rechnet. Eine 5. Karte hätte sich sonst denselben Scrollweg geteilt (jede Karte 20 % weniger
   Strecke, hektischer Ablauf). Auf 500vh gezogen + Kommentar hinterlegt, dass beides zusammengehört.
2. 🟡 **Mittel — behoben:** Intro-Text („vier klare Schritte") war nach der Erweiterung faktisch falsch.
3. 🟡 **Niedrig — behoben:** Unsichtbare Karten hätten mit dem neuen CTA fokussierbare Links geliefert.
4. 🟢 **Info:** Während des Umnummerierens meldete HMR kurzzeitig doppelte React-Keys (`02`/`03`/`04`)
   — reine Zwischenstands-Artefakte. Frischer Aufruf bestätigt 0 Fehler.
5. ⏳ **OFFEN:** Platzhalter-Foto für Karte 01 — finales Motiv kommt vom Kunden.

**Fazit:** Redundanz aufgelöst, kein Content verloren (Unfallablauf vollständig auf der Unterseite,
Aufbereitungsablauf nur eine Sektion tiefer). Keine offenen kritischen Findings außer dem Foto.

---

### ✅ Phase 5 (2026-07-22) — Echtes Foto + Expertise-Karten im Leistungsübersicht-Design

**a) Foto für Karte 01 „Schaden melden"**
* [x] Kundenfoto (Smartphone mit Schadenformular vor beschädigtem Fahrzeug) übernommen:
      `Schaden melden-…webp.png` → `schaden-melden-leipzig-carcare.webp` (2400 px, 126 KB, −98 %).
      Dateiname normalisiert (Leerzeichen → Bindestrich, lowercase).
* [x] Platzhalter-Konstante entfernt, Alt-Text auf das reale Motiv präzisiert (SEO §3.3).
      → Das Foto erscheint zugleich als Full-Bleed-Sektionshintergrund bei Schritt 01.

**b) „Autoaufbereitung als Expertise" — Kartenaufteilung + Animation wie Leistungsübersicht**
* [x] Flache Artikel-Chips ersetzt durch **dieselbe Komponente** `ExpandingCardAccordion`, die auch
      `ServiceGrid` nutzt → Aufteilung und Animation sind **exakt identisch** (nicht nachgebaut):
      Desktop horizontal (skiper52), Mobile vertikal (skiper53).
* [x] 4 Karten: Innenaufbereitung · Außenaufbereitung · Lackaufbereitung · Leasingrückgabe vorbereiten.
      Beschreibungen faktenbasiert aus dem bestehenden Content von `/fahrzeugaufbereitung-leipzig`
      übernommen (keine erfundenen Angaben). Ziele = die bisherigen Wissens-Artikel.
* [x] Full-Bleed-Sektionshintergrund via `onActiveImageChange` mit den **identischen drei Veils**
      wie ServiceGrid; Sektion auf `relative isolate` gesetzt (Stacking-Context für `-z-10`).
* [x] Verifikation: Typecheck 0 · **0 Konsolenfehler** · Hover wechselt Karte **und** Hintergrund ·
      Mobile-Akkordeon korrekt.

**Auffälligkeiten:**
1. ⏳ **OFFEN:** Die 4 Expertise-Karten laufen auf **Interim-Fotos** (vorhandene Kacheln, bewusst vier
   unterschiedliche — der Aufklapp-Effekt lebt vom Bildwechsel). Finale Motive liefert der Kunde nach;
   Tausch = nur der `backgroundImage`-Pfad je Karte.
2. 🟢 **Erledigt:** Platzhalter für Karte 01 ist raus — dort liegt jetzt das finale Foto.

---

### ✅ Phase 6 (2026-07-22) — Aufbereitungs-Ablauf als eigene Sektion im Unfall-Design

**Auftrag:** „Wie läuft eine Autoaufbereitung ab?" genauso umbauen wie „Unfall & Schaden Leipzig" —
blaues Badge mit Icon + „Autoaufbereitung Leipzig", eigene Überschrift, gleiche Scroll-Animation.

**Vorgehen — geteilte Komponente statt Copy-Paste:**
* [x] `components/ScrollPinnedProcess.tsx` **neu** — die komplette Mechanik aus `AccidentDamageSection`
      extrahiert (Sticky-Pin, `useScrollProgress`, Feder, Karten-Crossfade, Fortschritts-Dots,
      Full-Bleed-Hintergrund, Karten-CTA + `tabIndex`-Absicherung). Parameter: `id`, `headingId`,
      `badgeIcon`, `badgeLabel`, `heading`, `intro`, `steps`, `ctas`.
      → „exakt gleich" ist damit **strukturell garantiert**, nicht nur nachgebaut (gleiche Logik wie
      beim geteilten `ExpandingCardAccordion`).
* [x] **Verbesserung dabei:** Track-Höhe ist jetzt `style={{height: steps.length * 100 + 'vh'}}` statt
      hartcodierter Tailwind-Klasse → wächst automatisch mit der Kartenzahl. Beseitigt den Footgun
      aus Phase 1 (dort musste 400vh→500vh manuell nachgezogen werden).
* [x] `AccidentDamageSection.tsx` auf reine Daten reduziert (312 → 84 Zeilen), Verhalten unverändert.
* [x] `components/DetailingProcessSection.tsx` **neu**: Badge „Autoaufbereitung Leipzig" + `Sparkles`-Icon,
      neue Überschrift („Fahrzeug aufbereiten lassen? Wir übernehmen Innenraum, Lack und Werterhalt bis
      zur Übergabe."), Intro, 5 Schritte (Wortlaut 1:1 aus „Prozess"), CTAs „Termin anfragen" +
      „Direkt anrufen", Karten-CTA bei Schritt 02.
* [x] Statischen Ablauf-Block aus `AutoDetailingExpertiseSection` entfernt (dort bleiben Header +
      Expertise-Akkordeon); neue Sektion in `HomePage` direkt darunter eingehängt.

**Verifikation:** Typecheck 0 · **0 Konsolenfehler** · beide Tracks dynamisch 4500 px (5 × Viewport) ·
Unfall-Sektion visuell unverändert (Regressions-Check) · neue Sektion Desktop + Mobile korrekt.

**Auffälligkeiten:**
1. ⏳ **OFFEN:** Die 5 Karten der Aufbereitungs-Sektion laufen auf **Interim-Fotos** (vorhandene
   CarCare-Kacheln, bewusst fünf unterschiedliche). Beim Tausch `image` **und** `imageAlt` gemeinsam
   aktualisieren. Gleiches gilt für die 4 Expertise-Karten aus Phase 5.
2. 🟢 **Nebeneffekt:** Startseite hat jetzt zwei scroll-gepinnte Prozess-Sektionen (je 500vh).
   Beobachten, ob die Gesamtlänge der Startseite noch angenehm ist — ggf. später Kartenzahl prüfen.
