# Partnerbetriebe auf der Kachel „Autohäuser & Fuhrparks"

**Erstellt:** 2026-07-24
**Ziel:** Die Autohäuser, mit denen der Betrieb zusammenarbeitet, in der Sektion
„Für wen wir arbeiten" nennen.

---

## Auftrag und Abweichung

**Gewünscht:** Auflistung monochromer Logos mit transparentem Hintergrund, Firmenname
jeweils darunter.

**Umgesetzt:** Namensnennung im vorgesehenen Raster — **ohne Logos**. Begründung unten.
Das Raster ist bereits auf Logos ausgelegt, sie lassen sich ohne Layout-Änderung
nachrüsten.

### Warum keine Logos eingebunden wurden

1. **Die Dateien existieren nicht und dürfen nicht beschafft werden.** Volkswagen, Audi
   und Porsche sind eingetragene Marken. Ihre Logos aus dem Netz zu ziehen und auf einer
   gewerblichen Website einzubinden, ist ohne Freigabe eine Markennutzung. Ein Nachbauen
   aus dem Gedächtnis wäre zusätzlich fachlich falsch — Herstellerlogos sind exakt
   spezifiziert.
2. **Der inhaltlich schwerere Punkt: Irreführungsrisiko.** CarCare ist Meisterbetrieb und
   Glasurit-Lackpartner, aber **kein autorisierter Vertragspartner** von VW, Audi oder
   Porsche. Herstellerlogos auf der eigenen Seite können den Eindruck einer autorisierten
   Werkstattbindung erwecken — das ist als irreführende geschäftliche Handlung angreifbar,
   unabhängig von der Markenfrage. Die reine **Namensnennung als Referenz** ist davon zu
   unterscheiden und deutlich unkritischer.
3. **Praxis:** Der übliche Weg ist eine schriftliche Referenzfreigabe je Partner, die
   zugleich die offiziellen Logodateien und die Gestaltungsvorgaben mitliefert.

> Hinweis: recherchiert, nicht rechtsverbindlich. Für eine belastbare Einschätzung ist
> anwaltlicher Rat bzw. die Freigabe der Partner maßgeblich.

### Sachliche Korrektur am Wortlaut

„Porsche Werk Leipzig" ist ein **Produktionswerk**, kein Autohaus. Die Überschrift der
Liste lautet deshalb **„Partnerbetriebe"** statt „Autohäuser" — damit ist die Aufzählung
sachlich korrekt, ohne dass ein Eintrag herausfallen muss.

---

## Phasen

### ✅ Phase 1 — Datenmodell logo-fähig gemacht
* [x] `TargetGroupPartner` in `types.ts` ergänzt (`name`, optionales `logo`)
* [x] `partners?: TargetGroupPartner[]` an `TargetGroup`
* [x] Am Typ dokumentiert, warum `logo` leer ist und wie nachgerüstet wird

**Referenzen:**
`types.ts`

---

### ✅ Phase 2 — Partnerliste und Darstellung
* [x] Fünf Partner an der Kachel `gewerbe` hinterlegt
* [x] Warnhinweis zur Markenfrage direkt an der Datenliste, nicht nur in dieser Doku —
      dort wird er beim nächsten Anfassen auch gelesen
* [x] Raster: 2 Spalten, Label „Partnerbetriebe", Trennlinie zum CTA
* [x] Logo-Slot vorbereitet: liegt `logo` vor, erscheint das Bild `grayscale opacity-60`
      **über** dem Namen; fehlt es, steht nur der Name — identisches Raster
* [x] Platzierung **nach** dem CTA: Der CTA sitzt laut bestehendem Kommentar bewusst direkt
      unter dem Text, weil die nächste Karte den Kartenfuß zuerst verdeckt. Die Partner
      stehen darunter als ergänzende Information
* [x] `components/TargetGroupCards.tsx` bei 366 Zeilen (Limit 700)

**Referenzen:**
`components/TargetGroupCards.tsx`

---

### ✅ Phase 3 — Verifikation
* [x] `npm run typecheck` sauber
* [x] Im echten Browser gemessen, Desktop **und** Mobile: alle fünf Namen vorhanden,
      Block sichtbar, Breite 375 px (Desktop) / 294 px (Mobile), `logosEingebunden: 0`
* [x] Screenshots: `output/preloader-verify/partner-desktop.png`, `-mobile.png`

---

## Kommentare

### Phase 1–3
**Eingehalten:** Zeilenlimit ✅, bestehende Kommentar-Begründungen respektiert (CTA-Position) ✅, im echten Browser gemessen ✅, Mobile geprüft ✅
**Auffälligkeiten/Findings:**
1. 🟠 **Hoch (bewusste Abweichung vom Auftrag):** Logos nicht eingebunden — Markenrecht und
   Irreführungsrisiko, siehe oben. Der Auftraggeber muss entscheiden, ob Freigaben eingeholt
   werden.
