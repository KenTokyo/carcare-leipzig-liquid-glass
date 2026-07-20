# Zielgruppen-Sektion: von 3 Kacheln zu Sticky Stacking Cards

> **Ziel (User, 2026-07-20):** Die Sektion „Der richtige Ansprechpartner für Ihr Fahrzeug" von drei
> gleichzeitig sichtbaren Karten zu einem scroll-gesteuerten Karten-Stapel umbauen. Jede folgende
> Karte schiebt sich über die vorherige, von der geparkten Karte bleibt oben eine schmale Leiste mit
> ihrem Titel stehen. Letzte Karte bleibt voll, danach löst sich der Effekt.
> **Ausdrücklich:** „Die Übergänge müssen absolut sauber und ruckelfrei sein. Deshalb browser-natives
> Sticky-Scrolling, kein hartes Springen."

## Mechanik (rein CSS, kein Scroll-JS)

Jede Karte ist `position: sticky` mit gestaffeltem `top`. Karte *i* parkt bei
`--nav + i × --bar`, `z-index` steigt mit dem Index, damit spätere Karten über früheren liegen.
Kartenhöhe `100svh − --nav − i × --bar` → der untere Rand schließt bündig mit dem Viewport ab,
egal wie viele Leisten schon stapeln.

| Variable | Mobil | ab `md` | Bedeutung |
|---|---|---|---|
| `--bar` | 56 px | 68 px | Höhe der stehenbleibenden Leiste = Höhe der Titelzeile |
| `--nav` | 5.35 rem (86 px) | 6.75 rem (108 px) | Freiraum für die **fixierte** Navbar |

**Warum nativ statt Framer:** Sticky läuft im Compositor, ist frame-genau und immun gegen rAF-Lag.
Ein JS-getriebener Transform hinkt pro Frame nach — genau daran ist der Pin der Unfall-Sektion
zuvor gescheitert (`docs/accident-scrollytelling/tasks/2026-07-19-pin-jitter-fix-tasks.md`).
Deshalb **kein** `useScroll`/`useTransform`, auch nicht für die optionale Opacity-Politur.

**Voraussetzung (bereits erfüllt):** Kein Vorfahr darf Scroll-Container sein. `<main>` trägt
`overflow: clip` statt `overflow-x: hidden` — gemessen: 0 Scroll-Container-Vorfahren.

---

## Phasen

### ✅ Phase 1 — Umbau
* [x] Grid (`md:grid-cols-2 lg:grid-cols-3`) durch Sticky-Stapel ersetzt
* [x] Karten als `<article>` mit `sticky`, gestaffeltem `top`, gestaffelter Höhe, aufsteigendem `z-index`
* [x] Titelzeile exakt `h-[var(--bar)]` → garantiert, dass der Titel im geparkten Zustand
      vollständig und mittig in der Leiste steht
* [x] Textspalte nach RECHTS (ab `md` 44 % / ab `lg` 38 % Kartenbreite), mobil oben über volle Breite
* [x] `svh` statt `vh`/`dvh`: die mobile Adressleiste verändert `dvh` während des Scrollens und
      würde die geparkten Karten springen lassen
* [x] Nachlauf-Puffer (`45svh`) hinter der letzten Karte — ohne ihn löst sie sofort wieder,
      sobald sie parkt, und wäre nie in Ruhe zu sehen
* [x] Kachel-Optik beibehalten (Bild + Verlauf + weisse Textfläche + Logo-Badge), `framer-motion`
      aus dieser Komponente entfernt (wird nicht mehr gebraucht)
**Referenzen:** `components/TargetGroupCards.tsx`

### ✅ Phase 2 — Verifikation & Korrekturen
**Gemessen über 15 Scroll-Tiefen je Breakpoint, plus vier gezielt angefahrene Schlüsselzustände.**

* [x] Geometrie stimmt an allen Breakpoints: `position: sticky`, `top` = 108/176/244 px (Desktop),
      86/142/198 px (Mobil), Höhen = `100svh − nav − i×bar`, `z-index` 1/2/3
* [x] **0 Scroll-Container-Vorfahren** an allen Breakpoints
* [x] Zustandsfolge belegt: 1 volle Karte → 1 Leiste + volle Karte 2 → 2 Leisten + volle Karte 3
      → Auflösung. Alle Titel in allen Zuständen lesbar.
