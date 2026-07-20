# Hero: neues Desktop-Motiv + radialer Schwarzverlauf (Ecke oben links)

> **Ziel (User, 2026-07-20):** (1) Das Desktop-Hero-Bild gegen ein neues Motiv tauschen — **nur Desktop**,
> das mobile Bild kommt separat nach. (2) Den bisherigen schwarzen Hintergrund der Hero-Sektion
> **komplett** entfernen und durch **einen einzigen radialen Schwarzverlauf** ersetzen:
> Zentrum exakt in der **Ecke oben links**, dort **94 %**, in der **Mitte 45 %**, **unten rechts 0 %**.

## Entscheidungen (User-Rückfrage 2026-07-20)

| Frage | Entscheidung |
|---|---|
| Verlauf auch auf Mobile? | **Ja, überall** — ein Verlaufs-System, keine Doppelsysteme. Mobile wird nachjustiert, sobald das mobile Bild da ist. |
| Grundfarbe `bg-gray-950` hinter dem Bild? | **Behalten** — reiner Lade-Fallback, unsichtbar sobald das Bild steht. |

## Warum `circle` und nicht `ellipse` (gerechnet, nicht geraten)

Zentrum in der Ecke oben links `(0,0)`, Endpunkt `farthest-corner` = Ecke unten rechts.

* **`circle farthest-corner`:** Radius `r = √(W²+H²)`. Die **Bildmitte** `(W/2, H/2)` hat den Abstand
  `0.5·√(W²+H²) = 0.5·r` → liegt **immer exakt beim 50 %-Stop**, unabhängig vom Seitenverhältnis.
  Die drei Wunschwerte mappen damit 1:1 auf `0 % / 50 % / 100 %`.
* **`ellipse farthest-corner`:** Radien `rx = √2·W`, `ry = √2·H`. Die Bildmitte landet bei
  `√(0.125+0.125) = 35.4 %` → dort wären **59 %** statt der gewünschten 45 %. **Verworfen.**

Ergebnis: `radial-gradient(circle farthest-corner at 0% 0%, …94 % / 50 % → 45 % / 100 % → 0 %)`.
Schwarz = `--cc-carbon-rgb` (im Projekt als Tailwind-`black` getokent, `tailwind.config.js:22`).

## Was ersetzt wird (Ist-Zustand)

Die Hero-Sektion trug **zwei** Verdunkelungs-Ebenen (beide entfallen):
1. `.hero-copy-veil` (`index.css`) — seitlicher Textteppich links→rechts, mit Navbar-Maske.
2. `bg-gradient-to-t from-gray-950/20 via-gray-950/45 to-gray-950/85` (`HeroSection.tsx`) — vertikal.

---

## Phasen

### ✅ Phase 1 — Bild konvertieren & einbinden (Desktop)
**Ziel:** Neues 21:9-Motiv als WebP, Drop-in ohne Layout-Shift.
* [x] Quelle gefunden: `~/Downloads/Hero-leipzig-carcare-desktop.webp.png` (2688x1152, 4,83 MB)
* [x] Über Projekt-Pipeline konvertiert (`npm run images`, Q82, max 2400px) — in Temp-Ordner
      `public/assets/_herosrc`, damit das Skript nicht nebenbei `carcare-center-wordmark.png` mitnimmt
* [x] Ergebnis `public/assets/hero-leipzig-carcare-desktop.webp`: **4,83 MB → 284 KB (−94 %)**,
      **2400x1029** = pixelidentisch zum Vorgänger → `width`/`height` im Markup bleiben gültig
* [x] Neuer Dateiname statt Overwrite: symmetrisch zu `-mobile` und selbsterklärend
      (⚠️ **Korrektur:** ursprünglich zusätzlich mit „cache-bustend" begründet — das trägt **nicht**.
      Nachgeprüft: `https://www.carcare-center.de/assets/hero-leipzig-carcare*.webp` liefert **500**,
      die Relaunch-Seite ist unter der Domain noch nicht live. Es gab also nie einen öffentlich
      gecachten Stand. Der Name bleibt trotzdem, weil die Symmetrie für sich steht.)
* [x] `src` in `HeroSection.tsx` umgestellt; mobiler `<source>` **unangetastet**
* [x] Verwaistes `hero-leipzig-carcare.webp` entfernt (nur an dieser einen Stelle referenziert,
      via Git wiederherstellbar) — `public/` wird 1:1 deployed, Altlast wäre Server-Traffic
**Referenzen:** `components/HeroSection.tsx`, `public/assets/hero-leipzig-carcare-desktop.webp`

