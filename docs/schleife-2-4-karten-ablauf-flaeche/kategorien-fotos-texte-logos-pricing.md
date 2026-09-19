# Offene Punkte nach Art der Zulieferung

**Angelegt:** 2026-09-14 · **Quellen:** `docs/backlog/schleife-1.md` bis `schleife-4.md`,
`nicht-relevant.md`, `offene-punkte-konsolidiert.md`

> **Wozu diese Datei.** Der Backlog ist nach Review-Runden sortiert — gut zum Nachschlagen
> einer Nummer, schlecht zum Entscheiden. Wer eine Fotolieferung zusammenstellt, will alle
> Fotopunkte auf einen Blick, nicht verteilt über vier Dateien. Hier stehen dieselben
> Punkte nach **Art der Zulieferung** geschnitten.
>
> **✅ Entscheidungen des Kunden vom 2026-09-16 — umgesetzt** (`docs/preise-partner-schadenlink/`):
> **Pricing komplett entschieden** (4.4/4.10 nach Absprache, 4.7 Fußnote, 4.9 nach Aufwand,
> 3.35 bepreist bzw. nach Absprache; 2.26/2.11 später) · **Brillant** · **Lackreinigung
> entfällt** · **R13 erledigt** · **R5/R6 zum Schluss** · **Logos:** riparo mit Logo + Link,
> Porsche Zentrum Leipzig nur Link, BVAT-Siegel · **Schaden melden → reparatur.info**.
> Die Zeilen unten zeigen den Stand **vor** diesen Entscheidungen; maßgeblich ist der Backlog.
>
> **Aktuelle Liste aller offenen Punkte (gegen den Code geprüft, 2026-09-17):**
> [`../backlog/tasks/2026-09-17-abgleich-offene-punkte-tasks.md`](../backlog/tasks/2026-09-17-abgleich-offene-punkte-tasks.md), Phase 4.
>
> **Keine neuen Nummern.** Jede Zeile trägt ihre Backlog-Nummer. Dopplungen sind
> zusammengezogen und als solche gekennzeichnet — sonst wird dieselbe Lieferung zweimal
> angefragt.

---

## 1. Fotos und Video

**23 Punkte, davon 17 bei André.** Eine Fotolieferung ist am 2026-09-10 eingegangen und
wird gesichtet — welche Punkte sie abdeckt, steht erst danach fest.

### 1a. Motive, die der Betrieb liefern muss

| Nr. | Schl. | Motiv | Wofür konkret |
|---|---|---|---|
| **3.23** | 3 | Fotopaket Aufbereitung: Versiegelung, Felgenreinigung, Politur, Keramikapplikation **während der Arbeit** | Füllt die Parallax-Galerie → löst zugleich **2.2** und **3.6** |
| **3.24** | 3 | Delle, während sie entfernt wird | Füllt **3.11** (Dellenentfernung) |
| **3.25** | 3 | Smart Repair, echte Nahaufnahme | Füllt **3.10** — heute steht dort ein Aufbereitungsbild |
| **3.26** | 3 | Neu-/Reparaturlackierung: Stoßstange beim Schleifen oder Lackierkabine | Lackierseite |
| **3.27** | 3 | Hagelschaden (Archiv oder anstehendes Fahrzeug) | Hagelseite |
| **3.28** | 3 | Felge in Reparatur / beim Lackieren | Felgenseite — vorhanden sind nur beschädigte Felgen |
| **3.29** = **2.15** | 3 + 2 | Innenaufbereitung: **exklusives Fahrzeug, kein Transporter** | Ersetzt das heutige KI-Bild |
| **2.14** = **R2** | 2 | Leasingrückgabe: eigenes Bild | Teilt sich heute ein Motiv mit anderen Kacheln |
| **R2** | – | Außenaufbereitung: eigenes Bild | Dateiname und Einsatzort fallen heute auseinander |
| **2.16** | 2 | Unfallinstandsetzung Hero — wirkt wie Schadensaufnahme, nicht wie Instandsetzung | Hero der Unfallseite |
| **2.20** | 2 | Fuhrpark-/Autohausservice (Hänger) | Geschäftskundenseite |
| **2.21** = **3.4** | 2 + 3 | Eigener Mietwagen statt Symbolbild | Bild 5 der Startseite |
| **R7** | – | **Echtes Vorschaubild** statt Unsplash-Stockfoto | `og:image` + strukturierte Daten — **das Bild, das Google und jede Plattform beim Teilen zeigt** |

