# Preloader — Optimierungs-Tasks (Nachlauf)

**Erstellt:** 2026-07-24
**Referenz-Planung:** `docs/preloader/tasks/2026-07-24-preloader-double-stairs-tasks.md`

Diese Datei sammelt die Findings, die waehrend der Preloader-Umsetzung aufgefallen sind,
aber **nicht** von ihr verursacht wurden. Alle Findings aus der Preloader-Arbeit selbst
sind bereits in der Referenz-Planung dokumentiert **und dort inline gefixt**.

Sortiert nach Gewichtung.

---

### ✅ Opt-1 — Lenis-Klassen im vorgerenderten HTML (🟡 Mittel)
**Befund:** Der Prerender backt `class="lenis lenis-scrolling"` ins `<html>` aller 20
Snapshots. Entstanden, weil Lenis im Puppeteer-Lauf initialisiert und seine Klassen setzt,
bevor `page.content()` das DOM abfotografiert.

**Warum ueberhaupt anfassen:** Fachlich harmlos (die Lenis-CSS kommt erst mit dem Bundle,
danach verwaltet Lenis die Klassen selbst neu). Aber es ist Zustandsrauschen aus einem
Headless-Lauf im statischen Auslieferungs-HTML — und `lenis-scrolling` behauptet einen
Scroll-Zustand, den es beim Seitenaufruf gar nicht gibt.

* [x] Strip-Logik in `scripts/prerender.mjs` verallgemeinert: entfernt jetzt `cc-preloading`
      **und** alle `lenis*`-Klassen aus dem `<html>`-Tag
* [x] Rebuild: 20/20 Routen ok, `<html lang="de">` ohne Restklassen

**Referenzen:**
`scripts/prerender.mjs`

---

### ✅ Opt-2 — 568 kB Single-Bundle (🟡 Mittel)
**Befund:** `dist/assets/index-*.js` = 568,61 kB (163,92 kB gzip). Vite warnt beim Build
(„Some chunks are larger than 500 kB").

**Warum relevant fuer genau dieses Feature:** Der Preloader haelt so lange, bis React
gebootet hat. Alles, was das Parsen/Kompilieren des Bundles verkuerzt, verkuerzt direkt
die wahrgenommene Wartezeit — und schuetzt das LCP-Budget aus `SEO-GEO-STANDARDS.md` §2.2.

**Loesungswege abgewogen:**
| Ansatz | Bewertung |
| --- | --- |
| Route-level `React.lazy` + dynamische Imports | Groesster Effekt, aber greift tief in `App.tsx` ein und kollidiert mit dem Prerender (jede Route muesste ihren Chunk erst nachladen, bevor der Snapshot steht). **Zu riskant fuer einen Nachlauf-Task.** |
| **`manualChunks` fuer Vendor-Libs (gewaehlt)** | Rein additive Build-Konfiguration, kein App-Code betroffen. React und framer-motion landen in eigenen, ueber Deploys hinweg cachebaren Chunks; der Browser parst parallel statt seriell. |
| `chunkSizeWarningLimit` hochsetzen | Wuerde nur die Warnung stummschalten, nicht das Problem loesen. **Verworfen.** |

* [x] `build.rollupOptions.output.manualChunks` in `vite.config.ts` ergaenzt
* [x] **Zwischenbefund (gefixt):** Die Objektform `{ react: ['react','react-dom'] }` erzeugte
      nur einen 3,8-kB-Alibi-Chunk — `index.tsx` importiert `react-dom/client`, also einen
      anderen Einstiegspunkt als `react-dom`, und react-dom blieb im Hauptbundle. Auf die
      Funktionsform mit Pfad-Match umgestellt (erwischt das Paket unabhaengig vom Einstieg)
* [x] Rebuild + Prerender: 20/20 Routen weiterhin ok, Vite-Warnung ist weg
* [x] Preloader-Verifikation gegen den neuen Production-Build wiederholt — alle Checks gruen

**Ergebnis (gemessen):**

| | vorher | nachher |
| --- | --- | --- |
| `index-*.js` (App-Code) | 568,6 kB | **198,3 kB** |
| `react-*.js` (react, react-dom, scheduler) | — | 189,3 kB |
| `motion-*.js` (framer-motion, motion-dom, motion-utils) | — | 134,1 kB |
| `scroll-*.js` (lenis) | — | 19,1 kB |
| `icons-*.js` (lucide-react) | — | 13,8 kB |
| Vite-Warnung „> 500 kB" | ja | **nein** |

Der eigentliche Gewinn ist nicht die Gesamtgroesse (die bleibt praktisch gleich), sondern
dass die 356 kB Vendor-Code jetzt einen stabilen Hash haben: Ein Deploy, der nur App-Code
aendert, invalidiert beim Nutzer nur noch die 198 kB.

**Referenzen:**
`vite.config.ts`

---

### ⬜ Opt-3 — `og:image` zeigt auf Unsplash statt auf ein eigenes Motiv (🟢 Niedrig)
**Befund:** `index.html` setzt `og:image` und `twitter:image` auf eine
`images.unsplash.com`-URL. Fuer einen lokalen Meisterbetrieb ist das Social-Preview damit
ein fremdes Stockfoto — laeuft E-E-A-T (`SEO-GEO-STANDARDS.md` §4.2) und dem eigenen
Marken-Anspruch zuwider. Zusaetzlich ein Drittanbieter-Abruf beim Teilen.

**Bewusst NICHT im Rahmen dieses Nachlaufs erledigt:** Ein sauberes OG-Bild ist kein
Ein-Zeilen-Fix, sondern braucht ein eigens gebautes 1200×630-Motiv (die vorhandenen
Assets haben andere Seitenverhaeltnisse) und eine inhaltliche Entscheidung, welches
Motiv die Marke nach aussen vertreten soll. Das ist ein eigener, bewusst zu treffender
Content-Task — kein technisches Aufraeumen.

* [ ] Motiv festlegen (Vorschlag: Werkstatt-/Hero-Motiv mit Wortmarke, 1200×630)
* [ ] `scripts/` um einen OG-Bild-Build erweitern (sharp, analog `build-preloader-mark.mjs`)
* [ ] `og:image` / `twitter:image` in `index.html` und ggf. `components/SEOHead.tsx` umstellen
* [ ] Mit dem Facebook-/LinkedIn-Debugger validieren

**Referenzen:**
`index.html`
`components/SEOHead.tsx`
