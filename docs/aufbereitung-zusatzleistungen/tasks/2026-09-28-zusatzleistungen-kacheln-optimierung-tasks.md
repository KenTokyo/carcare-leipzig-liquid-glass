# Optimierung zu Zusatzleistungen und Preiskacheln

**Bezug:** `docs/aufbereitung-zusatzleistungen/tasks/2026-09-28-zusatzleistungen-kacheln-tasks.md` (Kommentare)
**Stand:** 2026-09-28

---

### ✅ O1 — FAQ-Wächter las `&nbsp;` nicht als Leerzeichen (🟡 mittel)
**Befund:** Build brach ab: „ANTWORT ausgezeichnet, aber nicht im HTML“ für zwei sichtbare Antworten. Chrome serialisiert
U+00A0 beim Vorrendern als `&nbsp;`; der Wächter löste nur `&quot; &#39; &lt; &gt; &amp;` auf.
* [x] `scripts/check-faq-html.mjs`: `&nbsp;` → Leerzeichen, wie `\s` es auf der Schemaseite tut. Begründung an der Stelle.
* **Was besteht die Prüfung danach, ohne in Ordnung zu sein?** Nichts Neues: Nur die Schreibweise wird gleich; eine Antwort,
  die nicht im DOM steht, fehlt weiter im sichtbaren Text und bricht den Build.

### ✅ O2 — Angehakte Karte im gläsernen Dialog halbtransparent (🟢 niedrig)
* [x] `bg-blue-600/5` → deckendes `bg-blue-50`; vorher schien die dunkle Preisplakette der Seite durch (Bildschirmfoto)

### ✅ O3 — Langer Name drückte den Preis über den Rand (🟢 niedrig)
* [x] Name mit `hyphens-auto` und `min-w-0`: „Frontscheibenversiege-lung“ statt Überlauf

### ✅ O4 — Klickziele der Kästchen-Karten unter 48 px (🟢 niedrig, vorbestehend)
**Befund:** Einzeilige Karten mobil rund 44 px hoch (SEO-GEO §2.3 verlangt 48 px). War schon bei den zwei Platzhaltern so.
* [x] `min-h-12` an der Karte

### ✅ O5 — Handgeschriebene Schema-Zweitliste (🟢 niedrig)
* [x] `priceOffers` durch `schemaAngebote(kacheln)` ersetzt: Schema = sichtbare Kacheln, am Build gezählt 13/8/3

### ✅ O8 — Kontrastmesser meldete Einblendungen als Mängel (🟡 mittel)
**Befund:** Voller Lauf: 7 Stellen unter AA, alle „weiß auf Grau“ an den Preisplaketten der unteren neuen Kacheln. Die
Plakette ist fast schwarz; gemessen wurde sie halb durchsichtig. Der Messer wartet nach dem Scrollen 550 ms, Framers
gestaffelte Einblendung dauert bei sechs Karten bis 0,65 s, und Falle 8 setzt Framers Animationen bewusst nicht ans Ende.
Der nächste Lauf war sauber — zeitabhängige Fehlalarme.
* [x] `scripts/check-kontrast.mjs`: Messung je Position als Funktion; fällt etwas durch, zweite Messung nach 1000 ms, es
      zählt nur die zweite (Falle 9, im Kopf als Eigenschaft 7 dokumentiert); die Ausgabe nennt die Zahl der Nachmessungen
* [x] Test mit Wegwerf-Kopien: künstlicher Erstbefund → nachgemessen und verworfen („8 Position(en) … nachgemessen“, ok);
      künstlicher bleibender Befund → weiter gemeldet (8 Stellen). Danach 3 Volläufe: 0 unter AA
* **Was besteht die Prüfung, ohne in Ordnung zu sein?** Ein echter Mangel fällt in beiden Messungen durch und wird gemeldet.
  Dauerhaft animierter Text kann in einem günstigen Moment gemessen werden — das galt schon für die einzelne Messung.
* **Nebenbefund:** In Git Bash wird `npm run kontrast -- /route` zu `C:/Program Files/Git/route` umgeschrieben; der Messer
  misst dann alle 29 Seiten. Mit `MSYS_NO_PATHCONV=1` davor greift der Routenfilter.

### ⬜ O6 — Preise im übrigen Fließtext ohne geschütztes Leerzeichen (🟢 niedrig)
**Befund:** Mobil brach „ab 169,00 / €“ zwischen Betrag und Währung um. Für alle neuen Stellen behoben (`zusatzPreis`,
`paketPreis`); ältere Fließtexte (Hero der Aufbereitungsseite, Preis-FAQ, Privatkunden, Leistungen) schreiben den Preis noch
von Hand mit normalem Leerzeichen.
* [ ] Beim Gedankenstrich-Durchgang (Andrés Wunsch, noch nicht beauftragt) mitnehmen: Preise im Fließtext über die Helfer
      oder mit geschütztem Leerzeichen — dieselben Sätze werden dabei ohnehin angefasst

### ⬜ O7 — Offene Angaben von André (nicht raten)
* [ ] Ausgrau-Regeln über die zwei aktiven hinaus (aus seinen Paketbeschreibungen) — je Regel eine Zeile in `data/zusatzleistungen.ts`
* [ ] Keramik 849 € / Nano 299 € als Festpreis ohne „ab“ wie geliefert: gilt der Fahrzeugklassen-Aufpreis dort nicht?
* [ ] Ist die Brillant Außenpflege (Voraussetzung der Keramikversiegelung) im Keramikpreis enthalten?
* [ ] Text und Preis für „Lackbausteine“ (Außen) sowie Alcantara-Lenkrad und Schaum-/Tornador-Verfahren (Innen)
* [ ] Kacheltexte der sechs neuen Leistungen bestätigen (Entwurf OALAB, nur Belegtes)

---

## Kommentare

**Eingehalten**: Befund → Fix → Nachweis am Build ✅, Wächteränderung mit der Pflichtfrage begründet ✅, UTF-8 ✅

**Offen nach diesem Plan:** O6 (mit dem Gedankenstrich-Durchgang), O7 (Zulieferung André).
