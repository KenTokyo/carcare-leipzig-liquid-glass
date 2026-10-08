# Tote Komponenten aufräumen

**Angelegt:** 2026-10-08 · **Branch:** `2026-10-08-tote-komponenten` (von `main` @ `c8454b9`), nicht gepusht
**Auslöser:** Lektorat L17-17 (`docs/lektorat/befunde/L17-ueber-uns.md` auf `2026-10-06-lektorat`):
`components/Hero.tsx` wird seit dem Redesign `a701ce9` nirgends eingebunden und stört mit dem alten
„Premium-Anbieter“-Satz die Textsuchen im Lektorat.
**Auftrag (User):** Hero.tsx prüfen, weitere unimportierte Komponenten finden, jede einzeln
gegenprüfen, Ungenutztes entfernen, Build grün halten, Ergebnis kurz dokumentieren, eigener Branch.

## Ergebnis in Kürze

| Datei | Zeilen | Warum ungenutzt | Entscheidung |
|---|---|---|---|
| `components/Hero.tsx` | 109 | Startseiten-Hero des ersten Entwurfs („PREMIUM CARE“, „Seit 2010“, Unsplash-Foto). Seit dem Redesign `a701ce9` durch `HeroSection.tsx` ersetzt. 0 Importe, nicht im Vite-Bundle, kein Skript liest sie per Pfad, kein anderer Branch ändert oder importiert sie. Die frühere Vorgabe „nicht anfassen“ (Paket A, C, G) war laut Paket C „dann zu klären“; mit diesem Auftrag geklärt | **gelöscht** |
| `components/Jobs.tsx` | 117 | Jobkarten-Sektion, ebenfalls 0 Importe, nicht im Bundle. Kopfvermerk „BEWUSST GEPARKT, KEIN TOTER CODE, NICHT LÖSCHEN“ (User-Klarstellung 2026-07-19, `docs/accident-scrollytelling/tasks/2026-07-19-pin-jitter-fix-tasks.md`, Finding 5) | **bleibt**, Rückfrage an den User (Kommentare, Punkt 1) |

Alle anderen 59 Dateien unter `components/` (inkl. `formulare/`) sind erreichbar und im Bundle.
Außerhalb von `components/` ist ebenfalls jede Quelldatei erreichbar.

---

### ✅ Phase 1 — Erfassen, vier unabhängige Verfahren
**Ziel:** Nicht per Pfad-Grep entscheiden (Hinweis aus `docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`),
sondern über den Importgraphen, und den mit unabhängigen Verfahren gegenprüfen.
* [x] **Importgraph (TypeScript-Compiler):** 163 Quelldateien (`.ts/.tsx/.mjs/.js/.cjs`, ohne
  `docs/ public/ output/ dist/`), statische und dynamische Importe, Re-Exporte, `require`, aufgelöst mit den
  Optionen aus `tsconfig.json` (`@/`-Alias). Einstiege: `index.tsx` (aus `index.html`), `api/`, alle
  `scripts/`, Konfigdateien. 0 unaufgelöste Importe, kein `import.meta.glob`, kein `React.lazy`; einziger
  berechneter Pfad ist `scripts/bilder-inventar.mjs:468` (lädt `data/bildherkunft.ts`, das ohnehin erreichbar ist).
  Ergebnis: `Hero.tsx`, `Jobs.tsx`, sonst nichts.
* [x] **Gegenprobe Vite-Bundle:** `vite build` mit `write: false` und einem Plugin, das `this.getModuleIds()`
  ausliest. 121 Projektmodule im Bundle; von 61 Dateien unter `components/` fehlen genau dieselben zwei.
  Außerhalb nur `types.ts` (reine Typimporte) und die Build-Konfigs, erwartungsgemäß.
* [x] **Ebene darunter, ungenutzte Exporte** (TS-LanguageService `findReferences`): **0** Exporte ohne jeden
  Verweis. 11 Typen/Konstanten werden nur in der eigenen Datei benutzt (z. B. `SEOHeadProps`,
  `ServiceLayoutProps`, `STAIR_COLUMNS`); kein toter Code, bleibt.