> **Fotogrundregel des Kunden** *(ohne Nummer, gilt für alle oben)*: Handyfotos,
> unbearbeitet, **während der Bearbeitung** oder kurz vor Ende — keine reinen
> Ergebnisbilder. Bei der Anforderung mitschicken.

### 1b. Bildarbeit bei uns

| Nr. | Schl. | Aufgabe | Status |
|---|---|---|---|
| **4.1** | 4 | Blauer Porsche: Kalkränder/Verschmutzung auf den Felgen retuschieren | Startmotiv, zwei Dateien (Desktop + mobil), danach `npm run images` |
| **3.8** | 3 | Schadenaufnahme: ruhigeres Hintergrundmotiv im Stil der Aufbereitungsseite | Gehört zu **2.18** (gleiche Sektion) |
| *(o. Nr.)* | – | **12 Drohnenclips + 16 Rohclips ungenutzt** aus der Lieferung vom 2026-09-07 | Daraus ließen sich Standbilder für **3.23–3.29** ziehen — besser als gar kein Motiv |

### 1c. Video

| Nr. | Schl. | Aufgabe | Status |
|---|---|---|---|
| **4.14** | 4 | Vollständiges Drohnenvideo — der Schwenk durch die Karosserieabteilung fehlt | **Empfehlung: Klick-Video mit Steuerung.** Lädt erst beim Klick, lässt sich anhalten — löst zugleich das offene WCAG 2.2.2 |
| *(o. Nr.)* | – | **Anhalte-Möglichkeit für die drei laufenden Videos** (WCAG 2.2.2) | Verifiziert: kein `controls`, 3× `autoPlay loop`. Wird von 4.14 miterledigt |
| ✅ 3.18 · 3.20 · 3.21 | 3 | Karriere-, Hero- und Betriebsvideo | erledigt 2026-09-07 |

### 1d. Unklar

| Nr. | Schl. | Aufgabe |
|---|---|---|
| **3.37** | 3 | „Bildtechnisch noch was ändern" — der Satz ist im Protokoll unvollständig. Bildgrößen? Formate? Darstellung? **Rückfrage nötig** |

---

## 2. Texte

**21 Punkte, davon 13 bei André.** Der größte Hebel: drei Zulieferungen blockieren
zusammen neun weitere Punkte.

### 2a. Die drei Textengpässe

| Nr. | Schl. | Was fehlt | Was daran hängt |
|---|---|---|---|
| **R3** → **1.15** | 1 | **Erklärtexte für 7 Leistungsseiten**, je 2–3 Absätze „Was ist X?" — was das Verfahren ist, wann es infrage kommt, wo seine Grenzen liegen | 🔴 Die Sektion steht auf **7 Seiten sichtbar leer** (verifiziert: 7× `erklaerung={null}`). Betrifft Lackierung, Smart Repair, Dellen, Hagel, Felgen, Autoglas, Fuhrpark |
| **2.26** = **1.18** | 2 + 1 | **Liste aller Zusatzleistungen** (Keramikversiegelung, Nanoversiegelung, leichte Kratzer, Steinschläge, Türkanten) | 🔴 Blockiert **1.18** und **2.11**. Zwei Dummy-Einträge stehen im Code und brechen den Build, sobald ihre Anerkennung verrottet. *Teilklärung durch 4.21: die Formularauswahl sind künftig die Pakete* |
| **3.36** | 3 | **Slogan-Wortlaut** — Richtung klar, Formulierung offen | 🔴 Blockiert **2.7** (Slogan anpassen) und **2.8** (überall platzieren) |

