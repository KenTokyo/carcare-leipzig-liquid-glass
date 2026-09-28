# Aufbereitung: Zusatzleistungen im Formular und einheitliche Preiskacheln

**Auftrag (User, 2026-09-28), nach Andrés Mail vom selben Tag:**
1. Alle Zusatzleistungen im Anfrageformular auswählbar. André liefert noch saubere Beschreibungen der Pakete; daraus
   folgt, welche Zusatzleistung zu welcher gewählten Leistung **ausgegraut** wird.
2. Angebotskacheln (Keramik 849 €, Nano 299 €) auf `/aussenaufbereitung-leipzig`; Preise und Beschreibungen auch unter den
   „Exklusivleistungen“. Einheitliche Kacheln mit Beschreibung und Preis wie auf `/fahrzeugaufbereitung-leipzig`, direkt
   anfragbar. **Übersicht: alle Aufbereitungsleistungen. Außen- und Innenseite: nur die zugeordneten Kacheln.**

**Quelle der Preise (Mail André, 2026-09-28):** Felgenintensivreinigung 95,20 € · Cabrio-Verdeckimprägnierung 99 € ·
Motorreinigung 49 € · Keramikversiegelung 849 € · Nanoversiegelung 299 € · Frontscheibenversiegelung 89 €. Bestand:
Ozonbehandlung 45 € · Heißvernebelung 59 €.
**Bezug:** Backlog **5.20** (✅), **2.11** (✅), 1.8 und 1.9 (Exklusivleistungen), 1.10 (Desinfektion direkt unter den Paketen).
**Branch:** `2026-09-27-schleife-5-paket-1` (Paket 1 ist noch nicht committet; die Dateien überschneiden sich)

---

### ✅ Phase 1 — Eine Quelle für alle Zusatzleistungen
**Ziel:** Formular, Kacheln, Schema und Mail lesen dieselbe Liste; keine zweite Preisangabe irgendwo.
* [x] `data/zusatzleistungen.ts`: acht Einträge mit Preis, Kacheltext und Ausgrau-Regeln (`nichtMit` mit sichtbarem Grund),
      dazu `sperrgrund()` und `bereinigteZusaetze()`; Platzhalter „Zusatzleistung 1/2“ weg. Ohne Laufzeit-Importe (der
      Platzhalter-Wächter führt die Datei aus)
* [x] `data/detailing.ts`: Kacheln aus der Liste abgeleitet (`zusatzAngebote`, `disinfectionServices`); Zuordnung an einer
      Stelle: `angeboteAussen`, `angeboteInnen`; `zusatzPreis()`/`paketPreis()` für Fließtext mit geschützten Leerzeichen
* [x] Schema: `schemaAngebote()` leitet die Angebote aus genau den Kacheln einer Seite ab — die handgeschriebene Zweitliste
      `priceOffers` mit eigenen Kurztexten ist entfallen
* [x] `check-dummies`: zwei anerkannte Platzhalter-Zeilen entfernt (Wächter meldet jetzt 8 echte Einträge, 5 statt 7 Platzhalter)
* [x] `data/anfrageSchema.ts`: Mail nennt Zusatzleistungen mit Preis; Build bricht, wenn eine ID zugleich Leistung und
      Zusatzleistung wäre (gemeinsamer Vorauswahlwert)
**Lösungswege:** (a) Zusatzleistungen zusätzlich als dritte Liste in `detailing.ts` — zweite Quelle für Namen und Preise ·
(b) ✔ eine Liste in `data/zusatzleistungen.ts`, alles andere leitet ab
**Referenzen:**
`data/zusatzleistungen.ts`
`data/detailing.ts`
`data/anfrageSchema.ts`

### ✅ Phase 2 — Formular: alle Zusatzleistungen, Ausgrauen, Vorauswahl aus der Kachel
* [x] Aufklappliste (`<details>`, im Meeting vereinbart: „bei vielen Einträgen wird es eine Aufklappliste“), Preis je
      Eintrag, Zusammenfassung „Gewählt: …“; offen, wenn schon etwas gewählt ist
