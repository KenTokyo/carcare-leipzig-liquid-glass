# Kundenentscheidungen vom 2026-09-16 — Preise, Texte, Partner, Schadenmeldung

**Angelegt:** 2026-09-16
**Branch:** `2026-09-16-preise-partner-schadenlink`, abgezweigt vom Arbeitsstand von
`2026-09-14-karten-ablauf-flaeche` (dessen Änderungen sind noch **nicht committet** —
der User gibt Commit, Push und Merge nach seiner Sichtprüfung frei)

## Auftrag (User, sinngemäß, alle Punkte)

| # | Entscheidung | Backlog |
|---|---|---|
| 1 | R13 ist erledigt — 2013 ist ein Meilenstein, nicht der Beginn des Meisterbetriebs | R13 |
| 2 | Impressum und Datenschutz **zum Schluss** | R5, R6 |
| 3 | Schreibweise **Brillant** | 4.21 (Teil), 4.5 |
| 4 | **Lackreinigung entfällt insgesamt** | 4.3 (+ 4.8) |
| 5 | Freigaben liegen vor: **Porsche Zentrum Leipzig, Riparo** — Logos sauber monochrom, **verlinkt auf die offiziellen Websites**, Vorgehen für spätere Freigaben merken | 3.16, 3.31 (Teil) |
| 6 | Datenschutzerklärung: Weiterleitungen zu Partnern erwähnen — **nur wenn juristisch notwendig** | R6 (Vorbereitung) |
| 7 | 3.12 / 4.13: **offizielles BVAT-Logo** und **offizielle Bezeichnung** | 3.12, 4.13 |
| 8 | „Schaden melden" → `https://reparatur.info/bs-carcare-gmbh` | 2.23, 3.33, 3.34 |
| 9 | 4.4 und 4.10 **alle gemeinsam** anpassen | 4.4, 4.10 |
| 10 | 4.7 als **Fußnote** | 4.7 |
| 11 | 4.9 **„Preis nach Aufwand"**, keine Stundensätze | 4.9 |
| 12 | 3.35: Zusatzleistungen werden bepreist, **auch „Preis nach Absprache"** | 3.35 |
| 13 | 2.26 und 2.11 **später** | — |
| 14 | Danach: genaue Liste was/wo → Sichtprüfung → erst dann Commit/Push/Merge | — |

---

## Recherche vor der Umsetzung (2026-09-16)

| Frage | Befund | Quelle |
|---|---|---|
| Was ist **riparo**? | **Kein Autohaus**, sondern Schadensteuerer: **riparo gmbh**, Holzgerlingen, AG Stuttgart HRB 758839; Gesellschafter u. a. Provinzial, R+V, Württembergische. Marke durchgehend kleingeschrieben | riparo.de/impressum, autohaus.de |
| Offizielle BVAT-Bezeichnung | **„Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V."** — **ohne „für"**. AG Charlottenburg VR 29872 B. Domain **bvat.de** (bvat-verband.de leitet um). ⚠️ `schleife-3.md`, `schleife-4.md` und die Kategorien-Datei schrieben „Bundesverband **für** …" — falsch, korrigiert | bvat.de/impressum |
| SWIZÖL oder Swissvax? | **Dieselbe Marke.** Swizöl war der frühere Name im DACH-Raum, seit 2009 heißt sie **Swissvax**; der deutsche Vertrieb schreibt „Swizöl is now called Swissvax". Der Kunde hat also die **aktuelle** Schreibweise | swissvax.de/en/pages/swizol |
| „Autotex" | Existiert als Kalkulationssystem nicht. Die drei marktüblichen sind **Audatex, DAT, GT Motive** → Tippfehler für Audatex | autoixpert.de, gtmotive.de |
| Was ist **reparatur.info**? | Eine Anwendung der **PDR.cloud GmbH** (Schönefeld, AG Cottbus HRB 18136 CB). Die Seite `/bs-carcare-gmbh` ist **BS CarCares eigene Schadenseite**: „Schadeninformation übermitteln — Daten hochladen" und „Besichtigungstermin vereinbaren", „Powered by PDR.cloud". Die App lädt **pro Betrieb** eine eigene Impressums- und Datenschutz-URL (`getOrgDatenschutz`, `getOrgImpressum`) | gerendert per Puppeteer, App-Bundle |
| Porsche-Logo | ⚠️ **Nicht verwendbar.** Das offizielle Asset-Paket (`@porsche-design-system/assets`, Herausgeber Porsche AG) ist lizenziert nur für Anwendungen „on behalf of Porsche" und untersagt ausdrücklich den Eindruck einer Porsche-Partnerschaft. Die Wortmarke gehört der **Porsche AG**, nicht dem Autohaus — dessen Freigabe deckt sie nicht. Die Porsche-Website blockt zudem automatisierte Abrufe (HTTP 429) | LICENSE im PDS-Repo |
| Offizielle Porsche-URL | `porsche-leipzig.de` → `dealer.porsche.com/de/leipzig/de-DE` → `leipzig.porsche.de/de/leipzig/de-DE` | Weiterleitungskette |