### 2b. Textkorrekturen mit klarem Wortlaut

| Nr. | Schl. | Aufgabe | Status |
|---|---|---|---|
| **4.2** | 4 | Betriebsfläche **3.000 → 3.500 m²** | ✅ **entschieden und umgesetzt 2026-09-14** |
| **4.18** | 4 | Zeitstrahl 2013: Umzug auf über 3.500 m², Komplettreparatur, Neuteillackierung, Karosserie | ✅ **mit 4.2 entsperrt und umgesetzt** |
| ✅ 4.5 · 4.6 · 4.11 · 4.12 · 4.15 · 4.16 · 4.17 · 4.20 | 4 | Sofortpaket Schleife 4 | ✅ umgesetzt 2026-09-11 *(seit 2026-09-17 in `main`)* |
| **4.21** | 4 | Programmnamen vereinheitlichen: Innenaufbereitung → „Intensiv Innenraumreinigung" usw. | 🟠 **Abgrenzung klären:** Paketname ≠ Seitenname. `/innenaufbereitung-leipzig` trägt den Suchbegriff. Vorschlag: Paketnamen dort, wo Pakete gemeint sind; Bereichsnamen für Seiten und Navigation. Auch: „Brilliant" oder „Brillant"? |
| **4.3** | 4 | Leistungsaufzählung neu: „Innenraum und Außenpflege, Politur, Versiegelung, Geruchsentfernung" | 🟠 **Der Kunde fragt selbst:** entfällt „Lackreinigung" oder geht sie in Politur/Versiegelung auf? |
| **4.8** | 4 | Doppelung zwischen „Außenaufbereitung" und „Lackaufbereitung" auflösen | 🟠 Fachliche Aussage — braucht vom Kunden, was wohin gehört. Hängt an 4.3 |

### 2c. Texte, die eine Sachfrage voraussetzen

| Nr. | Schl. | Frage an André | Was daran hängt |
|---|---|---|---|
| **R13** | – | **Seit wann ist der Betrieb Meisterbetrieb?** | 🔴 Die Seite sagt an **11 Stellen** „Meisterbetrieb seit 1998" (verifiziert). Laut 4.16 begann 1998 die **Aufbereitung**, Lack und Karosserie kamen laut 4.18 erst 2013. Stimmt „seit 1998" nicht, ist die Aussage irreführend. André hat den Meisterbrief bei 1998 selbst gestrichen |
| **R5** | – | **Impressum:** Handwerkskammer, Verleihungsstaat, berufsrechtliche Regelung, Telefonnummer (Altseite nennt zwei), § 36 VSBG | 🔴 **Livegang-Blocker.** Berufsbezeichnung ist mit 4.11 geliefert, der Rest fehlt — auch auf der Altseite |
| **R6** | – | **Datenschutzerklärung** — Faktenblatt liegt bereit | 🔴 **Livegang-Blocker, dringlicher geworden:** Seit 2026-09-08 versendet die Vorschau Formulare tatsächlich |
| **3.32** / **R4** | 3 | **Ausbildung:** Wird im kommenden Jahrgang besetzt? Bleibt Industriekaufmann/-frau? Je Beruf Beginn, Dauer, Voraussetzungen, Übernahme | 🟨 Richtung „ja" durch 4.19. Drei Karten stehen mit Schleier auf `/karriere` |
| **1.26** | 1 | **Benefits + Mitarbeiterstimmen** | 🟠 Drei Platzhalter auf `/karriere`. **3.19** ist fertig gebaut und anonym per Bauart — es fehlen nur die Aussagen |
| **4.19** | 4 | **Jahr für Meilenstein 3** (Versicherungspartnerschaften, Ausbildungsbetrieb) | 🟠 Text liegt vor, Jahr fehlt. Bleibt bewusst Platzhalter — ein geratenes Jahr sieht aus wie eine geprüfte Angabe |
| **3.30** | 3 | **Vintech:** darf der Autoglaspartner genannt werden? Inhalte zuliefern | 🟠 Blockiert **3.13** (PKW/LKW-Neuverglasung prüfen) |
| **4.13** | 4 | „Autotex" = **Audatex**? Neu wäre **DAT** | 🟠 Eine Karte „Audatex-Kalkulation" steht bereits |
| **2.27** | 2 | Liste lokaler Jobbörsen / Recruiting-Portale | 🟠 Kein Blocker, reine Zulieferung |
| **3.22** | 3 | Wissensdatenbank neu gestalten | 🟠 Ausdrücklich **kein** Livegang-Blocker (3.3), nach dem Deployment |