2. 🟡 **Mittel (sachlich korrigiert):** „Porsche Werk Leipzig" ist kein Autohaus. Über
   die Listenüberschrift „Partnerbetriebe" gelöst.
3. 🟢 **Niedrig (offen, Betrieb):** Auch die reine Namensnennung als Referenz wird in der
   Praxis üblicherweise mit dem Partner abgestimmt. Ob das vorliegt, weiß nur der Betrieb.

---

### ✅ Phase 4 — Partneransprache und zweiter CTA IN der Kachel
**Auftrag:** Text, warum weitere Autohäuser und Fuhrparkmanager gut zu CarCare passen,
plus zweiter Button „Partnerschaft anfragen" — beides **in** der Kachel.

**Zwischenirrtum (korrigiert):** Ich hatte den Text zunächst in ein eigenes Band unter
dem Kartenstapel gelegt. Das war nicht gewünscht — Band wieder entfernt, alles steht
jetzt in der Kachel.

* [x] `PartnerBand` restlos entfernt, `pitch`-Feld aus `types.ts` zurückgebaut
* [x] Zweiter CTA „Partnerschaft anfragen" → `/kontakt#contact-business`, optisch
      sekundär (ohne gefüllten Pfeil-Kreis), beide CTAs in einem Wrap-Container
* [x] Partneransprache **in den vorhandenen Beschreibungstext gelegt** statt als zweiter
      Absatz — Begründung unten
* [x] Partnerliste bleibt in der Kachel

### Der eigentliche Befund: die Kachel hat ein hartes Höhenbudget
Die Kachelhöhe ist `100svh − i × --bar`. Gemessen bleibt für den **gesamten** Karteninhalt:

| Viewport | Bildkarte | verfügbar für Inhalt |
| --- | --- | --- |
| 1920×1080 | 720 px | 588 px |
| 1440×900 | 540 px | 408 px |
| 1366×768 | 408 px | 276 px |
| 1024×640 | 280 px | 148 px |

Beschreibung + Zusatzabsatz + Partnerliste + zwei CTAs brauchen zusammen ~370 px. Auf
1366×768 wären das **94 px Überstand**, die das `overflow-hidden` der Bildkarte hart
abschneidet. Deshalb:

* [x] **Ein Absatz statt zwei:** Die Partneransprache ersetzt den früheren generischen
      Einzeiler, statt zusätzlich zu ihm zu stehen (spart ~84 px)
* [x] **Gestaffelte Höhen-Queries** statt Abschneiden — es weicht immer zuerst das
      Entbehrlichste, funktionale Inhalte (Text, CTAs) bleiben in jedem Fall stehen:
      * unter 1000 px Höhe: dekoratives CarCare-Badge
      * unter 860 px Höhe: Partnerliste
      * unter 760 px Höhe: Text eine Stufe kleiner (`text-xs`) — bewusst **kein**
        `line-clamp`, das würde Inhalt unterschlagen
      * unter 740 px Höhe: Karte fällt auf Inhaltshöhe zurück statt sich zu strecken
      * unter 700 px Höhe: engere Abstände und CTA-Polster

**Verifiziert (Überstand gegen die Bildkante, alle drei Kacheln):**

| Viewport | Überstand | Partnerliste |
| --- | --- | --- |
| 1920×1080 | −30 px ✅ | sichtbar |
| 1600×1000 | −144 px ✅ | sichtbar |
| 1440×900 | −62 px ✅ | sichtbar |
| 1366×768 | −29 px ✅ | ausgeblendet |
| 1280×800 | −61 px ✅ | ausgeblendet |
| 1280×700 | −14 px ✅ | ausgeblendet |
| 1152×648 | 0 px ✅ | ausgeblendet |
| 1024×640 | **+24 px ⚠️** | ausgeblendet |
| 390×844 / 360×740 | −14 px ✅ | ausgeblendet |

**Referenzen:**
`components/TargetGroupCards.tsx`
`types.ts`

---

## Kommentare — Phase 4

**Eingehalten:** Zwischenirrtum vollständig zurückgebaut ✅, gemessen statt geschätzt ✅, neun Viewports geprüft ✅, funktionale Inhalte nie ausgeblendet ✅
**Auffälligkeiten/Findings:**
1. 🔴 **Kritisch (von mir verursacht, GEFIXT):** Die Partnerliste aus Phase 2 hat die Kachel
   auf gängigen Laptops zum Überlaufen gebracht — auf 1366×768 waren Liste (35 px) und
   CarCare-Badge (85 px) abgeschnitten. Das war beim Einbau nicht geprüft worden. Jetzt
   über gestaffelte Höhen-Queries gelöst und über neun Viewports belegt.