---

### ✅ Phase 1 — Branch, Sicherung von Paket 1, Planung
* [x] Branch `2026-09-16-preise-partner-schadenlink` angelegt
* [x] **44 Dateien** von Paket 1 samt Dateiliste und Basis-Commit `33b6f5d` in den Scratchpad
      gesichert (`output/commit-vorbereitung/paket1-2026-09-14/`, git-ignoriert). Beim Commit lässt sich Paket 1 damit
      als eigener Commit auf `2026-09-14-karten-ablauf-flaeche` setzen und Paket 2 sauber
      darauf — ohne interaktives Teil-Stagen, das in dieser Umgebung nicht geht
* [x] Diese Planung, Recherche vorangestellt

### ✅ Phase 2 — Preise (4.4, 4.10, 4.7, 4.9, 3.35)
* [x] „exklusiv": **Preis nach Absprache** überall — gemessen **6 Nennungen von 348 in
      3 Dateien → 0**: Karte und `priceOffers` (`data/detailing.ts`), Preis-Einleitung
      (`VehicleDetailingPage`), FAQ `preise`, `kosten` (Privatkunden) und `wachs`
* [x] **Swissvax** statt SWIZÖL — gemessen **9 Stellen in 5 Dateien → 0**; in der FAQ einmal „früher Swizöl"
      — wer den alten Namen sucht, findet die Seite weiter
* [x] `offerCatalogSchema`: `price` optional. Ohne Festpreis **keine** Preisfelder, auch
      keine Währung
* [x] **Lackaufbereitung — Preis nach Aufwand** als fünfte Karte über volle Breite,
      eigene Anfrage-Beschriftung; auch im Schema (sichtbar = auszeichnen)
* [x] **Fußnote 4.7** aus **einer** Quelle: `AUFPREIS_SATZ` in `data/detailing.ts`.
      Gelesen von der Fußnote unter den Paketen, fünf FAQ-Antworten, den Preisangaben auf
      Innen- und Außenseite und den drei Festpreis-Offers im Schema. Sternchen nur an den
      drei Festpreisen, für Vorlesegeräte angesagt
* [x] Preisangaben ohne „ab" auf „ab" gezogen, wo der Aufpreis sie sonst falsch machte
      (Meta `/fahrzeugaufbereitung`, Leasing-Karte, Privatkunden-Karte)
* [x] 3.35 im Kopf von `data/zusatzleistungen.ts` festgehalten — dort, wo 2.26 eingepflegt wird

### ✅ Phase 3 — Texte (4.3, 4.8, 4.21, R13)
* [x] **„Lackreinigung" aus allen Leistungstexten entfernt** — gemessen **17 Stellen in
      9 Dateien → 0** (Kommentare und Wissensartikel nicht mitgezählt): Paket, Schema-Offer, beide
      Listen der Außenseite, Außen-Meta, FAQ `umfang`, Startseiten-Karte, Leistungskatalog
      (3×), Service-Schema (2×), Stellenkarte Aufbereiter, Bereichs-Teaser „Anhaftungen im Lack"
* [x] **4.3 im Wortlaut** im Hero von `/fahrzeugaufbereitung-leipzig`:
      „Innenraum und Außenpflege, Politur, Versiegelung, Geruchsentfernung …"
