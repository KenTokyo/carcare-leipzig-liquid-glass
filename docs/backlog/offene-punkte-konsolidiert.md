# Offene Punkte, konsolidiert

**Stand:** 2026-09-05
**Quellen:** `docs/backlog/schleife-1.md`, alle Optimierungspläne aus Paket A–E, die
Task-Dateien mit offenen Kästchen, sowie die während Schleife 1 entstandenen Befunde.
**Methode:** Jeder offene Punkt wurde **gegen den Code geprüft**, nicht aus der
Dokumentation übernommen — mehrere Kästchen waren veraltet (siehe Abschnitt 4).

---

## ⚠️ Zuerst: Die Nummerierung ist auseinandergelaufen

**Im Repository liegt nur `schleife-1.md`.** Es gibt weder `schleife-2.md` noch
`schleife-3.md`. Die Nummern 2.x und 3.x existieren hier ausschließlich als **Verweise**
aus Schleife 1 heraus:

| Verweis | Wortlaut im Repo | Zieldokument |
|---|---|---|
| **2.26** | „1.18 hängt zudem an der Zulieferung der Zusatzleistungsliste durch André (2.26)." | **fehlt im Repo** |
| **3.17** | „André hat im Review festgelegt, dass der Formularbau zuletzt erfolgt (Punkt 3.17)." | **fehlt im Repo** |

Beide stehen seit der **ersten Fassung** des Backlogs im Repo (Commit `5a88d4f`) — sie
stammen also aus Loop und wurden beim Abschreiben mitgenommen, ohne dass die zugehörigen
Dokumente je hierher kamen.

### Der eigentliche Konflikt

**Die Nummern 3.32 bis 3.40 habe ich selbst vergeben** — erstmals in Commit `cbd28d6`
während Paket D. Ich hatte keinen Blick auf Loop und wusste nicht, was dort im 3.x-Raum
bereits steht. Belegt ist nur, dass er **nicht leer** ist: 3.17 existiert dort.

**Damit sind 3.32–3.40 keine Loop-Nummern, sondern repo-lokale Nummern im selben
Namensraum.** Wenn Loop ein eigenes 3.32 führt, meinen beide Seiten dasselbe Kürzel für
verschiedene Dinge — und zwar unbemerkt, weil niemand beide Listen nebeneinander hat.

### Zwei Wege heraus

1. **Bevorzugt:** Schleife 2 und 3 aus Loop ins Repo übernehmen. Dann ist der Namensraum
   sichtbar, Doppelungen fallen sofort auf, und die Verweise auf 2.26 und 3.17 gehen
   nicht mehr ins Leere.
2. **Falls das nicht geht:** Meine Befunde auf ein eigenes Kürzel umbenennen, das mit
   Loop nicht kollidieren kann — etwa `R1`–`R9` für „Repo-Befund". Kostet eine Sitzung,
   betrifft rund 40 Fundstellen in den Dokumenten.

Bis dahin gilt in dieser Übersicht: **1.x stammt aus Loop, 3.32–3.40 von uns.**

---

