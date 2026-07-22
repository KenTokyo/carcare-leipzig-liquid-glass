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
