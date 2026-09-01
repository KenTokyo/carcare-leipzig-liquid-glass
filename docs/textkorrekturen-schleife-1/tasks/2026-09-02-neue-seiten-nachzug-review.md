# Nachzug: die beiden neuen Seiten aus `0b666d1` (Review, noch nicht geändert)

Branch: `paket-a/textkorrekturen` (rebasiert auf `main` @ `831709d`)
Anlass: `main` war beim Anlegen der Branches 5 Commits alt. `0b666d1` hat
`pages/LeasingrueckgabePage.tsx` (265 Zeilen) und `pages/UeberUnsPage.tsx`
(219 Zeilen) neu hinzugefügt — beide kennen die Korrekturen aus Paket A nicht.

> **Status: umgesetzt am 2026-09-02** nach Freigabe. 46 Ersetzungen in 3 Dateien,
> plus zwei Nachträge, die erst die Gesamt-Gegenprobe zutage gefördert hat
> (`foundingDate` im JSON-LD, drei Alt-Texte in `data/detailing.ts`).

---

## Gegenprobe 1 — Volltextsuche gegen die beiden neuen Seiten

| Suche | Treffer |
|---|---|
| `1993` | **6** |
| `1996` | 0 |
| `2010` | 0 |
| „über 30 Jahre" (Betriebsalter) | **2** |
| „25 Jahre" | 0 |
| `3000` ohne Punkt | 0 |
| `3.000 qm` | **9** |
| Kcare / KCare / K-Care / Kare / KKR | 0 |
| „CarCare" ohne „Center" (ohne juristische Firmierung) | **31** |
| Dritte Person über den eigenen Betrieb | **13** |

Zusätzlich **2 × „30 Jahre Garantie"** (WINTEC, `LeasingrueckgabePage:61`,
`UeberUnsPage:37`) — das ist die Garantiedauer, **bleibt unangetastet**.

---

## 1.1 — Jahreszahl (6 Stellen, alle in `UeberUnsPage.tsx`)

| Zeile | aktuell | Zielsatz |
|---|---|---|
| 28 | title `Seit 1993 am Markt` · desc `Über 30 Jahre Erfahrung im Kfz-Lackier- und Karosseriehandwerk — gewachsen mit …` | title `Seit 1998 am Markt` · desc `Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998 — gewachsen mit …` |
| 63 | `Ein Betrieb, der seit 1993 besteht und über 50 Menschen beschäftigt, bietet ein anderes Maß an Planbarkeit als ein junger Kleinbetrieb.` | `Wir bestehen seit 1998 und beschäftigen über 50 Menschen — das bietet ein anderes Maß an Planbarkeit als ein junger Kleinbetrieb.` ⚠️ zugleich dritte Person |
| 67 | title `1993 — Gründung` | title `1998 — Gründung` |
| 77 | `… Der Betrieb besteht seit 1993, ist Meisterbetrieb … und beschäftigt über 50 Mitarbeiter auf rund 3.000 qm …` | `… Wir bestehen seit 1998, sind Meisterbetrieb des Kfz-Lackierhandwerks und beschäftigen über 50 Mitarbeiter auf über 3.000 m² Betriebsfläche.` ⚠️ dritte Person + Fläche |
| 119 | Meta: `… Meisterbetrieb seit 1993, … auf 3.000 qm …` | `… Meisterbetrieb seit 1998, … auf über 3.000 m² …` (158 Zeichen, im Zielkorridor) |
| 170 | `Über 30 Jahre Entwicklung — jeder Schritt kam dazu, weil Kunden ihn gebraucht haben.` | `Entwicklung seit 1998 — jeder Schritt kam dazu, weil Kunden ihn gebraucht haben.` |

