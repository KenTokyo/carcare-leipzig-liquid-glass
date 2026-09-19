# Abgleich nach dem Pull: offene Punkte aus allen vier Schleifen

**Angelegt:** 2026-09-17 · **Branch:** `2026-09-17-backlog-abgleich`
**Auftrag (User):** „Pull mir alle potenzielle Anpassungen und gib mir aus den Schleifen die offenen
Punkte einmal aus."
**Vorgänger:** [`2026-09-10-abgleich-offene-aufgaben-tasks.md`](2026-09-10-abgleich-offene-aufgaben-tasks.md)
(gleicher Auftrag, Stand 10.09.)
**Methode:** Jeder offene Punkt ist **am Code geprüft**, nicht aus der Doku übernommen. Dabei kam
zweimal Doku heraus, die dem Code widerspricht (Phase 3).

---

### ✅ Phase 1 — Pull
**Ziel:** Alle Änderungen vom Remote holen, ohne fremde Arbeit zu überschreiben.
* [x] `git fetch --all --prune`: zwei neue Branches (`2026-09-14-karten-ablauf-flaeche`,
      `2026-09-16-preise-partner-schadenlink`)
* [x] `origin/main` = `0898fda`. **Alle** lokalen und entfernten Branches sind darin enthalten
      (`git branch -a --no-merged origin/main` leer) — der Pull von `main` holt also alles
* [x] `main` per Fast-Forward von `efd549b` auf `0898fda` (5 Commits, 106 Dateien); Arbeitsbaum war sauber
* [x] Kein `npm install` nötig: `package.json` bekam nur zwei Skripte (`zielgruppen`, `partnerlogos`)
* [x] Neue Regeln aus dem Pull gelesen: Textregel 4 in `CLAUDE.md` gilt jetzt mit **3.500 m²**;
      neues Messwerkzeug `npm run zielgruppen`
**Referenzen:**
`CLAUDE.md`
`docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-tasks.md`
`docs/schleife-2-4-karten-ablauf-flaeche/tasks/2026-09-14-karten-ablauf-flaeche-tasks.md`

### ✅ Phase 2 — Abgleich gegen den Code
**Ziel:** Jeden offenen Punkt am Code prüfen.
* [x] `erklaerung={null}` auf **7** Leistungsseiten → **1.15/R3** offen
* [x] Anerkannte Platzhalter (`ANERKANNT` in `scripts/check-dummies.mjs`) decken sich mit dem Code:
      2× „Zusatzleistung" (**1.18/2.26**), „Meilenstein 3" + „Jahr offen" in `data/historie.ts`
      (**4.19**), 3× „Mitarbeiterstimme" in `data/stimmen.ts` (**1.26/3.19**)
* [x] Vorschaubild: Unsplash-Foto an **4** Stellen (`index.html` 2×, `components/SEOHead.tsx`,
      `seo/structuredData.ts`) → **R7** offen
* [x] Ausbildung: alle drei Berufe `nicht-suchend` (`data/jobs.ts`) → **3.32/R4** offen
* [x] Impressum: drei TODO-Blöcke (Telefon, berufsrechtliche Angaben, Streitbeilegung) → **R5** offen;
      Datenschutz: Gerüst mit `noindex` → **R6** offen
* [x] Parallax-Galerie (`components/DetailingGallery.tsx`): nur Verlaufskacheln, kein `src` → **2.2/3.6** offen
* [x] Fotos: seit 2026-09-09 kam **kein** neues Foto ins Repo (nur Partnerlogos) — die Lieferung vom
      10.09. ist noch nicht eingebaut. Außenaufbereitung zeigt `fahrzeugaufbereitung-…`, die
      Leasing-Kachel `smart-repair-…` (`data/detailing.ts`) → **R2/2.14** offen. Das Startmotiv wurde
      zuletzt am 2026-07-20 geändert → **4.1** offen
* [x] Videos: `autoPlay` + `loop` ohne `controls` in **5** Komponenten — die drei Filmausschnitte
      (3.18/3.20/3.21 über `PhotoBackdrop` und `BetriebsVideo`) **und** das animierte Logo
      (`Navbar`, `TargetGroupCards`, `Footer`) → **WCAG 2.2.2** offen, das Logo war dort nicht erfasst
* [x] Sektion „Schadenaufnahme": Schritt 02 der Schadenreise auf der Startseite
      (`AccidentDamageSection` → `ScrollPinnedProcess`), Karte `0.92` + Blur, Motiv
      `schadenaufnahme-leipzig-carcare.webp` — unverändert → **2.18/3.8 offen**
