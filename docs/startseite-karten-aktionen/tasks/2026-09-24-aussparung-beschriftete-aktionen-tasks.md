# Aktions-Aussparung oben rechts: beschriftet, selbsterklaerend, mit Hierarchie

**Auftrag (User, 2026-09-24, dritte Runde):** Die CTAs oben rechts auf Navbar-Hoehe gefallen —
„aber leider kann man das nicht richtig erkennen, also sie sind zu unscheinbar und nicht
selbsterklaerend. Ich brauche eine Anpassung, sodass man direkt sieht, dass man dort die CTAs sieht
und weiss wofuer sie gedacht sind. Mach das so, als waere das eine Award Winning Website."

**Vorgaenger:** `2026-09-24-aussparung-oben-rechts-und-suche-tasks.md` (Aussparung, Reiterbreiten,
Suche). Form, Rundungen (24/28) und Lage oben rechts bleiben — gewuenscht ist die Erkennbarkeit.

---

## Befund (gemessen 2026-09-24, Dev-Server, Puppeteer, 9 Fenster)

| Fenster | Reiter | frei rechts vom Reiter | Aussparung | Luecke zw. den konkaven Uebergaengen |
|---|---|---|---|---|
| 1024 × 700 | 580 | 222 | 140 × 100 | 26 |
| 1152 × 720 | 580 | 286 | 142 × 100 | 88 |
| 1280 × 800 | 810 | 235 | 143 × 100 | 36 |
| 1366 × 657 | 840 | 263 | 144 × 100 | 63 |
| 1440 × 900 | 840 | 300 | 144 × 100 | 100 |
| 1536 × 730 | 1000 | 268 | 145 × 100 | 67 |
| 1680 × 900 | 1000 | 340 | 146 × 100 | 138 |
| 1920 × 945 | 1000 | 460 | 146 × 100 | 258 |
| 2560 × 1300 | 1000 | 780 | 146 × 100 | 578 |

Navbar-Links reichen links 388 px, rechts 356 px (Kreis) bzw. 433 px (Suchfeld ab 1536) von der Mitte.

**Warum die Knoepfe nicht als CTAs gelesen werden — vier Ursachen:**
1. **Nur Symbole.** Telefon und Warndreieck ohne Text. Das Dreieck liest sich als „Warnung/Fehler",
   nicht als „Schaden melden". NN/g: Beschriftungen muessen *immer* sichtbar sein, Einblenden beim
   Ueberfahren ist ausdruecklich kein Ersatz (hoehere Interaktionskosten, geht auf Touch nicht).
2. **Keine Hierarchie.** Zwei gleiche dunkle Kreise — keine Hauptaktion, nichts fuehrt das Auge.
3. **Zu wenig Flaeche.** 44-px-Kreise in einer 140-px-Aussparung neben einem dunklen Hero-Foto:
   Sie lesen sich wie Dekor-Punkte des Rahmens.
4. **Kein Kontext.** Nichts sagt, ob jetzt jemand ans Telefon geht, und dass „Schaden melden" zu
   reparatur.info fuehrt, steht nur im Hinweis beim Ueberfahren.

**Gemessene Textbreiten (Space Grotesk, 600):** „Schaden melden" 104 px (13 px) · „0341 261 77 90"
92 px · „Anrufen" 50 px. Ein beschrifteter Knopf „Schaden melden" mit Symbol braucht rund 150 px —
mehr, als die Aussparung bei 1280 heute insgesamt breit ist.

## Loesungswege (verglichen)

| Weg | Selbsterklaerend | passt 1024–1535 | Urteil |
|---|---|---|---|
| A. Kreise groesser, Hinweis beim Ueberfahren bleibt | nein (NN/g) | ja | verworfen — loest Ursache 1 nicht |
| B. Beschriftung unter den Kreisen (App-Dock) | ja, aber 10–11 px | knapp | verworfen — winzig, „Schaden / melden" zweizeilig, wirkt nicht hochwertig |
| C. Zwei beschriftete Pillen nebeneinander | ja | **nein** (braucht ~440 px frei) | nur als breite Fassung |
| D. Ein Knopf „Kontakt", Rest im Aufklapper | halb | ja | verworfen — ein Klick mehr, genau das Gegenteil von „sofort" |
| E. **Zwei beschriftete Pillen uebereinander (Stapel)** — geplant mit „Reihe" ab ~1900 px, die nach Messung entfiel (Phase 2) | **ja** | **ja**, mit angepassten Reitern | **gewaehlt** |

