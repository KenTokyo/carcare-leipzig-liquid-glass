# FAQ-Akkordeon: ausgezeichnete Antworten fehlen im ausgelieferten HTML

Referenz: `docs/faq-single-source/tasks/2026-09-01-faq-single-source-tasks.md`, Phase 3, Finding 1
Status: **abgeschlossen** am 2026-09-01, Branch `optimierung/faq-akkordeon-dom`.
Phase 1 und 2 umgesetzt, Phase 3 **bewusst nicht umgesetzt** (Begründung dort).

Vorgabe des Users: Panels gemountet lassen und Höhe animieren genügt — Google
erlaubt FAQPage-Inhalte hinter Aufklapp-Elementen, solange sie im initialen HTML
stehen. Einträge müssen nicht standardmäßig geöffnet sein, die Optik bleibt.

---

## Befund

`components/FAQSection.tsx:68` rendert die Antwort **nur des geöffneten** Eintrags:

```tsx
<AnimatePresence initial={false}>
  {isOpen && (
    <motion.div …>
      <p …>{faq.answer}</p>
    </motion.div>
  )}
</AnimatePresence>
```

Geschlossene Antworten stehen nicht etwa unsichtbar im DOM — sie sind **gar nicht
da**. Im vorgerenderten statischen HTML fehlen dadurch 14 Antworten, die im
`FAQPage`-Markup derselben Seite ausgezeichnet sind:

| Seite | ausgezeichnet | im HTML |
|---|---|---|
| `/` | 5 Antworten | 1 |
| 5 × Artikelseite | je 3 Antworten | je 1 |

Gemessen mit einem Skript, das im gebauten `dist/` jede `FAQPage`-Frage und
-Antwort gegen den sichtbaren Text der Seite hält.

**Nicht betroffen:** die 14 Routen, die über `PageFAQ` rendern — dort steht der
Block als offene Liste, alle Antworten sind im HTML.

## Warum das schwerer wiegt als es aussieht

- Es ist derselbe Verstoß wie beim Wissensbereich, nur eine Ebene tiefer: dort
  fehlte der Block ganz, hier fehlt der Text im ausgelieferten HTML.
- `CLAUDE.md` hält als vom Kunden abgenommene Vorgabe fest, dass der FAQ-Block
  ausdrücklich als **maschinenlesbare Zusammenfassung für KI-Suchmaschinen**
  existiert, „die Karteninhalte nicht auslesen können". Genau diese Funktion
  fällt für vier von fünf Antworten aus.
- `SEO-GEO-STANDARDS.md §2.1` verlangt, dass jeder Inhalt, der in Suche oder KI
  erscheinen soll, im **initialen HTML** steht — viele KI-Crawler rendern kein
  oder nur eingeschränkt JavaScript.
- Google erlaubt Inhalt hinter aufklappbaren Elementen ausdrücklich — aber nur,
  wenn er im DOM ist. Bedingtes Rendern fällt nicht darunter.

Der Befund bestand vor dem Single-Source-Umbau und ist unabhängig davon.

---

### ✅ Phase 1 — Antworten dauerhaft ins DOM
**Ziel:** Alle Antworten stehen im ausgelieferten HTML, das Akkordeon verhält
sich für den Nutzer unverändert.

* [x] `{isOpen && …}` und `AnimatePresence` aufgelöst: `motion.div` bleibt
      gemountet, animiert wird `height` zwischen `0` und `auto`
* [x] `overflow-hidden` beibehalten
* [x] Frage in eine echte `h3` gesetzt — per Überschriften-Navigation erreichbar
      (ARIA-APG-Muster, identisch zur offenen Liste in `PageFAQ`)
* [x] Trigger: `aria-expanded` **und** `aria-controls` auf die Panel-id
* [x] Panel: `id`, `role="region"`, `aria-labelledby` auf den Trigger
* [x] Geschlossene Panels `inert` + `aria-hidden` — kein Tastaturfokus, nicht im
      Accessibility-Tree. Weil nur das offene Panel im Baum liegt, entsteht die
      von der ARIA-APG gewarnte Landmark-Flut bei vielen Panels nicht
* [x] Größe über Framer animiert, nicht über CSS-Transition (Projekthistorie:
      Height-Transitions auf Flex-Items sind mobil unzuverlässig)
