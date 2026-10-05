# Ruckeln auf Vercel und Glas-Sprung der Hero-CTAs: Analyse und Plan

**Angelegt:** 2026-10-05
**Auftrag des Users:** (1) Nach dem Logo-Klick von einer Unterseite springen die Hero-CTAs „Schaden melden“ und
„Termin für Aufbereitung anfragen“ abrupt von durchsichtig auf milchiges Glas. (2) `carcare-center.vercel.app` hängt und
ruckelt, besonders beim ersten Besuch, lokal nicht. Erst analysieren, vor dem Umsetzen Fragen stellen.
**Status:** Analyse fertig. **Entscheidungen des Users (05.10.):** CTAs weich als Glas einblenden; Schritte 1–4 jetzt; Bilder und Videos 1 Tag frisch plus Aktualisierung im Hintergrund. Phasen 1–4 umgesetzt, 5–6 offen.

---

## Befund 1: Glas-Sprung der Hero-CTAs (Ursache bestätigt)

- Die CTAs tragen `.cc-glass-button` mit `backdrop-filter: blur(14px) saturate(150%)` (`index.css`).
- Ihr Vorfahr in `components/HeroSection.tsx` blendet beim Aufbau ein: `initial={{ opacity: 0, y: 24 }}`, 0,65 s.
- Chrome-Regel: Hat ein Vorfahr `opacity < 1`, wird er zur „Backdrop Root“. Der Weichzeichner sieht dann nur noch den
  Inhalt dieses Vorfahren, nicht das Foto dahinter. Während der ganzen Einblendung ist das Glas also aus (Foto scharf
  durch einen hellen Schleier), im letzten Bild bei Deckkraft 1 schaltet es schlagartig auf milchig.
- **Gemessen** (Headless-Chrome, Live-Seite): derselbe Zustand mit Vorfahren-Deckkraft 0,99 zeigt das Auto scharf durch
  die Buttons, mit 1 das milchige Glas.
- Warum nach dem Logo-Klick: Der Logo-Link wechselt innerhalb der App (`carcare:navigate`), die Startseite baut sich neu auf
  und die Einblendung läuft sichtbar. Beim ersten Besuch deckt der Preloader sie ab, lokal im Dev-Modus läuft er bei jedem
  Neuladen. Der Code ist lokal und live derselbe.
- **Gegenprobe der Lösung** (gemessen): Bewegt sich der Block nur (`transform`) und blenden die Buttons sich selbst ein, ist
  das Glas ab dem ersten Bild aktiv, der Übergang läuft stufenlos von unsichtbar bis milchig.

## Befund 2: Live-Seite langsamer als lokal

Lokal kommt alles von der Platte, Latenz praktisch null. Was live zählt, ist Datenmenge, Caching und die Reihenfolge beim
Aufbau. Gemessen am 05.10. gegen `carcare-center.vercel.app` (Puppeteer, 1440 × 900, `?preloader=0`).

| # | Befund | Messung | Wirkung |
|---|---|---|---|
| P1 | **Kein Caching** | Alle Dateien `Cache-Control: public, max-age=0, must-revalidate`, auch die gehashten JS/CSS-Bündel; `vercel.json` hat keine `headers` (schon 02.09. als A2 notiert) | Jede volle Seitenladung fragt jede Datei erneut an (Logo-Klick-Test: 12 Bilder je 1 Rückfrage, Über uns: 17). Lokal 0 ms, live je eine Netzrunde |
| P2 | **Logo-Video viel zu groß** | `carcare-center-mark-animated.mp4`: 720 × 720, 59,94 fps, mit Stereo-Tonspur, 1,6 MB; angezeigt ~48 px; auf der Startseite 5-mal (Navbar, Footer, 3 Zielgruppenkarten), auf jeder Seite mindestens 2-mal, alle `autoPlay` | 1,6 MB beim ersten Besuch, dazu 5 parallele 60-fps-Decoder für ein Logo: dauerhafte Last beim Scrollen |
| P3 | **Aufbau ohne Hydration** | Vorgerendertes HTML steht nach 18 ms, wird aber **nie angezeigt**: `createRoot` ersetzt es nach ~580 ms (Überschrift mit Deckkraft 0), erster Paint erst bei **1,3 s** (Netz gedrosselt auf 20 Mbit/s, 40 ms) | Der Vorteil des Prerenders kommt beim Besucher nicht an; erst Laden, dann alles neu bauen, dann einblenden |
| P4 | **Videos auf Über uns** | `carcare-ueber-uns-hero.mp4` (2,2 MB) und `carcare-betriebsrundgang.mp4` (3,5 MB) laden sofort (`autoPlay`, das `preload="metadata"` hebelt); Seite gesamt 6,2 MB auch mit warmem Cache | Bandbreite und Decoder beim Seitenstart, auch für das Video weit unten |
| P5 | **Bilder überdimensioniert** | Startseite: 22 Bilder ≈ 3,0 MB im ersten Blick; Kacheln 2000 px breit in Karten von wenigen hundert Pixeln; 60 Bilder ≈ 5,7 MB gesamt | Mehr Bytes und Dekodierarbeit als nötig |
| P6 | **Ein JS-Bündel für alle 29 Routen** | `index` 437 KB + React 194 KB + Motion 137 KB (roh), 233 KB komprimiert | Jede Einstiegsseite lädt und parst alles |

