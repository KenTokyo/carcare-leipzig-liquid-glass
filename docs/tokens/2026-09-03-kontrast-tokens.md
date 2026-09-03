# Token-Reparatur: Kontrast von Blau und Grau

Branch: `tokens/kontrast-blau-grau`. Ausgelöst durch den Kontrast-Befund aus Paket C
(`docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`, Abschnitt 7.0).

Alle Werte gegen die Token-Definitionen gerechnet (`tailwind.config.js` + `index.css`),
nicht geschätzt. Schwelle: WCAG 2.1 AA — 4,5:1 für Fließtext, 3:1 für großen Text
(≥ 24 px, oder ≥ 18,66 px ab Schriftschnitt 700).

---

## 1 — Die Tokens

| Token | löst auf zu | auf Weiß | auf `gray-50` | auf `gray-900` |
|---|---|---|---|---|
| `gray-300` | ice-blue `216 232 255` @ 82 % | 1,19:1 | 1,13:1 | **9,77:1** |
| `gray-400` | graphite `21 26 33` @ 42 % | **2,66:1** | **2,63:1** | **1,00:1** |
| `gray-500` | graphite @ 58 % | **4,30:1** | **4,22:1** | **1,00:1** |
| `gray-600` | graphite @ 72 % | 6,92:1 | 6,71:1 | **1,00:1** |
| `blue-700` | signal-blue `47 128 237` | **3,87:1** | **3,63:1** | 4,52:1 |
| `blue-600` | trust-blue `11 61 145` | 10,04:1 | 9,43:1 | **1,74:1** |

### Zwei Fallen, die aus dieser Tabelle folgen

**Die Grau-Rampe ist nicht monoton.** `gray-300` ist ein HELLER Ton (ice-blue),
`gray-400` bis `gray-700` sind DUNKLE (graphite mit steigender Deckung). Wer auf einer
dunklen Fläche „einen Ton heller" wählt und von `500` auf `400` geht, macht den Text
nicht heller, sondern unsichtbarer.

**Auf `bg-gray-900` ergeben `gray-400`, `gray-500` und `gray-600` exakt 1,00:1.** Kein
Rundungsartefakt: `bg-gray-900` *ist* graphite, und die drei Tokens sind graphite mit
Alpha — über sich selbst gelegt bleibt graphite. Auf dunklem Grund ist `gray-300` der
einzige brauchbare Ton dieser Familie.

**`blue-600` ist auf dunklem Grund unbrauchbar** (1,74:1). Die vollständige Umstellung
`blue-700` → `blue-600` war nur deshalb unbedenklich, weil **keine** der 48 Fundstellen
auf dunklem Grund liegt — geprüft, nicht angenommen.

---

## 2 — `text-blue-700` → `text-blue-600`: 48 Fundstellen, vollständig

Vorgabe: vollständig, nicht teilweise. Ein halb umgestellter Token ist schlimmer als
der alte, weil dann zwei Blautöne nebeneinander stehen und keiner mehr gilt.

**Genau das war bereits der Zustand.** Beide Blautöne waren im Einsatz — teils auf
derselben Seite: Der Eyebrow in `PageHero` war `blue-700` (3,87:1), der in
`SectionIntro` `blue-600` (10,04:1). Die Umstellung reduziert zwei Blau auf eines.

