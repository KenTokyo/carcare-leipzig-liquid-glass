# Paket C — Serviceseiten-Layout vereinheitlichen (1.14, 1.15)

Backlog: `docs/backlog/schleife-1.md`, Paket C
Vorgabe aus dem Backlog: *„1.14 ist ein Fall für eine gemeinsame Layout-Komponente,
nicht für acht einzeln angepasste Seiten. Erst Komponente bauen, dann migrieren."*

> **Stand 2026-09-03:** Phase 1 umgesetzt (Komponente + Pilot). Phasen 2-6 offen.

---

## 1 — Bestandsaufnahme: es sind sieben Migrationen, nicht acht

Der Backlog nennt acht Seiten. **Leasingrückgabe hat `BackdropLayout` bereits** — sie
kam mit `0b666d1` und wurde von Anfang an mit stehendem Foto gebaut.

| Seite | Zeilen | Backdrop | Sektionen | Status |
|---|---|---|---|---|
| Neu- & Reparaturlackierung | 53 | — | 3 | zu migrieren |
| Smart Repair | 51 | — | 3 | zu migrieren |
| Dellenentfernung | 52 | — | 3 | zu migrieren |
| Hagelschadenreparatur | 51 | — | 3 | zu migrieren |
| Felgenreparatur | 53 | — | 3 | zu migrieren |
| Autoglas & Scheibenfolierung | 51 | — | 3 | zu migrieren |
| Fuhrparkservice | 51 | — | 3 | zu migrieren |
| **Leasingrückgabe** | 223 | **ja** | 6 | **fertig, nur prüfen** |

### Die sieben sind strukturell deckungsgleich

Nicht „ähnlich" — identisch. Das Skelett aller sieben, maschinell ausgelesen:

```
PageMeta
PageHero
section bg-white        → SectionIntro + FeatureGrid     (fachlich)
section bg-gray-50/70   → SectionIntro + FeatureGrid     (USP)
section bg-white        → SectionIntro + PageFAQ         (FAQ)
PageCTA
```

Bei allen sieben. Zwei strukturelle Unterschiede, beide klein:

| Seite | `description` an der ersten `SectionIntro` | Karten | Spalten |
|---|---|---|---|
| Neu- & Reparaturlackierung | ja | 6 | three |
| Smart Repair | ja | 4 | **four** |
| Dellenentfernung | — | 5 | three |
| Hagelschadenreparatur | — | 4 | **four** |
| Felgenreparatur | ja | 6 | three |
| Autoglas & Scheibenfolierung | — | 4 | **four** |
| Fuhrparkservice | ja | 4 | **four** |

> **Korrektur zur ersten Fassung dieses Plans.** Dort stand, die `description` sei der
> *einzige* Unterschied. Das war beim maschinellen Auslesen des Skeletts durchgerutscht,
> weil `columns` ein Attribut am `FeatureGrid` ist und nicht am Sektionsgerüst.
> Die Spaltenzahl ist der zweite — und der interessantere, siehe unten.

**Das ist der Idealfall für eine Komponente.** Es gibt nichts zu vereinheitlichen —
die Struktur ist schon einheitlich, sie ist nur siebenmal abgeschrieben.

---

## 2 — Wie die Komponente aussieht

`components/ServiceLayout.tsx`, ein Aufruf pro Seite:

```tsx
<ServiceLayout
  route="/smart-repair-leipzig"
  meta={{ title: '…', description: '…' }}
  hero={{ eyebrow, title, description, primaryCta, secondaryCta, keywords }}
  erklaerung={null}                      // Pflichtfeld, aber leerbar - siehe Abschnitt 4
  leistung={{ eyebrow, title, description?, items }}
  usp={{ title, items }}
  faq={{ title }}
  cta={{ title, description, primaryLabel, primaryHref }}
/>
```

### Was sie aus der Route selbst ableitet

| Ableitung | Quelle | Warum nicht als Prop |
|---|---|---|
| `canonical` | die Route | war bisher siebenmal von Hand danebengeschrieben — eine Fehlerquelle weniger |
| **Hintergrundmotiv** | `data/services.ts` → `backgroundImage` des Katalogeintrags | **Alle sieben haben bereits eines.** Kein neues Asset nötig, keine neue Zuordnung, und die Kachel auf `/leistungen` zeigt zwangsläufig dasselbe Motiv wie die Seite. |
| FAQ-Route | die Route | `PageFAQ` nimmt ohnehin eine Route |
| USP-Eyebrow | fest „Warum CarCare Center Leipzig" | steht auf allen sieben wörtlich gleich |
| FAQ-Eyebrow | fest „FAQ" | dito |
| **Spaltenzahl** | Kartenzahl: vier Karten → vier Spalten, sonst drei | **war schon vorher die gelebte Regel, nur ungeschrieben** — exakt die vier Seiten mit vier Karten setzten `columns="four"`. Es ist auch die richtige Regel: vier Karten in drei Spalten lassen eine Karte allein in der zweiten Reihe stehen. Als Prop weiterhin überschreibbar. |

