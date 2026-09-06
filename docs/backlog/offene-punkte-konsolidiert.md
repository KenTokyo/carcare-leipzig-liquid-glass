# Offene Punkte, konsolidiert

**Stand:** 2026-09-06
**Quellen:** `docs/backlog/schleife-1.md`, `schleife-2.md`, `schleife-3.md`,
`nicht-relevant.md`, alle Optimierungspläne aus Paket A–E, die
Task-Dateien mit offenen Kästchen, sowie die während Schleife 1 entstandenen Befunde.
**Methode:** Jeder offene Punkt wurde **gegen den Code geprüft**, nicht aus der
Dokumentation übernommen — mehrere Kästchen waren veraltet (siehe Abschnitt 4).

---

## ✅ Erledigt: Nummernkollision aufgelöst

**Am 2026-09-06 hat der Kunde die vollständige Aufgabenliste geliefert**
(`docs/backlog/quelle/2026-09-06-alle-schleifen.csv`, 103 Einträge). Schleife 2 und 3
liegen seitdem im Repo: `schleife-2.md` (2.1–2.27) und `schleife-3.md` (3.1–3.37).
Beide bisher toten Verweise lösen sich wortgenau auf — **2.26** ist die
Zusatzleistungsliste, **3.17** ist „Formularbau zuletzt".

Dadurch wurde sichtbar, dass **zwölf Nummern doppelt belegt** waren: Sie waren hier im
Repo für eigene Befunde vergeben worden, existieren beim Kunden aber mit anderer
Bedeutung. Fünf davon kollidierten hart — darunter die zwei Punkte, die André als
Livegang-Blocker kennt.

