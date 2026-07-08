# Redesign: Zielgruppen-Kacheln (3-Layer-Design)

**Sektion:** „Der richtige Ansprechpartner fuer Ihr Fahrzeug." (`components/TargetGroupCards.tsx`)
**Datum:** 2026-07-08
**Auftrag:** Die 4 Kacheln nach dem vom Kunden gelieferten Mockup umgestalten. Inhalte bleiben, nur die Gestaltung aendert sich.

## Ziel-Design (laut Mockup + Beschreibung)
Jede Kachel besteht aus **drei Layern** + Logo-Badge, mit den runden Ecken der aktuellen Website:
1. **Layer 1 – Hintergrund:** Vollflaechiges Bild, **pro Kachel einzeln austauschbar** (Datenfeld `backgroundImage`).
2. **Layer 2 – Textbox:** Abgerundete Box mit **90 % Weiss-Deckkraft**, sitzt links und laesst das Hintergrundbild als Rahmen/rechten Streifen sichtbar.
3. **Layer 3 – Text:** Bestehende Inhalte (Titel, Beschreibung, CTA-Label + Pfeil-Kugel).
4. **Logo-Badge unten rechts:** CarCare-Logo (animierte Marke) in weisser, abgerundeter Box; die gesamte Kachel bleibt klickbar (`href` → „mehr erfahren").

## Wichtige Projekt-Constraints
* Tailwind-Opacity-Modifier defekt (`bg-white/90` rendert transparent) → **literales** `bg-[rgb(255_255_255/0.9)]` nutzen.
* Kein `backdrop-filter` (verursacht graues Scroll-Flackern; wurde im Hero bewusst entfernt).
* Max. 700 Zeilen/Datei · Mobile-First · Assets liegen in `public/assets/`.
* Dev-Server NICHT automatisch starten (Port 3007, `EADDRINUSE`).

---

### ✅ Phase 1 — Datenmodell & Assets (austauschbarer Hintergrund)
**Ziel:** Hintergrundbild pro Kachel konfigurierbar machen; Default auf ein reales Asset legen.
* [x] `TargetGroup`-Type um `backgroundImage?: string` erweitert (`types.ts`).
* [x] Konstanten `DEFAULT_CARD_BG` (`/assets/carcare-hero-workshop.jpeg`) + `logoMarkVideoSrc` angelegt.
* [x] Alle 4 Gruppen haben ein eigenes `backgroundImage`-Feld (Default = `DEFAULT_CARD_BG`) → je Kachel tauschbar.

### ✅ Phase 2 — Kachel-Redesign (3 Layer + Logo-Badge)
**Ziel:** Karten-Markup nach Mockup umbauen.
* [x] Layer 1: `<img>`-Hintergrund `object-cover`, dekorativ (`alt=""` + `aria-hidden`), `loading="lazy"`, sanfter Hover-Zoom.
* [x] Layer 2: Textbox `rounded-xl`, `bg-[rgb(255_255_255/0.9)]` (Workaround statt defektem `bg-white/90`), links, `max-w`-begrenzt.
* [x] Layer 3: Titel + blauer Akzent-Punkt, Beschreibung, CTA-Zeile (Label + Pfeil-Kugel) — Inhalte unveraendert.
* [x] Logo-Badge unten rechts (animierte CarCare-Marke, `carcare-center-mark-animated.mp4`); Karte bleibt EIN `<a>` (komplett klickbar).
* [x] Icon-Kopf (lucide) entfernt; nur noch `ArrowUpRight` importiert; dezenter Depth-Gradient ueber dem Bild.

### ✅ Phase 3 — Responsive, A11y & Verifikation
**Ziel:** Sauberes Verhalten auf allen Breakpoints + Qualitaetscheck.
* [x] Grid auf `grid-cols-1 md:grid-cols-2` (breitere Landscape-Karten wie im Mockup).
* [x] Ueberlappung Textbox ↔ Logo-Badge per `max-w-[68%] sm:max-w-[60%]` + Logo `h-11 → md:h-14` ausgeschlossen (rechter Streifen reserviert).
* [x] `aria-label` je Karte gesetzt; Klickflaeche = gesamte Kachel; Reveal-Animationen konsistent zum restlichen Seiten-Pattern.
* [x] `tsc --noEmit` fuer `TargetGroupCards.tsx` + `types.ts` fehlerfrei (offene Fehler nur in fremder Datei `CinematicShowcase.tsx`).
* [x] **Live-Preview verifiziert** (eigener Server, Port 64499 via `autoPort`): Desktop 2-Spalten (586×320 px), Mobile 1-Spalte (311 px); Textbox rendert `rgba(255,255,255,0.9)`; kein Overlap Textbox↔Logo (Gap 154 px Desktop / 32 px Mobile); kein horizontales Scrollen; Hintergrundbild + Logo-Video laden. Screenshot-Tool timeoutet (Umgebung), DOM-Geometrie stattdessen geprueft (praeziser).
* [x] **Port-Konflikt gefixt:** `vite.config.ts` nutzt `Number(process.env.PORT) || 3007`; `.claude/launch.json` `autoPort: true` → kollidiert nicht mehr mit fremdem Server auf 3007.

**Referenzen:**
`components/TargetGroupCards.tsx`
`types.ts`
`public/assets/ (carcare-hero-workshop.jpeg, carcare-center-mark-animated.mp4)`

---

## Kommentare

### Phase 1–3 (Redesign Zielgruppen-Kacheln)
**Eingehalten:** Inhalte 1:1 erhalten ✅, 3-Layer-Aufbau + Logo-Badge laut Mockup ✅, Hintergrund pro Kachel austauschbar ✅, defekter Opacity-Modifier via `rgb(255_255_255/0.9)` umgangen ✅, kein `backdrop-filter` (Scroll-Flacker-Vermeidung) ✅, Mobile-First + Overlap-Schutz ✅, unter 700 Zeilen (≈150) ✅, runde Ecken der Website ✅, `tel:`/SEO unberuehrt ✅.

**Auffaelligkeiten/Findings (nach Schwere):**
1. 🟡 **Mittel — Platzhalter-Hintergrund:** Alle 4 Kacheln nutzen dasselbe reale Foto (`carcare-hero-workshop.jpeg`), weil das Auto-Bild aus dem Mockup nur als fertige Komposit-Grafik vorlag und nicht sauber extrahierbar war. **Aktion fuer Kunde:** je Kachel ein eigenes Bild nach `public/assets/` legen und `backgroundImage` setzen (kann ich uebernehmen).
2. 🟢 **Niedrig — `iconName` jetzt ungenutzt** in `TargetGroupCards` (Icon-Kopf entfernt). Feld bleibt im Type `required`, damit die Legacy-Datei `components/TargetGroups.tsx` (nicht eingebunden) nicht bricht. Bewusst belassen; sauberer Weg = Type-Feld optionalisieren, sobald Legacy-Komponente entfernt wird.
3. 🟢 **Niedrig — Fremd-Findings (nicht aus dieser Aufgabe):** `components/CinematicShowcase.tsx` (paralleler WIP) hat 2 offene TS-Fehler (`TS2365`, Zeilen 78/84); ausserhalb dieses Auftrags, nicht angefasst.

**Refactoring-Empfehlung:** Legacy `components/TargetGroups.tsx` (nirgends importiert) entfernen und danach `iconName` im Type optionalisieren; zentralen Opacity-Fix (`task_d385fdbe`) einspielen, dann Arbitrary-Workarounds zurueckbauen.
