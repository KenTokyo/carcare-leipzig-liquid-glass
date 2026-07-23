# Hero-Minimalisierung — Dubletten raus, Vertrauensfakten in die TrustBar

> **Auftrag (User, 2026-07-22):** Hero „so sauber und minimalistisch wie möglich". Die vielen
> Kleinelemente über und unter den CTAs prüfen und entfernen bzw. in die Sub-Hero-Sektion verschieben.
> **Entscheidung des Users nach Analyse: „komplett minimal"** — alle fünf Kleinelemente raus.

**Erstellt:** 2026-07-22 · **Modus:** LOKAL · **Ansprache:** Sie

## Analyse (Belege)

**1. Die drei Leistungs-Chips waren 100 % Dublette — und keine Links.**
Im Code waren es reine `<div>`s (kein `href`), also weder Navigation noch Zusatzinfo. Jeder Begriff
stand wörtlich in der Subline eine Zeile darüber:

| Chip | steht bereits in der Subline |
|---|---|
| Unfallinstandsetzung Leipzig | „… **Unfallinstandsetzung**, Lackierung …" |
| Fahrzeugaufbereitung | „Professionelle **Fahrzeugaufbereitung** …" |
| Lackierung & Smart Repair | „… **Lackierung**, **Smart Repair** …" |

Zusammen mit der H1 („Unfallschaden, Reparatur oder Autoaufbereitung in Leipzig") stand damit jeder
Leistungsbegriff dreifach innerhalb von ~200 px.

**2. „An den Tierkliniken 42" stand wortgleich doppelt** — Hero-Badge und TrustBar-Punkt 3.

**3. Fehlplatzierung:** „Meisterbetrieb · Glasurit-Lackpartner · seit 1993" ist das stärkste
E-E-A-T-Signal der Seite (§4.2) — steckte aber im Hero, während der Trust-Streifen es NICHT führte.
Dort standen stattdessen zwei weiche Punkte: „Premium-Erfahrung" (Werbeadjektiv, §4.3 verlangt
konkrete Fakten) und „Alles aus einer Hand" (Dublette zu Subline + Leistungsübersicht).

## Phasen

### ✅ Phase 1 — Hero entschlacken
* [x] Badge „Meisterbetrieb · Glasurit-Lackpartner · seit 1993" entfernt (Inhalt wandert, s. Phase 2).
* [x] Badge „An den Tierkliniken 42" ersatzlos entfernt (Dublette zur TrustBar).
* [x] Die drei Leistungs-Chips inkl. `highlights`-Array ersatzlos entfernt.
* [x] Ungenutzten Import `CheckCircle2` entfernt.
* [x] Hero trägt jetzt nur noch: **H1 → Subline → zwei CTAs.**

### ✅ Phase 2 — TrustBar auf harte Fakten umstellen
* [x] Neu: **Meisterbetrieb** (Kfz-Lackierhandwerk, seit 1993) · **Glasurit-Lackpartner**
      (farbtongenaue Reparaturlackierung) — Wortlaut aus den Projekt-USP-Bausteinen, nichts erfunden.
* [x] Entfernt: „Premium-Erfahrung" und „Alles aus einer Hand".
* [x] Behalten: „Über 50 Mitarbeiter" und „Standort Leipzig / An den Tierkliniken 42".
* [x] Icons: `Award`, `PaintBucket`, `Users`, `MapPin`.

### ✅ Phase 3 — Verifikation
* [x] `npm run typecheck` fehlerfrei (bestätigt zugleich den `PaintBucket`-Export).
* [x] Screenshots Hero + TrustBar (Desktop & Mobile), Konsole fehlerfrei.

**Referenzen:** `components/HeroSection.tsx` · `components/TrustBar.tsx`

## Kommentare

