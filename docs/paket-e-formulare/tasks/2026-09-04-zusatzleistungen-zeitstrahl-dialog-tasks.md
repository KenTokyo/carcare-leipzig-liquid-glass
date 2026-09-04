# Zusatzleistungen, Zeitstrahl, Anfrage-Dialog

**Branch:** `paket-e/zusatzleistungen-zeitstrahl-dialog`
**Angelegt:** 2026-09-04
**Auftrag:** drei Punkte des Users, alle drei mit demselben Grundsatz:
*Ergänzen soll ein Eintrag in den Daten sein, kein Umbau.*

## Vorgaben

1. **Zusatzleistungen im Aufbereitungsformular** (1.18). Zunächst zwei Dummy-Einträge,
   „Zusatzleistung 1" und „Zusatzleistung 2", bewusst als Dummy erkennbar. Die echte
   Liste kommt später von André. Struktur so, dass Ergänzen ein Dateneintrag ist.
2. **Zeitleiste auf `/ueber-uns`** (1.27). Echter Zeitstrahl, nicht das heutige
   Kartenraster. Dummy-Inhalte „Meilenstein 1/2/3". Darstellung im Stil der
   Ablauf-Sektionen. Gründungsjahr 1998 bleibt der erste Eintrag.
3. **Terminanfrage-CTA öffnet ein echtes Pop-up**, keine Weiterleitung zum bestehenden
   Formular. Das Pop-up-Formular ersetzt perspektivisch das bestehende — deshalb
   eigenständige Komponente, die später an weiteren Stellen eingehängt werden kann,
   **kein Sonderfall einer Seite**.

## Ausgangslage (gemessen)

| Befund | Zahl |
|---|---|
| Verweise auf `#contact-termin` im Projekt (ohne fremde Worktrees) | **rund 40** |
| Zeitleiste heute | `ProcessList`, vierspaltiges Kartenraster, kein Strahl |
| Zusatzleistungen im `termin`-Formular | keine, nur ein einzelnes Auswahlfeld |

Die 40 Fundstellen sind der eigentliche Grund für die Architekturvorgabe bei Punkt 3:
Ein Dialog, der an jeder dieser Stellen einzeln verdrahtet werden müsste, wäre nach dem
dritten Einbau bereits inkonsistent.

---

### ✅ Phase 1 — Zusatzleistungen als eigene Datenquelle
**Ziel:** Die Liste steht an einer Stelle und wirkt von dort auf Formular und
Zusammenfassung. Ergänzen ist eine Zeile.

* [x] `data/zusatzleistungen.ts` — Typ, zwei Dummy-Einträge, `istDummy`-Kennzeichen.
* [x] `components/RequestForm.tsx`: `zusatzleistungen: string[]` im `termin`-Feldtyp,
  Kontrollkästchen-Gruppe als `<fieldset>` mit `<legend>`.
* [x] Dummy-Einträge sichtbar als solche markiert — sie sollen **nicht** wie ein
  fertiges Angebot aussehen.
* [x] Zurücksetzen nach dem Absenden räumt auch die Mehrfachauswahl.

**Referenzen:**
`data/zusatzleistungen.ts`
`components/RequestForm.tsx`

---

### ✅ Phase 2 — Echter Zeitstrahl auf /ueber-uns
**Ziel:** Ein Strahl, dem man die Abfolge ansieht — nicht vier gleichrangige Karten.

* [x] `components/Timeline.tsx` — waagerecht ab `lg`, senkrecht darunter, mit
  durchgehender Linie und nummerierten Knoten in der Formensprache von `ProcessList`.
* [x] `pages/UeberUnsPage.tsx`: fünf Stationen — 1998 Gründung, Meilenstein 1–3, Heute.
* [x] Die beiden bisherigen undatierten Phasentexte sind **nicht gelöscht**, sondern als
  Kommentar in der Datenstruktur erhalten — sie sind Kandidaten für die Meilenstein-Plätze.
* [x] Dummy-Stationen sichtbar als Platzhalter gekennzeichnet.

**Referenzen:**
`components/Timeline.tsx`
`pages/UeberUnsPage.tsx`

---

### ✅ Phase 3 — Anfrage-Dialog als eigenständige Komponente
**Ziel:** Ein Dialog, ein Ort, viele Auslöser.

* [x] `components/AnfrageDialog.tsx` — Provider, Dialog und Hook `useAnfrageDialog()`.
  Portal an `document.body` (Grund wie bei `JobPopup`: `.site-main-shell` trägt
  `transform: translateZ(0)` und bricht `position: fixed`).
* [x] Modal mit allem, was ein Modal braucht: Escape, Klick auf den Grund, Fokusfalle,
  Fokusrückgabe an den auslösenden Knopf, `aria-modal`, gesperrter Hintergrundscroll.
