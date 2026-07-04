# SEO- & KI-Suchmaschinenoptimierungs-Standards (SEO + GEO/AEO)

> **Zweck dieser Datei:** Verbindliches Referenz- und Regelwerk für den Aufbau und die Modernisierung von Websites mit Claude Code. Diese Standards gelten für **jedes** Projekt. Vor Projektstart werden nur die **Projekt-Variablen** (siehe Abschnitt 0) ausgefüllt – der Rest bleibt unverändert und wird bei jeder Seite angewendet.
>
> **Markt-Fokus:** Deutschland (Google.de, deutschsprachige Inhalte). Stand: 2025/2026.
>
> **Verwendung in Claude Code:** Diese Datei als `SEO-GEO-STANDARDS.md` im Projekt-Root ablegen und in der `CLAUDE.md` referenzieren (z. B. „Befolge bei allen HTML-, Content- und Meta-Aufgaben die Regeln aus `SEO-GEO-STANDARDS.md`.").

---

## 0. PROJEKT-VARIABLEN (pro Projekt ausfüllen)

> Diese Platzhalter werden zu Beginn jedes Projekts einmal gesetzt. Alle Regeln weiter unten beziehen sich auf diese Variablen.

```yaml
# --- Grunddaten ---
BRANCHE:                "KFZ – Unfallinstandsetzung, Karosserie & Lack, Fahrzeugaufbereitung (Schema-Typ: AutoRepair)"
LEISTUNGEN:             ["Unfallinstandsetzung", "Autoreparatur", "Fahrzeugaufbereitung / Autoaufbereitung", "Autolackierung", "Smart Repair", "Dellenentfernung", "Hagelschadenreparatur", "Felgenreparatur", "Leasingrückgabe-Vorbereitung", "Fuhrparkservice"]
UNTERNEHMENSNAME:       "CarCare Center Leipzig"                    # Marken-/Marketingname (Title-Marke, og:site_name); juristischer Name -> NAP_NAME
USP:                    "Leipzigs Full-Service-Center für Lackierung, Karosserie & Fahrzeugaufbereitung – Glasurit-Lackpartner & Meisterbetrieb mit farbtongenauer, makelloser Reparatur und kompletter Versicherungsabwicklung."
USP_ERWEITERT:          "Seit über 30 Jahren Ihr Premium-Partner in Leipzig für Fahrzeuglackierung, Karosserie-Instandsetzung und Aufbereitung. Als Glasurit-Lackpartner und Meisterbetrieb erzielen wir dank der weltweit präzisesten Farbtontechnologie makellose Reparaturen in Erstausrüster-Qualität – auf 3.000 qm, für alle Marken, inklusive kompletter Unfall- und Versicherungsabwicklung mit Ersatzfahrzeug."
USP_BAUSTEINE:                                                     # Vertrauens-/Differenzierungssignale für E-E-A-T und GEO
  - "Glasurit-Lackpartner → farbtongenaue, makellose Reparaturen, langlebiges Premium-Finish, umweltschonende Wasserbasislacke"
  - "Meisterbetrieb des Kfz-Lackierhandwerks, über 30 Jahre am Markt (seit 1993)"
  - "Full-Service auf 3.000 qm: Lackierung, Karosserie, Smart/Spot Repair, Felgen, Fahrzeugaufbereitung"
  - "Komplette Unfall- & Versicherungsabwicklung inkl. Kostenvoranschlag und Werkstattersatzfahrzeug"
  - "Erfahrung mit Privat-, Geschäfts- und Flottenkunden (Autohäuser, Firmenfuhrparks)"

# --- Reichweite: Sonderfall – LOKAL primär, NATIONAL sekundär (siehe Modus-Notiz unter dem Block) ---
MODUS:                  "LOKAL"

# --- LOKAL (primär) ---
STANDORT_STADT:         "Leipzig"
STANDORT_REGION:        "Großraum Leipzig / Umland bis ca. 50 km"   # Kernstadt Leipzig (Sachsen) + Umland
EINZUGSGEBIET:                                                     # Basis für areaServed (Schema) + natürliche Textnennung – KEINE eigenen Orts-Landingpages (siehe Leitplanke unter dem Block)
  KERNSTADT_LEIPZIG_STADTTEILE:  ["Zentrum", "Zentrum-Südost", "Plagwitz", "Lindenau", "Gohlis", "Connewitz", "Reudnitz", "Grünau", "Paunsdorf", "Stötteritz", "Schleußig", "Südvorstadt"]
  UMLAND_BIS_CA_50KM:            ["Markkleeberg", "Schkeuditz", "Taucha", "Markranstädt", "Zwenkau", "Borna", "Grimma", "Wurzen", "Delitzsch", "Eilenburg", "Halle (Saale)"]
NAP_NAME:               "BS CarCare GmbH"                           # exakter Firmenname laut Impressum/legalName
NAP_ADRESSE:            "An den Tierkliniken 42, 04103 Leipzig"
NAP_TELEFON:            "+49 341 261 77 90"                         # einheitlich im Code (Anzeige "0341 - 261 77 90", tel:+493412617790)

# --- NATIONAL (sekundär, B2B/Fuhrpark) ---
ZIELGRUPPE:             "Geschäftskunden / B2B: Autohäuser, Fuhrparks, Versicherungen, Versicherungsagenturen"
LIEFER_SERVICEGEBIET:   "⚠️ ZU PRÜFEN"                             # überregionale B2B-Ausrichtung vorhanden, konkretes Servicegebiet (bundesweit / DACH / Mitteldeutschland) nicht im Code definiert

# --- Sprache & Tonalität ---
SPRACHE:                "de-DE"                                     # <html lang="de">, og:locale de_DE, inLanguage de-DE
ANSPRACHE:              "Sie"                                       # durchgängig formell in Content & FAQ
```

> **📌 Modus-Notiz (projektspezifisch):** Primär **LOKAL** (Leipzig); sekundär **NATIONAL** für B2B/Fuhrpark. Das Fundament bleibt lokal (Standort Leipzig, lokale Sichtbarkeit, Google Business Profile, Bewertungen). **Bei Seiten für Geschäftskunden/Fuhrpark gelten zusätzlich die NATIONAL-Regeln aus Abschnitt 6.2.**

> **📍 LOKALE SEITEN-REGEL (verbindlich):** Für Leipziger Stadtteile und Umlandorte werden **KEINE** eigenen Orts-Landingpages erstellt. Orte werden ausschließlich über `areaServed` (Schema) und natürliche Textnennung abgedeckt. Eine eigene Orts-/Stadtteilseite darf **NUR** angelegt werden, wenn ein echter, belegbarer Bezug besteht (physischer Standort, konkretes Leistungsangebot vor Ort oder dokumentierte Referenzprojekte). Ohne diesen Bezug bleibt der Ort außerhalb des Scopes (Vermeidung von Doorway Pages / Thin Content).

---

## 1. GRUNDPRINZIP: SEO UND GEO ZUSAMMEN DENKEN

Klassisches SEO (Sichtbarkeit in den blauen Google-Links) und GEO/AEO (Sichtbarkeit/Zitierung in KI-Antworten wie Google AI Overviews, AI Mode, ChatGPT, Perplexity, Gemini) haben **eine gemeinsame Basis**: technisch sauber crawlbare Seiten, klare Struktur, echte Fachautorität (E-E-A-T) und Inhalte, die eine konkrete Frage vollständig beantworten.

**Merksatz für jede Seite:** *Was ist die eine Suchanfrage/Frage, die diese Seite besser beantwortet als jede andere?* Wenn diese Frage nicht in einem Satz beantwortbar ist, ist die Seite nicht fokussiert genug.

**Wichtige Realität 2025/2026:** KI-Antworten (AI Overviews) reduzieren nachweislich die Klickrate auf klassische Ergebnisse. Sichtbarkeit bedeutet daher zunehmend *auch* „in der KI-Antwort genannt/zitiert werden", nicht nur „auf Platz 1 ranken". Beide Ziele werden parallel verfolgt.

---

## 2. TECHNISCHE STANDARDS (gelten für JEDE Seite)

> Diese Regeln sind nicht verhandelbar und bilden das Fundament für SEO **und** KI-Crawlbarkeit.

### 2.1 Rendering & Crawlbarkeit
- [ ] **Server-side Rendering (SSR) oder statisches HTML** für alle indexierbaren Inhalte. Kritische Inhalte dürfen **nicht** ausschließlich per Client-side-JavaScript geladen werden – viele KI-Crawler rendern kein oder nur eingeschränkt JavaScript.
- [ ] Jeder Inhalt, der in Suche/KI erscheinen soll, ist **im initialen HTML** vorhanden.
- [ ] Saubere, sprechende URLs: Kleinschreibung, Bindestriche, keine Parameter-Wüsten. Struktur spiegelt die Seitenhierarchie.
- [ ] Eine `robots.txt` im Root, die Crawling erlaubt und auf die Sitemap verweist. Wichtige KI-Crawler (u. a. `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `Google-Extended`, `ClaudeBot`) **nicht** pauschal blockieren, wenn KI-Sichtbarkeit gewünscht ist.
- [ ] `XML-Sitemap` automatisch generiert, alle relevanten URLs enthalten, in `robots.txt` und Search Console hinterlegt.
- [ ] Pro Seite genau **ein** `<link rel="canonical">` auf die bevorzugte URL.
- [ ] Keine verwaisten Seiten – jede wichtige Seite ist intern verlinkt (siehe 4.4).

### 2.2 Core Web Vitals & Performance (Ziele)
- [ ] **LCP (Largest Contentful Paint):** < 2,5 s
- [ ] **INP (Interaction to Next Paint):** < 200 ms
- [ ] **CLS (Cumulative Layout Shift):** < 0,1
- [ ] Bilder: modernes Format (WebP/AVIF), responsive `srcset`, `loading="lazy"` für below-the-fold, **explizite `width`/`height`** gegen Layout-Shift.
- [ ] Kritisches CSS inline, nicht-kritische Skripte `defer`/`async`.
- [ ] Fonts: `font-display: swap`, self-hosted oder vorab geladen.

### 2.3 Mobile-First (Pflicht)
- [ ] Vollständig responsives Layout; Google indexiert mobil-first.
- [ ] Klickziele ≥ 48 px, kein horizontales Scrollen, lesbare Schriftgrößen ohne Zoom.
- [ ] Telefonnummer als klickbarer `tel:`-Link (kritisch für lokale/mobile Nutzer).

### 2.4 Sicherheit & Basis
- [ ] HTTPS erzwungen (HTTP → HTTPS Redirect).
- [ ] `<html lang="de-DE">` gesetzt.
- [ ] Korrektes `<meta charset="utf-8">` und `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- [ ] 404-Seite mit sinnvoller Navigation; korrekte HTTP-Statuscodes (301 für dauerhafte Redirects).

---

## 3. PRO-SEITE META- & AUSZEICHNUNGS-STANDARDS

> Für **jede** einzelne Seite anzuwenden.

### 3.1 Title & Meta Description
- [ ] **`<title>`:** ca. 50–60 Zeichen, wichtigstes Keyword vorne, Marke am Ende.
  - LOKAL: Muster `{{Leistung}} in {{STANDORT_STADT}} | {{UNTERNEHMENSNAME}}`
  - NATIONAL: Muster `{{Leistung}} für {{ZIELGRUPPE}} | {{UNTERNEHMENSNAME}}`
- [ ] **`<meta name="description">`:** ca. 140–160 Zeichen, aktiver Nutzen + Handlungsaufforderung, enthält Hauptkeyword natürlich.
- [ ] Jede Seite hat **einzigartige** Title/Description – keine Duplikate.

### 3.2 Heading-Struktur
- [ ] Genau **eine `<h1>`** pro Seite, die das Seitenthema klar benennt.
- [ ] Logische Hierarchie `h1 → h2 → h3` ohne Ebenen-Sprünge.
- [ ] Überschriften formulieren, wo sinnvoll, **echte Nutzerfragen** (gut für Featured Snippets **und** KI-Extraktion), z. B. „Was kostet …?", „Wie läuft … ab?".

### 3.3 Bilder
- [ ] Aussagekräftige Dateinamen (`stossstange-lackieren-vorher.webp` statt `IMG_1234.webp`).
- [ ] `alt`-Text beschreibt den Bildinhalt konkret und enthält, wo natürlich, relevante Begriffe.

### 3.4 Social/Open Graph
- [ ] `og:title`, `og:description`, `og:image`, `og:type`, `og:url` gesetzt.
- [ ] `twitter:card` (summary_large_image) gesetzt.

---

## 4. CONTENT-STANDARDS (SEO + GEO gemeinsam)

### 4.1 Suchintention zuerst
Jede Seite bedient **genau eine** dominante Suchintention:
- **Informational** (Ratgeber, „Wie/Was/Warum") → ausführlicher, erklärender Content.
- **Kommerziell/Transaktional** (Leistungsseiten, „X in {{Stadt}}", „X beauftragen") → klare Leistung, Nutzen, Ablauf, CTA.
- **Navigational** (Marke, Kontakt) → schnell, direkt.

> Keine Vermischung: Eine Leistungsseite ist keine Ratgeberseite. Für Ratgeberthemen eigene Seiten anlegen (stärkt Themenautorität und liefert KI-zitierbare Antworten).

### 4.2 E-E-A-T sichtbar machen (Experience, Expertise, Authoritativeness, Trustworthiness)
Auf der Website konkret umsetzen:
- [ ] **Experience/Expertise:** echte Referenzen, Vorher-Nachher-Belege, Fallbeispiele, konkrete Prozessbeschreibungen, Qualifikationen/Meisterbetrieb/Zertifikate.
- [ ] **Authoritativeness:** klare Marke, konsistente Nennung, ggf. Auszeichnungen/Partnerschaften/Herstellerzertifizierungen.
- [ ] **Trustworthiness:** vollständiges Impressum, Datenschutz, echte Kontaktdaten, transparente Preis-/Ablaufinfos, echte Kundenbewertungen.
- [ ] **Autor/Verantwortlichkeit:** Inhalte einem realen Betrieb/Verantwortlichen zuordenbar (Über-uns, Team, Ansprechpartner).

### 4.3 GEO/AEO – Inhalte für KI-Antworten zitierbar machen
> Ziel: In AI Overviews, ChatGPT, Perplexity & Co. **genannt und zitiert** werden. KI-Systeme bevorzugen Inhalte, die eine Frage **direkt, eigenständig und faktenbasiert** beantworten.

- [ ] **Antwort-zuerst-Prinzip:** Die Kernantwort steht in den ersten 1–2 Sätzen eines Abschnitts; Begründung/Details folgen danach. (Erhöht Extrahierbarkeit.)
- [ ] **Frage-Antwort-Blöcke / FAQ:** Reale Kundenfragen als Überschrift, darunter eine **eigenständig verständliche** Antwort (funktioniert auch aus dem Kontext gerissen).
- [ ] **Konkrete Fakten statt Marketing-Floskeln:** Zahlen, Zeitangaben, Preisrahmen, Materialien, Schritte, Bedingungen. KI zitiert Konkretes, keine Werbeadjektive.
- [ ] **Selbst-erklärende Absätze:** Jeder Absatz ist auch ohne Nachbarabsätze verständlich (KI extrahiert oft einzelne Passagen).
- [ ] **Klare Struktur:** kurze Absätze, sinnvolle Zwischenüberschriften, wo passend Aufzählungen und Vergleichstabellen (z. B. „Smart Repair vs. klassische Reparatur").
- [ ] **Eindeutige Entitäten:** Leistungen, Orte, Marke und Fachbegriffe klar und konsistent benennen (hilft KI, den Kontext korrekt zuzuordnen).
- [ ] **Aktualität signalisieren:** Datum „zuletzt aktualisiert" pflegen; veraltete Angaben (Preise, Verfahren) aktiv aktualisieren.

### 4.4 Interne Verlinkung & Themen-Architektur
- [ ] **Themencluster-Modell:** zentrale Leistungsseite (Pillar) + unterstützende Ratgeber-/Detailseiten, untereinander verlinkt.
- [ ] Beschreibende Ankertexte (kein „hier klicken").
- [ ] Jede neue Seite von thematisch passenden Bestandsseiten verlinken; wichtige Seiten aus der Hauptnavigation erreichbar.

### 4.5 Qualität & Originalität
- [ ] Kein dünner/duplizierter Inhalt; jede Seite bietet eigenständigen Mehrwert.
- [ ] Keine reinen KI-Textwüsten ohne Substanz – Fakten, Beispiele und echte Fachtiefe sind Pflicht (Helpful-Content-Prinzip).
- [ ] Rechtschreibung/Grammatik sauber (Vertrauenssignal für Nutzer **und** Bewertung).

---

## 5. STRUKTURIERTE DATEN (Schema.org, JSON-LD)

> Als **JSON-LD** im `<head>` oder am Seitenende einbetten. Nur auszeichnen, was auf der Seite auch sichtbar ist. Mit dem Rich-Results-Test validieren.

### 5.1 Immer (jede Website)
- [ ] `Organization` **oder** – bei lokalem Bezug – die passende `LocalBusiness`-Subklasse (siehe 5.2).
- [ ] `WebSite` (mit `name`, `url`).
- [ ] `BreadcrumbList` auf Unterseiten.

### 5.2 Bei MODUS = LOKAL zusätzlich
- [ ] `LocalBusiness` bzw. passende Unterklasse (z. B. `AutoRepair` / `AutoBodyShop` bei KFZ) mit:
  - `name` = `{{NAP_NAME}}`, `address` (PostalAddress) = `{{NAP_ADRESSE}}`, `telephone` = `{{NAP_TELEFON}}`
  - `geo` (Längen-/Breitengrad), `openingHoursSpecification`, `areaServed` (= `EINZUGSGEBIET`), `url`, `image`, `priceRange`
  - **Exakte NAP-Konsistenz** mit Google Business Profile und Impressum (identische Schreibweise!).
- [ ] `Service` je Kernleistung (mit `serviceType`, `provider`, `areaServed`).

### 5.3 Kontextabhängig (wo zutreffend und sichtbar)
- [ ] `FAQPage` für echte FAQ-Blöcke (unterstützt Rich Results **und** KI-Extraktion).
- [ ] `Review` / `AggregateRating` nur bei echten, auf der Seite dargestellten Bewertungen (Richtlinien beachten).
- [ ] `BlogPosting`/`Article` für Ratgeberinhalte (mit `author`, `datePublished`, `dateModified`).
- [ ] `Product` nur bei echten Produkten.

---

## 6. MODUS-SPEZIFISCHE STANDARDS

### 6.1 Wenn MODUS = LOKAL
> Größter Hebel: lokale Sichtbarkeit + Vertrauen. Google Business Profile ist oft wichtiger als die Website selbst – die Website unterstützt und bestätigt es.

- [ ] **NAP-Konsistenz überall identisch:** Website (Impressum, Footer, Kontakt), Schema, Google Business Profile, Branchenverzeichnisse.
- [ ] **Kontakt/Standort prominent:** Adresse + `tel:`-Link im Footer jeder Seite; eingebettete Karte auf der Kontaktseite.
- [ ] **Lokale Landingpages:** je Kernleistung eine Seite mit lokalem Bezug (`{{Leistung}} in {{STANDORT_STADT}}`); bei mehreren Orten je Ort eine **eigenständige, inhaltlich einzigartige** Seite (keine Copy-Paste-Dopplung).
- [ ] **Lokale Keywords** natürlich einbauen: `{{Leistung}} {{STANDORT_STADT}}`, „… in der Nähe", `{{Leistung}} {{STANDORT_REGION}}`.
- [ ] **Bewertungen einbinden/verlinken** (echte Google-Bewertungen); Prozess zur Bewertungsgewinnung etablieren (QR/Link nach Auftrag). Bewertungen sind in vertrauensintensiven Branchen ein zentraler Ranking- **und** KI-Empfehlungsfaktor.
- [ ] **Lokale Relevanzsignale:** Erwähnung von Stadtteilen/Nachbarorten, lokale Referenzprojekte, ggf. lokale Kooperationen/Verlinkungen.
- [ ] **`areaServed`** im Schema sauber pflegen.
- [ ] **Konsistenz mit relevanten Branchen-/Regionalverzeichnissen** (einheitliche NAP-Daten).

### 6.2 Wenn MODUS = NATIONAL
> Größter Hebel: Themenautorität, Skalierung über Content, Vertrauen ohne lokalen Anker.

- [ ] **Themenautorität aufbauen:** umfassende Pillar-Seiten je Kernthema + tiefe Ratgebercluster; Ziel ist Autorität für die gesamte `{{BRANCHE}}`.
- [ ] **Zielgruppen-/Use-Case-Seiten** statt Ortsseiten (z. B. nach `{{ZIELGRUPPE}}`, Branche, Anwendungsfall).
- [ ] **Servicegebiet klar kommunizieren** (`{{LIEFER_SERVICEGEBIET}}`) in Content und Schema (`areaServed` = Region/Land).
- [ ] **Vertrauens-/Autoritätssignale ohne Lokalbezug:** Referenzkunden, Fallstudien, Zahlen/Ergebnisse, Zertifizierungen, Prozessqualität, ggf. Presse.
- [ ] **Skalierbare, aber einzigartige Seiten:** bei vielen Leistungs-/Anwendungsseiten jede Seite eigenständig und substanziell (kein Template-Dünncontent).
- [ ] **Digital-PR/Backlinks** aus branchenrelevanten, thematisch passenden Quellen (Autorität statt Masse).

---

## 7. VERBINDLICHE ARBEITSANWEISUNGEN FÜR CLAUDE CODE

> Diese Regeln befolgt Claude Code bei **jeder** Seiten-Erstellung/Modernisierung in diesem Projekt.

1. **Vor dem Schreiben** prüfen: `MODUS` (LOKAL/NATIONAL) und die relevanten Projekt-Variablen aus Abschnitt 0 sind gesetzt. Fehlende Variablen erfragen, nicht raten.
2. **Jede Seite** erhält: genau eine `<h1>`, einzigartigen `<title>` (50–60 Z.) und `<meta description>` (140–160 Z.) nach den Mustern in 3.1, saubere Heading-Hierarchie, Open-Graph-Tags.
3. **Jede Seite** wird nach dem **Antwort-zuerst-Prinzip** (4.3) strukturiert und bedient genau **eine** Suchintention (4.1).
4. **Strukturierte Daten** (Abschnitt 5) als JSON-LD einbauen – abhängig von Seitentyp und `MODUS`. Nur Sichtbares auszeichnen.
5. **Technische Standards** (Abschnitt 2) einhalten: SSR/statisches HTML für Inhalte, Core-Web-Vitals-Ziele, Mobile-First, `tel:`-Links, valide `robots.txt` + Sitemap.
6. **Interne Verlinkung** (4.4) aktiv setzen: neue Seite ins Themencluster einbinden, beschreibende Ankertexte.
7. **Bei LOKAL:** NAP exakt konsistent (Website ↔ Schema ↔ Impressum); lokale Landingpage-Muster und `areaServed` anwenden.
8. **Bei NATIONAL:** Zielgruppen-/Use-Case-Struktur und `{{LIEFER_SERVICEGEBIET}}` im Content und Schema abbilden.
9. **Keine** Marketing-Floskeln ohne Substanz – Fakten, Zahlen, Abläufe, echte Fachtiefe (4.5, E-E-A-T).
10. **Nach Fertigstellung** eine kurze Selbstprüfung anhand der Checkliste in Abschnitt 8 ausgeben.
11. **KI-Crawler nicht versehentlich blockieren**, wenn KI-Sichtbarkeit gewünscht ist (2.1).
12. **Sprache/Ansprache** gemäß `SPRACHE` und `ANSPRACHE` konsistent halten.

---

## 8. QUALITÄTS-CHECKLISTE PRO SEITE (Abschlussprüfung)

**Technik**
- [ ] Inhalt im initialen HTML (SSR/statisch), crawlbar
- [ ] Core Web Vitals im Zielbereich (LCP/INP/CLS)
- [ ] Mobil einwandfrei, `tel:`-Link klickbar
- [ ] Canonical, in Sitemap, intern verlinkt

**Meta & Struktur**
- [ ] Einzigartiger Title (50–60 Z.) nach Muster
- [ ] Meta Description (140–160 Z.) mit CTA
- [ ] Genau eine `<h1>`, saubere Hierarchie
- [ ] Open-Graph-Tags gesetzt
- [ ] Bild-Dateinamen + `alt`-Texte aussagekräftig

**Content & GEO**
- [ ] Genau eine Suchintention bedient
- [ ] Antwort-zuerst-Prinzip umgesetzt
- [ ] Reale Fragen als Überschriften, eigenständig verständliche Antworten
- [ ] Konkrete Fakten/Zahlen/Abläufe statt Floskeln
- [ ] E-E-A-T-Signale sichtbar (Referenzen, Qualifikation, Vertrauen)
- [ ] „Zuletzt aktualisiert" gepflegt

**Strukturierte Daten**
- [ ] Passendes Schema als JSON-LD (Organization/LocalBusiness, Service, ggf. FAQPage/Article)
- [ ] Nur Sichtbares ausgezeichnet, validiert

**Modus**
- [ ] LOKAL: NAP exakt konsistent, `areaServed`, lokale Landingpage-Logik
- [ ] NATIONAL: Zielgruppen-/Use-Case-Struktur, Servicegebiet klar

---

## 9. HINWEISE ZUR EINORDNUNG (Etabliert vs. Experimentell)

- **Etabliert/bewährt:** technisches SEO, Core Web Vitals, Mobile-First, saubere Meta-/Heading-Struktur, E-E-A-T, hochwertige Inhalte, interne Verlinkung, `LocalBusiness`-Schema, NAP-Konsistenz, Bewertungen im lokalen Kontext. Diese Faktoren sind langfristig stabil und sollten kompromisslos umgesetzt werden.
- **Neu/in Entwicklung:** GEO/AEO-Optimierung für KI-Antwortmaschinen entwickelt sich schnell. Das **Antwort-zuerst-Prinzip**, Frage-Antwort-Strukturen und faktenbasierte Zitierbarkeit sind sinnvoll und risikoarm (sie helfen auch klassischem SEO). Spezielle KI-Crawler-Standards (z. B. neue Dateiformate/Direktiven für LLMs) sind **noch nicht einheitlich etabliert** – optional umsetzbar, aber nicht als Ersatz für die Fundamente behandeln.
- **Grundsatz:** Zuerst die Fundamente (Abschnitte 2–5) perfektionieren, dann GEO-Feinschliff (4.3). Bei Konflikten hat Nutzerfreundlichkeit + echte Substanz immer Vorrang vor Taktik.

---

*Diese Datei ist die verbindliche Datengrundlage für alle SEO-/GEO-Entscheidungen in diesem Projekt. Bei jeder neuen Seite gelten diese Standards automatisch; projektindividuell wird ausschließlich Abschnitt 0 angepasst.*