2. 🟠 **Hoch (falsch verstandener Auftrag, zurückgebaut):** Text zunächst in ein eigenes Band
   unter dem Stapel gelegt statt in die Kachel. Vollständig entfernt.
3. 🟡 **Mittel (bewusste Abwägung):** Ab 860 px Viewporthöhe abwärts ist die Partnerliste
   nicht sichtbar. Das betrifft verbreitete Laptops (1366×768). Alternative wäre, Text oder
   einen CTA zu kürzen — das ist eine inhaltliche Entscheidung des Betriebs, keine technische.
4. 🟡 **Mittel (Bestand, leicht verbessert):** Auf 1024×640 bleiben 24 px Überstand. Das
   Original lag dort bei ~34 px (Beschreibung + CTA + Badge = 154 px bei 120 px Platz) —
   die Kachel war an dieser Größe also schon vorher zu klein, ist jetzt aber etwas besser.

---

### ✅ Phase 5 — Scrollbereich mobil, zweiter CTA im CI-Verlauf
* [x] `.cc-card-scroll` in `index.css` — schmale Scrollleiste in Kartenfarbe.
      Bewusst VOR `@tailwind utilities` eingefügt: Die Datei hat dort eine dokumentierte
      Reihenfolge-Regel (Utilities zuletzt, damit sie Custom-Regeln schlagen).
* [x] Weiße Karte bekommt `max-h-[calc(100% - 2*var(--gap))]` → bleibt immer innerhalb
      der Bildkarte
* [x] Inhaltsbereich: `min-h-0` + `overflow-y-auto`. `min-h-0` ist die Voraussetzung —
      ohne das wächst ein Flex-Kind über seinen Container hinaus (`min-height: auto`)
      und `overflow-y` greift nie
* [x] Ausblend-Regeln auf **Desktop beschränkt** (`min-width:1024px and …`) — mobil ist
      jetzt alles sichtbar und stattdessen scrollbar
* [x] Zweiter CTA auf `.cc-gradient-button` umgestellt: blauer CI-Verlauf, weiße Schrift,
      dieselbe Füllung wie „Termin oder Beratung anfragen" in der Leistungsübersicht

**Lenis-Kollision geprüft:** unkritisch. Lenis läuft mit `syncTouch: false`, auf
Touch-Geräten scrollt also nativ der innere Container und kettet am Ende normal an die
Seite weiter. Deshalb bewusst **kein** `data-lenis-prevent` — das hätte auf einer Karte,
die den halben Mobil-Viewport einnimmt, das Weiterscrollen der Seite blockiert.

**Verifiziert:**

| Viewport | Scrollbereich | Partnerliste | CTA 2 |
| --- | --- | --- | --- |
| 1920×1080 | nicht nötig (588/588) | sichtbar | Verlauf ✅ |
| 1440×900 | nicht nötig (408/408) | sichtbar | Verlauf ✅ |
| 1366×768 | nicht nötig (276/276) | ausgeblendet | Verlauf ✅ |
| 1024×640 | **aktiv** (206/148) | ausgeblendet | Verlauf ✅ |
| 390×844 | **aktiv** (438/346) | sichtbar | Verlauf ✅ |
| 360×740 | **aktiv** (419/242) | sichtbar | Verlauf ✅ |

Nebeneffekt: Der zuvor offene Anschnitt auf 1024×640 (24 px) ist damit erledigt — dort
greift jetzt der Scrollbereich.

**Referenzen:**
`components/TargetGroupCards.tsx`
`index.css`

---

### ✅ Phase 6 — Gleiche Behandlung für „Versicherungen & Agenturen"
**Auftrag:** 31 Versicherungspartner, zweiter CTA „Partnerschaft anfragen", plus Text
für Versicherer und Schadensteuerer, die das „Warum" verstehen sollen.

* [x] Text als Ansprache an Versicherer/Schadensteuerer, ersetzt den früheren
      Einzeiler. Alle Aussagen durch Bestehendes gedeckt (Leistungsspektrum,
      Glasurit-Lackpartnerschaft, Werkstattersatzfahrzeug, strukturierte Abläufe).
      **Bewusst keine Zahlen zu Steuerungsquoten oder Durchlaufzeiten** — die liegen
      nicht belegt vor und wären erfunden.
* [x] Zweiter CTA „Partnerschaft anfragen" im blauen CI-Verlauf, wie auf der
      Gewerbe-Kachel
* [x] Label der Liste konfigurierbar (`partnersLabel`) → hier „Versicherungspartner"

**Darstellung — erster Versuch verworfen.** Zunächst wurden die 31 Namen als Fließtext
gesetzt, um Platz zu sparen. Rückmeldung: deutlich schlechter lesbar als das Raster der
Partnerbetriebe. **Zurückgebaut.**