| Datei | Fundstellen |
|---|---|
| `components/PageBlocks.tsx` | 5 (Hero-Eyebrow, Icon-Kacheln, „Mehr erfahren") |
| `pages/VehicleDetailingPage.tsx` | 6 |
| `pages/BusinessCustomersPage.tsx` | 4 |
| `components/ArticleLayout.tsx` | 7 |
| `pages/KnowledgeHubPage.tsx` | 3 |
| `components/ContactCTA.tsx`, `ContactSection.tsx` | 4 + 5 |
| `components/ScrollPinnedProcess.tsx`, `KnowledgeArticleCard.tsx`, `KnowledgeCategoryGrid.tsx`, `RequestForm.tsx` | 2 + 2 + 2 + 1 |
| `pages/AussenaufbereitungPage.tsx`, `InnenaufbereitungPage.tsx`, `LeasingrueckgabePage.tsx`, `UeberUnsPage.tsx` | 2 + 2 + 2 + 1 |

Darunter 7 × `hover:text-blue-700`. Auch die wurden umgestellt: WCAG gilt für alle
Zustände, und ein Hover-Blau, das vom Ruhe-Blau abweicht, wäre wieder der halbe Token.

`text-blue-700` kommt danach **null Mal** im Code vor. Andere Varianten
(`bg-blue-700`, `border-blue-700`) gab es nie.

---

## 3 — Grau: 28 Fundstellen, 19 geändert, 9 bewusst nicht

Vorgabe: pro Fundstelle Text gegen Dekoration trennen. Rahmen, Trenner und Icons
brauchen keinen Textkontrast.

### Geändert (19)

| Ort | von → nach | Grund |
|---|---|---|
| `About.tsx:27` | 400 → **500** | Text, Überschrift `text-4xl…6xl bold` → große Schrift, 3:1 genügt; 4,30:1 hält den hellen Charakter |
| `TargetGroups.tsx:69` | 400 → **500** | dito |
| `AccidentFocus.tsx:35` | 400 → **300** | Überschrift auf `bg-gray-900` — dort ist 400 exakt 1,00:1 |
| `AccidentFocus.tsx:61` | 400 → **300** | Kicker 10 px auf `bg-gray-900` |
| `Jobs.tsx:95` | 400 → **600** | Tag-Zeile `text-xs` |
| `RequestForm.tsx:267` | 400 → **600** | Datenschutzhinweis 11 px |
| `ScrollPinnedProcess.tsx:268` | 400 → **600** | Schrittzähler `text-xs bold` |
| `TargetGroupCards.tsx:431` | 400 → **600** | Label 10 px auf weißer Karte |
| `ArticleLayout.tsx:62, 121, 131` | 500 → **600** | Breadcrumb, zwei Zwischenüberschriften |
| `ContactSection.tsx:86` | 500 → **600** | Hilfetext `text-xs` |
| `Jobs.tsx:94` | 500 → **600** | Stellenbeschreibung `text-sm` |
| `KnowledgeArticleCard.tsx:26` | 500 → **600** | Pille auf `bg-gray-50` |
| `MobileStickyCTA.tsx:104` | 500 → **600** | Label 10 px auf `bg-white/95` |
| `PageBlocks.tsx:218` | 500 → **600** | Preis-Fußnote `text-xs` |
| `RequestForm.tsx:87, 103, 112` | 500 → **600** | Formular-Label und zwei Unterzeilen |

### Bewusst nicht geändert (9)

| Ort | Token | Grund |
|---|---|---|
| `AccidentFocus.tsx:69` | 400 | lucide-Icon **neben** eigenem Textlabel — Dekoration |
| `Footer.tsx:175, 179, 183, 187, 203` | 400 | Icons MapPin, Phone, Printer, Mail, Clock neben dem jeweiligen Text — Dekoration |
| `Jobs.tsx:104` | 400 | Icon-Kreis (Pfeil) — Dekoration |
| `Hero.tsx:82` | 400 | **`Hero.tsx` wird laut Projektvorgabe nicht angefasst** |
| `Hero.tsx:102` | 500 | dito |

> **Offen, nicht erledigt:** Die Footer-Icons und `AccidentFocus.tsx:69` stehen auf
> `bg-gray-900` und sind dort rechnerisch bei 1,00:1 — als Dekoration nicht
> kennzeichnungspflichtig, aber praktisch unsichtbar.
>
> **Das ist eine Gestaltungsfrage für André, nicht unsere Entscheidung.** Ob die Icons
> im Footer sichtbar sein sollen oder bewusst zurücktreten, ist eine Aussage über das
> Erscheinungsbild und keine über Barrierefreiheit — die Regel verlangt hier nichts.
> Wir stellen die Frage, wir beantworten sie nicht. Vorzulegen wäre sie zusammen mit
> den übrigen offenen Punkten zur Gestaltung.
>
> Ebenso die beiden `Hero.tsx`-Stellen, sobald die Sperre für diese Datei aufgehoben
> wird.

---

## 4 — Fünf der geänderten Komponenten sind verwaist

Beim Suchen nach einer geeigneten Prüfseite aufgefallen: **`About`, `AccidentFocus`,
`Hero`, `Jobs` und `TargetGroups` werden nirgends importiert.** Sie stehen im Code,
erscheinen aber auf keiner Seite.

Folgen für diese Reparatur:

- **6 der 19 Grau-Änderungen liegen in totem Code** — `About.tsx:27`,
  `AccidentFocus.tsx:35`, `AccidentFocus.tsx:61`, `Jobs.tsx:94`, `Jobs.tsx:95`,
  `TargetGroups.tsx:69`. Sichtbar sind 13.
- **Alle 48 Blau-Änderungen sind live.** Keine der betroffenen Dateien ist verwaist.
- **`Hero.tsx` ist selbst verwaist.** Die Datei wurde trotzdem nicht angefasst — die
  Projektvorgabe gilt unabhängig davon —, aber die beiden dort notierten
  Kontrast-Stellen erscheinen auf keiner Seite.

Die Änderungen im toten Code bleiben stehen: Sie sind korrekt, und eine Komponente,
die eines Tages wieder eingebunden wird, soll nicht mit dem alten Fehler zurückkommen.

**Nicht nebenbei aufräumen.** `About.tsx` trägt laut Kommentar in `pages/UeberUnsPage.tsx`
noch echte Kundentexte („verwaiste Komponente, aber echte Kundentexte"). Vor dem Löschen
muss also geklärt sein, was an Inhalt noch gebraucht wird. Aufgenommen als Punkt 3 im
Optimierungsplan (`docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`).

> **Hinweis zur Prüfmethode:** Der erste Grep meldete `MobileStickyCTA`, `RequestForm`
> und `ScrollPinnedProcess` fälschlich als verwaist — sie werden über `./Name` aus einer
> anderen Komponente importiert, nicht über `components/Name` aus einer Seite. Und er
> fand Treffer in `.claude/worktrees/…`, also in fremden Arbeitskopien. Eine
> Verwaisungsprüfung, die nur nach einem Pfadmuster sucht, taugt nicht — dieselbe
> Leitfrage wie bei den Wächtern: *Was besteht diese Prüfung, ohne dass die Sache
> tatsächlich in Ordnung ist?*

---

## 5 — Was geprüft wurde

* [x] `npx tsc --noEmit` grün
* [x] Build mit beiden Wächtern grün: 25/25 Routen, 224 FAQPage-Texte
* [x] Restsuche: `text-blue-700` = 0; Grau-Restbestand = genau die 9 Ausnahmen oben
      plus die zwei auf `gray-500` gehobenen Überschriften
* [x] Sichtprüfung Desktop 1440 und mobil 390 auf `/smart-repair-leipzig` (Hero-Eyebrow
      neben SectionIntro-Eyebrow — beide jetzt derselbe Ton) und
      `/fahrzeugaufbereitung-leipzig` (viele Eyebrows, „Termin anfragen"-Links,
      Preis-Fußnote)