* [x] Ausgrauen aus den Daten: Kästchen gesperrt, Grund sichtbar. **Aktiv sind zwei Regeln, die der Seitentext trägt:**
      Motorreinigung bei Premiumpflege („inklusive Motorreinigung“) und Keramik oder Nano („Keramik- oder Nanoversiegelung“).
      Der Rest folgt mit Andrés Paketbeschreibungen, je Regel eine Zeile
* [x] Wechsel der Leistung wählt unpassende Zusatzleistungen ab (nichts Gesperrtes wird mitgeschickt)
* [x] Kachel-Klick hakt die Zusatzleistung an (gleicher Vorauswahlweg wie bei den Paketen, `startwerte`)
* [x] Mail: „Keramikversiegelung (849,00 €)“ usw.
**Lösungswege Vorauswahl:** (a) zweites Datenattribut und zweiter Parameter durch Dialog und Formular · (b) ✔ ein
Vorauswahlwert für beides, eindeutige IDs, Kollision bricht den Build
**Referenzen:**
`components/formulare/TerminFelder.tsx`
`components/RequestForm.tsx`

### ✅ Phase 3 — Kacheln auf den drei Seiten
* [x] Übersicht: neue Sektion „Exklusiv- und Zusatzleistungen“ (6 Kacheln) hinter der Desinfektion — 1.10 bleibt erfüllt;
      zusammen **13 Kacheln = alle Aufbereitungsleistungen**
* [x] Außen: „Pakete & Preise“ oben (Brillant Außenpflege, Lackaufbereitung) + „Exklusiv- und Zusatzleistungen“ als 6 Kacheln
      statt dreier Namen. „Lackbausteine“ entfallen (nie Text oder Preis, nicht in Andrés Liste) → Rückfrage
* [x] Innen: „Paket & Preis“ oben (Intensiv Innenraumreinigung, volle Breite) + Ozon/Heißvernebelung, jetzt mit Vorauswahl;
      Exklusivleistungen (Alcantara, Tornador) unverändert — dazu gibt es weder Text noch Preis
* [x] Kombinierte Pakete (Premiumpflege, „exklusiv“) nur auf der Übersicht; beide Unterseiten verlinken darauf
* [x] `OfferCatalog` je Seite aus genau den sichtbaren Kacheln: Übersicht 13/13, Außen 8/8, Innen 3/3 (am Build gezählt)
* [x] FAQ: Außen „Was kosten Keramik- und Nanoversiegelung?“ (neu), Innen „Ist die Motorreinigung enthalten?“ (49 € ergänzt),
      Innen-Liste „Motorreinigung“ angepasst
**Referenzen:**
`pages/AussenaufbereitungPage.tsx`
`pages/InnenaufbereitungPage.tsx`
`pages/VehicleDetailingPage.tsx`

### ✅ Phase 4 — Prüfen und Doku
* [x] `tsc`, Build mit allen Wächtern grün (29/29, FAQ-Schema 238 Texte, Platzhalter-Wächter ok), `meta` 0/29 außerhalb
* [x] Funktionstest im Browser am Build **14/14**: 8 Einträge, Aufklappliste offen bei Vorauswahl, Keramik-Kachel hakt Keramik
      an (Leistung bleibt offen), Nano gesperrt mit Grund, Motorreinigung wird bei Premiumpflege abgewählt und gesperrt und ist
      danach bei Brillant Außenpflege wieder wählbar, Ozon-Kachel hakt Ozon an, Paketkachel wählt ihr Paket — Desktop und mobil