Damit schrumpft jede Seite von ~52 Zeilen auf Daten plus einen Aufruf. Die drei
`SectionIntro`-Gerüste, die drei `<section>`-Hüllen und der Hintergrundwechsel
`bg-white` / `bg-gray-50/70` liegen nur noch einmal im Projekt.

### Was sie können muss, weil es Abweichungen gibt

- **`leistung.description` optional** — vier Seiten haben eine, drei nicht.
- **`zoom` optional** — `BackdropLayout` nimmt es bereits. Auf
  `/fahrzeugaufbereitung-leipzig` steht `zoom={1}`, weil das Motiv hochformatiger ist
  als die Backdrop-Fläche. Ob eines der sieben Motive das braucht, zeigt erst der
  visuelle Durchgang.
- **`children` als Ausweg** — für Sektionen, die eine Seite zusätzlich braucht.
  Ohne diesen Ausweg wird die Komponente beim ersten Sonderwunsch aufgebohrt oder
  umgangen. Absehbarer Fall: 1.15.

### Warum keine vollständig datengetriebene Lösung

Man könnte die sieben Seiten ganz in Daten auflösen und eine generische Seite alle
rendern lassen. Dagegen spricht: **1.15 wird die Seiten wieder auseinanderlaufen
lassen** — jede bekommt ihre eigene Erklärung, womöglich unterschiedlich lang und
strukturiert. Eine Datenstruktur, die das abbildet, wäre am Ende eine schlechtere
Programmiersprache. Eine Layout-Komponente mit `children` trägt beides.

### Kartenton

`FeatureGrid` hat seit Paket B `tone="translucent"` für halbtransparente Karten. Über
einem stehenden Foto ist das der richtige Wert — weiße Karten decken das Motiv zu, das
gerade sichtbar werden soll. Die Komponente setzt ihn selbst, damit niemand ihn
vergisst.

---

## 3 — Phasen

Branch: `paket-c/serviceseiten-layout`.
Nach jeder Phase Build mit beiden Wächtern; nach Phase 3 zusätzlich
`npm run smoke -- --seit HEAD` gegen das Deployment.

### ✅ Phase 1 — Komponente und Pilot *(Commit `69255c3`)*
**Ziel:** `ServiceLayout` an einem echten Verwender belegen, nicht an einer Vermutung.

* [x] `components/ServiceLayout.tsx` erzeugt (198 Zeilen)
* [x] `serviceByHref()` in `data/services.ts` ergänzt — Katalogeintrag zur Route,
      Quelle des Seitenhintergrunds
* [x] `pages/DellenentfernungPage.tsx` migriert: 52 → 64 Zeilen, davon 0 Zeilen Gerüst
* [x] Erklärsektion (1.15) als **Pflichtfeld, aber leerbar** eingebaut, vor der
      Fachsektion
* [x] `scripts/check-faq.mjs`: erkennt durchreichende Layout-Komponenten selbst
* [x] `scripts/prerender.mjs`: Renderfehler statt Zeitüberschreitung melden
* [x] Gegenproben gefahren (drei, siehe Kommentare)
* [x] Build grün: 25/25 Routen, 224 FAQPage-Texte; visuell Desktop + mobil geprüft

**Warum die Komponente nicht allein kam:** Eine Komponente ohne Verwender ist eine
Vermutung darüber, was gebraucht wird. Zwei der drei Nacharbeiten unten wären ohne
den echten Verwender im selben Commit gar nicht aufgefallen.

**Referenzen:**
`components/ServiceLayout.tsx`
`pages/DellenentfernungPage.tsx`
`scripts/check-faq.mjs`

### ⏸ Phase 2 — Hagelschaden + Autoglas
**Ziel:** Die beiden übrigen Seiten ohne `description`, gleicher Zuschnitt wie der Pilot.

* [ ] `pages/HagelschadenreparaturPage.tsx` migrieren (4 Karten → `four` abgeleitet)
* [ ] `pages/AutoglasPage.tsx` migrieren (4 Karten → `four` abgeleitet)
* [ ] Build, visuell Desktop + mobil