### Phasen 1–3
**Eingehalten:** Scope exakt („komplett minimal") ✅, Parallax/Bild-Ebene unangetastet ✅,
kein Mojibake ✅, Sie-Ansprache ✅, Design-System („Clean, Minimalistisch, großzügiges Spacing") ✅.

**SEO/GEO-Bewertung:** neutral bis positiv.
- **Keine Keywords verloren** — alle Leistungsbegriffe bleiben in H1 + Subline; entfernt wurden nur Dubletten.
- **Keine Links verloren** — die Chips waren keine Links; jede Leistung ist als echter Link in der
  Leistungsübersicht und im Mega-Menü erreichbar (§4.4 unberührt).
- **E-E-A-T gestärkt** (§4.2/§4.3): Meisterbetrieb und Glasurit stehen jetzt als eigenständige,
  ikonisierte Fakten statt als gequetschte Pille — besser für Nutzer und KI-Extraktion.
- **NAP-Konsistenz** (§6.1) unberührt: Adresse weiterhin in TrustBar, Footer und Kontaktseite.
- **CWV:** weniger DOM im LCP-Bereich (§2.2) — kleiner Pluspunkt.

**Auffälligkeiten:** keine offenen. Bewusste Nebenwirkung: Meisterbetrieb/Glasurit liegen jetzt je nach
Viewport knapp unter der Falz — vom User nach Abwägung so entschieden („komplett minimal").

---

## Nachtrag 2026-07-22 — Zentriertes Hero-Layout + Vertrauensleiste am Hero-Fuß

**Auftrag (User, mit Referenz-Screenshot):** Überschrift, Subline und CTAs auf Desktop **zentriert**
untereinander; die vier Vertrauensfakten als Leiste an die **Unterkante des Heros** (Stil: Logo-Leiste
im Referenzbild). Dadurch entfällt die Sub-Hero-Sektion, die Seite startet danach mit der Leistungsübersicht.

### ✅ Phase 4 — Zentrierter Kopfblock
* [x] Container auf `flex-col` umgestellt: Kopfblock `flex-1` (vertikal zentriert), Leiste am Fuß.
* [x] Ab `md`: `items-center` + `text-center`; H1/Subline über `max-w` + Zentrierung mittig.
      CTA-Reihe `md:justify-center`.
* [x] **Mobile bewusst linksbündig belassen** (User: „fürs Erste in der Desktopversion"): Die H1
      bricht dort auf ~5 Zeilen um — zentriert wirkt das unruhig und kostet Lesbarkeit.

### ✅ Phase 5 — Vertrauensleiste am Hero-Fuß, TrustBar-Sektion aufgelöst
* [x] Vier Fakten als `<ul>` mit Icon + Label + Unterzeile, weiß auf Foto (Trennlinie `border-white/15`
      + `drop-shadow` je Zeile), darüber Label „Dafür steht CarCare Leipzig".
* [x] Layout: Mobile 2×2, ab `md` eine zentrierte Reihe.
* [x] `components/TrustBar.tsx` gelöscht, aus `HomePage` entfernt. Vorab geprüft: `#trust` war
      nirgends verlinkt, Komponente lief nur auf der Startseite → keine toten Links.
* [x] Verifiziert: Sektionsreihenfolge jetzt `home → leistungen → …`, kein horizontaler Overflow.

### ✅ Phase 6 — Verifikation
* [x] Typecheck 0 · 0 Konsolenfehler · Desktop/Tablet/Mobile geprüft.

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — behoben:** Im ersten Entwurf schnitt die fixierte `MobileStickyCTA` (~83 px, `lg:hidden`)
   die Vertrauensleiste unten ab. Container erhielt `pb-28`, ab `lg` wieder `pb-10`.
2. 🟡 **Mittel — behoben:** Auf 390 px brachen die Unterzeilen in der 2-Spalten-Leiste auf drei Zeilen um.
   Unterzeile jetzt erst ab `sm` sichtbar; auf Mobile tragen die vier Kernbegriffe allein (näher am
   Referenz-Stil, dort stehen unten nur Wortmarken).
3. ✅ **ERLEDIGT in Phase 7** (war: Kontrast-Empfehlung zum Veil).

---

## Nachtrag 2026-07-22 — Verlauf oben-zentriert, Text höher, Scrim + zweite Trennlinie

**Auftrag (User):** Überschrift auf Desktop etwas nach oben; den Verlauf von „links oben → rechts unten"
auf einen **oben zentriert** beginnenden Radialverlauf umstellen (Bildmitte ≈ 40 %, Bildrand 0 %);
unten ein **dezentes Scrim** für die Lesbarkeit der Vertrauensleiste; „Dafür steht CarCare Leipzig"
zwischen **zwei** Trennstrichen.

### ✅ Phase 7 — Umsetzung
* [x] **Überschrift höher:** Kopfblock ab `md` von `justify-center` auf `justify-start` — die H1
      beginnt jetzt bei y≈142 px statt ≈200 px (gemessen bei 1440×900).
* [x] **Veil umgestellt:** `.hero-radial-veil` Zentrum `0% 0%` → **`50% 0%`**, Stops
      `0.94 / 0 %` · `0.40 / 40 %` · `0 / 100 %`.
* [x] **Bottom-Scrim:** zusätzliche Ebene über dem unteren Drittel
      (`from carbon/0.72 → via 0.3 → transparent`), rein additiv — das Motiv bleibt oben frei.
* [x] **Zweite Trennlinie** unter dem Label ergänzt; das Label steht jetzt zwischen zwei Strichen
      (verifiziert: 2 Trennlinien im DOM).
* [x] Verifikation: Typecheck 0 · 0 Konsolenfehler · Desktop + Mobile · Vertrauensleiste steht auf
      Mobile weiterhin frei über der Bottom-Navigation (nach der zusätzlichen Linie erneut geprüft).

### ✅ Phase 8 (2026-07-23) — Hero-CTAs unterhalb `lg` entfernt (Gegenpart zur Sticky-Bar)

**Analyse (Auslöser: Rückfrage des Users):** Die `MobileStickyCTA` (`lg:hidden`, fixiert unten) bietet
**dieselben zwei Ziele** wie die Hero-CTAs — `#contact-schaden` und `#contact-termin` — **plus**
„Anrufen" (`tel:`). Sie ist ab Sekunde null sichtbar (kein Scroll-Trigger), bleibt über die ganze Seite
stehen und blendet sich nur kurz vor dem Footer aus. Sie ist damit eine echte **Obermenge**.
Folge im Ist-Zustand: fünf CTAs gleichzeitig auf einem Handy-Screen, im selben Gradient-Look — „Termin
für Aufbereitung anfragen" stand ~200 px über „TERMIN".

* [x] CTA-Reihe auf `hidden … lg:flex` gesetzt → sie erscheint **genau dort, wo die Sticky-Bar nicht ist**.
* [x] Bewusst `hidden` statt Entfernen: Die `<a href>` bleiben **im HTML** und damit crawlbar
      (§4.4 interne Verlinkung). Die Sticky-Bar nutzt dagegen JS-`<button>` ohne `href`.
* [x] Kopplung der Breakpoints im Code dokumentiert (ändert sich `lg:hidden` in `MobileStickyCTA`,
      muss `lg:flex` hier mitwandern).

**Verifikation (Breakpoint-Matrix):**
| Viewport | CTAs im HTML | sichtbar | Sticky-Bar |
|---|---|---|---|
| 1440 px | 2 | 2 | aus |
| 900 px | 2 | 0 | an |
| 390 px | 2 | 0 | an |

**Ergebnis:** ~176 px Höhe gespart — der **komplette Hero inkl. Vertrauensleiste passt auf Mobile jetzt
in eine Bildschirmhöhe** (vorher lag die Leiste unter der Falz). Typecheck 0, 0 Konsolenfehler.

**Test-Fallstricke (für spätere Prüfungen notiert):**
1. Sichtbarkeit **nicht** über `getComputedStyle(el).display` prüfen — bei einem Element in einem
   `display:none`-Container liefert das weiterhin dessen eigenen Wert. Stattdessen `offsetParent === null`
   bzw. Bounding-Box-Größe verwenden.
2. Die Sticky-Bar **nicht** über `a[href^="tel:"]` suchen — der Telefon-Button der Navbar matcht mit und
   erzeugt auf Desktop einen falschen Treffer.

---

**Wichtige Herleitung (im CSS dokumentiert):** Bei Zentrum `0% 0%` lag die Bildmitte *immer exakt*
auf dem 50-%-Stop, unabhängig vom Seitenverhältnis. Diese Eigenschaft **entfällt** bei Zentrum
`50% 0%`: Die Bildmitte liegt dort bei `(H/2) / √((W/2)²+H²)` — ~39 % bei 1440×900, ~37 % bei
1920×1080, ~49 % auf Hochkant-Mobile. Der 0.4-Stop steht deshalb bei **40 %**, damit die Bildmitte
auf den üblichen Desktop-Formaten praktisch punktgenau die gewünschten 40 % trifft.