* [x] Gegenprobe im gebauten `dist/`: **0 fehlende Antworten statt 14**
* [x] Im Browser geprüft: ein erzwungenes `tabindex="0"` im geschlossenen Panel
      bekommt keinen Fokus — `inert` greift wirklich, nicht nur als Attribut.
      Klick öffnet (Höhe 69.5 px, `inert` weg, `aria-expanded="true"`), das vorher
      offene schließt, genau eines bleibt offen. Screenshot: Optik unverändert

**Referenzen:**
`components/FAQSection.tsx`

---

### ✅ Phase 2 — Prüfung in den Wächter aufnehmen
**Ziel:** Rückfall unmöglich machen, wie schon bei den Waisen.

* [x] Eigenes `scripts/check-faq-html.mjs` statt Erweiterung von `check-faq.mjs` —
      die beiden prüfen zu verschiedenen Zeitpunkten gegen verschiedene Artefakte
* [x] In `postbuild` hinter den Prerender gehängt
* [x] **Fehlerinjektion:** bedingtes Rendern der Antwort wieder eingebaut, also
      exakt der alte Fehler. Wächter meldete alle 14 Fälle namentlich und brach
      mit Exit 1 ab. Zurückgenommen, danach regulärer Build grün

**Referenzen:**
`scripts/check-faq-html.mjs`
`package.json`

---

### 🚫 Phase 3 — Eine Darstellung statt zwei · **bewusst nicht umgesetzt**
**Entscheidung des Users am 2026-09-01.** Nicht vertagt, nicht offen — verworfen.

`PageFAQ` und `FAQSection` sehen sich nach dem Umbau ähnlich. Ähnlichkeit
rechtfertigt aber keine Zusammenlegung: Zwei Komponenten hätten nur dann eine
gemeinsame Zukunft, wenn sie sich künftig **gemeinsam ändern**. Das ist hier
nicht zu erwarten — die offene Liste auf den Unterseiten und das Akkordeon auf
Startseite und Artikelseiten folgen unterschiedlichen Zwecken.

Eine `variant`-Prop (`list | accordion`) würde beim ersten abweichenden Wunsch
zur Verzweigung im Inneren der gemeinsamen Komponente. Man tauscht zwei klare
Komponenten gegen eine mit Fallunterscheidung — und hat nichts gewonnen.

Der Duplikationsschmerz, der ein Zusammenlegen rechtfertigen würde, ist ohnehin
schon weg: Seit `data/faqs.ts` die einzige Quelle ist, liegt der **Inhalt** nur
noch einmal. Doppelt sind nur zwei Darstellungen, und das sollen sie sein.

**Konsequenz für Finding 2 im Hauptplan** (`2026-09-01-faq-single-source-tasks.md`,
Phase 3): erledigt durch Entscheidung, nicht durch Umsetzung.


---

## Kommentare

### Phase 1
**Eingehalten**: Optik unverändert ✅, genau ein Eintrag offen ✅, Barrierefreiheit
besser statt nur anders ✅, Framer statt CSS-Transition ✅, unter 700 Zeilen ✅ (120),
im Browser verifiziert statt nur im Quellcode ✅

**Auffälligkeiten:** `inert` ist kein Selbstläufer — das Attribut kann im Markup
stehen und trotzdem wirkungslos sein, wenn React es als unbekanntes Prop
verschluckt oder der Browser es nicht kennt. Deshalb wurde nicht das Attribut
geprüft, sondern die Wirkung: ein künstlich fokussierbar gemachtes Element im
geschlossenen Panel bekommt keinen Fokus.

### Phase 2
**Eingehalten**: Wächter greift nachweislich ✅, Fehlermeldung nennt die Ursache
(„bedingtes Rendern") und die Lösung ✅, in `postbuild` verdrahtet ✅

**Auffälligkeiten:** Der Prüfpfad muss den sichtbaren Text aus dem HTML gewinnen
(Skripte raus, Tags raus, Entitäten auflösen, Whitespace normalisieren) — sonst
schlägt er bei jedem `&amp;` oder Zeilenumbruch falsch an. Die Normalisierung ist
der eigentliche Kern des Skripts, nicht der Vergleich.

**Zwei Wächter, zwei Zeitpunkte, zwei Fehlerklassen:**

| | wann | fängt ab |
|---|---|---|
| `check-faq.mjs` | `prebuild` | Markup ohne sichtbaren Block (Waisen, Doppelpflege) |
| `check-faq-html.mjs` | `postbuild` | sichtbarer Block ohne ausgelieferten Text |