**Entscheidungen:**
* **Hauptaktion „Schaden melden"** (dunkler CTA-Verlauf wie ueberall auf der Seite), **Nebenaktion
  Telefon** (helle, getoente Pille, dunkle Schrift) — Hierarchie statt zwei gleicher Kreise.
* **Telefon zeigt die Nummer**, nicht „Anrufen": Symbol + Nummer ist eindeutig, und am Desktop, wo
  `tel:` oft nichts tut, ist die Nummer das, was man braucht. Ansage bleibt „Anrufen: …".
* **Live-Status am Telefon** (Punkt + Hinweis „Jetzt geoeffnet · bis 18 Uhr" / „Geschlossen · Mo ab
  7 Uhr"): beantwortet „lohnt ein Anruf jetzt?". Zeitzone Europe/Berlin, **saechsische Feiertage**
  (inkl. Buss- und Bettag), Samstag „nach Vereinbarung". Oeffnungszeiten als EINE Quelle, aus der
  auch das JSON-LD liest. Automatisierte Browser (Prerender, Pruefskripte) bekommen die neutrale
  Fassung — das statische HTML darf keinen Build-Zeitpunkt einfrieren.
* **Mikro-Interaktionen** wie auf ausgezeichneten Seiten, aber ruhig: Text rollt beim Ueberfahren
  (gleicher Text, damit die Nummer lesbar bleibt), Telefon „klingelt", Pfeil schiebt, Druck-Feedback,
  einmaliger Lichtstreif ueber die Hauptaktion nach dem Laden, Status-Punkt pulsiert dreimal (< 5 s,
  WCAG 2.2.2). Eintritt erst, wenn der Preloader weg ist (CSS, `html:not(.cc-preloading)`).
  Kein reduced-motion-Gate (Projektentscheidung, siehe Memory `no-reduced-motion-gates`).
* **Platz schaffen, nicht quetschen:** Reiter 1024–1279 von 580 auf ~460 px (dort nur Suche, Logo,
  Menue), 1280–1535 Links enger gesetzt (Abstand, Laufweite, Einzug) und Reiter entsprechend schmaler.
* Unter 1024 unveraendert: Aktionen in der Leiste unten (`MobileStickyCTA`).

---

### ✅ Phase 1 — Oeffnungszeiten als eine Quelle + Live-Status
* [x] `data/oeffnungszeiten.ts` (neu, 170 Zeilen, ohne Importe): `OEFFNUNG` 07:00–18:00, Mo–Fr,
      Samstag „nach Vereinbarung", die elf landesweiten Feiertage Sachsens (Ostern nach Gauss, Buss-
      und Bettag = Mittwoch vor dem 23.11.; Fronleichnam gilt nur um Bautzen), leere `BETRIEBSRUHE`
      zum Nachtragen, `oeffnungsStatus(datum)` immer in Europe/Berlin
* [x] `seo/structuredData.ts`: `openingHoursSpecification` liest `SCHEMA_WOCHENTAGE`/`OEFFNUNG`
* [x] **20 Stichproben, alle gruen** (tsx gegen feste Zeitpunkte): 06:59/07:00/17:59/18:00, Freitag-
      abend → „Mo", Samstag, Sonntag, 3.10. (Sa), Buss- und Bettag 18.11.2026 → „morgen", Vorabend →
      „Do", Karfreitag → „Di", 24.12. offen / abends → „Mo", Sommerzeit-Start, UTC- und New-York-Zeit.
      Feiertagslisten 2025–2027 gegen den Kalender geprueft

### ✅ Phase 2 — Komponente: beschriftete Aktionen mit Hierarchie
* [x] `components/AktionsAussparung.tsx` neu: Telefon-Pille (Nummer, Hoerer-Plakette, Live-Punkt) und
      Hauptaktion „Schaden melden" (CTA-Verlauf, Warn-Plakette, Pfeil ↗); Hinweise als Geschwister der
      Pillen (unter der Aussparung, rechtsbuendig) — im Stapel laege ein Hinweis sonst auf der zweiten Pille