---

## 3. Logos und Freigaben

**4 Punkte, alle bei André. Rechtlich heikel: ohne schriftliche Freigabe darf kein
fremdes Logo stehen.**

| Nr. | Schl. | Aufgabe | Status |
|---|---|---|---|
| **3.31** | 3 | **Freigaben Partner-Logos** — Autohäuser, Versicherungen, Agenturen | 🔴 **Blockiert 3.16.** Betrifft 5 Autohäuser + 31 Versicherer aus `data/partners.ts` |
| *(o. Nr.)* | – | Je Partner: **schriftliche Referenzfreigabe**, monochrome Dateien, Vorgaben zu Mindestgröße und Schutzraum | 🔴 Gehört zu 3.31, hier ausdrücklich, weil die Freigabe allein nicht reicht |
| **3.16** | 3 | Partner nach Freigabe **direkt verlinken** („geschenkte Leads") | 🟠 Wartet auf 3.31 |
| **3.12** + **4.13** | 3 + 4 | **BVAT-Logo** einbinden + Mitgliedschaft nennen | 🟨 Hinweissatz steht seit 2026-09-06. **Offen: (a)** Logodatei vom Verband, **(b)** dieselbe Freigabefrage wie oben, **(c)** ⚠️ **die Langform aus 4.13 stimmt nicht** — laut Impressum auf bvat.de heißt der Verband „Bundesverband **Ausbeultechnik und Hagelinstandsetzung** e.V." (ohne „für"; am 2026-09-16 korrigiert), nicht „Bundesverband Autoreparatur-Technik". ✅ Seit 2026-09-16 mit Siegel eingebaut |

---

## 4. Pricing

**7 Punkte. Vier davon sind dieselbe Grundsatzfrage aus vier Richtungen:
feste Preise zeigen oder nicht.**

| Nr. | Schl. | Aufgabe | Entscheidung, die fehlt |
|---|---|---|---|
| **4.4** = **4.10** | 4 | **Premiumpflege „exklusiv"** nicht mehr mit Festpreis, sondern „Preis nach Absprache" | 🟠 Heute „ab 348,00 €" an **5 Stellen**: Paketkarte, `Offer`-Schema, Einleitungstext der Preissektion, zwei FAQ-Antworten. **Alle gemeinsam ändern** — sonst widerspricht das Schema dem sichtbaren Text. *4.10 nennt „48 €", das existiert im Code nicht (0 Treffer) — gemeint ist fast sicher „ab 348,00 €". **Rückfrage.*** Nebenbei: Seite schreibt „SWIZÖL", Kunde „Swissvax" — Schreibweise festlegen |
| **4.7** | 4 | **Aufpreise:** Geländewagen/Großraumlimousine +20 %, Transporter +50 % | 🟠 **Fußnote oder ganz auf „Preis nach Absprache" umstellen?** **Unsere Empfehlung: Fußnote.** Sie hält die konkreten Preise, die KI-Antworten und Suchende zitieren (SEO-Standard 4.3 „Preisrahmen statt Floskeln"). „Preis nach Absprache" nimmt sie. Die Seite wirbt heute in H1, Meta-Description, FAQ **und** Schema mit festen Paketpreisen |
| **4.9** | 4 | **Lackaufbereitung** bei den Paketen vorne mit ausweisen | 🟠 „Preis nach Aufwand" **oder** Stundenverrechnungssatz? Der Stundensatz wäre die konkretere, zitierbare Angabe — **dafür fehlt der Betrag** |
| **3.35** | 3 | **Preisdarstellung Zusatzleistungen:** „nicht bepreisen" vs. „Ab-Preise wären aus Kundensicht wünschenswert" | 🟠 Richtung aus 4.4/4.9 ist „nach Absprache/Aufwand" — **für die Zusatzleistungen selbst ist das noch keine Entscheidung**. Betrifft 2.26 und 2.11 |
| **2.26** | 2 | Die Zusatzleistungsliste **kommt mit oder ohne Preise** | 🔴 Siehe Kategorie Texte — hängt an 3.35 |
| **2.11** | 2 | Zusatzleistungen als optional wählbar auf der Subseite ausweisen (Fußnote/Hinweis) | 🟠 Struktur steht in `data/zusatzleistungen.ts`. Hängt an 2.26 + 3.35 |

