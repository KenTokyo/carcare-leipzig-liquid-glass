# Paket D — Karriere, Geschäftskunden, Navigation (1.21–1.25)

Backlog: `docs/backlog/schleife-1.md`, Paket D

> **Planung. Kein Code.**

---

## 1 — Gibt es die Karriereseite? Ja, und sie ist vollständig

`/karriere` existiert seit Längerem, `pages/CareerPage.tsx`, 64 Zeilen. Aufbau:

```
PageMeta · PageHero (2 CTAs, Sprungmarke #jobbereiche)
section bg-white       → „Job-Cards"            FeatureGrid, 4 Positionen, columns=four
section bg-gray-50/70  → „Arbeitgeberversprechen" FeatureGrid, 4 Benefits
section bg-white       → „Bewerbungsprozess"     ProcessList, 4 Schritte
section bg-gray-50/70  → „FAQ"                   PageFAQ, 3 Fragen
PageCTA
```

Ausgeliefert: 51.904 Bytes, **9 JSON-LD-Blöcke** — Breadcrumb, **4 × JobPosting**,
FAQPage, plus die globalen Organization/WebSite/AutoRepair.

**Sie folgt nicht dem `ServiceLayout`-Muster** und soll es auch nicht: kein
Kachelmotiv im Katalog, andere Sektionsfolge, `ProcessList` statt zweitem Raster.
Sie bleibt eine eigene Seite.

**Drehanimationen, die 1.21 ausschließt, gibt es hier keine.** `FeatureGrid` animiert
nur Einblenden und Anheben beim Hovern. Die Vorgabe zielt vermutlich auf die verwaiste
`components/Jobs.tsx` (Split-Screen mit Icon-Invertierung) — die rendert nirgends.
**Vor Umsetzung mit André klären, was er gesehen hat**, sonst wird 1.21 gegen einen
Zustand gebaut, den es nicht gibt.

---

## 2 — 1.24 Serviceberater entfernen: sieben Fundstellen in fünf Dateien

Auftrag war, vollständig zu prüfen. Die Positionsliste ist eine von sieben Stellen:

| # | Ort | Art | Anmerkung |
|---|---|---|---|
| 1 | `pages/CareerPage.tsx:8` | Positionskarte | die offensichtliche |
| 2 | `pages/CareerPage.tsx:27` | **Meta-Description** | „… sowie Serviceberater." — Länge prüfen, sie sitzt an der 160-Zeichen-Grenze |
| 3 | `seo/pageSchemas.ts:137` | **`jobPostingSchema`** | Google zeigt sonst eine Stelle an, die es nicht gibt |
| 4 | `data/faqs.ts:144` | FAQ `/karriere`, „Welche Jobbereiche gibt es?" | Antwort zählt alle vier auf |
| 5 | `data/faqs.ts:174` | FAQ **`/ueber-uns`**, „Sucht das CarCare Center neue Mitarbeiter?" | **andere Seite** — fällt bei einer Suche nur auf `/karriere` durch |
| 6 | `pages/UeberUnsPage.tsx:61` | **„Vier Berufsbilder unter einem Dach"** | ⚠️ **eine Zahl, keine Aufzählung** |
| 7 | `components/Jobs.tsx:43` | „Serviceberater (m/w/d)" | verwaiste Komponente, rendert nirgends |

### Der Fund, der nicht in der Positionsliste steht

**`UeberUnsPage.tsx:61` behauptet „Vier Berufsbilder unter einem Dach".** Nach dem
Entfernen sind es drei. Wer nur die Zeichenkette „Serviceberater" ersetzt, lässt eine
falsche Zahl stehen — dieselbe Falle wie bei 1.1, wo „über 30 Jahre" nicht durch eine
neue Zahl, sondern durch eine andere Formulierung ersetzt wurde.

Vorschlag: Überschrift auf **„Drei Berufsbilder unter einem Dach"** und die Aufzählung
entsprechend kürzen — oder die Zahl ganz herausnehmen, falls André den Serviceberater
später wieder aufnehmen will. **Frage an André, keine Entscheidung von uns.**

### Folge für die strukturierten Daten

`/karriere` verliert einen `JobPosting`-Block: **9 → 8 JSON-LD-Blöcke**, 4 → 3
JobPostings. Der Smoke-Test prüft nur „mindestens ein Block" und schlägt deshalb nicht
an; die Zahl gehört trotzdem in die Abnahme, damit die Änderung belegt ist.

---

## 3 — 1.25 Über uns in die Navigation: woran es hängt

**Die Backlog-Formulierung „ist nirgends verlinkt" stimmt nicht ganz.** Heute erreichbar
über zwei Wege:

- `components/Footer.tsx:217` — „Über uns" in der Spalte *Seitenstruktur*
- `components/TargetGroupCards.tsx:62` — die Zielgruppenkarte „Versicherungen &
  Agenturen" führt seit 2026-08-09 bewusst dorthin (Kommentar im Code: Versicherer
  wollen wissen, **wer** der Betrieb ist)