* [x] `styles/aussparung.css`: Pillen 36 px, Plaketten 26 px, 13 px/600; Text rollt (gleicher Text,
      Nummer bleibt lesbar), Hoerer klingelt, Pfeil schiebt, Druck-Feedback, Lichtkante innen,
      Lichtstreif einmal nach 1 s, Status-Puls dreimal (< 5 s), Eintritt erst nach dem Preloader
      (`html:not(.cc-preloading)`, `backwards` damit `:hover` danach wieder greift)
* [x] Ansagen: „Anrufen: 0341 - 261 77 90, Jetzt geöffnet · bis 18 Uhr" (sichtbarer Text steckt im
      Namen, WCAG 2.5.3) · „Schaden melden (öffnet in einem neuen Tab)"
* [x] **Verworfen: Reihe nebeneinander fuer breite Fenster.** Gemessen braucht sie ~390 px Aussparung —
      bei 1920 und 1000-px-Reiter blieben 2–15 px Luecke. Der Stapel gilt ueberall; eine Anordnung,
      eine Bildsprache

### ✅ Phase 3 — Platz: Reiterbreiten und Navbar-Links
* [x] Reiter per `clamp()` je Spanne: 1024–1279 **440–580**, 1280–1535 **740–840** (Links enger:
      Einzug 106, Abstand 14, Laufweite 0,11 em — als Variablen `--cc-nav-einzug/-abstand/-laufweite`
      in `styles/aussparung.css`, `Navbar.tsx` liest sie), ab 1536 **940–1000** (ab 1596 wieder 1000)
* [x] Pfeil in „Schaden melden" nur 1280–1439 ausgeblendet (dort fehlen genau seine 20 px)
* [x] **Gemessen an 22 Breiten** (1024 … 2560): Luecke zwischen den konkaven Uebergaengen **20,2–508 px**
      (vorher bei 1280 erst −3,8), Links im Reiter mit **≥ 17,3 px** Rand (vorher 17), keine
      abgeschnittene Beschriftung. Engste Stellen: 1366/1380 (20,2–20,3), 1280 (21,2)

      | Fenster | Reiter | Aussparung | Luecke | Rand Links (li/re) |
      |---|---|---|---|---|
      | 1024 | 440 | 210 × 100 | 25,8 | — |
      | 1152 | 568 | 212 × 100 | 24,5 | — |
      | 1280 | 740 | 193 × 100 | 21,2 | 17,3 / 48,1 |
      | 1366 | 826 | 194 × 100 | 20,3 | 60,3 / 91,1 |
      | 1440 | 840 | 214 × 100 | 29,6 | 67,3 / 98,1 |
      | 1536 | 940 | 215 × 100 | 26,6 | 81,5 / 36,8 |
      | 1600 | 1000 | 216 × 100 | 28,0 | 111,5 / 66,8 |
      | 1920 | 1000 | 216 × 100 | 188 | 111,5 / 66,8 |
* [x] Zustaende im Bild geprueft (Puppeteer, Uhr per `Date`-Ersatz gestellt): geoeffnet (gruen),
      Abend, Samstag, Feiertag, Ueberfahren beider Pillen, Tastaturfokus, mobil 390 (Aussparung aus,
      Leiste unten da), Einzelbilder von Eintritt, Lichtstreif und Puls (Animationen angehalten)
* [x] 🟠 **Falle beim Fotografieren gefunden:** Puppeteers `screenshot({ clip })` vergroessert zum
      Aufnehmen kurz das Fenster (`captureBeyondViewport`, 2 × `resize`) — dabei startet der Eintritt
      neu, die Aufnahme zeigt halb durchsichtige Pillen. Echte Groessenaenderungen tun das NICHT
      (gemessen: gleiche Knoten, kein Neustart). Abhilfe: `captureBeyondViewport: false`. Betrifft
      die Pixelprobe in `check-aussparung.mjs` → Phase 4

