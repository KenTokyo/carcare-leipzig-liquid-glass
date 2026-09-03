# Paket C — Serviceseiten-Layout vereinheitlichen (1.14, 1.15)

Backlog: `docs/backlog/schleife-1.md`, Paket C
Vorgabe aus dem Backlog: *„1.14 ist ein Fall für eine gemeinsame Layout-Komponente,
nicht für acht einzeln angepasste Seiten. Erst Komponente bauen, dann migrieren."*

> **Stand 2026-09-03:** Paket C strukturell abgeschlossen. 1.14 umgesetzt, bei 1.15
> steht die Sektion und ist leer — die Texte liefert André (Backlog **1.29**).

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

Die drei `SectionIntro`-Gerüste, die drei `<section>`-Hüllen mit ihren Klassenketten
und der Hintergrundwechsel `bg-white` / `bg-gray-50/70` liegen danach einmal im
Projekt statt siebenmal.

> **Kein Größenversprechen.** Am Pilot gemessen bleibt die Seitendatei etwa gleich groß
> (3.600 → 3.703 Zeichen): 19 Zeilen Gerüst-JSX verschwinden, dafür stehen die Texte
> jetzt umbrochen statt in 360 Zeichen langen Zeilen. Der Gewinn ist nicht die
> Dateigröße, sondern dass eine Layoutänderung eine Änderung ist und nicht sieben.

### Was sie können muss, weil es Abweichungen gibt

- **`leistung.description` optional** — vier Seiten haben eine, drei nicht.
- **`zoom` optional** — `BackdropLayout` nimmt es bereits. Auf
  `/fahrzeugaufbereitung-leipzig` steht `zoom={1}`, weil das Motiv hochformatiger ist
  als die Backdrop-Fläche. Ob eines der sieben Motive das braucht, zeigt erst der
  visuelle Durchgang.
- **`children` als Ausweg** — für Sektionen, die eine Seite zusätzlich braucht.
  Ohne diesen Ausweg wird die Komponente beim ersten Sonderwunsch aufgebohrt oder
  umgangen. Absehbarer Fall: 1.15.

  > **Bekannte Einschränkung, bewusst nicht vorgebaut.** `children` landet zwischen
  > Vertrauens- und FAQ-Sektion. Eine Seite, die etwas *vor* der Fachsektion braucht,
  > kann das damit nicht ausdrücken. Der Fall ist bisher nicht eingetreten; träte er
  > ein, wäre er mit einem zweiten Slot schnell ergänzt. Vorher einen einzubauen hieße,
  > eine Vermutung zu bauen — dieselbe Begründung, aus der die Komponente erst mit
  > ihrem ersten Verwender kam. *(Entschieden am 2026-09-03.)*

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
* [x] `pages/DellenentfernungPage.tsx` migriert: 19 Zeilen Gerüst-JSX raus, Datei
      bleibt etwa gleich groß (siehe Hinweis in Abschnitt 2)
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

### ✅ Phase 2 — Felgenreparatur, die längste Seite *(Commits `c47e581`, `eaf2b22`, `ddc6161`)*
**Ziel:** Prüfen, ob die Gliederung ohne den Wechsel Weiß/Grau auch auf einer vollen
Seite trägt. Vorgabe: *„Bei Dellenentfernung trägt das, aber die Seite ist schlank."*

Ausgewählt wurde nicht nach Quelltextlänge (die sagt hier nichts — 51 bis 53 Zeilen bei
allen sieben), sondern nach der **gerenderten Höhe**:

| Seite | Desktop | Mobil | Karten |
|---|---|---|---|
| **Felgenreparatur** | **4.428 px** | **6.752 px** | **13** |
| Dellenentfernung *(Pilot)* | 4.365 px | 6.322 px | 12 |
| Neu- & Reparaturlackierung | 4.362 px | 6.570 px | 12 |
| Smart Repair | 4.225 px | 6.185 px | 10 |
| Autoglas | 4.143 px | 6.057 px | 11 |
| Hagelschadenreparatur | 4.119 px | 6.035 px | 11 |
| Fuhrparkservice | 4.020 px | 5.718 px | 10 |

