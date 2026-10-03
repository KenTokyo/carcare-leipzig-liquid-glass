# Keramik- und Nanoversiegelung als „Gewünschte Leistung“

**Auftrag (User, 2026-10-03):** „Pack bitte Nanoversiegelung und Keramikversiegelung in dem Formular mit in die Liste
der gewünschten Leistungen. Immer wenn einer der Beiden ausgewählt wird, muss es auch automatisch in der Box der
Zusatzleistungen ausgewählt sein.“
**Backlog:** 6.6 (seit 02.10. in 6.7 aufgegangen, für Keramik und Nano wieder aufgenommen) · 6.7 (Andrés Regeln gelten
weiter) · **Branch:** `2026-10-02-stimmen-zusatzregeln`
**Wunsch des Users (03.10.):** keine lange Prüfung. Eine Kurzprüfung genügt, den Abschlusstest macht der User.

## Abwägung vor dem Code

**Andrés Regel (6.7) bleibt:** Keramik und Nano gibt es nur zusammen mit der Brillant Außenpflege oder der
Lackaufbereitung. Wird eine Versiegelung als Leistung gewählt, steht das Paket noch nicht fest. Das Formular sagt das
unter der Auswahl, und die Mail markiert „Paket offen“. Die Werkstatt klärt es mit dem Kunden; das Formular schickt eine
Anfrage, keine Buchung. Ohne diesen Hinweis widerspräche das Formular den Kacheln und der FAQ („Nur zusammen mit …
buchbar“), und der Kunde erführe erst am Telefon von einem zweiten Posten.

**Lösungswege:**
- (a) eigene IDs je Leistung (`versiegelung-keramik`) mit Zuordnung. Das wären zwei Schlüssel für dieselbe Sache, und die
  Preiskachel müsste sich für einen entscheiden.
- (b) ✔ **dieselbe ID wie die Zusatzleistung** (wie bei 6.6 vom 28.09.), Merkmal `auchAlsLeistung` in
  `data/zusatzleistungen.ts`.
  - Die Leistung schließt ihre Zusatzleistung ein: `bereinigteZusaetze` setzt sie an den Anfang. Formular, Server und
    Kachel-Vorauswahl folgen damit EINER Regel.
  - Die frühere Mehrdeutigkeit der Kachel-Vorauswahl entfällt, denn beide Deutungen ergeben dasselbe: Leistung und
    Kästchen.
- (c) ein Pflichtfeld „Paket dazu“ (Brillant / Lack / Beratung). Das wäre ganz regelkonform, aber ein neues Feld mit
  neuer Mailzeile, und es ist nicht beauftragt. → Vorschlag für später.
- (d) vier kombinierte Einträge („Brillant Außenpflege + Keramikversiegelung“ …): nicht das, was der User beschrieben
  hat, und die Liste wird lang.

**Weitere Zusatzleistungen zu einer Versiegelung als Leistung:** Erlaubt ist, was zu JEDEM möglichen Paket der
Versiegelung passt, denn das Paket legt erst die Werkstatt fest. Heute ist das alles außer der anderen Versiegelung
(Keramik ⟂ Nano).

**Wechsel von der Versiegelung auf ein Paket:** Die Versiegelung bleibt angehakt, wenn sie zum neuen Paket buchbar ist
(Brillant, Lack). So gibt der Kunde sein Paket an, und der Hinweis unter der Auswahl sagt ihm das. Bei anderen Paketen
fällt sie heraus, mit dem bekannten Hinweis „Abgewählt: … (nur zusammen mit …)“.

### ✅ Phase 1 — Regeln und Daten
* [x] `data/zusatzleistungen.ts`: `auchAlsLeistung` an Keramik und Nano, Kopf nachgezogen (Frontscheibe bleibt nur
      Zusatzleistung)
* [x] `data/leistungsauswahl.ts`: Optionen aus den markierten Zusatzleistungen (Name und ID aus einer Quelle), Merkmal
      `zusatzleistung`, eingereiht nach der Leasingrückgabe; jetzt 10 Optionen
* [x] `data/zusatzregeln.ts`: Zustand 4 (`festAngehakt`, `istZusatzAlsLeistung`), `bereinigteZusaetze` setzt die
      Versiegelung vorn ein (geht so auch Keramik ⟂ Nano vor), `passtZu` mit „zu JEDEM möglichen Paket“, `paketHinweis`
      (erster Satz aus `regelSaetze`) und `paketOffen`; Ladeprüfung: gleiche ID nur mit `auchAlsLeistung`, `zu` nur Pakete
* [x] `data/anfrageSchema.ts`: Mail nennt „Keramikversiegelung (Paket offen: Brillant Außenpflege oder Lackaufbereitung)“
**Referenzen:**
`data/zusatzregeln.ts`
`data/leistungsauswahl.ts`
`docs/backlog/schleife-6.md` (6.6, 6.7)

