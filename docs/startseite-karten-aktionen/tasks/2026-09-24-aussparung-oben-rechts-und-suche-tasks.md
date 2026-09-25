# Aktionen oben rechts in einer Aussparung, Navbar ohne Aktionsknoepfe, globale Suche

**Auftrag (User, 2026-09-24, zweite Runde):**
1. Die schwebenden Knoepfe „Anrufen" und „Schaden melden" sind erst nach dem Hero zu sehen. Sie
   sollen **sofort** und **immer rechts oben** stehen — beide in einer **weissen Aussparung
   („Punchhole") mit denselben Rundungen** wie sonst.
2. Die beiden Aktionsknoepfe **komplett aus der Navbar** nehmen.
3. **Globale Suche in die Navbar, rechts neben „Kontakt"** — ueber das Suchfeld soll man alles auf
   der Seite finden.

**Vorgaenger:** `2026-09-24-karten-vignette-schwebende-aktionen-tasks.md` (Phase 4 dort wird hiermit
ersetzt: kein Ausweichen, kein Ausblenden mehr).

**Nachfolger (dritte Runde, gleicher Tag):** `2026-09-24-aussparung-beschriftete-aktionen-tasks.md` —
die zwei Symbolkreise waren „zu unscheinbar und nicht selbsterklaerend"; jetzt beschriftete Pillen.
⚠️ Die Reiterbreiten unten (580 / 810–840 / 1000) gelten NICHT mehr: 440–580 / 740–840 / 940–1000,
Navbar-Links 1280–1535 enger. Aktuelle Werte: `styles/aussparung.css`, Abschnitt REITERBREITE.

**Gemessen vor der Planung (ausgeliefertes HTML, Puppeteer):**

| Fenster | Navbar-Reiter | frei rechts daneben |
|---|---|---|
| 1920 × 945 | 1000 px | 444 px |
| 1536 × 730 | 1000 px | 252 px |
| 1440 × 900 | 1000 px | 205 px |
| 1366 × 657 | 1000 px | 169 px |
| 1280 × 800 | 1000 px | 127 px |
| 1024 × 700 | 1000 px | 0 px |

Die Aussparung braucht mit ihren konkaven Uebergaengen rund 200 px (konkaver Uebergang der Navbar
28 + Abstand + eigener Uebergang 28 + Koerper 130). **Unter 1440 px passt sie nicht neben einen
1000 px breiten Reiter.** Die Navbar-Links sitzen aber von der Mitte aus positioniert (`right: calc(50%
+ 124px)`), der Reiter hat Luft: links reichen die Links bis 388 px von der Mitte.
Die KI-Plakette des Heros steht bei y 125–147, also unter dem 100-px-Band der Navbar — eine
Aussparung in Navbar-Hoehe verdeckt sie nicht.

**Entscheidungen:**
* Aussparung ab `lg` (1024), Hoehe = Navbar (100 px), buendig in der Ecke: konkaver Uebergang links
  oben in den oberen Rahmen, runde Ecke links unten (24 px), konkaver Uebergang rechts unten in den
  rechten Rahmen — dieselben Masse wie die Navbar (`--cc-nav-radius` 24, `--cc-nav-inner-radius` 28).
* Reiterbreite ueber `--cc-nav-width`: ab 1440 **1000 px** (unveraendert), 1280–1439 **840 px**,
  1024–1279 **580 px** (dort zeigt die Navbar nur Logo, Suche und Menue). Der Navbar-Inhalt folgt
  derselben Variable statt `max-w-[1000px]`. Mega-Menue von der Reiterbreite entkoppelt.
* Unter 1024 bleibt die Aktionsleiste unten (Daumenreichweite); oben rechts sitzt dort das Menue.
* In der Aussparung keine aufklappenden Beschriftungen (die Aussparung wuerde in die Navbar wachsen),
  sondern Hinweise unter dem Knopf — beim Telefon mit der Nummer, weil `tel:` am Desktop oft nichts tut.
* Suche: Index beim Build aus dem **gerenderten** Inhalt jeder Seite — im Prerender, der den Browser
  ohnehin offen hat (inkl. Vercel-Sonderweg). Abschnitte mit Anker, FAQ aus dem FAQPage-JSON-LD.
  Suchdialog wie der Anfrage-Dialog (Portal, Lenis angehalten, Fokusfalle). Treffer springen per
  `pushState` zur Seite und zum Anker.

---

### ✅ Phase 1 — Navbar: Aktionsknoepfe raus, Reiterbreite, Mega-Menue
* [x] „Schaden melden" (links) und „Anrufen" (rechts) aus der Desktop-Navbar entfernt, samt der drei
      `navAction*`-Klassen und der nicht mehr gebrauchten Importe
* [x] Die beiden Knoepfe im mobilen Menue ebenfalls entfernt („komplett") — unter `lg` hat die Leiste
      unten beide, ab `lg` die Aussparung; das Menue wiederholte sie nur
* [x] `--cc-nav-width` je Breite (`styles/aussparung.css`), Navbar-Inhalt auf dieselbe Variable statt
      `max-w-[1000px]`. ⚠️ Grundwert UND Abweichungen in derselben Datei: Importe kommen vor den
      Regeln von index.css, ein Grundwert dort haette die Medienregeln ueberschrieben
* [x] Konkave Navbar-Uebergaenge ab 1024 statt 1080
* [x] Mega-Menue entkoppelt: `min(1000px, 100vw − 3rem)`, symmetrischer Einzug von der Mitte aus
      (Framer setzt `transform` selbst, eine Translate-Klasse waere ueberschrieben worden)

### ✅ Phase 2 — Aktions-Aussparung oben rechts
* [x] `components/AktionsAussparung.tsx` (ersetzt `SchwebendeAktionen`), im Seitenrahmen des `Layout`
      neben dem Navbar-Reiter. Knoepfe im Stil der frueheren Navbar-Aktionen (44 px, Radius 20);
      statt aufklappender Beschriftung ein Hinweis unter dem Knopf — beim Telefon mit der Nummer
* [x] `styles/aussparung.css`: weisse Flaeche buendig in der Ecke, konvexe Ecke links unten (24 px),
      konkave Uebergaenge per `::before` (in den oberen Rahmen) und `::after` (in den rechten Rahmen),
      Schatten wie der Navbar-Reiter
* [x] Immer sichtbar ab `lg` — kein Ausweichen, kein Ausblenden vor dem Footer
* [x] Entfernt: `useAusweichzone`, `data-aktionen-ausweichen` (Hero, Zielgruppen), die Anhebung des
      `JobPopup`; `useNaheSeitenende` bleibt (nutzt die mobile Leiste)
* [x] `check-schwebend.mjs` → `check-aussparung.mjs` (`npm run aussparung`), CLAUDE.md-Zeile
* [x] **Gemessen, zwei Runden** (Puppeteer, 7 Fenster). Erste Runde: Luecke zwischen den konkaven
      Uebergaengen von Navbar und Aussparung bei 1440 nur 10 px, bei 1280 nur 11 px — ein Schlitz.
      Zweite Runde (Reiter 810–840 px bis 1535, Aussparung 12 px schlanker, Suchfeld erst ab 1536):

      | Fenster | Reiter | Aussparung | Luecke | Nav im Reiter | KI-Plakette frei |
      |---|---|---|---|---|---|
      | 1920 | 1000 | 146 × 100 | 258 px | ja | ja |
      | 1536 | 1000 | 145 × 100 | 67 px | ja | ja |
      | 1440 | 840 | 144 × 100 | 100 px | ja | ja |
      | 1366 | 840 | 144 × 100 | 63 px | ja | ja |
      | 1280 | 810 | 143 × 100 | 36 px | ja | ja |
      | 1024 | 580 | 140 × 100 | 26 px | ja | ja |
      | 390 | 280 | — (Leiste unten) | — | ja | ja |

### ✅ Phase 3 — Suchindex beim Build
* [x] `scripts/lib/suchindex.mjs`: Auszug je Seite im Browser — Titel ohne Markenzusatz, Meta-
      Beschreibung, je Sektion Ueberschrift + Anker + Text (ohne `aria-hidden`, Platzhalter, `display:
      none`, Handlungsknoepfe, KI-Plaketten), FAQ aus dem FAQPage-JSON-LD, FAQ-Sektion nicht doppelt
* [x] Im Prerender je Route nach dem Durchscrollen aufgerufen → `dist/suchindex.json` und (fuer den
      Dev-Server, in .gitignore wie `public/sitemap.xml`) `public/suchindex.json`
* [x] Build bricht, wenn eine Seite fehlt, keinen Titel hat oder unter 200 Zeichen Text liefert
* [x] Ergebnis: **29 Seiten, 128 Abschnitte, 118 FAQ, 135 KB** — geladen erst beim ersten Oeffnen

### ✅ Phase 4 — Suchdialog und Einstieg in der Navbar
* [x] `lib/suche.ts`: Vergleichsform (klein, ß → ss, Umlautpunkte weg), Suchwoerter mit Variante
      ae/oe/ue → a/o/u, UND-Suche, Gewichtung (Titel 10, Seitentitel 4, Text 1, Wortanfang +3, ganze
      Anfrage +6), hoechstens 3 Treffer je Seite, gleichnamige Abschnitte nur einmal, Ausschnitt
      wortweise markiert
* [x] `components/SuchDialog.tsx`: Portal, Combobox-Muster (↑ ↓ Enter, `aria-activedescendant`),
      Strg/⌘+K und „/", Escape, Fokusfalle, Lenis angehalten, „Haeufig gesucht" ohne Eingabe, Hinweis
      mit Telefonnummer ohne Treffer, Sprung per `pushState` bzw. direkt auf derselben Seite
* [x] Einstieg rechts neben „Kontakt": ab 1536 als Feld „Suchen …", darunter als Kreis; unter `xl`
      LINKS im Reiter (rechts neben dem Menue ragte ein Knopf mobil 34 px ins Logo)
* [x] **Stichproben** (alle bestanden): „aussenaufbereitung" und „Außenaufbereitung" → Außenaufbereitung
      zuerst · „leasingrückgabe" → Leasingrueckgabe · „schaeden versicherung" findet „Schäden" ·
      „hagel" → Hagelschaden · „ausbildung" → Karriere · „öffnungszeiten" → Kontakt · „Wie lange
      dauert" → zwei FAQ-Antworten · „xqzv" → „Keine Treffer" · ↓ ↓ Enter oeffnet die Seite ·
      Strg+K oeffnet, Escape schliesst · mobil 20 Treffer fuer „lackierung"

### ✅ Phase 5 — Verifikation
* [x] `npm run build`: Typen gruen, 29/29 vorgerendert, Suchindex 29 Seiten / 128 Abschnitte / 118 FAQ
* [x] `npm run nav`: **16/16** (Mega-Menue per Maus und Tastatur, mobiles Menue, dritte Ebene)
* [x] `npm run kontrast`: **5212 Textstellen, keine unter WCAG AA**
* [x] `npm run zielgruppen`: **alle Karten auf allen 15 Fenstern in Ordnung**
* [x] `npm run aussparung`: **29 Routen × 3 Fenster ohne dauerhafte Ueberdeckung**, Aussparung an 100 %
      der Positionen sichtbar; nach Einbau der Pixelprobe auf 3 Routen erneut gruen
* [x] Aufnahmen: Kopfbereich in 7 Breiten (`output/kopf/`), Hinweis beim Ueberfahren, Suchdialog
      Desktop und mobil (`output/suche/`), Mega-Menue bei 1440 (`output/nav-shots/`)
* [x] 🔴 **Im Bild gefunden, nicht vom Waechter: rechter Knopf der Aussparung um ~15 px angeschnitten**
      (weisser Schatten von `::after` lag darueber). Behoben mit `z-[1]`. Der Pruefer bekam daraufhin
      eine Pixelprobe — Gegenprobe auf dem alten Stand ROT, auf dem neuen GRUEN. Ein Treffertest haette
      es NICHT gefunden: Schatten nehmen am Treffertest nicht teil
* [x] 🔴 **Anker-Sprung nach Seitenwechsel landete zu frueh** — `/kontakt` → `/#faq` blieb bei y 2354
      (Maximalhoehe von /kontakt) stehen: Lenis kannte noch die Grenze der alten Seite. Betraf auch
      Navbar-Links auf Startseiten-Anker. `App.tsx`: `lenis.resize()` vor dem Sprung, am Ende einmal
      nachjustieren. Nachgemessen: drei Wege, Anker-Oberkante jeweils 88 px
* [x] **Suchqualitaet an 36 Kundenbegriffen gemessen:** 0 Treffer fuer „Leihwagen", „Mietwagen",
      „Parkschaden", „Azubi", obwohl angeboten → kleine Synonymliste (`lib/suche.ts`). „Rauch" fand
      16-mal „ge*brauch*t" → kurze Woerter zaehlen im Titel nur am Wortanfang, reine Teilwort-Treffer
      kurzer Woerter fallen weg; jetzt 1 echter Treffer. „Inspektion", „Reifen", „Oldtimer" bleiben
      bewusst leer (nicht im Angebot) — der Dialog verweist aufs Telefon

### ✅ Phase 6 — Dokumentation
* [x] Kommentarsektion unten, Optimierungsplan `2026-09-24-aussparung-oben-rechts-und-suche-optimierung-tasks.md`
* [x] CLAUDE.md: Zeile `npm run aussparung` (ersetzt `schwebend`), Abschnitt „Globale Suche"
* [x] Vorgaenger-Planung: Phase 4 als ersetzt markiert

**Referenzen:**
`components/Navbar.tsx`
`components/AktionsAussparung.tsx`
`components/SuchDialog.tsx`

---

## Kommentare

### Phasen 1–5
**Eingehalten**: Planung vor Code ✅, Geometrie gemessen statt geschaetzt (zwei Runden, 7 Fenster) ✅,
Mobile-First (390, iPhone-Emulation, Suche links statt ueber dem Logo) ✅, unter 700 Zeilen je Datei ✅
(`index.css` 671 — Reiterbreite und Aussparung in eigene Datei), DESIGN.md-Formensprache
(Navbar-Rundungen 24/28, Verlaufsknoepfe) ✅, Pflichtfrage vor jedem Pruefskript beantwortet ✅,
Gegenprobe gegen den alten Stand ✅, kein `npm run dev` ✅

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch — Anker-Sprung nach Seitenwechsel landete bis zu 13 000 px zu frueh** (bestand schon
   vorher, betraf Navbar-Links auf Startseiten-Anker; sichtbar geworden durch die Suche). ✅ **fixed**
   in `App.tsx`, an drei Wegen nachgemessen.
2. 🔴 **Kritisch — rechter Knopf der Aussparung angeschnitten**, der Waechter war gruen. ✅ **fixed** +
   Pixelprobe im Waechter. **Lehre:** Treffertests sehen keine Farbe. Was gemalt wird (Schatten,
   Verlaeufe, Pseudo-Elemente), prueft nur ein Bild — oder eine Pixelprobe.
3. 🟠 **Hoch — die Aussparung passte nicht neben den 1000-px-Reiter** unter 1440 px; erste Fassung mit
   10–11 px Schlitz bei 1280/1440. ✅ **fixed**: Reiterbreite je Fenster, Luecke jetzt 26–258 px.
4. 🟠 **Hoch — Such-Einstieg mobil haette 34 px ins Logo geragt.** ✅ **fixed**: links im Reiter.
5. 🟠 **Hoch — Suchqualitaet**: gleichnamiger Expertise-Block 20-mal, Knopfbeschriftungen im
   Ausschnitt, Kundenworte ohne Treffer, Teilwort-Fehltreffer. ✅ **fixed** (Zusammenfassen gleichnamiger
   Abschnitte, `.cc-gradient-button` aus dem Index, Synonyme, Wortanfang-Regel fuer kurze Woerter).
6. 🟡 **Mittel — alter Suchbegriff blieb beim erneuten Oeffnen stehen**, neuer Text hing sich an.
   ✅ **fixed**: markiert, Tippen ersetzt ihn.
7. 🟡 **Mittel — Mega-Menue waere mit dem Reiter auf 840 px geschrumpft.** ✅ **fixed**: entkoppelt,
   ohne Translate-Klasse (Framer setzt `transform` selbst).
8. 🟡 **Mittel — Fallen im Werkzeug-Transport, fuer kuenftige Sitzungen:** `̀` in Code wurde als
   unsichtbares Kombinationszeichen geschrieben (per `chr(92)` behoben); `
` in Template-Strings als
   echter Zeilenumbruch; `DOMRect` kommt aus `page.evaluate` als `{}` zurueck; Dreifachklick markiert in
   Puppeteer ein Suchfeld nicht vollstaendig.
9. 🟢 **Niedrig — Seitentitel in Treffern sind die SEO-Titel** („Hagelschadenreparatur Leipzig | Audatex").
   Lesbar, aber lang. → Optimierungsplan O1.

**Referenzen:**
`components/SuchDialog.tsx`
`lib/suche.ts`
`styles/aussparung.css`
