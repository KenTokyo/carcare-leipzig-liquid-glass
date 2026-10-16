# Layout-Sprünge beim Laden: Fußzeile (R23) und Pop-up-Rest auf /karriere (R28)

**Angelegt:** 2026-10-16 · **Stand:** erledigt und live geprüft am 17.10. (Push `5021291` um 00:20, Vorschau ab 00:24)
**Auftrag des Users:** „Ja, mach mit Blocker 3 weiter (Layout-Sprung CLS 1,0 durch die Fußzeile, R23).“
**Arbeitskopie:** eigener Worktree (`%TEMP%\claude\r23`, Branch `2026-10-16-r23-fusszeile-cls`), weil im Hauptordner
parallel eine Sitzung an der mobilen Startseite arbeitet und dort selbst `dist/` baut.

## Befunde

**R23 (Audit 16.10.), lokal reproduziert:** Lokal gegen `dist/` ohne Drossel 0 auf allen Seiten und Fenstern; mit
Handy-Drosselung (CPU 4×, Lighthouse-Standard) CLS **1,0** durch `FOOTER.site-footer-shell`. Mit dem neuen Werkzeug
gegen den alten Build: **26 harte Befunde**, alle 1,0, alle Fußzeile, auf 26 der 29 Seiten bei 360 oder 390 px.
Desktop 0. Welche Seite es trifft, hängt am Timing.
*Ursache* (`components/Footer.tsx`): Der erste Render ist immer fixiert (`useState(true)`), gemessen wurde erst in
`useEffect` und dort noch einen Frame später per `requestAnimationFrame`. Malt der Browser dazwischen, steht die
fixierte Fassung einmal im Bild. Danach springt die ganze Fußzeile in den Seitenfluss: Verschiebung über die volle
Fensterhöhe = CLS 1,0. Betroffen ist jedes Fenster, in das die Fußzeile nicht passt (Handys, kleine Laptopfenster).

**R28 (neu, beim Messen gefunden):** Das vorgerenderte `/karriere` enthielt eine **statische Kopie des Stellen-Pop-ups**.
Es rendert per Portal in `<body>`, also außerhalb von `#root`; der Prerender hat es mitten in der Einblend-Animation
eingefroren (Deckkraft 0,22). Der Flash-Guard leert nur `#root`, die Kopie blieb für immer stehen. Gemessen live auf
`carcare-center.vercel.app` (390 und 1440 px): sofort eine Kopie ohne React, nach 1,2 s das echte Pop-up dazu, nach dem
Schließen bleibt die Kopie (Deckkraft 22 %, `z-40`, 358 × etwa 250 px unten) über den Stellen-Links „Kfz-Aufbereiter
Leipzig“ usw.: nicht schließbar, fängt die Taps ab, die diese Links treffen sollten. Ihr Layout-Sprung lokal 0,139 bei
1024 × 700 (Timing-abhängig). `npm run mobil` hat sie nicht gemeldet (Deckkraft unter seiner Sichtbarkeitsschwelle).
*Nebenbefund:* Jede Seite außer `/` trug das Guard-Skript doppelt (der Prerender lädt den Startseiten-Snapshot als
SPA-Ersatz und serialisierte dessen Guard mit): 57 Guards auf 29 Seiten. Harmlos, mit aufgeräumt.

## Lösungswege

**R23:**
1. Startzustand aus einer Schätzung (Fensterhöhe gegen eine feste Zahl): Die Höhe der Fußzeile hängt an Breite,
   Schrift und Inhalt; jede Änderung an der Fußzeile verschöbe die Schwelle unbemerkt.
2. Rein per CSS (`position: sticky` mit negativem `z-index`): Bei einer Fußzeile, die höher als das Fenster ist, kommt
   genau der Fehler aus dem Mobile-Check zurück (oberer Teil unerreichbar). Großer Umbau.
3. Fußzeile bis zur Messung unsichtbar: Behelf, ein Frame mehr, und der Platzhalter springt trotzdem.
4. **Gewählt:** vor dem ersten Bild messen (`useLayoutEffect`, erste Messung synchron). React legt das DOM an, misst,
   korrigiert den Zustand und rendert neu, bevor der Browser malt: Das erste Bild zeigt schon die endgültige Fassung.
   Spätere Änderungen (ResizeObserver, Fenstergröße) bleiben per `requestAnimationFrame` gebündelt.

**R28:**
1. Das Pop-up im Prerender gar nicht rendern (Erkennung per Flag): betrifft nur diese Komponente; das nächste Portal
   hätte denselben Fehler.
2. Der Flash-Guard entfernt die Reste zur Laufzeit: Crawler und Besucher ohne JavaScript behielten das eingefrorene,
   halb durchsichtige Pop-up im HTML.