### ✅ Phase 4 — Pruefwerkzeuge
* [x] `check-aussparung.mjs` — **Pixelprobe**: ohne Fenster-Vergroessern (`captureBeyondViewport:
      false`), endliche Animationen vorher per `finish()` ans Ende (Warten haette je Route bis zu
      2,1 s gekostet), sechs Messpunkte je Pille statt vier (keiner auf der Symbol-Plakette), helle
      Pille gegen ihre berechnete Farbe ±12 statt „nichts Helles" (Fallen 7 und 8 im Kopf)
* [x] **Neue Geometrie-Pruefung** an 23 Breiten (alle Spannengrenzen): Luecke ≥ 20 px, Pillen in der
      Aussparung, Beschriftung sichtbar und nicht abgeschnitten, sichtbarer Text in der Ansage
      (WCAG 2.5.3), Navbar-Links ≥ 12 px im Reiter
* [x] **Pflichtfrage beantwortet** (Kopf des Skripts): Die Geometrie misst Lage, nicht Lesbarkeit
      (→ `npm run kontrast`, nur 1440) und nicht Verstaendlichkeit; sie misst mit der echten Schrift
      (faellt die Webschrift aus, aendern sich die Breiten); zwischen den 23 Breiten misst sie nicht,
      die Reiter folgen aber `clamp()`-Geraden, deren Extreme an den gemessenen Grenzen liegen
* [x] **`--gegenprobe`**: spielt vier bekannte Fehler per CSS ein (Pillen ohne z-Index = der Fehler
      vom Vormittag, Reiter zu breit, Beschriftung abgeschnitten, Links am Reiterrand) und verlangt,
      dass jeder gemeldet wird — der Pruefer prueft sich selbst, mit einem Befehl
* [x] `check-kontrast.mjs`: zeitgetriebene, endliche CSS-Animationen vor jeder Messung beenden
      (Falle 8) — sonst zaehlte der Lichtstreif zwischen den beiden Aufnahmen als Glyphen
* [x] CLAUDE.md: Zeile `npm run aussparung` nachgezogen (Geometrie, Wann-Spalte um `--cc-nav-*`)
* [x] Erster Volllauf gegen den Build: **29 Routen × 3 Fenster gruen, Geometrie an 23 Breiten gruen**

### ✅ Phase 4b — Optimierungen direkt umgesetzt (Plan: `…-optimierung-tasks.md`)
* [x] O4 **Zeige-Effekte nur mit echtem Zeiger** (`@media (hover: hover)`), Fokus immer, Druck-Feedback
      fuer beides — auf dem iPad quer klebte `:hover` nach einem Tipp. Gemessen: Maus (Hinweis 1, Text
      rollt −16,25 px, Hub −1 px), Touch-Emulation 1180 px (nach Tipp alles in Ruhe), Tastatur (Fokus)
