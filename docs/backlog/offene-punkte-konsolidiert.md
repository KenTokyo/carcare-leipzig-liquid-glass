# Offene Punkte, konsolidiert

**Stand:** 2026-09-06, gegen den Code nachgezogen am **2026-09-07**; **2026-09-14** (2.1, 2.3, 4.2, 4.18 erledigt — `docs/schleife-2-4-karten-ablauf-flaeche/`); **2026-09-16** (Kundenentscheidungen: R13 erledigt, R12 ruht, R9 für Schäden gelöst, Partnerlogos teilweise — `docs/preise-partner-schadenlink/`); **2026-09-17** (R14 erledigt — `docs/zielgruppen-partner-sichtbarkeit/`); Abschnitt 1 und 3 am
**2026-09-10** (Netcup-Versand, Videos — `docs/backlog/tasks/2026-09-10-abgleich-offene-aufgaben-tasks.md`);
Abschnitt 1 und 2 am **2026-09-10** mit den Antworten aus **Schleife 4** (`schleife-4.md`, 4.1–4.21)

> **Neu: Schleife 4** (Feedbackliste von André, 2026-09-10) — 21 Punkte mit **originaler** Nummerierung in
> `docs/backlog/schleife-4.md`. Sie werden dort geführt, nicht hier. Diese Übersicht übernimmt nur, was
> Schleife 4 an Punkten dieser Datei **beantwortet**: R1 (fast vollständig), R4, R5, 1.18/2.26 (teilweise),
> dazu der neue Repo-Befund **R13**.
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
| **R5** | Recht | **Impressumsangaben vervollständigen.** Vier Angaben fehlen: Telefonnummer (Altseite nennt zwei), Handwerkskammer, gesetzliche Berufsbezeichnung samt Verleihungsstaat, Erklärung zur Verbraucherstreitbeilegung | André | § 5 DDG; Kammer-Angaben fehlen **auch auf der Altseite** | offen · **Berufsbezeichnung geliefert** (4.11: „Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk"), Rest fehlt; siehe R13 · **Zeitpunkt: zum Schluss** (Entscheidung User 2026-09-16) |
| **R6** | Recht | **Datenschutzerklärung schreiben.** `/datenschutz` ist ein Gerüst. Faktenblatt liegt bereit, mit technischem Nachtrag vom 2026-09-08 | André + Datenschutz&shy;beauftragter | muss den **laufenden** Datenfluss nennen: Vercel (USA) und Netcup-SMTP über ein Postfach auf `oalab.de` mit Weiterleitung an `carcare-center.de` — ~~Resend~~ ist seit 2026-09-08 nicht mehr im Spiel. **Dringlicher geworden:** Der Versand ist scharf, die Erklärung fehlt | offen · **Zeitpunkt: zum Schluss** (User 2026-09-16) · **neues Pflichtthema:** Schadenmeldung über reparatur.info — Verarbeitung im Auftrag, Faktenblatt Abschnitt 3a. Reine Partnerlinks brauchen **keinen** Abschnitt (geprüft 2026-09-16) |
| **R10** | Technik / Recht | **Zugangsdaten für den Formularversand** in Vercel hinterlegen | ~~André~~ OALAB | ~~hängt an R6~~ — **Reihenfolge gekippt:** Freischaltung erfolgte vor R6 | ✅ **hinterlegt 2026-09-08** (Netcup-SMTP statt Resend, 7 Secrets, nur Production; am 2026-09-10 geprüft: `/api/anfrage` → `bereit: true`). **Offen:** Live-Test aller vier Formulararten + Empfangsnachweis der Weiterleitungen (`docs/netcup-email/tasks/2026-09-08-netcup-email-tasks.md`, Phase 3) |

---

## 2. 🟠 Wartet auf Zulieferung von André (10)

> **Fotos (2026-09-10):** Eine Fotolieferung ist bei Oalab eingegangen und wird gesichtet. Für R2 und R7
> (und die Fotopunkte der Schleifen) wartet es damit auf die **Zuordnung nach der Sichtung**, nicht mehr
> zwingend auf André — was die Lieferung abdeckt, steht erst danach fest.

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **R12** | Formulare | **Feldliste der Schadenmeldung durchgehen.** 12 sichtbare Felder + 4 bei Versicherungsfällen. Vorlage zum Streichen liegt bereit, mit vier Rückfragen | André | — | ⏸️ **ruht** — das eigene Schadenformular ist seit 2026-09-16 abgeschaltet („Schaden melden" → reparatur.info, 2.23). Nur relevant, falls zurückgeschaltet |
| **R3** | Inhalt | **Erklärtexte für sieben Leistungsseiten**, je 2–3 Absätze „Was ist X?" | André | blockiert **1.15** — die Sektion steht auf sieben Seiten und ist leer | offen |
| **R1** | Inhalt | **Meilensteine für den Zeitstrahl:** Jahr + ein Satz je Station | André | ~~drei Platzhalter~~ noch **einer** auf `/ueber-uns` | ✅ **geliefert 2026-09-10** (4.16–4.20). Eingebaut: 1998, 2000, 2026 am 2026-09-11; **2013 am 2026-09-14**, entsperrt durch die Flächenentscheidung 4.2. **5 von 6 Stationen stehen.** Offen nur noch das **Jahr für Meilenstein 3** (4.19) |
| **1.18** = **2.26** | Inhalt | **Liste der Zusatzleistungen** fürs Aufbereitungsformular. Dabei klären: Was ist Paket, was Zusatz | André | zwei Platzhalter im Formular | Struktur steht · **Paket-Frage beantwortet** (4.21: Formularauswahl = Pakete), die Liste selbst fehlt |
| **R4** | Inhalt | **Ausbildung bestätigen** (wird im kommenden Jahrgang ausgebildet?) plus je Beruf Beginn, Dauer, Voraussetzungen, Übernahmechancen | André | — | offen · **Richtung „ja"** (4.19: „Ausbildungsbetrieb im Lackier- und Karosseriebauhandwerk"); offen: kommender Jahrgang, Industriekaufmann/-frau, Eckdaten |
| **R13** | Inhalt / Recht | **Seit wann ist der Betrieb Meisterbetrieb?** Die Seite sagt an 12 Stellen (seit 4.11 am 2026-09-11 noch 11) „Meisterbetrieb seit 1998"; laut Chronik aus Schleife 4 begann der Betrieb 1998 als Aufbereitungsbetrieb (4.16), Lackierung und Karosserie kamen 2013 (4.18). Stimmt „seit 1998" für die Meisterqualifikation nicht, ist die Aussage irreführend. Nichts entfernt | André | — | ✅ **erledigt 2026-09-16** — Entscheidung User: 4.18 beschreibt einen Meilenstein, nicht den Beginn des Meisterbetriebs. „Seit 1998" bleibt |
| **1.26** | Inhalt | **Benefits + Mitarbeiterstimmen** für die Karriereseite | André | bündeln mit R4 | offen |
| **R7** | Bild | **Echtes Vorschaubild statt Unsplash-Stockfoto** (`og:image`, JSON-LD). *Deckungsgleich mit dem offenen OG-Bild-Punkt im Preloader-Plan* | André | — | offen |
| **R2** | Bild | **Eigene Motive** für Leasingrückgabe und Außenaufbereitung | André | beide teilen sich ein Bild mit anderen Kacheln | offen |
| *(ohne Nr.)* | Bild / Recht | **Partnerlogos:** schriftliche Referenzfreigabe je Partner, monochrome Dateien, Vorgaben zu Mindestgröße und Schutzraum | André | ohne Freigabe dürfen die Logos nicht stehen | 🟨 **teilweise** — riparo (Logo + Link), Porsche Zentrum Leipzig (nur Link — die Wortmarke gehört der Porsche AG), BVAT-Siegel; 2026-09-16. Weitere Freigaben nach `docs/partnerlogos/README.md` |

**Bündelvorschlag:** Karriere (1.26 + R4) · Leistungstexte (R3) · Bilder (R7 + R2 + Partnerlogos) · Formularfelder (R12 + 1.18).

---

## 3. 🟢 Ohne Zulieferung umsetzbar (10)

| Nr. | Bereich | Aufgabe | Verantwortlich | Blocker | Status |
|---|---|---|---|---|---|
| **R9** | Formulare | **Anhänge mitsenden.** Derzeit ersetzt durch Vorgangsnummer + vorbereitete E-Mail | OALAB | **R10** — erst wenn der Versand läuft, ist absehbar, welcher Weg sich lohnt | 🟨 **für Schäden gelöst** — Fotos gehen seit 2026-09-16 über reparatur.info („Daten hochladen"). Offen nur noch für Termin-, Geschäftskunden- und Bewerbungsanfragen |
| **R11** | Technik | **Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben machen.** Beim Schadenformular ist Streichen seit R8 ein Dateneintrag, bei den anderen dreien nicht | OALAB | — | offen |
| *(ohne Nr.)* | SEO | **19 von 27 Meta-Descriptions außerhalb 140–160 Zeichen** (12 zu lang, 7 zu kurz). Gemessen am ausgelieferten HTML | OALAB | — | ✅ **erledigt** (Paket G, Phase 3). Nachgemessen 2026-09-07 gegen einen frischen Build: **0 von 29** außerhalb |
| *(ohne Nr.)* | SEO | **Titles im selben Durchgang** gegen 50–60 Zeichen prüfen | OALAB | — | ✅ **erledigt**. Nachgemessen 2026-09-07: **0 von 29** außerhalb. ⚠️ Die Messung ist nur so frisch wie `dist/` — der Stand vom 05.09. meldete noch 12/19, weil er älter war als die Korrektur |
| *(ohne Nr.)* | Technik | **Fünf verwaiste Komponenten** — `About`, `AccidentFocus`, `Hero`, `Jobs`, `TargetGroups`, alle **0 Importe** | OALAB | `Hero.tsx` bleibt unangetastet (Vorgabe); `About.tsx` enthält echten Kundentext | ✅ **erledigt** (Paket G, Phase 11). Nachgezählt 2026-09-07: `About`, `AccidentFocus`, `TargetGroups` gelöscht; `Hero.tsx` und `Jobs.tsx` stehen bewusst weiter ohne Import |
| *(ohne Nr.)* | Technik | **`npm run shots` und `npm run kontrast`** ins Repository. Der Kontrastmesser hat gefunden, was drei Sichtprüfungen nicht fanden | OALAB | — | ✅ **erledigt** (Paket G, Phase 2) — aber erst seit 2026-09-07 lauffähig. **Korrektur der eigenen Prüfung von heute Vormittag:** Ich hatte abgehakt, weil beide in `package.json` stehen. Ausgeführt hat sie niemand — `scripts/lib/preview-server.mjs` rief `spawn('npx', …)` auf, und `npx` gibt es unter Windows nicht als ausführbare Datei. Beide brachen mit `ENOENT` ab. Behoben (Aufruf über `process.execPath` + Projekt-Binärdatei), danach nachweislich durchgelaufen |
| *(ohne Nr.)* | A11y | **Kontrastbefunde aus dem Gesamtlauf** | OALAB | — | ✅ **erledigt 2026-09-07.** 17 Befunde → **0**. 16 davon waren Messartefakte: fünf von der fixierten Aktionsleiste überdeckt, vier gesperrte Knöpfe (WCAG 1.4.3 nimmt inaktive Bedienelemente aus), sieben weitere ebenfalls überdeckt. **Der Wächter wurde geschaerft, nicht das Design verändert** — der Fotoschutz aus Paket C blieb unangetastet. Ein Befund war echt (Hero-Subline) und ist behoben |
| *(ohne Nr.)* | Video | **Alle drei Videoplätze** (3.20, 3.21, 3.18) | OALAB | — | ✅ **erledigt 2026-09-07.** Kurze stumme Schnitte aus dem gelieferten Film, zusammen 8,85 MiB statt 115,6 MiB. Der Kunde hat Weg (a) gewählt; der Film **mit Ton** bleibt damit ungenutzt — wer ihn zeigen will, braucht den Umbau von `BetriebsVideo` auf Klick-Wiedergabe |
| *(ohne Nr.)* | A11y | **Anhalte-Möglichkeit für die drei automatisch laufenden Videos** (WCAG 2.2.2: Bewegung über 5 s braucht Pause/Stopp). Seit der Korrektur vom 2026-09-07 laufen sie auch bei gemeldeter reduzierter Bewegung — dieses Flag war bisher die einzige Anhalte-Möglichkeit | OALAB | — | offen, aufgenommen 2026-09-10 (`docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`, Phase 6) |
| *(ohne Nr.)* | Bild | **12 Drohnenclips und 16 Rohclips** aus der Lieferung vom 2026-09-07 sind ungenutzt. Sie decken die offenen Fotopunkte **3.23–3.29** vermutlich teilweise ab — Einzelbilder daraus wären besser als gar kein Motiv | OALAB | — | offen, zu prüfen |
| **R14** | Darstellung | **Partner in den Zielgruppenkarten auf Full HD unsichtbar** (Sichtprüfung User 2026-09-17). Ab 1024 px Breite blendete eine Höhen-Query die Listen unter 860 px Fensterhöhe aus — ein maximierter Full-HD-Browser mit Zoom liegt darunter. Dazu: Mausrad erreichte innere Scrollbereiche nicht (Lenis) | OALAB | — | ✅ **erledigt 2026-09-17.** Liste nimmt den Restplatz und scrollt, drei Höhenstufen, breitere Karte, Verweilstrecke; `allowNestedScroll` behebt nebenbei die Karriere-Karten und den Dialog in niedrigen Fenstern. Gemessen über 15 Fenster: `npm run zielgruppen` |
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

> **Nachtrag 2026-09-07.** Vier Punkte aus Abschnitt 3 waren beim Schreiben dieser
> Übersicht bereits erledigt oder wurden es am selben Tag durch Paket G: die beiden
> Messwerkzeuge, die verwaisten Komponenten, Descriptions und Titles. Alle vier sind
> oben gegen den Code bzw. gegen einen frischen Build nachgeprüft und mit Beleg
> abgehakt. **Lehre — dieselbe wie in Abschnitt 4:** Eine Statusspalte altert schneller
> als der Code. Wer sie liest, misst nach.
>
> **Nachtrag am selben Tag, zweite Lehre.** Bei den Messwerkzeugen habe ich genau den
> Fehler gemacht, vor dem `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`
> warnt: Ich habe geprüft, ob der Eintrag in `package.json` steht — nicht, ob der Befehl
> läuft. Er lief nicht, auf keiner Windows-Maschine, seit dem Tag seiner Auslieferung.
> **Ein Werkzeug gilt erst als vorhanden, wenn es einmal durchgelaufen ist.**

| | Anzahl |
|---|---|
| Blockiert den Livegang | **3** *(davon R10 seit 2026-09-08 nur noch Live-Test)* |
| Wartet auf André | **~~9~~ ~~10~~ 8** *(2026-09-16: R13 erledigt, R12 ruht mit abgeschaltetem Schadenformular; Partnerlogos teilweise; R1 bis auf ein Jahr geliefert; Fotopunkte in Sichtung)* |
| Ohne Zulieferung umsetzbar | **~~10~~ ~~6~~ 8** *(nachgezählt 2026-09-10: 7 offene Zeilen — die Drohnenclip-Zeile war in der 6 nicht mitgezählt — plus WCAG 2.2.2)* |
| **Summe echt offen** | **~~22~~ ~~18~~ ~~20~~ ~~21~~ 19** *(ohne Schleife 4 — die führt ihre 21 Punkte selbst)* |
| In den Dokumenten offen, tatsächlich erledigt oder überholt | 10 Kästchen |
| Außerhalb des Projekts (Parallax-Kit) | 11 Kästchen |