### ✅ Phase 4 — Mobiles Motiv nachgezogen (2026-07-20, Nachlieferung des Users)
**Ziel:** Hochkant-Fassung desselben Motivs einsetzen, damit Desktop und Mobile dieselbe Aussage tragen.
* [x] Quelle `~/Downloads/Hero-leipzig-carcare-mobile_new.webp.png` (1744x2336, 5,82 MB)
* [x] Konvertiert: **5,82 MB → 373 KB (−94 %)**, 1744x2336 (AR 0,747)
* [x] `hero-leipzig-carcare-mobile.webp` überschrieben — gefahrlos, da nicht öffentlich ausgeliefert
      (500-Nachweis oben); Name bleibt symmetrisch zu `-desktop`
* [x] `width`/`height` am `<source>` von 1360x2048 auf **1744x2336** korrigiert (sonst falsches
      Seitenverhältnis reserviert → CLS-Risiko, SEO-GEO §2.2)
* [x] Art-Direction-Kommentar an den neuen Stand angeglichen (alte Zahlen 1360x2048 / „~51 %" waren
      nach dem Tausch falsch)
* [x] **`alt` gilt jetzt für beide Quellen korrekt** — Finding 2 aus Phase 1–3 ist damit **erledigt**,
      weil Desktop und Mobile dasselbe Motiv zeigen
* [x] Verifiziert (Puppeteer, 390x844 @ DPR 2): neues Motiv lädt, Verlauf greift, Text lesbar
**Referenzen:** `components/HeroSection.tsx`, `public/assets/hero-leipzig-carcare-mobile.webp`

### ✅ Phase 2 — Schwarz-Ebenen entfernen, radialen Verlauf einsetzen
**Ziel:** Genau **eine** Verdunkelungs-Ebene nach User-Spezifikation.
* [x] `.hero-copy-veil`-Div aus `HeroSection.tsx` entfernt
* [x] Vertikales `bg-gradient-to-t`-Div aus `HeroSection.tsx` entfernt
* [x] `.hero-copy-veil`-Regel aus `index.css` entfernt (wäre sonst toter CSS-Code)
* [x] `.hero-radial-veil` in `index.css` ergänzt (Kreis-Verlauf, Herleitung als Kommentar)
* [x] `bg-gray-950` als Lade-Fallback behalten (User-Entscheidung)
**Referenzen:** `components/HeroSection.tsx`, `index.css`

### ✅ Phase 3 — Verifikation (localhost:3007)
* [x] Computed Style: `radial-gradient(circle at 0% 0%, rgba(8,11,16,.94) 0%, rgba(8,11,16,.45) 50%,
      rgba(8,11,16,0) 100%)` — `farthest-corner` wird vom Browser als Default weggekürzt (korrekt)
* [x] **Verlauf trifft die Vorgabe exakt** (gerechnet gegen die reale Rahmengeometrie):
      Ecke oben links **94,0 %** · Bildmitte **45,0 %** · Ecke unten rechts **0 %**
      (Nebenwerte: unten links 39,1 %, oben rechts 15,8 %)
* [x] Lesbarkeit: hinter der H1 liegen **54,5 %** (Mitte) bis **70,5 %** (linker Rand) Schwarz
* [x] Bildquelle Desktop = `hero-leipzig-carcare-desktop.webp`, `natural 2400x1029`
* [x] Genau **eine** Overlay-Ebene im DOM; `.hero-copy-veil` nicht mehr vorhanden
* [x] Mobile (390x844): lädt weiterhin `hero-leipzig-carcare-mobile.webp` + neuen Verlauf, Text lesbar
* [x] `tsc --noEmit` → Exit 0; keine Konsolenfehler
* [x] Visueller Nachweis Desktop (1512x950) + Mobile (390x844) via **Puppeteer** erbracht —
      der In-App-Preview-Pane läuft beim Capture weiterhin in den 30-s-Timeout (bekanntes
      Tooling-Limit, siehe `docs/accident-scrollytelling/.../pin-jitter-fix`, Finding 3).
      Puppeteer ist als devDependency ohnehin im Projekt → verlässlicher Ersatzweg.
**Referenzen:** `components/HeroSection.tsx`, `index.css`

---

## Kommentare

### Phase 1–3 (Hero-Bild + radialer Verlauf)
**Eingehalten:** Verlauf **gerechnet statt geraten** (circle vs. ellipse mathematisch hergeleitet, Werte
gegen die reale Rahmengeometrie nachgemessen) ✅, Rückfrage vor Umsetzung bei echter Mehrdeutigkeit
statt Raten ✅, Planung vor Code ✅, Projekt-Bildpipeline genutzt statt Handkonvertierung ✅,
WebP + 284 KB + explizite `width`/`height` (SEO-GEO §2.2 / §3.3) ✅, `alt` konkret statt generisch ✅,
Mobile-First-Split unangetastet ✅, kein toter CSS-Code hinterlassen (`.hero-copy-veil` entfernt) ✅,
Design-System-Token statt Hardcoded-Schwarz (`--cc-carbon-rgb`) ✅, kein reduced-motion-Gate ✅,
Encoding sauber ✅, < 700 Zeilen/Datei ✅, `tsc` grün ✅.