3. **Gewählt:** Der Prerender übernimmt aus `<body>` nur, was die Vorlage dort hat (`#cc-boot`, `#root`), schreibt
   genau einen Guard und meldet, was er entfernt hat. Gilt für jedes künftige Portal. Gemessen vorher: in allen 29
   Seiten standen sonst nur `#cc-boot`, `#root` und Guards, außer dem Pop-up; Inhalt für Suche oder SEO geht nicht
   verloren (die Stellen stehen auf der Seite selbst).

## Phasen

### ✅ Phase 1 — Fußzeile misst vor dem ersten Bild (R23)
* [x] `components/Footer.tsx`: Messung in `useLayoutEffect`, erste Messung synchron, Folgemessungen per rAF; Hinweis im
  Code für eine spätere Umstellung auf `hydrateRoot`
* [x] Nachgemessen (Phase 4): 0 harte Befunde statt 26
**Referenzen:**
`components/Footer.tsx`

### ✅ Phase 2 — Prerender ohne Laufzeit-Reste (R28)
* [x] `scripts/prerender.mjs`: aus `<body>` nur `#cc-boot` und `#root`, alte Guards weg, genau ein Guard; Protokoll im
  Build: „/karriere: außerhalb von #root entfernt (Laufzeit-Reste): aside[Offene Stellen]“
* [x] Geprüft am neuen Build: 29 Seiten mit je genau einem Guard (vorher 57), keine Pop-up-Kopie. Im Browser: sofort
  kein Pop-up, nach 1,2 s genau eines (mit React), nach dem Schließen keines mehr (390 und 1440 px). Bildschirmfoto
  vorher (Vorschau live) mit Gespenst über den Stellen-Links, nachher frei.
**Referenzen:**
`scripts/prerender.mjs`

### ✅ Phase 3 — Messwerkzeug `npm run cls`
* [x] `scripts/check-cls.mjs`: 29 Routen × 360 × 640, 390 × 844, 1024 × 700, 1366 × 657, CPU 4×, Sprünge vom Laden bis
  2,5 s nach Netzwerkruhe, CLS als größtes Sitzungsfenster wie web-vitals, Verursacher mit Element und Text, drei Tabs
  parallel; hart ab 0,1, Hinweis ab 0,01; Bericht `output/cls/bericht.md`
* [x] Pflichtfrage im Kopf beantwortet (5 Punkte); Gegenprobe (`-- --gegenprobe`, 300-px-Block nach dem Laden):
  gemeldet, z. B. 0,211 bei 1366
* [x] Zeile in `CLAUDE.md` (Messwerkzeuge), `npm run cls` in `package.json`
**Referenzen:**
`scripts/check-cls.mjs`

### ✅ Phase 4 — Build, alle Messwerkzeuge, Doku, Live-Nachweis
* [x] Build 16.10., 19:48:36 grün; `npm run cls`: **0 harte Befunde** (vorher 26), 2 Hinweise je 0,043 bei 1366 × 657
  (`/autolackierung-leipzig`, `/hagelschadenreparatur-leipzig`, Verursacher `body` nach etwa 300 ms; in vier
  Einzelläufen ohne Parallellast nicht reproduzierbar, Scrollbalken ausgeschlossen: Optimierung O1)
* [x] Nach der Umnummerierung (R25 → R28, nur Kommentare, auch in `scripts/prerender.mjs`) frisch gebaut, **Build
  16.10., 20:07:14**, und alle Werkzeuge dagegen: `npm run cls` 0 harte Befunde, 2 Hinweise (0,054 bei 1024 auf
  `/unfallinstandsetzung-leipzig`, 0,043 bei 1366 auf einem Wissensartikel, wieder `body` nach etwa 300 ms, also
  jedes Mal andere Seiten: O1) · Mobil 0 harte Befunde (Fußzeile 360: 926 px, 390: 863 px im Seitenfluss; 430: 848 px
  fixiert) · Aussparung ohne Überdeckung, Geometrie an 23 Breiten · Zielgruppen „alle Karten auf allen Fenstern in
  Ordnung“ · Kontrast 6.282 Textstellen ohne Befund · Meta 0 von 29 · tote Dateien 0 (173 Quelldateien, 51 Einstiege)
* [x] Backlog: R23 und R28 als umgesetzt (🟨 bis zum Nachweis auf der Vorschau), Zähler nachgezogen
* [x] Freigabe des Users zum Push (17.10.). Committet (`dec3477`) und auf den inzwischen weitergezogenen `main`
  aufgesetzt (`f38bc2b`, „Startseite mobil“ der parallelen Sitzung; Konflikt nur in `package.json`, beide Skripte
  behalten). Zusammengeführten Stand neu gebaut (16.10., 23:56:06): Fußzeile weiter 0, Prerender entfernt die
  Pop-up-Kopie. **Neu im Parallellauf:** 2 harte Befunde am Desktop (`/leasingrueckgabe-leipzig` 0,134 und
  `/smart-repair-leipzig` 0,115, Quelle `div.absolute` bzw. `body`, dazu Hinweise mit dem Glasknopf „Schaden melden“).
  Gegengeprüft: einzeln je drei Läufe höchstens 0,01, auf der Vorschau (ohne diese Änderungen) 0. Also Lastspitzen.
  `npm run cls` bestätigt harte Befunde seitdem einzeln (bis zu zwei Nachmessungen, Kopf des Skripts, Pflichtfrage
  Punkt 6). Danach: **0 harte Befunde**, 25 Hinweise (meist 0,010 `body` am Desktop; eine Lastspitze 0,170 auf `/` bei
  1024, einzeln 0,000 und 0,000). Gegenprobe weiter bestanden.