Was fehlt, ist die **Hauptnavigation**. Vier Berührungspunkte:

### 3.1 `components/Navbar.tsx` — der eigentliche Eingriff

```js
const navLinks = [ Leistungen, Wissen, Karriere, Kontakt ];   // 4 Einträge
const desktopLeftLinks  = navLinks.slice(0, 2);               // links vom Logo
const desktopRightLinks = navLinks.slice(2);                  // rechts vom Logo
```

**Das Logo steht mittig zwischen den beiden Hälften.** Ein fünfter Eintrag macht daraus
2 links / 3 rechts — die Navigation wird sichtbar unsymmetrisch. Anhängen genügt also
nicht; die Teilung ist mitzuentscheiden. Drei Wege:

| Weg | Ergebnis | Preis |
|---|---|---|
| **A** „Über uns" an Position 3, Teilung auf `slice(0,3)` | 3 links / 2 rechts | Reihenfolge ändert sich, „Karriere" wandert nach rechts |
| **B** „Über uns" ans Ende, Teilung bleibt | 2 links / 3 rechts | asymmetrisch |
| **C** in das bestehende Mega-Menü „Leistungen" | Navigation bleibt vierteilig | thematisch falsch — „Über uns" ist keine Leistung |

**Empfehlung: A.** Symmetrie bleibt, und „Über uns" steht dort, wo Nutzer es suchen.

### 3.2 Mobile Schublade — kommt von allein mit

Das Panel unter `xl` (`Navbar.tsx:329`) rendert dieselbe `navLinks`-Liste. Kein
zweiter Eingriff nötig, aber **mit prüfen**: Die Schublade ist im DOM immer vorhanden
und nur ausgeblendet — sie hat bei der Kontrastmessung falsche Werte erzeugt. Ein
fünfter Eintrag verlängert sie; auf 390 px die Höhe gegenprüfen.

### 3.3 Footer — nichts zu tun

Der Link steht bereits. **Nicht doppeln.**

> **Danebenliegender Fund, nicht Teil von 1.25:** In derselben Footer-Spalte zeigen
> „Impressum" und „Datenschutz" auf `href="#"` — beide Seiten fehlen ganz. Das ist eine
> Pflichtangabe nach § 5 DDG und gehört nicht in dieses Paket, sondern nach vorn.
> Steht bereits als vertagter Audit-Punkt in den Projektnotizen.

### 3.4 Sitemap — Priorität prüfen

`scripts/routes.mjs:29`: `/ueber-uns` steht auf `priority 0.8`, `changefreq yearly`.
Zum Vergleich `/privatkunden` und `/geschaeftskunden` auf `0.9`/`monthly`. Wenn die
Seite in die Hauptnavigation aufsteigt, ist `0.8/yearly` zu niedrig angesetzt —
**Vorschlag `0.9`, `changefreq` bleibt `yearly`**, weil sich Unternehmensinhalte
tatsächlich selten ändern. Priorität ist ein Hinweis an Crawler, kein Rankingfaktor;
die Änderung ist billig und konsistent.

---

## 4 — 1.21 Positionskarten und 1.23 Banner

