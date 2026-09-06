# Optimierung: Nummernkollision auflösen

**Angelegt:** 2026-09-06
**Ausgelöst durch:** `docs/backlog/tasks/2026-09-06-schleifen-2-3-import-tasks.md`, Finding 1
**Status:** ✅ **ausgeführt am 2026-09-06** — 207 Nennungen in 36 Dateien umbenannt.

---

## Das Problem in einem Satz

Neun Befunde wurden im Repository unter Nummern abgelegt (R4–R12), die beim Kunden
bereits vergeben sind — **fünf davon bedeuten dort etwas völlig anderes**, und zwei
davon sind André als Livegang-Blocker genannt worden.

## Warum umbenennen und nicht weiterzählen

Weiterzählen ab 3.41 würde das Problem nur verschieben: Sobald der Kunde eine
Schleife 4 anlegt oder Schleife 3 ergänzt, kollidiert es erneut. Kundennummern und
eigene Befunde gehören in **getrennte Namensräume**. Die Kundennummern sind gesetzt und
werden nicht angefasst — sie stehen in Andrés Liste und in zwei Vor-Ort-Protokollen.

**Gewähltes Kürzel: `R1`–`R12`** („Repo-Befund"). Kann mit `1.x`, `2.x`, `3.x` nicht
verwechselt werden, auch nicht beim Überfliegen.

---

## Zuordnungstabelle

| neu | bisher | Inhalt | Nennungen (Doku / Code) |
|---|---|---|---|
| **R1** | *„R1"* | Meilensteine für den Zeitstrahl auf `/ueber-uns` | 10 / 10 |
| **R2** | *„R2"* | Eigene Bildmotive Leasingrückgabe + Außenaufbereitung | 21 / 0 |
| **R3** | *„R3"* | Erklärtexte für die sieben Leistungsseiten | 20 / 8 |
| **R4** | *„R4"* | Ausbildung bestätigen + Eckdaten je Beruf | 17 / 2 |
| **R5** | *„R5"* | **Impressumsangaben vervollständigen** 🔴 | 21 / 4 |
| **R6** | *„R6"* | **Datenschutzerklärung schreiben** 🔴 | 28 / 2 |
| **R7** | *„R7"* | Echtes Vorschaubild statt Stockfoto | 13 / 0 |
| **R8** | *„R8"* | Reparaturseiten führten ins falsche Formular *(erledigt)* | 11 / 7 |
| **R9** | *„R9"* | Anhänge mitsenden | 17 / 3 |
| **R10** | *„R10"* | **Zugangsdaten für den Formularversand** 🔴 | 13 / 0 |
| **R11** | *„R11"* | Felder der übrigen Formularvarianten datengetrieben machen | 3 / 0 |
| **R12** | *„R12"* | Feldliste der Schadenmeldung mit André durchgehen | 11 / 0 |
| | | **Summe** | **185 / 36** |

**Betroffen: 16 Doku-Dateien und 7 Code-Dateien.**

---

## Zwei Sonderfälle, die beim Umbenennen zusammengelegt werden

* [x] **R4 und das echte R4 sind dasselbe Thema.** Beide fragen, ob ausgebildet wird.
      Der Kunde formuliert die Frage („widersprüchliche Aussage klären"), wir formulieren
      die Zulieferung (Beginn, Dauer, Voraussetzungen, Übernahmechancen). **Vorschlag:**
      R4 auflösen und den Inhalt als Präzisierung unter das echte **R4** hängen.
* [x] **R2 doppelt das echte 2.14 und 2.15.** „Leasingrückgabe braucht ein eigenes Bild"
      (2.14) und „Innenaufbereitung: kein Transporter" (2.15/3.29) decken R2 inhaltlich ab.
      **Vorschlag:** R2 auflösen, Inhalt zu 2.14 ergänzen. Sonst wird dieselbe
      Fotolieferung zweimal angefordert.

Nach dem Zusammenlegen bleiben **zehn** Repo-Befunde: R1, R3, R5–R12.

---

## Phasen

### ✅ Phase 1 — Umbenennen in der Dokumentation
* [x] 16 Doku-Dateien, 185 Nennungen. **Nicht per Suchen-und-Ersetzen** — `R5` kommt
      auch als Fließtext-Zahl vor, und die neuen Dateien `schleife-2.md`/`schleife-3.md`
      führen die **echten** Nummern, die unangetastet bleiben müssen.
* [x] Regel: Nur Nennungen umbenennen, die auf einen Repo-Befund zeigen. In
      `schleife-2.md` und `schleife-3.md` wird **nichts** umbenannt.
* [x] `offene-punkte-konsolidiert.md` trägt die Nummern bereits als *„R5"* markiert —
      diese Markierungen sind die vollständige Fundstellenliste für das Dokument.

### ✅ Phase 2 — Umbenennen im Code
* [x] 7 Code-Dateien, 36 Nennungen, alle in Kommentaren.
* [x] **Achtung `scripts/check-dummies.mjs`:** Die `ANERKANNT`-Liste nennt „Backlog 1.18"
      und „Backlog R1". 1.18 ist eine **echte** Kundennummer und bleibt; R1 wird R1.
      Ein falscher Eintrag bricht den Build nicht, führt aber in die Irre.

### ✅ Phase 3 — Kundenkommunikation nachziehen
* [x] `docs/uebergabe-schleife-1.md` nennt die drei Blocker unter R5, R6, R10.
      **Diese Übergabe ist an André gegangen.** Beim Umbenennen einen Hinweis ergänzen:
      welche alte Nummer welcher neuen entspricht — sonst versteht der Empfänger die
      Fortschreibung nicht.
* [x] Empfehlung: André die drei Blocker **im Klartext** nennen (Impressum,
      Datenschutz, Zugangsdaten) statt über eine Nummer. Bei drei Punkten ist der
      Klartext kürzer als jede Nummernerklärung.

### ✅ Phase 4 — Wächter gegen Rückfall
* [x] Prüfskript, das `docs/` gegen die Nummernräume prüft: Eine Nennung von `1.x` über
      1.26, `2.x` über 2.27 oder `3.x` über R9 ist ein Fehler, solange keine neue
      Schleife importiert wurde.
* [x] **Pflichtfrage vor dem Bau** (`CLAUDE.md`, Umsetzungsprinzipien):
      *Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?*
      → Sie besteht, wenn jemand einen Repo-Befund unter einer **freien niedrigen**
      Kundennummer ablegt (etwa 3.20). Das fängt sie nicht. Sie fängt nur den
      Überlauf. Grenze im Skript dokumentieren.

---

## Aufwand

Rund eine Sitzung. Der Großteil ist Prüfarbeit, nicht Tipparbeit: Jede der 221
Nennungen muss im Kontext gelesen werden, weil Kunden- und Repo-Nummern im selben
Absatz nebeneinander vorkommen.

**Referenzen:**
`docs/backlog/offene-punkte-konsolidiert.md`
`docs/backlog/tasks/2026-09-06-schleifen-2-3-import-tasks.md`
`docs/uebergabe-schleife-1.md`