* [x] Autoglas: „WINTEC" steht **18× in 9 Dateien** — Title und Meta-Description von
      `/autoglas-leipzig`, FAQ, Service-Schema, Über uns, Privat- und Geschäftskunden.
      WINTEC Autoglas ist ein Partnernetz mit genau diesem Leistungstext (PKW, LKW und Bus,
      ISO 9001, 30 Jahre Garantie; per Websuche geprüft) → „Vintech" in **3.30** ist sehr
      wahrscheinlich WINTEC, **3.13** hängt daran
* [x] Anhänge: **0** Upload-Felder im Code, Unterlagen gehen per E-Mail mit Vorgangsnummer
      (`components/formulare/BewerbungFelder.tsx`) → **R9** für Bewerbung usw. offen
* [x] Felder: nur `data/schadenFelder.ts` ist datengetrieben → **R11** offen
* [x] Slogan: `components/HeroSection.tsx` vermerkt selbst „2.7/2.8 NICHT erledigt" → **2.7/2.8/3.36** offen
* [x] Schadenmeldung: `SCHADENMELDUNG_EXTERN = true` (`data/schadenmeldung.ts`) → **2.23** umgesetzt;
      das eigene Formular liegt still, Rückbau erst nach Kundenbestätigung
**Referenzen:**
`scripts/check-dummies.mjs`
`components/ScrollPinnedProcess.tsx`
`pages/AutoglasPage.tsx`

### ✅ Phase 3 — Doku-Drift behoben
**Ziel:** Stellen korrigieren, an denen die Doku dem Code oder sich selbst widerspricht.
* [x] 🟠 `kategorien-fotos-texte-logos-pricing.md` meldete **„2.1 + 2.18 ✅ umgesetzt"** —
      2.18 ist nicht umgesetzt (`schleife-2.md` sagt das ausdrücklich, der Code bestätigt es).
      Zeile getrennt; R10, R12, 3.33/3.34 und „noch nicht in `main`" nachgezogen, Verweis auf diese Liste
* [x] `schleife-1.md`: R1 „3 von 5 Stationen" → 5 von 6; R5 verwies noch auf R13 als offen;
      R9 beschrieb Upload-Felder, die es nicht mehr gibt; R10 „vier Formulararten" → drei;
      R12 „offen" → ruht
* [x] `schleife-2.md`: 2.3 und 2.23 in der Tabelle „Was Schleife 1 miterledigt hat" nachgezogen
* [x] `schleife-3.md`: 3.8 verortet; 3.13/3.30 mit dem WINTEC-Befund; Kopf „Alle sechs sind
      Entscheidungen" → drei davon beantwortet
* [x] `nicht-relevant.md`: „Videografen kontaktieren" als Voraussetzung überholt (Film kam am 07.09.)
* [x] `offene-punkte-konsolidiert.md`: R10 auf drei Formulararten, WCAG 2.2.2 um das Logo ergänzt
* [x] `README.md`: Stand, letzter Abgleich, offene Entscheidungen (3 statt 6), Rückfragen Schleife 4
      (2 statt 10), Live-Test (drei statt vier)
* [x] Veraltete Kästchen in fremden Plänen: **Push** (`origin/main` = `0898fda`), **`npm install`**
      (Commit `132d8f2`, Pakete liegen in `node_modules`), **Umbenennung R1–R12** (am 2026-09-06 erfolgt)
* [x] Nichts am Seitentext geändert, keine Kundennummer vergeben
**Referenzen:**
`docs/schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md`
`docs/backlog/schleife-1.md`
`docs/backlog/schleife-3.md`

### ✅ Phase 4 — Ergebnis: offene Punkte, Stand 2026-09-17
**Ziel:** Jeder Punkt **einmal** — Dopplungen zusammengezogen, Nummern in Klammern.

**Zählung:** Schleife 1: **5** · Schleife 2: **13** · Schleife 3: **21** · Schleife 4: **3** = **42** offen,
davon 3 nur noch Live-Test (1.17, 1.22, 2.24) und 4 zurückgestellt (1.18, 2.2, 2.11, 2.26). *Die Zählung vom 10.09. ist nur für Schleife 3 nachvollziehbar
(25 − 3.12, 3.33, 3.34, 3.35 = 21); Schleife 2 wurde damals nicht einheitlich gezählt.*

**Seit dem 10.09. erledigt:** 2.1, 2.3, 2.23, 3.12, 3.33, 3.34, 3.35, R13, R14 und 18 von 21
Punkten aus Schleife 4.

