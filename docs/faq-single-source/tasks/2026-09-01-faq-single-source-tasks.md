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

### ✅ Phase 2 — Seiten und Schema auf die Quelle umstellen
**Ziel:** Sichtbarer Block und JSON-LD lesen denselben Eintrag. Ein abweichender
Text ist danach nicht mehr darstellbar.

* [x] `PageFAQ` nimmt `route` statt `faqs` und schlägt selbst nach — bewusst kein
      übergebbares Array, sonst wäre die Doppelpflege sofort zurück
* [x] 13 Seiten: lokales `const faqs = [...]` entfernt, `<PageFAQ route="…" />`
* [x] `FAQSection`: `defaultFaqs` entfernt, liest `faqsByRoute['/']`
* [x] `KnowledgeHubPage`: `PageFAQ` eingebunden, die drei Waisen sind sichtbar
* [x] `seo/pageSchemas.ts`: 15 lokale Arrays entfernt, `faqSchema(faqsByRoute[route])`;
      Datei 247 → 142 Zeilen, `FAQSection` 121 → 90 Zeilen, gesamt 425 Zeilen entfernt
* [x] Gegenprobe im gebauten HTML: Wissensbereich zeigt alle drei Fragen sichtbar,
      Markup hat genau diese drei; Startseite hat 5 statt 4 Einträge (`ersatzwagen`
      jetzt ausgezeichnet), Antwort `aufbereitung` trägt die typografischen
      Anführungszeichen der sichtbaren Fassung

**Referenzen:**
`seo/pageSchemas.ts`
`components/PageBlocks.tsx`
`pages/KnowledgeHubPage.tsx`

---

### ✅ Phase 3 — Build-Wächter `scripts/check-faq.mjs`
**Ziel:** Eine Route ohne sichtbaren Block bricht den Build ab.

* [x] Prüft: jede Route in `faqsByRoute` wird von einer Seite gerendert
* [x] Prüft: jede Route mit `faqSchema` steht in `faqsByRoute`
* [x] Prüft zusätzlich: `faqSchema` wird ausschließlich aus `faqsByRoute` oder
      `article.faqs` gespeist — fängt den Rückfall in die Doppelpflege ab
* [x] Prüft: Artikel führen FAQs, `ArticleLayout` rendert sie
* [x] In `prebuild` eingehängt, vor der Sitemap-Erzeugung
* [x] **Fehlerinjektion, drei Fälle, alle zurückgenommen:**
      Waise `/testwaise` → Build bricht (Exit 1) · `faqSchema` auf unbekannte Route
      → Build bricht (Exit 1) · `faqSchema(lokaleKopie)` → Build bricht (Exit 1).
      Danach regulärer Build grün, 21/21 Prerender-Routen.
* [x] Textuelle Prüfung statt Import — läuft ohne TypeScript-Transpilation und
      greift auch, wenn der Code nicht kompiliert

**Referenzen:**
`scripts/check-faq.mjs`
`package.json`

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

### Phase 2
**Eingehalten**: sichtbarer Text als Quelle ✅, Schema abgeleitet statt kopiert ✅,
Gegenprobe im gebauten HTML statt am Quellcode ✅, alle Dateien unter 700 Zeilen ✅

**Auffälligkeiten:** siehe Phase 3 — die Prüfung des gebauten HTML hat einen
weiteren Fall derselben Krankheit freigelegt.

### Phase 3
**Eingehalten**: Wächter greift nachweislich (drei Fehlerinjektionen) ✅,
in `prebuild` verdrahtet ✅, Fehlermeldungen nennen die Lösung ✅

**Auffälligkeiten/Kritische Findings (nach Schwere):**
1. 🔴 **Kritisch, neu:** `FAQSection` rendert die Antwort **nur des geöffneten**
   Eintrags (`{isOpen && …}` in `components/FAQSection.tsx:68`). Im ausgelieferten
   statischen HTML fehlen dadurch **14 Antworten**, die im `FAQPage`-Markup
   ausgezeichnet sind: vier von fünf auf der Startseite und je zwei auf den fünf
   Artikelseiten. Das ist derselbe Verstoß wie der Wissensbereich, nur eine Ebene
   tiefer — diesmal nicht „kein Block auf der Seite", sondern „Text nicht im
   ausgelieferten HTML". Besonders bitter, weil der FAQ-Block laut `CLAUDE.md`
   ausdrücklich als maschinenlesbare Zusammenfassung für KI-Suchmaschinen
   existiert und `SEO-GEO-STANDARDS.md §2.1` verlangt, dass jeder Inhalt im
   initialen HTML steht — viele KI-Crawler rendern kein JavaScript.
   **Bestand vor diesem Branch**, unabhängig von der Umstellung.
   → eigener Optimierungsplan, siehe `2026-09-01-faq-accordion-optimierung-tasks.md`
2. 🟡 **Mittel — geprüft und verworfen (2026-09-01):** `PageFAQ` und `FAQSection`
   sind zwei Darstellungen desselben Inhalts. Sie werden **nicht** zusammengelegt.
   Ähnlichkeit allein rechtfertigt keine gemeinsame Komponente — die beiden
   müssten sich künftig gemeinsam ändern, und das tun sie nicht: offene Liste auf
   Unterseiten und Akkordeon auf Startseite/Artikeln folgen verschiedenen Zwecken.
   Eine `variant`-Prop würde beim nächsten abweichenden Wunsch zur Verzweigung.
   Der Duplikationsschmerz ist mit `data/faqs.ts` als einziger Quelle bereits
   entfallen: doppelt sind nur noch die Darstellungen, nicht die Inhalte.
   Details: `2026-09-01-faq-accordion-optimierung-tasks.md`, Phase 3.