### Was zusammen entschieden werden sollte

Diese vier hängen an **einer** Haltung und sollten in **einem** Zug beantwortet werden,
sonst steht auf derselben Seite dreierlei Preislogik:

> **4.4/4.10** (exklusiv ohne Festpreis) · **4.7** (Aufpreise) · **4.9** (Lackaufbereitung)
> · **3.35** (Zusatzleistungen)

**Die eigentliche Frage dahinter:** Bleibt die Seite eine Seite mit **abfragbaren
Preisen** — dann Fußnote und „ab"-Preise, wo es geht — oder wird sie eine Seite mit
**Anfrage statt Preis**? Beides ist vertretbar. Das erste ist für Auffindbarkeit und
KI-Antworten deutlich stärker, weil konkrete Beträge zitierbar sind; das zweite schützt
vor Preisdiskussionen bei ungewöhnlichen Fahrzeugen.

---

## Was in keine der vier Kategorien fällt

Der Vollständigkeit halber — diese offenen Punkte sind **weder** Foto, Text, Logo **noch**
Preis, gehen also nicht an André:

| Nr. | Aufgabe | Bei wem |
|---|---|---|
| **2.1** | Kartenflächen | ✅ **umgesetzt 2026-09-14** |
| **2.18** + **3.8** | Sektion „Schadenaufnahme" (Startseite, scroll-gepinnt): weniger Transparenz, ruhigeres Motiv | OALAB — **offen**. *Korrigiert am 2026-09-17: Hier stand „2.1 + 2.18 umgesetzt". 2.1 hat diese Karte bewusst nicht erfasst (`schleife-2.md`), der Code ist unverändert* |
| **2.3** | Ablauf-Sektionen animieren | ✅ **umgesetzt 2026-09-14** |
| **R10** | Live-Test der **drei** Formulare mit eigenem Versand + Empfangsnachweis *(Schaden läuft seit 2026-09-16 über reparatur.info)* | OALAB |
| **R9** | Anhänge mitsenden | OALAB |
| **R11** | Termin-, Geschäftskunden- und Bewerbungsfelder datengetrieben | OALAB |
| **R12** | Feldliste Schadenmeldung mit André durchgehen | ⏸️ **ruht** — eigenes Schadenformular seit 2026-09-16 abgeschaltet |
| **3.33** · **3.34** | Bilder-Upload finales Go · reparatur.info genutzt? | ✅ **beantwortet 2026-09-16** (Fotos und Meldung über reparatur.info) |
| **T4** · `ITEMS` vs. `serviceCatalog` · Scrollytelling-Nachweis · Footer-Icons | Kleinkram | OALAB |

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/offene-punkte-konsolidiert.md` ·
`docs/schleife-2-4-karten-ablauf-flaeche/tasks/2026-09-14-karten-ablauf-flaeche-tasks.md`