#### Schleife 1 (5)
| Nr. | Punkt | Woran es hängt |
|---|---|---|
| **1.15** (= R3) | Erklärtexte „Was ist X?" auf 7 Leistungsseiten — Sektion steht leer | Texte von André |
| **1.17**, **1.22** | Formular Aufbereitung und Bewerbung — Versand eingerichtet | nur Live-Test (R10) |
| **1.18** (= 2.26) | Zusatzleistungen im Aufbereitungsformular | ⏸️ zurückgestellt |
| **1.26** (= 3.19) | Benefits + Mitarbeiterstimmen für `/karriere` | Aussagen von André |

#### Schleife 2 (13)
| Nr. | Punkt | Woran es hängt |
|---|---|---|
| **2.2** (= 3.6) | Parallax-Galerie der Aufbereitung mit Fotos füllen | ⏸️ bis Fotopaket 3.23 |
| **2.7**, **2.8** | Slogan anpassen und überall platzieren | Wortlaut 3.36 |
| **2.11**, **2.26** (= 1.18) | Zusatzleistungen: Liste und Hinweis auf der Subseite | ⏸️ später (User 16.09.) |
| **2.14** (= R2) | Leasingrückgabe: eigenes Bild | Foto |
| **2.15** (= 3.29) | Innenaufbereitung: Bild ohne Transporter | Foto |
| **2.16** | Hero der Unfallseite wirkt wie Schadenaufnahme | Foto |
| **2.18** (+ 3.8) | Schadenaufnahme: weniger Transparenz | Entscheidung, bei uns |
| **2.20** | Fuhrpark-/Autohausservice (Hänger) | Foto |
| **2.21** (= 3.4) | Eigener Mietwagen statt Symbolbild | Foto |
| **2.24** | Geschäftskundenanfragen an André — eingerichtet | nur Live-Test (R10) |
| **2.27** | Liste lokaler Jobbörsen/Portale | André |

#### Schleife 3 (21)
| Nr. | Punkt | Woran es hängt |
|---|---|---|
| **3.23**–**3.29** | Fotopaket: Aufbereitung, Delle, Smart Repair, Lackierung, Hagel, Felge, Innenraum | André (Sichtung der Lieferung vom 10.09. offen) |
| **3.10**, **3.11** | Smart-Repair- und Dellen-Foto ersetzen | kommen über 3.25 / 3.24 |
| **3.4** (= 2.21), **3.6** (= 2.2) | Mietwagen, Parallax-Galerie | Fotos |
| **3.8** (+ 2.18) | Schadenaufnahme: ruhigeres Hintergrundmotiv | bei uns |
| **3.13**, **3.30** | Autoglas: LKW/Bus-Angabe prüfen; darf der Partner genannt werden? | André — **„Vintech" = WINTEC, steht 18× auf der Seite** |
| **3.16**, **3.31** | Partner verlinken / Logo-Freigaben | 🟨 teilweise (riparo, Porsche Zentrum Leipzig) |
| **3.19** (= 1.26) | Mitarbeiterstimmen — Struktur steht | Aussagen |
| **3.22** | Wissensdatenbank neu gestalten | nach dem Deployment (3.3) |
| **3.32** (= R4) | Ausbildung: kommender Jahrgang, Industriekaufmann/-frau, Eckdaten | André |
| **3.36** | Slogan-Wortlaut | André |
| **3.37** | „Bildtechnisch noch was ändern" — unklar | Rückfrage |

#### Schleife 4 (3 — 18 von 21 umgesetzt)
| Nr. | Punkt | Woran es hängt |
|---|---|---|
| **4.1** | Blauer Porsche: Felgen retuschieren | bei uns |
| **4.14** | Ganzer Drohnenfilm (Karosserie-Schwenk fehlt) | bei uns — Vorschlag Klick-Video, löst WCAG 2.2.2 mit |
| **4.19** | Jahr für Meilenstein 3 | André |

Dazu die offene Rückfrage **Priorität: ist 1 die höchste?**

