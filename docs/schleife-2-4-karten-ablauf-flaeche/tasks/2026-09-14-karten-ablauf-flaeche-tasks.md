# 2.1 Kartenflächen · 2.3 Ablauf-Animation · 4.2 Betriebsfläche

**Angelegt:** 2026-09-14
**Branch:** `2026-09-14-karten-ablauf-flaeche`, abgezweigt von `2026-09-10-schleife-4-sofortpaket`

**Auftrag (User, wörtlich sinngemäß):**
1. Alle Punkte aus Schleife 1–4, die mit **Fotos**, **Texten** und **Logos** zu tun haben,
   in Kategorien zusammenfassen — als Entscheidungsgrundlage.
2. Eine **eigene Kategorie nur für Pricing**.
3. **2.1 umsetzen.**
4. **2.3 prüfen**, wie es mit dem Animieren steht.
5. **4.2 umsetzen** — „anstatt 3.000 Quadratmeter wirklich 3.500 Quadratmeter".
6. Alles Übrige wird danach besprochen.

---

## Warum diese Basis und nicht `main`

4.2 ist ein Schleife-4-Punkt. Das Sofortpaket dieser Schleife (4.5, 4.6, 4.11, 4.12,
4.15, 4.16, 4.17, 4.20) liegt auf `2026-09-10-schleife-4-sofortpaket` und ist **nicht in
`main`**. Es fasst genau die Dateien an, die 4.2 ebenfalls braucht — `CLAUDE.md`,
`SEO-GEO-STANDARDS.md`, `data/historie.ts`, `pages/UeberUnsPage.tsx`. Auf `main`
gearbeitet hätte 4.2 garantiert Konflikte erzeugt. Deshalb zweigt dieses Paket von der
Schleife-4-Branch ab.

## Entscheidung zu 4.18 — bewusst mitgenommen

4.18 (Zeitstrahl-Station 2013) war **ausschließlich** durch die 4.2-Frage blockiert. Der
Wortlaut des Kunden liegt vor und nennt selbst „über 3.500 m²". Der Kommentar in
`data/historie.ts:17` sagt es wörtlich: *„Bis 4.2 entschieden ist, würde der Zeitstrahl
sonst der eigenen Seite widersprechen."* Mit der Antwort des Users ist der Widerspruch
weg. 4.18 hier mitzuziehen ist keine neue Entscheidung, sondern dieselbe, dort angewandt,
wo sie gewartet hat. **4.19 bleibt Platzhalter** — dort fehlt das Jahr, und ein geratenes
Jahr sieht aus wie eine geprüfte Angabe.

---

### ✅ Phase 1 — Kategorien für die Entscheidung (Fotos · Texte · Logos · Pricing)
**Ziel:** Der User will nicht Punkt für Punkt entscheiden, sondern nach Art der
Zulieferung. Dafür werden alle vier Schleifen plus die R-Befunde neu geschnitten.

* [x] Vier Kategorien-Tabellen erstellt: **Fotos & Video**, **Texte**, **Logos &
      Freigaben**, **Pricing**
* [x] Dopplungen zusammengezogen statt doppelt gelistet (2.14 = R2, 2.15 = 3.29,
      2.21 = 3.4, 2.2 = 3.6, 4.4 = 4.10, 1.18 = 2.26)
* [x] Je Zeile: Schleife, Verantwortlicher, was konkret fehlt
* [x] Als eigene Datei abgelegt, damit sie ohne diese Sitzung lesbar bleibt

**Referenzen:**
`docs/schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md`

---

### ✅ Phase 2 — 4.2: Betriebsfläche auf über 3.500 m²
**Ziel:** Der Kunde nennt in 4.2 **und** 4.18 unabhängig voneinander 3.500 m². Das ist
keine Korrektur eines Tippfehlers, sondern eine neue Angabe. Sie ersetzt die bisher
verbindliche Textregel 4.

* [x] `CLAUDE.md` Textregel 4 auf „über 3.500 m²" — **zuerst**, sonst widerspricht
      die Regel der Umsetzung
* [x] `SEO-GEO-STANDARDS.md`: `USP_ERWEITERT` und `USP_BAUSTEINE`
* [x] Alle sichtbaren Fundstellen in `components/`, `pages/`, `data/`
* [x] Strukturierte Daten (`seo/pageSchemas.ts`) — sonst widerspricht das Schema dem
      sichtbaren Text (SEO-Standard 5: nur Sichtbares auszeichnen)
* [x] ⚠️ **`pages/DatenschutzPage.tsx` NICHT anfassen** — dort steht „3.000 Zeichen",
      keine Fläche. Ein globales Ersetzen hätte genau hier danebengegriffen.