**1.21** ist überwiegend erfüllt: Vier Karten im Website-Stil stehen bereits
(`FeatureGrid`, `columns="four"`). Offen bleibt allein, ob eine **Ausbildungskarte**
dazukommt — laut Backlog blockiert („Ob Ausbildungsstellen aktuell besetzt werden
sollen, ist offen"). Die Kartenstruktur trägt eine fünfte Karte ohne Umbau; bei fünf
Einträgen greift die Spaltenregel aus Paket C und stellt automatisch auf drei Spalten
um. **Karte erst anlegen, wenn André zusagt** — eine ausgeschriebene Stelle, die es
nicht gibt, ist schlimmer als eine fehlende.

**1.23** ist neu: ein „Jetzt bewerben"-Banner oben auf der Seite. Der `PageHero` hat
bereits zwei CTAs („Initiativ bewerben", „Jobbereiche ansehen"). Ein zusätzliches
Banner **über** dem Hero wäre der dritte Handlungsaufruf auf demselben Bildschirm.
Vorschlag: den bestehenden primären CTA zum Banner ausbauen, statt einen dritten
danebenzustellen — **Frage an dich, bevor gebaut wird.**

---

## 5 — 1.22 Bewerbungsformular: ein blockierender Fund

Gefordert: Name, E-Mail, Telefon, Nachricht; Lebenslauf optional, Absenden auch ohne
Anhang. Technisch wäre das eine vierte Variante in `components/RequestForm.tsx` — die
Komponente kennt heute `'schaden' | 'termin' | 'business'` (`types.ts:81`).

**Aber:**

```ts
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitted(true);
};
```

**Das Formular versendet nichts.** Kein `fetch`, kein `action`, kein `mailto`. Es zeigt
eine Bestätigung und verwirft die Eingaben. Für Schadenmeldungen ist das schon
unschön — **für Bewerbungen ist es nicht vertretbar**: Jemand schickt seinen Lebenslauf
und bekommt „Danke, wir melden uns", und niemand meldet sich, weil niemand etwas
bekommen hat.

**1.22 hängt damit an 1.17** („Anfrage direkt ins E-Mail-Postfach", Paket E, offen).
Zwei Wege:

1. **1.17 vorziehen** und den Versand einmal für alle Varianten bauen. Dann ist 1.22
   eine halbe Stunde Feldarbeit.
2. **1.22 zurückstellen**, bis der Versand steht.

**Empfehlung: 1.** Der Versand fehlt allen vier Formularvarianten, nicht nur der
Bewerbung — er ist ohnehin der größere Hebel. Das ist eine Paketgrenzen-Frage und
gehört dir vorgelegt, nicht von mir entschieden.

---

## 6 — Benefits-Sektion: wo sie sitzt und wie sie leer bleibt

Die Sektion existiert: `CareerPage.tsx:42–47`, Eyebrow „Arbeitgeberversprechen", vier
Einträge in `const benefits`.

**Der Inhalt ist generisch:** „Professionelles Umfeld", „Starkes Team",
„Abwechslungsreiche Aufgaben", „Qualitätsanspruch" — Formulierungen, die auf jeden
Betrieb passen. Genau das, was 1.26 ersetzen soll (echte Benefits plus
Mitarbeiterstimmen, Zulieferung André).

**Vorgehen nach derselben Regel wie 1.18 und 1.29:**

* Die vier generischen Einträge **entfernen**, nicht umformulieren.
* Die Sektion bleibt struktureller Bestandteil der Seite, das Feld ist Pflicht und
  steht auf `null` — „Text steht noch aus", nicht „wird nicht gebraucht".
* Bei `null` wird **nichts** gerendert: kein Platzhalter, keine leere Sektion mit
  Innenabstand.
* TODO-Kommentar mit Verweis auf 1.26.

> **Konsequenz, die benannt gehört:** Die Seite verliert damit sichtbar eine Sektion,
> bis André liefert. Sie schrumpft von vier auf drei Inhaltssektionen. Das ist der Preis
> der Regel — und er ist bewusst zu zahlen, weil generischer Fülltext beim Kundenreview
> wie abgenommener Text aussieht. **Falls du das anders siehst, ist jetzt der Moment.**

---

## 7 — Commit-Aufteilung

| # | Inhalt | Warum eigener Commit |
|---|---|---|
| **1** | **1.24** Serviceberater vollständig entfernen — alle sieben Stellen, inkl. Meta, JSON-LD, beider FAQ-Antworten und der Zahl auf `/ueber-uns` | Reine Entfernung, unabhängig vom Rest, einzeln zurücknehmbar. Zuerst, damit die folgenden Commits nicht gegen veraltete Positionslisten arbeiten. |
| **2** | **1.25** „Über uns" in die Navigation (Weg A) + Sitemap-Priorität | Betrifft die globale Navigation, also jede Seite — muss allein prüfbar sein |
| **3** | **1.26-Vorbereitung**: Benefits-Sektion leeren, Pflichtfeld mit `null`, TODO | Inhaltsentfernung, sichtbar auf der Seite |
| **4** | **1.21** Ausbildungskarte *(nur wenn André zusagt)* | blockiert |
| **5** | **1.23** Bewerben-Banner *(nur nach deiner Entscheidung zur CTA-Frage)* | blockiert |
| **6** | Doku, Backlog, Optimierungsplan | |

**1.22 kommt nicht vor** — es hängt an 1.17, siehe Abschnitt 5.

Nach jedem Commit Build mit beiden Wächtern. Nach Commit 1 zusätzlich die
JSON-LD-Zahl auf `/karriere` gegenprüfen (9 → 8), nach Commit 2 die mobile Schublade
auf 390 px.

---

## 8 — Was ich von dir brauche, bevor Code entsteht

1. **1.24 / „Vier Berufsbilder"** — auf drei ändern oder Zahl herausnehmen? Hängt
   davon ab, ob der Serviceberater später zurückkommt. Frage an André.
2. **1.21** — was hat André mit „keine Drehanimationen" gemeint? Auf der heutigen Seite
   gibt es keine; die verwaiste `Jobs.tsx` hat welche.
3. **1.23** — Banner zusätzlich zu den zwei Hero-CTAs, oder den bestehenden CTA
   ausbauen?
4. **1.22 / 1.17** — Versand vorziehen oder Bewerbungsformular zurückstellen?
5. **Benefits** — vier generische Einträge wirklich entfernen, auch wenn die Seite
   dadurch kürzer wird?