* [x] `pages/FelgenreparaturPage.tsx` migriert — zugleich die erste Seite **mit**
      `description` an der Fachsektion, deckt damit beide Varianten des Musters ab
* [x] Beide Sektionsgrenzen visuell belegt, Desktop und mobil
* [x] 🔴 Kontrastfehler gefunden und behoben, siehe Kommentare Phase 2
* [x] Build grün, `check-faq` meldet „davon 2 über Layout-Komponente"

**Ergebnis zur Ausgangsfrage:** Die Gliederung trägt. Den Übergang leisten Weißraum,
blauer Eyebrow und die große Überschrift; der frühere harte Kantenwechsel fehlt nicht.

### ✅ Phase 3 — Die restlichen fünf *(Commit `bc75311`)*
* [x] `pages/HagelschadenreparaturPage.tsx` (4 Karten → `four` abgeleitet)
* [x] `pages/AutoglasPage.tsx` (4 Karten → `four` abgeleitet)
* [x] `pages/AutolackierungPage.tsx` (6 Karten → `three`)
* [x] `pages/SmartRepairPage.tsx` (4 Karten → `four` abgeleitet)
* [x] `pages/FuhrparkservicePage.tsx` (4 Karten → `four` abgeleitet)
* [x] Build grün, `check-faq` meldet „davon 7 über Layout-Komponente"
* [x] Gegenprobe auf Textverlust (siehe unten)

**Gegenprobe auf Textverlust.** Alle Zeichenketten der sieben Seitendateien gegen den
Stand vor Paket C (`dd71719`) verglichen. Einziger Baustein, der die Seitendateien
verlassen hat, ist der Eyebrow „Warum CarCare Center Leipzig" — der steht jetzt in der
Komponente und im ausgelieferten HTML aller sieben. **Jeder andere Text ist wörtlich
unverändert.** Ebenfalls geprüft: sieben Routen, sieben verschiedene Kachelmotive, je
das eigene.

**Damit ist 1.14 abgeschlossen.**

### ✅ Phase 4 — Leasingrückgabe geprüft, nicht migriert
* [x] Foto-Verhalten unverändert — sie nutzt dieselbe `BackdropLayout`-Mechanik und
      hat den Kontrastfix aus Phase 2 automatisch mitbekommen (2,05:1 → 6,78:1 mobil)
* [x] Bleibt außen vor, und zwar begründet

**Warum sie nicht migriert wird.** Sie hat sechs Sektionen statt drei: zwei
Zielgruppenblöcke (Privat- und Geschäftskunden, je vier Karten), einen Leistungsblock
mit Querverweisen auf vier andere Seiten und einen `ProcessList`-Ablauf. Über
`ServiceLayout` wäre davon nur die FAQ-Sektion abgedeckt; alles andere käme als
`children`-Bündel herein. Das Ergebnis wäre eine Komponente, die für eine Seite ein
Gerüst trägt und für die andere nur ein Umschlag ist — **die Migration würde die Seite
nicht vereinheitlichen, sondern nur verstecken, dass sie anders ist.**

