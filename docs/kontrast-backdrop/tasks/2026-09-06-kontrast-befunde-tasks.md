# Kontrastbefunde aus dem ersten Gesamtlauf

**Angelegt:** 2026-09-06
**Auslöser:** `npm run kontrast` ist am 2026-09-06 ins Repo gekommen (Paket G) und lief
zum ersten Mal über **alle** Routen: **4.538 Textstellen auf 29 Routen, 2 Breiten,
4 Scrollpositionen. 23 davon unter WCAG AA.**
**Status:** 2 behoben, **21 offen**

---

## Der Befund ist EIN Problem, nicht 23

Sortiert man die Treffer nach ihrem gemessenen Hintergrund, fällt sofort auf:

| gemessener Hintergrund | was das ist |
|---|---|
| `rgb(78 100 127)` · `rgb(82 104 130)` · `rgb(88 106 128)` | das **Foto** |
| `rgb(116 125 134)` · `rgb(131 131 132)` · `rgb(146 161 178)` | das **Foto** |
| `rgb(246 249 252)` | `bg-gray-50/70` — nur die zwei eigenen Treffer |

**21 von 23 Stellen liegen über dem stehenden Hintergrundfoto** (`BackdropLayout` /
`PhotoBackdrop`). Der weiße Textschutz (`cc-guard-wide`) reicht dort an einzelnen
Scrollpositionen nicht aus — besonders **mobil**, wo die Textspalte über die volle
Breite läuft und der Verlauf sich auf die Viewportbreite bezieht.

**Das ist derselbe Fehler wie in Paket C** (2026-09-03, vier Leistungsseiten). Er wurde
damals nur an den vier gemessenen Seiten behoben, nicht an der Ursache. Jetzt, mit einem
Messwerkzeug über alle Routen, zeigt sich die volle Ausdehnung.

### Drei Untergruppen

1. **Dunkler Fließtext über Foto** (13 Stellen) — `rgba(21,26,33,0.72)` bzw. `0.84`,
   14–16 px. Betroffen: `/karriere`, `/fuhrparkservice-leipzig`,
   `/autolackierung-leipzig`, `/ueber-uns`, `/innenaufbereitung-leipzig`,
   `/aussenaufbereitung-leipzig`, `/privatkunden`, `/felgenreparatur-leipzig`,
   `/kontakt`, `/geschaeftskunden`, drei Wissensbeiträge.
2. **Weiße Schrift auf dem Verlaufsknopf über Foto** (4 Stellen) — „Anfrage absenden",
   „Bewerbung senden". `rgb(255,255,255)` auf `rgb(144…161)`. Der Knopf ist
   halbtransparent und lässt das Foto durch.
3. **Blaue Schrift auf Foto** (1 Stelle) — „Artikel lesen", `rgb(11,61,145)` auf
   `rgb(150 158 165)`, 3.70:1.

Dazu **1 Sonderfall:** Die Hero-Subline der Startseite (`rgb(216,232,255)` auf
`rgb(131,131,132)`, 3.05:1). ⚠️ **Hier misst das Werkzeug zu streng:** Der Hero trägt
`drop-shadow`, das die Lesbarkeit real verbessert, in der Kontrastformel aber nicht
vorkommt. Vor einer Änderung erst mit dem Auge prüfen.

---

## Was schon behoben ist

* [x] **Mitarbeiterstimmen auf `/karriere`** (4.21:1 → geprüft). Die Berufsbezeichnung
      stand auf `text-gray-500`; bei 10 px, weit gesperrt, auf `bg-gray-50/70` bleibt
      davon keine Reserve. Jetzt `text-gray-700`. **Nicht über dem Foto** — die einzigen
      zwei Treffer, die eine andere Ursache haben.

## Was zu tun ist

### ⬜ Phase 1 — Die Ursache statt der Symptome
* [ ] `cc-guard-wide` in `index.css` messen statt schätzen: Wie stark deckt der Verlauf
      an welcher Viewportbreite? Der mobile Fall braucht einen eigenen Wert.
* [ ] **Erst danach** entscheiden, ob der Schutz verstärkt wird oder ob einzelne
      Sektionen einen deckenden Hintergrund bekommen.
* [ ] ⚠️ Gegenprobe: Ein stärkerer Verlauf nimmt dem Foto die Wirkung. Der Bildeindruck
      war eine bewusste Gestaltungsentscheidung — hier gegen Lesbarkeit abwägen, nicht
      einfach hochdrehen.

### ⬜ Phase 2 — Knöpfe über Foto
* [ ] `cc-gradient-button` ist halbtransparent. Über dem Foto reicht das nicht.
      Deckend machen oder einen eigenen Zustand für Backdrop-Seiten.

### ⬜ Phase 3 — Nachmessen
* [ ] `npm run kontrast` erneut über alle Routen. Ziel: 0 Stellen unter AA.
* [ ] Danach `--strikt` im Build erwägen — dann bricht der Build bei Rückfall.

---

## Warum das nicht sofort miterledigt wurde

Der Auftrag für Paket G war, das **Werkzeug** ins Repo zu holen. Seine Befunde sind neue
Arbeit: Sie betreffen 12 Seiten, hängen an einer gestalterischen Abwägung (Foto vs.
Lesbarkeit) und lassen sich nicht nebenbei erledigen, ohne genau den Fehler zu
wiederholen, den Paket C dokumentiert hat — punktuell reparieren statt die Ursache
anfassen.

**Referenzen:**
`scripts/check-kontrast.mjs`
`docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`
`components/PhotoBackdrop.tsx`