* [x] ⚠️ **`.claude/worktrees/` NICHT anfassen** — fremde Sitzungen
* [x] 4.18 mitziehen: Station 2013 im Zeitstrahl, Wortlaut des Kunden
* [x] `istPlatzhalter` bei Station 2013 entfernen **und** den Titel aus der
      `ANERKANNT`-Liste in `scripts/check-dummies.mjs` nehmen, sonst bricht der Build
* [x] Meta-Längen gegenprüfen (`npm run meta`) — „3.000"→„3.500" ist zeichengleich,
      das muss aber gemessen und nicht angenommen werden

---

### ✅ Phase 3 — 2.1: Kartenflächen vereinheitlichen
**Ziel:** „Karten-Styling: transparent statt weiß, Transparenz so justieren dass
Lesbarkeit erhalten bleibt – einheitlich über gesamte Seite."

**Befund vor der Umsetzung — drei Flächen nebeneinander:** `bg-white`,
`bg-gray-50` und `bg-gray-50/70` stehen gemischt in acht Kartenkomponenten. Genau das
ist die Uneinheitlichkeit, die der Kunde sieht.

* [x] Eine Quelle für die Kartenfläche statt drei Schreibweisen
* [x] Inhaltskarten auf die durchscheinende Fläche
* [x] **Abgrenzung dokumentieren:** Overlays (Dialog, Popup, Navigation, Mega-Menü)
      bleiben deckend — eine durchscheinende Fläche über beliebigem Seiteninhalt ist
      nicht lesbar und wäre das Gegenteil der Vorgabe
* [x] `npm run kontrast` **nach** der Änderung — Pflicht nach jeder Transparenzänderung

---

### ✅ Phase 4 — 2.3: Ablauf-Sektionen im Zeitstrahl-Stil animieren
**Ziel:** „Alle Zeitstrahl- und Prozessdarstellungen einheitlich im Stil ‚Ablauf in fünf
Schritten zum Ziel' animieren."

**Prüfergebnis (Auftrag 4 des Users):** Drei Muster nebeneinander.

| Darstellung | Wo | Animation |
|---|---|---|
| `Timeline` | `/ueber-uns` | ✅ Achse zeichnet sich, Punkte folgen der Linie |
| `ScrollPinnedProcess` | Startseite, `/fahrzeugaufbereitung-leipzig` | ✅ scroll-gepinnt |
| `ProcessList` | 7 Sektionen auf 6 Seiten | ❌ **statisches Raster, keine Animation** |

* [x] Timing und Varianten aus `Timeline` in eine gemeinsame Quelle
* [x] `ProcessList` bekommt Achse + der Reihe nach erscheinende Punkte
* [x] Senkrecht auf schmalen Schirmen, waagerecht ab Breakpoint — Mobile-First
* [x] ⚠️ **Die Falle aus `Timeline` nicht zurückholen:** `whileInView` darf nicht auf
      demselben Element sitzen, das auf `scale: 0` startet. Beobachtet wird der Träger,
      Punkt und Karte erben über `variants`.

---

### ✅ Phase 5 — Messen und Backlog nachziehen
* [x] `npm run build`
* [x] `npm run kontrast`
* [x] `npm run meta`
* [x] Backlog: 2.1, 2.3, 4.2, 4.18 auf den neuen Stand
* [x] Befunde in den Optimierungsplan

---

## Messwerte am Ende des Pakets

| Werkzeug | Ergebnis |
|---|---|
| `npm run build` | 29/29 Routen prerendert, 236 FAQPage-Texte im HTML, Typecheck sauber |
| `npm run kontrast` | **5147 Textstellen** auf 29 Routen × 2 Breiten × 4 Positionen — **0 unter WCAG AA** *(Schlusslauf nach der CSS-Auslagerung)* |
| `npm run meta` | 0 Titles und 0 Descriptions außerhalb 50–60 / 140–160 |
| `npm run dummies` | 29 Seiten, keine unbekannten Platzhalter; Zeitstrahl noch **1** statt 2 |
| Ausgeliefertes CSS | `.cc-guard-wide` und `.cc-karte` vorhanden, **vor** den Tailwind-Utilities |
| Zeilenlimit | `index.css` 689 · `PageBlocks.tsx` 368 · `Timeline.tsx` 226 · alle unter 700 |
| Sichtprüfung | `/privatkunden` Desktop 1440 + mobil 390 · `/ueber-uns` Desktop 1440 |

---

## Kommentare

### Phase 1 — Kategorien
**Eingehalten**: keine neuen Nummern vergeben ✅, Dopplungen zusammengezogen statt doppelt
gelistet ✅, jede Zeile mit Backlog-Nummer rückverfolgbar ✅, Encoding UTF-8 geprüft ✅