> **Wartet auf Freigabe.** Der Stand nach Phase 1 wird zuerst gezeigt — am Schnitt der
> Komponente ist nach einer Migration billiger zu ändern als nach sieben.

### ⏸ Phase 3 — Die vier Seiten mit `description`
* [ ] `pages/AutolackierungPage.tsx` (6 Karten)
* [ ] `pages/SmartRepairPage.tsx` (4 Karten)
* [ ] `pages/FelgenreparaturPage.tsx` (6 Karten)
* [ ] `pages/FuhrparkservicePage.tsx` (4 Karten)
* [ ] Build, visuell, danach `npm run smoke -- --seit HEAD`

### ⏸ Phase 4 — Leasingrückgabe prüfen, nicht migrieren
* [ ] Belegen, dass die Seite weiterhin dasselbe Foto-Verhalten zeigt
* [ ] Dokumentieren, warum sie außen vor bleibt (6 Sektionen, Preis- und
      Zielgruppenblöcke — sie wäre ein `children`-Bündel, kein Muster)

### ⏸ Phase 5 — 1.15: eigenständige Erklärung je Leistung
* [ ] Sieben Erklärtexte schreiben, `erklaerung={null}` je Seite ersetzen
* [ ] Prüfen, ob dabei Dopplungen zur Hero-Description entstehen

> **Texte erst nach Sichtung der Struktur** — ausdrückliche Vorgabe.

### ⏸ Phase 6 — Doku, Backlog, Optimierungsplan
* [ ] `docs/backlog/schleife-1.md`: 1.14/1.15 auf umgesetzt
* [ ] Optimierungsplan mit den Funden aus den Kommentaren unten

---

## 4 — Zu 1.15