**Hinweis zur Zeitleiste:** `UeberUnsPage` führt eine Historie („1993 — Gründung",
„Heute — …"). Wenn zwischen 1993 und 1998 weitere Stationen ergänzt werden
sollen, ist das eine inhaltliche Frage an André, keine Korrektur.

---

## 1.2 — Fläche (9 Stellen)

Alle `3.000 qm` → `über 3.000 m²`. Wo `rund 3.000 qm` steht, entfällt „rund",
weil die verbindliche Formulierung „über" lautet.

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| Leasingrueckgabe:87 | `… liegen auf 3.000 qm im eigenen Haus.` | `… liegen auf über 3.000 m² im eigenen Haus.` |
| Leasingrueckgabe:98 | `Auf 3.000 qm mit über 50 Mitarbeitern …` | `Auf über 3.000 m² mit über 50 Mitarbeitern …` |
| Leasingrueckgabe:151 | `Ja. Auf 3.000 qm mit über 50 Mitarbeitern …` | `Ja. Auf über 3.000 m² mit über 50 Mitarbeitern …` |
| UeberUns:29 | title `3.000 qm Betriebsfläche` | title `Über 3.000 m² Betriebsfläche` |
| UeberUns:70 | title `Heute — 3.000 qm in Leipzig` | title `Heute — über 3.000 m² in Leipzig` |
| UeberUns:77 | `… auf rund 3.000 qm Betriebsfläche.` | `… auf über 3.000 m² Betriebsfläche.` |
| UeberUns:82 | `… mit rund 3.000 qm Betriebsfläche …` | `… mit über 3.000 m² Betriebsfläche …` |
| UeberUns:119 | Meta: `… auf 3.000 qm …` | `… auf über 3.000 m² …` |
| UeberUns:124 | PageHero: `Auf 3.000 qm bearbeiten …` | `Auf über 3.000 m² bearbeiten …` |

Dazu **`seo/pageSchemas.ts:130`** (`aboutPageSchema`): `… seit 1993 … auf 3.000 qm …`
→ `… seit 1998 … auf über 3.000 m² …`. Die dritte Person bleibt dort stehen —
strukturierte Daten sind Maschinen-Metadaten über die Entität, dieselbe Ausnahme
wie `seo/structuredData.ts:61`.

---

## 1.3 + 1.4 — Name und erste Person (31 Fundstellen)

Dieselbe Trennlinie wie in Paket A: **der Name darf stehen, aber nie als Subjekt
eines Verbs in der dritten Person.**

### Fall A — nominal, nur „Center" ergänzen (9)

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| Leasingrueckgabe:150 | `Bereitet CarCare auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?` | `Bereitet das CarCare Center auch mehrere Fuhrparkfahrzeuge gleichzeitig vor?` (FAQ-Frage, Variante 1a wie in Paket A) |
| UeberUns:86 | `Ist CarCare an eine Fahrzeugmarke gebunden?` | `Ist das CarCare Center an eine Fahrzeugmarke gebunden?` |
| UeberUns:91 | `Welche Qualifikationen und Partnerschaften hat CarCare?` | `… hat das CarCare Center?` |
| UeberUns:96 | `Welches Gebiet betreut CarCare?` | `Welches Gebiet betreut das CarCare Center?` |
| UeberUns:101 | `Sucht CarCare neue Mitarbeiter?` | `Sucht das CarCare Center neue Mitarbeiter?` |
| UeberUns:136 | `Was CarCare zu einem der größten Betriebe der Region macht.` | `Was uns zu einem der größten Betriebe der Region macht.` |
| UeberUns:190 | eyebrow `Arbeiten bei CarCare` | `Arbeiten im CarCare Center` |
| Leasingrueckgabe:170 | Title (s. u.) | s. u. |
| UeberUns:118 | Title (s. u.) | s. u. |

### Fall B — Umformulierung in die erste Person (13)

| Datei:Zeile | aktuell | Zielsatz |
|---|---|---|
| Leasingrueckgabe:110 | `CarCare arbeitet für Autohäuser, Firmenfuhrparks und Werksniederlassungen deutscher Premiumhersteller — wiederkehrende Abläufe sind eingespielt.` | `Wir arbeiten für Autohäuser, Firmenfuhrparks und Werksniederlassungen deutscher Premiumhersteller — wiederkehrende Abläufe sind eingespielt.` |
| Leasingrueckgabe:161 | `Ja. CarCare ist ein markenunabhängiger Meisterbetrieb … und bearbeitet alle Fabrikate — …` | `Ja. Wir sind ein markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug.` |
| Leasingrueckgabe:176 | Meta: `… CarCare Leipzig begutachtet, setzt instand und bereitet auf – …` | `… Wir begutachten, setzen instand und bereiten auf – für Privatkunden und Fuhrparks.` |
| Leasingrueckgabe:211 | `… CarCare bearbeitet Rückläufer gebündelt und nachvollziehbar kalkuliert.` | `… Wir bearbeiten Rückläufer gebündelt und kalkulieren nachvollziehbar.` |
| UeberUns:53 | `CarCare betreut Werksniederlassungen deutscher Premiumhersteller sowie Autohäuser — …` | `Wir betreuen Werksniederlassungen deutscher Premiumhersteller sowie Autohäuser — mit planbaren Abläufen für Präsentation, Übergabe und Fahrzeugbestand.` |
| UeberUns:63 | s. 1.1 | s. 1.1 |
| UeberUns:77 | s. 1.1 | s. 1.1 |
| UeberUns:82 | `CarCare gehört mit rund 3.000 qm … zu den größten Karosserie- und Lackierbetrieben …` | `Wir gehören mit über 3.000 m² Betriebsfläche und über 50 Mitarbeitern zu den größten Karosserie- und Lackierbetrieben in Leipzig und Umgebung. Die Größe erlaubt es uns, mehrere Fahrzeuge parallel zu bearbeiten und … vollständig im eigenen Haus abzudecken.` |
| UeberUns:87 | `Nein. CarCare ist markenunabhängig und bearbeitet alle Fabrikate — …` | `Nein. Wir sind markenunabhängig und bearbeiten alle Fabrikate — vom Kleinwagen bis zum Premiumfahrzeug. Zu unseren Kunden zählen unter anderem Werksniederlassungen deutscher Premiumhersteller.` |
| UeberUns:92 | `CarCare ist Meisterbetrieb …, Glasurit-Lackpartner, WINTEC-Partner … und arbeitet mit einem TÜV-zertifizierten Felgenreparaturverfahren.` | `Wir sind Meisterbetrieb des Kfz-Lackierhandwerks, Glasurit-Lackpartner, WINTEC-Partner für Autoglas nach ISO 9001 mit TÜV-Zertifizierung und arbeiten mit einem TÜV-zertifizierten Felgenreparaturverfahren.` |
| UeberUns:102 | `CarCare beschäftigt Kfz-Aufbereiter, …` | `Wir beschäftigen Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater.` |
| UeberUns:107 | `Ja. CarCare arbeitet mit Autohäusern, Fuhrparks, …` | `Ja. Wir arbeiten mit Autohäusern, Fuhrparks, Versicherungen und Versicherungsagenturen zusammen.` |
| UeberUns:124 | `Die BS CarCare GmbH ist seit 1993 Meisterbetrieb … Auf 3.000 qm bearbeiten über 50 Mitarbeiter …` | `Seit 1998 sind wir Meisterbetrieb des Kfz-Lackierhandwerks. Auf über 3.000 m² bearbeiten über 50 Mitarbeiter Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung — für Privatkunden, Autohäuser, Fuhrparks, Versicherungen und Werksniederlassungen deutscher Premiumhersteller.` |
| UeberUns:148 | `Als Full-Service-Dienstleister deckt CarCare die gesamte Kette ab. Für den Kunden heißt das: …` | `Als Full-Service-Dienstleister decken wir die gesamte Kette ab. Für Sie heißt das: ein Ansprechpartner, ein Termin, keine Übergaben zwischen Fremdbetrieben.` ⚠️ „Für den Kunden" → „Für Sie" |

### Titles — beide reißen mit „Center" die 60 Zeichen

| Datei | aktuell (Z.) | naiv (Z.) | Vorschlag (Z.) |
|---|---|---|---|
| Leasingrueckgabe:170 | Leasingrückgabe Leipzig \| Fahrzeug vorbereiten \| CarCare (56) | 63 | **Leasingrückgabe Leipzig \| vorbereiten \| CarCare Center** (54) |
| UeberUns:118 | Über uns \| Karosserie- & Lackierbetrieb Leipzig \| CarCare (57) | 64 | **Über uns \| Karosserie & Lack Leipzig \| CarCare Center** (53) |

### Unangetastet

`BS CarCare GmbH` als juristische Firmierung bleibt überall stehen —
`UeberUns:77` (Betreiberangabe), `UeberUns:119` (Meta), `pageSchemas:130`.

---

## Gegenprobe 2 — FAQ-Haltung der neuen Seiten

Beide Seiten bringen **eigene lokale Arrays** mit und spiegeln sie ins Schema —
genau das Muster, das der Single-Source-Umbau beseitigt hat:

| Seite | lokal | Schema | Einträge |
|---|---|---|---|
| `LeasingrueckgabePage.tsx:122` | `const faqs` | `pageSchemas.ts:32 leasingFaq` | 8 |
| `UeberUnsPage.tsx:73` | `const faqs` | `pageSchemas.ts:44 ueberUnsFaq` | 7 |

**Der `prebuild`-Wächter greift bereits** — genau wie vorhergesagt:

```
[check-faq] BUILD ABGEBROCHEN — FAQ-Markup und sichtbarer Inhalt passen nicht zusammen:
  - seo/pageSchemas.ts: faqSchema(leasingFaq) speist sich weder aus faqsByRoute noch aus article.faqs.
  - seo/pageSchemas.ts: faqSchema(ueberUnsFaq) speist sich weder aus faqsByRoute noch aus article.faqs.
```

**Vorabvergleich:** Seiten- und Schema-Arrays sind bei beiden **zeichengleich**
(0 Abweichungen) — das Zusammenführen ist mechanisch sicher, wie beim ersten Mal.

**Umstellung:** 15 Einträge nach `data/faqs.ts` unter `/leasingrueckgabe-leipzig`
und `/ueber-uns`, Seiten auf `<PageFAQ route="…" />`, Schema auf
`faqSchema(faqsByRoute['…'])`. `data/faqs.ts` wächst damit von 15 auf 17 Routen
und von 71 auf 86 Einträge.

---

## Reihenfolge der Umsetzung

1. Textkorrekturen 1.1–1.4 auf `paket-a/textkorrekturen` (dieser Plan), eigener Commit
2. Rebase von `faq-single-source` und `faq-akkordeon-dom` auf den neuen Stand
3. FAQ-Umstellung der beiden Seiten auf `faq-single-source`, eigener Commit
4. Beide Wächter, dann kompletter Build