* [x] **Importiert, aber nie benutzt** (`tsc --noEmit --noUnusedLocals`): keine Komponente. Nur zwei
  überflüssige `import React` (Phase 3).
* [x] **Textsuche nach Dateinamen** (Skripte lesen Quellen auch per Pfad: `check-gedankenstriche.mjs`,
  `check-faq.mjs`, `bilder-inventar.mjs`): kein Skript nennt `Hero.tsx` oder `Jobs.tsx`.
* [x] **Andere Branches:** keiner ändert eine der beiden Dateien gegenüber `main`, keiner importiert `Hero`.

### ✅ Phase 2 — Löschen und Folgestellen
* [x] `components/Hero.tsx` entfernt
* [x] `docs/bilder/motive.json` → `bekannt`: Eintrag für das Unsplash-Foto aus `Hero.tsx` entfernt. Ohne das
  meldet `npm run bilder` „nennt Fälle, die es nicht mehr gibt“ (Skript Zeile 641)
* [x] `docs/bilder/README.md`: genau die eine Zeile dazu entfernt, die der Generator auch entfernt (am Diff
  des Laufs vom 08.10. abgeglichen; den übrigen Lauf nicht übernommen, siehe Kommentare, Punkt 2)
* [x] `docs/backlog/offene-punkte-konsolidiert.md`: Zeile „Fünf verwaiste Komponenten“ nachgezogen
* [x] `DESIGN.md` §5: Hinweis, dass 5.1/5.3/5.4 Komponenten des ersten Entwurfs beschreiben, die es nicht mehr
  gibt (5.3 und 5.4 schon vorher, 5.1 durch diese Löschung)

### ✅ Phase 3 — Mitgefunden: ungenutzte React-Importe
* [x] `emails/AnfrageEmail.tsx` und `scripts/test-email.tsx`: `import React from 'react'` entfernt. JSX läuft
  über `react-jsx` (`tsconfig.json`, `scripts/build-email.mjs` mit `ReactJSX`), der Import wurde nie gelesen
  und beim Übersetzen ohnehin verworfen
* [x] `tsc --noEmit --noUnusedLocals`: danach 0 Meldungen im ganzen Projekt
* [x] `npm run test:email`: beide PASS (Schein-Transport, es wird nichts versendet)

### ✅ Phase 4 — Werkzeug ins Repo, damit das Messen wiederholbar ist
* [x] `scripts/check-tote-dateien.mjs` (`npm run tote-dateien`, unter 1 s, braucht kein `dist/`): Importgraph wie
  in Phase 1, erkennt transitive Waisen, nennt geparkte Dateien („BEWUSST GEPARKT“ im Kopf) bei jedem Lauf,
  nennt bei jedem Fund Dateien, die den Namen als Text enthalten (Wortgrenzen, damit `components/Hero` nicht
  `components/HeroSection` trifft). Exit 1 bei toten Dateien und bei `import.meta.glob`
* [x] Pflichtfrage aus `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md` im Skriptkopf beantwortet
* [x] **Negativproben** (danach zurückgebaut): `Hero.tsx` wiederhergestellt plus eine Datei, die nur
  `Hero.tsx` importiert → beide gemeldet, Exit 1; Pfadtext `'components/Hero.tsx'` in einem Skript → als Hinweis
  genannt; `import.meta.glob(` in einer Komponente → Abbruch. Fehltreffer gefunden und behoben: Präfix
  `components/Hero` traf `components/HeroSection`; die Fehlermeldung des Skripts fand sich selbst als Glob
* [x] `package.json` (`tote-dateien`) und Tabelle „Messwerkzeuge“ in `CLAUDE.md`

### ✅ Phase 5 — Bauen, messen, committen
* [x] `npm run build` grün (Build vom 08.10.2026, 18:08): Prebuild-Wächter (E-Mail, FAQ, Nummernräume, Vercel,
  Sitemap 29 URLs), `tsc --noEmit`, Vite, **Prerender 29/29**, FAQ-HTML 29/29, Dummies 0, Gedankenstriche 0