**Messwerte:** Verlauf 94,0 / 45,0 / 0 % (Soll 94 / 45 / 0) · Bild 4,83 MB → **284 KB (−94 %)** ·
2400x1029 = pixelidentisch zum Vorgänger (kein Layout-Shift) · Kontrast hinter H1 54,5–70,5 % Schwarz.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch (OFFEN — braucht deine Design-Entscheidung, bewusst NICHT eigenmächtig geändert):**
   Das 21:9-Panorama wird am Desktop **massiv angeschnitten**. Gemessen bei 1920x1080:
   sichtbar sind nur **52 % der Bildbreite**, **48 % fallen seitlich weg**, Zoom **1,50x**.
   Ursache ist bestehende Mechanik, kein neuer Fehler: Die Parallax-Ebene ist `h-[147%]` der
   Rahmenhöhe (für die Parallax-Reise), dadurch hat sie AR **1,22** — das Bild hat AR **2,33**.
   `object-cover` skaliert also auf die Höhe und schneidet die Breite weg. Das alte Motiv traf
   dasselbe Schicksal, fiel aber weniger auf. Konkret heißt das: von deinem gewählten Motiv
   (beide Fahrzeuge vollständig) sieht man am Desktop im Wesentlichen die Front des blauen Wagens.
   **Lösungswege → siehe Optimierungsplan:** `2026-07-20-hero-bildausschnitt-optimierung-tasks.md`
2. ✅ **Mittel (ERLEDIGT in Phase 4):** Das `<picture>` hat **einen** `alt` für beide Quellen; solange
   mobil noch der alte Showroom-Shot lag, beschrieb er dort etwas anderes. Mit dem nachgelieferten
   mobilen Hochkant-Zuschnitt **desselben** Motivs ist der `alt` jetzt für beide Quellen korrekt.
2b. 🟠 **Hoch (NEU aus Phase 4, gehört zu Finding 1 — gleiche Ursache):** Mobil ist der Anschnitt
   **noch drastischer** als am Desktop, und das Bild wird zusätzlich **hochskaliert**. Gemessen:

   | Gerät | sichtbare Bildbreite | effektive Pixeldichte |
   |---|---|---|
   | iPhone SE (375, DPR 2) | 31 % | 0,75x |
   | iPhone 14 (390, DPR 3) | 33 % | **0,52x** |
   | Pixel 7 (412, DPR 2.6) | 35 % | 0,60x |
   | iPhone Pro Max (430, DPR 3) | 38 % | 0,53x |

   Dichte < 1,0 heißt: das Bild wird auf Retina-Phones ~2x **hoch**gerechnet und zeichnet weich.
   Für 1,0x bräuchte es ~3300 px Quellbreite (statt 1744) — als Mobile-Asset unvertretbar schwer.
   **Wichtig:** Ein Verkleinern der Datei wäre also **falsch**; die 373 KB sind nicht zu viel,
   sondern eher zu wenig. Der alte Shot war mit **0,45x** noch schlechter — es ist eine
   Verbesserung, aber keine Lösung. Ursache ist erneut die `h-[147%]`-Parallax-Ebene
   (Ebene 374x1510 = AR 0,25 gegen Bild-AR 0,75). → Optimierungsplan.
3. 🟢 **Niedrig (behoben):** Verwaistes `public/assets/hero-leipzig-carcare.webp` (221 KB) entfernt —
   `public/` wird 1:1 deployed, es wäre reiner Server-Ballast. Über Git wiederherstellbar.
4. 🟢 **Niedrig (Tooling, umgangen):** In-App-Preview-Capture weiterhin defekt (30-s-Timeout, auch
   `zoom`). Ersatzweg **Puppeteer** etabliert und funktioniert zuverlässig — Empfehlung, künftige
   visuelle Verifikationen direkt darüber zu fahren statt über den Pane.

**Hauptkomponenten (max. 3):** `components/HeroSection.tsx` (Bildquelle + Ebenen getauscht),
`index.css` (`.hero-copy-veil` → `.hero-radial-veil`), `public/assets/hero-leipzig-carcare-desktop.webp`.

**Fazit:** Neues Desktop-Motiv drin, Verlauf exakt nach Vorgabe (94/45/0, Zentrum Ecke oben links),
alte Schwarz-Ebenen restlos raus. Offen und bewusst dir überlassen: der harte Bildanschnitt am Desktop.