### ✅ Phase 5 — 1.15: Struktur steht, Texte ausstehend
* [x] Erklärsektion als Pflichtfeld in `ServiceLayout`, vor der Fachsektion
* [x] `erklaerung={null}` auf allen sieben Seiten — die Sektion existiert und ist leer
* [x] TODO-Kommentar auf jeder der sieben Seiten, mit der konkreten Frage
      („Was ist Smart Repair?") und Verweis auf Backlog **1.29**
* [x] Backlog-Punkt 1.29 angelegt: Zulieferung André
* [ ] Texte einsetzen — **wartet auf 1.29**

**Warum die Texte nicht von mir kommen.** Zwei bis drei Absätze zu „Was ist X?" sind
fachliche Aussage über Verfahren und Machbarkeit — wann Smart Repair reicht, bis zu
welcher Tiefe eine Felge repariert werden darf, wann der Lack für die lackfreie
Dellenentfernung noch intakt genug ist. Das lässt sich nicht formulieren, ohne dass
André es hinterher korrigiert. Dieselbe Regel wie beim Exklusivleistungs-Block (1.18):
erfundener Text sieht im Review wie fertiger Text aus und geht so live.

**Zustand im Code, damit es nicht vergessen wird:** `erklaerung` ist Pflichtfeld vom
Typ `ServiceErklaerung | null`. Eine neue Leistungsseite ohne Entscheidung darüber gibt
es nicht — das wäre ein Typfehler beim Build. `null` rendert nichts: kein Platzhalter,
keine leere Sektion mit Innenabstand.

### ✅ Phase 6 — Doku, Backlog, Optimierungsplan
* [x] `docs/backlog/schleife-1.md`: 1.14 auf umgesetzt, 1.15 auf „Struktur umgesetzt,
      Texte offen", Paket-C-Abschluss vermerkt
* [x] Backlog **1.29** angelegt (Erklärtexte, Zulieferung André)
* [x] Abschnitt 7 dieses Plans: Kontrastprüfung, `npm run shots`, `npm run kontrast`,
      Token-Reparatur als eigener Branch

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
gegengeprüft. 4 und 5 stehen in Abschnitt 7.

### Phase 2
**Eingehalten:** Mobile-First geprüft ✅, Auswahl der Prüfseite nach gemessener statt
vermuteter Länge ✅, CSS-native Lösung (Media Query statt Inline-Style) ✅, schwächste
wirksame Variante gewählt ✅, Fixes in getrennten, einzeln zurücknehmbaren Commits ✅,
Encoding sauber ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🔴 **Kritisch — Hero-Fließtext verfehlte auf dem Telefon den WCAG-Kontrast.**
   *(behoben, `eaf2b22` + `ddc6161`)*
   Beim visuellen Durchgang aufgefallen, dann nachgemessen. **Kein Fehler aus Paket C:**
   Alle vier seit August live stehenden Backdrop-Seiten waren betroffen — Paket C hätte
   ihn nur von vier auf elf Seiten ausgeweitet.

   Ursache: Der weiße Textschutz ist ein Verlauf über die **Viewport**-Breite, der Text
   steht in einer **Spalte**. Auf dem Desktop endet die Spalte (`max-w-3xl`) bei rund
   59 % der Breite, dort liegt noch Schutz. Unter 768 px läuft sie über die volle
   Breite — das letzte Drittel jeder Zeile stand auf blankem Foto.

   | Seite | 390 px vorher | 390 px jetzt | 1440 px |
   |---|---|---|---|
   | `/leasingrueckgabe` | **2,05:1** | 6,78:1 | 8,41:1 |
   | `/felgenreparatur` | **2,68:1** | 7,33:1 | 8,70:1 |
   | `/innenaufbereitung` | **2,66:1** | 7,11:1 | 9,69:1 |
   | `/dellenentfernung` | **2,52:1** | 7,05:1 | 9,88:1 |
   | `/fahrzeugaufbereitung` | 4,74:1 | 8,94:1 | 9,82:1 |
   | `/aussenaufbereitung` | 4,65:1 | 8,87:1 | 9,89:1 |

   WCAG 2.1 AA verlangt 4,5:1 für Fließtext. Über 768 px ändert sich nichts — derselbe
   Verlauf wie bisher. Mobil bleiben rechts 52 % Deckung statt 0 %: Das Foto ist weiter
   zu sehen, nur verschleiert. Drei Stärken durchgemessen, die behutsamste genommen.

2. 🟠 **Hoch — meine ersten beiden Messungen waren falsch.** *(korrigiert)*
   Anlauf 1 zählte antialiaste Glyphenränder zum Hintergrund und meldete 3,84:1 statt
   2,68:1. Anlauf 2 maß den Kontrast **an** gerenderten Glyphenpixeln — das misst die
   Schriftglättung, nicht die Farbwahl, und lieferte über alle Seiten hinweg identische
   Werte, was der Hinweis auf den Fehler war. Erst Anlauf 3 rechnet nach WCAG-Definition:
   Hintergrundfläche ohne Text aufnehmen, die halbtransparente Textfarbe rechnerisch
   voll deckend darüberlegen, und nur Pixel innerhalb der Glyphenmaske werten.
   **Lehre:** Bei halbtransparenten Textfarben (dieses Projekt: `gray-300..700` tragen
   eingebackene Alphas) taugt kein Kontrastwert, der aus einem einzelnen Screenshot
   stammt.

3. 🟡 **Mittel — Auswahl nach Quelltextlänge wäre danebengegangen.**
   Die sieben Seiten liegen bei 51 bis 53 Zeilen; die Tabelle in Abschnitt 1 hätte
   Autolackierung oder Felgenreparatur nahegelegt, beide 53. Gerendert ist
   Felgenreparatur mit 4.428 px tatsächlich die längste, Autolackierung liegt mit
   4.362 px hinter der schlanken Dellenentfernung (4.365 px). Quelltextzeilen sagen bei
   diesen Seiten nichts über Seitenlänge — Karten- und FAQ-Zahl entscheiden.

---

## 7 — Für den Optimierungsplan (nach Paket C)

| # | Fund | Stand |
|---|---|---|
| 1 | **`npm run shots` und `npm run kontrast` ins Projekt** — Spezifikation unten. | eingeplant, *nicht jetzt* — nach Abschluss von Paket C *(Vorgabe 2026-09-03)* |
| 2 | **Ein Motiv doppelt belegt.** `smart-repair-leipzig-carcare.webp` ist seit der Rochade aus 1.13 das Kachelmotiv der Leasingrückgabe und ist seit Phase 3 zusätzlich der Seitenhintergrund von Smart Repair. Kein Fehler, aber sichtbar. | löst sich mit Backlog **1.28** (eigene Motive, Zulieferung André) |
| 3 | **Fünf verwaiste Komponenten.** `About`, `AccidentFocus`, `Hero`, `Jobs` und `TargetGroups` werden nirgends importiert und erscheinen auf keiner Seite. Aufgefallen bei der Token-Reparatur: 6 von 19 Grau-Änderungen lagen in totem Code. **Nicht einfach löschen** — `About.tsx` trägt laut Kommentar in `pages/UeberUnsPage.tsx` noch echte Kundentexte; `Hero.tsx` steht zusätzlich unter der Projektvorgabe „nicht anfassen", die dann zu klären wäre. Vorgehen: Verwaisung über den Import-Graph belegen (nicht per Pfad-Grep, siehe Hinweis in der Token-Doku), je Komponente entscheiden — löschen, oder Text vorher sichern. | offen, eigener Durchgang |

### 7.0 🔴 Kontrast außerhalb der Backdrop-Seiten — geprüft, zwei Ergebnisse

Auftrag: *„Der Mechanismus — Verlauf über Viewport-Breite, Text in Spalte, unter 768 px
volle Breite — ist nicht auf ServiceLayout beschränkt."*

**Ergebnis 1: Der Mechanismus selbst tritt nirgends sonst auf — und war überall schon
mitrepariert.** `textGuard="wide"` gibt es ausschließlich in `BackdropLayout`. Das nutzen
neben `ServiceLayout` (7 Seiten) noch acht weitere: Unfallinstandsetzung,
Fahrzeugaufbereitung, Innen- und Außenaufbereitung, Leasingrückgabe, Privatkunden,
Geschäftskunden, Über uns. Weil die Reparatur in der gemeinsamen Klasse
`.cc-guard-wide` sitzt, hat sie alle davon erfasst — auch die vier, die seit August live
standen. Die zweite Variante `textGuard="default"` nutzt nur `ServiceGrid` auf der
Startseite; dort ist der Text ein kurzer Kopfbereich, keine Spalte über die volle Breite.

**Ergebnis 2: Dabei ist ein größeres Problem aufgefallen, das mit Fotos nichts zu tun
hat.** Drei Farbtokens verfehlen AA auf schlichtem Weiß. Exakt gerechnet aus den
Token-Definitionen, nicht gemessen:

| Token | löst auf zu | auf Weiß | Verwendung |
|---|---|---|---|
| `text-blue-700` | signal-blue `47 128 237` | **3,87:1** | **48×** — u. a. der Eyebrow in `PageHero` (11 px fett) und „Mehr erfahren" in `FeatureGrid`; damit auf fast jeder Seite |
| `text-gray-400` | graphite @ 42 % | **2,66:1** | 16× |
| `text-gray-500` | graphite @ 58 % | **4,30:1** | 12× |

Zum Vergleich, dieselbe Rechnung für die Nachbartokens: `text-blue-600` (trust-blue)
**10,04:1**, `text-gray-600` **6,92:1**, `text-gray-700` **10,66:1**. Der Eyebrow in
`SectionIntro` nutzt `blue-600` und ist deshalb in Ordnung — der in `PageHero` nutzt
`blue-700` und ist es nicht.

**Reparatur entschieden am 2026-09-03: eigener Branch nach Paket C, dann vollständig.**

* [ ] `text-blue-700` → `text-blue-600` für **Text** — **alle 48 Fundstellen**, nicht nur
      der Eyebrow. Ein halb umgestellter Token ist schlimmer als der alte: Dann stehen
      zwei Blautöne nebeneinander und niemand weiß mehr, welcher gilt.
* [ ] `text-gray-400` (16×) und `text-gray-500` (12×) im selben Durchgang — aber
      **pro Fundstelle prüfen, ob es Text oder Dekoration ist.** Rahmen, Trenner und
      Icon-Flächen brauchen keinen Textkontrast; sie dürfen bleiben. Nur wo der Token
      Fließtext einfärbt, wird gehoben.
* [ ] Nicht für Flächen (`bg-blue-700`) — nur für Schriftfarben.

Der Umfang ist der Grund für den eigenen Branch: 48 plus 28 Fundstellen sind eine
sichtbare Änderung auf der ganzen Kundenseite und haben in einem Paket, das
Serviceseiten-Layout heißt, nichts verloren.

> **Was ich nicht behaupte.** Der Rundumlauf über alle 25 Routen lieferte auch nach vier
> Korrekturen am Messaufbau noch unplausible Werte (Kartentext auf weißem Grund mit
> 1,36:1). Diese Liste ist deshalb **nicht** als Befund verwendet. Die Zahlen oben sind
> aus den Token-Definitionen gegen Weiß gerechnet — exakt, ohne Messung — und für den
> Blau-Fall zusätzlich zweimal unabhängig am Bildschirm bestätigt (3,87:1). Was der
> Rundumlauf noch braucht, steht in 7.2.

### 7.0b Das Muster hinter den Wächter-Funden — eigenes Dokument

Die Findings dieser Woche haben eine gemeinsame Form, die in Einzelbefunden verstreibt
und deshalb ausgelagert ist:

**`docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`**

Fünf Prüfungen waren notwendig, aber nicht hinreichend — und alle fünf haben grün
gemeldet in genau der Lage, in der sie hätten greifen müssen. Die Leitfrage für jeden
künftigen Wächter steht dort, ebenso in `CLAUDE.md` unter *Umsetzungsprinzipien*:

> **Was besteht diese Prüfung, ohne dass die Sache tatsächlich in Ordnung ist?**

### 7.1 `npm run shots` — Sichtprüfung als Werkzeug

Die visuellen Nachweise entstehen bisher jedes Mal über ein Wegwerf-Skript. Bei Seiten
mit stehendem Foto gehört die Sichtprüfung zu jeder Änderung. Was das Skript können muss:

- `vite preview` gegen `dist/` starten, Puppeteer, Route und Breite als Argumente
- **Scroll-Halteschleife gegen Lenis** — `scrollTop` in einer eigenen `requestAnimationFrame`-
  Schleife *nach* Lenis halten, sonst federt die Seite vor der Aufnahme zurück
- `window.__CC_NO_PRELOADER__ = true` per `evaluateOnNewDocument`, sonst liegt die Blende im Bild
- **Sektionsgrenzen automatisch anfahren** statt fester Viewport-Vielfacher — die
  Übergänge sind das, was man sehen will
- Desktop 1440 und mobil 390 in einem Lauf

### 7.2 `npm run kontrast` — der eigentliche Gewinn

**Er hat gefunden, was drei Sichtprüfungen nicht gefunden haben** (Phase 2, 🔴). Das
gehört ins Repo, nicht in ein Wegwerf-Skript. Der Aufbau ist allerdings voller Fallen —
ich bin in fünf davon getappt, deshalb hier die Spezifikation und nicht nur der Wunsch:

1. **Nicht an gerenderten Textpixeln messen.** Kantenglättung erzeugt teildeckende
   Pixel mit beliebig schlechtem Kontrast — das misst die Schriftglättung, nicht die
   Farbwahl. Erkennungszeichen: über alle Seiten hinweg identische Werte.
2. **Zwei Aufnahmen derselben Stelle**, mit und ohne Text
   (`*{color:transparent!important;-webkit-text-fill-color:transparent!important}`).
   Die Textfarbe rechnerisch voll deckend über den gemessenen Hintergrund legen.
3. **Halbtransparente Textfarben mitrechnen.** In diesem Projekt tragen `gray-300..700`
   eingebackene Alphas — der wirksame Ton hängt vom Hintergrund ab.
4. **Nur hinter den Glyphen messen**, nicht über den ganzen Zeilenkasten.
   `Range.getClientRects()` liefert die Zeilenkästen; die Glyphenmaske ergibt sich aus
   der Differenz der beiden Aufnahmen. Ohne diesen Schritt zählen Kasteneckchen mit —
   etwa die helle Rundung eines dunklen Knopfes unter weißer Schrift.
5. **Nur messen, was auch gemalt wird.** Navigations-Flyout und mobile Schublade stehen
   im DOM, haben Layout mitten im Viewport und sind trotzdem unsichtbar. Weißer
   Fußleistentext, der unsichtbar über dem hellen Hero liegt, ergibt rechnerisch 1:1.
   Zwei Filter zusammen fangen das: `el.checkVisibility({opacityProperty: true,
   visibilityProperty: true})` für Blenden am Vorfahren, und eine Trefferprobe per
   `document.elementFromPoint()` auf die Mitte des Zeilenkastens für alles Verschobene,
   Überdeckte und Weggeschnittene.
6. **Sample-Rechteck auf die Leinwand begrenzen.** `getImageData` außerhalb liefert
   transparentes Schwarz — bei halbtransparenter Schrift wieder rechnerisch ~1:1.

Schwelle: WCAG 2.1 AA, 4,5:1 für Fließtext, 3:1 für großen Text (≥24 px, oder ≥18,66 px
ab Schriftschnitt 700). Ausgabe: schlechtester Wert je Route/Breite/Textstelle,
aufsteigend sortiert, Exitcode 1 bei Unterschreitung — damit taugt er als Wächter.