Jetzt gilt **ein einziges Raster für alle Kacheln** — gleiche Spalten, Abstände und
Schrift, egal ob 5 oder 31 Partner. Nachgemessen sind beide Listen identisch:
`11px / font-weight 600 / rgba(21,26,33,0.72) / line-height 15.125px / 2 Spalten /
column-gap 16px / row-gap 8px`.

Das Platzproblem löst stattdessen ein **eigener Scrollbereich für die Liste**: Ab `lg`
bekommt sie eine Maximalhöhe (96 px, ab 860 px Viewporthöhe 160 px, ab 960 px 224 px)
und scrollt in sich. Text und CTAs darüber bleiben dadurch immer vollständig sichtbar,
während die Liste beliebig lang sein darf.

`data-lenis-prevent` liegt bewusst **nur** auf diesem kleinen Listenfeld: Lenis fängt
Wheel-Events global ab, ein innerer Container würde am Desktop sonst gar nicht scrollen.
Auf dem gesamten Kartentext hätte das Attribut dagegen das Weiterscrollen der Seite
blockiert. Mobil bekommt die Liste **keine** Maximalhöhe — dort scrollt bereits der ganze
Kartentext, zwei ineinanderliegende Scrollbereiche wären unbedienbar.

**Ausblend-Schwelle pro Kachel** (`partnersHideBelow`), weil die Kachelhöhe mit dem
Stapelindex abnimmt. Beide stehen auf 860: Bei 760 wäre die Versicherungsliste auf
1366×768 zwar im Scrollbereich, auf **Desktop** aber nicht erreichbar — Lenis fängt das
Mausrad global ab, ein innerer Container scrollt dort nicht mit. Mobil ist das anders
(`syncTouch: false`, nativer Touch-Scroll greift), deshalb wirkt die Schwelle nur ab `lg`.

**Verifiziert (Rest = Karteninhalt, der auf Desktop nicht erreichbar wäre):**

| Viewport | Versicherungen | Autohäuser |
| --- | --- | --- |
| 1920×1080 | Liste 224 px, scrollt, Rest 0 ✅ | Liste 61 px, Rest 0 ✅ |
| 1600×1000 | Liste 224 px, scrollt, Rest 0 ✅ | Liste 61 px, Rest 0 ✅ |
| 1440×900 | Liste 160 px, scrollt, Rest 0 ✅ | Liste 61 px, Rest 0 ✅ |
| 1366×768 | ausgeblendet, Rest 0 ✅ | ausgeblendet, Rest 0 ✅ |
| 1280×700 | ausgeblendet, Rest 0 ✅ | ausgeblendet, Rest 0 ✅ |
| 1024×640 | ausgeblendet, Rest 0 ✅ | ausgeblendet, **Rest 58 px ⚠️** |
| 390×844 | Liste 377 px vollständig, Karte scrollt ✅ | Liste 77 px, Karte scrollt ✅ |
| 360×740 | Liste 392 px vollständig, Karte scrollt ✅ | Liste 92 px, Karte scrollt ✅ |

**Zwischenversuch dokumentiert:** Schwelle 760 für die Versicherungskarte wurde probiert
und wieder verworfen — auf 1366×768 blieben dann 55 px im Kartenscroll, die auf Desktop
wegen Lenis nicht per Mausrad erreichbar sind.

**Referenzen:**
`components/TargetGroupCards.tsx`
`types.ts`

---

## Kommentare — Phase 6

**Eingehalten:** Platz vorher gemessen statt nachträglich repariert ✅, keine erfundenen Kennzahlen ✅, Screenreader-Semantik bedacht ✅, sieben Viewports geprüft ✅
**Auffälligkeiten/Findings:**
1. 🟡 **Mittel (offen, Bestand):** Auf 1024×640 bleiben in der Autohäuser-Kachel 58 px im
   Scrollbereich, die auf Desktop wegen Lenis nicht per Mausrad erreichbar sind — wohl aber
   über die sichtbare Scrollleiste. Vor diesen Änderungen war derselbe Inhalt dort **hart
   abgeschnitten**, also nicht erreichbar. Netto besser, aber nicht ideal.
2. 🟢 **Niedrig (Betrieb):** Auch die Nennung von 31 Versicherern als Referenz sollte mit
   den Häusern abgestimmt sein — gleiche Überlegung wie bei den Autohäusern.

---

## Offen — sobald Freigaben vorliegen

* [ ] Schriftliche Referenzfreigabe je Partner einholen (liefert i. d. R. auch die Logodateien)
* [ ] Offizielle monochrome Dateien mit transparentem Hintergrund unter
      `/public/assets/partner/` ablegen (SVG bevorzugt)
* [ ] Feld `logo` je Partner in `components/TargetGroupCards.tsx` setzen — sonst nichts
* [ ] Vorgaben der Partner zu Mindestgröße und Schutzraum prüfen
