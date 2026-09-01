# FAQ-Akkordeon: ausgezeichnete Antworten fehlen im ausgelieferten HTML

Referenz: `docs/faq-single-source/tasks/2026-09-01-faq-single-source-tasks.md`, Phase 3, Finding 1
Status: **offen**, noch nicht umgesetzt — braucht eine Entscheidung, weil es das
sichtbare Verhalten des Akkordeons ändert.

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

### ⬜ Phase 1 — Antworten dauerhaft ins DOM
**Ziel:** Alle Antworten stehen im ausgelieferten HTML, das Akkordeon verhält
sich für den Nutzer unverändert.

* [ ] `{isOpen && …}` auflösen: `motion.div` bleibt gemountet, animiert wird
      `height` zwischen `0` und `auto` statt Ein-/Aushängen
* [ ] `overflow-hidden` beibehalten, damit geschlossen nichts durchscheint
* [ ] Barrierefreiheit: geschlossene Panels bekommen `aria-hidden` bzw. `inert`,
      damit Screenreader nicht durch unsichtbaren Text laufen. `aria-expanded`
      am Button bleibt
* [ ] Mobil prüfen: laut Projekthistorie sind Height-Transitions auf Flex-Items
      auf Mobilgeräten unzuverlässig; die Größe wird deshalb über Framer
      animiert, nicht über eine CSS-Transition
* [ ] Gegenprobe im gebauten `dist/`: 0 fehlende Antworten statt 14

---

### ⬜ Phase 2 — Prüfung in den Wächter aufnehmen
**Ziel:** Rückfall unmöglich machen, wie schon bei den Waisen.

* [ ] `scripts/check-faq.mjs` um eine Nachbau-Prüfung erweitern **oder** eigenes
      `scripts/check-faq-html.mjs`, das nach dem Prerender über `dist/` läuft
      und jede `FAQPage`-Frage/-Antwort im sichtbaren Text der Seite sucht
* [ ] In `postbuild` hinter den Prerender hängen — vorher existiert `dist/` nicht
* [ ] Fehlerinjektion wie in Phase 3 des Hauptplans: eine Antwort aus dem
      sichtbaren Text entfernen, Build muss brechen, zurücknehmen

---

### ⬜ Phase 3 — Eine Darstellung statt zwei
**Ziel:** `PageFAQ` (offene Liste) und `FAQSection` (Akkordeon) zeigen denselben
Inhalt in zwei Bauformen. Nach Phase 1 unterscheiden sie sich nur noch optisch.

* [ ] Prüfen, ob eine Komponente mit Variante `list | accordion` reicht
* [ ] Nur zusammenführen, wenn dabei kein Design-Unterschied verloren geht —
      die offene Liste auf den Unterseiten ist eine bewusste Entscheidung