* [x] `npm run tote-dateien`: 163 Quelldateien, 162 erreichbar, nur `Jobs.tsx` (geparkt), Exit 0
* [x] `npm run bilder` gegen diesen Build: Hero-Zeile verschwindet, keine Warnung zu veralteten bekannten
  Fällen. Der Lauf endet aber mit Exit 1 aus einem älteren Grund (Kommentare, Punkt 2)
* [x] Zwei Commits auf `2026-10-08-tote-komponenten`, nicht gepusht

**Referenzen:**
`components/Hero.tsx` (gelöscht)
`scripts/check-tote-dateien.mjs`
`docs/bilder/motive.json`

---

## Kommentare

### Phasen 1–5
**Eingehalten:** Importgraph statt Pfad-Grep ✅, zweites unabhängiges Verfahren (Vite-Bundle) ✅, frühere
Vorgaben vor dem Löschen gelesen ✅, geparkte Datei respektiert ✅, Folgestellen (Bildinventar, Backlog,
DESIGN.md) mitgezogen ✅, Negativproben fürs neue Werkzeug ✅, Build und Wächter grün ✅, unter 700 Zeilen je
Datei ✅, kein Mojibake ✅, Dev-Server nicht gestartet ✅, Bildnummern nicht angetastet ✅, nicht gepusht ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch, Entscheidung beim User: `Jobs.tsx` ist inhaltlich überholt.** Geparkt am 2026-07-19 „für die
   spätere `/karriere`-Subseite“. Die gibt es seit Paket D mit eigenen Stellenkarten aus `data/jobs.ts`
   (`JobCards`, `JobPopup`, `JobBanner`). `Jobs.tsx` enthält drei Dinge, die auf der Seite falsch wären:
   „Serviceberater (m/w/d)“ (per 1.24 entfernt), Du-Ansprache „Werde Teil des Teams“ (Textregel: „Sie“) und
   „an 10 Standorten“ (ein Standort). Stört Lektorats-Suchen genau wie
   `Hero.tsx`. Wenn die Parkung erledigt ist: `git rm components/Jobs.tsx`, §5.5 in `DESIGN.md` mitnehmen.
2. 🟠 **Hoch, älter als diese Änderung, als eigene Aufgabe abgelegt: `npm run bilder` endet mit Exit 1 und will
   drei Kundennummern verlieren.** B102 und B111 (Videos Rundgang/Arbeitsplatz) sieht der Rundgang nicht mehr,
   seit die Videos erst in Sichtweite laden (`aa51215`, 05.10.); B109 („Industriekaufmann/-frau“) wird nach der
   Umbenennung in „Bürokaufmann/-frau“ (`37b8ec2`, 05.10.) als neue Stelle B153 geführt, `motive.json` trägt
   noch einen Vermerk auf B109. Seit dem 03.10. lief das Inventar nicht mehr. **Lauf hier bewusst nicht
   übernommen**, `nummern.json` unverändert. Folgesession vorgeschlagen („Bildinventar reparieren“).
3. 🟢 **Niedrig: `DESIGN.md` §5 beschreibt den ersten Entwurf**, nicht die heutige Seite (auch 5.2
   „Telefon-Button“, 5.6 „4-Spalten-Grid“, heute 6 Spalten). Hinweis gesetzt; Neufassung ist eine eigene Aufgabe.
4. 🟢 **Niedrig: `npm run tote-dateien` als Build-Wächter?** Unter 1 s, würde neue Waisen sofort melden. Nicht
   eingebaut, weil ein neuer Wächter den Build für alle brechen kann; auf Zuruf eine Zeile im `prebuild`.
5. 🟢 **Erledigt:** Lektorat L17-17 ist damit behoben; der Vermerk steht auf `2026-10-06-lektorat` und wird dort
   beim nächsten Durchgang abgehakt (Branch hier nicht angefasst).