* [x] Kein horizontaler Überlauf, kein Textüberlauf (390/360/768/1440)
* [x] `tsc` grün, `npm run build` inkl. Prerender 20/20 Routen

**Drei Fehler gefunden und behoben:**
1. 🔴 **Leisten lagen unter der fixierten Navbar.** Mit `top: 0` war „Privatkunden" komplett
   unsichtbar und „Versicherungen" halb abgeschnitten. Die Navbar (`.solidroad-nav-shell`) ist über
   den `position: fixed`-Shell fixiert und 78 px (mobil) bzw. 100 px hoch. Behoben mit `--nav`.
2. 🟡 **Logo-Badge lag hinter der MobileStickyCTA.** Die ist `lg:hidden`, 83 px hoch und fixiert am
   unteren Rand — betrifft also auch Tablet. Badge unterhalb `lg` auf `bottom-[6.5rem]` gesetzt.
3. 🟡 **CTA-Button war per `md:mt-auto` am Kartenfuss angeheftet.** Genau dieser Bereich wird von
   der nachrückenden Karte zuerst verdeckt → bei Karte 1 und 2 nur in einem sehr kurzen
   Scrollfenster sichtbar. Jetzt direkt unter dem Text; alle drei Karten verhalten sich identisch.
**Referenzen:** `components/TargetGroupCards.tsx`

### ✅ Phase 3 — Nachschärfung (User, 2026-07-20)
**Ziel:** (1) Karten randlos wie die Hero-Sektion, (2) Titel „viel viel größer", (3) Überschrift
bleibt während der Scroll-Animation links oben auf dem Bild sichtbar.

