# Backlog CarCare Center — Einstiegspunkt

**Hier anfangen.** Diese Datei ist der Index über alle Kundenaufgaben aus den
Vor-Ort-Reviews mit André Bosse. Wer eine Aufgabennummer sucht („was ist 2.26?"),
findet sie über die Tabelle unten.

**Stand:** 2026-09-06 · **Website:** `carcare-center.vercel.app`, **noch nicht öffentlich**

---

## Die vier Listen

| Datei | Inhalt | Punkte | Nummernraum |
|---|---|---|---|
| [`schleife-1.md`](schleife-1.md) | Erste Review-Runde, **abgeschlossen** (25 von 29 umgesetzt) | 26 | **1.1 – 1.26** |
| [`schleife-2.md`](schleife-2.md) | Zweite Review-Runde | 27 | **2.1 – 2.27** |
| [`schleife-3.md`](schleife-3.md) | Dritte Review-Runde, enthält 6 offene Entscheidungen | 37 | **3.1 – 3.37** |
| [`nicht-relevant.md`](nicht-relevant.md) | Ohne Schleifenzuordnung — 8 abgenommene Entscheidungen, 5 offene Punkte | 13 | *ohne Nummer* |
| | **Summe** | **103** | |

## Auswertungen

| Datei | Wozu |
|---|---|
| [`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md) | **Was ist wirklich offen?** Gegen den Code geprüft, nach Dringlichkeit sortiert, mit der Nummernkollision |
| [`../uebergabe-schleife-1.md`](../uebergabe-schleife-1.md) | Übergabe nach Schleife 1: was gebaut wurde, was bei André liegt, Fallen für Nachfolger |

## Quelle

[`quelle/2026-09-06-alle-schleifen.csv`](quelle/2026-09-06-alle-schleifen.csv) —
die vom Kunden gelieferte Gesamtliste, **unverändert**. Alle drei Schleifen in einer
Datei, 103 Zeilen.

---

## ⚠️ Zwei Dinge, die man wissen muss

### 1. Die Nummern sind rekonstruiert, nicht original

Die Quell-CSV trägt **keine Nummern**. Die Zuordnung 1.x/2.x/3.x ist aus der Sortierung
abgeleitet:

> Innerhalb jedes Schleifen-Blocks läuft die CSV **rückwärts** zur Nummerierung.
> Die letzte Zeile eines Blocks ist `x.1`.

Das ist keine Vermutung. Schleife 1 lag bereits ausformuliert im Repo — **alle 26
Ableitungen stimmen damit überein**. Zusätzlich lösen sich beide bisher toten Verweise
wortgenau auf: `2.26` = Zusatzleistungsliste, `3.17` = Formularbau zuletzt.
Beleg: [`tasks/2026-09-06-schleifen-2-3-import-tasks.md`](tasks/2026-09-06-schleifen-2-3-import-tasks.md)

### 2. Die Nummern 3.32–3.40 sind doppelt belegt

Bevor die Kundenliste vorlag, wurden im Repository eigene Befunde unter 3.32–3.40
abgelegt. Beim Kunden bedeuten fünf dieser Nummern etwas anderes.
**Betroffen sind die beiden Livegang-Blocker, die André unter 3.33 und 3.34 kennt.**
Gegenüberstellung und Auflösung:
[`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md) ·
Umbenennungsplan: [`tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`](tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md)

---

## Schnellzugriff: Was blockiert den Livegang?

Drei Punkte, alle bei André, alle rechtlich:

1. **Impressumsangaben vervollständigen** — Handwerkskammer, Berufsbezeichnung,
   Verbraucherstreitbeilegung, Telefonnummer *(repo-lokal „3.33")*
2. **Datenschutzerklärung schreiben** — Faktenblatt liegt bereit *(repo-lokal „3.34")*
3. **Zugangsdaten für den Formularversand** — hängt an Punkt 2 *(repo-lokal „3.38")*

Details und Wortlaut in [`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md).