#### Ohne Schleifennummer (nur, was oben nicht schon steht)
| Nr. | Punkt | Bei wem |
|---|---|---|
| 🔴 **R5** | Impressum: Kammer, Berufsrecht, Telefon, Streitbeilegung | André — zum Schluss |
| 🔴 **R6** | Datenschutzerklärung, inkl. Abschnitt reparatur.info und AV-Vertrag mit PDR.cloud | André — zum Schluss |
| **R7** | Echtes Vorschaubild statt Stockfoto | Foto |
| **R2** (Rest) | Außenaufbereitung: eigenes Bild | Foto |
| **R9** | Anhänge für Bewerbung, Termin, Geschäftskunden | bei uns |
| **R11** | Formularfelder datengetrieben | bei uns |
| *(o. Nr.)* | Anhalten der automatisch laufenden Videos (WCAG 2.2.2) — auch das Logo | bei uns |
| *(o. Nr.)* | Fotolieferung sichten, 12 Drohnen- und 16 Rohclips auf Standbilder prüfen | bei uns |
| **T4** | Zweiter Knopf auf den Aufbereitungskarten → Wissensbereich | bei uns |
| *(o. Nr.)* | `ITEMS` gegen `serviceCatalog` prüfen | bei uns |
| *(o. Nr.)* | Scrollytelling: Nachweis des gepinnten Zustands | bei uns |
| *(o. Nr.)* | Footer-Icons bei Kontrast 1,00:1 | André (Gestaltung) |
| *(o. Nr.)* | reparatur.info: Datenschutz- und Impressumslink in der App hinterlegen | André / PDR.cloud |
| *(o. Nr.)* | Porsche-Logo nur mit Datei und Nutzungsrecht; schriftliche Freigaben ablegen | André |
| *(o. Nr.)* | Eigenes Schadenformular zurückbauen — erst wenn reparatur.info bestätigt ist | nach Review |
| *(o. Nr.)* | Instagram-Beispiele an André schicken | bei uns |
| ⏸️ **R12** | Feldliste Schadenmeldung — ruht | — |

#### Zur Abnahme im nächsten Review (umgesetzt, Kunde soll bestätigen)
2.13 (Pakete ohne Foto) · 3.9 (USP-Karten je Seite eigenständig) · 3.1 und 2.3 bleiben
nebeneinander · 4.3/4.8 (Lackreinigung entfällt, außen = reinigen, Lack = Politur/Versiegelung/Wachs) ·
4.21 (Seiten und Navigation behalten „Innen-/Außenaufbereitung") · „Lackreinigung" bleibt in den
Wissensartikeln · Porsche Zentrum nur als Link · bleibt es bei reparatur.info?
**Referenzen:**
`docs/backlog/schleife-1.md` … `schleife-4.md`
`docs/backlog/offene-punkte-konsolidiert.md`

### ✅ Phase 5 — Prüfung
**Ziel:** Nichts kaputt gemacht, keine Kodierungsfehler.
* [x] `npm run nummern` grün: „keine Nummer ausserhalb der Kundenraeume" (1.1–1.26, 2.1–2.27,
      3.1–3.37, 4.1–4.21)
* [x] Steuerzeichen und Mojibake (Perl) über alle 12 geänderten Dateien: sauber — **mit Gegenprobe**:
      eine Testdatei mit `0x08` und „fÃ¼r" wird gemeldet
* [x] UTF-8-Gültigkeit (Python) über alle 12 Dateien: sauber; Gegenprobe mit Byte `0xFF` erkannt.
      **Fehlalarm unterwegs:** macOS-`iconv` meldete `README.md` als ungültig („Inappropriate ioctl
      for device") — Python liest die Datei fehlerfrei. `iconv` taugt hier nicht für diese Prüfung
* [x] Nichts committet (nicht beauftragt)

### ✅ Phase 6 — Pull vom 19.09., Commit und Push
**Ziel:** Den Abgleich veröffentlichen, ohne die laufende Arbeit am zweiten Standort zu berühren.
* [x] Pull 2026-09-19: `origin/main` `0898fda` → `83f0355` (Push-Stand vom 18.09.), Fast-Forward.
      Die lokalen Änderungen lagen währenddessen in einem benannten Stash und kamen byte-gleich
      zurück — neun von zehn Dateien unverändert
* [x] Eine Konfliktzeile zusammengeführt: Im Optimierungsplan zu Preise/Partner/Schadenlink hatten
      beide Standorte dasselbe Push-Kästchen abgehakt. Behalten wurde der genauere Text von GitHub,
      ergänzt um die Gegenprobe aus diesem Abgleich
* [x] Kein `npm install`: Der Pull ändert weder `package.json` noch Lockfile; `npm ls` sauber,
      `sharp` 0.35.4 und `smol-toml` 1.8.0 wie im Lockfile
* [x] Vor dem Commit `git fetch`: seit dem Pull hat niemand gepusht. Der Commit enthält
      ausschließlich `docs/` — kein Code, keine Konfiguration, kein `package.json`. Damit kann er
      die laufende Arbeit am anderen Standort nicht verändern
* [x] `npm run nummern` grün, `git diff --check` sauber, UTF-8, Steuerzeichen und Mojibake sauber
      (einziger Treffer: das in Phase 5 absichtlich zitierte Beispiel)
* [x] Ablauf: Commit auf `2026-09-17-backlog-abgleich` mit einzeln genannten Dateien statt
      `git add -A`, `main` per Fast-Forward nachgezogen — ohne Checkout, damit der Arbeitsbaum des
      Dev-Servers stehen bleibt. Darüber `npm run push-stand` als eigener Commit, Push ohne Force.
      Der Push selbst ist dort dokumentiert: [`../../push-stand/README.md`](../../push-stand/README.md)
**Referenzen:**
`docs/push-stand/README.md`
`docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-optimierung-tasks.md`

---

## Kommentare

### Phasen 1–5
**Eingehalten:** Fast-Forward statt Merge ✅, fremde Arbeit nicht angefasst ✅, jeder Status am Code
geprüft ✅, kein Seitentext geändert ✅, keine Kundennummer vergeben ✅, kein Dev-Server gestartet ✅,
unter 700 Zeilen ✅, kein Mojibake ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🟠 **Hoch, offen (Kunde): 3.30 „Vintech" ist WINTEC — und steht schon 18× auf der Seite**, auch in
   Title, Meta-Description und Schema von `/autoglas-leipzig`. Die Frage „darf der Partner genannt
   werden?" ist beim Kunden offen, die Seite beantwortet sie längst mit Ja (übernommen von der
   Altseite). Sagt André Nein, sind alle 18 Stellen **zugleich** zu ändern — wie bei 3.000 → 3.500.
   Der Leistungstext „PKW, LKW und Bus" ist der Standardtext des Netzes; genau das fragt 3.13.