**Am 2026-09-06 umbenannt.** Die Kundennummern bleiben unangetastet; die repo-lokalen
Befunde tragen jetzt das Kürzel `R<n>` („Repo-Befund"), das mit keinem Nummernraum des
Kunden kollidieren kann. 207 Nennungen in 36 Dateien.

### Zuordnung alt → neu

| neu | vorher belegt | Inhalt des Repo-Befunds | beim Kunden bedeutet die alte Nummer |
|---|---|---|---|
| **R1** | ~~1.27~~ | Meilensteine für den Zeitstrahl | *nichts — Schleife 1 endet bei 1.26* |
| **R2** | ~~1.28~~ | Eigene Bildmotive Leasingrückgabe/Außen | *nichts* · **doppelt mit 2.14/2.15** |
| **R3** | ~~1.29~~ | Erklärtexte für die sieben Leistungsseiten | *nichts* |
| **R4** | ~~3.32~~ | Ausbildung bestätigen + Eckdaten | Ausbildungsstellen klären — **dasselbe Thema**, zufällig |
| **R5** | ~~3.33~~ | 🔴 **Impressumsangaben vervollständigen** | Bilder-Upload im Formular: finales Go |
| **R6** | ~~3.34~~ | 🔴 **Datenschutzerklärung schreiben** | reparatur.info / PDR Cloud: wird das genutzt? |
| **R7** | ~~3.35~~ | Echtes Vorschaubild statt Stockfoto | Preisdarstellung Zusatzleistungen |
| **R8** | ~~3.36~~ | Reparaturseiten führten ins falsche Formular | Slogan-Wortlaut festlegen |
| **R9** | ~~3.37~~ | Anhänge mitsenden | „Bildtechnisch noch was ändern" |
| **R10** | ~~3.38~~ | 🔴 **Zugangsdaten für den Formularversand** | *nichts — Schleife 3 endet bei 3.37* |
| **R11** | ~~3.39~~ | Felder der übrigen Formularvarianten datengetrieben | *nichts* |
| **R12** | ~~3.40~~ | Feldliste der Schadenmeldung durchgehen | *nichts* |

### Für die Kundenkommunikation

**Die drei Livegang-Blocker waren André unter 3.33, 3.34 und 3.38 genannt worden** —
Nummern, unter denen er in seiner Liste etwas anderes findet. Sie heißen jetzt
**R5**, **R6** und **R10**. Beim nächsten Kontakt die Punkte **im Klartext** benennen
(Impressum, Datenschutz, Zugangsdaten) statt über eine Nummer; bei drei Punkten ist das
kürzer als jede Nummernerklärung.

### Regel ab jetzt

Eigene Befunde bekommen **immer** ein `R`-Kürzel, nie eine freie `x.y`-Nummer. Steht
auch in `CLAUDE.md`. Ein Wächter prüft das bei jedem Build:
`scripts/check-nummernraeume.mjs`.

### Zwei R-Befunde doppeln Kundenpunkte

* **R2** deckt sich inhaltlich mit **2.14** („Leasingrückgabe braucht ein eigenes Bild")
  und **2.15/3.29** (Innenaufbereitung: kein Transporter). Bei der Fotoanforderung als
  **ein** Punkt behandeln, sonst wird dieselbe Lieferung zweimal angefragt.
* **R4** und der echte **3.32** meinen beide die Ausbildungsfrage. R4 ist die
  Zulieferliste dazu (Beginn, Dauer, Voraussetzungen), 3.32 die Grundsatzfrage.

### Ein Punkt widerspricht einer bereits getroffenen Entscheidung

**2.23** verlangt „Unfallinstandsetzung → Weiterleitung zu PDR Cloud / reparatur.info,
kein eigenes Formular". Gebaut wurde am 2026-09-05 das Gegenteil: ein vollwertiges
Schadenformular im Haus. **Am 2026-09-06 von Oalab als bewusste Entscheidung
bestätigt** — bleibt vorerst so, wird im Nachgang angepasst. Hängt zusätzlich an der
offenen Kundenfrage **3.34** (wird reparatur.info überhaupt genutzt?).

---

## 1. 🔴 Blockiert den Livegang (3)

> **Wichtig für die Einordnung:** Was hier deployt wird, geht **nur in die
> Preview-Umgebung** (`carcare-center.vercel.app`), in der die Zwischenstände mit dem
> Kunden besprochen werden. Unter `www.carcare-center.de` läuft weiterhin der alte
> Auftritt. Diese drei Punkte blockieren den **späteren echten Livegang** — sie halten
> weder ein Deployment noch die Weiterarbeit auf. Fehlende Rechtstexte werden markiert
> und als „zu hinterlegen" ausgewiesen, nicht abgewartet.


| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **R5** | Recht | **Impressumsangaben vervollständigen.** Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer, gesetzliche Berufsbezeichnung samt Verleihungsstaat, Erklärung zur Verbraucherstreitbeilegung | André | § 5 DDG; Kammer-Angaben fehlen **auch auf der Altseite** | offen |
| **R6** | Recht | **Datenschutzerklärung schreiben.** `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit | André + Datenschutz&shy;beauftragter | muss **zwei** Auftragsverarbeiter nennen: Vercel und Resend, beide USA | offen |
| **R10** | Technik / Recht | **Zugangsdaten für den Formularversand** in Vercel hinterlegen (3 Variablen, Vorlage `.env.example`) | André | **hängt an R6** — vorher verarbeitet die Seite Daten über einen Dienstleister, der nirgends steht | offen |

---

## 2. 🟠 Wartet auf Zulieferung von André (9)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **R12** | Formulare | **Feldliste der Schadenmeldung durchgehen.** 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streichen liegt bereit, mit vier Rückfragen | André | — | offen |
| **R3** | Inhalt | **Erklärtexte für sieben Leistungsseiten**, je 2–3 Absätze „Was ist X?" | André | blockiert **1.15** — die Sektion steht auf sieben Seiten und ist leer | offen |
| **R1** | Inhalt | **Meilensteine für den Zeitstrahl:** Jahr + ein Satz je Station | André | drei Platzhalter stehen sichtbar auf `/ueber-uns` | offen |
| **1.18** = **2.26** | Inhalt | **Liste der Zusatzleistungen** fürs Aufbereitungsformular. Dabei klären: Was ist Paket, was Zusatz | André | zwei Platzhalter im Formular | Struktur steht |
| **R4** | Inhalt | **Ausbildung bestätigen** (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen, Übernahmechancen | André | — | offen |
| **1.26** | Inhalt | **Benefits + Mitarbeiterstimmen** für die Karriereseite | André | bündeln mit R4 | offen |
| **R7** | Bild | **Echtes Vorschaubild statt Unsplash-Stockfoto** (`og:image`, JSON-LD). *Deckungsgleich mit dem offenen OG-Bild-Punkt im Preloader-Plan* | André | — | offen |
| **R2** | Bild | **Eigene Motive** für Leasingrückgabe und Außenaufbereitung | André | beide teilen sich ein Bild mit anderen Kacheln | offen |
| *(ohne Nr.)* | Bild / Recht | **Partnerlogos:** schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schutzraum | André | ohne Freigabe dürfen die Logos nicht stehen | offen |

**Bündelvorschlag:** Karriere (1.26 + R4) · Leistungstexte (R3) · Bilder (R7 + R2 + Partnerlogos) · Formularfelder (R12 + 1.18).

---

## 3. 🟢 Ohne Zulieferung umsetzbar (10)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **R9** | Formulare | **Anhänge mitsenden.** Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | OALAB | **R10** — erst wenn der Versand läuft, ist absehbar, welcher Weg sich lohnt | offen |
| **R11** | Technik | **Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen.** Beim Schadenformular ist Streichen seit R8 ein Dateneintrag, bei den anderen dreien nicht | OALAB | — | offen |
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
| Preloader-Plan, 4 Kästchen | OG-Bild festlegen, bauen, einbinden, validieren | **Inhaltlich identisch mit R7.** In dieser Übersicht einmal geführt |
| Parallax-Kit, 11 Kästchen | Optimierungen am exportierten Scroll-Kit | **Nicht Teil der Kundenseite.** `parallax-scroll-kit/` ist untracked und läuft gespiegelt in einem anderen Projekt |

**Empfehlung:** Die erledigten Kästchen in Paket A und C abhaken, T1–T3 als überholt
markieren, den Preloader-OG-Punkt auf R7 verweisen. Sonst liest die nächste Sitzung
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