* [x] `components/Layout.tsx`: Provider einmal um die ganze Anwendung.
* [x] **Einhängen ist ein Dateneintrag:** `ANFRAGE_ZIELE` bildet Link-Ziele auf
  Formularvarianten ab. Jeder bestehende CTA mit diesem Ziel öffnet den Dialog, ohne
  dass eine der rund 40 Fundstellen angefasst werden muss.
* [x] Ohne JavaScript bleibt der Link ein Link — der bestehende Weg zum Formular
  funktioniert weiter.

**Referenzen:**
`components/AnfrageDialog.tsx`
`components/Layout.tsx`

---

### ✅ Phase 4 — Build, Prüfung, Dokumentation
* [x] Build mit allen Wächtern.
* [x] Sichtprüfung Zeitstrahl und Dialog, Desktop und mobil.
* [x] Backlog fortgeschrieben.

---

## Kommentare

Drei Fehler sind erst beim Pruefen aufgetaucht, keiner davon beim Lesen des Codes.
Alle drei sind behoben und unten mit der Messung dokumentiert, die sie gezeigt hat.

### Phase 1
**Eingehalten:** eine Datenquelle ✅, Dummy als Dummy erkennbar ✅, `<fieldset>` mit
`<legend>` statt Ueberschrift ✅, Zuruecksetzen vollstaendig ✅, 476 Zeilen ✅.

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch (behoben) — Absturz beim Reiterwechsel, Ursache aelter als diese Aenderung.**
   `RequestForm` bekam beim Wechsel der Variante ein neues `kind`, setzte die Werte aber
   erst in einem `useEffect` — also NACH dem Rendern. Ein Durchlauf lang rendert die
   Komponente damit die Felder der neuen Variante mit den Werten der alten. Solange alle
   Felder Zeichenketten waren, blieb das unsichtbar: ein fehlendes Feld ist `undefined`
   und rendert leer. Mit `zusatzleistungen: string[]` wurde daraus
   `undefined.includes(...)` — gemessen auf `/kontakt#contact-termin`, die Seite blieb weiss.
   **Zwei Teile:** Variantenwechsel laeuft jetzt waehrend des Renderns (Reacts Muster fuer
   „Zustand an geaenderte Props anpassen"), UND der Lesezugriff ist mit `?? []` abgesichert.
   Beides ist noetig: Der erste Fixversuch war nur der Renderwechsel, und der Absturz blieb —
   React laesst den laufenden Durchlauf zu Ende laufen und verwirft ihn erst danach, eine
   Ausnahme im Rumpf fliegt vorher.
2. 🟠 **Hoch (behoben) — geteilte Vorlage.** `initialState[kind]` wurde per Referenz in den
   Zustand gegeben. Bei Zeichenketten harmlos, mit einem Array waere es dieselbe Liste in
   Kontaktseite und Dialog gewesen. Jetzt `structuredClone`.
3. 🟠 **Hoch (bekannt, 1.17):** Die Zusatzleistungen werden erfasst und gehen nirgends hin —
   wie alle Formularfelder. Kein Netzwerkaufruf im Projekt.
4. 🟡 **Mittel (fuer die Zulieferung):** „Gewuenschte Leistung" und die Zusatzleistungen
   ueberschneiden sich inhaltlich („Lackpflege / Politur" ist beides denkbar). Beim
   Einpflegen der echten Liste ist zu trennen, was Paket und was Zusatz ist — sonst steht
   dieselbe Leistung zweimal zur Auswahl. Steht als Warnung in `data/zusatzleistungen.ts`.

### Phase 2
**Eingehalten:** echter Strahl ✅, Formensprache der Ablauf-Sektionen ✅, 1998 zuerst ✅,
Bestandstexte nicht verloren ✅, Kontrast gemessen statt geschaetzt ✅.

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch (behoben) — Kontrastregression durch die eigene Neugestaltung.**
   Die erste Fassung setzte den Text ohne Kartenflaeche direkt in die Sektion; als Strahl
   deutlich schoener. Auf `/ueber-uns` liegt `#geschichte` aber mit `bg-gray-50/70` ueber
   einem Werkstattfoto (`BackdropLayout`) — ueber den dunklen Fahrzeugen war Station 4
   praktisch unlesbar. `ProcessList` hatte das nie, weil seine Karten den Text abheben.
   Die Kartenflaeche ist zurueck, die Linie liegt in der Luecke dazwischen.
   **Nachgemessen am gerenderten Bild** (Glyphenmaske aus der Differenz zweier Aufnahmen,
   Alpha eingerechnet), 15 Messungen ueber alle fuenf Stationen:

   | Station | Grund gemessen | Beschreibung 14px | ungünstigstes Pixel |
   |---|---|---|---|
   | 1 Gruendung | `rgb(248,250,253)` | 6,74:1 | 6,74:1 |
   | 3 Meilenstein 2 | `rgb(245,247,250)` | 6,67:1 | 6,39:1 |
   | **4 Meilenstein 3** (ueber dem dunklen Fahrzeug) | `rgb(218,219,221)` | **5,85:1** | **5,23:1** |
   | 5 Heute | `rgb(243,244,246)` | 6,60:1 | 6,34:1 |

   Keine Unterschreitung von 4,5:1. Station 4 ist mit 5,23:1 die knappste.
2. 🟠 **Hoch (Messfehler im eigenen Werkzeug, behoben).** Der erste Messlauf meldete
   16,71:1 fuer `text-gray-600` — unmoeglich. Ursache: Das Skript las `rgba(21, 26, 33,
   0.72)` mit `match(/\d+/g)` und nahm die ersten drei Zahlen, also die VOLL DECKENDE
   Farbe. Die Tokens dieses Projekts sind halbtransparent; die sichtbare Farbe ist die
   ueber den Grund gerechnete Mischung. Genau der Fehler, vor dem
   `docs/tokens/2026-09-03-kontrast-tokens.md` warnt.
   **Lehre:** Ein Messwert, der zu gut aussieht, ist ein Befund ueber das Messgeraet.
3. 🟡 **Mittel (korrigiert):** Backlog 1.27 behauptete „Aktuell nur zwei Stationen".
   Tatsaechlich waren es vier. Der Eintrag war veraltet.
4. 🟡 **Mittel (bewusst):** Die drei Platzhalter tragen KEIN Jahr. Ein Zeitstrahl mit
   erfundenen Jahreszahlen waere schlimmer als eine sichtbare Luecke — eine Jahreszahl
   sieht aus wie eine geprueft Angabe. Sie zeigen „Jahr offen".

### Phase 3
**Eingehalten:** eigenstaendige Komponente ✅, kein Sonderfall einer Seite ✅, Einhaengen
als Dateneintrag ✅, Escape/Fokusfalle/Fokusrueckgabe/Scroll-Sperre ✅, auf drei
Bildschirmgroessen geprueft ✅.

**Auffaelligkeiten (nach Schwere):**

1. 🔴 **Kritisch (behoben) — Dialogkopf mobil unerreichbar.**
   Das Overlay trug `flex items-end sm:items-center` UND `overflow-y-auto` zugleich. Ist
   das Panel hoeher als der Viewport, laeuft der Ueberschuss bei dieser Kombination nach
   OBEN aus dem Container — und dorthin kann man nicht scrollen. Gemessen auf 390x844:
   Panel 1371px, Oberkante bei **-527px**, `scrollHeight === clientHeight`, der
   Formularkopf war nicht erreichbar. Auf dem Desktop trat es nicht auf, weil das Panel
   dort nur knapp ueber die Hoehe ging.
   Die Ausrichtung sitzt jetzt in einem eigenen Kind mit `min-h-full`, das Overlay scrollt.
   Nachgemessen auf 1440x900, 390x844 und 360x640: Titel und Absenden-Knopf jeweils
   erreichbar, **0 Probleme**.
2. 🟠 **Hoch (bewusst so):** Der Dialog faengt Klicks auf bestehende CTA-Links ab. Das ist
   der einzige Weg, der ohne Anfassen von rund 40 Fundstellen auskommt — aber es ist
   Fernwirkung: Ein normaler `<a href>` tut etwas anderes als das, was im Markup steht.
   Deshalb steht die Zuordnung als sichtbare Liste `ANFRAGE_ZIELE` im Modul, nicht als
   Bedingung im Code, und der Kommentar benennt den Fall ausdruecklich.
3. 🟠 **Hoch (Kopplung):** Der Dialog zeigt dasselbe `RequestForm` wie die Kontaktseite —
   gewollt, er soll es perspektivisch ersetzen. Heisst aber: Solange 1.17 offen ist,
   bestaetigt der Dialog einen Versand, der nicht stattfindet. Gleiche Kopplung wie 3.34.
4. 🟡 **Mittel (Entscheidung):** `/kontakt` ist vom Abfangen ausgenommen, `/` nicht —
   obwohl auch dort das Formular auf der Seite steht. Grund: Auf `/kontakt` schaltet
   `#contact-termin` den Reiter um, das Abfangen wuerde diese Logik brechen. Auf der
   Startseite gibt es keine solche Abhaengigkeit, und der Dialog ist dort das gewuenschte
   Verhalten („keine Weiterleitung zum bestehenden Formular").