* [x] Nebenbei live gemessen, **vor** dem Push: `/karriere` auf der Vorschau 0,078 bis 0,088 bei 1366 und **0,130**
  bei 1024, jedes Mal durch `aside.fixed` (das Pop-up-Gespenst, R28). Live lag `/karriere` am Desktop also über 0,1.
* [x] Vor dem Push erneut aufgesetzt, weil die parallele Sitzung inzwischen „Runde 3“ gepusht hatte (`85a3820`;
  Konflikte nur in `CLAUDE.md`, benachbarte Tabellenzeilen, beide neuesten Fassungen behalten). Typprüfung,
  Weiterleitungs- und Vercel-Wächter grün. Push `85a3820..5021291` (Commits `898251a`, `ba088bf`, `3c10095` und
  Push-Stand). Dabei der Push-Stand-Hook korrigiert: Er las die Übersicht aus `HEAD` des Projektordners (dort der
  Branch der parallelen Sitzung) und hätte den korrekt vorbereiteten Push gesperrt; jetzt liest er sie im gepushten
  Ref. Gegenprobe: Ein Ref ohne passende Übersicht wird weiter gesperrt.
* [x] **Nachweis auf der Vorschau** (17.10., 00:24, je drei Läufe mit CPU 4×): Pop-up auf `/karriere` sofort keines,
  nach 1,2 s genau eines, nach dem Schließen keines (390 und 1440 px). CLS auf `/`, `/karriere`, `/leistungen`,
  `/ueber-uns`, `/privatkunden`, `/felgenreparatur-leipzig` bei 360 und 390 px: **36 von 36 Läufen 0,000** (vorher 1,0).
  `/karriere` am Desktop: 0 bis 0,054 statt 0,130. `npm run weiterleitungen -- --live` 52 von 52, `npm run smoke`
  29 Routen ok, ein Guard je Seite.

---

## Kommentare

### Phase 1–4
**Eingehalten:** unter 700 Zeilen ✅ (Footer 394, check-cls 170, prerender 302), Lösungswege verglichen ✅, Ursache am
Code belegt und lokal reproduziert, bevor korrigiert wurde ✅, vorher und nachher mit demselben Werkzeug gemessen ✅,
Pflichtfrage beantwortet ✅, Gegenprobe ✅, alle Werkzeuge gegen den letzten Build ✅, CSS/JS-Lösung ohne neuen
Scroll-Listener ✅, Dev-Server nicht gestartet ✅ (`vite preview` über die Werkzeuge, eigene Dateiserver für Einzel-
proben), Arbeit isoliert im Worktree, nichts aus der parallelen Sitzung berührt ✅, keine Kundennummer vergeben ✅.

**Auffälligkeiten/Probleme (nach Schwere):**
1. 🔴 **Kritisch (behoben):** Pop-up-Gespenst auf `/karriere` (R28): halb durchsichtige, nicht schließbare Kopie über
   den Stellen-Links, die Taps abfing. Live auf der Vorschau seit dem Prerender des Pop-ups. Ursache für jedes Portal
   im Prerender behoben.
2. 🟠 **Hoch (behoben):** CLS 1,0 durch die Fußzeile auf Handys (R23); 26 harte Befunde → 0 in drei Läufen.
3. 🟠 **Hoch (vermieden):** Nummernkonflikt. Die parallele Sitzung „mobil-startseite“ hat in ihren noch nicht
   committeten Dokumenten R25 bis R27 vergeben; dieser Befund hieß zuerst ebenfalls R25. Vor jedem Commit umbenannt
   in **R28**. Lehre: Vor dem Vergeben auch die uncommitteten Dokumente im Hauptordner durchsuchen, nicht nur `HEAD`.
4. 🟡 **Mittel (beobachten):** kleiner Sprung 0,04 bis 0,05 am Desktop, Verursacher `body` nach etwa 300 ms, in jedem
   Lauf auf zwei anderen Seiten, unter Last; einzeln nicht reproduzierbar (Optimierung O1). Unter Googles Grenze.
5. 🟢 **Niedrig (behoben):** doppelter Flash-Guard auf 28 Seiten.

Optimierungsplan: `docs/cls-layoutspruenge/tasks/2026-10-16-cls-layoutspruenge-optimierung-tasks.md`