**Auffälligkeiten:**
1. 🟡 **Mittel: Sechs Punktpaare sind inhaltlich derselbe Punkt** — 2.14=R2, 2.15=3.29,
   2.21=3.4, 2.2=3.6, 4.4=4.10, 1.18=2.26. Wer nach Schleife sortiert anfragt, fordert
   dieselbe Lieferung zweimal an. In den Kategorien sind sie zusammengezogen.
2. 🟢 **Niedrig: 4.13 nennt eine falsche Verbandslangform.** Steht schon in `schleife-4.md`,
   hier nochmals in der Logo-Kategorie, weil dort die Entscheidung fällt.

### Phase 2 — 4.2 Betriebsfläche
**Eingehalten**: Textregel zuerst geändert dann Code ✅, strukturierte Daten mitgezogen ✅,
Wächter-Liste nachgezogen ✅, gemessen statt geschätzt ✅, fremde Worktrees unangetastet ✅

**Auffälligkeiten:**
1. 🟠 **Hoch: Ein globales Ersetzen von „3.000" hätte danebengegriffen.**
   `pages/DatenschutzPage.tsx` nennt „rund 23.000 Zeichen" — eine Textlänge. Nur die Muster
   „3.000 m²" und „3.000 Quadratmeter" treffen. Als Falle in `CLAUDE.md` Textregel 4 notiert.
2. 🟡 **Mittel: `node_modules` war nicht auf dem Stand des Pulls.** Der erste Build brach an
   `react-email` und `nodemailer` — beide kamen mit den drei Netcup-Commits in `main`.
   **Nicht durch diese Änderung verursacht.** `npm install` behebt es; wer nach dem Pull
   ohne Install baut, sieht denselben Fehler.
3. 🟢 **Niedrig: 4.18 war nur durch 4.2 blockiert** und ist mitgenommen — Begründung oben.

**Referenzen:**
`CLAUDE.md`
`data/historie.ts`
`scripts/check-dummies.mjs`

### Phase 3 — 2.1 Kartenflächen
**Eingehalten**: eine Quelle statt drei Schreibweisen ✅, CSS-nativ vor JavaScript ✅,
Kontrast gemessen statt geschätzt ✅, Mobile mitgeprüft ✅, unter 700 Zeilen ✅

**Auffälligkeiten:**
1. 🟠 **Hoch: Die Ursache der Uneinheitlichkeit war eine Komponenten-Stütze.** `FeatureGrid`
   hatte `tone="solid" | "translucent"`. Damit entschied der **Aufrufer**, ob eine Karte
   weiß oder durchscheinend ist — dieselbe Karte sah auf zwei Seiten verschieden aus, je
   nachdem, ob jemand die Stütze gesetzt hatte. Genau das beschreibt 2.1. Die Stütze ist
   entfernt; „einheitlich" ist jetzt eine Eigenschaft des Codes, keine Bitte an den nächsten.
2. 🟡 **Mittel: Verschachtelte Karten wären unsichtbar geworden.** Die drei Kontaktkästen auf
   der Startseite liegen **in** einem Panel. Gleiche Fläche auf gleicher Fläche ergibt keine
   Kante. Deshalb zwei Stufen aus **einem** Alpha: `.cc-karte` (soft-ice) und
   `.cc-karte-hell` (weiß). Wer nur eine Klasse gebaut hätte, hätte es erst im Review gesehen.
3. 🟢 **Niedrig: Abgrenzung nötig und dokumentiert.** Overlays (Dialog, Stellen-Popup,
   Navigation, Mega-Menü) und Bedienelemente (Zeitstrahl-Punkte, Knopf-Pillen, Logo-Chips)
   bleiben deckend. Eine durchscheinende Fläche über beliebigem Seiteninhalt wäre unlesbar
   und damit das Gegenteil der Vorgabe. Chips und Abzeichen sind keine Karten und wurden
   bewusst nicht angefasst — siehe Optimierungsplan, Punkt 1.

**Referenzen:**
`index.css`
`components/PageBlocks.tsx`
`components/ContactCTA.tsx`

### Phase 4 — 2.3 Ablauf-Animation
**Eingehalten**: gemeinsame Quelle statt zweiter Kopie ✅, dokumentierte Framer-Falle nicht
zurückgeholt ✅, Mobile-First (senkrecht zuerst) ✅, semantisches `<ol>` ✅, unter 700 Zeilen ✅

