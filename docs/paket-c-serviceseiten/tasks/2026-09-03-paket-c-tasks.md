# Paket C — Serviceseiten-Layout vereinheitlichen (1.14, 1.15)

Backlog: `docs/backlog/schleife-1.md`, Paket C
Vorgabe aus dem Backlog: *„1.14 ist ein Fall für eine gemeinsame Layout-Komponente,
nicht für acht einzeln angepasste Seiten. Erst Komponente bauen, dann migrieren."*

> **Planung. Kein Code.**

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

Bei allen sieben. Der einzige strukturelle Unterschied: vier Seiten geben der ersten
`SectionIntro` eine `description` mit, drei nicht.

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

## 3 — Reihenfolge

| Commit | Inhalt | Prüfung |
|---|---|---|
| **1** | `ServiceLayout` bauen **und Dellenentfernung migrieren** | Build, `smoke`, visuell Desktop und mobil. Dellenentfernung ist die schlankste der sieben und hat keine `description` — der ehrlichste Pilot. |
| **2** | Hagelschaden + Autoglas (die zwei übrigen ohne `description`) | Build, visuell |
| **3** | Autolackierung, Smart Repair, Felgenreparatur, Fuhrparkservice (mit `description`) | Build, visuell |
| **4** | Leasingrückgabe **prüfen**, nicht migrieren — weicht bewusst ab (6 Sektionen, Preisblock) | dokumentieren, warum sie außen vor bleibt |
| **5** | 1.15: eigenständige Erklärung je Leistung | s. u. |
| **6** | Doku, Backlog, Optimierungsplan | |

**Die Komponente kommt zusammen mit der ersten Migration, nicht davor.** Eine
Komponente ohne Verwender ist eine Vermutung darüber, was gebraucht wird. Mit einem
echten Verwender im selben Commit ist sie belegt.

Nach jedem Commit Build mit beiden Wächtern; nach Commit 3 zusätzlich `npm run smoke
-- --seit HEAD` gegen das Deployment.

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

**Offene Frage an dich:** Soll die Erklärung eine eigene Sektion bekommen oder in die
`PageHero`-Description? Ich neige zur eigenen Sektion direkt unter dem Hero — die
Hero-Description ist bereits gefüllt und für Fließtext dieser Länge zu prominent
gesetzt. Als eigene Sektion wird sie außerdem ein fester Bestandteil der Komponente
statt Zufall je Seite.

---

## 5 — Was mir dabei aufgefallen ist

**Ein Motiv doppelt belegt.** `smart-repair-leipzig-carcare.webp` ist nach der Rochade
aus 1.13 das Kachelmotiv der Leasingrückgabe — und wäre nach dieser Migration
gleichzeitig der Seitenhintergrund von Smart Repair. Kein Fehler, aber sichtbar. Löst
sich mit Backlog **1.28** (eigene Motive, Zulieferung André).

**Sieben Kanonische von Hand.** Jede der sieben Seiten schreibt ihr `canonical` selbst.
Beim Durchsehen war keines falsch — aber es gibt keinen Grund, das Risiko sieben Mal
einzugehen, wenn die Route ohnehin danebensteht.