2. 🟠 **Hoch, behoben: Die Kategorien-Übersicht meldete 2.18 als erledigt.** Wer nach ihr plant,
   hätte 2.18 und 3.8 aus der Liste gestrichen.
3. 🟡 **Mittel, offen: WCAG 2.2.2 betrifft fünf statt drei Videostellen** — das animierte Logo läuft
   in Navigation, Zielgruppenkarten und Footer in Endlosschleife. Dekorativ, aber ohne Anhalten.
4. 🟡 **Mittel, behoben: fünf veraltete Status in `schleife-1.md`** (R1, R5, R9, R10, R12).
5. 🔵 **Niedrig, behoben: drei erledigte Kästchen in fremden Plänen standen noch offen** (Push,
   `npm install`, Umbenennung) — die nächste Sitzung hätte sie erneut ausgeführt.
6. 🔵 **Niedrig, offen: Die Kategorien-Übersicht ist absichtlich auf dem Stand 14.09.** Zwei Listen,
   die auseinanderlaufen, sind die Ursache von Finding 2. Verweis auf diese Liste gesetzt.
7. 🔵 **Niedrig, behoben (eigener Fehler): Der erste Kodierungs-Scan hätte blind „sauber" melden
   können.** Er unterdrückte die Fehlerausgabe — ein fehlendes Werkzeug wäre als Erfolg durchgegangen.
   Mit Gegenprobe wiederholt; dabei fiel `iconv` als Fehlalarmquelle auf (Phase 5). Dieselbe Lehre wie
   `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`: erst die Gegenprobe macht die
   Prüfung zur Prüfung.

### Phase 6
**Eingehalten:** Fast-Forward statt Merge ✅, kein Force-Push ✅, fremde Arbeit nicht angefasst ✅,
nur `docs/` im Commit ✅, Dateien einzeln statt `git add -A` ✅, Kodierung mit Gegenprobe ✅.

**Auffälligkeiten/Findings (nach Schwere):**
1. 🔵 **Niedrig, systematisch: „Push"-Kästchen in Planungsdateien erzeugen Konflikte.** Genau diese
   eine Zeile stand an beiden Standorten und wurde zweimal verschieden abgehakt — der einzige
   Konflikt des Pulls. Seit dem 18.09. dokumentiert `docs/push-stand/README.md` jeden Push ohnehin;
   neue Planungen brauchen dafür kein eigenes Kästchen mehr.
2. 🔵 **Niedrig, zur Kenntnis: Der Push-Stand zählt Schleife 2 mit zwölf offenen Punkten, diese
   Liste mit dreizehn.** Unterschied ist 2.24 („✅ eingerichtet, Live-Test offen"): Der Zähler in
   `scripts/push-stand.mjs` überspringt jede Zeile, deren Status mit ✅ beginnt. Kein Widerspruch,
   aber beim Lesen der Übersicht zu wissen.

**Optimierungsplan:** [`2026-09-17-abgleich-optimierung-tasks.md`](2026-09-17-abgleich-optimierung-tasks.md)