Ausgeschlossen: `react-grab` läuft nur im Dev-Modus (`import.meta.env.DEV`), nicht live.

---

### ✅ Phase 1 — CTA-Glas ohne Sprung
* [x] `HeroSection.tsx`: Block bewegt sich nur (`y`), Slogan, H1, Text und beide CTAs blenden sich jeweils selbst ein (`EINBLENDEN`, gleiche 0,65 s). Kein Wrapper um die Texte: Die Zentrierung ab `md` hängt an den einzelnen Elementen.
* [x] Glas-Prüfung aller Glas-Elemente (Skript: jedes Element mit `backdrop-filter` im Bild, dessen Vorfahr gerade Deckkraft < 1 hat; 7 Seiten × Desktop/mobil, beim Laden und Scrollen). Live gefunden und behoben:
  * mobile Aktionsleiste (alle Seiten): Container gleitet nur noch, die vier Glasknöpfe blenden sich selbst ein (`MobileStickyCTA.tsx`).
  * Plaketten im Seitenkopf jeder Unterseite (`PageHero`), im Expertise-Abschnitt der Startseite und an der offenen Akkordeon-Karte: neue Option `sichtbar` an `BereichsPlakette` (Deckkraft am Glas selbst, inline, weil `.cc-liquid` eine eigene `transition`-Liste setzt); der Aufrufer setzt sie erst nach `onAnimationComplete` seines Blocks.
  * Textkarte im gepinnten Ablauf (`ScrollPinnedProcess.tsx`): Weichzeichner hinter 92 % Weiß entfernt (unsichtbar, aber Rechenlast und Sprung beim Überblenden).
**Referenzen:**
`components/HeroSection.tsx`
`index.css`

### ✅ Phase 2 — Logo-Video neu kodieren
* [x] `ffmpeg -i original.mp4 -vf "scale=160:160:flags=lanczos,fps=30" -an -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 23 -preset veryslow -movflags +faststart neu.mp4` (ffmpeg aus `ffmpeg-static`).
* [x] **1.662.071 → 33.140 Byte** (−98 %), 160 × 160, 30 fps, ohne Ton, gleicher Dateiname. Standbild bei 3 s auf 144 px (3× Anzeige) neben dem Original: nicht zu unterscheiden. Original und Vergleich in `output/logo-video/` (lokal, nicht versioniert; das Original steht auch im Git-Verlauf).
**Referenzen:**
`public/assets/carcare-center-mark-animated.mp4`

### ✅ Phase 3 — Caching auf Vercel
* [x] Regeln im Generator `scripts/generate-vercel-config.mjs` (sonst überschreibt `npm run vercel-config` sie), `vercel.json` neu erzeugt: `/assets/(.*).(js|css)` → `public, max-age=31536000, immutable`; `/assets/(.*).(webp|png|jpg|jpeg|svg|avif|gif|ico|mp4|webm|woff2)` → `public, max-age=86400, stale-while-revalidate=604800`. HTML bleibt beim Vercel-Standard.
* [x] `check-vercel-config` vergleicht nur Rewrites: weiter grün, nichts mitzuziehen.
* [ ] Nach dem Deploy prüfen: `curl -sI https://carcare-center.vercel.app/assets/<datei>` zeigt die neuen Werte (lokal nicht prüfbar, `vite preview` liest `vercel.json` nicht).
**Referenzen:**
`vercel.json`