* [x] Versandtest mit abgefangener Mail **5/5** (Klartext mit Preis, Cent-Betrag, ohne Auswahl kein Abschnitt, Fehlwert → 400)
* [x] Kontrast der Formulartexte im Dialog gezielt gemessen (der Messer öffnet keine Dialoge): **5,55–17,43:1**
* [x] Sichtprüfung: Übersicht, Außen (Preise, Exklusiv; Desktop, mobil), Innen, Formular (Keramik vorgewählt, Premiumpflege)
* [x] Backlog: 5.20 ✅, 2.11 ✅, 1.8/1.9 Notiz; offen gezählt 55 → **53**
* [x] `npm run kontrast` voll: erster Lauf **7 Meldungen**, alle an Preisplaketten der unteren neuen Kacheln (Schwarz als Grau
      gemessen) — die Kacheln blendeten noch ein. Messer um eine Nachmessung ergänzt (Falle 9, O8), positiv und negativ
      getestet; danach **3 Volläufe mit 0 Stellen unter AA** (5.448–5.449 Textstellen)
* [x] `npm run bilder`: 126 Stellen, keine neue und keine geänderte Nummer (die Kacheln tragen keine Bilder), Exit 0
* [x] Klickziele der Kästchen-Karten auf 48 px (O4), Funktionstest danach erneut 14/14

---

## Kommentare

### Phasen 1–4
**Eingehalten**: Planung vor Code ✅, eine Quelle für Name/Preis/Text/Regel ✅, Schema = sichtbare Kacheln (gezählt) ✅,
keine erfundenen Fakten (nur, was die Seite belegt; keine Haltbarkeit, keine Marken) ✅, neue Texte ohne Gedankenstriche
(Andrés Wunsch) ✅, erste Person Plural / „Sie“ ✅, Mobile-First (Formular und Kacheln bei 390 px geprüft) ✅, 48-px-Ziel der
Aufklappliste ✅, alle Dateien unter 700 Zeilen (größte: `RequestForm.tsx` 397) ✅, kein `npm run dev` ✅, UTF-8 ✅

**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — FAQ-Wächter las `&nbsp;` nicht als Leerzeichen**: Eine sichtbare Antwort mit geschütztem Leerzeichen galt
   als „nicht ausgeliefert“ und brach den Build. Chrome schreibt U+00A0 beim Vorrendern als Entität. ✅ **fixed** (eine Zeile
   in `check-faq-html.mjs`, begründet im Kopf der Stelle; versteckter Text fällt weiter durch).
2. 🟢 **Niedrig — angehakte Karte im Formular halbtransparent** (`bg-blue-600/5`): Im gläsernen Dialog schien die Preisplakette
   der Seite durch. ✅ **fixed** (deckendes `bg-blue-50`).
3. 🟢 **Niedrig — „Frontscheibenversiegelung“ drückte den Preis über den Rand**. ✅ **fixed** (Silbentrennung im Namen).
4. 🟢 **Niedrig — Preis im Fließtext brach zwischen Betrag und „€“ um** (mobil). ✅ **fixed** für alle neuen Stellen
   (geschützte Leerzeichen in `zusatzPreis`/`paketPreis`). Ältere Fließtexte mit Preisen haben das noch → Optimierung.
5. 🟢 **Niedrig — handgeschriebene Schema-Zweitliste `priceOffers`**. ✅ **fixed** (abgeleitet).
6. 🟡 **Mittel — Kontrastmesser meldete Einblendungen als Mängel** (7 Fehlalarme, zeitabhängig: der nächste Lauf war
   sauber). Ein Wächter, der mal meldet und mal nicht, wird ignoriert. ✅ **fixed** (Nachmessung, O8).
7. 🟢 **Niedrig — Klickziele der Kästchen-Karten unter 48 px** (vorbestehend). ✅ **fixed** (O4).

**Offen, braucht André (nicht raten):** Ausgrau-Regeln über die zwei aktiven hinaus · Keramik/Nano als Festpreis ohne „ab“
(wie geliefert — gilt der Fahrzeugklassen-Aufpreis dort nicht?) · Ist die Brillant Außenpflege im Keramikpreis enthalten? ·
„Lackbausteine“ (Außen) und Alcantara/Tornador (Innen): Text und Preis · Kacheltexte der sechs neuen Leistungen bestätigen.

**Refactoring-Empfehlung:** `docs/aufbereitung-zusatzleistungen/tasks/2026-09-28-zusatzleistungen-kacheln-optimierung-tasks.md`