* [x] **4.8 dadurch weitgehend gelöst:** außen = reinigen (Vorreinigung, Felgen, Insekten,
      Handoberwäsche, Scheiben), Lack = Politur, Versiegelung, Wachs. Die Außen-FAQ nennt
      jetzt ausdrücklich, dass Politur und Versiegelung im Paketpreis enthalten sind; die
      Lackaufbereitungs-Karte grenzt sich davon als „nach Aufwand" ab. Zur Abnahme zeigen
* [x] **Abgrenzung Wissensartikel:** 4 Stellen in `data/knowledgeArticles.ts` behalten den
      Fachbegriff. Der Artikel erklärt das Handwerk allgemein, ohne Angebot und ohne Preis;
      „Lackpolitur ohne vorherige Lackreinigung starten" ist dort ein fachlich richtiger
      Warnhinweis. Im Bericht zur Entscheidung gestellt
* [x] **Paketname „Intensiv Innenraumreinigung"** (Kundenwortlaut aus 4.6/4.21) — gemessen
      **13 Stellen in 5 Dateien** umbenannt, jetzt 18 Nennungen; „Brillant- und Intensivpflege" → volle Programmnamen; Bindestrich-
      Schreibweisen „Brillant-Außenpflege", „Intensiv-Innenreinigung" vereinheitlicht.
      „Brilliant" kam im Code nie vor
* [x] **4.21 Formularauswahl:** Intensiv Innenraumreinigung · Brillant Außenpflege ·
      Premiumpflege · **neu** Premiumpflege „exklusiv" · Lackaufbereitung (vorher „Lackpflege /
      Politur", wie die neue Karte 4.9). `id`s unverändert — Versand und Vorauswahl greifen
      weiter; die Mail-Beschriftung liest dieselbe Liste (`data/anfrageSchema.ts:74`)
* [x] **Seiten- und Navigationsnamen bleiben** „Innenaufbereitung"/„Außenaufbereitung" —
      sie tragen die Suchbegriffe
* [x] R13 geschlossen (Backlog in Phase 7)

### ✅ Phase 4 — „Schaden melden" → reparatur.info (2.23, 3.33, 3.34)
* [x] **Ziel an einer Stelle:** `data/schadenmeldung.ts` — `SCHADEN_ZIEL`, dazu der Schalter
      `SCHADENMELDUNG_EXTERN`. Auf `false` führt jeder Aufruf wieder ins eigene Formular
* [x] **Kennzeichnung an einer Stelle:** `components/ExternerLink.tsx` — `externAttribute()`
      (`target="_blank"`, `rel="noopener noreferrer"`) und `<ExternMarke>` (Pfeil ↗ und
      Ansage „öffnet in einem neuen Tab"). Die generischen Bausteine erkennen externe Ziele
      selbst: `PageHero`, `PageCTA`, `FeatureGrid`, `ScrollPinnedProcess`, Mega-Menü
* [x] **Alle 17 Einstiege umgestellt:** Navbar Desktop-Knopf und mobiles Menü, Mega-Menü-Karte
      (`data/navigation.ts`), Startseiten-Hero, Unfall-Scrollytelling (Karte + CTA),
      `/unfallinstandsetzung-leipzig` (Hero + Abschluss), `/hagelschadenreparatur-leipzig`
      (Hero + Abschluss), `/privatkunden`, `/leistungen`, `/kontakt` (Hero + Karte),
      Kontakt-CTA, Footer, mobile Aktionsleiste
* [x] **Dialog:** Im Auswahlschritt ist „Schaden melden" selbst der Link (ein Klick,
      Dialog schließt). Reparaturseiten, deren „… anfragen" auf den Schaden zeigt (R8),
      öffnen den Dialog mit „Schaden melden" vorgeschlagen — weiter per Link
* [x] **Kontaktseite:** Reiter „Schaden melden" zeigt `SchadenUebergabe` statt des Formulars —
      die beiden Wege der Schadenseite, ein Knopf, Telefonnummer. Alte Links auf
      `#contact-schaden` haben damit weiter ein Ziel
