# Paket A — Optimierungen aus den Phasen 1.1 / 1.2

Referenz: `docs/textkorrekturen-schleife-1/tasks/2026-09-01-paket-a-tasks.md`
Abarbeitung: **nach** Abschluss von 1.3 und 1.4, im Loop.
Sortierung nach Gewichtung.

---

### ⬜ 1. 🔴 Kritisch — FAQ-Texte laufen zwischen Schema und sichtbarem Inhalt auseinander
**Ziel:** Eine Quelle für jede FAQ-Antwort. Strukturierte Daten lesen daraus,
statt eine Kopie zu halten.

**Befund:** `seo/pageSchemas.ts` hält wortgleiche Kopien sichtbarer FAQ-Antworten:

| Schema | sichtbare Quelle |
|---|---|
| `seo/pageSchemas.ts:18` (`einhaus`) | `pages/ServicesPage.tsx:22` |
| `seo/pageSchemas.ts:71` (`flotte`) | `pages/BusinessCustomersPage.tsx:102` |
| `seo/pageSchemas.ts:117` (`garantie`) | `pages/AutoglasPage.tsx:18` |

**Warum das ein SEO-Risiko ist und nicht nur Redundanz:** Läuft der Wortlaut
auseinander, zeichnet `FAQPage` Inhalte aus, die auf der Seite so nicht stehen.
Das verstößt gegen SEO-GEO §5 („Nur auszeichnen, was auf der Seite sichtbar ist")
und gegen die Google-Richtlinie für strukturierte Daten — Sanktion ist der
Verlust der Rich Results für die betroffene Seite, im Wiederholungsfall
seitenweit ein manueller Maßnahmen-Eintrag. Genau diese Divergenz war bei 1.2
bereits eingetreten: die Fläche stand an beiden Stellen doppelt gepflegt und
musste doppelt korrigiert werden.

* [ ] FAQ-Einträge in eine gemeinsame Datenquelle heben (Muster: `data/services.ts`
      als Single Source, vgl. Leistungskatalog)
* [ ] `pages/ServicesPage.tsx`, `pages/BusinessCustomersPage.tsx`,
      `pages/AutoglasPage.tsx` lesen daraus, `seo/pageSchemas.ts` ebenso
* [ ] Weitere FAQ-Blöcke auf denselben Doppelpflege-Fall prüfen
* [ ] Prüfschritt ergänzen, der Schema-Antwort gegen sichtbaren Text vergleicht
      (Skriptmuster liegt vor, siehe Verifikation aus Phase 2)

---

### ⬜ 2. 🟠 Hoch — `components/Hero.tsx` ist toter Code
Hero.tsx ist toter Code (kein Import, Unsplash-Hotlink, Jahreszahl 2010) –
Löschung in eigenem Commit prüfen. Hotlink ist lizenzrechtlich und
performanceseitig relevant.

* [ ] Prüfen, ob die Komponente irgendwo dynamisch geladen wird
* [ ] Löschung als eigener Commit
* [ ] Restliche Unsplash-Hotlinks im Projekt suchen und mit bewerten

---

### ⬜ 3. 🟡 Mittel — Kartentitel und Kartenbeschreibung doppeln „seit 1998"
**Befund:** Auf fünf Serviceseiten trägt der Kartentitel „Meisterbetrieb seit 1998"
und die Beschreibung direkt darunter erneut „seit 1998":
`pages/AutolackierungPage.tsx:21`, `pages/SmartRepairPage.tsx:19`,
`pages/DellenentfernungPage.tsx:20`, `pages/FelgenreparaturPage.tsx:21`,
`pages/HagelschadenreparaturPage.tsx:21`.

Inhaltlich korrekt und bewusst so umgesetzt (User-Vorgabe: keine Dauerangabe,
stattdessen „seit 1998"). Sprachlich ist die Wiederholung im selben Sichtfeld
unschön. Aufzulösen ist sie über den **Titel**, nicht über die Jahreszahl.

* [ ] Kartentitel auf „Meisterbetrieb" kürzen, Jahreszahl bleibt in der Beschreibung —
      oder umgekehrt, einheitlich über alle fünf Seiten

---

### ⬜ 4. 🟡 Mittel — 16 von 17 `PageMeta`-Descriptions außerhalb 140–160 Zeichen
**Befund:** Spanne 67 bis 180 Zeichen. Betroffen sind unter anderem
`pages/NotFoundPage.tsx:6` (67), `pages/ContactPage.tsx:13` (115),
`pages/HomePage.tsx:25` (130), `pages/HagelschadenreparaturPage.tsx:26` (180).
Einzige Seite im Zielkorridor: `pages/KnowledgeHubPage.tsx`.

Bestandsproblem, unabhängig von 1.1/1.2 — keine der in diesem Paket geänderten
Zeilen ist eine Meta-Description. Verstoß gegen SEO-GEO §3.1.

* [ ] Alle 16 Descriptions auf 140–160 Zeichen bringen, Hauptkeyword + CTA erhalten
* [ ] Titles im selben Durchgang gegen 50–60 Zeichen prüfen
* [ ] Prüfskript aus dieser Session dauerhaft ablegen (`scripts/`), damit die
      Längen bei künftigen Textänderungen nicht wieder abdriften