**Auffälligkeiten:**
1. 🟠 **Hoch: `npm run shots` konnte den fertigen Zustand nie aufnehmen.** Das Skript wartete
   nach dem Scrollen **550 ms**; die Achsen-Animation endet erst bei rund **1,83 s**
   (Achse 1,1 s + letzter Punkt 1,22 s + Karte 0,16 s + 0,45 s Dauer). Die erste Aufnahme der
   Ablauf-Sektion zeigte Karte 1 fertig, Punkt 2 halb, die Karten 3 und 4 **gar nicht** — das
   sah aus wie ein Layoutfehler und war ein Aufnahmefehler.
   **⚠️ Das galt rückwirkend auch für `/ueber-uns`:** Der Zeitstrahl animiert seit 2026-09-04
   mit denselben Werten. Jede Review-Aufnahme dieser Sektion seit dem Tag zeigte einen halb
   gezeichneten Zeitstrahl. Behoben: `BERUHIGUNG = 2100` mit Begründung im Skriptkopf.
   **Das ist genau der Fall aus `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`** —
   ein Werkzeug, das grün meldet, ohne die Sache zu zeigen.
2. 🟡 **Mittel: Der Routenfilter greift unter Git Bash nicht.** `npm run shots -- /privatkunden`
   kommt dort als `C:/Program Files/Git/privatkunden` an; MSYS wandelt führende Schrägstriche
   in Windows-Pfade um. Folge: **434 Aufnahmen statt 7**, rund sieben Minuten statt zwanzig
   Sekunden. `MSYS_NO_PATHCONV=1` davor behebt es. Im Skriptkopf notiert.
3. 🟢 **Niedrig: Die alte Darstellung brach die Reihenfolge optisch.** `xl:grid-cols-3` bei
   fünf Schritten setzte Schritt 4 unter Schritt 1 — ein Ablauf, der nach rechts und dann
   wieder nach links liest. Mit der Achse (eine Zeile, `SPALTEN[anzahl]`) ist das weg.
4. 🟢 **Niedrig: Punkte bewusst keine Knöpfe.** Im Zeitstrahl sind sie `<button>`, weil sich
   Station und Karte gemeinsam hervorheben. Bei einem Ablauf gibt es nichts hervorzuheben;
   sieben Sektionen × 4–5 Knöpfe wären nur Tab-Stopps ohne Ziel. Die Reihenfolge trägt das
   `<ol>`, die sichtbare Ziffer ist deshalb `aria-hidden`.

**Referenzen:**
`components/ablaufAnimation.ts`
`components/PageBlocks.tsx`
`scripts/shots.mjs`

### Phase 5 — Messen
**Eingehalten**: alle vier Werkzeuge gegen einen frischen Build ✅, Sichtprüfung Desktop und
mobil ✅, Backlog nachgezogen ✅, 700-Zeilen-Limit wiederhergestellt ✅

**Auffälligkeiten:**
1. 🔴 **Kritisch — selbst verursacht und beinahe still durchgerutscht: Ein ausgelagerter
   CSS-Block verschwand spurlos aus dem Build.** `index.css` lag bei 699 Zeilen und riss mit
   der Kartenfläche das **700-Zeilen-Limit aus `CLAUDE.md`** (739). Ausgelagert wurde der
   Textschutz-Block nach `styles/textschutz.css`, eingebunden per `@import` **an der Stelle,
   an der der Block vorher stand**. Ergebnis: postcss meldete nur eine **Warnung**
   („@import must precede all other statements"), der Build lief **grün** durch, alle 29
   Routen wurden prerendert — und `.cc-guard-wide` war **0×** im ausgelieferten CSS.
   Genau dieser Block hält den Hero-Text auf **sechs Seiten** mit stehendem Foto über
   WCAG AA; ohne ihn lagen vier davon zuvor bei 2,05:1 bis 2,68:1.
   **Gefunden, weil nach dem Build im ausgelieferten CSS nachgesehen wurde — nicht, weil
   etwas rot war.** Behoben: `@import` als erste Anweisung, mit Warnung im Dateikopf.
   Gegenprobe: keine postcss-Warnung mehr, `.cc-guard-wide` im CSS, Custom-Regeln vor den
   Utilities, und `npm run kontrast` erneut **0 unter AA** bei 5147 Messpunkten.
   **Lehre, wortgleich zu `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`:
   Ein grüner Build ist kein Nachweis, dass das CSS ankommt.**
2. 🟡 **Mittel: Das Zeilenlimit wurde erst in der Schlussprüfung gemessen.** Hätte ich es
   nach Phase 3 gemessen, wäre die Auslagerung ruhiger gelaufen. `index.css` steht jetzt bei
   **689**, `styles/textschutz.css` bei 72.
3. 🟢 **Niedrig:** Die Behauptung im Kopf von `.cc-karte` („0 Stellen unter AA bei 0.72") war
   beim Schreiben noch ungemessen. Sie ist nachträglich durch den Lauf belegt. Wäre sie falsch
   gewesen, hätte sie als geprüfte Angabe im Code gestanden — dieselbe Sorte Fehler, vor der
   Textregel 3 und der Zeitstrahl-Kommentar warnen.

**Referenzen:**
`index.css`
`styles/textschutz.css`

---

**Offene Folgepunkte:** `2026-09-14-karten-ablauf-optimierung-tasks.md`