* [x] **Texte, die ein „Online-Formular" für Schäden versprachen:** Schritt „Schaden melden"
      (wortgleich an zwei Stellen), Bild-Alt-Text, FAQ `unfall` (Startseite), `melden`
      (Unfallseite), `digital` (Geschäftskunden), Ablaufschritt „Melden" (Privatkunden),
      Mega-Menü-Beschreibung
* [x] **Eigenes Schadenformular abgeschaltet, nicht gelöscht** — `RequestForm`,
      `SchadenFelder`, API-Zweig und Mail bleiben, erreichbar über den Schalter
* [x] **Nebenfund behoben:** Auf `/geschaeftskunden` standen **zwei FAQ mit der id `digital`**.
      Die Seite rendert sie über `PageFAQ`, das die id als React-`key` nutzt — zwei gleiche
      keys (React warnt, beim Neurendern kann es Einträge verwechseln). Inhaltlich widersprach
      die zweite Antwort („perspektivisch vorgesehen") der ersten. Zweite id jetzt
      `schadenuebermittlung`, Antwort auf den heutigen Stand. *(Eine erste Fassung dieses
      Vermerks behauptete, ein Klick klappe beide Antworten auf — das gilt nur für das
      Akkordeon `FAQSection`, das diese Seite nicht verwendet. Am HTML nachgeprüft und korrigiert.)*

### ✅ Phase 5 — Partnerlogos und BVAT (3.16, 3.31, 3.12, 4.13)
* [x] `TargetGroupPartner` um `url`, `logoBreite`, `logoHoehe`, `logoIstName` erweitert
* [x] **riparo** als eigene Liste `claimsPartners` (Schadensteuerer, **kein** Autohaus) —
      steht vorn in der Versicherer-Kachel der Startseite (Beschriftung jetzt „Versicherer &
      Schadensteuerer") und auf `/geschaeftskunden`; der Zähler „31 Versicherer" bleibt richtig
* [x] **riparo-Logo** aus der offiziellen Datei (riparo.de, 208×50) **einfarbig Graphit**,
      verlustfreies WebP, **628 B**. Reine Wortmarke → Name nur für Vorlesegeräte
* [x] **Porsche Zentrum Leipzig: Link ja, Logo nein** — Begründung in
      `docs/partnerlogos/README.md`. Link auf `porsche-leipzig.de` (Adresse des Autohauses,
      leitet auf die aktuelle Porsche-Plattform weiter)
* [x] **`PartnerEintrag`** als gemeinsamer Baustein für beide Listen — Logo, Link, Pfeil,
      Ansage. `TargetGroupCards` dadurch 546 → 510 Zeilen
* [x] **BVAT:** offizielle Bezeichnung „Bundesverband Ausbeultechnik und Hagelinstandsetzung
      e.V.", Siegel **unverändert** (800×212, verlustfreies WebP 27,5 KB statt 62 KB PNG),
      verlinkt auf `bvat.de`. Daten in `data/mitgliedschaften.ts`, Darstellung
      `components/Mitgliedssiegel.tsx` — **deckend** hinterlegt, weil schwarze Schrift auf
      dem Werkstattfoto unlesbar wäre
* [x] **3.12 Hagelseite:** Satz mit offiziellem Namen + Siegel direkt darunter
      (`ServiceLayout` hat dafür den optionalen Platz `leistung.zusatz`)
* [x] **4.13 Über uns:** Karte „Audatex- und DAT-Kalkulation" (Autotex = Audatex), Siegel unter
      den sechs Qualifikationen statt einer siebten Karte allein in der Reihe
* [x] FAQ `schadensteuerung` (Geschäftskunden) nennt riparo als Beispiel
* [x] **Wiederholbar:** `npm run partnerlogos` (`scripts/build-partner-logos.mjs`), Originale
      mit Prüfsumme unter `docs/partnerlogos/quelle/`, **Freigabe-Protokoll und Vorgehen** in
      `docs/partnerlogos/README.md`. **Gemerkt** als `partnerlogo-freigaben-vorgehen`
      (Gedächtnis), `partnerlisten-single-source` aktualisiert

### ✅ Phase 6 — Datenschutz: juristische Notwendigkeit prüfen
**Auftrag:** „… erwähnen, dass Weiterleitungen zu Partnern stattfinden können. Aber auch nur,
wenn's wirklich juristisch notwendig ist." — Einordnung nach dem Skill
`rechtstexte-unternehmenswebsite`, **keine Rechtsberatung**; die Abnahme liegt beim
Datenschutzbeauftragten bzw. beim anwaltlichen Check vor dem Livegang.

| Vorgang | Pflicht in der Erklärung? | Begründung |
|---|---|---|
| **Links zu Partnern** (riparo, Porsche Zentrum) und zum **BVAT** | **Nein** | Ein statischer Link verarbeitet selbst keine Daten; die Verbindung zum Ziel entsteht erst durch den Klick, dann ist das Ziel verantwortlich. Die Logos liegen auf dem eigenen Host — beim Seitenaufruf geht keine Anfrage an Partner. `rel="noreferrer"` unterdrückt zusätzlich den Referer. Übereinstimmend: [Dr. DSGVO](https://dr-dsgvo.de/externe-links-auf-webseiten-was-ist-zu-beachten/) (statische Links unproblematisch), [IT-Recht Kanzlei](https://www.it-recht-kanzlei.de/links-social-media-datenschutz.html) (keine Hinweispflicht für Links). Ein Hinweis wäre allenfalls **freiwillige** Praxis — nach Vorgabe des Users deshalb **nicht** aufgenommen |
| **„Schaden melden" → reparatur.info** | **Ja** — aber als eigene Verarbeitung, nicht als „Weiterleitung" | Die Zielseite ist BS CarCares eigene Schadenseite; Daten gehen „an uns", PDR.cloud stellt die Anwendung → spricht für **Auftragsverarbeitung** (Art. 28 DSGVO). Dann gehören Anbieter, Zweck, Datenarten, Speicherort und Löschfristen in die Erklärung (Art. 13), und ein AV-Vertrag muss vorliegen |

* [x] **Partnerlinks: kein Abschnitt.** Begründung auch in `docs/partnerlogos/README.md`,
      samt der Grenze: Ein **Hotlink**, Widget oder Pixel des Partners änderte das
* [x] **reparatur.info: Pflichtthema.** Faktenblatt um **Abschnitt 3a** ergänzt (Anbieter,
      Befunde, beobachteter Serverstandort `europe-west3`, technische Einordnung), Nachtrag
      im Kopf, zwei neue offene Fragen (AV-Vertrag mit PDR.cloud; in PDR.cloud hinterlegte
      Datenschutz-/Impressums-Adresse — auf der Startansicht war **keine** sichtbar)
* [x] Themenliste im Gerüst `/datenschutz` um „Schadenmeldung über reparatur.info (PDR.cloud)"
      ergänzt — der **Text** der Erklärung bleibt bei R6, wie vom User entschieden
* [x] Faktenblatt: überholten Resend-Vermerk in den offenen Fragen kenntlich gemacht

### ✅ Phase 7 — Messen, Backlog, Sichtprüfungsliste
* [x] Build grün, alle Wächter, Messwerkzeuge — Tabelle unten
* [x] **HTML-Prüfung** (eigenes Skript gegen `dist/`): 37 Einzelprüfungen grün — u. a. 100 Links
      auf reparatur.info, **alle** mit `target="_blank"` + `noopener noreferrer`, **0** alte
      Ziele `#contact-schaden`, Schema ohne Preisfelder bei „exklusiv", keine Lackreinigung
      außerhalb der Wissensartikel, kein Porsche-Logo eingebunden
* [x] **Klicktests Formular-Vorauswahl**: 7/7 (siehe Befund Phase 7)
* [x] **16 gezielte Aufnahmen** für die Sichtprüfung: `output/sichtpruefung-2026-09-16/`
* [x] Backlog: 2.11, 2.23, 2.26 · 3.12, 3.16, 3.31, 3.33, 3.34, 3.35 · 4.3, 4.4, 4.7, 4.8, 4.9,
      4.10, 4.13, 4.21 · R5, R6, R9, R12, R13, Partnerlogos · Rückfragenliste, Zähler, README,
      Kategorien-Datei; falscher BVAT-Name an allen Stellen korrigiert bzw. als Korrektur markiert

---

## Messwerte am Ende des Pakets

| Werkzeug | Ergebnis |
|---|---|
| `npm run build` | 29/29 Routen prerendert, 236 FAQPage-Texte im HTML, Typecheck sauber |
| `npm run kontrast` | **5195 Textstellen**, 29 Routen × 2 Breiten × 4 Positionen — **0 unter AA** |
| `npm run meta` | 0 Titles, 0 Descriptions außerhalb 50–60 / 140–160 |
| `npm run nav` | **16/16** |
| `npm run nummern` | keine Nummer außerhalb der Kundenräume |
| `npm run dummies` | 29 Seiten, keine unbekannten Platzhalter |
| HTML-Prüfung | 37/37 |
| Klicktests Vorauswahl | 7/7 |
| Zeilenlimit | größte berührte Datei `TargetGroupCards.tsx` mit 510 |

---

## Kommentare

### Phase 1 — Branch, Sicherung
**Eingehalten**: ein Paket ein Branch ✅, nichts committet (Vorgabe User) ✅, Planung vor Code ✅,
Recherche vor Planung ✅

**Auffälligkeit:**
1. 🟡 **Mittel: Zwei Pakete im selben Arbeitsbaum.** Paket 1 (2026-09-14) ist nicht committet;
   gemessen hat dieses Paket **20** seiner 44 Dateien weiter verändert, und Paket 1 bringt 5 neue
   Dateien mit. Interaktives Teil-Stagen geht hier nicht, `git stash` scheitert an den neuen
   Dateien. Gelöst über die Dateisicherung plus Worktree und `reset --soft` (Optimierungsplan 1).

### Phase 2 — Preise
**Eingehalten**: eine Quelle für den Aufpreissatz ✅, Schema = sichtbarer Text ✅, gemessen statt
geschätzt ✅, Meta-Korridor ✅

**Auffälligkeiten:**
1. 🟠 **Hoch: Festpreise ohne „ab" wären mit der Fußnote falsch geworden.** Meta-Description der
   Hub-Seite, Leasing-Karte und Privatkunden-Karte nannten 199 €/299 € als Endpreis. Auf „ab" gezogen.
2. 🟡 **Mittel: Das Schema kannte kein Angebot ohne Preis.** `offerCatalogSchema` verlangte `price`;
   „nach Absprache" hätte eine erfundene Zahl gebraucht. `price` ist jetzt optional.
3. 🟢 **Niedrig: SWIZÖL ist der alte Markenname.** Swissvax heißt die Marke seit 2009 — der Kunde
   hatte recht. Einmal „früher Swizöl" in der FAQ, damit die alte Suche weiter trifft.

### Phase 3 — Texte
**Eingehalten**: Kundenwortlaut ✅, Suchbegriffe der Seiten erhalten ✅, `id`s für Versand stabil ✅

**Auffälligkeiten:**
1. 🟠 **Hoch: Der Paketname im Code war nicht der des Kunden.** „Intensiv Innenreinigung" (13 Stellen)
   statt „Intensiv Innenraumreinigung" — seit Schleife 1 unbemerkt, weil beide plausibel klingen.
2. 🟡 **Mittel: Meine ersten Zahlen im Plan waren geschätzt.** 13/6/5 geschrieben, gemessen
   17/9/6 — vor dem Weiterarbeiten korrigiert. Dieselbe Lehre wie 2026-09-14.
3. 🟢 **Niedrig, zur Entscheidung:** „Lackreinigung" bleibt in 4 Stellen der Wissensartikel
   (Handwerkserklärung, kein Angebot). Falls der Begriff auch dort weg soll: `data/knowledgeArticles.ts`.

**Referenzen:**
`data/detailing.ts`
`data/faqs.ts`
`data/leistungsauswahl.ts`

### Phase 4 — Schaden melden
**Eingehalten**: ein Ziel, ein Schalter ✅, generische Bausteine statt 17 Einzelfälle ✅, WCAG G201
(neuer Tab angekündigt) ✅, nichts gelöscht, was der Kunde bestätigen muss ✅

**Auffälligkeiten:**
1. 🟡 **Mittel: Doppelte FAQ-id `digital` auf `/geschaeftskunden`** — doppelter React-`key` und
   widersprüchliche Antworten. Behoben. *Meine erste Beschreibung (Akkordeon klappt beide auf) war
   falsch; am HTML nachgeprüft und korrigiert.*
2. 🟡 **Mittel: Das eigene Schadenformular ist jetzt nur noch hinter einem Schalter erreichbar.**
   Bewusst so, bis der Kunde den externen Weg bestätigt — danach entfernen (Optimierungsplan 2).

**Referenzen:**
`data/schadenmeldung.ts`
`components/ExternerLink.tsx`
`components/AnfrageDialog.tsx`

### Phase 5 — Partner und BVAT
**Eingehalten**: nur offizielle Dateien ✅, Originale nicht ausgeliefert ✅, Lizenz vor Nutzung
gelesen ✅, wiederholbar per Skript ✅, gemerkt ✅

**Auffälligkeiten:**
1. 🔴 **Kritisch, abgefangen: Das Porsche-Logo wäre ein Lizenzverstoß gewesen.** Die Freigabe kam vom
   Autohaus, die Marke gehört der Porsche AG; deren Asset-Lizenz schließt Fremdnutzung ausdrücklich
   aus. Nur Link, Logo erst mit Datei und Nutzungsrecht vom Autohaus.
2. 🟠 **Hoch: riparo ist kein Autohaus.** Als Autohaus eingetragen, hätte es in der falschen Kachel
   gestanden; unter den Versicherern hätte es den Zähler „31" verfälscht. Eigene Liste.
3. 🟠 **Hoch: Der BVAT-Name war im Backlog zweimal falsch** — erst in der Kundenliste, dann in
   unserer Korrektur („… für …", aus einer Suchzusammenfassung statt aus dem Impressum). Jetzt am
   Impressum geprüft; alte Stellen korrigiert oder als Korrektur markiert.
4. 🟢 **Niedrig: Wortmarken standen doppelt da** (Logo „riparo" über dem Namen „riparo") → `logoIstName`.

**Referenzen:**
`components/PartnerEintrag.tsx`
`scripts/build-partner-logos.mjs`
`data/partners.ts`

### Phase 6 — Datenschutz
**Eingehalten**: Skill `rechtstexte-unternehmenswebsite` angewandt ✅, Quellen statt Gedächtnis ✅,
Erklärungstext bleibt bei R6 (Vorgabe User) ✅

**Auffälligkeit:**
1. 🟠 **Hoch: Die Schadenseite auf reparatur.info zeigt auf der Startansicht weder Datenschutz- noch
   Impressumslink**, obwohl die App beides je Betrieb unterstützt — und der Versand dorthin ist ab
   jetzt der Hauptweg für Schäden. Frage an André/PDR.cloud im Faktenblatt, AV-Vertrag ebenso.

### Phase 7 — Messen
**Eingehalten**: alle Werkzeuge gegen frischen Build ✅, Verhalten per Klick geprüft ✅

**Auffälligkeiten:**
1. 🟠 **Hoch, behoben: Die Formular-Vorauswahl hing an der Seite, nicht an der Karte.** Auf
   `/fahrzeugaufbereitung-leipzig` wählten alle fünf „Paket anfragen" dasselbe vor — mit den neuen
   Paketnamen (4.21) hätte nach Klick auf *Brillant Außenpflege* sichtbar **„Premiumpflege"** im
   Formular gestanden. Jetzt `data-leistung` je Karte, die Hub-Seite wählt nichts mehr vor.
   **Beleg:** 7/7 Klicktests. Gefunden beim Ansehen der Aufnahmen, nicht durch einen Wächter.
2. 🟡 **Mittel: Mein Aufnahmeskript lief in zwei Puppeteer-Fallen.** `clip` gilt in
   Dokumentkoordinaten; und `HALTE_SCROLL` stoppt über **ein** gemeinsames Flag — wer im selben
   Frame neu hält, lässt die alte Schleife weiterlaufen, zwei Schleifen kämpfen um die Position.
   `npm run shots` ist davon nicht betroffen (volle Aufnahmen, Pause zwischen den Schritten), die
   Hilfe ist aber zerbrechlich (Optimierungsplan 3).

---

**Offene Folgepunkte:** `2026-09-16-preise-partner-schadenlink-optimierung-tasks.md`
