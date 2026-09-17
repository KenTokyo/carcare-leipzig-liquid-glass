# Backlog CarCare Center — Einstiegspunkt

**Hier anfangen.** Diese Datei ist der Index über alle Kundenaufgaben aus den
Vor-Ort-Reviews mit André Bosse. Wer eine Aufgabennummer sucht („was ist 2.26?"),
findet sie über die Tabelle unten.

**Stand:** 2026-09-06, gegen den Code abgeglichen am 2026-09-10, zuletzt fortgeschrieben am **2026-09-14** · **Website:** `carcare-center.vercel.app`
**Letzter Abgleich:** [`tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md`](tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md)
**Zuletzt erledigt (2026-09-14):** 2.1 (Kartenflächen), 2.3 (Ablauf-Animation), 4.2 + 4.18 (Betriebsfläche 3.500 m²) — `docs/schleife-2-4-karten-ablauf-flaeche/`
**Nach Art der Zulieferung sortiert** (Fotos · Texte · Logos · Pricing): [`../schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md`](../schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md)

> **Alles, was hier deployt wird, geht nur in diese Preview-Umgebung** — sie dient der
> Abstimmung mit dem Kunden. Live unter `www.carcare-center.de` läuft weiterhin der alte
> Auftritt. Sichtbare Platzhalter und unvollständige Rechtstexte sind hier deshalb in
> Ordnung, solange sie **markiert** sind.

---

## Die fünf Listen

| Datei | Inhalt | Punkte | Nummernraum |
|---|---|---|---|
| [`schleife-1.md`](schleife-1.md) | Erste Review-Runde, **abgeschlossen** (25 von 29 umgesetzt) | 26 | **1.1 – 1.26** |
| [`schleife-2.md`](schleife-2.md) | Zweite Review-Runde | 27 | **2.1 – 2.27** |
| [`schleife-3.md`](schleife-3.md) | Dritte Review-Runde, enthält 6 offene Entscheidungen | 37 | **3.1 – 3.37** |
| [`schleife-4.md`](schleife-4.md) | Vierte Runde: Feedbackliste von André (2026-09-10), **Originalnummern**, 10 Rückfragen | 21 | **4.1 – 4.21** |
| [`nicht-relevant.md`](nicht-relevant.md) | Ohne Schleifenzuordnung — 8 abgenommene Entscheidungen, 5 offene Punkte | 13 | *ohne Nummer* |
| | **Summe** | **124** | |

## Auswertungen

| Datei | Wozu |
|---|---|
| [`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md) | **Was ist wirklich offen?** Gegen den Code geprüft, nach Dringlichkeit sortiert, mit der Nummernkollision |
| [`../uebergabe-schleife-1.md`](../uebergabe-schleife-1.md) | Übergabe nach Schleife 1: was gebaut wurde, was bei André liegt, Fallen für Nachfolger |

## Quelle

[`quelle/2026-09-06-alle-schleifen.csv`](quelle/2026-09-06-alle-schleifen.csv) —
die vom Kunden gelieferte Gesamtliste, **unverändert**. Alle drei Schleifen in einer
Datei, 103 Zeilen.

[`quelle/2026-09-10-schleife-4.csv`](quelle/2026-09-10-schleife-4.csv) — Andrés Feedbackliste
„Schleife 4", Werte **unverändert** aus der xlsx exportiert (Rückleseprobe: identisch), ohne die
SharePoint-Metadaten der Datei. Original: OneDrive, Kunden/CarCare-Center,
`car-Care-Center_Website_Feedback Schleife 4.xlsx`. 21 Zeilen.

---

## ⚠️ Zwei Dinge, die man wissen muss

### 1. Die Nummern von Schleife 1–3 sind rekonstruiert, nicht original

> **Ausnahme Schleife 4:** Andrés Liste trägt eine eigene Spalte „Nr." — 4.1–4.21 sind seine Nummern.

Die Quell-CSV trägt **keine Nummern**. Die Zuordnung 1.x/2.x/3.x ist aus der Sortierung
abgeleitet:

> Innerhalb jedes Schleifen-Blocks läuft die CSV **rückwärts** zur Nummerierung.
> Die letzte Zeile eines Blocks ist `x.1`.

Das ist keine Vermutung. Schleife 1 lag bereits ausformuliert im Repo — **alle 26
Ableitungen stimmen damit überein**. Zusätzlich lösen sich beide bisher toten Verweise
wortgenau auf: `2.26` = Zusatzleistungsliste, `3.17` = Formularbau zuletzt.
Beleg: [`tasks/2026-09-06-schleifen-2-3-import-tasks.md`](tasks/2026-09-06-schleifen-2-3-import-tasks.md)

### 2. Die Nummern R4–R12 sind doppelt belegt

Bevor die Kundenliste vorlag, wurden im Repository eigene Befunde unter R4–R12
abgelegt. Beim Kunden bedeuten fünf dieser Nummern etwas anderes.
**Betroffen sind die beiden Livegang-Blocker, die André unter R5 und R6 kennt.**
Gegenüberstellung und Auflösung:
[`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md) ·
Umbenennungsplan: [`tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`](tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md)

---

## Schnellzugriff: Was blockiert den Livegang?

Zwei Punkte bei André, beide rechtlich — dazu ein technischer Nachweis bei uns
*(Stand 2026-09-10)*:

1. **Impressumsangaben vervollständigen** — Handwerkskammer, Berufsbezeichnung,
   Verbraucherstreitbeilegung, Telefonnummer *(repo-lokal „R5")*
2. **Datenschutzerklärung schreiben** — Faktenblatt liegt bereit, mit Nachtrag zum
   Netcup-Versand *(repo-lokal „R6")*. **Dringlicher geworden:** Seit 2026-09-08 sendet
   die Vorschau Formulare tatsächlich.
3. ~~**Zugangsdaten für den Formularversand**~~ — **am 2026-09-08 hinterlegt** (Netcup-SMTP
   statt Resend). Offen ist nur noch der Live-Test aller vier Formulare mit
   Empfangsnachweis *(repo-lokal „R10")*

Details und Wortlaut in [`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md).