### ✅ Phase 4 — Videos erst laden, wenn sie sichtbar werden
* [x] `BetriebsVideo.tsx`: `src` erst, wenn der Rahmen 300 px vor den Sichtbereich kommt (IntersectionObserver), bis dahin `preload="none"` und das Standbild. Titelvideos oben starten wie bisher sofort.
**Referenzen:**
`components/BetriebsVideo.tsx`

### ⬜ Phase 5 — Hydration statt Neuaufbau (größerer Eingriff, eigener Schritt)
* [ ] `hydrateRoot` statt `createRoot` prüfen; Knackpunkt: Framer-Startzustände (Prerender hält Endzustand fest).

### ⬜ Phase 6 — Bilder in passenden Größen, Code-Splitting (später)
* [ ] `srcset` mit mehreren Breiten über `npm run fotos`/`images`; Routen per `React.lazy`.

---

### ✅ Gegenprobe (lokaler Build vom 05.10.2026, 17:05; Build grün, 29/29, 0 Gedankenstriche)
* [x] Hero-CTAs nach dem Logo-Klick: kleinste Vorfahren-Deckkraft durchgehend **1,00** (vorher 0,01 → 0,94 → 1). Das Glas ist ab dem ersten Bild aktiv.
* [x] Glas-Prüfung, nur sichtbare Glas-Elemente (eigene Deckkraft > 0), `/`, `/fahrzeugaufbereitung-leipzig`, `/autolackierung-leipzig`, `/leasingrueckgabe-leipzig`, Desktop und mobil: **keine Funde** (live vorher: Hero-CTAs, mobile Leiste auf allen Seiten, Plaketten im Seitenkopf, im Expertise-Abschnitt und im Akkordeon, Ablauf-Textkarte).
* [x] Netz, erster Besuch Startseite: **3,3 MB statt 4,9 MB**, Logo-Video 33 KB statt 1,6 MB. `/ueber-uns`: Video **2,2 MB statt 5,6 MB** (der Betriebsrundgang wartet).
* [x] Funktion: Betriebsrundgang hat beim Start keine Quelle, lädt und läuft nach dem Hinscrollen (3,5 s gemessen). Mobile Leiste: oben 4 × Deckkraft 1, am Seitenende 4 × 0 und 120 px nach unten, zurück oben wieder sichtbar.

---

## Kommentare

### Phasen 1–4
**Eingehalten:** erst gemessen, dann geändert ✅, Ursache bewiesen statt vermutet (Deckkraft 0,99 gegen 1) ✅, Lösung vorab getestet ✅, Auswahl des Users umgesetzt ✅, keine sichtbare Gestaltungsänderung außer dem fehlenden Sprung ✅, Encoding geprüft ✅, unter 700 Zeilen ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (offen, Phase 5):** Das vorgerenderte HTML wird nie angezeigt (`createRoot` ersetzt es). Bleibt der größte Unterschied zwischen lokal und live beim ersten Aufruf.
2. 🟡 **Mittel (offen, Phase 6):** Bilder bleiben mit rund 3 MB im ersten Blick der größte Posten (Kacheln 2000 px in kleinen Karten).
3. 🟡 **Mittel (offen):** Das Titelvideo von Über uns (`carcare-ueber-uns-hero.mp4`, 2,2 MB) lädt beim Start, weil es oben steht. Kandidat für eine kleinere Fassung.
4. 🟢 **Niedrig (Regel):** Kein `backdrop-filter`-Element unter einen ein- oder ausblendenden Vorfahren legen (Chrome „Backdrop Root“). Für Plaketten gibt es `sichtbar` an `BereichsPlakette`. Die Prüfskripte liegen im Scratchpad dieser Sitzung; bei Bedarf als `npm`-Werkzeug ins Repo holen.

