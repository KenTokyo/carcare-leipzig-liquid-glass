# Preloader „Double Stairs" — Masterplanung

**Erstellt:** 2026-07-24
**Ziel:** Markenauftritt beim ersten Seitenaufruf — Logo-Siegel + Wortmarke gross und
zentriert, danach faehrt ein zweigeteiltes Treppen-Overlay gegenlaeufig auf und gibt
die Seite frei.

---

## Ausgangslage & Entscheidung

Vorlage war **Skiper UI „skiper10 — Double stairs preloader"**
(`pnpm dlx shadcn add @skiper-ui/skiper10`).

**Befund:** Die Komponente ist **Pro-gated**. Belege:

| Prüfung | Ergebnis |
| --- | --- |
| `GET https://skiper-ui.com/r/skiper10.json` | HTTP **401** |
| Gegenprobe skiper8 / 9 / 11 / 15 | ebenfalls HTTP 401 |
| Komponentenseite | „INSTALL VIA PRO CLI [REQUIRES A PRO LICENSE KEY]" |
| Live-Demo-DOM | gesperrt („Pro Login Required") |

Der Originalquelltext lag also **nicht** vor. Nutzerentscheidung (2026-07-24):
**Eigenbau in Framer Motion** — `framer-motion@^12.29.2` ist bereits Dependency und
laut Skiper-Doku die einzige Abhaengigkeit der Komponente. Damit kein Lizenzschluessel,
keine Attributionspflicht, volle Kontrolle ueber Timing / Prerender / Lenis.

**Weitere Nutzerentscheidungen:**
* Trigger: **1× pro Session, nur Startseite `/`**
* Logo: **statisches Siegel + weisse Wortmarke** (kein 1,66-MB-MP4)

### Loesungswege abgewogen (vor der Implementierung)

| Ansatz | Bewertung |
| --- | --- |
| A — reiner React-Preloader in `App.tsx` | Einfach, aber: Overlay erscheint erst **nach** React-Mount. Zwischen dem Flash-Guard (`prerender.mjs:123` leert `#root` synchron) und dem Mount blitzt Weiss auf → genau der Fehler, den ein Preloader verhindern soll. **Verworfen.** |
| B — Preloader komplett statisch in `index.html`, CSS-Keyframes | Kein Flash, aber die Animationsqualitaet von Framer Motion (Stagger, Custom-Easing, `AnimatePresence`) ist in reinem CSS nicht sauber nachzubauen; zweite Animations-Sprache im Projekt. **Verworfen.** |
| **C — Hybrid (gewaehlt)** | Winziger **statischer Boot-Layer** in `index.html` zeigt Carbon-Flaeche + Logo ab dem ersten Frame; die **React/Framer-Komponente** uebernimmt pixelidentisch und spielt die Treppen-Animation. Kein Flash, eine Animations-Sprache, Boot-Layer ist ~20 Zeilen. |
| D — Vanilla-Preloader, React entfernt ihn nur | Wie B, zusaetzlich State-Duplikat. **Verworfen.** |

---

## Projektspezifische Zwangsbedingungen (recherchiert, nicht angenommen)

1. **LCP-Budget** — `SEO-GEO-STANDARDS.md` §2.2 fordert LCP < 2,5 s. Das naive
   Skiper-Snippet (2500 ms Timer + ~1 s Exit) sprengt das. Gegenmassnahmen:
   Session-Gate (nur `/`, nur 1×) + Gesamtdauer ≈ 1,9 s statt 3,5 s.
2. **Prerender/SSG** — `scripts/prerender.mjs` rendert alle 17 Routen per Puppeteer
   zu statischem HTML. Ein Overlay wuerde in jeden Snapshot eingebacken und das
   `autoScroll()` fuer `whileInView`-Reveals hinter einer Blende laufen lassen.
   → Preloader muss im Prerender **hart aus** sein.
3. **Lenis** — `hooks/useSmoothScroll.ts` startet Lenis global. Ohne `stop()` scrollt
   der Nutzer hinter dem Overlay. Effekt-Reihenfolge beachten: Der Lock muss in
   `App.tsx` **nach** `useSmoothScroll()` deklariert werden, sonst ist `getLenis()`
   noch `null` (Child-Effects laufen vor Parent-Effects).
4. **Client-Routing** — `App.tsx:41` navigiert per `carcare:navigate`-Event **ohne
   Remount**. Der Preloader darf nur beim echten ersten Laden zuenden.
5. **Asset-Falle** — `carcare-center-mark-animated.mp4` = **1,66 MB**, kein Alphakanal.
   Im Preloader wuerde es den First Paint blockieren. → statisches Siegel.
6. **Asset-Geometrie** (per sharp vermessen, nicht geschaetzt):
   `carcare-center-logo.webp` 842×596, **opak weisser** Hintergrund, enthaelt
   Siegel **und** Wortmarke:
   * Siegel: `x 32..300` (269 px), `y 165..436` (272 px), ratio 0.989
   * Wortmarke: `x 317..806` (490 px), `y 223..384` (162 px), ratio 3.025
   * `carcare-center-wordmark-weiss.png` 2118×687, **echter Alphakanal**, ratio 3.083

---

## Timing-Konzept

| Zeitpunkt (ab Navigationsstart) | Vorgang |
| --- | --- |
| ~0 ms | Boot-Layer sichtbar: Carbon-Flaeche + Logo (statisch, kein JS noetig) |
| React-Mount | Framer-Overlay uebernimmt **pixelidentisch** — kein Nachfaden |
| bis 700 ms | Halten (dynamisch: `max(250, 700 − elapsed)`, damit langsame Verbindungen nicht doppelt warten) |
| 700–1080 ms | Logo faded aus (`opacity 1→0`, `y 0→−14`, 380 ms) |
| 820 ms | Treppen starten |
| 820–1885 ms | 6 Spalten, Stagger 65 ms, Dauer 720 ms, `cubic-bezier(0.83, 0, 0.17, 1)` |
| ~1885 ms | Lenis entsperrt, Overlay entfernt, `sessionStorage`-Flag gesetzt |

**„Double":** Obere Haelfte faehrt nach oben (`y −101%`), untere nach unten (`y +101%`).
Die Stagger-Richtung ist **gespiegelt** (oben `i`, unten `N−1−i`) → zwei gegenlaeufige
Treppen statt eines simplen Reissverschlusses.

---

## Phasen

### ✅ Phase 1 — Asset: Siegel freistellen
**Ziel:** Ein eigenes, leichtes Siegel-Asset statt des 73-KB-Kombi-Logos.
* [x] `scripts/build-preloader-mark.mjs` erzeugt (57 Zeilen), sharp-Crop nach vermessener BBox + 10 px Luft
* [x] `public/assets/carcare-center-mark.webp` erzeugt — 288×288, Crop `left=20 top=155 292×292`
* [x] Groesse geprueft: **73,0 KB → 7,6 KB** (−90 %)
* [x] `flatten({background:'#ffffff'})` gegen das „dirty alpha" des Quell-WebP (Ecken teils `255,255,255,128`) — ohne das entsteht beim Re-Encode ein fleckiger Rand

**Referenzen:**
`scripts/build-preloader-mark.mjs`
`public/assets/carcare-center-mark.webp`

---

### ✅ Phase 2 — Boot-Layer in `index.html` (Anti-Flash + Session-Gate)
**Ziel:** Marke ab dem ersten Frame sichtbar, ohne auf React zu warten.
* [x] Inline-`<style>`: `#cc-boot` default `display:none`, nur bei `html.cc-preloading` sichtbar
* [x] Bilder als **CSS-`background-image`** statt `<img>` — bei `display:none` laedt der Browser Hintergrundbilder nicht, `<img>` dagegen schon (spart ~39 KB Blindlast auf allen Seiten ohne Preloader)
* [x] Inline-`<script>` im `<head>` als **einzige** Wahrheitsquelle der Bedingungen
* [x] Zusaetzliche Bedingung waehrend der Umsetzung ergaenzt: **kein Hash im URL**. Auf `/#kontakt-schaden` haette der Anker-Scroll aus `App.tsx:50` gegen das `overflow:hidden` gearbeitet und der Nutzer waere oben gelandet
* [x] `html.cc-preloading body { overflow:hidden }` als Scroll-Lock der ersten Millisekunden
* [x] `#cc-boot`-Markup vor `#root`, `aria-hidden="true"`
* [x] `.cc-lockup*`-Klassen so gebaut, dass `Preloader.tsx` sie wiederverwendet → Geometrie nur EINMAL definiert

**Referenzen:**
`index.html`

---

### ✅ Phase 3 — `components/Preloader.tsx` (Double Stairs)
**Ziel:** Die eigentliche Animation in Framer Motion.
* [x] `components/Preloader.tsx` erzeugt (**160 Zeilen**, Limit 700 eingehalten)
* [x] Overlay `fixed inset-0 z-[9999]` — hoechster bestehender z-Wert im Projekt ist 50, kein Konflikt
* [x] Zwei Haelften à 6 Spalten, `exit`-Varianten mit `custom={step}` fuer den Stagger
* [x] Stagger **gespiegelt** (oben `i`, unten `N−1−i`) → zwei gegenlaeufige Treppen statt Reissverschluss
* [x] 1 px Spaltenueberlappung (`marginRight:-1`) + `overflow-hidden` gegen Subpixel-Fugen bei krummen Viewport-Breiten
* [x] Logo-Lockup zentriert, Siegel im weissen Rounded-Badge + weisse Wortmarke (Footer-Muster)
* [x] `useLayoutEffect` entfernt `#cc-boot` — nach DOM-Update, vor Paint
* [x] **Kein** Entry-Animation auf dem Logo: Der Boot-Layer zeigt es bereits, ein Einfaden waere ein sichtbarer Bruch
* [x] Timing-Konstanten dokumentiert, `PRELOADER_EXIT_MS` exportiert
* [x] `aria-hidden="true"` — Inhalt darunter bleibt fuer Screenreader sofort lesbar

**Referenzen:**
`components/Preloader.tsx`

---

### ✅ Phase 4 — `hooks/usePreloader.ts` + `App.tsx`-Integration
**Ziel:** Entscheidungslogik, Lenis-Lock, Session-Flag an einer Stelle.
* [x] `hooks/usePreloader.ts` erzeugt (102 Zeilen)
* [x] Hook wertet die Bedingungen **nicht erneut** aus, sondern liest das Ergebnis des Inline-Scripts (`html.cc-preloading`) — keine zweite Wahrheitsquelle
* [x] Lenis-Lock: `getLenis()?.stop()` / `.start()`, Hook-Aufruf in `App.tsx` **nach** `useSmoothScroll()` — sonst waere `getLenis()` beim Mount noch `null`
* [x] `AnimatePresence onExitComplete` → Flag, Klasse entfernen, `scrollTo(0,0)`, Lenis starten
* [x] Freigabe per `releasedRef` idempotent (React-StrictMode ruft Effects doppelt auf)
* [x] Sicherheits-Timeout `PRELOADER_EXIT_MS + 4000`, falls `onExitComplete` nie feuert
* [x] Overlay ausserhalb von `<Layout>` gerendert — sonst faellt es in den Stacking-Context von `.site-main-shell` (`overflow-clip`) und wuerde beschnitten

**Referenzen:**
`hooks/usePreloader.ts`
`App.tsx`

---

### ✅ Phase 5 — Prerender-Guard
**Ziel:** Kein Overlay in den statischen HTML-Snapshots.
* [x] `page.evaluateOnNewDocument()` setzt `window.__CC_NO_PRELOADER__ = true` vor allen Seitenskripten
* [x] Defensiv zusaetzlich: `cc-preloading` wird aus dem `<html>`-Tag des Outputs gestrippt
* [x] Kommentar im Skript, warum beides noetig ist

**Referenzen:**
`scripts/prerender.mjs`

---

### ✅ Phase 6 — Verifikation
**Ziel:** Belegen statt behaupten.
* [x] `scripts/verify-preloader.mjs` erzeugt (221 Zeilen) — laeuft gegen Dev **und** Production-Build
* [x] `npm run typecheck` sauber
* [x] `npm run build` + Prerender: **20/20 Routen** ok
* [x] Snapshot-Pruefung: `cc-preloading` **0×**, `data-preloader` **0×**, `#cc-boot` **20×**, Gate-Script **20×**
* [x] Frames belegt: Overlay ab ~0,5 s, Treppen ab ~1,0 s, ab ~2,1 s weg
* [x] Session-Gate belegt: 2. Aufruf `/` ohne Preloader
* [x] Unterseite `/leistungen` ohne Preloader belegt
* [x] Deep-Link `/#kontakt-schaden` ohne Preloader belegt
* [x] Scroll nach Exit belegt: `scrollY = 600` nach `scrollTo(0,600)` → Lenis entsperrt
* [x] Mobile 390 px: Lockup 256 px = 66 % der Breite, 67 px Rand
* [x] **Anti-Flash-Grenzfall** belegt: JS-Bundle geblockt → `#cc-boot` deckt den Viewport (`display:flex`, `rgb(8,11,16)`, Bildmitte = Boot) und rendert pixelidentisch zur React-Version
* [x] Console: keine Fehler

**Referenzen:**
`scripts/verify-preloader.mjs`
`output/preloader-verify/` (Frames + `report.json`)

---

### ✅ Phase 7 — Nachtrag: Session-Gate nur in Produktion
**Ziel:** Den Preloader beim Entwickeln und Vorfuehren wieder sichtbar machen.

**Ausloeser:** Rueckmeldung „Ich sehe keinen Preloader." Diagnose im betroffenen Tab:
`sessionStorage['cc-preloader-v1'] === '1'`. Das Gate arbeitete also **korrekt** — aber
der Entwurf war schlecht: Ein Feature, das nach dem ersten Reload nie wieder erscheint,
laesst sich weder review'n noch weiterentwickeln. Der Fehler lag bei mir, nicht im Code.

* [x] Vite-Plugin `cc-preloader-dev-flag` in `vite.config.ts` (`apply: 'serve'`) setzt
      `window.__CC_DEV__ = true` — **nur** im Dev-Server, nie im Build-Output (belegt: 0 Treffer in `dist/`)
* [x] Inline-Gate prueft `!window.__CC_DEV__ && sessionStorage…` → lokal laeuft der Preloader bei JEDEM Reload
* [x] Schalter `?preloader=1` erzwingt ihn (auch auf Unterseiten, auch in Produktion — fuer Vorfuehrungen)
* [x] Schalter `?preloader=0` schaltet ihn ab
* [x] `scripts/verify-preloader.mjs` modus-bewusst gemacht: erwartet in DEV den Preloader beim
      2. Aufruf, in PRODUKTION dessen Ausbleiben — statt einer Erwartung, die nur in einem Modus stimmt

**Warum kein `location.hostname === 'localhost'`-Test:** Der wuerde `vite preview` **und**
`scripts/prerender.mjs` (beide auf localhost) als „Entwicklung" einstufen. Damit waere das
echte Produktionsverhalten nirgends mehr verifizierbar — genau die Faehigkeit, die den
kritischen Snapshot-Bug in Phase 6 ueberhaupt sichtbar gemacht hat.

**Verifiziert (beide Modi):**

| Aufruf | Dev (3007) | Produktion (`vite preview`) |
| --- | --- | --- |
| 2. Aufruf `/` in derselben Session | Preloader **ja** ✅ | Preloader **nein** ✅ |
| `/leistungen` | nein ✅ | nein ✅ |
| `/#kontakt-schaden` | nein ✅ | nein ✅ |
| `/leistungen?preloader=1` | ja ✅ | ja ✅ |
| `/?preloader=0` | nein ✅ | nein ✅ |

**Referenzen:**
`vite.config.ts`
`index.html`
`scripts/verify-preloader.mjs`

---

### ✅ Phase 8 — Farbwechsel: weisser Grund, dunkle Wortmarke
**Ziel:** Nutzerwunsch — Preloader in Weiss statt Carbon, Wortbildmarke dunkel.
Passt zugleich besser zur „Light-Mode-fokussiert"-Linie aus `DESIGN.md` §1.

* [x] `#cc-boot`-Hintergrund `#080b10` → `#ffffff`
* [x] Treppen-Spalten `bg-[#080b10]` → `bg-[#ffffff]`
* [x] Wortmarke: weiss → dunkel. **Nicht** die rohe `carcare-center-wordmark.png`
      (3711×1205, 84,4 KB) eingebunden — sie liegt auf dem kritischen Pfad und wird
      maximal 420 px breit dargestellt. Stattdessen ein optimiertes Asset gebaut:
      `carcare-center-wordmark-dark.webp`, 840×273, **26,2 KB** (−69 %)
* [x] WebP **lossless**, nicht lossy: harte Kanten + Alphakanal — dieselbe Ueberlegung,
      aus der `components/Footer.tsx` die weisse Wortmarke bewusst als PNG behaelt
* [x] `aspect-ratio` von 3.083 auf **3.077** korrigiert (840/273 des neuen Assets)
* [x] Weisses Badge um das Siegel entfernt — auf weissem Grund gegenstandslos
* [x] Skript `build-preloader-mark.mjs` → `build-preloader-assets.mjs` umbenannt,
      baut jetzt beide Assets und prueft sich selbst

**Referenzen:**
`scripts/build-preloader-assets.mjs`
`index.html`
`components/Preloader.tsx`

---

### ✅ Phase 9 — Hero-Foto im Preloader, Machart der Leistungsuebersicht
**Ziel:** Nutzerwunsch — das Hero-Bild in den Preloader, „in der Art und Weise wie im
Hintergrund der Leistungsuebersicht".

**Vorlage analysiert statt geraten:** `components/ServiceGrid.tsx` legt drei Weiss-Ebenen
ueber das Foto — vertikaler Veil, horizontaler Header-Schutz und eine `closest-side`-
Radiale, mit der das Foto randlos ins Weiss auslaeuft. Dort steht ausdruecklich die
Lehre: **transparentes WEISS** (`rgb(255 255 255 / 0)`), nie `transparent`, sonst
entsteht ein grauer Saum.

* [x] Ebenen-Stack als gemeinsame Klasse `.cc-photo-veil` in `index.html`
* [x] **Angepasst statt kopiert:** Der horizontale Header-Schutz der Leistungsuebersicht
      schuetzt die Ueberschrift *links*. Im Preloader steht die Marke *mittig* — also
      liegt der Schutz hier als elliptische Weiss-Insel mittig, in der Form der Lockup.
      Ein 1:1-Uebernehmen haette die Marke auf dem unbehandelten Foto stehen lassen.
* [x] Art Direction identisch zum Hero (`components/HeroSection.tsx`): dieselben Dateien,
      derselbe Breakpoint 767px
* [x] `.cc-photo-veil` wird von Boot-Layer **und** Treppen-Spalten benutzt → Behandlung
      nur einmal definiert, Uebergang pixelgleich
* [x] Foto-Ebene je Spalte in voller Overlay-Groesse mit negativem Offset → ueber alle
      sechs Spalten hinweg EIN durchgehendes Bild; `overflow-hidden` schneidet zu
* [x] Masse in Prozent statt `vw`/`vh` — auf Mobile ist `vh` die GROSSE Viewport-Hoehe,
      das `inset-0`-Overlay hat aber die aktuelle
* [x] Belegt: **1** Netzwerkanfrage fuer das Hero-Bild. Der Preloader laedt es nicht
      zusaetzlich, sondern waermt es fuer die Sektion darunter vor

**Referenzen:**
`index.html`
`components/Preloader.tsx`
`scripts/build-preloader-assets.mjs`

---

## Kommentare

### Phase 1
**Eingehalten:** Asset-Geometrie gemessen statt geschaetzt ✅, Dateigroesse −90 % ✅, Skript reproduzierbar + kommentiert ✅
**Auffaelligkeiten:** keine.

### Phase 2
**Eingehalten:** Mobile-First (clamp-Groessen) ✅, eine Wahrheitsquelle fuer die Bedingungen ✅, kein Blind-Fetch ✅
**Auffaelligkeiten/Findings:**
1. 🟠 **Hoch (gefunden & GEFIXT):** Deep-Links mit Hash (`/#kontakt-schaden`) waeren gebrochen — der Anker-Scroll in `App.tsx:50` haette gegen `overflow:hidden` gearbeitet, der Nutzer waere stumm oben gelandet. Bedingung `if (location.hash) return;` ergaenzt und per Test belegt.
2. 🟡 **Mittel (vermieden):** `<img>` im Boot-Layer haette trotz `display:none` geladen (~39 KB auf JEDER Seite ohne Preloader). Auf CSS-`background-image` umgestellt.

### Phase 3
**Eingehalten:** 160 Zeilen < 700 ✅, Framer statt zweiter Animations-Sprache ✅, a11y bedacht ✅, keine `prefers-reduced-motion`-Gates (Projektentscheidung) ✅
**Auffaelligkeiten/Findings:**
1. 🟡 **Mittel (vermieden):** 6 nebeneinanderliegende Spalten erzeugen bei krummen Viewport-Breiten Subpixel-Fugen, durch die im Ruhezustand die Seite durchblitzt. Mit 1 px Ueberlappung + `overflow-hidden` geloest.

### Phase 4
**Eingehalten:** Effekt-Reihenfolge explizit begruendet ✅, idempotente Freigabe ✅, Sicherheitsnetz ✅
**Auffaelligkeiten:** keine offen.

### Phase 5
**Eingehalten:** Guard vor allen Seitenskripten ✅, zusaetzliche Absicherung im HTML-Output ✅
**Auffaelligkeiten:** keine.

### Phase 6
**Eingehalten:** gegen Dev UND Production-Build verifiziert ✅, Screenshots per Puppeteer (Preview-Pane ist „hidden", dort feuert kein rAF) ✅, Grenzfall statt Schoenwetter-Test ✅
**Auffaelligkeiten/Findings:**
1. 🔴 **Kritisch (gefunden & GEFIXT):** `#cc-boot` fehlte in **allen 20 Snapshots**. Ursache: `usePreloader` raeumte den Boot-Layer im Nicht-Preloader-Fall weg, und der Prerender fotografiert das DOM per `page.content()` genau danach. In Produktion waere damit der Anti-Flash-Layer verschwunden — das Inline-Script haette `overflow:hidden` gesetzt, ohne dass es etwas zu sehen gab: Content-Flash statt Preloader. Behoben, indem `#cc-boot` **ausschliesslich** von `Preloader.tsx` entfernt wird (also erst, wenn das Overlay ihn ersetzt hat). Per Rebuild belegt: 20/20 Snapshots enthalten den Boot-Layer.
2. 🟡 **Mittel (gefunden & GEFIXT, betraf nur das Pruefskript):** `evaluateOnNewDocument(() => sessionStorage.clear())` lief bei **jeder** Navigation und machte damit ausgerechnet den Session-Gate-Test wirkungslos (der 2. Aufruf sah wieder eine frische Session). Entfernt — ein neuer Tab hat ohnehin leeren `sessionStorage`.
3. 🟡 **Mittel (gefunden & GEFIXT, betraf nur das Pruefskript):** Der erste Frame traf den Vite-Kaltstart und meldete falsche Zustaende. Warmup-Load ergaenzt + reale Seitenzeit wird jetzt mitprotokolliert, statt sie still zu verfaelschen.
4. 🟡 **Mittel (Messmethode korrigiert):** Die Luecke vor dem React-Mount laesst sich **nicht** per CPU-Drosselung treffen — `goto` kehrt erst bei DOMContentLoaded zurueck, die erste moegliche Probe lag bei Rate 20 schon bei ~7,9 s. Ersetzt durch den Grenzfall „JS-Bundle geblockt", der die Garantie direkt beweist.

### Phase 7
**Eingehalten:** Ursache diagnostiziert statt geraten (Flag im betroffenen Tab ausgelesen) ✅, Dev/Prod sauber getrennt ✅, beide Modi verifiziert ✅
**Auffaelligkeiten/Findings:**
1. 🟠 **Hoch (Entwurfsfehler, GEFIXT):** Das Session-Gate galt auch lokal. Folge: Der Preloader war nach dem ersten Reload unsichtbar — nicht kaputt, aber unbrauchbar fuer Review und Weiterentwicklung. **Lehre:** Ein Gate, das ein Feature versteckt, braucht von Anfang an einen Dev-Ausweg; sonst ist das erste Feedback zwangslaeufig „ich sehe nichts".
2. 🟡 **Mittel (Testluecke, GEFIXT):** Der Session-Gate-Test hatte eine feste Erwartung und haette nach der Umstellung im Dev-Modus fehlgeschlagen, ohne dass ein echter Fehler vorlag. Jetzt prueft er `window.__CC_DEV__` und erwartet je Modus das Richtige.

### Phase 8
**Eingehalten:** Asset-Farbe gemessen statt angenommen ✅, Selbstpruefung im Build-Skript ✅, Mobile erneut belegt ✅, Dev + Produktion erneut verifiziert ✅
**Auffaelligkeiten/Findings:**
1. 🟠 **Hoch (gefunden & GEFIXT):** Nach dem Wechsel auf Weiss zeichnete sich das Siegel als schwach getoenter Kasten ab. Ursache: Der Grund des Quell-Logos ist **kein** reines Weiss, sondern ein warmes Off-White — gemessen `255,253,252`. Auf dem Carbon-Grund war das unsichtbar (weisses Badge davor), auf `#ffffff` nicht mehr. Behoben per Weisspunkt-Korrektur im Build (`linear()` zieht genau diese Farbe auf `255,255,255`, der weiche Schlagschatten bleibt als Verlauf erhalten, weil skaliert statt geschwellwertet wird). **Lehre:** „Weiss" aus einer Bilddatei ist nie automatisch `#ffffff` — bei randlosen Assets auf farbigem Grund immer nachmessen.
2. 🟡 **Mittel (vermieden):** Die rohe dunkle Wortmarke haette 84,4 KB auf den kritischen Pfad gelegt, fuer eine Darstellung von maximal 420 px Breite. Auf 840 px / 26,2 KB optimiert.
3. 🟡 **Mittel (vermieden):** In den Treppen bewusst `bg-[#ffffff]` statt `bg-white` gesetzt. `bg-white` loest zwar auf dieselbe Farbe auf, haengt aber an `--cc-white-rgb` aus `index.css` — die kommt erst mit dem JS-Bundle. Faellt die Variable je aus, waeren die Treppen transparent statt weiss. Diese Abhaengigkeit hat der erste Paint nicht noetig, und die Farbgleichheit mit dem Boot-Layer ist hier eine harte Anforderung.
4. 🟢 **Niedrig (geprueft, kein Befund):** `carcare-center-wordmark-weiss.png` taucht weiterhin im Snapshot auf — das ist der Footer (`components/Footer.tsx`), nicht der Preloader. Beide alten Wortmarken-Dateien bleiben in Gebrauch (Footer weiss, Navbar dunkel) und wurden bewusst nicht angetastet.

### Phase 9
**Eingehalten:** Vorlage im Code gelesen statt nachempfunden ✅, Behandlung nur einmal definiert ✅, Kachelung exakt ✅, Netzwerk gezaehlt statt behauptet ✅
**Auffaelligkeiten/Findings:**
1. 🔴 **Kritisch (Regression durch diese Phase, GEFIXT):** Mit dem Foto im Hintergrund zeigte das Siegel wieder seinen weissen Kasten. Auf reinem Weiss war er unsichtbar, auf dem Foto nicht. Ursache war die Entscheidung aus Phase 8, den weissen Grund im Asset zu belassen — sie galt nur, solange der Untergrund garantiert `#ffffff` ist. **Behoben durch echte Freistellung:** Die Kugel wurde als exakter Kreis vermessen (Bounding-Box 265×265 bei Luminanzschwelle 200 — also quadratisch, Mittelpunkt (144,143), Radius 132,5) und per SVG-Kreismaske freigestellt. Bewusst NICHT per Alpha-Threshold auf Weiss: Das haette den weichen Schlagschatten als grauen Halo stehen lassen. Der Schatten faellt jetzt weg — gewollt, auf dem Foto haette er ohnehin falsch gewirkt. Selbstpruefung im Build: Ecken-Alpha 0, Mitte 255.
2. 🟠 **Hoch (Werkzeug-Falle, GEFIXT):** `sharp` fuehrt Operationen in fester **interner** Reihenfolge aus, nicht in Aufrufreihenfolge. `trim()` gehoert zur Resize-Phase und lief damit VOR `composite()` — Abbruch mit „Image to composite must have same dimensions or smaller". Maskieren und Zuschneiden sind jetzt zwei getrennte sharp-Durchlaeufe.
3. 🟠 **Hoch (Werkzeug-Falle, GEFIXT):** sharp leitet die Groesse eines SVG aus Density/Viewport ab, auch bei gesetztem `width`/`height`. Die Maske war dadurch nicht exakt 288 px. Sie wird jetzt explizit auf die Zielgroesse gerastert.
4. 🟡 **Mittel (Entscheidung revidiert):** Die 1-px-Spaltenueberlappung aus Phase 3 (gegen theoretische Subpixel-Fugen) musste weichen — sie haette den Bildversatz je Spalte aufaddiert und bei sechs Spalten einen sichtbaren Sprung im Foto erzeugt. Exakte Kachelung wiegt schwerer; im Screenshot sind keine Fugen erkennbar.
5. 🟢 **Niedrig (offen, Geschmacksfrage):** Die Staerke des Weiss-Auftrags ist bewusst nah an der Leistungsuebersicht gehalten. Ob das Foto praesenter oder zurueckhaltender sein soll, ist eine gestalterische Entscheidung — die drei Gradienten stehen dafuer gebuendelt in `.cc-photo-veil`.

### Offene Beobachtungen (nicht durch diese Aufgabe verursacht)
> Abgearbeitet im Nachlauf: `docs/preloader/tasks/2026-07-24-preloader-optimierung-tasks.md`
> — Punkt 1 und 2 sind dort **erledigt**, Punkt 3 ist dort als bewusst offener Content-Task begruendet.

1. 🟡 **Mittel:** Der Prerender backt `class="lenis lenis-scrolling"` ins `<html>` der Snapshots. Harmlos (die Lenis-CSS kommt erst mit dem Bundle, danach verwaltet Lenis die Klassen selbst), aber unnoetiges Rauschen im statischen HTML. **Bestand vor dieser Aufgabe.**
2. 🟡 **Mittel:** `dist/assets/index-*.js` liegt bei **568 kB** (163 kB gzip) — Vite warnt beim Build. Code-Splitting waere ein eigener Task. **Bestand vor dieser Aufgabe.**
3. 🟢 **Niedrig:** `index.html` verweist bei `og:image` / `twitter:image` weiterhin auf eine Unsplash-URL statt auf ein eigenes Motiv. Fuer E-E-A-T/Marke waere ein eigenes Bild besser. **Bestand vor dieser Aufgabe.**