### ✅ Phase 2 — Formular
* [x] `components/formulare/TerminFelder.tsx`: Hinweis unter der Auswahl (`aria-describedby` nur, solange er steht),
      Liste klappt auf, das Kästchen ist angehakt, inaktiv und blau gerahmt, darunter „Als gewünschte Leistung gewählt“
* [x] `components/RequestForm.tsx`: Startwerte (Preiskachel) schließen die Zusatzleistung ein; Wechsel und Anhaken
      laufen schon über `bereinigteZusaetze`
**Referenzen:**
`components/formulare/TerminFelder.tsx`
`components/RequestForm.tsx`

### ✅ Phase 3 — Server, Test, Doku
* [x] `api/anfrage.ts`: nur Kommentar; `LEISTUNGS_IDS` kennt die Versiegelungen von selbst, `bereinigteZusaetze` hakt an
* [x] `scripts/test-email.tsx`: Keramik als Leistung ohne Kästchen → 200, Mail mit „Paket offen“ und Preis; Nano als
      Leistung mit Keramik + Motor → Keramik fällt heraus, Motor bleibt; Frontscheibe als Leistung → 400
* [x] Backlog 6.6 (Notiz, Status „wieder seit 03.10.“), O9 um die Paketfrage ergänzt
      (`2026-10-02-stimmen-und-zusatzregeln-optimierung-tasks.md`), Memory `zusatzleistungen-single-source`, Kommentar
      an der Preiskachel (`data/detailing.ts`)
**Referenzen:**
`api/anfrage.ts`
`scripts/test-email.tsx`

### ✅ Phase 4 — Kurzprüfung (kein Messlauf, Wunsch des Users)
* [x] `tsc` grün · `npm run test:email` PASS (beide Läufe) · **Build 03.10., 01:56:06** grün (Prerender 29/29, FAQ,
      Dummies, Gedankenstriche 0)
* [x] Regelmatrix 10 × 8 per Skript: Die acht bisherigen Zeilen sind unverändert (Andrés Tabelle). Keramik als Leistung:
      Keramik FEST, Nano gesperrt („Entweder Keramik- oder Nanoversiegelung“), die übrigen sechs frei; Nano spiegelbildlich.
      Wechsel: Keramik → Brillant/Lack bleibt angehakt, → Innenraum/„Nur Zusatzleistungen“ fällt heraus, mit Grund
* [x] Dev-Server (Port 3007, `/kontakt`): Keramik wählen → Liste offen, Kästchen angehakt und inaktiv mit „Als
      gewünschte Leistung gewählt“, Nano gesperrt, Hinweis unter der Auswahl (`aria-describedby`); Ozon dazu, dann
      Brillant → Keramik und Ozon bleiben; Innenraum → „Abgewählt: Keramikversiegelung (nur zusammen mit …)“; Nano →
      Nano fest, Keramik gesperrt. Preiskachel „Keramikversiegelung“ auf `/aussenaufbereitung-leipzig` → Dialog,
      „Aufbereitungstermin“ → Leistung Keramik vorgewählt, Kästchen fest, Liste offen

---

## Kommentare
### Phasen 1–4
**Eingehalten**: Wunsch des Users wörtlich (beide Versiegelungen in der Liste, Kästchen automatisch angehakt) ✅, Andrés
Regel bleibt sichtbar statt still umgangen ✅, eine Quelle für Name und ID ✅, Formular und Server mit derselben Funktion ✅,
Ladeprüfung gegen Tippfehler erweitert ✅, Barrierefreiheit (Hinweis per `aria-describedby`, Grund im Kästchentext) ✅,
keine Gedankenstriche im sichtbaren Text ✅, unter 700 Zeilen ✅, kein Messlauf (Wunsch des Users) ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Versiegelung als Leistung, Paket offen**: Laut Andrés Regel gibt es Keramik und Nano nur zu Brillant oder
   Lackaufbereitung. Als Leistung steht die Versiegelung jetzt allein in der Liste. Gelöst mit dem Hinweis unter der Auswahl
   und „Paket offen“ in der Mail. Ob der Kunde das Paket gleich mit angeben soll, ist als Rückfrage an André in O9
   aufgenommen (Weg (c) oben).
2. 🟢 **Niedrig — angehaktes, inaktives Kästchen erscheint grau**: So zeichnet der Browser jedes inaktive Kästchen. Blauer
   Rahmen und der Satz „Als gewünschte Leistung gewählt“ zeigen den Zustand trotzdem. Ein eigenes Kästchen wäre mehr Code
   für wenig Gewinn, deshalb bewusst so gelassen.
3. 🟢 **Niedrig — `data/detailing.ts` nach dem Build geändert** (nur ein Kommentar an der Preiskachel). Die Messwerkzeuge
   melden `dist/` deshalb als älter; der abschließende Prüflauf beginnt ohnehin mit `npm run build`.
