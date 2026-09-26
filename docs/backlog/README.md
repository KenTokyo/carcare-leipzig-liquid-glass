# Backlog CarCare Center — Einstiegspunkt

**Hier anfangen.** Diese Datei ist der Index über alle Kundenaufgaben aus den
Vor-Ort-Reviews mit André Bosse. Wer eine Aufgabennummer sucht („was ist 2.26?"),
findet sie über die Tabelle unten.

**Stand:** 2026-09-06, gegen den Code abgeglichen am 2026-09-10 und **2026-09-17**, zuletzt fortgeschrieben am **2026-09-25** (Schleife 5) · **Website:** `carcare-center.vercel.app`
**Offen, gezählt am 2026-09-25** (nach den Regeln von `npm run push-stand`): Schleife 2: **3** · Schleife 3: **5** · Schleife 4: **0** (abgeschlossen) · **Schleife 5: 43** · Repo-Befunde, Schleife 1 und Querschnitt: **18** — zusammen **69**. *(Die Zählung vom 17.09. — 5 · 13 · 21 · 3 — ist überholt.)*
**Letzter Abgleich:** [`tasks/2026-09-17-abgleich-offene-punkte-tasks.md`](tasks/2026-09-17-abgleich-offene-punkte-tasks.md) (davor: [`tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md`](tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md))
**Neu (2026-09-25): Schleife 5** aus dem Meeting mit André — [`schleife-5.md`](schleife-5.md), 44 Punkte. Livegang für die Woche ab 28.09. geplant, nächster Termin **Mo 28.09., 10:00–11:30**. Import und Befunde: [`tasks/2026-09-25-schleife-5-import-tasks.md`](tasks/2026-09-25-schleife-5-import-tasks.md)
**Zuletzt erledigt (2026-09-16):** Kundenentscheidungen zu Preisen (4.4, 4.7, 4.9, 4.10, 3.35), Texten (4.3, 4.8, 4.21), BVAT (3.12, 4.13), Partnerlogos (riparo, Porsche Zentrum — 3.16/3.31 teilweise) und „Schaden melden" → reparatur.info (2.23, 3.33, 3.34); R13 erledigt — `docs/preise-partner-schadenlink/`
**Davor (2026-09-14):** 2.1 (Kartenflächen), 2.3 (Ablauf-Animation), 4.2 + 4.18 (Betriebsfläche 3.500 m²) — `docs/schleife-2-4-karten-ablauf-flaeche/`
**Nach Art der Zulieferung sortiert** (Fotos · Texte · Logos · Pricing): [`../schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md`](../schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md)

> **Alles, was hier deployt wird, geht nur in diese Preview-Umgebung** — sie dient der
> Abstimmung mit dem Kunden. Live unter `www.carcare-center.de` läuft weiterhin der alte
> Auftritt. Sichtbare Platzhalter und unvollständige Rechtstexte sind hier deshalb in
> Ordnung, solange sie **markiert** sind.

---

## Die sechs Listen

| Datei | Inhalt | Punkte | Nummernraum |
|---|---|---|---|
| [`schleife-1.md`](schleife-1.md) | Erste Review-Runde, **abgeschlossen** (25 von 29 umgesetzt) | 26 | **1.1 – 1.26** |
| [`schleife-2.md`](schleife-2.md) | Zweite Review-Runde; 2.2, 2.7, 2.8, 2.26 seit 2026-09-25 in Schleife 5 aufgegangen | 27 | **2.1 – 2.27** |
| [`schleife-3.md`](schleife-3.md) | Dritte Review-Runde; von 6 offenen Entscheidungen ist noch 1 offen (3.37) — 3.32 am 2026-09-25 beantwortet, 3.36 in 5.4 aufgegangen; 3.30 freigegeben | 37 | **3.1 – 3.37** |
| [`schleife-4.md`](schleife-4.md) | Vierte Runde: Feedbackliste von André (2026-09-10), **Originalnummern**; **abgeschlossen** am 2026-09-25 — 4.1 gestrichen, 4.14 durch die Bereichsvideos erledigt, 4.19 beantwortet (Umsetzung 5.24) | 21 | **4.1 – 4.21** |
| [`schleife-5.md`](schleife-5.md) | Fünfte Runde: Meeting mit André am 2026-09-25 (Transkript), **Nummern von OALAB** in Gesprächsreihenfolge; 43 von 44 offen | 44 | **5.1 – 5.44** |
| [`nicht-relevant.md`](nicht-relevant.md) | Ohne Schleifenzuordnung — 8 abgenommene Entscheidungen, 5 offene Punkte | 13 | *ohne Nummer* |
| | **Summe** | **168** | |

**Statuszeichen:** ✅ erledigt · 🟨 teilweise · ⏸️ zurückgestellt · 🔁 in einer späteren Schleife aufgegangen
(dort geführt und gezählt, hier gestrichen — **nicht** erledigt). `npm run push-stand` zählt 🔁-Zeilen nicht mit.

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

**Schleife 5:** Transkript des Meetings vom 2026-09-25 („oalab x carcare center – finale Anpassungen der
Website", DOCX beim User) — **bewusst nicht im Repository**: Es ist ein vollständiges Gesprächsprotokoll mit
persönlichen Nebenbemerkungen und Namen von Mitarbeitenden. Die Zeitmarken in `schleife-5.md` führen zur Stelle
im Original.

---

## ⚠️ Zwei Dinge, die man wissen muss

### 1. Die Nummern von Schleife 1–3 sind rekonstruiert, nicht original

> **Ausnahme Schleife 4:** Andrés Liste trägt eine eigene Spalte „Nr." — 4.1–4.21 sind seine Nummern.
>
> **Ausnahme Schleife 5:** 5.1–5.44 hat OALAB auf Wunsch des Users aus dem Meeting-Transkript vergeben, in der
> Reihenfolge des Gesprächs. André kennt diese Nummern nur, wenn er die Liste bekommt.

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
*(Stand 2026-09-10; **Zeitpunkt für 1 und 2 laut User: zum Schluss**, 2026-09-16)*:

> ⚠️ **Stand 2026-09-25:** Der Livegang ist für die Woche ab 28.09. geplant (5.1) — „zum Schluss" ist damit
> jetzt. Punkte 1 und 2 wurden im Meeting **nicht** besprochen; geklärt ist nur die Telefonnummer (5.30).

1. **Impressumsangaben vervollständigen** — Handwerkskammer, Berufsbezeichnung,
   Verbraucherstreitbeilegung, Telefonnummer *(repo-lokal „R5")*
2. **Datenschutzerklärung schreiben** — Faktenblatt liegt bereit, mit Nachtrag zum
   Netcup-Versand *(repo-lokal „R6")*. **Dringlicher geworden:** Seit 2026-09-08 sendet
   die Vorschau Formulare tatsächlich.
3. ~~**Zugangsdaten für den Formularversand**~~ — **am 2026-09-08 hinterlegt** (Netcup-SMTP
   statt Resend). Offen ist nur noch der Live-Test der **drei** Formulare mit eigenem Versand
   (Schaden läuft seit 2026-09-16 über reparatur.info) mit Empfangsnachweis *(repo-lokal „R10")*

Details und Wortlaut in [`offene-punkte-konsolidiert.md`](offene-punkte-konsolidiert.md).
