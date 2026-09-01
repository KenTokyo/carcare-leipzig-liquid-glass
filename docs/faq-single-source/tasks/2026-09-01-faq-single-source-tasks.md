# FAQ: eine Quelle, abgeleitetes Schema, Build-Wächter

Branch: `optimierung/faq-single-source`
Referenz: `docs/textkorrekturen-schleife-1/tasks/2026-09-01-paket-a-optimierung-tasks.md`, Punkt 1 (🔴)

## Ausgangslage

Zwei Fehlerklassen mit derselben Ursache — FAQ-Inhalte lagen doppelt:

1. **Divergenz.** 68 sichtbare Einträge, jeder ein zweites Mal in `seo/pageSchemas.ts`.
   Zwei waren bereits auseinandergelaufen:
   - Startseite, Antwort `aufbereitung`: sichtbar mit typografischen
     Anführungszeichen („Termin anfragen"), im Schema ohne.
   - Startseite, `ersatzwagen`: sichtbar gerendert, im Schema gar nicht vorhanden —
     verschenkte Rich-Result-Sichtbarkeit.
2. **Waisen.** Drei Einträge des Wissensbereichs existierten ausschließlich im
   JSON-LD; `KnowledgeHubPage.tsx` rendert keinen FAQ-Block. Verstoß gegen die
   Google-Richtlinie für `FAQPage` (Markup nur für sichtbaren Seiteninhalt) und
   gegen SEO-GEO §5.

Eine gemeinsame Quelle beseitigt nur Klasse 1. Klasse 2 braucht eine Prüfung,
die den Build abbricht — sonst bleibt es bei einer Konvention.

**Vorabprüfung vor dem Umbau:** Alle 13 Seiten-/Schema-Paare wurden Eintrag für
Eintrag verglichen — zeichengleich. Nur `/` wich ab (die zwei oben genannten Fälle).
Das Zusammenführen war damit mechanisch sicher, kein Text ging verloren.

## Entscheidungen des Users (2026-09-01)

- Die drei Wissensbereich-Einträge werden **sichtbar ergänzt**, nicht entfernt.
- Die Frage `leipzig` stand in dritter Person und verstieß gegen Textregel 2
  in `CLAUDE.md`. Neu aus Kundensicht: „Setzen Sie die beschriebenen Leistungen
  in Leipzig um?" Die Antwort blieb unverändert.
- Startseite: der sichtbare Wortlaut mit den typografischen Anführungszeichen
  gewinnt. `ersatzwagen` wird über die Umstellung automatisch mit ausgezeichnet.
- Der Build-Wächter kommt mit, inklusive Artikel-Pfad-Variante für `ArticleLayout`.
- Drei getrennte Commits: Quelle, Umstellung, Wächter.

---

### ✅ Phase 1 — `data/faqs.ts` als einzige Quelle
**Ziel:** Alle FAQ-Inhalte an einer Stelle, nach Route geschlüsselt. Noch keine
Verhaltensänderung — die Datei wird angelegt, aber noch nicht gelesen.

* [x] `data/faqs.ts` erzeugt: `faqsByRoute: Record<string, FAQItem[]>`, 15 Routen,
      71 Einträge (68 bisher sichtbare + 3 neue des Wissensbereichs)
* [x] Inhalte aus den **sichtbaren** Arrays übernommen, nicht aus dem Schema —
      sichtbarer Text ist die Wahrheit
* [x] `faqRoutes` als abgeleitete Routenliste exportiert, Basis für Phase 3
* [x] Vorgeschichte und Ein-Quellen-Regel als Dateikommentar hinterlegt
* [x] Artikel-FAQs bewusst **nicht** übernommen: sie liegen bei ihrem Artikel in
      `data/knowledgeArticles.ts` und sind dort bereits einquellig
* [x] `tsc --noEmit` sauber

**Referenzen:**
`data/faqs.ts`

---

### ⬜ Phase 2 — Seiten und Schema auf die Quelle umstellen
**Ziel:** Sichtbarer Block und JSON-LD lesen denselben Eintrag. Ein abweichender
Text ist danach nicht mehr darstellbar.

* [ ] `PageFAQ` nimmt `route` statt `faqs` und schlägt selbst nach
* [ ] 13 Seiten: lokales `const faqs = [...]` entfernt, `<PageFAQ route="…" />`
* [ ] `FAQSection`: `defaultFaqs` entfernt, liest `faqsByRoute['/']`
* [ ] `KnowledgeHubPage`: `PageFAQ` neu eingebunden (Waisen werden sichtbar)
* [ ] `seo/pageSchemas.ts`: 15 lokale Arrays entfernt, `faqSchema(faqsByRoute[route])`
* [ ] Gegenprobe: Schema-Text und sichtbarer Text identisch, `ersatzwagen` ausgezeichnet

---

### ⬜ Phase 3 — Build-Wächter `scripts/check-faq.mjs`
**Ziel:** Eine Route ohne sichtbaren Block bricht den Build ab.

* [ ] Prüft: jede Route in `faqsByRoute` wird von einer Seite gerendert
* [ ] Prüft: jede Route mit `faqSchema` steht in `faqsByRoute`
* [ ] Prüft: jeder Artikel mit `faqs` in `knowledgeArticles.ts` rendert `ArticleLayout`
* [ ] In `prebuild` eingehängt
* [ ] **Fehlerinjektion:** testweise Waise angelegt, Build muss brechen, danach zurück

---

## Kommentare

### Phase 1
**Eingehalten**: unter 700 Zeilen ✅ (156), Encoding sauber ✅, sichtbarer Text als
Quelle ✅, Vorabvergleich statt blindes Zusammenführen ✅, keine Verhaltensänderung ✅

**Auffälligkeiten:** Der Generator musste zwei Formatvarianten lesen —
`const faqs = [` in den Seiten und `const defaultFaqs: FAQItem[] = [` in
`FAQSection`. Beim ersten Lauf traf der Parser die Klammer der Typannotation
statt des Array-Literals und lieferte für die Startseite stumm null Einträge.
Aufgefallen nur, weil der Vergleich „0 Seite / 4 Schema" meldete — ein stiller
Parserfehler hätte hier echten Textverlust bedeutet.