* [x] O5 **Oeffnungszeiten aus einer Quelle**: `Footer`, `KontaktDaten`, `ContactCTA` lesen
      `OEFFNUNG_ANZEIGE` (einheitlich „Mo – Fr: 07:00 – 18:00 Uhr"), `OEFFNUNG_NEUTRAL` abgeleitet;
      `grep` findet die Zeiten nur noch in `data/oeffnungszeiten.ts`
* [x] O8 **CTA-Verlauf als `--cc-cta-verlauf`** (index.css 671 → 667 Zeilen), im Browser identisch
* [x] **Naechster sinnvoller Schritt gleich mit:** Live-Punkt auch am „Anrufen" der mobilen Leiste
      (`MobileStickyCTA`), Hook dafuer nach `hooks/useOeffnungsStatus.ts` gezogen; Ansage mobil
      „Anrufen, Jetzt geöffnet · bis 18 Uhr". Gesehen bei 390 px (3x), offen und geschlossen

### ✅ Phase 5 — Verifikation
* [x] `npm run build` (zweimal: nach Phase 4 und nach 4b): Typen gruen, **29/29 vorgerendert**,
      Suchindex unveraendert (29 Seiten, 128 Abschnitte, 118 FAQ), statisches HTML mit neutralem
      Status („Mo–Fr 7–18 Uhr", kein eingefrorenes „Jetzt geöffnet")
* [x] `npm run nav`: **16/16**
* [x] `npm run kontrast`: **5438 Textstellen, keine unter WCAG AA** (vorher 5212 — die 226 zusaetzlichen
      sind die neuen Beschriftungen, an jeder Messposition der Desktop-Fassung mitgemessen)
* [x] `npm run aussparung`: **29 Routen × 3 Fenster ohne dauerhafte Ueberdeckung**, Pixelprobe beider
      Pillen unversehrt, Aussparung an 100 % der Positionen sichtbar; **Geometrie an 23 Breiten gruen**
      (Luecke 20,2–508 px)
* [x] `npm run aussparung -- --gegenprobe`: **4/4 eingespielte Fehler erkannt** — darunter der
      z-Index-Fehler vom Vormittag („fremde Farbe am Rand: rechts mitte" an beiden Pillen)
* [x] **Build 3** (Hook-Umzug, Leisten-Punkt) — alles erneut gegen den finalen Stand: `kontrast`
      **5438 Stellen, keine unter AA** · `nav` **16/16** · `zielgruppen` **alle Karten auf allen 15
      Fenstern in Ordnung** · `aussparung` (/, /kontakt, /karriere, /unfallinstandsetzung-leipzig × 3
      Fenster) **gruen**, Geometrie an 23 Breiten **gruen** · `--gegenprobe` **4/4 erkannt**
* [x] Mobile Leiste aus dem Produktions-Build fotografiert (390 px, 3x): Punkt gruen/grau, Ansage
      „Anrufen, Jetzt geöffnet · bis 18 Uhr" bzw. „Anrufen, Geschlossen · morgen ab 7 Uhr"
* [x] Aufnahmen: Vorher/Nachher bei 1920/1440/1280/1024, Zustaende (offen, Abend, Samstag, Feiertag,
      Ueberfahren, Fokus), mobil 390, Einzelbilder der Animationen

### ✅ Phase 6 — Dokumentation
* [x] Kommentarsektion (unten), Optimierungsplan, CLAUDE.md-Zeile `npm run aussparung`
* [x] Vorgaenger-Planung: Verweis auf diese Runde, alte Reiterbreiten als ueberholt markiert
* [x] Memory: `ctas-immer-beschriftet` (Vorgabe des Users), Nachtrag `clip`-Falle bei den Aufnahmen

### ✅ Phase 7 — „Schaden melden" oben rechts hell wie der Anruf-Knopf (2026-09-25)
**Auftrag (User, nach dem Liquid-Glass-Piloten — Glas gilt nur mobil, siehe
`docs/liquid-glass/tasks/`):** „Auf der Desktop-Seite rechts oben das Schaden melden soll dann bitte
auch im aehnlichen Design sein wie der Anruf-CTA … Aber nur den CTA-Button oben rechts."
* [x] Gemeinsame helle Pille `cc-aktion--hell` (Eisblau 0,6, Rand Vertrauensblau 0,14, dunkle Schrift,
      weisse Plakette mit blauem Symbol, Hover Eisblau 0,95) — vorher nur an `--telefon`
* [x] „Schaden melden": dunkler Verlauf (`cc-gradient-fill`), dunkle Schatten, durchscheinende
      Plakette und **Lichtstreif entfernt** (gehoerte zur dunklen Hauptaktion; auf Eisblau unsichtbar)
* [x] Modifikator `cc-aktion--haupt` → `cc-aktion--schaden` (samt Hinweis-Klasse): optisch gibt es
      keine Hauptaktion mehr, der alte Name haette das Gegenteil behauptet
* [x] Unterscheidung bleibt nur inhaltlich: Nummer + Live-Punkt vs. „Schaden melden" + Pfeil ↗
* [x] Unveraendert: „Schaden melden" im Hero (`cc-glass-button`), auf den Seiten und in der mobilen
      Leiste (Liquid Glass)
* [x] Kommentare in `check-aussparung.mjs` / `check-kontrast.mjs` nachgezogen (Lichtstreif als
      Anlass, Regel bleibt fuer jede einmalige Animation)
* [x] Bilder 1920/1440/1280, Ruhe + Maus auf „Schaden melden" · Build 29/29
* [x] `kontrast` **5439 Stellen, keine unter AA** · `aussparung` **voller Lauf 29 Routen × 3 Fenster
      gruen**, Geometrie 23 Breiten gruen (Pillenbreiten unveraendert) · `--gegenprobe` **4/4** ·
      `nav` **16/16**

### ⏸️ Phase 8 — Offen: Betriebsruhe fuer den Live-Status (zurueckgestellt, Rueckfrage an André)
* [ ] Feste Schliesstage oder Betriebsferien (z. B. 24.12./31.12., Sommerpause) beim Kunden erfragen
      und in `BETRIEBSRUHE` (`data/oeffnungszeiten.ts`, Format `JJJJ-MM-TT`) eintragen — sonst zeigt
      der Status an solchen Werktagen „Jetzt geöffnet" (Optimierungsplan O6)

**Referenzen:**
`docs/startseite-karten-aktionen/tasks/2026-09-24-aussparung-oben-rechts-und-suche-tasks.md`
`docs/startseite-karten-aktionen/tasks/2026-09-24-aussparung-beschriftete-aktionen-optimierung-tasks.md`
`components/AktionsAussparung.tsx`
`styles/aussparung.css`
`scripts/check-aussparung.mjs`

---

## Kommentare

### Phasen 1–6
**Eingehalten**: Planung vor Code ✅, Loesungswege verglichen (5) und begruendet gewaehlt ✅, gemessen
statt geschaetzt (Textbreiten, 22 bzw. 23 Fensterbreiten, Zustaende per gestellter Uhr) ✅, Mobile-First
(mobile Leiste unveraendert im Aufbau, nur Live-Punkt ergaenzt; Touch-Verhalten ab 1024 geprueft) ✅,
unter 700 Zeilen je Datei ✅ (`styles/aussparung.css` ~470, `index.css` 667), DESIGN.md-Formensprache
(Navbar-Rundungen 24/28, CTA-Verlauf, Space Grotesk, Versal-Kicker im Hinweis) ✅, Textregeln
(„wir"/„Sie" unberuehrt, Telefon im NAP-Anzeigeformat) ✅, Pflichtfrage vor dem Pruefskript beantwortet
und per `--gegenprobe` belegt ✅, kein reduced-motion-Gate (Projektentscheidung) ✅, WCAG: Label in Name
(2.5.3), Fokus sichtbar (2.4.7), Nicht-Text-Kontrast der Status-Punkte ≥ 3:1 (1.4.11), Bewegung von
selbst < 5 s (2.2.2) ✅, kein `npm run dev` gestartet ✅, kein Mojibake (UTF-8 geprueft) ✅

**Auffaelligkeiten (nach Schwere):**

1. 🟠 **Hoch — Puppeteers `clip`-Aufnahme startet CSS-Animationen neu** (`captureBeyondViewport`
   vergroessert kurz das Fenster). Die erste Aufnahme dieser Runde zeigte eine blasse Telefon-Pille
   und KEINE Schaden-Pille — sah aus wie ein Renderfehler, war ein Aufnahmefehler. Die Pixelprobe
   von `check-aussparung.mjs` haette so halb eingeblendete Pillen gemessen. ✅ **fixed** (O1).
2. 🟠 **Hoch — Die alte Pixelprobe haette die neue helle Pille als Fehler gemeldet.** ✅ **fixed** (O2).
3. 🟡 **Mittel — Kontrastmesser und einmalige Animationen** (Lichtstreif zwischen zwei Aufnahmen). ✅ **fixed** (O3).
4. 🟡 **Mittel — Hover klebt auf Touch ab 1024 px.** ✅ **fixed** (O4).
5. 🟡 **Mittel — Oeffnungszeiten an vier Stellen mit zweierlei Strichen.** ✅ **fixed** (O5).
6. 🟢 **Niedrig — Betriebsferien unbekannt** → Rueckfrage an André (O6, offen).
7. 🟢 **Niedrig — Hinweis ueberdeckt beim Ueberfahren kurz die KI-Plakette** — bewusst (O7).
8. 🟢 **Niedrig — CTA-Verlauf doppelt in index.css.** ✅ **fixed** (O8).

**Refactoring-Empfehlung:** keine offene — die Befunde sind behoben bis auf O6 (braucht Daten vom
Kunden). Beobachten: Die engste Luecke zwischen Reiter und Aussparung liegt bei 1366–1380 px (20,2 px).
Wer dort Navbar-Links ergaenzt oder die Pillen verbreitert, bekommt es von `npm run aussparung`
gemeldet — nicht erst im Bild.
