# Sofort umsetzbare Punkte aus Schleife 2 und 3 + Video-Platzhalter

**Angelegt:** 2026-09-06
**Auftrag:** Die ohne Zulieferung umsetzbaren Punkte aus `schleife-2.md`/`schleife-3.md`
direkt umsetzen. Für die Drohnenvideos, die der Kunde noch schneidet, **nur Platzhalter**
bauen, an denen das fertige Material eingehängt werden kann.

## Rahmenbedingungen aus dem Auftrag

* **Deployments gehen nur in die Preview-Umgebung, nicht live.** Unvollständige
  Rechtstexte und sichtbare Platzhalter sind hier ausdrücklich in Ordnung — sie werden
  markiert, halten aber nichts auf.
* **2.23 bleibt wie es ist.** Der Widerspruch zwischen Review („Weiterleitung zu
  reparatur.info statt eigenem Formular") und Umsetzung (eigenes Schadenformular) ist
  **eine bewusste Kundenentscheidung**. Wird im Nachgang angepasst, nicht jetzt.
* **Keine Kundenmail.** Zulieferungen werden nur dokumentiert, nicht angefordert.

---

### ✅ Phase 1 — Backlog auf den Entscheidungsstand bringen
**Ziel:** Der Widerspruch 2.23 darf nicht als offener Konflikt stehen bleiben, sonst
räumt ihn die nächste Sitzung „auf". Und der Preview-Rahmen muss dort stehen, wo die
Livegang-Blocker stehen.

* [x] 2.23 in `schleife-2.md` von „⚠️ widerspricht" auf „bewusste Kundenentscheidung"
* [x] Preview-Hinweis in `offene-punkte-konsolidiert.md` über die Blocker-Tabelle
* [x] `README.md` im Backlog entsprechend nachziehen

### ✅ Phase 2 — 3.7 Text „Alle Marken"
**Ziel:** Vom Kunden fertig formulierter Ersatztext, wörtlich übernehmen.

* [x] `pages/AccidentRepairPage.tsx` — Karte „Alle Marken"
* [x] Prüfen, ob der Satz an weiteren Stellen dieselbe Aussage macht (FAQ, Schema)

### ✅ Phase 3 — 2.17 „Karosseriearbeiten" → „Karosserie- und Lackierarbeiten"
* [x] Karte auf `/unfallinstandsetzung-leipzig`
* [x] Alle weiteren Fundstellen einzeln bewerten — nicht global ersetzen

### ✅ Phase 4 — 3.5 „Jetzt bewerben"-Banner schaltbar machen
**Ziel:** Ein Schalter an einem Ort, wie bei `STELLEN_POPUP_AKTIV`.

* [x] `BEWERBEN_BANNER_AKTIV` in `data/jobs.ts`
* [x] `components/JobBanner.tsx` liest ihn

### ✅ Phase 5 — 2.9 und 2.10 Aufbereitungstexte klarstellen
* [x] 2.9: Paket „exklusiv" betrifft auch den Innenraum
* [x] 2.10: Brillant Außenpflege ist Voraussetzung für Keramikversiegelung,
      die Versiegelung selbst kommt hinzu

### ✅ Phase 6 — 3.9 Recherche: wiederholter oberer Block
* [x] Messen statt schätzen: wie oft steht derselbe Block, wie viel Text ist es
* [x] Empfehlung mit Begründung, keine Umsetzung ohne Entscheidung

### ✅ Phase 7 — Video-Platzhalter (3.20, 3.21, 3.18)
**Ziel:** Der Kunde liefert die Drohnenvideos nach. Das Einhängen soll ein
**Dateneintrag** sein, kein Umbau.

* [x] `data/videos.ts` als einzige Quelle der Videoplätze
* [x] `components/BetriebsVideo.tsx` — zeigt Video oder markierten Platzhalter
* [x] Drei Plätze: `/ueber-uns` Hero (3.20), `/ueber-uns` Betrieb (3.21),
      `/karriere` Betrieb (3.18)
* [x] An den Dummy-Wächter anschließen und in `ANERKANNT` eintragen

### ✅ Phase 8 — Bauen, prüfen, ausliefern
* [x] `npm run build` grün, alle sechs Wächter
* [x] Sichtprüfung im Browser
* [x] Commit und Push

---

## Kommentare

### Phasen 1–8
**Eingehalten:** Mobile-First (alle neuen Sektionen ohne feste Breiten) ✅,
unter 700 Zeilen je Datei ✅ (größte neue Datei: `data/videos.ts`, 91 Zeilen),
Daten in `data/` statt in Komponenten ✅, kein Mojibake ✅,
Dev-Server **nicht** gestartet ✅ (stattdessen `carcare-preview` auf dem Build),
Wortlaut des Kunden wörtlich übernommen ✅,
Schema an den sichtbaren Text angeglichen (SEO-GEO §5) ✅,
neuer Platzhalter am Wächter angemeldet ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🟠 **Hoch: Eine Einfügung kippt die Hintergrund-Abwechslung der ganzen Seite.**
   Die Sektionen auf `/ueber-uns` wechseln streng zwischen `bg-white` und
   `bg-gray-50/70`. Die neue Videosektion erzeugte zwei weiße Blöcke nebeneinander —
   die Sektionsgrenze verschwindet dann optisch. **Behoben**, indem der Rest der Seite
   mitgedreht wurde (4 Sektionen). *Merksatz für später: In einer streng
   abwechselnden Folge gibt es keine schmerzfreie Einfügestelle — entweder den Tail
   mitdrehen oder bewusst eine Dopplung in Kauf nehmen.*

2. 🟠 **Hoch: Screenshots im Browser-Bereich waren wertlos, solange er ausgeblendet ist.**
   Vier Aufnahmen kamen komplett weiß zurück, obwohl das DOM Element, Größe
   (1206×679), `opacity: 1` und den richtigen Text meldete. Ursache: Ein
   ausgeblendeter Bereich wird nicht gezeichnet. **Genau die Falle aus
   `docs/uebergabe-schleife-1.md`** („Habe ich den Defekt gemessen oder meinen
   Aufbau?"). Verifiziert wurde deshalb über DOM-Abfrage und über das
   ausgelieferte HTML — beides belastbarer als ein Bild.

3. 🟡 **Mittel: `zoom` und `video` schließen sich in `PhotoBackdrop` aus.**
   Der `zoom`-Zweig bemisst das Bild über die Höhe und blendet die linke Kante per
   `mask-image` aus; für ein Video wäre beides eigens zu prüfen. Ist beides gesetzt,
   gewinnt sichtbar das Foto. Im Code dokumentiert. Betrifft heute niemanden —
   `/ueber-uns` nutzt `zoom` nicht —, wäre aber eine stille Überraschung, wenn später
   eine `zoom`-Seite ein Video bekommen soll.

4. 🟡 **Mittel: 2.25 ist weiterhin wörtlich offen.** Die fünf Optionen des
   Geschäftskundenformulars stimmen, aber Option 4 heißt weiterhin
   `Rahmenvertrag / laufende Zusammenarbeit`. Der Review verlangt, „laufende
   Zusammenarbeit" zu **streichen**. Bewusst **nicht** angefasst: Ob der Begriff
   zusammengeführt oder entfernt werden soll, ist eine Kundenfrage — das Streichen
   könnte eine gemeinte Vertragsform unsichtbar machen.

5. 🔵 **Niedrig: `components/AccidentFocus.tsx` mitgezogen, obwohl verwaist.**
   Die Komponente hat 0 Importe und steht auf der Aufräumliste. Die Umbenennung dort
   kostet nichts und verhindert, dass der Text auseinanderläuft, falls sie doch noch
   verwendet wird — dieselbe Begründung wie bei `Jobs.tsx`, das bewusst geparkt ist.

**Kein Optimierungsplan nötig:** Finding 1 und 2 sind behoben bzw. Verfahrenshinweise,
3 ist dokumentiert, 4 und 5 sind bewusste Entscheidungen mit Begründung.