## 1. 🔴 Blockiert den Livegang (3)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **3.33** | Recht | **Impressumsangaben vervollständigen.** Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer, gesetzliche Berufsbezeichnung samt Verleihungsstaat, Erklärung zur Verbraucherstreitbeilegung | André | § 5 DDG; Kammer-Angaben fehlen **auch auf der Altseite** | offen |
| **3.34** | Recht | **Datenschutzerklärung schreiben.** `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit | André + Datenschutz&shy;beauftragter | muss **zwei** Auftragsverarbeiter nennen: Vercel und Resend, beide USA | offen |
| **3.38** | Technik / Recht | **Zugangsdaten für den Formularversand** in Vercel hinterlegen (3 Variablen, Vorlage `.env.example`) | André | **hängt an 3.34** — vorher verarbeitet die Seite Daten über einen Dienstleister, der nirgends steht | offen |

---

## 2. 🟠 Wartet auf Zulieferung von André (9)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **3.40** | Formulare | **Feldliste der Schadenmeldung durchgehen.** 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streichen liegt bereit, mit vier Rückfragen | André | — | offen |
| **1.29** | Inhalt | **Erklärtexte für sieben Leistungsseiten**, je 2–3 Absätze „Was ist X?" | André | blockiert **1.15** — die Sektion steht auf sieben Seiten und ist leer | offen |
| **1.27** | Inhalt | **Meilensteine für den Zeitstrahl:** Jahr + ein Satz je Station | André | drei Platzhalter stehen sichtbar auf `/ueber-uns` | offen |
| **1.18** = **2.26** | Inhalt | **Liste der Zusatzleistungen** fürs Aufbereitungsformular. Dabei klären: Was ist Paket, was Zusatz | André | zwei Platzhalter im Formular | Struktur steht |
| **3.32** | Inhalt | **Ausbildung bestätigen** (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen, Übernahmechancen | André | — | offen |
| **1.26** | Inhalt | **Benefits + Mitarbeiterstimmen** für die Karriereseite | André | bündeln mit 3.32 | offen |
| **3.35** | Bild | **Echtes Vorschaubild statt Unsplash-Stockfoto** (`og:image`, JSON-LD). *Deckungsgleich mit dem offenen OG-Bild-Punkt im Preloader-Plan* | André | — | offen |
| **1.28** | Bild | **Eigene Motive** für Leasingrückgabe und Außenaufbereitung | André | beide teilen sich ein Bild mit anderen Kacheln | offen |
| *(ohne Nr.)* | Bild / Recht | **Partnerlogos:** schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schutzraum | André | ohne Freigabe dürfen die Logos nicht stehen | offen |

**Bündelvorschlag:** Karriere (1.26 + 3.32) · Leistungstexte (1.29) · Bilder (3.35 + 1.28 + Partnerlogos) · Formularfelder (3.40 + 1.18).

---

## 3. 🟢 Ohne Zulieferung umsetzbar (10)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **3.37** | Formulare | **Anhänge mitsenden.** Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | OALAB | **3.38** — erst wenn der Versand läuft, ist absehbar, welcher Weg sich lohnt | offen |
| **3.39** | Technik | **Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen.** Beim Schadenformular ist Streichen seit 3.36 ein Dateneintrag, bei den anderen dreien nicht | OALAB | — | offen |
| *(ohne Nr.)* | SEO | **19 von 27 Meta-Descriptions außerhalb 140–160 Zeichen** (12 zu lang, 7 zu kurz). Gemessen am ausgelieferten HTML | OALAB | — | offen |
| *(ohne Nr.)* | SEO | **Titles im selben Durchgang** gegen 50–60 Zeichen prüfen | OALAB | — | offen |
| *(ohne Nr.)* | Technik | **Fünf verwaiste Komponenten** — `About`, `AccidentFocus`, `Hero`, `Jobs`, `TargetGroups`, alle **0 Importe** | OALAB | `Hero.tsx` bleibt unangetastet (Vorgabe); `About.tsx` enthält echten Kundentext | offen |
| *(ohne Nr.)* | Technik | **`npm run shots` und `npm run kontrast`** ins Repository. Der Kontrastmesser hat gefunden, was drei Sichtprüfungen nicht fanden. Bestätigt: beide fehlen in `package.json` | OALAB | — | offen |
| **T4** | Verlinkung | **Zweiter Knopf auf den Aufbereitungskarten → Wissensbereich** | OALAB | — | offen |
| *(ohne Nr.)* | Paket B | **`ITEMS` gegen `serviceCatalog` prüfen**, ableiten oder bewusst trennen; Wächter erwägen | OALAB | — | offen |
| *(ohne Nr.)* | Design | **Footer-Icons stehen bei Kontrast 1,00:1** auf dunklem Grund | André *(Gestaltungsfrage)* | — | offen |
| *(ohne Nr.)* | Scrollytelling | **Visueller Nachweis des gepinnten Zustands** wurde nie erbracht | OALAB | — | offen |

---

## 4. Was beim Prüfen als erledigt oder überholt herauskam

Diese Punkte stehen in den Dokumenten noch als offen, sind es aber nicht. **Sie sind
nicht in den Tabellen oben enthalten.**

| Wo | Punkt | Befund |
|---|---|---|
| Paket C, 3 Kästchen | `text-blue-700` → `text-blue-600`, `text-gray-400/500` | **Erledigt** in Commit `e77b3b0`. Gemessen: `text-blue-700` kommt **0×** im Code vor. Die Kästchen wurden nie abgehakt |
| Paket A, 3 Kästchen | FAQ-Einträge in eine Datenquelle heben; weitere Blöcke prüfen; Schema gegen sichtbaren Text vergleichen | **Erledigt.** `data/faqs.ts` führt 19 Routen, `check-faq.mjs` und `check-faq-html.mjs` prüfen genau das |
| Verlinkung, T1–T3 | Hero-CTAs, „Schaden jetzt melden", „Partnerschaft anfragen" sollen überarbeitet werden | **Überholt durch 1.20.** Alle drei Sprungziele öffnen jetzt den Anfrage-Dialog statt zu navigieren |
| Preloader-Plan, 4 Kästchen | OG-Bild festlegen, bauen, einbinden, validieren | **Inhaltlich identisch mit 3.35.** In dieser Übersicht einmal geführt |
| Parallax-Kit, 11 Kästchen | Optimierungen am exportierten Scroll-Kit | **Nicht Teil der Kundenseite.** `parallax-scroll-kit/` ist untracked und läuft gespiegelt in einem anderen Projekt |

**Empfehlung:** Die erledigten Kästchen in Paket A und C abhaken, T1–T3 als überholt
markieren, den Preloader-OG-Punkt auf 3.35 verweisen. Sonst liest die nächste Sitzung
sie erneut als offen — genau das ist mir heute passiert.

---

## Zusammenfassung

| | Anzahl |
|---|---|
| Blockiert den Livegang | **3** |
| Wartet auf André | **9** |
| Ohne Zulieferung umsetzbar | **10** |
| **Summe echt offen** | **22** |
| In den Dokumenten offen, tatsächlich erledigt oder überholt | 10 Kästchen |
| Außerhalb des Projekts (Parallax-Kit) | 11 Kästchen |