*„Jede Leistung kurz und eigenständig erklären (Ziel: direkte Landung bei Suche
‚Smart Repair Leipzig')."*

Das ist **Inhaltsarbeit, keine Strukturarbeit**, und es gehört nach 1.14 — der Text
braucht erst einen Platz. Was heute fehlt: Die Seiten steigen mit Vorteilen und USP
ein, ohne die Leistung vorher zu erklären. Wer über „Smart Repair Leipzig" landet und
den Begriff nicht kennt, findet keine Definition.

Konkret je Seite: zwei bis vier Sätze nach dem Antwort-zuerst-Prinzip (SEO-GEO §4.3) —
*was ist das, wann kommt es infrage, wo sind die Grenzen*. Eigenständig verständlich,
also auch aus dem Kontext gerissen zitierbar.

**Entschieden am 2026-09-03:** eigene Sektion, **vor** der Fachsektion — erst „was ist
Smart Repair", dann „was bieten wir dabei an". Nicht in die `PageHero`-Description: die
ist bereits gefüllt und für Fließtext dieser Länge zu prominent gesetzt.

### Wie „Feld existiert, ist leer" umgesetzt ist

Vorgabe: Die Sektion ist fester Bestandteil der Komponente, auch solange kein Text da
ist — nicht „manche Seiten haben es".

`erklaerung` ist deshalb ein **Pflichtfeld vom Typ `ServiceErklaerung | null`**:

- **Pflicht**, also kann keine Leistungsseite entstehen, ohne dass jemand die
  Entscheidung trifft. Ein Vergessen ist ein Typfehler beim Build, kein stiller
  Ausfall. (Gegengeprüft: Prop entfernt → `tsc` bricht mit TS2741 ab.)
- **`null` erlaubt**, weil „Text steht noch aus" ein echter Zustand ist und benannt
  gehört. Bei `null` wird **nichts** gerendert: kein Platzhaltertext, keine leere
  Sektion mit Innenabstand.

Kein Fülltext, auch kein „Text folgt". Erfundene Inhalte auf einer Kundenseite gehen
erfahrungsgemäß live, weil sie beim Review wie fertiger Text aussehen — dieselbe
Begründung wie bei den Exklusivleistungen aus Paket B (1.18).

---

## 5 — Was mir dabei aufgefallen ist

**Ein Motiv doppelt belegt.** `smart-repair-leipzig-carcare.webp` ist nach der Rochade
aus 1.13 das Kachelmotiv der Leasingrückgabe — und wäre nach dieser Migration
gleichzeitig der Seitenhintergrund von Smart Repair. Kein Fehler, aber sichtbar. Löst
sich mit Backlog **1.28** (eigene Motive, Zulieferung André).

**Sieben Kanonische von Hand.** Jede der sieben Seiten schreibt ihr `canonical` selbst.
Beim Durchsehen war keines falsch — aber es gibt keinen Grund, das Risiko sieben Mal
einzugehen, wenn die Route ohnehin danebensteht.

---

## 6 — Kommentare

### Phase 1
**Eingehalten:** unter 700 Zeilen (198 / 64) ✅, Mobile-First geprüft ✅, keine
erfundenen Inhalte ✅, Single Source of Truth für Motiv und FAQ ✅, CSS-native
Lösung statt JS (`sticky`) ✅, drei Gegenproben gefahren ✅, Textregeln CLAUDE.md
unberührt (kein Text geändert) ✅, Encoding sauber ✅.

**Auffälligkeiten/Findings (nach Schwere), alle in Phase 1 mitbehoben:**

1. 🔴 **Kritisch — `check-faq.mjs` war nach der Migration blind.** *(behoben)*
   Der Wächter suchte ausschließlich nach `<PageFAQ route="…">`. Sobald
   `ServiceLayout` die Route durchreicht, findet er nichts mehr. Beim ersten Build
   nach der Migration meldete er die Dellenentfernung als Waise und brach ab —
   ein Fehlalarm, aber der harmlose Fall. **Der gefährliche Fall wäre der
   umgekehrte gewesen:** hätte ich `ServiceLayout` einfach als zweites Muster fest
   eingetragen, wäre der Wächter beim nächsten Layout wieder blind gewesen, dann
   aber lautlos — eine echte Waise wäre durchgerutscht und hätte die Rich Results
   der Seite gekostet. Der Wächter erkennt Durchreicher jetzt selbst: Jede `.tsx`,
   die `PageFAQ` eine Route als Ausdruck übergibt, gilt als solcher, und deren
   Verwendungen zählen. Die Erkennung steht im Log (`davon 1 über
   Layout-Komponente (ServiceLayout)`), damit sie widerlegbar ist.
   *Gegenprobe: FAQ-Route verbogen → Waise wird weiterhin gemeldet, Exit 1.*

2. 🟠 **Hoch — Prerender maskierte Renderfehler als Zeitüberschreitung.** *(behoben)*
   Ein Fehler beim Rendern erschien im Log als `Waiting failed: 30000ms exceeded`:
   30 Sekunden Wartezeit je betroffener Route und kein Wort zur Ursache. Beim
   Gegentest zu `ServiceLayout` stand die aussagekräftige Meldung im Browser und
   kam nirgends an. Das Warten rennt jetzt gegen die Seitenausnahme
   (`page.once('pageerror')`); die Ursache steht im Klartext im Build-Log. Die
   Rejection wird zusätzlich abgefangen, damit eine Ausnahme *nach* erfolgreichem
   Render den Node-Prozess nicht abschießt.
   *Wirkung: `[prerender] FEHLER /…: Unbehandelte Ausnahme der Seite: [ServiceLayout] Kein Kachelmotiv für "…"`.*

3. 🟡 **Mittel — Planungsfehler: `columns` übersehen.** *(korrigiert, s. Abschnitt 1)*
   Die erste Planfassung nannte die `description` als einzigen Unterschied der
   sieben Seiten. Das maschinelle Auslesen hatte nur das Sektionsgerüst erfasst,
   nicht die Attribute am `FeatureGrid`. Folge wäre gewesen, dass vier Seiten nach
   der Migration eine einzelne Karte allein in der zweiten Reihe stehen hätten.
   Aufgefallen beim Durchsehen der Seiten vor dem Schreiben — die Regel ist
   jetzt hergeleitet statt abgeschrieben.

4. 🟢 **Gering — ein Motiv doppelt belegt.** *(offen, gehört zu 1.28)*
   `smart-repair-leipzig-carcare.webp` ist seit der Rochade aus 1.13 das
   Kachelmotiv der Leasingrückgabe und wird ab Phase 3 zusätzlich der
   Seitenhintergrund von Smart Repair. Kein Fehler, aber sichtbar. Löst sich mit
   der Zulieferung eigener Motive durch André (Backlog 1.28).

5. 🟢 **Gering — kein Screenshot-Skript mehr im Projekt.** *(offen)*
   Die visuellen Nachweise entstehen jedes Mal über ein Wegwerf-Skript
   (`vite preview` + Puppeteer, Scroll-Halteschleife gegen Lenis). Für eine Seite
   mit stehendem Foto ist die Sichtprüfung fester Bestandteil jeder Änderung —
   das gehört als `npm run shots` ins Projekt statt in den Papierkorb. Vorschlag
   für den Optimierungsplan.

**Kein Refactoring-Plan nötig für 1–3** — sie sind in derselben Phase behoben und
gegengeprüft. 4 und 5 wandern in Phase 6 in den Optimierungsplan.