**Zielkonflikt (dem User vorgelegt, Entscheidung: Variante A):** Große Titel und „Überschrift links
oben auf dem Bild" ziehen gegeneinander — die Leisten belegen oben die volle Breite. Gemessen: der
längste Titel („Versicherungen & Agenturen") braucht 441 px bei 32 px Schrift, in der alten 38-%-Spalte
standen aber nur 472 px (1440) bzw. 413 px (1280) zur Verfügung → max. ~28 px. Gewählt: Textspalte
verbreitern und die Überschrift als Overlay auf die Bildhälfte legen.

* [x] **Randlos:** `px-6` + `container mx-auto` vom Stapel entfernt (Überschriftenblock behält sie).
      Gemessen: Rand **14 px** bei 1440, **13 px** bei 1280, **8 px** mobil — **identisch zur
      Hero-Sektion**. Der Abstand kommt jetzt allein von `margin: var(--cc-shell-gap)` des Shells.
* [x] **Titel groß:** `clamp(1.25rem, 3.2vw, 2.75rem)` = **20 → 44 px** (vorher 18/24 px).
      Fluid statt Breakpoint-Stufen, weil die Spaltenbreite bei `lg` von voll auf 56 % springt —
      feste Stufen erzeugten dort einen Größen-Rückschritt.
* [x] `--bar` mitgewachsen: `clamp(3rem, 7vw, 6rem)` = 48 → 96 px, sonst passt der Titel nicht mehr
      in die Leiste.
* [x] Textspalte erst ab `lg` seitlich (56 %); bei `md` wäre sie zu schmal für den großen Titel,
      dort bleibt sie oben über die volle Breite.
* [x] **Überschrift als Overlay:** ab `lg` `sticky z-20 h-0 pointer-events-none`, links oben,
      weiße Schrift. Unterhalb `lg` bewusst ein **normaler Block** über dem Stapel — dort liegt die
      weiße Textfläche oben, weiße Schrift wäre unlesbar. Ein DOM-Knoten, kein doppeltes `h2`.
* [x] Karten-Verlauf von `to-tr` auf **`to-br`** gedreht (dunkel oben links), damit das Overlay auf
      dem hellen Werkstattbild lesbar ist.
* [x] Verifiziert: Parkpositionen 108/204/300 px (Desktop), 86/134/182 px (mobil), 0 Scroll-Container-
      Vorfahren, kein h-/Text-Überlauf, Titel an **14 geprüften Breiten** einzeilig ohne `truncate`-
      Abschnitt, `tsc` + Build (20/20) grün.
**Referenzen:** `components/TargetGroupCards.tsx`

**Zwei Fehler dabei gefunden und behoben:**
1. 🟠 **`xl:w-1/2` verengte die Spalte in die falsche Richtung.** Bei 1280 und 1366 px fiel die
   Textspalte von 56 % auf 50 % — ausgerechnet dort, wo der fluide Titel noch wächst. Ergebnis:
   „Versicherungen & Agenturen" wurde von `truncate` **still abgeschnitten** (Reserve −10 / −4 px).
   Stufe entfernt, jetzt konstant 56 % ab `lg` (Reserve +65 / +77 px).
2. 🟡 **Titel-Untergrenze zu hoch.** Bei 360 px Viewport fehlten 12 px. `clamp`-Minimum von
   1.375rem auf 1.25rem gesenkt → Reserve +14 px.

### ✅ Phase 4 — Weisse Karte einruecken, 70/30, CI-blauer Verlauf (User, 2026-07-20)
**Ziel:** (1) Weisse Flaeche als eingerueckte, abgerundete Karte im Bild — genau wie in der
Leistungsuebersicht, (2) Verhaeltnis 70 % Bild / 30 % weiss, (3) Hero-Verlauf, aber im CI-Blau.

* [x] **Einzug + Rundung** exakt nach dem Muster aus `ExpandingCardAccordion` (dort
      `absolute inset-y-3 left-3 rounded-2xl bg-[rgb(255_255_255/0.92)]` + weicher Schatten),
      hier nach rechts gespiegelt. Neue Variable `--gap: 0.75rem` (= 12 px, wie `inset-3`).
      Gemessen: Einzug **12 px oben und rechts**, Radius **16 px** an allen Breiten, bei allen
      drei Karten identisch.
* [x] `--bar` enthaelt den Einzug jetzt MIT (`--gap` + Titelzeile). Die Titelzeile ist deshalb
      `calc(var(--bar) - var(--gap))` hoch — sonst waeren Parkposition und sichtbarer Streifen
      gegeneinander verschoben und die Rundung oben abgeschnitten.
* [x] **70/30** ab `lg` (`lg:w-[30%]`). Gemessen: Bildanteil **70 %** bei 1024–1920.
      Unterhalb `lg` bleibt die Karte oben ueber die volle Breite (Hochkant-Layout).
* [x] **CI-blauer Verlauf**: neue Klasse `.cc-radial-veil-blue` in `index.css` — identische
      Geometrie und Deckkraft-Stufen wie `.hero-radial-veil` (94 % Ecke oben links / 45 %
      Bildmitte / 0 % Ecke unten rechts), nur mit `--cc-trust-blue` (#0b3d91) statt Carbon.
      Ersetzt den bisherigen `bg-gradient-to-br`.
* [x] Karte braucht kein Flex mehr (Bild, Verlauf, Badge, weisse Karte liegen alle absolut).
* [x] Verifiziert: Parkpositionen 108/194/281 px (Desktop), 86/154/222 px (mobil), 0 Scroll-
      Container-Vorfahren, kein h-/Text-Ueberlauf, Titel an 10 Breiten einzeilig, `tsc` + Build
      (20/20) gruen.
**Referenzen:** `components/TargetGroupCards.tsx`, `index.css`

**⚠️ Bekannte Folge (dem User gemeldet, bewusst so umgesetzt):** Die 30-%-Spalte begrenzt die
Titelgroesse hart. Gemessen (laengster Titel, einzeilig):

| Viewport | 1024 | 1280 | 1440 | 1920 |
|---|---|---|---|---|
| weisse Karte | 301 px | 376 px | 423 px | 566 px |
| Titel | **17 px** | 22 px | 25 px | 35 px |

Vorher (56-%-Spalte) waren es bis zu 44 px. Der Wunsch „viel viel groessere Titel" (Phase 3) und
„30 % weiss" (Phase 4) sind geometrisch nicht gleichzeitig erfuellbar. Optionen, falls die Titel
wieder groesser sollen: (a) Titel zweizeilig zulassen und `--bar` entsprechend erhoehen — kostet
Stapelhoehe, (b) weisse Karte auf ~40 % verbreitern, (c) Titel nur bei `lg`/`xl` etwas breiter
setzen als die Karte selbst.

### ✅ Phase 5 — Titelgroessen auf Referenz, Verlauf ins CTA-Schwarzblau (User, 2026-07-20)
**Ziel:** Beide Titel so gross wie in der Unfall-Sektion; Verlauf statt CI-Blau im Schwarzblau
der CTA-Buttons.

**Gemessen statt geschaetzt (Referenz `AccidentDamageSection`):**

| | Referenz | vorher | jetzt |
|---|---|---|---|
| Sektions-`h2` | 48 px | **48 px — traf schon** | 48 px, aber Kasten von 480 auf 640 px verbreitert |
| Karten-`h3` | 30 px (24 px mobil) | 25 px (1440) / **17 px (1024)** | **30 px / 24 px = exakt Referenz** |

* [x] `h3` auf `text-2xl md:text-3xl` — identisch zur Referenz, keine fluide Formel mehr
* [x] **`truncate` → `line-clamp-2`:** In der 30-%-Spalte passt 30 px nicht mehr einzeilig
      („Versicherungen & Agenturen" braucht ~394 px, verfuegbar 235–355 px). Zweizeilig ist die
      einzige Loesung, die Referenzgroesse UND 30-%-Spalte zusammenbringt.
* [x] `--bar` auf zwei Titelzeilen ausgelegt: **96 px** (mobil/tablet) bzw. **112 px** ab `lg`.
      Geprueft: Titel wird an keiner Breite abgeschnitten (`scrollHeight <= clientHeight`).
* [x] `h2`-Kasten `min(42vw,30rem)` → `min(54vw,40rem)`: Die Ueberschrift war mit 48 px zwar
      schon auf Referenzgroesse, brach im engen Kasten aber dreizeilig um und wirkte dadurch
      kleiner. Jetzt zweizeilig.
* [x] **Verlaufsfarbe** — zwei Anlaeufe:
      1. `--cc-graphite` (#151a21) probiert, weil das die `background-color` von
         `.cc-gradient-button` ist. Ergebnis: rendert bei 94 % praktisch schwarz, das Blau war weg.
      2. Ursache: Auf den CTA-Buttons sieht man nicht die `background-color`, sondern das
         Verlaufsbild `carcare-button-gradient.webp` darueber. Dessen Ton ausgemessen:
         Mittel **#3e5064** (Ecken #33393e bis #48678c). Als `--cc-cta-blue-rgb` hinterlegt.
      Nachgemessen am gerenderten Ergebnis: Ecke oben links **#3c4c5f**, Bildmitte #293642,
      unten rechts #181f26 — Blaukanal durchgehend 14–35 Punkte ueber Rot, also sichtbar blau.
* [x] Verifiziert: Parkpositionen 108/220/332 px (Desktop), 86/182/278 px (mobil), 0 Scroll-
      Container-Vorfahren, kein h-/Text-Ueberlauf (360–1920), `tsc` + Build (20/20) gruen.
**Referenzen:** `components/TargetGroupCards.tsx`, `index.css`

### ✅ Phase 6 — Logo auf die weisse Karte, Akzentpunkt repariert (User, 2026-07-20)
* [x] **CarCare-Marke** von unten links (auf dem Bild) nach **unten rechts auf die weisse Karte**.
      Bewusst im Fluss (`mt-auto self-end`) statt absolut: Ab `lg` ist die weisse Karte
      bildschirmhoch, `mt-auto` schiebt das Logo an den Fuss; unterhalb `lg` ist sie nur
      inhaltshoch — absolut positioniert wuerde das Logo dort auf dem CTA-Button liegen.
      Gemessen: Einzug 24 px (Desktop) / 20 px (mobil), **keine Kollision mit dem CTA** an
      360/390/768/1440. Schatten von `shadow-lg` auf `shadow-sm`, da jetzt auf Weiss statt Bild.
* [x] Der frueher noetige `bottom-[6.5rem]`-Sonderfall (Freiraum fuer die MobileStickyCTA)
      entfaellt damit — das Logo sitzt jetzt weit oberhalb des unteren Viewportrands.
* [x] **Blauer Akzentpunkt (User-Frage „warum ist da ein blauer Punkt?"):** Stammt aus dem
      urspruenglichen Kartendesign und ist ein seitenweites Motiv — dieselbe Markierung steht an
      den Titeln der Leistungsuebersicht (`ExpandingCardAccordion.tsx:173`). Rein dekorativ
      (`aria-hidden`). **Mein Umbau hatte ihn verschlechtert:** aus dem inline am Titel haengenden
      Punkt war ein eigenes Flex-Geschwister geworden, das bei zweizeiligen Titeln weit nach
      rechts wegdriftete und wie ein Fehler wirkte. Zurueck auf inline im `h3`, wie im Original.
* [x] `[hyphens:none]` auf dem `h3`: Der inline gesetzte Punkt verlaengert die letzte Zeile und
      loeste dadurch die Silbentrennung der weissen Karte aus („Versicherungen & Agentu-ren").
      Trennung ist fuer die Fliesstexte gedacht, nicht fuer Titel — Titel brechen jetzt wieder
      an der Wortgrenze.
* [x] Verifiziert: Titel an 7 Breiten vollstaendig und unbeschnitten, `tsc` + Build (20/20) gruen.
**Referenzen:** `components/TargetGroupCards.tsx`

### ✅ Phase 7 — Abstaende der weissen Karte vereinheitlicht (User, 2026-07-20)
**Meldung:** „Der weisse Kasten ist an der unteren Kante zu lang, das sieht nicht gleichmaessig aus.
Mehr Abstand zur Aussenkante des hinterliegenden Motivs."

**Zwei Ursachen gefunden — die gemeldete Kante war nur das Symptom:**

1. 🟠 **Die Karte endete exakt bei `100svh`, also buendig mit der Bildschirmunterkante.** Der
   Bildrand unter der weissen Flaeche lag damit im letzten Pixelstreifen des Viewports und war
   unsichtbar, waehrend er oben und rechts klar zu sehen war — daher der Eindruck „unten zu lang".
   Auffaellig wurde es erst beim Debuggen: Der Crop der unteren rechten Ecke schlug fehl, weil
   unterhalb der Karte gar kein Screenshot-Bereich mehr existierte.
   **Behoben** mit neuer Variable `--fuss` (Kartenhoehe = `100svh - --nav - --fuss - i x --bar`):
   **1.75 rem** ab `lg`, **6.5 rem** darunter — der groessere Wert haelt zugleich die fixierte
   MobileStickyCTA (83 px, `lg:hidden`) frei, die zuvor den Kartenfuss verdeckte.
   Gemessen: Kartenunterkante 872 px bei 900 px Viewport (Desktop), 740 bei 844 (mobil).

2. 🟡 **Ecken waren nicht konzentrisch.** Kanten hatten 12 px, die Ecken sichtbar mehr. Fuer einen
   ueberall gleich breiten Rand muss gelten `Radius aussen − Einzug = Radius innen`. Es standen
   24 − 12 = 12 gegen einen Innenradius von 16. **Behoben**: Kartenradius auf **2.25 rem (36 px)**,
   damit 36 − 20 = 16 = `rounded-2xl` der weissen Karte. Die Kurven laufen jetzt parallel.

* [x] `--gap` 0.75 rem → **1.25 rem (20 px)**, wie gewuenscht mehr Abstand ringsum
* [x] Gemessen an 4 Ansichten: oben/rechts/unten je **20 px**, Radien 36/16
* [x] Logo weiterhin sauber (24 px Einzug Desktop, 20 px mobil, keine CTA-Kollision)
* [x] Stapel unveraendert korrekt: Parkpositionen 108/220/332 (Desktop), 86/182/278 (mobil),
      0 Scroll-Container-Vorfahren, kein Ueberlauf, `tsc` + Build (20/20) gruen
**Referenzen:** `components/TargetGroupCards.tsx`

> ⚠️ **Kopplung:** `--gap` und der Kartenradius muessen gemeinsam geaendert werden
> (`Radius = --gap + 16 px`), sonst kippen die Ecken wieder aus dem Gleichmass. Im Code vermerkt.

### ✅ Phase 8 — Ueberschrift wandert mit, loest am Ende (User, 2026-07-20)
**Meldung:** (1) Die Ueberschrift bleibt oben kleben, statt mit der offenen Karte mitzuwandern —
sie soll je Karte eine Stufe tiefer stehen, auf Hoehe des jeweiligen Kartentitels. (2) Sie haengt
ueber das Sektionsende hinaus und wandert bis in den Prozess-Abschnitt mit.

**Ursachen:**
1. `position: sticky` kennt nur **ein festes `top`**. Ein pro Karte wechselnder Wert ist in
   reinem CSS nicht ausdrueckbar.
2. Ein Sticky-Element loest erst, wenn die Container-Unterkante `top + Elementhoehe` erreicht.
   Die Ueberschrift hatte `h-0` → sie hing bis zum Container-Ende, also rund **einen Bildschirm
   laenger** als die letzte Karte (deren Hoehe im Container mitzaehlt).

**Umsetzung:**
* [x] Effekt in `TargetGroupCards` schreibt den Index der offenen Karte als `--aktiv` (0/1/2)
      direkt auf den Stapel-DOM-Knoten. **Bewusst ohne React-State** — kein Re-Render im
      Scroll-Pfad. rAF-gedrosselt, Aufraeumen im Cleanup.
      Unkritisch trotz JS: `--aktiv` ist eine **Stufenfunktion**, sie aendert sich genau zweimal.
      Kein pro Frame interpolierter Wert, also auch kein Nachlaufen wie beim frueheren Unfall-Pin.
* [x] Neue Regel `.zielgruppen-titel` (index.css, nur `@media (min-width: 1024px)`):
      `top: calc(var(--nav) + var(--bar) * var(--aktiv, 0) + 1.5rem)`.
      Der Fallback `, 0` haelt die Regel gueltig, bevor JS gelaufen ist (Prerender).
* [x] Hoehe gegen das Ueberhaengen aus der Loesungsbedingung hergeleitet
      (`top(Stufe 2) + Hoehe = 100svh - --fuss`, also der Unterkante der letzten Karte):
      `height: calc(100svh - var(--fuss) - var(--nav) - 2 * var(--bar) - 1.5rem)`,
      dazu `margin-bottom` als negativer Gegenwert, damit der Fluss unveraendert bleibt.
* [x] `transition: top 320ms` — ohne sie springt die Ueberschrift hart zwischen den Stufen.
* [x] Unterhalb `lg` unveraendert: normaler Block ueber dem Stapel (weisse Flaeche liegt dort oben,
      weisse Schrift waere unlesbar). `--aktiv` bleibt dort ungenutzt.

**Verifiziert (3 Breiten, je 3 Kartenzustaende + Kontrolle 200 px hinter der Sektion):**

| | Karte 1 offen | Karte 2 offen | Karte 3 offen |
|---|---|---|---|
| `--aktiv` | 0 | 1 | 2 |
| Ueberschrift `top` | 132 px | 244 px | 356 px |

Schrittweite **exakt 112 px = eine Leistenhoehe**, Versatz zur offenen Karte konstant 24 px.
200 px hinter der Sektion: Ueberschrift bei −828 px gegen Sektionsunterkante −200 px →
**mit den Karten weggescrollt, ragt nicht in den Folgeabschnitt**.
Stapel, Abstaende und Ueberlauf unveraendert korrekt; `tsc` + Build (20/20) gruen.
**Referenzen:** `components/TargetGroupCards.tsx`, `index.css`

### ✅ Phase 9 — Ueberschrift an die erste Karte koppeln (Regression aus Phase 8)
**Meldung:** Beim Scrollen aus der Unfall-Sektion erscheint zuerst die weisse Ueberschrift allein
auf weissem Grund (nur Schlagschatten sichtbar); die erste Karte kommt erst deutlich spaeter dazu.

**Ursache — selbst verbockt in Phase 8:** Der in Phase 8 eingefuehrte negative `margin-bottom` kam
**nie an**. Am Element stand noch die Tailwind-Utility `lg:mb-0`, und `@tailwind utilities` wird in
`index.css` **bewusst zuletzt** eingebunden (Hinweis steht am Dateianfang) — Utilities schlagen
damit Custom-Klassen gleicher Spezifitaet. Gemessen: `margin-bottom: 0px` statt `-516px`, dadurch
belegte die Ueberschrift ihre volle Hoehe im Fluss und schob Karte 1 um **516 px** (1440) bzw.
**436 px** (1024) nach unten. Genau dieser Versatz war der beschriebene Vorlauf.

* [x] `mb-10` und `lg:mb-0` vom Element entfernt; beide Abstaende stehen jetzt komplett in
      `.zielgruppen-titel` (Basis `2.5rem`, ab `lg` der negative Gegenwert). Damit gibt es
      keinen Utility-Konflikt mehr.
* [x] Nachgemessen: Versatz Ueberschrift → Karte 1 jetzt **0 px** bei 1440 und 1024
      (vorher 516/436). Mobil unveraendert 309 px (dort ist es ein normaler Block — korrekt).
* [x] Eintritt der Sektion an drei Scrollpositionen geprueft: Ueberschrift liegt durchgehend
      **innerhalb des Kartenmotivs**, kommt also gemeinsam mit „Privatkunden" ins Bild.
* [x] Stufen aus Phase 8 unveraendert: 132 / 244 / 356 px (+112 = eine Leistenhoehe je Karte),
      Aufloesung am Sektionsende weiterhin korrekt.
* [x] Stapel, Abstaende, Ueberlauf unveraendert; `tsc` + Build (20/20) gruen.
**Referenzen:** `components/TargetGroupCards.tsx`, `index.css`

> ⚠️ **Lehre fuer diese Codebase:** Custom-CSS-Klassen und Tailwind-Utilities duerfen sich hier
> nie dieselbe Eigenschaft teilen — die Utility gewinnt immer (bewusste Reihenfolge in index.css).
> Entweder alles in der Custom-Klasse oder alles per Utility.

### ✅ Phase 10 — Ueberschrift an die LETZTE Karte koppeln + Abstand ab dem ersten Frame
**Meldung:** (1) Nach „Autohaeuser & Fuhrparks" wandert die Ueberschrift wieder mit in den
Prozess-Abschnitt. (2) Beim Einscrollen der ersten Karte klebt der Text fast buendig auf der
Kartenoberkante; der Abstand stimmt erst, wenn die Karte eingerastet ist.

**Ursache 1 — der Phase-8-Fix hat nie funktioniert, mein Test hat es nicht gemerkt.**
Sticky begrenzt ueber die **Margin-Box**. Der dort gesetzte `margin-bottom: -Hoehe` hob die Hoehe
also nicht nur im Fluss auf, sondern auch fuer die Begrenzung — die Ueberschrift verhielt sich
weiterhin wie `h-0` und hing bis zum Container-Ende. Der Phase-8-Test prueft nur EINEN Punkt weit
hinter der Sektion und lag dort zufaellig richtig. Erst ein **Verlaufstest** ueber die gesamte
Ausstiegsphase zeigte es: bei +480 px stand Karte 3 schon bei 257 px, die Ueberschrift noch bei
356 px — sie loeste rund **500 px spaeter**. Bei 1024 war der Titel am Ende sichtbar, die Karte nicht.

* [x] Ausgleich vom `margin-bottom` der Ueberschrift auf `margin-top` der **ersten Karte**
      verschoben (`.zielgruppen-titel + article`). Die Ueberschrift behaelt damit eine positive
      Margin-Box → die Hoehe wirkt fuer die Begrenzung.
* [x] Hoehe vereinfacht auf **exakt die Hoehe der letzten Karte**
      (`100svh - --fuss - --nav - 2 * --bar`), damit beide denselben Ausloesepunkt haben.
* [x] Nachgemessen ueber 11 Scrollschritte: **Differenz Ueberschrift ↔ Karte 3 konstant 0 px**
      ueber die gesamte Ausstiegsphase. Der Titel verschwindet sogar leicht VOR der Karte.

**Ursache 2:** Der 24-px-Abstand steckte im `top`-Wert. `top` wirkt aber erst, wenn das Element
klebt — waehrend des Einscrollens sass der Text daher buendig auf der Kartenkante.
* [x] Abstand von `top` nach **`padding-top: 1.5rem`** verschoben. Padding gilt immer, also auch
      im ungeklebten Zustand. `top` entsprechend um 1.5rem reduziert, damit der geklebte Zustand
      unveraendert bleibt.
* [x] Nachgemessen an drei Eintrittspositionen (55 %, 25 %, 0 % Viewport):
      **Abstand konstant 24 px** — vorher 0 px waehrend des Einscrollens.

**Regressionslauf (nichts anderes angefasst):** Stufen unveraendert 132/244/356 px; Stapel-
Parkpositionen, `--bar`/`--nav`, 0 Scroll-Container-Vorfahren, Abstaende der weissen Karte
(20 px, Radien 36/16), Logo (24/20 px, keine CTA-Kollision), Titeltexte vollstaendig, kein
Ueberlauf, Mobile unveraendert (Ueberschrift dort weiterhin normaler Block, Versatz 309 px).
`tsc` + Build (20/20) gruen.
**Referenzen:** `index.css`, `components/TargetGroupCards.tsx`

> ⚠️ **Lehre:** Sticky-Reichweite haengt an der **Margin-Box** — ein negativer Rand am
> Sticky-Element selbst macht seine Hoehe fuer die Begrenzung zunichte. Ausgleich immer am
> Nachbarelement. Und: Ausstiegsverhalten nie an einem einzelnen Punkt pruefen, sondern im
> Verlauf — der Einzelpunkt-Test hat einen kompletten Fehlfix als „gruen" durchgewinkt.

---

## Kommentare

### Phase 1–2 (Sticky Stacking Cards)
**Eingehalten:** natives Sticky statt Scroll-JS wie gefordert ✅, Mobile-First (eigene `--bar`/`--nav`
mobil, früh getestet) ✅, alle Karten identisch behandelt ✅, Kachel-Optik erhalten ✅, Titel oben in
der Leiste ✅, Texte rechts ✅, kein reduced-motion-Gate ✅, Encoding sauber ✅, < 700 Zeilen ✅,
`tsc` + Build grün ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟡 **Mittel (Methodik, eigener Fehler):** Zwei Messläufe meldeten Fehlschläge, die keine waren —
   das Prüfskript rechnete die Sollposition ohne den `--nav`-Versatz und maß einmal hinter dem
   Auflösepunkt. Der Code war jeweils korrekt. Lehre: Beim Nachziehen von Layout-Konstanten muss
   das Prüfskript mitgezogen werden, sonst prüft es das Falsche.
2. 🟢 **Niedrig (bewusst so):** Die Sektion ist jetzt ~3,3 Bildschirmhöhen lang statt einer. Das ist
   dem Effekt inhärent (drei Karten brauchen Scrollweg). Wer sie kürzer will, reduziert den
   Nachlauf-Puffer (`45svh`) — darunter wird die letzte Karte aber hektisch.
3. 🟢 **Niedrig (offen, Content-Entscheidung):** Der CTA „Geschäftskundenservice ansehen" ist mit
   Abstand der längste und bricht in der schmalen Textspalte um. Kürzere Copy wäre schöner —
   siehe auch `docs/schrift-space-grotesk/.../Finding 4`.
4. 🟢 **Niedrig (Kopplung, dokumentiert):** `--nav` spiegelt die Navbar-Höhe als feste Werte. Ändert
   sich `.solidroad-nav-shell` (`h-[4.85rem] md:h-[6.25rem]`), muss `--nav` nachgezogen werden.
   Im Code als Warnung vermerkt. Eine automatische Kopplung wäre nur per JS-Messung möglich —
   bewusst nicht gemacht, weil das wieder JS in den Scroll-Pfad brächte.

5. 🟡 **Mittel (Methodik, Wiederholungstäter):** In Phase 3 schlugen die Prüfskripte erneut
   Fehlalarm — `parseFloat` scheitert an `clamp()`, und die Scrollziele wurden ab Container-Oberkante
   gerechnet, wo auf Mobile noch der Überschriftenblock im Fluss liegt. Beides gefixt: Leistenhöhe
   und Parkoffset werden jetzt an den **echten Elementen** gemessen (`h3`-Elternhöhe bzw. aufgelöstes
   `top`), Scrollziele aus den natürlichen Kartenpositionen bei `scrollY 0`. Dasselbe Muster wie in
   Phase 2 — Lehre erneut: Wenn Layout-Konstanten fluid werden, muss die Messung mitwandern.

**Hauptkomponenten (max. 3):** `components/TargetGroupCards.tsx` (kompletter Umbau).

**Fazit:** Stapel läuft rein compositor-getrieben, Zustandsfolge und Parkpositionen an drei
Breakpoints nachgemessen. Drei echte Fehler (Navbar-Überdeckung, Badge hinter der CTA-Leiste,
verdeckter CTA-Button) im Zuge der Verifikation gefunden und behoben.
