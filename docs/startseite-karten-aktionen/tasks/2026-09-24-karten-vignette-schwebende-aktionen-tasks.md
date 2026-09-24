# Startseite: Karten ruhiger, Vignette in CI-Schwarzblau, schwebende Aktionen

**Auftrag (User, 2026-09-24), sinngemaess:** Die Karten der Startseite wirken zu unruhig.
1. In den weissen Textfeldern der Leistungsuebersicht („Unsere Leistungen rund ums Fahrzeug")
   sitzt weit unten ein **Weissuebergang** — weg damit.
2. Um das Kartenbild eine **Vignette ringsum**, aufgeklappt UND eingeklappt, fuer eine saubere
   Abgrenzung. **Nicht schwarz**, sondern in den Farben aus „Fuer wen wir arbeiten".
   Fuer **alle Karten der Seite**.
3. **„Anrufen" und „Schaden melden" als schwebende, fixierte Knoepfe** auf der Seite.

**Befund vor dem Umbau (gegen den Code gelesen):**
* Der Weissuebergang ist ein weisser Verlauf (`h-6`, weiss 92 %) UEBER dem Scrollbereich der
  Textbox in `ExpandingCardAccordion`. Die Textbox ist selbst weiss 92 % — der Verlauf legt eine
  zweite Schicht darueber, das Feld wird unten sichtbar heller. **Genau dieses Band hat das
  Projekt am 2026-09-17 fuer die Zielgruppenkarten schon geloest** (`styles/scrollverlauf.css`:
  Maske statt weisser Flaeche, nur wenn der Bereich wirklich scrollt) — die Leistungskarten haben
  die Loesung nie bekommen.
* Farbe aus „Fuer wen wir arbeiten": `--cc-cta-blue-rgb` (62 80 100, #3e5064), das ausgemessene
  Schwarzblau des Knopfverlaufs. Die Zielgruppenkarten nutzen AUSSCHLIESSLICH diesen Ton
  (`.cc-radial-veil-graphite`, `-right`), kein Carbon.
* Bildkarten der Startseite: Leistungsuebersicht und Aufbereitungs-Expertise
  (`ExpandingCardAccordion`, auf-/zuklappbar), Unfall- und Aufbereitungsablauf
  (`ScrollPinnedProcess`), Zielgruppen (`TargetGroupCards` — die Farbvorlage selbst).
  Beide Bildkarten-Komponenten dunkeln heute mit **Carbon (#080b10) von unten** ab.
* Aktionen heute: Navbar ab `xl` (1280) mit zwei Kreisknoepfen, die beim Ueberfahren aufklappen;
  `MobileStickyCTA` unter `lg` (1024). **Zwischen 1024 und 1279 px gibt es gar keine Aktion** —
  dort zeigt die Navbar das Menue, die Leiste ist ausgeblendet.
* ⚠️ `position: fixed` greift in `<main>` NICHT (Transform auf `.site-main-shell`) — neue
  schwebende Elemente muessen neben `<main>` ins `Layout`, wie `MobileStickyCTA`.
* ⚠️ Unten rechts sitzt auf `/karriere` ab `lg` schon das Stellen-Pop-up (`JobPopup`).

---

### ✅ Phase 1 — Vorher-Aufnahmen und Messung
**Ziel:** Den Ist-Zustand festhalten und messen, wo Kartentext wirklich scrollt.
* [x] Bildschirmfotos Leistungsuebersicht, Expertise, Unfallablauf — 1920 × 945, 1440 × 900,
      390 × 844 (iPhone 13): `output/karten/vorher/`. Der Streifen ist deutlich zu sehen: in der
      aufgeklappten Karte „Fahrzeugaufbereitung" direkt ueber „Zur Aufbereitung", heller als der
      Rest der Textbox, weil das Foto dort nicht mehr durchscheint
* [x] Ueberlauf aller **14 Akkordeonkarten** der Startseite (10 Leistungen, 4 Expertise) gemessen,
      in allen drei Fenstern: **keine einzige laeuft ueber** (Textbereich 228–292 px am Desktop,
      129–179 px mobil). Der weisse Verlauf hat auf der Startseite also nie etwas angezeigt — er
      war reine Stoerung
* [x] Mobil gemessen, indem die Karte auf die Hoehe der aufgeklappten gesetzt wurde: Ein Tipp
      folgt in der Puppeteer-Emulation dem Link, weil sie weiter `hover: hover` meldet

### ✅ Phase 2 — Weissuebergang entfernen
* [x] Weissen Verlauf in `ExpandingCardAccordion` entfernt (samt dem nur dafuer noetigen `relative`)
* [x] Scrollbereich traegt `.cc-scroll-verlauf` — blendet nur den INHALT aus und nur, solange er
      scrollt. Auf der Startseite ist damit nichts mehr zu sehen (keine Karte laeuft ueber);
      die Stellenkarten auf `/karriere`, deren Anforderungslisten ueberlaufen, behalten den
      Hinweis — ohne helles Band
* [x] Vorher/Nachher bei 1920 und 390: Band weg, Textbox gleichmaessig durchscheinend
      (`output/karten/vergleich-leistungen-1920.png`, `-390.png`)

### ✅ Phase 3 — Vignette in CI-Schwarzblau, ringsum
* [x] `.cc-karten-vignette` (index.css): 1-px-Innenrand + gleichmaessiger Saum (Innenschatten,
      folgt dem Kartenradius) PLUS Ellipsen-Verlauf, der mit der Kartengroesse waechst — ein fester
      Saum allein haette die 82 px schmalen Streifen komplett eingefaerbt
* [x] Eingebaut in `ExpandingCardAccordion` (aufgeklappt UND eingeklappt), `ScrollPinnedProcess`
      und — „fuer alle Karten" — auch in `TargetGroupCards`, die bisher nur die Verlaeufe oben
      links und rechts hatten; im Stapel zeigt der Rand, wo eine Karte endet
* [x] Carbon-Verlauf von unten in beiden Bildkarten-Komponenten auf Schwarzblau umgestellt und
      abgeschwaecht (0,62 → 0,46 bzw. 0,5 → 0,42): Vignette und Verlauf faerben die Unterkante
      gemeinsam, sonst waere sie fast deckend geworden

### ✅ Phase 4 — Schwebende Aktionen „Anrufen" und „Schaden melden"
> ⚠️ **Ersetzt am 2026-09-24 (zweite Runde, Wunsch des Users):** Die Knoepfe stehen jetzt dauerhaft in
> einer weissen Aussparung **oben rechts**, die Navbar hat keine Aktionsknoepfe mehr, das Ausweichen
> (`useAusweichzone`) ist entfernt, `npm run schwebend` heisst `npm run aussparung`.
> Siehe `2026-09-24-aussparung-oben-rechts-und-suche-tasks.md`. Die Punkte unten beschreiben den Stand
> der ersten Runde.
* [x] `components/SchwebendeAktionen.tsx` ab `lg` unten rechts, im `Layout` neben `MobileStickyCTA`
* [x] Gemeinsamer Hook `hooks/useNaheSeitenende.ts` statt doppelter Scroll-Logik; rechnet jetzt
      auch nach Seitenwechseln per Navbar neu (vorher erst beim naechsten Scrollen)
* [x] `JobPopup` ab `lg` ueber den Knoepfen, rechte Kante buendig
* [x] 🔴 **Erste Fassung kollidierte** — zwei beschriftete Pillen (209 × 106 px):
      `npm run zielgruppen` meldete **6 Befunde** (Versichererliste auf Full HD verdeckt), dazu
      Vertrauensleiste im Hero bei 1280, Textbox der Prozesskarte bei 1024. Umgebaut auf zwei
      Kreise nebeneinander, die ihre Beschriftung beim Ueberfahren ausklappen (Muster der
      Navbar), 104 × 48 px → 1 Befund
* [x] Ausweichen per `data-aktionen-ausweichen` + `hooks/useAusweichzone.ts` (IntersectionObserver
      auf den Streifen der Knoepfe, MutationObserver fuer Seitenwechsel). Markiert: Hero und
      Zielgruppenstapel — die zwei Flaechen, die die Ecke DAUERHAFT belegen. → `npm run
      zielgruppen`: **alle Karten auf allen Fenstern in Ordnung**
* [x] Scroll-Durchlauf Startseite: sichtbar ueber Leistungen, Unfallablauf, Expertise,
      Aufbereitungsablauf, FAQ, Kontakt; weicht aus in den ersten ~200 px des Heros, ueber dem
      Zielgruppenstapel und vor dem Footer
* [x] Ueberdeckungs-Pruefung aller **29 Routen × 3 Fenster** (1920 × 945, 1280 × 800, 1024 × 700),
      Scrollpositionen je halbe Fensterhoehe: **keine dauerhafte Ueberdeckung, kein Text verdeckt.**
      Der erste Lauf meldete 9 Stellen — alle 9 waren grosse Karten-Links (ganze Karte als `<a>`,
      400+ px hoch), die unter den Knoepfen VORBEISCROLLEN. Kriterium geschaerft: dauerhaft ist nur,
      was sich zwischen zwei Messungen nicht mitbewegt. Danach 0
* [x] Zwei Telefonlinks auf das einheitliche Format `tel:+493412617790` gezogen (mobile Leiste,
      Footer) — die uebrigen 25 Stellen nutzten es schon
* [x] Navbar-Knoepfe BLEIBEN (DESIGN.md nennt den Telefon-Knopf als Teil der Navbar). Ab `xl`
      stehen die Aktionen damit doppelt — **Rueckfrage an den User**, ob sie aus der Navbar sollen
* [x] **Zusaetzlich:** `.cc-karten-vignette` nach `styles/karten.css` ausgelagert — `index.css`
      stand damit bei 697 von hoechstens 700 Zeilen, jetzt 665. Im ausgelieferten CSS nachgeprueft
      (die `@import`-Falle aus dem Kopf von index.css haette die Datei still weglassen koennen)

### ✅ Phase 5 — Verifikation
* [x] `npm run build`: Typen gruen, 29/29 Routen vorgerendert, Dummy- und FAQ-Waechter gruen;
      `.cc-karten-vignette` steht im ausgelieferten CSS (die `@import`-Falle greift nicht)
* [x] `npm run kontrast`: **5189 Textstellen, keine unter WCAG AA**
* [x] `npm run zielgruppen`: **alle Karten auf allen 15 Fenstern in Ordnung** — nach der Vignette
      in den Zielgruppenkarten erneut gelaufen
* [x] `npm run schwebend` (neu): Probelauf `/` und `/karriere` × 3 Fenster gruen; Knoepfe sichtbar an
      72–76 % (Startseite) bzw. 89–96 % (`/karriere`) der Positionen. Der Vollauf ueber 29 Routen lief
      mit der Vorfassung des Skripts (0 dauerhafte Ueberdeckungen)
* [x] Aufnahmen: `output/karten/` (vorher/nachher, 1920/1440/390), `output/schwebend/`

### ✅ Phase 6 — Dokumentation
* [x] Kommentarsektion unten, Optimierungsplan
      `2026-09-24-karten-vignette-schwebende-aktionen-optimierung-tasks.md` (O1, O4 erledigt; O2, O3
      warten auf den User)
* [x] `CLAUDE.md`: `npm run schwebend` in der Messwerkzeug-Tabelle

**Referenzen:**
`components/SchwebendeAktionen.tsx`
`components/ExpandingCardAccordion.tsx`
`hooks/useAusweichzone.ts`

---

## Kommentare

### Phasen 1–4
**Eingehalten**: Planung vor Code ✅, gemessen statt geschaetzt (Ueberlauf je Karte, Kollisionen per
Waechter und Scan) ✅, Mobile-First geprueft (390, iPhone-Emulation) ✅, unter 700 Zeilen je Datei ✅
(`index.css` durch Auslagerung von 697 auf 665), bestehende Loesungen wiederverwendet statt neu
erfunden (`.cc-scroll-verlauf`, Navbar-Knopfmuster, `--cc-cta-blue`) ✅, kein `npm run dev` ✅,
DESIGN.md respektiert (Navbar-Knoepfe bleiben) ✅

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch — die erste Fassung der schwebenden Knoepfe verdeckte Inhalt.** Zwei beschriftete
   Pillen (209 × 106 px) lagen auf Full HD ueber der Versichererliste (`npm run zielgruppen`:
   **6 Befunde**), bei 1280 ueber der Vertrauensleiste des Heros, bei 1024 ueber der Textbox einer
   Prozesskarte. Ursache: Die Seite besteht aus bildschirmhohen Buehnen mit Inhalt bis in die rechte
   untere Ecke. ✅ **fixed**: kompakte Kreise im Navbar-Muster (ein Viertel der Flaeche) plus
   Ausweichen ueber den zwei Flaechen, die die Ecke DAUERHAFT belegen. Waechter gruen, Scan 0.
   **Lehre:** Ein schwebendes Element ist eine Behauptung ueber JEDE Seite in JEDEM Fenster — ohne
   Scan ueber alle Routen haette nur die Startseite auf Full HD als Beleg gedient.

2. 🟠 **Hoch — zwischen 1024 und 1279 px gab es gar keine sichtbare Aktion.** Die Navbar zeigt
   ihre Aktionsknoepfe erst ab `xl`, die mobile Leiste ist ab `lg` ausgeblendet. Dort lag bisher
   nur das Menue. ✅ **fixed** durch die schwebenden Knoepfe (ab `lg`).

3. 🟠 **Hoch — der Weissuebergang stand immer, ohne je etwas anzuzeigen.** Gemessen: Auf der
   Startseite laeuft keine der 14 Akkordeonkarten ueber (1920, 1440, 390). Die Loesung dafuer
   (`.cc-scroll-verlauf`) lag seit dem 2026-09-17 im Projekt, die Karten hatten sie nie bekommen.
   ✅ **fixed**.

4. 🟡 **Mittel — `useNaheSeitenende` rechnete nach einem Seitenwechsel per Navbar nicht neu.**
   Stand schon so in `MobileStickyCTA`; gefunden im Scroll-Durchlauf. ✅ **fixed**
   (`carcare:navigate` und `popstate`).

5. 🟡 **Mittel — zwei Telefonlinks im Format `tel:0341…`** (mobile Leiste, Footer), 25 Stellen im
   internationalen Format der SEO-Standards. ✅ **fixed**.

6. 🟡 **Mittel — drei Fallen in den eigenen Messskripten**, festgehalten fuer das naechste Mal:
   (a) Puppeteers iPhone-Emulation meldet weiter `hover: hover` — ein Tipp auf eine Akkordeonkarte
   folgt dem Link, statt sie aufzuklappen; (b) Git Bash schreibt Routen in Umgebungswerten zu
   Windows-Pfaden um (`MSYS_NO_PATHCONV=1`, wie im Kopf von `shots.mjs` beschrieben); (c) ein
   Persistenzkriterium „an zwei Messpunkten verdeckt" haelt grosse, vorbeiscrollende Karten-Links
   fuer gepinnt — richtig ist „verdeckt UND nicht mitbewegt". Alle drei ✅ im Skript behoben.

7. 🟢 **Offen, Entscheidung User:** Ab `xl` stehen „Anrufen" und „Schaden melden" doppelt (Navbar +
   schwebend). Die Navbar-Knoepfe sind laut DESIGN.md Teil der Navbar und bleiben bis zur Antwort.

**Optimierungsplan:** `docs/startseite-karten-aktionen/tasks/2026-09-24-karten-vignette-schwebende-aktionen-optimierung-tasks.md`
